'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseField = require('core/component/form/field/field'),
      Model = require('./model'),
      View = require('./view');

  var SelectField = function (_BaseField) {
    _inherits(SelectField, _BaseField);

    function SelectField() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, SelectField);

      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, (SelectField.__proto__ || Object.getPrototypeOf(SelectField)).call(this, settings));
    }

    _createClass(SelectField, [{
      key: 'addOption',
      value: function addOption(opt) {
        this._model.addOption(opt);
      }
    }, {
      key: 'removeOption',
      value: function removeOption(id) {
        this._model.removeOption(id);
      }
    }, {
      key: 'clearOptions',
      value: function clearOptions() {
        this._model.clearOptions();
      }
    }, {
      key: 'getOptions',
      value: function getOptions() {
        return this._model.get('options');
      }
    }, {
      key: 'getAbleOptions',
      value: function getAbleOptions() {
        return this._model.listAbleOptions();
      }
    }, {
      key: 'disableOption',
      value: function disableOption(id) {
        this._model.disableOption(id);
      }
    }, {
      key: 'enableOption',
      value: function enableOption(id) {
        this._model.enableOption(id);
      }
    }, {
      key: 'selectFirstAble',
      value: function selectFirstAble() {
        var able = this._model.listAbleOptions();
        if (!able.includes(this.value())) {
          this.setValue(able[0]);
        }
      }
    }]);

    return SelectField;
  }(BaseField);

  SelectField.create = function (data) {
    return new SelectField({ modelData: data });
  };

  return SelectField;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZUZpZWxkIiwiTW9kZWwiLCJWaWV3IiwiU2VsZWN0RmllbGQiLCJzZXR0aW5ncyIsInZpZXdDbGFzcyIsIm1vZGVsQ2xhc3MiLCJvcHQiLCJfbW9kZWwiLCJhZGRPcHRpb24iLCJpZCIsInJlbW92ZU9wdGlvbiIsImNsZWFyT3B0aW9ucyIsImdldCIsImxpc3RBYmxlT3B0aW9ucyIsImRpc2FibGVPcHRpb24iLCJlbmFibGVPcHRpb24iLCJhYmxlIiwiaW5jbHVkZXMiLCJ2YWx1ZSIsInNldFZhbHVlIiwiY3JlYXRlIiwiZGF0YSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLGlDQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDs7QUFEa0IsTUFLWkksV0FMWTtBQUFBOztBQU1oQiwyQkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxTQUFULEdBQXFCRCxTQUFTQyxTQUFULElBQXNCSCxJQUEzQztBQUNBRSxlQUFTRSxVQUFULEdBQXNCRixTQUFTRSxVQUFULElBQXVCTCxLQUE3QztBQUZ5Qix1SEFHbkJHLFFBSG1CO0FBSTFCOztBQVZlO0FBQUE7QUFBQSxnQ0FZTkcsR0FaTSxFQVlEO0FBQ2IsYUFBS0MsTUFBTCxDQUFZQyxTQUFaLENBQXNCRixHQUF0QjtBQUNEO0FBZGU7QUFBQTtBQUFBLG1DQWdCSEcsRUFoQkcsRUFnQkM7QUFDZixhQUFLRixNQUFMLENBQVlHLFlBQVosQ0FBeUJELEVBQXpCO0FBQ0Q7QUFsQmU7QUFBQTtBQUFBLHFDQW9CRDtBQUNiLGFBQUtGLE1BQUwsQ0FBWUksWUFBWjtBQUNEO0FBdEJlO0FBQUE7QUFBQSxtQ0F3Qkg7QUFDWCxlQUFPLEtBQUtKLE1BQUwsQ0FBWUssR0FBWixDQUFnQixTQUFoQixDQUFQO0FBQ0Q7QUExQmU7QUFBQTtBQUFBLHVDQTRCQztBQUNmLGVBQU8sS0FBS0wsTUFBTCxDQUFZTSxlQUFaLEVBQVA7QUFDRDtBQTlCZTtBQUFBO0FBQUEsb0NBZ0NGSixFQWhDRSxFQWdDRTtBQUNoQixhQUFLRixNQUFMLENBQVlPLGFBQVosQ0FBMEJMLEVBQTFCO0FBQ0Q7QUFsQ2U7QUFBQTtBQUFBLG1DQW9DSEEsRUFwQ0csRUFvQ0M7QUFDZixhQUFLRixNQUFMLENBQVlRLFlBQVosQ0FBeUJOLEVBQXpCO0FBQ0Q7QUF0Q2U7QUFBQTtBQUFBLHdDQXdDRTtBQUNoQixZQUFNTyxPQUFPLEtBQUtULE1BQUwsQ0FBWU0sZUFBWixFQUFiO0FBQ0EsWUFBSSxDQUFDRyxLQUFLQyxRQUFMLENBQWMsS0FBS0MsS0FBTCxFQUFkLENBQUwsRUFBa0M7QUFDaEMsZUFBS0MsUUFBTCxDQUFjSCxLQUFLLENBQUwsQ0FBZDtBQUNEO0FBQ0Y7QUE3Q2U7O0FBQUE7QUFBQSxJQUtRakIsU0FMUjs7QUFnRGxCRyxjQUFZa0IsTUFBWixHQUFxQixVQUFDQyxJQUFELEVBQVU7QUFDN0IsV0FBTyxJQUFJbkIsV0FBSixDQUFnQixFQUFFb0IsV0FBV0QsSUFBYixFQUFoQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPbkIsV0FBUDtBQUNELENBckREIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuXG4gIGNsYXNzIFNlbGVjdEZpZWxkIGV4dGVuZHMgQmFzZUZpZWxkIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGFkZE9wdGlvbihvcHQpIHtcbiAgICAgIHRoaXMuX21vZGVsLmFkZE9wdGlvbihvcHQpO1xuICAgIH1cblxuICAgIHJlbW92ZU9wdGlvbihpZCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVtb3ZlT3B0aW9uKGlkKTtcbiAgICB9XG5cbiAgICBjbGVhck9wdGlvbnMoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5jbGVhck9wdGlvbnMoKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnb3B0aW9ucycpO1xuICAgIH1cblxuICAgIGdldEFibGVPcHRpb25zKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmxpc3RBYmxlT3B0aW9ucygpXG4gICAgfVxuXG4gICAgZGlzYWJsZU9wdGlvbihpZCkge1xuICAgICAgdGhpcy5fbW9kZWwuZGlzYWJsZU9wdGlvbihpZCk7XG4gICAgfVxuXG4gICAgZW5hYmxlT3B0aW9uKGlkKSB7XG4gICAgICB0aGlzLl9tb2RlbC5lbmFibGVPcHRpb24oaWQpO1xuICAgIH1cblxuICAgIHNlbGVjdEZpcnN0QWJsZSgpIHtcbiAgICAgIGNvbnN0IGFibGUgPSB0aGlzLl9tb2RlbC5saXN0QWJsZU9wdGlvbnMoKTtcbiAgICAgIGlmICghYWJsZS5pbmNsdWRlcyh0aGlzLnZhbHVlKCkpKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoYWJsZVswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgU2VsZWN0RmllbGQuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IFNlbGVjdEZpZWxkKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG4gIFxuICByZXR1cm4gU2VsZWN0RmllbGQ7XG59KTsiXX0=
