'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var MultiField = require('core/component/multifield/field'),
      View = require('./view'),
      LightRow = require('../row/field'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      defaults = {
    childClass: LightRow,
    childSettings: {
      value: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        duration: 5
      }
    },
    min: 1,
    sortable: false,
    addButtonLabel: "+"
  };

  var LightMatrixField = function (_MultiField) {
    _inherits(LightMatrixField, _MultiField);

    function LightMatrixField(config) {
      _classCallCheck(this, LightMatrixField);

      config.modelData = Utils.ensureDefaults(config.modelData, defaults);
      config.viewClass = config.viewClass || View;

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LightMatrixField).call(this, config));

      Utils.bindMethods(_this, ['_onModelChange']);
      return _this;
    }

    _createClass(LightMatrixField, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(Object.getPrototypeOf(LightMatrixField.prototype), '_onModelChange', this).call(this, evt);
        var total = this.value().map(function (field) {
          return field.duration ? field.duration : 0;
        }).reduce(function (prev, curr, currInd, arr) {
          return prev + curr;
        }, 0);
        this.view().updateTotals(total, Globals.get('AppConfig.experimentLength') - total);
      }
    }]);

    return LightMatrixField;
  }(MultiField);

  LightMatrixField.create = function (data) {
    return new LightMatrixField({
      modelData: data
    });
  };
  return LightMatrixField;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9saWdodG1hdHJpeC9maWVsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sYUFBYSxRQUFRLGlDQUFSLENBQW5CO0FBQUEsTUFDRSxPQUFPLFFBQVEsUUFBUixDQURUO0FBQUEsTUFFRSxXQUFXLFFBQVEsY0FBUixDQUZiO0FBQUEsTUFHRSxRQUFRLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BSUUsVUFBVSxRQUFRLG9CQUFSLENBSlo7QUFBQSxNQU1FLFdBQVc7QUFDVCxnQkFBWSxRQURIO0FBRVQsbUJBQWU7QUFDYixhQUFPO0FBQ0wsYUFBSyxDQURBO0FBRUwsY0FBTSxDQUZEO0FBR0wsZ0JBQVEsQ0FISDtBQUlMLGVBQU8sQ0FKRjtBQUtMLGtCQUFVO0FBTEw7QUFETSxLQUZOO0FBV1QsU0FBSyxDQVhJO0FBWVQsY0FBVSxLQVpEO0FBYVQsb0JBQWdCO0FBYlAsR0FOYjs7QUFEa0IsTUF3QlosZ0JBeEJZO0FBQUE7O0FBeUJoQiw4QkFBWSxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCLGFBQU8sU0FBUCxHQUFtQixNQUFNLGNBQU4sQ0FBcUIsT0FBTyxTQUE1QixFQUF1QyxRQUF2QyxDQUFuQjtBQUNBLGFBQU8sU0FBUCxHQUFtQixPQUFPLFNBQVAsSUFBb0IsSUFBdkM7O0FBRmtCLHNHQUdaLE1BSFk7O0FBSWxCLFlBQU0sV0FBTixRQUF3QixDQUFDLGdCQUFELENBQXhCO0FBSmtCO0FBS25COztBQTlCZTtBQUFBO0FBQUEscUNBZ0NELEdBaENDLEVBZ0NJO0FBQ2xCLG1HQUFxQixHQUFyQjtBQUNBLFlBQUksUUFBUSxLQUFLLEtBQUwsR0FBYSxHQUFiLENBQWlCLFVBQUMsS0FBRDtBQUFBLGlCQUFXLE1BQU0sUUFBTixHQUFpQixNQUFNLFFBQXZCLEdBQWtDLENBQTdDO0FBQUEsU0FBakIsRUFBaUUsTUFBakUsQ0FBd0UsVUFBQyxJQUFELEVBQU8sSUFBUCxFQUFhLE9BQWIsRUFBc0IsR0FBdEI7QUFBQSxpQkFBOEIsT0FBTyxJQUFyQztBQUFBLFNBQXhFLEVBQW1ILENBQW5ILENBQVo7QUFDQSxhQUFLLElBQUwsR0FBWSxZQUFaLENBQXlCLEtBQXpCLEVBQWdDLFFBQVEsR0FBUixDQUFZLDRCQUFaLElBQTRDLEtBQTVFO0FBQ0Q7QUFwQ2U7O0FBQUE7QUFBQSxJQXdCYSxVQXhCYjs7QUF1Q2xCLG1CQUFpQixNQUFqQixHQUEwQixVQUFDLElBQUQsRUFBVTtBQUNsQyxXQUFPLElBQUksZ0JBQUosQ0FBcUI7QUFDMUIsaUJBQVc7QUFEZSxLQUFyQixDQUFQO0FBR0QsR0FKRDtBQUtBLFNBQU8sZ0JBQVA7QUFDRCxDQTdDRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L2Zvcm0vbGlnaHRtYXRyaXgvZmllbGQuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
