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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2Zvcm0vZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiQnV0dG9uIiwiU2xpZGVyRmllbGQiLCJNb2RlbEZvcm0iLCJzZXR0aW5ncyIsIm1vZGVsRGF0YSIsImZpZWxkcyIsImludm9rZSIsInR5cGUiLCJtb2RlbFR5cGUiLCJjb25maWciLCJmaWVsZENvbmZpZyIsInB1c2giLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwibWluIiwiZXVnbGVuYUNvdW50Q29uZmlnIiwicmFuZ2UiLCJtYXgiLCJzdGVwcyIsImRlZmF1bHRWYWx1ZSIsImluaXRpYWxWYWx1ZSIsImJ1dHRvbnMiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiX21vZGVsIiwiZ2V0IiwiZGF0YSIsInN0YXRlIiwiZ2V0QnV0dG9uIiwidmlldyIsImhpZGUiLCJzaG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxPQUFPSixRQUFRLDBCQUFSLENBQWI7QUFBQSxNQUNFSyxTQUFTTCxRQUFRLDZCQUFSLENBRFg7QUFBQSxNQUVFTSxjQUFjTixRQUFRLGtDQUFSLENBRmhCOztBQUxrQixNQVNaTyxTQVRZO0FBQUE7O0FBVWhCLHlCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFNBQVQsQ0FBbUJDLE1BQW5CLEdBQTRCUCxHQUFHUSxNQUFILENBQVUsa0JBQVYsRUFBOEIsRUFBOUIsRUFBa0M7QUFDNURDLGNBQU1KLFNBQVNDLFNBQVQsQ0FBbUJJLFNBRG1DO0FBRTVEQyxnQkFBUU4sU0FBU0MsU0FBVCxDQUFtQk07QUFGaUMsT0FBbEMsQ0FBNUI7QUFJQVAsZUFBU0MsU0FBVCxDQUFtQkMsTUFBbkIsQ0FBMEJNLElBQTFCLENBQStCVixZQUFZVyxNQUFaLENBQW1CO0FBQ2hEQyxZQUFJLE9BRDRDO0FBRWhEQyxlQUFPLG1CQUZ5QztBQUdoREMsYUFBS1osU0FBU0MsU0FBVCxDQUFtQlksa0JBQW5CLENBQXNDQyxLQUF0QyxDQUE0QyxDQUE1QyxDQUgyQztBQUloREMsYUFBS2YsU0FBU0MsU0FBVCxDQUFtQlksa0JBQW5CLENBQXNDQyxLQUF0QyxDQUE0QyxDQUE1QyxDQUoyQztBQUtoREUsZUFBT2hCLFNBQVNDLFNBQVQsQ0FBbUJZLGtCQUFuQixDQUFzQ0MsS0FBdEMsQ0FBNEMsQ0FBNUMsSUFBaURkLFNBQVNDLFNBQVQsQ0FBbUJZLGtCQUFuQixDQUFzQ0MsS0FBdEMsQ0FBNEMsQ0FBNUMsQ0FMUjtBQU1oREcsc0JBQWNqQixTQUFTQyxTQUFULENBQW1CWSxrQkFBbkIsQ0FBc0NLO0FBTkosT0FBbkIsQ0FBL0I7QUFRQWxCLGVBQVNDLFNBQVQsQ0FBbUJrQixPQUFuQixHQUE2QixDQUFDdEIsT0FBT1ksTUFBUCxDQUFjO0FBQzFDQyxZQUFJLFVBRHNDO0FBRTFDQyxlQUFPLGdCQUZtQztBQUcxQ1MsaUJBQVMsQ0FBQyx1QkFBRCxDQUhpQztBQUkxQ0MsbUJBQVc7QUFKK0IsT0FBZCxDQUFELEVBS3pCeEIsT0FBT1ksTUFBUCxDQUFjO0FBQ2hCQyxZQUFJLFFBRFk7QUFFaEJDLGVBQU8sTUFGUztBQUdoQlMsaUJBQVMsQ0FBQyxxQkFBRCxDQUhPO0FBSWhCQyxtQkFBVztBQUpLLE9BQWQsQ0FMeUIsRUFVekJ4QixPQUFPWSxNQUFQLENBQWM7QUFDaEJDLFlBQUksS0FEWTtBQUVoQkMsZUFBTyxXQUZTO0FBR2hCUyxpQkFBUyxDQUFDLGtCQUFELENBSE87QUFJaEJDLG1CQUFXO0FBSkssT0FBZCxDQVZ5QixFQWV6QnhCLE9BQU9ZLE1BQVAsQ0FBYztBQUNoQkMsWUFBSSxXQURZO0FBRWhCQyxlQUFPLDBCQUZTO0FBR2hCUyxpQkFBUyxDQUFDLHdCQUFELENBSE87QUFJaEJDLG1CQUFXO0FBSkssT0FBZCxDQWZ5QixDQUE3QjtBQXFCQXJCLGVBQVNDLFNBQVQsQ0FBbUJtQixPQUFuQixHQUE2QixDQUFDLGFBQUQsQ0FBN0I7QUFsQ3lCLG1IQW1DbkJwQixRQW5DbUI7QUFvQzFCOztBQTlDZTtBQUFBO0FBQUEsZ0NBZ0RQO0FBQ1AsZUFBT0wsR0FBR1EsTUFBSCxDQUFVLHdCQUFWLGdIQUFvRCxFQUFFQyxNQUFNLEtBQUtrQixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsV0FBaEIsQ0FBUixFQUFwRCxDQUFQO0FBQ0Q7QUFsRGU7QUFBQTtBQUFBLDhCQW9EVEMsSUFwRFMsRUFvREg7QUFDWCw0SEFBb0I3QixHQUFHUSxNQUFILENBQVUsd0JBQVYsRUFBb0NxQixJQUFwQyxFQUEwQyxFQUFFcEIsTUFBTSxLQUFLa0IsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFdBQWhCLENBQVIsRUFBMUMsQ0FBcEI7QUFDRDtBQXREZTtBQUFBO0FBQUEsK0JBd0RQRSxLQXhETyxFQXdEQTtBQUNkLGdCQUFRQSxLQUFSO0FBQ0UsZUFBSyxZQUFMO0FBQ0UsaUJBQUtDLFNBQUwsQ0FBZSxRQUFmLEVBQXlCQyxJQUF6QixHQUFnQ0MsSUFBaEM7QUFDQSxpQkFBS0YsU0FBTCxDQUFlLFVBQWYsRUFBMkJDLElBQTNCLEdBQWtDQyxJQUFsQztBQUNBLGlCQUFLRixTQUFMLENBQWUsV0FBZixFQUE0QkMsSUFBNUIsR0FBbUNFLElBQW5DO0FBQ0EsaUJBQUtILFNBQUwsQ0FBZSxLQUFmLEVBQXNCQyxJQUF0QixHQUE2QkUsSUFBN0I7QUFDRjtBQUNBLGVBQUssS0FBTDtBQUNFLGlCQUFLSCxTQUFMLENBQWUsUUFBZixFQUF5QkMsSUFBekIsR0FBZ0NFLElBQWhDO0FBQ0EsaUJBQUtILFNBQUwsQ0FBZSxVQUFmLEVBQTJCQyxJQUEzQixHQUFrQ0UsSUFBbEM7QUFDQSxpQkFBS0gsU0FBTCxDQUFlLFdBQWYsRUFBNEJDLElBQTVCLEdBQW1DQyxJQUFuQztBQUNBLGlCQUFLRixTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJDLElBQTdCO0FBQ0Y7QUFaRjtBQWNEO0FBdkVlOztBQUFBO0FBQUEsSUFTTWhDLElBVE47O0FBMEVsQkcsWUFBVVUsTUFBVixHQUFtQixVQUFDZSxJQUFELEVBQVU7QUFDM0IsV0FBTyxJQUFJekIsU0FBSixDQUFjLEVBQUVFLFdBQVd1QixJQUFiLEVBQWQsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT3pCLFNBQVA7QUFDRCxDQS9FRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbC9mb3JtL2Zvcm0uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
