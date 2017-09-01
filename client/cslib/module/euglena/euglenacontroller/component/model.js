'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      defaults = {
    K: 0.001,
    K_delta: 0.0002,
    v: 20,
    v_delta: 4,
    omega: 1,
    omega_delta: 0.2,
    randomness: 0
  };

  return function (_Model) {
    _inherits(ComponentManagerModel, _Model);

    function ComponentManagerModel(conf) {
      _classCallCheck(this, ComponentManagerModel);

      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);
      return _possibleConstructorReturn(this, (ComponentManagerModel.__proto__ || Object.getPrototypeOf(ComponentManagerModel)).call(this, conf));
    }

    return ComponentManagerModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsIkdsb2JhbHMiLCJkZWZhdWx0cyIsIksiLCJLX2RlbHRhIiwidiIsInZfZGVsdGEiLCJvbWVnYSIsIm9tZWdhX2RlbHRhIiwicmFuZG9tbmVzcyIsImNvbmYiLCJlbnN1cmVEZWZhdWx0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxrQkFBUixDQUFkO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsVUFBVUgsUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFJRUksV0FBVztBQUNUQyxPQUFHLEtBRE07QUFFVEMsYUFBUyxNQUZBO0FBR1RDLE9BQUcsRUFITTtBQUlUQyxhQUFTLENBSkE7QUFLVEMsV0FBTyxDQUxFO0FBTVRDLGlCQUFhLEdBTko7QUFPVEMsZ0JBQVk7QUFQSCxHQUpiOztBQWVBO0FBQUE7O0FBQ0UsbUNBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDaEJBLFdBQUtSLFFBQUwsR0FBZ0JGLE1BQU1XLGNBQU4sQ0FBcUJELEtBQUtSLFFBQTFCLEVBQW9DQSxRQUFwQyxDQUFoQjtBQURnQiwySUFFVlEsSUFGVTtBQUdqQjs7QUFKSDtBQUFBLElBQTJDWCxLQUEzQztBQU1ELENBdEJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgSzogMC4wMDEsXG4gICAgICBLX2RlbHRhOiAwLjAwMDIsXG4gICAgICB2OiAyMCxcbiAgICAgIHZfZGVsdGE6IDQsXG4gICAgICBvbWVnYTogMSxcbiAgICAgIG9tZWdhX2RlbHRhOiAwLjIsXG4gICAgICByYW5kb21uZXNzOiAwXG4gICAgfVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIENvbXBvbmVudE1hbmFnZXJNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25mKSB7XG4gICAgICBjb25mLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZi5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZik7XG4gICAgfVxuICB9XG59KSJdfQ==
