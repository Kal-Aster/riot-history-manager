import { register, mount } from "riot";
import { loadingBar } from "../../src/index";
import TestComponent from "./test.riot";

loadingBar.setColor("#fff");

register("test", TestComponent);
mount("test");