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
        paramOptions['motor'] = Object.keys(_this._model.get('parameters').v.options);
        if (_this._model.get('parameters').modelRepresentation === 'functional') {
          paramOptions['roll'] = Object.keys(_this._model.get('parameters').omega.options);
        } else if (_this._model.get('parameters').modelRepresentation === 'mechanistic') {
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

        // In here, change the image and the toolbox according to which bodyConfiguration (sensorConfig, motor, react, roll, motion type) has been selected.
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJ0aXRsZU5vZGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJpbm5lckhUTUwiLCIkZG9tIiwiYXBwZW5kIiwiX25hbWVGb3JtIiwiX29uTmFtZVN1Ym1pdCIsIl9vbk5hbWVDYW5jZWwiLCJhZGRDaGlsZCIsImluaXRpYWxCb2R5IiwiZXhwb3J0IiwicGFyYW1PcHRpb25zIiwiT2JqZWN0Iiwia2V5cyIsIksiLCJvcHRpb25zIiwidiIsIm1vZGVsUmVwcmVzZW50YXRpb24iLCJvbWVnYSIsIm1vdGlvbiIsImJvZHlDb25maWd1cmF0aW9ucyIsImluaXRpYWxDb25maWciLCJfc2V0TW9kZWxSZXByZXNlbnRhdGlvbiIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25QaGFzZUNoYW5nZSIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsIl9jdXJyTW9kZWxJZCIsIl9jdXJyZW50TW9kZWwiLCJoaXN0b3J5Q291bnQiLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsInRoZW4iLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsIm1vZGVsX2hpc3RvcnlfaWQiLCJzZXRTdGF0ZSIsIl9sb2FkTW9kZWxJbkZvcm0iLCJuYW1lIiwiX2RhdGEiLCJjdXJyZW50VGFyZ2V0IiwiX2xhc3RTaW1TYXZlZCIsImZpZWxkIiwic2V0Qm9keU9wYWNpdHkiLCJkZWx0YSIsInZhbHVlIiwic2V0QWN0aXZlQ29uZmlndXJhdGlvbiIsIm9sZElkIiwidGFyZ2V0IiwicHJvbWlzZUFqYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGF0Y2hFdmVudCIsImJsb2NrbHlYbWwiLCJpZHgiLCJjb25maWd1cmF0aW9uIiwibWF0Y2giLCJlbGVtTmFtZSIsIm1vZGVsIiwidGFiSWQiLCJzaW11bGF0ZWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImJsb2NrbHlEYXRhIiwic2Vuc29yQ29uZmlnSlNPTiIsInNhdmVEYXRhIiwiX2V4dHJhY3RCbG9ja2x5IiwiZXh0ZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24iLCJfc2F2ZU1vZGVsIiwianNDb2RlIiwid2luZG93IiwiQmxvY2tseSIsIlhtbCIsIndvcmtzcGFjZVRvRG9tIiwiZ2V0TWFpbldvcmtzcGFjZSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiY2hpbGROb2RlcyIsIm1hcCIsImNoaWxkTm9kZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVDaGlsZCIsImJsb2NrcyIsIm1haW5Xb3Jrc3BhY2UiLCJnZXRUb3BCbG9ja3MiLCJmb3VuZE1haW5CbG9jayIsImIiLCJKYXZhU2NyaXB0IiwiYmxvY2tUb0NvZGUiLCJhbGVydCIsIm91dGVySFRNTCIsImRpc3BsYXkiLCJzdHVkZW50SWQiLCJsYWIiLCJzYXZlT3JVcGRhdGUiLCJtZXRob2QiLCJjb250ZW50VHlwZSIsInNlcnZlckRhdGEiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJoaWRlIiwiY2xlYXIiLCJnZXRNb2RlbFJlc3VsdHMiLCJyZXN1bHRzIiwiZGlzYWJsZSIsImVuYWJsZSIsInBoYXNlIiwidG9Mb3dlckNhc2UiLCJoaWRlRmllbGRzIiwiZGlzYWJsZUZpZWxkcyIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxJQUFJRCxRQUFRLFFBQVIsQ0FBVjs7QUFFQSxNQUFNRSxVQUFVRixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUcsUUFBUUgsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUksS0FBS0osUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1LLFlBQVlMLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFTSxRQUFRTixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVPLE9BQU9QLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRVEsbUJBQW1CUixRQUFRLGlCQUFSLENBSnJCO0FBQUEsTUFLRVMsWUFBWVQsUUFBUSxjQUFSLENBTGQ7QUFBQSxNQU1FVSxXQUFXVixRQUFRLGtCQUFSLENBTmI7QUFBQSxNQU9FVyxXQUFXWCxRQUFRLGVBQVIsQ0FQYjtBQUFBLE1BUUVZLHFCQUFxQlosUUFBUSxrRUFBUixDQVJ2Qjs7QUFQa0IsTUFpQlphLFFBakJZO0FBQUE7O0FBa0JoQix3QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCVCxLQUE3QztBQUNBUSxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCVCxJQUEzQzs7QUFGeUIsc0hBR25CTyxRQUhtQjs7QUFJekJYLFlB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LENBQVdvSSxVQUFYO0FBQ0EsbUJBQUs3SSxRQUFMLENBQWM2SSxVQUFkO0FBQ0Y7QUFDQSxpQkFBSyxTQUFMO0FBQ0UsbUJBQUtwSSxLQUFMLENBQVdxSSxhQUFYO0FBQ0EsbUJBQUs5SSxRQUFMLENBQWM4SSxhQUFkO0FBQ0Y7QUFSSjtBQVVEO0FBQ0Y7QUEvYWU7O0FBQUE7QUFBQSxJQWlCSzNKLFNBakJMOztBQW1ibEJRLFdBQVNNLE1BQVQsR0FBa0IsVUFBQ2tELElBQUQsRUFBVTtBQUMxQixXQUFPLElBQUl4RCxRQUFKLENBQWEsRUFBRW9KLFdBQVc1RixJQUFiLEVBQWIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT3hELFFBQVA7QUFFRCxDQXpiRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbC90YWIvdGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuXG4gICAgTW9kZWxIaXN0b3J5Rm9ybSA9IHJlcXVpcmUoJy4uL2hpc3RvcnkvZm9ybScpLFxuICAgIE1vZGVsRm9ybSA9IHJlcXVpcmUoJy4uL2Zvcm0vZm9ybScpLFxuICAgIE5hbWVGb3JtID0gcmVxdWlyZSgnLi4vbmFtZWZvcm0vZm9ybScpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpLFxuICAgIEJvZHlDb25maWd1cmF0aW9ucyA9IHJlcXVpcmUoJ2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvYm9keWNvbmZpZ3MnKTtcblxuICBjbGFzcyBNb2RlbFRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vblNpbXVsYXRlUmVxdWVzdCcsICdfb25TYXZlUmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19vbk5hbWVDYW5jZWwnLCAnX29uTmFtZVN1Ym1pdCcsICdfb25HbG9iYWxzQ2hhbmdlJywgJ19sb2FkTW9kZWxJbkZvcm0nLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3UmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZScsXG4gICAgICAgICdfb25EaXNhYmxlUmVxdWVzdCcsJ19vbkVuYWJsZVJlcXVlc3QnXG4gICAgICBdKTtcblxuICAgICAgdGhpcy5faGlzdG9yeSA9IE1vZGVsSGlzdG9yeUZvcm0uY3JlYXRlKHtcbiAgICAgICAgaWQ6IGBtb2RlbF9oaXN0b3J5X18ke3RoaXMuX21vZGVsLmdldChcImlkXCIpfWAsXG4gICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcblxuICAgICAgdGhpcy5fZm9ybSA9IE1vZGVsRm9ybS5jcmVhdGUoe1xuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgIGZpZWxkQ29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKSxcbiAgICAgICAgZXVnbGVuYUNvdW50Q29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ2V1Z2xlbmFDb3VudCcpXG4gICAgICB9KVxuICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TaW11bGF0ZScsIHRoaXMuX29uU2ltdWxhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TYXZlJywgdGhpcy5fb25TYXZlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld1JlcXVlc3QpO1xuXG4gICAgICAvLyBJbnNlcnQgYSB0aXRsZSBvZiB0aGUgdGFiXG4gICAgICB2YXIgdGl0bGVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgIHRpdGxlTm9kZS5jbGFzc05hbWUgPSAndGFiX19tb2RlbF9fdGl0bGUnXG4gICAgICB0aXRsZU5vZGUuaW5uZXJIVE1MID0gJ01vZGVsIG9mIHRoZSBCb2R5J1xuXG4gICAgICB0aGlzLnZpZXcoKS4kZG9tKCkuYXBwZW5kKHRpdGxlTm9kZSlcblxuICAgICAgdGhpcy5fbmFtZUZvcm0gPSBOYW1lRm9ybS5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuU3VibWl0JywgdGhpcy5fb25OYW1lU3VibWl0KTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuQ2FuY2VsJywgdGhpcy5fb25OYW1lQ2FuY2VsKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcblxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIC8vIENyZWF0ZSBib2R5IGNvbmZpZ3VyYXRpb24gbW9kZWwgaW5zdGFuY2UuXG4gICAgICAgIHZhciBpbml0aWFsQm9keSA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICAgIHZhciBwYXJhbU9wdGlvbnMgPSB7fVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ3JlYWN0aW9uJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5LLm9wdGlvbnMpXG4gICAgICAgIHBhcmFtT3B0aW9uc1snbW90b3InXSA9IE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLnYub3B0aW9ucylcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLm1vZGVsUmVwcmVzZW50YXRpb24gPT09ICdmdW5jdGlvbmFsJykge1xuICAgICAgICAgIHBhcmFtT3B0aW9uc1sncm9sbCddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykub21lZ2Eub3B0aW9ucylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5tb2RlbFJlcHJlc2VudGF0aW9uID09PSAnbWVjaGFuaXN0aWMnKSB7XG4gICAgICAgICAgcGFyYW1PcHRpb25zWydtb3Rpb24nXSA9IE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLm1vdGlvbi5vcHRpb25zKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zID0gQm9keUNvbmZpZ3VyYXRpb25zLmNyZWF0ZSh7aW5pdGlhbENvbmZpZzogaW5pdGlhbEJvZHksIHBhcmFtT3B0aW9uczogcGFyYW1PcHRpb25zLCBtb2RlbFJlcHJlc2VudGF0aW9uOiB0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5tb2RlbFJlcHJlc2VudGF0aW9ufSlcblxuICAgICAgICAvLyBhZGQgdmlldyBvZiB0aGUgbW9kZWwgaW5zdGFuY2UgdG8gdGhpcy52aWV3KClcbiAgICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkQ2hpbGQodGhpcy5ib2R5Q29uZmlndXJhdGlvbnMudmlldygpLG51bGwsMCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2Zvcm0udmlldygpKTtcblxuICAgICAgdGhpcy5fc2V0TW9kZWxSZXByZXNlbnRhdGlvbigpO1xuXG4gICAgICBHbG9iYWxzLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uR2xvYmFsc0NoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLkFkZCcsdGhpcy5fb25EaXNhYmxlUmVxdWVzdCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLlJlbW92ZScsdGhpcy5fb25FbmFibGVSZXF1ZXN0KTtcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsSWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3Vyck1vZGVsSWQ7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRNb2RlbDtcbiAgICB9XG5cbiAgICBjb2xvcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2NvbG9yJylcbiAgICB9XG5cbiAgICBoaXN0b3J5Q291bnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5oaXN0b3J5Q291bnQoKTtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSAnc3R1ZGVudF9pZCc6XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKVxuICAgICAgICAgICAgaWYgKGhpc3QubGVuZ3RoICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKT09J2NyZWF0ZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBoaXN0W2hpc3QubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybSh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWQpO1xuICAgICAgICAgIH0pXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oJ19uZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7IHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTsgfVxuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAodGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGhlcmUsIGNoYW5nZSB0aGUgaW1hZ2UgYW5kIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBib2R5Q29uZmlndXJhdGlvbiAoc2Vuc29yQ29uZmlnLCBtb3RvciwgcmVhY3QsIHJvbGwsIG1vdGlvbiB0eXBlKSBoYXMgYmVlbiBzZWxlY3RlZC5cbiAgICAgIGlmIChldnQubmFtZSA9PSAnRm9ybS5GaWVsZENoYW5nZWQnKSB7XG4gICAgICAgIGlmIChldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWQgPT0gJ29wYWNpdHknKSB7XG4gICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0Qm9keU9wYWNpdHkoZXZ0LmRhdGEuZGVsdGEudmFsdWUpXG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIGlmIChldnQuY3VycmVudFRhcmdldC5fbW9kZWwuX2RhdGEubW9kZWxUeXBlID09ICdibG9ja2x5Jyl7XG4gICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihldnQuZGF0YS5kZWx0YS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfbG9hZE1vZGVsSW5Gb3JtKGlkKSB7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBsZXQgb2xkSWQgPSB0aGlzLl9jdXJyTW9kZWxJZDtcbiAgICAgIGxldCB0YXJnZXQgPSBpZCA9PSAnX25ldycgPyBudWxsIDogaWQ7XG4gICAgICBpZiAob2xkSWQgIT0gdGFyZ2V0KSB7XG4gICAgICAgIGlmIChpZCAhPSAnX25ldycpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHtpZH1gKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9mb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBkYXRhO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWwuX2RhdGEubW9kZWxUeXBlID09ICdibG9ja2x5Jykge1xuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdCbG9ja2x5LkxvYWQnLCBkYXRhLmJsb2NrbHlYbWwpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBpZHggPSBPYmplY3Qua2V5cyhkYXRhLmNvbmZpZ3VyYXRpb24pLmxlbmd0aCAtIDE7IGlkeCA+PSAwOyBpZHgtLSkge1xuICAgICAgICAgICAgICAgIGlmICghKE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbilbaWR4XS5tYXRjaChcIl98Y291bnRcIikpKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgZWxlbU5hbWUgPSBPYmplY3Qua2V5cyhkYXRhLmNvbmZpZ3VyYXRpb24pW2lkeF1cbiAgICAgICAgICAgICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oZGF0YS5jb25maWd1cmF0aW9uW2VsZW1OYW1lXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2Zvcm0uaW1wb3J0KGRhdGEuY29uZmlndXJhdGlvbikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgICBtb2RlbDogZGF0YSxcbiAgICAgICAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGRhdGEuc2ltdWxhdGVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fY3Vyck1vZGVsSWQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IG51bGw7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgIGlkOiAnX25ldydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3NpbGVuY2VMb2FkTG9ncykge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJsb2FkXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbElkOiBpZCxcbiAgICAgICAgICAgICAgdGFiOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2xhc3RTaW1TYXZlZCAmJiB0aGlzLl9sYXN0U2ltU2F2ZWQuaWQgPT0gb2xkSWQpIHtcbiAgICAgICAgLy8gaGFuZGxlIFwicmVydW5uaW5nXCIgYSBzaW11bGF0aW9uXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgbW9kZWw6IHRoaXMuX2xhc3RTaW1TYXZlZCxcbiAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uU2ltdWxhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgdmFyIGNvbmYgPSB0aGlzLl9mb3JtLmV4cG9ydCgpO1xuICAgICAgdmFyIGJsb2NrbHlEYXRhID0gbnVsbDtcbiAgICAgIHZhciBzZW5zb3JDb25maWdKU09OID0gbnVsbDtcblxuICAgICAgdmFyIHNhdmVEYXRhID0ge1xuICAgICAgICBuYW1lOiBcIihzaW11bGF0aW9uKVwiLFxuICAgICAgICBzaW11bGF0ZWQ6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgICAgc2F2ZURhdGEgPSAkLmV4dGVuZChzYXZlRGF0YSxibG9ja2x5RGF0YSk7XG4gICAgICAgIHNlbnNvckNvbmZpZ0pTT04gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5nZXRBY3RpdmVTZW5zb3JDb25maWd1cmF0aW9uKCkpO1xuICAgICAgICBzYXZlRGF0YSA9ICQuZXh0ZW5kKHNhdmVEYXRhLHtzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2F2ZU1vZGVsKCBzYXZlRGF0YSApLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybShtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgfSlcblxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2ltdWxhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBibG9ja2x5RGF0YSA/ICQuZXh0ZW5kKGNvbmYsIHtqc0NvZGU6IGJsb2NrbHlEYXRhLmpzQ29kZSwgc2Vuc29yQ29uZmlnSlNPTjogc2Vuc29yQ29uZmlnSlNPTn0pIDogY29uZlxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9leHRyYWN0QmxvY2tseSgpIHtcbiAgICAgIC8vIGdldCB0aGUgQmxvY2tseSBjb2RlIHhtbFxuICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcblxuICAgICAgLy8gcmVtb3ZlIGJsb2NrcyBmcm9tIGJsb2NrbHlYbWwgdGhhdCBhcmUgbm90IHdpdGhpbiB0aGUgbWFpbiBibG9ja1xuICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYmxvY2tseVhtbC5jaGlsZE5vZGVzKS5tYXAoKGNoaWxkTm9kZSkgPT4ge1xuICAgICAgICBpZiAoY2hpbGROb2RlLnRhZ05hbWUgPT0gJ0JMT0NLJyAmJiBjaGlsZE5vZGUuZ2V0QXR0cmlidXRlKCd0eXBlJykgIT0gJ2V2ZXJ5X3RpbWUnKSB7XG4gICAgICAgICAgYmxvY2tseVhtbC5yZW1vdmVDaGlsZChjaGlsZE5vZGUpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBnZW5lcmF0ZSB0aGUgamF2YXNjcmlwdCBjb2RlIG9mIHRoZSBtYWluIGJsb2NrXG4gICAgICB2YXIgYmxvY2tzID0gd2luZG93LkJsb2NrbHkubWFpbldvcmtzcGFjZS5nZXRUb3BCbG9ja3ModHJ1ZSk7XG4gICAgICB2YXIgZm91bmRNYWluQmxvY2sgPSBmYWxzZTtcbiAgICAgIHZhciBqc0NvZGUgPSAnJztcbiAgICAgIGZvciAodmFyIGIgPSAwOyBiIDwgYmxvY2tzLmxlbmd0aDsgYisrKSB7XG4gICAgICAgIGlmIChibG9ja3NbYl0udHlwZSA9PSAnZXZlcnlfdGltZScpIHtcbiAgICAgICAgICBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LmJsb2NrVG9Db2RlKGJsb2Nrc1tiXSlcbiAgICAgICAgICBmb3VuZE1haW5CbG9jayA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3VuZE1haW5CbG9jaykge2FsZXJ0KCd0aGVyZSBpcyBubyBtYWluIGJsb2NrJyl9XG5cbiAgICAgIC8vd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5hZGRSZXNlcnZlZFdvcmRzKCdqc0NvZGUnKTtcbiAgICAgIC8vdmFyIGpzQ29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQud29ya3NwYWNlVG9Db2RlKCB3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkgKTtcblxuICAgICAgLy8gcmV0dXJuIHhtbCBhbmQganNDb2RlIGFzIHN0cmluZ3Mgd2l0aGluIGpzIG9iamVjdFxuICAgICAgLy8gc3RyaW5naWZ5OiBibG9ja2x5WG1sLm91dGVySFRNTCAvLyBBbHRlcm5hdGl2ZWx5OiBibG9ja2x5WG1sVGV4dCA9IHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1RleHQoeG1sKSAocHJvZHVjZXMgbWluaW1hbCwgdWdseSBzdHJpbmcpXG4gICAgICAvLyB4bWwtaWZ5IHdpdGgganF1ZXJ5OiAkLnBhcnNlWE1MKHN0cmluZykuZG9jdW1lbnRFbGVtZW50XG4gICAgICAvLyBBbHRlcm5hdGl2ZWx5IGZvciByZWNyZWF0aW5nIGJsb2NrczogYmxvY2tseVhtbCA9IHdpbmRvdy5YbWwudGV4dFRvRG9tKGJsb2NrbHlYbWxUZXh0KSAmIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZSh3aW5kb3cuQmxvY2tseS5tYWluV29ya3NwYWNlLCBibG9ja2x5WG1sKVxuICAgICAgcmV0dXJuIHtibG9ja2x5WG1sOiBibG9ja2x5WG1sLm91dGVySFRNTCwganNDb2RlOiBqc0NvZGV9XG4gICAgfVxuXG4gICAgX29uU2F2ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmRpc3BsYXkodGhpcy5fbmFtZUZvcm0udmlldygpKVxuICAgIH1cblxuICAgIF9zYXZlTW9kZWwoZGF0YSkge1xuICAgICAgZGF0YS5zdHVkZW50SWQgPSBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpO1xuICAgICAgZGF0YS5tb2RlbFR5cGUgPSB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpO1xuICAgICAgZGF0YS5sYWIgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpO1xuICAgICAgbGV0IHNhdmVPclVwZGF0ZTtcbiAgICAgIGlmICh0aGlzLl9sYXN0U2ltU2F2ZWQpIHtcbiAgICAgICAgc2F2ZU9yVXBkYXRlID0gVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke3RoaXMuX2xhc3RTaW1TYXZlZC5pZH1gLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgICAgICAgIHNpbXVsYXRlZDogZGF0YS5zaW11bGF0ZWRcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FdWdsZW5hTW9kZWxzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBzYXZlT3JVcGRhdGUudGhlbigoc2VydmVyRGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBzZXJ2ZXJEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXJ2ZXJEYXRhKSByZXR1cm47XG4gICAgICAgIHJldHVybiBzZXJ2ZXJEYXRhO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lU3VibWl0KGV2dCkge1xuICAgICAgbGV0IG1vZGVsO1xuXG4gICAgICB2YXIgYmxvY2tseURhdGEgPSBudWxsO1xuICAgICAgdmFyIHNlbnNvckNvbmZpZ0pTT04gPSBudWxsO1xuXG4gICAgICAvLyBpZiB0aGUgYWN0aXZlIHRhYiBpcyAnYmxvY2tseScsIHRoZW4gd2UgaGF2ZSB0byBjb21waWxlIGFuZCBleHRyYWN0IHRoZSBibG9ja2x5IGNvZGUuXG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgYmxvY2tseURhdGEgPSB0aGlzLl9leHRyYWN0QmxvY2tseSgpO1xuICAgICAgICBzZW5zb3JDb25maWdKU09OID0gSlNPTi5zdHJpbmdpZnkodGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuZ2V0QWN0aXZlU2Vuc29yQ29uZmlndXJhdGlvbigpKTtcbiAgICAgICAgYmxvY2tseURhdGEgPSAkLmV4dGVuZChibG9ja2x5RGF0YSx7c2Vuc29yQ29uZmlnSlNPTjogc2Vuc29yQ29uZmlnSlNPTn0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX25hbWVGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2F2ZU1vZGVsKCQuZXh0ZW5kKGJsb2NrbHlEYXRhLHtcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2Zvcm0uZXhwb3J0KCksXG4gICAgICAgICAgc2ltdWxhdGVkOiBmYWxzZVxuICAgICAgICB9KSlcbiAgICAgIH0pLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogbW9kZWwuaWRcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInNhdmVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGJsb2NrbHlEYXRhID8gJC5leHRlbmQodGhpcy5fZm9ybS5leHBvcnQoKSwge3NlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT04sIGpzQ29kZTogYmxvY2tseURhdGEuanNDb2RlfSkgOiB0aGlzLl9mb3JtLmV4cG9ydCgpICxcbiAgICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgICAgbmFtZTogdGhpcy5fbmFtZUZvcm0uZXhwb3J0KCkubmFtZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVDYW5jZWwoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fbmFtZUZvcm0uY2xlYXIoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX29uQWdncmVnYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIEV1Z1V0aWxzLmdldE1vZGVsUmVzdWx0cyhHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQuaWQnKSwgdGhpcy5fY3VycmVudE1vZGVsKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuQWRkUmVxdWVzdCcsIHtcbiAgICAgICAgICBkYXRhOiByZXN1bHRzXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwiYWdncmVnYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlbElkOiB0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25EaXNhYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX2Zvcm0uZGlzYWJsZSgpO1xuICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlKCk7XG4gICAgfVxuXG4gICAgX29uRW5hYmxlUmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX2Zvcm0uZW5hYmxlKCk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmVuYWJsZSgpO1xuICAgIH1cblxuICAgIF9vbk5ld1JlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9vbkNvbmZpZ0NoYW5nZShldnQpO1xuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgbW9kZWxfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRNb2RlbFJlcHJlc2VudGF0aW9uKCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSkge1xuICAgICAgICBzd2l0Y2goR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsVGFiLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbFRhYih7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbFRhYjtcblxufSlcbiJdfQ==
