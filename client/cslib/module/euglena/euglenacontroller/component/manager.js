'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Controller = require('core/controller/controller'),
      Utils = require('core/util/utils'),
      Model = require('./model'),
      THREE = require('three'),
      Globals = require('core/model/globals');

  var ComponentManager = function (_Controller) {
    _inherits(ComponentManager, _Controller);

    function ComponentManager() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ComponentManager);

      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, (ComponentManager.__proto__ || Object.getPrototypeOf(ComponentManager)).call(this, settings));
    }

    _createClass(ComponentManager, [{
      key: 'initialize',
      value: function initialize(euglena) {
        euglena.controllerState.component = {
          K: this._model.get('K') + (Math.random() * 2 - 1) * this._model.get('K_delta'),
          v: this._model.get('v') + (Math.random() * 2 - 1) * this._model.get('v_delta'),
          omega: this._model.get('omega') + (Math.random() * 2 - 1) * this._model.get('omega_delta')
        };
      }
    }, {
      key: 'update',
      value: function update(state) {
        var out = {
          position: {
            x: state.position.x,
            y: state.position.y,
            z: state.position.z
          },
          dYaw: 0,
          dRoll: 0
        };

        out.dRoll = state.controllerState.component.omega * state.dT;
        var v_eye = state.object.getObjectByName('base').localToWorld(new THREE.Vector3(0, 1, 0)).sub(state.object.localToWorld(new THREE.Vector3(0, 0, 0))).normalize();
        var v_head = state.object.localToWorld(new THREE.Vector3(1, 0, 0)).sub(state.object.localToWorld(new THREE.Vector3(0, 0, 0))).normalize();

        var intensity = 0;
        var net_angle = 0;
        for (var k in state.lights) {
          var v_light = new THREE.Vector3();
          switch (k) {
            case "left":
              v_light.set(-1, 0, 0);
              break;
            case "right":
              v_light.set(1, 0, 0);
              break;
            case "top":
              v_light.set(0, 1, 0);
              break;
            case "bottom":
              v_light.set(0, -1, 0);
              break;
          }
          v_light.normalize();
          var intensity_theta = Math.acos(v_eye.dot(v_light));
          var intensity_light = Math.cos(intensity_theta) * state.lights[k];
          var head_theta = Math.acos(v_head.dot(v_light));
          if (Math.cos(intensity_theta) >= 0 && intensity_light > 0) {
            var parity = Math.sign(v_head.x * v_light.y - v_head.y * v_light.x);
            intensity += intensity_light;
            net_angle += intensity_light * parity;
          }
        }
        intensity *= net_angle > 0 ? 1 : -1;
        out.dYaw = state.controllerState.component.K * intensity + (Math.random() * 2 - 1) * this._model.get('randomness');
        out.position.x = state.position.x + Math.cos(state.yaw + out.dYaw) * state.controllerState.component.v * state.dT;
        out.position.y = state.position.y + Math.sin(state.yaw + out.dYaw) * state.controllerState.component.v * state.dT;

        return out;
      }
    }, {
      key: 'setModelData',
      value: function setModelData(data) {
        for (var k in data) {
          this._model.set(k, data[k]);
        }
      }
    }]);

    return ComponentManager;
  }(Controller);

  return new ComponentManager();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb250cm9sbGVyIiwiVXRpbHMiLCJNb2RlbCIsIlRIUkVFIiwiR2xvYmFscyIsIkNvbXBvbmVudE1hbmFnZXIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJldWdsZW5hIiwiY29udHJvbGxlclN0YXRlIiwiY29tcG9uZW50IiwiSyIsIl9tb2RlbCIsImdldCIsIk1hdGgiLCJyYW5kb20iLCJ2Iiwib21lZ2EiLCJzdGF0ZSIsIm91dCIsInBvc2l0aW9uIiwieCIsInkiLCJ6IiwiZFlhdyIsImRSb2xsIiwiZFQiLCJ2X2V5ZSIsIm9iamVjdCIsImdldE9iamVjdEJ5TmFtZSIsImxvY2FsVG9Xb3JsZCIsIlZlY3RvcjMiLCJzdWIiLCJub3JtYWxpemUiLCJ2X2hlYWQiLCJpbnRlbnNpdHkiLCJuZXRfYW5nbGUiLCJrIiwibGlnaHRzIiwidl9saWdodCIsInNldCIsImludGVuc2l0eV90aGV0YSIsImFjb3MiLCJkb3QiLCJpbnRlbnNpdHlfbGlnaHQiLCJjb3MiLCJoZWFkX3RoZXRhIiwicGFyaXR5Iiwic2lnbiIsInlhdyIsInNpbiIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsYUFBYUQsUUFBUSw0QkFBUixDQUFuQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsU0FBUixDQUZWO0FBQUEsTUFHRUksUUFBUUosUUFBUSxPQUFSLENBSFY7QUFBQSxNQUlFSyxVQUFVTCxRQUFRLG9CQUFSLENBSlo7O0FBRGtCLE1BUVpNLGdCQVJZO0FBQUE7O0FBU2hCLGdDQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNB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UUFBTixDQUFlRSxDQUFmLEdBQW1CUixLQUFLb0MsR0FBTCxDQUFTaEMsTUFBTStCLEdBQU4sR0FBWTlCLElBQUlLLElBQXpCLElBQWlDTixNQUFNVCxlQUFOLENBQXNCQyxTQUF0QixDQUFnQ00sQ0FBakUsR0FBcUVFLE1BQU1RLEVBQS9HOztBQUVBLGVBQU9QLEdBQVA7QUFDRDtBQTNFZTtBQUFBO0FBQUEsbUNBNkVIZ0MsSUE3RUcsRUE2RUc7QUFDakIsYUFBSyxJQUFJZCxDQUFULElBQWNjLElBQWQsRUFBb0I7QUFDbEIsZUFBS3ZDLE1BQUwsQ0FBWTRCLEdBQVosQ0FBZ0JILENBQWhCLEVBQW1CYyxLQUFLZCxDQUFMLENBQW5CO0FBQ0Q7QUFDRjtBQWpGZTs7QUFBQTtBQUFBLElBUWFyQyxVQVJiOztBQW9GbEIsU0FBTyxJQUFJSyxnQkFBSixFQUFQO0FBQ0QsQ0FyRkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXVnbGVuYWNvbnRyb2xsZXIvY29tcG9uZW50L21hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29udHJvbGxlciA9IHJlcXVpcmUoJ2NvcmUvY29udHJvbGxlci9jb250cm9sbGVyJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBUSFJFRSA9IHJlcXVpcmUoJ3RocmVlJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpXG4gIDtcblxuICBjbGFzcyBDb21wb25lbnRNYW5hZ2VyIGV4dGVuZHMgQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShldWdsZW5hKSB7XG4gICAgICBldWdsZW5hLmNvbnRyb2xsZXJTdGF0ZS5jb21wb25lbnQgPSB7XG4gICAgICAgIEs6IHRoaXMuX21vZGVsLmdldCgnSycpICsgKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiB0aGlzLl9tb2RlbC5nZXQoJ0tfZGVsdGEnKSxcbiAgICAgICAgdjogdGhpcy5fbW9kZWwuZ2V0KCd2JykgKyAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIHRoaXMuX21vZGVsLmdldCgndl9kZWx0YScpLFxuICAgICAgICBvbWVnYTogdGhpcy5fbW9kZWwuZ2V0KCdvbWVnYScpICsgKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiB0aGlzLl9tb2RlbC5nZXQoJ29tZWdhX2RlbHRhJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGUoc3RhdGUpIHtcbiAgICAgIGxldCBvdXQgPSB7XG4gICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgeDogc3RhdGUucG9zaXRpb24ueCxcbiAgICAgICAgICB5OiBzdGF0ZS5wb3NpdGlvbi55LFxuICAgICAgICAgIHo6IHN0YXRlLnBvc2l0aW9uLnpcbiAgICAgICAgfSxcbiAgICAgICAgZFlhdzogMCxcbiAgICAgICAgZFJvbGw6IDBcbiAgICAgIH07XG5cbiAgICAgIG91dC5kUm9sbCA9IHN0YXRlLmNvbnRyb2xsZXJTdGF0ZS5jb21wb25lbnQub21lZ2EgKiBzdGF0ZS5kVDtcbiAgICAgIGxldCB2X2V5ZSA9IHN0YXRlLm9iamVjdC5nZXRPYmplY3RCeU5hbWUoJ2Jhc2UnKS5sb2NhbFRvV29ybGQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMSwgMCkpXG4gICAgICAgIC5zdWIoc3RhdGUub2JqZWN0LmxvY2FsVG9Xb3JsZChuZXcgVEhSRUUuVmVjdG9yMygwLDAsMCkpKVxuICAgICAgICAubm9ybWFsaXplKCk7XG4gICAgICBsZXQgdl9oZWFkID0gc3RhdGUub2JqZWN0LmxvY2FsVG9Xb3JsZChuZXcgVEhSRUUuVmVjdG9yMygxLCAwLCAwKSlcbiAgICAgICAgLnN1YihzdGF0ZS5vYmplY3QubG9jYWxUb1dvcmxkKG5ldyBUSFJFRS5WZWN0b3IzKDAsMCwwKSkpXG4gICAgICAgIC5ub3JtYWxpemUoKTtcblxuICAgICAgbGV0IGludGVuc2l0eSA9IDA7XG4gICAgICBsZXQgbmV0X2FuZ2xlID0gMDtcbiAgICAgIGZvciAobGV0IGsgaW4gc3RhdGUubGlnaHRzKSB7XG4gICAgICAgIGxldCB2X2xpZ2h0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICAgICAgc3dpdGNoIChrKSB7XG4gICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgIHZfbGlnaHQuc2V0KC0xLCAwLCAwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgdl9saWdodC5zZXQoMSwgMCwgMCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwidG9wXCI6XG4gICAgICAgICAgICB2X2xpZ2h0LnNldCgwLCAxLCAwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJib3R0b21cIjpcbiAgICAgICAgICAgIHZfbGlnaHQuc2V0KDAsIC0xLCAwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHZfbGlnaHQubm9ybWFsaXplKCk7XG4gICAgICAgIGxldCBpbnRlbnNpdHlfdGhldGEgPSBNYXRoLmFjb3Modl9leWUuZG90KHZfbGlnaHQpKTtcbiAgICAgICAgbGV0IGludGVuc2l0eV9saWdodCA9IE1hdGguY29zKGludGVuc2l0eV90aGV0YSkgKiBzdGF0ZS5saWdodHNba107XG4gICAgICAgIGxldCBoZWFkX3RoZXRhID0gTWF0aC5hY29zKHZfaGVhZC5kb3Qodl9saWdodCkpO1xuICAgICAgICBpZiAoTWF0aC5jb3MoaW50ZW5zaXR5X3RoZXRhKSA+PSAwICYmIGludGVuc2l0eV9saWdodCA+IDApIHtcbiAgICAgICAgICBsZXQgcGFyaXR5ID0gTWF0aC5zaWduKHZfaGVhZC54ICogdl9saWdodC55IC0gdl9oZWFkLnkgKiB2X2xpZ2h0LngpO1xuICAgICAgICAgIGludGVuc2l0eSArPSBpbnRlbnNpdHlfbGlnaHQ7XG4gICAgICAgICAgbmV0X2FuZ2xlICs9IGludGVuc2l0eV9saWdodCAqIHBhcml0eTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaW50ZW5zaXR5ICo9IG5ldF9hbmdsZSA+IDAgPyAxIDogLTE7XG4gICAgICBvdXQuZFlhdyA9IHN0YXRlLmNvbnRyb2xsZXJTdGF0ZS5jb21wb25lbnQuSyAqIGludGVuc2l0eSArIChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogdGhpcy5fbW9kZWwuZ2V0KCdyYW5kb21uZXNzJyk7XG4gICAgICBvdXQucG9zaXRpb24ueCA9IHN0YXRlLnBvc2l0aW9uLnggKyBNYXRoLmNvcyhzdGF0ZS55YXcgKyBvdXQuZFlhdykgKiBzdGF0ZS5jb250cm9sbGVyU3RhdGUuY29tcG9uZW50LnYgKiBzdGF0ZS5kVDtcbiAgICAgIG91dC5wb3NpdGlvbi55ID0gc3RhdGUucG9zaXRpb24ueSArIE1hdGguc2luKHN0YXRlLnlhdyArIG91dC5kWWF3KSAqIHN0YXRlLmNvbnRyb2xsZXJTdGF0ZS5jb21wb25lbnQudiAqIHN0YXRlLmRUO1xuXG4gICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIHNldE1vZGVsRGF0YShkYXRhKSB7XG4gICAgICBmb3IgKGxldCBrIGluIGRhdGEpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwuc2V0KGssIGRhdGFba10pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgQ29tcG9uZW50TWFuYWdlcigpO1xufSkiXX0=
