import { MainLayout } from "@/components/app-layout";
import AdminPage from "@/components/role/admin";
import { H1 } from "@/components/ui/typography";
import { api } from "~/trpc/server";
import CreateParcelMachine from "./create";
import ParcelMachineTable from "./table";

export type ParcelMachineProps = {
  searchParams: {
    page: string;
  };
};

const ParcelMachineList = async ({ searchParams }: ParcelMachineProps) => {
  const page = parseInt(searchParams.page ?? "1", 10) || 1;
  const size = 10;

  const { parcelMachines, count } = await api.parcelMachines.getAdminAll.query({
    page,
    size,
  });

  return (
    <div className="space-y-6">
      <H1>Parcel machines</H1>
      <ParcelMachineTable
        data={parcelMachines}
        page={page}
        size={size}
        totalCount={count}
        searchParams={searchParams}
      />
      <CreateParcelMachine />
    </div>
  );
};

export default function ParcelMachineListPage(props: ParcelMachineProps) {
  return (
    <AdminPage>
      <MainLayout>
        <ParcelMachineList {...props} />
      </MainLayout>
    </AdminPage>
  );
}
