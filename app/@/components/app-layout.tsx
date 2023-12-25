import { getServerAuthSession } from "~/server/auth";

import { type PropsWithChildren } from "react";
import { Navbar } from "./navbar";

export const MainLayout = async ({ children }: PropsWithChildren) => {
  const session = await getServerAuthSession();
  const role = session?.user?.role ?? "default";

  return (
    <main>
      <div className="flex min-h-screen flex-col max-w-screen-2xl mx-auto">
        <Navbar role={role} />
        {children}
      </div>
    </main>
  );
};
