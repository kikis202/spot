import { MainLayout } from "@/components/app-layout";
import AdminPage from "@/components/role/admin";
import { H1 } from "@/components/ui/typography";
import { ParcelStatus } from "@prisma/client";
import { z } from "zod";
import { api } from "~/trpc/server";
import ParcelTable from "./table";
import TableFilter from "./tableFilter";

const searchParamsSchema = z.object({
  page: z.string().optional(),
  trackingNumber: z.string().optional(),
  status: z.nativeEnum(ParcelStatus).optional(),
});

export type AllParcelsProps = {
  searchParams: z.infer<typeof searchParamsSchema>;
};

const parseSearchParams = (searchParams: AllParcelsProps["searchParams"]) => {
  try {
    return searchParamsSchema.parse(searchParams);
  } catch (error) {
    return searchParamsSchema.parse({
      page: searchParams.page,
      trackingNumber: searchParams.trackingNumber,
    });
  }
};


const AllParcels = async ({ searchParams }: AllParcelsProps) => {
  searchParams = parseSearchParams(searchParams);

  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const size = 10;

  const { parcels, count } = await api.parcels.getAll.query({
    page,
    size,
    query: {
      trackingNumber: searchParams.trackingNumber,
      status: searchParams.status,
    },
  });

  return (
    <div className="space-y-6">
      <H1>Parcels</H1>
      <TableFilter searchParams={searchParams} />
      <ParcelTable
        data={parcels}
        page={page}
        size={size}
        totalCount={count}
        searchParams={searchParams}
      />
    </div>
  );
};

export default function AllParcelsPage(props: AllParcelsProps) {
  return (
    <AdminPage>
      <MainLayout>
        <AllParcels {...props} />
      </MainLayout>
    </AdminPage>
  );
}
