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
            tabType: tab._model._data.modelType,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJNb2R1bGUiLCJNb2RlbFRhYiIsIlRocmVlVmlldyIsImJpbmRNZXRob2RzIiwiX3RhYnMiLCJ0aHJlZVZpZXciLCJnZXQiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImlkIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiZXVnbGVuYUNvdW50Iiwic2ltdWxhdGlvbkZwcyIsInRhYiIsImNyZWF0ZSIsInB1c2giLCJzZXQiLCJob29rIiwiX2hvb2tJbnRlcmFjdGl2ZVRhYnMiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiX29uQXV0b21hdGljU2ltdWxhdGUiLCJsaXN0IiwibWV0YSIsInRhYlR5cGUiLCJfbW9kZWwiLCJfZGF0YSIsIm1vZGVsVHlwZSIsInRpdGxlIiwidG9VcHBlckNhc2UiLCJjb250ZW50IiwidmlldyIsImNsb25lIiwiZXZ0IiwiZGF0YSIsImNvdW50Iiwib2xkIiwiZGlzcGF0Y2hFdmVudCIsInRhYklkIiwiZmluZCIsIngiLCJfb25TaW11bGF0ZVJlcXVlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFNBQVNKLFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VLLFdBQVdMLFFBQVEsV0FBUixDQURiO0FBQUEsTUFFRU0sWUFBWU4sUUFBUSxhQUFSLENBRmQ7O0FBSUFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSwyQkFBYztBQUFBOztBQUFBOztBQUVaRSxZQUFNSyxXQUFOLFFB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LEVBQXFCaUMsYUFBckIsQ0FBbUMsZ0NBQW5DLEVBQXFFO0FBQ25FQyxnQ0FBZ0J6QixJQUFJTCxFQUFKO0FBRG1ELGFBQXJFO0FBR0QsV0FKRDtBQUtEO0FBQ0Y7QUEvREg7QUFBQTtBQUFBLDJDQWlFdUJ5QixHQWpFdkIsRUFpRTRCO0FBQ3hCLGFBQUsvQixLQUFMLENBQVdxQyxJQUFYLENBQWdCO0FBQUEsaUJBQUtDLEVBQUVoQyxFQUFGLE1BQVV5QixJQUFJQyxJQUFKLENBQVNJLEtBQXhCO0FBQUEsU0FBaEIsRUFBK0NHLGtCQUEvQyxDQUFrRVIsR0FBbEU7QUFDRDtBQW5FSDs7QUFBQTtBQUFBLElBQWlDbkMsTUFBakM7QUFxRUQsQ0FoRkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBNb2RlbFRhYiA9IHJlcXVpcmUoJy4vdGFiL3RhYicpLFxuICAgIFRocmVlVmlldyA9IHJlcXVpcmUoJy4vdGhyZWV2aWV3Jyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBNb2RlbE1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX2hvb2tJbnRlcmFjdGl2ZVRhYnMnLFxuICAgICAgICAnX2hvb2szZFZpZXcnLFxuICAgICAgICAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJyxcbiAgICAgICAgJ19vbkF1dG9tYXRpY1NpbXVsYXRlJ1xuICAgICAgXSk7XG4gICAgICB0aGlzLl90YWJzID0gW107XG4gICAgICB0aGlzLnRocmVlVmlldyA9IG5ldyBUaHJlZVZpZXcoKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwnKSAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMubGVuZ3RoJykpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgICAgdGFiQ29uZi5pZCA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicy5sZW5ndGgnKT09MSA/ICcnIDogU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGluZCk7XG4gICAgICAgICAgdGFiQ29uZi5ldWdsZW5hQ291bnQgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLmV1Z2xlbmFDb3VudCcpO1xuICAgICAgICAgIHRhYkNvbmYuc2ltdWxhdGlvbkZwcyA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwuc2ltdWxhdGlvbkZwcycpO1xuICAgICAgICAgIGxldCB0YWIgPSBNb2RlbFRhYi5jcmVhdGUodGFiQ29uZilcbiAgICAgICAgICB0aGlzLl90YWJzLnB1c2godGFiKTtcbiAgICAgICAgICBHbG9iYWxzLnNldChgTW9kZWxUYWIuJHt0YWIuaWQoKX1gLCB0YWIpO1xuICAgICAgICB9KVxuICAgICAgICBITS5ob29rKCdJbnRlcmFjdGl2ZVRhYnMuTGlzdFRhYnMnLCB0aGlzLl9ob29rSW50ZXJhY3RpdmVUYWJzLCAxKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHRoaXMuX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKTtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQXV0b21hdGljU2ltdWxhdGUnLCB0aGlzLl9vbkF1dG9tYXRpY1NpbXVsYXRlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5pbml0KCk7XG4gICAgfVxuXG4gICAgX2hvb2tJbnRlcmFjdGl2ZVRhYnMobGlzdCwgbWV0YSkge1xuICAgICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWIsIGluZCkgPT4ge1xuICAgICAgICBsaXN0LnB1c2goe1xuICAgICAgICAgIGlkOiBgbW9kZWxfJHt0YWIuaWQoKX1gLFxuICAgICAgICAgIHRhYlR5cGU6dGFiLl9tb2RlbC5fZGF0YS5tb2RlbFR5cGUsXG4gICAgICAgICAgdGl0bGU6IGBNb2RlbCAke3RhYi5pZCgpLnRvVXBwZXJDYXNlKCl9YCxcbiAgICAgICAgICBjb250ZW50OiB0YWIudmlldygpXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIF9ob29rM2RWaWV3KHZpZXcsIG1ldGEpIHtcbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm4gdGhpcy50aHJlZVZpZXcuY2xvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRDb3VudENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5jb3VudCAmJiAhZXZ0LmRhdGEub2xkKSB7XG4gICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnSW50ZXJhY3RpdmVUYWJzLkVuYWJsZVJlcXVlc3QnLCB7XG4gICAgICAgICAgICB0YWJJZDogYG1vZGVsXyR7dGFiLmlkKCl9YFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0ludGVyYWN0aXZlVGFicy5EaXNhYmxlUmVxdWVzdCcsIHtcbiAgICAgICAgICAgIHRhYklkOiBgbW9kZWxfJHt0YWIuaWQoKX1gXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25BdXRvbWF0aWNTaW11bGF0ZShldnQpIHtcbiAgICAgIHRoaXMuX3RhYnMuZmluZCh4ID0+IHguaWQoKSA9PSBldnQuZGF0YS50YWJJZCkuX29uU2ltdWxhdGVSZXF1ZXN0KGV2dClcbiAgICB9XG4gIH1cbn0pXG4iXX0=
