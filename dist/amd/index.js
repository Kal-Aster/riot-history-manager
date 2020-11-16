define(['riot', 'history-manager', './constants-3a92086f', './router', './route', './navigate'], function (riot, historyManager, constants, router, route, navigate) { 'use strict';

	riot.register("router", router);
	riot.register("route", route);
	riot.register("navigate", navigate);

});
