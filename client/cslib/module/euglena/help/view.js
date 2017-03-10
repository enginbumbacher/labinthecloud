'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./help.html'),
      Remarkable = require('remarkable');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(HelpView, _DomView);

    function HelpView(model, tmpl) {
      _classCallCheck(this, HelpView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HelpView).call(this, tmpl || Template));

      model.addEventListener('Model.Change', _this._onModelChange.bind(_this));
      if (_this.$dom().find('.help__markdown').length) {
        var mkdn = _this.$dom().find('.help__markdown').html();
        var md = new Remarkable();
        _this.$dom().find('.help__content').html(md.render(mkdn));
      }

      _this.$dom().find('.help__tab').click(_this._onTabClick.bind(_this));
      return _this;
    }

    _createClass(HelpView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          case "open":
            this.$dom().toggleClass('help__open', evt.data.value);
            break;
        }
      }
    }, {
      key: '_onTabClick',
      value: function _onTabClick(evt) {
        this.dispatchEvent("Help.ToggleOpen", {});
      }
    }]);

    return HelpView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFVBQVUsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0UsV0FBVyxRQUFRLGtCQUFSLENBRGI7QUFBQSxNQUVFLGFBQWEsUUFBUSxZQUFSLENBRmY7O0FBSUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLHNCQUFZLEtBQVosRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSw4RkFDakIsUUFBUSxRQURTOztBQUV2QixZQUFNLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUssY0FBTCxDQUFvQixJQUFwQixPQUF2QztBQUNBLFVBQUksTUFBSyxJQUFMLEdBQVksSUFBWixDQUFpQixpQkFBakIsRUFBb0MsTUFBeEMsRUFBZ0Q7QUFDOUMsWUFBSSxPQUFPLE1BQUssSUFBTCxHQUFZLElBQVosQ0FBaUIsaUJBQWpCLEVBQW9DLElBQXBDLEVBQVg7QUFDQSxZQUFJLEtBQUssSUFBSSxVQUFKLEVBQVQ7QUFDQSxjQUFLLElBQUwsR0FBWSxJQUFaLENBQWlCLGdCQUFqQixFQUFtQyxJQUFuQyxDQUF3QyxHQUFHLE1BQUgsQ0FBVSxJQUFWLENBQXhDO0FBQ0Q7O0FBRUQsWUFBSyxJQUFMLEdBQVksSUFBWixDQUFpQixZQUFqQixFQUErQixLQUEvQixDQUFxQyxNQUFLLFdBQUwsQ0FBaUIsSUFBakIsT0FBckM7QUFUdUI7QUFVeEI7O0FBWEg7QUFBQTtBQUFBLHFDQWFpQixHQWJqQixFQWFzQjtBQUNsQixnQkFBUSxJQUFJLElBQUosQ0FBUyxJQUFqQjtBQUNFLGVBQUssTUFBTDtBQUNFLGlCQUFLLElBQUwsR0FBWSxXQUFaLENBQXdCLFlBQXhCLEVBQXNDLElBQUksSUFBSixDQUFTLEtBQS9DO0FBQ0Y7QUFIRjtBQUtEO0FBbkJIO0FBQUE7QUFBQSxrQ0FxQmMsR0FyQmQsRUFxQm1CO0FBQ2YsYUFBSyxhQUFMLENBQW1CLGlCQUFuQixFQUFzQyxFQUF0QztBQUNEO0FBdkJIOztBQUFBO0FBQUEsSUFBOEIsT0FBOUI7QUF5QkQsQ0FoQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvaGVscC92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
