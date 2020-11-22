/**
 * Giuliano Collacchioni: 2019
 */

import * as loadingBar from "./loading-bar";

import RouterComponent from "./router.riot";
import RouteComponent from "./route.riot";
import NavigateComponent from "./navigate.riot";

import { register } from "riot";

register("router", RouterComponent);
register("route", RouteComponent);
register("navigate", NavigateComponent);

// tslint:disable-next-line:typedef
const components = {
    router: RouterComponent,
    route: RouteComponent,
    navigate: NavigateComponent
};

export { components, loadingBar };