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
      // Globals.get('Relay').addEventListener('Simulation.Run', this._onSimulationRun);
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
          this._lastModelResult = null;
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
          // const lastResultId = Globals.get(`ModelTab.${evt.data.tabId}`).lastResultId();
          var currModel = Globals.get('ModelTab.' + evt.data.tabId).currModel();
          // const lastSim = Globals.get(`ModelTab.${evt.data.tabId}`).currSimulation();

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
          }
          // else if (lastResultId) {
          //   this._onSimulationRun({
          //     data: {
          //       results: {
          //         id: lastResultId
          //       },
          //       simulation: lastSim,
          //       tabId: evt.data.tabId
          //     }
          //   })
          //   this._lastModelResult = null;
          //   Globals.get('Logger').log({
          //     type: "model_change",
          //     category: "results",
          //     data: {
          //       tab: evt.data.tabId,
          //       resultId: lastResultId,
          //       simulation: true
          //     }
          //   })
          // } 
          else {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJnZXRMaXZlUmVzdWx0cyIsInRoZW4iLCJyZXN1bHRzIiwic2V0IiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJfbW9kZWxDYWNoZSIsIm1vZGVsIiwiX3NpbUNhY2hlIiwiZ2VuZXJhdGVSZXN1bHRzIiwicmVzIiwiX29uU2ltdWxhdGlvblJ1biIsInNpbXVsYXRpb24iLCJ0YWJpZCIsInRhYklkIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJleGlzdHMiLCJfbGFzdE1vZGVsUmVzdWx0IiwiZXVnbGVuYU1vZGVsSWQiLCJleHBlcmltZW50SWQiLCJnZXRNb2RlbFJlc3VsdHMiLCJoYW5kbGVNb2RlbFJlc3VsdHMiLCJfY2FjaGVNb2RlbCIsImRhdGVfY3JlYXRlZCIsInByb21pc2VBamF4Iiwibm9ybWFsaXplUmVzdWx0cyIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImN1cnJNb2RlbCIsIm1vZGVsSWQiLCJyZXN1bHRJZCIsImRpc3BhdGNoRXZlbnQiLCJwaGFzZSIsInJlc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIs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LElBQUlDLElBQUosQ0FBU2UsS0FBakMsRUFBMENtQixTQUExQyxFQUFsQjtBQUNBOztBQUVBLGNBQUlBLFNBQUosRUFBZTtBQUNiLGlCQUFLMUMsY0FBTCxDQUFvQjtBQUNsQlEsb0JBQU07QUFDSlEsdUJBQU8wQixTQURIO0FBRUpuQix1QkFBT2hCLElBQUlDLElBQUosQ0FBU2U7QUFGWjtBQURZLGFBQXBCO0FBTUFwQyxvQkFBUVcsR0FBUixDQUFZLFFBQVosRUFBc0I2QixHQUF0QixDQUEwQjtBQUN4Qlksb0JBQU0sY0FEa0I7QUFFeEJDLHdCQUFVLFNBRmM7QUFHeEJoQyxvQkFBTTtBQUNKaUMscUJBQUtsQyxJQUFJQyxJQUFKLENBQVNlLEtBRFY7QUFFSm9CLHlCQUFTRCxVQUFVckM7QUFGZjtBQUhrQixhQUExQjtBQVFEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcENBLGVBcUNLO0FBQ0gsbUJBQUtYLEtBQUwsQ0FBV3dDLGtCQUFYLENBQThCLElBQTlCLEVBQW9DLElBQXBDLEVBQTBDM0IsSUFBSUMsSUFBSixDQUFTZSxLQUFuRDtBQUNBLG1CQUFLTyxnQkFBTCxHQUF3QixJQUF4QjtBQUNBM0Msc0JBQVFXLEdBQVIsQ0FBWSxRQUFaLEVBQXNCNkIsR0FBdEIsQ0FBMEI7QUFDeEJZLHNCQUFNLGNBRGtCO0FBRXhCQywwQkFBVSxTQUZjO0FBR3hCaEMsc0JBQU07QUFDSmlDLHVCQUFLbEMsSUFBSUMsSUFBSixDQUFTZSxLQURWO0FBRUpxQiw0QkFBVTtBQUZOO0FBSGtCLGVBQTFCO0FBUUQ7QUFDRHpELGtCQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQitDLGFBQXJCLENBQW1DLDRCQUFuQyxFQUFpRTtBQUMvRHRCLDhCQUFnQmhCLElBQUlDLElBQUosQ0FBU2U7QUFEc0MsV0FBakU7QUFHRDtBQUNGO0FBMUxIO0FBQUE7QUFBQSxxQ0E0TGlCaEIsR0E1TGpCLEVBNExzQjtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVNzQyxLQUFULElBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGVBQUtwRCxLQUFMLENBQVdxRCxLQUFYO0FBQ0EsZUFBS2xELGVBQUwsR0FBdUIsRUFBdkI7QUFDRDtBQUNGO0FBak1IOztBQUFBO0FBQUEsSUFBbUNULE1BQW5DO0FBb01ELENBOU1EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
