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
              _this3._view.handleExperimentResults(evt.data.experiment, results); //// THIS IS WHERE I CAN CHANGE THE GRAPH VIEW.
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
        } else {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJnZXRMaXZlUmVzdWx0cyIsInRoZW4iLCJyZXN1bHRzIiwic2V0IiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJfbW9kZWxDYWNoZSIsIm1vZGVsIiwic2hvd1ZpZGVvIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJleGlzdHMiLCJ0YWJJZCIsImhpc3RvcnlDb3VudCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImdldE1vZGVsUmVzdWx0cyIsImhhbmRsZU1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJjdXJyTW9kZWwiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJkaXNwYXRjaEV2ZW50IiwicGhhc2UiLCJyZXNldCIsImhpZGUiLCJjb3VudCIsIm9sZCIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxR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QUFoQyxFQUFxQztBQUNuQyxlQUFLcEQsS0FBTCxDQUFXcUQsSUFBWDtBQUNELFNBRkQsTUFFTyxJQUFJLENBQUN2QyxJQUFJQyxJQUFKLENBQVNvQyxLQUFkLEVBQXFCO0FBQzFCLGVBQUtuRCxLQUFMLENBQVdrRCxJQUFYO0FBQ0Q7QUFDRjtBQW5LSDs7QUFBQTtBQUFBLElBQW1DeEQsTUFBbkM7QUFzS0QsQ0FoTEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvcmVzdWx0L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0c01vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25FeHBlcmltZW50TG9hZGVkJywgJ19vbk1vZGVsTG9hZGVkJywgJ19vbk1vZGVsUmVzdWx0c1JlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgICAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCA9IG51bGw7XG4gICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuXG4gICAgICB0aGlzLl92aWV3ID0gbmV3IFZpZXcoKTtcbiAgICAgIHRoaXMuX3ZpZXcuYWRkRXZlbnRMaXN0ZW5lcignUmVzdWx0c1ZpZXcuUmVxdWVzdE1vZGVsRGF0YScsIHRoaXMuX29uTW9kZWxSZXN1bHRzUmVxdWVzdCk7XG5cbiAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwID0ge307XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTG9hZGVkJywgdGhpcy5fb25FeHBlcmltZW50TG9hZGVkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB0aGlzLl9vbk1vZGVsTG9hZGVkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIEhNLmhvb2soJ1BhbmVsLkNvbnRlbnRzJywgKHN1YmplY3QsIG1ldGEpID0+IHtcbiAgICAgICAgaWYgKG1ldGEuaWQgPT0gXCJyZXN1bHRcIikge1xuICAgICAgICAgIHN1YmplY3QucHVzaCh0aGlzLl92aWV3KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViamVjdDtcbiAgICAgIH0sIDEwKTtcbiAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudExvYWRlZChldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5leHBlcmltZW50LmlkICE9IHRoaXMuX2N1cnJlbnRFeHBlcmltZW50KSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRFeHBlcmltZW50ID0gZXZ0LmRhdGEuZXhwZXJpbWVudC5pZDtcblxuICAgICAgICBpZiAoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCAhPSAnX25ldycpIHtcbiAgICAgICAgICBFdWdVdGlscy5nZXRMaXZlUmVzdWx0cyhldnQuZGF0YS5leHBlcmltZW50LmlkKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBHbG9iYWxzLnNldCgnY3VycmVudEV4cGVyaW1lbnRSZXN1bHRzJywgcmVzdWx0cyk7XG4gICAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZUV4cGVyaW1lbnRSZXN1bHRzKGV2dC5kYXRhLmV4cGVyaW1lbnQsIHJlc3VsdHMpOyAvLy8vIFRISVMgSVMgV0hFUkUgSSBDQU4gQ0hBTkdFIFRIRSBHUkFQSCBWSUVXLlxuICAgICAgICAgICAgaWYgKHRoaXMuX21vZGVsQ2FjaGUgJiYgdGhpcy5fbW9kZWxDYWNoZS5tb2RlbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7dGhpcy5fdmlldy5zaG93VmlkZW8odHJ1ZSk7fVxuICAgICAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLl9tb2RlbENhY2hlXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbk1vZGVsTG9hZGVkKGV2dCkge1xuICAgICAgaWYgKCFVdGlscy5leGlzdHModGhpcy5fZmlyc3RNb2RlbFNraXBbZXZ0LmRhdGEudGFiSWRdKSkge1xuICAgICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcFtldnQuZGF0YS50YWJJZF0gPSB0cnVlO1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7ZXZ0LmRhdGEudGFiSWR9YCkuaGlzdG9yeUNvdW50KCkgIT0gMCAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykgPT0gXCJjcmVhdGVcIikgeyAvL1RISVMgSVMgV0hFUkUgVEhFIENSVVggSVMuIFdIQVQgSVMgVEhBVD9cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7dGhpcy5fdmlldy5zaG93VmlkZW8oZmFsc2UpO31cblxuICAgICAgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3JyAmJiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKSkge1xuICAgICAgICBpZiAoISh0aGlzLl9sYXN0TW9kZWxSZXN1bHQgJiYgdGhpcy5fbGFzdE1vZGVsUmVzdWx0LmV1Z2xlbmFNb2RlbElkID09IGV2dC5kYXRhLm1vZGVsLmlkICYmIHRoaXMuX2xhc3RNb2RlbFJlc3VsdC5leHBlcmltZW50SWQgPT0gR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQpKSB7XG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkLCBldnQuZGF0YS5tb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIHJlc3VsdHMsIGV2dC5kYXRhLnRhYklkKTsgLy8gVEhJUyBJUyBXSEVSRSBJIEhBVkUgVE8gRE8gSVQgV0lUSCBUSEUgR1JBUEggVklFV1xuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0ge1xuICAgICAgICAgICAgZXVnbGVuYU1vZGVsSWQ6IGV2dC5kYXRhLm1vZGVsLmlkLFxuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKS5pZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9jYWNoZU1vZGVsKGV2dC5kYXRhLm1vZGVsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhldnQuZGF0YS5tb2RlbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9jYWNoZU1vZGVsKG1vZGVsLCB0YWJJZCkge1xuICAgICAgaWYgKCFtb2RlbC5kYXRlX2NyZWF0ZWQpIHtcbiAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke21vZGVsLmlkfWApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0ge1xuICAgICAgICAgICAgbW9kZWw6IGRhdGEsXG4gICAgICAgICAgICB0YWJJZDogdGFiSWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0ge1xuICAgICAgICAgIG1vZGVsOiBtb2RlbCxcbiAgICAgICAgICB0YWJJZDogdGFiSWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbk1vZGVsUmVzdWx0c1JlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEudGFiSWQgPT0gJ25vbmUnKSB7XG4gICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdCA9IG51bGw7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykgPT0gJ3NlcXVlbnRpYWwnKSB7IHRoaXMuX3ZpZXcuc2hvd1ZpZGVvKHRydWUpO31cbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMobnVsbCwgbnVsbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9tb2RlbENhY2hlID0ge1xuICAgICAgICAgIHRhYklkOiAnbm9uZScsXG4gICAgICAgICAgbW9kZWw6IG51bGxcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY3Vyck1vZGVsID0gR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7ZXZ0LmRhdGEudGFiSWR9YCkuY3Vyck1vZGVsKCk7XG5cbiAgICAgICAgaWYgKGN1cnJNb2RlbCkge1xuICAgICAgICAgIHRoaXMuX29uTW9kZWxMb2FkZWQoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbDogY3Vyck1vZGVsLFxuICAgICAgICAgICAgICB0YWJJZDogZXZ0LmRhdGEudGFiSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgbW9kZWxJZDogY3Vyck1vZGVsLmlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJyZXN1bHRzXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWQsXG4gICAgICAgICAgICAgIHJlc3VsdElkOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdJbnRlcmFjdGl2ZVRhYnMuVGFiUmVxdWVzdCcsIHtcbiAgICAgICAgICB0YWJJZDogYG1vZGVsXyR7ZXZ0LmRhdGEudGFiSWR9YFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX3ZpZXcucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fdmlldy5oaWRlKCk7XG4gICAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwID0ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy5fdmlldy5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufSlcbiJdfQ==
