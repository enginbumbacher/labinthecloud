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

      Utils.bindMethods(_this, ['_onExperimentLoaded', '_onModelLoaded', '_onModelResultsRequest', '_onPhaseChange']);

      _this._currentExperiment = null;
      _this._currentModel = null;

      _this._view = new View();
      _this._view.addEventListener('ResultsView.RequestModelData', _this._onModelResultsRequest);

      _this._firstModelSkip = {};

      Globals.get('Relay').addEventListener('Experiment.Loaded', _this._onExperimentLoaded);
      Globals.get('Relay').addEventListener('EuglenaModel.Loaded', _this._onModelLoaded);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
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
              _this3._view.handleExperimentResults(evt.data.experiment, results);
              if (_this3._modelCache && _this3._modelCache.model != null) {
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
          return;
        }
        if (evt.data.model.id != '_new' && Globals.get('currentExperiment')) {
          if (!(this._lastModelResult && this._lastModelResult.euglenaModelId == evt.data.model.id && this._lastModelResult.experimentId == Globals.get('currentExperiment').id)) {
            EugUtils.getModelResults(Globals.get('currentExperiment').id, evt.data.model).then(function (results) {
              _this4._view.handleModelResults(evt.data.model, results, evt.data.tabId);
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
        if (evt.data.phase == "login") {
          this._view.reset();
          this._view.hide();
          this._firstModelSkip = {};
        } else {
          this._view.show();
        }
      }
    }]);

    return ResultsModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJnZXRMaXZlUmVzdWx0cyIsInRoZW4iLCJyZXN1bHRzIiwic2V0IiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJfbW9kZWxDYWNoZSIsIm1vZGVsIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJleGlzdHMiLCJ0YWJJZCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImdldE1vZGVsUmVzdWx0cyIsImhhbmRsZU1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJjdXJyTW9kZWwiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJkaXNwYXRjaEV2ZW50IiwicGhhc2UiLCJyZXNldCIsImhpZGUiLCJzaG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsS0FBS0QsUUFBUSx5QkFBUixDQUFYO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsVUFBVUgsUUFB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VSxXQUFuQjtBQUlELFNBZEQsTUFjTztBQUNMLGNBQU1tQixZQUFZaEQsUUFBUVcsR0FBUixlQUF3QlMsSUFBSUMsSUFBSixDQUFTZSxLQUFqQyxFQUEwQ1ksU0FBMUMsRUFBbEI7O0FBRUEsY0FBSUEsU0FBSixFQUFlO0FBQ2IsaUJBQUtuQyxjQUFMLENBQW9CO0FBQ2xCUSxvQkFBTTtBQUNKUSx1QkFBT21CLFNBREg7QUFFSlosdUJBQU9oQixJQUFJQyxJQUFKLENBQVNlO0FBRlo7QUFEWSxhQUFwQjtBQU1BcEMsb0JBQVFXLEdBQVIsQ0FBWSxRQUFaLEVBQXNCc0IsR0FBdEIsQ0FBMEI7QUFDeEJZLG9CQUFNLGNBRGtCO0FBRXhCQyx3QkFBVSxTQUZjO0FBR3hCekIsb0JBQU07QUFDSjBCLHFCQUFLM0IsSUFBSUMsSUFBSixDQUFTZSxLQURWO0FBRUphLHlCQUFTRCxVQUFVOUI7QUFGZjtBQUhrQixhQUExQjtBQVFELFdBZkQsTUFlTztBQUNMLGlCQUFLWCxLQUFMLENBQVdrQyxrQkFBWCxDQUE4QixJQUE5QixFQUFvQyxJQUFwQyxFQUEwQ3JCLElBQUlDLElBQUosQ0FBU2UsS0FBbkQ7QUFDQSxpQkFBS0MsZ0JBQUwsR0FBd0IsSUFBeEI7QUFDQXJDLG9CQUFRVyxHQUFSLENBQVksUUFBWixFQUFzQnNCLEdBQXRCLENBQTBCO0FBQ3hCWSxvQkFBTSxjQURrQjtBQUV4QkMsd0JBQVUsU0FGYztBQUd4QnpCLG9CQUFNO0FBQ0owQixxQkFBSzNCLElBQUlDLElBQUosQ0FBU2UsS0FEVjtBQUVKYywwQkFBVTtBQUZOO0FBSGtCLGFBQTFCO0FBUUQ7QUFDRGxELGtCQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQndDLGFBQXJCLENBQW1DLDRCQUFuQyxFQUFpRTtBQUMvRGYsOEJBQWdCaEIsSUFBSUMsSUFBSixDQUFTZTtBQURzQyxXQUFqRTtBQUdEO0FBQ0Y7QUEzSUg7QUFBQTtBQUFBLHFDQTZJaUJoQixHQTdJakIsRUE2SXNCO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBUytCLEtBQVQsSUFBa0IsT0FBdEIsRUFBK0I7QUFDN0IsZUFBSzdDLEtBQUwsQ0FBVzhDLEtBQVg7QUFDQSxlQUFLOUMsS0FBTCxDQUFXK0MsSUFBWDtBQUNBLGVBQUs1QyxlQUFMLEdBQXVCLEVBQXZCO0FBQ0QsU0FKRCxNQUlPO0FBQ0wsZUFBS0gsS0FBTCxDQUFXZ0QsSUFBWDtBQUNEO0FBQ0Y7QUFySkg7O0FBQUE7QUFBQSxJQUFtQ3RELE1BQW5DO0FBd0pELENBbEtEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
