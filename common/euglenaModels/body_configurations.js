var THREE = require('./three.min.js');

const defaults = {
  adaptation_level: 0.4,
  adaptation_duration: 0,
  adaptation_threshold:0,
  memory_duration: 20, // defined in number of frames
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

/*
Explanation of possible body configurations:
Body is such that the longest part of the body is along the x-axis.
The local axis of the body are centered in the body itself. Keep that in mind when creating the eye position and orientation.
The y axis is pointing down, the x axis is pointing right.
1. sensorPosition is defined as an index of a 2-dimensional matrix of possible positions. Each of these positions get translated to a set of coordinates in space.
The position is defined with respect to the body. (-1,-1) is the top most left point. (1,-1) is the top most right point. (1,1) is the bottom most right point.
2. sensorOrientation is the orientation of the sensor in the body. 0 corresponds to (0,1,0), Math.PI/2 to (1,0,0), Math.PI to (0,-1,0), etc.
3. sensorField is the visual field of the sensor. Math.PI corresponds to a 180 deg visual field, around the sensor orientation  Currently, there will be only two values: Math.PI and 2*Math.PI
4. spotPositions is defined the same way as sensorPosition, but as an array of all spots.

A spot influences the sensorField of an sensor. It either halves it if the sensorField is 2*Math.PI, or it basically sets it to zero, if it is positioned in direction of the sensor orientation.
An empty array within a configuration definition means that that corresponding object does not exist.
*/
const bodyConfigurations = { /////////////// EXTEND THIS OBJECT TO CONTAIN ALL POSSIBLE CONFIGURATIONS
  configuration_1: {
    sensor_1: {
      sensorPosition: {z:1, y:-1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    sensor_2: {
      sensorPosition: {z:1, y:1},
      sensorOrientation: 0,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true
  },
  configuration_2: {
    sensor_1: {
      sensorPosition: {z:-1, y:-1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    sensor_2: {
      sensorPosition: {z:-1, y:1},
      sensorOrientation: 0,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true
  }
}

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
  constructor(config){
    this.defaults = defaults;

    /*
    this.fw_speed = config.fw_speed ? config.fw_speed : 4;
    this.spin_speed = config.spin_speed ? config.spin_speed : 2;
    this.reaction_strength = config.reaction_strength ? config.reaction_strength : 4;
    */
    // Also account for random numbers
    this.fw_speed = config.v;
    this.roll_speed = config.omega;
    this.reaction_strength = config.k;
    this.body_opacity = config.body_opacity ? config.body_opacity : 0.3;

    // for each sensor in the bodyConfiguration, create the corresponding Euglenasensor instantiation.
    this.bodyConfiguration = bodyConfigurations[config.body_configuration];
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
    console.log(this.lightSensors)
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
