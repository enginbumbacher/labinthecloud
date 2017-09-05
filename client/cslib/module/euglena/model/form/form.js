'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Form = require('core/component/form/form'),
      Button = require('core/component/button/field'),
      SliderField = require('core/component/sliderfield/field');

  var ModelForm = function (_Form) {
    _inherits(ModelForm, _Form);

    function ModelForm() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModelForm);

      settings.modelData.fields = HM.invoke('ModelForm.Fields', [], {
        type: settings.modelData.modelType,
        config: settings.modelData.fieldConfig
      });
      settings.modelData.fields.push(SliderField.create({
        id: 'count',
        label: "Number of Euglena",
        min: settings.modelData.euglenaCountConfig.range[0],
        max: settings.modelData.euglenaCountConfig.range[1],
        steps: settings.modelData.euglenaCountConfig.range[1] - settings.modelData.euglenaCountConfig.range[0],
        defaultValue: settings.modelData.euglenaCountConfig.initialValue
      }));
      settings.modelData.buttons = [Button.create({
        id: 'simulate',
        label: 'Run Model',
        classes: ['form__model__simulate'],
        eventName: 'ModelForm.Simulate'
      }), Button.create({
        id: 'submit',
        label: 'Save',
        classes: ['form__model__submit'],
        eventName: 'ModelForm.Save'
      }), Button.create({
        id: 'new',
        label: 'New Model',
        classes: ['form__model__new'],
        eventName: 'ModelForm.NewRequest'
      }), Button.create({
        id: 'aggregate',
        label: 'Add Results to Aggregate',
        classes: ['form__model__aggregate'],
        eventName: 'ModelForm.AddToAggregate'
      })];
      settings.modelData.classes = ["form__model"];
      return _possibleConstructorReturn(this, (ModelForm.__proto__ || Object.getPrototypeOf(ModelForm)).call(this, settings));
    }

    _createClass(ModelForm, [{
      key: 'export',
      value: function _export() {
        return HM.invoke('ModelForm.ModifyExport', _get(ModelForm.prototype.__proto__ || Object.getPrototypeOf(ModelForm.prototype), 'export', this).call(this), { type: this._model.get('modelType') });
      }
    }, {
      key: 'import',
      value: function _import(data) {
        return _get(ModelForm.prototype.__proto__ || Object.getPrototypeOf(ModelForm.prototype), 'import', this).call(this, HM.invoke('ModelForm.ModifyImport', data, { type: this._model.get('modelType') }));
      }
    }, {
      key: 'setState',
      value: function setState(state) {
        switch (state) {
          case "historical":
            this.getButton('submit').view().hide();
            this.getButton('simulate').view().hide();
            if (Globals.get('AppConfig.aggregate')) {
              this.getButton('aggregate').view().show();
            } else {
              this.getButton('aggregate').view().hide();
            }
            this.getButton('new').view().show();
            break;
          case "new":
            switch (Globals.get('AppConfig.system.modelModality').toLowerCase()) {
              case "observe":
                this.getButton('submit').view().hide();
                this.getButton('simulate').view().show();
                this.getButton('aggregate').view().hide();
                this.getButton('new').view().hide();

                break;
              case "explore":
                this.getButton('submit').view().hide();
                this.getButton('simulate').view().show();
                this.getButton('aggregate').view().hide();
                this.getButton('new').view().hide();
                break;
              case "create":
                this.getButton('submit').view().show();
                this.getButton('simulate').view().show();
                this.getButton('aggregate').view().hide();
                this.getButton('new').view().hide();
                break;
            }
            break;
        }
      }
    }]);

    return ModelForm;
  }(Form);

  ModelForm.create = function (data) {
    return new ModelForm({ modelData: data });
  };

  return ModelForm;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiQnV0dG9uIiwiU2xpZGVyRmllbGQiLCJNb2RlbEZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsRGF0YSIsImZpZWxkcyIsImludm9rZSIsInR5cGUiLCJtb2RlbFR5cGUiLCJjb25maWciLCJmaWVsZENvbmZpZyIsInB1c2giLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwibWluIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwicmFuZ2UiLCJtYXgiLCJzdGVwcyIsImRlZmF1bHRWYWx1ZSIsImluaXRpYWxWYWx1ZSIsImJ1dHRvbnMiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsInN0YXRlIiwiZ2V0QnV0dG9uIiwidmlldyIsImhpZGUiLCJzaG93IiwidG9Mb3dlckNhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLE9BQU9KLFFBQVEsMEJBQVIsQ0FBYjtBQUFBLE1BQ0VLLFNBQVNMLFFBQVEsNkJBQVIsQ0FEWDtBQUFBLE1BRUVNLGNBQWNOLFFBQVEsa0NBQVIsQ0FGaEI7O0FBTGtCLE1BU1pPLFNBVFk7QUFBQTs7QUFVaEIseUJBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsU0FBVCxDQUFtQkMsTUFBbkIsR0FBNEJQLEdBQUdRLE1BQUgsQ0FBVSxrQkFBVixFQUE4QixFQUE5QixFQUFrQztBQUM1REMsY0FBTUosU0FBU0MsU0FBVCxDQUFtQkksU0FEbUM7QUFFNURD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OztBQUlBLFNBQU96QixTQUFQO0FBQ0QsQ0FwR0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvZm9ybS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyksXG4gICAgU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpO1xuXG4gIGNsYXNzIE1vZGVsRm9ybSBleHRlbmRzIEZvcm0ge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YS5maWVsZHMgPSBITS5pbnZva2UoJ01vZGVsRm9ybS5GaWVsZHMnLCBbXSwge1xuICAgICAgICB0eXBlOiBzZXR0aW5ncy5tb2RlbERhdGEubW9kZWxUeXBlLFxuICAgICAgICBjb25maWc6IHNldHRpbmdzLm1vZGVsRGF0YS5maWVsZENvbmZpZ1xuICAgICAgfSk7XG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuZmllbGRzLnB1c2goU2xpZGVyRmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdjb3VudCcsXG4gICAgICAgIGxhYmVsOiBcIk51bWJlciBvZiBFdWdsZW5hXCIsXG4gICAgICAgIG1pbjogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5yYW5nZVswXSxcbiAgICAgICAgbWF4OiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLnJhbmdlWzFdLFxuICAgICAgICBzdGVwczogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5yYW5nZVsxXSAtIHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcucmFuZ2VbMF0sXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5pbml0aWFsVmFsdWVcbiAgICAgIH0pKVxuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmJ1dHRvbnMgPSBbQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc2ltdWxhdGUnLFxuICAgICAgICBsYWJlbDogJ1J1biBNb2RlbCcsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fbW9kZWxfX3NpbXVsYXRlJ10sXG4gICAgICAgIGV2ZW50TmFtZTogJ01vZGVsRm9ybS5TaW11bGF0ZSdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzdWJtaXQnLFxuICAgICAgICBsYWJlbDogJ1NhdmUnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX21vZGVsX19zdWJtaXQnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnTW9kZWxGb3JtLlNhdmUnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnbmV3JyxcbiAgICAgICAgbGFiZWw6ICdOZXcgTW9kZWwnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX21vZGVsX19uZXcnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnTW9kZWxGb3JtLk5ld1JlcXVlc3QnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnYWdncmVnYXRlJyxcbiAgICAgICAgbGFiZWw6ICdBZGQgUmVzdWx0cyB0byBBZ2dyZWdhdGUnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX21vZGVsX19hZ2dyZWdhdGUnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJ1xuICAgICAgfSldXG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuY2xhc3NlcyA9IFtcImZvcm1fX21vZGVsXCJdXG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgcmV0dXJuIEhNLmludm9rZSgnTW9kZWxGb3JtLk1vZGlmeUV4cG9ydCcsIHN1cGVyLmV4cG9ydCgpLCB7IHR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgfSk7XG4gICAgfVxuXG4gICAgaW1wb3J0KGRhdGEpIHtcbiAgICAgIHJldHVybiBzdXBlci5pbXBvcnQoSE0uaW52b2tlKCdNb2RlbEZvcm0uTW9kaWZ5SW1wb3J0JywgZGF0YSwgeyB0eXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpIH0pKTtcbiAgICB9XG5cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICBjYXNlIFwiaGlzdG9yaWNhbFwiOlxuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzaW11bGF0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuYWdncmVnYXRlJykpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibmV3XCI6XG4gICAgICAgICAgc3dpdGNoIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcIm9ic2VydmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzaW11bGF0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXhwbG9yZVwiOlxuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3NpbXVsYXRlJykudmlldygpLnNob3coKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgTW9kZWxGb3JtLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbEZvcm0oeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gTW9kZWxGb3JtO1xufSlcbiJdfQ==
