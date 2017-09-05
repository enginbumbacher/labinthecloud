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
          if (Globals.get('ModelTab.' + evt.data.tabId).historyCount() != 0) {
            //THIS IS WHERE THE CRUX IS. WHAT IS THAT?
            return;
          }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkhNIiwiVXRpbHMiLCJHbG9iYWxzIiwiTW9kdWxlIiwiVmlldyIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJfY3VycmVudEV4cGVyaW1lbnQiLCJfY3VycmVudE1vZGVsIiwiX3ZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxSZXN1bHRzUmVxdWVzdCIsIl9maXJzdE1vZGVsU2tpcCIsImdldCIsIl9vbkV4cGVyaW1lbnRMb2FkZWQiLCJfb25Nb2RlbExvYWRlZCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsInN1YmplY3QiLCJtZXRhIiwiaWQiLCJwdXNoIiwiZXZ0IiwiZGF0YSIsImV4cGVyaW1lbnQiLCJnZXRMaXZlUmVzdWx0cyIsInRoZW4iLCJyZXN1bHRzIiwic2V0IiwiaGFuZGxlRXhwZXJpbWVudFJlc3VsdHMiLCJfbW9kZWxDYWNoZSIsIm1vZGVsIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2xlYXIiLCJleGlzdHMiLCJ0YWJJZCIsImhpc3RvcnlDb3VudCIsIl9sYXN0TW9kZWxSZXN1bHQiLCJldWdsZW5hTW9kZWxJZCIsImV4cGVyaW1lbnRJZCIsImdldE1vZGVsUmVzdWx0cyIsImhhbmRsZU1vZGVsUmVzdWx0cyIsIl9jYWNoZU1vZGVsIiwiZGF0ZV9jcmVhdGVkIiwicHJvbWlzZUFqYXgiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJ0YWIiLCJjdXJyTW9kZWwiLCJtb2RlbElkIiwicmVzdWx0SWQiLCJkaXNwYXRjaEV2ZW50IiwicGhhc2UiLCJyZXNldCIsImhpZGUiLCJjb3VudCIsIm9sZCIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxLQUFLRCxRQUFRLHlCQUFSLENB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LENBQVNlLEtBRFY7QUFFSmUsMEJBQVU7QUFGTjtBQUhrQixhQUExQjtBQVFEO0FBQ0RwRCxrQkFBUVcsR0FBUixDQUFZLE9BQVosRUFBcUIwQyxhQUFyQixDQUFtQyw0QkFBbkMsRUFBaUU7QUFDL0RoQiw4QkFBZ0JoQixJQUFJQyxJQUFKLENBQVNlO0FBRHNDLFdBQWpFO0FBR0Q7QUFDRjtBQWhKSDtBQUFBO0FBQUEscUNBa0ppQmhCLEdBbEpqQixFQWtKc0I7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTZ0MsS0FBVCxJQUFrQixPQUFsQixJQUE2QmpDLElBQUlDLElBQUosQ0FBU2dDLEtBQVQsSUFBa0IsaUJBQW5ELEVBQXNFO0FBQ3BFLGVBQUsvQyxLQUFMLENBQVdnRCxLQUFYO0FBQ0EsZUFBS2hELEtBQUwsQ0FBV2lELElBQVg7QUFDQSxlQUFLOUMsZUFBTCxHQUF1QixFQUF2QjtBQUNEO0FBQ0Y7QUF4Skg7QUFBQTtBQUFBLCtDQTBKMkJXLEdBMUozQixFQTBKZ0M7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTbUMsS0FBVCxJQUFrQixDQUFDcEMsSUFBSUMsSUFBSixDQUFTb0MsR0FBaEMsRUFBcUM7QUFDbkMsZUFBS25ELEtBQUwsQ0FBV29ELElBQVg7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDdEMsSUFBSUMsSUFBSixDQUFTbUMsS0FBZCxFQUFxQjtBQUMxQixlQUFLbEQsS0FBTCxDQUFXaUQsSUFBWDtBQUNEO0FBQ0Y7QUFoS0g7O0FBQUE7QUFBQSxJQUFtQ3ZELE1BQW5DO0FBbUtELENBN0tEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3Jlc3VsdC9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIFJlc3VsdHNNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRXhwZXJpbWVudExvYWRlZCcsICdfb25Nb2RlbExvYWRlZCcsICdfb25Nb2RlbFJlc3VsdHNSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJyxcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZSddKTtcblxuICAgICAgdGhpcy5fY3VycmVudEV4cGVyaW1lbnQgPSBudWxsO1xuICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcblxuICAgICAgdGhpcy5fdmlldyA9IG5ldyBWaWV3KCk7XG4gICAgICB0aGlzLl92aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ1Jlc3VsdHNWaWV3LlJlcXVlc3RNb2RlbERhdGEnLCB0aGlzLl9vbk1vZGVsUmVzdWx0c1JlcXVlc3QpO1xuXG4gICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcCA9IHt9O1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50LkxvYWRlZCcsIHRoaXMuX29uRXhwZXJpbWVudExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFdWdsZW5hTW9kZWwuTG9hZGVkJywgdGhpcy5fb25Nb2RlbExvYWRlZCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHRoaXMuX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBITS5ob29rKCdQYW5lbC5Db250ZW50cycsIChzdWJqZWN0LCBtZXRhKSA9PiB7XG4gICAgICAgIGlmIChtZXRhLmlkID09IFwicmVzdWx0XCIpIHtcbiAgICAgICAgICBzdWJqZWN0LnB1c2godGhpcy5fdmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1YmplY3Q7XG4gICAgICB9LCAxMCk7XG4gICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRMb2FkZWQoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCAhPSB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50RXhwZXJpbWVudCA9IGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQ7XG5cbiAgICAgICAgaWYgKGV2dC5kYXRhLmV4cGVyaW1lbnQuaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TGl2ZVJlc3VsdHMoZXZ0LmRhdGEuZXhwZXJpbWVudC5pZCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgR2xvYmFscy5zZXQoJ2N1cnJlbnRFeHBlcmltZW50UmVzdWx0cycsIHJlc3VsdHMpO1xuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVFeHBlcmltZW50UmVzdWx0cyhldnQuZGF0YS5leHBlcmltZW50LCByZXN1bHRzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbENhY2hlICYmIHRoaXMuX21vZGVsQ2FjaGUubW9kZWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLl9vbk1vZGVsTG9hZGVkKHtcbiAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLl9tb2RlbENhY2hlXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbk1vZGVsTG9hZGVkKGV2dCkge1xuICAgICAgaWYgKCFVdGlscy5leGlzdHModGhpcy5fZmlyc3RNb2RlbFNraXBbZXZ0LmRhdGEudGFiSWRdKSkge1xuICAgICAgICB0aGlzLl9maXJzdE1vZGVsU2tpcFtldnQuZGF0YS50YWJJZF0gPSB0cnVlO1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoYE1vZGVsVGFiLiR7ZXZ0LmRhdGEudGFiSWR9YCkuaGlzdG9yeUNvdW50KCkgIT0gMCkgeyAvL1RISVMgSVMgV0hFUkUgVEhFIENSVVggSVMuIFdIQVQgSVMgVEhBVD9cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGV2dC5kYXRhLm1vZGVsLmlkICE9ICdfbmV3JyAmJiBHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQnKSkge1xuICAgICAgICBpZiAoISh0aGlzLl9sYXN0TW9kZWxSZXN1bHQgJiYgdGhpcy5fbGFzdE1vZGVsUmVzdWx0LmV1Z2xlbmFNb2RlbElkID09IGV2dC5kYXRhLm1vZGVsLmlkICYmIHRoaXMuX2xhc3RNb2RlbFJlc3VsdC5leHBlcmltZW50SWQgPT0gR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWQpKSB7XG4gICAgICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpLmlkLCBldnQuZGF0YS5tb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIHJlc3VsdHMsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2xhc3RNb2RlbFJlc3VsdCA9IHtcbiAgICAgICAgICAgIGV1Z2xlbmFNb2RlbElkOiBldnQuZGF0YS5tb2RlbC5pZCxcbiAgICAgICAgICAgIGV4cGVyaW1lbnRJZDogR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50JykuaWRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FjaGVNb2RlbChldnQuZGF0YS5tb2RlbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5tb2RlbC5pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5fY2FjaGVNb2RlbChldnQuZGF0YS5tb2RlbCwgZXZ0LmRhdGEudGFiSWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdmlldy5oYW5kbGVNb2RlbFJlc3VsdHMoZXZ0LmRhdGEubW9kZWwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgdGhpcy5fbGFzdE1vZGVsUmVzdWx0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfY2FjaGVNb2RlbChtb2RlbCwgdGFiSWQpIHtcbiAgICAgIGlmICghbW9kZWwuZGF0ZV9jcmVhdGVkKSB7XG4gICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHttb2RlbC5pZH1gKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IHtcbiAgICAgICAgICAgIG1vZGVsOiBkYXRhLFxuICAgICAgICAgICAgdGFiSWQ6IHRhYklkXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW9kZWxDYWNoZSA9IHtcbiAgICAgICAgICBtb2RlbDogbW9kZWwsXG4gICAgICAgICAgdGFiSWQ6IHRhYklkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbFJlc3VsdHNSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnRhYklkID09ICdub25lJykge1xuICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLl92aWV3LmhhbmRsZU1vZGVsUmVzdWx0cyhudWxsLCBudWxsLCBldnQuZGF0YS50YWJJZCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IFwibW9kZWxfY2hhbmdlXCIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRhYjogZXZ0LmRhdGEudGFiSWRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX21vZGVsQ2FjaGUgPSB7XG4gICAgICAgICAgdGFiSWQ6ICdub25lJyxcbiAgICAgICAgICBtb2RlbDogbnVsbFxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBjdXJyTW9kZWwgPSBHbG9iYWxzLmdldChgTW9kZWxUYWIuJHtldnQuZGF0YS50YWJJZH1gKS5jdXJyTW9kZWwoKTtcblxuICAgICAgICBpZiAoY3Vyck1vZGVsKSB7XG4gICAgICAgICAgdGhpcy5fb25Nb2RlbExvYWRlZCh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsOiBjdXJyTW9kZWwsXG4gICAgICAgICAgICAgIHRhYklkOiBldnQuZGF0YS50YWJJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcIm1vZGVsX2NoYW5nZVwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwicmVzdWx0c1wiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICB0YWI6IGV2dC5kYXRhLnRhYklkLFxuICAgICAgICAgICAgICBtb2RlbElkOiBjdXJyTW9kZWwuaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3ZpZXcuaGFuZGxlTW9kZWxSZXN1bHRzKG51bGwsIG51bGwsIGV2dC5kYXRhLnRhYklkKTtcbiAgICAgICAgICB0aGlzLl9sYXN0TW9kZWxSZXN1bHQgPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJtb2RlbF9jaGFuZ2VcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcInJlc3VsdHNcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdGFiOiBldnQuZGF0YS50YWJJZCxcbiAgICAgICAgICAgICAgcmVzdWx0SWQ6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0ludGVyYWN0aXZlVGFicy5UYWJSZXF1ZXN0Jywge1xuICAgICAgICAgIHRhYklkOiBgbW9kZWxfJHtldnQuZGF0YS50YWJJZH1gXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5fdmlldy5yZXNldCgpO1xuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcbiAgICAgICAgdGhpcy5fZmlyc3RNb2RlbFNraXAgPSB7fTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50Q291bnRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuY291bnQgJiYgIWV2dC5kYXRhLm9sZCkge1xuICAgICAgICB0aGlzLl92aWV3LnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAoIWV2dC5kYXRhLmNvdW50KSB7XG4gICAgICAgIHRoaXMuX3ZpZXcuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59KVxuIl19
