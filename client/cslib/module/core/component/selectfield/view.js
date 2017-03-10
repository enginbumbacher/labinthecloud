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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SelectFieldView).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onFieldChange', '_onModelChange']);

      _this._options = {};
      _this._render(model);

      _this.$el.find(".selectfield__select").on('change', _this._onFieldChange);
      return _this;
    }

    _createClass(SelectFieldView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(Object.getPrototypeOf(SelectFieldView.prototype), '_onModelChange', this).call(this, evt);
        this._render(evt.currentTarget);
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
      }
    }]);

    return SelectFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxnQkFBZ0IsUUFBUSxnQ0FBUixDQUF0QjtBQUFBLE1BQ0UsYUFBYSxRQUFRLGNBQVIsQ0FEZjtBQUFBLE1BRUUsUUFBUSxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFLFdBQVcsUUFBUSx5QkFBUixDQUhiOztBQU1BO0FBQUE7O0FBQ0UsNkJBQVksS0FBWixFQUFtQixJQUFuQixFQUF5QjtBQUFBOztBQUFBLHFHQUNqQixLQURpQixFQUNWLE9BQU8sSUFBUCxHQUFjLFFBREo7O0FBRXZCLFlBQU0sV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLGdCQUFuQixDQUF4Qjs7QUFFQSxZQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxZQUFLLE9BQUwsQ0FBYSxLQUFiOztBQUVBLFlBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxzQkFBZCxFQUFzQyxFQUF0QyxDQUF5QyxRQUF6QyxFQUFtRCxNQUFLLGNBQXhEO0FBUHVCO0FBUXhCOztBQVRIO0FBQUE7QUFBQSxxQ0FXaUIsR0FYakIsRUFXc0I7QUFDbEIsa0dBQXFCLEdBQXJCO0FBQ0EsYUFBSyxPQUFMLENBQWEsSUFBSSxhQUFqQjtBQUNEO0FBZEg7QUFBQTtBQUFBLHFDQWdCaUIsS0FoQmpCLEVBZ0J3QjtBQUNwQixhQUFLLGFBQUwsQ0FBbUIsbUJBQW5CLEVBQXdDO0FBQ3RDLGlCQUFPLEtBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxzQkFBZCxFQUFzQyxHQUF0QztBQUQrQixTQUF4QztBQUdEO0FBcEJIO0FBQUE7QUFBQSxnQ0FzQlk7QUFDUixhQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsc0JBQWQsRUFBc0MsSUFBdEMsQ0FBMkMsVUFBM0MsRUFBdUQsSUFBdkQ7QUFDRDtBQXhCSDtBQUFBO0FBQUEsK0JBMEJXO0FBQ1AsYUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLHNCQUFkLEVBQXNDLElBQXRDLENBQTJDLFVBQTNDLEVBQXVELEtBQXZEO0FBQ0Q7QUE1Qkg7QUFBQTtBQUFBLDhCQThCVTtBQUNOLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxzQkFBZCxFQUFzQyxLQUF0QztBQUNEO0FBaENIO0FBQUE7QUFBQSw4QkFrQ1UsS0FsQ1YsRUFrQ2lCO0FBQ2IsYUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLHFCQUFkLEVBQXFDLElBQXJDLENBQTBDLE1BQU0sR0FBTixDQUFVLE9BQVYsQ0FBMUM7QUFDQSxhQUFLLElBQUksRUFBVCxJQUFlLE1BQU0sR0FBTixDQUFVLFNBQVYsQ0FBZixFQUFxQztBQUNuQyxjQUFJLFFBQVEsTUFBTSxHQUFOLENBQVUsU0FBVixFQUFxQixFQUFyQixDQUFaO0FBQ0EsY0FBSSxDQUFDLEtBQUssUUFBTCxDQUFjLEVBQWQsQ0FBTCxFQUF3QjtBQUN0QixpQkFBSyxRQUFMLENBQWMsRUFBZCxJQUFvQixJQUFJLFVBQUosQ0FBZTtBQUNqQyxrQkFBSSxFQUQ2QjtBQUVqQyxxQkFBTyxLQUYwQjtBQUdqQyx3QkFBVSxNQUFNLEtBQU4sTUFBaUI7QUFITSxhQUFmLENBQXBCO0FBS0EsaUJBQUssUUFBTCxDQUFjLEtBQUssUUFBTCxDQUFjLEVBQWQsQ0FBZCxFQUFpQyxzQkFBakM7QUFDRCxXQVBELE1BT087QUFDTCxpQkFBSyxRQUFMLENBQWMsRUFBZCxFQUFrQixNQUFsQixDQUF5QixNQUFNLEtBQU4sTUFBaUIsRUFBMUM7QUFDRDtBQUNGO0FBQ0Y7QUFqREg7O0FBQUE7QUFBQSxJQUFxQyxhQUFyQztBQW1ERCxDQTFERCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
