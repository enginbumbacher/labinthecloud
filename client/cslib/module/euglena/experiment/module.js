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

      Utils.bindMethods(_this, ['_hookInteractiveTabs', '_onRunRequest', '_onGlobalsChange', '_onHistorySelectionChange', '_onDryRunRequest', '_onTick', '_onConfigChange', '_onNewExperimentRequest', '_onAggregateRequest', '_hookPanelContents', '_onServerUpdate', '_onServerResults', '_onServerFailure', '_onResultsDontSend', '_onResultsSend', '_onPhaseChange']);

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
              _this2._timer.addEventListener('Timer.Tick', _this2._onTick);
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

              // 6. Create the dryRun view
              _this2._expViz = new DomView("<div class='exp_viz'><span id='title'>Visual Representation of the Experiment:</span></div>");
              _this2._expViz.addChild(new DomView("<div class='exp_viz__container'></div>"));
              _this2._expVizLights.forEach(function (lightsDisplay) {
                _this2._expViz._children[0].addChild(lightsDisplay.view());
              }, _this2);
              _this2._expViz.addChild(new DomView("<span> Total duration is " + Globals.get('AppConfig.experiment.maxDuration') + " seconds. </div>"));

              // 7. Add the dryRunView to the tab
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
            this._configForm.import({ //**************************
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
            }).then(function () {
              _this4._configForm.setState('new');
              //this._dryRunLights.view().show();
              //this._dryRunBulbs.view().show();
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
              //this._dryRunLights.view().hide();
              //this._dryRunBulbs.view().hide();
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
      key: '_onTick',
      value: function _onTick(evt) {
        var time = this._timer.time();
        this._dryRunLights.render(EugUtils.getLightState(this._dryRunData, time));
        this._dryRunBulbs.render(EugUtils.getLightState(this._dryRunData, time));
        this._drTimeDisplay.$dom().html(Utils.secondsToTimeString(time));
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

        //  this._resetDryRun();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50VGFibGVGb3JtIiwiRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0iLCJVdGlscyIsIkxpZ2h0RGlzcGxheSIsIkJ1bGJEaXNwbGF5IiwiSGlzdG9yeUZvcm0iLCJEb21WaWV3IiwiU2VydmVySW50ZXJmYWNlIiwiVGltZXIiLCJFdWdVdGlscyIsIkV4cGVyaW1lbnRSZXBvcnRlciIsIkV4cGVyaW1lbnRNb2R1bGUiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsInByb21pc2UiLCJfbG9hZERlbW9IaXN0b3J5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwic3RhdGljSGlzdG9yeSIsInNldCIsIl9oaXN0b3J5IiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl90YWJWaWV3IiwiYWRkQ2hpbGQiLCJ2aWV3IiwiX2NvbmZpZ0Zvcm0iLCJfb25Db25maWdDaGFuZ2UiLCJfb25EcnlSdW5SZXF1ZXN0IiwiX29uUnVuUmVxdWVzdCIsIl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9kcnlSdW5MaWdodHMiLCJjcmVhdGUiLCJ3aWR0aCIsImhlaWdodCIsIl9kcnlSdW5CdWxicyIsIl9kclRpbWVEaXNwbGF5IiwiJGRvbSIsIm9uIiwiX3RpbWVyIiwiZHVyYXRpb24iLCJsb29wIiwicmF0ZSIsIl9vblRpY2siLCJfcmVzZXREcnlSdW4iLCJfZHJ5UnVuVmlldyIsIl9leHBWaXpMaWdodHMiLCJudW1QYW5lbHMiLCJuZXdMaWdodHMiLCJyZW5kZXIiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJfdGltZURpc3BsYXkiLCJfYnJpZ2h0bmVzc0Rpc3BsYXkiLCJwdXNoIiwiX2V4cFZpeiIsImZvckVhY2giLCJsaWdodHNEaXNwbGF5IiwiX2NoaWxkcmVuIiwiX3JlcG9ydGVyIiwiX29uUmVzdWx0c1NlbmQiLCJfb25SZXN1bHRzRG9udFNlbmQiLCJoaWRlIiwiX3NldEV4cGVyaW1lbnRNb2RhbGl0eSIsImhvb2siLCJfaG9va1BhbmVsQ29udGVudHMiLCJfaG9va0ludGVyYWN0aXZlVGFicyIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25TZXJ2ZXJVcGRhdGUiLCJfb25TZXJ2ZXJSZXN1bHRzIiwiX29uU2VydmVyRmFpbHVyZSIsInRvTG93ZXJDYXNlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJsaXN0IiwibWV0YSIsImlkIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsImV4cF9oaXN0b3J5X2lkIiwiX2xvYWRFeHBlcmltZW50SW5Gb3JtIiwiZXhwb3J0IiwidmFsdWUiLCJwcm9taXNlQWpheCIsImZpbHRlciIsIndoZXJlIiwiZGVtbyIsImV4cGVyaW1lbnRzIiwibWFwIiwiZSIsImN1cnJlbnRUYXJnZXQiLCJvbGRJZCIsIl9jdXJyRXhwSWQiLCJ0YXJnZXQiLCJsaWdodHMiLCJzZXRTdGF0ZSIsImRpc3BhdGNoRXZlbnQiLCJleHBlcmltZW50IiwiT2JqZWN0IiwiYXNzaWduIiwiZXhwRm9ybSIsImNvbmZpZ3VyYXRpb24iLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJleHBlcmltZW50SWQiLCJ0aXRsZSIsInRhYlR5cGUiLCJjb250ZW50IiwiX2ZpcnN0RHJ5UnVuIiwiX2RyeVJ1bkRhdGEiLCJzdGFydCIsImFjdGl2ZSIsInBhdXNlIiwidGltZSIsImdldExpZ2h0U3RhdGUiLCJodG1sIiwic2Vjb25kc1RvVGltZVN0cmluZyIsInN0b3AiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0TGV2ZWxzIiwicGFuZWwiLCIkZWwiLCJmaW5kIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwicmVzZXQiLCJzZXRGdWxsc2NyZWVuIiwiaGlzdG9yeUNvdW50Iiwic2hvdyIsInJldmVydFRvTGFzdEhpc3RvcnkiLCJkaXNhYmxlTmV3IiwiY2F0Y2giLCJlcnIiLCJtZXNzYWdlIiwiZXJyb3JzIiwiam9pbiIsImF1dG9FeHBpcmUiLCJleHBpcmVMYWJlbCIsImdldExpdmVSZXN1bHRzIiwicmVzdWx0cyIsInN0YXR1cyIsIl9yZXN1bHRDbGVhbnVwIiwicmVzdWx0SWQiLCJlbmFibGVOZXciLCJwaGFzZSIsInJlcXVpcmVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQO0FBQUEsTUFHRUksc0JBQXNCSixRQUFRLG1CQUFSLENBSHhCO0FBQUEsTUFJRUssMEJBQTBCTCxRQUFRLHVCQUFSLENBSjVCO0FBQUEsTUFLRU0sUUFBUU4sUUFBUSxpQkFBUixDQUxWO0FBQUEsTUFNRU8sZUFBZVAsUUFBUSw2Q0FBUixDQU5qQjtBQUFBLE1BT0VRLGNBQWNSLFFBQVEsMkNBQVIsQ0FQaEI7QUFBQSxNQVFFUyxjQUFjVCxRQUFRLGdCQUFSLENBUmhCO0FBQUEsTUFTRVUsVUFBVVYsUUFBUSxvQkFBUixDQVRaO0FBQUEsTUFVRVcsa0JBQWtCWCxRQUFRLDBCQUFSLENBVnBCO0FBQUEsTUFXRVksUUFBUVosUUFBUSxpQkFBUixDQVhWO0FBQUEsTUFZRWEsV0FBV2IsUUFBUSxlQUFSLENBWmI7QUFBQSxNQWFFYyxxQkFBcUJkLFFBQVEscUJBQVIsQ0FidkI7O0FBZ0JBQSxVQUFRLGtCQUFSOztBQWpCa0IsTUFtQlplLGdCQW5CWTtBQUFBOztBQW9CaEIsZ0NBQWM7QUFBQTs7QUFBQTs7QUFFWlQsWUFBTVUsV0FBTixRQUF3QixDQUN0QixzQkFEc0Is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a0IsaUJBQW5ELEVBQXNFO0FBQ3BFLGVBQUt0SSxRQUFMLENBQWNrRSxNQUFkLENBQXFCLEVBQUVDLGdCQUFnQixNQUFsQixFQUFyQjtBQUNEO0FBQ0Y7QUExZGU7O0FBQUE7QUFBQSxJQW1CYTdGLE1BbkJiOztBQTZkbEJjLG1CQUFpQm1KLFFBQWpCLEdBQTRCLENBQUN2SixlQUFELENBQTVCO0FBQ0EsU0FBT0ksZ0JBQVA7QUFDRCxDQS9kRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIEV4cGVyaW1lbnRUYWJsZUZvcm0gPSByZXF1aXJlKCcuL2Zvcm1fdGFibGUvZm9ybScpLFxuICAgIEV4cGVyaW1lbnROYXJyYXRpdmVGb3JtID0gcmVxdWlyZSgnLi9mb3JtX25hcnJhdGl2ZS9mb3JtJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBMaWdodERpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5JyksXG4gICAgQnVsYkRpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS9idWxiZGlzcGxheScpLFxuICAgIEhpc3RvcnlGb3JtID0gcmVxdWlyZSgnLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgU2VydmVySW50ZXJmYWNlID0gcmVxdWlyZSgnLi9zZXJ2ZXJpbnRlcmZhY2UvbW9kdWxlJyksXG4gICAgVGltZXIgPSByZXF1aXJlKCdjb3JlL3V0aWwvdGltZXInKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKSxcbiAgICBFeHBlcmltZW50UmVwb3J0ZXIgPSByZXF1aXJlKCcuL3JlcG9ydGVyL3JlcG9ydGVyJylcbiAgO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICBjbGFzcyBFeHBlcmltZW50TW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfaG9va0ludGVyYWN0aXZlVGFicycsICdfb25SdW5SZXF1ZXN0JywgJ19vbkdsb2JhbHNDaGFuZ2UnLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25EcnlSdW5SZXF1ZXN0JywgJ19vblRpY2snLFxuICAgICAgICAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0JywgJ19vbkFnZ3JlZ2F0ZVJlcXVlc3QnLFxuICAgICAgICAnX2hvb2tQYW5lbENvbnRlbnRzJywgJ19vblNlcnZlclVwZGF0ZScsICdfb25TZXJ2ZXJSZXN1bHRzJywgJ19vblNlcnZlckZhaWx1cmUnLFxuICAgICAgICAnX29uUmVzdWx0c0RvbnRTZW5kJywgJ19vblJlc3VsdHNTZW5kJywgJ19vblBoYXNlQ2hhbmdlJ1xuICAgICAgXSk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50JykpIHtcbiAgICAgICAgbGV0IHByb21pc2U7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXVnbGVuYVNlcnZlck1vZGUnKSA9PSBcImRlbW9cIikge1xuICAgICAgICAgIHByb21pc2UgPSB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRpY0hpc3RvcnkgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIHN0YXRpY0hpc3RvcnkgPyBmYWxzZSA6IHRydWUpXG5cbiAgICAgICAgICAvLyAxLiBDcmVhdGUgdGhlIGhpc3RvcnkgZm9ybVxuICAgICAgICAgIHRoaXMuX2hpc3RvcnkgPSBuZXcgSGlzdG9yeUZvcm0oKTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcblxuICAgICAgICAgIC8vIDIuIENyZWF0ZSB0aGUgdGFiIGFuZCBhZGQgdGhlIGhpc3RvcnkgZm9ybSB0byBpdC5cbiAgICAgICAgICB0aGlzLl90YWJWaWV3ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGNsYXNzPSd0YWJfX2V4cGVyaW1lbnQnPjwvZGl2PlwiKTtcbiAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcblxuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQobmV3IERvbVZpZXcoXCI8ZGl2IGlkPSdleHBQcm90b2NvbF9fdGl0bGUnPiBFeHBlcmltZW50IFByb3RvY29sOiA8L2Rpdj5cIikpO1xuXG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpPT0ndGFibGUnKSB7XG5cbiAgICAgICAgICAgIC8vIDMuIENyZWF0ZSB0aGUgZXhwZXJpbWVudGF0aW9uIGZvcm1cbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0gPSBuZXcgRXhwZXJpbWVudFRhYmxlRm9ybSgpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuRHJ5UnVuJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuU3VibWl0JywgdGhpcy5fb25SdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3RXhwZXJpbWVudFJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZScsIHRoaXMuX29uQWdncmVnYXRlUmVxdWVzdCk7XG5cbiAgICAgICAgICAgIC8vIDQuIEFkZCB0aGUgY29uZmlnRm9ybSB0byB0aGUgdGFiXG4gICAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpKTtcblxuICAgICAgICAgICAgLy8gNS4gQ3JlYXRlIHRoZSBkcnlSdW4gc3BlY2lmaWNhdGlvbnNcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cyA9IExpZ2h0RGlzcGxheS5jcmVhdGUoe1xuICAgICAgICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDE1MFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzID0gQnVsYkRpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgICAgd2lkdGg6IDIwMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAxNTBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl9kclRpbWVEaXNwbGF5ID0gbmV3IERvbVZpZXcoJzxzcGFuIGNsYXNzPVwiZHJ5X3J1bl9fdGltZVwiPjwvc3Bhbj4nKVxuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS4kZG9tKCkub24oJ2NsaWNrJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS4kZG9tKCkub24oJ2NsaWNrJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZHJUaW1lRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG4gICAgICAgICAgICB0aGlzLl90aW1lciA9IG5ldyBUaW1lcih7XG4gICAgICAgICAgICAgIGR1cmF0aW9uOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSxcbiAgICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICAgIHJhdGU6IDRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl90aW1lci5hZGRFdmVudExpc3RlbmVyKCdUaW1lci5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG5cbiAgICAgICAgICAgIC8vIDYuIENyZWF0ZSB0aGUgZHJ5UnVuIHZpZXdcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2RyeV9ydW4nPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKSk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKSk7XG5cbiAgICAgICAgICAgIC8vIDcuIEFkZCB0aGUgZHJ5UnVuVmlldyB0byB0aGUgdGFiXG4gICAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1blZpZXcpO1xuXG4gICAgICAgICAgfSBlbHNlIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAnbmFycmF0aXZlJyl7XG5cbiAgICAgICAgICAgIC8vIDIuIENyZWF0ZSB0aGUgZXhwZXJpbWVudGF0aW9uIGZvcm0gdGhhdCBjb250YWluc1xuICAgICAgICAgICAgLy8gYS4gZXhwZXJpbWVudCBkZXNjcmlwdG9yXG4gICAgICAgICAgICAvLyBiLiBleHBlcmltZW50IHNldHVwXG4gICAgICAgICAgICAvLyBjLiBleHBlcmltZW50IHByb3RvY29sXG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtID0gbmV3IEV4cGVyaW1lbnROYXJyYXRpdmVGb3JtKCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5TdWJtaXQnLCB0aGlzLl9vblJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdFeHBlcmltZW50UmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcblxuICAgICAgICAgICAgLy8gMy4gQWRkIHRoZSBjb25maWdGb3JtIGFuZCBleHBlcmltZW50VmlldyB0byB0aGUgdGFiLlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9jb25maWdGb3JtLnZpZXcoKSk7XG5cbiAgICAgICAgICAgIC8vIDQuIENyZWF0ZSB2aXN1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGV4cGVyaW1lbnQgcHJvdG9jb2xcblxuICAgICAgICAgICAgLy8gNS4gQ3JlYXRlIHRoZSBkcnlSdW4gc3BlY2lmaWNhdGlvbnNcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpekxpZ2h0cyA9IFtdXG4gICAgICAgICAgICBmb3IgKHZhciBudW1QYW5lbHMgPSAwOyBudW1QYW5lbHMgPCA0OyBudW1QYW5lbHMrKykge1xuICAgICAgICAgICAgICBsZXQgbmV3TGlnaHRzID0gTGlnaHREaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDc1LFxuICAgICAgICAgICAgICAgIGhlaWdodDogNzVcbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICBuZXdMaWdodHMucmVuZGVyKHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDBcbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICBsZXQgX3RpbWVEaXNwbGF5ID0gbmV3IERvbVZpZXcoJzxkaXY+JyArIChudW1QYW5lbHMgKyAxKSArICcuPGJyPicgKyAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJykgKiBudW1QYW5lbHMgLyA0LjApICsgJyAtICcgKyAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJykgKiAobnVtUGFuZWxzICsgMSApIC8gNC4wKSArICcgc2VjIDwvZGl2PicpO1xuICAgICAgICAgICAgICBsZXQgX2JyaWdodG5lc3NEaXNwbGF5ID0gbmV3IERvbVZpZXcoXCI8ZGl2IGlkPSdleHBfdml6X19icmlnaHRuZXNzJz4gTGlnaHQgPC9kaXY+XCIpO1xuICAgICAgICAgICAgICBuZXdMaWdodHMudmlldygpLmFkZENoaWxkKF90aW1lRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG4gICAgICAgICAgICAgIG5ld0xpZ2h0cy52aWV3KCkuYWRkQ2hpbGQoX2JyaWdodG5lc3NEaXNwbGF5LCAnLmxpZ2h0LWRpc3BsYXlfX2NvbnRlbnQnKTtcblxuICAgICAgICAgICAgICB0aGlzLl9leHBWaXpMaWdodHMucHVzaChuZXdMaWdodHMpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDYuIENyZWF0ZSB0aGUgZHJ5UnVuIHZpZXdcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpeiA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0nZXhwX3Zpeic+PHNwYW4gaWQ9J3RpdGxlJz5WaXN1YWwgUmVwcmVzZW50YXRpb24gb2YgdGhlIEV4cGVyaW1lbnQ6PC9zcGFuPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpei5hZGRDaGlsZChuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2V4cF92aXpfX2NvbnRhaW5lcic+PC9kaXY+XCIpKTtcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpekxpZ2h0cy5mb3JFYWNoKChsaWdodHNEaXNwbGF5KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2V4cFZpei5fY2hpbGRyZW5bMF0uYWRkQ2hpbGQobGlnaHRzRGlzcGxheS52aWV3KCkpXG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICAgICAgdGhpcy5fZXhwVml6LmFkZENoaWxkKG5ldyBEb21WaWV3KFwiPHNwYW4+IFRvdGFsIGR1cmF0aW9uIGlzIFwiICsgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJykgKyBcIiBzZWNvbmRzLiA8L2Rpdj5cIikpO1xuXG4gICAgICAgICAgICAvLyA3LiBBZGQgdGhlIGRyeVJ1blZpZXcgdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9leHBWaXopO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIgPSBuZXcgRXhwZXJpbWVudFJlcG9ydGVyKCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLlNlbmQnLCB0aGlzLl9vblJlc3VsdHNTZW5kKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50UmVwb3J0ZXIuRG9udFNlbmQnLCB0aGlzLl9vblJlc3VsdHNEb250U2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuXG4gICAgICAgICAgdGhpcy5fc2V0RXhwZXJpbWVudE1vZGFsaXR5KCk7XG5cbiAgICAgICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIHRoaXMuX2hvb2tQYW5lbENvbnRlbnRzLCA5KTtcbiAgICAgICAgICBITS5ob29rKCdJbnRlcmFjdGl2ZVRhYnMuTGlzdFRhYnMnLCB0aGlzLl9ob29rSW50ZXJhY3RpdmVUYWJzLCAxMCk7XG4gICAgICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCB0aGlzLl9vblNlcnZlclVwZGF0ZSk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgdGhpcy5fb25TZXJ2ZXJSZXN1bHRzKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB0aGlzLl9vblNlcnZlckZhaWx1cmUpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0RXhwZXJpbWVudE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZUFuZEhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tQYW5lbENvbnRlbnRzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLmlkID09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgICAgICBsaXN0LnB1c2godGhpcy5fcmVwb3J0ZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09IFwic3R1ZGVudF9pZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgaWYgKGhpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICBleHBfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2xvYWRFeHBlcmltZW50SW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5wYXRoID09IFwiZXVnbGVuYVNlcnZlck1vZGVcIikge1xuICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUgPT0gXCJkZW1vXCIpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xvYWREZW1vSGlzdG9yeSgpIHtcbiAgICAgIGlmICghR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5JykpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzJywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgIGRlbW86IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoZXhwZXJpbWVudHMpID0+IHtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknLCBleHBlcmltZW50cy5tYXAoKGUpID0+IGUuaWQpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgIH1cblxuICAgIF9sb2FkRXhwZXJpbWVudEluRm9ybShpZCkge1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgbGV0IG9sZElkID0gdGhpcy5fY3VyckV4cElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkID09IFwiX25ld1wiKSB7XG4gICAgICAgICAgdGhpcy5fY3VyckV4cElkID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmltcG9ydCh7IC8vKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgIGxpZ2h0czogW3tcbiAgICAgICAgICAgICAgbGVmdDogMTAwLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgdG9wOiAxMDAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBib3R0b206IDEwMCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIHJpZ2h0OiAxMDAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgICAgICAgfV1cbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uc2V0U3RhdGUoJ25ldycpXG4gICAgICAgICAgICAvL3RoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgLy90aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBpZDogXCJfbmV3XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V4cGVyaW1lbnRzLyR7aWR9YClcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5pbXBvcnQoXG4gICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sXG4gICAgICAgICAgICAgICAgZGF0YS5leHBGb3JtLFxuICAgICAgICAgICAgICAgIHsgbGlnaHRzOiBkYXRhLmNvbmZpZ3VyYXRpb24gfVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJyk7XG4gICAgICAgICAgICAvL3RoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgLy90aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudEV4cGVyaW1lbnQnLCBkYXRhKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibG9hZFwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBleHBlcmltZW50SWQ6IGlkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rSW50ZXJhY3RpdmVUYWJzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGxpc3QucHVzaCh7XG4gICAgICAgIGlkOiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgdGl0bGU6IFwiRXhwZXJpbWVudFwiLFxuICAgICAgICB0YWJUeXBlOiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgY29udGVudDogdGhpcy5fdGFiVmlld1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBfb25EcnlSdW5SZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKHRoaXMuX2ZpcnN0RHJ5UnVuKSB7XG4gICAgICAgIHRoaXMuX2RyeVJ1bkRhdGEgPSB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpLmxpZ2h0cztcbiAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICAgIHRoaXMuX3RpbWVyLnBhdXNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5fdGltZXIudGltZSgpO1xuICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnJlbmRlcihFdWdVdGlscy5nZXRMaWdodFN0YXRlKHRoaXMuX2RyeVJ1bkRhdGEsIHRpbWUpKVxuICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMucmVuZGVyKEV1Z1V0aWxzLmdldExpZ2h0U3RhdGUodGhpcy5fZHJ5UnVuRGF0YSwgdGltZSkpXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKFV0aWxzLnNlY29uZHNUb1RpbWVTdHJpbmcodGltZSkpO1xuICAgIH1cblxuICAgIF9yZXNldERyeVJ1bigpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kcnlSdW5CdWxicy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKCcnKTtcbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJykgPT0gJ3RhYmxlJyl7XG4gICAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG4gICAgICAgIHRoaXMuX2ZpcnN0RHJ5UnVuID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJykgPT0gJ25hcnJhdGl2ZScpe1xuICAgICAgICB2YXIgbGlnaHRDb25maWcgPSB0aGlzLl9jb25maWdGb3JtLmdldExpZ2h0Q29uZmlndXJhdGlvbigpO1xuICAgICAgICB2YXIgbGlnaHRMZXZlbHMgPSB7Jy0xJzogJycsICcwJzogJ29mZicsICcyNSc6ICdkaW0nLCAnNTAnOiAnbWVkaXVtJywgJzc1JzogJ2JyaWdodCcsICcxMDAnOiAndmVyeSBicmlnaHQnfTtcblxuICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgIHRoaXMuX2V4cFZpei5fY2hpbGRyZW5bMF0uX2NoaWxkcmVuW3BhbmVsXS5yZW5kZXIobGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXSlcbiAgICAgICAgICB0aGlzLl9leHBWaXouX2NoaWxkcmVuWzBdLl9jaGlsZHJlbltwYW5lbF0uJGVsLmZpbmQoJyNleHBfdml6X19icmlnaHRuZXNzJykuaHRtbChsaWdodExldmVsc1tsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25SdW5SZXF1ZXN0KGV2dCkge1xuICAgIC8vICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgdGhpcy5fY29uZmlnRm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIuc2V0RnVsbHNjcmVlbih0aGlzLl9oaXN0b3J5Lmhpc3RvcnlDb3VudCgpID09IDApXG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnNob3coKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5FeHBlcmltZW50UmVxdWVzdCcsIHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KCkpOyAvLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwiZXhwZXJpbWVudF9zdWJtaXNzaW9uXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX2hpc3RvcnkucmV2ZXJ0VG9MYXN0SGlzdG9yeSgpO1xuICAgICAgICB0aGlzLl9jb25maWdGb3JtLmRpc2FibGVOZXcoKTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlTmV3KCk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRfZm9ybV9lcnJvclwiLFxuICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICBtZXNzYWdlOiBlcnIudmFsaWRhdGlvbi5lcnJvcnMuam9pbignPGJyLz4nKSxcbiAgICAgICAgICBhdXRvRXhwaXJlOiAxMCxcbiAgICAgICAgICBleHBpcmVMYWJlbDogXCJHb3QgaXRcIlxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OZXdFeHBlcmltZW50UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICB9XG5cbiAgICBfb25BZ2dyZWdhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgRXVnVXRpbHMuZ2V0TGl2ZVJlc3VsdHModGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFkZF9hZ2dyZWdhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiB0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uU2VydmVyVXBkYXRlKGV2dCkge1xuICAgICAgdGhpcy5fcmVwb3J0ZXIudXBkYXRlKGV2dC5kYXRhKTtcbiAgICB9XG4gICAgX29uU2VydmVyUmVzdWx0cyhldnQpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKTtcbiAgICAgICAgaWYgKGhpc3QubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICB0aGlzLl9vblJlc3VsdHNTZW5kKHtcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQ6IHtcbiAgICAgICAgICAgICAgcmVzdWx0czogZXZ0LmRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci51cGRhdGUoeyBzdGF0dXM6IFwiY29tcGxldGVcIiwgcmVzdWx0czogZXZ0LmRhdGEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25TZXJ2ZXJGYWlsdXJlKGV2dCkge1xuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgIH1cblxuICAgIF9vblJlc3VsdHNTZW5kKGV2dCkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHNcbiAgICAgIGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHMgPSBudWxsO1xuICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICBleHBfaGlzdG9yeV9pZDogcmVzdWx0cy5leHBlcmltZW50SWRcbiAgICAgIH0pXG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3NlbmRfcmVzdWx0JyxcbiAgICAgICAgY2F0ZWdvcnk6ICdleHBlcmltZW50JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogcmVzdWx0cy5leHBlcmltZW50SWQsXG4gICAgICAgICAgcmVzdWx0SWQ6IHJlc3VsdHMuaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgX3Jlc3VsdENsZWFudXAoKSB7XG4gICAgICB0aGlzLl9yZXBvcnRlci5oaWRlKCk7XG4gICAgICB0aGlzLl9jb25maWdGb3JtLmVuYWJsZU5ldygpO1xuICAgICAgdGhpcy5faGlzdG9yeS5lbmFibGVOZXcoKTtcbiAgICB9XG5cbiAgICBfb25SZXN1bHRzRG9udFNlbmQoZXZ0KSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0c1xuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdkb250X3NlbmRfcmVzdWx0JyxcbiAgICAgICAgY2F0ZWdvcnk6ICdleHBlcmltZW50JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogcmVzdWx0cy5leHBlcmltZW50SWQsXG4gICAgICAgICAgcmVzdWx0SWQ6IHJlc3VsdHMuaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IGV4cF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgRXhwZXJpbWVudE1vZHVsZS5yZXF1aXJlcyA9IFtTZXJ2ZXJJbnRlcmZhY2VdO1xuICByZXR1cm4gRXhwZXJpbWVudE1vZHVsZTtcbn0pXG4iXX0=
