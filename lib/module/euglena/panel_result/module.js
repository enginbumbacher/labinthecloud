define((require) => {
  const Module = require('core/app/module'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    LayoutPanel = require('module/layout/panel/panel'),
    CircleHistogram = require('euglena/component/circlegraph/circlegraph'),
    Histogram = require('euglena/component/histogramgraph/histogramgraph'),
    TimeSeries = require('euglena/component/timeseriesgraph/timeseriesgraph'),
    EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay'),
    VisualResult = require('euglena/component/visualresult/visualresult')
  ;


  return class ResultPanelModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_hookLayoutPanels']);
      this.panel = LayoutPanel.create({ id: "result" });
    }

    init() {
      HM.hook('Layout.Panels', this._hookLayoutPanels)
      return Promise.resolve(true);
    }

    _hookLayoutPanels(list, meta) {
      list.push({
        weight: 0,
        panel: this.panel
      });
      return list;
    }

    run() {
      this.panel.build();
    }

    // constructor() {
    //   super();
    //   Utils.bindMethods(this, ['_onPhaseChange', '_onDryRunRequest', '_onDryRunStopRequest', '_onServerResults', '_onTick']);

    //   this._visualResult = VisualResult.create();
    //   this._visualResult.addEventListener('VisualResult.Tick', this._onTick);
    //   this._graphs = {
    //     circle: CircleHistogram.create(Globals.get('AppConfig.dataVis.circle')),
    //     histogram: Histogram.create(Globals.get('AppConfig.dataVis.histogram')),
    //     timeseries: TimeSeries.create(Globals.get('AppConfig.dataVis.timeseries'))
    //   };
    //   Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
    //   Globals.get('Relay').addEventListener('Results.DryRunRequest', this._onDryRunRequest);
    //   Globals.get('Relay').addEventListener('Results.DryRunStopRequest', this._onDryRunStopRequest);
    //   Globals.get('Relay').addEventListener('ExperimentServer.Results', this._onServerResults);
    // }

    // _onPhaseChange(evt) {
    //   if (evt.data.phase == "experiment") {
    //     Globals.get('Layout.panels.main').addChild(this._visualResult.view());

    //     for (let key in this._graphs) {
    //       this._graphs[key].reset();
    //       if (Globals.get('AppConfig.visualizationType').includes(key)) {
    //         Globals.get('Layout.panels.main').addChild(this._graphs[key].view());
    //       }
    //     }
    //   } else {
    //     Globals.get('Layout.panels.main').removeChild(this._visualResult.view());
    //     for (let key in this._graphs) {
    //       Globals.get('Layout.panels.main').removeChild(this._graphs[key].view());
    //     }
    //   }
    // }

    // _onDryRunRequest(evt) {
    //   this._visualResult.handleLightData(evt.data.lights);
    //   this._visualResult.play();
    // }

    // _onDryRunStopRequest(evt) {
    //   this._visualResult.stop();
    // }

    // _onServerResults(evt) {
    //   for (let key in this._graphs) {
    //     this._graphs[key].reset();
    //   }
    //   this._visualResult.handleLightData(evt.data.lights);
    //   this._visualResult.play(evt.data);
    //   for (let key in this._graphs) {
    //     this._graphs[key].handleData(evt.data);
    //   }
    // }

    // _onTick(evt) {
    //   if (evt.data.mode != 'dryRun') {
    //     for (let key in this._graphs) {
    //       this._graphs[key].update(evt.data.time, evt.data.lights);
    //     }
    //   }
    // }
  }
})