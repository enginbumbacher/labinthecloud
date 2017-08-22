'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Form = require('core/component/form/form'),
      SelectField = require('core/component/selectfield/field');

  var ModelHistoryForm = function (_Form) {
    _inherits(ModelHistoryForm, _Form);

    function ModelHistoryForm() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModelHistoryForm);

      var defaults = {
        modelData: {
          classes: ["form__model__history"],
          fields: [SelectField.create({
            id: "model_history_id",
            label: 'Model',
            value: "_new",
            classes: [],
            options: { "_new": "(New Model)" }
          })],
          buttons: []
        }
      };
      settings = Utils.ensureDefaults(settings, defaults);
      return _possibleConstructorReturn(this, (ModelHistoryForm.__proto__ || Object.getPrototypeOf(ModelHistoryForm)).call(this, settings));
    }

    _createClass(ModelHistoryForm, [{
      key: 'update',
      value: function update() {
        var _this2 = this;

        var student_id = Globals.get('student_id');
        if (student_id) {
          return Utils.promiseAjax('/api/v1/EuglenaModels', {
            data: {
              filter: {
                where: {
                  and: [{ studentId: student_id }, { modelType: this._model.get('modelType') }, { lab: Globals.get('AppConfig.lab') }, { simulated: false }]
                }
              }
            }
          }).then(function (data) {
            var historySelector = _this2.getField('model_history_id');
            var val = historySelector.value();
            historySelector.clearOptions();
            historySelector.addOption({ value: "_new", label: "(New Model)" });
            data.sort(function (a, b) {
              return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
            });
            data.forEach(function (datum, ind) {
              historySelector.addOption({ value: datum.id, label: datum.name });
            });
            if (val == '_new' || data.map(function (a) {
              return a.id;
            }).includes(parseInt(val))) {
              historySelector.setValue(val);
            } else if (data.length) {
              historySelector.setValue(data[0].id);
            } else {
              historySelector.setValue('_new');
            }
          });
        } else {
          this.getField('model_history_id').clearOptions();
          return Promise.resolve(true);
        }
      }
    }, {
      key: 'getHistory',
      value: function getHistory() {
        return Object.keys(this.getField('model_history_id').getOptions()).filter(function (item) {
          return item != '_new';
        });
      }
    }, {
      key: 'historyCount',
      value: function historyCount() {
        return this.getHistory().length;
      }
    }]);

    return ModelHistoryForm;
  }(Form);

  ModelHistoryForm.create = function (data) {
    return new ModelHistoryForm({ modelData: data });
  };

  return ModelHistoryForm;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2hpc3RvcnkvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJNb2RlbEhpc3RvcnlGb3JtIiwic2V0dGluZ3MiLCJkZWZhdWx0cyIsIm1vZGVsRGF0YSIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwidmFsdWUiLCJvcHRpb25zIiwiYnV0dG9ucyIsImVuc3VyZURlZmF1bHRzIiwic3R1ZGVudF9pZCIsImdldCIsInByb21pc2VBamF4IiwiZGF0YSIsImZpbHRlciIsIndoZXJlIiwiYW5kIiwic3R1ZGVudElkIiwibW9kZWxUeXBlIiwiX21vZGVsIiwibGFiIiwic2ltdWxhdGVkIiwidGhlbiIsImhpc3RvcnlTZWxlY3RvciIsImdldEZpZWxkIiwidmFsIiwiY2xlYXJPcHRpb25zIiwiYWRkT3B0aW9uIiwic29ydCIsImEiLCJiIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsImdldFRpbWUiLCJmb3JFYWNoIiwiZGF0dW0iLCJpbmQiLCJuYW1lIiwibWFwIiwiaW5jbHVkZXMiLCJwYXJzZUludCIsInNldFZhbHVlIiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsIml0ZW0iLCJnZXRIaXN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksT0FBT0osUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUssY0FBY0wsUUFBUSxrQ0FBUixDQURoQjs7QUFMa0IsTUFRWk0sZ0JBUlk7QUFBQTs7QUFTaEIsZ0NBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QixVQUFNQyxXQUFXO0FBQ2ZDLG1CQUFXO0FBQ1RDLG1CQUFTLENBQUMsc0JBQUQsQ0FEQTtBQUVUQyxrQkFBUSxDQUFDTixZQUFZTyxNQUFaLENBQW1CO0FBQzFCQyxnQkFBSSxrQkFEc0I7QUFFMUJDLG1CQUFPLE9BRm1CO0FBRzFCQyxtQkFBTyxNQUhtQjtBQUkxQkwscUJBQVMsRUFKaUI7QUFLMUJNLHFCQUFTLEVBQUUsUUFBUSxhQUFWO0FBTGlCLFdBQW5CLENBQUQsQ0FGQztBQVNUQyxtQkFBUztBQVRBO0FBREksT0FBakI7QUFhQVYsaUJBQVdMLE1BQU1nQixjQUFOLENBQXFCWCxRQUFyQixFQUErQkMsUUFBL0IsQ0FBWDtBQWR5QixpSUFlbkJELFFBZm1CO0FBZ0IxQjs7QUF6QmU7QUFBQTtBQUFBLCtCQTJCUDtBQUFBOztBQUNQLFlBQUlZLGFBQWFsQixRQUFRbUIsR0FBUixDQUFZLFlBQVosQ0FBakI7QUFDQSxZQUFJRCxVQUFKLEVBQWdCO0FBQ2QsaUJBQU9qQixNQUFNbUIsV0FBTixDQUFrQix1QkFBbEIsRUFBMkM7QUFDaERDLGtCQUFNO0FBQ0pDLHNCQUFRO0FBQ05DLHVCQUFPO0FBQ0xDLHVCQUFLLENBQ0gsRUFBRUMsV0FBV1AsVUFBYixFQURHLEVBRUgsRUFBRVEsV0FBVyxLQUFLQyxNQUFMLENBQVlSLEdBQVosQ0FBZ0IsV0FBaEIsQ0FBYixFQUZHLEVBR0gsRUFBRVMsS0FBSzVCLFFBQVFtQixHQUFSLENBQVksZUFBWixDQUFQLEVBSEcsRUFJSCxFQUFFVSxXQUFXLEtBQWIsRUFKRztBQURBO0FBREQ7QUFESjtBQUQwQyxXQUEzQyxFQWFKQyxJQWJJLENBYUMsVUFBQ1QsSUFBRCxFQUFVO0FBQ2hCLGdCQUFNVSxrQkFBa0IsT0FBS0MsUUFBTCxDQUFjLGtCQUFkLENBQXhCO0FBQ0EsZ0JBQU1DLE1BQU1GLGdCQUFnQmpCLEtBQWhCLEVBQVo7QUFDQWlCLDRCQUFnQkcsWUFBaEI7QUFDQUgsNEJBQWdCSSxTQUFoQixDQUEwQixFQUFFckIsT0FBTyxNQUFULEVBQWlCRCxPQUFPLGFBQXhCLEVBQTFCO0FBQ0FRLGlCQUFLZSxJQUFMLENBQVUsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7QUFDbEIscUJBQVEsSUFBSUMsSUFBSixDQUFTRCxFQUFFRSxZQUFYLENBQUQsQ0FBMkJDLE9BQTNCLEtBQXdDLElBQUlGLElBQUosQ0FBU0YsRUFBRUcsWUFBWCxDQUFELENBQTJCQyxPQUEzQixFQUE5QztBQUNELGFBRkQ7QUFHQXBCLGlCQUFLcUIsT0FBTCxDQUFhLFVBQUNDLEtBQUQsRUFBUUMsR0FBUixFQUFnQjtBQUMzQmIsOEJBQWdCSSxTQUFoQixDQUEwQixFQUFFckIsT0FBTzZCLE1BQU0vQixFQUFmLEVBQW1CQyxPQUFPOEIsTUFBTUUsSUFBaEMsRUFBMUI7QUFDRCxhQUZEO0FBR0EsZ0JBQUlaLE9BQU8sTUFBUCxJQUFpQlosS0FBS3lCLEdBQUwsQ0FBUyxVQUFDVCxDQUFELEVBQU87QUFBRSxxQkFBT0EsRUFBRXpCLEVBQVQ7QUFBYSxhQUEvQixFQUFpQ21DLFFBQWpDLENBQTBDQyxTQUFTZixHQUFULENBQTFDLENBQXJCLEVBQStFO0FBQzdFRiw4QkFBZ0JrQixRQUFoQixDQUF5QmhCLEdBQXpCO0FBQ0QsYUFGRCxNQUVPLElBQUlaLEtBQUs2QixNQUFULEVBQWlCO0FBQ3RCbkIsOEJBQWdCa0IsUUFBaEIsQ0FBeUI1QixLQUFLLENBQUwsRUFBUVQsRUFBakM7QUFDRCxhQUZNLE1BRUE7QUFDTG1CLDhCQUFnQmtCLFFBQWhCLENBQXlCLE1BQXpCO0FBQ0Q7QUFDRixXQS9CTSxDQUFQO0FBZ0NELFNBakNELE1BaUNPO0FBQ0wsZUFBS2pCLFFBQUwsQ0FBYyxrQkFBZCxFQUFrQ0UsWUFBbEM7QUFDQSxpQkFBT2lCLFFBQVFDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBQ0Y7QUFsRWU7QUFBQTtBQUFBLG1DQW9FSDtBQUNYLGVBQU9DLE9BQU9DLElBQVAsQ0FBWSxLQUFLdEIsUUFBTCxDQUFjLGtCQUFkLEVBQWtDdUIsVUFBbEMsRUFBWixFQUE0RGpDLE1BQTVELENBQW1FLFVBQUNrQyxJQUFELEVBQVU7QUFDbEYsaUJBQU9BLFFBQVEsTUFBZjtBQUNELFNBRk0sQ0FBUDtBQUdEO0FBeEVlO0FBQUE7QUFBQSxxQ0EwRUQ7QUFDYixlQUFPLEtBQUtDLFVBQUwsR0FBa0JQLE1BQXpCO0FBQ0Q7QUE1RWU7O0FBQUE7QUFBQSxJQVFhL0MsSUFSYjs7QUErRWxCRSxtQkFBaUJNLE1BQWpCLEdBQTBCLFVBQUNVLElBQUQsRUFBVTtBQUNsQyxXQUFPLElBQUloQixnQkFBSixDQUFxQixFQUFFRyxXQUFXYSxJQUFiLEVBQXJCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9oQixnQkFBUDtBQUNELENBcEZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL2hpc3RvcnkvZm9ybS5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
