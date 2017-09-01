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

      var _this = _possibleConstructorReturn(this, (TextFieldView.__proto__ || Object.getPrototypeOf(TextFieldView)).call(this, model, tmpl ? tmpl : Template));

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
        _get(TextFieldView.prototype.__proto__ || Object.getPrototypeOf(TextFieldView.prototype), '_onModelChange', this).call(this, evt);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90ZXh0ZmllbGQvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZUZpZWxkVmlldyIsIlRlbXBsYXRlIiwibW9kZWwiLCJ0bXBsIiwiX29uTW9kZWxDaGFuZ2UiLCJiaW5kIiwiX29uRmllbGRDaGFuZ2UiLCJfb25LZXl1cCIsInJlbmRlciIsIiRlbCIsImZpbmQiLCJvbiIsImdldCIsImV2dCIsImN1cnJlbnRUYXJnZXQiLCJqcWV2dCIsImRpc3BhdGNoRXZlbnQiLCJ2YWx1ZSIsInZhbCIsImtleUNvZGUiLCJwcm9wIiwiZm9jdXMiLCJhdHRyIiwiaHRtbCIsImVycm9ycyIsImxlbmd0aCIsImVyclN0ciIsIm1hcCIsImVyciIsImpvaW4iLCJzaG93IiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImhpZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxnQkFBZ0JELFFBQVEsZ0NBQVIsQ0FBdEI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLHVCQUFSLENBRGI7O0FBR0FBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSwyQkFBWUcsS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxnSUFDakJELEtBRGlCLEVBQ1ZDLE9BQU9BLElBQVAsR0FBY0YsUUFESjs7QUFHdkIsWUFBS0csY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CQyxJQUFwQixPQUF0QjtBQUNBLFlBQUtDLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkQsSUFBcEIsT0FBdEI7QUFDQSxZQUFLRSxRQUFMLEdBQWdCLE1BQUtBLFFBQUwsQ0FBY0YsSUFBZCxPQUFoQjs7QUFFQSxZQUFLRyxNQUFMLENBQVlOLEtBQVo7QUFDQSxZQUFLTyxHQUFMLENBQVNDLElBQVQsQ0FBYyxtQkFBZCxFQUFtQ0MsRUFBbkMsQ0FBc0NULE1BQU1VLEdBQU4s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QVgsRUFBMERDLElBQTFELENBQStELEVBQS9ELENBQWI7QUFDQSxlQUFLcEIsR0FBTCxDQUFTQyxJQUFULENBQWMsZ0JBQWQsRUFBZ0NhLElBQWhDLENBQXFDRyxNQUFyQyxFQUE2Q0ksSUFBN0M7QUFDQSxlQUFLckIsR0FBTCxDQUFTc0IsUUFBVCxDQUFrQix5QkFBbEI7QUFDRCxTQUpELE1BSU87QUFDTCxlQUFLdEIsR0FBTCxDQUFTdUIsV0FBVCxDQUFxQix5QkFBckI7QUFDQSxlQUFLdkIsR0FBTCxDQUFTQyxJQUFULENBQWMsZ0JBQWQsRUFBZ0NhLElBQWhDLENBQXFDLEVBQXJDLEVBQXlDVSxJQUF6QztBQUNEO0FBQ0Y7QUEzREg7O0FBQUE7QUFBQSxJQUFtQ2pDLGFBQW5DO0FBNkRELENBbkVEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC90ZXh0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vdGV4dGZpZWxkLmh0bWwnKTtcblxuICByZXF1aXJlKFwibGluayEuL3N0eWxlLmNzc1wiKTtcblxuICByZXR1cm4gY2xhc3MgVGV4dEZpZWxkVmlldyBleHRlbmRzIEJhc2VGaWVsZFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCA/IHRtcGwgOiBUZW1wbGF0ZSk7XG5cbiAgICAgIHRoaXMuX29uTW9kZWxDaGFuZ2UgPSB0aGlzLl9vbk1vZGVsQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkZpZWxkQ2hhbmdlID0gdGhpcy5fb25GaWVsZENoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25LZXl1cCA9IHRoaXMuX29uS2V5dXAuYmluZCh0aGlzKTtcblxuICAgICAgdGhpcy5yZW5kZXIobW9kZWwpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnRleHRmaWVsZF9fZmllbGQnKS5vbihtb2RlbC5nZXQoJ2NoYW5nZUV2ZW50cycpLCB0aGlzLl9vbkZpZWxkQ2hhbmdlKTtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy50ZXh0ZmllbGRfX2ZpZWxkJykub24oJ2tleXVwJywgdGhpcy5fb25LZXl1cCk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgICAgdGhpcy5yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgIH1cbiAgICBfb25GaWVsZENoYW5nZShqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5WYWx1ZUNoYW5nZScsIHtcbiAgICAgICAgdmFsdWU6IHRoaXMuJGVsLmZpbmQoJy50ZXh0ZmllbGRfX2ZpZWxkJykudmFsKClcbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25LZXl1cChqcWV2dCkge1xuICAgICAgaWYgKGpxZXZ0LmtleUNvZGUgPT0gMTMpIHsgLy9yZXR1cm5cbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGb3JtLlN1Ym1pdFJlcXVlc3QnLCB7fSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy50ZXh0ZmllbGRfX2ZpZWxkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy50ZXh0ZmllbGRfX2ZpZWxkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy50ZXh0ZmllbGRfX2ZpZWxkJykuZm9jdXMoKTtcbiAgICB9XG5cbiAgICByZW5kZXIobW9kZWwpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy50ZXh0ZmllbGRfX2ZpZWxkJykuYXR0cignaWQnLCBtb2RlbC5nZXQoJ2lkJykpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnRleHRmaWVsZF9fZmllbGQnKS52YWwobW9kZWwudmFsdWUoKSk7XG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ3Bhc3N3b3JkJykpICAgIHRoaXMuJGVsLmZpbmQoJy50ZXh0ZmllbGRfX2ZpZWxkJykuYXR0cigndHlwZScsICdwYXNzd29yZCcpO1xuICAgICAgaWYgKG1vZGVsLmdldCgncGxhY2Vob2xkZXInKSkgdGhpcy4kZWwuZmluZCgnLnRleHRmaWVsZF9fZmllbGQnKS5hdHRyKCdwbGFjZWhvbGRlcicsIG1vZGVsLmdldCgncGxhY2Vob2xkZXInKSk7XG4gICAgICBpZiAobW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSAgICB0aGlzLiRlbC5maW5kKCcudGV4dGZpZWxkX19maWVsZCcpLnByb3AoJ2Rpc2FibGVkJywgbW9kZWwuZ2V0KCdkaXNhYmxlZCcpKTtcbiAgICAgIGlmIChtb2RlbC5nZXQoJ2xhYmVsJykpICAgICAgIHRoaXMuJGVsLmZpbmQoJy50ZXh0ZmllbGRfX2xhYmVsJykuaHRtbChtb2RlbC5nZXQoJ2xhYmVsJykpO1xuICAgICAgaWYgKG1vZGVsLmdldCgnaGVscCcpKSAgICAgICAgdGhpcy4kZWwuZmluZCgnLnRleHRmaWVsZF9faGVscCcpLmh0bWwobW9kZWwuZ2V0KCdoZWxwJykpO1xuXG4gICAgICBsZXQgZXJyb3JzID0gbW9kZWwuZ2V0KCdlcnJvcnMnKTtcbiAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGxldCBlcnJTdHIgPSBlcnJvcnMubWFwKChlcnIpID0+IGA8cCBjbGFzcz1cImZpZWxkX19lcnJvclwiPiR7ZXJyfTwvcD5gKS5qb2luKCcnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZChcIi5maWVsZF9fZXJyb3JzXCIpLmh0bWwoZXJyU3RyKS5zaG93KCk7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKFwiY29tcG9uZW50X19maWVsZF9fZXJyb3JcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcyhcImNvbXBvbmVudF9fZmllbGRfX2Vycm9yXCIpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKFwiLmZpZWxkX19lcnJvcnNcIikuaHRtbChcIlwiKS5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
