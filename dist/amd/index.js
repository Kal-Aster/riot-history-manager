define(['history-manager', 'riot', './misc-221747b5', './router', './route', './navigate'], function (historyManager, riot, misc, router, route, navigate) { 'use strict';

	riot.register("router", router);
	riot.register("route", route);
	riot.register("navigate", navigate);

});
