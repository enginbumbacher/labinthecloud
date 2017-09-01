'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./legend__row.html'),
      Button = require('core/component/button/field');

  return function (_DomView) {
    _inherits(LegendRow, _DomView);

    function LegendRow(model, tmpl) {
      _classCallCheck(this, LegendRow);

      var _this = _possibleConstructorReturn(this, (LegendRow.__proto__ || Object.getPrototypeOf(LegendRow)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange', '_onShownClick']);
      _this._resultId = model.get('id');
      _this._clear = Button.create({
        id: 'clear',
        label: 'Clear',
        style: 'link',
        eventName: 'LegendRow.ClearRequest',
        eventData: {
          resultId: _this._resultId
        }
      });
      _this.addChild(_this._clear.view(), '.aggregate__legend__clear');

      model.addEventListener('Model.Change', _this._onModelChange);
      _this._render(model);
      _this.$dom().find('.aggregate__legend__show').click(_this._onShownClick);
      return _this;
    }

    _createClass(LegendRow, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        this._render(evt.currentTarget);
      }
    }, {
      key: '_onShownClick',
      value: function _onShownClick(jqevt) {
        this.dispatchEvent('LegendRow.ShowToggleRequest', {
          resultId: this._resultId
        }, true);
      }
    }, {
      key: '_render',
      value: function _render(model) {
        if (model.get('name')) this.$dom().find('.aggregate__legend__name').html(model.get('name'));
        if (model.get('color')) this.$dom().find('.aggregate__legend__color').css({ background: model.get('color') });
        this.$dom().find('.aggregate__legend__show').prop('checked', model.get('shown'));
      }
    }, {
      key: 'id',
      value: function id() {
        return this._resultId;
      }
    }]);

    return LegendRow;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbGVnZW5kL2xlZ2VuZF9fcm93LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkJ1dHRvbiIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiX3Jlc3VsdElkIiwiZ2V0IiwiX2NsZWFyIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsInN0eWxlIiwiZXZlbnROYW1lIiwiZXZlbnREYXRhIiwicmVzdWx0SWQiLCJhZGRDaGlsZCIsInZpZXciLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxDaGFuZ2UiLCJfcmVuZGVyIiwiJGRvbSIsImZpbmQiLCJjbGljayIsIl9vblNob3duQ2xpY2siLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwiaHRtbCIsImNzcyIsImJhY2tncm91bmQiLCJwcm9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxVQUFVSixRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUssV0FBV0wsUUFBUSx5QkFBUixDQURiO0FBQUEsTUFFRU0sU0FBU04sUUFBUSw2QkFBUixDQUZYOztBQUlBO0FBQUE7O0FBQ0UsdUJBQVlPLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsd0hBQ2pCQSxRQUFRSCxRQURTOztBQUV2QkosWUFBTVEsV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLGVBQW5CLENBQXhCO0FBQ0EsWUFBS0MsU0FBTCxHQUFpQkgsTUFBTUksR0FBTixDQUFVLElBQVYsQ0FBakI7QUFDQSxZQUFLQyxNQUFMLEdBQWNOLE9BQU9PLE1BQVAsQ0FBYztBQUMxQkMsWUFBSSxPQURzQjtBQUUxQkMsZUFBTyxPQUZtQjtBQUcxQkMsZUFBTyxNQUhtQjtBQUkxQkMsbUJBQVcsd0JBSmU7QUFLMUJDLG1CQUFXO0FBQ1RDLG9CQUFVLE1BQUtUO0FBRE47QUFMZSxPQUFkLENBQWQ7QUFTQSxZQUFLVSxRQUFMLENBQWMsTUFBS1IsTUFBTCxDQUFZUyxJQUFaLEVBQWQsRUFBa0MsMkJBQWxDOztBQUVBZCxZQUFNZSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLQyxjQUE1QztBQUNBLFlBQUtDLE9BQUwsQ0FBYWpCLEtBQWI7QUFDQSxZQUFLa0IsSUFBTCxHQUFZQyxJQUFaLENBQWlCLDBCQUFqQixFQUE2Q0MsS0FBN0MsQ0FBbUQsTUFBS0MsYUFBeEQ7QUFqQnVCO0FBa0J4Qjs7QUFuQkg7QUFBQTtBQUFBLHFDQXFCaUJDLEdBckJqQixFQXFCc0I7QUFDbEIsYUFBS0wsT0FBTCxDQUFhSyxJQUFJQyxhQUFqQjtBQUNEO0FBdkJIO0FBQUE7QUFBQSxvQ0F5QmdCQyxLQXpCaEIsRUF5QnVCO0FBQ25CLGFBQUtDLGFBQUwsQ0FBbUIsNkJBQW5CLEVBQWtEO0FBQ2hEYixvQkFBVSxLQUFLVDtBQURpQyxTQUFsRCxFQUVHLElBRkg7QUFHRDtBQTdCSDtBQUFBO0FBQUEsOEJBK0JVSCxLQS9CVixFQStCaUI7QUFDYixZQUFJQSxNQUFNSSxHQUFOLENBQVUsTUFBVixDQUFKLEVBQXVCLEtBQUtjLElBQUwsR0FBWUMsSUFBWixDQUFpQiwwQkFBakIsRUFBNkNPLElBQTdDLENBQWtEMUIsTUFBTUksR0FBTixDQUFVLE1BQVYsQ0FBbEQ7QUFDdkIsWUFBSUosTUFBTUksR0FBTixDQUFVLE9BQVYsQ0FBSixFQUF3QixLQUFLYyxJQUFMLEdBQVlDLElBQVosQ0FBaUIsMkJBQWpCLEVBQThDUSxHQUE5QyxDQUFrRCxFQUFFQyxZQUFZNUIsTUFBTUksR0FBTixDQUFVLE9BQVYsQ0FBZCxFQUFsRDtBQUN4QixhQUFLYyxJQUFMLEdBQVlDLElBQVosQ0FBaUIsMEJBQWpCLEVBQTZDVSxJQUE3QyxDQUFrRCxTQUFsRCxFQUE2RDdCLE1BQU1JLEdBQU4sQ0FBVSxPQUFWLENBQTdEO0FBQ0Q7QUFuQ0g7QUFBQTtBQUFBLDJCQXFDTztBQUNILGVBQU8sS0FBS0QsU0FBWjtBQUNEO0FBdkNIOztBQUFBO0FBQUEsSUFBK0JOLE9BQS9CO0FBeUNELENBbEREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbGVnZW5kL2xlZ2VuZF9fcm93LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcbiAgXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9sZWdlbmRfX3Jvdy5odG1sJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyk7XG5cbiAgcmV0dXJuIGNsYXNzIExlZ2VuZFJvdyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uTW9kZWxDaGFuZ2UnLCAnX29uU2hvd25DbGljayddKVxuICAgICAgdGhpcy5fcmVzdWx0SWQgPSBtb2RlbC5nZXQoJ2lkJylcbiAgICAgIHRoaXMuX2NsZWFyID0gQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnY2xlYXInLFxuICAgICAgICBsYWJlbDogJ0NsZWFyJyxcbiAgICAgICAgc3R5bGU6ICdsaW5rJyxcbiAgICAgICAgZXZlbnROYW1lOiAnTGVnZW5kUm93LkNsZWFyUmVxdWVzdCcsXG4gICAgICAgIGV2ZW50RGF0YToge1xuICAgICAgICAgIHJlc3VsdElkOiB0aGlzLl9yZXN1bHRJZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9jbGVhci52aWV3KCksICcuYWdncmVnYXRlX19sZWdlbmRfX2NsZWFyJyk7XG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpXG4gICAgICB0aGlzLl9yZW5kZXIobW9kZWwpO1xuICAgICAgdGhpcy4kZG9tKCkuZmluZCgnLmFnZ3JlZ2F0ZV9fbGVnZW5kX19zaG93JykuY2xpY2sodGhpcy5fb25TaG93bkNsaWNrKVxuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fcmVuZGVyKGV2dC5jdXJyZW50VGFyZ2V0KVxuICAgIH1cblxuICAgIF9vblNob3duQ2xpY2soanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnTGVnZW5kUm93LlNob3dUb2dnbGVSZXF1ZXN0Jywge1xuICAgICAgICByZXN1bHRJZDogdGhpcy5fcmVzdWx0SWRcbiAgICAgIH0sIHRydWUpXG4gICAgfVxuXG4gICAgX3JlbmRlcihtb2RlbCkge1xuICAgICAgaWYgKG1vZGVsLmdldCgnbmFtZScpKSB0aGlzLiRkb20oKS5maW5kKCcuYWdncmVnYXRlX19sZWdlbmRfX25hbWUnKS5odG1sKG1vZGVsLmdldCgnbmFtZScpKVxuICAgICAgaWYgKG1vZGVsLmdldCgnY29sb3InKSkgdGhpcy4kZG9tKCkuZmluZCgnLmFnZ3JlZ2F0ZV9fbGVnZW5kX19jb2xvcicpLmNzcyh7IGJhY2tncm91bmQ6IG1vZGVsLmdldCgnY29sb3InKSB9KVxuICAgICAgdGhpcy4kZG9tKCkuZmluZCgnLmFnZ3JlZ2F0ZV9fbGVnZW5kX19zaG93JykucHJvcCgnY2hlY2tlZCcsIG1vZGVsLmdldCgnc2hvd24nKSlcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXN1bHRJZDtcbiAgICB9XG4gIH1cbn0pIl19
