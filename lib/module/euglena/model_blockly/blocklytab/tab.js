define((require) => {
  const Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager');

  const Component = require('core/component/component'),
    Model = require('./model'),
    View = require('./view');

  class ModelingDataTab extends Component {
    constructor(settings = {}) {
      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      super(settings);
      Utils.bindMethods(this, ['_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest', '_onPhaseChange', 'toggleBlocklyEvent', '_onBlocklyLoad', '_listenBlocklyEvents','_onDisableRequest','_onEnableRequest'])

      Globals.set('blocklyLoaded',false);

      Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', this._onToggleRequest)
      Globals.get('Relay').addEventListener('Tab.Change', this._onToggleRequest)

      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
      Globals.get('Relay').addEventListener('Blockly.Load', this._onBlocklyLoad)

      Globals.get('Relay').addEventListener('Notifications.Remove',this._listenBlocklyEvents)
      Globals.get('Relay').addEventListener('ModelingTab.TransitionEnd',this._listenBlocklyEvents)

      Globals.get('Relay').addEventListener('Notifications.Add',this._onDisableRequest);
      Globals.get('Relay').addEventListener('Notifications.Remove',this._onEnableRequest);


    }

    _onDisableRequest(evt){
      this.view().disable();
      this.workspace.options.readOnly = true;
      this.workspace.options.maxBlocks = 0;
    }

    _onEnableRequest(evt){
      this.view().enable();
      this.workspace.options.readOnly = false;
      this.workspace.options.maxBlocks = 50;
    }

    hide() {
      this.view().hide();
    }

    show() {
      this.view().show();
    }

    _onToggleRequest(evt) {
      // Reload the blocks once toggled, to prevent them from being smushed
      if (!this._model.get('open')) {
        if (!this.workspace.getAllBlocks().length) {
          var defaultWorkspaceBlocks = document.getElementById("defaultWorkspaceBlocks");
          window.Blockly.Xml.domToWorkspace(defaultWorkspaceBlocks, this.workspace);
        } else {
          var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());
          this.workspace.removeChangeListener(this.toggleBlocklyEvent);
          this.workspace.clear();
          window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace);
        }
      }

      if (evt.name == 'ModelingTab.ToggleRequest') {
        this._model.toggle();

        Globals.get('Logger').log({
          type: this._model.get('open') ? 'open' : 'close',
          category: 'modeling',
          data: {
            displayState: this._model.getDisplayState(),
            visualization: ''//this.view().getCurrentVisualization()
          }
        })
      } else if (evt.data.tabType == 'blockly') {
        this._model.toggle();
      } else if (this._model.get('open')) {
        this._model.toggle();
      }
    }

    _onResultToggleRequest(evt) {
      //this._model.toggleResult(evt.data.resultId);
      Globals.get('Logger').log({
        type: 'result_toggle',
        category: 'modeling',
        data: {
          displayState: this._model.getDisplayState(),
          visualization: ''//this.view().getCurrentVisualization()
        }
      })
    }

    _onClearRequest(evt) {
      //this._model.clearResult(evt.data.resultId);
      Globals.get('Logger').log({
        type: 'remove_data',
        category: 'modeling',
        data: {
          resultId: evt.data.resultId,
          displayState: this._model.getDisplayState(),
          visualization: ''//this.view().getCurrentVisualization()
        }
      })
    }

    _onClearAllRequest(evt) {
      //this._model.clearResultGroup(evt.data.experimentId);
      Globals.get('Logger').log({
        type: 'remove_group',
        category: 'modeling',
        data: {
          experimentId: evt.data.experimentId,
          displayState: this._model.getDisplayState(),
          visualization: ''//this.view().getCurrentVisualization()
        }
      })
    }


    _onPhaseChange(evt) {
      if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
        if (!Globals.get('blocklyLoaded')) {

          var blocklyOptions = {
            toolbox : document.getElementById('toolbox'),
            collapse : true,
            comments : true,
            disable : true,
            maxBlocks : Infinity,
            trashcan : true,
            horizontalLayout : true,
            toolboxPosition : 'start',
            css : true,
            media : 'https://blockly-demo.appspot.com/static/media/',
            rtl : false,
            scrollbars : true,
            sounds : true,
            oneBasedIndex : true
          };

          this.workspace = window.Blockly.inject(document.getElementById('BlocklyDiv'), blocklyOptions);

          Globals.set('blocklyLoaded',true);

        }
      }
    }

    toggleBlocklyEvent(evt) {
      if (evt.type != 'ui') {
        Globals.get('Relay').dispatchEvent('Blockly.Changed', {blocklyEvt: evt, modelType: 'blockly'});
      }

      // Check whether a block with max_use of 1 has been created resp deleted, and disable resp enable.
      if (evt.type == 'create') {
        var modify_block = true;
        Array.prototype.slice.call($(document.getElementById('defaultWorkspaceBlocks')).find('block')).map(block => {
          if(block.getAttribute('type') === this.workspace.getBlockById(evt.blockId).type) modify_block = false;
        });

        if (modify_block) {
          var block_type = this.workspace.getBlockById(evt.blockId).type;
          var blockDiv = document.getElementById(block_type);
          if (blockDiv.getAttribute('max_use') === '1') {
            blockDiv.setAttribute('disabled',true);
          }
        }
      }

      // Then check if a block has been deleted that has a max_use of 1.
      if (evt.type == 'delete') {
        var block_type = evt.oldXml.getAttribute('type');
        var blockDiv = document.getElementById(block_type);
        if (blockDiv.getAttribute('max_use') === '1') {
          blockDiv.setAttribute('disabled',false);
        }
      }

      //document.querySelectorAll('[type=forward_speed]')[0].setAttribute('disabled',true)
      //document.querySelectorAll('[type=forward_speed]')[0].parentNode.removeChild(document.querySelectorAll('[type=forward_speed]')[0])

      //var toolboxelem = document.getElementById("toolbox")
      //this.workspace.updateToolbox(toolboxelem)

      // Manipulate the toolbox according to which elements have max_use and which ones not.

      // ********* parse the code for errors *********
      // Send alerts


    }

    _onBlocklyLoad(evt) {
      //let workspace = window.Blockly.getMainWorkspace();

      if (!this.workspace) {
        throw new Error("Blockly workspace does not exist.");
      }
      this.workspace.removeChangeListener(this.toggleBlocklyEvent);
      this.workspace.clear();

      if (evt.data) {
        //const blocklyXml = window.Xml.textToDom(evt.data)
        const blocklyXml = $.parseXML(evt.data).documentElement;
        window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace);//.then(() => {console.log('here')});

        const presentBlocks = this.workspace.getAllBlocks();
        presentBlocks.map(block => {
          var blockDiv = document.getElementById(block.type);
          if (blockDiv) {
            if (blockDiv.getAttribute('max_use') === '1') {
              blockDiv.setAttribute('disabled',true);
            }
          }
        });
      }

      if (!this.workspace.getAllBlocks().length) {
        var defaultWorkspaceBlocks = document.getElementById("defaultWorkspaceBlocks");
        window.Blockly.Xml.domToWorkspace(defaultWorkspaceBlocks, this.workspace);
      }

    }

    _listenBlocklyEvents(evt) {
      if (evt.data.type=== 'model' && !this.workspace.listeners_.length) {
        this.workspace.addChangeListener(this.toggleBlocklyEvent);
      }
    }

  }

  ModelingDataTab.create = (data = {}) => {
    return new ModelingDataTab({ modelData: data })
  }

  return ModelingDataTab;
})
