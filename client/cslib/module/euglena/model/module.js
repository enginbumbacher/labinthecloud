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

      Utils.bindMethods(_this, ['_hookInteractiveTabs', '_hook3dView', '_onExperimentCountChange', '_onAutomaticSimulate']);
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
            tabConf.id = Globals.get('AppConfig.model.tabs.length') == 1 ? '' : String.fromCharCode(97 + ind);
            tabConf.euglenaCount = Globals.get('AppConfig.model.euglenaCount');
            tabConf.simulationFps = Globals.get('AppConfig.model.simulationFps');
            var tab = ModelTab.create(tabConf);
            _this2._tabs.push(tab);
            Globals.set('ModelTab.' + tab.id(), tab);
          });
          HM.hook('InteractiveTabs.ListTabs', this._hookInteractiveTabs, 1);
          Globals.get('Relay').addEventListener('ExperimentCount.Change', this._onExperimentCountChange);
          Globals.get('Relay').addEventListener('Model.AutomaticSimulate', this._onAutomaticSimulate);
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
    }, {
      key: '_onAutomaticSimulate',
      value: function _onAutomaticSimulate(evt) {
        this._tabs.find(function (x) {
          return x.id() == evt.data.tabId;
        })._onSimulateRequest(evt);
      }
    }]);

    return ModelModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJNb2R1bGUiLCJNb2RlbFRhYiIsIlRocmVlVmlldyIsImJpbmRNZXRob2RzIiwiX3RhYnMiLCJ0aHJlZVZpZXciLCJnZXQiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImlkIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiZXVnbGVuYUNvdW50Iiwic2ltdWxhdGlvbkZwcyIsInRhYiIsImNyZWF0ZSIsInB1c2giLCJzZXQiLCJob29rIiwiX2hvb2tJbnRlcmFjdGl2ZVRhYnMiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiX29uQXV0b21hdGljU2ltdWxhdGUiLCJsaXN0IiwibWV0YSIsInRpdGxlIiwidG9VcHBlckNhc2UiLCJjb250ZW50IiwidmlldyIsImNsb25lIiwiZXZ0IiwiZGF0YSIsImNvdW50Iiwib2xkIiwiZGlzcGF0Y2hFdmVudCIsInRhYklkIiwiZmluZCIsIngiLCJfb25TaW11bGF0ZVJlcXVlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFNBQVNKLFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VLLFdBQVdMLFFBQVEsV0FBUixDQURiO0FBQUEsTUFFRU0sWUFBWU4sUUFBUSxhQUFSLENBRmQ7O0FBSUFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSwyQkFBYztBQUFBOztBQUFBOztBQUVaRSxZQUFNSyxXQUFOLFFBQXdCLENBQ3RCLHNCQURzQixFQUV0QixhQUZzQixFQUd0QiwwQkFI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QUNGO0FBOURIO0FBQUE7QUFBQSwyQ0FnRXVCcUIsR0FoRXZCLEVBZ0U0QjtBQUN4QixhQUFLM0IsS0FBTCxDQUFXaUMsSUFBWCxDQUFnQjtBQUFBLGlCQUFLQyxFQUFFNUIsRUFBRixNQUFVcUIsSUFBSUMsSUFBSixDQUFTSSxLQUF4QjtBQUFBLFNBQWhCLEVBQStDRyxrQkFBL0MsQ0FBa0VSLEdBQWxFO0FBQ0Q7QUFsRUg7O0FBQUE7QUFBQSxJQUFpQy9CLE1BQWpDO0FBb0VELENBL0VEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgTW9kZWxUYWIgPSByZXF1aXJlKCcuL3RhYi90YWInKSxcbiAgICBUaHJlZVZpZXcgPSByZXF1aXJlKCcuL3RocmVldmlldycpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgTW9kZWxNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19ob29rSW50ZXJhY3RpdmVUYWJzJyxcbiAgICAgICAgJ19ob29rM2RWaWV3JyxcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZScsXG4gICAgICAgICdfb25BdXRvbWF0aWNTaW11bGF0ZSdcbiAgICAgIF0pO1xuICAgICAgdGhpcy5fdGFicyA9IFtdO1xuICAgICAgdGhpcy50aHJlZVZpZXcgPSBuZXcgVGhyZWVWaWV3KCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsJykgJiYgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzLmxlbmd0aCcpKSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmZvckVhY2goKHRhYkNvbmYsIGluZCkgPT4ge1xuICAgICAgICAgIHRhYkNvbmYuaWQgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMubGVuZ3RoJyk9PTEgPyAnJyA6IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpbmQpO1xuICAgICAgICAgIHRhYkNvbmYuZXVnbGVuYUNvdW50ID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC5ldWdsZW5hQ291bnQnKTtcbiAgICAgICAgICB0YWJDb25mLnNpbXVsYXRpb25GcHMgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnNpbXVsYXRpb25GcHMnKTtcbiAgICAgICAgICBsZXQgdGFiID0gTW9kZWxUYWIuY3JlYXRlKHRhYkNvbmYpXG4gICAgICAgICAgdGhpcy5fdGFicy5wdXNoKHRhYik7XG4gICAgICAgICAgR2xvYmFscy5zZXQoYE1vZGVsVGFiLiR7dGFiLmlkKCl9YCwgdGFiKTtcbiAgICAgICAgfSlcbiAgICAgICAgSE0uaG9vaygnSW50ZXJhY3RpdmVUYWJzLkxpc3RUYWJzJywgdGhpcy5faG9va0ludGVyYWN0aXZlVGFicywgMSk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSk7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkF1dG9tYXRpY1NpbXVsYXRlJywgdGhpcy5fb25BdXRvbWF0aWNTaW11bGF0ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIF9ob29rSW50ZXJhY3RpdmVUYWJzKGxpc3QsIG1ldGEpIHtcbiAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiLCBpbmQpID0+IHtcbiAgICAgICAgbGlzdC5wdXNoKHtcbiAgICAgICAgICBpZDogYG1vZGVsXyR7dGFiLmlkKCl9YCxcbiAgICAgICAgICB0aXRsZTogYE1vZGVsICR7dGFiLmlkKCkudG9VcHBlckNhc2UoKX1gLFxuICAgICAgICAgIGNvbnRlbnQ6IHRhYi52aWV3KClcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgX2hvb2szZFZpZXcodmlldywgbWV0YSkge1xuICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRocmVlVmlldy5jbG9uZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdJbnRlcmFjdGl2ZVRhYnMuRW5hYmxlUmVxdWVzdCcsIHtcbiAgICAgICAgICAgIHRhYklkOiBgbW9kZWxfJHt0YWIuaWQoKX1gXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoIWV2dC5kYXRhLmNvdW50KSB7XG4gICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnSW50ZXJhY3RpdmVUYWJzLkRpc2FibGVSZXF1ZXN0Jywge1xuICAgICAgICAgICAgdGFiSWQ6IGBtb2RlbF8ke3RhYi5pZCgpfWBcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkF1dG9tYXRpY1NpbXVsYXRlKGV2dCkge1xuICAgICAgdGhpcy5fdGFicy5maW5kKHggPT4geC5pZCgpID09IGV2dC5kYXRhLnRhYklkKS5fb25TaW11bGF0ZVJlcXVlc3QoZXZ0KVxuICAgIH1cbiAgfVxufSlcbiJdfQ==
