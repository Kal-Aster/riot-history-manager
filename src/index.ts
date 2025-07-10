/**
 * Giuliano Collacchioni: 2019
 */
import { register } from "riot";

import init from "./custom-event-handling/init";

import * as loadingBar from "./loading-bar";

import RhmNavigate from "./rhm-navigate.riot";
import RhmRouter from "./rhm-router.riot";
import RhmRoute from "./rhm-route.riot";

init();

register("rhm-navigate", RhmNavigate);
register("rhm-router", RhmRouter);
register("rhm-route", RhmRoute);

// tslint:disable-next-line:typedef
const components = {
    RhmNavigate,
    RhmRouter,
    RhmRoute
};

export { components, loadingBar };