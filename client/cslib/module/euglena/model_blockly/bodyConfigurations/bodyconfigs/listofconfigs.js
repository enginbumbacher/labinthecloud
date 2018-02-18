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
    configuration_1: { id: 'Directed_BackLeft', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_2: { id: 'Directed_BackRight', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_3: { id: 'Directed_FrontLeft', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_4: { id: 'Directed_FrontRight', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_5: { id: 'Alldirections_BackLeft', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: -1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_6: { id: 'Alldirections_BackRight', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: 1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_7: { id: 'Alldirections_FrontLeft', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_8: { id: 'Alldirections_FrontRight', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_9: { id: 'Alldirections_FrontCenter', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, configuration_10: { id: 'Alldirections_Front_Shield_Left', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [{ z: 1, y: -1 }],
        motorConnection: true }
    }, configuration_11: { id: 'Alldirections_Front_Shield_Right', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [{ z: 1, y: 1 }],
        motorConnection: true }
    }, configuration_12: { id: '2_Directed_Back', config: {
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
    }, configuration_13: { id: '2_Directed_Front', config: {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2xpc3RvZmNvbmZpZ3MuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsImRlZmF1bHRDb25maWdzIiwiY29uZmlndXJhdGlvbl8xIiwiaWQiLCJjb25maWciLCJzZW5zb3JfMSIsInNlbnNvclBvc2l0aW9uIiwieiIsInkiLCJzZW5zb3JPcmllbnRhdGlvbiIsIk1hdGgiLCJQSSIsInNlbnNvckZpZWxkIiwic3BvdFBvc2l0aW9ucyIsIm1vdG9yQ29ubmVjdGlvbiIsImNvbmZpZ3VyYXRpb25fMiIsImNvbmZpZ3VyYXRpb25fMyIsImNvbmZpZ3VyYXRpb25fNCIsImNvbmZpZ3VyYXRpb25fNSIsImNvbmZpZ3VyYXRpb25fNiIsImNvbmZpZ3VyYXRpb25fNyIsImNvbmZpZ3VyYXRpb25fOCIsImNvbmZpZ3VyYXRpb25fOSIsImNvbmZpZ3VyYXRpb25fMTAiLCJjb25maWd1cmF0aW9uXzExIiwiY29uZmlndXJhdGlvbl8xMiIsInNlbnNvcl8yIiwiY29uZmlndXJhdGlvbl8xMyJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEI7Ozs7Ozs7Ozs7Ozs7QUFjRixNQUFNQyxpQkFBaUIsRUFBRTtBQUN2QkMscUJBQWlCLEVBQUVDLElBQUcsbUJBQUwsRUFBMEJDLFFBQVE7QUFDakRDLGtCQUFVO0FBQ1JDLDBCQUFnQixFQUFDQyxHQUFFLENBQUMsQ0FBSixFQUFPQyxHQUFFLENBQUMsQ0FBVixFQURSO0FBRVJDLDZCQUFtQkMsS0FBS0MsRUFGaEI7QUFHUkMsdUJBQWFGLEtBQUtDO0FBSFYsU0FEdUM7QUFNakRFLHVCQUFlLEVBTmtDO0FBT2pEQyx5QkFBaUIsSUFQZ0M7QUFBbEMsS0FESSxFQVNsQkMsaUJBQWlCLEVBQUVaLElBQUcsb0JBQUwsRUFBMkJDLFFBQVE7QUFDckRDLGtCQUFVO0FBQ1JDLDBCQUFn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Q0MsR0FBRSxDQUFILEVBQU1DLEdBQUcsQ0FBVCxFQURSO0FBRVJDLDZCQUFtQixDQUZYO0FBR1JHLHVCQUFhRixLQUFLQztBQUhWLFNBTjBDO0FBV3BERSx1QkFBZSxFQVhxQztBQVlwREMseUJBQWlCLElBWm1DO0FBQWpDLEtBdEdBLEVBQXZCOztBQXFIRSxTQUFPYixjQUFQO0FBQ0QsQ0FySUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvbGlzdG9mY29uZmlncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICAvKlxuRXhwbGFuYXRpb24gb2YgcG9zc2libGUgYm9keSBjb25maWd1cmF0aW9uczpcbkJvZHkgaXMgc3VjaCB0aGF0IHRoZSBsb25nZXN0IHBhcnQgb2YgdGhlIGJvZHkgaXMgYWxvbmcgdGhlIHgtYXhpcy5cblRoZSBsb2NhbCBheGlzIG9mIHRoZSBib2R5IGFyZSBjZW50ZXJlZCBpbiB0aGUgYm9keSBpdHNlbGYuIEtlZXAgdGhhdCBpbiBtaW5kIHdoZW4gY3JlYXRpbmcgdGhlIGV5ZSBwb3NpdGlvbiBhbmQgb3JpZW50YXRpb24uXG5UaGUgeSBheGlzIGlzIHBvaW50aW5nIGRvd24sIHRoZSB6IGF4aXMgaXMgcG9pbnRpbmcgcmlnaHQuXG4xLiBzZW5zb3JQb3NpdGlvbiBpcyBkZWZpbmVkIGFzIGFuIGluZGV4IG9mIGEgMi1kaW1lbnNpb25hbCBtYXRyaXggb2YgcG9zc2libGUgcG9zaXRpb25zLiBFYWNoIG9mIHRoZXNlIHBvc2l0aW9ucyBnZXQgdHJhbnNsYXRlZCB0byBhIHNldCBvZiBjb29yZGluYXRlcyBpbiBzcGFjZS5cblRoZSBwb3NpdGlvbiBpcyBkZWZpbmVkIHdpdGggcmVzcGVjdCB0byB0aGUgYm9keS4gKC0xLC0xKSBpcyB0aGUgdG9wIG1vc3QgbGVmdCBwb2ludC4gKDEsLTEpIGlzIHRoZSB0b3AgbW9zdCByaWdodCBwb2ludC4gKDEsMSkgaXMgdGhlIGJvdHRvbSBtb3N0IHJpZ2h0IHBvaW50LlxuMi4gc2Vuc29yT3JpZW50YXRpb24gaXMgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzZW5zb3IgaW4gdGhlIGJvZHkuIDAgY29ycmVzcG9uZHMgdG8gKDAsMSwwKSwgTWF0aC5QSS8yIHRvICgxLDAsMCksIE1hdGguUEkgdG8gKDAsLTEsMCksIGV0Yy5cbjMuIHNlbnNvckZpZWxkIGlzIHRoZSB2aXN1YWwgZmllbGQgb2YgdGhlIHNlbnNvci4gTWF0aC5QSSBjb3JyZXNwb25kcyB0byBhIDE4MCBkZWcgdmlzdWFsIGZpZWxkLCBhcm91bmQgdGhlIHNlbnNvciBvcmllbnRhdGlvbiAgQ3VycmVudGx5LCB0aGVyZSB3aWxsIGJlIG9ubHkgdHdvIHZhbHVlczogTWF0aC5QSSBhbmQgMipNYXRoLlBJXG40LiBzcG90UG9zaXRpb25zIGlzIGRlZmluZWQgdGhlIHNhbWUgd2F5IGFzIHNlbnNvclBvc2l0aW9uLCBidXQgYXMgYW4gYXJyYXkgb2YgYWxsIHNwb3RzLlxuXG5BIHNwb3QgaW5mbHVlbmNlcyB0aGUgc2Vuc29yRmllbGQgb2YgYW4gc2Vuc29yLiBJdCBlaXRoZXIgaGFsdmVzIGl0IGlmIHRoZSBzZW5zb3JGaWVsZCBpcyAyKk1hdGguUEksIG9yIGl0IGJhc2ljYWxseSBzZXRzIGl0IHRvIHplcm8sIGlmIGl0IGlzIHBvc2l0aW9uZWQgaW4gZGlyZWN0aW9uIG9mIHRoZSBzZW5zb3Igb3JpZW50YXRpb24uXG5BbiBlbXB0eSBhcnJheSB3aXRoaW4gYSBjb25maWd1cmF0aW9uIGRlZmluaXRpb24gbWVhbnMgdGhhdCB0aGF0IGNvcnJlc3BvbmRpbmcgb2JqZWN0IGRvZXMgbm90IGV4aXN0LlxuKi9cbmNvbnN0IGRlZmF1bHRDb25maWdzID0geyAvLyBJbWFnZXMgYXJlIGRyYXduIHdpdGggZnJvbnQgdG8gdGhlIGxlZnQsIGkuZS4gcG9zaXRpdmUgeiBheGlzXG4gIGNvbmZpZ3VyYXRpb25fMTogeyBpZDonRGlyZWN0ZWRfQmFja0xlZnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6Oi0xLCB5Oi0xfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiBNYXRoLlBJLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIGNvbmZpZ3VyYXRpb25fMjogeyBpZDonRGlyZWN0ZWRfQmFja1JpZ2h0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeToxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIGNvbmZpZ3VyYXRpb25fMzogeyBpZDonRGlyZWN0ZWRfRnJvbnRMZWZ0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5Oi0xfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiBNYXRoLlBJLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIGNvbmZpZ3VyYXRpb25fNDogeyBpZDonRGlyZWN0ZWRfRnJvbnRSaWdodCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeToxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIGNvbmZpZ3VyYXRpb25fNTogeyBpZDonQWxsZGlyZWN0aW9uc19CYWNrTGVmdCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6LTEsIHk6LTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzY6IHsgaWQ6J0FsbGRpcmVjdGlvbnNfQmFja1JpZ2h0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeToxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IDIqTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgY29uZmlndXJhdGlvbl83OiB7IGlkOidBbGxkaXJlY3Rpb25zX0Zyb250TGVmdCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTotMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiAyKk1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIGNvbmZpZ3VyYXRpb25fODogeyBpZDonQWxsZGlyZWN0aW9uc19Gcm9udFJpZ2h0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OjF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzk6IHsgaWQ6J0FsbGRpcmVjdGlvbnNfRnJvbnRDZW50ZXInLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6IDB9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzEwOiB7IGlkOidBbGxkaXJlY3Rpb25zX0Zyb250X1NoaWVsZF9MZWZ0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OiAwfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IDIqTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW3t6OjEsIHk6LTF9XSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzExOiB7IGlkOidBbGxkaXJlY3Rpb25zX0Zyb250X1NoaWVsZF9SaWdodCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTogMH0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiAyKk1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFt7ejoxLCB5OjF9XSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBjb25maWd1cmF0aW9uXzEyOiB7IGlkOicyX0RpcmVjdGVkX0JhY2snLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6Oi0xLCB5OiAtMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogTWF0aC5QSSxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzZW5zb3JfMjoge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6Oi0xLCB5OiAxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIGNvbmZpZ3VyYXRpb25fMTM6IHsgaWQ6JzJfRGlyZWN0ZWRfRnJvbnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6IC0xfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiBNYXRoLlBJLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNlbnNvcl8yOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTogMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9fVxuXG4gIHJldHVybiBkZWZhdWx0Q29uZmlnc1xufSk7XG4iXX0=
