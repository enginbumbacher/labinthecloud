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
        this.dispatchEvent('VisualResult.SliderRequest', {
          sliderValue: evt.currentTarget.value()
        });
      }
    }, {
      key: '_onStopDrag',
      value: function _onStopDrag(evt) {
        this.dispatchEvent('VisualResult.StopDrag', {});
      }
    }]);

    return VisualResultView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQnV0dG9uIiwiU2xpZGVyRmllbGQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImZpbmQiLCJjc3MiLCJ3aWR0aCIsImdldCIsImhlaWdodCIsInBsYXlQYXVzZUJ1dHRvbiIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJldmVudE5hbWUiLCJzdHlsZSIsInJlc2V0QnV0dG9uIiwiYWRkQ2hpbGQiLCJ2aWV3IiwidmlkZW9TbGlkZXIiLCJtaW4iLCJtYXgiLCJzdGVwcyIsImRlZmF1bHRWYWx1ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25TbGlkZXJDaGFuZ2UiLCJfb25TdG9wRHJhZyIsInRpbWUiLCJ0ZXh0Iiwic2Vjb25kc1RvVGltZVN0cmluZyIsInNldFZhbHVlIiwidG9GaXhlZCIsInBsYXlpbmciLCJzZXRMYWJlbCIsImV2dCIsImRpc3BhdGNoRXZlbnQiLCJzbGlkZXJWYWx1ZSIsImN1cnJlbnRUYXJnZXQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSwwQkFBUixDQURiO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksVUFBVUosUUFBUSxvQkFBUixDQUhaO0FBQUEsTUFJRUssU0FBU0wsUUFBUSw2QkFBUixDQUpYO0FBQUEsTUFLRU0sY0FBY04sUUFBUSxrQ0FBUixDQUxoQjs7QUFRQUEsVUFBUSx5QkFBUjs7QUFFQTtBQUFBOztBQUNFLDhCQUFZTyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNJQUNqQkEsUUFBUU4sUUFEUzs7QUFFdkJDLFlBQU1NLFdBQU4sUUFBd0IsQ0FBQyxpQkFBRCxFQUFtQixhQUFuQixDQUF4Qjs7QUFFQSxZQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q0MsR0FBekMsQ0FBNkM7QUFDM0NDLGVBQU9OLE1BQU1PLEdBQU4sQ0FBVSxPQUFWLENBRG9DO0FBRTNDQyxnQkFBUVIsTUFBTU8sR0FBTixDQUFVLFFBQVY7QUFGbUMsT0FBN0M7QUFJQSxZQUFLRSxlQUFMLEdBQXVCWCxPQUFPWSxNQUFQLENBQWM7QUFDbkNDLFlBQUksV0FEK0I7QUFFbkNDLGVBQU8sT0FGNEI7QUFHbkNDLG1CQUFXLCtCQUh3QjtBQUluQ0MsZUFBTztBQUo0QixPQUFkLENBQXZCO0FBTUEsWUFBS0MsV0FBTCxHQUFtQmpCLE9BQU9ZLE1BQVAsQ0FBYztBQUMvQkMsWUFBSSxPQUQyQjtBQUUvQkMsZUFBTyxPQUZ3QjtBQUcvQkMsbUJBQVcsMkJBSG9CO0FBSS9CQyxlQUFPO0FBSndCLE9BQWQsQ0FBbkI7QUFNQSxZQUFLRSxRQUFMLENBQWMsTUFBS1AsZUFBTCxDQUFxQlEsSUFBckIsRUFBZCxFQUEyQyx5QkFBM0M7QUFDQSxZQUFLRCxRQUFMLENBQWMsTUFBS0QsV0FBTCxDQUFpQkUsSUFBakIsRUFBZCxFQUF1Qyx5QkFBdkM7O0FBRUEsWUFBS0MsV0FBTCxHQUFtQm5CLFlBQVlXLE1BQVosQ0FBbUI7QUFDcENFLGVBQU8sRUFENkI7QUFFcENPLGFBQUssQ0FGK0I7QUFHcENDLGFBQUt2QixRQUFRVSxHQUFSLENBQVksa0NBQVosQ0FIK0I7QUFJcENjLGVBQU8sR0FKNkI7QUFLcENDLHNCQUFjO0FBTHNCLE9BQW5CLENBQW5CO0FBT0EsWUFBS04sUUFBTCxDQUFjLE1BQUtFLFdBQUwsQ0FBaUJELElBQWpCLEVBQWQsRUFBdUMseUJBQXZDO0FBQ0EsWUFBS0MsV0FBTCxDQUFpQkssZ0JBQWpCLENBQWtDLGNBQWxDLEVBQWtELE1BQUtDLGVBQXZEO0FBQ0EsWUFBS04sV0FBTCxDQUFpQkssZ0JBQWpCLENBQWtDLGdCQUFsQyxFQUFvRCxNQUFLRSxXQUF6RDtBQWhDdUI7QUFpQ3hCOztBQWxDSDtBQUFBO0FBQUEsMkJBb0NPQyxJQXBDUCxFQW9DYTtBQUNULGFBQUt2QixHQUFMLENBQVNDLElBQVQsQ0FBYyxzQkFBZCxFQUFzQ3VCLElBQXRDLENBQTJDL0IsTUFBTWdDLG1CQUFOLENBQTBCRixJQUExQixDQUEzQztBQUNBLGFBQUtSLFdBQUwsQ0FBaUJXLFFBQWpCLENBQTBCSCxLQUFLSSxPQUFMLENBQWEsQ0FBYixDQUExQjtBQUNEO0FBdkNIO0FBQUE7QUFBQSxzQ0F5Q2tCQyxPQXpDbEIsRUF5QzJCO0FBQ3ZCLGFBQUt0QixlQUFMLENBQXFCdUIsUUFBckIsQ0FBOEJELFVBQVUsT0FBVixHQUFvQixNQUFsRDtBQUNEO0FBM0NIO0FBQUE7QUFBQSxzQ0E2Q2tCRSxHQTdDbEIsRUE2Q3VCO0FBQ25CLGFBQUtDLGFBQUwsQ0FBbUIsNEJBQW5CLEVBQWlEO0FBQy9DQyx1QkFBYUYsSUFBSUcsYUFBSixDQUFrQkMsS0FBbEI7QUFEa0MsU0FBakQ7QUFHRDtBQWpESDtBQUFBO0FBQUEsa0NBbURjSixHQW5EZCxFQW1EbUI7QUFDZixhQUFLQyxhQUFMLENBQW1CLHVCQUFuQixFQUEyQyxFQUEzQztBQUNEO0FBckRIOztBQUFBO0FBQUEsSUFBc0N4QyxPQUF0QztBQXVERCxDQWxFRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
