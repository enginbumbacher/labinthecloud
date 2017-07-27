'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals');

  var Module = require('core/app/module'),
      View = require('./view'),
      EugUtils = require('euglena/utils');

  return function (_Module) {
    _inherits(ResultsModule, _Module);

    function ResultsModule() {
      _classCallCheck(this, ResultsModule);

      var _this = _possibleConstructorReturn(this, (ResultsModule.__proto__ || Object.getPrototypeOf(ResultsModule)).call(this));

      Utils.bindMethods(_this, ['_onExperimentLoaded', '_onModelLoaded', '_onSimulationRun', '_onModelResultsRequest', '_onPhaseChange']);

      _this._currentExperiment = null;
      _this._currentModel = null;

      _this._view = new View();
      _this._view.addEventListener('ResultsView.RequestModelData', _this._onModelResultsRequest);

      _this._firstModelSkip = {};

      Globals.get('Relay').addEventListener('Experiment.Loaded', _this._onExperimentLoaded);
      Globals.get('Relay').addEventListener('Simulation.Run', _this._onSimulationRun);
      Globals.get('Relay').addEventListener('EuglenaModel.Loaded', _this._onModelLoaded);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      return _this;
    }

    _createClass(ResultsModule, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        HM.hook('Panel.Contents', function (subject, meta) {
          if (meta.id == "result") {
            subject.push(_this2._view);
          }
          return subject;
        }, 10);
        return _get(ResultsModule.prototype.__proto__ || Object.getPrototypeOf(ResultsModule.prototype), 'init', this).call(this);
      }
    }, {
      key: '_onExperimentLoaded',
      value: function _onExperimentLoaded(evt) {
        var _this3 = this;

        if (evt.data.experiment.id != this._currentExperiment) {
          this._currentExperiment = evt.data.experiment.id;

          if (evt.data.experiment.id != '_new') {
            EugUtils.getLiveResults(evt.data.experiment.id).then(function (results) {
              Globals.set('currentExperimentResults', results);
              _this3._view.handleExperimentResults(evt.data.experiment, results);
              if (_this3._modelCache && _this3._modelCache.model != null) {
                _this3._onModelLoaded({
                  data: _this3._modelCache
                });
              } else if (_this3._simCache) {
                EugUtils.generateResults(_this3._simCache).then(function (res) {
                  _this3._onSimulationRun({
                    data: {
                      results: res,
                      simulation: _this3._simCache.simulation,
                      tabid: _this3._simCache.tabId
                    }
                  });
                });
              }
            }).catch(function (err) {
              console.log(err);
            });
          } else {
            this._view.clear();
          }
        }
      }
    }, {
      key: '_onModelLoaded',
      value: function _onModelLoaded(evt) {
        var _this4 = this;

        if (!Utils.exists(this._firstModelSkip[evt.data.tabId])) {
          this._firstModelSkip[evt.data.tabId] = true;
          return;
        }
        if (evt.data.model.id != '_new' && Globals.get('currentExperiment')) {
          if (!(this._lastModelResult && this._lastModelResult.euglenaModelId == evt.data.model.id && this._lastModelResult.experimentId == Globals.get('currentExperiment').id)) {
            EugUtils.getModelResults(Globals.get('currentExperiment').id, evt.data.model).then(function (results) {
              _this4._view.handleModelResults(evt.data.model, results, evt.data.tabId);
            });
            this._lastModelResult = {
              euglenaModelId: evt.data.model.id,
              experimentId: Globals.get('currentExperiment').id
            };
          }
          this._cacheModel(evt.data.model, evt.data.tabId);
        } else if (evt.data.model.id != '_new') {
          this._cacheModel(evt.data.model, evt.data.tabId);
        } else {
          this._view.handleModelResults(evt.data.model, null, evt.data.tabId);
          this._lastModelResult = null;
        }
      }
    }, {
      key: '_cacheModel',
      value: function _cacheModel(model, tabId) {
        var _this5 = this;

        if (!model.date_created) {
          Utils.promiseAjax('/api/v1/EuglenaModels/' + model.id).then(function (data) {
            _this5._modelCache = {
              model: data,
              tabId: tabId
            };
          });
        } else {
          this._modelCache = {
            model: model,
            tabId: tabId
          };
        }
      }
    }, {
      key: '_onSimulationRun',
      value: function _onSimulationRun(evt) {
        var _this6 = this;

        this._simCache = {
          simulation: evt.data.simulation,
          tabId: evt.data.tabId
        };
        Utils.promiseAjax('/api/v1/Results/' + evt.data.results.id).then(function (results) {
          return EugUtils.normalizeResults(results);
        }).then(function (results) {
          _this6._view.handleModelResults(evt.data.simulation.model, results, evt.data.tabId);
        });
      }
    }, {
      key: '_onModelResultsRequest',
      value: function _onModelResultsRequest(evt) {
        if (evt.data.tabId == 'none') {
          this._view.handleModelResults(null, null, evt.data.tabId);
          Globals.get('Logger').log({
            type: "model_change",
            category: "results",
            data: {
              tab: evt.data.tabId
            }
          });
          this._modelCache = {
            tabId: 'none',
            model: null
          };
        } else {
          var lastResultId = Globals.get('ModelTab.' + evt.data.tabId).lastResultId();
          var currModel = Globals.get('ModelTab.' + evt.data.tabId).currModel();
          if (currModel) {
            this._onModelLoaded({
              data: {
                model: currModel,
                tabId: evt.data.tabId
              }
            });
            Globals.get('Logger').log({
              type: "model_change",
              category: "results",
              data: {
                tab: evt.data.tabId,
                modelId: currModel.id
              }
            });
          } else if (lastResultId) {
            this._onSimulationRun({
              data: {
                results: {
                  id: lastResultId
                },
                tabId: evt.data.tabId
              }
            });
            this._lastModelResult = null;
            Globals.get('Logger').log({
              type: "model_change",
              category: "results",
              data: {
                tab: evt.data.tabId,
                resultId: lastResultId,
                simulation: true
              }
            });
          } else {
            this._view.handleModelResults(null, null, evt.data.tabId);
            this._lastModelResult = null;
            Globals.get('Logger').log({
              type: "model_change",
              category: "results",
              data: {
                tab: evt.data.tabId,
                resultId: null
              }
            });
          }
          Globals.get('Relay').dispatchEvent('InteractiveTabs.TabRequest', {
            tabId: 'model_' + evt.data.tabId
          });
        }
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login") {
          this._view.reset();
          this._firstModelSkip = {};
        }
      }
    }]);

    return ResultsModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25TaW11bGF0aW9uUnVuIiwiX29uTW9kZWxMb2FkZWQiLCJfb25QaGFzZUNoYW5nZSIsImhvb2siLCJzdWJqZWN0IiwibWV0YSIsImlkIiwicHVzaCIsImV2dCIsImRhdGEiLCJleHBlcmltZW50IiwiZ2V0TGl2ZVJlc3VsdHMiLCJ0aGVuIiwicmVzdWx0cyIsInNldCIsImhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzIiwiX21vZGVsQ2FjaGUiLCJtb2RlbCIsIl9zaW1DYWNoZSIsImdlbmVyYXRlUmVzdWx0cyIsInJlcyIsInNpbXVsYXRpb24iLCJ0YWJpZCIsInRhYklkIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJleGlzdHMiLCJfbGFzdE1vZGVsUmVzdWx0IiwiZXVnbGVuYU1vZGVsSWQiLCJleHBlcmltZW50SWQiLCJnZXRNb2RlbFJlc3VsdHMiLCJoYW5kbGVNb2RlbFJlc3VsdHMiLCJfY2FjaGVNb2RlbCIsImRhdGVfY3JlYXRlZCIsInByb21pc2VBamF4Iiwibm9ybWFsaXplUmVzdWx0cyIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImxhc3RSZXN1bHRJZCIsImN1cnJNb2RlbCIsIm1vZGVsSWQiLCJyZXN1bHRJZCIsImRpc3BhdGNoRXZlbnQiLCJwaGFzZSIsInJlc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxP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QixFQUFvQyxJQUFwQyxFQUEwQzFCLElBQUlDLElBQUosQ0FBU2MsS0FBbkQ7QUFDQSxpQkFBS08sZ0JBQUwsR0FBd0IsSUFBeEI7QUFDQTNDLG9CQUFRVyxHQUFSLENBQVksUUFBWixFQUFzQjZCLEdBQXRCLENBQTBCO0FBQ3hCWSxvQkFBTSxjQURrQjtBQUV4QkMsd0JBQVUsU0FGYztBQUd4Qi9CLG9CQUFNO0FBQ0pnQyxxQkFBS2pDLElBQUlDLElBQUosQ0FBU2MsS0FEVjtBQUVKc0IsMEJBQVU7QUFGTjtBQUhrQixhQUExQjtBQVFEO0FBQ0QxRCxrQkFBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJnRCxhQUFyQixDQUFtQyw0QkFBbkMsRUFBaUU7QUFDL0R2Qiw4QkFBZ0JmLElBQUlDLElBQUosQ0FBU2M7QUFEc0MsV0FBakU7QUFHRDtBQUNGO0FBcExIO0FBQUE7QUFBQSxxQ0FzTGlCZixHQXRMakIsRUFzTHNCO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBU3NDLEtBQVQsSUFBa0IsT0FBdEIsRUFBK0I7QUFDN0IsZUFBS3JELEtBQUwsQ0FBV3NELEtBQVg7QUFDQSxlQUFLbkQsZUFBTCxHQUF1QixFQUF2QjtBQUNEO0FBQ0Y7QUEzTEg7O0FBQUE7QUFBQSxJQUFtQ1QsTUFBbkM7QUE4TEQsQ0F4TUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvcmVzdWx0L21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
