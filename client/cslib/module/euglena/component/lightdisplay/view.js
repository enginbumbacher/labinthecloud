'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./lightdisplay.html'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals');

  require('link!./lightdisplay.css');

  return function (_DomView) {
    _inherits(LightDisplayView, _DomView);

    function LightDisplayView(model, tmpl) {
      _classCallCheck(this, LightDisplayView);

      var _this = _possibleConstructorReturn(this, (LightDisplayView.__proto__ || Object.getPrototypeOf(LightDisplayView)).call(this, tmpl || Template));

      _this.$el.find(".light-display__content").css({
        width: model.get('width'),
        height: model.get('height')
      });

      return _this;
    }

    _createClass(LightDisplayView, [{
      key: 'addText',
      value: function addText(newText) {
        this.$el.find(".light-display__content").text(newText);
      }
    }, {
      key: 'render',
      value: function render(lights) {
        for (var key in lights) {
          this.$el.find('.light-display__' + key).css({ opacity: lights[key] / 100 });
        }
      }
    }]);

    return LightDisplayView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiVXRpbHMiLCJHbG9iYWxzIiwibW9kZWwiLCJ0bXBsIiwiJGVsIiwiZmluZCIsImNzcyIsIndpZHRoIiwiZ2V0IiwiaGVpZ2h0IiwibmV3VGV4dCIsInRleHQiLCJsaWdodHMiLCJrZXkiLCJvcGFjaXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLDBCQUFSLENBRGI7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxVQUFVSixRQUFRLG9CQUFSLENBSFo7O0FBTUFBLFVBQVEseUJBQVI7O0FBRUE7QUFBQTs7QUFDRSw4QkFBWUssS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxzSUFDakJBLFFBQVFKLFFBRFM7O0FBRXZCLFlBQUtLLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDQyxHQUF6QyxDQUE2QztBQUMzQ0MsZUFBT0wsTUFBTU0sR0FBTixDQUFVLE9BQVYsQ0FEb0M7QUFFM0NDLGdCQUFRUCxNQUFNTSxHQUFOLENBQVUsUUFBVjtBQUZtQyxPQUE3Qzs7QUFGdUI7QUFPeEI7O0FBUkg7QUFBQTtBQUFBLDhCQVVVRSxPQVZWLEVBVW1CO0FBQ2YsYUFBS04sR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNNLElBQXpDLENBQThDRCxPQUE5QztBQUNEO0FBWkg7QUFBQTtBQUFBLDZCQWNTRSxNQWRULEVBY2lCO0FBQ2IsYUFBSyxJQUFJQyxHQUFULElBQWdCRCxNQUFoQixFQUF3QjtBQUN0QixlQUFLUixHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBcUJRLEdBQW5DLEVBQXdDUCxHQUF4QyxDQUE0QyxFQUFFUSxTQUFTRixPQUFPQyxHQUFQLElBQWMsR0FBekIsRUFBNUM7QUFDRDtBQUNGO0FBbEJIOztBQUFBO0FBQUEsSUFBc0NmLE9BQXRDO0FBb0JELENBN0JEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vbGlnaHRkaXNwbGF5Lmh0bWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKVxuICA7XG5cbiAgcmVxdWlyZSgnbGluayEuL2xpZ2h0ZGlzcGxheS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgTGlnaHREaXNwbGF5VmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIubGlnaHQtZGlzcGxheV9fY29udGVudFwiKS5jc3Moe1xuICAgICAgICB3aWR0aDogbW9kZWwuZ2V0KCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IG1vZGVsLmdldCgnaGVpZ2h0JylcbiAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBhZGRUZXh0KG5ld1RleHQpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIubGlnaHQtZGlzcGxheV9fY29udGVudFwiKS50ZXh0KG5ld1RleHQpXG4gICAgfVxuXG4gICAgcmVuZGVyKGxpZ2h0cykge1xuICAgICAgZm9yIChsZXQga2V5IGluIGxpZ2h0cykge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcubGlnaHQtZGlzcGxheV9fJyArIGtleSkuY3NzKHsgb3BhY2l0eTogbGlnaHRzW2tleV0gLyAxMDAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl19
