'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Utils = require('core/util/utils'),
      THREE = require('three'),
      HM = require('core/event/hook_manager'),
      defaults = {
    tubeRadius: 3,
    tubeLength: 15,

    baseColor: 0x2222ff,
    eyeColor: 0xffffff,

    shape: "straight",

    tubeArcLength: Math.PI / 4,
    tubeArcRadius: 20,
    tubeSegments: 12
  };

  var base = new THREE.Object3D();
  var TubeCurve = THREE.Curve.create(function (radius, start, end) {
    this.radius = radius || 1;
    this.start = start || 0;
    this.end = end || Math.PI * 2;
  }, function (t) {
    var pt = void 0;
    switch (defaults.shape) {
      case "curve":
        var theta = t * (this.end - this.start) + this.start;
        pt = new THREE.Vector3(Math.cos(theta) * this.radius, Math.sin(theta) * this.radius, 0);
        break;
      case "straight":
        pt = new THREE.Vector3(t * defaults.tubeLength - defaults.tubeLength / 2, 0, 0);
        break;
    }
    return pt;
  });

  var tubeCurve = new TubeCurve(defaults.tubeArcRadius, -defaults.tubeArcLength / 2 + Math.PI / 2, defaults.tubeArcLength / 2 + Math.PI / 2);
  var tubeGeom = new THREE.TubeGeometry(tubeCurve, 10, defaults.tubeRadius, defaults.tubeSegments, false);
  var sphereGeom = new THREE.SphereGeometry(defaults.tubeRadius, defaults.tubeSegments, defaults.tubeSegments);
  var colmat = new THREE.MeshLambertMaterial({ color: defaults.baseColor });
  var wfmat = new THREE.MeshLambertMaterial({ color: defaults.eyeColor });

  var tube = THREE.SceneUtils.createMultiMaterialObject(tubeGeom, [colmat]);
  var leftCap = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [colmat]);
  var rightCap = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [colmat]);
  var eye = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [wfmat]);

  switch (defaults.shape) {
    case "curve":
      leftCap.position.x = tubeCurve.getPoint(0).x;
      leftCap.position.y = tubeCurve.getPoint(0).y - defaults.tubeArcRadius;
      rightCap.position.x = tubeCurve.getPoint(1).x;
      rightCap.position.y = tubeCurve.getPoint(1).y - defaults.tubeArcRadius;
      tube.position.y = tube.position.y - defaults.tubeArcRadius;
      eye.scale.x = 0.5;
      eye.scale.y = 0.5;
      eye.scale.z = 0.5;
      break;
    case "straight":
      leftCap.position.x = tubeCurve.getPoint(0).x;
      leftCap.position.y = tubeCurve.getPoint(0).y;
      rightCap.position.x = tubeCurve.getPoint(1).x;
      rightCap.position.y = tubeCurve.getPoint(1).y;
      eye.position.x = tubeCurve.getPoint(0.85).x;
      eye.scale.x = 0.75;
      eye.scale.y = 0.75;
      eye.scale.z = 0.75;
      break;
  }
  eye.position.y = defaults.tubeRadius * 2 / 3;

  base.add(tube, leftCap, rightCap, eye);
  base.name = "base";
  var euModel = new THREE.Object3D();
  euModel.add(base);

  return function (_EventDispatcher) {
    _inherits(EuglenaView, _EventDispatcher);

    function EuglenaView(model) {
      _classCallCheck(this, EuglenaView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EuglenaView).call(this));

      _this._three = euModel.clone();
      _this._three.getObjectByName('base').rotateX(Math.random() * Math.PI * 2);
      return _this;
    }

    _createClass(EuglenaView, [{
      key: 'threeObject',
      value: function threeObject() {
        return this._three;
      }
    }, {
      key: 'setPosition',
      value: function setPosition(x, y, z) {
        this._three.position.set(x, y, z);
      }
    }, {
      key: 'setRotation',
      value: function setRotation(theta) {
        this._three.rotateZ(theta);
      }
    }, {
      key: 'update',
      value: function update(lights, dT, model, controllerState) {
        var euglenaManager = HM.invoke('Euglena.Manager', {
          manager: null,
          candidates: []
        });
        if (euglenaManager.manager) {
          var update = euglenaManager.manager.update({
            lights: lights,
            dT: dT / 1000,
            position: {
              x: this._three.position.x,
              y: this._three.position.y,
              z: this._three.position.z
            },
            controllerState: controllerState,
            object: this._three,
            yaw: this._three.rotation.z,
            roll: this._three.getObjectByName('base').rotation.x
          });

          this._three.position.set(Utils.posMod(update.position.x + model.get('bounds.width') / 2, model.get('bounds.width')) - model.get('bounds.width') / 2, Utils.posMod(update.position.y + model.get('bounds.height') / 2, model.get('bounds.height')) - model.get('bounds.height') / 2, update.position.z);
          this._three.rotateZ(update.dYaw);
          this._three.getObjectByName('base').rotateX(update.dRoll);
        } else {
          this._three.getObjectByName('base').rotateX(Math.PI / 2 * dT / 1000);
        }
      }
    }]);

    return EuglenaView;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxrQkFBa0IsUUFBUSx1QkFBUixDQUF4QjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFFBQVEsUUFBUSxPQUFSLENBRlY7QUFBQSxNQUdFLEtBQUssUUFBUSx5QkFBUixDQUhQO0FBQUEsTUFLRSxXQUFXO0FBQ1QsZ0JBQVksQ0FESDtBQUVULGdCQUFZLEVBRkg7O0FBSVQsZUFBVyxRQUpGO0FBS1QsY0FBVSxRQUxEOztBQU9ULFdBQU8sVUFQRTs7QUFTVCxtQkFBZSxLQUFLLEVBQUwsR0FBVSxDQVRoQjtBQVVULG1CQUFlLEVBVk47QUFXVCxrQkFBYztBQVhMLEdBTGI7O0FBb0JBLE1BQU0sT0FBTyxJQUFJLE1BQU0sUUFBVixFQUFiO0FBQ0EsTUFBTSxZQUFZLE1BQU0sS0FBTixDQUFZLE1BQVosQ0FBbUIsVUFBVSxNQUFWLEVBQWtCLEtBQWxCLEVBQXlCLEdBQXpCLEVBQThCO0FBQ2pFLFNBQUssTUFBTCxHQUFjLFVBQVUsQ0FBeEI7QUFDQSxTQUFLLEtBQUwsR0FBYSxTQUFTLENBQXRCO0FBQ0EsU0FBSyxHQUFMLEdBQVcsT0FBTyxLQUFLLEVBQUwsR0FBVSxDQUE1QjtBQUNELEdBSmlCLEVBSWYsVUFBVSxDQUFWLEVBQWE7QUFDZCxRQUFJLFdBQUo7QUFDQSxZQUFRLFNBQVMsS0FBakI7QUFDRSxXQUFLLE9BQUw7QUFDRSxZQUFNLFFBQVEsS0FBSyxLQUFLLEdBQUwsR0FBVyxLQUFLLEtBQXJCLElBQThCLEtBQUssS0FBakQ7QUFDQSxhQUFLLElBQUksTUFBTSxPQUFWLENBQWtCLEtBQUssR0FBTCxDQUFTLEtBQVQsSUFBa0IsS0FBSyxNQUF6QyxFQUFpRCxLQUFLLEdBQUwsQ0FBUyxLQUFULElB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RUFtQjRCLGVBbkI1QixFQW1CNkM7QUFDekMsWUFBSSxpQkFBaUIsR0FBRyxNQUFILENBQVUsaUJBQVYsRUFBNkI7QUFDaEQsbUJBQVMsSUFEdUM7QUFFaEQsc0JBQVk7QUFGb0MsU0FBN0IsQ0FBckI7QUFJQSxZQUFJLGVBQWUsT0FBbkIsRUFBNEI7QUFDMUIsY0FBSSxTQUFTLGVBQWUsT0FBZixDQUF1QixNQUF2QixDQUE4QjtBQUN6QyxvQkFBUSxNQURpQztBQUV6QyxnQkFBSSxLQUFLLElBRmdDO0FBR3pDLHNCQUFVO0FBQ1IsaUJBQUcsS0FBSyxNQUFMLENBQVksUUFBWixDQUFxQixDQURoQjtBQUVSLGlCQUFHLEtBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsQ0FGaEI7QUFHUixpQkFBRyxLQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCO0FBSGhCLGFBSCtCO0FBUXpDLDZCQUFpQixlQVJ3QjtBQVN6QyxvQkFBUSxLQUFLLE1BVDRCO0FBVXpDLGlCQUFLLEtBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsQ0FWZTtBQVd6QyxrQkFBTSxLQUFLLE1BQUwsQ0FBWSxlQUFaLENBQTRCLE1BQTVCLEVBQW9DLFFBQXBDLENBQTZDO0FBWFYsV0FBOUIsQ0FBYjs7QUFjQSxlQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLEdBQXJCLENBQ0UsTUFBTSxNQUFOLENBQWEsT0FBTyxRQUFQLENBQWdCLENBQWhCLEdBQW9CLE1BQU0sR0FBTixDQUFVLGNBQVYsSUFBNEIsQ0FBN0QsRUFBZ0UsTUFBTSxHQUFOLENBQVUsY0FBVixDQUFoRSxJQUE2RixNQUFNLEdBQU4sQ0FBVSxjQUFWLElBQTRCLENBRDNILEVBRUUsTUFBTSxNQUFOLENBQWEsT0FBTyxRQUFQLENBQWdCLENBQWhCLEdBQW9CLE1BQU0sR0FBTixDQUFVLGVBQVYsSUFBNkIsQ0FBOUQsRUFBaUUsTUFBTSxHQUFOLENBQVUsZUFBVixDQUFqRSxJQUErRixNQUFNLEdBQU4sQ0FBVSxlQUFWLElBQTZCLENBRjlILEVBR0UsT0FBTyxRQUFQLENBQWdCLENBSGxCO0FBSUEsZUFBSyxNQUFMLENBQVksT0FBWixDQUFvQixPQUFPLElBQTNCO0FBQ0EsZUFBSyxNQUFMLENBQVksZUFBWixDQUE0QixNQUE1QixFQUFvQyxPQUFwQyxDQUE0QyxPQUFPLEtBQW5EO0FBQ0QsU0FyQkQsTUFxQk87QUFDTCxlQUFLLE1BQUwsQ0FBWSxlQUFaLENBQTRCLE1BQTVCLEVBQW9DLE9BQXBDLENBQTZDLEtBQUssRUFBTCxHQUFVLENBQVgsR0FBZ0IsRUFBaEIsR0FBcUIsSUFBakU7QUFDRDtBQUNGO0FBaERIOztBQUFBO0FBQUEsSUFBaUMsZUFBakM7QUFrREQsQ0FsSUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L2V1Z2xlbmEvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
