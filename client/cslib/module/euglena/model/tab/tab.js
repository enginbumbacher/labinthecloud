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
      EugUtils = require('euglena/utils'),
      BodyConfigurations = require('euglena/model_blockly/bodyConfigurations/bodyconfigs/bodyconfigs');

  var ModelTab = function (_Component) {
    _inherits(ModelTab, _Component);

    function ModelTab() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModelTab);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (ModelTab.__proto__ || Object.getPrototypeOf(ModelTab)).call(this, settings));

      Utils.bindMethods(_this, ['_onSimulateRequest', '_onSaveRequest', '_onAggregateRequest', '_onNameCancel', '_onNameSubmit', '_onGlobalsChange', '_loadModelInForm', '_onHistorySelectionChange', '_onConfigChange', '_onNewRequest', '_onPhaseChange', '_onDisableRequest', '_onEnableRequest']);

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
        euglenaCountConfig: _this._model.get('euglenaCount'),
        euglenaInitConfig: _this._model.get('euglenaInit')
      });
      _this._form.addEventListener('Form.FieldChanged', _this._onConfigChange);
      Globals.get('Relay').addEventListener('Blockly.Changed', _this._onConfigChange);
      _this._form.view().addEventListener('ModelForm.Simulate', _this._onSimulateRequest);
      _this._form.view().addEventListener('ModelForm.Save', _this._onSaveRequest);
      _this._form.view().addEventListener('ModelForm.AddToAggregate', _this._onAggregateRequest);
      _this._form.view().addEventListener('ModelForm.NewRequest', _this._onNewRequest);

      // Insert a title of the tab
      var titleNode = document.createElement('h2');
      titleNode.className = 'tab__model__title';
      titleNode.innerHTML = Globals.get('AppConfig.model.modelName') ? Globals.get('AppConfig.model.modelName') : 'Model of the Body';

      _this.view().$dom().append(titleNode);

      _this._nameForm = NameForm.create();
      _this._nameForm.view().addEventListener('ModelSave.Submit', _this._onNameSubmit);
      _this._nameForm.view().addEventListener('ModelSave.Cancel', _this._onNameCancel);
      _this.view().addChild(_this._history.view());

      if (_this._model.get('modelType') == 'blockly') {
        // Create body configuration model instance.
        var initialBody = _this._form.export();
        var paramOptions = {};
        paramOptions['reaction'] = Object.keys(_this._model.get('parameters').K.options);
        paramOptions['motor'] = Object.keys(_this._model.get('parameters').v.options);
        if (_this._model.get('parameters').omega) {
          paramOptions['roll'] = Object.keys(_this._model.get('parameters').omega.options);
        } else if (_this._model.get('parameters').motion) {
          paramOptions['motion'] = Object.keys(_this._model.get('parameters').motion.options);
        }
        _this.bodyConfigurations = BodyConfigurations.create({ initialConfig: initialBody, paramOptions: paramOptions, modelRepresentation: _this._model.get('parameters').modelRepresentation });

        // add view of the model instance to this.view()
        _this._form.view().addChild(_this.bodyConfigurations.view(), null, 0);
      }

      _this.view().addChild(_this._form.view());

      _this._setModelRepresentation();

      Globals.addEventListener('Model.Change', _this._onGlobalsChange);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);

      Globals.get('Relay').addEventListener('Notifications.Add', _this._onDisableRequest);
      Globals.get('Relay').addEventListener('Notifications.Remove', _this._onEnableRequest);
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
        if (evt.name === 'Blockly.Changed') {
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
        if (evt.name === 'Blockly.Changed') {
          if (this._model._data.modelType == evt.data.modelType) {
            this._history.import({ model_history_id: '_new' });
            this._form.setState('new');
          }
        } else {
          this._history.import({ model_history_id: '_new' });
          this._form.setState('new');
        }

        // In here, change the image and the toolbox according to which bodyConfiguration (sensorConfig, motor, react, roll, motion type) has been selected.
        if (evt.name === 'Form.FieldChanged') {
          if (evt.data.field._model._data.id === 'opacity') {
            this.bodyConfigurations.setBodyOpacity(evt.data.delta.value);
          } else if (evt.currentTarget._model._data.modelType == 'blockly') {
            this.bodyConfigurations.setActiveConfiguration(evt.data.delta.value);
          }
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
                for (var idx = Object.keys(data.configuration).length - 1; idx >= 0; idx--) {
                  if (!Object.keys(data.configuration)[idx].match("_|count")) {
                    var elemName = Object.keys(data.configuration)[idx];
                    _this3.bodyConfigurations.setActiveConfiguration(data.configuration[elemName]);
                  }
                }
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
                tab: this._model.get('id')
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
        var sensorConfigJSON = null;

        var saveData = {
          name: "(simulation)",
          simulated: true,
          configuration: conf

          // if the active tab is 'blockly', then we have to compile and extract the blockly code.
        };if (this._model.get('modelType') == 'blockly') {
          blocklyData = this._extractBlockly();
          saveData = $.extend(saveData, blocklyData);
          sensorConfigJSON = JSON.stringify(this.bodyConfigurations.getActiveSensorConfiguration());
          saveData = $.extend(saveData, { sensorConfigJSON: sensorConfigJSON });
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
            configuration: blocklyData ? $.extend(conf, { jsCode: blocklyData.jsCode, sensorConfigJSON: sensorConfigJSON }) : conf
          }
        });
      }
    }, {
      key: '_extractBlockly',
      value: function _extractBlockly() {
        // get the Blockly code xml
        var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());

        // remove blocks from blocklyXml that are not within the main block
        Array.prototype.slice.call(blocklyXml.childNodes).map(function (childNode) {
          if (childNode.tagName == 'BLOCK' && childNode.getAttribute('type') != 'master_block') {
            blocklyXml.removeChild(childNode);
          }
        });

        // generate the javascript code of the main block
        var blocks = window.Blockly.mainWorkspace.getTopBlocks(true);
        var foundMainBlock = false;
        var jsCode = '';
        for (var b = 0; b < blocks.length; b++) {
          if (blocks[b].type == 'master_block') {
            jsCode = window.Blockly.JavaScript.blockToCode(blocks[b]);
            foundMainBlock = true;
            break;
          }
        }

        if (!foundMainBlock) {
          alert('there is no main block');
        }

        //window.Blockly.JavaScript.addReservedWords('jsCode');
        //var jsCode = window.Blockly.JavaScript.workspaceToCode( window.Blockly.getMainWorkspace() );

        // return xml and jsCode as strings within js object
        // stringify: blocklyXml.outerHTML // Alternatively: blocklyXmlText = window.Blockly.Xml.domToText(xml) (produces minimal, ugly string)
        // xml-ify with jquery: $.parseXML(string).documentElement
        // Alternatively for recreating blocks: blocklyXml = window.Xml.textToDom(blocklyXmlText) & window.Blockly.Xml.domToWorkspace(window.Blockly.mainWorkspace, blocklyXml)
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
        var sensorConfigJSON = null;

        // if the active tab is 'blockly', then we have to compile and extract the blockly code.
        if (this._model.get('modelType') == 'blockly') {
          blocklyData = this._extractBlockly();
          sensorConfigJSON = JSON.stringify(this.bodyConfigurations.getActiveSensorConfiguration());
          blocklyData = $.extend(blocklyData, { sensorConfigJSON: sensorConfigJSON });
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
            configuration: blocklyData ? $.extend(this._form.export(), { sensorConfigJSON: sensorConfigJSON, jsCode: blocklyData.jsCode }) : this._form.export(),
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
      key: '_onDisableRequest',
      value: function _onDisableRequest(evt) {
        if (Globals.get('AppConfig.system.modelModality')) {
          switch (Globals.get('AppConfig.system.modelModality').toLowerCase()) {
            case "create":
              this._form.disable();
              this._history.disable();
              break;
            case "explore":
              this._form.disable();
              this._history.enable();
              break;
          }
        }
      }
    }, {
      key: '_onEnableRequest',
      value: function _onEnableRequest(evt) {
        if (Globals.get('AppConfig.system.modelModality')) {
          switch (Globals.get('AppConfig.system.modelModality').toLowerCase()) {
            case "create":
              this._form.enable();
              this._history.enable();
              break;
            case "explore":
              this._form.enable();
              this._form.partiallyDisableFields(['count', 'initialization']);
              this._history.enable();
              break;
          }
        }
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
      key: '_setModelRepresentation',
      value: function _setModelRepresentation() {
        if (Globals.get('AppConfig.system.modelModality')) {
          switch (Globals.get('AppConfig.system.modelModality').toLowerCase()) {
            case "observe":
              this._form.hideFields();
              this._history.hideFields();
              break;
            case "explore":
              this._form.disableFields();
              this._history.enable();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiZXVnbGVuYUluaXRDb25maWciLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uU2ltdWxhdGVSZXF1ZXN0IiwiX29uU2F2ZVJlcXVlc3QiLCJfb25BZ2dyZWdhdGVSZXF1ZXN0IiwiX29uTmV3UmVxdWVzdCIsInRpdGxlTm9kZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImlubmVySFRNTCIsIiRkb20iLCJhcHBlbmQiLCJfbmFtZUZvcm0iLCJfb25OYW1lU3VibWl0IiwiX29uTmFtZUNhbmNlbCIsImFkZENoaWxkIiwiaW5pdGlhbEJvZHkiLCJleHBvcnQiLCJwYXJhbU9wdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwiSyIsIm9wdGlvbnMiLCJ2Iiwib21lZ2EiLCJtb3Rpb24iLCJib2R5Q29uZmlndXJhdGlvbnMiLCJpbml0aWFsQ29uZmlnIiwibW9kZWxSZXByZXNlbnRhdGlvbiIsIl9zZXRNb2RlbFJlcHJlc2VudGF0aW9uIiwiX29uR2xvYmFsc0NoYW5nZSIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRGlzYWJsZVJlcXVlc3QiLCJfb25FbmFibGVSZXF1ZXN0IiwiX2N1cnJNb2RlbElkIiwiX2N1cnJlbnRNb2RlbCIsImhpc3RvcnlDb3VudCIsImV2dCIsImRhdGEiLCJwYXRoIiwidXBkYXRlIiwidGhlbiIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwibW9kZWxfaGlzdG9yeV9pZCIsInNldFN0YXRlIiwiX2xvYWRNb2RlbEluRm9ybSIsIm5hbWUiLCJfZGF0YSIsImN1cnJlbnRUYXJnZXQiLCJfbGFzdFNpbVNhdmVkIiwiZmllbGQiLCJzZXRCb2R5T3BhY2l0eSIsImRlbHRhIiwidmFsdWUiLCJzZXRBY3RpdmVDb25maWd1cmF0aW9uIiwib2xkSWQiLCJ0YXJnZXQiLCJwcm9taXNlQWpheCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwYXRjaEV2ZW50IiwiYmxvY2tseVhtbCIsImlkeCIsImNvbmZpZ3VyYXRpb24iLCJtYXRjaCIsImVsZW1OYW1lIiwibW9kZWwiLCJ0YWJJZCIsInNpbXVsYXRlZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsIm1vZGVsSWQiLCJ0YWIiLCJjb25mIiwiYmxvY2tseURhdGEiLCJzZW5zb3JDb25maWdKU09OIiwic2F2ZURhdGEiLCJfZXh0cmFjdEJsb2NrbHkiLCJleHRlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2V0QWN0aXZlU2Vuc29yQ29uZmlndXJhdGlvbiIsIl9zYXZlTW9kZWwiLCJqc0NvZGUiLCJ3aW5kb3ciLCJCbG9ja2x5IiwiWG1sIiwid29ya3NwYWNlVG9Eb20iLCJnZXRNYWluV29ya3NwYWNlIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJjaGlsZE5vZGVzIiwibWFwIiwiY2hpbGROb2RlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInJlbW92ZUNoaWxkIiwiYmxvY2tzIiwibWFpbldvcmtzcGFjZSIsImdldFRvcEJsb2NrcyIsImZvdW5kTWFpbkJsb2NrIiwiYiIsIkphdmFTY3JpcHQiLCJibG9ja1RvQ29kZSIsImFsZXJ0Iiwib3V0ZXJIVE1MIiwiZGlzcGxheSIsInN0dWRlbnRJZCIsImxhYiIsInNhdmVPclVwZGF0ZSIsIm1ldGhvZCIsImNvbnRlbnRUeXBlIiwic2VydmVyRGF0YSIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsImhpZGUiLCJjbGVhciIsImdldE1vZGVsUmVzdWx0cyIsInJlc3VsdHMiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJlbmFibGUiLCJwYXJ0aWFsbHlEaXNhYmxlRmllbGRzIiwicGhhc2UiLCJoaWRlRmllbGRzIiwiZGlzYWJsZUZpZWxkcyIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxJQUFJRCxRQUFRLFFBQVIsQ0FBVjs7QUFFQSxNQUFNRSxVQUFVRixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUcsUUFBUUgsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUksS0FBS0osUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1LLFlBQVlMLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFTSxRQUFRTixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVPLE9BQU9QLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRVEsbUJBQW1CUixRQUFRLGlCQUFSLENBSnJCO0FBQUEsTUFLRVMsWUFBWVQsUUFBUSxjQUFSLENBTGQ7QUFBQSxNQU1FVSxXQUFXVixRQUFRLGtCQUFSLENBTmI7QUFBQSxNQU9FVyxXQUFXWCxRQUFRLGVBQVIsQ0FQYjtBQUFBLE1BUUVZLHFCQUFxQlosUUFBUSxrRUFBUixDQVJ2Qjs7QUFQa0IsTUFpQlphLFFBakJZO0FBQUE7O0FBa0JoQix3QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCVCxLQUE3QztBQUNBUSxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFU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bnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuXG4gICAgTW9kZWxIaXN0b3J5Rm9ybSA9IHJlcXVpcmUoJy4uL2hpc3RvcnkvZm9ybScpLFxuICAgIE1vZGVsRm9ybSA9IHJlcXVpcmUoJy4uL2Zvcm0vZm9ybScpLFxuICAgIE5hbWVGb3JtID0gcmVxdWlyZSgnLi4vbmFtZWZvcm0vZm9ybScpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpLFxuICAgIEJvZHlDb25maWd1cmF0aW9ucyA9IHJlcXVpcmUoJ2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvYm9keWNvbmZpZ3MnKTtcblxuICBjbGFzcyBNb2RlbFRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vblNpbXVsYXRlUmVxdWVzdCcsICdfb25TYXZlUmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19vbk5hbWVDYW5jZWwnLCAnX29uTmFtZVN1Ym1pdCcsICdfb25HbG9iYWxzQ2hhbmdlJywgJ19sb2FkTW9kZWxJbkZvcm0nLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3UmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZScsXG4gICAgICAgICdfb25EaXNhYmxlUmVxdWVzdCcsJ19vbkVuYWJsZVJlcXVlc3QnXG4gICAgICBdKTtcblxuICAgICAgdGhpcy5faGlzdG9yeSA9IE1vZGVsSGlzdG9yeUZvcm0uY3JlYXRlKHtcbiAgICAgICAgaWQ6IGBtb2RlbF9oaXN0b3J5X18ke3RoaXMuX21vZGVsLmdldChcImlkXCIpfWAsXG4gICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcblxuICAgICAgdGhpcy5fZm9ybSA9IE1vZGVsRm9ybS5jcmVhdGUoe1xuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgIGZpZWxkQ29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKSxcbiAgICAgICAgZXVnbGVuYUNvdW50Q29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ2V1Z2xlbmFDb3VudCcpLFxuICAgICAgICBldWdsZW5hSW5pdENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdldWdsZW5hSW5pdCcpXG4gICAgICB9KVxuICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TaW11bGF0ZScsIHRoaXMuX29uU2ltdWxhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TYXZlJywgdGhpcy5fb25TYXZlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld1JlcXVlc3QpO1xuXG4gICAgICAvLyBJbnNlcnQgYSB0aXRsZSBvZiB0aGUgdGFiXG4gICAgICB2YXIgdGl0bGVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgIHRpdGxlTm9kZS5jbGFzc05hbWUgPSAndGFiX19tb2RlbF9fdGl0bGUnXG4gICAgICB0aXRsZU5vZGUuaW5uZXJIVE1MID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC5tb2RlbE5hbWUnKSA/IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwubW9kZWxOYW1lJykgOiAnTW9kZWwgb2YgdGhlIEJvZHknO1xuXG4gICAgICB0aGlzLnZpZXcoKS4kZG9tKCkuYXBwZW5kKHRpdGxlTm9kZSlcblxuICAgICAgdGhpcy5fbmFtZUZvcm0gPSBOYW1lRm9ybS5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuU3VibWl0JywgdGhpcy5fb25OYW1lU3VibWl0KTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuQ2FuY2VsJywgdGhpcy5fb25OYW1lQ2FuY2VsKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcblxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIC8vIENyZWF0ZSBib2R5IGNvbmZpZ3VyYXRpb24gbW9kZWwgaW5zdGFuY2UuXG4gICAgICAgIHZhciBpbml0aWFsQm9keSA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICAgIHZhciBwYXJhbU9wdGlvbnMgPSB7fVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ3JlYWN0aW9uJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5LLm9wdGlvbnMpXG4gICAgICAgIHBhcmFtT3B0aW9uc1snbW90b3InXSA9IE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLnYub3B0aW9ucylcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLm9tZWdhKSB7XG4gICAgICAgICAgcGFyYW1PcHRpb25zWydyb2xsJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5vbWVnYS5vcHRpb25zKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLm1vdGlvbikge1xuICAgICAgICAgIHBhcmFtT3B0aW9uc1snbW90aW9uJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5tb3Rpb24ub3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucyA9IEJvZHlDb25maWd1cmF0aW9ucy5jcmVhdGUoe2luaXRpYWxDb25maWc6IGluaXRpYWxCb2R5LCBwYXJhbU9wdGlvbnM6IHBhcmFtT3B0aW9ucywgbW9kZWxSZXByZXNlbnRhdGlvbjogdGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykubW9kZWxSZXByZXNlbnRhdGlvbn0pXG5cbiAgICAgICAgLy8gYWRkIHZpZXcgb2YgdGhlIG1vZGVsIGluc3RhbmNlIHRvIHRoaXMudmlldygpXG4gICAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZENoaWxkKHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnZpZXcoKSxudWxsLDApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9mb3JtLnZpZXcoKSk7XG5cbiAgICAgIHRoaXMuX3NldE1vZGVsUmVwcmVzZW50YXRpb24oKTtcblxuICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5BZGQnLHRoaXMuX29uRGlzYWJsZVJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX29uRW5hYmxlUmVxdWVzdCk7XG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbElkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJNb2RlbElkO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50TW9kZWw7XG4gICAgfVxuXG4gICAgY29sb3IoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdjb2xvcicpXG4gICAgfVxuXG4gICAgaGlzdG9yeUNvdW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCk7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgJ3N0dWRlbnRfaWQnOlxuICAgICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KClcbiAgICAgICAgICAgIGlmIChoaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IGhpc3RbaGlzdC5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQubmFtZSA9PT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oJ19uZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7IHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTsgfVxuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGhlcmUsIGNoYW5nZSB0aGUgaW1hZ2UgYW5kIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBib2R5Q29uZmlndXJhdGlvbiAoc2Vuc29yQ29uZmlnLCBtb3RvciwgcmVhY3QsIHJvbGwsIG1vdGlvbiB0eXBlKSBoYXMgYmVlbiBzZWxlY3RlZC5cbiAgICAgIGlmIChldnQubmFtZSA9PT0gJ0Zvcm0uRmllbGRDaGFuZ2VkJykge1xuICAgICAgICBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09PSAnb3BhY2l0eScpIHtcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRCb2R5T3BhY2l0eShldnQuZGF0YS5kZWx0YS52YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2UgaWYgKGV2dC5jdXJyZW50VGFyZ2V0Ll9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gJ2Jsb2NrbHknKXtcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKGV2dC5kYXRhLmRlbHRhLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9sb2FkTW9kZWxJbkZvcm0oaWQpIHtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGxldCBvbGRJZCA9IHRoaXMuX2N1cnJNb2RlbElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gaWQ7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke2lkfWApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IGRhdGE7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0Jsb2NrbHkuTG9hZCcsIGRhdGEuYmxvY2tseVhtbCk7XG4gICAgICAgICAgICAgIGZvciAobGV0IGlkeCA9IE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbikubGVuZ3RoIC0gMTsgaWR4ID49IDA7IGlkeC0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoT2JqZWN0LmtleXMoZGF0YS5jb25maWd1cmF0aW9uKVtpZHhdLm1hdGNoKFwiX3xjb3VudFwiKSkpIHtcbiAgICAgICAgICAgICAgICAgIGxldCBlbGVtTmFtZSA9IE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbilbaWR4XVxuICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihkYXRhLmNvbmZpZ3VyYXRpb25bZWxlbU5hbWVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZm9ybS5pbXBvcnQoZGF0YS5jb25maWd1cmF0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKVxuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBkYXRhLFxuICAgICAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ2hpc3RvcmljYWwnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgaWQ6ICdfbmV3J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fc2lsZW5jZUxvYWRMb2dzKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsSWQ6IGlkLFxuICAgICAgICAgICAgICB0YWI6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGFzdFNpbVNhdmVkICYmIHRoaXMuX2xhc3RTaW1TYXZlZC5pZCA9PSBvbGRJZCkge1xuICAgICAgICAvLyBoYW5kbGUgXCJyZXJ1bm5pbmdcIiBhIHNpbXVsYXRpb25cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5fbGFzdFNpbVNhdmVkLFxuICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TaW11bGF0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB2YXIgY29uZiA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICB2YXIgYmxvY2tseURhdGEgPSBudWxsO1xuICAgICAgdmFyIHNlbnNvckNvbmZpZ0pTT04gPSBudWxsO1xuXG4gICAgICB2YXIgc2F2ZURhdGEgPSB7XG4gICAgICAgIG5hbWU6IFwiKHNpbXVsYXRpb24pXCIsXG4gICAgICAgIHNpbXVsYXRlZDogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhdGlvbjogY29uZlxuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgYWN0aXZlIHRhYiBpcyAnYmxvY2tseScsIHRoZW4gd2UgaGF2ZSB0byBjb21waWxlIGFuZCBleHRyYWN0IHRoZSBibG9ja2x5IGNvZGUuXG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgYmxvY2tseURhdGEgPSB0aGlzLl9leHRyYWN0QmxvY2tseSgpO1xuICAgICAgICBzYXZlRGF0YSA9ICQuZXh0ZW5kKHNhdmVEYXRhLGJsb2NrbHlEYXRhKTtcbiAgICAgICAgc2Vuc29yQ29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLmdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24oKSk7XG4gICAgICAgIHNhdmVEYXRhID0gJC5leHRlbmQoc2F2ZURhdGEse3NlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT059KVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zYXZlTW9kZWwoIHNhdmVEYXRhICkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICB9KVxuXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzaW11bGF0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGJsb2NrbHlEYXRhID8gJC5leHRlbmQoY29uZiwge2pzQ29kZTogYmxvY2tseURhdGEuanNDb2RlLCBzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OfSkgOiBjb25mXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX2V4dHJhY3RCbG9ja2x5KCkge1xuICAgICAgLy8gZ2V0IHRoZSBCbG9ja2x5IGNvZGUgeG1sXG4gICAgICB2YXIgYmxvY2tseVhtbCA9IHdpbmRvdy5CbG9ja2x5LlhtbC53b3Jrc3BhY2VUb0RvbSh3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkpO1xuXG4gICAgICAvLyByZW1vdmUgYmxvY2tzIGZyb20gYmxvY2tseVhtbCB0aGF0IGFyZSBub3Qgd2l0aGluIHRoZSBtYWluIGJsb2NrXG4gICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChibG9ja2x5WG1sLmNoaWxkTm9kZXMpLm1hcCgoY2hpbGROb2RlKSA9PiB7XG4gICAgICAgIGlmIChjaGlsZE5vZGUudGFnTmFtZSA9PSAnQkxPQ0snICYmIGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSAhPSAnbWFzdGVyX2Jsb2NrJykge1xuICAgICAgICAgIGJsb2NrbHlYbWwucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGdlbmVyYXRlIHRoZSBqYXZhc2NyaXB0IGNvZGUgb2YgdGhlIG1haW4gYmxvY2tcbiAgICAgIHZhciBibG9ja3MgPSB3aW5kb3cuQmxvY2tseS5tYWluV29ya3NwYWNlLmdldFRvcEJsb2Nrcyh0cnVlKTtcbiAgICAgIHZhciBmb3VuZE1haW5CbG9jayA9IGZhbHNlO1xuICAgICAgdmFyIGpzQ29kZSA9ICcnO1xuICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCBibG9ja3MubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgaWYgKGJsb2Nrc1tiXS50eXBlID09ICdtYXN0ZXJfYmxvY2snKSB7XG4gICAgICAgICAganNDb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5ibG9ja1RvQ29kZShibG9ja3NbYl0pXG4gICAgICAgICAgZm91bmRNYWluQmxvY2sgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmRNYWluQmxvY2spIHthbGVydCgndGhlcmUgaXMgbm8gbWFpbiBibG9jaycpfVxuXG4gICAgICAvL3dpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuYWRkUmVzZXJ2ZWRXb3JkcygnanNDb2RlJyk7XG4gICAgICAvL3ZhciBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LndvcmtzcGFjZVRvQ29kZSggd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpICk7XG5cbiAgICAgIC8vIHJldHVybiB4bWwgYW5kIGpzQ29kZSBhcyBzdHJpbmdzIHdpdGhpbiBqcyBvYmplY3RcbiAgICAgIC8vIHN0cmluZ2lmeTogYmxvY2tseVhtbC5vdXRlckhUTUwgLy8gQWx0ZXJuYXRpdmVseTogYmxvY2tseVhtbFRleHQgPSB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9UZXh0KHhtbCkgKHByb2R1Y2VzIG1pbmltYWwsIHVnbHkgc3RyaW5nKVxuICAgICAgLy8geG1sLWlmeSB3aXRoIGpxdWVyeTogJC5wYXJzZVhNTChzdHJpbmcpLmRvY3VtZW50RWxlbWVudFxuICAgICAgLy8gQWx0ZXJuYXRpdmVseSBmb3IgcmVjcmVhdGluZyBibG9ja3M6IGJsb2NrbHlYbWwgPSB3aW5kb3cuWG1sLnRleHRUb0RvbShibG9ja2x5WG1sVGV4dCkgJiB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2Uod2luZG93LkJsb2NrbHkubWFpbldvcmtzcGFjZSwgYmxvY2tseVhtbClcbiAgICAgIHJldHVybiB7YmxvY2tseVhtbDogYmxvY2tseVhtbC5vdXRlckhUTUwsIGpzQ29kZToganNDb2RlfVxuICAgIH1cblxuICAgIF9vblNhdmVSZXF1ZXN0KGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5kaXNwbGF5KHRoaXMuX25hbWVGb3JtLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfc2F2ZU1vZGVsKGRhdGEpIHtcbiAgICAgIGRhdGEuc3R1ZGVudElkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGRhdGEubW9kZWxUeXBlID0gdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKTtcbiAgICAgIGRhdGEubGFiID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKTtcbiAgICAgIGxldCBzYXZlT3JVcGRhdGU7XG4gICAgICBpZiAodGhpcy5fbGFzdFNpbVNhdmVkKSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHt0aGlzLl9sYXN0U2ltU2F2ZWQuaWR9YCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BBVENIJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICAgICAgICBzaW11bGF0ZWQ6IGRhdGEuc2ltdWxhdGVkXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2F2ZU9yVXBkYXRlID0gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXVnbGVuYU1vZGVscycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gc2F2ZU9yVXBkYXRlLnRoZW4oKHNlcnZlckRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuc2ltdWxhdGVkKSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gc2VydmVyRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VydmVyRGF0YSkgcmV0dXJuO1xuICAgICAgICByZXR1cm4gc2VydmVyRGF0YTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZVN1Ym1pdChldnQpIHtcbiAgICAgIGxldCBtb2RlbDtcblxuICAgICAgdmFyIGJsb2NrbHlEYXRhID0gbnVsbDtcbiAgICAgIHZhciBzZW5zb3JDb25maWdKU09OID0gbnVsbDtcblxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgICAgc2Vuc29yQ29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLmdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24oKSk7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gJC5leHRlbmQoYmxvY2tseURhdGEse3NlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT059KVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9uYW1lRm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NhdmVNb2RlbCgkLmV4dGVuZChibG9ja2x5RGF0YSx7XG4gICAgICAgICAgbmFtZTogdGhpcy5fbmFtZUZvcm0uZXhwb3J0KCkubmFtZSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9mb3JtLmV4cG9ydCgpLFxuICAgICAgICAgIHNpbXVsYXRlZDogZmFsc2VcbiAgICAgICAgfSkpXG4gICAgICB9KS50aGVuKChtb2RlbCkgPT4ge1xuICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IG1vZGVsLmlkXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzYXZlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBibG9ja2x5RGF0YSA/ICQuZXh0ZW5kKHRoaXMuX2Zvcm0uZXhwb3J0KCksIHtzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OLCBqc0NvZGU6IGJsb2NrbHlEYXRhLmpzQ29kZX0pIDogdGhpcy5fZm9ybS5leHBvcnQoKSAsXG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lQ2FuY2VsKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRNb2RlbFJlc3VsdHMoR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50LmlkJyksIHRoaXMuX2N1cnJlbnRNb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uRGlzYWJsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgIGNhc2UgXCJjcmVhdGVcIjpcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0uZGlzYWJsZSgpO1xuICAgICAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0uZGlzYWJsZSgpO1xuICAgICAgICAgICAgdGhpcy5faGlzdG9yeS5lbmFibGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkVuYWJsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgIGNhc2UgXCJjcmVhdGVcIjpcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0uZW5hYmxlKCk7XG4gICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICB0aGlzLl9mb3JtLmVuYWJsZSgpO1xuICAgICAgICAgICAgdGhpcy5fZm9ybS5wYXJ0aWFsbHlEaXNhYmxlRmllbGRzKFsnY291bnQnLCdpbml0aWFsaXphdGlvbiddKTtcbiAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuZW5hYmxlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25OZXdSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fb25Db25maWdDaGFuZ2UoZXZ0KTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0TW9kZWxSZXByZXNlbnRhdGlvbigpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykpIHtcbiAgICAgICAgc3dpdGNoKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgdGhpcy5faGlzdG9yeS5oaWRlRmllbGRzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsVGFiLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbFRhYih7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbFRhYjtcblxufSlcbiJdfQ==
