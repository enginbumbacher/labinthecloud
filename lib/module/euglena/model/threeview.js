import Utils from 'core/util/utils';
import * as THREE from 'three';
const defaults = {
  tubeRadius: 1.0,
  tubeLength: 3.5,

  baseColor: 0x2222ff
};

function TubeCurve(length) {
  THREE.Curve.call(this);
  this.tubeLength = length === undefined ? 1 : length;
}
TubeCurve.prototype = Object.create(THREE.Curve.prototype);
TubeCurve.prototype.constructor = TubeCurve;
TubeCurve.prototype.getPoint = function(t) {
  let tx = 0;
  let ty = 0;
  let tz = t * this.tubeLength - this.tubeLength / 2;
  return new THREE.Vector3(tx, ty, tz);
}

export default class EuglenaThreeView {
  constructor(config) {
    this.config = Utils.ensureDefaults(config, defaults);
    this._body = new THREE.Object3D();
    this.tubeCurve = new TubeCurve(this.config.tubeLength);
    const tubeGeom = new THREE.TubeGeometry(this.tubeCurve, 10, this.config.tubeRadius, this.config.tubeSegments, false);
    const sphereGeom = new THREE.SphereGeometry(this.config.tubeRadius, this.config.tubeSegments, this.config.tubeSegments);
    const colmat = new THREE.MeshLambertMaterial({ color: this.config.baseColor });

    const tube = new THREE.Mesh(tubeGeom, colmat);
    const leftCap = new THREE.Mesh(sphereGeom, colmat);
    const rightCap = new THREE.Mesh(sphereGeom, colmat);

    leftCap.position.x = this.tubeCurve.getPoint(0).x;
    leftCap.position.y = this.tubeCurve.getPoint(0).y;
    leftCap.position.z = this.tubeCurve.getPoint(0).z;
    rightCap.position.x = this.tubeCurve.getPoint(1).x;
    rightCap.position.y = this.tubeCurve.getPoint(1).y;
    rightCap.position.z = this.tubeCurve.getPoint(1).z;

    this._body.add(tube, leftCap, rightCap);
  }

  view() {
    return this._body
  }
}
