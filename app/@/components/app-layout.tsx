import { getServerAuthSession } from "~/server/auth";

import { type PropsWithChildren } from "react";
import { Navbar } from "./navbar";
import Link from "next/link";

const Footer = () => (
  <footer className="flex items-center justify-center bg-muted p-6">
    <nav className="space-x-4">
      <Link className="text-sm font-medium hover:underline" href="/tos">
        Terms of Service
      </Link>
      <Link className="text-sm font-medium hover:underline" href="/privacy">
        Privacy Policy
      </Link>
      <Link className="text-sm font-medium hover:underline" href="/faq">
        FAQ
      </Link>
    </nav>
    <div />
  </footer>
);

export const MainLayout = async ({ children }: PropsWithChildren) => {
  const session = await getServerAuthSession();
  const role = session?.user?.role ?? "default";

  return (
    <>
      <main>
        <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col px-4">
          <Navbar role={role} />
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};
