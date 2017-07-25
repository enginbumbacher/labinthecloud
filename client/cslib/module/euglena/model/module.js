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

      Utils.bindMethods(_this, ['_hookInteractiveTabs', '_hook3dView']);
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
    }]);

    return ModelModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJNb2R1bGUiLCJNb2RlbFRhYiIsIlRocmVlVmlldyIsImJpbmRNZXRob2RzIiwiX3RhYnMiLCJ0aHJlZVZpZXciLCJnZXQiLCJmb3JFYWNoIiwidGFiQ29uZiIsImluZCIsImlkIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiZXVnbGVuYUNvdW50Iiwic2ltdWxhdGlvbkZwcyIsInRhYiIsImNyZWF0ZSIsInB1c2giLCJzZXQiLCJob29rIiwiX2hvb2tJbnRlcmFjdGl2ZVRhYnMiLCJsaXN0IiwibWV0YSIsInRpdGxlIiwidG9VcHBlckNhc2UiLCJjb250ZW50IiwidmlldyIsImNsb25lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLFdBQVIsQ0FEYjtBQUFBLE1BRUVNLFlBQVlOLFFBQVEsYUFBUixDQUZkOztBQUlBQSxVQUFRLGtCQUFSOztBQUVBO0FBQUE7O0FBQ0UsMkJBQWM7QUFBQTs7QUFBQTs7QUFFWkUsWUFBTUssV0FBTixRQUF3QixDQUN0QixzQkFEc0IsRUFFdEIsYUFGc0IsQ0FBeEI7QUFJQSxZQUFLQyxLQUFMLEdBQWEsRUFBYjtBQUNBLFlBQUtDLFNBQUwsR0FBaUIsSUFBSUgsU0FBSixFQUFqQjtBQVBZO0FBUWI7O0FBVEg7QUFBQTtBQUFBLDZCQVdTO0FBQUE7O0FBQ0wsWUFBSUwsUUFBUVMsR0FBUixDQUFZLGlCQUFaLEtBQWtDVCxRQUFRUyxHQUFSLENBQVksNkJBQVosQ0FBdEMsRUFBa0Y7QUFDaEZULGtCQUFRUyxHQUFSLENBQVksc0JBQVosRUFBb0NDLE9BQXBDLENBQTRDLFVBQUNDLE9BQUQsRUFBVUMsR0FBVixFQUFrQjtBQUM1REQsb0JBQVFFLEVBQVIsR0FBYUMsT0FBT0MsWUFBUCxDQUFvQixLQUFLSCxHQUF6QixDQUFiO0FBQ0FELG9CQUFRSyxZQUFSLEdBQXVCaEIsUUFBUVMsR0FBUixDQUFZLDhCQUFaLENBQXZCO0FBQ0FFLG9CQUFRTSxhQUFSLEdBQXdCakIsUUFBUVMsR0FBUixDQUFZLCtCQUFaLENBQXhCO0FBQ0EsZ0JBQUlTLE1BQU1kLFNBQVNlLE1BQVQsQ0FBZ0JSLE9BQWhCLENBQVY7QUFDQSxtQkFBS0osS0FBTCxDQUFXYSxJQUFYLENBQWdCRixHQUFoQjtBQUNBbEIsb0JBQVFxQixHQUFSLGVBQXdCSCxJQUFJTCxFQUFKLEVBQXhCLEVBQW9DSyxHQUFwQztBQUNELFdBUEQ7QUFRQWhCLGFBQUdvQixJQUFILENBQVEsMEJBQVIsRUFBb0MsS0FBS0Msb0JBQXpDLEVBQStELENBQS9EO0FBQ0Q7QUFDRDtBQUNEO0FBeEJIO0FBQUE7QUFBQSwyQ0EwQnVCQyxJQTFCdkIsRUEwQjZCQyxJQTFCN0IsRUEwQm1DO0FBQy9CLGFBQUtsQixLQUFMLENBQVdHLE9BQVgsQ0FBbUIsVUFBQ1EsR0FBRCxFQUFNTixHQUFOLEVBQWM7QUFDL0JZLGVBQUtKLElBQUwsQ0FBVTtBQUNSUCwyQkFBYUssSUFBSUwsRUFBSixFQURMO0FBRVJhLDhCQUFnQlIsSUFBSUwsRUFBSixHQUFTYyxXQUFULEVBRlI7QUFHUkMscUJBQVNWLElBQUlXLElBQUo7QUFIRCxXQUFWO0FBS0QsU0FORDtBQU9BLGVBQU9MLElBQVA7QUFDRDtBQW5DSDtBQUFBO0FBQUEsa0NBcUNjSyxJQXJDZCxFQXFDb0JKLElBckNwQixFQXFDMEI7QUFDdEIsWUFBSSxDQUFDSSxJQUFMLEVBQVc7QUFDVCxpQkFBTyxLQUFLckIsU0FBTCxDQUFlc0IsS0FBZixFQUFQO0FBQ0Q7QUFDRCxlQUFPRCxJQUFQO0FBQ0Q7QUExQ0g7O0FBQUE7QUFBQSxJQUFpQzFCLE1BQWpDO0FBNENELENBdkREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
