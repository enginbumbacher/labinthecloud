define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Model = require('core/model/model'),
    defaults = {
      datasets: {},
      open: false
    },
    Palette = require('core/util/palette'),
    ResultGroup = require('./result_group');

  return class AggregateDataModel extends Model {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }

    addDataSet(dataset) {
      const ds = this.get('datasets');
      if (!ds[dataset.experimentId]) {
        ds[dataset.experimentId] = new ResultGroup({
          data: {
            experimentId: dataset.experimentId,
            experiment: Globals.get('currentExperiment')
          }
        });
      }
      if (!(ds[dataset.experimentId].contains(dataset.id))) {
        const dsModel = new Model({ data: dataset })
        const setcolors = Object.values(ds).reduce((acc, curr) => { return acc.concat(curr.get('results').map((a) => a.get('color'))) }, []);
        for (let c of Palette) {
          if (!setcolors.includes(c)) {
            dsModel.set('color', c);
            break;
          }
        }
        if (!dsModel.get('color')) dsModel.set('color', '#000000');
        dsModel.set('shown', true);
        ds[dataset.experimentId].addResult(dsModel);
        this.set('datasets', ds);

        this.dispatchEvent('AggregateData.DataSetAdded', {
          dataset: dsModel,
          resultGroup: ds[dataset.experimentId]
        })
      }
    }

    clearResult(resId) {
      const dataset = this.getResultById(resId);
      const ds = this.get('datasets');
      const expId = dataset.get('experimentId');
      if (ds[expId] && ds[expId].contains(resId)) {
        ds[expId].removeResult(resId);
        if (ds[expId].length() == 0) {
          this.clearResultGroup(expId)
        }
      }
      this.set('datasets', ds);
      this.dispatchEvent('AggregateData.DataSetRemoved', {
        dataset: dataset
      })
    }

    clearResultGroup(expId) {
      const ds = this.get('datasets');
      const group = ds[expId];
      delete ds[expId];
      this.dispatchEvent('AggregateData.ResultGroupRemoved', {
        group: group
      })
    }

    getResultById(resId) {
      const dss = Object.values(this.get('datasets'));
      for (let ds of dss) {
        for (let res of ds.get('results')) {
          if (res.get('id') == resId) return res;
        }
      }
      return null;
    }

    toggle() {
      this.set('open', !this.get('open'))
    }

    toggleResult(resultId) {
      const res = this.getResultById(resultId);
      if (res) {
        res.set('shown', !res.get('shown'));
        this.dispatchEvent('AggregateData.ResultToggle', {
          resultId: res.get('id'),
          shown: res.get('shown')
        })
      }
    }
  }
})