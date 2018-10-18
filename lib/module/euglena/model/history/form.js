import Globals from 'core/model/globals';
import Utils from 'core/util/utils';
import HM from 'core/event/hook_manager';
import Form from 'core/component/form/form';
import SelectField from 'core/component/selectfield/field';

class ModelHistoryForm extends Form {
  constructor(settings = {}) {
    const defaults = {
      modelData: {
        classes: ["form__model__history"],
        fields: [SelectField.create({
          id: "model_history_id",
          label: 'Model',
          value: "_new",
          classes: [],
          options: { "_new": "(New Model)" },
          description: 'Choose different models that have been generated or saved previously.'
        })],
        buttons: []
      }
    };
    settings = Utils.ensureDefaults(settings, defaults);
    super(settings);
  }

  updateHistory() {
    let student_id = Globals.get('student_id');
    if (student_id) {
      // let staticHistory = Globals.get('AppConfig.model.modelHistory');
      let staticHistory = this._model.get('tabStaticHistory');
      let historyLoad = null;
      if (staticHistory && staticHistory.length) {
        staticHistory = staticHistory.map((mid) => parseInt(mid));

        historyLoad = Utils.promiseAjax('/api/v1/EuglenaModels', {
          data: {
            filter: JSON.stringify({
              where: {
                and: [
                  { id: { inq: staticHistory } },
                  { modelType: this._model.get('modelType') }
                ]
              }
            })
          }
        })
      } else {
        historyLoad = Utils.promiseAjax('/api/v1/EuglenaModels', {
          data: {
            filter: {
              where: {
                and: [
                  { studentId: student_id },
                  { modelType: this._model.get('modelType') },
                  { lab: Globals.get('AppConfig.lab') },
                  { simulated: false }
                ]
              }
            }
          }
        })
      }

      if (staticHistory && staticHistory.length && Globals.get('AppConfig.system.modelModality')==='create') {
        return Utils.promiseAjax('/api/v1/EuglenaModels', {
          data: {
            filter: {
              where: {
                and: [
                  { studentId: student_id },
                  { modelType: this._model.get('modelType') },
                  { lab: Globals.get('AppConfig.lab') },
                  { simulated: false }
                ]
              }
            }
          }
        }).then((newdata) => {
          historyLoad.then((data) => {
             data = data.concat(newdata)

             const historySelector = this.getField('model_history_id');
             const val = historySelector.value();
             historySelector.clearOptions();
             if (Globals.get('AppConfig.system.modelModality')==='create') {
               historySelector.addOption({ value: "_new", label: "(New Model)"});
             }
             data.sort((a, b) => {
               return (new Date(b.date_created)).getTime() - (new Date(a.date_created)).getTime()
             });
             data.forEach((datum, ind) => {
               historySelector.addOption({ value: datum.id, label: datum.name });
             });
             if (val == '_new' || data.map((a) => { return a.id }).includes(parseInt(val))) {
               historySelector.setValue(val);
             } else if (data.length) {
               historySelector.setValue(data[0].id);
             } else {
               historySelector.setValue('_new');
             }
           })
         })
      } else {
        return historyLoad.then((data) => {
          const historySelector = this.getField('model_history_id');
          const val = historySelector.value();
          historySelector.clearOptions();
          if (Globals.get('AppConfig.system.modelModality')==='create') {
            historySelector.addOption({ value: "_new", label: "(New Model)"});
          }
          data.sort((a, b) => {
            return (new Date(b.date_created)).getTime() - (new Date(a.date_created)).getTime()
          });
          data.forEach((datum, ind) => {
            historySelector.addOption({ value: datum.id, label: datum.name });
          });
          if (val == '_new' || data.map((a) => { return a.id }).includes(parseInt(val))) {
            historySelector.setValue(val);
          } else if (data.length) {
            historySelector.setValue(data[0].id);
          } else {
            historySelector.setValue('_new');
          }
        })
      }
    } else {
      this.getField('model_history_id').clearOptions();
      return Promise.resolve(true);
    }
  }

  getHistory() {
    return Object.keys(this.getField('model_history_id').getOptions()).filter((item) => {
      return item != '_new';
    });
  }

  historyCount() {
    return this.getHistory().length;
  }
}

ModelHistoryForm.create = (data) => {
  return new ModelHistoryForm({ modelData: data });
}

export default ModelHistoryForm;
