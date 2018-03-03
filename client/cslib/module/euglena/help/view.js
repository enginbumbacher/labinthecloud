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
    }, {
      key: 'toggle',
      value: function toggle(tabOpen) {
        if (tabOpen) {
          this.$el.find('#selectHelp').removeClass('notflippedY');
          this.$el.find('#selectHelp').addClass('flippedY');
        } else {
          this.$el.find('#selectHelp').removeClass('flippedY');
          this.$el.find('#selectHelp').addClass('notflippedY');
        }
      }
    }]);

    return HelpView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiUmVtYXJrYWJsZSIsIm1vZGVsIiwidG1wbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsImJpbmQiLCIkZG9tIiwiZmluZCIsImxlbmd0aCIsIm1rZG4iLCJodG1sIiwibWQiLCJyZW5kZXIiLCJjbGljayIsIl9vblRhYkNsaWNrIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ0b2dnbGVDbGFzcyIsInZhbHVlIiwiZGlzcGF0Y2hFdmVudCIsInRhYk9wZW4iLCIkZWwiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLGtCQUFSLENBRGI7QUFBQSxNQUVFRyxhQUFhSCxRQUFRLFlBQVIsQ0FGZjs7QUFJQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLHNCQUFZSSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNIQUNqQkEsUUFBUUgsUUFEUzs7QUFFdkJFLFlBQU1FLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLGNBQUwsQ0FBb0JDLElBQXBCLE9BQXZDO0FBQ0EsVUFBSSxNQUFLQyxJQUFMLEdBQVlDLElBQVosQ0FBaUIsaUJBQWpCLEVBQW9DQyxNQUF4QyxFQUFnRDtBQUM5QyxZQUFJQyxPQUFPLE1BQUtILElBQUwsR0FBWUMsSUFBWixDQUFpQixpQkFBakIsRUFBb0NHLElBQXBDLEVBQVg7QUFDQSxZQUFJQyxLQUFLLElBQUlYLFVBQUosRUFBVDtBQUNBLGNBQUtNLElBQUwsR0FBWUMsSUFBWixDQUFpQixnQkFBakIsRUFBbUNHLElBQW5DLENBQXdDQyxHQUFHQyxNQUFILENBQVVILElBQVYsQ0FBeEM7QUFDRDs7QUFFRCxZQUFLSCxJQUFMLEdBQVlDLElBQVosQ0FBaUIsWUFBakIsRUFBK0JNLEtBQS9CLENBQXFDLE1BQUtDLFdBQUwsQ0FBaUJULElBQWpCLE9BQXJDO0FBVHVCO0FBVXhCOztBQVhIO0FBQUE7QUFBQSxxQ0FhaUJVLEdBYmpCLEVBYXNCO0FBQ2xCLGdCQUFRQSxJQUFJQyxJQUFKLENBQVNDLElBQWpCO0FBQ0UsZUFBSyxNQUFMO0FBQ0UsaUJBQUtYLElBQUwsR0FBWVksV0FBWixDQUF3QixZQUF4QixFQUFzQ0gsSUFBSUMsSUFBSixDQUFTRyxLQUEvQztBQUNGO0FBSEY7QUFLRDtBQW5CSDtBQUFBO0FBQUEsa0NBcUJjSixHQXJCZCxFQXFCbUI7QUFDZixhQUFLSyxhQUFMLENBQW1CLGlCQUFuQixFQUFzQyxFQUF0QztBQUNEO0FBdkJIO0FBQUE7QUFBQSw2QkF5QlNDLE9BekJULEVBeUJrQjtBQUNkLFlBQUlBLE9BQUosRUFBYTtBQUNYLGVBQUtDLEdBQUwsQ0FBU2YsSUFBVCxDQUFjLGFBQWQsRUFBNkJnQixXQUE3QixDQUF5QyxhQUF6QztBQUNBLGVBQUtELEdBQUwsQ0FBU2YsSUFBVCxDQUFjLGFBQWQsRUFBNkJpQixRQUE3QixDQUFzQyxVQUF0QztBQUNELFNBSEQsTUFHTztBQUNMLGVBQUtGLEdBQUwsQ0FBU2YsSUFBVCxDQUFjLGFBQWQsRUFBNkJnQixXQUE3QixDQUF5QyxVQUF6QztBQUNBLGVBQUtELEdBQUwsQ0FBU2YsSUFBVCxDQUFjLGFBQWQsRUFBNkJpQixRQUE3QixDQUFzQyxhQUF0QztBQUNEO0FBQ0Y7QUFqQ0g7O0FBQUE7QUFBQSxJQUE4QjFCLE9BQTlCO0FBb0NELENBM0NEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2hlbHAvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vaGVscC5odG1sJyksXG4gICAgUmVtYXJrYWJsZSA9IHJlcXVpcmUoJ3JlbWFya2FibGUnKTtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEhlbHBWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25Nb2RlbENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgIGlmICh0aGlzLiRkb20oKS5maW5kKCcuaGVscF9fbWFya2Rvd24nKS5sZW5ndGgpIHtcbiAgICAgICAgbGV0IG1rZG4gPSB0aGlzLiRkb20oKS5maW5kKCcuaGVscF9fbWFya2Rvd24nKS5odG1sKClcbiAgICAgICAgbGV0IG1kID0gbmV3IFJlbWFya2FibGUoKTtcbiAgICAgICAgdGhpcy4kZG9tKCkuZmluZCgnLmhlbHBfX2NvbnRlbnQnKS5odG1sKG1kLnJlbmRlcihta2RuKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGRvbSgpLmZpbmQoJy5oZWxwX190YWInKS5jbGljayh0aGlzLl9vblRhYkNsaWNrLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoIChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgXCJvcGVuXCI6XG4gICAgICAgICAgdGhpcy4kZG9tKCkudG9nZ2xlQ2xhc3MoJ2hlbHBfX29wZW4nLCBldnQuZGF0YS52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vblRhYkNsaWNrKGV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KFwiSGVscC5Ub2dnbGVPcGVuXCIsIHt9KTtcbiAgICB9XG5cbiAgICB0b2dnbGUodGFiT3Blbikge1xuICAgICAgaWYgKHRhYk9wZW4pIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI3NlbGVjdEhlbHAnKS5yZW1vdmVDbGFzcygnbm90ZmxpcHBlZFknKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI3NlbGVjdEhlbHAnKS5hZGRDbGFzcygnZmxpcHBlZFknKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNzZWxlY3RIZWxwJykucmVtb3ZlQ2xhc3MoJ2ZsaXBwZWRZJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNzZWxlY3RIZWxwJykuYWRkQ2xhc3MoJ25vdGZsaXBwZWRZJyk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbn0pXG4iXX0=
