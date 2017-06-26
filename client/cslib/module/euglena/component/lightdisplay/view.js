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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiVXRpbHMiLCJHbG9iYWxzIiwibW9kZWwiLCJ0bXBsIiwiJGVsIiwiZmluZCIsImNzcyIsIndpZHRoIiwiZ2V0IiwiaGVpZ2h0IiwibGlnaHRzIiwia2V5Iiwib3BhY2l0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSwwQkFBUixDQURiO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksVUFBVUosUUFBUSxvQkFBUixDQUhaOztBQU1BQSxVQUFRLHlCQUFSOztBQUVBO0FBQUE7O0FBQ0UsOEJBQVlLLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsc0lBQ2pCQSxRQUFRSixRQURTOztBQUd2QixZQUFLSyxHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q0MsR0FBekMsQ0FBNkM7QUFDM0NDLGVBQU9MLE1BQU1NLEdBQU4sQ0FBVSxPQUFWLENBRG9DO0FBRTNDQyxnQkFBUVAsTUFBTU0sR0FBTixDQUFVLFFBQVY7QUFGbUMsT0FBN0M7O0FBSHVCO0FBUXhCOztBQVRIO0FBQUE7QUFBQSw2QkFXU0UsTUFYVCxFQVdpQjtBQUNiLGFBQUssSUFBSUMsR0FBVCxJQUFnQkQsTUFBaEIsRUFBd0I7QUFDdEIsZUFBS04sR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQXFCTSxHQUFuQyxFQUF3Q0wsR0FBeEMsQ0FBNEMsRUFBRU0sU0FBU0YsT0FBT0MsR0FBUCxJQUFjLEdBQXpCLEVBQTVDO0FBQ0Q7QUFDRjtBQWZIOztBQUFBO0FBQUEsSUFBc0NiLE9BQXRDO0FBaUJELENBMUJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
