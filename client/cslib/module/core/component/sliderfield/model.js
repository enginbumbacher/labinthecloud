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
    defaultValue: 0.5,
    unitValue: 0.5
  };

  return function (_FieldModel) {
    _inherits(SliderFieldModel, _FieldModel);

    function SliderFieldModel(config) {
      _classCallCheck(this, SliderFieldModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (SliderFieldModel.__proto__ || Object.getPrototypeOf(SliderFieldModel)).call(this, config));

      var min = _this.get('min'),
          max = _this.get('max');
      _this.set('unitValue', (_this.value() - min) / (max - min));
      return _this;
    }

    _createClass(SliderFieldModel, [{
      key: 'setValue',
      value: function setValue(val) {
        this.setUnitValue((val - this.get('min')) / (this.get('max') - this.get('min')));
      }
    }, {
      key: 'setUnitValue',
      value: function setUnitValue(val) {
        var steps = this.get('steps'),
            min = this.get('min'),
            max = this.get('max');
        val = Math.min(1, Math.max(0, val));
        if (steps > 1) {
          val = Math.round(val * steps) / steps;
        }
        this.set('unitValue', val);
        if (steps > 1) {
          var stepSize = (max - min) / steps;
          var exp = stepSize.toExponential().split('e');
          exp = exp[1] ? +exp[1] : 0;
          this.set('value', Utils.roundDecimal(this.get('unitValue') * steps * stepSize + min, exp));
        } else {
          this.set('value', this.get('unitValue') * (max - min) + min);
        }
      }
    }, {
      key: 'unitValue',
      value: function unitValue() {
        return this.get('unitValue');
      }
    }]);

    return SliderFieldModel;
  }(FieldModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGaWVsZE1vZGVsIiwiZGVmYXVsdHMiLCJtaW4iLCJtYXgiLCJzdGVwcyIsImRlZmF1bHRWYWx1ZSIsInVuaXRWYWx1ZSIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJ2YWwiLCJzZXRVbml0VmFsdWUiLCJNYXRoIiwicm91bmQiLCJzdGVwU2l6ZSIsImV4cCIsInRvRXhwb25lbnRpYWwiLCJzcGxpdCIsInJvdW5kRGVjaW1hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLGFBQWFKLFFBQVEsaUNBQVIsQ0FBbkI7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLFNBQUssQ0FESTtBQUVUQyxTQUFLLENBRkk7QUFHVEMsV0FBTyxDQUhFO0FBSVRDLGtCQUFjLEdBSkw7QUFLVEMsZUFBVztBQUxGLEdBRGI7O0FBU0E7QUFBQTs7QUFDRSw4QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT04sUUFBUCxHQUFrQkgsTUFBTVUsY0FBTixDQUFxQkQsT0FBT04sUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCOztBQURrQixzSUFFWk0sTUFGWTs7QUFJbEIsVUFBTUwsTUFBTSxNQUFLTyxHQUFMLENBQVMsS0FBVCxDQUFaO0FBQUEsVUFDRU4sTUFBTSxNQUFLTSxHQUFMLENBQVMsS0FBVCxDQURSO0FBRUEsWUFBS0MsR0FBTCxDQUFTLFdBQVQsRUFBc0IsQ0FBQyxNQUFLQyxLQUFMLEtBQWVULEdBQWhCLEtBQXdCQyxNQUFNRCxHQUE5QixDQUF0QjtBQU5rQjtBQU9uQjs7QUFSSDtBQUFBO0FBQUEsK0JBVVdVLEdBVlgsRUFVZ0I7QUFDWixhQUFLQyxZQUFMLENBQWtCLENBQUNELE1BQU0sS0FBS0gsR0FBTCxDQUFTLEtBQVQsQ0FBUCxLQUEyQixLQUFLQSxHQUFMLENBQVMsS0FBVCxJQUFrQixLQUFLQSxHQUFMLENBQVMsS0FBVCxDQUE3QyxDQUFsQjtBQUNEO0FBWkg7QUFBQTtBQUFBLG1DQWNlRyxHQWRmLEVBY29CO0FBQ2hCLFlBQU1SLFFBQVEsS0FBS0ssR0FBTCxDQUFTLE9BQVQsQ0FBZDtBQUFBLFlBQ0VQLE1BQU0sS0FBS08sR0FBTCxDQUFTLEtBQVQsQ0FEUjtBQUFBLFlBRUVOLE1BQU0sS0FBS00sR0FBTCxDQUFTLEtBQVQsQ0FGUjtBQUdBRyxjQUFNRSxLQUFLWixHQUFMLENBQVMsQ0FBVCxFQUFZWSxLQUFLWCxHQUFMLENBQVMsQ0FBVCxFQUFZUyxHQUFaLENBQVosQ0FBTjtBQUNBLFlBQUlSLFFBQVEsQ0FBWixFQUFlO0FBQ2JRLGdCQUFNRSxLQUFLQyxLQUFMLENBQVdILE1BQU1SLEtBQWpCLElBQTBCQSxLQUFoQztBQUNEO0FBQ0QsYUFBS00sR0FBTCxDQUFTLFdBQVQsRUFBc0JFLEdBQXRCO0FBQ0EsWUFBSVIsUUFBUSxDQUFaLEVBQWU7QUFDYixjQUFNWSxXQUFXLENBQUNiLE1BQU1ELEdBQVAsSUFBY0UsS0FBL0I7QUFDQSxjQUFJYSxNQUFNRCxTQUFTRSxhQUFULEdBQXlCQyxLQUF6QixDQUErQixHQUEvQixDQUFWO0FBQ0FGLGdCQUFNQSxJQUFJLENBQUosSUFBUyxDQUFDQSxJQUFJLENBQUosQ0FBVixHQUFtQixDQUF6QjtBQUNBLGVBQUtQLEdBQUwsQ0FBUyxPQUFULEVBQWtCWixNQUFNc0IsWUFBTixDQUFtQixLQUFLWCxHQUFMLENBQVMsV0FBVCxJQUF3QkwsS0FBeEIsR0FBZ0NZLFFBQWhDLEdBQTJDZCxHQUE5RCxFQUFtRWUsR0FBbkUsQ0FBbEI7QUFDRCxTQUxELE1BS087QUFDTCxlQUFLUCxHQUFMLENBQVMsT0FBVCxFQUFrQixLQUFLRCxHQUFMLENBQVMsV0FBVCxLQUF5Qk4sTUFBTUQsR0FBL0IsSUFBc0NBLEdBQXhEO0FBQ0Q7QUFDRjtBQS9CSDtBQUFBO0FBQUEsa0NBaUNjO0FBQ1YsZUFBTyxLQUFLTyxHQUFMLENBQVMsV0FBVCxDQUFQO0FBQ0Q7QUFuQ0g7O0FBQUE7QUFBQSxJQUFzQ1QsVUFBdEM7QUFxQ0QsQ0FuREQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3NsaWRlcmZpZWxkL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcbiAgXG4gIGNvbnN0IEZpZWxkTW9kZWwgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL21vZGVsJyksXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBtaW46IDAsXG4gICAgICBtYXg6IDEsXG4gICAgICBzdGVwczogMCxcbiAgICAgIGRlZmF1bHRWYWx1ZTogMC41LFxuICAgICAgdW5pdFZhbHVlOiAwLjVcbiAgICB9O1xuXG4gIHJldHVybiBjbGFzcyBTbGlkZXJGaWVsZE1vZGVsIGV4dGVuZHMgRmllbGRNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG5cbiAgICAgIGNvbnN0IG1pbiA9IHRoaXMuZ2V0KCdtaW4nKSxcbiAgICAgICAgbWF4ID0gdGhpcy5nZXQoJ21heCcpO1xuICAgICAgdGhpcy5zZXQoJ3VuaXRWYWx1ZScsICh0aGlzLnZhbHVlKCkgLSBtaW4pIC8gKG1heCAtIG1pbikpO1xuICAgIH1cblxuICAgIHNldFZhbHVlKHZhbCkge1xuICAgICAgdGhpcy5zZXRVbml0VmFsdWUoKHZhbCAtIHRoaXMuZ2V0KCdtaW4nKSkgLyAodGhpcy5nZXQoJ21heCcpIC0gdGhpcy5nZXQoJ21pbicpKSk7XG4gICAgfVxuXG4gICAgc2V0VW5pdFZhbHVlKHZhbCkge1xuICAgICAgY29uc3Qgc3RlcHMgPSB0aGlzLmdldCgnc3RlcHMnKSxcbiAgICAgICAgbWluID0gdGhpcy5nZXQoJ21pbicpLFxuICAgICAgICBtYXggPSB0aGlzLmdldCgnbWF4Jyk7XG4gICAgICB2YWwgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB2YWwpKTtcbiAgICAgIGlmIChzdGVwcyA+IDEpIHtcbiAgICAgICAgdmFsID0gTWF0aC5yb3VuZCh2YWwgKiBzdGVwcykgLyBzdGVwc1xuICAgICAgfVxuICAgICAgdGhpcy5zZXQoJ3VuaXRWYWx1ZScsIHZhbCk7XG4gICAgICBpZiAoc3RlcHMgPiAxKSB7XG4gICAgICAgIGNvbnN0IHN0ZXBTaXplID0gKG1heCAtIG1pbikgLyBzdGVwcztcbiAgICAgICAgbGV0IGV4cCA9IHN0ZXBTaXplLnRvRXhwb25lbnRpYWwoKS5zcGxpdCgnZScpO1xuICAgICAgICBleHAgPSBleHBbMV0gPyArZXhwWzFdIDogMDtcbiAgICAgICAgdGhpcy5zZXQoJ3ZhbHVlJywgVXRpbHMucm91bmREZWNpbWFsKHRoaXMuZ2V0KCd1bml0VmFsdWUnKSAqIHN0ZXBzICogc3RlcFNpemUgKyBtaW4sIGV4cCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXQoJ3ZhbHVlJywgdGhpcy5nZXQoJ3VuaXRWYWx1ZScpICogKG1heCAtIG1pbikgKyBtaW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHVuaXRWYWx1ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldCgndW5pdFZhbHVlJyk7XG4gICAgfVxuICB9XG59KSJdfQ==
