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
            options: Globals.get('State.experiment.allowNew') ? { "_new": "(New Experiment)" } : {},
            description: 'Choose different experiments that have been generated or saved previously.'
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
        var oldCount = this.historyCount();
        if (student_id) {
          var staticHistory = Globals.get('AppConfig.experiment.experimentHistory');
          var historyLoad = null;
          var concatenateHistory = null;
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

          if (staticHistory && Globals.get('AppConfig.system.experimentModality') === 'create') {
            return Utils.promiseAjax('/api/v1/Experiments/studentHistory', {
              data: {
                studentId: student_id,
                lab: Globals.get('AppConfig.lab')
              }
            }).then(function (newdata) {
              historyLoad.then(function (data) {
                data = data.concat(newdata);

                var historySelector = _this2.getField('exp_history_id');
                var val = historySelector.value();
                historySelector.clearOptions();
                if (Globals.get('State.experiment.allowNew')) historySelector.addOption({ value: "_new", label: "(New Experiment)" });
                data.sort(function (a, b) {
                  return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
                });
                data.forEach(function (datum, ind) {
                  historySelector.addOption({ value: datum.id, label: "Experiment ".concat(String.fromCharCode(65 + data.length - ind - 1)) });
                  //historySelector.addOption({ value: datum.id, label: (new Date(datum.date_created)).toLocaleString() });
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
                Globals.get('Relay').dispatchEvent('ExperimentCount.Change', {
                  old: oldCount,
                  count: _this2.historyCount()
                });
              });
            });
          } else {
            return historyLoad.then(function (data) {
              var historySelector = _this2.getField('exp_history_id');
              var val = historySelector.value();
              historySelector.clearOptions();
              if (Globals.get('State.experiment.allowNew')) historySelector.addOption({ value: "_new", label: "(New Experiment)" });
              data.sort(function (a, b) {
                return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
              });
              data.forEach(function (datum, ind) {
                historySelector.addOption({ value: datum.id, label: "Experiment ".concat(String.fromCharCode(65 + data.length - ind - 1)) });
                //historySelector.addOption({ value: datum.id, label: (new Date(datum.date_created)).toLocaleString() });
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
              Globals.get('Relay').dispatchEvent('ExperimentCount.Change', {
                old: oldCount,
                count: _this2.historyCount()
              });
            });
          }
        } else {
          this.getField('exp_history_id').clearOptions();
          Globals.get('Relay').dispatchEvent('ExperimentCount.Change', {
            old: oldCount,
            count: this.historyCount()
          });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvaGlzdG9yeS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJtb2RlbERhdGEiLCJpZCIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJsYWJlbCIsInZhbHVlIiwiZ2V0Iiwib3B0aW9ucyIsImRlc2NyaXB0aW9uIiwiYnV0dG9ucyIsImJpbmRNZXRob2RzIiwiX2xhc3RIaXN0b3J5IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl91cGRhdGVMYXN0SGlzdG9yeSIsInN0dWRlbnRfaWQiLCJvbGRDb3VudCIsImhpc3RvcnlDb3VudCIsInN0YXRpY0hpc3RvcnkiLCJoaXN0b3J5TG9hZCIsImNvbmNhdGVuYXRlSGlzdG9yeSIsInByb21pc2VBamF4IiwiZGF0YSIsImZpbHRlciIsIndoZXJlIiwiaW5xIiwic3R1ZGVudElkIiwibGFiIiwidGhlbiIsIm5ld2RhdGEiLCJjb25jYXQiLCJoaXN0b3J5U2VsZWN0b3IiLCJnZXRGaWVsZCIsInZhbCIsImNsZWFyT3B0aW9ucyIsImFkZE9wdGlvbiIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJkYXRlX2NyZWF0ZWQiLCJnZXRUaW1lIiwiZm9yRWFjaCIsImRhdHVtIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwibGVuZ3RoIiwibWFwIiwiaW5jbHVkZXMiLCJwYXJzZUludCIsInNldFZhbHVlIiwiZGlzcGF0Y2hFdmVudCIsIm9sZCIsImNvdW50IiwiUHJvbWlzZSIsInJlc29sdmUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsIml0ZW0iLCJnZXRIaXN0b3J5IiwiZXZ0IiwibGFzdCIsImV4aXN0cyIsImltcG9ydCIsImV4cF9oaXN0b3J5X2lkIiwiZGlzYWJsZU9wdGlvbiIsImVuYWJsZU9wdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFP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QUksS0FBS25ELFlBQVQsRUFBdUI7QUFDckIsZUFBS3FELE1BQUwsQ0FBWTtBQUNWQyw0QkFBZ0IsS0FBS3REO0FBRFgsV0FBWjtBQUdEO0FBQ0Y7QUFsSkg7QUFBQTtBQUFBLG1DQW9KZTtBQUNYLGFBQUtvQixRQUFMLENBQWMsZ0JBQWQsRUFBZ0NtQyxhQUFoQyxDQUE4QyxNQUE5QztBQUNEO0FBdEpIO0FBQUE7QUFBQSxrQ0F3SmM7QUFDVixhQUFLbkMsUUFBTCxDQUFjLGdCQUFkLEVBQWdDb0MsWUFBaEMsQ0FBNkMsTUFBN0M7QUFDRDtBQTFKSDs7QUFBQTtBQUFBLElBQTJDdEUsSUFBM0M7QUE0SkQsQ0FuS0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9oaXN0b3J5L2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyk7XG5cbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKTtcblxuICByZXR1cm4gY2xhc3MgRXhwZXJpbWVudEhpc3RvcnlGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcih7XG4gICAgICAgIG1vZGVsRGF0YToge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRfaGlzdG9yeVwiLFxuICAgICAgICAgIGNsYXNzZXM6IFtcImZvcm1fX2V4cGVyaW1lbnRfX2hpc3RvcnlcIl0sXG4gICAgICAgICAgZmllbGRzOiBbU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiBcImV4cF9oaXN0b3J5X2lkXCIsXG4gICAgICAgICAgICBsYWJlbDogJ0V4cGVyaW1lbnQnLFxuICAgICAgICAgICAgdmFsdWU6IEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykgPyBcIl9uZXdcIiA6IG51bGwsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykgPyB7IFwiX25ld1wiOiBcIihOZXcgRXhwZXJpbWVudClcIiB9IDoge30sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Nob29zZSBkaWZmZXJlbnQgZXhwZXJpbWVudHMgdGhhdCBoYXZlIGJlZW4gZ2VuZXJhdGVkIG9yIHNhdmVkIHByZXZpb3VzbHkuJ1xuICAgICAgICAgIH0pXSxcbiAgICAgICAgICBidXR0b25zOiBbXVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfdXBkYXRlTGFzdEhpc3RvcnknXSlcblxuICAgICAgdGhpcy5fbGFzdEhpc3RvcnkgPSBudWxsO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX3VwZGF0ZUxhc3RIaXN0b3J5KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgIGxldCBzdHVkZW50X2lkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGxldCBvbGRDb3VudCA9IHRoaXMuaGlzdG9yeUNvdW50KCk7XG4gICAgICBpZiAoc3R1ZGVudF9pZCkge1xuICAgICAgICBsZXQgc3RhdGljSGlzdG9yeSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScpO1xuICAgICAgICBsZXQgaGlzdG9yeUxvYWQgPSBudWxsO1xuICAgICAgICBsZXQgY29uY2F0ZW5hdGVIaXN0b3J5ID0gbnVsbDtcbiAgICAgICAgaWYgKHN0YXRpY0hpc3RvcnkpIHtcbiAgICAgICAgICBoaXN0b3J5TG9hZCA9IFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzJywge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgICAgaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgaW5xOiBzdGF0aWNIaXN0b3J5XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoaXN0b3J5TG9hZCA9IFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzL3N0dWRlbnRIaXN0b3J5Jywge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBzdHVkZW50SWQ6IHN0dWRlbnRfaWQsXG4gICAgICAgICAgICAgIGxhYjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdGljSGlzdG9yeSAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKT09PSdjcmVhdGUnKSB7XG4gICAgICAgICAgcmV0dXJuIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzL3N0dWRlbnRIaXN0b3J5Jywge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBzdHVkZW50SWQ6IHN0dWRlbnRfaWQsXG4gICAgICAgICAgICAgIGxhYjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLnRoZW4oKG5ld2RhdGEpID0+IHtcbiAgICAgICAgICAgICBoaXN0b3J5TG9hZC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGRhdGEgPSBkYXRhLmNvbmNhdChuZXdkYXRhKVxuXG4gICAgICAgICAgICAgIGNvbnN0IGhpc3RvcnlTZWxlY3RvciA9IHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJyk7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbCA9IGhpc3RvcnlTZWxlY3Rvci52YWx1ZSgpO1xuICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSBoaXN0b3J5U2VsZWN0b3IuYWRkT3B0aW9uKHsgdmFsdWU6IFwiX25ld1wiLCBsYWJlbDogXCIoTmV3IEV4cGVyaW1lbnQpXCJ9KTtcbiAgICAgICAgICAgICAgZGF0YS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZShiLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChkYXR1bSwgaW5kKSA9PiB7XG4gICAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBkYXR1bS5pZCwgbGFiZWw6IFwiRXhwZXJpbWVudCBcIi5jb25jYXQoU3RyaW5nLmZyb21DaGFyQ29kZSg2NSArIGRhdGEubGVuZ3RoIC0gaW5kIC0gMSkpIH0pO1xuICAgICAgICAgICAgICAgIC8vaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBkYXR1bS5pZCwgbGFiZWw6IChuZXcgRGF0ZShkYXR1bS5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpIH0pO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBpZiAodmFsID09ICdfbmV3JyB8fCBkYXRhLm1hcCgoYSkgPT4geyByZXR1cm4gYS5pZCB9KS5pbmNsdWRlcyhwYXJzZUludCh2YWwpKSkge1xuICAgICAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZSh2YWwpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKGRhdGFbMF0uaWQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZSh2YWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgb2xkOiBvbGRDb3VudCxcbiAgICAgICAgICAgICAgICBjb3VudDogdGhpcy5oaXN0b3J5Q291bnQoKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBoaXN0b3J5TG9hZC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBoaXN0b3J5U2VsZWN0b3IgPSB0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gaGlzdG9yeVNlbGVjdG9yLnZhbHVlKCk7XG4gICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBcIl9uZXdcIiwgbGFiZWw6IFwiKE5ldyBFeHBlcmltZW50KVwifSk7XG4gICAgICAgICAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZShiLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYXRhLmZvckVhY2goKGRhdHVtLCBpbmQpID0+IHtcbiAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBkYXR1bS5pZCwgbGFiZWw6IFwiRXhwZXJpbWVudCBcIi5jb25jYXQoU3RyaW5nLmZyb21DaGFyQ29kZSg2NSArIGRhdGEubGVuZ3RoIC0gaW5kIC0gMSkpIH0pO1xuICAgICAgICAgICAgICAvL2hpc3RvcnlTZWxlY3Rvci5hZGRPcHRpb24oeyB2YWx1ZTogZGF0dW0uaWQsIGxhYmVsOiAobmV3IERhdGUoZGF0dW0uZGF0ZV9jcmVhdGVkKSkudG9Mb2NhbGVTdHJpbmcoKSB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAodmFsID09ICdfbmV3JyB8fCBkYXRhLm1hcCgoYSkgPT4geyByZXR1cm4gYS5pZCB9KS5pbmNsdWRlcyhwYXJzZUludCh2YWwpKSkge1xuICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUodmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKGRhdGFbMF0uaWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywge1xuICAgICAgICAgICAgICBvbGQ6IG9sZENvdW50LFxuICAgICAgICAgICAgICBjb3VudDogdGhpcy5oaXN0b3J5Q291bnQoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJykuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB7XG4gICAgICAgICAgb2xkOiBvbGRDb3VudCxcbiAgICAgICAgICBjb3VudDogdGhpcy5oaXN0b3J5Q291bnQoKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEhpc3RvcnkoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKS5nZXRPcHRpb25zKCkpLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gaXRlbSAhPSAnX25ldyc7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBoaXN0b3J5Q291bnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRIaXN0b3J5KCkubGVuZ3RoO1xuICAgIH1cblxuICAgIF91cGRhdGVMYXN0SGlzdG9yeShldnQpIHtcbiAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLnZhbHVlKCk7XG4gICAgICBpZiAobGFzdCAhPSAnX25ldycgJiYgVXRpbHMuZXhpc3RzKGxhc3QpKSB7XG4gICAgICAgIHRoaXMuX2xhc3RIaXN0b3J5ID0gbGFzdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXZlcnRUb0xhc3RIaXN0b3J5KCkge1xuICAgICAgaWYgKHRoaXMuX2xhc3RIaXN0b3J5KSB7XG4gICAgICAgIHRoaXMuaW1wb3J0KHtcbiAgICAgICAgICBleHBfaGlzdG9yeV9pZDogdGhpcy5fbGFzdEhpc3RvcnlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNhYmxlTmV3KCkge1xuICAgICAgdGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKS5kaXNhYmxlT3B0aW9uKCdfbmV3Jyk7XG4gICAgfVxuXG4gICAgZW5hYmxlTmV3KCkge1xuICAgICAgdGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKS5lbmFibGVPcHRpb24oJ19uZXcnKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
