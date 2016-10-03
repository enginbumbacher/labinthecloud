define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./dropsite.html'),
    Utils = require('core/util/utils')
  ;

  return class DropSiteView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onChange'])
      this._cursor = this.$el.find(".dropsite__sort__cursor");
      this._cursor.detach();
      this._itemViews = [];

      this._render(model);
      model.addEventListener('DropSite.ItemAdded', this._onChange);
      model.addEventListener('DropSite.ItemRemoved', this._onChange);
    }

    _onChange(evt) {
      this._render(evt.currentTarget, true);
    }

    _render(model) {
      this.$el.removeClass("dropsite__list dropsite__inline").addClass(`dropsite__${model.get('style')}`);
      while (this._itemViews.length) {
        this.removeChild(this._itemViews.pop());
      }

      model.get('items').forEach((item) => {
        this.addChild(item.view(), ".dropsite__contents");
        this._itemViews.push(item.view());
      });
    }

    sortPosition(proxy, mousePos, model) {
      if (model.get('sortable')) {
        let sortPos = 0;
        let bounds = this.$el.find(".dropsite__contents").offset();
        bounds.width = 0;
        bounds.height = 0;
        for (let iv of this._itemViews) {
          if (!iv.$dom().is(':visible')) {
            //invisible elements report a (left,top) of (0,0), so we use the previous bounds as reference
            bounds = {
              top: bounds.top + bounds.height,
              left: bounds.left + bounds.width,
              width: 0,
              height: 0
            }
          } else {
            bounds = iv.bounds();
          }
          if (model.get('style') == "list") {
            if (mousePos.y < mousePos.top) {
              break;
            }
            if (mousePos.y > bounds.top + bounds.height / 2) {
              sortPos += 1;
            }
          } else if (model.get('style') == "inline") {
            if (mousePos.x < bounds.left || bounds.top > mousePos.y) {
              break;
            }
            if (mousePos.x > bounds.left + bounds.width / 2) {
              sortPos += 1;
            }
          } else {
            sortPos += 1
          }
        }
        return sortPos;
      } else {
        return model.count();
      }
    }

    checkOverlap(proxy, mousePos, model) {
      let overlapType = model.get('overlap');
      if (this.hasOwnProperty(`_checkOverlap_${overlapType}`)) {
        return this[`_checkOverlap_${overlapType}`](proxy, mousePos, model);
      } else {
        return this._checkOverlap_mouse(proxy, mousePos);
      }
    }

    _checkOverlap_mouse(proxy, mousePos, model) {
      let bounds = this.bounds();
      return bounds.left <= mousePos.x <= bounds.left + bounds.width && bounds.top <= mousePos.y <= bounds.top + bounds.height;
    }

    _checkOverlap_minkowski(proxy, mousePos, model) {
      let bounds = this.bounds()
      let proxyBounds = proxy.bounds()
      let sumBounds = {
        left: bounds.left - proxyBounds.width,
        top: bounds.top - proxyBounds.height,
        width: bounds.width + proxyBounds.width,
        height: bounds.height + proxyBounds.height
      };
      return sumBounds.left <= proxyBounds.left <= sumBounds.left + sumBounds.width && sumBounds.top <= proxyBounds.top <= sumBounds.top + sumBounds.height;
    }

    handleCandidacy(pos) {
      if (pos == 0) {
        this._cursor.insertBefore(this._itemViews[0].$dom());
      } else {
        this._cursor.insertAfter(this._itemViews[pos-1].$dom());
      }
    }

    clearCursor() {
      this._cursor.detach()
    }
  };
});