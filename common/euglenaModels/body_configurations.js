var THREE = require('./three.min.js');

const defaults = {
  adaptation_level: 0.4,
  adaptation_duration: 0,
  adaptation_threshold:0,
  memory_duration: 60, // defined in number of frames
  sensitivity_threshold: 0.03,
  yaw_min: 0.1,
  shock_threshold: 0,

  opacity_factor: 2,

  boxDim: {z: 6.0, y: 3.0, x: 1.0},
  boxOffset: {z: 0.1, y: 0.1, x: 0},

  ellipseDim: {z: 4.0, y: 2.0},
  ellipseOffset: {z: 0.25, y: 0.5},

  bodyType: 'ellipse', //'box'
  }
;

class LightSensor {
  constructor(config, defaults) {

    this.field = config.sensorField;

    if (this.field == Math.PI) {
      this.orientation = new THREE.Vector3(0,1,0);
      this.orientation.applyAxisAngle(new THREE.Vector3(0,0,1), config.sensorOrientation);
    } else {
      this.orientation = [];
    }

    this.position = config.sensorPosition;

    if (defaults.bodyType == 'ellipse') {

      var positionLength = config.sensorPosition.z * (1 - defaults.ellipseOffset.z) * defaults.ellipseDim.z;
      var positionWidth = config.sensorPosition.y * (1 - defaults.ellipseOffset.y) * defaults.ellipseDim.y;

    } else if (defaults.bodyType == 'box'){

      var positionLength = config.sensorPosition.z * (defaults.boxDim.z / 2 - defaults.boxOffset.z);
      var positionWidth = config.sensorPosition.y * (defaults.boxDim.y / 2 - defaults.boxOffset.y);
    }

    this.position3D = new THREE.Vector3(0, positionWidth, positionLength);

    this.flipRotationDir = this.position.y != 0 ? (-1) * this.position.y : 1; // if y is positive, then flip. To flip, invert, i.e. set to -1.

    this.maxDistance = this.setMaxDistance();

  }

  setField(fieldSize) {
    this.field = fieldSize;
  }

  setOrientation(awayFrom) {
    this.orientation = new THREE.Vector3(0,Math.sign(this.position.y - awayFrom),0);
  }

  setMaxDistance() {
    var maxDistance = null;

    if (defaults.bodyType == 'box') {
      var length_1 = Math.sqrt(Math.pow(defaults.boxDim.z / 2 - this.position3D.z,2) + Math.pow(defaults.boxDim.y / 2 - this.position3D.y,2));
      var length_2 = Math.sqrt(Math.pow(defaults.boxDim.z / 2 - this.position3D.z,2) + Math.pow(defaults.boxDim.y / 2 + this.position3D.y,2));
      var length_3 = Math.sqrt(Math.pow(defaults.boxDim.z / 2 + this.position3D.z,2) + Math.pow(defaults.boxDim.y / 2 + this.position3D.y,2));
      var length_4 = Math.sqrt(Math.pow(defaults.boxDim.z / 2 + this.position3D.z,2) + Math.pow(defaults.boxDim.y / 2 - this.position3D.y,2));
      maxDistance = Math.max(length_1, length_2, length_3, length_4);
    } else if (defaults.bodyType == 'ellipse') {

      var length_1 = Math.sqrt(Math.pow(defaults.ellipseDim.z - this.position3D.z,2) + Math.pow(this.position3D.y,2));
      var length_2 = Math.sqrt(Math.pow(defaults.ellipseDim.z + this.position3D.z,2) + Math.pow(this.position3D.y,2));
      maxDistance = Math.max(length_1, length_2);

    }

    return maxDistance;
  }

  getMaxDistance() {
    return this.maxDistance
  }

  getPosition3D() {
    return this.position3D
  }

  getOrientation() {
    return this.orientation
  }

  getField() {
    return this.field
  }
}

class EuglenaBody {
  constructor(config,bodyConfig){
    this.defaults = defaults;

    /*
    this.fw_speed = config.fw_speed ? config.fw_speed : 4;
    this.spin_speed = config.spin_speed ? config.spin_speed : 2;
    this.reaction_strength = config.reaction_strength ? config.reaction_strength : 4;
    */
    this.bodyConfiguration = bodyConfig;

        this.fw_speed = config.v_numeric + (Math.random() * 2 - 1) * config.v_variation * config.v_numeric;

    // either load roll speed (omega) or calculated it from forward speed
    if (config.omega_numeric) {
      this.roll_speed = config.omega_numeric + (Math.random() * 2 - 1) * config.omega_variation * config.omega_numeric;
    } else if (Object.keys(config).indexOf('motion_numeric') >-1) {
      this.roll_speed = config.motion_numeric * (this.fw_speed + (Math.random() * 2 - 1) * config.v_variation * config.v_numeric);
    }

    this.reaction_strength = this.bodyConfiguration.motorConnection? config.k_numeric + (Math.random() * 2 - 1) * config.k_variation * config.k_numeric : 0;
    this.body_opacity = config.opacity ? config.opacity_numeric + (Math.random() * 2 - 1) * config.opacity_variation * config.opacity_numeric : 0.0;

    // for each sensor in the bodyConfiguration, create the corresponding Euglenasensor instantiation.
    this.lightSensors = [];
    Object.keys(this.bodyConfiguration).map((sensor,ind) => {
      if (sensor.match('sensor_')) {
        this.lightSensors.push(new LightSensor(this.bodyConfiguration[sensor], this.defaults));
      }
    });

    this.spotPositions = [];
    // modify the sensors based on the spots
    if (this.bodyConfiguration.spotPositions) {
      this.bodyConfiguration.spotPositions.forEach(spotPosition => {
        this.lightSensors.forEach((lightSensor,ind) => {
          if (lightSensor.position.z == spotPosition.z) {
            if (lightSensor.field == 2*Math.PI) {
              lightSensor.setField(Math.PI);
              lightSensor.setOrientation(spotPosition.y);
              this.spotPositions.push(spotPosition)
            } else if (lightSensor.field == Math.PI) {
              if (lightSensor.orientation.y == (-1) * Math.sign(lightSensor.position.y - spotPosition.y)) {
                this.lightSensors.splice(ind,1);
              }
            }
          }
        })
      });
    }
    }

  constructBody() {
    this.body = new THREE.Object3D();
    var bodyMesh = [];
    if (this.defaults.bodyType == 'ellipse') {

      var ellipseGeom = new THREE.SphereGeometry(this.defaults.ellipseDim.y, 50, 50, 0, 2.1*Math.PI, 0, 1.1*Math.PI);
			ellipseGeom.applyMatrix( new THREE.Matrix4().makeScale( 1.0, 1.0, this.defaults.ellipseDim.z / this.defaults.ellipseDim.y ) );
      var ellipseMat = new THREE.LineBasicMaterial({ color: 0xBBBBBB, visible: false, side: THREE.DoubleSide, transparent: true, opacity: this.body_opacity });
      bodyMesh = new THREE.Mesh(ellipseGeom, ellipseMat);
    } else if (this.defaults.bodyType == 'box') {
      const boxGeom = new THREE.BoxGeometry(this.defaults.boxDim.x, this.defaults.boxDim.y, this.defaults.boxDim.z);
      const boxMat = new THREE.MeshBasicMaterial({ color: 0xBBBBBB, visible: false, side: THREE.DoubleSide, transparent: true, opacity: this.body_opacity });
      bodyMesh = new THREE.Mesh(boxGeom, boxMat);
    }

    this.body.add(bodyMesh);

  }

  removeBody() {
    delete this.body;
  }

}

module.exports = { EuglenaBody: EuglenaBody }
