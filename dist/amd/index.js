define(['riot', 'history-manager', './loading-bar-0213775c', './router', './route', './navigate'], function (riot, historyManager, loadingBar, router, route, navigate) { 'use strict';

	riot.register("router", router);
	riot.register("route", route);
	riot.register("navigate", navigate);

});
