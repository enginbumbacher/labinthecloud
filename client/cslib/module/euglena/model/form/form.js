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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiQnV0dG9uIiwiU2xpZGVyRmllbGQiLCJNb2RlbEZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsRGF0YSIsImZpZWxkcyIsImludm9rZSIsInR5cGUiLCJtb2RlbFR5cGUiLCJjb25maWciLCJmaWVsZENvbmZpZyIsInB1c2giLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwibWluIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwicmFuZ2UiLCJtYXgiLCJzdGVwcyIsImRlZmF1bHRWYWx1ZSIsImluaXRpYWxWYWx1ZSIsImJ1dHRvbnMiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsInN0YXRlIiwiZ2V0QnV0dG9uIiwidmlldyIsImhpZGUiLCJzaG93IiwidG9Mb3dlckNhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLE9BQU9KLFFBQVEsMEJBQVIsQ0FBYjtBQUFBLE1BQ0VLLFNBQVNMLFFBQVEsNkJBQVIsQ0FEWDtBQUFBLE1BRUVNLGNBQWNOLFFBQVEsa0NBQVIsQ0FGaEI7O0FBTGtCLE1BU1pPLFNBVFk7QUFBQTs7QUFVaEIseUJBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsU0FBVCxDQUFtQkMsTUFBbkIsR0FBNEJQLEdBQUdRLE1BQUgsQ0FBVSxrQkFBVixFQUE4QixFQUE5QixFQUFrQztBQUM1REMsY0FBTUosU0FBU0MsU0FBVCxDQUFtQkksU0FEbUM7QUFFNURD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ekIsU0FBUDtBQUNELENBcEdEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL2Zvcm0vZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIEJ1dHRvbiA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2J1dHRvbi9maWVsZCcpLFxuICAgIFNsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvZmllbGQnKTtcblxuICBjbGFzcyBNb2RlbEZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuZmllbGRzID0gSE0uaW52b2tlKCdNb2RlbEZvcm0uRmllbGRzJywgW10sIHtcbiAgICAgICAgdHlwZTogc2V0dGluZ3MubW9kZWxEYXRhLm1vZGVsVHlwZSxcbiAgICAgICAgY29uZmlnOiBzZXR0aW5ncy5tb2RlbERhdGEuZmllbGRDb25maWdcbiAgICAgIH0pO1xuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmZpZWxkcy5wdXNoKFNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnY291bnQnLFxuICAgICAgICBsYWJlbDogXCJOdW1iZXIgb2YgRXVnbGVuYVwiLFxuICAgICAgICBtaW46IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcucmFuZ2VbMF0sXG4gICAgICAgIG1heDogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5yYW5nZVsxXSxcbiAgICAgICAgc3RlcHM6IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcucmFuZ2VbMV0gLSBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLnJhbmdlWzBdLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcuaW5pdGlhbFZhbHVlXG4gICAgICB9KSlcbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YS5idXR0b25zID0gW0J1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3NpbXVsYXRlJyxcbiAgICAgICAgbGFiZWw6ICdSdW4gTW9kZWwnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX21vZGVsX19zaW11bGF0ZSddLFxuICAgICAgICBldmVudE5hbWU6ICdNb2RlbEZvcm0uU2ltdWxhdGUnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc3VibWl0JyxcbiAgICAgICAgbGFiZWw6ICdTYXZlJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fc3VibWl0J10sXG4gICAgICAgIGV2ZW50TmFtZTogJ01vZGVsRm9ybS5TYXZlJ1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ25ldycsXG4gICAgICAgIGxhYmVsOiAnTmV3IE1vZGVsJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fbmV3J10sXG4gICAgICAgIGV2ZW50TmFtZTogJ01vZGVsRm9ybS5OZXdSZXF1ZXN0J1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGxhYmVsOiAnQWRkIFJlc3VsdHMgdG8gQWdncmVnYXRlJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fYWdncmVnYXRlJ10sXG4gICAgICAgIGV2ZW50TmFtZTogJ01vZGVsRm9ybS5BZGRUb0FnZ3JlZ2F0ZSdcbiAgICAgIH0pXVxuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmNsYXNzZXMgPSBbXCJmb3JtX19tb2RlbFwiXVxuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgIHJldHVybiBITS5pbnZva2UoJ01vZGVsRm9ybS5Nb2RpZnlFeHBvcnQnLCBzdXBlci5leHBvcnQoKSwgeyB0eXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpIH0pO1xuICAgIH1cblxuICAgIGltcG9ydChkYXRhKSB7XG4gICAgICByZXR1cm4gc3VwZXIuaW1wb3J0KEhNLmludm9rZSgnTW9kZWxGb3JtLk1vZGlmeUltcG9ydCcsIGRhdGEsIHsgdHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSB9KSk7XG4gICAgfVxuXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImhpc3RvcmljYWxcIjpcbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmFnZ3JlZ2F0ZScpKSB7XG4gICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLnNob3coKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgIHN3aXRjaCAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzaW11bGF0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzaW11bGF0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBNb2RlbEZvcm0uY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsRm9ybSh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbEZvcm07XG59KVxuIl19
