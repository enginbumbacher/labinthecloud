'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseModel = require('core/model/model'),
      Utils = require('core/util/utils'),
      defaults = {
    currentIndex: null,
    tabs: []
  };

  return function (_BaseModel) {
    _inherits(TabsModel, _BaseModel);

    function TabsModel(config) {
      _classCallCheck(this, TabsModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (TabsModel.__proto__ || Object.getPrototypeOf(TabsModel)).call(this, config));
    }

    _createClass(TabsModel, [{
      key: 'addTab',
      value: function addTab(tab) {
        var tabs = this.get('tabs');
        tabs.push(tab);
        this.set('tabs', tabs);

        if (tabs.length == 1) {
          this.selectTab(tab.id());
        }
      }
    }, {
      key: 'removeTab',
      value: function removeTab(id) {
        var tabs = this.get('tabs');
        var tab = tabs.filter(function (tab) {
          return tab.id == id;
        });
        if (tab.length == 0) throw new Error('Cannot remove tab with ID ' + id + '; tab not found.');
        var ind = tabs.indexOf(tab[0]);
        tabs.splice(ind, 1);
        this.set('tabs', tabs);

        if (tabs.length == 0) {
          this.set('currentIndex', 0);
          return;
        }
        if (this.get('currentIndex') >= ind) {
          if (ind >= tabs.length) ind -= 1;
          this.selectTab(tabs[ind].id());
        }
      }
    }, {
      key: 'selectTab',
      value: function selectTab(id) {
        var currTabInd = 0;
        this.get('tabs').forEach(function (tab, ind) {
          tab.select(tab.id() == id);
          if (tab.id() == id) currTabInd = ind;
        });
        this.set('currentIndex', currTabInd);
      }
    }, {
      key: 'currentTab',
      value: function currentTab() {
        if (this.get('currentIndex') < this.get('tabs').length) {
          return this.get('tabs')[this.get('currentIndex')];
        } else {
          return null;
        }
      }
    }]);

    return TabsModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlTW9kZWwiLCJVdGlscyIsImRlZmF1bHRzIiwiY3VycmVudEluZGV4IiwidGFicyIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwidGFiIiwiZ2V0IiwicHVzaCIsInNldCIsImxlbmd0aCIsInNlbGVjdFRhYiIsImlkIiwiZmlsdGVyIiwiRXJyb3IiLCJpbmQiLCJpbmRleE9mIiwic3BsaWNlIiwiY3VyclRhYkluZCIsImZvckVhY2giLCJzZWxlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSxrQkFBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BR0VHLFdBQVc7QUFDVEMsa0JBQWMsSUFETDtBQUVUQyxVQUFNO0FBRkcsR0FIYjs7QUFRQTtBQUFBOztBQUNFLHVCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPSCxRQUFQLEdBQWtCRCxNQUFNSyxjQUFOLENBQXFCRCxPQUFPSCxRQUE1QixFQUFzQ0EsUUFBdEMsQ0FBbEI7QUFEa0IsbUhBRVpHLE1BRlk7QUFHbkI7O0FBSkg7QUFBQTtBQUFBLDZCQU1TRSxHQU5ULEVBTWM7QUFDVixZQUFNSCxPQUFPLEtBQUtJLEdBQUwsQ0FBUyxNQUFULENBQWI7QUFDQUosYUFBS0ssSUFBTCxDQUFVRixHQUFWO0FBQ0EsYUFBS0csR0FBTCxDQUFTLE1BQVQsRUFBaUJOLElBQWpCOztBQUVBLFlBQUlBLEtBQUtPLE1BQUwsSUFBZSxDQUFuQixFQUFzQjtBQUNwQixlQUFLQyxTQUFMLENBQWVMLElBQUlNLEVBQUosRUFBZjtBQUNEO0FBQ0Y7QUFkSDtBQUFBO0FBQUEsZ0NBZ0JZQSxFQWhCWixFQWdCZ0I7QUFDWixZQUFNVCxPQUFPLEtBQUtJLEdBQUwsQ0FBUyxNQUFULENBQWI7QUFDQSxZQUFNRCxNQUFNSCxLQUFLVSxNQUFMLENBQVksVUFBQ1AsR0FBRCxFQUFTO0FBQUUsaUJBQU9BLElBQUlNLEVBQUosSUFBVUEsRUFBakI7QUFBc0IsU0FBN0MsQ0FBWjtBQUNBLFlBQUlOLElBQUlJLE1BQUosSUFBYyxDQUFsQixFQUFxQixNQUFNLElBQUlJLEtBQUosZ0NBQXVDRixFQUF2QyxzQkFBTjtBQUNyQixZQUFJRyxNQUFNWixLQUFLYSxPQUFMLENBQWFWLElBQUksQ0FBSixDQUFiLENBQVY7QUFDQUgsYUFBS2MsTUFBTCxDQUFZRixHQUFaLEVBQWlCLENBQWpCO0FBQ0EsYUFBS04sR0FBTCxDQUFTLE1BQVQsRUFBaUJOLElBQWpCOztBQUVBLFlBQUlBLEtBQUtPLE1BQUwsSUFBZSxDQUFuQixFQUFzQjtBQUNwQixlQUFLRCxHQUFMLENBQVMsY0FBVCxFQUF5QixDQUF6QjtBQUNBO0FBQ0Q7QUFDRCxZQUFJLEtBQUtGLEdBQUwsQ0FBUyxjQUFULEtBQTRCUSxHQUFoQyxFQUFxQztBQUNuQyxjQUFJQSxPQUFPWixLQUFLTyxNQUFoQixFQUF3QkssT0FBTyxDQUFQO0FBQ3hCLGVBQUtKLFNBQUwsQ0FBZVIsS0FBS1ksR0FBTCxFQUFVSCxFQUFWLEVBQWY7QUFDRDtBQUNGO0FBaENIO0FBQUE7QUFBQSxnQ0FrQ1lBLEVBbENaLEVBa0NnQjtBQUNaLFlBQUlNLGFBQWEsQ0FBakI7QUFDQSxhQUFLWCxHQUFMLENBQVMsTUFBVCxFQUFpQlksT0FBakIsQ0FBeUIsVUFBQ2IsR0FBRCxFQUFNUyxHQUFOLEVBQWM7QUFDckNULGNBQUljLE1BQUosQ0FBV2QsSUFBSU0sRUFBSixNQUFZQSxFQUF2QjtBQUNBLGNBQUlOLElBQUlNLEVBQUosTUFBWUEsRUFBaEIsRUFBb0JNLGFBQWFILEdBQWI7QUFDckIsU0FIRDtBQUlBLGFBQUtOLEdBQUwsQ0FBUyxjQUFULEVBQXlCUyxVQUF6QjtBQUNEO0FBekNIO0FBQUE7QUFBQSxtQ0EyQ2U7QUFDWCxZQUFJLEtBQUtYLEdBQUwsQ0FBUyxjQUFULElBQTJCLEtBQUtBLEdBQUwsQ0FBUyxNQUFULEVBQWlCRyxNQUFoRCxFQUF3RDtBQUN0RCxpQkFBTyxLQUFLSCxHQUFMLENBQVMsTUFBVCxFQUFpQixLQUFLQSxHQUFMLENBQVMsY0FBVCxDQUFqQixDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsaUJBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFqREg7O0FBQUE7QUFBQSxJQUErQlIsU0FBL0I7QUFtREQsQ0E1REQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3RhYnMvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
