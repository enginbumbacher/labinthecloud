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

      if (_this._model.get('modelType') == 'blockly') {
        // Create body configuration model instance.
        var initialBody = _this._form.export();
        var paramOptions = {};
        paramOptions['reaction'] = Object.keys(_this._model.get('parameters').K.options);
        paramOptions['forward'] = Object.keys(_this._model.get('parameters').v.options);
        paramOptions['roll'] = Object.keys(_this._model.get('parameters').omega.options);
        _this.bodyConfigurations = BodyConfigurations.create({ initialConfig: initialBody, paramOptions: paramOptions, modelModality: _this._model.get('modelModality') });

        // add view of the model instance to this.view()
        _this._form.view().addChild(_this.bodyConfigurations.view(), null, 0);
      }

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

        // In here, change the image and the toolbox according to which bodyConfiguration (sensorConfig, forward, react, roll) has been selected.
        if (evt.name == 'Form.FieldChanged') {
          if (evt.data.field._model._data.id == 'opacity') {
            this.bodyConfigurations.setBodyOpacity(evt.data.delta.value);
          } else {
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
                console.log('maybe it is here');
                console.log(data);
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

        console.log('onSimulateRequest ' + this._model.get('modelType'));

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

        console.log(sensorConfigJSON);

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
          if (childNode.tagName == 'BLOCK' && childNode.getAttribute('type') != 'every_time') {
            blocklyXml.removeChild(childNode);
          }
        });

        // generate the javascript code of the main block
        var blocks = window.Blockly.mainWorkspace.getTopBlocks(true);
        var foundMainBlock = false;
        var jsCode = '';
        for (var b = 0; b < blocks.length; b++) {
          if (blocks[b].type == 'every_time') {
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
        var sensorConfigJSON = null;
        console.log("name submit " + this._model.get('modelType'));
        // if the active tab is 'blockly', then we have to compile and extract the blockly code.
        if (this._model.get('modelType') == 'blockly') {
          blocklyData = this._extractBlockly();
          sensorConfigJSON = JSON.stringify(this.bodyConfigurations.getActiveSensorConfiguration());
          blocklyData = $.extend(blocklyData, { sensorConfig: sensorConfigJSON });
        }

        console.log(sensorConfigJSON);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJfbmFtZUZvcm0iLCJfb25OYW1lU3VibWl0IiwiX29uTmFtZUNhbmNlbCIsImFkZENoaWxkIiwiaW5pdGlhbEJvZHkiLCJleHBvcnQiLCJwYXJhbU9wdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwiSyIsIm9wdGlvbnMiLCJ2Iiwib21lZ2EiLCJib2R5Q29uZmlndXJhdGlvbnMiLCJpbml0aWFsQ29uZmlnIiwibW9kZWxNb2RhbGl0eSIsIl9zZXRNb2RlbE1vZGFsaXR5IiwiX29uR2xvYmFsc0NoYW5nZSIsIl9vblBoYXNlQ2hhbmdlIiwiX2N1cnJNb2RlbElkIiwiX2N1cnJlbnRNb2RlbCIsImhpc3RvcnlDb3VudCIsImV2dCIsImRhdGEiLCJwYXRoIiwidXBkYXRlIiwidGhlbiIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwibW9kZWxfaGlzdG9yeV9pZCIsInNldFN0YXRlIiwiX2xvYWRNb2RlbEluRm9ybSIsIm5hbWUiLCJfZGF0YSIsImN1cnJlbnRUYXJnZXQiLCJfbGFzdFNpbVNhdmVkIiwiZmllbGQiLCJzZXRCb2R5T3BhY2l0eSIsImRlbHRhIiwidmFsdWUiLCJzZXRBY3RpdmVDb25maWd1cmF0aW9uIiwib2xkSWQiLCJ0YXJnZXQiLCJwcm9taXNlQWpheCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwYXRjaEV2ZW50IiwiYmxvY2tseVhtbCIsImlkeCIsImNvbmZpZ3VyYXRpb24iLCJtYXRjaCIsImVsZW1OYW1lIiwiY29uc29sZSIsImxvZyIsIm1vZGVsIiwidGFiSWQiLCJzaW11bGF0ZWQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImJsb2NrbHlEYXRhIiwic2Vuc29yQ29uZmlnSlNPTiIsInNhdmVEYXRhIiwiX2V4dHJhY3RCbG9ja2x5IiwiZXh0ZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24iLCJfc2F2ZU1vZGVsIiwianNDb2RlIiwid2luZG93IiwiQmxvY2tseSIsIlhtbCIsIndvcmtzcGFjZVRvRG9tIiwiZ2V0TWFpbldvcmtzcGFjZSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiY2hpbGROb2RlcyIsIm1hcCIsImNoaWxkTm9kZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVDaGlsZCIsImJsb2NrcyIsIm1haW5Xb3Jrc3BhY2UiLCJnZXRUb3BCbG9ja3MiLCJmb3VuZE1haW5CbG9jayIsImIiLCJKYXZhU2NyaXB0IiwiYmxvY2tUb0NvZGUiLCJhbGVydCIsIm91dGVySFRNTCIsImRpc3BsYXkiLCJzdHVkZW50SWQiLCJsYWIiLCJzYXZlT3JVcGRhdGUiLCJtZXRob2QiLCJjb250ZW50VHlwZSIsInNlcnZlckRhdGEiLCJzZW5zb3JDb25maWciLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJoaWRlIiwiY2xlYXIiLCJnZXRNb2RlbFJlc3VsdHMiLCJyZXN1bHRzIiwicGhhc2UiLCJ0b0xvd2VyQ2FzZSIsImhpZGVGaWVsZHMiLCJkaXNhYmxlRmllbGRzIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLElBQUlELFFBQVEsUUFBUixDQUFWOztBQUVBLE1BQU1FLFVBQVVGLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRyxRQUFRSCxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFSSxLQUFLSixRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUssWUFBWUwsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VNLFFBQVFOLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU8sT0FBT1AsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUlFUSxtQkFBbUJSLFFBQVEsaUJBQVIsQ0FKckI7QUFBQSxNQUtFUyxZQUFZVCxRQUFRLGNBQVIsQ0FMZDtBQUFBLE1BTUVVLFdBQVdWLFFBQVEsa0JBQVIsQ0FOYjtBQUFBLE1BT0VXLFdBQVdYLFFBQVEsZUFBUixDQVBiO0FBQUEsTUFRRVkscUJBQXFCWixRQUFRLGtFQUFSLENBUnZCOztBQVBrQixNQWlCWmEsUUFqQlk7QUFBQTs7QUFrQmhCLHdCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJULEtBQTdDO0FBQ0FRLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JULElBQTNDOztBQUZ5QixzSEFHbkJPLFFBSG1COztBQUl6QlgsWUFBTWMsV0FBTixRQUF3QixDQUN0QixvQkFEc0IsRUFDQSxnQkFEQSxFQUNrQixxQkFEbEIsRUFFdEIsZUFGc0IsRUFFTCxlQUZLLEVBRVksa0JBRlosRUFFZ0Msa0JBRmhDLEVBR3RCLDJCQUhzQixFQUdPLGlCQUhQLEVBRzBCLGVBSDFC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QWpaZTtBQUFBO0FBQUEsMENBbVpJO0FBQ2xCLFlBQUlqRSxRQUFRb0IsR0FBUixDQUFZLGdDQUFaLENBQUosRUFBbUQ7QUFDakQsa0JBQU9wQixRQUFRb0IsR0FBUixDQUFZLGdDQUFaLEVBQThDOEgsV0FBOUMsRUFBUDtBQUNJLGlCQUFLLFNBQUw7QUFDRSxtQkFBS3pILEtBQUwsQ0FBVzBILFVBQVg7QUFDQSxtQkFBS25JLFFBQUwsQ0FBY21JLFVBQWQ7QUFDRjtBQUNBLGlCQUFLLFNBQUw7QUFDRSxtQkFBSzFILEtBQUwsQ0FBVzJILGFBQVg7QUFDQSxtQkFBS3BJLFFBQUwsQ0FBY29JLGFBQWQ7QUFDRjtBQVJKO0FBVUQ7QUFDRjtBQWhhZTs7QUFBQTtBQUFBLElBaUJLakosU0FqQkw7O0FBb2FsQlEsV0FBU00sTUFBVCxHQUFrQixVQUFDd0MsSUFBRCxFQUFVO0FBQzFCLFdBQU8sSUFBSTlDLFFBQUosQ0FBYSxFQUFFMEksV0FBVzVGLElBQWIsRUFBYixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPOUMsUUFBUDtBQUVELENBMWFEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG5cbiAgICBNb2RlbEhpc3RvcnlGb3JtID0gcmVxdWlyZSgnLi4vaGlzdG9yeS9mb3JtJyksXG4gICAgTW9kZWxGb3JtID0gcmVxdWlyZSgnLi4vZm9ybS9mb3JtJyksXG4gICAgTmFtZUZvcm0gPSByZXF1aXJlKCcuLi9uYW1lZm9ybS9mb3JtJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJyksXG4gICAgQm9keUNvbmZpZ3VyYXRpb25zID0gcmVxdWlyZSgnZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9ib2R5Y29uZmlncycpO1xuXG4gIGNsYXNzIE1vZGVsVGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uU2ltdWxhdGVSZXF1ZXN0JywgJ19vblNhdmVSZXF1ZXN0JywgJ19vbkFnZ3JlZ2F0ZVJlcXVlc3QnLFxuICAgICAgICAnX29uTmFtZUNhbmNlbCcsICdfb25OYW1lU3VibWl0JywgJ19vbkdsb2JhbHNDaGFuZ2UnLCAnX2xvYWRNb2RlbEluRm9ybScsXG4gICAgICAgICdfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlJywgJ19vbkNvbmZpZ0NoYW5nZScsICdfb25OZXdSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJ1xuICAgICAgXSk7XG5cbiAgICAgIHRoaXMuX2hpc3RvcnkgPSBNb2RlbEhpc3RvcnlGb3JtLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBgbW9kZWxfaGlzdG9yeV9fJHt0aGlzLl9tb2RlbC5nZXQoXCJpZFwiKX1gLFxuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX2Zvcm0gPSBNb2RlbEZvcm0uY3JlYXRlKHtcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICBmaWVsZENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJyksXG4gICAgICAgIGV1Z2xlbmFDb3VudENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdldWdsZW5hQ291bnQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2ltdWxhdGUnLCB0aGlzLl9vblNpbXVsYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2F2ZScsIHRoaXMuX29uU2F2ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdSZXF1ZXN0KTtcblxuICAgICAgdGhpcy5fbmFtZUZvcm0gPSBOYW1lRm9ybS5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuU3VibWl0JywgdGhpcy5fb25OYW1lU3VibWl0KTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuQ2FuY2VsJywgdGhpcy5fb25OYW1lQ2FuY2VsKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcblxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIC8vIENyZWF0ZSBib2R5IGNvbmZpZ3VyYXRpb24gbW9kZWwgaW5zdGFuY2UuXG4gICAgICAgIHZhciBpbml0aWFsQm9keSA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICAgIHZhciBwYXJhbU9wdGlvbnMgPSB7fVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ3JlYWN0aW9uJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5LLm9wdGlvbnMpXG4gICAgICAgIHBhcmFtT3B0aW9uc1snZm9yd2FyZCddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykudi5vcHRpb25zKVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ3JvbGwnXSA9IE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLm9tZWdhLm9wdGlvbnMpXG4gICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zID0gQm9keUNvbmZpZ3VyYXRpb25zLmNyZWF0ZSh7aW5pdGlhbENvbmZpZzogaW5pdGlhbEJvZHksIHBhcmFtT3B0aW9uczogcGFyYW1PcHRpb25zLCBtb2RlbE1vZGFsaXR5OiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsTW9kYWxpdHknKX0pXG5cbiAgICAgICAgLy8gYWRkIHZpZXcgb2YgdGhlIG1vZGVsIGluc3RhbmNlIHRvIHRoaXMudmlldygpXG4gICAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZENoaWxkKHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnZpZXcoKSxudWxsLDApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9mb3JtLnZpZXcoKSk7XG5cbiAgICAgIHRoaXMuX3NldE1vZGVsTW9kYWxpdHkoKTtcblxuICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsSWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3Vyck1vZGVsSWQ7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRNb2RlbDtcbiAgICB9XG5cbiAgICBjb2xvcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2NvbG9yJylcbiAgICB9XG5cbiAgICBoaXN0b3J5Q291bnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5oaXN0b3J5Q291bnQoKTtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSAnc3R1ZGVudF9pZCc6XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKVxuICAgICAgICAgICAgaWYgKGhpc3QubGVuZ3RoICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKT09J2NyZWF0ZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBoaXN0W2hpc3QubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybSh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWQpO1xuICAgICAgICAgIH0pXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oJ19uZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7IHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTsgfVxuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAodGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGhlcmUsIGNoYW5nZSB0aGUgaW1hZ2UgYW5kIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBib2R5Q29uZmlndXJhdGlvbiAoc2Vuc29yQ29uZmlnLCBmb3J3YXJkLCByZWFjdCwgcm9sbCkgaGFzIGJlZW4gc2VsZWN0ZWQuXG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Zvcm0uRmllbGRDaGFuZ2VkJykge1xuICAgICAgICBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdvcGFjaXR5Jykge1xuICAgICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnNldEJvZHlPcGFjaXR5KGV2dC5kYXRhLmRlbHRhLnZhbHVlKVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihldnQuZGF0YS5kZWx0YS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfbG9hZE1vZGVsSW5Gb3JtKGlkKSB7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBsZXQgb2xkSWQgPSB0aGlzLl9jdXJyTW9kZWxJZDtcbiAgICAgIGxldCB0YXJnZXQgPSBpZCA9PSAnX25ldycgPyBudWxsIDogaWQ7XG4gICAgICBpZiAob2xkSWQgIT0gdGFyZ2V0KSB7XG4gICAgICAgIGlmIChpZCAhPSAnX25ldycpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHtpZH1gKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9mb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBkYXRhO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWwuX2RhdGEubW9kZWxUeXBlID09ICdibG9ja2x5Jykge1xuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdCbG9ja2x5LkxvYWQnLCBkYXRhLmJsb2NrbHlYbWwpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBpZHggPSBPYmplY3Qua2V5cyhkYXRhLmNvbmZpZ3VyYXRpb24pLmxlbmd0aCAtIDE7IGlkeCA+PSAwOyBpZHgtLSkge1xuICAgICAgICAgICAgICAgIGlmICghKE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbilbaWR4XS5tYXRjaChcIl98Y291bnRcIikpKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgZWxlbU5hbWUgPSBPYmplY3Qua2V5cyhkYXRhLmNvbmZpZ3VyYXRpb24pW2lkeF1cbiAgICAgICAgICAgICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oZGF0YS5jb25maWd1cmF0aW9uW2VsZW1OYW1lXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2Zvcm0uaW1wb3J0KGRhdGEuY29uZmlndXJhdGlvbikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21heWJlIGl0IGlzIGhlcmUnKVxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBkYXRhLFxuICAgICAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ2hpc3RvcmljYWwnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgaWQ6ICdfbmV3J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fc2lsZW5jZUxvYWRMb2dzKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsSWQ6IGlkLFxuICAgICAgICAgICAgICB0YWI6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGFzdFNpbVNhdmVkICYmIHRoaXMuX2xhc3RTaW1TYXZlZC5pZCA9PSBvbGRJZCkge1xuICAgICAgICAvLyBoYW5kbGUgXCJyZXJ1bm5pbmdcIiBhIHNpbXVsYXRpb25cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5fbGFzdFNpbVNhdmVkLFxuICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TaW11bGF0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB2YXIgY29uZiA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICB2YXIgYmxvY2tseURhdGEgPSBudWxsO1xuICAgICAgdmFyIHNlbnNvckNvbmZpZ0pTT04gPSBudWxsO1xuXG4gICAgICBjb25zb2xlLmxvZygnb25TaW11bGF0ZVJlcXVlc3QgJyArIHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykpXG5cbiAgICAgIHZhciBzYXZlRGF0YSA9IHtcbiAgICAgICAgbmFtZTogXCIoc2ltdWxhdGlvbilcIixcbiAgICAgICAgc2ltdWxhdGVkOiB0cnVlLFxuICAgICAgICBjb25maWd1cmF0aW9uOiBjb25mXG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHRoZSBhY3RpdmUgdGFiIGlzICdibG9ja2x5JywgdGhlbiB3ZSBoYXZlIHRvIGNvbXBpbGUgYW5kIGV4dHJhY3QgdGhlIGJsb2NrbHkgY29kZS5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICBibG9ja2x5RGF0YSA9IHRoaXMuX2V4dHJhY3RCbG9ja2x5KCk7XG4gICAgICAgIHNhdmVEYXRhID0gJC5leHRlbmQoc2F2ZURhdGEsYmxvY2tseURhdGEpO1xuICAgICAgICBzZW5zb3JDb25maWdKU09OID0gSlNPTi5zdHJpbmdpZnkodGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuZ2V0QWN0aXZlU2Vuc29yQ29uZmlndXJhdGlvbigpKTtcbiAgICAgICAgc2F2ZURhdGEgPSAkLmV4dGVuZChzYXZlRGF0YSx7c2Vuc29yQ29uZmlnSlNPTjogc2Vuc29yQ29uZmlnSlNPTn0pXG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKHNlbnNvckNvbmZpZ0pTT04pXG5cbiAgICAgIHRoaXMuX3NhdmVNb2RlbCggc2F2ZURhdGEgKS50aGVuKChtb2RlbCkgPT4ge1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0obW9kZWwuaWQpO1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcbiAgICAgIH0pXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInNpbXVsYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogYmxvY2tseURhdGEgPyAkLmV4dGVuZChjb25mLCB7anNDb2RlOiBibG9ja2x5RGF0YS5qc0NvZGUsIHNlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT059KSA6IGNvbmZcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfZXh0cmFjdEJsb2NrbHkoKSB7XG4gICAgICAvLyBnZXQgdGhlIEJsb2NrbHkgY29kZSB4bWxcbiAgICAgIHZhciBibG9ja2x5WG1sID0gd2luZG93LkJsb2NrbHkuWG1sLndvcmtzcGFjZVRvRG9tKHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSk7XG5cbiAgICAgIC8vIHJlbW92ZSBibG9ja3MgZnJvbSBibG9ja2x5WG1sIHRoYXQgYXJlIG5vdCB3aXRoaW4gdGhlIG1haW4gYmxvY2tcbiAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJsb2NrbHlYbWwuY2hpbGROb2RlcykubWFwKChjaGlsZE5vZGUpID0+IHtcbiAgICAgICAgaWYgKGNoaWxkTm9kZS50YWdOYW1lID09ICdCTE9DSycgJiYgY2hpbGROb2RlLmdldEF0dHJpYnV0ZSgndHlwZScpICE9ICdldmVyeV90aW1lJykge1xuICAgICAgICAgIGJsb2NrbHlYbWwucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gZ2VuZXJhdGUgdGhlIGphdmFzY3JpcHQgY29kZSBvZiB0aGUgbWFpbiBibG9ja1xuICAgICAgdmFyIGJsb2NrcyA9IHdpbmRvdy5CbG9ja2x5Lm1haW5Xb3Jrc3BhY2UuZ2V0VG9wQmxvY2tzKHRydWUpO1xuICAgICAgdmFyIGZvdW5kTWFpbkJsb2NrID0gZmFsc2U7XG4gICAgICB2YXIganNDb2RlID0gJyc7XG4gICAgICBmb3IgKHZhciBiID0gMDsgYiA8IGJsb2Nrcy5sZW5ndGg7IGIrKykge1xuICAgICAgICBpZiAoYmxvY2tzW2JdLnR5cGUgPT0gJ2V2ZXJ5X3RpbWUnKSB7XG4gICAgICAgICAganNDb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5ibG9ja1RvQ29kZShibG9ja3NbYl0pXG4gICAgICAgICAgZm91bmRNYWluQmxvY2sgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmRNYWluQmxvY2spIHthbGVydCgndGhlcmUgaXMgbm8gbWFpbiBibG9jaycpfVxuXG4gICAgICAvL3dpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuYWRkUmVzZXJ2ZWRXb3JkcygnanNDb2RlJyk7XG4gICAgICAvL3ZhciBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LndvcmtzcGFjZVRvQ29kZSggd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpICk7XG5cbiAgICAgIC8vIHJldHVybiB4bWwgYW5kIGpzQ29kZSBhcyBzdHJpbmdzIHdpdGhpbiBqcyBvYmplY3RcbiAgICAgIC8vIHN0cmluZ2lmeTogYmxvY2tseVhtbC5vdXRlckhUTUwgLy8gQWx0ZXJuYXRpdmVseTogYmxvY2tseVhtbFRleHQgPSB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9UZXh0KHhtbCkgKHByb2R1Y2VzIG1pbmltYWwsIHVnbHkgc3RyaW5nKVxuICAgICAgLy8geG1sLWlmeSB3aXRoIGpxdWVyeTogJC5wYXJzZVhNTChzdHJpbmcpLmRvY3VtZW50RWxlbWVudFxuICAgICAgLy8gQWx0ZXJuYXRpdmVseSBmb3IgcmVjcmVhdGluZyBibG9ja3M6IGJsb2NrbHlYbWwgPSB3aW5kb3cuWG1sLnRleHRUb0RvbShibG9ja2x5WG1sVGV4dCkgJiB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2Uod2luZG93LkJsb2NrbHkubWFpbldvcmtzcGFjZSwgYmxvY2tseVhtbClcbiAgICAgIHJldHVybiB7YmxvY2tseVhtbDogYmxvY2tseVhtbC5vdXRlckhUTUwsIGpzQ29kZToganNDb2RlfVxuICAgIH1cblxuICAgIF9vblNhdmVSZXF1ZXN0KGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5kaXNwbGF5KHRoaXMuX25hbWVGb3JtLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfc2F2ZU1vZGVsKGRhdGEpIHtcbiAgICAgIGRhdGEuc3R1ZGVudElkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGRhdGEubW9kZWxUeXBlID0gdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKTtcbiAgICAgIGRhdGEubGFiID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKTtcbiAgICAgIGNvbnNvbGUubG9nKCdfc2F2ZU1vZGVsJylcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICBsZXQgc2F2ZU9yVXBkYXRlO1xuICAgICAgaWYgKHRoaXMuX2xhc3RTaW1TYXZlZCkge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7dGhpcy5fbGFzdFNpbVNhdmVkLmlkfWAsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgICAgICAgc2ltdWxhdGVkOiBkYXRhLnNpbXVsYXRlZFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V1Z2xlbmFNb2RlbHMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNhdmVPclVwZGF0ZS50aGVuKChzZXJ2ZXJEYXRhKSA9PiB7XG4gICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IHNlcnZlckRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlcnZlckRhdGEpIHJldHVybjtcbiAgICAgICAgcmV0dXJuIHNlcnZlckRhdGE7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVTdWJtaXQoZXZ0KSB7XG4gICAgICBsZXQgbW9kZWw7XG5cbiAgICAgIHZhciBibG9ja2x5RGF0YSA9IG51bGw7XG4gICAgICB2YXIgc2Vuc29yQ29uZmlnSlNPTiA9IG51bGw7XG4gICAgICBjb25zb2xlLmxvZyhcIm5hbWUgc3VibWl0IFwiICsgdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSlcbiAgICAgIC8vIGlmIHRoZSBhY3RpdmUgdGFiIGlzICdibG9ja2x5JywgdGhlbiB3ZSBoYXZlIHRvIGNvbXBpbGUgYW5kIGV4dHJhY3QgdGhlIGJsb2NrbHkgY29kZS5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICBibG9ja2x5RGF0YSA9IHRoaXMuX2V4dHJhY3RCbG9ja2x5KCk7XG4gICAgICAgIHNlbnNvckNvbmZpZ0pTT04gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5nZXRBY3RpdmVTZW5zb3JDb25maWd1cmF0aW9uKCkpO1xuICAgICAgICBibG9ja2x5RGF0YSA9ICQuZXh0ZW5kKGJsb2NrbHlEYXRhLHtzZW5zb3JDb25maWc6IHNlbnNvckNvbmZpZ0pTT059KVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhzZW5zb3JDb25maWdKU09OKVxuXG4gICAgICB0aGlzLl9uYW1lRm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NhdmVNb2RlbCgkLmV4dGVuZChibG9ja2x5RGF0YSx7XG4gICAgICAgICAgbmFtZTogdGhpcy5fbmFtZUZvcm0uZXhwb3J0KCkubmFtZSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9mb3JtLmV4cG9ydCgpLFxuICAgICAgICAgIHNpbXVsYXRlZDogZmFsc2VcbiAgICAgICAgfSkpXG4gICAgICB9KS50aGVuKChtb2RlbCkgPT4ge1xuICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IG1vZGVsLmlkXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzYXZlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBibG9ja2x5RGF0YSA/ICQuZXh0ZW5kKHRoaXMuX2Zvcm0uZXhwb3J0KCksIHtzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OLCBqc0NvZGU6IGJsb2NrbHlEYXRhLmpzQ29kZX0pIDogdGhpcy5fZm9ybS5leHBvcnQoKSAsXG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lQ2FuY2VsKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRNb2RlbFJlc3VsdHMoR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50LmlkJyksIHRoaXMuX2N1cnJlbnRNb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmV3UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX29uQ29uZmlnQ2hhbmdlKGV2dCk7XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3NldE1vZGVsTW9kYWxpdHkoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcIm9ic2VydmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5oaWRlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXhwbG9yZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmRpc2FibGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgTW9kZWxUYWIuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsVGFiKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcmV0dXJuIE1vZGVsVGFiO1xuXG59KVxuIl19
