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
      key: 'disableTab',
      value: function disableTab(id) {
        this._model.disableTab(id);
      }
    }, {
      key: 'enableTab',
      value: function enableTab(id) {
        this._model.enableTab(id);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL3RhYnMuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkNvbXBvbmVudCIsIk1vZGVsIiwiVmlldyIsIlV0aWxzIiwiVGFiIiwiVGFicyIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwidmlldyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25UYWJTZWxlY3RlZCIsIl9tb2RlbCIsIl9vbk1vZGVsQ2hhbmdlIiwidGFiIiwiYWRkVGFiIiwiY29uZmlnIiwiY3JlYXRlIiwiaWQiLCJyZW1vdmVUYWIiLCJzZWxlY3RUYWIiLCJnZXQiLCJkaXNhYmxlVGFiIiwiZW5hYmxlVGFiIiwiZXZ0IiwiX2FjdGl2ZSIsImRhdGEiLCJwYXRoIiwiZGlzcGF0Y2hFdmVudCIsImN1cnJlbnRUYWIiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRUcsT0FBT0gsUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7QUFBQSxNQUtFSyxNQUFNTCxRQUFRLFdBQVIsQ0FMUjs7QUFEa0IsTUFRWk0sSUFSWTtBQUFBOztBQVNoQixrQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUNwQkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1Qk4sS0FBN0M7QUFDQUssZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQk4sSUFBM0M7O0FBRm9CLDhHQUdkSSxRQUhjOztBQUtwQkgsWUFBTU0sV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLGdCQUFuQixDQUF4Qjs7QUFFQSxZQUFLQyxJQUFMLEdBQVlDLGdCQUFaLENBQTZCLGNBQTdCLEVBQTZDLE1BQUtDLGNBQWxEO0FBQ0EsWUFBS0MsTUFBTCxDQUFZRixnQkFBWixDQUE2QixjQUE3QixFQUE2QyxNQUFLRyxjQUFsRDtBQVJvQjtBQVNyQjs7QUFsQmU7QUFBQTtBQUFBLDZCQW9CVEMsR0FwQlMsRUFvQko7QUFDVixhQUFLRixNQUFMLENBQVlHLE1BQVosQ0FBbUJELEdBQW5CO0FBQ0Q7QUF0QmU7QUFBQTtBQUFBLCtCQXdCUEUsTUF4Qk8sRUF3QkM7QUFDZixhQUFLRCxNQUFMLENBQVlaLElBQUljLE1BQUosQ0FBV0QsTUFBWCxDQUFaO0FBQ0Q7QUExQmU7QUFBQTtBQUFBLGdDQTRCTkUsRUE1Qk0sRUE0QkY7QUFDWixhQUFLTixNQUFMLENBQVlPLFNBQVosQ0FBc0JELEVBQXRCO0FBQ0Q7QUE5QmU7QUFBQTtBQUFBLGdDQWdDTkEsRUFoQ00sRUFnQ0Y7QUFDWixhQUFLTixNQUFMLENBQVlRLFNBQVosQ0FBc0JGLEVBQXRCO0FBQ0Q7QUFsQ2U7QUFBQTtBQUFBLGdDQW9DTjtBQUNSLGVBQU8sS0FBS04sTUFBTCxDQUFZUyxHQUFaLENBQWdCLE1BQWhCLENBQVA7QUFDRDtBQXRDZTtBQUFBO0FBQUEsaUNBd0NMSCxFQXhDSyxFQXdDRDtBQUNiLGFBQUtOLE1BQUwsQ0FBWVUsVUFBWixDQUF1QkosRUFBdkI7QUFDRDtBQTFDZTtBQUFBO0FBQUEsZ0NBNENOQSxFQTVDTSxFQTRDRjtBQUNaLGFBQUtOLE1BQUwsQ0FBWVcsU0FBWixDQUFzQkwsRUFBdEI7QUFDRDtBQTlDZTtBQUFBO0FBQUEscUNBZ0RETSxHQWhEQyxFQWdESTtBQUNsQixZQUFJLEtBQUtDLE9BQVQsRUFBa0IsS0FBS2IsTUFBTCxDQUFZUSxTQUFaLENBQXNCSSxJQUFJRSxJQUFKLENBQVNSLEVBQS9CO0FBQ25CO0FBbERlO0FBQUE7QUFBQSxxQ0FvRERNLEdBcERDLEVBb0RJO0FBQ2xCLFlBQUlBLElBQUlFLElBQUosQ0FBU0MsSUFBVCxJQUFpQixjQUFyQixFQUFxQztBQUNuQyxlQUFLQyxhQUFMLENBQW1CLFlBQW5CLEVBQWlDO0FBQy9CZCxpQkFBSyxLQUFLRixNQUFMLENBQVlpQixVQUFaO0FBRDBCLFdBQWpDO0FBR0Q7QUFDRjtBQTFEZTs7QUFBQTtBQUFBLElBUUM5QixTQVJEOztBQTJEakI7O0FBRURLLE9BQUthLE1BQUwsR0FBYyxZQUFpQjtBQUFBLFFBQWhCRCxNQUFnQix1RUFBUCxFQUFPOztBQUM3QixXQUFPLElBQUlaLElBQUosQ0FBUyxFQUFFMEIsV0FBV2QsTUFBYixFQUFULENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9aLElBQVA7QUFDRCxDQWxFRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvdGFicy90YWJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuXG4gICAgVGFiID0gcmVxdWlyZSgnLi90YWIvdGFiJyk7XG5cbiAgY2xhc3MgVGFicyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG5cbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVGFiU2VsZWN0ZWQnLCAnX29uTW9kZWxDaGFuZ2UnXSlcblxuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignVGFiLlNlbGVjdGVkJywgdGhpcy5fb25UYWJTZWxlY3RlZClcbiAgICAgIHRoaXMuX21vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpXG4gICAgfVxuXG4gICAgYWRkVGFiKHRhYikge1xuICAgICAgdGhpcy5fbW9kZWwuYWRkVGFiKHRhYik7XG4gICAgfVxuXG4gICAgYnVpbGRUYWIoY29uZmlnKSB7XG4gICAgICB0aGlzLmFkZFRhYihUYWIuY3JlYXRlKGNvbmZpZykpO1xuICAgIH1cblxuICAgIHJlbW92ZVRhYihpZCkge1xuICAgICAgdGhpcy5fbW9kZWwucmVtb3ZlVGFiKGlkKVxuICAgIH1cblxuICAgIHNlbGVjdFRhYihpZCkge1xuICAgICAgdGhpcy5fbW9kZWwuc2VsZWN0VGFiKGlkKTtcbiAgICB9XG5cbiAgICBnZXRUYWJzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgndGFicycpO1xuICAgIH1cblxuICAgIGRpc2FibGVUYWIoaWQpIHtcbiAgICAgIHRoaXMuX21vZGVsLmRpc2FibGVUYWIoaWQpO1xuICAgIH1cblxuICAgIGVuYWJsZVRhYihpZCkge1xuICAgICAgdGhpcy5fbW9kZWwuZW5hYmxlVGFiKGlkKTtcbiAgICB9XG5cbiAgICBfb25UYWJTZWxlY3RlZChldnQpIHtcbiAgICAgIGlmICh0aGlzLl9hY3RpdmUpIHRoaXMuX21vZGVsLnNlbGVjdFRhYihldnQuZGF0YS5pZCk7XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSBcImN1cnJlbnRJbmRleFwiKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVGFiLkNoYW5nZScsIHtcbiAgICAgICAgICB0YWI6IHRoaXMuX21vZGVsLmN1cnJlbnRUYWIoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBUYWJzLmNyZWF0ZSA9IChjb25maWcgPSB7fSkgPT4ge1xuICAgIHJldHVybiBuZXcgVGFicyh7IG1vZGVsRGF0YTogY29uZmlnIH0pXG4gIH1cblxuICByZXR1cm4gVGFicztcbn0pIl19
