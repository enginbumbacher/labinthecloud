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
        _this.bodyConfigurations = BodyConfigurations.create({ bodyConfigurationName: initialBody['bodyConfigurationName'],
          opacity: initialBody['opacity'] });

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

        // In here, change the image and the toolbox according to which bodyConfigurationName has been selected.
        if (evt.name == 'Form.FieldChanged') {
          if (evt.data.field._model._data.id == 'opacity') {
            this.bodyConfigurations.setBodyOpacity(evt.data.delta.value.base);
          }

          if (evt.data.field._model._data.id == 'bodyConfigurationName') {
            this.bodyConfigurations.setActiveConfiguration(evt.data.field._model._data.options[evt.data.delta.value]);
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
                _this3.bodyConfigurations.setActiveConfiguration(data.configuration.bodyConfigurationName);
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
        var bodyConfigJSON = null;

        var saveData = {
          name: "(simulation)",
          simulated: true,
          configuration: conf

          // if the active tab is 'blockly', then we have to compile and extract the blockly code.
        };if (this._model.get('modelType') == 'blockly') {
          blocklyData = this._extractBlockly();
          saveData = $.extend(saveData, blocklyData);
          bodyConfigJSON = JSON.stringify(this.bodyConfigurations.getActiveConfiguration());
          saveData = $.extend(saveData, { bodyConfigJSON: bodyConfigJSON });
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
            configuration: blocklyData ? $.extend(conf, { jsCode: blocklyData.jsCode, bodyConfigJSON: bodyConfigJSON }) : conf
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
        var bodyConfigJSON = null;
        // if the active tab is 'blockly', then we have to compile and extract the blockly code.
        if (this._model.get('modelType') == 'blockly') {
          blocklyData = this._extractBlockly();
          bodyConfigJSON = JSON.stringify(this.bodyConfigurations.getActiveConfiguration());
          blocklyData = $.extend(blocklyData, { bodyConfig: bodyConfigJSON });
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
            configuration: blocklyData ? $.extend(this._form.export(), { bodyConfigJSON: bodyConfigJSON, jsCode: blocklyData.jsCode }) : this._form.export(),
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJfbmFtZUZvcm0iLCJfb25OYW1lU3VibWl0IiwiX29uTmFtZUNhbmNlbCIsImFkZENoaWxkIiwiaW5pdGlhbEJvZHkiLCJleHBvcnQiLCJib2R5Q29uZmlndXJhdGlvbnMiLCJib2R5Q29uZmlndXJhdGlvbk5hbWUiLCJvcGFjaXR5IiwiX3NldE1vZGVsTW9kYWxpdHkiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uUGhhc2VDaGFuZ2UiLCJfY3Vyck1vZGVsSWQiLCJfY3VycmVudE1vZGVsIiwiaGlzdG9yeUNvdW50IiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJ0aGVuIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJtb2RlbF9oaXN0b3J5X2lkIiwic2V0U3RhdGUiLCJfbG9hZE1vZGVsSW5Gb3JtIiwibmFtZSIsIl9kYXRhIiwiY3VycmVudFRhcmdldCIsIl9sYXN0U2ltU2F2ZWQiLCJmaWVsZCIsInNldEJvZHlPcGFjaXR5IiwiZGVsdGEiLCJ2YWx1ZSIsImJhc2UiLCJzZXRBY3RpdmVDb25maWd1cmF0aW9uIiwib3B0aW9ucyIsIm9sZElkIiwidGFyZ2V0IiwicHJvbWlzZUFqYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGF0Y2hFdmVudCIsImJsb2NrbHlYbWwiLCJjb25maWd1cmF0aW9uIiwibW9kZWwiLCJ0YWJJZCIsInNpbXVsYXRlZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsIm1vZGVsSWQiLCJ0YWIiLCJjb25mIiwiYmxvY2tseURhdGEiLCJib2R5Q29uZmlnSlNPTiIsInNhdmVEYXRhIiwiX2V4dHJhY3RCbG9ja2x5IiwiZXh0ZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsImdldEFjdGl2ZUNvbmZpZ3VyYXRpb24iLCJfc2F2ZU1vZGVsIiwianNDb2RlIiwid2luZG93IiwiQmxvY2tseSIsIlhtbCIsIndvcmtzcGFjZVRvRG9tIiwiZ2V0TWFpbldvcmtzcGFjZSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiY2hpbGROb2RlcyIsIm1hcCIsImNoaWxkTm9kZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVDaGlsZCIsImJsb2NrcyIsIm1haW5Xb3Jrc3BhY2UiLCJnZXRUb3BCbG9ja3MiLCJmb3VuZE1haW5CbG9jayIsImIiLCJKYXZhU2NyaXB0IiwiYmxvY2tUb0NvZGUiLCJhbGVydCIsIm91dGVySFRNTCIsImRpc3BsYXkiLCJzdHVkZW50SWQiLCJsYWIiLCJjb25zb2xlIiwic2F2ZU9yVXBkYXRlIiwibWV0aG9kIiwiY29udGVudFR5cGUiLCJzZXJ2ZXJEYXRhIiwiYm9keUNvbmZpZyIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsImhpZGUiLCJjbGVhciIsImdldE1vZGVsUmVzdWx0cyIsInJlc3VsdHMiLCJwaGFzZSIsInRvTG93ZXJDYXNlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsSUFBSUQsUUFBUSxRQUFSLENBQVY7O0FBRUEsTUFBTUUsVUFBVUYsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VHLFFBQVFILFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVJLEtBQUtKLFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSyxZQUFZTCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRU0sUUFBUU4sUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFTyxPQUFPUCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BSUVRLG1CQUFtQlIsUUFBUSxpQkFBUixDQUpyQjtBQUFBLE1BS0VTLFlBQVlULFFBQVEsY0FBUixDQUxkO0FBQUEsTUFNRVUsV0FBV1YsUUFBUSxrQkFBUixDQU5iO0FBQUEsTUFPRVcsV0FBV1gsUUFBUSxlQUFSLENBUGI7QUFBQSxNQVFFWSxxQkFBcUJaLFFBQVEsa0VBQVIsQ0FSdkI7O0FBUGtCLE1BaUJaYSxRQWpCWTtBQUFBOztBQWtCaEIsd0JBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QlQsS0FBN0M7QUFDQVEsZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQlQsSUFBM0M7O0FBRnlCLHNIQUduQk8sUUFIbUI7O0FBSXpCWCxZQUFNYyxXQUFOLFFBQXdCLENBQ3RCLG9CQURzQixFQUNBLGdCQURBLEVBQ2tCLHFCQURsQixFQUV0QixlQUZzQixFQUVMLGVBRkssRUFFWSxrQkFGWixFQUVnQyxrQkFGaEMsRUFHdEIsMkJBSHNCLEVBR08saUJBSFAsRUFHMEIsZUFIMUIsRUFHMkMsZ0JBSDNDLENBQXhCOztBQU1BLFlBQUtDLFFBQUwsR0FBZ0JWLGlCQUFpQlcsTUFBakIsQ0FBd0I7QUFDdENDLGdDQUFzQixNQUFLQyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsSUFBaEIsQ0FEZ0I7QUFFdENDLG1CQUFXLE1BQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixXQUFoQjtBQUYyQixPQUF4QixDQUFoQjtBQUlBLFlBQUtKLFFBQUwsQ0FBY00sZ0JBQWQsQ0FBK0IsbUJBQS9CLEVBQW9ELE1BQUtDLHlCQUF6RDtBQUNBdkIsY0FBUW9CLEdBQVIsQ0FBWSxPQUFaLEVBQXFCRSxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtDLHlCQUE5RDtBQUNBLFlBQUtDLGdCQUFMLEdBQXdCLEtBQXhCOztBQUVBLFlBQUtDLEtBQUwsR0FBYWxCLFVBQVVVLE1BQVYsQ0FBaUI7QUFDNUJJLG1CQUFXLE1BQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixXQUFoQixDQURpQjtBQUU1Qk0scUJBQWEsTUFBS1AsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFlBQWhCLENBRmU7QUFHNUJPLDRCQUFvQixNQUFLUixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsY0FBaEI7QUFIUSxPQUFqQixDQUFiO0FBS0EsWUFBS0ssS0FBTCxDQUFXSCxnQkFBWCxDQUE0QixtQkFBNUIsRUFBaUQsTUFBS00sZUFBdEQ7QUFDQTVCLGNBQVFvQixHQUFSLENBQVksT0FBWixFQUFxQkUsZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLTSxlQUE5RDtBQUNBLFlBQUtILEtBQUwsQ0FBV0ksSUFBWCxHQUFrQlAsZ0JBQWxCLENBQW1DLG9CQUFuQyxFQUF5RCxNQUFLUSxrQkFBOUQ7QUFDQSxZQUFLTCxLQUFMLENBQVdJLElBQVgsR0FBa0JQLGdCQUFsQixDQUFtQyxnQkFBbkMsRUFBcUQsTUFBS1MsY0FBMUQ7QUFDQSxZQUFLTixLQUFMLENBQVdJLElBQVgsR0FBa0JQLGdCQUFsQixDQUFtQywwQkFBbkMsRUFBK0QsTUFBS1UsbUJBQXBFO0FBQ0EsWUFBS1AsS0FBTCxDQUFXSSxJQUFYLEdBQWtCUCxnQkFBbEIsQ0FBbUMsc0JBQW5DLEVBQTJELE1BQUtXLGFBQWhFOztBQUVBLFlBQUtDLFNBQUwsR0FBaUIxQixTQUFTUyxNQUFULEVBQWpCO0FBQ0EsWUFBS2lCLFNBQUwsQ0FBZUwsSUFBZixHQUFzQlAsZ0JBQXRCLENBQXVDLGtCQUF2QyxFQUEyRCxNQUFLYSxhQUFoRTtBQUNBLFlBQUtELFNBQUwsQ0FBZUwsSUFBZixHQUFzQlAsZ0JBQXRCLENBQXVDLGtCQUF2QyxFQUEyRCxNQUFLYyxhQUFoRTtBQUNBLFlBQUtQLElBQUwsR0FBWVEsUUFBWixDQUFxQixNQUFLckIsUUFBTCxDQUFjYSxJQUFkLEVBQXJCOztBQUVBLFVBQUksTUFBS1YsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFdBQWhCLEtBQWdDLFNBQXBDLEVBQStDO0FBQzdDO0FBQ0EsWUFBSWtCLGNBQWMsTUFBS2IsS0FBTCxDQUFXYyxNQUFYLEVBQWxCO0FBQ0EsY0FBS0Msa0JBQUwsR0FBMEI5QixtQkFBbUJPLE1BQW5CLENBQTBCLEVBQUN3Qix1QkFBdUJILFlBQVksdUJBQVosQ0FBeEI7QUFDcERJLG1CQUFTSixZQUFZLFNBQVosQ0FEMkMsRUFBMUIsQ0FBMUI7O0FBR0E7QUFDQSxjQUFLYixLQUFMLENBQVdJLElBQVgsR0FBa0JRLFFBQWxCLENBQTJCLE1BQUtHLGtCQUFMLENBQXdCWCxJQUF4QixFQUEzQixFQUEwRCxJQUExRCxFQUErRCxDQUEvRDtBQUNEOztBQUVELFlBQUtBLElBQUwsR0FBWVEsUUFBWixDQUFxQixNQUFLWixLQUFMLENBQVdJLElBQVgsRUFBckI7O0FBRUEsWUFBS2MsaUJBQUw7O0FBRUEzQyxjQUFRc0IsZ0JBQVIsQ0FBeUIsY0FBekIsRUFBeUMsTUFBS3NCLGdCQUE5QztBQUNBNUMsY0FBUW9CLEdBQVIsQ0FBWSxPQUFaLEVBQXFCRSxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUt1QixjQUE5RDtBQWxEeUI7QUFtRDFCOztBQXJFZTtBQUFBO0FBQUEsMkJBdUVYO0FBQ0gsZUFBTyxLQUFLMUIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQXpFZTtBQUFBO0FBQUEsb0NBMkVGO0FBQ1osZUFBTyxLQUFLMEIsWUFBWjtBQUNEO0FBN0VlO0FBQUE7QUFBQSxrQ0ErRUo7QUFDVixlQUFPLEtBQUtDLGFBQVo7QUFDRDtBQWpGZTtBQUFBO0FBQUEsOEJBbUZSO0FBQ04sZUFBTyxLQUFLNUIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQVA7QUFDRDtBQXJGZTtBQUFBO0FBQUEscUNBdUZEO0FBQ2IsZUFBTyxLQUFLSixRQUFMLENBQWNnQyxZQUFkLEVBQVA7QUFDRDtBQXpGZTtBQUFBO0FBQUEsdUNBMkZDQyxHQTNGRCxFQTJGTTtBQUFBOztBQUNwQixnQkFBT0EsSUFBSUMsSUFBSixDQUFTQyxJQUFoQjtBQUNFLGVBQUssWUFBTDtBQUNFLGlCQUFLbkMsUUFBTCxDQUFjb0MsTUFBZCxHQUF1QkMsSUFBdkIsQ0FBNEIsWUFBTTtBQUNoQyxrQkFBTUMsT0FBTyxPQUFLdEMsUUFBTCxDQUFjdUMsVUFBZCxFQUFiO0FBQ0Esa0JBQUlELEtBQUtFLE1BQUwsSUFBZXhELFFBQVFvQixHQUFSLENBQVksZ0NBQVosS0FBK0MsUUFBbEUsRUFBNEU7QUFDMUUsdUJBQU8sT0FBS0osUUFBTCxDQUFjeUMsTUFBZCxDQUFxQjtBQUMxQkMsb0NBQWtCSixLQUFLQSxLQUFLRSxNQUFMLEdBQWMsQ0FBbkI7QUFEUSxpQkFBckIsQ0FBUDtBQUdELGVBSkQsTUFJTztBQUNMLHVCQUFLL0IsS0FBTCxDQUFXa0MsUUFBWCxDQUFvQixLQUFwQjtBQUNBLHVCQUFPLElBQVA7QUFDRDtBQUNGLGFBVkQsRUFVR04sSUFWSCxDQVVRLFlBQU07QUFDWixxQkFBS08sZ0JBQUwsQ0FBc0IsT0FBSzVDLFFBQUwsQ0FBY3VCLE1BQWQsR0FBdUJtQixnQkFBN0M7QUFDRCxhQVpEO0FBYUY7QUFmRjtBQWlCRDtBQTdHZTtBQUFBO0FBQUEsZ0RBK0dVVCxHQS9HVixFQStHZTtBQUM3QixZQUFJQSxJQUFJWSxJQUFKLElBQVksaUJBQWhCLEVBQW1DO0FBQ2pDLGNBQUksS0FBSzFDLE1BQUwsQ0FBWTJDLEtBQVosQ0FBa0J6QyxTQUFsQixJQUErQjRCLElBQUlDLElBQUosQ0FBUzdCLFNBQTVDLEVBQXVEO0FBQ3JELGlCQUFLdUMsZ0JBQUwsQ0FBc0IsTUFBdEI7QUFDRDtBQUNGLFNBSkQsTUFLSztBQUFFLGVBQUtBLGdCQUFMLENBQXNCWCxJQUFJYyxhQUFKLENBQWtCeEIsTUFBbEIsR0FBMkJtQixnQkFBakQ7QUFBcUU7QUFDN0U7QUF0SGU7QUFBQTtBQUFBLHNDQXdIQVQsR0F4SEEsRUF3SEs7QUFDbkIsYUFBS2UsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFlBQUlmLElBQUlZLElBQUosSUFBWSxpQkFBaEIsRUFBbUM7QUFDakMsY0FBSSxLQUFLMUMsTUFBTCxDQUFZMkMsS0FBWixDQUFrQnpDLFNBQWxCLElBQStCNEIsSUFBSUMsSUFBSixDQUFTN0IsU0FBNUMsRUFBdUQ7QUFDckQsaUJBQUtMLFFBQUwsQ0FBY3lDLE1BQWQsQ0FBcUIsRUFBRUMsa0JBQWtCLE1BQXBCLEVBQXJCO0FBQ0EsaUJBQUtqQyxLQUFMLENBQVdrQyxRQUFYLENBQW9CLEtBQXBCO0FBQ0Q7QUFDRixTQUxELE1BTUssSUFBSSxLQUFLM0MsUUFBTCxDQUFjdUIsTUFBZCxHQUF1Qm1CLGdCQUF2QixJQUEyQyxNQUEvQyxFQUF1RDtBQUMxRCxlQUFLMUMsUUFBTCxDQUFjeUMsTUFBZCxDQUFxQixFQUFFQyxrQkFBa0IsTUFBcEIsRUFBckI7QUFDQSxlQUFLakMsS0FBTCxDQUFXa0MsUUFBWCxDQUFvQixLQUFwQjtBQUNEOztBQUVEO0FBQ0EsWUFBSVYsSUFBSVksSUFBSixJQUFZLG1CQUFoQixFQUFxQztBQUNuQyxjQUFJWixJQUFJQyxJQUFKLENBQVNlLEtBQVQsQ0FBZTlDLE1BQWYsQ0FBc0IyQyxLQUF0QixDQUE0QjVDLEVBQTVCLElBQWtDLFNBQXRDLEVBQWlEO0FBQy9DLGlCQUFLc0Isa0JBQUwsQ0FBd0IwQixjQUF4QixDQUF1Q2pCLElBQUlDLElBQUosQ0FBU2lCLEtBQVQsQ0FBZUMsS0FBZixDQUFxQkMsSUFBNUQ7QUFDRDs7QUFFRCxjQUFHcEIsSUFBSUMsSUFBSixDQUFTZSxLQUFULENBQWU5QyxNQUFmLENBQXNCMkMsS0FBdEIsQ0FBNEI1QyxFQUE1QixJQUFrQyx1QkFBckMsRUFBOEQ7QUFDNUQsaUJBQUtzQixrQkFBTCxDQUF3QjhCLHNCQUF4QixDQUErQ3JCLElBQUlDLElBQUosQ0FBU2UsS0FBVCxDQUFlOUMsTUFBZixDQUFzQjJDLEtBQXRCLENBQTRCUyxPQUE1QixDQUFvQ3RCLElBQUlDLElBQUosQ0FBU2lCLEtBQVQsQ0FBZUMsS0FBbkQsQ0FBL0M7QUFDRDtBQUNGO0FBQ0Y7QUEvSWU7QUFBQTtBQUFBLHVDQWlKQ2xELEVBakpELEVBaUpLO0FBQUE7O0FBQ25CLFlBQUksQ0FBQ0EsRUFBTCxFQUFTO0FBQ1QsWUFBSXNELFFBQVEsS0FBSzFCLFlBQWpCO0FBQ0EsWUFBSTJCLFNBQVN2RCxNQUFNLE1BQU4sR0FBZSxJQUFmLEdBQXNCQSxFQUFuQztBQUNBLFlBQUlzRCxTQUFTQyxNQUFiLEVBQXFCO0FBQ25CLGNBQUl2RCxNQUFNLE1BQVYsRUFBa0I7QUFDaEIsaUJBQUs0QixZQUFMLEdBQW9CNUIsRUFBcEI7QUFDQWpCLGtCQUFNeUUsV0FBTiw0QkFBMkN4RCxFQUEzQyxFQUFpRG1DLElBQWpELENBQXNELFVBQUNILElBQUQsRUFBVTtBQUM5RCxxQkFBS3pCLEtBQUwsQ0FBV2tELG1CQUFYLENBQStCLG1CQUEvQixFQUFvRCxPQUFLL0MsZUFBekQ7QUFDQSxxQkFBS21CLGFBQUwsR0FBcUJHLElBQXJCOztBQUVBLGtCQUFJLE9BQUsvQixNQUFMLENBQVkyQyxLQUFaLENBQWtCekMsU0FBbEIsSUFBK0IsU0FBbkMsRUFBOEM7QUFDNUNyQix3QkFBUW9CLEdBQVIsQ0FBWSxPQUFaLEVBQXFCd0QsYUFBckIsQ0FBbUMsY0FBbkMsRUFBbUQxQixLQUFLMkIsVUFBeEQ7QUFDQSx1QkFBS3JDLGtCQUFMLENBQXdCOEIsc0JBQXhCLENBQStDcEIsS0FBSzRCLGFBQUwsQ0FBbUJyQyxxQkFBbEU7QUFDRDs7QUFFRCxxQkFBS2hCLEtBQUwsQ0FBV2dDLE1BQVgsQ0FBa0JQLEtBQUs0QixhQUF2QixFQUFzQ3pCLElBQXRDLENBQTJDLFlBQU07QUFDL0MsdUJBQUs1QixLQUFMLENBQVdILGdCQUFYLENBQTRCLG1CQUE1QixFQUFpRCxPQUFLTSxlQUF0RDtBQUNBNUIsd0JBQVFvQixHQUFSLENBQVksT0FBWixFQUFxQndELGFBQXJCLENBQW1DLHFCQUFuQyxFQUEwRDtBQUN4REcseUJBQU83QixJQURpRDtBQUV4RDhCLHlCQUFPLE9BQUs3RCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsSUFBaEI7QUFGaUQsaUJBQTFEO0FBSUQsZUFORDtBQU9BLGtCQUFJOEIsS0FBSytCLFNBQVQsRUFBb0I7QUFDbEIsdUJBQUt4RCxLQUFMLENBQVdrQyxRQUFYLENBQW9CLEtBQXBCO0FBQ0QsZUFGRCxNQUVPO0FBQ0wsdUJBQUtsQyxLQUFMLENBQVdrQyxRQUFYLENBQW9CLFlBQXBCO0FBQ0Q7QUFFRixhQXRCRDtBQXVCRCxXQXpCRCxNQXlCTztBQUNMLGlCQUFLYixZQUFMLEdBQW9CLElBQXBCO0FBQ0EsaUJBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQS9DLG9CQUFRb0IsR0FBUixDQUFZLE9BQVosRUFBcUJ3RCxhQUFyQixDQUFtQyxxQkFBbkMsRUFBMEQ7QUFDeERHLHFCQUFPO0FBQ0w3RCxvQkFBSTtBQURDLGVBRGlEO0FBSXhEOEQscUJBQU8sS0FBSzdELE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQjtBQUppRCxhQUExRDtBQU1BLGlCQUFLSyxLQUFMLENBQVdrQyxRQUFYLENBQW9CLEtBQXBCO0FBQ0Q7QUFDRCxjQUFJLENBQUMsS0FBS25DLGdCQUFWLEVBQTRCO0FBQzFCeEIsb0JBQVFvQixHQUFSLENBQVksUUFBWixFQUFzQjhELEdBQXRCLENBQTBCO0FBQ3hCQyxvQkFBTSxNQURrQjtBQUV4QkMsd0JBQVUsT0FGYztBQUd4QmxDLG9CQUFNO0FBQ0ptQyx5QkFBU25FLEVBREw7QUFFSm9FLHFCQUFLLEtBQUtwRSxFQUFMO0FBRkQ7QUFIa0IsYUFBMUI7QUFRRDtBQUNGLFNBL0NELE1BK0NPLElBQUksS0FBSzhDLGFBQUwsSUFBc0IsS0FBS0EsYUFBTCxDQUFtQjlDLEVBQW5CLElBQXlCc0QsS0FBbkQsRUFBMEQ7QUFDL0Q7QUFDQXhFLGtCQUFRb0IsR0FBUixDQUFZLE9BQVosRUFBcUJ3RCxhQUFyQixDQUFtQyxxQkFBbkMsRUFBMEQ7QUFDeERHLG1CQUFPLEtBQUtmLGFBRDRDO0FBRXhEZ0IsbUJBQU8sS0FBSzdELE1BQUwsQ0FBWUMsR0FBWixDQUFnQixJQUFoQjtBQUZpRCxXQUExRDtBQUlEO0FBQ0Y7QUEzTWU7QUFBQTtBQUFBLHlDQTZNRzZCLEdBN01ILEVBNk1RO0FBQUE7O0FBQ3RCLFlBQUlzQyxPQUFPLEtBQUs5RCxLQUFMLENBQVdjLE1BQVgsRUFBWDtBQUNBLFlBQUlpRCxjQUFjLElBQWxCO0FBQ0EsWUFBSUMsaUJBQWlCLElBQXJCOztBQUVBLFlBQUlDLFdBQVc7QUFDYjdCLGdCQUFNLGNBRE87QUFFYm9CLHFCQUFXLElBRkU7QUFHYkgseUJBQWVTOztBQUdqQjtBQU5lLFNBQWYsQ0FPQSxJQUFJLEtBQUtwRSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsV0FBaEIsS0FBZ0MsU0FBcEMsRUFBK0M7QUFDN0NvRSx3QkFBYyxLQUFLRyxlQUFMLEVBQWQ7QUFDQUQscUJBQVczRixFQUFFNkYsTUFBRixDQUFTRixRQUFULEVBQWtCRixXQUFsQixDQUFYO0FBQ0FDLDJCQUFpQkksS0FBS0MsU0FBTCxDQUFlLEtBQUt0RCxrQkFBTCxDQUF3QnVELHNCQUF4QixFQUFmLENBQWpCO0FBQ0FMLHFCQUFXM0YsRUFBRTZGLE1BQUYsQ0FBU0YsUUFBVCxFQUFrQixFQUFDRCxnQkFBZ0JBLGNBQWpCLEVBQWxCLENBQVg7QUFDRDs7QUFFRCxhQUFLTyxVQUFMLENBQWlCTixRQUFqQixFQUE0QnJDLElBQTVCLENBQWlDLFVBQUMwQixLQUFELEVBQVc7QUFDMUMsaUJBQUt2RCxnQkFBTCxHQUF3QixJQUF4QjtBQUNBLGlCQUFLb0MsZ0JBQUwsQ0FBc0JtQixNQUFNN0QsRUFBNUI7QUFDQSxpQkFBS00sZ0JBQUwsR0FBd0IsS0FBeEI7QUFDRCxTQUpEOztBQU1BeEIsZ0JBQVFvQixHQUFSLENBQVksUUFBWixFQUFzQjhELEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxVQURrQjtBQUV4QkMsb0JBQVUsT0FGYztBQUd4QmxDLGdCQUFNO0FBQ0o3Qix1QkFBVyxLQUFLRixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsV0FBaEIsQ0FEUDtBQUVKMEQsMkJBQWVVLGNBQWN6RixFQUFFNkYsTUFBRixDQUFTTCxJQUFULEVBQWUsRUFBQ1UsUUFBUVQsWUFBWVMsTUFBckIsRUFBNkJSLGdCQUFnQkEsY0FBN0MsRUFBZixDQUFkLEdBQTZGRjtBQUZ4RztBQUhrQixTQUExQjtBQVFEO0FBOU9lO0FBQUE7QUFBQSx3Q0FnUEU7QUFDaEI7QUFDQSxZQUFJVixhQUFhcUIsT0FBT0MsT0FBUCxDQUFlQyxHQUFmLENBQW1CQyxjQUFuQixDQUFrQ0gsT0FBT0MsT0FBUCxDQUFlRyxnQkFBZixFQUFsQyxDQUFqQjs7QUFFQTtBQUNBQyxjQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkI3QixXQUFXOEIsVUFBdEMsRUFBa0RDLEdBQWxELENBQXNELFVBQUNDLFNBQUQsRUFBZTtBQUNuRSxjQUFJQSxVQUFVQyxPQUFWLElBQXFCLE9BQXJCLElBQWdDRCxVQUFVRSxZQUFWLENBQXVCLE1BQXZCLEtBQWtDLFlBQXRFLEVBQW9GO0FBQ2xGbEMsdUJBQVdtQyxXQUFYLENBQXVCSCxTQUF2QjtBQUNEO0FBQ0YsU0FKRDs7QUFNQTtBQUNBLFlBQUlJLFNBQVNmLE9BQU9DLE9BQVAsQ0FBZWUsYUFBZixDQUE2QkMsWUFBN0IsQ0FBMEMsSUFBMUMsQ0FBYjtBQUNBLFlBQUlDLGlCQUFpQixLQUFyQjtBQUNBLFlBQUluQixTQUFTLEVBQWI7QUFDQSxhQUFLLElBQUlvQixJQUFJLENBQWIsRUFBZ0JBLElBQUlKLE9BQU96RCxNQUEzQixFQUFtQzZELEdBQW5DLEVBQXdDO0FBQ3RDLGNBQUlKLE9BQU9JLENBQVAsRUFBVWxDLElBQVYsSUFBa0IsWUFBdEIsRUFBb0M7QUFDbENjLHFCQUFTQyxPQUFPQyxPQUFQLENBQWVtQixVQUFmLENBQTBCQyxXQUExQixDQUFzQ04sT0FBT0ksQ0FBUCxDQUF0QyxDQUFUO0FBQ0FELDZCQUFpQixJQUFqQjtBQUNBO0FBQ0Q7QUFDRjs7QUFFRCxZQUFJLENBQUNBLGNBQUwsRUFBcUI7QUFBQ0ksZ0JBQU0sd0JBQU47QUFBZ0M7O0FBRXREO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFPLEVBQUMzQyxZQUFZQSxXQUFXNEMsU0FBeEIsRUFBbUN4QixRQUFRQSxNQUEzQyxFQUFQO0FBQ0Q7QUFqUmU7QUFBQTtBQUFBLHFDQW1SRGhELEdBblJDLEVBbVJJO0FBQ2xCakQsZ0JBQVFvQixHQUFSLENBQVksa0JBQVosRUFBZ0NzRyxPQUFoQyxDQUF3QyxLQUFLeEYsU0FBTCxDQUFlTCxJQUFmLEVBQXhDO0FBQ0Q7QUFyUmU7QUFBQTtBQUFBLGlDQXVSTHFCLElBdlJLLEVBdVJDO0FBQUE7O0FBQ2ZBLGFBQUt5RSxTQUFMLEdBQWlCM0gsUUFBUW9CLEdBQVIsQ0FBWSxZQUFaLENBQWpCO0FBQ0E4QixhQUFLN0IsU0FBTCxHQUFpQixLQUFLRixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsV0FBaEIsQ0FBakI7QUFDQThCLGFBQUswRSxHQUFMLEdBQVc1SCxRQUFRb0IsR0FBUixDQUFZLGVBQVosQ0FBWDtBQUNBeUcsZ0JBQVEzQyxHQUFSLENBQVksWUFBWjtBQUNBMkMsZ0JBQVEzQyxHQUFSLENBQVloQyxJQUFaO0FBQ0EsWUFBSTRFLHFCQUFKO0FBQ0EsWUFBSSxLQUFLOUQsYUFBVCxFQUF3QjtBQUN0QjhELHlCQUFlN0gsTUFBTXlFLFdBQU4sNEJBQTJDLEtBQUtWLGFBQUwsQ0FBbUI5QyxFQUE5RCxFQUFvRTtBQUNqRjZHLG9CQUFRLE9BRHlFO0FBRWpGN0Usa0JBQU0yQyxLQUFLQyxTQUFMLENBQWU7QUFDbkJqQyxvQkFBTVgsS0FBS1csSUFEUTtBQUVuQm9CLHlCQUFXL0IsS0FBSytCO0FBRkcsYUFBZixDQUYyRTtBQU1qRitDLHlCQUFhO0FBTm9FLFdBQXBFLENBQWY7QUFRRCxTQVRELE1BU087QUFDTEYseUJBQWU3SCxNQUFNeUUsV0FBTixDQUFrQix1QkFBbEIsRUFBMkM7QUFDeERxRCxvQkFBUSxNQURnRDtBQUV4RDdFLGtCQUFNMkMsS0FBS0MsU0FBTCxDQUFlNUMsSUFBZixDQUZrRDtBQUd4RDhFLHlCQUFhO0FBSDJDLFdBQTNDLENBQWY7QUFLRDtBQUNELGVBQU9GLGFBQWF6RSxJQUFiLENBQWtCLFVBQUM0RSxVQUFELEVBQWdCO0FBQ3ZDLGNBQUkvRSxLQUFLK0IsU0FBVCxFQUFvQjtBQUNsQixtQkFBS2pCLGFBQUwsR0FBcUJpRSxVQUFyQjtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFLakUsYUFBTCxHQUFxQixJQUFyQjtBQUNEO0FBQ0QsY0FBSSxDQUFDaUUsVUFBTCxFQUFpQjtBQUNqQixpQkFBT0EsVUFBUDtBQUNELFNBUk0sQ0FBUDtBQVNEO0FBdlRlO0FBQUE7QUFBQSxvQ0F5VEZoRixHQXpURSxFQXlURztBQUFBOztBQUNqQixZQUFJOEIsY0FBSjs7QUFFQSxZQUFJUyxjQUFjLElBQWxCO0FBQ0EsWUFBSUMsaUJBQWlCLElBQXJCO0FBQ0E7QUFDQSxZQUFJLEtBQUt0RSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsV0FBaEIsS0FBZ0MsU0FBcEMsRUFBK0M7QUFDN0NvRSx3QkFBYyxLQUFLRyxlQUFMLEVBQWQ7QUFDQUYsMkJBQWlCSSxLQUFLQyxTQUFMLENBQWUsS0FBS3RELGtCQUFMLENBQXdCdUQsc0JBQXhCLEVBQWYsQ0FBakI7QUFDQVAsd0JBQWN6RixFQUFFNkYsTUFBRixDQUFTSixXQUFULEVBQXFCLEVBQUMwQyxZQUFZekMsY0FBYixFQUFyQixDQUFkO0FBQ0Q7O0FBRUQsYUFBS3ZELFNBQUwsQ0FBZWlHLFFBQWYsR0FBMEI5RSxJQUExQixDQUErQixVQUFDK0UsVUFBRCxFQUFnQjtBQUM3QyxpQkFBTyxPQUFLcEMsVUFBTCxDQUFnQmpHLEVBQUU2RixNQUFGLENBQVNKLFdBQVQsRUFBcUI7QUFDMUMzQixrQkFBTSxPQUFLM0IsU0FBTCxDQUFlSyxNQUFmLEdBQXdCc0IsSUFEWTtBQUUxQ2lCLDJCQUFlLE9BQUtyRCxLQUFMLENBQVdjLE1BQVgsRUFGMkI7QUFHMUMwQyx1QkFBVztBQUgrQixXQUFyQixDQUFoQixDQUFQO0FBS0QsU0FORCxFQU1HNUIsSUFOSCxDQU1RLFVBQUMwQixLQUFELEVBQVc7QUFDakIsaUJBQUtmLGFBQUwsR0FBcUIsSUFBckI7QUFDQWhFLGtCQUFRb0IsR0FBUixDQUFZLGtCQUFaLEVBQWdDaUgsSUFBaEMsR0FBdUNoRixJQUF2QyxDQUE0QyxZQUFNO0FBQ2hELG1CQUFLbkIsU0FBTCxDQUFlb0csS0FBZjtBQUNELFdBRkQ7QUFHQSxpQkFBSzlHLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0EsaUJBQUtSLFFBQUwsQ0FBY29DLE1BQWQsR0FBdUJDLElBQXZCLENBQTRCLFlBQU07QUFDaEMsbUJBQUs3QixnQkFBTCxHQUF3QixLQUF4QjtBQUNBLG1CQUFLUixRQUFMLENBQWN5QyxNQUFkLENBQXFCO0FBQ25CQyxnQ0FBa0JxQixNQUFNN0Q7QUFETCxhQUFyQjtBQUdELFdBTEQ7QUFNRCxTQWxCRDtBQW1CQWxCLGdCQUFRb0IsR0FBUixDQUFZLFFBQVosRUFBc0I4RCxHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sTUFEa0I7QUFFeEJDLG9CQUFVLE9BRmM7QUFHeEJsQyxnQkFBTTtBQUNKNEIsMkJBQWVVLGNBQWN6RixFQUFFNkYsTUFBRixDQUFTLEtBQUtuRSxLQUFMLENBQVdjLE1BQVgsRUFBVCxFQUE4QixFQUFDa0QsZ0JBQWdCQSxjQUFqQixFQUFpQ1EsUUFBUVQsWUFBWVMsTUFBckQsRUFBOUIsQ0FBZCxHQUE0RyxLQUFLeEUsS0FBTCxDQUFXYyxNQUFYLEVBRHZIO0FBRUpsQix1QkFBVyxLQUFLRixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsV0FBaEIsQ0FGUDtBQUdKeUMsa0JBQU0sS0FBSzNCLFNBQUwsQ0FBZUssTUFBZixHQUF3QnNCO0FBSDFCO0FBSGtCLFNBQTFCO0FBU0Q7QUFqV2U7QUFBQTtBQUFBLG9DQW1XRlosR0FuV0UsRUFtV0c7QUFBQTs7QUFDakJqRCxnQkFBUW9CLEdBQVIsQ0FBWSxrQkFBWixFQUFnQ2lILElBQWhDLEdBQXVDaEYsSUFBdkMsQ0FBNEMsWUFBTTtBQUNoRCxpQkFBS25CLFNBQUwsQ0FBZW9HLEtBQWY7QUFDRCxTQUZEO0FBR0Q7QUF2V2U7QUFBQTtBQUFBLDBDQXlXSXJGLEdBeldKLEVBeVdTO0FBQ3ZCeEMsaUJBQVM4SCxlQUFULENBQXlCdkksUUFBUW9CLEdBQVIsQ0FBWSxzQkFBWixDQUF6QixFQUE4RCxLQUFLMkIsYUFBbkUsRUFBa0ZNLElBQWxGLENBQXVGLFVBQUNtRixPQUFELEVBQWE7QUFDbEd4SSxrQkFBUW9CLEdBQVIsQ0FBWSxPQUFaLEVBQXFCd0QsYUFBckIsQ0FBbUMsMEJBQW5DLEVBQStEO0FBQzdEMUIsa0JBQU1zRjtBQUR1RCxXQUEvRDtBQUdELFNBSkQ7QUFLQXhJLGdCQUFRb0IsR0FBUixDQUFZLFFBQVosRUFBc0I4RCxHQUF0QixDQUEwQjtBQUN4QkMsZ0JBQU0sV0FEa0I7QUFFeEJDLG9CQUFVLE9BRmM7QUFHeEJsQyxnQkFBTTtBQUNKbUMscUJBQVMsS0FBS3JFLFFBQUwsQ0FBY3VCLE1BQWQsR0FBdUJtQjtBQUQ1QjtBQUhrQixTQUExQjtBQU9EO0FBdFhlO0FBQUE7QUFBQSxvQ0F3WEZULEdBeFhFLEVBd1hHO0FBQ2pCLGFBQUtyQixlQUFMLENBQXFCcUIsR0FBckI7QUFDRDtBQTFYZTtBQUFBO0FBQUEscUNBNFhEQSxHQTVYQyxFQTRYSTtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVN1RixLQUFULElBQWtCLE9BQWxCLElBQTZCeEYsSUFBSUMsSUFBSixDQUFTdUYsS0FBVCxJQUFrQixpQkFBbkQsRUFBc0U7QUFDcEUsZUFBS3pILFFBQUwsQ0FBY3lDLE1BQWQsQ0FBcUIsRUFBRUMsa0JBQWtCLE1BQXBCLEVBQXJCO0FBQ0Q7QUFDRjtBQWhZZTtBQUFBO0FBQUEsMENBa1lJO0FBQ2xCLFlBQUkxRCxRQUFRb0IsR0FBUixDQUFZLGdDQUFaLENBQUosRUFBbUQ7QUFDakQsa0JBQU9wQixRQUFRb0IsR0FBUixDQUFZLGdDQUFaLEVBQThDc0gsV0FBOUMsRUFBUDtBQUNJLGlCQUFLLFNBQUw7QUFDRSxtQkFBS2pILEtBQUwsQ0FBV2tILFVBQVg7QUFDQSxtQkFBSzNILFFBQUwsQ0FBYzJILFVBQWQ7QUFDRjtBQUNBLGlCQUFLLFNBQUw7QUFDRSxtQkFBS2xILEtBQUwsQ0FBV21ILGFBQVg7QUFDQSxtQkFBSzVILFFBQUwsQ0FBYzRILGFBQWQ7QUFDRjtBQVJKO0FBVUQ7QUFDRjtBQS9ZZTs7QUFBQTtBQUFBLElBaUJLekksU0FqQkw7O0FBbVpsQlEsV0FBU00sTUFBVCxHQUFrQixVQUFDaUMsSUFBRCxFQUFVO0FBQzFCLFdBQU8sSUFBSXZDLFFBQUosQ0FBYSxFQUFFa0ksV0FBVzNGLElBQWIsRUFBYixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPdkMsUUFBUDtBQUVELENBelpEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG5cbiAgICBNb2RlbEhpc3RvcnlGb3JtID0gcmVxdWlyZSgnLi4vaGlzdG9yeS9mb3JtJyksXG4gICAgTW9kZWxGb3JtID0gcmVxdWlyZSgnLi4vZm9ybS9mb3JtJyksXG4gICAgTmFtZUZvcm0gPSByZXF1aXJlKCcuLi9uYW1lZm9ybS9mb3JtJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJyksXG4gICAgQm9keUNvbmZpZ3VyYXRpb25zID0gcmVxdWlyZSgnZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9ib2R5Y29uZmlncycpO1xuXG4gIGNsYXNzIE1vZGVsVGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uU2ltdWxhdGVSZXF1ZXN0JywgJ19vblNhdmVSZXF1ZXN0JywgJ19vbkFnZ3JlZ2F0ZVJlcXVlc3QnLFxuICAgICAgICAnX29uTmFtZUNhbmNlbCcsICdfb25OYW1lU3VibWl0JywgJ19vbkdsb2JhbHNDaGFuZ2UnLCAnX2xvYWRNb2RlbEluRm9ybScsXG4gICAgICAgICdfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlJywgJ19vbkNvbmZpZ0NoYW5nZScsICdfb25OZXdSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJ1xuICAgICAgXSk7XG5cbiAgICAgIHRoaXMuX2hpc3RvcnkgPSBNb2RlbEhpc3RvcnlGb3JtLmNyZWF0ZSh7XG4gICAgICAgIGlkOiBgbW9kZWxfaGlzdG9yeV9fJHt0aGlzLl9tb2RlbC5nZXQoXCJpZFwiKX1gLFxuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJylcbiAgICAgIH0pO1xuICAgICAgdGhpcy5faGlzdG9yeS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX2Zvcm0gPSBNb2RlbEZvcm0uY3JlYXRlKHtcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICBmaWVsZENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJyksXG4gICAgICAgIGV1Z2xlbmFDb3VudENvbmZpZzogdGhpcy5fbW9kZWwuZ2V0KCdldWdsZW5hQ291bnQnKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkNoYW5nZWQnLCB0aGlzLl9vbkNvbmZpZ0NoYW5nZSk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2ltdWxhdGUnLCB0aGlzLl9vblNpbXVsYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uU2F2ZScsIHRoaXMuX29uU2F2ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJywgdGhpcy5fb25BZ2dyZWdhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5OZXdSZXF1ZXN0JywgdGhpcy5fb25OZXdSZXF1ZXN0KTtcblxuICAgICAgdGhpcy5fbmFtZUZvcm0gPSBOYW1lRm9ybS5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuU3VibWl0JywgdGhpcy5fb25OYW1lU3VibWl0KTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuQ2FuY2VsJywgdGhpcy5fb25OYW1lQ2FuY2VsKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcblxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIC8vIENyZWF0ZSBib2R5IGNvbmZpZ3VyYXRpb24gbW9kZWwgaW5zdGFuY2UuXG4gICAgICAgIHZhciBpbml0aWFsQm9keSA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zID0gQm9keUNvbmZpZ3VyYXRpb25zLmNyZWF0ZSh7Ym9keUNvbmZpZ3VyYXRpb25OYW1lOiBpbml0aWFsQm9keVsnYm9keUNvbmZpZ3VyYXRpb25OYW1lJ10sXG4gICAgICAgIG9wYWNpdHk6IGluaXRpYWxCb2R5WydvcGFjaXR5J119KVxuXG4gICAgICAgIC8vIGFkZCB2aWV3IG9mIHRoZSBtb2RlbCBpbnN0YW5jZSB0byB0aGlzLnZpZXcoKVxuICAgICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRDaGlsZCh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy52aWV3KCksbnVsbCwwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5fZm9ybS52aWV3KCkpO1xuXG4gICAgICB0aGlzLl9zZXRNb2RlbE1vZGFsaXR5KCk7XG5cbiAgICAgIEdsb2JhbHMuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fb25HbG9iYWxzQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgfVxuXG4gICAgaWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdpZCcpO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbElkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJNb2RlbElkO1xuICAgIH1cblxuICAgIGN1cnJNb2RlbCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50TW9kZWw7XG4gICAgfVxuXG4gICAgY29sb3IoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdjb2xvcicpXG4gICAgfVxuXG4gICAgaGlzdG9yeUNvdW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaGlzdG9yeUNvdW50KCk7XG4gICAgfVxuXG4gICAgX29uR2xvYmFsc0NoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgJ3N0dWRlbnRfaWQnOlxuICAgICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoaXN0ID0gdGhpcy5faGlzdG9yeS5nZXRIaXN0b3J5KClcbiAgICAgICAgICAgIGlmIChoaXN0Lmxlbmd0aCAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5Jyk9PSdjcmVhdGUnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogaGlzdFtoaXN0Lmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0odGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTtcbiAgICAgICAgICB9KVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5uYW1lID09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKCdfbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgeyB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oZXZ0LmN1cnJlbnRUYXJnZXQuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCk7IH1cbiAgICB9XG5cbiAgICBfb25Db25maWdDaGFuZ2UoZXZ0KSB7XG4gICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgaWYgKGV2dC5uYW1lID09ICdCbG9ja2x5LkNoYW5nZWQnKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUgPT0gZXZ0LmRhdGEubW9kZWxUeXBlKSB7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZCAhPSAnX25ldycpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiBoZXJlLCBjaGFuZ2UgdGhlIGltYWdlIGFuZCB0aGUgdG9vbGJveCBhY2NvcmRpbmcgdG8gd2hpY2ggYm9keUNvbmZpZ3VyYXRpb25OYW1lIGhhcyBiZWVuIHNlbGVjdGVkLlxuICAgICAgaWYgKGV2dC5uYW1lID09ICdGb3JtLkZpZWxkQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PSAnb3BhY2l0eScpIHtcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRCb2R5T3BhY2l0eShldnQuZGF0YS5kZWx0YS52YWx1ZS5iYXNlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdib2R5Q29uZmlndXJhdGlvbk5hbWUnKSB7XG4gICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEub3B0aW9uc1tldnQuZGF0YS5kZWx0YS52YWx1ZV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xvYWRNb2RlbEluRm9ybShpZCkge1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgbGV0IG9sZElkID0gdGhpcy5fY3Vyck1vZGVsSWQ7XG4gICAgICBsZXQgdGFyZ2V0ID0gaWQgPT0gJ19uZXcnID8gbnVsbCA6IGlkO1xuICAgICAgaWYgKG9sZElkICE9IHRhcmdldCkge1xuICAgICAgICBpZiAoaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgICAgdGhpcy5fY3Vyck1vZGVsSWQgPSBpZDtcbiAgICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7aWR9YCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZm9ybS5yZW1vdmVFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKVxuICAgICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gZGF0YTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQmxvY2tseS5Mb2FkJywgZGF0YS5ibG9ja2x5WG1sKTtcbiAgICAgICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihkYXRhLmNvbmZpZ3VyYXRpb24uYm9keUNvbmZpZ3VyYXRpb25OYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZm9ybS5pbXBvcnQoZGF0YS5jb25maWd1cmF0aW9uKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKVxuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBkYXRhLFxuICAgICAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ2hpc3RvcmljYWwnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IG51bGw7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gbnVsbDtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgaWQ6ICdfbmV3J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fc2lsZW5jZUxvYWRMb2dzKSB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgICB0eXBlOiBcImxvYWRcIixcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIG1vZGVsSWQ6IGlkLFxuICAgICAgICAgICAgICB0YWI6IHRoaXMuaWQoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGFzdFNpbVNhdmVkICYmIHRoaXMuX2xhc3RTaW1TYXZlZC5pZCA9PSBvbGRJZCkge1xuICAgICAgICAvLyBoYW5kbGUgXCJyZXJ1bm5pbmdcIiBhIHNpbXVsYXRpb25cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXVnbGVuYU1vZGVsLkxvYWRlZCcsIHtcbiAgICAgICAgICBtb2RlbDogdGhpcy5fbGFzdFNpbVNhdmVkLFxuICAgICAgICAgIHRhYklkOiB0aGlzLl9tb2RlbC5nZXQoJ2lkJylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TaW11bGF0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICB2YXIgY29uZiA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICB2YXIgYmxvY2tseURhdGEgPSBudWxsO1xuICAgICAgdmFyIGJvZHlDb25maWdKU09OID0gbnVsbDtcblxuICAgICAgdmFyIHNhdmVEYXRhID0ge1xuICAgICAgICBuYW1lOiBcIihzaW11bGF0aW9uKVwiLFxuICAgICAgICBzaW11bGF0ZWQ6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgICAgc2F2ZURhdGEgPSAkLmV4dGVuZChzYXZlRGF0YSxibG9ja2x5RGF0YSk7XG4gICAgICAgIGJvZHlDb25maWdKU09OID0gSlNPTi5zdHJpbmdpZnkodGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuZ2V0QWN0aXZlQ29uZmlndXJhdGlvbigpKTtcbiAgICAgICAgc2F2ZURhdGEgPSAkLmV4dGVuZChzYXZlRGF0YSx7Ym9keUNvbmZpZ0pTT046IGJvZHlDb25maWdKU09OfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2F2ZU1vZGVsKCBzYXZlRGF0YSApLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybShtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgfSlcblxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2ltdWxhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBibG9ja2x5RGF0YSA/ICQuZXh0ZW5kKGNvbmYsIHtqc0NvZGU6IGJsb2NrbHlEYXRhLmpzQ29kZSwgYm9keUNvbmZpZ0pTT046IGJvZHlDb25maWdKU09OfSkgOiBjb25mXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX2V4dHJhY3RCbG9ja2x5KCkge1xuICAgICAgLy8gZ2V0IHRoZSBCbG9ja2x5IGNvZGUgeG1sXG4gICAgICB2YXIgYmxvY2tseVhtbCA9IHdpbmRvdy5CbG9ja2x5LlhtbC53b3Jrc3BhY2VUb0RvbSh3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkpO1xuXG4gICAgICAvLyByZW1vdmUgYmxvY2tzIGZyb20gYmxvY2tseVhtbCB0aGF0IGFyZSBub3Qgd2l0aGluIHRoZSBtYWluIGJsb2NrXG4gICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChibG9ja2x5WG1sLmNoaWxkTm9kZXMpLm1hcCgoY2hpbGROb2RlKSA9PiB7XG4gICAgICAgIGlmIChjaGlsZE5vZGUudGFnTmFtZSA9PSAnQkxPQ0snICYmIGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSAhPSAnZXZlcnlfdGltZScpIHtcbiAgICAgICAgICBibG9ja2x5WG1sLnJlbW92ZUNoaWxkKGNoaWxkTm9kZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGdlbmVyYXRlIHRoZSBqYXZhc2NyaXB0IGNvZGUgb2YgdGhlIG1haW4gYmxvY2tcbiAgICAgIHZhciBibG9ja3MgPSB3aW5kb3cuQmxvY2tseS5tYWluV29ya3NwYWNlLmdldFRvcEJsb2Nrcyh0cnVlKTtcbiAgICAgIHZhciBmb3VuZE1haW5CbG9jayA9IGZhbHNlO1xuICAgICAgdmFyIGpzQ29kZSA9ICcnO1xuICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCBibG9ja3MubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgaWYgKGJsb2Nrc1tiXS50eXBlID09ICdldmVyeV90aW1lJykge1xuICAgICAgICAgIGpzQ29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuYmxvY2tUb0NvZGUoYmxvY2tzW2JdKVxuICAgICAgICAgIGZvdW5kTWFpbkJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kTWFpbkJsb2NrKSB7YWxlcnQoJ3RoZXJlIGlzIG5vIG1haW4gYmxvY2snKX1cblxuICAgICAgLy93aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LmFkZFJlc2VydmVkV29yZHMoJ2pzQ29kZScpO1xuICAgICAgLy92YXIganNDb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC53b3Jrc3BhY2VUb0NvZGUoIHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSApO1xuXG4gICAgICAvLyByZXR1cm4geG1sIGFuZCBqc0NvZGUgYXMgc3RyaW5ncyB3aXRoaW4ganMgb2JqZWN0XG4gICAgICAvLyBzdHJpbmdpZnk6IGJsb2NrbHlYbWwub3V0ZXJIVE1MIC8vIEFsdGVybmF0aXZlbHk6IGJsb2NrbHlYbWxUZXh0ID0gd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvVGV4dCh4bWwpIChwcm9kdWNlcyBtaW5pbWFsLCB1Z2x5IHN0cmluZylcbiAgICAgIC8vIHhtbC1pZnkgd2l0aCBqcXVlcnk6ICQucGFyc2VYTUwoc3RyaW5nKS5kb2N1bWVudEVsZW1lbnRcbiAgICAgIC8vIEFsdGVybmF0aXZlbHkgZm9yIHJlY3JlYXRpbmcgYmxvY2tzOiBibG9ja2x5WG1sID0gd2luZG93LlhtbC50ZXh0VG9Eb20oYmxvY2tseVhtbFRleHQpICYgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKHdpbmRvdy5CbG9ja2x5Lm1haW5Xb3Jrc3BhY2UsIGJsb2NrbHlYbWwpXG4gICAgICByZXR1cm4ge2Jsb2NrbHlYbWw6IGJsb2NrbHlYbWwub3V0ZXJIVE1MLCBqc0NvZGU6IGpzQ29kZX1cbiAgICB9XG5cbiAgICBfb25TYXZlUmVxdWVzdChldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuZGlzcGxheSh0aGlzLl9uYW1lRm9ybS52aWV3KCkpXG4gICAgfVxuXG4gICAgX3NhdmVNb2RlbChkYXRhKSB7XG4gICAgICBkYXRhLnN0dWRlbnRJZCA9IEdsb2JhbHMuZ2V0KCdzdHVkZW50X2lkJyk7XG4gICAgICBkYXRhLm1vZGVsVHlwZSA9IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyk7XG4gICAgICBkYXRhLmxhYiA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJyk7XG4gICAgICBjb25zb2xlLmxvZygnX3NhdmVNb2RlbCcpXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgbGV0IHNhdmVPclVwZGF0ZTtcbiAgICAgIGlmICh0aGlzLl9sYXN0U2ltU2F2ZWQpIHtcbiAgICAgICAgc2F2ZU9yVXBkYXRlID0gVXRpbHMucHJvbWlzZUFqYXgoYC9hcGkvdjEvRXVnbGVuYU1vZGVscy8ke3RoaXMuX2xhc3RTaW1TYXZlZC5pZH1gLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgICAgICAgIHNpbXVsYXRlZDogZGF0YS5zaW11bGF0ZWRcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FdWdsZW5hTW9kZWxzJywge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBzYXZlT3JVcGRhdGUudGhlbigoc2VydmVyRGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5zaW11bGF0ZWQpIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBzZXJ2ZXJEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXJ2ZXJEYXRhKSByZXR1cm47XG4gICAgICAgIHJldHVybiBzZXJ2ZXJEYXRhO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lU3VibWl0KGV2dCkge1xuICAgICAgbGV0IG1vZGVsO1xuXG4gICAgICB2YXIgYmxvY2tseURhdGEgPSBudWxsO1xuICAgICAgdmFyIGJvZHlDb25maWdKU09OID0gbnVsbFxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgICAgYm9keUNvbmZpZ0pTT04gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5nZXRBY3RpdmVDb25maWd1cmF0aW9uKCkpO1xuICAgICAgICBibG9ja2x5RGF0YSA9ICQuZXh0ZW5kKGJsb2NrbHlEYXRhLHtib2R5Q29uZmlnOiBib2R5Q29uZmlnSlNPTn0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX25hbWVGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2F2ZU1vZGVsKCQuZXh0ZW5kKGJsb2NrbHlEYXRhLHtcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2Zvcm0uZXhwb3J0KCksXG4gICAgICAgICAgc2ltdWxhdGVkOiBmYWxzZVxuICAgICAgICB9KSlcbiAgICAgIH0pLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogbW9kZWwuaWRcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInNhdmVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGJsb2NrbHlEYXRhID8gJC5leHRlbmQodGhpcy5fZm9ybS5leHBvcnQoKSwge2JvZHlDb25maWdKU09OOiBib2R5Q29uZmlnSlNPTiwganNDb2RlOiBibG9ja2x5RGF0YS5qc0NvZGV9KSA6IHRoaXMuX2Zvcm0uZXhwb3J0KCkgLFxuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZUNhbmNlbChldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBfb25BZ2dyZWdhdGVSZXF1ZXN0KGV2dCkge1xuICAgICAgRXVnVXRpbHMuZ2V0TW9kZWxSZXN1bHRzKEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudC5pZCcpLCB0aGlzLl9jdXJyZW50TW9kZWwpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5BZGRSZXF1ZXN0Jywge1xuICAgICAgICAgIGRhdGE6IHJlc3VsdHNcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJhZ2dyZWdhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsSWQ6IHRoaXMuX2hpc3RvcnkuZXhwb3J0KCkubW9kZWxfaGlzdG9yeV9pZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5ld1JlcXVlc3QoZXZ0KSB7XG4gICAgICB0aGlzLl9vbkNvbmZpZ0NoYW5nZShldnQpO1xuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHsgbW9kZWxfaGlzdG9yeV9pZDogJ19uZXcnIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9zZXRNb2RlbE1vZGFsaXR5KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSkge1xuICAgICAgICBzd2l0Y2goR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsVGFiLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbFRhYih7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbFRhYjtcblxufSlcbiJdfQ==
