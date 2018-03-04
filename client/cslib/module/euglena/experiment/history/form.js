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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvaGlzdG9yeS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJtb2RlbERhdGEiLCJpZCIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJsYWJlbCIsInZhbHVlIiwiZ2V0Iiwib3B0aW9ucyIsImRlc2NyaXB0aW9uIiwiYnV0dG9ucyIsImJpbmRNZXRob2RzIiwiX2xhc3RIaXN0b3J5IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl91cGRhdGVMYXN0SGlzdG9yeSIsInN0dWRlbnRfaWQiLCJvbGRDb3VudCIsImhpc3RvcnlDb3VudCIsInN0YXRpY0hpc3RvcnkiLCJoaXN0b3J5TG9hZCIsInByb21pc2VBamF4IiwiZGF0YSIsImZpbHRlciIsIndoZXJlIiwiaW5xIiwic3R1ZGVudElkIiwibGFiIiwidGhlbiIsImhpc3RvcnlTZWxlY3RvciIsImdldEZpZWxkIiwidmFsIiwiY2xlYXJPcHRpb25zIiwiYWRkT3B0aW9uIiwic29ydCIsImEiLCJiIiwiRGF0ZSIsImRhdGVfY3JlYXRlZCIsImdldFRpbWUiLCJmb3JFYWNoIiwiZGF0dW0iLCJpbmQiLCJjb25jYXQiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJsZW5ndGgiLCJtYXAiLCJpbmNsdWRlcyIsInBhcnNlSW50Iiwic2V0VmFsdWUiLCJkaXNwYXRjaEV2ZW50Iiwib2xkIiwiY291bnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIk9iamVjdCIsImtleXMiLCJnZXRPcHRpb25zIiwiaXRlbSIsImdldEhpc3RvcnkiLCJldnQiLCJsYXN0IiwiZXhpc3RzIiwiaW1wb3J0IiwiZXhwX2hpc3RvcnlfaWQiLCJkaXNhYmxlT3B0aW9uIiwiZW5hYmxlT3B0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVB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QUFHRDtBQXhGSDtBQUFBO0FBQUEscUNBMEZpQjtBQUNiLGVBQU8sS0FBS0MsVUFBTCxHQUFrQmQsTUFBekI7QUFDRDtBQTVGSDtBQUFBO0FBQUEseUNBOEZxQmUsR0E5RnJCLEVBOEYwQjtBQUN0QixZQUFNQyxPQUFPLEtBQUtoQyxRQUFMLENBQWMsZ0JBQWQsRUFBZ0N2QixLQUFoQyxFQUFiO0FBQ0EsWUFBSXVELFFBQVEsTUFBUixJQUFrQmhFLE1BQU1pRSxNQUFOLENBQWFELElBQWIsQ0FBdEIsRUFBMEM7QUFDeEMsZUFBS2pELFlBQUwsR0FBb0JpRCxJQUFwQjtBQUNEO0FBQ0Y7QUFuR0g7QUFBQTtBQUFBLDRDQXFHd0I7QUFDcEIsWUFBSSxLQUFLakQsWUFBVCxFQUF1QjtBQUNyQixlQUFLbUQsTUFBTCxDQUFZO0FBQ1ZDLDRCQUFnQixLQUFLcEQ7QUFEWCxXQUFaO0FBR0Q7QUFDRjtBQTNHSDtBQUFBO0FBQUEsbUNBNkdlO0FBQ1gsYUFBS2lCLFFBQUwsQ0FBYyxnQkFBZCxFQUFnQ29DLGFBQWhDLENBQThDLE1BQTlDO0FBQ0Q7QUEvR0g7QUFBQTtBQUFBLGtDQWlIYztBQUNWLGFBQUtwQyxRQUFMLENBQWMsZ0JBQWQsRUFBZ0NxQyxZQUFoQyxDQUE2QyxNQUE3QztBQUNEO0FBbkhIOztBQUFBO0FBQUEsSUFBMkNwRSxJQUEzQztBQXFIRCxDQTVIRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L2hpc3RvcnkvZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKTtcblxuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpO1xuXG4gIHJldHVybiBjbGFzcyBFeHBlcmltZW50SGlzdG9yeUZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKHtcbiAgICAgICAgbW9kZWxEYXRhOiB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudF9oaXN0b3J5XCIsXG4gICAgICAgICAgY2xhc3NlczogW1wiZm9ybV9fZXhwZXJpbWVudF9faGlzdG9yeVwiXSxcbiAgICAgICAgICBmaWVsZHM6IFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwiZXhwX2hpc3RvcnlfaWRcIixcbiAgICAgICAgICAgIGxhYmVsOiAnRXhwZXJpbWVudCcsXG4gICAgICAgICAgICB2YWx1ZTogR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSA/IFwiX25ld1wiIDogbnVsbCxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSA/IHsgXCJfbmV3XCI6IFwiKE5ldyBFeHBlcmltZW50KVwiIH0gOiB7fSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ2hvb3NlIGRpZmZlcmVudCBleHBlcmltZW50cyB0aGF0IGhhdmUgYmVlbiBnZW5lcmF0ZWQgb3Igc2F2ZWQgcHJldmlvdXNseS4nXG4gICAgICAgICAgfSldLFxuICAgICAgICAgIGJ1dHRvbnM6IFtdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ191cGRhdGVMYXN0SGlzdG9yeSddKVxuXG4gICAgICB0aGlzLl9sYXN0SGlzdG9yeSA9IG51bGw7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fdXBkYXRlTGFzdEhpc3RvcnkpXG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgbGV0IHN0dWRlbnRfaWQgPSBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpO1xuICAgICAgbGV0IG9sZENvdW50ID0gdGhpcy5oaXN0b3J5Q291bnQoKTtcbiAgICAgIGlmIChzdHVkZW50X2lkKSB7XG4gICAgICAgIGxldCBzdGF0aWNIaXN0b3J5ID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV4cGVyaW1lbnRIaXN0b3J5Jyk7XG4gICAgICAgIGxldCBoaXN0b3J5TG9hZCA9IG51bGw7XG4gICAgICAgIGlmIChzdGF0aWNIaXN0b3J5KSB7XG4gICAgICAgICAgaGlzdG9yeUxvYWQgPSBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FeHBlcmltZW50cycsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgICAgICAgIGlucTogc3RhdGljSGlzdG9yeVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGlzdG9yeUxvYWQgPSBVdGlscy5wcm9taXNlQWpheCgnL2FwaS92MS9FeHBlcmltZW50cy9zdHVkZW50SGlzdG9yeScsIHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgc3R1ZGVudElkOiBzdHVkZW50X2lkLFxuICAgICAgICAgICAgICBsYWI6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoaXN0b3J5TG9hZC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGlzdG9yeVNlbGVjdG9yID0gdGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKTtcbiAgICAgICAgICBjb25zdCB2YWwgPSBoaXN0b3J5U2VsZWN0b3IudmFsdWUoKTtcbiAgICAgICAgICBoaXN0b3J5U2VsZWN0b3IuY2xlYXJPcHRpb25zKCk7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIGhpc3RvcnlTZWxlY3Rvci5hZGRPcHRpb24oeyB2YWx1ZTogXCJfbmV3XCIsIGxhYmVsOiBcIihOZXcgRXhwZXJpbWVudClcIn0pO1xuICAgICAgICAgIGRhdGEuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZShiLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGRhdGEuZm9yRWFjaCgoZGF0dW0sIGluZCkgPT4ge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBkYXR1bS5pZCwgbGFiZWw6IFwiRXhwZXJpbWVudCBcIi5jb25jYXQoU3RyaW5nLmZyb21DaGFyQ29kZSg2NSArIGRhdGEubGVuZ3RoIC0gaW5kIC0gMSkpIH0pO1xuICAgICAgICAgICAgLy9oaXN0b3J5U2VsZWN0b3IuYWRkT3B0aW9uKHsgdmFsdWU6IGRhdHVtLmlkLCBsYWJlbDogKG5ldyBEYXRlKGRhdHVtLmRhdGVfY3JlYXRlZCkpLnRvTG9jYWxlU3RyaW5nKCkgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAodmFsID09ICdfbmV3JyB8fCBkYXRhLm1hcCgoYSkgPT4geyByZXR1cm4gYS5pZCB9KS5pbmNsdWRlcyhwYXJzZUludCh2YWwpKSkge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKHZhbCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKGRhdGFbMF0uaWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoaXN0b3J5U2VsZWN0b3Iuc2V0VmFsdWUodmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHtcbiAgICAgICAgICAgIG9sZDogb2xkQ291bnQsXG4gICAgICAgICAgICBjb3VudDogdGhpcy5oaXN0b3J5Q291bnQoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmNsZWFyT3B0aW9ucygpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywge1xuICAgICAgICAgIG9sZDogb2xkQ291bnQsXG4gICAgICAgICAgY291bnQ6IHRoaXMuaGlzdG9yeUNvdW50KClcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRIaXN0b3J5KCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJykuZ2V0T3B0aW9ucygpKS5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0gIT0gJ19uZXcnO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGlzdG9yeUNvdW50KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SGlzdG9yeSgpLmxlbmd0aDtcbiAgICB9XG5cbiAgICBfdXBkYXRlTGFzdEhpc3RvcnkoZXZ0KSB7XG4gICAgICBjb25zdCBsYXN0ID0gdGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKS52YWx1ZSgpO1xuICAgICAgaWYgKGxhc3QgIT0gJ19uZXcnICYmIFV0aWxzLmV4aXN0cyhsYXN0KSkge1xuICAgICAgICB0aGlzLl9sYXN0SGlzdG9yeSA9IGxhc3Q7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV2ZXJ0VG9MYXN0SGlzdG9yeSgpIHtcbiAgICAgIGlmICh0aGlzLl9sYXN0SGlzdG9yeSkge1xuICAgICAgICB0aGlzLmltcG9ydCh7XG4gICAgICAgICAgZXhwX2hpc3RvcnlfaWQ6IHRoaXMuX2xhc3RIaXN0b3J5XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZU5ldygpIHtcbiAgICAgIHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJykuZGlzYWJsZU9wdGlvbignX25ldycpO1xuICAgIH1cblxuICAgIGVuYWJsZU5ldygpIHtcbiAgICAgIHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJykuZW5hYmxlT3B0aW9uKCdfbmV3Jyk7XG4gICAgfVxuICB9XG59KVxuIl19
