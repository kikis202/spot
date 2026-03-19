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
import { SignOutAction } from "../_components/auth-actions";

type SignOutPageProps = {
  searchParams: {
    callbackUrl?: string;
  };
};

const getSafeCallbackUrl = (callbackUrl?: string) => {
  if (!callbackUrl || !callbackUrl.startsWith("/")) return "/";
  return callbackUrl;
};

const SignOutPage = async ({ searchParams }: SignOutPageProps) => {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/");
  }

  const callbackUrl = getSafeCallbackUrl(searchParams.callbackUrl);

  return (
    <MainLayout>
      <div className="flex flex-1 items-center justify-center py-16">
        <Card className="w-full max-w-lg border-border/60 shadow-lg">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl">Sign out of SPOT</CardTitle>
            <CardDescription className="text-base">
              You can sign back in anytime to keep tracking shipments and
              managing parcel updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SignOutAction callbackUrl={callbackUrl} />
            <Muted className="mt-0">
              Signed in as {session.user.email ?? "your account"}.
            </Muted>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SignOutPage;
