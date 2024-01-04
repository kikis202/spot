import { MainLayout } from "@/components/app-layout";
import { H1 } from "@/components/ui/typography";
import { ParcelSize, ParcelStatus } from "@prisma/client";
import { api } from "~/trpc/server";
import ParcelTable from "../_components/table";
import TableFilter from "../_components/tableFilter";
import { z } from "zod";
import { Button } from "@/components/ui/button";

export type TrackParcelProps = {
  searchParams: {
    page?: string;
    trackingNumber?: string;
    status?: string;
    size?: string;
    originId?: string;
    destinationId?: string;
  };
};

const searchParamsSchema = z.object({
  page: z.string().optional(),
  trackingNumber: z.string().optional(),
  status: z.nativeEnum(ParcelStatus).optional(),
  size: z.nativeEnum(ParcelSize).optional(),
  originId: z.string().optional(),
  destinationId: z.string().optional(),
});

const parseSearchParams = (searchParams: TrackParcelProps["searchParams"]) => {
  try {
    return searchParamsSchema.parse(searchParams);
  } catch (error) {
    return searchParamsSchema.parse({
      page: searchParams.page,
      trackingNumber: searchParams.trackingNumber,
      originId: searchParams.originId,
      destinationId: searchParams.destinationId,
    });
  }
};

const TrackParcel = async ({ searchParams }: TrackParcelProps) => {
  searchParams = parseSearchParams(searchParams);

  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const size = 10;
  const query = {
    page,
    size,
    query: {
      trackingNumber: searchParams.trackingNumber,
      status: searchParams.status as ParcelStatus,
      size: searchParams.size as ParcelSize,
      originId: searchParams.originId,
      destinationId: searchParams.destinationId,
    },
  };
  const { parcels, count } = await api.parcels.getTracked.query(query);
  const addresses = await api.addresses.getMy.query();

  return (
    <MainLayout>
      <div className="space-y-6">
        <H1>Track Parcels</H1>
        <TableFilter searchParams={searchParams} addresses={addresses} />
        <Button>
          Add new parcel to tracked list
        </Button>
        <ParcelTable
          page={page}
          size={size}
          data={parcels}
          totalCount={count}
          searchParams={searchParams}
        />
      </div>
    </MainLayout>
  );
};

export default TrackParcel;
