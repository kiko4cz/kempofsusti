/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as camps from "../camps.js";
import type * as content from "../content.js";
import type * as debug from "../debug.js";
import type * as files from "../files.js";
import type * as gallery from "../gallery.js";
import type * as http from "../http.js";
import type * as migrate from "../migrate.js";
import type * as news from "../news.js";
import type * as seed from "../seed.js";
import type * as seedHistory from "../seedHistory.js";
import type * as settings from "../settings.js";
import type * as sponsors from "../sponsors.js";
import type * as stats from "../stats.js";
import type * as team from "../team.js";
import type * as user from "../user.js";
import type * as whoami from "../whoami.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  camps: typeof camps;
  content: typeof content;
  debug: typeof debug;
  files: typeof files;
  gallery: typeof gallery;
  http: typeof http;
  migrate: typeof migrate;
  news: typeof news;
  seed: typeof seed;
  seedHistory: typeof seedHistory;
  settings: typeof settings;
  sponsors: typeof sponsors;
  stats: typeof stats;
  team: typeof team;
  user: typeof user;
  whoami: typeof whoami;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
