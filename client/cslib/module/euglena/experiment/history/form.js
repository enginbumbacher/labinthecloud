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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvaGlzdG9yeS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJtb2RlbERhdGEiLCJpZCIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJsYWJlbCIsInZhbHVlIiwiZ2V0Iiwib3B0aW9ucyIsImRlc2NyaXB0aW9uIiwiYnV0dG9ucyIsImJpbmRNZXRob2RzIiwiX2xhc3RIaXN0b3J5IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl91cGRhdGVMYXN0SGlzdG9yeSIsInN0dWRlbnRfaWQiLCJvbGRDb3VudCIsImhpc3RvcnlDb3VudCIsInN0YXRpY0hpc3RvcnkiLCJoaXN0b3J5TG9hZCIsInByb21pc2VBamF4IiwiZGF0YSIsImZpbHRlciIsIndoZXJlIiwiaW5xIiwic3R1ZGVudElkIiwibGFiIiwidGhlbiIsIm5ld2RhdGEiLCJjb25jYXQiLCJoaXN0b3J5U2VsZWN0b3IiLCJnZXRGaWVsZCIsInZhbCIsImNsZWFyT3B0aW9ucyIsImFkZE9wdGlvbiIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJkYXRlX2NyZWF0ZWQiLCJnZXRUaW1lIiwiZm9yRWFjaCIsImRhdHVtIiwiaW5kIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwibGVuZ3RoIiwibWFwIiwiaW5jbHVkZXMiLCJwYXJzZUludCIsInNldFZhbHVlIiwiZGlzcGF0Y2hFdmVudCIsIm9sZCIsImNvdW50IiwiUHJvbWlzZSIsInJlc29sdmUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsIml0ZW0iLCJnZXRIaXN0b3J5IiwiZXZ0IiwibGFzdCIsImV4aXN0cyIsImltcG9ydCIsImV4cF9oaXN0b3J5X2lkIiwiZGlzYWJsZU9wdGlvbiIsImVuYWJsZU9wdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNs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QUNWQyw0QkFBZ0IsS0FBS3JEO0FBRFgsV0FBWjtBQUdEO0FBQ0Y7QUFqSkg7QUFBQTtBQUFBLG1DQW1KZTtBQUNYLGFBQUttQixRQUFMLENBQWMsZ0JBQWQsRUFBZ0NtQyxhQUFoQyxDQUE4QyxNQUE5QztBQUNEO0FBckpIO0FBQUE7QUFBQSxrQ0F1SmM7QUFDVixhQUFLbkMsUUFBTCxDQUFjLGdCQUFkLEVBQWdDb0MsWUFBaEMsQ0FBNkMsTUFBN0M7QUFDRDtBQXpKSDs7QUFBQTtBQUFBLElBQTJDckUsSUFBM0M7QUEySkQsQ0FsS0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9oaXN0b3J5L2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyk7XG5cbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKTtcblxuICByZXR1cm4gY2xhc3MgRXhwZXJpbWVudEhpc3RvcnlGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcih7XG4gICAgICAgIG1vZGVsRGF0YToge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRfaGlzdG9yeVwiLFxuICAgICAgICAgIGNsYXNzZXM6IFtcImZvcm1fX2V4cGVyaW1lbnRfX2hpc3RvcnlcIl0sXG4gICAgICAgICAgZmllbGRzOiBbU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiBcImV4cF9oaXN0b3J5X2lkXCIsXG4gICAgICAgICAgICBsYWJlbDogJ0V4cGVyaW1lbnQnLFxuICAgICAgICAgICAgdmFsdWU6IEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykgPyBcIl9uZXdcIiA6IG51bGwsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykgPyB7IFwiX25ld1wiOiBcIihOZXcgRXhwZXJpbWVudClcIiB9IDoge30sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Nob29zZSBkaWZmZXJlbnQgZXhwZXJpbWVudHMgdGhhdCBoYXZlIGJlZW4gZ2VuZXJhdGVkIG9yIHNhdmVkIHByZXZpb3VzbHkuJ1xuICAgICAgICAgIH0pXSxcbiAgICAgICAgICBidXR0b25zOiBbXVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfdXBkYXRlTGFzdEhpc3RvcnknXSlcblxuICAgICAgdGhpcy5fbGFzdEhpc3RvcnkgPSBudWxsO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX3VwZGF0ZUxhc3RIaXN0b3J5KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgIGxldCBzdHVkZW50X2lkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGxldCBvbGRDb3VudCA9IHRoaXMuaGlzdG9yeUNvdW50KCk7XG4gICAgICBpZiAoc3R1ZGVudF9pZCkge1xuICAgICAgICBsZXQgc3RhdGljSGlzdG9yeSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScpO1xuICAgICAgICBsZXQgaGlzdG9yeUxvYWQgPSBudWxsO1xuICAgICAgICBpZiAoc3RhdGljSGlzdG9yeSkge1xuICAgICAgICAgIGhpc3RvcnlMb2FkID0gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMnLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgICBpZDoge1xuICAgICAgICAgICAgICAgICAgICBpbnE6IHN0YXRpY0hpc3RvcnlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhpc3RvcnlMb2FkID0gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMvc3R1ZGVudEhpc3RvcnknLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHN0dWRlbnRJZDogc3R1ZGVudF9pZCxcbiAgICAgICAgICAgICAgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGF0aWNIaXN0b3J5ICYmIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpPT09J2NyZWF0ZScpIHtcbiAgICAgICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMvc3R1ZGVudEhpc3RvcnknLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHN0dWRlbnRJZDogc3R1ZGVudF9pZCxcbiAgICAgICAgICAgICAgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkudGhlbigobmV3ZGF0YSkgPT4ge1xuICAgICAgICAgICAgIGhpc3RvcnlMb2FkLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuY29uY2F0KG5ld2RhdGEpXG5cbiAgICAgICAgICAgICAgY29uc3QgaGlzdG9yeVNlbGVjdG9yID0gdGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKTtcbiAgICAgICAgICAgICAgY29uc3QgdmFsID0gaGlzdG9yeVNlbGVjdG9yLnZhbHVlKCk7XG4gICAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5jbGVhck9wdGlvbnMoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIGhpc3RvcnlTZWxlY3Rvci5hZGRPcHRpb24oeyB2YWx1ZTogXCJfbmV3XCIsIGxhYmVsOiBcIihOZXcgRXhwZXJpbWVudClcIn0pO1xuICAgICAgICAgICAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKGIuZGF0ZV9jcmVhdGVkKSkuZ2V0VGltZSgpIC0gKG5ldyBEYXRlKGEuZGF0ZV9jcmVhdGVkKSkuZ2V0VGltZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBkYXRhLmZvckVhY2goKGRhdHVtLCBpbmQpID0+IHtcbiAgICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuYWRkT3B0aW9uKHsgdmFsdWU6IGRhdHVtLmlkLCBsYWJlbDogXCJFeHBlcmltZW50IFwiLmNvbmNhdChTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgZGF0YS5sZW5ndGggLSBpbmQgLSAxKSkgfSk7XG4gICAgICAgICAgICAgICAgLy9oaXN0b3J5U2VsZWN0b3IuYWRkT3B0aW9uKHsgdmFsdWU6IGRhdHVtLmlkLCBsYWJlbDogKG5ldyBEYXRlKGRhdHVtLmRhdGVfY3JlYXRlZCkpLnRvTG9jYWxlU3RyaW5nKCkgfSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIGlmICh2YWwgPT0gJ19uZXcnIHx8IGRhdGEubWFwKChhKSA9PiB7IHJldHVybiBhLmlkIH0pLmluY2x1ZGVzKHBhcnNlSW50KHZhbCkpKSB7XG4gICAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKHZhbCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUoZGF0YVswXS5pZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKHZhbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBvbGQ6IG9sZENvdW50LFxuICAgICAgICAgICAgICAgIGNvdW50OiB0aGlzLmhpc3RvcnlDb3VudCgpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGhpc3RvcnlMb2FkLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhpc3RvcnlTZWxlY3RvciA9IHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJyk7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBoaXN0b3J5U2VsZWN0b3IudmFsdWUoKTtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5jbGVhck9wdGlvbnMoKTtcbiAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSBoaXN0b3J5U2VsZWN0b3IuYWRkT3B0aW9uKHsgdmFsdWU6IFwiX25ld1wiLCBsYWJlbDogXCIoTmV3IEV4cGVyaW1lbnQpXCJ9KTtcbiAgICAgICAgICAgIGRhdGEuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKGIuZGF0ZV9jcmVhdGVkKSkuZ2V0VGltZSgpIC0gKG5ldyBEYXRlKGEuZGF0ZV9jcmVhdGVkKSkuZ2V0VGltZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgoZGF0dW0sIGluZCkgPT4ge1xuICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuYWRkT3B0aW9uKHsgdmFsdWU6IGRhdHVtLmlkLCBsYWJlbDogXCJFeHBlcmltZW50IFwiLmNvbmNhdChTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgZGF0YS5sZW5ndGggLSBpbmQgLSAxKSkgfSk7XG4gICAgICAgICAgICAgIC8vaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBkYXR1bS5pZCwgbGFiZWw6IChuZXcgRGF0ZShkYXR1bS5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmICh2YWwgPT0gJ19uZXcnIHx8IGRhdGEubWFwKChhKSA9PiB7IHJldHVybiBhLmlkIH0pLmluY2x1ZGVzKHBhcnNlSW50KHZhbCkpKSB7XG4gICAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZSh2YWwpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUoZGF0YVswXS5pZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB7XG4gICAgICAgICAgICAgIG9sZDogb2xkQ291bnQsXG4gICAgICAgICAgICAgIGNvdW50OiB0aGlzLmhpc3RvcnlDb3VudCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKS5jbGVhck9wdGlvbnMoKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHtcbiAgICAgICAgICBvbGQ6IG9sZENvdW50LFxuICAgICAgICAgIGNvdW50OiB0aGlzLmhpc3RvcnlDb3VudCgpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGlzdG9yeSgpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmdldE9wdGlvbnMoKSkuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtICE9ICdfbmV3JztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhpc3RvcnlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEhpc3RvcnkoKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgX3VwZGF0ZUxhc3RIaXN0b3J5KGV2dCkge1xuICAgICAgY29uc3QgbGFzdCA9IHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJykudmFsdWUoKTtcbiAgICAgIGlmIChsYXN0ICE9ICdfbmV3JyAmJiBVdGlscy5leGlzdHMobGFzdCkpIHtcbiAgICAgICAgdGhpcy5fbGFzdEhpc3RvcnkgPSBsYXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldmVydFRvTGFzdEhpc3RvcnkoKSB7XG4gICAgICBpZiAodGhpcy5fbGFzdEhpc3RvcnkpIHtcbiAgICAgICAgdGhpcy5pbXBvcnQoe1xuICAgICAgICAgIGV4cF9oaXN0b3J5X2lkOiB0aGlzLl9sYXN0SGlzdG9yeVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVOZXcoKSB7XG4gICAgICB0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmRpc2FibGVPcHRpb24oJ19uZXcnKTtcbiAgICB9XG5cbiAgICBlbmFibGVOZXcoKSB7XG4gICAgICB0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmVuYWJsZU9wdGlvbignX25ldycpO1xuICAgIH1cbiAgfVxufSlcbiJdfQ==
