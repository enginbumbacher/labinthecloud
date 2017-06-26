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

      Utils.bindMethods(_this, ['_onTick', '_onPlayPauseRequest', '_onVideoReady', '_onResetRequest', '_onTimerEnd']);

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
        Globals.get('Logger').log({
          type: "reset",
          category: "results",
          data: {}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIlRpbWVyIiwiR2xvYmFscyIsIkxpZ2h0RGlzcGxheSIsIlZpZGVvRGlzcGxheSIsIkV1Z2xlbmFEaXNwbGF5IiwiVmlzdWFsUmVzdWx0IiwiY29uZmlnIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2xpZ2h0RGlzcGxheSIsImNyZWF0ZSIsIndpZHRoIiwiX21vZGVsIiwiZ2V0IiwiaGVpZ2h0IiwiX3ZpZGVvRGlzcGxheSIsIl9ldWdsZW5hRGlzcGxheSIsIl90aW1lciIsImR1cmF0aW9uIiwibG9vcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UaWNrIiwiX29uVGltZXJFbmQiLCJ2aWV3IiwiYWRkQ2hpbGQiLCJyZXNldCIsIl9vblBsYXlQYXVzZVJlcXVlc3QiLCJfb25SZXNldFJlcXVlc3QiLCJfb25WaWRlb1JlYWR5IiwibGlnaHREYXRhIiwic2V0IiwicmVzdWx0cyIsIm1vZGVsIiwiY29sb3IiLCJoYW5kbGVEYXRhIiwidHJhY2tzIiwidmlkZW8iLCJzdG9wIiwiX21vZGUiLCJoYW5kbGVWaWRlbyIsInNldFNvdXJjZSIsInN0YXJ0IiwiaGFuZGxlUGxheVN0YXRlIiwiYWN0aXZlIiwicGF1c2UiLCJyZXNldExpZ2h0cyIsInRvcCIsImxlZnQiLCJyaWdodCIsImJvdHRvbSIsInJlbmRlciIsImV2dCIsInRpbWUiLCJsaWdodHMiLCJnZXRMaWdodFN0YXRlIiwidGljayIsImRpc3BhdGNoRXZlbnQiLCJtb2RlIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsInNlZWsiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIs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Q0QsYUFBS2xCLElBQUwsR0FBWW1CLGVBQVosQ0FBNEIsS0FBS3pCLE1BQUwsQ0FBWTBCLE1BQVosRUFBNUI7QUFDQTNDLGdCQUFRYSxHQUFSLENBQVksUUFBWixFQUFzQjZDLEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxLQUFLMUMsTUFBTCxDQUFZMEIsTUFBWixLQUF1QixNQUF2QixHQUFnQyxPQURkO0FBRXhCaUIsb0JBQVUsU0FGYztBQUd4QkMsZ0JBQU07QUFIa0IsU0FBMUI7QUFLRDtBQWhJZTtBQUFBO0FBQUEsb0NBa0lGVixHQWxJRSxFQWtJRztBQUNqQixhQUFLbEMsTUFBTCxDQUFZNkMsSUFBWixDQUFpQixDQUFqQjtBQUNBLGFBQUt6QyxPQUFMLENBQWEsSUFBYjtBQUNBLGFBQUtFLElBQUwsR0FBWW1CLGVBQVosQ0FBNEIsS0FBS3pCLE1BQUwsQ0FBWTBCLE1BQVosRUFBNUI7QUFDRDtBQXRJZTtBQUFBO0FBQUEsc0NBd0lBUSxHQXhJQSxFQXdJSztBQUNuQixhQUFLbEMsTUFBTCxDQUFZNkMsSUFBWixDQUFpQixDQUFqQjtBQUNBOUQsZ0JBQVFhLEdBQVIsQ0FBWSxRQUFaLEVBQXNCNkMsR0FBdEIsQ0FBMEI7QUFDeEJDLGdCQUFNLE9BRGtCO0FBRXhCQyxvQkFBVSxTQUZjO0FBR3hCQyxnQkFBTTtBQUhrQixTQUExQjtBQUtEO0FBL0llO0FBQUE7QUFBQSw4QkFpSlI7QUFDTixhQUFLNUMsTUFBTCxDQUFZb0IsSUFBWjtBQUNBLGFBQUt0QixhQUFMLENBQW1Cd0IsV0FBbkIsQ0FBK0IsSUFBL0I7QUFDQSxhQUFLdEIsTUFBTCxDQUFZdUIsU0FBWixDQUFzQixJQUF0QjtBQUNBLGFBQUtmLEtBQUw7QUFDRDtBQXRKZTtBQUFBO0FBQUEsa0NBd0pKMEIsR0F4SkksRUF3SkM7QUFDZixhQUFLNUIsSUFBTCxHQUFZbUIsZUFBWixDQUE0QixLQUFLekIsTUFBTCxDQUFZMEIsTUFBWixFQUE1QjtBQUNEO0FBMUplOztBQUFBO0FBQUEsSUFZU2hELFNBWlQ7O0FBNkpsQlMsZUFBYU0sTUFBYixHQUFzQjtBQUFBLFFBQUNtRCxJQUFELHVFQUFRLEVBQVI7QUFBQSxXQUFlLElBQUl6RCxZQUFKLENBQWlCLEVBQUUyRCxXQUFXRixJQUFiLEVBQWpCLENBQWY7QUFBQSxHQUF0QjtBQUNBLFNBQU96RCxZQUFQO0FBQ0QsQ0EvSkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
