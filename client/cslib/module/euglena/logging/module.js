'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals');

  var Module = require('core/app/module'),
      Logger = require('./logger');

  return function (_Module) {
    _inherits(LoggingModule, _Module);

    function LoggingModule() {
      _classCallCheck(this, LoggingModule);

      var _this = _possibleConstructorReturn(this, (LoggingModule.__proto__ || Object.getPrototypeOf(LoggingModule)).call(this));

      _this.logger = new Logger();
      Globals.set('Logger', _this.logger);
      return _this;
    }

    return LoggingModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2dpbmcvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJITSIsIlV0aWxzIiwiR2xvYmFscyIsIk1vZHVsZSIsIkxvZ2dlciIsImxvZ2dlciIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsS0FBS0QsUUFBUSx5QkFBUixDQUFYO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsVUFBVUgsUUFBUSxvQkFBUixDQUZaOztBQUlBLE1BQU1JLFNBQVNKLFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VLLFNBQVNMLFFBQVEsVUFBUixDQURYOztBQUdBO0FBQUE7O0FBQ0UsNkJBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFLTSxNQUFMLEdBQWMsSUFBSUQsTUFBSixFQUFkO0FBQ0FGLGNBQVFJLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLE1BQUtELE1BQTNCO0FBSFk7QUFJYjs7QUFMSDtBQUFBLElBQW1DRixNQUFuQztBQU9ELENBZkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbG9nZ2luZy9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIExvZ2dlciA9IHJlcXVpcmUoJy4vbG9nZ2VyJyk7XG5cbiAgcmV0dXJuIGNsYXNzIExvZ2dpbmdNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuICAgICAgR2xvYmFscy5zZXQoJ0xvZ2dlcicsIHRoaXMubG9nZ2VyKTtcbiAgICB9XG4gIH1cbn0pOyJdfQ==
