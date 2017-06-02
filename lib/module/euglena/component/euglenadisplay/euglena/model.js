define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Model = require('core/model/model'),
    defaults = {
      track: null,
      initialPosition: {
        x: 0,
        y: 0,
        z: 0
      }
    };

  return class EuglenaModel extends Model {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    setInitialPosition(pos) {
      this.set('initialPosition', pos);
    }

    getState(time, bounds) {
      let sample, next;
      for (let i = 0; i < this.get('track').samples.length; i++) {
        sample = this.get('track').samples[i];
        next = this.get('track').samples.length == i+1 ? null : this.get('track').samples[i+1];
        if (next && next.time < time) {
          continue;
        } else {
          break;
        }
      }
      if (next == null) {
        sample = this.get('track').samples[0];
        return {
          position: {
            x: Utils.posMod(sample.x + this.get('initialPosition').x + bounds.width / 2, bounds.width) - bounds.width / 2,
            y: Utils.posMod(sample.y + this.get('initialPosition').y + bounds.height / 2, bounds.height) - bounds.width / 2,
            z: this.get('initialPosition').z
          },
          yaw: sample.yaw,
          roll: sample.roll,
          pitch: sample.pitch
        }
      }
      let delta = (time - sample.time) / (next.time - sample.time);
      return {
        position: {
          x: Utils.posMod(sample.x + (next.x - sample.x) * delta + this.get('initialPosition').x + bounds.width / 2, bounds.width) - bounds.width / 2,
          y: Utils.posMod(sample.y + (next.y - sample.y) * delta + this.get('initialPosition').y + bounds.height / 2, bounds.height) - bounds.height / 2,
          z: this.get('initialPosition').z
        },
        yaw: sample.yaw + (next.yaw - sample.yaw) * delta, // HOW TO DEAL WITH THIS INTEGRATION ISSUE; NOT ADDITIVE IN NEW MODEL
        roll: sample.roll + (next.roll - sample.roll) * delta,
        pitch: sample.pitch + (next.pitch - sample.pitch) * delta,
      }
    }
  }
})
