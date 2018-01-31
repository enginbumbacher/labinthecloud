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
    configuration_1: { id: '1DirSensorLeftBack', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_2: { id: '1DirSensorLeftFront', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_3: { id: '1DirSensorLeftFrontNoConnection', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: false }
    }, configuration_4: { id: '1DirSensorMidFront', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_5: { id: '1DirSensorRightBack', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_6: { id: '1DirSensorRightFront', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_7: { id: '1UniSensorLeftBack', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: -1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_8: { id: '1UniSensorLeftFront', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_9: { id: '1UniSensorMidFront', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_10: { id: '1UniSensorRightBack', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: 1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_11: { id: '1UniSensorRightFront', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_12: { id: '1UniSensorMidFrontSpotLeft', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [{ z: 1, y: -1 }],
        motorConnection: true }
    }, configuration_13: { id: '1UniSensorMidFrontSpotRight', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [{ z: 1, y: 1 }],
        motorConnection: true }
    }, configuration_14: { id: '2DirSensorsBack', config: {
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
    }, configuration_15: { id: '2DirSensorsFront', config: {
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
    }, configuration_16: { id: '2DirSensorsFrontNoConnection', config: {
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
        motorConnection: false }
    } };

  return defaultConfigs;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2xpc3RvZmNvbmZpZ3MuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsImRlZmF1bHRDb25maWdzIiwiY29uZmlndXJhdGlvbl8xIiwiaWQiLCJjb25maWciLCJzZW5zb3JfMSIsInNlbnNvclBvc2l0aW9uIiwieiIsInkiLCJzZW5zb3JPcmllbnRhdGlvbiIsIk1hdGgiLCJQSSIsInNlbnNvckZpZWxkIiwic3BvdFBvc2l0aW9ucyIsIm1vdG9yQ29ubmVjdGlvbiIsImNvbmZpZ3VyYXRpb25fMiIsImNvbmZpZ3VyYXRpb25fMyIsImNvbmZpZ3VyYXRpb25fNCIsImNvbmZpZ3VyYXRpb25fNSIsImNvbmZpZ3VyYXRpb25fNiIsImNvbmZpZ3VyYXRpb25fNyIsImNvbmZpZ3VyYXRpb25fOCIsImNvbmZpZ3VyYXRpb25fOSIsImNvbmZpZ3VyYXRpb25fMTAiLCJjb25maWd1cmF0aW9uXzExIiwiY29uZmlndXJhdGlvbl8xMiIsImNvbmZpZ3VyYXRpb25fMTMiLCJjb25maWd1cmF0aW9uXzE0Iiwic2Vuc29yXzIiLCJjb25maWd1cmF0aW9uXzE1IiwiY29uZmlndXJhdGlvbl8xNiJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEI7Ozs7Ozs7Ozs7Ozs7QUFjRixNQUFNQyxpQkFBaUIsRUFBRTtBQUN2QkMscUJBQWlCLEVBQUVDLElBQUcsb0JBQUwsRUFBMkJDLFFBQVE7QUFDbERDLGtCQUFVO0FBQ1JDLDBCQUFnQixFQUFDQyxHQUFFLENBQUMsQ0FBSixFQUFPQyxHQUFFLENBQUMsQ0FBVixFQURSO0FBRVJDLDZCQUFtQkMsS0FBS0MsRUFGaEI7QUFHUkMsdUJBQWFGLEtBQUtDO0FBSFYsU0FEd0M7QUFNbERFLHVCQUFlLEVBTm1DO0FBT2xEQyx5QkFBaUIsSUFQaUM7QUFBbkMsS0FESSxFQVNsQkMsaUJB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QUhWLFNBTnNEO0FBV2hFRSx1QkFBZSxFQVhpRDtBQVloRUMseUJBQWlCLEtBWitDO0FBQTdDLEtBbklBLEVBQXZCOztBQWtKRSxTQUFPYixjQUFQO0FBQ0QsQ0FsS0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvbGlzdG9mY29uZmlncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICAvKlxuRXhwbGFuYXRpb24gb2YgcG9zc2libGUgYm9keSBjb25maWd1cmF0aW9uczpcbkJvZHkgaXMgc3VjaCB0aGF0IHRoZSBsb25nZXN0IHBhcnQgb2YgdGhlIGJvZHkgaXMgYWxvbmcgdGhlIHgtYXhpcy5cblRoZSBsb2NhbCBheGlzIG9mIHRoZSBib2R5IGFyZSBjZW50ZXJlZCBpbiB0aGUgYm9keSBpdHNlbGYuIEtlZXAgdGhhdCBpbiBtaW5kIHdoZW4gY3JlYXRpbmcgdGhlIGV5ZSBwb3NpdGlvbiBhbmQgb3JpZW50YXRpb24uXG5UaGUgeSBheGlzIGlzIHBvaW50aW5nIGRvd24sIHRoZSB6IGF4aXMgaXMgcG9pbnRpbmcgcmlnaHQuXG4xLiBzZW5zb3JQb3NpdGlvbiBpcyBkZWZpbmVkIGFzIGFuIGluZGV4IG9mIGEgMi1kaW1lbnNpb25hbCBtYXRyaXggb2YgcG9zc2libGUgcG9zaXRpb25zLiBFYWNoIG9mIHRoZXNlIHBvc2l0aW9ucyBnZXQgdHJhbnNsYXRlZCB0byBhIHNldCBvZiBjb29yZGluYXRlcyBpbiBzcGFjZS5cblRoZSBwb3NpdGlvbiBpcyBkZWZpbmVkIHdpdGggcmVzcGVjdCB0byB0aGUgYm9keS4gKC0xLC0xKSBpcyB0aGUgdG9wIG1vc3QgbGVmdCBwb2ludC4gKDEsLTEpIGlzIHRoZSB0b3AgbW9zdCByaWdodCBwb2ludC4gKDEsMSkgaXMgdGhlIGJvdHRvbSBtb3N0IHJpZ2h0IHBvaW50LlxuMi4gc2Vuc29yT3JpZW50YXRpb24gaXMgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzZW5zb3IgaW4gdGhlIGJvZHkuIDAgY29ycmVzcG9uZHMgdG8gKDAsMSwwKSwgTWF0aC5QSS8yIHRvICgxLDAsMCksIE1hdGguUEkgdG8gKDAsLTEsMCksIGV0Yy5cbjMuIHNlbnNvckZpZWxkIGlzIHRoZSB2aXN1YWwgZmllbGQgb2YgdGhlIHNlbnNvci4gTWF0aC5QSSBjb3JyZXNwb25kcyB0byBhIDE4MCBkZWcgdmlzdWFsIGZpZWxkLCBhcm91bmQgdGhlIHNlbnNvciBvcmllbnRhdGlvbiAgQ3VycmVudGx5LCB0aGVyZSB3aWxsIGJlIG9ubHkgdHdvIHZhbHVlczogTWF0aC5QSSBhbmQgMipNYXRoLlBJXG40LiBzcG90UG9zaXRpb25zIGlzIGRlZmluZWQgdGhlIHNhbWUgd2F5IGFzIHNlbnNvclBvc2l0aW9uLCBidXQgYXMgYW4gYXJyYXkgb2YgYWxsIHNwb3RzLlxuXG5BIHNwb3QgaW5mbHVlbmNlcyB0aGUgc2Vuc29yRmllbGQgb2YgYW4gc2Vuc29yLiBJdCBlaXRoZXIgaGFsdmVzIGl0IGlmIHRoZSBzZW5zb3JGaWVsZCBpcyAyKk1hdGguUEksIG9yIGl0IGJhc2ljYWxseSBzZXRzIGl0IHRvIHplcm8sIGlmIGl0IGlzIHBvc2l0aW9uZWQgaW4gZGlyZWN0aW9uIG9mIHRoZSBzZW5zb3Igb3JpZW50YXRpb24uXG5BbiBlbXB0eSBhcnJheSB3aXRoaW4gYSBjb25maWd1cmF0aW9uIGRlZmluaXRpb24gbWVhbnMgdGhhdCB0aGF0IGNvcnJlc3BvbmRpbmcgb2JqZWN0IGRvZXMgbm90IGV4aXN0LlxuKi9cbmNvbnN0IGRlZmF1bHRDb25maWdzID0geyAvLyBJbWFnZXMgYXJlIGRyYXduIHdpdGggZnJvbnQgdG8gdGhlIGxlZnQsIGkuZS4gcG9zaXRpdmUgeiBheGlzXG4gIGNvbmZpZ3VyYXRpb25fMTogeyBpZDonMURpclNlbnNvckxlZnRCYWNrJywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeTotMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogTWF0aC5QSSxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzI6IHsgaWQ6JzFEaXJTZW5zb3JMZWZ0RnJvbnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6LTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IE1hdGguUEksXG4gICAgICBzZW5zb3JGaWVsZDogTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgY29uZmlndXJhdGlvbl8zOiB7IGlkOicxRGlyU2Vuc29yTGVmdEZyb250Tm9Db25uZWN0aW9uJywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5Oi0xfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiBNYXRoLlBJLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogZmFsc2UgfVxuICB9LCBjb25maWd1cmF0aW9uXzQ6IHsgaWQ6JzFEaXJTZW5zb3JNaWRGcm9udCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTowfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiBNYXRoLlBJLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIGNvbmZpZ3VyYXRpb25fNTogeyBpZDonMURpclNlbnNvclJpZ2h0QmFjaycsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6LTEsIHk6MX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzY6IHsgaWQ6JzFEaXJTZW5zb3JSaWdodEZyb250JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OjF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgY29uZmlndXJhdGlvbl83OiB7IGlkOicxVW5pU2Vuc29yTGVmdEJhY2snLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6Oi0xLCB5Oi0xfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IDIqTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgY29uZmlndXJhdGlvbl84OiB7IGlkOicxVW5pU2Vuc29yTGVmdEZyb250JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5Oi0xfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IDIqTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgY29uZmlndXJhdGlvbl85OiB7IGlkOicxVW5pU2Vuc29yTWlkRnJvbnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6IDB9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzEwOiB7IGlkOicxVW5pU2Vuc29yUmlnaHRCYWNrJywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeToxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IDIqTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgY29uZmlndXJhdGlvbl8xMTogeyBpZDonMVVuaVNlbnNvclJpZ2h0RnJvbnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6MX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiAyKk1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIGNvbmZpZ3VyYXRpb25fMTI6IHsgaWQ6JzFVbmlTZW5zb3JNaWRGcm9udFNwb3RMZWZ0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OiAwfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IDIqTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW3t6OjEsIHk6LTF9XSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzEzOiB7IGlkOicxVW5pU2Vuc29yTWlkRnJvbnRTcG90UmlnaHQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6IDB9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbe3o6MSwgeToxfV0sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgY29uZmlndXJhdGlvbl8xNDogeyBpZDonMkRpclNlbnNvcnNCYWNrJywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeTogLTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IE1hdGguUEksXG4gICAgICBzZW5zb3JGaWVsZDogTWF0aC5QSVxuICAgIH0sXG4gICAgc2Vuc29yXzI6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeTogMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzE1OiB7IGlkOicyRGlyU2Vuc29yc0Zyb250JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OiAtMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogTWF0aC5QSSxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzZW5zb3JfMjoge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6IDF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgY29uZmlndXJhdGlvbl8xNjogeyBpZDonMkRpclNlbnNvcnNGcm9udE5vQ29ubmVjdGlvbicsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTogLTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IE1hdGguUEksXG4gICAgICBzZW5zb3JGaWVsZDogTWF0aC5QSVxuICAgIH0sXG4gICAgc2Vuc29yXzI6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OiAxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogZmFsc2UgfVxuICB9fVxuXG4gIHJldHVybiBkZWZhdWx0Q29uZmlnc1xufSk7XG4iXX0=
