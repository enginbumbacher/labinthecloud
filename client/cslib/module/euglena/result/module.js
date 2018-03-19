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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImRpcmVjdE1vZGVsQ29tcGFyaXNvbiIsImV4cGVyaW1lbnQiLCJsb2FkRXhwSWQiLCJjb3B5T2ZJRCIsImdldExpdmVSZXN1bHRzIiwidGhlbiIsInJlc3VsdHMiLCJzZXQiLCJjb25maWd1cmF0aW9uIiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJzaG93VmlkZW8iLCJfbW9kZWxDYWNoZSIsImZvckVhY2giLCJjYWNoZSIsIm1vZGVsIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJ0YWJJZCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImhhbmRsZU1vZGVsUmVzdWx0cyIsImdldE1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJoYXNOb25lIiwibW9kZWxJbmRleCIsImZpbmRJbmRleCIsIm8iLCJpIiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJtb2RlbF9hIiwibW9kZWxfYiIsInR5cGUiLCJjYXRlZ29yeSIsInRhYiIsImRpc3BhdGNoRXZlbnQiLCJjdXJyTW9kZWxfYSIsImN1cnJNb2RlbCIsImN1cnJNb2RlbF9iIiwibW9kZWxMb2dJZHMiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJwaGFzZSIsInJlc2V0IiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLEtBQUtELFFBQVEseUJBQVIsQ0FBWDtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxPQUFPTCxRQUFRLFFBQVIsQ0FEVDtBQUFBLE1BRUVNLFdBQVdOLFFBQVEsZUFBUixDQUZiOztBQUtBO0FBQUE7O0FBQ0UsNkJBQWM7QUFBQTs7QUFBQTs7QUFFWkUsWUFBTUssV0FBTixRQUF3QixDQUFDLHFCQUFELEVBQXdCLGdCQUF4QixFQUEwQyx3QkFBMUMsRUFBb0UsZ0JBQXBFLEVBQ3RCLDBCQURzQixDQUF4Qjs7QUFHQSxZQUFLQyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFlBQUtDLGFBQUwsR0FBcUIsSUFBckI7O0FBRUEsWUFBS0MsS0FBTCxHQUFhLElBQUlMLElBQUosRUFBYjtBQUNBLFlBQUtLLEtBQUwsQ0FBV0MsZ0JBQVgsQ0FBNEIsOEJBQTVCLEVBQTRELE1BQUtDLHNCQUFqRTs7QUFFQSxZQUFLQyxlQUFMLEdBQXVCLEVBQXZCOztBQUVBVixjQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQkgsZ0JBQXJCLENBQXNDLG1CQUF0QyxFQUEyRCxNQUFLSSxtQkFBaEU7QUFDQVosY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxxQkFBdEMsRUFBNkQsTUFBS0ssY0FBbEU7QUFDQWIsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBS00sY0FBOUQ7QUFD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SUFBNkJqRCxJQUFJQyxJQUFKLENBQVNnRCxLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLL0QsS0FBTCxDQUFXZ0UsS0FBWDtBQUNBLGVBQUtoRSxLQUFMLENBQVdpRSxJQUFYO0FBQ0EsZUFBSzlELGVBQUwsR0FBdUIsRUFBdkI7QUFDRDtBQUNGO0FBdFJIO0FBQUE7QUFBQSwrQ0F3UjJCVyxHQXhSM0IsRUF3UmdDO0FBQzVCLFlBQUlBLElBQUlDLElBQUosQ0FBU21ELEtBQVQsSUFBa0IsQ0FBQ3BELElBQUlDLElBQUosQ0FBU29ELEdBQWhDLEVBQXFDO0FBQ25DLGVBQUtuRSxLQUFMLENBQVdvRSxJQUFYO0FBQ0QsU0FGRCxNQUVPLElBQUksQ0FBQ3RELElBQUlDLElBQUosQ0FBU21ELEtBQWQsRUFBcUI7QUFDMUIsZUFBS2xFLEtBQUwsQ0FBV2lFLElBQVg7QUFDRDtBQUNGO0FBOVJIOztBQUFBO0FBQUEsSUFBbUN2RSxNQUFuQztBQWlTRCxDQTNTRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBSZXN1bHRzTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkV4cGVyaW1lbnRMb2FkZWQnLCAnX29uTW9kZWxMb2FkZWQnLCAnX29uTW9kZWxSZXN1bHRzUmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZScsXG4gICAgICAgICdfb25FeHBlcmltZW50Q291bnRDaGFuZ2UnXSk7XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRFeHBlcmltZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IG51bGw7XG5cbiAgICAgIHRoaXMuX3ZpZXcgPSBuZXcgVmlldygpO1xuICAgICAgdGhpcy5fdmlldy5hZGRFdmVudExpc3RlbmVyKCdSZXN1bHRzVmlldy5SZXF1ZXN0TW9kZWxEYXRhJywgdGhpcy5fb25Nb2RlbFJlc3VsdHNSZXF1ZXN0KTtcblxuICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXAgPSB7fTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5Mb2FkZWQnLCB0aGlzLl9vbkV4cGVyaW1lbnRMb2FkZWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHRoaXMuX29uTW9kZWxMb2FkZWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLmRpcmVjdE1vZGVsQ29tcGFyaXNvbicsIHRoaXMuX29uRXhwZXJpbWVudExvYWRlZCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIEhNLmhvb2soJ1BhbmVsLkNvbnRlbnRzJywgKHN1YmplY3QsIG1ldGEpID0+IHtcbiAgICAgICAgaWYgKG1ldGEuaWQgPT0gXCJyZXN1bHRcIikge1xuICAgICAgICAgIHN1YmplY3QucHVzaCh0aGlzLl92aWV3KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViamVjdDtcbiAgICAgIH0sIDEwKTtcbiAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudExvYWRlZChldnQpIHtcblxuICAgICAgaWYgKGV2dC5kYXRhLmRpcmVjdE1vZGVsQ29tcGFyaXNvbikgeyAvLyBMb2FkIGV4cGVyaW1lbnQgaW50byB0aGUgc2Vjb25kIHZpZGVvIHZpZXcgZm9yIG1vZGVsIGNvbXBhcmlzb24gd2hlbiBhY3RpdmF0ZWQgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vdmFyIHJlc3VsdHMgPSBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnRSZXN1bHRzJyk7XG4gICAgICAgIC8vdmFyIGV4cCA9IHtjb25maWd1cmF0aW9uOiBHbG9iYWxzLmdldCgnY3VycmVudExpZ2h0RGF0YScpfTtcbiAgICAgICAgLy90aGlzLl92aWV3LmhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV4cCwgcmVzdWx0cywgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQgIT0gdGhpcy5fY3VycmVudEV4cGVyaW1lbnQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudEV4cGVyaW1lbnQgPSBldnQuZGF0YS5leHBlcmltZW50LmlkO1xuXG4gICAgICAgIGlmIChldnQuZGF0YS5leHBlcmltZW50LmlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIHZhciBsb2FkRXhwSWQgPSBldnQuZGF0YS5leHBlcmltZW50LmNvcHlPZklEID4gMCA/IGV2dC5kYXRhLmV4cGVyaW1lbnQuY29weU9mSUQgOiBldnQuZGF0YS5leHBlcmltZW50LmlkO1xuICAgICAgICAgIEV1Z1V0aWxzLmdldExpdmVSZXN1bHRzKGxvYWRFeHBJZCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRFeHBlcmltZW50UmVzdWx0cycsIHJlc3VsdHMpO1xuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRMaWdodERhdGEnLGV2dC5kYXRhLmV4cGVyaW1lbnQuY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMoZXZ0LmRhdGEuZXhwZXJpbWVudCwgcmVzdWx0cyk7IC8vLy8gVEhJUyBJUyBXSEVSRSBJIENBTiBDSEFOR0UgVEhFIEdSQVBIIFZJRVcuXG5cbiAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT09ICdzZXF1ZW50aWFsJykgeyB0aGlzLl92aWV3LnNob3dWaWRlbyh0cnVlKTt9XG4gICAgICAgICAgICBlbHNlIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT09ICdqdXN0bW9kZWwnKSB7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKHRydWUpO31cblxuICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkgeyAvLyBJbiBjYXNlIG1vZGVsIGNvbXBhcmlzb24gaXMgYWN0aXZlIGFuZCBhIG5ldyBleHAgaXMgbG9hZGVkXG4gICAgICAgICAgICAgIC8vTG9hZCB0aGUgbW9kZWxzIHRoYXQgYXJlIGluIGNhY2hlLCBvciByZS1ydW4uXG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUuZm9yRWFjaCggZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGNhY2hlXG4gICAgICAgICAgICAgICAgfSkgfSwgdGhpcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX21vZGVsQ2FjaGUgJiYgdGhpcy5fbW9kZWxDYWNoZVswXS5tb2RlbCAhPSBudWxsKSB7IC8vIElmIGEgbW9kZWwgaGFzIGJlZW4gY2FjaGVkLCBzaG93IHRoYXQgdmlkZW8gdG9vLlxuICAgICAgICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgICAgICAgZGF0YTogdGhpcy5fbW9kZWxDYWNoZVswXVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnanVzdG1vZGVsJykgeyB0aGlzLl92aWV3LnNob3dWaWRlbyhmYWxzZSk7fVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbk1vZGVsTG9hZGVkKGV2dCkge1xuICAgICAgLypcbiAgICAgIGlmICghVXRpbHMuZXhpc3RzKHRoaXMuX2ZpcnN0TW9kZWxTa2lwW2V2dC5kYXRhLnRhYklkXSkpIHtcbiAgICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXBbZXZ0LmRhdGEudGFiSWRdID0gdHJ1ZTtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke2V2dC5kYXRhLnRhYklkfWApLmhpc3RvcnlDb3VudCgpICE9IDAgJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpID09IFwiY3JlYXRlXCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICovXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykgeyB0aGlzLl92aWV3LnNob3dWaWRlbyhmYWxzZSk7fVxuICAgICAgZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdqdXN0bW9kZWwnKSB7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKGZhbHNlKTt9XG5cbiAgICAgIGlmIChldnQuZGF0YS5tb2RlbC5pZCAhPSAnX25ldycgJiYgR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykpIHtcbiAgICAgICAgaWYgKCEoZXZ0LmRhdGEudGFiSWQgPT0gdGhpcy5fY3VycmVudE1vZGVsICYmIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSAmJlxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXS5ldWdsZW5hTW9kZWxJZCA9PSBldnQuZGF0YS5tb2RlbC5pZCAmJlxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXS5leHBlcmltZW50SWQgPT0gR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQpKSB7IC8vIE90aGVyd2lzZSwgdGhlIGN1cnJlbnQgbW9kZWwgZG9lcyBub3QgaGF2ZSB0byBiZSBjaGFuZ2VkIGFueXdheXMuXG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpO1xuXG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkLCBldnQuZGF0YS5tb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIHJlc3VsdHMsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpOyAvLyBUSElTIElTIFdIRVJFIEkgSEFWRSBUTyBETyBJVCBXSVRIIFRIRSBHUkFQSCBWSUVXXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSB7IC8vIFRoaXMgaXMgdG8gbWFrZSBzdXJlIHRoYXQgYSBtb2RlbCBkb2VzIG5vdCBnZXQgcmVsb2FkZWQgaWYgaXQgaXMgYWxyZWFkeSBcImFjdGl2ZVwiIGluIHRoZSBjYWNoZVxuICAgICAgICAgICAgZXVnbGVuYU1vZGVsSWQ6IGV2dC5kYXRhLm1vZGVsLmlkLFxuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZFxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgPyAnYm90aCcgOiBldnQuZGF0YS50YWJJZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSA/ICdib3RoJyA6IGV2dC5kYXRhLnRhYklkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpO1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9jYWNoZU1vZGVsKG1vZGVsLCB0YWJJZCkge1xuICAgICAgaWYgKCFtb2RlbC5kYXRlX2NyZWF0ZWQpIHsgLy8gSW4gY2FzZSB0aGUgbW9kZWwgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0LCBjcmVhdGUgaXQgYW5kIHRoZW4gY2FjaGUgaXQuXG4gICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHttb2RlbC5pZH1gKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBsZXQgaGFzTm9uZSA9IGZhbHNlO1xuICAgICAgICAgIGxldCBtb2RlbEluZGV4ID0gdGhpcy5fbW9kZWxDYWNoZS5maW5kSW5kZXgoKG8saSkgPT4ge1xuICAgICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgIGlmIChvLnRhYklkID09PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZVtpXSA9IHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogZGF0YX07XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG8udGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgICBoYXNOb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgfHwgKG1vZGVsSW5kZXggPT0gLTEgJiYgaGFzTm9uZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSBbeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhIH1dXG4gICAgICAgICAgfSBlbHNlIGlmIChtb2RlbEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlLnB1c2goeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBsZXQgaGFzTm9uZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbW9kZWxJbmRleCA9IHRoaXMuX21vZGVsQ2FjaGUuZmluZEluZGV4KChvLGkpID0+IHtcbiAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgIGlmIChvLnRhYklkID09PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGVbaV0gPSB7IHRhYklkOiB0YWJJZCwgbW9kZWw6IG1vZGVsfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChvLnRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICAgIGhhc05vbmUgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgfHwgKG1vZGVsSW5kZXggPT0gLTEgJiYgaGFzTm9uZSkpIHtcbiAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0gW3sgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWwgfV1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlbEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZS5wdXNoKHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWwgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbk1vZGVsUmVzdWx0c1JlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEudGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gZGVsZXRlIHRoZSBzZWNvbmQgdmlkZW8gdmlld1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0ge21vZGVsX2E6IG51bGwsIG1vZGVsX2I6IG51bGx9O1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09PSAnc2VxdWVudGlhbCcpIHsgdGhpcy5fdmlldy5zaG93VmlkZW8odHJ1ZSk7fVxuICAgICAgICBlbHNlIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT09ICdqdXN0bW9kZWwnKSB7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKGZhbHNlKTt9XG4gICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IFt7XG4gICAgICAgICAgdGFiSWQ6ICdub25lJyxcbiAgICAgICAgICBtb2RlbDogbnVsbFxuICAgICAgICB9XVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS50YWJJZCA9PSAnYm90aCcpIHtcblxuICAgICAgICAvLzEuIGRpc3BhdGNoIGV2ZW50IHRoYXQgc2F5cyB0byBoaWRlIHJlc3VsdHNfX3Zpc3VhbGl6YXRpb24gYW5kIGluc3RlYWQgaGF2ZSBhIHNlY29uZCByZXN1bHRzX192aXN1YWxzIHZpZXcuXG4gICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLHRydWUpO1xuICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5kaXJlY3RNb2RlbENvbXBhcmlzb24nLCB7ICdkaXJlY3RNb2RlbENvbXBhcmlzb24nOiB0cnVlIH0pO1xuXG4gICAgICAgIC8vIDIuIExvYWQgYm90aCBtb2RlbHMuXG4gICAgICAgIGNvbnN0IGN1cnJNb2RlbF9hID0gR2xvYmFscy5nZXQoJ01vZGVsVGFiLmEnKS5jdXJyTW9kZWwoKTtcbiAgICAgICAgY29uc3QgY3Vyck1vZGVsX2IgPSBHbG9iYWxzLmdldCgnTW9kZWxUYWIuYicpLmN1cnJNb2RlbCgpO1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSB7bW9kZWxfYTogbnVsbCwgbW9kZWxfYjogbnVsbH07XG4gICAgICAgIHZhciBtb2RlbExvZ0lkcyA9IHttb2RlbF9hOiBudWxsLCBtb2RlbF9iOiBudWxsfTtcblxuICAgICAgICBpZiAoY3Vyck1vZGVsX2EpIHtcbiAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWw6IGN1cnJNb2RlbF9hLFxuICAgICAgICAgICAgICB0YWJJZDogJ2EnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBtb2RlbExvZ0lkcy5tb2RlbF9hID0gY3Vyck1vZGVsX2EuaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgJ2EnLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQubW9kZWxfYSA9IG51bGw7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSE9J2NyZWF0ZScpIHsgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWwuQXV0b21hdGljU2ltdWxhdGUnLHt0YWJJZDogJ2EnfSk7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyTW9kZWxfYikge1xuICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbDogY3Vyck1vZGVsX2IsXG4gICAgICAgICAgICAgIHRhYklkOiAnYidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIG1vZGVsTG9nSWRzLm1vZGVsX2IgPSBjdXJyTW9kZWxfYi5pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCAnYicsIHRydWUpO1xuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdC5tb2RlbF9iID0gbnVsbDtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpIT0nY3JlYXRlJykgeyBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbC5BdXRvbWF0aWNTaW11bGF0ZScse3RhYklkOiAnYid9KTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgIG1vZGVsSWQ6IG1vZGVsTG9nSWRzXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICB9IGVsc2UgeyAvLyBvbmx5IG9uZSBtb2RlbCBhY3RpdmVcblxuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKSB7IC8vIGRlbGV0ZSB0aGUgc2Vjb25kIHZpZGVvIHZpZXdcbiAgICAgICAgICBHbG9iYWxzLnNldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJyxmYWxzZSk7XG4gICAgICAgICAgdGhpcy5fdmlldy5hY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3Vyck1vZGVsID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7ZXZ0LmRhdGEudGFiSWR9YCkuY3Vyck1vZGVsKCk7XG5cbiAgICAgICAgaWYgKGN1cnJNb2RlbCkge1xuICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbDogY3Vyck1vZGVsLFxuICAgICAgICAgICAgICB0YWJJZDogZXZ0LmRhdGEudGFiSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgbW9kZWxJZDogY3Vyck1vZGVsLmlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWQsXG4gICAgICAgICAgICAgIHJlc3VsdElkOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpIT0nY3JlYXRlJykgeyBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdNb2RlbC5BdXRvbWF0aWNTaW11bGF0ZScse3RhYklkOiBldnQuZGF0YS50YWJJZH0pOyB9XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnSW50ZXJhY3RpdmVUYWJzLlRhYlJlcXVlc3QnLCB7XG4gICAgICAgICAgdGFiSWQ6IGBtb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl92aWV3LnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGlkZSgpO1xuICAgICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcCA9IHt9O1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRDb3VudENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5jb3VudCAmJiAhZXZ0LmRhdGEub2xkKSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICghZXZ0LmRhdGEuY291bnQpIHtcbiAgICAgICAgdGhpcy5fdmlldy5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn0pXG4iXX0=
