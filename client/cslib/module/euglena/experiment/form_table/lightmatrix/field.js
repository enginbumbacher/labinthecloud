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

      var _this = _possibleConstructorReturn(this, (LightMatrixField.__proto__ || Object.getPrototypeOf(LightMatrixField)).call(this, config));

      Utils.bindMethods(_this, ['_onModelChange']);
      return _this;
    }

    _createClass(LightMatrixField, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(LightMatrixField.prototype.__proto__ || Object.getPrototypeOf(LightMatrixField.prototype), '_onModelChange', this).call(this, evt);
        var total = this.value().map(function (field) {
          return field.duration ? field.duration : 0;
        }).reduce(function (prev, curr, currInd, arr) {
          return prev + curr;
        }, 0);
        this.view().updateTotals(total, Globals.get('AppConfig.experiment.maxDuration') - total);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV90YWJsZS9saWdodG1hdHJpeC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTXVsdGlGaWVsZCIsIlZpZXciLCJMaWdodFJvdyIsIlV0aWxzIiwiR2xvYmFscyIsImRlZmF1bHRzIiwiY2hpbGRDbGFzcyIsImNoaWxkU2V0dGluZ3MiLCJ2YWx1ZSIsInRvcCIsImxlZnQiLCJib3R0b20iLCJyaWdodCIsImR1cmF0aW9uIiwibWluIiwic29ydGFibGUiLCJhZGRCdXR0b25MYWJlbCIsIkxpZ2h0TWF0cml4RmllbGQiLCJjb25maWciLCJtb2RlbERhdGEiLCJlbnN1cmVEZWZhdWx0cyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiZXZ0IiwidG90YWwiLCJtYXAiLCJmaWVsZCIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwiY3VyckluZCIsImFyciIsInZpZXciLCJ1cGRhdGVUb3RhbHMiLCJnZXQiLCJjcmVhdGUiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsYUFBYUQsUUFBUSxpQ0FBUixDQUFuQjtBQUFBLE1BQ0VFLE9BQU9GLFFBQVEsUUFBUixDQURUO0FBQUEsTUFFRUcsV0FBV0gsUUFBUSxjQUFSLENBRmI7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7QUFBQSxNQUlFSyxVQUFVTCxRQUFRLG9CQUFSLENBSlo7QUFBQSxNQU1FTSxXQUFXO0FBQ1RDLGdCQUFZSixRQURIO0FBRVRLLG1CQUFlO0FBQ2JDLGFBQU87QUFDTEMsYUFBSyxDQURBO0FBRUxDLGNBQU0sQ0FGRDtBQUdMQyxnQkFBUSxDQUhIO0FBSUxDLGVBQU8sQ0FKRjtBQUtMQyxrQkFBVTtBQUxMO0FBRE0sS0FGTjtBQVdUQyxTQUFLLENBWEk7QUFZVEMsY0FBVSxLQVpEO0FBYVRDLG9CQUFnQjtBQWJQLEdBTmI7O0FBRGtCLE1Bd0JaQyxnQkF4Qlk7QUFBQTs7QUF5QmhCLDhCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPQyxTQUFQLEdBQW1CaEIsTUFBTWlCLGNBQU4sQ0FBcUJGLE9BQU9DLFNBQTVCLEVBQXVDZCxRQUF2QyxDQUFuQjtBQUNBYSxhQUFPRyxTQUFQLEdBQW1CSCxPQUFPRyxTQUFQLElBQW9CcEIsSUFBdkM7O0FBRmtCLHNJQUdaaUIsTUFIWTs7QUFJbEJmLFlBQU1tQixXQUFOLFFBQXdCLENBQUMsZ0JBQUQsQ0FBeEI7QUFKa0I7QUFLbkI7O0FBOUJlO0FBQUE7QUFBQSxxQ0FnQ0RDLEdBaENDLEVBZ0NJO0FBQ2xCLDJJQUFxQkEsR0FBckI7QUFDQSxZQUFJQyxRQUFRLEtBQUtoQixLQUFMLEdBQWFpQixHQUFiLENBQWlCLFVBQUNDLEtBQUQ7QUFBQSxpQkFBV0EsTUFBTWIsUUFBTixHQUFpQmEsTUFBTWIsUUFBdkIsR0FBa0MsQ0FBN0M7QUFBQSxTQUFqQixFQUFpRWMsTUFBakUsQ0FBd0UsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWFDLE9BQWIsRUFBc0JDLEdBQXRCO0FBQUEsaUJBQThCSCxPQUFPQyxJQUFyQztBQUFBLFNBQXhFLEVBQW1ILENBQW5ILENBQVo7QUFDQSxhQUFLRyxJQUFMLEdBQVlDLFlBQVosQ0FBeUJULEtBQXpCLEVBQWdDcEIsUUFBUThCLEdBQVIsQ0FBWSxrQ0FBWixJQUFrRFYsS0FBbEY7QUFDRDtBQXBDZTs7QUFBQTtBQUFBLElBd0JheEIsVUF4QmI7O0FBdUNsQmlCLG1CQUFpQmtCLE1BQWpCLEdBQTBCLFVBQUNDLElBQUQsRUFBVTtBQUNsQyxXQUFPLElBQUluQixnQkFBSixDQUFxQjtBQUMxQkUsaUJBQVdpQjtBQURlLEtBQXJCLENBQVA7QUFHRCxHQUpEO0FBS0EsU0FBT25CLGdCQUFQO0FBQ0QsQ0E3Q0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtX3RhYmxlL2xpZ2h0bWF0cml4L2ZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE11bHRpRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIExpZ2h0Um93ID0gcmVxdWlyZSgnLi4vcm93L2ZpZWxkJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG5cbiAgICBkZWZhdWx0cyA9IHtcbiAgICAgIGNoaWxkQ2xhc3M6IExpZ2h0Um93LFxuICAgICAgY2hpbGRTZXR0aW5nczoge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICBkdXJhdGlvbjogNVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWluOiAxLFxuICAgICAgc29ydGFibGU6IGZhbHNlLFxuICAgICAgYWRkQnV0dG9uTGFiZWw6IFwiK1wiXG4gICAgfVxuICA7XG5cbiAgY2xhc3MgTGlnaHRNYXRyaXhGaWVsZCBleHRlbmRzIE11bHRpRmllbGQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgY29uZmlnLm1vZGVsRGF0YSA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5tb2RlbERhdGEsIGRlZmF1bHRzKTtcbiAgICAgIGNvbmZpZy52aWV3Q2xhc3MgPSBjb25maWcudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihjb25maWcpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Nb2RlbENoYW5nZSddKTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN1cGVyLl9vbk1vZGVsQ2hhbmdlKGV2dCk7XG4gICAgICB2YXIgdG90YWwgPSB0aGlzLnZhbHVlKCkubWFwKChmaWVsZCkgPT4gZmllbGQuZHVyYXRpb24gPyBmaWVsZC5kdXJhdGlvbiA6IDApLnJlZHVjZSgocHJldiwgY3VyciwgY3VyckluZCwgYXJyKSA9PiBwcmV2ICsgY3VyciwgMCk7XG4gICAgICB0aGlzLnZpZXcoKS51cGRhdGVUb3RhbHModG90YWwsIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpIC0gdG90YWwpO1xuICAgIH1cbiAgfVxuXG4gIExpZ2h0TWF0cml4RmllbGQuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IExpZ2h0TWF0cml4RmllbGQoe1xuICAgICAgbW9kZWxEYXRhOiBkYXRhXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIExpZ2h0TWF0cml4RmllbGQ7XG59KSJdfQ==
