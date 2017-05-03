define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Model = require('core/model/model'),
    defaults = {
      experiment: null,
      results: []
    };

  return class ResultGroup extends Model {
    constructor(config = {}) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
      Utils.bindMethods(this, ['_ensureExperimentName'])

      Utils.promiseAjax(`/api/v1/Experiments/${this.get('experimentId')}`).then((experiment) => {
        this.set('experiment', experiment);
      })
    }

    contains(resultId) {
      for (let res of this.get('results')) {
        if (res.get('id') == resultId) {
          return true;
        }
      }
      return false;
    }

    addResult(result) {
      console.log(result);
      const results = this.get('results');
      if (!results.map((a) => a.get('id')).includes(result.get('id'))) {
        results.push(result);
        this.set('results', results);
        this.dispatchEvent('ResultGroup.ResultAdded', {
          dataset: result
        })
        if (result.get('euglenaModelId')) {
          Utils.promiseAjax(`/api/v1/EuglenaModels/${result.get('euglenaModelId')}`).then((eugModel) => {
            result.set('name', eugModel.name)
          })
        } else {
          if (this.get('experiment')) {
            result.set('name', (new Date(this.get('experiment.date_created'))).toLocaleString());
          } else {
            this.addEventListener('Model.Change', this._ensureExperimentName)
          }
        }
      }
    }

    _ensureExperimentName(evt) {
      if (evt.data.path == "experiment") {
        this.removeEventListener('Model.Change', this._ensureExperimentName);
        this.get('results').forEach((res) => {
          if (!res.get('name') && !res.get('euglenaModelId')) {
            res.set('name', (new Date(this.get('experiment.date_created'))).toLocaleString());
          }
        })
      }
    }

    removeResult(resultId) {
      const results = this.get('results');
      const res = results.filter((a) => a.get('id') == resultId)[0];
      results.splice(results.indexOf(res), 1);
      this.set('results', results);
      this.dispatchEvent('ResultGroup.ResultRemoved', {
        dataset: res
      })
    }
  }
  
})