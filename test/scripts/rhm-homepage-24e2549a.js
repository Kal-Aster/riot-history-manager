define(['exports'], function (exports) { 'use strict';

    var rhmHomepage = {
      'css': null,

      'exports': {
        onMounted() {
            console.log("homepage mounted");
        },

        onUnmounted() {
            console.log("homepage unmounted");
        },

        onUpdated() {
            console.log("homepage updated");
        }
      },

      'template': function(
        template,
        expressionTypes,
        bindingTypes,
        getComponent
      ) {
        return template(
          '<div><img expr26="expr26" src="image1.jpg" need-loading/></div><div expr27="expr27"> </div>',
          [
            {
              'redundantAttribute': 'expr26',
              'selector': '[expr26]',

              'expressions': [
                {
                  'type': expressionTypes.EVENT,
                  'name': 'onclick',

                  'evaluate': function(
                    scope
                  ) {
                    return scope.update.bind(scope);
                  }
                }
              ]
            },
            {
              'redundantAttribute': 'expr27',
              'selector': '[expr27]',

              'expressions': [
                {
                  'type': expressionTypes.TEXT,
                  'childNodeIndex': 0,

                  'evaluate': function(
                    scope
                  ) {
                    return [
                      'HOME ',
                      Math.round(Math.random() * 32)
                    ].join(
                      ''
                    );
                  }
                }
              ]
            }
          ]
        );
      },

      'name': 'rhm-homepage'
    };

    exports.default = rhmHomepage;

});
