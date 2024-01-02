import { createTRPCRouter } from "~/server/api/trpc";
import { parcelsRouter } from "./routers/parcels";
import { parcelMachinesRouter } from "./routers/parcelMachines";
import { addressesRouter } from "./routers/addresses";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  parcels: parcelsRouter,
  parcelMachines: parcelMachinesRouter,
  addresses: addressesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
