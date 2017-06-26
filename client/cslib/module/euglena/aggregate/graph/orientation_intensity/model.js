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
    graph_class: 'orientation_intensity',
    label: 'Orientation WRT Light by Light Intensity',
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
    _inherits(OrientationIntensityGraphModel, _Model);

    function OrientationIntensityGraphModel(conf) {
      _classCallCheck(this, OrientationIntensityGraphModel);

      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      return _possibleConstructorReturn(this, (OrientationIntensityGraphModel.__proto__ || Object.getPrototypeOf(OrientationIntensityGraphModel)).call(this, conf));
    }

    _createClass(OrientationIntensityGraphModel, [{
      key: 'update',
      value: function update(datasets) {
        var _this2 = this;

        var histograms = {};
        Object.values(datasets).forEach(function (group) {
          group.get('results').forEach(function (res) {
            histograms[res.get('id')] = _this2.generateBuckets(res, group.get('experiment'));
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
            var lights = EugUtils.getLightState(exp.configuration, sample.time, { angle: true, intensity: true });
            var bucket = Utils.roundDecimal(lights.intensity, -2).toString();
            buckets[bucket] = buckets[bucket] || { samples: [] };
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

    return OrientationIntensityGraphModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9pbnRlbnNpdHkvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kZWwiLCJkZWZhdWx0cyIsImdyYXBoX2NsYXNzIiwibGFiZWwiLCJ3aWR0aCIsImhlaWdodCIsIm1hcmdpbnMiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJFdWdVdGlscyIsImNvbmYiLCJlbnN1cmVEZWZhdWx0cyIsImRhdGFzZXRzIiwiaGlzdG9ncmFtcyIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJncm91cCIsImdldCIsInJlcyIsImdlbmVyYXRlQnVja2V0cyIsInNldCIsImV4cCIsImJ1Y2tldHMiLCJ0cmFjayIsInNhbXBsZXMiLCJzYW1wbGUiLCJsaWdodHMiLCJnZXRMaWdodFN0YXRlIiwiY29uZmlndXJhdGlvbiIsInRpbWUiLCJhbmdsZSIsImludGVuc2l0eSIsImJ1Y2tldCIsInJvdW5kRGVjaW1hbCIsInRvU3RyaW5nIiwicHVzaCIsInlhdyIsIngiLCJ5IiwiTWF0aCIsImNvcyIsInNpbiIsInZhbHVlIiwiYXRhbjIiLCJQSSIsImlkIiwiY29sb3IiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxRQUFRSixRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLGlCQUFhLHVCQURKO0FBRVRDLFdBQU8sMENBRkU7QUFHVEMsV0FBTyxHQUhFO0FBSVRDLFlBQVEsR0FKQztBQUtUQyxhQUFTO0FBQ1BDLFdBQUssRUFERTtBQUVQQyxjQUFRLEVBRkQ7QUFHUEMsWUFBTSxFQUhDO0FBSVBDLGFBQU87QUFKQTtBQUxBLEdBRGI7QUFBQSxNQWFFQyxXQUFXZixRQUFRLGVBQVIsQ0FiYjs7QUFlQTtBQUFBOztBQUNFLDRDQUFZZ0IsSUFBWixFQUFrQjtBQUFBOztBQUNoQkEsV0FBS1gsUUFBTCxHQUFnQkosTUFBTWdCLGNBQU4sQ0FBcUJELEtBQUtYLFFBQTFCLEVBQW9DQSxRQUFwQyxDQUFoQjtBQURnQiw2SkFFVlcsSUFGVTtBQUdqQjs7QUFKSDtBQUFBO0FBQUEsNkJBTVNFLFFBTlQsRUFNbUI7QUFBQTs7QUFDZixZQUFNQyxhQUFhLEVBQW5CO0FBQ0FDLGVBQU9DLE1BQVAsQ0FBY0gsUUFBZCxFQUF3QkksT0FBeEIsQ0FBZ0MsVUFBQ0MsS0FBRCxFQUFXO0FBQ3pDQSxnQkFBTUMsR0FBTixDQUFVLFNBQVYsRUFBcUJGLE9BQXJCLENBQTZCLFVBQUNHLEdBQUQsRUFBUztBQUNwQ04sdUJBQVdNLElBQUlELEdBQUosQ0FBUSxJQUFSLENBQVgsSUFBNEIsT0FBS0UsZUFBTCxDQUFxQkQsR0FBckIsRUFBMEJGLE1BQU1DLEdBQU4sQ0FBVSxZQUFWLENBQTFCLENBQTVCO0FBQ0QsV0FGRDtBQUdELFNBSkQ7QUFLQSxhQUFLRyxHQUFMLENBQVMsT0FBVCxFQUFrQjtBQUNoQlIsc0JBQVlBO0FBREksU0FBbEI7QUFHRDtBQWhCSDtBQUFBO0FBQUEsc0NBa0JrQk0sR0FsQmxCLEVBa0J1QkcsR0FsQnZCLEVBa0I0QjtBQUN4QixZQUFNQyxVQUFVLEVBQWhCO0FBQ0FKLFlBQUlELEdBQUosQ0FBUSxRQUFSLEVBQWtCRixPQUFsQixDQUEwQixVQUFDUSxLQUFELEVBQVc7QUFDbkNBLGdCQUFNQyxPQUFOLENBQWNULE9BQWQsQ0FBc0IsVUFBQ1UsTUFBRCxFQUFZO0FBQ2hDLGdCQUFJQyxTQUFTbEIsU0FBU21CLGFBQVQsQ0FBdUJOLElBQUlPLGFBQTNCLEVBQTBDSCxPQUFPSSxJQUFqRCxFQUF1RCxFQUFFQyxPQUFPLElBQVQsRUFBZUMsV0FBVyxJQUExQixFQUF2RCxDQUFiO0FBQ0EsZ0JBQUlDLFNBQVN0QyxNQUFNdUMsWUFBTixDQUFtQlAsT0FBT0ssU0FBMUIsRUFBcUMsQ0FBQyxDQUF0QyxFQUF5Q0csUUFBekMsRUFBYjtBQUNBWixvQkFBUVUsTUFBUixJQUFrQlYsUUFBUVUsTUFBUixLQUFtQixFQUFFUixTQUFTLEVBQVgsRUFBckM7QUFDQUYsb0JBQVFVLE1BQVIsRUFBZ0JSLE9BQWhCLENBQXdCVyxJQUF4QixDQUE2QlYsT0FBT1csR0FBUCxHQUFhVixPQUFPSSxLQUFqRDtBQUNELFdBTEQ7QUFNRCxTQVBEO0FBUUFqQixlQUFPQyxNQUFQLENBQWNRLE9BQWQsRUFBdUJQLE9BQXZCLENBQStCLFVBQUNpQixNQUFELEVBQVk7QUFDekMsY0FBSUssSUFBSSxDQUFSO0FBQUEsY0FBV0MsSUFBSSxDQUFmO0FBQ0FOLGlCQUFPUixPQUFQLENBQWVULE9BQWYsQ0FBdUIsVUFBQ2UsS0FBRCxFQUFXO0FBQ2hDTyxpQkFBS0UsS0FBS0MsR0FBTCxDQUFTVixLQUFULENBQUw7QUFDQVEsaUJBQUtDLEtBQUtFLEdBQUwsQ0FBU1gsS0FBVCxDQUFMO0FBQ0QsV0FIRDtBQUlBRSxpQkFBT1UsS0FBUCxHQUFlSCxLQUFLSSxLQUFMLENBQVdMLENBQVgsRUFBY0QsQ0FBZCxJQUFtQixHQUFuQixHQUF5QkUsS0FBS0ssRUFBN0M7QUFDRCxTQVBEO0FBUUEsZUFBTztBQUNMQyxjQUFJM0IsSUFBSUQsR0FBSixDQUFRLElBQVIsQ0FEQztBQUVMNkIsaUJBQU81QixJQUFJRCxHQUFKLENBQVEsT0FBUixDQUZGO0FBR0w4QixnQkFBTXpCO0FBSEQsU0FBUDtBQUtEO0FBekNIOztBQUFBO0FBQUEsSUFBb0R6QixLQUFwRDtBQTJDRCxDQS9ERCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9hZ2dyZWdhdGUvZ3JhcGgvb3JpZW50YXRpb25faW50ZW5zaXR5L21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
