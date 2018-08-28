import Model from 'core/model/model';
import Utils from 'core/util/utils';
import Euglena from './euglena/euglena';

const defaults = {
  euglena: [],
  bounds: {
    width: 640,
    height: 480
  },
  magnification: 1,
  camera: {
    height: 500,
    near: 0.1,
    far: 1000
  }
};

export default class EuglenaDisplayModel extends Model {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }

  setTrackData(tracks, model, color) {
    this.set('tracks', tracks);
    let euglena = [];
    tracks.forEach((track) => {
      let e = Euglena.create({ track: track, config: model, color: color });
      e.setInitialPosition({
        x: 0,
        y: 0,
        z: 0
      });
      euglena.push(e);
    })
    this.set('euglena', euglena);
  }

  setMagnification(mag) {
    this.set('magnification', mag);
  }
}
