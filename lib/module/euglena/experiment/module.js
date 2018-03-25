define((require) => {
  const Module = require('core/app/module'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    ExperimentTableForm = require('./form_table/form'),
    ExperimentNarrativeForm = require('./form_narrative/form'),
    Utils = require('core/util/utils'),
    LightDisplay = require('euglena/component/lightdisplay/lightdisplay'),
    BulbDisplay = require('euglena/component/bulbdisplay/bulbdisplay'),
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
        '_onHistorySelectionChange', '_onDryRunRequest', '_onDryRunTick',
        '_onConfigChange', '_onNewExperimentRequest', '_onAggregateRequest',
        '_hookPanelContents', '_onServerUpdate', '_onServerResults', '_onServerFailure',
        '_onResultsDontSend', '_onResultsSend', '_onPhaseChange', '_onDisableRequest', '_onEnableRequest'
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
          const experimentModality = Globals.get('AppConfig.system.experimentModality');
          Globals.set('State.experiment.allowNew', experimentModality.match('create') ? true : false)

          // 1. Create the history form
          this._history = new HistoryForm();
          this._history.addEventListener('Form.FieldChanged', this._onHistorySelectionChange);

          // 2. Create the tab and add the history form to it.
          this._tabView = new DomView("<div class='tab__experiment'></div>");
          this._tabView.addChild(this._history.view());

          this._tabView.addChild(new DomView("<div id='expProtocol__title'> Experiment Menu: </div>"));

          if (Globals.get('AppConfig.experiment.experimentForm')=='table') {

            // 3. Create the experimentation form
            this._configForm = new ExperimentTableForm();
            this._configForm.addEventListener('Form.FieldChanged', this._onConfigChange);
            this._configForm.view().addEventListener('Experiment.DryRun', this._onDryRunRequest);
            this._configForm.view().addEventListener('Experiment.Submit', this._onRunRequest);
            this._configForm.view().addEventListener('Experiment.NewRequest', this._onNewExperimentRequest);
            this._configForm.view().addEventListener('Experiment.AddToAggregate', this._onAggregateRequest);

            // 4. Add the configForm to the tab
            this._tabView.addChild(this._configForm.view());

            // 5. Create the dryRun specifications
            this._dryRunLights = LightDisplay.create({
              width: 200,
              height: 150
            })
            this._dryRunBulbs = BulbDisplay.create({
              width: 200,
              height: 150
            })
            this._drTimeDisplay = new DomView('<span class="dry_run__time"></span>')
            this._dryRunLights.view().$dom().on('click', this._onDryRunRequest);
            this._dryRunBulbs.view().$dom().on('click', this._onDryRunRequest);
            this._dryRunLights.view().addChild(this._drTimeDisplay, '.light-display__content');
            this._timer = new Timer({
              duration: Globals.get('AppConfig.experiment.maxDuration'),
              loop: false,
              rate: 4
            })
            this._timer.addEventListener('Timer.Tick', this._onDryRunTick);
            this._resetDryRun();

            // 6. Create the dryRun view
            this._dryRunView = new DomView("<div class='dry_run'></div>");
            this._dryRunView.addChild(this._dryRunLights.view());
            this._dryRunView.addChild(this._dryRunBulbs.view());

            // 7. Add the dryRunView to the tab
            this._tabView.addChild(this._dryRunView);

          } else if (Globals.get('AppConfig.experiment.experimentForm') == 'narrative'){

            // 2. Create the experimentation form that contains
            // a. experiment descriptor
            // b. experiment setup
            // c. experiment protocol
            this._configForm = new ExperimentNarrativeForm();
            this._configForm.addEventListener('Form.FieldChanged', this._onConfigChange);
            this._configForm.view().addEventListener('Experiment.Submit', this._onRunRequest);
            this._configForm.view().addEventListener('Experiment.NewRequest', this._onNewExperimentRequest);
            this._configForm.view().addEventListener('Experiment.AddToAggregate', this._onAggregateRequest);

            // 3. Add the configForm and experimentView to the tab.
            this._tabView.addChild(this._configForm.view());

            // 4. Create visual representation of the experiment protocol

            // 5. Create the dryRun specifications
            this._expVizLights = []
            for (var numPanels = 0; numPanels < 4; numPanels++) {
              let newLights = LightDisplay.create({
                width: 40,
                height: 40
              })

              newLights.render({
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
              })

              let _timeDisplay = new DomView('<div>' + (numPanels + 1) + '.<br>' + (Globals.get('AppConfig.experiment.maxDuration') / 4.0) + ' sec </div>');
              let _brightnessDisplay = new DomView("<div id='exp_viz__brightness'> Light </div>");
              newLights.view().addChild(_timeDisplay, '.light-display__content');
              newLights.view().addChild(_brightnessDisplay, '.light-display__content');

              this._expVizLights.push(newLights)
            }

            // 6. Create the Representation view
            this._expViz = new DomView("<div class='exp_viz'><span id='title'>Visual Representation of the Experiment:</span></div>");
            this._expViz.addChild(new DomView("<div class='exp_viz__container'></div>"));
            this._expVizLights.forEach((lightsDisplay) => {
              this._expViz._children[0].addChild(lightsDisplay.view())
            }, this)
            this._expViz.addChild(new DomView("<span> Total duration is " + Globals.get('AppConfig.experiment.maxDuration') + " seconds. </div>"));

            // 7. Add the Representation View to the tab
            this._tabView.addChild(this._expViz);

          }

          this._reporter = new ExperimentReporter();
          this._reporter.addEventListener('ExperimentReporter.Send', this._onResultsSend);
          this._reporter.addEventListener('ExperimentReporter.DontSend', this._onResultsDontSend);
          this._reporter.hide();

          this._setExperimentModality();

          HM.hook('Panel.Contents', this._hookPanelContents, 9);
          HM.hook('InteractiveTabs.ListTabs', this._hookInteractiveTabs, 10);
          Globals.addEventListener('Model.Change', this._onGlobalsChange);

          Globals.get('Relay').addEventListener('ExperimentServer.Update', this._onServerUpdate);
          Globals.get('Relay').addEventListener('ExperimentServer.Results', this._onServerResults);
          Globals.get('Relay').addEventListener('ExperimentServer.Failure', this._onServerFailure);
          Globals.get('Relay').addEventListener('Notifications.Add',this._onDisableRequest);
          Globals.get('Relay').addEventListener('Notifications.Remove',this._onEnableRequest);
        })
      } else {
        return super.init();
      }
    }

    _onDisableRequest(evt) {
      if (evt.data.message.match('Loading')) {
        this._configForm.disableNew();
        this._history.disable();
      }
    }

    _onEnableRequest(evt) {
      if (Globals.get('AppConfig.system.experimentModality').toLowerCase().match('create')) {
        this._configForm.enableNew();
        this._history.enable();
      } else {
        this._history.enable();
      }
    }

    _setExperimentModality() {
      if (Globals.get('AppConfig.system.experimentModality')) {
        switch(Globals.get('AppConfig.system.experimentModality').toLowerCase()) {
            case "observe":
              this._configForm.hideFields();
              Globals.set('State.experiment.allowNew', false);
            break;
            case "explore":
              this._configForm.disableFields();
              Globals.set('State.experiment.allowNew', false);
            break;
            case "create":
            case "createandhistory":
              Globals.set('State.experiment.allowNew', true);
            break;
        }
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
            //var importParams = Globals.get('AppConfig.experiment.experimentForm') == 'table' ? [{ left: 100, duration: 15 }, { top: 100, duration: 15 }, { bottom: 100, duration: 15 }, { right: 100, duration: 15 }] : [];
          this._configForm.import({
            lights: [{ left: 100, duration: 15 }, { top: 100, duration: 15 }, { bottom: 100, duration: 15 }, { right: 100, duration: 15 }]
          }).then(() => {
            this._configForm.setState('new')
            if (this._dryRunView) {
              this._dryRunLights.view().show();
              this._dryRunBulbs.view().show();
            }
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
            this._configForm.import(
              Object.assign({},
                data.expForm,
                { lights: data.configuration }
              )
            );
            return data;
          }).then((data) => {

            this._configForm.setState('historical');
            if (this._dryRunView) {
              this._dryRunLights.view().hide();
              this._dryRunBulbs.view().hide();
            }
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
        tabType: "experiment",
        content: this._tabView
      });
      return list;
    }

    _onConfigChange(evt) {
      if (Globals.get('AppConfig.experiment.experimentForm') == 'table'){
        this._resetDryRun();
        this._firstDryRun = true;
      } else if (Globals.get('AppConfig.experiment.experimentForm') == 'narrative'){

        var lightConfig = this._configForm.getLightConfiguration();
        var lightLevels = {'-1': '', '0': 'off', '25': 'dim', '50': 'medium', '75': 'bright', '100': 'v. bright'};

        for (let panel = 0; panel < 4; panel++) {
          this._expViz._children[0]._children[panel].render(lightConfig['lights'][panel])
          this._expViz._children[0]._children[panel].$el.find('#exp_viz__brightness').html(lightLevels[lightConfig['brightness'][panel]])
        }
      }
    }

    _onRunRequest(evt) {
      if (this._dryRunLights & this._dryRunBulbs) { this._resetDryRun(); }
      this._configForm.validate().then((validation) => {
        this._reporter.reset();
        this._reporter.setFullscreen(this._history.historyCount() == 0)
        this._reporter.show();
        Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentRequest', this._configForm.export()); //**************************
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

    _resetDryRun() {
      this._timer.stop();
      this._dryRunLights.render({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      })
      this._dryRunBulbs.render({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      })
      this._drTimeDisplay.$dom().html('');
    }

    _onDryRunTick(evt) {
      const time = this._timer.time();
      this._dryRunLights.render(EugUtils.getLightState(this._dryRunData, time))
      this._dryRunBulbs.render(EugUtils.getLightState(this._dryRunData, time))
      this._drTimeDisplay.$dom().html(Utils.secondsToTimeString(time));
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
      if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
        this._history.import({ exp_history_id: '_new' });
      }
    }
  }

  ExperimentModule.requires = [ServerInterface];
  return ExperimentModule;
})
