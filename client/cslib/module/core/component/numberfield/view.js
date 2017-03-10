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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NumberFieldView).call(this, model, tmpl ? tmpl : Template));

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
        if (model.get('disabled')) {
          this.$el.find('.numberfield__field').prop('disabled', model.get('disabled'));
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sZ0JBQWdCLFFBQVEsZ0NBQVIsQ0FBdEI7QUFBQSxNQUNFLFdBQVcsUUFBUSx5QkFBUixDQURiO0FBQUEsTUFFRSxRQUFRLFFBQVEsaUJBQVIsQ0FGVjs7QUFJQTtBQUFBOztBQUNFLDZCQUFZLEtBQVosRUFBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxxR0FDakIsS0FEaUIsRUFDVixPQUFPLElBQVAsR0FBYyxRQURKOztBQUV2QixZQUFNLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQixnQkFBbkIsQ0FBeEI7O0FBRUEsWUFBSyxXQUFMLENBQWlCLEtBQWpCO0FBQ0EsWUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLHFCQUFkLEVBQXFDLEVBQXJDLENBQXdDLE1BQU0sR0FBTixDQUFVLGNBQVYsQ0FBeEMsRUFBbUUsTUFBSyxjQUF4RTtBQUNBLFlBQU0sZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBSyxjQUE1QztBQU51QjtBQU94Qjs7QUFSSDtBQUFBO0FBQUEsa0NBVWMsS0FWZCxFQVVxQjtBQUNqQixhQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMscUJBQWQsRUFBcUMsSUFBckMsQ0FBMEMsSUFBMUMsRUFBZ0QsTUFBTSxHQUFOLENBQVUsSUFBVixDQUFoRDtBQUNBLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxxQkFBZCxFQUFxQyxJQUFyQyxDQUEwQyxPQUExQyxFQUFtRCxNQUFNLEtBQU4sRUFBbkQ7O0FBRUEsWUFBSSxNQUFNLEdBQU4sQ0FBVSxhQUFWLENBQUosRUFBOEI7QUFDNUIsZUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLHFCQUFkLEVBQXFDLElBQXJDLENBQTBDLGFBQTFDLEVBQXlELE1BQU0sR0FBTixDQUFVLGFBQVYsQ0FBekQ7QUFDRDtBQUNELFlBQUksTUFBTSxHQUFOLENBQVUsVUFBVixDQUFKLEVBQTJCO0FBQ3pCLGVBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxxQkFBZCxFQUFxQyxJQUFyQyxDQUEwQyxVQUExQyxFQUFzRCxNQUFNLEdBQU4sQ0FBVSxVQUFWLENBQXREO0FBQ0Q7QUFDRCxZQUFJLE1BQU0sR0FBTixDQUFVLEtBQVYsQ0FBSixFQUFzQjtBQUNwQixlQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMscUJBQWQsRUFBcUMsSUFBckMsQ0FBMEMsS0FBMUMsRUFBaUQsTUFBTSxHQUFOLENBQVUsS0FBVixDQUFqRDtBQUNEO0FBQ0QsWUFBSSxNQUFNLEdBQU4sQ0FBVSxLQUFWLENBQUosRUFBc0I7QUFDcEIsZUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLHFCQUFkLEVBQXFDLElBQXJDLENBQTBDLEtBQTFDLEVBQWlELE1BQU0sR0FBTixDQUFVLEtBQVYsQ0FBakQ7QUFDRDtBQUNELFlBQUksTUFBTSxHQUFOLENBQVUsT0FBVixDQUFKLEVBQXdCO0FBQ3RCLGVBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxxQkFBZCxFQUFxQyxJQUFyQyxDQUEwQyxNQUFNLEdBQU4sQ0FBVSxPQUFWLENBQTFDO0FBQ0Q7QUFDRCxZQUFJLE1BQU0sR0FBTixDQUFVLE1BQVYsQ0FBSixFQUF1QjtBQUNyQixlQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsb0JBQWQsRUFBb0MsSUFBcEMsQ0FBeUMsTUFBTSxHQUFOLENBQVUsTUFBVixDQUF6QztBQUNEO0FBQ0Y7QUFoQ0g7QUFBQTtBQUFBLHFDQWlDaUIsR0FqQ2pCLEVBaUNzQjtBQUNsQixhQUFLLFdBQUwsQ0FBaUIsSUFBSSxhQUFyQjtBQUNEO0FBbkNIO0FBQUE7QUFBQSxxQ0FxQ2lCLEtBckNqQixFQXFDd0I7QUFDcEIsYUFBSyxhQUFMLENBQW1CLG1CQUFuQixFQUF3QztBQUN0QyxpQkFBTyxXQUFXLEtBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxxQkFBZCxFQUFxQyxHQUFyQyxFQUFYO0FBRCtCLFNBQXhDO0FBR0Q7QUF6Q0g7QUFBQTtBQUFBLDhCQTBDVTtBQUNOLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxxQkFBZCxFQUFxQyxLQUFyQztBQUNEO0FBNUNIOztBQUFBO0FBQUEsSUFBcUMsYUFBckM7QUE4Q0QsQ0FuREQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L251bWJlcmZpZWxkL3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
