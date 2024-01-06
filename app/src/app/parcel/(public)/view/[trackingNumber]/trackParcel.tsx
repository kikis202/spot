"use client";

import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

type ActionProps = {
  trackingNumber: string;
  className?: string;
};

export const StartTracking = ({ trackingNumber, className }: ActionProps) => {
  const { mutateAsync: trackParcel } = api.parcels.trackOne.useMutation();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = async () => {
    setLoading(true);
    try {
      await trackParcel({ trackingNumber });
      toast.success("Parcel added to tracked parcels!");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <Button className={className} disabled={loading} onClick={onClick}>
      {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      Track Parcel
    </Button>
  );
};

export const StopTracking = ({ trackingNumber, className }: ActionProps) => {
  const { mutateAsync: stopTracking } = api.parcels.stopTracking.useMutation();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = async () => {
    setLoading(true);
    try {
      await stopTracking({ trackingNumber });
      toast.success("Parcel removed from tracked parcels!");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <Button className={className} disabled={loading} onClick={onClick}>
      {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      Stop Tracking
    </Button>
  );
};
