import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { getUserSession } from "~/helpers/auth/getAuthSession";

const UserPage = async ({ children }: PropsWithChildren) => {
  const session = await getUserSession();

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
};

export default UserPage;
