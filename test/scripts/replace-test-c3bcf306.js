define(['exports'], function (exports) { 'use strict';

    var replaceTest = {
      'css': null,

      'exports': {
        onBeforeMount() {
            setTimeout(() => {
                this.root.querySelector("[ref=slowLoader]").dispatchEvent(new Event("load"));
            }, 1000);
            Promise.resolve().then(() => {
                Router.go("/accedi", { replace: true });
                this.root.querySelector("[ref=loader]").dispatchEvent(new Event("load"));
            });
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<div ref="loader" need-loading></div><div ref="slowLoader" need-loading></div>',
          []
        );
      },

      'name': 'replace-test'
    };

    exports.default = replaceTest;

});
