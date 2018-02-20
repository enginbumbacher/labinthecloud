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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJfbmFtZUZvcm0iLCJfb25OYW1lU3VibWl0IiwiX29uTmFtZUNhbmNlbCIsImFkZENoaWxkIiwiaW5pdGlhbEJvZHkiLCJleHBvcnQiLCJwYXJhbU9wdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwiSyIsIm9wdGlvbnMiLCJ2Iiwib21lZ2EiLCJib2R5Q29uZmlndXJhdGlvbnMiLCJpbml0aWFsQ29uZmlnIiwibW9kZWxNb2RhbGl0eSIsIl9zZXRNb2RlbE1vZGFsaXR5IiwiX29uR2xvYmFsc0NoYW5nZSIsIl9vblBoYXNlQ2hhbmdlIiwiX2N1cnJNb2RlbElkIiwiX2N1cnJlbnRNb2RlbCIsImhpc3RvcnlDb3VudCIsImV2dCIsImRhdGEiLCJwYXRoIiwidXBkYXRlIiwidGhlbiIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwibW9kZWxfaGlzdG9yeV9pZCIsInNldFN0YXRlIiwiX2xvYWRNb2RlbEluRm9ybSIsIm5hbWUiLCJfZGF0YSIsImN1cnJlbnRUYXJnZXQiLCJfbGFzdFNpbVNhdmVkIiwiZmllbGQiLCJzZXRCb2R5T3BhY2l0eSIsImRlbHRhIiwidmFsdWUiLCJzZXRBY3RpdmVDb25maWd1cmF0aW9uIiwib2xkSWQiLCJ0YXJnZXQiLCJwcm9taXNlQWpheCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwYXRjaEV2ZW50IiwiYmxvY2tseVhtbCIsImlkeCIsImNvbmZpZ3VyYXRpb24iLCJtYXRjaCIsImVsZW1OYW1lIiwibW9kZWwiLCJ0YWJJZCIsInNpbXVsYXRlZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsIm1vZGVsSWQiLCJ0YWIiLCJjb25mIiwiYmxvY2tseURhdGEiLCJzZW5zb3JDb25maWdKU09OIiwiY29uc29sZSIsInNhdmVEYXRhIiwiX2V4dHJhY3RCbG9ja2x5IiwiZXh0ZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24iLCJfc2F2ZU1vZGVsIiwianNDb2RlIiwid2luZG93IiwiQmxvY2tseSIsIlhtbCIsIndvcmtzcGFjZVRvRG9tIiwiZ2V0TWFpbldvcmtzcGFjZSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiY2hpbGROb2RlcyIsIm1hcCIsImNoaWxkTm9kZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVDaGlsZCIsImJsb2NrcyIsIm1haW5Xb3Jrc3BhY2UiLCJnZXRUb3BCbG9ja3MiLCJmb3VuZE1haW5CbG9jayIsImIiLCJKYXZhU2NyaXB0IiwiYmxvY2tUb0NvZGUiLCJhbGVydCIsIm91dGVySFRNTCIsImRpc3BsYXkiLCJzdHVkZW50SWQiLCJsYWIiLCJzYXZlT3JVcGRhdGUiLCJtZXRob2QiLCJjb250ZW50VHlwZSIsInNlcnZlckRhdGEiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJoaWRlIiwiY2xlYXIiLCJnZXRNb2RlbFJlc3VsdHMiLCJyZXN1bHRzIiwicGhhc2UiLCJ0b0xvd2VyQ2FzZSIsImhpZGVGaWVsZHMiLCJkaXNhYmxlRmllbGRzIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLElBQUlELFFBQVEsUUFBUixDQUFWOztBQUVBLE1BQU1FLFVBQVVGLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRyxRQUFRSCxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFSSxLQUFLSixRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUssWUFBWUwsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VNLFFBQVFOLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU8sT0FBT1AsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUlFUSxtQkFBbUJSLFFBQVEsaUJBQVIsQ0FKckI7QUFBQSxNQUtFUyxZQUFZVCxRQUFRLGNBQVIsQ0FMZDtBQUFBLE1BTUVVLFdBQVdWLFFBQVEsa0JBQVIsQ0FOYjtBQUFBLE1BT0VXLFdBQVdYLFFBQVEsZUFBUixDQVBiO0FBQUEsTUFRRVkscUJBQXFCWixRQUFRLGtFQUFSLENBUnZCOztBQVBrQixNQWlCWmEsUUFqQlk7QUFBQTs7QUFrQmhCLHdCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJULEtBQTdDO0FBQ0FRLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JULElBQTNDOztBQUZ5QixzSEFHbkJPLFFBSG1COztBQUl6QlgsWUFBTWMsV0FBTixRQUF3QixDQUN0QixvQkFEc0IsRUFDQSxnQkFEQSxFQUNrQixxQkFEbEIsRUFFdEIsZUFGc0IsRUFFTCxlQUZLLEVBRVksa0JBRlosRUFFZ0Msa0JBRmhDLEVBR3RCLDJCQUhzQixFQUdPLGlCQUhQLEVBRzBCLGVBSDFCLEVBRzJDLGdCQUgzQyxD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Q0FBWSxnQ0FBWixFQUE4QzZILFdBQTlDLEVBQVA7QUFDSSxpQkFBSyxTQUFMO0FBQ0UsbUJBQUt4SCxLQUFMLENBQVd5SCxVQUFYO0FBQ0EsbUJBQUtsSSxRQUFMLENBQWNrSSxVQUFkO0FBQ0Y7QUFDQSxpQkFBSyxTQUFMO0FBQ0UsbUJBQUt6SCxLQUFMLENBQVcwSCxhQUFYO0FBQ0EsbUJBQUtuSSxRQUFMLENBQWNtSSxhQUFkO0FBQ0Y7QUFSSjtBQVVEO0FBQ0Y7QUE1WmU7O0FBQUE7QUFBQSxJQWlCS2hKLFNBakJMOztBQWdhbEJRLFdBQVNNLE1BQVQsR0FBa0IsVUFBQ3dDLElBQUQsRUFBVTtBQUMxQixXQUFPLElBQUk5QyxRQUFKLENBQWEsRUFBRXlJLFdBQVczRixJQUFiLEVBQWIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBTzlDLFFBQVA7QUFFRCxDQXRhRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbC90YWIvdGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuXG4gICAgTW9kZWxIaXN0b3J5Rm9ybSA9IHJlcXVpcmUoJy4uL2hpc3RvcnkvZm9ybScpLFxuICAgIE1vZGVsRm9ybSA9IHJlcXVpcmUoJy4uL2Zvcm0vZm9ybScpLFxuICAgIE5hbWVGb3JtID0gcmVxdWlyZSgnLi4vbmFtZWZvcm0vZm9ybScpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpLFxuICAgIEJvZHlDb25maWd1cmF0aW9ucyA9IHJlcXVpcmUoJ2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvYm9keWNvbmZpZ3MnKTtcblxuICBjbGFzcyBNb2RlbFRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vblNpbXVsYXRlUmVxdWVzdCcsICdfb25TYXZlUmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19vbk5hbWVDYW5jZWwnLCAnX29uTmFtZVN1Ym1pdCcsICdfb25HbG9iYWxzQ2hhbmdlJywgJ19sb2FkTW9kZWxJbkZvcm0nLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3UmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZSdcbiAgICAgIF0pO1xuXG4gICAgICB0aGlzLl9oaXN0b3J5ID0gTW9kZWxIaXN0b3J5Rm9ybS5jcmVhdGUoe1xuICAgICAgICBpZDogYG1vZGVsX2hpc3RvcnlfXyR7dGhpcy5fbW9kZWwuZ2V0KFwiaWRcIil9YCxcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQmxvY2tseS5DaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcbiAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuXG4gICAgICB0aGlzLl9mb3JtID0gTW9kZWxGb3JtLmNyZWF0ZSh7XG4gICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgZmllbGRDb25maWc6IHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLFxuICAgICAgICBldWdsZW5hQ291bnRDb25maWc6IHRoaXMuX21vZGVsLmdldCgnZXVnbGVuYUNvdW50JylcbiAgICAgIH0pXG4gICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQmxvY2tseS5DaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLlNpbXVsYXRlJywgdGhpcy5fb25TaW11bGF0ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLlNhdmUnLCB0aGlzLl9vblNhdmVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5BZGRUb0FnZ3JlZ2F0ZScsIHRoaXMuX29uQWdncmVnYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3UmVxdWVzdCk7XG5cbiAgICAgIHRoaXMuX25hbWVGb3JtID0gTmFtZUZvcm0uY3JlYXRlKCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLlN1Ym1pdCcsIHRoaXMuX29uTmFtZVN1Ym1pdCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLkNhbmNlbCcsIHRoaXMuX29uTmFtZUNhbmNlbCk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICAvLyBDcmVhdGUgYm9keSBjb25maWd1cmF0aW9uIG1vZGVsIGluc3RhbmNlLlxuICAgICAgICB2YXIgaW5pdGlhbEJvZHkgPSB0aGlzLl9mb3JtLmV4cG9ydCgpO1xuICAgICAgICB2YXIgcGFyYW1PcHRpb25zID0ge31cbiAgICAgICAgcGFyYW1PcHRpb25zWydyZWFjdGlvbiddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykuSy5vcHRpb25zKVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ2ZvcndhcmQnXSA9IE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLnYub3B0aW9ucylcbiAgICAgICAgcGFyYW1PcHRpb25zWydyb2xsJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5vbWVnYS5vcHRpb25zKVxuICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucyA9IEJvZHlDb25maWd1cmF0aW9ucy5jcmVhdGUoe2luaXRpYWxDb25maWc6IGluaXRpYWxCb2R5LCBwYXJhbU9wdGlvbnM6IHBhcmFtT3B0aW9ucywgbW9kZWxNb2RhbGl0eTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbE1vZGFsaXR5Jyl9KVxuXG4gICAgICAgIC8vIGFkZCB2aWV3IG9mIHRoZSBtb2RlbCBpbnN0YW5jZSB0byB0aGlzLnZpZXcoKVxuICAgICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRDaGlsZCh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy52aWV3KCksbnVsbCwwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZm9ybS52aWV3KCkpO1xuXG4gICAgICB0aGlzLl9zZXRNb2RlbE1vZGFsaXR5KCk7XG5cbiAgICAgIEdsb2JhbHMuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25HbG9iYWxzQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbElkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJNb2RlbElkO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50TW9kZWw7XG4gICAgfVxuXG4gICAgY29sb3IoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdjb2xvcicpXG4gICAgfVxuXG4gICAgaGlzdG9yeUNvdW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCk7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgJ3N0dWRlbnRfaWQnOlxuICAgICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KClcbiAgICAgICAgICAgIGlmIChoaXN0Lmxlbmd0aCAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5Jyk9PSdjcmVhdGUnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0odGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTtcbiAgICAgICAgICB9KVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5uYW1lID09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKCdfbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgeyB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCk7IH1cbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgaWYgKGV2dC5uYW1lID09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiBoZXJlLCBjaGFuZ2UgdGhlIGltYWdlIGFuZCB0aGUgdG9vbGJveCBhY2NvcmRpbmcgdG8gd2hpY2ggYm9keUNvbmZpZ3VyYXRpb24gKHNlbnNvckNvbmZpZywgZm9yd2FyZCwgcmVhY3QsIHJvbGwpIGhhcyBiZWVuIHNlbGVjdGVkLlxuICAgICAgaWYgKGV2dC5uYW1lID09ICdGb3JtLkZpZWxkQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PSAnb3BhY2l0eScpIHtcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRCb2R5T3BhY2l0eShldnQuZGF0YS5kZWx0YS52YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2UgaWYgKGV2dC5jdXJyZW50VGFyZ2V0Ll9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gJ2Jsb2NrbHknKXtcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKGV2dC5kYXRhLmRlbHRhLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9sb2FkTW9kZWxJbkZvcm0oaWQpIHtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGxldCBvbGRJZCA9IHRoaXMuX2N1cnJNb2RlbElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gaWQ7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke2lkfWApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IGRhdGE7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0Jsb2NrbHkuTG9hZCcsIGRhdGEuYmxvY2tseVhtbCk7XG4gICAgICAgICAgICAgIGZvciAobGV0IGlkeCA9IE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbikubGVuZ3RoIC0gMTsgaWR4ID49IDA7IGlkeC0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoT2JqZWN0LmtleXMoZGF0YS5jb25maWd1cmF0aW9uKVtpZHhdLm1hdGNoKFwiX3xjb3VudFwiKSkpIHtcbiAgICAgICAgICAgICAgICAgIGxldCBlbGVtTmFtZSA9IE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbilbaWR4XVxuICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihkYXRhLmNvbmZpZ3VyYXRpb25bZWxlbU5hbWVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZm9ybS5pbXBvcnQoZGF0YS5jb25maWd1cmF0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKVxuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBkYXRhLFxuICAgICAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ2hpc3RvcmljYWwnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgaWQ6ICdfbmV3J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fc2lsZW5jZUxvYWRMb2dzKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsSWQ6IGlkLFxuICAgICAgICAgICAgICB0YWI6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGFzdFNpbVNhdmVkICYmIHRoaXMuX2xhc3RTaW1TYXZlZC5pZCA9PSBvbGRJZCkge1xuICAgICAgICAvLyBoYW5kbGUgXCJyZXJ1bm5pbmdcIiBhIHNpbXVsYXRpb25cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5fbGFzdFNpbVNhdmVkLFxuICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TaW11bGF0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB2YXIgY29uZiA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICB2YXIgYmxvY2tseURhdGEgPSBudWxsO1xuICAgICAgdmFyIHNlbnNvckNvbmZpZ0pTT04gPSBudWxsO1xuXG4gICAgICBjb25zb2xlLmxvZygnb25TaW11bGF0ZVJlcXVlc3QgJyArIHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykpXG5cbiAgICAgIHZhciBzYXZlRGF0YSA9IHtcbiAgICAgICAgbmFtZTogXCIoc2ltdWxhdGlvbilcIixcbiAgICAgICAgc2ltdWxhdGVkOiB0cnVlLFxuICAgICAgICBjb25maWd1cmF0aW9uOiBjb25mXG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHRoZSBhY3RpdmUgdGFiIGlzICdibG9ja2x5JywgdGhlbiB3ZSBoYXZlIHRvIGNvbXBpbGUgYW5kIGV4dHJhY3QgdGhlIGJsb2NrbHkgY29kZS5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICBibG9ja2x5RGF0YSA9IHRoaXMuX2V4dHJhY3RCbG9ja2x5KCk7XG4gICAgICAgIHNhdmVEYXRhID0gJC5leHRlbmQoc2F2ZURhdGEsYmxvY2tseURhdGEpO1xuICAgICAgICBzZW5zb3JDb25maWdKU09OID0gSlNPTi5zdHJpbmdpZnkodGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuZ2V0QWN0aXZlU2Vuc29yQ29uZmlndXJhdGlvbigpKTtcbiAgICAgICAgc2F2ZURhdGEgPSAkLmV4dGVuZChzYXZlRGF0YSx7c2Vuc29yQ29uZmlnSlNPTjogc2Vuc29yQ29uZmlnSlNPTn0pXG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKHNlbnNvckNvbmZpZ0pTT04pXG5cbiAgICAgIHRoaXMuX3NhdmVNb2RlbCggc2F2ZURhdGEgKS50aGVuKChtb2RlbCkgPT4ge1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0obW9kZWwuaWQpO1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcbiAgICAgIH0pXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInNpbXVsYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogYmxvY2tseURhdGEgPyAkLmV4dGVuZChjb25mLCB7anNDb2RlOiBibG9ja2x5RGF0YS5qc0NvZGUsIHNlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT059KSA6IGNvbmZcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfZXh0cmFjdEJsb2NrbHkoKSB7XG4gICAgICAvLyBnZXQgdGhlIEJsb2NrbHkgY29kZSB4bWxcbiAgICAgIHZhciBibG9ja2x5WG1sID0gd2luZG93LkJsb2NrbHkuWG1sLndvcmtzcGFjZVRvRG9tKHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSk7XG5cbiAgICAgIC8vIHJlbW92ZSBibG9ja3MgZnJvbSBibG9ja2x5WG1sIHRoYXQgYXJlIG5vdCB3aXRoaW4gdGhlIG1haW4gYmxvY2tcbiAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJsb2NrbHlYbWwuY2hpbGROb2RlcykubWFwKChjaGlsZE5vZGUpID0+IHtcbiAgICAgICAgaWYgKGNoaWxkTm9kZS50YWdOYW1lID09ICdCTE9DSycgJiYgY2hpbGROb2RlLmdldEF0dHJpYnV0ZSgndHlwZScpICE9ICdldmVyeV90aW1lJykge1xuICAgICAgICAgIGJsb2NrbHlYbWwucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gZ2VuZXJhdGUgdGhlIGphdmFzY3JpcHQgY29kZSBvZiB0aGUgbWFpbiBibG9ja1xuICAgICAgdmFyIGJsb2NrcyA9IHdpbmRvdy5CbG9ja2x5Lm1haW5Xb3Jrc3BhY2UuZ2V0VG9wQmxvY2tzKHRydWUpO1xuICAgICAgdmFyIGZvdW5kTWFpbkJsb2NrID0gZmFsc2U7XG4gICAgICB2YXIganNDb2RlID0gJyc7XG4gICAgICBmb3IgKHZhciBiID0gMDsgYiA8IGJsb2Nrcy5sZW5ndGg7IGIrKykge1xuICAgICAgICBpZiAoYmxvY2tzW2JdLnR5cGUgPT0gJ2V2ZXJ5X3RpbWUnKSB7XG4gICAgICAgICAganNDb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5ibG9ja1RvQ29kZShibG9ja3NbYl0pXG4gICAgICAgICAgZm91bmRNYWluQmxvY2sgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmRNYWluQmxvY2spIHthbGVydCgndGhlcmUgaXMgbm8gbWFpbiBibG9jaycpfVxuXG4gICAgICAvL3dpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuYWRkUmVzZXJ2ZWRXb3JkcygnanNDb2RlJyk7XG4gICAgICAvL3ZhciBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LndvcmtzcGFjZVRvQ29kZSggd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpICk7XG5cbiAgICAgIC8vIHJldHVybiB4bWwgYW5kIGpzQ29kZSBhcyBzdHJpbmdzIHdpdGhpbiBqcyBvYmplY3RcbiAgICAgIC8vIHN0cmluZ2lmeTogYmxvY2tseVhtbC5vdXRlckhUTUwgLy8gQWx0ZXJuYXRpdmVseTogYmxvY2tseVhtbFRleHQgPSB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9UZXh0KHhtbCkgKHByb2R1Y2VzIG1pbmltYWwsIHVnbHkgc3RyaW5nKVxuICAgICAgLy8geG1sLWlmeSB3aXRoIGpxdWVyeTogJC5wYXJzZVhNTChzdHJpbmcpLmRvY3VtZW50RWxlbWVudFxuICAgICAgLy8gQWx0ZXJuYXRpdmVseSBmb3IgcmVjcmVhdGluZyBibG9ja3M6IGJsb2NrbHlYbWwgPSB3aW5kb3cuWG1sLnRleHRUb0RvbShibG9ja2x5WG1sVGV4dCkgJiB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2Uod2luZG93LkJsb2NrbHkubWFpbldvcmtzcGFjZSwgYmxvY2tseVhtbClcbiAgICAgIHJldHVybiB7YmxvY2tseVhtbDogYmxvY2tseVhtbC5vdXRlckhUTUwsIGpzQ29kZToganNDb2RlfVxuICAgIH1cblxuICAgIF9vblNhdmVSZXF1ZXN0KGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5kaXNwbGF5KHRoaXMuX25hbWVGb3JtLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfc2F2ZU1vZGVsKGRhdGEpIHtcbiAgICAgIGRhdGEuc3R1ZGVudElkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGRhdGEubW9kZWxUeXBlID0gdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKTtcbiAgICAgIGRhdGEubGFiID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKTtcbiAgICAgIGNvbnNvbGUubG9nKCdfc2F2ZU1vZGVsJylcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICBsZXQgc2F2ZU9yVXBkYXRlO1xuICAgICAgaWYgKHRoaXMuX2xhc3RTaW1TYXZlZCkge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7dGhpcy5fbGFzdFNpbVNhdmVkLmlkfWAsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgICAgICAgc2ltdWxhdGVkOiBkYXRhLnNpbXVsYXRlZFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V1Z2xlbmFNb2RlbHMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNhdmVPclVwZGF0ZS50aGVuKChzZXJ2ZXJEYXRhKSA9PiB7XG4gICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IHNlcnZlckRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlcnZlckRhdGEpIHJldHVybjtcbiAgICAgICAgcmV0dXJuIHNlcnZlckRhdGE7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVTdWJtaXQoZXZ0KSB7XG4gICAgICBsZXQgbW9kZWw7XG5cbiAgICAgIHZhciBibG9ja2x5RGF0YSA9IG51bGw7XG4gICAgICB2YXIgc2Vuc29yQ29uZmlnSlNPTiA9IG51bGw7XG5cbiAgICAgIC8vIGlmIHRoZSBhY3RpdmUgdGFiIGlzICdibG9ja2x5JywgdGhlbiB3ZSBoYXZlIHRvIGNvbXBpbGUgYW5kIGV4dHJhY3QgdGhlIGJsb2NrbHkgY29kZS5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICBibG9ja2x5RGF0YSA9IHRoaXMuX2V4dHJhY3RCbG9ja2x5KCk7XG4gICAgICAgIHNlbnNvckNvbmZpZ0pTT04gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5nZXRBY3RpdmVTZW5zb3JDb25maWd1cmF0aW9uKCkpO1xuICAgICAgICBibG9ja2x5RGF0YSA9ICQuZXh0ZW5kKGJsb2NrbHlEYXRhLHtzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbmFtZUZvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zYXZlTW9kZWwoJC5leHRlbmQoYmxvY2tseURhdGEse1xuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWUsXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fZm9ybS5leHBvcnQoKSxcbiAgICAgICAgICBzaW11bGF0ZWQ6IGZhbHNlXG4gICAgICAgIH0pKVxuICAgICAgfSkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbmFtZUZvcm0uY2xlYXIoKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBtb2RlbC5pZFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2F2ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY29uZmlndXJhdGlvbjogYmxvY2tseURhdGEgPyAkLmV4dGVuZCh0aGlzLl9mb3JtLmV4cG9ydCgpLCB7c2Vuc29yQ29uZmlnSlNPTjogc2Vuc29yQ29uZmlnSlNPTiwganNDb2RlOiBibG9ja2x5RGF0YS5qc0NvZGV9KSA6IHRoaXMuX2Zvcm0uZXhwb3J0KCkgLFxuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZUNhbmNlbChldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfb25BZ2dyZWdhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudC5pZCcpLCB0aGlzLl9jdXJyZW50TW9kZWwpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5BZGRSZXF1ZXN0Jywge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdHNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJhZ2dyZWdhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsSWQ6IHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5ld1JlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9vbkNvbmZpZ0NoYW5nZShldnQpO1xuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgbW9kZWxfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRNb2RlbE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSkge1xuICAgICAgICBzd2l0Y2goR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsVGFiLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbFRhYih7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbFRhYjtcblxufSlcbiJdfQ==
