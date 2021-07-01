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
          '<div><img expr31="expr31" src="image1.jpg" need-loading/></div><div expr32="expr32"> </div>',
          [
            {
              'redundantAttribute': 'expr31',
              'selector': '[expr31]',

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
              'redundantAttribute': 'expr32',
              'selector': '[expr32]',

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
