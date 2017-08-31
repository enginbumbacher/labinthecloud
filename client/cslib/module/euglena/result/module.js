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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJnZXRMaXZlUmVzdWx0cyIsInRoZW4iLCJyZXN1bHRzIiwic2V0IiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJfbW9kZWxDYWNoZSIsIm1vZGVsIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJleGlzdHMiLCJ0YWJJZCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImdldE1vZGVsUmVzdWx0cyIsImhhbmRsZU1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJjdXJyTW9kZWwiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJkaXNwYXRjaEV2ZW50IiwicGhhc2UiLCJyZXNldCIsImhpZGUiLCJjb3VudCIsIm9sZCIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxRQUFRLHlCQUFSLENBQVg7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssT0FBT0wsUUFBUSxRQUFSLENBRFQ7QUFBQSxNQUVFTSxXQUFXTixRQUFRLGVBQVIsQ0FGYjs7QUFLQTtBQUFBOztBQUNFLDZCQUFjO0FBQUE7O0FBQUE7O0FBRVpFLFlBQU1LLFdBQU4sUUFBd0IsQ0FBQyxxQkFBRCxFQUF3QixnQkFBeEIsRUFBMEMsd0JBQTFDLEVBQW9FLGdCQUFwRSxFQUN0QiwwQkFEc0IsQ0FBeEI7O0FBR0EsWUFBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFDQSxZQUFLQyxhQUFMLEdBQXFCLElBQXJCOztBQUVBLFlBQUtDLEtBQUwsR0FBYSxJQUFJTCxJQUFKLEVBQWI7QUFDQSxZQUFLSyxLQUFMLENBQVdDLGdCQUFYLENBQTRCLDhCQUE1QixFQUE0RCxNQUFLQyxzQkFBakU7O0FBRUEsWUFBS0MsZUFBTCxHQUF1QixFQUF2Qjs7QUFFQVYsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJILGdCQUFyQixDQUFzQyxtQkFBdEMsRUFBMkQsTUFBS0ksbUJBQWhFO0FBQ0FaLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0MscUJBQXRDLEVBQTZELE1BQUtLLGNBQWxFO0FBQ0FiLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtNLGNBQTlEO0FBQ0FkLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSCxnQkFBckIsQ0FBc0Msd0JBQXRDLEVBQWdFLE1BQUtPLHdCQUFyRTtBQWhCWTtBQWlCYjs7QUFsQkg7QUFBQTtBQUFBLDZCQW9CUztBQUFBOztBQUNMakIsV0FBR2tCLElBQUgsQ0FBUSxnQkFBUixFQUEwQixVQUFDQyxPQUFELEVBQVVDLElBQVYsRUFBbUI7QUFDM0MsY0FBSUEsS0FBS0MsRUFBTCxJQUFXLFFBQWYsRUFBeUI7QUFDdkJGLG9CQUFRRyxJQUFSLENBQWEsT0FBS2IsS0FBbEI7QUFDRDtBQUNELGlCQUFPVSxPQUFQO0FBQ0QsU0FMRCxFQUtHLEVBTEg7QUFNQTtBQUNEO0FBNUJIO0FBQUE7QUFBQSwwQ0E4QnNCSSxHQTlCdEIsRUE4QjJCO0FBQUE7O0FBQ3ZCLFlBQUlBLElBQUlDLElBQUosQ0FBU0MsVUFBVCxDQUFvQkosRUFBcEIsSUFBMEIsS0FBS2Qsa0JBQW5DLEVBQXVEO0FBQ3JELGVBQUtBLGtCQUFMLEdBQTBCZ0IsSUFBSUMsSUFBSixDQUFTQyxVQUFULENBQW9CSixFQUE5Qzs7QUFFQSxjQUFJRSxJQUFJQyxJQUFKLENBQVNDLFVBQVQsQ0FBb0JKLEVBQXBCLElBQTBCLE1BQTlCLEVBQXNDO0FBQ3BDaEIscUJBQVNxQixjQUFULENBQXdCSCxJQUFJQyxJQUFKLENBQVNDLFVBQVQsQ0FBb0JKLEVBQTVDLEVBQWdETSxJQUFoRCxDQUFxRCxVQUFDQyxPQUFELEVBQWE7QUFDaEUxQixzQkFBUTJCLEdBQVIsQ0FBWSwwQkFBWixFQUF3Q0QsT0FBeEM7QUFDQSxxQkFBS25CLEtBQUwsQ0FBV3FCLHVCQUFYLENBQW1DUCxJQUFJQyxJQUFKLENBQVNDLFVBQTVDLEVBQXdERyxPQUF4RDtBQUNBLGtCQUFJLE9BQUtHLFdBQUwsSUFBb0IsT0FBS0EsV0FBTCxDQUFpQkMsS0FBakIsSUFBMEIsSUFBbEQsRUFBd0Q7QUFDdEQsdUJBQUtqQixjQUFMLENBQW9CO0FBQ2xCUyx3QkFBTSxPQUFLTztBQURPLGlCQUFwQjtBQUdEO0FBQ0YsYUFSRCxFQVFHRSxLQVJILENBUVMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hCQyxzQkFBUUMsR0FBUixDQUFZRixHQUFaO0FBQ0QsYUFWRDtBQVdELFdBWkQsTUFZTztBQUNMLGlCQUFLekIsS0FBTCxDQUFXNEIsS0FBWDtBQUNEO0FBQ0Y7QUFDRjtBQWxESDtBQUFBO0FBQUEscUNBb0RpQmQsR0FwRGpCLEVBb0RzQjtBQUFBOztBQUNsQixZQUFJLENBQUN0QixNQUFNcUMsTUFBTixDQUFhLEtBQUsxQixlQUFMLENBQXFCVyxJQUFJQyxJQUFKLENBQVNlLEtBQTlCLENBQWIsQ0FBTCxFQUF5RDtBQUN2RCxlQUFLM0IsZUFBTCxDQUFxQlcsSUFBSUMsSUFBSixDQUFTZSxLQUE5QixJQUF1QyxJQUF2QztBQUNBO0FBQ0Q7QUFDRCxZQUFJaEIsSUFBSUMsSUFBSixDQUFTUSxLQUFULENBQWVYLEVBQWYsSUFBcUIsTUFBckIsSUFBK0JuQixRQUFRVyxHQUFSLENBQVksbUJBQVosQ0FBbkMsRUFBcUU7QUFDbkUsY0FBSSxFQUFFLEtBQUsyQixnQkFBTCxJQUF5QixLQUFLQSxnQkFBTCxDQUFzQkMsY0FBdEIsSUFBd0NsQixJQUFJQyxJQUFKLENBQVNRLEtBQVQsQ0FBZVgsRUFBaEYsSUFBc0YsS0FBS21CLGdCQUFMLENBQXNCRSxZQUF0QixJQUFzQ3hDLFFBQVFXLEdBQVIsQ0FBWSxtQkFBWixFQUFpQ1EsRUFBL0osQ0FBSixFQUF3SztBQUN0S2hCLHFCQUFTc0MsZUFBVCxDQUF5QnpDLFFBQVFXLEdBQVIsQ0FBWSxtQkFBWixFQUFpQ1EsRUFBMUQsRUFBOERFLElBQUlDLElBQUosQ0FBU1EsS0FBdkUsRUFBOEVMLElBQTlFLENBQW1GLFVBQUNDLE9BQUQsRUFBYTtBQUM5RixxQkFBS25CLEtBQUwsQ0FBV21DLGtCQUFYLENBQThCckIsSUFBSUMsSUFBSixDQUFTUSxLQUF2QyxFQUE4Q0osT0FBOUMsRUFBdURMLElBQUlDLElBQUosQ0FBU2UsS0FBaEU7QUFDRCxhQUZEO0FBR0EsaUJBQUtDLGdCQUFMLEdBQXdCO0FBQ3RCQyw4QkFBZ0JsQixJQUFJQyxJQUFKLENBQVNRLEtBQVQsQ0FBZVgsRUFEVDtBQUV0QnFCLDRCQUFjeEMsUUFBUVcsR0FBUixDQUFZLG1CQUFaLEVBQWlDUTtBQUZ6QixhQUF4QjtBQUlEO0FBQ0QsZUFBS3dCLFdBQUwsQ0FBaUJ0QixJQUFJQyxJQUFKLENBQVNRLEtBQTFCLEVBQWlDVCxJQUFJQyxJQUFKLENBQVNlLEtBQTFDO0FBQ0QsU0FYRCxNQVdPLElBQUloQixJQUFJQyxJQUFKLENBQVNRLEtBQVQsQ0FBZVgsRUFBZixJQUFxQixNQUF6QixFQUFpQztBQUN0QyxlQUFLd0IsV0FBTCxDQUFpQnRCLElBQUlDLElBQUosQ0FBU1EsS0FBMUIsRUFBaUNULElBQUlDLElBQUosQ0FBU2UsS0FBMUM7QUFDRCxTQUZNLE1BRUE7QUFDTCxlQUFLOUIsS0FBTCxDQUFXbUMsa0JBQVgsQ0FBOEJyQixJQUFJQyxJQUFKLENBQVNRLEtBQXZDLEVBQThDLElBQTlDLEVBQW9EVCxJQUFJQyxJQUFKLENBQVNlLEtBQTdEO0FBQ0EsZUFBS0MsZ0JBQUwsR0FBd0IsSUFBeEI7QUFDRDtBQUNGO0FBMUVIO0FBQUE7QUFBQSxrQ0E0RWNSLEtBNUVkLEVBNEVxQk8sS0E1RXJCLEVBNEU0QjtBQUFBOztBQUN4QixZQUFJLENBQUNQLE1BQU1jLFlBQVgsRUFBeUI7QUFDdkI3QyxnQkFBTThDLFdBQU4sNEJBQTJDZixNQUFNWCxFQUFqRCxFQUF1RE0sSUFBdkQsQ0FBNEQsVUFBQ0gsSUFBRCxFQUFVO0FBQ3BFLG1CQUFLTyxXQUFMLEdBQW1CO0FBQ2pCQyxxQkFBT1IsSUFEVTtBQUVqQmUscUJBQU9BO0FBRlUsYUFBbkI7QUFJRCxXQUxEO0FBTUQsU0FQRCxNQU9PO0FBQ0wsZUFBS1IsV0FBTCxHQUFtQjtBQUNqQkMsbUJBQU9BLEtBRFU7QUFFakJPLG1CQUFPQTtBQUZVLFdBQW5CO0FBSUQ7QUFDRjtBQTFGSDtBQUFBO0FBQUEsNkNBNEZ5QmhCLEdBNUZ6QixFQTRGOEI7QUFDMUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTZSxLQUFULElBQWtCLE1BQXRCLEVBQThCO0FBQzVCLGVBQUtDLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0EsZUFBSy9CLEtBQUwsQ0FBV21DLGtCQUFYLENBQThCLElBQTlCLEVBQW9DLElBQXBDLEVBQTBDckIsSUFBSUMsSUFBSixDQUFTZSxLQUFuRDtBQUNBckMsa0JBQVFXLEdBQVIsQ0FBWSxRQUFaLEVBQXNCdUIsR0FBdEIsQ0FBMEI7QUFDeEJZLGtCQUFNLGNBRGtCO0FBRXhCQyxzQkFBVSxTQUZjO0FBR3hCekIsa0JBQU07QUFDSjBCLG1CQUFLM0IsSUFBSUMsSUFBSixDQUFTZTtBQURWO0FBSGtCLFdBQTFCO0FBT0EsZUFBS1IsV0FBTCxHQUFtQjtBQUNqQlEsbUJBQU8sTUFEVTtBQUVqQlAsbUJBQU87QUFGVSxXQUFuQjtBQUlELFNBZEQsTUFjTztBQUNMLGNBQU1tQixZQUFZakQsUUFBUVcsR0FBUixlQUF3QlUsSUFBSUMsSUFBSixDQUFTZSxLQUFqQyxFQUEwQ1ksU0FBMUMsRUFBbEI7O0FBRUEsY0FBSUEsU0FBSixFQUFlO0FBQ2IsaUJBQUtwQyxjQUFMLENBQW9CO0FBQ2xCUyxvQkFBTTtBQUNKUSx1QkFBT21CLFNBREg7QUFFSlosdUJBQU9oQixJQUFJQyxJQUFKLENBQVNlO0FBRlo7QUFEWSxhQUFwQjtBQU1BckMsb0JBQVFXLEdBQVIsQ0FBWSxRQUFaLEVBQXNCdUIsR0FBdEIsQ0FBMEI7QUFDeEJZLG9CQUFNLGNBRGtCO0FBRXhCQyx3QkFBVSxTQUZjO0FBR3hCekIsb0JBQU07QUFDSjBCLHFCQUFLM0IsSUFBSUMsSUFBSixDQUFTZSxLQURWO0FBRUphLHlCQUFTRCxVQUFVOUI7QUFGZjtBQUhrQixhQUExQjtBQVFELFdBZkQsTUFlTztBQUNMLGlCQUFLWixLQUFMLENBQVdtQyxrQkFBWCxDQUE4QixJQUE5QixFQUFvQyxJQUFwQyxFQUEwQ3JCLElBQUlDLElBQUosQ0FBU2UsS0FBbkQ7QUFDQSxpQkFBS0MsZ0JBQUwsR0FBd0IsSUFBeEI7QUFDQXRDLG9CQUFRVyxHQUFSLENBQVksUUFBWixFQUFzQnVCLEdBQXRCLENBQTBCO0FBQ3hCWSxvQkFBTSxjQURrQjtBQUV4QkMsd0JBQVUsU0FGYztBQUd4QnpCLG9CQUFNO0FBQ0owQixxQkFBSzNCLElBQUlDLElBQUosQ0FBU2UsS0FEVjtBQUVKYywwQkFBVTtBQUZOO0FBSGtCLGFBQTFCO0FBUUQ7QUFDRG5ELGtCQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQnlDLGFBQXJCLENBQW1DLDRCQUFuQyxFQUFpRTtBQUMvRGYsOEJBQWdCaEIsSUFBSUMsSUFBSixDQUFTZTtBQURzQyxXQUFqRTtBQUdEO0FBQ0Y7QUE3SUg7QUFBQTtBQUFBLHFDQStJaUJoQixHQS9JakIsRUErSXNCO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBUytCLEtBQVQsSUFBa0IsT0FBdEIsRUFBK0I7QUFDN0IsZUFBSzlDLEtBQUwsQ0FBVytDLEtBQVg7QUFDQSxlQUFLL0MsS0FBTCxDQUFXZ0QsSUFBWDtBQUNBLGVBQUs3QyxlQUFMLEdBQXVCLEVBQXZCO0FBQ0Q7QUFDRjtBQXJKSDtBQUFBO0FBQUEsK0NBdUoyQlcsR0F2SjNCLEVBdUpnQztBQUM1QixZQUFJQSxJQUFJQyxJQUFKLENBQVNrQyxLQUFULElBQWtCLENBQUNuQyxJQUFJQyxJQUFKLENBQVNtQyxHQUFoQyxFQUFxQztBQUNuQyxlQUFLbEQsS0FBTCxDQUFXbUQsSUFBWDtBQUNELFNBRkQsTUFFTyxJQUFJLENBQUNyQyxJQUFJQyxJQUFKLENBQVNrQyxLQUFkLEVBQXFCO0FBQzFCLGVBQUtqRCxLQUFMLENBQVdnRCxJQUFYO0FBQ0Q7QUFDRjtBQTdKSDs7QUFBQTtBQUFBLElBQW1DdEQsTUFBbkM7QUFnS0QsQ0ExS0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvcmVzdWx0L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0c01vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25FeHBlcmltZW50TG9hZGVkJywgJ19vbk1vZGVsTG9hZGVkJywgJ19vbk1vZGVsUmVzdWx0c1JlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgICAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCA9IG51bGw7XG4gICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuXG4gICAgICB0aGlzLl92aWV3ID0gbmV3IFZpZXcoKTtcbiAgICAgIHRoaXMuX3ZpZXcuYWRkRXZlbnRMaXN0ZW5lcignUmVzdWx0c1ZpZXcuUmVxdWVzdE1vZGVsRGF0YScsIHRoaXMuX29uTW9kZWxSZXN1bHRzUmVxdWVzdCk7XG5cbiAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwID0ge307XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnQuTG9hZGVkJywgdGhpcy5fb25FeHBlcmltZW50TG9hZGVkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB0aGlzLl9vbk1vZGVsTG9hZGVkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIEhNLmhvb2soJ1BhbmVsLkNvbnRlbnRzJywgKHN1YmplY3QsIG1ldGEpID0+IHtcbiAgICAgICAgaWYgKG1ldGEuaWQgPT0gXCJyZXN1bHRcIikge1xuICAgICAgICAgIHN1YmplY3QucHVzaCh0aGlzLl92aWV3KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViamVjdDtcbiAgICAgIH0sIDEwKTtcbiAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudExvYWRlZChldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5leHBlcmltZW50LmlkICE9IHRoaXMuX2N1cnJlbnRFeHBlcmltZW50KSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRFeHBlcmltZW50ID0gZXZ0LmRhdGEuZXhwZXJpbWVudC5pZDtcbiAgICAgICAgXG4gICAgICAgIGlmIChldnQuZGF0YS5leHBlcmltZW50LmlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIEV1Z1V0aWxzLmdldExpdmVSZXN1bHRzKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIEdsb2JhbHMuc2V0KCdjdXJyZW50RXhwZXJpbWVudFJlc3VsdHMnLCByZXN1bHRzKTtcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMoZXZ0LmRhdGEuZXhwZXJpbWVudCwgcmVzdWx0cyk7XG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWxDYWNoZSAmJiB0aGlzLl9tb2RlbENhY2hlLm1vZGVsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICAgICAgZGF0YTogdGhpcy5fbW9kZWxDYWNoZVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl92aWV3LmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbExvYWRlZChldnQpIHtcbiAgICAgIGlmICghVXRpbHMuZXhpc3RzKHRoaXMuX2ZpcnN0TW9kZWxTa2lwW2V2dC5kYXRhLnRhYklkXSkpIHtcbiAgICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXBbZXZ0LmRhdGEudGFiSWRdID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3JyAmJiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKSkge1xuICAgICAgICBpZiAoISh0aGlzLl9sYXN0TW9kZWxSZXN1bHQgJiYgdGhpcy5fbGFzdE1vZGVsUmVzdWx0LmV1Z2xlbmFNb2RlbElkID09IGV2dC5kYXRhLm1vZGVsLmlkICYmIHRoaXMuX2xhc3RNb2RlbFJlc3VsdC5leHBlcmltZW50SWQgPT0gR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQpKSB7XG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkLCBldnQuZGF0YS5tb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIHJlc3VsdHMsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdCA9IHtcbiAgICAgICAgICAgIGV1Z2xlbmFNb2RlbElkOiBldnQuZGF0YS5tb2RlbC5pZCxcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FjaGVNb2RlbChldnQuZGF0YS5tb2RlbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5tb2RlbC5pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5fY2FjaGVNb2RlbChldnQuZGF0YS5tb2RlbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfY2FjaGVNb2RlbChtb2RlbCwgdGFiSWQpIHtcbiAgICAgIGlmICghbW9kZWwuZGF0ZV9jcmVhdGVkKSB7XG4gICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHttb2RlbC5pZH1gKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IHtcbiAgICAgICAgICAgIG1vZGVsOiBkYXRhLFxuICAgICAgICAgICAgdGFiSWQ6IHRhYklkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IHtcbiAgICAgICAgICBtb2RlbDogbW9kZWwsXG4gICAgICAgICAgdGFiSWQ6IHRhYklkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbFJlc3VsdHNSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnRhYklkID09ICdub25lJykge1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSB7XG4gICAgICAgICAgdGFiSWQ6ICdub25lJyxcbiAgICAgICAgICBtb2RlbDogbnVsbFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBjdXJyTW9kZWwgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5jdXJyTW9kZWwoKTtcblxuICAgICAgICBpZiAoY3Vyck1vZGVsKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWwsXG4gICAgICAgICAgICAgIHRhYklkOiBldnQuZGF0YS50YWJJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgICBtb2RlbElkOiBjdXJyTW9kZWwuaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgcmVzdWx0SWQ6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0ludGVyYWN0aXZlVGFicy5UYWJSZXF1ZXN0Jywge1xuICAgICAgICAgIHRhYklkOiBgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiKSB7XG4gICAgICAgIHRoaXMuX3ZpZXcucmVzZXQoKTtcbiAgICAgICAgdGhpcy5fdmlldy5oaWRlKCk7XG4gICAgICAgIHRoaXMuX2ZpcnN0TW9kZWxTa2lwID0ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy5fdmlldy5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG59KSJdfQ==
