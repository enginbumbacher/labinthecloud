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
      return _possibleConstructorReturn(this, (EuglenaView.__proto__ || Object.getPrototypeOf(EuglenaView)).call(this, tmpl));
    }

    return EuglenaView;
  }(AppView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkFwcFZpZXciLCJUZW1wbGF0ZSIsInRtcGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsZUFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsaUJBQVIsQ0FEYjtBQUVBQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UseUJBQVlHLElBQVosRUFBa0I7QUFBQTs7QUFDaEJBLGFBQU9BLFFBQVFELFFBQWY7QUFEZ0IsdUhBRVZDLElBRlU7QUFHakI7O0FBSkg7QUFBQSxJQUFpQ0YsT0FBakM7QUFNRCxDQVhEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
