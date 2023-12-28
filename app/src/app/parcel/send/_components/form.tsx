"use client";

import Stepper from "./stepper";
import { Button } from "@/components/ui/button";
import { useSessionStorage } from "@/lib/clientUtils";

const StepDeliveryIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <polygon
      fill="currentColor"
      points="2.75,3.815918 8.190918,1.095459 6,0 0.559082,2.720459 "
    ></polygon>
    <polygon
      fill="currentColor"
      points="9.309082,1.654541 3.8681641,4.375 6,5.440918 11.440918,2.720459 "
    ></polygon>
    <polygon
      fill="currentColor"
      points="5.5,6.309082 0,3.559082 0,9.25 5.5,12 "
    ></polygon>
    <polygon
      fill="currentColor"
      points="6.5,6.309082 6.5,12 12,9.25 12,3.559082 "
    ></polygon>
  </svg>
);
const StepPersonalInfoIcon = () => (
  <svg
    className="h-4 w-4"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 16"
  >
    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
  </svg>
);

const StepSummaryIcon = () => (
  <svg
    className="h-4 w-4"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 20"
  >
    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
  </svg>
);

const StepPaymentIcon = () => (
  <svg
    className="h-4 w-4"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 20"
  >
    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
  </svg>
);

const steps = [
  {
    title: "Delivery type",
    details: "Choose how you want to send your parcel",
    icon: <StepDeliveryIcon />,
  },
  {
    title: "Sender and recipient",
    details: "Enter the sender and recipient details",
    icon: <StepPersonalInfoIcon />,
  },
  {
    title: "Order summary",
    details: "Check the order summary",
    icon: <StepSummaryIcon />,
  },
  {
    title: "Payment",
    details: "Choose the payment method",
    icon: <StepPaymentIcon />,
  },
];

const DeliveryType = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div>
      <Button onClick={nextStep}>Next</Button>
    </div>
  );
};
const PersonalInfo = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div>
      <Button onClick={nextStep}>Next</Button>
    </div>
  );
};
const OrderSummary = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div>
      <Button onClick={nextStep}>Next</Button>
    </div>
  );
};
const Payment = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <div>
      <Button onClick={nextStep}>Next</Button>
    </div>
  );
};

const SendForm = () => {
  const [step, setStep] = useSessionStorage("step", 1);

  return (
    <div className="flex gap-4 px-4 py-6">
      <Stepper steps={steps} current={step} />
      <div className="relative w-full">
        {step === 1 && <DeliveryType nextStep={() => setStep(2)} />}
        {step === 2 && <PersonalInfo nextStep={() => setStep(3)} />}
        {step === 3 && <OrderSummary nextStep={() => setStep(4)} />}
        {step === 4 && <Payment nextStep={() => setStep(5)} />}
        <Button
          className="absolute right-0 top-0"
          variant={"ghost"}
          onClick={() => {
            setStep(1);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SendForm;
