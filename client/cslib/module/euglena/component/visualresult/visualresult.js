'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils'),
      Timer = require('core/util/timer'),
      Globals = require('core/model/globals'),
      $ = require('jquery'),
      LightDisplay = require('euglena/component/lightdisplay/lightdisplay'),
      VideoDisplay = require('euglena/component/videodisplay/videodisplay'),
      EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay');

  var VisualResult = function (_Component) {
    _inherits(VisualResult, _Component);

    function VisualResult(config) {
      _classCallCheck(this, VisualResult);

      config.modelClass = config.modelClass || Model;
      config.viewClass = config.viewClass || View;

      var _this = _possibleConstructorReturn(this, (VisualResult.__proto__ || Object.getPrototypeOf(VisualResult)).call(this, config));

      Utils.bindMethods(_this, ['_onTick', '_onPlayPauseRequest', '_onVideoReady', '_onResetRequest', '_onTimerEnd', '_onSliderRequest', '_onStopDrag']);

      _this._lightDisplay = LightDisplay.create({
        width: _this._model.get('width'),
        height: _this._model.get('height')
      });
      _this._videoDisplay = VideoDisplay.create({
        width: _this._model.get('width'),
        height: _this._model.get('height')
      });
      _this._euglenaDisplay = EuglenaDisplay.create(Globals.get('AppConfig.view3d'));

      _this._timer = new Timer({
        duration: Globals.get('AppConfig.experiment.maxDuration'),
        loop: true
      });
      _this._timer.addEventListener('Timer.Tick', _this._onTick);
      _this._timer.addEventListener('Timer.End', _this._onTimerEnd);
      _this._videoDisplay.addEventListener('Video.Tick', _this._onTick);

      _this.view().addChild(_this._lightDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._videoDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._euglenaDisplay.view(), ".visual-result__content");

      _this.reset();

      _this.view().addEventListener('VisualResult.PlayPauseRequest', _this._onPlayPauseRequest);
      _this.view().addEventListener('VisualResult.ResetRequest', _this._onResetRequest);
      _this.view().addEventListener('VideoDisplay.Ready', _this._onVideoReady);
      _this.view().addEventListener('VisualResult.SliderRequest', _this._onSliderRequest);

      _this.view().addEventListener('VisualResult.StopDrag', _this._onStopDrag);

      return _this;
    }

    _createClass(VisualResult, [{
      key: 'handleLightData',
      value: function handleLightData(lightData) {
        this._model.set('lightData', lightData);
      }
    }, {
      key: 'handleModelData',
      value: function handleModelData(results, model, color) {
        if (results == null) {
          this._euglenaDisplay.handleData({
            tracks: []
          }, model);
        } else {
          this._euglenaDisplay.handleData(results, model, color);
        }
      }
    }, {
      key: 'play',
      value: function play() {
        var video = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        // this._euglenaDisplay.initialize();
        this._timer.stop();
        if (video) {
          this._mode = "video";
          this._videoDisplay.handleVideo(video);
          this._timer.setSource(this._videoDisplay);
        } else {
          this._mode = "dryRun";
          this._videoDisplay.handleVideo(null);
          this._timer.setSource(null);
          this._timer.start();
          this.view().handlePlayState(this._timer.active());
        }
      }
    }, {
      key: 'stop',
      value: function stop() {
        this._timer.stop();
        this.view().handlePlayState(this._timer.active());
      }
    }, {
      key: 'pause',
      value: function pause() {
        this._timer.pause();
        this.view().handlePlayState(this._timer.active());
      }
    }, {
      key: 'reset',
      value: function reset() {
        this._timer.stop();
        var resetLights = {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        };
        this._lightDisplay.render(resetLights);
        this._euglenaDisplay.render(resetLights, 0);
        this.view().handlePlayState(this._timer.active());
      }
    }, {
      key: '_onTick',
      value: function _onTick(evt) {
        var time = this._timer.time();
        var lights = this._model.getLightState(time);

        this._lightDisplay.render(lights);
        this._euglenaDisplay.render(lights, time);

        this.view().tick(time);
        this.dispatchEvent('VisualResult.Tick', {
          mode: this._mode,
          time: time,
          lights: lights
        });
      }
    }, {
      key: '_onPlayPauseRequest',
      value: function _onPlayPauseRequest(evt) {
        if (this._timer.active()) {
          this._timer.pause();
        } else {
          this._timer.start();
        }
        this.view().handlePlayState(this._timer.active());
        Globals.get('Logger').log({
          type: this._timer.active() ? "play" : "pause",
          category: "results",
          data: {}
        });
      }
    }, {
      key: '_onVideoReady',
      value: function _onVideoReady(evt) {
        this._timer.seek(0);
        this._onTick(null);
        this.view().handlePlayState(this._timer.active());
      }
    }, {
      key: '_onResetRequest',
      value: function _onResetRequest(evt) {
        this._timer.seek(0);

        var lights = this._model.getLightState(0);

        this._lightDisplay.render(lights);
        this._euglenaDisplay.render(lights, 0);

        this.view().videoSlider.setValue(0);

        this.dispatchEvent('VisualResult.Tick', {
          mode: this._mode,
          time: 0,
          lights: lights
        });

        Globals.get('Logger').log({
          type: "reset",
          category: "results",
          data: {}
        });
      }
    }, {
      key: '_onSliderRequest',
      value: function _onSliderRequest(evt) {
        if (!this._timer.active()) {
          this._timer.seek(evt.data.sliderValue);

          var time = this._timer.time();
          var lights = this._model.getLightState(time);

          this.view().$el.find('.visual-result__time').text(Utils.secondsToTimeString(time));
          this._lightDisplay.render(lights);
          this._euglenaDisplay.render(lights, time);

          this.dispatchEvent('VisualResult.Tick', {
            mode: this._mode,
            time: time,
            lights: lights
          });
        }
      }
    }, {
      key: '_onStopDrag',
      value: function _onStopDrag(evt) {
        Globals.get('Logger').log({
          type: "videoSlider",
          category: "results",
          data: {
            newTime: this._timer.time().toFixed(2)
          }
        });
      }
    }, {
      key: 'clear',
      value: function clear() {
        this._timer.stop();
        this._videoDisplay.handleVideo(null);
        this._timer.setSource(null);
        this.reset();
      }
    }, {
      key: '_onTimerEnd',
      value: function _onTimerEnd(evt) {
        this.view().handlePlayState(this._timer.active());
      }
    }]);

    return VisualResult;
  }(Component);

  VisualResult.create = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new VisualResult({ modelData: data });
  };
  return VisualResult;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVyIiwiR2xvYmFscyIsIiQiLCJMaWdodERpc3BsYXkiLCJWaWRlb0Rpc3BsYXkiLCJFdWdsZW5hRGlzcGxheSIsIlZpc3VhbFJlc3VsdCIsImNvbmZpZyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9saWdodERpc3BsYXkiLCJjcmVhdGUiLCJ3aWR0aCIsIl9tb2RlbCIsImdldCIsImhlaWdodCIsIl92aWRlb0Rpc3BsYXkiLCJfZXVnbGVuYURpc3BsYXkiLCJfdGltZXIiLCJkdXJhdGlvbiIsImxvb3AiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVGljayIsIl9vblRpbWVyRW5kIiwidmlldyIsImFkZENoaWxkIiwicmVzZXQiLCJfb25QbGF5UGF1c2VSZXF1ZXN0IiwiX29uUmVzZXRSZXF1ZXN0IiwiX29uVmlkZW9SZWFkeSIsIl9vblNsaWRlclJlcXVlc3QiLCJfb25TdG9wRHJhZyIsImxpZ2h0RGF0YSIsInNldCIsInJlc3VsdHMiLCJtb2RlbCIsImNvbG9yIiwiaGFuZGxlRGF0YSIsInRyYWNrcyIsInZpZGVvIiwic3RvcCIsIl9tb2RlIiwiaGFuZGxlVmlkZW8iLCJzZXRTb3VyY2UiLCJzdGFydCIsImhhbmRsZVBsYXlTdGF0ZSIsImFjdGl2ZSIsInBhdXNlIiwicmVzZXRMaWdodHMiLCJ0b3AiLCJsZWZ0IiwicmlnaHQiLCJib3R0b20iLCJyZW5kZXIiLCJldnQiLCJ0aW1lIiwibGlnaHRzIiwiZ2V0TGlnaHRTdGF0ZSIsInRpY2siLCJkaXNwYXRjaEV2ZW50IiwibW9kZSIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImRhdGEiLCJzZWVrIiwidmlkZW9TbGlkZXIiLCJzZXRWYWx1ZSIsInNsaWRlclZhbHVlIiwiJGVsIiwiZmluZCIsInRleHQiLCJzZWNvbmRzVG9UaW1lU3RyaW5nIiwibmV3VGltZSIsInRvRml4ZWQiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7QUFBQSxNQUlFSyxRQUFRTCxRQUFRLGlCQUFSLENBSlY7QUFBQSxNQUtFTSxVQUFVTixRQUFRLG9CQUFSLENBTFo7QUFBQSxNQU1FTyxJQUFJUCxRQUFRLFFBQVIsQ0FOTjtBQUFBLE1BUUVRLGVBQWVSLFFBQVEsNkNBQVIsQ0FSakI7QUFBQSxNQVNFUyxlQUFlVCxRQUFRLDZDQUFSLENBVGpCO0FBQUEsTUFVRVUsaUJBQWlCVixRQUFRLGlEQUFSLENBVm5COztBQURrQixNQWFaVyxZQWJZO0FBQUE7O0FBY2hCLDBCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCWCxLQUF6QztBQUNBVSxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CWCxJQUF2Qzs7QUFGa0IsOEhBR1pTLE1BSFk7O0FBSWxCUixZQUFNVyxXQUFOLFFBQXdCLENBQUMsU0FBRCxFQUFZLHFCQUFaLEVBQW1DLGVBQW5DLEVBQW9ELGlCQUFwRCxFQUF1RSxhQUF2RSxFQUN4QixrQkFEd0IsRUFDTCxhQURLLENBQXhCOztBQUdBLFlBQUtDLGFBQUwsR0FBcUJSLGFBQWFTLE1BQWIsQ0FBb0I7QUFDdkNDLGVBQU8sTUFBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBRGdDO0FBRXZDQyxnQkFBUSxNQUFLRixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEI7QUFGK0IsT0FBcEIs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RDtBQUNGO0FBdkxlO0FBQUE7QUFBQSxrQ0F5TEpGLEdBekxJLEVBeUxDO0FBQ2Z0RCxnQkFBUWMsR0FBUixDQUFZLFFBQVosRUFBc0IrQyxHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sYUFEa0I7QUFFeEJDLG9CQUFVLFNBRmM7QUFHeEJDLGdCQUFNO0FBQ0pTLHFCQUFTLEtBQUt2RCxNQUFMLENBQVlxQyxJQUFaLEdBQW1CbUIsT0FBbkIsQ0FBMkIsQ0FBM0I7QUFETDtBQUhrQixTQUExQjtBQU9EO0FBak1lO0FBQUE7QUFBQSw4QkFtTVI7QUFDTixhQUFLeEQsTUFBTCxDQUFZc0IsSUFBWjtBQUNBLGFBQUt4QixhQUFMLENBQW1CMEIsV0FBbkIsQ0FBK0IsSUFBL0I7QUFDQSxhQUFLeEIsTUFBTCxDQUFZeUIsU0FBWixDQUFzQixJQUF0QjtBQUNBLGFBQUtqQixLQUFMO0FBQ0Q7QUF4TWU7QUFBQTtBQUFBLGtDQTBNSjRCLEdBMU1JLEVBME1DO0FBQ2YsYUFBSzlCLElBQUwsR0FBWXFCLGVBQVosQ0FBNEIsS0FBSzNCLE1BQUwsQ0FBWTRCLE1BQVosRUFBNUI7QUFDRDtBQTVNZTs7QUFBQTtBQUFBLElBYVNuRCxTQWJUOztBQStNbEJVLGVBQWFNLE1BQWIsR0FBc0I7QUFBQSxRQUFDcUQsSUFBRCx1RUFBUSxFQUFSO0FBQUEsV0FBZSxJQUFJM0QsWUFBSixDQUFpQixFQUFFc0UsV0FBV1gsSUFBYixFQUFqQixDQUFmO0FBQUEsR0FBdEI7QUFDQSxTQUFPM0QsWUFBUDtBQUNELENBak5EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFRpbWVyID0gcmVxdWlyZSgnY29yZS91dGlsL3RpbWVyJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgIExpZ2h0RGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2xpZ2h0ZGlzcGxheS9saWdodGRpc3BsYXknKSxcbiAgICBWaWRlb0Rpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlkZW9kaXNwbGF5JyksXG4gICAgRXVnbGVuYURpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hZGlzcGxheScpO1xuXG4gIGNsYXNzIFZpc3VhbFJlc3VsdCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcubW9kZWxDbGFzcyA9IGNvbmZpZy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgY29uZmlnLnZpZXdDbGFzcyA9IGNvbmZpZy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRpY2snLCAnX29uUGxheVBhdXNlUmVxdWVzdCcsICdfb25WaWRlb1JlYWR5JywgJ19vblJlc2V0UmVxdWVzdCcsICdfb25UaW1lckVuZCcsXG4gICAgICAnX29uU2xpZGVyUmVxdWVzdCcsJ19vblN0b3BEcmFnJ10pO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX21vZGVsLmdldCgnd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9tb2RlbC5nZXQoJ2hlaWdodCcpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheSA9IFZpZGVvRGlzcGxheS5jcmVhdGUoe1xuICAgICAgICB3aWR0aDogdGhpcy5fbW9kZWwuZ2V0KCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX21vZGVsLmdldCgnaGVpZ2h0JylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkgPSBFdWdsZW5hRGlzcGxheS5jcmVhdGUoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aWV3M2QnKSk7XG5cbiAgICAgIHRoaXMuX3RpbWVyID0gbmV3IFRpbWVyKHtcbiAgICAgICAgZHVyYXRpb246IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpLFxuICAgICAgICBsb29wOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3RpbWVyLmFkZEV2ZW50TGlzdGVuZXIoJ1RpbWVyLlRpY2snLCB0aGlzLl9vblRpY2spO1xuICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuRW5kJywgdGhpcy5fb25UaW1lckVuZCk7XG4gICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW8uVGljaycsIHRoaXMuX29uVGljayk7XG5cbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2xpZ2h0RGlzcGxheS52aWV3KCksIFwiLnZpc3VhbC1yZXN1bHRfX2NvbnRlbnRcIilcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX3ZpZGVvRGlzcGxheS52aWV3KCksIFwiLnZpc3VhbC1yZXN1bHRfX2NvbnRlbnRcIilcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuXG4gICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5QbGF5UGF1c2VSZXF1ZXN0JywgdGhpcy5fb25QbGF5UGF1c2VSZXF1ZXN0KTtcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5SZXNldFJlcXVlc3QnLCB0aGlzLl9vblJlc2V0UmVxdWVzdCk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdWaWRlb0Rpc3BsYXkuUmVhZHknLCB0aGlzLl9vblZpZGVvUmVhZHkpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlNsaWRlclJlcXVlc3QnLCB0aGlzLl9vblNsaWRlclJlcXVlc3QpO1xuXG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuU3RvcERyYWcnLCB0aGlzLl9vblN0b3BEcmFnKTtcblxuICAgIH1cblxuICAgIGhhbmRsZUxpZ2h0RGF0YShsaWdodERhdGEpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnbGlnaHREYXRhJywgbGlnaHREYXRhKTtcbiAgICB9XG5cbiAgICBoYW5kbGVNb2RlbERhdGEocmVzdWx0cywgbW9kZWwsIGNvbG9yKSB7XG4gICAgICBpZiAocmVzdWx0cyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmhhbmRsZURhdGEoe1xuICAgICAgICAgIHRyYWNrczogW11cbiAgICAgICAgfSwgbW9kZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheS5oYW5kbGVEYXRhKHJlc3VsdHMsIG1vZGVsLCBjb2xvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGxheSh2aWRlbyA9IG51bGwpIHtcbiAgICAgIC8vIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmluaXRpYWxpemUoKTtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIGlmICh2aWRlbykge1xuICAgICAgICB0aGlzLl9tb2RlID0gXCJ2aWRlb1wiO1xuICAgICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuaGFuZGxlVmlkZW8odmlkZW8pO1xuICAgICAgICB0aGlzLl90aW1lci5zZXRTb3VyY2UodGhpcy5fdmlkZW9EaXNwbGF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21vZGUgPSBcImRyeVJ1blwiO1xuICAgICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuaGFuZGxlVmlkZW8obnVsbCk7XG4gICAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZShudWxsKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnBhdXNlKCk7XG4gICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgY29uc3QgcmVzZXRMaWdodHMgPSB7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgfTtcbiAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheS5yZW5kZXIocmVzZXRMaWdodHMpXG4gICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheS5yZW5kZXIocmVzZXRMaWdodHMsIDApO1xuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBfb25UaWNrKGV2dCkge1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuX3RpbWVyLnRpbWUoKTtcbiAgICAgIGNvbnN0IGxpZ2h0cyA9IHRoaXMuX21vZGVsLmdldExpZ2h0U3RhdGUodGltZSk7XG5cbiAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihsaWdodHMsIHRpbWUpO1xuXG4gICAgICB0aGlzLnZpZXcoKS50aWNrKHRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgbW9kZTogdGhpcy5fbW9kZSxcbiAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGxheVBhdXNlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICB0aGlzLl90aW1lci5wYXVzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogdGhpcy5fdGltZXIuYWN0aXZlKCkgPyBcInBsYXlcIiA6IFwicGF1c2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7fVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25WaWRlb1JlYWR5KGV2dCkge1xuICAgICAgdGhpcy5fdGltZXIuc2VlaygwKTtcbiAgICAgIHRoaXMuX29uVGljayhudWxsKVxuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBfb25SZXNldFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl90aW1lci5zZWVrKDApO1xuXG4gICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKDApO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheS5yZW5kZXIobGlnaHRzLCAwKTtcblxuICAgICAgdGhpcy52aWV3KCkudmlkZW9TbGlkZXIuc2V0VmFsdWUoMCk7XG5cbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlRpY2snLCB7XG4gICAgICAgIG1vZGU6IHRoaXMuX21vZGUsXG4gICAgICAgIHRpbWU6IDAsXG4gICAgICAgIGxpZ2h0czogbGlnaHRzXG4gICAgICB9KVxuXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJyZXNldFwiLFxuICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgIGRhdGE6IHt9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblNsaWRlclJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZighdGhpcy5fdGltZXIuYWN0aXZlKCkpIHtcbiAgICAgICAgdGhpcy5fdGltZXIuc2VlayhldnQuZGF0YS5zbGlkZXJWYWx1ZSk7XG5cbiAgICAgICAgY29uc3QgdGltZSA9IHRoaXMuX3RpbWVyLnRpbWUoKTtcbiAgICAgICAgY29uc3QgbGlnaHRzID0gdGhpcy5fbW9kZWwuZ2V0TGlnaHRTdGF0ZSh0aW1lKTtcblxuICAgICAgICB0aGlzLnZpZXcoKS4kZWwuZmluZCgnLnZpc3VhbC1yZXN1bHRfX3RpbWUnKS50ZXh0KFV0aWxzLnNlY29uZHNUb1RpbWVTdHJpbmcodGltZSkpXG4gICAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkucmVuZGVyKGxpZ2h0cywgdGltZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgICBtb2RlOiB0aGlzLl9tb2RlLFxuICAgICAgICAgIHRpbWU6IHRpbWUsXG4gICAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblN0b3BEcmFnKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwidmlkZW9TbGlkZXJcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbmV3VGltZTogdGhpcy5fdGltZXIudGltZSgpLnRvRml4ZWQoMilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyhudWxsKTtcbiAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZShudWxsKTtcbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG5cbiAgICBfb25UaW1lckVuZChldnQpIHtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuICB9XG5cbiAgVmlzdWFsUmVzdWx0LmNyZWF0ZSA9IChkYXRhID0ge30pID0+IG5ldyBWaXN1YWxSZXN1bHQoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIHJldHVybiBWaXN1YWxSZXN1bHQ7XG59KVxuIl19
