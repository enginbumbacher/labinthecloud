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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvbGlnaHRtYXRyaXgvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTXVsdGlGaWVsZFZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsInRvdGFsIiwicmVtYWluaW5nIiwiJGVsIiwiZmluZCIsInRleHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsaUJBQWlCRCxRQUFRLGdDQUFSLENBQXZCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSx5QkFBUixDQURiOztBQUlBQSxVQUFRLHdCQUFSOztBQUVBO0FBQUE7O0FBQ0Usa0NBQVlHLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEseUlBQ2pCRCxLQURpQixFQUNWQyxRQUFRRixRQURFO0FBRXhCOztBQUhIO0FBQUE7QUFBQSxtQ0FLZUcsS0FMZixFQUtzQkMsU0FMdEIsRUFLaUM7QUFDN0IsYUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsMkRBQWQsRUFBMkVDLElBQTNFLENBQWdGSixLQUFoRjtBQUNBLGFBQUtFLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLCtEQUFkLEVBQStFQyxJQUEvRSxDQUFvRkgsU0FBcEY7QUFDRDtBQVJIOztBQUFBO0FBQUEsSUFBMENMLGNBQTFDO0FBVUQsQ0FqQkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtX25hcnJhdGl2ZS9saWdodG1hdHJpeC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE11bHRpRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvbXVsdGlmaWVsZC92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vbGlnaHRtYXRyaXguaHRtbCcpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vbGlnaHRtYXRyaXguY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIExpZ2h0TWF0cml4RmllbGRWaWV3IGV4dGVuZHMgTXVsdGlGaWVsZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlVG90YWxzKHRvdGFsLCByZW1haW5pbmcpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5saWdodC1tYXRyaXhfX2Zvb3Rlcl9fdG90YWwgLmxpZ2h0LW1hdHJpeF9fZm9vdGVyX192YWx1ZScpLnRleHQodG90YWwpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLmxpZ2h0LW1hdHJpeF9fZm9vdGVyX19yZW1haW5pbmcgLmxpZ2h0LW1hdHJpeF9fZm9vdGVyX192YWx1ZScpLnRleHQocmVtYWluaW5nKTtcbiAgICB9XG4gIH0gIFxufSkiXX0=
