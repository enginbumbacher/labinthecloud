'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Model = require('core/model/model'),
      defaults = {
    graph_class: 'orientation_Direction',
    label: 'Orientation WRT Light by Light Direction',
    width: 500,
    height: 300,
    margins: {
      top: 20,
      bottom: 40,
      left: 80,
      right: 20
    }
  },
      EugUtils = require('euglena/utils');

  return function (_Model) {
    _inherits(OrientationDirectionGraphModel, _Model);

    function OrientationDirectionGraphModel(conf) {
      _classCallCheck(this, OrientationDirectionGraphModel);

      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      return _possibleConstructorReturn(this, (OrientationDirectionGraphModel.__proto__ || Object.getPrototypeOf(OrientationDirectionGraphModel)).call(this, conf));
    }

    _createClass(OrientationDirectionGraphModel, [{
      key: 'update',
      value: function update(datasets) {
        var _this2 = this;

        var histograms = [];
        Object.values(datasets).forEach(function (group) {
          group.get('results').forEach(function (res) {
            histograms.push(_this2.generateBuckets(res, group.get('experiment')));
          });
        });
        this.set('graph', {
          histograms: histograms
        });
      }
    }, {
      key: 'generateBuckets',
      value: function generateBuckets(res, exp) {
        var buckets = {};
        res.get('tracks').forEach(function (track) {
          track.samples.forEach(function (sample) {
            var lights = EugUtils.getLightState(exp.configuration, sample.time, { angle: true });
            var bucket = lights.angle.toString();
            buckets[bucket] = buckets[bucket] || { angle: lights.angle, samples: [] };
            buckets[bucket].samples.push(sample.angleXY - lights.angle);
          });
        });
        Object.values(buckets).forEach(function (bucket) {
          var x = 0,
              y = 0;
          bucket.samples.forEach(function (angle) {
            x += Math.cos(angle);
            y += Math.sin(angle);
          });
          bucket.value = Math.atan2(y, x) * 180 / Math.PI;
        });
        return {
          id: res.get('id'),
          color: res.get('color'),
          data: buckets
        };
      }
    }]);

    return OrientationDirectionGraphModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9kaXJlY3Rpb24vbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kZWwiLCJkZWZhdWx0cyIsImdyYXBoX2NsYXNzIiwibGFiZWwiLCJ3aWR0aCIsImhlaWdodCIsIm1hcmdpbnMiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJFdWdVdGlscyIsImNvbmYiLCJlbnN1cmVEZWZhdWx0cyIsImRhdGFzZXRzIiwiaGlzdG9ncmFtcyIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJncm91cCIsImdldCIsInJlcyIsInB1c2giLCJnZW5lcmF0ZUJ1Y2tldHMiLCJzZXQiLCJleHAiLCJidWNrZXRzIiwidHJhY2siLCJzYW1wbGVzIiwic2FtcGxlIiwibGlnaHRzIiwiZ2V0TGlnaHRTdGF0ZSIsImNvbmZpZ3VyYXRpb24iLCJ0aW1lIiwiYW5nbGUiLCJidWNrZXQiLCJ0b1N0cmluZyIsImFuZ2xlWFkiLCJ4IiwieSIsIk1hdGgiLCJjb3MiLCJzaW4iLCJ2YWx1ZSIsImF0YW4yIiwiUEkiLCJpZCIsImNvbG9yIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksUUFBUUosUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRUssV0FBVztBQUNUQyxpQkFBYSx1QkFESjtBQUVUQyxXQUFPLDBDQUZFO0FBR1RDLFdBQU8sR0FIRTtBQUlUQyxZQUFRLEdBSkM7QUFLVEMsYUFBUztBQUNQQyxXQUFLLEVBREU7QUFFUEMsY0FBUSxFQUZEO0FBR1BDLFlBQU0sRUFIQztBQUlQQyxhQUFPO0FBSkE7QUFMQSxHQURiO0FBQUEsTUFhRUMsV0FBV2YsUUFBUSxlQUFSLENBYmI7O0FBZUE7QUFBQTs7QUFDRSw0Q0FBWWdCLElBQVosRUFBa0I7QUFBQTs7QUFDaEJBLFdBQUtYLFFBQUwsR0FBZ0JKLE1BQU1nQixjQUFOLENBQXFCRCxLQUFLWCxRQUExQixFQUFvQ0EsUUFBcEMsQ0FBaEI7QUFEZ0IsNkpBRVZXLElBRlU7QUFHakI7O0FBSkg7QUFBQTtBQUFBLDZCQU1TRSxRQU5ULEVBTW1CO0FBQUE7O0FBQ2YsWUFBTUMsYUFBYSxFQUFuQjtBQUNBQyxlQUFPQyxNQUFQLENBQWNILFFBQWQsRUFBd0JJLE9BQXhCLENBQWdDLFVBQUNDLEtBQUQsRUFBVztBQUN6Q0EsZ0JBQU1DLEdBQU4sQ0FBVSxTQUFWLEVBQXFCRixPQUFyQixDQUE2QixVQUFDRyxHQUFELEVBQVM7QUFDcENOLHVCQUFXTyxJQUFYLENBQWdCLE9BQUtDLGVBQUwsQ0FBcUJGLEdBQXJCLEVBQTBCRixNQUFNQyxHQUFOLENBQVUsWUFBVixDQUExQixDQUFoQjtBQUNELFdBRkQ7QUFHRCxTQUpEO0FBS0EsYUFBS0ksR0FBTCxDQUFTLE9BQVQsRUFBa0I7QUFDaEJULHNCQUFZQTtBQURJLFNBQWxCO0FBR0Q7QUFoQkg7QUFBQTtBQUFBLHNDQWtCa0JNLEdBbEJsQixFQWtCdUJJLEdBbEJ2QixFQWtCNEI7QUFDeEIsWUFBTUMsVUFBVSxFQUFoQjtBQUNBTCxZQUFJRCxHQUFKLENBQVEsUUFBUixFQUFrQkYsT0FBbEIsQ0FBMEIsVUFBQ1MsS0FBRCxFQUFXO0FBQ25DQSxnQkFBTUMsT0FBTixDQUFjVixPQUFkLENBQXNCLFVBQUNXLE1BQUQsRUFBWTtBQUNoQyxnQkFBSUMsU0FBU25CLFNBQVNvQixhQUFULENBQXVCTixJQUFJTyxhQUEzQixFQUEwQ0gsT0FBT0ksSUFBakQsRUFBdUQsRUFBRUMsT0FBTyxJQUFULEVBQXZELENBQWI7QUFDQSxnQkFBSUMsU0FBU0wsT0FBT0ksS0FBUCxDQUFhRSxRQUFiLEVBQWI7QUFDQVYsb0JBQVFTLE1BQVIsSUFBa0JULFFBQVFTLE1BQVIsS0FBbUIsRUFBRUQsT0FBT0osT0FBT0ksS0FBaEIsRUFBdUJOLFNBQVMsRUFBaEMsRUFBckM7QUFDQUYsb0JBQVFTLE1BQVIsRUFBZ0JQLE9BQWhCLENBQXdCTixJQUF4QixDQUE2Qk8sT0FBT1EsT0FBUCxHQUFpQlAsT0FBT0ksS0FBckQ7QUFDRCxXQUxEO0FBTUQsU0FQRDtBQVFBbEIsZUFBT0MsTUFBUCxDQUFjUyxPQUFkLEVBQXVCUixPQUF2QixDQUErQixVQUFDaUIsTUFBRCxFQUFZO0FBQ3pDLGNBQUlHLElBQUksQ0FBUjtBQUFBLGNBQVdDLElBQUksQ0FBZjtBQUNBSixpQkFBT1AsT0FBUCxDQUFlVixPQUFmLENBQXVCLFVBQUNnQixLQUFELEVBQVc7QUFDaENJLGlCQUFLRSxLQUFLQyxHQUFMLENBQVNQLEtBQVQsQ0FBTDtBQUNBSyxpQkFBS0MsS0FBS0UsR0FBTCxDQUFTUixLQUFULENBQUw7QUFDRCxXQUhEO0FBSUFDLGlCQUFPUSxLQUFQLEdBQWVILEtBQUtJLEtBQUwsQ0FBV0wsQ0FBWCxFQUFjRCxDQUFkLElBQW1CLEdBQW5CLEdBQXlCRSxLQUFLSyxFQUE3QztBQUNELFNBUEQ7QUFRQSxlQUFPO0FBQ0xDLGNBQUl6QixJQUFJRCxHQUFKLENBQVEsSUFBUixDQURDO0FBRUwyQixpQkFBTzFCLElBQUlELEdBQUosQ0FBUSxPQUFSLENBRkY7QUFHTDRCLGdCQUFNdEI7QUFIRCxTQUFQO0FBS0Q7QUF6Q0g7O0FBQUE7QUFBQSxJQUFvRDFCLEtBQXBEO0FBMkNELENBL0REIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9kaXJlY3Rpb24vbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
