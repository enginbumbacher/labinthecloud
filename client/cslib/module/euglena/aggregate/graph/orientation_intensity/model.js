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

    return OrientationIntensityGraphModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9pbnRlbnNpdHkvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kZWwiLCJkZWZhdWx0cyIsImdyYXBoX2NsYXNzIiwibGFiZWwiLCJ3aWR0aCIsImhlaWdodCIsIm1hcmdpbnMiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJFdWdVdGlscyIsImNvbmYiLCJlbnN1cmVEZWZhdWx0cyIsImRhdGFzZXRzIiwiaGlzdG9ncmFtcyIsIk9iamVjdCIsInZhbHVlcyIsImZvckVhY2giLCJncm91cCIsImdldCIsInJlcyIsImdlbmVyYXRlQnVja2V0cyIsInNldCIsImV4cCIsImJ1Y2tldHMiLCJ0cmFjayIsInNhbXBsZXMiLCJzYW1wbGUiLCJsaWdodHMiLCJnZXRMaWdodFN0YXRlIiwiY29uZmlndXJhdGlvbiIsInRpbWUiLCJhbmdsZSIsImludGVuc2l0eSIsImJ1Y2tldCIsInJvdW5kRGVjaW1hbCIsInRvU3RyaW5nIiwicHVzaCIsImFuZ2xlWFkiLCJ4IiwieSIsIk1hdGgiLCJjb3MiLCJzaW4iLCJ2YWx1ZSIsImF0YW4yIiwiUEkiLCJpZCIsImNvbG9yIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksUUFBUUosUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRUssV0FBVztBQUNUQyxpQkFBYSx1QkFESjtBQUVUQyxXQUFPLDBDQUZFO0FBR1RDLFdBQU8sR0FIRTtBQUlUQyxZQUFRLEdBSkM7QUFLVEMsYUFBUztBQUNQQyxXQUFLLEVBREU7QUFFUEMsY0FBUSxFQUZEO0FBR1BDLFlBQU0sRUFIQztBQUlQQyxhQUFPO0FBSkE7QUFMQSxHQURiO0FBQUEsTUFhRUMsV0FBV2YsUUFBUSxlQUFSLENBYmI7O0FBZUE7QUFBQTs7QUFDRSw0Q0FBWWdCLElBQVosRUFBa0I7QUFBQTs7QUFDaEJBLFdBQUtYLFFBQUwsR0FBZ0JKLE1BQU1nQixjQUFOLENBQXFCRCxLQUFLWCxRQUExQixFQUFvQ0EsUUFBcEMsQ0FBaEI7QUFEZ0IsNkpBRVZXLElBRlU7QUFHakI7O0FBSkg7QUFBQTtBQUFBLDZCQU1TRSxRQU5ULEVBTW1CO0FBQUE7O0FBQ2YsWUFBTUMsYUFBYSxFQUFuQjtBQUNBQyxlQUFPQyxNQUFQLENBQWNILFFBQWQsRUFBd0JJLE9BQXhCLENBQWdDLFVBQUNDLEtBQUQsRUFBVztBQUN6Q0EsZ0JBQU1DLEdBQU4sQ0FBVSxTQUFWLEVBQXFCRixPQUFyQixDQUE2QixVQUFDRyxHQUFELEVBQVM7QUFDcENOLHVCQUFXTSxJQUFJRCxHQUFKLENBQVEsSUFBUixDQUFYLElBQTRCLE9BQUtFLGVBQUwsQ0FBcUJELEdBQXJCLEVBQTBCRixNQUFNQyxHQUFOLENBQVUsWUFBVixDQUExQixDQUE1QjtBQUNELFdBRkQ7QUFHRCxTQUpEO0FBS0EsYUFBS0csR0FBTCxDQUFTLE9BQVQsRUFBa0I7QUFDaEJSLHNCQUFZQTtBQURJLFNBQWxCO0FBR0Q7QUFoQkg7QUFBQTtBQUFBLHNDQWtCa0JNLEdBbEJsQixFQWtCdUJHLEdBbEJ2QixFQWtCNEI7QUFDeEIsWUFBTUMsVUFBVSxFQUFoQjtBQUNBSixZQUFJRCxHQUFKLENBQVEsUUFBUixFQUFrQkYsT0FBbEIsQ0FBMEIsVUFBQ1EsS0FBRCxFQUFXO0FBQ25DQSxnQkFBTUMsT0FBTixDQUFjVCxPQUFkLENBQXNCLFVBQUNVLE1BQUQsRUFBWTtBQUNoQyxnQkFBSUMsU0FBU2xCLFNBQVNtQixhQUFULENBQXVCTixJQUFJTyxhQUEzQixFQUEwQ0gsT0FBT0ksSUFBakQsRUFBdUQsRUFBRUMsT0FBTyxJQUFULEVBQWVDLFdBQVcsSUFBMUIsRUFBdkQsQ0FBYjtBQUNBLGdCQUFJQyxTQUFTdEMsTUFBTXVDLFlBQU4sQ0FBbUJQLE9BQU9LLFNBQTFCLEVBQXFDLENBQUMsQ0FBdEMsRUFBeUNHLFFBQXpDLEVBQWI7QUFDQVosb0JBQVFVLE1BQVIsSUFBa0JWLFFBQVFVLE1BQVIsS0FBbUIsRUFBRVIsU0FBUyxFQUFYLEVBQXJDO0FBQ0FGLG9CQUFRVSxNQUFSLEVBQWdCUixPQUFoQixDQUF3QlcsSUFBeEIsQ0FBNkJWLE9BQU9XLE9BQVAsR0FBaUJWLE9BQU9JLEtBQXJEO0FBQ0QsV0FMRDtBQU1ELFNBUEQ7QUFRQWpCLGVBQU9DLE1BQVAsQ0FBY1EsT0FBZCxFQUF1QlAsT0FBdkIsQ0FBK0IsVUFBQ2lCLE1BQUQsRUFBWTtBQUN6QyxjQUFJSyxJQUFJLENBQVI7QUFBQSxjQUFXQyxJQUFJLENBQWY7QUFDQU4saUJBQU9SLE9BQVAsQ0FBZVQsT0FBZixDQUF1QixVQUFDZSxLQUFELEVBQVc7QUFDaENPLGlCQUFLRSxLQUFLQyxHQUFMLENBQVNWLEtBQVQsQ0FBTDtBQUNBUSxpQkFBS0MsS0FBS0UsR0FBTCxDQUFTWCxLQUFULENBQUw7QUFDRCxXQUhEO0FBSUFFLGlCQUFPVSxLQUFQLEdBQWVILEtBQUtJLEtBQUwsQ0FBV0wsQ0FBWCxFQUFjRCxDQUFkLElBQW1CLEdBQW5CLEdBQXlCRSxLQUFLSyxFQUE3QztBQUNELFNBUEQ7QUFRQSxlQUFPO0FBQ0xDLGNBQUkzQixJQUFJRCxHQUFKLENBQVEsSUFBUixDQURDO0FBRUw2QixpQkFBTzVCLElBQUlELEdBQUosQ0FBUSxPQUFSLENBRkY7QUFHTDhCLGdCQUFNekI7QUFIRCxTQUFQO0FBS0Q7QUF6Q0g7O0FBQUE7QUFBQSxJQUFvRHpCLEtBQXBEO0FBMkNELENBL0REIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9vcmllbnRhdGlvbl9pbnRlbnNpdHkvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpXG4gIFxuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIGdyYXBoX2NsYXNzOiAnb3JpZW50YXRpb25faW50ZW5zaXR5JyxcbiAgICAgIGxhYmVsOiAnT3JpZW50YXRpb24gV1JUIExpZ2h0IGJ5IExpZ2h0IEludGVuc2l0eScsXG4gICAgICB3aWR0aDogNTAwLFxuICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICBtYXJnaW5zOiB7XG4gICAgICAgIHRvcDogMjAsXG4gICAgICAgIGJvdHRvbTogNDAsXG4gICAgICAgIGxlZnQ6IDgwLFxuICAgICAgICByaWdodDogMjBcbiAgICAgIH1cbiAgICB9LFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpXG5cbiAgcmV0dXJuIGNsYXNzIE9yaWVudGF0aW9uSW50ZW5zaXR5R3JhcGhNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25mKSB7XG4gICAgICBjb25mLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZi5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZik7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRhdGFzZXRzKSB7XG4gICAgICBjb25zdCBoaXN0b2dyYW1zID0ge307XG4gICAgICBPYmplY3QudmFsdWVzKGRhdGFzZXRzKS5mb3JFYWNoKChncm91cCkgPT4ge1xuICAgICAgICBncm91cC5nZXQoJ3Jlc3VsdHMnKS5mb3JFYWNoKChyZXMpID0+IHtcbiAgICAgICAgICBoaXN0b2dyYW1zW3Jlcy5nZXQoJ2lkJyldID0gdGhpcy5nZW5lcmF0ZUJ1Y2tldHMocmVzLCBncm91cC5nZXQoJ2V4cGVyaW1lbnQnKSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnNldCgnZ3JhcGgnLCB7XG4gICAgICAgIGhpc3RvZ3JhbXM6IGhpc3RvZ3JhbXNcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZ2VuZXJhdGVCdWNrZXRzKHJlcywgZXhwKSB7XG4gICAgICBjb25zdCBidWNrZXRzID0ge307XG4gICAgICByZXMuZ2V0KCd0cmFja3MnKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICB0cmFjay5zYW1wbGVzLmZvckVhY2goKHNhbXBsZSkgPT4ge1xuICAgICAgICAgIGxldCBsaWdodHMgPSBFdWdVdGlscy5nZXRMaWdodFN0YXRlKGV4cC5jb25maWd1cmF0aW9uLCBzYW1wbGUudGltZSwgeyBhbmdsZTogdHJ1ZSwgaW50ZW5zaXR5OiB0cnVlIH0pXG4gICAgICAgICAgbGV0IGJ1Y2tldCA9IFV0aWxzLnJvdW5kRGVjaW1hbChsaWdodHMuaW50ZW5zaXR5LCAtMikudG9TdHJpbmcoKVxuICAgICAgICAgIGJ1Y2tldHNbYnVja2V0XSA9IGJ1Y2tldHNbYnVja2V0XSB8fCB7IHNhbXBsZXM6IFtdIH07XG4gICAgICAgICAgYnVja2V0c1tidWNrZXRdLnNhbXBsZXMucHVzaChzYW1wbGUuYW5nbGVYWSAtIGxpZ2h0cy5hbmdsZSk7XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgT2JqZWN0LnZhbHVlcyhidWNrZXRzKS5mb3JFYWNoKChidWNrZXQpID0+IHtcbiAgICAgICAgbGV0IHggPSAwLCB5ID0gMDtcbiAgICAgICAgYnVja2V0LnNhbXBsZXMuZm9yRWFjaCgoYW5nbGUpID0+IHtcbiAgICAgICAgICB4ICs9IE1hdGguY29zKGFuZ2xlKVxuICAgICAgICAgIHkgKz0gTWF0aC5zaW4oYW5nbGUpXG4gICAgICAgIH0pXG4gICAgICAgIGJ1Y2tldC52YWx1ZSA9IE1hdGguYXRhbjIoeSwgeCkgKiAxODAgLyBNYXRoLlBJXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHJlcy5nZXQoJ2lkJyksXG4gICAgICAgIGNvbG9yOiByZXMuZ2V0KCdjb2xvcicpLFxuICAgICAgICBkYXRhOiBidWNrZXRzXG4gICAgICB9XG4gICAgfVxuICB9XG59KSJdfQ==
