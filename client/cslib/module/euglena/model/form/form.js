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
        label: 'Run Simulation',
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
            this.getButton('aggregate').view().show();
            this.getButton('new').view().show();
            break;
          case "new":
            this.getButton('submit').view().show();
            this.getButton('simulate').view().show();
            this.getButton('aggregate').view().hide();
            this.getButton('new').view().hide();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiQnV0dG9uIiwiU2xpZGVyRmllbGQiLCJNb2RlbEZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsRGF0YSIsImZpZWxkcyIsImludm9rZSIsInR5cGUiLCJtb2RlbFR5cGUiLCJjb25maWciLCJmaWVsZENvbmZpZyIsInB1c2giLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwibWluIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwicmFuZ2UiLCJtYXgiLCJzdGVwcyIsImRlZmF1bHRWYWx1ZSIsImluaXRpYWxWYWx1ZSIsImJ1dHRvbnMiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsInN0YXRlIiwiZ2V0QnV0dG9uIiwidmlldyIsImhpZGUiLCJzaG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxPQUFPSixRQUFRLDBCQUFSLENBQWI7QUFBQSxNQUNFSyxTQUFTTCxRQUFRLDZCQUFSLENBRFg7QUFBQSxNQUVFTSxjQUFjTixRQUFRLGtDQUFSLENBRmhCOztBQUxrQixNQVNaTyxTQVRZO0FBQUE7O0FBVWhCLHlCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFNBQVQsQ0FBbUJDLE1BQW5CLEdBQTRCUCxHQUFHUSxNQUFILENBQVUsa0JBQVYsRUFBOEIsRUFBOUIsRUFBa0M7QUFDNURDLGNBQU1KLFNBQVNDLFNBQVQsQ0FBbUJJLFNBRG1DO0FBRTVEQyxnQkFBUU4sU0FBU0Ms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QW1DQyxJQUFuQztBQUNBLGlCQUFLRixTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJDLElBQTdCO0FBQ0Y7QUFaRjtBQWNEO0FBdkVlOztBQUFBO0FBQUEsSUFTTWhDLElBVE47O0FBMEVsQkcsWUFBVVUsTUFBVixHQUFtQixVQUFDZSxJQUFELEVBQVU7QUFDM0IsV0FBTyxJQUFJekIsU0FBSixDQUFjLEVBQUVFLFdBQVd1QixJQUFiLEVBQWQsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT3pCLFNBQVA7QUFDRCxDQS9FRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbC9mb3JtL2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IEZvcm0gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0nKSxcbiAgICBCdXR0b24gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQnKSxcbiAgICBTbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NsaWRlcmZpZWxkL2ZpZWxkJyk7XG5cbiAgY2xhc3MgTW9kZWxGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmZpZWxkcyA9IEhNLmludm9rZSgnTW9kZWxGb3JtLkZpZWxkcycsIFtdLCB7XG4gICAgICAgIHR5cGU6IHNldHRpbmdzLm1vZGVsRGF0YS5tb2RlbFR5cGUsXG4gICAgICAgIGNvbmZpZzogc2V0dGluZ3MubW9kZWxEYXRhLmZpZWxkQ29uZmlnXG4gICAgICB9KTtcbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YS5maWVsZHMucHVzaChTbGlkZXJGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ2NvdW50JyxcbiAgICAgICAgbGFiZWw6IFwiTnVtYmVyIG9mIEV1Z2xlbmFcIixcbiAgICAgICAgbWluOiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLnJhbmdlWzBdLFxuICAgICAgICBtYXg6IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcucmFuZ2VbMV0sXG4gICAgICAgIHN0ZXBzOiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLnJhbmdlWzFdIC0gc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5yYW5nZVswXSxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLmluaXRpYWxWYWx1ZVxuICAgICAgfSkpXG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuYnV0dG9ucyA9IFtCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzaW11bGF0ZScsXG4gICAgICAgIGxhYmVsOiAnUnVuIFNpbXVsYXRpb24nLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX21vZGVsX19zaW11bGF0ZSddLFxuICAgICAgICBldmVudE5hbWU6ICdNb2RlbEZvcm0uU2ltdWxhdGUnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc3VibWl0JyxcbiAgICAgICAgbGFiZWw6ICdTYXZlJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fc3VibWl0J10sXG4gICAgICAgIGV2ZW50TmFtZTogJ01vZGVsRm9ybS5TYXZlJ1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ25ldycsXG4gICAgICAgIGxhYmVsOiAnTmV3IE1vZGVsJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fbmV3J10sXG4gICAgICAgIGV2ZW50TmFtZTogJ01vZGVsRm9ybS5OZXdSZXF1ZXN0J1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGxhYmVsOiAnQWRkIFJlc3VsdHMgdG8gQWdncmVnYXRlJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fYWdncmVnYXRlJ10sXG4gICAgICAgIGV2ZW50TmFtZTogJ01vZGVsRm9ybS5BZGRUb0FnZ3JlZ2F0ZSdcbiAgICAgIH0pXVxuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmNsYXNzZXMgPSBbXCJmb3JtX19tb2RlbFwiXVxuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgIHJldHVybiBITS5pbnZva2UoJ01vZGVsRm9ybS5Nb2RpZnlFeHBvcnQnLCBzdXBlci5leHBvcnQoKSwgeyB0eXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpIH0pO1xuICAgIH1cblxuICAgIGltcG9ydChkYXRhKSB7XG4gICAgICByZXR1cm4gc3VwZXIuaW1wb3J0KEhNLmludm9rZSgnTW9kZWxGb3JtLk1vZGlmeUltcG9ydCcsIGRhdGEsIHsgdHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSB9KSk7XG4gICAgfVxuXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImhpc3RvcmljYWxcIjpcbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzaW11bGF0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIE1vZGVsRm9ybS5jcmVhdGUgPSAoZGF0YSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxGb3JtKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcmV0dXJuIE1vZGVsRm9ybTtcbn0pIl19
