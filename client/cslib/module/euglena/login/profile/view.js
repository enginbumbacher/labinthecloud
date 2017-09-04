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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL3Byb2ZpbGUvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIkdsb2JhbHMiLCJUZW1wbGF0ZSIsIlV0aWxzIiwiX29uUGhhc2VDaGFuZ2UiLCJiaW5kIiwiX29uTG9nb3V0Q2xpY2siLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiJGRvbSIsImZpbmQiLCJvbiIsInVybFBhcmFtIiwiaGlkZSIsImV2dCIsImh0bWwiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwicHJldmVudERlZmF1bHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLFdBQVdILFFBQVEscUJBQVIsQ0FGYjtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFLQTtBQUFBOztBQUNFLDJCQUFjO0FBQUE7O0FBQUEsNEhBQ05HLFFBRE07O0FBRVosWUFBS0UsY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CQyxJQUFwQixPQUF0QjtBQUNBLFlBQUtDLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkQsSUFBcEIsT0FBdEI7O0FBRUFKLGNBQVFNLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtKLGNBQTlEO0FBQ0EsWUFBS0ssSUFBTCxHQUFZQyxJQUFaLENBQWlCLFNBQWpCLEVBQTRCQyxFQUE1QixDQUErQixPQUEvQixFQUF3QyxNQUFLTCxjQUE3Qzs7QUFFQSxVQUFJSCxNQUFNUyxRQUFOLENBQWUsS0FBZixDQUFKLEVBQTJCO0FBQ3pCLGNBQUtILElBQUwsR0FBWUMsSUFBWixDQUFpQixTQUFqQixFQUE0QkcsSUFBNUI7QUFDRDtBQVZXO0FBV2I7O0FBWkg7QUFBQTtBQUFBLHFDQWNpQkMsR0FkakIsRUFjc0I7QUFDbEIsWUFBSWIsUUFBUU0sR0FBUixDQUFZLE1BQVosQ0FBSixFQUF5Qjs7QUFFdkIsZUFBS0UsSUFBTCxHQUFZQyxJQUFaLENBQWlCLE9BQWpCLEVBQTBCSyxJQUExQixDQUErQmQsUUFBUU0sR0FBUixDQUFZLE1BQVosQ0FBL0I7QUFDQSxlQUFLRSxJQUFMLEdBQVlPLFFBQVosQ0FBcUIsZUFBckI7QUFDRCxTQUpELE1BSU87O0FBRUwsZUFBS1AsSUFBTCxHQUFZQyxJQUFaLENBQWlCLE9BQWpCLEVBQTBCSyxJQUExQixDQUErQixFQUEvQjtBQUNBLGVBQUtOLElBQUwsR0FBWVEsV0FBWixDQUF3QixlQUF4QjtBQUNEO0FBQ0Y7QUF4Qkg7QUFBQTtBQUFBLHFDQTBCaUJDLEtBMUJqQixFQTBCd0I7QUFDcEIsYUFBS0MsYUFBTCxDQUFtQixjQUFuQixFQUFtQyxFQUFuQztBQUNBRCxjQUFNRSxjQUFOO0FBQ0EsZUFBTyxLQUFQO0FBQ0Q7QUE5Qkg7O0FBQUE7QUFBQSxJQUFpQ3BCLE9BQWpDO0FBZ0NELENBdENEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2xvZ2luL3Byb2ZpbGUvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Byb2ZpbGUuaHRtbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFByb2ZpbGVWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcihUZW1wbGF0ZSk7XG4gICAgICB0aGlzLl9vblBoYXNlQ2hhbmdlID0gdGhpcy5fb25QaGFzZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Mb2dvdXRDbGljayA9IHRoaXMuX29uTG9nb3V0Q2xpY2suYmluZCh0aGlzKTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSk7XG4gICAgICB0aGlzLiRkb20oKS5maW5kKCcubG9nb3V0Jykub24oJ2NsaWNrJywgdGhpcy5fb25Mb2dvdXRDbGljaylcblxuICAgICAgaWYgKFV0aWxzLnVybFBhcmFtKCd1aWQnKSkge1xuICAgICAgICB0aGlzLiRkb20oKS5maW5kKCcubG9nb3V0JykuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCd1c2VyJykpIHtcblxuICAgICAgICB0aGlzLiRkb20oKS5maW5kKCcudXNlcicpLmh0bWwoR2xvYmFscy5nZXQoJ3VzZXInKSk7XG4gICAgICAgIHRoaXMuJGRvbSgpLmFkZENsYXNzKCdwcm9maWxlX19vcGVuJyk7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRoaXMuJGRvbSgpLmZpbmQoJy51c2VyJykuaHRtbCgnJyk7XG4gICAgICAgIHRoaXMuJGRvbSgpLnJlbW92ZUNsYXNzKCdwcm9maWxlX19vcGVuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTG9nb3V0Q2xpY2soanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnTG9naW4uTG9nb3V0Jywge30pO1xuICAgICAganFldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
