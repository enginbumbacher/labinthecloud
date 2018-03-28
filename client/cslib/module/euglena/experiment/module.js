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
            var experimentModality = Globals.get('AppConfig.system.experimentModality');
            Globals.set('State.experiment.allowNew', experimentModality.match('create') ? true : false);

            // 1. Create the history form
            _this2._history = new HistoryForm();
            _this2._history.addEventListener('Form.FieldChanged', _this2._onHistorySelectionChange);

            // 2. Create the tab and add the history form to it.
            _this2._tabView = new DomView("<div class='tab__experiment'></div>");
            _this2._tabView.addChild(_this2._history.view());

            _this2._tabView.addChild(new DomView("<div id='expProtocol__title'> Experiment Menu: </div>"));

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
        } else {
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
            case "create":
            case "createandhistory":
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50VGFibGVGb3JtIiwiRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0iLCJVdGlscyIsIkxpZ2h0RGlzcGxheSIsIkJ1bGJEaXNwbGF5IiwiSGlzdG9yeUZvcm0iLCJEb21WaWV3IiwiU2VydmVySW50ZXJmYWNlIiwiVGltZXIiLCJFdWdVdGlscyIsIkV4cGVyaW1lbnRSZXBvcnRlciIsIkV4cGVyaW1lbnRNb2R1bGUiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsInByb21pc2UiLCJfbG9hZERlbW9IaXN0b3J5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiZXhwZXJpbWVudE1vZGFsaXR5Iiwic2V0IiwibWF0Y2giLCJfaGlzdG9yeSIsIl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UiLCJfdGFiVmlldyIsImFkZENoaWxkIiwidmlldyIsIl9jb25maWdGb3JtIiwiX29uQ29uZmlnQ2hhbmdlIiwiX29uRHJ5UnVuUmVxdWVzdCIsIl9vblJ1blJlcXVlc3QiLCJfb25OZXdFeHBlcmltZW50UmVxdWVzdCIsIl9vbkFnZ3JlZ2F0ZVJlcXVlc3QiLCJfZHJ5UnVuTGlnaHRzIiwiY3JlYXRlIiwid2lkdGgiLCJoZWlnaHQiLCJfZHJ5UnVuQnVsYnMiLCJfZHJUaW1lRGlzcGxheSIsIiRkb20iLCJvbiIsIl90aW1lciIsImR1cmF0aW9uIiwibG9vcCIsInJhdGUiLCJfb25EcnlSdW5UaWNrIiwiX3Jlc2V0RHJ5UnVuIiwiX2RyeVJ1blZpZXciLCJfZXhwVml6TGlnaHRzIiwibnVtUGFuZWxzIiwibmV3TGlnaHRzIiwicmVuZGVyIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwiX3RpbWVEaXNwbGF5IiwiX2JyaWdodG5lc3NEaXNwbGF5IiwicHVzaCIsIl9leHBWaXoiLCJmb3JFYWNoIiwibGlnaHRzRGlzcGxheSIsIl9jaGlsZHJlbiIsIl9yZXBvcnRlciIsIl9vblJlc3VsdHNTZW5kIiwiX29uUmVzdWx0c0RvbnRTZW5kIiwiaGlkZSIsIl9zZXRFeHBlcmltZW50TW9kYWxpdHkiLCJob29rIiwiX2hvb2tQYW5lbENvbnRlbnRzIiwiX2hvb2tJbnRlcmFjdGl2ZVRhYnMiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uU2VydmVyVXBkYXRlIiwiX29uU2VydmVyUmVzdWx0cyIsIl9vblNlcnZlckZhaWx1cmUiLCJfb25EaXNhYmxlUmVxdWVzdCIsIl9vbkVuYWJsZVJlcXVlc3QiLCJldnQiLCJkYXRhIiwibWVzc2FnZSIsImRpc2FibGVOZXciLCJkaXNhYmxlIiwidG9Mb3dlckNhc2UiLCJlbmFibGVOZXciLCJlbmFibGUiLCJoaWRlRmllbGRzIiwiZGlzYWJsZUZpZWxkcyIsImxpc3QiLCJtZXRhIiwiaWQiLCJwYXRoIiwidXBkYXRlIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJleHBfaGlzdG9yeV9pZCIsIl9sb2FkRXhwZXJpbWVudEluRm9ybSIsImV4cG9ydCIsInZhbHVlIiwicHJvbWlzZUFqYXgiLCJmaWx0ZXIiLCJ3aGVyZSIsImRlbW8iLCJleHBlcmltZW50cyIsIm1hcCIsImUiLCJjdXJyZW50VGFyZ2V0Iiwib2xkSWQiLCJfY3VyckV4cElkIiwidGFyZ2V0IiwibGlnaHRzIiwic2V0U3RhdGUiLCJzaG93IiwiZGlzcGF0Y2hFdmVudCIsImV4cGVyaW1lbnQiLCJPYmplY3QiLCJhc3NpZ24iLCJleHBGb3JtIiwiY29uZmlndXJhdGlvbiIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImV4cGVyaW1lbnRJZCIsInRpdGxlIiwidGFiVHlwZSIsImNvbnRlbnQiLCJfZmlyc3REcnlSdW4iLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0TGV2ZWxzIiwicGFuZWwiLCIkZWwiLCJmaW5kIiwiaHRtbCIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsInJlc2V0Iiwic2V0RnVsbHNjcmVlbiIsImhpc3RvcnlDb3VudCIsInJldmVydFRvTGFzdEhpc3RvcnkiLCJjYXRjaCIsImVyciIsImVycm9ycyIsImpvaW4iLCJhdXRvRXhwaXJlIiwiZXhwaXJlTGFiZWwiLCJnZXRMaXZlUmVzdWx0cyIsInJlc3VsdHMiLCJfZHJ5UnVuRGF0YSIsInN0YXJ0IiwiYWN0aXZlIiwicGF1c2UiLCJzdG9wIiwidGltZSIsImdldExpZ2h0U3RhdGUiLCJzZWNvbmRzVG9UaW1lU3RyaW5nIiwic3RhdHVzIiwiX3Jlc3VsdENsZWFudXAiLCJyZXN1bHRJZCIsInBoYXNlIiwicmVxdWlyZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7QUFBQSxNQUdFSSxzQkFBc0JKLFFBQVEsbUJBQVIsQ0FIeEI7QUFBQSxNQUlFSywwQkFBMEJMLFFBQVEsdUJBQVIsQ0FKNUI7QUFBQSxNQUtFTSxRQUFRTixRQUFRLGlCQUFSLENBTFY7QUFBQSxNQU1FTyxlQUFlUCxRQUFRLDZDQUFSLENBTmpCO0FBQUEsTUFPRVEsY0FBY1IsUUFBUSwyQ0FBUixDQVBoQjtBQUFBLE1BUUVTLGNBQWNULFFBQVEsZ0JBQVIsQ0FSaEI7QUFBQSxNQVNFVSxVQUFVVixRQUFRLG9CQUFSLENBVFo7QUFBQSxNQVVFVyxrQkFBa0JYLFFBQVEsMEJBQVIsQ0FWcEI7QUFBQSxNQVdFWSxRQUFRWixRQUFRLGlCQUFSLENBWFY7QUFBQSxNQVlFYSxXQUFXYixRQUFRLGVBQVIsQ0FaYjtBQUFBLE1BYUVjLHFCQUFxQmQsUUFBUSxxQkFBUixDQWJ2Qjs7QUFnQkFBLFVBQVEsa0JBQVI7O0FBakJrQixNQW1C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QTZCbkYsSUFBSUMsSUFBSixDQUFTa0YsS0FBVCxJQUFrQixpQkFBbkQsRUFBc0U7QUFDcEUsZUFBSzFJLFFBQUwsQ0FBY3lFLE1BQWQsQ0FBcUIsRUFBRUMsZ0JBQWdCLE1BQWxCLEVBQXJCO0FBQ0Q7QUFDRjtBQXhlZTs7QUFBQTtBQUFBLElBbUJhckcsTUFuQmI7O0FBMmVsQmMsbUJBQWlCd0osUUFBakIsR0FBNEIsQ0FBQzVKLGVBQUQsQ0FBNUI7QUFDQSxTQUFPSSxnQkFBUDtBQUNELENBN2VEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgRXhwZXJpbWVudFRhYmxlRm9ybSA9IHJlcXVpcmUoJy4vZm9ybV90YWJsZS9mb3JtJyksXG4gICAgRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0gPSByZXF1aXJlKCcuL2Zvcm1fbmFycmF0aXZlL2Zvcm0nKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIExpZ2h0RGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2xpZ2h0ZGlzcGxheS9saWdodGRpc3BsYXknKSxcbiAgICBCdWxiRGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2J1bGJkaXNwbGF5L2J1bGJkaXNwbGF5JyksXG4gICAgSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuL2hpc3RvcnkvZm9ybScpLFxuICAgIERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBTZXJ2ZXJJbnRlcmZhY2UgPSByZXF1aXJlKCcuL3NlcnZlcmludGVyZmFjZS9tb2R1bGUnKSxcbiAgICBUaW1lciA9IHJlcXVpcmUoJ2NvcmUvdXRpbC90aW1lcicpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpLFxuICAgIEV4cGVyaW1lbnRSZXBvcnRlciA9IHJlcXVpcmUoJy4vcmVwb3J0ZXIvcmVwb3J0ZXInKVxuICA7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIGNsYXNzIEV4cGVyaW1lbnRNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19ob29rSW50ZXJhY3RpdmVUYWJzJywgJ19vblJ1blJlcXVlc3QnLCAnX29uR2xvYmFsc0NoYW5nZScsXG4gICAgICAgICdfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlJywgJ19vbkRyeVJ1blJlcXVlc3QnLCAnX29uRHJ5UnVuVGljaycsXG4gICAgICAgICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3RXhwZXJpbWVudFJlcXVlc3QnLCAnX29uQWdncmVnYXRlUmVxdWVzdCcsXG4gICAgICAgICdfaG9va1BhbmVsQ29udGVudHMnLCAnX29uU2VydmVyVXBkYXRlJywgJ19vblNlcnZlclJlc3VsdHMnLCAnX29uU2VydmVyRmFpbHVyZScsXG4gICAgICAgICdfb25SZXN1bHRzRG9udFNlbmQnLCAnX29uUmVzdWx0c1NlbmQnLCAnX29uUGhhc2VDaGFuZ2UnLCAnX29uRGlzYWJsZVJlcXVlc3QnLCAnX29uRW5hYmxlUmVxdWVzdCdcbiAgICAgIF0pO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudCcpKSB7XG4gICAgICAgIGxldCBwcm9taXNlO1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV1Z2xlbmFTZXJ2ZXJNb2RlJykgPT0gXCJkZW1vXCIpIHtcbiAgICAgICAgICBwcm9taXNlID0gdGhpcy5fbG9hZERlbW9IaXN0b3J5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBleHBlcmltZW50TW9kYWxpdHkgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGV4cGVyaW1lbnRNb2RhbGl0eS5tYXRjaCgnY3JlYXRlJykgPyB0cnVlIDogZmFsc2UpXG5cbiAgICAgICAgICAvLyAxLiBDcmVhdGUgdGhlIGhpc3RvcnkgZm9ybVxuICAgICAgICAgIHRoaXMuX2hpc3RvcnkgPSBuZXcgSGlzdG9yeUZvcm0oKTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcblxuICAgICAgICAgIC8vIDIuIENyZWF0ZSB0aGUgdGFiIGFuZCBhZGQgdGhlIGhpc3RvcnkgZm9ybSB0byBpdC5cbiAgICAgICAgICB0aGlzLl90YWJWaWV3ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGNsYXNzPSd0YWJfX2V4cGVyaW1lbnQnPjwvZGl2PlwiKTtcbiAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcblxuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQobmV3IERvbVZpZXcoXCI8ZGl2IGlkPSdleHBQcm90b2NvbF9fdGl0bGUnPiBFeHBlcmltZW50IE1lbnU6IDwvZGl2PlwiKSk7XG5cbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJyk9PSd0YWJsZScpIHtcblxuICAgICAgICAgICAgLy8gMy4gQ3JlYXRlIHRoZSBleHBlcmltZW50YXRpb24gZm9ybVxuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybSA9IG5ldyBFeHBlcmltZW50VGFibGVGb3JtKCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5EcnlSdW4nLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5TdWJtaXQnLCB0aGlzLl9vblJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdFeHBlcmltZW50UmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcblxuICAgICAgICAgICAgLy8gNC4gQWRkIHRoZSBjb25maWdGb3JtIHRvIHRoZSB0YWJcbiAgICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fY29uZmlnRm9ybS52aWV3KCkpO1xuXG4gICAgICAgICAgICAvLyA1LiBDcmVhdGUgdGhlIGRyeVJ1biBzcGVjaWZpY2F0aW9uc1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzID0gTGlnaHREaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMTUwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMgPSBCdWxiRGlzcGxheS5jcmVhdGUoe1xuICAgICAgICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDE1MFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX2RyVGltZURpc3BsYXkgPSBuZXcgRG9tVmlldygnPHNwYW4gY2xhc3M9XCJkcnlfcnVuX190aW1lXCI+PC9zcGFuPicpXG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLiRkb20oKS5vbignY2xpY2snLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLiRkb20oKS5vbignY2xpY2snLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9kclRpbWVEaXNwbGF5LCAnLmxpZ2h0LWRpc3BsYXlfX2NvbnRlbnQnKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gbmV3IFRpbWVyKHtcbiAgICAgICAgICAgICAgZHVyYXRpb246IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpLFxuICAgICAgICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgICAgICAgcmF0ZTogNFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyLmFkZEV2ZW50TGlzdGVuZXIoJ1RpbWVyLlRpY2snLCB0aGlzLl9vbkRyeVJ1blRpY2spO1xuICAgICAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcblxuICAgICAgICAgICAgLy8gNi4gQ3JlYXRlIHRoZSBkcnlSdW4gdmlld1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuVmlldyA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0nZHJ5X3J1bic+PC9kaXY+XCIpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5MaWdodHMudmlldygpKTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuQnVsYnMudmlldygpKTtcblxuICAgICAgICAgICAgLy8gNy4gQWRkIHRoZSBkcnlSdW5WaWV3IHRvIHRoZSB0YWJcbiAgICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuVmlldyk7XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpID09ICduYXJyYXRpdmUnKXtcblxuICAgICAgICAgICAgLy8gMi4gQ3JlYXRlIHRoZSBleHBlcmltZW50YXRpb24gZm9ybSB0aGF0IGNvbnRhaW5zXG4gICAgICAgICAgICAvLyBhLiBleHBlcmltZW50IGRlc2NyaXB0b3JcbiAgICAgICAgICAgIC8vIGIuIGV4cGVyaW1lbnQgc2V0dXBcbiAgICAgICAgICAgIC8vIGMuIGV4cGVyaW1lbnQgcHJvdG9jb2xcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0gPSBuZXcgRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0oKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LlN1Ym1pdCcsIHRoaXMuX29uUnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Lk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgICAvLyAzLiBBZGQgdGhlIGNvbmZpZ0Zvcm0gYW5kIGV4cGVyaW1lbnRWaWV3IHRvIHRoZSB0YWIuXG4gICAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpKTtcblxuICAgICAgICAgICAgLy8gNC4gQ3JlYXRlIHZpc3VhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgZXhwZXJpbWVudCBwcm90b2NvbFxuXG4gICAgICAgICAgICAvLyA1LiBDcmVhdGUgdGhlIGRyeVJ1biBzcGVjaWZpY2F0aW9uc1xuICAgICAgICAgICAgdGhpcy5fZXhwVml6TGlnaHRzID0gW11cbiAgICAgICAgICAgIGZvciAodmFyIG51bVBhbmVscyA9IDA7IG51bVBhbmVscyA8IDQ7IG51bVBhbmVscysrKSB7XG4gICAgICAgICAgICAgIGxldCBuZXdMaWdodHMgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MFxuICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIG5ld0xpZ2h0cy5yZW5kZXIoe1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICByaWdodDogMFxuICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIGxldCBfdGltZURpc3BsYXkgPSBuZXcgRG9tVmlldygnPGRpdj4nICsgKG51bVBhbmVscyArIDEpICsgJy48YnI+JyArIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSAvIDQuMCkgKyAnIHNlYyA8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgbGV0IF9icmlnaHRuZXNzRGlzcGxheSA9IG5ldyBEb21WaWV3KFwiPGRpdiBpZD0nZXhwX3Zpel9fYnJpZ2h0bmVzcyc+IExpZ2h0IDwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgbmV3TGlnaHRzLnZpZXcoKS5hZGRDaGlsZChfdGltZURpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuICAgICAgICAgICAgICBuZXdMaWdodHMudmlldygpLmFkZENoaWxkKF9icmlnaHRuZXNzRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG5cbiAgICAgICAgICAgICAgdGhpcy5fZXhwVml6TGlnaHRzLnB1c2gobmV3TGlnaHRzKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA2LiBDcmVhdGUgdGhlIFJlcHJlc2VudGF0aW9uIHZpZXdcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpeiA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0nZXhwX3Zpeic+PHNwYW4gaWQ9J3RpdGxlJz5WaXN1YWwgUmVwcmVzZW50YXRpb24gb2YgdGhlIEV4cGVyaW1lbnQ6PC9zcGFuPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpei5hZGRDaGlsZChuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2V4cF92aXpfX2NvbnRhaW5lcic+PC9kaXY+XCIpKTtcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpekxpZ2h0cy5mb3JFYWNoKChsaWdodHNEaXNwbGF5KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2V4cFZpei5fY2hpbGRyZW5bMF0uYWRkQ2hpbGQobGlnaHRzRGlzcGxheS52aWV3KCkpXG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICAgICAgdGhpcy5fZXhwVml6LmFkZENoaWxkKG5ldyBEb21WaWV3KFwiPHNwYW4+IFRvdGFsIGR1cmF0aW9uIGlzIFwiICsgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJykgKyBcIiBzZWNvbmRzLiA8L2Rpdj5cIikpO1xuXG4gICAgICAgICAgICAvLyA3LiBBZGQgdGhlIFJlcHJlc2VudGF0aW9uIFZpZXcgdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9leHBWaXopO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIgPSBuZXcgRXhwZXJpbWVudFJlcG9ydGVyKCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLlNlbmQnLCB0aGlzLl9vblJlc3VsdHNTZW5kKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50UmVwb3J0ZXIuRG9udFNlbmQnLCB0aGlzLl9vblJlc3VsdHNEb250U2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuXG4gICAgICAgICAgdGhpcy5fc2V0RXhwZXJpbWVudE1vZGFsaXR5KCk7XG5cbiAgICAgICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIHRoaXMuX2hvb2tQYW5lbENvbnRlbnRzLCA5KTtcbiAgICAgICAgICBITS5ob29rKCdJbnRlcmFjdGl2ZVRhYnMuTGlzdFRhYnMnLCB0aGlzLl9ob29rSW50ZXJhY3RpdmVUYWJzLCAxMCk7XG4gICAgICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCB0aGlzLl9vblNlcnZlclVwZGF0ZSk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgdGhpcy5fb25TZXJ2ZXJSZXN1bHRzKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB0aGlzLl9vblNlcnZlckZhaWx1cmUpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuQWRkJyx0aGlzLl9vbkRpc2FibGVSZXF1ZXN0KTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLlJlbW92ZScsdGhpcy5fb25FbmFibGVSZXF1ZXN0KTtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRGlzYWJsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEubWVzc2FnZS5tYXRjaCgnTG9hZGluZycpKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZU5ldygpO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25FbmFibGVSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkubWF0Y2goJ2NyZWF0ZScpKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZW5hYmxlTmV3KCk7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuZW5hYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRFeHBlcmltZW50TW9kYWxpdHkoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykpIHtcbiAgICAgICAgc3dpdGNoKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlYW5kaGlzdG9yeVwiOlxuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va1BhbmVsQ29udGVudHMobGlzdCwgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuaWQgPT0gXCJpbnRlcmFjdGl2ZVwiKSB7XG4gICAgICAgIGxpc3QucHVzaCh0aGlzLl9yZXBvcnRlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJzdHVkZW50X2lkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KClcbiAgICAgICAgICBpZiAoaGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICAgIGV4cF9oaXN0b3J5X2lkOiBoaXN0W2hpc3QubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0odGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJldWdsZW5hU2VydmVyTW9kZVwiKSB7XG4gICAgICAgIGlmIChldnQuZGF0YS52YWx1ZSA9PSBcImRlbW9cIikge1xuICAgICAgICAgIHRoaXMuX2xvYWREZW1vSGlzdG9yeSgpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JywgZmFsc2UpO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfbG9hZERlbW9IaXN0b3J5KCkge1xuICAgICAgaWYgKCFHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknKSkge1xuICAgICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMnLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgZGVtbzogdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChleHBlcmltZW50cykgPT4ge1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScsIGV4cGVyaW1lbnRzLm1hcCgoZSkgPT4gZS5pZCkpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sb2FkRXhwZXJpbWVudEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCk7XG4gICAgfVxuXG4gICAgX2xvYWRFeHBlcmltZW50SW5Gb3JtKGlkKSB7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBsZXQgb2xkSWQgPSB0aGlzLl9jdXJyRXhwSWQ7XG4gICAgICBsZXQgdGFyZ2V0ID0gaWQgPT0gJ19uZXcnID8gbnVsbCA6IGlkO1xuICAgICAgaWYgKG9sZElkICE9IHRhcmdldCkge1xuXG4gICAgICAgIGlmIChpZCA9PSBcIl9uZXdcIikge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IG51bGw7XG4gICAgICAgICAgICAvL3ZhciBpbXBvcnRQYXJhbXMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAndGFibGUnID8gW3sgbGVmdDogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyB0b3A6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgYm90dG9tOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IHJpZ2h0OiAxMDAsIGR1cmF0aW9uOiAxNSB9XSA6IFtdO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaW1wb3J0KHtcbiAgICAgICAgICAgIGxpZ2h0czogW3sgbGVmdDogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyB0b3A6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgYm90dG9tOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IHJpZ2h0OiAxMDAsIGR1cmF0aW9uOiAxNSB9XVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIGlmICh0aGlzLl9kcnlSdW5WaWV3KSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBpZDogXCJfbmV3XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V4cGVyaW1lbnRzLyR7aWR9YClcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5pbXBvcnQoXG4gICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sXG4gICAgICAgICAgICAgICAgZGF0YS5leHBGb3JtLFxuICAgICAgICAgICAgICAgIHsgbGlnaHRzOiBkYXRhLmNvbmZpZ3VyYXRpb24gfVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5fZHJ5UnVuVmlldykge1xuICAgICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnQuTG9hZGVkJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50OiBkYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRFeHBlcmltZW50JywgZGF0YSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va0ludGVyYWN0aXZlVGFicyhsaXN0LCBtZXRhKSB7XG4gICAgICBsaXN0LnB1c2goe1xuICAgICAgICBpZDogXCJleHBlcmltZW50XCIsXG4gICAgICAgIHRpdGxlOiBcIkV4cGVyaW1lbnRcIixcbiAgICAgICAgdGFiVHlwZTogXCJleHBlcmltZW50XCIsXG4gICAgICAgIGNvbnRlbnQ6IHRoaXMuX3RhYlZpZXdcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uQ29uZmlnQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpID09ICd0YWJsZScpe1xuICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgICB0aGlzLl9maXJzdERyeVJ1biA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpID09ICduYXJyYXRpdmUnKXtcblxuICAgICAgICB2YXIgbGlnaHRDb25maWcgPSB0aGlzLl9jb25maWdGb3JtLmdldExpZ2h0Q29uZmlndXJhdGlvbigpO1xuICAgICAgICB2YXIgbGlnaHRMZXZlbHMgPSB7Jy0xJzogJycsICcwJzogJ29mZicsICcyNSc6ICdkaW0nLCAnNTAnOiAnbWVkaXVtJywgJzc1JzogJ2JyaWdodCcsICcxMDAnOiAndi4gYnJpZ2h0J307XG5cbiAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICB0aGlzLl9leHBWaXouX2NoaWxkcmVuWzBdLl9jaGlsZHJlbltwYW5lbF0ucmVuZGVyKGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF0pXG4gICAgICAgICAgdGhpcy5fZXhwVml6Ll9jaGlsZHJlblswXS5fY2hpbGRyZW5bcGFuZWxdLiRlbC5maW5kKCcjZXhwX3Zpel9fYnJpZ2h0bmVzcycpLmh0bWwobGlnaHRMZXZlbHNbbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF1dKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUnVuUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl9kcnlSdW5MaWdodHMgJiB0aGlzLl9kcnlSdW5CdWxicykgeyB0aGlzLl9yZXNldERyeVJ1bigpOyB9XG4gICAgICB0aGlzLl9jb25maWdGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5yZXNldCgpO1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5zZXRGdWxsc2NyZWVuKHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCkgPT0gMClcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIuc2hvdygpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkV4cGVyaW1lbnRSZXF1ZXN0JywgdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKSk7IC8vKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJleHBlcmltZW50X3N1Ym1pc3Npb25cIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5yZXZlcnRUb0xhc3RIaXN0b3J5KCk7XG4gICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZU5ldygpO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmRpc2FibGVOZXcoKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudF9mb3JtX2Vycm9yXCIsXG4gICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgIG1lc3NhZ2U6IGVyci52YWxpZGF0aW9uLmVycm9ycy5qb2luKCc8YnIvPicpLFxuICAgICAgICAgIGF1dG9FeHBpcmU6IDEwLFxuICAgICAgICAgIGV4cGlyZUxhYmVsOiBcIkdvdCBpdFwiXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBleHBfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRMaXZlUmVzdWx0cyh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuQWRkUmVxdWVzdCcsIHtcbiAgICAgICAgICBkYXRhOiByZXN1bHRzXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwiYWRkX2FnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25EcnlSdW5SZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKHRoaXMuX2ZpcnN0RHJ5UnVuKSB7XG4gICAgICAgIHRoaXMuX2RyeVJ1bkRhdGEgPSB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpLmxpZ2h0cztcbiAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICAgIHRoaXMuX3RpbWVyLnBhdXNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9yZXNldERyeVJ1bigpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kcnlSdW5CdWxicy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKCcnKTtcbiAgICB9XG5cbiAgICBfb25EcnlSdW5UaWNrKGV2dCkge1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuX3RpbWVyLnRpbWUoKTtcbiAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy5yZW5kZXIoRXVnVXRpbHMuZ2V0TGlnaHRTdGF0ZSh0aGlzLl9kcnlSdW5EYXRhLCB0aW1lKSlcbiAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnJlbmRlcihFdWdVdGlscy5nZXRMaWdodFN0YXRlKHRoaXMuX2RyeVJ1bkRhdGEsIHRpbWUpKVxuICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheS4kZG9tKCkuaHRtbChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKTtcbiAgICB9XG5cbiAgICBfb25TZXJ2ZXJVcGRhdGUoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXBvcnRlci51cGRhdGUoZXZ0LmRhdGEpO1xuICAgIH1cbiAgICBfb25TZXJ2ZXJSZXN1bHRzKGV2dCkge1xuICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpO1xuICAgICAgICBpZiAoaGlzdC5sZW5ndGggPT0gMSkge1xuICAgICAgICAgIHRoaXMuX29uUmVzdWx0c1NlbmQoe1xuICAgICAgICAgICAgY3VycmVudFRhcmdldDoge1xuICAgICAgICAgICAgICByZXN1bHRzOiBldnQuZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLnVwZGF0ZSh7IHN0YXR1czogXCJjb21wbGV0ZVwiLCByZXN1bHRzOiBldnQuZGF0YSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIF9vblNlcnZlckZhaWx1cmUoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgfVxuXG4gICAgX29uUmVzdWx0c1NlbmQoZXZ0KSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0c1xuICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0cyA9IG51bGw7XG4gICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgIGV4cF9oaXN0b3J5X2lkOiByZXN1bHRzLmV4cGVyaW1lbnRJZFxuICAgICAgfSlcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAnc2VuZF9yZXN1bHQnLFxuICAgICAgICBjYXRlZ29yeTogJ2V4cGVyaW1lbnQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiByZXN1bHRzLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICByZXN1bHRJZDogcmVzdWx0cy5pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBfcmVzdWx0Q2xlYW51cCgpIHtcbiAgICAgIHRoaXMuX3JlcG9ydGVyLmhpZGUoKTtcbiAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZW5hYmxlTmV3KCk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZU5ldygpO1xuICAgIH1cblxuICAgIF9vblJlc3VsdHNEb250U2VuZChldnQpIHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzXG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ2RvbnRfc2VuZF9yZXN1bHQnLFxuICAgICAgICBjYXRlZ29yeTogJ2V4cGVyaW1lbnQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiByZXN1bHRzLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICByZXN1bHRJZDogcmVzdWx0cy5pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBFeHBlcmltZW50TW9kdWxlLnJlcXVpcmVzID0gW1NlcnZlckludGVyZmFjZV07XG4gIHJldHVybiBFeHBlcmltZW50TW9kdWxlO1xufSlcbiJdfQ==
