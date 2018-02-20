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

      // Insert a title of the tab
      var titleNode = document.createElement('h2');
      titleNode.className = 'tab__model__title';
      titleNode.innerHTML = 'Model of the Body';

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJ0aXRsZU5vZGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJpbm5lckhUTUwiLCIkZG9tIiwiYXBwZW5kIiwiX25hbWVGb3JtIiwiX29uTmFtZVN1Ym1pdCIsIl9vbk5hbWVDYW5jZWwiLCJhZGRDaGlsZCIsImluaXRpYWxCb2R5IiwiZXhwb3J0IiwicGFyYW1PcHRpb25zIiwiT2JqZWN0Iiwia2V5cyIsIksiLCJvcHRpb25zIiwidiIsIm9tZWdhIiwiYm9keUNvbmZpZ3VyYXRpb25zIiwiaW5pdGlhbENvbmZpZyIsIm1vZGVsTW9kYWxpdHkiLCJfc2V0TW9kZWxNb2RhbGl0eSIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25QaGFzZUNoYW5nZSIsIl9jdXJyTW9kZWxJZCIsIl9jdXJyZW50TW9kZWwiLCJoaXN0b3J5Q291bnQiLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsInRoZW4iLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsIm1vZGVsX2hpc3RvcnlfaWQiLCJzZXRTdGF0ZSIsIl9sb2FkTW9kZWxJbkZvcm0iLCJuYW1lIiwiX2RhdGEiLCJjdXJyZW50VGFyZ2V0IiwiX2xhc3RTaW1TYXZlZCIsImZpZWxkIiwic2V0Qm9keU9wYWNpdHkiLCJkZWx0YSIsInZhbHVlIiwic2V0QWN0aXZlQ29uZmlndXJhdGlvbiIsIm9sZElkIiwidGFyZ2V0IiwicHJvbWlzZUFqYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGF0Y2hFdmVudCIsImJsb2NrbHlYbWwiLCJpZHgiLCJjb25maWd1cmF0aW9uIiwibWF0Y2giLCJlbGVtTmFtZSIsIm1vZGVsIiwidGFiSWQiLCJzaW11bGF0ZWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImJsb2NrbHlEYXRhIiwic2Vuc29yQ29uZmlnSlNPTiIsInNhdmVEYXRhIiwiX2V4dHJhY3RCbG9ja2x5IiwiZXh0ZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24iLCJfc2F2ZU1vZGVsIiwianNDb2RlIiwid2luZG93IiwiQmxvY2tseSIsIlhtbCIsIndvcmtzcGFjZVRvRG9tIiwiZ2V0TWFpbldvcmtzcGFjZSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiY2hpbGROb2RlcyIsIm1hcCIsImNoaWxkTm9kZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVDaGlsZCIsImJsb2NrcyIsIm1haW5Xb3Jrc3BhY2UiLCJnZXRUb3BCbG9ja3MiLCJmb3VuZE1haW5CbG9jayIsImIiLCJKYXZhU2NyaXB0IiwiYmxvY2tUb0NvZGUiLCJhbGVydCIsIm91dGVySFRNTCIsImRpc3BsYXkiLCJzdHVkZW50SWQiLCJsYWIiLCJzYXZlT3JVcGRhdGUiLCJtZXRob2QiLCJjb250ZW50VHlwZSIsInNlcnZlckRhdGEiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJoaWRlIiwiY2xlYXIiLCJnZXRNb2RlbFJlc3VsdHMiLCJyZXN1bHRzIiwicGhhc2UiLCJ0b0xvd2VyQ2FzZSIsImhpZGVGaWVsZHMiLCJkaXNhYmxlRmllbGRzIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLElBQUlELFFBQVEsUUFBUixDQUFWOztBQUVBLE1BQU1FLFVBQVVGLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRyxRQUFRSCxRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFSSxLQUFLSixRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUssWUFBWUwsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VNLFFBQVFOLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU8sT0FBT1AsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUlFUSxtQkFBbUJSLFFBQVEsaUJBQVIsQ0FKckI7QUFBQSxNQUtFUyxZQUFZVCxRQUFRLGNBQVIsQ0FMZDtBQUFBLE1BTUVVLFdBQVdWLFFBQVEsa0JBQVIsQ0FOYjtBQUFBLE1BT0VXLFdBQVdYLFFBQVEsZUFBUixDQVBiO0FBQUEsTUFRRVkscUJBQXFCWixRQUFRLGtFQUFSLENBUnZCOztBQVBrQixNQWlCWmEsUUFqQlk7QUFBQTs7QUFrQmhCLHdCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJULEtBQTdDO0FBQ0FRLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JULElBQTNDOztBQUZ5QixzSEFHbkJPLFFBSG1COztBQUl6QlgsWUFBTWMsV0FBTixRQUF3QixDQUN0QixvQkFEc0IsRUFDQSxnQkFEQSxFQUNrQixxQkFEbEIsRUFFdEIsZUFGc0IsRUFFTCxlQUZLLEVBRVks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QUEsMENBZ1pJO0FBQ2xCLFlBQUl4RSxRQUFRb0IsR0FBUixDQUFZLGdDQUFaLENBQUosRUFBbUQ7QUFDakQsa0JBQU9wQixRQUFRb0IsR0FBUixDQUFZLGdDQUFaLEVBQThDbUksV0FBOUMsRUFBUDtBQUNJLGlCQUFLLFNBQUw7QUFDRSxtQkFBSzlILEtBQUwsQ0FBVytILFVBQVg7QUFDQSxtQkFBS3hJLFFBQUwsQ0FBY3dJLFVBQWQ7QUFDRjtBQUNBLGlCQUFLLFNBQUw7QUFDRSxtQkFBSy9ILEtBQUwsQ0FBV2dJLGFBQVg7QUFDQSxtQkFBS3pJLFFBQUwsQ0FBY3lJLGFBQWQ7QUFDRjtBQVJKO0FBVUQ7QUFDRjtBQTdaZTs7QUFBQTtBQUFBLElBaUJLdEosU0FqQkw7O0FBaWFsQlEsV0FBU00sTUFBVCxHQUFrQixVQUFDK0MsSUFBRCxFQUFVO0FBQzFCLFdBQU8sSUFBSXJELFFBQUosQ0FBYSxFQUFFK0ksV0FBVzFGLElBQWIsRUFBYixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPckQsUUFBUDtBQUVELENBdmFEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG5cbiAgICBNb2RlbEhpc3RvcnlGb3JtID0gcmVxdWlyZSgnLi4vaGlzdG9yeS9mb3JtJyksXG4gICAgTW9kZWxGb3JtID0gcmVxdWlyZSgnLi4vZm9ybS9mb3JtJyksXG4gICAgTmFtZUZvcm0gPSByZXF1aXJlKCcuLi9uYW1lZm9ybS9mb3JtJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJyksXG4gICAgQm9keUNvbmZpZ3VyYXRpb25zID0gcmVxdWlyZSgnZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9ib2R5Y29uZmlncycpO1xuXG4gIGNsYXNzIE1vZGVsVGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uU2ltdWxhdGVSZXF1ZXN0JywgJ19vblNhdmVSZXF1ZXN0JywgJ19vbkFnZ3JlZ2F0ZVJlcXVlc3QnLFxuICAgICAgICAnX29uTmFtZUNhbmNlbCcsICdfb25OYW1lU3VibWl0JywgJ19vbkdsb2JhbHNDaGFuZ2UnLCAnX2xvYWRNb2RlbEluRm9ybScsXG4gICAgICAgICdfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlJywgJ19vbkNvbmZpZ0NoYW5nZScsICdfb25OZXdSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJ1xuICAgICAgXSk7XG5cbiAgICAgIHRoaXMuX2hpc3RvcnkgPSBNb2RlbEhpc3RvcnlGb3JtLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBgbW9kZWxfaGlzdG9yeV9fJHt0aGlzLl9tb2RlbC5nZXQoXCJpZFwiKX1gLFxuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX2Zvcm0gPSBNb2RlbEZvcm0uY3JlYXRlKHtcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICBmaWVsZENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJyksXG4gICAgICAgIGV1Z2xlbmFDb3VudENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdldWdsZW5hQ291bnQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2ltdWxhdGUnLCB0aGlzLl9vblNpbXVsYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2F2ZScsIHRoaXMuX29uU2F2ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdSZXF1ZXN0KTtcblxuICAgICAgLy8gSW5zZXJ0IGEgdGl0bGUgb2YgdGhlIHRhYlxuICAgICAgdmFyIHRpdGxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICB0aXRsZU5vZGUuY2xhc3NOYW1lID0gJ3RhYl9fbW9kZWxfX3RpdGxlJ1xuICAgICAgdGl0bGVOb2RlLmlubmVySFRNTCA9ICdNb2RlbCBvZiB0aGUgQm9keSdcblxuICAgICAgdGhpcy52aWV3KCkuJGRvbSgpLmFwcGVuZCh0aXRsZU5vZGUpXG5cbiAgICAgIHRoaXMuX25hbWVGb3JtID0gTmFtZUZvcm0uY3JlYXRlKCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLlN1Ym1pdCcsIHRoaXMuX29uTmFtZVN1Ym1pdCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLkNhbmNlbCcsIHRoaXMuX29uTmFtZUNhbmNlbCk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICAvLyBDcmVhdGUgYm9keSBjb25maWd1cmF0aW9uIG1vZGVsIGluc3RhbmNlLlxuICAgICAgICB2YXIgaW5pdGlhbEJvZHkgPSB0aGlzLl9mb3JtLmV4cG9ydCgpO1xuICAgICAgICB2YXIgcGFyYW1PcHRpb25zID0ge31cbiAgICAgICAgcGFyYW1PcHRpb25zWydyZWFjdGlvbiddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykuSy5vcHRpb25zKVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ2ZvcndhcmQnXSA9IE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLnYub3B0aW9ucylcbiAgICAgICAgcGFyYW1PcHRpb25zWydyb2xsJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5vbWVnYS5vcHRpb25zKVxuICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucyA9IEJvZHlDb25maWd1cmF0aW9ucy5jcmVhdGUoe2luaXRpYWxDb25maWc6IGluaXRpYWxCb2R5LCBwYXJhbU9wdGlvbnM6IHBhcmFtT3B0aW9ucywgbW9kZWxNb2RhbGl0eTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbE1vZGFsaXR5Jyl9KVxuXG4gICAgICAgIC8vIGFkZCB2aWV3IG9mIHRoZSBtb2RlbCBpbnN0YW5jZSB0byB0aGlzLnZpZXcoKVxuICAgICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRDaGlsZCh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy52aWV3KCksbnVsbCwwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZm9ybS52aWV3KCkpO1xuXG4gICAgICB0aGlzLl9zZXRNb2RlbE1vZGFsaXR5KCk7XG5cbiAgICAgIEdsb2JhbHMuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25HbG9iYWxzQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbElkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJNb2RlbElkO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50TW9kZWw7XG4gICAgfVxuXG4gICAgY29sb3IoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdjb2xvcicpXG4gICAgfVxuXG4gICAgaGlzdG9yeUNvdW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCk7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgJ3N0dWRlbnRfaWQnOlxuICAgICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KClcbiAgICAgICAgICAgIGlmIChoaXN0Lmxlbmd0aCAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5Jyk9PSdjcmVhdGUnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0odGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTtcbiAgICAgICAgICB9KVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5uYW1lID09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKCdfbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgeyB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCk7IH1cbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgaWYgKGV2dC5uYW1lID09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiBoZXJlLCBjaGFuZ2UgdGhlIGltYWdlIGFuZCB0aGUgdG9vbGJveCBhY2NvcmRpbmcgdG8gd2hpY2ggYm9keUNvbmZpZ3VyYXRpb24gKHNlbnNvckNvbmZpZywgZm9yd2FyZCwgcmVhY3QsIHJvbGwpIGhhcyBiZWVuIHNlbGVjdGVkLlxuICAgICAgaWYgKGV2dC5uYW1lID09ICdGb3JtLkZpZWxkQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PSAnb3BhY2l0eScpIHtcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRCb2R5T3BhY2l0eShldnQuZGF0YS5kZWx0YS52YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2UgaWYgKGV2dC5jdXJyZW50VGFyZ2V0Ll9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gJ2Jsb2NrbHknKXtcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKGV2dC5kYXRhLmRlbHRhLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9sb2FkTW9kZWxJbkZvcm0oaWQpIHtcbiAgICAgIGlmICghaWQpIHJldHVybjtcbiAgICAgIGxldCBvbGRJZCA9IHRoaXMuX2N1cnJNb2RlbElkO1xuICAgICAgbGV0IHRhcmdldCA9IGlkID09ICdfbmV3JyA/IG51bGwgOiBpZDtcbiAgICAgIGlmIChvbGRJZCAhPSB0YXJnZXQpIHtcbiAgICAgICAgaWYgKGlkICE9ICdfbmV3Jykge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gaWQ7XG4gICAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke2lkfWApLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2Zvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IGRhdGE7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0Jsb2NrbHkuTG9hZCcsIGRhdGEuYmxvY2tseVhtbCk7XG4gICAgICAgICAgICAgIGZvciAobGV0IGlkeCA9IE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbikubGVuZ3RoIC0gMTsgaWR4ID49IDA7IGlkeC0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoT2JqZWN0LmtleXMoZGF0YS5jb25maWd1cmF0aW9uKVtpZHhdLm1hdGNoKFwiX3xjb3VudFwiKSkpIHtcbiAgICAgICAgICAgICAgICAgIGxldCBlbGVtTmFtZSA9IE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbilbaWR4XVxuICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihkYXRhLmNvbmZpZ3VyYXRpb25bZWxlbU5hbWVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZm9ybS5pbXBvcnQoZGF0YS5jb25maWd1cmF0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKVxuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBkYXRhLFxuICAgICAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ2hpc3RvcmljYWwnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgaWQ6ICdfbmV3J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fc2lsZW5jZUxvYWRMb2dzKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsSWQ6IGlkLFxuICAgICAgICAgICAgICB0YWI6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGFzdFNpbVNhdmVkICYmIHRoaXMuX2xhc3RTaW1TYXZlZC5pZCA9PSBvbGRJZCkge1xuICAgICAgICAvLyBoYW5kbGUgXCJyZXJ1bm5pbmdcIiBhIHNpbXVsYXRpb25cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5fbGFzdFNpbVNhdmVkLFxuICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TaW11bGF0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB2YXIgY29uZiA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICB2YXIgYmxvY2tseURhdGEgPSBudWxsO1xuICAgICAgdmFyIHNlbnNvckNvbmZpZ0pTT04gPSBudWxsO1xuXG4gICAgICB2YXIgc2F2ZURhdGEgPSB7XG4gICAgICAgIG5hbWU6IFwiKHNpbXVsYXRpb24pXCIsXG4gICAgICAgIHNpbXVsYXRlZDogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhdGlvbjogY29uZlxuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgYWN0aXZlIHRhYiBpcyAnYmxvY2tseScsIHRoZW4gd2UgaGF2ZSB0byBjb21waWxlIGFuZCBleHRyYWN0IHRoZSBibG9ja2x5IGNvZGUuXG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgYmxvY2tseURhdGEgPSB0aGlzLl9leHRyYWN0QmxvY2tseSgpO1xuICAgICAgICBzYXZlRGF0YSA9ICQuZXh0ZW5kKHNhdmVEYXRhLGJsb2NrbHlEYXRhKTtcbiAgICAgICAgc2Vuc29yQ29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLmdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24oKSk7XG4gICAgICAgIHNhdmVEYXRhID0gJC5leHRlbmQoc2F2ZURhdGEse3NlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT059KVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zYXZlTW9kZWwoIHNhdmVEYXRhICkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICB9KVxuXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzaW11bGF0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGJsb2NrbHlEYXRhID8gJC5leHRlbmQoY29uZiwge2pzQ29kZTogYmxvY2tseURhdGEuanNDb2RlLCBzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OfSkgOiBjb25mXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX2V4dHJhY3RCbG9ja2x5KCkge1xuICAgICAgLy8gZ2V0IHRoZSBCbG9ja2x5IGNvZGUgeG1sXG4gICAgICB2YXIgYmxvY2tseVhtbCA9IHdpbmRvdy5CbG9ja2x5LlhtbC53b3Jrc3BhY2VUb0RvbSh3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkpO1xuXG4gICAgICAvLyByZW1vdmUgYmxvY2tzIGZyb20gYmxvY2tseVhtbCB0aGF0IGFyZSBub3Qgd2l0aGluIHRoZSBtYWluIGJsb2NrXG4gICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChibG9ja2x5WG1sLmNoaWxkTm9kZXMpLm1hcCgoY2hpbGROb2RlKSA9PiB7XG4gICAgICAgIGlmIChjaGlsZE5vZGUudGFnTmFtZSA9PSAnQkxPQ0snICYmIGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSAhPSAnZXZlcnlfdGltZScpIHtcbiAgICAgICAgICBibG9ja2x5WG1sLnJlbW92ZUNoaWxkKGNoaWxkTm9kZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGdlbmVyYXRlIHRoZSBqYXZhc2NyaXB0IGNvZGUgb2YgdGhlIG1haW4gYmxvY2tcbiAgICAgIHZhciBibG9ja3MgPSB3aW5kb3cuQmxvY2tseS5tYWluV29ya3NwYWNlLmdldFRvcEJsb2Nrcyh0cnVlKTtcbiAgICAgIHZhciBmb3VuZE1haW5CbG9jayA9IGZhbHNlO1xuICAgICAgdmFyIGpzQ29kZSA9ICcnO1xuICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCBibG9ja3MubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgaWYgKGJsb2Nrc1tiXS50eXBlID09ICdldmVyeV90aW1lJykge1xuICAgICAgICAgIGpzQ29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuYmxvY2tUb0NvZGUoYmxvY2tzW2JdKVxuICAgICAgICAgIGZvdW5kTWFpbkJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kTWFpbkJsb2NrKSB7YWxlcnQoJ3RoZXJlIGlzIG5vIG1haW4gYmxvY2snKX1cblxuICAgICAgLy93aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LmFkZFJlc2VydmVkV29yZHMoJ2pzQ29kZScpO1xuICAgICAgLy92YXIganNDb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC53b3Jrc3BhY2VUb0NvZGUoIHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSApO1xuXG4gICAgICAvLyByZXR1cm4geG1sIGFuZCBqc0NvZGUgYXMgc3RyaW5ncyB3aXRoaW4ganMgb2JqZWN0XG4gICAgICAvLyBzdHJpbmdpZnk6IGJsb2NrbHlYbWwub3V0ZXJIVE1MIC8vIEFsdGVybmF0aXZlbHk6IGJsb2NrbHlYbWxUZXh0ID0gd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvVGV4dCh4bWwpIChwcm9kdWNlcyBtaW5pbWFsLCB1Z2x5IHN0cmluZylcbiAgICAgIC8vIHhtbC1pZnkgd2l0aCBqcXVlcnk6ICQucGFyc2VYTUwoc3RyaW5nKS5kb2N1bWVudEVsZW1lbnRcbiAgICAgIC8vIEFsdGVybmF0aXZlbHkgZm9yIHJlY3JlYXRpbmcgYmxvY2tzOiBibG9ja2x5WG1sID0gd2luZG93LlhtbC50ZXh0VG9Eb20oYmxvY2tseVhtbFRleHQpICYgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKHdpbmRvdy5CbG9ja2x5Lm1haW5Xb3Jrc3BhY2UsIGJsb2NrbHlYbWwpXG4gICAgICByZXR1cm4ge2Jsb2NrbHlYbWw6IGJsb2NrbHlYbWwub3V0ZXJIVE1MLCBqc0NvZGU6IGpzQ29kZX1cbiAgICB9XG5cbiAgICBfb25TYXZlUmVxdWVzdChldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuZGlzcGxheSh0aGlzLl9uYW1lRm9ybS52aWV3KCkpXG4gICAgfVxuXG4gICAgX3NhdmVNb2RlbChkYXRhKSB7XG4gICAgICBkYXRhLnN0dWRlbnRJZCA9IEdsb2JhbHMuZ2V0KCdzdHVkZW50X2lkJyk7XG4gICAgICBkYXRhLm1vZGVsVHlwZSA9IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyk7XG4gICAgICBkYXRhLmxhYiA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJyk7XG4gICAgICBsZXQgc2F2ZU9yVXBkYXRlO1xuICAgICAgaWYgKHRoaXMuX2xhc3RTaW1TYXZlZCkge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7dGhpcy5fbGFzdFNpbVNhdmVkLmlkfWAsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgICAgICAgc2ltdWxhdGVkOiBkYXRhLnNpbXVsYXRlZFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V1Z2xlbmFNb2RlbHMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNhdmVPclVwZGF0ZS50aGVuKChzZXJ2ZXJEYXRhKSA9PiB7XG4gICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IHNlcnZlckRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlcnZlckRhdGEpIHJldHVybjtcbiAgICAgICAgcmV0dXJuIHNlcnZlckRhdGE7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVTdWJtaXQoZXZ0KSB7XG4gICAgICBsZXQgbW9kZWw7XG5cbiAgICAgIHZhciBibG9ja2x5RGF0YSA9IG51bGw7XG4gICAgICB2YXIgc2Vuc29yQ29uZmlnSlNPTiA9IG51bGw7XG5cbiAgICAgIC8vIGlmIHRoZSBhY3RpdmUgdGFiIGlzICdibG9ja2x5JywgdGhlbiB3ZSBoYXZlIHRvIGNvbXBpbGUgYW5kIGV4dHJhY3QgdGhlIGJsb2NrbHkgY29kZS5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICBibG9ja2x5RGF0YSA9IHRoaXMuX2V4dHJhY3RCbG9ja2x5KCk7XG4gICAgICAgIHNlbnNvckNvbmZpZ0pTT04gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5nZXRBY3RpdmVTZW5zb3JDb25maWd1cmF0aW9uKCkpO1xuICAgICAgICBibG9ja2x5RGF0YSA9ICQuZXh0ZW5kKGJsb2NrbHlEYXRhLHtzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbmFtZUZvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zYXZlTW9kZWwoJC5leHRlbmQoYmxvY2tseURhdGEse1xuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWUsXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fZm9ybS5leHBvcnQoKSxcbiAgICAgICAgICBzaW11bGF0ZWQ6IGZhbHNlXG4gICAgICAgIH0pKVxuICAgICAgfSkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbmFtZUZvcm0uY2xlYXIoKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBtb2RlbC5pZFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2F2ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY29uZmlndXJhdGlvbjogYmxvY2tseURhdGEgPyAkLmV4dGVuZCh0aGlzLl9mb3JtLmV4cG9ydCgpLCB7c2Vuc29yQ29uZmlnSlNPTjogc2Vuc29yQ29uZmlnSlNPTiwganNDb2RlOiBibG9ja2x5RGF0YS5qc0NvZGV9KSA6IHRoaXMuX2Zvcm0uZXhwb3J0KCkgLFxuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZUNhbmNlbChldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfb25BZ2dyZWdhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudC5pZCcpLCB0aGlzLl9jdXJyZW50TW9kZWwpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5BZGRSZXF1ZXN0Jywge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdHNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJhZ2dyZWdhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsSWQ6IHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5ld1JlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9vbkNvbmZpZ0NoYW5nZShldnQpO1xuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgbW9kZWxfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRNb2RlbE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSkge1xuICAgICAgICBzd2l0Y2goR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsVGFiLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbFRhYih7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbFRhYjtcblxufSlcbiJdfQ==
