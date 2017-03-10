'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    width: 400,
    height: 300,
    lightData: []
  };

  return function (_Model) {
    _inherits(VisualResultModel, _Model);

    function VisualResultModel() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, VisualResultModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, Object.getPrototypeOf(VisualResultModel).call(this, config));
    }

    _createClass(VisualResultModel, [{
      key: 'getLightState',
      value: function getLightState(time) {
        var blockTime = 0;
        var light = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function _loop() {
            var block = _step.value;

            if (time > blockTime && time <= blockTime + block.duration) {
              ['top', 'right', 'bottom', 'left'].forEach(function (key) {
                light[key] = block[key];
              });
              return 'break';
            }
            blockTime += block.duration;
          };

          for (var _iterator = this.get('lightData')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ret = _loop();

            if (_ret === 'break') break;
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

        console.log(time, blockTime, light);
        return light;
      }
    }]);

    return VisualResultModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvbW9kZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxRQUFRLFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUdFLFdBQVc7QUFDVCxXQUFPLEdBREU7QUFFVCxZQUFRLEdBRkM7QUFHVCxlQUFXO0FBSEYsR0FIYjs7QUFTQTtBQUFBOztBQUNFLGlDQUF5QjtBQUFBLFVBQWIsTUFBYSx5REFBSixFQUFJOztBQUFBOztBQUN2QixhQUFPLFFBQVAsR0FBa0IsTUFBTSxjQUFOLENBQXFCLE9BQU8sUUFBNUIsRUFBc0MsUUFBdEMsQ0FBbEI7QUFEdUIsa0dBRWpCLE1BRmlCO0FBR3hCOztBQUpIO0FBQUE7QUFBQSxvQ0FNZ0IsSUFOaEIsRUFNc0I7QUFDbEIsWUFBSSxZQUFZLENBQWhCO0FBQ0EsWUFBSSxRQUFRO0FBQ1YsZUFBSyxDQURLO0FBRVYsaUJBQU8sQ0FGRztBQUdWLGtCQUFRLENBSEU7QUFJVixnQkFBTTtBQUpJLFNBQVo7QUFGa0I7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxnQkFRUCxLQVJPOztBQVNoQixnQkFBSSxPQUFPLFNBQVAsSUFBb0IsUUFBUSxZQUFZLE1BQU0sUUFBbEQsRUFBNEQ7QUFDMUQsZUFBQyxLQUFELEVBQVEsT0FBUixFQUFpQixRQUFqQixFQUEyQixNQUEzQixFQUFtQyxPQUFuQyxDQUEyQyxVQUFDLEdBQUQsRUFBUztBQUNsRCxzQkFBTSxHQUFOLElBQWEsTUFBTSxHQUFOLENBQWI7QUFDRCxlQUZEO0FBR0E7QUFDRDtBQUNELHlCQUFhLE1BQU0sUUFBbkI7QUFmZ0I7O0FBUWxCLCtCQUFvQixLQUFLLEdBQUwsQ0FBUyxXQUFULENBQXBCLDhIQUEyQztBQUFBOztBQUFBLGtDQUt2QztBQUdIO0FBaEJpQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWlCbEIsZ0JBQVEsR0FBUixDQUFZLElBQVosRUFBa0IsU0FBbEIsRUFBNkIsS0FBN0I7QUFDQSxlQUFPLEtBQVA7QUFDRDtBQXpCSDs7QUFBQTtBQUFBLElBQXVDLEtBQXZDO0FBMkJELENBckNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
