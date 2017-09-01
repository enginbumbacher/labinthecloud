'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FormView = require('module/form/view'),
      Template = require('text!./login.html');

  return function (_FormView) {
    _inherits(LoginFormView, _FormView);

    function LoginFormView(model, tmpl) {
      _classCallCheck(this, LoginFormView);

      var _this = _possibleConstructorReturn(this, (LoginFormView.__proto__ || Object.getPrototypeOf(LoginFormView)).call(this, model, tmpl || Template));

      _this._onKeyUp = _this._onKeyUp.bind(_this);

      _this.$dom().on('keyup keypress', _this._onKeyUp);
      return _this;
    }

    _createClass(LoginFormView, [{
      key: '_onKeyUp',
      value: function _onKeyUp(jqevt) {
        var keyCode = jqevt.keyCode || jqevt.which;
        if (keyCode === 13) {
          this.dispatchEvent('Login.Submit', {});
          jqevt.preventDefault();
          return false;
        }
      }
    }]);

    return LoginFormView;
  }(FormView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL2Zvcm0vdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRm9ybVZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsIl9vbktleVVwIiwiYmluZCIsIiRkb20iLCJvbiIsImpxZXZ0Iiwia2V5Q29kZSIsIndoaWNoIiwiZGlzcGF0Y2hFdmVudCIsInByZXZlbnREZWZhdWx0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFdBQVdELFFBQVEsa0JBQVIsQ0FBakI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLG1CQUFSLENBRGI7O0FBR0E7QUFBQTs7QUFDRSwyQkFBWUcsS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxnSUFDakJELEtBRGlCLEVBQ1ZDLFFBQVFGLFFBREU7O0FBRXZCLFlBQUtHLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjQyxJQUFkLE9BQWhCOztBQUVBLFlBQUtDLElBQUwsR0FBWUMsRUFBWixDQUFlLGdCQUFmLEVBQWlDLE1BQUtILFFBQXRDO0FBSnVCO0FBS3hCOztBQU5IO0FBQUE7QUFBQSwrQkFRV0ksS0FSWCxFQVFrQjtBQUNkLFlBQUlDLFVBQVVELE1BQU1DLE9BQU4sSUFBaUJELE1BQU1FLEtBQXJDO0FBQ0EsWUFBSUQsWUFBWSxFQUFoQixFQUFvQjtBQUNsQixlQUFLRSxhQUFMLENBQW1CLGNBQW5CLEVBQW1DLEVBQW5DO0FBQ0FILGdCQUFNSSxjQUFOO0FBQ0EsaUJBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFmSDs7QUFBQTtBQUFBLElBQW1DWixRQUFuQztBQWlCRCxDQXJCRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9sb2dpbi9mb3JtL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRm9ybVZpZXcgPSByZXF1aXJlKCdtb2R1bGUvZm9ybS92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vbG9naW4uaHRtbCcpO1xuXG4gIHJldHVybiBjbGFzcyBMb2dpbkZvcm1WaWV3IGV4dGVuZHMgRm9ybVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICB0aGlzLl9vbktleVVwID0gdGhpcy5fb25LZXlVcC5iaW5kKHRoaXMpO1xuXG4gICAgICB0aGlzLiRkb20oKS5vbigna2V5dXAga2V5cHJlc3MnLCB0aGlzLl9vbktleVVwKTtcbiAgICB9XG5cbiAgICBfb25LZXlVcChqcWV2dCkge1xuICAgICAgbGV0IGtleUNvZGUgPSBqcWV2dC5rZXlDb2RlIHx8IGpxZXZ0LndoaWNoO1xuICAgICAgaWYgKGtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnTG9naW4uU3VibWl0Jywge30pO1xuICAgICAgICBqcWV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG59KSJdfQ==
