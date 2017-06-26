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

      Utils.bindMethods(_this, ['_onExperimentLoaded', '_onModelLoaded', '_onSimulationRun', '_onModelResultsRequest']);

      _this._currentExperiment = null;
      _this._currentModel = null;

      _this._view = new View();
      _this._view.addEventListener('ResultsView.RequestModelData', _this._onModelResultsRequest);

      _this._firstModelSkip = {};

      Globals.get('Relay').addEventListener('Experiment.Loaded', _this._onExperimentLoaded);
      Globals.get('Relay').addEventListener('Simulation.Run', _this._onSimulationRun);
      Globals.get('Relay').addEventListener('EuglenaModel.Loaded', _this._onModelLoaded);
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
        }
      }
    }]);

    return ResultsModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25TaW11bGF0aW9uUnVuIiwiX29uTW9kZWxMb2FkZWQiLCJob29rIiwic3ViamVjdCIsIm1ldGEiLCJpZCIsInB1c2giLCJldnQiLCJkYXRhIiwiZXhwZXJpbWVudCIsImdldExpdmVSZXN1bHRzIiwidGhlbiIsInJlc3VsdHMiLCJzZXQiLCJoYW5kbGVFeHBlcmltZW50UmVzdWx0cyIsIl9tb2RlbENhY2hlIiwibW9kZWwiLCJfc2ltQ2FjaGUiLCJnZW5lcmF0ZVJlc3VsdHMiLCJyZXMiLCJzaW11bGF0aW9uIiwidGFiaWQiLCJ0YWJJZCIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImNsZWFyIiwiZXhpc3RzIiwiX2xhc3RNb2RlbFJlc3VsdCIsImV1Z2xlbmFNb2RlbElkIiwiZXhwZXJpbWVudElkIiwiZ2V0TW9kZWxSZXN1bHRzIiwiaGFuZGxlTW9kZWxSZXN1bHRzIiwiX2NhY2hlTW9kZWwiLCJkYXRlX2NyZWF0ZWQiLCJwcm9taXNlQWpheCIsIm5vcm1hbGl6ZVJlc3VsdHMiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJsYXN0UmVzdWx0SWQiLCJjdXJyTW9kZWwiLCJtb2RlbElkIiwicmVzdWx0SWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxRQUFRLHlCQUFSLENBQVg7QUFBQSxN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Q0FBU2MsS0FBakMsRUFBMENvQixTQUExQyxFQUFsQjtBQUNBLGNBQUlBLFNBQUosRUFBZTtBQUNiLGlCQUFLekMsY0FBTCxDQUFvQjtBQUNsQk8sb0JBQU07QUFDSlEsdUJBQU8wQixTQURIO0FBRUpwQix1QkFBT2YsSUFBSUMsSUFBSixDQUFTYztBQUZaO0FBRFksYUFBcEI7QUFNQW5DLG9CQUFRVyxHQUFSLENBQVksUUFBWixFQUFzQjRCLEdBQXRCLENBQTBCO0FBQ3hCWSxvQkFBTSxjQURrQjtBQUV4QkMsd0JBQVUsU0FGYztBQUd4Qi9CLG9CQUFNO0FBQ0pnQyxxQkFBS2pDLElBQUlDLElBQUosQ0FBU2MsS0FEVjtBQUVKcUIseUJBQVNELFVBQVVyQztBQUZmO0FBSGtCLGFBQTFCO0FBUUQsV0FmRCxNQWVPLElBQUlvQyxZQUFKLEVBQWtCO0FBQ3ZCLGlCQUFLekMsZ0JBQUwsQ0FBc0I7QUFDcEJRLG9CQUFNO0FBQ0pJLHlCQUFTO0FBQ1BQLHNCQUFJb0M7QUFERyxpQkFETDtBQUlKbkIsdUJBQU9mLElBQUlDLElBQUosQ0FBU2M7QUFKWjtBQURjLGFBQXRCO0FBUUEsaUJBQUtPLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0ExQyxvQkFBUVcsR0FBUixDQUFZLFFBQVosRUFBc0I0QixHQUF0QixDQUEwQjtBQUN4Qlksb0JBQU0sY0FEa0I7QUFFeEJDLHdCQUFVLFNBRmM7QUFHeEIvQixvQkFBTTtBQUNKZ0MscUJBQUtqQyxJQUFJQyxJQUFKLENBQVNjLEtBRFY7QUFFSnNCLDBCQUFVSCxZQUZOO0FBR0pyQiw0QkFBWTtBQUhSO0FBSGtCLGFBQTFCO0FBU0QsV0FuQk0sTUFtQkE7QUFDTCxpQkFBSzFCLEtBQUwsQ0FBV3VDLGtCQUFYLENBQThCLElBQTlCLEVBQW9DLElBQXBDLEVBQTBDMUIsSUFBSUMsSUFBSixDQUFTYyxLQUFuRDtBQUNBLGlCQUFLTyxnQkFBTCxHQUF3QixJQUF4QjtBQUNBMUMsb0JBQVFXLEdBQVIsQ0FBWSxRQUFaLEVBQXNCNEIsR0FBdEIsQ0FBMEI7QUFDeEJZLG9CQUFNLGNBRGtCO0FBRXhCQyx3QkFBVSxTQUZjO0FBR3hCL0Isb0JBQU07QUFDSmdDLHFCQUFLakMsSUFBSUMsSUFBSixDQUFTYyxLQURWO0FBRUpzQiwwQkFBVTtBQUZOO0FBSGtCLGFBQTFCO0FBUUQ7QUFDRjtBQUNGO0FBaExIOztBQUFBO0FBQUEsSUFBbUN4RCxNQUFuQztBQW1MRCxDQTdMRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
