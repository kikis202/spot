import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { getAdminSession } from "~/helpers/auth/getAuthSession";

const AdminPage = async ({ children }: PropsWithChildren) => {
  const session = await getAdminSession();

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
};

export default AdminPage;
