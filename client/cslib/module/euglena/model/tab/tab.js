'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var $ = require('jquery');

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
      Globals.get('Relay').addEventListener('Blockly.Changed', _this._onHistorySelectionChange);
      _this._silenceLoadLogs = false;

      _this._form = ModelForm.create({
        modelType: _this._model.get('modelType'),
        fieldConfig: _this._model.get('parameters'),
        euglenaCountConfig: _this._model.get('euglenaCount')
      });
      _this._form.addEventListener('Form.FieldChanged', _this._onConfigChange);
      Globals.get('Relay').addEventListener('Blockly.Changed', _this._onConfigChange);
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
        if (evt.name == 'Blockly.Changed') {
          if (this._model._data.modelType == evt.data.modelType) {
            this._loadModelInForm('_new');
          }
        } else {
          this._loadModelInForm(evt.currentTarget.export().model_history_id);
        }
      }
    }, {
      key: '_onConfigChange',
      value: function _onConfigChange(evt) {
        this._lastSimSaved = null;
        if (evt.name == 'Blockly.Changed') {
          if (this._model._data.modelType == evt.data.modelType) {
            this._history.import({ model_history_id: '_new' });
            this._form.setState('new');
          }
        } else if (this._history.export().model_history_id != '_new') {
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

              if (_this3._model._data.modelType == 'blockly') {
                Globals.get('Relay').dispatchEvent('Blockly.Load', data.blocklyXml);
              }

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
        var blocklyData = null;

        var saveData = {
          name: "(simulation)",
          simulated: true,
          configuration: conf

          // if the active tab is 'blockly', then we have to compile and extract the blockly code.
        };if (this._model.get('modelType') == 'blockly') {
          blocklyData = this._extractBlockly();
          saveData = $.extend(saveData, blocklyData);
        }

        this._saveModel(saveData).then(function (model) {
          _this4._silenceLoadLogs = true;
          _this4._loadModelInForm(model.id);
          _this4._silenceLoadLogs = false;
        });

        Globals.get('Logger').log({
          type: "simulate",
          category: "model",
          data: {
            modelType: this._model.get('modelType'),
            configuration: blocklyData ? $.extend(conf, { jsCode: blocklyData.jsCode }) : conf
          }
        });
      }
    }, {
      key: '_extractBlockly',
      value: function _extractBlockly() {
        // get the Blockly code xml
        var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());

        // parse the code for errors

        // generate the javascript code
        window.Blockly.JavaScript.addReservedWords('jsCode');
        var jsCode = window.Blockly.JavaScript.workspaceToCode(window.Blockly.getMainWorkspace());

        // return xml and jsCode as strings within js object
        // stringify: blocklyXml.outerHTML
        // xml-ify with jquery: $.parseXML(string).documentElement
        return { blocklyXml: blocklyXml.outerHTML, jsCode: jsCode };
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
        console.log('_saveModel');
        console.log(data);
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

        var blocklyData = null;

        // if the active tab is 'blockly', then we have to compile and extract the blockly code.
        if (this._model.get('modelType') == 'blockly') {
          blocklyData = this._extractBlockly();
        }

        this._nameForm.validate().then(function (validation) {
          return _this6._saveModel($.extend(blocklyData, {
            name: _this6._nameForm.export().name,
            configuration: _this6._form.export(),
            simulated: false
          }));
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
            configuration: blocklyData ? $.extend(this._form.export(), { jsCode: blocklyData.jsCode }) : this._form.export(),
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJfbmFtZUZvcm0iLCJfb25OYW1lU3VibWl0IiwiX29uTmFtZUNhbmNlbCIsImFkZENoaWxkIiwiX3NldE1vZGVsTW9kYWxpdHkiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uUGhhc2VDaGFuZ2UiLCJfY3Vyck1vZGVsSWQiLCJfY3VycmVudE1vZGVsIiwiaGlzdG9yeUNvdW50IiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJ0aGVuIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJtb2RlbF9oaXN0b3J5X2lkIiwic2V0U3RhdGUiLCJfbG9hZE1vZGVsSW5Gb3JtIiwiZXhwb3J0IiwibmFtZSIsIl9kYXRhIiwiY3VycmVudFRhcmdldCIsIl9sYXN0U2ltU2F2ZWQiLCJvbGRJZCIsInRhcmdldCIsInByb21pc2VBamF4IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRpc3BhdGNoRXZlbnQiLCJibG9ja2x5WG1sIiwiY29uZmlndXJhdGlvbiIsIm1vZGVsIiwidGFiSWQiLCJzaW11bGF0ZWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImJsb2NrbHlEYXRhIiwic2F2ZURhdGEiLCJfZXh0cmFjdEJsb2NrbHkiLCJleHRlbmQiLCJfc2F2ZU1vZGVsIiwianNDb2RlIiwid2luZG93IiwiQmxvY2tseSIsIlhtbCIsIndvcmtzcGFjZVRvRG9tIiwiZ2V0TWFpbldvcmtzcGFjZSIsIkphdmFTY3JpcHQiLCJhZGRSZXNlcnZlZFdvcmRzIiwid29ya3NwYWNlVG9Db2RlIiwib3V0ZXJIVE1MIiwiZGlzcGxheSIsInN0dWRlbnRJZCIsImxhYiIsImNvbnNvbGUiLCJzYXZlT3JVcGRhdGUiLCJtZXRob2QiLCJKU09OIiwic3RyaW5naWZ5IiwiY29udGVudFR5cGUiLCJzZXJ2ZXJEYXRhIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwiaGlkZSIsImNsZWFyIiwiZ2V0TW9kZWxSZXN1bHRzIiwicmVzdWx0cyIsInBoYXNlIiwidG9Mb3dlckNhc2UiLCJoaWRlRmllbGRzIiwiZGlzYWJsZUZpZWxkcyIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxJQUFJRCxRQUFRLFFBQVIsQ0FBVjs7QUFFQSxNQUFNRSxVQUFVRixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUcsUUFBUUgsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUksS0FBS0osUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1LLFlBQVlMLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFTSxRQUFRTixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVPLE9BQU9QLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRVEsbUJBQW1CUixRQUFRLGlCQUFSLENBSnJCO0FBQUEsTUFLRVMsWUFBWVQsUUFB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QzFCLFdBQU8sSUFBSWxDLFFBQUosQ0FBYSxFQUFFcUcsV0FBV25FLElBQWIsRUFBYixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPbEMsUUFBUDtBQUVELENBMVdEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG5cbiAgICBNb2RlbEhpc3RvcnlGb3JtID0gcmVxdWlyZSgnLi4vaGlzdG9yeS9mb3JtJyksXG4gICAgTW9kZWxGb3JtID0gcmVxdWlyZSgnLi4vZm9ybS9mb3JtJyksXG4gICAgTmFtZUZvcm0gPSByZXF1aXJlKCcuLi9uYW1lZm9ybS9mb3JtJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJyk7XG5cbiAgY2xhc3MgTW9kZWxUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25TaW11bGF0ZVJlcXVlc3QnLCAnX29uU2F2ZVJlcXVlc3QnLCAnX29uQWdncmVnYXRlUmVxdWVzdCcsXG4gICAgICAgICdfb25OYW1lQ2FuY2VsJywgJ19vbk5hbWVTdWJtaXQnLCAnX29uR2xvYmFsc0NoYW5nZScsICdfbG9hZE1vZGVsSW5Gb3JtJyxcbiAgICAgICAgJ19vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UnLCAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld1JlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnXG4gICAgICBdKTtcblxuICAgICAgdGhpcy5faGlzdG9yeSA9IE1vZGVsSGlzdG9yeUZvcm0uY3JlYXRlKHtcbiAgICAgICAgaWQ6IGBtb2RlbF9oaXN0b3J5X18ke3RoaXMuX21vZGVsLmdldChcImlkXCIpfWAsXG4gICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcblxuICAgICAgdGhpcy5fZm9ybSA9IE1vZGVsRm9ybS5jcmVhdGUoe1xuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgIGZpZWxkQ29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKSxcbiAgICAgICAgZXVnbGVuYUNvdW50Q29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ2V1Z2xlbmFDb3VudCcpXG4gICAgICB9KVxuICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TaW11bGF0ZScsIHRoaXMuX29uU2ltdWxhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TYXZlJywgdGhpcy5fb25TYXZlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld1JlcXVlc3QpO1xuXG4gICAgICB0aGlzLl9uYW1lRm9ybSA9IE5hbWVGb3JtLmNyZWF0ZSgpO1xuICAgICAgdGhpcy5fbmFtZUZvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsU2F2ZS5TdWJtaXQnLCB0aGlzLl9vbk5hbWVTdWJtaXQpO1xuICAgICAgdGhpcy5fbmFtZUZvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsU2F2ZS5DYW5jZWwnLCB0aGlzLl9vbk5hbWVDYW5jZWwpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5faGlzdG9yeS52aWV3KCkpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZm9ybS52aWV3KCkpO1xuXG4gICAgICB0aGlzLl9zZXRNb2RlbE1vZGFsaXR5KCk7XG5cbiAgICAgIEdsb2JhbHMuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25HbG9iYWxzQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbElkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJNb2RlbElkO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50TW9kZWw7XG4gICAgfVxuXG4gICAgY29sb3IoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdjb2xvcicpXG4gICAgfVxuXG4gICAgaGlzdG9yeUNvdW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCk7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgJ3N0dWRlbnRfaWQnOlxuICAgICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KClcbiAgICAgICAgICAgIGlmIChoaXN0Lmxlbmd0aCAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5Jyk9PSdjcmVhdGUnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0odGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTtcbiAgICAgICAgICB9KVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5uYW1lID09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKCdfbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgeyB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCk7IH1cbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgaWYgKGV2dC5uYW1lID09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9sb2FkTW9kZWxJbkZvcm0oaWQpIHtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGxldCBvbGRJZCA9IHRoaXMuX2N1cnJNb2RlbElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gaWQ7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke2lkfWApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IGRhdGE7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0Jsb2NrbHkuTG9hZCcsIGRhdGEuYmxvY2tseVhtbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2Zvcm0uaW1wb3J0KGRhdGEuY29uZmlndXJhdGlvbikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgICBtb2RlbDogZGF0YSxcbiAgICAgICAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGRhdGEuc2ltdWxhdGVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fY3Vyck1vZGVsSWQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IG51bGw7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgIGlkOiAnX25ldydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3NpbGVuY2VMb2FkTG9ncykge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJsb2FkXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbElkOiBpZCxcbiAgICAgICAgICAgICAgdGFiOiB0aGlzLmlkKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2xhc3RTaW1TYXZlZCAmJiB0aGlzLl9sYXN0U2ltU2F2ZWQuaWQgPT0gb2xkSWQpIHtcbiAgICAgICAgLy8gaGFuZGxlIFwicmVydW5uaW5nXCIgYSBzaW11bGF0aW9uXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgbW9kZWw6IHRoaXMuX2xhc3RTaW1TYXZlZCxcbiAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uU2ltdWxhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgdmFyIGNvbmYgPSB0aGlzLl9mb3JtLmV4cG9ydCgpO1xuICAgICAgdmFyIGJsb2NrbHlEYXRhID0gbnVsbDtcblxuICAgICAgdmFyIHNhdmVEYXRhID0ge1xuICAgICAgICBuYW1lOiBcIihzaW11bGF0aW9uKVwiLFxuICAgICAgICBzaW11bGF0ZWQ6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgICAgc2F2ZURhdGEgPSAkLmV4dGVuZChzYXZlRGF0YSxibG9ja2x5RGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NhdmVNb2RlbCggc2F2ZURhdGEgKS50aGVuKChtb2RlbCkgPT4ge1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0obW9kZWwuaWQpO1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcbiAgICAgIH0pXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInNpbXVsYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogYmxvY2tseURhdGEgPyAkLmV4dGVuZChjb25mLCB7anNDb2RlOiBibG9ja2x5RGF0YS5qc0NvZGV9KSA6IGNvbmZcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfZXh0cmFjdEJsb2NrbHkoKSB7XG4gICAgICAvLyBnZXQgdGhlIEJsb2NrbHkgY29kZSB4bWxcbiAgICAgIHZhciBibG9ja2x5WG1sID0gd2luZG93LkJsb2NrbHkuWG1sLndvcmtzcGFjZVRvRG9tKHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSk7XG5cbiAgICAgIC8vIHBhcnNlIHRoZSBjb2RlIGZvciBlcnJvcnNcblxuICAgICAgLy8gZ2VuZXJhdGUgdGhlIGphdmFzY3JpcHQgY29kZVxuICAgICAgd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5hZGRSZXNlcnZlZFdvcmRzKCdqc0NvZGUnKTtcbiAgICAgIHZhciBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LndvcmtzcGFjZVRvQ29kZSggd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpICk7XG5cbiAgICAgIC8vIHJldHVybiB4bWwgYW5kIGpzQ29kZSBhcyBzdHJpbmdzIHdpdGhpbiBqcyBvYmplY3RcbiAgICAgIC8vIHN0cmluZ2lmeTogYmxvY2tseVhtbC5vdXRlckhUTUxcbiAgICAgIC8vIHhtbC1pZnkgd2l0aCBqcXVlcnk6ICQucGFyc2VYTUwoc3RyaW5nKS5kb2N1bWVudEVsZW1lbnRcbiAgICAgIHJldHVybiB7YmxvY2tseVhtbDogYmxvY2tseVhtbC5vdXRlckhUTUwsIGpzQ29kZToganNDb2RlfVxuXG4gICAgfVxuXG4gICAgX29uU2F2ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmRpc3BsYXkodGhpcy5fbmFtZUZvcm0udmlldygpKVxuICAgIH1cblxuICAgIF9zYXZlTW9kZWwoZGF0YSkge1xuICAgICAgZGF0YS5zdHVkZW50SWQgPSBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpO1xuICAgICAgZGF0YS5tb2RlbFR5cGUgPSB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpO1xuICAgICAgZGF0YS5sYWIgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpO1xuICAgICAgY29uc29sZS5sb2coJ19zYXZlTW9kZWwnKVxuICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgIGxldCBzYXZlT3JVcGRhdGU7XG4gICAgICBpZiAodGhpcy5fbGFzdFNpbVNhdmVkKSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHt0aGlzLl9sYXN0U2ltU2F2ZWQuaWR9YCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BBVENIJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICAgICAgICBzaW11bGF0ZWQ6IGRhdGEuc2ltdWxhdGVkXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2F2ZU9yVXBkYXRlID0gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXVnbGVuYU1vZGVscycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gc2F2ZU9yVXBkYXRlLnRoZW4oKHNlcnZlckRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuc2ltdWxhdGVkKSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gc2VydmVyRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VydmVyRGF0YSkgcmV0dXJuO1xuICAgICAgICByZXR1cm4gc2VydmVyRGF0YTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZVN1Ym1pdChldnQpIHtcbiAgICAgIGxldCBtb2RlbDtcblxuICAgICAgdmFyIGJsb2NrbHlEYXRhID0gbnVsbDtcblxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbmFtZUZvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zYXZlTW9kZWwoJC5leHRlbmQoYmxvY2tseURhdGEse1xuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWUsXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fZm9ybS5leHBvcnQoKSxcbiAgICAgICAgICBzaW11bGF0ZWQ6IGZhbHNlXG4gICAgICAgIH0pKVxuICAgICAgfSkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbmFtZUZvcm0uY2xlYXIoKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBtb2RlbC5pZFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2F2ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY29uZmlndXJhdGlvbjogYmxvY2tseURhdGEgPyAkLmV4dGVuZCh0aGlzLl9mb3JtLmV4cG9ydCgpLCB7anNDb2RlOiBibG9ja2x5RGF0YS5qc0NvZGV9KSA6IHRoaXMuX2Zvcm0uZXhwb3J0KCkgLFxuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZUNhbmNlbChldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfb25BZ2dyZWdhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudC5pZCcpLCB0aGlzLl9jdXJyZW50TW9kZWwpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5BZGRSZXF1ZXN0Jywge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdHNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJhZ2dyZWdhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsSWQ6IHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5ld1JlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9vbkNvbmZpZ0NoYW5nZShldnQpO1xuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgbW9kZWxfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRNb2RlbE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSkge1xuICAgICAgICBzd2l0Y2goR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsVGFiLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbFRhYih7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbFRhYjtcblxufSlcbiJdfQ==
