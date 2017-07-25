'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  var CircleHistogram = function (_Component) {
    _inherits(CircleHistogram, _Component);

    function CircleHistogram() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, CircleHistogram);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      return _possibleConstructorReturn(this, (CircleHistogram.__proto__ || Object.getPrototypeOf(CircleHistogram)).call(this, config));
    }

    _createClass(CircleHistogram, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'handleData',
      value: function handleData(data) {
        var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
        var color = arguments[2];

        this._model.parseData(data, layer, color);
      }
    }, {
      key: 'update',
      value: function update(timestamp, lights) {
        this._model.update(timestamp, lights);
      }
    }, {
      key: 'reset',
      value: function reset() {
        this._model.reset();
      }
    }]);

    return CircleHistogram;
  }(Component);

  CircleHistogram.create = function (data) {
    return new CircleHistogram({ modelData: data });
  };

  return CircleHistogram;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9jaXJjbGVncmFwaC9jaXJjbGVncmFwaC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJDaXJjbGVIaXN0b2dyYW0iLCJjb25maWciLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsImxheWVyIiwiY29sb3IiLCJwYXJzZURhdGEiLCJ0aW1lc3RhbXAiLCJsaWdodHMiLCJ1cGRhdGUiLCJyZXNldCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFPWkssZUFQWTtBQUFBOztBQVFoQiwrQkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCTCxLQUF6QztBQUNBSSxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CTCxJQUF2QztBQUZ1QiwrSEFHakJHLE1BSGlCO0FBSXhCOztBQVplO0FBQUE7QUFBQSwyQkFjWDtBQUNILGVBQU8sS0FBS0csTUFBTCxDQUFZQyxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQWhCZTtBQUFBO0FBQUEsaUNBa0JMQyxJQWxCSyxFQWtCMkI7QUFBQSxZQUExQkMsS0FBMEIsdUVBQWxCLFNBQWtCO0FBQUEsWUFBUEMsS0FBTzs7QUFDekMsYUFBS0osTUFBTCxDQUFZSyxTQUFaLENBQXNCSCxJQUF0QixFQUE0QkMsS0FBNUIsRUFBbUNDLEtBQW5DO0FBQ0Q7QUFwQmU7QUFBQTtBQUFBLDZCQXNCVEUsU0F0QlMsRUFzQkVDLE1BdEJGLEVBc0JVO0FBQ3hCLGFBQUtQLE1BQUwsQ0FBWVEsTUFBWixDQUFtQkYsU0FBbkIsRUFBOEJDLE1BQTlCO0FBQ0Q7QUF4QmU7QUFBQTtBQUFBLDhCQTBCUjtBQUNOLGFBQUtQLE1BQUwsQ0FBWVMsS0FBWjtBQUNEO0FBNUJlOztBQUFBO0FBQUEsSUFPWWpCLFNBUFo7O0FBK0JsQkksa0JBQWdCYyxNQUFoQixHQUF5QixVQUFDUixJQUFEO0FBQUEsV0FBVSxJQUFJTixlQUFKLENBQW9CLEVBQUVlLFdBQVdULElBQWIsRUFBcEIsQ0FBVjtBQUFBLEdBQXpCOztBQUVBLFNBQU9OLGVBQVA7QUFDRCxDQWxDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvY2lyY2xlZ3JhcGgvY2lyY2xlZ3JhcGguanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
