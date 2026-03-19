import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

const createContext = cache(async () => {
  return createInnerTRPCContext({
    headers: new Headers(headers()),
  });
});

export const api = cache(async () => {
  return appRouter.createCaller(await createContext());
});
