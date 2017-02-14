'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Model = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    duration: 10,
    loop: false,
    currentTime: 0,
    active: false,
    source: null
  };

  return function (_EventDispatcher) {
    _inherits(Timer, _EventDispatcher);

    function Timer(config) {
      _classCallCheck(this, Timer);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Timer).call(this));

      _this._model = new Model({
        data: config,
        defaults: defaults
      });
      Utils.bindMethods(_this, ['_tick', '_onSourceLoop', '_onSourceEnd']);

      window.requestAnimationFrame(_this._tick);
      return _this;
    }

    _createClass(Timer, [{
      key: '_tick',
      value: function _tick() {
        var now = new Date().getTime();
        if (this._model.get('active')) {
          var looped = false,
              ended = false;
          if (this._model.get('source')) {
            var last = this._model.get('currentTime');
            this._model.set('currentTime', this._model.get('source').timer_time());
          } else {
            var newTime = this._model.get('currentTime') + (now - this._model.get('lastTick')) / 1000;
            if (newTime > this._model.get('duration')) {
              if (this._model.get('loop')) {
                newTime = Utils.posMod(newTime, this._model.get('duration'));
                looped = true;
              } else {
                newTime = this._model.get('duration');
                ended = true;
              }
            }
            this._model.set('currentTime', newTime);
          }
          this.dispatchEvent('Timer.Tick', {
            time: this.time()
          });
          if (looped) {
            this.dispatchEvent('Timer.Loop', {});
          }
          if (ended) {
            this._model.set('active', false);
            this.dispatchEvent('Timer.End', {});
          }
        }
        this._model.set('lastTick', now);
        window.requestAnimationFrame(this._tick);
      }
    }, {
      key: 'start',
      value: function start() {
        this._model.set('active', true);
        if (this._model.get('source')) this._model.get('source').timer_start();
        this.dispatchEvent('Timer.Start', {});
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.pause();
        this.seek(0);
        if (this._model.get('source')) this._model.get('source').timer_stop();
        this.dispatchEvent('Timer.Stop', {});
      }
    }, {
      key: 'pause',
      value: function pause() {
        this._model.set('active', false);
        if (this._model.get('source')) this._model.get('source').timer_pause();
        this.dispatchEvent('Timer.Pause', {});
      }
    }, {
      key: 'seek',
      value: function seek(time) {
        this._model.set('currentTime', Math.max(0, Math.min(this._model.get('duration'), time)));
        if (this._model.get('source')) this._model.get('source').timer_seek(time);
        this.dispatchEvent('Timer.Seek', {
          time: this.time()
        });
      }
    }, {
      key: 'active',
      value: function active() {
        return this._model.get('active');
      }
    }, {
      key: 'time',
      value: function time() {
        if (this._model.get('source')) {
          return this._model.get('source').timer_time();
        } else {
          return this._model.get('currentTime');
        }
      }
    }, {
      key: 'timeRemaining',
      value: function timeRemaining() {
        return this.duration() - this.time();
      }
    }, {
      key: 'duration',
      value: function duration() {
        if (this._model.get('source')) {
          return this._model.get('soruce').timer_duration();
        } else {
          return this._model.get('duration');
        }
      }
    }, {
      key: 'setDuration',
      value: function setDuration(val) {
        this.stop();
        this._model.set('duration', Math.max(0, val));
        this.dispatchEvent('Timer.DurationChange', {
          duration: this._model.get('duration')
        });
      }
    }, {
      key: 'setSource',
      value: function setSource(source) {
        if (source) {
          var oldSource = this._model.get('source');
          if (oldSource) {
            oldSource.removeEventListener('TimerSource.Loop', this._onSourceLoop);
            oldSource.removeEventListener('TimerSource.End', this._onSourceEnd);
          }
          source.addEventListener('TimerSource.Loop', this._onSourceLoop);
          source.addEventListener('TimerSource.End', this._onSourceEnd);
        }
        this._model.set('source', source);
      }
    }, {
      key: '_onSourceEnd',
      value: function _onSourceEnd(evt) {
        this._model.set('active', false);
        this.dispatchEvent('Timer.End', {});
      }
    }, {
      key: '_onSourceLoop',
      value: function _onSourceLoop(evt) {
        this.dispatchEvent('Timer.Loop', {});
      }
    }]);

    return Timer;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvdGltZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxrQkFBa0IsUUFBUSx1QkFBUixDQUF4QjtBQUFBLE1BQ0UsUUFBUSxRQUFRLGtCQUFSLENBRFY7QUFBQSxNQUVFLFFBQVEsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFJRSxXQUFXO0FBQ1QsY0FBVSxFQUREO0FBRVQsVUFBTSxLQUZHO0FBR1QsaUJBQWEsQ0FISjtBQUlULFlBQVEsS0FKQztBQUtULFlBQVE7QUFMQyxHQUpiOztBQVlBO0FBQUE7O0FBQ0UsbUJBQVksTUFBWixFQUFvQjtBQUFBOztBQUFBOztBQUVsQixZQUFLLE1BQUwsR0FBYyxJQUFJLEtBQUosQ0FBVTtBQUN0QixjQUFNLE1BRGdCO0FBRXRCLGtCQUFVO0FBRlksT0FBVixDQUFkO0FBSUEsWUFBTSxXQUFOLFFBQXdCLENBQUMsT0FBRCxFQUFVLGVBQVYsRUFBMkIsY0FBM0IsQ0FBeEI7O0FBRUEsYUFBTyxxQkFBUCxDQUE2QixNQUFLLEtBQWxDO0FBUmtCO0FBU25COztBQVZIO0FBQUE7QUFBQSw4QkFZVTtBQUNOLFlBQUksTUFBTyxJQUFJLElBQUosRUFBRCxDQUFXLE9BQVgsRUFBVjtBQUNBLFlBQUksS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixRQUFoQixDQUFKLEVBQStCO0FBQzdCLGNBQUksU0FBUyxLQUFiO0FBQUEsY0FDRSxRQUFRLEtBRFY7QUFFQSxjQUFJLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsUUFBaEIsQ0FBSixFQUErQjtBQUM3QixnQkFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsYUFBaEIsQ0FBWDtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLGFBQWhCLEVBQStCLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsUUFBaEIsRUFBMEIsVUFBMUIsRUFBL0I7QUFD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LFFBQWhCLENBQWxCO0FBQ0EsY0FBSSxTQUFKLEVBQWU7QUFDYixzQkFBVSxtQkFBVixDQUE4QixrQkFBOUIsRUFBa0QsS0FBSyxhQUF2RDtBQUNBLHNCQUFVLG1CQUFWLENBQThCLGlCQUE5QixFQUFpRCxLQUFLLFlBQXREO0FBQ0Q7QUFDRCxpQkFBTyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsS0FBSyxhQUFqRDtBQUNBLGlCQUFPLGdCQUFQLENBQXdCLGlCQUF4QixFQUEyQyxLQUFLLFlBQWhEO0FBQ0Q7QUFDRCxhQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFFBQWhCLEVBQTBCLE1BQTFCO0FBQ0Q7QUF0SEg7QUFBQTtBQUFBLG1DQXdIZSxHQXhIZixFQXdIb0I7QUFDaEIsYUFBSyxNQUFMLENBQVksR0FBWixDQUFnQixRQUFoQixFQUEwQixLQUExQjtBQUNBLGFBQUssYUFBTCxDQUFtQixXQUFuQixFQUFnQyxFQUFoQztBQUNEO0FBM0hIO0FBQUE7QUFBQSxvQ0E2SGdCLEdBN0hoQixFQTZIcUI7QUFDakIsYUFBSyxhQUFMLENBQW1CLFlBQW5CLEVBQWlDLEVBQWpDO0FBQ0Q7QUEvSEg7O0FBQUE7QUFBQSxJQUEyQixlQUEzQjtBQWlJRCxDQTlJRCIsImZpbGUiOiJtb2R1bGUvY29yZS91dGlsL3RpbWVyLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
