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
      _this._silenceLoadLogs = false;

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
      key: 'historyCount',
      value: function historyCount() {
        return this._history.historyCount();
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
        this._lastSimSaved = null;
        if (this._history.export().model_history_id != '_new') {
          this._history.import({ model_history_id: '_new' });
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
              if (data.simulated) {
                _this3._form.setState('new');
              } else {
                _this3._form.setState('historical');
              }
            });
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
          if (!this._silenceLoadLogs) {
            Globals.get('Logger').log({
              type: "load",
              category: "model",
              data: {
                modelId: id,
                tab: this.id()
              }
            });
          }
        } else if (this._lastSimSaved && this._lastSimSaved.id == oldId) {
          // handle "rerunning" a simulation
          Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
            model: this._lastSimSaved,
            tabId: this._model.get('id')
          });
        }
      }
    }, {
      key: '_onSimulateRequest',
      value: function _onSimulateRequest(evt) {
        var _this4 = this;

        var conf = this._form.export();

        this._saveModel({
          name: "(simulation)",
          simulated: true,
          configuration: conf
        }).then(function (model) {
          _this4._silenceLoadLogs = true;
          _this4._loadModelInForm(model.id);
          _this4._silenceLoadLogs = false;
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
      key: '_saveModel',
      value: function _saveModel(data) {
        var _this5 = this;

        data.studentId = Globals.get('student_id');
        data.modelType = this._model.get('modelType');
        data.lab = Globals.get('AppConfig.lab');

        var saveOrUpdate = void 0;
        if (this._lastSimSaved) {
          saveOrUpdate = Utils.promiseAjax('/api/v1/EuglenaModels/' + this._lastSimSaved.id, {
            method: 'PATCH',
            data: JSON.stringify({
              name: data.name,
              simulated: data.simulated
            }),
            contentType: 'application/json'
          });
        } else {
          saveOrUpdate = Utils.promiseAjax('/api/v1/EuglenaModels', {
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json'
          });
        }
        return saveOrUpdate.then(function (serverData) {
          if (data.simulated) {
            _this5._lastSimSaved = serverData;
          } else {
            _this5._lastSimSaved = null;
          }
          if (!serverData) return;
          return serverData;
        });
      }
    }, {
      key: '_onNameSubmit',
      value: function _onNameSubmit(evt) {
        var _this6 = this;

        var model = void 0;

        this._nameForm.validate().then(function (validation) {
          return _this6._saveModel({
            name: _this6._nameForm.export().name,
            configuration: _this6._form.export(),
            simulated: false
          });
        }).then(function (model) {
          _this6._lastSimSaved = null;
          Globals.get('InteractiveModal').hide().then(function () {
            _this6._nameForm.clear();
          });
          _this6._silenceLoadLogs = true;
          _this6._history.update().then(function () {
            _this6._silenceLoadLogs = false;
            _this6._history.import({
              model_history_id: model.id
            });
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
        var _this7 = this;

        Globals.get('InteractiveModal').hide().then(function () {
          _this7._nameForm.clear();
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
        if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxIaXN0b3J5Rm9ybSIsIk1vZGVsRm9ybSIsIk5hbWVGb3JtIiwiRXVnVXRpbHMiLCJNb2RlbFRhYiIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2hpc3RvcnkiLCJjcmVhdGUiLCJpZCIsIl9tb2RlbCIsImdldCIsIm1vZGVsVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlIiwiX3NpbGVuY2VMb2FkTG9ncyIsIl9mb3JtIiwiZmllbGRDb25maWciLCJldWdsZW5hQ291bnRDb25maWciLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uU2ltdWxhdGVSZXF1ZXN0IiwiX29uU2F2ZVJlcXVlc3QiLCJfb25BZ2dyZWdhdGVSZXF1ZXN0IiwiX29uTmV3UmVxdWVzdCIsIl9uYW1lRm9ybSIsIl9vbk5hbWVTdWJtaXQiLCJfb25OYW1lQ2FuY2VsIiwiYWRkQ2hpbGQiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uUGhhc2VDaGFuZ2UiLCJfY3Vyck1vZGVsSWQiLCJfY3VycmVudE1vZGVsIiwiaGlzdG9yeUNvdW50IiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJ0aGVuIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJtb2RlbF9oaXN0b3J5X2lkIiwic2V0U3RhdGUiLCJfbG9hZE1vZGVsSW5Gb3JtIiwiZXhwb3J0IiwiY3VycmVudFRhcmdldCIsIl9sYXN0U2ltU2F2ZWQiLCJvbGRJZCIsInRhcmdldCIsInByb21pc2VBamF4IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbmZpZ3VyYXRpb24iLCJkaXNwYXRjaEV2ZW50IiwibW9kZWwiLCJ0YWJJZCIsInNpbXVsYXRlZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsIm1vZGVsSWQiLCJ0YWIiLCJjb25mIiwiX3NhdmVNb2RlbCIsIm5hbWUiLCJkaXNwbGF5Iiwic3R1ZGVudElkIiwibGFiIiwic2F2ZU9yVXBkYXRlIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnRlbnRUeXBlIiwic2VydmVyRGF0YSIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsImhpZGUiLCJjbGVhciIsImdldE1vZGVsUmVzdWx0cyIsInJlc3VsdHMiLCJwaGFzZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFSyxRQUFRTCxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVNLE9BQU9OLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRU8sbUJBQW1CUCxRQUFRLGlCQUFSLENBSnJCO0FBQUEsTUFLRVEsWUFBWVIsUUFBUSxjQUFSLENBTGQ7QUFBQSxNQU1FUyxXQUFXVCxRQUFRLGtCQUFSLENBTmI7QUFBQSxNQU9FVSxXQUFXVixRQUFRLGVBQVIsQ0FQYjs7QUFMa0IsTUFjWlcsUUFkWTtBQUFBOztBQWVoQix3QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCUixLQUE3QztBQUNBTyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCUixJQUEzQzs7QUFGeUIsc0hBR25CTSxRQUhtQjs7QUFJekJWLFlBQU1hLFdBQU4sUUFBd0IsQ0FDdEIsb0JBRHNCLEVBQ0EsZ0JBREEs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QUFMLENBQXFCZSxHQUFyQjtBQUNEO0FBbFJlO0FBQUE7QUFBQSxxQ0FvUkRBLEdBcFJDLEVBb1JJO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBUzhDLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkIvQyxJQUFJQyxJQUFKLENBQVM4QyxLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLMUUsUUFBTCxDQUFjbUMsTUFBZCxDQUFxQixFQUFFQyxrQkFBa0IsTUFBcEIsRUFBckI7QUFDRDtBQUNGO0FBeFJlOztBQUFBO0FBQUEsSUFjS2hELFNBZEw7O0FBMlJsQk8sV0FBU00sTUFBVCxHQUFrQixVQUFDMkIsSUFBRCxFQUFVO0FBQzFCLFdBQU8sSUFBSWpDLFFBQUosQ0FBYSxFQUFFZ0YsV0FBVy9DLElBQWIsRUFBYixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPakMsUUFBUDtBQUVELENBalNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcblxuICAgIE1vZGVsSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBNb2RlbEZvcm0gPSByZXF1aXJlKCcuLi9mb3JtL2Zvcm0nKSxcbiAgICBOYW1lRm9ybSA9IHJlcXVpcmUoJy4uL25hbWVmb3JtL2Zvcm0nKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKTtcblxuICBjbGFzcyBNb2RlbFRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vblNpbXVsYXRlUmVxdWVzdCcsICdfb25TYXZlUmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19vbk5hbWVDYW5jZWwnLCAnX29uTmFtZVN1Ym1pdCcsICdfb25HbG9iYWxzQ2hhbmdlJywgJ19sb2FkTW9kZWxJbkZvcm0nLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3UmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZSdcbiAgICAgIF0pO1xuXG4gICAgICB0aGlzLl9oaXN0b3J5ID0gTW9kZWxIaXN0b3J5Rm9ybS5jcmVhdGUoe1xuICAgICAgICBpZDogYG1vZGVsX2hpc3RvcnlfXyR7dGhpcy5fbW9kZWwuZ2V0KFwiaWRcIil9YCxcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX2Zvcm0gPSBNb2RlbEZvcm0uY3JlYXRlKHtcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICBmaWVsZENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJyksXG4gICAgICAgIGV1Z2xlbmFDb3VudENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdldWdsZW5hQ291bnQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2ltdWxhdGUnLCB0aGlzLl9vblNpbXVsYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2F2ZScsIHRoaXMuX29uU2F2ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdSZXF1ZXN0KTtcblxuICAgICAgdGhpcy5fbmFtZUZvcm0gPSBOYW1lRm9ybS5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuU3VibWl0JywgdGhpcy5fb25OYW1lU3VibWl0KTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuQ2FuY2VsJywgdGhpcy5fb25OYW1lQ2FuY2VsKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2Zvcm0udmlldygpKTtcblxuICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsSWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3Vyck1vZGVsSWQ7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRNb2RlbDtcbiAgICB9XG5cbiAgICBjb2xvcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2NvbG9yJylcbiAgICB9XG5cbiAgICBoaXN0b3J5Q291bnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5oaXN0b3J5Q291bnQoKTtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSAnc3R1ZGVudF9pZCc6XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKVxuICAgICAgICAgICAgaWYgKGhpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0odGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTtcbiAgICAgICAgICB9KVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKGV2dC5jdXJyZW50VGFyZ2V0LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWQpO1xuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICBpZiAodGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xvYWRNb2RlbEluRm9ybShpZCkge1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgbGV0IG9sZElkID0gdGhpcy5fY3Vyck1vZGVsSWQ7XG4gICAgICBsZXQgdGFyZ2V0ID0gaWQgPT0gJ19uZXcnID8gbnVsbCA6IGlkO1xuICAgICAgaWYgKG9sZElkICE9IHRhcmdldCkge1xuICAgICAgICBpZiAoaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgICAgdGhpcy5fY3Vyck1vZGVsSWQgPSBpZDtcbiAgICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7aWR9YCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZm9ybS5yZW1vdmVFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKVxuICAgICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gZGF0YTtcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0uaW1wb3J0KGRhdGEuY29uZmlndXJhdGlvbikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgICBtb2RlbDogZGF0YSxcbiAgICAgICAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGRhdGEuc2ltdWxhdGVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICBpZDogJ19uZXcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9zaWxlbmNlTG9hZExvZ3MpIHtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibG9hZFwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWxJZDogaWQsXG4gICAgICAgICAgICAgIHRhYjogdGhpcy5pZCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sYXN0U2ltU2F2ZWQgJiYgdGhpcy5fbGFzdFNpbVNhdmVkLmlkID09IG9sZElkKSB7XG4gICAgICAgIC8vIGhhbmRsZSBcInJlcnVubmluZ1wiIGEgc2ltdWxhdGlvblxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgIG1vZGVsOiB0aGlzLl9sYXN0U2ltU2F2ZWQsXG4gICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblNpbXVsYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIGNvbnN0IGNvbmYgPSB0aGlzLl9mb3JtLmV4cG9ydCgpO1xuXG4gICAgICB0aGlzLl9zYXZlTW9kZWwoe1xuICAgICAgICBuYW1lOiBcIihzaW11bGF0aW9uKVwiLFxuICAgICAgICBzaW11bGF0ZWQ6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZcbiAgICAgIH0pLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybShtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgfSlcblxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2ltdWxhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBjb25mXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uU2F2ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmRpc3BsYXkodGhpcy5fbmFtZUZvcm0udmlldygpKVxuICAgIH1cblxuICAgIF9zYXZlTW9kZWwoZGF0YSkge1xuICAgICAgZGF0YS5zdHVkZW50SWQgPSBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpO1xuICAgICAgZGF0YS5tb2RlbFR5cGUgPSB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpO1xuICAgICAgZGF0YS5sYWIgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpO1xuXG4gICAgICBsZXQgc2F2ZU9yVXBkYXRlO1xuICAgICAgaWYgKHRoaXMuX2xhc3RTaW1TYXZlZCkge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7dGhpcy5fbGFzdFNpbVNhdmVkLmlkfWAsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgICAgICAgc2ltdWxhdGVkOiBkYXRhLnNpbXVsYXRlZFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V1Z2xlbmFNb2RlbHMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNhdmVPclVwZGF0ZS50aGVuKChzZXJ2ZXJEYXRhKSA9PiB7XG4gICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IHNlcnZlckRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlcnZlckRhdGEpIHJldHVybjtcbiAgICAgICAgcmV0dXJuIHNlcnZlckRhdGE7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVTdWJtaXQoZXZ0KSB7XG4gICAgICBsZXQgbW9kZWw7XG5cbiAgICAgIHRoaXMuX25hbWVGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2F2ZU1vZGVsKHtcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2Zvcm0uZXhwb3J0KCksXG4gICAgICAgICAgc2ltdWxhdGVkOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgfSkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbmFtZUZvcm0uY2xlYXIoKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBtb2RlbC5pZFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2F2ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fZm9ybS5leHBvcnQoKSxcbiAgICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgICAgbmFtZTogdGhpcy5fbmFtZUZvcm0uZXhwb3J0KCkubmFtZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVDYW5jZWwoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fbmFtZUZvcm0uY2xlYXIoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX29uQWdncmVnYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIEV1Z1V0aWxzLmdldE1vZGVsUmVzdWx0cyhHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQuaWQnKSwgdGhpcy5fY3VycmVudE1vZGVsKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuQWRkUmVxdWVzdCcsIHtcbiAgICAgICAgICBkYXRhOiByZXN1bHRzXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwiYWdncmVnYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlbElkOiB0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OZXdSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fb25Db25maWdDaGFuZ2UoZXZ0KTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBNb2RlbFRhYi5jcmVhdGUgPSAoZGF0YSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxUYWIoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gTW9kZWxUYWI7XG5cbn0pXG4iXX0=
