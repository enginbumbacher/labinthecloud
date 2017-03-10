'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      Euglena = require('./euglena/euglena'),
      defaults = {
    count: 1,
    euglena: [],
    bounds: {
      width: 400,
      height: 300
    },
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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EuglenaDisplayModel).call(this, config));

      var euglena = [];
      for (var i = 0; i < _this.get('count'); i++) {
        var e = new Euglena();
        e.track = i == 0;
        e.setPosition((2 * Math.random() - 1) * _this.get('bounds.width') / 2, (2 * Math.random() - 1) * _this.get('bounds.height') / 2);
        e.setRotation(Math.random() * 2 * Math.PI);
        euglena.push(e);
      }
      _this.set('euglena', euglena);
      return _this;
    }

    return EuglenaDisplayModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxRQUFRLFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0UsUUFBUSxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFLFVBQVUsUUFBUSxtQkFBUixDQUZaO0FBQUEsTUFJRSxXQUFXO0FBQ1QsV0FBTyxDQURFO0FBRVQsYUFBUyxFQUZBO0FBR1QsWUFBUTtBQUNOLGFBQU8sR0FERDtBQUVOLGNBQVE7QUFGRixLQUhDO0FBT1QsWUFBUTtBQUNOLGNBQVEsR0FERjtBQUVOLFlBQU0sR0FGQTtBQUdOLFdBQUs7QUFIQztBQVBDLEdBSmI7O0FBbUJBO0FBQUE7O0FBQ0UsaUNBQVksTUFBWixFQUFvQjtBQUFBOztBQUNsQixhQUFPLFFBQVAsR0FBa0IsTUFBTSxjQUFOLENBQXFCLE9BQU8sUUFBNUIsRUFBc0MsUUFBdEMsQ0FBbEI7O0FBRGtCLHlHQUVaLE1BRlk7O0FBSWxCLFVBQUksVUFBVSxFQUFkO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQUssR0FBTCxDQUFTLE9BQVQsQ0FBcEIsRUFBdUMsR0FBdkMsRUFBNEM7QUFDMUMsWUFBSSxJQUFJLElBQUksT0FBSixFQUFSO0FBQ0EsVUFBRSxLQUFGLEdBQVUsS0FBSyxDQUFmO0FBQ0EsVUFBRSxXQUFGLENBQWMsQ0FBQyxJQUFJLEtBQUssTUFBTCxFQUFKLEdBQW9CLENBQXJCLElBQTBCLE1BQUssR0FBTCxDQUFTLGNBQVQsQ0FBMUIsR0FBcUQsQ0FBbkUsRUFBc0UsQ0FBQyxJQUFJLEtBQUssTUFBTCxFQUFKLEdBQW9CLENBQXJCLElBQTBCLE1BQUssR0FBTCxDQUFTLGVBQVQsQ0FBMUIsR0FBc0QsQ0FBNUg7QUFDQSxVQUFFLFdBQUYsQ0FBYyxLQUFLLE1BQUwsS0FBZ0IsQ0FBaEIsR0FBb0IsS0FBSyxFQUF2QztBQUNBLGdCQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0Q7QUFDRCxZQUFLLEdBQUwsQ0FBUyxTQUFULEVBQW9CLE9BQXBCO0FBWmtCO0FBYW5COztBQWRIO0FBQUEsSUFBeUMsS0FBekM7QUFnQkQsQ0FwQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
