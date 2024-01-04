import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { getCourierSession } from "~/helpers/auth/getAuthSession";

const CourierPage = async ({ children }: PropsWithChildren) => {
  const session = await getCourierSession();

  if (!session) {
    notFound();
  }

  return <>{children}</>;
};

export default CourierPage;
