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
          console.log('loadExperimentInForm');

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
          console.log('ConfigChange');
          console.log(evt.data.field._model._data);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50VGFibGVGb3JtIiwiRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0iLCJVdGlscyIsIkxpZ2h0RGlzcGxheSIsIkJ1bGJEaXNwbGF5IiwiSGlzdG9yeUZvcm0iLCJEb21WaWV3IiwiU2VydmVySW50ZXJmYWNlIiwiVGltZXIiLCJFdWdVdGlscyIsIkV4cGVyaW1lbnRSZXBvcnRlciIsIkV4cGVyaW1lbnRNb2R1bGUiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsInByb21pc2UiLCJfbG9hZERlbW9IaXN0b3J5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwic3RhdGljSGlzdG9yeSIsInNldCIsIl9oaXN0b3J5IiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl90YWJWaWV3IiwiYWRkQ2hpbGQiLCJ2aWV3IiwiX2NvbmZpZ0Zvcm0iLCJfb25Db25maWdDaGFuZ2UiLCJfb25EcnlSdW5SZXF1ZXN0IiwiX29uUnVuUmVxdWVzdCIsIl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9kcnlSdW5MaWdodHMiLCJjcmVhdGUiLCJ3aWR0aCIsImhlaWdodCIsIl9kcnlSdW5CdWxicyIsIl9kclRpbWVEaXNwbGF5IiwiJGRvbSIsIm9uIiwiX3RpbWVyIiwiZHVyYXRpb24iLCJsb29wIiwicmF0ZSIsIl9vbkRyeVJ1blRpY2siLCJfcmVzZXREcnlSdW4iLCJfZHJ5UnVuVmlldyIsIl9leHBWaXpMaWdodHMiLCJudW1QYW5lbHMiLCJuZXdMaWdodHMiLCJyZW5kZXIiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJfdGltZURpc3BsYXkiLCJfYnJpZ2h0bmVzc0Rpc3BsYXkiLCJwdXNoIiwiX2V4cFZpeiIsImZvckVhY2giLCJsaWdodHNEaXNwbGF5IiwiX2NoaWxkcmVuIiwiX3JlcG9ydGVyIiwiX29uUmVzdWx0c1NlbmQiLCJfb25SZXN1bHRzRG9udFNlbmQiLCJoaWRlIiwiX3NldEV4cGVyaW1lbnRNb2RhbGl0eSIsImhvb2siLCJfaG9va1BhbmVsQ29udGVudHMiLCJfaG9va0ludGVyYWN0aXZlVGFicyIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25TZXJ2ZXJVcGRhdGUiLCJfb25TZXJ2ZXJSZXN1bHRzIiwiX29uU2VydmVyRmFpbHVyZSIsInRvTG93ZXJDYXNlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJsaXN0IiwibWV0YSIsImlkIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsImV4cF9oaXN0b3J5X2lkIiwiX2xvYWRFeHBlcmltZW50SW5Gb3JtIiwiZXhwb3J0IiwidmFsdWUiLCJwcm9taXNlQWpheCIsImZpbHRlciIsIndoZXJlIiwiZGVtbyIsImV4cGVyaW1lbnRzIiwibWFwIiwiZSIsImN1cnJlbnRUYXJnZXQiLCJvbGRJZCIsIl9jdXJyRXhwSWQiLCJ0YXJnZXQiLCJjb25zb2xlIiwibG9nIiwibGlnaHRzIiwic2V0U3RhdGUiLCJzaG93IiwiZGlzcGF0Y2hFdmVudCIsImV4cGVyaW1lbnQiLCJPYmplY3QiLCJhc3NpZ24iLCJleHBGb3JtIiwiY29uZmlndXJhdGlvbiIsInR5cGUiLCJjYXRlZ29yeSIsImV4cGVyaW1lbnRJZCIsInRpdGxlIiwidGFiVHlwZSIsImNvbnRlbnQiLCJfZmlyc3REcnlSdW4iLCJmaWVsZCIsIl9tb2RlbCIsIl9kYXRhIiwibGlnaHRDb25maWciLCJnZXRMaWdodENvbmZpZ3VyYXRpb24iLCJsaWdodExldmVscyIsInBhbmVsIiwiJGVsIiwiZmluZCIsImh0bWwiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJyZXNldCIsInNldEZ1bGxzY3JlZW4iLCJoaXN0b3J5Q291bnQiLCJyZXZlcnRUb0xhc3RIaXN0b3J5IiwiZGlzYWJsZU5ldyIsImNhdGNoIiwiZXJyIiwibWVzc2FnZSIsImVycm9ycyIsImpvaW4iLCJhdXRvRXhwaXJlIiwiZXhwaXJlTGFiZWwiLCJnZXRMaXZlUmVzdWx0cyIsInJlc3VsdHMiLCJfZHJ5UnVuRGF0YSIsInN0YXJ0IiwiYWN0aXZlIiwicGF1c2UiLCJzdG9wIiwidGltZSIsImdldExpZ2h0U3RhdGUiLCJzZWNvbmRzVG9UaW1lU3RyaW5nIiwic3RhdHVzIiwiX3Jlc3VsdENsZWFudXAiLCJyZXN1bHRJZCIsImVuYWJsZU5ldyIsInBoYXNlIiwicmVxdWlyZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7QUFBQSxNQUdFSSxzQkFBc0JKLFFBQVEsbUJBQVIsQ0FIeEI7QUFBQSxNQUlFSywwQkFBMEJMLFFBQVEsdUJBQVIsQ0FKNUI7QUFBQSxNQUtFTSxRQUFRTixRQUFRLGlCQUFSLENBTFY7QUFBQSxNQU1FTyxlQUFlUCxRQUFRLDZDQUFSLENBTmpCO0FBQUEsTUFPRVEsY0FBY1IsUUFBUSwyQ0FBUixDQVBoQjtBQUFBLE1BUUVTLGNBQWNULFFBQVEsZ0JBQVIsQ0FSaEI7QUFBQSxNQVNFVSxVQUFVVixRQUFRLG9CQUFSLENBVFo7QUFBQSxNQVVFVyxrQkFBa0JYLFFBQVEsMEJBQVIsQ0FWcEI7QUFBQSxNQVdFWSxRQUFRWixRQUFRLGlCQUFSLENBWFY7QUFBQSxNQVlFYSxXQUFXYixRQUFRLGVBQVIsQ0FaYjtBQUFBLE1BYUVjLHFCQUFxQmQsUUFBUSxxQkFBUixDQWJ2Qjs7QUFnQkFBLFVBQVEsa0JBQVI7O0FBakJrQixNQW1CWmUsZ0JBbkJZO0FBQUE7O0FBb0JoQixnQ0FBYztBQUFBOztB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QUE7QUFBQSx5Q0FzY0c5RSxHQXRjSCxFQXNjUTtBQUN0QixZQUFNa0UsVUFBVWxFLElBQUltQixhQUFKLENBQWtCK0MsT0FBbEM7QUFDQSxhQUFLVSxjQUFMO0FBQ0FoSyxnQkFBUWUsR0FBUixDQUFZLFFBQVosRUFBc0I2RixHQUF0QixDQUEwQjtBQUN4QlUsZ0JBQU0sa0JBRGtCO0FBRXhCQyxvQkFBVSxZQUZjO0FBR3hCbEMsZ0JBQU07QUFDSm1DLDBCQUFjOEIsUUFBUTlCLFlBRGxCO0FBRUp5QyxzQkFBVVgsUUFBUW5FO0FBRmQ7QUFIa0IsU0FBMUI7QUFRRDtBQWpkZTtBQUFBO0FBQUEscUNBbWREQyxHQW5kQyxFQW1kSTtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVM4RSxLQUFULElBQWtCLE9BQWxCLElBQTZCL0UsSUFBSUMsSUFBSixDQUFTOEUsS0FBVCxJQUFrQixpQkFBbkQsRUFBc0U7QUFDcEUsZUFBSzFJLFFBQUwsQ0FBY2tFLE1BQWQsQ0FBcUIsRUFBRUMsZ0JBQWdCLE1BQWxCLEVBQXJCO0FBQ0Q7QUFDRjtBQXZkZTs7QUFBQTtBQUFBLElBbUJhN0YsTUFuQmI7O0FBMGRsQmMsbUJBQWlCdUosUUFBakIsR0FBNEIsQ0FBQzNKLGVBQUQsQ0FBNUI7QUFDQSxTQUFPSSxnQkFBUDtBQUNELENBNWREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgRXhwZXJpbWVudFRhYmxlRm9ybSA9IHJlcXVpcmUoJy4vZm9ybV90YWJsZS9mb3JtJyksXG4gICAgRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0gPSByZXF1aXJlKCcuL2Zvcm1fbmFycmF0aXZlL2Zvcm0nKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIExpZ2h0RGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2xpZ2h0ZGlzcGxheS9saWdodGRpc3BsYXknKSxcbiAgICBCdWxiRGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2J1bGJkaXNwbGF5L2J1bGJkaXNwbGF5JyksXG4gICAgSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuL2hpc3RvcnkvZm9ybScpLFxuICAgIERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBTZXJ2ZXJJbnRlcmZhY2UgPSByZXF1aXJlKCcuL3NlcnZlcmludGVyZmFjZS9tb2R1bGUnKSxcbiAgICBUaW1lciA9IHJlcXVpcmUoJ2NvcmUvdXRpbC90aW1lcicpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpLFxuICAgIEV4cGVyaW1lbnRSZXBvcnRlciA9IHJlcXVpcmUoJy4vcmVwb3J0ZXIvcmVwb3J0ZXInKVxuICA7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIGNsYXNzIEV4cGVyaW1lbnRNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19ob29rSW50ZXJhY3RpdmVUYWJzJywgJ19vblJ1blJlcXVlc3QnLCAnX29uR2xvYmFsc0NoYW5nZScsXG4gICAgICAgICdfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlJywgJ19vbkRyeVJ1blJlcXVlc3QnLCAnX29uRHJ5UnVuVGljaycsXG4gICAgICAgICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3RXhwZXJpbWVudFJlcXVlc3QnLCAnX29uQWdncmVnYXRlUmVxdWVzdCcsXG4gICAgICAgICdfaG9va1BhbmVsQ29udGVudHMnLCAnX29uU2VydmVyVXBkYXRlJywgJ19vblNlcnZlclJlc3VsdHMnLCAnX29uU2VydmVyRmFpbHVyZScsXG4gICAgICAgICdfb25SZXN1bHRzRG9udFNlbmQnLCAnX29uUmVzdWx0c1NlbmQnLCAnX29uUGhhc2VDaGFuZ2UnXG4gICAgICBdKTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQnKSkge1xuICAgICAgICBsZXQgcHJvbWlzZTtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5ldWdsZW5hU2VydmVyTW9kZScpID09IFwiZGVtb1wiKSB7XG4gICAgICAgICAgcHJvbWlzZSA9IHRoaXMuX2xvYWREZW1vSGlzdG9yeSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGljSGlzdG9yeSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3Jywgc3RhdGljSGlzdG9yeSA/IGZhbHNlIDogdHJ1ZSlcblxuICAgICAgICAgIC8vIDEuIENyZWF0ZSB0aGUgaGlzdG9yeSBmb3JtXG4gICAgICAgICAgdGhpcy5faGlzdG9yeSA9IG5ldyBIaXN0b3J5Rm9ybSgpO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuXG4gICAgICAgICAgLy8gMi4gQ3JlYXRlIHRoZSB0YWIgYW5kIGFkZCB0aGUgaGlzdG9yeSBmb3JtIHRvIGl0LlxuICAgICAgICAgIHRoaXMuX3RhYlZpZXcgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J3RhYl9fZXhwZXJpbWVudCc+PC9kaXY+XCIpO1xuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5faGlzdG9yeS52aWV3KCkpO1xuXG4gICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZChuZXcgRG9tVmlldyhcIjxkaXYgaWQ9J2V4cFByb3RvY29sX190aXRsZSc+IEV4cGVyaW1lbnQgUHJvdG9jb2w6IDwvZGl2PlwiKSk7XG5cbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJyk9PSd0YWJsZScpIHtcblxuICAgICAgICAgICAgLy8gMy4gQ3JlYXRlIHRoZSBleHBlcmltZW50YXRpb24gZm9ybVxuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybSA9IG5ldyBFeHBlcmltZW50VGFibGVGb3JtKCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5EcnlSdW4nLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5TdWJtaXQnLCB0aGlzLl9vblJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdFeHBlcmltZW50UmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcblxuICAgICAgICAgICAgLy8gNC4gQWRkIHRoZSBjb25maWdGb3JtIHRvIHRoZSB0YWJcbiAgICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fY29uZmlnRm9ybS52aWV3KCkpO1xuXG4gICAgICAgICAgICAvLyA1LiBDcmVhdGUgdGhlIGRyeVJ1biBzcGVjaWZpY2F0aW9uc1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzID0gTGlnaHREaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMTUwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMgPSBCdWxiRGlzcGxheS5jcmVhdGUoe1xuICAgICAgICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDE1MFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX2RyVGltZURpc3BsYXkgPSBuZXcgRG9tVmlldygnPHNwYW4gY2xhc3M9XCJkcnlfcnVuX190aW1lXCI+PC9zcGFuPicpXG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLiRkb20oKS5vbignY2xpY2snLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLiRkb20oKS5vbignY2xpY2snLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9kclRpbWVEaXNwbGF5LCAnLmxpZ2h0LWRpc3BsYXlfX2NvbnRlbnQnKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gbmV3IFRpbWVyKHtcbiAgICAgICAgICAgICAgZHVyYXRpb246IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpLFxuICAgICAgICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgICAgICAgcmF0ZTogNFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyLmFkZEV2ZW50TGlzdGVuZXIoJ1RpbWVyLlRpY2snLCB0aGlzLl9vbkRyeVJ1blRpY2spO1xuICAgICAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcblxuICAgICAgICAgICAgLy8gNi4gQ3JlYXRlIHRoZSBkcnlSdW4gdmlld1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuVmlldyA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0nZHJ5X3J1bic+PC9kaXY+XCIpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5MaWdodHMudmlldygpKTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuQnVsYnMudmlldygpKTtcblxuICAgICAgICAgICAgLy8gNy4gQWRkIHRoZSBkcnlSdW5WaWV3IHRvIHRoZSB0YWJcbiAgICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuVmlldyk7XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50Rm9ybScpID09ICduYXJyYXRpdmUnKXtcblxuICAgICAgICAgICAgLy8gMi4gQ3JlYXRlIHRoZSBleHBlcmltZW50YXRpb24gZm9ybSB0aGF0IGNvbnRhaW5zXG4gICAgICAgICAgICAvLyBhLiBleHBlcmltZW50IGRlc2NyaXB0b3JcbiAgICAgICAgICAgIC8vIGIuIGV4cGVyaW1lbnQgc2V0dXBcbiAgICAgICAgICAgIC8vIGMuIGV4cGVyaW1lbnQgcHJvdG9jb2xcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0gPSBuZXcgRXhwZXJpbWVudE5hcnJhdGl2ZUZvcm0oKTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LlN1Ym1pdCcsIHRoaXMuX29uUnVuUmVxdWVzdCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Lk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0KTtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgICAvLyAzLiBBZGQgdGhlIGNvbmZpZ0Zvcm0gYW5kIGV4cGVyaW1lbnRWaWV3IHRvIHRoZSB0YWIuXG4gICAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpKTtcblxuICAgICAgICAgICAgLy8gNC4gQ3JlYXRlIHZpc3VhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgZXhwZXJpbWVudCBwcm90b2NvbFxuXG4gICAgICAgICAgICAvLyA1LiBDcmVhdGUgdGhlIGRyeVJ1biBzcGVjaWZpY2F0aW9uc1xuICAgICAgICAgICAgdGhpcy5fZXhwVml6TGlnaHRzID0gW11cbiAgICAgICAgICAgIGZvciAodmFyIG51bVBhbmVscyA9IDA7IG51bVBhbmVscyA8IDQ7IG51bVBhbmVscysrKSB7XG4gICAgICAgICAgICAgIGxldCBuZXdMaWdodHMgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0MFxuICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIG5ld0xpZ2h0cy5yZW5kZXIoe1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICByaWdodDogMFxuICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIGxldCBfdGltZURpc3BsYXkgPSBuZXcgRG9tVmlldygnPGRpdj4nICsgKG51bVBhbmVscyArIDEpICsgJy48YnI+JyArIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSAvIDQuMCkgKyAnIHNlYyA8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgbGV0IF9icmlnaHRuZXNzRGlzcGxheSA9IG5ldyBEb21WaWV3KFwiPGRpdiBpZD0nZXhwX3Zpel9fYnJpZ2h0bmVzcyc+IExpZ2h0IDwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgbmV3TGlnaHRzLnZpZXcoKS5hZGRDaGlsZChfdGltZURpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuICAgICAgICAgICAgICBuZXdMaWdodHMudmlldygpLmFkZENoaWxkKF9icmlnaHRuZXNzRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG5cbiAgICAgICAgICAgICAgdGhpcy5fZXhwVml6TGlnaHRzLnB1c2gobmV3TGlnaHRzKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA2LiBDcmVhdGUgdGhlIFJlcHJlc2VudGF0aW9uIHZpZXdcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpeiA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0nZXhwX3Zpeic+PHNwYW4gaWQ9J3RpdGxlJz5WaXN1YWwgUmVwcmVzZW50YXRpb24gb2YgdGhlIEV4cGVyaW1lbnQ6PC9zcGFuPjwvZGl2PlwiKTtcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpei5hZGRDaGlsZChuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2V4cF92aXpfX2NvbnRhaW5lcic+PC9kaXY+XCIpKTtcbiAgICAgICAgICAgIHRoaXMuX2V4cFZpekxpZ2h0cy5mb3JFYWNoKChsaWdodHNEaXNwbGF5KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2V4cFZpei5fY2hpbGRyZW5bMF0uYWRkQ2hpbGQobGlnaHRzRGlzcGxheS52aWV3KCkpXG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICAgICAgdGhpcy5fZXhwVml6LmFkZENoaWxkKG5ldyBEb21WaWV3KFwiPHNwYW4+IFRvdGFsIGR1cmF0aW9uIGlzIFwiICsgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJykgKyBcIiBzZWNvbmRzLiA8L2Rpdj5cIikpO1xuXG4gICAgICAgICAgICAvLyA3LiBBZGQgdGhlIFJlcHJlc2VudGF0aW9uIFZpZXcgdG8gdGhlIHRhYlxuICAgICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9leHBWaXopO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIgPSBuZXcgRXhwZXJpbWVudFJlcG9ydGVyKCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLlNlbmQnLCB0aGlzLl9vblJlc3VsdHNTZW5kKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50UmVwb3J0ZXIuRG9udFNlbmQnLCB0aGlzLl9vblJlc3VsdHNEb250U2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuXG4gICAgICAgICAgdGhpcy5fc2V0RXhwZXJpbWVudE1vZGFsaXR5KCk7XG5cbiAgICAgICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIHRoaXMuX2hvb2tQYW5lbENvbnRlbnRzLCA5KTtcbiAgICAgICAgICBITS5ob29rKCdJbnRlcmFjdGl2ZVRhYnMuTGlzdFRhYnMnLCB0aGlzLl9ob29rSW50ZXJhY3RpdmVUYWJzLCAxMCk7XG4gICAgICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCB0aGlzLl9vblNlcnZlclVwZGF0ZSk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgdGhpcy5fb25TZXJ2ZXJSZXN1bHRzKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB0aGlzLl9vblNlcnZlckZhaWx1cmUpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0RXhwZXJpbWVudE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZUFuZEhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tQYW5lbENvbnRlbnRzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLmlkID09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgICAgICBsaXN0LnB1c2godGhpcy5fcmVwb3J0ZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09IFwic3R1ZGVudF9pZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgaWYgKGhpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICBleHBfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2xvYWRFeHBlcmltZW50SW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5wYXRoID09IFwiZXVnbGVuYVNlcnZlck1vZGVcIikge1xuICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUgPT0gXCJkZW1vXCIpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xvYWREZW1vSGlzdG9yeSgpIHtcbiAgICAgIGlmICghR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5JykpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzJywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgIGRlbW86IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoZXhwZXJpbWVudHMpID0+IHtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknLCBleHBlcmltZW50cy5tYXAoKGUpID0+IGUuaWQpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgIH1cblxuICAgIF9sb2FkRXhwZXJpbWVudEluRm9ybShpZCkge1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgbGV0IG9sZElkID0gdGhpcy5fY3VyckV4cElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvYWRFeHBlcmltZW50SW5Gb3JtJylcblxuICAgICAgICBpZiAoaWQgPT0gXCJfbmV3XCIpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyRXhwSWQgPSBudWxsO1xuICAgICAgICAgICAgLy92YXIgaW1wb3J0UGFyYW1zID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRGb3JtJykgPT0gJ3RhYmxlJyA/IFt7IGxlZnQ6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgdG9wOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IGJvdHRvbTogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyByaWdodDogMTAwLCBkdXJhdGlvbjogMTUgfV0gOiBbXTtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmltcG9ydCh7XG4gICAgICAgICAgICBsaWdodHM6IFt7IGxlZnQ6IDEwMCwgZHVyYXRpb246IDE1IH0sIHsgdG9wOiAxMDAsIGR1cmF0aW9uOiAxNSB9LCB7IGJvdHRvbTogMTAwLCBkdXJhdGlvbjogMTUgfSwgeyByaWdodDogMTAwLCBkdXJhdGlvbjogMTUgfV1cbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uc2V0U3RhdGUoJ25ldycpXG4gICAgICAgICAgICBpZiAodGhpcy5fZHJ5UnVuVmlldykge1xuICAgICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLnNob3coKTtcbiAgICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnQuTG9hZGVkJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50OiB7XG4gICAgICAgICAgICAgICAgaWQ6IFwiX25ld1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyRXhwSWQgPSBpZDtcbiAgICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FeHBlcmltZW50cy8ke2lkfWApXG4gICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaW1wb3J0KFxuICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHt9LFxuICAgICAgICAgICAgICAgIGRhdGEuZXhwRm9ybSxcbiAgICAgICAgICAgICAgICB7IGxpZ2h0czogZGF0YS5jb25maWd1cmF0aW9uIH1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5zZXRTdGF0ZSgnaGlzdG9yaWNhbCcpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RyeVJ1blZpZXcpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50LkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgZXhwZXJpbWVudDogZGF0YVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50RXhwZXJpbWVudCcsIGRhdGEpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJsb2FkXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogaWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tJbnRlcmFjdGl2ZVRhYnMobGlzdCwgbWV0YSkge1xuICAgICAgbGlzdC5wdXNoKHtcbiAgICAgICAgaWQ6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICB0aXRsZTogXCJFeHBlcmltZW50XCIsXG4gICAgICAgIHRhYlR5cGU6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICBjb250ZW50OiB0aGlzLl90YWJWaWV3XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAndGFibGUnKXtcbiAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEZvcm0nKSA9PSAnbmFycmF0aXZlJyl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb25maWdDaGFuZ2UnKVxuICAgICAgICBjb25zb2xlLmxvZyhldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEpXG4gICAgICAgIHZhciBsaWdodENvbmZpZyA9IHRoaXMuX2NvbmZpZ0Zvcm0uZ2V0TGlnaHRDb25maWd1cmF0aW9uKCk7XG4gICAgICAgIHZhciBsaWdodExldmVscyA9IHsnLTEnOiAnJywgJzAnOiAnb2ZmJywgJzI1JzogJ2RpbScsICc1MCc6ICdtZWRpdW0nLCAnNzUnOiAnYnJpZ2h0JywgJzEwMCc6ICd2LiBicmlnaHQnfTtcblxuICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgIHRoaXMuX2V4cFZpei5fY2hpbGRyZW5bMF0uX2NoaWxkcmVuW3BhbmVsXS5yZW5kZXIobGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXSlcbiAgICAgICAgICB0aGlzLl9leHBWaXouX2NoaWxkcmVuWzBdLl9jaGlsZHJlbltwYW5lbF0uJGVsLmZpbmQoJyNleHBfdml6X19icmlnaHRuZXNzJykuaHRtbChsaWdodExldmVsc1tsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25SdW5SZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKHRoaXMuX2RyeVJ1bkxpZ2h0cyAmIHRoaXMuX2RyeVJ1bkJ1bGJzKSB7IHRoaXMuX3Jlc2V0RHJ5UnVuKCk7IH1cbiAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnNldEZ1bGxzY3JlZW4odGhpcy5faGlzdG9yeS5oaXN0b3J5Q291bnQoKSA9PSAwKVxuICAgICAgICB0aGlzLl9yZXBvcnRlci5zaG93KCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRXhwZXJpbWVudFJlcXVlc3QnLCB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpKTsgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcImV4cGVyaW1lbnRfc3VibWlzc2lvblwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnJldmVydFRvTGFzdEhpc3RvcnkoKTtcbiAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5kaXNhYmxlTmV3KCk7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZU5ldygpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50X2Zvcm1fZXJyb3JcIixcbiAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZTogZXJyLnZhbGlkYXRpb24uZXJyb3JzLmpvaW4oJzxici8+JyksXG4gICAgICAgICAgYXV0b0V4cGlyZTogMTAsXG4gICAgICAgICAgZXhwaXJlTGFiZWw6IFwiR290IGl0XCJcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmV3RXhwZXJpbWVudFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IGV4cF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgfVxuXG4gICAgX29uQWdncmVnYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIEV1Z1V0aWxzLmdldExpdmVSZXN1bHRzKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5BZGRSZXF1ZXN0Jywge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdHNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJhZGRfYWdncmVnYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkRyeVJ1blJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fZmlyc3REcnlSdW4pIHtcbiAgICAgICAgdGhpcy5fZHJ5UnVuRGF0YSA9IHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KCkubGlnaHRzO1xuICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB0aGlzLl9maXJzdERyeVJ1biA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIucGF1c2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3Jlc2V0RHJ5UnVuKCkge1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnJlbmRlcih7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMFxuICAgICAgfSlcbiAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnJlbmRlcih7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMFxuICAgICAgfSlcbiAgICAgIHRoaXMuX2RyVGltZURpc3BsYXkuJGRvbSgpLmh0bWwoJycpO1xuICAgIH1cblxuICAgIF9vbkRyeVJ1blRpY2soZXZ0KSB7XG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5fdGltZXIudGltZSgpO1xuICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnJlbmRlcihFdWdVdGlscy5nZXRMaWdodFN0YXRlKHRoaXMuX2RyeVJ1bkRhdGEsIHRpbWUpKVxuICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMucmVuZGVyKEV1Z1V0aWxzLmdldExpZ2h0U3RhdGUodGhpcy5fZHJ5UnVuRGF0YSwgdGltZSkpXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKFV0aWxzLnNlY29uZHNUb1RpbWVTdHJpbmcodGltZSkpO1xuICAgIH1cblxuICAgIF9vblNlcnZlclVwZGF0ZShldnQpIHtcbiAgICAgIHRoaXMuX3JlcG9ydGVyLnVwZGF0ZShldnQuZGF0YSk7XG4gICAgfVxuICAgIF9vblNlcnZlclJlc3VsdHMoZXZ0KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KCk7XG4gICAgICAgIGlmIChoaXN0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgdGhpcy5fb25SZXN1bHRzU2VuZCh7XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0OiB7XG4gICAgICAgICAgICAgIHJlc3VsdHM6IGV2dC5kYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIudXBkYXRlKHsgc3RhdHVzOiBcImNvbXBsZXRlXCIsIHJlc3VsdHM6IGV2dC5kYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgX29uU2VydmVyRmFpbHVyZShldnQpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICB9XG5cbiAgICBfb25SZXN1bHRzU2VuZChldnQpIHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzXG4gICAgICBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzID0gbnVsbDtcbiAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgZXhwX2hpc3RvcnlfaWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkXG4gICAgICB9KVxuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdzZW5kX3Jlc3VsdCcsXG4gICAgICAgIGNhdGVnb3J5OiAnZXhwZXJpbWVudCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkLFxuICAgICAgICAgIHJlc3VsdElkOiByZXN1bHRzLmlkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIF9yZXN1bHRDbGVhbnVwKCkge1xuICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuICAgICAgdGhpcy5fY29uZmlnRm9ybS5lbmFibGVOZXcoKTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuZW5hYmxlTmV3KCk7XG4gICAgfVxuXG4gICAgX29uUmVzdWx0c0RvbnRTZW5kKGV2dCkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHNcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAnZG9udF9zZW5kX3Jlc3VsdCcsXG4gICAgICAgIGNhdGVnb3J5OiAnZXhwZXJpbWVudCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkLFxuICAgICAgICAgIHJlc3VsdElkOiByZXN1bHRzLmlkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBleHBfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEV4cGVyaW1lbnRNb2R1bGUucmVxdWlyZXMgPSBbU2VydmVySW50ZXJmYWNlXTtcbiAgcmV0dXJuIEV4cGVyaW1lbnRNb2R1bGU7XG59KVxuIl19
