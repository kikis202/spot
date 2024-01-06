import { MainLayout } from "@/components/app-layout";
import CourierPage from "@/components/role/courier";
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

export type UpdateOrderProps = {
  searchParams: z.infer<typeof searchParamsSchema>;
};

const parseSearchParams = (searchParams: UpdateOrderProps["searchParams"]) => {
  try {
    return searchParamsSchema.parse(searchParams);
  } catch (error) {
    return searchParamsSchema.parse({
      page: searchParams.page,
      trackingNumber: searchParams.trackingNumber,
    });
  }
};

const PickupOrder = async ({ searchParams }: UpdateOrderProps) => {
  searchParams = parseSearchParams(searchParams);

  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const size = 10;

  const { parcels, count } = await api.parcels.getAssigned.query({
    page,
    size,
    query: {
      trackingNumber: searchParams.trackingNumber,
      status: searchParams.status,
    },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <H1>Update order</H1>
        <TableFilter searchParams={searchParams} />
        <ParcelTable
          data={parcels}
          page={page}
          size={size}
          totalCount={count}
          searchParams={searchParams}
        />
      </div>
    </MainLayout>
  );
};

export default function PickupOrderPage(props: UpdateOrderProps) {
  return (
    <CourierPage>
      <PickupOrder {...props} />
    </CourierPage>
  );
}
