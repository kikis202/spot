"use client";

import Paginator from "@/components/pagination";
import { Input } from "@/components/ui/input";
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
import { useState } from "react";
import { ParcelStatusUI } from "~/helpers/enumTranslations";
import UpdateAction from "./updateAction";

import type { RouterOutputs } from "~/trpc/shared";
import type { UpdateOrderProps } from "./page";

type Parcel = RouterOutputs["parcels"]["getAssigned"]["parcels"][number];
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
}: ParcelTableParams & UpdateOrderProps) => {
  const [selected, setSelected] = useState<Parcel["id"][]>([]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Select</TableHead>
            <TableHead className="w-56">Tracking number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Contact Info</TableHead>
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
                {parcel.trackingNumber}
              </TableCell>
              <TableCell className="font-medium">
                {ParcelStatusUI[parcel.status]}
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
              <TableCell className="font-medium">
                {`${parcel.receiverContact.phone}${
                  parcel.receiverContact.fullName
                    ? `, ${parcel.receiverContact.fullName}`
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
      <UpdateAction parcelIds={selected} />
    </>
  );
};

export default ParcelTable;
