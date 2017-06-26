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

      var _this = _possibleConstructorReturn(this, (DragDropManager.__proto__ || Object.getPrototypeOf(DragDropManager)).call(this, settings));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCIkIiwiTW9kZWwiLCJQcm94eVZpZXciLCJVdGlscyIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsIm1vZGVsRGF0YSIsInByb3h5VmlldyIsImJpbmRNZXRob2RzIiwiaW5jbHVkZXMiLCJfbW9kZWwiLCJnZXQiLCIkZG9tIiwiY3NzIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblJlbGVhc2UiLCJfb25Nb3ZlIiwiZHJhZyIsImFkZERyYWdJdGVtIiwiX29uRHJhZ1JlcXVlc3QiLCJfb25TZWxlY3RSZXF1ZXN0IiwiX29uTXVsdGlTZWxlY3RSZXF1ZXN0IiwicmVtb3ZlRHJhZ0l0ZW0iLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaWQiLCJzZXQiLCJkcm9wIiwiYWRkRHJvcFNpdGUiLCJfb25Ecm9wQ2FuZGlkYXRlIiwiX29uRHJvcFJldm9rZSIsInJlbW92ZURyb3BTaXRlIiwiZXZ0IiwiX2Ryb3BDYW5kaWRhdGUiLCJjdXJyZW50VGFyZ2V0IiwiaGFuZGxlTG9zdENhbmRpZGFjeSIsIl9kcm9wUG9zaXRpb24iLCJkYXRhIiwicG9zaXRpb24iLCJoYW5kbGVDYW5kaWRhY3kiLCJpc0FjdGl2ZSIsImFkZENsYXNzIiwicHJveHlDbGFzcyIsIl9kcmFnUHJveHkiLCJzZWxlY3RlZCIsInJlZmVyZW5jZVBvc2l0aW9uIiwiYm91bmRzUG9zaXRpb24iLCJvZmZzZXQiLCJmb3JFYWNoIiwiaXRlbSIsImhhbmRsZURyYWciLCJfb25Qcm94eVJlbW92YWxSZXF1ZXN0IiwiYWRkQ2hpbGQiLCJyZXZlYWwiLCJ1cGRhdGVQb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJtYXhXaWR0aCIsIm91dGVyV2lkdGgiLCJtYXhIZWlnaHQiLCJvdXRlckhlaWdodCIsInJlbW92ZUNoaWxkIiwianFldnQiLCJyZW1vdmVDbGFzcyIsImVuZERyYWciLCJyZWNlaXZlIiwiQXJyYXkiLCJmcm9tIiwiZW50ZXIiLCJjbGVhclNlbGVjdGlvbiIsImRpc3BhdGNoRXZlbnQiLCJzaXRlcyIsIml0ZW1zIiwicmV2ZXJ0IiwiaXRlbUNsaWNrZWQiLCJjbGlja1BhcmVudHMiLCJ0YXJnZXQiLCJwYXJlbnRzIiwidG9BcnJheSIsInZpZXciLCJkb20iLCJwYWdlWCIsInBhZ2VZIiwiZHJvcHNpdGUiLCJjaGVja092ZXJsYXAiLCJ4IiwieSIsImhhcyIsInNlbGVjdCIsIm11bHRpc2VsZWN0IiwiZWxlbWVudCIsImRlc2VsZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxJQUFJRixRQUFRLFFBQVIsQ0FETjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsU0FBUixDQUZWO0FBQUEsTUFHRUksWUFBWUosUUFBUSxhQUFSLENBSGQ7QUFBQSxNQUlFSyxRQUFRTCxRQUFRLGlCQUFSLENBSlY7O0FBT0E7QUFBQTs7QUFDRSw2QkFBWU0sUUFBWixFQUFzQjtBQUFBOztBQUNwQkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QkosS0FBN0M7QUFDQUcsZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQixFQUEzQztBQUNBRixlQUFTRSxTQUFULENBQW1CQyxTQUFuQixHQUErQkgsU0FBU0UsU0FBVCxDQUFtQkMsU0FBbkIsSUFBZ0NMLFNBQS9EOztBQUhvQixvSUFJZEUsUUFKYzs7QUFLcEJELFlBQU1LLFdBQU4sUUFBd0IsQ0FDdEIsWUFEc0IsRUFDUixTQURRLEVBRXRCLGdCQUZzQixFQUVKLGtCQUZJLEVBRWdCLHVCQUZoQixFQUd0QixrQkFIc0IsRUFHRixlQUhFLEVBSXRCLHdCQUpzQixFQUt0QixpQkFMc0IsRUFLSCxtQkFMRyxDQUF4Qjs7QUFRQSxVQUFJLENBQUMsQ0FBQyxVQUFELEVB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QUwsQ0FBWUMsR0FBWixDQUFnQixVQUFoQixFQUE0QjRFLEdBQTVCLENBQWdDdkQsSUFBSUUsYUFBcEMsQ0FBeEIsRUFBNEU7QUFDMUUsZUFBS3hCLE1BQUwsQ0FBWThFLE1BQVosQ0FBbUJ4RCxJQUFJRSxhQUF2QjtBQUNEO0FBQ0Y7QUFqS0g7QUFBQTtBQUFBLDRDQW1Ld0JGLEdBbkt4QixFQW1LNkI7QUFDekIsWUFBSSxLQUFLUSxRQUFMLEVBQUosRUFBcUI7QUFDbkIsZUFBSzlCLE1BQUwsQ0FBWStFLFdBQVosQ0FBd0J6RCxJQUFJRSxhQUE1QjtBQUNEO0FBQ0Y7QUF2S0g7QUFBQTtBQUFBLHNDQXdLa0JGLEdBeEtsQixFQXdLdUI7QUFDbkJBLFlBQUlLLElBQUosQ0FBU3FELE9BQVQsQ0FBaUJGLE1BQWpCO0FBQ0Q7QUExS0g7QUFBQTtBQUFBLHdDQTJLb0J4RCxHQTNLcEIsRUEyS3lCO0FBQ3JCQSxZQUFJSyxJQUFKLENBQVNxRCxPQUFULENBQWlCQyxRQUFqQjtBQUNEO0FBN0tIOztBQUFBO0FBQUEsSUFBcUM1RixTQUFyQztBQStLRCxDQXZMRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZHJhZ2Ryb3AvbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
