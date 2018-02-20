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
      Template = require('text!./symselectfield.html');

  require('link!./style.css');

  return function (_BaseFieldView) {
    _inherits(SymSelectFieldView, _BaseFieldView);

    function SymSelectFieldView(model, tmpl) {
      _classCallCheck(this, SymSelectFieldView);

      var _this = _possibleConstructorReturn(this, (SymSelectFieldView.__proto__ || Object.getPrototypeOf(SymSelectFieldView)).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onFieldChange', '_onModelChange', '_onChecked']);

      _this._options = {};
      if (model.get('color')) _this.$el.find('.symselectfield__label').css('color', model.get('color'));
      //if (model.get('inverse_order')) { this.$el.find(".symselectfield__label").remove().insertAfter(this.$el.find(".symselectfield__select"));}

      if (!model.get('includeVariation')) {
        _this.$el.find(".symselectfield__variation").remove();
        if (!(model.get('id') === 'variation')) {
          _this.$el.find(".symselectfield__select").css({ 'margin-right': 'calc(0.5rem + 120px)' });
        } else {
          _this.$el.find(".symselectfield__select").css({ 'margin-right': 'auto' });
          _this.$el.find(".symselectfield__label").css({ 'flex-grow': '0' });
        }
      } else {
        _this.$el.find('.symselectfield__checkbox').on('click', _this._onChecked);
      }

      _this._render(model);

      _this.$el.find(".symselectfield__select").on('change', _this._onFieldChange);
      _this.$el.find(".symselectfield__select").css({ 'font-size': '12px' });
      return _this;
    }

    _createClass(SymSelectFieldView, [{
      key: '_onChecked',
      value: function _onChecked(jqevt) {
        this.dispatchEvent('SymSelectField.ChangeRequest', {
          value: this.$el.find('.symselectfield__checkbox').prop('checked')
        });
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(SymSelectFieldView.prototype.__proto__ || Object.getPrototypeOf(SymSelectFieldView.prototype), '_onModelChange', this).call(this, evt);
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
          value: this.$el.find(".symselectfield__select").val()
        });
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.symselectfield__select').prop('disabled', true);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.symselectfield__select').prop('disabled', false);
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.$el.find('.symselectfield__select').focus();
      }
    }, {
      key: '_render',
      value: function _render(model) {
        this.$el.find('.symselectfield__label').html(model.get('label'));
        for (var optId in this._options) {
          if (!Object.keys(model.get('options')).includes(optId)) {
            this.removeChild(this._options[optId]);
            delete this._options[optId];
          }
        }
        for (var id in model.get('options')) {
          var label = null;
          if (parseInt(id + 1)) {
            // if no key is given in the options, but just an array of values
            label = model.get('options')[id];
            id = model.get('options')[id];
          } else {
            label = model.get('options')[id];
          }
          if (!this._options[id]) {
            this._options[id] = new OptionView({
              id: id,
              label: label,
              selected: model.value() == id
            });
            this.addChild(this._options[id], ".symselectfield__select");
          } else {
            var modelValue = model.value().qualitativeValue;
            this._options[id].select(modelValue == id);
            if (this.$el.find('.symselectfield__checkbox')) {
              this.$el.find('.symselectfield__checkbox').prop('checked', model.value().variation);
            }
          }
        }
        if (model.get('disabled')) {
          this.disable();
        } else {
          this.enable();
        }
      }
    }]);

    return SymSelectFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiZ2V0IiwiJGVsIiwiZmluZCIsImNzcyIsInJlbW92ZSIsIm9uIiwiX29uQ2hlY2tlZCIsIl9yZW5kZXIiLCJfb25GaWVsZENoYW5nZSIsImpxZXZ0IiwiZGlzcGF0Y2hFdmVudCIsInZhbHVlIiwicHJvcCIsImV2dCIsImRhdGEiLCJwYXRoIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsIm9wdCIsImluY2x1ZGVzIiwiaWQiLCJkaXNhYmxlIiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJjdXJyZW50VGFyZ2V0IiwidmFsIiwiZm9jdXMiLCJodG1sIiwib3B0SWQiLCJrZXlzIiwicmVtb3ZlQ2hpbGQiLCJsYWJlbCIsInBhcnNlSW50Iiwic2VsZWN0ZWQiLCJhZGRDaGlsZCIsIm1vZGVsVmFsdWUiLCJxdWFsaXRhdGl2ZVZhbHVlIiwic2VsZWN0IiwidmFyaWF0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsZ0JBQWdCRCxRQUFRLGdDQUFSLENBQXRCO0FBQUEsTUFDRUUsYUFBYUYsUUFBUSxjQUFSLENBRGY7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxXQUFXSixRQUFRLDRCQUFSLENBSGI7O0FBTUFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxnQ0FBWUssS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSwwSUFDakJELEtBRGlCLEVBQ1ZDLE9BQU9BLElBQVAsR0FBY0YsUUFESjs7QUFFdkJELFlBQU1JLFdBQU4sUUFBd0Is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TCxFQUF3QjtBQUN0QixpQkFBS3RCLFFBQUwsQ0FBY3NCLEVBQWQsSUFBb0IsSUFBSTVCLFVBQUosQ0FBZTtBQUNqQzRCLGtCQUFJQSxFQUQ2QjtBQUVqQ1kscUJBQU9BLEtBRjBCO0FBR2pDRSx3QkFBVXZDLE1BQU1lLEtBQU4sTUFBaUJVO0FBSE0sYUFBZixDQUFwQjtBQUtBLGlCQUFLZSxRQUFMLENBQWMsS0FBS3JDLFFBQUwsQ0FBY3NCLEVBQWQsQ0FBZCxFQUFpQyx5QkFBakM7QUFDRCxXQVBELE1BT087QUFDTCxnQkFBSWdCLGFBQWF6QyxNQUFNZSxLQUFOLEdBQWMyQixnQkFBL0I7QUFDQSxpQkFBS3ZDLFFBQUwsQ0FBY3NCLEVBQWQsRUFBa0JrQixNQUFsQixDQUF5QkYsY0FBY2hCLEVBQXZDO0FBQ0EsZ0JBQUksS0FBS3BCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLDJCQUFkLENBQUosRUFBZ0Q7QUFDOUMsbUJBQUtELEdBQUwsQ0FBU0MsSUFBVCxDQUFjLDJCQUFkLEVBQTJDVSxJQUEzQyxDQUFnRCxTQUFoRCxFQUEyRGhCLE1BQU1lLEtBQU4sR0FBYzZCLFNBQXpFO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsWUFBSTVDLE1BQU1JLEdBQU4sQ0FBVSxVQUFWLENBQUosRUFBMkI7QUFDekIsZUFBS3NCLE9BQUw7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLRyxNQUFMO0FBQ0Q7QUFDRjtBQXhHSDs7QUFBQTtBQUFBLElBQXdDakMsYUFBeEM7QUEwR0QsQ0FuSEQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3N5bXNlbGVjdGZpZWxkL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQmFzZUZpZWxkVmlldyA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvdmlldycpLFxuICAgIE9wdGlvblZpZXcgPSByZXF1aXJlKCcuL29wdGlvbnZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3N5bXNlbGVjdGZpZWxkLmh0bWwnKVxuICA7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBTeW1TZWxlY3RGaWVsZFZpZXcgZXh0ZW5kcyBCYXNlRmllbGRWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIobW9kZWwsIHRtcGwgPyB0bXBsIDogVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25GaWVsZENoYW5nZScsICdfb25Nb2RlbENoYW5nZScsICdfb25DaGVja2VkJ10pO1xuXG4gICAgICB0aGlzLl9vcHRpb25zID0ge31cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2NvbG9yJykpIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fbGFiZWwnKS5jc3MoJ2NvbG9yJywgbW9kZWwuZ2V0KCdjb2xvcicpKTtcbiAgICAgIC8vaWYgKG1vZGVsLmdldCgnaW52ZXJzZV9vcmRlcicpKSB7IHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX2xhYmVsXCIpLnJlbW92ZSgpLmluc2VydEFmdGVyKHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKSk7fVxuXG4gICAgICBpZiAoIW1vZGVsLmdldCgnaW5jbHVkZVZhcmlhdGlvbicpKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3ZhcmlhdGlvblwiKS5yZW1vdmUoKTtcbiAgICAgICAgaWYgKCEobW9kZWwuZ2V0KCdpZCcpPT09J3ZhcmlhdGlvbicpKSB7IHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5jc3MoeydtYXJnaW4tcmlnaHQnOiAnY2FsYygwLjVyZW0gKyAxMjBweCknfSk7IH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLmNzcyh7J21hcmdpbi1yaWdodCc6ICdhdXRvJ30pO1xuICAgICAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX2xhYmVsXCIpLmNzcyh7J2ZsZXgtZ3Jvdyc6ICcwJ30pO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fY2hlY2tib3gnKS5vbignY2xpY2snLCB0aGlzLl9vbkNoZWNrZWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZW5kZXIobW9kZWwpO1xuXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIikub24oJ2NoYW5nZScsIHRoaXMuX29uRmllbGRDaGFuZ2UpXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIikuY3NzKHsnZm9udC1zaXplJzonMTJweCd9KVxuICAgIH1cblxuICAgIF9vbkNoZWNrZWQoanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnU3ltU2VsZWN0RmllbGQuQ2hhbmdlUmVxdWVzdCcsIHtcbiAgICAgICAgdmFsdWU6IHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fY2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gJ2Rpc2FibGVkT3B0aW9ucycpIHtcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9vcHRpb25zKS5mb3JFYWNoKChvcHQpID0+IHtcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUuaW5jbHVkZXMob3B0LmlkKCkpKSB7XG4gICAgICAgICAgICBvcHQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgb3B0LmhpZGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0LnNob3coKTtcbiAgICAgICAgICAgIG9wdC5lbmFibGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkZpZWxkQ2hhbmdlKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLlZhbHVlQ2hhbmdlJywge1xuICAgICAgICB2YWx1ZTogdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLnZhbCgpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19zZWxlY3QnKS5mb2N1cygpO1xuICAgIH1cblxuICAgIF9yZW5kZXIobW9kZWwpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fbGFiZWwnKS5odG1sKG1vZGVsLmdldCgnbGFiZWwnKSk7XG4gICAgICBmb3IgKGxldCBvcHRJZCBpbiB0aGlzLl9vcHRpb25zKSB7XG4gICAgICAgIGlmICghT2JqZWN0LmtleXMobW9kZWwuZ2V0KCdvcHRpb25zJykpLmluY2x1ZGVzKG9wdElkKSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5fb3B0aW9uc1tvcHRJZF0pO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vcHRpb25zW29wdElkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaWQgaW4gbW9kZWwuZ2V0KCdvcHRpb25zJykpIHtcbiAgICAgICAgbGV0IGxhYmVsID0gbnVsbDtcbiAgICAgICAgaWYgKHBhcnNlSW50KGlkICsgMSkpIHsgLy8gaWYgbm8ga2V5IGlzIGdpdmVuIGluIHRoZSBvcHRpb25zLCBidXQganVzdCBhbiBhcnJheSBvZiB2YWx1ZXNcbiAgICAgICAgICBsYWJlbCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgICBpZCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsYWJlbCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnNbaWRdKSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0gPSBuZXcgT3B0aW9uVmlldyh7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICBzZWxlY3RlZDogbW9kZWwudmFsdWUoKSA9PSBpZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fb3B0aW9uc1tpZF0sIFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSBtb2RlbC52YWx1ZSgpLnF1YWxpdGF0aXZlVmFsdWU7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0uc2VsZWN0KG1vZGVsVmFsdWUgPT0gaWQpO1xuICAgICAgICAgIGlmICh0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX2NoZWNrYm94JykpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fY2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJywgbW9kZWwudmFsdWUoKS52YXJpYXRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1vZGVsLmdldCgnZGlzYWJsZWQnKSkge1xuICAgICAgICB0aGlzLmRpc2FibGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
