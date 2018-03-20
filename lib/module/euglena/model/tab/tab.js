define((require) => {
  const $ = require('jquery');

  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils'),
    HM = require('core/event/hook_manager');

  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view'),

    ModelHistoryForm = require('../history/form'),
    ModelForm = require('../form/form'),
    NameForm = require('../nameform/form'),
    EugUtils = require('euglena/utils'),
    BodyConfigurations = require('euglena/model_blockly/bodyConfigurations/bodyconfigs/bodyconfigs');

  class ModelTab extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, [
        '_onSimulateRequest', '_onSaveRequest', '_onAggregateRequest',
        '_onNameCancel', '_onNameSubmit', '_onGlobalsChange', '_loadModelInForm',
        '_onHistorySelectionChange', '_onConfigChange', '_onNewRequest', '_onPhaseChange',
        '_onDisableRequest','_onEnableRequest'
      ]);

      this._history = ModelHistoryForm.create({
        id: `model_history__${this._model.get("id")}`,
        modelType: this._model.get('modelType')
      });
      this._history.addEventListener('Form.FieldChanged', this._onHistorySelectionChange);
      Globals.get('Relay').addEventListener('Blockly.Changed', this._onHistorySelectionChange);
      this._silenceLoadLogs = false;

      this._form = ModelForm.create({
        modelType: this._model.get('modelType'),
        fieldConfig: this._model.get('parameters'),
        euglenaCountConfig: this._model.get('euglenaCount'),
        euglenaInitConfig: this._model.get('euglenaInit')
      })
      this._form.addEventListener('Form.FieldChanged', this._onConfigChange);
      Globals.get('Relay').addEventListener('Blockly.Changed', this._onConfigChange);
      this._form.view().addEventListener('ModelForm.Simulate', this._onSimulateRequest);
      this._form.view().addEventListener('ModelForm.Save', this._onSaveRequest);
      this._form.view().addEventListener('ModelForm.AddToAggregate', this._onAggregateRequest);
      this._form.view().addEventListener('ModelForm.NewRequest', this._onNewRequest);

      // Insert a title of the tab
      var titleNode = document.createElement('h2');
      titleNode.className = 'tab__model__title'
      titleNode.innerHTML = Globals.get('AppConfig.model.modelName') ? Globals.get('AppConfig.model.modelName') : 'Model of the Body';

      this.view().$dom().append(titleNode)

      this._nameForm = NameForm.create();
      this._nameForm.view().addEventListener('ModelSave.Submit', this._onNameSubmit);
      this._nameForm.view().addEventListener('ModelSave.Cancel', this._onNameCancel);
      this.view().addChild(this._history.view());

      if (this._model.get('modelType') == 'blockly') {
        // Create body configuration model instance.
        var initialBody = this._form.export();
        var paramOptions = {}
        paramOptions['reaction'] = Object.keys(this._model.get('parameters').K.options)
        paramOptions['motor'] = Object.keys(this._model.get('parameters').v.options)
        if (this._model.get('parameters').omega) {
          paramOptions['roll'] = Object.keys(this._model.get('parameters').omega.options)
        } else if (this._model.get('parameters').motion) {
          paramOptions['motion'] = Object.keys(this._model.get('parameters').motion.options)
        }
        this.bodyConfigurations = BodyConfigurations.create({initialConfig: initialBody, paramOptions: paramOptions, modelRepresentation: this._model.get('parameters').modelRepresentation})

        // add view of the model instance to this.view()
        this._form.view().addChild(this.bodyConfigurations.view(),null,0);
      }

      this.view().addChild(this._form.view());

      this._setModelRepresentation();

      Globals.addEventListener('Model.Change', this._onGlobalsChange);
      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)

      Globals.get('Relay').addEventListener('Notifications.Add',this._onDisableRequest);
      Globals.get('Relay').addEventListener('Notifications.Remove',this._onEnableRequest);
    }

    id() {
      return this._model.get('id');
    }

    currModelId() {
      return this._currModelId;
    }

    currModel() {
      return this._currentModel;
    }

    color() {
      return this._model.get('color')
    }

    historyCount() {
      return this._history.historyCount();
    }

    _onGlobalsChange(evt) {
      switch(evt.data.path) {
        case 'student_id':
          this._history.update().then(() => {
            const hist = this._history.getHistory()
            if (hist.length) {
              return this._history.import({
                model_history_id: hist[hist.length - 1]
              })
            } else {
              this._form.setState('new');
              return true;
            }
          }).then(() => {
            this._loadModelInForm(this._history.export().model_history_id);
          })
        break;
      }
    }

    _onHistorySelectionChange(evt) {
      if (evt.name === 'Blockly.Changed') {
        if (this._model._data.modelType == evt.data.modelType) {
          this._loadModelInForm('_new');
        }
      }
      else { this._loadModelInForm(evt.currentTarget.export().model_history_id); }
    }

    _onConfigChange(evt) {
      this._lastSimSaved = null;
      if (evt.name === 'Blockly.Changed') {
        if (this._model._data.modelType == evt.data.modelType) {
          this._history.import({ model_history_id: '_new' });
          this._form.setState('new');
        }
      }
      else {
        this._history.import({ model_history_id: '_new' });
        this._form.setState('new');
      }

      // In here, change the image and the toolbox according to which bodyConfiguration (sensorConfig, motor, react, roll, motion type) has been selected.
      if (evt.name === 'Form.FieldChanged') {
        if (evt.data.field._model._data.id === 'opacity') {
          this.bodyConfigurations.setBodyOpacity(evt.data.delta.value)
        }

        else if (evt.currentTarget._model._data.modelType == 'blockly'){
          this.bodyConfigurations.setActiveConfiguration(evt.data.delta.value);
        }
      }
    }

    _loadModelInForm(id) {
      if (!id) return;
      let oldId = this._currModelId;
      let target = id == '_new' ? null : id;
      if (oldId != target) {
        if (id != '_new') {
          this._currModelId = id;
          Utils.promiseAjax(`/api/v1/EuglenaModels/${id}`).then((data) => {
            this._form.removeEventListener('Form.FieldChanged', this._onConfigChange)
            this._currentModel = data;

            if (this._model._data.modelType == 'blockly') {
              Globals.get('Relay').dispatchEvent('Blockly.Load', data.blocklyXml);
              for (let idx = Object.keys(data.configuration).length - 1; idx >= 0; idx--) {
                if (!(Object.keys(data.configuration)[idx].match("_|count"))) {
                  let elemName = Object.keys(data.configuration)[idx]
                  this.bodyConfigurations.setActiveConfiguration(data.configuration[elemName]);
                }
              }
            }

            this._form.import(data.configuration).then(() => {
              this._form.addEventListener('Form.FieldChanged', this._onConfigChange)
              Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
                model: data,
                tabId: this._model.get('id')
              })
            })
            if (data.simulated) {
              this._form.setState('new')
            } else {
              this._form.setState('historical')
            }

          })
        } else {
          this._currModelId = null;
          this._currentModel = null;
          Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
            model: {
              id: '_new'
            },
            tabId: this._model.get('id')
          })
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
          })
        }
      } else if (this._lastSimSaved && this._lastSimSaved.id == oldId) {
        // handle "rerunning" a simulation
        Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
          model: this._lastSimSaved,
          tabId: this._model.get('id')
        })
      }
    }

    _onSimulateRequest(evt) {
      var conf = this._form.export();
      var blocklyData = null;
      var sensorConfigJSON = null;

      var saveData = {
        name: "(simulation)",
        simulated: true,
        configuration: conf
      }

      // if the active tab is 'blockly', then we have to compile and extract the blockly code.
      if (this._model.get('modelType') == 'blockly') {
        blocklyData = this._extractBlockly();
        saveData = $.extend(saveData,blocklyData);
        sensorConfigJSON = JSON.stringify(this.bodyConfigurations.getActiveSensorConfiguration());
        saveData = $.extend(saveData,{sensorConfigJSON: sensorConfigJSON})
      }

      this._saveModel( saveData ).then((model) => {
        this._silenceLoadLogs = true;
        this._loadModelInForm(model.id);
        this._silenceLoadLogs = false;
      })

      Globals.get('Logger').log({
        type: "simulate",
        category: "model",
        data: {
          modelType: this._model.get('modelType'),
          configuration: blocklyData ? $.extend(conf, {jsCode: blocklyData.jsCode, sensorConfigJSON: sensorConfigJSON}) : conf
        }
      })
    }

    _extractBlockly() {
      // get the Blockly code xml
      var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());

      // remove blocks from blocklyXml that are not within the main block
      Array.prototype.slice.call(blocklyXml.childNodes).map((childNode) => {
        if (childNode.tagName == 'BLOCK' && childNode.getAttribute('type') != 'master_block') {
          blocklyXml.removeChild(childNode)
        }
      });

      // generate the javascript code of the main block
      var blocks = window.Blockly.mainWorkspace.getTopBlocks(true);
      var foundMainBlock = false;
      var jsCode = '';
      for (var b = 0; b < blocks.length; b++) {
        if (blocks[b].type == 'master_block') {
          jsCode = window.Blockly.JavaScript.blockToCode(blocks[b])
          foundMainBlock = true;
          break;
        }
      }

      if (!foundMainBlock) {alert('there is no main block')}

      //window.Blockly.JavaScript.addReservedWords('jsCode');
      //var jsCode = window.Blockly.JavaScript.workspaceToCode( window.Blockly.getMainWorkspace() );

      // return xml and jsCode as strings within js object
      // stringify: blocklyXml.outerHTML // Alternatively: blocklyXmlText = window.Blockly.Xml.domToText(xml) (produces minimal, ugly string)
      // xml-ify with jquery: $.parseXML(string).documentElement
      // Alternatively for recreating blocks: blocklyXml = window.Xml.textToDom(blocklyXmlText) & window.Blockly.Xml.domToWorkspace(window.Blockly.mainWorkspace, blocklyXml)
      return {blocklyXml: blocklyXml.outerHTML, jsCode: jsCode}
    }

    _onSaveRequest(evt) {
      Globals.get('InteractiveModal').display(this._nameForm.view())
    }

    _saveModel(data) {
      data.studentId = Globals.get('student_id');
      data.modelType = this._model.get('modelType');
      data.lab = Globals.get('AppConfig.lab');
      let saveOrUpdate;
      if (this._lastSimSaved) {
        saveOrUpdate = Utils.promiseAjax(`/api/v1/EuglenaModels/${this._lastSimSaved.id}`, {
          method: 'PATCH',
          data: JSON.stringify({
            name: data.name,
            simulated: data.simulated
          }),
          contentType: 'application/json'
        })
      } else {
        saveOrUpdate = Utils.promiseAjax('/api/v1/EuglenaModels', {
          method: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json'
        })
      }
      return saveOrUpdate.then((serverData) => {
        if (data.simulated) {
          this._lastSimSaved = serverData;
        } else {
          this._lastSimSaved = null;
        }
        if (!serverData) return;
        return serverData;
      })
    }

    _onNameSubmit(evt) {
      let model;

      var blocklyData = null;
      var sensorConfigJSON = null;

      // if the active tab is 'blockly', then we have to compile and extract the blockly code.
      if (this._model.get('modelType') == 'blockly') {
        blocklyData = this._extractBlockly();
        sensorConfigJSON = JSON.stringify(this.bodyConfigurations.getActiveSensorConfiguration());
        blocklyData = $.extend(blocklyData,{sensorConfigJSON: sensorConfigJSON})
      }

      this._nameForm.validate().then((validation) => {
        return this._saveModel($.extend(blocklyData,{
          name: this._nameForm.export().name,
          configuration: this._form.export(),
          simulated: false
        }))
      }).then((model) => {
        this._lastSimSaved = null;
        Globals.get('InteractiveModal').hide().then(() => {
          this._nameForm.clear()
        });
        this._silenceLoadLogs = true;
        this._history.update().then(() => {
          this._silenceLoadLogs = false;
          this._history.import({
            model_history_id: model.id
          })
        })
      })
      Globals.get('Logger').log({
        type: "save",
        category: "model",
        data: {
          configuration: blocklyData ? $.extend(this._form.export(), {sensorConfigJSON: sensorConfigJSON, jsCode: blocklyData.jsCode}) : this._form.export() ,
          modelType: this._model.get('modelType'),
          name: this._nameForm.export().name
        }
      })
    }

    _onNameCancel(evt) {
      Globals.get('InteractiveModal').hide().then(() => {
        this._nameForm.clear()
      });
    }

    _onAggregateRequest(evt) {
      EugUtils.getModelResults(Globals.get('currentExperiment.id'), this._currentModel).then((results) => {
        Globals.get('Relay').dispatchEvent('AggregateData.AddRequest', {
          data: results
        })
      })
      Globals.get('Logger').log({
        type: "aggregate",
        category: "model",
        data: {
          modelId: this._history.export().model_history_id
        }
      })
    }

    _onDisableRequest(evt) {
      if (Globals.get('AppConfig.system.modelModality')) {
        switch(Globals.get('AppConfig.system.modelModality').toLowerCase()) {
          case "create":
            this._form.disable();
            this._history.disable();
          break;
          case "explore":
            this._form.disable();
            this._history.enable();
          break;
        }
      }
    }

    _onEnableRequest(evt) {
      if (Globals.get('AppConfig.system.modelModality')) {
        switch(Globals.get('AppConfig.system.modelModality').toLowerCase()) {
          case "create":
            this._form.enable();
            this._history.enable();
          break;
          case "explore":
            this._form.enable();
            this._form.partiallyDisableFields(['count','initialization']);
            this._history.enable();
          break;
        }
      }
    }

    _onNewRequest(evt) {
      this._onConfigChange(evt);
    }

    _onPhaseChange(evt) {
      if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
        this._history.import({ model_history_id: '_new' });
      }
    }

    _setModelRepresentation() {
      if (Globals.get('AppConfig.system.modelModality')) {
        switch(Globals.get('AppConfig.system.modelModality').toLowerCase()) {
            case "observe":
              this._form.hideFields();
              this._history.hideFields();
            break;
            case "explore":
              this._form.disableFields();
              this._history.enable();
            break;
        }
      }
    }

  }

  ModelTab.create = (data) => {
    return new ModelTab({ modelData: data });
  }

  return ModelTab;

})
