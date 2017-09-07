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
      _this._videoDisplay.addEventListener('Video.Tick', _this._onTick);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVyIiwiR2xvYmFscyIsIiQiLCJMaWdodERpc3BsYXkiLCJCdWxiRGlzcGxheSIsIlZpZGVvRGlzcGxheSIsIkV1Z2xlbmFEaXNwbGF5IiwiVmlzdWFsUmVzdWx0IiwiY29uZmlnIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2xpZ2h0RGlzcGxheSIsImNyZWF0ZSIsIndpZHRoIiwiX21vZGVsIiwiZ2V0IiwiaGVpZ2h0IiwiX2J1bGJEaXNwbGF5IiwiX3ZpZGVvRGlzcGxheSIsIl9ldWdsZW5hRGlzcGxheSIsIl90aW1lciIsImR1cmF0aW9uIiwibG9vcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UaWNrIiwiX29uVGltZXJFbmQiLCJ2aWV3IiwiYWRkQ2hpbGQiLCJyZXNldCIsIl9vblBsYXlQYXVzZVJlcXVlc3QiLCJfb25SZXNldFJlcXVlc3QiLCJfb25WaWRlb1JlYWR5IiwiX29uU2xpZGVyUmVxdWVzdCIsIl9vblN0b3BEcmFnIiwiX29uU2hvd1ZpZGVvIiwibGlnaHREYXRhIiwic2V0IiwicmVzdWx0cyIsIm1vZGVsIiwiY29sb3IiLCJoYW5kbGVEYXRhIiwidHJhY2tzIiwidmlkZW8iLCJzdG9wIiwiX21vZGUiLCJoYW5kbGVWaWRlbyIsInNldFNvdXJjZSIsInN0YXJ0IiwiaGFuZGxlUGxheVN0YXRlIiwiYWN0aXZlIiwicGF1c2UiLCJyZXNldExpZ2h0cyIsInRvcCIsImxlZnQiLCJyaWdodCIsImJvdHRvbSIsInJlbmRlciIsImV2dCIsInRpbWUiLCJsaWdodHMiLCJnZXRMaWdodFN0YXRlIiwidGljayIsImRpc3BhdGNoRXZlbnQiLCJtb2RlIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsInNlZWsiLCJ2aWRlb1NsaWRlciIsInNldFZhbHVlIiwic2xpZGVyVmFsdWUiLCIkZWwiLCJmaW5kIiwidGV4dCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJuZXdUaW1lIiwidG9GaXhlZCIsInNob3dWaWRlbyIsImhpZGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7QUFBQSxNQUlFSyxRQUFRTCxRQUFRLGlCQUFSLENBSlY7QUFBQSxNQUtFTSxVQUFVTixRQUFRLG9CQUFSLENBTFo7QUFBQSxNQU1FTyxJQUFJUCxRQUFRLFFBQVIsQ0FOTjtBQUFBLE1BUUVRLGVBQWVSLFFBQVEsNkNBQVIsQ0FSakI7QUFBQSxNQVNFUyxjQUFjVCxRQUFRLDJDQUFSLENBVGhCO0FBQUEsTUFVRVUsZUFBZVYsUUFBUSw2Q0FBUixDQVZqQjtBQUFBLE1BV0VXLGlCQUFpQlgsUUFBUSxpREFBUixDQVhuQjs7QUFEa0IsTUFjWlksWUFkWTtBQUFBOztBQWVoQiwwQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT0MsVUFBUCxHQUFvQkQsT0FBT0MsVUFBUCxJQUFxQlosS0FBekM7QUFDQVcsYUFBT0UsU0FBUCxHQUFtQkYsT0FBT0UsU0FBUCxJQUFvQlosSUFBdkM7O0FBRmtCLDhIQUdaVSxNQUhZOztBQUlsQlQsWUFBTVksV0FBTixRQUF3QixDQUFDLFNBQUQsRUFBWSxxQkFBWixFQUFtQyxlQUFuQyxFQUFvRCxpQkFBcEQsRUFBdUUsYUFBdkUsRUFDeEIsa0JBRHdCLEVBQ0wsYUFESyxFQUNTLGNBRFQsQ0FBeEI7O0FBR0EsWUFBS0MsYUFBTCxHQUFxQlQsYUFBYVUsTUFBYixDQUFvQjtBQUN2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QUFDQSxhQUFLekIsYUFBTCxDQUFtQjJCLFdBQW5CLENBQStCLElBQS9CO0FBQ0EsYUFBS3pCLE1BQUwsQ0FBWTBCLFNBQVosQ0FBc0IsSUFBdEI7QUFDQSxhQUFLbEIsS0FBTDtBQUNEO0FBcE5lO0FBQUE7QUFBQSxtQ0FzTkg2QixHQXRORyxFQXNORTtBQUNoQixhQUFLdkMsYUFBTCxDQUFtQjRDLGFBQW5CLENBQWlDLHdCQUFqQyxFQUEyRCxFQUFDZ0IsV0FBV3JCLElBQUlVLElBQUosQ0FBU1csU0FBckIsRUFBM0Q7QUFDRDtBQXhOZTtBQUFBO0FBQUEsa0NBME5KckIsR0ExTkksRUEwTkM7QUFDZixhQUFLL0IsSUFBTCxHQUFZc0IsZUFBWixDQUE0QixLQUFLNUIsTUFBTCxDQUFZNkIsTUFBWixFQUE1QjtBQUNEO0FBNU5lO0FBQUE7QUFBQSxxQ0E4TkQ7QUFDYixhQUFLdkIsSUFBTCxHQUFZOEMsR0FBWixDQUFnQkMsSUFBaEIsQ0FBcUIseUJBQXJCLEVBQWdETSxJQUFoRDtBQUNBLGFBQUtyRCxJQUFMLEdBQVk4QyxHQUFaLENBQWdCQyxJQUFoQixDQUFxQixzQkFBckIsRUFBNkNNLElBQTdDO0FBQ0Q7QUFqT2U7O0FBQUE7QUFBQSxJQWNTcEYsU0FkVDs7QUFvT2xCVyxlQUFhTSxNQUFiLEdBQXNCO0FBQUEsUUFBQ3VELElBQUQsdUVBQVEsRUFBUjtBQUFBLFdBQWUsSUFBSTdELFlBQUosQ0FBaUIsRUFBRTBFLFdBQVdiLElBQWIsRUFBakIsQ0FBZjtBQUFBLEdBQXRCO0FBQ0EsU0FBTzdELFlBQVA7QUFDRCxDQXRPRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3Zpc3VhbHJlc3VsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBUaW1lciA9IHJlcXVpcmUoJ2NvcmUvdXRpbC90aW1lcicpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXG5cbiAgICBMaWdodERpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5JyksXG4gICAgQnVsYkRpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS9idWxiZGlzcGxheScpLFxuICAgIFZpZGVvRGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3ZpZGVvZGlzcGxheS92aWRlb2Rpc3BsYXknKSxcbiAgICBFdWdsZW5hRGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L2V1Z2xlbmFkaXNwbGF5Jyk7XG5cbiAgY2xhc3MgVmlzdWFsUmVzdWx0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIGNvbmZpZy5tb2RlbENsYXNzID0gY29uZmlnLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBjb25maWcudmlld0NsYXNzID0gY29uZmlnLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVGljaycsICdfb25QbGF5UGF1c2VSZXF1ZXN0JywgJ19vblZpZGVvUmVhZHknLCAnX29uUmVzZXRSZXF1ZXN0JywgJ19vblRpbWVyRW5kJyxcbiAgICAgICdfb25TbGlkZXJSZXF1ZXN0JywnX29uU3RvcERyYWcnLCdfb25TaG93VmlkZW8nXSk7XG5cbiAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheSA9IExpZ2h0RGlzcGxheS5jcmVhdGUoe1xuICAgICAgICB3aWR0aDogdGhpcy5fbW9kZWwuZ2V0KCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX21vZGVsLmdldCgnaGVpZ2h0JylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fYnVsYkRpc3BsYXkgPSBCdWxiRGlzcGxheS5jcmVhdGUoe1xuICAgICAgICB3aWR0aDogdGhpcy5fbW9kZWwuZ2V0KCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX21vZGVsLmdldCgnaGVpZ2h0JylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fdmlkZW9EaXNwbGF5ID0gVmlkZW9EaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9tb2RlbC5nZXQoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogdGhpcy5fbW9kZWwuZ2V0KCdoZWlnaHQnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheSA9IEV1Z2xlbmFEaXNwbGF5LmNyZWF0ZShHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnZpZXczZCcpKTtcblxuICAgICAgdGhpcy5fdGltZXIgPSBuZXcgVGltZXIoe1xuICAgICAgICBkdXJhdGlvbjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJyksXG4gICAgICAgIGxvb3A6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuVGljaycsIHRoaXMuX29uVGljayk7XG4gICAgICB0aGlzLl90aW1lci5hZGRFdmVudExpc3RlbmVyKCdUaW1lci5FbmQnLCB0aGlzLl9vblRpbWVyRW5kKTtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5hZGRFdmVudExpc3RlbmVyKCdWaWRlby5UaWNrJywgdGhpcy5fb25UaWNrKTtcblxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fbGlnaHREaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fdmlkZW9EaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZXVnbGVuYURpc3BsYXkudmlldygpLCBcIi52aXN1YWwtcmVzdWx0X19jb250ZW50XCIpXG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9idWxiRGlzcGxheS52aWV3KCksIFwiLnZpc3VhbC1yZXN1bHRfX2NvbnRlbnRcIilcblxuICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuUGxheVBhdXNlUmVxdWVzdCcsIHRoaXMuX29uUGxheVBhdXNlUmVxdWVzdCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuUmVzZXRSZXF1ZXN0JywgdGhpcy5fb25SZXNldFJlcXVlc3QpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW9EaXNwbGF5LlJlYWR5JywgdGhpcy5fb25WaWRlb1JlYWR5KTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlNsaWRlclJlcXVlc3QnLCB0aGlzLl9vblNsaWRlclJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlN0b3BEcmFnJywgdGhpcy5fb25TdG9wRHJhZyk7XG5cbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW9SZXN1bHQuU2hvd1ZpZGVvJywgdGhpcy5fb25TaG93VmlkZW8pO1xuXG4gICAgfVxuXG4gICAgaGFuZGxlTGlnaHREYXRhKGxpZ2h0RGF0YSkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdsaWdodERhdGEnLCBsaWdodERhdGEpO1xuICAgIH1cblxuICAgIGhhbmRsZU1vZGVsRGF0YShyZXN1bHRzLCBtb2RlbCwgY29sb3IpIHtcbiAgICAgIGlmIChyZXN1bHRzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkuaGFuZGxlRGF0YSh7XG4gICAgICAgICAgdHJhY2tzOiBbXVxuICAgICAgICB9LCBtb2RlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmhhbmRsZURhdGEocmVzdWx0cywgbW9kZWwsIGNvbG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwbGF5KHZpZGVvID0gbnVsbCkge1xuICAgICAgLy8gdGhpcy5fZXVnbGVuYURpc3BsYXkuaW5pdGlhbGl6ZSgpO1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgaWYgKHZpZGVvKSB7XG4gICAgICAgIHRoaXMuX21vZGUgPSBcInZpZGVvXCI7XG4gICAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyh2aWRlbyk7XG4gICAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZSh0aGlzLl92aWRlb0Rpc3BsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW9kZSA9IFwiZHJ5UnVuXCI7XG4gICAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyhudWxsKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc2V0U291cmNlKG51bGwpO1xuICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgIH1cblxuICAgIHBhdXNlKCkge1xuICAgICAgdGhpcy5fdGltZXIucGF1c2UoKTtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICBjb25zdCByZXNldExpZ2h0cyA9IHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICB9O1xuICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihyZXNldExpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIocmVzZXRMaWdodHMpO1xuICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkucmVuZGVyKHJlc2V0TGlnaHRzLCAwKTtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLl90aW1lci50aW1lKCk7XG4gICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKHRpbWUpO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihsaWdodHMsIHRpbWUpO1xuXG4gICAgICB0aGlzLnZpZXcoKS50aWNrKHRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgbW9kZTogdGhpcy5fbW9kZSxcbiAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGxheVBhdXNlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICB0aGlzLl90aW1lci5wYXVzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogdGhpcy5fdGltZXIuYWN0aXZlKCkgPyBcInBsYXlcIiA6IFwicGF1c2VcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7fVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25WaWRlb1JlYWR5KGV2dCkge1xuICAgICAgdGhpcy5fdGltZXIuc2VlaygwKTtcbiAgICAgIHRoaXMuX29uVGljayhudWxsKVxuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBfb25SZXNldFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl90aW1lci5zZWVrKDApO1xuXG4gICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKDApO1xuXG4gICAgICB0aGlzLl9saWdodERpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihsaWdodHMsIDApO1xuXG4gICAgICB0aGlzLnZpZXcoKS52aWRlb1NsaWRlci5zZXRWYWx1ZSgwKTtcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgbW9kZTogdGhpcy5fbW9kZSxcbiAgICAgICAgdGltZTogMCxcbiAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgIH0pXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInJlc2V0XCIsXG4gICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgZGF0YToge31cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uU2xpZGVyUmVxdWVzdChldnQpIHtcbiAgICAgIGlmKCF0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICB0aGlzLl90aW1lci5zZWVrKGV2dC5kYXRhLnNsaWRlclZhbHVlKTtcblxuICAgICAgICBjb25zdCB0aW1lID0gdGhpcy5fdGltZXIudGltZSgpO1xuICAgICAgICBjb25zdCBsaWdodHMgPSB0aGlzLl9tb2RlbC5nZXRMaWdodFN0YXRlKHRpbWUpO1xuXG4gICAgICAgIHRoaXMudmlldygpLiRlbC5maW5kKCcudmlzdWFsLXJlc3VsdF9fdGltZScpLnRleHQoVXRpbHMuc2Vjb25kc1RvVGltZVN0cmluZyh0aW1lKSlcbiAgICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihsaWdodHMpO1xuICAgICAgICB0aGlzLl9idWxiRGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgICAgdGhpcy5fZXVnbGVuYURpc3BsYXkucmVuZGVyKGxpZ2h0cywgdGltZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaXN1YWxSZXN1bHQuVGljaycsIHtcbiAgICAgICAgICBtb2RlOiB0aGlzLl9tb2RlLFxuICAgICAgICAgIHRpbWU6IHRpbWUsXG4gICAgICAgICAgbGlnaHRzOiBsaWdodHNcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblN0b3BEcmFnKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwidmlkZW9TbGlkZXJcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbmV3VGltZTogdGhpcy5fdGltZXIudGltZSgpLnRvRml4ZWQoMilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5oYW5kbGVWaWRlbyhudWxsKTtcbiAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZShudWxsKTtcbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG5cbiAgICBfb25TaG93VmlkZW8oZXZ0KSB7XG4gICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuZGlzcGF0Y2hFdmVudCgnVmlkZW9EaXNwbGF5LlNob3dWaWRlbycsIHtzaG93VmlkZW86IGV2dC5kYXRhLnNob3dWaWRlb30pO1xuICAgIH1cblxuICAgIF9vblRpbWVyRW5kKGV2dCkge1xuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBoaWRlQ29udHJvbHMoKSB7XG4gICAgICB0aGlzLnZpZXcoKS4kZWwuZmluZCgnLnZpc3VhbC1yZXN1bHRfX2NvbnRyb2wnKS5oaWRlKCk7XG4gICAgICB0aGlzLnZpZXcoKS4kZWwuZmluZCgnLnZpc3VhbC1yZXN1bHRfX3RpbWUnKS5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgVmlzdWFsUmVzdWx0LmNyZWF0ZSA9IChkYXRhID0ge30pID0+IG5ldyBWaXN1YWxSZXN1bHQoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIHJldHVybiBWaXN1YWxSZXN1bHQ7XG59KVxuIl19
