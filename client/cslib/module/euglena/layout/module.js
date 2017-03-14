'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Globals = require('core/model/globals'),
      DomView = require('core/view/dom_view');

  return function (_Module) {
    _inherits(LayoutModule, _Module);

    function LayoutModule() {
      _classCallCheck(this, LayoutModule);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(LayoutModule).call(this));
    }

    _createClass(LayoutModule, [{
      key: 'run',
      value: function run() {
        var panels = [];
        HM.invoke('Layout.Panels', panels);
        panels.sort(function (a, b) {
          return a.weight - b.weight;
        });
        panels.forEach(function (panel, ind) {
          Globals.get('App.view').addChild(panel);
        });
      }
    }]);

    return LayoutModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xheW91dC9tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxTQUFTLFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0UsVUFBVSxRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFLFVBQVUsUUFBUSxvQkFBUixDQUZaOztBQUlBO0FBQUE7O0FBQ0UsNEJBQWM7QUFBQTs7QUFBQTtBQUViOztBQUhIO0FBQUE7QUFBQSw0QkFLUTtBQUNKLFlBQUksU0FBUyxFQUFiO0FBQ0EsV0FBRyxNQUFILENBQVUsZUFBVixFQUEyQixNQUEzQjtBQUNBLGVBQU8sSUFBUCxDQUFZLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTtBQUNwQixpQkFBTyxFQUFFLE1BQUYsR0FBVyxFQUFFLE1BQXBCO0FBQ0QsU0FGRDtBQUdBLGVBQU8sT0FBUCxDQUFlLFVBQUMsS0FBRCxFQUFRLEdBQVIsRUFBZ0I7QUFDN0Isa0JBQVEsR0FBUixDQUFZLFVBQVosRUFBd0IsUUFBeEIsQ0FBaUMsS0FBakM7QUFDRCxTQUZEO0FBR0Q7QUFkSDs7QUFBQTtBQUFBLElBQWtDLE1BQWxDO0FBZ0JELENBckJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2xheW91dC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
