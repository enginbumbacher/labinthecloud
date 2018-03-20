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
      //this.addEye({ z: this.tubeCurve.getPoint(0.85).z, y: this.config.tubeRadius * 2/3, x: 0 }, 0.75)
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvdGhyZWV2aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJFdWdsZW5hVGhyZWVWaWV3IiwiVEhSRUUiLCJVdGlscyIsImRlZmF1bHRzIiwiZXllQ29sb3IiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImFkZEV5ZSIsInoiLCJ0dWJlQ3VydmUiLCJnZXRQb2ludCIsInkiLCJ0dWJlUmFkaXVzIiwieCIsInBvc2l0aW9uIiwic2NhbGUiLCJzcGhlcmVHZW9tIiwiU3BoZXJlR2VvbWV0cnkiLCJ0dWJlU2VnbWVudHMiLCJjb2xtYXQiLCJNZXNoTGFtYmVydE1hdGVyaWFsIiwiY29sb3IiLCJleWUiLCJTY2VuZVV0aWxzIiwiY3JlYXRlTXVsdGlNYXRlcmlhbE9iamVjdCIsImtleSIsIl9ib2R5IiwiYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLG1CQUFtQkQsUUFBUSx5QkFBUixDQUF6QjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsT0FBUixDQURWO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksV0FBVztBQUNUQyxjQUFVO0FBREQsR0FIYjs7QUFPQTtBQUFBOztBQUNFLHVCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQUEsd0hBQ1pBLE1BRFk7O0FBRWxCLFlBQUtBLE1BQUwsR0FBY0gsTUFBTUksY0FBTixDQUFxQixNQUFLRCxNQUExQixFQUFrQ0YsUUFBbEMsQ0FBZDtBQUNBO0FBQ0EsWUFBS0ksTUFBTCxDQUFZLEVBQUVDLEdBQUcsTUFBS0MsU0FBTCxDQUFlQyxRQUFmLENBQXdCLElBQXhCLEVBQThCRixDQUFuQyxFQUFzQ0csR0FBRyxDQUFDLE1BQUtOLE1BQUwsQ0FBWU8sVUFBYixHQUEwQixDQUExQixHQUE0QixDQUFyRSxFQUF3RUMsR0FBRyxDQUEzRSxFQUFaLEVBQTRGLElBQTVGO0FBSmtCO0FBS25COztBQU5IO0FBQUE7QUFBQSw2QkFRU0MsUUFSVCxFQVFtQkMsS0FSbkIsRUFRMEI7QUFDdEIsWUFBTUMsYUFBYSxJQUFJZixNQUFNZ0IsY0FBVixDQUF5QixLQUFLWixNQUFMLENBQVlPLFVBQXJDLEVBQWlELEtBQUtQLE1BQUwsQ0FBWWEsWUFBN0QsRUFBMkUsS0FBS2IsTUFBTCxDQUFZYSxZQUF2RixDQUFuQjtBQUNBLFlBQU1DLFNBQVMsSUFBSWxCLE1BQU1tQixtQkFBVixDQUE4QixFQUFFQyxPQUFPLEtBQUtoQixNQUFMLENBQVlELFFBQXJCLEVBQTlCLENBQWY7QUFDQSxZQUFNa0IsTUFBTXJCLE1BQU1zQixVQUFOLENBQWlCQyx5QkFBakIsQ0FBMkNSLFVBQTNDLEVBQXVELENBQUNHLE1BQUQsQ0FBdkQsQ0FBWjtBQUhzQixtQkFJTixDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUpNO0FBSXRCLGlEQUFpQztBQUE1QixjQUFJTSxjQUFKO0FBQ0hILGNBQUlQLEtBQUosQ0FBVVUsR0FBVixJQUFpQlYsS0FBakI7QUFDQU8sY0FBSVIsUUFBSixDQUFhVyxHQUFiLElBQW9CWCxTQUFTVyxHQUFULEtBQWlCLENBQXJDO0FBQ0Q7QUFDRCxhQUFLQyxLQUFMLENBQVdDLEdBQVgsQ0FBZUwsR0FBZjtBQUNEO0FBakJIOztBQUFBO0FBQUEsSUFBK0J0QixnQkFBL0I7QUFtQkQsQ0EzQkQ7O0FBNkJBIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvdGhyZWV2aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEV1Z2xlbmFUaHJlZVZpZXcgPSByZXF1aXJlKCdldWdsZW5hL21vZGVsL3RocmVldmlldycpLFxuICAgIFRIUkVFID0gcmVxdWlyZSgndGhyZWUnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgZXllQ29sb3I6IDB4ZmZmZmZmXG4gICAgfVxuXG4gIHJldHVybiBjbGFzcyBNb2RlbFZpZXcgZXh0ZW5kcyBFdWdsZW5hVGhyZWVWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIHN1cGVyKGNvbmZpZylcbiAgICAgIHRoaXMuY29uZmlnID0gVXRpbHMuZW5zdXJlRGVmYXVsdHModGhpcy5jb25maWcsIGRlZmF1bHRzKTtcbiAgICAgIC8vdGhpcy5hZGRFeWUoeyB6OiB0aGlzLnR1YmVDdXJ2ZS5nZXRQb2ludCgwLjg1KS56LCB5OiB0aGlzLmNvbmZpZy50dWJlUmFkaXVzICogMi8zLCB4OiAwIH0sIDAuNzUpXG4gICAgICB0aGlzLmFkZEV5ZSh7IHo6IHRoaXMudHViZUN1cnZlLmdldFBvaW50KDAuODUpLnosIHk6IC10aGlzLmNvbmZpZy50dWJlUmFkaXVzICogMi8zLCB4OiAwIH0sIDAuNzUpXG4gICAgfVxuXG4gICAgYWRkRXllKHBvc2l0aW9uLCBzY2FsZSkge1xuICAgICAgY29uc3Qgc3BoZXJlR2VvbSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSh0aGlzLmNvbmZpZy50dWJlUmFkaXVzLCB0aGlzLmNvbmZpZy50dWJlU2VnbWVudHMsIHRoaXMuY29uZmlnLnR1YmVTZWdtZW50cyk7XG4gICAgICBjb25zdCBjb2xtYXQgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IGNvbG9yOiB0aGlzLmNvbmZpZy5leWVDb2xvciB9KTtcbiAgICAgIGNvbnN0IGV5ZSA9IFRIUkVFLlNjZW5lVXRpbHMuY3JlYXRlTXVsdGlNYXRlcmlhbE9iamVjdChzcGhlcmVHZW9tLCBbY29sbWF0XSk7XG4gICAgICBmb3IgKGxldCBrZXkgb2YgWyd4JywgJ3knLCAneiddKSB7XG4gICAgICAgIGV5ZS5zY2FsZVtrZXldID0gc2NhbGU7XG4gICAgICAgIGV5ZS5wb3NpdGlvbltrZXldID0gcG9zaXRpb25ba2V5XSB8fCAwO1xuICAgICAgfVxuICAgICAgdGhpcy5fYm9keS5hZGQoZXllKTtcbiAgICB9XG4gIH1cbn0pXG5cbi8vIE1PRElGSVkgVEhJUyBGSUxFIFNVQ0ggVEhBVCBUSEUgTE9PS1MgQ0hBTkdFIEFDQ09SRElORyBUTyBUSEUgU0VMRUNURUQgQk9EWSBDT05GSUdVUkFUSU9OLlxuIl19
