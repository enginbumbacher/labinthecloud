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

        if (evt.data.directModelComparison) {
          // Triggered by the activation of model comparison
          var results = Globals.get('currentExperimentResults');
          var exp = { configuration: Globals.get('currentLightData') };
          this._view.handleExperimentResults(exp, results, true);
        } else if (evt.data.experiment.id != this._currentExperiment) {
          this._currentExperiment = evt.data.experiment.id;

          if (evt.data.experiment.id != '_new') {
            EugUtils.getLiveResults(evt.data.experiment.id).then(function (results) {
              Globals.set('currentExperimentResults', results);
              Globals.set('currentLightData', evt.data.experiment.configuration);
              _this3._view.handleExperimentResults(evt.data.experiment, results); //// THIS IS WHERE I CAN CHANGE THE GRAPH VIEW.

              if (Globals.get('directModelComparison')) {
                // In case model comparison is active and a new exp is loaded
                _this3._view.handleExperimentResults(evt.data.experiment, results, true);
              }

              if (_this3._modelCache && _this3._modelCache.model != null) {
                if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {
                  _this3._view.showVideo(true);
                }
                _this3._onModelLoaded({
                  data: _this3._modelCache
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
          if (Globals.get('ModelTab.' + evt.data.tabId).historyCount() != 0 && Globals.get('AppConfig.system.modelModality') == "create") {
            //THIS IS WHERE THE CRUX IS. WHAT IS THAT?
            return;
          }
        }
        if (Globals.get('AppConfig.system.expModelModality') == 'sequential') {
          this._view.showVideo(false);
        }

        if (evt.data.model.id != '_new' && Globals.get('currentExperiment')) {
          if (!(this._lastModelResult && this._lastModelResult.euglenaModelId == evt.data.model.id && this._lastModelResult.experimentId == Globals.get('currentExperiment').id)) {
            EugUtils.getModelResults(Globals.get('currentExperiment').id, evt.data.model).then(function (results) {
              _this4._view.handleModelResults(evt.data.model, results, evt.data.tabId); // THIS IS WHERE I HAVE TO DO IT WITH THE GRAPH VIEW
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
      key: '_onModelResultsRequest',
      value: function _onModelResultsRequest(evt) {
        if (evt.data.tabId == 'none') {
          if (Globals.get('directModelComparison')) {
            Globals.set('directModelComparison', false);
            this._view.activateModelComparison();
          }
          this._lastModelResult = null;
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
          this._modelCache = {
            tabId: 'none',
            model: null
          };
        } else if (evt.data.tabId == 'both') {
          console.log('ok, we have step 1. Good luck with the rest.');

          //1. dispatch event that says to hide results__visualization and instead have a second results__visuals view.
          Globals.set('directModelComparison', true);
          this._view.activateModelComparison();
          Globals.get('Relay').dispatchEvent('EuglenaModel.directModelComparison', { 'directModelComparison': true });
        } else {

          if (Globals.get('directModelComparison')) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImRpcmVjdE1vZGVsQ29tcGFyaXNvbiIsInJlc3VsdHMiLCJleHAiLCJjb25maWd1cmF0aW9uIiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJleHBlcmltZW50IiwiZ2V0TGl2ZVJlc3VsdHMiLCJ0aGVuIiwic2V0IiwiX21vZGVsQ2FjaGUiLCJtb2RlbCIsInNob3dWaWRlbyIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImNsZWFyIiwiZXhpc3RzIiwidGFiSWQiLCJoaXN0b3J5Q291bnQiLCJfbGFzdE1vZGVsUmVzdWx0IiwiZXVnbGVuYU1vZGVsSWQiLCJleHBlcmltZW50SWQiLCJnZXRNb2RlbFJlc3VsdHMiLCJoYW5kbGVNb2RlbFJlc3VsdHMiLCJfY2FjaGVNb2RlbCIsImRhdGVfY3JlYXRlZCIsInByb21pc2VBamF4IiwiYWN0aXZhdGVNb2RlbENvbXBhcmlzb24iLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJkaXNwYXRjaEV2ZW50IiwiY3Vyck1vZGVsIiwibW9kZWxJZCIsInJlc3VsdElkIiwicGhhc2UiLCJyZXNldCIsImhpZGUiLCJjb3VudCIsIm9sZCIsInNob3ci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O0FBQ3BFLGVBQUtwRCxLQUFMLENBQVdxRCxLQUFYO0FBQ0EsZUFBS3JELEtBQUwsQ0FBV3NELElBQVg7QUFDQSxlQUFLbkQsZUFBTCxHQUF1QixFQUF2QjtBQUNEO0FBQ0Y7QUEzTEg7QUFBQTtBQUFBLCtDQTZMMkJXLEdBN0wzQixFQTZMZ0M7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTd0MsS0FBVCxJQUFrQixDQUFDekMsSUFBSUMsSUFBSixDQUFTeUMsR0FBaEMsRUFBcUM7QUFDbkMsZUFBS3hELEtBQUwsQ0FBV3lELElBQVg7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDM0MsSUFBSUMsSUFBSixDQUFTd0MsS0FBZCxFQUFxQjtBQUMxQixlQUFLdkQsS0FBTCxDQUFXc0QsSUFBWDtBQUNEO0FBQ0Y7QUFuTUg7O0FBQUE7QUFBQSxJQUFtQzVELE1BQW5DO0FBc01ELENBaE5EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRXhwZXJpbWVudExvYWRlZCcsICdfb25Nb2RlbExvYWRlZCcsICdfb25Nb2RlbFJlc3VsdHNSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJyxcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fY3VycmVudEV4cGVyaW1lbnQgPSBudWxsO1xuICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcblxuICAgICAgdGhpcy5fdmlldyA9IG5ldyBWaWV3KCk7XG4gICAgICB0aGlzLl92aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB0aGlzLl9vbk1vZGVsUmVzdWx0c1JlcXVlc3QpO1xuXG4gICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcCA9IHt9O1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkxvYWRlZCcsIHRoaXMuX29uRXhwZXJpbWVudExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuTG9hZGVkJywgdGhpcy5fb25Nb2RlbExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuZGlyZWN0TW9kZWxDb21wYXJpc29uJywgdGhpcy5fb25FeHBlcmltZW50TG9hZGVkKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgSE0uaG9vaygnUGFuZWwuQ29udGVudHMnLCAoc3ViamVjdCwgbWV0YSkgPT4ge1xuICAgICAgICBpZiAobWV0YS5pZCA9PSBcInJlc3VsdFwiKSB7XG4gICAgICAgICAgc3ViamVjdC5wdXNoKHRoaXMuX3ZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgICAgfSwgMTApO1xuICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50TG9hZGVkKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmRpcmVjdE1vZGVsQ29tcGFyaXNvbikgeyAvLyBUcmlnZ2VyZWQgYnkgdGhlIGFjdGl2YXRpb24gb2YgbW9kZWwgY29tcGFyaXNvblxuICAgICAgICB2YXIgcmVzdWx0cyA9IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMnKTtcbiAgICAgICAgdmFyIGV4cCA9IHtjb25maWd1cmF0aW9uOiBHbG9iYWxzLmdldCgnY3VycmVudExpZ2h0RGF0YScpfTtcbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVFeHBlcmltZW50UmVzdWx0cyhleHAsIHJlc3VsdHMsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5leHBlcmltZW50LmlkICE9IHRoaXMuX2N1cnJlbnRFeHBlcmltZW50KSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRFeHBlcmltZW50ID0gZXZ0LmRhdGEuZXhwZXJpbWVudC5pZDtcblxuICAgICAgICBpZiAoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCAhPSAnX25ldycpIHtcbiAgICAgICAgICBFdWdVdGlscy5nZXRMaXZlUmVzdWx0cyhldnQuZGF0YS5leHBlcmltZW50LmlkKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudEV4cGVyaW1lbnRSZXN1bHRzJywgcmVzdWx0cyk7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudExpZ2h0RGF0YScsZXZ0LmRhdGEuZXhwZXJpbWVudC5jb25maWd1cmF0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMoZXZ0LmRhdGEuZXhwZXJpbWVudCwgcmVzdWx0cyk7IC8vLy8gVEhJUyBJUyBXSEVSRSBJIENBTiBDSEFOR0UgVEhFIEdSQVBIIFZJRVcuXG5cbiAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHsgLy8gSW4gY2FzZSBtb2RlbCBjb21wYXJpc29uIGlzIGFjdGl2ZSBhbmQgYSBuZXcgZXhwIGlzIGxvYWRlZFxuICAgICAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV2dC5kYXRhLmV4cGVyaW1lbnQsIHJlc3VsdHMsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWxDYWNoZSAmJiB0aGlzLl9tb2RlbENhY2hlLm1vZGVsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnc2VxdWVudGlhbCcpIHt0aGlzLl92aWV3LnNob3dWaWRlbyh0cnVlKTt9XG4gICAgICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuX21vZGVsQ2FjaGVcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdmlldy5jbGVhcigpO1xuICAgICAgICB9XG5cblxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTW9kZWxMb2FkZWQoZXZ0KSB7XG4gICAgICBpZiAoIVV0aWxzLmV4aXN0cyh0aGlzLl9maXJzdE1vZGVsU2tpcFtldnQuZGF0YS50YWJJZF0pKSB7XG4gICAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwW2V2dC5kYXRhLnRhYklkXSA9IHRydWU7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5oaXN0b3J5Q291bnQoKSAhPSAwICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSA9PSBcImNyZWF0ZVwiKSB7IC8vVEhJUyBJUyBXSEVSRSBUSEUgQ1JVWCBJUy4gV0hBVCBJUyBUSEFUP1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnc2VxdWVudGlhbCcpIHt0aGlzLl92aWV3LnNob3dWaWRlbyhmYWxzZSk7fVxuXG4gICAgICBpZiAoZXZ0LmRhdGEubW9kZWwuaWQgIT0gJ19uZXcnICYmIEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpKSB7XG4gICAgICAgIGlmICghKHRoaXMuX2xhc3RNb2RlbFJlc3VsdCAmJiB0aGlzLl9sYXN0TW9kZWxSZXN1bHQuZXVnbGVuYU1vZGVsSWQgPT0gZXZ0LmRhdGEubW9kZWwuaWQgJiYgdGhpcy5fbGFzdE1vZGVsUmVzdWx0LmV4cGVyaW1lbnRJZCA9PSBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZCkpIHtcbiAgICAgICAgICBFdWdVdGlscy5nZXRNb2RlbFJlc3VsdHMoR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQsIGV2dC5kYXRhLm1vZGVsKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhldnQuZGF0YS5tb2RlbCwgcmVzdWx0cywgZXZ0LmRhdGEudGFiSWQpOyAvLyBUSElTIElTIFdIRVJFIEkgSEFWRSBUTyBETyBJVCBXSVRIIFRIRSBHUkFQSCBWSUVXXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSB7XG4gICAgICAgICAgICBldWdsZW5hTW9kZWxJZDogZXZ0LmRhdGEubW9kZWwuaWQsXG4gICAgICAgICAgICBleHBlcmltZW50SWQ6IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhY2hlTW9kZWwoZXZ0LmRhdGEubW9kZWwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEubW9kZWwuaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlTW9kZWwoZXZ0LmRhdGEubW9kZWwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKGV2dC5kYXRhLm1vZGVsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2NhY2hlTW9kZWwobW9kZWwsIHRhYklkKSB7XG4gICAgICBpZiAoIW1vZGVsLmRhdGVfY3JlYXRlZCkge1xuICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7bW9kZWwuaWR9YCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSB7XG4gICAgICAgICAgICBtb2RlbDogZGF0YSxcbiAgICAgICAgICAgIHRhYklkOiB0YWJJZFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSB7XG4gICAgICAgICAgbW9kZWw6IG1vZGVsLFxuICAgICAgICAgIHRhYklkOiB0YWJJZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTW9kZWxSZXN1bHRzUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS50YWJJZCA9PSAnbm9uZScpIHtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nKSkge1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLGZhbHNlKTtcbiAgICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0gbnVsbDtcbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKSA9PSAnc2VxdWVudGlhbCcpIHsgdGhpcy5fdmlldy5zaG93VmlkZW8odHJ1ZSk7fVxuICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSB7XG4gICAgICAgICAgdGFiSWQ6ICdub25lJyxcbiAgICAgICAgICBtb2RlbDogbnVsbFxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnRhYklkID09ICdib3RoJykge1xuICAgICAgICBjb25zb2xlLmxvZygnb2ssIHdlIGhhdmUgc3RlcCAxLiBHb29kIGx1Y2sgd2l0aCB0aGUgcmVzdC4nKTtcblxuICAgICAgICAvLzEuIGRpc3BhdGNoIGV2ZW50IHRoYXQgc2F5cyB0byBoaWRlIHJlc3VsdHNfX3Zpc3VhbGl6YXRpb24gYW5kIGluc3RlYWQgaGF2ZSBhIHNlY29uZCByZXN1bHRzX192aXN1YWxzIHZpZXcuXG4gICAgICAgIEdsb2JhbHMuc2V0KCdkaXJlY3RNb2RlbENvbXBhcmlzb24nLHRydWUpO1xuICAgICAgICB0aGlzLl92aWV3LmFjdGl2YXRlTW9kZWxDb21wYXJpc29uKCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5kaXJlY3RNb2RlbENvbXBhcmlzb24nLCB7ICdkaXJlY3RNb2RlbENvbXBhcmlzb24nOiB0cnVlIH0pO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJykpIHtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnZGlyZWN0TW9kZWxDb21wYXJpc29uJyxmYWxzZSk7XG4gICAgICAgICAgdGhpcy5fdmlldy5hY3RpdmF0ZU1vZGVsQ29tcGFyaXNvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3Vyck1vZGVsID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7ZXZ0LmRhdGEudGFiSWR9YCkuY3Vyck1vZGVsKCk7XG5cbiAgICAgICAgaWYgKGN1cnJNb2RlbCkge1xuICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbDogY3Vyck1vZGVsLFxuICAgICAgICAgICAgICB0YWJJZDogZXZ0LmRhdGEudGFiSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgbW9kZWxJZDogY3Vyck1vZGVsLmlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWQsXG4gICAgICAgICAgICAgIHJlc3VsdElkOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdJbnRlcmFjdGl2ZVRhYnMuVGFiUmVxdWVzdCcsIHtcbiAgICAgICAgICB0YWJJZDogYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX3ZpZXcucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fdmlldy5oaWRlKCk7XG4gICAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwID0ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy5fdmlldy5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufSlcbiJdfQ==
