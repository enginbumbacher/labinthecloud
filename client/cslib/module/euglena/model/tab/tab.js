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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiQm9keUNvbmZpZ3VyYXRpb25zIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJ0aXRsZU5vZGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJpbm5lckhUTUwiLCIkZG9tIiwiYXBwZW5kIiwiX25hbWVGb3JtIiwiX29uTmFtZVN1Ym1pdCIsIl9vbk5hbWVDYW5jZWwiLCJhZGRDaGlsZCIsImluaXRpYWxCb2R5IiwiZXhwb3J0IiwicGFyYW1PcHRpb25zIiwiT2JqZWN0Iiwia2V5cyIsIksiLCJvcHRpb25zIiwidiIsIm9tZWdhIiwiYm9keUNvbmZpZ3VyYXRpb25zIiwiaW5pdGlhbENvbmZpZyIsIm1vZGVsTW9kYWxpdHkiLCJfc2V0TW9kZWxNb2RhbGl0eSIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25QaGFzZUNoYW5nZSIsIl9jdXJyTW9kZWxJZCIsIl9jdXJyZW50TW9kZWwiLCJoaXN0b3J5Q291bnQiLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsInRoZW4iLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsIm1vZGVsX2hpc3RvcnlfaWQiLCJzZXRTdGF0ZSIsIl9sb2FkTW9kZWxJbkZvcm0iLCJuYW1lIiwiX2RhdGEiLCJjdXJyZW50VGFyZ2V0IiwiX2xhc3RTaW1TYXZlZCIsImZpZWxkIiwic2V0Qm9keU9wYWNpdHkiLCJkZWx0YSIsInZhbHVlIiwic2V0QWN0aXZlQ29uZmlndXJhdGlvbiIsIm9sZElkIiwidGFyZ2V0IiwicHJvbWlzZUFqYXgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGF0Y2hFdmVudCIsImJsb2NrbHlYbWwiLCJpZHgiLCJjb25maWd1cmF0aW9uIiwibWF0Y2giLCJlbGVtTmFtZSIsIm1vZGVsIiwidGFiSWQiLCJzaW11bGF0ZWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImJsb2NrbHlEYXRhIiwic2Vuc29yQ29uZmlnSlNPTiIsImNvbnNvbGUiLCJzYXZlRGF0YSIsIl9leHRyYWN0QmxvY2tseSIsImV4dGVuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRBY3RpdmVTZW5zb3JDb25maWd1cmF0aW9uIiwiX3NhdmVNb2RlbCIsImpzQ29kZSIsIndpbmRvdyIsIkJsb2NrbHkiLCJYbWwiLCJ3b3Jrc3BhY2VUb0RvbSIsImdldE1haW5Xb3Jrc3BhY2UiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImNoaWxkTm9kZXMiLCJtYXAiLCJjaGlsZE5vZGUiLCJ0YWdOYW1lIiwiZ2V0QXR0cmlidXRlIiwicmVtb3ZlQ2hpbGQiLCJibG9ja3MiLCJtYWluV29ya3NwYWNlIiwiZ2V0VG9wQmxvY2tzIiwiZm91bmRNYWluQmxvY2siLCJiIiwiSmF2YVNjcmlwdCIsImJsb2NrVG9Db2RlIiwiYWxlcnQiLCJvdXRlckhUTUwiLCJkaXNwbGF5Iiwic3R1ZGVudElkIiwibGFiIiwic2F2ZU9yVXBkYXRlIiwibWV0aG9kIiwiY29udGVudFR5cGUiLCJzZXJ2ZXJEYXRhIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwiaGlkZSIsImNsZWFyIiwiZ2V0TW9kZWxSZXN1bHRzIiwicmVzdWx0cyIsInBoYXNlIiwidG9Mb3dlckNhc2UiLCJoaWRlRmllbGRzIiwiZGlzYWJsZUZpZWxkcyIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxJQUFJRCxRQUFRLFFBQVIsQ0FBVjs7QUFFQSxNQUFNRSxVQUFVRixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUcsUUFBUUgsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUksS0FBS0osUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1LLFlBQVlMLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFTSxRQUFRTixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVPLE9BQU9QLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRVEsbUJBQW1CUixRQUFRLGlCQUFSLENBSnJCO0FBQUEsTUFLRVMsWUFBWVQsUUFBUSxjQUFSLENBTGQ7QUFBQSxNQU1FVSxXQUFXVixRQUFRLGtCQUFSLENBTmI7QUFBQSxNQU9FVyxXQUFXWCxRQUFRLGVBQVIsQ0FQYjtBQUFBLE1BUUVZLHFCQUFxQlosUUFBUSxrRUFBUixDQVJ2Qjs7QUFQa0IsTUFpQlphLFFBakJZO0FBQUE7O0FBa0JoQix3QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCVCxLQUE3QztBQUNBUSxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCVCxJQUEzQzs7QUFGeUIsc0hBR25CTyxRQUhtQjs7QUFJekJYLFlBQU1jLFdBQU4sUUFBd0IsQ0FDdEIsb0JBRHNCLEVBQ0EsZ0JBREEsRUFDa0IscUJBRGxCLEVBRXRCLGVBRnNCLEVBRUws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QUlBLElBQUlDLElBQUosQ0FBU3VGLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkJ4RixJQUFJQyxJQUFKLENBQVN1RixLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLdkksUUFBTCxDQUFjdUQsTUFBZCxDQUFxQixFQUFFQyxrQkFBa0IsTUFBcEIsRUFBckI7QUFDRDtBQUNGO0FBcFplO0FBQUE7QUFBQSwwQ0FzWkk7QUFDbEIsWUFBSXhFLFFBQVFvQixHQUFSLENBQVksZ0NBQVosQ0FBSixFQUFtRDtBQUNqRCxrQkFBT3BCLFFBQVFvQixHQUFSLENBQVksZ0NBQVosRUFBOENvSSxXQUE5QyxFQUFQO0FBQ0ksaUJBQUssU0FBTDtBQUNFLG1CQUFLL0gsS0FBTCxDQUFXZ0ksVUFBWDtBQUNBLG1CQUFLekksUUFBTCxDQUFjeUksVUFBZDtBQUNGO0FBQ0EsaUJBQUssU0FBTDtBQUNFLG1CQUFLaEksS0FBTCxDQUFXaUksYUFBWDtBQUNBLG1CQUFLMUksUUFBTCxDQUFjMEksYUFBZDtBQUNGO0FBUko7QUFVRDtBQUNGO0FBbmFlOztBQUFBO0FBQUEsSUFpQkt2SixTQWpCTDs7QUF1YWxCUSxXQUFTTSxNQUFULEdBQWtCLFVBQUMrQyxJQUFELEVBQVU7QUFDMUIsV0FBTyxJQUFJckQsUUFBSixDQUFhLEVBQUVnSixXQUFXM0YsSUFBYixFQUFiLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9yRCxRQUFQO0FBRUQsQ0E3YUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvdGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcblxuICAgIE1vZGVsSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBNb2RlbEZvcm0gPSByZXF1aXJlKCcuLi9mb3JtL2Zvcm0nKSxcbiAgICBOYW1lRm9ybSA9IHJlcXVpcmUoJy4uL25hbWVmb3JtL2Zvcm0nKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKSxcbiAgICBCb2R5Q29uZmlndXJhdGlvbnMgPSByZXF1aXJlKCdldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzJyk7XG5cbiAgY2xhc3MgTW9kZWxUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25TaW11bGF0ZVJlcXVlc3QnLCAnX29uU2F2ZVJlcXVlc3QnLCAnX29uQWdncmVnYXRlUmVxdWVzdCcsXG4gICAgICAgICdfb25OYW1lQ2FuY2VsJywgJ19vbk5hbWVTdWJtaXQnLCAnX29uR2xvYmFsc0NoYW5nZScsICdfbG9hZE1vZGVsSW5Gb3JtJyxcbiAgICAgICAgJ19vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UnLCAnX29uQ29uZmlnQ2hhbmdlJywgJ19vbk5ld1JlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnXG4gICAgICBdKTtcblxuICAgICAgdGhpcy5faGlzdG9yeSA9IE1vZGVsSGlzdG9yeUZvcm0uY3JlYXRlKHtcbiAgICAgICAgaWQ6IGBtb2RlbF9oaXN0b3J5X18ke3RoaXMuX21vZGVsLmdldChcImlkXCIpfWAsXG4gICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9oaXN0b3J5LmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSBmYWxzZTtcblxuICAgICAgdGhpcy5fZm9ybSA9IE1vZGVsRm9ybS5jcmVhdGUoe1xuICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgIGZpZWxkQ29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKSxcbiAgICAgICAgZXVnbGVuYUNvdW50Q29uZmlnOiB0aGlzLl9tb2RlbC5nZXQoJ2V1Z2xlbmFDb3VudCcpXG4gICAgICB9KVxuICAgICAgdGhpcy5fZm9ybS5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TaW11bGF0ZScsIHRoaXMuX29uU2ltdWxhdGVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5TYXZlJywgdGhpcy5fb25TYXZlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uQWRkVG9BZ2dyZWdhdGUnLCB0aGlzLl9vbkFnZ3JlZ2F0ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLk5ld1JlcXVlc3QnLCB0aGlzLl9vbk5ld1JlcXVlc3QpO1xuXG4gICAgICAvLyBJbnNlcnQgYSB0aXRsZSBvZiB0aGUgdGFiXG4gICAgICB2YXIgdGl0bGVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICAgIHRpdGxlTm9kZS5jbGFzc05hbWUgPSAndGFiX19tb2RlbF9fdGl0bGUnXG4gICAgICB0aXRsZU5vZGUuaW5uZXJIVE1MID0gJ01vZGVsIG9mIHRoZSBCb2R5J1xuXG4gICAgICB0aGlzLnZpZXcoKS4kZG9tKCkuYXBwZW5kKHRpdGxlTm9kZSlcblxuICAgICAgdGhpcy5fbmFtZUZvcm0gPSBOYW1lRm9ybS5jcmVhdGUoKTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuU3VibWl0JywgdGhpcy5fb25OYW1lU3VibWl0KTtcbiAgICAgIHRoaXMuX25hbWVGb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbFNhdmUuQ2FuY2VsJywgdGhpcy5fb25OYW1lQ2FuY2VsKTtcbiAgICAgIHRoaXMudmlldygpLmFkZENoaWxkKHRoaXMuX2hpc3RvcnkudmlldygpKTtcblxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIC8vIENyZWF0ZSBib2R5IGNvbmZpZ3VyYXRpb24gbW9kZWwgaW5zdGFuY2UuXG4gICAgICAgIHZhciBpbml0aWFsQm9keSA9IHRoaXMuX2Zvcm0uZXhwb3J0KCk7XG4gICAgICAgIHZhciBwYXJhbU9wdGlvbnMgPSB7fVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ3JlYWN0aW9uJ10gPSBPYmplY3Qua2V5cyh0aGlzLl9tb2RlbC5nZXQoJ3BhcmFtZXRlcnMnKS5LLm9wdGlvbnMpXG4gICAgICAgIHBhcmFtT3B0aW9uc1snZm9yd2FyZCddID0gT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZ2V0KCdwYXJhbWV0ZXJzJykudi5vcHRpb25zKVxuICAgICAgICBwYXJhbU9wdGlvbnNbJ3JvbGwnXSA9IE9iamVjdC5rZXlzKHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLm9tZWdhLm9wdGlvbnMpXG4gICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zID0gQm9keUNvbmZpZ3VyYXRpb25zLmNyZWF0ZSh7aW5pdGlhbENvbmZpZzogaW5pdGlhbEJvZHksIHBhcmFtT3B0aW9uczogcGFyYW1PcHRpb25zLCBtb2RlbE1vZGFsaXR5OiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsTW9kYWxpdHknKX0pXG5cbiAgICAgICAgLy8gYWRkIHZpZXcgb2YgdGhlIG1vZGVsIGluc3RhbmNlIHRvIHRoaXMudmlldygpXG4gICAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZENoaWxkKHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnZpZXcoKSxudWxsLDApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9mb3JtLnZpZXcoKSk7XG5cbiAgICAgIHRoaXMuX3NldE1vZGVsTW9kYWxpdHkoKTtcblxuICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsSWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3Vyck1vZGVsSWQ7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRNb2RlbDtcbiAgICB9XG5cbiAgICBjb2xvcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2NvbG9yJylcbiAgICB9XG5cbiAgICBoaXN0b3J5Q291bnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5oaXN0b3J5Q291bnQoKTtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSAnc3R1ZGVudF9pZCc6XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKVxuICAgICAgICAgICAgaWYgKGhpc3QubGVuZ3RoICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKT09J2NyZWF0ZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBoaXN0W2hpc3QubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybSh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWQpO1xuICAgICAgICAgIH0pXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oJ19uZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7IHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTsgfVxuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAodGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGhlcmUsIGNoYW5nZSB0aGUgaW1hZ2UgYW5kIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBib2R5Q29uZmlndXJhdGlvbiAoc2Vuc29yQ29uZmlnLCBmb3J3YXJkLCByZWFjdCwgcm9sbCkgaGFzIGJlZW4gc2VsZWN0ZWQuXG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Zvcm0uRmllbGRDaGFuZ2VkJykge1xuICAgICAgICBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdvcGFjaXR5Jykge1xuICAgICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnNldEJvZHlPcGFjaXR5KGV2dC5kYXRhLmRlbHRhLnZhbHVlKVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSBpZiAoZXZ0LmN1cnJlbnRUYXJnZXQuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSAnYmxvY2tseScpe1xuICAgICAgICAgIHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLnNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oZXZ0LmRhdGEuZGVsdGEudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xvYWRNb2RlbEluRm9ybShpZCkge1xuICAgICAgaWYgKCFpZCkgcmV0dXJuO1xuICAgICAgbGV0IG9sZElkID0gdGhpcy5fY3Vyck1vZGVsSWQ7XG4gICAgICBsZXQgdGFyZ2V0ID0gaWQgPT0gJ19uZXcnID8gbnVsbCA6IGlkO1xuICAgICAgaWYgKG9sZElkICE9IHRhcmdldCkge1xuICAgICAgICBpZiAoaWQgIT0gJ19uZXcnKSB7XG4gICAgICAgICAgdGhpcy5fY3Vyck1vZGVsSWQgPSBpZDtcbiAgICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7aWR9YCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZm9ybS5yZW1vdmVFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX29uQ29uZmlnQ2hhbmdlKVxuICAgICAgICAgICAgdGhpcy5fY3VycmVudE1vZGVsID0gZGF0YTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQmxvY2tseS5Mb2FkJywgZGF0YS5ibG9ja2x5WG1sKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaWR4ID0gT2JqZWN0LmtleXMoZGF0YS5jb25maWd1cmF0aW9uKS5sZW5ndGggLSAxOyBpZHggPj0gMDsgaWR4LS0pIHtcbiAgICAgICAgICAgICAgICBpZiAoIShPYmplY3Qua2V5cyhkYXRhLmNvbmZpZ3VyYXRpb24pW2lkeF0ubWF0Y2goXCJffGNvdW50XCIpKSkge1xuICAgICAgICAgICAgICAgICAgbGV0IGVsZW1OYW1lID0gT2JqZWN0LmtleXMoZGF0YS5jb25maWd1cmF0aW9uKVtpZHhdXG4gICAgICAgICAgICAgICAgICB0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKGRhdGEuY29uZmlndXJhdGlvbltlbGVtTmFtZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9mb3JtLmltcG9ydChkYXRhLmNvbmZpZ3VyYXRpb24pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IGRhdGEsXG4gICAgICAgICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnaGlzdG9yaWNhbCcpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICBpZDogJ19uZXcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9zaWxlbmNlTG9hZExvZ3MpIHtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibG9hZFwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWxJZDogaWQsXG4gICAgICAgICAgICAgIHRhYjogdGhpcy5fbW9kZWwuZ2V0KCdpZCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sYXN0U2ltU2F2ZWQgJiYgdGhpcy5fbGFzdFNpbVNhdmVkLmlkID09IG9sZElkKSB7XG4gICAgICAgIC8vIGhhbmRsZSBcInJlcnVubmluZ1wiIGEgc2ltdWxhdGlvblxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgIG1vZGVsOiB0aGlzLl9sYXN0U2ltU2F2ZWQsXG4gICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblNpbXVsYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIHZhciBjb25mID0gdGhpcy5fZm9ybS5leHBvcnQoKTtcbiAgICAgIHZhciBibG9ja2x5RGF0YSA9IG51bGw7XG4gICAgICB2YXIgc2Vuc29yQ29uZmlnSlNPTiA9IG51bGw7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdvblNpbXVsYXRlUmVxdWVzdCAnICsgdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSlcblxuICAgICAgdmFyIHNhdmVEYXRhID0ge1xuICAgICAgICBuYW1lOiBcIihzaW11bGF0aW9uKVwiLFxuICAgICAgICBzaW11bGF0ZWQ6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgICAgc2F2ZURhdGEgPSAkLmV4dGVuZChzYXZlRGF0YSxibG9ja2x5RGF0YSk7XG4gICAgICAgIHNlbnNvckNvbmZpZ0pTT04gPSBKU09OLnN0cmluZ2lmeSh0aGlzLmJvZHlDb25maWd1cmF0aW9ucy5nZXRBY3RpdmVTZW5zb3JDb25maWd1cmF0aW9uKCkpO1xuICAgICAgICBzYXZlRGF0YSA9ICQuZXh0ZW5kKHNhdmVEYXRhLHtzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OfSlcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coc2Vuc29yQ29uZmlnSlNPTilcblxuICAgICAgdGhpcy5fc2F2ZU1vZGVsKCBzYXZlRGF0YSApLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybShtb2RlbC5pZCk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgfSlcblxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwic2ltdWxhdGVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBibG9ja2x5RGF0YSA/ICQuZXh0ZW5kKGNvbmYsIHtqc0NvZGU6IGJsb2NrbHlEYXRhLmpzQ29kZSwgc2Vuc29yQ29uZmlnSlNPTjogc2Vuc29yQ29uZmlnSlNPTn0pIDogY29uZlxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9leHRyYWN0QmxvY2tseSgpIHtcbiAgICAgIC8vIGdldCB0aGUgQmxvY2tseSBjb2RlIHhtbFxuICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcblxuICAgICAgLy8gcmVtb3ZlIGJsb2NrcyBmcm9tIGJsb2NrbHlYbWwgdGhhdCBhcmUgbm90IHdpdGhpbiB0aGUgbWFpbiBibG9ja1xuICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYmxvY2tseVhtbC5jaGlsZE5vZGVzKS5tYXAoKGNoaWxkTm9kZSkgPT4ge1xuICAgICAgICBpZiAoY2hpbGROb2RlLnRhZ05hbWUgPT0gJ0JMT0NLJyAmJiBjaGlsZE5vZGUuZ2V0QXR0cmlidXRlKCd0eXBlJykgIT0gJ2V2ZXJ5X3RpbWUnKSB7XG4gICAgICAgICAgYmxvY2tseVhtbC5yZW1vdmVDaGlsZChjaGlsZE5vZGUpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBnZW5lcmF0ZSB0aGUgamF2YXNjcmlwdCBjb2RlIG9mIHRoZSBtYWluIGJsb2NrXG4gICAgICB2YXIgYmxvY2tzID0gd2luZG93LkJsb2NrbHkubWFpbldvcmtzcGFjZS5nZXRUb3BCbG9ja3ModHJ1ZSk7XG4gICAgICB2YXIgZm91bmRNYWluQmxvY2sgPSBmYWxzZTtcbiAgICAgIHZhciBqc0NvZGUgPSAnJztcbiAgICAgIGZvciAodmFyIGIgPSAwOyBiIDwgYmxvY2tzLmxlbmd0aDsgYisrKSB7XG4gICAgICAgIGlmIChibG9ja3NbYl0udHlwZSA9PSAnZXZlcnlfdGltZScpIHtcbiAgICAgICAgICBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LmJsb2NrVG9Db2RlKGJsb2Nrc1tiXSlcbiAgICAgICAgICBmb3VuZE1haW5CbG9jayA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmb3VuZE1haW5CbG9jaykge2FsZXJ0KCd0aGVyZSBpcyBubyBtYWluIGJsb2NrJyl9XG5cbiAgICAgIC8vd2luZG93LkJsb2NrbHkuSmF2YVNjcmlwdC5hZGRSZXNlcnZlZFdvcmRzKCdqc0NvZGUnKTtcbiAgICAgIC8vdmFyIGpzQ29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQud29ya3NwYWNlVG9Db2RlKCB3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkgKTtcblxuICAgICAgLy8gcmV0dXJuIHhtbCBhbmQganNDb2RlIGFzIHN0cmluZ3Mgd2l0aGluIGpzIG9iamVjdFxuICAgICAgLy8gc3RyaW5naWZ5OiBibG9ja2x5WG1sLm91dGVySFRNTCAvLyBBbHRlcm5hdGl2ZWx5OiBibG9ja2x5WG1sVGV4dCA9IHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1RleHQoeG1sKSAocHJvZHVjZXMgbWluaW1hbCwgdWdseSBzdHJpbmcpXG4gICAgICAvLyB4bWwtaWZ5IHdpdGgganF1ZXJ5OiAkLnBhcnNlWE1MKHN0cmluZykuZG9jdW1lbnRFbGVtZW50XG4gICAgICAvLyBBbHRlcm5hdGl2ZWx5IGZvciByZWNyZWF0aW5nIGJsb2NrczogYmxvY2tseVhtbCA9IHdpbmRvdy5YbWwudGV4dFRvRG9tKGJsb2NrbHlYbWxUZXh0KSAmIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZSh3aW5kb3cuQmxvY2tseS5tYWluV29ya3NwYWNlLCBibG9ja2x5WG1sKVxuICAgICAgcmV0dXJuIHtibG9ja2x5WG1sOiBibG9ja2x5WG1sLm91dGVySFRNTCwganNDb2RlOiBqc0NvZGV9XG4gICAgfVxuXG4gICAgX29uU2F2ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmRpc3BsYXkodGhpcy5fbmFtZUZvcm0udmlldygpKVxuICAgIH1cblxuICAgIF9zYXZlTW9kZWwoZGF0YSkge1xuICAgICAgZGF0YS5zdHVkZW50SWQgPSBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpO1xuICAgICAgZGF0YS5tb2RlbFR5cGUgPSB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpO1xuICAgICAgZGF0YS5sYWIgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpO1xuICAgICAgY29uc29sZS5sb2coJ19zYXZlTW9kZWwnKVxuICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgIGxldCBzYXZlT3JVcGRhdGU7XG4gICAgICBpZiAodGhpcy5fbGFzdFNpbVNhdmVkKSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHt0aGlzLl9sYXN0U2ltU2F2ZWQuaWR9YCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BBVENIJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICAgICAgICBzaW11bGF0ZWQ6IGRhdGEuc2ltdWxhdGVkXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2F2ZU9yVXBkYXRlID0gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXVnbGVuYU1vZGVscycsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gc2F2ZU9yVXBkYXRlLnRoZW4oKHNlcnZlckRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuc2ltdWxhdGVkKSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gc2VydmVyRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2VydmVyRGF0YSkgcmV0dXJuO1xuICAgICAgICByZXR1cm4gc2VydmVyRGF0YTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmFtZVN1Ym1pdChldnQpIHtcbiAgICAgIGxldCBtb2RlbDtcblxuICAgICAgdmFyIGJsb2NrbHlEYXRhID0gbnVsbDtcbiAgICAgIHZhciBzZW5zb3JDb25maWdKU09OID0gbnVsbDtcblxuICAgICAgLy8gaWYgdGhlIGFjdGl2ZSB0YWIgaXMgJ2Jsb2NrbHknLCB0aGVuIHdlIGhhdmUgdG8gY29tcGlsZSBhbmQgZXh0cmFjdCB0aGUgYmxvY2tseSBjb2RlLlxuICAgICAgaWYgKHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gdGhpcy5fZXh0cmFjdEJsb2NrbHkoKTtcbiAgICAgICAgc2Vuc29yQ29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KHRoaXMuYm9keUNvbmZpZ3VyYXRpb25zLmdldEFjdGl2ZVNlbnNvckNvbmZpZ3VyYXRpb24oKSk7XG4gICAgICAgIGJsb2NrbHlEYXRhID0gJC5leHRlbmQoYmxvY2tseURhdGEse3NlbnNvckNvbmZpZ0pTT046IHNlbnNvckNvbmZpZ0pTT059KVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9uYW1lRm9ybS52YWxpZGF0ZSgpLnRoZW4oKHZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NhdmVNb2RlbCgkLmV4dGVuZChibG9ja2x5RGF0YSx7XG4gICAgICAgICAgbmFtZTogdGhpcy5fbmFtZUZvcm0uZXhwb3J0KCkubmFtZSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiB0aGlzLl9mb3JtLmV4cG9ydCgpLFxuICAgICAgICAgIHNpbXVsYXRlZDogZmFsc2VcbiAgICAgICAgfSkpXG4gICAgICB9KS50aGVuKChtb2RlbCkgPT4ge1xuICAgICAgICB0aGlzLl9sYXN0U2ltU2F2ZWQgPSBudWxsO1xuICAgICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9uYW1lRm9ybS5jbGVhcigpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zaWxlbmNlTG9hZExvZ3MgPSB0cnVlO1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVwZGF0ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgIG1vZGVsX2hpc3RvcnlfaWQ6IG1vZGVsLmlkXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzYXZlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBibG9ja2x5RGF0YSA/ICQuZXh0ZW5kKHRoaXMuX2Zvcm0uZXhwb3J0KCksIHtzZW5zb3JDb25maWdKU09OOiBzZW5zb3JDb25maWdKU09OLCBqc0NvZGU6IGJsb2NrbHlEYXRhLmpzQ29kZX0pIDogdGhpcy5fZm9ybS5leHBvcnQoKSAsXG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWVGb3JtLmV4cG9ydCgpLm5hbWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OYW1lQ2FuY2VsKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5oaWRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9vbkFnZ3JlZ2F0ZVJlcXVlc3QoZXZ0KSB7XG4gICAgICBFdWdVdGlscy5nZXRNb2RlbFJlc3VsdHMoR2xvYmFscy5nZXQoJ2N1cnJlbnRFeHBlcmltZW50LmlkJyksIHRoaXMuX2N1cnJlbnRNb2RlbCkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdBZ2dyZWdhdGVEYXRhLkFkZFJlcXVlc3QnLCB7XG4gICAgICAgICAgZGF0YTogcmVzdWx0c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcImFnZ3JlZ2F0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxJZDogdGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTmV3UmVxdWVzdChldnQpIHtcbiAgICAgIHRoaXMuX29uQ29uZmlnQ2hhbmdlKGV2dCk7XG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoeyBtb2RlbF9oaXN0b3J5X2lkOiAnX25ldycgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3NldE1vZGVsTW9kYWxpdHkoKSB7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpKSB7XG4gICAgICAgIHN3aXRjaChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcIm9ic2VydmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5oaWRlRmllbGRzKCk7XG4gICAgICAgICAgICAgIHRoaXMuX2hpc3RvcnkuaGlkZUZpZWxkcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXhwbG9yZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmRpc2FibGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgdGhpcy5faGlzdG9yeS5kaXNhYmxlRmllbGRzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgTW9kZWxUYWIuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsVGFiKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcmV0dXJuIE1vZGVsVGFiO1xuXG59KVxuIl19
