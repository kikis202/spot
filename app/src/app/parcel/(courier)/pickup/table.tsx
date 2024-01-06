"use client";

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
import Paginator from "@/components/pagination";

import { Button } from "@/components/ui/button";
import moment from "moment";
import type { RouterOutputs } from "~/trpc/shared";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

const SubmitSelected = ({ parcelIds }: { parcelIds: string[] }) => {
  const { mutateAsync: pickUpSelected } = api.parcels.assignMany.useMutation();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await pickUpSelected({ parcelIds });
      toast.success("Parcels picked up");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleSubmit}>
      {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      Pick up selected
    </Button>
  );
};

type Parcel = RouterOutputs["parcels"]["getAssignable"]["parcels"][number];
type ParcelTableParams = {
  data: Parcel[];
  page: number;
  size: number;
  totalCount: number;
};

const ParcelTable = ({ data, page, size, totalCount }: ParcelTableParams) => {
  const [selected, setSelected] = useState<Parcel["id"][]>([]);

  console.log(selected);

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Select</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead className="w-52 text-right">Order Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((parcel) => (
            <TableRow
              key={parcel.id}
              className={selected.includes(parcel.id) ? "bg-muted" : undefined}
            >
              <TableCell className="flex h-full items-center justify-center">
                <Input
                  type="checkbox"
                  className="h-6 w-6"
                  checked={selected.includes(parcel.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected((current) => [...current, parcel.id]);
                    } else {
                      setSelected((current) =>
                        current.filter((p) => p !== parcel.id),
                      );
                    }
                  }}
                />
              </TableCell>
              <TableCell className="font-medium">
                {`${parcel.origin.city}, ${parcel.origin.postalCode}, ${
                  parcel.origin.street
                }${
                  parcel.origin.parcelMachine?.name
                    ? `, ${parcel.origin.parcelMachine?.name}`
                    : ""
                }`}
              </TableCell>
              <TableCell className="font-medium">
                {`${parcel.destination.city}, ${
                  parcel.destination.postalCode
                }, ${parcel.destination.street}${
                  parcel.destination.parcelMachine?.name
                    ? `, ${parcel.destination.parcelMachine?.name}`
                    : ""
                }`}
              </TableCell>
              <TableCell className="text-right font-medium">
                {moment(parcel.createdAt).format("YYYY-MM-DD HH:mm:ss")}
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
                  // searchParams={searchParams}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableCaption>Select parcels and asign them to yourself</TableCaption>
      </Table>
      <SubmitSelected parcelIds={selected} />
    </div>
  );
};

export default ParcelTable;
