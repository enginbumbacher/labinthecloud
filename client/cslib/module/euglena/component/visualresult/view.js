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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQnV0dG9uIiwiU2xpZGVyRmllbGQiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImZpbmQiLCJjc3MiLCJ3aWR0aCIsImdldCIsImhlaWdodCIsInBsYXlQYXVzZUJ1dHRvbiIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJldmVudE5hbWUiLCJzdHlsZSIsInJlc2V0QnV0dG9uIiwiYWRkQ2hpbGQiLCJ2aWV3IiwidmlkZW9TbGlkZXIiLCJtaW4iLCJtYXgiLCJzdGVwcyIsImRlZmF1bHRWYWx1ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25TbGlkZXJDaGFuZ2UiLCJfb25TdG9wRHJhZyIsInRpbWUiLCJ0ZXh0Iiwic2Vjb25kc1RvVGltZVN0cmluZyIsInNldFZhbHVlIiwidG9GaXhlZCIsInBsYXlpbmciLCJzZXRMYWJlbCIsImV2dCIsImRpc3BhdGNoRXZlbnQiLCJzbGlkZXJWYWx1ZSIsImN1cnJlbnRUYXJnZXQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSwwQkFBUixDQURiO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksVUFBVUosUUFBUSxvQkFBUixDQUhaO0FBQUEsTUFJRUssU0FBU0wsUUFBUSw2QkFBUixDQUpYO0FBQUEsTUFLRU0sY0FBY04sUUFBUSxrQ0FBUixDQUxoQjs7QUFRQUEsVUFBUSx5QkFBUjs7QUFFQTtBQUFBOztBQUNFLDhCQUFZTyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNJQUNqQkEsUUFBUU4sUUFEUzs7QUFFdkJDLFlBQU1NLFdBQU4sUUFBd0IsQ0FBQyxpQkFBRCxFQUFtQixhQUFuQixDQUF4Qjs7QUFFQSxZQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q0MsR0FBekMsQ0FBNkM7QUFDM0NDLGVBQU9OLE1BQU1PLEdBQU4sQ0FBVSxPQUFWLENBRG9DO0FBRTNDQyxnQkFBUVIsTUFBTU8sR0FBTixDQUFVLFFBQVY7QUFGbUMsT0FBN0M7QUFJQSxZQUFLRSxlQUFMLEdBQXVCWCxPQUFPWSxNQUFQLENBQWM7QUFDbkNDLFlBQUksV0FEK0I7QUFFbkNDLGVBQU8sT0FGNEI7QUFHbkNDLG1CQUFXLCtCQUh3QjtBQUluQ0MsZUFBTztBQUo0QixPQUFkLENBQXZCO0FBTUEsWUFBS0MsV0FBTCxHQUFtQmpCLE9BQU9ZLE1BQVAsQ0FBYztBQUMvQkMsWUFBSSxPQUQyQjtBQUUvQkMsZUFBTyxPQUZ3QjtBQUcvQkMsbUJBQVcsMkJBSG9CO0FBSS9CQyxlQUFPO0FBSndCLE9BQWQsQ0FBbkI7QUFNQSxZQUFLRSxRQUFMLENBQWMsTUFBS1AsZUFBTCxDQUFxQlEsSUFBckIsRUFBZCxFQUEyQyx5QkFBM0M7QUFDQSxZQUFLRCxRQUFMLENBQWMsTUFBS0QsV0FBTCxDQUFpQkUsSUFBakIsRUFBZCxFQUF1Qyx5QkFBdkM7O0FBRUEsWUFBS0MsV0FBTCxHQUFtQm5CLFlBQVlXLE1BQVosQ0FBbUI7QUFDcENFLGVBQU8sRUFENkI7QUFFcENPLGFBQUssQ0FGK0I7QUFHcENDLGFBQUt2QixRQUFRVSxHQUFSLENBQVksa0NBQVosQ0FIK0I7QUFJcENjLGVBQU8sR0FKNkI7QUFLcENDLHNCQUFjO0FBTHNCLE9BQW5CLENBQW5CO0FBT0EsWUFBS04sUUFBTCxDQUFjLE1BQUtFLFdBQUwsQ0FBaUJELElBQWpCLEVBQWQsRUFBdUMseUJBQXZDO0FBQ0EsWUFBS0MsV0FBTCxDQUFpQkssZ0JBQWpCLENBQWtDLGNBQWxDLEVBQWtELE1BQUtDLGVBQXZEO0FBQ0EsWUFBS04sV0FBTCxDQUFpQkssZ0JBQWpCLENBQWtDLGdCQUFsQyxFQUFvRCxNQUFLRSxXQUF6RDs7QUFoQ3VCO0FBa0N4Qjs7QUFuQ0g7QUFBQTtBQUFBLDJCQXFDT0MsSUFyQ1AsRUFxQ2E7QUFDVCxhQUFLdkIsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0N1QixJQUF0QyxDQUEyQy9CLE1BQU1nQyxtQkFBTixDQUEwQkYsSUFBMUIsQ0FBM0M7QUFDQSxhQUFLUixXQUFMLENBQWlCVyxRQUFqQixDQUEwQkgsS0FBS0ksT0FBTCxDQUFhLENBQWIsQ0FBMUI7QUFDRDtBQXhDSDtBQUFBO0FBQUEsc0NBMENrQkMsT0ExQ2xCLEVBMEMyQjtBQUN2QixhQUFLdEIsZUFBTCxDQUFxQnVCLFFBQXJCLENBQThCRCxVQUFVLE9BQVYsR0FBb0IsTUFBbEQ7QUFDRDtBQTVDSDtBQUFBO0FBQUEsc0NBOENrQkUsR0E5Q2xCLEVBOEN1QjtBQUNuQixhQUFLQyxhQUFMLENBQW1CLDRCQUFuQixFQUFpRDtBQUMvQ0MsdUJBQWFGLElBQUlHLGFBQUosQ0FBa0JDLEtBQWxCO0FBRGtDLFNBQWpEO0FBR0Q7QUFsREg7QUFBQTtBQUFBLGtDQW9EY0osR0FwRGQsRUFvRG1CO0FBQ2YsYUFBS0MsYUFBTCxDQUFtQix1QkFBbkIsRUFBMkMsRUFBM0M7QUFDRDtBQXRESDs7QUFBQTtBQUFBLElBQXNDeEMsT0FBdEM7QUF5REQsQ0FwRUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi92aXN1YWxyZXN1bHQuaHRtbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEJ1dHRvbiA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2J1dHRvbi9maWVsZCcpLFxuICAgIFNsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvZmllbGQnKTtcblxuXG4gIHJlcXVpcmUoJ2xpbmshLi92aXN1YWxyZXN1bHQuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFZpc3VhbFJlc3VsdFZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblNsaWRlckNoYW5nZScsJ19vblN0b3BEcmFnJ10pO1xuXG4gICAgICB0aGlzLiRlbC5maW5kKCcudmlzdWFsLXJlc3VsdF9fY29udGVudCcpLmNzcyh7XG4gICAgICAgIHdpZHRoOiBtb2RlbC5nZXQoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogbW9kZWwuZ2V0KCdoZWlnaHQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMucGxheVBhdXNlQnV0dG9uID0gQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBcInBsYXlQYXVzZVwiLFxuICAgICAgICBsYWJlbDogXCJQYXVzZVwiLFxuICAgICAgICBldmVudE5hbWU6IFwiVmlzdWFsUmVzdWx0LlBsYXlQYXVzZVJlcXVlc3RcIixcbiAgICAgICAgc3R5bGU6IFwidmlzdWFsLXJlc3VsdF9fY29udHJvbF9fdG9nZ2xlXCJcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3Jlc2V0JyxcbiAgICAgICAgbGFiZWw6ICdSZXNldCcsXG4gICAgICAgIGV2ZW50TmFtZTogJ1Zpc3VhbFJlc3VsdC5SZXNldFJlcXVlc3QnLFxuICAgICAgICBzdHlsZTogJ3Zpc3VhbC1yZXN1bHRfX2NvbnRyb2xfX3Jlc2V0J1xuICAgICAgfSlcbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5wbGF5UGF1c2VCdXR0b24udmlldygpLCBcIi52aXN1YWwtcmVzdWx0X19jb250cm9sXCIpXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMucmVzZXRCdXR0b24udmlldygpLCAnLnZpc3VhbC1yZXN1bHRfX2NvbnRyb2wnKVxuXG4gICAgICB0aGlzLnZpZGVvU2xpZGVyID0gU2xpZGVyRmllbGQuY3JlYXRlKHtcbiAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICBtaW46IDAsXG4gICAgICAgIG1heDogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJyksXG4gICAgICAgIHN0ZXBzOiAwLjUsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogMFxuICAgICAgfSlcbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy52aWRlb1NsaWRlci52aWV3KCksICcudmlzdWFsLXJlc3VsdF9fY29udHJvbCcpXG4gICAgICB0aGlzLnZpZGVvU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLkNoYW5nZScsIHRoaXMuX29uU2xpZGVyQ2hhbmdlKTtcbiAgICAgIHRoaXMudmlkZW9TbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuU3RvcERyYWcnLCB0aGlzLl9vblN0b3BEcmFnKTtcblxuICAgIH1cblxuICAgIHRpY2sodGltZSkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnZpc3VhbC1yZXN1bHRfX3RpbWUnKS50ZXh0KFV0aWxzLnNlY29uZHNUb1RpbWVTdHJpbmcodGltZSkpXG4gICAgICB0aGlzLnZpZGVvU2xpZGVyLnNldFZhbHVlKHRpbWUudG9GaXhlZCgxKSlcbiAgICB9XG5cbiAgICBoYW5kbGVQbGF5U3RhdGUocGxheWluZykge1xuICAgICAgdGhpcy5wbGF5UGF1c2VCdXR0b24uc2V0TGFiZWwocGxheWluZyA/IFwiUGF1c2VcIiA6IFwiUGxheVwiKTtcbiAgICB9XG5cbiAgICBfb25TbGlkZXJDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Zpc3VhbFJlc3VsdC5TbGlkZXJSZXF1ZXN0Jywge1xuICAgICAgICBzbGlkZXJWYWx1ZTogZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25TdG9wRHJhZyhldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlN0b3BEcmFnJyx7fSlcbiAgICB9XG5cbiAgfVxufSlcbiJdfQ==
