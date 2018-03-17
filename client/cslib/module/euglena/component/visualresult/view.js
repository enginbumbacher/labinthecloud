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
      _this.playbackButton = Button.create({
        id: 'playbackRate',
        label: 'Normal Speed',
        eventName: 'VisualResult.PlaybackRateRequest',
        style: 'visual-result__control__playback',
        eventStyle: 'global'
      });

      _this.addChild(_this.playbackButton.view(), ".visual-result__control");
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
      key: 'handlePlaybackState',
      value: function handlePlaybackState(faster) {
        this.playbackButton.setLabel(faster ? "Faster Speed" : "Normal Speed");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQnV0dG9uIiwiU2xpZGVyRmllbGQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImZpbmQiLCJjc3MiLCJ3aWR0aCIsImdldCIsImhlaWdodCIsInBsYXlQYXVzZUJ1dHRvbiIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJldmVudE5hbWUiLCJzdHlsZSIsImV2ZW50U3R5bGUiLCJyZXNldEJ1dHRvbiIsInBsYXliYWNrQnV0dG9uIiwiYWRkQ2hpbGQiLCJ2aWV3IiwidmlkZW9TbGlkZXIiLCJtaW4iLCJtYXgiLCJzdGVwcyIsImRlZmF1bHRWYWx1ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25TbGlkZXJDaGFuZ2UiLCJfb25TdG9wRHJhZyIsInRpbWUiLCJ0ZXh0Iiwic2Vjb25kc1RvVGltZVN0cmluZyIsInNldFZhbHVlIiwidG9GaXhlZCIsInBsYXlpbmciLCJzZXRMYWJlbCIsImZhc3RlciIsImV2dCIsImRpc3BhdGNoRXZlbnQiLCJzbGlkZXJWYWx1ZSIsImN1cnJlbnRUYXJnZXQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSwwQkFBUixDQURiO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksVUFBVUosUUFBUSxvQkFBUixDQUhaO0FBQUEsTUFJRUssU0FBU0wsUUFBUSw2QkFBUixDQUpYO0FBQUEsTUFLRU0sY0FBY04sUUFBUSxrQ0FBUixDQUxoQjs7QUFRQUEsVUFBUSx5QkFBUjs7QUFFQTtBQUFBOztBQUNFLDhCQUFZTyxLQUFa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akU7QUFHRDtBQWxFSDtBQUFBO0FBQUEsa0NBb0VjSixHQXBFZCxFQW9FbUI7QUFDZnZDLGdCQUFRVSxHQUFSLENBQVksT0FBWixFQUFxQjhCLGFBQXJCLENBQW1DLHVCQUFuQyxFQUEyRCxFQUEzRDtBQUNEO0FBdEVIOztBQUFBO0FBQUEsSUFBc0MzQyxPQUF0QztBQXlFRCxDQXBGRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3Zpc3VhbHJlc3VsdC5odG1sJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyksXG4gICAgU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpO1xuXG5cbiAgcmVxdWlyZSgnbGluayEuL3Zpc3VhbHJlc3VsdC5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgVmlzdWFsUmVzdWx0VmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uU2xpZGVyQ2hhbmdlJywnX29uU3RvcERyYWcnXSk7XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy52aXN1YWwtcmVzdWx0X19jb250ZW50JykuY3NzKHtcbiAgICAgICAgd2lkdGg6IG1vZGVsLmdldCgnd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiBtb2RlbC5nZXQoJ2hlaWdodCcpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnBsYXlQYXVzZUJ1dHRvbiA9IEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogXCJwbGF5UGF1c2VcIixcbiAgICAgICAgbGFiZWw6IFwiUGF1c2VcIixcbiAgICAgICAgZXZlbnROYW1lOiBcIlZpc3VhbFJlc3VsdC5QbGF5UGF1c2VSZXF1ZXN0XCIsXG4gICAgICAgIHN0eWxlOiBcInZpc3VhbC1yZXN1bHRfX2NvbnRyb2xfX3RvZ2dsZVwiLFxuICAgICAgICBldmVudFN0eWxlOiAnZ2xvYmFsJ1xuICAgICAgfSk7XG4gICAgICB0aGlzLnJlc2V0QnV0dG9uID0gQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAncmVzZXQnLFxuICAgICAgICBsYWJlbDogJ1Jlc2V0JyxcbiAgICAgICAgZXZlbnROYW1lOiAnVmlzdWFsUmVzdWx0LlJlc2V0UmVxdWVzdCcsXG4gICAgICAgIHN0eWxlOiAndmlzdWFsLXJlc3VsdF9fY29udHJvbF9fcmVzZXQnLFxuICAgICAgICBldmVudFN0eWxlOiAnZ2xvYmFsJ1xuICAgICAgfSlcbiAgICAgIHRoaXMucGxheWJhY2tCdXR0b24gPSBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdwbGF5YmFja1JhdGUnLFxuICAgICAgICBsYWJlbDogJ05vcm1hbCBTcGVlZCcsXG4gICAgICAgIGV2ZW50TmFtZTogJ1Zpc3VhbFJlc3VsdC5QbGF5YmFja1JhdGVSZXF1ZXN0JyxcbiAgICAgICAgc3R5bGU6ICd2aXN1YWwtcmVzdWx0X19jb250cm9sX19wbGF5YmFjaycsXG4gICAgICAgIGV2ZW50U3R5bGU6ICdnbG9iYWwnXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMucGxheWJhY2tCdXR0b24udmlldygpLCBcIi52aXN1YWwtcmVzdWx0X19jb250cm9sXCIpXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMucGxheVBhdXNlQnV0dG9uLnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udHJvbFwiKVxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnJlc2V0QnV0dG9uLnZpZXcoKSwgJy52aXN1YWwtcmVzdWx0X19jb250cm9sJylcblxuICAgICAgdGhpcy52aWRlb1NsaWRlciA9IFNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGxhYmVsOiAnJyxcbiAgICAgICAgbWluOiAwLFxuICAgICAgICBtYXg6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpLFxuICAgICAgICBzdGVwczogMC41LFxuICAgICAgICBkZWZhdWx0VmFsdWU6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMudmlkZW9TbGlkZXIudmlldygpLCAnLnZpc3VhbC1yZXN1bHRfX2NvbnRyb2wnKVxuICAgICAgdGhpcy52aWRlb1NsaWRlci5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5DaGFuZ2UnLCB0aGlzLl9vblNsaWRlckNoYW5nZSk7XG4gICAgICB0aGlzLnZpZGVvU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLlN0b3BEcmFnJywgdGhpcy5fb25TdG9wRHJhZyk7XG5cbiAgICB9XG5cbiAgICB0aWNrKHRpbWUpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy52aXN1YWwtcmVzdWx0X190aW1lJykudGV4dChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKVxuICAgICAgdGhpcy52aWRlb1NsaWRlci5zZXRWYWx1ZSh0aW1lLnRvRml4ZWQoMSkpXG4gICAgfVxuXG4gICAgaGFuZGxlUGxheVN0YXRlKHBsYXlpbmcpIHtcbiAgICAgIHRoaXMucGxheVBhdXNlQnV0dG9uLnNldExhYmVsKHBsYXlpbmcgPyBcIlBhdXNlXCIgOiBcIlBsYXlcIik7XG4gICAgfVxuXG4gICAgaGFuZGxlUGxheWJhY2tTdGF0ZShmYXN0ZXIpIHtcbiAgICAgIHRoaXMucGxheWJhY2tCdXR0b24uc2V0TGFiZWwoZmFzdGVyID8gXCJGYXN0ZXIgU3BlZWRcIiA6IFwiTm9ybWFsIFNwZWVkXCIpO1xuICAgIH1cblxuICAgIF9vblNsaWRlckNoYW5nZShldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ1Zpc3VhbFJlc3VsdC5TbGlkZXJSZXF1ZXN0Jywge1xuICAgICAgICBzbGlkZXJWYWx1ZTogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25TdG9wRHJhZyhldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ1Zpc3VhbFJlc3VsdC5TdG9wRHJhZycse30pXG4gICAgfVxuXG4gIH1cbn0pXG4iXX0=
