import { __ } from "riot";

export const ONBEFOREROUTE: unique symbol = Symbol("onbeforeroute");
export const ONUNROUTE: unique symbol = Symbol("onunroute");
export const ONROUTE: unique symbol = Symbol("onroute");

export const DOM_COMPONENT_INSTANCE_PROPERTY: unique symbol = __.globals.DOM_COMPONENT_INSTANCE_PROPERTY as any;