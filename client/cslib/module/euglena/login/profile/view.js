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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ProfileView).call(this, Template));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2xvZ2luL3Byb2ZpbGUvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFVBQVUsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0UsVUFBVSxRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFLFdBQVcsUUFBUSxxQkFBUixDQUZiO0FBQUEsTUFHRSxRQUFRLFFBQVEsaUJBQVIsQ0FIVjs7QUFLQTtBQUFBOztBQUNFLDJCQUFjO0FBQUE7O0FBQUEsaUdBQ04sUUFETTs7QUFFWixZQUFLLGNBQUwsR0FBc0IsTUFBSyxjQUFMLENBQW9CLElBQXBCLE9BQXRCO0FBQ0EsWUFBSyxjQUFMLEdBQXNCLE1BQUssY0FBTCxDQUFvQixJQUFwQixPQUF0Qjs7QUFFQSxjQUFRLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBSyxjQUE5RDtBQUNBLFlBQUssSUFBTCxHQUFZLElBQVosQ0FBaUIsU0FBakIsRUFBNEIsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0MsTUFBSyxjQUE3Qzs7QUFFQSxVQUFJLE1BQU0sUUFBTixDQUFlLEtBQWYsQ0FBSixFQUEyQjtBQUN6QixjQUFLLElBQUwsR0FBWSxJQUFaLENBQWlCLFNBQWpCLEVBQTRCLElBQTVCO0FBQ0Q7QUFWVztBQVdiOztBQVpIO0FBQUE7QUFBQSxxQ0FjaUIsR0FkakIsRUFjc0I7QUFDbEIsWUFBSSxRQUFRLEdBQVIsQ0FBWSxNQUFaLENBQUosRUFBeUI7QUFDdkIsZUFBSyxJQUFMLEdBQVksSUFBWixDQUFpQixPQUFqQixFQUEwQixJQUExQixDQUErQixRQUFRLEdBQVIsQ0FBWSxNQUFaLENBQS9CO0FBQ0EsZUFBSyxJQUFMLEdBQVksUUFBWixDQUFxQixlQUFyQjtBQUNELFNBSEQsTUFHTztBQUNMLGVBQUssSUFBTCxHQUFZLElBQVosQ0FBaUIsT0FBakIsRUFBMEIsSUFBMUIsQ0FBK0IsRUFBL0I7QUFDQSxlQUFLLElBQUwsR0FBWSxXQUFaLENBQXdCLGVBQXhCO0FBQ0Q7QUFDRjtBQXRCSDtBQUFBO0FBQUEscUNBd0JpQixLQXhCakIsRUF3QndCO0FBQ3BCLGFBQUssYUFBTCxDQUFtQixjQUFuQixFQUFtQyxFQUFuQztBQUNBLGNBQU0sY0FBTjtBQUNBLGVBQU8sS0FBUDtBQUNEO0FBNUJIOztBQUFBO0FBQUEsSUFBaUMsT0FBakM7QUE4QkQsQ0FwQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbG9naW4vcHJvZmlsZS92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
