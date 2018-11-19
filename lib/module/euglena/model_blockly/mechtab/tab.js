import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import Component from 'core/component/component';
import Model from './model';
import View from './view';
import ModelForm from './form/form';
import $ from 'jquery';

const defaults = {
  values: {
    channelOpeningAmount: 'amount_constant',
    turnForward: 'forward_0',
    turnDirection: 'beat_towards'
  },
  options: {
    channelOpeningAmount: ['amount_constant', 'amount_proportional'],
    turnForward: ['forward_0', 'forward_1'],
    turnDirection: ['beat_towards', 'beat_away']
  }
}

class ModelingDataTab extends Component {
  constructor(settings = {}) {

    settings.modelClass = settings.modelClass || Model;
    settings.viewClass = settings.viewClass || View;
    super(settings);
    Utils.bindMethods(this, ['_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest', '_onPhaseChange',
    '_onConfigChange', '_onMechLoad','_onDisableRequest','_onEnableRequest','_onBodyChange', '_extractData','_updateSignalText','_updateImages', 'showImg','hideImg'])

    var tmpRegionNames = {}
    var tmpParameters = {}

    tmpRegionNames['signalActivate'] = this._model.get('regionNames')['signalActivate']
    Object.keys(this._model.get('parameters')).forEach(paramName => {
      if (this._model.get('parameters')[paramName].region.match('signalActivate')) {
        tmpParameters[paramName] = this._model.get('parameters')[paramName]
      }
    })

    this._signalActivateForm = ModelForm.create({
      parameterForm: this._model.get('parameterForm'),
      variationLimitation: this._model.get('variationLimitation') ? this._model.get('variationLimitation') : null,
      regionNames: tmpRegionNames,
      config: tmpParameters
    })

    tmpRegionNames = {}
    tmpParameters = {}

    tmpRegionNames['signalProcessing'] = this._model.get('regionNames')['signalProcessing']
    Object.keys(this._model.get('parameters')).forEach(paramName => {
      if (this._model.get('parameters')[paramName].region.match('signalProcessing')) {
        tmpParameters[paramName] = this._model.get('parameters')[paramName]
      }
    })

    this._signalProcessingForm = ModelForm.create({
      parameterForm: this._model.get('parameterForm'),
      variationLimitation: this._model.get('variationLimitation') ? this._model.get('variationLimitation') : null,
      regionNames: tmpRegionNames,
      config: tmpParameters
    })


    tmpRegionNames = {}
    tmpParameters = {}

    tmpRegionNames['behavior'] = this._model.get('regionNames')['behavior']
    Object.keys(this._model.get('parameters')).forEach(paramName => {
      if (this._model.get('parameters')[paramName].region.match('behavior')) {
        tmpParameters[paramName] = this._model.get('parameters')[paramName]
      }
    })

    this.imgPath = '/cslib/module/euglena/model_blockly/mechtab/imgs/';
    this.mechanism = Globals.get('AppConfig.modeling.mechanism') ? Globals.get('AppConfig.modeling.mechanism') : 'complex';
    // this.activeImgs = {
    //   'imgs_signal-generation_default': 'signal-generation_default',
    //   'imgs_signal-activation_channelOpeningAmount': 'signal-activation_' + defaults['channelOpeningAmount'],
    //   'imgs_signal-processing_channelOpeningAmount': 'signal-processing_' + defaults['channelOpeningAmount'],
    //   'imgs_behavior-generation_turnForward': 'behavior-generation_' + defaults['turnForward']
    // }
    this.activeConfigs = {
      signalReleaseAmonut: defaults['values']['channelOpeningAmount'],
      turnForward: defaults['values']['turnForward'],
      turnDirection: defaults['values']['turnDirection']
    }

    this._behaviorForm = ModelForm.create({
      parameterForm: this._model.get('parameterForm'),
      variationLimitation: this._model.get('variationLimitation') ? this._model.get('variationLimitation') : null,
      regionNames: tmpRegionNames,
      config: tmpParameters
    })

    this._signalActivateForm.addEventListener('Form.FieldChanged', this._onConfigChange);
    this.view().addChild(this._signalActivateForm.view(),'.modeling__interface__signal-activation__params')

    this._signalProcessingForm.addEventListener('Form.FieldChanged', this._onConfigChange);
    this.view().addChild(this._signalProcessingForm.view(),'.modeling__interface__signal-processing__params')

    this._behaviorForm.addEventListener('Form.FieldChanged', this._onConfigChange);
    this.view().addChild(this._behaviorForm.view(),'.modeling__interface__behavior-generation__params')

    if (!(Globals.get('AppConfig.system.expModelModality')==='justbody')) {
      Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', this._onToggleRequest)
      Globals.get('Relay').addEventListener('Tab.Change', this._onToggleRequest)
    }

    Globals.get('Relay').addEventListener('AppPhase.Change', this._onPhaseChange)
    Globals.get('Relay').addEventListener('ModelSideTab.Load', this._onMechLoad)

    Globals.get('Relay').addEventListener('Notifications.Add',this._onDisableRequest);
    Globals.get('Relay').addEventListener('Notifications.Remove',this._onEnableRequest);

    Globals.get('Relay').addEventListener('Body.Change', this._onBodyChange);

    this._importAllImages();

  }

