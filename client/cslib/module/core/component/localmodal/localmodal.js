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

  require('link!./style.css');

  var LocalModal = function (_Component) {
    _inherits(LocalModal, _Component);

    function LocalModal() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, LocalModal);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;
      return _possibleConstructorReturn(this, (LocalModal.__proto__ || Object.getPrototypeOf(LocalModal)).call(this, settings));
    }

    _createClass(LocalModal, [{
      key: 'display',
      value: function display(content) {
        this.clear();
        this.push(content);
        return this.show();
      }
    }, {
      key: 'push',
      value: function push(content) {
        this._model.push(content);
      }
    }, {
      key: 'pop',
      value: function pop() {
        this._model.pop();
      }
    }, {
      key: 'clear',
      value: function clear() {
        this._model.clear();
      }
    }, {
      key: 'show',
      value: function show() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          _this2.view().addEventListener('LocalModal.ShowComplete', function () {
            _this2.view().removeAllListeners('LocalModal.ShowComplete');
            resolve(true);
          });
          _this2._model.set('display', true);
        });
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          _this3.view().addEventListener('LocalModal.HideComplete', function () {
            _this3.view().removeAllListeners('LocalModal.HideComplete');
            resolve(true);
          });
          _this3._model.set('display', false);
        });
      }
    }]);

    return LocalModal;
  }(Component);

  LocalModal.create = function (data) {
    return new LocalModal({ modelData: data });
  };
  return LocalModal;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9sb2NhbG1vZGFsL2xvY2FsbW9kYWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTG9jYWxNb2RhbCIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImNvbnRlbnQiLCJjbGVhciIsInB1c2giLCJzaG93IiwiX21vZGVsIiwicG9wIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUFsbExpc3RlbmVycyIsInNldCIsImNyZWF0ZSIsImRhdGEiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFSyxRQUFRTCxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVNLE9BQU9OLFFBQVEsUUFBUixDQUZUOztBQUlBQSxVQUFRLGtCQUFSOztBQVRrQixNQVdaTyxVQVhZO0FBQUE7O0FBWWhCLDBCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJKLEtBQTdDO0FBQ0FHLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JKLElBQTNDO0FBRnlCLHFIQUduQkUsUUFIbUI7QUFJMUI7O0FBaEJlO0FBQUE7QUFBQSw4QkFrQlJHLE9BbEJRLEVBa0JDO0FBQ2YsYUFBS0MsS0FBTDtBQUNBLGFBQUtDLElBQUwsQ0FBVUYsT0FBVjtBQUNBLGVBQU8sS0FBS0csSUFBTCxFQUFQO0FBQ0Q7QUF0QmU7QUFBQTtBQUFBLDJCQXdCWEgsT0F4QlcsRUF3QkY7QUFDWixhQUFLSSxNQUFMLENBQVlGLElBQVosQ0FBaUJGLE9BQWpCO0FBQ0Q7QUExQmU7QUFBQTtBQUFBLDRCQTRCVjtBQUNKLGFBQUtJLE1BQUwsQ0FBWUMsR0FBWjtBQUNEO0FBOUJlO0FBQUE7QUFBQSw4QkFnQ1I7QUFDTixhQUFLRCxNQUFMLENBQVlILEtBQVo7QUFDRDtBQWxDZTtBQUFBO0FBQUEsNkJBb0NUO0FBQUE7O0FBQ0wsZUFBTyxJQUFJSyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLGlCQUFLQyxJQUFMLEdBQVlDLGdCQUFaLENBQTZCLHlCQUE3QixFQUF3RCxZQUFNO0FBQzVELG1CQUFLRCxJQUFMLEdBQVlFLGtCQUFaLENBQStCLHlCQUEvQjtBQUNBSixvQkFBUSxJQUFSO0FBQ0QsV0FIRDtBQUlBLGlCQUFLSCxNQUFMLENBQVlRLEdBQVosQ0FBZ0IsU0FBaEIsRUFBMkIsSUFBM0I7QUFDRCxTQU5NLENBQVA7QUFPRDtBQTVDZTtBQUFBO0FBQUEsNkJBOENUO0FBQUE7O0FBQ0wsZUFBTyxJQUFJTixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLGlCQUFLQyxJQUFMLEdBQVlDLGdCQUFaLENBQTZCLHlCQUE3QixFQUF3RCxZQUFNO0FBQzVELG1CQUFLRCxJQUFMLEdBQVlFLGtCQUFaLENBQStCLHlCQUEvQjtBQUNBSixvQkFBUSxJQUFSO0FBQ0QsV0FIRDtBQUlBLGlCQUFLSCxNQUFMLENBQVlRLEdBQVosQ0FBZ0IsU0FBaEIsRUFBMkIsS0FBM0I7QUFDRCxTQU5NLENBQVA7QUFPRDtBQXREZTs7QUFBQTtBQUFBLElBV09uQixTQVhQOztBQXlEbEJHLGFBQVdpQixNQUFYLEdBQW9CLFVBQUNDLElBQUQsRUFBVTtBQUM1QixXQUFPLElBQUlsQixVQUFKLENBQWUsRUFBRW1CLFdBQVdELElBQWIsRUFBZixDQUFQO0FBQ0QsR0FGRDtBQUdBLFNBQU9sQixVQUFQO0FBQ0QsQ0E3REQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2xvY2FsbW9kYWwvbG9jYWxtb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICBjbGFzcyBMb2NhbE1vZGFsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGRpc3BsYXkoY29udGVudCkge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhpcy5wdXNoKGNvbnRlbnQpO1xuICAgICAgcmV0dXJuIHRoaXMuc2hvdygpO1xuICAgIH1cblxuICAgIHB1c2goY29udGVudCkge1xuICAgICAgdGhpcy5fbW9kZWwucHVzaChjb250ZW50KVxuICAgIH1cblxuICAgIHBvcCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnBvcCgpXG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICB0aGlzLl9tb2RlbC5jbGVhcigpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ0xvY2FsTW9kYWwuU2hvd0NvbXBsZXRlJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMudmlldygpLnJlbW92ZUFsbExpc3RlbmVycygnTG9jYWxNb2RhbC5TaG93Q29tcGxldGUnKTtcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9tb2RlbC5zZXQoJ2Rpc3BsYXknLCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignTG9jYWxNb2RhbC5IaWRlQ29tcGxldGUnLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy52aWV3KCkucmVtb3ZlQWxsTGlzdGVuZXJzKCdMb2NhbE1vZGFsLkhpZGVDb21wbGV0ZScpO1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX21vZGVsLnNldCgnZGlzcGxheScsIGZhbHNlKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBMb2NhbE1vZGFsLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBMb2NhbE1vZGFsKHsgbW9kZWxEYXRhOiBkYXRhIH0pXG4gIH1cbiAgcmV0dXJuIExvY2FsTW9kYWw7XG59KSJdfQ==
