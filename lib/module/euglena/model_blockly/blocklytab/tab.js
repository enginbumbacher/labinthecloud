import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Component from 'core/component/component';
import Model from './model';
import View from './view';
import $ from 'jquery';

class ModelingDataTab extends Component {
  constructor(settings = {}) {
    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
    Utils.bindMethods(this, ['_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest', '_onPhaseChange',
    'toggleBlocklyEvent', '_onBlocklyLoad', '_listenBlocklyEvents','_onDisableRequest','_onEnableRequest','_onBodyChange','_updateToolbox', '_extractData'])

    Globals.set('blocklyLoaded',false);

    if (!(Globals.get('AppConfig.system.expModelModality')==='justbody')) {
      Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', this._onToggleRequest)
      Globals.get('Relay').addEventListener('Tab.Change', this._onToggleRequest)
    }

    Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
    Globals.get('Relay').addEventListener('ModelSideTab.Load', this._onBlocklyLoad)

    Globals.get('Relay').addEventListener('Notifications.Remove',this._listenBlocklyEvents)
    Globals.get('Relay').addEventListener('ModelingTab.TransitionEnd',this._listenBlocklyEvents)

    Globals.get('Relay').addEventListener('Notifications.Add',this._onDisableRequest);
    Globals.get('Relay').addEventListener('Notifications.Remove',this._onEnableRequest);

    Globals.get('Relay').addEventListener('Body.Change', this._onBodyChange);
    Globals.get('Relay').addEventListener('Toolbox.Update',this._updateToolbox);


  }

  _onDisableRequest(evt){
    this.view().disable();
    if (this.workspace) {
      this.workspace.options.readOnly = true;
      this.workspace.options.maxBlocks = 0;
    }
  }

