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

        if (!Utils.exists(this._firstModelSkip[evt.data.tabId])) {
          this._firstModelSkip[evt.data.tabId] = true;
          if (Globals.get('ModelTab.' + evt.data.tabId).historyCount() != 0 && Globals.get('AppConfig.system.modelModality') == "create") {
            return;
          }
        }
        if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {
          this._view.showVideo(false);
        }

        if (evt.data.model.id != '_new' && Globals.get('currentExperiment')) {
          if (!(evt.data.tabId == this._currentModel && this._lastModelResult['model_' + evt.data.tabId] && this._lastModelResult['model_' + evt.data.tabId].euglenaModelId == evt.data.model.id && this._lastModelResult['model_' + evt.data.tabId].experimentId == Globals.get('currentExperiment').id)) {
            // Otherwise, the current model does not have to be changed anyways.
            this._view.handleModelResults(evt.data.model, null, evt.data.tabId, Globals.get('directModelComparison'));
            console.log('we are getting it now');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImRpcmVjdE1vZGVsQ29tcGFyaXNvbiIsImV4cGVyaW1lbnQiLCJnZXRMaXZlUmVzdWx0cyIsInRoZW4iLCJyZXN1bHRzIiwic2V0IiwiY29uZmlndXJhdGlvbiIsImhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzIiwic2hvd1ZpZGVvIiwiX21vZGVsQ2FjaGUiLCJmb3JFYWNoIiwiY2FjaGUiLCJtb2RlbCIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImNsZWFyIiwiZXhpc3RzIiwidGFiSWQiLCJoaXN0b3J5Q291bnQiLCJfbGFzdE1vZGVsUmVzdWx0IiwiZXVnbGVuYU1vZGVsSWQiLCJleHBlcmltZW50SWQiLCJoYW5kbGVNb2RlbFJlc3VsdHMiLCJnZXRNb2RlbFJlc3VsdHMiLCJfY2FjaGVNb2RlbCIsImRhdGVfY3JlYXRlZCIsInByb21pc2VBamF4IiwiaGFzTm9uZSIsIm1vZGVsSW5kZXgiLCJmaW5kSW5kZXgiLCJvIiwiaSIsImFjdGl2YXRlTW9kZWxDb21wYXJpc29uIiwibW9kZWxfYSIsIm1vZGVsX2IiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJkaXNwYXRjaEV2ZW50IiwiY3Vyck1vZGVsX2EiLCJjdXJyTW9kZWwiLCJjdXJyTW9kZWxfYiIsIm1vZGVsTG9nSWRzIiwibW9kZWxJZCIsInJlc3VsdElkIiwicGhhc2UiLCJyZXNldCIsImhpZGUiLCJjb3VudCIsIm9sZCIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxRQUFRLHlCQUFSLENBQVg7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssT0FBT0wsUUFBUSxRQUFSLENBRFQ7QUFBQSxNQUVFTSxXQUFXTixRQUFRLGVBQVIsQ0FGYjs7QUFLQTtBQUFBOztBQUNFLDZCQUFjO0FBQUE7O0FBQUE7O0FBRVpFLFlBQU1LLFdBQU4sUUFBd0IsQ0FBQyxxQkFBRCxFQUF3QixnQkFBeEIsRUFBMEMsd0JBQTFDLEVBQW9FLGdCQUFwRSxFQUN0QiwwQkFEc0IsQ0FBeEI7O0FBR0EsWUFBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFDQSxZQUFLQyxhQUFMLEdBQXFCLElBQXJCOztBQUVBLFlBQUtDLEtBQUwsR0FBYSxJQUFJTCxJQUFKLEVBQWI7QUFDQSxZQUFLSyxLQUFMLENBQVdDLGdCQUFYLENBQTRCLDhCQUE1QixFQUE0RCxNQUFLQyxzQkFBakU7O0FBRUEsWUFBS0MsZUFBTCxHQUF1QixFQUF2Qjs7QUFFQVYsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxtQkFBdEMsRUFBMkQsTUFBS0ksbUJBQWhFO0FBQ0FaLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0MscUJBQXRDLEVBQTZELE1BQUtLLGNBQWxFO0FBQ0FiLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtNLGNBQTlEO0FB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LElBQUosQ0FBU29ELEdBQWhDLEVBQXFDO0FBQ25DLGVBQUtuRSxLQUFMLENBQVdvRSxJQUFYO0FBQ0QsU0FGRCxNQUVPLElBQUksQ0FBQ3RELElBQUlDLElBQUosQ0FBU21ELEtBQWQsRUFBcUI7QUFDMUIsZUFBS2xFLEtBQUwsQ0FBV2lFLElBQVg7QUFDRDtBQUNGO0FBdFJIOztBQUFBO0FBQUEsSUFBbUN2RSxNQUFuQztBQXlSRCxDQW5TRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9yZXN1bHQvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBSZXN1bHRzTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkV4cGVyaW1lbnRMb2FkZWQnLCAnX29uTW9kZWxMb2FkZWQnLCAnX29uTW9kZWxSZXN1bHRzUmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZScsXG4gICAgICAgICdfb25FeHBlcmltZW50Q291bnRDaGFuZ2UnXSk7XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRFeHBlcmltZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IG51bGw7XG5cbiAgICAgIHRoaXMuX3ZpZXcgPSBuZXcgVmlldygpO1xuICAgICAgdGhpcy5fdmlldy5hZGRFdmVudExpc3RlbmVyKCdSZXN1bHRzVmlldy5SZXF1ZXN0TW9kZWxEYXRhJywgdGhpcy5fb25Nb2RlbFJlc3VsdHNSZXF1ZXN0KTtcblxuICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXAgPSB7fTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudC5Mb2FkZWQnLCB0aGlzLl9vbkV4cGVyaW1lbnRMb2FkZWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHRoaXMuX29uTW9kZWxMb2FkZWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXVnbGVuYU1vZGVsLmRpcmVjdE1vZGVsQ29tcGFyaXNvbicsIHRoaXMuX29uRXhwZXJpbWVudExvYWRlZCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIEhNLmhvb2soJ1BhbmVsLkNvbnRlbnRzJywgKHN1YmplY3QsIG1ldGEpID0+IHtcbiAgICAgICAgaWYgKG1ldGEuaWQgPT0gXCJyZXN1bHRcIikge1xuICAgICAgICAgIHN1YmplY3QucHVzaCh0aGlzLl92aWV3KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViamVjdDtcbiAgICAgIH0sIDEwKTtcbiAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudExvYWRlZChldnQpIHtcblxuICAgICAgaWYgKGV2dC5kYXRhLmRpcmVjdE1vZGVsQ29tcGFyaXNvbikgeyAvLyBMb2FkIGV4cGVyaW1lbnQgaW50byB0aGUgc2Vjb25kIHZpZGVvIHZpZXcgZm9yIG1vZGVsIGNvbXBhcmlzb24gd2hlbiBhY3RpdmF0ZWQgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vdmFyIHJlc3VsdHMgPSBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnRSZXN1bHRzJyk7XG4gICAgICAgIC8vdmFyIGV4cCA9IHtjb25maWd1cmF0aW9uOiBHbG9iYWxzLmdldCgnY3VycmVudExpZ2h0RGF0YScpfTtcbiAgICAgICAgLy90aGlzLl92aWV3LmhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV4cCwgcmVzdWx0cywgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQgIT0gdGhpcy5fY3VycmVudEV4cGVyaW1lbnQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudEV4cGVyaW1lbnQgPSBldnQuZGF0YS5leHBlcmltZW50LmlkO1xuXG4gICAgICAgIGlmIChldnQuZGF0YS5leHBlcmltZW50LmlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIEV1Z1V0aWxzLmdldExpdmVSZXN1bHRzKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMnLCByZXN1bHRzKTtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50TGlnaHREYXRhJyxldnQuZGF0YS5leHBlcmltZW50LmNvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV2dC5kYXRhLmV4cGVyaW1lbnQsIHJlc3VsdHMpOyAvLy8vIFRISVMgSVMgV0hFUkUgSSBDQU4gQ0hBTkdFIFRIRSBHUkFQSCBWSUVXLlxuXG4gICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykge3RoaXMuX3ZpZXcuc2hvd1ZpZGVvKHRydWUpO31cblxuICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkgeyAvLyBJbiBjYXNlIG1vZGVsIGNvbXBhcmlzb24gaXMgYWN0aXZlIGFuZCBhIG5ldyBleHAgaXMgbG9hZGVkXG4gICAgICAgICAgICAgIC8vTG9hZCB0aGUgbW9kZWxzIHRoYXQgYXJlIGluIGNhY2hlLCBvciByZS1ydW4uXG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUuZm9yRWFjaCggZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGNhY2hlXG4gICAgICAgICAgICAgICAgfSkgfSwgdGhpcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX21vZGVsQ2FjaGUgJiYgdGhpcy5fbW9kZWxDYWNoZVswXS5tb2RlbCAhPSBudWxsKSB7IC8vIElmIGEgbW9kZWwgaGFzIGJlZW4gY2FjaGVkLCBzaG93IHRoYXQgdmlkZW8gdG9vLlxuICAgICAgICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgICAgICAgZGF0YTogdGhpcy5fbW9kZWxDYWNoZVswXVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTW9kZWxMb2FkZWQoZXZ0KSB7XG4gICAgICBpZiAoIVV0aWxzLmV4aXN0cyh0aGlzLl9maXJzdE1vZGVsU2tpcFtldnQuZGF0YS50YWJJZF0pKSB7XG4gICAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwW2V2dC5kYXRhLnRhYklkXSA9IHRydWU7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5oaXN0b3J5Q291bnQoKSAhPSAwICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSA9PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykge3RoaXMuX3ZpZXcuc2hvd1ZpZGVvKGZhbHNlKTt9XG5cbiAgICAgIGlmIChldnQuZGF0YS5tb2RlbC5pZCAhPSAnX25ldycgJiYgR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykpIHtcbiAgICAgICAgaWYgKCEoZXZ0LmRhdGEudGFiSWQgPT0gdGhpcy5fY3VycmVudE1vZGVsICYmIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSAmJlxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXS5ldWdsZW5hTW9kZWxJZCA9PSBldnQuZGF0YS5tb2RlbC5pZCAmJlxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXS5leHBlcmltZW50SWQgPT0gR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQpKSB7IC8vIE90aGVyd2lzZSwgdGhlIGN1cnJlbnQgbW9kZWwgZG9lcyBub3QgaGF2ZSB0byBiZSBjaGFuZ2VkIGFueXdheXMuXG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd3ZSBhcmUgZ2V0dGluZyBpdCBub3cnKVxuICAgICAgICAgIEV1Z1V0aWxzLmdldE1vZGVsUmVzdWx0cyhHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZCwgZXZ0LmRhdGEubW9kZWwpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKGV2dC5kYXRhLm1vZGVsLCByZXN1bHRzLCBldnQuZGF0YS50YWJJZCwgR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKTsgLy8gVEhJUyBJUyBXSEVSRSBJIEhBVkUgVE8gRE8gSVQgV0lUSCBUSEUgR1JBUEggVklFV1xuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdID0geyAvLyBUaGlzIGlzIHRvIG1ha2Ugc3VyZSB0aGF0IGEgbW9kZWwgZG9lcyBub3QgZ2V0IHJlbG9hZGVkIGlmIGl0IGlzIGFscmVhZHkgXCJhY3RpdmVcIiBpbiB0aGUgY2FjaGVcbiAgICAgICAgICAgIGV1Z2xlbmFNb2RlbElkOiBldnQuZGF0YS5tb2RlbC5pZCxcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWRcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpID8gJ2JvdGgnIDogZXZ0LmRhdGEudGFiSWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FjaGVNb2RlbChldnQuZGF0YS5tb2RlbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5tb2RlbC5pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5fY2FjaGVNb2RlbChldnQuZGF0YS5tb2RlbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgPyAnYm90aCcgOiBldnQuZGF0YS50YWJJZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKGV2dC5kYXRhLm1vZGVsLCBudWxsLCBldnQuZGF0YS50YWJJZCwgR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKTtcbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfY2FjaGVNb2RlbChtb2RlbCwgdGFiSWQpIHtcbiAgICAgIGlmICghbW9kZWwuZGF0ZV9jcmVhdGVkKSB7IC8vIEluIGNhc2UgdGhlIG1vZGVsIGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldCwgY3JlYXRlIGl0IGFuZCB0aGVuIGNhY2hlIGl0LlxuICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7bW9kZWwuaWR9YCkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgbGV0IGhhc05vbmUgPSBmYWxzZTtcbiAgICAgICAgICBsZXQgbW9kZWxJbmRleCA9IHRoaXMuX21vZGVsQ2FjaGUuZmluZEluZGV4KChvLGkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoby50YWJJZCA9PT0gdGFiSWQpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGVbaV0gPSB7IHRhYklkOiB0YWJJZCwgbW9kZWw6IGRhdGF9O1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvLnRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgaGFzTm9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmICghR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpIHx8IChtb2RlbEluZGV4ID09IC0xICYmIGhhc05vbmUpKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0gW3sgdGFiSWQ6IHRhYklkLCBtb2RlbDogZGF0YSB9XVxuICAgICAgICAgIH0gZWxzZSBpZiAobW9kZWxJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZS5wdXNoKHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogZGF0YSB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgbGV0IGhhc05vbmUgPSBmYWxzZTtcbiAgICAgICAgbGV0IG1vZGVsSW5kZXggPSB0aGlzLl9tb2RlbENhY2hlLmZpbmRJbmRleCgobyxpKSA9PiB7XG4gICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICBpZiAoby50YWJJZCA9PT0gdGFiSWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlW2ldID0geyB0YWJJZDogdGFiSWQsIG1vZGVsOiBtb2RlbH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoby50YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICBoYXNOb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmICghR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpIHx8IChtb2RlbEluZGV4ID09IC0xICYmIGhhc05vbmUpKSB7XG4gICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IFt7IHRhYklkOiB0YWJJZCwgbW9kZWw6IG1vZGVsIH1dXG4gICAgICAgIH0gZWxzZSBpZiAobW9kZWxJbmRleCA9PSAtMSkge1xuICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUucHVzaCh7IHRhYklkOiB0YWJJZCwgbW9kZWw6IG1vZGVsIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbFJlc3VsdHNSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnRhYklkID09ICdub25lJykge1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKSB7IC8vIGRlbGV0ZSB0aGUgc2Vjb25kIHZpZGVvIHZpZXdcbiAgICAgICAgICBHbG9iYWxzLnNldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJyxmYWxzZSk7XG4gICAgICAgICAgdGhpcy5fdmlldy5hY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdCA9IHttb2RlbF9hOiBudWxsLCBtb2RlbF9iOiBudWxsfTtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnc2VxdWVudGlhbCcpIHsgdGhpcy5fdmlldy5zaG93VmlkZW8odHJ1ZSk7fVxuICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSBbe1xuICAgICAgICAgIHRhYklkOiAnbm9uZScsXG4gICAgICAgICAgbW9kZWw6IG51bGxcbiAgICAgICAgfV1cbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEudGFiSWQgPT0gJ2JvdGgnKSB7XG5cbiAgICAgICAgLy8xLiBkaXNwYXRjaCBldmVudCB0aGF0IHNheXMgdG8gaGlkZSByZXN1bHRzX192aXN1YWxpemF0aW9uIGFuZCBpbnN0ZWFkIGhhdmUgYSBzZWNvbmQgcmVzdWx0c19fdmlzdWFscyB2aWV3LlxuICAgICAgICBHbG9iYWxzLnNldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJyx0cnVlKTtcbiAgICAgICAgdGhpcy5fdmlldy5hY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuZGlyZWN0TW9kZWxDb21wYXJpc29uJywgeyAnZGlyZWN0TW9kZWxDb21wYXJpc29uJzogdHJ1ZSB9KTtcblxuICAgICAgICAvLyAyLiBMb2FkIGJvdGggbW9kZWxzLlxuICAgICAgICBjb25zdCBjdXJyTW9kZWxfYSA9IEdsb2JhbHMuZ2V0KCdNb2RlbFRhYi5hJykuY3Vyck1vZGVsKCk7XG4gICAgICAgIGNvbnN0IGN1cnJNb2RlbF9iID0gR2xvYmFscy5nZXQoJ01vZGVsVGFiLmInKS5jdXJyTW9kZWwoKTtcbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0ge21vZGVsX2E6IG51bGwsIG1vZGVsX2I6IG51bGx9O1xuICAgICAgICB2YXIgbW9kZWxMb2dJZHMgPSB7bW9kZWxfYTogbnVsbCwgbW9kZWxfYjogbnVsbH07XG5cbiAgICAgICAgaWYgKGN1cnJNb2RlbF9hKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWxfYSxcbiAgICAgICAgICAgICAgdGFiSWQ6ICdhJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgbW9kZWxMb2dJZHMubW9kZWxfYSA9IGN1cnJNb2RlbF9hLmlkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsICdhJywgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0Lm1vZGVsX2EgPSBudWxsO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykhPSdjcmVhdGUnKSB7IEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsLkF1dG9tYXRpY1NpbXVsYXRlJyx7dGFiSWQ6ICdhJ30pOyB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3Vyck1vZGVsX2IpIHtcbiAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWw6IGN1cnJNb2RlbF9iLFxuICAgICAgICAgICAgICB0YWJJZDogJ2InXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBtb2RlbExvZ0lkcy5tb2RlbF9iID0gY3Vyck1vZGVsX2IuaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgJ2InLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQubW9kZWxfYiA9IG51bGw7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSE9J2NyZWF0ZScpIHsgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWwuQXV0b21hdGljU2ltdWxhdGUnLHt0YWJJZDogJ2InfSk7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWQsXG4gICAgICAgICAgICBtb2RlbElkOiBtb2RlbExvZ0lkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgfSBlbHNlIHsgLy8gb25seSBvbmUgbW9kZWwgYWN0aXZlXG5cbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkgeyAvLyBkZWxldGUgdGhlIHNlY29uZCB2aWRlbyB2aWV3XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicsZmFsc2UpO1xuICAgICAgICAgIHRoaXMuX3ZpZXcuYWN0aXZhdGVNb2RlbENvbXBhcmlzb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN1cnJNb2RlbCA9IEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke2V2dC5kYXRhLnRhYklkfWApLmN1cnJNb2RlbCgpO1xuXG4gICAgICAgIGlmIChjdXJyTW9kZWwpIHtcbiAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWw6IGN1cnJNb2RlbCxcbiAgICAgICAgICAgICAgdGFiSWQ6IGV2dC5kYXRhLnRhYklkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWQsXG4gICAgICAgICAgICAgIG1vZGVsSWQ6IGN1cnJNb2RlbC5pZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdFtgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXSA9IG51bGw7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgICByZXN1bHRJZDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSE9J2NyZWF0ZScpIHsgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWwuQXV0b21hdGljU2ltdWxhdGUnLHt0YWJJZDogZXZ0LmRhdGEudGFiSWR9KTsgfVxuICAgICAgICB9XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0ludGVyYWN0aXZlVGFicy5UYWJSZXF1ZXN0Jywge1xuICAgICAgICAgIHRhYklkOiBgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5fdmlldy5yZXNldCgpO1xuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcbiAgICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXAgPSB7fTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50Q291bnRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuY291bnQgJiYgIWV2dC5kYXRhLm9sZCkge1xuICAgICAgICB0aGlzLl92aWV3LnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAoIWV2dC5kYXRhLmNvdW50KSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59KVxuIl19
