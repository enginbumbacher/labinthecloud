'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseFieldView = require('core/component/form/field/view'),
      Template = require('text!./textfield.html');

  require("link!./style.css");

  return function (_BaseFieldView) {
    _inherits(TextFieldView, _BaseFieldView);

    function TextFieldView(model, tmpl) {
      _classCallCheck(this, TextFieldView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextFieldView).call(this, model, tmpl ? tmpl : Template));

      _this._onModelChange = _this._onModelChange.bind(_this);
      _this._onFieldChange = _this._onFieldChange.bind(_this);
      _this._onKeyup = _this._onKeyup.bind(_this);

      _this.render(model);
      _this.$el.find('.textfield__field').on(model.get('changeEvents'), _this._onFieldChange);
      _this.$el.find('.textfield__field').on('keyup', _this._onKeyup);
      return _this;
    }

    _createClass(TextFieldView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(Object.getPrototypeOf(TextFieldView.prototype), '_onModelChange', this).call(this, evt);
        this.render(evt.currentTarget);
      }
    }, {
      key: '_onFieldChange',
      value: function _onFieldChange(jqevt) {
        this.dispatchEvent('Field.ValueChange', {
          value: this.$el.find('.textfield__field').val()
        });
      }
    }, {
      key: '_onKeyup',
      value: function _onKeyup(jqevt) {
        if (jqevt.keyCode == 13) {
          //return
          this.dispatchEvent('Form.SubmitRequest', {}, true);
        }
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.textfield__field').prop('disabled', true);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.textfield__field').prop('disabled', false);
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.$el.find('.textfield__field').focus();
      }
    }, {
      key: 'render',
      value: function render(model) {
        this.$el.find('.textfield__field').attr('id', model.get('id'));
        this.$el.find('.textfield__field').val(model.value());

        if (model.get('password')) this.$el.find('.textfield__field').attr('type', 'password');
        if (model.get('placeholder')) this.$el.find('.textfield__field').attr('placeholder', model.get('placeholder'));
        if (model.get('disabled')) this.$el.find('.textfield__field').prop('disabled', model.get('disabled'));
        if (model.get('label')) this.$el.find('.textfield__label').html(model.get('label'));
        if (model.get('help')) this.$el.find('.textfield__help').html(model.get('help'));

        var errors = model.get('errors');
        if (errors.length) {
          var errStr = errors.map(function (err) {
            return '<p class="field__error">' + err + '</p>';
          }).join('');
          this.$el.find(".field__errors").html(errStr).show();
          this.$el.addClass("component__field__error");
        } else {
          this.$el.removeClass("component__field__error");
          this.$el.find(".field__errors").html("").hide();
        }
      }
    }]);

    return TextFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90ZXh0ZmllbGQvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sZ0JBQWdCLFFBQVEsZ0NBQVIsQ0FBdEI7QUFBQSxNQUNFLFdBQVcsUUFBUSx1QkFBUixDQURiOztBQUdBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSwyQkFBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsbUdBQ2pCLEtBRGlCLEVBQ1YsT0FBTyxJQUFQLEdBQWMsUUFESjs7QUFHdkIsWUFBSyxjQUFMLEdBQXNCLE1BQUssY0FBTCxDQUFvQixJQUFwQixPQUF0QjtBQUNBLFlBQUssY0FBTCxHQUFzQixNQUFLLGNBQUwsQ0FBb0IsSUFBcEIsT0FBdEI7QUFDQSxZQUFLLFFBQUwsR0FBZ0IsTUFBSyxRQUFMLENBQWMsSUFBZCxPQUFoQjs7QUFFQSxZQUFLLE1BQUwsQ0FBWSxLQUFaO0FBQ0EsWUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLG1CQUFkLEVBQW1DLEVBQW5DLENBQXNDLE1BQU0sR0FBTixDQUFVLGNBQVYsQ0FBdEMsRUFBaUUsTUFBSyxjQUF0RTtBQUNBLFlBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxtQkFBZCxFQUFtQyxFQUFuQyxDQUFzQyxPQUF0QyxFQUErQyxNQUFLLFFBQXBEO0FBVHVCO0FBVXhCOztBQVhIO0FBQUE7QUFBQSxxQ0FhaUIsR0FiakIsRUFhc0I7QUFDbEIsZ0dBQXFCLEdBQXJCO0FBQ0EsYUFBSyxNQUFMLENBQVksSUFBSSxhQUFoQjtBQUNEO0FBaEJIO0FBQUE7QUFBQSxxQ0FpQmlCLEtBakJqQixFQWlCd0I7QUFDcEIsYUFBSyxhQUFMLENBQW1CLG1CQUFuQixFQUF3QztBQUN0QyxpQkFBTyxLQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsbUJBQWQsRUFBbUMsR0FBbkM7QUFEK0IsU0FBeEM7QUFHRDtBQXJCSDtBQUFBO0FBQUEsK0JBc0JXLEtBdEJYLEVBc0JrQjtBQUNkLFlBQUksTUFBTSxPQUFOLElBQWlCLEVBQXJCLEVBQXlCOztBQUN2QixlQUFLLGFBQUwsQ0FBbUIsb0JBQW5CLEVBQXlDLEVBQXpDLEVBQTZDLElBQTdDO0FBQ0Q7QUFDRjtBQTFCSDtBQUFBO0FBQUEsZ0NBNEJZO0FBQ1IsYUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLG1CQUFkLEVBQW1DLElBQW5DLENBQXdDLFVBQXhDLEVBQW9ELElBQXBEO0FBQ0Q7QUE5Qkg7QUFBQTtBQUFBLCtCQWdDVztBQUNQLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxtQkFBZCxFQUFtQyxJQUFuQyxDQUF3QyxVQUF4QyxFQUFvRCxLQUFwRDtBQUNEO0FBbENIO0FBQUE7QUFBQSw4QkFvQ1U7QUFDTixhQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsbUJBQWQsRUFBbUMsS0FBbkM7QUFDRDtBQXRDSDtBQUFBO0FBQUEsNkJBd0NTLEtBeENULEVBd0NnQjtBQUNaLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxtQkFBZCxFQUFtQyxJQUFuQyxDQUF3QyxJQUF4QyxFQUE4QyxNQUFNLEdBQU4sQ0FBVSxJQUFWLENBQTlDO0FBQ0EsYUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLG1CQUFkLEVBQW1DLEdBQW5DLENBQXVDLE1BQU0sS0FBTixFQUF2Qzs7QUFFQSxZQUFJLE1BQU0sR0FBTixDQUFVLFVBQVYsQ0FBSixFQUE4QixLQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsbUJBQWQsRUFBbUMsSUFBbkMsQ0FBd0MsTUFBeEMsRUFBZ0QsVUFBaEQ7QUFDOUIsWUFBSSxNQUFNLEdBQU4sQ0FBVSxhQUFWLENBQUosRUFBOEIsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFjLG1CQUFkLEVBQW1DLElBQW5DLENBQXdDLGFBQXhDLEVBQXVELE1BQU0sR0FBTixDQUFVLGFBQVYsQ0FBdkQ7QUFDOUIsWUFBSSxNQUFNLEdBQU4sQ0FBVSxVQUFWLENBQUosRUFBOEIsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFjLG1CQUFkLEVBQW1DLElBQW5DLENBQXdDLFVBQXhDLEVBQW9ELE1BQU0sR0FBTixDQUFVLFVBQVYsQ0FBcEQ7QUFDOUIsWUFBSSxNQUFNLEdBQU4sQ0FBVSxPQUFWLENBQUosRUFBOEIsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFjLG1CQUFkLEVBQW1DLElBQW5DLENBQXdDLE1BQU0sR0FBTixDQUFVLE9BQVYsQ0FBeEM7QUFDOUIsWUFBSSxNQUFNLEdBQU4sQ0FBVSxNQUFWLENBQUosRUFBOEIsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFjLGtCQUFkLEVBQWtDLElBQWxDLENBQXVDLE1BQU0sR0FBTixDQUFVLE1BQVYsQ0FBdkM7O0FBRTlCLFlBQUksU0FBUyxNQUFNLEdBQU4sQ0FBVSxRQUFWLENBQWI7QUFDQSxZQUFJLE9BQU8sTUFBWCxFQUFtQjtBQUNqQixjQUFJLFNBQVMsT0FBTyxHQUFQLENBQVcsVUFBQyxHQUFEO0FBQUEsZ0RBQW9DLEdBQXBDO0FBQUEsV0FBWCxFQUEwRCxJQUExRCxDQUErRCxFQUEvRCxDQUFiO0FBQ0EsZUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLGdCQUFkLEVBQWdDLElBQWhDLENBQXFDLE1BQXJDLEVBQTZDLElBQTdDO0FBQ0EsZUFBSyxHQUFMLENBQVMsUUFBVCxDQUFrQix5QkFBbEI7QUFDRCxTQUpELE1BSU87QUFDTCxlQUFLLEdBQUwsQ0FBUyxXQUFULENBQXFCLHlCQUFyQjtBQUNBLGVBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxnQkFBZCxFQUFnQyxJQUFoQyxDQUFxQyxFQUFyQyxFQUF5QyxJQUF6QztBQUNEO0FBQ0Y7QUEzREg7O0FBQUE7QUFBQSxJQUFtQyxhQUFuQztBQTZERCxDQW5FRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvdGV4dGZpZWxkL3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
