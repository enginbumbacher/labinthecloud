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
        '_onResultsDontSend', '_onResultsSend'
      ]);
    }

    init() {
      if (Globals.get('AppConfig.experiment')) {
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
        });
        this._drTimeDisplay = new DomView('<span class="dry_run__time"></span>')
        this._dryRunLights.view().addChild(this._drTimeDisplay, '.light-display__content');
        this._timer = new Timer({
          duration: Globals.get('AppConfig.experiment.maxDuration'),
          loop: true
        });
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
      }

      return super.init();
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
          this._loadExperimentInForm(this._history.export().exp_history_id);
        })
      }
    }

    _onHistorySelectionChange(evt) {
      this._loadExperimentInForm(evt.currentTarget.export().exp_history_id);
    }

    _loadExperimentInForm(id) {
      if (!id) return;
      if (id == "_new") {
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
        });
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
      this._configForm.validate().then((validation) => {
        if (validation.isValid) {

        }
      })
      this._dryRunData = this._configForm.export().lights;
      this._resetDryRun();
      this._timer.start();
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
    }

    _onRunRequest(evt) {
      this._resetDryRun();
      this._configForm.validate().then((validation) => {
        this._reporter.reset();
        this._reporter.setFullscreen(this._history.historyCount() == 0)
        this._reporter.show();
        Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentRequest', this._configForm.export());
        this._history.revertToLastHistory();
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
      // TODO
      Globals.get('Relay').dispatchEvent('Notifications.Add', {
        id: "exp_aggregate_todo",
        message: "This feature is not implemented yet.",
        autoExpire: 10,
        expireLabel: "I guess I'll wait"
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
      this._reporter.hide();
    }

    _onResultsSend(evt) {
      const results = evt.currentTarget.results
      evt.currentTarget.results = null;
      this._history.import({
        exp_history_id: results.experimentId
      })
      this._reporter.hide();
    }

    _onResultsDontSend(evt) {
      this._reporter.hide();
    }
  }

  ExperimentModule.requires = [ServerInterface];
  return ExperimentModule;
})