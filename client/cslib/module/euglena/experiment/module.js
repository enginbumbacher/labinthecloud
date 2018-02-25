'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
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
      ExperimentReporter = require('./reporter/reporter');

  require('link!./style.css');

  var ExperimentModule = function (_Module) {
    _inherits(ExperimentModule, _Module);

    function ExperimentModule() {
      _classCallCheck(this, ExperimentModule);

      var _this = _possibleConstructorReturn(this, (ExperimentModule.__proto__ || Object.getPrototypeOf(ExperimentModule)).call(this));

      Utils.bindMethods(_this, ['_hookInteractiveTabs', '_onRunRequest', '_onGlobalsChange', '_onHistorySelectionChange', '_onDryRunRequest', '_onDryRunTick', '_onConfigChange', '_onNewExperimentRequest', '_onAggregateRequest', '_hookPanelContents', '_onServerUpdate', '_onServerResults', '_onServerFailure', '_onResultsDontSend', '_onResultsSend', '_onPhaseChange', '_onDisableRequest', '_onEnableRequest']);

      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      return _this;
    }

    _createClass(ExperimentModule, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        if (Globals.get('AppConfig.experiment')) {
          var promise = void 0;
          if (Globals.get('AppConfig.experiment.euglenaServerMode') == "demo") {
            promise = this._loadDemoHistory();
          } else {
            promise = Promise.resolve(true);
          }
          return promise.then(function () {
            var staticHistory = Globals.get('AppConfig.experiment.experimentHistory');
            Globals.set('State.experiment.allowNew', staticHistory ? false : true);

            // 1. Create the history form
            _this2._history = new HistoryForm();
            _this2._history.addEventListener('Form.FieldChanged', _this2._onHistorySelectionChange);

            // 2. Create the tab and add the history form to it.
            _this2._tabView = new DomView("<div class='tab__experiment'></div>");
            _this2._tabView.addChild(_this2._history.view());

            _this2._tabView.addChild(new DomView("<div id='expProtocol__title'> Experiment Protocol: </div>"));

            if (Globals.get('AppConfig.experiment.experimentForm') == 'table') {

              // 3. Create the experimentation form
              _this2._configForm = new ExperimentTableForm();
              _this2._configForm.addEventListener('Form.FieldChanged', _this2._onConfigChange);
              _this2._configForm.view().addEventListener('Experiment.DryRun', _this2._onDryRunRequest);
              _this2._configForm.view().addEventListener('Experiment.Submit', _this2._onRunRequest);
              _this2._configForm.view().addEventListener('Experiment.NewRequest', _this2._onNewExperimentRequest);
              _this2._configForm.view().addEventListener('Experiment.AddToAggregate', _this2._onAggregateRequest);

              // 4. Add the configForm to the tab
              _this2._tabView.addChild(_this2._configForm.view());

              // 5. Create the dryRun specifications
              _this2._dryRunLights = LightDisplay.create({
                width: 200,
                height: 150
              });
              _this2._dryRunBulbs = BulbDisplay.create({
                width: 200,
                height: 150
              });
              _this2._drTimeDisplay = new DomView('<span class="dry_run__time"></span>');
              _this2._dryRunLights.view().$dom().on('click', _this2._onDryRunRequest);
              _this2._dryRunBulbs.view().$dom().on('click', _this2._onDryRunRequest);
              _this2._dryRunLights.view().addChild(_this2._drTimeDisplay, '.light-display__content');
              _this2._timer = new Timer({
                duration: Globals.get('AppConfig.experiment.maxDuration'),
                loop: false,
                rate: 4
              });
              _this2._timer.addEventListener('Timer.Tick', _this2._onDryRunTick);
              _this2._resetDryRun();

              // 6. Create the dryRun view
              _this2._dryRunView = new DomView("<div class='dry_run'></div>");
              _this2._dryRunView.addChild(_this2._dryRunLights.view());
              _this2._dryRunView.addChild(_this2._dryRunBulbs.view());

              // 7. Add the dryRunView to the tab
              _this2._tabView.addChild(_this2._dryRunView);
            } else if (Globals.get('AppConfig.experiment.experimentForm') == 'narrative') {

              // 2. Create the experimentation form that contains
              // a. experiment descriptor
              // b. experiment setup
              // c. experiment protocol
              _this2._configForm = new ExperimentNarrativeForm();
              _this2._configForm.addEventListener('Form.FieldChanged', _this2._onConfigChange);
              _this2._configForm.view().addEventListener('Experiment.Submit', _this2._onRunRequest);
              _this2._configForm.view().addEventListener('Experiment.NewRequest', _this2._onNewExperimentRequest);
              _this2._configForm.view().addEventListener('Experiment.AddToAggregate', _this2._onAggregateRequest);

              // 3. Add the configForm and experimentView to the tab.
              _this2._tabView.addChild(_this2._configForm.view());

              // 4. Create visual representation of the experiment protocol

              // 5. Create the dryRun specifications
              _this2._expVizLights = [];
              for (var numPanels = 0; numPanels < 4; numPanels++) {
                var newLights = LightDisplay.create({
                  width: 40,
                  height: 40
                });

                newLights.render({
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0
                });

                var _timeDisplay = new DomView('<div>' + (numPanels + 1) + '.<br>' + Globals.get('AppConfig.experiment.maxDuration') / 4.0 + ' sec </div>');
                var _brightnessDisplay = new DomView("<div id='exp_viz__brightness'> Light </div>");
                newLights.view().addChild(_timeDisplay, '.light-display__content');
                newLights.view().addChild(_brightnessDisplay, '.light-display__content');

                _this2._expVizLights.push(newLights);
              }

              // 6. Create the Representation view
              _this2._expViz = new DomView("<div class='exp_viz'><span id='title'>Visual Representation of the Experiment:</span></div>");
              _this2._expViz.addChild(new DomView("<div class='exp_viz__container'></div>"));
              _this2._expVizLights.forEach(function (lightsDisplay) {
                _this2._expViz._children[0].addChild(lightsDisplay.view());
              }, _this2);
              _this2._expViz.addChild(new DomView("<span> Total duration is " + Globals.get('AppConfig.experiment.maxDuration') + " seconds. </div>"));

              // 7. Add the Representation View to the tab
              _this2._tabView.addChild(_this2._expViz);
            }

            _this2._reporter = new ExperimentReporter();
            _this2._reporter.addEventListener('ExperimentReporter.Send', _this2._onResultsSend);
            _this2._reporter.addEventListener('ExperimentReporter.DontSend', _this2._onResultsDontSend);
            _this2._reporter.hide();

            _this2._setExperimentModality();

            HM.hook('Panel.Contents', _this2._hookPanelContents, 9);
            HM.hook('InteractiveTabs.ListTabs', _this2._hookInteractiveTabs, 10);
            Globals.addEventListener('Model.Change', _this2._onGlobalsChange);

            Globals.get('Relay').addEventListener('ExperimentServer.Update', _this2._onServerUpdate);
            Globals.get('Relay').addEventListener('ExperimentServer.Results', _this2._onServerResults);
            Globals.get('Relay').addEventListener('ExperimentServer.Failure', _this2._onServerFailure);
            Globals.get('Relay').addEventListener('Notifications.Add', _this2._onDisableRequest);
            Globals.get('Relay').addEventListener('Notifications.Remove', _this2._onEnableRequest);
          });
        } else {
          return _get(ExperimentModule.prototype.__proto__ || Object.getPrototypeOf(ExperimentModule.prototype), 'init', this).call(this);
        }
      }
    }, {
      key: '_onDisableRequest',
      value: function _onDisableRequest(evt) {
        if (evt.data.message.match('Loading')) {
          this._configForm.disableNew();
          this._history.disable();
        }
      }
    }, {
      key: '_onEnableRequest',
      value: function _onEnableRequest(evt) {
        if (Globals.get('AppConfig.system.experimentModality').toLowerCase().match('create')) {
          this._configForm.enableNew();
          this._history.enable();
        }
      }
    }, {
      key: '_setExperimentModality',
      value: function _setExperimentModality() {
        if (Globals.get('AppConfig.system.experimentModality')) {
          switch (Globals.get('AppConfig.system.experimentModality').toLowerCase()) {
            case "observe":
              this._configForm.hideFields();
              Globals.set('State.experiment.allowNew', false);
              break;
            case "explore":
              this._configForm.disableFields();
              Globals.set('State.experiment.allowNew', false);
              break;
            case "createAndHistory":
              Globals.set('State.experiment.allowNew', true);
              break;
          }
        }
      }
    }, {
      key: '_hookPanelContents',
      value: function _hookPanelContents(list, meta) {
        if (meta.id == "interactive") {
          list.push(this._reporter);
        }
        return list;
      }
    }, {
      key: '_onGlobalsChange',
      value: function _onGlobalsChange(evt) {
        var _this3 = this;

        if (evt.data.path == "student_id") {
          this._history.update().then(function () {
            var hist = _this3._history.getHistory();
            if (hist.length) {
              return _this3._history.import({
                exp_history_id: hist[hist.length - 1]
              });
            } else {
              return true;
            }
          }).then(function () {
            _this3._loadExperimentInForm(_this3._history.export().exp_history_id);
          });
        } else if (evt.data.path == "euglenaServerMode") {
          if (evt.data.value == "demo") {
            this._loadDemoHistory();
            Globals.set('State.experiment.allowNew', false);
            this._history.update();
          }
        }
      }
    }, {
      key: '_loadDemoHistory',
      value: function _loadDemoHistory() {
        if (!Globals.get('AppConfig.experiment.experimentHistory')) {
          return Utils.promiseAjax('/api/v1/Experiments', {
            data: {
              filter: {
                where: {
                  demo: true
                }
              }
            }
          }).then(function (experiments) {
            Globals.set('AppConfig.experiment.experimentHistory', experiments.map(function (e) {
              return e.id;
            }));
          });
        } else {
          return Promise.resolve(true);
        }
      }
    }, {
      key: '_onHistorySelectionChange',
      value: function _onHistorySelectionChange(evt) {
        this._loadExperimentInForm(evt.currentTarget.export().exp_history_id);
      }
    }, {
      key: '_loadExperimentInForm',
      value: function _loadExperimentInForm(id) {
        var _this4 = this;

        if (!id) return;
        var oldId = this._currExpId;
        var target = id == '_new' ? null : id;
        if (oldId != target) {

          if (id == "_new") {
            this._currExpId = null;
            //var importParams = Globals.get('AppConfig.experiment.experimentForm') == 'table' ? [{ left: 100, duration: 15 }, { top: 100, duration: 15 }, { bottom: 100, duration: 15 }, { right: 100, duration: 15 }] : [];
            this._configForm.import({
              lights: [{ left: 100, duration: 15 }, { top: 100, duration: 15 }, { bottom: 100, duration: 15 }, { right: 100, duration: 15 }]
            }).then(function () {
              _this4._configForm.setState('new');
              if (_this4._dryRunView) {
                _this4._dryRunLights.view().show();
                _this4._dryRunBulbs.view().show();
              }
              Globals.get('Relay').dispatchEvent('Experiment.Loaded', {
                experiment: {
                  id: "_new"
                }
              });
            });
          } else {
            this._currExpId = id;
            Utils.promiseAjax('/api/v1/Experiments/' + id).then(function (data) {
              _this4._configForm.import(Object.assign({}, data.expForm, { lights: data.configuration }));
              return data;
            }).then(function (data) {

              _this4._configForm.setState('historical');
              if (_this4._dryRunView) {
                _this4._dryRunLights.view().hide();
                _this4._dryRunBulbs.view().hide();
              }
              Globals.get('Relay').dispatchEvent('Experiment.Loaded', {
                experiment: data
              });
              Globals.set('currentExperiment', data);
            });
          }
          Globals.get('Logger').log({
            type: "load",
            category: "experiment",
            data: {
              experimentId: id
            }
          });
        }
      }
    }, {
      key: '_hookInteractiveTabs',
      value: function _hookInteractiveTabs(list, meta) {
        list.push({
          id: "experiment",
          title: "Experiment",
          tabType: "experiment",
          content: this._tabView
        });
        return list;
      }
    }, {
      key: '_onConfigChange',
      value: function _onConfigChange(evt) {
        if (Globals.get('AppConfig.experiment.experimentForm') == 'table') {
          this._resetDryRun();
          this._firstDryRun = true;
        } else if (Globals.get('AppConfig.experiment.experimentForm') == 'narrative') {

          var lightConfig = this._configForm.getLightConfiguration();
          var lightLevels = { '-1': '', '0': 'off', '25': 'dim', '50': 'medium', '75': 'bright', '100': 'v. bright' };

          for (var panel = 0; panel < 4; panel++) {
            this._expViz._children[0]._children[panel].render(lightConfig['lights'][panel]);
            this._expViz._children[0]._children[panel].$el.find('#exp_viz__brightness').html(lightLevels[lightConfig['brightness'][panel]]);
          }
        }
      }
    }, {
      key: '_onRunRequest',
      value: function _onRunRequest(evt) {
        var _this5 = this;

        if (this._dryRunLights & this._dryRunBulbs) {
          this._resetDryRun();
        }
        this._configForm.validate().then(function (validation) {
          _this5._reporter.reset();
          _this5._reporter.setFullscreen(_this5._history.historyCount() == 0);
          _this5._reporter.show();
          Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentRequest', _this5._configForm.export()); //**************************
          Globals.get('Logger').log({
            type: "experiment_submission",
            category: "experiment",
            data: {
              configuration: _this5._configForm.export()
            }
          });
          _this5._history.revertToLastHistory();
          _this5._configForm.disableNew();
          _this5._history.disableNew();
        }).catch(function (err) {
          Globals.get('Relay').dispatchEvent('Notifications.Add', {
            id: "experiment_form_error",
            type: "error",
            message: err.validation.errors.join('<br/>'),
            autoExpire: 10,
            expireLabel: "Got it"
          });
        });
      }
    }, {
      key: '_onNewExperimentRequest',
      value: function _onNewExperimentRequest(evt) {
        this._history.import({ exp_history_id: '_new' });
      }
    }, {
      key: '_onAggregateRequest',
      value: function _onAggregateRequest(evt) {
        EugUtils.getLiveResults(this._history.export().exp_history_id).then(function (results) {
          Globals.get('Relay').dispatchEvent('AggregateData.AddRequest', {
            data: results
          });
        });
        Globals.get('Logger').log({
          type: "add_aggregate",
          category: "experiment",
          data: {
            experimentId: this._history.export().exp_history_id
          }
        });
      }
    }, {
      key: '_onDryRunRequest',
      value: function _onDryRunRequest(evt) {
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
    }, {
      key: '_resetDryRun',
      value: function _resetDryRun() {
        this._timer.stop();
        this._dryRunLights.render({
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        });
        this._dryRunBulbs.render({
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        });
        this._drTimeDisplay.$dom().html('');
      }
    }, {
      key: '_onDryRunTick',
      value: function _onDryRunTick(evt) {
        var time = this._timer.time();
        this._dryRunLights.render(EugUtils.getLightState(this._dryRunData, time));
        this._dryRunBulbs.render(EugUtils.getLightState(this._dryRunData, time));
        this._drTimeDisplay.$dom().html(Utils.secondsToTimeString(time));
      }
    }, {
      key: '_onServerUpdate',
      value: function _onServerUpdate(evt) {
        this._reporter.update(evt.data);
      }
    }, {
      key: '_onServerResults',
      value: function _onServerResults(evt) {
        var _this6 = this;

        this._history.update().then(function () {
          var hist = _this6._history.getHistory();
          if (hist.length == 1) {
            _this6._onResultsSend({
              currentTarget: {
                results: evt.data
              }
            });
          } else {
            _this6._reporter.update({ status: "complete", results: evt.data });
          }
        });
      }
    }, {
      key: '_onServerFailure',
      value: function _onServerFailure(evt) {
        this._resultCleanup();
      }
    }, {
      key: '_onResultsSend',
      value: function _onResultsSend(evt) {
        var results = evt.currentTarget.results;
        evt.currentTarget.results = null;
        this._history.import({
          exp_history_id: results.experimentId
        });
        this._resultCleanup();
        Globals.get('Logger').log({
          type: 'send_result',
          category: 'experiment',
          data: {
            experimentId: results.experimentId,
            resultId: results.id
          }
        });
      }
    }, {
      key: '_resultCleanup',
      value: function _resultCleanup() {
        this._reporter.hide();
        this._configForm.enableNew();
        this._history.enableNew();
      }
    }, {
      key: '_onResultsDontSend',
      value: function _onResultsDontSend(evt) {
        var results = evt.currentTarget.results;
        this._resultCleanup();
        Globals.get('Logger').log({
          type: 'dont_send_result',
          category: 'experiment',
          data: {
            experimentId: results.experimentId,
            resultId: results.id
          }
        });
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
          this._history.import({ exp_history_id: '_new' });
        }
      }
    }]);

    return ExperimentModule;
  }(Module);

  ExperimentModule.requires = [ServerInterface];
  return ExperimentModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50VGFibGVGb3JtIiwiRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0iLCJVdGlscyIsIkxpZ2h0RGlzcGxheSIsIkJ1bGJEaXNwbGF5IiwiSGlzdG9yeUZvcm0iLCJEb21WaWV3IiwiU2VydmVySW50ZXJmYWNlIiwiVGltZXIiLCJFdWdVdGlscyIsIkV4cGVyaW1lbnRSZXBvcnRlciIsIkV4cGVyaW1lbnRNb2R1bGUiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsInByb21pc2UiLCJfbG9hZERlbW9IaXN0b3J5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwic3RhdGljSGlzdG9yeSIsInNldCIsIl9oaXN0b3J5IiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl90YWJWaWV3IiwiYWRkQ2hpbGQiLCJ2aWV3IiwiX2NvbmZpZ0Zvcm0iLCJfb25Db25maWdDaGFuZ2UiLCJfb25EcnlSdW5SZXF1ZXN0IiwiX29uUnVuUmVxdWVzdCIsIl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9kcnlSdW5MaWdodHMiLCJjcmVhdGUiLCJ3aWR0aCIsImhlaWdodCIsIl9kcnlSdW5CdWxicyIsIl9kclRpbWVEaXNwbGF5IiwiJGRvbSIsIm9uIiwiX3RpbWVyIiwiZHVyYXRpb24iLCJsb29wIiwicmF0ZSIsIl9vbkRyeVJ1blRpY2siLCJfcmVzZXREcnlSdW4iLCJfZHJ5UnVuVmlldyIsIl9leHBWaXpMaWdodHMiLCJudW1QYW5lbHMiLCJuZXdMaWdodHMiLCJyZW5kZXIiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJfdGltZURpc3BsYXkiLCJfYnJpZ2h0bmVzc0Rpc3BsYXkiLCJwdXNoIiwiX2V4cFZpeiIsImZvckVhY2giLCJsaWdodHNEaXNwbGF5IiwiX2NoaWxkcmVuIiwiX3JlcG9ydGVyIiwiX29uUmVzdWx0c1NlbmQiLCJfb25SZXN1bHRzRG9udFNlbmQiLCJoaWRlIiwiX3NldEV4cGVyaW1lbnRNb2RhbGl0eSIsImhvb2siLCJfaG9va1BhbmVsQ29udGVudHMiLCJfaG9va0ludGVyYWN0aXZlVGFicyIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25TZXJ2ZXJVcGRhdGUiLCJfb25TZXJ2ZXJSZXN1bHRzIiwiX29uU2VydmVyRmFpbHVyZSIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsImV2dCIsImRhdGEiLCJtZXNzYWdlIiwibWF0Y2giLCJkaXNhYmxlTmV3IiwiZGlzYWJsZSIsInRvTG93ZXJDYXNlIiwiZW5hYmxlTmV3IiwiZW5hYmxlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJsaXN0IiwibWV0YSIsImlkIiwicGF0aCIsInVwZGF0ZSIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwiZXhwX2hpc3RvcnlfaWQiLCJfbG9hZEV4cGVyaW1lbnRJbkZvcm0iLCJleHBvcnQiLCJ2YWx1ZSIsInByb21pc2VBamF4IiwiZmlsdGVyIiwid2hlcmUiLCJkZW1vIiwiZXhwZXJpbWVudHMiLCJtYXAiLCJlIiwiY3VycmVudFRhcmdldCIsIm9sZElkIiwiX2N1cnJFeHBJZCIsInRhcmdldCIsImxpZ2h0cyIsInNldFN0YXRlIiwic2hvdyIsImRpc3BhdGNoRXZlbnQiLCJleHBlcmltZW50IiwiT2JqZWN0IiwiYXNzaWduIiwiZXhwRm9ybSIsImNvbmZpZ3VyYXRpb24iLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJleHBlcmltZW50SWQiLCJ0aXRsZSIsInRhYlR5cGUiLCJjb250ZW50IiwiX2ZpcnN0RHJ5UnVuIiwibGlnaHRDb25maWciLCJnZXRMaWdodENvbmZpZ3VyYXRpb24iLCJsaWdodExldmVscyIsInBhbmVsIiwiJGVsIiwiZmluZCIsImh0bWwiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJyZXNldCIsInNldEZ1bGxzY3JlZW4iLCJoaXN0b3J5Q291bnQiLCJyZXZlcnRUb0xhc3RIaXN0b3J5IiwiY2F0Y2giLCJlcnIiLCJlcnJvcnMiLCJqb2luIiwiYXV0b0V4cGlyZSIsImV4cGlyZUxhYmVsIiwiZ2V0TGl2ZVJlc3VsdHMiLCJyZXN1bHRzIiwiX2RyeVJ1bkRhdGEiLCJzdGFydCIsImFjdGl2ZSIsInBhdXNlIiwic3RvcCIsInRpbWUiLCJnZXRMaWdodFN0YXRlIiwic2Vjb25kc1RvVGltZVN0cmluZyIsInN0YXR1cyIsIl9yZXN1bHRDbGVhbnVwIiwicmVzdWx0SWQiLCJwaGFzZSIsInJlcXVpcmVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQO0FBQUEsTUFHRUksc0JBQXNCSixRQUFRLG1CQUFSLENBSHhCO0FBQUEsTUFJRUssMEJBQTBCTCxRQUFRLHVCQUFSLENBSjVCO0FBQUEsTUFLRU0sUUFBUU4sUUFBUSxpQkFBUixDQUxWO0FBQUEsTUFNRU8sZUFBZVAsUUFBUSw2Q0FBUixDQU5qQjtBQUFBLE1BT0VRLGNBQWNSLFFBQVEsMkNBQVIsQ0FQaEI7QUFBQSxNQVFFUyxjQUFjVCxRQUFRLGdCQUFSLENBUmhCO0FBQUEsTUFTRVUsVUFBVVYsUUFBUSxvQkFBUixDQVRaO0FBQUEsTUFVRVcsa0JBQWtCWCxRQUFRLDBCQUFSLENBVnBCO0FBQUEsTUFXRVksUUFBUVosUUFBUSxpQkFBUixDQVhWO0FBQUEsTUFZRWEsV0FBV2IsUUFBUSxlQUFSLENBWmI7QUFBQSxNQWFFYyxxQkFBcUJkLFFBQVEscUJBQVIsQ0FidkI7O0FBZ0JBQSxVQUFRLGtCQUFSOztBQWpCa0IsTUFtQlplLGdC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Z0IsTUFBbEIsRUFBckI7QUFDRDtBQUNGO0FBcmVlOztBQUFBO0FBQUEsSUFtQmFyRyxNQW5CYjs7QUF3ZWxCYyxtQkFBaUJ3SixRQUFqQixHQUE0QixDQUFDNUosZUFBRCxDQUE1QjtBQUNBLFNBQU9JLGdCQUFQO0FBQ0QsQ0ExZUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBFeHBlcmltZW50VGFibGVGb3JtID0gcmVxdWlyZSgnLi9mb3JtX3RhYmxlL2Zvcm0nKSxcbiAgICBFeHBlcmltZW50TmFycmF0aXZlRm9ybSA9IHJlcXVpcmUoJy4vZm9ybV9uYXJyYXRpdmUvZm9ybScpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgTGlnaHREaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvbGlnaHRkaXNwbGF5L2xpZ2h0ZGlzcGxheScpLFxuICAgIEJ1bGJEaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvYnVsYmRpc3BsYXkvYnVsYmRpc3BsYXknKSxcbiAgICBIaXN0b3J5Rm9ybSA9IHJlcXVpcmUoJy4vaGlzdG9yeS9mb3JtJyksXG4gICAgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFNlcnZlckludGVyZmFjZSA9IHJlcXVpcmUoJy4vc2VydmVyaW50ZXJmYWNlL21vZHVsZScpLFxuICAgIFRpbWVyID0gcmVxdWlyZSgnY29yZS91dGlsL3RpbWVyJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJyksXG4gICAgRXhwZXJpbWVudFJlcG9ydGVyID0gcmVxdWlyZSgnLi9yZXBvcnRlci9yZXBvcnRlcicpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgY2xhc3MgRXhwZXJpbWVudE1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX2hvb2tJbnRlcmFjdGl2ZVRhYnMnLCAnX29uUnVuUmVxdWVzdCcsICdfb25HbG9iYWxzQ2hhbmdlJyxcbiAgICAgICAgJ19vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UnLCAnX29uRHJ5UnVuUmVxdWVzdCcsICdfb25EcnlSdW5UaWNrJyxcbiAgICAgICAgJ19vbkNvbmZpZ0NoYW5nZScsICdfb25OZXdFeHBlcmltZW50UmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19ob29rUGFuZWxDb250ZW50cycsICdfb25TZXJ2ZXJVcGRhdGUnLCAnX29uU2VydmVyUmVzdWx0cycsICdfb25TZXJ2ZXJGYWlsdXJlJyxcbiAgICAgICAgJ19vblJlc3VsdHNEb250U2VuZCcsICdfb25SZXN1bHRzU2VuZCcsICdfb25QaGFzZUNoYW5nZScsICdfb25EaXNhYmxlUmVxdWVzdCcsICdfb25FbmFibGVSZXF1ZXN0J1xuICAgICAgXSk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50JykpIHtcbiAgICAgICAgbGV0IHByb21pc2U7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXVnbGVuYVNlcnZlck1vZGUnKSA9PSBcImRlbW9cIikge1xuICAgICAgICAgIHByb21pc2UgPSB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRpY0hpc3RvcnkgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIHN0YXRpY0hpc3RvcnkgPyBmYWxzZSA6IHRydWUpXG5cbiAgICAgICAgICAvLyAxLiBDcmVhdGUgdGhlIGhpc3RvcnkgZm9ybVxuICAgICAgICAgIHRoaXMuX2hpc3RvcnkgPSBuZXcgSGlzdG9yeUZvcm0oKTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcblxuICAgICAgICAgIC8vIDIuIENyZWF0ZSB0aGUgdGFiIGFuZCBhZGQgdGhlIGhpc3RvcnkgZm9ybSB0byBpdC5cbiAgICAgICAgICB0aGlzLl90YWJWaWV3ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGNsYXNzPSd0YWJfX2V4cGVyaW1lbnQnPjwvZGl2PlwiKTtcbiAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcblxuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQobmV3IERvbVZpZXcoXCI8ZGl2IGlkPSdleHBQcm90b2NvbF9fdGl0bGUnPiBFeHBlcmltZW50IFByb3RvY29sOiA8L2Rpdj5cIikpO1xuXG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpPT0ndGFibGUnKSB7XG5cbiAgICAgICAgICAgIC8vIDMuIENyZWF0ZSB0aGUgZXhwZXJpbWVudGF0aW9uIGZvcm1cbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0gPSBuZXcgRXhwZXJpbWVudFRhYmxlRm9ybSgpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuRHJ5UnVuJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuU3VibWl0JywgdGhpcy5fb25SdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3RXhwZXJpbWVudFJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZScsIHRoaXMuX29uQWdncmVnYXRlUmVxdWVzdCk7XG5cbiAgICAgICAgICAgIC8vIDQuIEFkZCB0aGUgY29uZmlnRm9ybSB0byB0aGUgdGFiXG4gICAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpKTtcblxuICAgICAgICAgICAgLy8gNS4gQ3JlYXRlIHRoZSBkcnlSdW4gc3BlY2lmaWNhdGlvbnNcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cyA9IExpZ2h0RGlzcGxheS5jcmVhdGUoe1xuICAgICAgICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDE1MFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzID0gQnVsYkRpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgICAgd2lkdGg6IDIwMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAxNTBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl9kclRpbWVEaXNwbGF5ID0gbmV3IERvbVZpZXcoJzxzcGFuIGNsYXNzPVwiZHJ5X3J1bl9fdGltZVwiPjwvc3Bhbj4nKVxuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS4kZG9tKCkub24oJ2NsaWNrJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS4kZG9tKCkub24oJ2NsaWNrJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZHJUaW1lRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG4gICAgICAgICAgICB0aGlzLl90aW1lciA9IG5ldyBUaW1lcih7XG4gICAgICAgICAgICAgIGR1cmF0aW9uOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSxcbiAgICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICAgIHJhdGU6IDRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl90aW1lci5hZGRFdmVudExpc3RlbmVyKCdUaW1lci5UaWNrJywgdGhpcy5fb25EcnlSdW5UaWNrKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG5cbiAgICAgICAgICAgIC8vIDYuIENyZWF0ZSB0aGUgZHJ5UnVuIHZpZXdcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2RyeV9ydW4nPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKSk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKSk7XG5cbiAgICAgICAgICAgIC8vIDcuIEFkZCB0aGUgZHJ5UnVuVmlldyB0byB0aGUgdGFiXG4gICAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1blZpZXcpO1xuXG4gICAgICAgICAgfSBlbHNlIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAnbmFycmF0aXZlJyl7XG5cbiAgICAgICAgICAgIC8vIDIuIENyZWF0ZSB0aGUgZXhwZXJpbWVudGF0aW9uIGZvcm0gdGhhdCBjb250YWluc1xuICAgICAgICAgICAgLy8gYS4gZXhwZXJpbWVudCBkZXNjcmlwdG9yXG4gICAgICAgICAgICAvLyBiLiBleHBlcmltZW50IHNldHVwXG4gICAgICAgICAgICAvLyBjLiBleHBlcmltZW50IHByb3RvY29sXG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtID0gbmV3IEV4cGVyaW1lbnROYXJyYXRpdmVGb3JtKCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5TdWJtaXQnLCB0aGlzLl9vblJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdFeHBlcmltZW50UmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcblxuICAgICAgICAgICAgLy8gMy4gQWRkIHRoZSBjb25maWdGb3JtIGFuZCBleHBlcmltZW50VmlldyB0byB0aGUgdGFiLlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9jb25maWdGb3JtLnZpZXcoKSk7XG5cbiAgICAgICAgICAgIC8vIDQuIENyZWF0ZSB2aXN1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGV4cGVyaW1lbnQgcHJvdG9jb2xcblxuICAgICAgICAgICAgLy8gNS4gQ3JlYXRlIHRoZSBkcnlSdW4gc3BlY2lmaWNhdGlvbnNcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpekxpZ2h0cyA9IFtdXG4gICAgICAgICAgICBmb3IgKHZhciBudW1QYW5lbHMgPSAwOyBudW1QYW5lbHMgPCA0OyBudW1QYW5lbHMrKykge1xuICAgICAgICAgICAgICBsZXQgbmV3TGlnaHRzID0gTGlnaHREaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogNDBcbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICBuZXdMaWdodHMucmVuZGVyKHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDBcbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICBsZXQgX3RpbWVEaXNwbGF5ID0gbmV3IERvbVZpZXcoJzxkaXY+JyArIChudW1QYW5lbHMgKyAxKSArICcuPGJyPicgKyAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJykgLyA0LjApICsgJyBzZWMgPC9kaXY+Jyk7XG4gICAgICAgICAgICAgIGxldCBfYnJpZ2h0bmVzc0Rpc3BsYXkgPSBuZXcgRG9tVmlldyhcIjxkaXYgaWQ9J2V4cF92aXpfX2JyaWdodG5lc3MnPiBMaWdodCA8L2Rpdj5cIik7XG4gICAgICAgICAgICAgIG5ld0xpZ2h0cy52aWV3KCkuYWRkQ2hpbGQoX3RpbWVEaXNwbGF5LCAnLmxpZ2h0LWRpc3BsYXlfX2NvbnRlbnQnKTtcbiAgICAgICAgICAgICAgbmV3TGlnaHRzLnZpZXcoKS5hZGRDaGlsZChfYnJpZ2h0bmVzc0Rpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuXG4gICAgICAgICAgICAgIHRoaXMuX2V4cFZpekxpZ2h0cy5wdXNoKG5ld0xpZ2h0cylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gNi4gQ3JlYXRlIHRoZSBSZXByZXNlbnRhdGlvbiB2aWV3XG4gICAgICAgICAgICB0aGlzLl9leHBWaXogPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2V4cF92aXonPjxzcGFuIGlkPSd0aXRsZSc+VmlzdWFsIFJlcHJlc2VudGF0aW9uIG9mIHRoZSBFeHBlcmltZW50Ojwvc3Bhbj48L2Rpdj5cIik7XG4gICAgICAgICAgICB0aGlzLl9leHBWaXouYWRkQ2hpbGQobmV3IERvbVZpZXcoXCI8ZGl2IGNsYXNzPSdleHBfdml6X19jb250YWluZXInPjwvZGl2PlwiKSk7XG4gICAgICAgICAgICB0aGlzLl9leHBWaXpMaWdodHMuZm9yRWFjaCgobGlnaHRzRGlzcGxheSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9leHBWaXouX2NoaWxkcmVuWzBdLmFkZENoaWxkKGxpZ2h0c0Rpc3BsYXkudmlldygpKVxuICAgICAgICAgICAgfSwgdGhpcylcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpei5hZGRDaGlsZChuZXcgRG9tVmlldyhcIjxzcGFuPiBUb3RhbCBkdXJhdGlvbiBpcyBcIiArIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpICsgXCIgc2Vjb25kcy4gPC9kaXY+XCIpKTtcblxuICAgICAgICAgICAgLy8gNy4gQWRkIHRoZSBSZXByZXNlbnRhdGlvbiBWaWV3IHRvIHRoZSB0YWJcbiAgICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fZXhwVml6KTtcblxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyID0gbmV3IEV4cGVyaW1lbnRSZXBvcnRlcigpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRSZXBvcnRlci5TZW5kJywgdGhpcy5fb25SZXN1bHRzU2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLkRvbnRTZW5kJywgdGhpcy5fb25SZXN1bHRzRG9udFNlbmQpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmhpZGUoKTtcblxuICAgICAgICAgIHRoaXMuX3NldEV4cGVyaW1lbnRNb2RhbGl0eSgpO1xuXG4gICAgICAgICAgSE0uaG9vaygnUGFuZWwuQ29udGVudHMnLCB0aGlzLl9ob29rUGFuZWxDb250ZW50cywgOSk7XG4gICAgICAgICAgSE0uaG9vaygnSW50ZXJhY3RpdmVUYWJzLkxpc3RUYWJzJywgdGhpcy5faG9va0ludGVyYWN0aXZlVGFicywgMTApO1xuICAgICAgICAgIEdsb2JhbHMuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25HbG9iYWxzQ2hhbmdlKTtcblxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRTZXJ2ZXIuVXBkYXRlJywgdGhpcy5fb25TZXJ2ZXJVcGRhdGUpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRTZXJ2ZXIuUmVzdWx0cycsIHRoaXMuX29uU2VydmVyUmVzdWx0cyk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5GYWlsdXJlJywgdGhpcy5fb25TZXJ2ZXJGYWlsdXJlKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLkFkZCcsdGhpcy5fb25EaXNhYmxlUmVxdWVzdCk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX29uRW5hYmxlUmVxdWVzdCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkRpc2FibGVSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLm1lc3NhZ2UubWF0Y2goJ0xvYWRpbmcnKSkge1xuICAgICAgICB0aGlzLl9jb25maWdGb3JtLmRpc2FibGVOZXcoKTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRW5hYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpLm1hdGNoKCdjcmVhdGUnKSkge1xuICAgICAgICB0aGlzLl9jb25maWdGb3JtLmVuYWJsZU5ldygpO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRFeHBlcmltZW50TW9kYWxpdHkoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykpIHtcbiAgICAgICAgc3dpdGNoKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlQW5kSGlzdG9yeVwiOlxuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va1BhbmVsQ29udGVudHMobGlzdCwgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuaWQgPT0gXCJpbnRlcmFjdGl2ZVwiKSB7XG4gICAgICAgIGxpc3QucHVzaCh0aGlzLl9yZXBvcnRlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJzdHVkZW50X2lkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KClcbiAgICAgICAgICBpZiAoaGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICAgIGV4cF9oaXN0b3J5X2lkOiBoaXN0W2hpc3QubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0odGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJldWdsZW5hU2VydmVyTW9kZVwiKSB7XG4gICAgICAgIGlmIChldnQuZGF0YS52YWx1ZSA9PSBcImRlbW9cIikge1xuICAgICAgICAgIHRoaXMuX2xvYWREZW1vSGlzdG9yeSgpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JywgZmFsc2UpO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfbG9hZERlbW9IaXN0b3J5KCkge1xuICAgICAgaWYgKCFHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknKSkge1xuICAgICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMnLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgZGVtbzogdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChleHBlcmltZW50cykgPT4ge1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScsIGV4cGVyaW1lbnRzLm1hcCgoZSkgPT4gZS5pZCkpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sb2FkRXhwZXJpbWVudEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCk7XG4gICAgfVxuXG4gICAgX2xvYWRFeHBlcmltZW50SW5Gb3JtKGlkKSB7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBsZXQgb2xkSWQgPSB0aGlzLl9jdXJyRXhwSWQ7XG4gICAgICBsZXQgdGFyZ2V0ID0gaWQgPT0gJ19uZXcnID8gbnVsbCA6IGlkO1xuICAgICAgaWYgKG9sZElkICE9IHRhcmdldCkge1xuXG4gICAgICAgIGlmIChpZCA9PSBcIl9uZXdcIikge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IG51bGw7XG4gICAgICAgICAgICAvL3ZhciBpbXBvcnRQYXJhbXMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAndGFibGUnID8gW3sgbGVmdDogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyB0b3A6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgYm90dG9tOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IHJpZ2h0OiAxMDAsIGR1cmF0aW9uOiAxNSB9XSA6IFtdO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaW1wb3J0KHtcbiAgICAgICAgICAgIGxpZ2h0czogW3sgbGVmdDogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyB0b3A6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgYm90dG9tOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IHJpZ2h0OiAxMDAsIGR1cmF0aW9uOiAxNSB9XVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIGlmICh0aGlzLl9kcnlSdW5WaWV3KSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBpZDogXCJfbmV3XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V4cGVyaW1lbnRzLyR7aWR9YClcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5pbXBvcnQoXG4gICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sXG4gICAgICAgICAgICAgICAgZGF0YS5leHBGb3JtLFxuICAgICAgICAgICAgICAgIHsgbGlnaHRzOiBkYXRhLmNvbmZpZ3VyYXRpb24gfVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5fZHJ5UnVuVmlldykge1xuICAgICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnQuTG9hZGVkJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50OiBkYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRFeHBlcmltZW50JywgZGF0YSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va0ludGVyYWN0aXZlVGFicyhsaXN0LCBtZXRhKSB7XG4gICAgICBsaXN0LnB1c2goe1xuICAgICAgICBpZDogXCJleHBlcmltZW50XCIsXG4gICAgICAgIHRpdGxlOiBcIkV4cGVyaW1lbnRcIixcbiAgICAgICAgdGFiVHlwZTogXCJleHBlcmltZW50XCIsXG4gICAgICAgIGNvbnRlbnQ6IHRoaXMuX3RhYlZpZXdcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uQ29uZmlnQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpID09ICd0YWJsZScpe1xuICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgICB0aGlzLl9maXJzdERyeVJ1biA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpID09ICduYXJyYXRpdmUnKXtcblxuICAgICAgICB2YXIgbGlnaHRDb25maWcgPSB0aGlzLl9jb25maWdGb3JtLmdldExpZ2h0Q29uZmlndXJhdGlvbigpO1xuICAgICAgICB2YXIgbGlnaHRMZXZlbHMgPSB7Jy0xJzogJycsICcwJzogJ29mZicsICcyNSc6ICdkaW0nLCAnNTAnOiAnbWVkaXVtJywgJzc1JzogJ2JyaWdodCcsICcxMDAnOiAndi4gYnJpZ2h0J307XG5cbiAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICB0aGlzLl9leHBWaXouX2NoaWxkcmVuWzBdLl9jaGlsZHJlbltwYW5lbF0ucmVuZGVyKGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF0pXG4gICAgICAgICAgdGhpcy5fZXhwVml6Ll9jaGlsZHJlblswXS5fY2hpbGRyZW5bcGFuZWxdLiRlbC5maW5kKCcjZXhwX3Zpel9fYnJpZ2h0bmVzcycpLmh0bWwobGlnaHRMZXZlbHNbbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF1dKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUnVuUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl9kcnlSdW5MaWdodHMgJiB0aGlzLl9kcnlSdW5CdWxicykgeyB0aGlzLl9yZXNldERyeVJ1bigpOyB9XG4gICAgICB0aGlzLl9jb25maWdGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5yZXNldCgpO1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5zZXRGdWxsc2NyZWVuKHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCkgPT0gMClcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIuc2hvdygpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkV4cGVyaW1lbnRSZXF1ZXN0JywgdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKSk7IC8vKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJleHBlcmltZW50X3N1Ym1pc3Npb25cIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5yZXZlcnRUb0xhc3RIaXN0b3J5KCk7XG4gICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZU5ldygpO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmRpc2FibGVOZXcoKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudF9mb3JtX2Vycm9yXCIsXG4gICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgIG1lc3NhZ2U6IGVyci52YWxpZGF0aW9uLmVycm9ycy5qb2luKCc8YnIvPicpLFxuICAgICAgICAgIGF1dG9FeHBpcmU6IDEwLFxuICAgICAgICAgIGV4cGlyZUxhYmVsOiBcIkdvdCBpdFwiXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBleHBfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRMaXZlUmVzdWx0cyh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuQWRkUmVxdWVzdCcsIHtcbiAgICAgICAgICBkYXRhOiByZXN1bHRzXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwiYWRkX2FnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25EcnlSdW5SZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKHRoaXMuX2ZpcnN0RHJ5UnVuKSB7XG4gICAgICAgIHRoaXMuX2RyeVJ1bkRhdGEgPSB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpLmxpZ2h0cztcbiAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICAgIHRoaXMuX3RpbWVyLnBhdXNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9yZXNldERyeVJ1bigpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kcnlSdW5CdWxicy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKCcnKTtcbiAgICB9XG5cbiAgICBfb25EcnlSdW5UaWNrKGV2dCkge1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuX3RpbWVyLnRpbWUoKTtcbiAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy5yZW5kZXIoRXVnVXRpbHMuZ2V0TGlnaHRTdGF0ZSh0aGlzLl9kcnlSdW5EYXRhLCB0aW1lKSlcbiAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnJlbmRlcihFdWdVdGlscy5nZXRMaWdodFN0YXRlKHRoaXMuX2RyeVJ1bkRhdGEsIHRpbWUpKVxuICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheS4kZG9tKCkuaHRtbChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKTtcbiAgICB9XG5cbiAgICBfb25TZXJ2ZXJVcGRhdGUoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXBvcnRlci51cGRhdGUoZXZ0LmRhdGEpO1xuICAgIH1cbiAgICBfb25TZXJ2ZXJSZXN1bHRzKGV2dCkge1xuICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpO1xuICAgICAgICBpZiAoaGlzdC5sZW5ndGggPT0gMSkge1xuICAgICAgICAgIHRoaXMuX29uUmVzdWx0c1NlbmQoe1xuICAgICAgICAgICAgY3VycmVudFRhcmdldDoge1xuICAgICAgICAgICAgICByZXN1bHRzOiBldnQuZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLnVwZGF0ZSh7IHN0YXR1czogXCJjb21wbGV0ZVwiLCByZXN1bHRzOiBldnQuZGF0YSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIF9vblNlcnZlckZhaWx1cmUoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgfVxuXG4gICAgX29uUmVzdWx0c1NlbmQoZXZ0KSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0c1xuICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0cyA9IG51bGw7XG4gICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgIGV4cF9oaXN0b3J5X2lkOiByZXN1bHRzLmV4cGVyaW1lbnRJZFxuICAgICAgfSlcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAnc2VuZF9yZXN1bHQnLFxuICAgICAgICBjYXRlZ29yeTogJ2V4cGVyaW1lbnQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiByZXN1bHRzLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICByZXN1bHRJZDogcmVzdWx0cy5pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBfcmVzdWx0Q2xlYW51cCgpIHtcbiAgICAgIHRoaXMuX3JlcG9ydGVyLmhpZGUoKTtcbiAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZW5hYmxlTmV3KCk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZU5ldygpO1xuICAgIH1cblxuICAgIF9vblJlc3VsdHNEb250U2VuZChldnQpIHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzXG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ2RvbnRfc2VuZF9yZXN1bHQnLFxuICAgICAgICBjYXRlZ29yeTogJ2V4cGVyaW1lbnQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiByZXN1bHRzLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICByZXN1bHRJZDogcmVzdWx0cy5pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBFeHBlcmltZW50TW9kdWxlLnJlcXVpcmVzID0gW1NlcnZlckludGVyZmFjZV07XG4gIHJldHVybiBFeHBlcmltZW50TW9kdWxlO1xufSlcbiJdfQ==
