import BaseModel from 'core/component/form/field/model';
import Utils from 'core/util/utils';
const defaults = {
    id: null,
    label: '',
    eventName: 'Button.Pressed',
    eventData: {},
    style: "button",
    killNativeEvent: true
  };

export default class ButtonModel extends BaseModel {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    super(config);
  }
}
