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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2hpc3RvcnkvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJNb2RlbEhpc3RvcnlGb3JtIiwic2V0dGluZ3MiLCJkZWZhdWx0cyIsIm1vZGVsRGF0YSIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwidmFsdWUiLCJvcHRpb25zIiwiYnV0dG9ucyIsImVuc3VyZURlZmF1bHRzIiwic3R1ZGVudF9pZCIsImdldCIsInByb21pc2VBamF4IiwiZGF0YSIsImZpbHRlciIsIndoZXJlIiwiYW5kIiwic3R1ZGVudElkIiwibW9kZWxUeXBlIiwiX21vZGVsIiwibGFiIiwic2ltdWxhdGVkIiwidGhlbiIsImhpc3RvcnlTZWxlY3RvciIsImdldEZpZWxkIiwidmFsIiwiY2xlYXJPcHRpb25zIiwiYWRkT3B0aW9uIiwic29ydCIsImEiLCJiIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsImdldFRpbWUiLCJmb3JFYWNoIiwiZGF0dW0iLCJpbmQiLCJuYW1lIiwibWFwIiwiaW5jbHVkZXMiLCJwYXJzZUludCIsInNldFZhbHVlIiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsIml0ZW0iLCJnZXRIaXN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksT0FBT0osUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUssY0FBY0wsUUFBUSxrQ0FBUixDQURoQjs7QUFMa0IsTUFRWk0sZ0JBUlk7QUFBQTs7QUFTaEIsZ0NBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QixVQUFNQyxXQUFXO0FBQ2ZDLG1CQUFXO0FBQ1RDLG1CQUFTLENBQUMsc0JBQUQsQ0FEQTtBQUVUQyxrQkFBUSxDQUFDTixZQUFZTyxNQUFaLENBQW1CO0FBQzFCQyxnQkFBSSxrQkFEc0I7QUFFMUJDLG1CQUFPLE9BRm1CO0FBRzFCQyxtQkFBTyxNQUhtQjtBQUkxQkwscUJBQVMsRUFKaUI7QUFLMUJNLHFCQUFTLEVBQUUsUUFBUSxhQUFWO0FBTGlCLFdBQW5CLENBQUQsQ0FGQztBQVNUQyxtQkFBUztBQVRBO0FBREksT0FBakI7QUFhQVYsaUJBQVdMLE1BQU1nQixjQUFOLENBQXFCWCxRQUFyQixFQUErQkMsUUFBL0IsQ0FBWDtBQWR5QixpSUFlbkJELFFBZm1CO0FBZ0IxQjs7QUF6QmU7QUFBQTtBQUFBLCtCQTJCUDtBQUFBOztBQUNQLFlBQUlZLGFBQWFsQixRQUFRbUIsR0FBUixDQUFZLFlBQVosQ0FBakI7QUFDQSxZQUFJRCxVQUFKLEVBQWdCO0FBQ2QsaUJBQU9qQixNQUFNbUIsV0FBTixDQUFrQix1QkFBbEIsRUFBMkM7QUFDaERDLGtCQUFNO0FBQ0pDLHNCQUFRO0FBQ05DLHVCQUFPO0FBQ0xDLHVCQUFLLENBQ0gsRUFBRUMsV0FBV1AsVUFBYixFQURHLEVBRUgsRUFBRVEsV0FBVyxLQUFLQyxNQUFMLENBQVlSLEdBQVosQ0FBZ0IsV0FBaEIsQ0FBYixFQUZHLEVBR0gsRUFBRVMsS0FBSzVCLFFBQVFtQixHQUFSLENBQVksZUFBWixDQUFQLEVBSEcsRUFJSCxFQUFFVSxXQUFXLEtBQWIsRUFKRztBQURBO0FBREQ7QUFESjtBQUQwQyxXQUEzQyxFQWFKQyxJQWJJLENBYUMsVUFBQ1QsSUFBRCxFQUFVO0FBQ2hCLGdCQUFNVSxrQkFBa0IsT0FBS0MsUUFBTCxDQUFjLGtCQUFkLENBQXhCO0FBQ0EsZ0JBQU1DLE1BQU1GLGdCQUFnQmpCLEtBQWhCLEVBQVo7QUFDQWlCLDRCQUFnQkcsWUFBaEI7QUFDQUgsNEJBQWdCSSxTQUFoQixDQUEwQixFQUFFckIsT0FBTyxNQUFULEVBQWlCRCxPQUFPLGFBQXhCLEVBQTFCO0FBQ0FRLGlCQUFLZSxJQUFMLENBQVUsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7QUFDbEIscUJBQVEsSUFBSUMsSUFBSixDQUFTRCxFQUFFRSxZQUFYLENBQUQsQ0FBMkJDLE9BQTNCLEtBQXdDLElBQUlGLElBQUosQ0FBU0YsRUFBRUcsWUFBWCxDQUFELENBQTJCQyxPQUEzQixFQUE5QztBQUNELGFBRkQ7QUFHQXBCLGlCQUFLcUIsT0FBTCxDQUFhLFVBQUNDLEtBQUQsRUFBUUMsR0FBUixFQUFnQjtBQUMzQmIsOEJBQWdCSSxTQUFoQixDQUEwQixFQUFFckIsT0FBTzZCLE1BQU0vQixFQUFmLEVBQW1CQyxPQUFPOEIsTUFBTUUsSUFBaEMsRUFBMUI7QUFDRCxhQUZEO0FBR0EsZ0JBQUlaLE9BQU8sTUFBUCxJQUFpQlosS0FBS3lCLEdBQUwsQ0FBUyxVQUFDVCxDQUFELEVBQU87QUFBRSxxQkFBT0EsRUFBRXpCLEVBQVQ7QUFBYSxhQUEvQixFQUFpQ21DLFFBQWpDLENBQTBDQyxTQUFTZixHQUFULENBQTFDLENBQXJCLEVBQStFO0FBQzdFRiw4QkFBZ0JrQixRQUFoQixDQUF5QmhCLEdBQXpCO0FBQ0QsYUFGRCxNQUVPLElBQUlaLEtBQUs2QixNQUFULEVBQWlCO0FBQ3RCbkIsOEJBQWdCa0IsUUFBaEIsQ0FBeUI1QixLQUFLLENBQUwsRUFBUVQsRUFBakM7QUFDRCxhQUZNLE1BRUE7QUFDTG1CLDhCQUFnQmtCLFFBQWhCLENBQXlCLE1BQXpCO0FBQ0Q7QUFDRixXQS9CTSxDQUFQO0FBZ0NELFNBakNELE1BaUNPO0FBQ0wsZUFBS2pCLFFBQUwsQ0FBYyxrQkFBZCxFQUFrQ0UsWUFBbEM7QUFDQSxpQkFBT2lCLFFBQVFDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBQ0Y7QUFsRWU7QUFBQTtBQUFBLG1DQW9FSDtBQUNYLGVBQU9DLE9BQU9DLElBQVAsQ0FBWSxLQUFLdEIsUUFBTCxDQUFjLGtCQUFkLEVBQWtDdUIsVUFBbEMsRUFBWixFQUE0RGpDLE1BQTVELENBQW1FLFVBQUNrQyxJQUFELEVBQVU7QUFDbEYsaUJBQU9BLFFBQVEsTUFBZjtBQUNELFNBRk0sQ0FBUDtBQUdEO0FBeEVlO0FBQUE7QUFBQSxxQ0EwRUQ7QUFDYixlQUFPLEtBQUtDLFVBQUwsR0FBa0JQLE1BQXpCO0FBQ0Q7QUE1RWU7O0FBQUE7QUFBQSxJQVFhL0MsSUFSYjs7QUErRWxCRSxtQkFBaUJNLE1BQWpCLEdBQTBCLFVBQUNVLElBQUQsRUFBVTtBQUNsQyxXQUFPLElBQUloQixnQkFBSixDQUFxQixFQUFFRyxXQUFXYSxJQUFiLEVBQXJCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9oQixnQkFBUDtBQUNELENBcEZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL2hpc3RvcnkvZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKTtcblxuICBjbGFzcyBNb2RlbEhpc3RvcnlGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAgIG1vZGVsRGF0YToge1xuICAgICAgICAgIGNsYXNzZXM6IFtcImZvcm1fX21vZGVsX19oaXN0b3J5XCJdLFxuICAgICAgICAgIGZpZWxkczogW1NlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogXCJtb2RlbF9oaXN0b3J5X2lkXCIsXG4gICAgICAgICAgICBsYWJlbDogJ01vZGVsJyxcbiAgICAgICAgICAgIHZhbHVlOiBcIl9uZXdcIixcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogeyBcIl9uZXdcIjogXCIoTmV3IE1vZGVsKVwiIH1cbiAgICAgICAgICB9KV0sXG4gICAgICAgICAgYnV0dG9uczogW11cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHNldHRpbmdzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoc2V0dGluZ3MsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICBsZXQgc3R1ZGVudF9pZCA9IEdsb2JhbHMuZ2V0KCdzdHVkZW50X2lkJyk7XG4gICAgICBpZiAoc3R1ZGVudF9pZCkge1xuICAgICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXVnbGVuYU1vZGVscycsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICAgIHsgc3R1ZGVudElkOiBzdHVkZW50X2lkIH0sXG4gICAgICAgICAgICAgICAgICB7IG1vZGVsVHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdtb2RlbFR5cGUnKSB9LFxuICAgICAgICAgICAgICAgICAgeyBsYWI6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJykgfSxcbiAgICAgICAgICAgICAgICAgIHsgc2ltdWxhdGVkOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlzdG9yeVNlbGVjdG9yID0gdGhpcy5nZXRGaWVsZCgnbW9kZWxfaGlzdG9yeV9pZCcpO1xuICAgICAgICAgIGNvbnN0IHZhbCA9IGhpc3RvcnlTZWxlY3Rvci52YWx1ZSgpO1xuICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5jbGVhck9wdGlvbnMoKTtcbiAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuYWRkT3B0aW9uKHsgdmFsdWU6IFwiX25ld1wiLCBsYWJlbDogXCIoTmV3IE1vZGVsKVwifSk7XG4gICAgICAgICAgZGF0YS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKGIuZGF0ZV9jcmVhdGVkKSkuZ2V0VGltZSgpIC0gKG5ldyBEYXRlKGEuZGF0ZV9jcmVhdGVkKSkuZ2V0VGltZSgpXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGF0YS5mb3JFYWNoKChkYXR1bSwgaW5kKSA9PiB7XG4gICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuYWRkT3B0aW9uKHsgdmFsdWU6IGRhdHVtLmlkLCBsYWJlbDogZGF0dW0ubmFtZSB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAodmFsID09ICdfbmV3JyB8fCBkYXRhLm1hcCgoYSkgPT4geyByZXR1cm4gYS5pZCB9KS5pbmNsdWRlcyhwYXJzZUludCh2YWwpKSkge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKHZhbCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKGRhdGFbMF0uaWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUoJ19uZXcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdldEZpZWxkKCdtb2RlbF9oaXN0b3J5X2lkJykuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGlzdG9yeSgpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmdldEZpZWxkKCdtb2RlbF9oaXN0b3J5X2lkJykuZ2V0T3B0aW9ucygpKS5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0gIT0gJ19uZXcnO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGlzdG9yeUNvdW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SGlzdG9yeSgpLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICBNb2RlbEhpc3RvcnlGb3JtLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbEhpc3RvcnlGb3JtKHsgbW9kZWxEYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcmV0dXJuIE1vZGVsSGlzdG9yeUZvcm07XG59KVxuIl19
