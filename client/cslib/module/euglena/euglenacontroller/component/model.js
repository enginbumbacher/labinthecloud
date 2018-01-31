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
    opacity: 0.5,
    opacity_delta: 0.1,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kZWwiLCJVdGlscyIsIkdsb2JhbHMiLCJkZWZhdWx0cyIsIksiLCJLX2RlbHRhIiwidiIsInZfZGVsdGEiLCJvbWVnYSIsIm9tZWdhX2RlbHRhIiwib3BhY2l0eSIsIm9wYWNpdHlfZGVsdGEiLCJyYW5kb21uZXNzIiwiY29uZiIsImVuc3VyZURlZmF1bHRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUlFSSxXQUFXO0FBQ1RDLE9BQUcsS0FETTtBQUVUQyxhQUFTLE1BRkE7QUFHVEMsT0FBRyxFQUhNO0FBSVRDLGFBQVMsQ0FKQTtBQUtUQyxXQUFPLENBTEU7QUFNVEMsaUJBQWEsR0FOSjtBQU9UQyxhQUFTLEdBUEE7QUFRVEMsbUJBQWUsR0FSTjtBQVNUQyxnQkFBWTtBQVRILEdBSmI7O0FBaUJBO0FBQUE7O0FBQ0UsbUNBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDaEJBLFdBQUtWLFFBQUwsR0FBZ0JGLE1BQU1hLGNBQU4sQ0FBcUJELEtBQUtWLFFBQTFCLEVBQW9DQSxRQUFwQyxDQUFoQjtBQURnQiwySUFFVlUsSUFGVTtBQUdqQjs7QUFKSDtBQUFBLElBQTJDYixLQUEzQztBQU1ELENBeEJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgSzogMC4wMDEsXG4gICAgICBLX2RlbHRhOiAwLjAwMDIsXG4gICAgICB2OiAyMCxcbiAgICAgIHZfZGVsdGE6IDQsXG4gICAgICBvbWVnYTogMSxcbiAgICAgIG9tZWdhX2RlbHRhOiAwLjIsXG4gICAgICBvcGFjaXR5OiAwLjUsXG4gICAgICBvcGFjaXR5X2RlbHRhOiAwLjEsXG4gICAgICByYW5kb21uZXNzOiAwXG4gICAgfVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIENvbXBvbmVudE1hbmFnZXJNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25mKSB7XG4gICAgICBjb25mLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZi5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZik7XG4gICAgfVxuICB9XG59KVxuIl19
