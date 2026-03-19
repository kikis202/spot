import "server-only";

import { type inferRouterProxyClient } from "@trpc/client";
import { createRecursiveProxy } from "@trpc/server/shared";
import { headers } from "next/headers";
import { cache } from "react";

import { appRouter, type AppRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

const createContext = cache(async () => {
  return createInnerTRPCContext({
    headers: new Headers(headers()),
  });
});

const createCaller = cache(async () => appRouter.createCaller(await createContext()));

export const api = createRecursiveProxy(async ({ path, args }) => {
  const procedureType = path.pop();
  const caller = await createCaller();

  if (
    procedureType !== "query" &&
    procedureType !== "mutate" &&
    procedureType !== "subscribe"
  ) {
    throw new Error(
      `Unsupported tRPC procedure type: ${procedureType ?? "<missing>"}`
    );
  }

  const procedure = path.reduce<unknown>((current, segment) => {
    return (current as Record<string, unknown>)[segment];
  }, caller);

  if (typeof procedure !== "function") {
    throw new Error(`Invalid tRPC procedure path: ${path.join(".")}`);
  }

  return (procedure as (input: unknown) => Promise<unknown>)(args[0]);
}) as inferRouterProxyClient<AppRouter>;
