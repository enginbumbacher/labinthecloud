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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQnV0dG9uIiwiU2xpZGVyRmllbGQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImZpbmQiLCJjc3MiLCJ3aWR0aCIsImdldCIsImhlaWdodCIsInBsYXlQYXVzZUJ1dHRvbiIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJldmVudE5hbWUiLCJzdHlsZSIsImV2ZW50U3R5bGUiLCJyZXNldEJ1dHRvbiIsImFkZENoaWxkIiwidmlldyIsInZpZGVvU2xpZGVyIiwibWluIiwibWF4Iiwic3RlcHMiLCJkZWZhdWx0VmFsdWUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU2xpZGVyQ2hhbmdlIiwiX29uU3RvcERyYWciLCJ0aW1lIiwidGV4dCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJzZXRWYWx1ZSIsInRvRml4ZWQiLCJwbGF5aW5nIiwic2V0TGFiZWwiLCJldnQiLCJkaXNwYXRjaEV2ZW50Iiwic2xpZGVyVmFsdWUiLCJjdXJyZW50VGFyZ2V0IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsMEJBQVIsQ0FEYjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjtBQUFBLE1BR0VJLFVBQVVKLFFBQVEsb0JBQVIsQ0FIWjtBQUFBLE1BSUVLLFNBQVNMLFFBQVEsNkJBQVIsQ0FKWDtBQUFBLE1BS0VNLGNBQWNOLFFBQVEsa0NBQVIsQ0FMaEI7O0FBUUFBLFVBQVEseUJBQVI7O0FBRUE7QUFBQTs7QUFDRSw4QkFBWU8sS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxzSUFDakJBLFFBQVFOLFFBRFM7O0FBRXZCQyxZQUFNTSxXQUFOLFFBQXdCLENBQUMsaUJBQUQsRUFBbUIsYUFBbkIsQ0FBeEI7O0FBRUEsWUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNDLEdBQXpDLENBQTZDO0FBQzNDQyxlQUFPTixNQUFNTyxHQUFOLENBQVUsT0FBVixDQURvQztBQUUzQ0MsZ0JBQVFSLE1BQU1PLEdBQU4sQ0FBVSxRQUFWO0FBRm1DLE9BQTdDOztBQUtBLFlBQUtFLGVBQUwsR0FBdUJYLE9BQU9ZLE1BQVAsQ0FBYztBQUNuQ0MsWUFBSSxXQUQrQjtBQUVuQ0MsZUFBTyxPQUY0QjtBQUduQ0MsbUJBQVcsK0JBSHdCO0FBSW5DQyxlQUFPLGdDQUo0QjtBQUtuQ0Msb0JBQVk7QUFMdUIsT0FBZCxDQUF2QjtBQU9BLFlBQUtDLFdBQUwsR0FBbUJsQixPQUFPWSxNQUFQLENBQWM7QUFDL0JDLFlBQUksT0FEMkI7QUFFL0JDLGVBQU8sT0FGd0I7QUFHL0JDLG1CQUFXLDJCQUhvQjtBQUkvQkMsZUFBTywrQkFKd0I7QUFLL0JDLG9CQUFZO0FBTG1CLE9BQWQsQ0FBbkI7QUFPQSxZQUFLRSxRQUFMLENBQWMsTUFBS1IsZUFBTCxDQUFxQlMsSUFBckIsRUFBZCxFQUEyQyx5QkFBM0M7QUFDQSxZQUFLRCxRQUFMLENBQWMsTUFBS0QsV0FBTCxDQUFpQkUsSUFBakIsRUFBZCxFQUF1Qyx5QkFBdkM7O0FBRUEsWUFBS0MsV0FBTCxHQUFtQnBCLFlBQVlXLE1BQVosQ0FBbUI7QUFDcENFLGVBQU8sRUFENkI7QUFFcENRLGFBQUssQ0FGK0I7QUFHcENDLGFBQUt4QixRQUFRVSxHQUFSLENBQVksa0NBQVosQ0FIK0I7QUFJcENlLGVBQU8sR0FKNkI7QUFLcENDLHNCQUFjO0FBTHNCLE9BQW5CLENBQW5CO0FBT0EsWUFBS04sUUFBTCxDQUFjLE1BQUtFLFdBQUwsQ0FBaUJELElBQWpCLEVBQWQsRUFBdUMseUJBQXZDO0FBQ0EsWUFBS0MsV0FBTCxDQUFpQkssZ0JBQWpCLENBQWtDLGNBQWxDLEVBQWtELE1BQUtDLGVBQXZEO0FBQ0EsWUFBS04sV0FBTCxDQUFpQkssZ0JBQWpCLENBQWtDLGdCQUFsQyxFQUFvRCxNQUFLRSxXQUF6RDs7QUFuQ3VCO0FBcUN4Qjs7QUF0Q0g7QUFBQTtBQUFBLDJCQXdDT0MsSUF4Q1AsRUF3Q2E7QUFDVCxhQUFLeEIsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0N3QixJQUF0QyxDQUEyQ2hDLE1BQU1pQyxtQkFBTixDQUEwQkYsSUFBMUIsQ0FBM0M7QUFDQSxhQUFLUixXQUFMLENBQWlCVyxRQUFqQixDQUEwQkgsS0FBS0ksT0FBTCxDQUFhLENBQWIsQ0FBMUI7QUFDRDtBQTNDSDtBQUFBO0FBQUEsc0NBNkNrQkMsT0E3Q2xCLEVBNkMyQjtBQUN2QixhQUFLdkIsZUFBTCxDQUFxQndCLFFBQXJCLENBQThCRCxVQUFVLE9BQVYsR0FBb0IsTUFBbEQ7QUFDRDtBQS9DSDtBQUFBO0FBQUEsc0NBaURrQkUsR0FqRGxCLEVBaUR1QjtBQUNuQnJDLGdCQUFRVSxHQUFSLENBQVksT0FBWixFQUFxQjRCLGFBQXJCLENBQW1DLDRCQUFuQyxFQUFpRTtBQUMvREMsdUJBQWFGLElBQUlHLGFBQUosQ0FBa0JDLEtBQWxCO0FBRGtELFNBQWpFO0FBR0Q7QUFyREg7QUFBQTtBQUFBLGtDQXVEY0osR0F2RGQsRUF1RG1CO0FBQ2ZyQyxnQkFBUVUsR0FBUixDQUFZLE9BQVosRUFBcUI0QixhQUFyQixDQUFtQyx1QkFBbkMsRUFBMkQsRUFBM0Q7QUFDRDtBQXpESDs7QUFBQTtBQUFBLElBQXNDekMsT0FBdEM7QUE0REQsQ0F2RUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi92aXN1YWxyZXN1bHQuaHRtbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEJ1dHRvbiA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2J1dHRvbi9maWVsZCcpLFxuICAgIFNsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvZmllbGQnKTtcblxuXG4gIHJlcXVpcmUoJ2xpbmshLi92aXN1YWxyZXN1bHQuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFZpc3VhbFJlc3VsdFZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblNsaWRlckNoYW5nZScsJ19vblN0b3BEcmFnJ10pO1xuXG4gICAgICB0aGlzLiRlbC5maW5kKCcudmlzdWFsLXJlc3VsdF9fY29udGVudCcpLmNzcyh7XG4gICAgICAgIHdpZHRoOiBtb2RlbC5nZXQoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogbW9kZWwuZ2V0KCdoZWlnaHQnKVxuICAgICAgfSlcbiAgICAgIFxuICAgICAgdGhpcy5wbGF5UGF1c2VCdXR0b24gPSBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6IFwicGxheVBhdXNlXCIsXG4gICAgICAgIGxhYmVsOiBcIlBhdXNlXCIsXG4gICAgICAgIGV2ZW50TmFtZTogXCJWaXN1YWxSZXN1bHQuUGxheVBhdXNlUmVxdWVzdFwiLFxuICAgICAgICBzdHlsZTogXCJ2aXN1YWwtcmVzdWx0X19jb250cm9sX190b2dnbGVcIixcbiAgICAgICAgZXZlbnRTdHlsZTogJ2dsb2JhbCdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3Jlc2V0JyxcbiAgICAgICAgbGFiZWw6ICdSZXNldCcsXG4gICAgICAgIGV2ZW50TmFtZTogJ1Zpc3VhbFJlc3VsdC5SZXNldFJlcXVlc3QnLFxuICAgICAgICBzdHlsZTogJ3Zpc3VhbC1yZXN1bHRfX2NvbnRyb2xfX3Jlc2V0JyxcbiAgICAgICAgZXZlbnRTdHlsZTogJ2dsb2JhbCdcbiAgICAgIH0pXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMucGxheVBhdXNlQnV0dG9uLnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udHJvbFwiKVxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnJlc2V0QnV0dG9uLnZpZXcoKSwgJy52aXN1YWwtcmVzdWx0X19jb250cm9sJylcblxuICAgICAgdGhpcy52aWRlb1NsaWRlciA9IFNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgbWluOiAwLFxuICAgICAgICBtYXg6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpLFxuICAgICAgICBzdGVwczogMC41LFxuICAgICAgICBkZWZhdWx0VmFsdWU6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMudmlkZW9TbGlkZXIudmlldygpLCAnLnZpc3VhbC1yZXN1bHRfX2NvbnRyb2wnKVxuICAgICAgdGhpcy52aWRlb1NsaWRlci5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vblNsaWRlckNoYW5nZSk7XG4gICAgICB0aGlzLnZpZGVvU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLlN0b3BEcmFnJywgdGhpcy5fb25TdG9wRHJhZyk7XG5cbiAgICB9XG5cbiAgICB0aWNrKHRpbWUpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy52aXN1YWwtcmVzdWx0X190aW1lJykudGV4dChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKVxuICAgICAgdGhpcy52aWRlb1NsaWRlci5zZXRWYWx1ZSh0aW1lLnRvRml4ZWQoMSkpXG4gICAgfVxuXG4gICAgaGFuZGxlUGxheVN0YXRlKHBsYXlpbmcpIHtcbiAgICAgIHRoaXMucGxheVBhdXNlQnV0dG9uLnNldExhYmVsKHBsYXlpbmcgPyBcIlBhdXNlXCIgOiBcIlBsYXlcIik7XG4gICAgfVxuXG4gICAgX29uU2xpZGVyQ2hhbmdlKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlNsaWRlclJlcXVlc3QnLCB7XG4gICAgICAgIHNsaWRlclZhbHVlOiBldnQuY3VycmVudFRhcmdldC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblN0b3BEcmFnKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlN0b3BEcmFnJyx7fSlcbiAgICB9XG5cbiAgfVxufSlcbiJdfQ==
