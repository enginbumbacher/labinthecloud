'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view');

  var LightGrid = function (_Component) {
    _inherits(LightGrid, _Component);

    function LightGrid(conf) {
      _classCallCheck(this, LightGrid);

      conf.modelClass = conf.modelClass || Model;
      conf.viewClass = conf.viewClass || View;
      return _possibleConstructorReturn(this, (LightGrid.__proto__ || Object.getPrototypeOf(LightGrid)).call(this, conf));
    }

    _createClass(LightGrid, [{
      key: 'update',
      value: function update(lights) {
        this._model.update(lights);
      }
    }, {
      key: 'reset',
      value: function reset() {
        this._model.reset();
      }
    }]);

    return LightGrid;
  }(Component);

  LightGrid.create = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new LightGrid({ modelData: data });
  };

  return LightGrid;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9saWdodGdyaWQvZ3JpZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJMaWdodEdyaWQiLCJjb25mIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImxpZ2h0cyIsIl9tb2RlbCIsInVwZGF0ZSIsInJlc2V0IiwiY3JlYXRlIiwiZGF0YSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksWUFBWUosUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VLLFFBQVFMLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU0sT0FBT04sUUFBUSxRQUFSLENBRlQ7O0FBTGtCLE1BU1pPLFNBVFk7QUFBQTs7QUFVaEIsdUJBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDaEJBLFdBQUtDLFVBQUwsR0FBa0JELEtBQUtDLFVBQUwsSUFBbUJKLEtBQXJDO0FBQ0FHLFdBQUtFLFNBQUwsR0FBaUJGLEtBQUtFLFNBQUwsSUFBa0JKLElBQW5DO0FBRmdCLG1IQUdWRSxJQUhVO0FBSWpCOztBQWRlO0FBQUE7QUFBQSw2QkFnQlRHLE1BaEJTLEVBZ0JEO0FBQ2IsYUFBS0MsTUFBTCxDQUFZQyxNQUFaLENBQW1CRixNQUFuQjtBQUNEO0FBbEJlO0FBQUE7QUFBQSw4QkFvQlI7QUFDTixhQUFLQyxNQUFMLENBQVlFLEtBQVo7QUFDRDtBQXRCZTs7QUFBQTtBQUFBLElBU01WLFNBVE47O0FBeUJsQkcsWUFBVVEsTUFBVixHQUFtQixZQUFlO0FBQUEsUUFBZEMsSUFBYyx1RUFBUCxFQUFPOztBQUNoQyxXQUFPLElBQUlULFNBQUosQ0FBYyxFQUFFVSxXQUFXRCxJQUFiLEVBQWQsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT1QsU0FBUDtBQUNELENBOUJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9saWdodGdyaWQvZ3JpZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJylcbiAgXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcblxuICBjbGFzcyBMaWdodEdyaWQgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKGNvbmYpIHtcbiAgICAgIGNvbmYubW9kZWxDbGFzcyA9IGNvbmYubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIGNvbmYudmlld0NsYXNzID0gY29uZi52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKGNvbmYpO1xuICAgIH1cblxuICAgIHVwZGF0ZShsaWdodHMpIHtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZShsaWdodHMpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVzZXQoKVxuICAgIH1cbiAgfVxuXG4gIExpZ2h0R3JpZC5jcmVhdGUgPSAoZGF0YSA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIG5ldyBMaWdodEdyaWQoeyBtb2RlbERhdGE6IGRhdGEgfSlcbiAgfVxuXG4gIHJldHVybiBMaWdodEdyaWQ7XG59KSJdfQ==
