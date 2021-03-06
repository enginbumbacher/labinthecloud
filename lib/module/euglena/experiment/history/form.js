import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import Form from 'core/component/form/form';
import SelectField from 'core/component/selectfield/field';

export default class ExperimentHistoryForm extends Form {
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
          options: Globals.get('State.experiment.allowNew') ? { "_new": "(New Experiment)" } : {},
          description: 'Choose different experiments that have been generated or saved previously.'
        })],
        buttons: []
      }
    });

    Utils.bindMethods(this, ['_updateLastHistory'])

    this._lastHistory = null;
    this.addEventListener('Form.FieldChanged', this._updateLastHistory)
  }

  updateHistory() {
    let student_id = Globals.get('student_id');
    let oldCount = this.historyCount();
    if (student_id) {
      let staticHistory = Globals.get('AppConfig.experiment.experimentHistory');
      let historyLoad = null;
      if (staticHistory && staticHistory.length) {
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
            studentId: student_id,
            lab: Globals.get('AppConfig.lab')
          }
        })
      }

      if (staticHistory && ['create', 'createAndHistory'].includes(Globals.get('AppConfig.system.experimentModality'))) {
        return Utils.promiseAjax('/api/v1/Experiments/studentHistory', {
          data: {
            studentId: student_id,
            lab: Globals.get('AppConfig.lab')
          }
        }).then((newdata) => {
           historyLoad.then((data) => {
            data = data.concat(newdata)

            const historySelector = this.getField('exp_history_id');
            const val = historySelector.value();
            historySelector.clearOptions();
            if (Globals.get('State.experiment.allowNew')) historySelector.addOption({ value: "_new", label: "(New Experiment)"});
            data.sort((a, b) => {
              return (new Date(b.date_created)).getTime() - (new Date(a.date_created)).getTime()
            });
            let unnamedCount = data.filter((a) => !a.name).length;
            let unnamed = 0;
            data.forEach((datum, ind) => {
              let label = '';
              if (datum.name) {
                label = datum.name;
              } else {
                label = "Experiment ".concat(String.fromCharCode(65 + unnamedCount - unnamed - 1));
                unnamed += 1;
              }
              historySelector.addOption({ value: datum.id, label:  label });
              //historySelector.addOption({ value: datum.id, label: (new Date(datum.date_created)).toLocaleString() });
            })
            if (val == '_new' || data.map((a) => { return a.id }).includes(parseInt(val))) {
              historySelector.setValue(val);
            } else if (data.length) {
              historySelector.setValue(data[0].id);
            } else {
              historySelector.setValue(val);
            }
            Globals.get('Relay').dispatchEvent('ExperimentCount.Change', {
              old: oldCount,
              count: this.historyCount()
            })
          })
        })
      } else {
        return historyLoad.then((data) => {
          const historySelector = this.getField('exp_history_id');
          const val = historySelector.value();
          historySelector.clearOptions();
          if (Globals.get('State.experiment.allowNew')) historySelector.addOption({ value: "_new", label: "(New Experiment)"});
          data.sort((a, b) => {
            return (new Date(b.date_created)).getTime() - (new Date(a.date_created)).getTime()
          });
          let unnamedCount = data.filter((a) => !a.name).length;
          let unnamed = 0;
          data.forEach((datum, ind) => {
            let label = '';
            if (datum.name) {
              label = datum.name;
            } else {
              label = "Experiment ".concat(String.fromCharCode(65 + unnamedCount - unnamed - 1));
              unnamed += 1;
            }
            historySelector.addOption({ value: datum.id, label: label });
            //historySelector.addOption({ value: datum.id, label: (new Date(datum.date_created)).toLocaleString() });
          })
          if (val == '_new' || data.map((a) => { return a.id }).includes(parseInt(val))) {
            historySelector.setValue(val);
          } else if (data.length) {
            historySelector.setValue(data[0].id);
          } else {
            historySelector.setValue(val);
          }
          Globals.get('Relay').dispatchEvent('ExperimentCount.Change', {
            old: oldCount,
            count: this.historyCount()
          })
        })
      }

    } else {
      this.getField('exp_history_id').clearOptions();
      Globals.get('Relay').dispatchEvent('ExperimentCount.Change', {
        old: oldCount,
        count: this.historyCount()
      })
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
