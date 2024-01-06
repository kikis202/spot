"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";

const TrackingNumberInput = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="tracking-number">Tracking Number</Label>
      <Input
        id="tracking-number"
        placeholder="SPOT-XXXXXXXX-XXXXXX"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <Link className="self-end" href={`/parcel/view/${trackingNumber}`}>
        <Button
          disabled={loading}
          onClick={() => setLoading(!!trackingNumber)}
          variant="outline"
        >
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Find
        </Button>
      </Link>
    </div>
  );
};

export default TrackingNumberInput;
