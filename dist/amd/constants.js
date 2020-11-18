define(['exports'], function (exports) { 'use strict';

	var ROUTER = Symbol("router");
	var BASE = Symbol("base");
	var PARENT_ROUTE = Symbol("parent_route");
	var PARENT_ROUTER = Symbol("parent-router");
	var IS_ROUTER = Symbol("is-router");
	var UNROUTE_METHOD = Symbol("unroute");
	var LAST_ROUTED = Symbol("last-routed");

	exports.BASE = BASE;
	exports.IS_ROUTER = IS_ROUTER;
	exports.LAST_ROUTED = LAST_ROUTED;
	exports.PARENT_ROUTE = PARENT_ROUTE;
	exports.PARENT_ROUTER = PARENT_ROUTER;
	exports.ROUTER = ROUTER;
	exports.UNROUTE_METHOD = UNROUTE_METHOD;

	Object.defineProperty(exports, '__esModule', { value: true });

});
