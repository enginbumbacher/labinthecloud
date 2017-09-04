'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  var BulbDisplay = function (_Component) {
    _inherits(BulbDisplay, _Component);

    function BulbDisplay() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, BulbDisplay);

      config.viewClass = config.viewClass || View;
      config.modelClass = config.modelClass || Model;
      return _possibleConstructorReturn(this, (BulbDisplay.__proto__ || Object.getPrototypeOf(BulbDisplay)).call(this, config));
    }

    _createClass(BulbDisplay, [{
      key: 'render',
      value: function render(lights) {
        this.view().render(lights);
      }
    }]);

    return BulbDisplay;
  }(Component);

  BulbDisplay.create = function (data) {
    return new BulbDisplay({ modelData: data });
  };

  return BulbDisplay;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS9idWxiZGlzcGxheS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiVXRpbHMiLCJCdWxiRGlzcGxheSIsImNvbmZpZyIsInZpZXdDbGFzcyIsIm1vZGVsQ2xhc3MiLCJsaWdodHMiLCJ2aWV3IiwicmVuZGVyIiwiY3JlYXRlIiwiZGF0YSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFEa0IsTUFPWkssV0FQWTtBQUFBOztBQVFoQiwyQkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPQyxTQUFQLEdBQW1CRCxPQUFPQyxTQUFQLElBQW9CSixJQUF2QztBQUNBRyxhQUFPRSxVQUFQLEdBQW9CRixPQUFPRSxVQUFQLElBQXFCTixLQUF6QztBQUZ1Qix1SEFHakJJLE1BSGlCO0FBSXhCOztBQVplO0FBQUE7QUFBQSw2QkFjVEcsTUFkUyxFQWNEO0FBQ2IsYUFBS0MsSUFBTCxHQUFZQyxNQUFaLENBQW1CRixNQUFuQjtBQUNEO0FBaEJlOztBQUFBO0FBQUEsSUFPUVIsU0FQUjs7QUFtQmxCSSxjQUFZTyxNQUFaLEdBQXFCLFVBQUNDLElBQUQ7QUFBQSxXQUFVLElBQUlSLFdBQUosQ0FBZ0IsRUFBRVMsV0FBV0QsSUFBYixFQUFoQixDQUFWO0FBQUEsR0FBckI7O0FBRUEsU0FBT1IsV0FBUDtBQUNELENBdEJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS9idWxiZGlzcGxheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgY2xhc3MgQnVsYkRpc3BsYXkgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICBjb25maWcudmlld0NsYXNzID0gY29uZmlnLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgY29uZmlnLm1vZGVsQ2xhc3MgPSBjb25maWcubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgcmVuZGVyKGxpZ2h0cykge1xuICAgICAgdGhpcy52aWV3KCkucmVuZGVyKGxpZ2h0cyk7XG4gICAgfVxuICB9XG5cbiAgQnVsYkRpc3BsYXkuY3JlYXRlID0gKGRhdGEpID0+IG5ldyBCdWxiRGlzcGxheSh7IG1vZGVsRGF0YTogZGF0YSB9KTtcblxuICByZXR1cm4gQnVsYkRpc3BsYXk7XG59KVxuIl19
