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
            experimentId: dataset.experimentId
          }
        });
      }
      if (!(ds[dataset.experimentId].contains(dataset.id))) {
        const dsModel = new Model({ data: dataset })
        console.log(Object.values(ds));
        const setcount = Object.values(ds).reduce((acc, curr, ind) => { return acc + curr.get('results').length }, 0);
        dsModel.set('color', Palette[setcount % Palette.length]);
        dsModel.set('shown', true);
        ds[dataset.experimentId].addResult(dsModel);
        this.set('datasets', ds);

        this.dispatchEvent('AggregateData.DataSetAdded', {
          dataset: dsModel
        })
      }
    }

    clear(resId = null) {
      if (resId) {
        const dataset = this.getResultById(resId);
        const ds = this.get('datasets');
        const expId = dataset.get('experimentId');
        if (ds[expId] && ds[expId].indexOf(dataset) != -1) {
          ds[expId].splice(ds[expId].indexOf(dataset), 1);
          if (ds[expId].length == 0) {
            delete ds[expId];
          }
        }
        this.set('datasets', ds);
        this.dispatchEvent('AggregateData.DataSetRemoved', {
          dataset: dataset
        })
      } else {
        this.set('datasets', {});
        this.dispatchEvent('AggregateData.DataSetsCleared', {})
      }
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
      res.set('shown', !res.get('shown'));
    }
  }
})