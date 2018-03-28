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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImRpcmVjdE1vZGVsQ29tcGFyaXNvbiIsImV4cGVyaW1lbnQiLCJsb2FkRXhwSWQiLCJjb3B5T2ZJRCIsImdldExpdmVSZXN1bHRzIiwidGhlbiIsInJlc3VsdHMiLCJzZXQiLCJjb25maWd1cmF0aW9uIiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJzaG93VmlkZW8iLCJfbW9kZWxDYWNoZSIsImZvckVhY2giLCJjYWNoZSIsIm1vZGVsIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJ0YWJJZCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImhhbmRsZU1vZGVsUmVzdWx0cyIsImdldE1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJoYXNOb25lIiwibW9kZWxJbmRleCIsImZpbmRJbmRleCIsIm8iLCJpIiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJtb2RlbF9hIiwibW9kZWxfYiIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImRpc3BhdGNoRXZlbnQiLCJjdXJyTW9kZWxfYSIsImN1cnJNb2RlbCIsImN1cnJNb2RlbF9iIiwibW9kZWxMb2dJZHMiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJwaGFzZSIsInJlc2V0IiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLEtBQUtELFFBQVEseUJBQVIsQ0FBWDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxPQUFPTCxRQUFRLFFBQVIsQ0FEVDtBQUFBLE1BRUVNLFdBQVdOLFFBQVEsZUFBUixDQUZiOztBQUtBO0FBQUE7O0FBQ0UsNkJBQWM7QUFBQTs7QUFBQTs7QUFFWkUsWUFBTUssV0FBTixRQUF3QixDQUFDLHFCQUFELEVBQXdCLGdCQUF4QixFQUEwQyx3QkFBMUMsRUFBb0UsZ0JBQXBFLEVBQ3RCLDBCQURzQixDQUF4Qjs7QUFHQSxZQUFLQyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFlBQUtDLGFBQUwsR0FBcUIsSUFBckI7O0FBRUEsWUFBS0MsS0FBTCxHQUFhLElBQUlMLElBQUosRUFBYjtBQUNBLFlBQUtLLEtBQUwsQ0FBV0MsZ0JBQVgsQ0FBNEIsOEJBQTVCLEVBQTRELE1BQUtDLHNCQUFqRTs7QUFFQSxZQUFLQyxlQUFMLEdBQXVCLEVBQXZCOztBQUVBVixjQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQkgsZ0JBQXJCLENBQXNDLG1CQUF0QyxFQUEyRCxNQUFLSSxtQkFBaEU7QUFDQVosY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxxQkFBdEMsRUFBNkQsTUFBS0ssY0FBbEU7QUFDQWIsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBS00sY0FBOUQ7QUFD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QyxJQUFKLENBQVNnRCxLQUFULElBQWtCLE9BQWxCLElBQTZCakQsSUFBSUMsSUFBSixDQUFTZ0QsS0FBVCxJQUFrQixpQkFBbkQsRUFBc0U7QUFDcEUsZUFBSy9ELEtBQUwsQ0FBV2dFLEtBQVg7QUFDQSxlQUFLaEUsS0FBTCxDQUFXaUUsSUFBWDtBQUNBLGVBQUs5RCxlQUFMLEdBQXVCLEVBQXZCO0FBQ0Q7QUFDRjtBQXRSSDtBQUFBO0FBQUEsK0NBd1IyQlcsR0F4UjNCLEVBd1JnQztBQUM1QixZQUFJQSxJQUFJQyxJQUFKLENBQVNtRCxLQUFULElBQWtCLENBQUNwRCxJQUFJQyxJQUFKLENBQVNvRCxHQUFoQyxFQUFxQztBQUNuQyxlQUFLbkUsS0FBTCxDQUFXb0UsSUFBWDtBQUNELFNBRkQsTUFFTyxJQUFJLENBQUN0RCxJQUFJQyxJQUFKLENBQVNtRCxLQUFkLEVBQXFCO0FBQzFCLGVBQUtsRSxLQUFMLENBQVdpRSxJQUFYO0FBQ0Q7QUFDRjtBQTlSSDs7QUFBQTtBQUFBLElBQW1DdkUsTUFBbkM7QUFpU0QsQ0EzU0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvcmVzdWx0L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0c01vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25FeHBlcmltZW50TG9hZGVkJywgJ19vbk1vZGVsTG9hZGVkJywgJ19vbk1vZGVsUmVzdWx0c1JlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgICAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCA9IG51bGw7XG4gICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuXG4gICAgICB0aGlzLl92aWV3ID0gbmV3IFZpZXcoKTtcbiAgICAgIHRoaXMuX3ZpZXcuYWRkRXZlbnRMaXN0ZW5lcignUmVzdWx0c1ZpZXcuUmVxdWVzdE1vZGVsRGF0YScsIHRoaXMuX29uTW9kZWxSZXN1bHRzUmVxdWVzdCk7XG5cbiAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwID0ge307XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTG9hZGVkJywgdGhpcy5fb25FeHBlcmltZW50TG9hZGVkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB0aGlzLl9vbk1vZGVsTG9hZGVkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHRoaXMuX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V1Z2xlbmFNb2RlbC5kaXJlY3RNb2RlbENvbXBhcmlzb24nLCB0aGlzLl9vbkV4cGVyaW1lbnRMb2FkZWQpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIChzdWJqZWN0LCBtZXRhKSA9PiB7XG4gICAgICAgIGlmIChtZXRhLmlkID09IFwicmVzdWx0XCIpIHtcbiAgICAgICAgICBzdWJqZWN0LnB1c2godGhpcy5fdmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1YmplY3Q7XG4gICAgICB9LCAxMCk7XG4gICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRMb2FkZWQoZXZ0KSB7XG5cbiAgICAgIGlmIChldnQuZGF0YS5kaXJlY3RNb2RlbENvbXBhcmlzb24pIHsgLy8gTG9hZCBleHBlcmltZW50IGludG8gdGhlIHNlY29uZCB2aWRlbyB2aWV3IGZvciBtb2RlbCBjb21wYXJpc29uIHdoZW4gYWN0aXZhdGVkIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvL3ZhciByZXN1bHRzID0gR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50UmVzdWx0cycpO1xuICAgICAgICAvL3ZhciBleHAgPSB7Y29uZmlndXJhdGlvbjogR2xvYmFscy5nZXQoJ2N1cnJlbnRMaWdodERhdGEnKX07XG4gICAgICAgIC8vdGhpcy5fdmlldy5oYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlc3VsdHMsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5leHBlcmltZW50LmlkICE9IHRoaXMuX2N1cnJlbnRFeHBlcmltZW50KSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRFeHBlcmltZW50ID0gZXZ0LmRhdGEuZXhwZXJpbWVudC5pZDtcblxuICAgICAgICBpZiAoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCAhPSAnX25ldycpIHtcbiAgICAgICAgICB2YXIgbG9hZEV4cElkID0gZXZ0LmRhdGEuZXhwZXJpbWVudC5jb3B5T2ZJRCA+IDAgPyBldnQuZGF0YS5leHBlcmltZW50LmNvcHlPZklEIDogZXZ0LmRhdGEuZXhwZXJpbWVudC5pZDtcbiAgICAgICAgICBFdWdVdGlscy5nZXRMaXZlUmVzdWx0cyhsb2FkRXhwSWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMnLCByZXN1bHRzKTtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50TGlnaHREYXRhJyxldnQuZGF0YS5leHBlcmltZW50LmNvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV2dC5kYXRhLmV4cGVyaW1lbnQsIHJlc3VsdHMpOyAvLy8vIFRISVMgSVMgV0hFUkUgSSBDQU4gQ0hBTkdFIFRIRSBHUkFQSCBWSUVXLlxuXG4gICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnc2VxdWVudGlhbCcpIHsgdGhpcy5fdmlldy5zaG93VmlkZW8odHJ1ZSk7fVxuICAgICAgICAgICAgZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnanVzdG1vZGVsJykgeyB0aGlzLl92aWV3LnNob3dWaWRlbyh0cnVlKTt9XG5cbiAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gSW4gY2FzZSBtb2RlbCBjb21wYXJpc29uIGlzIGFjdGl2ZSBhbmQgYSBuZXcgZXhwIGlzIGxvYWRlZFxuICAgICAgICAgICAgICAvL0xvYWQgdGhlIG1vZGVscyB0aGF0IGFyZSBpbiBjYWNoZSwgb3IgcmUtcnVuLlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlLmZvckVhY2goIGZ1bmN0aW9uKGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICAgICAgICBkYXRhOiBjYWNoZVxuICAgICAgICAgICAgICAgIH0pIH0sIHRoaXMpXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbENhY2hlICYmIHRoaXMuX21vZGVsQ2FjaGVbMF0ubW9kZWwgIT0gbnVsbCkgeyAvLyBJZiBhIG1vZGVsIGhhcyBiZWVuIGNhY2hlZCwgc2hvdyB0aGF0IHZpZGVvIHRvby5cbiAgICAgICAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuX21vZGVsQ2FjaGVbMF1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PT0gJ2p1c3Rtb2RlbCcpIHsgdGhpcy5fdmlldy5zaG93VmlkZW8oZmFsc2UpO31cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbExvYWRlZChldnQpIHtcbiAgICAgIC8qXG4gICAgICBpZiAoIVV0aWxzLmV4aXN0cyh0aGlzLl9maXJzdE1vZGVsU2tpcFtldnQuZGF0YS50YWJJZF0pKSB7XG4gICAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwW2V2dC5kYXRhLnRhYklkXSA9IHRydWU7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5oaXN0b3J5Q291bnQoKSAhPSAwICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSA9PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAqL1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnc2VxdWVudGlhbCcpIHsgdGhpcy5fdmlldy5zaG93VmlkZW8oZmFsc2UpO31cbiAgICAgIGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnanVzdG1vZGVsJykgeyB0aGlzLl92aWV3LnNob3dWaWRlbyhmYWxzZSk7fVxuXG4gICAgICBpZiAoZXZ0LmRhdGEubW9kZWwuaWQgIT0gJ19uZXcnICYmIEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpKSB7XG4gICAgICAgIGlmICghKGV2dC5kYXRhLnRhYklkID09IHRoaXMuX2N1cnJlbnRNb2RlbCAmJiB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gJiZcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0uZXVnbGVuYU1vZGVsSWQgPT0gZXZ0LmRhdGEubW9kZWwuaWQgJiZcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0uZXhwZXJpbWVudElkID09IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkKSkgeyAvLyBPdGhlcndpc2UsIHRoZSBjdXJyZW50IG1vZGVsIGRvZXMgbm90IGhhdmUgdG8gYmUgY2hhbmdlZCBhbnl3YXlzLlxuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKGV2dC5kYXRhLm1vZGVsLCBudWxsLCBldnQuZGF0YS50YWJJZCwgR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKTtcblxuICAgICAgICAgIEV1Z1V0aWxzLmdldE1vZGVsUmVzdWx0cyhHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZCwgZXZ0LmRhdGEubW9kZWwpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKGV2dC5kYXRhLm1vZGVsLCByZXN1bHRzLCBldnQuZGF0YS50YWJJZCwgR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKTsgLy8gVEhJUyBJUyBXSEVSRSBJIEhBVkUgVE8gRE8gSVQgV0lUSCBUSEUgR1JBUEggVklFV1xuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdID0geyAvLyBUaGlzIGlzIHRvIG1ha2Ugc3VyZSB0aGF0IGEgbW9kZWwgZG9lcyBub3QgZ2V0IHJlbG9hZGVkIGlmIGl0IGlzIGFscmVhZHkgXCJhY3RpdmVcIiBpbiB0aGUgY2FjaGVcbiAgICAgICAgICAgIGV1Z2xlbmFNb2RlbElkOiBldnQuZGF0YS5tb2RlbC5pZCxcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWRcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpID8gJ2JvdGgnIDogZXZ0LmRhdGEudGFiSWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FjaGVNb2RlbChldnQuZGF0YS5tb2RlbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5tb2RlbC5pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5fY2FjaGVNb2RlbChldnQuZGF0YS5tb2RlbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgPyAnYm90aCcgOiBldnQuZGF0YS50YWJJZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKGV2dC5kYXRhLm1vZGVsLCBudWxsLCBldnQuZGF0YS50YWJJZCwgR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKTtcbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfY2FjaGVNb2RlbChtb2RlbCwgdGFiSWQpIHtcbiAgICAgIGlmICghbW9kZWwuZGF0ZV9jcmVhdGVkKSB7IC8vIEluIGNhc2UgdGhlIG1vZGVsIGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldCwgY3JlYXRlIGl0IGFuZCB0aGVuIGNhY2hlIGl0LlxuICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7bW9kZWwuaWR9YCkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgbGV0IGhhc05vbmUgPSBmYWxzZTtcbiAgICAgICAgICBsZXQgbW9kZWxJbmRleCA9IHRoaXMuX21vZGVsQ2FjaGUuZmluZEluZGV4KChvLGkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoby50YWJJZCA9PT0gdGFiSWQpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGVbaV0gPSB7IHRhYklkOiB0YWJJZCwgbW9kZWw6IGRhdGF9O1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvLnRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgaGFzTm9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmICghR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpIHx8IChtb2RlbEluZGV4ID09IC0xICYmIGhhc05vbmUpKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0gW3sgdGFiSWQ6IHRhYklkLCBtb2RlbDogZGF0YSB9XVxuICAgICAgICAgIH0gZWxzZSBpZiAobW9kZWxJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZS5wdXNoKHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogZGF0YSB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgbGV0IGhhc05vbmUgPSBmYWxzZTtcbiAgICAgICAgbGV0IG1vZGVsSW5kZXggPSB0aGlzLl9tb2RlbENhY2hlLmZpbmRJbmRleCgobyxpKSA9PiB7XG4gICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICBpZiAoby50YWJJZCA9PT0gdGFiSWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlW2ldID0geyB0YWJJZDogdGFiSWQsIG1vZGVsOiBtb2RlbH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoby50YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICBoYXNOb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmICghR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpIHx8IChtb2RlbEluZGV4ID09IC0xICYmIGhhc05vbmUpKSB7XG4gICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IFt7IHRhYklkOiB0YWJJZCwgbW9kZWw6IG1vZGVsIH1dXG4gICAgICAgIH0gZWxzZSBpZiAobW9kZWxJbmRleCA9PSAtMSkge1xuICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUucHVzaCh7IHRhYklkOiB0YWJJZCwgbW9kZWw6IG1vZGVsIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbFJlc3VsdHNSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnRhYklkID09ICdub25lJykge1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKSB7IC8vIGRlbGV0ZSB0aGUgc2Vjb25kIHZpZGVvIHZpZXdcbiAgICAgICAgICBHbG9iYWxzLnNldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJyxmYWxzZSk7XG4gICAgICAgICAgdGhpcy5fdmlldy5hY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdCA9IHttb2RlbF9hOiBudWxsLCBtb2RlbF9iOiBudWxsfTtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PT0gJ3NlcXVlbnRpYWwnKSB7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKHRydWUpO31cbiAgICAgICAgZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnanVzdG1vZGVsJykgeyB0aGlzLl92aWV3LnNob3dWaWRlbyhmYWxzZSk7fVxuICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSBbe1xuICAgICAgICAgIHRhYklkOiAnbm9uZScsXG4gICAgICAgICAgbW9kZWw6IG51bGxcbiAgICAgICAgfV1cbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEudGFiSWQgPT0gJ2JvdGgnKSB7XG5cbiAgICAgICAgLy8xLiBkaXNwYXRjaCBldmVudCB0aGF0IHNheXMgdG8gaGlkZSByZXN1bHRzX192aXN1YWxpemF0aW9uIGFuZCBpbnN0ZWFkIGhhdmUgYSBzZWNvbmQgcmVzdWx0c19fdmlzdWFscyB2aWV3LlxuICAgICAgICBHbG9iYWxzLnNldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJyx0cnVlKTtcbiAgICAgICAgdGhpcy5fdmlldy5hY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuZGlyZWN0TW9kZWxDb21wYXJpc29uJywgeyAnZGlyZWN0TW9kZWxDb21wYXJpc29uJzogdHJ1ZSB9KTtcblxuICAgICAgICAvLyAyLiBMb2FkIGJvdGggbW9kZWxzLlxuICAgICAgICBjb25zdCBjdXJyTW9kZWxfYSA9IEdsb2JhbHMuZ2V0KCdNb2RlbFRhYi5hJykuY3Vyck1vZGVsKCk7XG4gICAgICAgIGNvbnN0IGN1cnJNb2RlbF9iID0gR2xvYmFscy5nZXQoJ01vZGVsVGFiLmInKS5jdXJyTW9kZWwoKTtcbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0ge21vZGVsX2E6IG51bGwsIG1vZGVsX2I6IG51bGx9O1xuICAgICAgICB2YXIgbW9kZWxMb2dJZHMgPSB7bW9kZWxfYTogbnVsbCwgbW9kZWxfYjogbnVsbH07XG5cbiAgICAgICAgaWYgKGN1cnJNb2RlbF9hKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWxfYSxcbiAgICAgICAgICAgICAgdGFiSWQ6ICdhJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgbW9kZWxMb2dJZHMubW9kZWxfYSA9IGN1cnJNb2RlbF9hLmlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsICdhJywgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0Lm1vZGVsX2EgPSBudWxsO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykhPSdjcmVhdGUnKSB7IEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsLkF1dG9tYXRpY1NpbXVsYXRlJyx7dGFiSWQ6ICdhJ30pOyB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3Vyck1vZGVsX2IpIHtcbiAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWw6IGN1cnJNb2RlbF9iLFxuICAgICAgICAgICAgICB0YWJJZDogJ2InXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBtb2RlbExvZ0lkcy5tb2RlbF9iID0gY3Vyck1vZGVsX2IuaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgJ2InLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQubW9kZWxfYiA9IG51bGw7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSE9J2NyZWF0ZScpIHsgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWwuQXV0b21hdGljU2ltdWxhdGUnLHt0YWJJZDogJ2InfSk7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWQsXG4gICAgICAgICAgICBtb2RlbElkOiBtb2RlbExvZ0lkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgfSBlbHNlIHsgLy8gb25seSBvbmUgbW9kZWwgYWN0aXZlXG5cbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkgeyAvLyBkZWxldGUgdGhlIHNlY29uZCB2aWRlbyB2aWV3XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicsZmFsc2UpO1xuICAgICAgICAgIHRoaXMuX3ZpZXcuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN1cnJNb2RlbCA9IEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke2V2dC5kYXRhLnRhYklkfWApLmN1cnJNb2RlbCgpO1xuXG4gICAgICAgIGlmIChjdXJyTW9kZWwpIHtcbiAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWw6IGN1cnJNb2RlbCxcbiAgICAgICAgICAgICAgdGFiSWQ6IGV2dC5kYXRhLnRhYklkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWQsXG4gICAgICAgICAgICAgIG1vZGVsSWQ6IGN1cnJNb2RlbC5pZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSA9IG51bGw7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgICByZXN1bHRJZDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSE9J2NyZWF0ZScpIHsgY29uc29sZS5sb2coJ2F1dG9tYXRpYyBzaW11bGF0ZScpOyBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbC5BdXRvbWF0aWNTaW11bGF0ZScse3RhYklkOiBldnQuZGF0YS50YWJJZH0pOyB9XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnSW50ZXJhY3RpdmVUYWJzLlRhYlJlcXVlc3QnLCB7XG4gICAgICAgICAgdGFiSWQ6IGBtb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl92aWV3LnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGlkZSgpO1xuICAgICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcCA9IHt9O1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRDb3VudENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5jb3VudCAmJiAhZXZ0LmRhdGEub2xkKSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICghZXZ0LmRhdGEuY291bnQpIHtcbiAgICAgICAgdGhpcy5fdmlldy5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn0pXG4iXX0=
