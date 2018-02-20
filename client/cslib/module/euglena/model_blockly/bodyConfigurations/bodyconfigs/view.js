'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./bodyconfigs.html'),
      $ = require('jquery'),
      Utils = require('core/util/utils');

  require('link!./bodyconfigs.css');

  return function (_DomView) {
    _inherits(BodyConfigurationsView, _DomView);

    function BodyConfigurationsView(model, tmpl) {
      _classCallCheck(this, BodyConfigurationsView);

      var _this = _possibleConstructorReturn(this, (BodyConfigurationsView.__proto__ || Object.getPrototypeOf(BodyConfigurationsView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onChange', '_render', '_addLayer', '_setBodyOpacity', '_showConfig', '_hideConfig']);

      //this._render(model);
      //this.addChild(model.get('contents'), ".component__multilayerimage");

      model.addEventListener('Model.Change', _this._onChange);
      return _this;
    }

    _createClass(BodyConfigurationsView, [{
      key: '_onChange',
      value: function _onChange(evt) {
        this._render(evt.currentTarget);
      }
    }, {
      key: '_render',
      value: function _render(model) {
        //this.$el.toggleClass("dragitem__selected", );
        console.log('move render code to here');
      }
    }, {
      key: '_addLayer',
      value: function _addLayer(imgID, imgPath) {
        var bodyNode = document.createElement('div');
        //bodyNode.style.visibility = "visible";
        bodyNode.id = imgID;
        bodyNode.className = 'multilayerimage__configuration';

        var imgNode = document.createElement('img');
        imgNode.src = imgPath + imgID + '.png';
        bodyNode.appendChild(imgNode);

        this.$el[0].appendChild(bodyNode);
      }
    }, {
      key: '_setBodyOpacity',
      value: function _setBodyOpacity(opacity) {
        this.$el.find("#bodybckgrnd").css('opacity', opacity);
      }
    }, {
      key: '_showConfig',
      value: function _showConfig(configId) {
        this.$el.find("#" + configId).css('visibility', 'visible');
      }
    }, {
      key: '_hideConfig',
      value: function _hideConfig(configId) {
        this.$el.find("#" + configId).css('visibility', 'hidden');
      }
    }]);

    return BodyConfigurationsView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIiQiLCJVdGlscyIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkNoYW5nZSIsImV2dCIsIl9yZW5kZXIiLCJjdXJyZW50VGFyZ2V0IiwiY29uc29sZSIsImxvZyIsImltZ0lEIiwiaW1nUGF0aCIsImJvZHlOb2RlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJjbGFzc05hbWUiLCJpbWdOb2RlIiwic3JjIiwiYXBwZW5kQ2hpbGQiLCIkZWwiLCJvcGFjaXR5IiwiZmluZCIsImNzcyIsImNvbmZpZ0lkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLHlCQUFSLENBRGI7QUFBQSxNQUVFRyxJQUFJSCxRQUFRLFFBQVIsQ0FGTjtBQUFBLE1BR0VJLFFBQVFKLFFBQVEsaUJBQVIsQ0FIVjs7QUFLQUEsVUFBUSx3QkFBUjs7QUFFQTtBQUFBOztBQUNFLG9DQUFZSyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLGtKQUNqQkEsUUFBUUosUUFEUzs7QUFFdkJFLFlBQU1HLFdBQU4sUUFBd0IsQ0FBQyxXQUFELEVBQWEsU0FBYixFQUF1QixXQUF2QixFQUFtQyxpQkFBbkMsRUFBcUQsYUFBckQsRUFBbUUsYUFBbkUsQ0FBeEI7O0FBRUE7QUFDQTs7QUFFQUYsWUFBTUcsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0MsU0FBNUM7QUFQdUI7QUFReEI7O0FBVEg7QUFBQTtBQUFBLGdDQVdZQyxHQVhaLEVBV2lCO0FBQ2IsYUFBS0MsT0FBTCxDQUFhRCxJQUFJRSxhQUFqQjtBQUNEO0FBYkg7QUFBQTtBQUFBLDhCQWVVUCxLQWZWLEVBZWlCO0FBQ2I7QUFDQVEsZ0JBQVFDLEdBQVIsQ0FBWSwwQkFBWjtBQUVEO0FBbkJIO0FBQUE7QUFBQSxnQ0FxQllDLEtBckJaLEVBcUJtQkMsT0FyQm5CLEVBcUI0QjtBQUN4QixZQUFJQyxXQUFXQyxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQTtBQUNBRixpQkFBU0csRUFBVCxHQUFjTCxLQUFkO0FBQ0FFLGlCQUFTSSxTQUFULEdBQXFCLGdDQUFyQjs7QUFFQSxZQUFJQyxVQUFVSixTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWQ7QUFDQUcsZ0JBQVFDLEdBQVIsR0FBY1AsVUFBVUQsS0FBVixHQUFrQixNQUFoQztBQUNBRSxpQkFBU08sV0FBVCxDQUFxQkYsT0FBckI7O0FBRUEsYUFBS0csR0FBTCxDQUFTLENBQVQsRUFBWUQsV0FBWixDQUF3QlAsUUFBeEI7QUFDRDtBQWhDSDtBQUFBO0FBQUEsc0NBa0NrQlMsT0FsQ2xCLEVBa0MyQjtBQUN2QixhQUFLRCxHQUFMLENBQVNFLElBQVQsQ0FBYyxjQUFkLEVBQThCQyxHQUE5QixDQUFrQyxTQUFsQyxFQUE0Q0YsT0FBNUM7QUFDRDtBQXBDSDtBQUFBO0FBQUEsa0NBc0NjRyxRQXRDZCxFQXNDd0I7QUFDcEIsYUFBS0osR0FBTCxDQUFTRSxJQUFULENBQWMsTUFBSUUsUUFBbEIsRUFBNEJELEdBQTVCLENBQWdDLFlBQWhDLEVBQTZDLFNBQTdDO0FBQ0Q7QUF4Q0g7QUFBQTtBQUFBLGtDQTBDY0MsUUExQ2QsRUEwQ3dCO0FBQ3BCLGFBQUtKLEdBQUwsQ0FBU0UsSUFBVCxDQUFjLE1BQUlFLFFBQWxCLEVBQTRCRCxHQUE1QixDQUFnQyxZQUFoQyxFQUE2QyxRQUE3QztBQUNEO0FBNUNIOztBQUFBO0FBQUEsSUFBNEMzQixPQUE1QztBQStDRCxDQXZERCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9ib2R5Y29uZmlncy5odG1sJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL2JvZHljb25maWdzLmNzcycpXG5cbiAgcmV0dXJuIGNsYXNzIEJvZHlDb25maWd1cmF0aW9uc1ZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbkNoYW5nZScsJ19yZW5kZXInLCdfYWRkTGF5ZXInLCdfc2V0Qm9keU9wYWNpdHknLCdfc2hvd0NvbmZpZycsJ19oaWRlQ29uZmlnJ10pXG5cbiAgICAgIC8vdGhpcy5fcmVuZGVyKG1vZGVsKTtcbiAgICAgIC8vdGhpcy5hZGRDaGlsZChtb2RlbC5nZXQoJ2NvbnRlbnRzJyksIFwiLmNvbXBvbmVudF9fbXVsdGlsYXllcmltYWdlXCIpO1xuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgX29uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fcmVuZGVyKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKG1vZGVsKSB7XG4gICAgICAvL3RoaXMuJGVsLnRvZ2dsZUNsYXNzKFwiZHJhZ2l0ZW1fX3NlbGVjdGVkXCIsICk7XG4gICAgICBjb25zb2xlLmxvZygnbW92ZSByZW5kZXIgY29kZSB0byBoZXJlJylcblxuICAgIH1cblxuICAgIF9hZGRMYXllcihpbWdJRCwgaW1nUGF0aCkge1xuICAgICAgdmFyIGJvZHlOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAvL2JvZHlOb2RlLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgIGJvZHlOb2RlLmlkID0gaW1nSUQ7XG4gICAgICBib2R5Tm9kZS5jbGFzc05hbWUgPSAnbXVsdGlsYXllcmltYWdlX19jb25maWd1cmF0aW9uJ1xuXG4gICAgICB2YXIgaW1nTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgaW1nTm9kZS5zcmMgPSBpbWdQYXRoICsgaW1nSUQgKyAnLnBuZyc7XG4gICAgICBib2R5Tm9kZS5hcHBlbmRDaGlsZChpbWdOb2RlKTtcblxuICAgICAgdGhpcy4kZWxbMF0uYXBwZW5kQ2hpbGQoYm9keU5vZGUpXG4gICAgfVxuXG4gICAgX3NldEJvZHlPcGFjaXR5KG9wYWNpdHkpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIjYm9keWJja2dybmRcIikuY3NzKCdvcGFjaXR5JyxvcGFjaXR5KTtcbiAgICB9XG5cbiAgICBfc2hvd0NvbmZpZyhjb25maWdJZCkge1xuICAgICAgdGhpcy4kZWwuZmluZChcIiNcIitjb25maWdJZCkuY3NzKCd2aXNpYmlsaXR5JywndmlzaWJsZScpO1xuICAgIH1cblxuICAgIF9oaWRlQ29uZmlnKGNvbmZpZ0lkKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKFwiI1wiK2NvbmZpZ0lkKS5jc3MoJ3Zpc2liaWxpdHknLCdoaWRkZW4nKTtcbiAgICB9XG5cbiAgfVxufSk7XG4iXX0=
