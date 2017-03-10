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
      return _possibleConstructorReturn(this, Object.getPrototypeOf(ExperimentRow).call(this, settings));
    }

    _createClass(ExperimentRow, [{
      key: 'value',
      value: function value() {
        var val = _get(Object.getPrototypeOf(ExperimentRow.prototype), 'value', this).call(this);
        ['left', 'top', 'bottom', 'right', 'duration'].forEach(function (key) {
          val[key] = parseFloat(val[key]);
        });
        return val;
      }
    }]);

    return ExperimentRow;
  }(FieldGroup);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9yb3cvZmllbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLGFBQWEsUUFBUSxzQ0FBUixDQUFuQjtBQUFBLE1BQ0UsY0FBYyxRQUFRLGtDQUFSLENBRGhCO0FBQUEsTUFFRSxjQUFjLFFBQVEsa0NBQVIsQ0FGaEI7QUFBQSxNQUdFLE9BQU8sUUFBUSxRQUFSLENBSFQ7QUFBQSxNQUlFLFFBQVEsUUFBUSxpQkFBUixDQUpWOztBQU9BO0FBQUE7O0FBQ0UsMkJBQVksUUFBWixFQUFzQjtBQUFBOztBQUNwQixlQUFTLFNBQVQsR0FBcUIsU0FBUyxTQUFULElBQXNCLElBQTNDO0FBQ0EsZUFBUyxTQUFULEdBQXFCLE1BQU0sY0FBTixDQUFxQixTQUFTLFNBQTlCLEVBQXlDO0FBQzVELGdCQUFRLENBQUMsWUFBWSxNQUFaLENBQW1CO0FBQzFCLGNBQUksTUFEc0I7QUFFMUIsbUJBQVM7QUFDUCxlQUFHLENBREk7QUFFUCxnQkFBSSxFQUZHO0FBR1AsZ0JBQUksRUFIRztBQUlQLGdCQUFJLEVBSkc7QUFLUCxpQkFBSztBQUxFLFdBRmlCO0FBUzFCLHdCQUFjLENBVFk7QUFVMUIsaUJBQU8sU0FBUyxTQUFULENBQW1CLEtBQW5CLENBQXlCO0FBVk4sU0FBbkIsQ0FBRCxFQVdKLFlBQVksTUFBWixDQUFtQjtBQUNyQixjQUFJLEtBRGlCO0FBRXJCLG1CQUFTO0FBQ1AsZUFBRyxDQURJO0FBRVAsZ0JBQUksRUFGRztBQUdQLGdCQUFJLEVBSEc7QUFJUCxnQkFBSSxFQUpHO0FBS1AsaUJBQUs7QUFMRSxXQUZZO0FBU3JCLHdCQUFjLENBVE87QUFVckIsaUJBQU8sU0FBUyxTQUFULENBQW1CLEtBQW5CLENBQXlCO0FBVlgsU0FBbkIsQ0FYSSxFQXNCSixZQUFZLE1BQVosQ0FBbUI7QUFDckIsY0FBSSxRQURpQjtBQUVyQixtQkFBUztBQUNQLGVBQUcsQ0FESTtBQUVQLGdCQUFJLEVBRkc7QUFHUCxnQkFBSSxFQUhHO0FBSVAsZ0JBQUksRUFKRztBQUtQLGlCQUFLO0FBTEUsV0FGWTtBQVNyQix3QkFBYyxDQVRPO0FBVXJCLGlCQUFPLFNBQVMsU0FBVCxDQUFtQixLQUFuQixDQUF5QjtBQVZYLFNBQW5CLENBdEJJLEVBaUNKLFlBQVksTUFBWixDQUFtQjtBQUNyQixjQUFJLE9BRGlCO0FBRXJCLG1CQUFTO0FBQ1AsZUFBRyxDQURJO0FBRVAsZ0JBQUksRUFGRztBQUdQLGdCQUFJLEVBSEc7QUFJUCxnQkFBSSxFQUpHO0FBS1AsaUJBQUs7QUFMRSxXQUZZO0FBU3JCLHdCQUFjLENBVE87QUFVckIsaUJBQU8sU0FBUyxTQUFULENBQW1CLEtBQW5CLENBQXlCO0FBVlgsU0FBbkIsQ0FqQ0ksRUE0Q0gsWUFBWSxNQUFaLENBQW1CO0FBQ3RCLGNBQUksVUFEa0I7QUFFdEIsZUFBSyxDQUZpQjtBQUd0Qix3QkFBYyxhQUhRO0FBSXRCLHdCQUFjLENBSlE7QUFLdEIsaUJBQU8sU0FBUyxTQUFULENBQW1CLEtBQW5CLENBQXlCO0FBTFYsU0FBbkIsQ0E1Q0c7QUFEb0QsT0FBekMsQ0FBckI7QUFGb0IsOEZBdURkLFFBdkRjO0FBd0RyQjs7QUF6REg7QUFBQTtBQUFBLDhCQTJEVTtBQUNOLFlBQUksb0ZBQUo7QUFDQSxTQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLFFBQWhCLEVBQTBCLE9BQTFCLEVBQW1DLFVBQW5DLEVBQStDLE9BQS9DLENBQXVELFVBQUMsR0FBRCxFQUFTO0FBQzlELGNBQUksR0FBSixJQUFXLFdBQVcsSUFBSSxHQUFKLENBQVgsQ0FBWDtBQUNELFNBRkQ7QUFHQSxlQUFPLEdBQVA7QUFDRDtBQWpFSDs7QUFBQTtBQUFBLElBQW1DLFVBQW5DO0FBbUVELENBM0VEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9yb3cvZmllbGQuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
