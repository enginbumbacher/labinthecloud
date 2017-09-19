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

      Utils.bindMethods(_this, ['_onTick', '_onPlayPauseRequest', '_onVideoReady', '_onResetRequest', '_onTimerEnd', '_onSliderRequest', '_onStopDrag', '_onShowVideo']);

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

      //this._videoDisplay.addEventListener('Video.Tick', this._onTick);

      _this.view().addChild(_this._lightDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._videoDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._euglenaDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._bulbDisplay.view(), ".visual-result__content");

      _this.reset();

      Globals.get('Relay').addEventListener('VisualResult.PlayPauseRequest', _this._onPlayPauseRequest);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVyIiwiR2xvYmFscyIsIiQiLCJMaWdodERpc3BsYXkiLCJCdWxiRGlzcGxheSIsIlZpZGVvRGlzcGxheSIsIkV1Z2xlbmFEaXNwbGF5IiwiVmlzdWFsUmVzdWx0IiwiY29uZmlnIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2xpZ2h0RGlzcGxheSIsImNyZWF0ZSIsIndpZHRoIiwiX21vZGVsIiwiZ2V0IiwiaGVpZ2h0IiwiX2J1bGJEaXNwbGF5IiwiX3ZpZGVvRGlzcGxheSIsIl9ldWdsZW5hRGlzcGxheSIsIl90aW1lciIsImR1cmF0aW9uIiwibG9vcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UaWNrIiwiX29uVGltZXJFbmQiLCJ2aWV3IiwiYWRkQ2hpbGQiLCJyZXNldCIsIl9vblBsYXlQYXVzZVJlcXVlc3QiLCJfb25SZXNldFJlcXVlc3QiLCJfb25WaWRlb1JlYWR5IiwiX29uU2xpZGVyUmVxdWVzdCIsIl9vblN0b3BEcmFnIiwiX29uU2hvd1ZpZGVvIiwibGlnaHREYXRhIiwic2V0IiwicmVzdWx0cyIsIm1vZGVsIiwiY29sb3IiLCJoYW5kbGVEYXRhIiwidHJhY2tzIiwidmlkZW8iLCJzdG9wIiwiX21vZGUiLCJoYW5kbGVWaWRlbyIsInNldFNvdXJjZSIsInN0YXJ0IiwiaGFuZGxlUGxheVN0YXRlIiwiYWN0aXZlIiwicGF1c2UiLCJyZXNldExpZ2h0cyIsInRvcCIsImxlZnQiLCJyaWdodCIsImJvdHRvbSIsInJlbmRlciIsImV2dCIsInRpbWUiLCJsaWdodHMiLCJnZXRMaWdodFN0YXRlIiwidGljayIsImRpc3BhdGNoRXZlbnQiLCJtb2RlIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsInNlZWsiLCJ2aWRlb1NsaWRlciIsInNldFZhbHVlIiwic2xpZGVyVmFsdWUiLCIkZWwiLCJmaW5kIiwidGV4dCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJuZXdUaW1lIiwidG9GaXhlZCIsInNob3dWaWRlbyIsImhpZGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7QUFBQSxNQUlFSyxRQUFRTCxRQUFRLGlCQUFSLENBSlY7QUFBQSxNQUtFTSxVQUFVTixRQUFRLG9CQUFSLENBTFo7QUFBQSxNQU1FTyxJQUFJUCxRQUFRLFFBQVIsQ0FOTjtBQUFBLE1BUUVRLGVBQWVSLFFBQVEsNkNBQVIsQ0FSakI7QUFBQSxNQVNFUyxjQUFjVCxRQUFRLDJDQUFSLENBVGhCO0FBQUEsTUFVRVUsZUFBZVYsUUFBUSw2Q0FBUixDQVZqQjtBQUFBLE1BV0VXLGlCQUFpQlgsUUFBUSxpREFBUixDQVhuQjs7QUFEa0IsTUFjWlksWUFkWTtBQUFBOztBQWVoQiwwQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT0MsVUFBUCxHQUFvQkQsT0FBT0MsVUFBUCxJQUFxQlosS0FBekM7QUFDQVcsYUFBT0UsU0FBUCxHQUFtQkYsT0FBT0UsU0FBUCxJQUFvQlosSUFBdkM7O0FBRmtCLDhIQUdaVSxNQUhZOztBQUlsQlQsWUFBTVksV0FBTixRQUF3QixDQUFDLFNBQUQsRUFBWSxxQkFBWixFQUFtQyxlQUFuQyxFQUFvRCxpQkFBcEQsRUFBdUUsYUFBdkUsRUFDeEIsa0JBRHdCLEVBQ0wsYUFESyxFQUNTLGNBRFQsQ0FBeEI7O0FBR0EsWUFBS0MsYUFBTCxHQUFxQlQsYUFBYVUsTUFBYixDQUFvQjtBQUN2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QUFZMEIsU0FBWixDQUFzQixJQUF0QjtBQUNBLGFBQUtsQixLQUFMO0FBQ0Q7QUF0TmU7QUFBQTtBQUFBLG1DQXdOSDZCLEdBeE5HLEVBd05FO0FBQ2hCLGFBQUt2QyxhQUFMLENBQW1CNEMsYUFBbkIsQ0FBaUMsd0JBQWpDLEVBQTJELEVBQUNnQixXQUFXckIsSUFBSVUsSUFBSixDQUFTVyxTQUFyQixFQUEzRDtBQUNEO0FBMU5lO0FBQUE7QUFBQSxrQ0E0TkpyQixHQTVOSSxFQTROQztBQUNmLGFBQUsvQixJQUFMLEdBQVlzQixlQUFaLENBQTRCLEtBQUs1QixNQUFMLENBQVk2QixNQUFaLEVBQTVCO0FBQ0Q7QUE5TmU7QUFBQTtBQUFBLHFDQWdPRDtBQUNiLGFBQUt2QixJQUFMLEdBQVk4QyxHQUFaLENBQWdCQyxJQUFoQixDQUFxQix5QkFBckIsRUFBZ0RNLElBQWhEO0FBQ0EsYUFBS3JELElBQUwsR0FBWThDLEdBQVosQ0FBZ0JDLElBQWhCLENBQXFCLHNCQUFyQixFQUE2Q00sSUFBN0M7QUFDRDtBQW5PZTs7QUFBQTtBQUFBLElBY1NwRixTQWRUOztBQXVPbEJXLGVBQWFNLE1BQWIsR0FBc0I7QUFBQSxRQUFDdUQsSUFBRCx1RUFBUSxFQUFSO0FBQUEsV0FBZSxJQUFJN0QsWUFBSixDQUFpQixFQUFFMEUsV0FBV2IsSUFBYixFQUFqQixDQUFmO0FBQUEsR0FBdEI7QUFDQSxTQUFPN0QsWUFBUDtBQUNELENBek9EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFRpbWVyID0gcmVxdWlyZSgnY29yZS91dGlsL3RpbWVyJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcblxuICAgIExpZ2h0RGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2xpZ2h0ZGlzcGxheS9saWdodGRpc3BsYXknKSxcbiAgICBCdWxiRGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2J1bGJkaXNwbGF5L2J1bGJkaXNwbGF5JyksXG4gICAgVmlkZW9EaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvdmlkZW9kaXNwbGF5L3ZpZGVvZGlzcGxheScpLFxuICAgIEV1Z2xlbmFEaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvZXVnbGVuYWRpc3BsYXkvZXVnbGVuYWRpc3BsYXknKTtcblxuICBjbGFzcyBWaXN1YWxSZXN1bHQgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgY29uZmlnLm1vZGVsQ2xhc3MgPSBjb25maWcubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIGNvbmZpZy52aWV3Q2xhc3MgPSBjb25maWcudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihjb25maWcpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25UaWNrJywgJ19vblBsYXlQYXVzZVJlcXVlc3QnLCAnX29uVmlkZW9SZWFkeScsICdfb25SZXNldFJlcXVlc3QnLCAnX29uVGltZXJFbmQnLFxuICAgICAgJ19vblNsaWRlclJlcXVlc3QnLCdfb25TdG9wRHJhZycsJ19vblNob3dWaWRlbyddKTtcblxuICAgICAgdGhpcy5fbGlnaHREaXNwbGF5ID0gTGlnaHREaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9tb2RlbC5nZXQoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogdGhpcy5fbW9kZWwuZ2V0KCdoZWlnaHQnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheSA9IEJ1bGJEaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9tb2RlbC5nZXQoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogdGhpcy5fbW9kZWwuZ2V0KCdoZWlnaHQnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl92aWRlb0Rpc3BsYXkgPSBWaWRlb0Rpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX21vZGVsLmdldCgnd2lkdGgnKSxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9tb2RlbC5nZXQoJ2hlaWdodCcpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5ID0gRXVnbGVuYURpc3BsYXkuY3JlYXRlKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcudmlldzNkJykpO1xuXG4gICAgICB0aGlzLl90aW1lciA9IG5ldyBUaW1lcih7XG4gICAgICAgIGR1cmF0aW9uOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSxcbiAgICAgICAgbG9vcDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLl90aW1lci5hZGRFdmVudExpc3RlbmVyKCdUaW1lci5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgIHRoaXMuX3RpbWVyLmFkZEV2ZW50TGlzdGVuZXIoJ1RpbWVyLkVuZCcsIHRoaXMuX29uVGltZXJFbmQpO1xuXG4gICAgICAvL3RoaXMuX3ZpZGVvRGlzcGxheS5hZGRFdmVudExpc3RlbmVyKCdWaWRlby5UaWNrJywgdGhpcy5fb25UaWNrKTtcblxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fbGlnaHREaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fdmlkZW9EaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZXVnbGVuYURpc3BsYXkudmlldygpLCBcIi52aXN1YWwtcmVzdWx0X19jb250ZW50XCIpXG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9idWxiRGlzcGxheS52aWV3KCksIFwiLnZpc3VhbC1yZXN1bHRfX2NvbnRlbnRcIilcblxuICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuUGxheVBhdXNlUmVxdWVzdCcsIHRoaXMuX29uUGxheVBhdXNlUmVxdWVzdCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuUmVzZXRSZXF1ZXN0JywgdGhpcy5fb25SZXNldFJlcXVlc3QpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW9EaXNwbGF5LlJlYWR5JywgdGhpcy5fb25WaWRlb1JlYWR5KTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlNsaWRlclJlcXVlc3QnLCB0aGlzLl9vblNsaWRlclJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlN0b3BEcmFnJywgdGhpcy5fb25TdG9wRHJhZyk7XG5cbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywgdGhpcy5fb25TaG93VmlkZW8pO1xuXG4gICAgfVxuXG4gICAgaGFuZGxlTGlnaHREYXRhKGxpZ2h0RGF0YSkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdsaWdodERhdGEnLCBsaWdodERhdGEpO1xuICAgIH1cblxuICAgIGhhbmRsZU1vZGVsRGF0YShyZXN1bHRzLCBtb2RlbCwgY29sb3IpIHtcbiAgICAgIGlmIChyZXN1bHRzID09IG51bGwpIHsgLy8gR2VuZXJhdGUgdGhlIHJlc3VsdHMgZGF0YVxuXG4gICAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmhhbmRsZURhdGEoe1xuICAgICAgICAgIHRyYWNrczogW11cbiAgICAgICAgfSwgbW9kZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheS5oYW5kbGVEYXRhKHJlc3VsdHMsIG1vZGVsLCBjb2xvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGxheSh2aWRlbyA9IG51bGwpIHtcbiAgICAgIC8vIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmluaXRpYWxpemUoKTtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgaWYgKHZpZGVvKSB7XG4gICAgICAgIHRoaXMuX21vZGUgPSBcInZpZGVvXCI7XG4gICAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyh2aWRlbyk7XG4gICAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZSh0aGlzLl92aWRlb0Rpc3BsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW9kZSA9IFwiZHJ5UnVuXCI7XG4gICAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyhudWxsKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc2V0U291cmNlKG51bGwpO1xuICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgIH1cblxuICAgIHBhdXNlKCkge1xuICAgICAgdGhpcy5fdGltZXIucGF1c2UoKTtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICBjb25zdCByZXNldExpZ2h0cyA9IHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICB9O1xuICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihyZXNldExpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIocmVzZXRMaWdodHMpO1xuICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkucmVuZGVyKHJlc2V0TGlnaHRzLCAwKTtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLl90aW1lci50aW1lKCk7XG4gICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKHRpbWUpO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihsaWdodHMsIHRpbWUpO1xuXG4gICAgICB0aGlzLnZpZXcoKS50aWNrKHRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgbW9kZTogdGhpcy5fbW9kZSxcbiAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGxheVBhdXNlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICB0aGlzLl90aW1lci5wYXVzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogdGhpcy5fdGltZXIuYWN0aXZlKCkgPyBcInBsYXlcIiA6IFwicGF1c2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7fVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25WaWRlb1JlYWR5KGV2dCkge1xuICAgICAgdGhpcy5fdGltZXIuc2VlaygwKTtcbiAgICAgIHRoaXMuX29uVGljayhudWxsKVxuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBfb25SZXNldFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl90aW1lci5zZWVrKDApO1xuXG4gICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKDApO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihsaWdodHMsIDApO1xuXG4gICAgICB0aGlzLnZpZXcoKS52aWRlb1NsaWRlci5zZXRWYWx1ZSgwKTtcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgbW9kZTogdGhpcy5fbW9kZSxcbiAgICAgICAgdGltZTogMCxcbiAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgIH0pXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInJlc2V0XCIsXG4gICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgZGF0YToge31cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uU2xpZGVyUmVxdWVzdChldnQpIHtcbiAgICAgIGlmKCF0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICB0aGlzLl90aW1lci5zZWVrKGV2dC5kYXRhLnNsaWRlclZhbHVlKTtcblxuICAgICAgICBjb25zdCB0aW1lID0gdGhpcy5fdGltZXIudGltZSgpO1xuICAgICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKHRpbWUpO1xuXG4gICAgICAgIHRoaXMudmlldygpLiRlbC5maW5kKCcudmlzdWFsLXJlc3VsdF9fdGltZScpLnRleHQoVXRpbHMuc2Vjb25kc1RvVGltZVN0cmluZyh0aW1lKSlcbiAgICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihsaWdodHMpO1xuICAgICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkucmVuZGVyKGxpZ2h0cywgdGltZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgICBtb2RlOiB0aGlzLl9tb2RlLFxuICAgICAgICAgIHRpbWU6IHRpbWUsXG4gICAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblN0b3BEcmFnKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwidmlkZW9TbGlkZXJcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbmV3VGltZTogdGhpcy5fdGltZXIudGltZSgpLnRvRml4ZWQoMilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyhudWxsKTtcbiAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZShudWxsKTtcbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG5cbiAgICBfb25TaG93VmlkZW8oZXZ0KSB7XG4gICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuZGlzcGF0Y2hFdmVudCgnVmlkZW9EaXNwbGF5LlNob3dWaWRlbycsIHtzaG93VmlkZW86IGV2dC5kYXRhLnNob3dWaWRlb30pO1xuICAgIH1cblxuICAgIF9vblRpbWVyRW5kKGV2dCkge1xuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBoaWRlQ29udHJvbHMoKSB7XG4gICAgICB0aGlzLnZpZXcoKS4kZWwuZmluZCgnLnZpc3VhbC1yZXN1bHRfX2NvbnRyb2wnKS5oaWRlKCk7XG4gICAgICB0aGlzLnZpZXcoKS4kZWwuZmluZCgnLnZpc3VhbC1yZXN1bHRfX3RpbWUnKS5oaWRlKCk7XG4gICAgfVxuXG4gIH1cblxuICBWaXN1YWxSZXN1bHQuY3JlYXRlID0gKGRhdGEgPSB7fSkgPT4gbmV3IFZpc3VhbFJlc3VsdCh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgcmV0dXJuIFZpc3VhbFJlc3VsdDtcbn0pXG4iXX0=