  _onEnableRequest(evt){
    if (Globals.get('AppConfig.system.modelModality') === 'create') {
      this.view().enable();
      if (this.workspace) {
        this.workspace.options.readOnly = false;
        this.workspace.options.maxBlocks = 50;
      }
    } else if (Globals.get('AppConfig.system.modelModality') === 'explore') {
      this.view().enable();
    }
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

        // let oneEyeDiv = document.getElementById("one-eye");
        // let twoEyeDiv = document.getElementById("two-eyes");
        //
        // if (oneEyeDiv && twoEyeDiv) { // Will not activate on initial loading of page
        //   if (this._numSensors === 1) {
        //     oneEyeDiv.style.display='block';
        //     twoEyeDiv.style.display='none';
        //   } else {
        //     oneEyeDiv.style.display='none';
        //     twoEyeDiv.style.display='block';
        //   }
        // }

      } else {
        var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());
        this.workspace.removeChangeListener(this.toggleBlocklyEvent);
        this.workspace.clear();
        window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace);
      }
    }

    if (evt.name == 'ModelingTab.ToggleRequest') {
      this._model.toggle();
      this._view.toggle(this._model.get('open'));

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
      this._view.toggle(this._model.get('open'));
    } else if (this._model.get('open')) {
      this._model.toggle();
      this._view.toggle(this._model.get('open'));
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
    console.log('here')
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

        var toolbox_scrollbars = document.getElementsByClassName('blocklyScrollbarHandle');
        for (let idx=0;idx<toolbox_scrollbars.length;idx++) {
          toolbox_scrollbars[idx].style.fill='grey';
        }


        Globals.set('blocklyLoaded',true);

      }
    }
  }

  _updateToolbox(block_type) {
      var counter = 0;
      this.workspace.getAllBlocks().forEach(block => {
        if (block.type === block_type) { counter += 1; }
      });

      var blockDiv = document.getElementById(block_type);
      if (String(counter) >= blockDiv.getAttribute('max_use')) {
        blockDiv.setAttribute('disabled',true);
      } else {
        blockDiv.setAttribute('disabled',false);
      }

      this.workspace.toolbox_.refreshSelection();
  }

  toggleBlocklyEvent(evt) {
    if (evt.type != 'ui') {
      Globals.get('Relay').dispatchEvent('ModelSideTab.Changed', {evtData: evt, modelType: 'blockly'});
    }

    // Check whether a block with max_use of 1 has been created resp deleted, and disable resp enable.
    if (evt.type == 'create') {
      var modify_block = true;
      Array.prototype.slice.call($(document.getElementById('defaultWorkspaceBlocks')).find('block')).map(block => {
        if(block.getAttribute('type') === this.workspace.getBlockById(evt.blockId).type) modify_block = false;
      });

      // Manipulate the toolbox according to which elements have max_use and which ones not.
      if (modify_block) {
        var block_type = this.workspace.getBlockById(evt.blockId).type;
        this._updateToolbox(block_type);

      }
    }

    // Then check if a block has been deleted that has a max_use of 1.
    if (evt.type == 'delete') {
      var block_type = evt.oldXml.getAttribute('type');
      this._updateToolbox(block_type);
    }

    if(evt.type == 'move') {
      if (['either_way','no_light','see_light'].indexOf(evt.blockId) > -1) {

        var newParent = evt.newParentId;
        var newBlock = this.workspace.getBlockById(newParent);
        if (['master_block','either_way','no_light','see_light'].indexOf(newParent) === -1) {
          newBlock.dispose(true);
        }
      }
    }

    //document.querySelectorAll('[type=move_change]')[0].setAttribute('disabled',true)
    //document.querySelectorAll('[type=move_change]')[0].parentNode.removeChild(document.querySelectorAll('[type=move_change]')[0])

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

    if (evt.data.config) {
      //const blocklyXml = window.Xml.textToDom(evt.data)
      const blocklyXml = $.parseXML(evt.data.config).documentElement;
      window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace);//.then(() => {console.log('here')});
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

  _extractData() {
    // get the Blockly code xml
    var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());

    // remove blocks from blocklyXml that are not within the main block
    Array.prototype.slice.call(blocklyXml.childNodes).map((childNode) => {
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

  _onBodyChange(evt) {
    //var toolboxelem = document.getElementById("toolbox")
    //this.workspace.updateToolbox(toolboxelem)
    this._numSensors = evt.data.numSensors;

    // Hide or disable blocks in the toolbox that do not correspond to the number of sensorPosition
    var blocksInToolbox = toolbox.getElementsByTagName('block');
    for (var idx = 0; idx < blocksInToolbox.length; idx++) {
      let block = blocksInToolbox[idx];

      let numSensors = null;
      switch(block.getAttribute('sensors')) {
        case 'one':
          numSensors = 1;
        break;
        case 'two':
          numSensors = 2;
        break;
      }

      // Do not enable a block that should be disabled due to max_use
      var counter = 0;
      this.workspace.getAllBlocks().forEach(tmpblock => {
        if (tmpblock.type === block.getAttribute('id')) { counter += 1; }
      });

      if (numSensors && (String(numSensors) != evt.data.numSensors)) {
        block.setAttribute('disabled',true);
      } else if (String(counter) < block.getAttribute('max_use')) {
        block.setAttribute('disabled',false);
      }
    }

    // let oneEyeDiv = document.getElementById("one-eye");
    // let twoEyeDiv = document.getElementById("two-eyes");
    //
    // if (oneEyeDiv && twoEyeDiv) { // Will not activate on initial loading of page
    //   if (evt.data.numSensors === 1) {
    //     oneEyeDiv.style.display='block';
    //     twoEyeDiv.style.display='none';
    //   } else {
    //     oneEyeDiv.style.display='none';
    //     twoEyeDiv.style.display='block';
    //   }
    // }

    // Replace blocks in the workspace that do not correspond to the number of sensors with ones that do, where possible.
    // In particular: turn_at_1sensor or turn_at_1sensor_eyespot vs turn_at_2sensors
    // Use the attribute 'equivalence' of the divs to replace the blocks
    if (this.workspace) {
      this.workspace.removeChangeListener(this.toggleBlocklyEvent);

      var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());
      var blocksInWorkspace = blocklyXml.getElementsByTagName('block')
      for (var idx = 0; idx < blocksInWorkspace.length; idx++) {
        let oldBlock = blocksInWorkspace[idx];
        let oldBlockDiv = document.getElementById(oldBlock.id)
        if (oldBlockDiv.getAttribute('equivalence')) {
          let newBlock = document.getElementById(oldBlockDiv.getAttribute('equivalence')).cloneNode(true);
          let parentBlock = oldBlock.parentNode;
          let appendChild = oldBlock.getElementsByTagName('next').length ? oldBlock.getElementsByTagName('next')[0] : null;
          if (appendChild) newBlock.appendChild(appendChild);

          // Replace the field values where possible
          if (oldBlockDiv.id.match('turn_at_')) {
            let fieldValue = oldBlock.getElementsByTagName('field')['DIRECTION'].innerHTML;
            newBlock.getElementsByTagName('field')['DIRECTION'].innerHTML = fieldValue;
          }

          parentBlock.firstChild.remove();
          parentBlock.append(newBlock);
        }
      }
      this.workspace.clear();
      window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace);
      this.workspace.addChangeListener(this.toggleBlocklyEvent)
    }

    this.workspace.toolbox_.refreshSelection()

/*
      this.workspace.getAllBlocks().forEach(block => {
        var blockDiv = document.getElementById(block.type);
        if (blockDiv) {
          // Check whether the block has to be replaced
          let numSensors = null;
          switch(blockDiv.getAttribute('sensors')) {
            case 'one':
              numSensors = 1;
            break;
            case 'two':
              numSensors = 2;
            break;
          }

          if (numSensors && (String(numSensors) != evt.data.numSensors)) {
            if (blockDiv.getAttribute('equivalence')) {
              var newBlockDiv = document.getElementById(blockDiv.getAttribute('equivalence')).cloneNode(true);
              newBlockDiv.setAttribute('disabled',false);

            }
          }
        }
      });
    */
  }

}

ModelingDataTab.create = (data = {}) => {
  return new ModelingDataTab({ modelData: data })
}

export default ModelingDataTab;
