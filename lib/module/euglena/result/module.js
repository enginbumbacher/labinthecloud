define((require) => {
  const Module = require('core/app/module'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    LightDisplay = require('euglena/component/lightdisplay/lightdisplay'),
    CircleHistogram = require('euglena/component/circlegraph/circlegraph'),
    Histogram = require('euglena/component/histogramgraph/histogramgraph'),
    TimeSeries = require('euglena/component/timeseriesgraph/timeseriesgraph'),
    EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay')
  ;

  return class ResultModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onPhaseChange', '_onDryRunRequest', '_onDryRunStopRequest', '_onServerResults', '_onTick']);

      this._lightDisplay = LightDisplay.create({
        euglenaDisplay: Globals.get('AppConfig.view3d')
      });
      this._lightDisplay.addEventListener('LightDisplay.Tick', this._onTick)
      this._graphs = {
        circle: CircleHistogram.create(Globals.get('AppConfig.dataVis.circle')),
        histogram: Histogram.create(Globals.get('AppConfig.dataVis.histogram')),
        timeseries: TimeSeries.create(Globals.get('AppConfig.dataVis.timeseries'))
      };
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
      Globals.get('Relay').addEventListener('Results.DryRunRequest', this._onDryRunRequest);
      Globals.get('Relay').addEventListener('Results.DryRunStopRequest', this._onDryRunStopRequest);
      Globals.get('Relay').addEventListener('ExperimentServer.Results', this._onServerResults);
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "experiment") {
        this._lightDisplay.reset();
        Globals.get('Layout.panels.main').addChild(this._lightDisplay.view());

        for (let key in this._graphs) {
          this._graphs[key].reset();
          if (Globals.get('AppConfig.visualizationType').includes(key)) {
            Globals.get('Layout.panels.main').addChild(this._graphs[key].view());
          }
        }
      } else {
        Globals.get('Layout.panels.main').removeChild(this._lightDisplay.view());
        for (let key in this._graphs) {
          Globals.get('Layout.panels.main').removeChild(this._graphs[key].view());
        }
      }
    }

    _onDryRunRequest(evt) {
      this._dryRun = true;
      this._lightDisplay.run(evt.data.lights);
    }

    _onDryRunStopRequest(evt) {
      this._lightDisplay.stop();
      this._dryRun = false;
    }

    _onServerResults(evt) {
      this._dryRun = false;
      for (let key in this._graphs) {
        this._graphs[key].reset();
      }
      this._lightDisplay.handleVideo(evt.data);
      this._lightDisplay.run(evt.data.lights);
      for (let key in this._graphs) {
        this._graphs[key].handleData(evt.data);
      }
    }

    _onTick(evt) {
      if (!this._dryRun) {
        for (let key in this._graphs) {
          this._graphs[key].update(evt.data.videoTime);
        }
      }
    }
  }
})