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
        console.log(evt.data.simulation);
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
          var lastSim = Globals.get('ModelTab.' + evt.data.tabId).currSimulation();

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
                simulation: lastSim,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25TaW11bGF0aW9uUnVuIiwiX29uTW9kZWxMb2FkZWQiLCJfb25QaGFzZUNoYW5nZSIsImhvb2siLCJzdWJqZWN0IiwibWV0YSIsImlkIiwicHVzaCIsImV2dCIsImRhdGEiLCJleHBlcmltZW50IiwiZ2V0TGl2ZVJlc3VsdHMiLCJ0aGVuIiwicmVzdWx0cyIsInNldCIsImhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzIiwiX21vZGVsQ2FjaGUiLCJtb2RlbCIsIl9zaW1DYWNoZSIsImdlbmVyYXRlUmVzdWx0cyIsInJlcyIsInNpbXVsYXRpb24iLCJ0YWJpZCIsInRhYklkIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJleGlzdHMiLCJfbGFzdE1vZGVsUmVzdWx0IiwiZXVnbGVuYU1vZGVsSWQiLCJleHBlcmltZW50SWQiLCJnZXRNb2RlbFJlc3VsdHMiLCJoYW5kbGVNb2RlbFJlc3VsdHMiLCJfY2FjaGVNb2RlbCIsImRhdGVfY3JlYXRlZCIsInByb21pc2VBamF4Iiwibm9ybWFsaXplUmVzdWx0cyIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImxhc3RSZXN1bHRJZCIsImN1cnJNb2RlbCIsImxhc3RTaW0iLCJjdXJyU2ltdWxhdGlvbiIsIm1vZGVsSWQiLCJyZXN1bHRJZCIsInBoYXNlIiwicmVzZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxP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O0FBR3hCL0Isb0JBQU07QUFDSmdDLHFCQUFLakMsSUFBSUMsSUFBSixDQUFTYyxLQURWO0FBRUp3QiwwQkFBVUwsWUFGTjtBQUdKckIsNEJBQVk7QUFIUjtBQUhrQixhQUExQjtBQVNELFdBcEJNLE1Bb0JBO0FBQ0wsaUJBQUszQixLQUFMLENBQVd3QyxrQkFBWCxDQUE4QixJQUE5QixFQUFvQyxJQUFwQyxFQUEwQzFCLElBQUlDLElBQUosQ0FBU2MsS0FBbkQ7QUFDQSxpQkFBS08sZ0JBQUwsR0FBd0IsSUFBeEI7QUFDQTNDLG9CQUFRVyxHQUFSLENBQVksUUFBWixFQUFzQjZCLEdBQXRCLENBQTBCO0FBQ3hCWSxvQkFBTSxjQURrQjtBQUV4QkMsd0JBQVUsU0FGYztBQUd4Qi9CLG9CQUFNO0FBQ0pnQyxxQkFBS2pDLElBQUlDLElBQUosQ0FBU2MsS0FEVjtBQUVKd0IsMEJBQVU7QUFGTjtBQUhrQixhQUExQjtBQVFEO0FBQ0Y7QUFDRjtBQXJMSDtBQUFBO0FBQUEscUNBdUxpQnZDLEdBdkxqQixFQXVMc0I7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTdUMsS0FBVCxJQUFrQixPQUF0QixFQUErQjtBQUM3QixlQUFLdEQsS0FBTCxDQUFXdUQsS0FBWDtBQUNBLGVBQUtwRCxlQUFMLEdBQXVCLEVBQXZCO0FBQ0Q7QUFDRjtBQTVMSDs7QUFBQTtBQUFBLElBQW1DVCxNQUFuQztBQStMRCxDQXpNRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
