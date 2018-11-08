import Globals from 'core/model/globals';
import Form from 'core/component/form/form';
import Button from 'core/component/button/field';
import ExpProtocol from './expprotocol/field';
import Utils from 'core/util/utils';

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

    super({
      modelData: {
        id: "experiment",
        classes: ["form__experiment"],
        fields: [
          ExpProtocol.create({
            id: "exp_category",
            description: '1. What kind of experiment do you want to run:',
            label:'',
            defaultValue: 'default_choice',
            classes:[],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? {'default_choice': 'please choose one', 'no_light': 'Show no light', 'fix_dir': 'Fixed direction of light', 'simple_seq': 'Simple light sequence', 'complex_seq': 'Light sequence after light from all directions'} :
            {'default_choice': 'please choose one', 'no_light': 'Show no light', 'fix_dir': 'Fixed direction of light', 'simple_seq': 'Simple light sequence'},
            validation: {}
          }),
          ExpProtocol.create({
            id: "exp_procedure",
            description: {'default_choice': '2. Decide on the previous questions first.', 'fix_dir': '2. Procedure for the brightness:',
            'simple_seq': '2. Which light sequence do you want:', 'complex_seq': '2. How long light from all directions initially?'},
            label:'',
            defaultValue: 'default_choice',
            classes:[],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? {'default_choice': 'please choose one', 'fix_dir_constant': 'Set a specific brightness', 'fix_dir_increase': 'Gradually increase the brightness', 'fix_dir_decrease': 'Gradually decrease the brightness',
            'simple_seq_around': 'Make the light go around', 'simple_seq_alternate': 'Alternate between two single directions', 'simple_seq_2alternates': 'Alternate between two directions with 2 light sim.',
          'complex_seq_alldir_10': '10 seconds', 'complex_seq_alldir_20': '20 seconds', 'complex_seq_alldir_30': '30 seconds'} :
            {'default_choice': 'please choose one', 'fix_dir_constant': 'Set a specific brightness', 'fix_dir_increase': 'Gradually increase the brightness', 'fix_dir_decrease': 'Gradually decrease the brightness',
            'simple_seq_around': 'Make the light go around', 'simple_seq_alternate': 'Alternate between two single directions', 'complex_seq_alldir_10': '10 seconds', 'complex_seq_alldir_15': '15 seconds', 'complex_seq_alldir_20': '20 seconds', 'complex_seq_alldir_30': '30 seconds'},
            validation: {}
          }),
          ExpProtocol.create({
            id: "exp_holdconstant",
            description: {'default_choice': '3. Decide on the previous questions first.', 'fix_dir': '3. Fix the direction of light to:',
            'simple_seq': '3. Fix the brightness of light to:', 'complex_seq': '3. Fix the brightness of the light from all directions to:'},
            label:'',
            defaultValue: 'default_choice',
            classes:[],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? {'default_choice': 'please choose one', 'fix_dir_alldir': 'from all directions', 'fix_dir_left': 'from the left', 'fix_dir_top': 'from the top', 'fix_dir_right': 'from the right','fix_dir_bottom': 'from the bottom',
                        'simple_seq_10': '10%', 'simple_seq_20': '20%', 'simple_seq_40': '40%', 'simple_seq_60': '60%', 'simple_seq_80': '80%', 'simple_seq_100': '100%',
                        'complex_seq_alldir_10': '10%', 'complex_seq_alldir_20': '20%', 'complex_seq_alldir_40': '40%', 'complex_seq_alldir_60': '60%', 'complex_seq_alldir_80': '80%', 'complex_seq_alldir_100': '100%'} :
                      {'default_choice': 'please choose one', 'fix_dir_left': 'from the left', 'fix_dir_top': 'from the top', 'fix_dir_right': 'from the right','fix_dir_bottom': 'from the bottom',
                        'simple_seq_20': '20%', 'simple_seq_40': '40%', 'simple_seq_60': '60%', 'simple_seq_80': '80%', 'simple_seq_100': '100%'},
            validation: {}
          }),
          ExpProtocol.create({
            id: "exp_firstlight",
            description: {'default_choice': '4. Decide on the previous questions first.', 'fix_dir_constant': '4. Which brightness to set the light to:',
            'fix_dir_increase': '4. In how many steps should the brightness increase:', 'fix_dir_decrease': '4. In how many steps should the brightness decrease:',
            'simple_seq_around': '4. Direction start setting:', 'simple_seq_alternate': '4. Direction start setting:', 'simple_seq_2alternates': '4. Which light sequence do you want?',
            'complex_seq':'4. What light direction after that?'},
            label:'',
            defaultValue: 'default_choice',
            classes:[],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? {'default_choice': 'please choose one', 'fix_dir_constant_10': '10%', 'fix_dir_constant_20': '20%', 'fix_dir_constant_40': '40%', 'fix_dir_constant_60': '60%', 'fix_dir_constant_80': '80%', 'fix_dir_constant_100': '100%',
                      'fix_dir_increase_fix_dir_decrease_2': 'in 2 steps', 'fix_dir_increase_fix_dir_decrease_4': 'in 4 steps', 'fix_dir_increase_fix_dir_decrease_6': 'in 6 steps',
                      'simple_seq_around_simple_seq_alternate_left': 'from the left', 'simple_seq_alternate_top': 'from the top', 'simple_seq_2alternates_topleft': 'from the topleft to the bottomright', 'simple_seq_2alternates_leftright': 'from the left and right to the top and bottom', 'simple_seq_2alternates_alldir': 'from all directions to no light',
                      'complex_seq_left': 'from the left', 'complex_seq_top': 'from the top'} :
                      {'default_choice': 'please choose one', 'fix_dir_constant_20': '20%', 'fix_dir_constant_40': '40%', 'fix_dir_constant_60': '60%', 'fix_dir_constant_80': '80%', 'fix_dir_constant_100': '100%', 'fix_dir_increase_fix_dir_decrease_4': 'in 4 steps',
                      'simple_seq_around_simple_seq_alternate_left': 'from the left', 'simple_seq_alternate_top': 'top'},
            validation: {}
          }),
          ExpProtocol.create({
            id: "exp_secondlight",
            description: {'default_choice': '5. Decide on the previous questions first.', 'simple_seq_alternate': '5. Direction second setting:',
          'simple_seq_around': '5. How many steps in the sequence?', 'simple_seq_2alternates': '5. How many steps in the sequence?', 'complex_seq': '5. What additional light direction?'},
            label:'',
            defaultValue: 'default_choice',
            classes:[],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? {'default_choice': 'please choose one', 'simple_seq_alternate_right': 'from the right', 'simple_seq_alternate_bottom': 'from the bottom', 'simple_seq_alternate_nolight': 'no light',
          'simple_seq_2alternates_2': '2 steps', 'simple_seq_around_simple_seq_2alternates_4': '4 steps','simple_seq_around_simple_seq_2alternates_6': '6 steps', 'complex_seq_nolight': 'no light', 'complex_seq_left_right': 'from the right', 'complex_seq_top_bottom': 'from the bottom'} :
          {'default_choice': 'please choose one', 'simple_seq_alternate_right': 'from the right', 'simple_seq_alternate_bottom': 'from the bottom', 'simple_seq_alternate_nolight': 'no light',
        'simple_seq_around_ simple_seq_2alternates_2': '2 steps', 'simple_seq_around_simple_seq_2alternates_4': '4 steps', 'simple_seq_around_simple_seq_2alternates_6': '6 steps' },
            validation: {}
          }),
          ExpProtocol.create({
            id: "exp_lightduration",
            description: {'default_choice': '6. Decide on the previous questions first.', 'simple_seq_alternate': '6. How many steps in sequence?:', 'complex_seq': '7. What brightness of light for the two directions?'},
            label:'',
            defaultValue: 'default_choice',
            classes:[],
            options: {'default_choice': 'please choose one', 'simple_seq_alternate_2': '2 steps', 'simple_seq_alternate_4': '4 steps', 'simple_seq_alternate_6': '6 steps', 'complex_seq_10': '10%', 'complex_seq_20': '20%', 'complex_seq_40': '40%'},
            validation: {}
          })
        ],
        buttons: buttons
      }
    })

    this.chainOfActivation = {
      'fullChainOfActivation': {"exp_category": "exp_procedure", "exp_procedure": "exp_holdconstant", "exp_holdconstant": "exp_firstlight", "exp_firstlight": "exp_secondlight", "exp_secondlight": "exp_lightduration"},
      'mediumChainOfActivation': {"exp_category": "exp_procedure", "exp_procedure": "exp_holdconstant", "exp_holdconstant": "exp_firstlight", "exp_firstlight": "exp_secondlight"},
      'shortChainOfActivation': {"exp_category": "exp_procedure", "exp_procedure": "exp_holdconstant", "exp_holdconstant": "exp_firstlight"}
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
      case 'mediumChainOfActivation':
        this._model._data.regions.default.forEach((field,index) => {
          if (field.id() != 'exp_lightduration') {
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
      case 'shortChainOfActivation':
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
    return {lights: lightConfig['lights'], expForm: super.export()};
  }

  import(data) {
    return this.clear().then(() => {
      for (let field of this._model.getFields()) {
        if (data[field.id()] !== undefined) {
          field.setValue(data[field.id()]);
          if (data[field.id()] == 'default_choice') {
            field.setVisibility('hidden',0);
          }
        }
      }
    })
  }

  setState(state) {
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
          if (field.id() == 'exp_category') {
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
      defaultCounter = field.value() == 'default_choice'? defaultCounter + 1 : defaultCounter;
    })

    let configState = false;
    switch(this.chainState) {
      case 'fullChainOfActivation':
        configState = defaultCounter == 0 ? true : false;
      break;
      case 'mediumChainOfActivation':
        configState = defaultCounter < 2 ? true : false;
      break;
      case 'shortChainOfActivation':
        configState = defaultCounter < 3 ? true : false;
      break;
      case 'final':
        configState = true;
      break;
    }

    let numPanels = 6;
    var lightConfig = {}
    lightConfig['brightness'] = [];
    lightConfig['lights'] = [];
    for (let panel = 0; panel < numPanels; panel++) {
      lightConfig['lights'].push({'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': 10})
      lightConfig['brightness'].push(-1);
    }

    if (configState) {
      var lightDirections = ['left', 'top', 'right', 'bottom'];
      lightConfig['brightness'] = [];
      lightConfig['lights'] = [];

      if (this.expProtocol['exp_category']=='fix_dir') {

          // Get the light direction
          let lightDir = '';
          if (this.expProtocol['exp_holdconstant'] == 'default_choice') {console.log('exp_holdconstant: there is a problem')}
          if (this.expProtocol['exp_holdconstant'].match('fix_dir')) {
            let substr = this.expProtocol['exp_holdconstant'].lastIndexOf('_');
            lightDir = this.expProtocol['exp_holdconstant'].substr(substr+1);
          }

          if (this.expProtocol['exp_procedure']=='fix_dir_constant') {
            // Set the number of panels and the direction of light in each panel
            numPanels = 1;
            lightConfig['lights'].push({'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': 60})
            lightDirections.forEach( (direction) => lightConfig['lights'][0][direction] = lightDir.match('alldir|' + direction) ? 100 : 0 );

            // Get the light brightness
            let lightBrightness = 0;
            if (this.expProtocol['exp_firstlight'].match('10|20|40|60|80|100')) {
              let substr = this.expProtocol['exp_firstlight'].lastIndexOf('_');
              lightBrightness = parseInt(this.expProtocol['exp_firstlight'].substr(substr+1));
            }

            // Set the brightness of light
            lightConfig['brightness'].push(lightBrightness);
            lightDirections.forEach( (direction) => lightConfig['lights'][0][direction] = lightConfig['lights'][0][direction] > 0 ? lightBrightness : 0 );

          } else if (['fix_dir_increase','fix_dir_decrease'].indexOf(this.expProtocol['exp_procedure'])>-1) {
            // If exp_procedure is fix_dir_increase or fix_dir_decrease --> Different number of panels

            // Set the number of panels and the direction of light in each panel
            if (this.expProtocol['exp_firstlight'].match('increase|decrease')) {
              let substr = this.expProtocol['exp_firstlight'].lastIndexOf('_');
              numPanels = parseInt(this.expProtocol['exp_firstlight'].substr(substr+1));
            }

            for (let panel = 0; panel < numPanels; panel++) {
              lightConfig['lights'].push({'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': Math.round(60/numPanels)})
              lightConfig['brightness'].push(-1);
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = lightDir.match('alldir|' + direction) ? 100 : 0 );
            }

            // Set the light brightness
            let brightnessList = [];
            if (this.expProtocol['exp_procedure'].match('decrease')) {
              switch (numPanels) {
                case 2:
                brightnessList = [100,50]
                break;
                case 4:
                brightnessList = [100,75,50,25]
                break;
                case 6:
                brightnessList = [100,80,60,40,20,10]
                break;
              }
            } else if (this.expProtocol['exp_procedure'].match('increase')) {
              switch (numPanels) {
                case 2:
                brightnessList = [50,100]
                break;
                case 4:
                brightnessList = [25,50,75,100]
                break;
                case 6:
                brightnessList = [10,20,40,60,80,100]
                break;
              }
            }
            for (let panel = 0; panel < numPanels; panel++) {
              lightConfig['brightness'][panel] = brightnessList[panel];
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = lightConfig['lights'][panel][direction] > 0 ? lightConfig['brightness'][panel] : 0 );
            }
          }
      } else if (this.expProtocol['exp_category']=='simple_seq') {
          // In either case, number of panels can change.
          if (this.expProtocol['exp_holdconstant'] == 'default_choice') {console.log('exp_holdconstant: there is a problem')}
          if (this.expProtocol['exp_firstlight'] == 'default_choice') {console.log('exp_firstlight: there is a problem')};
          if (this.expProtocol['exp_secondlight'] == 'default_choice') {console.log('exp_secondlight: there is a problem')};

          // Get the light brightness
          let lightBrightness = 0;
          if (this.expProtocol['exp_holdconstant'].match('simple_seq')) {
            let substr = this.expProtocol['exp_holdconstant'].lastIndexOf('_');
            lightBrightness = parseInt(this.expProtocol['exp_holdconstant'].substr(substr+1));
            //lightBrightness = parseInt(this.expProtocol['exp_holdconstant'].match(/\d+/)[0])
          }

          if (this.expProtocol['exp_procedure'].match('around|2alternates')) {

            // Extract and set number of panels
            if (this.expProtocol['exp_secondlight'].match('around|2alternates')) {
              let substr = this.expProtocol['exp_secondlight'].lastIndexOf('_');
              numPanels = parseInt(this.expProtocol['exp_secondlight'].substr(substr+1));
            }

            for (let panel = 0; panel < numPanels; panel++) {
              lightConfig['lights'].push({'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': Math.round(60/numPanels)})
              lightConfig['brightness'].push(lightBrightness);
            }

            // Extract light directions
            var lightSuccessions = {'left': 'top', 'top': 'right', 'right': 'bottom', 'bottom': 'left', 'topleft': 'bottomright', 'bottomright': 'topleft', 'leftright': 'topbottom', 'topbottom': 'leftright', 'alldir':'nolight', 'nolight': 'alldir' };

            var currLight = this.expProtocol['exp_firstlight'].lastIndexOf('_');
            currLight = this.expProtocol['exp_firstlight'].substr(currLight+1);
            for (let panel = 0; panel < numPanels; panel++) {
              if (currLight.match('nolight')) {
                lightConfig['brightness'][panel] = 0
              }
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = currLight.match('alldir|' + direction) ? lightConfig['brightness'][panel] : 0 );
              currLight = lightSuccessions[currLight];
            }

          } else if (this.expProtocol['exp_procedure'].match('_alternate')) {

            // Extract and set number of panels
            if (this.expProtocol['exp_lightduration'].match('_alternate')) {
              let substr = this.expProtocol['exp_lightduration'].lastIndexOf('_');
              numPanels = parseInt(this.expProtocol['exp_lightduration'].substr(substr+1));
            }

            for (let panel = 0; panel < numPanels; panel++) {
              lightConfig['lights'].push({'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': Math.round(60/numPanels)})
              lightConfig['brightness'].push(lightBrightness);
            }

            // Extract light directions
            var substr = this.expProtocol['exp_firstlight'].lastIndexOf('_');
            var firstLight = this.expProtocol['exp_firstlight'].substr(substr+1);
            substr = this.expProtocol['exp_secondlight'].lastIndexOf('_');
            var secondLight = this.expProtocol['exp_secondlight'].substr(substr+1);
            var lightSuccessions = [firstLight, secondLight];
            var counter = 0;
            for (let panel = 0; panel < numPanels; panel++) {
              currLight = lightSuccessions[counter]
              if (currLight.match('nolight')) {
                lightConfig['brightness'][panel] = 0
              }
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = currLight.match('alldir|' + direction) ? lightConfig['brightness'][panel] : 0 );
              counter = (counter + 1)%2;
            }
          }

      } else if (this.expProtocol['exp_category']=='complex_seq') {
          // Number of panels is fixed
          numPanels = 6;

          // Extract the duration and brightness of initial all dir light
          let alldirDuration = 0;
          if (this.expProtocol['exp_procedure'].match('complex_seq_alldir')) {
            let substr = this.expProtocol['exp_procedure'].lastIndexOf('_');
            alldirDuration = parseInt(this.expProtocol['exp_procedure'].substr(substr+1));
          }

          let alldirBrightness = 0;
          if (this.expProtocol['exp_holdconstant'].match('complex_seq_alldir')) {
            let substr = this.expProtocol['exp_holdconstant'].lastIndexOf('_');
            alldirBrightness = parseInt(this.expProtocol['exp_holdconstant'].substr(substr+1));
          }

          // Create light array and initial all dir light.
          for (let panel = 0; panel < numPanels; panel++) {
            if (panel < alldirDuration / 10) {
              lightConfig['lights'].push({'left': alldirBrightness, 'top': alldirBrightness, 'right': alldirBrightness, 'bottom': alldirBrightness, 'duration': Math.round(60/numPanels)})
              lightConfig['brightness'].push(alldirBrightness);
            } else {
              lightConfig['lights'].push({'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': Math.round(60/numPanels)})
              lightConfig['brightness'].push(-1);
            }
          }

          // Get the light brightness of the light sequences
          let lightBrightness = 0;
          if (this.expProtocol['exp_lightduration'].match('complex_seq')) {
            let substr = this.expProtocol['exp_lightduration'].lastIndexOf('_');
            lightBrightness = parseInt(this.expProtocol['exp_lightduration'].substr(substr+1));
          }

          // Add light sequences
          var substr = this.expProtocol['exp_firstlight'].lastIndexOf('_');
          var firstLight = this.expProtocol['exp_firstlight'].substr(substr+1);
          substr = this.expProtocol['exp_secondlight'].lastIndexOf('_');
          var secondLight = this.expProtocol['exp_secondlight'].substr(substr+1);
          switch(alldirDuration) {
            case 10:
              var lightSuccessions = [firstLight, secondLight, firstLight, secondLight, firstLight];

            break;
            case 20:
              var lightSuccessions = secondLight.match('nolight') ? [firstLight, secondLight, secondLight, firstLight] : [firstLight, secondLight, firstLight, secondLight];
            break;
            case 30:
              var lightSuccessions = [firstLight, secondLight, firstLight];
            break;
          }
          lightSuccessions.reverse(); // lightSuccessions has to be encoded backwards.
          let currLight = '';
          for (let panel = 0; panel < numPanels; panel++) {
            if (panel >= alldirDuration / 10) {
              currLight = lightSuccessions.pop();
              if (currLight.match('nolight')) {
                lightConfig['brightness'][panel] = 0
              } else {
                lightConfig['brightness'][panel] = lightBrightness;
              }
              lightDirections.forEach( (direction) => lightConfig['lights'][panel][direction] = currLight.match(direction) ? lightConfig['brightness'][panel] : 0 );
            }
          }

      } else if (this.expProtocol['exp_category']=='no_light') {
          // Just one panel
          numPanels = 1;
          lightConfig['lights'].push({'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': 60})
          lightConfig['brightness'].push(0);
      }
    }

    return lightConfig
  }

  _updateFormViews(evt) {
    if (evt.data.field._model._data.id == 'exp_category') {
      this._model._data.regions.default.forEach((field,index) => {
        if (['exp_category'].indexOf(field.id())==-1){
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

      if (!evt.data.delta.value.match('complex_seq')) {
        this._model._data.regions.default.forEach((field,index) => {
          if (['exp_category','exp_procedure','exp_holdconstant'].indexOf(field.id())==-1){
            field.showDescription(evt.data.delta.value.match('default_choice') ? 'default_choice' : evt.data.delta.value)
            if (this.state == 'new') {
              field.disable();
              field.setVisibility('hidden',0);
              field.setDefault();
            }

            this._modifyOptions(field, evt.data.delta.value)

          }
        });
      }

      //Disable options of exp_firstlight depending on what has been chose
      var field_firstlight = this._findField('exp_firstlight');
      switch (evt.data.delta.value) {
        case 'fix_dir_constant':
        case 'fix_dir_decrease':
        case 'fix_dir_increase':
          this._modifyOptions(field_firstlight,evt.data.delta.value);
          this.chainState = 'shortChainOfActivation';
        break;
        case 'simple_seq_around':
        case 'simple_seq_2alternates':
          this._modifyOptions(field_firstlight, evt.data.delta.value);
          this.chainState = 'mediumChainOfActivation';
        break;
        case 'simple_seq_alternate':
          this._modifyOptions(field_firstlight, evt.data.delta.value);
          this.chainState = 'fullChainOfActivation';
        break;
        case 'complex_seq_alldir_10':
        case 'complex_seq_alldir_20':
        case 'complex_seq_alldir_30':
          this._modifyOptions(field_firstlight, 'complex_seq');
          this.chainState = 'fullChainOfActivation';
        break;
      }

      var field_secondlight = this._findField('exp_secondlight');
      switch (evt.data.delta.value) {
        case 'fix_dir_constant':
        case 'fix_dir_decrease':
        case 'fix_dir_increase':
          this._modifyOptions(field_secondlight,evt.data.delta.value);
        break;
        case 'simple_seq_around':
        case 'simple_seq_2alternates':
          this._modifyOptions(field_secondlight, evt.data.delta.value);
        break;
        case 'simple_seq_alternate':
          this._modifyOptions(field_secondlight, evt.data.delta.value);
        break;
        case 'complex_seq_alldir_10':
        case 'complex_seq_alldir_30':
          if (!field_secondlight.isVisible()){
            this._modifyOptions(field_secondlight, 'complex_seq_nolight|complex_seq_left|complex_seq_top');
          }
        break;
        case 'complex_seq_alldir_20':
          if (!field_secondlight.isVisible()){
            this._modifyOptions(field_secondlight, 'complex_seq_nolight|complex_seq_left|complex_seq_top');
          }
        break;
      }

      var field_lightduration = this._findField('exp_lightduration');
      switch (evt.data.delta.value) {
        case 'simple_seq_alternate':
          this._modifyOptions(field_lightduration, evt.data.delta.value);
        break;
        case 'complex_seq_alldir_10':
        case 'complex_seq_alldir_15':
        case 'complex_seq_alldir_20':
        case 'complex_seq_alldir_30':
          this._modifyOptions(field_lightduration, 'complex_seq');
        break;
      }

      // Re-initialize successive fields
      if (!evt.data.delta.value.match('complex_seq')) {
        this._model._data.regions.default.forEach((field,index) => {
          if (field.id() != 'exp_category' & field.id() != 'exp_procedure' & this.state == 'new') {
            field.disable();
            field.setVisibility('hidden',0);
            field.setDefault();
          }
        });
      }
    } else if (evt.data.field._model._data.id == 'exp_firstlight') {

        var field_procedure = this._findField('exp_procedure');
        var field_procedure_value = field_procedure._model._data.value;

        var field_secondlight = this._findField('exp_secondlight');
        switch (evt.data.delta.value) {
          case 'complex_seq_left':
            if (field_procedure_value.match('15|20')) {
              this._modifyOptions(field_secondlight, evt.data.delta.value + '|complex_seq_nolight');
            } else {
              this._modifyOptions(field_secondlight, evt.data.delta.value + '|complex_seq_nolight');
            }
          break;
          case 'complex_seq_top':
            if (field_procedure_value.match('15|20')) {
              this._modifyOptions(field_secondlight, evt.data.delta.value + '|complex_seq_nolight');
            } else {
              this._modifyOptions(field_secondlight, evt.data.delta.value + '|complex_seq_nolight');
            }
          break;
        }

        // // Re-initialize successive fields
        // this._model._data.regions.default.forEach((field,index) => {
        //   if ((field.id() == 'exp_secondlight' | field.id() == 'exp_lightduration') & this.state == 'new') {
        //     field.disable();
        //     field.setVisibility('hidden',0);
        //     field.setDefault();
        //   }
        // });
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
      if ((choice.match(additionallyDisable) || !choice.match(criteria)) && !choice.match('default_choice')) {
        field.disableOption(choice)
      } else {
        field.enableOption(choice)
      }
    });

  }
}
