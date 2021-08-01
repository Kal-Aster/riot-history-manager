define(['exports'], function (exports) { 'use strict';

    var rhmReplaceTest = {
      'css': null,

      'exports': {
        onBeforeMount() {
            let start = Date.now();
            setTimeout(() => {
                this.root.querySelector("[ref=slowLoader]").dispatchEvent(new Event("load"));
                console.log("elapsed: " + (Date.now() - start) + "ms");
            }, 600 + (Math.random() * 600));
            Promise.resolve().then(() => {
                // Router.go("/accedi", { replace: true });
                this.root.querySelector("[ref=loader]").dispatchEvent(new Event("load"));
            });
        }
      },

      'template': function(
        template,
        expressionTypes,
        bindingTypes,
        getComponent
      ) {
        return template(
          '<div ref="loader" need-loading></div><div ref="slowLoader" need-loading></div>',
          []
        );
      },

      'name': 'rhm-replace-test'
    };

    exports['default'] = rhmReplaceTest;

});
