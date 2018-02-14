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

      Utils.bindMethods(_this, ['_hookInteractiveTabs', '_onRunRequest', '_onGlobalsChange', '_onHistorySelectionChange', '_onDryRunRequest', '_onDryRunTick', '_onConfigChange', '_onNewExperimentRequest', '_onAggregateRequest', '_hookPanelContents', '_onServerUpdate', '_onServerResults', '_onServerFailure', '_onResultsDontSend', '_onResultsSend', '_onPhaseChange']);

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
                  width: 75,
                  height: 75
                });

                newLights.render({
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0
                });

                var _timeDisplay = new DomView('<div>' + (numPanels + 1) + '.<br>' + Globals.get('AppConfig.experiment.maxDuration') * numPanels / 4.0 + ' - ' + Globals.get('AppConfig.experiment.maxDuration') * (numPanels + 1) / 4.0 + ' sec </div>');
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
          });
        } else {
          return _get(ExperimentModule.prototype.__proto__ || Object.getPrototypeOf(ExperimentModule.prototype), 'init', this).call(this);
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
            var importParams = Globals.get('AppConfig.experiment.experimentForm') == 'table' ? [{ left: 100, duration: 15 }, { top: 100, duration: 15 }, { bottom: 100, duration: 15 }, { right: 100, duration: 15 }] : [];
            this._configForm.import({
              lights: importParams
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
          var lightLevels = { '-1': '', '0': 'off', '25': 'dim', '50': 'medium', '75': 'bright', '100': 'very bright' };

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50VGFibGVGb3JtIiwiRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0iLCJVdGlscyIsIkxpZ2h0RGlzcGxheSIsIkJ1bGJEaXNwbGF5IiwiSGlzdG9yeUZvcm0iLCJEb21WaWV3IiwiU2VydmVySW50ZXJmYWNlIiwiVGltZXIiLCJFdWdVdGlscyIsIkV4cGVyaW1lbnRSZXBvcnRlciIsIkV4cGVyaW1lbnRNb2R1bGUiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsInByb21pc2UiLCJfbG9hZERlbW9IaXN0b3J5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwic3RhdGljSGlzdG9yeSIsInNldCIsIl9oaXN0b3J5IiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl90YWJWaWV3IiwiYWRkQ2hpbGQiLCJ2aWV3IiwiX2NvbmZpZ0Zvcm0iLCJfb25Db25maWdDaGFuZ2UiLCJfb25EcnlSdW5SZXF1ZXN0IiwiX29uUnVuUmVxdWVzdCIsIl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9kcnlSdW5MaWdodHMiLCJjcmVhdGUiLCJ3aWR0aCIsImhlaWdodCIsIl9kcnlSdW5CdWxicyIsIl9kclRpbWVEaXNwbGF5IiwiJGRvbSIsIm9uIiwiX3RpbWVyIiwiZHVyYXRpb24iLCJsb29wIiwicmF0ZSIsIl9vbkRyeVJ1blRpY2siLCJfcmVzZXREcnlSdW4iLCJfZHJ5UnVuVmlldyIsIl9leHBWaXpMaWdodHMiLCJudW1QYW5lbHMiLCJuZXdMaWdodHMiLCJyZW5kZXIiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJfdGltZURpc3BsYXkiLCJfYnJpZ2h0bmVzc0Rpc3BsYXkiLCJwdXNoIiwiX2V4cFZpeiIsImZvckVhY2giLCJsaWdodHNEaXNwbGF5IiwiX2NoaWxkcmVuIiwiX3JlcG9ydGVyIiwiX29uUmVzdWx0c1NlbmQiLCJfb25SZXN1bHRzRG9udFNlbmQiLCJoaWRlIiwiX3NldEV4cGVyaW1lbnRNb2RhbGl0eSIsImhvb2siLCJfaG9va1BhbmVsQ29udGVudHMiLCJfaG9va0ludGVyYWN0aXZlVGFicyIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25TZXJ2ZXJVcGRhdGUiLCJfb25TZXJ2ZXJSZXN1bHRzIiwiX29uU2VydmVyRmFpbHVyZSIsInRvTG93ZXJDYXNlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJsaXN0IiwibWV0YSIsImlkIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsImV4cF9oaXN0b3J5X2lkIiwiX2xvYWRFeHBlcmltZW50SW5Gb3JtIiwiZXhwb3J0IiwidmFsdWUiLCJwcm9taXNlQWpheCIsImZpbHRlciIsIndoZXJlIiwiZGVtbyIsImV4cGVyaW1lbnRzIiwibWFwIiwiZSIsImN1cnJlbnRUYXJnZXQiLCJvbGRJZCIsIl9jdXJyRXhwSWQiLCJ0YXJnZXQiLCJpbXBvcnRQYXJhbXMiLCJsaWdodHMiLCJzZXRTdGF0ZSIsInNob3ciLCJkaXNwYXRjaEV2ZW50IiwiZXhwZXJpbWVudCIsIk9iamVjdCIsImFzc2lnbiIsImV4cEZvcm0iLCJjb25maWd1cmF0aW9uIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZXhwZXJpbWVudElkIiwidGl0bGUiLCJ0YWJUeXBlIiwiY29udGVudCIsIl9maXJzdERyeVJ1biIsImxpZ2h0Q29uZmlnIiwiZ2V0TGlnaHRDb25maWd1cmF0aW9uIiwibGlnaHRMZXZlbHMiLCJwYW5lbCIsIiRlbCIsImZpbmQiLCJodG1sIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwicmVzZXQiLCJzZXRGdWxsc2NyZWVuIiwiaGlzdG9yeUNvdW50IiwicmV2ZXJ0VG9MYXN0SGlzdG9yeSIsImRpc2FibGVOZXciLCJjYXRjaCIsImVyciIsIm1lc3NhZ2UiLCJlcnJvcnMiLCJqb2luIiwiYXV0b0V4cGlyZSIsImV4cGlyZUxhYmVsIiwiZ2V0TGl2ZVJlc3VsdHMiLCJyZXN1bHRzIiwiX2RyeVJ1bkRhdGEiLCJzdGFydCIsImFjdGl2ZSIsInBhdXNlIiwic3RvcCIsInRpbWUiLCJnZXRMaWdodFN0YXRlIiwic2Vjb25kc1RvVGltZVN0cmluZyIsInN0YXR1cyIsIl9yZXN1bHRDbGVhbnVwIiwicmVzdWx0SWQiLCJlbmFibGVOZXciLCJwaGFzZSIsInJlcXVpcmVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQO0FBQUEsTUFHRUksc0JBQXNCSixRQUFRLG1CQUFSLENBSHhCO0FBQUEsTUFJRUssMEJBQTBCTCxRQUFRLHVCQUFSLENBSjVCO0FBQUEsTUFLRU0sUUFBUU4sUUFBUSxpQkFBUixDQUxWO0FBQUEsTUFNRU8sZUFBZVAsUUFBUSw2Q0FBUixDQU5qQjtBQUFBLE1BT0VRLGNBQWNSLFFBQVEsMkNBQVIsQ0FQaEI7QUFBQSxNQVFFUyxjQUFjVCxRQUFRLGdCQUFSLENBUmhCO0FBQUEsTUFTRVUsVUFBVVYsUUFBUSxvQkFBUixDQVRaO0FBQUEsTUFVRVcsa0JBQWtCWCxRQUFRLDBCQUFSLENBVnBCO0FBQUEsTUFXRVksUUFBUVosUUFBUSxpQkFBUixDQVhWO0FBQUEsTUFZRWEsV0FBV2IsUUFBUSxlQUFSLENBWmI7QUFBQSxNQWFFYyxxQkFBcUJkLFFBQVEscUJBQVIsQ0FidkI7O0FBZ0JBQSxVQUFRLGtCQUFSOztBQWpCa0IsTUFtQlplLGdCQW5CWTtBQUFBOztBQW9CaEIsZ0NBQWM7QUFBQTs7QUFBQTs7QUFFWlQsWUFBTVUsV0FB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QUFoY2U7QUFBQTtBQUFBLHlDQWtjRzNFLEdBbGNILEVBa2NRO0FBQ3RCLFlBQU0rRCxVQUFVL0QsSUFBSW1CLGFBQUosQ0FBa0I0QyxPQUFsQztBQUNBLGFBQUtVLGNBQUw7QUFDQTdKLGdCQUFRZSxHQUFSLENBQVksUUFBWixFQUFzQnNHLEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxrQkFEa0I7QUFFeEJDLG9CQUFVLFlBRmM7QUFHeEJsQyxnQkFBTTtBQUNKbUMsMEJBQWMyQixRQUFRM0IsWUFEbEI7QUFFSnNDLHNCQUFVWCxRQUFRaEU7QUFGZDtBQUhrQixTQUExQjtBQVFEO0FBN2NlO0FBQUE7QUFBQSxxQ0ErY0RDLEdBL2NDLEVBK2NJO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBUzJFLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkI1RSxJQUFJQyxJQUFKLENBQVMyRSxLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLdkksUUFBTCxDQUFja0UsTUFBZCxDQUFxQixFQUFFQyxnQkFBZ0IsTUFBbEIsRUFBckI7QUFDRDtBQUNGO0FBbmRlOztBQUFBO0FBQUEsSUFtQmE3RixNQW5CYjs7QUFzZGxCYyxtQkFBaUJvSixRQUFqQixHQUE0QixDQUFDeEosZUFBRCxDQUE1QjtBQUNBLFNBQU9JLGdCQUFQO0FBQ0QsQ0F4ZEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBFeHBlcmltZW50VGFibGVGb3JtID0gcmVxdWlyZSgnLi9mb3JtX3RhYmxlL2Zvcm0nKSxcbiAgICBFeHBlcmltZW50TmFycmF0aXZlRm9ybSA9IHJlcXVpcmUoJy4vZm9ybV9uYXJyYXRpdmUvZm9ybScpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgTGlnaHREaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvbGlnaHRkaXNwbGF5L2xpZ2h0ZGlzcGxheScpLFxuICAgIEJ1bGJEaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvYnVsYmRpc3BsYXkvYnVsYmRpc3BsYXknKSxcbiAgICBIaXN0b3J5Rm9ybSA9IHJlcXVpcmUoJy4vaGlzdG9yeS9mb3JtJyksXG4gICAgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFNlcnZlckludGVyZmFjZSA9IHJlcXVpcmUoJy4vc2VydmVyaW50ZXJmYWNlL21vZHVsZScpLFxuICAgIFRpbWVyID0gcmVxdWlyZSgnY29yZS91dGlsL3RpbWVyJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJyksXG4gICAgRXhwZXJpbWVudFJlcG9ydGVyID0gcmVxdWlyZSgnLi9yZXBvcnRlci9yZXBvcnRlcicpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgY2xhc3MgRXhwZXJpbWVudE1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX2hvb2tJbnRlcmFjdGl2ZVRhYnMnLCAnX29uUnVuUmVxdWVzdCcsICdfb25HbG9iYWxzQ2hhbmdlJyxcbiAgICAgICAgJ19vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UnLCAnX29uRHJ5UnVuUmVxdWVzdCcsICdfb25EcnlSdW5UaWNrJyxcbiAgICAgICAgJ19vbkNvbmZpZ0NoYW5nZScsICdfb25OZXdFeHBlcmltZW50UmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19ob29rUGFuZWxDb250ZW50cycsICdfb25TZXJ2ZXJVcGRhdGUnLCAnX29uU2VydmVyUmVzdWx0cycsICdfb25TZXJ2ZXJGYWlsdXJlJyxcbiAgICAgICAgJ19vblJlc3VsdHNEb250U2VuZCcsICdfb25SZXN1bHRzU2VuZCcsICdfb25QaGFzZUNoYW5nZSdcbiAgICAgIF0pO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudCcpKSB7XG4gICAgICAgIGxldCBwcm9taXNlO1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV1Z2xlbmFTZXJ2ZXJNb2RlJykgPT0gXCJkZW1vXCIpIHtcbiAgICAgICAgICBwcm9taXNlID0gdGhpcy5fbG9hZERlbW9IaXN0b3J5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0aWNIaXN0b3J5ID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5Jyk7XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBzdGF0aWNIaXN0b3J5ID8gZmFsc2UgOiB0cnVlKVxuXG4gICAgICAgICAgLy8gMS4gQ3JlYXRlIHRoZSBoaXN0b3J5IGZvcm1cbiAgICAgICAgICB0aGlzLl9oaXN0b3J5ID0gbmV3IEhpc3RvcnlGb3JtKCk7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG5cbiAgICAgICAgICAvLyAyLiBDcmVhdGUgdGhlIHRhYiBhbmQgYWRkIHRoZSBoaXN0b3J5IGZvcm0gdG8gaXQuXG4gICAgICAgICAgdGhpcy5fdGFiVmlldyA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0ndGFiX19leHBlcmltZW50Jz48L2Rpdj5cIik7XG4gICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG5cbiAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKG5ldyBEb21WaWV3KFwiPGRpdiBpZD0nZXhwUHJvdG9jb2xfX3RpdGxlJz4gRXhwZXJpbWVudCBQcm90b2NvbDogPC9kaXY+XCIpKTtcblxuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKT09J3RhYmxlJykge1xuXG4gICAgICAgICAgICAvLyAzLiBDcmVhdGUgdGhlIGV4cGVyaW1lbnRhdGlvbiBmb3JtXG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtID0gbmV3IEV4cGVyaW1lbnRUYWJsZUZvcm0oKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkRyeVJ1bicsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LlN1Ym1pdCcsIHRoaXMuX29uUnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Lk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgICAvLyA0LiBBZGQgdGhlIGNvbmZpZ0Zvcm0gdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9jb25maWdGb3JtLnZpZXcoKSk7XG5cbiAgICAgICAgICAgIC8vIDUuIENyZWF0ZSB0aGUgZHJ5UnVuIHNwZWNpZmljYXRpb25zXG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgICAgd2lkdGg6IDIwMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAxNTBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicyA9IEJ1bGJEaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMTUwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8c3BhbiBjbGFzcz1cImRyeV9ydW5fX3RpbWVcIj48L3NwYW4+JylcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuJGRvbSgpLm9uKCdjbGljaycsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuJGRvbSgpLm9uKCdjbGljaycsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmFkZENoaWxkKHRoaXMuX2RyVGltZURpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuICAgICAgICAgICAgdGhpcy5fdGltZXIgPSBuZXcgVGltZXIoe1xuICAgICAgICAgICAgICBkdXJhdGlvbjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJyksXG4gICAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgICByYXRlOiA0XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuVGljaycsIHRoaXMuX29uRHJ5UnVuVGljayk7XG4gICAgICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuXG4gICAgICAgICAgICAvLyA2LiBDcmVhdGUgdGhlIGRyeVJ1biB2aWV3XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGNsYXNzPSdkcnlfcnVuJz48L2Rpdj5cIik7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkpO1xuXG4gICAgICAgICAgICAvLyA3LiBBZGQgdGhlIGRyeVJ1blZpZXcgdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5WaWV3KTtcblxuICAgICAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJykgPT0gJ25hcnJhdGl2ZScpe1xuXG4gICAgICAgICAgICAvLyAyLiBDcmVhdGUgdGhlIGV4cGVyaW1lbnRhdGlvbiBmb3JtIHRoYXQgY29udGFpbnNcbiAgICAgICAgICAgIC8vIGEuIGV4cGVyaW1lbnQgZGVzY3JpcHRvclxuICAgICAgICAgICAgLy8gYi4gZXhwZXJpbWVudCBzZXR1cFxuICAgICAgICAgICAgLy8gYy4gZXhwZXJpbWVudCBwcm90b2NvbFxuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybSA9IG5ldyBFeHBlcmltZW50TmFycmF0aXZlRm9ybSgpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuU3VibWl0JywgdGhpcy5fb25SdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3RXhwZXJpbWVudFJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZScsIHRoaXMuX29uQWdncmVnYXRlUmVxdWVzdCk7XG5cbiAgICAgICAgICAgIC8vIDMuIEFkZCB0aGUgY29uZmlnRm9ybSBhbmQgZXhwZXJpbWVudFZpZXcgdG8gdGhlIHRhYi5cbiAgICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fY29uZmlnRm9ybS52aWV3KCkpO1xuXG4gICAgICAgICAgICAvLyA0LiBDcmVhdGUgdmlzdWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBleHBlcmltZW50IHByb3RvY29sXG5cbiAgICAgICAgICAgIC8vIDUuIENyZWF0ZSB0aGUgZHJ5UnVuIHNwZWNpZmljYXRpb25zXG4gICAgICAgICAgICB0aGlzLl9leHBWaXpMaWdodHMgPSBbXVxuICAgICAgICAgICAgZm9yICh2YXIgbnVtUGFuZWxzID0gMDsgbnVtUGFuZWxzIDwgNDsgbnVtUGFuZWxzKyspIHtcbiAgICAgICAgICAgICAgbGV0IG5ld0xpZ2h0cyA9IExpZ2h0RGlzcGxheS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIHdpZHRoOiA3NSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDc1XG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgbmV3TGlnaHRzLnJlbmRlcih7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwXG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgbGV0IF90aW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8ZGl2PicgKyAobnVtUGFuZWxzICsgMSkgKyAnLjxicj4nICsgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpICogbnVtUGFuZWxzIC8gNC4wKSArICcgLSAnICsgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpICogKG51bVBhbmVscyArIDEgKSAvIDQuMCkgKyAnIHNlYyA8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgbGV0IF9icmlnaHRuZXNzRGlzcGxheSA9IG5ldyBEb21WaWV3KFwiPGRpdiBpZD0nZXhwX3Zpel9fYnJpZ2h0bmVzcyc+IExpZ2h0IDwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgbmV3TGlnaHRzLnZpZXcoKS5hZGRDaGlsZChfdGltZURpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuICAgICAgICAgICAgICBuZXdMaWdodHMudmlldygpLmFkZENoaWxkKF9icmlnaHRuZXNzRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG5cbiAgICAgICAgICAgICAgdGhpcy5fZXhwVml6TGlnaHRzLnB1c2gobmV3TGlnaHRzKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA2LiBDcmVhdGUgdGhlIFJlcHJlc2VudGF0aW9uIHZpZXdcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpeiA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0nZXhwX3Zpeic+PHNwYW4gaWQ9J3RpdGxlJz5WaXN1YWwgUmVwcmVzZW50YXRpb24gb2YgdGhlIEV4cGVyaW1lbnQ6PC9zcGFuPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpei5hZGRDaGlsZChuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2V4cF92aXpfX2NvbnRhaW5lcic+PC9kaXY+XCIpKTtcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpekxpZ2h0cy5mb3JFYWNoKChsaWdodHNEaXNwbGF5KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2V4cFZpei5fY2hpbGRyZW5bMF0uYWRkQ2hpbGQobGlnaHRzRGlzcGxheS52aWV3KCkpXG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICAgICAgdGhpcy5fZXhwVml6LmFkZENoaWxkKG5ldyBEb21WaWV3KFwiPHNwYW4+IFRvdGFsIGR1cmF0aW9uIGlzIFwiICsgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJykgKyBcIiBzZWNvbmRzLiA8L2Rpdj5cIikpO1xuXG4gICAgICAgICAgICAvLyA3LiBBZGQgdGhlIFJlcHJlc2VudGF0aW9uIFZpZXcgdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9leHBWaXopO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIgPSBuZXcgRXhwZXJpbWVudFJlcG9ydGVyKCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLlNlbmQnLCB0aGlzLl9vblJlc3VsdHNTZW5kKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50UmVwb3J0ZXIuRG9udFNlbmQnLCB0aGlzLl9vblJlc3VsdHNEb250U2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuXG4gICAgICAgICAgdGhpcy5fc2V0RXhwZXJpbWVudE1vZGFsaXR5KCk7XG5cbiAgICAgICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIHRoaXMuX2hvb2tQYW5lbENvbnRlbnRzLCA5KTtcbiAgICAgICAgICBITS5ob29rKCdJbnRlcmFjdGl2ZVRhYnMuTGlzdFRhYnMnLCB0aGlzLl9ob29rSW50ZXJhY3RpdmVUYWJzLCAxMCk7XG4gICAgICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCB0aGlzLl9vblNlcnZlclVwZGF0ZSk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgdGhpcy5fb25TZXJ2ZXJSZXN1bHRzKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB0aGlzLl9vblNlcnZlckZhaWx1cmUpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0RXhwZXJpbWVudE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZUFuZEhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tQYW5lbENvbnRlbnRzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLmlkID09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgICAgICBsaXN0LnB1c2godGhpcy5fcmVwb3J0ZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09IFwic3R1ZGVudF9pZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgaWYgKGhpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICBleHBfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2xvYWRFeHBlcmltZW50SW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5wYXRoID09IFwiZXVnbGVuYVNlcnZlck1vZGVcIikge1xuICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUgPT0gXCJkZW1vXCIpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xvYWREZW1vSGlzdG9yeSgpIHtcbiAgICAgIGlmICghR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5JykpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzJywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgIGRlbW86IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoZXhwZXJpbWVudHMpID0+IHtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknLCBleHBlcmltZW50cy5tYXAoKGUpID0+IGUuaWQpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgIH1cblxuICAgIF9sb2FkRXhwZXJpbWVudEluRm9ybShpZCkge1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgbGV0IG9sZElkID0gdGhpcy5fY3VyckV4cElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkID09IFwiX25ld1wiKSB7XG4gICAgICAgICAgdGhpcy5fY3VyckV4cElkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBpbXBvcnRQYXJhbXMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAndGFibGUnID8gW3sgbGVmdDogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyB0b3A6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgYm90dG9tOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IHJpZ2h0OiAxMDAsIGR1cmF0aW9uOiAxNSB9XSA6IFtdO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaW1wb3J0KHtcbiAgICAgICAgICAgIGxpZ2h0czogaW1wb3J0UGFyYW1zXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCduZXcnKVxuICAgICAgICAgICAgaWYgKHRoaXMuX2RyeVJ1blZpZXcpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50LkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgZXhwZXJpbWVudDoge1xuICAgICAgICAgICAgICAgIGlkOiBcIl9uZXdcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fY3VyckV4cElkID0gaWQ7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXhwZXJpbWVudHMvJHtpZH1gKVxuICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmltcG9ydChcbiAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih7fSxcbiAgICAgICAgICAgICAgICBkYXRhLmV4cEZvcm0sXG4gICAgICAgICAgICAgICAgeyBsaWdodHM6IGRhdGEuY29uZmlndXJhdGlvbiB9XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uc2V0U3RhdGUoJ2hpc3RvcmljYWwnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kcnlSdW5WaWV3KSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudEV4cGVyaW1lbnQnLCBkYXRhKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibG9hZFwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBleHBlcmltZW50SWQ6IGlkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rSW50ZXJhY3RpdmVUYWJzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGxpc3QucHVzaCh7XG4gICAgICAgIGlkOiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgdGl0bGU6IFwiRXhwZXJpbWVudFwiLFxuICAgICAgICB0YWJUeXBlOiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgY29udGVudDogdGhpcy5fdGFiVmlld1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJykgPT0gJ3RhYmxlJyl7XG4gICAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG4gICAgICAgIHRoaXMuX2ZpcnN0RHJ5UnVuID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJykgPT0gJ25hcnJhdGl2ZScpe1xuICAgICAgICB2YXIgbGlnaHRDb25maWcgPSB0aGlzLl9jb25maWdGb3JtLmdldExpZ2h0Q29uZmlndXJhdGlvbigpO1xuICAgICAgICB2YXIgbGlnaHRMZXZlbHMgPSB7Jy0xJzogJycsICcwJzogJ29mZicsICcyNSc6ICdkaW0nLCAnNTAnOiAnbWVkaXVtJywgJzc1JzogJ2JyaWdodCcsICcxMDAnOiAndmVyeSBicmlnaHQnfTtcblxuICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgIHRoaXMuX2V4cFZpei5fY2hpbGRyZW5bMF0uX2NoaWxkcmVuW3BhbmVsXS5yZW5kZXIobGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXSlcbiAgICAgICAgICB0aGlzLl9leHBWaXouX2NoaWxkcmVuWzBdLl9jaGlsZHJlbltwYW5lbF0uJGVsLmZpbmQoJyNleHBfdml6X19icmlnaHRuZXNzJykuaHRtbChsaWdodExldmVsc1tsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25SdW5SZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKHRoaXMuX2RyeVJ1bkxpZ2h0cyAmIHRoaXMuX2RyeVJ1bkJ1bGJzKSB7IHRoaXMuX3Jlc2V0RHJ5UnVuKCk7IH1cbiAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnNldEZ1bGxzY3JlZW4odGhpcy5faGlzdG9yeS5oaXN0b3J5Q291bnQoKSA9PSAwKVxuICAgICAgICB0aGlzLl9yZXBvcnRlci5zaG93KCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRXhwZXJpbWVudFJlcXVlc3QnLCB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpKTsgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcImV4cGVyaW1lbnRfc3VibWlzc2lvblwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnJldmVydFRvTGFzdEhpc3RvcnkoKTtcbiAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5kaXNhYmxlTmV3KCk7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZU5ldygpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50X2Zvcm1fZXJyb3JcIixcbiAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZTogZXJyLnZhbGlkYXRpb24uZXJyb3JzLmpvaW4oJzxici8+JyksXG4gICAgICAgICAgYXV0b0V4cGlyZTogMTAsXG4gICAgICAgICAgZXhwaXJlTGFiZWw6IFwiR290IGl0XCJcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmV3RXhwZXJpbWVudFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IGV4cF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgfVxuXG4gICAgX29uQWdncmVnYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIEV1Z1V0aWxzLmdldExpdmVSZXN1bHRzKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5BZGRSZXF1ZXN0Jywge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdHNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJhZGRfYWdncmVnYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkRyeVJ1blJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fZmlyc3REcnlSdW4pIHtcbiAgICAgICAgdGhpcy5fZHJ5UnVuRGF0YSA9IHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KCkubGlnaHRzO1xuICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB0aGlzLl9maXJzdERyeVJ1biA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIucGF1c2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3Jlc2V0RHJ5UnVuKCkge1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnJlbmRlcih7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMFxuICAgICAgfSlcbiAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnJlbmRlcih7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMFxuICAgICAgfSlcbiAgICAgIHRoaXMuX2RyVGltZURpc3BsYXkuJGRvbSgpLmh0bWwoJycpO1xuICAgIH1cblxuICAgIF9vbkRyeVJ1blRpY2soZXZ0KSB7XG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5fdGltZXIudGltZSgpO1xuICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnJlbmRlcihFdWdVdGlscy5nZXRMaWdodFN0YXRlKHRoaXMuX2RyeVJ1bkRhdGEsIHRpbWUpKVxuICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMucmVuZGVyKEV1Z1V0aWxzLmdldExpZ2h0U3RhdGUodGhpcy5fZHJ5UnVuRGF0YSwgdGltZSkpXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKFV0aWxzLnNlY29uZHNUb1RpbWVTdHJpbmcodGltZSkpO1xuICAgIH1cblxuICAgIF9vblNlcnZlclVwZGF0ZShldnQpIHtcbiAgICAgIHRoaXMuX3JlcG9ydGVyLnVwZGF0ZShldnQuZGF0YSk7XG4gICAgfVxuICAgIF9vblNlcnZlclJlc3VsdHMoZXZ0KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KCk7XG4gICAgICAgIGlmIChoaXN0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgdGhpcy5fb25SZXN1bHRzU2VuZCh7XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0OiB7XG4gICAgICAgICAgICAgIHJlc3VsdHM6IGV2dC5kYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIudXBkYXRlKHsgc3RhdHVzOiBcImNvbXBsZXRlXCIsIHJlc3VsdHM6IGV2dC5kYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgX29uU2VydmVyRmFpbHVyZShldnQpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICB9XG5cbiAgICBfb25SZXN1bHRzU2VuZChldnQpIHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzXG4gICAgICBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzID0gbnVsbDtcbiAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgZXhwX2hpc3RvcnlfaWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkXG4gICAgICB9KVxuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdzZW5kX3Jlc3VsdCcsXG4gICAgICAgIGNhdGVnb3J5OiAnZXhwZXJpbWVudCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkLFxuICAgICAgICAgIHJlc3VsdElkOiByZXN1bHRzLmlkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIF9yZXN1bHRDbGVhbnVwKCkge1xuICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuICAgICAgdGhpcy5fY29uZmlnRm9ybS5lbmFibGVOZXcoKTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuZW5hYmxlTmV3KCk7XG4gICAgfVxuXG4gICAgX29uUmVzdWx0c0RvbnRTZW5kKGV2dCkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHNcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAnZG9udF9zZW5kX3Jlc3VsdCcsXG4gICAgICAgIGNhdGVnb3J5OiAnZXhwZXJpbWVudCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkLFxuICAgICAgICAgIHJlc3VsdElkOiByZXN1bHRzLmlkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBleHBfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEV4cGVyaW1lbnRNb2R1bGUucmVxdWlyZXMgPSBbU2VydmVySW50ZXJmYWNlXTtcbiAgcmV0dXJuIEV4cGVyaW1lbnRNb2R1bGU7XG59KVxuIl19
