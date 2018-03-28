define((require) => {
  const EuglenaThreeView = require('euglena/model/threeview'),
    THREE = require('three'),
    Utils = require('core/util/utils'),
    defaults = {
      eyeColor: 0xffffff
    }

  return class OneEyeView extends EuglenaThreeView {
    constructor(config) {
      super(config)
      this.config = Utils.ensureDefaults(this.config, defaults);
      this.addEye({ z: this.tubeCurve.getPoint(0.85).z, y: this.config.tubeRadius * 2/3, x: 0 }, 0.75)
    }

    addEye(position, scale) {
      const sphereGeom = new THREE.SphereGeometry(this.config.tubeRadius, this.config.tubeSegments, this.config.tubeSegments);
      const colmat = new THREE.MeshLambertMaterial({ color: this.config.eyeColor });
      const eye = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [colmat]);
      for (let key of ['x', 'y', 'z']) {
        eye.scale[key] = scale;
        eye.position[key] = position[key] || 0;
      }
      this._body.add(eye);
    }
  }
})
