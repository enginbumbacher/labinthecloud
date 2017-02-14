'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FieldView = require('core/component/form/field/view'),
      Template = require('text!./button.html'),
      Utils = require('core/util/utils');

  require('link!./style.css');

  return function (_FieldView) {
    _inherits(ButtonFieldView, _FieldView);

    function ButtonFieldView(model, tmpl) {
      _classCallCheck(this, ButtonFieldView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ButtonFieldView).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onModelChange', '_onClick', 'focus']);

      _this.$el.find('.button').html(model.get('label'));
      _this._eventName = model.get('eventName');
      _this._eventData = model.get('eventData');
      _this.$el.find('.button').on('click', _this._onClick);
      _this._killNative = model.get("killNativeEvent");

      if (model.get('style') != "button") {
        _this.$el.addClass(model.get('style'));
      }
      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(ButtonFieldView, [{
      key: 'focus',
      value: function focus() {
        this.$el.find('.button').focus();
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.button').prop('disabled', false);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.button').prop('disabled', true);
      }
    }, {
      key: '_onClick',
      value: function _onClick(jqevt) {
        this.dispatchEvent(this._eventName, this._eventData, true);
        if (this._killNative) return false;
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          case "label":
            this.$el.find('.button').html(evt.data.value);
            break;
        }
      }
    }]);

    return ButtonFieldView;
  }(FieldView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFlBQVksUUFBUSxnQ0FBUixDQUFsQjtBQUFBLE1BQ0UsV0FBVyxRQUFRLG9CQUFSLENBRGI7QUFBQSxNQUVFLFFBQVEsUUFBUSxpQkFBUixDQUZWOztBQUlBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSw2QkFBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEscUdBQ2pCLEtBRGlCLEVBQ1YsT0FBTyxJQUFQLEdBQWMsUUFESjs7QUFFdkIsWUFBTSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsVUFBbkIsRUFBK0IsT0FBL0IsQ0FBeEI7O0FBRUEsWUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLFNBQWQsRUFBeUIsSUFBekIsQ0FBOEIsTUFBTSxHQUFOLENBQVUsT0FBVixDQUE5QjtBQUNBLFlBQUssVUFBTCxHQUFrQixNQUFNLEdBQU4sQ0FBVSxXQUFWLENBQWxCO0FBQ0EsWUFBSyxVQUFMLEdBQWtCLE1BQU0sR0FBTixDQUFVLFdBQVYsQ0FBbEI7QUFDQSxZQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsU0FBZCxFQUF5QixFQUF6QixDQUE0QixPQUE1QixFQUFxQyxNQUFLLFFBQTFDO0FBQ0EsWUFBSyxXQUFMLEdBQW1CLE1BQU0sR0FBTixDQUFVLGlCQUFWLENBQW5COztBQUVBLFVBQUksTUFBTSxHQUFOLENBQVUsT0FBVixLQUFzQixRQUExQixFQUFvQztBQUNsQyxjQUFLLEdBQUwsQ0FBUyxRQUFULENBQWtCLE1BQU0sR0FBTixDQUFVLE9BQVYsQ0FBbEI7QUFDRDtBQUNELFlBQU0sZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBSyxjQUE1QztBQWJ1QjtBQWN4Qjs7QUFmSDtBQUFBO0FBQUEsOEJBaUJVO0FBQ04sYUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLFNBQWQsRUFBeUIsS0FBekI7QUFDRDtBQW5CSDtBQUFBO0FBQUEsK0JBcUJXO0FBQ1AsYUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLFNBQWQsRUFBeUIsSUFBekIsQ0FBOEIsVUFBOUIsRUFBMEMsS0FBMUM7QUFDRDtBQXZCSDtBQUFBO0FBQUEsZ0NBeUJZO0FBQ1IsYUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLFNBQWQsRUFBeUIsSUFBekIsQ0FBOEIsVUFBOUIsRUFBMEMsSUFBMUM7QUFDRDtBQTNCSDtBQUFBO0FBQUEsK0JBNkJXLEtBN0JYLEVBNkJrQjtBQUNkLGFBQUssYUFBTCxDQUFtQixLQUFLLFVBQXhCLEVBQW9DLEtBQUssVUFBekMsRUFBcUQsSUFBckQ7QUFDQSxZQUFJLEtBQUssV0FBVCxFQUFzQixPQUFPLEtBQVA7QUFDdkI7QUFoQ0g7QUFBQTtBQUFBLHFDQWtDaUIsR0FsQ2pCLEVBa0NzQjtBQUNsQixnQkFBUSxJQUFJLElBQUosQ0FBUyxJQUFqQjtBQUNFLGVBQUssT0FBTDtBQUNFLGlCQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsU0FBZCxFQUF5QixJQUF6QixDQUE4QixJQUFJLElBQUosQ0FBUyxLQUF2QztBQUNGO0FBSEY7QUFLRDtBQXhDSDs7QUFBQTtBQUFBLElBQXFDLFNBQXJDO0FBMENELENBakREIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
