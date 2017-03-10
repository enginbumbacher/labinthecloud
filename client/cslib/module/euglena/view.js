'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var AppView = require('core/app/view'),
      Template = require('text!./app.html');
  require('link!./style.css');

  return function (_AppView) {
    _inherits(EuglenaView, _AppView);

    function EuglenaView(tmpl) {
      _classCallCheck(this, EuglenaView);

      tmpl = tmpl || Template;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(EuglenaView).call(this, tmpl));
    }

    return EuglenaView;
  }(AppView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sVUFBVSxRQUFRLGVBQVIsQ0FBaEI7QUFBQSxNQUNFLFdBQVcsUUFBUSxpQkFBUixDQURiO0FBRUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLHlCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsYUFBTyxRQUFRLFFBQWY7QUFEZ0IsNEZBRVYsSUFGVTtBQUdqQjs7QUFKSDtBQUFBLElBQWlDLE9BQWpDO0FBTUQsQ0FYRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
