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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2hpc3RvcnkvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJNb2RlbEhpc3RvcnlGb3JtIiwic2V0dGluZ3MiLCJkZWZhdWx0cyIsIm1vZGVsRGF0YSIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwidmFsdWUiLCJvcHRpb25zIiwiYnV0dG9ucyIsImVuc3VyZURlZmF1bHRzIiwic3R1ZGVudF9pZCIsImdldCIsInByb21pc2VBamF4IiwiZGF0YSIsImZpbHRlciIsIndoZXJlIiwiYW5kIiwic3R1ZGVudElkIiwibW9kZWxUeXBlIiwiX21vZGVsIiwibGFiIiwic2ltdWxhdGVkIiwidGhlbiIsImhpc3RvcnlTZWxlY3RvciIsImdldEZpZWxkIiwidmFsIiwiY2xlYXJPcHRpb25zIiwiYWRkT3B0aW9uIiwic29ydCIsImEiLCJiIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsImdldFRpbWUiLCJmb3JFYWNoIiwiZGF0dW0iLCJpbmQiLCJuYW1lIiwibWFwIiwiaW5jbHVkZXMiLCJwYXJzZUludCIsInNldFZhbHVlIiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsIml0ZW0iLCJnZXRIaXN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksT0FBT0osUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUssY0FBY0wsUUFBUSxrQ0FBUixDQURoQjs7QUFMa0IsTUFRWk0sZ0JBUlk7QUFBQTs7QUFT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TCxDQUFjLGtCQUFkLEVBQWtDdUIsVUFBbEMsRUFBWixFQUE0RGpDLE1BQTVELENBQW1FLFVBQUNrQyxJQUFELEVBQVU7QUFDbEYsaUJBQU9BLFFBQVEsTUFBZjtBQUNELFNBRk0sQ0FBUDtBQUdEO0FBeEVlO0FBQUE7QUFBQSxxQ0EwRUQ7QUFDYixlQUFPLEtBQUtDLFVBQUwsR0FBa0JQLE1BQXpCO0FBQ0Q7QUE1RWU7O0FBQUE7QUFBQSxJQVFhL0MsSUFSYjs7QUErRWxCRSxtQkFBaUJNLE1BQWpCLEdBQTBCLFVBQUNVLElBQUQsRUFBVTtBQUNsQyxXQUFPLElBQUloQixnQkFBSixDQUFxQixFQUFFRyxXQUFXYSxJQUFiLEVBQXJCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9oQixnQkFBUDtBQUNELENBcEZEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL2hpc3RvcnkvZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG4gIFxuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpO1xuXG4gIGNsYXNzIE1vZGVsSGlzdG9yeUZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgbW9kZWxEYXRhOiB7XG4gICAgICAgICAgY2xhc3NlczogW1wiZm9ybV9fbW9kZWxfX2hpc3RvcnlcIl0sXG4gICAgICAgICAgZmllbGRzOiBbU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiBcIm1vZGVsX2hpc3RvcnlfaWRcIixcbiAgICAgICAgICAgIGxhYmVsOiAnTW9kZWwnLFxuICAgICAgICAgICAgdmFsdWU6IFwiX25ld1wiLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiB7IFwiX25ld1wiOiBcIihOZXcgTW9kZWwpXCIgfVxuICAgICAgICAgIH0pXSxcbiAgICAgICAgICBidXR0b25zOiBbXVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgc2V0dGluZ3MgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhzZXR0aW5ncywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgIGxldCBzdHVkZW50X2lkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGlmIChzdHVkZW50X2lkKSB7XG4gICAgICAgIHJldHVybiBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FdWdsZW5hTW9kZWxzJywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgIGFuZDogW1xuICAgICAgICAgICAgICAgICAgeyBzdHVkZW50SWQ6IHN0dWRlbnRfaWQgfSxcbiAgICAgICAgICAgICAgICAgIHsgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpIH0sXG4gICAgICAgICAgICAgICAgICB7IGxhYjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKSB9LFxuICAgICAgICAgICAgICAgICAgeyBzaW11bGF0ZWQ6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zdCBoaXN0b3J5U2VsZWN0b3IgPSB0aGlzLmdldEZpZWxkKCdtb2RlbF9oaXN0b3J5X2lkJyk7XG4gICAgICAgICAgY29uc3QgdmFsID0gaGlzdG9yeVNlbGVjdG9yLnZhbHVlKCk7XG4gICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmNsZWFyT3B0aW9ucygpO1xuICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5hZGRPcHRpb24oeyB2YWx1ZTogXCJfbmV3XCIsIGxhYmVsOiBcIihOZXcgTW9kZWwpXCJ9KTtcbiAgICAgICAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAobmV3IERhdGUoYi5kYXRlX2NyZWF0ZWQpKS5nZXRUaW1lKCkgLSAobmV3IERhdGUoYS5kYXRlX2NyZWF0ZWQpKS5nZXRUaW1lKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkYXRhLmZvckVhY2goKGRhdHVtLCBpbmQpID0+IHtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5hZGRPcHRpb24oeyB2YWx1ZTogZGF0dW0uaWQsIGxhYmVsOiBkYXR1bS5uYW1lIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh2YWwgPT0gJ19uZXcnIHx8IGRhdGEubWFwKChhKSA9PiB7IHJldHVybiBhLmlkIH0pLmluY2x1ZGVzKHBhcnNlSW50KHZhbCkpKSB7XG4gICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUodmFsKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUoZGF0YVswXS5pZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZSgnX25ldycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0RmllbGQoJ21vZGVsX2hpc3RvcnlfaWQnKS5jbGVhck9wdGlvbnMoKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRIaXN0b3J5KCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuZ2V0RmllbGQoJ21vZGVsX2hpc3RvcnlfaWQnKS5nZXRPcHRpb25zKCkpLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gaXRlbSAhPSAnX25ldyc7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoaXN0b3J5Q291bnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRIaXN0b3J5KCkubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIE1vZGVsSGlzdG9yeUZvcm0uY3JlYXRlID0gKGRhdGEpID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsSGlzdG9yeUZvcm0oeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gTW9kZWxIaXN0b3J5Rm9ybTtcbn0pIl19
