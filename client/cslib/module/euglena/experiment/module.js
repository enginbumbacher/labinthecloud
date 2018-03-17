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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50VGFibGVGb3JtIiwiRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0iLCJVdGlscyIsIkxpZ2h0RGlzcGxheSIsIkJ1bGJEaXNwbGF5IiwiSGlzdG9yeUZvcm0iLCJEb21WaWV3IiwiU2VydmVySW50ZXJmYWNlIiwiVGltZXIiLCJFdWdVdGlscyIsIkV4cGVyaW1lbnRSZXBvcnRlciIsIkV4cGVyaW1lbnRNb2R1bGUiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsInByb21pc2UiLCJfbG9hZERlbW9IaXN0b3J5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiZXhwZXJpbWVudE1vZGFsaXR5Iiwic2V0IiwibWF0Y2giLCJfaGlzdG9yeSIsIl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UiLCJfdGFiVmlldyIsImFkZENoaWxkIiwidmlldyIsIl9jb25maWdGb3JtIiwiX29uQ29uZmlnQ2hhbmdlIiwiX29uRHJ5UnVuUmVxdWVzdCIsIl9vblJ1blJlcXVlc3QiLCJfb25OZXdFeHBlcmltZW50UmVxdWVzdCIsIl9vbkFnZ3JlZ2F0ZVJlcXVlc3QiLCJfZHJ5UnVuTGlnaHRzIiwiY3JlYXRlIiwid2lkdGgiLCJoZWlnaHQiLCJfZHJ5UnVuQnVsYnMiLCJfZHJUaW1lRGlzcGxheSIsIiRkb20iLCJvbiIsIl90aW1lciIsImR1cmF0aW9uIiwibG9vcCIsInJhdGUiLCJfb25EcnlSdW5UaWNrIiwiX3Jlc2V0RHJ5UnVuIiwiX2RyeVJ1blZpZXciLCJfZXhwVml6TGlnaHRzIiwibnVtUGFuZWxzIiwibmV3TGlnaHRzIiwicmVuZGVyIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwiX3RpbWVEaXNwbGF5IiwiX2JyaWdodG5lc3NEaXNwbGF5IiwicHVzaCIsIl9leHBWaXoiLCJmb3JFYWNoIiwibGlnaHRzRGlzcGxheSIsIl9jaGlsZHJlbiIsIl9yZXBvcnRlciIsIl9vblJlc3VsdHNTZW5kIiwiX29uUmVzdWx0c0RvbnRTZW5kIiwiaGlkZSIsIl9zZXRFeHBlcmltZW50TW9kYWxpdHkiLCJob29rIiwiX2hvb2tQYW5lbENvbnRlbnRzIiwiX2hvb2tJbnRlcmFjdGl2ZVRhYnMiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uU2VydmVyVXBkYXRlIiwiX29uU2VydmVyUmVzdWx0cyIsIl9vblNlcnZlckZhaWx1cmUiLCJfb25EaXNhYmxlUmVxdWVzdCIsIl9vbkVuYWJsZVJlcXVlc3QiLCJldnQiLCJkYXRhIiwibWVzc2FnZSIsImRpc2FibGVOZXciLCJkaXNhYmxlIiwidG9Mb3dlckNhc2UiLCJlbmFibGVOZXciLCJlbmFibGUiLCJoaWRlRmllbGRzIiwiZGlzYWJsZUZpZWxkcyIsImxpc3QiLCJtZXRhIiwiaWQiLCJwYXRoIiwidXBkYXRlIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJleHBfaGlzdG9yeV9pZCIsIl9sb2FkRXhwZXJpbWVudEluRm9ybSIsImV4cG9ydCIsInZhbHVlIiwicHJvbWlzZUFqYXgiLCJmaWx0ZXIiLCJ3aGVyZSIsImRlbW8iLCJleHBlcmltZW50cyIsIm1hcCIsImUiLCJjdXJyZW50VGFyZ2V0Iiwib2xkSWQiLCJfY3VyckV4cElkIiwidGFyZ2V0IiwibGlnaHRzIiwic2V0U3RhdGUiLCJzaG93IiwiZGlzcGF0Y2hFdmVudCIsImV4cGVyaW1lbnQiLCJPYmplY3QiLCJhc3NpZ24iLCJleHBGb3JtIiwiY29uZmlndXJhdGlvbiIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImV4cGVyaW1lbnRJZCIsInRpdGxlIiwidGFiVHlwZSIsImNvbnRlbnQiLCJfZmlyc3REcnlSdW4iLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0TGV2ZWxzIiwicGFuZWwiLCIkZWwiLCJmaW5kIiwiaHRtbCIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsInJlc2V0Iiwic2V0RnVsbHNjcmVlbiIsImhpc3RvcnlDb3VudCIsInJldmVydFRvTGFzdEhpc3RvcnkiLCJjYXRjaCIsImVyciIsImVycm9ycyIsImpvaW4iLCJhdXRvRXhwaXJlIiwiZXhwaXJlTGFiZWwiLCJnZXRMaXZlUmVzdWx0cyIsInJlc3VsdHMiLCJfZHJ5UnVuRGF0YSIsInN0YXJ0IiwiYWN0aXZlIiwicGF1c2UiLCJzdG9wIiwidGltZSIsImdldExpZ2h0U3RhdGUiLCJzZWNvbmRzVG9UaW1lU3RyaW5nIiwic3RhdHVzIiwiX3Jlc3VsdENsZWFudXAiLCJyZXN1bHRJZCIsInBoYXNlIiwicmVxdWlyZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7QUFBQSxNQUdFSSxzQkFBc0JKLFFBQVEsbUJBQVIsQ0FIeEI7QUFBQSxNQUlFSywwQkFBMEJMLFFBQVEsdUJBQVIsQ0FKNUI7QUFBQSxNQUtFTSxRQUFRTixRQUFRLGlCQUFSLENBTFY7QUFBQSxNQU1FTyxlQUFlUCxRQUFRLDZDQUFSLENBTmpCO0FBQUEsTUFPRVEsY0FBY1IsUUFBUSwyQ0FBUixDQVBoQjtBQUFBLE1BUUVTLGNBQWNULFFBQVEsZ0JBQVIsQ0FSaEI7QUFBQSxNQVNFVSxVQUFVVixRQUFRLG9CQUFSLENBVFo7QUFBQSxNQVVFVyxrQkFBa0JYLFFBQVEsMEJBQVIsQ0FWcEI7QUFBQSxNQVdFWSxRQUFRWixRQUFRLGlCQUFSLENBWFY7QUFBQSxNQVlFYSxXQUFXYixRQUFRLGVBQVIsQ0FaYjtBQUFBLE1BYUVjLHFCQUFxQmQsUUFBUSxxQkFBUixDQWJ2Qjs7QUFnQkFBLFVBQVEsa0JBQVI7O0FBakJrQixNQW1C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QXNFO0FBQ3BFLGVBQUsxSSxRQUFMLENBQWN5RSxNQUFkLENBQXFCLEVBQUVDLGdCQUFnQixNQUFsQixFQUFyQjtBQUNEO0FBQ0Y7QUF0ZWU7O0FBQUE7QUFBQSxJQW1CYXJHLE1BbkJiOztBQXllbEJjLG1CQUFpQndKLFFBQWpCLEdBQTRCLENBQUM1SixlQUFELENBQTVCO0FBQ0EsU0FBT0ksZ0JBQVA7QUFDRCxDQTNlRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIEV4cGVyaW1lbnRUYWJsZUZvcm0gPSByZXF1aXJlKCcuL2Zvcm1fdGFibGUvZm9ybScpLFxuICAgIEV4cGVyaW1lbnROYXJyYXRpdmVGb3JtID0gcmVxdWlyZSgnLi9mb3JtX25hcnJhdGl2ZS9mb3JtJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBMaWdodERpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5JyksXG4gICAgQnVsYkRpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS9idWxiZGlzcGxheScpLFxuICAgIEhpc3RvcnlGb3JtID0gcmVxdWlyZSgnLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgU2VydmVySW50ZXJmYWNlID0gcmVxdWlyZSgnLi9zZXJ2ZXJpbnRlcmZhY2UvbW9kdWxlJyksXG4gICAgVGltZXIgPSByZXF1aXJlKCdjb3JlL3V0aWwvdGltZXInKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKSxcbiAgICBFeHBlcmltZW50UmVwb3J0ZXIgPSByZXF1aXJlKCcuL3JlcG9ydGVyL3JlcG9ydGVyJylcbiAgO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICBjbGFzcyBFeHBlcmltZW50TW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfaG9va0ludGVyYWN0aXZlVGFicycsICdfb25SdW5SZXF1ZXN0JywgJ19vbkdsb2JhbHNDaGFuZ2UnLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25EcnlSdW5SZXF1ZXN0JywgJ19vbkRyeVJ1blRpY2snLFxuICAgICAgICAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0JywgJ19vbkFnZ3JlZ2F0ZVJlcXVlc3QnLFxuICAgICAgICAnX2hvb2tQYW5lbENvbnRlbnRzJywgJ19vblNlcnZlclVwZGF0ZScsICdfb25TZXJ2ZXJSZXN1bHRzJywgJ19vblNlcnZlckZhaWx1cmUnLFxuICAgICAgICAnX29uUmVzdWx0c0RvbnRTZW5kJywgJ19vblJlc3VsdHNTZW5kJywgJ19vblBoYXNlQ2hhbmdlJywgJ19vbkRpc2FibGVSZXF1ZXN0JywgJ19vbkVuYWJsZVJlcXVlc3QnXG4gICAgICBdKTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQnKSkge1xuICAgICAgICBsZXQgcHJvbWlzZTtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5ldWdsZW5hU2VydmVyTW9kZScpID09IFwiZGVtb1wiKSB7XG4gICAgICAgICAgcHJvbWlzZSA9IHRoaXMuX2xvYWREZW1vSGlzdG9yeSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXhwZXJpbWVudE1vZGFsaXR5ID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5Jyk7XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBleHBlcmltZW50TW9kYWxpdHkubWF0Y2goJ2NyZWF0ZScpID8gdHJ1ZSA6IGZhbHNlKVxuXG4gICAgICAgICAgLy8gMS4gQ3JlYXRlIHRoZSBoaXN0b3J5IGZvcm1cbiAgICAgICAgICB0aGlzLl9oaXN0b3J5ID0gbmV3IEhpc3RvcnlGb3JtKCk7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG5cbiAgICAgICAgICAvLyAyLiBDcmVhdGUgdGhlIHRhYiBhbmQgYWRkIHRoZSBoaXN0b3J5IGZvcm0gdG8gaXQuXG4gICAgICAgICAgdGhpcy5fdGFiVmlldyA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0ndGFiX19leHBlcmltZW50Jz48L2Rpdj5cIik7XG4gICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG5cbiAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKG5ldyBEb21WaWV3KFwiPGRpdiBpZD0nZXhwUHJvdG9jb2xfX3RpdGxlJz4gRXhwZXJpbWVudCBQcm90b2NvbDogPC9kaXY+XCIpKTtcblxuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKT09J3RhYmxlJykge1xuXG4gICAgICAgICAgICAvLyAzLiBDcmVhdGUgdGhlIGV4cGVyaW1lbnRhdGlvbiBmb3JtXG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtID0gbmV3IEV4cGVyaW1lbnRUYWJsZUZvcm0oKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkRyeVJ1bicsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LlN1Ym1pdCcsIHRoaXMuX29uUnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Lk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgICAvLyA0LiBBZGQgdGhlIGNvbmZpZ0Zvcm0gdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9jb25maWdGb3JtLnZpZXcoKSk7XG5cbiAgICAgICAgICAgIC8vIDUuIENyZWF0ZSB0aGUgZHJ5UnVuIHNwZWNpZmljYXRpb25zXG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgICAgd2lkdGg6IDIwMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAxNTBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicyA9IEJ1bGJEaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMTUwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8c3BhbiBjbGFzcz1cImRyeV9ydW5fX3RpbWVcIj48L3NwYW4+JylcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuJGRvbSgpLm9uKCdjbGljaycsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuJGRvbSgpLm9uKCdjbGljaycsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmFkZENoaWxkKHRoaXMuX2RyVGltZURpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuICAgICAgICAgICAgdGhpcy5fdGltZXIgPSBuZXcgVGltZXIoe1xuICAgICAgICAgICAgICBkdXJhdGlvbjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJyksXG4gICAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgICByYXRlOiA0XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuVGljaycsIHRoaXMuX29uRHJ5UnVuVGljayk7XG4gICAgICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuXG4gICAgICAgICAgICAvLyA2LiBDcmVhdGUgdGhlIGRyeVJ1biB2aWV3XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGNsYXNzPSdkcnlfcnVuJz48L2Rpdj5cIik7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkpO1xuXG4gICAgICAgICAgICAvLyA3LiBBZGQgdGhlIGRyeVJ1blZpZXcgdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5WaWV3KTtcblxuICAgICAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJykgPT0gJ25hcnJhdGl2ZScpe1xuXG4gICAgICAgICAgICAvLyAyLiBDcmVhdGUgdGhlIGV4cGVyaW1lbnRhdGlvbiBmb3JtIHRoYXQgY29udGFpbnNcbiAgICAgICAgICAgIC8vIGEuIGV4cGVyaW1lbnQgZGVzY3JpcHRvclxuICAgICAgICAgICAgLy8gYi4gZXhwZXJpbWVudCBzZXR1cFxuICAgICAgICAgICAgLy8gYy4gZXhwZXJpbWVudCBwcm90b2NvbFxuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybSA9IG5ldyBFeHBlcmltZW50TmFycmF0aXZlRm9ybSgpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuU3VibWl0JywgdGhpcy5fb25SdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3RXhwZXJpbWVudFJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZScsIHRoaXMuX29uQWdncmVnYXRlUmVxdWVzdCk7XG5cbiAgICAgICAgICAgIC8vIDMuIEFkZCB0aGUgY29uZmlnRm9ybSBhbmQgZXhwZXJpbWVudFZpZXcgdG8gdGhlIHRhYi5cbiAgICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fY29uZmlnRm9ybS52aWV3KCkpO1xuXG4gICAgICAgICAgICAvLyA0LiBDcmVhdGUgdmlzdWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBleHBlcmltZW50IHByb3RvY29sXG5cbiAgICAgICAgICAgIC8vIDUuIENyZWF0ZSB0aGUgZHJ5UnVuIHNwZWNpZmljYXRpb25zXG4gICAgICAgICAgICB0aGlzLl9leHBWaXpMaWdodHMgPSBbXVxuICAgICAgICAgICAgZm9yICh2YXIgbnVtUGFuZWxzID0gMDsgbnVtUGFuZWxzIDwgNDsgbnVtUGFuZWxzKyspIHtcbiAgICAgICAgICAgICAgbGV0IG5ld0xpZ2h0cyA9IExpZ2h0RGlzcGxheS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwXG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgbmV3TGlnaHRzLnJlbmRlcih7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwXG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgbGV0IF90aW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8ZGl2PicgKyAobnVtUGFuZWxzICsgMSkgKyAnLjxicj4nICsgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpIC8gNC4wKSArICcgc2VjIDwvZGl2PicpO1xuICAgICAgICAgICAgICBsZXQgX2JyaWdodG5lc3NEaXNwbGF5ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGlkPSdleHBfdml6X19icmlnaHRuZXNzJz4gTGlnaHQgPC9kaXY+XCIpO1xuICAgICAgICAgICAgICBuZXdMaWdodHMudmlldygpLmFkZENoaWxkKF90aW1lRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG4gICAgICAgICAgICAgIG5ld0xpZ2h0cy52aWV3KCkuYWRkQ2hpbGQoX2JyaWdodG5lc3NEaXNwbGF5LCAnLmxpZ2h0LWRpc3BsYXlfX2NvbnRlbnQnKTtcblxuICAgICAgICAgICAgICB0aGlzLl9leHBWaXpMaWdodHMucHVzaChuZXdMaWdodHMpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDYuIENyZWF0ZSB0aGUgUmVwcmVzZW50YXRpb24gdmlld1xuICAgICAgICAgICAgdGhpcy5fZXhwVml6ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGNsYXNzPSdleHBfdml6Jz48c3BhbiBpZD0ndGl0bGUnPlZpc3VhbCBSZXByZXNlbnRhdGlvbiBvZiB0aGUgRXhwZXJpbWVudDo8L3NwYW4+PC9kaXY+XCIpO1xuICAgICAgICAgICAgdGhpcy5fZXhwVml6LmFkZENoaWxkKG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0nZXhwX3Zpel9fY29udGFpbmVyJz48L2Rpdj5cIikpO1xuICAgICAgICAgICAgdGhpcy5fZXhwVml6TGlnaHRzLmZvckVhY2goKGxpZ2h0c0Rpc3BsYXkpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fZXhwVml6Ll9jaGlsZHJlblswXS5hZGRDaGlsZChsaWdodHNEaXNwbGF5LnZpZXcoKSlcbiAgICAgICAgICAgIH0sIHRoaXMpXG4gICAgICAgICAgICB0aGlzLl9leHBWaXouYWRkQ2hpbGQobmV3IERvbVZpZXcoXCI8c3Bhbj4gVG90YWwgZHVyYXRpb24gaXMgXCIgKyBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSArIFwiIHNlY29uZHMuIDwvZGl2PlwiKSk7XG5cbiAgICAgICAgICAgIC8vIDcuIEFkZCB0aGUgUmVwcmVzZW50YXRpb24gVmlldyB0byB0aGUgdGFiXG4gICAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2V4cFZpeik7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9yZXBvcnRlciA9IG5ldyBFeHBlcmltZW50UmVwb3J0ZXIoKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50UmVwb3J0ZXIuU2VuZCcsIHRoaXMuX29uUmVzdWx0c1NlbmQpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRSZXBvcnRlci5Eb250U2VuZCcsIHRoaXMuX29uUmVzdWx0c0RvbnRTZW5kKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5oaWRlKCk7XG5cbiAgICAgICAgICB0aGlzLl9zZXRFeHBlcmltZW50TW9kYWxpdHkoKTtcblxuICAgICAgICAgIEhNLmhvb2soJ1BhbmVsLkNvbnRlbnRzJywgdGhpcy5faG9va1BhbmVsQ29udGVudHMsIDkpO1xuICAgICAgICAgIEhNLmhvb2soJ0ludGVyYWN0aXZlVGFicy5MaXN0VGFicycsIHRoaXMuX2hvb2tJbnRlcmFjdGl2ZVRhYnMsIDEwKTtcbiAgICAgICAgICBHbG9iYWxzLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uR2xvYmFsc0NoYW5nZSk7XG5cbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLlVwZGF0ZScsIHRoaXMuX29uU2VydmVyVXBkYXRlKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLlJlc3VsdHMnLCB0aGlzLl9vblNlcnZlclJlc3VsdHMpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHRoaXMuX29uU2VydmVyRmFpbHVyZSk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5BZGQnLHRoaXMuX29uRGlzYWJsZVJlcXVlc3QpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9vbkVuYWJsZVJlcXVlc3QpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25EaXNhYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5tZXNzYWdlLm1hdGNoKCdMb2FkaW5nJykpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5kaXNhYmxlTmV3KCk7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkVuYWJsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKS5tYXRjaCgnY3JlYXRlJykpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5lbmFibGVOZXcoKTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0RXhwZXJpbWVudE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZVwiOlxuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZWFuZGhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tQYW5lbENvbnRlbnRzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLmlkID09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgICAgICBsaXN0LnB1c2godGhpcy5fcmVwb3J0ZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09IFwic3R1ZGVudF9pZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgaWYgKGhpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICBleHBfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2xvYWRFeHBlcmltZW50SW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5wYXRoID09IFwiZXVnbGVuYVNlcnZlck1vZGVcIikge1xuICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUgPT0gXCJkZW1vXCIpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xvYWREZW1vSGlzdG9yeSgpIHtcbiAgICAgIGlmICghR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5JykpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzJywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgIGRlbW86IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoZXhwZXJpbWVudHMpID0+IHtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknLCBleHBlcmltZW50cy5tYXAoKGUpID0+IGUuaWQpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgIH1cblxuICAgIF9sb2FkRXhwZXJpbWVudEluRm9ybShpZCkge1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgbGV0IG9sZElkID0gdGhpcy5fY3VyckV4cElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcblxuICAgICAgICBpZiAoaWQgPT0gXCJfbmV3XCIpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyRXhwSWQgPSBudWxsO1xuICAgICAgICAgICAgLy92YXIgaW1wb3J0UGFyYW1zID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJykgPT0gJ3RhYmxlJyA/IFt7IGxlZnQ6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgdG9wOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IGJvdHRvbTogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyByaWdodDogMTAwLCBkdXJhdGlvbjogMTUgfV0gOiBbXTtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmltcG9ydCh7XG4gICAgICAgICAgICBsaWdodHM6IFt7IGxlZnQ6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgdG9wOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IGJvdHRvbTogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyByaWdodDogMTAwLCBkdXJhdGlvbjogMTUgfV1cbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uc2V0U3RhdGUoJ25ldycpXG4gICAgICAgICAgICBpZiAodGhpcy5fZHJ5UnVuVmlldykge1xuICAgICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLnNob3coKTtcbiAgICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnQuTG9hZGVkJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50OiB7XG4gICAgICAgICAgICAgICAgaWQ6IFwiX25ld1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyRXhwSWQgPSBpZDtcbiAgICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FeHBlcmltZW50cy8ke2lkfWApXG4gICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaW1wb3J0KFxuICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHt9LFxuICAgICAgICAgICAgICAgIGRhdGEuZXhwRm9ybSxcbiAgICAgICAgICAgICAgICB7IGxpZ2h0czogZGF0YS5jb25maWd1cmF0aW9uIH1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5zZXRTdGF0ZSgnaGlzdG9yaWNhbCcpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RyeVJ1blZpZXcpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50LkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgZXhwZXJpbWVudDogZGF0YVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50RXhwZXJpbWVudCcsIGRhdGEpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJsb2FkXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogaWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tJbnRlcmFjdGl2ZVRhYnMobGlzdCwgbWV0YSkge1xuICAgICAgbGlzdC5wdXNoKHtcbiAgICAgICAgaWQ6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICB0aXRsZTogXCJFeHBlcmltZW50XCIsXG4gICAgICAgIHRhYlR5cGU6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICBjb250ZW50OiB0aGlzLl90YWJWaWV3XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAndGFibGUnKXtcbiAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAnbmFycmF0aXZlJyl7XG5cbiAgICAgICAgdmFyIGxpZ2h0Q29uZmlnID0gdGhpcy5fY29uZmlnRm9ybS5nZXRMaWdodENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgdmFyIGxpZ2h0TGV2ZWxzID0geyctMSc6ICcnLCAnMCc6ICdvZmYnLCAnMjUnOiAnZGltJywgJzUwJzogJ21lZGl1bScsICc3NSc6ICdicmlnaHQnLCAnMTAwJzogJ3YuIGJyaWdodCd9O1xuXG4gICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgdGhpcy5fZXhwVml6Ll9jaGlsZHJlblswXS5fY2hpbGRyZW5bcGFuZWxdLnJlbmRlcihsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdKVxuICAgICAgICAgIHRoaXMuX2V4cFZpei5fY2hpbGRyZW5bMF0uX2NoaWxkcmVuW3BhbmVsXS4kZWwuZmluZCgnI2V4cF92aXpfX2JyaWdodG5lc3MnKS5odG1sKGxpZ2h0TGV2ZWxzW2xpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblJ1blJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fZHJ5UnVuTGlnaHRzICYgdGhpcy5fZHJ5UnVuQnVsYnMpIHsgdGhpcy5fcmVzZXREcnlSdW4oKTsgfVxuICAgICAgdGhpcy5fY29uZmlnRm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIuc2V0RnVsbHNjcmVlbih0aGlzLl9oaXN0b3J5Lmhpc3RvcnlDb3VudCgpID09IDApXG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnNob3coKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5FeHBlcmltZW50UmVxdWVzdCcsIHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KCkpOyAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwiZXhwZXJpbWVudF9zdWJtaXNzaW9uXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX2hpc3RvcnkucmV2ZXJ0VG9MYXN0SGlzdG9yeSgpO1xuICAgICAgICB0aGlzLl9jb25maWdGb3JtLmRpc2FibGVOZXcoKTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlTmV3KCk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRfZm9ybV9lcnJvclwiLFxuICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICBtZXNzYWdlOiBlcnIudmFsaWRhdGlvbi5lcnJvcnMuam9pbignPGJyLz4nKSxcbiAgICAgICAgICBhdXRvRXhwaXJlOiAxMCxcbiAgICAgICAgICBleHBpcmVMYWJlbDogXCJHb3QgaXRcIlxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OZXdFeHBlcmltZW50UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICB9XG5cbiAgICBfb25BZ2dyZWdhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgRXVnVXRpbHMuZ2V0TGl2ZVJlc3VsdHModGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFkZF9hZ2dyZWdhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiB0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uRHJ5UnVuUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl9maXJzdERyeVJ1bikge1xuICAgICAgICB0aGlzLl9kcnlSdW5EYXRhID0gdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKS5saWdodHM7XG4gICAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG4gICAgICAgIHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuX2ZpcnN0RHJ5UnVuID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5fdGltZXIuYWN0aXZlKCkpIHtcbiAgICAgICAgICB0aGlzLl90aW1lci5wYXVzZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfcmVzZXREcnlSdW4oKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICB0aGlzLl9kcnlSdW5MaWdodHMucmVuZGVyKHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICB9KVxuICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMucmVuZGVyKHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICB9KVxuICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheS4kZG9tKCkuaHRtbCgnJyk7XG4gICAgfVxuXG4gICAgX29uRHJ5UnVuVGljayhldnQpIHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLl90aW1lci50aW1lKCk7XG4gICAgICB0aGlzLl9kcnlSdW5MaWdodHMucmVuZGVyKEV1Z1V0aWxzLmdldExpZ2h0U3RhdGUodGhpcy5fZHJ5UnVuRGF0YSwgdGltZSkpXG4gICAgICB0aGlzLl9kcnlSdW5CdWxicy5yZW5kZXIoRXVnVXRpbHMuZ2V0TGlnaHRTdGF0ZSh0aGlzLl9kcnlSdW5EYXRhLCB0aW1lKSlcbiAgICAgIHRoaXMuX2RyVGltZURpc3BsYXkuJGRvbSgpLmh0bWwoVXRpbHMuc2Vjb25kc1RvVGltZVN0cmluZyh0aW1lKSk7XG4gICAgfVxuXG4gICAgX29uU2VydmVyVXBkYXRlKGV2dCkge1xuICAgICAgdGhpcy5fcmVwb3J0ZXIudXBkYXRlKGV2dC5kYXRhKTtcbiAgICB9XG4gICAgX29uU2VydmVyUmVzdWx0cyhldnQpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKTtcbiAgICAgICAgaWYgKGhpc3QubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICB0aGlzLl9vblJlc3VsdHNTZW5kKHtcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQ6IHtcbiAgICAgICAgICAgICAgcmVzdWx0czogZXZ0LmRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci51cGRhdGUoeyBzdGF0dXM6IFwiY29tcGxldGVcIiwgcmVzdWx0czogZXZ0LmRhdGEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25TZXJ2ZXJGYWlsdXJlKGV2dCkge1xuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgIH1cblxuICAgIF9vblJlc3VsdHNTZW5kKGV2dCkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHNcbiAgICAgIGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHMgPSBudWxsO1xuICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICBleHBfaGlzdG9yeV9pZDogcmVzdWx0cy5leHBlcmltZW50SWRcbiAgICAgIH0pXG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3NlbmRfcmVzdWx0JyxcbiAgICAgICAgY2F0ZWdvcnk6ICdleHBlcmltZW50JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogcmVzdWx0cy5leHBlcmltZW50SWQsXG4gICAgICAgICAgcmVzdWx0SWQ6IHJlc3VsdHMuaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgX3Jlc3VsdENsZWFudXAoKSB7XG4gICAgICB0aGlzLl9yZXBvcnRlci5oaWRlKCk7XG4gICAgICB0aGlzLl9jb25maWdGb3JtLmVuYWJsZU5ldygpO1xuICAgICAgdGhpcy5faGlzdG9yeS5lbmFibGVOZXcoKTtcbiAgICB9XG5cbiAgICBfb25SZXN1bHRzRG9udFNlbmQoZXZ0KSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0c1xuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdkb250X3NlbmRfcmVzdWx0JyxcbiAgICAgICAgY2F0ZWdvcnk6ICdleHBlcmltZW50JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogcmVzdWx0cy5leHBlcmltZW50SWQsXG4gICAgICAgICAgcmVzdWx0SWQ6IHJlc3VsdHMuaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IGV4cF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgRXhwZXJpbWVudE1vZHVsZS5yZXF1aXJlcyA9IFtTZXJ2ZXJJbnRlcmZhY2VdO1xuICByZXR1cm4gRXhwZXJpbWVudE1vZHVsZTtcbn0pXG4iXX0=
