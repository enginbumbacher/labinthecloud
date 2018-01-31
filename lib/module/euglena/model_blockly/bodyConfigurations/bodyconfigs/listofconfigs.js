define((require) => {
  /*
Explanation of possible body configurations:
Body is such that the longest part of the body is along the x-axis.
The local axis of the body are centered in the body itself. Keep that in mind when creating the eye position and orientation.
The y axis is pointing down, the z axis is pointing right.
1. sensorPosition is defined as an index of a 2-dimensional matrix of possible positions. Each of these positions get translated to a set of coordinates in space.
The position is defined with respect to the body. (-1,-1) is the top most left point. (1,-1) is the top most right point. (1,1) is the bottom most right point.
2. sensorOrientation is the orientation of the sensor in the body. 0 corresponds to (0,1,0), Math.PI/2 to (1,0,0), Math.PI to (0,-1,0), etc.
3. sensorField is the visual field of the sensor. Math.PI corresponds to a 180 deg visual field, around the sensor orientation  Currently, there will be only two values: Math.PI and 2*Math.PI
4. spotPositions is defined the same way as sensorPosition, but as an array of all spots.

A spot influences the sensorField of an sensor. It either halves it if the sensorField is 2*Math.PI, or it basically sets it to zero, if it is positioned in direction of the sensor orientation.
An empty array within a configuration definition means that that corresponding object does not exist.
*/
const defaultConfigs = { // Images are drawn with front to the left, i.e. positive z axis
  configuration_1: { id:'1DirSensorLeftBack', config: {
    sensor_1: {
      sensorPosition: {z:-1, y:-1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_2: { id:'1DirSensorLeftFront', config: {
    sensor_1: {
      sensorPosition: {z:1, y:-1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_3: { id:'1DirSensorLeftFrontNoConnection', config: {
    sensor_1: {
      sensorPosition: {z:1, y:-1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: false }
  }, configuration_4: { id:'1DirSensorMidFront', config: {
    sensor_1: {
      sensorPosition: {z:1, y:0},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_5: { id:'1DirSensorRightBack', config: {
    sensor_1: {
      sensorPosition: {z:-1, y:1},
      sensorOrientation: 0,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_6: { id:'1DirSensorRightFront', config: {
    sensor_1: {
      sensorPosition: {z:1, y:1},
      sensorOrientation: 0,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_7: { id:'1UniSensorLeftBack', config: {
    sensor_1: {
      sensorPosition: {z:-1, y:-1},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_8: { id:'1UniSensorLeftFront', config: {
    sensor_1: {
      sensorPosition: {z:1, y:-1},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_9: { id:'1UniSensorMidFront', config: {
    sensor_1: {
      sensorPosition: {z:1, y: 0},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_10: { id:'1UniSensorRightBack', config: {
    sensor_1: {
      sensorPosition: {z:-1, y:1},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_11: { id:'1UniSensorRightFront', config: {
    sensor_1: {
      sensorPosition: {z:1, y:1},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_12: { id:'1UniSensorMidFrontSpotLeft', config: {
    sensor_1: {
      sensorPosition: {z:1, y: 0},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [{z:1, y:-1}],
    motorConnection: true }
  }, configuration_13: { id:'1UniSensorMidFrontSpotRight', config: {
    sensor_1: {
      sensorPosition: {z:1, y: 0},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [{z:1, y:1}],
    motorConnection: true }
  }, configuration_14: { id:'2DirSensorsBack', config: {
    sensor_1: {
      sensorPosition: {z:-1, y: -1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    sensor_2: {
      sensorPosition: {z:-1, y: 1},
      sensorOrientation: 0,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_15: { id:'2DirSensorsFront', config: {
    sensor_1: {
      sensorPosition: {z:1, y: -1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    sensor_2: {
      sensorPosition: {z:1, y: 1},
      sensorOrientation: 0,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, configuration_16: { id:'2DirSensorsFrontNoConnection', config: {
    sensor_1: {
      sensorPosition: {z:1, y: -1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    sensor_2: {
      sensorPosition: {z:1, y: 1},
      sensorOrientation: 0,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: false }
  }}

  return defaultConfigs
});
