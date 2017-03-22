define((require) => {
  const Globals = require('core/model/globals'),
    HM = require('core/event/hook_manager'),
    Utils = require('core/util/utils');
  
  const Model = require('core/model/model'),
    defaults = {
      id: null,
      alive: false,
      type: 'note',
      message: '',
      autoExpire: null,
      expireLabel: 'OK',
      classes: []
    };

  return class NoteModel extends Model {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
      if (!this.get('id')) this.set('id', Utils.guid4());
      this.get('classes').push(`note__${this.get('type')}`);
    }
  }
})