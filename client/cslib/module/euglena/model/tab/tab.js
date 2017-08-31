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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxIaXN0b3J5Rm9ybSIsIk1vZGVsRm9ybSIsIk5hbWVGb3JtIiwiRXVnVXRpbHMiLCJNb2RlbFRhYiIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2hpc3RvcnkiLCJjcmVhdGUiLCJpZCIsIl9tb2RlbCIsImdldCIsIm1vZGVsVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlIiwiX3NpbGVuY2VMb2FkTG9ncyIsIl9mb3JtIiwiZmllbGRDb25maWciLCJldWdsZW5hQ291bnRDb25maWciLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uU2ltdWxhdGVSZXF1ZXN0IiwiX29uU2F2ZVJlcXVlc3QiLCJfb25BZ2dyZWdhdGVSZXF1ZXN0IiwiX29uTmV3UmVxdWVzdCIsIl9uYW1lRm9ybSIsIl9vbk5hbWVTdWJtaXQiLCJfb25OYW1lQ2FuY2VsIiwiYWRkQ2hpbGQiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uUGhhc2VDaGFuZ2UiLCJfY3Vyck1vZGVsSWQiLCJfY3VycmVudE1vZGVsIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJ0aGVuIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJtb2RlbF9oaXN0b3J5X2lkIiwic2V0U3RhdGUiLCJfbG9hZE1vZGVsSW5Gb3JtIiwiZXhwb3J0IiwiY3VycmVudFRhcmdldCIsIl9sYXN0U2ltU2F2ZWQiLCJvbGRJZCIsInRhcmdldCIsInByb21pc2VBamF4IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbmZpZ3VyYXRpb24iLCJkaXNwYXRjaEV2ZW50IiwibW9kZWwiLCJ0YWJJZCIsInNpbXVsYXRlZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsIm1vZGVsSWQiLCJ0YWIiLCJjb25mIiwiX3NhdmVNb2RlbCIsIm5hbWUiLCJkaXNwbGF5Iiwic3R1ZGVudElkIiwibGFiIiwic2F2ZU9yVXBkYXRlIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnRlbnRUeXBlIiwic2VydmVyRGF0YSIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsImhpZGUiLCJjbGVhciIsImdldE1vZGVsUmVzdWx0cyIsInJlc3VsdHMiLCJwaGFzZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFSyxRQUFRTCxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVNLE9BQU9OLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRU8sbUJBQW1CUCxRQUFRLGlCQUFSLENBSnJCO0FBQUEsTUFLRVEsWUFBWVIsUUFBUSxjQUFSLENBTGQ7QUFBQSxNQU1FUyxXQUFXVCxRQUFRLGtCQUFSLENBTmI7QUFBQSxNQU9FVSxXQUFXVixRQUFRLGVBQVIsQ0FQYjs7QUFMa0IsTUFjWlcsUUFkWTtBQUFBOztBQWVoQix3QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCUixLQUE3QztBQUNBTyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCUixJQUEzQzs7QUFGeUIsc0hBR25CTSxRQUhtQjs7QUFJekJWLFlBQU1hLFdBQU4sUUFBd0IsQ0FDdEIsb0JBRHNCLEVBQ0EsZ0JBREEsRUFDa0IscUJBRGxCLEVB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RXhCQyxvQkFBVSxPQUZjO0FBR3hCekIsZ0JBQU07QUFDSmtCLDJCQUFlLEtBQUtwQyxLQUFMLENBQVc2QixNQUFYLEVBRFg7QUFFSmpDLHVCQUFXLEtBQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixXQUFoQixDQUZQO0FBR0pxRCxrQkFBTSxLQUFLdkMsU0FBTCxDQUFlb0IsTUFBZixHQUF3Qm1CO0FBSDFCO0FBSGtCLFNBQTFCO0FBU0Q7QUFyUGU7QUFBQTtBQUFBLG9DQXVQRi9CLEdBdlBFLEVBdVBHO0FBQUE7O0FBQ2pCekMsZ0JBQVFtQixHQUFSLENBQVksa0JBQVosRUFBZ0NpRSxJQUFoQyxHQUF1Q3ZDLElBQXZDLENBQTRDLFlBQU07QUFDaEQsaUJBQUtaLFNBQUwsQ0FBZW9ELEtBQWY7QUFDRCxTQUZEO0FBR0Q7QUEzUGU7QUFBQTtBQUFBLDBDQTZQSTVDLEdBN1BKLEVBNlBTO0FBQ3ZCaEMsaUJBQVM2RSxlQUFULENBQXlCdEYsUUFBUW1CLEdBQVIsQ0FBWSxzQkFBWixDQUF6QixFQUE4RCxLQUFLcUIsYUFBbkUsRUFBa0ZLLElBQWxGLENBQXVGLFVBQUMwQyxPQUFELEVBQWE7QUFDbEd2RixrQkFBUW1CLEdBQVIsQ0FBWSxPQUFaLEVBQXFCMEMsYUFBckIsQ0FBbUMsMEJBQW5DLEVBQStEO0FBQzdEbkIsa0JBQU02QztBQUR1RCxXQUEvRDtBQUdELFNBSkQ7QUFLQXZGLGdCQUFRbUIsR0FBUixDQUFZLFFBQVosRUFBc0I4QyxHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sV0FEa0I7QUFFeEJDLG9CQUFVLE9BRmM7QUFHeEJ6QixnQkFBTTtBQUNKMEIscUJBQVMsS0FBS3JELFFBQUwsQ0FBY3NDLE1BQWQsR0FBdUJIO0FBRDVCO0FBSGtCLFNBQTFCO0FBT0Q7QUExUWU7QUFBQTtBQUFBLG9DQTRRRlQsR0E1UUUsRUE0UUc7QUFDakIsYUFBS2QsZUFBTCxDQUFxQmMsR0FBckI7QUFDRDtBQTlRZTtBQUFBO0FBQUEscUNBZ1JEQSxHQWhSQyxFQWdSSTtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVM4QyxLQUFULElBQWtCLE9BQXRCLEVBQStCO0FBQzdCLGVBQUt6RSxRQUFMLENBQWNrQyxNQUFkLENBQXFCLEVBQUVDLGtCQUFrQixNQUFwQixFQUFyQjtBQUNEO0FBQ0Y7QUFwUmU7O0FBQUE7QUFBQSxJQWNLL0MsU0FkTDs7QUF1UmxCTyxXQUFTTSxNQUFULEdBQWtCLFVBQUMwQixJQUFELEVBQVU7QUFDMUIsV0FBTyxJQUFJaEMsUUFBSixDQUFhLEVBQUUrRSxXQUFXL0MsSUFBYixFQUFiLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9oQyxRQUFQO0FBRUQsQ0E3UkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvdGFiL3RhYi5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
