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

      _this._render(model);

      _this.$el.find(".selectfield__select").on('change', _this._onFieldChange);
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
            } else {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiZ2V0IiwiJGVsIiwiZmluZCIsImNzcyIsIl9yZW5kZXIiLCJvbiIsIl9vbkZpZWxkQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmb3JFYWNoIiwib3B0IiwidmFsdWUiLCJpbmNsdWRlcyIsImlkIiwiZGlzYWJsZSIsImVuYWJsZSIsImN1cnJlbnRUYXJnZXQiLCJqcWV2dCIsImRpc3BhdGNoRXZlbnQiLCJ2YWwiLCJwcm9wIiwiZm9jdXMiLCJodG1sIiwib3B0SWQiLCJrZXlzIiwicmVtb3ZlQ2hpbGQiLCJsYWJlbCIsInNlbGVjdGVkIiwiYWRkQ2hpbGQiLCJzZWxlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxnQkFBZ0JELFFBQVEsZ0NBQVIsQ0FBdEI7QUFBQSxNQUNFRSxhQUFhRixRQUFRLGNBQVIsQ0FEZjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjtBQUFBLE1BR0VJLFdBQVdKLFFBQVEseUJBQVIsQ0FIYjs7QUFNQTtBQUFBOztBQUNFLDZCQUFZSyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkQsS0FEaUIsRUFDVkMsT0FBT0EsSUFBUCxHQUFjRixRQURKOztBQUV2QkQsWUFBTUksV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLGdCQUFuQixDQUF4Qjs7QUFFQSxZQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsVUFBSUgsTUFBTUksR0FBTixDQUFVLE9BQVYsQ0FBSixFQUF3QixNQUFLQyxHQUFM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T087QUFDTCxpQkFBS2pCLFFBQUwsQ0FBY2lCLEVBQWQsRUFBa0JnQixNQUFsQixDQUF5QnBDLE1BQU1rQixLQUFOLE1BQWlCRSxFQUExQztBQUNEO0FBQ0Y7QUFDRCxZQUFJcEIsTUFBTUksR0FBTixDQUFVLFVBQVYsQ0FBSixFQUEyQjtBQUN6QixlQUFLaUIsT0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtDLE1BQUw7QUFDRDtBQUNGO0FBeEVIOztBQUFBO0FBQUEsSUFBcUMxQixhQUFyQztBQTBFRCxDQWpGRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgT3B0aW9uVmlldyA9IHJlcXVpcmUoJy4vb3B0aW9udmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc2VsZWN0ZmllbGQuaHRtbCcpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgU2VsZWN0RmllbGRWaWV3IGV4dGVuZHMgQmFzZUZpZWxkVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKG1vZGVsLCB0bXBsID8gdG1wbCA6IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRmllbGRDaGFuZ2UnLCAnX29uTW9kZWxDaGFuZ2UnXSk7XG5cbiAgICAgIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgICAgaWYgKG1vZGVsLmdldCgnY29sb3InKSkgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19sYWJlbCcpLmNzcygnY29sb3InLCBtb2RlbC5nZXQoJ2NvbG9yJykpO1xuXG4gICAgICB0aGlzLl9yZW5kZXIobW9kZWwpO1xuXG4gICAgICB0aGlzLiRlbC5maW5kKFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIikub24oJ2NoYW5nZScsIHRoaXMuX29uRmllbGRDaGFuZ2UpXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gJ2Rpc2FibGVkT3B0aW9ucycpIHtcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9vcHRpb25zKS5mb3JFYWNoKChvcHQpID0+IHtcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUuaW5jbHVkZXMob3B0LmlkKCkpKSB7XG4gICAgICAgICAgICBvcHQuZGlzYWJsZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHQuZW5hYmxlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25GaWVsZENoYW5nZShqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5WYWx1ZUNoYW5nZScsIHtcbiAgICAgICAgdmFsdWU6IHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS52YWwoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fc2VsZWN0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fc2VsZWN0JykuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKG1vZGVsKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuc2VsZWN0ZmllbGRfX2xhYmVsJykuaHRtbChtb2RlbC5nZXQoJ2xhYmVsJykpO1xuICAgICAgZm9yIChsZXQgb3B0SWQgaW4gdGhpcy5fb3B0aW9ucykge1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKG1vZGVsLmdldCgnb3B0aW9ucycpKS5pbmNsdWRlcyhvcHRJZCkpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX29wdGlvbnNbb3B0SWRdKTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fb3B0aW9uc1tvcHRJZF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGlkIGluIG1vZGVsLmdldCgnb3B0aW9ucycpKSB7XG4gICAgICAgIGxldCBsYWJlbCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zW2lkXSkge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdID0gbmV3IE9wdGlvblZpZXcoe1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IG1vZGVsLnZhbHVlKCkgPT0gaWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX29wdGlvbnNbaWRdLCBcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnNbaWRdLnNlbGVjdChtb2RlbC52YWx1ZSgpID09IGlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1vZGVsLmdldCgnZGlzYWJsZWQnKSkge1xuICAgICAgICB0aGlzLmRpc2FibGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
