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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiQnV0dG9uIiwiU2VsZWN0RmllbGQiLCJNb2RlbEZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsRGF0YSIsImZpZWxkcyIsImludm9rZSIsInR5cGUiLCJtb2RlbFR5cGUiLCJjb25maWciLCJmaWVsZENvbmZpZyIsInB1c2giLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwidmFsdWUiLCJldWdsZW5hQ291bnRDb25maWciLCJpbml0aWFsVmFsdWUiLCJjbGFzc2VzIiwib3B0aW9ucyIsImRlc2NyaXB0aW9uIiwiYnV0dG9ucyIsImV2ZW50TmFtZSIsIl9tb2RlbCIsImdldCIsImRhdGEiLCJzdGF0ZSIsImdldEJ1dHRvbiIsInZpZXciLCJoaWRlIiwic2hvdyIsInRvTG93ZXJDYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxPQUFPSixRQUFRLDBCQUFSLENBQWI7QUFBQSxNQUNFSyxTQUFTTCxRQUFRLDZCQUFSLENBRFg7O0FBRUU7QUFDQU0sZ0JBQWNOLFFBQVEsa0NBQVIsQ0FIaEI7O0FBTGtCLE1BVVpPLFNBVlk7QUFBQTs7QUFXaEIseUJBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsU0FBVCxDQUFtQkMsTUFBbkIsR0FBNEJQLEdBQUdRLE1BQUgsQ0FBVSxrQkFBVixFQUE4QixFQUE5QixFQUFrQztBQUM1REMsY0FBTUosU0FBU0MsU0FBVCxDQUFtQkksU0FEbUM7QUFFNURDLGdCQUFRTixT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LFNBQUwsQ0FBZSxXQUFmLEVBQTRCQyxJQUE1QixHQUFtQ0MsSUFBbkM7QUFDQSxxQkFBS0YsU0FBTCxDQUFlLEtBQWYsRUFBc0JDLElBQXRCLEdBQTZCQyxJQUE3Qjs7QUFFRjtBQUNBLG1CQUFLLFNBQUw7QUFDRSxxQkFBS0YsU0FBTCxDQUFlLFFBQWYsRUFBeUJDLElBQXpCLEdBQWdDQyxJQUFoQztBQUNBLHFCQUFLRixTQUFMLENBQWUsVUFBZixFQUEyQkMsSUFBM0IsR0FBa0NFLElBQWxDO0FBQ0EscUJBQUtILFNBQUwsQ0FBZSxXQUFmLEVBQTRCQyxJQUE1QixHQUFtQ0MsSUFBbkM7QUFDQSxxQkFBS0YsU0FBTCxDQUFlLEtBQWYsRUFBc0JDLElBQXRCLEdBQTZCQyxJQUE3QjtBQUNGO0FBQ0E7QUFDRSxxQkFBS0YsU0FBTCxDQUFlLFFBQWYsRUFBeUJDLElBQXpCLEdBQWdDRSxJQUFoQztBQUNBLHFCQUFLSCxTQUFMLENBQWUsVUFBZixFQUEyQkMsSUFBM0IsR0FBa0NFLElBQWxDO0FBQ0EscUJBQUtILFNBQUwsQ0FBZSxXQUFmLEVBQTRCQyxJQUE1QixHQUFtQ0MsSUFBbkM7QUFDQSxxQkFBS0YsU0FBTCxDQUFlLEtBQWYsRUFBc0JDLElBQXRCLEdBQTZCQyxJQUE3QjtBQUNGO0FBbkJGO0FBcUJBO0FBakNKO0FBbUNEO0FBdkdlOztBQUFBO0FBQUEsSUFVTTlCLElBVk47O0FBMEdsQkcsWUFBVVUsTUFBVixHQUFtQixVQUFDYSxJQUFELEVBQVU7QUFDM0IsV0FBTyxJQUFJdkIsU0FBSixDQUFjLEVBQUVFLFdBQVdxQixJQUFiLEVBQWQsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT3ZCLFNBQVA7QUFDRCxDQS9HRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbC9mb3JtL2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IEZvcm0gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0nKSxcbiAgICBCdXR0b24gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQnKSxcbiAgICAvL1NsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvZmllbGQnKVxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKTtcblxuICBjbGFzcyBNb2RlbEZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuZmllbGRzID0gSE0uaW52b2tlKCdNb2RlbEZvcm0uRmllbGRzJywgW10sIHtcbiAgICAgICAgdHlwZTogc2V0dGluZ3MubW9kZWxEYXRhLm1vZGVsVHlwZSxcbiAgICAgICAgY29uZmlnOiBzZXR0aW5ncy5tb2RlbERhdGEuZmllbGRDb25maWdcbiAgICAgIH0pO1xuICAgICAgLypcbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YS5maWVsZHMucHVzaChTbGlkZXJGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ2NvdW50JyxcbiAgICAgICAgbGFiZWw6IFwiTnVtYmVyIG9mIEV1Z2xlbmFcIixcbiAgICAgICAgbWluOiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLnJhbmdlWzBdLFxuICAgICAgICBtYXg6IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcucmFuZ2VbMV0sXG4gICAgICAgIHN0ZXBzOiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLnJhbmdlWzFdIC0gc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5yYW5nZVswXSxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLmluaXRpYWxWYWx1ZVxuICAgICAgfSkpXG4gICAgICAqL1xuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmZpZWxkcy5wdXNoKFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnY291bnQnLFxuICAgICAgICBsYWJlbDogXCJOdW1iZXIgb2YgRXVnbGVuYTpcIixcbiAgICAgICAgdmFsdWU6IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcuaW5pdGlhbFZhbHVlLFxuICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgb3B0aW9uczogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5vcHRpb25zLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1NldCB0aGUgbnVtYmVyIG9mIG1vZGVscyB0byBiZSBzaW11bGF0ZWQuJ1xuICAgICAgfSkpXG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuYnV0dG9ucyA9IFtCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzaW11bGF0ZScsXG4gICAgICAgIGxhYmVsOiAnUnVuIE1vZGVsJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fc2ltdWxhdGUnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnTW9kZWxGb3JtLlNpbXVsYXRlJ1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3N1Ym1pdCcsXG4gICAgICAgIGxhYmVsOiAnU2F2ZScsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fbW9kZWxfX3N1Ym1pdCddLFxuICAgICAgICBldmVudE5hbWU6ICdNb2RlbEZvcm0uU2F2ZSdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICduZXcnLFxuICAgICAgICBsYWJlbDogJ05ldyBNb2RlbCcsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fbW9kZWxfX25ldyddLFxuICAgICAgICBldmVudE5hbWU6ICdNb2RlbEZvcm0uTmV3UmVxdWVzdCdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBsYWJlbDogJ0FkZCBSZXN1bHRzIHRvIEFnZ3JlZ2F0ZScsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fbW9kZWxfX2FnZ3JlZ2F0ZSddLFxuICAgICAgICBldmVudE5hbWU6ICdNb2RlbEZvcm0uQWRkVG9BZ2dyZWdhdGUnXG4gICAgICB9KV1cbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YS5jbGFzc2VzID0gW1wiZm9ybV9fbW9kZWxcIl1cbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICByZXR1cm4gSE0uaW52b2tlKCdNb2RlbEZvcm0uTW9kaWZ5RXhwb3J0Jywgc3VwZXIuZXhwb3J0KCksIHsgdHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSB9KTtcbiAgICB9XG5cbiAgICBpbXBvcnQoZGF0YSkge1xuICAgICAgcmV0dXJuIHN1cGVyLmltcG9ydChITS5pbnZva2UoJ01vZGVsRm9ybS5Nb2RpZnlJbXBvcnQnLCBkYXRhLCB7IHR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgfSkpO1xuICAgIH1cblxuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJoaXN0b3JpY2FsXCI6XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3NpbXVsYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5hZ2dyZWdhdGUnKSkge1xuICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLnNob3coKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJuZXdcIjpcbiAgICAgICAgICBzd2l0Y2ggKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3NpbXVsYXRlJykudmlldygpLnNob3coKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgTW9kZWxGb3JtLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbEZvcm0oeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gTW9kZWxGb3JtO1xufSlcbiJdfQ==
