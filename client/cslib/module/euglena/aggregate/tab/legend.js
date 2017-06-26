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
      LegendRow = require('./legend__row');

  return function (_DomView) {
    _inherits(LegendView, _DomView);

    function LegendView(model, tmpl, experimentId) {
      _classCallCheck(this, LegendView);

      var _this = _possibleConstructorReturn(this, (LegendView.__proto__ || Object.getPrototypeOf(LegendView)).call(this, tmpl || Template));

      _this._experimentId = experimentId;
      _this._rows = [];

      _this.$el.find('.aggregate__legend__experiment__label').html();
      model.addEventListener('AggregateData.DataSetAdded', _this._onDataSetAdded);
      model.addEventListener('AggregateData.DataSetRemoved', _this._onDataSetRemoved);
      return _this;
    }

    _createClass(LegendView, [{
      key: '_onDataSetAdded',
      value: function _onDataSetAdded(evt) {
        if (evt.data.dataset.experimentId == this._experimentId) {
          var row = new LegendRow(evt.data.dataset);
          this._rows.push(row);
          this.addChild(row, '.aggregate__legend__experiment__list tbody');
        }
      }
    }, {
      key: '_onDataSetRemoved',
      value: function _onDataSetRemoved(evt) {}
    }]);

    return LegendView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbGVnZW5kLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIkxlZ2VuZFJvdyIsIm1vZGVsIiwidG1wbCIsImV4cGVyaW1lbnRJZCIsIl9leHBlcmltZW50SWQiLCJfcm93cyIsIiRlbCIsImZpbmQiLCJodG1sIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkRhdGFTZXRBZGRlZCIsIl9vbkRhdGFTZXRSZW1vdmVkIiwiZXZ0IiwiZGF0YSIsImRhdGFzZXQiLCJyb3ciLCJwdXNoIiwiYWRkQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLG9CQUFSLENBRGI7QUFBQSxNQUVFTSxZQUFZTixRQUFRLGVBQVIsQ0FGZDs7QUFJQTtBQUFBOztBQUNFLHdCQUFZTyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QkMsWUFBekIsRUFBdUM7QUFBQTs7QUFBQSwwSEFDL0JELFFBQVFILFFBRHVCOztBQUVyQyxZQUFLSyxhQUFMLEdBQXFCRCxZQUFyQjtBQUNBLFlBQUtFLEtBQUwsR0FBYSxFQUFiOztBQUVBLFlBQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHVDQUFkLEVBQXVEQyxJQUF2RDtBQUNBUCxZQUFNUSxnQkFBTixDQUF1Qiw0QkFBdkIsRUFBcUQsTUFBS0MsZUFBMUQ7QUFDQVQsWUFBTVEsZ0JBQU4sQ0FBdUIsOEJBQXZCLEVBQXVELE1BQUtFLGlCQUE1RDtBQVBxQztBQVF0Qzs7QUFUSDtBQUFBO0FBQUEsc0NBV2tCQyxHQVhsQixFQVd1QjtBQUNuQixZQUFJQSxJQUFJQyxJQUFKLENBQVNDLE9BQVQsQ0FBaUJYLFlBQWpCLElBQWlDLEtBQUtDLGFBQTFDLEVBQXlEO0FBQ3ZELGNBQU1XLE1BQU0sSUFBSWYsU0FBSixDQUFjWSxJQUFJQyxJQUFKLENBQVNDLE9BQXZCLENBQVo7QUFDQSxlQUFLVCxLQUFMLENBQVdXLElBQVgsQ0FBZ0JELEdBQWhCO0FBQ0EsZUFBS0UsUUFBTCxDQUFjRixHQUFkLEVBQW1CLDRDQUFuQjtBQUNEO0FBQ0Y7QUFqQkg7QUFBQTtBQUFBLHdDQW1Cb0JILEdBbkJwQixFQW1CeUIsQ0FFdEI7QUFyQkg7O0FBQUE7QUFBQSxJQUFnQ2QsT0FBaEM7QUF1QkQsQ0FoQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL3RhYi9sZWdlbmQuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
