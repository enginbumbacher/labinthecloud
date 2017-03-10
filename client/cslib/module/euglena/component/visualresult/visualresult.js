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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VisualResult).call(this, config));

      Utils.bindMethods(_this, ['_onTick', '_onPlayPauseRequest', '_onVideoReady']);

      _this._lightDisplay = LightDisplay.create({
        width: _this._model.get('width'),
        height: _this._model.get('height')
      });
      _this._videoDisplay = VideoDisplay.create({
        width: _this._model.get('width'),
        height: _this._model.get('height')
      });
      _this._euglenaDisplay = EuglenaDisplay.create(Globals.get('AppConfig.view3d'));
      _this._euglenaDisplay.initialize();

      _this._timer = new Timer({
        duration: Globals.get('AppConfig.experimentLength'),
        loop: true
      });
      _this._timer.addEventListener('Timer.Tick', _this._onTick);
      _this._videoDisplay.addEventListener('Video.Tick', _this._onTick);

      _this.view().addChild(_this._lightDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._videoDisplay.view(), ".visual-result__content");
      _this.view().addChild(_this._euglenaDisplay.view(), ".visual-result__content");

      _this.reset();

      _this.view().addEventListener('VisualResult.PlayPauseRequest', _this._onPlayPauseRequest);
      _this.view().addEventListener('VideoDisplay.Ready', _this._onVideoReady);
      return _this;
    }

    _createClass(VisualResult, [{
      key: 'handleLightData',
      value: function handleLightData(lightData) {
        this._model.set('lightData', lightData);
      }
    }, {
      key: 'play',
      value: function play() {
        var video = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        this._euglenaDisplay.initialize();
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
        this._euglenaDisplay.render(lights, time * 1000);

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
      }
    }, {
      key: '_onVideoReady',
      value: function _onVideoReady(evt) {
        this._timer.start();
        this.view().handlePlayState(this._timer.active());
      }
    }]);

    return VisualResult;
  }(Component);

  VisualResult.create = function () {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return new VisualResult({ modelData: data });
  };
  return VisualResult;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aXN1YWxyZXN1bHQvdmlzdWFscmVzdWx0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sWUFBWSxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRSxRQUFRLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRSxPQUFPLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRSxRQUFRLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BSUUsUUFBUSxRQUFRLGlCQUFSLENBSlY7QUFBQSxNQUtFLFVBQVUsUUFBUSxvQkFBUixDQUxaO0FBQUEsTUFPRSxlQUFlLFFBQVEsNkNBQVIsQ0FQakI7QUFBQSxNQVFFLGVBQWUsUUFBUSw2Q0FBUixDQVJqQjtBQUFBLE1BU0UsaUJBQWlCLFFBQVEsaURBQVIsQ0FUbkI7O0FBRGtCLE1BWVosWUFaWTtBQUFBOztBQWFoQiwwQkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLGFBQU8sVUFBUCxHQUFvQixPQUFPLFVBQVAsSUFBcUIsS0FBekM7QUFDQSxhQUFPLFNBQVAsR0FBbUIsT0FBTyxTQUFQLElBQW9CLElBQXZDOztBQUZrQixrR0FHWixNQUhZOztBQUlsQixZQUFNLFdBQU4sUUFBd0IsQ0FBQyxTQUFELEVBQVkscUJBQVosRUFBbUMsZUFBbkMsQ0FBeEI7O0FBRUEsWUFBSyxhQUFMLEdBQXFCLGFBQWEsTUFBYixDQUFvQjtBQUN2QyxlQUFPLE1BQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsT0FBaEIsQ0FEZ0M7QUFFdkMsZ0JBQVEsTUFBSyxNQUFMLENBQVksR0FBWixDQUFnQixRQUFoQjtBQUYrQixPQUFwQixDQUFyQjtBQUlBLFlBQUssYUFBTCxHQUFxQixhQUFhLE1BQWIsQ0FBb0I7QUFDdkMsZUFBTyxNQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLE9BQWhCLENBRGdDO0FBRXZDLGdCQUFRLE1BQUssTUFBTCxD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LE1BQUwsQ0FBWSxJQUFaLEVBQWI7QUFDQSxZQUFNLFNBQVMsS0FBSyxNQUFMLENBQVksYUFBWixDQUEwQixJQUExQixDQUFmOztBQUVBLGFBQUssYUFBTCxDQUFtQixNQUFuQixDQUEwQixNQUExQjtBQUNBLGFBQUssZUFBTCxDQUFxQixNQUFyQixDQUE0QixNQUE1QixFQUFvQyxPQUFPLElBQTNDOztBQUVBLGFBQUssSUFBTCxHQUFZLElBQVosQ0FBaUIsSUFBakI7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsbUJBQW5CLEVBQXdDO0FBQ3RDLGdCQUFNLEtBQUssS0FEMkI7QUFFdEMsZ0JBQU0sSUFGZ0M7QUFHdEMsa0JBQVE7QUFIOEIsU0FBeEM7QUFLRDtBQXZHZTtBQUFBO0FBQUEsMENBeUdJLEdBekdKLEVBeUdTO0FBQ3ZCLFlBQUksS0FBSyxNQUFMLENBQVksTUFBWixFQUFKLEVBQTBCO0FBQ3hCLGVBQUssTUFBTCxDQUFZLEtBQVo7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLLE1BQUwsQ0FBWSxLQUFaO0FBQ0Q7QUFDRCxhQUFLLElBQUwsR0FBWSxlQUFaLENBQTRCLEtBQUssTUFBTCxDQUFZLE1BQVosRUFBNUI7QUFDRDtBQWhIZTtBQUFBO0FBQUEsb0NBa0hGLEdBbEhFLEVBa0hHO0FBQ2pCLGFBQUssTUFBTCxDQUFZLEtBQVo7QUFDQSxhQUFLLElBQUwsR0FBWSxlQUFaLENBQTRCLEtBQUssTUFBTCxDQUFZLE1BQVosRUFBNUI7QUFDRDtBQXJIZTs7QUFBQTtBQUFBLElBWVMsU0FaVDs7QUF3SGxCLGVBQWEsTUFBYixHQUFzQjtBQUFBLFFBQUMsSUFBRCx5REFBUSxFQUFSO0FBQUEsV0FBZSxJQUFJLFlBQUosQ0FBaUIsRUFBRSxXQUFXLElBQWIsRUFBakIsQ0FBZjtBQUFBLEdBQXRCO0FBQ0EsU0FBTyxZQUFQO0FBQ0QsQ0ExSEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L3Zpc3VhbHJlc3VsdC92aXN1YWxyZXN1bHQuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
