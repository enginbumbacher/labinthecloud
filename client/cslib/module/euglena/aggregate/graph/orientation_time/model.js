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
          x += Math.cos(sample.yaw);
          y += Math.sin(sample.yaw);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl90aW1lL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkFnZ3JlZ2F0ZVRpbWVHcmFwaE1vZGVsIiwiZGVmYXVsdHMiLCJpZCIsImdyYXBoX2NsYXNzIiwiYXhpc19sYWJlbCIsImxhYmVsIiwiY29uZiIsImVuc3VyZURlZmF1bHRzIiwiZGF0YSIsImV4cGVyaW1lbnQiLCJ4IiwieSIsInNhbXBsZXMiLCJmb3JFYWNoIiwic2FtcGxlIiwiTWF0aCIsImNvcyIsInlhdyIsInNpbiIsImFscGhhIiwiYXRhbjIiLCJQSSIsImFicyIsInNpZ24iLCJsaW5lcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksMEJBQTBCSixRQUFRLG9DQUFSLENBQWhDO0FBQUEsTUFDRUssV0FBVztBQUNUQyxRQUFJLGtCQURLO0FBRVRDLGlCQUFhLGtCQUZKO0FBR1RDLGdCQUFZLHFCQUhIO0FBSVRDLFdBQU87QUFKRSxHQURiOztBQVFBO0FBQUE7O0FBQ0UsdUNBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDaEJBLFdBQUtMLFFBQUwsR0FBZ0JKLE1BQU1VLGNBQU4sQ0FBcUJELEtBQUtMLFFBQTFCLEVBQW9DQSxRQUFwQyxDQUFoQjtBQURnQixtSkFFVkssSUFGVTtBQUdqQjs7QUFKSDtBQUFBO0FBQUEsd0NBTW9CRSxJQU5wQixFQU0wQkMsVUFOMUIsRUFNc0M7QUFDbEMsWUFBSUMsSUFBSSxDQUFSO0FBQUEsWUFBV0MsSUFBSSxDQUFmO0FBQ0FILGFBQUtJLE9BQUwsQ0FBYUMsT0FBYixDQUFxQixVQUFDQyxNQUFELEVBQVk7QUFDL0JKLGVBQUtLLEtBQUtDLEdBQUwsQ0FBU0YsT0FBT0csR0FBaEIsQ0FBTDtBQUNBTixlQUFLSSxLQUFLRyxHQUFMLENBQVNKLE9BQU9HLEdBQWhCLENBQUw7QUFDRCxTQUhEO0FBSUEsWUFBSUUsUUFBUUosS0FBS0ssS0FBTCxDQUFXVCxDQUFYLEVBQWNELENBQWQsSUFBbUIsR0FBbkIsR0FBeUJLLEtBQUtNLEVBQTFDO0FBQ0E7QUFDQSxZQUFJTixLQUFLTyxHQUFMLENBQVNILEtBQVQsSUFBa0IsRUFBdEIsRUFBMEI7QUFDeEJBLG1CQUFTSixLQUFLUSxJQUFMLENBQVVKLEtBQVYsSUFBbUIsR0FBNUI7QUFDRDtBQUNELGVBQU9KLEtBQUtPLEdBQUwsQ0FBU0gsS0FBVCxDQUFQO0FBQ0Q7QUFsQkg7QUFBQTtBQUFBLGtDQW9CY0ssS0FwQmQsRUFvQnFCO0FBQ2pCO0FBQ0EsZUFBTyxDQUFQO0FBQ0Q7QUF2Qkg7QUFBQTtBQUFBLGtDQXlCY0EsS0F6QmQsRUF5QnFCO0FBQ2pCO0FBQ0EsZUFBTyxFQUFQO0FBQ0Q7QUE1Qkg7O0FBQUE7QUFBQSxJQUErQ3hCLHVCQUEvQztBQStCRCxDQTVDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9hZ2dyZWdhdGUvZ3JhcGgvb3JpZW50YXRpb25fdGltZS9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
