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
import Paginator from "../../../../@/components/pagination";

import { Button } from "@/components/ui/button";
import moment from "moment";
import Link from "next/link";
import { ParcelStatusUI } from "~/helpers/enumTranslations";
import type { RouterOutputs } from "~/trpc/shared";
import type { TrackParcelProps } from "../own/page";

type Parcel = RouterOutputs["parcels"]["getMy"]["parcels"][number];

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
}: TrackParcelProps & ParcelTableParams) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-52">Tracking number</TableHead>
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
              <Button variant="ghost">
                <Link href={`/parcel/view/${parcel.trackingNumber}`}>
                  See Details
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {totalCount > size && (
        <TableFooter>
          <TableRow>
            <TableCell className="!py-2" colSpan={4}>
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
