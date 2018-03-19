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
                console.log('onExpLoaded');_this3._view.showVideo(true);
              } else if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') {
                console.log('onExpLoaded');_this3._view.showVideo(true);
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
            console.log('onExpLoaded');this._view.showVideo(false);
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
          console.log('onModLoaded');this._view.showVideo(false);
        } else if (Globals.get('AppConfig.system.expModelModality') == 'justmodel') {
          console.log('onModLoaded');this._view.showVideo(false);
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
            console.log("onModelResultRequest");this._view.showVideo(true);
          } else if (Globals.get('AppConfig.system.expModelModality') === 'justmodel') {
            console.log("onModelResultRequest");this._view.showVideo(false);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImRpcmVjdE1vZGVsQ29tcGFyaXNvbiIsImV4cGVyaW1lbnQiLCJsb2FkRXhwSWQiLCJjb3B5T2ZJRCIsImdldExpdmVSZXN1bHRzIiwidGhlbiIsInJlc3VsdHMiLCJzZXQiLCJjb25maWd1cmF0aW9uIiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJjb25zb2xlIiwibG9nIiwic2hvd1ZpZGVvIiwiX21vZGVsQ2FjaGUiLCJmb3JFYWNoIiwiY2FjaGUiLCJtb2RlbCIsImNhdGNoIiwiZXJyIiwiY2xlYXIiLCJ0YWJJZCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImhhbmRsZU1vZGVsUmVzdWx0cyIsImdldE1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJoYXNOb25lIiwibW9kZWxJbmRleCIsImZpbmRJbmRleCIsIm8iLCJpIiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJtb2RlbF9hIiwibW9kZWxfYiIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImRpc3BhdGNoRXZlbnQiLCJjdXJyTW9kZWxfYSIsImN1cnJNb2RlbCIsImN1cnJNb2RlbF9iIiwibW9kZWxMb2dJZHMiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJwaGFzZSIsInJlc2V0IiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLEtBQUtELFFBQVEseUJBQVIsQ0FBWDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxPQUFPTCxRQUFRLFFBQVIsQ0FEVDtBQUFBLE1BRUVNLFdBQVdOLFFBQVEsZUFBUixDQUZiOztBQUtBO0FBQUE7O0FBQ0UsNkJBQWM7QUFBQTs7QUFBQTs7QUFFWkUsWUFBTUssV0FBTixRQUF3QixDQUFDLHFCQUFELEVBQXdCLGdCQUF4QixFQUEwQyx3QkFBMUMsRUFBb0UsZ0JBQXBFLEVBQ3RCLDBCQURzQixDQUF4Qjs7QUFHQSxZQUFLQyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFlBQUtDLGFBQUwsR0FBcUIsSUFBckI7O0FBRUEsWUFBS0MsS0FBTCxHQUFhLElBQUlMLElBQUosRUFBYjtBQUNBLFlBQUtLLEtBQUwsQ0FBV0MsZ0JBQVgsQ0FBNEIsOEJBQTVCLEVBQTRELE1BQUtDLHNCQUFqRTs7QUFFQSxZQUFLQyxlQUFMLEdBQXVCLEVBQXZCOztBQUVBVixjQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQkgsZ0JBQXJCLENBQXNDLG1CQUF0QyxFQUEyRCxNQUFLSSxtQkFBaEU7QUFDQVosY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxxQkFBdEMsRUFBNkQsTUFBS0ssY0FBbEU7QUFDQWIsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBS00sY0FBOUQ7QUFD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QixLQUFqQixFQUE3RDtBQUF3RjtBQUN4SjtBQUNEM0Msa0JBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCb0QsYUFBckIsQ0FBbUMsNEJBQW5DLEVBQWlFO0FBQy9EcEIsOEJBQWdCdEIsSUFBSUMsSUFBSixDQUFTcUI7QUFEc0MsV0FBakU7QUFHRDtBQUNGO0FBOVFIO0FBQUE7QUFBQSxxQ0FnUmlCdEIsR0FoUmpCLEVBZ1JzQjtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVNnRCxLQUFULElBQWtCLE9BQWxCLElBQTZCakQsSUFBSUMsSUFBSixDQUFTZ0QsS0FBVCxJQUFrQixpQkFBbkQsRUFBc0U7QUFDcEUsZUFBSy9ELEtBQUwsQ0FBV2dFLEtBQVg7QUFDQSxlQUFLaEUsS0FBTCxDQUFXaUUsSUFBWDtBQUNBLGVBQUs5RCxlQUFMLEdBQXVCLEVBQXZCO0FBQ0Q7QUFDRjtBQXRSSDtBQUFBO0FBQUEsK0NBd1IyQlcsR0F4UjNCLEVBd1JnQztBQUM1QixZQUFJQSxJQUFJQyxJQUFKLENBQVNtRCxLQUFULElBQWtCLENBQUNwRCxJQUFJQyxJQUFKLENBQVNvRCxHQUFoQyxFQUFxQztBQUNuQyxlQUFLbkUsS0FBTCxDQUFXb0UsSUFBWDtBQUNELFNBRkQsTUFFTyxJQUFJLENBQUN0RCxJQUFJQyxJQUFKLENBQVNtRCxLQUFkLEVBQXFCO0FBQzFCLGVBQUtsRSxLQUFMLENBQVdpRSxJQUFYO0FBQ0Q7QUFDRjtBQTlSSDs7QUFBQTtBQUFBLElBQW1DdkUsTUFBbkM7QUFpU0QsQ0EzU0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvcmVzdWx0L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0c01vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25FeHBlcmltZW50TG9hZGVkJywgJ19vbk1vZGVsTG9hZGVkJywgJ19vbk1vZGVsUmVzdWx0c1JlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgICAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCA9IG51bGw7XG4gICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuXG4gICAgICB0aGlzLl92aWV3ID0gbmV3IFZpZXcoKTtcbiAgICAgIHRoaXMuX3ZpZXcuYWRkRXZlbnRMaXN0ZW5lcignUmVzdWx0c1ZpZXcuUmVxdWVzdE1vZGVsRGF0YScsIHRoaXMuX29uTW9kZWxSZXN1bHRzUmVxdWVzdCk7XG5cbiAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwID0ge307XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTG9hZGVkJywgdGhpcy5fb25FeHBlcmltZW50TG9hZGVkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB0aGlzLl9vbk1vZGVsTG9hZGVkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHRoaXMuX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V1Z2xlbmFNb2RlbC5kaXJlY3RNb2RlbENvbXBhcmlzb24nLCB0aGlzLl9vbkV4cGVyaW1lbnRMb2FkZWQpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIChzdWJqZWN0LCBtZXRhKSA9PiB7XG4gICAgICAgIGlmIChtZXRhLmlkID09IFwicmVzdWx0XCIpIHtcbiAgICAgICAgICBzdWJqZWN0LnB1c2godGhpcy5fdmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1YmplY3Q7XG4gICAgICB9LCAxMCk7XG4gICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRMb2FkZWQoZXZ0KSB7XG5cbiAgICAgIGlmIChldnQuZGF0YS5kaXJlY3RNb2RlbENvbXBhcmlzb24pIHsgLy8gTG9hZCBleHBlcmltZW50IGludG8gdGhlIHNlY29uZCB2aWRlbyB2aWV3IGZvciBtb2RlbCBjb21wYXJpc29uIHdoZW4gYWN0aXZhdGVkIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvL3ZhciByZXN1bHRzID0gR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50UmVzdWx0cycpO1xuICAgICAgICAvL3ZhciBleHAgPSB7Y29uZmlndXJhdGlvbjogR2xvYmFscy5nZXQoJ2N1cnJlbnRMaWdodERhdGEnKX07XG4gICAgICAgIC8vdGhpcy5fdmlldy5oYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlc3VsdHMsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5leHBlcmltZW50LmlkICE9IHRoaXMuX2N1cnJlbnRFeHBlcmltZW50KSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRFeHBlcmltZW50ID0gZXZ0LmRhdGEuZXhwZXJpbWVudC5pZDtcblxuICAgICAgICBpZiAoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCAhPSAnX25ldycpIHtcbiAgICAgICAgICB2YXIgbG9hZEV4cElkID0gZXZ0LmRhdGEuZXhwZXJpbWVudC5jb3B5T2ZJRCA+IDAgPyBldnQuZGF0YS5leHBlcmltZW50LmNvcHlPZklEIDogZXZ0LmRhdGEuZXhwZXJpbWVudC5pZDtcbiAgICAgICAgICBFdWdVdGlscy5nZXRMaXZlUmVzdWx0cyhsb2FkRXhwSWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMnLCByZXN1bHRzKTtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50TGlnaHREYXRhJyxldnQuZGF0YS5leHBlcmltZW50LmNvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV2dC5kYXRhLmV4cGVyaW1lbnQsIHJlc3VsdHMpOyAvLy8vIFRISVMgSVMgV0hFUkUgSSBDQU4gQ0hBTkdFIFRIRSBHUkFQSCBWSUVXLlxuXG4gICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnc2VxdWVudGlhbCcpIHsgY29uc29sZS5sb2coJ29uRXhwTG9hZGVkJyk7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKHRydWUpO31cbiAgICAgICAgICAgIGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PT0gJ2p1c3Rtb2RlbCcpIHtjb25zb2xlLmxvZygnb25FeHBMb2FkZWQnKTsgIHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKHRydWUpO31cblxuICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkgeyAvLyBJbiBjYXNlIG1vZGVsIGNvbXBhcmlzb24gaXMgYWN0aXZlIGFuZCBhIG5ldyBleHAgaXMgbG9hZGVkXG4gICAgICAgICAgICAgIC8vTG9hZCB0aGUgbW9kZWxzIHRoYXQgYXJlIGluIGNhY2hlLCBvciByZS1ydW4uXG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUuZm9yRWFjaCggZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGNhY2hlXG4gICAgICAgICAgICAgICAgfSkgfSwgdGhpcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX21vZGVsQ2FjaGUgJiYgdGhpcy5fbW9kZWxDYWNoZVswXS5tb2RlbCAhPSBudWxsKSB7IC8vIElmIGEgbW9kZWwgaGFzIGJlZW4gY2FjaGVkLCBzaG93IHRoYXQgdmlkZW8gdG9vLlxuICAgICAgICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgICAgICAgZGF0YTogdGhpcy5fbW9kZWxDYWNoZVswXVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnanVzdG1vZGVsJykge2NvbnNvbGUubG9nKCdvbkV4cExvYWRlZCcpOyAgdGhpcy5fdmlldy5zaG93VmlkZW8oZmFsc2UpO31cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbExvYWRlZChldnQpIHtcbiAgICAgIC8qXG4gICAgICBpZiAoIVV0aWxzLmV4aXN0cyh0aGlzLl9maXJzdE1vZGVsU2tpcFtldnQuZGF0YS50YWJJZF0pKSB7XG4gICAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwW2V2dC5kYXRhLnRhYklkXSA9IHRydWU7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5oaXN0b3J5Q291bnQoKSAhPSAwICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSA9PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAqL1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnc2VxdWVudGlhbCcpIHsgY29uc29sZS5sb2coJ29uTW9kTG9hZGVkJyk7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKGZhbHNlKTt9XG4gICAgICBlbHNlIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ2p1c3Rtb2RlbCcpIHsgY29uc29sZS5sb2coJ29uTW9kTG9hZGVkJyk7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKGZhbHNlKTt9XG5cbiAgICAgIGlmIChldnQuZGF0YS5tb2RlbC5pZCAhPSAnX25ldycgJiYgR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykpIHtcbiAgICAgICAgaWYgKCEoZXZ0LmRhdGEudGFiSWQgPT0gdGhpcy5fY3VycmVudE1vZGVsICYmIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSAmJlxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXS5ldWdsZW5hTW9kZWxJZCA9PSBldnQuZGF0YS5tb2RlbC5pZCAmJlxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXS5leHBlcmltZW50SWQgPT0gR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQpKSB7IC8vIE90aGVyd2lzZSwgdGhlIGN1cnJlbnQgbW9kZWwgZG9lcyBub3QgaGF2ZSB0byBiZSBjaGFuZ2VkIGFueXdheXMuXG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpO1xuXG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkLCBldnQuZGF0YS5tb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIHJlc3VsdHMsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpOyAvLyBUSElTIElTIFdIRVJFIEkgSEFWRSBUTyBETyBJVCBXSVRIIFRIRSBHUkFQSCBWSUVXXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSB7IC8vIFRoaXMgaXMgdG8gbWFrZSBzdXJlIHRoYXQgYSBtb2RlbCBkb2VzIG5vdCBnZXQgcmVsb2FkZWQgaWYgaXQgaXMgYWxyZWFkeSBcImFjdGl2ZVwiIGluIHRoZSBjYWNoZVxuICAgICAgICAgICAgZXVnbGVuYU1vZGVsSWQ6IGV2dC5kYXRhLm1vZGVsLmlkLFxuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZFxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgPyAnYm90aCcgOiBldnQuZGF0YS50YWJJZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSA/ICdib3RoJyA6IGV2dC5kYXRhLnRhYklkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpO1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9jYWNoZU1vZGVsKG1vZGVsLCB0YWJJZCkge1xuICAgICAgaWYgKCFtb2RlbC5kYXRlX2NyZWF0ZWQpIHsgLy8gSW4gY2FzZSB0aGUgbW9kZWwgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0LCBjcmVhdGUgaXQgYW5kIHRoZW4gY2FjaGUgaXQuXG4gICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHttb2RlbC5pZH1gKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBsZXQgaGFzTm9uZSA9IGZhbHNlO1xuICAgICAgICAgIGxldCBtb2RlbEluZGV4ID0gdGhpcy5fbW9kZWxDYWNoZS5maW5kSW5kZXgoKG8saSkgPT4ge1xuICAgICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgIGlmIChvLnRhYklkID09PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZVtpXSA9IHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogZGF0YX07XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG8udGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgICBoYXNOb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgfHwgKG1vZGVsSW5kZXggPT0gLTEgJiYgaGFzTm9uZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSBbeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhIH1dXG4gICAgICAgICAgfSBlbHNlIGlmIChtb2RlbEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlLnB1c2goeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBsZXQgaGFzTm9uZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbW9kZWxJbmRleCA9IHRoaXMuX21vZGVsQ2FjaGUuZmluZEluZGV4KChvLGkpID0+IHtcbiAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgIGlmIChvLnRhYklkID09PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGVbaV0gPSB7IHRhYklkOiB0YWJJZCwgbW9kZWw6IG1vZGVsfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChvLnRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICAgIGhhc05vbmUgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgfHwgKG1vZGVsSW5kZXggPT0gLTEgJiYgaGFzTm9uZSkpIHtcbiAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0gW3sgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWwgfV1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlbEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZS5wdXNoKHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWwgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbk1vZGVsUmVzdWx0c1JlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEudGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gZGVsZXRlIHRoZSBzZWNvbmQgdmlkZW8gdmlld1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0ge21vZGVsX2E6IG51bGwsIG1vZGVsX2I6IG51bGx9O1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnc2VxdWVudGlhbCcpIHsgY29uc29sZS5sb2coXCJvbk1vZGVsUmVzdWx0UmVxdWVzdFwiKTsgdGhpcy5fdmlldy5zaG93VmlkZW8odHJ1ZSk7fVxuICAgICAgICBlbHNlIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT09ICdqdXN0bW9kZWwnKSB7Y29uc29sZS5sb2coXCJvbk1vZGVsUmVzdWx0UmVxdWVzdFwiKTsgdGhpcy5fdmlldy5zaG93VmlkZW8oZmFsc2UpO31cbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0gW3tcbiAgICAgICAgICB0YWJJZDogJ25vbmUnLFxuICAgICAgICAgIG1vZGVsOiBudWxsXG4gICAgICAgIH1dXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnRhYklkID09ICdib3RoJykge1xuXG4gICAgICAgIC8vMS4gZGlzcGF0Y2ggZXZlbnQgdGhhdCBzYXlzIHRvIGhpZGUgcmVzdWx0c19fdmlzdWFsaXphdGlvbiBhbmQgaW5zdGVhZCBoYXZlIGEgc2Vjb25kIHJlc3VsdHNfX3Zpc3VhbHMgdmlldy5cbiAgICAgICAgR2xvYmFscy5zZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicsdHJ1ZSk7XG4gICAgICAgIHRoaXMuX3ZpZXcuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24oKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLmRpcmVjdE1vZGVsQ29tcGFyaXNvbicsIHsgJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbic6IHRydWUgfSk7XG5cbiAgICAgICAgLy8gMi4gTG9hZCBib3RoIG1vZGVscy5cbiAgICAgICAgY29uc3QgY3Vyck1vZGVsX2EgPSBHbG9iYWxzLmdldCgnTW9kZWxUYWIuYScpLmN1cnJNb2RlbCgpO1xuICAgICAgICBjb25zdCBjdXJyTW9kZWxfYiA9IEdsb2JhbHMuZ2V0KCdNb2RlbFRhYi5iJykuY3Vyck1vZGVsKCk7XG4gICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdCA9IHttb2RlbF9hOiBudWxsLCBtb2RlbF9iOiBudWxsfTtcbiAgICAgICAgdmFyIG1vZGVsTG9nSWRzID0ge21vZGVsX2E6IG51bGwsIG1vZGVsX2I6IG51bGx9O1xuXG4gICAgICAgIGlmIChjdXJyTW9kZWxfYSkge1xuICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbDogY3Vyck1vZGVsX2EsXG4gICAgICAgICAgICAgIHRhYklkOiAnYSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIG1vZGVsTG9nSWRzLm1vZGVsX2EgPSBjdXJyTW9kZWxfYS5pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCAnYScsIHRydWUpO1xuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdC5tb2RlbF9hID0gbnVsbDtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpIT0nY3JlYXRlJykgeyBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbC5BdXRvbWF0aWNTaW11bGF0ZScse3RhYklkOiAnYSd9KTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJNb2RlbF9iKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWxfYixcbiAgICAgICAgICAgICAgdGFiSWQ6ICdiJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgbW9kZWxMb2dJZHMubW9kZWxfYiA9IGN1cnJNb2RlbF9iLmlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsICdiJywgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0Lm1vZGVsX2IgPSBudWxsO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykhPSdjcmVhdGUnKSB7IEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsLkF1dG9tYXRpY1NpbXVsYXRlJyx7dGFiSWQ6ICdiJ30pOyB9XG4gICAgICAgIH1cblxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgbW9kZWxJZDogbW9kZWxMb2dJZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgIH0gZWxzZSB7IC8vIG9ubHkgb25lIG1vZGVsIGFjdGl2ZVxuXG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gZGVsZXRlIHRoZSBzZWNvbmQgdmlkZW8gdmlld1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyTW9kZWwgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5jdXJyTW9kZWwoKTtcblxuICAgICAgICBpZiAoY3Vyck1vZGVsKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWwsXG4gICAgICAgICAgICAgIHRhYklkOiBldnQuZGF0YS50YWJJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgICBtb2RlbElkOiBjdXJyTW9kZWwuaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgcmVzdWx0SWQ6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykhPSdjcmVhdGUnKSB7IEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsLkF1dG9tYXRpY1NpbXVsYXRlJyx7dGFiSWQ6IGV2dC5kYXRhLnRhYklkfSk7IH1cbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdJbnRlcmFjdGl2ZVRhYnMuVGFiUmVxdWVzdCcsIHtcbiAgICAgICAgICB0YWJJZDogYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX3ZpZXcucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fdmlldy5oaWRlKCk7XG4gICAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwID0ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy5fdmlldy5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufSlcbiJdfQ==
