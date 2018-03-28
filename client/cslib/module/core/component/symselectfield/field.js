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

      Utils.bindMethods(_this, ['_onVariationChange']);
      _this.checked = false;

      var proportion = _this._model.get('value').split('_').length === 2 ? parseFloat(_this._model.get('value').split('_')[1]) / 100 : parseFloat(_this._model.get('value').split('_').slice(-1).pop()) / 100;
      var initialValue = {
        'qualitativeValue': _this._model.get('value'),
        'numericValue': proportion * parseFloat(_this._model.get('maxValue')),
        'variation': 0
      };
      _this._model.set('value', initialValue);

      _this._view.addEventListener('Field.ValueChange', _this._onFieldChange);
      _this._view.addEventListener('SymSelectField.ChangeRequest', _this._onVariationChange);

      return _this;
    }

    _createClass(SymSelectField, [{
      key: '_onVariationChange',
      value: function _onVariationChange(evt) {
        if (evt.bubbles) evt.stopPropagation();
        var oldVal = this._model.value();

        var varPercentage = evt.data.value.split('_').length === 2 ? parseFloat(evt.data.value.split('_')[1]) / 100 : parseFloat(evt.data.value.split('_').slice(-1).pop()) / 100;

        this._model.updateValue('variation', varPercentage);

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
          variation: this._model.get('value').variation,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZUZpZWxkIiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJTeW1TZWxlY3RGaWVsZCIsInNldHRpbmdzIiwidmlld0NsYXNzIiwibW9kZWxDbGFzcyIsImJpbmRNZXRob2RzIiwiY2hlY2tlZCIsInByb3BvcnRpb24iLCJfbW9kZWwiLCJnZXQiLCJzcGxpdCIsImxlbmd0aCIsInBhcnNlRmxvYXQiLCJzbGljZSIsInBvcCIsImluaXRpYWxWYWx1ZSIsInNldCIsIl92aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkZpZWxkQ2hhbmdlIiwiX29uVmFyaWF0aW9uQ2hhbmdlIiwiZXZ0IiwiYnViYmxlcyIsInN0b3BQcm9wYWdhdGlvbiIsIm9sZFZhbCIsInZhbHVlIiwidmFyUGVyY2VudGFnZSIsImRhdGEiLCJ1cGRhdGVWYWx1ZSIsImRpc3BhdGNoRXZlbnQiLCJvbGRWYWx1ZSIsInF1YWxpdGF0aXZlVmFsdWUiLCJ2YXJpYXRpb24iLCJudW1lcmljVmFsdWUiLCJvcHQiLCJhZGRPcHRpb24iLCJpZCIsInJlbW92ZU9wdGlvbiIsImNsZWFyT3B0aW9ucyIsImxpc3RBYmxlT3B0aW9ucyIsImRpc2FibGVPcHRpb24iLCJlbmFibGVPcHRpb24iLCJhYmxlIiwiaW5jbHVkZXMiLCJzZXRWYWx1ZSIsInZhbCIsInZpZXciLCJfcmVuZGVyIiwiY3JlYXRlIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsaUNBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWOztBQURrQixNQU1a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Q0F0SEQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3N5bXNlbGVjdGZpZWxkL2ZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEJhc2VGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvZmllbGQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKTtcblxuICBjbGFzcyBTeW1TZWxlY3RGaWVsZCBleHRlbmRzIEJhc2VGaWVsZCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25WYXJpYXRpb25DaGFuZ2UnXSlcbiAgICAgIHRoaXMuY2hlY2tlZCA9IGZhbHNlO1xuXG4gICAgICBsZXQgcHJvcG9ydGlvbiA9ICh0aGlzLl9tb2RlbC5nZXQoJ3ZhbHVlJykuc3BsaXQoJ18nKS5sZW5ndGggPT09IDIpID8gcGFyc2VGbG9hdCh0aGlzLl9tb2RlbC5nZXQoJ3ZhbHVlJykuc3BsaXQoJ18nKVsxXSkvMTAwIDogcGFyc2VGbG9hdCh0aGlzLl9tb2RlbC5nZXQoJ3ZhbHVlJykuc3BsaXQoJ18nKS5zbGljZSgtMSkucG9wKCkpLzEwMDtcbiAgICAgIGxldCBpbml0aWFsVmFsdWUgPSB7XG4gICAgICAgICdxdWFsaXRhdGl2ZVZhbHVlJzogdGhpcy5fbW9kZWwuZ2V0KCd2YWx1ZScpLFxuICAgICAgICAnbnVtZXJpY1ZhbHVlJzogcHJvcG9ydGlvbiAqIHBhcnNlRmxvYXQodGhpcy5fbW9kZWwuZ2V0KCdtYXhWYWx1ZScpKSxcbiAgICAgICAgJ3ZhcmlhdGlvbic6IDBcbiAgICAgIH1cbiAgICAgIHRoaXMuX21vZGVsLnNldCgndmFsdWUnLCBpbml0aWFsVmFsdWUpXG5cbiAgICAgIHRoaXMuX3ZpZXcuYWRkRXZlbnRMaXN0ZW5lcignRmllbGQuVmFsdWVDaGFuZ2UnLCB0aGlzLl9vbkZpZWxkQ2hhbmdlKTtcbiAgICAgIHRoaXMuX3ZpZXcuYWRkRXZlbnRMaXN0ZW5lcignU3ltU2VsZWN0RmllbGQuQ2hhbmdlUmVxdWVzdCcsIHRoaXMuX29uVmFyaWF0aW9uQ2hhbmdlKTtcblxuICAgIH1cblxuICAgIF9vblZhcmlhdGlvbkNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuYnViYmxlcykgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG5cbiAgICAgIGxldCB2YXJQZXJjZW50YWdlID0gKGV2dC5kYXRhLnZhbHVlLnNwbGl0KCdfJykubGVuZ3RoID09PSAyKT8gcGFyc2VGbG9hdChldnQuZGF0YS52YWx1ZS5zcGxpdCgnXycpWzFdKS8xMDAgOiBwYXJzZUZsb2F0KGV2dC5kYXRhLnZhbHVlLnNwbGl0KCdfJykuc2xpY2UoLTEpLnBvcCgpKS8xMDA7XG5cbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVZhbHVlKCd2YXJpYXRpb24nLHZhclBlcmNlbnRhZ2UpO1xuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLkNoYW5nZScsIHtcbiAgICAgICAgb2xkVmFsdWU6IG9sZFZhbCxcbiAgICAgICAgdmFsdWU6IHRoaXMuX21vZGVsLnZhbHVlKCkucXVhbGl0YXRpdmVWYWx1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25GaWVsZENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuYnViYmxlcykgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG5cbiAgICAgIC8vIEFsd2F5cyBncmFiIHRoZSBudW1iZXIgYXQgdGhlIGVuZFxuICAgICAgbGV0IHByb3BvcnRpb24gPSAoZXZ0LmRhdGEudmFsdWUuc3BsaXQoJ18nKS5sZW5ndGggPT09IDIpPyBwYXJzZUZsb2F0KGV2dC5kYXRhLnZhbHVlLnNwbGl0KCdfJylbMV0pLzEwMCA6IHBhcnNlRmxvYXQoZXZ0LmRhdGEudmFsdWUuc3BsaXQoJ18nKS5zbGljZSgtMSkucG9wKCkpLzEwMDtcblxuICAgICAgdGhpcy5fbW9kZWwuc2V0KCd2YWx1ZScsIHtcbiAgICAgICAgdmFyaWF0aW9uOiB0aGlzLl9tb2RlbC5nZXQoJ3ZhbHVlJykudmFyaWF0aW9uLFxuICAgICAgICBxdWFsaXRhdGl2ZVZhbHVlOiBldnQuZGF0YS52YWx1ZSxcbiAgICAgICAgbnVtZXJpY1ZhbHVlOiBwcm9wb3J0aW9uICogcGFyc2VGbG9hdCh0aGlzLl9tb2RlbC5nZXQoJ21heFZhbHVlJykpXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5DaGFuZ2UnLCB7XG4gICAgICAgIG9sZFZhbHVlOiBvbGRWYWwsXG4gICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpLnF1YWxpdGF0aXZlVmFsdWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgYWRkT3B0aW9uKG9wdCkge1xuICAgICAgdGhpcy5fbW9kZWwuYWRkT3B0aW9uKG9wdCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlT3B0aW9uKGlkKSB7XG4gICAgICB0aGlzLl9tb2RlbC5yZW1vdmVPcHRpb24oaWQpO1xuICAgIH1cblxuICAgIGNsZWFyT3B0aW9ucygpIHtcbiAgICAgIHRoaXMuX21vZGVsLmNsZWFyT3B0aW9ucygpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0KCdvcHRpb25zJyk7XG4gICAgfVxuXG4gICAgZ2V0QWJsZU9wdGlvbnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwubGlzdEFibGVPcHRpb25zKClcbiAgICB9XG5cbiAgICBkaXNhYmxlT3B0aW9uKGlkKSB7XG4gICAgICB0aGlzLl9tb2RlbC5kaXNhYmxlT3B0aW9uKGlkKTtcbiAgICB9XG5cbiAgICBlbmFibGVPcHRpb24oaWQpIHtcbiAgICAgIHRoaXMuX21vZGVsLmVuYWJsZU9wdGlvbihpZCk7XG4gICAgfVxuXG4gICAgc2VsZWN0Rmlyc3RBYmxlKCkge1xuICAgICAgY29uc3QgYWJsZSA9IHRoaXMuX21vZGVsLmxpc3RBYmxlT3B0aW9ucygpO1xuICAgICAgaWYgKCFhYmxlLmluY2x1ZGVzKHRoaXMudmFsdWUoKSkpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShhYmxlWzBdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRWYWx1ZSh2YWwpIHtcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG4gICAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVZhbHVlKCdxdWFsaXRhdGl2ZVZhbHVlJyx2YWwucXVhbGl0YXRpdmVWYWx1ZSk7XG4gICAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVZhbHVlKCdudW1lcmljVmFsdWUnLCB2YWwubnVtZXJpY1ZhbHVlKTtcbiAgICAgICAgdGhpcy5fbW9kZWwudXBkYXRlVmFsdWUoJ3ZhcmlhdGlvbicsdmFsLnZhcmlhdGlvbik7XG5cbiAgICAgICAgdGhpcy52aWV3KCkuX3JlbmRlcih0aGlzLl9tb2RlbCk7XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5DaGFuZ2UnLCB7XG4gICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbCxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5fbW9kZWwudmFsdWUoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBTeW1TZWxlY3RGaWVsZCh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBTeW1TZWxlY3RGaWVsZDtcbn0pO1xuIl19
