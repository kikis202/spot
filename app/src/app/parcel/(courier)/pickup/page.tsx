import { MainLayout } from "@/components/app-layout";
import CourierPage from "@/components/role/courier";
import { H1 } from "@/components/ui/typography";
import ParcelTable from "./table";
import { api } from "~/trpc/server";

type PickupOrderProps = {
  searchParams: {
    page?: string;
  };
};

const PickupOrder = async ({ searchParams }: PickupOrderProps) => {
  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const size = 10;

  const { parcels, count } = await api.parcels.getAssignable.query({
    page,
    size,
  });

  return (
    <MainLayout>
      <H1>Pickup order</H1>
      <ParcelTable data={parcels} page={page} size={size} totalCount={count} />
    </MainLayout>
  );
};

export default function PickupOrderPage(props: PickupOrderProps) {
  return (
    <CourierPage>
      <PickupOrder {...props} />
    </CourierPage>
  );
}
