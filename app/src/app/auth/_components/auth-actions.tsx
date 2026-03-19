"use client";

import { useTransition } from "react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

type SignInActionProps = {
  callbackUrl: string;
};

export const SignInAction = ({ callbackUrl }: SignInActionProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="w-full"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await signIn("google", { callbackUrl });
        });
      }}
      size="lg"
      type="button"
    >
      {isPending ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
};

type SignOutActionProps = {
  callbackUrl: string;
};

export const SignOutAction = ({ callbackUrl }: SignOutActionProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        className="flex-1"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await signOut({ callbackUrl });
          });
        }}
        size="lg"
        type="button"
      >
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
      <Button asChild className="flex-1" size="lg" variant="outline">
        <Link href="/">Cancel</Link>
      </Button>
    </div>
  );
};
