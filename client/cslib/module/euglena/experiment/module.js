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

      Utils.bindMethods(_this, ['_hookInteractiveTabs', '_onRunRequest', '_onGlobalsChange', '_onHistorySelectionChange', '_onDryRunRequest', '_onTick', '_onConfigChange', '_onNewExperimentRequest', '_onAggregateRequest', '_hookPanelContents', '_onServerUpdate', '_onServerResults', '_onServerFailure', '_onResultsDontSend', '_onResultsSend']);
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
            _this2._drTimeDisplay = new DomView('<span class="dry_run__time"></span>');
            _this2._dryRunLights.view().$dom().on('click', _this2._onDryRunRequest);
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
            _this2._tabView.addChild(_this2._dryRunLights.view());

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
    }]);

    return ExperimentModule;
  }(Module);

  ExperimentModule.requires = [ServerInterface];
  return ExperimentModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50Rm9ybSIsIlV0aWxzIiwiTGlnaHREaXNwbGF5IiwiSGlzdG9yeUZvcm0iLCJEb21WaWV3IiwiU2VydmVySW50ZXJmYWNlIiwiVGltZXIiLCJFdWdVdGlscyIsIkV4cGVyaW1lbnRSZXBvcnRlciIsIkV4cGVyaW1lbnRNb2R1bGUiLCJiaW5kTWV0aG9kcyIsImdldCIsInByb21pc2UiLCJfbG9hZERlbW9IaXN0b3J5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwic3RhdGljSGlzdG9yeSIsInNldCIsIl9jb25maWdGb3JtIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkNvbmZpZ0NoYW5nZSIsInZpZXciLCJfb25EcnlSdW5SZXF1ZXN0IiwiX29uUnVuUmVxdWVzdCIsIl9vbk5ld0V4cGVyaW1lbnRSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9oaXN0b3J5IiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9kcnlSdW5MaWdodHMiLCJjcmVhdGUiLCJ3aWR0aCIsImhlaWdodCIsIl9kclRpbWVEaXNwbGF5IiwiJGRvbSIsIm9uIiwiYWRkQ2hpbGQiLCJfdGltZXIiLCJkdXJhdGlvbiIsImxvb3AiLCJyYXRlIiwiX29uVGljayIsIl9yZXNldERyeVJ1biIsIl9yZXBvcnRlciIsIl9vblJlc3VsdHNTZW5kIiwiX29uUmVzdWx0c0RvbnRTZW5kIiwiaGlkZSIsIl90YWJWaWV3IiwiaG9vayIsIl9ob29rUGFuZWxDb250ZW50cyIsIl9ob29rSW50ZXJhY3RpdmVUYWJzIiwiX29uR2xvYmFsc0NoYW5nZSIsIl9vblNlcnZlclVwZGF0ZSIsIl9vblNlcnZlclJlc3VsdHMiLCJfb25TZXJ2ZXJGYWlsdXJlIiwibGlzdCIsIm1ldGEiLCJpZCIsInB1c2giLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwiZXhwX2hpc3RvcnlfaWQiLCJfbG9hZEV4cGVyaW1lbnRJbkZvcm0iLCJleHBvcnQiLCJ2YWx1ZSIsInByb21pc2VBamF4IiwiZmlsdGVyIiwid2hlcmUiLCJkZW1vIiwiZXhwZXJpbWVudHMiLCJtYXAiLCJlIiwiY3VycmVudFRhcmdldCIsIm9sZElkIiwiX2N1cnJFeHBJZCIsInRhcmdldCIsImxpZ2h0cyIsImxlZnQiLCJ0b3AiLCJib3R0b20iLCJyaWdodCIsInNldFN0YXRlIiwic2hvdyIsImRpc3BhdGNoRXZlbnQiLCJleHBlcmltZW50IiwiY29uZmlndXJhdGlvbiIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImV4cGVyaW1lbnRJZCIsInRpdGxlIiwiY29udGVudCIsIl9maXJzdERyeVJ1biIsIl9kcnlSdW5EYXRhIiwic3RhcnQiLCJhY3RpdmUiLCJwYXVzZSIsInRpbWUiLCJyZW5kZXIiLCJnZXRMaWdodFN0YXRlIiwiaHRtbCIsInNlY29uZHNUb1RpbWVTdHJpbmciLCJzdG9wIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwicmVzZXQiLCJzZXRGdWxsc2NyZWVuIiwiaGlzdG9yeUNvdW50IiwicmV2ZXJ0VG9MYXN0SGlzdG9yeSIsImRpc2FibGVOZXciLCJjYXRjaCIsImVyciIsIm1lc3NhZ2UiLCJlcnJvcnMiLCJqb2luIiwiYXV0b0V4cGlyZSIsImV4cGlyZUxhYmVsIiwiZ2V0TGl2ZVJlc3VsdHMiLCJyZXN1bHRzIiwic3RhdHVzIiwiX3Jlc3VsdENsZWFudXAiLCJyZXN1bHRJZCIsImVuYWJsZU5ldyIsInJlcXVpcmVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsU0FBU0QsUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFB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QTFCO0FBUUQ7QUF2VWU7QUFBQTtBQUFBLHVDQXdVQztBQUNmLGFBQUtkLFNBQUwsQ0FBZUcsSUFBZjtBQUNBLGFBQUszQixXQUFMLENBQWlCNkcsU0FBakI7QUFDQSxhQUFLckcsUUFBTCxDQUFjcUcsU0FBZDtBQUNEO0FBNVVlO0FBQUE7QUFBQSx5Q0E4VUdyRSxHQTlVSCxFQThVUTtBQUN0QixZQUFNaUUsVUFBVWpFLElBQUltQixhQUFKLENBQWtCOEMsT0FBbEM7QUFDQSxhQUFLRSxjQUFMO0FBQ0FoSSxnQkFBUWEsR0FBUixDQUFZLFFBQVosRUFBc0JpRixHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sa0JBRGtCO0FBRXhCQyxvQkFBVSxZQUZjO0FBR3hCbEMsZ0JBQU07QUFDSm1DLDBCQUFjNkIsUUFBUTdCLFlBRGxCO0FBRUpnQyxzQkFBVUgsUUFBUW5FO0FBRmQ7QUFIa0IsU0FBMUI7QUFRRDtBQXpWZTs7QUFBQTtBQUFBLElBaUJhNUQsTUFqQmI7O0FBNFZsQlksbUJBQWlCd0gsUUFBakIsR0FBNEIsQ0FBQzVILGVBQUQsQ0FBNUI7QUFDQSxTQUFPSSxnQkFBUDtBQUNELENBOVZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
