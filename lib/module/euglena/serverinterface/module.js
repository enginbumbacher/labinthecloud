define((require) => {
  const Module = require('core/app/module'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals')
  ;

  return class EuglenaServerModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onExperimentRequest', '_fakeResponse']);

      Globals.get('Relay').addEventListener('ExperimentServer.ExperimentRequest', this._onExperimentRequest);
    }

    _onExperimentRequest(evt) {
      window.setTimeout(this._fakeResponse, 5000);
    }

    _fakeResponse() {
      Promise.all([
        Utils.promiseAjax('/cslib/module/euglena/demodata/lightdata.json'),
        Utils.promiseAjax('/cslib/module/euglena/demodata/tracks.json')
      ]).then((metas) => {
        Globals.get('Relay').dispatchEvent('ExperimentServer.Results', {
          video: '/cslib/module/euglena/demodata/movie.mp4',
          lights: metas[0],
          tracks: metas[1]
        });
      });
    }
  }
})