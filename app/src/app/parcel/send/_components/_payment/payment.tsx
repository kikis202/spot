import {
  AppleIcon,
  CreditCardIcon,
  GoogleIcon,
  PayPalIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { H2 } from "@/components/ui/typography";
import { getSessionStorageValue } from "@/lib/clientUtils";
import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { parcelCreateInputSchema } from "~/helpers/dbSchemas";
import { api } from "~/trpc/react";
import { finalDataSchema } from "../_orderSummary/orderSummary";

import type { z } from "zod";
import type {
  addressSchema,
  contactSchema,
} from "../_personalInfo/personalInfoForm";

type PaymentMethodName = "PayPal" | "Google Pay" | "Apple Pay" | "Credit Card";

type PaymentMethod = {
  name: PaymentMethodName;
  icon: JSX.Element;
};

const paymentMethods: PaymentMethod[] = [
  {
    name: "PayPal",
    icon: <PayPalIcon className="h-6 w-6" />,
  },
  {
    name: "Google Pay",
    icon: <GoogleIcon className="h-6 w-6" />,
  },
  {
    name: "Apple Pay",
    icon: <AppleIcon className="h-6 w-6" />,
  },
  {
    name: "Credit Card",
    icon: <CreditCardIcon className="h-6 w-6" />,
  },
];

const PaymentMethods = ({
  selected,
  setSelected,
}: {
  selected: PaymentMethodName | null;
  setSelected: (method: PaymentMethodName) => void;
}) => {
  return (
    <div className="w-full max-w-md space-y-4">
      {paymentMethods.map((method) => (
        <Card
          key={method.name}
          className={cn(
            "flex cursor-pointer items-center space-x-4 p-4 hover:bg-primary-foreground",
            selected === method.name && "bg-muted",
          )}
          onClick={() => setSelected(method.name)}
        >
          {method.icon}
          <CardTitle className="text-lg">{method.name}</CardTitle>
        </Card>
      ))}
    </div>
  );
};

const Payment = ({ resetSteps }: { resetSteps: () => void }) => {
  const [selected, setSelected] = useState<PaymentMethodName | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const { parcel, sendFrom, sendTo, senderContact, receiverContact } = useMemo<
    Partial<z.infer<typeof finalDataSchema>>
  >(() => {
    try {
      return finalDataSchema.parse(getSessionStorageValue("orderSummary", {}));
    } catch (error) {
      return {};
    }
  }, []);

  const { mutateAsync: createAddress } = api.addresses.create.useMutation();
  const { mutateAsync: createContact } = api.contacts.create.useMutation();
  const { mutateAsync: createParcel } = api.parcels.create.useMutation();

  const getAddressId = useCallback(
    async ({ id, ...address }: z.infer<typeof addressSchema>) => {
      if (id) return id;
      return (await createAddress(address)).id;
    },
    [createAddress],
  );

  const getContactId = useCallback(
    async ({ id, ...contact }: z.infer<typeof contactSchema>) => {
      if (id) return id;
      return (await createContact(contact)).id;
    },
    [createContact],
  );

  const onSubmit = useCallback(async () => {
    if (!parcel || !sendFrom || !sendTo || !senderContact || !receiverContact) {
      toast.error("Something went wrong.");
      resetSteps();
      return;
    }

    setLoading(true);
    try {
      const originId = await getAddressId(sendFrom);
      const destinationId = await getAddressId(sendTo);
      const senderContactId = await getContactId(senderContact);
      const receiverContactId = await getContactId(receiverContact);

      const result = await createParcel(
        parcelCreateInputSchema.parse({
          ...parcel,
          originId,
          destinationId,
          senderContactId,
          receiverContactId,
        }),
      );
      resetSteps();
      router.push(`/parcel/track/${result.trackingNumber}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
    return;
  }, [
    parcel,
    sendFrom,
    sendTo,
    senderContact,
    receiverContact,
    resetSteps,
    getAddressId,
    getContactId,
    createParcel,
    router,
  ]);

  useEffect(() => {
    if (!parcel || !sendFrom || !sendTo || !senderContact || !receiverContact) {
      resetSteps();
      toast.error("Something went wrong. Please try again.");
      return;
    }
  }, [parcel, sendFrom, sendTo, senderContact, receiverContact, resetSteps]);

  return (
    <div className="space-y-6">
      <H2>Select Your Payment Method</H2>
      <PaymentMethods selected={selected} setSelected={setSelected} />
      <Button disabled={!selected || loading} onClick={onSubmit}>
        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        Pay
      </Button>
    </div>
  );
};

export default Payment;
