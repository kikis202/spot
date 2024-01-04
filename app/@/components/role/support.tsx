import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { getSupportSession } from "~/helpers/auth/getAuthSession";

const SupportPage = async ({ children }: PropsWithChildren) => {
  const session = await getSupportSession();

  if (!session) {
    notFound();
  }

  return <>{children}</>;
};

export default SupportPage;
