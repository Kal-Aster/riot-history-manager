import { Router } from 'history-manager';
import 'riot';
import { U as UNROUTE_METHOD, R as ROUTER, L as LAST_ROUTED } from './misc-5fdab1b7.js';

var RouterComponent = {
  'css': null,

  'exports': {
    onBeforeMount() {
        this[UNROUTE_METHOD] = () => {};
        this[ROUTER] = Router.create();
    },

    onMounted() {
        this[ROUTER].route("(.*)", () => {
            this[LAST_ROUTED] = null;
            this[UNROUTE_METHOD]();
            this[UNROUTE_METHOD] = () => {};
        });
    },

    [LAST_ROUTED]: null
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<slot expr8="expr8"></slot>', [{
      'type': bindingTypes.SLOT,

      'attributes': [{
        'type': expressionTypes.ATTRIBUTE,
        'name': 'router',

        'evaluate': function(scope) {
          return scope;
        }
      }],

      'name': 'default',
      'redundantAttribute': 'expr8',
      'selector': '[expr8]'
    }]);
  },

  'name': 'router'
};

export default RouterComponent;
