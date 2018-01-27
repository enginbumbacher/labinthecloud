'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var EuglenaThreeView = require('euglena/model/threeview'),
      THREE = require('three'),
      Utils = require('core/util/utils'),
      defaults = {
    eyeColor: 0xffffff
  };

  return function (_EuglenaThreeView) {
    _inherits(ModelView, _EuglenaThreeView);

    function ModelView(config) {
      _classCallCheck(this, ModelView);

      var _this = _possibleConstructorReturn(this, (ModelView.__proto__ || Object.getPrototypeOf(ModelView)).call(this, config));

      _this.config = Utils.ensureDefaults(_this.config, defaults);
      _this.addEye({ z: _this.tubeCurve.getPoint(0.85).z, y: _this.config.tubeRadius * 2 / 3, x: 0 }, 0.75);
      _this.addEye({ z: _this.tubeCurve.getPoint(0.85).z, y: -_this.config.tubeRadius * 2 / 3, x: 0 }, 0.75);
      return _this;
    }

    _createClass(ModelView, [{
      key: 'addEye',
      value: function addEye(position, scale) {
        var sphereGeom = new THREE.SphereGeometry(this.config.tubeRadius, this.config.tubeSegments, this.config.tubeSegments);
        var colmat = new THREE.MeshLambertMaterial({ color: this.config.eyeColor });
        var eye = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [colmat]);
        var _arr = ['x', 'y', 'z'];
        for (var _i = 0; _i < _arr.length; _i++) {
          var key = _arr[_i];
          eye.scale[key] = scale;
          eye.position[key] = position[key] || 0;
        }
        this._body.add(eye);
      }
    }]);

    return ModelView;
  }(EuglenaThreeView);
});

