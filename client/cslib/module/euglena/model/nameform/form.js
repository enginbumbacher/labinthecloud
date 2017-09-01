'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Form = require('core/component/form/form'),
      Button = require('core/component/button/field'),
      TextField = require('core/component/textfield/field');

  var ModelNameForm = function (_Form) {
    _inherits(ModelNameForm, _Form);

    function ModelNameForm() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModelNameForm);

      settings.modelData.title = settings.modelData.title || "Give your model a name";
      settings.modelData.classes = (settings.modelData.classes || []).concat(['form__model__name']);
      settings.modelData.fields = (settings.modelData.fields || []).concat([TextField.create({
        id: 'name',
        label: 'Name',
        required: true
      })]);
      settings.modelData.buttons = (settings.modelData.buttons || []).concat([Button.create({
        id: 'cancel',
        eventName: 'ModelSave.Cancel',
        label: 'Cancel',
        classes: ['form__model__name__cancel']
      }), Button.create({
        id: 'submit',
        eventName: 'ModelSave.Submit',
        label: 'Save',
        classes: ['form__model__name__submit']
      })]);
      return _possibleConstructorReturn(this, (ModelNameForm.__proto__ || Object.getPrototypeOf(ModelNameForm)).call(this, settings));
    }

    return ModelNameForm;
  }(Form);

  ModelNameForm.create = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new ModelNameForm({ modelData: data });
  };

  return ModelNameForm;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL25hbWVmb3JtL2Zvcm0uanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiRm9ybSIsIkJ1dHRvbiIsIlRleHRGaWVsZCIsIk1vZGVsTmFtZUZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsRGF0YSIsInRpdGxlIiwiY2xhc3NlcyIsImNvbmNhdCIsImZpZWxkcyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJyZXF1aXJlZCIsImJ1dHRvbnMiLCJldmVudE5hbWUiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLE9BQU9KLFFBQVEsMEJBQVIsQ0FBYjtBQUFBLE1BQ0VLLFNBQVNMLFFBQVEsNkJBQVIsQ0FEWDtBQUFBLE1BRUVNLFlBQVlOLFFBQVEsZ0NBQVIsQ0FGZDs7QUFMa0IsTUFTWk8sYUFUWTtBQUFBOztBQVVoQiw2QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxTQUFULENBQW1CQyxLQUFuQixHQUEyQkYsU0FBU0MsU0FBVCxDQUFtQkMsS0FBbkIsSUFBNEIsd0JBQXZEO0FBQ0FGLGVBQVNDLFNBQVQsQ0FBbUJFLE9BQW5CLEdBQTZCLENBQUNILFNBQVNDLFNBQVQsQ0FBbUJFLE9BQW5CLElBQThCLEVBQS9CLEVBQW1DQyxNQUFuQyxDQUEwQyxDQUFDLG1CQUFELENBQTFDLENBQTdCO0FBQ0FKLGVBQVNDLFNBQVQsQ0FBbUJJLE1BQW5CLEdBQTRCLENBQUNMLFNBQVNDLFNBQVQsQ0FBbUJJLE1BQW5CLElBQTZCLEVBQTlCLEVBQWtDRCxNQUFsQyxDQUF5QyxDQUFDTixVQUFVUSxNQUFWLENBQWlCO0FBQ3JGQyxZQUFJLE1BRGlGO0FBRXJGQyxlQUFPLE1BRjhFO0FBR3JGQyxrQkFBVTtBQUgyRSxPQUFqQixDQUFELENBQXpDLENBQTVCO0FBS0FULGVBQVNDLFNBQVQsQ0FBbUJTLE9BQW5CLEdBQTZCLENBQUNWLFNBQVNDLFNBQVQsQ0FBbUJTLE9BQW5CLElBQThCLEVBQS9CLEVBQW1DTixNQUFuQyxDQUEwQyxDQUFDUCxPQUFPUyxNQUFQLENBQWM7QUFDcEZDLFlBQUksUUFEZ0Y7QUFFcEZJLG1CQUFXLGtCQUZ5RTtBQUdwRkgsZUFBTyxRQUg2RTtBQUlwRkwsaUJBQVMsQ0FBQywyQkFBRDtBQUoyRSxPQUFkLENBQUQsRUFLbkVOLE9BQU9TLE1BQVAsQ0FBYztBQUNoQkMsWUFBSSxRQURZO0FBRWhCSSxtQkFBVyxrQkFGSztBQUdoQkgsZUFBTyxNQUhTO0FBSWhCTCxpQkFBUyxDQUFDLDJCQUFEO0FBSk8sT0FBZCxDQUxtRSxDQUExQyxDQUE3QjtBQVJ5QiwySEFtQm5CSCxRQW5CbUI7QUFvQjFCOztBQTlCZTtBQUFBLElBU1VKLElBVFY7O0FBaUNsQkcsZ0JBQWNPLE1BQWQsR0FBdUIsWUFBZTtBQUFBLFFBQWRNLElBQWMsdUVBQVAsRUFBTzs7QUFDcEMsV0FBTyxJQUFJYixhQUFKLENBQWtCLEVBQUVFLFdBQVdXLElBQWIsRUFBbEIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT2IsYUFBUDtBQUNELENBdENEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL25hbWVmb3JtL2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IEZvcm0gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0nKSxcbiAgICBCdXR0b24gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQnKSxcbiAgICBUZXh0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC90ZXh0ZmllbGQvZmllbGQnKTtcblxuICBjbGFzcyBNb2RlbE5hbWVGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLnRpdGxlID0gc2V0dGluZ3MubW9kZWxEYXRhLnRpdGxlIHx8IFwiR2l2ZSB5b3VyIG1vZGVsIGEgbmFtZVwiO1xuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmNsYXNzZXMgPSAoc2V0dGluZ3MubW9kZWxEYXRhLmNsYXNzZXMgfHwgW10pLmNvbmNhdChbJ2Zvcm1fX21vZGVsX19uYW1lJ10pO1xuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmZpZWxkcyA9IChzZXR0aW5ncy5tb2RlbERhdGEuZmllbGRzIHx8IFtdKS5jb25jYXQoW1RleHRGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ25hbWUnLFxuICAgICAgICBsYWJlbDogJ05hbWUnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgfSldKVxuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmJ1dHRvbnMgPSAoc2V0dGluZ3MubW9kZWxEYXRhLmJ1dHRvbnMgfHwgW10pLmNvbmNhdChbQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnY2FuY2VsJyxcbiAgICAgICAgZXZlbnROYW1lOiAnTW9kZWxTYXZlLkNhbmNlbCcsXG4gICAgICAgIGxhYmVsOiAnQ2FuY2VsJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fbmFtZV9fY2FuY2VsJ11cbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzdWJtaXQnLFxuICAgICAgICBldmVudE5hbWU6ICdNb2RlbFNhdmUuU3VibWl0JyxcbiAgICAgICAgbGFiZWw6ICdTYXZlJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fbmFtZV9fc3VibWl0J11cbiAgICAgIH0pXSlcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICB9XG4gIH1cblxuICBNb2RlbE5hbWVGb3JtLmNyZWF0ZSA9IChkYXRhID0ge30pID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsTmFtZUZvcm0oeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gTW9kZWxOYW1lRm9ybTtcbn0pIl19
