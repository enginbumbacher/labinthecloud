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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGaWVsZCIsIk1vZGVsIiwiVmlldyIsIlN5bW1ldHJpY1NsaWRlckZpZWxkIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblVuaXRDaGFuZ2VSZXF1ZXN0IiwiX29uQ2hhbmdlUmVxdWVzdCIsImV2dCIsIl9tb2RlbCIsImdldCIsIm9sZFZhbCIsImRhdGEiLCJwcm9wZXJ0eSIsInZhbHVlIiwic2V0RGVsdGFVbml0VmFsdWUiLCJNYXRoIiwiYWJzIiwib2Zmc2V0Iiwic2V0VW5pdFZhbHVlIiwiZGlzcGF0Y2hFdmVudCIsIm9sZFZhbHVlIiwic2V0RGVsdGFWYWx1ZSIsInNldEJhc2VWYWx1ZSIsInZhbCIsImJhc2UiLCJkZWx0YSIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFFBQVFKLFFBQVEsaUNBQVIsQ0FBZDtBQUFBLE1BQ0VLLFFBQVFMLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU0sT0FBT04sUUFBUSxRQUFSLENBRlQ7O0FBTGtCLE1BU1pPLG9CQVRZO0FBQUE7O0FBVWhCLGtDQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSixLQUE3QztBQUNBRyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCSixJQUEz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
