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

      Utils.bindMethods(_this, ['_onExperimentLoaded', '_onModelLoaded', '_onSimulationRun', '_onModelResultsRequest', '_onPhaseChange', '_onExperimentCountChange']);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJnZXRMaXZlUmVzdWx0cyIsInRoZW4iLCJyZXN1bHRzIiwic2V0IiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJfbW9kZWxDYWNoZSIsIm1vZGVsIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJleGlzdHMiLCJ0YWJJZCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImdldE1vZGVsUmVzdWx0cyIsImhhbmRsZU1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJjdXJyTW9kZWwiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJkaXNwYXRjaEV2ZW50IiwicGhhc2UiLCJyZXNldCIsImhpZGUiLCJjb3VudCIsIm9sZCIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxRQUFRLHlCQUFSLENBQVg7QUFBQSxNQUNFRSxR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bkMsRUFBaUU7QUFDL0RmLDhCQUFnQmhCLElBQUlDLElBQUosQ0FBU2U7QUFEc0MsV0FBakU7QUFHRDtBQUNGO0FBN0lIO0FBQUE7QUFBQSxxQ0ErSWlCaEIsR0EvSWpCLEVBK0lzQjtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVMrQixLQUFULElBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGVBQUs5QyxLQUFMLENBQVcrQyxLQUFYO0FBQ0EsZUFBSy9DLEtBQUwsQ0FBV2dELElBQVg7QUFDQSxlQUFLN0MsZUFBTCxHQUF1QixFQUF2QjtBQUNEO0FBQ0Y7QUFySkg7QUFBQTtBQUFBLCtDQXVKMkJXLEdBdkozQixFQXVKZ0M7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTa0MsS0FBVCxJQUFrQixDQUFDbkMsSUFBSUMsSUFBSixDQUFTbUMsR0FBaEMsRUFBcUM7QUFDbkMsZUFBS2xELEtBQUwsQ0FBV21ELElBQVg7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDckMsSUFBSUMsSUFBSixDQUFTa0MsS0FBZCxFQUFxQjtBQUMxQixlQUFLakQsS0FBTCxDQUFXZ0QsSUFBWDtBQUNEO0FBQ0Y7QUE3Skg7O0FBQUE7QUFBQSxJQUFtQ3RELE1BQW5DO0FBZ0tELENBMUtEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
