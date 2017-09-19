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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImRpcmVjdE1vZGVsQ29tcGFyaXNvbiIsImV4cGVyaW1lbnQiLCJnZXRMaXZlUmVzdWx0cyIsInRoZW4iLCJyZXN1bHRzIiwic2V0IiwiY29uZmlndXJhdGlvbiIsImhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzIiwic2hvd1ZpZGVvIiwiX21vZGVsQ2FjaGUiLCJmb3JFYWNoIiwiY2FjaGUiLCJtb2RlbCIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImNsZWFyIiwiZXhpc3RzIiwidGFiSWQiLCJoaXN0b3J5Q291bnQiLCJfbGFzdE1vZGVsUmVzdWx0IiwiZXVnbGVuYU1vZGVsSWQiLCJleHBlcmltZW50SWQiLCJoYW5kbGVNb2RlbFJlc3VsdHMiLCJnZXRNb2RlbFJlc3VsdHMiLCJfY2FjaGVNb2RlbCIsImRhdGVfY3JlYXRlZCIsInByb21pc2VBamF4IiwiaGFzTm9uZSIsIm1vZGVsSW5kZXgiLCJmaW5kSW5kZXgiLCJvIiwiaSIsImFjdGl2YXRlTW9kZWxDb21wYXJpc29uIiwibW9kZWxfYSIsIm1vZGVsX2IiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJkaXNwYXRjaEV2ZW50IiwiY3Vyck1vZGVsX2EiLCJjdXJyTW9kZWwiLCJjdXJyTW9kZWxfYiIsIm1vZGVsTG9nSWRzIiwibW9kZWxJZCIsInJlc3VsdElkIiwicGhhc2UiLCJyZXNldCIsImhpZGUiLCJjb3VudCIsIm9sZCIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxRQUFRLHlCQUFSLENBQVg7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssT0FBT0wsUUFBUSxRQUFSLENBRFQ7QUFBQSxNQUVFTSxXQUFXTixRQUFRLGVBQVIsQ0FGYjs7QUFLQTtBQUFBOztBQUNFLDZCQUFjO0FBQUE7O0FBQUE7O0FBRVpFLFlBQU1LLFdBQU4sUUFBd0IsQ0FBQyxxQkFBRCxFQUF3QixnQkFBeEIsRUFBMEMsd0JBQTFDLEVBQW9FLGdCQUFwRSxFQUN0QiwwQkFEc0IsQ0FBeEI7O0FBR0EsWUFBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFDQSxZQUFLQyxhQUFMLEdBQXFCLElBQXJCOztBQUVBLFlBQUtDLEtBQUwsR0FBYSxJQUFJTCxJQUFKLEVBQWI7QUFDQSxZQUFLSyxLQUFMLENBQVdDLGdCQUFYLENBQTRCLDhCQUE1QixFQUE0RCxNQUFLQyxzQkFBakU7O0FBRUEsWUFBS0MsZUFBTCxHQUF1QixFQUF2Qjs7QUFFQVYsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxtQkFBdEMsRUFBMkQsTUFBS0ksbUJBQWhFO0FBQ0FaLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0MscUJBQXRDLEVBQTZELE1BQUtLLGNBQWxFO0FBQ0FiLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtNLGNBQTlEO0FB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Qm9ELGFBQXJCLENBQW1DLDRCQUFuQyxFQUFpRTtBQUMvRHJCLDhCQUFnQnJCLElBQUlDLElBQUosQ0FBU29CO0FBRHNDLFdBQWpFO0FBR0Q7QUFDRjtBQWxRSDtBQUFBO0FBQUEscUNBb1FpQnJCLEdBcFFqQixFQW9Rc0I7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTZ0QsS0FBVCxJQUFrQixPQUFsQixJQUE2QmpELElBQUlDLElBQUosQ0FBU2dELEtBQVQsSUFBa0IsaUJBQW5ELEVBQXNFO0FBQ3BFLGVBQUsvRCxLQUFMLENBQVdnRSxLQUFYO0FBQ0EsZUFBS2hFLEtBQUwsQ0FBV2lFLElBQVg7QUFDQSxlQUFLOUQsZUFBTCxHQUF1QixFQUF2QjtBQUNEO0FBQ0Y7QUExUUg7QUFBQTtBQUFBLCtDQTRRMkJXLEdBNVEzQixFQTRRZ0M7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTbUQsS0FBVCxJQUFrQixDQUFDcEQsSUFBSUMsSUFBSixDQUFTb0QsR0FBaEMsRUFBcUM7QUFDbkMsZUFBS25FLEtBQUwsQ0FBV29FLElBQVg7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDdEQsSUFBSUMsSUFBSixDQUFTbUQsS0FBZCxFQUFxQjtBQUMxQixlQUFLbEUsS0FBTCxDQUFXaUUsSUFBWDtBQUNEO0FBQ0Y7QUFsUkg7O0FBQUE7QUFBQSxJQUFtQ3ZFLE1BQW5DO0FBcVJELENBL1JEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRXhwZXJpbWVudExvYWRlZCcsICdfb25Nb2RlbExvYWRlZCcsICdfb25Nb2RlbFJlc3VsdHNSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJyxcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fY3VycmVudEV4cGVyaW1lbnQgPSBudWxsO1xuICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcblxuICAgICAgdGhpcy5fdmlldyA9IG5ldyBWaWV3KCk7XG4gICAgICB0aGlzLl92aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB0aGlzLl9vbk1vZGVsUmVzdWx0c1JlcXVlc3QpO1xuXG4gICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcCA9IHt9O1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkxvYWRlZCcsIHRoaXMuX29uRXhwZXJpbWVudExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuTG9hZGVkJywgdGhpcy5fb25Nb2RlbExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuZGlyZWN0TW9kZWxDb21wYXJpc29uJywgdGhpcy5fb25FeHBlcmltZW50TG9hZGVkKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgSE0uaG9vaygnUGFuZWwuQ29udGVudHMnLCAoc3ViamVjdCwgbWV0YSkgPT4ge1xuICAgICAgICBpZiAobWV0YS5pZCA9PSBcInJlc3VsdFwiKSB7XG4gICAgICAgICAgc3ViamVjdC5wdXNoKHRoaXMuX3ZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgICAgfSwgMTApO1xuICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50TG9hZGVkKGV2dCkge1xuXG4gICAgICBpZiAoZXZ0LmRhdGEuZGlyZWN0TW9kZWxDb21wYXJpc29uKSB7IC8vIExvYWQgZXhwZXJpbWVudCBpbnRvIHRoZSBzZWNvbmQgdmlkZW8gdmlldyBmb3IgbW9kZWwgY29tcGFyaXNvbiB3aGVuIGFjdGl2YXRlZCBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy92YXIgcmVzdWx0cyA9IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMnKTtcbiAgICAgICAgLy92YXIgZXhwID0ge2NvbmZpZ3VyYXRpb246IEdsb2JhbHMuZ2V0KCdjdXJyZW50TGlnaHREYXRhJyl9O1xuICAgICAgICAvL3RoaXMuX3ZpZXcuaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMoZXhwLCByZXN1bHRzLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCAhPSB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCA9IGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQ7XG5cbiAgICAgICAgaWYgKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TGl2ZVJlc3VsdHMoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRFeHBlcmltZW50UmVzdWx0cycsIHJlc3VsdHMpO1xuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRMaWdodERhdGEnLGV2dC5kYXRhLmV4cGVyaW1lbnQuY29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMoZXZ0LmRhdGEuZXhwZXJpbWVudCwgcmVzdWx0cyk7IC8vLy8gVEhJUyBJUyBXSEVSRSBJIENBTiBDSEFOR0UgVEhFIEdSQVBIIFZJRVcuXG5cbiAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7dGhpcy5fdmlldy5zaG93VmlkZW8odHJ1ZSk7fVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ2RpcmVjdE1vZGVsQ29tcGFyaXNvbicpKSB7IC8vIEluIGNhc2UgbW9kZWwgY29tcGFyaXNvbiBpcyBhY3RpdmUgYW5kIGEgbmV3IGV4cCBpcyBsb2FkZWRcbiAgICAgICAgICAgICAgLy9Mb2FkIHRoZSBtb2RlbHMgdGhhdCBhcmUgaW4gY2FjaGUsIG9yIHJlLXJ1bi5cbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZS5mb3JFYWNoKCBmdW5jdGlvbihjYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgICAgICAgZGF0YTogY2FjaGVcbiAgICAgICAgICAgICAgICB9KSB9LCB0aGlzKVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5fbW9kZWxDYWNoZSAmJiB0aGlzLl9tb2RlbENhY2hlWzBdLm1vZGVsICE9IG51bGwpIHsgLy8gSWYgYSBtb2RlbCBoYXMgYmVlbiBjYWNoZWQsIHNob3cgdGhhdCB2aWRlbyB0b28uXG4gICAgICAgICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLl9tb2RlbENhY2hlWzBdXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbExvYWRlZChldnQpIHtcbiAgICAgIGlmICghVXRpbHMuZXhpc3RzKHRoaXMuX2ZpcnN0TW9kZWxTa2lwW2V2dC5kYXRhLnRhYklkXSkpIHtcbiAgICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXBbZXZ0LmRhdGEudGFiSWRdID0gdHJ1ZTtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KGBNb2RlbFRhYi4ke2V2dC5kYXRhLnRhYklkfWApLmhpc3RvcnlDb3VudCgpICE9IDAgJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpID09IFwiY3JlYXRlXCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7dGhpcy5fdmlldy5zaG93VmlkZW8oZmFsc2UpO31cblxuICAgICAgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3JyAmJiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKSkge1xuICAgICAgICBpZiAoIShldnQuZGF0YS50YWJJZCA9PSB0aGlzLl9jdXJyZW50TW9kZWwgJiYgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdICYmXG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdLmV1Z2xlbmFNb2RlbElkID09IGV2dC5kYXRhLm1vZGVsLmlkICYmXG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0W2Btb2RlbF8ke2V2dC5kYXRhLnRhYklkfWBdLmV4cGVyaW1lbnRJZCA9PSBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZCkpIHsgLy8gT3RoZXJ3aXNlLCB0aGUgY3VycmVudCBtb2RlbCBkb2VzIG5vdCBoYXZlIHRvIGJlIGNoYW5nZWQgYW55d2F5cy5cbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhldnQuZGF0YS5tb2RlbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQsIEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSk7XG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkLCBldnQuZGF0YS5tb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIHJlc3VsdHMsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpOyAvLyBUSElTIElTIFdIRVJFIEkgSEFWRSBUTyBETyBJVCBXSVRIIFRIRSBHUkFQSCBWSUVXXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSB7IC8vIFRoaXMgaXMgdG8gbWFrZSBzdXJlIHRoYXQgYSBtb2RlbCBkb2VzIG5vdCBnZXQgcmVsb2FkZWQgaWYgaXQgaXMgYWxyZWFkeSBcImFjdGl2ZVwiIGluIHRoZSBjYWNoZVxuICAgICAgICAgICAgZXVnbGVuYU1vZGVsSWQ6IGV2dC5kYXRhLm1vZGVsLmlkLFxuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZFxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgPyAnYm90aCcgOiBldnQuZGF0YS50YWJJZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSA/ICdib3RoJyA6IGV2dC5kYXRhLnRhYklkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkLCBHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpO1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9jYWNoZU1vZGVsKG1vZGVsLCB0YWJJZCkge1xuICAgICAgaWYgKCFtb2RlbC5kYXRlX2NyZWF0ZWQpIHsgLy8gSW4gY2FzZSB0aGUgbW9kZWwgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0LCBjcmVhdGUgaXQgYW5kIHRoZW4gY2FjaGUgaXQuXG4gICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHttb2RlbC5pZH1gKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBsZXQgaGFzTm9uZSA9IGZhbHNlO1xuICAgICAgICAgIGxldCBtb2RlbEluZGV4ID0gdGhpcy5fbW9kZWxDYWNoZS5maW5kSW5kZXgoKG8saSkgPT4ge1xuICAgICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgIGlmIChvLnRhYklkID09PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZVtpXSA9IHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogZGF0YX07XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG8udGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgICBoYXNOb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgfHwgKG1vZGVsSW5kZXggPT0gLTEgJiYgaGFzTm9uZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSBbeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhIH1dXG4gICAgICAgICAgfSBlbHNlIGlmIChtb2RlbEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlLnB1c2goeyB0YWJJZDogdGFiSWQsIG1vZGVsOiBkYXRhIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBsZXQgaGFzTm9uZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbW9kZWxJbmRleCA9IHRoaXMuX21vZGVsQ2FjaGUuZmluZEluZGV4KChvLGkpID0+IHtcbiAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgIGlmIChvLnRhYklkID09PSB0YWJJZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGVbaV0gPSB7IHRhYklkOiB0YWJJZCwgbW9kZWw6IG1vZGVsfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChvLnRhYklkID09ICdub25lJykge1xuICAgICAgICAgICAgICAgIGhhc05vbmUgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykgfHwgKG1vZGVsSW5kZXggPT0gLTEgJiYgaGFzTm9uZSkpIHtcbiAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0gW3sgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWwgfV1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlbEluZGV4ID09IC0xKSB7XG4gICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZS5wdXNoKHsgdGFiSWQ6IHRhYklkLCBtb2RlbDogbW9kZWwgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbk1vZGVsUmVzdWx0c1JlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEudGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gZGVsZXRlIHRoZSBzZWNvbmQgdmlkZW8gdmlld1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0ge21vZGVsX2E6IG51bGwsIG1vZGVsX2I6IG51bGx9O1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpID09ICdzZXF1ZW50aWFsJykgeyB0aGlzLl92aWV3LnNob3dWaWRlbyh0cnVlKTt9XG4gICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IFt7XG4gICAgICAgICAgdGFiSWQ6ICdub25lJyxcbiAgICAgICAgICBtb2RlbDogbnVsbFxuICAgICAgICB9XVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS50YWJJZCA9PSAnYm90aCcpIHtcblxuICAgICAgICAvLzEuIGRpc3BhdGNoIGV2ZW50IHRoYXQgc2F5cyB0byBoaWRlIHJlc3VsdHNfX3Zpc3VhbGl6YXRpb24gYW5kIGluc3RlYWQgaGF2ZSBhIHNlY29uZCByZXN1bHRzX192aXN1YWxzIHZpZXcuXG4gICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLHRydWUpO1xuICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5kaXJlY3RNb2RlbENvbXBhcmlzb24nLCB7ICdkaXJlY3RNb2RlbENvbXBhcmlzb24nOiB0cnVlIH0pO1xuXG4gICAgICAgIC8vIDIuIExvYWQgYm90aCBtb2RlbHMuXG4gICAgICAgIGNvbnN0IGN1cnJNb2RlbF9hID0gR2xvYmFscy5nZXQoJ01vZGVsVGFiLmEnKS5jdXJyTW9kZWwoKTtcbiAgICAgICAgY29uc3QgY3Vyck1vZGVsX2IgPSBHbG9iYWxzLmdldCgnTW9kZWxUYWIuYicpLmN1cnJNb2RlbCgpO1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSB7bW9kZWxfYTogbnVsbCwgbW9kZWxfYjogbnVsbH07XG4gICAgICAgIHZhciBtb2RlbExvZ0lkcyA9IHttb2RlbF9hOiBudWxsLCBtb2RlbF9iOiBudWxsfTtcblxuICAgICAgICBpZiAoY3Vyck1vZGVsX2EpIHtcbiAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWw6IGN1cnJNb2RlbF9hLFxuICAgICAgICAgICAgICB0YWJJZDogJ2EnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBtb2RlbExvZ0lkcy5tb2RlbF9hID0gY3Vyck1vZGVsX2EuaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgJ2EnLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQubW9kZWxfYSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3Vyck1vZGVsX2IpIHtcbiAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWw6IGN1cnJNb2RlbF9iLFxuICAgICAgICAgICAgICB0YWJJZDogJ2InXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBtb2RlbExvZ0lkcy5tb2RlbF9iID0gY3Vyck1vZGVsX2IuaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgJ2InLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQubW9kZWxfYiA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgbW9kZWxJZDogbW9kZWxMb2dJZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgIH0gZWxzZSB7IC8vIG9ubHkgb25lIG1vZGVsIGFjdGl2ZVxuXG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gZGVsZXRlIHRoZSBzZWNvbmQgdmlkZW8gdmlld1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyTW9kZWwgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5jdXJyTW9kZWwoKTtcblxuICAgICAgICBpZiAoY3Vyck1vZGVsKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWwsXG4gICAgICAgICAgICAgIHRhYklkOiBldnQuZGF0YS50YWJJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgICBtb2RlbElkOiBjdXJyTW9kZWwuaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHRbYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YF0gPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgcmVzdWx0SWQ6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0ludGVyYWN0aXZlVGFicy5UYWJSZXF1ZXN0Jywge1xuICAgICAgICAgIHRhYklkOiBgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5fdmlldy5yZXNldCgpO1xuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcbiAgICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXAgPSB7fTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50Q291bnRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuY291bnQgJiYgIWV2dC5kYXRhLm9sZCkge1xuICAgICAgICB0aGlzLl92aWV3LnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAoIWV2dC5kYXRhLmNvdW50KSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59KVxuIl19
