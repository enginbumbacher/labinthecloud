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
                  and: [{ studentId: student_id }, { modelType: this._model.get('modelType') }, { lab: Globals.get('AppConfig.lab') }]
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2hpc3RvcnkvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJNb2RlbEhpc3RvcnlGb3JtIiwic2V0dGluZ3MiLCJkZWZhdWx0cyIsIm1vZGVsRGF0YSIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwidmFsdWUiLCJvcHRpb25zIiwiYnV0dG9ucyIsImVuc3VyZURlZmF1bHRzIiwic3R1ZGVudF9pZCIsImdldCIsInByb21pc2VBamF4IiwiZGF0YSIsImZpbHRlciIsIndoZXJlIiwiYW5kIiwic3R1ZGVudElkIiwibW9kZWxUeXBlIiwiX21vZGVsIiwibGFiIiwidGhlbiIsImhpc3RvcnlTZWxlY3RvciIsImdldEZpZWxkIiwidmFsIiwiY2xlYXJPcHRpb25zIiwiYWRkT3B0aW9uIiwic29ydCIsImEiLCJiIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsImdldFRpbWUiLCJmb3JFYWNoIiwiZGF0dW0iLCJpbmQiLCJuYW1lIiwibWFwIiwiaW5jbHVkZXMiLCJwYXJzZUludCIsInNldFZhbHVlIiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsIml0ZW0iLCJnZXRIaXN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksT0FBT0osUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUssY0FBY0wsUUFBUSxrQ0FBUixDQURoQjs7QUFMa0IsTUFRWk0sZ0JBUlk7QUFBQTs7QUFTaEIsZ0NBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QixVQUFNQyxXQUFXO0FBQ2ZDLG1CQUFXO0FBQ1RDLG1CQUFTLENBQUMsc0JBQUQsQ0FEQTtBQUVUQyxrQkFBUSxDQUFDTixZQUFZTyxNQUFaLENBQW1CO0FBQzFCQyxnQkFBSSxrQkFEc0I7QUFFMUJDLG1CQUFPLE9BRm1CO0FBRzFCQyxtQkFBTyxNQUhtQjtBQUkxQkwscUJBQVMsRUFKaUI7QUFLMUJNLHFCQUFTLEVBQUUsUUFBUSxhQUFWO0FBTGlCLFdBQW5CLENBQUQsQ0FGQztBQVNUQyxtQkFBUztBQVRBO0FBREksT0FBakI7QUFhQVYsaUJBQVdMLE1BQU1nQixjQUFOLENBQXFCWCxRQUFyQixFQUErQkMsUUFBL0IsQ0FBWDtBQWR5QixpSUFlbkJELFFBZm1CO0FBZ0IxQjs7QUF6QmU7QUFBQTtBQUFBLCtCQTJCUDtBQUFBOztBQUNQLFlBQUlZLGFBQWFsQixRQUFRbUIsR0FBUixDQUFZLFlBQVosQ0FBakI7QUFDQSxZQUFJRCxVQUFKLEVBQWdCO0FBQ2QsaUJBQU9qQixNQUFNbUIsV0FBTixDQUFrQix1QkFBbEIsRUFBMkM7QUFDaERDLGtCQUFNO0FBQ0pDLHNCQUFRO0FBQ05DLHVCQUFPO0FBQ0xDLHVCQUFLLENBQ0gsRUFBRUMsV0FBV1AsVUFBYixFQURHLEVBRUgsRUFBRVEsV0FBVyxLQUFLQyxNQUFMLENBQVlSLEdBQVosQ0FBZ0IsV0FBaEIsQ0FBYixFQUZHLEVBR0gsRUFBRVMsS0FBSzVCLFFBQVFtQixHQUFSLENBQVksZUFBWixDQUFQLEVBSEc7QUFEQTtBQUREO0FBREo7QUFEMEMsV0FBM0MsRUFZSlUsSUFaSSxDQVlDLFVBQUNSLElBQUQsRUFBVTtBQUNoQixnQkFBTVMsa0JBQWtCLE9BQUtDLFFBQUwsQ0FBYyxrQkFBZCxDQUF4QjtBQUNBLGdCQUFNQyxNQUFNRixnQkFBZ0JoQixLQUFoQixFQUFaO0FBQ0FnQiw0QkFBZ0JHLFlBQWhCO0FBQ0FILDRCQUFnQkksU0FBaEIsQ0FBMEIsRUFBRXBCLE9BQU8sTUFBVCxFQUFpQkQsT0FBTyxhQUF4QixFQUExQjtBQUNBUSxpQkFBS2MsSUFBTCxDQUFVLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQ2xCLHFCQUFRLElBQUlDLElBQUosQ0FBU0QsRUFBRUUsWUFBWCxDQUFELENBQTJCQyxPQUEzQixLQUF3QyxJQUFJRixJQUFKLENBQVNGLEVBQUVHLFlBQVgsQ0FBRCxDQUEyQkMsT0FBM0IsRUFBOUM7QUFDRCxhQUZEO0FBR0FuQixpQkFBS29CLE9BQUwsQ0FBYSxVQUFDQyxLQUFELEVBQVFDLEdBQVIsRUFBZ0I7QUFDM0JiLDhCQUFnQkksU0FBaEIsQ0FBMEIsRUFBRXBCLE9BQU80QixNQUFNOUIsRUFBZixFQUFtQkMsT0FBTzZCLE1BQU1FLElBQWhDLEVBQTFCO0FBQ0QsYUFGRDtBQUdBLGdCQUFJWixPQUFPLE1BQVAsSUFBaUJYLEtBQUt3QixHQUFMLENBQVMsVUFBQ1QsQ0FBRCxFQUFPO0FBQUUscUJBQU9BLEVBQUV4QixFQUFUO0FBQWEsYUFBL0IsRUFBaUNrQyxRQUFqQyxDQUEwQ0MsU0FBU2YsR0FBVCxDQUExQyxDQUFyQixFQUErRTtBQUM3RUYsOEJBQWdCa0IsUUFBaEIsQ0FBeUJoQixHQUF6QjtBQUNELGFBRkQsTUFFTyxJQUFJWCxLQUFLNEIsTUFBVCxFQUFpQjtBQUN0Qm5CLDhCQUFnQmtCLFFBQWhCLENBQXlCM0IsS0FBSyxDQUFMLEVBQVFULEVBQWpDO0FBQ0QsYUFGTSxNQUVBO0FBQ0xrQiw4QkFBZ0JrQixRQUFoQixDQUF5QixNQUF6QjtBQUNEO0FBQ0YsV0E5Qk0sQ0FBUDtBQStCRCxTQWhDRCxNQWdDTztBQUNMLGVBQUtqQixRQUFMLENBQWMsa0JBQWQsRUFBa0NFLFlBQWxDO0FBQ0EsaUJBQU9pQixRQUFRQyxPQUFSLENBQWdCLElBQWhCLENBQVA7QUFDRDtBQUNGO0FBakVlO0FBQUE7QUFBQSxtQ0FtRUg7QUFDWCxlQUFPQyxPQUFPQyxJQUFQLENBQVksS0FBS3RCLFFBQUwsQ0FBYyxrQkFBZCxFQUFrQ3VCLFVBQWxDLEVBQVosRUFBNERoQyxNQUE1RCxDQUFtRSxVQUFDaUMsSUFBRCxFQUFVO0FBQ2xGLGlCQUFPQSxRQUFRLE1BQWY7QUFDRCxTQUZNLENBQVA7QUFHRDtBQXZFZTtBQUFBO0FBQUEscUNBeUVEO0FBQ2IsZUFBTyxLQUFLQyxVQUFMLEdBQWtCUCxNQUF6QjtBQUNEO0FBM0VlOztBQUFBO0FBQUEsSUFRYTlDLElBUmI7O0FBOEVsQkUsbUJBQWlCTSxNQUFqQixHQUEwQixVQUFDVSxJQUFELEVBQVU7QUFDbEMsV0FBTyxJQUFJaEIsZ0JBQUosQ0FBcUIsRUFBRUcsV0FBV2EsSUFBYixFQUFyQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPaEIsZ0JBQVA7QUFDRCxDQW5GRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbC9oaXN0b3J5L2Zvcm0uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
