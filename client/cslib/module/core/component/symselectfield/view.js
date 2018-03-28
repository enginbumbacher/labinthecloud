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

      Utils.bindMethods(_this, ['_onFieldChange', '_onModelChange', '_addVariationPopUp', '_onVariationChange']);

      _this._options = {};
      _this._varOptions = {};
      if (model.get('color')) _this.$el.find('.symselectfield__label').css('color', model.get('color'));
      //if (model.get('inverse_order')) { this.$el.find(".symselectfield__label").remove().insertAfter(this.$el.find(".symselectfield__select"));}

      if (!Object.keys(model.get('varOptions')).length) {
        _this.variation = false;
        _this.$el.find(".symselectfield__variation").remove();
        _this.$el.find(".symselectfield__select").css({ 'margin-right': 'calc(0.5rem + 160px)' });
      } else {
        _this.variation = true;
        _this._addVariationPopUp(model);
        _this.$el.find(".variation__select").on('change', _this._onVariationChange);
      }

      _this._render(model);

      _this.$el.find(".symselectfield__select").on('change', _this._onFieldChange);
      _this.$el.find(".symselectfield__select").css({ 'font-size': '12px' });
      return _this;
    }

    _createClass(SymSelectFieldView, [{
      key: '_onVariationChange',
      value: function _onVariationChange(jqevt) {
        this.dispatchEvent('SymSelectField.ChangeRequest', {
          value: this.$el.find('.variation__select').val()
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
        if (this.variation) {
          this.$el.find('.variation_select').prop('disabled', true);
        }
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.symselectfield__select').prop('disabled', false);
        if (this.variation) {
          this.$el.find('.variation_select').prop('disabled', false);
        }
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
          var label = model.get('options')[id];
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
          }
        }

        if (this.variation) {
          for (var _optId in this._varOptions) {
            if (!Object.keys(model.get('varOptions')).includes(_optId)) {
              this.removeChild(this._varOptions[_optId]);
              delete this._varOptions[_optId];
            }
          }
          for (var _id in model.get('varOptions')) {
            var _label = model.get('varOptions')[_id];
            if (!this._varOptions[_id]) {
              this._varOptions[_id] = new OptionView({
                id: _id,
                label: _label,
                selected: model.value().variation == _id
              });
              this.addChild(this._varOptions[_id], ".variation__select");
            } else {
              var modelValue = 'variation_' + model.value().variation * 100;
              this._varOptions[_id].select(modelValue == _id);
            }
          }
        }
        if (model.get('disabled')) {
          this.disable();
        } else {
          this.enable();
        }
      }
    }, {
      key: '_addVariationPopUp',
      value: function _addVariationPopUp(model) {
        var description_style = {
          'display': 'none',
          'position': 'absolute',
          'min-width': '150px',
          'max-width': '300px',
          'min-height': '25px',
          'background-color': 'white',
          'border': '1px solid black',
          'opacity': '0.95',
          'z-index': '10',
          'text-align': 'left',
          'font-size': '12px',
          'padding': '5px'
        };

        var popup_message = 'Variation means that some models can have a ' + model.get('label').toLowerCase() + ' that is different from the average value you picked. The bigger the variation the bigger the possible differences from the average.';
        this.$el.find('.variation__popup').html(popup_message);

        this.$el.find('.variation__description').hover(function (e) {
          var posX = $(this).find('.variation__popup').position().left;
          var posY = $(this).find('.variation__popup').position().top;
          var height = $(this).find('.variation__popup').height();
          var width = $(this).find('.variation__popup').width();
          $(this).find('.variation__popup').css({ display: 'inline-block',
            left: posX - 1.0 * width,
            top: posY - 1.1 * height });
        }, function () {
          $(this).find('.variation__popup').css({ 'display': 'none' });
        });
      }
    }]);

    return SymSelectFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiX3Zhck9wdGlvbnMiLCJnZXQiLCIkZWwiLCJmaW5kIiwiY3NzIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsInZhcmlhdGlvbiIsInJlbW92ZSIsIl9hZGRWYXJpYXRpb25Qb3BVcCIsIm9uIiwiX29uVmFyaWF0aW9uQ2hhbmdlIiwiX3JlbmRlciIsIl9vbkZpZWxkQ2hhbmdlIiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwidmFsdWUiLCJ2YWwiLCJldnQiLCJkYXRhIiwicGF0aCIsInZhbHVlcyIsImZvckVhY2giLCJvcHQiLCJpbmNsdWRlcyIsImlkIiwiZGlzYWJsZSIsImhpZGUiLCJzaG93IiwiZW5hYmxlIiwiY3VycmVudFRhcmdldCIsInByb3AiLCJmb2N1cyIsImh0bWwiLCJvcHRJZCIsInJlbW92ZUNoaWxkIiwibGFiZWwiLCJzZWxlY3RlZCIsImFkZENoaWxkIiwibW9kZWxWYWx1ZSIsInF1YWxpdGF0aXZlVmFsdWUiLCJzZWxlY3QiLCJkZXNjcmlwdGlvbl9zdHlsZSIsInBvcHVwX21lc3NhZ2UiLCJ0b0xvd2VyQ2FzZSIsImhvdmVyIiwiZSIsInBvc1giLCIkIiwicG9zaXRpb24iLCJsZWZ0IiwicG9zWSIsInRvcCIsImhlaWdodCIsIndpZHRoIiwiZGlzcGxheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGdCQUFnQkQsUUFBUSxnQ0FBUixDQUF0QjtBQUFBLE1BQ0VFLGFBQWFGLFFBQVEsY0FBUixDQURmO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEs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LElBQW5DLENBQXdDVSxhQUF4Qzs7QUFHQSxhQUFLMUMsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUMyQyxLQUF6QyxDQUFnRCxVQUFTQyxDQUFULEVBQVk7QUFDNUIsY0FBSUMsT0FBT0MsRUFBRSxJQUFGLEVBQVE5QyxJQUFSLENBQWEsbUJBQWIsRUFBa0MrQyxRQUFsQyxHQUE2Q0MsSUFBeEQ7QUFDQSxjQUFJQyxPQUFPSCxFQUFFLElBQUYsRUFBUTlDLElBQVIsQ0FBYSxtQkFBYixFQUFrQytDLFFBQWxDLEdBQTZDRyxHQUF4RDtBQUNBLGNBQUlDLFNBQVNMLEVBQUUsSUFBRixFQUFROUMsSUFBUixDQUFhLG1CQUFiLEVBQWtDbUQsTUFBbEMsRUFBYjtBQUNBLGNBQUlDLFFBQVFOLEVBQUUsSUFBRixFQUFROUMsSUFBUixDQUFhLG1CQUFiLEVBQWtDb0QsS0FBbEMsRUFBWjtBQUNBTixZQUFFLElBQUYsRUFBUTlDLElBQVIsQ0FBYSxtQkFBYixFQUFrQ0MsR0FBbEMsQ0FBc0MsRUFBQ29ELFNBQVEsY0FBVDtBQUNBTCxrQkFBTUgsT0FBTyxNQUFJTyxLQURqQjtBQUVBRixpQkFBS0QsT0FBTyxNQUFJRSxNQUZoQixFQUF0QztBQUdELFNBUi9CLEVBUzhCLFlBQVU7QUFDUkwsWUFBRSxJQUFGLEVBQVE5QyxJQUFSLENBQWEsbUJBQWIsRUFBa0NDLEdBQWxDLENBQXNDLEVBQUMsV0FBVSxNQUFYLEVBQXRDO0FBQ0QsU0FYL0I7QUFhRDtBQS9KSDs7QUFBQTtBQUFBLElBQXdDWixhQUF4QztBQWlLRCxDQTFLRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc3ltc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgT3B0aW9uVmlldyA9IHJlcXVpcmUoJy4vb3B0aW9udmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc3ltc2VsZWN0ZmllbGQuaHRtbCcpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFN5bVNlbGVjdEZpZWxkVmlldyBleHRlbmRzIEJhc2VGaWVsZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCA/IHRtcGwgOiBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkZpZWxkQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJywnX2FkZFZhcmlhdGlvblBvcFVwJywnX29uVmFyaWF0aW9uQ2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLl9vcHRpb25zID0ge31cbiAgICAgIHRoaXMuX3Zhck9wdGlvbnMgPSB7fTtcbiAgICAgIGlmIChtb2RlbC5nZXQoJ2NvbG9yJykpIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fbGFiZWwnKS5jc3MoJ2NvbG9yJywgbW9kZWwuZ2V0KCdjb2xvcicpKTtcbiAgICAgIC8vaWYgKG1vZGVsLmdldCgnaW52ZXJzZV9vcmRlcicpKSB7IHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX2xhYmVsXCIpLnJlbW92ZSgpLmluc2VydEFmdGVyKHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKSk7fVxuXG4gICAgICBpZiAoIU9iamVjdC5rZXlzKG1vZGVsLmdldCgndmFyT3B0aW9ucycpKS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy52YXJpYXRpb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fdmFyaWF0aW9uXCIpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIikuY3NzKHsnbWFyZ2luLXJpZ2h0JzogJ2NhbGMoMC41cmVtICsgMTYwcHgpJ30pO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZhcmlhdGlvbiA9IHRydWU7XG4gICAgICAgIHRoaXMuX2FkZFZhcmlhdGlvblBvcFVwKG1vZGVsKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZChcIi52YXJpYXRpb25fX3NlbGVjdFwiKS5vbignY2hhbmdlJywgdGhpcy5fb25WYXJpYXRpb25DaGFuZ2UpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlbmRlcihtb2RlbCk7XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5vbignY2hhbmdlJywgdGhpcy5fb25GaWVsZENoYW5nZSlcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5jc3Moeydmb250LXNpemUnOicxMnB4J30pXG4gICAgfVxuXG4gICAgX29uVmFyaWF0aW9uQ2hhbmdlKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1N5bVNlbGVjdEZpZWxkLkNoYW5nZVJlcXVlc3QnLCB7XG4gICAgICAgIHZhbHVlOiB0aGlzLiRlbC5maW5kKCcudmFyaWF0aW9uX19zZWxlY3QnKS52YWwoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN1cGVyLl9vbk1vZGVsQ2hhbmdlKGV2dCk7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSAnZGlzYWJsZWRPcHRpb25zJykge1xuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuX29wdGlvbnMpLmZvckVhY2goKG9wdCkgPT4ge1xuICAgICAgICAgIGlmIChldnQuZGF0YS52YWx1ZS5pbmNsdWRlcyhvcHQuaWQoKSkpIHtcbiAgICAgICAgICAgIG9wdC5kaXNhYmxlKCk7XG4gICAgICAgICAgICBvcHQuaGlkZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHQuc2hvdygpO1xuICAgICAgICAgICAgb3B0LmVuYWJsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcihldnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRmllbGRDaGFuZ2UoanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRmllbGQuVmFsdWVDaGFuZ2UnLCB7XG4gICAgICAgIHZhbHVlOiB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIikudmFsKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgIGlmICh0aGlzLnZhcmlhdGlvbikge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcudmFyaWF0aW9uX3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICBpZiAodGhpcy52YXJpYXRpb24pIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnZhcmlhdGlvbl9zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19zZWxlY3QnKS5mb2N1cygpO1xuICAgIH1cblxuICAgIF9yZW5kZXIobW9kZWwpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fbGFiZWwnKS5odG1sKG1vZGVsLmdldCgnbGFiZWwnKSk7XG4gICAgICBmb3IgKGxldCBvcHRJZCBpbiB0aGlzLl9vcHRpb25zKSB7XG4gICAgICAgIGlmICghT2JqZWN0LmtleXMobW9kZWwuZ2V0KCdvcHRpb25zJykpLmluY2x1ZGVzKG9wdElkKSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5fb3B0aW9uc1tvcHRJZF0pO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vcHRpb25zW29wdElkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaWQgaW4gbW9kZWwuZ2V0KCdvcHRpb25zJykpIHtcbiAgICAgICAgbGV0IGxhYmVsID0gbW9kZWwuZ2V0KCdvcHRpb25zJylbaWRdO1xuICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnNbaWRdKSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0gPSBuZXcgT3B0aW9uVmlldyh7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICBzZWxlY3RlZDogbW9kZWwudmFsdWUoKSA9PSBpZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fb3B0aW9uc1tpZF0sIFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSBtb2RlbC52YWx1ZSgpLnF1YWxpdGF0aXZlVmFsdWU7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0uc2VsZWN0KG1vZGVsVmFsdWUgPT0gaWQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnZhcmlhdGlvbikge1xuICAgICAgICBmb3IgKGxldCBvcHRJZCBpbiB0aGlzLl92YXJPcHRpb25zKSB7XG4gICAgICAgICAgaWYgKCFPYmplY3Qua2V5cyhtb2RlbC5nZXQoJ3Zhck9wdGlvbnMnKSkuaW5jbHVkZXMob3B0SWQpKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX3Zhck9wdGlvbnNbb3B0SWRdKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl92YXJPcHRpb25zW29wdElkXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaWQgaW4gbW9kZWwuZ2V0KCd2YXJPcHRpb25zJykpIHtcbiAgICAgICAgICBsZXQgbGFiZWwgPSBtb2RlbC5nZXQoJ3Zhck9wdGlvbnMnKVtpZF07XG4gICAgICAgICAgaWYgKCF0aGlzLl92YXJPcHRpb25zW2lkXSkge1xuICAgICAgICAgICAgdGhpcy5fdmFyT3B0aW9uc1tpZF0gPSBuZXcgT3B0aW9uVmlldyh7XG4gICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgICBzZWxlY3RlZDogbW9kZWwudmFsdWUoKS52YXJpYXRpb24gPT0gaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl92YXJPcHRpb25zW2lkXSwgXCIudmFyaWF0aW9uX19zZWxlY3RcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0gJ3ZhcmlhdGlvbl8nICsgbW9kZWwudmFsdWUoKS52YXJpYXRpb24gKiAxMDA7XG4gICAgICAgICAgICB0aGlzLl92YXJPcHRpb25zW2lkXS5zZWxlY3QobW9kZWxWYWx1ZSA9PSBpZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfYWRkVmFyaWF0aW9uUG9wVXAobW9kZWwpIHtcbiAgICAgIHZhciBkZXNjcmlwdGlvbl9zdHlsZSA9IHtcbiAgICAgICAgJ2Rpc3BsYXknOiAnbm9uZScsXG4gICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICdtaW4td2lkdGgnOiAnMTUwcHgnLFxuICAgICAgICAnbWF4LXdpZHRoJzogJzMwMHB4JyxcbiAgICAgICAgJ21pbi1oZWlnaHQnOiAnMjVweCcsXG4gICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJ3doaXRlJyxcbiAgICAgICAgJ2JvcmRlcic6ICcxcHggc29saWQgYmxhY2snLFxuICAgICAgICAnb3BhY2l0eSc6ICcwLjk1JyxcbiAgICAgICAgJ3otaW5kZXgnOiAnMTAnLFxuICAgICAgICAndGV4dC1hbGlnbic6ICdsZWZ0JyxcbiAgICAgICAgJ2ZvbnQtc2l6ZSc6ICcxMnB4JyxcbiAgICAgICAgJ3BhZGRpbmcnOiAnNXB4J1xuICAgICAgfVxuXG4gICAgICBsZXQgcG9wdXBfbWVzc2FnZSA9ICdWYXJpYXRpb24gbWVhbnMgdGhhdCBzb21lIG1vZGVscyBjYW4gaGF2ZSBhICcgKyBtb2RlbC5nZXQoJ2xhYmVsJykudG9Mb3dlckNhc2UoKSArICcgdGhhdCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgYXZlcmFnZSB2YWx1ZSB5b3UgcGlja2VkLiBUaGUgYmlnZ2VyIHRoZSB2YXJpYXRpb24gdGhlIGJpZ2dlciB0aGUgcG9zc2libGUgZGlmZmVyZW5jZXMgZnJvbSB0aGUgYXZlcmFnZS4nO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnZhcmlhdGlvbl9fcG9wdXAnKS5odG1sKHBvcHVwX21lc3NhZ2UpO1xuXG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy52YXJpYXRpb25fX2Rlc2NyaXB0aW9uJykuaG92ZXIoIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvc1ggPSAkKHRoaXMpLmZpbmQoJy52YXJpYXRpb25fX3BvcHVwJykucG9zaXRpb24oKS5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9zWSA9ICQodGhpcykuZmluZCgnLnZhcmlhdGlvbl9fcG9wdXAnKS5wb3NpdGlvbigpLnRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhlaWdodCA9ICQodGhpcykuZmluZCgnLnZhcmlhdGlvbl9fcG9wdXAnKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdpZHRoID0gJCh0aGlzKS5maW5kKCcudmFyaWF0aW9uX19wb3B1cCcpLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnZhcmlhdGlvbl9fcG9wdXAnKS5jc3Moe2Rpc3BsYXk6J2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogcG9zWCAtIDEuMCp3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHBvc1kgLSAxLjEqaGVpZ2h0fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcudmFyaWF0aW9uX19wb3B1cCcpLmNzcyh7J2Rpc3BsYXknOidub25lJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
