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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvcm93L2ZpZWxkLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJGaWVsZEdyb3VwIiwiU2VsZWN0RmllbGQiLCJOdW1iZXJGaWVsZCIsIlZpZXciLCJVdGlscyIsInNldHRpbmdzIiwidmlld0NsYXNzIiwibW9kZWxEYXRhIiwidmFsdWUiLCJlbnN1cmVEZWZhdWx0cyIsImZpZWxkcyIsImNyZWF0ZSIsImlkIiwib3B0aW9ucyIsImRlZmF1bHRWYWx1ZSIsImxlZnQiLCJ0b3AiLCJib3R0b20iLCJyaWdodCIsIm1pbiIsImNoYW5nZUV2ZW50cyIsImR1cmF0aW9uIiwidmFsIiwiZm9yRWFjaCIsImtleSIsInBhcnNlRmxvYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxhQUFhRCxRQUFRLHNDQUFSLENBQW5CO0FBQUEsTUFDRUUsY0FBY0YsUUFBUSxrQ0FBUixDQURoQjtBQUFBLE1BRUVHLGNBQWNILFFBQVEsa0NBQVIsQ0FGaEI7QUFBQSxNQUdFSSxPQUFPSixRQUFRLFFBQVIsQ0FIVDtBQUFBLE1BSUVLLFFBQVFMLFFBQVEsaUJBQVIsQ0FKVjs7QUFPQTtBQUFBOztBQUNFLDJCQUFZTSxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxTQUFULEdBQXFCRCxTQUFTQyxTQUFULElBQXNCSCxJQUEzQztBQUNBRSxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCLEVBQTNDO0FBQ0FGLGVBQVNFLFNBQVQsQ0FBbUJDLEtBQW5CLEdBQTJCSCxTQUFTRSxTQUFULENBQW1CQyxLQUFuQixJQUE0QixFQUF2RDtBQUNBSCxlQUFTRSxTQUFULEdBQXFCSCxNQUFNSyxjQUFOLENBQXFCSixTQUFTRSxTQUE5QixFQUF5QztBQUM1REcsZ0JBQVEsQ0FBQ1QsWUFBWVUsTUFBWixDQUFtQjtBQUMxQkMsY0FBSSxNQURzQjtBQUUxQkMsbUJBQVM7QUFDUCxlQUFHLENBREk7QUFFUCxnQkFBSSxFQUZHO0FBR1AsZ0JBQUksRUFIRztBQUlQLGdCQUFJLEVBSkc7QUFLUCxpQkFBSztBQUxFLFdBRmlCO0FBUzFCQyx3QkFBYyxDQVRZO0FBVTFCTixpQkFBT0gsU0FBU0UsU0FBVCxDQUFtQkMsS0FBbkIsQ0FBeUJPO0FBVk4sU0FBbkIsQ0FBRCxFQVdKZCxZQUFZVSxNQUFaLENBQW1CO0FBQ3JCQyxjQUFJLEtBRGlCO0FBRXJCQyxtQkFBUztBQUNQLGVBQUcsQ0FESTtBQUVQLGdCQUFJLEVBRkc7QUFHUCxnQkFBSSxFQUhHO0FBSVAsZ0JBQUksRUFKRztBQUtQLGlCQUFLO0FBTEUsV0FGWTtBQVNyQkMsd0JBQWMsQ0FUTztBQVVyQk4saUJBQU9ILFNBQVNFLFNBQVQsQ0FBbUJDLEtBQW5CLENBQXlCUTtBQVZYLFNBQW5CLENBWEksRUFzQkpmLFlBQVlVLE1BQVosQ0FBbUI7QUFDckJDLGNBQUksUUFEaUI7QUFFckJDLG1CQUFTO0FBQ1AsZUFBRyxDQURJO0FBRVAsZ0JBQUksRUFGRztBQUdQLGdCQUFJLEVBSEc7QUFJUCxnQkFBSSxFQUpHO0FBS1AsaUJBQUs7QUFMRSxXQUZZO0FBU3JCQyx3QkFBYyxDQVRPO0FBVXJCTixpQkFBT0gsU0FBU0UsU0FBVCxDQUFtQkMsS0FBbkIsQ0FBeUJTO0FBVlgsU0FBbkIsQ0F0QkksRUFpQ0poQixZQUFZVSxNQUFaLENBQW1CO0FBQ3JCQyxjQUFJLE9BRGlCO0FBRXJCQyxtQkFBUztBQUNQLGVBQUcsQ0FESTtBQUVQLGdCQUFJLEVBRkc7QUFHUCxnQkFBSSxFQUhHO0FBSVAsZ0JBQUksRUFKRztBQUtQLGlCQUFLO0FBTEUsV0FGWTtBQVNyQkMsd0JBQWMsQ0FUTztBQVVyQk4saUJBQU9ILFNBQVNFLFNBQVQsQ0FBbUJDLEtBQW5CLENBQXlCVTtBQVZYLFNBQW5CLENBakNJLEVBNENIaEIsWUFBWVMsTUFBWixDQUFtQjtBQUN0QkMsY0FBSSxVQURrQjtBQUV0Qk8sZUFBSyxDQUZpQjtBQUd0QkMsd0JBQWMsYUFIUTtBQUl0Qk4sd0JBQWMsQ0FKUTtBQUt0Qk4saUJBQU9ILFNBQVNFLFNBQVQsQ0FBbUJDLEtBQW5CLENBQXlCYTtBQUxWLFNBQW5CLENBNUNHO0FBRG9ELE9BQXpDLENBQXJCO0FBSm9CLDJIQXlEZGhCLFFBekRjO0FBMERyQjs7QUEzREg7QUFBQTtBQUFBLDhCQTZEVTtBQUNOLFlBQUlpQix5SEFBSjtBQUNBLFNBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsUUFBaEIsRUFBMEIsT0FBMUIsRUFBbUMsVUFBbkMsRUFBK0NDLE9BQS9DLENBQXVELFVBQUNDLEdBQUQsRUFBUztBQUM5REYsY0FBSUUsR0FBSixJQUFXQyxXQUFXSCxJQUFJRSxHQUFKLENBQVgsQ0FBWDtBQUNELFNBRkQ7QUFHQSxlQUFPRixHQUFQO0FBQ0Q7QUFuRUg7O0FBQUE7QUFBQSxJQUFtQ3RCLFVBQW5DO0FBcUVELENBN0VEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvcm93L2ZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEZpZWxkR3JvdXAgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL2ZpZWxkZ3JvdXAnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJyksXG4gICAgTnVtYmVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9udW1iZXJmaWVsZC9maWVsZCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgRXhwZXJpbWVudFJvdyBleHRlbmRzIEZpZWxkR3JvdXAge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YSA9IHNldHRpbmdzLm1vZGVsRGF0YSB8fCB7fTtcbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YS52YWx1ZSA9IHNldHRpbmdzLm1vZGVsRGF0YS52YWx1ZSB8fCB7fTtcbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YSA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKHNldHRpbmdzLm1vZGVsRGF0YSwge1xuICAgICAgICBmaWVsZHM6IFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgIGlkOiBcImxlZnRcIixcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAwOiAwLFxuICAgICAgICAgICAgMjU6IDI1LFxuICAgICAgICAgICAgNTA6IDUwLFxuICAgICAgICAgICAgNzU6IDc1LFxuICAgICAgICAgICAgMTAwOiAxMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICAgICAgICB2YWx1ZTogc2V0dGluZ3MubW9kZWxEYXRhLnZhbHVlLmxlZnRcbiAgICAgICAgfSksIFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6IFwidG9wXCIsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgMDogMCxcbiAgICAgICAgICAgIDI1OiAyNSxcbiAgICAgICAgICAgIDUwOiA1MCxcbiAgICAgICAgICAgIDc1OiA3NSxcbiAgICAgICAgICAgIDEwMDogMTAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgICAgICAgdmFsdWU6IHNldHRpbmdzLm1vZGVsRGF0YS52YWx1ZS50b3BcbiAgICAgICAgfSksIFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6IFwiYm90dG9tXCIsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgMDogMCxcbiAgICAgICAgICAgIDI1OiAyNSxcbiAgICAgICAgICAgIDUwOiA1MCxcbiAgICAgICAgICAgIDc1OiA3NSxcbiAgICAgICAgICAgIDEwMDogMTAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgICAgICAgdmFsdWU6IHNldHRpbmdzLm1vZGVsRGF0YS52YWx1ZS5ib3R0b21cbiAgICAgICAgfSksIFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6IFwicmlnaHRcIixcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAwOiAwLFxuICAgICAgICAgICAgMjU6IDI1LFxuICAgICAgICAgICAgNTA6IDUwLFxuICAgICAgICAgICAgNzU6IDc1LFxuICAgICAgICAgICAgMTAwOiAxMDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogMCxcbiAgICAgICAgICB2YWx1ZTogc2V0dGluZ3MubW9kZWxEYXRhLnZhbHVlLnJpZ2h0XG4gICAgICAgIH0pICwgTnVtYmVyRmllbGQuY3JlYXRlKHtcbiAgICAgICAgICBpZDogJ2R1cmF0aW9uJywgXG4gICAgICAgICAgbWluOiAwLFxuICAgICAgICAgIGNoYW5nZUV2ZW50czogJ2NoYW5nZSBibHVyJyxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6IDAsXG4gICAgICAgICAgdmFsdWU6IHNldHRpbmdzLm1vZGVsRGF0YS52YWx1ZS5kdXJhdGlvblxuICAgICAgICB9KV1cbiAgICAgIH0pO1xuICAgICAgc3VwZXIoc2V0dGluZ3MpXG4gICAgfVxuXG4gICAgdmFsdWUoKSB7XG4gICAgICBsZXQgdmFsID0gc3VwZXIudmFsdWUoKTtcbiAgICAgIFsnbGVmdCcsICd0b3AnLCAnYm90dG9tJywgJ3JpZ2h0JywgJ2R1cmF0aW9uJ10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIHZhbFtrZXldID0gcGFyc2VGbG9hdCh2YWxba2V5XSk7XG4gICAgICB9KVxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gIH1cbn0pIl19
