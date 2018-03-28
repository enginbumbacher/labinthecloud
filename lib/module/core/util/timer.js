define((require) => {
  const EventDispatcher = require('core/event/dispatcher'),
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

  return class Timer extends EventDispatcher {
    constructor(config) {
      super();
      this._model = new Model({
        data: config,
        defaults: defaults
      });
      Utils.bindMethods(this, ['_tick', '_onSourceLoop', '_onSourceEnd']);

      window.requestAnimationFrame(this._tick);
    }

    _tick() {
      let now = (new Date).getTime();
      if (this._model.get('active')) {
        let looped = false,
          ended = false;
        if (this._model.get('source')) {
          let last = this._model.get('currentTime');
          this._model.set('currentTime', this._model.get('source').timer_time());
        } else {
          let newTime = this._model.get('currentTime') + this._model.get('rate') * (now - this._model.get('lastTick')) / 1000;
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
        })
        if (looped) {
          this.dispatchEvent('Timer.Loop', {});
        }
        if (ended) {
          this._model.set('active', false);
          this.dispatchEvent('Timer.End', {});
        }
      }
      this._model.set('lastTick', now);
      window.requestAnimationFrame(this._tick)

    }

    start() {
      if (this.time() >= this.duration()) this.seek(0);
      this._model.set('active', true);
      if (this._model.get('source')) this._model.get('source').timer_start();
      this.dispatchEvent('Timer.Start', {});
    }

    stop() {
      this.pause();
      this.seek(0);
      if (this._model.get('source')) this._model.get('source').timer_stop();
      this.dispatchEvent('Timer.Stop', {});
    }

    pause() {
      this._model.set('active', false);
      if (this._model.get('source')) this._model.get('source').timer_pause();
      this.dispatchEvent('Timer.Pause', {});
    }

    seek(time) {
      this._model.set('currentTime', Math.max(0, Math.min(this._model.get('duration'), time)));
      if (this._model.get('source')) this._model.get('source').timer_seek(time);
      this.dispatchEvent('Timer.Seek', {
        time: this.time()
      });
    }

    active() {
      return this._model.get('active');
    }

    time() {
      if (this._model.get('source')) {
        return this._model.get('source').timer_time();
      } else {
        return this._model.get('currentTime');
      }
    }

    timeRemaining() {
      return this.duration() - this.time();
    }

    duration() {
      if (this._model.get('source')) {
        return this._model.get('source').timer_duration();
      } else {
        return this._model.get('duration');
      }
    }

    setDuration(val) {
      this.stop();
      this._model.set('duration', Math.max(0, val));
      this.dispatchEvent('Timer.DurationChange', {
        duration: this._model.get('duration')
      });
    }

    setRate(rate) {
      this._model.set('rate', rate);
      this.dispatchEvent('Timer.RateChange', {
        rate: rate
      })
    }

    setSource(source) {
      if (source) {
        const oldSource = this._model.get('source');
        if (oldSource) {
          oldSource.removeEventListener('TimerSource.Loop', this._onSourceLoop);
          oldSource.removeEventListener('TimerSource.End', this._onSourceEnd);
        }
        source.addEventListener('TimerSource.Loop', this._onSourceLoop);
        source.addEventListener('TimerSource.End', this._onSourceEnd);
      }
      this._model.set('source', source);
    }

    _onSourceEnd(evt) {
      this._model.set('active', false);
      this.dispatchEvent('Timer.End', {});
    }

    _onSourceLoop(evt) {
      this.dispatchEvent('Timer.Loop', {});
    }
  }
})
