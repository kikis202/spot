"use client";

import { CreditCardIcon, IdIcon, ParcelIcon, SummaryIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getSessionStorageValue } from "@/lib/clientUtils";
import { useCallback, useEffect, useState } from "react";
import DeliveryType from "./_deliveryType/deliveryTypeForm";
import OrderSummary from "./_orderSummary/orderSummary";
import Payment from "./_payment/payment";
import PersonalInfo from "./_personalInfo/personalInfoForm";
import Stepper from "./stepper";

const steps = [
  {
    title: "Delivery type",
    details: "Choose how you want to send your parcel",
    icon: <ParcelIcon />,
  },
  {
    title: "Sender and recipient",
    details: "Enter the sender and recipient details",
    icon: <IdIcon />,
  },
  {
    title: "Order summary",
    details: "Check the order summary",
    icon: <SummaryIcon />,
  },
  {
    title: "Payment",
    details: "Choose the payment method",
    icon: <CreditCardIcon className="h-5 w-5" />,
  },
];

const SendForm = () => {
  const [step, setStep] = useState(1);
  const [resetKey, setResetKey] = useState(0);

  const reset = useCallback(() => {
    window.sessionStorage.clear();

    setStep(1);
    setResetKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    const deliveryType = getSessionStorageValue("deliveryType", {});
    const personalInfo = getSessionStorageValue("personalInfo", {});
    const orderSummary = getSessionStorageValue("orderSummary", {});
    const payment = getSessionStorageValue("payment", {});

    if (Object.keys(payment).length > 0) setStep(5);
    else if (Object.keys(orderSummary).length > 0) setStep(4);
    else if (Object.keys(personalInfo).length > 0) setStep(3);
    else if (Object.keys(deliveryType).length > 0) setStep(2);
  }, []);

  return (
    <div className="flex gap-8 px-4 py-6">
      <Stepper steps={steps} current={step} />
      <div className="relative w-full">
        {step === 1 && (
          <DeliveryType key={resetKey} nextStep={() => setStep(2)} />
        )}
        {step === 2 && (
          <PersonalInfo nextStep={() => setStep(3)} resetSteps={reset} />
        )}
        {step === 3 && (
          <OrderSummary
            nextStep={() => setStep(4)}
            setStep={setStep}
            resetSteps={reset}
          />
        )}
        {step === 4 && <Payment resetSteps={reset} />}
        <div className="absolute right-0 top-0 space-x-4">
          {step !== 1 && (
            <Button
              variant={"ghost"}
              onClick={() => setStep((current) => current - 1)}
            >
              Back
            </Button>
          )}
          <Button variant={"ghost"} onClick={reset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendForm;
