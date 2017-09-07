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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50Rm9ybSIsIlV0aWxzIiwiTGlnaHREaXNwbGF5IiwiQnVsYkRpc3BsYXkiLCJIaXN0b3J5Rm9ybSIsIkRvbVZpZXciLCJTZXJ2ZXJJbnRlcmZhY2UiLCJUaW1lciIsIkV1Z1V0aWxzIiwiRXhwZXJpbWVudFJlcG9ydGVyIiwiRXhwZXJpbWVudE1vZHVsZSIsImJpbmRNZXRob2RzIiwiZ2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwicHJvbWlzZSIsIl9sb2FkRGVtb0hpc3RvcnkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJzdGF0aWNIaXN0b3J5Iiwic2V0IiwiX2NvbmZpZ0Zvcm0iLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uRHJ5UnVuUmVxdWVzdCIsIl9vblJ1blJlcXVlc3QiLCJfb25OZXdFeHBlcmltZW50UmVxdWVzdCIsIl9vbkFnZ3JlZ2F0ZVJlcXVlc3QiLCJfaGlzdG9yeSIsIl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UiLCJfZHJ5UnVuTGlnaHRzIiwiY3JlYXRlIiwid2lkdGgiLCJoZWlnaHQiLCJfZHJ5UnVuQnVsYnMiLCJfZHJUaW1lRGlzcGxheSIsIiRkb20iLCJvbiIsImFkZENoaWxkIiwiX3RpbWVyIiwiZHVyYXRpb24iLCJsb29wIiwicmF0ZSIsIl9vblRpY2siLCJfcmVzZXREcnlSdW4iLCJfcmVwb3J0ZXIiLCJfb25SZXN1bHRzU2VuZCIsIl9vblJlc3VsdHNEb250U2VuZCIsImhpZGUiLCJfdGFiVmlldyIsIl9kcnlSdW5WaWV3IiwiX3NldEV4cGVyaW1lbnRNb2RhbGl0eSIsImhvb2siLCJfaG9va1BhbmVsQ29udGVudHMiLCJfaG9va0ludGVyYWN0aXZlVGFicyIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25TZXJ2ZXJVcGRhdGUiLCJfb25TZXJ2ZXJSZXN1bHRzIiwiX29uU2VydmVyRmFpbHVyZSIsInRvTG93ZXJDYXNlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJsaXN0IiwibWV0YSIsImlkIiwicHVzaCIsImV2dCIsImRhdGEiLCJwYXRoIiwidXBkYXRlIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJleHBfaGlzdG9yeV9pZCIsIl9sb2FkRXhwZXJpbWVudEluRm9ybSIsImV4cG9ydCIsInZhbHVlIiwicHJvbWlzZUFqYXgiLCJmaWx0ZXIiLCJ3aGVyZSIsImRlbW8iLCJleHBlcmltZW50cyIsIm1hcCIsImUiLCJjdXJyZW50VGFyZ2V0Iiwib2xkSWQiLCJfY3VyckV4cElkIiwidGFyZ2V0IiwibGlnaHRzIiwibGVmdCIsInRvcCIsImJvdHRvbSIsInJpZ2h0Iiwic2V0U3RhdGUiLCJzaG93IiwiZGlzcGF0Y2hFdmVudCIsImV4cGVyaW1lbnQiLCJjb25maWd1cmF0aW9uIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZXhwZXJpbWVudElkIiwidGl0bGUiLCJjb250ZW50IiwiX2ZpcnN0RHJ5UnVuIiwiX2RyeVJ1bkRhdGEiLCJzdGFydCIsImFjdGl2ZSIsInBhdXNlIiwidGltZSIsInJlbmRlciIsImdldExpZ2h0U3RhdGUiLCJodG1sIiwic2Vjb25kc1RvVGltZVN0cmluZyIsInN0b3AiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJyZXNldCIsInNldEZ1bGxzY3JlZW4iLCJoaXN0b3J5Q291bnQiLCJyZXZlcnRUb0xhc3RIaXN0b3J5IiwiZGlzYWJsZU5ldyIsImNhdGNoIiwiZXJyIiwibWVzc2FnZSIsImVycm9ycyIsImpvaW4iLCJhdXRvRXhwaXJlIiwiZXhwaXJlTGFiZWwiLCJnZXRMaXZlUmVzdWx0cyIsInJlc3VsdHMiLCJzdGF0dXMiLCJfcmVzdWx0Q2xlYW51cCIsInJlc3VsdElkIiwiZW5hYmxlTmV3IiwicGhhc2UiLCJyZXF1aXJlcyJdLCJt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SUFBNkJ0RSxJQUFJQyxJQUFKLENBQVNxRSxLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLNUcsUUFBTCxDQUFjNkMsTUFBZCxDQUFxQixFQUFFQyxnQkFBZ0IsTUFBbEIsRUFBckI7QUFDRDtBQUNGO0FBdlllOztBQUFBO0FBQUEsSUFrQmE5RSxNQWxCYjs7QUEwWWxCYSxtQkFBaUJnSSxRQUFqQixHQUE0QixDQUFDcEksZUFBRCxDQUE1QjtBQUNBLFNBQU9JLGdCQUFQO0FBQ0QsQ0E1WUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBFeHBlcmltZW50Rm9ybSA9IHJlcXVpcmUoJy4vZm9ybS9mb3JtJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBMaWdodERpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvbGlnaHRkaXNwbGF5JyksXG4gICAgQnVsYkRpc3BsYXkgPSByZXF1aXJlKCdldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS9idWxiZGlzcGxheScpLFxuICAgIEhpc3RvcnlGb3JtID0gcmVxdWlyZSgnLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgU2VydmVySW50ZXJmYWNlID0gcmVxdWlyZSgnLi9zZXJ2ZXJpbnRlcmZhY2UvbW9kdWxlJyksXG4gICAgVGltZXIgPSByZXF1aXJlKCdjb3JlL3V0aWwvdGltZXInKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKSxcbiAgICBFeHBlcmltZW50UmVwb3J0ZXIgPSByZXF1aXJlKCcuL3JlcG9ydGVyL3JlcG9ydGVyJylcbiAgO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICBjbGFzcyBFeHBlcmltZW50TW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfaG9va0ludGVyYWN0aXZlVGFicycsICdfb25SdW5SZXF1ZXN0JywgJ19vbkdsb2JhbHNDaGFuZ2UnLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25EcnlSdW5SZXF1ZXN0JywgJ19vblRpY2snLFxuICAgICAgICAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0JywgJ19vbkFnZ3JlZ2F0ZVJlcXVlc3QnLFxuICAgICAgICAnX2hvb2tQYW5lbENvbnRlbnRzJywgJ19vblNlcnZlclVwZGF0ZScsICdfb25TZXJ2ZXJSZXN1bHRzJywgJ19vblNlcnZlckZhaWx1cmUnLFxuICAgICAgICAnX29uUmVzdWx0c0RvbnRTZW5kJywgJ19vblJlc3VsdHNTZW5kJywgJ19vblBoYXNlQ2hhbmdlJ1xuICAgICAgXSk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50JykpIHtcbiAgICAgICAgbGV0IHByb21pc2U7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXVnbGVuYVNlcnZlck1vZGUnKSA9PSBcImRlbW9cIikge1xuICAgICAgICAgIHByb21pc2UgPSB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRpY0hpc3RvcnkgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIHN0YXRpY0hpc3RvcnkgPyBmYWxzZSA6IHRydWUpXG5cbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtID0gbmV3IEV4cGVyaW1lbnRGb3JtKCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkRyeVJ1bicsIHRoaXMuX29uRHJ5UnVuUmVxdWVzdCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5TdWJtaXQnLCB0aGlzLl9vblJ1blJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3RXhwZXJpbWVudFJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuXG4gICAgICAgICAgdGhpcy5faGlzdG9yeSA9IG5ldyBIaXN0b3J5Rm9ybSgpO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuXG4gICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzID0gTGlnaHREaXNwbGF5LmNyZWF0ZSh7XG4gICAgICAgICAgICB3aWR0aDogMjAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxNTBcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzID0gQnVsYkRpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDE1MFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8c3BhbiBjbGFzcz1cImRyeV9ydW5fX3RpbWVcIj48L3NwYW4+JylcbiAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLiRkb20oKS5vbignY2xpY2snLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS4kZG9tKCkub24oJ2NsaWNrJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmFkZENoaWxkKHRoaXMuX2RyVGltZURpc3BsYXksICcubGlnaHQtZGlzcGxheV9fY29udGVudCcpO1xuICAgICAgICAgIHRoaXMuX3RpbWVyID0gbmV3IFRpbWVyKHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSxcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgcmF0ZTogNFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fdGltZXIuYWRkRXZlbnRMaXN0ZW5lcignVGltZXIuVGljaycsIHRoaXMuX29uVGljayk7XG4gICAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcblxuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyID0gbmV3IEV4cGVyaW1lbnRSZXBvcnRlcigpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRSZXBvcnRlci5TZW5kJywgdGhpcy5fb25SZXN1bHRzU2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLkRvbnRTZW5kJywgdGhpcy5fb25SZXN1bHRzRG9udFNlbmQpO1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLmhpZGUoKTtcblxuICAgICAgICAgIHRoaXMuX3RhYlZpZXcgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J3RhYl9fZXhwZXJpbWVudCc+PC9kaXY+XCIpO1xuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5faGlzdG9yeS52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX3RhYlZpZXcuYWRkQ2hpbGQodGhpcy5fY29uZmlnRm9ybS52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2RyeV9ydW4nPjwvZGl2PlwiKTtcbiAgICAgICAgICB0aGlzLl9kcnlSdW5WaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1blZpZXcuYWRkQ2hpbGQodGhpcy5fZHJ5UnVuQnVsYnMudmlldygpKTtcbiAgICAgICAgICB0aGlzLl90YWJWaWV3LmFkZENoaWxkKHRoaXMuX2RyeVJ1blZpZXcpO1xuXG4gICAgICAgICAgdGhpcy5fc2V0RXhwZXJpbWVudE1vZGFsaXR5KCk7XG5cbiAgICAgICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIHRoaXMuX2hvb2tQYW5lbENvbnRlbnRzLCA5KTtcbiAgICAgICAgICBITS5ob29rKCdJbnRlcmFjdGl2ZVRhYnMuTGlzdFRhYnMnLCB0aGlzLl9ob29rSW50ZXJhY3RpdmVUYWJzLCAxMCk7XG4gICAgICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCB0aGlzLl9vblNlcnZlclVwZGF0ZSk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgdGhpcy5fb25TZXJ2ZXJSZXN1bHRzKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB0aGlzLl9vblNlcnZlckZhaWx1cmUpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0RXhwZXJpbWVudE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZUFuZEhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tQYW5lbENvbnRlbnRzKGxpc3QsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLmlkID09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgICAgICBsaXN0LnB1c2godGhpcy5fcmVwb3J0ZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09IFwic3R1ZGVudF9pZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgaWYgKGhpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICBleHBfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2xvYWRFeHBlcmltZW50SW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5wYXRoID09IFwiZXVnbGVuYVNlcnZlck1vZGVcIikge1xuICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUgPT0gXCJkZW1vXCIpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkRGVtb0hpc3RvcnkoKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycsIGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xvYWREZW1vSGlzdG9yeSgpIHtcbiAgICAgIGlmICghR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5JykpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzJywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgIGRlbW86IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoZXhwZXJpbWVudHMpID0+IHtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXhwZXJpbWVudEhpc3RvcnknLCBleHBlcmltZW50cy5tYXAoKGUpID0+IGUuaWQpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fbG9hZEV4cGVyaW1lbnRJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpO1xuICAgIH1cblxuICAgIF9sb2FkRXhwZXJpbWVudEluRm9ybShpZCkge1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgbGV0IG9sZElkID0gdGhpcy5fY3VyckV4cElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkID09IFwiX25ld1wiKSB7XG4gICAgICAgICAgdGhpcy5fY3VyckV4cElkID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmltcG9ydCh7XG4gICAgICAgICAgICBsaWdodHM6IFt7XG4gICAgICAgICAgICAgIGxlZnQ6IDEwMCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIHRvcDogMTAwLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgYm90dG9tOiAxMDAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICByaWdodDogMTAwLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCduZXcnKVxuICAgICAgICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5CdWxicy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBpZDogXCJfbmV3XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V4cGVyaW1lbnRzLyR7aWR9YClcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5pbXBvcnQoe1xuICAgICAgICAgICAgICBsaWdodHM6IGRhdGEuY29uZmlndXJhdGlvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJyk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50LkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgZXhwZXJpbWVudDogZGF0YVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50RXhwZXJpbWVudCcsIGRhdGEpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJsb2FkXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogaWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tJbnRlcmFjdGl2ZVRhYnMobGlzdCwgbWV0YSkge1xuICAgICAgbGlzdC5wdXNoKHtcbiAgICAgICAgaWQ6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICB0aXRsZTogXCJFeHBlcmltZW50XCIsXG4gICAgICAgIGNvbnRlbnQ6IHRoaXMuX3RhYlZpZXdcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX29uRHJ5UnVuUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICh0aGlzLl9maXJzdERyeVJ1bikge1xuICAgICAgICB0aGlzLl9kcnlSdW5EYXRhID0gdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKS5saWdodHM7XG4gICAgICAgIHRoaXMuX3Jlc2V0RHJ5UnVuKCk7XG4gICAgICAgIHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuX2ZpcnN0RHJ5UnVuID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5fdGltZXIuYWN0aXZlKCkpIHtcbiAgICAgICAgICB0aGlzLl90aW1lci5wYXVzZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25UaWNrKGV2dCkge1xuICAgICAgY29uc3QgdGltZSA9IHRoaXMuX3RpbWVyLnRpbWUoKTtcbiAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy5yZW5kZXIoRXVnVXRpbHMuZ2V0TGlnaHRTdGF0ZSh0aGlzLl9kcnlSdW5EYXRhLCB0aW1lKSlcbiAgICAgIHRoaXMuX2RyeVJ1bkJ1bGJzLnJlbmRlcihFdWdVdGlscy5nZXRMaWdodFN0YXRlKHRoaXMuX2RyeVJ1bkRhdGEsIHRpbWUpKVxuICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheS4kZG9tKCkuaHRtbChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKTtcbiAgICB9XG5cbiAgICBfcmVzZXREcnlSdW4oKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICB0aGlzLl9kcnlSdW5MaWdodHMucmVuZGVyKHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICB9KVxuICAgICAgdGhpcy5fZHJ5UnVuQnVsYnMucmVuZGVyKHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwXG4gICAgICB9KVxuICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheS4kZG9tKCkuaHRtbCgnJyk7XG4gICAgfVxuXG4gICAgX29uQ29uZmlnQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgIHRoaXMuX2ZpcnN0RHJ5UnVuID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBfb25SdW5SZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnNldEZ1bGxzY3JlZW4odGhpcy5faGlzdG9yeS5oaXN0b3J5Q291bnQoKSA9PSAwKVxuICAgICAgICB0aGlzLl9yZXBvcnRlci5zaG93KCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRXhwZXJpbWVudFJlcXVlc3QnLCB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJleHBlcmltZW50X3N1Ym1pc3Npb25cIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fY29uZmlnRm9ybS5leHBvcnQoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5yZXZlcnRUb0xhc3RIaXN0b3J5KCk7XG4gICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZGlzYWJsZU5ldygpO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmRpc2FibGVOZXcoKTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudF9mb3JtX2Vycm9yXCIsXG4gICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgIG1lc3NhZ2U6IGVyci52YWxpZGF0aW9uLmVycm9ycy5qb2luKCc8YnIvPicpLFxuICAgICAgICAgIGF1dG9FeHBpcmU6IDEwLFxuICAgICAgICAgIGV4cGlyZUxhYmVsOiBcIkdvdCBpdFwiXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBleHBfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRMaXZlUmVzdWx0cyh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuQWRkUmVxdWVzdCcsIHtcbiAgICAgICAgICBkYXRhOiByZXN1bHRzXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwiYWRkX2FnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25TZXJ2ZXJVcGRhdGUoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXBvcnRlci51cGRhdGUoZXZ0LmRhdGEpO1xuICAgIH1cbiAgICBfb25TZXJ2ZXJSZXN1bHRzKGV2dCkge1xuICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpO1xuICAgICAgICBpZiAoaGlzdC5sZW5ndGggPT0gMSkge1xuICAgICAgICAgIHRoaXMuX29uUmVzdWx0c1NlbmQoe1xuICAgICAgICAgICAgY3VycmVudFRhcmdldDoge1xuICAgICAgICAgICAgICByZXN1bHRzOiBldnQuZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlcG9ydGVyLnVwZGF0ZSh7IHN0YXR1czogXCJjb21wbGV0ZVwiLCByZXN1bHRzOiBldnQuZGF0YSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIF9vblNlcnZlckZhaWx1cmUoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgfVxuXG4gICAgX29uUmVzdWx0c1NlbmQoZXZ0KSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0c1xuICAgICAgZXZ0LmN1cnJlbnRUYXJnZXQucmVzdWx0cyA9IG51bGw7XG4gICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgIGV4cF9oaXN0b3J5X2lkOiByZXN1bHRzLmV4cGVyaW1lbnRJZFxuICAgICAgfSlcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAnc2VuZF9yZXN1bHQnLFxuICAgICAgICBjYXRlZ29yeTogJ2V4cGVyaW1lbnQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiByZXN1bHRzLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICByZXN1bHRJZDogcmVzdWx0cy5pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBfcmVzdWx0Q2xlYW51cCgpIHtcbiAgICAgIHRoaXMuX3JlcG9ydGVyLmhpZGUoKTtcbiAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0uZW5hYmxlTmV3KCk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZU5ldygpO1xuICAgIH1cblxuICAgIF9vblJlc3VsdHNEb250U2VuZChldnQpIHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzXG4gICAgICB0aGlzLl9yZXN1bHRDbGVhbnVwKCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ2RvbnRfc2VuZF9yZXN1bHQnLFxuICAgICAgICBjYXRlZ29yeTogJ2V4cGVyaW1lbnQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiByZXN1bHRzLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICByZXN1bHRJZDogcmVzdWx0cy5pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBFeHBlcmltZW50TW9kdWxlLnJlcXVpcmVzID0gW1NlcnZlckludGVyZmFjZV07XG4gIHJldHVybiBFeHBlcmltZW50TW9kdWxlO1xufSlcbiJdfQ==
