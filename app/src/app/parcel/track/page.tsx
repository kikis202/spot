import { MainLayout } from "@/components/app-layout";
import { H1 } from "@/components/ui/typography";
import TableDemo from "./table";

export type TrackParcelProps = {
  searchParams: {
    page?: string;
  };
};

const TrackParcel = ({ searchParams }: TrackParcelProps) => {
  return (
    <MainLayout>
      <H1>Track Your Parcels</H1>
      <TableDemo searchParams={searchParams} />
    </MainLayout>
  );
};

export default TrackParcel;
