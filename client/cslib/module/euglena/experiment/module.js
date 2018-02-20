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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50VGFibGVGb3JtIiwiRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0iLCJVdGlscyIsIkxpZ2h0RGlzcGxheSIsIkJ1bGJEaXNwbGF5IiwiSGlzdG9yeUZvcm0iLCJEb21WaWV3IiwiU2VydmVySW50ZXJmYWNlIiwiVGltZXIiLCJFdWdVdGlscyIsIkV4cGVyaW1lbnRSZXBvcnRlciIsIkV4cGVyaW1lbnRNb2R1bGUiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsInByb21pc2UiLCJfbG9hZERlbW9IaXN0b3J5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwic3RhdGljSGlzdG9yeSIsInNldCIsIl9oaXN0b3J5IiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl90YWJWaWV3IiwiYWRkQ2hpbGQiLCJ2aWV3IiwiX2NvbmZpZ0Zvcm0iLCJfb25Db25maWdDaGFuZ2UiLCJfb25EcnlSdW5SZXF1ZXN0IiwiX29uUnVuUmVxdWVzdCIsIl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9kcnlSdW5MaWdodHMiLCJjcmVhdGUiLCJ3aWR0aCIsImhlaWdodCIsIl9kcnlSdW5CdWxicyIsIl9kclRpbWVEaXNwbGF5IiwiJGRvbSIsIm9uIiwiX3RpbWVyIiwiZHVyYXRpb24iLCJsb29wIiwicmF0ZSIsIl9vbkRyeVJ1blRpY2siLCJfcmVzZXREcnlSdW4iLCJfZHJ5UnVuVmlldyIsIl9leHBWaXpMaWdodHMiLCJudW1QYW5lbHMiLCJuZXdMaWdodHMiLCJyZW5kZXIiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJfdGltZURpc3BsYXkiLCJfYnJpZ2h0bmVzc0Rpc3BsYXkiLCJwdXNoIiwiX2V4cFZpeiIsImZvckVhY2giLCJsaWdodHNEaXNwbGF5IiwiX2NoaWxkcmVuIiwiX3JlcG9ydGVyIiwiX29uUmVzdWx0c1NlbmQiLCJfb25SZXN1bHRzRG9udFNlbmQiLCJoaWRlIiwiX3NldEV4cGVyaW1lbnRNb2RhbGl0eSIsImhvb2siLCJfaG9va1BhbmVsQ29udGVudHMiLCJfaG9va0ludGVyYWN0aXZlVGFicyIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25TZXJ2ZXJVcGRhdGUiLCJfb25TZXJ2ZXJSZXN1bHRzIiwiX29uU2VydmVyRmFpbHVyZSIsInRvTG93ZXJDYXNlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJsaXN0IiwibWV0YSIsImlkIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsImV4cF9oaXN0b3J5X2lkIiwiX2xvYWRFeHBlcmltZW50SW5Gb3JtIiwiZXhwb3J0IiwidmFsdWUiLCJwcm9taXNlQWpheCIsImZpbHRlciIsIndoZXJlIiwiZGVtbyIsImV4cGVyaW1lbnRzIiwibWFwIiwiZSIsImN1cnJlbnRUYXJnZXQiLCJvbGRJZCIsIl9jdXJyRXhwSWQiLCJ0YXJnZXQiLCJsaWdodHMiLCJzZXRTdGF0ZSIsInNob3ciLCJkaXNwYXRjaEV2ZW50IiwiZXhwZXJpbWVudCIsIk9iamVjdCIsImFzc2lnbiIsImV4cEZvcm0iLCJjb25maWd1cmF0aW9uIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZXhwZXJpbWVudElkIiwidGl0bGUiLCJ0YWJUeXBlIiwiY29udGVudCIsIl9maXJzdERyeVJ1biIsImxpZ2h0Q29uZmlnIiwiZ2V0TGlnaHRDb25maWd1cmF0aW9uIiwibGlnaHRMZXZlbHMiLCJwYW5lbCIsIiRlbCIsImZpbmQiLCJodG1sIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwicmVzZXQiLCJzZXRGdWxsc2NyZWVuIiwiaGlzdG9yeUNvdW50IiwicmV2ZXJ0VG9MYXN0SGlzdG9yeSIsImRpc2FibGVOZXciLCJjYXRjaCIsImVyciIsIm1lc3NhZ2UiLCJlcnJvcnMiLCJqb2luIiwiYXV0b0V4cGlyZSIsImV4cGlyZUxhYmVsIiwiZ2V0TGl2ZVJlc3VsdHMiLCJyZXN1bHRzIiwiX2RyeVJ1bkRhdGEiLCJzdGFydCIsImFjdGl2ZSIsInBhdXNlIiwic3RvcCIsInRpbWUiLCJnZXRMaWdodFN0YXRlIiwic2Vjb25kc1RvVGltZVN0cmluZyIsInN0YXR1cyIsIl9yZXN1bHRDbGVhbnVwIiwicmVzdWx0SWQiLCJlbmFibGVOZXciLCJwaGFzZSIsInJlcXVpcmVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQO0FBQUEsTUFHRUksc0JBQXNCSixRQUFRLG1CQUFSLENBSHhCO0FBQUEsTUFJRUssMEJBQTBCTCxRQUFRLHVCQUFSLENBSjVCO0FBQUEsTUFLRU0sUUFBUU4sUUFBUSxpQkFBUixDQUxWO0FBQUEsTUFNRU8sZUFBZVAsUUFBUSw2Q0FBUixDQU5qQjtBQUFBLE1BT0VRLGNBQWNSLFFBQVEsMkNBQVIsQ0FQaEI7QUFBQSxNQVFFUyxjQUFjVCxRQUFRLGdCQUFSLENBUmhCO0FBQUEsTUFTRVUsVUFBVVYsUUFBUSxvQkFBUixDQVRaO0FBQUEsTUFVRVcsa0JBQWtCWCxRQUFRLDBCQUFSLENBVnBCO0FBQUEsTUFXRVksUUFBUVosUUFBUSxpQkFBUixDQVhWO0FBQUEsTUFZRWEsV0FBV2IsUUFBUSxlQUFSLENBWmI7QUFBQSxNQWFFYyxxQkFBcUJkLFFBQVEscUJBQVIsQ0FidkI7O0FBZ0JBQSxVQUFRLGtCQUFSOztBQWpCa0IsTUFtQlplLGdCQW5CWTtBQUFBOztBQW9CaEIsZ0NBQWM7QUFBQTs7QUFBQTs7QUFFWlQsWUFBTVUsV0FBTixRQUF3QixDQUN0Qixz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eEJDLG9CQUFVLFlBRmM7QUFHeEJqQyxnQkFBTTtBQUNKa0MsMEJBQWMyQixRQUFRM0IsWUFEbEI7QUFFSnNDLHNCQUFVWCxRQUFRL0Q7QUFGZDtBQUhrQixTQUExQjtBQVFEO0FBL2NlO0FBQUE7QUFBQSxxQ0FpZERDLEdBamRDLEVBaWRJO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBUzBFLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkIzRSxJQUFJQyxJQUFKLENBQVMwRSxLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLdEksUUFBTCxDQUFja0UsTUFBZCxDQUFxQixFQUFFQyxnQkFBZ0IsTUFBbEIsRUFBckI7QUFDRDtBQUNGO0FBcmRlOztBQUFBO0FBQUEsSUFtQmE3RixNQW5CYjs7QUF3ZGxCYyxtQkFBaUJtSixRQUFqQixHQUE0QixDQUFDdkosZUFBRCxDQUE1QjtBQUNBLFNBQU9JLGdCQUFQO0FBQ0QsQ0ExZEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBFeHBlcmltZW50VGFibGVGb3JtID0gcmVxdWlyZSgnLi9mb3JtX3RhYmxlL2Zvcm0nKSxcbiAgICBFeHBlcmltZW50TmFycmF0aXZlRm9ybSA9IHJlcXVpcmUoJy4vZm9ybV9uYXJyYXRpdmUvZm9ybScpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgTGlnaHREaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvbGlnaHRkaXNwbGF5L2xpZ2h0ZGlzcGxheScpLFxuICAgIEJ1bGJEaXNwbGF5ID0gcmVxdWlyZSgnZXVnbGVuYS9jb21wb25lbnQvYnVsYmRpc3BsYXkvYnVsYmRpc3BsYXknKSxcbiAgICBIaXN0b3J5Rm9ybSA9IHJlcXVpcmUoJy4vaGlzdG9yeS9mb3JtJyksXG4gICAgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFNlcnZlckludGVyZmFjZSA9IHJlcXVpcmUoJy4vc2VydmVyaW50ZXJmYWNlL21vZHVsZScpLFxuICAgIFRpbWVyID0gcmVxdWlyZSgnY29yZS91dGlsL3RpbWVyJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJyksXG4gICAgRXhwZXJpbWVudFJlcG9ydGVyID0gcmVxdWlyZSgnLi9yZXBvcnRlci9yZXBvcnRlcicpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgY2xhc3MgRXhwZXJpbWVudE1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX2hvb2tJbnRlcmFjdGl2ZVRhYnMnLCAnX29uUnVuUmVxdWVzdCcsICdfb25HbG9iYWxzQ2hhbmdlJyxcbiAgICAgICAgJ19vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UnLCAnX29uRHJ5UnVuUmVxdWVzdCcsICdfb25EcnlSdW5UaWNrJyxcbiAgICAgICAgJ19vbkNvbmZpZ0NoYW5nZScsICdfb25OZXdFeHBlcmltZW50UmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19ob29rUGFuZWxDb250ZW50cycsICdfb25TZXJ2ZXJVcGRhdGUnLCAnX29uU2VydmVyUmVzdWx0cycsICdfb25TZXJ2ZXJGYWlsdXJlJyxcbiAgICAgICAgJ19vblJlc3VsdHNEb250U2VuZCcsICdfb25SZXN1bHRzU2VuZCcsICdfb25QaGFzZUNoYW5nZSdcbiAgICAgIF0pO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudCcpKSB7XG4gICAgICAgIGxldCBwcm9taXNlO1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV1Z2xlbmFTZXJ2ZXJNb2RlJykgPT0gXCJkZW1vXCIpIHtcbiAgICAgICAgICBwcm9taXNlID0gdGhpcy5fbG9hZERlbW9IaXN0b3J5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0aWNIaXN0b3J5ID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5Jyk7XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBzdGF0aWNIaXN0b3J5ID8gZmFsc2UgOiB0cnVlKVxuXG4gICAgICAgICAgLy8gMS4gQ3JlYXRlIHRoZSBoaXN0b3J5IGZvcm1cbiAgICAgICAgICB0aGlzLl9oaXN0b3J5ID0gbmV3IEhpc3RvcnlGb3JtKCk7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG5cbiAgICAgICAgICAvLyAyLiBDcmVhdGUgdGhlIHRhYiBhbmQgYWRkIHRoZSBoaXN0b3J5IGZvcm0gdG8gaXQuXG4gICAgICAgICAgdGhpcy5fdGFiVmlldyA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0ndGFiX19leHBlcmltZW50Jz48L2Rpdj5cIik7XG4gICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG5cbiAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKG5ldyBEb21WaWV3KFwiPGRpdiBpZD0nZXhwUHJvdG9jb2xfX3RpdGxlJz4gRXhwZXJpbWVudCBQcm90b2NvbDogPC9kaXY+XCIpKTtcblxuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKT09J3RhYmxlJykge1xuXG4gICAgICAgICAgICAvLyAzLiBDcmVhdGUgdGhlIGV4cGVyaW1lbnRhdGlvbiBmb3JtXG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtID0gbmV3IEV4cGVyaW1lbnRUYWJsZUZvcm0oKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkRyeVJ1bicsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LlN1Ym1pdCcsIHRoaXMuX29uUnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Lk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgICAvLyA0LiBBZGQgdGhlIGNvbmZpZ0Zvcm0gdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9jb25maWdGb3JtLnZpZXcoKSk7XG5cbiAgICAgICAgICAgIC8vIDUuIENyZWF0ZSB0aGUgZHJ5UnVuIHNwZWNpZmljYXRpb25zXG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgICAgd2lkdGg6IDIwMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAxNTBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicyA9IEJ1bGJEaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMTUwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8c3BhbiBjbGFzcz1cImRyeV9ydW5fX3RpbWVcIj48L3NwYW4+JylcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuJGRvbSgpLm9uKCdjbGljaycsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuJGRvbSgpLm9uKCdjbGljaycsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmFkZENoaWxkKHRoaXMuX2RyVGltZURpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuICAgICAgICAgICAgdGhpcy5fdGltZXIgPSBuZXcgVGltZXIoe1xuICAgICAgICAgICAgICBkdXJhdGlvbjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJyksXG4gICAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgICByYXRlOiA0XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuVGljaycsIHRoaXMuX29uRHJ5UnVuVGljayk7XG4gICAgICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuXG4gICAgICAgICAgICAvLyA2LiBDcmVhdGUgdGhlIGRyeVJ1biB2aWV3XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGNsYXNzPSdkcnlfcnVuJz48L2Rpdj5cIik7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkpO1xuXG4gICAgICAgICAgICAvLyA3LiBBZGQgdGhlIGRyeVJ1blZpZXcgdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5WaWV3KTtcblxuICAgICAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJykgPT0gJ25hcnJhdGl2ZScpe1xuXG4gICAgICAgICAgICAvLyAyLiBDcmVhdGUgdGhlIGV4cGVyaW1lbnRhdGlvbiBmb3JtIHRoYXQgY29udGFpbnNcbiAgICAgICAgICAgIC8vIGEuIGV4cGVyaW1lbnQgZGVzY3JpcHRvclxuICAgICAgICAgICAgLy8gYi4gZXhwZXJpbWVudCBzZXR1cFxuICAgICAgICAgICAgLy8gYy4gZXhwZXJpbWVudCBwcm90b2NvbFxuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybSA9IG5ldyBFeHBlcmltZW50TmFycmF0aXZlRm9ybSgpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuU3VibWl0JywgdGhpcy5fb25SdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3RXhwZXJpbWVudFJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZScsIHRoaXMuX29uQWdncmVnYXRlUmVxdWVzdCk7XG5cbiAgICAgICAgICAgIC8vIDMuIEFkZCB0aGUgY29uZmlnRm9ybSBhbmQgZXhwZXJpbWVudFZpZXcgdG8gdGhlIHRhYi5cbiAgICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fY29uZmlnRm9ybS52aWV3KCkpO1xuXG4gICAgICAgICAgICAvLyA0LiBDcmVhdGUgdmlzdWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBleHBlcmltZW50IHByb3RvY29sXG5cbiAgICAgICAgICAgIC8vIDUuIENyZWF0ZSB0aGUgZHJ5UnVuIHNwZWNpZmljYXRpb25zXG4gICAgICAgICAgICB0aGlzLl9leHBWaXpMaWdodHMgPSBbXVxuICAgICAgICAgICAgZm9yICh2YXIgbnVtUGFuZWxzID0gMDsgbnVtUGFuZWxzIDwgNDsgbnVtUGFuZWxzKyspIHtcbiAgICAgICAgICAgICAgbGV0IG5ld0xpZ2h0cyA9IExpZ2h0RGlzcGxheS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwXG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgbmV3TGlnaHRzLnJlbmRlcih7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwXG4gICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgbGV0IF90aW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8ZGl2PicgKyAobnVtUGFuZWxzICsgMSkgKyAnLjxicj4nICsgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpIC8gNC4wKSArICcgc2VjIDwvZGl2PicpO1xuICAgICAgICAgICAgICBsZXQgX2JyaWdodG5lc3NEaXNwbGF5ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGlkPSdleHBfdml6X19icmlnaHRuZXNzJz4gTGlnaHQgPC9kaXY+XCIpO1xuICAgICAgICAgICAgICBuZXdMaWdodHMudmlldygpLmFkZENoaWxkKF90aW1lRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG4gICAgICAgICAgICAgIG5ld0xpZ2h0cy52aWV3KCkuYWRkQ2hpbGQoX2JyaWdodG5lc3NEaXNwbGF5LCAnLmxpZ2h0LWRpc3BsYXlfX2NvbnRlbnQnKTtcblxuICAgICAgICAgICAgICB0aGlzLl9leHBWaXpMaWdodHMucHVzaChuZXdMaWdodHMpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDYuIENyZWF0ZSB0aGUgUmVwcmVzZW50YXRpb24gdmlld1xuICAgICAgICAgICAgdGhpcy5fZXhwVml6ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGNsYXNzPSdleHBfdml6Jz48c3BhbiBpZD0ndGl0bGUnPlZpc3VhbCBSZXByZXNlbnRhdGlvbiBvZiB0aGUgRXhwZXJpbWVudDo8L3NwYW4+PC9kaXY+XCIpO1xuICAgICAgICAgICAgdGhpcy5fZXhwVml6LmFkZENoaWxkKG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0nZXhwX3Zpel9fY29udGFpbmVyJz48L2Rpdj5cIikpO1xuICAgICAgICAgICAgdGhpcy5fZXhwVml6TGlnaHRzLmZvckVhY2goKGxpZ2h0c0Rpc3BsYXkpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fZXhwVml6Ll9jaGlsZHJlblswXS5hZGRDaGlsZChsaWdodHNEaXNwbGF5LnZpZXcoKSlcbiAgICAgICAgICAgIH0sIHRoaXMpXG4gICAgICAgICAgICB0aGlzLl9leHBWaXouYWRkQ2hpbGQobmV3IERvbVZpZXcoXCI8c3Bhbj4gVG90YWwgZHVyYXRpb24gaXMgXCIgKyBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSArIFwiIHNlY29uZHMuIDwvZGl2PlwiKSk7XG5cbiAgICAgICAgICAgIC8vIDcuIEFkZCB0aGUgUmVwcmVzZW50YXRpb24gVmlldyB0byB0aGUgdGFiXG4gICAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2V4cFZpeik7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9yZXBvcnRlciA9IG5ldyBFeHBlcmltZW50UmVwb3J0ZXIoKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50UmVwb3J0ZXIuU2VuZCcsIHRoaXMuX29uUmVzdWx0c1NlbmQpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRSZXBvcnRlci5Eb250U2VuZCcsIHRoaXMuX29uUmVzdWx0c0RvbnRTZW5kKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5oaWRlKCk7XG5cbiAgICAgICAgICB0aGlzLl9zZXRFeHBlcmltZW50TW9kYWxpdHkoKTtcblxuICAgICAgICAgIEhNLmhvb2soJ1BhbmVsLkNvbnRlbnRzJywgdGhpcy5faG9va1BhbmVsQ29udGVudHMsIDkpO1xuICAgICAgICAgIEhNLmhvb2soJ0ludGVyYWN0aXZlVGFicy5MaXN0VGFicycsIHRoaXMuX2hvb2tJbnRlcmFjdGl2ZVRhYnMsIDEwKTtcbiAgICAgICAgICBHbG9iYWxzLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uR2xvYmFsc0NoYW5nZSk7XG5cbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLlVwZGF0ZScsIHRoaXMuX29uU2VydmVyVXBkYXRlKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLlJlc3VsdHMnLCB0aGlzLl9vblNlcnZlclJlc3VsdHMpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHRoaXMuX29uU2VydmVyRmFpbHVyZSk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRFeHBlcmltZW50TW9kYWxpdHkoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykpIHtcbiAgICAgICAgc3dpdGNoKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlQW5kSGlzdG9yeVwiOlxuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va1BhbmVsQ29udGVudHMobGlzdCwgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuaWQgPT0gXCJpbnRlcmFjdGl2ZVwiKSB7XG4gICAgICAgIGxpc3QucHVzaCh0aGlzLl9yZXBvcnRlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJzdHVkZW50X2lkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KClcbiAgICAgICAgICBpZiAoaGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICAgIGV4cF9oaXN0b3J5X2lkOiBoaXN0W2hpc3QubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0odGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJldWdsZW5hU2VydmVyTW9kZVwiKSB7XG4gICAgICAgIGlmIChldnQuZGF0YS52YWx1ZSA9PSBcImRlbW9cIikge1xuICAgICAgICAgIHRoaXMuX2xvYWREZW1vSGlzdG9yeSgpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JywgZmFsc2UpO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfbG9hZERlbW9IaXN0b3J5KCkge1xuICAgICAgaWYgKCFHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknKSkge1xuICAgICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMnLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgZGVtbzogdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChleHBlcmltZW50cykgPT4ge1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScsIGV4cGVyaW1lbnRzLm1hcCgoZSkgPT4gZS5pZCkpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sb2FkRXhwZXJpbWVudEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCk7XG4gICAgfVxuXG4gICAgX2xvYWRFeHBlcmltZW50SW5Gb3JtKGlkKSB7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBsZXQgb2xkSWQgPSB0aGlzLl9jdXJyRXhwSWQ7XG4gICAgICBsZXQgdGFyZ2V0ID0gaWQgPT0gJ19uZXcnID8gbnVsbCA6IGlkO1xuICAgICAgaWYgKG9sZElkICE9IHRhcmdldCkge1xuXG4gICAgICAgIGlmIChpZCA9PSBcIl9uZXdcIikge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IG51bGw7XG4gICAgICAgICAgICAvL3ZhciBpbXBvcnRQYXJhbXMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAndGFibGUnID8gW3sgbGVmdDogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyB0b3A6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgYm90dG9tOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IHJpZ2h0OiAxMDAsIGR1cmF0aW9uOiAxNSB9XSA6IFtdO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaW1wb3J0KHtcbiAgICAgICAgICAgIGxpZ2h0czogW3sgbGVmdDogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyB0b3A6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgYm90dG9tOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IHJpZ2h0OiAxMDAsIGR1cmF0aW9uOiAxNSB9XVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIGlmICh0aGlzLl9kcnlSdW5WaWV3KSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBpZDogXCJfbmV3XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V4cGVyaW1lbnRzLyR7aWR9YClcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5pbXBvcnQoXG4gICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sXG4gICAgICAgICAgICAgICAgZGF0YS5leHBGb3JtLFxuICAgICAgICAgICAgICAgIHsgbGlnaHRzOiBkYXRhLmNvbmZpZ3VyYXRpb24gfVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5fZHJ5UnVuVmlldykge1xuICAgICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnQuTG9hZGVkJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50OiBkYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRFeHBlcmltZW50JywgZGF0YSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va0ludGVyYWN0aXZlVGFicyhsaXN0LCBtZXRhKSB7XG4gICAgICBsaXN0LnB1c2goe1xuICAgICAgICBpZDogXCJleHBlcmltZW50XCIsXG4gICAgICAgIHRpdGxlOiBcIkV4cGVyaW1lbnRcIixcbiAgICAgICAgdGFiVHlwZTogXCJleHBlcmltZW50XCIsXG4gICAgICAgIGNvbnRlbnQ6IHRoaXMuX3RhYlZpZXdcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uQ29uZmlnQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpID09ICd0YWJsZScpe1xuICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgICB0aGlzLl9maXJzdERyeVJ1biA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpID09ICduYXJyYXRpdmUnKXtcblxuICAgICAgICB2YXIgbGlnaHRDb25maWcgPSB0aGlzLl9jb25maWdGb3JtLmdldExpZ2h0Q29uZmlndXJhdGlvbigpO1xuICAgICAgICB2YXIgbGlnaHRMZXZlbHMgPSB7Jy0xJzogJycsICcwJzogJ29mZicsICcyNSc6ICdkaW0nLCAnNTAnOiAnbWVkaXVtJywgJzc1JzogJ2JyaWdodCcsICcxMDAnOiAndi4gYnJpZ2h0J307XG5cbiAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICB0aGlzLl9leHBWaXouX2NoaWxkcmVuWzBdLl9jaGlsZHJlbltwYW5lbF0ucmVuZGVyKGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF0pXG4gICAgICAgICAgdGhpcy5fZXhwVml6Ll9jaGlsZHJlblswXS5fY2hpbGRyZW5bcGFuZWxdLiRlbC5maW5kKCcjZXhwX3Zpel9fYnJpZ2h0bmVzcycpLmh0bWwobGlnaHRMZXZlbHNbbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF1dKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUnVuUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl9kcnlSdW5MaWdodHMgJiB0aGlzLl9kcnlSdW5CdWxicykgeyB0aGlzLl9yZXNldERyeVJ1bigpOyB9XG4gICAgICB0aGlzLl9jb25maWdGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5yZXNldCgpO1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5zZXRGdWxsc2NyZWVuKHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCkgPT0gMClcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIuc2hvdygpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkV4cGVyaW1lbnRSZXF1ZXN0JywgdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKSk7IC8vKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJleHBlcmltZW50X3N1Ym1pc3Npb25cIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5yZXZlcnRUb0xhc3RIaXN0b3J5KCk7XG4gICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZU5ldygpO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmRpc2FibGVOZXcoKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudF9mb3JtX2Vycm9yXCIsXG4gICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgIG1lc3NhZ2U6IGVyci52YWxpZGF0aW9uLmVycm9ycy5qb2luKCc8YnIvPicpLFxuICAgICAgICAgIGF1dG9FeHBpcmU6IDEwLFxuICAgICAgICAgIGV4cGlyZUxhYmVsOiBcIkdvdCBpdFwiXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBleHBfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRMaXZlUmVzdWx0cyh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuQWRkUmVxdWVzdCcsIHtcbiAgICAgICAgICBkYXRhOiByZXN1bHRzXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwiYWRkX2FnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25EcnlSdW5SZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKHRoaXMuX2ZpcnN0RHJ5UnVuKSB7XG4gICAgICAgIHRoaXMuX2RyeVJ1bkRhdGEgPSB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpLmxpZ2h0cztcbiAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICAgIHRoaXMuX3RpbWVyLnBhdXNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9yZXNldERyeVJ1bigpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kcnlSdW5CdWxicy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKCcnKTtcbiAgICB9XG5cbiAgICBfb25EcnlSdW5UaWNrKGV2dCkge1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuX3RpbWVyLnRpbWUoKTtcbiAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy5yZW5kZXIoRXVnVXRpbHMuZ2V0TGlnaHRTdGF0ZSh0aGlzLl9kcnlSdW5EYXRhLCB0aW1lKSlcbiAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnJlbmRlcihFdWdVdGlscy5nZXRMaWdodFN0YXRlKHRoaXMuX2RyeVJ1bkRhdGEsIHRpbWUpKVxuICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheS4kZG9tKCkuaHRtbChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKTtcbiAgICB9XG5cbiAgICBfb25TZXJ2ZXJVcGRhdGUoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXBvcnRlci51cGRhdGUoZXZ0LmRhdGEpO1xuICAgIH1cbiAgICBfb25TZXJ2ZXJSZXN1bHRzKGV2dCkge1xuICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpO1xuICAgICAgICBpZiAoaGlzdC5sZW5ndGggPT0gMSkge1xuICAgICAgICAgIHRoaXMuX29uUmVzdWx0c1NlbmQoe1xuICAgICAgICAgICAgY3VycmVudFRhcmdldDoge1xuICAgICAgICAgICAgICByZXN1bHRzOiBldnQuZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLnVwZGF0ZSh7IHN0YXR1czogXCJjb21wbGV0ZVwiLCByZXN1bHRzOiBldnQuZGF0YSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIF9vblNlcnZlckZhaWx1cmUoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgfVxuXG4gICAgX29uUmVzdWx0c1NlbmQoZXZ0KSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0c1xuICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0cyA9IG51bGw7XG4gICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgIGV4cF9oaXN0b3J5X2lkOiByZXN1bHRzLmV4cGVyaW1lbnRJZFxuICAgICAgfSlcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAnc2VuZF9yZXN1bHQnLFxuICAgICAgICBjYXRlZ29yeTogJ2V4cGVyaW1lbnQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiByZXN1bHRzLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICByZXN1bHRJZDogcmVzdWx0cy5pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBfcmVzdWx0Q2xlYW51cCgpIHtcbiAgICAgIHRoaXMuX3JlcG9ydGVyLmhpZGUoKTtcbiAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZW5hYmxlTmV3KCk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZU5ldygpO1xuICAgIH1cblxuICAgIF9vblJlc3VsdHNEb250U2VuZChldnQpIHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzXG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ2RvbnRfc2VuZF9yZXN1bHQnLFxuICAgICAgICBjYXRlZ29yeTogJ2V4cGVyaW1lbnQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiByZXN1bHRzLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICByZXN1bHRJZDogcmVzdWx0cy5pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBFeHBlcmltZW50TW9kdWxlLnJlcXVpcmVzID0gW1NlcnZlckludGVyZmFjZV07XG4gIHJldHVybiBFeHBlcmltZW50TW9kdWxlO1xufSlcbiJdfQ==
