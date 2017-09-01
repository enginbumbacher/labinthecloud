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

      var _this = _possibleConstructorReturn(this, (HelpView.__proto__ || Object.getPrototypeOf(HelpView)).call(this, tmpl || Template));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiUmVtYXJrYWJsZSIsIm1vZGVsIiwidG1wbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsImJpbmQiLCIkZG9tIiwiZmluZCIsImxlbmd0aCIsIm1rZG4iLCJodG1sIiwibWQiLCJyZW5kZXIiLCJjbGljayIsIl9vblRhYkNsaWNrIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ0b2dnbGVDbGFzcyIsInZhbHVlIiwiZGlzcGF0Y2hFdmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSxrQkFBUixDQURiO0FBQUEsTUFFRUcsYUFBYUgsUUFBUSxZQUFSLENBRmY7O0FBSUFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxzQkFBWUksS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxzSEFDakJBLFFBQVFILFFBRFM7O0FBRXZCRSxZQUFNRSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLQyxjQUFMLENBQW9CQyxJQUFwQixPQUF2QztBQUNBLFVBQUksTUFBS0MsSUFBTCxHQUFZQyxJQUFaLENBQWlCLGlCQUFqQixFQUFvQ0MsTUFBeEMsRUFBZ0Q7QUFDOUMsWUFBSUMsT0FBTyxNQUFLSCxJQUFMLEdBQVlDLElBQVosQ0FBaUIsaUJBQWpCLEVBQW9DRyxJQUFwQyxFQUFYO0FBQ0EsWUFBSUMsS0FBSyxJQUFJWCxVQUFKLEVBQVQ7QUFDQSxjQUFLTSxJQUFMLEdBQVlDLElBQVosQ0FBaUIsZ0JBQWpCLEVBQW1DRyxJQUFuQyxDQUF3Q0MsR0FBR0MsTUFBSCxDQUFVSCxJQUFWLENBQXhDO0FBQ0Q7O0FBRUQsWUFBS0gsSUFBTCxHQUFZQyxJQUFaLENBQWlCLFlBQWpCLEVBQStCTSxLQUEvQixDQUFxQyxNQUFLQyxXQUFMLENBQWlCVCxJQUFqQixPQUFyQztBQVR1QjtBQVV4Qjs7QUFYSDtBQUFBO0FBQUEscUNBYWlCVSxHQWJqQixFQWFzQjtBQUNsQixnQkFBUUEsSUFBSUMsSUFBSixDQUFTQyxJQUFqQjtBQUNFLGVBQUssTUFBTDtBQUNFLGlCQUFLWCxJQUFMLEdBQVlZLFdBQVosQ0FBd0IsWUFBeEIsRUFBc0NILElBQUlDLElBQUosQ0FBU0csS0FBL0M7QUFDRjtBQUhGO0FBS0Q7QUFuQkg7QUFBQTtBQUFBLGtDQXFCY0osR0FyQmQsRUFxQm1CO0FBQ2YsYUFBS0ssYUFBTCxDQUFtQixpQkFBbkIsRUFBc0MsRUFBdEM7QUFDRDtBQXZCSDs7QUFBQTtBQUFBLElBQThCdEIsT0FBOUI7QUF5QkQsQ0FoQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvaGVscC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9oZWxwLmh0bWwnKSxcbiAgICBSZW1hcmthYmxlID0gcmVxdWlyZSgncmVtYXJrYWJsZScpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgSGVscFZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgaWYgKHRoaXMuJGRvbSgpLmZpbmQoJy5oZWxwX19tYXJrZG93bicpLmxlbmd0aCkge1xuICAgICAgICBsZXQgbWtkbiA9IHRoaXMuJGRvbSgpLmZpbmQoJy5oZWxwX19tYXJrZG93bicpLmh0bWwoKVxuICAgICAgICBsZXQgbWQgPSBuZXcgUmVtYXJrYWJsZSgpO1xuICAgICAgICB0aGlzLiRkb20oKS5maW5kKCcuaGVscF9fY29udGVudCcpLmh0bWwobWQucmVuZGVyKG1rZG4pKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy4kZG9tKCkuZmluZCgnLmhlbHBfX3RhYicpLmNsaWNrKHRoaXMuX29uVGFiQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzd2l0Y2ggKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSBcIm9wZW5cIjpcbiAgICAgICAgICB0aGlzLiRkb20oKS50b2dnbGVDbGFzcygnaGVscF9fb3BlbicsIGV2dC5kYXRhLnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVGFiQ2xpY2soZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoXCJIZWxwLlRvZ2dsZU9wZW5cIiwge30pO1xuICAgIH1cbiAgfVxufSkiXX0=
