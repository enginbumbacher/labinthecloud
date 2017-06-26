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
    id: 'velocity_time',
    graph_class: "velocity_time",
    axis_label: "Average Velocity",
    label: "Average Velocity over Time"
  };

  return function (_AggregateTimeGraphMo) {
    _inherits(VelocityTimeGraphModel, _AggregateTimeGraphMo);

    function VelocityTimeGraphModel(conf) {
      _classCallCheck(this, VelocityTimeGraphModel);

      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      return _possibleConstructorReturn(this, (VelocityTimeGraphModel.__proto__ || Object.getPrototypeOf(VelocityTimeGraphModel)).call(this, conf));
    }

    _createClass(VelocityTimeGraphModel, [{
      key: 'generateLinePoint',
      value: function generateLinePoint(data, experiment) {
        if (data.samples.length) {
          return data.samples.reduce(function (acc, val) {
            return acc + val.speed;
          }, 0) / data.samples.length;
        } else {
          return 0;
        }
      }
    }]);

    return VelocityTimeGraphModel;
  }(AggregateTimeGraphModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC92ZWxvY2l0eV90aW1lL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkFnZ3JlZ2F0ZVRpbWVHcmFwaE1vZGVsIiwiZGVmYXVsdHMiLCJpZCIsImdyYXBoX2NsYXNzIiwiYXhpc19sYWJlbCIsImxhYmVsIiwiY29uZiIsImVuc3VyZURlZmF1bHRzIiwiZGF0YSIsImV4cGVyaW1lbnQiLCJzYW1wbGVzIiwibGVuZ3RoIiwicmVkdWNlIiwiYWNjIiwidmFsIiwic3BlZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLDBCQUEwQkosUUFBUSxvQ0FBUixDQUFoQztBQUFBLE1BQ0VLLFdBQVc7QUFDVEMsUUFBSSxlQURLO0FBRVRDLGlCQUFhLGVBRko7QUFHVEMsZ0JBQVksa0JBSEg7QUFJVEMsV0FBTztBQUpFLEdBRGI7O0FBUUE7QUFBQTs7QUFDRSxvQ0FBWUMsSUFBWixFQUFrQjtBQUFBOztBQUNoQkEsV0FBS0wsUUFBTCxHQUFnQkosTUFBTVUsY0FBTixDQUFxQkQsS0FBS0wsUUFBMUIsRUFBb0NBLFFBQXBDLENBQWhCO0FBRGdCLDZJQUVWSyxJQUZVO0FBR2pCOztBQUpIO0FBQUE7QUFBQSx3Q0FNb0JFLElBTnBCLEVBTTBCQyxVQU4xQixFQU1zQztBQUNsQyxZQUFJRCxLQUFLRSxPQUFMLENBQWFDLE1BQWpCLEVBQXlCO0FBQ3ZCLGlCQUFPSCxLQUFLRSxPQUFMLENBQWFFLE1BQWIsQ0FBb0IsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFBRSxtQkFBT0QsTUFBTUMsSUFBSUMsS0FBakI7QUFBd0IsV0FBNUQsRUFBOEQsQ0FBOUQsSUFBbUVQLEtBQUtFLE9BQUwsQ0FBYUMsTUFBdkY7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBTyxDQUFQO0FBQ0Q7QUFDRjtBQVpIOztBQUFBO0FBQUEsSUFBNENYLHVCQUE1QztBQWVELENBNUJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC92ZWxvY2l0eV90aW1lL21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
