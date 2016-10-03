define((require) => {
  const Component = require('core/component/component'),
    $ = require('jquery'),
    Model = require('./model'),
    ProxyView = require('./proxyview'),
    Utils = require('core/util/utils')
  ;

  return class DragDropManager extends Component {
    constructor(settings) {
      settings.modelClass = settings.modelClass || Model;
      settings.modelData = settings.modelData || {};
      settings.modelData.proxyView = settings.modelData.proxyView || ProxyView;
      super(settings);
      Utils.bindMethods(this, [
        '_onRelease', '_onMove',
        '_onDragRequest', '_onSelectRequest', '_onMultiSelectRequest',
        '_onDropCandidate', '_onDropRevoke',
        '_onProxyRemovalRequest',
        '_onItemSelected', '_onItemDeselected'
      ])

      if (!['relative', 'absolute'].includes(this._model.get('bounds').$dom().css('position'))) {
        this._model.get('bounds').$dom().css('position', 'relative');
      }

      window.addEventListener('mouseup', this._onRelease);
      window.addEventListener('touchend', this._onRelease);
      window.addEventListener('mousemove', this._onMove);
      window.addEventListener('touchmove', this._onMove);
    }

    addDragItem(drag) {
      this._model.addDragItem(drag);
      drag.addEventListener('DragItem.RequestDrag', this._onDragRequest);
      drag.addEventListener('DragItem.RequestSelect', this._onSelectRequest);
      drag.addEventListener('DragItem.RequestMultiSelect', this._onMultiSelectRequest);
    }

    removeDragItem(drag) {
      this._model.removeDragItem(drag);
      drag.removeEventListener('DragItem.RequestDrag', this._onDragRequest);
      drag.removeEventListener('DragItem.RequestSelect', this._onSelectRequest);
      drag.removeEventListener('DragItem.RequestMultiSelect', this._onMultiSelectRequest);
    }

    removeAllDragItems() {
      for (let id in this._model.get('dragItems')) {
        this.removeDragItem(this._model.get('dragItems')[id]);
      }
      this._model.set('dragItems', {});
    }

    addDropSite(drop) {
      this._model.addDropSite(drop);
      drop.addEventListener('DropSite.NominateDropCandidate', this._onDropCandidate);
      drop.addEventListener('DropSite.RevokeDropCandidacy', this._onDropRevoke);
    }
    removeDropSite(drop) {
      this._model.removeDropSite(drop);
      drop.removeEventListener('DropSite.NominateDropCandidate', this._onDropCandidate);
      drop.removeEventListener('DropSite.RevokeDropCandidacy', this._onDropRevoke);
    }

    _onDropCandidate(evt) {
      if (this._model.get('dragging')) {
        if (this._dropCandidate && this._dropCandidate != evt.currentTarget) {
          this._dropCandidate.handleLostCandidacy();
        }
        this._dropCandidate = evt.currentTarget;
        this._dropPosition = evt.data.position;
        this._dropCandidate.handleCandidacy(this._dropPosition);
      }
    }

    _onDropRevoke(evt) {
      if (this._dropCandidate == evt.currentTarget) {
        this._dropCandidate.handleLostCandidacy();
        this._dropCandidate = null;
        this._dropPosition = null;
      }
    }

    _onDragRequest(evt) {
      if (this.isActive()) {
        $('body').addClass('dragdrop__dragging');
        this._model.set('dragging', true);
        let proxyClass = this._model.get('proxyView');
        this._dragProxy = new proxyClass({
          selected: this._model.get('selected'),
          referencePosition: evt.data,
          boundsPosition: this._model.get('bounds').$dom().offset()
        })
        this._model.get('selected').forEach((item) => {
          item.handleDrag();
        })
        this._dragProxy.addEventListener('DragProxy.RequestRemoval', this._onProxyRemovalRequest)
        this._model.get('bounds').addChild(this._dragProxy);
        this._dragProxy.reveal();
        this._dragProxy.updatePosition({
          left: evt.data.left - this._model.get('bounds').$dom().offset().left,
          top: evt.data.top - this._model.get('bounds').$dom().offset().top,
          maxWidth: this._model.get('bounds').$dom().outerWidth(),
          maxHeight: this._model.get('bounds').$dom().outerHeight()
        })
      }
    }

    _onProxyRemovalRequest(evt) {
      this._model.get('bounds').removeChild(evt.currentTarget);
    }

    _onRelease(jqevt) {
      if (this.isActive() && this._model.get('dragging')) {
        $('body').removeClass('dragdrop__dragging');
        this._model.set('dragging', false);
        this._model.get('selected').forEach((item) => {
          item.endDrag();
        });
        if (this._dropCandidate) {
          this._dropCandidate.receive(Array.from(this._model.get('selected')), this._dropPosition);
          this._dragProxy.enter(this._dropCandidate);
          this._dropCandidate = null;
          this._model.clearSelection();
          this.dispatchEvent('DragDrop.ContainmentChange', {
            sites: this._model.get('dropSites'),
            items: this._model.get('dragItems')
          })
        } else {
          this._dragProxy.revert();
        }
      } else if (!this._model.get('dragging')) {
        let itemClicked = false;
        let clickParents = $(jqevt.target).parents().toArray();
        for (let id in this._model.get('dragItems')) {
          let item = this._model.get('dragItems')[id];
          if (clickParents.includes(item.view().dom())) {
            itemClicked = true;
            break;
          }
        }
        if (itemClicked) {
          this._model.clearSelection();
        }
      }
    }

    _onMove(jqevt) {
      if (this._model.get('dragging')) {
        this._dragProxy.updatePosition({
          left: jqevt.pageX - this._model.get('bounds').$dom().offset().left,
          top: jqevt.pageY - this._model.get('bounds').$dom().offset().top,
          maxWidth: this._model.get('bounds').$dom().outerWidth(),
          maxHeight: this._model.get('bounds').$dom().outerHeight()
        })
        for (let id in this._model.get('dropSites')) {
          let dropsite = this._model.get('dropSites')[id];
          dropsite.checkOverlap(this._dragProxy, {
            x: jqevt.pageX,
            y: jqevt.pageY
          })
        }
      }
    }

    _onSelectRequest(evt) {
      if (this.isActive() && !this._model.get('selected').has(evt.currentTarget)) {
        this._model.select(evt.currentTarget);
      }
    }

    _onMultiSelectRequest(evt) {
      if (this.isActive()) {
        this._model.multiselect(evt.currentTarget);
      }
    }
    _onItemSelected(evt) {
      evt.data.element.select();
    }
    _onItemDeselected(evt) {
      evt.data.element.deselect();
    }
  };
})