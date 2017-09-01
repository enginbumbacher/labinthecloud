'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseFieldView = require('core/component/form/field/view'),
      Template = require('text!./numberfield.html'),
      Utils = require('core/util/utils');

  return function (_BaseFieldView) {
    _inherits(NumberFieldView, _BaseFieldView);

    function NumberFieldView(model, tmpl) {
      _classCallCheck(this, NumberFieldView);

      var _this = _possibleConstructorReturn(this, (NumberFieldView.__proto__ || Object.getPrototypeOf(NumberFieldView)).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onFieldChange', '_onModelChange']);

      _this.renderModel(model);
      _this.$el.find('.numberfield__field').on(model.get('changeEvents'), _this._onFieldChange);
      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(NumberFieldView, [{
      key: 'renderModel',
      value: function renderModel(model) {
        this.$el.find('.numberfield__field').attr('id', model.get('id'));
        this.$el.find('.numberfield__field').attr('value', model.value());

        if (model.get('placeholder')) {
          this.$el.find('.numberfield__field').attr('placeholder', model.get('placeholder'));
        }
        this.$el.find('.numberfield__field').prop('disabled', model.get('disabled'));
        if (model.get('min')) {
          this.$el.find('.numberfield__field').prop('min', model.get('min'));
        }
        if (model.get('max')) {
          this.$el.find('.numberfield__field').prop('max', model.get('max'));
        }
        if (model.get('label')) {
          this.$el.find('.numberfield__label').html(model.get('label'));
        }
        if (model.get('help')) {
          this.$el.find('.numberfield__help').html(model.get('help'));
        }
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        this.renderModel(evt.currentTarget);
      }
    }, {
      key: '_onFieldChange',
      value: function _onFieldChange(jqevt) {
        this.dispatchEvent('Field.ValueChange', {
          value: parseFloat(this.$el.find(".numberfield__field").val())
        });
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.$el.find(".numberfield__field").focus();
      }
    }]);

    return NumberFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiVGVtcGxhdGUiLCJVdGlscyIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwicmVuZGVyTW9kZWwiLCIkZWwiLCJmaW5kIiwib24iLCJnZXQiLCJfb25GaWVsZENoYW5nZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsImF0dHIiLCJ2YWx1ZSIsInByb3AiLCJodG1sIiwiZXZ0IiwiY3VycmVudFRhcmdldCIsImpxZXZ0IiwiZGlzcGF0Y2hFdmVudCIsInBhcnNlRmxvYXQiLCJ2YWwiLCJmb2N1cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxnQkFBZ0JELFFBQVEsZ0NBQVIsQ0FBdEI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLHlCQUFSLENBRGI7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7O0FBSUE7QUFBQTs7QUFDRSw2QkFBWUksS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxvSUFDakJELEtBRGlCLEVBQ1ZDLE9BQU9BLElBQVAsR0FBY0gsUUFESjs7QUFFdkJDLFlBQU1HLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQixnQkFBbkIsQ0FBeEI7O0FBRUEsWUFBS0MsV0FBTCxDQUFpQkgsS0FBakI7QUFDQSxZQUFLSSxHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQ0MsRUFBckMsQ0FBd0NOLE1BQU1PLEdBQU4sQ0FBVSxjQUFWLENBQXhDLEVBQW1FLE1BQUtDLGNBQXhFO0FBQ0FSLFlBQU1TLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLGNBQTVDO0FBTnVCO0FBT3hCOztBQVJIO0FBQUE7QUFBQSxrQ0FVY1YsS0FWZCxFQVVxQjtBQUNqQixhQUFLSSxHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQ00sSUFBckMsQ0FBMEMsSUFBMUMsRUFBZ0RYLE1BQU1PLEdBQU4sQ0FBVSxJQUFWLENBQWhEO0FBQ0EsYUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQWQsRUFBcUNNLElBQXJDLENBQTBDLE9BQTFDLEVBQW1EWCxNQUFNWSxLQUFOLEVBQW5EOztBQUVBLFlBQUlaLE1BQU1PLEdBQU4sQ0FBVSxhQUFWLENBQUosRUFBOEI7QUFDNUIsZUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQWQsRUFBcUNNLElBQXJDLENBQTBDLGFBQTFDLEVBQXlEWCxNQUFNTyxHQUFOLENBQVUsYUFBVixDQUF6RDtBQUNEO0FBQ0QsYUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQWQsRUFBcUNRLElBQXJDLENBQTBDLFVBQTFDLEVBQXNEYixNQUFNTyxHQUFOLENBQVUsVUFBVixDQUF0RDtBQUNBLFlBQUlQLE1BQU1PLEdBQU4sQ0FBVSxLQUFWLENBQUosRUFBc0I7QUFDcEIsZUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQWQsRUFBcUNRLElBQXJDLENBQTBDLEtBQTFDLEVBQWlEYixNQUFNTyxHQUFOLENBQVUsS0FBVixDQUFqRDtBQUNEO0FBQ0QsWUFBSVAsTUFBTU8sR0FBTixDQUFVLEtBQVYsQ0FBSixFQUFzQjtBQUNwQixlQUFLSCxHQUFMLENBQVNDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQ1EsSUFBckMsQ0FBMEMsS0FBMUMsRUFBaURiLE1BQU1PLEdBQU4sQ0FBVSxLQUFWLENBQWpEO0FBQ0Q7QUFDRCxZQUFJUCxNQUFNTyxHQUFOLENBQVUsT0FBVixDQUFKLEVBQXdCO0FBQ3RCLGVBQUtILEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDUyxJQUFyQyxDQUEwQ2QsTUFBTU8sR0FBTixDQUFVLE9BQVYsQ0FBMUM7QUFDRDtBQUNELFlBQUlQLE1BQU1PLEdBQU4sQ0FBVSxNQUFWLENBQUosRUFBdUI7QUFDckIsZUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMsb0JBQWQsRUFBb0NTLElBQXBDLENBQXlDZCxNQUFNTyxHQUFOLENBQVUsTUFBVixDQUF6QztBQUNEO0FBQ0Y7QUE5Qkg7QUFBQTtBQUFBLHFDQStCaUJRLEdBL0JqQixFQStCc0I7QUFDbEIsYUFBS1osV0FBTCxDQUFpQlksSUFBSUMsYUFBckI7QUFDRDtBQWpDSDtBQUFBO0FBQUEscUNBbUNpQkMsS0FuQ2pCLEVBbUN3QjtBQUNwQixhQUFLQyxhQUFMLENBQW1CLG1CQUFuQixFQUF3QztBQUN0Q04saUJBQU9PLFdBQVcsS0FBS2YsR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQWQsRUFBcUNlLEdBQXJDLEVBQVg7QUFEK0IsU0FBeEM7QUFHRDtBQXZDSDtBQUFBO0FBQUEsOEJBd0NVO0FBQ04sYUFBS2hCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDZ0IsS0FBckM7QUFDRDtBQTFDSDs7QUFBQTtBQUFBLElBQXFDeEIsYUFBckM7QUE0Q0QsQ0FqREQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L251bWJlcmZpZWxkL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQmFzZUZpZWxkVmlldyA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL251bWJlcmZpZWxkLmh0bWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpO1xuXG4gIHJldHVybiBjbGFzcyBOdW1iZXJGaWVsZFZpZXcgZXh0ZW5kcyBCYXNlRmllbGRWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIobW9kZWwsIHRtcGwgPyB0bXBsIDogVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25GaWVsZENoYW5nZScsICdfb25Nb2RlbENoYW5nZSddKTtcblxuICAgICAgdGhpcy5yZW5kZXJNb2RlbChtb2RlbCk7XG4gICAgICB0aGlzLiRlbC5maW5kKCcubnVtYmVyZmllbGRfX2ZpZWxkJykub24obW9kZWwuZ2V0KCdjaGFuZ2VFdmVudHMnKSwgdGhpcy5fb25GaWVsZENoYW5nZSlcbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpO1xuICAgIH1cblxuICAgIHJlbmRlck1vZGVsKG1vZGVsKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcubnVtYmVyZmllbGRfX2ZpZWxkJykuYXR0cignaWQnLCBtb2RlbC5nZXQoJ2lkJykpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLm51bWJlcmZpZWxkX19maWVsZCcpLmF0dHIoJ3ZhbHVlJywgbW9kZWwudmFsdWUoKSk7XG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ3BsYWNlaG9sZGVyJykpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLm51bWJlcmZpZWxkX19maWVsZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgbW9kZWwuZ2V0KCdwbGFjZWhvbGRlcicpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5udW1iZXJmaWVsZF9fZmllbGQnKS5wcm9wKCdkaXNhYmxlZCcsIG1vZGVsLmdldCgnZGlzYWJsZWQnKSk7XG4gICAgICBpZiAobW9kZWwuZ2V0KCdtaW4nKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcubnVtYmVyZmllbGRfX2ZpZWxkJykucHJvcCgnbWluJywgbW9kZWwuZ2V0KCdtaW4nKSk7XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdtYXgnKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcubnVtYmVyZmllbGRfX2ZpZWxkJykucHJvcCgnbWF4JywgbW9kZWwuZ2V0KCdtYXgnKSk7XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdsYWJlbCcpKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5udW1iZXJmaWVsZF9fbGFiZWwnKS5odG1sKG1vZGVsLmdldCgnbGFiZWwnKSk7XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdoZWxwJykpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLm51bWJlcmZpZWxkX19oZWxwJykuaHRtbChtb2RlbC5nZXQoJ2hlbHAnKSk7XG4gICAgICB9XG4gICAgfVxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5yZW5kZXJNb2RlbChldnQuY3VycmVudFRhcmdldCk7XG4gICAgfVxuXG4gICAgX29uRmllbGRDaGFuZ2UoanFldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRmllbGQuVmFsdWVDaGFuZ2UnLCB7XG4gICAgICAgIHZhbHVlOiBwYXJzZUZsb2F0KHRoaXMuJGVsLmZpbmQoXCIubnVtYmVyZmllbGRfX2ZpZWxkXCIpLnZhbCgpKVxuICAgICAgfSk7XG4gICAgfVxuICAgIGZvY3VzKCkge1xuICAgICAgdGhpcy4kZWwuZmluZChcIi5udW1iZXJmaWVsZF9fZmllbGRcIikuZm9jdXMoKTtcbiAgICB9XG4gIH07XG59KSJdfQ==
