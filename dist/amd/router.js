define(['history-manager', 'riot', './misc-32c8078b'], function (historyManager, riot, misc) { 'use strict';

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
        return template('<slot expr0="expr0"></slot>', [{
          'type': bindingTypes.SLOT,

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'router',

            'evaluate': function(scope) {
              return scope;
            }
          }],

          'name': 'default',
          'redundantAttribute': 'expr0',
          'selector': '[expr0]'
        }]);
      },

      'name': 'router'
    };

    return RouterComponent;

});
