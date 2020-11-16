'use strict';

var historyManager = require('history-manager');
var constants = require('./constants-85f206eb.js');

var RouterComponent = {
  'css': null,

  'exports': {
    onBeforeMount() {
        this[constants.UNROUTE_METHOD] = () => {};
        this[constants.ROUTER] = historyManager.Router.create();
    },

    onMounted() {
        this[constants.ROUTER].route("(.*)", () => {
            this[constants.LAST_ROUTED] = null;
            this[constants.UNROUTE_METHOD]();
            this[constants.UNROUTE_METHOD] = () => {};
        });
    },

    [constants.LAST_ROUTED]: null
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
