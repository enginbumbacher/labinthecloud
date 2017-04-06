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

      shape: "straight",

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
    let pt;
    switch (defaults.shape) {
      case "curve":
        const theta = t * (this.end - this.start) + this.start;
        pt = new THREE.Vector3(Math.cos(theta) * this.radius, Math.sin(theta) * this.radius, 0);
        break;
      case "straight":
        pt = new THREE.Vector3(t * defaults.tubeLength - defaults.tubeLength / 2, 0, 0);
        break;
    }
    return pt;
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
  eye.position.y = defaults.tubeRadius * 2/3;

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

    update(state) {
      this._three.position.set(state.position.x, state.position.y, state.position.z);
      this._three.rotateZ(state.yaw - this._three.rotation.z);
      this._three.getObjectByName('base').rotateX(state.roll - this._three.getObjectByName('base').rotation.x);
    }
  }
})