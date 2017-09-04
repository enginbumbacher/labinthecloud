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
      ExperimentForm = require('./form/form'),
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

            _this2._configForm = new ExperimentForm();
            _this2._configForm.addEventListener('Form.FieldChanged', _this2._onConfigChange);
            _this2._configForm.view().addEventListener('Experiment.DryRun', _this2._onDryRunRequest);
            _this2._configForm.view().addEventListener('Experiment.Submit', _this2._onRunRequest);
            _this2._configForm.view().addEventListener('Experiment.NewRequest', _this2._onNewExperimentRequest);
            _this2._configForm.view().addEventListener('Experiment.AddToAggregate', _this2._onAggregateRequest);

            _this2._history = new HistoryForm();
            _this2._history.addEventListener('Form.FieldChanged', _this2._onHistorySelectionChange);

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

            _this2._reporter = new ExperimentReporter();
            _this2._reporter.addEventListener('ExperimentReporter.Send', _this2._onResultsSend);
            _this2._reporter.addEventListener('ExperimentReporter.DontSend', _this2._onResultsDontSend);
            _this2._reporter.hide();

            _this2._tabView = new DomView("<div class='tab__experiment'></div>");
            _this2._tabView.addChild(_this2._history.view());
            _this2._tabView.addChild(_this2._configForm.view());
            _this2._dryRunView = new DomView("<div class='dry_run'></div>");
            _this2._dryRunView.addChild(_this2._dryRunLights.view());
            _this2._dryRunView.addChild(_this2._dryRunBulbs.view());
            _this2._tabView.addChild(_this2._dryRunView);

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
            }).then(function () {
              _this4._configForm.setState('new');
              _this4._dryRunLights.view().show();
              _this4._dryRunBulbs.view().show();
              Globals.get('Relay').dispatchEvent('Experiment.Loaded', {
                experiment: {
                  id: "_new"
                }
              });
            });
          } else {
            this._currExpId = id;
            Utils.promiseAjax('/api/v1/Experiments/' + id).then(function (data) {
              _this4._configForm.import({
                lights: data.configuration
              });
              return data;
            }).then(function (data) {
              _this4._configForm.setState('historical');
              _this4._dryRunLights.view().hide();
              _this4._dryRunBulbs.view().hide();
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
        this._resetDryRun();
        this._firstDryRun = true;
      }
    }, {
      key: '_onRunRequest',
      value: function _onRunRequest(evt) {
        var _this5 = this;

        this._resetDryRun();
        this._configForm.validate().then(function (validation) {
          _this5._reporter.reset();
          _this5._reporter.setFullscreen(_this5._history.historyCount() == 0);
          _this5._reporter.show();
          Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentRequest', _this5._configForm.export());
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
        if (evt.data.phase == "login") {
          this._history.import({ exp_history_id: '_new' });
        }
      }
    }]);

    return ExperimentModule;
  }(Module);

  ExperimentModule.requires = [ServerInterface];
  return ExperimentModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50Rm9ybSIsIlV0aWxzIiwiTGlnaHREaXNwbGF5IiwiQnVsYkRpc3BsYXkiLCJIaXN0b3J5Rm9ybSIsIkRvbVZpZXciLCJTZXJ2ZXJJbnRlcmZhY2UiLCJUaW1lciIsIkV1Z1V0aWxzIiwiRXhwZXJpbWVudFJlcG9ydGVyIiwiRXhwZXJpbWVudE1vZHVsZSIsImJpbmRNZXRob2RzIiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwicHJvbWlzZSIsIl9sb2FkRGVtb0hpc3RvcnkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJzdGF0aWNIaXN0b3J5Iiwic2V0IiwiX2NvbmZpZ0Zvcm0iLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uRHJ5UnVuUmVxdWVzdCIsIl9vblJ1blJlcXVlc3QiLCJfb25OZXdFeHBlcmltZW50UmVxdWVzdCIsIl9vbkFnZ3JlZ2F0ZVJlcXVlc3QiLCJfaGlzdG9yeSIsIl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UiLCJfZHJ5UnVuTGlnaHRzIiwiY3JlYXRlIiwid2lkdGgiLCJoZWlnaHQiLCJfZHJ5UnVuQnVsYnMiLCJfZHJUaW1lRGlzcGxheSIsIiRkb20iLCJvbiIsImFkZENoaWxkIiwiX3RpbWVyIiwiZHVyYXRpb24iLCJsb29wIiwicmF0ZSIsIl9vblRpY2siLCJfcmVzZXREcnlSdW4iLCJfcmVwb3J0ZXIiLCJfb25SZXN1bHRzU2VuZCIsIl9vblJlc3VsdHNEb250U2VuZCIsImhpZGUiLCJfdGFiVmlldyIsIl9kcnlSdW5WaWV3IiwiaG9vayIsIl9ob29rUGFuZWxDb250ZW50cyIsIl9ob29rSW50ZXJhY3RpdmVUYWJzIiwiX29uR2xvYmFsc0NoYW5nZSIsIl9vblNlcnZlclVwZGF0ZSIsIl9vblNlcnZlclJlc3VsdHMiLCJfb25TZXJ2ZXJGYWlsdXJlIiwibGlzdCIsIm1ldGEiLCJpZCIsInB1c2giLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwiZXhwX2hpc3RvcnlfaWQiLCJfbG9hZEV4cGVyaW1lbnRJbkZvcm0iLCJleHBvcnQiLCJ2YWx1ZSIsInByb21pc2VBamF4IiwiZmlsdGVyIiwid2hlcmUiLCJkZW1vIiwiZXhwZXJpbWVudHMiLCJtYXAiLCJlIiwiY3VycmVudFRhcmdldCIsIm9sZElkIiwiX2N1cnJFeHBJZCIsInRhcmdldCIsImxpZ2h0cyIsImxlZnQiLCJ0b3AiLCJib3R0b20iLCJyaWdodCIsInNldFN0YXRlIiwic2hvdyIsImRpc3BhdGNoRXZlbnQiLCJleHBlcmltZW50IiwiY29uZmlndXJhdGlvbiIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImV4cGVyaW1lbnRJZCIsInRpdGxlIiwiY29udGVudCIsIl9maXJzdERyeVJ1biIsIl9kcnlSdW5EYXRhIiwic3RhcnQiLCJhY3RpdmUiLCJwYXVzZSIsInRpbWUiLCJyZW5kZXIiLCJnZXRMaWdodFN0YXRlIiwiaHRtbCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJzdG9wIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwicmVzZXQiLCJzZXRGdWxsc2NyZWVuIiwiaGlzdG9yeUNvdW50IiwicmV2ZXJ0VG9MYXN0SGlzdG9yeSIsImRpc2FibGVOZXciLCJjYXRjaCIsImVyciIsIm1lc3NhZ2UiLCJlcnJvcnMiLCJqb2luIiwiYXV0b0V4cGlyZSIsImV4cGlyZUxhYmVsIiwiZ2V0TGl2ZVJlc3VsdHMiLCJyZXN1bHRzIiwic3RhdHVzIiwiX3Jlc3VsdENsZWFudXAiLCJyZXN1bHRJZCIsImVuYWJsZU5ldyIsInBoYXNlIiwicmVxdWlyZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxR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QSxhQUFLM0IsV0FBTCxDQUFpQjhHLFNBQWpCO0FBQ0EsYUFBS3ZHLFFBQUwsQ0FBY3VHLFNBQWQ7QUFDRDtBQWpXZTtBQUFBO0FBQUEseUNBbVdHckUsR0FuV0gsRUFtV1E7QUFDdEIsWUFBTWlFLFVBQVVqRSxJQUFJbUIsYUFBSixDQUFrQjhDLE9BQWxDO0FBQ0EsYUFBS0UsY0FBTDtBQUNBcEksZ0JBQVFjLEdBQVIsQ0FBWSxRQUFaLEVBQXNCb0YsR0FBdEIsQ0FBMEI7QUFDeEJDLGdCQUFNLGtCQURrQjtBQUV4QkMsb0JBQVUsWUFGYztBQUd4QmxDLGdCQUFNO0FBQ0ptQywwQkFBYzZCLFFBQVE3QixZQURsQjtBQUVKZ0Msc0JBQVVILFFBQVFuRTtBQUZkO0FBSGtCLFNBQTFCO0FBUUQ7QUE5V2U7QUFBQTtBQUFBLHFDQWdYREUsR0FoWEMsRUFnWEk7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTcUUsS0FBVCxJQUFrQixPQUF0QixFQUErQjtBQUM3QixlQUFLeEcsUUFBTCxDQUFjeUMsTUFBZCxDQUFxQixFQUFFQyxnQkFBZ0IsTUFBbEIsRUFBckI7QUFDRDtBQUNGO0FBcFhlOztBQUFBO0FBQUEsSUFrQmExRSxNQWxCYjs7QUF1WGxCYSxtQkFBaUI0SCxRQUFqQixHQUE0QixDQUFDaEksZUFBRCxDQUE1QjtBQUNBLFNBQU9JLGdCQUFQO0FBQ0QsQ0F6WEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBFeHBlcmltZW50Rm9ybSA9IHJlcXVpcmUoJy4vZm9ybS9mb3JtJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBMaWdodERpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5JyksXG4gICAgQnVsYkRpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS9idWxiZGlzcGxheScpLFxuICAgIEhpc3RvcnlGb3JtID0gcmVxdWlyZSgnLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgU2VydmVySW50ZXJmYWNlID0gcmVxdWlyZSgnLi9zZXJ2ZXJpbnRlcmZhY2UvbW9kdWxlJyksXG4gICAgVGltZXIgPSByZXF1aXJlKCdjb3JlL3V0aWwvdGltZXInKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKSxcbiAgICBFeHBlcmltZW50UmVwb3J0ZXIgPSByZXF1aXJlKCcuL3JlcG9ydGVyL3JlcG9ydGVyJylcbiAgO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICBjbGFzcyBFeHBlcmltZW50TW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfaG9va0ludGVyYWN0aXZlVGFicycsICdfb25SdW5SZXF1ZXN0JywgJ19vbkdsb2JhbHNDaGFuZ2UnLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25EcnlSdW5SZXF1ZXN0JywgJ19vblRpY2snLFxuICAgICAgICAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0JywgJ19vbkFnZ3JlZ2F0ZVJlcXVlc3QnLFxuICAgICAgICAnX2hvb2tQYW5lbENvbnRlbnRzJywgJ19vblNlcnZlclVwZGF0ZScsICdfb25TZXJ2ZXJSZXN1bHRzJywgJ19vblNlcnZlckZhaWx1cmUnLFxuICAgICAgICAnX29uUmVzdWx0c0RvbnRTZW5kJywgJ19vblJlc3VsdHNTZW5kJywgJ19vblBoYXNlQ2hhbmdlJ1xuICAgICAgXSk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50JykpIHtcbiAgICAgICAgbGV0IHByb21pc2U7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXVnbGVuYVNlcnZlck1vZGUnKSA9PSBcImRlbW9cIikge1xuICAgICAgICAgIHByb21pc2UgPSB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRpY0hpc3RvcnkgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIHN0YXRpY0hpc3RvcnkgPyBmYWxzZSA6IHRydWUpXG5cbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtID0gbmV3IEV4cGVyaW1lbnRGb3JtKCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkRyeVJ1bicsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5TdWJtaXQnLCB0aGlzLl9vblJ1blJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3RXhwZXJpbWVudFJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgdGhpcy5faGlzdG9yeSA9IG5ldyBIaXN0b3J5Rm9ybSgpO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuXG4gICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzID0gTGlnaHREaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxNTBcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzID0gQnVsYkRpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDE1MFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8c3BhbiBjbGFzcz1cImRyeV9ydW5fX3RpbWVcIj48L3NwYW4+JylcbiAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLiRkb20oKS5vbignY2xpY2snLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS4kZG9tKCkub24oJ2NsaWNrJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmFkZENoaWxkKHRoaXMuX2RyVGltZURpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuICAgICAgICAgIHRoaXMuX3RpbWVyID0gbmV3IFRpbWVyKHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSxcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgcmF0ZTogNFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuVGljaycsIHRoaXMuX29uVGljayk7XG4gICAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcblxuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyID0gbmV3IEV4cGVyaW1lbnRSZXBvcnRlcigpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRSZXBvcnRlci5TZW5kJywgdGhpcy5fb25SZXN1bHRzU2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLkRvbnRTZW5kJywgdGhpcy5fb25SZXN1bHRzRG9udFNlbmQpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmhpZGUoKTtcblxuICAgICAgICAgIHRoaXMuX3RhYlZpZXcgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J3RhYl9fZXhwZXJpbWVudCc+PC9kaXY+XCIpO1xuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5faGlzdG9yeS52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fY29uZmlnRm9ybS52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2RyeV9ydW4nPjwvZGl2PlwiKTtcbiAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuQnVsYnMudmlldygpKTtcbiAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1blZpZXcpO1xuXG5cbiAgICAgICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIHRoaXMuX2hvb2tQYW5lbENvbnRlbnRzLCA5KTtcbiAgICAgICAgICBITS5ob29rKCdJbnRlcmFjdGl2ZVRhYnMuTGlzdFRhYnMnLCB0aGlzLl9ob29rSW50ZXJhY3RpdmVUYWJzLCAxMCk7XG4gICAgICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCB0aGlzLl9vblNlcnZlclVwZGF0ZSk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgdGhpcy5fb25TZXJ2ZXJSZXN1bHRzKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB0aGlzLl9vblNlcnZlckZhaWx1cmUpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va1BhbmVsQ29udGVudHMobGlzdCwgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuaWQgPT0gXCJpbnRlcmFjdGl2ZVwiKSB7XG4gICAgICAgIGxpc3QucHVzaCh0aGlzLl9yZXBvcnRlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJzdHVkZW50X2lkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KClcbiAgICAgICAgICBpZiAoaGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICAgIGV4cF9oaXN0b3J5X2lkOiBoaXN0W2hpc3QubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0odGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJldWdsZW5hU2VydmVyTW9kZVwiKSB7XG4gICAgICAgIGlmIChldnQuZGF0YS52YWx1ZSA9PSBcImRlbW9cIikge1xuICAgICAgICAgIHRoaXMuX2xvYWREZW1vSGlzdG9yeSgpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JywgZmFsc2UpO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfbG9hZERlbW9IaXN0b3J5KCkge1xuICAgICAgaWYgKCFHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknKSkge1xuICAgICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMnLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgZGVtbzogdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChleHBlcmltZW50cykgPT4ge1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScsIGV4cGVyaW1lbnRzLm1hcCgoZSkgPT4gZS5pZCkpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sb2FkRXhwZXJpbWVudEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCk7XG4gICAgfVxuXG4gICAgX2xvYWRFeHBlcmltZW50SW5Gb3JtKGlkKSB7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBsZXQgb2xkSWQgPSB0aGlzLl9jdXJyRXhwSWQ7XG4gICAgICBsZXQgdGFyZ2V0ID0gaWQgPT0gJ19uZXcnID8gbnVsbCA6IGlkO1xuICAgICAgaWYgKG9sZElkICE9IHRhcmdldCkge1xuICAgICAgICBpZiAoaWQgPT0gXCJfbmV3XCIpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyRXhwSWQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaW1wb3J0KHtcbiAgICAgICAgICAgIGxpZ2h0czogW3tcbiAgICAgICAgICAgICAgbGVmdDogMTAwLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgdG9wOiAxMDAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBib3R0b206IDEwMCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIHJpZ2h0OiAxMDAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgICAgICAgfV1cbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uc2V0U3RhdGUoJ25ldycpXG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50LkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgZXhwZXJpbWVudDoge1xuICAgICAgICAgICAgICAgIGlkOiBcIl9uZXdcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fY3VyckV4cElkID0gaWQ7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXhwZXJpbWVudHMvJHtpZH1gKVxuICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmltcG9ydCh7XG4gICAgICAgICAgICAgIGxpZ2h0czogZGF0YS5jb25maWd1cmF0aW9uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uc2V0U3RhdGUoJ2hpc3RvcmljYWwnKTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnQuTG9hZGVkJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50OiBkYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRFeHBlcmltZW50JywgZGF0YSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va0ludGVyYWN0aXZlVGFicyhsaXN0LCBtZXRhKSB7XG4gICAgICBsaXN0LnB1c2goe1xuICAgICAgICBpZDogXCJleHBlcmltZW50XCIsXG4gICAgICAgIHRpdGxlOiBcIkV4cGVyaW1lbnRcIixcbiAgICAgICAgY29udGVudDogdGhpcy5fdGFiVmlld1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBfb25EcnlSdW5SZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKHRoaXMuX2ZpcnN0RHJ5UnVuKSB7XG4gICAgICAgIHRoaXMuX2RyeVJ1bkRhdGEgPSB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpLmxpZ2h0cztcbiAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICAgIHRoaXMuX3RpbWVyLnBhdXNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5fdGltZXIudGltZSgpO1xuICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnJlbmRlcihFdWdVdGlscy5nZXRMaWdodFN0YXRlKHRoaXMuX2RyeVJ1bkRhdGEsIHRpbWUpKVxuICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMucmVuZGVyKEV1Z1V0aWxzLmdldExpZ2h0U3RhdGUodGhpcy5fZHJ5UnVuRGF0YSwgdGltZSkpXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKFV0aWxzLnNlY29uZHNUb1RpbWVTdHJpbmcodGltZSkpO1xuICAgIH1cblxuICAgIF9yZXNldERyeVJ1bigpIHtcbiAgICAgIHRoaXMuX3RpbWVyLnN0b3AoKTtcbiAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kcnlSdW5CdWxicy5yZW5kZXIoe1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKCcnKTtcbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSB0cnVlO1xuICAgIH1cblxuICAgIF9vblJ1blJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgdGhpcy5fY29uZmlnRm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIuc2V0RnVsbHNjcmVlbih0aGlzLl9oaXN0b3J5Lmhpc3RvcnlDb3VudCgpID09IDApXG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnNob3coKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5FeHBlcmltZW50UmVxdWVzdCcsIHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KCkpO1xuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcImV4cGVyaW1lbnRfc3VibWlzc2lvblwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnJldmVydFRvTGFzdEhpc3RvcnkoKTtcbiAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5kaXNhYmxlTmV3KCk7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZU5ldygpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50X2Zvcm1fZXJyb3JcIixcbiAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZTogZXJyLnZhbGlkYXRpb24uZXJyb3JzLmpvaW4oJzxici8+JyksXG4gICAgICAgICAgYXV0b0V4cGlyZTogMTAsXG4gICAgICAgICAgZXhwaXJlTGFiZWw6IFwiR290IGl0XCJcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmV3RXhwZXJpbWVudFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IGV4cF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgfVxuXG4gICAgX29uQWdncmVnYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIEV1Z1V0aWxzLmdldExpdmVSZXN1bHRzKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5BZGRSZXF1ZXN0Jywge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdHNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJhZGRfYWdncmVnYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblNlcnZlclVwZGF0ZShldnQpIHtcbiAgICAgIHRoaXMuX3JlcG9ydGVyLnVwZGF0ZShldnQuZGF0YSk7XG4gICAgfVxuICAgIF9vblNlcnZlclJlc3VsdHMoZXZ0KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KCk7XG4gICAgICAgIGlmIChoaXN0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgdGhpcy5fb25SZXN1bHRzU2VuZCh7XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0OiB7XG4gICAgICAgICAgICAgIHJlc3VsdHM6IGV2dC5kYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIudXBkYXRlKHsgc3RhdHVzOiBcImNvbXBsZXRlXCIsIHJlc3VsdHM6IGV2dC5kYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgX29uU2VydmVyRmFpbHVyZShldnQpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICB9XG5cbiAgICBfb25SZXN1bHRzU2VuZChldnQpIHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzXG4gICAgICBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzID0gbnVsbDtcbiAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgZXhwX2hpc3RvcnlfaWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkXG4gICAgICB9KVxuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdzZW5kX3Jlc3VsdCcsXG4gICAgICAgIGNhdGVnb3J5OiAnZXhwZXJpbWVudCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkLFxuICAgICAgICAgIHJlc3VsdElkOiByZXN1bHRzLmlkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIF9yZXN1bHRDbGVhbnVwKCkge1xuICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuICAgICAgdGhpcy5fY29uZmlnRm9ybS5lbmFibGVOZXcoKTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuZW5hYmxlTmV3KCk7XG4gICAgfVxuXG4gICAgX29uUmVzdWx0c0RvbnRTZW5kKGV2dCkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHNcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAnZG9udF9zZW5kX3Jlc3VsdCcsXG4gICAgICAgIGNhdGVnb3J5OiAnZXhwZXJpbWVudCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkLFxuICAgICAgICAgIHJlc3VsdElkOiByZXN1bHRzLmlkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBFeHBlcmltZW50TW9kdWxlLnJlcXVpcmVzID0gW1NlcnZlckludGVyZmFjZV07XG4gIHJldHVybiBFeHBlcmltZW50TW9kdWxlO1xufSlcbiJdfQ==
