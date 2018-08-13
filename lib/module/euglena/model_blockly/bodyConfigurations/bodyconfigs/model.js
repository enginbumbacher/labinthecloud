import Model from 'core/model/model';
import Utils from 'core/util/utils';
import defaultConfigs from './listofconfigs';
const defaults = {
  id: 0,
  selected: false
};


export default class BodyConfigurationsModel extends Model {
  constructor(settings = {}) {
    settings.data.id = settings.data.id || Utils.guid4();
    settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
    super(settings);

    Utils.bindMethods(this, ['setConfigs','getConfigId','getConfigJSON'])

  }

  setConfigs() {
    this.defaultConfigs = defaultConfigs;
//      this.defaultConfigs['labels'] = {id:'labels'};
    this.defaultConfigs['bodybackground'] = {id:'bodybckgrnd'};
  }

  getConfigId(configName) {
    return this.defaultConfigs[configName].id
  }

  getConfigJSON(configName) {
    return this.defaultConfigs[configName].config
  }

  getNumberOfSensors(configName) {
    var numSensors = 0;
    Object.keys(this.defaultConfigs[configName].config).forEach(key => { if (key.toLowerCase().match('sensor')) numSensors += 1; })
    return numSensors
  }
}
