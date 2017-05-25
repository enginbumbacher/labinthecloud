define((require) => {
  const Globals = require('core/model/globals'),
    Utils = require('core/util/utils');

  const Form = require('core/component/form/form'),
    SelectField = require('core/component/selectfield/field');

  return class ExperimentHistoryForm extends Form {
    constructor() {
      super({
        modelData: {
          id: "experiment_history",
          classes: ["form__experiment__history"],
          fields: [SelectField.create({
            id: "exp_history_id",
            label: 'Experiment',
            value: Globals.get('State.experiment.allowNew') ? "_new" : null,
            classes: [],
            options: Globals.get('State.experiment.allowNew') ? { "_new": "(New Experiment)" } : {}
          })],
          buttons: []
        }
      });

      Utils.bindMethods(this, ['_updateLastHistory'])

      this._lastHistory = null;
      this.addEventListener('Form.FieldChanged', this._updateLastHistory)
    }

    update() {
      let student_id = Globals.get('student_id');
      if (student_id) {
        let staticHistory = Globals.get('AppConfig.experiment.experimentHistory');
        let historyLoad = null;
        if (staticHistory) {
          historyLoad = Utils.promiseAjax('/api/v1/Experiments', {
            data: {
              filter: {
                where: {
                  id: {
                    inq: staticHistory
                  }
                }
              }
            }
          })
        } else {
          historyLoad = Utils.promiseAjax('/api/v1/Experiments/studentHistory', {
            data: {
              studentId: student_id
            }
          })
        }
        return historyLoad.then((data) => {
          const historySelector = this.getField('exp_history_id');
          const val = historySelector.value();
          historySelector.clearOptions();
          if (Globals.get('State.experiment.allowNew')) historySelector.addOption({ value: "_new", label: "(New Experiment)"});
          data.sort((a, b) => {
            return (new Date(b.date_created)).getTime() - (new Date(a.date_created)).getTime()
          });
          data.forEach((datum, ind) => {
            historySelector.addOption({ value: datum.id, label: (new Date(datum.date_created)).toLocaleString() });
          })
          if (val == '_new' || data.map((a) => { return a.id }).includes(parseInt(val))) {
            historySelector.setValue(val);
          } else if (data.length) {
            historySelector.setValue(data[0].id);
          } else {
            historySelector.setValue(val);
          }
        })
      } else {
        this.getField('exp_history_id').clearOptions();
        return Promise.resolve(true);
      }
    }

    getHistory() {
      return Object.keys(this.getField('exp_history_id').getOptions()).filter((item) => {
        return item != '_new';
      });
    }

    historyCount() {
      return this.getHistory().length;
    }

    _updateLastHistory(evt) {
      const last = this.getField('exp_history_id').value();
      if (last != '_new' && Utils.exists(last)) {
        this._lastHistory = last;
      }
    }

    revertToLastHistory() {
      if (this._lastHistory) {
        this.import({
          exp_history_id: this._lastHistory
        })
      }
    }

    disableNew() {
      this.getField('exp_history_id').disableOption('_new');
    }

    enableNew() {
      this.getField('exp_history_id').enableOption('_new');
    }
  }
})