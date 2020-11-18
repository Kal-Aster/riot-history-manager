'use strict';

var historyManager = require('history-manager');

var NavigateComponent = {
  'css': `navigate a[ref=-navigate-a],[is="navigate"] a[ref=-navigate-a]{ color: inherit; text-decoration: none; outline: none; }`,

  'exports': {
    onMounted() {
        this.root.style.cursor = "pointer";
        if (this.root.style.display === "") {
            this.root.style.display = "inline";
        }

        this.root.setAttribute("route-listener", "true");
        this.root.addEventListener("route", () => {
            this.update();
        });
        
        this.root.firstElementChild.addEventListener("click", event => {
            event.preventDefault();
            let href = this.href(false);
            if (href != null) {
                historyManager.Router.go(href, { replace: this.replace() });
            } else {
                let context = this.context();
                if (context) {
                    historyManager.Router.restoreContext(context);
                }
            }
            return false;
        });
    },

    onBeforeUpdate() {
        this._href = null;
    },

    replace() {
        if (typeof this.props.replace !== "boolean") {
            return (this.props.replace != null && this.props.replace !== "false") || this.props.replace === "";
        }
        return this.props.replace;
    },

    href(toA = true) {
        if (typeof this.props.href !== "string") {
            if (toA) {
                const context = this.context();
                return context != null ? historyManager.Router.getContextDefaultOf(context) : null;
            }
            return null;
        }
        if (this._href == null) {
            this._href = historyManager.Router.getLocation().hrefIf(this.props.href);
            // console.log("got href", this._href, "from", this.props.href, "and", Router.location.href, this.root);
        }
        return this._href; // (toA ? Router.base : "") + this._href;
    },

    context() {
        if (typeof this.props.context !== "string") {
            return null;
        }
        return this.props.context;
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<a expr4="expr4" ref="-navigate-a"><slot expr5="expr5"></slot></a>', [{
      'redundantAttribute': 'expr4',
      'selector': '[expr4]',

      'expressions': [{
        'type': expressionTypes.ATTRIBUTE,
        'name': 'href',

        'evaluate': function(scope) {
          return "#" + scope.href();
        }
      }, {
        'type': expressionTypes.ATTRIBUTE,
        'name': 'style',

        'evaluate': function(scope) {
          return ['display: ', scope.root.style.display, '; width: 100%; height: 100%;'].join('');
        }
      }]
    }, {
      'type': bindingTypes.SLOT,
      'attributes': [],
      'name': 'default',
      'redundantAttribute': 'expr5',
      'selector': '[expr5]'
    }]);
  },

  'name': 'navigate'
};

module.exports = NavigateComponent;
