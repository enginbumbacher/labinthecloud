'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Module = require('core/app/module'),
      ModelTab = require('./tab/tab'),
      ThreeView = require('./threeview');

  require('link!./style.css');

  return function (_Module) {
    _inherits(ModelModule, _Module);

    function ModelModule() {
      _classCallCheck(this, ModelModule);

      var _this = _possibleConstructorReturn(this, (ModelModule.__proto__ || Object.getPrototypeOf(ModelModule)).call(this));

      Utils.bindMethods(_this, ['_hookInteractiveTabs', '_hook3dView', '_onExperimentCountChange']);
      _this._tabs = [];
      _this.threeView = new ThreeView();
      return _this;
    }

    _createClass(ModelModule, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        if (Globals.get('AppConfig.model') && Globals.get('AppConfig.model.tabs.length')) {
          Globals.get('AppConfig.model.tabs').forEach(function (tabConf, ind) {
            tabConf.id = String.fromCharCode(97 + ind);
            tabConf.euglenaCount = Globals.get('AppConfig.model.euglenaCount');
            tabConf.simulationFps = Globals.get('AppConfig.model.simulationFps');
            var tab = ModelTab.create(tabConf);
            _this2._tabs.push(tab);
            Globals.set('ModelTab.' + tab.id(), tab);
          });
          HM.hook('InteractiveTabs.ListTabs', this._hookInteractiveTabs, 1);
          Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange);
        }
        return _get(ModelModule.prototype.__proto__ || Object.getPrototypeOf(ModelModule.prototype), 'init', this).call(this);
      }
    }, {
      key: '_hookInteractiveTabs',
      value: function _hookInteractiveTabs(list, meta) {
        this._tabs.forEach(function (tab, ind) {
          list.push({
            id: 'model_' + tab.id(),
            title: 'Model ' + tab.id().toUpperCase(),
            content: tab.view()
          });
        });
        return list;
      }
    }, {
      key: '_hook3dView',
      value: function _hook3dView(view, meta) {
        if (!view) {
          return this.threeView.clone();
        }
        return view;
      }
    }, {
      key: '_onExperimentCountChange',
      value: function _onExperimentCountChange(evt) {
        if (evt.data.count && !evt.data.old) {
          this._tabs.forEach(function (tab) {
            Globals.get('Relay').dispatchEvent('InteractiveTabs.EnableRequest', {
              tabId: 'model_' + tab.id()
            });
          });
        } else if (!evt.data.count) {
          this._tabs.forEach(function (tab) {
            Globals.get('Relay').dispatchEvent('InteractiveTabs.DisableRequest', {
              tabId: 'model_' + tab.id()
            });
          });
        }
      }
    }]);

    return ModelModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJNb2R1bGUiLCJNb2RlbFRhYiIsIlRocmVlVmlldyIsImJpbmRNZXRob2RzIiwiX3RhYnMiLCJ0aHJlZVZpZXciLCJnZXQiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImlkIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiZXVnbGVuYUNvdW50Iiwic2ltdWxhdGlvbkZwcyIsInRhYiIsImNyZWF0ZSIsInB1c2giLCJzZXQiLCJob29rIiwiX2hvb2tJbnRlcmFjdGl2ZVRhYnMiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwibGlzdCIsIm1ldGEiLCJ0aXRsZSIsInRvVXBwZXJDYXNlIiwiY29udGVudCIsInZpZXciLCJjbG9uZSIsImV2dCIsImRhdGEiLCJjb3VudCIsIm9sZCIsImRpc3BhdGNoRXZlbnQiLCJ0YWJJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssV0FBV0wsUUFBUSxXQUFSLENBRGI7QUFBQSxNQUVFTSxZQUFZTixRQUFRLGFBQVIsQ0FGZDs7QUFJQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDJCQUFjO0FBQUE7O0FBQUE7O0FBRVpFLFlBQU1LLFdBQU4sUUFBd0IsQ0FDdEIsc0JBRHNCLEVBRXRCLGFBRnNCLEVBR3RCLDBCQUhzQixDQUF4QjtBQUtBLFlBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0EsWUFBS0MsU0FBTCxHQUFpQixJQUFJSCxTQUFKLEVBQWpCO0FBUlk7QUFTYjs7QUFWSDtBQUFBO0FBQUEsNkJBWVM7QUFBQTs7QUFDTCxZQUFJTCxRQUFRUyxHQUFSLENBQVksaUJBQVosS0FBa0NULFFBQVFTLEdBQVIsQ0FBWSw2QkFBWixDQUF0QyxFQUFrRjtBQUNoRlQsa0JBQVFTLEdBQVIsQ0FBWSxzQkFBWixFQUFvQ0MsT0FBcEMsQ0FBNEMsVUFBQ0MsT0FBRCxFQUFVQyxHQUFWLEVBQWtCO0FBQzVERCxvQkFBUUUsRUFBUixHQUFhQyxPQUFPQyxZQUFQLENBQW9CLEtBQUtILEdBQXpCLENBQWI7QUFDQUQsb0JBQVFLLFlBQVIsR0FBdUJoQixRQUFRUyxHQUFSLENBQVksOEJBQVosQ0FBdkI7QUFDQUUsb0JBQVFNLGFBQVIsR0FBd0JqQixRQUFRUyxHQUFSLENBQVksK0JBQVosQ0FBeEI7QUFDQSxnQkFBSVMsTUFBTWQsU0FBU2UsTUFBVCxDQUFnQlIsT0FBaEIsQ0FBVjtBQUNBLG1CQUFLSixLQUFMLENBQVdhLElBQVgsQ0FBZ0JGLEdBQWhCO0FBQ0FsQixvQkFBUXFCLEdBQVIsZUFBd0JILElBQUlMLEVBQUosRUFBeEIsRUFBb0NLLEdBQXBDO0FBQ0QsV0FQRDtBQVFBaEIsYUFBR29CLElBQUgsQ0FBUSwwQkFBUixFQUFvQyxLQUFLQyxvQkFBekMsRUFBK0QsQ0FBL0Q7QUFDQXZCLGtCQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQmUsZ0JBQXJCLENBQXNDLHdCQUF0QyxFQUFnRSxLQUFLQyx3QkFBckU7QUFDRDtBQUNEO0FBQ0Q7QUExQkg7QUFBQTtBQUFBLDJDQTRCdUJDLElBNUJ2QixFQTRCNkJDLElBNUI3QixFQTRCbUM7QUFDL0IsYUFBS3BCLEtBQUwsQ0FBV0csT0FBWCxDQUFtQixVQUFDUSxHQUFELEVBQU1OLEdBQU4sRUFBYztBQUMvQmMsZUFBS04sSUFBTCxDQUFVO0FBQ1JQLDJCQUFhSyxJQUFJTCxFQUFKLEVBREw7QUFFUmUsOEJBQWdCVixJQUFJTCxFQUFKLEdBQVNnQixXQUFULEVBRlI7QUFHUkMscUJBQVNaLElBQUlhLElBQUo7QUFIRCxXQUFWO0FBS0QsU0FORDtBQU9BLGVBQU9MLElBQVA7QUFDRDtBQXJDSDtBQUFBO0FBQUEsa0NBdUNjSyxJQXZDZCxFQXVDb0JKLElBdkNwQixFQXVDMEI7QUFDdEIsWUFBSSxDQUFDSSxJQUFMLEVBQVc7QUFDVCxpQkFBTyxLQUFLdkIsU0FBTCxDQUFld0IsS0FBZixFQUFQO0FBQ0Q7QUFDRCxlQUFPRCxJQUFQO0FBQ0Q7QUE1Q0g7QUFBQTtBQUFBLCtDQThDMkJFLEdBOUMzQixFQThDZ0M7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxLQUFULElBQWtCLENBQUNGLElBQUlDLElBQUosQ0FBU0UsR0FBaEMsRUFBcUM7QUFDbkMsZUFBSzdCLEtBQUwsQ0FBV0csT0FBWCxDQUFtQixVQUFDUSxHQUFELEVBQVM7QUFDMUJsQixvQkFBUVMsR0FBUixDQUFZLE9BQVosRUFBcUI0QixhQUFyQixDQUFtQywrQkFBbkMsRUFBb0U7QUFDbEVDLGdDQUFnQnBCLElBQUlMLEVBQUo7QUFEa0QsYUFBcEU7QUFHRCxXQUpEO0FBS0QsU0FORCxNQU1PLElBQUksQ0FBQ29CLElBQUlDLElBQUosQ0FBU0MsS0FBZCxFQUFxQjtBQUMxQixlQUFLNUIsS0FBTCxDQUFXRyxPQUFYLENBQW1CLFVBQUNRLEdBQUQsRUFBUztBQUMxQmxCLG9CQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQjRCLGFBQXJCLENBQW1DLGdDQUFuQyxFQUFxRTtBQUNuRUMsZ0NBQWdCcEIsSUFBSUwsRUFBSjtBQURtRCxhQUFyRTtBQUdELFdBSkQ7QUFLRDtBQUNGO0FBNURIOztBQUFBO0FBQUEsSUFBaUNWLE1BQWpDO0FBOERELENBekVEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgTW9kZWxUYWIgPSByZXF1aXJlKCcuL3RhYi90YWInKSxcbiAgICBUaHJlZVZpZXcgPSByZXF1aXJlKCcuL3RocmVldmlldycpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgTW9kZWxNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19ob29rSW50ZXJhY3RpdmVUYWJzJyxcbiAgICAgICAgJ19ob29rM2RWaWV3JyxcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZSdcbiAgICAgIF0pO1xuICAgICAgdGhpcy5fdGFicyA9IFtdO1xuICAgICAgdGhpcy50aHJlZVZpZXcgPSBuZXcgVGhyZWVWaWV3KCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsJykgJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzLmxlbmd0aCcpKSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmZvckVhY2goKHRhYkNvbmYsIGluZCkgPT4ge1xuICAgICAgICAgIHRhYkNvbmYuaWQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDk3ICsgaW5kKTtcbiAgICAgICAgICB0YWJDb25mLmV1Z2xlbmFDb3VudCA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwuZXVnbGVuYUNvdW50Jyk7XG4gICAgICAgICAgdGFiQ29uZi5zaW11bGF0aW9uRnBzID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC5zaW11bGF0aW9uRnBzJyk7XG4gICAgICAgICAgbGV0IHRhYiA9IE1vZGVsVGFiLmNyZWF0ZSh0YWJDb25mKVxuICAgICAgICAgIHRoaXMuX3RhYnMucHVzaCh0YWIpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KGBNb2RlbFRhYi4ke3RhYi5pZCgpfWAsIHRhYik7XG4gICAgICAgIH0pXG4gICAgICAgIEhNLmhvb2soJ0ludGVyYWN0aXZlVGFicy5MaXN0VGFicycsIHRoaXMuX2hvb2tJbnRlcmFjdGl2ZVRhYnMsIDEpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cGVyLmluaXQoKTtcbiAgICB9XG5cbiAgICBfaG9va0ludGVyYWN0aXZlVGFicyhsaXN0LCBtZXRhKSB7XG4gICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYiwgaW5kKSA9PiB7XG4gICAgICAgIGxpc3QucHVzaCh7XG4gICAgICAgICAgaWQ6IGBtb2RlbF8ke3RhYi5pZCgpfWAsXG4gICAgICAgICAgdGl0bGU6IGBNb2RlbCAke3RhYi5pZCgpLnRvVXBwZXJDYXNlKCl9YCxcbiAgICAgICAgICBjb250ZW50OiB0YWIudmlldygpXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIF9ob29rM2RWaWV3KHZpZXcsIG1ldGEpIHtcbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm4gdGhpcy50aHJlZVZpZXcuY2xvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRDb3VudENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5jb3VudCAmJiAhZXZ0LmRhdGEub2xkKSB7XG4gICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnSW50ZXJhY3RpdmVUYWJzLkVuYWJsZVJlcXVlc3QnLCB7XG4gICAgICAgICAgICB0YWJJZDogYG1vZGVsXyR7dGFiLmlkKCl9YFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0ludGVyYWN0aXZlVGFicy5EaXNhYmxlUmVxdWVzdCcsIHtcbiAgICAgICAgICAgIHRhYklkOiBgbW9kZWxfJHt0YWIuaWQoKX1gXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pIl19
