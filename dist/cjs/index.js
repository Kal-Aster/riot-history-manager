'use strict';

require('history-manager');
var riot = require('riot');
require('./misc-0f4d28db.js');
var router = require('./router.js');
var route = require('./route.js');
var navigate = require('./navigate.js');

riot.register("router", router);
riot.register("route", route);
riot.register("navigate", navigate);
