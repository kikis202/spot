import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { getSupportSession } from "~/helpers/auth/getAuthSession";

const SupportPage = async ({ children }: PropsWithChildren) => {
  const session = await getSupportSession();

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
};

export default SupportPage;
