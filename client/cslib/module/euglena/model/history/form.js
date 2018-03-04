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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL2hpc3RvcnkvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJNb2RlbEhpc3RvcnlGb3JtIiwic2V0dGluZ3MiLCJkZWZhdWx0cyIsIm1vZGVsRGF0YSIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJpZCIsImxhYmVsIiwidmFsdWUiLCJvcHRpb25zIiwiZGVzY3JpcHRpb24iLCJidXR0b25zIiwiZW5zdXJlRGVmYXVsdHMiLCJzdHVkZW50X2lkIiwiZ2V0IiwicHJvbWlzZUFqYXgiLCJkYXRhIiwiZmlsdGVyIiwid2hlcmUiLCJhbmQiLCJzdHVkZW50SWQiLCJtb2RlbFR5cGUiLCJfbW9kZWwiLCJsYWIiLCJzaW11bGF0ZWQiLCJ0aGVuIiwiaGlzdG9yeVNlbGVjdG9yIiwiZ2V0RmllbGQiLCJ2YWwiLCJjbGVhck9wdGlvbnMiLCJhZGRPcHRpb24iLCJzb3J0IiwiYSIsImIiLCJEYXRlIiwiZGF0ZV9jcmVhdGVkIiwiZ2V0VGltZSIsImZvckVhY2giLCJkYXR1bSIsImluZCIsIm5hbWUiLCJtYXAiLCJpbmNsdWRlcyIsInBhcnNlSW50Iiwic2V0VmFsdWUiLCJsZW5ndGgiLCJQcm9taXNlIiwicmVzb2x2ZSIsIk9iamVjdCIsImtleXMiLCJnZXRPcHRpb25zIiwiaXRlbSIsImdldEhpc3RvcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxPQUFPSixRQUFRLDBCQUFSLENBQWI7QUFBQSxNQUNFSyxjQUFjTCxRQUFRLGtDQUFSLENBRGhCOztBQUxrQixNQVFaTSxn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WCxlQUFPQyxPQUFPQyxJQUFQLENBQVksS0FBS3RCLFFBQUwsQ0FBYyxrQkFBZCxFQUFrQ3VCLFVBQWxDLEVBQVosRUFBNERqQyxNQUE1RCxDQUFtRSxVQUFDa0MsSUFBRCxFQUFVO0FBQ2xGLGlCQUFPQSxRQUFRLE1BQWY7QUFDRCxTQUZNLENBQVA7QUFHRDtBQXpFZTtBQUFBO0FBQUEscUNBMkVEO0FBQ2IsZUFBTyxLQUFLQyxVQUFMLEdBQWtCUCxNQUF6QjtBQUNEO0FBN0VlOztBQUFBO0FBQUEsSUFRYWhELElBUmI7O0FBZ0ZsQkUsbUJBQWlCTSxNQUFqQixHQUEwQixVQUFDVyxJQUFELEVBQVU7QUFDbEMsV0FBTyxJQUFJakIsZ0JBQUosQ0FBcUIsRUFBRUcsV0FBV2MsSUFBYixFQUFyQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPakIsZ0JBQVA7QUFDRCxDQXJGRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbC9oaXN0b3J5L2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IEZvcm0gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0nKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJyk7XG5cbiAgY2xhc3MgTW9kZWxIaXN0b3J5Rm9ybSBleHRlbmRzIEZvcm0ge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICBtb2RlbERhdGE6IHtcbiAgICAgICAgICBjbGFzc2VzOiBbXCJmb3JtX19tb2RlbF9faGlzdG9yeVwiXSxcbiAgICAgICAgICBmaWVsZHM6IFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwibW9kZWxfaGlzdG9yeV9pZFwiLFxuICAgICAgICAgICAgbGFiZWw6ICdNb2RlbCcsXG4gICAgICAgICAgICB2YWx1ZTogXCJfbmV3XCIsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHsgXCJfbmV3XCI6IFwiKE5ldyBNb2RlbClcIiB9LFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDaG9vc2UgZGlmZmVyZW50IG1vZGVscyB0aGF0IGhhdmUgYmVlbiBnZW5lcmF0ZWQgb3Igc2F2ZWQgcHJldmlvdXNseS4nXG4gICAgICAgICAgfSldLFxuICAgICAgICAgIGJ1dHRvbnM6IFtdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzZXR0aW5ncyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKHNldHRpbmdzLCBkZWZhdWx0cyk7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgbGV0IHN0dWRlbnRfaWQgPSBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpO1xuICAgICAgaWYgKHN0dWRlbnRfaWQpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V1Z2xlbmFNb2RlbHMnLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgYW5kOiBbXG4gICAgICAgICAgICAgICAgICB7IHN0dWRlbnRJZDogc3R1ZGVudF9pZCB9LFxuICAgICAgICAgICAgICAgICAgeyBtb2RlbFR5cGU6IHRoaXMuX21vZGVsLmdldCgnbW9kZWxUeXBlJykgfSxcbiAgICAgICAgICAgICAgICAgIHsgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpIH0sXG4gICAgICAgICAgICAgICAgICB7IHNpbXVsYXRlZDogZmFsc2UgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhpc3RvcnlTZWxlY3RvciA9IHRoaXMuZ2V0RmllbGQoJ21vZGVsX2hpc3RvcnlfaWQnKTtcbiAgICAgICAgICBjb25zdCB2YWwgPSBoaXN0b3J5U2VsZWN0b3IudmFsdWUoKTtcbiAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBcIl9uZXdcIiwgbGFiZWw6IFwiKE5ldyBNb2RlbClcIn0pO1xuICAgICAgICAgIGRhdGEuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZShiLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGRhdGEuZm9yRWFjaCgoZGF0dW0sIGluZCkgPT4ge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBkYXR1bS5pZCwgbGFiZWw6IGRhdHVtLm5hbWUgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHZhbCA9PSAnX25ldycgfHwgZGF0YS5tYXAoKGEpID0+IHsgcmV0dXJuIGEuaWQgfSkuaW5jbHVkZXMocGFyc2VJbnQodmFsKSkpIHtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZSh2YWwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZShkYXRhWzBdLmlkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKCdfbmV3Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXRGaWVsZCgnbW9kZWxfaGlzdG9yeV9pZCcpLmNsZWFyT3B0aW9ucygpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEhpc3RvcnkoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5nZXRGaWVsZCgnbW9kZWxfaGlzdG9yeV9pZCcpLmdldE9wdGlvbnMoKSkuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtICE9ICdfbmV3JztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhpc3RvcnlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEhpc3RvcnkoKS5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgTW9kZWxIaXN0b3J5Rm9ybS5jcmVhdGUgPSAoZGF0YSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxIaXN0b3J5Rm9ybSh7IG1vZGVsRGF0YTogZGF0YSB9KTtcbiAgfVxuXG4gIHJldHVybiBNb2RlbEhpc3RvcnlGb3JtO1xufSlcbiJdfQ==
