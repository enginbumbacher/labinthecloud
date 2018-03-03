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
        } else if (this._history.export().model_history_id != '_new') {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJ0aXRsZU5vZGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJpbm5lckhUTUwiLCIkZG9tIiwiYXBwZW5kIiwiX25hbWVGb3JtIiwiX29uTmFtZVN1Ym1pdCIsIl9vbk5hbWVDYW5jZWwiLCJhZGRDaGlsZCIsImluaXRpYWxCb2R5IiwiZXhwb3J0IiwicGFyYW1PcHRpb25zIiwiT2JqZWN0Iiwia2V5cyIsIksiLCJvcHRpb25zIiwidiIsIm9tZWdhIiwibW90aW9uIiwiYm9keUNvbmZpZ3VyYXRpb25zIiwiaW5pdGlhbENvbmZpZyIsIm1vZGVsUmVwcmVzZW50YXRpb24iLCJfc2V0TW9kZWxSZXByZXNlbnRhdGlvbiIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25QaGFzZUNoYW5nZSIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsIl9jdXJyTW9kZWxJZCIsIl9jdXJyZW50TW9kZWwiLCJoaXN0b3J5Q291bnQiLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsInRoZW4iLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsIm1vZGVsX2hpc3RvcnlfaWQiLCJzZXRTdGF0ZSIsIl9sb2FkTW9kZWxJbkZvcm0iLCJuYW1lIiwiX2RhdGEiLCJjdXJyZW50VGFyZ2V0IiwiX2xhc3RTaW1TYXZlZCIsImZpZWxkIiwic2V0Qm9keU9wYWNpdHkiLCJkZWx0YSIsInZhbHVlIiwic2V0QWN0aXZlQ29uZmlndXJhdGlvbiIsIm9sZElkIiwidGFyZ2V0IiwicHJvbWlzZUFqYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGF0Y2hFdmVudCIsImJsb2NrbHlYbWwiLCJpZHgiLCJjb25maWd1cmF0aW9uIiwibWF0Y2giLCJlbGVtTmFtZSIsIm1vZGVsIiwidGFiSWQiLCJzaW11bGF0ZWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImJsb2NrbHlEYXRhIiwic2Vuc29yQ29uZmlnSlNPTiIsInNhdmVEYXRhIiwiX2V4dHJhY3RCbG9ja2x5IiwiZXh0ZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24iLCJfc2F2ZU1vZGVsIiwianNDb2RlIiwid2luZG93IiwiQmxvY2tseSIsIlhtbCIsIndvcmtzcGFjZVRvRG9tIiwiZ2V0TWFpbldvcmtzcGFjZSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiY2hpbGROb2RlcyIsIm1hcCIsImNoaWxkTm9kZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVDaGlsZCIsImJsb2NrcyIsIm1haW5Xb3Jrc3BhY2UiLCJnZXRUb3BCbG9ja3MiLCJmb3VuZE1haW5CbG9jayIsImIiLCJKYXZhU2NyaXB0IiwiYmxvY2tUb0NvZGUiLCJhbGVydCIsIm91dGVySFRNTCIsImRpc3BsYXkiLCJzdHVkZW50SWQiLCJsYWIiLCJzYXZlT3JVcGRhdGUiLCJtZXRob2QiLCJjb250ZW50VHlwZSIsInNlcnZlckRhdGEiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJoaWRlIiwiY2xlYXIiLCJnZXRNb2RlbFJlc3VsdHMiLCJyZXN1bHRzIiwiZGlzYWJsZSIsImVuYWJsZSIsInBoYXNlIiwidG9Mb3dlckNhc2UiLCJoaWRlRmllbGRzIiwiZGlzYWJsZUZpZWxkcyIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxJQUFJRCxRQUFRLFFBQVIsQ0FBVjs7QUFFQSxNQUFNRSxVQUFVRixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUcsUUFBUUgsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUksS0FBS0osUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1LLFlBQVlMLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFTSxRQUFRTixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVPLE9BQU9QLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRVEsbUJBQW1CUixRQUFRLGlCQUFSLENBSnJCO0FBQUEsTUFLRVMsWUFBWVQsUUFBUSxjQUFSLENBTGQ7QUFBQSxNQU1FVSxXQUFXVixRQUFRLGtCQUFSLENBTmI7QUFBQSxNQU9FVyxXQUFXWCxRQUFRLGVBQVIsQ0FQYjtBQUFBLE1BUUVZLHFCQUFxQlosUUFBUSxrRUFBUixDQVJ2Qjs7QUFQa0IsTUFpQlphLFFBakJZO0FBQUE7O0FBa0JoQix3QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCVCxLQUE3QztBQUNBUSxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCVCxJQUEzQzs7QUFGeUIsc0hBR25CTyxRQUhtQjs7QUFJekJYLFlB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UUFBTCxDQUFjNkksVUFBZDtBQUNGO0FBQ0EsaUJBQUssU0FBTDtBQUNFLG1CQUFLcEksS0FBTCxDQUFXcUksYUFBWDtBQUNBLG1CQUFLOUksUUFBTCxDQUFjOEksYUFBZDtBQUNGO0FBUko7QUFVRDtBQUNGO0FBL2FlOztBQUFBO0FBQUEsSUFpQkszSixTQWpCTDs7QUFtYmxCUSxXQUFTTSxNQUFULEdBQWtCLFVBQUNrRCxJQUFELEVBQVU7QUFDMUIsV0FBTyxJQUFJeEQsUUFBSixDQUFhLEVBQUVvSixXQUFXNUYsSUFBYixFQUFiLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU94RCxRQUFQO0FBRUQsQ0F6YkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvdGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcblxuICAgIE1vZGVsSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBNb2RlbEZvcm0gPSByZXF1aXJlKCcuLi9mb3JtL2Zvcm0nKSxcbiAgICBOYW1lRm9ybSA9IHJlcXVpcmUoJy4uL25hbWVmb3JtL2Zvcm0nKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKSxcbiAgICBCb2R5Q29uZmlndXJhdGlvbnMgPSByZXF1aXJlKCdldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzJyk7XG5cbiAgY2xhc3MgTW9kZWxUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25TaW11bGF0ZVJlcXVlc3QnLCAnX29uU2F2ZVJlcXVlc3QnLCAnX29uQWdncmVnYXRlUmVxdWVzdCcsXG4gICAgICAgICdfb25OYW1lQ2FuY2VsJywgJ19vbk5hbWVTdWJtaXQnLCAnX29uR2xvYmFsc0NoYW5nZScsICdfbG9hZE1vZGVsSW5Gb3JtJyxcbiAgICAgICAgJ19vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UnLCAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld1JlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgICAnX29uRGlzYWJsZVJlcXVlc3QnLCdfb25FbmFibGVSZXF1ZXN0J1xuICAgICAgXSk7XG5cbiAgICAgIHRoaXMuX2hpc3RvcnkgPSBNb2RlbEhpc3RvcnlGb3JtLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBgbW9kZWxfaGlzdG9yeV9fJHt0aGlzLl9tb2RlbC5nZXQoXCJpZFwiKX1gLFxuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX2Zvcm0gPSBNb2RlbEZvcm0uY3JlYXRlKHtcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICBmaWVsZENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJyksXG4gICAgICAgIGV1Z2xlbmFDb3VudENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdldWdsZW5hQ291bnQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2ltdWxhdGUnLCB0aGlzLl9vblNpbXVsYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2F2ZScsIHRoaXMuX29uU2F2ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdSZXF1ZXN0KTtcblxuICAgICAgLy8gSW5zZXJ0IGEgdGl0bGUgb2YgdGhlIHRhYlxuICAgICAgdmFyIHRpdGxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICB0aXRsZU5vZGUuY2xhc3NOYW1lID0gJ3RhYl9fbW9kZWxfX3RpdGxlJ1xuICAgICAgdGl0bGVOb2RlLmlubmVySFRNTCA9ICdNb2RlbCBvZiB0aGUgQm9keSdcblxuICAgICAgdGhpcy52aWV3KCkuJGRvbSgpLmFwcGVuZCh0aXRsZU5vZGUpXG5cbiAgICAgIHRoaXMuX25hbWVGb3JtID0gTmFtZUZvcm0uY3JlYXRlKCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLlN1Ym1pdCcsIHRoaXMuX29uTmFtZVN1Ym1pdCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLkNhbmNlbCcsIHRoaXMuX29uTmFtZUNhbmNlbCk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICAvLyBDcmVhdGUgYm9keSBjb25maWd1cmF0aW9uIG1vZGVsIGluc3RhbmNlLlxuICAgICAgICB2YXIgaW5pdGlhbEJvZHkgPSB0aGlzLl9mb3JtLmV4cG9ydCgpO1xuICAgICAgICB2YXIgcGFyYW1PcHRpb25zID0ge31cbiAgICAgICAgcGFyYW1PcHRpb25zWydyZWFjdGlvbiddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykuSy5vcHRpb25zKVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ21vdG9yJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS52Lm9wdGlvbnMpXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5vbWVnYSkge1xuICAgICAgICAgIHBhcmFtT3B0aW9uc1sncm9sbCddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykub21lZ2Eub3B0aW9ucylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5tb3Rpb24pIHtcbiAgICAgICAgICBwYXJhbU9wdGlvbnNbJ21vdGlvbiddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykubW90aW9uLm9wdGlvbnMpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMgPSBCb2R5Q29uZmlndXJhdGlvbnMuY3JlYXRlKHtpbml0aWFsQ29uZmlnOiBpbml0aWFsQm9keSwgcGFyYW1PcHRpb25zOiBwYXJhbU9wdGlvbnMsIG1vZGVsUmVwcmVzZW50YXRpb246IHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLm1vZGVsUmVwcmVzZW50YXRpb259KVxuXG4gICAgICAgIC8vIGFkZCB2aWV3IG9mIHRoZSBtb2RlbCBpbnN0YW5jZSB0byB0aGlzLnZpZXcoKVxuICAgICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRDaGlsZCh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy52aWV3KCksbnVsbCwwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZm9ybS52aWV3KCkpO1xuXG4gICAgICB0aGlzLl9zZXRNb2RlbFJlcHJlc2VudGF0aW9uKCk7XG5cbiAgICAgIEdsb2JhbHMuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25HbG9iYWxzQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuQWRkJyx0aGlzLl9vbkRpc2FibGVSZXF1ZXN0KTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9vbkVuYWJsZVJlcXVlc3QpO1xuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG5cbiAgICBjdXJyTW9kZWxJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyTW9kZWxJZDtcbiAgICB9XG5cbiAgICBjdXJyTW9kZWwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3VycmVudE1vZGVsO1xuICAgIH1cblxuICAgIGNvbG9yKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnY29sb3InKVxuICAgIH1cblxuICAgIGhpc3RvcnlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5Lmhpc3RvcnlDb3VudCgpO1xuICAgIH1cblxuICAgIF9vbkdsb2JhbHNDaGFuZ2UoZXZ0KSB7XG4gICAgICBzd2l0Y2goZXZ0LmRhdGEucGF0aCkge1xuICAgICAgICBjYXNlICdzdHVkZW50X2lkJzpcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGlzdCA9IHRoaXMuX2hpc3RvcnkuZ2V0SGlzdG9yeSgpXG4gICAgICAgICAgICBpZiAoaGlzdC5sZW5ndGggJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpPT0nY3JlYXRlJykge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IGhpc3RbaGlzdC5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQubmFtZSA9PT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oJ19uZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7IHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTsgfVxuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiBoZXJlLCBjaGFuZ2UgdGhlIGltYWdlIGFuZCB0aGUgdG9vbGJveCBhY2NvcmRpbmcgdG8gd2hpY2ggYm9keUNvbmZpZ3VyYXRpb24gKHNlbnNvckNvbmZpZywgbW90b3IsIHJlYWN0LCByb2xsLCBtb3Rpb24gdHlwZSkgaGFzIGJlZW4gc2VsZWN0ZWQuXG4gICAgICBpZiAoZXZ0Lm5hbWUgPT09ICdGb3JtLkZpZWxkQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PT0gJ29wYWNpdHknKSB7XG4gICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0Qm9keU9wYWNpdHkoZXZ0LmRhdGEuZGVsdGEudmFsdWUpXG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIGlmIChldnQuY3VycmVudFRhcmdldC5fbW9kZWwuX2RhdGEubW9kZWxUeXBlID09ICdibG9ja2x5Jyl7XG4gICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihldnQuZGF0YS5kZWx0YS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfbG9hZE1vZGVsSW5Gb3JtKGlkKSB7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBsZXQgb2xkSWQgPSB0aGlzLl9jdXJyTW9kZWxJZDtcbiAgICAgIGxldCB0YXJnZXQgPSBpZCA9PSAnX25ldycgPyBudWxsIDogaWQ7XG4gICAgICBpZiAob2xkSWQgIT0gdGFyZ2V0KSB7XG4gICAgICAgIGlmIChpZCAhPSAnX25ldycpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHtpZH1gKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9mb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBkYXRhO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWwuX2RhdGEubW9kZWxUeXBlID09ICdibG9ja2x5Jykge1xuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdCbG9ja2x5LkxvYWQnLCBkYXRhLmJsb2NrbHlYbWwpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBpZHggPSBPYmplY3Qua2V5cyhkYXRhLmNvbmZpZ3VyYXRpb24pLmxlbmd0aCAtIDE7IGlkeCA+PSAwOyBpZHgtLSkge1xuICAgICAgICAgICAgICAgIGlmICghKE9iamVjdC5rZXlzKGRhdGEuY29uZmlndXJhdGlvbilbaWR4XS5tYXRjaChcIl98Y291bnRcIikpKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgZWxlbU5hbWUgPSBPYmplY3Qua2V5cyhkYXRhLmNvbmZpZ3VyYXRpb24pW2lkeF1cbiAgICAgICAgICAgICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oZGF0YS5jb25maWd1cmF0aW9uW2VsZW1OYW1lXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2Zvcm0uaW1wb3J0KGRhdGEuY29uZmlndXJhdGlvbikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSlcbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICAgICAgICBtb2RlbDogZGF0YSxcbiAgICAgICAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGRhdGEuc2ltdWxhdGVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCdoaXN0b3JpY2FsJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fY3Vyck1vZGVsSWQgPSBudWxsO1xuICAgICAgICAgIHRoaXMuX2N1cnJlbnRNb2RlbCA9IG51bGw7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgIGlkOiAnX25ldydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3NpbGVuY2VMb2FkTG9ncykge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgICAgdHlwZTogXCJsb2FkXCIsXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBtb2RlbElkOiBpZCxcbiAgICAgICAgICAgICAgdGFiOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2xhc3RTaW1TYXZlZCAmJiB0aGlzLl9sYXN0U2ltU2F2ZWQuaWQgPT0gb2xkSWQpIHtcbiAgICAgICAgLy8gaGFuZGxlIFwicmVydW5uaW5nXCIgYSBzaW11bGF0aW9uXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgbW9kZWw6IHRoaXMuX2xhc3RTaW1TYXZlZCxcbiAgICAgICAgICB0YWJJZDogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uU2ltdWxhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgdmFyIGNvbmYgPSB0aGlzLl9mb3JtLmV4cG9ydCgpO1xuICAgICAgdmFyIGJsb2NrbHlEYXRhID0gbnVsbDtcbiAgICAgIHZhciBzZW5zb3JDb25maWdKU09OID0gbnVsbDtcblxuICAgICAgdmFyIHNhdmVEYXRhID0ge1xuICAgICAgICBuYW1lOiBcIihzaW11bGF0aW9uKVwiLFxuICAgICAgICBzaW11bGF0ZWQ6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgICAgc2F2ZURhdGEgPSAkLmV4dGVuZChzYXZlRGF0YSxibG9ja2x5RGF0YSk7XG4gICAgICAgIHNlbnNvckNvbmZpZ0pTT04gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5nZXRBY3RpdmVTZW5zb3JDb25maWd1cmF0aW9uKCkpO1xuICAgICAgICBzYXZlRGF0YSA9ICQuZXh0ZW5kKHNhdmVEYXRhLHtzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2F2ZU1vZGVsKCBzYXZlRGF0YSApLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybShtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgfSlcblxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2ltdWxhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBibG9ja2x5RGF0YSA/ICQuZXh0ZW5kKGNvbmYsIHtqc0NvZGU6IGJsb2NrbHlEYXRhLmpzQ29kZSwgc2Vuc29yQ29uZmlnSlNPTjogc2Vuc29yQ29uZmlnSlNPTn0pIDogY29uZlxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9leHRyYWN0QmxvY2tseSgpIHtcbiAgICAgIC8vIGdldCB0aGUgQmxvY2tseSBjb2RlIHhtbFxuICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcblxuICAgICAgLy8gcmVtb3ZlIGJsb2NrcyBmcm9tIGJsb2NrbHlYbWwgdGhhdCBhcmUgbm90IHdpdGhpbiB0aGUgbWFpbiBibG9ja1xuICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYmxvY2tseVhtbC5jaGlsZE5vZGVzKS5tYXAoKGNoaWxkTm9kZSkgPT4ge1xuICAgICAgICBpZiAoY2hpbGROb2RlLnRhZ05hbWUgPT0gJ0JMT0NLJyAmJiBjaGlsZE5vZGUuZ2V0QXR0cmlidXRlKCd0eXBlJykgIT0gJ21hc3Rlcl9ibG9jaycpIHtcbiAgICAgICAgICBibG9ja2x5WG1sLnJlbW92ZUNoaWxkKGNoaWxkTm9kZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGdlbmVyYXRlIHRoZSBqYXZhc2NyaXB0IGNvZGUgb2YgdGhlIG1haW4gYmxvY2tcbiAgICAgIHZhciBibG9ja3MgPSB3aW5kb3cuQmxvY2tseS5tYWluV29ya3NwYWNlLmdldFRvcEJsb2Nrcyh0cnVlKTtcbiAgICAgIHZhciBmb3VuZE1haW5CbG9jayA9IGZhbHNlO1xuICAgICAgdmFyIGpzQ29kZSA9ICcnO1xuICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCBibG9ja3MubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgaWYgKGJsb2Nrc1tiXS50eXBlID09ICdtYXN0ZXJfYmxvY2snKSB7XG4gICAgICAgICAganNDb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5ibG9ja1RvQ29kZShibG9ja3NbYl0pXG4gICAgICAgICAgZm91bmRNYWluQmxvY2sgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmRNYWluQmxvY2spIHthbGVydCgndGhlcmUgaXMgbm8gbWFpbiBibG9jaycpfVxuXG4gICAgICAvL3dpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuYWRkUmVzZXJ2ZWRXb3JkcygnanNDb2RlJyk7XG4gICAgICAvL3ZhciBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LndvcmtzcGFjZVRvQ29kZSggd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpICk7XG5cbiAgICAgIC8vIHJldHVybiB4bWwgYW5kIGpzQ29kZSBhcyBzdHJpbmdzIHdpdGhpbiBqcyBvYmplY3RcbiAgICAgIC8vIHN0cmluZ2lmeTogYmxvY2tseVhtbC5vdXRlckhUTUwgLy8gQWx0ZXJuYXRpdmVseTogYmxvY2tseVhtbFRleHQgPSB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9UZXh0KHhtbCkgKHByb2R1Y2VzIG1pbmltYWwsIHVnbHkgc3RyaW5nKVxuICAgICAgLy8geG1sLWlmeSB3aXRoIGpxdWVyeTogJC5wYXJzZVhNTChzdHJpbmcpLmRvY3VtZW50RWxlbWVudFxuICAgICAgLy8gQWx0ZXJuYXRpdmVseSBmb3IgcmVjcmVhdGluZyBibG9ja3M6IGJsb2NrbHlYbWwgPSB3aW5kb3cuWG1sLnRleHRUb0RvbShibG9ja2x5WG1sVGV4dCkgJiB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2Uod2luZG93LkJsb2NrbHkubWFpbldvcmtzcGFjZSwgYmxvY2tseVhtbClcbiAgICAgIHJldHVybiB7YmxvY2tseVhtbDogYmxvY2tseVhtbC5vdXRlckhUTUwsIGpzQ29kZToganNDb2RlfVxuICAgIH1cblxuICAgIF9vblNhdmVSZXF1ZXN0KGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5kaXNwbGF5KHRoaXMuX25hbWVGb3JtLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfc2F2ZU1vZGVsKGRhdGEpIHtcbiAgICAgIGRhdGEuc3R1ZGVudElkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGRhdGEubW9kZWxUeXBlID0gdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKTtcbiAgICAgIGRhdGEubGFiID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKTtcbiAgICAgIGxldCBzYXZlT3JVcGRhdGU7XG4gICAgICBpZiAodGhpcy5fbGFzdFNpbVNhdmVkKSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHt0aGlzLl9sYXN0U2ltU2F2ZWQuaWR9YCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BBVENIJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICAgICAgICBzaW11bGF0ZWQ6IGRhdGEuc2ltdWxhdGVkXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2F2ZU9yVXBkYXRlID0gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXVnbGVuYU1vZGVscycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gc2F2ZU9yVXBkYXRlLnRoZW4oKHNlcnZlckRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuc2ltdWxhdGVkKSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gc2VydmVyRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VydmVyRGF0YSkgcmV0dXJuO1xuICAgICAgICByZXR1cm4gc2VydmVyRGF0YTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZVN1Ym1pdChldnQpIHtcbiAgICAgIGxldCBtb2RlbDtcblxuICAgICAgdmFyIGJsb2NrbHlEYXRhID0gbnVsbDtcbiAgICAgIHZhciBzZW5zb3JDb25maWdKU09OID0gbnVsbDtcblxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgICAgc2Vuc29yQ29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLmdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24oKSk7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gJC5leHRlbmQoYmxvY2tseURhdGEse3NlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT059KVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9uYW1lRm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NhdmVNb2RlbCgkLmV4dGVuZChibG9ja2x5RGF0YSx7XG4gICAgICAgICAgbmFtZTogdGhpcy5fbmFtZUZvcm0uZXhwb3J0KCkubmFtZSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9mb3JtLmV4cG9ydCgpLFxuICAgICAgICAgIHNpbXVsYXRlZDogZmFsc2VcbiAgICAgICAgfSkpXG4gICAgICB9KS50aGVuKChtb2RlbCkgPT4ge1xuICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IG1vZGVsLmlkXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzYXZlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBibG9ja2x5RGF0YSA/ICQuZXh0ZW5kKHRoaXMuX2Zvcm0uZXhwb3J0KCksIHtzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OLCBqc0NvZGU6IGJsb2NrbHlEYXRhLmpzQ29kZX0pIDogdGhpcy5fZm9ybS5leHBvcnQoKSAsXG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lQ2FuY2VsKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRNb2RlbFJlc3VsdHMoR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50LmlkJyksIHRoaXMuX2N1cnJlbnRNb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uRGlzYWJsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9mb3JtLmRpc2FibGUoKTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZSgpO1xuICAgIH1cblxuICAgIF9vbkVuYWJsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9mb3JtLmVuYWJsZSgpO1xuICAgICAgdGhpcy5faGlzdG9yeS5lbmFibGUoKTtcbiAgICB9XG5cbiAgICBfb25OZXdSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fb25Db25maWdDaGFuZ2UoZXZ0KTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0TW9kZWxSZXByZXNlbnRhdGlvbigpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykpIHtcbiAgICAgICAgc3dpdGNoKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgdGhpcy5faGlzdG9yeS5oaWRlRmllbGRzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmRpc2FibGVGaWVsZHMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICBNb2RlbFRhYi5jcmVhdGUgPSAoZGF0YSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxUYWIoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gTW9kZWxUYWI7XG5cbn0pXG4iXX0=
