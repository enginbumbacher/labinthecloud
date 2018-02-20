'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseField = require('core/component/form/field/field'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  var SymSelectField = function (_BaseField) {
    _inherits(SymSelectField, _BaseField);

    function SymSelectField() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, SymSelectField);

      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;

      var _this = _possibleConstructorReturn(this, (SymSelectField.__proto__ || Object.getPrototypeOf(SymSelectField)).call(this, settings));

      Utils.bindMethods(_this, ['_onCheckboxChange']);
      _this.checked = false;

      var proportion = parseFloat(_this._model.get('value').substr(_this._model.get('value').indexOf('_') + 1)) / 100;
      var initialValue = {
        'qualitativeValue': _this._model.get('value'),
        'numericValue': proportion * parseFloat(_this._model.get('maxValue')),
        'variation': _this.checked
      };
      _this._model.set('value', initialValue);

      _this._view.addEventListener('Field.ValueChange', _this._onFieldChange);
      _this._view.addEventListener('SymSelectField.ChangeRequest', _this._onCheckboxChange);

      return _this;
    }

    _createClass(SymSelectField, [{
      key: '_onCheckboxChange',
      value: function _onCheckboxChange(evt) {
        this.checked = evt.data.value;
        var oldVal = this._model.value();
        this._model.updateValue('variation', this.checked);
        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value().qualitativeValue
        });
      }
    }, {
      key: '_onFieldChange',
      value: function _onFieldChange(evt) {
        if (evt.bubbles) evt.stopPropagation();
        var oldVal = this._model.value();

        var proportion = parseFloat(evt.data.value.substr(evt.data.value.indexOf('_') + 1)) / 100;

        this._model.set('value', {
          variation: this.checked,
          qualitativeValue: evt.data.value,
          numericValue: proportion * parseFloat(this._model.get('maxValue'))
        });

        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value().qualitativeValue
        });
      }
    }, {
      key: 'addOption',
      value: function addOption(opt) {
        this._model.addOption(opt);
      }
    }, {
      key: 'removeOption',
      value: function removeOption(id) {
        this._model.removeOption(id);
      }
    }, {
      key: 'clearOptions',
      value: function clearOptions() {
        this._model.clearOptions();
      }
    }, {
      key: 'getOptions',
      value: function getOptions() {
        return this._model.get('options');
      }
    }, {
      key: 'getAbleOptions',
      value: function getAbleOptions() {
        return this._model.listAbleOptions();
      }
    }, {
      key: 'disableOption',
      value: function disableOption(id) {
        this._model.disableOption(id);
      }
    }, {
      key: 'enableOption',
      value: function enableOption(id) {
        this._model.enableOption(id);
      }
    }, {
      key: 'selectFirstAble',
      value: function selectFirstAble() {
        var able = this._model.listAbleOptions();
        if (!able.includes(this.value())) {
          this.setValue(able[0]);
        }
      }
    }, {
      key: 'setValue',
      value: function setValue(val) {
        if (val) {
          var oldVal = this._model.value();
          this._model.updateValue('qualitativeValue', val.qualitativeValue);
          this._model.updateValue('numericValue', val.numericValue);
          this._model.updateValue('variation', val.variation);

          this.view()._render(this._model);

          this.dispatchEvent('Field.Change', {
            oldValue: oldVal,
            value: this._model.value()
          });
        }
      }
    }]);

    return SymSelectField;
  }(BaseField);

  SymSelectField.create = function (data) {
    return new SymSelectField({ modelData: data });
  };

  return SymSelectField;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZUZpZWxkIiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJTeW1TZWxlY3RGaWVsZCIsInNldHRpbmdzIiwidmlld0NsYXNzIiwibW9kZWxDbGFzcyIsImJpbmRNZXRob2RzIiwiY2hlY2tlZCIsInByb3BvcnRpb24iLCJwYXJzZUZsb2F0IiwiX21vZGVsIiwiZ2V0Iiwic3Vic3RyIiwiaW5kZXhPZiIsImluaXRpYWxWYWx1ZSIsInNldCIsIl92aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkZpZWxkQ2hhbmdlIiwiX29uQ2hlY2tib3hDaGFuZ2UiLCJldnQiLCJkYXRhIiwidmFsdWUiLCJvbGRWYWwiLCJ1cGRhdGVWYWx1ZSIsImRpc3BhdGNoRXZlbnQiLCJvbGRWYWx1ZSIsInF1YWxpdGF0aXZlVmFsdWUiLCJidWJibGVzIiwic3RvcFByb3BhZ2F0aW9uIiwidmFyaWF0aW9uIiwibnVtZXJpY1ZhbHVlIiwib3B0IiwiYWRkT3B0aW9uIiwiaWQiLCJyZW1vdmVPcHRpb24iLCJjbGVhck9wdGlvbnMiLCJsaXN0QWJsZU9wdGlvbnMiLCJkaXNhYmxlT3B0aW9uIiwiZW5hYmxlT3B0aW9uIiwiYWJsZSIsImluY2x1ZGVzIiwic2V0VmFsdWUiLCJ2YWwiLCJ2aWV3IiwiX3JlbmRlciIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLGlDQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFNWkssY0FOWTtBQUFBOztBQU9oQiw4QkFBMkI7QUFB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QUtaLE1BQUwsQ0FBWVksS0FBWjtBQUYwQixXQUFuQztBQUlEO0FBQ0Y7QUF6R2U7O0FBQUE7QUFBQSxJQU1XeEIsU0FOWDs7QUE0R2xCSSxpQkFBZTRDLE1BQWYsR0FBd0IsVUFBQ3pCLElBQUQsRUFBVTtBQUNoQyxXQUFPLElBQUluQixjQUFKLENBQW1CLEVBQUU2QyxXQUFXMUIsSUFBYixFQUFuQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPbkIsY0FBUDtBQUNELENBakhEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC9maWVsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyk7XG5cbiAgY2xhc3MgU3ltU2VsZWN0RmllbGQgZXh0ZW5kcyBCYXNlRmllbGQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG5cbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uQ2hlY2tib3hDaGFuZ2UnXSlcbiAgICAgIHRoaXMuY2hlY2tlZCA9IGZhbHNlO1xuXG4gICAgICBsZXQgcHJvcG9ydGlvbiA9IHBhcnNlRmxvYXQodGhpcy5fbW9kZWwuZ2V0KCd2YWx1ZScpLnN1YnN0cih0aGlzLl9tb2RlbC5nZXQoJ3ZhbHVlJykuaW5kZXhPZignXycpKzEpKSAvIDEwMDtcbiAgICAgIGxldCBpbml0aWFsVmFsdWUgPSB7XG4gICAgICAgICdxdWFsaXRhdGl2ZVZhbHVlJzogdGhpcy5fbW9kZWwuZ2V0KCd2YWx1ZScpLFxuICAgICAgICAnbnVtZXJpY1ZhbHVlJzogcHJvcG9ydGlvbiAqIHBhcnNlRmxvYXQodGhpcy5fbW9kZWwuZ2V0KCdtYXhWYWx1ZScpKSxcbiAgICAgICAgJ3ZhcmlhdGlvbic6IHRoaXMuY2hlY2tlZFxuICAgICAgfVxuICAgICAgdGhpcy5fbW9kZWwuc2V0KCd2YWx1ZScsIGluaXRpYWxWYWx1ZSlcblxuICAgICAgdGhpcy5fdmlldy5hZGRFdmVudExpc3RlbmVyKCdGaWVsZC5WYWx1ZUNoYW5nZScsIHRoaXMuX29uRmllbGRDaGFuZ2UpO1xuICAgICAgdGhpcy5fdmlldy5hZGRFdmVudExpc3RlbmVyKCdTeW1TZWxlY3RGaWVsZC5DaGFuZ2VSZXF1ZXN0JywgdGhpcy5fb25DaGVja2JveENoYW5nZSk7XG5cbiAgICB9XG5cbiAgICBfb25DaGVja2JveENoYW5nZShldnQpIHtcbiAgICAgIHRoaXMuY2hlY2tlZCA9IGV2dC5kYXRhLnZhbHVlO1xuICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVWYWx1ZSgndmFyaWF0aW9uJyx0aGlzLmNoZWNrZWQpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5DaGFuZ2UnLCB7XG4gICAgICAgIG9sZFZhbHVlOiBvbGRWYWwsXG4gICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpLnF1YWxpdGF0aXZlVmFsdWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uRmllbGRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmJ1YmJsZXMpIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGxldCBvbGRWYWwgPSB0aGlzLl9tb2RlbC52YWx1ZSgpO1xuXG4gICAgICBsZXQgcHJvcG9ydGlvbiA9IHBhcnNlRmxvYXQoZXZ0LmRhdGEudmFsdWUuc3Vic3RyKGV2dC5kYXRhLnZhbHVlLmluZGV4T2YoJ18nKSsxKSkgLyAxMDA7XG5cbiAgICAgIHRoaXMuX21vZGVsLnNldCgndmFsdWUnLCB7XG4gICAgICAgIHZhcmlhdGlvbjogdGhpcy5jaGVja2VkLFxuICAgICAgICBxdWFsaXRhdGl2ZVZhbHVlOiBldnQuZGF0YS52YWx1ZSxcbiAgICAgICAgbnVtZXJpY1ZhbHVlOiBwcm9wb3J0aW9uICogcGFyc2VGbG9hdCh0aGlzLl9tb2RlbC5nZXQoJ21heFZhbHVlJykpXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5DaGFuZ2UnLCB7XG4gICAgICAgIG9sZFZhbHVlOiBvbGRWYWwsXG4gICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpLnF1YWxpdGF0aXZlVmFsdWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgYWRkT3B0aW9uKG9wdCkge1xuICAgICAgdGhpcy5fbW9kZWwuYWRkT3B0aW9uKG9wdCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlT3B0aW9uKGlkKSB7XG4gICAgICB0aGlzLl9tb2RlbC5yZW1vdmVPcHRpb24oaWQpO1xuICAgIH1cblxuICAgIGNsZWFyT3B0aW9ucygpIHtcbiAgICAgIHRoaXMuX21vZGVsLmNsZWFyT3B0aW9ucygpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdvcHRpb25zJyk7XG4gICAgfVxuXG4gICAgZ2V0QWJsZU9wdGlvbnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwubGlzdEFibGVPcHRpb25zKClcbiAgICB9XG5cbiAgICBkaXNhYmxlT3B0aW9uKGlkKSB7XG4gICAgICB0aGlzLl9tb2RlbC5kaXNhYmxlT3B0aW9uKGlkKTtcbiAgICB9XG5cbiAgICBlbmFibGVPcHRpb24oaWQpIHtcbiAgICAgIHRoaXMuX21vZGVsLmVuYWJsZU9wdGlvbihpZCk7XG4gICAgfVxuXG4gICAgc2VsZWN0Rmlyc3RBYmxlKCkge1xuICAgICAgY29uc3QgYWJsZSA9IHRoaXMuX21vZGVsLmxpc3RBYmxlT3B0aW9ucygpO1xuICAgICAgaWYgKCFhYmxlLmluY2x1ZGVzKHRoaXMudmFsdWUoKSkpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShhYmxlWzBdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRWYWx1ZSh2YWwpIHtcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG4gICAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVZhbHVlKCdxdWFsaXRhdGl2ZVZhbHVlJyx2YWwucXVhbGl0YXRpdmVWYWx1ZSk7XG4gICAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVZhbHVlKCdudW1lcmljVmFsdWUnLCB2YWwubnVtZXJpY1ZhbHVlKTtcbiAgICAgICAgdGhpcy5fbW9kZWwudXBkYXRlVmFsdWUoJ3ZhcmlhdGlvbicsdmFsLnZhcmlhdGlvbik7XG5cbiAgICAgICAgdGhpcy52aWV3KCkuX3JlbmRlcih0aGlzLl9tb2RlbCk7XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5DaGFuZ2UnLCB7XG4gICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbCxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5fbW9kZWwudmFsdWUoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBTeW1TZWxlY3RGaWVsZCh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBTeW1TZWxlY3RGaWVsZDtcbn0pO1xuIl19
