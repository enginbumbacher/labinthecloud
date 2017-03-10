'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Application View
// ================
//
// Provides a default template for an application.

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./app.html');

  return function (_DomView) {
    _inherits(AppView, _DomView);

    function AppView(tmpl) {
      _classCallCheck(this, AppView);

      tmpl = tmpl || Template;
      return _possibleConstructorReturn(this, Object.getPrototypeOf(AppView).call(this, tmpl));
    }

    return AppView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2FwcC92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFLQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sVUFBVSxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRSxXQUFXLFFBQVEsaUJBQVIsQ0FEYjs7QUFHQTtBQUFBOztBQUNFLHFCQUFZLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsYUFBTyxRQUFRLFFBQWY7QUFEZ0Isd0ZBRVYsSUFGVTtBQUdqQjs7QUFKSDtBQUFBLElBQTZCLE9BQTdCO0FBTUQsQ0FWRCIsImZpbGUiOiJtb2R1bGUvY29yZS9hcHAvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
