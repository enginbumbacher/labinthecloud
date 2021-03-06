import Globals from 'core/model/globals';
import Form from 'core/component/form/form';
import Button from 'core/component/button/field';
import ExpProtocol from './expprotocol/field';
import Utils from 'core/util/utils';
import TextField from 'core/component/textfield/field';

export default class ExperimentForm extends Form {
  constructor() {
    const buttons = [Button.create({
      id: 'submit',
      label: 'Submit',
      classes: ['form__experiment__submit'],
      eventName: 'Experiment.Submit'
    }), Button.create({
      id: 'aggregate',
      label: 'Add Results to Aggregate',
      classes: ['form__experiment__aggregate'],
      eventName: 'Experiment.AddToAggregate'
    })];
    if (Globals.get('AppConfig.system.experimentModality').match('create')) {
      buttons.splice(2, 0, Button.create({
        id: 'new',
        label: 'New Experiment',
        classes: ['form__experiment__new'],
        eventName: 'Experiment.NewRequest'
      }));
    }

    let fields = [];
    if (Globals.get('AppConfig.experiment.allowNames')) {
      fields.push(TextField.create({
        id: 'name',
        label: 'Experiment Name',
        required: true
      }))
    }
    fields = fields.concat([
      ExpProtocol.create({
        id: "exp_category",
        description: "1. Variable to be changed:",
        label:'',
        defaultValue: 'direction_brightness_default_choice',
        classes:[],
        options: {'direction_brightness_default_choice': 'please choose one', 'no_light': 'Show no light', 'brightness': 'Brightness of the light', 'direction': 'Direction of the light'},
        validation: {}
      }),
      ExpProtocol.create({
        id: "exp_procedure",
        description: {'default_choice': '2. Decide on the previous questions first.', 'brightness': "2. Procedure for changing the brightness:",
        'direction': "2. Procedure for changing the direction:"},
        label:'',
        defaultValue: 'direction_brightness_default_choice',
        classes:[],
        options: {'direction_brightness_default_choice': 'please choose one', 'brightness_increase': 'Gradually increase the brightness', 'brightness_decrease': 'Gradually decrease the brightness',
        'direction_around': 'Make the light go around', 'direction_hold': 'Keep one direction', 'direction_alternate': 'Alternate between two directions', 'direction_special': 'Special directions'},
        validation: {}
      }),
      ExpProtocol.create({
        id: "exp_holdconstant",
        description: {'default_choice': '3. Decide on the previous questions first.', 'brightness': "3. Fix the direction of light to:",
        'direction': "3. Fix the brightness of light to:"},
        label:'',
        defaultValue: 'direction_brightness_default_choice',
        classes:[],
        options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? {'direction_brightness_default_choice': 'please choose one', 'direction_25': 'dim', 'direction_50': 'medium', 'direction_100': 'bright',
                  'brightness_alldir': 'from all directions', 'brightness_left': 'from the left', 'brightness_top': 'from the top', 'brightness_right': 'from the right','brightness_bottom': 'from the bottom'} :
                  {'direction_brightness_default_choice': 'please choose one', 'direction_25': 'dim', 'direction_50': 'medium', 'direction_100': 'bright',
                  'brightness_left': 'from the left', 'brightness_top': 'from the top', 'brightness_right': 'from the right','brightness_bottom': 'from the bottom'},
        validation: {}
      }),
      ExpProtocol.create({
        id: "exp_firstlight",
        description: {'default_choice': '4. Decide on the previous questions first.', 'brightness': "4. Brightness start setting:",
        'direction': "4. Direction start setting:"},
        label:'',
        defaultValue: 'direction_brightness_default_choice',
        classes:[],
        options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? {'direction_brightness_default_choice': 'please choose one', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
                  'direction_special_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_special_topleft': 'from the top-left', 'direction_special_leftright': 'from the left and right', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom'} :
                  {'direction_brightness_default_choice': 'please choose one', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright', 'direction_left': 'from the left', 'direction_top': 'from the top',
                  'direction_right': 'from the right', 'direction_bottom': 'from the bottom'},
        validation: {}
      }),
      ExpProtocol.create({
        id: "exp_secondlight",
        description: {'default_choice': '5. Decide on the previous questions first.', 'brightness': "5. Brightness second setting:", 'direction': "5. Direction second setting:"},
        label:'',
        defaultValue: 'direction_brightness_default_choice',
        classes:[],
        options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? {'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
                  'direction_special_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom', 'direction_special_topbottom': 'from the top and bottom', 'direction_special_bottomright': 'from the bottom-right',} :
                  {'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
                  'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom'},
        validation: {}
      }),
      ExpProtocol.create({
        id: "exp_lightduration",
        description: {'default_choice': '6. Decide on the previous questions first.', 'brightness': "6. Time per setting:", 'direction': "6. Time per setting:"},
        label:'',
        defaultValue: 'direction_brightness_default_choice',
        classes:[],
        options: {'direction_brightness_default_choice': 'please choose one', 'brightness_direction_15on': 'alternate 15 seconds on'}, //'brightness_direction_30on': 'each 30 seconds on'
        validation: {}
      })
    ]);

    super({
      modelData: {
        id: "experiment",
        classes: ["form__experiment"],
        fields: fields,
        buttons: buttons
      }
    })

    this.chainOfActivation = {
      'fullChainOfActivation': {"exp_category": "exp_procedure", "exp_procedure": "exp_holdconstant", "exp_holdconstant": "exp_firstlight", "exp_firstlight": "exp_secondlight", "exp_secondlight": "exp_lightduration"},
      'partialChainOfActivation': {"exp_category": "exp_procedure", "exp_procedure": "exp_holdconstant", "exp_holdconstant": "exp_firstlight"}
    };
    this.chainState = 'fullChainOfActivation';

    Utils.bindMethods(this, ['_updateFormViews','setState', 'validate', 'getLightConfiguration'])
    this.addEventListener('Form.FieldChanged', this._updateFormViews)
    this.setState('new');
  }


  validate() {

    switch (this.chainState) {
      case 'fullChainOfActivation':
        this._model._data.regions.default.forEach((field,index) => {
          field.updateValidation({custom: {
            test: 'custom',
            fn: (val) => {
              if (val.match('default')) { return Promise.resolve(false) }
              else { return Promise.resolve(true) }
            },
            errorMessage: "You have to choose valid options for the " + (1 + index) + "th field."
          }})
        });
      break;
      case 'partialChainOfActivation':
        this._model._data.regions.default.forEach((field,index) => {
          if (field.id() != 'exp_secondlight' & field.id() != 'exp_lightduration') {
            field.updateValidation({custom: {
              test: 'custom',
              fn: (val) => {
                if (val.match('default')) { return Promise.resolve(false) }
                else { return Promise.resolve(true) }
              },
              errorMessage: "You have to choose valid options for the " + (1 + index) + "th field."
            }})
          } else {
            field.updateValidation({});
          }
        });
      break;
    }

    return this._model.validate();
  }

  export() {
    var lightConfig = this.getLightConfiguration();
    if (lightConfig['brightness'] === [-1,-1,-1,-1]) {
      lightConfig['brightness'] = [0,0,0,0]
    }
    let base = super.export();
    return {lights: lightConfig['lights'], expForm: base, name: base.name};
  }

  import(data) {
    return this.clear().then(() => {
      for (let field of this._model.getFields()) {
        if (data[field.id()] !== undefined) {
          field.setValue(data[field.id()]);
          if (data[field.id()] == 'direction_brightness_default_choice') {
            field.setVisibility('hidden',0);
          }
        }
      }
    })
  }

  setState(state) {
    this.state = state;
    switch (state) {
      case "historical":
        this.state = 'historical'
        switch (Globals.get('AppConfig.system.experimentModality').toLowerCase()) {
          case "observe":
            this._model._data.regions.default.forEach((field) => {
              field.disable()
            });
            this.getButton('submit').view().hide();
            if (Globals.get('State.experiment.allowNew')) { this.getButton('new').view().hide();}
            this.getButton('aggregate').view().hide();
          break;
          case "explore":
            this._model._data.regions.default.forEach((field) => {
              field.disable()
            });
            this.getButton('submit').view().hide();
            if (Globals.get('State.experiment.allowNew')) { this.getButton('new').view().hide();}
           this.getButton('aggregate').view().hide();
          break;
          case "create":
          case "createandhistory":
            this._model._data.regions.default.forEach((field) => {
              field.disable()
            });
            this.getButton('submit').view().hide();
            if (Globals.get('State.experiment.allowNew')) { this.getButton('new').view().show();}
            if (Globals.get('AppConfig.aggregate')) {
              this.getButton('aggregate').view().show();
            } else {
              this.getButton('aggregate').view().hide();
            }
          break;
        }
      break;
      case "new":
        this.state = 'new';
        this._model._data.regions.default.forEach((field) => {
          if (field.id() == 'name') {
            field.enable();
          } else if (field.id() == 'exp_category') {
            field.enable()
            field.setVisibility('visible');
            field.setDefault();
          } else {
            field.disable();
            field.setVisibility('hidden',0);
            field.setDefault();
          }
        });
        this.getButton('submit').view().show();
        if (Globals.get('State.experiment.allowNew')) { this.getButton('new').view().hide();}
        this.getButton('aggregate').view().hide();
      break;
    }
  }

  disableNew() {
    const newBtn = this.getButton('new')
    if (newBtn) {
      newBtn.disable();
    }
  }

  enableNew() {
    const newBtn = this.getButton('new')
    if (newBtn) {
      newBtn.enable();
    }
  }

  getLightConfiguration() {
    // Translate fields into [{"left": 100, "right": 0, "top": 0, "bottom": 100, "duration": 15}, ...]
    let defaultCounter = 0;
    this.expProtocol = {}
    this._model._data.regions.default.forEach((field,index) => {
      this.expProtocol[field.id()] = field.value()
      defaultCounter = field.value() == 'direction_brightness_default_choice'? defaultCounter + 1 : defaultCounter;
    })

    let configState = false;
    if (defaultCounter < 3) { configState = true; }

    var lightConfig = {}
    lightConfig['brightness'] = Array(4).fill(-1);
    lightConfig['lights'] = [];
    for (let panel = 0; panel < 4; panel++) { lightConfig['lights'].push({'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': 15}) }

    if (configState) {
      var lightDirections = ['left', 'top', 'right', 'bottom'];

      // Extract the fixed value
      if (this.expProtocol['exp_holdconstant'] == 'direction_brightness_default_choice') {console.log('there is a problem')}
      if (this.expProtocol['exp_holdconstant'].match('direction')) {
        lightConfig['brightness'] = Array(4).fill().map(function() { return parseInt(this.expProtocol['exp_holdconstant'].match(/\d+/)[0]) },this);
      } else if (this.expProtocol['exp_holdconstant'].match('brightness')) {
        let substr = this.expProtocol['exp_holdconstant'].lastIndexOf('_');
        substr = this.expProtocol['exp_holdconstant'].substr(substr+1);
        for (let panel = 0; panel < 4; panel++) {
          lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = substr.match('alldir|' + direction) ? 100 : 0 );
        }
      }

      // Modify all panels
      var lightSuccessions = {'left': 'top', 'top': 'right', 'right': 'bottom', 'bottom': 'left', 'topleft': 'topright', 'topright': 'bottomright', 'bottomright': 'bottomleft', 'bottomleft': 'topleft'};
      var firstBrightness = null;
      var secondBrightness = null;

      if (this.chainState == 'partialChainOfActivation' & !(this.expProtocol['exp_firstlight'] =='direction_brightness_default_choice')) {

        switch (this.expProtocol['exp_procedure']) {
          case 'brightness_increase':
            firstBrightness = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);
            for (let panel = 0; panel < 4; panel++) {
              lightConfig['brightness'][panel] = firstBrightness  + 25 * panel;
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = lightConfig['lights'][panel][direction] > 0 ? lightConfig['brightness'][panel] : 0 );
            }
          break;
          case 'brightness_decrease':
            firstBrightness = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);
            for (let panel = 0; panel < 4; panel++) {
              lightConfig['brightness'][panel] = firstBrightness - 25 * panel;
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = lightConfig['lights'][panel][direction] > 0 ? lightConfig['brightness'][panel] : 0 );
            }
          break;
          case 'brightness_hold':
            firstBrightness = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);
            for (let panel = 0; panel < 4; panel++) {
              lightConfig['brightness'][panel] = firstBrightness;
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = lightConfig['lights'][panel][direction] > 0 ? lightConfig['brightness'][panel] : 0 );
            }
          break;
          case 'direction_around':
            var currLight = this.expProtocol['exp_firstlight'].lastIndexOf('_');
            currLight = this.expProtocol['exp_firstlight'].substr(currLight+1);
            for (let panel = 0; panel < 4; panel++) {
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = currLight.match(direction) ? lightConfig['brightness'][panel] : 0 );
              currLight = lightSuccessions[currLight];
            }
          break;
          case 'direction_hold':
            var currLight = this.expProtocol['exp_firstlight'].lastIndexOf('_');
            currLight = this.expProtocol['exp_firstlight'].substr(currLight+1);
            for (let panel = 0; panel < 4; panel++) {
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = currLight.match('alldir|' + direction) ? lightConfig['brightness'][panel] : 0 );
              if (currLight == '0') lightConfig['brightness'][panel] = 0
            }
          break;
        }

      } else { // if is alternating or special

        // Modify the first panel
        if (!(this.expProtocol['exp_firstlight'] == 'direction_brightness_default_choice')) {
          if (this.expProtocol['exp_firstlight'].match('brightness')) {
            lightConfig['brightness'][0] = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);
            lightDirections.forEach( (direction) => lightConfig['lights'][0][direction] = lightConfig['lights'][0][direction] > 0 ? lightConfig['brightness'][0] : 0 );
          } else if (this.expProtocol['exp_firstlight'].match('direction')) {
            lightDirections.forEach( (direction) => lightConfig['lights'][0][direction] = this.expProtocol['exp_firstlight'].match('alldir|' + direction) ? lightConfig['brightness'][0] : 0 );
          }
        }

        // Modify the remaining panels
        if (!(this.expProtocol['exp_secondlight'] == 'direction_brightness_default_choice') & !(this.expProtocol['exp_lightduration'] == 'direction_brightness_default_choice')) {
          var modifySecondLight = [];
          switch(this.expProtocol['exp_lightduration']) {
            case 'brightness_direction_15on':
              lightConfig['lights'][2] = lightConfig['lights'][0]
              lightConfig['brightness'][2] = lightConfig['brightness'][0]
              modifySecondLight = [1,3]
            break;
            case 'brightness_direction_15onoff':
              let lights = {'duration': 15};
              lightDirections.forEach((direction) => lights[direction] = 0);
              lightConfig['lights'][1] = lights
              lightConfig['brightness'][1] = 0
              lightConfig['lights'][3] = lightConfig['lights'][1]
              lightConfig['brightness'][3] = lightConfig['brightness'][1]
              modifySecondLight = [2]
            break;
            case 'brightness_direction_special_30on':
              lightConfig['lights'][1] = lightConfig['lights'][0];
              lightConfig['brightness'][1] = lightConfig['brightness'][0]
              modifySecondLight = [2,3]
            break;
          }

          if (this.expProtocol['exp_secondlight'].match('brightness')) {
            lightConfig['brightness'][modifySecondLight[0]] = parseInt(this.expProtocol['exp_secondlight'].match(/\d+/)[0])
            lightDirections.forEach( (direction) => lightConfig['lights'][modifySecondLight[0]][direction] = lightConfig['lights'][modifySecondLight[0]][direction] > 0 ? lightConfig['brightness'][modifySecondLight[0]] : 0 );
          } else if (this.expProtocol['exp_secondlight'].match('direction')) {
            lightDirections.forEach( (direction) => lightConfig['lights'][modifySecondLight[0]][direction] = this.expProtocol['exp_secondlight'].match('alldir|' + direction) ? lightConfig['brightness'][modifySecondLight[0]] : 0 );
          }

          if (modifySecondLight.length > 1) {
            lightConfig['lights'][modifySecondLight[1]] = lightConfig['lights'][modifySecondLight[0]];
            lightConfig['brightness'][modifySecondLight[1]] = lightConfig['brightness'][modifySecondLight[0]]
          }
        }
      }
    }
    return lightConfig
  }

  _updateFormViews(evt) {
    if (evt.data.field._model._data.id == 'exp_category') {
      this._model._data.regions.default.forEach((field,index) => {
        if (field.id() == 'name') {
          // do nothing
        } else if (field.id() != 'exp_category'){
          field.showDescription(evt.data.delta.value.match('default_choice') ? 'default_choice' : evt.data.delta.value)
          if (this.state == 'new') {
            field.disable();
            field.setVisibility('hidden',0);
            field.setDefault();
          }

          this._modifyOptions(field, evt.data.delta.value)

        } else { // if it is exp_category
          field.showDescription();
        }
      });

      if (evt.data.delta.value === 'no_light') {
        this.chainState = 'final';

      } else {
        this.chainState = 'fullChainOfActivation';
      }


    } else if (evt.data.field._model._data.id == 'exp_procedure') { // The chosen procedure determines what fields to show

        //Disable options of exp_firstlight depending on what has been chose
        var field_firstlight = this._findField('exp_firstlight');
        switch (evt.data.delta.value) {
          case 'brightness_decrease':
            this._modifyOptions(field_firstlight, 'brightness_100');
            this.chainState = 'partialChainOfActivation';
          break;
          case 'brightness_increase':
            this._modifyOptions(field_firstlight, 'brightness_25');
            this.chainState = 'partialChainOfActivation';
          break;
          case 'direction_around':
            this._modifyOptions(field_firstlight, '_left','_special');
            this.chainState = 'partialChainOfActivation';
          break;
          case 'brightness_alternate':
            this._modifyOptions(field_firstlight, 'brightness');
            this.chainState = 'fullChainOfActivation';
          break;
          case 'brightness_hold':
            this._modifyOptions(field_firstlight,'brightness');
            this.chainState = 'partialChainOfActivation';
          break;
          case 'direction_alternate':
            this._modifyOptions(field_firstlight, 'direction','_special');
            this.chainState = 'fullChainOfActivation';
          break;
          case 'direction_hold':
            this._modifyOptions(field_firstlight, 'direction', '_special|_topleft');
            this.chainState = 'partialChainOfActivation';
          break;
          case 'direction_special':
             this._modifyOptions(field_firstlight,'special')
             this.chainState = 'fullChainOfActivation';
          break;
        }

        var field_secondlight = this._findField('exp_secondlight');
        switch (evt.data.delta.value) {
          case 'direction_special':
             this._modifyOptions(field_secondlight,'special|direction_brightness_0')
          break;
          default:
            let matchValue = null;
            ['direction','brightness'].forEach(value => { if(evt.data.delta.value.match(value)) matchValue = value})

            if (matchValue) {
                this._modifyOptions(field_secondlight,matchValue,'special')
            }
            break;
        }

        var field_lightduration = this._findField('exp_lightduration');
        switch (evt.data.delta.value) {
          case 'direction_special':
             this._modifyOptions(field_lightduration,'brightness_direction')
          break;
          default:
            this._modifyOptions(field_lightduration,'brightness_direction','special')
          break;
        }

        // Re-initialize successive fields
        this._model._data.regions.default.forEach((field,index) => {
          if (field.id() != 'name' && field.id() != 'exp_category' && field.id() != 'exp_procedure' && this.state == 'new') {
            field.disable();
            field.setVisibility('hidden',0);
            field.setDefault();
          }
        });
    }
    // Is the next field activated?
    if (this.chainState != 'final') {
      var nextField = this._findField(this.chainOfActivation[this.chainState][evt.data.field._model._data.id]);
      if (nextField ? !nextField.isVisible() : false) {
          nextField.setVisibility('visible');
          nextField.enable();

          var nextnextField = this._findField(this.chainOfActivation[this.chainState][nextField.id()]);
          if (nextnextField) {nextnextField.setVisibility('hidden',0.3)}
      }
    }
  }

  _findField(fieldId) {
    var field = null;
    for (var cntr = 0; cntr<this._model._data.regions.default.length; cntr++) {
      if (this._model._data.regions.default[cntr].id()==fieldId) {
        field = this._model._data.regions.default[cntr]
        break;
      }
    }
    return field
  }

  _modifyOptions(field, criteria, additionallyDisable = null) {
    Object.keys(field.getOptions()).forEach((choice) => {
      if ((choice.match(additionallyDisable) || !choice.match(criteria)) && !choice.match('direction_brightness_default_choice')) {
        field.disableOption(choice)
      } else {
        field.enableOption(choice)
      }
    });

  }
}
