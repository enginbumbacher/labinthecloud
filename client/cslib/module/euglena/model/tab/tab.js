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
        this._form.disable();
        this._history.disable();
      }
    }, {
      key: '_onEnableRequest',
      value: function _onEnableRequest(evt) {
        this._form.enable();
        this._history.enable();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiZXVnbGVuYUluaXRDb25maWciLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uU2ltdWxhdGVSZXF1ZXN0IiwiX29uU2F2ZVJlcXVlc3QiLCJfb25BZ2dyZWdhdGVSZXF1ZXN0IiwiX29uTmV3UmVxdWVzdCIsInRpdGxlTm9kZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImlubmVySFRNTCIsIiRkb20iLCJhcHBlbmQiLCJfbmFtZUZvcm0iLCJfb25OYW1lU3VibWl0IiwiX29uTmFtZUNhbmNlbCIsImFkZENoaWxkIiwiaW5pdGlhbEJvZHkiLCJleHBvcnQiLCJwYXJhbU9wdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwiSyIsIm9wdGlvbnMiLCJ2Iiwib21lZ2EiLCJtb3Rpb24iLCJib2R5Q29uZmlndXJhdGlvbnMiLCJpbml0aWFsQ29uZmlnIiwibW9kZWxSZXByZXNlbnRhdGlvbiIsIl9zZXRNb2RlbFJlcHJlc2VudGF0aW9uIiwiX29uR2xvYmFsc0NoYW5nZSIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRGlzYWJsZVJlcXVlc3QiLCJfb25FbmFibGVSZXF1ZXN0IiwiX2N1cnJNb2RlbElkIiwiX2N1cnJlbnRNb2RlbCIsImhpc3RvcnlDb3VudCIsImV2dCIsImRhdGEiLCJwYXRoIiwidXBkYXRlIiwidGhlbiIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwibW9kZWxfaGlzdG9yeV9pZCIsInNldFN0YXRlIiwiX2xvYWRNb2RlbEluRm9ybSIsIm5hbWUiLCJfZGF0YSIsImN1cnJlbnRUYXJnZXQiLCJfbGFzdFNpbVNhdmVkIiwiZmllbGQiLCJzZXRCb2R5T3BhY2l0eSIsImRlbHRhIiwidmFsdWUiLCJzZXRBY3RpdmVDb25maWd1cmF0aW9uIiwib2xkSWQiLCJ0YXJnZXQiLCJwcm9taXNlQWpheCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwYXRjaEV2ZW50IiwiYmxvY2tseVhtbCIsImlkeCIsImNvbmZpZ3VyYXRpb24iLCJtYXRjaCIsImVsZW1OYW1lIiwibW9kZWwiLCJ0YWJJZCIsInNpbXVsYXRlZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsIm1vZGVsSWQiLCJ0YWIiLCJjb25mIiwiYmxvY2tseURhdGEiLCJzZW5zb3JDb25maWdKU09OIiwic2F2ZURhdGEiLCJfZXh0cmFjdEJsb2NrbHkiLCJleHRlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiZ2V0QWN0aXZlU2Vuc29yQ29uZmlndXJhdGlvbiIsIl9zYXZlTW9kZWwiLCJqc0NvZGUiLCJ3aW5kb3ciLCJCbG9ja2x5IiwiWG1sIiwid29ya3NwYWNlVG9Eb20iLCJnZXRNYWluV29ya3NwYWNlIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJjaGlsZE5vZGVzIiwibWFwIiwiY2hpbGROb2RlIiwidGFnTmFtZSIsImdldEF0dHJpYnV0ZSIsInJlbW92ZUNoaWxkIiwiYmxvY2tzIiwibWFpbldvcmtzcGFjZSIsImdldFRvcEJsb2NrcyIsImZvdW5kTWFpbkJsb2NrIiwiYiIsIkphdmFTY3JpcHQiLCJibG9ja1RvQ29kZSIsImFsZXJ0Iiwib3V0ZXJIVE1MIiwiZGlzcGxheSIsInN0dWRlbnRJZCIsImxhYiIsInNhdmVPclVwZGF0ZSIsIm1ldGhvZCIsImNvbnRlbnRUeXBlIiwic2VydmVyRGF0YSIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsImhpZGUiLCJjbGVhciIsImdldE1vZGVsUmVzdWx0cyIsInJlc3VsdHMiLCJkaXNhYmxlIiwiZW5hYmxlIiwicGhhc2UiLCJ0b0xvd2VyQ2FzZSIsImhpZGVGaWVsZHMiLCJkaXNhYmxlRmllbGRzIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLElBQUlELFFBQVEsUUFBUixDQUFWOztBQUVBLE1BQU1FLFVBQVVGLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRyxRQUFRSCxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFSSxLQUFLSixRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUssWUFBWUwsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VNLFFBQVFOLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU8sT0FBT1AsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUlFUSxtQkFBbUJSLFFBQVEsaUJBQVIsQ0FKckI7QUFBQSxNQUtFUyxZQUFZVCxRQUFRLGNBQVIsQ0FMZDtBQUFBLE1BTUVVLFdBQVdWLFFBQVEsa0JBQVIsQ0FOYjtBQUFBLE1BT0VXLFdBQVdYLFFBQVEsZUFBUixDQVBiO0FBQUEsTUFRRVkscUJBQXFCWixRQUFRLGtFQUFSLENBUnZCOztBQVBrQixNQWlCWmEsUUFqQlk7QUFBQTs7QUFrQmhCLHdCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJULEtBQTdDO0FBQ0FRLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JULElBQTNDOztBQUZ5QixzSEFH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RUFBOEN5SSxXQUE5QyxFQUFQO0FBQ0ksaUJBQUssU0FBTDtBQUNFLG1CQUFLcEksS0FBTCxDQUFXcUksVUFBWDtBQUNBLG1CQUFLOUksUUFBTCxDQUFjOEksVUFBZDtBQUNGO0FBQ0EsaUJBQUssU0FBTDtBQUNFLG1CQUFLckksS0FBTCxDQUFXc0ksYUFBWDtBQUNBLG1CQUFLL0ksUUFBTCxDQUFjK0ksYUFBZDtBQUNGO0FBUko7QUFVRDtBQUNGO0FBaGJlOztBQUFBO0FBQUEsSUFpQks1SixTQWpCTDs7QUFvYmxCUSxXQUFTTSxNQUFULEdBQWtCLFVBQUNtRCxJQUFELEVBQVU7QUFDMUIsV0FBTyxJQUFJekQsUUFBSixDQUFhLEVBQUVxSixXQUFXNUYsSUFBYixFQUFiLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU96RCxRQUFQO0FBRUQsQ0ExYkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvdGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcblxuICAgIE1vZGVsSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBNb2RlbEZvcm0gPSByZXF1aXJlKCcuLi9mb3JtL2Zvcm0nKSxcbiAgICBOYW1lRm9ybSA9IHJlcXVpcmUoJy4uL25hbWVmb3JtL2Zvcm0nKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKSxcbiAgICBCb2R5Q29uZmlndXJhdGlvbnMgPSByZXF1aXJlKCdldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzJyk7XG5cbiAgY2xhc3MgTW9kZWxUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25TaW11bGF0ZVJlcXVlc3QnLCAnX29uU2F2ZVJlcXVlc3QnLCAnX29uQWdncmVnYXRlUmVxdWVzdCcsXG4gICAgICAgICdfb25OYW1lQ2FuY2VsJywgJ19vbk5hbWVTdWJtaXQnLCAnX29uR2xvYmFsc0NoYW5nZScsICdfbG9hZE1vZGVsSW5Gb3JtJyxcbiAgICAgICAgJ19vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UnLCAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld1JlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgICAnX29uRGlzYWJsZVJlcXVlc3QnLCdfb25FbmFibGVSZXF1ZXN0J1xuICAgICAgXSk7XG5cbiAgICAgIHRoaXMuX2hpc3RvcnkgPSBNb2RlbEhpc3RvcnlGb3JtLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBgbW9kZWxfaGlzdG9yeV9fJHt0aGlzLl9tb2RlbC5nZXQoXCJpZFwiKX1gLFxuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX2Zvcm0gPSBNb2RlbEZvcm0uY3JlYXRlKHtcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICBmaWVsZENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJyksXG4gICAgICAgIGV1Z2xlbmFDb3VudENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdldWdsZW5hQ291bnQnKSxcbiAgICAgICAgZXVnbGVuYUluaXRDb25maWc6IHRoaXMuX21vZGVsLmdldCgnZXVnbGVuYUluaXQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2ltdWxhdGUnLCB0aGlzLl9vblNpbXVsYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2F2ZScsIHRoaXMuX29uU2F2ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdSZXF1ZXN0KTtcblxuICAgICAgLy8gSW5zZXJ0IGEgdGl0bGUgb2YgdGhlIHRhYlxuICAgICAgdmFyIHRpdGxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICB0aXRsZU5vZGUuY2xhc3NOYW1lID0gJ3RhYl9fbW9kZWxfX3RpdGxlJ1xuICAgICAgdGl0bGVOb2RlLmlubmVySFRNTCA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwubW9kZWxOYW1lJykgPyBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLm1vZGVsTmFtZScpIDogJ01vZGVsIG9mIHRoZSBCb2R5JztcblxuICAgICAgdGhpcy52aWV3KCkuJGRvbSgpLmFwcGVuZCh0aXRsZU5vZGUpXG5cbiAgICAgIHRoaXMuX25hbWVGb3JtID0gTmFtZUZvcm0uY3JlYXRlKCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLlN1Ym1pdCcsIHRoaXMuX29uTmFtZVN1Ym1pdCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLkNhbmNlbCcsIHRoaXMuX29uTmFtZUNhbmNlbCk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICAvLyBDcmVhdGUgYm9keSBjb25maWd1cmF0aW9uIG1vZGVsIGluc3RhbmNlLlxuICAgICAgICB2YXIgaW5pdGlhbEJvZHkgPSB0aGlzLl9mb3JtLmV4cG9ydCgpO1xuICAgICAgICB2YXIgcGFyYW1PcHRpb25zID0ge31cbiAgICAgICAgcGFyYW1PcHRpb25zWydyZWFjdGlvbiddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykuSy5vcHRpb25zKVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ21vdG9yJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS52Lm9wdGlvbnMpXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5vbWVnYSkge1xuICAgICAgICAgIHBhcmFtT3B0aW9uc1sncm9sbCddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykub21lZ2Eub3B0aW9ucylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5tb3Rpb24pIHtcbiAgICAgICAgICBwYXJhbU9wdGlvbnNbJ21vdGlvbiddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykubW90aW9uLm9wdGlvbnMpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMgPSBCb2R5Q29uZmlndXJhdGlvbnMuY3JlYXRlKHtpbml0aWFsQ29uZmlnOiBpbml0aWFsQm9keSwgcGFyYW1PcHRpb25zOiBwYXJhbU9wdGlvbnMsIG1vZGVsUmVwcmVzZW50YXRpb246IHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLm1vZGVsUmVwcmVzZW50YXRpb259KVxuXG4gICAgICAgIC8vIGFkZCB2aWV3IG9mIHRoZSBtb2RlbCBpbnN0YW5jZSB0byB0aGlzLnZpZXcoKVxuICAgICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRDaGlsZCh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy52aWV3KCksbnVsbCwwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZm9ybS52aWV3KCkpO1xuXG4gICAgICB0aGlzLl9zZXRNb2RlbFJlcHJlc2VudGF0aW9uKCk7XG5cbiAgICAgIEdsb2JhbHMuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25HbG9iYWxzQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuQWRkJyx0aGlzLl9vbkRpc2FibGVSZXF1ZXN0KTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9vbkVuYWJsZVJlcXVlc3QpO1xuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG5cbiAgICBjdXJyTW9kZWxJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyTW9kZWxJZDtcbiAgICB9XG5cbiAgICBjdXJyTW9kZWwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3VycmVudE1vZGVsO1xuICAgIH1cblxuICAgIGNvbG9yKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnY29sb3InKVxuICAgIH1cblxuICAgIGhpc3RvcnlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5Lmhpc3RvcnlDb3VudCgpO1xuICAgIH1cblxuICAgIF9vbkdsb2JhbHNDaGFuZ2UoZXZ0KSB7XG4gICAgICBzd2l0Y2goZXZ0LmRhdGEucGF0aCkge1xuICAgICAgICBjYXNlICdzdHVkZW50X2lkJzpcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgICBpZiAoaGlzdC5sZW5ndGggJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpPT0nY3JlYXRlJykge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IGhpc3RbaGlzdC5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQubmFtZSA9PT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oJ19uZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7IHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTsgfVxuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGhlcmUsIGNoYW5nZSB0aGUgaW1hZ2UgYW5kIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBib2R5Q29uZmlndXJhdGlvbiAoc2Vuc29yQ29uZmlnLCBtb3RvciwgcmVhY3QsIHJvbGwsIG1vdGlvbiB0eXBlKSBoYXMgYmVlbiBzZWxlY3RlZC5cbiAgICAgIGlmIChldnQubmFtZSA9PT0gJ0Zvcm0uRmllbGRDaGFuZ2VkJykge1xuICAgICAgICBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09PSAnb3BhY2l0eScpIHtcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRCb2R5T3BhY2l0eShldnQuZGF0YS5kZWx0YS52YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2UgaWYgKGV2dC5jdXJyZW50VGFyZ2V0Ll9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gJ2Jsb2NrbHknKXtcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKGV2dC5kYXRhLmRlbHRhLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9sb2FkTW9kZWxJbkZvcm0oaWQpIHtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGxldCBvbGRJZCA9IHRoaXMuX2N1cnJNb2RlbElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gaWQ7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke2lkfWApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IGRhdGE7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0Jsb2NrbHkuTG9hZCcsIGRhdGEuYmxvY2tseVhtbCk7XG4gICAgICAgICAgICAgIGZvciAobGV0IGlkeCA9IE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbikubGVuZ3RoIC0gMTsgaWR4ID49IDA7IGlkeC0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoT2JqZWN0LmtleXMoZGF0YS5jb25maWd1cmF0aW9uKVtpZHhdLm1hdGNoKFwiX3xjb3VudFwiKSkpIHtcbiAgICAgICAgICAgICAgICAgIGxldCBlbGVtTmFtZSA9IE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbilbaWR4XVxuICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihkYXRhLmNvbmZpZ3VyYXRpb25bZWxlbU5hbWVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZm9ybS5pbXBvcnQoZGF0YS5jb25maWd1cmF0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKVxuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBkYXRhLFxuICAgICAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ2hpc3RvcmljYWwnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgaWQ6ICdfbmV3J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fc2lsZW5jZUxvYWRMb2dzKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsSWQ6IGlkLFxuICAgICAgICAgICAgICB0YWI6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGFzdFNpbVNhdmVkICYmIHRoaXMuX2xhc3RTaW1TYXZlZC5pZCA9PSBvbGRJZCkge1xuICAgICAgICAvLyBoYW5kbGUgXCJyZXJ1bm5pbmdcIiBhIHNpbXVsYXRpb25cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5fbGFzdFNpbVNhdmVkLFxuICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TaW11bGF0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB2YXIgY29uZiA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICB2YXIgYmxvY2tseURhdGEgPSBudWxsO1xuICAgICAgdmFyIHNlbnNvckNvbmZpZ0pTT04gPSBudWxsO1xuXG4gICAgICB2YXIgc2F2ZURhdGEgPSB7XG4gICAgICAgIG5hbWU6IFwiKHNpbXVsYXRpb24pXCIsXG4gICAgICAgIHNpbXVsYXRlZDogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhdGlvbjogY29uZlxuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgYWN0aXZlIHRhYiBpcyAnYmxvY2tseScsIHRoZW4gd2UgaGF2ZSB0byBjb21waWxlIGFuZCBleHRyYWN0IHRoZSBibG9ja2x5IGNvZGUuXG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgYmxvY2tseURhdGEgPSB0aGlzLl9leHRyYWN0QmxvY2tseSgpO1xuICAgICAgICBzYXZlRGF0YSA9ICQuZXh0ZW5kKHNhdmVEYXRhLGJsb2NrbHlEYXRhKTtcbiAgICAgICAgc2Vuc29yQ29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLmdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24oKSk7XG4gICAgICAgIHNhdmVEYXRhID0gJC5leHRlbmQoc2F2ZURhdGEse3NlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT059KVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zYXZlTW9kZWwoIHNhdmVEYXRhICkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICB9KVxuXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzaW11bGF0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGJsb2NrbHlEYXRhID8gJC5leHRlbmQoY29uZiwge2pzQ29kZTogYmxvY2tseURhdGEuanNDb2RlLCBzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OfSkgOiBjb25mXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX2V4dHJhY3RCbG9ja2x5KCkge1xuICAgICAgLy8gZ2V0IHRoZSBCbG9ja2x5IGNvZGUgeG1sXG4gICAgICB2YXIgYmxvY2tseVhtbCA9IHdpbmRvdy5CbG9ja2x5LlhtbC53b3Jrc3BhY2VUb0RvbSh3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkpO1xuXG4gICAgICAvLyByZW1vdmUgYmxvY2tzIGZyb20gYmxvY2tseVhtbCB0aGF0IGFyZSBub3Qgd2l0aGluIHRoZSBtYWluIGJsb2NrXG4gICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChibG9ja2x5WG1sLmNoaWxkTm9kZXMpLm1hcCgoY2hpbGROb2RlKSA9PiB7XG4gICAgICAgIGlmIChjaGlsZE5vZGUudGFnTmFtZSA9PSAnQkxPQ0snICYmIGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSAhPSAnbWFzdGVyX2Jsb2NrJykge1xuICAgICAgICAgIGJsb2NrbHlYbWwucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gZ2VuZXJhdGUgdGhlIGphdmFzY3JpcHQgY29kZSBvZiB0aGUgbWFpbiBibG9ja1xuICAgICAgdmFyIGJsb2NrcyA9IHdpbmRvdy5CbG9ja2x5Lm1haW5Xb3Jrc3BhY2UuZ2V0VG9wQmxvY2tzKHRydWUpO1xuICAgICAgdmFyIGZvdW5kTWFpbkJsb2NrID0gZmFsc2U7XG4gICAgICB2YXIganNDb2RlID0gJyc7XG4gICAgICBmb3IgKHZhciBiID0gMDsgYiA8IGJsb2Nrcy5sZW5ndGg7IGIrKykge1xuICAgICAgICBpZiAoYmxvY2tzW2JdLnR5cGUgPT0gJ21hc3Rlcl9ibG9jaycpIHtcbiAgICAgICAgICBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LmJsb2NrVG9Db2RlKGJsb2Nrc1tiXSlcbiAgICAgICAgICBmb3VuZE1haW5CbG9jayA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3VuZE1haW5CbG9jaykge2FsZXJ0KCd0aGVyZSBpcyBubyBtYWluIGJsb2NrJyl9XG5cbiAgICAgIC8vd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5hZGRSZXNlcnZlZFdvcmRzKCdqc0NvZGUnKTtcbiAgICAgIC8vdmFyIGpzQ29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQud29ya3NwYWNlVG9Db2RlKCB3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkgKTtcblxuICAgICAgLy8gcmV0dXJuIHhtbCBhbmQganNDb2RlIGFzIHN0cmluZ3Mgd2l0aGluIGpzIG9iamVjdFxuICAgICAgLy8gc3RyaW5naWZ5OiBibG9ja2x5WG1sLm91dGVySFRNTCAvLyBBbHRlcm5hdGl2ZWx5OiBibG9ja2x5WG1sVGV4dCA9IHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1RleHQoeG1sKSAocHJvZHVjZXMgbWluaW1hbCwgdWdseSBzdHJpbmcpXG4gICAgICAvLyB4bWwtaWZ5IHdpdGgganF1ZXJ5OiAkLnBhcnNlWE1MKHN0cmluZykuZG9jdW1lbnRFbGVtZW50XG4gICAgICAvLyBBbHRlcm5hdGl2ZWx5IGZvciByZWNyZWF0aW5nIGJsb2NrczogYmxvY2tseVhtbCA9IHdpbmRvdy5YbWwudGV4dFRvRG9tKGJsb2NrbHlYbWxUZXh0KSAmIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZSh3aW5kb3cuQmxvY2tseS5tYWluV29ya3NwYWNlLCBibG9ja2x5WG1sKVxuICAgICAgcmV0dXJuIHtibG9ja2x5WG1sOiBibG9ja2x5WG1sLm91dGVySFRNTCwganNDb2RlOiBqc0NvZGV9XG4gICAgfVxuXG4gICAgX29uU2F2ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmRpc3BsYXkodGhpcy5fbmFtZUZvcm0udmlldygpKVxuICAgIH1cblxuICAgIF9zYXZlTW9kZWwoZGF0YSkge1xuICAgICAgZGF0YS5zdHVkZW50SWQgPSBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpO1xuICAgICAgZGF0YS5tb2RlbFR5cGUgPSB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpO1xuICAgICAgZGF0YS5sYWIgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpO1xuICAgICAgbGV0IHNhdmVPclVwZGF0ZTtcbiAgICAgIGlmICh0aGlzLl9sYXN0U2ltU2F2ZWQpIHtcbiAgICAgICAgc2F2ZU9yVXBkYXRlID0gVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke3RoaXMuX2xhc3RTaW1TYXZlZC5pZH1gLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgICAgICAgIHNpbXVsYXRlZDogZGF0YS5zaW11bGF0ZWRcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FdWdsZW5hTW9kZWxzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBzYXZlT3JVcGRhdGUudGhlbigoc2VydmVyRGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBzZXJ2ZXJEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXJ2ZXJEYXRhKSByZXR1cm47XG4gICAgICAgIHJldHVybiBzZXJ2ZXJEYXRhO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lU3VibWl0KGV2dCkge1xuICAgICAgbGV0IG1vZGVsO1xuXG4gICAgICB2YXIgYmxvY2tseURhdGEgPSBudWxsO1xuICAgICAgdmFyIHNlbnNvckNvbmZpZ0pTT04gPSBudWxsO1xuXG4gICAgICAvLyBpZiB0aGUgYWN0aXZlIHRhYiBpcyAnYmxvY2tseScsIHRoZW4gd2UgaGF2ZSB0byBjb21waWxlIGFuZCBleHRyYWN0IHRoZSBibG9ja2x5IGNvZGUuXG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgYmxvY2tseURhdGEgPSB0aGlzLl9leHRyYWN0QmxvY2tseSgpO1xuICAgICAgICBzZW5zb3JDb25maWdKU09OID0gSlNPTi5zdHJpbmdpZnkodGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuZ2V0QWN0aXZlU2Vuc29yQ29uZmlndXJhdGlvbigpKTtcbiAgICAgICAgYmxvY2tseURhdGEgPSAkLmV4dGVuZChibG9ja2x5RGF0YSx7c2Vuc29yQ29uZmlnSlNPTjogc2Vuc29yQ29uZmlnSlNPTn0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX25hbWVGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2F2ZU1vZGVsKCQuZXh0ZW5kKGJsb2NrbHlEYXRhLHtcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2Zvcm0uZXhwb3J0KCksXG4gICAgICAgICAgc2ltdWxhdGVkOiBmYWxzZVxuICAgICAgICB9KSlcbiAgICAgIH0pLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogbW9kZWwuaWRcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInNhdmVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGJsb2NrbHlEYXRhID8gJC5leHRlbmQodGhpcy5fZm9ybS5leHBvcnQoKSwge3NlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT04sIGpzQ29kZTogYmxvY2tseURhdGEuanNDb2RlfSkgOiB0aGlzLl9mb3JtLmV4cG9ydCgpICxcbiAgICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgICAgbmFtZTogdGhpcy5fbmFtZUZvcm0uZXhwb3J0KCkubmFtZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVDYW5jZWwoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fbmFtZUZvcm0uY2xlYXIoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX29uQWdncmVnYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIEV1Z1V0aWxzLmdldE1vZGVsUmVzdWx0cyhHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQuaWQnKSwgdGhpcy5fY3VycmVudE1vZGVsKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuQWRkUmVxdWVzdCcsIHtcbiAgICAgICAgICBkYXRhOiByZXN1bHRzXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwiYWdncmVnYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlbElkOiB0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25EaXNhYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX2Zvcm0uZGlzYWJsZSgpO1xuICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlKCk7XG4gICAgfVxuXG4gICAgX29uRW5hYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX2Zvcm0uZW5hYmxlKCk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZSgpO1xuICAgIH1cblxuICAgIF9vbk5ld1JlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9vbkNvbmZpZ0NoYW5nZShldnQpO1xuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgbW9kZWxfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRNb2RlbFJlcHJlc2VudGF0aW9uKCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSkge1xuICAgICAgICBzd2l0Y2goR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsVGFiLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbFRhYih7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbFRhYjtcblxufSlcbiJdfQ==
