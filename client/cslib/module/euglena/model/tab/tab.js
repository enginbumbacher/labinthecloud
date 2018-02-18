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
            var opacity = parseInt(evt.data.delta.value.substr(evt.data.delta.value.indexOf('_') + 1)) / 100;
            this.bodyConfigurations.setBodyOpacity(opacity);
          }

          if (evt.data.field._model._data.id == 'bodyConfigurationName') {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJfbmFtZUZvcm0iLCJfb25OYW1lU3VibWl0IiwiX29uTmFtZUNhbmNlbCIsImFkZENoaWxkIiwiaW5pdGlhbEJvZHkiLCJleHBvcnQiLCJib2R5Q29uZmlndXJhdGlvbnMiLCJib2R5Q29uZmlndXJhdGlvbk5hbWUiLCJvcGFjaXR5IiwiX3NldE1vZGVsTW9kYWxpdHkiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uUGhhc2VDaGFuZ2UiLCJfY3Vyck1vZGVsSWQiLCJfY3VycmVudE1vZGVsIiwiaGlzdG9yeUNvdW50IiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJ0aGVuIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJtb2RlbF9oaXN0b3J5X2lkIiwic2V0U3RhdGUiLCJfbG9hZE1vZGVsSW5Gb3JtIiwibmFtZSIsIl9kYXRhIiwiY3VycmVudFRhcmdldCIsIl9sYXN0U2ltU2F2ZWQiLCJmaWVsZCIsInBhcnNlSW50IiwiZGVsdGEiLCJ2YWx1ZSIsInN1YnN0ciIsImluZGV4T2YiLCJzZXRCb2R5T3BhY2l0eSIsInNldEFjdGl2ZUNvbmZpZ3VyYXRpb24iLCJvbGRJZCIsInRhcmdldCIsInByb21pc2VBamF4IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRpc3BhdGNoRXZlbnQiLCJibG9ja2x5WG1sIiwiY29uZmlndXJhdGlvbiIsIm1vZGVsIiwidGFiSWQiLCJzaW11bGF0ZWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImJsb2NrbHlEYXRhIiwiYm9keUNvbmZpZ0pTT04iLCJzYXZlRGF0YSIsIl9leHRyYWN0QmxvY2tseSIsImV4dGVuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRBY3RpdmVDb25maWd1cmF0aW9uIiwiX3NhdmVNb2RlbCIsImpzQ29kZSIsIndpbmRvdyIsIkJsb2NrbHkiLCJYbWwiLCJ3b3Jrc3BhY2VUb0RvbSIsImdldE1haW5Xb3Jrc3BhY2UiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImNoaWxkTm9kZXMiLCJtYXAiLCJjaGlsZE5vZGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwicmVtb3ZlQ2hpbGQiLCJibG9ja3MiLCJtYWluV29ya3NwYWNlIiwiZ2V0VG9wQmxvY2tzIiwiZm91bmRNYWluQmxvY2siLCJiIiwiSmF2YVNjcmlwdCIsImJsb2NrVG9Db2RlIiwiYWxlcnQiLCJvdXRlckhUTUwiLCJkaXNwbGF5Iiwic3R1ZGVudElkIiwibGFiIiwiY29uc29sZSIsInNhdmVPclVwZGF0ZSIsIm1ldGhvZCIsImNvbnRlbnRUeXBlIiwic2VydmVyRGF0YSIsImJvZHlDb25maWciLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb24iLCJoaWRlIiwiY2xlYXIiLCJnZXRNb2RlbFJlc3VsdHMiLCJyZXN1bHRzIiwicGhhc2UiLCJ0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QVN3RixLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLMUgsUUFBTCxDQUFjeUMsTUFBZCxDQUFxQixFQUFFQyxrQkFBa0IsTUFBcEIsRUFBckI7QUFDRDtBQUNGO0FBalllO0FBQUE7QUFBQSwwQ0FtWUk7QUFDbEIsWUFBSTFELFFBQVFvQixHQUFSLENBQVksZ0NBQVosQ0FBSixFQUFtRDtBQUNqRCxrQkFBT3BCLFFBQVFvQixHQUFSLENBQVksZ0NBQVosRUFBOEN1SCxXQUE5QyxFQUFQO0FBQ0ksaUJBQUssU0FBTDtBQUNFLG1CQUFLbEgsS0FBTCxDQUFXbUgsVUFBWDtBQUNBLG1CQUFLNUgsUUFBTCxDQUFjNEgsVUFBZDtBQUNGO0FBQ0EsaUJBQUssU0FBTDtBQUNFLG1CQUFLbkgsS0FBTCxDQUFXb0gsYUFBWDtBQUNBLG1CQUFLN0gsUUFBTCxDQUFjNkgsYUFBZDtBQUNGO0FBUko7QUFVRDtBQUNGO0FBaFplOztBQUFBO0FBQUEsSUFpQksxSSxTQWpCTDs7QUFvWmxCUSxXQUFTTSxNQUFULEdBQWtCLFVBQUNpQyxJQUFELEVBQVU7QUFDMUIsV0FBTyxJQUFJdkMsUUFBSixDQUFhLEVBQUVtSSxXQUFXNUYsSUFBYixFQUFiLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU92QyxRQUFQO0FBRUQsQ0ExWkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvdGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcblxuICAgIE1vZGVsSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBNb2RlbEZvcm0gPSByZXF1aXJlKCcuLi9mb3JtL2Zvcm0nKSxcbiAgICBOYW1lRm9ybSA9IHJlcXVpcmUoJy4uL25hbWVmb3JtL2Zvcm0nKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKSxcbiAgICBCb2R5Q29uZmlndXJhdGlvbnMgPSByZXF1aXJlKCdldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzJyk7XG5cbiAgY2xhc3MgTW9kZWxUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25TaW11bGF0ZVJlcXVlc3QnLCAnX29uU2F2ZVJlcXVlc3QnLCAnX29uQWdncmVnYXRlUmVxdWVzdCcsXG4gICAgICAgICdfb25OYW1lQ2FuY2VsJywgJ19vbk5hbWVTdWJtaXQnLCAnX29uR2xvYmFsc0NoYW5nZScsICdfbG9hZE1vZGVsSW5Gb3JtJyxcbiAgICAgICAgJ19vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UnLCAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld1JlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnXG4gICAgICBdKTtcblxuICAgICAgdGhpcy5faGlzdG9yeSA9IE1vZGVsSGlzdG9yeUZvcm0uY3JlYXRlKHtcbiAgICAgICAgaWQ6IGBtb2RlbF9oaXN0b3J5X18ke3RoaXMuX21vZGVsLmdldChcImlkXCIpfWAsXG4gICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcblxuICAgICAgdGhpcy5fZm9ybSA9IE1vZGVsRm9ybS5jcmVhdGUoe1xuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgIGZpZWxkQ29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKSxcbiAgICAgICAgZXVnbGVuYUNvdW50Q29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ2V1Z2xlbmFDb3VudCcpXG4gICAgICB9KVxuICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TaW11bGF0ZScsIHRoaXMuX29uU2ltdWxhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TYXZlJywgdGhpcy5fb25TYXZlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld1JlcXVlc3QpO1xuXG4gICAgICB0aGlzLl9uYW1lRm9ybSA9IE5hbWVGb3JtLmNyZWF0ZSgpO1xuICAgICAgdGhpcy5fbmFtZUZvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsU2F2ZS5TdWJtaXQnLCB0aGlzLl9vbk5hbWVTdWJtaXQpO1xuICAgICAgdGhpcy5fbmFtZUZvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsU2F2ZS5DYW5jZWwnLCB0aGlzLl9vbk5hbWVDYW5jZWwpO1xuICAgICAgdGhpcy52aWV3KCkuYWRkQ2hpbGQodGhpcy5faGlzdG9yeS52aWV3KCkpO1xuXG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGJvZHkgY29uZmlndXJhdGlvbiBtb2RlbCBpbnN0YW5jZS5cbiAgICAgICAgdmFyIGluaXRpYWxCb2R5ID0gdGhpcy5fZm9ybS5leHBvcnQoKTtcbiAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMgPSBCb2R5Q29uZmlndXJhdGlvbnMuY3JlYXRlKHtib2R5Q29uZmlndXJhdGlvbk5hbWU6IGluaXRpYWxCb2R5Wydib2R5Q29uZmlndXJhdGlvbk5hbWUnXSxcbiAgICAgICAgb3BhY2l0eTogaW5pdGlhbEJvZHlbJ29wYWNpdHknXX0pXG5cbiAgICAgICAgLy8gYWRkIHZpZXcgb2YgdGhlIG1vZGVsIGluc3RhbmNlIHRvIHRoaXMudmlldygpXG4gICAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZENoaWxkKHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnZpZXcoKSxudWxsLDApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9mb3JtLnZpZXcoKSk7XG5cbiAgICAgIHRoaXMuX3NldE1vZGVsTW9kYWxpdHkoKTtcblxuICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsSWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3Vyck1vZGVsSWQ7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRNb2RlbDtcbiAgICB9XG5cbiAgICBjb2xvcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2NvbG9yJylcbiAgICB9XG5cbiAgICBoaXN0b3J5Q291bnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5oaXN0b3J5Q291bnQoKTtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSAnc3R1ZGVudF9pZCc6XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKVxuICAgICAgICAgICAgaWYgKGhpc3QubGVuZ3RoICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKT09J2NyZWF0ZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBoaXN0W2hpc3QubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybSh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWQpO1xuICAgICAgICAgIH0pXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oJ19uZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7IHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTsgfVxuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAodGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGhlcmUsIGNoYW5nZSB0aGUgaW1hZ2UgYW5kIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBib2R5Q29uZmlndXJhdGlvbk5hbWUgaGFzIGJlZW4gc2VsZWN0ZWQuXG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Zvcm0uRmllbGRDaGFuZ2VkJykge1xuICAgICAgICBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdvcGFjaXR5Jykge1xuICAgICAgICAgIGxldCBvcGFjaXR5ID0gcGFyc2VJbnQoZXZ0LmRhdGEuZGVsdGEudmFsdWUuc3Vic3RyKGV2dC5kYXRhLmRlbHRhLnZhbHVlLmluZGV4T2YoJ18nKSsxKSkgLyAxMDBcbiAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRCb2R5T3BhY2l0eShvcGFjaXR5KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdib2R5Q29uZmlndXJhdGlvbk5hbWUnKSB7XG4gICAgICAgICAgdGhpcy5ib2R5Q29uZmlndXJhdGlvbnMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihldnQuZGF0YS5kZWx0YS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfbG9hZE1vZGVsSW5Gb3JtKGlkKSB7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBsZXQgb2xkSWQgPSB0aGlzLl9jdXJyTW9kZWxJZDtcbiAgICAgIGxldCB0YXJnZXQgPSBpZCA9PSAnX25ldycgPyBudWxsIDogaWQ7XG4gICAgICBpZiAob2xkSWQgIT0gdGFyZ2V0KSB7XG4gICAgICAgIGlmIChpZCAhPSAnX25ldycpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHtpZH1gKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9mb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBkYXRhO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWwuX2RhdGEubW9kZWxUeXBlID09ICdibG9ja2x5Jykge1xuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdCbG9ja2x5LkxvYWQnLCBkYXRhLmJsb2NrbHlYbWwpO1xuICAgICAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKGRhdGEuY29uZmlndXJhdGlvbi5ib2R5Q29uZmlndXJhdGlvbk5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9mb3JtLmltcG9ydChkYXRhLmNvbmZpZ3VyYXRpb24pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IGRhdGEsXG4gICAgICAgICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnaGlzdG9yaWNhbCcpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICBpZDogJ19uZXcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9zaWxlbmNlTG9hZExvZ3MpIHtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibG9hZFwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWxJZDogaWQsXG4gICAgICAgICAgICAgIHRhYjogdGhpcy5pZCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sYXN0U2ltU2F2ZWQgJiYgdGhpcy5fbGFzdFNpbVNhdmVkLmlkID09IG9sZElkKSB7XG4gICAgICAgIC8vIGhhbmRsZSBcInJlcnVubmluZ1wiIGEgc2ltdWxhdGlvblxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgIG1vZGVsOiB0aGlzLl9sYXN0U2ltU2F2ZWQsXG4gICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblNpbXVsYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIHZhciBjb25mID0gdGhpcy5fZm9ybS5leHBvcnQoKTtcbiAgICAgIHZhciBibG9ja2x5RGF0YSA9IG51bGw7XG4gICAgICB2YXIgYm9keUNvbmZpZ0pTT04gPSBudWxsO1xuXG4gICAgICB2YXIgc2F2ZURhdGEgPSB7XG4gICAgICAgIG5hbWU6IFwiKHNpbXVsYXRpb24pXCIsXG4gICAgICAgIHNpbXVsYXRlZDogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhdGlvbjogY29uZlxuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgYWN0aXZlIHRhYiBpcyAnYmxvY2tseScsIHRoZW4gd2UgaGF2ZSB0byBjb21waWxlIGFuZCBleHRyYWN0IHRoZSBibG9ja2x5IGNvZGUuXG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgYmxvY2tseURhdGEgPSB0aGlzLl9leHRyYWN0QmxvY2tseSgpO1xuICAgICAgICBzYXZlRGF0YSA9ICQuZXh0ZW5kKHNhdmVEYXRhLGJsb2NrbHlEYXRhKTtcbiAgICAgICAgYm9keUNvbmZpZ0pTT04gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5nZXRBY3RpdmVDb25maWd1cmF0aW9uKCkpO1xuICAgICAgICBzYXZlRGF0YSA9ICQuZXh0ZW5kKHNhdmVEYXRhLHtib2R5Q29uZmlnSlNPTjogYm9keUNvbmZpZ0pTT059KVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zYXZlTW9kZWwoIHNhdmVEYXRhICkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICB9KVxuXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzaW11bGF0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGJsb2NrbHlEYXRhID8gJC5leHRlbmQoY29uZiwge2pzQ29kZTogYmxvY2tseURhdGEuanNDb2RlLCBib2R5Q29uZmlnSlNPTjogYm9keUNvbmZpZ0pTT059KSA6IGNvbmZcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfZXh0cmFjdEJsb2NrbHkoKSB7XG4gICAgICAvLyBnZXQgdGhlIEJsb2NrbHkgY29kZSB4bWxcbiAgICAgIHZhciBibG9ja2x5WG1sID0gd2luZG93LkJsb2NrbHkuWG1sLndvcmtzcGFjZVRvRG9tKHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSk7XG5cbiAgICAgIC8vIHJlbW92ZSBibG9ja3MgZnJvbSBibG9ja2x5WG1sIHRoYXQgYXJlIG5vdCB3aXRoaW4gdGhlIG1haW4gYmxvY2tcbiAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJsb2NrbHlYbWwuY2hpbGROb2RlcykubWFwKChjaGlsZE5vZGUpID0+IHtcbiAgICAgICAgaWYgKGNoaWxkTm9kZS50YWdOYW1lID09ICdCTE9DSycgJiYgY2hpbGROb2RlLmdldEF0dHJpYnV0ZSgndHlwZScpICE9ICdldmVyeV90aW1lJykge1xuICAgICAgICAgIGJsb2NrbHlYbWwucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gZ2VuZXJhdGUgdGhlIGphdmFzY3JpcHQgY29kZSBvZiB0aGUgbWFpbiBibG9ja1xuICAgICAgdmFyIGJsb2NrcyA9IHdpbmRvdy5CbG9ja2x5Lm1haW5Xb3Jrc3BhY2UuZ2V0VG9wQmxvY2tzKHRydWUpO1xuICAgICAgdmFyIGZvdW5kTWFpbkJsb2NrID0gZmFsc2U7XG4gICAgICB2YXIganNDb2RlID0gJyc7XG4gICAgICBmb3IgKHZhciBiID0gMDsgYiA8IGJsb2Nrcy5sZW5ndGg7IGIrKykge1xuICAgICAgICBpZiAoYmxvY2tzW2JdLnR5cGUgPT0gJ2V2ZXJ5X3RpbWUnKSB7XG4gICAgICAgICAganNDb2RlID0gd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5ibG9ja1RvQ29kZShibG9ja3NbYl0pXG4gICAgICAgICAgZm91bmRNYWluQmxvY2sgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmRNYWluQmxvY2spIHthbGVydCgndGhlcmUgaXMgbm8gbWFpbiBibG9jaycpfVxuXG4gICAgICAvL3dpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuYWRkUmVzZXJ2ZWRXb3JkcygnanNDb2RlJyk7XG4gICAgICAvL3ZhciBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LndvcmtzcGFjZVRvQ29kZSggd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpICk7XG5cbiAgICAgIC8vIHJldHVybiB4bWwgYW5kIGpzQ29kZSBhcyBzdHJpbmdzIHdpdGhpbiBqcyBvYmplY3RcbiAgICAgIC8vIHN0cmluZ2lmeTogYmxvY2tseVhtbC5vdXRlckhUTUwgLy8gQWx0ZXJuYXRpdmVseTogYmxvY2tseVhtbFRleHQgPSB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9UZXh0KHhtbCkgKHByb2R1Y2VzIG1pbmltYWwsIHVnbHkgc3RyaW5nKVxuICAgICAgLy8geG1sLWlmeSB3aXRoIGpxdWVyeTogJC5wYXJzZVhNTChzdHJpbmcpLmRvY3VtZW50RWxlbWVudFxuICAgICAgLy8gQWx0ZXJuYXRpdmVseSBmb3IgcmVjcmVhdGluZyBibG9ja3M6IGJsb2NrbHlYbWwgPSB3aW5kb3cuWG1sLnRleHRUb0RvbShibG9ja2x5WG1sVGV4dCkgJiB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2Uod2luZG93LkJsb2NrbHkubWFpbldvcmtzcGFjZSwgYmxvY2tseVhtbClcbiAgICAgIHJldHVybiB7YmxvY2tseVhtbDogYmxvY2tseVhtbC5vdXRlckhUTUwsIGpzQ29kZToganNDb2RlfVxuICAgIH1cblxuICAgIF9vblNhdmVSZXF1ZXN0KGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5kaXNwbGF5KHRoaXMuX25hbWVGb3JtLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfc2F2ZU1vZGVsKGRhdGEpIHtcbiAgICAgIGRhdGEuc3R1ZGVudElkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGRhdGEubW9kZWxUeXBlID0gdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKTtcbiAgICAgIGRhdGEubGFiID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKTtcbiAgICAgIGNvbnNvbGUubG9nKCdfc2F2ZU1vZGVsJylcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICBsZXQgc2F2ZU9yVXBkYXRlO1xuICAgICAgaWYgKHRoaXMuX2xhc3RTaW1TYXZlZCkge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7dGhpcy5fbGFzdFNpbVNhdmVkLmlkfWAsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgICAgICAgc2ltdWxhdGVkOiBkYXRhLnNpbXVsYXRlZFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V1Z2xlbmFNb2RlbHMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNhdmVPclVwZGF0ZS50aGVuKChzZXJ2ZXJEYXRhKSA9PiB7XG4gICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IHNlcnZlckRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlcnZlckRhdGEpIHJldHVybjtcbiAgICAgICAgcmV0dXJuIHNlcnZlckRhdGE7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVTdWJtaXQoZXZ0KSB7XG4gICAgICBsZXQgbW9kZWw7XG5cbiAgICAgIHZhciBibG9ja2x5RGF0YSA9IG51bGw7XG4gICAgICB2YXIgYm9keUNvbmZpZ0pTT04gPSBudWxsXG4gICAgICAvLyBpZiB0aGUgYWN0aXZlIHRhYiBpcyAnYmxvY2tseScsIHRoZW4gd2UgaGF2ZSB0byBjb21waWxlIGFuZCBleHRyYWN0IHRoZSBibG9ja2x5IGNvZGUuXG4gICAgICBpZiAodGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgYmxvY2tseURhdGEgPSB0aGlzLl9leHRyYWN0QmxvY2tseSgpO1xuICAgICAgICBib2R5Q29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLmdldEFjdGl2ZUNvbmZpZ3VyYXRpb24oKSk7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gJC5leHRlbmQoYmxvY2tseURhdGEse2JvZHlDb25maWc6IGJvZHlDb25maWdKU09OfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbmFtZUZvcm0udmFsaWRhdGUoKS50aGVuKCh2YWxpZGF0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zYXZlTW9kZWwoJC5leHRlbmQoYmxvY2tseURhdGEse1xuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWUsXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fZm9ybS5leHBvcnQoKSxcbiAgICAgICAgICBzaW11bGF0ZWQ6IGZhbHNlXG4gICAgICAgIH0pKVxuICAgICAgfSkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fbmFtZUZvcm0uY2xlYXIoKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7XG4gICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBtb2RlbC5pZFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2F2ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgY29uZmlndXJhdGlvbjogYmxvY2tseURhdGEgPyAkLmV4dGVuZCh0aGlzLl9mb3JtLmV4cG9ydCgpLCB7Ym9keUNvbmZpZ0pTT046IGJvZHlDb25maWdKU09OLCBqc0NvZGU6IGJsb2NrbHlEYXRhLmpzQ29kZX0pIDogdGhpcy5fZm9ybS5leHBvcnQoKSAsXG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lQ2FuY2VsKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRNb2RlbFJlc3VsdHMoR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50LmlkJyksIHRoaXMuX2N1cnJlbnRNb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmV3UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX29uQ29uZmlnQ2hhbmdlKGV2dCk7XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3NldE1vZGVsTW9kYWxpdHkoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcIm9ic2VydmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5oaWRlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXhwbG9yZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmRpc2FibGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgTW9kZWxUYWIuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsVGFiKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcmV0dXJuIE1vZGVsVGFiO1xuXG59KVxuIl19
