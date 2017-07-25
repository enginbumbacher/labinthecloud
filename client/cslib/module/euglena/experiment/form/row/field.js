'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FieldGroup = require('core/component/fieldgroup/fieldgroup'),
      SelectField = require('core/component/selectfield/field'),
      NumberField = require('core/component/numberfield/field'),
      View = require('./view'),
      Utils = require('core/util/utils');

  return function (_FieldGroup) {
    _inherits(ExperimentRow, _FieldGroup);

    function ExperimentRow(settings) {
      _classCallCheck(this, ExperimentRow);

      settings.viewClass = settings.viewClass || View;
      settings.modelData = settings.modelData || {};
      settings.modelData.value = settings.modelData.value || {};
      settings.modelData = Utils.ensureDefaults(settings.modelData, {
        fields: [SelectField.create({
          id: "left",
          options: {
            0: 0,
            25: 25,
            50: 50,
            75: 75,
            100: 100
          },
          defaultValue: 0,
          value: settings.modelData.value.left
        }), SelectField.create({
          id: "top",
          options: {
            0: 0,
            25: 25,
            50: 50,
            75: 75,
            100: 100
          },
          defaultValue: 0,
          value: settings.modelData.value.top
        }), SelectField.create({
          id: "bottom",
          options: {
            0: 0,
            25: 25,
            50: 50,
            75: 75,
            100: 100
          },
          defaultValue: 0,
          value: settings.modelData.value.bottom
        }), SelectField.create({
          id: "right",
          options: {
            0: 0,
            25: 25,
            50: 50,
            75: 75,
            100: 100
          },
          defaultValue: 0,
          value: settings.modelData.value.right
        }), NumberField.create({
          id: 'duration',
          min: 0,
          changeEvents: 'change blur',
          defaultValue: 0,
          value: settings.modelData.value.duration
        })]
      });
      return _possibleConstructorReturn(this, (ExperimentRow.__proto__ || Object.getPrototypeOf(ExperimentRow)).call(this, settings));
    }

    _createClass(ExperimentRow, [{
      key: 'value',
      value: function value() {
        var val = _get(ExperimentRow.prototype.__proto__ || Object.getPrototypeOf(ExperimentRow.prototype), 'value', this).call(this);
        ['left', 'top', 'bottom', 'right', 'duration'].forEach(function (key) {
          val[key] = parseFloat(val[key]);
        });
        return val;
      }
    }]);

    return ExperimentRow;
  }(FieldGroup);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9yb3cvZmllbGQuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkZpZWxkR3JvdXAiLCJTZWxlY3RGaWVsZCIsIk51bWJlckZpZWxkIiwiVmlldyIsIlV0aWxzIiwic2V0dGluZ3MiLCJ2aWV3Q2xhc3MiLCJtb2RlbERhdGEiLCJ2YWx1ZSIsImVuc3VyZURlZmF1bHRzIiwiZmllbGRzIiwiY3JlYXRlIiwiaWQiLCJvcHRpb25zIiwiZGVmYXVsdFZhbHVlIiwibGVmdCIsInRvcCIsImJvdHRvbSIsInJpZ2h0IiwibWluIiwiY2hhbmdlRXZlbnRzIiwiZHVyYXRpb24iLCJ2YWwiLCJmb3JFYWNoIiwia2V5IiwicGFyc2VGbG9hdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGFBQWFELFFBQVEsc0NBQVIsQ0FBbkI7QUFBQSxNQUNFRSxjQUFjRixRQUFRLGtDQUFSLENBRGhCO0FBQUEsTUFFRUcsY0FBY0gsUUFBUSxrQ0FBUixDQUZoQjtBQUFBLE1BR0VJLE9BQU9KLFFBQVEsUUFBUixDQUhUO0FBQUEsTUFJRUssUUFBUUwsUUFBUSxpQkFBUixDQUpWOztBQU9BO0FBQUE7O0FBQ0UsMkJBQVlNLFFBQVosRUFBc0I7QUFBQTs7QUFDcEJBLGVBQVNDLFNBQVQsR0FBcUJELFNBQVNDLFNBQVQsSUFBc0JILElBQTNDO0FBQ0FFLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0IsRUFBM0M7QUFDQUYsZUFBU0UsU0FBVCxDQUFtQkMsS0FBbkIsR0FBMkJILFNBQVNFLFNBQVQsQ0FBbUJDLEtBQW5CLElBQTRCLEVBQXZEO0FBQ0FILGVBQVNFLFNBQVQsR0FBcUJILE1BQU1LLGNBQU4sQ0FBcUJKLFNBQVNFLFNBQTlCLEVBQXlDO0FBQzVERyxnQkFBUSxDQUFDVCxZQUFZVSxNQUFaLENBQW1CO0FBQzFCQyxjQUFJLE1BRHNCO0FBRTFCQyxtQkFBUztBQUNQLGVBQUcsQ0FESTtBQUVQLGdCQUFJLEVBRkc7QUFHUCxnQkFBSSxFQUhHO0FBSVAsZ0JBQUksRUFKRztBQUtQLGlCQUFLO0FBTEUsV0FGaUI7QUFTMUJDLHdCQUFjLENBVFk7QUFVMUJOLGlCQUFPSCxTQUFTRSxTQUFULENBQW1CQyxLQUFuQixDQUF5Qk87QUFWTixTQUFuQixDQUFELEVBV0pkLFlBQVlVLE1BQVosQ0FBbUI7QUFDckJDLGNBQUksS0FEaUI7QUFFckJDLG1CQUFTO0FBQ1AsZUFBRyxDQURJO0FBRVAsZ0JBQUksRUFGRztBQUdQLGdCQUFJLEVBSEc7QUFJUCxnQkFBSSxFQUpHO0FBS1AsaUJBQUs7QUFMRSxXQUZZO0FBU3JCQyx3QkFBYyxDQVRPO0FBVXJCTixpQkFBT0gsU0FBU0UsU0FBVCxDQUFtQkMsS0FBbkIsQ0FBeUJRO0FBVlgsU0FBbkIsQ0FYSSxFQXNCSmYsWUFBWVUsTUFBWixDQUFtQjtBQUNyQkMsY0FBSSxRQURpQjtBQUVyQkMsbUJBQVM7QUFDUCxlQUFHLENBREk7QUFFUCxnQkFBSSxFQUZHO0FBR1AsZ0JBQUksRUFIRztBQUlQLGdCQUFJLEVBSkc7QUFLUCxpQkFBSztBQUxFLFdBRlk7QUFTckJDLHdCQUFjLENBVE87QUFVckJOLGlCQUFPSCxTQUFTRSxTQUFULENBQW1CQyxLQUFuQixDQUF5QlM7QUFWWCxTQUFuQixDQXRCSSxFQWlDSmhCLFlBQVlVLE1BQVosQ0FBbUI7QUFDckJDLGNBQUksT0FEaUI7QUFFckJDLG1CQUFTO0FBQ1AsZUFBRyxDQURJO0FBRVAsZ0JBQUksRUFGRztBQUdQLGdCQUFJLEVBSEc7QUFJUCxnQkFBSSxFQUpHO0FBS1AsaUJBQUs7QUFMRSxXQUZZO0FBU3JCQyx3QkFBYyxDQVRPO0FBVXJCTixpQkFBT0gsU0FBU0UsU0FBVCxDQUFtQkMsS0FBbkIsQ0FBeUJVO0FBVlgsU0FBbkIsQ0FqQ0ksRUE0Q0hoQixZQUFZUyxNQUFaLENBQW1CO0FBQ3RCQyxjQUFJLFVBRGtCO0FBRXRCTyxlQUFLLENBRmlCO0FBR3RCQyx3QkFBYyxhQUhRO0FBSXRCTix3QkFBYyxDQUpRO0FBS3RCTixpQkFBT0gsU0FBU0UsU0FBVCxDQUFtQkMsS0FBbkIsQ0FBeUJhO0FBTFYsU0FBbkIsQ0E1Q0c7QUFEb0QsT0FBekMsQ0FBckI7QUFKb0IsMkhBeURkaEIsUUF6RGM7QUEwRHJCOztBQTNESDtBQUFBO0FBQUEsOEJBNkRVO0FBQ04sWUFBSWlCLHlIQUFKO0FBQ0EsU0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixRQUFoQixFQUEwQixPQUExQixFQUFtQyxVQUFuQyxFQUErQ0MsT0FBL0MsQ0FBdUQsVUFBQ0MsR0FBRCxFQUFTO0FBQzlERixjQUFJRSxHQUFKLElBQVdDLFdBQVdILElBQUlFLEdBQUosQ0FBWCxDQUFYO0FBQ0QsU0FGRDtBQUdBLGVBQU9GLEdBQVA7QUFDRDtBQW5FSDs7QUFBQTtBQUFBLElBQW1DdEIsVUFBbkM7QUFxRUQsQ0E3RUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtL3Jvdy9maWVsZC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
