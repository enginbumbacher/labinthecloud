import DomView from 'core/view/dom_view';
import Template from './dragitem.html';
import $ from 'jquery';
import Utils from 'core/util/utils';

import './dragitem.scss';

export default class DragItemView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onChange', '_onMouseDown', '_onMouseUp', '_dragStart'])

    if (model.get('trigger') != ".dragitem__grip")
      this.$el.find(".dragitem__grip").detach();

    this._render(model);
    this.addChild(model.get('contents'), ".dragitem__contents");
    
    if (Utils.exists(model.get('trigger'))) {
      this._trigger = this.$el.find(model.get('trigger')).first();
    } else {
      this._trigger = this.$el;
    }

    this._trigger.addClass("dragitem__trigger");

    model.addEventListener('Model.Change', this._onChange);

    this._trigger.on('mousedown touchstart', this._onMouseDown);
    this._trigger.on('mouseup touchend', this._onMouseUp);
  }

  _onChange(evt) {
    this._render(evt.currentTarget);
  }

  _render(model) {
    this.$el.toggleClass("dragitem__selected", model.get('selected'));
  }

  _onMouseDown(jqevt) {
    // allow typical UI to pass through without triggering a drag
    if (['input', 'textarea', 'a', 'button'].includes(jqevt.target.tagName.toLowerCase()))
      return true;

    // allow drag items within drag items to function, but not trigger
    // dragging of multiple elements.
    if ($(jqevt.target).parentsUntil(this.$el, ".component__dragitem").length) {
      jqevt.stopImmediatePropagation();
      return true;
    }

    this._moveReference = {
      left: jqevt.pageX,
      top: jqevt.pageY,
      timestamp: Date.now()
    };
    let evtName = 'DragItem.RequestSelect';
    if (jqevt.shiftKey) {
      evtName = 'DragItem.RequestMultiSelect';
      Utils.clearTextSelection();
    }
    this.dispatchEvent(evtName, {});
    this._dragRef = {
      left: jqevt.pageX,
      top: jqevt.pageY
    };
    this._dragStartTimeout = setTimeout(this._dragStart, 100);
  }

  _dragStart() {
    if (Utils.exists(this._moveReference)) {
      this.dispatchEvent('DragItem.RequestDrag', this._dragRef);
      this._dragRef = null;
    }
  }

  _onMouseUp(jqevt) {
    this._moveReference = null;
  }

  handleDrag() {
    this.$el.addClass('dragitem__dragging');
  }

  endDrag() {
    this.$el.removeClass('dragitem__dragging');
  }
}
