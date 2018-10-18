import FieldModel from 'core/component/form/field/model';
import Utils from 'core/util/utils';

const defaults = {
  childClass: null,
  childSettings: {},
  childFactory: null,
  fields: [],
  locked: null,
  defaultValue: [],
  min: 0,
  max: null,
  sortable: true,
  dragTrigger: ".dragitem__grip",
  dragClasses: [],
  addButtonLabel: "add",
  addEvent: true
};

export default class MultiFieldModel extends FieldModel {
  constructor(settings) {
    settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
    settings.defaults.locked = settings.defaults.locked || new Set();
    super(settings);
    this._onFieldChange = this._onFieldChange.bind(this);
    this._onFieldAdded = this._onFieldAdded.bind(this);

    this.setValue(this.value());
  }

  setValue(value) {
    this.get('fields').forEach((field) => {
      field.removeEventListener('Field.Change', this._onFieldChange);
    })
    this.set('fields', []);
    if (value) {
      // return Promise.all(value.map((item) => this.createField(item)))
      return Utils.promiseSerial(value.map((item, ind) => this.createField(item, ind)))
        .then(() => {
          if (Utils.exists(this.get('childClass')) && this.get('fields').length < this.get('min')) {
            const minProm = [];
            for (let i = this.get('fields').length; i < this.get('min'); i++) {
              minProm.push(this.createField(null));
            }
            return Promise.all(minProm)
          }
        });
    } else {
      return Promise.resolve(true);
    }
  }

  createField(value, mfc = null) {
    if (mfc === null) {
      mfc = this.get('fields').length;
    }
    let factory, childPromise;

    if (Utils.exists(this.get('max')) && mfc >= this.get('max')) {
      return Promise.resolve(null);
    }

    if (factory = this.get('childFactory')) {
      childPromise = factory({
        id: Utils.guid4(),
        value: value,
        _multifield_count: mfc
      })
    } else {
      let cls = this.get('childClass');
      let childDefaults = this.get('childSettings');
      childPromise = Promise.resolve(new cls({
        modelData: Utils.ensureDefaults({
          id: Utils.guid4(),
          value: value,
          _multifield_count: mfc
        }, childDefaults)
      }))
    }

    return childPromise.then((child) => {
      if (child) {
        child.addEventListener('Field.Change', this._onFieldChange);
        let fields = this.get('fields');
        fields.push(child);
        this.set('fields', fields);
        this._onFieldAdded();
      }
    }, (err) => {
      this._handleChildError(err);
    })
  }

  _handleChildError(err) {
    console.log(err)
  }

  removeField(id) {
    if (this.get('fields').length <= this.get('min')) {
      return;
    }

    let fields = this.get('fields');
    let index;
    for (let ind = 0; ind < fields.length; ind++) {
      if (fields[ind].id() == id) {
        index = ind;
        break;
      }
    }
    let removed = fields[index];
    if (this.get('locked').has(removed)) {
      return;
    }
    removed.removeEventListener('Field.Change', this._onFieldChange);
    fields.splice(index, 1);
    this.set('fields', fields);
    this._onFieldChange();
  }

  _onFieldChange(evt) {
    this.set('value', this.get('fields').map((field) => field.value()));
  }

  _onFieldAdded(evt) {
    if (this.get('addEvent')) {
      this._onFieldChange();
    }
  }

  setChildMeta(cls, init) {
    this.set('childClass', cls);
    this.set('childDefaults', init);
    this.reset();
  }

  reset() {
    this.set('fields', []);
    while(this.get('fields').length < this.get('min')) {
      this.createField(null);
    }
  }

  lockField(ind) {
    let locked = this.get('locked');
    locked.add(this.get('fields')[ind]);
    this.set('locked', locked);
  }
  unlockField(ind) {
    let locked = this.get('locked');
    locked.delete(this.get('fields')[ind]);
    this.set('locked', locked);
  }

  validate() {
    return Promise.all([
        super.validate(), 
        Promise.all(
          this.get('fields')
            .filter((field) => !Utils.isEmpty(field.value()))
            .map((field) => field.validate())
        )
      ])
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

  updateOrder(orderedIds) {
    let existingIds = this.get('fields').map((field) => field.id())
    if (orderedIds.length != this.get('fields').length || orderedIds.filter((id) => !existingIds.includes(id)).length) {
      throw new Error("Attempt to change order also adds or removes content.");
    }

    let newFields = [];
    for (let id of orderedIds) {
      for (let field of this.get('fields')) {
        if (field.id() == id) {
          newFields.push(field);
          break;
        }
      }
    }
    this.set('fields', newFields);
    this._onFieldChange();
  }

  enable() {
    this.get('fields').forEach((field) => {
      field.enable();
    })
    super.enable()
  }

  disable() {
    this.get('fields').forEach((field) => {
      field.disable();
    });
    super.disable()
  }
}
