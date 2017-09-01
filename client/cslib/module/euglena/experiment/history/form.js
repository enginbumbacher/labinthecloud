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
            Globals.get('Relay').dispatchEvent('ExperimentCount.Change', {
              old: oldCount,
              count: _this2.historyCount()
            });
          });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvaGlzdG9yeS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJtb2RlbERhdGEiLCJpZCIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJsYWJlbCIsInZhbHVlIiwiZ2V0Iiwib3B0aW9ucyIsImJ1dHRvbnMiLCJiaW5kTWV0aG9kcyIsIl9sYXN0SGlzdG9yeSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfdXBkYXRlTGFzdEhpc3RvcnkiLCJzdHVkZW50X2lkIiwib2xkQ291bnQiLCJoaXN0b3J5Q291bnQiLCJzdGF0aWNIaXN0b3J5IiwiaGlzdG9yeUxvYWQiLCJwcm9taXNlQWpheCIsImRhdGEiLCJmaWx0ZXIiLCJ3aGVyZSIsImlucSIsInN0dWRlbnRJZCIsImxhYiIsInRoZW4iLCJoaXN0b3J5U2VsZWN0b3IiLCJnZXRGaWVsZCIsInZhbCIsImNsZWFyT3B0aW9ucyIsImFkZE9wdGlvbiIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJkYXRlX2NyZWF0ZWQiLCJnZXRUaW1lIiwiZm9yRWFjaCIsImRhdHVtIiwiaW5kIiwidG9Mb2NhbGVTdHJpbmciLCJtYXAiLCJpbmNsdWRlcyIsInBhcnNlSW50Iiwic2V0VmFsdWUiLCJsZW5ndGgiLCJkaXNwYXRjaEV2ZW50Iiwib2xkIiwiY291bnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIk9iamVjdCIsImtleXMiLCJnZXRPcHRpb25zIiwiaXRlbSIsImdldEhpc3RvcnkiLCJldnQiLCJsYXN0IiwiZXhpc3RzIiwiaW1wb3J0IiwiZXhwX2hpc3RvcnlfaWQiLCJkaXNhYmxlT3B0aW9uIiwiZW5hYmxlT3B0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNF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QTVGckIsRUE0RjBCO0FBQ3RCLFlBQU1DLE9BQU8sS0FBSzlCLFFBQUwsQ0FBYyxnQkFBZCxFQUFnQ3RCLEtBQWhDLEVBQWI7QUFDQSxZQUFJb0QsUUFBUSxNQUFSLElBQWtCN0QsTUFBTThELE1BQU4sQ0FBYUQsSUFBYixDQUF0QixFQUEwQztBQUN4QyxlQUFLL0MsWUFBTCxHQUFvQitDLElBQXBCO0FBQ0Q7QUFDRjtBQWpHSDtBQUFBO0FBQUEsNENBbUd3QjtBQUNwQixZQUFJLEtBQUsvQyxZQUFULEVBQXVCO0FBQ3JCLGVBQUtpRCxNQUFMLENBQVk7QUFDVkMsNEJBQWdCLEtBQUtsRDtBQURYLFdBQVo7QUFHRDtBQUNGO0FBekdIO0FBQUE7QUFBQSxtQ0EyR2U7QUFDWCxhQUFLaUIsUUFBTCxDQUFjLGdCQUFkLEVBQWdDa0MsYUFBaEMsQ0FBOEMsTUFBOUM7QUFDRDtBQTdHSDtBQUFBO0FBQUEsa0NBK0djO0FBQ1YsYUFBS2xDLFFBQUwsQ0FBYyxnQkFBZCxFQUFnQ21DLFlBQWhDLENBQTZDLE1BQTdDO0FBQ0Q7QUFqSEg7O0FBQUE7QUFBQSxJQUEyQ2pFLElBQTNDO0FBbUhELENBMUhEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvaGlzdG9yeS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpO1xuXG4gIGNvbnN0IEZvcm0gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0nKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEV4cGVyaW1lbnRIaXN0b3J5Rm9ybSBleHRlbmRzIEZvcm0ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoe1xuICAgICAgICBtb2RlbERhdGE6IHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50X2hpc3RvcnlcIixcbiAgICAgICAgICBjbGFzc2VzOiBbXCJmb3JtX19leHBlcmltZW50X19oaXN0b3J5XCJdLFxuICAgICAgICAgIGZpZWxkczogW1NlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogXCJleHBfaGlzdG9yeV9pZFwiLFxuICAgICAgICAgICAgbGFiZWw6ICdFeHBlcmltZW50JyxcbiAgICAgICAgICAgIHZhbHVlOiBHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpID8gXCJfbmV3XCIgOiBudWxsLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpID8geyBcIl9uZXdcIjogXCIoTmV3IEV4cGVyaW1lbnQpXCIgfSA6IHt9XG4gICAgICAgICAgfSldLFxuICAgICAgICAgIGJ1dHRvbnM6IFtdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ191cGRhdGVMYXN0SGlzdG9yeSddKVxuXG4gICAgICB0aGlzLl9sYXN0SGlzdG9yeSA9IG51bGw7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fdXBkYXRlTGFzdEhpc3RvcnkpXG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgbGV0IHN0dWRlbnRfaWQgPSBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpO1xuICAgICAgbGV0IG9sZENvdW50ID0gdGhpcy5oaXN0b3J5Q291bnQoKTtcbiAgICAgIGlmIChzdHVkZW50X2lkKSB7XG4gICAgICAgIGxldCBzdGF0aWNIaXN0b3J5ID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5Jyk7XG4gICAgICAgIGxldCBoaXN0b3J5TG9hZCA9IG51bGw7XG4gICAgICAgIGlmIChzdGF0aWNIaXN0b3J5KSB7XG4gICAgICAgICAgaGlzdG9yeUxvYWQgPSBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FeHBlcmltZW50cycsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgICAgICAgIGlucTogc3RhdGljSGlzdG9yeVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGlzdG9yeUxvYWQgPSBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FeHBlcmltZW50cy9zdHVkZW50SGlzdG9yeScsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgc3R1ZGVudElkOiBzdHVkZW50X2lkLFxuICAgICAgICAgICAgICBsYWI6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoaXN0b3J5TG9hZC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlzdG9yeVNlbGVjdG9yID0gdGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKTtcbiAgICAgICAgICBjb25zdCB2YWwgPSBoaXN0b3J5U2VsZWN0b3IudmFsdWUoKTtcbiAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIGhpc3RvcnlTZWxlY3Rvci5hZGRPcHRpb24oeyB2YWx1ZTogXCJfbmV3XCIsIGxhYmVsOiBcIihOZXcgRXhwZXJpbWVudClcIn0pO1xuICAgICAgICAgIGRhdGEuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZShiLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGRhdGEuZm9yRWFjaCgoZGF0dW0sIGluZCkgPT4ge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBkYXR1bS5pZCwgbGFiZWw6IChuZXcgRGF0ZShkYXR1bS5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpIH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHZhbCA9PSAnX25ldycgfHwgZGF0YS5tYXAoKGEpID0+IHsgcmV0dXJuIGEuaWQgfSkuaW5jbHVkZXMocGFyc2VJbnQodmFsKSkpIHtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZSh2YWwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZShkYXRhWzBdLmlkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKHZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB7XG4gICAgICAgICAgICBvbGQ6IG9sZENvdW50LFxuICAgICAgICAgICAgY291bnQ6IHRoaXMuaGlzdG9yeUNvdW50KClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKS5jbGVhck9wdGlvbnMoKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHtcbiAgICAgICAgICBvbGQ6IG9sZENvdW50LFxuICAgICAgICAgIGNvdW50OiB0aGlzLmhpc3RvcnlDb3VudCgpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGlzdG9yeSgpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmdldE9wdGlvbnMoKSkuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtICE9ICdfbmV3JztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhpc3RvcnlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEhpc3RvcnkoKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgX3VwZGF0ZUxhc3RIaXN0b3J5KGV2dCkge1xuICAgICAgY29uc3QgbGFzdCA9IHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJykudmFsdWUoKTtcbiAgICAgIGlmIChsYXN0ICE9ICdfbmV3JyAmJiBVdGlscy5leGlzdHMobGFzdCkpIHtcbiAgICAgICAgdGhpcy5fbGFzdEhpc3RvcnkgPSBsYXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldmVydFRvTGFzdEhpc3RvcnkoKSB7XG4gICAgICBpZiAodGhpcy5fbGFzdEhpc3RvcnkpIHtcbiAgICAgICAgdGhpcy5pbXBvcnQoe1xuICAgICAgICAgIGV4cF9oaXN0b3J5X2lkOiB0aGlzLl9sYXN0SGlzdG9yeVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVOZXcoKSB7XG4gICAgICB0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmRpc2FibGVPcHRpb24oJ19uZXcnKTtcbiAgICB9XG5cbiAgICBlbmFibGVOZXcoKSB7XG4gICAgICB0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmVuYWJsZU9wdGlvbignX25ldycpO1xuICAgIH1cbiAgfVxufSkiXX0=
