import { cn } from "@/lib/utils";
import "~/styles/globals.css";

export const H1 = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h1
      className={cn(
        className,
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      )}
    >
      {children}
    </h1>
  );
};

export const H2 = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h2
      className={cn(
        className,
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      )}
    >
      {children}
    </h2>
  );
};

export const H3 = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h3
      className={cn(
        className,
        "scroll-m-20 text-2xl font-semibold tracking-tight",
      )}
    >
      {children}
    </h3>
  );
};

export const P = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p className={cn(className, "leading-7 [&:not(:first-child)]:mt-6")}>
      {children}
    </p>
  );
};

export const Muted = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p className={cn(className, "text-sm text-muted-foreground")}>
      {children}
    </p>
  );
};

export const Blockquote = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <blockquote className={cn(className, "mt-6 border-l-2 pl-6 italic")}>
      {children}
    </blockquote>
  );
};
