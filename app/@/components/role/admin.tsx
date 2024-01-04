import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { getAdminSession } from "~/helpers/auth/getAuthSession";

const AdminPage = async ({ children }: PropsWithChildren) => {
  const session = await getAdminSession();

  if (!session) {
    notFound();
  }

  return <>{children}</>;
};

export default AdminPage;
