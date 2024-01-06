import { MainLayout } from "@/components/app-layout";
import CourierPage from "@/components/role/courier";
import { H1 } from "@/components/ui/typography";
import ParcelTable from "./table";
import { api } from "~/trpc/server";

type UpdateOrderProps = {
  searchParams: {
    page?: string;
  };
};

const PickupOrder = async ({ searchParams }: UpdateOrderProps) => {
  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const size = 10;

  const { parcels, count } = await api.parcels.getAssigned.query({
    page,
    size,
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <H1>Update order</H1>
        <ParcelTable
          data={parcels}
          page={page}
          size={size}
          totalCount={count}
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
