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
import { useMemo, useState } from "react";
import type { z } from "zod";
import { finalDataSchema } from "../_orderSummary/orderSummary";

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

const PaymentMethods = () => {
  const [selected, setSelected] = useState<PaymentMethodName | null>(null);

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

const Payment = () => {
  const { parcel, sendFrom, sendTo, senderContact, receiverContact } = useMemo<
    Partial<z.infer<typeof finalDataSchema>>
  >(() => {
    try {
      return finalDataSchema.parse(getSessionStorageValue("orderSummary", {}));
    } catch (error) {
      return {};
    }
  }, []);

  return (
    <div className="space-y-6">
      <H2>Select Your Payment Method</H2>
      <PaymentMethods />
      <Button
        onClick={() => {
          return;
        }}
      >
        Pay
      </Button>
    </div>
  );
};

export default Payment;
