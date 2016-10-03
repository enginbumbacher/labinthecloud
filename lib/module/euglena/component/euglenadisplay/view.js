define((require) => {
  const DomView = require('core/view/dom_view'),
    Utils = require('core/util/utils'),
    THREE = require('three'),

    Template = require('text!./euglenadisplay.html')
  ;

  return class EuglenaDisplayView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onModelChange']);

      this.scene = new THREE.Scene();

      // this.camera = new THREE.OrthographicCamera(-12, 12, 9, -9, 1, 1000);
      let aspect = model.get('bounds.width') / model.get('bounds.height');
      let fov = 2 * Math.atan2(model.get('bounds.height') / 2, model.get('camera.height')) * 180 / Math.PI;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, model.get('camera.near'), model.get('camera.far'));
      this.camera.position.z = model.get('camera.height');

      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setClearColor(0x99cc99, 0.25);
      this.renderer.setSize(400, 300);

      this.lights = {
        top: new THREE.DirectionalLight(0xffffff, 0),
        left: new THREE.DirectionalLight(0xffffff, 0),
        right: new THREE.DirectionalLight(0xffffff, 0),
        bottom: new THREE.DirectionalLight(0xffffff, 0),
        global: new THREE.AmbientLight(0xffffff, 0)
      }

      this.lights.top.position.set(0, 1, 0);
      this.lights.left.position.set(-1, 0, 0);
      this.lights.right.position.set(1, 0, 0);
      this.lights.bottom.position.set(0, -1, 0);

      for (let key in this.lights) {
        this.scene.add(this.lights[key]);
      }

      this._euglena = [];

      this.$el.append(this.renderer.domElement);
      this._ensureEuglena(model);
      model.addEventListener('Model.Change', this._onModelChange);
    }

    _onModelChange(evt) {
      const model = evt.currentTarget;
      switch (evt.data.path) {
        case 'euglena':
          this._ensureEuglena(model);
        break;
      }
    }

    _ensureEuglena(model) {
      while (this._euglena.length) {
        this.scene.remove(this._euglena.pop());
      }
      for (let euglena of model.get('euglena')) {
        this.scene.add(euglena.view());
        this._euglena.push(euglena.view());
      }
    }

    render(state) {
      for (let euglena of state.model.get('euglena')) {
        euglena.update(state.lights, state.dT, state.model);
      }
      for (let key in state.lights) {
        this.lights[key].intensity = state.lights[key] * 5 / 100
      }
      this.renderer.render(this.scene, this.camera);
    }
  }
})