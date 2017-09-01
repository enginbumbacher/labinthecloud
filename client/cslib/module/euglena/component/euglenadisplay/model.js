'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      Euglena = require('./euglena/euglena'),
      defaults = {
    euglena: [],
    bounds: {
      width: 640,
      height: 480
    },
    magnification: 1,
    camera: {
      height: 500,
      near: 0.1,
      far: 1000
    }
  };

  return function (_Model) {
    _inherits(EuglenaDisplayModel, _Model);

    function EuglenaDisplayModel(config) {
      _classCallCheck(this, EuglenaDisplayModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (EuglenaDisplayModel.__proto__ || Object.getPrototypeOf(EuglenaDisplayModel)).call(this, config));
    }

    _createClass(EuglenaDisplayModel, [{
      key: 'setTrackData',
      value: function setTrackData(tracks, model, color) {
        this.set('tracks', tracks);
        var euglena = [];
        tracks.forEach(function (track) {
          var e = Euglena.create({ track: track, config: model, color: color });
          e.setInitialPosition({
            x: 0,
            y: 0,
            z: 0
          });
          euglena.push(e);
        });
        this.set('euglena', euglena);
      }
    }, {
      key: 'setMagnification',
      value: function setMagnification(mag) {
        this.set('magnification', mag);
      }
    }]);

    return EuglenaDisplayModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsIkV1Z2xlbmEiLCJkZWZhdWx0cyIsImV1Z2xlbmEiLCJib3VuZHMiLCJ3aWR0aCIsImhlaWdodCIsIm1hZ25pZmljYXRpb24iLCJjYW1lcmEiLCJuZWFyIiwiZmFyIiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiLCJ0cmFja3MiLCJtb2RlbCIsImNvbG9yIiwic2V0IiwiZm9yRWFjaCIsInRyYWNrIiwiZSIsImNyZWF0ZSIsInNldEluaXRpYWxQb3NpdGlvbiIsIngiLCJ5IiwieiIsInB1c2giLCJtYWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsVUFBVUgsUUFBUSxtQkFBUixDQUZaO0FBQUEsTUFJRUksV0FBVztBQUNUQyxhQUFTLEVBREE7QUFFVEMsWUFBUTtBQUNOQyxhQUFPLEdBREQ7QUFFTkMsY0FBUTtBQUZGLEtBRkM7QUFNVEMsbUJBQWUsQ0FOTjtBQU9UQyxZQUFRO0FBQ05GLGNBQVEsR0FERjtBQUVORyxZQUFNLEdBRkE7QUFHTkMsV0FBSztBQUhDO0FBUEMsR0FKYjs7QUFtQkE7QUFBQTs7QUFDRSxpQ0FBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT1QsUUFBUCxHQUFrQkYsTUFBTVksY0FBTixDQUFxQkQsT0FBT1QsUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBRGtCLHVJQUVaUyxNQUZZO0FBR25COztBQUpIO0FBQUE7QUFBQSxtQ0FNZUUsTUFOZixFQU11QkMsS0FOdkIsRUFNOEJDLEtBTjlCLEVBTXFDO0FBQ2pDLGFBQUtDLEdBQUwsQ0FBUyxRQUFULEVBQW1CSCxNQUFuQjtBQUNBLFlBQUlWLFVBQVUsRUFBZDtBQUNBVSxlQUFPSSxPQUFQLENBQWUsVUFBQ0MsS0FBRCxFQUFXO0FBQ3hCLGNBQUlDLElBQUlsQixRQUFRbUIsTUFBUixDQUFlLEVBQUVGLE9BQU9BLEtBQVQsRUFBZ0JQLFFBQVFHLEtBQXhCLEVBQStCQyxPQUFPQSxLQUF0QyxFQUFmLENBQVI7QUFDQUksWUFBRUUsa0JBQUYsQ0FBcUI7QUFDbkJDLGVBQUcsQ0FEZ0I7QUFFbkJDLGVBQUcsQ0FGZ0I7QUFHbkJDLGVBQUc7QUFIZ0IsV0FBckI7QUFLQXJCLGtCQUFRc0IsSUFBUixDQUFhTixDQUFiO0FBQ0QsU0FSRDtBQVNBLGFBQUtILEdBQUwsQ0FBUyxTQUFULEVBQW9CYixPQUFwQjtBQUNEO0FBbkJIO0FBQUE7QUFBQSx1Q0FxQm1CdUIsR0FyQm5CLEVBcUJ3QjtBQUNwQixhQUFLVixHQUFMLENBQVMsZUFBVCxFQUEwQlUsR0FBMUI7QUFDRDtBQXZCSDs7QUFBQTtBQUFBLElBQXlDM0IsS0FBekM7QUF5QkQsQ0E3Q0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgRXVnbGVuYSA9IHJlcXVpcmUoJy4vZXVnbGVuYS9ldWdsZW5hJyksXG5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIGV1Z2xlbmE6IFtdLFxuICAgICAgYm91bmRzOiB7XG4gICAgICAgIHdpZHRoOiA2NDAsXG4gICAgICAgIGhlaWdodDogNDgwXG4gICAgICB9LFxuICAgICAgbWFnbmlmaWNhdGlvbjogMSxcbiAgICAgIGNhbWVyYToge1xuICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgICAgbmVhcjogMC4xLFxuICAgICAgICBmYXI6IDEwMDBcbiAgICAgIH1cbiAgICB9XG4gIDtcblxuICByZXR1cm4gY2xhc3MgRXVnbGVuYURpc3BsYXlNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG5cbiAgICBzZXRUcmFja0RhdGEodHJhY2tzLCBtb2RlbCwgY29sb3IpIHtcbiAgICAgIHRoaXMuc2V0KCd0cmFja3MnLCB0cmFja3MpO1xuICAgICAgbGV0IGV1Z2xlbmEgPSBbXTtcbiAgICAgIHRyYWNrcy5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICBsZXQgZSA9IEV1Z2xlbmEuY3JlYXRlKHsgdHJhY2s6IHRyYWNrLCBjb25maWc6IG1vZGVsLCBjb2xvcjogY29sb3IgfSk7XG4gICAgICAgIGUuc2V0SW5pdGlhbFBvc2l0aW9uKHtcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgejogMFxuICAgICAgICB9KTtcbiAgICAgICAgZXVnbGVuYS5wdXNoKGUpO1xuICAgICAgfSlcbiAgICAgIHRoaXMuc2V0KCdldWdsZW5hJywgZXVnbGVuYSk7XG4gICAgfVxuXG4gICAgc2V0TWFnbmlmaWNhdGlvbihtYWcpIHtcbiAgICAgIHRoaXMuc2V0KCdtYWduaWZpY2F0aW9uJywgbWFnKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
