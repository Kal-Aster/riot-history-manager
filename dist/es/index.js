import { register } from 'riot';
import 'history-manager';
import './loading-bar-3e233626.js';
import RouterComponent from './router.js';
import RouteComponent from './route.js';
import NavigateComponent from './navigate.js';

register("router", RouterComponent);
register("route", RouteComponent);
register("navigate", NavigateComponent);
