import { Router } from 'history-manager';
import { I as IS_ROUTER, U as UNROUTE_METHOD, R as ROUTER, c as claim, L as LAST_ROUTED, r as release } from './loading-bar-f0ee8038.js';

var RouterComponent = {
  'css': null,

  'exports': {
    onBeforeMount() {
        this.root[IS_ROUTER] = true;
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

    onUnmounted() {
        delete this.root[IS_ROUTER];
    },

    [LAST_ROUTED]: null
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<slot expr8="expr8"></slot>', [{
      'type': bindingTypes.SLOT,
      'attributes': [],
      'name': 'default',
      'redundantAttribute': 'expr8',
      'selector': '[expr8]'
    }]);
  },

  'name': 'router'
};

export default RouterComponent;
