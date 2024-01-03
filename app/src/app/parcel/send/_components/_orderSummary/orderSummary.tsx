"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H2 } from "@/components/ui/typography";
import {
  getSessionStorageValue,
  setSessionStorageValue,
} from "@/lib/clientUtils";
import { ParcelSize } from "@prisma/client";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import { z } from "zod";
import { deliverySchemaParsed } from "../_deliveryType/deliveryTypeForm";
import {
  addressSchema,
  contactSchema,
  personalInfoSchema,
} from "../_personalInfo/personalInfoForm";

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

const parsedParcelSchema = z.object({
  size: z.nativeEnum(ParcelSize),
  dimensions: z.string().optional(),
  weight: z.number().optional(),
  notes: z.string().optional(),
});

const parseParcel = (parcel: z.infer<typeof deliverySchemaParsed>) => {
  try {
    return parsedParcelSchema.parse(parcel);
  } catch (error) {
    console.log(error);
  }
};

const parseAddress = (address: z.infer<typeof addressSchema>) => {
  try {
    return addressSchema.parse(address);
  } catch (error) {
    console.log(error);
  }
};

const parseContact = (contact: z.infer<typeof contactSchema>) => {
  try {
    return contactSchema.parse(contact);
  } catch (error) {
    console.log(error);
  }
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
        <Fragment key={item.title}>
          <InfoBox {...item} />
          {i < array.length - 1 && <Separator />}
        </Fragment>
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
  const { sender, receiver, deliveryType } = useMemo(() => {
    try {
      const { sender, receiver } = personalInfoSchema.parse(
        getSessionStorageValue("personalInfo", {}),
      );
      const deliveryType = deliverySchemaParsed.parse(
        getSessionStorageValue("deliveryType", {}),
      );

      return { sender, receiver, deliveryType };
    } catch (error) {
      return {};
    }
  }, []);

  const infoBoxData = useMemo(() => {
    if (!sender || !receiver || !deliveryType)
      return { parcel: [], sender: [], recipient: [] };

    try {
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
  }, [deliveryType, receiver, sender]);

  const infoBoxes: InfoBoxProps[] = useMemo(
    () => [
      {
        title: "Parcel",
        info: infoBoxData.parcel,
        goToStep: () => setStep(1),
      },
      {
        title: "Sender",
        info: infoBoxData.sender,
        goToStep: () => setStep(2),
      },
      {
        title: "Recipient",
        info: infoBoxData.recipient,
        goToStep: () => setStep(2),
      },
    ],
    [infoBoxData.parcel, infoBoxData.recipient, infoBoxData.sender, setStep],
  );

  useEffect(() => {
    if (
      !infoBoxData.parcel.length ||
      !infoBoxData.recipient.length ||
      !infoBoxData.sender.length
    ) {
      return resetSteps();
    }
  }, [infoBoxData, resetSteps]);

  const onSubmit = useCallback(() => {
    if (!deliveryType || !sender || !receiver) return;

    const parcel = parseParcel(deliveryType);
    const sendFrom = parseAddress(sender.address);
    const sendTo = parseAddress(receiver.address);
    const senderContact = parseContact(sender.contact);
    const receiverContact = parseContact(receiver.contact);

    if (!parcel || !sendFrom || !sendTo || !senderContact || !receiverContact)
      return resetSteps();

    const finalData = {
      accepted: true,
      parcel,
      sendFrom,
      sendTo,
      senderContact,
      receiverContact,
    };
    setSessionStorageValue("orderSummary", finalData);
    nextStep();
  }, [deliveryType, receiver, sender, resetSteps, nextStep]);

  return (
    <>
      <H2>Order Summary</H2>
      <Summary boxes={infoBoxes} />
      <Button onClick={onSubmit}>Next</Button>
    </>
  );
};

export default OrderSummary;
