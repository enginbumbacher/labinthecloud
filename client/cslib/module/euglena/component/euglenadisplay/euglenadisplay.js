'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var EuglenaDisplay = function (_Component) {
    _inherits(EuglenaDisplay, _Component);

    function EuglenaDisplay() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, EuglenaDisplay);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EuglenaDisplay).call(this, settings));

      _this._lastRender = 0;
      return _this;
    }

    _createClass(EuglenaDisplay, [{
      key: 'initialize',
      value: function initialize() {
        var euglenaManager = HM.invoke('Euglena.Manager', {
          manager: null,
          candidates: []
        });
        // console.log(euglenaManager)
        if (euglenaManager.manager) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this._model.get('euglena')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var euglena = _step.value;

              euglenaManager.manager.initialize(euglena);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }, {
      key: 'render',
      value: function render(lights, time) {
        var dT = time - this._lastRender;
        if (this._lastRender > time) {
          dT = time;
        }
        this.view().render({
          lights: lights,
          dT: dT,
          model: this._model
        });
        this._lastRender = time;
      }
    }]);

    return EuglenaDisplay;
  }(Component);

  EuglenaDisplay.create = function () {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return new EuglenaDisplay({ modelData: data });
  };

  return EuglenaDisplay;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hZGlzcGxheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFlBQVksUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0UsUUFBUSxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUUsT0FBTyxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0UsUUFBUSxRQUFRLGlCQUFSLENBSFY7QUFBQSxNQUlFLEtBQUssUUFBUSx5QkFBUixDQUpQOztBQURrQixNQVFaLGNBUlk7QUFBQTs7QUFTaEIsOEJBQTJCO0FBQUEsVUFBZixRQUFlLHlEQUFKLEVBQUk7O0FBQUE7O0FBQ3pCLGVBQVMsVUFBVCxHQUFzQixTQUFTLFVBQVQsSUFBdUIsS0FBN0M7QUFDQSxlQUFTLFNBQVQsR0FBcUIsU0FBUyxTQUFULElBQXNCLElBQTNDOztBQUZ5QixvR0FHbkIsUUFIbUI7O0FBS3pCLFlBQUssV0FBTCxHQUFtQixDQUFuQjtBQUx5QjtBQU0xQjs7QUFmZTtBQUFBO0FBQUEsbUNBaUJIO0FBQ1gsWUFBSSxpQkFBaUIsR0FBRyxNQUFILENBQVUsaUJBQVYsRUFBNkI7QUFDaEQsbUJBQVMsSUFEdUM7QUFFaEQsc0JBQVk7QUFGb0MsU0FBN0IsQ0FBckI7O0FBS0EsWUFBSSxlQUFlLE9BQW5CLEVBQTRCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQzFCLGlDQUFvQixLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFNBQWhCLENBQXBCLDhIQUFnRDtBQUFBLGtCQUF2QyxPQUF1Qzs7QUFDOUMsNkJBQWUsT0FBZixDQUF1QixVQUF2QixDQUFrQyxPQUFsQztBQUNEO0FBSHlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJM0I7QUFDRjtBQTVCZTtBQUFBO0FBQUEsNkJBOEJULE1BOUJTLEVBOEJELElBOUJDLEVBOEJLO0FBQ25CLFlBQUksS0FBSyxPQUFPLEtBQUssV0FBckI7QUFDQSxZQUFJLEtBQUssV0FBTCxHQUFtQixJQUF2QixFQUE2QjtBQUMzQixlQUFLLElBQUw7QUFDRDtBQUNELGFBQUssSUFBTCxHQUFZLE1BQVosQ0FBbUI7QUFDakIsa0JBQVEsTUFEUztBQUVqQixjQUFJLEVBRmE7QUFHakIsaUJBQU8sS0FBSztBQUhLLFNBQW5CO0FBS0EsYUFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0Q7QUF6Q2U7O0FBQUE7QUFBQSxJQVFXLFNBUlg7O0FBNENsQixpQkFBZSxNQUFmLEdBQXdCO0FBQUEsUUFBQyxJQUFELHlEQUFRLEVBQVI7QUFBQSxXQUFlLElBQUksY0FBSixDQUFtQixFQUFFLFdBQVcsSUFBYixFQUFuQixDQUFmO0FBQUEsR0FBeEI7O0FBRUEsU0FBTyxjQUFQO0FBQ0QsQ0EvQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L2V1Z2xlbmFkaXNwbGF5LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
