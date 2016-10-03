define((require) => {
  const FieldView = require('core/component/form/field/view'),
    Template = require('text!./container.html'),
    Button = require('core/component/button/field'),
    FieldWrap = require('./fieldwrap/fieldwrap'),
    DropSite = require('core/component/dragdrop/dropsite/dropsite'),
    DragDropManager = require('core/component/dragdrop/manager'),
    Utils = require('core/util/utils'),
    DomView = require('core/view/dom_view')
  ;
  require('link!./multifield.css');

  return class MultifieldView extends FieldView {
    constructor(model, tmpl) {
      super(model, tmpl || Template);
      Utils.bindMethods(this, ['_onOrderChange', '_onModelChange'])

      this._labelContainer = this.$el.find(".multifield__label")
      this._fieldWraps = {}

      this._ddm = new DragDropManager({
        modelData: {
          bounds: new DomView(this.$el.find(".multifield__fields")),
          allowMultiSelect: true
        }
      });

      this._ddm.addEventListener('DragDrop.ContainmentChange', this._onOrderChange)

      this._subfieldContainer = new DropSite();
      this.addChild(this._subfieldContainer.view(), ".multifield__fields");
      this._ddm.addDropSite(this._subfieldContainer);

      this.buttons = {
        add: Button.create({
          id: "multifield__add",
          label: model.get('addButtonLabel'),
          eventName: "MultiField.AddFieldRequest",
          style: "add"
        })
      };

      this.addChild(this.buttons.add.view(), ".multifield__buttons");
      
      this._render(model);
      this._renderFields(model);
      model.addEventListener('Model.Change', this._onModelChange);
    }

    _onOrderChange(evt) {
      this.dispatchEvent('MultiField.OrderChangeRequest', {
        order: this._subfieldContainer.export()
      });
    }

    _onModelChange(evt) {
      super._onModelChange(evt);
      if (evt.data.path == "locked") {
        this._handleLockedFields(evt.data.value);
      } else if (evt.data.path == "fields") {
        this._renderFields(evt.currentTarget);
      } else {
        this._render(evt.currentTarget);
      }
    }

    _render(model) {
      if (model.get('sortable')) {
        this._ddm.enable()
      } else {
        this._ddm.disable()
      }

      this._labelContainer.html(model.get('label'))

      this.$el.toggleClass("field__error", model.get('hasError'));
      this._handleLockedFields(model.get('locked'));
    }

    _renderFields(model) {
      this._subfieldContainer.empty()

      model.get('fields').forEach((field, ind) => {
        let wrap;
        if (Utils.exists(!this._fieldWraps[field.id()])) {
          wrap = new FieldWrap({
            modelData: {
              trigger: model.get('dragTrigger'),
              field: field,
              classes: model.get('dragClasses')
            }
          });
          this._fieldWraps[field.id()] = wrap;
          this._ddm.addDragItem(wrap);
        } else {
          wrap = this._fieldWraps[field.id()];
        }
        this._subfieldContainer.receive([wrap]);
      })

      if (Utils.exists(model.get('max')) && this._subfieldContainer.count() >= model.get('max')) {
        this.buttons.add.view().hide()
      } else {
        this.buttons.add.view().show()
      }

      let item;
      if (this._subfieldContainer.count() <= model.get('min')) {
        for (item of this._subfieldContainer.items()) {
          item.hideRemoveButton();
        }
      }
      else {
        for (item of this._subfieldContainer.items()) {
          item.showRemoveButton();
        }
      }
    }

    _handleLockedFields(locked) {
      let lockedViews = Array.from(locked).map((field) => field.view())
      for (let field of this._subfieldContainer.items()) {
        if (lockedViews.includes(field.fieldView())) {
          field.lock()
        } else {
          field.unlock()
        }
      }
    }
    
    focus() {
      if (this._subfieldContainer.items().length) {
        this._subfieldContainer.items()[0].focus()
      }
    }
  }
})