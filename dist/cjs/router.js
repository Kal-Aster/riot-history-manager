'use strict';

var historyManager = require('history-manager');
require('riot');
var misc = require('./misc-bb6a22fa.js');

var RouterComponent = {
  'css': null,

  'exports': {
    onBeforeMount() {
        this[misc.UNROUTE_METHOD] = () => {};
        this[misc.ROUTER] = historyManager.Router.create();
    },

    onMounted() {
        this[misc.ROUTER].route("(.*)", () => {
            this[misc.LAST_ROUTED] = null;
            this[misc.UNROUTE_METHOD]();
            this[misc.UNROUTE_METHOD] = () => {};
        });
    },

    [misc.LAST_ROUTED]: null
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<slot expr5="expr5"></slot>', [{
      'type': bindingTypes.SLOT,

      'attributes': [{
        'type': expressionTypes.ATTRIBUTE,
        'name': 'router',

        'evaluate': function(scope) {
          return scope;
        }
      }],

      'name': 'default',
      'redundantAttribute': 'expr5',
      'selector': '[expr5]'
    }]);
  },

  'name': 'router'
};

module.exports = RouterComponent;
