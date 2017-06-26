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

      return _possibleConstructorReturn(this, (LightMatrixFieldView.__proto__ || Object.getPrototypeOf(LightMatrixFieldView)).call(this, model, tmpl || Template));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9saWdodG1hdHJpeC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNdWx0aUZpZWxkVmlldyIsIlRlbXBsYXRlIiwibW9kZWwiLCJ0bXBsIiwidG90YWwiLCJyZW1haW5pbmciLCIkZWwiLCJmaW5kIiwidGV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxpQkFBaUJELFFBQVEsZ0NBQVIsQ0FBdkI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLHlCQUFSLENBRGI7O0FBSUFBLFVBQVEsd0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxrQ0FBWUcsS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSx5SUFDakJELEtBRGlCLEVBQ1ZDLFFBQVFGLFFBREU7QUFFeEI7O0FBSEg7QUFBQTtBQUFBLG1DQUtlRyxLQUxmLEVBS3NCQyxTQUx0QixFQUtpQztBQUM3QixhQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYywyREFBZCxFQUEyRUMsSUFBM0UsQ0FBZ0ZKLEtBQWhGO0FBQ0EsYUFBS0UsR0FBTCxDQUFTQyxJQUFULENBQWMsK0RBQWQsRUFBK0VDLElBQS9FLENBQW9GSCxTQUFwRjtBQUNEO0FBUkg7O0FBQUE7QUFBQSxJQUEwQ0wsY0FBMUM7QUFVRCxDQWpCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L2Zvcm0vbGlnaHRtYXRyaXgvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
