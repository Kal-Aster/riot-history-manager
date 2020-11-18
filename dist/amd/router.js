define(['history-manager', './loading-bar-e86c6d04'], function (historyManager, loadingBar) { 'use strict';

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
        return template('<slot expr2="expr2"></slot>', [{
          'type': bindingTypes.SLOT,
          'attributes': [],
          'name': 'default',
          'redundantAttribute': 'expr2',
          'selector': '[expr2]'
        }]);
      },

      'name': 'router'
    };

    return RouterComponent;

});
