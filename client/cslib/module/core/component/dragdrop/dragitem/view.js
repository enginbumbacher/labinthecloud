'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./dragitem.html'),
      $ = require('jquery'),
      Utils = require('core/util/utils');

  require('link!./dragitem.css');

  return function (_DomView) {
    _inherits(DragItemView, _DomView);

    function DragItemView(model, tmpl) {
      _classCallCheck(this, DragItemView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DragItemView).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onChange', '_onMouseDown', '_onMouseUp', '_dragStart']);

      if (model.get('trigger') != ".dragitem__grip") _this.$el.find(".dragitem__grip").detach();

      _this._render(model);
      _this.addChild(model.get('contents'), ".dragitem__contents");

      if (Utils.exists(model.get('trigger'))) {
        _this._trigger = _this.$el.find(model.get('trigger')).first();
      } else {
        _this._trigger = _this.$el;
      }

      _this._trigger.addClass("dragitem__trigger");

      model.addEventListener('Model.Change', _this._onChange);

      _this._trigger.on('mousedown touchstart', _this._onMouseDown);
      _this._trigger.on('mouseup touchend', _this._onMouseUp);
      return _this;
    }

    _createClass(DragItemView, [{
      key: '_onChange',
      value: function _onChange(evt) {
        this._render(evt.currentTarget);
      }
    }, {
      key: '_render',
      value: function _render(model) {
        this.$el.toggleClass("dragitem__selected", model.get('selected'));
      }
    }, {
      key: '_onMouseDown',
      value: function _onMouseDown(jqevt) {
        // allow typical UI to pass through without triggering a drag
        if (['input', 'textarea', 'a', 'button'].includes(jqevt.target.tagName.toLowerCase())) return true;

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
        var evtName = 'DragItem.RequestSelect';
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
    }, {
      key: '_dragStart',
      value: function _dragStart() {
        if (Utils.exists(this._moveReference)) {
          this.dispatchEvent('DragItem.RequestDrag', this._dragRef);
          this._dragRef = null;
        }
      }
    }, {
      key: '_onMouseUp',
      value: function _onMouseUp(jqevt) {
        this._moveReference = null;
      }
    }, {
      key: 'handleDrag',
      value: function handleDrag() {
        this.$el.addClass('dragitem__dragging');
      }
    }, {
      key: 'endDrag',
      value: function endDrag() {
        this.$el.removeClass('dragitem__dragging');
      }
    }]);

    return DragItemView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcmFnaXRlbS92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sVUFBVSxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRSxXQUFXLFFBQVEsc0JBQVIsQ0FEYjtBQUFBLE1BRUUsSUFBSSxRQUFRLFFBQVIsQ0FGTjtBQUFBLE1BR0UsUUFBUSxRQUFRLGlCQUFSLENBSFY7O0FBS0EsVUFBUSxxQkFBUjs7QUFFQTtBQUFBOztBQUNFLDBCQUFZLEtBQVosRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxrR0FDakIsUUFBUSxRQURTOztBQUV2QixZQUFNLFdBQU4sUUFBd0IsQ0FBQyxXQUFELEVBQWMsY0FBZCxFQUE4QixZQUE5QixFQUE0QyxZQUE1QyxDQUF4Qjs7QUFFQSxVQUFJLE1BQU0sR0FBTixDQUFVLFNBQVYsS0FBd0IsaUJBQTVCLEVBQ0UsTUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLGlCQUFkLEVBQWlDLE1BQWpDOztBQUVGLFlBQUssT0FBTCxDQUFhLEtBQWI7QUFDQSxZQUFLLFFBQUwsQ0FBYyxNQUFNLEdBQU4sQ0FBVSxVQUFWLENBQWQsRUFBcUMscUJBQXJDOztBQUVBLFVBQUksTUFBTSxNQUFOLENBQWEsTUFBTSxHQUFOLENBQVUsU0FBVixDQUFiLENBQUosRUFBd0M7QUFDdEMsY0FBSyxRQUFMLEdBQWdCLE1BQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxNQUFNLEdBQU4sQ0FBVSxTQUFWLENBQWQsRUFBb0MsS0FBcEMsRUFBaEI7QUFDRCxPQUZELE1BRU87QUFDTCxjQUFLLFFBQUwsR0FBZ0IsTUFBSyxHQUFyQjtBQUNEOztBQUVELFlBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsbUJBQXZCOztBQUVBLFlBQU0sZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBSyxTQUE1Qzs7QUFFQSxZQUFLLFFBQUwsQ0FBYyxFQUFkLENBQWlCLHNCQUFqQixFQUF5QyxNQUFLLFlBQTlDO0FBQ0EsWUFBSyxRQUFMLENBQWMsRUFBZCxDQUFpQixrQkFBakIsRUFBcUMsTUFBSyxVQUExQztBQXJCdUI7QUFzQnhCOztBQXZCSDtBQUFBO0FBQUEsZ0NBeUJZLEdBekJaLEVBeUJpQjtBQUNiLGFBQUssT0FBTCxDQUFhLElBQUksYUFBakI7QUFDRDtBQTNCSDtBQUFBO0FBQUEsOEJBNkJVLEtBN0JWLEVBNkJpQjtBQUNiLGFBQUssR0FBTCxDQUFTLFdBQVQsQ0FBcUIsb0JBQXJCLEVBQTJDLE1BQU0sR0FBTixDQUFVLFVBQVYsQ0FBM0M7QUFDRDtBQS9CSDtBQUFBO0FBQUEsbUNBaUNlLEtBakNmLEVBaUNzQjs7QUFFbEIsWUFBSSxDQUFDLE9BQUQsRUFBVSxVQUFWLEVBQXNCLEdBQXRCLEVBQTJCLFFBQTNCLEVBQXFDLFFBQXJDLENBQThDLE1BQU0sTUFBTixDQUFhLE9BQWIsQ0FBcUIsV0FBckIsRUFBOUMsQ0FBSixFQUNFLE9BQU8sSUFBUDs7OztBQUlGLFlBQUksRUFBRSxNQUFNLE1BQVIsRUFBZ0IsWUFBaEIsQ0FBNkIsS0FBSyxHQUFsQyxFQUF1QyxzQkFBdkMsRUFBK0QsTUFBbkUsRUFBMkU7QUFDekUsZ0JBQU0sd0JBQU47QUFDQSxpQkFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFBSyxjQUFMLEdBQXNCO0FBQ3BCLGdCQUFNLE1BQU0sS0FEUTtBQUVwQixlQUFLLE1BQU0sS0FGUztBQUdwQixxQkFBVyxLQUFLLEdBQUw7QUFIUyxTQUF0QjtBQUtBLFlBQUksVUFBVSx3QkFBZDtBQUNBLFlBQUksTUFBTSxRQUFWLEVBQW9CO0FBQ2xCLG9CQUFVLDZCQUFWO0FBQ0EsZ0JBQU0sa0JBQU47QUFDRDtBQUNELGFBQUssYUFBTCxDQUFtQixPQUFuQixFQUE0QixFQUE1QjtBQUNBLGFBQUssUUFBTCxHQUFnQjtBQUNkLGdCQUFNLE1BQU0sS0FERTtBQUVkLGVBQUssTUFBTTtBQUZHLFNBQWhCO0FBSUEsYUFBSyxpQkFBTCxHQUF5QixXQUFXLEtBQUssVUFBaEIsRUFBNEIsR0FBNUIsQ0FBekI7QUFDRDtBQTdESDtBQUFBO0FBQUEsbUNBK0RlO0FBQ1gsWUFBSSxNQUFNLE1BQU4sQ0FBYSxLQUFLLGNBQWxCLENBQUosRUFBdUM7QUFDckMsZUFBSyxhQUFMLENBQW1CLHNCQUFuQixFQUEyQyxLQUFLLFFBQWhEO0FBQ0EsZUFBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0Q7QUFDRjtBQXBFSDtBQUFBO0FBQUEsaUNBc0VhLEtBdEViLEVBc0VvQjtBQUNoQixhQUFLLGNBQUwsR0FBc0IsSUFBdEI7QUFDRDtBQXhFSDtBQUFBO0FBQUEsbUNBMEVlO0FBQ1gsYUFBSyxHQUFMLENBQVMsUUFBVCxDQUFrQixvQkFBbEI7QUFDRDtBQTVFSDtBQUFBO0FBQUEsZ0NBOEVZO0FBQ1IsYUFBSyxHQUFMLENBQVMsV0FBVCxDQUFxQixvQkFBckI7QUFDRDtBQWhGSDs7QUFBQTtBQUFBLElBQWtDLE9BQWxDO0FBa0ZELENBMUZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcmFnaXRlbS92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
