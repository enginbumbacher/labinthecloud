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

  var VelocityTimeGraph = function (_AggregateTimeGraph) {
    _inherits(VelocityTimeGraph, _AggregateTimeGraph);

    function VelocityTimeGraph(settings) {
      _classCallCheck(this, VelocityTimeGraph);

      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, (VelocityTimeGraph.__proto__ || Object.getPrototypeOf(VelocityTimeGraph)).call(this, settings));
    }

    return VelocityTimeGraph;
  }(AggregateTimeGraph);

  VelocityTimeGraph.create = function (data) {
    return new VelocityTimeGraph({ modelData: data });
  };

  return VelocityTimeGraph;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC92ZWxvY2l0eV90aW1lL2dyYXBoLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkFnZ3JlZ2F0ZVRpbWVHcmFwaCIsIk1vZGVsIiwiVmVsb2NpdHlUaW1lR3JhcGgiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJjcmVhdGUiLCJkYXRhIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUkscUJBQXFCSixRQUFRLG9DQUFSLENBQTNCO0FBQUEsTUFDRUssUUFBUUwsUUFBUSxTQUFSLENBRFY7O0FBTGtCLE1BUVpNLGlCQVJZO0FBQUE7O0FBU2hCLCtCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSCxLQUE3QztBQURvQixtSUFFZEUsUUFGYztBQUdyQjs7QUFaZTtBQUFBLElBUWNILGtCQVJkOztBQWVsQkUsb0JBQWtCRyxNQUFsQixHQUEyQixVQUFDQyxJQUFELEVBQVU7QUFDbkMsV0FBTyxJQUFJSixpQkFBSixDQUFzQixFQUFFSyxXQUFXRCxJQUFiLEVBQXRCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9KLGlCQUFQO0FBQ0QsQ0FwQkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL3ZlbG9jaXR5X3RpbWUvZ3JhcGguanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==