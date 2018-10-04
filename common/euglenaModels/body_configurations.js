var THREE = require('./three.min.js');

const defaults = {
  yaw_min: 0.1,
  shock_threshold: 0,

  opacity_factor: 2,
  opacity: 0.6,

  boxDim: {z: 6.0, y: 3.0, x: 1.0},
  boxOffset: {z: 0.1, y: 0.1, x: 0},

  ellipseDim: {z: 4.0, y: 2.0},
  ellipseOffset: {z: 0.25, y: 0.5},

  bodySize: 14, //in micro-meters
  sensorPosition: 'position_50', // in percent of body Size

  bodyType: 'ellipse', //'box'

  activation_threshold: 3, // in percent of maximum light

  fw_speed: 100,
  fw_conversion: 25, // factor by which to convert the chosen value to an internally used value.
  motion_type: 'motion_spiral',
  roll_strength: 60, // in percent of fw_speed

  reaction_strength_numeric: 2,
  reaction_strength_variation: 0,
  turn_amount: 'amount_2', // 'amount_1' - 'constant, 'amount_2' - proportional to light diff
  turn_forward: 'forward_1', // 'forward_0' - turn on spot, 'forward_1' - turn while moving forward
  turn_random: 'sigrandom_0', // number is percentage of turn_random_max for random turns
  turn_random_max: 1.3,
  turn_direction: 'away', // -1 - towards the sensor, 1 - away from the sensor

  adapt: 'adapt_0', // 'adapt_0' - no
  adapt_memory: 80, // defined in number of frames; this is modified by adaptSpeed: the shorter the adapt_memory, the quicker it adapts // COMBINE ADAPT_MEMORY AND ADAPT_SPEED
  adapt_speed: 0,
  }
;

// ALSO SPECIFY PARAMETERS FOR RANDOM TURNS, FOR MOLECULES, AND FOR TYPE OF TURNING.

