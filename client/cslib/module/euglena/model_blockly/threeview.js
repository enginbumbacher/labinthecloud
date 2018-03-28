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
      if (config.addEye == 'both') {
        _this.addEye({ z: _this.tubeCurve.getPoint(0.85).z, y: _this.config.tubeRadius * 2 / 3, x: 0 }, 0.75, 'right');
        _this.addEye({ z: _this.tubeCurve.getPoint(0.85).z, y: -_this.config.tubeRadius * 2 / 3, x: 0 }, 0.75, 'left');
      } else if (config.addEye == 'left') {
        _this.addEye({ z: _this.tubeCurve.getPoint(0.85).z, y: -_this.config.tubeRadius * 2 / 3, x: 0 }, 0.75, 'left');
      } else {
        _this.addEye({ z: _this.tubeCurve.getPoint(0.85).z, y: _this.config.tubeRadius * 2 / 3, x: 0 }, 0.75, 'right');
      }
      return _this;
    }

    _createClass(ModelView, [{
      key: 'addEye',
      value: function addEye(position, scale, name) {
        var sphereGeom = new THREE.SphereGeometry(this.config.tubeRadius, this.config.tubeSegments, this.config.tubeSegments);
        var colmat = new THREE.MeshLambertMaterial({ color: this.config.eyeColor });
        var eye = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [colmat]);
        var _arr = ['x', 'y', 'z'];
        for (var _i = 0; _i < _arr.length; _i++) {
          var key = _arr[_i];
          eye.scale[key] = scale;
          eye.position[key] = position[key] || 0;
        }
        eye.name = name;
        this._body.add(eye);
      }
    }, {
      key: 'addLeftEye',
      value: function addLeftEye() {
        this.addEye({ z: this.tubeCurve.getPoint(0.85).z, y: -this.config.tubeRadius * 2 / 3, x: 0 }, 0.75, 'left');
      }
    }, {
      key: 'addRightEye',
      value: function addRightEye() {
        this.addEye({ z: this.tubeCurve.getPoint(0.85).z, y: this.config.tubeRadius * 2 / 3, x: 0 }, 0.75, 'right');
      }
    }]);

    return ModelView;
  }(EuglenaThreeView);
});

