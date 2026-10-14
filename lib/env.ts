/**
 * Environment variables validation hub.
 * Re-exports validated clientEnv and serverEnv.
 * Note: Importing this file pulls in "server-only" due to serverEnv,
 * preventing any server secrets from reaching the client bundle.
 * Client components must import from "@/lib/env.client".
 */

export * from "./env.client";
export * from "./env.server";
