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
      Button = require('core/component/button/field'),
      SliderField = require('core/component/sliderfield/field');

  require('link!./visualresult.css');

  return function (_DomView) {
    _inherits(VisualResultView, _DomView);

    function VisualResultView(model, tmpl) {
      _classCallCheck(this, VisualResultView);

      var _this = _possibleConstructorReturn(this, (VisualResultView.__proto__ || Object.getPrototypeOf(VisualResultView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onSliderChange', '_onStopDrag']);

      _this.$el.find('.visual-result__content').css({
        width: model.get('width'),
        height: model.get('height')
      });
      _this.playPauseButton = Button.create({
        id: "playPause",
        label: "Pause",
        eventName: "VisualResult.PlayPauseRequest",
        style: "visual-result__control__toggle",
        eventStyle: 'global'
      });
      _this.resetButton = Button.create({
        id: 'reset',
        label: 'Reset',
        eventName: 'VisualResult.ResetRequest',
        style: 'visual-result__control__reset',
        eventStyle: 'global'
      });
      _this.addChild(_this.playPauseButton.view(), ".visual-result__control");
      _this.addChild(_this.resetButton.view(), '.visual-result__control');

      _this.videoSlider = SliderField.create({
        label: '',
        min: 0,
        max: Globals.get('AppConfig.experiment.maxDuration'),
        steps: 0.5,
        defaultValue: 0
      });
      _this.addChild(_this.videoSlider.view(), '.visual-result__control');
      _this.videoSlider.addEventListener('Field.Change', _this._onSliderChange);
      _this.videoSlider.addEventListener('Field.StopDrag', _this._onStopDrag);

      return _this;
    }

    _createClass(VisualResultView, [{
      key: 'tick',
      value: function tick(time) {
        this.$el.find('.visual-result__time').text(Utils.secondsToTimeString(time));
        this.videoSlider.setValue(time.toFixed(1));
      }
    }, {
      key: 'handlePlayState',
      value: function handlePlayState(playing) {
        this.playPauseButton.setLabel(playing ? "Pause" : "Play");
      }
    }, {
      key: '_onSliderChange',
      value: function _onSliderChange(evt) {
        Globals.get('Relay').dispatchEvent('VisualResult.SliderRequest', {
          sliderValue: evt.currentTarget.value()
        });
      }
    }, {
      key: '_onStopDrag',
      value: function _onStopDrag(evt) {
        Globals.get('Relay').dispatchEvent('VisualResult.StopDrag', {});
      }
    }]);

    return VisualResultView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQnV0dG9uIiwiU2xpZGVyRmllbGQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImZpbmQiLCJjc3MiLCJ3aWR0aCIsImdldCIsImhlaWdodCIsInBsYXlQYXVzZUJ1dHRvbiIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJldmVudE5hbWUiLCJzdHlsZSIsImV2ZW50U3R5bGUiLCJyZXNldEJ1dHRvbiIsImFkZENoaWxkIiwidmlldyIsInZpZGVvU2xpZGVyIiwibWluIiwibWF4Iiwic3RlcHMiLCJkZWZhdWx0VmFsdWUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU2xpZGVyQ2hhbmdlIiwiX29uU3RvcERyYWciLCJ0aW1lIiwidGV4dCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJzZXRWYWx1ZSIsInRvRml4ZWQiLCJwbGF5aW5nIiwic2V0TGFiZWwiLCJldnQiLCJkaXNwYXRjaEV2ZW50Iiwic2xpZGVyVmFsdWUiLCJjdXJyZW50VGFyZ2V0IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsMEJBQVIsQ0FEYjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjtBQUFBLE1BR0VJLFVBQVVKLFFBQVEsb0JBQVIsQ0FIWjtBQUFBLE1BSUVLLFNBQVNMLFFBQVEsNkJBQVIsQ0FKWDtBQUFBLE1BS0VNLGNBQWNOLFFBQVEsa0NBQVIsQ0FMaEI7O0FBUUFBLFVBQVEseUJBQVI7O0FBRUE7QUFBQTs7QUFDRSw4QkFBWU8sS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxzSUFDakJBLFFBQVFOLFFBRFM7O0FBRXZCQyxZQUFNTSxXQUFOLFFBQXdCLENBQUMsaUJBQUQsRUFBbUIsYUFBbkIsQ0FBeEI7O0FBRUEsWUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNDLEdBQXpDLENBQTZDO0FBQzNDQyxlQUFPTixNQUFNTyxHQUFOLENBQVUsT0FBVixDQURvQztBQUUzQ0MsZ0JBQVFSLE1BQU1PLEdBQU4sQ0FBVSxRQUFWO0FBRm1DLE9BQTdDO0FBSUEsWUFBS0UsZUFBTCxHQUF1QlgsT0FBT1ksTUFBUCxDQUFjO0FBQ25DQyxZQUFJLFdBRCtCO0FBRW5DQyxlQUFPLE9BRjRCO0FBR25DQyxtQkFBVywrQkFId0I7QUFJbkNDLGVBQU8sZ0NBSjRCO0FBS25DQyxvQkFBWTtBQUx1QixPQUFkLENBQXZCO0FBT0EsWUFBS0MsV0FBTCxHQUFtQmxCLE9BQU9ZLE1BQVAsQ0FBYztBQUMvQkMsWUFBSSxPQUQyQjtBQUUvQkMsZUFBTyxPQUZ3QjtBQUcvQkMsbUJBQVcsMkJBSG9CO0FBSS9CQyxlQUFPLCtCQUp3QjtBQUsvQkMsb0JBQVk7QUFMbUIsT0FBZCxDQUFuQjtBQU9BLFlBQUtFLFFBQUwsQ0FBYyxNQUFLUixlQUFMLENBQXFCUyxJQUFyQixFQUFkLEVBQTJDLHlCQUEzQztBQUNBLFlBQUtELFFBQUwsQ0FBYyxNQUFLRCxXQUFMLENBQWlCRSxJQUFqQixFQUFkLEVBQXVDLHlCQUF2Qzs7QUFFQSxZQUFLQyxXQUFMLEdBQW1CcEIsWUFBWVcsTUFBWixDQUFtQjtBQUNwQ0UsZUFBTyxFQUQ2QjtBQUVwQ1EsYUFBSyxDQUYrQjtBQUdwQ0MsYUFBS3hCLFFBQVFVLEdBQVIsQ0FBWSxrQ0FBWixDQUgrQjtBQUlwQ2UsZUFBTyxHQUo2QjtBQUtwQ0Msc0JBQWM7QUFMc0IsT0FBbkIsQ0FBbkI7QUFPQSxZQUFLTixRQUFMLENBQWMsTUFBS0UsV0FBTCxDQUFpQkQsSUFBakIsRUFBZCxFQUF1Qyx5QkFBdkM7QUFDQSxZQUFLQyxXQUFMLENBQWlCSyxnQkFBakIsQ0FBa0MsY0FBbEMsRUFBa0QsTUFBS0MsZUFBdkQ7QUFDQSxZQUFLTixXQUFMLENBQWlCSyxnQkFBakIsQ0FBa0MsZ0JBQWxDLEVBQW9ELE1BQUtFLFdBQXpEOztBQWxDdUI7QUFvQ3hCOztBQXJDSDtBQUFBO0FBQUEsMkJBdUNPQyxJQXZDUCxFQXVDYTtBQUNULGFBQUt4QixHQUFMLENBQVNDLElBQVQsQ0FBYyxzQkFBZCxFQUFzQ3dCLElBQXRDLENBQTJDaEMsTUFBTWlDLG1CQUFOLENBQTBCRixJQUExQixDQUEzQztBQUNBLGFBQUtSLFdBQUwsQ0FBaUJXLFFBQWpCLENBQTBCSCxLQUFLSSxPQUFMLENBQWEsQ0FBYixDQUExQjtBQUNEO0FBMUNIO0FBQUE7QUFBQSxzQ0E0Q2tCQyxPQTVDbEIsRUE0QzJCO0FBQ3ZCLGFBQUt2QixlQUFMLENBQXFCd0IsUUFBckIsQ0FBOEJELFVBQVUsT0FBVixHQUFvQixNQUFsRDtBQUNEO0FBOUNIO0FBQUE7QUFBQSxzQ0FnRGtCRSxHQWhEbEIsRUFnRHVCO0FBQ25CckMsZ0JBQVFVLEdBQVIsQ0FBWSxPQUFaLEVBQXFCNEIsYUFBckIsQ0FBbUMsNEJBQW5DLEVBQWlFO0FBQy9EQyx1QkFBYUYsSUFBSUcsYUFBSixDQUFrQkMsS0FBbEI7QUFEa0QsU0FBakU7QUFHRDtBQXBESDtBQUFBO0FBQUEsa0NBc0RjSixHQXREZCxFQXNEbUI7QUFDZnJDLGdCQUFRVSxHQUFSLENBQVksT0FBWixFQUFxQjRCLGFBQXJCLENBQW1DLHVCQUFuQyxFQUEyRCxFQUEzRDtBQUNEO0FBeERIOztBQUFBO0FBQUEsSUFBc0N6QyxPQUF0QztBQTJERCxDQXRFRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Zpc3VhbHJlc3VsdC5odG1sJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyksXG4gICAgU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpO1xuXG5cbiAgcmVxdWlyZSgnbGluayEuL3Zpc3VhbHJlc3VsdC5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgVmlzdWFsUmVzdWx0VmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uU2xpZGVyQ2hhbmdlJywnX29uU3RvcERyYWcnXSk7XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy52aXN1YWwtcmVzdWx0X19jb250ZW50JykuY3NzKHtcbiAgICAgICAgd2lkdGg6IG1vZGVsLmdldCgnd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiBtb2RlbC5nZXQoJ2hlaWdodCcpXG4gICAgICB9KVxuICAgICAgdGhpcy5wbGF5UGF1c2VCdXR0b24gPSBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6IFwicGxheVBhdXNlXCIsXG4gICAgICAgIGxhYmVsOiBcIlBhdXNlXCIsXG4gICAgICAgIGV2ZW50TmFtZTogXCJWaXN1YWxSZXN1bHQuUGxheVBhdXNlUmVxdWVzdFwiLFxuICAgICAgICBzdHlsZTogXCJ2aXN1YWwtcmVzdWx0X19jb250cm9sX190b2dnbGVcIixcbiAgICAgICAgZXZlbnRTdHlsZTogJ2dsb2JhbCdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3Jlc2V0JyxcbiAgICAgICAgbGFiZWw6ICdSZXNldCcsXG4gICAgICAgIGV2ZW50TmFtZTogJ1Zpc3VhbFJlc3VsdC5SZXNldFJlcXVlc3QnLFxuICAgICAgICBzdHlsZTogJ3Zpc3VhbC1yZXN1bHRfX2NvbnRyb2xfX3Jlc2V0JyxcbiAgICAgICAgZXZlbnRTdHlsZTogJ2dsb2JhbCdcbiAgICAgIH0pXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMucGxheVBhdXNlQnV0dG9uLnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udHJvbFwiKVxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnJlc2V0QnV0dG9uLnZpZXcoKSwgJy52aXN1YWwtcmVzdWx0X19jb250cm9sJylcblxuICAgICAgdGhpcy52aWRlb1NsaWRlciA9IFNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgbWluOiAwLFxuICAgICAgICBtYXg6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpLFxuICAgICAgICBzdGVwczogMC41LFxuICAgICAgICBkZWZhdWx0VmFsdWU6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMudmlkZW9TbGlkZXIudmlldygpLCAnLnZpc3VhbC1yZXN1bHRfX2NvbnRyb2wnKVxuICAgICAgdGhpcy52aWRlb1NsaWRlci5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vblNsaWRlckNoYW5nZSk7XG4gICAgICB0aGlzLnZpZGVvU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLlN0b3BEcmFnJywgdGhpcy5fb25TdG9wRHJhZyk7XG5cbiAgICB9XG5cbiAgICB0aWNrKHRpbWUpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy52aXN1YWwtcmVzdWx0X190aW1lJykudGV4dChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKVxuICAgICAgdGhpcy52aWRlb1NsaWRlci5zZXRWYWx1ZSh0aW1lLnRvRml4ZWQoMSkpXG4gICAgfVxuXG4gICAgaGFuZGxlUGxheVN0YXRlKHBsYXlpbmcpIHtcbiAgICAgIHRoaXMucGxheVBhdXNlQnV0dG9uLnNldExhYmVsKHBsYXlpbmcgPyBcIlBhdXNlXCIgOiBcIlBsYXlcIik7XG4gICAgfVxuXG4gICAgX29uU2xpZGVyQ2hhbmdlKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlNsaWRlclJlcXVlc3QnLCB7XG4gICAgICAgIHNsaWRlclZhbHVlOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblN0b3BEcmFnKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlN0b3BEcmFnJyx7fSlcbiAgICB9XG5cbiAgfVxufSlcbiJdfQ==
