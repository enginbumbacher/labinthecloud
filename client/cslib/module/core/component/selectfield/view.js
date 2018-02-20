'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseFieldView = require('core/component/form/field/view'),
      OptionView = require('./optionview'),
      Utils = require('core/util/utils'),
      Template = require('text!./selectfield.html');

  return function (_BaseFieldView) {
    _inherits(SelectFieldView, _BaseFieldView);

    function SelectFieldView(model, tmpl) {
      _classCallCheck(this, SelectFieldView);

      var _this = _possibleConstructorReturn(this, (SelectFieldView.__proto__ || Object.getPrototypeOf(SelectFieldView)).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onFieldChange', '_onModelChange']);

      _this._options = {};
      if (model.get('color')) _this.$el.find('.selectfield__label').css('color', model.get('color'));
      //if (model.get('inverse_order')) { this.$el.find(".selectfield__label").remove().insertAfter(this.$el.find(".selectfield__select"));}

      _this._render(model);

      _this.$el.find(".selectfield__select").on('change', _this._onFieldChange);
      _this.$el.find(".selectfield__select").css({ 'font-size': '12px' });
      return _this;
    }

    _createClass(SelectFieldView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(SelectFieldView.prototype.__proto__ || Object.getPrototypeOf(SelectFieldView.prototype), '_onModelChange', this).call(this, evt);
        if (evt.data.path == 'disabledOptions') {
          Object.values(this._options).forEach(function (opt) {
            if (evt.data.value.includes(opt.id())) {
              opt.disable();
              opt.hide();
            } else {
              opt.show();
              opt.enable();
            }
          });
        } else {
          this._render(evt.currentTarget);
        }
      }
    }, {
      key: '_onFieldChange',
      value: function _onFieldChange(jqevt) {
        this.dispatchEvent('Field.ValueChange', {
          value: this.$el.find(".selectfield__select").val()
        });
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.selectfield__select').prop('disabled', true);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.selectfield__select').prop('disabled', false);
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.$el.find('.selectfield__select').focus();
      }
    }, {
      key: '_render',
      value: function _render(model) {
        this.$el.find('.selectfield__label').html(model.get('label'));
        for (var optId in this._options) {
          if (!Object.keys(model.get('options')).includes(optId)) {
            this.removeChild(this._options[optId]);
            delete this._options[optId];
          }
        }
        for (var id in model.get('options')) {
          var label = model.get('options')[id];
          if (!this._options[id]) {
            this._options[id] = new OptionView({
              id: id,
              label: label,
              selected: model.value() == id
            });
            this.addChild(this._options[id], ".selectfield__select");
          } else {
            this._options[id].select(model.value() == id);
          }
        }
        if (model.get('disabled')) {
          this.disable();
        } else {
          this.enable();
        }
      }
    }]);

    return SelectFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiZ2V0IiwiJGVsIiwiZmluZCIsImNzcyIsIl9yZW5kZXIiLCJvbiIsIl9vbkZpZWxkQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmb3JFYWNoIiwib3B0IiwidmFsdWUiLCJpbmNsdWRlcyIsImlkIiwiZGlzYWJsZSIsImhpZGUiLCJzaG93IiwiZW5hYmxlIiwiY3VycmVudFRhcmdldCIsImpxZXZ0IiwiZGlzcGF0Y2hFdmVudCIsInZhbCIsInByb3AiLCJmb2N1cyIsImh0bWwiLCJvcHRJZCIsImtleXMiLCJyZW1vdmVDaGlsZCIsImxhYmVsIiwic2VsZWN0ZWQiLCJhZGRDaGlsZCIsInNlbGVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGdCQUFnQkQsUUFBUSxnQ0FBUixDQUF0QjtBQUFBLE1BQ0VFLGFBQWFGLFFBQVEsY0FBUixDQURmO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksV0FBV0osUUFBUSx5QkFBUixDQUhiOztBQU1BO0FBQUE7O0FBQ0UsNkJBQVlLLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsb0lBQ2pCRCxLQURpQixFQUNWQyxPQUFPQSxJQUFQLEdBQWNGLFFBREo7O0FBRXZCRCxZQUFNSSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsZ0JBQW5CLENBQXhCOztBQUVBLFlBQUtDLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxVQUFJSCxNQUFNSSxHQUFOLENBQVUsT0FBVixDQUFKLEVBQXdCLE1BQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDQyxHQUFyQyxDQUF5QyxPQUF6QyxFQUFrRFAsTUFBTUksR0FBTixDQUFVLE9BQVYsQ0FBbEQ7QUFDeEI7O0FBRUEsWUFBS0ksT0FBTCxDQUFhUixLQUFiOztBQUVBLFlBQUtLLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHNCQUFkLEVBQXNDRyxFQUF0QyxDQUF5QyxRQUF6QyxFQUFtRCxNQUFLQyxjQUF4RDtBQUNBLFlBQUtMLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHNCQUFkLEVBQXNDQyxHQUF0QyxDQUEwQyxFQUFDLGFBQVksTUFBYixFQUExQztBQVh1QjtBQVl4Qjs7QUFiSDtBQUFBO0FBQUEscUNBZWlCSSxHQWZqQixFQWVzQjtBQUNsQix5SUFBcUJBLEdBQXJCO0FBQ0EsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxJQUFULElBQWlCLGlCQUFyQixFQUF3QztBQUN0Q0MsaUJBQU9DLE1BQVAsQ0FBYyxLQUFLWixRQUFuQixFQUE2QmEsT0FBN0IsQ0FBcUMsVUFBQ0MsR0FBRCxFQUFTO0FBQzVDLGdCQUFJTixJQUFJQyxJQUFKLENBQVNNLEtBQVQsQ0FBZUMsUUFBZixDQUF3QkYsSUFBSUcsRUFBSixFQUF4QixDQUFKLEVBQXVDO0FBQ3JDSCxrQkFBSUksT0FBSjtBQUNBSixrQkFBSUssSUFBSjtBQUNELGFBSEQsTUFHTztBQUNMTCxrQkFBSU0sSUFBSjtBQUNBTixrQkFBSU8sTUFBSjtBQUNEO0FBQ0YsV0FSRDtBQVNELFNBVkQsTUFVTztBQUNMLGVBQUtoQixPQUFMLENBQWFHLElBQUljLGFBQWpCO0FBQ0Q7QUFDRjtBQTlCSDtBQUFBO0FBQUEscUNBZ0NpQkMsS0FoQ2pCLEVBZ0N3QjtBQUNwQixhQUFLQyxhQUFMLENBQW1CLG1CQUFuQixFQUF3QztBQUN0Q1QsaUJBQU8sS0FBS2IsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0NzQixHQUF0QztBQUQrQixTQUF4QztBQUdEO0FBcENIO0FBQUE7QUFBQSxnQ0FzQ1k7QUFDUixhQUFLdkIsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0N1QixJQUF0QyxDQUEyQyxVQUEzQyxFQUF1RCxJQUF2RDtBQUNEO0FBeENIO0FBQUE7QUFBQSwrQkEwQ1c7QUFDUCxhQUFLeEIsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0N1QixJQUF0QyxDQUEyQyxVQUEzQyxFQUF1RCxLQUF2RDtBQUNEO0FBNUNIO0FBQUE7QUFBQSw4QkE4Q1U7QUFDTixhQUFLeEIsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0N3QixLQUF0QztBQUNEO0FBaERIO0FBQUE7QUFBQSw4QkFrRFU5QixLQWxEVixFQWtEaUI7QUFDYixhQUFLSyxHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQ3lCLElBQXJDLENBQTBDL0IsTUFBTUksR0FBTixDQUFVLE9BQVYsQ0FBMUM7QUFDQSxhQUFLLElBQUk0QixLQUFULElBQWtCLEtBQUs3QixRQUF2QixFQUFpQztBQUMvQixjQUFJLENBQUNXLE9BQU9tQixJQUFQLENBQVlqQyxNQUFNSSxHQUFOLENBQVUsU0FBVixDQUFaLEVBQWtDZSxRQUFsQyxDQUEyQ2EsS0FBM0MsQ0FBTCxFQUF3RDtBQUN0RCxpQkFBS0UsV0FBTCxDQUFpQixLQUFLL0IsUUFBTCxDQUFjNkIsS0FBZCxDQUFqQjtBQUNBLG1CQUFPLEtBQUs3QixRQUFMLENBQWM2QixLQUFkLENBQVA7QUFDRDtBQUNGO0FBQ0QsYUFBSyxJQUFJWixFQUFULElBQWVwQixNQUFNSSxHQUFOLENBQVUsU0FBVixDQUFmLEVBQXFDO0FBQ25DLGNBQUkrQixRQUFRbkMsTUFBTUksR0FBTixDQUFVLFNBQVYsRUFBcUJnQixFQUFyQixDQUFaO0FBQ0EsY0FBSSxDQUFDLEtBQUtqQixRQUFMLENBQWNpQixFQUFkLENBQUwsRUFBd0I7QUFDdEIsaUJBQUtqQixRQUFMLENBQWNpQixFQUFkLElBQW9CLElBQUl2QixVQUFKLENBQWU7QUFDakN1QixrQkFBSUEsRUFENkI7QUFFakNlLHFCQUFPQSxLQUYwQjtBQUdqQ0Msd0JBQVVwQyxNQUFNa0IsS0FBTixNQUFpQkU7QUFITSxhQUFmLENBQXBCO0FBS0EsaUJBQUtpQixRQUFMLENBQWMsS0FBS2xDLFFBQUwsQ0FBY2lCLEVBQWQsQ0FBZCxFQUFpQyxzQkFBakM7QUFDRCxXQVBELE1BT087QUFDTCxpQkFBS2pCLFFBQUwsQ0FBY2lCLEVBQWQsRUFBa0JrQixNQUFsQixDQUF5QnRDLE1BQU1rQixLQUFOLE1BQWlCRSxFQUExQztBQUNEO0FBQ0Y7QUFDRCxZQUFJcEIsTUFBTUksR0FBTixDQUFVLFVBQVYsQ0FBSixFQUEyQjtBQUN6QixlQUFLaUIsT0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtHLE1BQUw7QUFDRDtBQUNGO0FBNUVIOztBQUFBO0FBQUEsSUFBcUM1QixhQUFyQztBQThFRCxDQXJGRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgT3B0aW9uVmlldyA9IHJlcXVpcmUoJy4vb3B0aW9udmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc2VsZWN0ZmllbGQuaHRtbCcpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgU2VsZWN0RmllbGRWaWV3IGV4dGVuZHMgQmFzZUZpZWxkVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKG1vZGVsLCB0bXBsID8gdG1wbCA6IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRmllbGRDaGFuZ2UnLCAnX29uTW9kZWxDaGFuZ2UnXSk7XG5cbiAgICAgIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgICAgaWYgKG1vZGVsLmdldCgnY29sb3InKSkgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19sYWJlbCcpLmNzcygnY29sb3InLCBtb2RlbC5nZXQoJ2NvbG9yJykpO1xuICAgICAgLy9pZiAobW9kZWwuZ2V0KCdpbnZlcnNlX29yZGVyJykpIHsgdGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fbGFiZWxcIikucmVtb3ZlKCkuaW5zZXJ0QWZ0ZXIodGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpKTt9XG5cbiAgICAgIHRoaXMuX3JlbmRlcihtb2RlbCk7XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5vbignY2hhbmdlJywgdGhpcy5fb25GaWVsZENoYW5nZSlcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5jc3Moeydmb250LXNpemUnOicxMnB4J30pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gJ2Rpc2FibGVkT3B0aW9ucycpIHtcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9vcHRpb25zKS5mb3JFYWNoKChvcHQpID0+IHtcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUuaW5jbHVkZXMob3B0LmlkKCkpKSB7XG4gICAgICAgICAgICBvcHQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgb3B0LmhpZGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0LnNob3coKTtcbiAgICAgICAgICAgIG9wdC5lbmFibGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkZpZWxkQ2hhbmdlKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLlZhbHVlQ2hhbmdlJywge1xuICAgICAgICB2YWx1ZTogdGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLnZhbCgpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5mb2N1cygpO1xuICAgIH1cblxuICAgIF9yZW5kZXIobW9kZWwpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fbGFiZWwnKS5odG1sKG1vZGVsLmdldCgnbGFiZWwnKSk7XG4gICAgICBmb3IgKGxldCBvcHRJZCBpbiB0aGlzLl9vcHRpb25zKSB7XG4gICAgICAgIGlmICghT2JqZWN0LmtleXMobW9kZWwuZ2V0KCdvcHRpb25zJykpLmluY2x1ZGVzKG9wdElkKSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5fb3B0aW9uc1tvcHRJZF0pO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vcHRpb25zW29wdElkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaWQgaW4gbW9kZWwuZ2V0KCdvcHRpb25zJykpIHtcbiAgICAgICAgbGV0IGxhYmVsID0gbW9kZWwuZ2V0KCdvcHRpb25zJylbaWRdO1xuICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnNbaWRdKSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0gPSBuZXcgT3B0aW9uVmlldyh7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICBzZWxlY3RlZDogbW9kZWwudmFsdWUoKSA9PSBpZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fb3B0aW9uc1tpZF0sIFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0uc2VsZWN0KG1vZGVsLnZhbHVlKCkgPT0gaWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiJdfQ==
