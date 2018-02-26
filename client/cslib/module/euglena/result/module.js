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

      Utils.bindMethods(_this, ['_onExperimentLoaded', '_onModelLoaded', '_onModelResultsRequest', '_onPhaseChange', '_onExperimentCountChange']);

      _this._currentExperiment = null;
      _this._currentModel = null;

      _this._view = new View();
      _this._view.addEventListener('ResultsView.RequestModelData', _this._onModelResultsRequest);

      _this._firstModelSkip = {};

      Globals.get('Relay').addEventListener('Experiment.Loaded', _this._onExperimentLoaded);
      Globals.get('Relay').addEventListener('EuglenaModel.Loaded', _this._onModelLoaded);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      Globals.get('Relay').addEventListener('ExperimentCount.Change', _this._onExperimentCountChange);
      Globals.get('Relay').addEventListener('EuglenaModel.directModelComparison', _this._onExperimentLoaded);
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

        if (evt.data.directModelComparison) {// Load experiment into the second video view for model comparison when activated for the first time
          //var results = Globals.get('currentExperimentResults');
          //var exp = {configuration: Globals.get('currentLightData')};
          //this._view.handleExperimentResults(exp, results, true);
        } else if (evt.data.experiment.id != this._currentExperiment) {
          this._currentExperiment = evt.data.experiment.id;

          if (evt.data.experiment.id != '_new') {
            EugUtils.getLiveResults(evt.data.experiment.id).then(function (results) {
              Globals.set('currentExperimentResults', results);
              Globals.set('currentLightData', evt.data.experiment.configuration);

              _this3._view.handleExperimentResults(evt.data.experiment, results); //// THIS IS WHERE I CAN CHANGE THE GRAPH VIEW.

              if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {
                _this3._view.showVideo(true);
              }

              if (Globals.get('directModelComparison')) {
                // In case model comparison is active and a new exp is loaded
                //Load the models that are in cache, or re-run.
                _this3._modelCache.forEach(function (cache) {
                  this._onModelLoaded({
                    data: cache
                  });
                }, _this3);
              } else {

                if (_this3._modelCache && _this3._modelCache[0].model != null) {
                  // If a model has been cached, show that video too.
                  _this3._onModelLoaded({
                    data: _this3._modelCache[0]
                  });
                }
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

        /*
        if (!Utils.exists(this._firstModelSkip[evt.data.tabId])) {
          this._firstModelSkip[evt.data.tabId] = true;
          if (Globals.get(`ModelTab.${evt.data.tabId}`).historyCount() != 0 && Globals.get('AppConfig.system.modelModality') == "create") {
            return;
          }
        }
        */
        if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {
          this._view.showVideo(false);
        }

        if (evt.data.model.id != '_new' && Globals.get('currentExperiment')) {
          if (!(evt.data.tabId == this._currentModel && this._lastModelResult['model_' + evt.data.tabId] && this._lastModelResult['model_' + evt.data.tabId].euglenaModelId == evt.data.model.id && this._lastModelResult['model_' + evt.data.tabId].experimentId == Globals.get('currentExperiment').id)) {
            // Otherwise, the current model does not have to be changed anyways.
            this._view.handleModelResults(evt.data.model, null, evt.data.tabId, Globals.get('directModelComparison'));

            EugUtils.getModelResults(Globals.get('currentExperiment').id, evt.data.model).then(function (results) {
              _this4._view.handleModelResults(evt.data.model, results, evt.data.tabId, Globals.get('directModelComparison')); // THIS IS WHERE I HAVE TO DO IT WITH THE GRAPH VIEW
            });
            this._lastModelResult['model_' + evt.data.tabId] = { // This is to make sure that a model does not get reloaded if it is already "active" in the cache
              euglenaModelId: evt.data.model.id,
              experimentId: Globals.get('currentExperiment').id
            };
            this._currentModel = Globals.get('directModelComparison') ? 'both' : evt.data.tabId;
          }
          this._cacheModel(evt.data.model, evt.data.tabId);
        } else if (evt.data.model.id != '_new') {
          this._cacheModel(evt.data.model, evt.data.tabId);
          this._currentModel = Globals.get('directModelComparison') ? 'both' : evt.data.tabId;
        } else {
          this._view.handleModelResults(evt.data.model, null, evt.data.tabId, Globals.get('directModelComparison'));
          this._lastModelResult['model_' + evt.data.tabId] = null;
          this._currentModel = null;
        }
      }
    }, {
      key: '_cacheModel',
      value: function _cacheModel(model, tabId) {
        var _this5 = this;

        if (!model.date_created) {
          // In case the model has not been created yet, create it and then cache it.
          Utils.promiseAjax('/api/v1/EuglenaModels/' + model.id).then(function (data) {

            var hasNone = false;
            var modelIndex = _this5._modelCache.findIndex(function (o, i) {
              if (o) {
                if (o.tabId === tabId) {
                  _this5._modelCache[i] = { tabId: tabId, model: data };
                  return true;
                } else if (o.tabId == 'none') {
                  hasNone = true;
                }
              }
            });

            if (!Globals.get('directModelComparison') || modelIndex == -1 && hasNone) {
              _this5._modelCache = [{ tabId: tabId, model: data }];
            } else if (modelIndex == -1) {
              _this5._modelCache.push({ tabId: tabId, model: data });
            }
          });
        } else {

          var hasNone = false;
          var modelIndex = this._modelCache.findIndex(function (o, i) {
            if (o) {
              if (o.tabId === tabId) {
                _this5._modelCache[i] = { tabId: tabId, model: model };
                return true;
              } else if (o.tabId == 'none') {
                hasNone = true;
              }
            }
          });

          if (!Globals.get('directModelComparison') || modelIndex == -1 && hasNone) {
            this._modelCache = [{ tabId: tabId, model: model }];
          } else if (modelIndex == -1) {
            this._modelCache.push({ tabId: tabId, model: model });
          }
        }
      }
    }, {
      key: '_onModelResultsRequest',
      value: function _onModelResultsRequest(evt) {
        if (evt.data.tabId == 'none') {
          if (Globals.get('directModelComparison')) {
            // delete the second video view
            Globals.set('directModelComparison', false);
            this._view.activateModelComparison();
          }
          this._lastModelResult = { model_a: null, model_b: null };
          if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {
            this._view.showVideo(true);
          }
          this._view.handleModelResults(null, null, evt.data.tabId);
          Globals.get('Logger').log({
            type: "model_change",
            category: "results",
            data: {
              tab: evt.data.tabId
            }
          });
          this._modelCache = [{
            tabId: 'none',
            model: null
          }];
        } else if (evt.data.tabId == 'both') {

          //1. dispatch event that says to hide results__visualization and instead have a second results__visuals view.
          Globals.set('directModelComparison', true);
          this._view.activateModelComparison();
          Globals.get('Relay').dispatchEvent('EuglenaModel.directModelComparison', { 'directModelComparison': true });

          // 2. Load both models.
          var currModel_a = Globals.get('ModelTab.a').currModel();
          var currModel_b = Globals.get('ModelTab.b').currModel();
          this._lastModelResult = { model_a: null, model_b: null };
          var modelLogIds = { model_a: null, model_b: null };

          if (currModel_a) {
            this._onModelLoaded({
              data: {
                model: currModel_a,
                tabId: 'a'
              }
            });
            modelLogIds.model_a = currModel_a.id;
          } else {
            this._view.handleModelResults(null, null, 'a', true);
            this._lastModelResult.model_a = null;
            if (Globals.get('AppConfig.system.modelModality') != 'create') {
              Globals.get('Relay').dispatchEvent('Model.AutomaticSimulate', { tabId: 'a' });
            }
          }

          if (currModel_b) {
            this._onModelLoaded({
              data: {
                model: currModel_b,
                tabId: 'b'
              }
            });
            modelLogIds.model_b = currModel_b.id;
          } else {
            this._view.handleModelResults(null, null, 'b', true);
            this._lastModelResult.model_b = null;
            if (Globals.get('AppConfig.system.modelModality') != 'create') {
              Globals.get('Relay').dispatchEvent('Model.AutomaticSimulate', { tabId: 'b' });
            }
          }

          Globals.get('Logger').log({
            type: "model_change",
            category: "results",
            data: {
              tab: evt.data.tabId,
              modelId: modelLogIds
            }
          });
        } else {
          // only one model active

          if (Globals.get('directModelComparison')) {
            // delete the second video view
            Globals.set('directModelComparison', false);
            this._view.activateModelComparison();
          }

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
          } else {
            this._view.handleModelResults(null, null, evt.data.tabId);
            this._lastModelResult['model_' + evt.data.tabId] = null;
            Globals.get('Logger').log({
              type: "model_change",
              category: "results",
              data: {
                tab: evt.data.tabId,
                resultId: null
              }
            });
            if (Globals.get('AppConfig.system.modelModality') != 'create') {
              Globals.get('Relay').dispatchEvent('Model.AutomaticSimulate', { tabId: evt.data.tabId });
            }
          }
          Globals.get('Relay').dispatchEvent('InteractiveTabs.TabRequest', {
            tabId: 'model_' + evt.data.tabId
          });
        }
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImRpcmVjdE1vZGVsQ29tcGFyaXNvbiIsImV4cGVyaW1lbnQiLCJnZXRMaXZlUmVzdWx0cyIsInRoZW4iLCJyZXN1bHRzIiwic2V0IiwiY29uZmlndXJhdGlvbiIsImhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzIiwic2hvd1ZpZGVvIiwiX21vZGVsQ2FjaGUiLCJmb3JFYWNoIiwiY2FjaGUiLCJtb2RlbCIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImNsZWFyIiwidGFiSWQiLCJfbGFzdE1vZGVsUmVzdWx0IiwiZXVnbGVuYU1vZGVsSWQiLCJleHBlcmltZW50SWQiLCJoYW5kbGVNb2RlbFJlc3VsdHMiLCJnZXRNb2RlbFJlc3VsdHMiLCJfY2FjaGVNb2RlbCIsImRhdGVfY3JlYXRlZCIsInByb21pc2VBamF4IiwiaGFzTm9uZSIsIm1vZGVsSW5kZXgiLCJmaW5kSW5kZXgiLCJvIiwiaSIsImFjdGl2YXRlTW9kZWxDb21wYXJpc29uIiwibW9kZWxfYSIsIm1vZGVsX2IiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJkaXNwYXRjaEV2ZW50IiwiY3Vyck1vZGVsX2EiLCJjdXJyTW9kZWwiLCJjdXJyTW9kZWxfYiIsIm1vZGVsTG9nSWRzIiwibW9kZWxJZCIsInJlc3VsdElkIiwicGhhc2UiLCJyZXNldCIsImhpZGUiLCJjb3VudCIsIm9sZCIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxRQUFRLHlCQUFSLENBQVg7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssT0FBT0wsUUFBUSxRQUFSLENBRFQ7QUFBQSxNQUVFTSxXQUFXTixRQUFRLGVBQVIsQ0FGYjs7QUFLQTtBQUFBOztBQUNFLDZCQUFjO0FBQUE7O0FBQUE7O0FBRVpFLFlBQU1LLFdBQU4sUUFBd0IsQ0FBQyxxQkFBRCxFQUF3QixnQkFBeEIsRUFBMEMsd0JBQTFDLEVBQW9FLGdCQUFwRSxFQUN0QiwwQkFEc0IsQ0FBeEI7O0FBR0EsWUFBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFDQSxZQUFLQyxhQUFMLEdBQXFCLElBQXJCOztBQUVBLFlBQUtDLEtBQUwsR0FBYSxJQUFJTCxJQUFKLEVBQWI7QUFDQSxZQUFLSyxLQUFMLENBQVdDLGdCQUFYLENBQTRCLDhCQUE1QixFQUE0RCxNQUFLQyxzQkFBakU7O0FBRUEsWUFBS0MsZUFBTCxHQUF1QixFQUF2Qjs7QUFFQVYsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxtQkFBdEMsRUFBMkQsTUFBS0ksbUJBQWhFO0FBQ0FaLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0MscUJBQXRDLEVBQTZELE1BQUtLLGNBQWxFO0FBQ0FiLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtNLGNBQTlEO0FBQ0FkLGNBQVFXLEdBQVIsQ0FBWSxPQUFa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QUVYLHNCQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQmtELGFBQXJCLENBQW1DLHlCQUFuQyxFQUE2RCxFQUFDcEIsT0FBT3BCLElBQUlDLElBQUosQ0FBU21CLEtBQWpCLEVBQTdEO0FBQXdGO0FBQ3hKO0FBQ0R6QyxrQkFBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJrRCxhQUFyQixDQUFtQyw0QkFBbkMsRUFBaUU7QUFDL0RwQiw4QkFBZ0JwQixJQUFJQyxJQUFKLENBQVNtQjtBQURzQyxXQUFqRTtBQUdEO0FBQ0Y7QUF4UUg7QUFBQTtBQUFBLHFDQTBRaUJwQixHQTFRakIsRUEwUXNCO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBUzhDLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkIvQyxJQUFJQyxJQUFKLENBQVM4QyxLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLN0QsS0FBTCxDQUFXOEQsS0FBWDtBQUNBLGVBQUs5RCxLQUFMLENBQVcrRCxJQUFYO0FBQ0EsZUFBSzVELGVBQUwsR0FBdUIsRUFBdkI7QUFDRDtBQUNGO0FBaFJIO0FBQUE7QUFBQSwrQ0FrUjJCVyxHQWxSM0IsRUFrUmdDO0FBQzVCLFlBQUlBLElBQUlDLElBQUosQ0FBU2lELEtBQVQsSUFBa0IsQ0FBQ2xELElBQUlDLElBQUosQ0FBU2tELEdBQWhDLEVBQXFDO0FBQ25DLGVBQUtqRSxLQUFMLENBQVdrRSxJQUFYO0FBQ0QsU0FGRCxNQUVPLElBQUksQ0FBQ3BELElBQUlDLElBQUosQ0FBU2lELEtBQWQsRUFBcUI7QUFDMUIsZUFBS2hFLEtBQUwsQ0FBVytELElBQVg7QUFDRDtBQUNGO0FBeFJIOztBQUFBO0FBQUEsSUFBbUNyRSxNQUFuQztBQTJSRCxDQXJTRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBSZXN1bHRzTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkV4cGVyaW1lbnRMb2FkZWQnLCAnX29uTW9kZWxMb2FkZWQnLCAnX29uTW9kZWxSZXN1bHRzUmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZScsXG4gICAgICAgICdfb25FeHBlcmltZW50Q291bnRDaGFuZ2UnXSk7XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRFeHBlcmltZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IG51bGw7XG5cbiAgICAgIHRoaXMuX3ZpZXcgPSBuZXcgVmlldygpO1xuICAgICAgdGhpcy5fdmlldy5hZGRFdmVudExpc3RlbmVyKCdSZXN1bHRzVmlldy5SZXF1ZXN0TW9kZWxEYXRhJywgdGhpcy5fb25Nb2RlbFJlc3VsdHNSZXF1ZXN0KTtcblxuICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXAgPSB7fTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5Mb2FkZWQnLCB0aGlzLl9vbkV4cGVyaW1lbnRMb2FkZWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHRoaXMuX29uTW9kZWxMb2FkZWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLmRpcmVjdE1vZGVsQ29tcGFyaXNvbicsIHRoaXMuX29uRXhwZXJpbWVudExvYWRlZCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIEhNLmhvb2soJ1BhbmVsLkNvbnRlbnRzJywgKHN1YmplY3QsIG1ldGEpID0+IHtcbiAgICAgICAgaWYgKG1ldGEuaWQgPT0gXCJyZXN1bHRcIikge1xuICAgICAgICAgIHN1YmplY3QucHVzaCh0aGlzLl92aWV3KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViamVjdDtcbiAgICAgIH0sIDEwKTtcbiAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudExvYWRlZChldnQpIHtcblxuICAgICAgaWYgKGV2dC5kYXRhLmRpcmVjdE1vZGVsQ29tcGFyaXNvbikgeyAvLyBMb2FkIGV4cGVyaW1lbnQgaW50byB0aGUgc2Vjb25kIHZpZGVvIHZpZXcgZm9yIG1vZGVsIGNvbXBhcmlzb24gd2hlbiBhY3RpdmF0ZWQgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vdmFyIHJlc3VsdHMgPSBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnRSZXN1bHRzJyk7XG4gICAgICAgIC8vdmFyIGV4cCA9IHtjb25maWd1cmF0aW9uOiBHbG9iYWxzLmdldCgnY3VycmVudExpZ2h0RGF0YScpfTtcbiAgICAgICAgLy90aGlzLl92aWV3LmhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV4cCwgcmVzdWx0cywgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQgIT0gdGhpcy5fY3VycmVudEV4cGVyaW1lbnQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudEV4cGVyaW1lbnQgPSBldnQuZGF0YS5leHBlcmltZW50LmlkO1xuXG4gICAgICAgIGlmIChldnQuZGF0YS5leHBlcmltZW50LmlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIEV1Z1V0aWxzLmdldExpdmVSZXN1bHRzKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMnLCByZXN1bHRzKTtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50TGlnaHREYXRhJyxldnQuZGF0YS5leHBlcmltZW50LmNvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV2dC5kYXRhLmV4cGVyaW1lbnQsIHJlc3VsdHMpOyAvLy8vIFRISVMgSVMgV0hFUkUgSSBDQU4gQ0hBTkdFIFRIRSBHUkFQSCBWSUVXLlxuXG4gICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykge3RoaXMuX3ZpZXcuc2hvd1ZpZGVvKHRydWUpO31cblxuICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkgeyAvLyBJbiBjYXNlIG1vZGVsIGNvbXBhcmlzb24gaXMgYWN0aXZlIGFuZCBhIG5ldyBleHAgaXMgbG9hZGVkXG4gICAgICAgICAgICAgIC8vTG9hZCB0aGUgbW9kZWxzIHRoYXQgYXJlIGluIGNhY2hlLCBvciByZS1ydW4uXG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUuZm9yRWFjaCggZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGNhY2hlXG4gICAgICAgICAgICAgICAgfSkgfSwgdGhpcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX21vZGVsQ2FjaGUgJiYgdGhpcy5fbW9kZWxDYWNoZVswXS5tb2RlbCAhPSBudWxsKSB7IC8vIElmIGEgbW9kZWwgaGFzIGJlZW4gY2FjaGVkLCBzaG93IHRoYXQgdmlkZW8gdG9vLlxuICAgICAgICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgICAgICAgZGF0YTogdGhpcy5fbW9kZWxDYWNoZVswXVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTW9kZWxMb2FkZWQoZXZ0KSB7XG4gICAgICAvKlxuICAgICAgaWYgKCFVdGlscy5leGlzdHModGhpcy5fZmlyc3RNb2RlbFNraXBbZXZ0LmRhdGEudGFiSWRdKSkge1xuICAgICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcFtldnQuZGF0YS50YWJJZF0gPSB0cnVlO1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7ZXZ0LmRhdGEudGFiSWR9YCkuaGlzdG9yeUNvdW50KCkgIT0gMCAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykgPT0gXCJjcmVhdGVcIikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgKi9cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7dGhpcy5fdmlldy5zaG93VmlkZW8oZmFsc2UpO31cblxuICAgICAgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3JyAmJiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKSkge1xuICAgICAgICBpZiAoIShldnQuZGF0YS50YWJJZCA9PSB0aGlzLl9jdXJyZW50TW9kZWwgJiYgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdICYmXG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdLmV1Z2xlbmFNb2RlbElkID09IGV2dC5kYXRhLm1vZGVsLmlkICYmXG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdLmV4cGVyaW1lbnRJZCA9PSBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZCkpIHsgLy8gT3RoZXJ3aXNlLCB0aGUgY3VycmVudCBtb2RlbCBkb2VzIG5vdCBoYXZlIHRvIGJlIGNoYW5nZWQgYW55d2F5cy5cbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhldnQuZGF0YS5tb2RlbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQsIEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSk7XG5cbiAgICAgICAgICBFdWdVdGlscy5nZXRNb2RlbFJlc3VsdHMoR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQsIGV2dC5kYXRhLm1vZGVsKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhldnQuZGF0YS5tb2RlbCwgcmVzdWx0cywgZXZ0LmRhdGEudGFiSWQsIEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSk7IC8vIFRISVMgSVMgV0hFUkUgSSBIQVZFIFRPIERPIElUIFdJVEggVEhFIEdSQVBIIFZJRVdcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSA9IHsgLy8gVGhpcyBpcyB0byBtYWtlIHN1cmUgdGhhdCBhIG1vZGVsIGRvZXMgbm90IGdldCByZWxvYWRlZCBpZiBpdCBpcyBhbHJlYWR5IFwiYWN0aXZlXCIgaW4gdGhlIGNhY2hlXG4gICAgICAgICAgICBldWdsZW5hTW9kZWxJZDogZXZ0LmRhdGEubW9kZWwuaWQsXG4gICAgICAgICAgICBleHBlcmltZW50SWQ6IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSA/ICdib3RoJyA6IGV2dC5kYXRhLnRhYklkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhY2hlTW9kZWwoZXZ0LmRhdGEubW9kZWwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEubW9kZWwuaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlTW9kZWwoZXZ0LmRhdGEubW9kZWwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpID8gJ2JvdGgnIDogZXZ0LmRhdGEudGFiSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhldnQuZGF0YS5tb2RlbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQsIEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSk7XG4gICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2NhY2hlTW9kZWwobW9kZWwsIHRhYklkKSB7XG4gICAgICBpZiAoIW1vZGVsLmRhdGVfY3JlYXRlZCkgeyAvLyBJbiBjYXNlIHRoZSBtb2RlbCBoYXMgbm90IGJlZW4gY3JlYXRlZCB5ZXQsIGNyZWF0ZSBpdCBhbmQgdGhlbiBjYWNoZSBpdC5cbiAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke21vZGVsLmlkfWApLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgIGxldCBoYXNOb25lID0gZmFsc2U7XG4gICAgICAgICAgbGV0IG1vZGVsSW5kZXggPSB0aGlzLl9tb2RlbENhY2hlLmZpbmRJbmRleCgobyxpKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgICAgaWYgKG8udGFiSWQgPT09IHRhYklkKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlW2ldID0geyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhfTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoby50YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgIGhhc05vbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSB8fCAobW9kZWxJbmRleCA9PSAtMSAmJiBoYXNOb25lKSkge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IFt7IHRhYklkOiB0YWJJZCwgbW9kZWw6IGRhdGEgfV1cbiAgICAgICAgICB9IGVsc2UgaWYgKG1vZGVsSW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUucHVzaCh7IHRhYklkOiB0YWJJZCwgbW9kZWw6IGRhdGEgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGxldCBoYXNOb25lID0gZmFsc2U7XG4gICAgICAgIGxldCBtb2RlbEluZGV4ID0gdGhpcy5fbW9kZWxDYWNoZS5maW5kSW5kZXgoKG8saSkgPT4ge1xuICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgaWYgKG8udGFiSWQgPT09IHRhYklkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZVtpXSA9IHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWx9O1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG8udGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgaGFzTm9uZSA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSB8fCAobW9kZWxJbmRleCA9PSAtMSAmJiBoYXNOb25lKSkge1xuICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSBbeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBtb2RlbCB9XVxuICAgICAgICB9IGVsc2UgaWYgKG1vZGVsSW5kZXggPT0gLTEpIHtcbiAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlLnB1c2goeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBtb2RlbCB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTW9kZWxSZXN1bHRzUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS50YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkgeyAvLyBkZWxldGUgdGhlIHNlY29uZCB2aWRlbyB2aWV3XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicsZmFsc2UpO1xuICAgICAgICAgIHRoaXMuX3ZpZXcuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSB7bW9kZWxfYTogbnVsbCwgbW9kZWxfYjogbnVsbH07XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKHRydWUpO31cbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0gW3tcbiAgICAgICAgICB0YWJJZDogJ25vbmUnLFxuICAgICAgICAgIG1vZGVsOiBudWxsXG4gICAgICAgIH1dXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnRhYklkID09ICdib3RoJykge1xuXG4gICAgICAgIC8vMS4gZGlzcGF0Y2ggZXZlbnQgdGhhdCBzYXlzIHRvIGhpZGUgcmVzdWx0c19fdmlzdWFsaXphdGlvbiBhbmQgaW5zdGVhZCBoYXZlIGEgc2Vjb25kIHJlc3VsdHNfX3Zpc3VhbHMgdmlldy5cbiAgICAgICAgR2xvYmFscy5zZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicsdHJ1ZSk7XG4gICAgICAgIHRoaXMuX3ZpZXcuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24oKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLmRpcmVjdE1vZGVsQ29tcGFyaXNvbicsIHsgJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbic6IHRydWUgfSk7XG5cbiAgICAgICAgLy8gMi4gTG9hZCBib3RoIG1vZGVscy5cbiAgICAgICAgY29uc3QgY3Vyck1vZGVsX2EgPSBHbG9iYWxzLmdldCgnTW9kZWxUYWIuYScpLmN1cnJNb2RlbCgpO1xuICAgICAgICBjb25zdCBjdXJyTW9kZWxfYiA9IEdsb2JhbHMuZ2V0KCdNb2RlbFRhYi5iJykuY3Vyck1vZGVsKCk7XG4gICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdCA9IHttb2RlbF9hOiBudWxsLCBtb2RlbF9iOiBudWxsfTtcbiAgICAgICAgdmFyIG1vZGVsTG9nSWRzID0ge21vZGVsX2E6IG51bGwsIG1vZGVsX2I6IG51bGx9O1xuXG4gICAgICAgIGlmIChjdXJyTW9kZWxfYSkge1xuICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbDogY3Vyck1vZGVsX2EsXG4gICAgICAgICAgICAgIHRhYklkOiAnYSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIG1vZGVsTG9nSWRzLm1vZGVsX2EgPSBjdXJyTW9kZWxfYS5pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCAnYScsIHRydWUpO1xuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdC5tb2RlbF9hID0gbnVsbDtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpIT0nY3JlYXRlJykgeyBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbC5BdXRvbWF0aWNTaW11bGF0ZScse3RhYklkOiAnYSd9KTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJNb2RlbF9iKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWxfYixcbiAgICAgICAgICAgICAgdGFiSWQ6ICdiJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgbW9kZWxMb2dJZHMubW9kZWxfYiA9IGN1cnJNb2RlbF9iLmlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsICdiJywgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0Lm1vZGVsX2IgPSBudWxsO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykhPSdjcmVhdGUnKSB7IEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsLkF1dG9tYXRpY1NpbXVsYXRlJyx7dGFiSWQ6ICdiJ30pOyB9XG4gICAgICAgIH1cblxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgbW9kZWxJZDogbW9kZWxMb2dJZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgIH0gZWxzZSB7IC8vIG9ubHkgb25lIG1vZGVsIGFjdGl2ZVxuXG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gZGVsZXRlIHRoZSBzZWNvbmQgdmlkZW8gdmlld1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyTW9kZWwgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5jdXJyTW9kZWwoKTtcblxuICAgICAgICBpZiAoY3Vyck1vZGVsKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWwsXG4gICAgICAgICAgICAgIHRhYklkOiBldnQuZGF0YS50YWJJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgICBtb2RlbElkOiBjdXJyTW9kZWwuaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgcmVzdWx0SWQ6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykhPSdjcmVhdGUnKSB7IEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsLkF1dG9tYXRpY1NpbXVsYXRlJyx7dGFiSWQ6IGV2dC5kYXRhLnRhYklkfSk7IH1cbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdJbnRlcmFjdGl2ZVRhYnMuVGFiUmVxdWVzdCcsIHtcbiAgICAgICAgICB0YWJJZDogYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX3ZpZXcucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fdmlldy5oaWRlKCk7XG4gICAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwID0ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy5fdmlldy5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufSlcbiJdfQ==
