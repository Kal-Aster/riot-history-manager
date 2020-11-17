'use strict';

var historyManager = require('history-manager');
var loadingBar = require('./loading-bar-b1a5cbaa.js');

var RouterComponent = {
  'css': null,

  'exports': {
    onBeforeMount() {
        this[loadingBar.UNROUTE_METHOD] = () => {};
        this[loadingBar.ROUTER] = historyManager.Router.create();
    },

    onMounted() {
        this[loadingBar.ROUTER].route("(.*)", () => {
            loadingBar.claim(this); loadingBar.release(this);
            this[loadingBar.LAST_ROUTED] = null;
            this[loadingBar.UNROUTE_METHOD]();
            this[loadingBar.UNROUTE_METHOD] = () => {};
        });
    },

    [loadingBar.LAST_ROUTED]: null
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
