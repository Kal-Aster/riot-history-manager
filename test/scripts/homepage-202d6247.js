define(['exports'], function (exports) { 'use strict';

    var homepage = {
      'css': null,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template('\r\n    HOME <img src="image1.jpg" need-loading/>', []);
      },

      'name': 'homepage'
    };

    exports.default = homepage;

});
