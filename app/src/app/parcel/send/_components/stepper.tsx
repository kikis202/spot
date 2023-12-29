import { cn } from "@/lib/utils";

const StepDoneIcon = () => (
  <svg
    className="h-4 w-4 text-green-400"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 12"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M1 5.917 5.724 10.5 15 1.5"
    />
  </svg>
);

type Step = {
  icon: React.ReactNode;
  title: string;
  details: string;
};

const Stepper = ({ steps, current }: { steps: Step[]; current: number }) => {
  return (
    <div className="ps-6">
      <ol className="relative border-s border-muted-foreground dark:border-muted">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className={cn(
              i === current - 1 ? "text-primary" : "text-muted-foreground",
              i + 1 < steps.length ? "mb-12" : "",
              "ps-8",
            )}
          >
            <span className="absolute -start-6 flex h-12 w-12 items-center justify-center rounded-full border border-muted-foreground bg-primary-foreground dark:border-0 dark:bg-muted">
              {i > current - 2 ? step.icon : <StepDoneIcon />}
            </span>
            <div className="flex h-12 flex-col justify-center">
              <h3 className="font-medium leading-tight">{step.title}</h3>
              <p className="text-sm">{step.details}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Stepper;
