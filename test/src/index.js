import { register, mount } from "riot";
import "../../src/index";
import TestComponent from "./test.riot";

register("test", TestComponent);
mount("test");