'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var AggregateTimeGraphModel = require('euglena/aggregate/graph/time/model'),
      defaults = {
    id: 'orientation_time',
    graph_class: "orientation_time",
    axis_label: "Average Orientation",
    label: "Average Orientation over Time"
  };

  return function (_AggregateTimeGraphMo) {
    _inherits(OrientationTimeGraphModel, _AggregateTimeGraphMo);

    function OrientationTimeGraphModel(conf) {
      _classCallCheck(this, OrientationTimeGraphModel);

      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      return _possibleConstructorReturn(this, (OrientationTimeGraphModel.__proto__ || Object.getPrototypeOf(OrientationTimeGraphModel)).call(this, conf));
    }

    _createClass(OrientationTimeGraphModel, [{
      key: 'generateLinePoint',
      value: function generateLinePoint(data, experiment) {
        var x = 0,
            y = 0;
        data.samples.forEach(function (sample) {
          x += Math.cos(sample.angleXY);
          y += Math.sin(sample.angleXY);
        });
        var alpha = Math.atan2(y, x) * 180 / Math.PI;
        // return alpha
        if (Math.abs(alpha) > 90) {
          alpha -= Math.sign(alpha) * 180;
        }
        return Math.abs(alpha);
      }
    }, {
      key: 'getMinValue',
      value: function getMinValue(lines) {
        // return -180
        return 0;
      }
    }, {
      key: 'getMaxValue',
      value: function getMaxValue(lines) {
        // return 180
        return 90;
      }
    }]);

    return OrientationTimeGraphModel;
  }(AggregateTimeGraphModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl90aW1lL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkFnZ3JlZ2F0ZVRpbWVHcmFwaE1vZGVsIiwiZGVmYXVsdHMiLCJpZCIsImdyYXBoX2NsYXNzIiwiYXhpc19sYWJlbCIsImxhYmVsIiwiY29uZiIsImVuc3VyZURlZmF1bHRzIiwiZGF0YSIsImV4cGVyaW1lbnQiLCJ4IiwieSIsInNhbXBsZXMiLCJmb3JFYWNoIiwic2FtcGxlIiwiTWF0aCIsImNvcyIsImFuZ2xlWFkiLCJzaW4iLCJhbHBoYSIsImF0YW4yIiwiUEkiLCJhYnMiLCJzaWduIiwibGluZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLDBCQUEwQkosUUFBUSxvQ0FBUixDQUFoQztBQUFBLE1BQ0VLLFdBQVc7QUFDVEMsUUFBSSxrQkFESztBQUVUQyxpQkFBYSxrQkFGSjtBQUdUQyxnQkFBWSxxQkFISDtBQUlUQyxXQUFPO0FBSkUsR0FEYjs7QUFRQTtBQUFBOztBQUNFLHVDQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCQSxXQUFLTCxRQUFMLEdBQWdCSixNQUFNVSxjQUFOLENBQXFCRCxLQUFLTCxRQUExQixFQUFvQ0EsUUFBcEMsQ0FBaEI7QUFEZ0IsbUpBRVZLLElBRlU7QUFHakI7O0FBSkg7QUFBQTtBQUFBLHdDQU1vQkUsSUFOcEIsRUFNMEJDLFVBTjFCLEVBTXNDO0FBQ2xDLFlBQUlDLElBQUksQ0FBUjtBQUFBLFlBQVdDLElBQUksQ0FBZjtBQUNBSCxhQUFLSSxPQUFMLENBQWFDLE9BQWIsQ0FBcUIsVUFBQ0MsTUFBRCxFQUFZO0FBQy9CSixlQUFLSyxLQUFLQyxHQUFMLENBQVNGLE9BQU9HLE9BQWhCLENBQUw7QUFDQU4sZUFBS0ksS0FBS0csR0FBTCxDQUFTSixPQUFPRyxPQUFoQixDQUFMO0FBQ0QsU0FIRDtBQUlBLFlBQUlFLFFBQVFKLEtBQUtLLEtBQUwsQ0FBV1QsQ0FBWCxFQUFjRCxDQUFkLElBQW1CLEdBQW5CLEdBQXlCSyxLQUFLTSxFQUExQztBQUNBO0FBQ0EsWUFBSU4sS0FBS08sR0FBTCxDQUFTSCxLQUFULElBQWtCLEVBQXRCLEVBQTBCO0FBQ3hCQSxtQkFBU0osS0FBS1EsSUFBTCxDQUFVSixLQUFWLElBQW1CLEdBQTVCO0FBQ0Q7QUFDRCxlQUFPSixLQUFLTyxHQUFMLENBQVNILEtBQVQsQ0FBUDtBQUNEO0FBbEJIO0FBQUE7QUFBQSxrQ0FvQmNLLEtBcEJkLEVBb0JxQjtBQUNqQjtBQUNBLGVBQU8sQ0FBUDtBQUNEO0FBdkJIO0FBQUE7QUFBQSxrQ0F5QmNBLEtBekJkLEVBeUJxQjtBQUNqQjtBQUNBLGVBQU8sRUFBUDtBQUNEO0FBNUJIOztBQUFBO0FBQUEsSUFBK0N4Qix1QkFBL0M7QUErQkQsQ0E1Q0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL29yaWVudGF0aW9uX3RpbWUvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
