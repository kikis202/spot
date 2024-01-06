import { MainLayout } from "@/components/app-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LocateIcon,
  ParcelIcon,
  PencilIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import { getServerAuthSession } from "~/server/auth";
import { Blockquote } from "@/components/ui/typography";

function Component({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="flex flex-col items-center justify-center py-12 md:py-24 lg:py-32">
        <h1 className="mt-8 text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
          Send and Track Parcels with Ease!
        </h1>
      </section>
      <section className="w-full rounded-2xl bg-muted md:py-16 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4">
              <ParcelIcon className="h-12 w-12" />
              <h3 className="text-xl font-bold">Fast Delivery</h3>
              <p className="text-muted-foreground ">
                We ensure your parcels are delivered in the shortest time
                possible.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <LocateIcon className="h-12 w-12" />
              <h3 className="text-xl font-bold">Real-time Updates</h3>
              <p className="text-muted-foreground ">
                Recieve updates in real-time, from pickup to delivery.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <ShieldCheckIcon className="h-12 w-12" />
              <h3 className="text-xl font-bold">Secure Delivery</h3>
              <p className="text-muted-foreground ">
                We ensure your parcels are delivered safely and securely.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl">
            How It Works
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4">
              <PencilIcon className="h-12 w-12" />
              <h3 className="text-xl font-bold">1. Fill the Form</h3>
              <p className="text-muted-foreground ">
                Fill out the parcel details form and submit.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <ParcelIcon className="h-12 w-12" />
              <h3 className="text-xl font-bold">2. We Pick Up</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We pick up your parcel from your location.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <LocateIcon className="h-12 w-12" />
              <h3 className="text-xl font-bold">3. Track and Receive</h3>
              <p className="text-muted-foreground ">
                Recieve live updates and receive it at your destination.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full rounded-2xl bg-muted md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl">
            What Our Customers Say
          </h2>
          <div className="mt-8 grid items-center gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="h-fit rounded-md bg-primary-foreground p-6 shadow">
              <Blockquote className="text-muted-foreground ">
                SPOT is the best. Fast and reliable.
              </Blockquote>
              <p className="mt-4 text-sm font-medium">- John Doe</p>
            </div>
            <div className="h-fit rounded-md bg-primary-foreground p-6 shadow">
              <Blockquote className="text-muted-foreground ">
                I love the real-time tracking feature.
              </Blockquote>
              <p className="mt-4 text-sm font-medium">- Jane Smith</p>
            </div>
            <div className="h-fit rounded-md bg-primary-foreground p-6 shadow">
              <Blockquote className="text-muted-foreground ">
                SPOT has made sending parcels so easy.
              </Blockquote>
              <p className="mt-4 text-sm font-medium">- Mary Johnson</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Ready to Send Your Parcel?
            </h2>
            <Link href={loggedIn ? "/parcel/send" : "/api/auth/signin"}>
              <Button className="mt-4">Send Parcel</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const Home = async () => {
  const session = await getServerAuthSession();
  const loggedIn = !!session?.user;

  return (
    <>
      <MainLayout>
        <Component loggedIn={loggedIn} />
      </MainLayout>
    </>
  );
};

export default Home;
