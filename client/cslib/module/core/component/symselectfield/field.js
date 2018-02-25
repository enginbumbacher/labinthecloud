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

      var proportion = _this._model.get('value').split('_').length === 2 ? parseFloat(_this._model.get('value').split('_')[1]) / 100 : parseFloat(_this._model.get('value').split('_').slice(-1).pop()) / 100;
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

        // Always grab the number at the end
        var proportion = evt.data.value.split('_').length === 2 ? parseFloat(evt.data.value.split('_')[1]) / 100 : parseFloat(evt.data.value.split('_').slice(-1).pop()) / 100;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZUZpZWxkIiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJTeW1TZWxlY3RGaWVsZCIsInNldHRpbmdzIiwidmlld0NsYXNzIiwibW9kZWxDbGFzcyIsImJpbmRNZXRob2RzIiwiY2hlY2tlZCIsInByb3BvcnRpb24iLCJfbW9kZWwiLCJnZXQiLCJzcGxpdCIsImxlbmd0aCIsInBhcnNlRmxvYXQiLCJzbGljZSIsInBvcCIsImluaXRpYWxWYWx1ZSIsInNldCIsIl92aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkZpZWxkQ2hhbmdlIiwiX29uQ2hlY2tib3hDaGFuZ2UiLCJldnQiLCJkYXRhIiwidmFsdWUiLCJvbGRWYWwiLCJ1cGRhdGVWYWx1ZSIsImRpc3BhdGNoRXZlbnQiLCJvbGRWYWx1ZSIsInF1YWxpdGF0aXZlVmFsdWUiLCJidWJibGVzIiwic3RvcFByb3BhZ2F0aW9uIiwidmFyaWF0aW9uIiwibnVtZXJpY1ZhbHVlIiwib3B0IiwiYWRkT3B0aW9uIiwiaWQiLCJyZW1vdmVPcHRpb24iLCJjbGVhck9wdGlvbnMiLCJsaXN0QWJsZU9wdGlvbnMiLCJkaXNhYmxlT3B0aW9uIiwiZW5hYmxlT3B0aW9uIiwiYWJsZSIsImluY2x1ZGVzIiwic2V0VmFsdWUiLCJ2YWwiLCJ2aWV3IiwiX3JlbmRlciIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLGlDQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFNWkssY0FOWTtBQUFBOztBQU9o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UztBQUNQLGNBQUlwQixTQUFTLEtBQUtoQixNQUFMLENBQVllLEtBQVosRUFBYjtBQUNBLGVBQUtmLE1BQUwsQ0FBWWlCLFdBQVosQ0FBd0Isa0JBQXhCLEVBQTJDbUIsSUFBSWhCLGdCQUEvQztBQUNBLGVBQUtwQixNQUFMLENBQVlpQixXQUFaLENBQXdCLGNBQXhCLEVBQXdDbUIsSUFBSVosWUFBNUM7QUFDQSxlQUFLeEIsTUFBTCxDQUFZaUIsV0FBWixDQUF3QixXQUF4QixFQUFvQ21CLElBQUliLFNBQXhDOztBQUVBLGVBQUtjLElBQUwsR0FBWUMsT0FBWixDQUFvQixLQUFLdEMsTUFBekI7O0FBRUEsZUFBS2tCLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUM7QUFDakNDLHNCQUFVSCxNQUR1QjtBQUVqQ0QsbUJBQU8sS0FBS2YsTUFBTCxDQUFZZSxLQUFaO0FBRjBCLFdBQW5DO0FBSUQ7QUFDRjtBQTFHZTs7QUFBQTtBQUFBLElBTVcxQixTQU5YOztBQTZHbEJJLGlCQUFlOEMsTUFBZixHQUF3QixVQUFDekIsSUFBRCxFQUFVO0FBQ2hDLFdBQU8sSUFBSXJCLGNBQUosQ0FBbUIsRUFBRStDLFdBQVcxQixJQUFiLEVBQW5CLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9yQixjQUFQO0FBQ0QsQ0FsSEQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3N5bXNlbGVjdGZpZWxkL2ZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEJhc2VGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvZmllbGQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKTtcblxuICBjbGFzcyBTeW1TZWxlY3RGaWVsZCBleHRlbmRzIEJhc2VGaWVsZCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25DaGVja2JveENoYW5nZSddKVxuICAgICAgdGhpcy5jaGVja2VkID0gZmFsc2U7XG5cbiAgICAgIGxldCBwcm9wb3J0aW9uID0gKHRoaXMuX21vZGVsLmdldCgndmFsdWUnKS5zcGxpdCgnXycpLmxlbmd0aCA9PT0gMikgPyBwYXJzZUZsb2F0KHRoaXMuX21vZGVsLmdldCgndmFsdWUnKS5zcGxpdCgnXycpWzFdKS8xMDAgOiBwYXJzZUZsb2F0KHRoaXMuX21vZGVsLmdldCgndmFsdWUnKS5zcGxpdCgnXycpLnNsaWNlKC0xKS5wb3AoKSkvMTAwO1xuICAgICAgbGV0IGluaXRpYWxWYWx1ZSA9IHtcbiAgICAgICAgJ3F1YWxpdGF0aXZlVmFsdWUnOiB0aGlzLl9tb2RlbC5nZXQoJ3ZhbHVlJyksXG4gICAgICAgICdudW1lcmljVmFsdWUnOiBwcm9wb3J0aW9uICogcGFyc2VGbG9hdCh0aGlzLl9tb2RlbC5nZXQoJ21heFZhbHVlJykpLFxuICAgICAgICAndmFyaWF0aW9uJzogdGhpcy5jaGVja2VkXG4gICAgICB9XG4gICAgICB0aGlzLl9tb2RlbC5zZXQoJ3ZhbHVlJywgaW5pdGlhbFZhbHVlKVxuXG4gICAgICB0aGlzLl92aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ0ZpZWxkLlZhbHVlQ2hhbmdlJywgdGhpcy5fb25GaWVsZENoYW5nZSk7XG4gICAgICB0aGlzLl92aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ1N5bVNlbGVjdEZpZWxkLkNoYW5nZVJlcXVlc3QnLCB0aGlzLl9vbkNoZWNrYm94Q2hhbmdlKTtcblxuICAgIH1cblxuICAgIF9vbkNoZWNrYm94Q2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5jaGVja2VkID0gZXZ0LmRhdGEudmFsdWU7XG4gICAgICBsZXQgb2xkVmFsID0gdGhpcy5fbW9kZWwudmFsdWUoKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVZhbHVlKCd2YXJpYXRpb24nLHRoaXMuY2hlY2tlZCk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLkNoYW5nZScsIHtcbiAgICAgICAgb2xkVmFsdWU6IG9sZFZhbCxcbiAgICAgICAgdmFsdWU6IHRoaXMuX21vZGVsLnZhbHVlKCkucXVhbGl0YXRpdmVWYWx1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25GaWVsZENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuYnViYmxlcykgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG5cbiAgICAgIC8vIEFsd2F5cyBncmFiIHRoZSBudW1iZXIgYXQgdGhlIGVuZFxuICAgICAgbGV0IHByb3BvcnRpb24gPSAoZXZ0LmRhdGEudmFsdWUuc3BsaXQoJ18nKS5sZW5ndGggPT09IDIpPyBwYXJzZUZsb2F0KGV2dC5kYXRhLnZhbHVlLnNwbGl0KCdfJylbMV0pLzEwMCA6IHBhcnNlRmxvYXQoZXZ0LmRhdGEudmFsdWUuc3BsaXQoJ18nKS5zbGljZSgtMSkucG9wKCkpLzEwMDtcblxuICAgICAgdGhpcy5fbW9kZWwuc2V0KCd2YWx1ZScsIHtcbiAgICAgICAgdmFyaWF0aW9uOiB0aGlzLmNoZWNrZWQsXG4gICAgICAgIHF1YWxpdGF0aXZlVmFsdWU6IGV2dC5kYXRhLnZhbHVlLFxuICAgICAgICBudW1lcmljVmFsdWU6IHByb3BvcnRpb24gKiBwYXJzZUZsb2F0KHRoaXMuX21vZGVsLmdldCgnbWF4VmFsdWUnKSlcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLkNoYW5nZScsIHtcbiAgICAgICAgb2xkVmFsdWU6IG9sZFZhbCxcbiAgICAgICAgdmFsdWU6IHRoaXMuX21vZGVsLnZhbHVlKCkucXVhbGl0YXRpdmVWYWx1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGRPcHRpb24ob3B0KSB7XG4gICAgICB0aGlzLl9tb2RlbC5hZGRPcHRpb24ob3B0KTtcbiAgICB9XG5cbiAgICByZW1vdmVPcHRpb24oaWQpIHtcbiAgICAgIHRoaXMuX21vZGVsLnJlbW92ZU9wdGlvbihpZCk7XG4gICAgfVxuXG4gICAgY2xlYXJPcHRpb25zKCkge1xuICAgICAgdGhpcy5fbW9kZWwuY2xlYXJPcHRpb25zKCk7XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9ucygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ29wdGlvbnMnKTtcbiAgICB9XG5cbiAgICBnZXRBYmxlT3B0aW9ucygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5saXN0QWJsZU9wdGlvbnMoKVxuICAgIH1cblxuICAgIGRpc2FibGVPcHRpb24oaWQpIHtcbiAgICAgIHRoaXMuX21vZGVsLmRpc2FibGVPcHRpb24oaWQpO1xuICAgIH1cblxuICAgIGVuYWJsZU9wdGlvbihpZCkge1xuICAgICAgdGhpcy5fbW9kZWwuZW5hYmxlT3B0aW9uKGlkKTtcbiAgICB9XG5cbiAgICBzZWxlY3RGaXJzdEFibGUoKSB7XG4gICAgICBjb25zdCBhYmxlID0gdGhpcy5fbW9kZWwubGlzdEFibGVPcHRpb25zKCk7XG4gICAgICBpZiAoIWFibGUuaW5jbHVkZXModGhpcy52YWx1ZSgpKSkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKGFibGVbMF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldFZhbHVlKHZhbCkge1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBsZXQgb2xkVmFsID0gdGhpcy5fbW9kZWwudmFsdWUoKTtcbiAgICAgICAgdGhpcy5fbW9kZWwudXBkYXRlVmFsdWUoJ3F1YWxpdGF0aXZlVmFsdWUnLHZhbC5xdWFsaXRhdGl2ZVZhbHVlKTtcbiAgICAgICAgdGhpcy5fbW9kZWwudXBkYXRlVmFsdWUoJ251bWVyaWNWYWx1ZScsIHZhbC5udW1lcmljVmFsdWUpO1xuICAgICAgICB0aGlzLl9tb2RlbC51cGRhdGVWYWx1ZSgndmFyaWF0aW9uJyx2YWwudmFyaWF0aW9uKTtcblxuICAgICAgICB0aGlzLnZpZXcoKS5fcmVuZGVyKHRoaXMuX21vZGVsKTtcblxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLkNoYW5nZScsIHtcbiAgICAgICAgICBvbGRWYWx1ZTogb2xkVmFsLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgU3ltU2VsZWN0RmllbGQuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IFN5bVNlbGVjdEZpZWxkKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcmV0dXJuIFN5bVNlbGVjdEZpZWxkO1xufSk7XG4iXX0=
