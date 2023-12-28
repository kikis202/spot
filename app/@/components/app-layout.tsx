import { getServerAuthSession } from "~/server/auth";

import { type PropsWithChildren } from "react";
import { Navbar } from "./navbar";

export const MainLayout = async ({ children }: PropsWithChildren) => {
  const session = await getServerAuthSession();
  const role = session?.user?.role ?? "default";

  return (
    <main>
      <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col px-4">
        <Navbar role={role} />
        {children}
      </div>
    </main>
  );
};
