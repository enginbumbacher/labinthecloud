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

      var _this = _possibleConstructorReturn(this, (DragItemView.__proto__ || Object.getPrototypeOf(DragItemView)).call(this, tmpl || Template));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9kcmFnZHJvcC9kcmFnaXRlbS92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVGVtcGxhdGUiLCIkIiwiVXRpbHMiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImdldCIsIiRlbCIsImZpbmQiLCJkZXRhY2giLCJfcmVuZGVyIiwiYWRkQ2hpbGQiLCJleGlzdHMiLCJfdHJpZ2dlciIsImZpcnN0IiwiYWRkQ2xhc3MiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uQ2hhbmdlIiwib24iLCJfb25Nb3VzZURvd24iLCJfb25Nb3VzZVVwIiwiZXZ0IiwiY3VycmVudFRhcmdldCIsInRvZ2dsZUNsYXNzIiwianFldnQiLCJpbmNsdWRlcyIsInRhcmdldCIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInBhcmVudHNVbnRpbCIsImxlbmd0aCIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsIl9tb3ZlUmVmZXJlbmNlIiwibGVmdCIsInBhZ2VYIiwidG9wIiwicGFnZVkiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZXZ0TmFtZSIsInNoaWZ0S2V5IiwiY2xlYXJUZXh0U2VsZWN0aW9uIiwiZGlzcGF0Y2hFdmVudCIsIl9kcmFnUmVmIiwiX2RyYWdTdGFydFRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiX2RyYWdTdGFydCIsInJlbW92ZUNsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLHNCQUFSLENBRGI7QUFBQSxNQUVFRyxJQUFJSCxRQUFRLFFBQVIsQ0FGTjtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFLQUEsVUFBUSxxQkFBUjs7QUFFQTtBQUFBOztBQUNFLDBCQUFZSyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLDhIQUNqQkEsUUFBUUosUUFEUzs7QUFFdkJFLFlBQU1HLFdBQU4sUUFBd0IsQ0FBQyxXQUFELEVBQWMsY0FBZCxFQUE4QixZQUE5QixFQUE0QyxZQUE1QyxDQUF4Qjs7QUFFQSxVQUFJRixNQUFNRyxHQUFOLENBQVUsU0FBVixLQUF3QixpQkFBNUIsRUFDRSxNQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyxpQkFBZCxFQUFpQ0MsTUFBakM7O0FBRUYsWUFBS0MsT0FBTCxDQUFhUCxLQUFiO0FBQ0EsWUFBS1EsUUFBTCxDQUFjUixNQUFNRyxHQUFOLENBQVUsVUFBVixDQUFkLEVBQXFDLHFCQUFyQzs7QUFFQSxVQUFJSixNQUFNVSxNQUFOLENBQWFULE1BQU1HLEdBQU4sQ0FBVSxTQUFWLENBQWIsQ0FBSixFQUF3QztBQUN0QyxjQUFLTyxRQUFMLEdBQWdCLE1BQUtOLEdBQUwsQ0FBU0MsSUFBVCxDQUFjTCxNQUFNRyxHQUFOLENBQVUsU0FBVixDQUFkLEVBQW9DUSxLQUFwQyxFQUFoQjtBQUNELE9BRkQsTUFFTztBQUNMLGNBQUtELFFBQUwsR0FBZ0IsTUFBS04sR0FBckI7QUFDRDs7QUFFRCxZQUFLTSxRQUFMLENBQWNFLFFBQWQsQ0FBdUIsbUJBQXZCOztBQUVBWixZQUFNYSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLQyxTQUE1Qzs7QUFFQSxZQUFLSixRQUFMLENBQWNLLEVBQWQsQ0FBaUIsc0JBQWpCLEVBQXlDLE1BQUtDLFlBQTlDO0FBQ0EsWUFBS04sUUFBTCxDQUFjSyxFQUFkLENBQWlCLGtCQUFqQixFQUFxQyxNQUFLRSxVQUExQztBQXJCdUI7QUFzQnhCOztBQXZCSDtBQUFBO0FBQUEsZ0NBeUJZQyxHQXpCWixFQXlCaUI7QUFDYixhQUFLWCxPQUFMLENBQWFXLElBQUlDLGFBQWpCO0FBQ0Q7QUEzQkg7QUFBQTtBQUFBLDhCQTZCVW5CLEtBN0JWLEVBNkJpQjtBQUNiLGFBQUtJLEdBQUwsQ0FBU2dCLFdBQVQsQ0FBcUIsb0JBQXJCLEVBQTJDcEIsTUFBTUcsR0FBTixDQUFVLFVBQVYsQ0FBM0M7QUFDRDtBQS9CSDtBQUFBO0FBQUEsbUNBaUNla0IsS0FqQ2YsRUFpQ3NCO0FBQ2xCO0FBQ0EsWUFBSSxDQUFDLE9BQUQsRUFBVSxVQUFWLEVBQXNCLEdBQXRCLEVBQTJCLFFBQTNCLEVBQXFDQyxRQUFyQyxDQUE4Q0QsTUFBTUUsTUFBTixDQUFhQyxPQUFiLENBQXFCQyxXQUFyQixFQUE5QyxDQUFKLEVBQ0UsT0FBTyxJQUFQOztBQUVGO0FBQ0E7QUFDQSxZQUFJM0IsRUFBRXVCLE1BQU1FLE1BQVIsRUFBZ0JHLFlBQWhCLENBQTZCLEtBQUt0QixHQUFsQyxFQUF1QyxzQkFBdkMsRUFBK0R1QixNQUFuRSxFQUEyRTtBQUN6RU4sZ0JBQU1PLHdCQUFOO0FBQ0EsaUJBQU8sSUFBUDtBQUNEOztBQUVELGFBQUtDLGNBQUwsR0FBc0I7QUFDcEJDLGdCQUFNVCxNQUFNVSxLQURRO0FBRXBCQyxlQUFLWCxNQUFNWSxLQUZTO0FBR3BCQyxxQkFBV0MsS0FBS0MsR0FBTDtBQUhTLFNBQXRCO0FBS0EsWUFBSUMsVUFBVSx3QkFBZDtBQUNBLFlBQUloQixNQUFNaUIsUUFBVixFQUFvQjtBQUNsQkQsb0JBQVUsNkJBQVY7QUFDQXRDLGdCQUFNd0Msa0JBQU47QUFDRDtBQUNELGFBQUtDLGFBQUwsQ0FBbUJILE9BQW5CLEVBQTRCLEVBQTVCO0FBQ0EsYUFBS0ksUUFBTCxHQUFnQjtBQUNkWCxnQkFBTVQsTUFBTVUsS0FERTtBQUVkQyxlQUFLWCxNQUFNWTtBQUZHLFNBQWhCO0FBSUEsYUFBS1MsaUJBQUwsR0FBeUJDLFdBQVcsS0FBS0MsVUFBaEIsRUFBNEIsR0FBNUIsQ0FBekI7QUFDRDtBQTdESDtBQUFBO0FBQUEsbUNBK0RlO0FBQ1gsWUFBSTdDLE1BQU1VLE1BQU4sQ0FBYSxLQUFLb0IsY0FBbEIsQ0FBSixFQUF1QztBQUNyQyxlQUFLVyxhQUFMLENBQW1CLHNCQUFuQixFQUEyQyxLQUFLQyxRQUFoRDtBQUNBLGVBQUtBLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDtBQUNGO0FBcEVIO0FBQUE7QUFBQSxpQ0FzRWFwQixLQXRFYixFQXNFb0I7QUFDaEIsYUFBS1EsY0FBTCxHQUFzQixJQUF0QjtBQUNEO0FBeEVIO0FBQUE7QUFBQSxtQ0EwRWU7QUFDWCxhQUFLekIsR0FBTCxDQUFTUSxRQUFULENBQWtCLG9CQUFsQjtBQUNEO0FBNUVIO0FBQUE7QUFBQSxnQ0E4RVk7QUFDUixhQUFLUixHQUFMLENBQVN5QyxXQUFULENBQXFCLG9CQUFyQjtBQUNEO0FBaEZIOztBQUFBO0FBQUEsSUFBa0NqRCxPQUFsQztBQWtGRCxDQTFGRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZHJhZ2Ryb3AvZHJhZ2l0ZW0vdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
