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

      if (!model.get('varOptions')) {
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
            left: posX - 0.6 * width,
            top: posY - 1.1 * height });
        }, function () {
          $(this).find('.variation__popup').css({ 'display': 'none' });
        });
      }
    }]);

    return SymSelectFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiX3Zhck9wdGlvbnMiLCJnZXQiLCIkZWwiLCJmaW5kIiwiY3NzIiwidmFyaWF0aW9uIiwicmVtb3ZlIiwiX2FkZFZhcmlhdGlvblBvcFVwIiwib24iLCJfb25WYXJpYXRpb25DaGFuZ2UiLCJfcmVuZGVyIiwiX29uRmllbGRDaGFuZ2UiLCJqcWV2dCIsImRpc3BhdGNoRXZlbnQiLCJ2YWx1ZSIsInZhbCIsImV2dCIsImRhdGEiLCJwYXRoIiwiT2JqZWN0IiwidmFsdWVzIiwiZm9yRWFjaCIsIm9wdCIsImluY2x1ZGVzIiwiaWQiLCJkaXNhYmxlIiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJjdXJyZW50VGFyZ2V0IiwicHJvcCIsImZvY3VzIiwiaHRtbCIsIm9wdElkIiwia2V5cyIsInJlbW92ZUNoaWxkIiwibGFiZWwiLCJzZWxlY3RlZCIsImFkZENoaWxkIiwibW9kZWxWYWx1ZSIsInF1YWxpdGF0aXZlVmFsdWUiLCJzZWxlY3QiLCJkZXNjcmlwdGlvbl9zdHlsZSIsInBvcHVwX21lc3NhZ2UiLCJ0b0xvd2VyQ2FzZSIsImhvdmVyIiwiZSIsInBvc1giLCIkIiwicG9zaXRpb24iLCJsZWZ0IiwicG9zWSIsInRvcCIsImhlaWdodCIsIndpZHRoIiwiZGlzcGxheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGdCQUFnQkQsUUFBUSxnQ0FBUixDQUF0QjtBQUFBLE1BQ0VFLGFBQWFGLFFBQVEsY0FBUixDQURmO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRUksV0FBV0osUUFBUSw0QkFBUixDQUhiOztBQU1BQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UsZ0NBQVlLLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsMElBQ2pCRCxLQURpQixFQUNWQyxPQUFPQSxJQUFQLEdBQWNGLFFBREo7O0FBRXZCRCxZQUFNSSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsZ0JBQW5CLEVBQW9DLG9CQUFwQyxFQUF5RCxvQkFBekQsQ0FBeEI7O0FBRUEsWUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLFlBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxVQUFJSixNQUFNSyxHQUFOLENBQVUsT0FBVixDQUFKLEVBQXdCLE1BQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHdCQUFkLEVBQXdDQyxHQUF4QyxDQUE0QyxPQUE1QyxFQUFxRFIsTUFBTUssR0FBTixDQUFVLE9BQVYsQ0FBckQ7QUFDeEI7O0FBRUEsVUFBSSxDQUFDTCxNQUFNSyxHQUFOLENBQVUsWUFBVixDQUFMLEVBQThCO0FBQzVCLGNBQUtJLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxjQUFLSCxHQUFMLENBQVNDLElBQVQsQ0FBYyw0QkFBZCxFQUE0Q0csTUFBNUM7QUFDQSxjQUFLSixHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5Q0MsR0FBekMsQ0FBNkMsRUFBQyxnQkFBZ0Isc0JBQWpCLEVBQTdDO0FBRUQsT0FMRCxNQUtPO0FBQ0wsY0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLGNBQUtFLGtCQUFMLENBQXdCWCxLQUF4QjtBQUNBLGNBQUtNLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLG9CQUFkLEVBQW9DSyxFQUFwQyxDQUF1QyxRQUF2QyxFQUFpRCxNQUFLQyxrQkFBdEQ7QUFDRDs7QUFFRCxZQUFLQyxPQUFMLENBQWFkLEtBQWI7O0FBRUEsWUFBS00sR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNLLEVBQXpDLENBQTRDLFFBQTVDLEVBQXNELE1BQUtHLGNBQTNEO0FBQ0EsWUFBS1QsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNDLEdBQXpDLENBQTZDLEVBQUMsYUFBWSxNQUFiLEVBQTdDO0FBdkJ1QjtBQXdCeEI7O0FBekJIO0FBQUE7QUFBQSx5Q0EyQnFCUSxLQTNCckIsRUEyQjRCO0FBQ3hCLGFBQUtDLGFBQUwsQ0FBbUIsOEJBQW5CLEVBQW1EO0FBQ2pEQyxpQkFBTyxLQUFLWixHQUFMLENBQVNDLElBQVQsQ0FBYyxvQkFBZCxFQUFvQ1ksR0FBcEM7QUFEMEMsU0FBbkQ7QUFHRDtBQS9CSDtBQUFBO0FBQUEscUNBaUNpQkMsR0FqQ2pCLEVBaUNzQjtBQUNsQiwrSUFBcUJBLEdBQXJCO0FBQ0EsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxJQUFULElBQWlCLGlCQUFyQixFQUF3QztBQUN0Q0MsaUJBQU9DLE1BQVAsQ0FBYyxLQUFLckIsUUFBbkIsRUFBNkJzQixPQUE3QixDQUFxQyxVQUFDQyxHQUFELEVBQVM7QUFDNUMsZ0JBQUlOLElBQUlDLElBQUosQ0FBU0gsS0FBVCxDQUFlUyxRQUFmLENBQXdCRCxJQUFJRSxFQUFKLEVBQXhCLENBQUosRUFBdUM7QUFDckNGLGtCQUFJRyxPQUFKO0FBQ0FILGtCQUFJSSxJQUFKO0FBQ0QsYUFIRCxNQUdPO0FBQ0xKLGtCQUFJSyxJQUFKO0FBQ0FMLGtCQUFJTSxNQUFKO0FBQ0Q7QUFDRixXQVJEO0FBU0QsU0FWRCxNQVVPO0FBQ0wsZUFBS2xCLE9BQUwsQ0FBYU0sSUFBSWEsYUFBakI7QUFDRDtBQUNGO0FBaERIO0FBQUE7QUFBQSxxQ0FrRGlCakIsS0FsRGpCLEVBa0R3QjtBQUNwQixhQUFLQyxhQUFMLENBQW1CLG1CQUFuQixFQUF3QztBQUN0Q0MsaUJBQU8sS0FBS1osR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUNZLEdBQXpDO0FBRCtCLFNBQXhDO0FBR0Q7QUF0REg7QUFBQTtBQUFBLGdDQXdEWTtBQUNSLGFBQUtiLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHlCQUFkLEVBQXlDMkIsSUFBekMsQ0FBOEMsVUFBOUMsRUFBMEQsSUFBMUQ7QUFDQSxZQUFJLEtBQUt6QixTQUFULEVBQW9CO0FBQ2xCLGVBQUtILEdBQUwsQ0FBU0MsSUFBVCxDQUFjLG1CQUFkLEVBQW1DMkIsSUFBbkMsQ0FBd0MsVUFBeEMsRUFBb0QsSUFBcEQ7QUFDRDtBQUNGO0FBN0RIO0FBQUE7QUFBQSwrQkErRFc7QUFDUCxhQUFLNUIsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUMyQixJQUF6QyxDQUE4QyxVQUE5QyxFQUEwRCxLQUExRDtBQUNBLFlBQUksS0FBS3pCLFNBQVQsRUFBb0I7QUFDbEIsZUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMsbUJBQWQsRUFBbUMyQixJQUFuQyxDQUF3QyxVQUF4QyxFQUFvRCxLQUFwRDtBQUNEO0FBQ0Y7QUFwRUg7QUFBQTtBQUFBLDhCQXNFVTtBQUNOLGFBQUs1QixHQUFMLENBQVNDLElBQVQsQ0FBYyx5QkFBZCxFQUF5QzRCLEtBQXpDO0FBQ0Q7QUF4RUg7QUFBQTtBQUFBLDhCQTBFVW5DLEtBMUVWLEVBMEVpQjtBQUNiLGFBQUtNLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHdCQUFkLEVBQXdDNkIsSUFBeEMsQ0FBNkNwQyxNQUFNSyxHQUFOLENBQVUsT0FBVixDQUE3QztBQUNBLGFBQUssSUFBSWdDLEtBQVQsSUFBa0IsS0FBS2xDLFFBQXZCLEVBQWlDO0FBQy9CLGNBQUksQ0FBQ29CLE9BQU9lLElBQVAsQ0FBWXRDLE1BQU1LLEdBQU4sQ0FBVSxTQUFWLENBQVosRUFBa0NzQixRQUFsQyxDQUEyQ1UsS0FBM0MsQ0FBTCxFQUF3RDtBQUN0RCxpQkFBS0UsV0FBTCxDQUFpQixLQUFLcEMsUUFBTCxDQUFja0MsS0FBZCxDQUFqQjtBQUNBLG1CQUFPLEtBQUtsQyxRQUFMLENBQWNrQyxLQUFkLENBQVA7QUFDRDtBQUNGO0FBQ0QsYUFBSyxJQUFJVCxFQUFULElBQWU1QixNQUFNSyxHQUFOLENBQVUsU0FBVixDQUFmLEVBQXFDO0FBQ25DLGNBQUltQyxRQUFReEMsTUFBTUssR0FBTixDQUFVLFNBQVYsRUFBcUJ1QixFQUFyQixDQUFaO0FBQ0EsY0FBSSxDQUFDLEtBQUt6QixRQUFMLENBQWN5QixFQUFkLENBQUwsRUFBd0I7QUFDdEIsaUJBQUt6QixRQUFMLENBQWN5QixFQUFkLElBQW9CLElBQUkvQixVQUFKLENBQWU7QUFDakMrQixrQkFBSUEsRUFENkI7QUFFakNZLHFCQUFPQSxLQUYwQjtBQUdqQ0Msd0JBQVV6QyxNQUFNa0IsS0FBTixNQUFpQlU7QUFITSxhQUFmLENBQXBCO0FBS0EsaUJBQUtjLFFBQUwsQ0FBYyxLQUFLdkMsUUFBTCxDQUFjeUIsRUFBZCxDQUFkLEVBQWlDLHlCQUFqQztBQUNELFdBUEQsTUFPTztBQUNMLGdCQUFJZSxhQUFhM0MsTUFBTWtCLEtBQU4sR0FBYzBCLGdCQUEvQjtBQUNBLGlCQUFLekMsUUFBTCxDQUFjeUIsRUFBZCxFQUFrQmlCLE1BQWxCLENBQXlCRixjQUFjZixFQUF2QztBQUNEO0FBQ0Y7O0FBRUQsWUFBSSxLQUFLbkIsU0FBVCxFQUFvQjtBQUNsQixlQUFLLElBQUk0QixNQUFULElBQWtCLEtBQUtqQyxXQUF2QixFQUFvQztBQUNsQyxnQkFBSSxDQUFDbUIsT0FBT2UsSUFBUCxDQUFZdEMsTUFBTUssR0FBTixDQUFVLFlBQVYsQ0FBWixFQUFxQ3NCLFFBQXJDLENBQThDVSxNQUE5QyxDQUFMLEVBQTJEO0FBQ3pELG1CQUFLRSxXQUFMLENBQWlCLEtBQUtuQyxXQUFMLENBQWlCaUMsTUFBakIsQ0FBakI7QUFDQSxxQkFBTyxLQUFLakMsV0FBTCxDQUFpQmlDLE1BQWpCLENBQVA7QUFDRDtBQUNGO0FBQ0QsZUFBSyxJQUFJVCxHQUFULElBQWU1QixNQUFNSyxHQUFOLENBQVUsWUFBVixDQUFmLEVBQXdDO0FBQ3RDLGdCQUFJbUMsU0FBUXhDLE1BQU1LLEdBQU4sQ0FBVSxZQUFWLEVBQXdCdUIsR0FBeEIsQ0FBWjtBQUNBLGdCQUFJLENBQUMsS0FBS3hCLFdBQUwsQ0FBaUJ3QixHQUFqQixDQUFMLEVBQTJCO0FBQ3pCLG1CQUFLeEIsV0FBTCxDQUFpQndCLEdBQWpCLElBQXVCLElBQUkvQixVQUFKLENBQWU7QUFDcEMrQixvQkFBSUEsR0FEZ0M7QUFFcENZLHVCQUFPQSxNQUY2QjtBQUdwQ0MsMEJBQVV6QyxNQUFNa0IsS0FBTixHQUFjVCxTQUFkLElBQTJCbUI7QUFIRCxlQUFmLENBQXZCO0FBS0EsbUJBQUtjLFFBQUwsQ0FBYyxLQUFLdEMsV0FBTCxDQUFpQndCLEdBQWpCLENBQWQsRUFBb0Msb0JBQXBDO0FBQ0QsYUFQRCxNQU9PO0FBQ0wsa0JBQUllLGFBQWEsZUFBZTNDLE1BQU1rQixLQUFOLEdBQWNULFNBQWQsR0FBMEIsR0FBMUQ7QUFDQSxtQkFBS0wsV0FBTCxDQUFpQndCLEdBQWpCLEVBQXFCaUIsTUFBckIsQ0FBNEJGLGNBQWNmLEdBQTFDO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsWUFBSTVCLE1BQU1LLEdBQU4sQ0FBVSxVQUFWLENBQUosRUFBMkI7QUFDekIsZUFBS3dCLE9BQUw7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLRyxNQUFMO0FBQ0Q7QUFDRjtBQTVISDtBQUFBO0FBQUEseUNBOEhxQmhDLEtBOUhyQixFQThINEI7QUFDeEIsWUFBSThDLG9CQUFvQjtBQUN0QixxQkFBVyxNQURXO0FBRXRCLHNCQUFZLFVBRlU7QUFHdEIsdUJBQWEsT0FIUztBQUl0Qix1QkFBYSxPQUpTO0FBS3RCLHdCQUFjLE1BTFE7QUFNdEIsOEJBQW9CLE9BTkU7QUFPdEIsb0JBQVUsaUJBUFk7QUFRdEIscUJBQVcsTUFSVztBQVN0QixxQkFBVyxJQVRXO0FBVXRCLHdCQUFjLE1BVlE7QUFXdEIsdUJBQWEsTUFYUztBQVl0QixxQkFBVztBQVpXLFNBQXhCOztBQWVBLFlBQUlDLGdCQUFnQixpREFBaUQvQyxNQUFNSyxHQUFOLENBQVUsT0FBVixFQUFtQjJDLFdBQW5CLEVBQWpELEdBQW9GLHNJQUF4RztBQUNBLGFBQUsxQyxHQUFMLENBQVNDLElBQVQsQ0FBYyxtQkFBZCxFQUFtQzZCLElBQW5DLENBQXdDVyxhQUF4Qzs7QUFHQSxhQUFLekMsR0FBTCxDQUFTQyxJQUFULENBQWMseUJBQWQsRUFBeUMwQyxLQUF6QyxDQUFnRCxVQUFTQyxDQUFULEVBQVk7QUFDNUIsY0FBSUMsT0FBT0MsRUFBRSxJQUFGLEVBQVE3QyxJQUFSLENBQWEsbUJBQWIsRUFBa0M4QyxRQUFsQyxHQUE2Q0MsSUFBeEQ7QUFDQSxjQUFJQyxPQUFPSCxFQUFFLElBQUYsRUFBUTdDLElBQVIsQ0FBYSxtQkFBYixFQUFrQzhDLFFBQWxDLEdBQTZDRyxHQUF4RDtBQUNBLGNBQUlDLFNBQVNMLEVBQUUsSUFBRixFQUFRN0MsSUFBUixDQUFhLG1CQUFiLEVBQWtDa0QsTUFBbEMsRUFBYjtBQUNBLGNBQUlDLFFBQVFOLEVBQUUsSUFBRixFQUFRN0MsSUFBUixDQUFhLG1CQUFiLEVBQWtDbUQsS0FBbEMsRUFBWjtBQUNBTixZQUFFLElBQUYsRUFBUTdDLElBQVIsQ0FBYSxtQkFBYixFQUFrQ0MsR0FBbEMsQ0FBc0MsRUFBQ21ELFNBQVEsY0FBVDtBQUNBTCxrQkFBTUgsT0FBTyxNQUFJTyxLQURqQjtBQUVBRixpQkFBS0QsT0FBTyxNQUFJRSxNQUZoQixFQUF0QztBQUdELFNBUi9CLEVBUzhCLFlBQVU7QUFDUkwsWUFBRSxJQUFGLEVBQVE3QyxJQUFSLENBQWEsbUJBQWIsRUFBa0NDLEdBQWxDLENBQXNDLEVBQUMsV0FBVSxNQUFYLEVBQXRDO0FBQ0QsU0FYL0I7QUFhRDtBQS9KSDs7QUFBQTtBQUFBLElBQXdDWixhQUF4QztBQWlLRCxDQTFLRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc3ltc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgT3B0aW9uVmlldyA9IHJlcXVpcmUoJy4vb3B0aW9udmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc3ltc2VsZWN0ZmllbGQuaHRtbCcpXG4gIDtcblxuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIFN5bVNlbGVjdEZpZWxkVmlldyBleHRlbmRzIEJhc2VGaWVsZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCA/IHRtcGwgOiBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkZpZWxkQ2hhbmdlJywgJ19vbk1vZGVsQ2hhbmdlJywnX2FkZFZhcmlhdGlvblBvcFVwJywnX29uVmFyaWF0aW9uQ2hhbmdlJ10pO1xuXG4gICAgICB0aGlzLl9vcHRpb25zID0ge31cbiAgICAgIHRoaXMuX3Zhck9wdGlvbnMgPSB7fTtcbiAgICAgIGlmIChtb2RlbC5nZXQoJ2NvbG9yJykpIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fbGFiZWwnKS5jc3MoJ2NvbG9yJywgbW9kZWwuZ2V0KCdjb2xvcicpKTtcbiAgICAgIC8vaWYgKG1vZGVsLmdldCgnaW52ZXJzZV9vcmRlcicpKSB7IHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX2xhYmVsXCIpLnJlbW92ZSgpLmluc2VydEFmdGVyKHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3NlbGVjdFwiKSk7fVxuXG4gICAgICBpZiAoIW1vZGVsLmdldCgndmFyT3B0aW9ucycpKSB7XG4gICAgICAgIHRoaXMudmFyaWF0aW9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc3ltc2VsZWN0ZmllbGRfX3ZhcmlhdGlvblwiKS5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLmNzcyh7J21hcmdpbi1yaWdodCc6ICdjYWxjKDAuNXJlbSArIDE2MHB4KSd9KTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52YXJpYXRpb24gPSB0cnVlO1xuICAgICAgICB0aGlzLl9hZGRWYXJpYXRpb25Qb3BVcChtb2RlbCk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoXCIudmFyaWF0aW9uX19zZWxlY3RcIikub24oJ2NoYW5nZScsIHRoaXMuX29uVmFyaWF0aW9uQ2hhbmdlKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZW5kZXIobW9kZWwpO1xuXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIikub24oJ2NoYW5nZScsIHRoaXMuX29uRmllbGRDaGFuZ2UpXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLnN5bXNlbGVjdGZpZWxkX19zZWxlY3RcIikuY3NzKHsnZm9udC1zaXplJzonMTJweCd9KVxuICAgIH1cblxuICAgIF9vblZhcmlhdGlvbkNoYW5nZShqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdTeW1TZWxlY3RGaWVsZC5DaGFuZ2VSZXF1ZXN0Jywge1xuICAgICAgICB2YWx1ZTogdGhpcy4kZWwuZmluZCgnLnZhcmlhdGlvbl9fc2VsZWN0JykudmFsKClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gJ2Rpc2FibGVkT3B0aW9ucycpIHtcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9vcHRpb25zKS5mb3JFYWNoKChvcHQpID0+IHtcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUuaW5jbHVkZXMob3B0LmlkKCkpKSB7XG4gICAgICAgICAgICBvcHQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgb3B0LmhpZGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0LnNob3coKTtcbiAgICAgICAgICAgIG9wdC5lbmFibGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkZpZWxkQ2hhbmdlKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLlZhbHVlQ2hhbmdlJywge1xuICAgICAgICB2YWx1ZTogdGhpcy4kZWwuZmluZChcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLnZhbCgpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgICBpZiAodGhpcy52YXJpYXRpb24pIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLnZhcmlhdGlvbl9zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnN5bXNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgaWYgKHRoaXMudmFyaWF0aW9uKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy52YXJpYXRpb25fc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0JykuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKG1vZGVsKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc3ltc2VsZWN0ZmllbGRfX2xhYmVsJykuaHRtbChtb2RlbC5nZXQoJ2xhYmVsJykpO1xuICAgICAgZm9yIChsZXQgb3B0SWQgaW4gdGhpcy5fb3B0aW9ucykge1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKG1vZGVsLmdldCgnb3B0aW9ucycpKS5pbmNsdWRlcyhvcHRJZCkpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX29wdGlvbnNbb3B0SWRdKTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fb3B0aW9uc1tvcHRJZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGlkIGluIG1vZGVsLmdldCgnb3B0aW9ucycpKSB7XG4gICAgICAgIGxldCBsYWJlbCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zW2lkXSkge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdID0gbmV3IE9wdGlvblZpZXcoe1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG1vZGVsLnZhbHVlKCkgPT0gaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX29wdGlvbnNbaWRdLCBcIi5zeW1zZWxlY3RmaWVsZF9fc2VsZWN0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0gbW9kZWwudmFsdWUoKS5xdWFsaXRhdGl2ZVZhbHVlO1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdLnNlbGVjdChtb2RlbFZhbHVlID09IGlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy52YXJpYXRpb24pIHtcbiAgICAgICAgZm9yIChsZXQgb3B0SWQgaW4gdGhpcy5fdmFyT3B0aW9ucykge1xuICAgICAgICAgIGlmICghT2JqZWN0LmtleXMobW9kZWwuZ2V0KCd2YXJPcHRpb25zJykpLmluY2x1ZGVzKG9wdElkKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLl92YXJPcHRpb25zW29wdElkXSk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fdmFyT3B0aW9uc1tvcHRJZF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGlkIGluIG1vZGVsLmdldCgndmFyT3B0aW9ucycpKSB7XG4gICAgICAgICAgbGV0IGxhYmVsID0gbW9kZWwuZ2V0KCd2YXJPcHRpb25zJylbaWRdO1xuICAgICAgICAgIGlmICghdGhpcy5fdmFyT3B0aW9uc1tpZF0pIHtcbiAgICAgICAgICAgIHRoaXMuX3Zhck9wdGlvbnNbaWRdID0gbmV3IE9wdGlvblZpZXcoe1xuICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgc2VsZWN0ZWQ6IG1vZGVsLnZhbHVlKCkudmFyaWF0aW9uID09IGlkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fdmFyT3B0aW9uc1tpZF0sIFwiLnZhcmlhdGlvbl9fc2VsZWN0XCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9ICd2YXJpYXRpb25fJyArIG1vZGVsLnZhbHVlKCkudmFyaWF0aW9uICogMTAwO1xuICAgICAgICAgICAgdGhpcy5fdmFyT3B0aW9uc1tpZF0uc2VsZWN0KG1vZGVsVmFsdWUgPT0gaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1vZGVsLmdldCgnZGlzYWJsZWQnKSkge1xuICAgICAgICB0aGlzLmRpc2FibGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2FkZFZhcmlhdGlvblBvcFVwKG1vZGVsKSB7XG4gICAgICB2YXIgZGVzY3JpcHRpb25fc3R5bGUgPSB7XG4gICAgICAgICdkaXNwbGF5JzogJ25vbmUnLFxuICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxuICAgICAgICAnbWluLXdpZHRoJzogJzE1MHB4JyxcbiAgICAgICAgJ21heC13aWR0aCc6ICczMDBweCcsXG4gICAgICAgICdtaW4taGVpZ2h0JzogJzI1cHgnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICd3aGl0ZScsXG4gICAgICAgICdib3JkZXInOiAnMXB4IHNvbGlkIGJsYWNrJyxcbiAgICAgICAgJ29wYWNpdHknOiAnMC45NScsXG4gICAgICAgICd6LWluZGV4JzogJzEwJyxcbiAgICAgICAgJ3RleHQtYWxpZ24nOiAnbGVmdCcsXG4gICAgICAgICdmb250LXNpemUnOiAnMTJweCcsXG4gICAgICAgICdwYWRkaW5nJzogJzVweCdcbiAgICAgIH1cblxuICAgICAgbGV0IHBvcHVwX21lc3NhZ2UgPSAnVmFyaWF0aW9uIG1lYW5zIHRoYXQgc29tZSBtb2RlbHMgY2FuIGhhdmUgYSAnICsgbW9kZWwuZ2V0KCdsYWJlbCcpLnRvTG93ZXJDYXNlKCkgKyAnIHRoYXQgaXMgZGlmZmVyZW50IGZyb20gdGhlIGF2ZXJhZ2UgdmFsdWUgeW91IHBpY2tlZC4gVGhlIGJpZ2dlciB0aGUgdmFyaWF0aW9uIHRoZSBiaWdnZXIgdGhlIHBvc3NpYmxlIGRpZmZlcmVuY2VzIGZyb20gdGhlIGF2ZXJhZ2UuJztcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy52YXJpYXRpb25fX3BvcHVwJykuaHRtbChwb3B1cF9tZXNzYWdlKTtcblxuXG4gICAgICB0aGlzLiRlbC5maW5kKCcudmFyaWF0aW9uX19kZXNjcmlwdGlvbicpLmhvdmVyKCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb3NYID0gJCh0aGlzKS5maW5kKCcudmFyaWF0aW9uX19wb3B1cCcpLnBvc2l0aW9uKCkubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvc1kgPSAkKHRoaXMpLmZpbmQoJy52YXJpYXRpb25fX3BvcHVwJykucG9zaXRpb24oKS50b3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoZWlnaHQgPSAkKHRoaXMpLmZpbmQoJy52YXJpYXRpb25fX3BvcHVwJykuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3aWR0aCA9ICQodGhpcykuZmluZCgnLnZhcmlhdGlvbl9fcG9wdXAnKS53aWR0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy52YXJpYXRpb25fX3BvcHVwJykuY3NzKHtkaXNwbGF5OidpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHBvc1ggLSAwLjYqd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NZIC0gMS4xKmhlaWdodH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnZhcmlhdGlvbl9fcG9wdXAnKS5jc3MoeydkaXNwbGF5Jzonbm9uZSd9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgIH1cbiAgfTtcbn0pO1xuIl19
