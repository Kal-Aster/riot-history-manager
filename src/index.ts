/**
 * Giuliano Collacchioni: 2019
 */

import RouterComponent from "./router.riot";
import RouteComponent from "./route.riot";
import NavigateComponent from "./navigate.riot";

import * as riot from "riot";

riot.register("router", RouterComponent);
riot.register("route", RouteComponent);
riot.register("navigate", NavigateComponent);