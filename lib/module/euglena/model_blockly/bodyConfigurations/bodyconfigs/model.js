define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    defaults = {
      id: 0,
      selected: false
    }

  const defaultConfigs = require('./listofconfigs')


  return class BodyConfigurationsModel extends Model {
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
});
