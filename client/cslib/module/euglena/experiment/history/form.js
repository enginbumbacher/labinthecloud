'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils');

  var Form = require('core/component/form/form'),
      SelectField = require('core/component/selectfield/field');

  return function (_Form) {
    _inherits(ExperimentHistoryForm, _Form);

    function ExperimentHistoryForm() {
      _classCallCheck(this, ExperimentHistoryForm);

      var _this = _possibleConstructorReturn(this, (ExperimentHistoryForm.__proto__ || Object.getPrototypeOf(ExperimentHistoryForm)).call(this, {
        modelData: {
          id: "experiment_history",
          classes: ["form__experiment__history"],
          fields: [SelectField.create({
            id: "exp_history_id",
            label: 'Experiment',
            value: Globals.get('State.experiment.allowNew') ? "_new" : null,
            classes: [],
            options: Globals.get('State.experiment.allowNew') ? { "_new": "(New Experiment)" } : {}
          })],
          buttons: []
        }
      }));

      Utils.bindMethods(_this, ['_updateLastHistory']);

      _this._lastHistory = null;
      _this.addEventListener('Form.FieldChanged', _this._updateLastHistory);
      return _this;
    }

    _createClass(ExperimentHistoryForm, [{
      key: 'update',
      value: function update() {
        var _this2 = this;

        var student_id = Globals.get('student_id');
        if (student_id) {
          var staticHistory = Globals.get('AppConfig.experiment.experimentHistory');
          var historyLoad = null;
          if (staticHistory) {
            historyLoad = Utils.promiseAjax('/api/v1/Experiments', {
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
            historyLoad = Utils.promiseAjax('/api/v1/Experiments/studentHistory', {
              data: {
                studentId: student_id,
                lab: Globals.get('AppConfig.lab')
              }
            });
          }
          return historyLoad.then(function (data) {
            var historySelector = _this2.getField('exp_history_id');
            var val = historySelector.value();
            historySelector.clearOptions();
            if (Globals.get('State.experiment.allowNew')) historySelector.addOption({ value: "_new", label: "(New Experiment)" });
            data.sort(function (a, b) {
              return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
            });
            data.forEach(function (datum, ind) {
              historySelector.addOption({ value: datum.id, label: new Date(datum.date_created).toLocaleString() });
            });
            if (val == '_new' || data.map(function (a) {
              return a.id;
            }).includes(parseInt(val))) {
              historySelector.setValue(val);
            } else if (data.length) {
              historySelector.setValue(data[0].id);
            } else {
              historySelector.setValue(val);
            }
          });
        } else {
          this.getField('exp_history_id').clearOptions();
          return Promise.resolve(true);
        }
      }
    }, {
      key: 'getHistory',
      value: function getHistory() {
        return Object.keys(this.getField('exp_history_id').getOptions()).filter(function (item) {
          return item != '_new';
        });
      }
    }, {
      key: 'historyCount',
      value: function historyCount() {
        return this.getHistory().length;
      }
    }, {
      key: '_updateLastHistory',
      value: function _updateLastHistory(evt) {
        var last = this.getField('exp_history_id').value();
        if (last != '_new' && Utils.exists(last)) {
          this._lastHistory = last;
        }
      }
    }, {
      key: 'revertToLastHistory',
      value: function revertToLastHistory() {
        if (this._lastHistory) {
          this.import({
            exp_history_id: this._lastHistory
          });
        }
      }
    }, {
      key: 'disableNew',
      value: function disableNew() {
        this.getField('exp_history_id').disableOption('_new');
      }
    }, {
      key: 'enableNew',
      value: function enableNew() {
        this.getField('exp_history_id').enableOption('_new');
      }
    }]);

    return ExperimentHistoryForm;
  }(Form);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvaGlzdG9yeS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJtb2RlbERhdGEiLCJpZCIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJsYWJlbCIsInZhbHVlIiwiZ2V0Iiwib3B0aW9ucyIsImJ1dHRvbnMiLCJiaW5kTWV0aG9kcyIsIl9sYXN0SGlzdG9yeSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfdXBkYXRlTGFzdEhpc3RvcnkiLCJzdHVkZW50X2lkIiwic3RhdGljSGlzdG9yeSIsImhpc3RvcnlMb2FkIiwicHJvbWlzZUFqYXgiLCJkYXRhIiwiZmlsdGVyIiwid2hlcmUiLCJpbnEiLCJzdHVkZW50SWQiLCJsYWIiLCJ0aGVuIiwiaGlzdG9yeVNlbGVjdG9yIiwiZ2V0RmllbGQiLCJ2YWwiLCJjbGVhck9wdGlvbnMiLCJhZGRPcHRpb24iLCJzb3J0IiwiYSIsImIiLCJEYXRlIiwiZGF0ZV9jcmVhdGVkIiwiZ2V0VGltZSIsImZvckVhY2giLCJkYXR1bSIsImluZCIsInRvTG9jYWxlU3RyaW5nIiwibWFwIiwiaW5jbHVkZXMiLCJwYXJzZUludCIsInNldFZhbHVlIiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsIml0ZW0iLCJnZXRIaXN0b3J5IiwiZXZ0IiwibGFzdCIsImV4aXN0cyIsImltcG9ydCIsImV4cF9oaXN0b3J5X2lkIiwiZGlzYWJsZU9wdGlvbiIsImVuYWJsZU9wdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWOztBQUdBLE1BQU1HLE9BQU9ILFFBQVEsMEJBQVIsQ0FB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QUM3RUYsOEJBQWdCa0IsUUFBaEIsQ0FBeUJoQixHQUF6QjtBQUNELGFBRkQsTUFFTyxJQUFJVCxLQUFLMEIsTUFBVCxFQUFpQjtBQUN0Qm5CLDhCQUFnQmtCLFFBQWhCLENBQXlCekIsS0FBSyxDQUFMLEVBQVFqQixFQUFqQztBQUNELGFBRk0sTUFFQTtBQUNMd0IsOEJBQWdCa0IsUUFBaEIsQ0FBeUJoQixHQUF6QjtBQUNEO0FBQ0YsV0FsQk0sQ0FBUDtBQW1CRCxTQTFDRCxNQTBDTztBQUNMLGVBQUtELFFBQUwsQ0FBYyxnQkFBZCxFQUFnQ0UsWUFBaEM7QUFDQSxpQkFBT2lCLFFBQVFDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNEO0FBQ0Y7QUF2RUg7QUFBQTtBQUFBLG1DQXlFZTtBQUNYLGVBQU9DLE9BQU9DLElBQVAsQ0FBWSxLQUFLdEIsUUFBTCxDQUFjLGdCQUFkLEVBQWdDdUIsVUFBaEMsRUFBWixFQUEwRDlCLE1BQTFELENBQWlFLFVBQUMrQixJQUFELEVBQVU7QUFDaEYsaUJBQU9BLFFBQVEsTUFBZjtBQUNELFNBRk0sQ0FBUDtBQUdEO0FBN0VIO0FBQUE7QUFBQSxxQ0ErRWlCO0FBQ2IsZUFBTyxLQUFLQyxVQUFMLEdBQWtCUCxNQUF6QjtBQUNEO0FBakZIO0FBQUE7QUFBQSx5Q0FtRnFCUSxHQW5GckIsRUFtRjBCO0FBQ3RCLFlBQU1DLE9BQU8sS0FBSzNCLFFBQUwsQ0FBYyxnQkFBZCxFQUFnQ3BCLEtBQWhDLEVBQWI7QUFDQSxZQUFJK0MsUUFBUSxNQUFSLElBQWtCeEQsTUFBTXlELE1BQU4sQ0FBYUQsSUFBYixDQUF0QixFQUEwQztBQUN4QyxlQUFLMUMsWUFBTCxHQUFvQjBDLElBQXBCO0FBQ0Q7QUFDRjtBQXhGSDtBQUFBO0FBQUEsNENBMEZ3QjtBQUNwQixZQUFJLEtBQUsxQyxZQUFULEVBQXVCO0FBQ3JCLGVBQUs0QyxNQUFMLENBQVk7QUFDVkMsNEJBQWdCLEtBQUs3QztBQURYLFdBQVo7QUFHRDtBQUNGO0FBaEdIO0FBQUE7QUFBQSxtQ0FrR2U7QUFDWCxhQUFLZSxRQUFMLENBQWMsZ0JBQWQsRUFBZ0MrQixhQUFoQyxDQUE4QyxNQUE5QztBQUNEO0FBcEdIO0FBQUE7QUFBQSxrQ0FzR2M7QUFDVixhQUFLL0IsUUFBTCxDQUFjLGdCQUFkLEVBQWdDZ0MsWUFBaEMsQ0FBNkMsTUFBN0M7QUFDRDtBQXhHSDs7QUFBQTtBQUFBLElBQTJDNUQsSUFBM0M7QUEwR0QsQ0FqSEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9oaXN0b3J5L2Zvcm0uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
