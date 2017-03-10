'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// View
// ====

// A base class for all views, regardless of rendering method (e.g. html vs
// canvas).

define(function (require) {
  var Parent = require('core/util/parent');

  return function (_Parent) {
    _inherits(View, _Parent);

    function View() {
      _classCallCheck(this, View);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(View).apply(this, arguments));
    }

    return View;
  }(Parent);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3ZpZXcvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQU1BLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxTQUFTLFFBQVEsa0JBQVIsQ0FBZjs7QUFFQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBLElBQTBCLE1BQTFCO0FBQ0QsQ0FKRCIsImZpbGUiOiJtb2R1bGUvY29yZS92aWV3L3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