// MODIFIY THIS FILE SUCH THAT THE LOOKS CHANGE ACCORDING TO THE SELECTED BODY CONFIGURATION.
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvdGhyZWV2aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJFdWdsZW5hVGhyZWVWaWV3IiwiVEhSRUUiLCJVdGlscyIsImRlZmF1bHRzIiwiZXllQ29sb3IiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImFkZEV5ZSIsInoiLCJ0dWJlQ3VydmUiLCJnZXRQb2ludCIsInkiLCJ0dWJlUmFkaXVzIiwieCIsInBvc2l0aW9uIiwic2NhbGUiLCJuYW1lIiwic3BoZXJlR2VvbSIsIlNwaGVyZUdlb21ldHJ5IiwidHViZVNlZ21lbnRzIiwiY29sbWF0IiwiTWVzaExhbWJlcnRNYXRlcmlhbCIsImNvbG9yIiwiZXllIiwiU2NlbmVVdGlscyIsImNyZWF0ZU11bHRpTWF0ZXJpYWxPYmplY3QiLCJrZXkiLCJfYm9keSIsImFkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxtQkFBbUJELFFBQVEseUJBQVIsQ0FBekI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLE9BQVIsQ0FEVjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjtBQUFBLE1BR0VJLFdBQVc7QUFDVEMsY0FBVTtBQURELEdBSGI7O0FBT0E7QUFBQTs7QUFDRSx1QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUFBLHdIQUNaQSxNQURZOztBQUVsQixZQUFLQSxNQUFMLEdBQWNILE1BQU1JLGNBQU4sQ0FBcUIsTUFBS0QsTUFBMUIsRUFBa0NGLFFBQWxDLENBQWQ7QUFDQSxVQUFJRSxPQUFPRSxNQUFQLElBQWlCLE1BQXJCLEVBQTZCO0FBQzNCLGNBQUtBLE1BQUwsQ0FBWSxFQUFFQyxHQUFHLE1BQUtDLFNBQUwsQ0FBZUMsUUFBZixDQUF3QixJQUF4QixFQUE4QkYsQ0FBbkMsRUFBc0NHLEdBQUcsTUFBS04sTUFBTCxDQUFZTyxVQUFaLEdBQXlCLENBQXpCLEdB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ZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvdGhyZWV2aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEV1Z2xlbmFUaHJlZVZpZXcgPSByZXF1aXJlKCdldWdsZW5hL21vZGVsL3RocmVldmlldycpLFxuICAgIFRIUkVFID0gcmVxdWlyZSgndGhyZWUnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgZXllQ29sb3I6IDB4ZmZmZmZmXG4gICAgfVxuXG4gIHJldHVybiBjbGFzcyBNb2RlbFZpZXcgZXh0ZW5kcyBFdWdsZW5hVGhyZWVWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIHN1cGVyKGNvbmZpZylcbiAgICAgIHRoaXMuY29uZmlnID0gVXRpbHMuZW5zdXJlRGVmYXVsdHModGhpcy5jb25maWcsIGRlZmF1bHRzKTtcbiAgICAgIGlmIChjb25maWcuYWRkRXllID09ICdib3RoJykge1xuICAgICAgICB0aGlzLmFkZEV5ZSh7IHo6IHRoaXMudHViZUN1cnZlLmdldFBvaW50KDAuODUpLnosIHk6IHRoaXMuY29uZmlnLnR1YmVSYWRpdXMgKiAyLzMsIHg6IDAgfSwgMC43NSwncmlnaHQnKVxuICAgICAgICB0aGlzLmFkZEV5ZSh7IHo6IHRoaXMudHViZUN1cnZlLmdldFBvaW50KDAuODUpLnosIHk6IC10aGlzLmNvbmZpZy50dWJlUmFkaXVzICogMi8zLCB4OiAwIH0sIDAuNzUsICdsZWZ0JylcbiAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmFkZEV5ZSA9PSAnbGVmdCcpIHtcbiAgICAgICAgdGhpcy5hZGRFeWUoeyB6OiB0aGlzLnR1YmVDdXJ2ZS5nZXRQb2ludCgwLjg1KS56LCB5OiAtdGhpcy5jb25maWcudHViZVJhZGl1cyAqIDIvMywgeDogMCB9LCAwLjc1LCAnbGVmdCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFkZEV5ZSh7IHo6IHRoaXMudHViZUN1cnZlLmdldFBvaW50KDAuODUpLnosIHk6IHRoaXMuY29uZmlnLnR1YmVSYWRpdXMgKiAyLzMsIHg6IDAgfSwgMC43NSwncmlnaHQnKVxuICAgICAgfVxuICAgIH1cblxuICAgIGFkZEV5ZShwb3NpdGlvbiwgc2NhbGUsIG5hbWUpIHtcbiAgICAgIGNvbnN0IHNwaGVyZUdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkodGhpcy5jb25maWcudHViZVJhZGl1cywgdGhpcy5jb25maWcudHViZVNlZ21lbnRzLCB0aGlzLmNvbmZpZy50dWJlU2VnbWVudHMpO1xuICAgICAgY29uc3QgY29sbWF0ID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogdGhpcy5jb25maWcuZXllQ29sb3IgfSk7XG4gICAgICBjb25zdCBleWUgPSBUSFJFRS5TY2VuZVV0aWxzLmNyZWF0ZU11bHRpTWF0ZXJpYWxPYmplY3Qoc3BoZXJlR2VvbSwgW2NvbG1hdF0pO1xuICAgICAgZm9yIChsZXQga2V5IG9mIFsneCcsICd5JywgJ3onXSkge1xuICAgICAgICBleWUuc2NhbGVba2V5XSA9IHNjYWxlO1xuICAgICAgICBleWUucG9zaXRpb25ba2V5XSA9IHBvc2l0aW9uW2tleV0gfHwgMDtcbiAgICAgIH1cbiAgICAgIGV5ZS5uYW1lID0gbmFtZTtcbiAgICAgIHRoaXMuX2JvZHkuYWRkKGV5ZSk7XG4gICAgfVxuXG4gICAgYWRkTGVmdEV5ZSgpIHtcbiAgICAgIHRoaXMuYWRkRXllKHsgejogdGhpcy50dWJlQ3VydmUuZ2V0UG9pbnQoMC44NSkueiwgeTogLXRoaXMuY29uZmlnLnR1YmVSYWRpdXMgKiAyLzMsIHg6IDAgfSwgMC43NSwgJ2xlZnQnKVxuICAgIH1cblxuICAgIGFkZFJpZ2h0RXllKCkge1xuICAgICAgdGhpcy5hZGRFeWUoeyB6OiB0aGlzLnR1YmVDdXJ2ZS5nZXRQb2ludCgwLjg1KS56LCB5OiB0aGlzLmNvbmZpZy50dWJlUmFkaXVzICogMi8zLCB4OiAwIH0sIDAuNzUsICdyaWdodCcpXG4gICAgfVxuICB9XG59KVxuXG4vLyBNT0RJRklZIFRISVMgRklMRSBTVUNIIFRIQVQgVEhFIExPT0tTIENIQU5HRSBBQ0NPUkRJTkcgVE8gVEhFIFNFTEVDVEVEIEJPRFkgQ09ORklHVVJBVElPTi5cbiJdfQ==
