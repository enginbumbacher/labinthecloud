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
      settings.modelData.fields.push(SelectField.create({
        id: 'initialization',
        label: "Initial Position of Euglena:",
        value: settings.modelData.euglenaInitConfig.initialValue,
        classes: [],
        options: settings.modelData.euglenaInitConfig.options,
        description: 'Set the initial position of models to be simulated.'
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiQnV0dG9uIiwiU2VsZWN0RmllbGQiLCJNb2RlbEZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsRGF0YSIsImZpZWxkcyIsImludm9rZSIsInR5cGUiLCJtb2RlbFR5cGUiLCJjb25maWciLCJmaWVsZENvbmZpZyIsInB1c2giLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwidmFsdWUiLCJldWdsZW5hQ291bnRDb25maWciLCJpbml0aWFsVmFsdWUiLCJjbGFzc2VzIiwib3B0aW9ucyIsImRlc2NyaXB0aW9uIiwiZXVnbGVuYUluaXRDb25maWciLCJidXR0b25zIiwiZXZlbnROYW1lIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsInN0YXRlIiwiZ2V0QnV0dG9uIiwidmlldyIsImhpZGUiLCJzaG93IiwidG9Mb3dlckNhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLE9BQU9KLFFBQVEsMEJBQVIsQ0FBYjtBQUFBLE1BQ0VLLFNBQVNMLFFBQVEsNkJBQVIsQ0FEWDs7QUFFRTtBQUNBTSxnQkFBY04sUUFBUSxrQ0FBUixDQUhoQjs7QUFMa0IsTUFVWk8sU0FWWTtBQUFBOztBQVdoQix5QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxTQUFULENBQW1CQyxNQUFuQixHQUE0QlAsR0FBR1EsTUFBSCxDQUFVLGtCQUFWLEVBQThCLEVBQTlCLEVBQWtDO0FBQzVEQyxjQUFNSixTQUFTQyxTQUFULENBQW1CSSxT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QVVVLE1BQVYsR0FBbUIsVUFBQ2MsSUFBRCxFQUFVO0FBQzNCLFdBQU8sSUFBSXhCLFNBQUosQ0FBYyxFQUFFRSxXQUFXc0IsSUFBYixFQUFkLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU94QixTQUFQO0FBQ0QsQ0F2SEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvZm9ybS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyksXG4gICAgLy9TbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NsaWRlcmZpZWxkL2ZpZWxkJylcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJyk7XG5cbiAgY2xhc3MgTW9kZWxGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmZpZWxkcyA9IEhNLmludm9rZSgnTW9kZWxGb3JtLkZpZWxkcycsIFtdLCB7XG4gICAgICAgIHR5cGU6IHNldHRpbmdzLm1vZGVsRGF0YS5tb2RlbFR5cGUsXG4gICAgICAgIGNvbmZpZzogc2V0dGluZ3MubW9kZWxEYXRhLmZpZWxkQ29uZmlnXG4gICAgICB9KTtcbiAgICAgIC8qXG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuZmllbGRzLnB1c2goU2xpZGVyRmllbGQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdjb3VudCcsXG4gICAgICAgIGxhYmVsOiBcIk51bWJlciBvZiBFdWdsZW5hXCIsXG4gICAgICAgIG1pbjogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5yYW5nZVswXSxcbiAgICAgICAgbWF4OiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLnJhbmdlWzFdLFxuICAgICAgICBzdGVwczogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5yYW5nZVsxXSAtIHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcucmFuZ2VbMF0sXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFDb3VudENvbmZpZy5pbml0aWFsVmFsdWVcbiAgICAgIH0pKVxuICAgICAgKi9cbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YS5maWVsZHMucHVzaChTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICBpZDogJ2NvdW50JyxcbiAgICAgICAgbGFiZWw6IFwiTnVtYmVyIG9mIEV1Z2xlbmE6XCIsXG4gICAgICAgIHZhbHVlOiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUNvdW50Q29uZmlnLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgIG9wdGlvbnM6IHNldHRpbmdzLm1vZGVsRGF0YS5ldWdsZW5hQ291bnRDb25maWcub3B0aW9ucyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTZXQgdGhlIG51bWJlciBvZiBtb2RlbHMgdG8gYmUgc2ltdWxhdGVkLidcbiAgICAgIH0pKVxuICAgICAgc2V0dGluZ3MubW9kZWxEYXRhLmZpZWxkcy5wdXNoKFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnaW5pdGlhbGl6YXRpb24nLFxuICAgICAgICBsYWJlbDogXCJJbml0aWFsIFBvc2l0aW9uIG9mIEV1Z2xlbmE6XCIsXG4gICAgICAgIHZhbHVlOiBzZXR0aW5ncy5tb2RlbERhdGEuZXVnbGVuYUluaXRDb25maWcuaW5pdGlhbFZhbHVlLFxuICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgb3B0aW9uczogc2V0dGluZ3MubW9kZWxEYXRhLmV1Z2xlbmFJbml0Q29uZmlnLm9wdGlvbnMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IHRoZSBpbml0aWFsIHBvc2l0aW9uIG9mIG1vZGVscyB0byBiZSBzaW11bGF0ZWQuJ1xuICAgICAgfSkpXG4gICAgICBzZXR0aW5ncy5tb2RlbERhdGEuYnV0dG9ucyA9IFtCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzaW11bGF0ZScsXG4gICAgICAgIGxhYmVsOiAnUnVuIE1vZGVsJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19tb2RlbF9fc2ltdWxhdGUnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnTW9kZWxGb3JtLlNpbXVsYXRlJ1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3N1Ym1pdCcsXG4gICAgICAgIGxhYmVsOiAnU2F2ZScsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fbW9kZWxfX3N1Ym1pdCddLFxuICAgICAgICBldmVudE5hbWU6ICdNb2RlbEZvcm0uU2F2ZSdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICduZXcnLFxuICAgICAgICBsYWJlbDogJ05ldyBNb2RlbCcsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fbW9kZWxfX25ldyddLFxuICAgICAgICBldmVudE5hbWU6ICdNb2RlbEZvcm0uTmV3UmVxdWVzdCdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBsYWJlbDogJ0FkZCBSZXN1bHRzIHRvIEFnZ3JlZ2F0ZScsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fbW9kZWxfX2FnZ3JlZ2F0ZSddLFxuICAgICAgICBldmVudE5hbWU6ICdNb2RlbEZvcm0uQWRkVG9BZ2dyZWdhdGUnXG4gICAgICB9KV1cbiAgICAgIHNldHRpbmdzLm1vZGVsRGF0YS5jbGFzc2VzID0gW1wiZm9ybV9fbW9kZWxcIl1cbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICByZXR1cm4gSE0uaW52b2tlKCdNb2RlbEZvcm0uTW9kaWZ5RXhwb3J0Jywgc3VwZXIuZXhwb3J0KCksIHsgdHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSB9KTtcbiAgICB9XG5cbiAgICBpbXBvcnQoZGF0YSkge1xuICAgICAgcmV0dXJuIHN1cGVyLmltcG9ydChITS5pbnZva2UoJ01vZGVsRm9ybS5Nb2RpZnlJbXBvcnQnLCBkYXRhLCB7IHR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgfSkpO1xuICAgIH1cblxuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJoaXN0b3JpY2FsXCI6XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3NpbXVsYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5hZ2dyZWdhdGUnKSkge1xuICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLnNob3coKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJuZXdcIjpcbiAgICAgICAgICBzd2l0Y2ggKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3NpbXVsYXRlJykudmlldygpLnNob3coKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc2ltdWxhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgTW9kZWxGb3JtLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbEZvcm0oeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gTW9kZWxGb3JtO1xufSlcbiJdfQ==
