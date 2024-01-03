"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H2 } from "@/components/ui/typography";
import {
  getSessionStorageValue,
  setSessionStorageValue,
} from "@/lib/clientUtils";
import { useEffect, useMemo } from "react";
import { deliverySchemaParsed } from "../_deliveryType/deliveryTypeForm";
import { personalInfoSchema } from "../_personalInfo/personalInfoForm";

const FileEditIcon = () => {
  return (
    <svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
    </svg>
  );
};

type InfoBoxProps = {
  title: string;
  info: string[];
  goToStep: () => void;
};

const InfoBox = ({ title, info, goToStep }: InfoBoxProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{title}</div>
        {info.map((item) => (
          <div key={item} className="text-lg">
            {item}
          </div>
        ))}
      </div>
      <div
        onClick={goToStep}
        className="cursor-pointer p-2 text-muted-foreground hover:text-primary"
      >
        <FileEditIcon />
      </div>
    </div>
  );
};

const Summary = ({ boxes }: { boxes: InfoBoxProps[] }) => {
  return (
    <div className="my-6 space-y-4">
      {boxes.map((item, i, array) => (
        <>
          <InfoBox key={item.title} {...item} />
          {i < array.length - 1 && <Separator />}
        </>
      ))}
    </div>
  );
};

const OrderSummary = ({
  nextStep,
  setStep,
  resetSteps,
}: {
  nextStep: () => void;
  setStep: (step: number) => void;
  resetSteps: () => void;
}) => {
  const data = useMemo(() => {
    try {
      const { sender, receiver } = personalInfoSchema.parse(
        getSessionStorageValue("personalInfo", {}),
      );
      const deliveryType = deliverySchemaParsed.parse(
        getSessionStorageValue("deliveryType", {}),
      );
      return {
        parcel: [
          `Size: ${deliveryType.size}${
            deliveryType.dimensions
              ? `, Dimensions: (${deliveryType.dimensions})`
              : ""
          }${deliveryType.weight ? ` Weight: ${deliveryType.weight} kg` : ""}`,
        ],
        sender: [
          `Contact info: ${
            sender.contact.name ? sender.contact.name + " " : ""
          }${sender.contact.email}, ${sender.contact.phone}`,
          sender.address.id
            ? `Parcel Machine: ${sender.address.parcelMachineName}`
            : `Address: ${sender.address.street}, ${sender.address.city}, ${sender.address.country}`,
        ],
        recipient: [
          `Contact info: ${
            receiver.contact.name ? receiver.contact.name + " " : ""
          }${receiver.contact.email}, ${receiver.contact.phone}`,
          receiver.address.id
            ? `Parcel Machine: ${receiver.address.parcelMachineName}`
            : `Address: ${receiver.address.street}, ${receiver.address.city}, ${receiver.address.country}`,
        ],
      };
    } catch (error) {
      console.log(error);
      return {
        parcel: [],
        sender: [],
        recipient: [],
      };
    }
  }, []);

  const infoBoxes: InfoBoxProps[] = useMemo(
    () => [
      {
        title: "Parcel",
        info: data.parcel,
        goToStep: () => setStep(1),
      },
      {
        title: "Sender",
        info: data.sender,
        goToStep: () => setStep(2),
      },
      {
        title: "Recipient",
        info: data.recipient,
        goToStep: () => setStep(2),
      },
    ],
    [data.parcel, data.recipient, data.sender, setStep],
  );

  useEffect(() => {
    if (!data.parcel.length || !data.parcel.length || !data.parcel.length)
      resetSteps();
  }, [data, resetSteps]);

  const onSubmit = () => {
    // TODO: format data to be sent to the server
    const finalData = {
      accepted: true,
    };
    setSessionStorageValue("orderSummary", finalData);
    nextStep();
  };

  return (
    <>
      <H2>Order Summary</H2>
      <Summary boxes={infoBoxes} />
      <Button onClick={onSubmit}>Next</Button>
    </>
  );
};

export default OrderSummary;
