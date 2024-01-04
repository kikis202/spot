import { MainLayout } from "@/components/app-layout";
import { H1 } from "@/components/ui/typography";
import ParcelTable from "../_components/table";
import { api } from "~/trpc/server";
import type { ParcelSize, ParcelStatus } from "@prisma/client";

export type TrackParcelProps = {
  searchParams: {
    page?: string;
    trackingNumber?: string;
    status?: ParcelStatus;
    size?: ParcelSize;
    originId?: string;
    destinationId?: string;
  };
};

const TrackParcel = async ({ searchParams }: TrackParcelProps) => {
  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const size = 10;
  const query = {
    page,
    size,
    query: {},
  };
  const { parcels, count } = await api.parcels.getMy.query(query);

  return (
    <MainLayout>
      <H1>Track Your Parcels</H1>
      <ParcelTable
        page={page}
        size={size}
        data={parcels}
        totalCount={count}
        searchParams={searchParams}
      />
    </MainLayout>
  );
};

export default TrackParcel;
