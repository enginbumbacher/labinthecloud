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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbGVnZW5kL2xlZ2VuZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJMZWdlbmRSb3ciLCJCdXR0b24iLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9yb3dzIiwiX2NsZWFyIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsInN0eWxlIiwiZXZlbnROYW1lIiwiZXZlbnREYXRhIiwiZXhwZXJpbWVudElkIiwiZ2V0IiwiYWRkQ2hpbGQiLCJ2aWV3IiwiJGVsIiwiZmluZCIsImh0bWwiLCJEYXRlIiwidG9Mb2NhbGVTdHJpbmciLCJyZW5kZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uRGF0YVNldEFkZGVkIiwiX29uRGF0YVNldFJlbW92ZWQiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwibGVuZ3RoIiwicmVtb3ZlQ2hpbGQiLCJwb3AiLCJmb3JFYWNoIiwicmVzIiwicm93IiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksVUFBVUosUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VLLFdBQVdMLFFBQVEsb0JBQVIsQ0FEYjtBQUFBLE1BRUVNLFlBQVlOLFFBQVEsZUFBUixDQUZkO0FBQUEsTUFHRU8sU0FBU1AsUUFBUSw2QkFBUixDQUhYOztBQUtBO0FBQUE7O0FBQ0Usd0JBQVlRLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsMEhBQ2pCQSxRQUFRSixRQURTOztBQUV2QkosWUFBTVMsV0FBTixRQUF3QixDQUFDLG1CQUFELEVBQXNCLGlCQUF0QixDQUF4QjtBQUNBLFlBQUtDLEtBQUwsR0FBYSxFQUFiOztBQUVBLFlBQUtDLE1BQUwsR0FBY0wsT0FBT00sTUFBUCxDQUFjO0FBQzFCQyxZQUFJLFdBRHNCO0FBRTFCQyxlQUFPLFdBRm1CO0FBRzFCQyxlQUFPLE1BSG1CO0FBSTFCQyxtQkFBVyx3QkFKZTtBQUsxQkMsbUJBQVc7QUFDVEMsd0JBQWNYLE1BQU1ZLEdBQU4sQ0FBVSxjQUFWO0FBREw7QUFMZSxPQUFkLENBQWQ7QUFTQSxZQUFLQyxRQUFMLENBQWMsTUFBS1QsTUFBTCxDQUFZVSxJQUFaLEVBQWQsRUFBa0MscUJBQWxDO0FBQ0EsWUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsdUNBQWQsRUFBdURDLElBQXZELGtCQUE0RSxJQUFJQyxJQUFKLENBQVNsQixNQUFNWSxHQUFOLENBQVUseUJBQVYsQ0FBVCxDQUFELENBQWlETyxjQUFqRCxFQUEzRTtBQUNBLFlBQUtDLE1BQUwsQ0FBWXBCLEtBQVo7QUFDQUEsWUFBTXFCLGdCQUFOLENBQXVCLHlCQUF2QixFQUFrRCxNQUFLQyxlQUF2RDtBQUNBdEIsWUFBTXFCLGdCQUFOLENBQXVCLDJCQUF2QixFQUFvRCxNQUFLRSxpQkFBekQ7QUFsQnVCO0FBbUJ4Qjs7QUFwQkg7QUFBQTtBQUFBLHNDQXNCa0JDLEdBdEJsQixFQXNCdUI7QUFDbkIsYUFBS0osTUFBTCxDQUFZSSxJQUFJQyxhQUFoQjtBQUNEO0FBeEJIO0FBQUE7QUFBQSx3Q0EwQm9CRCxHQTFCcEIsRUEwQnlCO0FBQ3JCLGFBQUtKLE1BQUwsQ0FBWUksSUFBSUMsYUFBaEI7QUFDRDtBQTVCSDtBQUFBO0FBQUEsNkJBOEJTekIsS0E5QlQsRUE4QmdCO0FBQUE7O0FBQ1osZUFBTyxLQUFLRyxLQUFMLENBQVd1QixNQUFsQixFQUEwQjtBQUN4QixlQUFLQyxXQUFMLENBQWlCLEtBQUt4QixLQUFMLENBQVd5QixHQUFYLEVBQWpCO0FBQ0Q7O0FBRUQ1QixjQUFNWSxHQUFOLENBQVUsU0FBVixFQUFxQmlCLE9BQXJCLENBQTZCLFVBQUNDLEdBQUQsRUFBUztBQUNwQyxjQUFNQyxNQUFNLElBQUlqQyxTQUFKLENBQWNnQyxHQUFkLENBQVo7QUFDQSxpQkFBSzNCLEtBQUwsQ0FBVzZCLElBQVgsQ0FBZ0JELEdBQWhCO0FBQ0EsaUJBQUtsQixRQUFMLENBQWNrQixHQUFkLEVBQW1CLDRDQUFuQjtBQUNELFNBSkQ7QUFLRDtBQXhDSDs7QUFBQTtBQUFBLElBQWdDbkMsT0FBaEM7QUEwQ0QsQ0FwREQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL3RhYi9sZWdlbmQvbGVnZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcbiAgXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9sZWdlbmQuaHRtbCcpLFxuICAgIExlZ2VuZFJvdyA9IHJlcXVpcmUoJy4vbGVnZW5kX19yb3cnKSxcbiAgICBCdXR0b24gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQnKTtcblxuICByZXR1cm4gY2xhc3MgTGVnZW5kVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRGF0YVNldFJlbW92ZWQnLCAnX29uRGF0YVNldEFkZGVkJ10pXG4gICAgICB0aGlzLl9yb3dzID0gW107XG5cbiAgICAgIHRoaXMuX2NsZWFyID0gQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnY2xlYXJfYWxsJyxcbiAgICAgICAgbGFiZWw6ICdDbGVhciBBbGwnLFxuICAgICAgICBzdHlsZTogJ2xpbmsnLFxuICAgICAgICBldmVudE5hbWU6ICdMZWdlbmQuQ2xlYXJBbGxSZXF1ZXN0JyxcbiAgICAgICAgZXZlbnREYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiBtb2RlbC5nZXQoJ2V4cGVyaW1lbnRJZCcpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2NsZWFyLnZpZXcoKSwgJ3RoZWFkIHRoOmxhc3QtY2hpbGQnKVxuICAgICAgdGhpcy4kZWwuZmluZCgnLmFnZ3JlZ2F0ZV9fbGVnZW5kX19leHBlcmltZW50X19sYWJlbCcpLmh0bWwoYEV4cGVyaW1lbnQ6ICR7KG5ldyBEYXRlKG1vZGVsLmdldCgnZXhwZXJpbWVudC5kYXRlX2NyZWF0ZWQnKSkpLnRvTG9jYWxlU3RyaW5nKCl9YClcbiAgICAgIHRoaXMucmVuZGVyKG1vZGVsKTtcbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ1Jlc3VsdEdyb3VwLlJlc3VsdEFkZGVkJywgdGhpcy5fb25EYXRhU2V0QWRkZWQpO1xuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignUmVzdWx0R3JvdXAuUmVzdWx0UmVtb3ZlZCcsIHRoaXMuX29uRGF0YVNldFJlbW92ZWQpO1xuICAgIH1cblxuICAgIF9vbkRhdGFTZXRBZGRlZChldnQpIHtcbiAgICAgIHRoaXMucmVuZGVyKGV2dC5jdXJyZW50VGFyZ2V0KVxuICAgIH1cblxuICAgIF9vbkRhdGFTZXRSZW1vdmVkKGV2dCkge1xuICAgICAgdGhpcy5yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgIH1cblxuICAgIHJlbmRlcihtb2RlbCkge1xuICAgICAgd2hpbGUgKHRoaXMuX3Jvd3MubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5fcm93cy5wb3AoKSk7XG4gICAgICB9XG5cbiAgICAgIG1vZGVsLmdldCgncmVzdWx0cycpLmZvckVhY2goKHJlcykgPT4ge1xuICAgICAgICBjb25zdCByb3cgPSBuZXcgTGVnZW5kUm93KHJlcylcbiAgICAgICAgdGhpcy5fcm93cy5wdXNoKHJvdyk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQocm93LCAnLmFnZ3JlZ2F0ZV9fbGVnZW5kX19leHBlcmltZW50X19saXN0IHRib2R5JylcbiAgICAgIH0pXG4gICAgfVxuICB9ICBcbn0pIl19
