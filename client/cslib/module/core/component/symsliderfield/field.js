'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Field = require('core/component/form/field/field'),
      Model = require('./model'),
      View = require('./view');

  var SymmetricSliderField = function (_Field) {
    _inherits(SymmetricSliderField, _Field);

    function SymmetricSliderField(settings) {
      _classCallCheck(this, SymmetricSliderField);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (SymmetricSliderField.__proto__ || Object.getPrototypeOf(SymmetricSliderField)).call(this, settings));

      Utils.bindMethods(_this, ['_onChangeRequest', '_onUnitChangeRequest']);

      _this.view().addEventListener('SymSliderField.UnitChangeRequest', _this._onUnitChangeRequest);
      _this.view().addEventListener('SymSliderField.ChangeRequest', _this._onChangeRequest);
      return _this;
    }

    _createClass(SymmetricSliderField, [{
      key: '_onUnitChangeRequest',
      value: function _onUnitChangeRequest(evt) {
        if (!this._model.get('disabled')) {
          var oldVal = this._model.get('value');
          switch (evt.data.property) {
            case 'delta':
              if (evt.data.value) {
                this._model.setDeltaUnitValue(evt.data.value);
              } else {
                this._model.setDeltaUnitValue(Math.abs(this._model.get('unitValue') - evt.data.offset));
              }
              break;
            case 'base':
              this._model.setUnitValue(evt.data.value);
              break;
          }
          this.dispatchEvent('Field.Change', {
            oldValue: oldVal,
            value: this._model.value()
          });
        }
      }
    }, {
      key: '_onChangeRequest',
      value: function _onChangeRequest(evt) {
        if (!this._model.get('disabled')) {
          var oldVal = this._model.get('value');
          switch (evt.data.property) {
            case 'delta':
              this._model.setDeltaValue(evt.data.value);
              break;
            case 'base':
              this._model.setBaseValue(evt.data.value);
              break;
          }
          this.dispatchEvent('Field.Change', {
            oldValue: oldVal,
            value: this._model.value()
          });
        }
      }
    }, {
      key: 'setValue',
      value: function setValue(val) {
        var oldVal = this._model.get('value');
        this._model.setBaseValue(val.base);
        this._model.setDeltaValue(val.delta);
        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value()
        });
      }
    }]);

    return SymmetricSliderField;
  }(Field);

  SymmetricSliderField.create = function (data) {
    return new SymmetricSliderField({ modelData: data });
  };

  return SymmetricSliderField;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGaWVsZCIsIk1vZGVsIiwiVmlldyIsIlN5bW1ldHJpY1NsaWRlckZpZWxkIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblVuaXRDaGFuZ2VSZXF1ZXN0IiwiX29uQ2hhbmdlUmVxdWVzdCIsImV2dCIsIl9tb2RlbCIsImdldCIsIm9sZFZhbCIsImRhdGEiLCJwcm9wZXJ0eSIsInZhbHVlIiwic2V0RGVsdGFVbml0VmFsdWUiLCJNYXRoIiwiYWJzIiwib2Zmc2V0Iiwic2V0VW5pdFZhbHVlIiwiZGlzcGF0Y2hFdmVudCIsIm9sZFZhbHVlIiwic2V0RGVsdGFWYWx1ZSIsInNldEJhc2VWYWx1ZSIsInZhbCIsImJhc2UiLCJkZWx0YSIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFFBQVFKLFFBQVEsaUNBQVIsQ0FBZDtBQUFBLE1BQ0VLLFFBQVFMLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU0sT0FBT04sUUFBUSxRQUFSLENBRlQ7O0FBTGtCLE1BU1pPLG9CQVRZO0FBQUE7O0FBVWhCLGtDQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSixLQUE3QztBQUNBRyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCSixJQUEz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b3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9maWVsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuXG4gIGNsYXNzIFN5bW1ldHJpY1NsaWRlckZpZWxkIGV4dGVuZHMgRmllbGQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25DaGFuZ2VSZXF1ZXN0JywgJ19vblVuaXRDaGFuZ2VSZXF1ZXN0J10pXG5cbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ1N5bVNsaWRlckZpZWxkLlVuaXRDaGFuZ2VSZXF1ZXN0JywgdGhpcy5fb25Vbml0Q2hhbmdlUmVxdWVzdCk7XG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdTeW1TbGlkZXJGaWVsZC5DaGFuZ2VSZXF1ZXN0JywgdGhpcy5fb25DaGFuZ2VSZXF1ZXN0KTtcbiAgICB9XG5cbiAgICBfb25Vbml0Q2hhbmdlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICghdGhpcy5fbW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIGxldCBvbGRWYWwgPSB0aGlzLl9tb2RlbC5nZXQoJ3ZhbHVlJyk7XG4gICAgICAgIHN3aXRjaCAoZXZ0LmRhdGEucHJvcGVydHkpIHtcbiAgICAgICAgICBjYXNlICdkZWx0YSc6XG4gICAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuc2V0RGVsdGFVbml0VmFsdWUoZXZ0LmRhdGEudmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuc2V0RGVsdGFVbml0VmFsdWUoTWF0aC5hYnModGhpcy5fbW9kZWwuZ2V0KCd1bml0VmFsdWUnKSAtIGV2dC5kYXRhLm9mZnNldCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Jhc2UnOlxuICAgICAgICAgICAgdGhpcy5fbW9kZWwuc2V0VW5pdFZhbHVlKGV2dC5kYXRhLnZhbHVlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLkNoYW5nZScsIHtcbiAgICAgICAgICBvbGRWYWx1ZTogb2xkVmFsLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBfb25DaGFuZ2VSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKCF0aGlzLl9tb2RlbC5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLmdldCgndmFsdWUnKTtcbiAgICAgICAgc3dpdGNoIChldnQuZGF0YS5wcm9wZXJ0eSkge1xuICAgICAgICAgIGNhc2UgJ2RlbHRhJzpcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLnNldERlbHRhVmFsdWUoZXZ0LmRhdGEudmFsdWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Jhc2UnOlxuICAgICAgICAgICAgdGhpcy5fbW9kZWwuc2V0QmFzZVZhbHVlKGV2dC5kYXRhLnZhbHVlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLkNoYW5nZScsIHtcbiAgICAgICAgICBvbGRWYWx1ZTogb2xkVmFsLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNldFZhbHVlKHZhbCkge1xuICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLmdldCgndmFsdWUnKTtcbiAgICAgIHRoaXMuX21vZGVsLnNldEJhc2VWYWx1ZSh2YWwuYmFzZSk7XG4gICAgICB0aGlzLl9tb2RlbC5zZXREZWx0YVZhbHVlKHZhbC5kZWx0YSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLkNoYW5nZScsIHtcbiAgICAgICAgb2xkVmFsdWU6IG9sZFZhbCxcbiAgICAgICAgdmFsdWU6IHRoaXMuX21vZGVsLnZhbHVlKClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgU3ltbWV0cmljU2xpZGVyRmllbGQuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IFN5bW1ldHJpY1NsaWRlckZpZWxkKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG4gIFxuICByZXR1cm4gU3ltbWV0cmljU2xpZGVyRmllbGQ7XG59KTsiXX0=
