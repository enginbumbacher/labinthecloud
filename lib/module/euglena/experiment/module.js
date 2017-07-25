define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    ExperimentForm = require('./form/form'),
    Utils = require('core/util/utils'),
    LightDisplay = require('euglena/component/lightdisplay/lightdisplay'),
    HistoryForm = require('./history/form'),
    DomView = require('core/view/dom_view'),
    ServerInterface = require('./serverinterface/module'),
    Timer = require('core/util/timer'),
    EugUtils = require('euglena/utils'),
    ExperimentReporter = require('./reporter/reporter')
  ;

  require('link!./style.css');

  class ExperimentModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, [
        '_hookInteractiveTabs', '_onRunRequest', '_onGlobalsChange', 
        '_onHistorySelectionChange', '_onDryRunRequest', '_onTick',
        '_onConfigChange', '_onNewExperimentRequest', '_onAggregateRequest',
        '_hookPanelContents', '_onServerUpdate', '_onServerResults', '_onServerFailure',
        '_onResultsDontSend', '_onResultsSend', '_onPhaseChange'
      ]);

      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange);
    }

    init() {
      if (Globals.get('AppConfig.experiment')) {
        let promise;
        if (Globals.get('AppConfig.experiment.euglenaServerMode') == "demo") {
          promise = this._loadDemoHistory();
        } else {
          promise = Promise.resolve(true);
        }
        return promise.then(() => {
          const staticHistory = Globals.get('AppConfig.experiment.experimentHistory');
          Globals.set('State.experiment.allowNew', staticHistory ? false : true)

          this._configForm = new ExperimentForm();
          this._configForm.addEventListener('Form.FieldChanged', this._onConfigChange);
          this._configForm.view().addEventListener('Experiment.DryRun', this._onDryRunRequest);
          this._configForm.view().addEventListener('Experiment.Submit', this._onRunRequest);
          this._configForm.view().addEventListener('Experiment.NewRequest', this._onNewExperimentRequest);
          this._configForm.view().addEventListener('Experiment.AddToAggregate', this._onAggregateRequest);

          this._history = new HistoryForm();
          this._history.addEventListener('Form.FieldChanged', this._onHistorySelectionChange);

          this._dryRunLights = LightDisplay.create({
            width: 200,
            height: 150
          })
          this._drTimeDisplay = new DomView('<span class="dry_run__time"></span>')
          this._dryRunLights.view().$dom().on('click', this._onDryRunRequest);
          this._dryRunLights.view().addChild(this._drTimeDisplay, '.light-display__content');
          this._timer = new Timer({
            duration: Globals.get('AppConfig.experiment.maxDuration'),
            loop: false,
            rate: 4
          })
          this._timer.addEventListener('Timer.Tick', this._onTick);
          this._resetDryRun();

          this._reporter = new ExperimentReporter();
          this._reporter.addEventListener('ExperimentReporter.Send', this._onResultsSend);
          this._reporter.addEventListener('ExperimentReporter.DontSend', this._onResultsDontSend);
          this._reporter.hide();

          this._tabView = new DomView("<div class='tab__experiment'></div>");
          this._tabView.addChild(this._history.view());
          this._tabView.addChild(this._configForm.view());
          this._tabView.addChild(this._dryRunLights.view());

          HM.hook('Panel.Contents', this._hookPanelContents, 9);
          HM.hook('InteractiveTabs.ListTabs', this._hookInteractiveTabs, 10);
          Globals.addEventListener('Model.Change', this._onGlobalsChange);

          Globals.get('Relay').addEventListener('ExperimentServer.Update', this._onServerUpdate);
          Globals.get('Relay').addEventListener('ExperimentServer.Results', this._onServerResults);
          Globals.get('Relay').addEventListener('ExperimentServer.Failure', this._onServerFailure);
        })
      } else {
        return super.init();
      }
    }

    _hookPanelContents(list, meta) {
      if (meta.id == "interactive") {
        list.push(this._reporter);
      }
      return list;
    }

    _onGlobalsChange(evt) {
      if (evt.data.path == "student_id") {
        this._history.update().then(() => {
          const hist = this._history.getHistory()
          if (hist.length) {
            return this._history.import({
              exp_history_id: hist[hist.length - 1]
            })
          } else {
            return true;
          }
        }).then(() => {
          this._loadExperimentInForm(this._history.export().exp_history_id);
        })
      } else if (evt.data.path == "euglenaServerMode") {
        if (evt.data.value == "demo") {
          this._loadDemoHistory();
          Globals.set('State.experiment.allowNew', false);
          this._history.update();
        }
      }
    }

    _loadDemoHistory() {
      if (!Globals.get('AppConfig.experiment.experimentHistory')) {
        return Utils.promiseAjax('/api/v1/Experiments', {
          data: {
            filter: {
              where: {
                demo: true
              }
            }
          }
        }).then((experiments) => {
          Globals.set('AppConfig.experiment.experimentHistory', experiments.map((e) => e.id))
        })
      } else {
        return Promise.resolve(true);
      }
    }

    _onHistorySelectionChange(evt) {
      this._loadExperimentInForm(evt.currentTarget.export().exp_history_id);
    }

    _loadExperimentInForm(id) {
      if (!id) return;
      let oldId = this._currExpId;
      let target = id == '_new' ? null : id;
      if (oldId != target) {
        if (id == "_new") {
          this._currExpId = null;
          this._configForm.import({
            lights: [{
              left: 100,
              duration: 15
            }, {
              top: 100,
              duration: 15
            }, {
              bottom: 100,
              duration: 15
            }, {
              right: 100,
              duration: 15
            }]
          }).then(() => {
            this._configForm.setState('new')
            this._dryRunLights.view().show();
            Globals.get('Relay').dispatchEvent('Experiment.Loaded', {
              experiment: {
                id: "_new"
              }
            })
          })
        } else {
          this._currExpId = id;
          Utils.promiseAjax(`/api/v1/Experiments/${id}`)
          .then((data) => {
            this._configForm.import({
              lights: data.configuration
            });
            return data;
          }).then((data) => {
            this._configForm.setState('historical');
            this._dryRunLights.view().hide();
            Globals.get('Relay').dispatchEvent('Experiment.Loaded', {
              experiment: data
            })
            Globals.set('currentExperiment', data)
          });
        }
        Globals.get('Logger').log({
          type: "load",
          category: "experiment",
          data: {
            experimentId: id
          }
        })
      }
    }

    _hookInteractiveTabs(list, meta) {
      list.push({
        id: "experiment",
        title: "Experiment",
        content: this._tabView
      });
      return list;
    }

    _onDryRunRequest(evt) {
      if (this._firstDryRun) {
        this._dryRunData = this._configForm.export().lights;
        this._resetDryRun();
        this._timer.start();
        this._firstDryRun = false;
      } else {
        if (this._timer.active()) {
          this._timer.pause();
        } else {
          this._timer.start();
        }
      }
    }

    _onTick(evt) {
      const time = this._timer.time();
      this._dryRunLights.render(EugUtils.getLightState(this._dryRunData, time))
      this._drTimeDisplay.$dom().html(Utils.secondsToTimeString(time));
    }

    _resetDryRun() {
      this._timer.stop();
      this._dryRunLights.render({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0        
      })
      this._drTimeDisplay.$dom().html('');
    }

    _onConfigChange(evt) {
      this._resetDryRun();
      this._firstDryRun = true;
    }

    _onRunRequest(evt) {
      this._resetDryRun();
      this._configForm.validate().then((validation) => {
        this._reporter.reset();
        this._reporter.setFullscreen(this._history.historyCount() == 0)
        this._reporter.show();
        Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentRequest', this._configForm.export());
        Globals.get('Logger').log({
          type: "experiment_submission",
          category: "experiment",
          data: {
            configuration: this._configForm.export()
          }
        })
        this._history.revertToLastHistory();
        this._configForm.disableNew();
        this._history.disableNew();
      }).catch((err) => {
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: "experiment_form_error",
          type: "error",
          message: err.validation.errors.join('<br/>'),
          autoExpire: 10,
          expireLabel: "Got it"
        })
      })
    }

    _onNewExperimentRequest(evt) {
      this._history.import({ exp_history_id: '_new' });
    }

    _onAggregateRequest(evt) {
      EugUtils.getLiveResults(this._history.export().exp_history_id).then((results) => {
        Globals.get('Relay').dispatchEvent('AggregateData.AddRequest', {
          data: results
        })
      })
      Globals.get('Logger').log({
        type: "add_aggregate",
        category: "experiment",
        data: {
          experimentId: this._history.export().exp_history_id
        }
      })
    }

    _onServerUpdate(evt) {
      this._reporter.update(evt.data);
    }
    _onServerResults(evt) {
      this._history.update().then(() => {
        const hist = this._history.getHistory();
        if (hist.length == 1) {
          this._onResultsSend({
            currentTarget: {
              results: evt.data
            }
          });
        } else {
          this._reporter.update({ status: "complete", results: evt.data });
        }
      });
    }
    _onServerFailure(evt) {
      this._resultCleanup();
    }

    _onResultsSend(evt) {
      const results = evt.currentTarget.results
      evt.currentTarget.results = null;
      this._history.import({
        exp_history_id: results.experimentId
      })
      this._resultCleanup();
      Globals.get('Logger').log({
        type: 'send_result',
        category: 'experiment',
        data: {
          experimentId: results.experimentId,
          resultId: results.id
        }
      })
    }
    _resultCleanup() {
      this._reporter.hide();
      this._configForm.enableNew();
      this._history.enableNew();
    }

    _onResultsDontSend(evt) {
      const results = evt.currentTarget.results
      this._resultCleanup();
      Globals.get('Logger').log({
        type: 'dont_send_result',
        category: 'experiment',
        data: {
          experimentId: results.experimentId,
          resultId: results.id
        }
      })
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "login") {
        this._history.import({ exp_history_id: '_new' });
      }
    }
  }

  ExperimentModule.requires = [ServerInterface];
  return ExperimentModule;
})