define(['exports'], function (exports) { 'use strict';

    var homepage = {
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
          '<div><img expr23="expr23" src="image1.jpg" need-loading/></div><div expr24="expr24"> </div>',
          [
            {
              'redundantAttribute': 'expr23',
              'selector': '[expr23]',

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
              'redundantAttribute': 'expr24',
              'selector': '[expr24]',

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

      'name': 'homepage'
    };

    exports.default = homepage;

});
