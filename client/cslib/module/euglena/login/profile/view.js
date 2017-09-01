'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Globals = require('core/model/globals'),
      Template = require('text!./profile.html'),
      Utils = require('core/util/utils');

  return function (_DomView) {
    _inherits(ProfileView, _DomView);

    function ProfileView() {
      _classCallCheck(this, ProfileView);

      var _this = _possibleConstructorReturn(this, (ProfileView.__proto__ || Object.getPrototypeOf(ProfileView)).call(this, Template));

      _this._onPhaseChange = _this._onPhaseChange.bind(_this);
      _this._onLogoutClick = _this._onLogoutClick.bind(_this);

      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      _this.$dom().find('.logout').on('click', _this._onLogoutClick);

      if (Utils.urlParam('uid')) {
        _this.$dom().find('.logout').hide();
      }
      return _this;
    }

    _createClass(ProfileView, [{
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (Globals.get('user')) {
          this.$dom().find('.user').html(Globals.get('user'));
          this.$dom().addClass('profile__open');
        } else {
          this.$dom().find('.user').html('');
          this.$dom().removeClass('profile__open');
        }
      }
    }, {
      key: '_onLogoutClick',
      value: function _onLogoutClick(jqevt) {
        this.dispatchEvent('Login.Logout', {});
        jqevt.preventDefault();
        return false;
      }
    }]);

    return ProfileView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL3Byb2ZpbGUvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIkdsb2JhbHMiLCJUZW1wbGF0ZSIsIlV0aWxzIiwiX29uUGhhc2VDaGFuZ2UiLCJiaW5kIiwiX29uTG9nb3V0Q2xpY2siLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiJGRvbSIsImZpbmQiLCJvbiIsInVybFBhcmFtIiwiaGlkZSIsImV2dCIsImh0bWwiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwicHJldmVudERlZmF1bHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLFdBQVdILFFBQVEscUJBQVIsQ0FGYjtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFLQTtBQUFBOztBQUNFLDJCQUFjO0FBQUE7O0FBQUEsNEhBQ05HLFFBRE07O0FBRVosWUFBS0UsY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CQyxJQUFwQixPQUF0QjtBQUNBLFlBQUtDLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkQsSUFBcEIsT0FBdEI7O0FBRUFKLGNBQVFNLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtKLGNBQTlEO0FBQ0EsWUFBS0ssSUFBTCxHQUFZQyxJQUFaLENBQWlCLFNBQWpCLEVBQTRCQyxFQUE1QixDQUErQixPQUEvQixFQUF3QyxNQUFLTCxjQUE3Qzs7QUFFQSxVQUFJSCxNQUFNUyxRQUFOLENBQWUsS0FBZixDQUFKLEVBQTJCO0FBQ3pCLGNBQUtILElBQUwsR0FBWUMsSUFBWixDQUFpQixTQUFqQixFQUE0QkcsSUFBNUI7QUFDRDtBQVZXO0FBV2I7O0FBWkg7QUFBQTtBQUFBLHFDQWNpQkMsR0FkakIsRUFjc0I7QUFDbEIsWUFBSWIsUUFBUU0sR0FBUixDQUFZLE1BQVosQ0FBSixFQUF5QjtBQUN2QixlQUFLRSxJQUFMLEdBQVlDLElBQVosQ0FBaUIsT0FBakIsRUFBMEJLLElBQTFCLENBQStCZCxRQUFRTSxHQUFSLENBQVksTUFBWixDQUEvQjtBQUNBLGVBQUtFLElBQUwsR0FBWU8sUUFBWixDQUFxQixlQUFyQjtBQUNELFNBSEQsTUFHTztBQUNMLGVBQUtQLElBQUwsR0FBWUMsSUFBWixDQUFpQixPQUFqQixFQUEwQkssSUFBMUIsQ0FBK0IsRUFBL0I7QUFDQSxlQUFLTixJQUFMLEdBQVlRLFdBQVosQ0FBd0IsZUFBeEI7QUFDRDtBQUNGO0FBdEJIO0FBQUE7QUFBQSxxQ0F3QmlCQyxLQXhCakIsRUF3QndCO0FBQ3BCLGFBQUtDLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUMsRUFBbkM7QUFDQUQsY0FBTUUsY0FBTjtBQUNBLGVBQU8sS0FBUDtBQUNEO0FBNUJIOztBQUFBO0FBQUEsSUFBaUNwQixPQUFqQztBQThCRCxDQXBDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9sb2dpbi9wcm9maWxlL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9wcm9maWxlLmh0bWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpO1xuXG4gIHJldHVybiBjbGFzcyBQcm9maWxlVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoVGVtcGxhdGUpO1xuICAgICAgdGhpcy5fb25QaGFzZUNoYW5nZSA9IHRoaXMuX29uUGhhc2VDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uTG9nb3V0Q2xpY2sgPSB0aGlzLl9vbkxvZ291dENsaWNrLmJpbmQodGhpcyk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgICAgdGhpcy4kZG9tKCkuZmluZCgnLmxvZ291dCcpLm9uKCdjbGljaycsIHRoaXMuX29uTG9nb3V0Q2xpY2spXG5cbiAgICAgIGlmIChVdGlscy51cmxQYXJhbSgndWlkJykpIHtcbiAgICAgICAgdGhpcy4kZG9tKCkuZmluZCgnLmxvZ291dCcpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgndXNlcicpKSB7XG4gICAgICAgIHRoaXMuJGRvbSgpLmZpbmQoJy51c2VyJykuaHRtbChHbG9iYWxzLmdldCgndXNlcicpKTtcbiAgICAgICAgdGhpcy4kZG9tKCkuYWRkQ2xhc3MoJ3Byb2ZpbGVfX29wZW4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGRvbSgpLmZpbmQoJy51c2VyJykuaHRtbCgnJyk7XG4gICAgICAgIHRoaXMuJGRvbSgpLnJlbW92ZUNsYXNzKCdwcm9maWxlX19vcGVuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTG9nb3V0Q2xpY2soanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnTG9naW4uTG9nb3V0Jywge30pO1xuICAgICAganFldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pIl19
