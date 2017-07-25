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
            buckets[bucket].samples.push(sample.yaw - lights.angle);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9kaXJlY3Rpb24vbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kZWwiLCJkZWZhdWx0cyIsImdyYXBoX2NsYXNzIiwibGFiZWwiLCJ3aWR0aCIsImhlaWdodCIsIm1hcmdpbnMiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJFdWdVdGlscyIsImNvbmYiLCJlbnN1cmVEZWZhdWx0cyIsImRhdGFzZXRzIiwiaGlzdG9ncmFtcyIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJncm91cCIsImdldCIsInJlcyIsInB1c2giLCJnZW5lcmF0ZUJ1Y2tldHMiLCJzZXQiLCJleHAiLCJidWNrZXRzIiwidHJhY2siLCJzYW1wbGVzIiwic2FtcGxlIiwibGlnaHRzIiwiZ2V0TGlnaHRTdGF0ZSIsImNvbmZpZ3VyYXRpb24iLCJ0aW1lIiwiYW5nbGUiLCJidWNrZXQiLCJ0b1N0cmluZyIsInlhdyIsIngiLCJ5IiwiTWF0aCIsImNvcyIsInNpbiIsInZhbHVlIiwiYXRhbjIiLCJQSSIsImlkIiwiY29sb3IiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxRQUFRSixRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLGlCQUFhLHVCQURKO0FBRVRDLFdBQU8sMENBRkU7QUFHVEMsV0FBTyxHQUhFO0FBSVRDLFlBQVEsR0FKQztBQUtUQyxhQUFTO0FBQ1BDLFdBQUssRUFERTtBQUVQQyxjQUFRLEVBRkQ7QUFHUEMsWUFBTSxFQUhDO0FBSVBDLGFBQU87QUFKQTtBQUxBLEdBRGI7QUFBQSxNQWFFQyxXQUFXZixRQUFRLGVBQVIsQ0FiYjs7QUFlQTtBQUFBOztBQUNFLDRDQUFZZ0IsSUFBWixFQUFrQjtBQUFBOztBQUNoQkEsV0FBS1gsUUFBTCxHQUFnQkosTUFBTWdCLGNBQU4sQ0FBcUJELEtBQUtYLFFBQTFCLEVBQW9DQSxRQUFwQyxDQUFoQjtBQURnQiw2SkFFVlcsSUFGVTtBQUdqQjs7QUFKSDtBQUFBO0FBQUEsNkJBTVNFLFFBTlQsRUFNbUI7QUFBQTs7QUFDZixZQUFNQyxhQUFhLEVBQW5CO0FBQ0FDLGVBQU9DLE1BQVAsQ0FBY0gsUUFBZCxFQUF3QkksT0FBeEIsQ0FBZ0MsVUFBQ0MsS0FBRCxFQUFXO0FBQ3pDQSxnQkFBTUMsR0FBTixDQUFVLFNBQVYsRUFBcUJGLE9BQXJCLENBQTZCLFVBQUNHLEdBQUQsRUFBUztBQUNwQ04sdUJBQVdPLElBQVgsQ0FBZ0IsT0FBS0MsZUFBTCxDQUFxQkYsR0FBckIsRUFBMEJGLE1BQU1DLEdBQU4sQ0FBVSxZQUFWLENBQTFCLENBQWhCO0FBQ0QsV0FGRDtBQUdELFNBSkQ7QUFLQSxhQUFLSSxHQUFMLENBQVMsT0FBVCxFQUFrQjtBQUNoQlQsc0JBQVlBO0FBREksU0FBbEI7QUFHRDtBQWhCSDtBQUFBO0FBQUEsc0NBa0JrQk0sR0FsQmxCLEVBa0J1QkksR0FsQnZCLEVBa0I0QjtBQUN4QixZQUFNQyxVQUFVLEVBQWhCO0FBQ0FMLFlBQUlELEdBQUosQ0FBUSxRQUFSLEVBQWtCRixPQUFsQixDQUEwQixVQUFDUyxLQUFELEVBQVc7QUFDbkNBLGdCQUFNQyxPQUFOLENBQWNWLE9BQWQsQ0FBc0IsVUFBQ1csTUFBRCxFQUFZO0FBQ2hDLGdCQUFJQyxTQUFTbkIsU0FBU29CLGFBQVQsQ0FBdUJOLElBQUlPLGFBQTNCLEVBQTBDSCxPQUFPSSxJQUFqRCxFQUF1RCxFQUFFQyxPQUFPLElBQVQsRUFBdkQsQ0FBYjtBQUNBLGdCQUFJQyxTQUFTTCxPQUFPSSxLQUFQLENBQWFFLFFBQWIsRUFBYjtBQUNBVixvQkFBUVMsTUFBUixJQUFrQlQsUUFBUVMsTUFBUixLQUFtQixFQUFFRCxPQUFPSixPQUFPSSxLQUFoQixFQUF1Qk4sU0FBUyxFQUFoQyxFQUFyQztBQUNBRixvQkFBUVMsTUFBUixFQUFnQlAsT0FBaEIsQ0FBd0JOLElBQXhCLENBQTZCTyxPQUFPUSxHQUFQLEdBQWFQLE9BQU9JLEtBQWpEO0FBQ0QsV0FMRDtBQU1ELFNBUEQ7QUFRQWxCLGVBQU9DLE1BQVAsQ0FBY1MsT0FBZCxFQUF1QlIsT0FBdkIsQ0FBK0IsVUFBQ2lCLE1BQUQsRUFBWTtBQUN6QyxjQUFJRyxJQUFJLENBQVI7QUFBQSxjQUFXQyxJQUFJLENBQWY7QUFDQUosaUJBQU9QLE9BQVAsQ0FBZVYsT0FBZixDQUF1QixVQUFDZ0IsS0FBRCxFQUFXO0FBQ2hDSSxpQkFBS0UsS0FBS0MsR0FBTCxDQUFTUCxLQUFULENBQUw7QUFDQUssaUJBQUtDLEtBQUtFLEdBQUwsQ0FBU1IsS0FBVCxDQUFMO0FBQ0QsV0FIRDtBQUlBQyxpQkFBT1EsS0FBUCxHQUFlSCxLQUFLSSxLQUFMLENBQVdMLENBQVgsRUFBY0QsQ0FBZCxJQUFtQixHQUFuQixHQUF5QkUsS0FBS0ssRUFBN0M7QUFDRCxTQVBEO0FBUUEsZUFBTztBQUNMQyxjQUFJekIsSUFBSUQsR0FBSixDQUFRLElBQVIsQ0FEQztBQUVMMkIsaUJBQU8xQixJQUFJRCxHQUFKLENBQVEsT0FBUixDQUZGO0FBR0w0QixnQkFBTXRCO0FBSEQsU0FBUDtBQUtEO0FBekNIOztBQUFBO0FBQUEsSUFBb0QxQixLQUFwRDtBQTJDRCxDQS9ERCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9hZ2dyZWdhdGUvZ3JhcGgvb3JpZW50YXRpb25fZGlyZWN0aW9uL21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
