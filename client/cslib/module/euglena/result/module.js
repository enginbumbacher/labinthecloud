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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImRpcmVjdE1vZGVsQ29tcGFyaXNvbiIsImV4cGVyaW1lbnQiLCJsb2FkRXhwSWQiLCJjb3B5T2ZJRCIsImdldExpdmVSZXN1bHRzIiwidGhlbiIsInJlc3VsdHMiLCJzZXQiLCJjb25maWd1cmF0aW9uIiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJzaG93VmlkZW8iLCJfbW9kZWxDYWNoZSIsImZvckVhY2giLCJjYWNoZSIsIm1vZGVsIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJ0YWJJZCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImhhbmRsZU1vZGVsUmVzdWx0cyIsImdldE1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJoYXNOb25lIiwibW9kZWxJbmRleCIsImZpbmRJbmRleCIsIm8iLCJpIiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJtb2RlbF9hIiwibW9kZWxfYiIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImRpc3BhdGNoRXZlbnQiLCJjdXJyTW9kZWxfYSIsImN1cnJNb2RlbCIsImN1cnJNb2RlbF9iIiwibW9kZWxMb2dJZHMiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJwaGFzZSIsInJlc2V0IiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLEtBQUtELFFBQVEseUJBQVIsQ0FBWDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxPQUFPTCxRQUFRLFFBQVIsQ0FEVDtBQUFBLE1BRUVNLFdBQVdOLFFBQVEsZUFBUixDQUZiOztBQUtBO0FBQUE7O0FBQ0UsNkJBQWM7QUFBQTs7QUFBQTs7QUFFWkUsWUFBTUssV0FBTixRQUF3QixDQUFDLHFCQUFELEVBQXdCLGdCQUF4QixFQUEwQyx3QkFBMUMsRUFBb0UsZ0JBQXBFLEVBQ3RCLDBCQURzQixDQUF4Qjs7QUFHQSxZQUFLQyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFlBQUtDLGFBQUwsR0FBcUIsSUFBckI7O0FBRUEsWUFBS0MsS0FBTCxHQUFhLElBQUlMLElBQUosRUFBYjtBQUNBLFlBQUtLLEtBQUwsQ0FBV0MsZ0JBQVgsQ0FBNEIsOEJBQTVCLEVBQTRELE1BQUtDLHNCQUFqRTs7QUFFQSxZQUFLQyxlQUFMLEdBQXVCLEVBQXZCOztBQUVBVixjQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQkgsZ0JBQXJCLENBQXNDLG1CQUF0QyxFQUEyRCxNQUFLSSxtQkFBaEU7QUFDQVosY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxxQkFBdEMsRUFBNkQsTUFBS0ssY0FBbEU7QUFDQWIsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBS00sY0FBOUQ7QUFD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dFNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRXhwZXJpbWVudExvYWRlZCcsICdfb25Nb2RlbExvYWRlZCcsICdfb25Nb2RlbFJlc3VsdHNSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJyxcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fY3VycmVudEV4cGVyaW1lbnQgPSBudWxsO1xuICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcblxuICAgICAgdGhpcy5fdmlldyA9IG5ldyBWaWV3KCk7XG4gICAgICB0aGlzLl92aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB0aGlzLl9vbk1vZGVsUmVzdWx0c1JlcXVlc3QpO1xuXG4gICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcCA9IHt9O1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkxvYWRlZCcsIHRoaXMuX29uRXhwZXJpbWVudExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuTG9hZGVkJywgdGhpcy5fb25Nb2RlbExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuZGlyZWN0TW9kZWxDb21wYXJpc29uJywgdGhpcy5fb25FeHBlcmltZW50TG9hZGVkKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgSE0uaG9vaygnUGFuZWwuQ29udGVudHMnLCAoc3ViamVjdCwgbWV0YSkgPT4ge1xuICAgICAgICBpZiAobWV0YS5pZCA9PSBcInJlc3VsdFwiKSB7XG4gICAgICAgICAgc3ViamVjdC5wdXNoKHRoaXMuX3ZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgICAgfSwgMTApO1xuICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50TG9hZGVkKGV2dCkge1xuXG4gICAgICBpZiAoZXZ0LmRhdGEuZGlyZWN0TW9kZWxDb21wYXJpc29uKSB7IC8vIExvYWQgZXhwZXJpbWVudCBpbnRvIHRoZSBzZWNvbmQgdmlkZW8gdmlldyBmb3IgbW9kZWwgY29tcGFyaXNvbiB3aGVuIGFjdGl2YXRlZCBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy92YXIgcmVzdWx0cyA9IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMnKTtcbiAgICAgICAgLy92YXIgZXhwID0ge2NvbmZpZ3VyYXRpb246IEdsb2JhbHMuZ2V0KCdjdXJyZW50TGlnaHREYXRhJyl9O1xuICAgICAgICAvL3RoaXMuX3ZpZXcuaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMoZXhwLCByZXN1bHRzLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCAhPSB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCA9IGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQ7XG5cbiAgICAgICAgaWYgKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgICAgdmFyIGxvYWRFeHBJZCA9IGV2dC5kYXRhLmV4cGVyaW1lbnQuY29weU9mSUQgPiAwID8gZXZ0LmRhdGEuZXhwZXJpbWVudC5jb3B5T2ZJRCA6IGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQ7XG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TGl2ZVJlc3VsdHMobG9hZEV4cElkKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudEV4cGVyaW1lbnRSZXN1bHRzJywgcmVzdWx0cyk7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudExpZ2h0RGF0YScsZXZ0LmRhdGEuZXhwZXJpbWVudC5jb25maWd1cmF0aW9uKTtcblxuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVFeHBlcmltZW50UmVzdWx0cyhldnQuZGF0YS5leHBlcmltZW50LCByZXN1bHRzKTsgLy8vLyBUSElTIElTIFdIRVJFIEkgQ0FOIENIQU5HRSBUSEUgR1JBUEggVklFVy5cblxuICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnc2VxdWVudGlhbCcpIHt0aGlzLl92aWV3LnNob3dWaWRlbyh0cnVlKTt9XG5cbiAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gSW4gY2FzZSBtb2RlbCBjb21wYXJpc29uIGlzIGFjdGl2ZSBhbmQgYSBuZXcgZXhwIGlzIGxvYWRlZFxuICAgICAgICAgICAgICAvL0xvYWQgdGhlIG1vZGVscyB0aGF0IGFyZSBpbiBjYWNoZSwgb3IgcmUtcnVuLlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlLmZvckVhY2goIGZ1bmN0aW9uKGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICAgICAgICBkYXRhOiBjYWNoZVxuICAgICAgICAgICAgICAgIH0pIH0sIHRoaXMpXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbENhY2hlICYmIHRoaXMuX21vZGVsQ2FjaGVbMF0ubW9kZWwgIT0gbnVsbCkgeyAvLyBJZiBhIG1vZGVsIGhhcyBiZWVuIGNhY2hlZCwgc2hvdyB0aGF0IHZpZGVvIHRvby5cbiAgICAgICAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuX21vZGVsQ2FjaGVbMF1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbk1vZGVsTG9hZGVkKGV2dCkge1xuICAgICAgLypcbiAgICAgIGlmICghVXRpbHMuZXhpc3RzKHRoaXMuX2ZpcnN0TW9kZWxTa2lwW2V2dC5kYXRhLnRhYklkXSkpIHtcbiAgICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXBbZXZ0LmRhdGEudGFiSWRdID0gdHJ1ZTtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke2V2dC5kYXRhLnRhYklkfWApLmhpc3RvcnlDb3VudCgpICE9IDAgJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpID09IFwiY3JlYXRlXCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICovXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykge3RoaXMuX3ZpZXcuc2hvd1ZpZGVvKGZhbHNlKTt9XG5cbiAgICAgIGlmIChldnQuZGF0YS5tb2RlbC5pZCAhPSAnX25ldycgJiYgR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykpIHtcbiAgICAgICAgaWYgKCEoZXZ0LmRhdGEudGFiSWQgPT0gdGhpcy5fY3VycmVudE1vZGVsICYmIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSAmJlxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXS5ldWdsZW5hTW9kZWxJZCA9PSBldnQuZGF0YS5tb2RlbC5pZCAmJlxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXS5leHBlcmltZW50SWQgPT0gR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQpKSB7IC8vIE90aGVyd2lzZSwgdGhlIGN1cnJlbnQgbW9kZWwgZG9lcyBub3QgaGF2ZSB0byBiZSBjaGFuZ2VkIGFueXdheXMuXG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpO1xuXG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkLCBldnQuZGF0YS5tb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIHJlc3VsdHMsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpOyAvLyBUSElTIElTIFdIRVJFIEkgSEFWRSBUTyBETyBJVCBXSVRIIFRIRSBHUkFQSCBWSUVXXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSB7IC8vIFRoaXMgaXMgdG8gbWFrZSBzdXJlIHRoYXQgYSBtb2RlbCBkb2VzIG5vdCBnZXQgcmVsb2FkZWQgaWYgaXQgaXMgYWxyZWFkeSBcImFjdGl2ZVwiIGluIHRoZSBjYWNoZVxuICAgICAgICAgICAgZXVnbGVuYU1vZGVsSWQ6IGV2dC5kYXRhLm1vZGVsLmlkLFxuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZFxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgPyAnYm90aCcgOiBldnQuZGF0YS50YWJJZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSA/ICdib3RoJyA6IGV2dC5kYXRhLnRhYklkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpO1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9jYWNoZU1vZGVsKG1vZGVsLCB0YWJJZCkge1xuICAgICAgaWYgKCFtb2RlbC5kYXRlX2NyZWF0ZWQpIHsgLy8gSW4gY2FzZSB0aGUgbW9kZWwgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0LCBjcmVhdGUgaXQgYW5kIHRoZW4gY2FjaGUgaXQuXG4gICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHttb2RlbC5pZH1gKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBsZXQgaGFzTm9uZSA9IGZhbHNlO1xuICAgICAgICAgIGxldCBtb2RlbEluZGV4ID0gdGhpcy5fbW9kZWxDYWNoZS5maW5kSW5kZXgoKG8saSkgPT4ge1xuICAgICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgIGlmIChvLnRhYklkID09PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZVtpXSA9IHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogZGF0YX07XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG8udGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgICBoYXNOb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgfHwgKG1vZGVsSW5kZXggPT0gLTEgJiYgaGFzTm9uZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSBbeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhIH1dXG4gICAgICAgICAgfSBlbHNlIGlmIChtb2RlbEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlLnB1c2goeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBsZXQgaGFzTm9uZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbW9kZWxJbmRleCA9IHRoaXMuX21vZGVsQ2FjaGUuZmluZEluZGV4KChvLGkpID0+IHtcbiAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgIGlmIChvLnRhYklkID09PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGVbaV0gPSB7IHRhYklkOiB0YWJJZCwgbW9kZWw6IG1vZGVsfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChvLnRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICAgIGhhc05vbmUgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgfHwgKG1vZGVsSW5kZXggPT0gLTEgJiYgaGFzTm9uZSkpIHtcbiAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0gW3sgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWwgfV1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlbEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZS5wdXNoKHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWwgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbk1vZGVsUmVzdWx0c1JlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEudGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gZGVsZXRlIHRoZSBzZWNvbmQgdmlkZW8gdmlld1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0ge21vZGVsX2E6IG51bGwsIG1vZGVsX2I6IG51bGx9O1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykgeyB0aGlzLl92aWV3LnNob3dWaWRlbyh0cnVlKTt9XG4gICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IFt7XG4gICAgICAgICAgdGFiSWQ6ICdub25lJyxcbiAgICAgICAgICBtb2RlbDogbnVsbFxuICAgICAgICB9XVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS50YWJJZCA9PSAnYm90aCcpIHtcblxuICAgICAgICAvLzEuIGRpc3BhdGNoIGV2ZW50IHRoYXQgc2F5cyB0byBoaWRlIHJlc3VsdHNfX3Zpc3VhbGl6YXRpb24gYW5kIGluc3RlYWQgaGF2ZSBhIHNlY29uZCByZXN1bHRzX192aXN1YWxzIHZpZXcuXG4gICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLHRydWUpO1xuICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5kaXJlY3RNb2RlbENvbXBhcmlzb24nLCB7ICdkaXJlY3RNb2RlbENvbXBhcmlzb24nOiB0cnVlIH0pO1xuXG4gICAgICAgIC8vIDIuIExvYWQgYm90aCBtb2RlbHMuXG4gICAgICAgIGNvbnN0IGN1cnJNb2RlbF9hID0gR2xvYmFscy5nZXQoJ01vZGVsVGFiLmEnKS5jdXJyTW9kZWwoKTtcbiAgICAgICAgY29uc3QgY3Vyck1vZGVsX2IgPSBHbG9iYWxzLmdldCgnTW9kZWxUYWIuYicpLmN1cnJNb2RlbCgpO1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSB7bW9kZWxfYTogbnVsbCwgbW9kZWxfYjogbnVsbH07XG4gICAgICAgIHZhciBtb2RlbExvZ0lkcyA9IHttb2RlbF9hOiBudWxsLCBtb2RlbF9iOiBudWxsfTtcblxuICAgICAgICBpZiAoY3Vyck1vZGVsX2EpIHtcbiAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWw6IGN1cnJNb2RlbF9hLFxuICAgICAgICAgICAgICB0YWJJZDogJ2EnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBtb2RlbExvZ0lkcy5tb2RlbF9hID0gY3Vyck1vZGVsX2EuaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgJ2EnLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQubW9kZWxfYSA9IG51bGw7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSE9J2NyZWF0ZScpIHsgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWwuQXV0b21hdGljU2ltdWxhdGUnLHt0YWJJZDogJ2EnfSk7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyTW9kZWxfYikge1xuICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbDogY3Vyck1vZGVsX2IsXG4gICAgICAgICAgICAgIHRhYklkOiAnYidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIG1vZGVsTG9nSWRzLm1vZGVsX2IgPSBjdXJyTW9kZWxfYi5pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCAnYicsIHRydWUpO1xuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdC5tb2RlbF9iID0gbnVsbDtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpIT0nY3JlYXRlJykgeyBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbC5BdXRvbWF0aWNTaW11bGF0ZScse3RhYklkOiAnYid9KTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgIG1vZGVsSWQ6IG1vZGVsTG9nSWRzXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICB9IGVsc2UgeyAvLyBvbmx5IG9uZSBtb2RlbCBhY3RpdmVcblxuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKSB7IC8vIGRlbGV0ZSB0aGUgc2Vjb25kIHZpZGVvIHZpZXdcbiAgICAgICAgICBHbG9iYWxzLnNldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJyxmYWxzZSk7XG4gICAgICAgICAgdGhpcy5fdmlldy5hY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3Vyck1vZGVsID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7ZXZ0LmRhdGEudGFiSWR9YCkuY3Vyck1vZGVsKCk7XG5cbiAgICAgICAgaWYgKGN1cnJNb2RlbCkge1xuICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbDogY3Vyck1vZGVsLFxuICAgICAgICAgICAgICB0YWJJZDogZXZ0LmRhdGEudGFiSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgbW9kZWxJZDogY3Vyck1vZGVsLmlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWQsXG4gICAgICAgICAgICAgIHJlc3VsdElkOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpIT0nY3JlYXRlJykgeyBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbC5BdXRvbWF0aWNTaW11bGF0ZScse3RhYklkOiBldnQuZGF0YS50YWJJZH0pOyB9XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnSW50ZXJhY3RpdmVUYWJzLlRhYlJlcXVlc3QnLCB7XG4gICAgICAgICAgdGFiSWQ6IGBtb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl92aWV3LnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGlkZSgpO1xuICAgICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcCA9IHt9O1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRDb3VudENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5jb3VudCAmJiAhZXZ0LmRhdGEub2xkKSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICghZXZ0LmRhdGEuY291bnQpIHtcbiAgICAgICAgdGhpcy5fdmlldy5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn0pXG4iXX0=
