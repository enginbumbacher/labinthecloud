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
    source: null,
    rate: 1
  };

  return function (_EventDispatcher) {
    _inherits(Timer, _EventDispatcher);

    function Timer(config) {
      _classCallCheck(this, Timer);

      var _this = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this));

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
            var newTime = this._model.get('currentTime') + this._model.get('rate') * (now - this._model.get('lastTick')) / 1000;
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
        if (this.time() >= this.duration()) this.seek(0);
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
          return this._model.get('source').timer_duration();
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
      key: 'setRate',
      value: function setRate(rate) {
        this._model.set('rate', rate);
        this.dispatchEvent('Timer.RateChange', {
          rate: rate
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvdGltZXIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkV2ZW50RGlzcGF0Y2hlciIsIk1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsImR1cmF0aW9uIiwibG9vcCIsImN1cnJlbnRUaW1lIiwiYWN0aXZlIiwic291cmNlIiwicmF0ZSIsImNvbmZpZyIsIl9tb2RlbCIsImRhdGEiLCJiaW5kTWV0aG9kcyIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIl90aWNrIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJnZXQiLCJsb29wZWQiLCJlbmRlZCIsImxhc3QiLCJzZXQiLCJ0aW1lcl90aW1lIiwibmV3VGltZSIsInBvc01vZCIsImRpc3BhdGNoRXZlbnQiLCJ0aW1lIiwic2VlayIsInRpbWVyX3N0YXJ0IiwicGF1c2UiLCJ0aW1lcl9zdG9wIiwidGltZXJfcGF1c2UiLCJNYXRoIiwibWF4IiwibWluIiwidGltZXJfc2VlayIsInRpbWVyX2R1cmF0aW9uIiwidmFsIiwic3RvcCIsIm9sZFNvdXJjZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJfb25Tb3VyY2VMb29wIiwiX29uU291cmNlRW5kIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxrQkFBa0JELFFBQVEsdUJBQVIsQ0FBeEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGtCQUFSLENBRFY7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUlFSSxXQUFXO0FBQ1RDLGNBQVUsRUFERDtBQUVUQyxVQUFNLEtBRkc7QUFHVEMsaUJBQWEsQ0FISjtBQUlUQyxZQUFRLEtBSkM7QUFLVEMsWUFBUSxJQUxDO0FBTVRDLFVBQU07QUFORyxHQUpiOztBQWFBO0FBQUE7O0FBQ0UsbUJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFB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b0hZRCxNQXBIWixFQW9Ib0I7QUFDaEIsWUFBSUEsTUFBSixFQUFZO0FBQ1YsY0FBTWtDLFlBQVksS0FBSy9CLE1BQUwsQ0FBWVMsR0FBWixDQUFnQixRQUFoQixDQUFsQjtBQUNBLGNBQUlzQixTQUFKLEVBQWU7QUFDYkEsc0JBQVVDLG1CQUFWLENBQThCLGtCQUE5QixFQUFrRCxLQUFLQyxhQUF2RDtBQUNBRixzQkFBVUMsbUJBQVYsQ0FBOEIsaUJBQTlCLEVBQWlELEtBQUtFLFlBQXREO0FBQ0Q7QUFDRHJDLGlCQUFPc0MsZ0JBQVAsQ0FBd0Isa0JBQXhCLEVBQTRDLEtBQUtGLGFBQWpEO0FBQ0FwQyxpQkFBT3NDLGdCQUFQLENBQXdCLGlCQUF4QixFQUEyQyxLQUFLRCxZQUFoRDtBQUNEO0FBQ0QsYUFBS2xDLE1BQUwsQ0FBWWEsR0FBWixDQUFnQixRQUFoQixFQUEwQmhCLE1BQTFCO0FBQ0Q7QUEvSEg7QUFBQTtBQUFBLG1DQWlJZXVDLEdBaklmLEVBaUlvQjtBQUNoQixhQUFLcEMsTUFBTCxDQUFZYSxHQUFaLENBQWdCLFFBQWhCLEVBQTBCLEtBQTFCO0FBQ0EsYUFBS0ksYUFBTCxDQUFtQixXQUFuQixFQUFnQyxFQUFoQztBQUNEO0FBcElIO0FBQUE7QUFBQSxvQ0FzSWdCbUIsR0F0SWhCLEVBc0lxQjtBQUNqQixhQUFLbkIsYUFBTCxDQUFtQixZQUFuQixFQUFpQyxFQUFqQztBQUNEO0FBeElIOztBQUFBO0FBQUEsSUFBMkI1QixlQUEzQjtBQTBJRCxDQXhKRCIsImZpbGUiOiJtb2R1bGUvY29yZS91dGlsL3RpbWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEV2ZW50RGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvZGlzcGF0Y2hlcicpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIGR1cmF0aW9uOiAxMCxcbiAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgY3VycmVudFRpbWU6IDAsXG4gICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgc291cmNlOiBudWxsLFxuICAgICAgcmF0ZTogMVxuICAgIH07XG5cbiAgcmV0dXJuIGNsYXNzIFRpbWVyIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLl9tb2RlbCA9IG5ldyBNb2RlbCh7XG4gICAgICAgIGRhdGE6IGNvbmZpZyxcbiAgICAgICAgZGVmYXVsdHM6IGRlZmF1bHRzXG4gICAgICB9KTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX3RpY2snLCAnX29uU291cmNlTG9vcCcsICdfb25Tb3VyY2VFbmQnXSk7XG5cbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fdGljayk7XG4gICAgfVxuXG4gICAgX3RpY2soKSB7XG4gICAgICBsZXQgbm93ID0gKG5ldyBEYXRlKS5nZXRUaW1lKCk7XG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdhY3RpdmUnKSkge1xuICAgICAgICBsZXQgbG9vcGVkID0gZmFsc2UsXG4gICAgICAgICAgZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnc291cmNlJykpIHtcbiAgICAgICAgICBsZXQgbGFzdCA9IHRoaXMuX21vZGVsLmdldCgnY3VycmVudFRpbWUnKTtcbiAgICAgICAgICB0aGlzLl9tb2RlbC5zZXQoJ2N1cnJlbnRUaW1lJywgdGhpcy5fbW9kZWwuZ2V0KCdzb3VyY2UnKS50aW1lcl90aW1lKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBuZXdUaW1lID0gdGhpcy5fbW9kZWwuZ2V0KCdjdXJyZW50VGltZScpICsgdGhpcy5fbW9kZWwuZ2V0KCdyYXRlJykgKiAobm93IC0gdGhpcy5fbW9kZWwuZ2V0KCdsYXN0VGljaycpKSAvIDEwMDA7XG4gICAgICAgICAgaWYgKG5ld1RpbWUgPiB0aGlzLl9tb2RlbC5nZXQoJ2R1cmF0aW9uJykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ2xvb3AnKSkge1xuICAgICAgICAgICAgICBuZXdUaW1lID0gVXRpbHMucG9zTW9kKG5ld1RpbWUsIHRoaXMuX21vZGVsLmdldCgnZHVyYXRpb24nKSk7XG4gICAgICAgICAgICAgIGxvb3BlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdUaW1lID0gdGhpcy5fbW9kZWwuZ2V0KCdkdXJhdGlvbicpO1xuICAgICAgICAgICAgICBlbmRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX21vZGVsLnNldCgnY3VycmVudFRpbWUnLCBuZXdUaW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1RpbWVyLlRpY2snLCB7XG4gICAgICAgICAgdGltZTogdGhpcy50aW1lKClcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKGxvb3BlZCkge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVGltZXIuTG9vcCcsIHt9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kZWQpIHtcbiAgICAgICAgICB0aGlzLl9tb2RlbC5zZXQoJ2FjdGl2ZScsIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1RpbWVyLkVuZCcsIHt9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdsYXN0VGljaycsIG5vdyk7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX3RpY2spXG5cbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgIGlmICh0aGlzLnRpbWUoKSA+PSB0aGlzLmR1cmF0aW9uKCkpIHRoaXMuc2VlaygwKTtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnYWN0aXZlJywgdHJ1ZSk7XG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdzb3VyY2UnKSkgdGhpcy5fbW9kZWwuZ2V0KCdzb3VyY2UnKS50aW1lcl9zdGFydCgpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUaW1lci5TdGFydCcsIHt9KTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgdGhpcy5zZWVrKDApO1xuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnc291cmNlJykpIHRoaXMuX21vZGVsLmdldCgnc291cmNlJykudGltZXJfc3RvcCgpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUaW1lci5TdG9wJywge30pO1xuICAgIH1cblxuICAgIHBhdXNlKCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2V0KCdhY3RpdmUnLCBmYWxzZSk7XG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdzb3VyY2UnKSkgdGhpcy5fbW9kZWwuZ2V0KCdzb3VyY2UnKS50aW1lcl9wYXVzZSgpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUaW1lci5QYXVzZScsIHt9KTtcbiAgICB9XG5cbiAgICBzZWVrKHRpbWUpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnY3VycmVudFRpbWUnLCBNYXRoLm1heCgwLCBNYXRoLm1pbih0aGlzLl9tb2RlbC5nZXQoJ2R1cmF0aW9uJyksIHRpbWUpKSk7XG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdzb3VyY2UnKSkgdGhpcy5fbW9kZWwuZ2V0KCdzb3VyY2UnKS50aW1lcl9zZWVrKHRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUaW1lci5TZWVrJywge1xuICAgICAgICB0aW1lOiB0aGlzLnRpbWUoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWN0aXZlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgdGltZSgpIHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ3NvdXJjZScpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ3NvdXJjZScpLnRpbWVyX3RpbWUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2N1cnJlbnRUaW1lJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGltZVJlbWFpbmluZygpIHtcbiAgICAgIHJldHVybiB0aGlzLmR1cmF0aW9uKCkgLSB0aGlzLnRpbWUoKTtcbiAgICB9XG5cbiAgICBkdXJhdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ3NvdXJjZScpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ3NvdXJjZScpLnRpbWVyX2R1cmF0aW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdkdXJhdGlvbicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldER1cmF0aW9uKHZhbCkge1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ2R1cmF0aW9uJywgTWF0aC5tYXgoMCwgdmFsKSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1RpbWVyLkR1cmF0aW9uQ2hhbmdlJywge1xuICAgICAgICBkdXJhdGlvbjogdGhpcy5fbW9kZWwuZ2V0KCdkdXJhdGlvbicpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRSYXRlKHJhdGUpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgncmF0ZScsIHJhdGUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUaW1lci5SYXRlQ2hhbmdlJywge1xuICAgICAgICByYXRlOiByYXRlXG4gICAgICB9KVxuICAgIH1cblxuICAgIHNldFNvdXJjZShzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgY29uc3Qgb2xkU291cmNlID0gdGhpcy5fbW9kZWwuZ2V0KCdzb3VyY2UnKTtcbiAgICAgICAgaWYgKG9sZFNvdXJjZSkge1xuICAgICAgICAgIG9sZFNvdXJjZS5yZW1vdmVFdmVudExpc3RlbmVyKCdUaW1lclNvdXJjZS5Mb29wJywgdGhpcy5fb25Tb3VyY2VMb29wKTtcbiAgICAgICAgICBvbGRTb3VyY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignVGltZXJTb3VyY2UuRW5kJywgdGhpcy5fb25Tb3VyY2VFbmQpO1xuICAgICAgICB9XG4gICAgICAgIHNvdXJjZS5hZGRFdmVudExpc3RlbmVyKCdUaW1lclNvdXJjZS5Mb29wJywgdGhpcy5fb25Tb3VyY2VMb29wKTtcbiAgICAgICAgc291cmNlLmFkZEV2ZW50TGlzdGVuZXIoJ1RpbWVyU291cmNlLkVuZCcsIHRoaXMuX29uU291cmNlRW5kKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX21vZGVsLnNldCgnc291cmNlJywgc291cmNlKTtcbiAgICB9XG5cbiAgICBfb25Tb3VyY2VFbmQoZXZ0KSB7XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ2FjdGl2ZScsIGZhbHNlKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVGltZXIuRW5kJywge30pO1xuICAgIH1cblxuICAgIF9vblNvdXJjZUxvb3AoZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1RpbWVyLkxvb3AnLCB7fSk7XG4gICAgfVxuICB9XG59KVxuIl19
