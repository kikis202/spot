import { redirect } from "next/navigation";

import { MainLayout } from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Muted } from "@/components/ui/typography";
import { getServerAuthSession } from "~/server/auth";
import { SignInAction } from "../_components/auth-actions";

const getSafeCallbackUrl = (callbackUrl?: string) => {
  if (!callbackUrl || !callbackUrl.startsWith("/")) return "/";
  return callbackUrl;
};

const getErrorMessage = (error?: string) => {
  if (!error) return null;

  if (error === "OAuthAccountNotLinked") {
    return "This email is already linked to another sign-in method.";
  }

  return "We could not sign you in. Please try again.";
};

type SignInPageProps = {
  searchParams: {
    callbackUrl?: string;
    error?: string;
  };
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const session = await getServerAuthSession();
  const callbackUrl = getSafeCallbackUrl(searchParams.callbackUrl);

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <MainLayout>
      <div className="flex flex-1 items-center justify-center py-16">
        <Card className="w-full max-w-lg border-border/60 shadow-lg">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl">Sign in to SPOT</CardTitle>
            <CardDescription className="text-base">
              Continue to manage parcels, tracking, and deliveries in the same
              dashboard you already use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SignInAction callbackUrl={callbackUrl} />
            {getErrorMessage(searchParams.error) && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {getErrorMessage(searchParams.error)}
              </div>
            )}
            <Muted className="mt-0">
              Authentication is handled with your Google account.
            </Muted>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SignInPage;
