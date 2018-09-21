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
    'toggleMechEvent', '_onMechLoad','_onDisableRequest','_onEnableRequest','_onBodyChange'])

    Globals.set('mechLoaded',false);

    if (!(Globals.get('AppConfig.system.expModelModality')==='justbody')) {
      Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', this._onToggleRequest)
      Globals.get('Relay').addEventListener('Tab.Change', this._onToggleRequest)
    }

    Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
    Globals.get('Relay').addEventListener('ModelSideTab.Load', this._onMechLoad)

    //Globals.get('Relay').addEventListener('Notifications.Remove',this._listenBlocklyEvents)
    //Globals.get('Relay').addEventListener('ModelingTab.TransitionEnd',this._listenBlocklyEvents)

    Globals.get('Relay').addEventListener('Notifications.Add',this._onDisableRequest);
    Globals.get('Relay').addEventListener('Notifications.Remove',this._onEnableRequest);

    Globals.get('Relay').addEventListener('Body.Change', this._onBodyChange);

  }

  _onDisableRequest(evt){
    this.view().disable();
  }

  _onEnableRequest(evt){
    if (Globals.get('AppConfig.system.modelModality') === 'create') {
      this.view().enable();
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
    } else if (evt.data.tabType == 'mech') {
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
    if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
      if (!Globals.get('mechLoaded')) {
        // Do what is needed to load the form in the side tab
        Globals.set('mechLoaded',true);
      }
    }
  }

  toggleMechEvent(evt) {
    // Needed to trigger a change event from the side tab to the main tab.
    // I have to manually activate that when an element in the side form gets changed. Because before, blockly did that automatically.
    Globals.get('Relay').dispatchEvent('ModelSideTab.Changed', {blocklyEvt: evt, modelType: 'mech'});
  }

  _onMechLoad(evt) {

    if (evt.data) {
     // Load the chosen configuration into the form.
    }

  }

  _onBodyChange(evt) {

    // Function to adapt the choices available in the tab to the number of sensors chosen.

    this._numSensors = evt.data.numSensors;

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


  }

}

ModelingDataTab.create = (data = {}) => {
  return new ModelingDataTab({ modelData: data })
}

export default ModelingDataTab;
