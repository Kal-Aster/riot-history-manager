import { Router } from 'history-manager';
import { U as UNROUTE_METHOD, R as ROUTER, c as claim, L as LAST_ROUTED, r as release } from './loading-bar-3e233626.js';

var RouterComponent = {
  'css': null,

  'exports': {
    onBeforeMount() {
        this[UNROUTE_METHOD] = () => {};
        this[ROUTER] = Router.create();
    },

    onMounted() {
        this[ROUTER].route("(.*)", () => {
            claim(this); release(this);
            this[LAST_ROUTED] = null;
            this[UNROUTE_METHOD]();
            this[UNROUTE_METHOD] = () => {};
        });
    },

    [LAST_ROUTED]: null
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<slot expr6="expr6"></slot>', [{
      'type': bindingTypes.SLOT,

      'attributes': [{
        'type': expressionTypes.ATTRIBUTE,
        'name': 'router',

        'evaluate': function(scope) {
          return scope;
        }
      }],

      'name': 'default',
      'redundantAttribute': 'expr6',
      'selector': '[expr6]'
    }]);
  },

  'name': 'router'
};

export default RouterComponent;
