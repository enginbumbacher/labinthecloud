'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Model = require('core/model/model'),
      defaults = {
    track: null,
    initialPosition: {
      x: 0,
      y: 0,
      z: 0
    },
    color: 0x2222ff
  };

  return function (_Model) {
    _inherits(EuglenaModel, _Model);

    function EuglenaModel(config) {
      _classCallCheck(this, EuglenaModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (EuglenaModel.__proto__ || Object.getPrototypeOf(EuglenaModel)).call(this, config));
    }

    _createClass(EuglenaModel, [{
      key: 'setInitialPosition',
      value: function setInitialPosition(pos) {
        this.set('initialPosition', pos);
      }
    }, {
      key: 'getState',
      value: function getState(time, bounds) {
        var sample = void 0,
            next = void 0;
        for (var i = 0; i < this.get('track').samples.length; i++) {
          sample = this.get('track').samples[i];
          next = this.get('track').samples.length == i + 1 ? null : this.get('track').samples[i + 1];
          if (next && next.time < time) {
            continue;
          } else {
            break;
          }
        }
        if (next == null) {
          sample = this.get('track').samples[0];
          return {
            position: {
              x: Utils.posMod(sample.x + this.get('initialPosition').x + bounds.width / 2, bounds.width) - bounds.width / 2,
              y: Utils.posMod(sample.y + this.get('initialPosition').y + bounds.height / 2, bounds.height) - bounds.width / 2,
              z: this.get('initialPosition').z
            },
            yaw: sample.yaw,
            roll: sample.roll,
            pitch: sample.pitch
          };
        }
        var delta = (time - sample.time) / (next.time - sample.time);
        return {
          position: {
            x: Utils.posMod(sample.x + (next.x - sample.x) * delta + this.get('initialPosition').x + bounds.width / 2, bounds.width) - bounds.width / 2,
            y: Utils.posMod(sample.y + (next.y - sample.y) * delta + this.get('initialPosition').y + bounds.height / 2, bounds.height) - bounds.height / 2,
            z: this.get('initialPosition').z
          },
          yaw: this._lesserArcEase(sample.yaw, next.yaw, delta),
          roll: this._lesserArcEase(sample.roll, next.roll, delta),
          pitch: this._lesserArcEase(sample.pitch, next.pitch, delta)
        };
      }
    }, {
      key: '_lesserArcEase',
      value: function _lesserArcEase(start, end, delta) {
        var lesserArc = end - start;
        if (Math.abs(lesserArc) > Math.PI) {
          lesserArc = Math.sign(lesserArc) * -1 * (Utils.TAU - Math.abs(lesserArc));
        }
        return start + lesserArc * delta;
      }
    }]);

    return EuglenaModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZGVsIiwiZGVmYXVsdHMiLCJ0cmFjayIsImluaXRpYWxQb3NpdGlvbiIsIngiLCJ5IiwieiIsImNvbG9yIiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiLCJwb3MiLCJzZXQiLCJ0aW1lIiwiYm91bmRzIiwic2FtcGxlIiwibmV4dCIsImkiLCJnZXQiLCJzYW1wbGVzIiwibGVuZ3RoIiwicG9zaXRpb24iLCJwb3NNb2QiLCJ3aWR0aCIsImhlaWdodCIsInlhdyIsInJvbGwiLCJwaXRjaCIsImRlbHRhIiwiX2xlc3NlckFyY0Vhc2UiLCJzdGFydCIsImVuZCIsImxlc3NlckFyYyIsIk1hdGgiLCJhYnMiLCJQSSIsInNpZ24iLCJUQVUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFFBQVFKLFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VLLFdBQVc7QUFDVEMsV0FBTyxJQURFO0FBRVRDLHFCQUFpQjtBQUNmQyxTQUFHLENBRFk7QUFFZkMsU0FBRyxDQUZZO0FBR2ZDLFNBQUc7QUFIWSxLQUZSO0FBT1RDLFdBQU87QUFQRSxHQURiOztBQVdBO0FBQUE7O0FBQ0UsMEJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEJBLGFBQU9QLFFBQVAsR0FBa0JKLE1BQU1ZLGNBQU4sQ0FBcUJELE9BQU9QLFFBQTVCLEVBQXNDQSxRQUF0QyxDQUFsQjtBQURrQix5SEFFWk8sTUFGWTtBQUduQjs7QUFKSDtBQUFBO0FBQUEseUNB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QUwsQ0FBb0JkLE9BQU9XLElBQTNCLEVBQWlDVixLQUFLVSxJQUF0QyxFQUE0Q0UsS0FBNUMsQ0FQRDtBQVFMRCxpQkFBTyxLQUFLRSxjQUFMLENBQW9CZCxPQUFPWSxLQUEzQixFQUFrQ1gsS0FBS1csS0FBdkMsRUFBOENDLEtBQTlDO0FBUkYsU0FBUDtBQVVEO0FBN0NIO0FBQUE7QUFBQSxxQ0ErQ2lCRSxLQS9DakIsRUErQ3dCQyxHQS9DeEIsRUErQzZCSCxLQS9DN0IsRUErQ29DO0FBQ2hDLFlBQUlJLFlBQVlELE1BQU1ELEtBQXRCO0FBQ0EsWUFBSUcsS0FBS0MsR0FBTCxDQUFTRixTQUFULElBQXNCQyxLQUFLRSxFQUEvQixFQUFtQztBQUNqQ0gsc0JBQVlDLEtBQUtHLElBQUwsQ0FBVUosU0FBVixJQUF1QixDQUFDLENBQXhCLElBQTZCbEMsTUFBTXVDLEdBQU4sR0FBWUosS0FBS0MsR0FBTCxDQUFTRixTQUFULENBQXpDLENBQVo7QUFDRDtBQUNELGVBQU9GLFFBQVFFLFlBQVlKLEtBQTNCO0FBQ0Q7QUFyREg7O0FBQUE7QUFBQSxJQUFrQzNCLEtBQWxDO0FBdURELENBdkVEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIHRyYWNrOiBudWxsLFxuICAgICAgaW5pdGlhbFBvc2l0aW9uOiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIHo6IDBcbiAgICAgIH0sXG4gICAgICBjb2xvcjogMHgyMjIyZmZcbiAgICB9O1xuXG4gIHJldHVybiBjbGFzcyBFdWdsZW5hTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgc2V0SW5pdGlhbFBvc2l0aW9uKHBvcykge1xuICAgICAgdGhpcy5zZXQoJ2luaXRpYWxQb3NpdGlvbicsIHBvcyk7XG4gICAgfVxuXG4gICAgZ2V0U3RhdGUodGltZSwgYm91bmRzKSB7XG4gICAgICBsZXQgc2FtcGxlLCBuZXh0O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdldCgndHJhY2snKS5zYW1wbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNhbXBsZSA9IHRoaXMuZ2V0KCd0cmFjaycpLnNhbXBsZXNbaV07XG4gICAgICAgIG5leHQgPSB0aGlzLmdldCgndHJhY2snKS5zYW1wbGVzLmxlbmd0aCA9PSBpKzEgPyBudWxsIDogdGhpcy5nZXQoJ3RyYWNrJykuc2FtcGxlc1tpKzFdO1xuICAgICAgICBpZiAobmV4dCAmJiBuZXh0LnRpbWUgPCB0aW1lKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuZXh0ID09IG51bGwpIHtcbiAgICAgICAgc2FtcGxlID0gdGhpcy5nZXQoJ3RyYWNrJykuc2FtcGxlc1swXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgeDogVXRpbHMucG9zTW9kKHNhbXBsZS54ICsgdGhpcy5nZXQoJ2luaXRpYWxQb3NpdGlvbicpLnggKyBib3VuZHMud2lkdGggLyAyLCBib3VuZHMud2lkdGgpIC0gYm91bmRzLndpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IFV0aWxzLnBvc01vZChzYW1wbGUueSArIHRoaXMuZ2V0KCdpbml0aWFsUG9zaXRpb24nKS55ICsgYm91bmRzLmhlaWdodCAvIDIsIGJvdW5kcy5oZWlnaHQpIC0gYm91bmRzLndpZHRoIC8gMixcbiAgICAgICAgICAgIHo6IHRoaXMuZ2V0KCdpbml0aWFsUG9zaXRpb24nKS56XG4gICAgICAgICAgfSxcbiAgICAgICAgICB5YXc6IHNhbXBsZS55YXcsXG4gICAgICAgICAgcm9sbDogc2FtcGxlLnJvbGwsXG4gICAgICAgICAgcGl0Y2g6IHNhbXBsZS5waXRjaFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgZGVsdGEgPSAodGltZSAtIHNhbXBsZS50aW1lKSAvIChuZXh0LnRpbWUgLSBzYW1wbGUudGltZSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIHg6IFV0aWxzLnBvc01vZChzYW1wbGUueCArIChuZXh0LnggLSBzYW1wbGUueCkgKiBkZWx0YSArIHRoaXMuZ2V0KCdpbml0aWFsUG9zaXRpb24nKS54ICsgYm91bmRzLndpZHRoIC8gMiwgYm91bmRzLndpZHRoKSAtIGJvdW5kcy53aWR0aCAvIDIsXG4gICAgICAgICAgeTogVXRpbHMucG9zTW9kKHNhbXBsZS55ICsgKG5leHQueSAtIHNhbXBsZS55KSAqIGRlbHRhICsgdGhpcy5nZXQoJ2luaXRpYWxQb3NpdGlvbicpLnkgKyBib3VuZHMuaGVpZ2h0IC8gMiwgYm91bmRzLmhlaWdodCkgLSBib3VuZHMuaGVpZ2h0IC8gMixcbiAgICAgICAgICB6OiB0aGlzLmdldCgnaW5pdGlhbFBvc2l0aW9uJykuelxuICAgICAgICB9LFxuICAgICAgICB5YXc6IHRoaXMuX2xlc3NlckFyY0Vhc2Uoc2FtcGxlLnlhdywgbmV4dC55YXcsIGRlbHRhKSxcbiAgICAgICAgcm9sbDogdGhpcy5fbGVzc2VyQXJjRWFzZShzYW1wbGUucm9sbCwgbmV4dC5yb2xsLCBkZWx0YSksXG4gICAgICAgIHBpdGNoOiB0aGlzLl9sZXNzZXJBcmNFYXNlKHNhbXBsZS5waXRjaCwgbmV4dC5waXRjaCwgZGVsdGEpXG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xlc3NlckFyY0Vhc2Uoc3RhcnQsIGVuZCwgZGVsdGEpIHtcbiAgICAgIGxldCBsZXNzZXJBcmMgPSBlbmQgLSBzdGFydDtcbiAgICAgIGlmIChNYXRoLmFicyhsZXNzZXJBcmMpID4gTWF0aC5QSSkge1xuICAgICAgICBsZXNzZXJBcmMgPSBNYXRoLnNpZ24obGVzc2VyQXJjKSAqIC0xICogKFV0aWxzLlRBVSAtIE1hdGguYWJzKGxlc3NlckFyYykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0YXJ0ICsgbGVzc2VyQXJjICogZGVsdGE7XG4gICAgfVxuICB9XG59KVxuIl19
