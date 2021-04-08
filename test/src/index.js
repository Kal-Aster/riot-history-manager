import { register, mount } from "riot";
import { loadingBar } from "../../src/index";
import TestComponent from "./rhm-test.riot";

loadingBar.setColor("#fff");

register("rhm-test", TestComponent);
mount("rhm-test");