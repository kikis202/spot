import { MainLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound({}) {
  return (
    <MainLayout>
      <div className="flex min-h-screen items-center justify-center  sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8 text-center">
          <div>
            <h2 className="text-9xl font-extrabold ">404</h2>
            <p className="mt-2 text-3xl font-extrabold ">
              Error - Parcel not found
            </p>
          </div>
          <p className="mt-2 text-lg text-muted-foreground">
            We&apos;re sorry, but the parcel you requested could not be found.
            Please check the tracking number and try again.
          </p>
          <div className="mt-5">
            <Link href="/parcel/view">
              <Button size="lg">Try again</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
