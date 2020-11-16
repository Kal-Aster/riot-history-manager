define(['history-manager', './constants-3a92086f'], function (historyManager, constants) { 'use strict';

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
        return template('<slot expr2="expr2"></slot>', [{
          'type': bindingTypes.SLOT,

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'router',

            'evaluate': function(scope) {
              return scope;
            }
          }],

          'name': 'default',
          'redundantAttribute': 'expr2',
          'selector': '[expr2]'
        }]);
      },

      'name': 'router'
    };

    return RouterComponent;

});
