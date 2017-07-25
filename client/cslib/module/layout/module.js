'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      DomView = require('core/view/dom_view');

  return function (_Module) {
    _inherits(LayoutModule, _Module);

    function LayoutModule() {
      _classCallCheck(this, LayoutModule);

      var _this = _possibleConstructorReturn(this, (LayoutModule.__proto__ || Object.getPrototypeOf(LayoutModule)).call(this));

      Globals.set('Layout', _this);
      _this._panels = {};
      return _this;
    }

    _createClass(LayoutModule, [{
      key: 'run',
      value: function run() {
        var _this2 = this;

        var specs = [];
        HM.invoke('Layout.Panels', specs);
        specs.sort(function (a, b) {
          return a.weight - b.weight;
        });
        specs.forEach(function (spec, ind) {
          var panel = spec.panel;
          _this2._panels[panel.id()] = panel;
          Globals.get('App.view').addChild(panel.view());
        });
      }
    }, {
      key: 'getPanel',
      value: function getPanel(id) {
        return this._panels[id];
      }
    }]);

    return LayoutModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9sYXlvdXQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3Iiwic2V0IiwiX3BhbmVscyIsInNwZWNzIiwiaW52b2tlIiwic29ydCIsImEiLCJiIiwid2VpZ2h0IiwiZm9yRWFjaCIsInNwZWMiLCJpbmQiLCJwYW5lbCIsImlkIiwiZ2V0IiwiYWRkQ2hpbGQiLCJ2aWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDtBQUFBLE1BR0VJLFVBQVVKLFFBQVEsb0JBQVIsQ0FIWjs7QUFLQTtBQUFBOztBQUNFLDRCQUFjO0FBQUE7O0FBQUE7O0FBR1pFLGNBQVFHLEdBQVIsQ0FBWSxRQUFaO0FBQ0EsWUFBS0MsT0FBTCxHQUFlLEVBQWY7QUFKWTtBQUtiOztBQU5IO0FBQUE7QUFBQSw0QkFRUTtBQUFBOztBQUNKLFlBQUlDLFFBQVEsRUFBWjtBQUNBSixXQUFHSyxNQUFILENBQVUsZUFBVixFQUEyQkQsS0FBM0I7QUFDQUEsY0FBTUUsSUFBTixDQUFXLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQ25CLGlCQUFPRCxFQUFFRSxNQUFGLEdBQVdELEVBQUVDLE1BQXBCO0FBQ0QsU0FGRDtBQUdBTCxjQUFNTSxPQUFOLENBQWMsVUFBQ0MsSUFBRCxFQUFPQyxHQUFQLEVBQWU7QUFDM0IsY0FBTUMsUUFBUUYsS0FBS0UsS0FBbkI7QUFDQSxpQkFBS1YsT0FBTCxDQUFhVSxNQUFNQyxFQUFOLEVBQWIsSUFBMkJELEtBQTNCO0FBQ0FkLGtCQUFRZ0IsR0FBUixDQUFZLFVBQVosRUFBd0JDLFFBQXhCLENBQWlDSCxNQUFNSSxJQUFOLEVBQWpDO0FBQ0QsU0FKRDtBQUtEO0FBbkJIO0FBQUE7QUFBQSwrQkFxQldILEVBckJYLEVBcUJlO0FBQ1gsZUFBTyxLQUFLWCxPQUFMLENBQWFXLEVBQWIsQ0FBUDtBQUNEO0FBdkJIOztBQUFBO0FBQUEsSUFBa0NoQixNQUFsQztBQXlCRCxDQS9CRCIsImZpbGUiOiJtb2R1bGUvbGF5b3V0L21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
