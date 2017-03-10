'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Globals
// =======

// A singleton instance of a Model, used to manage global data.

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Model = require('./model');

  var Globals = function (_Model) {
    _inherits(Globals, _Model);

    function Globals() {
      _classCallCheck(this, Globals);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Globals).call(this, {
        data: {},
        defaults: {}
      }));

      _this.set('Relay', new EventDispatcher());
      return _this;
    }

    return Globals;
  }(Model);

  // Having the module return an instance of the class effectively makes the
  // class a singleton without jumping through the hoops of calling
  // `Globals.instance()`

  return new Globals();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL21vZGVsL2dsb2JhbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUtBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxrQkFBa0IsUUFBUSx1QkFBUixDQUF4QjtBQUFBLE1BQ0UsUUFBUSxRQUFRLFNBQVIsQ0FEVjs7QUFEa0IsTUFJWixPQUpZO0FBQUE7O0FBS2hCLHVCQUFjO0FBQUE7O0FBQUEsNkZBQ047QUFDSixjQUFNLEVBREY7QUFFSixrQkFBVTtBQUZOLE9BRE07O0FBS1osWUFBSyxHQUFMLENBQVMsT0FBVCxFQUFrQixJQUFJLGVBQUosRUFBbEI7QUFMWTtBQU1iOztBQVhlO0FBQUEsSUFJSSxLQUpKOzs7Ozs7QUFrQmxCLFNBQU8sSUFBSSxPQUFKLEVBQVA7QUFDRCxDQW5CRCIsImZpbGUiOiJtb2R1bGUvY29yZS9tb2RlbC9nbG9iYWxzLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
