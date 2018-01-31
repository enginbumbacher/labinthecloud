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

      Utils.bindMethods(_this, ['_onChange', '_render', '_addLayer', '_setBodyOpacity']);

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
      value: function _addLayer(params, imgPath) {
        var bodyNode = document.createElement('div');
        //bodyNode.style.visibility = "visible";
        bodyNode.id = params.id;
        bodyNode.className = 'multilayerimage__configuration';

        var imgNode = document.createElement('img');
        imgNode.src = imgPath + params.id + '.png';
        bodyNode.appendChild(imgNode);

        this.$el[0].appendChild(bodyNode);
      }
    }, {
      key: '_setBodyOpacity',
      value: function _setBodyOpacity(opacity) {
        this.$el.find("#bodybckgrnd").css('opacity', opacity);
      }
    }, {
      key: '_showBodyConfig',
      value: function _showBodyConfig(configId) {
        this.$el.find("#" + configId).css('visibility', 'visible');
      }
    }, {
      key: '_hideBodyConfig',
      value: function _hideBodyConfig(configId) {
        this.$el.find("#" + configId).css('visibility', 'hidden');
      }
    }]);

    return BodyConfigurationsView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIiQiLCJVdGlscyIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbkNoYW5nZSIsImV2dCIsIl9yZW5kZXIiLCJjdXJyZW50VGFyZ2V0IiwiY29uc29sZSIsImxvZyIsInBhcmFtcyIsImltZ1BhdGgiLCJib2R5Tm9kZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlkIiwiY2xhc3NOYW1lIiwiaW1nTm9kZSIsInNyYyIsImFwcGVuZENoaWxkIiwiJGVsIiwib3BhY2l0eSIsImZpbmQiLCJjc3MiLCJjb25maWdJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsV0FBV0YsUUFBUSx5QkFBUixDQURiO0FBQUEsTUFFRUcsSUFBSUgsUUFBUSxRQUFSLENBRk47QUFBQSxNQUdFSSxRQUFRSixRQUFRLGlCQUFSLENBSFY7O0FBS0FBLFVBQVEsd0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxvQ0FBWUssS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxrSkFDakJBLFFBQVFKLFFBRFM7O0FBRXZCRSxZQUFNRyxXQUFOLFFBQXdCLENBQUMsV0FBRCxFQUFhLFNBQWIsRUFBdUIsV0FBdkIsRUFBbUMsaUJBQW5DLENBQXhCOztBQUVBO0FBQ0E7O0FBRUFGLFlBQU1HLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLFNBQTVDO0FBUHVCO0FBUXhCOztBQVRIO0FBQUE7QUFBQSxnQ0FXWUMsR0FYWixFQVdpQjtBQUNiLGFBQUtDLE9BQUwsQ0FBYUQsSUFBSUUsYUFBakI7QUFDRDtBQWJIO0FBQUE7QUFBQSw4QkFlVVAsS0FmVixFQWVpQjtBQUNiO0FBQ0FRLGdCQUFRQyxHQUFSLENBQVksMEJBQVo7QUFFRDtBQW5CSDtBQUFBO0FBQUEsZ0NBcUJZQyxNQXJCWixFQXFCb0JDLE9BckJwQixFQXFCNkI7QUFDekIsWUFBSUMsV0FBV0MsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFmO0FBQ0E7QUFDQUYsaUJBQVNHLEVBQVQsR0FBY0wsT0FBT0ssRUFBckI7QUFDQUgsaUJBQVNJLFNBQVQsR0FBcUIsZ0NBQXJCOztBQUVBLFlBQUlDLFVBQVVKLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBZDtBQUNBRyxnQkFBUUMsR0FBUixHQUFjUCxVQUFVRCxPQUFPSyxFQUFqQixHQUFzQixNQUFwQztBQUNBSCxpQkFBU08sV0FBVCxDQUFxQkYsT0FBckI7O0FBRUEsYUFBS0csR0FBTCxDQUFTLENBQVQsRUFBWUQsV0FBWixDQUF3QlAsUUFBeEI7QUFDRDtBQWhDSDtBQUFBO0FBQUEsc0NBa0NrQlMsT0FsQ2xCLEVBa0MyQjtBQUN2QixhQUFLRCxHQUFMLENBQVNFLElBQVQsQ0FBYyxjQUFkLEVBQThCQyxHQUE5QixDQUFrQyxTQUFsQyxFQUE0Q0YsT0FBNUM7QUFDRDtBQXBDSDtBQUFBO0FBQUEsc0NBc0NrQkcsUUF0Q2xCLEVBc0M0QjtBQUN4QixhQUFLSixHQUFMLENBQVNFLElBQVQsQ0FBYyxNQUFJRSxRQUFsQixFQUE0QkQsR0FBNUIsQ0FBZ0MsWUFBaEMsRUFBNkMsU0FBN0M7QUFDRDtBQXhDSDtBQUFBO0FBQUEsc0NBMENrQkMsUUExQ2xCLEVBMEM0QjtBQUN4QixhQUFLSixHQUFMLENBQVNFLElBQVQsQ0FBYyxNQUFJRSxRQUFsQixFQUE0QkQsR0FBNUIsQ0FBZ0MsWUFBaEMsRUFBNkMsUUFBN0M7QUFDRDtBQTVDSDs7QUFBQTtBQUFBLElBQTRDM0IsT0FBNUM7QUE4Q0QsQ0F0REQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3Mvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vYm9keWNvbmZpZ3MuaHRtbCcpLFxuICAgICQgPSByZXF1aXJlKCdqcXVlcnknKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9ib2R5Y29uZmlncy5jc3MnKVxuXG4gIHJldHVybiBjbGFzcyBCb2R5Q29uZmlndXJhdGlvbnNWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25DaGFuZ2UnLCdfcmVuZGVyJywnX2FkZExheWVyJywnX3NldEJvZHlPcGFjaXR5J10pXG5cbiAgICAgIC8vdGhpcy5fcmVuZGVyKG1vZGVsKTtcbiAgICAgIC8vdGhpcy5hZGRDaGlsZChtb2RlbC5nZXQoJ2NvbnRlbnRzJyksIFwiLmNvbXBvbmVudF9fbXVsdGlsYXllcmltYWdlXCIpO1xuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgX29uQ2hhbmdlKGV2dCkge1xuICAgICAgdGhpcy5fcmVuZGVyKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKG1vZGVsKSB7XG4gICAgICAvL3RoaXMuJGVsLnRvZ2dsZUNsYXNzKFwiZHJhZ2l0ZW1fX3NlbGVjdGVkXCIsICk7XG4gICAgICBjb25zb2xlLmxvZygnbW92ZSByZW5kZXIgY29kZSB0byBoZXJlJylcblxuICAgIH1cblxuICAgIF9hZGRMYXllcihwYXJhbXMsIGltZ1BhdGgpIHtcbiAgICAgIHZhciBib2R5Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgLy9ib2R5Tm9kZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICBib2R5Tm9kZS5pZCA9IHBhcmFtcy5pZDtcbiAgICAgIGJvZHlOb2RlLmNsYXNzTmFtZSA9ICdtdWx0aWxheWVyaW1hZ2VfX2NvbmZpZ3VyYXRpb24nXG5cbiAgICAgIHZhciBpbWdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICBpbWdOb2RlLnNyYyA9IGltZ1BhdGggKyBwYXJhbXMuaWQgKyAnLnBuZyc7XG4gICAgICBib2R5Tm9kZS5hcHBlbmRDaGlsZChpbWdOb2RlKTtcblxuICAgICAgdGhpcy4kZWxbMF0uYXBwZW5kQ2hpbGQoYm9keU5vZGUpXG4gICAgfVxuXG4gICAgX3NldEJvZHlPcGFjaXR5KG9wYWNpdHkpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIjYm9keWJja2dybmRcIikuY3NzKCdvcGFjaXR5JyxvcGFjaXR5KTtcbiAgICB9XG5cbiAgICBfc2hvd0JvZHlDb25maWcoY29uZmlnSWQpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIjXCIrY29uZmlnSWQpLmNzcygndmlzaWJpbGl0eScsJ3Zpc2libGUnKTtcbiAgICB9XG5cbiAgICBfaGlkZUJvZHlDb25maWcoY29uZmlnSWQpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIjXCIrY29uZmlnSWQpLmNzcygndmlzaWJpbGl0eScsJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxufSk7XG4iXX0=
