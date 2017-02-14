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

  var TimeSeries = function (_Component) {
    _inherits(TimeSeries, _Component);

    function TimeSeries() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, TimeSeries);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(TimeSeries).call(this, config));
    }

    _createClass(TimeSeries, [{
      key: 'handleData',
      value: function handleData(data) {
        this._model.parseData(data);
      }
    }, {
      key: 'update',
      value: function update(timestamp) {
        this.view().update(timestamp, this._model);
      }
    }, {
      key: 'reset',
      value: function reset() {
        this._model.reset();
      }
    }]);

    return TimeSeries;
  }(Component);

  TimeSeries.create = function (data) {
    return new TimeSeries({ modelData: data });
  };

  return TimeSeries;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC90aW1lc2VyaWVzZ3JhcGgvdGltZXNlcmllc2dyYXBoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sWUFBWSxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRSxRQUFRLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRSxPQUFPLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRSxRQUFRLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFPWixVQVBZO0FBQUE7O0FBUWhCLDBCQUF5QjtBQUFBLFVBQWIsTUFBYSx5REFBSixFQUFJOztBQUFBOztBQUN2QixhQUFPLFVBQVAsR0FBb0IsT0FBTyxVQUFQLElBQXFCLEtBQXpDO0FBQ0EsYUFBTyxTQUFQLEdBQW1CLE9BQU8sU0FBUCxJQUFvQixJQUF2QztBQUZ1QiwyRkFHakIsTUFIaUI7QUFJeEI7O0FBWmU7QUFBQTtBQUFBLGlDQWNMLElBZEssRUFjQztBQUNmLGFBQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsSUFBdEI7QUFDRDtBQWhCZTtBQUFBO0FBQUEsNkJBa0JULFNBbEJTLEVBa0JFO0FBQ2hCLGFBQUssSUFBTCxHQUFZLE1BQVosQ0FBbUIsU0FBbkIsRUFBOEIsS0FBSyxNQUFuQztBQUNEO0FBcEJlO0FBQUE7QUFBQSw4QkFzQlI7QUFDTixhQUFLLE1BQUwsQ0FBWSxLQUFaO0FBQ0Q7QUF4QmU7O0FBQUE7QUFBQSxJQU9PLFNBUFA7O0FBMkJsQixhQUFXLE1BQVgsR0FBb0IsVUFBQyxJQUFEO0FBQUEsV0FBVSxJQUFJLFVBQUosQ0FBZSxFQUFFLFdBQVcsSUFBYixFQUFmLENBQVY7QUFBQSxHQUFwQjs7QUFFQSxTQUFPLFVBQVA7QUFDRCxDQTlCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdGltZXNlcmllc2dyYXBoL3RpbWVzZXJpZXNncmFwaC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
