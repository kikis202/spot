import { Role } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";

export const getUserSession = async () => {
  const session = await getServerAuthSession();

  if (session && session.user) return session;
};

export const getAdminSession = async () => {
  const session = await getServerAuthSession();

  return !!(session && session.user && session.user.role === Role.ADMIN);
};

export const getCourierSession = async () => {
  const session = await getServerAuthSession();

  return !!(
    session &&
    session.user &&
    (session.user.role === Role.COURIER || session.user.role === Role.ADMIN)
  );
};

export const getSupportSession = async () => {
  const session = await getServerAuthSession();

  return !!(
    session &&
    session.user &&
    (session.user.role === Role.SUPPORT || session.user.role === Role.ADMIN)
  );
};
