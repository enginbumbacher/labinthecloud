'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./fieldgroup.html');

  return function (_DomView) {
    _inherits(FieldGroupView, _DomView);

    function FieldGroupView(model, tmpl) {
      _classCallCheck(this, FieldGroupView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldGroupView).call(this, tmpl || Template));

      _this._onModelChange = _this._onModelChange.bind(_this);

      model.addEventListener('Model.Change', _this._onModelChange);
      _this._fieldViews = [];
      _this.renderModel(model);
      return _this;
    }

    _createClass(FieldGroupView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        this.renderModel(evt.currentTarget);
      }
    }, {
      key: 'renderModel',
      value: function renderModel(model) {
        while (this._fieldViews.length) {
          this.removeChild(this._fieldViews.pop());
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = model.get('fields')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var field = _step.value;

            this._fieldViews.push(field.view());
            this.addChild(field.view(), '.fieldgroup__fields');
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: 'focus',
      value: function focus() {
        if (this._fieldViews.length) {
          this._fieldViews[0].focus();
        }
      }
    }]);

    return FieldGroupView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxVQUFVLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFLFdBQVcsUUFBUSx3QkFBUixDQURiOztBQUdBO0FBQUE7O0FBQ0UsNEJBQVksS0FBWixFQUFtQixJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9HQUNqQixRQUFRLFFBRFM7O0FBRXZCLFlBQUssY0FBTCxHQUFzQixNQUFLLGNBQUwsQ0FBb0IsSUFBcEIsT0FBdEI7O0FBRUEsWUFBTSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLLGNBQTVDO0FBQ0EsWUFBSyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsWUFBSyxXQUFMLENBQWlCLEtBQWpCO0FBTnVCO0FBT3hCOztBQVJIO0FBQUE7QUFBQSxxQ0FVaUIsR0FWakIsRUFVc0I7QUFDbEIsYUFBSyxXQUFMLENBQWlCLElBQUksYUFBckI7QUFDRDtBQVpIO0FBQUE7QUFBQSxrQ0FjYyxLQWRkLEVBY3FCO0FBQ2pCLGVBQU8sS0FBSyxXQUFMLENBQWlCLE1BQXhCLEVBQWdDO0FBQzlCLGVBQUssV0FBTCxDQUFpQixLQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBakI7QUFDRDs7QUFIZ0I7QUFBQTtBQUFBOztBQUFBO0FBS2pCLCtCQUFrQixNQUFNLEdBQU4sQ0FBVSxRQUFWLENBQWxCLDhIQUF1QztBQUFBLGdCQUE5QixLQUE4Qjs7QUFDckMsaUJBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixNQUFNLElBQU4sRUFBdEI7QUFDQSxpQkFBSyxRQUFMLENBQWMsTUFBTSxJQUFOLEVBQWQsRUFBNEIscUJBQTVCO0FBQ0Q7QUFSZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNsQjtBQXZCSDtBQUFBO0FBQUEsOEJBeUJVO0FBQ04sWUFBSSxLQUFLLFdBQUwsQ0FBaUIsTUFBckIsRUFBNkI7QUFDM0IsZUFBSyxXQUFMLENBQWlCLENBQWpCLEVBQW9CLEtBQXBCO0FBQ0Q7QUFDRjtBQTdCSDs7QUFBQTtBQUFBLElBQW9DLE9BQXBDO0FBK0JELENBbkNEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
