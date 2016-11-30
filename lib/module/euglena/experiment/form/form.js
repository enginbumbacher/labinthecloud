define((require) => {
  const Form = require('core/component/form/form'),
    Button = require('core/component/button/field'),
    LightMatrix = require('./lightmatrix/field'),
    Utils = require('core/util/utils')
  ;

  return class ExperimentForm extends Form {
    constructor() {
      super({
        modelData: {
          id: "experiment",
          classes: ["form__experiment"],
          title: "Programmable Light Controls",
          fields: [LightMatrix.create({
            id: "lights",
            value: [{
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
            }]
          })],
          buttons: [Button.create({
            id: 'dry_run',
            label: 'Dry Run',
            eventName: 'Experiment.DryRun'
          }), Button.create({
            id: 'submit',
            label: 'Submit',
            eventName: 'Experiment.Submit'
          })]
        }
      })
    }
  }
})