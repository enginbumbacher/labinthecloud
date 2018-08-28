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
            var loadExpId = evt.data.experiment.copyOfID > 0 ? evt.data.experiment.copyOfID : evt.data.experiment.id;
            EugUtils.getLiveResults(loadExpId).then(function (results) {
              Globals.set('currentExperimentResults', results);
              Globals.set('currentLightData', evt.data.experiment.configuration);

              _this3._view.handleExperimentResults(evt.data.experiment, results); //// THIS IS WHERE I CAN CHANGE THE GRAPH VIEW.

              if (Globals.get('AppConfig.system.expModelModality') === 'sequential') {
                _this3._view.showVideo(true);
              } else if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') {
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
        } else {
          if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') {
            this._view.showVideo(false);
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
        } else if (Globals.get('AppConfig.system.expModelModality') == 'justmodel') {
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
          if (Globals.get('AppConfig.system.expModelModality') === 'sequential') {
            this._view.showVideo(true);
          } else if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') {
            this._view.showVideo(false);
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
              console.log('automatic simulate');Globals.get('Relay').dispatchEvent('Model.AutomaticSimulate', { tabId: evt.data.tabId });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImRpcmVjdE1vZGVsQ29tcGFyaXNvbiIsImV4cGVyaW1lbnQiLCJsb2FkRXhwSWQiLCJjb3B5T2ZJRCIsImdldExpdmVSZXN1bHRzIiwidGhlbiIsInJlc3VsdHMiLCJzZXQiLCJjb25maWd1cmF0aW9uIiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJzaG93VmlkZW8iLCJfbW9kZWxDYWNoZSIsImZvckVhY2giLCJjYWNoZSIsIm1vZGVsIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJ0YWJJZCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImhhbmRsZU1vZGVsUmVzdWx0cyIsImdldE1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJoYXNOb25lIiwibW9kZWxJbmRleCIsImZpbmRJbmRleCIsIm8iLCJpIiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJtb2RlbF9hIiwibW9kZWxfYiIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImRpc3BhdGNoRXZlbnQiLCJjdXJyTW9kZWxfYSIsImN1cnJNb2RlbCIsImN1cnJNb2RlbF9iIiwibW9kZWxMb2dJZHMiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJwaGFzZSIsInJlc2V0IiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLEtBQUtELFFBQVEseUJBQVIsQ0FBWDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxPQUFPTCxRQUFRLFFBQVIsQ0FEVDtBQUFBLE1BRUVNLFdBQVdOLFFBQVEsZUFBUixDQUZiOztBQUtBO0FBQUE7O0FBQ0UsNkJBQWM7QUFBQTs7QUFBQTs7QUFFWkUsWUFBTUssV0FBTixRQUF3QixDQUFDLHFCQUFELEVBQXdCLGdCQUF4QixFQUEwQyx3QkFBMUMsRUFBb0UsZ0JBQXBFLEVBQ3RCLDBCQURzQixDQUF4Qjs7QUFHQSxZQUFLQyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFlBQUtDLGFBQUwsR0FBcUIsSUFBckI7O0FBRUEsWUFBS0MsS0FBTCxHQUFhLElBQUlMLElBQUosRUFBYjtBQUNBLFlBQUtLLEtBQUwsQ0FBV0MsZ0JBQVgsQ0FBNEIsOEJBQTVCLEVBQTRELE1BQUtDLHNCQUFqRTs7QUFFQSxZQUFLQyxlQUFMLEdBQXVCLEVBQXZCOztBQUVBVixjQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQkgsZ0JBQXJCLENBQXNDLG1CQUF0QyxFQUEyRCxNQUFLSSxtQkFBaEU7QUFDQVosY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxxQkFBdEMsRUFBNkQsTUFBS0ssY0FBbEU7QUFDQWIsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBS00sY0FBOUQ7QUFD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WUFBSUEsSUFBSUMsSUFBSixDQUFTZ0QsS0FBVCxJQUFrQixPQUFsQixJQUE2QmpELElBQUlDLElBQUosQ0FBU2dELEtBQVQsSUFBa0IsaUJBQW5ELEVBQXNFO0FBQ3BFLGVBQUsvRCxLQUFMLENBQVdnRSxLQUFYO0FBQ0EsZUFBS2hFLEtBQUwsQ0FBV2lFLElBQVg7QUFDQSxlQUFLOUQsZUFBTCxHQUF1QixFQUF2QjtBQUNEO0FBQ0Y7QUF0Ukg7QUFBQTtBQUFBLCtDQXdSMkJXLEdBeFIzQixFQXdSZ0M7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTbUQsS0FBVCxJQUFrQixDQUFDcEQsSUFBSUMsSUFBSixDQUFTb0QsR0FBaEMsRUFBcUM7QUFDbkMsZUFBS25FLEtBQUwsQ0FBV29FLElBQVg7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDdEQsSUFBSUMsSUFBSixDQUFTbUQsS0FBZCxFQUFxQjtBQUMxQixlQUFLbEUsS0FBTCxDQUFXaUUsSUFBWDtBQUNEO0FBQ0Y7QUE5Ukg7O0FBQUE7QUFBQSxJQUFtQ3ZFLE1BQW5DO0FBaVNELENBM1NEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRXhwZXJpbWVudExvYWRlZCcsICdfb25Nb2RlbExvYWRlZCcsICdfb25Nb2RlbFJlc3VsdHNSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJyxcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fY3VycmVudEV4cGVyaW1lbnQgPSBudWxsO1xuICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcblxuICAgICAgdGhpcy5fdmlldyA9IG5ldyBWaWV3KCk7XG4gICAgICB0aGlzLl92aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB0aGlzLl9vbk1vZGVsUmVzdWx0c1JlcXVlc3QpO1xuXG4gICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcCA9IHt9O1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkxvYWRlZCcsIHRoaXMuX29uRXhwZXJpbWVudExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuTG9hZGVkJywgdGhpcy5fb25Nb2RlbExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuZGlyZWN0TW9kZWxDb21wYXJpc29uJywgdGhpcy5fb25FeHBlcmltZW50TG9hZGVkKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgSE0uaG9vaygnUGFuZWwuQ29udGVudHMnLCAoc3ViamVjdCwgbWV0YSkgPT4ge1xuICAgICAgICBpZiAobWV0YS5pZCA9PSBcInJlc3VsdFwiKSB7XG4gICAgICAgICAgc3ViamVjdC5wdXNoKHRoaXMuX3ZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgICAgfSwgMTApO1xuICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50TG9hZGVkKGV2dCkge1xuXG4gICAgICBpZiAoZXZ0LmRhdGEuZGlyZWN0TW9kZWxDb21wYXJpc29uKSB7IC8vIExvYWQgZXhwZXJpbWVudCBpbnRvIHRoZSBzZWNvbmQgdmlkZW8gdmlldyBmb3IgbW9kZWwgY29tcGFyaXNvbiB3aGVuIGFjdGl2YXRlZCBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy92YXIgcmVzdWx0cyA9IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMnKTtcbiAgICAgICAgLy92YXIgZXhwID0ge2NvbmZpZ3VyYXRpb246IEdsb2JhbHMuZ2V0KCdjdXJyZW50TGlnaHREYXRhJyl9O1xuICAgICAgICAvL3RoaXMuX3ZpZXcuaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMoZXhwLCByZXN1bHRzLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCAhPSB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCA9IGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQ7XG5cbiAgICAgICAgaWYgKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgICAgdmFyIGxvYWRFeHBJZCA9IGV2dC5kYXRhLmV4cGVyaW1lbnQuY29weU9mSUQgPiAwID8gZXZ0LmRhdGEuZXhwZXJpbWVudC5jb3B5T2ZJRCA6IGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQ7XG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TGl2ZVJlc3VsdHMobG9hZEV4cElkKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudEV4cGVyaW1lbnRSZXN1bHRzJywgcmVzdWx0cyk7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudExpZ2h0RGF0YScsZXZ0LmRhdGEuZXhwZXJpbWVudC5jb25maWd1cmF0aW9uKTtcblxuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVFeHBlcmltZW50UmVzdWx0cyhldnQuZGF0YS5leHBlcmltZW50LCByZXN1bHRzKTsgLy8vLyBUSElTIElTIFdIRVJFIEkgQ0FOIENIQU5HRSBUSEUgR1JBUEggVklFVy5cblxuICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PT0gJ3NlcXVlbnRpYWwnKSB7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKHRydWUpO31cbiAgICAgICAgICAgIGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PT0gJ2p1c3Rtb2RlbCcpIHsgdGhpcy5fdmlldy5zaG93VmlkZW8odHJ1ZSk7fVxuXG4gICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKSB7IC8vIEluIGNhc2UgbW9kZWwgY29tcGFyaXNvbiBpcyBhY3RpdmUgYW5kIGEgbmV3IGV4cCBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgLy9Mb2FkIHRoZSBtb2RlbHMgdGhhdCBhcmUgaW4gY2FjaGUsIG9yIHJlLXJ1bi5cbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZS5mb3JFYWNoKCBmdW5jdGlvbihjYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgICAgICAgZGF0YTogY2FjaGVcbiAgICAgICAgICAgICAgICB9KSB9LCB0aGlzKVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5fbW9kZWxDYWNoZSAmJiB0aGlzLl9tb2RlbENhY2hlWzBdLm1vZGVsICE9IG51bGwpIHsgLy8gSWYgYSBtb2RlbCBoYXMgYmVlbiBjYWNoZWQsIHNob3cgdGhhdCB2aWRlbyB0b28uXG4gICAgICAgICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLl9tb2RlbENhY2hlWzBdXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT09ICdqdXN0bW9kZWwnKSB7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKGZhbHNlKTt9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTW9kZWxMb2FkZWQoZXZ0KSB7XG4gICAgICAvKlxuICAgICAgaWYgKCFVdGlscy5leGlzdHModGhpcy5fZmlyc3RNb2RlbFNraXBbZXZ0LmRhdGEudGFiSWRdKSkge1xuICAgICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcFtldnQuZGF0YS50YWJJZF0gPSB0cnVlO1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7ZXZ0LmRhdGEudGFiSWR9YCkuaGlzdG9yeUNvdW50KCkgIT0gMCAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykgPT0gXCJjcmVhdGVcIikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgKi9cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKGZhbHNlKTt9XG4gICAgICBlbHNlIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ2p1c3Rtb2RlbCcpIHsgdGhpcy5fdmlldy5zaG93VmlkZW8oZmFsc2UpO31cblxuICAgICAgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3JyAmJiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKSkge1xuICAgICAgICBpZiAoIShldnQuZGF0YS50YWJJZCA9PSB0aGlzLl9jdXJyZW50TW9kZWwgJiYgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdICYmXG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdLmV1Z2xlbmFNb2RlbElkID09IGV2dC5kYXRhLm1vZGVsLmlkICYmXG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdLmV4cGVyaW1lbnRJZCA9PSBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZCkpIHsgLy8gT3RoZXJ3aXNlLCB0aGUgY3VycmVudCBtb2RlbCBkb2VzIG5vdCBoYXZlIHRvIGJlIGNoYW5nZWQgYW55d2F5cy5cbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhldnQuZGF0YS5tb2RlbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQsIEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSk7XG5cbiAgICAgICAgICBFdWdVdGlscy5nZXRNb2RlbFJlc3VsdHMoR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQsIGV2dC5kYXRhLm1vZGVsKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhldnQuZGF0YS5tb2RlbCwgcmVzdWx0cywgZXZ0LmRhdGEudGFiSWQsIEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSk7IC8vIFRISVMgSVMgV0hFUkUgSSBIQVZFIFRPIERPIElUIFdJVEggVEhFIEdSQVBIIFZJRVdcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSA9IHsgLy8gVGhpcyBpcyB0byBtYWtlIHN1cmUgdGhhdCBhIG1vZGVsIGRvZXMgbm90IGdldCByZWxvYWRlZCBpZiBpdCBpcyBhbHJlYWR5IFwiYWN0aXZlXCIgaW4gdGhlIGNhY2hlXG4gICAgICAgICAgICBldWdsZW5hTW9kZWxJZDogZXZ0LmRhdGEubW9kZWwuaWQsXG4gICAgICAgICAgICBleHBlcmltZW50SWQ6IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSA/ICdib3RoJyA6IGV2dC5kYXRhLnRhYklkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhY2hlTW9kZWwoZXZ0LmRhdGEubW9kZWwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEubW9kZWwuaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlTW9kZWwoZXZ0LmRhdGEubW9kZWwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpID8gJ2JvdGgnIDogZXZ0LmRhdGEudGFiSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhldnQuZGF0YS5tb2RlbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQsIEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSk7XG4gICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2NhY2hlTW9kZWwobW9kZWwsIHRhYklkKSB7XG4gICAgICBpZiAoIW1vZGVsLmRhdGVfY3JlYXRlZCkgeyAvLyBJbiBjYXNlIHRoZSBtb2RlbCBoYXMgbm90IGJlZW4gY3JlYXRlZCB5ZXQsIGNyZWF0ZSBpdCBhbmQgdGhlbiBjYWNoZSBpdC5cbiAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke21vZGVsLmlkfWApLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgIGxldCBoYXNOb25lID0gZmFsc2U7XG4gICAgICAgICAgbGV0IG1vZGVsSW5kZXggPSB0aGlzLl9tb2RlbENhY2hlLmZpbmRJbmRleCgobyxpKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgICAgaWYgKG8udGFiSWQgPT09IHRhYklkKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlW2ldID0geyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhfTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoby50YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgIGhhc05vbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSB8fCAobW9kZWxJbmRleCA9PSAtMSAmJiBoYXNOb25lKSkge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IFt7IHRhYklkOiB0YWJJZCwgbW9kZWw6IGRhdGEgfV1cbiAgICAgICAgICB9IGVsc2UgaWYgKG1vZGVsSW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUucHVzaCh7IHRhYklkOiB0YWJJZCwgbW9kZWw6IGRhdGEgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGxldCBoYXNOb25lID0gZmFsc2U7XG4gICAgICAgIGxldCBtb2RlbEluZGV4ID0gdGhpcy5fbW9kZWxDYWNoZS5maW5kSW5kZXgoKG8saSkgPT4ge1xuICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgaWYgKG8udGFiSWQgPT09IHRhYklkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZVtpXSA9IHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWx9O1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG8udGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgaGFzTm9uZSA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSB8fCAobW9kZWxJbmRleCA9PSAtMSAmJiBoYXNOb25lKSkge1xuICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSBbeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBtb2RlbCB9XVxuICAgICAgICB9IGVsc2UgaWYgKG1vZGVsSW5kZXggPT0gLTEpIHtcbiAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlLnB1c2goeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBtb2RlbCB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTW9kZWxSZXN1bHRzUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS50YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkgeyAvLyBkZWxldGUgdGhlIHNlY29uZCB2aWRlbyB2aWV3XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicsZmFsc2UpO1xuICAgICAgICAgIHRoaXMuX3ZpZXcuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSB7bW9kZWxfYTogbnVsbCwgbW9kZWxfYjogbnVsbH07XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT09ICdzZXF1ZW50aWFsJykgeyB0aGlzLl92aWV3LnNob3dWaWRlbyh0cnVlKTt9XG4gICAgICAgIGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PT0gJ2p1c3Rtb2RlbCcpIHsgdGhpcy5fdmlldy5zaG93VmlkZW8oZmFsc2UpO31cbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0gW3tcbiAgICAgICAgICB0YWJJZDogJ25vbmUnLFxuICAgICAgICAgIG1vZGVsOiBudWxsXG4gICAgICAgIH1dXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnRhYklkID09ICdib3RoJykge1xuXG4gICAgICAgIC8vMS4gZGlzcGF0Y2ggZXZlbnQgdGhhdCBzYXlzIHRvIGhpZGUgcmVzdWx0c19fdmlzdWFsaXphdGlvbiBhbmQgaW5zdGVhZCBoYXZlIGEgc2Vjb25kIHJlc3VsdHNfX3Zpc3VhbHMgdmlldy5cbiAgICAgICAgR2xvYmFscy5zZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicsdHJ1ZSk7XG4gICAgICAgIHRoaXMuX3ZpZXcuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24oKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLmRpcmVjdE1vZGVsQ29tcGFyaXNvbicsIHsgJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbic6IHRydWUgfSk7XG5cbiAgICAgICAgLy8gMi4gTG9hZCBib3RoIG1vZGVscy5cbiAgICAgICAgY29uc3QgY3Vyck1vZGVsX2EgPSBHbG9iYWxzLmdldCgnTW9kZWxUYWIuYScpLmN1cnJNb2RlbCgpO1xuICAgICAgICBjb25zdCBjdXJyTW9kZWxfYiA9IEdsb2JhbHMuZ2V0KCdNb2RlbFRhYi5iJykuY3Vyck1vZGVsKCk7XG4gICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdCA9IHttb2RlbF9hOiBudWxsLCBtb2RlbF9iOiBudWxsfTtcbiAgICAgICAgdmFyIG1vZGVsTG9nSWRzID0ge21vZGVsX2E6IG51bGwsIG1vZGVsX2I6IG51bGx9O1xuXG4gICAgICAgIGlmIChjdXJyTW9kZWxfYSkge1xuICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbDogY3Vyck1vZGVsX2EsXG4gICAgICAgICAgICAgIHRhYklkOiAnYSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIG1vZGVsTG9nSWRzLm1vZGVsX2EgPSBjdXJyTW9kZWxfYS5pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCAnYScsIHRydWUpO1xuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdC5tb2RlbF9hID0gbnVsbDtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpIT0nY3JlYXRlJykgeyBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbC5BdXRvbWF0aWNTaW11bGF0ZScse3RhYklkOiAnYSd9KTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJNb2RlbF9iKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWxfYixcbiAgICAgICAgICAgICAgdGFiSWQ6ICdiJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgbW9kZWxMb2dJZHMubW9kZWxfYiA9IGN1cnJNb2RlbF9iLmlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsICdiJywgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0Lm1vZGVsX2IgPSBudWxsO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykhPSdjcmVhdGUnKSB7IEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsLkF1dG9tYXRpY1NpbXVsYXRlJyx7dGFiSWQ6ICdiJ30pOyB9XG4gICAgICAgIH1cblxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgbW9kZWxJZDogbW9kZWxMb2dJZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgIH0gZWxzZSB7IC8vIG9ubHkgb25lIG1vZGVsIGFjdGl2ZVxuXG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gZGVsZXRlIHRoZSBzZWNvbmQgdmlkZW8gdmlld1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyTW9kZWwgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5jdXJyTW9kZWwoKTtcblxuICAgICAgICBpZiAoY3Vyck1vZGVsKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWwsXG4gICAgICAgICAgICAgIHRhYklkOiBldnQuZGF0YS50YWJJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgICBtb2RlbElkOiBjdXJyTW9kZWwuaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgcmVzdWx0SWQ6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykhPSdjcmVhdGUnKSB7IGNvbnNvbGUubG9nKCdhdXRvbWF0aWMgc2ltdWxhdGUnKTsgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWwuQXV0b21hdGljU2ltdWxhdGUnLHt0YWJJZDogZXZ0LmRhdGEudGFiSWR9KTsgfVxuICAgICAgICB9XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0ludGVyYWN0aXZlVGFicy5UYWJSZXF1ZXN0Jywge1xuICAgICAgICAgIHRhYklkOiBgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5fdmlldy5yZXNldCgpO1xuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcbiAgICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXAgPSB7fTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50Q291bnRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuY291bnQgJiYgIWV2dC5kYXRhLm9sZCkge1xuICAgICAgICB0aGlzLl92aWV3LnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAoIWV2dC5kYXRhLmNvdW50KSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59KVxuIl19
