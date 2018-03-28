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
            options: { "_new": "(New Model)" },
            description: 'Choose different models that have been generated or saved previously.'
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
          var staticHistory = Globals.get('AppConfig.model.modelHistory');
          var historyLoad = null;
          if (staticHistory) {
            historyLoad = Utils.promiseAjax('/api/v1/EuglenaModels', {
              data: {
                filter: {
                  where: {
                    id: {
                      inq: staticHistory
                    }
                  }
                }
              }
            });
          } else {
            historyLoad = Utils.promiseAjax('/api/v1/EuglenaModels', {
              data: {
                filter: {
                  where: {
                    and: [{ studentId: student_id }, { modelType: this._model.get('modelType') }, { lab: Globals.get('AppConfig.lab') }, { simulated: false }]
                  }
                }
              }
            });
          }

          if (staticHistory && Globals.get('AppConfig.system.modelModality') === 'create') {
            return Utils.promiseAjax('/api/v1/EuglenaModels', {
              data: {
                filter: {
                  where: {
                    and: [{ studentId: student_id }, { modelType: this._model.get('modelType') }, { lab: Globals.get('AppConfig.lab') }, { simulated: false }]
                  }
                }
              }
            }).then(function (newdata) {
              historyLoad.then(function (data) {
                data = data.concat(newdata);

                var historySelector = _this2.getField('model_history_id');
                var val = historySelector.value();
                historySelector.clearOptions();
                if (Globals.get('AppConfig.system.modelModality') === 'create') {
                  historySelector.addOption({ value: "_new", label: "(New Model)" });
                }
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
            });
          } else {
            return historyLoad.then(function (data) {
              var historySelector = _this2.getField('model_history_id');
              var val = historySelector.value();
              historySelector.clearOptions();
              if (Globals.get('AppConfig.system.modelModality') === 'create') {
                historySelector.addOption({ value: "_new", label: "(New Model)" });
              }
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
          }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2hpc3RvcnkvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJNb2RlbEhpc3RvcnlGb3JtIiwic2V0dGluZ3MiLCJkZWZhdWx0cyIsIm1vZGVsRGF0YSIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwidmFsdWUiLCJvcHRpb25zIiwiZGVzY3JpcHRpb24iLCJidXR0b25zIiwiZW5zdXJlRGVmYXVsdHMiLCJzdHVkZW50X2lkIiwiZ2V0Iiwic3RhdGljSGlzdG9yeSIsImhpc3RvcnlMb2FkIiwicHJvbWlzZUFqYXgiLCJkYXRhIiwiZmlsdGVyIiwid2hlcmUiLCJpbnEiLCJhbmQiLCJzdHVkZW50SWQiLCJtb2RlbFR5cGUiLCJfbW9kZWwiLCJsYWIiLCJzaW11bGF0ZWQiLCJ0aGVuIiwibmV3ZGF0YSIsImNvbmNhdCIsImhpc3RvcnlTZWxlY3RvciIsImdldEZpZWxkIiwidmFsIiwiY2xlYXJPcHRpb25zIiwiYWRkT3B0aW9uIiwic29ydCIsImEiLCJiIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsImdldFRpbWUiLCJmb3JFYWNoIiwiZGF0dW0iLCJpbmQiLCJuYW1lIiwibWFwIiwiaW5jbHVkZXMiLCJwYXJzZUludCIsInNldFZhbHVlIiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsIml0ZW0iLCJnZXRIaXN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksT0FBT0osUUFBUSwwQkFB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WCxlQUFPQyxPQUFPQyxJQUFQLENBQVksS0FBS3RCLFFBQUwsQ0FBYyxrQkFBZCxFQUFrQ3VCLFVBQWxDLEVBQVosRUFBNERwQyxNQUE1RCxDQUFtRSxVQUFDcUMsSUFBRCxFQUFVO0FBQ2xGLGlCQUFPQSxRQUFRLE1BQWY7QUFDRCxTQUZNLENBQVA7QUFHRDtBQXRJZTtBQUFBO0FBQUEscUNBd0lEO0FBQ2IsZUFBTyxLQUFLQyxVQUFMLEdBQWtCUCxNQUF6QjtBQUNEO0FBMUllOztBQUFBO0FBQUEsSUFRYXJELElBUmI7O0FBNklsQkUsbUJBQWlCTSxNQUFqQixHQUEwQixVQUFDYSxJQUFELEVBQVU7QUFDbEMsV0FBTyxJQUFJbkIsZ0JBQUosQ0FBcUIsRUFBRUcsV0FBV2dCLElBQWIsRUFBckIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT25CLGdCQUFQO0FBQ0QsQ0FsSkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvaGlzdG9yeS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpO1xuXG4gIGNsYXNzIE1vZGVsSGlzdG9yeUZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgbW9kZWxEYXRhOiB7XG4gICAgICAgICAgY2xhc3NlczogW1wiZm9ybV9fbW9kZWxfX2hpc3RvcnlcIl0sXG4gICAgICAgICAgZmllbGRzOiBbU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiBcIm1vZGVsX2hpc3RvcnlfaWRcIixcbiAgICAgICAgICAgIGxhYmVsOiAnTW9kZWwnLFxuICAgICAgICAgICAgdmFsdWU6IFwiX25ld1wiLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiB7IFwiX25ld1wiOiBcIihOZXcgTW9kZWwpXCIgfSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ2hvb3NlIGRpZmZlcmVudCBtb2RlbHMgdGhhdCBoYXZlIGJlZW4gZ2VuZXJhdGVkIG9yIHNhdmVkIHByZXZpb3VzbHkuJ1xuICAgICAgICAgIH0pXSxcbiAgICAgICAgICBidXR0b25zOiBbXVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgc2V0dGluZ3MgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhzZXR0aW5ncywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgIGxldCBzdHVkZW50X2lkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGlmIChzdHVkZW50X2lkKSB7XG4gICAgICAgIGxldCBzdGF0aWNIaXN0b3J5ID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC5tb2RlbEhpc3RvcnknKTtcbiAgICAgICAgbGV0IGhpc3RvcnlMb2FkID0gbnVsbDtcbiAgICAgICAgaWYgKHN0YXRpY0hpc3RvcnkpIHtcbiAgICAgICAgICBoaXN0b3J5TG9hZCA9IFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V1Z2xlbmFNb2RlbHMnLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgICBpZDoge1xuICAgICAgICAgICAgICAgICAgICAgIGlucTogc3RhdGljSGlzdG9yeVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGlzdG9yeUxvYWQgPSBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FdWdsZW5hTW9kZWxzJywge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgICAgYW5kOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgc3R1ZGVudElkOiBzdHVkZW50X2lkIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbW9kZWxUeXBlOiB0aGlzLl9tb2RlbC5nZXQoJ21vZGVsVHlwZScpIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgc2ltdWxhdGVkOiBmYWxzZSB9XG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0aWNIaXN0b3J5ICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKT09PSdjcmVhdGUnKSB7XG4gICAgICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V1Z2xlbmFNb2RlbHMnLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICAgICAgeyBzdHVkZW50SWQ6IHN0dWRlbnRfaWQgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBsYWI6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJykgfSxcbiAgICAgICAgICAgICAgICAgICAgeyBzaW11bGF0ZWQ6IGZhbHNlIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KS50aGVuKChuZXdkYXRhKSA9PiB7XG4gICAgICAgICAgICBoaXN0b3J5TG9hZC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICBkYXRhID0gZGF0YS5jb25jYXQobmV3ZGF0YSlcblxuICAgICAgICAgICAgICAgY29uc3QgaGlzdG9yeVNlbGVjdG9yID0gdGhpcy5nZXRGaWVsZCgnbW9kZWxfaGlzdG9yeV9pZCcpO1xuICAgICAgICAgICAgICAgY29uc3QgdmFsID0gaGlzdG9yeVNlbGVjdG9yLnZhbHVlKCk7XG4gICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpPT09J2NyZWF0ZScpIHtcbiAgICAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBcIl9uZXdcIiwgbGFiZWw6IFwiKE5ldyBNb2RlbClcIn0pO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgZGF0YS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgIHJldHVybiAobmV3IERhdGUoYi5kYXRlX2NyZWF0ZWQpKS5nZXRUaW1lKCkgLSAobmV3IERhdGUoYS5kYXRlX2NyZWF0ZWQpKS5nZXRUaW1lKClcbiAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChkYXR1bSwgaW5kKSA9PiB7XG4gICAgICAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5hZGRPcHRpb24oeyB2YWx1ZTogZGF0dW0uaWQsIGxhYmVsOiBkYXR1bS5uYW1lIH0pO1xuICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICBpZiAodmFsID09ICdfbmV3JyB8fCBkYXRhLm1hcCgoYSkgPT4geyByZXR1cm4gYS5pZCB9KS5pbmNsdWRlcyhwYXJzZUludCh2YWwpKSkge1xuICAgICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUodmFsKTtcbiAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKGRhdGFbMF0uaWQpO1xuICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKCdfbmV3Jyk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gaGlzdG9yeUxvYWQudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGlzdG9yeVNlbGVjdG9yID0gdGhpcy5nZXRGaWVsZCgnbW9kZWxfaGlzdG9yeV9pZCcpO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gaGlzdG9yeVNlbGVjdG9yLnZhbHVlKCk7XG4gICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpPT09J2NyZWF0ZScpIHtcbiAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBcIl9uZXdcIiwgbGFiZWw6IFwiKE5ldyBNb2RlbClcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAobmV3IERhdGUoYi5kYXRlX2NyZWF0ZWQpKS5nZXRUaW1lKCkgLSAobmV3IERhdGUoYS5kYXRlX2NyZWF0ZWQpKS5nZXRUaW1lKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChkYXR1bSwgaW5kKSA9PiB7XG4gICAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5hZGRPcHRpb24oeyB2YWx1ZTogZGF0dW0uaWQsIGxhYmVsOiBkYXR1bS5uYW1lIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodmFsID09ICdfbmV3JyB8fCBkYXRhLm1hcCgoYSkgPT4geyByZXR1cm4gYS5pZCB9KS5pbmNsdWRlcyhwYXJzZUludCh2YWwpKSkge1xuICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUodmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKGRhdGFbMF0uaWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKCdfbmV3Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXRGaWVsZCgnbW9kZWxfaGlzdG9yeV9pZCcpLmNsZWFyT3B0aW9ucygpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEhpc3RvcnkoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5nZXRGaWVsZCgnbW9kZWxfaGlzdG9yeV9pZCcpLmdldE9wdGlvbnMoKSkuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtICE9ICdfbmV3JztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhpc3RvcnlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEhpc3RvcnkoKS5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgTW9kZWxIaXN0b3J5Rm9ybS5jcmVhdGUgPSAoZGF0YSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxIaXN0b3J5Rm9ybSh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbEhpc3RvcnlGb3JtO1xufSlcbiJdfQ==
