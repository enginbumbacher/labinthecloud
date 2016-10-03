define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    Euglena = require('./euglena/euglena'),

    defaults = {
      count: 1,
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

      let euglena = [];
      for (let i = 0; i < this.get('count'); i++) {
        let e = new Euglena();
        e.track = i == 0;
        e.setPosition((2 * Math.random() - 1) * this.get('bounds.width') / 2, (2 * Math.random() - 1) * this.get('bounds.height') / 2)
        e.setRotation(Math.random() * 2 * Math.PI);
        euglena.push(e);
      }
      this.set('euglena', euglena)
    }
  }
})