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
            tabConf.euglenaInit = Globals.get('AppConfig.model.euglenaInit');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJNb2R1bGUiLCJNb2RlbFRhYiIsIlRocmVlVmlldyIsImJpbmRNZXRob2RzIiwiX3RhYnMiLCJ0aHJlZVZpZXciLCJnZXQiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImlkIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiZXVnbGVuYUNvdW50IiwiZXVnbGVuYUluaXQiLCJzaW11bGF0aW9uRnBzIiwidGFiIiwiY3JlYXRlIiwicHVzaCIsInNldCIsImhvb2siLCJfaG9va0ludGVyYWN0aXZlVGFicyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25FeHBlcmltZW50Q291bnRDaGFuZ2UiLCJfb25BdXRvbWF0aWNTaW11bGF0ZSIsImxpc3QiLCJtZXRhIiwidGFiVHlwZSIsIl9tb2RlbCIsIl9kYXRhIiwibW9kZWxUeXBlIiwidGl0bGUiLCJ0b1VwcGVyQ2FzZSIsImNvbnRlbnQiLCJ2aWV3IiwiY2xvbmUiLCJldnQiLCJkYXRhIiwiY291bnQiLCJvbGQiLCJkaXNwYXRjaEV2ZW50IiwidGFiSWQiLCJmaW5kIiwieCIsIl9vblNpbXVsYXRlUmVxdWVzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssV0FBV0wsUUFBUSxXQUFSLENBRGI7QUFBQSxNQUVFTSxZQUFZTixRQUFRLGFBQVIsQ0FGZDs7QUFJQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDJCQUFjO0FBQUE7O0FBQUE7O0FBRVpF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QUtsQyxLQUFMLENBQVdHLE9BQVgsQ0FBbUIsVUFBQ1MsR0FBRCxFQUFTO0FBQzFCbkIsb0JBQVFTLEdBQVIsQ0FBWSxPQUFaLEVBQXFCa0MsYUFBckIsQ0FBbUMsZ0NBQW5DLEVBQXFFO0FBQ25FQyxnQ0FBZ0J6QixJQUFJTixFQUFKO0FBRG1ELGFBQXJFO0FBR0QsV0FKRDtBQUtEO0FBQ0Y7QUFqRUg7QUFBQTtBQUFBLDJDQW1FdUIwQixHQW5FdkIsRUFtRTRCO0FBQ3hCLGFBQUtoQyxLQUFMLENBQVdzQyxJQUFYLENBQWdCO0FBQUEsaUJBQUtDLEVBQUVqQyxFQUFGLE1BQVUwQixJQUFJQyxJQUFKLENBQVNJLEtBQXhCO0FBQUEsU0FBaEIsRUFBK0NHLGtCQUEvQyxDQUFrRVIsR0FBbEU7QUFDRDtBQXJFSDs7QUFBQTtBQUFBLElBQWlDcEMsTUFBakM7QUF1RUQsQ0FsRkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWwvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBNb2RlbFRhYiA9IHJlcXVpcmUoJy4vdGFiL3RhYicpLFxuICAgIFRocmVlVmlldyA9IHJlcXVpcmUoJy4vdGhyZWV2aWV3Jyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBNb2RlbE1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX2hvb2tJbnRlcmFjdGl2ZVRhYnMnLFxuICAgICAgICAnX2hvb2szZFZpZXcnLFxuICAgICAgICAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJyxcbiAgICAgICAgJ19vbkF1dG9tYXRpY1NpbXVsYXRlJ1xuICAgICAgXSk7XG4gICAgICB0aGlzLl90YWJzID0gW107XG4gICAgICB0aGlzLnRocmVlVmlldyA9IG5ldyBUaHJlZVZpZXcoKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwnKSAmJiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMubGVuZ3RoJykpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykuZm9yRWFjaCgodGFiQ29uZiwgaW5kKSA9PiB7XG4gICAgICAgICAgdGFiQ29uZi5pZCA9IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicy5sZW5ndGgnKT09MSA/ICcnIDogU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGluZCk7XG4gICAgICAgICAgdGFiQ29uZi5ldWdsZW5hQ291bnQgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLmV1Z2xlbmFDb3VudCcpO1xuICAgICAgICAgIHRhYkNvbmYuZXVnbGVuYUluaXQgPSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLmV1Z2xlbmFJbml0Jyk7XG4gICAgICAgICAgdGFiQ29uZi5zaW11bGF0aW9uRnBzID0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC5zaW11bGF0aW9uRnBzJyk7XG4gICAgICAgICAgbGV0IHRhYiA9IE1vZGVsVGFiLmNyZWF0ZSh0YWJDb25mKVxuICAgICAgICAgIHRoaXMuX3RhYnMucHVzaCh0YWIpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KGBNb2RlbFRhYi4ke3RhYi5pZCgpfWAsIHRhYik7XG4gICAgICAgIH0pXG4gICAgICAgIEhNLmhvb2soJ0ludGVyYWN0aXZlVGFicy5MaXN0VGFicycsIHRoaXMuX2hvb2tJbnRlcmFjdGl2ZVRhYnMsIDEpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5BdXRvbWF0aWNTaW11bGF0ZScsIHRoaXMuX29uQXV0b21hdGljU2ltdWxhdGUpO1xuXG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIuaW5pdCgpO1xuICAgIH1cblxuICAgIF9ob29rSW50ZXJhY3RpdmVUYWJzKGxpc3QsIG1ldGEpIHtcbiAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFiLCBpbmQpID0+IHtcbiAgICAgICAgbGlzdC5wdXNoKHtcbiAgICAgICAgICBpZDogYG1vZGVsXyR7dGFiLmlkKCl9YCxcbiAgICAgICAgICB0YWJUeXBlOnRhYi5fbW9kZWwuX2RhdGEubW9kZWxUeXBlLFxuICAgICAgICAgIHRpdGxlOiBgTW9kZWwgJHt0YWIuaWQoKS50b1VwcGVyQ2FzZSgpfWAsXG4gICAgICAgICAgY29udGVudDogdGFiLnZpZXcoKVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBfaG9vazNkVmlldyh2aWV3LCBtZXRhKSB7XG4gICAgICBpZiAoIXZpZXcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhyZWVWaWV3LmNsb25lKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50Q291bnRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuY291bnQgJiYgIWV2dC5kYXRhLm9sZCkge1xuICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0ludGVyYWN0aXZlVGFicy5FbmFibGVSZXF1ZXN0Jywge1xuICAgICAgICAgICAgdGFiSWQ6IGBtb2RlbF8ke3RhYi5pZCgpfWBcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmICghZXZ0LmRhdGEuY291bnQpIHtcbiAgICAgICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdJbnRlcmFjdGl2ZVRhYnMuRGlzYWJsZVJlcXVlc3QnLCB7XG4gICAgICAgICAgICB0YWJJZDogYG1vZGVsXyR7dGFiLmlkKCl9YFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uQXV0b21hdGljU2ltdWxhdGUoZXZ0KSB7XG4gICAgICB0aGlzLl90YWJzLmZpbmQoeCA9PiB4LmlkKCkgPT0gZXZ0LmRhdGEudGFiSWQpLl9vblNpbXVsYXRlUmVxdWVzdChldnQpXG4gICAgfVxuICB9XG59KVxuIl19
