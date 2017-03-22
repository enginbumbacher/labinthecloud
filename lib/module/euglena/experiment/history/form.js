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
            value: "_new",
            classes: [],
            options: {
              "_new": "(New Experiment)"
            }
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
        return Utils.promiseAjax('/api/v1/Experiments', {
          data: {
            filter: {
              where: {
                studentId: student_id
              }
            }
          }
        }).then((data) => {
          const historySelector = this.getField('exp_history_id');
          const val = historySelector.value();
          historySelector.clearOptions();
          historySelector.addOption({ value: "_new", label: "(New Experiment)"});
          data.sort((a, b) => {
            return (new Date(b.date_created)).getTime() - (new Date(a.date_created)).getTime()
          });
          data.forEach((datum, ind) => {
            historySelector.addOption({ value: datum.id, label: (new Date(datum.date_created)).toLocaleString() });
          })
          historySelector.setValue(val);
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
      if (last != '_new') {
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
  }
})