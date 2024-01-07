import Paginator from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { ParcelStatusUI } from "~/helpers/enumTranslations";

import type { RouterOutputs } from "~/trpc/shared";
import EditParcel from "./edit";
import type { AllParcelsProps } from "./page";

type Parcel = RouterOutputs["parcels"]["getAll"]["parcels"][number];

type ParcelTableParams = {
  data: Parcel[];
  page: number;
  size: number;
  totalCount: number;
};

const ParcelTable = ({
  data,
  page,
  size,
  totalCount,
  searchParams,
}: AllParcelsProps & ParcelTableParams) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-56">Tracking number</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Update</TableHead>
          <TableHead>Order Created</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead className="w-28 text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((parcel) => (
          <TableRow key={parcel.trackingNumber}>
            <TableCell className="font-medium">
              {parcel.trackingNumber}
            </TableCell>
            <TableCell className="font-medium">
              {ParcelStatusUI[parcel.status]}
            </TableCell>
            <TableCell className="font-medium">
              {moment(parcel.updates[0]?.createdAt ?? parcel.createdAt).format(
                "YYYY-MM-DD HH:mm:ss",
              )}
            </TableCell>
            <TableCell className="font-medium">
              {moment(parcel.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </TableCell>
            <TableCell className="font-medium">
              {parcel.destination.parcelMachine?.name ??
                `${parcel.destination.street}, ${parcel.destination.city}`}
            </TableCell>
            <TableCell className="font-medium">
              <EditParcel parcel={parcel} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {totalCount > size && (
        <TableFooter>
          <TableRow>
            <TableCell className="!py-2" colSpan={6}>
              <Paginator
                currentPage={page}
                size={size}
                totalCount={totalCount}
                searchParams={searchParams}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      )}

      <TableCaption>Track your parcels easily</TableCaption>
    </Table>
  );
};

export default ParcelTable;
