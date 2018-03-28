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

      Utils.bindMethods(_this, ['_onTick', '_onPlayPauseRequest', '_onVideoReady', '_onResetRequest', '_onTimerEnd', '_onSliderRequest', '_onStopDrag', '_onShowVideo', '_onPlaybackRateRequest']);

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
      _this.playbackFaster = false;

      //this._videoDisplay.addEventListener('Video.Tick', this._onTick);

      _this.view().addChild(_this._lightDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._videoDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._euglenaDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._bulbDisplay.view(), ".visual-result__content");

      _this.reset();

      Globals.get('Relay').addEventListener('VisualResult.PlayPauseRequest', _this._onPlayPauseRequest);
      Globals.get('Relay').addEventListener('VisualResult.PlaybackRateRequest', _this._onPlaybackRateRequest);
      Globals.get('Relay').addEventListener('VisualResult.ResetRequest', _this._onResetRequest);
      _this.view().addEventListener('VideoDisplay.Ready', _this._onVideoReady);

      Globals.get('Relay').addEventListener('VisualResult.SliderRequest', _this._onSliderRequest);
      Globals.get('Relay').addEventListener('VisualResult.StopDrag', _this._onStopDrag);

      _this.addEventListener('VideoResult.ShowVideo', _this._onShowVideo);

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
          // Generate the results data

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
        this.stop();
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
      key: '_onPlaybackRateRequest',
      value: function _onPlaybackRateRequest(evt) {
        this.playbackFaster = this.playbackFaster ? false : true;
        this.view().handlePlaybackState(this.playbackFaster);
        this._videoDisplay.changePlaybackRate(this.playbackFaster);
        Globals.get('Logger').log({
          type: "playbackrate",
          category: "results",
          data: { playbackrate: this.playbackFaster ? 'faster' : 'normal' }
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
        this.view().handlePlaybackState(this.playbackFaster);
        this._videoDisplay.changePlaybackRate(this.playbackFaster);
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
      key: '_onShowVideo',
      value: function _onShowVideo(evt) {
        this._videoDisplay.dispatchEvent('VideoDisplay.ShowVideo', { showVideo: evt.data.showVideo });
      }
    }, {
      key: '_onTimerEnd',
      value: function _onTimerEnd(evt) {
        this.view().handlePlayState(this._timer.active());
      }
    }, {
      key: 'hideControls',
      value: function hideControls() {
        this.view().$el.find('.visual-result__control').hide();
        this.view().$el.find('.visual-result__time').hide();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVyIiwiR2xvYmFscyIsIiQiLCJMaWdodERpc3BsYXkiLCJCdWxiRGlzcGxheSIsIlZpZGVvRGlzcGxheSIsIkV1Z2xlbmFEaXNwbGF5IiwiVmlzdWFsUmVzdWx0IiwiY29uZmlnIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2xpZ2h0RGlzcGxheSIsImNyZWF0ZSIsIndpZHRoIiwiX21vZGVsIiwiZ2V0IiwiaGVpZ2h0IiwiX2J1bGJEaXNwbGF5IiwiX3ZpZGVvRGlzcGxheSIsIl9ldWdsZW5hRGlzcGxheSIsIl90aW1lciIsImR1cmF0aW9uIiwibG9vcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UaWNrIiwiX29uVGltZXJFbmQiLCJwbGF5YmFja0Zhc3RlciIsInZpZXciLCJhZGRDaGlsZCIsInJlc2V0IiwiX29uUGxheVBhdXNlUmVxdWVzdCIsIl9vblBsYXliYWNrUmF0ZVJlcXVlc3QiLCJfb25SZXNldFJlcXVlc3QiLCJfb25WaWRlb1JlYWR5IiwiX29uU2xpZGVyUmVxdWVzdCIsIl9vblN0b3BEcmFnIiwiX29uU2hvd1ZpZGVvIiwibGlnaHREYXRhIiwic2V0IiwicmVzdWx0cyIsIm1vZGVsIiwiY29sb3IiLCJoYW5kbGVEYXRhIiwidHJhY2tzIiwidmlkZW8iLCJzdG9wIiwiX21vZGUiLCJoYW5kbGVWaWRlbyIsInNldFNvdXJjZSIsInN0YXJ0IiwiaGFuZGxlUGxheVN0YXRlIiwiYWN0aXZlIiwicGF1c2UiLCJyZXNldExpZ2h0cyIsInRvcCIsImxlZnQiLCJyaWdodCIsImJvdHRvbSIsInJlbmRlciIsImV2dCIsInRpbWUiLCJsaWdodHMiLCJnZXRMaWdodFN0YXRlIiwidGljayIsImRpc3BhdGNoRXZlbnQiLCJtb2RlIiwiaGFuZGxlUGxheWJhY2tTdGF0ZSIsImNoYW5nZVBsYXliYWNrUmF0ZSIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImRhdGEiLCJwbGF5YmFja3JhdGUiLCJzZWVrIiwidmlkZW9TbGlkZXIiLCJzZXRWYWx1ZSIsInNsaWRlclZhbHVlIiwiJGVsIiwiZmluZCIsInRleHQiLCJzZWNvbmRzVG9UaW1lU3RyaW5nIiwibmV3VGltZSIsInRvRml4ZWQiLCJzaG93VmlkZW8iLCJoaWRlIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWO0FBQUEsTUFJRUssUUFBUUwsUUFBUSxpQkFBUixDQUpWO0FBQUEsTUFLRU0sVUFBVU4sUUFBUSxvQkFBUixDQUxaO0FBQUEsTUFNRU8sSUFBSVAsUUFBUSxRQUFSLENBTk47QUFBQSxNQVFFUSxlQUFlUixRQUFRLDZDQUFSLENBUmpCO0FBQUEsTUFTRVMsY0FBY1QsUUFBUSwyQ0FBUixDQVRoQjtBQUFBLE1BVUVVLGVBQWVWLFFBQVEsNkNBQVIsQ0FWakI7QUFBQSxNQVdFVyxpQkFBaUJYLFFBQVEsaURBQVIsQ0FYbkI7O0FBRGtCLE1BY1pZLFlBZFk7QUFBQTs7QUFlaEIsMEJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEJBLGFBQU9DLFVBQVAsR0FBb0JELE9BQU9DLFVBQVAsSUFBcUJaLEtBQXpDO0FBQ0FXLGFBQU9FLFNBQVAsR0FBbUJGLE9BQU9FLFNBQVAsSUFBb0JaLElBQXZDOztBQUZrQiw4SEFHWlUsTUFIWTs7QUFJbEJULFlBQU1ZLFdBQU4sUUFBd0IsQ0FBQyxTQUFELEVBQVkscUJBQVosRUFBbUMsZUFBbkMsRUFBb0QsaUJB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S2hDLElBQUwsR0FBWXVCLGVBQVosQ0FBNEIsS0FBSzlCLE1BQUwsQ0FBWStCLE1BQVosRUFBNUI7QUFDRDtBQTdPZTtBQUFBO0FBQUEscUNBK09EO0FBQ2IsYUFBS3hCLElBQUwsR0FBWWtELEdBQVosQ0FBZ0JDLElBQWhCLENBQXFCLHlCQUFyQixFQUFnRE0sSUFBaEQ7QUFDQSxhQUFLekQsSUFBTCxHQUFZa0QsR0FBWixDQUFnQkMsSUFBaEIsQ0FBcUIsc0JBQXJCLEVBQTZDTSxJQUE3QztBQUNEO0FBbFBlOztBQUFBO0FBQUEsSUFjU3pGLFNBZFQ7O0FBc1BsQlcsZUFBYU0sTUFBYixHQUFzQjtBQUFBLFFBQUMyRCxJQUFELHVFQUFRLEVBQVI7QUFBQSxXQUFlLElBQUlqRSxZQUFKLENBQWlCLEVBQUUrRSxXQUFXZCxJQUFiLEVBQWpCLENBQWY7QUFBQSxHQUF0QjtBQUNBLFNBQU9qRSxZQUFQO0FBQ0QsQ0F4UEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGltZXIgPSByZXF1aXJlKCdjb3JlL3V0aWwvdGltZXInKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuXG4gICAgTGlnaHREaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvbGlnaHRkaXNwbGF5L2xpZ2h0ZGlzcGxheScpLFxuICAgIEJ1bGJEaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvYnVsYmRpc3BsYXkvYnVsYmRpc3BsYXknKSxcbiAgICBWaWRlb0Rpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlkZW9kaXNwbGF5JyksXG4gICAgRXVnbGVuYURpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9ldWdsZW5hZGlzcGxheS9ldWdsZW5hZGlzcGxheScpO1xuXG4gIGNsYXNzIFZpc3VhbFJlc3VsdCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcubW9kZWxDbGFzcyA9IGNvbmZpZy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgY29uZmlnLnZpZXdDbGFzcyA9IGNvbmZpZy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRpY2snLCAnX29uUGxheVBhdXNlUmVxdWVzdCcsICdfb25WaWRlb1JlYWR5JywgJ19vblJlc2V0UmVxdWVzdCcsICdfb25UaW1lckVuZCcsXG4gICAgICAnX29uU2xpZGVyUmVxdWVzdCcsJ19vblN0b3BEcmFnJywnX29uU2hvd1ZpZGVvJywnX29uUGxheWJhY2tSYXRlUmVxdWVzdCddKTtcblxuICAgICAgdGhpcy5fbGlnaHREaXNwbGF5ID0gTGlnaHREaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9tb2RlbC5nZXQoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogdGhpcy5fbW9kZWwuZ2V0KCdoZWlnaHQnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheSA9IEJ1bGJEaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9tb2RlbC5nZXQoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogdGhpcy5fbW9kZWwuZ2V0KCdoZWlnaHQnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl92aWRlb0Rpc3BsYXkgPSBWaWRlb0Rpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX21vZGVsLmdldCgnd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9tb2RlbC5nZXQoJ2hlaWdodCcpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5ID0gRXVnbGVuYURpc3BsYXkuY3JlYXRlKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlldzNkJykpO1xuXG4gICAgICB0aGlzLl90aW1lciA9IG5ldyBUaW1lcih7XG4gICAgICAgIGR1cmF0aW9uOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSxcbiAgICAgICAgbG9vcDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLl90aW1lci5hZGRFdmVudExpc3RlbmVyKCdUaW1lci5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgIHRoaXMuX3RpbWVyLmFkZEV2ZW50TGlzdGVuZXIoJ1RpbWVyLkVuZCcsIHRoaXMuX29uVGltZXJFbmQpO1xuICAgICAgdGhpcy5wbGF5YmFja0Zhc3RlciA9IGZhbHNlO1xuXG4gICAgICAvL3RoaXMuX3ZpZGVvRGlzcGxheS5hZGRFdmVudExpc3RlbmVyKCdWaWRlby5UaWNrJywgdGhpcy5fb25UaWNrKTtcblxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fbGlnaHREaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fdmlkZW9EaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZXVnbGVuYURpc3BsYXkudmlldygpLCBcIi52aXN1YWwtcmVzdWx0X19jb250ZW50XCIpXG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9idWxiRGlzcGxheS52aWV3KCksIFwiLnZpc3VhbC1yZXN1bHRfX2NvbnRlbnRcIilcblxuICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuUGxheVBhdXNlUmVxdWVzdCcsIHRoaXMuX29uUGxheVBhdXNlUmVxdWVzdCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuUGxheWJhY2tSYXRlUmVxdWVzdCcsIHRoaXMuX29uUGxheWJhY2tSYXRlUmVxdWVzdCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuUmVzZXRSZXF1ZXN0JywgdGhpcy5fb25SZXNldFJlcXVlc3QpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW9EaXNwbGF5LlJlYWR5JywgdGhpcy5fb25WaWRlb1JlYWR5KTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlNsaWRlclJlcXVlc3QnLCB0aGlzLl9vblNsaWRlclJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlN0b3BEcmFnJywgdGhpcy5fb25TdG9wRHJhZyk7XG5cbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywgdGhpcy5fb25TaG93VmlkZW8pO1xuXG4gICAgfVxuXG4gICAgaGFuZGxlTGlnaHREYXRhKGxpZ2h0RGF0YSkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdsaWdodERhdGEnLCBsaWdodERhdGEpO1xuICAgIH1cblxuICAgIGhhbmRsZU1vZGVsRGF0YShyZXN1bHRzLCBtb2RlbCwgY29sb3IpIHtcbiAgICAgIGlmIChyZXN1bHRzID09IG51bGwpIHsgLy8gR2VuZXJhdGUgdGhlIHJlc3VsdHMgZGF0YVxuXG4gICAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmhhbmRsZURhdGEoe1xuICAgICAgICAgIHRyYWNrczogW11cbiAgICAgICAgfSwgbW9kZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheS5oYW5kbGVEYXRhKHJlc3VsdHMsIG1vZGVsLCBjb2xvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGxheSh2aWRlbyA9IG51bGwpIHtcbiAgICAgIC8vIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmluaXRpYWxpemUoKTtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgaWYgKHZpZGVvKSB7XG4gICAgICAgIHRoaXMuX21vZGUgPSBcInZpZGVvXCI7XG4gICAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyh2aWRlbyk7XG4gICAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZSh0aGlzLl92aWRlb0Rpc3BsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW9kZSA9IFwiZHJ5UnVuXCI7XG4gICAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyhudWxsKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc2V0U291cmNlKG51bGwpO1xuICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgIH1cblxuICAgIHBhdXNlKCkge1xuICAgICAgdGhpcy5fdGltZXIucGF1c2UoKTtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICBjb25zdCByZXNldExpZ2h0cyA9IHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICB9O1xuICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihyZXNldExpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIocmVzZXRMaWdodHMpO1xuICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkucmVuZGVyKHJlc2V0TGlnaHRzLCAwKTtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLl90aW1lci50aW1lKCk7XG4gICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKHRpbWUpO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihsaWdodHMsIHRpbWUpO1xuXG4gICAgICB0aGlzLnZpZXcoKS50aWNrKHRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgbW9kZTogdGhpcy5fbW9kZSxcbiAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGxheWJhY2tSYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMucGxheWJhY2tGYXN0ZXIgPSB0aGlzLnBsYXliYWNrRmFzdGVyID8gZmFsc2UgOiB0cnVlO1xuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheWJhY2tTdGF0ZSh0aGlzLnBsYXliYWNrRmFzdGVyKTtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5jaGFuZ2VQbGF5YmFja1JhdGUodGhpcy5wbGF5YmFja0Zhc3Rlcik7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJwbGF5YmFja3JhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7cGxheWJhY2tyYXRlOiB0aGlzLnBsYXliYWNrRmFzdGVyID8gJ2Zhc3RlcicgOiAnbm9ybWFsJ31cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGxheVBhdXNlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICB0aGlzLl90aW1lci5wYXVzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogdGhpcy5fdGltZXIuYWN0aXZlKCkgPyBcInBsYXlcIiA6IFwicGF1c2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7fVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25WaWRlb1JlYWR5KGV2dCkge1xuICAgICAgdGhpcy5fdGltZXIuc2VlaygwKTtcbiAgICAgIHRoaXMuX29uVGljayhudWxsKVxuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXliYWNrU3RhdGUodGhpcy5wbGF5YmFja0Zhc3Rlcik7XG4gICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuY2hhbmdlUGxheWJhY2tSYXRlKHRoaXMucGxheWJhY2tGYXN0ZXIpO1xuICAgIH1cblxuICAgIF9vblJlc2V0UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnNlZWsoMCk7XG5cbiAgICAgIGNvbnN0IGxpZ2h0cyA9IHRoaXMuX21vZGVsLmdldExpZ2h0U3RhdGUoMCk7XG5cbiAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgIHRoaXMuX2J1bGJEaXNwbGF5LnJlbmRlcihsaWdodHMpO1xuICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkucmVuZGVyKGxpZ2h0cywgMCk7XG5cbiAgICAgIHRoaXMudmlldygpLnZpZGVvU2xpZGVyLnNldFZhbHVlKDApO1xuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Zpc3VhbFJlc3VsdC5UaWNrJywge1xuICAgICAgICBtb2RlOiB0aGlzLl9tb2RlLFxuICAgICAgICB0aW1lOiAwLFxuICAgICAgICBsaWdodHM6IGxpZ2h0c1xuICAgICAgfSlcblxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwicmVzZXRcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7fVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25TbGlkZXJSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYoIXRoaXMuX3RpbWVyLmFjdGl2ZSgpKSB7XG4gICAgICAgIHRoaXMuX3RpbWVyLnNlZWsoZXZ0LmRhdGEuc2xpZGVyVmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLl90aW1lci50aW1lKCk7XG4gICAgICAgIGNvbnN0IGxpZ2h0cyA9IHRoaXMuX21vZGVsLmdldExpZ2h0U3RhdGUodGltZSk7XG5cbiAgICAgICAgdGhpcy52aWV3KCkuJGVsLmZpbmQoJy52aXN1YWwtcmVzdWx0X190aW1lJykudGV4dChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKVxuICAgICAgICB0aGlzLl9saWdodERpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICAgIHRoaXMuX2J1bGJEaXNwbGF5LnJlbmRlcihsaWdodHMpO1xuICAgICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheS5yZW5kZXIobGlnaHRzLCB0aW1lKTtcblxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Zpc3VhbFJlc3VsdC5UaWNrJywge1xuICAgICAgICAgIG1vZGU6IHRoaXMuX21vZGUsXG4gICAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgICBsaWdodHM6IGxpZ2h0c1xuICAgICAgICB9KVxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uU3RvcERyYWcoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJ2aWRlb1NsaWRlclwiLFxuICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBuZXdUaW1lOiB0aGlzLl90aW1lci50aW1lKCkudG9GaXhlZCgyKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgdGhpcy5fdmlkZW9EaXNwbGF5LmhhbmRsZVZpZGVvKG51bGwpO1xuICAgICAgdGhpcy5fdGltZXIuc2V0U291cmNlKG51bGwpO1xuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIF9vblNob3dWaWRlbyhldnQpIHtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5kaXNwYXRjaEV2ZW50KCdWaWRlb0Rpc3BsYXkuU2hvd1ZpZGVvJywge3Nob3dWaWRlbzogZXZ0LmRhdGEuc2hvd1ZpZGVvfSk7XG4gICAgfVxuXG4gICAgX29uVGltZXJFbmQoZXZ0KSB7XG4gICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgIH1cblxuICAgIGhpZGVDb250cm9scygpIHtcbiAgICAgIHRoaXMudmlldygpLiRlbC5maW5kKCcudmlzdWFsLXJlc3VsdF9fY29udHJvbCcpLmhpZGUoKTtcbiAgICAgIHRoaXMudmlldygpLiRlbC5maW5kKCcudmlzdWFsLXJlc3VsdF9fdGltZScpLmhpZGUoKTtcbiAgICB9XG5cbiAgfVxuXG4gIFZpc3VhbFJlc3VsdC5jcmVhdGUgPSAoZGF0YSA9IHt9KSA9PiBuZXcgVmlzdWFsUmVzdWx0KHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICByZXR1cm4gVmlzdWFsUmVzdWx0O1xufSlcbiJdfQ==
