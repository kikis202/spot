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

import type { RouterOutputs } from "~/trpc/shared";
import type { ParcelMachineProps } from "./page";

type ParcelMachine =
  RouterOutputs["parcelMachines"]["getAdminAll"]["parcelMachines"][number];
type ParcelMachineTableParams = {
  data: ParcelMachine[];
  page: number;
  size: number;
  totalCount: number;
};

const ParcelMachineTable = ({
  data,
  page,
  size,
  totalCount,
  searchParams,
}: ParcelMachineTableParams & ParcelMachineProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Locker count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((parcelMachine) => (
            <TableRow key={parcelMachine.id}>
              <TableCell className="font-medium">
                {parcelMachine.name}
              </TableCell>
              <TableCell className="font-medium">
                {`${parcelMachine.address.city}, ${parcelMachine.address.postalCode}, ${parcelMachine.address.street}`}
              </TableCell>
              <TableCell className="font-medium">
                {parcelMachine.lockers.length}
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
        <TableCaption>Select parcels and asign them to yourself</TableCaption>
      </Table>
    </>
  );
};

export default ParcelMachineTable;
