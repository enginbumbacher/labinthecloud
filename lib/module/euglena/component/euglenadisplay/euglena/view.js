define((require) => {
  const EventDispatcher = require('core/event/dispatcher'),
    Utils = require('core/util/utils'),
    THREE = require('three'),
    HM = require('core/event/hook_manager'),

    defaults = {
      tubeRadius: 3,
      tubeLength: 15,

      baseColor: 0x2222ff,
      eyeColor: 0xffffff,

      tubeArcLength: Math.PI / 4,
      tubeArcRadius: 20,
      tubeSegments: 12
    }
  ;

  const base = new THREE.Object3D();
  const TubeCurve = THREE.Curve.create(function (radius, start, end) {
    this.radius = radius || 1;
    this.start = start || 0;
    this.end = end || Math.PI * 2;
  }, function (t) {
    // const theta = t * (this.end - this.start) + this.start;
    // return new THREE.Vector3(Math.cos(theta) * this.radius, Math.sin(theta) * this.radius, 0);
    return new THREE.Vector3(t * defaults.tubeLength - defaults.tubeLength / 2, 0, 0)
  });

  const tubeCurve = new TubeCurve(defaults.tubeArcRadius, -defaults.tubeArcLength/2 + Math.PI / 2, defaults.tubeArcLength/2 + Math.PI / 2);
  const tubeGeom = new THREE.TubeGeometry(tubeCurve, 10, defaults.tubeRadius, defaults.tubeSegments, false);
  const sphereGeom = new THREE.SphereGeometry(defaults.tubeRadius, defaults.tubeSegments, defaults.tubeSegments);
  const colmat = new THREE.MeshLambertMaterial({ color: defaults.baseColor });
  const wfmat = new THREE.MeshLambertMaterial({ color: defaults.eyeColor });

  const tube = THREE.SceneUtils.createMultiMaterialObject(tubeGeom, [colmat]);
  const leftCap = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [colmat]);
  const rightCap = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [colmat]);
  const eye = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [wfmat]);

  // leftCap.position.x = tubeCurve.getPoint(0).x;
  // leftCap.position.y = tubeCurve.getPoint(0).y - defaults.tubeArcRadius;
  // rightCap.position.x = tubeCurve.getPoint(1).x;
  // rightCap.position.y = tubeCurve.getPoint(1).y - defaults.tubeArcRadius;
  // tube.position.y = tube.position.y - defaults.tubeArcRadius;
  // eye.position.y = defaults.tubeRadius * 2/3;
  leftCap.position.x = tubeCurve.getPoint(0).x;
  leftCap.position.y = tubeCurve.getPoint(0).y;
  rightCap.position.x = tubeCurve.getPoint(1).x;
  rightCap.position.y = tubeCurve.getPoint(1).y;
  eye.position.x = tubeCurve.getPoint(0.85).x;
  eye.position.y = defaults.tubeRadius * 2/3;
  eye.scale.x = 0.75;
  eye.scale.y = 0.75;
  eye.scale.z = 0.75;

  base.add(tube, leftCap, rightCap, eye);
  base.name = "base";
  const euModel = new THREE.Object3D();
  euModel.add(base);

  return class EuglenaView extends EventDispatcher {
    constructor(model) {
      super();
      this._three = euModel.clone();
      this._three.getObjectByName('base').rotateX(Math.random() * Math.PI * 2);
    }

    threeObject() {
      return this._three;
    }

    setPosition(x, y, z) {
      this._three.position.set(x, y, z);
    }

    setRotation(theta) {
      this._three.rotateZ(theta)
    }

    update(lights, dT, model, controllerState) {
      let euglenaManager = HM.invoke('Euglena.Manager', {
        manager: null,
        candidates: []
      });
      if (euglenaManager.manager) {
        let update = euglenaManager.manager.update({
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

        this._three.position.set(
          Utils.posMod(update.position.x + model.get('bounds.width') / 2, model.get('bounds.width')) - model.get('bounds.width') / 2,
          Utils.posMod(update.position.y + model.get('bounds.height') / 2, model.get('bounds.height')) - model.get('bounds.height') / 2,
          update.position.z);
        this._three.rotateZ(update.dYaw);
        this._three.getObjectByName('base').rotateX(update.dRoll);
      } else {
        this._three.getObjectByName('base').rotateX((Math.PI / 2) * dT / 1000);
      }
    }
  }
})