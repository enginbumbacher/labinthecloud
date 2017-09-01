'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Model = require('core/model/model'),
      defaults = {
    id: null,
    color: 0x2222ff
  };

  return function (_Model) {
    _inherits(ModelTabModel, _Model);

    function ModelTabModel(config) {
      _classCallCheck(this, ModelTabModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (ModelTabModel.__proto__ || Object.getPrototypeOf(ModelTabModel)).call(this, config));
    }

    return ModelTabModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJNb2RlbCIsImRlZmF1bHRzIiwiaWQiLCJjb2xvciIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFFBQVFKLFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VLLFdBQVc7QUFDVEMsUUFBSSxJQURLO0FBRVRDLFdBQU87QUFGRSxHQURiOztBQU1BO0FBQUE7O0FBQ0UsMkJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEJBLGFBQU9ILFFBQVAsR0FBa0JILE1BQU1PLGNBQU4sQ0FBcUJELE9BQU9ILFFBQTVCLEVBQXNDQSxRQUF0QyxDQUFsQjtBQURrQiwySEFFWkcsTUFGWTtBQUduQjs7QUFKSDtBQUFBLElBQW1DSixLQUFuQztBQU9ELENBbEJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgTW9kZWwgPSByZXF1aXJlKCdjb3JlL21vZGVsL21vZGVsJyksXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBpZDogbnVsbCxcbiAgICAgIGNvbG9yOiAweDIyMjJmZlxuICAgIH07XG5cbiAgcmV0dXJuIGNsYXNzIE1vZGVsVGFiTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuICB9XG4gIFxufSkiXX0=