class LightSensor {
  constructor(config, defaults) {

    this.field = config.sensorField;

    if (this.field < 2*Math.PI) {
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

    this.maxDistance = this.setMaxDistance(); // maxiDistance for calculating the light

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
    this.turn_strength = config.turn_strength ? config.turn_strength : 4;
    */
    this.bodyConfiguration = bodyConfig;

    // for each sensor in the bodyConfiguration, create the corresponding Euglenasensor instantiation.
    this.lightSensors = [];
    Object.keys(this.bodyConfiguration).map((sensor,ind) => {
      if (sensor.match('sensor_')) {
        this.lightSensors.push(new LightSensor(this.bodyConfiguration[sensor], this.defaults));
      }
    });

    if (this.lightSensors.length == 1 && this.lightSensors[0].field > Math.PI) {
      this.body_opacity = config.opacity ? config.opacity_numeric + (Math.random() * 2 - 1) * config.opacity_variation * config.opacity_numeric : this.defaults.opacity;;
    } else {
      this.body_opacity = 0;
    }

    this.spotPositions = [];
    // modify the sensors based on the spots
    if (this.bodyConfiguration.spotPositions) {
      this.bodyConfiguration.spotPositions.forEach(spotPosition => {
        this.lightSensors.forEach((lightSensor,ind) => {
          if (lightSensor.position.z == spotPosition.z) {
            if (lightSensor.field > Math.PI) {
              lightSensor.setField(Math.PI);
              lightSensor.setOrientation(spotPosition.y);
              this.spotPositions.push(spotPosition)
            } else if (lightSensor.field <= Math.PI) {
              if (lightSensor.orientation.y == (-1) * Math.sign(lightSensor.position.y - spotPosition.y)) {
                this.lightSensors.splice(ind,1);
              }
            }
          }
        })
      });
    }

    /* Forward motion and rolling */
    if (config.v_numeric != null) {
      this.fw_speed = Math.abs(config.v_numeric + (Math.random() * 2 - 1) * config.v_variation);
      if (this.defaults.fw_conversion) this.fw_speed = this.fw_speed / this.defaults.fw_conversion;
    } else {
      if (this.defaults.fw_conversion) { this.fw_speed = this.defaults.fw_speed / this.defaults.fw_conversion; }
      else { this.fw_speed = this.defaults.fw_speed; }
    }

    // either load roll speed (omega) or calculated it from forward speed
    if (config.omega_numeric >= 0) {
      this.roll_speed = Math.abs(config.omega_numeric + (Math.random() * 2 - 1) * config.omega_variation * config.omega_numeric);
    } else if (config.motion != null) {
      this.motion_type = config.motion.match('spiral') ? 1 : 0;
      this.roll_speed = this.motion_type * this.defaults.roll_strength / 100 * this.fw_speed;
    } else {
      this.motion_type = this.defaults.motion.match('spiral') ? 1 : 0;
      this.roll_speed = this.motion_type * this.defaults.roll_strength / 100 * this.fw_speed;
    }

    /* Turning parameters */
    var tmp_numeric = config.reactionStrength_numeric != null ? config.reactionStrength_numeric : this.defaults.reactionStrength_numeric;
    var tmp_variation = config.reactionStrength_variation != null ? config.reactionStrength_variation : this.defaults.reactionStrength_variation;
    this.reaction_strength = tmp_numeric + (Math.random() * 2 - 1) * tmp_variation;
    this.turn_amount = config.turnAmount != null ? config.turnAmount : this.defaults.turn_amount;
    this.turn_forward = config.turnForward!= null ? config.turnForward : this.defaults.turn_forward;
    this.turn_forward = this.turn_forward.match('_1') ? 1 : 0;
    this.turn_random = ( config.signalRandom != null ? parseInt(config.signalRandom.substr(config.signalRandom.indexOf('_')+1)): parseInt(this.defaults.turn_random.substr(this.defaults.turn_random.indexOf('_')+1)) ) / 100 * this.defaults.turn_random_max;

    /* Activation Thresholds and turning direction - depends also on the number of eyes! */
    this.activation_threshold = (config.signalThresh != null ? config.signalThresh_numeric : this.defaults.activation_threshold) / 100;
    var tmp_turnDir = config.turnDirection != null ? config.turnDirection : this.defaults.turn_direction;
    this.turn_direction = tmp_turnDir.match('towards') ? 1 : -1;

    /* Adaptation */
    this.adapt = config.signalAdapt != null ? parseInt(config.signalAdapt.substr(config.signalAdapt.indexOf('_')+1)) : parseInt(this.defaults.adapt.substr(this.defaults.adapt.indexOf('_')+1));
    this.adapt_speed = config.signalAdaptSpeed_numeric != null ? config.signalAdaptSpeed_numeric + (Math.random() * 2 - 1) * config.signalAdaptSpeed_variation : this.defaults.adapt_speed;
    this.adapt_threshold = this.activation_threshold

    // signalPathLength, depending on the position of the Sensor. It determines the number of frames by which the reaction is delayed. If it is 0, there is no delay.
    this.signalPathLength = (config.sensorPosition ? config.sensorPosition.substr(config.sensorPosition.indexOf('_')+1) : this.defaults.sensorPosition.substr(this.defaults.sensorPosition.indexOf('_')+1));
    if (config.fps) {
      if (this.roll_speed) {
//        this.signalPathLength = parseInt(this.signalPathLength) / 100 * Math.round( Math.PI / (this.roll_speed * (1 / config.fps)) ); // this.defaults.roll_strength / 100 * (this.defaults.fw_speed / this.defaults.fw_conversion) // Use this if you want to couple delay in response to rotation speed
        this.signalPathLength = parseInt(this.signalPathLength) / 100 * this.defaults.bodySize;
      } else {
        this.signalPathLength = parseInt(this.signalPathLength) / 100 * this.defaults.bodySize;
      }
    } else {
      this.signalPathLength = parseInt(this.signalPathLength) / 100 * this.defaults.bodySize;
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
