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
        var tab = this.getTabById(id);
        if (!tab || !tab.isActive()) return;

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
    }, {
      key: 'disableTab',
      value: function disableTab(id) {
        var tab = this.getTabById(id);
        if (!tab) return; //maybe throw an error?
        tab.disable();
      }
    }, {
      key: 'enableTab',
      value: function enableTab(id) {
        var tab = this.getTabById(id);
        if (!tab) return; //maybe throw an error?
        tab.enable();
      }
    }, {
      key: 'getTabById',
      value: function getTabById(id) {
        var tabs = this.get('tabs');
        var tab = tabs.filter(function (tab) {
          return tab.id() == id;
        });
        if (tab.length == 0) return null;
        return tab[0];
      }
    }]);

    return TabsModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlTW9kZWwiLCJVdGlscyIsImRlZmF1bHRzIiwiY3VycmVudEluZGV4IiwidGFicyIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwidGFiIiwiZ2V0IiwicHVzaCIsInNldCIsImxlbmd0aCIsInNlbGVjdFRhYiIsImlkIiwiZmlsdGVyIiwiRXJyb3IiLCJpbmQiLCJpbmRleE9mIiwic3BsaWNlIiwiZ2V0VGFiQnlJZCIsImlzQWN0aXZlIiwiY3VyclRhYkluZCIsImZvckVhY2giLCJzZWxlY3QiLCJkaXNhYmxlIiwiZW5hYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsa0JBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUdFRyxXQUFXO0FBQ1RDLGtCQUFjLElBREw7QUFFVEMsVUFBTTtBQUZHLEdBSGI7O0FBUUE7QUFBQTs7QUFDRSx1QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT0gsUUFBUCxHQUFrQkQsTUFBTUssY0FBTixDQUFxQkQsT0FBT0gsUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBRGtCLG1IQUVaRyxNQUZZO0FBR25COztBQUpIO0FBQUE7QUFBQSw2QkFNU0UsR0FOVCxFQU1jO0FBQ1YsWUFBTUgsT0FBTyxLQUFLSSxHQUFMLENBQVMsTUFBVCxDQUFiO0FBQ0FKLGFBQUtLLElBQUwsQ0FBVUYsR0FBVjtBQUNBLGFBQUtHLEdBQUwsQ0FBUyxNQUFULEVBQWlCTixJQUFqQjs7QUFFQSxZQUFJQSxLQUFLTyxNQUFMLElBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsZUFBS0MsU0FBTCxDQUFlTCxJQUFJTSxFQUFKLEVBQWY7QUFDRDtBQUNGO0FBZEg7QUFBQTtBQUFBLGdDQWdC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IiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC90YWJzL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEJhc2VNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBjdXJyZW50SW5kZXg6IG51bGwsXG4gICAgICB0YWJzOiBbXVxuICAgIH07XG5cbiAgcmV0dXJuIGNsYXNzIFRhYnNNb2RlbCBleHRlbmRzIEJhc2VNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgYWRkVGFiKHRhYikge1xuICAgICAgY29uc3QgdGFicyA9IHRoaXMuZ2V0KCd0YWJzJyk7XG4gICAgICB0YWJzLnB1c2godGFiKTtcbiAgICAgIHRoaXMuc2V0KCd0YWJzJywgdGFicyk7XG5cbiAgICAgIGlmICh0YWJzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0VGFiKHRhYi5pZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVUYWIoaWQpIHtcbiAgICAgIGNvbnN0IHRhYnMgPSB0aGlzLmdldCgndGFicycpO1xuICAgICAgY29uc3QgdGFiID0gdGFicy5maWx0ZXIoKHRhYikgPT4geyByZXR1cm4gdGFiLmlkID09IGlkOyB9KVxuICAgICAgaWYgKHRhYi5sZW5ndGggPT0gMCkgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVtb3ZlIHRhYiB3aXRoIElEICR7aWR9OyB0YWIgbm90IGZvdW5kLmApO1xuICAgICAgbGV0IGluZCA9IHRhYnMuaW5kZXhPZih0YWJbMF0pO1xuICAgICAgdGFicy5zcGxpY2UoaW5kLCAxKTtcbiAgICAgIHRoaXMuc2V0KCd0YWJzJywgdGFicyk7XG5cbiAgICAgIGlmICh0YWJzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHRoaXMuc2V0KCdjdXJyZW50SW5kZXgnLCAwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ2V0KCdjdXJyZW50SW5kZXgnKSA+PSBpbmQpIHtcbiAgICAgICAgaWYgKGluZCA+PSB0YWJzLmxlbmd0aCkgaW5kIC09IDE7XG4gICAgICAgIHRoaXMuc2VsZWN0VGFiKHRhYnNbaW5kXS5pZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3RUYWIoaWQpIHtcbiAgICAgIGNvbnN0IHRhYiA9IHRoaXMuZ2V0VGFiQnlJZChpZCk7XG4gICAgICBpZiAoIXRhYiB8fCAhdGFiLmlzQWN0aXZlKCkpIHJldHVybjtcbiAgICAgIFxuICAgICAgbGV0IGN1cnJUYWJJbmQgPSAwXG4gICAgICB0aGlzLmdldCgndGFicycpLmZvckVhY2goKHRhYiwgaW5kKSA9PiB7XG4gICAgICAgIHRhYi5zZWxlY3QodGFiLmlkKCkgPT0gaWQpO1xuICAgICAgICBpZiAodGFiLmlkKCkgPT0gaWQpIGN1cnJUYWJJbmQgPSBpbmQ7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2V0KCdjdXJyZW50SW5kZXgnLCBjdXJyVGFiSW5kKVxuICAgIH1cblxuICAgIGN1cnJlbnRUYWIoKSB7XG4gICAgICBpZiAodGhpcy5nZXQoJ2N1cnJlbnRJbmRleCcpIDwgdGhpcy5nZXQoJ3RhYnMnKS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCd0YWJzJylbdGhpcy5nZXQoJ2N1cnJlbnRJbmRleCcpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVUYWIoaWQpIHtcbiAgICAgIGNvbnN0IHRhYiA9IHRoaXMuZ2V0VGFiQnlJZChpZCk7XG4gICAgICBpZiAoIXRhYikgcmV0dXJuOyAvL21heWJlIHRocm93IGFuIGVycm9yP1xuICAgICAgdGFiLmRpc2FibGUoKTtcbiAgICB9XG5cbiAgICBlbmFibGVUYWIoaWQpIHtcbiAgICAgIGNvbnN0IHRhYiA9IHRoaXMuZ2V0VGFiQnlJZChpZCk7XG4gICAgICBpZiAoIXRhYikgcmV0dXJuOyAvL21heWJlIHRocm93IGFuIGVycm9yP1xuICAgICAgdGFiLmVuYWJsZSgpO1xuICAgIH1cblxuICAgIGdldFRhYkJ5SWQoaWQpIHtcbiAgICAgIGNvbnN0IHRhYnMgPSB0aGlzLmdldCgndGFicycpO1xuICAgICAgY29uc3QgdGFiID0gdGFicy5maWx0ZXIoKHRhYikgPT4geyByZXR1cm4gdGFiLmlkKCkgPT0gaWR9KVxuICAgICAgaWYgKHRhYi5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XG4gICAgICByZXR1cm4gdGFiWzBdO1xuICAgIH1cbiAgfVxufSkiXX0=
