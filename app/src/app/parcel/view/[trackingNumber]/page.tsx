import { MainLayout } from "@/components/app-layout";
import { ParcelIcon } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { H1 } from "@/components/ui/typography";
import moment from "moment";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { ParcelStatusUI } from "~/helpers/enumTranslations";
import { api } from "~/trpc/server";

import type { ParcelStatus } from "@prisma/client";

type ParcelInfoProps = {
  trackingNumber: string;
  status: ParcelStatus;
  destination: {
    parcelMachine?: string;
    street: string;
    city: string;
    postalCode: string;
  };
};

const ParcelInfo = (props: ParcelInfoProps) => {
  return (
    <Card className="h-fit w-full max-w-md">
      <CardHeader>
        <CardTitle>Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <ParcelIcon className="h-6 w-6" />
            <h3 className="text-lg font-semibold">
              Current Status: {ParcelStatusUI[props.status]}
            </h3>
          </div>
          <div className="grid gap-2">
            <h4 className="text-base font-semibold">Destination Address:</h4>
            <div className="grid gap-1">
              {props.destination.parcelMachine && (
                <div className="text-sm">{props.destination.parcelMachine}</div>
              )}
              <div className="text-sm">Street: {props.destination.street}</div>
              <div className="text-sm">City: {props.destination.city}</div>
              <div className="text-sm">
                Postal Code: {props.destination.postalCode}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type Update = {
  id: string;
  title: string;
  status: ParcelStatus;
  createdAt: Date;
};

const UpdateCard = ({ status, title, createdAt }: Update) => {
  return (
    <div className="grid gap-1">
      <div className="text-lg">{title}</div>
      <div className="text-sm">Order status: {ParcelStatusUI[status]}</div>
      <div className="text-xs text-muted-foreground">
        {moment(createdAt).format("YYYY-MM-DD HH:mm:ss")}
      </div>
    </div>
  );
};

type UpdatesProps = {
  updates: Update[];
};

const Updates = ({ updates }: UpdatesProps) => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="border-b pb-2">Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {updates.map((update, i, array) => (
            <Fragment key={update.id}>
              <UpdateCard {...update} />
              {i < array.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TrackingPage = async ({
  params: { trackingNumber },
}: {
  params: {
    trackingNumber: string;
  };
}) => {
  const data = await api.parcels.getOne.query({ trackingNumber }).catch(() => {
    notFound();
  });

  const updates: UpdatesProps = {
    updates: data.updates,
  };

  const parcelInfo: ParcelInfoProps = {
    trackingNumber: trackingNumber,
    status: data.status,
    destination: {
      parcelMachine: data.destination.parcelMachine?.name,
      street: data.destination.street,
      city: data.destination.city,
      postalCode: data.destination.postalCode,
    },
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <H1>Parcel Tracking</H1>
        <div className="flex justify-between gap-6">
          <Updates {...updates} />
          <ParcelInfo {...parcelInfo} />
        </div>
      </div>
    </MainLayout>
  );
};

export default TrackingPage;
