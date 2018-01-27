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
      EugUtils = require('euglena/utils');

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

        // In here, change the toolbox according to which body_configuration has been selected.
        //evt.data.field._model._data.id == 'body_configuration'
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

        var saveData = {
          name: "(simulation)",
          simulated: true,
          configuration: conf

          // if the active tab is 'blockly', then we have to compile and extract the blockly code.
        };if (this._model.get('modelType') == 'blockly') {
          blocklyData = this._extractBlockly();
          saveData = $.extend(saveData, blocklyData);
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
            configuration: blocklyData ? $.extend(conf, { jsCode: blocklyData.jsCode }) : conf
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

        console.log(jsCode);

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

        // if the active tab is 'blockly', then we have to compile and extract the blockly code.
        if (this._model.get('modelType') == 'blockly') {
          blocklyData = this._extractBlockly();
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
            configuration: blocklyData ? $.extend(this._form.export(), { jsCode: blocklyData.jsCode }) : this._form.export(),
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIiQiLCJHbG9iYWxzIiwiVXRpbHMiLCJITSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIk1vZGVsSGlzdG9yeUZvcm0iLCJNb2RlbEZvcm0iLCJOYW1lRm9ybSIsIkV1Z1V0aWxzIiwiTW9kZWxUYWIiLCJzZXR0aW5ncyIsIm1vZGVsQ2xhc3MiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsIl9oaXN0b3J5IiwiY3JlYXRlIiwiaWQiLCJfbW9kZWwiLCJnZXQiLCJtb2RlbFR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZSIsIl9zaWxlbmNlTG9hZExvZ3MiLCJfZm9ybSIsImZpZWxkQ29uZmlnIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwiX29uQ29uZmlnQ2hhbmdlIiwidmlldyIsIl9vblNpbXVsYXRlUmVxdWVzdCIsIl9vblNhdmVSZXF1ZXN0IiwiX29uQWdncmVnYXRlUmVxdWVzdCIsIl9vbk5ld1JlcXVlc3QiLCJfbmFtZUZvcm0iLCJfb25OYW1lU3VibWl0IiwiX29uTmFtZUNhbmNlbCIsImFkZENoaWxkIiwiX3NldE1vZGVsTW9kYWxpdHkiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uUGhhc2VDaGFuZ2UiLCJfY3Vyck1vZGVsSWQiLCJfY3VycmVudE1vZGVsIiwiaGlzdG9yeUNvdW50IiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ1cGRhdGUiLCJ0aGVuIiwiaGlzdCIsImdldEhpc3RvcnkiLCJsZW5ndGgiLCJpbXBvcnQiLCJtb2RlbF9oaXN0b3J5X2lkIiwic2V0U3RhdGUiLCJfbG9hZE1vZGVsSW5Gb3JtIiwiZXhwb3J0IiwibmFtZSIsIl9kYXRhIiwiY3VycmVudFRhcmdldCIsIl9sYXN0U2ltU2F2ZWQiLCJvbGRJZCIsInRhcmdldCIsInByb21pc2VBamF4IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRpc3BhdGNoRXZlbnQiLCJibG9ja2x5WG1sIiwiY29uZmlndXJhdGlvbiIsIm1vZGVsIiwidGFiSWQiLCJzaW11bGF0ZWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImJsb2NrbHlEYXRhIiwic2F2ZURhdGEiLCJfZXh0cmFjdEJsb2NrbHkiLCJleHRlbmQiLCJfc2F2ZU1vZGVsIiwianNDb2RlIiwid2luZG93IiwiQmxvY2tseSIsIlhtbCIsIndvcmtzcGFjZVRvRG9tIiwiZ2V0TWFpbldvcmtzcGFjZSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiY2hpbGROb2RlcyIsIm1hcCIsImNoaWxkTm9kZSIsInRhZ05hbWUiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVDaGlsZCIsImJsb2NrcyIsIm1haW5Xb3Jrc3BhY2UiLCJnZXRUb3BCbG9ja3MiLCJmb3VuZE1haW5CbG9jayIsImIiLCJKYXZhU2NyaXB0IiwiYmxvY2tUb0NvZGUiLCJhbGVydCIsImNvbnNvbGUiLCJvdXRlckhUTUwiLCJkaXNwbGF5Iiwic3R1ZGVudElkIiwibGFiIiwic2F2ZU9yVXBkYXRlIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnRlbnRUeXBlIiwic2VydmVyRGF0YSIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsImhpZGUiLCJjbGVhciIsImdldE1vZGVsUmVzdWx0cyIsInJlc3VsdHMiLCJwaGFzZSIsInRvTG93ZXJDYXNlIiwiaGlkZUZpZWxkcyIsImRpc2FibGVGaWVsZHMiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsSUFBSUQsUUFBUSxRQUFSLENBQVY7O0FBRUEsTUFBTUUsVUFBVUYsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VHLFFBQVFILFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVJLEtBQUtKLFFBQVEseUJBQVIsQ0FGUDs7QUFJ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QUwsQ0FBY3dDLE1BQWQsR0FBdUJIO0FBRDVCO0FBSGtCLFNBQTFCO0FBT0Q7QUE5VmU7QUFBQTtBQUFBLG9DQWdXRlQsR0FoV0UsRUFnV0c7QUFDakIsYUFBS2hCLGVBQUwsQ0FBcUJnQixHQUFyQjtBQUNEO0FBbFdlO0FBQUE7QUFBQSxxQ0FvV0RBLEdBcFdDLEVBb1dJO0FBQ2xCLFlBQUlBLElBQUlDLElBQUosQ0FBUzhFLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkIvRSxJQUFJQyxJQUFKLENBQVM4RSxLQUFULElBQWtCLGlCQUFuRCxFQUFzRTtBQUNwRSxlQUFLM0csUUFBTCxDQUFjb0MsTUFBZCxDQUFxQixFQUFFQyxrQkFBa0IsTUFBcEIsRUFBckI7QUFDRDtBQUNGO0FBeFdlO0FBQUE7QUFBQSwwQ0EwV0k7QUFDbEIsWUFBSXBELFFBQVFtQixHQUFSLENBQVksZ0NBQVosQ0FBSixFQUFtRDtBQUNqRCxrQkFBT25CLFFBQVFtQixHQUFSLENBQVksZ0NBQVosRUFBOEN3RyxXQUE5QyxFQUFQO0FBQ0ksaUJBQUssU0FBTDtBQUNFLG1CQUFLbkcsS0FBTCxDQUFXb0csVUFBWDtBQUNBLG1CQUFLN0csUUFBTCxDQUFjNkcsVUFBZDtBQUNGO0FBQ0EsaUJBQUssU0FBTDtBQUNFLG1CQUFLcEcsS0FBTCxDQUFXcUcsYUFBWDtBQUNBLG1CQUFLOUcsUUFBTCxDQUFjOEcsYUFBZDtBQUNGO0FBUko7QUFVRDtBQUNGO0FBdlhlOztBQUFBO0FBQUEsSUFnQksxSCxTQWhCTDs7QUEyWGxCTyxXQUFTTSxNQUFULEdBQWtCLFVBQUM0QixJQUFELEVBQVU7QUFDMUIsV0FBTyxJQUFJbEMsUUFBSixDQUFhLEVBQUVvSCxXQUFXbEYsSUFBYixFQUFiLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9sQyxRQUFQO0FBRUQsQ0FqWUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvdGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcblxuICAgIE1vZGVsSGlzdG9yeUZvcm0gPSByZXF1aXJlKCcuLi9oaXN0b3J5L2Zvcm0nKSxcbiAgICBNb2RlbEZvcm0gPSByZXF1aXJlKCcuLi9mb3JtL2Zvcm0nKSxcbiAgICBOYW1lRm9ybSA9IHJlcXVpcmUoJy4uL25hbWVmb3JtL2Zvcm0nKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKTtcblxuICBjbGFzcyBNb2RlbFRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vblNpbXVsYXRlUmVxdWVzdCcsICdfb25TYXZlUmVxdWVzdCcsICdfb25BZ2dyZWdhdGVSZXF1ZXN0JyxcbiAgICAgICAgJ19vbk5hbWVDYW5jZWwnLCAnX29uTmFtZVN1Ym1pdCcsICdfb25HbG9iYWxzQ2hhbmdlJywgJ19sb2FkTW9kZWxJbkZvcm0nLFxuICAgICAgICAnX29uSGlzdG9yeVNlbGVjdGlvbkNoYW5nZScsICdfb25Db25maWdDaGFuZ2UnLCAnX29uTmV3UmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZSdcbiAgICAgIF0pO1xuXG4gICAgICB0aGlzLl9oaXN0b3J5ID0gTW9kZWxIaXN0b3J5Rm9ybS5jcmVhdGUoe1xuICAgICAgICBpZDogYG1vZGVsX2hpc3RvcnlfXyR7dGhpcy5fbW9kZWwuZ2V0KFwiaWRcIil9YCxcbiAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2hpc3RvcnkuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQmxvY2tseS5DaGFuZ2VkJywgdGhpcy5fb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlKTtcbiAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IGZhbHNlO1xuXG4gICAgICB0aGlzLl9mb3JtID0gTW9kZWxGb3JtLmNyZWF0ZSh7XG4gICAgICAgIG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSxcbiAgICAgICAgZmllbGRDb25maWc6IHRoaXMuX21vZGVsLmdldCgncGFyYW1ldGVycycpLFxuICAgICAgICBldWdsZW5hQ291bnRDb25maWc6IHRoaXMuX21vZGVsLmdldCgnZXVnbGVuYUNvdW50JylcbiAgICAgIH0pXG4gICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQmxvY2tseS5DaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLlNpbXVsYXRlJywgdGhpcy5fb25TaW11bGF0ZVJlcXVlc3QpO1xuICAgICAgdGhpcy5fZm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxGb3JtLlNhdmUnLCB0aGlzLl9vblNhdmVSZXF1ZXN0KTtcbiAgICAgIHRoaXMuX2Zvcm0udmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsRm9ybS5BZGRUb0FnZ3JlZ2F0ZScsIHRoaXMuX29uQWdncmVnYXRlUmVxdWVzdCk7XG4gICAgICB0aGlzLl9mb3JtLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbEZvcm0uTmV3UmVxdWVzdCcsIHRoaXMuX29uTmV3UmVxdWVzdCk7XG5cbiAgICAgIHRoaXMuX25hbWVGb3JtID0gTmFtZUZvcm0uY3JlYXRlKCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLlN1Ym1pdCcsIHRoaXMuX29uTmFtZVN1Ym1pdCk7XG4gICAgICB0aGlzLl9uYW1lRm9ybS52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxTYXZlLkNhbmNlbCcsIHRoaXMuX29uTmFtZUNhbmNlbCk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9oaXN0b3J5LnZpZXcoKSk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRDaGlsZCh0aGlzLl9mb3JtLnZpZXcoKSk7XG5cbiAgICAgIHRoaXMuX3NldE1vZGVsTW9kYWxpdHkoKTtcblxuICAgICAgR2xvYmFscy5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkdsb2JhbHNDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsSWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3Vyck1vZGVsSWQ7XG4gICAgfVxuXG4gICAgY3Vyck1vZGVsKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRNb2RlbDtcbiAgICB9XG5cbiAgICBjb2xvcigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2NvbG9yJylcbiAgICB9XG5cbiAgICBoaXN0b3J5Q291bnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5faGlzdG9yeS5oaXN0b3J5Q291bnQoKTtcbiAgICB9XG5cbiAgICBfb25HbG9iYWxzQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSAnc3R1ZGVudF9pZCc6XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS51cGRhdGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhpc3QgPSB0aGlzLl9oaXN0b3J5LmdldEhpc3RvcnkoKVxuICAgICAgICAgICAgaWYgKGhpc3QubGVuZ3RoICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKT09J2NyZWF0ZScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hpc3RvcnkuaW1wb3J0KHtcbiAgICAgICAgICAgICAgICBtb2RlbF9oaXN0b3J5X2lkOiBoaXN0W2hpc3QubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uc2V0U3RhdGUoJ25ldycpO1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRNb2RlbEluRm9ybSh0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWQpO1xuICAgICAgICAgIH0pXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkhpc3RvcnlTZWxlY3Rpb25DaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9sb2FkTW9kZWxJbkZvcm0oJ19uZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7IHRoaXMuX2xvYWRNb2RlbEluRm9ybShldnQuY3VycmVudFRhcmdldC5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkKTsgfVxuICAgIH1cblxuICAgIF9vbkNvbmZpZ0NoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ0Jsb2NrbHkuQ2hhbmdlZCcpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLm1vZGVsVHlwZSA9PSBldnQuZGF0YS5tb2RlbFR5cGUpIHtcbiAgICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAodGhpcy5faGlzdG9yeS5leHBvcnQoKS5tb2RlbF9oaXN0b3J5X2lkICE9ICdfbmV3Jykge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluIGhlcmUsIGNoYW5nZSB0aGUgdG9vbGJveCBhY2NvcmRpbmcgdG8gd2hpY2ggYm9keV9jb25maWd1cmF0aW9uIGhhcyBiZWVuIHNlbGVjdGVkLlxuICAgICAgLy9ldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWQgPT0gJ2JvZHlfY29uZmlndXJhdGlvbidcbiAgICB9XG5cbiAgICBfbG9hZE1vZGVsSW5Gb3JtKGlkKSB7XG4gICAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgICBsZXQgb2xkSWQgPSB0aGlzLl9jdXJyTW9kZWxJZDtcbiAgICAgIGxldCB0YXJnZXQgPSBpZCA9PSAnX25ldycgPyBudWxsIDogaWQ7XG4gICAgICBpZiAob2xkSWQgIT0gdGFyZ2V0KSB7XG4gICAgICAgIGlmIChpZCAhPSAnX25ldycpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyTW9kZWxJZCA9IGlkO1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHtpZH1gKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9mb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBkYXRhO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWwuX2RhdGEubW9kZWxUeXBlID09ICdibG9ja2x5Jykge1xuICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdCbG9ja2x5LkxvYWQnLCBkYXRhLmJsb2NrbHlYbWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9mb3JtLmltcG9ydChkYXRhLmNvbmZpZ3VyYXRpb24pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fb25Db25maWdDaGFuZ2UpXG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IGRhdGEsXG4gICAgICAgICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgICAgICB0aGlzLl9mb3JtLnNldFN0YXRlKCduZXcnKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnaGlzdG9yaWNhbCcpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2N1cnJNb2RlbElkID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TW9kZWwgPSBudWxsO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V1Z2xlbmFNb2RlbC5Mb2FkZWQnLCB7XG4gICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICBpZDogJ19uZXcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fZm9ybS5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9zaWxlbmNlTG9hZExvZ3MpIHtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICAgIHR5cGU6IFwibG9hZFwiLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbW9kZWxJZDogaWQsXG4gICAgICAgICAgICAgIHRhYjogdGhpcy5pZCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9sYXN0U2ltU2F2ZWQgJiYgdGhpcy5fbGFzdFNpbVNhdmVkLmlkID09IG9sZElkKSB7XG4gICAgICAgIC8vIGhhbmRsZSBcInJlcnVubmluZ1wiIGEgc2ltdWxhdGlvblxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFdWdsZW5hTW9kZWwuTG9hZGVkJywge1xuICAgICAgICAgIG1vZGVsOiB0aGlzLl9sYXN0U2ltU2F2ZWQsXG4gICAgICAgICAgdGFiSWQ6IHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vblNpbXVsYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIHZhciBjb25mID0gdGhpcy5fZm9ybS5leHBvcnQoKTtcbiAgICAgIHZhciBibG9ja2x5RGF0YSA9IG51bGw7XG5cbiAgICAgIHZhciBzYXZlRGF0YSA9IHtcbiAgICAgICAgbmFtZTogXCIoc2ltdWxhdGlvbilcIixcbiAgICAgICAgc2ltdWxhdGVkOiB0cnVlLFxuICAgICAgICBjb25maWd1cmF0aW9uOiBjb25mXG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHRoZSBhY3RpdmUgdGFiIGlzICdibG9ja2x5JywgdGhlbiB3ZSBoYXZlIHRvIGNvbXBpbGUgYW5kIGV4dHJhY3QgdGhlIGJsb2NrbHkgY29kZS5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICBibG9ja2x5RGF0YSA9IHRoaXMuX2V4dHJhY3RCbG9ja2x5KCk7XG4gICAgICAgIHNhdmVEYXRhID0gJC5leHRlbmQoc2F2ZURhdGEsYmxvY2tseURhdGEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zYXZlTW9kZWwoIHNhdmVEYXRhICkudGhlbigobW9kZWwpID0+IHtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbG9hZE1vZGVsSW5Gb3JtKG1vZGVsLmlkKTtcbiAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICB9KVxuXG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogXCJzaW11bGF0ZVwiLFxuICAgICAgICBjYXRlZ29yeTogXCJtb2RlbFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGJsb2NrbHlEYXRhID8gJC5leHRlbmQoY29uZiwge2pzQ29kZTogYmxvY2tseURhdGEuanNDb2RlfSkgOiBjb25mXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX2V4dHJhY3RCbG9ja2x5KCkge1xuICAgICAgLy8gZ2V0IHRoZSBCbG9ja2x5IGNvZGUgeG1sXG4gICAgICB2YXIgYmxvY2tseVhtbCA9IHdpbmRvdy5CbG9ja2x5LlhtbC53b3Jrc3BhY2VUb0RvbSh3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkpO1xuXG4gICAgICAvLyByZW1vdmUgYmxvY2tzIGZyb20gYmxvY2tseVhtbCB0aGF0IGFyZSBub3Qgd2l0aGluIHRoZSBtYWluIGJsb2NrXG4gICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChibG9ja2x5WG1sLmNoaWxkTm9kZXMpLm1hcCgoY2hpbGROb2RlKSA9PiB7XG4gICAgICAgIGlmIChjaGlsZE5vZGUudGFnTmFtZSA9PSAnQkxPQ0snICYmIGNoaWxkTm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSAhPSAnZXZlcnlfdGltZScpIHtcbiAgICAgICAgICBibG9ja2x5WG1sLnJlbW92ZUNoaWxkKGNoaWxkTm9kZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIGdlbmVyYXRlIHRoZSBqYXZhc2NyaXB0IGNvZGUgb2YgdGhlIG1haW4gYmxvY2tcbiAgICAgIHZhciBibG9ja3MgPSB3aW5kb3cuQmxvY2tseS5tYWluV29ya3NwYWNlLmdldFRvcEJsb2Nrcyh0cnVlKTtcbiAgICAgIHZhciBmb3VuZE1haW5CbG9jayA9IGZhbHNlO1xuICAgICAgdmFyIGpzQ29kZSA9ICcnO1xuICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCBibG9ja3MubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgaWYgKGJsb2Nrc1tiXS50eXBlID09ICdldmVyeV90aW1lJykge1xuICAgICAgICAgIGpzQ29kZSA9IHdpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuYmxvY2tUb0NvZGUoYmxvY2tzW2JdKVxuICAgICAgICAgIGZvdW5kTWFpbkJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kTWFpbkJsb2NrKSB7YWxlcnQoJ3RoZXJlIGlzIG5vIG1haW4gYmxvY2snKX1cblxuICAgICAgY29uc29sZS5sb2coanNDb2RlKVxuXG4gICAgICAvL3dpbmRvdy5CbG9ja2x5LkphdmFTY3JpcHQuYWRkUmVzZXJ2ZWRXb3JkcygnanNDb2RlJyk7XG4gICAgICAvL3ZhciBqc0NvZGUgPSB3aW5kb3cuQmxvY2tseS5KYXZhU2NyaXB0LndvcmtzcGFjZVRvQ29kZSggd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpICk7XG5cbiAgICAgIC8vIHJldHVybiB4bWwgYW5kIGpzQ29kZSBhcyBzdHJpbmdzIHdpdGhpbiBqcyBvYmplY3RcbiAgICAgIC8vIHN0cmluZ2lmeTogYmxvY2tseVhtbC5vdXRlckhUTUwgLy8gQWx0ZXJuYXRpdmVseTogYmxvY2tseVhtbFRleHQgPSB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9UZXh0KHhtbCkgKHByb2R1Y2VzIG1pbmltYWwsIHVnbHkgc3RyaW5nKVxuICAgICAgLy8geG1sLWlmeSB3aXRoIGpxdWVyeTogJC5wYXJzZVhNTChzdHJpbmcpLmRvY3VtZW50RWxlbWVudFxuICAgICAgLy8gQWx0ZXJuYXRpdmVseSBmb3IgcmVjcmVhdGluZyBibG9ja3M6IGJsb2NrbHlYbWwgPSB3aW5kb3cuWG1sLnRleHRUb0RvbShibG9ja2x5WG1sVGV4dCkgJiB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2Uod2luZG93LkJsb2NrbHkubWFpbldvcmtzcGFjZSwgYmxvY2tseVhtbClcbiAgICAgIHJldHVybiB7YmxvY2tseVhtbDogYmxvY2tseVhtbC5vdXRlckhUTUwsIGpzQ29kZToganNDb2RlfVxuICAgIH1cblxuICAgIF9vblNhdmVSZXF1ZXN0KGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ0ludGVyYWN0aXZlTW9kYWwnKS5kaXNwbGF5KHRoaXMuX25hbWVGb3JtLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfc2F2ZU1vZGVsKGRhdGEpIHtcbiAgICAgIGRhdGEuc3R1ZGVudElkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGRhdGEubW9kZWxUeXBlID0gdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKTtcbiAgICAgIGRhdGEubGFiID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKTtcbiAgICAgIGNvbnNvbGUubG9nKCdfc2F2ZU1vZGVsJylcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICBsZXQgc2F2ZU9yVXBkYXRlO1xuICAgICAgaWYgKHRoaXMuX2xhc3RTaW1TYXZlZCkge1xuICAgICAgICBzYXZlT3JVcGRhdGUgPSBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9FdWdsZW5hTW9kZWxzLyR7dGhpcy5fbGFzdFNpbVNhdmVkLmlkfWAsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgICAgICAgc2ltdWxhdGVkOiBkYXRhLnNpbXVsYXRlZFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNhdmVPclVwZGF0ZSA9IFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V1Z2xlbmFNb2RlbHMnLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNhdmVPclVwZGF0ZS50aGVuKChzZXJ2ZXJEYXRhKSA9PiB7XG4gICAgICAgIGlmIChkYXRhLnNpbXVsYXRlZCkge1xuICAgICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IHNlcnZlckRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNpbVNhdmVkID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNlcnZlckRhdGEpIHJldHVybjtcbiAgICAgICAgcmV0dXJuIHNlcnZlckRhdGE7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVTdWJtaXQoZXZ0KSB7XG4gICAgICBsZXQgbW9kZWw7XG5cbiAgICAgIHZhciBibG9ja2x5RGF0YSA9IG51bGw7XG5cbiAgICAgIC8vIGlmIHRoZSBhY3RpdmUgdGFiIGlzICdibG9ja2x5JywgdGhlbiB3ZSBoYXZlIHRvIGNvbXBpbGUgYW5kIGV4dHJhY3QgdGhlIGJsb2NrbHkgY29kZS5cbiAgICAgIGlmICh0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpID09ICdibG9ja2x5Jykge1xuICAgICAgICBibG9ja2x5RGF0YSA9IHRoaXMuX2V4dHJhY3RCbG9ja2x5KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX25hbWVGb3JtLnZhbGlkYXRlKCkudGhlbigodmFsaWRhdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2F2ZU1vZGVsKCQuZXh0ZW5kKGJsb2NrbHlEYXRhLHtcbiAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lRm9ybS5leHBvcnQoKS5uYW1lLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRoaXMuX2Zvcm0uZXhwb3J0KCksXG4gICAgICAgICAgc2ltdWxhdGVkOiBmYWxzZVxuICAgICAgICB9KSlcbiAgICAgIH0pLnRoZW4oKG1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuX2xhc3RTaW1TYXZlZCA9IG51bGw7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdJbnRlcmFjdGl2ZU1vZGFsJykuaGlkZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX25hbWVGb3JtLmNsZWFyKClcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3NpbGVuY2VMb2FkTG9ncyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudXBkYXRlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2lsZW5jZUxvYWRMb2dzID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5faGlzdG9yeS5pbXBvcnQoe1xuICAgICAgICAgICAgbW9kZWxfaGlzdG9yeV9pZDogbW9kZWwuaWRcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiBcInNhdmVcIixcbiAgICAgICAgY2F0ZWdvcnk6IFwibW9kZWxcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGJsb2NrbHlEYXRhID8gJC5leHRlbmQodGhpcy5fZm9ybS5leHBvcnQoKSwge2pzQ29kZTogYmxvY2tseURhdGEuanNDb2RlfSkgOiB0aGlzLl9mb3JtLmV4cG9ydCgpICxcbiAgICAgICAgICBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJyksXG4gICAgICAgICAgbmFtZTogdGhpcy5fbmFtZUZvcm0uZXhwb3J0KCkubmFtZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5hbWVDYW5jZWwoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnSW50ZXJhY3RpdmVNb2RhbCcpLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fbmFtZUZvcm0uY2xlYXIoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgX29uQWdncmVnYXRlUmVxdWVzdChldnQpIHtcbiAgICAgIEV1Z1V0aWxzLmdldE1vZGVsUmVzdWx0cyhHbG9iYWxzLmdldCgnY3VycmVudEV4cGVyaW1lbnQuaWQnKSwgdGhpcy5fY3VycmVudE1vZGVsKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuQWRkUmVxdWVzdCcsIHtcbiAgICAgICAgICBkYXRhOiByZXN1bHRzXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6IFwiYWdncmVnYXRlXCIsXG4gICAgICAgIGNhdGVnb3J5OiBcIm1vZGVsXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBtb2RlbElkOiB0aGlzLl9oaXN0b3J5LmV4cG9ydCgpLm1vZGVsX2hpc3RvcnlfaWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25OZXdSZXF1ZXN0KGV2dCkge1xuICAgICAgdGhpcy5fb25Db25maWdDaGFuZ2UoZXZ0KTtcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LmltcG9ydCh7IG1vZGVsX2hpc3RvcnlfaWQ6ICdfbmV3JyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfc2V0TW9kZWxNb2RhbGl0eSgpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykpIHtcbiAgICAgICAgc3dpdGNoKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9mb3JtLmhpZGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgdGhpcy5faGlzdG9yeS5oaWRlRmllbGRzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX2Zvcm0uZGlzYWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICB0aGlzLl9oaXN0b3J5LmRpc2FibGVGaWVsZHMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICBNb2RlbFRhYi5jcmVhdGUgPSAoZGF0YSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxUYWIoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gTW9kZWxUYWI7XG5cbn0pXG4iXX0=
