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

      var _this = _possibleConstructorReturn(this, (Globals.__proto__ || Object.getPrototypeOf(Globals)).call(this, {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL21vZGVsL2dsb2JhbHMuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIk1vZGVsIiwiR2xvYmFscyIsImRhdGEiLCJkZWZhdWx0cyIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBOztBQUVBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxrQkFBa0JELFFBQVEsdUJBQVIsQ0FBeEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjs7QUFEa0IsTUFJWkcsT0FKWTtBQUFBOztBQUtoQix1QkFBYztBQUFBOztBQUFBLG9IQUNOO0FBQ0pDLGNBQU0sRUFERjtBQUVKQyxrQkFBVTtBQUZOLE9BRE07O0FBS1osWUFBS0MsR0FBTCxDQUFTLE9BQVQsRUFBa0IsSUFBSUwsZUFBSixFQUFsQjtBQUxZO0FBTWI7O0FBWGU7QUFBQSxJQUlJQyxLQUpKOztBQWNwQjtBQUNBO0FBQ0E7O0FBRUUsU0FBTyxJQUFJQyxPQUFKLEVBQVA7QUFDRCxDQW5CRCIsImZpbGUiOiJtb2R1bGUvY29yZS9tb2RlbC9nbG9iYWxzLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
