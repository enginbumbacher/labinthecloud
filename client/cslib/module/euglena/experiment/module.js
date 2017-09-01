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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJNb2R1bGUiLCJHbG9iYWxzIiwiSE0iLCJFeHBlcmltZW50Rm9ybSIsIlV0aWxzIiwiTGlnaHREaXNwbGF5IiwiSGlzdG9yeUZvcm0iLCJEb21WaWV3IiwiU2VydmVySW50ZXJmYWNlIiwiVGltZXIiLCJFdWdVdGlscyIsIkV4cGVyaW1lbnRSZXBvcnRlciIsIkV4cGVyaW1lbnRNb2R1bGUiLCJiaW5kTWV0aG9kcyIsImdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsInByb21pc2UiLCJfbG9hZERlbW9IaXN0b3J5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwic3RhdGljSGlzdG9yeSIsInNldCIsIl9jb25maWdGb3JtIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vbkRyeVJ1blJlcXVlc3QiLCJfb25SdW5SZXF1ZXN0IiwiX29uTmV3RXhwZXJpbWVudFJlcXVlc3QiLCJfb25BZ2dyZWdhdGVSZXF1ZXN0IiwiX2hpc3RvcnkiLCJfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlIiwiX2RyeVJ1bkxpZ2h0cyIsImNyZWF0ZSIsIndpZHRoIiwiaGVpZ2h0IiwiX2RyVGltZURpc3BsYXkiLCIkZG9tIiwib24iLCJhZGRDaGlsZCIsIl90aW1lciIsImR1cmF0aW9uIiwibG9vcCIsInJhdGUiLCJfb25UaWNrIiwiX3Jlc2V0RHJ5UnVuIiwiX3JlcG9ydGVyIiwiX29uUmVzdWx0c1NlbmQiLCJfb25SZXN1bHRzRG9udFNlbmQiLCJoaWRlIiwiX3RhYlZpZXciLCJob29rIiwiX2hvb2tQYW5lbENvbnRlbnRzIiwiX2hvb2tJbnRlcmFjdGl2ZVRhYnMiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uU2VydmVyVXBkYXRlIiwiX29uU2VydmVyUmVzdWx0cyIsIl9vblNlcnZlckZhaWx1cmUiLCJsaXN0IiwibWV0YSIsImlkIiwicHVzaCIsImV2dCIsImRhdGEiLCJwYXRoIiwidXBkYXRlIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJleHBfaGlzdG9yeV9pZCIsIl9sb2FkRXhwZXJpbWVudEluRm9ybSIsImV4cG9ydCIsInZhbHVlIiwicHJvbWlzZUFqYXgiLCJmaWx0ZXIiLCJ3aGVyZSIsImRlbW8iLCJleHBlcmltZW50cyIsIm1hcCIsImUiLCJjdXJyZW50VGFyZ2V0Iiwib2xkSWQiLCJfY3VyckV4cElkIiwidGFyZ2V0IiwibGlnaHRzIiwibGVmdCIsInRvcCIsImJvdHRvbSIsInJpZ2h0Iiwic2V0U3RhdGUiLCJzaG93IiwiZGlzcGF0Y2hFdmVudCIsImV4cGVyaW1lbnQiLCJjb25maWd1cmF0aW9uIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZXhwZXJpbWVudElkIiwidGl0bGUiLCJjb250ZW50IiwiX2ZpcnN0RHJ5UnVuIiwiX2RyeVJ1bkRhdGEiLCJzdGFydCIsImFjdGl2ZSIsInBhdXNlIiwidGltZSIsInJlbmRlciIsImdldExpZ2h0U3RhdGUiLCJodG1sIiwic2Vjb25kc1RvVGltZVN0cmluZyIsInN0b3AiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJyZXNldCIsInNldEZ1bGxzY3JlZW4iLCJoaXN0b3J5Q291bnQiLCJyZXZlcnRUb0xhc3RIaXN0b3J5IiwiZGlzYWJsZU5ldyIsImNhdGNoIiwiZXJyIiwibWVzc2FnZSIsImVycm9ycyIsImpvaW4iLCJhdXRvRXhwaXJlIiwiZXhwaXJlTGFiZWwiLCJnZXRMaXZlUmVzdWx0cyIsInJlc3VsdHMiLCJzdGF0dXMiLCJfcmVzdWx0Q2xlYW51cCIsInJlc3VsdElkIiwiZW5hYmxlTmV3IiwicGhhc2UiLCJyZXF1aXJlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIs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O0FBQ3hCQyxnQkFBTSxhQURrQjtBQUV4QkMsb0JBQVUsWUFGYztBQUd4QmxDLGdCQUFNO0FBQ0ptQywwQkFBYzZCLFFBQVE3QixZQURsQjtBQUVKZ0Msc0JBQVVILFFBQVFuRTtBQUZkO0FBSGtCLFNBQTFCO0FBUUQ7QUF6VWU7QUFBQTtBQUFBLHVDQTBVQztBQUNmLGFBQUtkLFNBQUwsQ0FBZUcsSUFBZjtBQUNBLGFBQUsxQixXQUFMLENBQWlCNEcsU0FBakI7QUFDQSxhQUFLckcsUUFBTCxDQUFjcUcsU0FBZDtBQUNEO0FBOVVlO0FBQUE7QUFBQSx5Q0FnVkdyRSxHQWhWSCxFQWdWUTtBQUN0QixZQUFNaUUsVUFBVWpFLElBQUltQixhQUFKLENBQWtCOEMsT0FBbEM7QUFDQSxhQUFLRSxjQUFMO0FBQ0FqSSxnQkFBUWEsR0FBUixDQUFZLFFBQVosRUFBc0JrRixHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sa0JBRGtCO0FBRXhCQyxvQkFBVSxZQUZjO0FBR3hCbEMsZ0JBQU07QUFDSm1DLDBCQUFjNkIsUUFBUTdCLFlBRGxCO0FBRUpnQyxzQkFBVUgsUUFBUW5FO0FBRmQ7QUFIa0IsU0FBMUI7QUFRRDtBQTNWZTtBQUFBO0FBQUEscUNBNlZERSxHQTdWQyxFQTZWSTtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVNxRSxLQUFULElBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGVBQUt0RyxRQUFMLENBQWN1QyxNQUFkLENBQXFCLEVBQUVDLGdCQUFnQixNQUFsQixFQUFyQjtBQUNEO0FBQ0Y7QUFqV2U7O0FBQUE7QUFBQSxJQWlCYXZFLE1BakJiOztBQW9XbEJZLG1CQUFpQjBILFFBQWpCLEdBQTRCLENBQUM5SCxlQUFELENBQTVCO0FBQ0EsU0FBT0ksZ0JBQVA7QUFDRCxDQXRXRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIEV4cGVyaW1lbnRGb3JtID0gcmVxdWlyZSgnLi9mb3JtL2Zvcm0nKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIExpZ2h0RGlzcGxheSA9IHJlcXVpcmUoJ2V1Z2xlbmEvY29tcG9uZW50L2xpZ2h0ZGlzcGxheS9saWdodGRpc3BsYXknKSxcbiAgICBIaXN0b3J5Rm9ybSA9IHJlcXVpcmUoJy4vaGlzdG9yeS9mb3JtJyksXG4gICAgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFNlcnZlckludGVyZmFjZSA9IHJlcXVpcmUoJy4vc2VydmVyaW50ZXJmYWNlL21vZHVsZScpLFxuICAgIFRpbWVyID0gcmVxdWlyZSgnY29yZS91dGlsL3RpbWVyJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJyksXG4gICAgRXhwZXJpbWVudFJlcG9ydGVyID0gcmVxdWlyZSgnLi9yZXBvcnRlci9yZXBvcnRlcicpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgY2xhc3MgRXhwZXJpbWVudE1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX2hvb2tJbnRlcmFjdGl2ZVRhYnMnLCAnX29uUnVuUmVxdWVzdCcsICdfb25HbG9iYWxzQ2hhbmdlJywgXG4gICAgICAgICdfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlJywgJ19vbkRyeVJ1blJlcXVlc3QnLCAnX29uVGljaycsXG4gICAgICAgICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3RXhwZXJpbWVudFJlcXVlc3QnLCAnX29uQWdncmVnYXRlUmVxdWVzdCcsXG4gICAgICAgICdfaG9va1BhbmVsQ29udGVudHMnLCAnX29uU2VydmVyVXBkYXRlJywgJ19vblNlcnZlclJlc3VsdHMnLCAnX29uU2VydmVyRmFpbHVyZScsXG4gICAgICAgICdfb25SZXN1bHRzRG9udFNlbmQnLCAnX29uUmVzdWx0c1NlbmQnLCAnX29uUGhhc2VDaGFuZ2UnXG4gICAgICBdKTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQnKSkge1xuICAgICAgICBsZXQgcHJvbWlzZTtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5ldWdsZW5hU2VydmVyTW9kZScpID09IFwiZGVtb1wiKSB7XG4gICAgICAgICAgcHJvbWlzZSA9IHRoaXMuX2xvYWREZW1vSGlzdG9yeSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGljSGlzdG9yeSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3Jywgc3RhdGljSGlzdG9yeSA/IGZhbHNlIDogdHJ1ZSlcblxuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0gPSBuZXcgRXhwZXJpbWVudEZvcm0oKTtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgICAgIHRoaXMuX2NvbmZpZ0Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuRHJ5UnVuJywgdGhpcy5fb25EcnlSdW5SZXF1ZXN0KTtcbiAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LlN1Ym1pdCcsIHRoaXMuX29uUnVuUmVxdWVzdCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdFeHBlcmltZW50UmVxdWVzdCk7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZScsIHRoaXMuX29uQWdncmVnYXRlUmVxdWVzdCk7XG5cbiAgICAgICAgICB0aGlzLl9oaXN0b3J5ID0gbmV3IEhpc3RvcnlGb3JtKCk7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG5cbiAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMgPSBMaWdodERpc3BsYXkuY3JlYXRlKHtcbiAgICAgICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDE1MFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheSA9IG5ldyBEb21WaWV3KCc8c3BhbiBjbGFzcz1cImRyeV9ydW5fX3RpbWVcIj48L3NwYW4+JylcbiAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLiRkb20oKS5vbignY2xpY2snLCB0aGlzLl9vbkRyeVJ1blJlcXVlc3QpO1xuICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZHJUaW1lRGlzcGxheSwgJy5saWdodC1kaXNwbGF5X19jb250ZW50Jyk7XG4gICAgICAgICAgdGhpcy5fdGltZXIgPSBuZXcgVGltZXIoe1xuICAgICAgICAgICAgZHVyYXRpb246IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpLFxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICByYXRlOiA0XG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl90aW1lci5hZGRFdmVudExpc3RlbmVyKCdUaW1lci5UaWNrJywgdGhpcy5fb25UaWNrKTtcbiAgICAgICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuXG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIgPSBuZXcgRXhwZXJpbWVudFJlcG9ydGVyKCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFJlcG9ydGVyLlNlbmQnLCB0aGlzLl9vblJlc3VsdHNTZW5kKTtcbiAgICAgICAgICB0aGlzLl9yZXBvcnRlci5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50UmVwb3J0ZXIuRG9udFNlbmQnLCB0aGlzLl9vblJlc3VsdHNEb250U2VuZCk7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuXG4gICAgICAgICAgdGhpcy5fdGFiVmlldyA9IG5ldyBEb21WaWV3KFwiPGRpdiBjbGFzcz0ndGFiX19leHBlcmltZW50Jz48L2Rpdj5cIik7XG4gICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG4gICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9jb25maWdGb3JtLnZpZXcoKSk7XG4gICAgICAgICAgdGhpcy5fdGFiVmlldy5hZGRDaGlsZCh0aGlzLl9kcnlSdW5MaWdodHMudmlldygpKTtcblxuICAgICAgICAgIEhNLmhvb2soJ1BhbmVsLkNvbnRlbnRzJywgdGhpcy5faG9va1BhbmVsQ29udGVudHMsIDkpO1xuICAgICAgICAgIEhNLmhvb2soJ0ludGVyYWN0aXZlVGFicy5MaXN0VGFicycsIHRoaXMuX2hvb2tJbnRlcmFjdGl2ZVRhYnMsIDEwKTtcbiAgICAgICAgICBHbG9iYWxzLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uR2xvYmFsc0NoYW5nZSk7XG5cbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLlVwZGF0ZScsIHRoaXMuX29uU2VydmVyVXBkYXRlKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLlJlc3VsdHMnLCB0aGlzLl9vblNlcnZlclJlc3VsdHMpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHRoaXMuX29uU2VydmVyRmFpbHVyZSk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rUGFuZWxDb250ZW50cyhsaXN0LCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS5pZCA9PSBcImludGVyYWN0aXZlXCIpIHtcbiAgICAgICAgbGlzdC5wdXNoKHRoaXMuX3JlcG9ydGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIF9vbkdsb2JhbHNDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSBcInN0dWRlbnRfaWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKVxuICAgICAgICAgIGlmIChoaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgICAgZXhwX2hpc3RvcnlfaWQ6IGhpc3RbaGlzdC5sZW5ndGggLSAxXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9sb2FkRXhwZXJpbWVudEluRm9ybSh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkKTtcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEucGF0aCA9PSBcImV1Z2xlbmFTZXJ2ZXJNb2RlXCIpIHtcbiAgICAgICAgaWYgKGV2dC5kYXRhLnZhbHVlID09IFwiZGVtb1wiKSB7XG4gICAgICAgICAgdGhpcy5fbG9hZERlbW9IaXN0b3J5KCk7XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnLCBmYWxzZSk7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9sb2FkRGVtb0hpc3RvcnkoKSB7XG4gICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScpKSB7XG4gICAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FeHBlcmltZW50cycsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICBkZW1vOiB0cnVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKGV4cGVyaW1lbnRzKSA9PiB7XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5JywgZXhwZXJpbWVudHMubWFwKChlKSA9PiBlLmlkKSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xvYWRFeHBlcmltZW50SW5Gb3JtKGV2dC5jdXJyZW50VGFyZ2V0LmV4cG9ydCgpLmV4cF9oaXN0b3J5X2lkKTtcbiAgICB9XG5cbiAgICBfbG9hZEV4cGVyaW1lbnRJbkZvcm0oaWQpIHtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGxldCBvbGRJZCA9IHRoaXMuX2N1cnJFeHBJZDtcbiAgICAgIGxldCB0YXJnZXQgPSBpZCA9PSAnX25ldycgPyBudWxsIDogaWQ7XG4gICAgICBpZiAob2xkSWQgIT0gdGFyZ2V0KSB7XG4gICAgICAgIGlmIChpZCA9PSBcIl9uZXdcIikge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5pbXBvcnQoe1xuICAgICAgICAgICAgbGlnaHRzOiBbe1xuICAgICAgICAgICAgICBsZWZ0OiAxMDAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICB0b3A6IDEwMCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGJvdHRvbTogMTAwLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgcmlnaHQ6IDEwMCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICAgICAgICB9XVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIHRoaXMuX2RyeVJ1bkxpZ2h0cy52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgIGV4cGVyaW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBpZDogXCJfbmV3XCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJFeHBJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V4cGVyaW1lbnRzLyR7aWR9YClcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5pbXBvcnQoe1xuICAgICAgICAgICAgICBsaWdodHM6IGRhdGEuY29uZmlndXJhdGlvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdGb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJyk7XG4gICAgICAgICAgICB0aGlzLl9kcnlSdW5MaWdodHMudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnQuTG9hZGVkJywge1xuICAgICAgICAgICAgICBleHBlcmltZW50OiBkYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRFeHBlcmltZW50JywgZGF0YSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va0ludGVyYWN0aXZlVGFicyhsaXN0LCBtZXRhKSB7XG4gICAgICBsaXN0LnB1c2goe1xuICAgICAgICBpZDogXCJleHBlcmltZW50XCIsXG4gICAgICAgIHRpdGxlOiBcIkV4cGVyaW1lbnRcIixcbiAgICAgICAgY29udGVudDogdGhpcy5fdGFiVmlld1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBfb25EcnlSdW5SZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKHRoaXMuX2ZpcnN0RHJ5UnVuKSB7XG4gICAgICAgIHRoaXMuX2RyeVJ1bkRhdGEgPSB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpLmxpZ2h0cztcbiAgICAgICAgdGhpcy5fcmVzZXREcnlSdW4oKTtcbiAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl90aW1lci5hY3RpdmUoKSkge1xuICAgICAgICAgIHRoaXMuX3RpbWVyLnBhdXNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdGltZXIuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblRpY2soZXZ0KSB7XG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5fdGltZXIudGltZSgpO1xuICAgICAgdGhpcy5fZHJ5UnVuTGlnaHRzLnJlbmRlcihFdWdVdGlscy5nZXRMaWdodFN0YXRlKHRoaXMuX2RyeVJ1bkRhdGEsIHRpbWUpKVxuICAgICAgdGhpcy5fZHJUaW1lRGlzcGxheS4kZG9tKCkuaHRtbChVdGlscy5zZWNvbmRzVG9UaW1lU3RyaW5nKHRpbWUpKTtcbiAgICB9XG5cbiAgICBfcmVzZXREcnlSdW4oKSB7XG4gICAgICB0aGlzLl90aW1lci5zdG9wKCk7XG4gICAgICB0aGlzLl9kcnlSdW5MaWdodHMucmVuZGVyKHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwICAgICAgICBcbiAgICAgIH0pXG4gICAgICB0aGlzLl9kclRpbWVEaXNwbGF5LiRkb20oKS5odG1sKCcnKTtcbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgdGhpcy5fZmlyc3REcnlSdW4gPSB0cnVlO1xuICAgIH1cblxuICAgIF9vblJ1blJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9yZXNldERyeVJ1bigpO1xuICAgICAgdGhpcy5fY29uZmlnRm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fcmVwb3J0ZXIuc2V0RnVsbHNjcmVlbih0aGlzLl9oaXN0b3J5Lmhpc3RvcnlDb3VudCgpID09IDApXG4gICAgICAgIHRoaXMuX3JlcG9ydGVyLnNob3coKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5FeHBlcmltZW50UmVxdWVzdCcsIHRoaXMuX2NvbmZpZ0Zvcm0uZXhwb3J0KCkpO1xuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcImV4cGVyaW1lbnRfc3VibWlzc2lvblwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9jb25maWdGb3JtLmV4cG9ydCgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnJldmVydFRvTGFzdEhpc3RvcnkoKTtcbiAgICAgICAgdGhpcy5fY29uZmlnRm9ybS5kaXNhYmxlTmV3KCk7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZU5ldygpO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50X2Zvcm1fZXJyb3JcIixcbiAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZTogZXJyLnZhbGlkYXRpb24uZXJyb3JzLmpvaW4oJzxici8+JyksXG4gICAgICAgICAgYXV0b0V4cGlyZTogMTAsXG4gICAgICAgICAgZXhwaXJlTGFiZWw6IFwiR290IGl0XCJcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmV3RXhwZXJpbWVudFJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IGV4cF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgfVxuXG4gICAgX29uQWdncmVnYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIEV1Z1V0aWxzLmdldExpdmVSZXN1bHRzKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkuZXhwX2hpc3RvcnlfaWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5BZGRSZXF1ZXN0Jywge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdHNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJhZGRfYWdncmVnYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5leHBfaGlzdG9yeV9pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblNlcnZlclVwZGF0ZShldnQpIHtcbiAgICAgIHRoaXMuX3JlcG9ydGVyLnVwZGF0ZShldnQuZGF0YSk7XG4gICAgfVxuICAgIF9vblNlcnZlclJlc3VsdHMoZXZ0KSB7XG4gICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KCk7XG4gICAgICAgIGlmIChoaXN0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgdGhpcy5fb25SZXN1bHRzU2VuZCh7XG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0OiB7XG4gICAgICAgICAgICAgIHJlc3VsdHM6IGV2dC5kYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVwb3J0ZXIudXBkYXRlKHsgc3RhdHVzOiBcImNvbXBsZXRlXCIsIHJlc3VsdHM6IGV2dC5kYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgX29uU2VydmVyRmFpbHVyZShldnQpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICB9XG5cbiAgICBfb25SZXN1bHRzU2VuZChldnQpIHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzXG4gICAgICBldnQuY3VycmVudFRhcmdldC5yZXN1bHRzID0gbnVsbDtcbiAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgZXhwX2hpc3RvcnlfaWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkXG4gICAgICB9KVxuICAgICAgdGhpcy5fcmVzdWx0Q2xlYW51cCgpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdzZW5kX3Jlc3VsdCcsXG4gICAgICAgIGNhdGVnb3J5OiAnZXhwZXJpbWVudCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkLFxuICAgICAgICAgIHJlc3VsdElkOiByZXN1bHRzLmlkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIF9yZXN1bHRDbGVhbnVwKCkge1xuICAgICAgdGhpcy5fcmVwb3J0ZXIuaGlkZSgpO1xuICAgICAgdGhpcy5fY29uZmlnRm9ybS5lbmFibGVOZXcoKTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuZW5hYmxlTmV3KCk7XG4gICAgfVxuXG4gICAgX29uUmVzdWx0c0RvbnRTZW5kKGV2dCkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGV2dC5jdXJyZW50VGFyZ2V0LnJlc3VsdHNcbiAgICAgIHRoaXMuX3Jlc3VsdENsZWFudXAoKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAnZG9udF9zZW5kX3Jlc3VsdCcsXG4gICAgICAgIGNhdGVnb3J5OiAnZXhwZXJpbWVudCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IHJlc3VsdHMuZXhwZXJpbWVudElkLFxuICAgICAgICAgIHJlc3VsdElkOiByZXN1bHRzLmlkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgZXhwX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBFeHBlcmltZW50TW9kdWxlLnJlcXVpcmVzID0gW1NlcnZlckludGVyZmFjZV07XG4gIHJldHVybiBFeHBlcmltZW50TW9kdWxlO1xufSkiXX0=
