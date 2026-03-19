import { ParcelSize, ParcelStatus, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  parcelCreateInputSchema,
  personalInfoSchema,
} from "~/helpers/dbSchemas";
import { db } from "~/server/db";
import {
  adminProcedure,
  courierProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

const parcelListQuerySchema = z.object({
  trackingNumber: z.string().optional(),
  status: z.nativeEnum(ParcelStatus).optional(),
  size: z.nativeEnum(ParcelSize).optional(),
  originId: z.string().optional(),
  destinationId: z.string().optional(),
});

const parcelListInputSchema = z.object({
  size: z.number().optional().default(10),
  page: z.number().optional().default(1),
  query: parcelListQuerySchema.optional().default({}),
});

const parcelLocationFilterInputSchema = z.object({
  query: parcelListQuerySchema.optional().default({}),
});

const locationSelect = Prisma.validator<Prisma.AddressSelect>()({
  id: true,
  addressName: true,
  street: true,
  city: true,
  parcelMachine: {
    select: { name: true },
  },
});

type ParcelLocation = Prisma.AddressGetPayload<{
  select: typeof locationSelect;
}>;

type FilterLocationOption = {
  id: string;
  ids: string[];
  label: string;
};

const formatLocationLabel = (location: ParcelLocation) => {
  const title = location.parcelMachine?.name ?? location.addressName;
  const address = `${location.street}, ${location.city}`;

  return title ? `${title}: ${address}` : address;
};

const getLocationOptions = (locations: ParcelLocation[]): FilterLocationOption[] => {
  const uniqueLocations = new Map<string, FilterLocationOption>();

  locations.forEach((location) => {
    const label = formatLocationLabel(location);
    const existingLocation = uniqueLocations.get(label);

    if (existingLocation) {
      existingLocation.ids.push(location.id);
      return;
    }

    uniqueLocations.set(label, {
      id: location.id,
      ids: [location.id],
      label,
    });
  });

  return [...uniqueLocations.values()].sort((left, right) =>
    left.label.localeCompare(right.label),
  );
};

const getMatchingLocationIds = async (locationId: string) => {
  const location = await db.address.findUnique({
    where: { id: locationId },
    select: locationSelect,
  });

  if (!location) return [locationId];

  const candidateLocations = await db.address.findMany({
    where: {
      street: location.street,
      city: location.city,
    },
    select: locationSelect,
  });

  const targetLabel = formatLocationLabel(location);

  return candidateLocations
    .filter((candidateLocation) => formatLocationLabel(candidateLocation) === targetLabel)
    .map((candidateLocation) => candidateLocation.id);
};

const buildParcelLocationWhere = async (
  query: z.infer<typeof parcelListQuerySchema>,
): Promise<Prisma.ParcelWhereInput> => {
  const [originIds, destinationIds] = await Promise.all([
    query.originId ? getMatchingLocationIds(query.originId) : undefined,
    query.destinationId ? getMatchingLocationIds(query.destinationId) : undefined,
  ]);

  return {
    ...(query.trackingNumber && { trackingNumber: query.trackingNumber }),
    ...(query.status && { status: query.status }),
    ...(query.size && { size: query.size }),
    ...(originIds && { originId: { in: originIds } }),
    ...(destinationIds && { destinationId: { in: destinationIds } }),
  };
};

const omitLocationFilter = (
  query: z.infer<typeof parcelListQuerySchema>,
  key: "originId" | "destinationId",
) => {
  return {
    ...query,
    [key]: undefined,
  };
};

const generateTrackingNumber = () => {
  const prefix = "SPOT";
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${randomPart}`.toUpperCase();
};

const checkIfAddressExists = async (
  id: string,
  message: string | undefined,
) => {
  const address = await db.address.findUnique({ where: { id } });
  if (!address) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: message ?? "Address not found",
    });
  }
};

export const parcelsRouter = createTRPCRouter({
  getAll: adminProcedure
    .input(
      z.object({
        size: z.number().optional().default(10),
        page: z.number().optional().default(1),
        query: z
          .object({
            trackingNumber: z.string().optional(),
            status: z.nativeEnum(ParcelStatus).optional(),
          })
          .optional()
          .default({}),
      }),
    )
    .query(async ({ input }) => {
      const parcels = await db.parcel.findMany({
        skip: input.size * (input.page - 1),
        take: input.size,
        where: input.query,
        select: {
          id: true,
          trackingNumber: true,
          status: true,
          createdAt: true,
          origin: {
            select: {
              parcelMachine: {
                select: { name: true },
              },

              id: true,
              street: true,
              city: true,
              postalCode: true,
              country: true,
            },
          },
          destination: {
            select: {
              parcelMachine: {
                select: { name: true },
              },

              id: true,
              street: true,
              city: true,
              postalCode: true,
              country: true,
            },
          },
          receiverContact: true,
          senderContact: true,
          updates: {
            select: { createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      const count = await db.parcel.count({ where: input.query });

      return { parcels, count };
    }),
  update: adminProcedure
    .input(
      z.object({
        ...personalInfoSchema.shape,
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      let originId = input.sender.address.id;
      let destinationId = input.receiver.address.id;
      let senderContactId = input.sender.contact.id;
      let receiverContactId = input.receiver.contact.id;

      if (!originId) {
        const originAddress = await db.address.create({
          data: {
            ...input.sender.address,
          },
        });
        originId = originAddress.id;
      }

      if (!destinationId) {
        const destinationAddress = await db.address.create({
          data: {
            ...input.receiver.address,
          },
        });
        destinationId = destinationAddress.id;
      }

      if (!senderContactId) {
        const senderContact = await db.contactInfo.create({
          data: {
            ...input.sender.contact,
          },
        });
        senderContactId = senderContact.id;
      }

      if (!receiverContactId) {
        const receiverContact = await db.contactInfo.create({
          data: {
            ...input.receiver.contact,
          },
        });
        receiverContactId = receiverContact.id;
      }
    }),
  getMy: protectedProcedure
    .input(parcelListInputSchema)
    .query(async ({ ctx, input }) => {
      const senderId = ctx.session.user.id;
      const where = await buildParcelLocationWhere(input.query);

      const parcels = await db.parcel.findMany({
        skip: input.size * (input.page - 1),
        take: input.size,
        where: { senderId, ...where },
        orderBy: { updatedAt: "desc" },
        select: {
          trackingNumber: true,
          status: true,
          createdAt: true,
          destination: {
            select: {
              parcelMachine: {
                select: { name: true },
              },

              street: true,
              city: true,
            },
          },
          updates: {
            select: { createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      const count = await db.parcel.count({
        where: { senderId, ...where },
      });

      return { parcels, count };
    }),
  getMyFilterLocations: protectedProcedure
    .input(parcelLocationFilterInputSchema)
    .query(async ({ ctx, input }) => {
      const senderId = ctx.session.user.id;
      const originQuery = omitLocationFilter(input.query, "originId");
      const destinationQuery = omitLocationFilter(input.query, "destinationId");
      const [originWhere, destinationWhere] = await Promise.all([
        buildParcelLocationWhere(originQuery),
        buildParcelLocationWhere(destinationQuery),
      ]);

      const [originParcels, destinationParcels] = await Promise.all([
        db.parcel.findMany({
          where: { senderId, ...originWhere },
          select: {
            origin: {
              select: locationSelect,
            },
          },
        }),
        db.parcel.findMany({
          where: { senderId, ...destinationWhere },
          select: {
            destination: {
              select: locationSelect,
            },
          },
        }),
      ]);

      return {
        origins: getLocationOptions(originParcels.map(({ origin }) => origin)),
        destinations: getLocationOptions(
          destinationParcels.map(({ destination }) => destination),
        ),
      };
    }),
  getAssignable: courierProcedure
    .input(
      z.object({
        size: z.number().optional().default(10),
        page: z.number().optional().default(1),
      }),
    )
    .query(async ({ input }) => {
      const parcels = await db.parcel.findMany({
        skip: input.size * (input.page - 1),
        take: input.size,
        where: { status: ParcelStatus.PENDING, courierId: null },
        orderBy: [
          { origin: { postalCode: "asc" } },
          { destination: { postalCode: "asc" } },
        ],
        select: {
          id: true,
          createdAt: true,
          destination: {
            select: {
              parcelMachine: {
                select: { name: true },
              },

              street: true,
              city: true,
              postalCode: true,
            },
          },
          origin: {
            select: {
              parcelMachine: {
                select: { name: true },
              },

              street: true,
              city: true,
              postalCode: true,
            },
          },
        },
      });

      const count = await db.parcel.count({
        where: { status: ParcelStatus.PENDING, courierId: null },
      });

      return { parcels, count };
    }),
  getAssigned: courierProcedure
    .input(
      z.object({
        size: z.number().optional().default(10),
        page: z.number().optional().default(1),
        query: z
          .object({
            trackingNumber: z.string().optional(),
            status: z.nativeEnum(ParcelStatus).optional(),
          })
          .optional()
          .default({
            status: ParcelStatus.PENDING,
          }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const courierId = ctx.session.user.id;

      const parcels = await db.parcel.findMany({
        skip: input.size * (input.page - 1),
        take: input.size,
        where: { courierId, ...input.query },
        orderBy: [{ destination: { postalCode: "asc" } }, { createdAt: "asc" }],
        select: {
          id: true,
          trackingNumber: true,
          status: true,
          createdAt: true,
          destination: {
            select: {
              parcelMachine: {
                select: { name: true },
              },

              street: true,
              city: true,
              postalCode: true,
            },
          },
          receiverContact: {
            select: {
              fullName: true,
              phone: true,
            },
          },
        },
      });

      const count = await db.parcel.count({
        where: { courierId, ...input.query },
      });

      return { parcels, count };
    }),
  // parcels from TrackedParcels model
  getTracked: protectedProcedure
    .input(parcelListInputSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const where = await buildParcelLocationWhere(input.query);

      const parcels = (
        await db.trackedParcels.findMany({
          select: {
            parcel: {
              select: {
                trackingNumber: true,
                status: true,
                createdAt: true,
                destination: {
                  select: {
                    parcelMachine: {
                      select: { name: true },
                    },

                    street: true,
                    city: true,
                  },
                },
                updates: {
                  select: { createdAt: true },
                  orderBy: { createdAt: "desc" },
                  take: 1,
                },
              },
            },
          },
          skip: input.size * (input.page - 1),
          take: input.size,
          where: { userId, parcel: where },
        })
      ).map(({ parcel }) => parcel);

      const count = await db.trackedParcels.count({
        where: { userId, parcel: where },
      });

      return { parcels, count };
    }),
  getTrackedFilterLocations: protectedProcedure
    .input(parcelLocationFilterInputSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const originQuery = omitLocationFilter(input.query, "originId");
      const destinationQuery = omitLocationFilter(input.query, "destinationId");
      const [originWhere, destinationWhere] = await Promise.all([
        buildParcelLocationWhere(originQuery),
        buildParcelLocationWhere(destinationQuery),
      ]);

      const [originParcels, destinationParcels] = await Promise.all([
        db.trackedParcels.findMany({
          where: { userId, parcel: originWhere },
          select: {
            parcel: {
              select: {
                origin: {
                  select: locationSelect,
                },
              },
            },
          },
        }),
        db.trackedParcels.findMany({
          where: { userId, parcel: destinationWhere },
          select: {
            parcel: {
              select: {
                destination: {
                  select: locationSelect,
                },
              },
            },
          },
        }),
      ]);

      return {
        origins: getLocationOptions(originParcels.map(({ parcel }) => parcel.origin)),
        destinations: getLocationOptions(
          destinationParcels.map(({ parcel }) => parcel.destination),
        ),
      };
    }),
  getOne: publicProcedure
    .input(z.object({ trackingNumber: z.string() }))
    .query(async ({ ctx, input }) => {
      let userId = null;

      if (ctx.session && ctx.session.user) {
        userId = ctx.session.user.id;
      }

      const result = await db.parcel.findUnique({
        where: { trackingNumber: input.trackingNumber },
        select: {
          status: true,
          updates: {
            select: {
              id: true,
              status: true,
              title: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
          destination: {
            select: {
              parcelMachine: {
                select: { name: true },
              },

              street: true,
              city: true,
              postalCode: true,
            },
          },
          ...(userId && {
            sender: {
              select: {
                id: true,
              },
            },
          }),
          ...(userId && {
            usersTracking: {
              select: {
                userId: true,
              },
              where: { userId },
            },
          }),
        },
      });

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Parcel not found",
        });
      }

      const { usersTracking, sender, ...parcel } = result;

      return {
        parcel,
        isTracked: usersTracking && !!usersTracking.length,
        isSender: sender && sender.id === userId,
      };
    }),
  trackOne: protectedProcedure
    .input(z.object({ trackingNumber: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const parcel = await db.parcel.findUnique({
        where: { trackingNumber: input.trackingNumber },
      });

      if (!parcel) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Parcel not found",
        });
      }

      try {
        await db.trackedParcels.create({
          data: {
            userId,
            parcelId: parcel.id,
          },
        });
        return parcel;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          // duplicate key error
          throw new TRPCError({
            code: "CONFLICT",
            message: "Parcel already tracked",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
          });
        }
      }
    }),
  stopTracking: protectedProcedure
    .input(z.object({ trackingNumber: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const parcel = await db.parcel.findUnique({
        where: { trackingNumber: input.trackingNumber },
        select: { id: true },
      });

      if (!parcel) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Parcel not found",
        });
      }

      const result = await db.trackedParcels.delete({
        where: { userId_parcelId: { userId, parcelId: parcel.id } },
      });

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Parcel not tracked",
        });
      }
    }),
  create: protectedProcedure
    .input(parcelCreateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const senderId = ctx.session.user.id;

      await checkIfAddressExists(input.originId, "Origin address not found");
      await checkIfAddressExists(
        input.destinationId,
        "Destination address not found",
      );

      const parcel = await db.parcel.create({
        data: {
          ...input,
          senderId,
          trackingNumber: generateTrackingNumber(),
        },
      });

      await db.parcelUpdate.create({
        data: {
          parcelId: parcel.id,
          status: parcel.status,
          title: "Order created",
        },
      });

      return parcel;
    }),
  assignMany: courierProcedure
    .input(
      z.object({
        parcelIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { parcelIds } = input;
      const courierId = ctx.session.user.id;

      const parcels = await db.parcel.findMany({
        where: { id: { in: parcelIds } },
      });

      if (parcels.length !== parcelIds.length) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Some parcels not found",
        });
      }

      const updatedParcels = await db.parcel.updateMany({
        where: { id: { in: parcelIds } },
        data: { courierId },
      });

      await db.parcelUpdate.createMany({
        data: parcelIds.map((parcelId) => ({
          parcelId,
          status: ParcelStatus.PENDING,
          title: "Assigned to courier",
        })),
      });

      return updatedParcels;
    }),
  updateStatuses: courierProcedure
    .input(
      z.object({
        parcelIds: z.array(z.string()),
        title: z.string(),
        status: z.nativeEnum(ParcelStatus),
      }),
    )
    .mutation(async ({ input }) => {
      const { parcelIds, title, status } = input;

      const parcels = await db.parcel.findMany({
        where: { id: { in: parcelIds } },
        select: {
          id: true,
          size: true,
          lockerId: true,
          destination: { select: { parcelMachine: true } },
        },
      });

      if (parcels.length !== parcelIds.length) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Some parcels not found",
        });
      }

      if (status === ParcelStatus.AWAITING_PICKUP) {
        // try to find locker for each parcel
        const parcelMachineIds = parcels
          .map((parcel) => parcel.destination.parcelMachine?.id)
          .filter((id) => id !== undefined) as string[];

        if (parcelMachineIds.length !== parcelIds.length) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Some parcels do not have parcel machines",
          });
        }

        const parcelMachines = await db.parcelMachine.findMany({
          where: { id: { in: parcelMachineIds } },
          select: {
            id: true,
            lockers: {
              select: { id: true, size: true },
              where: { available: true },
            },
          },
        });

        for (const parcel of parcels) {
          const parcelMachine = parcelMachines.find(
            (pm) => pm.id === parcel.destination.parcelMachine?.id,
          );

          if (!parcelMachine) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Parcel machine not found",
            });
          }

          const locker = parcelMachine.lockers.find(
            (l) => l.size === parcel.size,
          );

          if (!locker) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "No available lockers",
            });
          }

          parcelMachine.lockers = parcelMachine.lockers.filter(
            (l) => l.id !== locker?.id,
          );

          await db.parcel.update({
            where: { id: parcel.id },
            data: {
              lockerId: locker.id,
              status,
              courierId: null,
            },
          });

          await db.parcelUpdate.create({
            data: {
              parcelId: parcel.id,
              status,
              title,
            },
          });

          await db.locker.update({
            where: { id: locker.id },
            data: {
              available: false,
            },
          });
        }
      } else {
        await db.parcel.updateMany({
          where: { id: { in: parcelIds } },
          data: {
            status,
            ...(status === ParcelStatus.DELIVERED && {
              courierId: null,
              lockerId: null,
            }),
          },
        });

        await db.parcelUpdate.createMany({
          data: parcelIds.map((parcelId) => ({
            parcelId,
            status,
            title,
          })),
        });

        const lockerIds = parcels
          .map((parcel) => parcel.lockerId)
          .filter((id) => id !== null) as string[];

        if (lockerIds.length) {
          await db.locker.updateMany({
            where: { id: { in: lockerIds } },
            data: {
              available: true,
            },
          });
        }
      }
    }),
});
