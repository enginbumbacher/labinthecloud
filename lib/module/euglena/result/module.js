define((require) => {
  const HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals');

  const Module = require('core/app/module'),
    CircleHistogram = require('euglena/component/circlegraph/circlegraph'),
    Histogram = require('euglena/component/histogramgraph/histogramgraph'),
    TimeSeries = require('euglena/component/timeseriesgraph/timeseriesgraph'),
    VisualResult = require('euglena/component/visualresult/visualresult')
  ;

  return class ResultsModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onExperimentLoaded', '_onTick']);

      this._visualResult = VisualResult.create();
      this._visualResult.addEventListener('VisualResult.Tick', this._onTick);
      this._graphs = {
        circle: CircleHistogram.create(Globals.get('AppConfig.dataVis.circle')),
        histogram: Histogram.create(Globals.get('AppConfig.dataVis.histogram')),
        timeseries: TimeSeries.create(Globals.get('AppConfig.dataVis.timeseries'))
      };
      Globals.get('Relay').addEventListener('Experiment.Loaded', this._onExperimentLoaded);
    }

    init() {
      HM.hook('Panel.Contents', (subject, meta) => {
        if (meta.id == "result") {
          subject.push(this._visualResult.view());
          for (let key in this._graphs) {
            this._graphs[key].reset();
            if (Globals.get('AppConfig.visualizationType').includes(key)) {
              subject.push(this._graphs[key].view());
            }
          }
        }
        return subject;
      }, 10);
    }

    _onExperimentLoaded(evt) {
      if (evt.data.experiment.id != '_new') {
        Utils.promiseAjax('/api/v1/Results', {
          data: {
            filter: {
              where: {
                experimentId: evt.data.experiment.id,
                bpu_api_id: {
                  neq: null
                }
              }
            }
          }
        }).then((results) => {
          const res = results[0];
          res.runTime = evt.data.experiment.configuration.reduce((acc, val) => {
            return acc + val.duration
          }, 0);
          for (let key in this._graphs) {
            this._graphs[key].reset();
          }
          this._visualResult.handleLightData(evt.data.experiment.configuration);
          this._visualResult.play(res);
          for (let key in this._graphs) {
            this._graphs[key].handleData(res);
          }
        }).catch((err) => {
          console.log(err);
        })
      } else {
        this._visualResult.clear();
        for (let key in this._graphs) {
          this._graphs[key].reset();
        }
      }
    }

    _onTick(evt) {
      for (let key in this._graphs) {
        this._graphs[key].update(evt.data.time, evt.data.lights);
      }
    }
  }
  
})