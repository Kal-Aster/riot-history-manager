import { __ } from "riot";

export const ROUTER: unique symbol = Symbol("router");

export const UNROUTE_METHOD: unique symbol = Symbol("unroute");

export const CURRENT_ROUTE_INDEX: unique symbol = Symbol("current-route-index");
export const LAST_ROUTED: unique symbol = Symbol("last-routed");
export const TEST_LAST_ROUTED: unique symbol = Symbol("test-last-routed");

export const IS_UNMOUNTING = Symbol("is-unmounting");

export const PARENT_KEY_SYMBOL: unique symbol = __.globals.PARENT_KEY_SYMBOL as any;
