'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./legend.html'),
      LegendRow = require('./legend__row'),
      Button = require('core/component/button/field');

  return function (_DomView) {
    _inherits(LegendView, _DomView);

    function LegendView(model, tmpl) {
      _classCallCheck(this, LegendView);

      var _this = _possibleConstructorReturn(this, (LegendView.__proto__ || Object.getPrototypeOf(LegendView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onDataSetRemoved', '_onDataSetAdded']);
      _this._rows = [];

      _this._clear = Button.create({
        id: 'clear_all',
        label: 'Clear All',
        style: 'link',
        eventName: 'Legend.ClearAllRequest',
        eventData: {
          experimentId: model.get('experimentId')
        }
      });
      _this.addChild(_this._clear.view(), 'thead th:last-child');
      _this.$el.find('.aggregate__legend__experiment__label').html('Experiment: ' + new Date(model.get('experiment.date_created')).toLocaleString());
      _this.render(model);
      model.addEventListener('ResultGroup.ResultAdded', _this._onDataSetAdded);
      model.addEventListener('ResultGroup.ResultRemoved', _this._onDataSetRemoved);
      return _this;
    }

    _createClass(LegendView, [{
      key: '_onDataSetAdded',
      value: function _onDataSetAdded(evt) {
        this.render(evt.currentTarget);
      }
    }, {
      key: '_onDataSetRemoved',
      value: function _onDataSetRemoved(evt) {
        this.render(evt.currentTarget);
      }
    }, {
      key: 'render',
      value: function render(model) {
        var _this2 = this;

        while (this._rows.length) {
          this.removeChild(this._rows.pop());
        }

        model.get('results').forEach(function (res) {
          var row = new LegendRow(res);
          _this2._rows.push(row);
          _this2.addChild(row, '.aggregate__legend__experiment__list tbody');
        });
      }
    }]);

    return LegendView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbGVnZW5kL2xlZ2VuZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJMZWdlbmRSb3ciLCJCdXR0b24iLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9yb3dzIiwiX2NsZWFyIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsInN0eWxlIiwiZXZlbnROYW1lIiwiZXZlbnREYXRhIiwiZXhwZXJpbWVudElkIiwiZ2V0IiwiYWRkQ2hpbGQiLCJ2aWV3IiwiJGVsIiwiZmluZCIsImh0bWwiLCJEYXRlIiwidG9Mb2NhbGVTdHJpbmciLCJyZW5kZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uRGF0YVNldEFkZGVkIiwiX29uRGF0YVNldFJlbW92ZWQiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwibGVuZ3RoIiwicmVtb3ZlQ2hpbGQiLCJwb3AiLCJmb3JFYWNoIiwicmVzIiwicm93IiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksVUFBVUosUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VLLFdBQVdMLFFBQVEsb0JBQVIsQ0FEYjtBQUFBLE1BRUVNLFlBQVlOLFFBQVEsZUFBUixDQUZkO0FBQUEsTUFHRU8sU0FBU1AsUUFBUSw2QkFBUixDQUhYOztBQUtBO0FBQUE7O0FBQ0Usd0JBQVlRLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsMEhBQ2pCQSxRQUFRSixRQURTOztBQUV2QkosWUFBTVMsV0FBTixRQUF3QixDQUFDLG1CQUFELEVBQXNCLGlCQUF0QixDQUF4QjtBQUNBLFlBQUtDLEtBQUwsR0FBYSxFQUFiOztBQUVBLFlBQUtDLE1BQUwsR0FBY0wsT0FBT00sTUFBUCxDQUFjO0FBQzFCQyxZQUFJLFdBRHNCO0FBRTFCQyxlQUFPLFdBRm1CO0FBRzFCQyxlQUFPLE1BSG1CO0FBSTFCQyxtQkFBVyx3QkFKZTtBQUsxQkMsbUJBQVc7QUFDVEMsd0JBQWNYLE1BQU1ZLEdBQU4sQ0FBVSxjQUFWO0FBREw7QUFMZSxPQUFkLENBQWQ7QUFTQSxZQUFLQyxRQUFMLENBQWMsTUFBS1QsTUFBTCxDQUFZVSxJQUFaLEVBQWQsRUFBa0MscUJBQWxDO0FBQ0EsWUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsdUNBQWQsRUFBdURDLElBQXZELGtCQUE0RSxJQUFJQyxJQUFKLENBQVNsQixNQUFNWSxHQUFOLENBQVUseUJBQVYsQ0FBVCxDQUFELENBQWlETyxjQUFqRCxFQUEzRTtBQUNBLFlBQUtDLE1BQUwsQ0FBWXBCLEtBQVo7QUFDQUEsWUFBTXFCLGdCQUFOLENBQXVCLHlCQUF2QixFQUFrRCxNQUFLQyxlQUF2RDtBQUNBdEIsWUFBTXFCLGdCQUFOLENBQXVCLDJCQUF2QixFQUFvRCxNQUFLRSxpQkFBekQ7QUFsQnVCO0FBbUJ4Qjs7QUFwQkg7QUFBQTtBQUFBLHNDQXNCa0JDLEdBdEJsQixFQXNCdUI7QUFDbkIsYUFBS0osTUFBTCxDQUFZSSxJQUFJQyxhQUFoQjtBQUNEO0FBeEJIO0FBQUE7QUFBQSx3Q0EwQm9CRCxHQTFCcEIsRUEwQnlCO0FBQ3JCLGFBQUtKLE1BQUwsQ0FBWUksSUFBSUMsYUFBaEI7QUFDRDtBQTVCSDtBQUFBO0FBQUEsNkJBOEJTekIsS0E5QlQsRUE4QmdCO0FBQUE7O0FBQ1osZUFBTyxLQUFLRyxLQUFMLENBQVd1QixNQUFsQixFQUEwQjtBQUN4QixlQUFLQyxXQUFMLENBQWlCLEtBQUt4QixLQUFMLENBQVd5QixHQUFYLEVBQWpCO0FBQ0Q7O0FBRUQ1QixjQUFNWSxHQUFOLENBQVUsU0FBVixFQUFxQmlCLE9BQXJCLENBQTZCLFVBQUNDLEdBQUQsRUFBUztBQUNwQyxjQUFNQyxNQUFNLElBQUlqQyxTQUFKLENBQWNnQyxHQUFkLENBQVo7QUFDQSxpQkFBSzNCLEtBQUwsQ0FBVzZCLElBQVgsQ0FBZ0JELEdBQWhCO0FBQ0EsaUJBQUtsQixRQUFMLENBQWNrQixHQUFkLEVBQW1CLDRDQUFuQjtBQUNELFNBSkQ7QUFLRDtBQXhDSDs7QUFBQTtBQUFBLElBQWdDbkMsT0FBaEM7QUEwQ0QsQ0FwREQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL3RhYi9sZWdlbmQvbGVnZW5kLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
