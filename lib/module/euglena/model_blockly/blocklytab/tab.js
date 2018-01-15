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
      Utils.bindMethods(this, ['_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest', '_onPhaseChange', 'toggleBlocklyEvent', '_onBlocklyLoad', '_listenBlocklyEvents'])

      Globals.set('blocklyLoaded',false);

      Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', this._onToggleRequest)
      Globals.get('Relay').addEventListener('Tab.Change', this._onToggleRequest)

      Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
      Globals.get('Relay').addEventListener('Blockly.Load', this._onBlocklyLoad)

      Globals.get('Relay').addEventListener('Notifications.Remove',this._listenBlocklyEvents)


    }

    hide() {
      this.view().hide();
    }

    show() {
      this.view().show();
    }

    _onToggleRequest(evt) {
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
          // open the tab
          this._model.set('open',true);

      } else if (this._model.get('open')) {
        // close the tab
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

          var defaultWorkspaceBlocks = document.getElementById("defaultWorkspaceBlocks");
          window.Blockly.Xml.domToWorkspace(defaultWorkspaceBlocks, this.workspace);

          this.workspace.addChangeListener(this.toggleBlocklyEvent);
          this.hasListener = true;

          Globals.set('blocklyLoaded',true);
        }
      }
    }

    toggleBlocklyEvent(evt) {
      if (evt.type != window.Blockly.Events.UI) {
        Globals.get('Relay').dispatchEvent('Blockly.Changed', {blocklyEvt: evt, modelType: 'blockly'});
      }

    }

    _onBlocklyLoad(evt) {
      //let workspace = window.Blockly.getMainWorkspace();
      if (!this.workspace) {
        throw new Error("Blockly workspace does not exist.");
      }
      this.workspace.removeChangeListener(this.toggleBlocklyEvent);
      this.hasListener = false;
      this.workspace.clear();
      if (evt.data) {
        const blocklyXml = $.parseXML(evt.data).documentElement;
        window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace);//.then(() => {console.log('here')});
      }
    }

    _listenBlocklyEvents(evt) {
      if (!this.hasListener) {
        this.workspace.addChangeListener(this.toggleBlocklyEvent);
        this.hasListener = true;
      }
    }

  }

  ModelingDataTab.create = (data = {}) => {
    return new ModelingDataTab({ modelData: data })
  }

  return ModelingDataTab;
})
