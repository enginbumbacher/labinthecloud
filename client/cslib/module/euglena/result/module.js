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

      Utils.bindMethods(_this, ['_onExperimentLoaded', '_onModelLoaded', '_onSimulationRun', '_onModelResultsRequest', '_onPhaseChange', '_onExperimentCountChange']);

      _this._currentExperiment = null;
      _this._currentModel = null;

      _this._view = new View();
      _this._view.addEventListener('ResultsView.RequestModelData', _this._onModelResultsRequest);

      _this._firstModelSkip = {};

      Globals.get('Relay').addEventListener('Experiment.Loaded', _this._onExperimentLoaded);
      Globals.get('Relay').addEventListener('Simulation.Run', _this._onSimulationRun);
      Globals.get('Relay').addEventListener('EuglenaModel.Loaded', _this._onModelLoaded);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      Globals.get('Relay').addEventListener('ExperimentCount.Change', _this._onExperimentCountChange);
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
          this._view.hide();
          this._firstModelSkip = {};
        }
      }
    }, {
      key: '_onExperimentCountChange',
      value: function _onExperimentCountChange(evt) {
        if (evt.data.count && !evt.data.old) {
          this._view.show();
        } else if (!evt.data.count) {
          this._view.hide();
        }
      }
    }]);

    return ResultsModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25TaW11bGF0aW9uUnVuIiwiX29uTW9kZWxMb2FkZWQiLCJfb25QaGFzZUNoYW5nZSIsIl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSIsImhvb2siLCJzdWJqZWN0IiwibWV0YSIsImlkIiwicHVzaCIsImV2dCIsImRhdGEiLCJleHBlcmltZW50IiwiZ2V0TGl2ZVJlc3VsdHMiLCJ0aGVuIiwicmVzdWx0cyIsInNldCIsImhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzIiwiX21vZGVsQ2FjaGUiLCJtb2RlbCIsIl9zaW1DYWNoZSIsImdlbmVyYXRlUmVzdWx0cyIsInJlcyIsInNpbXVsYXRpb24iLCJ0YWJpZCIsInRhYklkIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJleGlzdHMiLCJfbGFzdE1vZGVsUmVzdWx0IiwiZXVnbGVuYU1vZGVsSWQiLCJleHBlcmltZW50SWQiLCJnZXRNb2RlbFJlc3VsdHMiLCJoYW5kbGVNb2RlbFJlc3VsdHMiLCJfY2FjaGVNb2RlbCIsImRhdGVfY3JlYXRlZCIsInByb21pc2VBamF4Iiwibm9ybWFsaXplUmVzdWx0cyIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImxhc3RSZXN1bHRJZCIsImN1cnJNb2RlbCIsImxhc3RTaW0iLCJjdXJyU2ltdWxhdGlvbiIsIm1vZGVsSWQiLCJyZXN1bHRJZCIsImRpc3BhdGNoRXZlbnQiLCJwaGFz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SixDQUFTYztBQUxaO0FBRGMsYUFBdEI7QUFTQSxpQkFBS08sZ0JBQUwsR0FBd0IsSUFBeEI7QUFDQTVDLG9CQUFRVyxHQUFSLENBQVksUUFBWixFQUFzQjhCLEdBQXRCLENBQTBCO0FBQ3hCWSxvQkFBTSxjQURrQjtBQUV4QkMsd0JBQVUsU0FGYztBQUd4Qi9CLG9CQUFNO0FBQ0pnQyxxQkFBS2pDLElBQUlDLElBQUosQ0FBU2MsS0FEVjtBQUVKd0IsMEJBQVVMLFlBRk47QUFHSnJCLDRCQUFZO0FBSFI7QUFIa0IsYUFBMUI7QUFTRCxXQXBCTSxNQW9CQTtBQUNMLGlCQUFLNUIsS0FBTCxDQUFXeUMsa0JBQVgsQ0FBOEIsSUFBOUIsRUFBb0MsSUFBcEMsRUFBMEMxQixJQUFJQyxJQUFKLENBQVNjLEtBQW5EO0FBQ0EsaUJBQUtPLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0E1QyxvQkFBUVcsR0FBUixDQUFZLFFBQVosRUFBc0I4QixHQUF0QixDQUEwQjtBQUN4Qlksb0JBQU0sY0FEa0I7QUFFeEJDLHdCQUFVLFNBRmM7QUFHeEIvQixvQkFBTTtBQUNKZ0MscUJBQUtqQyxJQUFJQyxJQUFKLENBQVNjLEtBRFY7QUFFSndCLDBCQUFVO0FBRk47QUFIa0IsYUFBMUI7QUFRRDtBQUNEN0Qsa0JBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCbUQsYUFBckIsQ0FBbUMsNEJBQW5DLEVBQWlFO0FBQy9EekIsOEJBQWdCZixJQUFJQyxJQUFKLENBQVNjO0FBRHNDLFdBQWpFO0FBR0Q7QUFDRjtBQTFMSDtBQUFBO0FBQUEscUNBNExpQmYsR0E1TGpCLEVBNExzQjtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVN3QyxLQUFULElBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGVBQUt4RCxLQUFMLENBQVd5RCxLQUFYO0FBQ0EsZUFBS3pELEtBQUwsQ0FBVzBELElBQVg7QUFDQSxlQUFLdkQsZUFBTCxHQUF1QixFQUF2QjtBQUNEO0FBQ0Y7QUFsTUg7QUFBQTtBQUFBLCtDQW9NMkJZLEdBcE0zQixFQW9NZ0M7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTMkMsS0FBVCxJQUFrQixDQUFDNUMsSUFBSUMsSUFBSixDQUFTNEMsR0FBaEMsRUFBcUM7QUFDbkMsZUFBSzVELEtBQUwsQ0FBVzZELElBQVg7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDOUMsSUFBSUMsSUFBSixDQUFTMkMsS0FBZCxFQUFxQjtBQUMxQixlQUFLM0QsS0FBTCxDQUFXMEQsSUFBWDtBQUNEO0FBQ0Y7QUExTUg7O0FBQUE7QUFBQSxJQUFtQ2hFLE1BQW5DO0FBNk1ELENBdk5EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
