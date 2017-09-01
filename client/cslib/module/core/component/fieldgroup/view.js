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

      var _this = _possibleConstructorReturn(this, (FieldGroupView.__proto__ || Object.getPrototypeOf(FieldGroupView)).call(this, tmpl || Template));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9maWVsZGdyb3VwL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsIl9vbk1vZGVsQ2hhbmdlIiwiYmluZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfZmllbGRWaWV3cyIsInJlbmRlck1vZGVsIiwiZXZ0IiwiY3VycmVudFRhcmdldCIsImxlbmd0aCIsInJlbW92ZUNoaWxkIiwicG9wIiwiZ2V0IiwiZmllbGQiLCJwdXNoIiwidmlldyIsImFkZENoaWxkIiwiZm9jdXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsd0JBQVIsQ0FEYjs7QUFHQTtBQUFBOztBQUNFLDRCQUFZRyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLGtJQUNqQkEsUUFBUUYsUUFEUzs7QUFFdkIsWUFBS0csY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CQyxJQUFwQixPQUF0Qjs7QUFFQUgsWUFBTUksZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0YsY0FBNUM7QUFDQSxZQUFLRyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsWUFBS0MsV0FBTCxDQUFpQk4sS0FBakI7QUFOdUI7QUFPeEI7O0FBUkg7QUFBQTtBQUFBLHFDQVVpQk8sR0FWakIsRUFVc0I7QUFDbEIsYUFBS0QsV0FBTCxDQUFpQkMsSUFBSUMsYUFBckI7QUFDRDtBQVpIO0FBQUE7QUFBQSxrQ0FjY1IsS0FkZCxFQWNxQjtBQUNqQixlQUFPLEtBQUtLLFdBQUwsQ0FBaUJJLE1BQXhCLEVBQWdDO0FBQzlCLGVBQUtDLFdBQUwsQ0FBaUIsS0FBS0wsV0FBTCxDQUFpQk0sR0FBakIsRUFBakI7QUFDRDs7QUFIZ0I7QUFBQTtBQUFBOztBQUFBO0FBS2pCLCtCQUFrQlgsTUFBTVksR0FBTixDQUFVLFFBQVYsQ0FBbEIsOEhBQXVDO0FBQUEsZ0JBQTlCQyxLQUE4Qjs7QUFDckMsaUJBQUtSLFdBQUwsQ0FBaUJTLElBQWpCLENBQXNCRCxNQUFNRSxJQUFOLEVBQXRCO0FBQ0EsaUJBQUtDLFFBQUwsQ0FBY0gsTUFBTUUsSUFBTixFQUFkLEVBQTRCLHFCQUE1QjtBQUNEO0FBUmdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTbEI7QUF2Qkg7QUFBQTtBQUFBLDhCQXlCVTtBQUNOLFlBQUksS0FBS1YsV0FBTCxDQUFpQkksTUFBckIsRUFBNkI7QUFDM0IsZUFBS0osV0FBTCxDQUFpQixDQUFqQixFQUFvQlksS0FBcEI7QUFDRDtBQUNGO0FBN0JIOztBQUFBO0FBQUEsSUFBb0NuQixPQUFwQztBQStCRCxDQW5DRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZmllbGRncm91cC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9maWVsZGdyb3VwLmh0bWwnKTtcblxuICByZXR1cm4gY2xhc3MgRmllbGRHcm91cFZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICB0aGlzLl9vbk1vZGVsQ2hhbmdlID0gdGhpcy5fb25Nb2RlbENoYW5nZS5iaW5kKHRoaXMpO1xuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICAgIHRoaXMuX2ZpZWxkVmlld3MgPSBbXTtcbiAgICAgIHRoaXMucmVuZGVyTW9kZWwobW9kZWwpO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5yZW5kZXJNb2RlbChldnQuY3VycmVudFRhcmdldCk7XG4gICAgfVxuXG4gICAgcmVuZGVyTW9kZWwobW9kZWwpIHtcbiAgICAgIHdoaWxlICh0aGlzLl9maWVsZFZpZXdzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX2ZpZWxkVmlld3MucG9wKCkpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmb3IgKGxldCBmaWVsZCBvZiBtb2RlbC5nZXQoJ2ZpZWxkcycpKSB7XG4gICAgICAgIHRoaXMuX2ZpZWxkVmlld3MucHVzaChmaWVsZC52aWV3KCkpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGZpZWxkLnZpZXcoKSwgJy5maWVsZGdyb3VwX19maWVsZHMnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgIGlmICh0aGlzLl9maWVsZFZpZXdzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9maWVsZFZpZXdzWzBdLmZvY3VzKClcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTsiXX0=
