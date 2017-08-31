'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./visualresult.html'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      Button = require('core/component/button/field');

  require('link!./visualresult.css');

  return function (_DomView) {
    _inherits(VisualResultView, _DomView);

    function VisualResultView(model, tmpl) {
      _classCallCheck(this, VisualResultView);

      var _this = _possibleConstructorReturn(this, (VisualResultView.__proto__ || Object.getPrototypeOf(VisualResultView)).call(this, tmpl || Template));

      _this.$el.find('.visual-result__content').css({
        width: model.get('width'),
        height: model.get('height')
      });
      _this.playPauseButton = Button.create({
        id: "playPause",
        label: "Pause",
        eventName: "VisualResult.PlayPauseRequest",
        style: "visual-result__control__toggle"
      });
      _this.resetButton = Button.create({
        id: 'reset',
        label: 'Reset',
        eventName: 'VisualResult.ResetRequest',
        style: 'visual-result__control__reset'
      });
      _this.addChild(_this.playPauseButton.view(), ".visual-result__control");
      _this.addChild(_this.resetButton.view(), '.visual-result__control');
      return _this;
    }

    _createClass(VisualResultView, [{
      key: 'tick',
      value: function tick(time) {
        this.$el.find('.visual-result__time').text(Utils.secondsToTimeString(time));
      }
    }, {
      key: 'handlePlayState',
      value: function handlePlayState(playing) {
        this.playPauseButton.setLabel(playing ? "Pause" : "Play");
      }
    }]);

    return VisualResultView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQnV0dG9uIiwibW9kZWwiLCJ0bXBsIiwiJGVsIiwiZmluZCIsImNzcyIsIndpZHRoIiwiZ2V0IiwiaGVpZ2h0IiwicGxheVBhdXNlQnV0dG9uIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsImV2ZW50TmFtZSIsInN0eWxlIiwicmVzZXRCdXR0b24iLCJhZGRDaGlsZCIsInZpZXciLCJ0aW1lIiwidGV4dCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJwbGF5aW5nIiwic2V0TGFiZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsMEJBQVIsQ0FEYjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjtBQUFBLE1BR0VJLFVBQVVKLFFBQVEsb0JBQVIsQ0FIWjtBQUFBLE1BSUVLLFNBQVNMLFFBQVEsNkJBQVIsQ0FKWDs7QUFNQUEsVUFBUSx5QkFBUjs7QUFFQTtBQUFBOztBQUNFLDhCQUFZTSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNJQUNqQkEsUUFBUUwsUUFEUzs7QUFHdkIsWUFBS00sR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNDLEdBQXpDLENBQTZDO0FBQzNDQyxlQUFPTCxNQUFNTSxHQUFOLENBQVUsT0FBVixDQURvQztBQUUzQ0MsZ0JBQVFQLE1BQU1NLEdBQU4sQ0FBVSxRQUFWO0FBRm1DLE9BQTdDO0FBSUEsWUFBS0UsZUFBTCxHQUF1QlQsT0FBT1UsTUFBUCxDQUFjO0FBQ25DQyxZQUFJLFdBRCtCO0FBRW5DQyxlQUFPLE9BRjRCO0FBR25DQyxtQkFBVywrQkFId0I7QUFJbkNDLGVBQU87QUFKNEIsT0FBZCxDQUF2QjtBQU1BLFlBQUtDLFdBQUwsR0FBbUJmLE9BQU9VLE1BQVAsQ0FBYztBQUMvQkMsWUFBSSxPQUQyQjtBQUUvQkMsZUFBTyxPQUZ3QjtBQUcvQkMsbUJBQVcsMkJBSG9CO0FBSS9CQyxlQUFPO0FBSndCLE9BQWQsQ0FBbkI7QUFNQSxZQUFLRSxRQUFMLENBQWMsTUFBS1AsZUFBTCxDQUFxQlEsSUFBckIsRUFBZCxFQUEyQyx5QkFBM0M7QUFDQSxZQUFLRCxRQUFMLENBQWMsTUFBS0QsV0FBTCxDQUFpQkUsSUFBakIsRUFBZCxFQUF1Qyx5QkFBdkM7QUFwQnVCO0FBcUJ4Qjs7QUF0Qkg7QUFBQTtBQUFBLDJCQXdCT0MsSUF4QlAsRUF3QmE7QUFDVCxhQUFLZixHQUFMLENBQVNDLElBQVQsQ0FBYyxzQkFBZCxFQUFzQ2UsSUFBdEMsQ0FBMkNyQixNQUFNc0IsbUJBQU4sQ0FBMEJGLElBQTFCLENBQTNDO0FBQ0Q7QUExQkg7QUFBQTtBQUFBLHNDQTRCa0JHLE9BNUJsQixFQTRCMkI7QUFDdkIsYUFBS1osZUFBTCxDQUFxQmEsUUFBckIsQ0FBOEJELFVBQVUsT0FBVixHQUFvQixNQUFsRDtBQUNEO0FBOUJIOztBQUFBO0FBQUEsSUFBc0N6QixPQUF0QztBQWdDRCxDQXpDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Zpc3VhbHJlc3VsdC5odG1sJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3Zpc3VhbHJlc3VsdC5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgVmlzdWFsUmVzdWx0VmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcblxuICAgICAgdGhpcy4kZWwuZmluZCgnLnZpc3VhbC1yZXN1bHRfX2NvbnRlbnQnKS5jc3Moe1xuICAgICAgICB3aWR0aDogbW9kZWwuZ2V0KCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IG1vZGVsLmdldCgnaGVpZ2h0JylcbiAgICAgIH0pXG4gICAgICB0aGlzLnBsYXlQYXVzZUJ1dHRvbiA9IEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogXCJwbGF5UGF1c2VcIixcbiAgICAgICAgbGFiZWw6IFwiUGF1c2VcIixcbiAgICAgICAgZXZlbnROYW1lOiBcIlZpc3VhbFJlc3VsdC5QbGF5UGF1c2VSZXF1ZXN0XCIsXG4gICAgICAgIHN0eWxlOiBcInZpc3VhbC1yZXN1bHRfX2NvbnRyb2xfX3RvZ2dsZVwiXG4gICAgICB9KTtcbiAgICAgIHRoaXMucmVzZXRCdXR0b24gPSBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdyZXNldCcsXG4gICAgICAgIGxhYmVsOiAnUmVzZXQnLFxuICAgICAgICBldmVudE5hbWU6ICdWaXN1YWxSZXN1bHQuUmVzZXRSZXF1ZXN0JyxcbiAgICAgICAgc3R5bGU6ICd2aXN1YWwtcmVzdWx0X19jb250cm9sX19yZXNldCdcbiAgICAgIH0pXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMucGxheVBhdXNlQnV0dG9uLnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udHJvbFwiKVxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnJlc2V0QnV0dG9uLnZpZXcoKSwgJy52aXN1YWwtcmVzdWx0X19jb250cm9sJylcbiAgICB9XG5cbiAgICB0aWNrKHRpbWUpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy52aXN1YWwtcmVzdWx0X190aW1lJykudGV4dChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKVxuICAgIH1cblxuICAgIGhhbmRsZVBsYXlTdGF0ZShwbGF5aW5nKSB7XG4gICAgICB0aGlzLnBsYXlQYXVzZUJ1dHRvbi5zZXRMYWJlbChwbGF5aW5nID8gXCJQYXVzZVwiIDogXCJQbGF5XCIpO1xuICAgIH1cbiAgfVxufSkiXX0=
