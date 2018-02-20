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
  sensorConfig_1: { id:'Directed_BackLeft', config: {
    sensor_1: {
      sensorPosition: {z:-1, y:-1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, sensorConfig_2: { id:'Directed_BackRight', config: {
    sensor_1: {
      sensorPosition: {z:-1, y:1},
      sensorOrientation: 0,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, sensorConfig_3: { id:'Directed_FrontLeft', config: {
    sensor_1: {
      sensorPosition: {z:1, y:-1},
      sensorOrientation: Math.PI,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, sensorConfig_4: { id:'Directed_FrontRight', config: {
    sensor_1: {
      sensorPosition: {z:1, y:1},
      sensorOrientation: 0,
      sensorField: Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, sensorConfig_5: { id:'Alldirections_BackLeft', config: {
    sensor_1: {
      sensorPosition: {z:-1, y:-1},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, sensorConfig_6: { id:'Alldirections_BackRight', config: {
    sensor_1: {
      sensorPosition: {z:-1, y:1},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, sensorConfig_7: { id:'Alldirections_FrontLeft', config: {
    sensor_1: {
      sensorPosition: {z:1, y:-1},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, sensorConfig_8: { id:'Alldirections_FrontRight', config: {
    sensor_1: {
      sensorPosition: {z:1, y:1},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, sensorConfig_9: { id:'Alldirections_FrontCenter', config: {
    sensor_1: {
      sensorPosition: {z:1, y: 0},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [],
    motorConnection: true }
  }, sensorConfig_10: { id:'Alldirections_FrontCenter_Shield_Left', config: {
    sensor_1: {
      sensorPosition: {z:1, y: 0},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [{z:1, y:-1}],
    motorConnection: true }
  }, sensorConfig_11: { id:'Alldirections_FrontCenter_Shield_Right', config: {
    sensor_1: {
      sensorPosition: {z:1, y: 0},
      sensorOrientation: 0,
      sensorField: 2*Math.PI
    },
    spotPositions: [{z:1, y:1}],
    motorConnection: true }
  }, sensorConfig_12: { id:'2Directed_Back', config: {
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
  }, sensorConfig_13: { id:'2Directed_Front', config: {
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
  }}

  return defaultConfigs
});
