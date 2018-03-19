'use strict';

define(function (require) {
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
  var defaultConfigs = { // Images are drawn with front to the left, i.e. positive z axis
    sensorConfig_1: { id: 'Directed_BackLeft', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_2: { id: '1Sensor_BackRight', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_3: { id: '1Sensor_FrontLeft', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_4: { id: '1Sensor_FrontRight', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_5: { id: '1OmniSensor_BackLeft', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: -1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_6: { id: '1OmniSensor_BackRight', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: 1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_7: { id: '1OmniSensor_FrontLeft', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_8: { id: '1OmniSensor_FrontRight', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_9: { id: '1OmniSensor_FrontCenter', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_10: { id: '1OmniSensor_FrontCenter_Shield_Left', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [{ z: 1, y: -1 }],
        motorConnection: true }
    }, sensorConfig_11: { id: '1OmniSensor_FrontCenter_Shield_Right', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [{ z: 1, y: 1 }],
        motorConnection: true }
    }, sensorConfig_12: { id: '2Sensors_Back', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        sensor_2: {
          sensorPosition: { z: -1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_13: { id: '2Sensors_Front', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        sensor_2: {
          sensorPosition: { z: 1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    } };

  return defaultConfigs;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2xpc3RvZmNvbmZpZ3MuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsImRlZmF1bHRDb25maWdzIiwic2Vuc29yQ29uZmlnXzEiLCJpZCIsImNvbmZpZyIsInNlbnNvcl8xIiwic2Vuc29yUG9zaXRpb24iLCJ6IiwieSIsInNlbnNvck9yaWVudGF0aW9uIiwiTWF0aCIsIlBJIiwic2Vuc29yRmllbGQiLCJzcG90UG9zaXRpb25zIiwibW90b3JDb25uZWN0aW9uIiwic2Vuc29yQ29uZmlnXzIiLCJzZW5zb3JDb25maWdfMyIsInNlbnNvckNvbmZpZ180Iiwic2Vuc29yQ29uZmlnXzUiLCJzZW5zb3JDb25maWdfNiIsInNlbnNvckNvbmZpZ183Iiwic2Vuc29yQ29uZmlnXzgiLCJzZW5zb3JDb25maWdfOSIsInNlbnNvckNvbmZpZ18xMCIsInNlbnNvckNvbmZpZ18xMSIsInNlbnNvckNvbmZpZ18xMiIsInNlbnNvcl8yIiwic2Vuc29yQ29uZmlnXzEzIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQjs7Ozs7Ozs7Ozs7OztBQWNGLE1BQU1DLGlCQUFpQixFQUFFO0FBQ3ZCQyxvQkFBZ0IsRUFBRUMsSUFBRyxtQkFBTCxFQUEwQkMsUUFBUTtBQUNoREMsa0JBQVU7QUFDUkMsMEJBQWdCLEVBQUNDLEdBQUUsQ0FBQyxDQUFKLEVBQU9DLEdBQUUsQ0FBQyxDQUFWLEVBRFI7QUFFUkMsNkJBQW1CQyxLQUFLQyxFQUZoQjtBQUdSQyx1QkFBYUYsS0FBS0M7QUFIVixTQURzQztBQU1oREUsdUJBQWUsRUFOaUM7QUFPaERDLHlCQUFpQixJQVArQjtBQUFsQyxLQURLLEVBU2xCQyxnQkFBZ0IsRUFBRVosSUFBRyxtQkFBTCxFQUEwQkMsUUFBUTtBQUNuREMsa0JBQVU7QUFDUkMsMEJBQWdCLEVBQUNDLEdBQUUs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QUFNQyxHQUFHLENBQVQsRUFEUjtBQUVSQyw2QkFBbUIsQ0FGWDtBQUdSRyx1QkFBYUYsS0FBS0M7QUFIVixTQU51QztBQVdqREUsdUJBQWUsRUFYa0M7QUFZakRDLHlCQUFpQixJQVpnQztBQUEvQixLQXRHQyxFQUF2Qjs7QUFxSEUsU0FBT2IsY0FBUDtBQUNELENBcklEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2xpc3RvZmNvbmZpZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgLypcbkV4cGxhbmF0aW9uIG9mIHBvc3NpYmxlIGJvZHkgY29uZmlndXJhdGlvbnM6XG5Cb2R5IGlzIHN1Y2ggdGhhdCB0aGUgbG9uZ2VzdCBwYXJ0IG9mIHRoZSBib2R5IGlzIGFsb25nIHRoZSB4LWF4aXMuXG5UaGUgbG9jYWwgYXhpcyBvZiB0aGUgYm9keSBhcmUgY2VudGVyZWQgaW4gdGhlIGJvZHkgaXRzZWxmLiBLZWVwIHRoYXQgaW4gbWluZCB3aGVuIGNyZWF0aW5nIHRoZSBleWUgcG9zaXRpb24gYW5kIG9yaWVudGF0aW9uLlxuVGhlIHkgYXhpcyBpcyBwb2ludGluZyBkb3duLCB0aGUgeiBheGlzIGlzIHBvaW50aW5nIHJpZ2h0LlxuMS4gc2Vuc29yUG9zaXRpb24gaXMgZGVmaW5lZCBhcyBhbiBpbmRleCBvZiBhIDItZGltZW5zaW9uYWwgbWF0cml4IG9mIHBvc3NpYmxlIHBvc2l0aW9ucy4gRWFjaCBvZiB0aGVzZSBwb3NpdGlvbnMgZ2V0IHRyYW5zbGF0ZWQgdG8gYSBzZXQgb2YgY29vcmRpbmF0ZXMgaW4gc3BhY2UuXG5UaGUgcG9zaXRpb24gaXMgZGVmaW5lZCB3aXRoIHJlc3BlY3QgdG8gdGhlIGJvZHkuICgtMSwtMSkgaXMgdGhlIHRvcCBtb3N0IGxlZnQgcG9pbnQuICgxLC0xKSBpcyB0aGUgdG9wIG1vc3QgcmlnaHQgcG9pbnQuICgxLDEpIGlzIHRoZSBib3R0b20gbW9zdCByaWdodCBwb2ludC5cbjIuIHNlbnNvck9yaWVudGF0aW9uIGlzIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2Vuc29yIGluIHRoZSBib2R5LiAwIGNvcnJlc3BvbmRzIHRvICgwLDEsMCksIE1hdGguUEkvMiB0byAoMSwwLDApLCBNYXRoLlBJIHRvICgwLC0xLDApLCBldGMuXG4zLiBzZW5zb3JGaWVsZCBpcyB0aGUgdmlzdWFsIGZpZWxkIG9mIHRoZSBzZW5zb3IuIE1hdGguUEkgY29ycmVzcG9uZHMgdG8gYSAxODAgZGVnIHZpc3VhbCBmaWVsZCwgYXJvdW5kIHRoZSBzZW5zb3Igb3JpZW50YXRpb24gIEN1cnJlbnRseSwgdGhlcmUgd2lsbCBiZSBvbmx5IHR3byB2YWx1ZXM6IE1hdGguUEkgYW5kIDIqTWF0aC5QSVxuNC4gc3BvdFBvc2l0aW9ucyBpcyBkZWZpbmVkIHRoZSBzYW1lIHdheSBhcyBzZW5zb3JQb3NpdGlvbiwgYnV0IGFzIGFuIGFycmF5IG9mIGFsbCBzcG90cy5cblxuQSBzcG90IGluZmx1ZW5jZXMgdGhlIHNlbnNvckZpZWxkIG9mIGFuIHNlbnNvci4gSXQgZWl0aGVyIGhhbHZlcyBpdCBpZiB0aGUgc2Vuc29yRmllbGQgaXMgMipNYXRoLlBJLCBvciBpdCBiYXNpY2FsbHkgc2V0cyBpdCB0byB6ZXJvLCBpZiBpdCBpcyBwb3NpdGlvbmVkIGluIGRpcmVjdGlvbiBvZiB0aGUgc2Vuc29yIG9yaWVudGF0aW9uLlxuQW4gZW1wdHkgYXJyYXkgd2l0aGluIGEgY29uZmlndXJhdGlvbiBkZWZpbml0aW9uIG1lYW5zIHRoYXQgdGhhdCBjb3JyZXNwb25kaW5nIG9iamVjdCBkb2VzIG5vdCBleGlzdC5cbiovXG5jb25zdCBkZWZhdWx0Q29uZmlncyA9IHsgLy8gSW1hZ2VzIGFyZSBkcmF3biB3aXRoIGZyb250IHRvIHRoZSBsZWZ0LCBpLmUuIHBvc2l0aXZlIHogYXhpc1xuICBzZW5zb3JDb25maWdfMTogeyBpZDonRGlyZWN0ZWRfQmFja0xlZnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6Oi0xLCB5Oi0xfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiBNYXRoLlBJLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIHNlbnNvckNvbmZpZ18yOiB7IGlkOicxU2Vuc29yX0JhY2tSaWdodCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6LTEsIHk6MX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfMzogeyBpZDonMVNlbnNvcl9Gcm9udExlZnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6LTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IE1hdGguUEksXG4gICAgICBzZW5zb3JGaWVsZDogTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgc2Vuc29yQ29uZmlnXzQ6IHsgaWQ6JzFTZW5zb3JfRnJvbnRSaWdodCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeToxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIHNlbnNvckNvbmZpZ181OiB7IGlkOicxT21uaVNlbnNvcl9CYWNrTGVmdCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6LTEsIHk6LTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfNjogeyBpZDonMU9tbmlTZW5zb3JfQmFja1JpZ2h0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeToxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IDIqTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgc2Vuc29yQ29uZmlnXzc6IHsgaWQ6JzFPbW5pU2Vuc29yX0Zyb250TGVmdCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTotMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiAyKk1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIHNlbnNvckNvbmZpZ184OiB7IGlkOicxT21uaVNlbnNvcl9Gcm9udFJpZ2h0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OjF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfOTogeyBpZDonMU9tbmlTZW5zb3JfRnJvbnRDZW50ZXInLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6IDB9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfMTA6IHsgaWQ6JzFPbW5pU2Vuc29yX0Zyb250Q2VudGVyX1NoaWVsZF9MZWZ0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OiAwfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IDIqTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW3t6OjEsIHk6LTF9XSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfMTE6IHsgaWQ6JzFPbW5pU2Vuc29yX0Zyb250Q2VudGVyX1NoaWVsZF9SaWdodCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTogMH0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiAyKk1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFt7ejoxLCB5OjF9XSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfMTI6IHsgaWQ6JzJTZW5zb3JzX0JhY2snLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6Oi0xLCB5OiAtMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogTWF0aC5QSSxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzZW5zb3JfMjoge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6Oi0xLCB5OiAxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIHNlbnNvckNvbmZpZ18xMzogeyBpZDonMlNlbnNvcnNfRnJvbnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6IC0xfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiBNYXRoLlBJLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNlbnNvcl8yOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTogMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9fVxuXG4gIHJldHVybiBkZWZhdWx0Q29uZmlnc1xufSk7XG4iXX0=
