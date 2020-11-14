'use strict';

require('history-manager');
var riot = require('riot');
require('./misc-bb6a22fa.js');
var router = require('./router.js');
var route = require('./route.js');
var navigate = require('./navigate.js');

riot.register("router", router);
riot.register("route", route);
riot.register("navigate", navigate);
