'use strict';

var riot = require('riot');
require('history-manager');
require('./loading-bar-04e175f2.js');
var router = require('./router.js');
var route = require('./route.js');
var navigate = require('./navigate.js');

riot.register("router", router);
riot.register("route", route);
riot.register("navigate", navigate);
