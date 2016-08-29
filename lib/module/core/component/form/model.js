define((require) => {
  const Model = require('core/model/model'),
    Utils = require('core/util/utils'),
    defaults = {
      id: '',
      title: null,
      help: null,
      regions: {},
      buttons: [],
      classes: [],
      errors: []
    };

  return class FormModel extends Model {
    constructor(settings) {
      if (settings.data.fields) {
        settings.data.regions = settings.data.regions || {};
        settings.data.regions.default = settings.data.fields;
        delete settings.data.fields;
      }
      settings.defaults = Utils.ensureDefaults(settings.defaults, defaults);
      super(settings);
      this._onFieldChanged = this._onFieldChanged.bind(this);

      for (let field of this.getFields()) {
        field.addEventListener('Field.Change', this._onFieldChanged);
      }
    }

    validate() {
      return Promise.all(this.getFields().map((field) => field.validate()))
        .then((tests) => {
          let valid = {
            id: this.get('id'),
            isValid: true,
            children: tests
          };
          for (let child of tests) {
            if (!child.isValid) {
              valid.isValid = false
              break;
            }
          }
          return valid;
        });
    }

    addField(field, region = 'default') {
      let regions = this.get('regions');
      regions[region] = regions[region] || [];
      let fields = regions[region];
      fields.push(field);
      field.addEventListener('Field.Change', this._onFieldChanged);
      this.set('regions', regions);
      this.dispatchEvent('Form.FieldAdded', {
        added: field,
        region: region
      });
    }

    removeField(field) {
      let regions, region, regionId, fields;
      regions = this.get('regions');
      for (region in regions) {
        fields = regions[region];
        if (fields.includes(field)) {
          regionId = region;
          break;
        }
      }
      if (regionId) {
        fields = regions[regionId];
        fields.splice(fields.indexOf(field), 1);
        field.removeEventListener('Field.Change', this._onFieldChanged);
        this.set('regions', regions);
        this.dispatchEvent('Form.FieldRemoved', {
          removed: field,
          region: regionId
        });
      }
    }

    getFields() {
      let all, regions, regionId, field;
      all = [];
      regions = this.get('regions')
      for (regionId in regions) {
        for (field of regions[regionId]) {
          all.push(field);
        }
      }
      return all;
    }

    addButton(button, ind = null) {
      if (!this.get('buttons').map((btn) => btn.id()).includes(button.id())) {
        let buttons = this.get('buttons')
        if (ind) {
          buttons.splice(ind, 0, button);
        } else {
          buttons.push(button)
        }
        this.set('buttons', buttons);
      }
    }

    removeButton(buttonId) {
      let buttons, ind;
      ind = this.get('buttons').filter((btn) => btn.id() === buttonId).map((btn) => this.get('buttons').indexOf(btn));
      if (ind.length) {
        ind = ind[0];
        buttons = this.get('buttons')
        buttons.splice(ind, 1)
        this.set('buttons', buttons);
      }
    }

    getButton(buttonId) {
      for (let btn of this.get('buttons')) {
        if (btn.id() == buttonId) {
          return btn;
        }
      }
      return null;
    }

    _onFieldChanged(evt) {
      this.dispatchEvent('Form.FieldChanged', {
        field: evt.currentTarget,
        delta: evt.data
      })
    }

    clear() {
      for (let field of this.getFields()) {
        field.clear();
      }
    }
  };
});