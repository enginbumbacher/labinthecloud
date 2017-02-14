'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var MultiFieldView = require('core/component/multifield/view'),
      Template = require('text!./lightmatrix.html');

  require('link!./lightmatrix.css');

  return function (_MultiFieldView) {
    _inherits(LightMatrixFieldView, _MultiFieldView);

    function LightMatrixFieldView(model, tmpl) {
      _classCallCheck(this, LightMatrixFieldView);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(LightMatrixFieldView).call(this, model, tmpl || Template));
    }

    _createClass(LightMatrixFieldView, [{
      key: 'updateTotals',
      value: function updateTotals(total, remaining) {
        this.$el.find('.light-matrix__footer__total .light-matrix__footer__value').text(total);
        this.$el.find('.light-matrix__footer__remaining .light-matrix__footer__value').text(remaining);
      }
    }]);

    return LightMatrixFieldView;
  }(MultiFieldView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9saWdodG1hdHJpeC92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0saUJBQWlCLFFBQVEsZ0NBQVIsQ0FBdkI7QUFBQSxNQUNFLFdBQVcsUUFBUSx5QkFBUixDQURiOztBQUlBLFVBQVEsd0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxrQ0FBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEscUdBQ2pCLEtBRGlCLEVBQ1YsUUFBUSxRQURFO0FBRXhCOztBQUhIO0FBQUE7QUFBQSxtQ0FLZSxLQUxmLEVBS3NCLFNBTHRCLEVBS2lDO0FBQzdCLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYywyREFBZCxFQUEyRSxJQUEzRSxDQUFnRixLQUFoRjtBQUNBLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYywrREFBZCxFQUErRSxJQUEvRSxDQUFvRixTQUFwRjtBQUNEO0FBUkg7O0FBQUE7QUFBQSxJQUEwQyxjQUExQztBQVVELENBakJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9saWdodG1hdHJpeC92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