  _onDisableRequest(evt){
    this._signalActivateForm.disable();
    this._signalProcessingForm.disable();
    this._behaviorForm.disable();
  }

  _onEnableRequest(evt){

    if (Globals.get('AppConfig.system.modelModality').match('create')) {
      this._signalActivateForm.enable();
      this._signalProcessingForm.enable();
      this._behaviorForm.enable();
    } else if (Globals.get('AppConfig.system.modelModality') === 'explore') {
      this._signalActivateForm.disable();
      this._signalProcessingForm.disable();
      this._behaviorForm.disable();
    }
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

        var tmpEvt = {}
        tmpEvt['data'] = {'numSensors': 1}
        this._onBodyChange(tmpEvt)
        this._updateSignalText(this._model.get('parameters'), 'constructor', ['signalThresh','signalAdaptSpeed','signalThreshPosNeg','reactionStrength'])
        this._updateImages(this._model.get('parameters'), 'constructor', ['channelOpeningAmount','turnForward','turnDirection'])

      }
    }
  }

  _onConfigChange(evt) {
    // Needed to trigger a change event from the side tab to the main tab.
    // I have to manually activate that when an element in the side form gets changed. Because before, blockly did that automatically.
    Globals.get('Relay').dispatchEvent('ModelSideTab.Changed', {evtData: evt, modelType: 'mech'});
    var updateImgs = {}
    updateImgs[evt.data.field._model._data.id] = evt.data.delta.value
    this._updateImages(updateImgs, 'configChange', ['channelOpeningAmount','turnForward','turnDirection'])

    // UPDATE THE EXPLANATORY TEXT
    if (document.getElementById(evt.data.field._model._data.id)) {
      var updateText = {};
      updateText[evt.data.field._model._data.id] = {
        fieldVal: evt.data.delta.value,
        fieldText: this._model.get('parameterForm') === 'qualitative' ? evt.target._data.config[evt.data.field._model._data.id].options[evt.data.delta.value] : evt.data.delta.value
      }
      this._updateSignalText(updateText, 'configChange', ['signalThresh','signalAdaptSpeed','signalThreshPosNeg','reactionStrength'])

    }
  }

  _onMechLoad(evt) {
    this._signalActivateForm.removeEventListener('Form.FieldChanged', this._onConfigChange)
    this._signalProcessingForm.removeEventListener('Form.FieldChanged', this._onConfigChange)
    this._behaviorForm.removeEventListener('Form.FieldChanged', this._onConfigChange)
    if (evt.data) {
     // Load the chosen configuration into the form.
     // UPDATE VIEW, I.E. THE SPANS
     this._signalActivateForm.import(evt.data.config, ['signalThresh','signalAdaptSpeed']).then(() => {
       this._signalActivateForm.addEventListener('Form.FieldChanged', this._onConfigChange)
     })
     this._signalProcessingForm.import(evt.data.config, ['reactionStrength']).then(() => {
       this._signalProcessingForm.addEventListener('Form.FieldChanged', this._onConfigChange)
     })
     this._behaviorForm.import(evt.data.config, []).then(() => {
       this._behaviorForm.addEventListener('Form.FieldChanged', this._onConfigChange)
     })

     if (evt.data.sensorType) {
       var numSensors = parseInt(evt.data.sensorType.match(/\d+/)[0])
       var tmpEvt = {}
       tmpEvt['data'] = {'numSensors': numSensors ? numSensors : 1}

       this._onBodyChange(tmpEvt)
     }

     this._updateSignalText(evt.data.config,'modelLoad', ['signalThresh','signalAdaptSpeed','signalThreshPosNeg','channelOpeningAmount','reactionStrength'])
     this._updateImages(evt.data.config,'modelLoad', ['channelOpeningAmount','turnForward','turnDirection'])
    }
  }

  _extractData() {
    let formData = this._signalActivateForm.export();
    formData = $.extend(formData, this._signalProcessingForm.export());
    return $.extend(formData, this._behaviorForm.export());
  }

  _importAllImages() {
    // var imgNames = [{
    //     divId: 'imgs_signal-generation_default',
    //     imgId: 'signal-generation_default'
    //   },{
    //     divId: 'imgs_signal-activation_channelOpeningAmount',
    //     imgId: 'signal-activation_amount_proportional'
    //   }, {
    //     divId: 'imgs_signal-activation_channelOpeningAmount',
    //     imgId: 'signal-activation_amount_constant'
    //   },{
    //     divId: 'imgs_signal-processing_channelOpeningAmount',
    //     imgId: 'signal-processing_amount_proportional'
    //   },{
    //     divId: 'imgs_signal-processing_channelOpeningAmount',
    //     imgId: 'signal-processing_amount_constant'
    //   },{
    //     divId: 'imgs_behavior-generation_turnForward',
    //     imgId: 'behavior-generation_forward_0'
    //   },{
    //     divId: 'imgs_behavior-generation_turnForward',
    //     imgId: 'behavior-generation_forward_1'
    //   }]
    var imgNames = []
    defaults['options']['channelOpeningAmount'].forEach((elem_channel) => {
      defaults['options']['turnForward'].forEach((elem_forward) => {
        defaults['options']['turnDirection'].forEach((elem_direction) => {
          imgNames.push({
            divId: 'model_images',
            imgId: this.mechanism + '_signal-activation_' + elem_channel + '_behavior-generation_' + elem_forward + '_' + elem_direction
          })
        })
      })
    })
    //
    // var imgNames = [{
    //     divId: 'model_images',
    //     imgId: this.mechanism + '_' + 'signal-activation_amount_constant_behavior-generation_forward_0'
    //   }, {
    //     divId: 'model_images',
    //     imgId: this.mechanism + '_' + 'signal-activation_amount_constant_behavior-generation_forward_1'
    //   },{
    //     divId: 'model_images',
    //     imgId: this.mechanism + '_' + 'signal-activation_amount_proportional_behavior-generation_forward_0'
    //   },{
    //     divId: 'model_images',
    //     imgId: this.mechanism + '_' + 'signal-activation_amount_proportional_behavior-generation_forward_1'
    //   }]

    imgNames.forEach((img) => {
      this.view()._addLayer(img.divId, img.imgId, this.imgPath);
    })
  }

  hideImg() { //configId is the ID given to the corresponding div, as assigned in _importAllImages; it is created based on the filename
    let imgId = this.mechanism + '_' + 'signal-activation_' + this.activeConfigs['channelOpeningAmount'] + '_behavior-generation_' + this.activeConfigs['turnForward'] + '_' + this.activeConfigs['turnDirection'];
    this.view()._hideImg(imgId);
  }

  showImg() {
    let imgId = this.mechanism + '_' + 'signal-activation_' + this.activeConfigs['channelOpeningAmount'] + '_behavior-generation_' + this.activeConfigs['turnForward'] + '_' + this.activeConfigs['turnDirection'];
    this.view()._showImg(imgId);
  }

  _updateImages(updateData, dataType, paramNames) {

    Object.keys(updateData).forEach(fieldId => {
      let paramName = paramNames.indexOf(fieldId)>-1 ? fieldId : null; // make sure it does not get loaded if the field does not exist.
      if (paramName) {
        let imgField = null;
        let imgName = null;
        let imgAppendix = null;

        switch(dataType) {
          case 'constructor':
            imgAppendix = updateData[paramName].initialValue
          break;
          case 'modelLoad':
          case 'configChange':
            imgAppendix = updateData[paramName]
          break;
        }

        switch(paramName) {
          case 'channelOpeningAmount':
            // hide the current images
            // this.hideImg(this.activeImgs['imgs_signal-activation_channelOpeningAmount'])
            // this.hideImg(this.activeImgs['imgs_signal-processing_channelOpeningAmount'])
            this.hideImg();

            // this.showImg(imgName);
            // this.showImg(imgName2);
            // this.activeImgs['imgs_signal-activation_channelOpeningAmount'] = imgName;
            // this.activeImgs['imgs_signal-processing_channelOpeningAmount'] = imgName2;
            this.activeConfigs['channelOpeningAmount'] = imgAppendix;
            this.showImg();

          break;
          case 'turnForward':
            // hide the current image
            // this.hideImg(this.activeImgs['imgs_behavior-generation_turnForward'])
            this.hideImg();

            //this.showImg(imgName);
            // this.activeImgs['imgs_behavior-generation_turnForward'] = imgName;
            this.activeConfigs['turnForward'] = imgAppendix;
            this.showImg();
          break;
          case 'turnDirection':
            // hide the current image
            // this.hideImg(this.activeImgs['imgs_behavior-generation_turnForward'])
            this.hideImg();

            //this.showImg(imgName);
            // this.activeImgs['imgs_behavior-generation_turnForward'] = imgName;
            this.activeConfigs['turnDirection'] = imgAppendix;
            this.showImg();
        }
      }
    })
  }

  _updateSignalText(updateData, dataType = null) {

    Object.keys(updateData).forEach(fieldId => {

      let textField = Object.keys(this._model.get('parameters')).indexOf(fieldId)>-1 ? document.getElementById(fieldId) : null; // make sure it does not get loaded if the field does not exist.
      if (textField) {
        let fieldVal = null;
        let fieldText = null;

        switch(dataType) {
          case 'constructor':
            fieldVal = updateData[fieldId].initialValue; // Can be a string like 'adapt_1', a number, or an object {base: x, delta: y}

            if (isNaN(parseInt(fieldVal)) && !(fieldVal.base)) { // if fieldVal is a string
              fieldText = updateData[fieldId].options[updateData[fieldId].initialValue];
            } else if (fieldVal.base) { // if fieldVal is an object of a symslider field
              fieldText = fieldVal.base
            } else if (parseInt(fieldVal)) {
              fieldText = fieldVal
            }
            break;
          case 'configChange':
            if (isNaN(parseInt(updateData[fieldId].fieldVal.base))) {
              fieldVal = updateData[fieldId].fieldVal;
              fieldText = updateData[fieldId].fieldText;
            } else {
              fieldVal = updateData[fieldId].fieldVal.base;
              fieldText = updateData[fieldId].fieldVal.base;
            }
          break;
          case 'modelLoad':
            if (updateData[fieldId].qualitativeValue) {
              fieldVal = updateData[fieldId].qualitativeValue
              fieldText = this._model.get('parameters')[fieldId].options[fieldVal];
            } else if (updateData[fieldId].base) {
              fieldVal = updateData[fieldId].base;
              fieldText = updateData[fieldId].base;
            } else if (isNaN(parseInt(updateData[fieldId]))) {
              fieldVal = updateData[fieldId];
              fieldText = this._model.get('parameters')[fieldId].options[fieldVal];
            } else {
              fieldVal = updateData[fieldId];
              fieldText = updateData[fieldId];
            }
        }

        // UPDATE SIGNAL ACTIVATION TEXT
        if (fieldId.match('signalAdapt$')) {
          if (fieldVal.match('_null')) {
            textField.style.display='none';
          } else if (fieldVal.match('_0$')) {
            var insertText = 'a certain amount';
            if (document.getElementById('signalShockThresh')) {
              insertText = document.getElementById('signalShockThresh').innerHTML;
            }

            textField.style.display='inline';
            textField.innerHTML = 'No adaptation.' + '<span class = "modeling__interface__textInserts" id="signalShockThresh" style="display:none">' + insertText + '</span>';

            let tmpField = document.getElementById('signalAdaptSpeed');
            if (tmpField) {
              tmpField.style.display = 'none';
              tmpField.setAttribute('status','off');
            }

          } else if (fieldVal.match('_continuous$')) {
            var insertText = 'a certain amount';
            if (document.getElementById('signalShockThresh')) {
              insertText = document.getElementById('signalShockThresh').innerHTML;
            }

            textField.style.display='inline';
            textField.innerHTML = 'The photoreceptors have some form of memory of the general brightness around the Euglena. When they see a lot of light over a period of time, they "know" that it is rather bright. They use this information to adapt gradually their activation brightness to the general brightness.' + '<span class = "modeling__interface__textInserts" id="signalShockThresh" style="display:none">' + insertText + '</span>';

            let tmpField = document.getElementById('signalAdaptSpeed');
            if (tmpField) {
              tmpField.style.display = 'inline';
              tmpField.setAttribute('status','on');
            }

          } else if (fieldVal.match('_shock$')) {
            var insertText = 'a certain amount';
            if (document.getElementById('signalShockThresh')) {
              insertText = document.getElementById('signalShockThresh').innerHTML;
            }

            textField.style.display='inline';
            textField.innerHTML = 'The photoreceptors have some form of memory of the general brightness around the Euglena. When they see a lot of light over a period of time, they "know" that it is rather bright. They use this information to adapt their activation threshold. If it suddenly gets very bright, i.e. when the difference between detected light and activation brightness is bigger than <span class = "modeling__interface__textInserts" id="signalShockThresh">' + insertText + '</span>, the Euglena goes into shock mode until the photoreceptors have adapted to the bright light.';

            let tmpField = document.getElementById('signalAdaptSpeed');
            if (tmpField) {
              tmpField.style.display = 'inline';
              tmpField.setAttribute('status','on');
            }
          }
        } else if (fieldId.match('signalThresh$')) {
          document.getElementById("signal-activation__baselineText").style.display='inline';
          textField = document.getElementById(fieldId);
          textField.innerHTML = fieldText + ' percent of the maximum brightness';
        } else if (fieldId.match('signalShockThresh$')) {
          if (!isNaN(parseFloat(fieldText))) {
            textField.innerHTML = 'about ' + fieldText + ' percent';
          } else {
            textField.innerHTML = fieldText;
          }
        } else if (fieldId.match('signalRelease$')) {

          var insertText = 'the activation brightness'
          if (document.getElementById('signalThresh')) {
            insertText = document.getElementById('signalThresh').innerHTML;
          }

          document.getElementById("signal-activation__baselineText").innerHTML = "2. When light hits a photoreceptor, and when this light is brigher than <span class='modeling__interface__textInserts' id='signalThresh'>" + insertText + "</span>" +  "the activation brightness the Rhodopsin releases its <span class='modeling__interface__textInserts' id='signalRelease'> Signal Molecules </span>."
          textField = document.getElementById(fieldId);
          textField.innerHTML = fieldText;

        } else if (fieldId.match('signalRandom$')) {
          if (fieldVal.match('_0')) {
            textField.innerHTML = 'The photoreceptors do not release their Signal Molecules randomly.'
            textField.style.display='inline';
          } else {
            textField.innerHTML = 'Once in a while, with <span class = "modeling__interface__textInserts">' + fieldText + '</span> probability, the photoreceptors release randomly Signal Molecules, even when the receptors do not detect any light.'
            textField.style.display='inline';
          }
        } else if (fieldId.match('signalAdaptSpeed$')) {
          if (textField.hasAttribute('status')) {
            if (textField.getAttribute('status') === 'on') {
              textField.style.display = 'inline'
            } else {
              textField.style.display = 'none';
            }
          }
          textField = document.getElementById('signalAdaptSpeed_val');
          if (!isNaN(parseFloat(fieldText))) {
            textField.innerHTML = 'about ' + fieldText + ' seconds';
          } else {
            textField.innerHTML = fieldText;
          }
        } else if (fieldId.match('channelOpeningAmount')) {
          if (fieldVal.match('_constant')) {
            document.getElementById("signal-processing__baselineText__channelOpeningAmount").innerHTML = "3. As soon as enough Signal Molecules reach a Calcium Channel, the Channel opens up and Calcium ions flow into the connection piece. <span class='modeling__interface__textInserts' id='channelOpeningAmount'> Immediately, the opened Channels activate all other Channels to open up too </span>."
          } else {
            document.getElementById("signal-processing__baselineText__channelOpeningAmount").innerHTML = "3. As soon as enough Signal Molecules reach a Calcium Channel, the Channel opens up and Calcium ions flow into the connection piece. <span class='modeling__interface__textInserts' id='channelOpeningAmount'> The more Signal Molecules are released, the more Channels get activated. </span>."
          }
        } else if (fieldId.match('reactionStrength')) {
          document.getElementById("signal-processing__baselineText__reactionStrength").style.display='inline';
          textField = document.getElementById(fieldId);
          fieldText = parseFloat(fieldText);
          if (fieldText == 0) {
            textField.innerHTML = 'zero'
          } else if (fieldText < 0.5) {
            textField.innerHTML = 'very few'
          } else if (fieldText < 1.0) {
            textField.innerHTML = 'few'
          } else if (fieldText < 1.5) {
            textField.innerHTML = 'some'
          } else if (fieldText < 2.0) {
            textField.innerHTML = 'quite a few'
          } else if (fieldText < 3.0) {
            textField.innerHTML = 'many'
          } else if(fieldText < 3.5) {
            textField.innerHTML = 'very many'
          } else if (fieldText < 4.0) {
            textField.innerHTML = 'extremely many'
          }
          //textField.innerHTML = fieldText;
        } else if (fieldId.match('turnForward$')) {

          var insertText = 'in one direction'
          if (document.getElementById('turnDirection')) {
            insertText = document.getElementById('turnDirection').innerHTML;
          }
          if (fieldVal.match('_0')) {
            document.getElementById("behavior-generation__baselineText__turnForward").innerHTML = "4. When the Calcium ions reach the base of the flagellum, they trigger a change in how the flagellum moves, which changes the direction the Euglena is pointing in. <span class='modeling__interface__paragraphInserts' id='turnForward'> The Flagellum stops spiraling, and beats <span class='modeling__interface__textInserts' id='turnDirection'>" + insertText + "</span>.</span> When too few or no Calcium ions arrive at the base, the flagellum resumes normal behavior."
          } else {
            document.getElementById("behavior-generation__baselineText__turnForward").innerHTML = "4. When the Calcium ions reach the base of the flagellum, they trigger a change in how the flagellum moves, which changes the direction the Euglena is pointing in. <span class='modeling__interface__paragraphInserts' id='turnForward'> The Flagellum continues spiraling, but tilts <span class='modeling__interface__textInserts' id='turnDirection'>" + insertText + "</span>.</span> When too few or no Calcium ions arrive at the base, the flagellum resumes normal behavior."
          }
        } else if (fieldId.match('turnDirection$')) {
          document.getElementById("behavior-generation__baselineText__turnForward").style.display='inline';
          textField = document.getElementById(fieldId);
          if (fieldText.match('_towards')) {
              textField.innerHTML = 'towards the eyespot'
          } else {
              textField.innerHTML = 'away from the eyespot'
          }
        }

      }
    })
  }

  _onBodyChange(evt) {

    // Function to adapt the choices available and the images in the tab to the number of sensors chosen.

    this._numSensors = evt.data.numSensors;

    let oneEyeDiv = document.getElementById("one-eye");
    let twoEyeDiv = document.getElementById("two-eyes");

    if (oneEyeDiv && twoEyeDiv) { // Will not activate on initial loading of page
      if (evt.data.numSensors === 1) {
        oneEyeDiv.style.display='inline';
        twoEyeDiv.style.display='none';
      } else {
        oneEyeDiv.style.display='none';
        twoEyeDiv.style.display='inline';
      }
    }


  }

}

ModelingDataTab.create = (data) => {
  return new ModelingDataTab({ modelData: data })
}

export default ModelingDataTab;
