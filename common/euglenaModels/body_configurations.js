var THREE = require('./three.min.js');

const defaults = {
  yaw_min: 0.5,

  opacity_factor: 2,
  opacity: 0.6,

  boxDim: {z: 6.0, y: 3.0, x: 1.0},
  boxOffset: {z: 0.1, y: 0.1, x: 0},

  ellipseDim: {z: 4.0, y: 2.0},
  ellipseOffset: {z: 0.25, y: 0.5},

  signalDuration: 1.5, //in seconds
  sensorPosition: 'position_0', // in percent of body Size

  bodyType: 'ellipse', //'box'

  activationThreshold_default: 0.05, // in percent of maximum light
  activation_min: 0.03,

  criticalThreshold: 0.2,

  fw_speed: 100,
  fw_conversion: 15, // factor by which to convert the chosen value to an internally used value.
  motion: 'motion_spiral',
  roll_strength: 0.6, // in percent of fw_speed

  reactionStrength_numeric: 3.2,
  reactionStrength_variation: 0,

  turn: {
    amount: 'amount_constant', // 'amount_constant' - 'constant, 'amount_proportional' - proportional to light diff
    forward: 'forward_0', // 'forward_0' - turn on spot, 'forward_1' - turn while moving forward
    random: 'sigrandom_20', // number is percentage of random_max for random turns
    random_max: 1.3,
    direction_default: 'away' // away means away from the light; towards means towards the light.
  }, // -1 - towards the sensor, 1 - away from the sensor

  light: {
    memoryFactor: 5, // factor that determines over how many rotations of a Euglena the memory should last; translated into number of frames
    memory: 20, // in seconds
    aggregationType: 'max'
  },

  adapt: {
    mode: 'adapt_null', // 'adapt_continuous' - Euglena is always functional, and activation threshold adapts continuously; 'adapt_shock' - continuous adaptation for small changes, but shock adaptation for big changes
    speed: 10, // in seconds. The smaller the faster.
    acceleration: 5, // factor by which adaptation is accelerated
    deceleration: 0.1,
    adaptedRange: 0, //0.3,
    thresholdMin: 0.1,
    thresholdSwitch: 0.5,
    reactionStrengthSwitch: 10
  },

  shock: {
    mode: null,
    startThreshold: 0.5, // threshold for difference between incoming light and activation_threshold to trigger shock behavior
    stopThreshold: -0.4, // threshold for difference between incoming light and activation_threshold to stop shock behavior
    durationFactor: 30, // proportional to the difference of incoming light and activation_threshold; translated into number of frames; should be at most as big as adapt_speed
    reactionStrength: 5, // intensity of turning reaction during shock
    turnDirection: 1, // direction of turning during shock; values same definition as turning_direction
    resetDuration: Math.ceil(20 + (Math.random() * 2 - 1) * 10) // in number of frames
  }
};

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

    this.activation_min = defaults.activation_min;

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

    // either load roll speed (roll) or calculated it from forward speed
    if (config.roll_numeric >= 0) {
      this.roll_speed = 2 * Math.PI * Math.abs(config.roll_numeric + (Math.random() * 2 - 1) * config.roll_variation);
      // roll_speed is defined in rotations per second. So, convert this.roll_speed to
      // 2*PI*this.roll_speed / config.frame angle per frame
    } else if (config.motion != null) {
      this.motion_type = config.motion.match('spiral') ? 1 : 0;
      this.roll_speed = this.motion_type * this.defaults.roll_strength * this.fw_speed;
    } else {
      this.motion_type = this.defaults.motion.match('spiral') ? 1 : 0;
      this.roll_speed = this.motion_type * this.defaults.roll_strength * this.fw_speed;
    }

    this.light = this.defaults.light;
    this.light.memory = this.roll_speed ? this.light.memoryFactor * 2 * Math.PI / this.roll_speed : this.defaults.light.memory; // To be multiplied by config.fps in calculation
    this.light.aggregationType = this.defaults.light.aggregationType

    /* Turning parameters */
    if (config.reactionStrength_numeric != null) {
      var tmp_numeric = config.reactionStrength_numeric;
      var tmp_variation = config.reactionStrength_variation != null ? config.reactionStrength_variation : this.defaults.reactionStrength_variation;
    } else {
      var tmp_numeric = config.turnStrength_numeric != null ? config.turnStrength_numeric : this.defaults.reactionStrength_numeric;
      var tmp_variation = config.turnStrength_variation != null ? config.turnStrength_variation : this.defaults.reactionStrength_variation;
    }
    this.reactionStrength = tmp_numeric + (Math.random() * 2 - 1) * tmp_variation;
    this.turn = {};
    this.turn.amount = config.channelOpeningAmount != null ? config.channelOpeningAmount : this.defaults.turn.amount;
    this.turn.forward = config.turnForward!= null ? config.turnForward : this.defaults.turn.forward;
    this.turn.forward = this.turn.forward.match('_1') ? 1 : 0;
    this.turn.random = ( config.signalRandom != null ? parseInt(config.signalRandom.substr(config.signalRandom.indexOf('_')+1)): parseInt(this.defaults.turn.random.substr(this.defaults.turn.random.indexOf('_')+1)) ) / 100 * this.defaults.turn.random_max;

    /* Activation Thresholds and turning direction - depends also on the number of eyes! */
    this.activationThreshold_default = config.signalThresh != null ? config.signalThresh_numeric / 100: this.defaults.activationThreshold_default;
    var tmp_turnDir = config.turnDirection != null ? config.turnDirection : this.defaults.turn.direction_default;
    this.turn.direction_default = tmp_turnDir.match('towards') ? -1 : 1;
    if (!config.turnDirection) {
      this.turn.direction_default = -1;
    } else {
      this.turn.direction_default = (-1) * this.turn.direction_default;
    }

    /* Critical Brightness for differentiation between constand and proportional release of amount. */
    this.criticalThreshold_default = config.signalThreshAllNone != null ? config.signalThreshAllNone_numeric / 100 : this.defaults.criticalThreshold;



    /* Adaptation */
    this.adapt = this.defaults.adapt;
    this.adapt.mode = config.signalAdapt != null ? config.signalAdapt : this.defaults.adapt.mode;
    this.adapt.speed = config.signalAdaptSpeed_numeric != null ? config.signalAdaptSpeed_numeric + (Math.random() * 2 - 1) * config.signalAdaptSpeed_variation : this.defaults.adapt.speed;

    // shock
    this.shock = this.defaults.shock;
    this.shock.mode = config.signalAdapt === 'adapt_shock' ? true : false;
    this.shock.startThreshold = config.signalShockThresh_numeric ? (config.signalShockThresh_numeric + (Math.random() * 2 - 1) * config.signalShockThresh_variation ) / 100 : this.shock.startThreshold;


    // signalDuration, depending on the position of the Sensor. It determines the number of frames by which the reaction is delayed. If it is 0, there is no delay.
    var signalPath = config.sensorPosition ? config.sensorPosition.substr(config.sensorPosition.indexOf('_')+1) : this.defaults.sensorPosition.substr(this.defaults.sensorPosition.indexOf('_')+1);
    if (this.roll_speed) {
//        this.signalDuration = parseInt(this.signalDuration) / 100 * Math.PI / this.roll_speed; // this.defaults.roll_strength / 100 * (this.defaults.fw_speed / this.defaults.fw_conversion) // Use this if you want to couple delay in response to rotation speed
      this.signalDuration = parseInt(signalPath) / 100 * this.defaults.signalDuration;
    } else {
      this.signalDuration = parseInt(signalPath) / 100 * this.defaults.signalDuration;
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
