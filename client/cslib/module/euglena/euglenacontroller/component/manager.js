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
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, ComponentManager);

      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentManager).call(this, settings));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sYUFBYSxRQUFRLDRCQUFSLENBQW5CO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsUUFBUSxRQUFRLFNBQVIsQ0FGVjtBQUFBLE1BR0UsUUFBUSxRQUFRLE9BQVIsQ0FIVjtBQUFBLE1BSUUsVUFBVSxRQUFRLG9CQUFSLENBSlo7O0FBRGtCLE1BUVosZ0JBUlk7QUFBQTs7QUFTaEIsZ0NBQTJCO0FBQUEsVUFBZixRQUFlLHlEQUFKLEVBQUk7O0FBQUE7O0FBQ3pCLGVBQVMsVUFBVCxHQUFzQixTQUFTLFVBQVQsSUFBdUIsS0FBN0M7QUFEeUIsaUdBRW5CLFFBRm1CO0FBRzFCOztBQVplO0FBQUE7QUFBQSxpQ0FjTCxPQWRLLEVBY0k7QUFDbEIsZ0JBQVEsZUFBUixDQUF3QixTQUF4QixHQUFvQztBQUNsQyxhQUFHLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsR0FBaEIsSUFBdUIsQ0FBQyxLQUFLLE1BQUwsS0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBckIsSUFBMEIsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixTQUFoQixDQURsQjtBQUVsQyxhQUFHLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsR0FBaEIsSUFBdUIsQ0FBQyxLQUFLLE1BQUwsS0FBZ0IsQ0FBaEIsR0FBb0IsQ0FBckIsSUFBMEIsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixTQUFoQixDQUZsQjtBQUdsQyxpQkFBTyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE9BQWhCLElBQTJCLENBQUMsS0FBSyxNQUFMLEtBQWdCLENBQWhCLEdBQW9CLENBQXJCLElBQTBCLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsYUFBaEI7QUFIMUIsU0FB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LENBQWEsQ0FBYixHQUFpQixNQUFNLFFBQU4sQ0FBZSxDQUFmLEdBQW1CLEtBQUssR0FBTCxDQUFTLE1BQU0sR0FBTixHQUFZLElBQUksSUFBekIsSUFBaUMsTUFBTSxlQUFOLENBQXNCLFNBQXRCLENBQWdDLENBQWpFLEdBQXFFLE1BQU0sRUFBL0c7QUFDQSxZQUFJLFFBQUosQ0FBYSxDQUFiLEdBQWlCLE1BQU0sUUFBTixDQUFlLENBQWYsR0FBbUIsS0FBSyxHQUFMLENBQVMsTUFBTSxHQUFOLEdBQVksSUFBSSxJQUF6QixJQUFpQyxNQUFNLGVBQU4sQ0FBc0IsU0FBdEIsQ0FBZ0MsQ0FBakUsR0FBcUUsTUFBTSxFQUEvRzs7QUFFQSxlQUFPLEdBQVA7QUFDRDtBQTNFZTtBQUFBO0FBQUEsbUNBNkVILElBN0VHLEVBNkVHO0FBQ2pCLGFBQUssSUFBSSxDQUFULElBQWMsSUFBZCxFQUFvQjtBQUNsQixlQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLENBQWhCLEVBQW1CLEtBQUssQ0FBTCxDQUFuQjtBQUNEO0FBQ0Y7QUFqRmU7O0FBQUE7QUFBQSxJQVFhLFVBUmI7O0FBb0ZsQixTQUFPLElBQUksZ0JBQUosRUFBUDtBQUNELENBckZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
