'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils'),
      Tab = require('./tab/tab');

  var Tabs = function (_Component) {
    _inherits(Tabs, _Component);

    function Tabs(settings) {
      _classCallCheck(this, Tabs);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, settings));

      Utils.bindMethods(_this, ['_onTabSelected', '_onModelChange']);

      _this.view().addEventListener('Tab.Selected', _this._onTabSelected);
      _this._model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(Tabs, [{
      key: 'addTab',
      value: function addTab(tab) {
        this._model.addTab(tab);
      }
    }, {
      key: 'buildTab',
      value: function buildTab(config) {
        this.addTab(Tab.create(config));
      }
    }, {
      key: 'removeTab',
      value: function removeTab(id) {
        this._model.removeTab(id);
      }
    }, {
      key: '_onTabSelected',
      value: function _onTabSelected(evt) {
        if (this._active) this._model.selectTab(evt.data.id);
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "currentIndex") {
          this.dispatchEvent('Tab.Change', {
            tab: this._model.currentTab()
          });
        }
      }
    }]);

    return Tabs;
  }(Component);

  ;

  Tabs.create = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new Tabs({ modelData: config });
  };

  return Tabs;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYnMuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIlV0aWxzIiwiVGFiIiwiVGFicyIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwidmlldyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJTZWxlY3RlZCIsIl9tb2RlbCIsIl9vbk1vZGVsQ2hhbmdlIiwidGFiIiwiYWRkVGFiIiwiY29uZmlnIiwiY3JlYXRlIiwiaWQiLCJyZW1vdmVUYWIiLCJldnQiLCJfYWN0aXZlIiwic2VsZWN0VGFiIiwiZGF0YSIsInBhdGgiLCJkaXNwYXRjaEV2ZW50IiwiY3VycmVudFRhYiIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BS0VLLE1BQU1MLFFBQVEsV0FBUixDQUxSOztBQURrQixNQVFaTSxJQVJZO0FBQUE7O0FBU2hCLGtCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCTixLQUE3QztBQUNBSyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCTixJQUEzQzs7QUFGb0IsOEdBR2RJLFFBSGM7O0FBS3BCSCxZQUFNTSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsZ0JBQW5CLENBQXhCOztBQUVBLFlBQUtDLElBQUwsR0FBWUMsZ0JBQVosQ0FBNkIsY0FBN0IsRUFBNkMsTUFBS0MsY0FBbEQ7QUFDQSxZQUFLQyxNQUFMLENBQVlGLGdCQUFaLENBQTZCLGNBQTdCLEVBQTZDLE1BQUtHLGNBQWxEO0FBUm9CO0FBU3JCOztBQWxCZTtBQUFBO0FBQUEsNkJBb0JUQyxHQXBCUyxFQW9CSjtBQUNWLGFBQUtGLE1BQUwsQ0FBWUcsTUFBWixDQUFtQkQsR0FBbkI7QUFDRDtBQXRCZTtBQUFBO0FBQUEsK0JBd0JQRSxNQXhCTyxFQXdCQztBQUNmLGFBQUtELE1BQUwsQ0FBWVosSUFBSWMsTUFBSixDQUFXRCxNQUFYLENBQVo7QUFDRDtBQTFCZTtBQUFBO0FBQUEsZ0NBNEJORSxFQTVCTSxFQTRCRjtBQUNaLGFBQUtOLE1BQUwsQ0FBWU8sU0FBWixDQUFzQkQsRUFBdEI7QUFDRDtBQTlCZTtBQUFBO0FBQUEscUNBZ0NERSxHQWhDQyxFQWdDSTtBQUNsQixZQUFJLEtBQUtDLE9BQVQsRUFBa0IsS0FBS1QsTUFBTCxDQUFZVSxTQUFaLENBQXNCRixJQUFJRyxJQUFKLENBQVNMLEVBQS9CO0FBQ25CO0FBbENlO0FBQUE7QUFBQSxxQ0FvQ0RFLEdBcENDLEVBb0NJO0FBQ2xCLFlBQUlBLElBQUlHLElBQUosQ0FBU0MsSUFBVCxJQUFpQixjQUFyQixFQUFxQztBQUNuQyxlQUFLQyxhQUFMLENBQW1CLFlBQW5CLEVBQWlDO0FBQy9CWCxpQkFBSyxLQUFLRixNQUFMLENBQVljLFVBQVo7QUFEMEIsV0FBakM7QUFHRDtBQUNGO0FBMUNlOztBQUFBO0FBQUEsSUFRQzNCLFNBUkQ7O0FBMkNqQjs7QUFFREssT0FBS2EsTUFBTCxHQUFjLFlBQWlCO0FBQUEsUUFBaEJELE1BQWdCLHVFQUFQLEVBQU87O0FBQzdCLFdBQU8sSUFBSVosSUFBSixDQUFTLEVBQUV1QixXQUFXWCxNQUFiLEVBQVQsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT1osSUFBUDtBQUNELENBbEREIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYnMuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
