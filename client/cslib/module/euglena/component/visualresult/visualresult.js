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
      BulbDisplay = require('euglena/component/bulbdisplay/bulbdisplay'),
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
      _this._bulbDisplay = BulbDisplay.create({
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
      _this.view().addChild(_this._bulbDisplay.view(), ".visual-result__content");

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
        this._bulbDisplay.render(resetLights);
        this._euglenaDisplay.render(resetLights, 0);
        this.view().handlePlayState(this._timer.active());
      }
    }, {
      key: '_onTick',
      value: function _onTick(evt) {
        var time = this._timer.time();
        var lights = this._model.getLightState(time);

        this._lightDisplay.render(lights);
        this._bulbDisplay.render(lights);
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
        this._bulbDisplay.render(lights);
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
          this._bulbDisplay.render(lights);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVyIiwiR2xvYmFscyIsIiQiLCJMaWdodERpc3BsYXkiLCJCdWxiRGlzcGxheSIsIlZpZGVvRGlzcGxheSIsIkV1Z2xlbmFEaXNwbGF5IiwiVmlzdWFsUmVzdWx0IiwiY29uZmlnIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2xpZ2h0RGlzcGxheSIsImNyZWF0ZSIsIndpZHRoIiwiX21vZGVsIiwiZ2V0IiwiaGVpZ2h0IiwiX2J1bGJEaXNwbGF5IiwiX3ZpZGVvRGlzcGxheSIsIl9ldWdsZW5hRGlzcGxheSIsIl90aW1lciIsImR1cmF0aW9uIiwibG9vcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UaWNrIiwiX29uVGltZXJFbmQiLCJ2aWV3IiwiYWRkQ2hpbGQiLCJyZXNldCIsIl9vblBsYXlQYXVzZVJlcXVlc3QiLCJfb25SZXNldFJlcXVlc3QiLCJfb25WaWRlb1JlYWR5IiwiX29uU2xpZGVyUmVxdWVzdCIsIl9vblN0b3BEcmFnIiwibGlnaHREYXRhIiwic2V0IiwicmVzdWx0cyIsIm1vZGVsIiwiY29sb3IiLCJoYW5kbGVEYXRhIiwidHJhY2tzIiwidmlkZW8iLCJzdG9wIiwiX21vZGUiLCJoYW5kbGVWaWRlbyIsInNldFNvdXJjZSIsInN0YXJ0IiwiaGFuZGxlUGxheVN0YXRlIiwiYWN0aXZlIiwicGF1c2UiLCJyZXNldExpZ2h0cyIsInRvcCIsImxlZnQiLCJyaWdodCIsImJvdHRvbSIsInJlbmRlciIsImV2dCIsInRpbWUiLCJsaWdodHMiLCJnZXRMaWdodFN0YXRlIiwidGljayIsImRpc3BhdGNoRXZlbnQiLCJtb2RlIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsInNlZWsiLCJ2aWRlb1NsaWRlciIsInNldFZhbHVlIiwic2xpZGVyVmFsdWUiLCIkZWwiLCJmaW5kIiwidGV4dCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJuZXdUaW1lIiwidG9GaXhlZCIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BSUVLLFFBQVFMLFFBQVEsaUJBQVIsQ0FKVjtBQUFBLE1BS0VNLFVBQVVOLFFBQVEsb0JBQVIsQ0FMWjtBQUFBLE1BTUVPLElBQUlQLFFBQVEsUUFBUixDQU5OO0FBQUEsTUFRRVEsZUFBZVIsUUFBUSw2Q0FBUixDQVJqQjtBQUFBLE1BU0VTLGNBQWNULFFBQVEsMkNBQVIsQ0FUaEI7QUFBQSxNQVVFVSxlQUFlVixRQUFRLDZDQUFSLENBVmpCO0FBQUEsTUFXRVcsaUJBQWlCWCxRQUFRLGlEQUFSLENBWG5COztBQURrQixNQWNaWSxZQWRZO0FBQUE7O0FBZWhCLDBCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCWixLQUF6QztBQUNBVyxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CWixJQUF2Qzs7QUFGa0IsOEhBR1pVLE1BSFk7O0FBSWxCVCxZQUFNWSxXQUFOLFFBQXdCLENBQUMsU0FBRCxFQUFZLHFCQUFaLEVBQW1DLGVBQW5DLEVBQW9ELGlCQUFwRCxFQUF1RSxhQUF2RSxFQUN4QixrQkFEd0IsRUFDTCxhQURLLENBQXhCOztBQUdBLFlBQUtDLGFBQUwsR0FBcUJULGFBQWFVLE1BQWIsQ0FBb0I7QUFDdkNDLGVBQU8sTUFBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENB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QUFLOUIsSUFBTCxHQUFZcUIsZUFBWixDQUE0QixLQUFLM0IsTUFBTCxDQUFZNEIsTUFBWixFQUE1QjtBQUNEO0FBdE5lOztBQUFBO0FBQUEsSUFjU3JELFNBZFQ7O0FBeU5sQlcsZUFBYU0sTUFBYixHQUFzQjtBQUFBLFFBQUNzRCxJQUFELHVFQUFRLEVBQVI7QUFBQSxXQUFlLElBQUk1RCxZQUFKLENBQWlCLEVBQUV1RSxXQUFXWCxJQUFiLEVBQWpCLENBQWY7QUFBQSxHQUF0QjtBQUNBLFNBQU81RCxZQUFQO0FBQ0QsQ0EzTkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGltZXIgPSByZXF1aXJlKCdjb3JlL3V0aWwvdGltZXInKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuXG4gICAgTGlnaHREaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvbGlnaHRkaXNwbGF5L2xpZ2h0ZGlzcGxheScpLFxuICAgIEJ1bGJEaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvYnVsYmRpc3BsYXkvYnVsYmRpc3BsYXknKSxcbiAgICBWaWRlb0Rpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlkZW9kaXNwbGF5JyksXG4gICAgRXVnbGVuYURpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hZGlzcGxheScpO1xuXG4gIGNsYXNzIFZpc3VhbFJlc3VsdCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcubW9kZWxDbGFzcyA9IGNvbmZpZy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgY29uZmlnLnZpZXdDbGFzcyA9IGNvbmZpZy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRpY2snLCAnX29uUGxheVBhdXNlUmVxdWVzdCcsICdfb25WaWRlb1JlYWR5JywgJ19vblJlc2V0UmVxdWVzdCcsICdfb25UaW1lckVuZCcsXG4gICAgICAnX29uU2xpZGVyUmVxdWVzdCcsJ19vblN0b3BEcmFnJ10pO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX21vZGVsLmdldCgnd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9tb2RlbC5nZXQoJ2hlaWdodCcpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2J1bGJEaXNwbGF5ID0gQnVsYkRpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX21vZGVsLmdldCgnd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9tb2RlbC5nZXQoJ2hlaWdodCcpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheSA9IFZpZGVvRGlzcGxheS5jcmVhdGUoe1xuICAgICAgICB3aWR0aDogdGhpcy5fbW9kZWwuZ2V0KCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX21vZGVsLmdldCgnaGVpZ2h0JylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkgPSBFdWdsZW5hRGlzcGxheS5jcmVhdGUoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy52aWV3M2QnKSk7XG5cbiAgICAgIHRoaXMuX3RpbWVyID0gbmV3IFRpbWVyKHtcbiAgICAgICAgZHVyYXRpb246IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpLFxuICAgICAgICBsb29wOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3RpbWVyLmFkZEV2ZW50TGlzdGVuZXIoJ1RpbWVyLlRpY2snLCB0aGlzLl9vblRpY2spO1xuICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuRW5kJywgdGhpcy5fb25UaW1lckVuZCk7XG4gICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW8uVGljaycsIHRoaXMuX29uVGljayk7XG5cbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2xpZ2h0RGlzcGxheS52aWV3KCksIFwiLnZpc3VhbC1yZXN1bHRfX2NvbnRlbnRcIilcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX3ZpZGVvRGlzcGxheS52aWV3KCksIFwiLnZpc3VhbC1yZXN1bHRfX2NvbnRlbnRcIilcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fYnVsYkRpc3BsYXkudmlldygpLCBcIi52aXN1YWwtcmVzdWx0X19jb250ZW50XCIpXG5cbiAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlBsYXlQYXVzZVJlcXVlc3QnLCB0aGlzLl9vblBsYXlQYXVzZVJlcXVlc3QpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlJlc2V0UmVxdWVzdCcsIHRoaXMuX29uUmVzZXRSZXF1ZXN0KTtcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ1ZpZGVvRGlzcGxheS5SZWFkeScsIHRoaXMuX29uVmlkZW9SZWFkeSk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuU2xpZGVyUmVxdWVzdCcsIHRoaXMuX29uU2xpZGVyUmVxdWVzdCk7XG5cbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5TdG9wRHJhZycsIHRoaXMuX29uU3RvcERyYWcpO1xuXG4gICAgfVxuXG4gICAgaGFuZGxlTGlnaHREYXRhKGxpZ2h0RGF0YSkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdsaWdodERhdGEnLCBsaWdodERhdGEpO1xuICAgIH1cblxuICAgIGhhbmRsZU1vZGVsRGF0YShyZXN1bHRzLCBtb2RlbCwgY29sb3IpIHtcbiAgICAgIGlmIChyZXN1bHRzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkuaGFuZGxlRGF0YSh7XG4gICAgICAgICAgdHJhY2tzOiBbXVxuICAgICAgICB9LCBtb2RlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmhhbmRsZURhdGEocmVzdWx0cywgbW9kZWwsIGNvbG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwbGF5KHZpZGVvID0gbnVsbCkge1xuICAgICAgLy8gdGhpcy5fZXVnbGVuYURpc3BsYXkuaW5pdGlhbGl6ZSgpO1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgaWYgKHZpZGVvKSB7XG4gICAgICAgIHRoaXMuX21vZGUgPSBcInZpZGVvXCI7XG4gICAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyh2aWRlbyk7XG4gICAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZSh0aGlzLl92aWRlb0Rpc3BsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW9kZSA9IFwiZHJ5UnVuXCI7XG4gICAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyhudWxsKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc2V0U291cmNlKG51bGwpO1xuICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgIH1cblxuICAgIHBhdXNlKCkge1xuICAgICAgdGhpcy5fdGltZXIucGF1c2UoKTtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICBjb25zdCByZXNldExpZ2h0cyA9IHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICB9O1xuICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihyZXNldExpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIocmVzZXRMaWdodHMpO1xuICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkucmVuZGVyKHJlc2V0TGlnaHRzLCAwKTtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLl90aW1lci50aW1lKCk7XG4gICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKHRpbWUpO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihsaWdodHMsIHRpbWUpO1xuXG4gICAgICB0aGlzLnZpZXcoKS50aWNrKHRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgbW9kZTogdGhpcy5fbW9kZSxcbiAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGxheVBhdXNlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICB0aGlzLl90aW1lci5wYXVzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogdGhpcy5fdGltZXIuYWN0aXZlKCkgPyBcInBsYXlcIiA6IFwicGF1c2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7fVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25WaWRlb1JlYWR5KGV2dCkge1xuICAgICAgdGhpcy5fdGltZXIuc2VlaygwKTtcbiAgICAgIHRoaXMuX29uVGljayhudWxsKVxuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBfb25SZXNldFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl90aW1lci5zZWVrKDApO1xuXG4gICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKDApO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihsaWdodHMsIDApO1xuXG4gICAgICB0aGlzLnZpZXcoKS52aWRlb1NsaWRlci5zZXRWYWx1ZSgwKTtcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgbW9kZTogdGhpcy5fbW9kZSxcbiAgICAgICAgdGltZTogMCxcbiAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgIH0pXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInJlc2V0XCIsXG4gICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgZGF0YToge31cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uU2xpZGVyUmVxdWVzdChldnQpIHtcbiAgICAgIGlmKCF0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICB0aGlzLl90aW1lci5zZWVrKGV2dC5kYXRhLnNsaWRlclZhbHVlKTtcblxuICAgICAgICBjb25zdCB0aW1lID0gdGhpcy5fdGltZXIudGltZSgpO1xuICAgICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKHRpbWUpO1xuXG4gICAgICAgIHRoaXMudmlldygpLiRlbC5maW5kKCcudmlzdWFsLXJlc3VsdF9fdGltZScpLnRleHQoVXRpbHMuc2Vjb25kc1RvVGltZVN0cmluZyh0aW1lKSlcbiAgICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihsaWdodHMpO1xuICAgICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkucmVuZGVyKGxpZ2h0cywgdGltZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgICBtb2RlOiB0aGlzLl9tb2RlLFxuICAgICAgICAgIHRpbWU6IHRpbWUsXG4gICAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblN0b3BEcmFnKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwidmlkZW9TbGlkZXJcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbmV3VGltZTogdGhpcy5fdGltZXIudGltZSgpLnRvRml4ZWQoMilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyhudWxsKTtcbiAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZShudWxsKTtcbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG5cbiAgICBfb25UaW1lckVuZChldnQpIHtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuICB9XG5cbiAgVmlzdWFsUmVzdWx0LmNyZWF0ZSA9IChkYXRhID0ge30pID0+IG5ldyBWaXN1YWxSZXN1bHQoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIHJldHVybiBWaXN1YWxSZXN1bHQ7XG59KVxuIl19
