'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FieldGroupView = require('core/component/fieldgroup/view'),
      Utils = require('core/util/utils'),
      Template = require('text!./experimentrow.html');
  require('link!./experimentrow.css');

  return function (_FieldGroupView) {
    _inherits(ExperimentRowView, _FieldGroupView);

    function ExperimentRowView(model, tmpl) {
      _classCallCheck(this, ExperimentRowView);

      return _possibleConstructorReturn(this, (ExperimentRowView.__proto__ || Object.getPrototypeOf(ExperimentRowView)).call(this, model, tmpl || Template));
    }

    return ExperimentRowView;
  }(FieldGroupView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvcm93L3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkZpZWxkR3JvdXBWaWV3IiwiVXRpbHMiLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsaUJBQWlCRCxRQUFRLGdDQUFSLENBQXZCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsV0FBV0gsUUFBUSwyQkFBUixDQUZiO0FBSUFBLFVBQVEsMEJBQVI7O0FBRUE7QUFBQTs7QUFDRSwrQkFBWUksS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxtSUFDakJELEtBRGlCLEVBQ1ZDLFFBQVFGLFFBREU7QUFFeEI7O0FBSEg7QUFBQSxJQUF1Q0YsY0FBdkM7QUFLRCxDQVpEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvcm93L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRmllbGRHcm91cFZpZXcgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL2V4cGVyaW1lbnRyb3cuaHRtbCcpXG4gIDtcbiAgcmVxdWlyZSgnbGluayEuL2V4cGVyaW1lbnRyb3cuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEV4cGVyaW1lbnRSb3dWaWV3IGV4dGVuZHMgRmllbGRHcm91cFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcihtb2RlbCwgdG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgfVxuICB9XG59KSJdfQ==
