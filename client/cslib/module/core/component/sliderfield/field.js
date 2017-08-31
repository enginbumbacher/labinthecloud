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

  var SliderField = function (_Field) {
    _inherits(SliderField, _Field);

    function SliderField() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, SliderField);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (SliderField.__proto__ || Object.getPrototypeOf(SliderField)).call(this, settings));

      Utils.bindMethods(_this, ['_onUnitChangeRequest', '_onChangeRequest']);

      _this.view().addEventListener('SliderField.UnitChangeRequest', _this._onUnitChangeRequest);
      _this.view().addEventListener('SliderField.ChangeRequest', _this._onChangeRequest);
      return _this;
    }

    _createClass(SliderField, [{
      key: '_onUnitChangeRequest',
      value: function _onUnitChangeRequest(evt) {
        if (!this._model.get('disabled')) {
          var oldVal = this._model.value();
          this._model.setUnitValue(evt.data.value);
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
          var oldVal = this._model.value();
          this._model.setValue(evt.data.value);
          this.dispatchEvent('Field.Change', {
            oldValue: oldVal,
            value: this._model.value()
          });
        }
      }
    }, {
      key: 'setValue',
      value: function setValue(val) {
        var oldVal = this._model.value();
        this._model.setValue(val);
        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value()
        });
      }
    }]);

    return SliderField;
  }(Field);

  SliderField.create = function (data) {
    return new SliderField({ modelData: data });
  };

  return SliderField;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGaWVsZCIsIk1vZGVsIiwiVmlldyIsIlNsaWRlckZpZWxkIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblVuaXRDaGFuZ2VSZXF1ZXN0IiwiX29uQ2hhbmdlUmVxdWVzdCIsImV2dCIsIl9tb2RlbCIsImdldCIsIm9sZFZhbCIsInZhbHVlIiwic2V0VW5pdFZhbHVlIiwiZGF0YSIsImRpc3BhdGNoRXZlbnQiLCJvbGRWYWx1ZSIsInNldFZhbHVlIiwidmFsIiwiY3JlYXRlIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksUUFBUUosUUFBUSxpQ0FBUixDQUFkO0FBQUEsTUFDRUssUUFBUUwsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFTSxPQUFPTixRQUFRLFFBQVIsQ0FGVDs7QUFMa0IsTUFTWk8sV0FUWTtBQUFBOztBQVVoQiwyQkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSixLQUE3QztBQUNBRyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCSixJQUEzQzs7QUFGeUIsNEhBR25CRSxRQUhtQjs7QUFJekJOLFlBQU1TLFdBQU4sUUFBd0IsQ0FBQyxzQkFBRCxFQUF5QixrQkFBekIsQ0FBeEI7O0FBRUEsWUFBS0MsSUFBTCxHQUFZQyxnQkFBWixDQUE2QiwrQkFBN0IsRUFBOEQsTUFBS0Msb0JBQW5FO0FBQ0EsWUFBS0YsSUFBTCxHQUFZQyxnQkFBWixDQUE2QiwyQkFBN0IsRUFBMEQsTUFBS0UsZ0JBQS9EO0FBUHlCO0FBUTFCOztBQWxCZTtBQUFBO0FBQUEsMkNBb0JLQyxHQXBCTCxFQW9CVTtBQUN4QixZQUFJLENBQUMsS0FBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLENBQUwsRUFBa0M7QUFDaEMsY0FBSUMsU0FBUyxLQUFLRixNQUFMLENBQVlHLEtBQVosRUFBYjtBQUNBLGVBQUtILE1BQUwsQ0FBWUksWUFBWixDQUF5QkwsSUFBSU0sSUFBSixDQUFTRixLQUFsQztBQUNBLGVBQUtHLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUM7QUFDakNDLHNCQUFVTCxNQUR1QjtBQUVqQ0MsbUJBQU8sS0FBS0gsTUFBTCxDQUFZRyxLQUFaO0FBRjBCLFdBQW5DO0FBSUQ7QUFDRjtBQTdCZTtBQUFBO0FBQUEsdUNBK0JDSixHQS9CRCxFQStCTTtBQUNwQixZQUFJLENBQUMsS0FBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLENBQUwsRUFBa0M7QUFDaEMsY0FBSUMsU0FBUyxLQUFLRixNQUFMLENBQVlHLEtBQVosRUFBYjtBQUNBLGVBQUtILE1BQUwsQ0FBWVEsUUFBWixDQUFxQlQsSUFBSU0sSUFBSixDQUFTRixLQUE5QjtBQUNBLGVBQUtHLGFBQUwsQ0FBbUIsY0FBbkIsRUFBbUM7QUFDakNDLHNCQUFVTCxNQUR1QjtBQUVqQ0MsbUJBQU8sS0FBS0gsTUFBTCxDQUFZRyxLQUFaO0FBRjBCLFdBQW5DO0FBSUQ7QUFDRjtBQXhDZTtBQUFBO0FBQUEsK0JBMENQTSxHQTFDTyxFQTBDRjtBQUNaLFlBQUlQLFNBQVMsS0FBS0YsTUFBTCxDQUFZRyxLQUFaLEVBQWI7QUFDQSxhQUFLSCxNQUFMLENBQVlRLFFBQVosQ0FBcUJDLEdBQXJCO0FBQ0EsYUFBS0gsYUFBTCxDQUFtQixjQUFuQixFQUFtQztBQUNqQ0Msb0JBQVVMLE1BRHVCO0FBRWpDQyxpQkFBTyxLQUFLSCxNQUFMLENBQVlHLEtBQVo7QUFGMEIsU0FBbkM7QUFJRDtBQWpEZTs7QUFBQTtBQUFBLElBU1FoQixLQVRSOztBQW9EbEJHLGNBQVlvQixNQUFaLEdBQXFCLFVBQUNMLElBQUQsRUFBVTtBQUM3QixXQUFPLElBQUlmLFdBQUosQ0FBZ0IsRUFBRXFCLFdBQVdOLElBQWIsRUFBaEIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT2YsV0FBUDtBQUNELENBekREIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG4gIFxuICBjb25zdCBGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvZmllbGQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XG5cbiAgY2xhc3MgU2xpZGVyRmllbGQgZXh0ZW5kcyBGaWVsZCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVW5pdENoYW5nZVJlcXVlc3QnLCAnX29uQ2hhbmdlUmVxdWVzdCddKVxuXG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdTbGlkZXJGaWVsZC5Vbml0Q2hhbmdlUmVxdWVzdCcsIHRoaXMuX29uVW5pdENoYW5nZVJlcXVlc3QpXG4gICAgICB0aGlzLnZpZXcoKS5hZGRFdmVudExpc3RlbmVyKCdTbGlkZXJGaWVsZC5DaGFuZ2VSZXF1ZXN0JywgdGhpcy5fb25DaGFuZ2VSZXF1ZXN0KVxuICAgIH1cblxuICAgIF9vblVuaXRDaGFuZ2VSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKCF0aGlzLl9tb2RlbC5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG4gICAgICAgIHRoaXMuX21vZGVsLnNldFVuaXRWYWx1ZShldnQuZGF0YS52YWx1ZSk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRmllbGQuQ2hhbmdlJywge1xuICAgICAgICAgIG9sZFZhbHVlOiBvbGRWYWwsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuX21vZGVsLnZhbHVlKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25DaGFuZ2VSZXF1ZXN0KGV2dCkge1xuICAgICAgaWYgKCF0aGlzLl9tb2RlbC5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG4gICAgICAgIHRoaXMuX21vZGVsLnNldFZhbHVlKGV2dC5kYXRhLnZhbHVlKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5DaGFuZ2UnLCB7XG4gICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbCxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5fbW9kZWwudmFsdWUoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHNldFZhbHVlKHZhbCkge1xuICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG4gICAgICB0aGlzLl9tb2RlbC5zZXRWYWx1ZSh2YWwpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5DaGFuZ2UnLCB7XG4gICAgICAgIG9sZFZhbHVlOiBvbGRWYWwsXG4gICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIFNsaWRlckZpZWxkLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBTbGlkZXJGaWVsZCh7IG1vZGVsRGF0YTogZGF0YSB9KVxuICB9XG5cbiAgcmV0dXJuIFNsaWRlckZpZWxkO1xufSkiXX0=
