"use client";

import { FileEditIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H2 } from "@/components/ui/typography";
import {
  getSessionStorageValue,
  setSessionStorageValue,
} from "@/lib/clientUtils";
import { ParcelSize } from "@prisma/client";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { deliverySchemaParsed } from "../_deliveryType/deliveryTypeForm";
import {
  addressSchema,
  contactSchema,
  personalInfoSchema,
} from "../_personalInfo/personalInfoForm";

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
    throw error;
  }
};

const parseAddress = (address: z.infer<typeof addressSchema>) => {
  try {
    return addressSchema.parse(address);
  } catch (error) {
    throw error;
  }
};

const parseContact = (contact: z.infer<typeof contactSchema>) => {
  try {
    return contactSchema.parse(contact);
  } catch (error) {
    throw error;
  }
};

export const finalDataSchema = z.object({
  parcel: parsedParcelSchema,
  sendFrom: addressSchema,
  sendTo: addressSchema,
  senderContact: contactSchema,
  receiverContact: contactSchema,
});

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
        <FileEditIcon className="h-6 w-6" />
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
            sender.contact.fullName ? sender.contact.fullName + " " : ""
          }${sender.contact.email}, ${sender.contact.phone}`,
          sender.address.id
            ? `Parcel Machine: ${sender.address.parcelMachineName}`
            : `Address: ${sender.address.street}, ${sender.address.city}, ${sender.address.country}`,
        ],
        recipient: [
          `Contact info: ${
            receiver.contact.fullName ? receiver.contact.fullName + " " : ""
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
      toast.error("Something went wrong!");
      return resetSteps();
    }
  }, [infoBoxData, resetSteps]);

  const onSubmit = useCallback(() => {
    if (!deliveryType || !sender || !receiver) return;

    try {
      const finalData = {
        parcel: parseParcel(deliveryType),
        sendFrom: parseAddress(sender.address),
        sendTo: parseAddress(receiver.address),
        senderContact: parseContact(sender.contact),
        receiverContact: parseContact(receiver.contact),
      };

      setSessionStorageValue("orderSummary", finalDataSchema.parse(finalData));
      return nextStep();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      return resetSteps();
    }
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
