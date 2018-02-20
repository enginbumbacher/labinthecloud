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
    }, sensorConfig_2: { id: 'Directed_BackRight', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_3: { id: 'Directed_FrontLeft', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: Math.PI,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_4: { id: 'Directed_FrontRight', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 1 },
          sensorOrientation: 0,
          sensorField: Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_5: { id: 'Alldirections_BackLeft', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: -1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_6: { id: 'Alldirections_BackRight', config: {
        sensor_1: {
          sensorPosition: { z: -1, y: 1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_7: { id: 'Alldirections_FrontLeft', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: -1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_8: { id: 'Alldirections_FrontRight', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 1 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_9: { id: 'Alldirections_FrontCenter', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [],
        motorConnection: true }
    }, sensorConfig_10: { id: 'Alldirections_FrontCenter_Shield_Left', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [{ z: 1, y: -1 }],
        motorConnection: true }
    }, sensorConfig_11: { id: 'Alldirections_FrontCenter_Shield_Right', config: {
        sensor_1: {
          sensorPosition: { z: 1, y: 0 },
          sensorOrientation: 0,
          sensorField: 2 * Math.PI
        },
        spotPositions: [{ z: 1, y: 1 }],
        motorConnection: true }
    }, sensorConfig_12: { id: '2Directed_Back', config: {
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
    }, sensorConfig_13: { id: '2Directed_Front', config: {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2xpc3RvZmNvbmZpZ3MuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsImRlZmF1bHRDb25maWdzIiwic2Vuc29yQ29uZmlnXzEiLCJpZCIsImNvbmZpZyIsInNlbnNvcl8xIiwic2Vuc29yUG9zaXRpb24iLCJ6IiwieSIsInNlbnNvck9yaWVudGF0aW9uIiwiTWF0aCIsIlBJIiwic2Vuc29yRmllbGQiLCJzcG90UG9zaXRpb25zIiwibW90b3JDb25uZWN0aW9uIiwic2Vuc29yQ29uZmlnXzIiLCJzZW5zb3JDb25maWdfMyIsInNlbnNvckNvbmZpZ180Iiwic2Vuc29yQ29uZmlnXzUiLCJzZW5zb3JDb25maWdfNiIsInNlbnNvckNvbmZpZ183Iiwic2Vuc29yQ29uZmlnXzgiLCJzZW5zb3JDb25maWdfOSIsInNlbnNvckNvbmZpZ18xMCIsInNlbnNvckNvbmZpZ18xMSIsInNlbnNvckNvbmZpZ18xMiIsInNlbnNvcl8yIiwic2Vuc29yQ29uZmlnXzEzIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQjs7Ozs7Ozs7Ozs7OztBQWNGLE1BQU1DLGlCQUFpQixFQUFFO0FBQ3ZCQyxvQkFBZ0IsRUFBRUMsSUFBRyxtQkFBTCxFQUEwQkMsUUFBUTtBQUNoREMsa0JBQVU7QUFDUkMsMEJBQWdCLEVBQUNDLEdBQUUsQ0FBQyxDQUFKLEVBQU9DLEdBQUUsQ0FBQyxDQUFWLEVBRFI7QUFFUkMsNkJBQW1CQyxLQUFLQyxFQUZoQjtBQUdSQyx1QkFBYUYsS0FBS0M7QUFIVixTQURzQztBQU1oREUsdUJBQWUsRUFOaUM7QUFPaERDLHlCQUFpQixJQVArQjtBQUFsQyxLQURLLEVBU2xCQyxnQkFBZ0IsRUFBRVosSUFBRyxvQkFBTCxFQUEyQkMsUUFBUTtBQUNwREMsa0JBQVU7QUFDUkMsMEJBQWdCLEVBQUNDLEdBQUUsQ0FBQyxDQUFKLEVBQU9DLEdBQUUsQ0FBVCxFQURSO0FBRVJDLDZCQUFtQixDQUZYO0FBR1JHLHVCQUFhRixLQUFLQztBQUhWLFNBRDBDO0FBTXBERSx1QkFBZSxFQU5xQztBQU9wREMseUJBQWlCLElBUG1DO0FBQW5DLEtBVEUsRUFpQmxCRSxnQkFBZ0IsRUFBRWIsSUFBRyxvQkFBTCxFQUEyQkMsUUFBUTtBQUNwREMsa0JBQVU7QUFDUkMsMEJBQWdCLEVBQUNDLEdBQUUsQ0FBSCxFQUFNQyxHQUFFLENBQUMsQ0FBVCxFQURSO0FBRVJDLDZCQUFtQkMsS0FBS0MsRUFGaEI7QUFHUkMsdUJBQWFGLEtBQUtDO0FBSFYsU0FEMEM7QUFNcERFLHVCQUFlLEVBTnFDO0FBT3BEQyx5QkFBaUIsSUFQbUM7QUFBbkMsS0FqQkUsRUF5QmxCRyxnQkFBZ0IsRUFBRWQsSUFBRyxxQkFBTCxFQUE0QkMsUUFBUTtBQUNyREMsa0JBQVU7QUFDUkMsMEJBQWdCLEVBQUNDLEdBQUUsQ0FBSCxFQUFNQyxHQUFFLENBQVIsRUFEUjtBQUVSQyw2QkFBbUIsQ0FGWDtBQUdSRyx1QkFBYUYsS0FBS0M7QUFIVixTQUQyQztBQU1yREUsdUJBQWUsRUFOc0M7QUFPckRDLHlCQUFpQixJQVBvQztBQUFwQyxLQXpCRSxFQWlDbEJJLGdCQUFnQixFQUFFZixJQUFHLHdCQUFMLEVBQStCQyxRQUFRO0FBQ3hEQyxrQkFBVTtBQUNSQywwQkFBZ0IsRUFBQ0MsR0FBRSxDQUFDLENBQUosRUFBT0MsR0FBRSxDQUFDLENBQVYsRUFEUjtBQUVSQyw2QkFBbUIsQ0FGWDtBQUdSRyx1QkFBYSxJQUFFRixLQUFLQztBQUhaLFNBRDhDO0FBTXhERSx1QkFBZSxFQU55QztBQU94REMseUJBQWlCLElBUHVDO0FBQXZDLEtBakNFLEVBeUNsQkssZ0JBQWdCLEVBQUVoQixJQUFHLHlCQUFMLEVBQWdDQyxRQUFRO0FBQ3pEQyxrQkFBVTtBQUNSQywwQkFBZ0IsRUFBQ0MsR0FBRSxDQUFDLENBQUosRUFBT0MsR0FBRSxDQUFULEVBRFI7QUFFUkMsNkJBQW1CLENBRlg7QUFHUkcsdUJBQWEsSUFBRUYsS0FBS0M7QUFIWixTQUQrQztBQU16REUsdUJBQWUsRUFOMEM7QUFPekRDLHlCQUFpQixJQVB3QztBQUF4QyxLQXpDRSxFQWlEbEJNLGdCQUFnQixFQUFFakIsSUFBRyx5QkFBTCxFQUFnQ0MsUUFBUTtBQUN6REMsa0JBQVU7QUFDUkMsMEJBQWdCLEVBQUNDLEdBQUUsQ0FBSCxFQUFNQyxHQUFFLENBQUMsQ0FBVCxFQURSO0FBRVJDLDZCQUFtQixDQUZYO0FBR1JHLHVCQUFhLElBQUVGLEtBQUtDO0FBSFosU0FEK0M7QUFNekRFLHVCQUFlLEVBTjBDO0FBT3pEQyx5QkFBaUIsSUFQd0M7QUFBeEMsS0FqREUsRUF5RGxCTyxnQkFBZ0IsRUFBRWxCLElBQUcsMEJBQUwsRUFBaUNDLFFBQVE7QUFDMURDLGtCQUFVO0FBQ1JDLDBCQUFnQixFQUFDQyxHQUFFLENBQUgsRUFBTUMsR0FBRSxDQUFSLEVBRFI7QUFFUkMsNkJBQW1CLENBRlg7QUFHUkcsdUJBQWEsSUFBRUYsS0FBS0M7QUFIWixTQURnRDtBQU0xREUsdUJBQWUsRUFOMkM7QUFPMURDLHlCQUFpQixJQVB5QztBQUF6QyxLQXpERSxFQWlFbEJRLGdCQUFnQixFQUFFbkIsSUFBRywyQkFBTCxFQUFrQ0MsUUFBUTtBQUMzREMsa0JBQVU7QUFDUkMsMEJBQWdCLEVBQUNDLEdBQUUsQ0FBSCxFQUFNQyxHQUFHLENBQVQsRUFEUjtBQUVSQyw2QkFBbUIsQ0FGWDtBQUdSRyx1QkFBYSxJQUFFRixLQUFLQztBQUhaLFNBRGlEO0FBTTNERSx1QkFBZSxFQU40QztBQU8zREMseUJBQWlCLElBUDBDO0FBQTFDLEtBakVFLEVBeUVsQlMsaUJBQWlCLEVBQUVwQixJQUFHLHVDQUFMLEVBQThDQyxRQUFRO0FBQ3hFQyxrQkFBVTtBQUNSQywwQkFBZ0IsRUFBQ0MsR0FBRSxDQUFILEVBQU1DLEdBQUcsQ0FBVCxFQURSO0FBRVJDLDZCQUFtQixDQUZYO0FBR1JHLHVCQUFhLElBQUVGLEtBQUtDO0FBSFosU0FEOEQ7QUFNeEVFLHVCQUFlLENBQUMsRUFBQ04sR0FBRSxDQUFILEVBQU1DLEdBQUUsQ0FBQyxDQUFULEVBQUQsQ0FOeUQ7QUFPeEVNLHlCQUFpQixJQVB1RDtBQUF0RCxLQXpFQyxFQWlGbEJVLGlCQUFpQixFQUFFckIsSUFBRyx3Q0FBTCxFQUErQ0MsUUFBUTtBQUN6RUMsa0JBQVU7QUFDUkMsMEJBQWdCLEVBQUNDLEdBQUUsQ0FBSCxFQUFNQyxHQUFHLENBQVQsRUFEUjtBQUVSQyw2QkFBbUIsQ0FGWDtBQUdSRyx1QkFBYSxJQUFFRixLQUFLQztBQUhaLFNBRCtEO0FBTXpFRSx1QkFBZSxDQUFDLEVBQUNOLEdBQUUsQ0FBSCxFQUFNQyxHQUFFLENBQVIsRUFBRCxDQU4wRDtBQU96RU0seUJBQWlCLElBUHdEO0FBQXZELEtBakZDLEVBeUZsQlcsaUJBQWlCLEVBQUV0QixJQUFHLGdCQUFMLEVBQXVCQyxRQUFRO0FBQ2pEQyxrQkFBVTtBQUNSQywwQkFBZ0IsRUFBQ0MsR0FBRSxDQUFDLENBQUosRUFBT0MsR0FBRyxDQUFDLENBQVgsRUFEUjtBQUVSQyw2QkFBbUJDLEtBQUtDLEVBRmhCO0FBR1JDLHVCQUFhRixLQUFLQztBQUhWLFNBRHVDO0FBTWpEZSxrQkFBVTtBQUNScEIsMEJBQWdCLEVBQUNDLEdBQUUsQ0FBQyxDQUFKLEVBQU9DLEdBQUcsQ0FBVixFQURSO0FBRVJDLDZCQUFtQixDQUZYO0FBR1JHLHVCQUFhRixLQUFLQztBQUhWLFNBTnVDO0FBV2pERSx1QkFBZSxFQVhrQztBQVlqREMseUJBQWlCLElBWmdDO0FBQS9CLEtBekZDLEVBc0dsQmEsaUJBQWlCLEVBQUV4QixJQUFHLGlCQUFMLEVBQXdCQyxRQUFRO0FBQ2xEQyxrQkFBVTtBQUNSQywwQkFBZ0IsRUFBQ0MsR0FBRSxDQUFILEVBQU1DLEdBQUcsQ0FBQyxDQUFWLEVBRFI7QUFFUkMsNkJBQW1CQyxLQUFLQyxFQUZoQjtBQUdSQyx1QkFBYUYsS0FBS0M7QUFIVixTQUR3QztBQU1sRGUsa0JBQVU7QUFDUnBCLDBCQUFnQixFQUFDQyxHQUFFLENBQUgsRUFBTUMsR0FBRyxDQUFULEVBRFI7QUFFUkMsNkJBQW1CLENBRlg7QUFHUkcsdUJBQWFGLEtBQUtDO0FBSFYsU0FOd0M7QUFXbERFLHVCQUFlLEVBWG1DO0FBWWxEQyx5QkFBaUIsSUFaaUM7QUFBaEMsS0F0R0MsRUFBdkI7O0FBcUhFLFNBQU9iLGNBQVA7QUFDRCxDQXJJRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9saXN0b2Zjb25maWdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIC8qXG5FeHBsYW5hdGlvbiBvZiBwb3NzaWJsZSBib2R5IGNvbmZpZ3VyYXRpb25zOlxuQm9keSBpcyBzdWNoIHRoYXQgdGhlIGxvbmdlc3QgcGFydCBvZiB0aGUgYm9keSBpcyBhbG9uZyB0aGUgeC1heGlzLlxuVGhlIGxvY2FsIGF4aXMgb2YgdGhlIGJvZHkgYXJlIGNlbnRlcmVkIGluIHRoZSBib2R5IGl0c2VsZi4gS2VlcCB0aGF0IGluIG1pbmQgd2hlbiBjcmVhdGluZyB0aGUgZXllIHBvc2l0aW9uIGFuZCBvcmllbnRhdGlvbi5cblRoZSB5IGF4aXMgaXMgcG9pbnRpbmcgZG93biwgdGhlIHogYXhpcyBpcyBwb2ludGluZyByaWdodC5cbjEuIHNlbnNvclBvc2l0aW9uIGlzIGRlZmluZWQgYXMgYW4gaW5kZXggb2YgYSAyLWRpbWVuc2lvbmFsIG1hdHJpeCBvZiBwb3NzaWJsZSBwb3NpdGlvbnMuIEVhY2ggb2YgdGhlc2UgcG9zaXRpb25zIGdldCB0cmFuc2xhdGVkIHRvIGEgc2V0IG9mIGNvb3JkaW5hdGVzIGluIHNwYWNlLlxuVGhlIHBvc2l0aW9uIGlzIGRlZmluZWQgd2l0aCByZXNwZWN0IHRvIHRoZSBib2R5LiAoLTEsLTEpIGlzIHRoZSB0b3AgbW9zdCBsZWZ0IHBvaW50LiAoMSwtMSkgaXMgdGhlIHRvcCBtb3N0IHJpZ2h0IHBvaW50LiAoMSwxKSBpcyB0aGUgYm90dG9tIG1vc3QgcmlnaHQgcG9pbnQuXG4yLiBzZW5zb3JPcmllbnRhdGlvbiBpcyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHNlbnNvciBpbiB0aGUgYm9keS4gMCBjb3JyZXNwb25kcyB0byAoMCwxLDApLCBNYXRoLlBJLzIgdG8gKDEsMCwwKSwgTWF0aC5QSSB0byAoMCwtMSwwKSwgZXRjLlxuMy4gc2Vuc29yRmllbGQgaXMgdGhlIHZpc3VhbCBmaWVsZCBvZiB0aGUgc2Vuc29yLiBNYXRoLlBJIGNvcnJlc3BvbmRzIHRvIGEgMTgwIGRlZyB2aXN1YWwgZmllbGQsIGFyb3VuZCB0aGUgc2Vuc29yIG9yaWVudGF0aW9uICBDdXJyZW50bHksIHRoZXJlIHdpbGwgYmUgb25seSB0d28gdmFsdWVzOiBNYXRoLlBJIGFuZCAyKk1hdGguUElcbjQuIHNwb3RQb3NpdGlvbnMgaXMgZGVmaW5lZCB0aGUgc2FtZSB3YXkgYXMgc2Vuc29yUG9zaXRpb24sIGJ1dCBhcyBhbiBhcnJheSBvZiBhbGwgc3BvdHMuXG5cbkEgc3BvdCBpbmZsdWVuY2VzIHRoZSBzZW5zb3JGaWVsZCBvZiBhbiBzZW5zb3IuIEl0IGVpdGhlciBoYWx2ZXMgaXQgaWYgdGhlIHNlbnNvckZpZWxkIGlzIDIqTWF0aC5QSSwgb3IgaXQgYmFzaWNhbGx5IHNldHMgaXQgdG8gemVybywgaWYgaXQgaXMgcG9zaXRpb25lZCBpbiBkaXJlY3Rpb24gb2YgdGhlIHNlbnNvciBvcmllbnRhdGlvbi5cbkFuIGVtcHR5IGFycmF5IHdpdGhpbiBhIGNvbmZpZ3VyYXRpb24gZGVmaW5pdGlvbiBtZWFucyB0aGF0IHRoYXQgY29ycmVzcG9uZGluZyBvYmplY3QgZG9lcyBub3QgZXhpc3QuXG4qL1xuY29uc3QgZGVmYXVsdENvbmZpZ3MgPSB7IC8vIEltYWdlcyBhcmUgZHJhd24gd2l0aCBmcm9udCB0byB0aGUgbGVmdCwgaS5lLiBwb3NpdGl2ZSB6IGF4aXNcbiAgc2Vuc29yQ29uZmlnXzE6IHsgaWQ6J0RpcmVjdGVkX0JhY2tMZWZ0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeTotMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogTWF0aC5QSSxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfMjogeyBpZDonRGlyZWN0ZWRfQmFja1JpZ2h0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeToxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIHNlbnNvckNvbmZpZ18zOiB7IGlkOidEaXJlY3RlZF9Gcm9udExlZnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6LTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IE1hdGguUEksXG4gICAgICBzZW5zb3JGaWVsZDogTWF0aC5QSVxuICAgIH0sXG4gICAgc3BvdFBvc2l0aW9uczogW10sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgc2Vuc29yQ29uZmlnXzQ6IHsgaWQ6J0RpcmVjdGVkX0Zyb250UmlnaHQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6MX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfNTogeyBpZDonQWxsZGlyZWN0aW9uc19CYWNrTGVmdCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6LTEsIHk6LTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfNjogeyBpZDonQWxsZGlyZWN0aW9uc19CYWNrUmlnaHQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6Oi0xLCB5OjF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfNzogeyBpZDonQWxsZGlyZWN0aW9uc19Gcm9udExlZnQnLCBjb25maWc6IHtcbiAgICBzZW5zb3JfMToge1xuICAgICAgc2Vuc29yUG9zaXRpb246IHt6OjEsIHk6LTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfODogeyBpZDonQWxsZGlyZWN0aW9uc19Gcm9udFJpZ2h0JywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OjF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IDAsXG4gICAgICBzZW5zb3JGaWVsZDogMipNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfOTogeyBpZDonQWxsZGlyZWN0aW9uc19Gcm9udENlbnRlcicsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTogMH0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiAyKk1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH0sIHNlbnNvckNvbmZpZ18xMDogeyBpZDonQWxsZGlyZWN0aW9uc19Gcm9udENlbnRlcl9TaGllbGRfTGVmdCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTogMH0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiAyKk1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFt7ejoxLCB5Oi0xfV0sXG4gICAgbW90b3JDb25uZWN0aW9uOiB0cnVlIH1cbiAgfSwgc2Vuc29yQ29uZmlnXzExOiB7IGlkOidBbGxkaXJlY3Rpb25zX0Zyb250Q2VudGVyX1NoaWVsZF9SaWdodCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTogMH0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiAyKk1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFt7ejoxLCB5OjF9XSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfMTI6IHsgaWQ6JzJEaXJlY3RlZF9CYWNrJywgY29uZmlnOiB7XG4gICAgc2Vuc29yXzE6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeTogLTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IE1hdGguUEksXG4gICAgICBzZW5zb3JGaWVsZDogTWF0aC5QSVxuICAgIH0sXG4gICAgc2Vuc29yXzI6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejotMSwgeTogMX0sXG4gICAgICBzZW5zb3JPcmllbnRhdGlvbjogMCxcbiAgICAgIHNlbnNvckZpZWxkOiBNYXRoLlBJXG4gICAgfSxcbiAgICBzcG90UG9zaXRpb25zOiBbXSxcbiAgICBtb3RvckNvbm5lY3Rpb246IHRydWUgfVxuICB9LCBzZW5zb3JDb25maWdfMTM6IHsgaWQ6JzJEaXJlY3RlZF9Gcm9udCcsIGNvbmZpZzoge1xuICAgIHNlbnNvcl8xOiB7XG4gICAgICBzZW5zb3JQb3NpdGlvbjoge3o6MSwgeTogLTF9LFxuICAgICAgc2Vuc29yT3JpZW50YXRpb246IE1hdGguUEksXG4gICAgICBzZW5zb3JGaWVsZDogTWF0aC5QSVxuICAgIH0sXG4gICAgc2Vuc29yXzI6IHtcbiAgICAgIHNlbnNvclBvc2l0aW9uOiB7ejoxLCB5OiAxfSxcbiAgICAgIHNlbnNvck9yaWVudGF0aW9uOiAwLFxuICAgICAgc2Vuc29yRmllbGQ6IE1hdGguUElcbiAgICB9LFxuICAgIHNwb3RQb3NpdGlvbnM6IFtdLFxuICAgIG1vdG9yQ29ubmVjdGlvbjogdHJ1ZSB9XG4gIH19XG5cbiAgcmV0dXJuIGRlZmF1bHRDb25maWdzXG59KTtcbiJdfQ==
