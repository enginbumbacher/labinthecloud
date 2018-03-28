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
    _inherits(OneEyeView, _EuglenaThreeView);

    function OneEyeView(config) {
      _classCallCheck(this, OneEyeView);

      var _this = _possibleConstructorReturn(this, (OneEyeView.__proto__ || Object.getPrototypeOf(OneEyeView)).call(this, config));

      _this.config = Utils.ensureDefaults(_this.config, defaults);
      _this.addEye({ z: _this.tubeCurve.getPoint(0.85).z, y: _this.config.tubeRadius * 2 / 3, x: 0 }, 0.75);
      _this.addEye({ z: _this.tubeCurve.getPoint(0.85).z, y: -_this.config.tubeRadius * 2 / 3, x: 0 }, 0.75);
      return _this;
    }

    _createClass(OneEyeView, [{
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

    return OneEyeView;
  }(EuglenaThreeView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX3R3b2V5ZS90aHJlZXZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV1Z2xlbmFUaHJlZVZpZXciLCJUSFJFRSIsIlV0aWxzIiwiZGVmYXVsdHMiLCJleWVDb2xvciIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwiYWRkRXllIiwieiIsInR1YmVDdXJ2ZSIsImdldFBvaW50IiwieSIsInR1YmVSYWRpdXMiLCJ4IiwicG9zaXRpb24iLCJzY2FsZSIsInNwaGVyZUdlb20iLCJTcGhlcmVHZW9tZXRyeSIsInR1YmVTZWdtZW50cyIsImNvbG1hdCIsIk1lc2hMYW1iZXJ0TWF0ZXJpYWwiLCJjb2xvciIsImV5ZSIsIlNjZW5lVXRpbHMiLCJjcmVhdGVNdWx0aU1hdGVyaWFsT2JqZWN0Iiwia2V5IiwiX2JvZHkiLCJhZGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsbUJBQW1CRCxRQUFRLHlCQUFSLENBQXpCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxPQUFSLENBRFY7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxXQUFXO0FBQ1RDLGNBQVU7QUFERCxHQUhiOztBQU9BO0FBQUE7O0FBQ0Usd0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFBQSwwSEFDWkEsTUFEWTs7QUFFbEIsWUFBS0EsTUFBTCxHQUFjSCxNQUFNSSxjQUFOLENBQXFCLE1BQUtELE1BQTFCLEVBQWtDRixRQUFsQyxDQUFkO0FBQ0EsWUFBS0ksTUFBTCxDQUFZLEVBQUVDLEdBQUcsTUFBS0MsU0FBTCxDQUFlQyxRQUFmLENBQXdCLElBQXhCLEVBQThCRixDQUFuQyxFQUFzQ0csR0FBRyxNQUFLTixNQUFMLENBQVlPLFVBQVosR0FBeUIsQ0FBekIsR0FBMkIsQ0FBcEUsRUFBdUVDLEdBQUcsQ0FBMUUsRUFBWixFQUEyRixJQUEzRjtBQUNBLFlBQUtOLE1BQUwsQ0FBWSxFQUFFQyxHQUFHLE1BQUtDLFNBQUwsQ0FBZUMsUUFBZixDQUF3QixJQUF4QixFQUE4QkYsQ0FBbkMsRUFBc0NHLEdBQUcsQ0FBQyxNQUFLTixNQUFMLENBQVlPLFVBQWIsR0FBMEIsQ0FBMUIsR0FBNEIsQ0FBckUsRUFBd0VDLEdBQUcsQ0FBM0UsRUFBWixFQUE0RixJQUE1RjtBQUprQjtBQUtuQjs7QUFOSDtBQUFBO0FBQUEsNkJBUVNDLFFBUlQsRUFRbUJDLEtBUm5CLEVBUTBCO0FBQ3RCLFlBQU1DLGFBQWEsSUFBSWYsTUFBTWdCLGNBQVYsQ0FBeUIsS0FBS1osTUFBTCxDQUFZTyxVQUFyQyxFQUFpRCxLQUFLUCxNQUFMLENBQVlhLFlBQTdELEVBQTJFLEtBQUtiLE1BQUwsQ0FBWWEsWUFBdkYsQ0FBbkI7QUFDQSxZQUFNQyxTQUFTLElBQUlsQixNQUFNbUIsbUJBQVYsQ0FBOEIsRUFBRUMsT0FBTyxLQUFLaEIsTUFBTCxDQUFZRCxRQUFyQixFQUE5QixDQUFmO0FBQ0EsWUFBTWtCLE1BQU1yQixNQUFNc0IsVUFBTixDQUFpQkMseUJBQWpCLENBQTJDUixVQUEzQyxFQUF1RCxDQUFDRyxNQUFELENBQXZELENBQVo7QUFIc0IsbUJBSU4sQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FKTTtBQUl0QixpREFBaUM7QUFBNUIsY0FBSU0sY0FBSjtBQUNISCxjQUFJUCxLQUFKLENBQVVVLEdBQVYsSUFBaUJWLEtBQWpCO0FBQ0FPLGNBQUlSLFFBQUosQ0FBYVcsR0FBYixJQUFvQlgsU0FBU1csR0FBVCxLQUFpQixDQUFyQztBQUNEO0FBQ0QsYUFBS0MsS0FBTCxDQUFXQyxHQUFYLENBQWVMLEdBQWY7QUFDRDtBQWpCSDs7QUFBQTtBQUFBLElBQWdDdEIsZ0JBQWhDO0FBbUJELENBM0JEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX3R3b2V5ZS90aHJlZXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRXVnbGVuYVRocmVlVmlldyA9IHJlcXVpcmUoJ2V1Z2xlbmEvbW9kZWwvdGhyZWV2aWV3JyksXG4gICAgVEhSRUUgPSByZXF1aXJlKCd0aHJlZScpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBleWVDb2xvcjogMHhmZmZmZmZcbiAgICB9XG5cbiAgcmV0dXJuIGNsYXNzIE9uZUV5ZVZpZXcgZXh0ZW5kcyBFdWdsZW5hVGhyZWVWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIHN1cGVyKGNvbmZpZylcbiAgICAgIHRoaXMuY29uZmlnID0gVXRpbHMuZW5zdXJlRGVmYXVsdHModGhpcy5jb25maWcsIGRlZmF1bHRzKTtcbiAgICAgIHRoaXMuYWRkRXllKHsgejogdGhpcy50dWJlQ3VydmUuZ2V0UG9pbnQoMC44NSkueiwgeTogdGhpcy5jb25maWcudHViZVJhZGl1cyAqIDIvMywgeDogMCB9LCAwLjc1KVxuICAgICAgdGhpcy5hZGRFeWUoeyB6OiB0aGlzLnR1YmVDdXJ2ZS5nZXRQb2ludCgwLjg1KS56LCB5OiAtdGhpcy5jb25maWcudHViZVJhZGl1cyAqIDIvMywgeDogMCB9LCAwLjc1KVxuICAgIH1cblxuICAgIGFkZEV5ZShwb3NpdGlvbiwgc2NhbGUpIHtcbiAgICAgIGNvbnN0IHNwaGVyZUdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkodGhpcy5jb25maWcudHViZVJhZGl1cywgdGhpcy5jb25maWcudHViZVNlZ21lbnRzLCB0aGlzLmNvbmZpZy50dWJlU2VnbWVudHMpO1xuICAgICAgY29uc3QgY29sbWF0ID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogdGhpcy5jb25maWcuZXllQ29sb3IgfSk7XG4gICAgICBjb25zdCBleWUgPSBUSFJFRS5TY2VuZVV0aWxzLmNyZWF0ZU11bHRpTWF0ZXJpYWxPYmplY3Qoc3BoZXJlR2VvbSwgW2NvbG1hdF0pO1xuICAgICAgZm9yIChsZXQga2V5IG9mIFsneCcsICd5JywgJ3onXSkge1xuICAgICAgICBleWUuc2NhbGVba2V5XSA9IHNjYWxlO1xuICAgICAgICBleWUucG9zaXRpb25ba2V5XSA9IHBvc2l0aW9uW2tleV0gfHwgMDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2JvZHkuYWRkKGV5ZSk7XG4gICAgfVxuICB9XG59KVxuIl19
