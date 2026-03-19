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

const testimonials = [
  {
    feedback: "SPOT is the best. Fast and reliable.",
    name: "John Doe",
  },
  {
    feedback: "I love the real-time tracking feature.",
    name: "Jane Smith",
  },
  {
    feedback: "SPOT has made sending parcels so easy.",
    name: "Mary Johnson",
  },
];

const heroStats = [
  { value: "24/7", label: "tracking updates" },
  { value: "2 min", label: "to create a shipment" },
  { value: "99%", label: "delivery visibility" },
];

const PlaceholderPhoto = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border bg-muted text-sm font-semibold text-muted-foreground">
        {initials}
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">SPOT customer</p>
      </div>
    </div>
  );
};

function Component({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="flex min-h-screen flex-col gap-8 pb-10 md:gap-12 md:pb-14 lg:gap-14">
      <section className="pt-6 md:pt-8 lg:pt-10">
        <div className="relative overflow-hidden rounded-[2rem] border bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_42%),linear-gradient(180deg,_rgba(248,250,252,0.98)_0%,_rgba(255,255,255,1)_100%)] px-6 py-8 shadow-sm dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.12),_transparent_42%),linear-gradient(180deg,_rgba(15,23,42,0.96)_0%,_rgba(2,6,23,1)_100%)] md:px-10 md:py-10 lg:px-12 lg:py-12">
          <div className="absolute -left-16 top-14 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-12 bottom-8 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-12">
            <div className="flex flex-col items-start text-left">
              <span className="inline-flex items-center rounded-full border bg-background/80 px-4 py-1 text-sm font-medium text-muted-foreground backdrop-blur">
                Fast, trackable parcel delivery
              </span>

              <div className="mt-6 space-y-5">
                <h1 className="max-w-3xl text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/[1.02]">
                  Send and track parcels without the usual hassle
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  SPOT keeps delivery simple from pickup to drop-off, with
                  real-time updates, secure handoffs, and a flow that feels easy
                  to trust from the first click.
                </p>
              </div>

              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="min-w-[12rem] shadow-xl shadow-primary/20"
                >
                  <Link href={loggedIn ? "/parcel/send" : "/auth/signin"}>
                    Send a Parcel
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-w-[12rem] bg-background/70 backdrop-blur"
                >
                  <Link href="/parcel/view">Track a Parcel</Link>
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                No phone calls, no guesswork, no hunting for updates.
              </p>

              <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border bg-background/75 px-4 py-4 backdrop-blur"
                  >
                    <p className="text-2xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute left-6 top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute bottom-10 right-2 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[1.75rem] border bg-background/90 p-5 shadow-2xl shadow-primary/10 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Shipment overview
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                      Riga to doorstep
                    </p>
                  </div>
                  <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Live
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-muted/70 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Tracking ID</span>
                    <span className="text-muted-foreground">SP-2048-DEL</span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="flex items-start gap-3 rounded-xl bg-background px-4 py-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <PencilIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Booking confirmed</p>
                        <p className="text-sm text-muted-foreground">
                          Parcel details submitted in under two minutes.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-background px-4 py-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <ParcelIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Courier pickup scheduled</p>
                        <p className="text-sm text-muted-foreground">
                          Pickup window locked in for this afternoon.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-background px-4 py-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                        <LocateIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Real-time tracking active</p>
                        <p className="text-sm text-muted-foreground">
                          Every checkpoint appears instantly for sender and
                          receiver.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-background px-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Delivery confidence
                    </p>
                    <p className="mt-2 text-xl font-semibold">Secure handoff</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Clear status changes from pickup to destination.
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-background px-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Customer promise
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      Fewer surprises
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      A calmer experience for both sender and receiver.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full rounded-3xl bg-muted/70 py-12 md:py-14 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Built for a smoother delivery experience
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything on the service is designed to help you send faster and
              worry less.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
            <div className="flex flex-col items-center rounded-2xl bg-background px-6 py-8 text-center shadow-sm">
              <ParcelIcon className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                We ensure your parcels are delivered in the shortest time
                possible.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-background px-6 py-8 text-center shadow-sm">
              <LocateIcon className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Receive updates in real time, from pickup to delivery.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-background px-6 py-8 text-center shadow-sm">
              <ShieldCheckIcon className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Secure Delivery</h3>
              <p className="text-muted-foreground">
                We ensure your parcels are delivered safely and securely.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-2 md:py-4">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three simple steps take care of the full journey.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
            <div className="flex flex-col items-center rounded-2xl border bg-background px-6 py-8 text-center">
              <PencilIcon className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">1. Fill the Form</h3>
              <p className="text-muted-foreground">
                Fill out the parcel details form and submit.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl border bg-background px-6 py-8 text-center">
              <ParcelIcon className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">2. We Pick Up</h3>
              <p className="text-muted-foreground">
                We pick up your parcel from your location.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl border bg-background px-6 py-8 text-center">
              <LocateIcon className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">3. Track and Receive</h3>
              <p className="text-muted-foreground">
                Receive live updates and get it at your destination.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full rounded-3xl bg-muted/70 py-12 md:py-14 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-muted-foreground">
              A few quick words from people already using SPOT.
            </p>
          </div>
          <div className="mt-10 grid items-center gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
            {testimonials.map((testimonial) => (
              <div
                className="h-full rounded-2xl bg-background p-6 shadow-sm"
                key={testimonial.name}
              >
                <PlaceholderPhoto name={testimonial.name} />
                <Blockquote className="mt-6 text-muted-foreground">
                  {testimonial.feedback}
                </Blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-4 md:py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center rounded-3xl border bg-background px-6 py-12 text-center shadow-sm md:px-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Send Your Parcel?
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Start a shipment in a couple of minutes and follow it all the way
              through delivery.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 min-w-[12rem] shadow-lg shadow-primary/20"
            >
              <Link href={loggedIn ? "/parcel/send" : "/auth/signin"}>
                Send Parcel
              </Link>
            </Button>
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
