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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50Rm9ybSIsIlV0aWxzIiwiTGlnaHREaXNwbGF5IiwiQnVsYkRpc3BsYXkiLCJIaXN0b3J5Rm9ybSIsIkRvbVZpZXciLCJTZXJ2ZXJJbnRlcmZhY2UiLCJUaW1lciIsIkV1Z1V0aWxzIiwiRXhwZXJpbWVudFJlcG9ydGVyIiwiRXhwZXJpbWVudE1vZHVsZSIsImJpbmRNZXRob2RzIiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwicHJvbWlzZSIsIl9sb2FkRGVtb0hpc3RvcnkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJzdGF0aWNIaXN0b3J5Iiwic2V0IiwiX2NvbmZpZ0Zvcm0iLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uRHJ5UnVuUmVxdWVzdCIsIl9vblJ1blJlcXVlc3QiLCJfb25OZXdFeHBlcmltZW50UmVxdWVzdCIsIl9vbkFnZ3JlZ2F0ZVJlcXVlc3QiLCJfaGlzdG9yeSIsIl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UiLCJfZHJ5UnVuTGlnaHRzIiwiY3JlYXRlIiwid2lkdGgiLCJoZWlnaHQiLCJfZHJ5UnVuQnVsYnMiLCJfZHJUaW1lRGlzcGxheSIsIiRkb20iLCJvbiIsImFkZENoaWxkIiwiX3RpbWVyIiwiZHVyYXRpb24iLCJsb29wIiwicmF0ZSIsIl9vblRpY2siLCJfcmVzZXREcnlSdW4iLCJfcmVwb3J0ZXIiLCJfb25SZXN1bHRzU2VuZCIsIl9vblJlc3VsdHNEb250U2VuZCIsImhpZGUiLCJfdGFiVmlldyIsIl9kcnlSdW5WaWV3IiwiaG9vayIsIl9ob29rUGFuZWxDb250ZW50cyIsIl9ob29rSW50ZXJhY3RpdmVUYWJzIiwiX29uR2xvYmFsc0NoYW5nZSIsIl9vblNlcnZlclVwZGF0ZSIsIl9vblNlcnZlclJlc3VsdHMiLCJfb25TZXJ2ZXJGYWlsdXJlIiwibGlzdCIsIm1ldGEiLCJpZCIsInB1c2giLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwiZXhwX2hpc3RvcnlfaWQiLCJfbG9hZEV4cGVyaW1lbnRJbkZvcm0iLCJleHBvcnQiLCJ2YWx1ZSIsInByb21pc2VBamF4IiwiZmlsdGVyIiwid2hlcmUiLCJkZW1vIiwiZXhwZXJpbWVudHMiLCJtYXAiLCJlIiwiY3VycmVudFRhcmdldCIsIm9sZElkIiwiX2N1cnJFeHBJZCIsInRhcmdldCIsImxpZ2h0cyIsImxlZnQiLCJ0b3AiLCJib3R0b20iLCJyaWdodCIsInNldFN0YXRlIiwic2hvdyIsImRpc3BhdGNoRXZlbnQiLCJleHBlcmltZW50IiwiY29uZmlndXJhdGlvbiIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImV4cGVyaW1lbnRJZCIsInRpdGxlIiwiY29udGVudCIsIl9maXJzdERyeVJ1biIsIl9kcnlSdW5EYXRhIiwic3RhcnQiLCJhY3RpdmUiLCJwYXVzZSIsInRpbWUiLCJyZW5kZXIiLCJnZXRMaWdodFN0YXRlIiwiaHRtbCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJzdG9wIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwicmVzZXQiLCJzZXRGdWxsc2NyZWVuIiwiaGlzdG9yeUNvdW50IiwicmV2ZXJ0VG9MYXN0SGlzdG9yeSIsImRpc2FibGVOZXciLCJjYXRjaCIsImVyciIsIm1lc3NhZ2UiLCJlcnJvcnMiLCJqb2luIiwiYXV0b0V4cGlyZSIsImV4cGlyZUxhYmVsIiwiZ2V0TGl2ZVJlc3VsdHMiLCJyZXN1bHRzIiwic3RhdHVzIiwiX3Jlc3VsdENsZWFudXAiLCJyZXN1bHRJZCIsImVuYWJsZU5ldyIsInBoYXNlIiwicmVxdWlyZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxR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QSxhQUFLM0IsV0FBTCxDQUFpQjhHLFNBQWpCO0FBQ0EsYUFBS3ZHLFFBQUwsQ0FBY3VHLFNBQWQ7QUFDRDtBQWpXZTtBQUFBO0FBQUEseUNBbVdHckUsR0FuV0gsRUFtV1E7QUFDdEIsWUFBTWlFLFVBQVVqRSxJQUFJbUIsYUFBSixDQUFrQjhDLE9BQWxDO0FBQ0EsYUFBS0UsY0FBTDtBQUNBcEksZ0JBQVFjLEdBQVIsQ0FBWSxRQUFaLEVBQXNCb0YsR0FBdEIsQ0FBMEI7QUFDeEJDLGdCQUFNLGtCQURrQjtBQUV4QkMsb0JBQVUsWUFGYztBQUd4QmxDLGdCQUFNO0FBQ0ptQywwQkFBYzZCLFFBQVE3QixZQURsQjtBQUVKZ0Msc0JBQVVILFFBQVFuRTtBQUZkO0FBSGtCLFNBQTFCO0FBUUQ7QUE5V2U7QUFBQTtBQUFBLHFDQWdYREUsR0FoWEMsRUFnWEk7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTcUUsS0FBVCxJQUFrQixPQUFsQixJQUE2QnRFLElBQUlDLElBQUosQ0FBU3FFLEtBQVQsSUFBa0IsaUJBQW5ELEVBQXNFO0FBQ3BFLGVBQUt4RyxRQUFMLENBQWN5QyxNQUFkLENBQXFCLEVBQUVDLGdCQUFnQixNQUFsQixFQUFyQjtBQUNEO0FBQ0Y7QUFwWGU7O0FBQUE7QUFBQSxJQWtCYTFFLE1BbEJiOztBQXVYbEJhLG1CQUFpQjRILFFBQWpCLEdBQTRCLENBQUNoSSxlQUFELENBQTVCO0FBQ0EsU0FBT0ksZ0JBQVA7QUFDRCxDQXpYRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIEV4cGVyaW1lbnRGb3JtID0gcmVxdWlyZSgnLi9mb3JtL2Zvcm0nKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIExpZ2h0RGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2xpZ2h0ZGlzcGxheS9saWdodGRpc3BsYXknKSxcbiAgICBCdWxiRGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2J1bGJkaXNwbGF5L2J1bGJkaXNwbGF5JyksXG4gICAgSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuL2hpc3RvcnkvZm9ybScpLFxuICAgIERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBTZXJ2ZXJJbnRlcmZhY2UgPSByZXF1aXJlKCcuL3NlcnZlcmludGVyZmFjZS9tb2R1bGUnKSxcbiAgICBUaW1lciA9IHJlcXVpcmUoJ2NvcmUvdXRpbC90aW1lcicpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpLFxuICAgIEV4cGVyaW1lbnRSZXBvcnRlciA9IHJlcXVpcmUoJy4vcmVwb3J0ZXIvcmVwb3J0ZXInKVxuICA7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIGNsYXNzIEV4cGVyaW1lbnRNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19ob29rSW50ZXJhY3RpdmVUYWJzJywgJ19vblJ1blJlcXVlc3QnLCAnX29uR2xvYmFsc0NoYW5nZScsXG4gICAgICAgICdfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlJywgJ19vbkRyeVJ1blJlcXVlc3QnLCAnX29uVGljaycsXG4gICAgICAgICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3RXhwZXJpbWVudFJlcXVlc3QnLCAnX29uQWdncmVnYXRlUmVxdWVzdCcsXG4gICAgICAgICdfaG9va1BhbmVsQ29udGVudHMnLCAnX29uU2VydmVyVXBkYXRlJywgJ19vblNlcnZlclJlc3VsdHMnLCAnX29uU2VydmVyRmFpbHVyZScsXG4gICAgICAgICdfb25SZXN1bHRzRG9udFNlbmQnLCAnX29uUmVzdWx0c1NlbmQnLCAnX29uUGhhc2VDaGFuZ2UnXG4gICAgICBdKTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQnKSkge1xuICAgICAgICBsZXQgcHJvbWlzZTtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5ldWdsZW5hU2VydmVyTW9kZScpID09IFwiZGVtb1wiKSB7XG4gICAgICAgICAgcHJvbWlzZSA9IHRoaXMuX2xvYWREZW1vSGlzdG9yeSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGljSGlzdG9yeSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3Jywgc3RhdGljSGlzdG9yeSA/IGZhbHNlIDogdHJ1ZSlcblxuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0gPSBuZXcgRXhwZXJpbWVudEZvcm0oKTtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuRHJ5UnVuJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LlN1Ym1pdCcsIHRoaXMuX29uUnVuUmVxdWVzdCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdFeHBlcmltZW50UmVxdWVzdCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZScsIHRoaXMuX29uQWdncmVnYXRlUmVxdWVzdCk7XG5cbiAgICAgICAgICB0aGlzLl9oaXN0b3J5ID0gbmV3IEhpc3RvcnlGb3JtKCk7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG5cbiAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDE1MFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMgPSBCdWxiRGlzcGxheS5jcmVhdGUoe1xuICAgICAgICAgICAgd2lkdGg6IDIwMCxcbiAgICAgICAgICAgIGhlaWdodDogMTUwXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9kclRpbWVEaXNwbGF5ID0gbmV3IERvbVZpZXcoJzxzcGFuIGNsYXNzPVwiZHJ5X3J1bl9fdGltZVwiPjwvc3Bhbj4nKVxuICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuJGRvbSgpLm9uKCdjbGljaycsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLiRkb20oKS5vbignY2xpY2snLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZHJUaW1lRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG4gICAgICAgICAgdGhpcy5fdGltZXIgPSBuZXcgVGltZXIoe1xuICAgICAgICAgICAgZHVyYXRpb246IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpLFxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICByYXRlOiA0XG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl90aW1lci5hZGRFdmVudExpc3RlbmVyKCdUaW1lci5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuXG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIgPSBuZXcgRXhwZXJpbWVudFJlcG9ydGVyKCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLlNlbmQnLCB0aGlzLl9vblJlc3VsdHNTZW5kKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50UmVwb3J0ZXIuRG9udFNlbmQnLCB0aGlzLl9vblJlc3VsdHNEb250U2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuXG4gICAgICAgICAgdGhpcy5fdGFiVmlldyA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0ndGFiX19leHBlcmltZW50Jz48L2Rpdj5cIik7XG4gICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG4gICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9jb25maWdGb3JtLnZpZXcoKSk7XG4gICAgICAgICAgdGhpcy5fZHJ5UnVuVmlldyA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0nZHJ5X3J1bic+PC9kaXY+XCIpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKSk7XG4gICAgICAgICAgdGhpcy5fZHJ5UnVuVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuVmlldyk7XG5cblxuICAgICAgICAgIEhNLmhvb2soJ1BhbmVsLkNvbnRlbnRzJywgdGhpcy5faG9va1BhbmVsQ29udGVudHMsIDkpO1xuICAgICAgICAgIEhNLmhvb2soJ0ludGVyYWN0aXZlVGFicy5MaXN0VGFicycsIHRoaXMuX2hvb2tJbnRlcmFjdGl2ZVRhYnMsIDEwKTtcbiAgICAgICAgICBHbG9iYWxzLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uR2xvYmFsc0NoYW5nZSk7XG5cbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLlVwZGF0ZScsIHRoaXMuX29uU2VydmVyVXBkYXRlKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLlJlc3VsdHMnLCB0aGlzLl9vblNlcnZlclJlc3VsdHMpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHRoaXMuX29uU2VydmVyRmFpbHVyZSk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rUGFuZWxDb250ZW50cyhsaXN0LCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS5pZCA9PSBcImludGVyYWN0aXZlXCIpIHtcbiAgICAgICAgbGlzdC5wdXNoKHRoaXMuX3JlcG9ydGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIF9vbkdsb2JhbHNDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSBcInN0dWRlbnRfaWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKVxuICAgICAgICAgIGlmIChoaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgICAgZXhwX2hpc3RvcnlfaWQ6IGhpc3RbaGlzdC5sZW5ndGggLSAxXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9sb2FkRXhwZXJpbWVudEluRm9ybSh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkKTtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEucGF0aCA9PSBcImV1Z2xlbmFTZXJ2ZXJNb2RlXCIpIHtcbiAgICAgICAgaWYgKGV2dC5kYXRhLnZhbHVlID09IFwiZGVtb1wiKSB7XG4gICAgICAgICAgdGhpcy5fbG9hZERlbW9IaXN0b3J5KCk7XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBmYWxzZSk7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9sb2FkRGVtb0hpc3RvcnkoKSB7XG4gICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScpKSB7XG4gICAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FeHBlcmltZW50cycsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICBkZW1vOiB0cnVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKGV4cGVyaW1lbnRzKSA9PiB7XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5JywgZXhwZXJpbWVudHMubWFwKChlKSA9PiBlLmlkKSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xvYWRFeHBlcmltZW50SW5Gb3JtKGV2dC5jdXJyZW50VGFyZ2V0LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkKTtcbiAgICB9XG5cbiAgICBfbG9hZEV4cGVyaW1lbnRJbkZvcm0oaWQpIHtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGxldCBvbGRJZCA9IHRoaXMuX2N1cnJFeHBJZDtcbiAgICAgIGxldCB0YXJnZXQgPSBpZCA9PSAnX25ldycgPyBudWxsIDogaWQ7XG4gICAgICBpZiAob2xkSWQgIT0gdGFyZ2V0KSB7XG4gICAgICAgIGlmIChpZCA9PSBcIl9uZXdcIikge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5pbXBvcnQoe1xuICAgICAgICAgICAgbGlnaHRzOiBbe1xuICAgICAgICAgICAgICBsZWZ0OiAxMDAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICB0b3A6IDEwMCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGJvdHRvbTogMTAwLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgcmlnaHQ6IDEwMCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICAgICAgICB9XVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMudmlldygpLnNob3coKTtcbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnQuTG9hZGVkJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50OiB7XG4gICAgICAgICAgICAgICAgaWQ6IFwiX25ld1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyRXhwSWQgPSBpZDtcbiAgICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FeHBlcmltZW50cy8ke2lkfWApXG4gICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uaW1wb3J0KHtcbiAgICAgICAgICAgICAgbGlnaHRzOiBkYXRhLmNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5zZXRTdGF0ZSgnaGlzdG9yaWNhbCcpO1xuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudEV4cGVyaW1lbnQnLCBkYXRhKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibG9hZFwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBleHBlcmltZW50SWQ6IGlkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rSW50ZXJhY3RpdmVUYWJzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGxpc3QucHVzaCh7XG4gICAgICAgIGlkOiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgdGl0bGU6IFwiRXhwZXJpbWVudFwiLFxuICAgICAgICBjb250ZW50OiB0aGlzLl90YWJWaWV3XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIF9vbkRyeVJ1blJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fZmlyc3REcnlSdW4pIHtcbiAgICAgICAgdGhpcy5fZHJ5UnVuRGF0YSA9IHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KCkubGlnaHRzO1xuICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB0aGlzLl9maXJzdERyeVJ1biA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIucGF1c2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLl90aW1lci50aW1lKCk7XG4gICAgICB0aGlzLl9kcnlSdW5MaWdodHMucmVuZGVyKEV1Z1V0aWxzLmdldExpZ2h0U3RhdGUodGhpcy5fZHJ5UnVuRGF0YSwgdGltZSkpXG4gICAgICB0aGlzLl9kcnlSdW5CdWxicy5yZW5kZXIoRXVnVXRpbHMuZ2V0TGlnaHRTdGF0ZSh0aGlzLl9kcnlSdW5EYXRhLCB0aW1lKSlcbiAgICAgIHRoaXMuX2RyVGltZURpc3BsYXkuJGRvbSgpLmh0bWwoVXRpbHMuc2Vjb25kc1RvVGltZVN0cmluZyh0aW1lKSk7XG4gICAgfVxuXG4gICAgX3Jlc2V0RHJ5UnVuKCkge1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnJlbmRlcih7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMFxuICAgICAgfSlcbiAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnJlbmRlcih7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMFxuICAgICAgfSlcbiAgICAgIHRoaXMuX2RyVGltZURpc3BsYXkuJGRvbSgpLmh0bWwoJycpO1xuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG4gICAgICB0aGlzLl9maXJzdERyeVJ1biA9IHRydWU7XG4gICAgfVxuXG4gICAgX29uUnVuUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG4gICAgICB0aGlzLl9jb25maWdGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5yZXNldCgpO1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5zZXRGdWxsc2NyZWVuKHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCkgPT0gMClcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIuc2hvdygpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkV4cGVyaW1lbnRSZXF1ZXN0JywgdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKSk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwiZXhwZXJpbWVudF9zdWJtaXNzaW9uXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX2hpc3RvcnkucmV2ZXJ0VG9MYXN0SGlzdG9yeSgpO1xuICAgICAgICB0aGlzLl9jb25maWdGb3JtLmRpc2FibGVOZXcoKTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlTmV3KCk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRfZm9ybV9lcnJvclwiLFxuICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICBtZXNzYWdlOiBlcnIudmFsaWRhdGlvbi5lcnJvcnMuam9pbignPGJyLz4nKSxcbiAgICAgICAgICBhdXRvRXhwaXJlOiAxMCxcbiAgICAgICAgICBleHBpcmVMYWJlbDogXCJHb3QgaXRcIlxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OZXdFeHBlcmltZW50UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICB9XG5cbiAgICBfb25BZ2dyZWdhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgRXVnVXRpbHMuZ2V0TGl2ZVJlc3VsdHModGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFkZF9hZ2dyZWdhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiB0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uU2VydmVyVXBkYXRlKGV2dCkge1xuICAgICAgdGhpcy5fcmVwb3J0ZXIudXBkYXRlKGV2dC5kYXRhKTtcbiAgICB9XG4gICAgX29uU2VydmVyUmVzdWx0cyhldnQpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKTtcbiAgICAgICAgaWYgKGhpc3QubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICB0aGlzLl9vblJlc3VsdHNTZW5kKHtcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQ6IHtcbiAgICAgICAgICAgICAgcmVzdWx0czogZXZ0LmRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci51cGRhdGUoeyBzdGF0dXM6IFwiY29tcGxldGVcIiwgcmVzdWx0czogZXZ0LmRhdGEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25TZXJ2ZXJGYWlsdXJlKGV2dCkge1xuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgIH1cblxuICAgIF9vblJlc3VsdHNTZW5kKGV2dCkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHNcbiAgICAgIGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHMgPSBudWxsO1xuICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICBleHBfaGlzdG9yeV9pZDogcmVzdWx0cy5leHBlcmltZW50SWRcbiAgICAgIH0pXG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3NlbmRfcmVzdWx0JyxcbiAgICAgICAgY2F0ZWdvcnk6ICdleHBlcmltZW50JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogcmVzdWx0cy5leHBlcmltZW50SWQsXG4gICAgICAgICAgcmVzdWx0SWQ6IHJlc3VsdHMuaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgX3Jlc3VsdENsZWFudXAoKSB7XG4gICAgICB0aGlzLl9yZXBvcnRlci5oaWRlKCk7XG4gICAgICB0aGlzLl9jb25maWdGb3JtLmVuYWJsZU5ldygpO1xuICAgICAgdGhpcy5faGlzdG9yeS5lbmFibGVOZXcoKTtcbiAgICB9XG5cbiAgICBfb25SZXN1bHRzRG9udFNlbmQoZXZ0KSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0c1xuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdkb250X3NlbmRfcmVzdWx0JyxcbiAgICAgICAgY2F0ZWdvcnk6ICdleHBlcmltZW50JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogcmVzdWx0cy5leHBlcmltZW50SWQsXG4gICAgICAgICAgcmVzdWx0SWQ6IHJlc3VsdHMuaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IGV4cF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgRXhwZXJpbWVudE1vZHVsZS5yZXF1aXJlcyA9IFtTZXJ2ZXJJbnRlcmZhY2VdO1xuICByZXR1cm4gRXhwZXJpbWVudE1vZHVsZTtcbn0pXG4iXX0=
