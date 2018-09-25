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

/*
sensorPosition:
- z in [-1, 1]; if position is 0%, z is 1, and if it is 100%, z is 1.
- y in [-1,1]; if type is 1side, y is -1, if type is 1middle or eyespot, y is 0, and if type is 2sensors, y is -1 for one and 1 for the together

sensorOrientation: either 0 or Math.PI;
if type is 1side, sensorField not 2*Math.PI, then sensorOrientation is Math.PI;
if type is 2sensors, then sensorOrientation is Math.PI for the sensor with y = -1, and 0 for the together

sensorField: between 0 and 2*Math.PI
sensorField is shape (in %) * 2*Math.PI

*/


const defaultConfigs = { // Images are drawn with front to the left, i.e. positive z axis
sensorConfig_1: { id:'1side_50_100', config: {
  sensor_1: {
    sensorPosition: {z:-1, y:-1},
    sensorOrientation: Math.PI,
    sensorField: Math.PI
  },
  spotPositions: [],
  motorConnection: true }
}, sensorConfig_2: { id:'1side_50_0', config: {
  sensor_1: {
    sensorPosition: {z:1, y:-1},
    sensorOrientation: Math.PI,
    sensorField: Math.PI
  },
  spotPositions: [],
  motorConnection: true }
}, sensorConfig_3: { id:'1side_100_100', config: {
  sensor_1: {
    sensorPosition: {z:-1, y:-1},
    sensorOrientation: 0,
    sensorField: 2*Math.PI
  },
  spotPositions: [],
  motorConnection: true }
}, sensorConfig_4: { id:'1side_100_0', config: {
  sensor_1: {
    sensorPosition: {z:1, y:-1},
    sensorOrientation: 0,
    sensorField: 2*Math.PI
  },
  spotPositions: [],
  motorConnection: true }
}, sensorConfig_5: { id:'1middle_100_0', config: {
  sensor_1: {
    sensorPosition: {z:1, y: 0},
    sensorOrientation: 0,
    sensorField: 2*Math.PI
  },
  spotPositions: [],
  motorConnection: true }
}, sensorConfig_6: { id:'1middle_100_100', config: {
  sensor_1: {
    sensorPosition: {z:-1, y: 0},
    sensorOrientation: 0,
    sensorField: 2*Math.PI
  },
  spotPositions: [],
  motorConnection: true }
}, sensorConfig_7: { id:'eyespot_100_0', config: {
  sensor_1: {
    sensorPosition: {z:1, y: 0},
    sensorOrientation: 0,
    sensorField: 2*Math.PI
  },
  spotPositions: [{z:1, y:-1}],
  motorConnection: true }
}, sensorConfig_8: { id:'2sensors_50_100', config: {
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
}, sensorConfig_9: { id:'2sensors_50_0', config: {
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

export default defaultConfigs
