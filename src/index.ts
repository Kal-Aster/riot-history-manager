/**
 * Giuliano Collacchioni: 2019
 */

import * as loadingBar from "./loading-bar";

import RouterComponent from "./rhm-router.riot";
import RouteComponent from "./rhm-route.riot";
import NavigateComponent from "./rhm-navigate.riot";

import { register } from "riot";

register("rhm-router", RouterComponent);
register("rhm-route", RouteComponent);
register("rhm-navigate", NavigateComponent);

// tslint:disable-next-line:typedef
const components = {
    "rhm-router": RouterComponent,
    "rhm-route": RouteComponent,
    "rhm-navigate": NavigateComponent
};

export { components, loadingBar };