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

  var Histogram = function (_Component) {
    _inherits(Histogram, _Component);

    function Histogram() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Histogram);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      return _possibleConstructorReturn(this, (Histogram.__proto__ || Object.getPrototypeOf(Histogram)).call(this, config));
    }

    _createClass(Histogram, [{
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
      value: function update(timestamp) {
        this._model.update(timestamp);
      }
    }, {
      key: 'reset',
      value: function reset() {
        this._model.reset();
      }
    }]);

    return Histogram;
  }(Component);

  Histogram.create = function (data) {
    return new Histogram({ modelData: data });
  };

  return Histogram;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9oaXN0b2dyYW1ncmFwaC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJIaXN0b2dyYW0iLCJjb25maWciLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsImxheWVyIiwiY29sb3IiLCJwYXJzZURhdGEiLCJ0aW1lc3RhbXAiLCJ1cGRhdGUiLCJyZXNldCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFPWkssU0FQWTtBQUFBOztBQVFoQix5QkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCTCxLQUF6QztBQUNBSSxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CTCxJQUF2QztBQUZ1QixtSEFHakJHLE1BSGlCO0FBSXhCOztBQVplO0FBQUE7QUFBQSwyQkFjWDtBQUNILGVBQU8sS0FBS0csTUFBTCxDQUFZQyxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQWhCZTtBQUFBO0FBQUEsaUNBa0JMQyxJQWxCSyxFQWtCMkI7QUFBQSxZQUExQkMsS0FBMEIsdUVBQWxCLFNBQWtCO0FBQUEsWUFBUEMsS0FBTzs7QUFDekMsYUFBS0osTUFBTCxDQUFZSyxTQUFaLENBQXNCSCxJQUF0QixFQUE0QkMsS0FBNUIsRUFBbUNDLEtBQW5DO0FBQ0Q7QUFwQmU7QUFBQTtBQUFBLDZCQXNCVEUsU0F0QlMsRUFzQkU7QUFDaEIsYUFBS04sTUFBTCxDQUFZTyxNQUFaLENBQW1CRCxTQUFuQjtBQUNEO0FBeEJlO0FBQUE7QUFBQSw4QkEwQlI7QUFDTixhQUFLTixNQUFMLENBQVlRLEtBQVo7QUFDRDtBQTVCZTs7QUFBQTtBQUFBLElBT01oQixTQVBOOztBQStCbEJJLFlBQVVhLE1BQVYsR0FBbUIsVUFBQ1AsSUFBRDtBQUFBLFdBQVUsSUFBSU4sU0FBSixDQUFjLEVBQUVjLFdBQVdSLElBQWIsRUFBZCxDQUFWO0FBQUEsR0FBbkI7O0FBRUEsU0FBT04sU0FBUDtBQUNELENBbENEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9oaXN0b2dyYW1ncmFwaC9oaXN0b2dyYW1ncmFwaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgY2xhc3MgSGlzdG9ncmFtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuICAgICAgY29uZmlnLm1vZGVsQ2xhc3MgPSBjb25maWcubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIGNvbmZpZy52aWV3Q2xhc3MgPSBjb25maWcudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihjb25maWcpO1xuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG5cbiAgICBoYW5kbGVEYXRhKGRhdGEsIGxheWVyID0gJ2RlZmF1bHQnLCBjb2xvcikge1xuICAgICAgdGhpcy5fbW9kZWwucGFyc2VEYXRhKGRhdGEsIGxheWVyLCBjb2xvcik7XG4gICAgfVxuXG4gICAgdXBkYXRlKHRpbWVzdGFtcCkge1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlKHRpbWVzdGFtcCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIEhpc3RvZ3JhbS5jcmVhdGUgPSAoZGF0YSkgPT4gbmV3IEhpc3RvZ3JhbSh7IG1vZGVsRGF0YTogZGF0YSB9KTtcblxuICByZXR1cm4gSGlzdG9ncmFtO1xufSkiXX0=
