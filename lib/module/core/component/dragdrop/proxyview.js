define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./proxyview.html');
  require('link!./dragdrop.css');

  return class DragProxyView extends DomView {
    constructor(data) {
      super(Template);
      this._data = data;
      this.$el.find(".dragdrop__selected__count").text(this._data.selected.size);
    }

    updatePosition(pos) {
      this.$el.css({
        left: Math.min(pos.maxWidth - this.$el.outerWidth(), Math.max(0, pos.left - this.$el.outerWidth() / 2)),
        top: Math.min(pos.maxHeight - this.$el.outerHeight(), Math.max(0, pos.top - this.$el.outerHeight() / 2))
      });
    }

    reveal() {}

    enter(dropsite) {
      this.dispatchEvent('DragProxy.RequestRemoval');
    }

    revert() {
      this.$el.animate({
        top: this._data.referencePosition.top - this._data.boundsPosition.top - this.$el.outerHeight() / 2,
        left: this._data.referencePosition.left - this._data.boundsPosition.left - this.$el.outerWidth() / 2,
        opacity: 0
      }, {
        duration: 300,
        complete: () => {
          this.dispatchEvent('DragProxy.RequestRemoval');
        }
      });
    }
  };
});