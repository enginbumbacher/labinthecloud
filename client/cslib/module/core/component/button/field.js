'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseField = require('core/component/form/field/field'),
      View = require('./view'),
      Model = require('./model');

  var ButtonField = function (_BaseField) {
    _inherits(ButtonField, _BaseField);

    function ButtonField(settings) {
      _classCallCheck(this, ButtonField);

      settings.viewClass = settings.viewClass || View;
      settings.modelClass = settings.modelClass || Model;
      return _possibleConstructorReturn(this, (ButtonField.__proto__ || Object.getPrototypeOf(ButtonField)).call(this, settings));
    }

    _createClass(ButtonField, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'trigger',
      value: function trigger() {
        this._view._onClick(null);
      }
    }, {
      key: 'setLabel',
      value: function setLabel(label) {
        this._model.set('label', label);
      }
    }]);

    return ButtonField;
  }(BaseField);

  ButtonField.create = function (data) {
    return new ButtonField({ modelData: data });
  };

  return ButtonField;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkJhc2VGaWVsZCIsIlZpZXciLCJNb2RlbCIsIkJ1dHRvbkZpZWxkIiwic2V0dGluZ3MiLCJ2aWV3Q2xhc3MiLCJtb2RlbENsYXNzIiwiX21vZGVsIiwiZ2V0IiwiX3ZpZXciLCJfb25DbGljayIsImxhYmVsIiwic2V0IiwiY3JlYXRlIiwiZGF0YSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLGlDQUFSLENBQWxCO0FBQUEsTUFDRUUsT0FBT0YsUUFBUSxRQUFSLENBRFQ7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLFNBQVIsQ0FGVjs7QUFEa0IsTUFLWkksV0FMWTtBQUFBOztBQU1oQix5QkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUNwQkEsZUFBU0MsU0FBVCxHQUFxQkQsU0FBU0MsU0FBVCxJQUFzQkosSUFBM0M7QUFDQUcsZUFBU0UsVUFBVCxHQUFzQkYsU0FBU0UsVUFBVCxJQUF1QkosS0FBN0M7QUFGb0IsdUhBR2RFLFFBSGM7QUFJckI7O0FBVmU7QUFBQTtBQUFBLDJCQVlYO0FBQ0gsZUFBTyxLQUFLRyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBZGU7QUFBQTtBQUFBLGdDQWdCTjtBQUNSLGFBQUtDLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQixJQUFwQjtBQUNEO0FBbEJlO0FBQUE7QUFBQSwrQkFvQlBDLEtBcEJPLEVBb0JBO0FBQ2QsYUFBS0osTUFBTCxDQUFZSyxHQUFaLENBQWdCLE9BQWhCLEVBQXlCRCxLQUF6QjtBQUNEO0FBdEJlOztBQUFBO0FBQUEsSUFLUVgsU0FMUjs7QUF5QmxCRyxjQUFZVSxNQUFaLEdBQXFCLFVBQUNDLElBQUQsRUFBVTtBQUM3QixXQUFPLElBQUlYLFdBQUosQ0FBZ0IsRUFBRVksV0FBV0QsSUFBYixFQUFoQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPWCxXQUFQO0FBQ0QsQ0E5QkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2J1dHRvbi9maWVsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL2ZpZWxkJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpO1xuXG4gIGNsYXNzIEJ1dHRvbkZpZWxkIGV4dGVuZHMgQmFzZUZpZWxkIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBpZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXQoJ2lkJyk7XG4gICAgfVxuXG4gICAgdHJpZ2dlcigpIHtcbiAgICAgIHRoaXMuX3ZpZXcuX29uQ2xpY2sobnVsbCk7XG4gICAgfVxuXG4gICAgc2V0TGFiZWwobGFiZWwpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnbGFiZWwnLCBsYWJlbCk7XG4gICAgfVxuICB9XG5cbiAgQnV0dG9uRmllbGQuY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IEJ1dHRvbkZpZWxkKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcmV0dXJuIEJ1dHRvbkZpZWxkO1xufSlcbiJdfQ==
