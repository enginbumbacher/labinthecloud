'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var AggregateTimeGraph = require('euglena/aggregate/graph/time/graph'),
      Model = require('./model');

  var OrientationTimeGraph = function (_AggregateTimeGraph) {
    _inherits(OrientationTimeGraph, _AggregateTimeGraph);

    function OrientationTimeGraph(settings) {
      _classCallCheck(this, OrientationTimeGraph);

      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, (OrientationTimeGraph.__proto__ || Object.getPrototypeOf(OrientationTimeGraph)).call(this, settings));
    }

    return OrientationTimeGraph;
  }(AggregateTimeGraph);

  OrientationTimeGraph.create = function (data) {
    return new OrientationTimeGraph({ modelData: data });
  };

  return OrientationTimeGraph;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl90aW1lL2dyYXBoLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkFnZ3JlZ2F0ZVRpbWVHcmFwaCIsIk1vZGVsIiwiT3JpZW50YXRpb25UaW1lR3JhcGgiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJjcmVhdGUiLCJkYXRhIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUkscUJBQXFCSixRQUFRLG9DQUFSLENBQTNCO0FBQUEsTUFDRUssUUFBUUwsUUFBUSxTQUFSLENBRFY7O0FBTGtCLE1BUVpNLG9CQVJZO0FBQUE7O0FBU2hCLGtDQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSCxLQUE3QztBQURvQix5SUFFZEUsUUFGYztBQUdyQjs7QUFaZTtBQUFBLElBUWlCSCxrQkFSakI7O0FBZWxCRSx1QkFBcUJHLE1BQXJCLEdBQThCLFVBQUNDLElBQUQsRUFBVTtBQUN0QyxXQUFPLElBQUlKLG9CQUFKLENBQXlCLEVBQUVLLFdBQVdELElBQWIsRUFBekIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT0osb0JBQVA7QUFDRCxDQXBCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9hZ2dyZWdhdGUvZ3JhcGgvb3JpZW50YXRpb25fdGltZS9ncmFwaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJylcbiAgXG4gIGNvbnN0IEFnZ3JlZ2F0ZVRpbWVHcmFwaCA9IHJlcXVpcmUoJ2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL3RpbWUvZ3JhcGgnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKTtcblxuICBjbGFzcyBPcmllbnRhdGlvblRpbWVHcmFwaCBleHRlbmRzIEFnZ3JlZ2F0ZVRpbWVHcmFwaCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cbiAgfVxuXG4gIE9yaWVudGF0aW9uVGltZUdyYXBoLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBPcmllbnRhdGlvblRpbWVHcmFwaCh7IG1vZGVsRGF0YTogZGF0YSB9KVxuICB9XG5cbiAgcmV0dXJuIE9yaWVudGF0aW9uVGltZUdyYXBoO1xufSkiXX0=
