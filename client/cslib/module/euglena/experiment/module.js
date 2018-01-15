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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50Rm9ybSIsIlV0aWxzIiwiTGlnaHREaXNwbGF5IiwiQnVsYkRpc3BsYXkiLCJIaXN0b3J5Rm9ybSIsIkRvbVZpZXciLCJTZXJ2ZXJJbnRlcmZhY2UiLCJUaW1lciIsIkV1Z1V0aWxzIiwiRXhwZXJpbWVudFJlcG9ydGVyIiwiRXhwZXJpbWVudE1vZHVsZSIsImJpbmRNZXRob2RzIiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwicHJvbWlzZSIsIl9sb2FkRGVtb0hpc3RvcnkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJzdGF0aWNIaXN0b3J5Iiwic2V0IiwiX2NvbmZpZ0Zvcm0iLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uRHJ5UnVuUmVxdWVzdCIsIl9vblJ1blJlcXVlc3QiLCJfb25OZXdFeHBlcmltZW50UmVxdWVzdCIsIl9vbkFnZ3JlZ2F0ZVJlcXVlc3QiLCJfaGlzdG9yeSIsIl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UiLCJfZHJ5UnVuTGlnaHRzIiwiY3JlYXRlIiwid2lkdGgiLCJoZWlnaHQiLCJfZHJ5UnVuQnVsYnMiLCJfZHJUaW1lRGlzcGxheSIsIiRkb20iLCJvbiIsImFkZENoaWxkIiwiX3RpbWVyIiwiZHVyYXRpb24iLCJsb29wIiwicmF0ZSIsIl9vblRpY2siLCJfcmVzZXREcnlSdW4iLCJfcmVwb3J0ZXIiLCJfb25SZXN1bHRzU2VuZCIsIl9vblJlc3VsdHNEb250U2VuZCIsImhpZGUiLCJfdGFiVmlldyIsIl9kcnlSdW5WaWV3IiwiX3NldEV4cGVyaW1lbnRNb2RhbGl0eSIsImhvb2siLCJfaG9va1BhbmVsQ29udGVudHMiLCJfaG9va0ludGVyYWN0aXZlVGFicyIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25TZXJ2ZXJVcGRhdGUiLCJfb25TZXJ2ZXJSZXN1bHRzIiwiX29uU2VydmVyRmFpbHVyZSIsInRvTG93ZXJDYXNlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJsaXN0IiwibWV0YSIsImlkIiwicHVzaCIsImV2dCIsImRhdGEiLCJwYXRoIiwidXBkYXRlIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJleHBfaGlzdG9yeV9pZCIsIl9sb2FkRXhwZXJpbWVudEluRm9ybSIsImV4cG9ydCIsInZhbHVlIiwicHJvbWlzZUFqYXgiLCJmaWx0ZXIiLCJ3aGVyZSIsImRlbW8iLCJleHBlcmltZW50cyIsIm1hcCIsImUiLCJjdXJyZW50VGFyZ2V0Iiwib2xkSWQiLCJfY3VyckV4cElkIiwidGFyZ2V0IiwibGlnaHRzIiwibGVmdCIsInRvcCIsImJvdHRvbSIsInJpZ2h0Iiwic2V0U3RhdGUiLCJzaG93IiwiZGlzcGF0Y2hFdmVudCIsImV4cGVyaW1lbnQiLCJjb25maWd1cmF0aW9uIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZXhwZXJpbWVudElkIiwidGl0bGUiLCJ0YWJUeXBlIiwiY29udGVudCIsIl9maXJzdERyeVJ1biIsIl9kcnlSdW5EYXRhIiwic3RhcnQiLCJhY3RpdmUiLCJwYXVzZSIsInRpbWUiLCJyZW5kZXIiLCJnZXRMaWdodFN0YXRlIiwiaHRtbCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJzdG9wIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwicmVzZXQiLCJzZXRGdWxsc2NyZWVuIiwiaGlzdG9yeUNvdW50IiwicmV2ZXJ0VG9MYXN0SGlzdG9yeSIsImRpc2FibGVOZXciLCJjYXRjaCIsImVyciIsIm1lc3NhZ2UiLCJlcnJvcnMiLCJqb2luIiwiYXV0b0V4cGlyZSIsImV4cGlyZUxhYmVsIiwiZ2V0TGl2ZVJlc3VsdHMiLCJyZXN1bHRzIiwic3RhdHVzIiwiX3Jlc3VsdENsZWFudXAiLCJyZXN1bHRJZCIsImVuYWJsZU5ldyIsInBoYXNlIiwicmVx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QUosQ0FBU3NFLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkJ2RSxJQUFJQyxJQUFKLENBQVNzRSxLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLN0csUUFBTCxDQUFjNkMsTUFBZCxDQUFxQixFQUFFQyxnQkFBZ0IsTUFBbEIsRUFBckI7QUFDRDtBQUNGO0FBeFllOztBQUFBO0FBQUEsSUFrQmE5RSxNQWxCYjs7QUEyWWxCYSxtQkFBaUJpSSxRQUFqQixHQUE0QixDQUFDckksZUFBRCxDQUE1QjtBQUNBLFNBQU9JLGdCQUFQO0FBQ0QsQ0E3WUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBFeHBlcmltZW50Rm9ybSA9IHJlcXVpcmUoJy4vZm9ybS9mb3JtJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBMaWdodERpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5JyksXG4gICAgQnVsYkRpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS9idWxiZGlzcGxheScpLFxuICAgIEhpc3RvcnlGb3JtID0gcmVxdWlyZSgnLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgU2VydmVySW50ZXJmYWNlID0gcmVxdWlyZSgnLi9zZXJ2ZXJpbnRlcmZhY2UvbW9kdWxlJyksXG4gICAgVGltZXIgPSByZXF1aXJlKCdjb3JlL3V0aWwvdGltZXInKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKSxcbiAgICBFeHBlcmltZW50UmVwb3J0ZXIgPSByZXF1aXJlKCcuL3JlcG9ydGVyL3JlcG9ydGVyJylcbiAgO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICBjbGFzcyBFeHBlcmltZW50TW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfaG9va0ludGVyYWN0aXZlVGFicycsICdfb25SdW5SZXF1ZXN0JywgJ19vbkdsb2JhbHNDaGFuZ2UnLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25EcnlSdW5SZXF1ZXN0JywgJ19vblRpY2snLFxuICAgICAgICAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0JywgJ19vbkFnZ3JlZ2F0ZVJlcXVlc3QnLFxuICAgICAgICAnX2hvb2tQYW5lbENvbnRlbnRzJywgJ19vblNlcnZlclVwZGF0ZScsICdfb25TZXJ2ZXJSZXN1bHRzJywgJ19vblNlcnZlckZhaWx1cmUnLFxuICAgICAgICAnX29uUmVzdWx0c0RvbnRTZW5kJywgJ19vblJlc3VsdHNTZW5kJywgJ19vblBoYXNlQ2hhbmdlJ1xuICAgICAgXSk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50JykpIHtcbiAgICAgICAgbGV0IHByb21pc2U7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXVnbGVuYVNlcnZlck1vZGUnKSA9PSBcImRlbW9cIikge1xuICAgICAgICAgIHByb21pc2UgPSB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRpY0hpc3RvcnkgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIHN0YXRpY0hpc3RvcnkgPyBmYWxzZSA6IHRydWUpXG5cbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtID0gbmV3IEV4cGVyaW1lbnRGb3JtKCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkRyeVJ1bicsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5TdWJtaXQnLCB0aGlzLl9vblJ1blJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3RXhwZXJpbWVudFJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgdGhpcy5faGlzdG9yeSA9IG5ldyBIaXN0b3J5Rm9ybSgpO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuXG4gICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzID0gTGlnaHREaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxNTBcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzID0gQnVsYkRpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDE1MFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8c3BhbiBjbGFzcz1cImRyeV9ydW5fX3RpbWVcIj48L3NwYW4+JylcbiAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLiRkb20oKS5vbignY2xpY2snLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS4kZG9tKCkub24oJ2NsaWNrJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmFkZENoaWxkKHRoaXMuX2RyVGltZURpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuICAgICAgICAgIHRoaXMuX3RpbWVyID0gbmV3IFRpbWVyKHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSxcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgcmF0ZTogNFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuVGljaycsIHRoaXMuX29uVGljayk7XG4gICAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcblxuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyID0gbmV3IEV4cGVyaW1lbnRSZXBvcnRlcigpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRSZXBvcnRlci5TZW5kJywgdGhpcy5fb25SZXN1bHRzU2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLkRvbnRTZW5kJywgdGhpcy5fb25SZXN1bHRzRG9udFNlbmQpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmhpZGUoKTtcblxuICAgICAgICAgIHRoaXMuX3RhYlZpZXcgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J3RhYl9fZXhwZXJpbWVudCc+PC9kaXY+XCIpO1xuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5faGlzdG9yeS52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fY29uZmlnRm9ybS52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2RyeV9ydW4nPjwvZGl2PlwiKTtcbiAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuQnVsYnMudmlldygpKTtcbiAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1blZpZXcpO1xuXG4gICAgICAgICAgdGhpcy5fc2V0RXhwZXJpbWVudE1vZGFsaXR5KCk7XG5cbiAgICAgICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIHRoaXMuX2hvb2tQYW5lbENvbnRlbnRzLCA5KTtcbiAgICAgICAgICBITS5ob29rKCdJbnRlcmFjdGl2ZVRhYnMuTGlzdFRhYnMnLCB0aGlzLl9ob29rSW50ZXJhY3RpdmVUYWJzLCAxMCk7XG4gICAgICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCB0aGlzLl9vblNlcnZlclVwZGF0ZSk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgdGhpcy5fb25TZXJ2ZXJSZXN1bHRzKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB0aGlzLl9vblNlcnZlckZhaWx1cmUpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0RXhwZXJpbWVudE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZUFuZEhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tQYW5lbENvbnRlbnRzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLmlkID09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgICAgICBsaXN0LnB1c2godGhpcy5fcmVwb3J0ZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09IFwic3R1ZGVudF9pZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgaWYgKGhpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICBleHBfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2xvYWRFeHBlcmltZW50SW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5wYXRoID09IFwiZXVnbGVuYVNlcnZlck1vZGVcIikge1xuICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUgPT0gXCJkZW1vXCIpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xvYWREZW1vSGlzdG9yeSgpIHtcbiAgICAgIGlmICghR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5JykpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzJywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgIGRlbW86IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoZXhwZXJpbWVudHMpID0+IHtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknLCBleHBlcmltZW50cy5tYXAoKGUpID0+IGUuaWQpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgIH1cblxuICAgIF9sb2FkRXhwZXJpbWVudEluRm9ybShpZCkge1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgbGV0IG9sZElkID0gdGhpcy5fY3VyckV4cElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkID09IFwiX25ld1wiKSB7XG4gICAgICAgICAgdGhpcy5fY3VyckV4cElkID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmltcG9ydCh7XG4gICAgICAgICAgICBsaWdodHM6IFt7XG4gICAgICAgICAgICAgIGxlZnQ6IDEwMCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIHRvcDogMTAwLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgYm90dG9tOiAxMDAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICByaWdodDogMTAwLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCduZXcnKVxuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBpZDogXCJfbmV3XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V4cGVyaW1lbnRzLyR7aWR9YClcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5pbXBvcnQoe1xuICAgICAgICAgICAgICBsaWdodHM6IGRhdGEuY29uZmlndXJhdGlvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJyk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50LkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgZXhwZXJpbWVudDogZGF0YVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50RXhwZXJpbWVudCcsIGRhdGEpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJsb2FkXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogaWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tJbnRlcmFjdGl2ZVRhYnMobGlzdCwgbWV0YSkge1xuICAgICAgbGlzdC5wdXNoKHtcbiAgICAgICAgaWQ6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICB0aXRsZTogXCJFeHBlcmltZW50XCIsXG4gICAgICAgIHRhYlR5cGU6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICBjb250ZW50OiB0aGlzLl90YWJWaWV3XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIF9vbkRyeVJ1blJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAodGhpcy5fZmlyc3REcnlSdW4pIHtcbiAgICAgICAgdGhpcy5fZHJ5UnVuRGF0YSA9IHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KCkubGlnaHRzO1xuICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB0aGlzLl9maXJzdERyeVJ1biA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuX3RpbWVyLmFjdGl2ZSgpKSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIucGF1c2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl90aW1lci5zdGFydCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVGljayhldnQpIHtcbiAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLl90aW1lci50aW1lKCk7XG4gICAgICB0aGlzLl9kcnlSdW5MaWdodHMucmVuZGVyKEV1Z1V0aWxzLmdldExpZ2h0U3RhdGUodGhpcy5fZHJ5UnVuRGF0YSwgdGltZSkpXG4gICAgICB0aGlzLl9kcnlSdW5CdWxicy5yZW5kZXIoRXVnVXRpbHMuZ2V0TGlnaHRTdGF0ZSh0aGlzLl9kcnlSdW5EYXRhLCB0aW1lKSlcbiAgICAgIHRoaXMuX2RyVGltZURpc3BsYXkuJGRvbSgpLmh0bWwoVXRpbHMuc2Vjb25kc1RvVGltZVN0cmluZyh0aW1lKSk7XG4gICAgfVxuXG4gICAgX3Jlc2V0RHJ5UnVuKCkge1xuICAgICAgdGhpcy5fdGltZXIuc3RvcCgpO1xuICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnJlbmRlcih7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMFxuICAgICAgfSlcbiAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnJlbmRlcih7XG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMFxuICAgICAgfSlcbiAgICAgIHRoaXMuX2RyVGltZURpc3BsYXkuJGRvbSgpLmh0bWwoJycpO1xuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG4gICAgICB0aGlzLl9maXJzdERyeVJ1biA9IHRydWU7XG4gICAgfVxuXG4gICAgX29uUnVuUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG4gICAgICB0aGlzLl9jb25maWdGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5yZXNldCgpO1xuICAgICAgICB0aGlzLl9yZXBvcnRlci5zZXRGdWxsc2NyZWVuKHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCkgPT0gMClcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIuc2hvdygpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkV4cGVyaW1lbnRSZXF1ZXN0JywgdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKSk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwiZXhwZXJpbWVudF9zdWJtaXNzaW9uXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX2hpc3RvcnkucmV2ZXJ0VG9MYXN0SGlzdG9yeSgpO1xuICAgICAgICB0aGlzLl9jb25maWdGb3JtLmRpc2FibGVOZXcoKTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlTmV3KCk7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRfZm9ybV9lcnJvclwiLFxuICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICBtZXNzYWdlOiBlcnIudmFsaWRhdGlvbi5lcnJvcnMuam9pbignPGJyLz4nKSxcbiAgICAgICAgICBhdXRvRXhwaXJlOiAxMCxcbiAgICAgICAgICBleHBpcmVMYWJlbDogXCJHb3QgaXRcIlxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OZXdFeHBlcmltZW50UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICB9XG5cbiAgICBfb25BZ2dyZWdhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgRXVnVXRpbHMuZ2V0TGl2ZVJlc3VsdHModGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFkZF9hZ2dyZWdhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiB0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uU2VydmVyVXBkYXRlKGV2dCkge1xuICAgICAgdGhpcy5fcmVwb3J0ZXIudXBkYXRlKGV2dC5kYXRhKTtcbiAgICB9XG4gICAgX29uU2VydmVyUmVzdWx0cyhldnQpIHtcbiAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKTtcbiAgICAgICAgaWYgKGhpc3QubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICB0aGlzLl9vblJlc3VsdHNTZW5kKHtcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQ6IHtcbiAgICAgICAgICAgICAgcmVzdWx0czogZXZ0LmRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci51cGRhdGUoeyBzdGF0dXM6IFwiY29tcGxldGVcIiwgcmVzdWx0czogZXZ0LmRhdGEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25TZXJ2ZXJGYWlsdXJlKGV2dCkge1xuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgIH1cblxuICAgIF9vblJlc3VsdHNTZW5kKGV2dCkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHNcbiAgICAgIGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHMgPSBudWxsO1xuICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICBleHBfaGlzdG9yeV9pZDogcmVzdWx0cy5leHBlcmltZW50SWRcbiAgICAgIH0pXG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3NlbmRfcmVzdWx0JyxcbiAgICAgICAgY2F0ZWdvcnk6ICdleHBlcmltZW50JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogcmVzdWx0cy5leHBlcmltZW50SWQsXG4gICAgICAgICAgcmVzdWx0SWQ6IHJlc3VsdHMuaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgX3Jlc3VsdENsZWFudXAoKSB7XG4gICAgICB0aGlzLl9yZXBvcnRlci5oaWRlKCk7XG4gICAgICB0aGlzLl9jb25maWdGb3JtLmVuYWJsZU5ldygpO1xuICAgICAgdGhpcy5faGlzdG9yeS5lbmFibGVOZXcoKTtcbiAgICB9XG5cbiAgICBfb25SZXN1bHRzRG9udFNlbmQoZXZ0KSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0c1xuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdkb250X3NlbmRfcmVzdWx0JyxcbiAgICAgICAgY2F0ZWdvcnk6ICdleHBlcmltZW50JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogcmVzdWx0cy5leHBlcmltZW50SWQsXG4gICAgICAgICAgcmVzdWx0SWQ6IHJlc3VsdHMuaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IGV4cF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgRXhwZXJpbWVudE1vZHVsZS5yZXF1aXJlcyA9IFtTZXJ2ZXJJbnRlcmZhY2VdO1xuICByZXR1cm4gRXhwZXJpbWVudE1vZHVsZTtcbn0pXG4iXX0=
