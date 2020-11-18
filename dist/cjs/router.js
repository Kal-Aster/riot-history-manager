'use strict';

var historyManager = require('history-manager');
var loadingBar = require('./loading-bar-04e175f2.js');

var RouterComponent = {
  'css': null,

  'exports': {
    onBeforeMount() {
        this.root[loadingBar.IS_ROUTER] = true;
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

    onUnmounted() {
        delete this.root[loadingBar.IS_ROUTER];
    },

    [loadingBar.LAST_ROUTED]: null
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<slot expr3="expr3"></slot>', [{
      'type': bindingTypes.SLOT,
      'attributes': [],
      'name': 'default',
      'redundantAttribute': 'expr3',
      'selector': '[expr3]'
    }]);
  },

  'name': 'router'
};

module.exports = RouterComponent;
