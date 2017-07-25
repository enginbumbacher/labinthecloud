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
      key: 'selectTab',
      value: function selectTab(id) {
        this._model.selectTab(id);
      }
    }, {
      key: 'getTabs',
      value: function getTabs() {
        return this._model.get('tabs');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYnMuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIlV0aWxzIiwiVGFiIiwiVGFicyIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwidmlldyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJTZWxlY3RlZCIsIl9tb2RlbCIsIl9vbk1vZGVsQ2hhbmdlIiwidGFiIiwiYWRkVGFiIiwiY29uZmlnIiwiY3JlYXRlIiwiaWQiLCJyZW1vdmVUYWIiLCJzZWxlY3RUYWIiLCJnZXQiLCJldnQiLCJfYWN0aXZlIiwiZGF0YSIsInBhdGgiLCJkaXNwYXRjaEV2ZW50IiwiY3VycmVudFRhYiIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFRyxPQUFPSCxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BS0VLLE1BQU1MLFFBQVEsV0FBUixDQUxSOztBQURrQixNQVFaTSxJQVJZO0FBQUE7O0FBU2hCLGtCQUFZQyxRQUFaLEVBQXNCO0FBQUE7O0FBQ3BCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCTixLQUE3QztBQUNBSyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCTixJQUEzQzs7QUFGb0IsOEdBR2RJLFFBSGM7O0FBS3BCSCxZQUFNTSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsZ0JBQW5CLENBQXhCOztBQUVBLFlBQUtDLElBQUwsR0FBWUMsZ0JBQVosQ0FBNkIsY0FBN0IsRUFBNkMsTUFBS0MsY0FBbEQ7QUFDQSxZQUFLQyxNQUFMLENBQVlGLGdCQUFaLENBQTZCLGNBQTdCLEVBQTZDLE1BQUtHLGNBQWxEO0FBUm9CO0FBU3JCOztBQWxCZTtBQUFBO0FBQUEsNkJBb0JUQyxHQXBCUyxFQW9CSjtBQUNWLGFBQUtGLE1BQUwsQ0FBWUcsTUFBWixDQUFtQkQsR0FBbkI7QUFDRDtBQXRCZTtBQUFBO0FBQUEsK0JBd0JQRSxNQXhCTyxFQXdCQztBQUNmLGFBQUtELE1BQUwsQ0FBWVosSUFBSWMsTUFBSixDQUFXRCxNQUFYLENBQVo7QUFDRDtBQTFCZTtBQUFBO0FBQUEsZ0NBNEJORSxFQTVCTSxFQTRCRjtBQUNaLGFBQUtOLE1BQUwsQ0FBWU8sU0FBWixDQUFzQkQsRUFBdEI7QUFDRDtBQTlCZTtBQUFBO0FBQUEsZ0NBZ0NOQSxFQWhDTSxFQWdDRjtBQUNaLGFBQUtOLE1BQUwsQ0FBWVEsU0FBWixDQUFzQkYsRUFBdEI7QUFDRDtBQWxDZTtBQUFBO0FBQUEsZ0NBb0NOO0FBQ1IsZUFBTyxLQUFLTixNQUFMLENBQVlTLEdBQVosQ0FBZ0IsTUFBaEIsQ0FBUDtBQUNEO0FBdENlO0FBQUE7QUFBQSxxQ0F3Q0RDLEdBeENDLEVBd0NJO0FBQ2xCLFlBQUksS0FBS0MsT0FBVCxFQUFrQixLQUFLWCxNQUFMLENBQVlRLFNBQVosQ0FBc0JFLElBQUlFLElBQUosQ0FBU04sRUFBL0I7QUFDbkI7QUExQ2U7QUFBQTtBQUFBLHFDQTRDREksR0E1Q0MsRUE0Q0k7QUFDbEIsWUFBSUEsSUFBSUUsSUFBSixDQUFTQyxJQUFULElBQWlCLGNBQXJCLEVBQXFDO0FBQ25DLGVBQUtDLGFBQUwsQ0FBbUIsWUFBbkIsRUFBaUM7QUFDL0JaLGlCQUFLLEtBQUtGLE1BQUwsQ0FBWWUsVUFBWjtBQUQwQixXQUFqQztBQUdEO0FBQ0Y7QUFsRGU7O0FBQUE7QUFBQSxJQVFDNUIsU0FSRDs7QUFtRGpCOztBQUVESyxPQUFLYSxNQUFMLEdBQWMsWUFBaUI7QUFBQSxRQUFoQkQsTUFBZ0IsdUVBQVAsRUFBTzs7QUFDN0IsV0FBTyxJQUFJWixJQUFKLENBQVMsRUFBRXdCLFdBQVdaLE1BQWIsRUFBVCxDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPWixJQUFQO0FBQ0QsQ0ExREQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3RhYnMvdGFicy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
