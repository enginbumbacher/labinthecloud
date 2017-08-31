'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var FieldModel = require('core/component/form/field/model'),
      defaults = {
    min: 0,
    max: 1,
    steps: 0,
    defaultValue: {
      base: 0.5,
      delta: 0.1
    },
    unitValue: 0.5,
    deltaUnitValue: 0.1
  };

  return function (_FieldModel) {
    _inherits(SymmetricSliderFieldModel, _FieldModel);

    function SymmetricSliderFieldModel(conf) {
      _classCallCheck(this, SymmetricSliderFieldModel);

      conf.defaults = Utils.ensureDefaults(conf.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (SymmetricSliderFieldModel.__proto__ || Object.getPrototypeOf(SymmetricSliderFieldModel)).call(this, conf));

      var min = _this.get('min'),
          max = _this.get('max');
      _this.set('unitValue', (_this.value().base - min) / (max - min));
      _this.set('deltaUnitValue', _this.value().delta / (max - min));
      return _this;
    }

    _createClass(SymmetricSliderFieldModel, [{
      key: 'setBaseValue',
      value: function setBaseValue(val) {
        this.setUnitValue((val - this.get('min')) / (this.get('max') - this.get('min')));
      }
    }, {
      key: 'setDeltaValue',
      value: function setDeltaValue(val) {
        this.setDeltaUnitValue(val / (this.get('max') - this.get('min')));
      }
    }, {
      key: 'setUnitValue',
      value: function setUnitValue(val) {
        val = Math.min(1, Math.max(0, val));
        var steps = this.get('steps');
        if (steps > 1) {
          val = Math.round(val * steps) / steps;
        }
        this.set('unitValue', val);
        if (val < this.get('deltaUnitValue')) {
          this.set('deltaUnitValue', val);
        }
        if (1 - val < this.get('deltaUnitValue')) {
          this.set('deltaUnitValue', 1 - val);
        }
        this._updateValue();
      }
    }, {
      key: 'setDeltaUnitValue',
      value: function setDeltaUnitValue(val) {
        val = Math.min(this.get('unitValue'), 1 - this.get('unitValue'), val);
        var steps = this.get('steps');
        if (steps > 1) {
          val = Math.round(val * steps) / steps;
        }
        this.set('deltaUnitValue', val);
        this._updateValue();
      }
    }, {
      key: '_updateValue',
      value: function _updateValue() {
        var max = this.get('max'),
            min = this.get('min'),
            steps = this.get('steps');
        var v = void 0;
        if (steps > 1) {
          var stepSize = (max - min) / steps;
          var exp = stepSize.toExponential().split('e');
          exp = exp[1] ? +exp[1] : 0;
          v = {
            base: Utils.roundDecimal(this.get('unitValue') * steps * stepSize + min, exp),
            delta: Utils.roundDecimal(this.get('deltaUnitValue') * steps * stepSize, exp)
          };
        } else {
          v = {
            base: this.get('unitValue') * (max - min) + min,
            delta: this.get('deltaUnitValue') * (max - min)
          };
        }
        this.set('value', v);
      }
    }]);

    return SymmetricSliderFieldModel;
  }(FieldModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGaWVsZE1vZGVsIiwiZGVmYXVsdHMiLCJtaW4iLCJtYXgiLCJzdGVwcyIsImRlZmF1bHRWYWx1ZSIsImJhc2UiLCJkZWx0YSIsInVuaXRWYWx1ZSIsImRlbHRhVW5pdFZhbHVlIiwiY29uZiIsImVuc3VyZURlZmF1bHRzIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJ2YWwiLCJzZXRVbml0VmFsdWUiLCJzZXREZWx0YVVuaXRWYWx1ZSIsIk1hdGgiLCJyb3VuZCIsIl91cGRhdGVWYWx1ZSIsInYiLCJzdGVwU2l6ZSIsImV4cCIsInRvRXhwb25lbnRpYWwiLCJzcGxpdCIsInJvdW5kRGVjaW1hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLGFBQWFKLFFBQVEsaUNBQVIsQ0FBbkI7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLFNBQUssQ0FESTtBQUVUQyxTQUFLLENBRkk7QUFHVEMsV0FBTyxDQUhFO0FBSVRDLGtCQUFjO0FBQ1pDLFlBQU0sR0FETTtBQUVaQyxhQUFPO0FBRkssS0FKTDtBQVFUQyxlQUFXLEdBUkY7QUFTVEMsb0JBQWdCO0FBVFAsR0FEYjs7QUFhQTtBQUFBOztBQUNFLHVDQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCQSxXQUFLVCxRQUFMLEdBQWdCSCxNQUFNYSxjQUFOLENBQXFCRCxLQUFLVCxRQUExQixFQUFvQ0EsUUFBcEMsQ0FBaEI7O0FBRGdCLHdKQUVWUyxJQUZVOztBQUloQixVQUFNUixNQUFNLE1BQUtVLEdB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QixLQUFLZCxHQUFMLENBQVMsV0FBVCxJQUF3QlIsS0FBeEIsR0FBZ0NrQixRQUFoQyxHQUEyQ3BCLEdBQTlELEVBQW1FcUIsR0FBbkUsQ0FESjtBQUVGaEIsbUJBQU9ULE1BQU00QixZQUFOLENBQW1CLEtBQUtkLEdBQUwsQ0FBUyxnQkFBVCxJQUE2QlIsS0FBN0IsR0FBcUNrQixRQUF4RCxFQUFrRUMsR0FBbEU7QUFGTCxXQUFKO0FBSUQsU0FSRCxNQVFPO0FBQ0xGLGNBQUk7QUFDRmYsa0JBQU0sS0FBS00sR0FBTCxDQUFTLFdBQVQsS0FBeUJULE1BQU1ELEdBQS9CLElBQXNDQSxHQUQxQztBQUVGSyxtQkFBTyxLQUFLSyxHQUFMLENBQVMsZ0JBQVQsS0FBOEJULE1BQU1ELEdBQXBDO0FBRkwsV0FBSjtBQUlEO0FBQ0QsYUFBS1csR0FBTCxDQUFTLE9BQVQsRUFBa0JRLENBQWxCO0FBQ0Q7QUEvREg7O0FBQUE7QUFBQSxJQUErQ3JCLFVBQS9DO0FBaUVELENBbkZEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRmllbGRNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvbW9kZWwnKSxcbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIG1pbjogMCxcbiAgICAgIG1heDogMSxcbiAgICAgIHN0ZXBzOiAwLFxuICAgICAgZGVmYXVsdFZhbHVlOiB7XG4gICAgICAgIGJhc2U6IDAuNSxcbiAgICAgICAgZGVsdGE6IDAuMVxuICAgICAgfSxcbiAgICAgIHVuaXRWYWx1ZTogMC41LFxuICAgICAgZGVsdGFVbml0VmFsdWU6IDAuMVxuICAgIH07XG5cbiAgcmV0dXJuIGNsYXNzIFN5bW1ldHJpY1NsaWRlckZpZWxkTW9kZWwgZXh0ZW5kcyBGaWVsZE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25mKSB7XG4gICAgICBjb25mLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZi5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZik7XG5cbiAgICAgIGNvbnN0IG1pbiA9IHRoaXMuZ2V0KCdtaW4nKSxcbiAgICAgICAgbWF4ID0gdGhpcy5nZXQoJ21heCcpO1xuICAgICAgdGhpcy5zZXQoJ3VuaXRWYWx1ZScsICh0aGlzLnZhbHVlKCkuYmFzZSAtIG1pbikgLyAobWF4IC0gbWluKSk7XG4gICAgICB0aGlzLnNldCgnZGVsdGFVbml0VmFsdWUnLCB0aGlzLnZhbHVlKCkuZGVsdGEgLyAobWF4IC0gbWluKSk7XG4gICAgfVxuXG4gICAgc2V0QmFzZVZhbHVlKHZhbCkge1xuICAgICAgdGhpcy5zZXRVbml0VmFsdWUoKHZhbCAtIHRoaXMuZ2V0KCdtaW4nKSkgLyAodGhpcy5nZXQoJ21heCcpIC0gdGhpcy5nZXQoJ21pbicpKSk7XG4gICAgfVxuICAgIHNldERlbHRhVmFsdWUodmFsKSB7XG4gICAgICB0aGlzLnNldERlbHRhVW5pdFZhbHVlKHZhbCAvICh0aGlzLmdldCgnbWF4JykgLSB0aGlzLmdldCgnbWluJykpKTtcbiAgICB9XG5cbiAgICBzZXRVbml0VmFsdWUodmFsKSB7XG4gICAgICB2YWwgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB2YWwpKVxuICAgICAgY29uc3Qgc3RlcHMgPSB0aGlzLmdldCgnc3RlcHMnKVxuICAgICAgaWYgKHN0ZXBzID4gMSkge1xuICAgICAgICB2YWwgPSBNYXRoLnJvdW5kKHZhbCAqIHN0ZXBzKSAvIHN0ZXBzXG4gICAgICB9XG4gICAgICB0aGlzLnNldCgndW5pdFZhbHVlJywgdmFsKTtcbiAgICAgIGlmICh2YWwgPCB0aGlzLmdldCgnZGVsdGFVbml0VmFsdWUnKSkge1xuICAgICAgICB0aGlzLnNldCgnZGVsdGFVbml0VmFsdWUnLCB2YWwpO1xuICAgICAgfVxuICAgICAgaWYgKCgxIC0gdmFsKSA8IHRoaXMuZ2V0KCdkZWx0YVVuaXRWYWx1ZScpKSB7XG4gICAgICAgIHRoaXMuc2V0KCdkZWx0YVVuaXRWYWx1ZScsIDEgLSB2YWwpO1xuICAgICAgfVxuICAgICAgdGhpcy5fdXBkYXRlVmFsdWUoKTtcbiAgICB9XG4gICAgc2V0RGVsdGFVbml0VmFsdWUodmFsKSB7XG4gICAgICB2YWwgPSBNYXRoLm1pbih0aGlzLmdldCgndW5pdFZhbHVlJyksIDEgLSB0aGlzLmdldCgndW5pdFZhbHVlJyksIHZhbClcbiAgICAgIGNvbnN0IHN0ZXBzID0gdGhpcy5nZXQoJ3N0ZXBzJylcbiAgICAgIGlmIChzdGVwcyA+IDEpIHtcbiAgICAgICAgdmFsID0gTWF0aC5yb3VuZCh2YWwgKiBzdGVwcykgLyBzdGVwcztcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0KCdkZWx0YVVuaXRWYWx1ZScsIHZhbCk7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuICAgIH1cblxuICAgIF91cGRhdGVWYWx1ZSgpIHtcbiAgICAgIGNvbnN0IG1heCA9IHRoaXMuZ2V0KCdtYXgnKSxcbiAgICAgICAgbWluID0gdGhpcy5nZXQoJ21pbicpLFxuICAgICAgICBzdGVwcyA9IHRoaXMuZ2V0KCdzdGVwcycpO1xuICAgICAgbGV0IHY7XG4gICAgICBpZiAoc3RlcHMgPiAxKSB7XG4gICAgICAgIGNvbnN0IHN0ZXBTaXplID0gKG1heCAtIG1pbikgLyBzdGVwcztcbiAgICAgICAgbGV0IGV4cCA9IHN0ZXBTaXplLnRvRXhwb25lbnRpYWwoKS5zcGxpdCgnZScpO1xuICAgICAgICBleHAgPSBleHBbMV0gPyArZXhwWzFdIDogMDtcbiAgICAgICAgdiA9IHtcbiAgICAgICAgICBiYXNlOiBVdGlscy5yb3VuZERlY2ltYWwodGhpcy5nZXQoJ3VuaXRWYWx1ZScpICogc3RlcHMgKiBzdGVwU2l6ZSArIG1pbiwgZXhwKSxcbiAgICAgICAgICBkZWx0YTogVXRpbHMucm91bmREZWNpbWFsKHRoaXMuZ2V0KCdkZWx0YVVuaXRWYWx1ZScpICogc3RlcHMgKiBzdGVwU2l6ZSwgZXhwKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2ID0ge1xuICAgICAgICAgIGJhc2U6IHRoaXMuZ2V0KCd1bml0VmFsdWUnKSAqIChtYXggLSBtaW4pICsgbWluLFxuICAgICAgICAgIGRlbHRhOiB0aGlzLmdldCgnZGVsdGFVbml0VmFsdWUnKSAqIChtYXggLSBtaW4pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIHYpO1xuICAgIH1cbiAgfVxufSk7Il19
