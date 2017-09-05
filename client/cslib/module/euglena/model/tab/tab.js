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

      _this._setModelModality();

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
              if (hist.length && Globals.get('AppConfig.system.modelModality') == 'create') {
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
        console.log(id);
        console.log(oldId);
        console.log(target);
        if (oldId != target) {
          console.log('stage1');
          if (id != '_new') {
            console.log('stage2');
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
            console.log('stage3');
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
          console.log('stage4');
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
    }, {
      key: '_setModelModality',
      value: function _setModelModality() {
        if (Globals.get('AppConfig.system.modelModality')) {
          switch (Globals.get('AppConfig.system.modelModality').toLowerCase()) {
            case "observe":
              this._form.hideFields();
              this._history.hideFields();
              break;
            case "explore":
              this._form.disableFields();
              this._history.disableFields();
              break;
          }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxIaXN0b3J5Rm9ybSIsIk1vZGVsRm9ybSIsIk5hbWVGb3JtIiwiRXVnVXRpbHMiLCJNb2RlbFRhYiIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2hpc3RvcnkiLCJjcmVhdGUiLCJpZCIsIl9tb2RlbCIsImdldCIsIm1vZGVsVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlIiwiX3NpbGVuY2VMb2FkTG9ncyIsIl9mb3JtIiwiZmllbGRDb25maWciLCJldWdsZW5hQ291bnRDb25maWciLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uU2ltdWxhdGVSZXF1ZXN0IiwiX29uU2F2ZVJlcXVlc3QiLCJfb25BZ2dyZWdhdGVSZXF1ZXN0IiwiX29uTmV3UmVxdWVzdCIsIl9uYW1lRm9ybSIsIl9vbk5hbWVTdWJtaXQiLCJfb25OYW1lQ2FuY2VsIiwiYWRkQ2hpbGQiLCJfc2V0TW9kZWxNb2RhbGl0eSIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25QaGFzZUNoYW5nZSIsIl9jdXJyTW9kZWxJZCIsIl9jdXJyZW50TW9kZWwiLCJoaXN0b3J5Q291bnQiLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsInRoZW4iLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsIm1vZGVsX2hpc3RvcnlfaWQiLCJzZXRTdGF0ZSIsIl9sb2FkTW9kZWxJbkZvcm0iLCJleHBvcnQiLCJjdXJyZW50VGFyZ2V0IiwiX2xhc3RTaW1TYXZlZCIsIm9sZElkIiwidGFyZ2V0IiwiY29uc29sZSIsImxvZyIsInByb21pc2VBamF4IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbmZpZ3VyYXRpb24iLCJkaXNwYXRjaEV2ZW50IiwibW9kZWwiLCJ0YWJJZCIsInNpbXVsYXRlZCIsInR5cGUiLCJjYXRlZ29yeSIsIm1vZGVsSWQiLCJ0YWIiLCJjb25mIiwiX3NhdmVNb2RlbCIsIm5hbWUiLCJkaXNwbGF5Iiwic3R1ZGVudElkIiwibGFiIiwic2F2ZU9yVXBkYXRlIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnRlbnRUeXBlIiwic2VydmVyRGF0YSIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsImhpZGUiLCJjbGVhciIsImdldE1vZGVsUmVzdWx0cyIsInJlc3VsdHMiLCJwaGFzZSIsInRvTG93ZXJDYXNlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxZQUFZSixRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUssUUFBUUwsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFTSxPQUFPTixRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BSUVPLG1CQUFtQlAsUUFBUSxpQkFBUixDQUpyQjtBQUFBLE1BS0VRLFlBQVlSLFFBQVEsY0FBUixDQUxkO0FBQUEsTUFNRVMsV0FBV1QsUUFBUSxrQkFBUixDQU5iO0FBQUEsTUFPRVUsV0FBV1YsUUFBUSxlQUFSLENBUGI7O0FBTGtCLE1BY1pXLFFBZFk7QUFBQTs7QUFlaEIsd0JBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QlIsS0FBN0M7QUFDQU8sZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQlIsSUFB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b1RsQk8sV0FBU00sTUFBVCxHQUFrQixVQUFDNEIsSUFBRCxFQUFVO0FBQzFCLFdBQU8sSUFBSWxDLFFBQUosQ0FBYSxFQUFFcUYsV0FBV25ELElBQWIsRUFBYixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPbEMsUUFBUDtBQUVELENBMVREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcblxuICAgIE1vZGVsSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBNb2RlbEZvcm0gPSByZXF1aXJlKCcuLi9mb3JtL2Zvcm0nKSxcbiAgICBOYW1lRm9ybSA9IHJlcXVpcmUoJy4uL25hbWVmb3JtL2Zvcm0nKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKTtcblxuICBjbGFzcyBNb2RlbFRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vblNpbXVsYXRlUmVxdWVzdCcsICdfb25TYXZlUmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19vbk5hbWVDYW5jZWwnLCAnX29uTmFtZVN1Ym1pdCcsICdfb25HbG9iYWxzQ2hhbmdlJywgJ19sb2FkTW9kZWxJbkZvcm0nLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3UmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZSdcbiAgICAgIF0pO1xuXG4gICAgICB0aGlzLl9oaXN0b3J5ID0gTW9kZWxIaXN0b3J5Rm9ybS5jcmVhdGUoe1xuICAgICAgICBpZDogYG1vZGVsX2hpc3RvcnlfXyR7dGhpcy5fbW9kZWwuZ2V0KFwiaWRcIil9YCxcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX2Zvcm0gPSBNb2RlbEZvcm0uY3JlYXRlKHtcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICBmaWVsZENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJyksXG4gICAgICAgIGV1Z2xlbmFDb3VudENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdldWdsZW5hQ291bnQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2ltdWxhdGUnLCB0aGlzLl9vblNpbXVsYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2F2ZScsIHRoaXMuX29uU2F2ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdSZXF1ZXN0KTtcblxuICAgICAgdGhpcy5fbmFtZUZvcm0gPSBOYW1lRm9ybS5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuU3VibWl0JywgdGhpcy5fb25OYW1lU3VibWl0KTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuQ2FuY2VsJywgdGhpcy5fb25OYW1lQ2FuY2VsKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2Zvcm0udmlldygpKTtcblxuICAgICAgdGhpcy5fc2V0TW9kZWxNb2RhbGl0eSgpO1xuXG4gICAgICBHbG9iYWxzLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uR2xvYmFsc0NoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG5cbiAgICBjdXJyTW9kZWxJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyTW9kZWxJZDtcbiAgICB9XG5cbiAgICBjdXJyTW9kZWwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3VycmVudE1vZGVsO1xuICAgIH1cblxuICAgIGNvbG9yKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnY29sb3InKVxuICAgIH1cblxuICAgIGhpc3RvcnlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5Lmhpc3RvcnlDb3VudCgpO1xuICAgIH1cblxuICAgIF9vbkdsb2JhbHNDaGFuZ2UoZXZ0KSB7XG4gICAgICBzd2l0Y2goZXZ0LmRhdGEucGF0aCkge1xuICAgICAgICBjYXNlICdzdHVkZW50X2lkJzpcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgICBpZiAoaGlzdC5sZW5ndGggJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpPT0nY3JlYXRlJykge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IGhpc3RbaGlzdC5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTtcbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9sb2FkTW9kZWxJbkZvcm0oaWQpIHtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGxldCBvbGRJZCA9IHRoaXMuX2N1cnJNb2RlbElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGNvbnNvbGUubG9nKGlkKTtcbiAgICAgIGNvbnNvbGUubG9nKG9sZElkKTtcbiAgICAgIGNvbnNvbGUubG9nKHRhcmdldCk7XG4gICAgICBpZiAob2xkSWQgIT0gdGFyZ2V0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFnZTEnKTtcbiAgICAgICAgaWYgKGlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGFnZTInKTtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHtpZH1gKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9mb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBkYXRhO1xuICAgICAgICAgICAgdGhpcy5fZm9ybS5pbXBvcnQoZGF0YS5jb25maWd1cmF0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKVxuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBkYXRhLFxuICAgICAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ2hpc3RvcmljYWwnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0YWdlMycpO1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICBpZDogJ19uZXcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9zaWxlbmNlTG9hZExvZ3MpIHtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibG9hZFwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWxJZDogaWQsXG4gICAgICAgICAgICAgIHRhYjogdGhpcy5pZCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sYXN0U2ltU2F2ZWQgJiYgdGhpcy5fbGFzdFNpbVNhdmVkLmlkID09IG9sZElkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFnZTQnKTtcbiAgICAgICAgLy8gaGFuZGxlIFwicmVydW5uaW5nXCIgYSBzaW11bGF0aW9uXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgbW9kZWw6IHRoaXMuX2xhc3RTaW1TYXZlZCxcbiAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uU2ltdWxhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgY29uc3QgY29uZiA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG5cbiAgICAgIHRoaXMuX3NhdmVNb2RlbCh7XG4gICAgICAgIG5hbWU6IFwiKHNpbXVsYXRpb24pXCIsXG4gICAgICAgIHNpbXVsYXRlZDogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhdGlvbjogY29uZlxuICAgICAgfSkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICB9KVxuXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzaW11bGF0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25TYXZlUmVxdWVzdChldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuZGlzcGxheSh0aGlzLl9uYW1lRm9ybS52aWV3KCkpXG4gICAgfVxuXG4gICAgX3NhdmVNb2RlbChkYXRhKSB7XG4gICAgICBkYXRhLnN0dWRlbnRJZCA9IEdsb2JhbHMuZ2V0KCdzdHVkZW50X2lkJyk7XG4gICAgICBkYXRhLm1vZGVsVHlwZSA9IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyk7XG4gICAgICBkYXRhLmxhYiA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJyk7XG5cbiAgICAgIGxldCBzYXZlT3JVcGRhdGU7XG4gICAgICBpZiAodGhpcy5fbGFzdFNpbVNhdmVkKSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHt0aGlzLl9sYXN0U2ltU2F2ZWQuaWR9YCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BBVENIJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICAgICAgICBzaW11bGF0ZWQ6IGRhdGEuc2ltdWxhdGVkXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2F2ZU9yVXBkYXRlID0gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXVnbGVuYU1vZGVscycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gc2F2ZU9yVXBkYXRlLnRoZW4oKHNlcnZlckRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuc2ltdWxhdGVkKSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gc2VydmVyRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VydmVyRGF0YSkgcmV0dXJuO1xuICAgICAgICByZXR1cm4gc2VydmVyRGF0YTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZVN1Ym1pdChldnQpIHtcbiAgICAgIGxldCBtb2RlbDtcblxuICAgICAgdGhpcy5fbmFtZUZvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zYXZlTW9kZWwoe1xuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWUsXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fZm9ybS5leHBvcnQoKSxcbiAgICAgICAgICBzaW11bGF0ZWQ6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICB9KS50aGVuKChtb2RlbCkgPT4ge1xuICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IG1vZGVsLmlkXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzYXZlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9mb3JtLmV4cG9ydCgpLFxuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZUNhbmNlbChldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfb25BZ2dyZWdhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudC5pZCcpLCB0aGlzLl9jdXJyZW50TW9kZWwpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5BZGRSZXF1ZXN0Jywge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdHNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJhZ2dyZWdhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsSWQ6IHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5ld1JlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9vbkNvbmZpZ0NoYW5nZShldnQpO1xuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgbW9kZWxfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRNb2RlbE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSkge1xuICAgICAgICBzd2l0Y2goR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsVGFiLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbFRhYih7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbFRhYjtcblxufSlcbiJdfQ==
