define(['riot', 'history-manager', './loading-bar-e86c6d04', './router', './route', './navigate'], function (riot, historyManager, loadingBar, router, route, navigate) { 'use strict';

	riot.register("router", router);
	riot.register("route", route);
	riot.register("navigate", navigate);

});
