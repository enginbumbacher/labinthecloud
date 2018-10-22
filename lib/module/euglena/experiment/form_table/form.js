import Globals from 'core/model/globals';
import Form from 'core/component/form/form';
import Button from 'core/component/button/field';
import LightMatrix from './lightmatrix/field';
import Utils from 'core/util/utils';
import TextField from 'core/component/textfield/field';

export default class ExperimentForm extends Form {
  constructor() {
    const lightsDefault = Globals.get('State.experiment.allowNew') ? [{
      left: 100,
      duration: 15
    }, {
      top: 100,
      duration: 15
    }, {
      bottom: 100,
      duration: 15
    }, {
      right: 100,
      duration: 15
    }] : [];
    const buttons = [Button.create({
      id: 'dry_run',
      label: 'Dry Run',
      classes: ['form__experiment__dry_run'],
      eventName: 'Experiment.DryRun'
    }), Button.create({
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
    if (Globals.get('State.experiment.allowNew')) {
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
    fields.push(LightMatrix.create({
      id: "lights",
      value: lightsDefault,
      validation: {
        custom: {
          test: 'custom',
          fn: (val) => {
            const total = val.map((field) => field.duration ? field.duration : 0).reduce((prev, curr, currInd, arr) => prev + curr, 0);
            return Promise.resolve(total == Globals.get('AppConfig.experiment.maxDuration'));
          },
          errorMessage: `Total experiment duration must be exactly ${Globals.get('AppConfig.experiment.maxDuration')} seconds.`
        }
      }
    }));

    super({
      modelData: {
        id: "experiment",
        classes: ["form__experiment"],
        fields: fields,
        buttons: buttons
      }
    })

    this.setState('new');
  }


  setState(state) {
    this.state = state;
    switch (state) {
      case "historical":
      this.getField('name').disable();
        switch (Globals.get('AppConfig.system.experimentModality').toLowerCase()) {
          case "observe":
            this.getField('lights').disable();
            this.getButton('dry_run').view().hide();
            this.getButton('submit').view().hide();
            if (Globals.get('State.experiment.allowNew')) { this.getButton('new').view().hide();}
            this.getButton('aggregate').view().hide();
          break;
          case "explore":
            this.getField('lights').disable();
            this.getButton('dry_run').view().hide();
            this.getButton('submit').view().hide();
            if (Globals.get('State.experiment.allowNew')) { this.getButton('new').view().hide();}
           this.getButton('aggregate').view().hide();
          break;
          case "create":
          case "createandhistory":
            this.getField('lights').disable();
            this.getButton('dry_run').view().hide();
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
        this.getField('name').enable();
        this.getField('lights').enable();
        this.getButton('dry_run').view().show();
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
}
