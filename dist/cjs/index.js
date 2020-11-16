'use strict';

var riot = require('riot');
require('history-manager');
require('./constants-85f206eb.js');
var router = require('./router.js');
var route = require('./route.js');
var navigate = require('./navigate.js');

riot.register("router", router);
riot.register("route", route);
riot.register("navigate", navigate);
