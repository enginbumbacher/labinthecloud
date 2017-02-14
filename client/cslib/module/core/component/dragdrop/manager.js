'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      $ = require('jquery'),
      Model = require('./model'),
      ProxyView = require('./proxyview'),
      Utils = require('core/util/utils');

  return function (_Component) {
    _inherits(DragDropManager, _Component);

    function DragDropManager(settings) {
      _classCallCheck(this, DragDropManager);

      settings.modelClass = settings.modelClass || Model;
      settings.modelData = settings.modelData || {};
      settings.modelData.proxyView = settings.modelData.proxyView || ProxyView;

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DragDropManager).call(this, settings));

      Utils.bindMethods(_this, ['_onRelease', '_onMove', '_onDragRequest', '_onSelectRequest', '_onMultiSelectRequest', '_onDropCandidate', '_onDropRevoke', '_onProxyRemovalRequest', '_onItemSelected', '_onItemDeselected']);

      if (!['relative', 'absolute'].includes(_this._model.get('bounds').$dom().css('position'))) {
        _this._model.get('bounds').$dom().css('position', 'relative');
      }

      window.addEventListener('mouseup', _this._onRelease);
      window.addEventListener('touchend', _this._onRelease);
      window.addEventListener('mousemove', _this._onMove);
      window.addEventListener('touchmove', _this._onMove);
      return _this;
    }

    _createClass(DragDropManager, [{
      key: 'addDragItem',
      value: function addDragItem(drag) {
        this._model.addDragItem(drag);
        drag.addEventListener('DragItem.RequestDrag', this._onDragRequest);
        drag.addEventListener('DragItem.RequestSelect', this._onSelectRequest);
        drag.addEventListener('DragItem.RequestMultiSelect', this._onMultiSelectRequest);
      }
    }, {
      key: 'removeDragItem',
      value: function removeDragItem(drag) {
        this._model.removeDragItem(drag);
        drag.removeEventListener('DragItem.RequestDrag', this._onDragRequest);
        drag.removeEventListener('DragItem.RequestSelect', this._onSelectRequest);
        drag.removeEventListener('DragItem.RequestMultiSelect', this._onMultiSelectRequest);
      }
    }, {
      key: 'removeAllDragItems',
      value: function removeAllDragItems() {
        for (var id in this._model.get('dragItems')) {
          this.removeDragItem(this._model.get('dragItems')[id]);
        }
        this._model.set('dragItems', {});
      }
    }, {
      key: 'addDropSite',
      value: function addDropSite(drop) {
        this._model.addDropSite(drop);
        drop.addEventListener('DropSite.NominateDropCandidate', this._onDropCandidate);
        drop.addEventListener('DropSite.RevokeDropCandidacy', this._onDropRevoke);
      }
    }, {
      key: 'removeDropSite',
      value: function removeDropSite(drop) {
        this._model.removeDropSite(drop);
        drop.removeEventListener('DropSite.NominateDropCandidate', this._onDropCandidate);
        drop.removeEventListener('DropSite.RevokeDropCandidacy', this._onDropRevoke);
      }
    }, {
      key: '_onDropCandidate',
      value: function _onDropCandidate(evt) {
        if (this._model.get('dragging')) {
          if (this._dropCandidate && this._dropCandidate != evt.currentTarget) {
            this._dropCandidate.handleLostCandidacy();
          }
          this._dropCandidate = evt.currentTarget;
          this._dropPosition = evt.data.position;
          this._dropCandidate.handleCandidacy(this._dropPosition);
        }
      }
    }, {
      key: '_onDropRevoke',
      value: function _onDropRevoke(evt) {
        if (this._dropCandidate == evt.currentTarget) {
          this._dropCandidate.handleLostCandidacy();
          this._dropCandidate = null;
          this._dropPosition = null;
        }
      }
    }, {
      key: '_onDragRequest',
      value: function _onDragRequest(evt) {
        if (this.isActive()) {
          $('body').addClass('dragdrop__dragging');
          this._model.set('dragging', true);
          var proxyClass = this._model.get('proxyView');
          this._dragProxy = new proxyClass({
            selected: this._model.get('selected'),
            referencePosition: evt.data,
            boundsPosition: this._model.get('bounds').$dom().offset()
          });
          this._model.get('selected').forEach(function (item) {
            item.handleDrag();
          });
          this._dragProxy.addEventListener('DragProxy.RequestRemoval', this._onProxyRemovalRequest);
          this._model.get('bounds').addChild(this._dragProxy);
          this._dragProxy.reveal();
          this._dragProxy.updatePosition({
            left: evt.data.left - this._model.get('bounds').$dom().offset().left,
            top: evt.data.top - this._model.get('bounds').$dom().offset().top,
            maxWidth: this._model.get('bounds').$dom().outerWidth(),
            maxHeight: this._model.get('bounds').$dom().outerHeight()
          });
        }
      }
    }, {
      key: '_onProxyRemovalRequest',
      value: function _onProxyRemovalRequest(evt) {
        this._model.get('bounds').removeChild(evt.currentTarget);
      }
    }, {
      key: '_onRelease',
      value: function _onRelease(jqevt) {
        if (this.isActive() && this._model.get('dragging')) {
          $('body').removeClass('dragdrop__dragging');
          this._model.set('dragging', false);
          this._model.get('selected').forEach(function (item) {
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
            });
          } else {
            this._dragProxy.revert();
          }
        } else if (!this._model.get('dragging')) {
          var itemClicked = false;
          var clickParents = $(jqevt.target).parents().toArray();
          for (var id in this._model.get('dragItems')) {
            var item = this._model.get('dragItems')[id];
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
    }, {
      key: '_onMove',
      value: function _onMove(jqevt) {
        if (this._model.get('dragging')) {
          this._dragProxy.updatePosition({
            left: jqevt.pageX - this._model.get('bounds').$dom().offset().left,
            top: jqevt.pageY - this._model.get('bounds').$dom().offset().top,
            maxWidth: this._model.get('bounds').$dom().outerWidth(),
            maxHeight: this._model.get('bounds').$dom().outerHeight()
          });
          for (var id in this._model.get('dropSites')) {
            var dropsite = this._model.get('dropSites')[id];
            dropsite.checkOverlap(this._dragProxy, {
              x: jqevt.pageX,
              y: jqevt.pageY
            });
          }
        }
      }
    }, {
      key: '_onSelectRequest',
      value: function _onSelectRequest(evt) {
        if (this.isActive() && !this._model.get('selected').has(evt.currentTarget)) {
          this._model.select(evt.currentTarget);
        }
      }
    }, {
      key: '_onMultiSelectRequest',
      value: function _onMultiSelectRequest(evt) {
        if (this.isActive()) {
          this._model.multiselect(evt.currentTarget);
        }
      }
    }, {
      key: '_onItemSelected',
      value: function _onItemSelected(evt) {
        evt.data.element.select();
      }
    }, {
      key: '_onItemDeselected',
      value: function _onItemDeselected(evt) {
        evt.data.element.deselect();
      }
    }]);

    return DragDropManager;
  }(Component);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sWUFBWSxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRSxJQUFJLFFBQVEsUUFBUixDQUROO0FBQUEsTUFFRSxRQUFRLFFBQVEsU0FBUixDQUZWO0FBQUEsTUFHRSxZQUFZLFFBQVEsYUFBUixDQUhkO0FBQUEsTUFJRSxRQUFRLFFBQVEsaUJBQVIsQ0FKVjs7QUFPQTtBQUFBOztBQUNFLDZCQUFZLFFBQVosRUFBc0I7QUFBQTs7QUFDcEIsZUFBUyxVQUFULEdBQXNCLFNBQVMsVUFBVCxJQUF1QixLQUE3QztBQUNBLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsRUFBM0M7QUFDQSxlQUFTLFNBQVQsQ0FBbUIsU0FBbkIsR0FBK0IsU0FBUyxTQUFULENBQW1CLFNBQW5CLElBQWdDLFNBQS9EOztBQUhvQixxR0FJZCxRQUpjOztBQUtwQixZQUFNLFdBQU4sUUFBd0IsQ0FDdEIsWUFEc0IsRUFDUixTQURRLEVBRXRCLGdCQUZzQixFQUVKLGtCQUZJLEVBRWdCLHVCQUZoQixFQUd0QixrQkFIc0IsRUFHRixlQUhFLEVBSXRCLHdCQUpzQixFQUt0QixpQkFMc0IsRUFLSCxtQkFMRyxDQUF4Qjs7QUFRQSxVQUFJLENBQUMsQ0FBQyxVQUFELEVBQWEsVUFBYixFQUF5QixRQUF6QixDQUFrQyxNQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFFBQWhCLEVBQTBCLElBQTFCLEdBQWlDLEdBQWpDLENBQXFDLFVBQXJDLENBQWxDLENBQUwsRUFBMEY7QUFDeEYsY0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixRQUFoQixFQUEwQixJQUExQixHQUFpQyxHQUFqQyxDQUFxQyxVQUFyQyxFQUFpRCxVQUFqRDtBQUNEOztBQUVELGFBQU8sZ0JBQVAsQ0FBd0IsU0FBeEIs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LENBQVksR0FBWixDQUFnQixXQUFoQixDQUFmLEVBQTZDO0FBQzNDLGdCQUFJLFdBQVcsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixXQUFoQixFQUE2QixFQUE3QixDQUFmO0FBQ0EscUJBQVMsWUFBVCxDQUFzQixLQUFLLFVBQTNCLEVBQXVDO0FBQ3JDLGlCQUFHLE1BQU0sS0FENEI7QUFFckMsaUJBQUcsTUFBTTtBQUY0QixhQUF2QztBQUlEO0FBQ0Y7QUFDRjtBQTNKSDtBQUFBO0FBQUEsdUNBNkptQixHQTdKbkIsRUE2SndCO0FBQ3BCLFlBQUksS0FBSyxRQUFMLE1BQW1CLENBQUMsS0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixVQUFoQixFQUE0QixHQUE1QixDQUFnQyxJQUFJLGFBQXBDLENBQXhCLEVBQTRFO0FBQzFFLGVBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsSUFBSSxhQUF2QjtBQUNEO0FBQ0Y7QUFqS0g7QUFBQTtBQUFBLDRDQW1Ld0IsR0FuS3hCLEVBbUs2QjtBQUN6QixZQUFJLEtBQUssUUFBTCxFQUFKLEVBQXFCO0FBQ25CLGVBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsSUFBSSxhQUE1QjtBQUNEO0FBQ0Y7QUF2S0g7QUFBQTtBQUFBLHNDQXdLa0IsR0F4S2xCLEVBd0t1QjtBQUNuQixZQUFJLElBQUosQ0FBUyxPQUFULENBQWlCLE1BQWpCO0FBQ0Q7QUExS0g7QUFBQTtBQUFBLHdDQTJLb0IsR0EzS3BCLEVBMkt5QjtBQUNyQixZQUFJLElBQUosQ0FBUyxPQUFULENBQWlCLFFBQWpCO0FBQ0Q7QUE3S0g7O0FBQUE7QUFBQSxJQUFxQyxTQUFyQztBQStLRCxDQXZMRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZHJhZ2Ryb3AvbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
