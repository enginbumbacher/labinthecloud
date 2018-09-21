import FieldModel from 'core/component/form/field/model';
import Utils from 'core/util/utils';
const defaults = {
  showLabel: false,
  collapsible: false,
  collapsed: false,
  fields: []
};

export default class FieldGroupModel extends FieldModel {
  constructor(settings) {
    settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
    super(settings)
  }

  set(key, val) {
    if (key == "value" && Utils.exists(val)) {
      this._setValue(val)
    }
    super.set(key, val);
  }

  _setValue(val) {
    for (let field of this.get('fields')) {
      if (Object.keys(val).includes(field.id())) {
        field.setValue(val[field.id()]);
      } else {
        field.setValue(null);
      }
    }
  }

  value() {
    let val = {}
    for (let field of this.get('fields')) {
      val[field.id()] = field.value();
    }
    return val;
  }

  getSubField(id) {
    for (let field of this.get('fields')) {
      if (field.id() == id) return field;
    }
    return null;
  }

  addField(field) {
    for (let f of this.get('fields')) {
      if (f.id() == field.id()) {
        throw new Error("Field ID already exists in group");
      }
    }

    this.get('fields').push(field);
    this.set('fields', this.get('fields'));
  }

  removeField(id) {
    let foundIndex = null;
    for (let f of this.get('fields')) {
      if (f.id() == id) {
        foundIndex = this.get('fields').indexOf(f);
        break;
      }
    }
    if (Utils.exists(foundIndex)) {
      this.get('fields').splice(foundIndex, 1);
      this.set('fields', this.get('fields'));
    }
  }

  validate() {
    let subvalidations = this.get('fields')
      .filter((field) => !Utils.isEmpty(field.value()))
      .map((field) => field.validate());
    return Promise.all([super.validate(), Promise.all(subvalidations)])
      .then((validations) => {
        let sup = validations[0];
        sup.children = validations[1];
        for (let child of sup.children) {
          if (!child.isValid) {
            sup.isValid = false;
            sup.errors = sup.errors.concat(child.errors);
          }
        }
        return sup;
      });
  }

  enable() {
    this.get('fields').forEach((field) => {
      field.enable();
    })
    super.enable();
  }

  disable() {
    this.get('fields').forEach((field) => {
      field.disable();
    })
    super.disable();
  }
}
