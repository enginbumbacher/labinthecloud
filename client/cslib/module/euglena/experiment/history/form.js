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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvaGlzdG9yeS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiVXRpbHMiLCJGb3JtIiwiU2VsZWN0RmllbGQiLCJtb2RlbERhdGEiLCJpZCIsImNsYXNzZXMiLCJmaWVsZHMiLCJjcmVhdGUiLCJsYWJlbCIsInZhbHVlIiwiZ2V0Iiwib3B0aW9ucyIsImJ1dHRvbnMiLCJiaW5kTWV0aG9kcyIsIl9sYXN0SGlzdG9yeSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfdXBkYXRlTGFzdEhpc3RvcnkiLCJzdHVkZW50X2lkIiwib2xkQ291bnQiLCJoaXN0b3J5Q291bnQiLCJzdGF0aWNIaXN0b3J5IiwiaGlzdG9yeUxvYWQiLCJwcm9taXNlQWpheCIsImRhdGEiLCJmaWx0ZXIiLCJ3aGVyZSIsImlucSIsInN0dWRlbnRJZCIsImxhYiIsInRoZW4iLCJoaXN0b3J5U2VsZWN0b3IiLCJnZXRGaWVsZCIsInZhbCIsImNsZWFyT3B0aW9ucyIsImFkZE9wdGlvbiIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJkYXRlX2NyZWF0ZWQiLCJnZXRUaW1lIiwiZm9yRWFjaCIsImRhdHVtIiwiaW5kIiwiY29uY2F0IiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwibGVuZ3RoIiwibWFwIiwiaW5jbHVkZXMiLCJwYXJzZUludCIsInNldFZhbHVlIiwiZGlzcGF0Y2hFdmVudCIsIm9sZCIsImNvdW50IiwiUHJvbWlzZSIsInJlc29sdmUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsIml0ZW0iLCJnZXRIaXN0b3J5IiwiZXZ0IiwibGFzdCIsImV4aXN0cyIsImltcG9ydCIsImV4cF9oaXN0b3J5X2lkIiwiZGlzYWJsZU9wdGlvbiIsImVuYWJsZU9wdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFS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LGVBQU8sS0FBS0MsVUFBTCxHQUFrQmQsTUFBekI7QUFDRDtBQTNGSDtBQUFBO0FBQUEseUNBNkZxQmUsR0E3RnJCLEVBNkYwQjtBQUN0QixZQUFNQyxPQUFPLEtBQUtoQyxRQUFMLENBQWMsZ0JBQWQsRUFBZ0N0QixLQUFoQyxFQUFiO0FBQ0EsWUFBSXNELFFBQVEsTUFBUixJQUFrQi9ELE1BQU1nRSxNQUFOLENBQWFELElBQWIsQ0FBdEIsRUFBMEM7QUFDeEMsZUFBS2pELFlBQUwsR0FBb0JpRCxJQUFwQjtBQUNEO0FBQ0Y7QUFsR0g7QUFBQTtBQUFBLDRDQW9Hd0I7QUFDcEIsWUFBSSxLQUFLakQsWUFBVCxFQUF1QjtBQUNyQixlQUFLbUQsTUFBTCxDQUFZO0FBQ1ZDLDRCQUFnQixLQUFLcEQ7QUFEWCxXQUFaO0FBR0Q7QUFDRjtBQTFHSDtBQUFBO0FBQUEsbUNBNEdlO0FBQ1gsYUFBS2lCLFFBQUwsQ0FBYyxnQkFBZCxFQUFnQ29DLGFBQWhDLENBQThDLE1BQTlDO0FBQ0Q7QUE5R0g7QUFBQTtBQUFBLGtDQWdIYztBQUNWLGFBQUtwQyxRQUFMLENBQWMsZ0JBQWQsRUFBZ0NxQyxZQUFoQyxDQUE2QyxNQUE3QztBQUNEO0FBbEhIOztBQUFBO0FBQUEsSUFBMkNuRSxJQUEzQztBQW9IRCxDQTNIRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L2hpc3RvcnkvZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKTtcblxuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpO1xuXG4gIHJldHVybiBjbGFzcyBFeHBlcmltZW50SGlzdG9yeUZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKHtcbiAgICAgICAgbW9kZWxEYXRhOiB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudF9oaXN0b3J5XCIsXG4gICAgICAgICAgY2xhc3NlczogW1wiZm9ybV9fZXhwZXJpbWVudF9faGlzdG9yeVwiXSxcbiAgICAgICAgICBmaWVsZHM6IFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwiZXhwX2hpc3RvcnlfaWRcIixcbiAgICAgICAgICAgIGxhYmVsOiAnRXhwZXJpbWVudCcsXG4gICAgICAgICAgICB2YWx1ZTogR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSA/IFwiX25ld1wiIDogbnVsbCxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSA/IHsgXCJfbmV3XCI6IFwiKE5ldyBFeHBlcmltZW50KVwiIH0gOiB7fVxuICAgICAgICAgIH0pXSxcbiAgICAgICAgICBidXR0b25zOiBbXVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfdXBkYXRlTGFzdEhpc3RvcnknXSlcblxuICAgICAgdGhpcy5fbGFzdEhpc3RvcnkgPSBudWxsO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX3VwZGF0ZUxhc3RIaXN0b3J5KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgIGxldCBzdHVkZW50X2lkID0gR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKTtcbiAgICAgIGxldCBvbGRDb3VudCA9IHRoaXMuaGlzdG9yeUNvdW50KCk7XG4gICAgICBpZiAoc3R1ZGVudF9pZCkge1xuICAgICAgICBsZXQgc3RhdGljSGlzdG9yeSA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5leHBlcmltZW50SGlzdG9yeScpO1xuICAgICAgICBsZXQgaGlzdG9yeUxvYWQgPSBudWxsO1xuICAgICAgICBpZiAoc3RhdGljSGlzdG9yeSkge1xuICAgICAgICAgIGhpc3RvcnlMb2FkID0gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMnLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgICBpZDoge1xuICAgICAgICAgICAgICAgICAgICBpbnE6IHN0YXRpY0hpc3RvcnlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhpc3RvcnlMb2FkID0gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMvc3R1ZGVudEhpc3RvcnknLCB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIHN0dWRlbnRJZDogc3R1ZGVudF9pZCxcbiAgICAgICAgICAgICAgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGlzdG9yeUxvYWQudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhpc3RvcnlTZWxlY3RvciA9IHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJyk7XG4gICAgICAgICAgY29uc3QgdmFsID0gaGlzdG9yeVNlbGVjdG9yLnZhbHVlKCk7XG4gICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLmNsZWFyT3B0aW9ucygpO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSBoaXN0b3J5U2VsZWN0b3IuYWRkT3B0aW9uKHsgdmFsdWU6IFwiX25ld1wiLCBsYWJlbDogXCIoTmV3IEV4cGVyaW1lbnQpXCJ9KTtcbiAgICAgICAgICBkYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAobmV3IERhdGUoYi5kYXRlX2NyZWF0ZWQpKS5nZXRUaW1lKCkgLSAobmV3IERhdGUoYS5kYXRlX2NyZWF0ZWQpKS5nZXRUaW1lKClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkYXRhLmZvckVhY2goKGRhdHVtLCBpbmQpID0+IHtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5hZGRPcHRpb24oeyB2YWx1ZTogZGF0dW0uaWQsIGxhYmVsOiBcIkV4cGVyaW1lbnQgXCIuY29uY2F0KFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBkYXRhLmxlbmd0aCAtIGluZCAtIDEpKSB9KTtcbiAgICAgICAgICAgIC8vaGlzdG9yeVNlbGVjdG9yLmFkZE9wdGlvbih7IHZhbHVlOiBkYXR1bS5pZCwgbGFiZWw6IChuZXcgRGF0ZShkYXR1bS5kYXRlX2NyZWF0ZWQpKS50b0xvY2FsZVN0cmluZygpIH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHZhbCA9PSAnX25ldycgfHwgZGF0YS5tYXAoKGEpID0+IHsgcmV0dXJuIGEuaWQgfSkuaW5jbHVkZXMocGFyc2VJbnQodmFsKSkpIHtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZSh2YWwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGhpc3RvcnlTZWxlY3Rvci5zZXRWYWx1ZShkYXRhWzBdLmlkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGlzdG9yeVNlbGVjdG9yLnNldFZhbHVlKHZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB7XG4gICAgICAgICAgICBvbGQ6IG9sZENvdW50LFxuICAgICAgICAgICAgY291bnQ6IHRoaXMuaGlzdG9yeUNvdW50KClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXRGaWVsZCgnZXhwX2hpc3RvcnlfaWQnKS5jbGVhck9wdGlvbnMoKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHtcbiAgICAgICAgICBvbGQ6IG9sZENvdW50LFxuICAgICAgICAgIGNvdW50OiB0aGlzLmhpc3RvcnlDb3VudCgpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGlzdG9yeSgpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmdldE9wdGlvbnMoKSkuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtICE9ICdfbmV3JztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGhpc3RvcnlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEhpc3RvcnkoKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgX3VwZGF0ZUxhc3RIaXN0b3J5KGV2dCkge1xuICAgICAgY29uc3QgbGFzdCA9IHRoaXMuZ2V0RmllbGQoJ2V4cF9oaXN0b3J5X2lkJykudmFsdWUoKTtcbiAgICAgIGlmIChsYXN0ICE9ICdfbmV3JyAmJiBVdGlscy5leGlzdHMobGFzdCkpIHtcbiAgICAgICAgdGhpcy5fbGFzdEhpc3RvcnkgPSBsYXN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldmVydFRvTGFzdEhpc3RvcnkoKSB7XG4gICAgICBpZiAodGhpcy5fbGFzdEhpc3RvcnkpIHtcbiAgICAgICAgdGhpcy5pbXBvcnQoe1xuICAgICAgICAgIGV4cF9oaXN0b3J5X2lkOiB0aGlzLl9sYXN0SGlzdG9yeVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVOZXcoKSB7XG4gICAgICB0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmRpc2FibGVPcHRpb24oJ19uZXcnKTtcbiAgICB9XG5cbiAgICBlbmFibGVOZXcoKSB7XG4gICAgICB0aGlzLmdldEZpZWxkKCdleHBfaGlzdG9yeV9pZCcpLmVuYWJsZU9wdGlvbignX25ldycpO1xuICAgIH1cbiAgfVxufSlcbiJdfQ==
