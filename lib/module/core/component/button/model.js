define((require) => {
  const BaseModel = require('core/component/form/field/model'),
    Utils = require('core/util/utils'),
    defaults = {
      id: null,
      label: '',
      eventName: 'Button.Pressed',
      eventData: {},
      style: "button",
      killNativeEvent: true
    };

  return class ButtonModel extends BaseModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      super(config);
    }
  }
});
