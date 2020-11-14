define(['history-manager', 'riot', './misc-32c8078b', './router', './route', './navigate'], function (historyManager, riot, misc, router, route, navigate) { 'use strict';

	riot.register("router", router);
	riot.register("route", route);
	riot.register("navigate", navigate);

});
