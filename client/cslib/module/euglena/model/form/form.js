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

  //SliderField = require('core/component/sliderfield/field')
  SelectField = require('core/component/selectfield/field');

  var ModelForm = function (_Form) {
    _inherits(ModelForm, _Form);

    function ModelForm() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModelForm);

      settings.modelData.fields = HM.invoke('ModelForm.Fields', [], {
        type: settings.modelData.modelType,
        config: settings.modelData.fieldConfig
      });
      /*
      settings.modelData.fields.push(SliderField.create({
        id: 'count',
        label: "Number of Euglena",
        min: settings.modelData.euglenaCountConfig.range[0],
        max: settings.modelData.euglenaCountConfig.range[1],
        steps: settings.modelData.euglenaCountConfig.range[1] - settings.modelData.euglenaCountConfig.range[0],
        defaultValue: settings.modelData.euglenaCountConfig.initialValue
      }))
      */
      settings.modelData.fields.push(SelectField.create({
        id: 'count',
        label: "Number of Euglena:",
        value: settings.modelData.euglenaCountConfig.initialValue,
        classes: [],
        options: settings.modelData.euglenaCountConfig.options,
        description: 'Set the number of models to be simulated.'
      }));
      // settings.modelData.fields.push(SelectField.create({
      //   id: 'initialization',
      //   label: "Initial Position of Euglena:",
      //   value: settings.modelData.euglenaInitConfig.initialValue,
      //   classes: [],
      //   options: settings.modelData.euglenaInitConfig.options,
      //   description: 'Set the initial position of models to be simulated.'
      // }))
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
              default:
                this.getButton('submit').view().hide();
                this.getButton('simulate').view().hide();
                if (Globals.get('AppConfig.aggregate')) {
                  this.getButton('aggregate').view().show();
                } else {
                  this.getButton('aggregate').view().hide();
                }
                this.getButton('new').view().show();
                break;
            }
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
              default:
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiQnV0dG9uIiwiU2VsZWN0RmllbGQiLCJNb2RlbEZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsRGF0YSIsImZpZWxkcyIsImludm9rZSIsInR5cGUiLCJtb2RlbFR5cGUiLCJjb25maWciLCJmaWVsZENvbmZpZyIsInB1c2giLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwidmFsdWUiLCJldWdsZW5hQ291bnRDb25maWciLCJpbml0aWFsVmFsdWUiLCJjbGFzc2VzIiwib3B0aW9ucyIsImRlc2NyaXB0aW9uIiwiYnV0dG9ucyIsImV2ZW50TmFtZSIsIl9tb2RlbCIsImdldCIsImRhdGEiLCJzdGF0ZSIsInRvTG93ZXJDYXNlIiwiZ2V0QnV0dG9uIiwidmlldyIsImhpZGUiLCJzaG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxPQUFPSixRQUFRLDBCQUFSLENBQWI7QUFBQSxNQUNFSyxTQUFTTCxRQUFRLDZCQUFSLENBRFg7O0FBRUU7QUFDQU0sZ0JBQWNOLFFBQVEsa0NBQVIsQ0FIaEI7O0FBTGtCLE1BVVpPLFNBVlk7QUFBQTs7QUFXaEIseUJBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsU0FBVCxDQUFtQkMsTUFBbkIsR0FBNEJQLEdBQUdRLE1BQUgsQ0FBVSxrQkFBVixFQUE4QixFQUE5QixFQUFrQztBQUM1REMsY0FBTUosU0FBU0MsU0FBVCxDQUFtQkksU0FEbUM7QUFFNURDLGdCQUFRTixT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LElBQTdCO0FBQ0Y7QUFDQTtBQUNFLHFCQUFLRixTQUFMLENBQWUsUUFBZixFQUF5QkMsSUFBekIsR0FBZ0NFLElBQWhDO0FBQ0EscUJBQUtILFNBQUwsQ0FBZSxVQUFmLEVBQTJCQyxJQUEzQixHQUFrQ0UsSUFBbEM7QUFDQSxxQkFBS0gsU0FBTCxDQUFlLFdBQWYsRUFBNEJDLElBQTVCLEdBQW1DQyxJQUFuQztBQUNBLHFCQUFLRixTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJDLElBQTdCO0FBQ0Y7QUFuQkY7QUFxQkE7QUFqREo7QUFtREQ7QUEvSGU7O0FBQUE7QUFBQSxJQVVNL0IsSUFWTjs7QUFrSWxCRyxZQUFVVSxNQUFWLEdBQW1CLFVBQUNhLElBQUQsRUFBVTtBQUMzQixXQUFPLElBQUl2QixTQUFKLENBQWMsRUFBRUUsV0FBV3FCLElBQWIsRUFBZCxDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPdkIsU0FBUDtBQUNELENBdklEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL2Zvcm0vZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIEJ1dHRvbiA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2J1dHRvbi9maWVsZCcpLFxuICAgIC8vU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpO1xuXG4gIGNsYXNzIE1vZGVsRm9ybSBleHRlbmRzIEZvcm0ge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YS5maWVsZHMgPSBITS5pbnZva2UoJ01vZGVsRm9ybS5GaWVsZHMnLCBbXSwge1xuICAgICAgICB0eXBlOiBzZXR0aW5ncy5tb2RlbERhdGEubW9kZWxUeXBlLFxuICAgICAgICBjb25maWc6IHNldHRpbmdzLm1vZGVsRGF0YS5maWVsZENvbmZpZ1xuICAgICAgfSk7XG4gICAgICAvKlxuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmZpZWxkcy5wdXNoKFNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnY291bnQnLFxuICAgICAgICBsYWJlbDogXCJOdW1iZXIgb2YgRXVnbGVuYVwiLFxuICAgICAgICBtaW46IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcucmFuZ2VbMF0sXG4gICAgICAgIG1heDogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5yYW5nZVsxXSxcbiAgICAgICAgc3RlcHM6IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcucmFuZ2VbMV0gLSBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLnJhbmdlWzBdLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcuaW5pdGlhbFZhbHVlXG4gICAgICB9KSlcbiAgICAgICovXG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuZmllbGRzLnB1c2goU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdjb3VudCcsXG4gICAgICAgIGxhYmVsOiBcIk51bWJlciBvZiBFdWdsZW5hOlwiLFxuICAgICAgICB2YWx1ZTogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5pbml0aWFsVmFsdWUsXG4gICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICBvcHRpb25zOiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLm9wdGlvbnMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IHRoZSBudW1iZXIgb2YgbW9kZWxzIHRvIGJlIHNpbXVsYXRlZC4nXG4gICAgICB9KSlcbiAgICAgIC8vIHNldHRpbmdzLm1vZGVsRGF0YS5maWVsZHMucHVzaChTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgLy8gICBpZDogJ2luaXRpYWxpemF0aW9uJyxcbiAgICAgIC8vICAgbGFiZWw6IFwiSW5pdGlhbCBQb3NpdGlvbiBvZiBFdWdsZW5hOlwiLFxuICAgICAgLy8gICB2YWx1ZTogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFJbml0Q29uZmlnLmluaXRpYWxWYWx1ZSxcbiAgICAgIC8vICAgY2xhc3NlczogW10sXG4gICAgICAvLyAgIG9wdGlvbnM6IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hSW5pdENvbmZpZy5vcHRpb25zLFxuICAgICAgLy8gICBkZXNjcmlwdGlvbjogJ1NldCB0aGUgaW5pdGlhbCBwb3NpdGlvbiBvZiBtb2RlbHMgdG8gYmUgc2ltdWxhdGVkLidcbiAgICAgIC8vIH0pKVxuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmJ1dHRvbnMgPSBbQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc2ltdWxhdGUnLFxuICAgICAgICBsYWJlbDogJ1J1biBNb2RlbCcsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fbW9kZWxfX3NpbXVsYXRlJ10sXG4gICAgICAgIGV2ZW50TmFtZTogJ01vZGVsRm9ybS5TaW11bGF0ZSdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzdWJtaXQnLFxuICAgICAgICBsYWJlbDogJ1NhdmUnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX21vZGVsX19zdWJtaXQnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnTW9kZWxGb3JtLlNhdmUnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnbmV3JyxcbiAgICAgICAgbGFiZWw6ICdOZXcgTW9kZWwnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX21vZGVsX19uZXcnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnTW9kZWxGb3JtLk5ld1JlcXVlc3QnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnYWdncmVnYXRlJyxcbiAgICAgICAgbGFiZWw6ICdBZGQgUmVzdWx0cyB0byBBZ2dyZWdhdGUnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX21vZGVsX19hZ2dyZWdhdGUnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnTW9kZWxGb3JtLkFkZFRvQWdncmVnYXRlJ1xuICAgICAgfSldXG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuY2xhc3NlcyA9IFtcImZvcm1fX21vZGVsXCJdXG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgcmV0dXJuIEhNLmludm9rZSgnTW9kZWxGb3JtLk1vZGlmeUV4cG9ydCcsIHN1cGVyLmV4cG9ydCgpLCB7IHR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgfSk7XG4gICAgfVxuXG4gICAgaW1wb3J0KGRhdGEpIHtcbiAgICAgIHJldHVybiBzdXBlci5pbXBvcnQoSE0uaW52b2tlKCdNb2RlbEZvcm0uTW9kaWZ5SW1wb3J0JywgZGF0YSwgeyB0eXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpIH0pKTtcbiAgICB9XG5cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICBjYXNlIFwiaGlzdG9yaWNhbFwiOlxuICAgICAgICAgIHN3aXRjaCAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5hZ2dyZWdhdGUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgIHN3aXRjaCAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzaW11bGF0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzaW11bGF0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBNb2RlbEZvcm0uY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsRm9ybSh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbEZvcm07XG59KVxuIl19
