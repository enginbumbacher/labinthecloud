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

      _this.view().addEventListener('VisualResult.PlayPauseRequest', _this._onPlayPauseRequest);
      _this.view().addEventListener('VisualResult.ResetRequest', _this._onResetRequest);
      _this.view().addEventListener('VideoDisplay.Ready', _this._onVideoReady);
      _this.view().addEventListener('VisualResult.SliderRequest', _this._onSliderRequest);

      _this.view().addEventListener('VisualResult.StopDrag', _this._onStopDrag);
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
    }]);

    return VisualResult;
  }(Component);

  VisualResult.create = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new VisualResult({ modelData: data });
  };
  return VisualResult;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVyIiwiR2xvYmFscyIsIiQiLCJMaWdodERpc3BsYXkiLCJCdWxiRGlzcGxheSIsIlZpZGVvRGlzcGxheSIsIkV1Z2xlbmFEaXNwbGF5IiwiVmlzdWFsUmVzdWx0IiwiY29uZmlnIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2xpZ2h0RGlzcGxheSIsImNyZWF0ZSIsIndpZHRoIiwiX21vZGVsIiwiZ2V0IiwiaGVpZ2h0IiwiX2J1bGJEaXNwbGF5IiwiX3ZpZGVvRGlzcGxheSIsIl9ldWdsZW5hRGlzcGxheSIsIl90aW1lciIsImR1cmF0aW9uIiwibG9vcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UaWNrIiwiX29uVGltZXJFbmQiLCJ2aWV3IiwiYWRkQ2hpbGQiLCJyZXNldCIsIl9vblBsYXlQYXVzZVJlcXVlc3QiLCJfb25SZXNldFJlcXVlc3QiLCJfb25WaWRlb1JlYWR5IiwiX29uU2xpZGVyUmVxdWVzdCIsIl9vblN0b3BEcmFnIiwiX29uU2hvd1ZpZGVvIiwibGlnaHREYXRhIiwic2V0IiwicmVzdWx0cyIsIm1vZGVsIiwiY29sb3IiLCJoYW5kbGVEYXRhIiwidHJhY2tzIiwidmlkZW8iLCJzdG9wIiwiX21vZGUiLCJoYW5kbGVWaWRlbyIsInNldFNvdXJjZSIsInN0YXJ0IiwiaGFuZGxlUGxheVN0YXRlIiwiYWN0aXZlIiwicGF1c2UiLCJyZXNldExpZ2h0cyIsInRvcCIsImxlZnQiLCJyaWdodCIsImJvdHRvbSIsInJlbmRlciIsImV2dCIsInRpbWUiLCJsaWdodHMiLCJnZXRMaWdodFN0YXRlIiwidGljayIsImRpc3BhdGNoRXZlbnQiLCJtb2RlIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsInNlZWsiLCJ2aWRlb1NsaWRlciIsInNldFZhbHVlIiwic2xpZGVyVmFsdWUiLCIkZWwiLCJmaW5kIiwidGV4dCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJuZXdUaW1lIiwidG9GaXhlZCIsInNob3dWaWRlbyIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BSUVLLFFBQVFMLFFBQVEsaUJBQVIsQ0FKVjtBQUFBLE1BS0VNLFVBQVVOLFFBQVEsb0JBQVIsQ0FMWjtBQUFBLE1BTUVPLElBQUlQLFFBQVEsUUFBUixDQU5OO0FBQUEsTUFRRVEsZUFBZVIsUUFBUSw2Q0FBUixDQVJqQjtBQUFBLE1BU0VTLGNBQWNULFFBQVEsMkNBQVIsQ0FUaEI7QUFBQSxNQVVFVSxlQUFlVixRQUFRLDZDQUFSLENBVmpCO0FBQUEsTUFXRVcsaUJBQWlCWCxRQUFRLGlEQUFSLENBWG5COztBQURrQixNQWNaWSxZQWRZO0FBQUE7O0FBZWhCLDBCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPQyxVQUFQLEdBQW9CRCxPQUFPQyxVQUFQLElBQXFCWixLQUF6QztBQUNBVyxhQUFPRSxTQUFQLEdBQW1CRixPQUFPRSxTQUFQLElBQW9CWixJQUF2Qzs7QUFGa0IsOEhBR1pVLE1BSFk7O0FBSWxCVCxZQUFNWSxXQUFOLFFBQXdCLENBQUMsU0FBRCxFQUFZLHFCQUFaLEVBQW1DLGVBQW5DLEVBQW9ELGlCQUFwRCxFQUF1RSxhQUF2RSxFQUN4QixrQkFEd0IsRUFDTCxhQURLLEVBQ1MsY0FEVCxDQUF4Qjs7QUFHQSxZQUFLQyxhQUFMLEdBQXFCVCxhQUFhVSxNQUFiLENBQW9CO0FBQ3ZDQyxlQUFP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MEIsU0FBWixDQUFzQixJQUF0QjtBQUNBLGFBQUtsQixLQUFMO0FBQ0Q7QUFuTmU7QUFBQTtBQUFBLG1DQXFOSDZCLEdBck5HLEVBcU5FO0FBQ2hCLGFBQUt2QyxhQUFMLENBQW1CNEMsYUFBbkIsQ0FBaUMsd0JBQWpDLEVBQTJELEVBQUNnQixXQUFXckIsSUFBSVUsSUFBSixDQUFTVyxTQUFyQixFQUEzRDtBQUNEO0FBdk5lO0FBQUE7QUFBQSxrQ0F5TkpyQixHQXpOSSxFQXlOQztBQUNmLGFBQUsvQixJQUFMLEdBQVlzQixlQUFaLENBQTRCLEtBQUs1QixNQUFMLENBQVk2QixNQUFaLEVBQTVCO0FBQ0Q7QUEzTmU7O0FBQUE7QUFBQSxJQWNTdEQsU0FkVDs7QUE4TmxCVyxlQUFhTSxNQUFiLEdBQXNCO0FBQUEsUUFBQ3VELElBQUQsdUVBQVEsRUFBUjtBQUFBLFdBQWUsSUFBSTdELFlBQUosQ0FBaUIsRUFBRXlFLFdBQVdaLElBQWIsRUFBakIsQ0FBZjtBQUFBLEdBQXRCO0FBQ0EsU0FBTzdELFlBQVA7QUFDRCxDQWhPRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlzdWFscmVzdWx0L3Zpc3VhbHJlc3VsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBUaW1lciA9IHJlcXVpcmUoJ2NvcmUvdXRpbC90aW1lcicpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICAkID0gcmVxdWlyZSgnanF1ZXJ5JyksXG5cbiAgICBMaWdodERpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5JyksXG4gICAgQnVsYkRpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS9idWxiZGlzcGxheScpLFxuICAgIFZpZGVvRGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L3ZpZGVvZGlzcGxheS92aWRlb2Rpc3BsYXknKSxcbiAgICBFdWdsZW5hRGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2V1Z2xlbmFkaXNwbGF5L2V1Z2xlbmFkaXNwbGF5Jyk7XG5cbiAgY2xhc3MgVmlzdWFsUmVzdWx0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIGNvbmZpZy5tb2RlbENsYXNzID0gY29uZmlnLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBjb25maWcudmlld0NsYXNzID0gY29uZmlnLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVGljaycsICdfb25QbGF5UGF1c2VSZXF1ZXN0JywgJ19vblZpZGVvUmVhZHknLCAnX29uUmVzZXRSZXF1ZXN0JywgJ19vblRpbWVyRW5kJyxcbiAgICAgICdfb25TbGlkZXJSZXF1ZXN0JywnX29uU3RvcERyYWcnLCdfb25TaG93VmlkZW8nXSk7XG5cbiAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheSA9IExpZ2h0RGlzcGxheS5jcmVhdGUoe1xuICAgICAgICB3aWR0aDogdGhpcy5fbW9kZWwuZ2V0KCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX21vZGVsLmdldCgnaGVpZ2h0JylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fYnVsYkRpc3BsYXkgPSBCdWxiRGlzcGxheS5jcmVhdGUoe1xuICAgICAgICB3aWR0aDogdGhpcy5fbW9kZWwuZ2V0KCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX21vZGVsLmdldCgnaGVpZ2h0JylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fdmlkZW9EaXNwbGF5ID0gVmlkZW9EaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9tb2RlbC5nZXQoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogdGhpcy5fbW9kZWwuZ2V0KCdoZWlnaHQnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheSA9IEV1Z2xlbmFEaXNwbGF5LmNyZWF0ZShHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnZpZXczZCcpKTtcblxuICAgICAgdGhpcy5fdGltZXIgPSBuZXcgVGltZXIoe1xuICAgICAgICBkdXJhdGlvbjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJyksXG4gICAgICAgIGxvb3A6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuVGljaycsIHRoaXMuX29uVGljayk7XG4gICAgICB0aGlzLl90aW1lci5hZGRFdmVudExpc3RlbmVyKCdUaW1lci5FbmQnLCB0aGlzLl9vblRpbWVyRW5kKTtcbiAgICAgIHRoaXMuX3ZpZGVvRGlzcGxheS5hZGRFdmVudExpc3RlbmVyKCdWaWRlby5UaWNrJywgdGhpcy5fb25UaWNrKTtcblxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fbGlnaHREaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fdmlkZW9EaXNwbGF5LnZpZXcoKSwgXCIudmlzdWFsLXJlc3VsdF9fY29udGVudFwiKVxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZXVnbGVuYURpc3BsYXkudmlldygpLCBcIi52aXN1YWwtcmVzdWx0X19jb250ZW50XCIpXG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9idWxiRGlzcGxheS52aWV3KCksIFwiLnZpc3VhbC1yZXN1bHRfX2NvbnRlbnRcIilcblxuICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuUGxheVBhdXNlUmVxdWVzdCcsIHRoaXMuX29uUGxheVBhdXNlUmVxdWVzdCk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdWaXN1YWxSZXN1bHQuUmVzZXRSZXF1ZXN0JywgdGhpcy5fb25SZXNldFJlcXVlc3QpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignVmlkZW9EaXNwbGF5LlJlYWR5JywgdGhpcy5fb25WaWRlb1JlYWR5KTtcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ1Zpc3VhbFJlc3VsdC5TbGlkZXJSZXF1ZXN0JywgdGhpcy5fb25TbGlkZXJSZXF1ZXN0KTtcblxuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignVmlzdWFsUmVzdWx0LlN0b3BEcmFnJywgdGhpcy5fb25TdG9wRHJhZyk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ1ZpZGVvUmVzdWx0LlNob3dWaWRlbycsIHRoaXMuX29uU2hvd1ZpZGVvKTtcblxuICAgIH1cblxuICAgIGhhbmRsZUxpZ2h0RGF0YShsaWdodERhdGEpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnbGlnaHREYXRhJywgbGlnaHREYXRhKTtcbiAgICB9XG5cbiAgICBoYW5kbGVNb2RlbERhdGEocmVzdWx0cywgbW9kZWwsIGNvbG9yKSB7XG4gICAgICBpZiAocmVzdWx0cyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmhhbmRsZURhdGEoe1xuICAgICAgICAgIHRyYWNrczogW11cbiAgICAgICAgfSwgbW9kZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheS5oYW5kbGVEYXRhKHJlc3VsdHMsIG1vZGVsLCBjb2xvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGxheSh2aWRlbyA9IG51bGwpIHtcbiAgICAgIC8vIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LmluaXRpYWxpemUoKTtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIGlmICh2aWRlbykge1xuICAgICAgICB0aGlzLl9tb2RlID0gXCJ2aWRlb1wiO1xuICAgICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuaGFuZGxlVmlkZW8odmlkZW8pO1xuICAgICAgICB0aGlzLl90aW1lci5zZXRTb3VyY2UodGhpcy5fdmlkZW9EaXNwbGF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21vZGUgPSBcImRyeVJ1blwiO1xuICAgICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuaGFuZGxlVmlkZW8obnVsbCk7XG4gICAgICAgIHRoaXMuX3RpbWVyLnNldFNvdXJjZShudWxsKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgdGhpcy52aWV3KCkuaGFuZGxlUGxheVN0YXRlKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKTtcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnBhdXNlKCk7XG4gICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgY29uc3QgcmVzZXRMaWdodHMgPSB7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgfTtcbiAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheS5yZW5kZXIocmVzZXRMaWdodHMpO1xuICAgICAgdGhpcy5fYnVsYkRpc3BsYXkucmVuZGVyKHJlc2V0TGlnaHRzKTtcbiAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihyZXNldExpZ2h0cywgMCk7XG4gICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5fdGltZXIudGltZSgpO1xuICAgICAgY29uc3QgbGlnaHRzID0gdGhpcy5fbW9kZWwuZ2V0TGlnaHRTdGF0ZSh0aW1lKTtcblxuICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihsaWdodHMpO1xuICAgICAgdGhpcy5fYnVsYkRpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheS5yZW5kZXIobGlnaHRzLCB0aW1lKTtcblxuICAgICAgdGhpcy52aWV3KCkudGljayh0aW1lKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlRpY2snLCB7XG4gICAgICAgIG1vZGU6IHRoaXMuX21vZGUsXG4gICAgICAgIHRpbWU6IHRpbWUsXG4gICAgICAgIGxpZ2h0czogbGlnaHRzXG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblBsYXlQYXVzZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fdGltZXIuYWN0aXZlKCkpIHtcbiAgICAgICAgdGhpcy5fdGltZXIucGF1c2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXcoKS5oYW5kbGVQbGF5U3RhdGUodGhpcy5fdGltZXIuYWN0aXZlKCkpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IHRoaXMuX3RpbWVyLmFjdGl2ZSgpID8gXCJwbGF5XCIgOiBcInBhdXNlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgZGF0YToge31cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uVmlkZW9SZWFkeShldnQpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnNlZWsoMCk7XG4gICAgICB0aGlzLl9vblRpY2sobnVsbClcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuXG4gICAgX29uUmVzZXRSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fdGltZXIuc2VlaygwKTtcblxuICAgICAgY29uc3QgbGlnaHRzID0gdGhpcy5fbW9kZWwuZ2V0TGlnaHRTdGF0ZSgwKTtcblxuICAgICAgdGhpcy5fbGlnaHREaXNwbGF5LnJlbmRlcihsaWdodHMpO1xuICAgICAgdGhpcy5fYnVsYkRpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICB0aGlzLl9ldWdsZW5hRGlzcGxheS5yZW5kZXIobGlnaHRzLCAwKTtcblxuICAgICAgdGhpcy52aWV3KCkudmlkZW9TbGlkZXIuc2V0VmFsdWUoMCk7XG5cbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlRpY2snLCB7XG4gICAgICAgIG1vZGU6IHRoaXMuX21vZGUsXG4gICAgICAgIHRpbWU6IDAsXG4gICAgICAgIGxpZ2h0czogbGlnaHRzXG4gICAgICB9KVxuXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJyZXNldFwiLFxuICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgIGRhdGE6IHt9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblNsaWRlclJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZighdGhpcy5fdGltZXIuYWN0aXZlKCkpIHtcbiAgICAgICAgdGhpcy5fdGltZXIuc2VlayhldnQuZGF0YS5zbGlkZXJWYWx1ZSk7XG5cbiAgICAgICAgY29uc3QgdGltZSA9IHRoaXMuX3RpbWVyLnRpbWUoKTtcbiAgICAgICAgY29uc3QgbGlnaHRzID0gdGhpcy5fbW9kZWwuZ2V0TGlnaHRTdGF0ZSh0aW1lKTtcblxuICAgICAgICB0aGlzLnZpZXcoKS4kZWwuZmluZCgnLnZpc3VhbC1yZXN1bHRfX3RpbWUnKS50ZXh0KFV0aWxzLnNlY29uZHNUb1RpbWVTdHJpbmcodGltZSkpXG4gICAgICAgIHRoaXMuX2xpZ2h0RGlzcGxheS5yZW5kZXIobGlnaHRzKTtcbiAgICAgICAgdGhpcy5fYnVsYkRpc3BsYXkucmVuZGVyKGxpZ2h0cyk7XG4gICAgICAgIHRoaXMuX2V1Z2xlbmFEaXNwbGF5LnJlbmRlcihsaWdodHMsIHRpbWUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVmlzdWFsUmVzdWx0LlRpY2snLCB7XG4gICAgICAgICAgbW9kZTogdGhpcy5fbW9kZSxcbiAgICAgICAgICB0aW1lOiB0aW1lLFxuICAgICAgICAgIGxpZ2h0czogbGlnaHRzXG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TdG9wRHJhZyhldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInZpZGVvU2xpZGVyXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG5ld1RpbWU6IHRoaXMuX3RpbWVyLnRpbWUoKS50b0ZpeGVkKDIpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICB0aGlzLl92aWRlb0Rpc3BsYXkuaGFuZGxlVmlkZW8obnVsbCk7XG4gICAgICB0aGlzLl90aW1lci5zZXRTb3VyY2UobnVsbCk7XG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgX29uU2hvd1ZpZGVvKGV2dCkge1xuICAgICAgdGhpcy5fdmlkZW9EaXNwbGF5LmRpc3BhdGNoRXZlbnQoJ1ZpZGVvRGlzcGxheS5TaG93VmlkZW8nLCB7c2hvd1ZpZGVvOiBldnQuZGF0YS5zaG93VmlkZW99KTtcbiAgICB9XG5cbiAgICBfb25UaW1lckVuZChldnQpIHtcbiAgICAgIHRoaXMudmlldygpLmhhbmRsZVBsYXlTdGF0ZSh0aGlzLl90aW1lci5hY3RpdmUoKSk7XG4gICAgfVxuICB9XG5cbiAgVmlzdWFsUmVzdWx0LmNyZWF0ZSA9IChkYXRhID0ge30pID0+IG5ldyBWaXN1YWxSZXN1bHQoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIHJldHVybiBWaXN1YWxSZXN1bHQ7XG59KVxuIl19
