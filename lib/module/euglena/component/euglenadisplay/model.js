define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    Euglena = require('./euglena/euglena'),

    defaults = {
      euglena: [],
      bounds: {
        width: 400,
        height: 300
      },
      camera: {
        height: 500,
        near: 0.1,
        far: 1000
      }
    }
  ;

  return class EuglenaDisplayModel extends Model {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    setTrackData(tracks) {
      this.set('tracks', tracks);
      let euglena = [];
      tracks.forEach((track) => {
        let e = Euglena.create({ track: track });
        e.setInitialPosition({
          x: (Math.random() * 2 - 1) * this.get('bounds.width') / 2,
          y: (Math.random() * 2 - 1) * this.get('bounds.height') / 2,
          z: 0
        });
        euglena.push(e);
      })
      this.set('euglena', euglena);
    }
  }
})