// MODIFIY THIS FILE SUCH THAT THE LOOKS CHANGE ACCORDING TO THE SELECTED BODY CONFIGURATION.
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvdGhyZWV2aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJFdWdsZW5hVGhyZWVWaWV3IiwiVEhSRUUiLCJVdGlscyIsImRlZmF1bHRzIiwiZXllQ29sb3IiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImFkZEV5ZSIsInoiLCJ0dWJlQ3VydmUiLCJnZXRQb2ludCIsInkiLCJ0dWJlUmFkaXVzIiwieCIsInBvc2l0aW9uIiwic2NhbGUiLCJzcGhlcmVHZW9tIiwiU3BoZXJlR2VvbWV0cnkiLCJ0dWJlU2VnbWVudHMiLCJjb2xtYXQiLCJNZXNoTGFtYmVydE1hdGVyaWFsIiwiY29sb3IiLCJleWUiLCJTY2VuZVV0aWxzIiwiY3JlYXRlTXVsdGlNYXRlcmlhbE9iamVjdCIsImtleSIsIl9ib2R5IiwiYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLG1CQUFtQkQsUUFBUSx5QkFBUixDQUF6QjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsT0FBUixDQURWO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksV0FBVztBQUNUQyxjQUFVO0FBREQsR0FIYjs7QUFPQTtBQUFBOztBQUNFLHVCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsd0hBQ1pBLE1BRFk7O0FBRWxCLFlBQUtBLE1BQUwsR0FBY0gsTUFBTUksY0FBTixDQUFxQixNQUFLRCxNQUExQixFQUFrQ0YsUUFBbEMsQ0FBZDtBQUNBLFlBQUtJLE1BQUwsQ0FBWSxFQUFFQyxHQUFHLE1BQUtDLFNBQUwsQ0FBZUMsUUFBZixDQUF3QixJQUF4QixFQUE4QkYsQ0FBbkMsRUFBc0NHLEdBQUcsTUFBS04sTUFBTCxDQUFZTyxVQUFaLEdBQXlCLENBQXpCLEdBQTJCLENBQXBFLEVBQXVFQyxHQUFHLENBQTFFLEVBQVosRUFBMkYsSUFBM0Y7QUFDQSxZQUFLTixNQUFMLENBQVksRUFBRUMsR0FBRyxNQUFLQyxTQUFMLENBQWVDLFFBQWYsQ0FBd0IsSUFBeEIsRUFBOEJGLENBQW5DLEVBQXNDRyxHQUFHLENBQUMsTUFBS04sTUFBTCxDQUFZTyxVQUFiLEdBQTBCLENBQTFCLEdBQTRCLENBQXJFLEVBQXdFQyxHQUFHLENBQTNFLEVBQVosRUFBNEYsSUFBNUY7QUFKa0I7QUFLbkI7O0FBTkg7QUFBQTtBQUFBLDZCQVFTQyxRQVJULEVBUW1CQyxLQVJuQixFQVEwQjtBQUN0QixZQUFNQyxhQUFhLElBQUlmLE1BQU1nQixjQUFWLENBQXlCLEtBQUtaLE1BQUwsQ0FBWU8sVUFBckMsRUFBaUQsS0FBS1AsTUFBTCxDQUFZYSxZQUE3RCxFQUEyRSxLQUFLYixNQUFMLENBQVlhLFlBQXZGLENBQW5CO0FBQ0EsWUFBTUMsU0FBUyxJQUFJbEIsTUFBTW1CLG1CQUFWLENBQThCLEVBQUVDLE9BQU8sS0FBS2hCLE1BQUwsQ0FBWUQsUUFBckIsRUFBOUIsQ0FBZjtBQUNBLFlBQU1rQixNQUFNckIsTUFBTXNCLFVBQU4sQ0FBaUJDLHlCQUFqQixDQUEyQ1IsVUFBM0MsRUFBdUQsQ0FBQ0csTUFBRCxDQUF2RCxDQUFaO0FBSHNCLG1CQUlOLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLENBSk07QUFJdEIsaURBQWlDO0FBQTVCLGNBQUlNLGNBQUo7QUFDSEgsY0FBSVAsS0FBSixDQUFVVSxHQUFWLElBQWlCVixLQUFqQjtBQUNBTyxjQUFJUixRQUFKLENBQWFXLEdBQWIsSUFBb0JYLFNBQVNXLEdBQVQsS0FBaUIsQ0FBckM7QUFDRDtBQUNELGFBQUtDLEtBQUwsQ0FBV0MsR0FBWCxDQUFlTCxHQUFmO0FBQ0Q7QUFqQkg7O0FBQUE7QUFBQSxJQUErQnRCLGdCQUEvQjtBQW1CRCxDQTNCRDs7QUE2QkEiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS90aHJlZXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRXVnbGVuYVRocmVlVmlldyA9IHJlcXVpcmUoJ2V1Z2xlbmEvbW9kZWwvdGhyZWV2aWV3JyksXG4gICAgVEhSRUUgPSByZXF1aXJlKCd0aHJlZScpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBleWVDb2xvcjogMHhmZmZmZmZcbiAgICB9XG5cbiAgcmV0dXJuIGNsYXNzIE1vZGVsVmlldyBleHRlbmRzIEV1Z2xlbmFUaHJlZVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgc3VwZXIoY29uZmlnKVxuICAgICAgdGhpcy5jb25maWcgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyh0aGlzLmNvbmZpZywgZGVmYXVsdHMpO1xuICAgICAgdGhpcy5hZGRFeWUoeyB6OiB0aGlzLnR1YmVDdXJ2ZS5nZXRQb2ludCgwLjg1KS56LCB5OiB0aGlzLmNvbmZpZy50dWJlUmFkaXVzICogMi8zLCB4OiAwIH0sIDAuNzUpXG4gICAgICB0aGlzLmFkZEV5ZSh7IHo6IHRoaXMudHViZUN1cnZlLmdldFBvaW50KDAuODUpLnosIHk6IC10aGlzLmNvbmZpZy50dWJlUmFkaXVzICogMi8zLCB4OiAwIH0sIDAuNzUpXG4gICAgfVxuXG4gICAgYWRkRXllKHBvc2l0aW9uLCBzY2FsZSkge1xuICAgICAgY29uc3Qgc3BoZXJlR2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSh0aGlzLmNvbmZpZy50dWJlUmFkaXVzLCB0aGlzLmNvbmZpZy50dWJlU2VnbWVudHMsIHRoaXMuY29uZmlnLnR1YmVTZWdtZW50cyk7XG4gICAgICBjb25zdCBjb2xtYXQgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiB0aGlzLmNvbmZpZy5leWVDb2xvciB9KTtcbiAgICAgIGNvbnN0IGV5ZSA9IFRIUkVFLlNjZW5lVXRpbHMuY3JlYXRlTXVsdGlNYXRlcmlhbE9iamVjdChzcGhlcmVHZW9tLCBbY29sbWF0XSk7XG4gICAgICBmb3IgKGxldCBrZXkgb2YgWyd4JywgJ3knLCAneiddKSB7XG4gICAgICAgIGV5ZS5zY2FsZVtrZXldID0gc2NhbGU7XG4gICAgICAgIGV5ZS5wb3NpdGlvbltrZXldID0gcG9zaXRpb25ba2V5XSB8fCAwO1xuICAgICAgfVxuICAgICAgdGhpcy5fYm9keS5hZGQoZXllKTtcbiAgICB9XG4gIH1cbn0pXG5cbi8vIE1PRElGSVkgVEhJUyBGSUxFIFNVQ0ggVEhBVCBUSEUgTE9PS1MgQ0hBTkdFIEFDQ09SRElORyBUTyBUSEUgU0VMRUNURUQgQk9EWSBDT05GSUdVUkFUSU9OLlxuIl19
