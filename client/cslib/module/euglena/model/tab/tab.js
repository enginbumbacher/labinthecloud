'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      ModelHistoryForm = require('../history/form'),
      ModelForm = require('../form/form'),
      NameForm = require('../nameform/form'),
      EugUtils = require('euglena/utils');

  var ModelTab = function (_Component) {
    _inherits(ModelTab, _Component);

    function ModelTab() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModelTab);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (ModelTab.__proto__ || Object.getPrototypeOf(ModelTab)).call(this, settings));

      Utils.bindMethods(_this, ['_onSimulateRequest', '_onSaveRequest', '_onAggregateRequest', '_onNameCancel', '_onNameSubmit', '_onGlobalsChange', '_loadModelInForm', '_onHistorySelectionChange', '_onConfigChange', '_onNewRequest', '_onPhaseChange']);

      _this._history = ModelHistoryForm.create({
        id: 'model_history__' + _this._model.get("id"),
        modelType: _this._model.get('modelType')
      });
      _this._history.addEventListener('Form.FieldChanged', _this._onHistorySelectionChange);

      _this._form = ModelForm.create({
        modelType: _this._model.get('modelType'),
        fieldConfig: _this._model.get('parameters'),
        euglenaCountConfig: _this._model.get('euglenaCount')
      });
      _this._form.addEventListener('Form.FieldChanged', _this._onConfigChange);
      _this._form.view().addEventListener('ModelForm.Simulate', _this._onSimulateRequest);
      _this._form.view().addEventListener('ModelForm.Save', _this._onSaveRequest);
      _this._form.view().addEventListener('ModelForm.AddToAggregate', _this._onAggregateRequest);
      _this._form.view().addEventListener('ModelForm.NewRequest', _this._onNewRequest);

      _this._nameForm = NameForm.create();
      _this._nameForm.view().addEventListener('ModelSave.Submit', _this._onNameSubmit);
      _this._nameForm.view().addEventListener('ModelSave.Cancel', _this._onNameCancel);
      _this.view().addChild(_this._history.view());
      _this.view().addChild(_this._form.view());

      Globals.addEventListener('Model.Change', _this._onGlobalsChange);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      return _this;
    }

    _createClass(ModelTab, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'lastResultId',
      value: function lastResultId() {
        return this._lastSimulationId;
      }
    }, {
      key: 'currSimulation',
      value: function currSimulation() {
        return this._lastSimulation;
      }
    }, {
      key: 'currModelId',
      value: function currModelId() {
        return this._currModelId;
      }
    }, {
      key: 'currModel',
      value: function currModel() {
        return this._currentModel;
      }
    }, {
      key: 'color',
      value: function color() {
        return this._model.get('color');
      }
    }, {
      key: '_onGlobalsChange',
      value: function _onGlobalsChange(evt) {
        var _this2 = this;

        switch (evt.data.path) {
          case 'student_id':
            this._history.update().then(function () {
              var hist = _this2._history.getHistory();
              if (hist.length) {
                return _this2._history.import({
                  model_history_id: hist[hist.length - 1]
                });
              } else {
                _this2._form.setState('new');
                return true;
              }
            }).then(function () {
              _this2._loadModelInForm(_this2._history.export().model_history_id);
            });
            break;
        }
      }
    }, {
      key: '_onHistorySelectionChange',
      value: function _onHistorySelectionChange(evt) {
        this._loadModelInForm(evt.currentTarget.export().model_history_id);
      }
    }, {
      key: '_onConfigChange',
      value: function _onConfigChange(evt) {
        if (this._history.export().model_history_id != '_new') {
          this._history.import({ model_history_id: '_new' });
          this._lastSimulationId = null;
          this._lastSimulation = null;
          this._form.setState('new');
        }
      }
    }, {
      key: '_loadModelInForm',
      value: function _loadModelInForm(id) {
        var _this3 = this;

        if (!id) return;
        var oldId = this._currModelId;
        var target = id == '_new' ? null : id;
        if (oldId != target) {
          if (id != '_new') {
            this._currModelId = id;
            Utils.promiseAjax('/api/v1/EuglenaModels/' + id).then(function (data) {
              _this3._form.removeEventListener('Form.FieldChanged', _this3._onConfigChange);
              _this3._currentModel = data;
              _this3._form.import(data.configuration).then(function () {
                _this3._form.addEventListener('Form.FieldChanged', _this3._onConfigChange);
                Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
                  model: data,
                  tabId: _this3._model.get('id')
                });
              });
            });
            this._form.setState('historical');
          } else {
            this._currModelId = null;
            this._currentModel = null;
            Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
              model: {
                id: '_new'
              },
              tabId: this._model.get('id')
            });
            this._form.setState('new');
          }
          Globals.get('Logger').log({
            type: "load",
            category: "model",
            data: {
              modelId: id,
              tab: this.id()
            }
          });
        }
      }
    }, {
      key: '_onSimulateRequest',
      value: function _onSimulateRequest(evt) {
        var _this4 = this;

        var conf = this._form.export();
        EugUtils.generateResults({
          experimentId: Globals.get('currentExperiment').id,
          model: {
            modelType: this._model.get('modelType'),
            configuration: conf
          },
          count: conf.count,
          magnification: Globals.get('currentExperimentResults.magnification')
        }).then(function (data) {
          _this4._lastSimulationId = data.id;
          _this4._lastSimulation = {
            experimentId: Globals.get('currentExperiment').id,
            model: {
              modelType: _this4._model.get('modelType'),
              configuration: conf
            },
            count: conf.count,
            magnification: Globals.get('currentExperimentResults.magnification')
          };
          Globals.get('Relay').dispatchEvent('Simulation.Run', {
            results: data,
            simulation: {
              experimentId: Globals.get('currentExperiment').id,
              model: {
                modelType: _this4._model.get('modelType'),
                configuration: conf
              },
              count: conf.count,
              magnification: Globals.get('currentExperimentResults.magnification')
            },
            tabId: _this4._model.get('id')
          });
        });
        Globals.get('Logger').log({
          type: "simulate",
          category: "model",
          data: {
            modelType: this._model.get('modelType'),
            configuration: conf
          }
        });
      }
    }, {
      key: '_onSaveRequest',
      value: function _onSaveRequest(evt) {
        Globals.get('InteractiveModal').display(this._nameForm.view());
      }
    }, {
      key: '_onNameSubmit',
      value: function _onNameSubmit(evt) {
        var _this5 = this;

        var model = void 0;
        this._nameForm.validate().then(function (validation) {
          return Utils.promiseAjax('/api/v1/EuglenaModels', {
            method: 'POST',
            data: JSON.stringify({
              studentId: Globals.get('student_id'),
              configuration: _this5._form.export(),
              modelType: _this5._model.get('modelType'),
              name: _this5._nameForm.export().name,
              lab: Globals.get('AppConfig.lab')
            }),
            contentType: 'application/json'
          });
        }, function (err) {
          // do nothing
        }).then(function (data) {
          if (!data) return;
          model = data;
          _this5._currModelId = model.id;
          if (_this5._lastSimulationId) {
            return Utils.promiseAjax('/api/v1/Results/' + _this5._lastSimulationId, {
              method: 'PATCH',
              data: JSON.stringify({
                euglenaModelId: model.id
              }),
              contentType: 'application/json'
            });
          } else {
            return EugUtils.generateResults({
              euglenaModelId: model.id,
              experimentId: Globals.get('currentExperiment').id,
              count: model.count,
              magnification: Globals.get('currentExperimentResults.magnification')
            });
          }
        }).then(function (results) {
          // this._lastSimulationId = results.id;
          _this5._lastSimulationId = null;
          _this5._lastSimulation = null;
          Globals.get('InteractiveModal').hide().then(function () {
            _this5._nameForm.clear();
          });
          return _this5._history.update();
        }).then(function () {
          _this5._history.import({
            model_history_id: model.id
          });
        });
        Globals.get('Logger').log({
          type: "save",
          category: "model",
          data: {
            configuration: this._form.export(),
            modelType: this._model.get('modelType'),
            name: this._nameForm.export().name
          }
        });
      }
    }, {
      key: '_onNameCancel',
      value: function _onNameCancel(evt) {
        var _this6 = this;

        Globals.get('InteractiveModal').hide().then(function () {
          _this6._nameForm.clear();
        });
      }
    }, {
      key: '_onAggregateRequest',
      value: function _onAggregateRequest(evt) {
        EugUtils.getModelResults(Globals.get('currentExperiment.id'), this._currentModel).then(function (results) {
          Globals.get('Relay').dispatchEvent('AggregateData.AddRequest', {
            data: results
          });
        });
        Globals.get('Logger').log({
          type: "aggregate",
          category: "model",
          data: {
            modelId: this._history.export().model_history_id
          }
        });
      }
    }, {
      key: '_onNewRequest',
      value: function _onNewRequest(evt) {
        this._onConfigChange(evt);
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login") {
          this._history.import({ model_history_id: '_new' });
        }
      }
    }]);

    return ModelTab;
  }(Component);

  ModelTab.create = function (data) {
    return new ModelTab({ modelData: data });
  };

  return ModelTab;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxIaXN0b3J5Rm9ybSIsIk1vZGVsRm9ybSIsIk5hbWVGb3JtIiwiRXVnVXRpbHMiLCJNb2RlbFRhYiIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2hpc3RvcnkiLCJjcmVhdGUiLCJpZCIsIl9tb2RlbCIsImdldCIsIm1vZGVsVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlIiwiX2Zvcm0iLCJmaWVsZENvbmZpZyIsImV1Z2xlbmFDb3VudENvbmZpZyIsIl9vbkNvbmZpZ0NoYW5nZSIsInZpZXciLCJfb25TaW11bGF0ZVJlcXVlc3QiLCJfb25TYXZlUmVxdWVzdCIsIl9vbkFnZ3JlZ2F0ZVJlcXVlc3QiLCJfb25OZXdSZXF1ZXN0IiwiX25hbWVGb3JtIiwiX29uTmFtZVN1Ym1pdCIsIl9vbk5hbWVDYW5jZWwiLCJhZGRDaGlsZCIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25QaGFzZUNoYW5nZSIsIl9sYXN0U2ltdWxhdGlvbklkIiwiX2xhc3RTaW11bGF0aW9uIiwiX2N1cnJNb2RlbElkIiwiX2N1cnJlbnRNb2RlbCIsImV2dCIsImRhdGEiLCJwYXRoIiwidXBkYXRlIiwidGhlbiIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwibW9kZWxfaGlzdG9yeV9pZCIsInNldFN0YXRlIiwiX2xvYWRNb2RlbEluRm9ybSIsImV4cG9ydCIsImN1cnJlbnRUYXJnZXQiLCJvbGRJZCIsInRhcmdldCIsInByb21pc2VBamF4IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbmZpZ3VyYXRpb24iLCJkaXNwYXRjaEV2ZW50IiwibW9kZWwiLCJ0YWJJZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsIm1vZGVsSWQiLCJ0YWIiLCJjb25mIiwiZ2VuZXJhdGVSZXN1bHRzIiwiZXhwZXJpbWVudElkIiwiY291bnQiLCJtYWduaWZpY2F0aW9uIiwicmVzdWx0cyIsInNpbXVsYXRpb24iLCJkaXNwbGF5IiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0dWRlbnRJZCIsIm5hbWUiLCJsYWIiLCJjb250ZW50VHlwZSIsImVyciIsImV1Z2xlbmFNb2RlbElkIiwiaGlkZSIsImNsZWFyIiwiZ2V0TW9kZWxSZXN1bHRzIiwicGhhc2UiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxZQUFZSixRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUssUUFBUUwsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFTSxPQUFPTixRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BSUVPLG1CQUFtQlAsUUFBUSxpQkFBUixDQUpyQjtBQUFBLE1BS0VRLFlBQVlSLFFBQVEsY0FBUixDQUxkO0FBQUEsTUFNRVMsV0FBV1QsUUFBUSxrQkFBUixDQU5iO0FBQUEsTUFPRVUsV0FBV1YsUUFBUSxlQUFSLENBUGI7O0FBTGtCLE1BY1pXLFFBZFk7QUFBQTs7QUFlaEIsd0JBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QlIsS0FBN0M7QUFDQU8sZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQlIsSUFBM0M7O0FBRnlCLHNIQUduQk0sUUFIbUI7O0FBSXpCVixZQUFNYSxXQUFOLFFB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QUNsRzFFLGtCQUFRbUIsR0FBUixDQUFZLE9BQVosRUFBcUIwQyxhQUFyQixDQUFtQywwQkFBbkMsRUFBK0Q7QUFDN0RsQixrQkFBTStCO0FBRHVELFdBQS9EO0FBR0QsU0FKRDtBQUtBMUUsZ0JBQVFtQixHQUFSLENBQVksUUFBWixFQUFzQjZDLEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxXQURrQjtBQUV4QkMsb0JBQVUsT0FGYztBQUd4QnZCLGdCQUFNO0FBQ0p3QixxQkFBUyxLQUFLcEQsUUFBTCxDQUFjdUMsTUFBZCxHQUF1Qkg7QUFENUI7QUFIa0IsU0FBMUI7QUFPRDtBQXZSZTtBQUFBO0FBQUEsb0NBeVJGVCxHQXpSRSxFQXlSRztBQUNqQixhQUFLaEIsZUFBTCxDQUFxQmdCLEdBQXJCO0FBQ0Q7QUEzUmU7QUFBQTtBQUFBLHFDQTZSREEsR0E3UkMsRUE2Ukk7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTZ0QsS0FBVCxJQUFrQixPQUF0QixFQUErQjtBQUM3QixlQUFLNUUsUUFBTCxDQUFjbUMsTUFBZCxDQUFxQixFQUFFQyxrQkFBa0IsTUFBcEIsRUFBckI7QUFDRDtBQUNGO0FBalNlOztBQUFBO0FBQUEsSUFjS2hELFNBZEw7O0FBb1NsQk8sV0FBU00sTUFBVCxHQUFrQixVQUFDMkIsSUFBRCxFQUFVO0FBQzFCLFdBQU8sSUFBSWpDLFFBQUosQ0FBYSxFQUFFa0YsV0FBV2pELElBQWIsRUFBYixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPakMsUUFBUDtBQUVELENBMVNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
