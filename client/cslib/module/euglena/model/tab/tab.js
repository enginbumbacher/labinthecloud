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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxIaXN0b3J5Rm9ybSIsIk1vZGVsRm9ybSIsIk5hbWVGb3JtIiwiRXVnVXRpbHMiLCJNb2RlbFRhYiIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2hpc3RvcnkiLCJjcmVhdGUiLCJpZCIsIl9tb2RlbCIsImdldCIsIm1vZGVsVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlIiwiX3NpbGVuY2VMb2FkTG9ncyIsIl9mb3JtIiwiZmllbGRDb25maWciLCJldWdsZW5hQ291bnRDb25maWciLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uU2ltdWxhdGVSZXF1ZXN0IiwiX29uU2F2ZVJlcXVlc3QiLCJfb25BZ2dyZWdhdGVSZXF1ZXN0IiwiX29uTmV3UmVxdWVzdCIsIl9uYW1lRm9ybSIsIl9vbk5hbWVTdWJtaXQiLCJfb25OYW1lQ2FuY2VsIiwiYWRkQ2hpbGQiLCJfc2V0TW9kZWxNb2RhbGl0eSIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25QaGFzZUNoYW5nZSIsIl9jdXJyTW9kZWxJZCIsIl9jdXJyZW50TW9kZWwiLCJoaXN0b3J5Q291bnQiLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsInRoZW4iLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsIm1vZGVsX2hpc3RvcnlfaWQiLCJzZXRTdGF0ZSIsIl9sb2FkTW9kZWxJbkZvcm0iLCJleHBvcnQiLCJjdXJyZW50VGFyZ2V0IiwiX2xhc3RTaW1TYXZlZCIsIm9sZElkIiwidGFyZ2V0IiwicHJvbWlzZUFqYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY29uZmlndXJhdGlvbiIsImRpc3BhdGNoRXZlbnQiLCJtb2RlbCIsInRhYklkIiwic2ltdWxhdGVkIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwibW9kZWxJZCIsInRhYiIsImNvbmYiLCJfc2F2ZU1vZGVsIiwibmFtZSIsImRpc3BsYXkiLCJzdHVkZW50SWQiLCJsYWIiLCJzYXZlT3JVcGRhdGUiLCJtZXRob2QiLCJKU09OIiwic3RyaW5naWZ5IiwiY29udGVudFR5cGUiLCJzZXJ2ZXJEYXRhIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwiaGlkZSIsImNsZWFyIiwiZ2V0TW9kZWxSZXN1bHRzIiwicmVzdWx0cyIsInBoYXNlIiwidG9Mb3dlckNhc2UiLCJoaWRlRmllbGRzIiwiZGlzYWJsZUZpZWxkcyIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFSyxRQUFRTCxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVNLE9BQU9OLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRU8sbUJBQW1CUCxRQUFRLGlCQUFSLENBSnJCO0FBQUEsTUFLRVEsWUFBWVIsUUFBUSxjQUFSLENBTGQ7QUFBQSxNQU1FUyxXQUFXVCxRQUFRLGtCQUFSLENBTmI7QUFBQSxNQU9FVSxXQUFXVixRQUFRLGVBQVIsQ0FQYjs7QUFMa0IsTUFjWlcsUUFkWTtBQUFBOztBQWVoQix3QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCUixLQUE3QztBQUNBTyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCUixJQUEzQzs7QUFGeUIsc0hBR25CTSxRQUhtQjs7QUFJekJWLFlBQU1hLFdBQU4sUUFBd0IsQ0FDdEIsb0JBRHNCLEVBQ0EsZ0JBREEsRUFDa0IscUJBRGxCLEVBRXRCLGVBRnNCLEVBRUwsZUFGSyxFQUVZLGtCQUZaLEVBRWdDLGtCQUZoQyxFQUd0QiwyQkFIc0IsRUFHTyxpQkFIUCxFQUcwQixlQUgxQixFQUcyQyxnQkFIM0MsQ0FBeEI7O0FBTUEsWUFBS0MsUUFBTCxHQUFnQlQsaUJBQWlCVSxNQUFqQixDQUF3QjtBQUN0Q0MsZ0NBQXNCLE1BQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQixDQURnQjtBQUV0Q0MsbUJBQVcsTUFBS0YsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFdBQWhCO0FBRjJCLE9BQXhCLENBQWhCO0FBSUEsWUFBS0osUUFBTCxDQUFjTSxnQkFBZCxDQUErQixtQkFBL0IsRUFBb0QsTUFBS0MseUJBQXpEO0FBQ0EsWUFBS0MsZ0JBQUwsR0FBd0IsS0FBeEI7O0FBRUEsWUFBS0MsS0FBTCxHQUFhakIsVUFBVVMsTUFBVixDQUFpQjtBQUM1QkksbUJBQVcsTUFBS0YsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFdBQWhCLENBRGlCO0FBRTVCTSxxQkFBYSxNQUFLUCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsWUFBaEIsQ0FGZTtBQUc1Qk8sNEJBQW9CLE1BQUtSLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixjQUFoQjtBQUhRLE9BQWpCLENBQWI7QUFLQSxZQUFLSyxLQUFMLENBQVdILGdCQUFYLENBQTRCLG1CQUE1QixFQUFpRCxNQUFLTSxlQUF0RDtBQUNBLFlBQUtILEtBQUwsQ0FBV0ksSUFBWCxHQUFrQlAsZ0JBQWxCLENBQW1DLG9CQUFuQyxFQUF5RCxNQUFLUSxrQkFBOUQ7QUFDQSxZQUFLTCxLQUFMLENBQVdJLElBQVgsR0FBa0JQLGdCQUFsQixDQUFtQyxnQkFBbkMsRUFBcUQsTUFBS1MsY0FBMUQ7QUFDQSxZQUFLTixLQUFMLENBQVdJLElBQVgsR0FBa0JQLGdCQUFsQixDQUFtQywwQkFBbkMsRUFBK0QsTUFBS1UsbUJBQXBFO0FBQ0EsWUFBS1AsS0FBTCxDQUFXSSxJQUFYLEdBQWtCUCxnQkFBbEIsQ0FBbUMsc0JBQW5DLEVBQTJELE1BQUtXLGFBQWhFOztBQUVBLFlBQUtDLFNBQUwsR0FBaUJ6QixTQUFTUSxNQUFULEVBQWpCO0FBQ0EsWUFBS2lCLFNBQUwsQ0FBZUwsSUFBZixHQUFzQlAsZ0JBQXRCLENBQXVDLGtCQUF2QyxFQUEyRCxNQUFLYSxhQUFoRTtBQUNBLFlBQUtELFNBQUwsQ0FBZUwsSUFBZixHQUFzQlAsZ0JBQXRCLENBQXVDLGtCQUF2QyxFQUEyRCxNQUFLYyxhQUFoRTtBQUNBLFlBQUtQLElBQUwsR0FBWVEsUUFBWixDQUFxQixNQUFLckIsUUFBTCxDQUFjYSxJQUFkLEVBQXJCO0FBQ0EsWUFBS0EsSUFBTCxHQUFZUSxRQUFaLENBQXFCLE1BQUtaLEtBQUwsQ0FBV0ksSUFBWCxFQUFyQjs7QUFFQSxZQUFLUyxpQkFBTDs7QUFFQXJDLGNBQVFxQixnQkFBUixDQUF5QixjQUF6QixFQUF5QyxNQUFLaUIsZ0JBQTlDO0FBQ0F0QyxjQUFRbUIsR0FBUixDQUFZLE9BQVosRUFBcUJFLGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBS2tCLGNBQTlEO0FBckN5QjtBQXNDMUI7O0FBckRlO0FBQUE7QUFBQSwyQkF1RFg7QUFDSCxlQUFPLEtBQUtyQixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBekRlO0FBQUE7QUFBQSxvQ0EyREY7QUFDWixlQUFPLEtBQUtxQixZQUFaO0FBQ0Q7QUE3RGU7QUFBQTtBQUFBLGtDQStESjtBQUNWLGVBQU8sS0FBS0MsYUFBWjtBQUNEO0FBakVlO0FBQUE7QUFBQSw4QkFtRVI7QUFDTixlQUFPLEtBQUt2QixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBUDtBQUNEO0FBckVlO0FBQUE7QUFBQSxxQ0F1RUQ7QUFDYixlQUFPLEtBQUtKLFFBQUwsQ0FBYzJCLFlBQWQsRUFBUDtBQUNEO0FBekVlO0FBQUE7QUFBQSx1Q0EyRUNDLEdBM0VELEVBMkVNO0FBQUE7O0FBQ3BCLGdCQUFPQSxJQUFJQyxJQUFKLENBQVNDLElBQWhCO0FBQ0UsZUFBSyxZQUFMO0FBQ0UsaUJBQUs5QixRQUFMLENBQWMrQixNQUFkLEdBQXVCQyxJQUF2QixDQUE0QixZQUFNO0FBQ2hDLGtCQUFNQyxPQUFPLE9BQUtqQyxRQUFMLENBQWNrQyxVQUFkLEVBQWI7QUFDQSxrQkFBSUQsS0FBS0UsTUFBTCxJQUFlbEQsUUFBUW1CLEdBQVIsQ0FBWSxnQ0FBWixLQUErQyxRQUFsRSxFQUE0RTtBQUMxRSx1QkFBTyxPQUFLSixRQUFMLENBQWNvQyxNQUFkLENBQXFCO0FBQzFCQyxvQ0FBa0JKLEtBQUtBLEtBQUtFLE1BQUwsR0FBYyxDQUFuQjtBQURRLGlCQUFyQixDQUFQO0FBR0QsZUFKRCxNQUlPO0FBQ0wsdUJBQUsxQixLQUFMLENBQVc2QixRQUFYLENBQW9CLEtBQXBCO0FBQ0EsdUJBQU8sSUFBUDtBQUNEO0FBQ0YsYUFWRCxFQVVHTixJQVZILENBVVEsWUFBTTtBQUNaLHFCQUFLTyxnQkFBTCxDQUFzQixPQUFLdkMsUUFBTCxDQUFjd0MsTUFBZCxHQUF1QkgsZ0JBQTdDO0FBQ0QsYUFaRDtBQWFGO0FBZkY7QUFpQkQ7QUE3RmU7QUFBQTtBQUFBLGdEQStGVVQsR0EvRlYsRUErRmU7QUFDN0IsYUFBS1csZ0JBQUwsQ0FBc0JYLElBQUlhLGFBQUosQ0FBa0JELE1BQWxCLEdBQTJCSCxnQkFBakQ7QUFDRDtBQWpHZTtBQUFBO0FBQUEsc0NBbUdBVCxHQW5HQSxFQW1HSztBQUNuQixhQUFLYyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsWUFBSSxLQUFLMUMsUUFBTCxDQUFjd0MsTUFBZCxHQUF1QkgsZ0JBQXZCLElBQTJDLE1BQS9DLEVBQXVEO0FBQ3JELGVBQUtyQyxRQUFMLENBQWNvQyxNQUFkLENBQXFCLEVBQUVDLGtCQUFrQixNQUFwQixFQUFyQjtBQUNBLGVBQUs1QixLQUFMLENBQVc2QixRQUFYLENBQW9CLEtBQXBCO0FBQ0Q7QUFDRjtBQXpHZTtBQUFBO0FBQUEsdUNBMkdDcEMsRUEzR0QsRUEyR0s7QUFBQTs7QUFDbkIsWUFBSSxDQUFDQSxFQUFMLEVBQVM7QUFDVCxZQUFJeUMsUUFBUSxLQUFLbEIsWUFBakI7QUFDQSxZQUFJbUIsU0FBUzFDLE1BQU0sTUFBTixHQUFlLElBQWYsR0FBc0JBLEVBQW5DO0FBQ0EsWUFBSXlDLFNBQVNDLE1BQWIsRUFBcUI7QUFDbkIsY0FBSTFDLE1BQU0sTUFBVixFQUFrQjtBQUNoQixpQkFBS3VCLFlBQUwsR0FBb0J2QixFQUFwQjtBQUNBaEIsa0JBQU0yRCxXQUFOLDRCQUEyQzNDLEVBQTNDLEVBQWlEOEIsSUFBakQsQ0FBc0QsVUFBQ0gsSUFBRCxFQUFVO0FBQzlELHFCQUFLcEIsS0FBTCxDQUFXcUMsbUJBQVgsQ0FBK0IsbUJBQS9CLEVBQW9ELE9BQUtsQyxlQUF6RDtBQUNBLHFCQUFLYyxhQUFMLEdBQXFCRyxJQUFyQjtBQUNBLHFCQUFLcEIsS0FBTCxDQUFXMkIsTUFBWCxDQUFrQlAsS0FBS2tCLGFBQXZCLEVBQXNDZixJQUF0QyxDQUEyQyxZQUFNO0FBQy9DLHVCQUFLdkIsS0FBTCxDQUFXSCxnQkFBWCxDQUE0QixtQkFBNUIsRUFBaUQsT0FBS00sZUFBdEQ7QUFDQTNCLHdCQUFRbUIsR0FBUixDQUFZLE9BQVosRUFBcUI0QyxhQUFyQixDQUFtQyxxQkFBbkMsRUFBMEQ7QUFDeERDLHlCQUFPcEIsSUFEaUQ7QUFFeERxQix5QkFBTyxPQUFLL0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLElBQWhCO0FBRmlELGlCQUExRDtBQUlELGVBTkQ7QUFPQSxrQkFBSXlCLEtBQUtzQixTQUFULEVBQW9CO0FBQ2xCLHVCQUFLMUMsS0FBTCxDQUFXNkIsUUFBWCxDQUFvQixLQUFwQjtBQUNELGVBRkQsTUFFTztBQUNMLHVCQUFLN0IsS0FBTCxDQUFXNkIsUUFBWCxDQUFvQixZQUFwQjtBQUNEO0FBQ0YsYUFmRDtBQWdCRCxXQWxCRCxNQWtCTztBQUNMLGlCQUFLYixZQUFMLEdBQW9CLElBQXBCO0FBQ0EsaUJBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQXpDLG9CQUFRbUIsR0FBUixDQUFZLE9BQVosRUFBcUI0QyxhQUFyQixDQUFtQyxxQkFBbkMsRUFBMEQ7QUFDeERDLHFCQUFPO0FBQ0wvQyxvQkFBSTtBQURDLGVBRGlEO0FBSXhEZ0QscUJBQU8sS0FBSy9DLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQjtBQUppRCxhQUExRDtBQU1BLGlCQUFLSyxLQUFMLENBQVc2QixRQUFYLENBQW9CLEtBQXBCO0FBQ0Q7QUFDRCxjQUFJLENBQUMsS0FBSzlCLGdCQUFWLEVBQTRCO0FBQzFCdkIsb0JBQVFtQixHQUFSLENBQVksUUFBWixFQUFzQmdELEdBQXRCLENBQTBCO0FBQ3hCQyxvQkFBTSxNQURrQjtBQUV4QkMsd0JBQVUsT0FGYztBQUd4QnpCLG9CQUFNO0FBQ0owQix5QkFBU3JELEVBREw7QUFFSnNELHFCQUFLLEtBQUt0RCxFQUFMO0FBRkQ7QUFIa0IsYUFBMUI7QUFRRDtBQUNGLFNBeENELE1Bd0NPLElBQUksS0FBS3dDLGFBQUwsSUFBc0IsS0FBS0EsYUFBTCxDQUFtQnhDLEVBQW5CLElBQXlCeUMsS0FBbkQsRUFBMEQ7QUFDL0Q7QUFDQTFELGtCQUFRbUIsR0FBUixDQUFZLE9BQVosRUFBcUI0QyxhQUFyQixDQUFtQyxxQkFBbkMsRUFBMEQ7QUFDeERDLG1CQUFPLEtBQUtQLGFBRDRDO0FBRXhEUSxtQkFBTyxLQUFLL0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLElBQWhCO0FBRmlELFdBQTFEO0FBSUQ7QUFDRjtBQTlKZTtBQUFBO0FBQUEseUNBZ0tHd0IsR0FoS0gsRUFnS1E7QUFBQTs7QUFDdEIsWUFBTTZCLE9BQU8sS0FBS2hELEtBQUwsQ0FBVytCLE1BQVgsRUFBYjs7QUFFQSxhQUFLa0IsVUFBTCxDQUFnQjtBQUNkQyxnQkFBTSxjQURRO0FBRWRSLHFCQUFXLElBRkc7QUFHZEoseUJBQWVVO0FBSEQsU0FBaEIsRUFJR3pCLElBSkgsQ0FJUSxVQUFDaUIsS0FBRCxFQUFXO0FBQ2pCLGlCQUFLekMsZ0JBQUwsR0FBd0IsSUFBeEI7QUFDQSxpQkFBSytCLGdCQUFMLENBQXNCVSxNQUFNL0MsRUFBNUI7QUFDQSxpQkFBS00sZ0JBQUwsR0FBd0IsS0FBeEI7QUFDRCxTQVJEOztBQVVBdkIsZ0JBQVFtQixHQUFSLENBQVksUUFBWixFQUFzQmdELEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxVQURrQjtBQUV4QkMsb0JBQVUsT0FGYztBQUd4QnpCLGdCQUFNO0FBQ0p4Qix1QkFBVyxLQUFLRixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsV0FBaEIsQ0FEUDtBQUVKMkMsMkJBQWVVO0FBRlg7QUFIa0IsU0FBMUI7QUFRRDtBQXJMZTtBQUFBO0FBQUEscUNBdUxEN0IsR0F2TEMsRUF1TEk7QUFDbEIzQyxnQkFBUW1CLEdBQVIsQ0FBWSxrQkFBWixFQUFnQ3dELE9BQWhDLENBQXdDLEtBQUsxQyxTQUFMLENBQWVMLElBQWYsRUFBeEM7QUFDRDtBQXpMZTtBQUFBO0FBQUEsaUNBMkxMZ0IsSUEzTEssRUEyTEM7QUFBQTs7QUFDZkEsYUFBS2dDLFNBQUwsR0FBaUI1RSxRQUFRbUIsR0FBUixDQUFZLFlBQVosQ0FBakI7QUFDQXlCLGFBQUt4QixTQUFMLEdBQWlCLEtBQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixXQUFoQixDQUFqQjtBQUNBeUIsYUFBS2lDLEdBQUwsR0FBVzdFLFFBQVFtQixHQUFSLENBQVksZUFBWixDQUFYOztBQUVBLFlBQUkyRCxxQkFBSjtBQUNBLFlBQUksS0FBS3JCLGFBQVQsRUFBd0I7QUFDdEJxQix5QkFBZTdFLE1BQU0yRCxXQUFOLDRCQUEyQyxLQUFLSCxhQUFMLENBQW1CeEMsRUFBOUQsRUFBb0U7QUFDakY4RCxvQkFBUSxPQUR5RTtBQUVqRm5DLGtCQUFNb0MsS0FBS0MsU0FBTCxDQUFlO0FBQ25CUCxvQkFBTTlCLEtBQUs4QixJQURRO0FBRW5CUix5QkFBV3RCLEtBQUtzQjtBQUZHLGFBQWYsQ0FGMkU7QUFNakZnQix5QkFBYTtBQU5vRSxXQUFwRSxDQUFmO0FBUUQsU0FURCxNQVNPO0FBQ0xKLHlCQUFlN0UsTUFBTTJELFdBQU4sQ0FBa0IsdUJBQWxCLEVBQTJDO0FBQ3hEbUIsb0JBQVEsTUFEZ0Q7QUFFeERuQyxrQkFBTW9DLEtBQUtDLFNBQUwsQ0FBZXJDLElBQWYsQ0FGa0Q7QUFHeERzQyx5QkFBYTtBQUgyQyxXQUEzQyxDQUFmO0FBS0Q7QUFDRCxlQUFPSixhQUFhL0IsSUFBYixDQUFrQixVQUFDb0MsVUFBRCxFQUFnQjtBQUN2QyxjQUFJdkMsS0FBS3NCLFNBQVQsRUFBb0I7QUFDbEIsbUJBQUtULGFBQUwsR0FBcUIwQixVQUFyQjtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFLMUIsYUFBTCxHQUFxQixJQUFyQjtBQUNEO0FBQ0QsY0FBSSxDQUFDMEIsVUFBTCxFQUFpQjtBQUNqQixpQkFBT0EsVUFBUDtBQUNELFNBUk0sQ0FBUDtBQVNEO0FBMU5lO0FBQUE7QUFBQSxvQ0E0TkZ4QyxHQTVORSxFQTRORztBQUFBOztBQUNqQixZQUFJcUIsY0FBSjs7QUFFQSxhQUFLL0IsU0FBTCxDQUFlbUQsUUFBZixHQUEwQnJDLElBQTFCLENBQStCLFVBQUNzQyxVQUFELEVBQWdCO0FBQzdDLGlCQUFPLE9BQUtaLFVBQUwsQ0FBZ0I7QUFDckJDLGtCQUFNLE9BQUt6QyxTQUFMLENBQWVzQixNQUFmLEdBQXdCbUIsSUFEVDtBQUVyQlosMkJBQWUsT0FBS3RDLEtBQUwsQ0FBVytCLE1BQVgsRUFGTTtBQUdyQlcsdUJBQVc7QUFIVSxXQUFoQixDQUFQO0FBS0QsU0FORCxFQU1HbkIsSUFOSCxDQU1RLFVBQUNpQixLQUFELEVBQVc7QUFDakIsaUJBQUtQLGFBQUwsR0FBcUIsSUFBckI7QUFDQXpELGtCQUFRbUIsR0FBUixDQUFZLGtCQUFaLEVBQWdDbUUsSUFBaEMsR0FBdUN2QyxJQUF2QyxDQUE0QyxZQUFNO0FBQ2hELG1CQUFLZCxTQUFMLENBQWVzRCxLQUFmO0FBQ0QsV0FGRDtBQUdBLGlCQUFLaEUsZ0JBQUwsR0FBd0IsSUFBeEI7QUFDQSxpQkFBS1IsUUFBTCxDQUFjK0IsTUFBZCxHQUF1QkMsSUFBdkIsQ0FBNEIsWUFBTTtBQUNoQyxtQkFBS3hCLGdCQUFMLEdBQXdCLEtBQXhCO0FBQ0EsbUJBQUtSLFFBQUwsQ0FBY29DLE1BQWQsQ0FBcUI7QUFDbkJDLGdDQUFrQlksTUFBTS9DO0FBREwsYUFBckI7QUFHRCxXQUxEO0FBTUQsU0FsQkQ7QUFtQkFqQixnQkFBUW1CLEdBQVIsQ0FBWSxRQUFaLEVBQXNCZ0QsR0FBdEIsQ0FBMEI7QUFDeEJDLGdCQUFNLE1BRGtCO0FBRXhCQyxvQkFBVSxPQUZjO0FBR3hCekIsZ0JBQU07QUFDSmtCLDJCQUFlLEtBQUt0QyxLQUFMLENBQVcrQixNQUFYLEVBRFg7QUFFSm5DLHVCQUFXLEtBQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixXQUFoQixDQUZQO0FBR0p1RCxrQkFBTSxLQUFLekMsU0FBTCxDQUFlc0IsTUFBZixHQUF3Qm1CO0FBSDFCO0FBSGtCLFNBQTFCO0FBU0Q7QUEzUGU7QUFBQTtBQUFBLG9DQTZQRi9CLEdBN1BFLEVBNlBHO0FBQUE7O0FBQ2pCM0MsZ0JBQVFtQixHQUFSLENBQVksa0JBQVosRUFBZ0NtRSxJQUFoQyxHQUF1Q3ZDLElBQXZDLENBQTRDLFlBQU07QUFDaEQsaUJBQUtkLFNBQUwsQ0FBZXNELEtBQWY7QUFDRCxTQUZEO0FBR0Q7QUFqUWU7QUFBQTtBQUFBLDBDQW1RSTVDLEdBblFKLEVBbVFTO0FBQ3ZCbEMsaUJBQVMrRSxlQUFULENBQXlCeEYsUUFBUW1CLEdBQVIsQ0FBWSxzQkFBWixDQUF6QixFQUE4RCxLQUFLc0IsYUFBbkUsRUFBa0ZNLElBQWxGLENBQXVGLFVBQUMwQyxPQUFELEVBQWE7QUFDbEd6RixrQkFBUW1CLEdBQVIsQ0FBWSxPQUFaLEVBQXFCNEMsYUFBckIsQ0FBbUMsMEJBQW5DLEVBQStEO0FBQzdEbkIsa0JBQU02QztBQUR1RCxXQUEvRDtBQUdELFNBSkQ7QUFLQXpGLGdCQUFRbUIsR0FBUixDQUFZLFFBQVosRUFBc0JnRCxHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sV0FEa0I7QUFFeEJDLG9CQUFVLE9BRmM7QUFHeEJ6QixnQkFBTTtBQUNKMEIscUJBQVMsS0FBS3ZELFFBQUwsQ0FBY3dDLE1BQWQsR0FBdUJIO0FBRDVCO0FBSGtCLFNBQTFCO0FBT0Q7QUFoUmU7QUFBQTtBQUFBLG9DQWtSRlQsR0FsUkUsRUFrUkc7QUFDakIsYUFBS2hCLGVBQUwsQ0FBcUJnQixHQUFyQjtBQUNEO0FBcFJlO0FBQUE7QUFBQSxxQ0FzUkRBLEdBdFJDLEVBc1JJO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBUzhDLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkIvQyxJQUFJQyxJQUFKLENBQVM4QyxLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLM0UsUUFBTCxDQUFjb0MsTUFBZCxDQUFxQixFQUFFQyxrQkFBa0IsTUFBcEIsRUFBckI7QUFDRDtBQUNGO0FBMVJlO0FBQUE7QUFBQSwwQ0E0Ukk7QUFDbEIsWUFBSXBELFFBQVFtQixHQUFSLENBQVksZ0NBQVosQ0FBSixFQUFtRDtBQUNqRCxrQkFBT25CLFFBQVFtQixHQUFSLENBQVksZ0NBQVosRUFBOEN3RSxXQUE5QyxFQUFQO0FBQ0ksaUJBQUssU0FBTDtBQUNFLG1CQUFLbkUsS0FBTCxDQUFXb0UsVUFBWDtBQUNBLG1CQUFLN0UsUUFBTCxDQUFjNkUsVUFBZDtBQUNGO0FBQ0EsaUJBQUssU0FBTDtBQUNFLG1CQUFLcEUsS0FBTCxDQUFXcUUsYUFBWDtBQUNBLG1CQUFLOUUsUUFBTCxDQUFjOEUsYUFBZDtBQUNGO0FBUko7QUFVRDtBQUNGO0FBelNlOztBQUFBO0FBQUEsSUFjSzFGLFNBZEw7O0FBNlNsQk8sV0FBU00sTUFBVCxHQUFrQixVQUFDNEIsSUFBRCxFQUFVO0FBQzFCLFdBQU8sSUFBSWxDLFFBQUosQ0FBYSxFQUFFb0YsV0FBV2xELElBQWIsRUFBYixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPbEMsUUFBUDtBQUVELENBblREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcblxuICAgIE1vZGVsSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBNb2RlbEZvcm0gPSByZXF1aXJlKCcuLi9mb3JtL2Zvcm0nKSxcbiAgICBOYW1lRm9ybSA9IHJlcXVpcmUoJy4uL25hbWVmb3JtL2Zvcm0nKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKTtcblxuICBjbGFzcyBNb2RlbFRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vblNpbXVsYXRlUmVxdWVzdCcsICdfb25TYXZlUmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19vbk5hbWVDYW5jZWwnLCAnX29uTmFtZVN1Ym1pdCcsICdfb25HbG9iYWxzQ2hhbmdlJywgJ19sb2FkTW9kZWxJbkZvcm0nLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3UmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZSdcbiAgICAgIF0pO1xuXG4gICAgICB0aGlzLl9oaXN0b3J5ID0gTW9kZWxIaXN0b3J5Rm9ybS5jcmVhdGUoe1xuICAgICAgICBpZDogYG1vZGVsX2hpc3RvcnlfXyR7dGhpcy5fbW9kZWwuZ2V0KFwiaWRcIil9YCxcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX2Zvcm0gPSBNb2RlbEZvcm0uY3JlYXRlKHtcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICBmaWVsZENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJyksXG4gICAgICAgIGV1Z2xlbmFDb3VudENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdldWdsZW5hQ291bnQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2ltdWxhdGUnLCB0aGlzLl9vblNpbXVsYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2F2ZScsIHRoaXMuX29uU2F2ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdSZXF1ZXN0KTtcblxuICAgICAgdGhpcy5fbmFtZUZvcm0gPSBOYW1lRm9ybS5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuU3VibWl0JywgdGhpcy5fb25OYW1lU3VibWl0KTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuQ2FuY2VsJywgdGhpcy5fb25OYW1lQ2FuY2VsKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2Zvcm0udmlldygpKTtcblxuICAgICAgdGhpcy5fc2V0TW9kZWxNb2RhbGl0eSgpO1xuXG4gICAgICBHbG9iYWxzLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uR2xvYmFsc0NoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG5cbiAgICBjdXJyTW9kZWxJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyTW9kZWxJZDtcbiAgICB9XG5cbiAgICBjdXJyTW9kZWwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3VycmVudE1vZGVsO1xuICAgIH1cblxuICAgIGNvbG9yKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnY29sb3InKVxuICAgIH1cblxuICAgIGhpc3RvcnlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5Lmhpc3RvcnlDb3VudCgpO1xuICAgIH1cblxuICAgIF9vbkdsb2JhbHNDaGFuZ2UoZXZ0KSB7XG4gICAgICBzd2l0Y2goZXZ0LmRhdGEucGF0aCkge1xuICAgICAgICBjYXNlICdzdHVkZW50X2lkJzpcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgICBpZiAoaGlzdC5sZW5ndGggJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpPT0nY3JlYXRlJykge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IGhpc3RbaGlzdC5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTtcbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9sb2FkTW9kZWxJbkZvcm0oaWQpIHtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGxldCBvbGRJZCA9IHRoaXMuX2N1cnJNb2RlbElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gaWQ7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke2lkfWApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IGRhdGE7XG4gICAgICAgICAgICB0aGlzLl9mb3JtLmltcG9ydChkYXRhLmNvbmZpZ3VyYXRpb24pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IGRhdGEsXG4gICAgICAgICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnaGlzdG9yaWNhbCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgaWQ6ICdfbmV3J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fc2lsZW5jZUxvYWRMb2dzKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsSWQ6IGlkLFxuICAgICAgICAgICAgICB0YWI6IHRoaXMuaWQoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGFzdFNpbVNhdmVkICYmIHRoaXMuX2xhc3RTaW1TYXZlZC5pZCA9PSBvbGRJZCkge1xuICAgICAgICAvLyBoYW5kbGUgXCJyZXJ1bm5pbmdcIiBhIHNpbXVsYXRpb25cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5fbGFzdFNpbVNhdmVkLFxuICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TaW11bGF0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBjb25zdCBjb25mID0gdGhpcy5fZm9ybS5leHBvcnQoKTtcblxuICAgICAgdGhpcy5fc2F2ZU1vZGVsKHtcbiAgICAgICAgbmFtZTogXCIoc2ltdWxhdGlvbilcIixcbiAgICAgICAgc2ltdWxhdGVkOiB0cnVlLFxuICAgICAgICBjb25maWd1cmF0aW9uOiBjb25mXG4gICAgICB9KS50aGVuKChtb2RlbCkgPT4ge1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0obW9kZWwuaWQpO1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcbiAgICAgIH0pXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInNpbXVsYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogY29uZlxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblNhdmVSZXF1ZXN0KGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5kaXNwbGF5KHRoaXMuX25hbWVGb3JtLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfc2F2ZU1vZGVsKGRhdGEpIHtcbiAgICAgIGRhdGEuc3R1ZGVudElkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGRhdGEubW9kZWxUeXBlID0gdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKTtcbiAgICAgIGRhdGEubGFiID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKTtcblxuICAgICAgbGV0IHNhdmVPclVwZGF0ZTtcbiAgICAgIGlmICh0aGlzLl9sYXN0U2ltU2F2ZWQpIHtcbiAgICAgICAgc2F2ZU9yVXBkYXRlID0gVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke3RoaXMuX2xhc3RTaW1TYXZlZC5pZH1gLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgICAgICAgIHNpbXVsYXRlZDogZGF0YS5zaW11bGF0ZWRcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FdWdsZW5hTW9kZWxzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBzYXZlT3JVcGRhdGUudGhlbigoc2VydmVyRGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBzZXJ2ZXJEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXJ2ZXJEYXRhKSByZXR1cm47XG4gICAgICAgIHJldHVybiBzZXJ2ZXJEYXRhO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lU3VibWl0KGV2dCkge1xuICAgICAgbGV0IG1vZGVsO1xuXG4gICAgICB0aGlzLl9uYW1lRm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NhdmVNb2RlbCh7XG4gICAgICAgICAgbmFtZTogdGhpcy5fbmFtZUZvcm0uZXhwb3J0KCkubmFtZSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9mb3JtLmV4cG9ydCgpLFxuICAgICAgICAgIHNpbXVsYXRlZDogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgIH0pLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogbW9kZWwuaWRcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInNhdmVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2Zvcm0uZXhwb3J0KCksXG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lQ2FuY2VsKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRNb2RlbFJlc3VsdHMoR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50LmlkJyksIHRoaXMuX2N1cnJlbnRNb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmV3UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX29uQ29uZmlnQ2hhbmdlKGV2dCk7XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3NldE1vZGVsTW9kYWxpdHkoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcIm9ic2VydmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5oaWRlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXhwbG9yZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmRpc2FibGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgTW9kZWxUYWIuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsVGFiKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcmV0dXJuIE1vZGVsVGFiO1xuXG59KVxuIl19
