'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./field.html');

  return function (_DomView) {
    _inherits(FieldView, _DomView);

    function FieldView(model, tmpl) {
      _classCallCheck(this, FieldView);

      var _this = _possibleConstructorReturn(this, (FieldView.__proto__ || Object.getPrototypeOf(FieldView)).call(this, tmpl ? tmpl : Template));

      _this._onModelChange = _this._onModelChange.bind(_this);

      model.addEventListener('Model.Change', _this._onModelChange);
      _this.$el.addClass(model.get('classes').join(' '));

      if (model.get('description')) {
        var description_style = {
          'display': 'none',
          'position': 'absolute',
          'min-width': '150px',
          'max-width': '300px',
          'min-height': '25px',
          'background-color': 'white',
          'border': '1px solid black',
          'opacity': '0.95',
          'z-index': '100',
          'text-align': 'left',
          'font-size': '12px',
          'padding': '5px'
        };

        var description = document.createElement('div');
        description.className = 'description';
        description.innerHTML = model.get('description');
        //description.innerHTML = 'test';

        _this.$el[0].appendChild(description);
        _this.$el.find('.description').css(description_style);

        _this.$el.find('label').hover(function (e) {
          var posX = $(this).position().left;
          var posY = $(this).position().top;
          var height = $(this).height();
          var width = $(this).width();
          $(this).parent().find('.description').css({ display: 'block',
            left: posX + width / 2,
            top: posY + height + 5 });
        }, function () {
          $(this).parent().find('.description').css({ 'display': 'none' });
        }).bind(_this);
      }

      return _this;
    }

    _createClass(FieldView, [{
      key: '_displayMessage',
      value: function _displayMessage(activate) {
        console.log('here');
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          case "disabled":
            if (evt.data.value) {
              this.disable();
            } else {
              this.enable();
            }
            break;
        }
      }
    }, {
      key: 'focus',
      value: function focus() {}
    }, {
      key: 'disable',
      value: function disable() {}
    }, {
      key: 'enable',
      value: function enable() {}
    }]);

    return FieldView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsIl9vbk1vZGVsQ2hhbmdlIiwiYmluZCIsImFkZEV2ZW50TGlzdGVuZXIiLCIkZWwiLCJhZGRDbGFzcyIsImdldCIsImpvaW4iLCJkZXNjcmlwdGlvbl9zdHlsZSIsImRlc2NyaXB0aW9uIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJmaW5kIiwiY3NzIiwiaG92ZXIiLCJlIiwicG9zWCIsIiQiLCJwb3NpdGlvbiIsImxlZnQiLCJwb3NZIiwidG9wIiwiaGVpZ2h0Iiwid2lkdGgiLCJwYXJlbnQiLCJkaXNwbGF5IiwiYWN0aXZhdGUiLCJjb25zb2xlIiwibG9nIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsImRpc2FibGUiLCJlbmFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsbUJBQVIsQ0FEYjs7QUFHQTtBQUFBOztBQUNFLHVCQUFZRyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHdIQUNqQkEsT0FBT0EsSUFBUCxHQUFjRixRQURHOztBQUV2QixZQUFLRyxjQUFMLEdBQXNCLE1BQUtBLGNBQUwsQ0FBb0JDLElBQXBCLE9BQXRCOztBQUVBSCxZQUFNSSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLRixjQUE1QztBQUNBLFlBQUtHLEdBQUwsQ0FBU0MsUUFBVCxDQUFrQk4sTUFBTU8sR0FBTixDQUFVLFNBQVYsRUFBcUJDLElBQXJCLENBQTBCLEdBQTFCLENBQWxCOztBQUVBLFVBQUlSLE1BQU1PLEdBQU4sQ0FBVSxhQUFWLENBQUosRUFBOEI7QUFDNUIsWUFBSUUsb0JBQW9CO0FBQ3RCLHFCQUFXLE1BRFc7QUFFdEIsc0JBQVksVUFGVTtBQUd0Qix1QkFBYSxPQUhTO0FBSXRCLHVCQUFhLE9BSlM7QUFLdEIsd0JBQWMsTUFMUTtBQU10Qiw4QkFBb0IsT0FORTtBQU90QixvQkFBVSxpQkFQWTtBQVF0QixxQkFBVyxNQVJXO0FBU3RCLHFCQUFXLEtBVFc7QUFVdEIsd0JBQWMsTUFWUTtBQVd0Qix1QkFBYSxNQVhTO0FBWXRCLHFCQUFXO0FBWlcsU0FBeEI7O0FBZ0JBLFlBQUlDLGNBQWNDLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbEI7QUFDQUYsb0JBQVlHLFNBQVosR0FBd0IsYUFBeEI7QUFDQUgsb0JBQVlJLFNBQVosR0FBd0JkLE1BQU1PLEdBQU4sQ0FBVSxhQUFWLENBQXhCO0FBQ0E7O0FBRUEsY0FBS0YsR0FBTCxDQUFTLENBQVQsRUFBWVUsV0FBWixDQUF3QkwsV0FBeEI7QUFDQSxjQUFLTCxHQUFMLENBQVNXLElBQVQsQ0FBYyxjQUFkLEVBQThCQyxHQUE5QixDQUFrQ1IsaUJBQWxDOztBQUdBLGNBQUtKLEdBQUwsQ0FBU1csSUFBVCxDQUFjLE9BQWQsRUFBdUJFLEtBQXZCLENBQThCLFVBQVNDLENBQVQsRUFBWTtBQUNWLGNBQUlDLE9BQU9DLEVBQUUsSUFBRixFQUFRQyxRQUFSLEdBQW1CQyxJQUE5QjtBQUNBLGNBQUlDLE9BQU9ILEVBQUUsSUFBRixFQUFRQyxRQUFSLEdBQW1CRyxHQUE5QjtBQUNBLGNBQUlDLFNBQVNMLEVBQUUsSUFBRixFQUFRSyxNQUFSLEVBQWI7QUFDQSxjQUFJQyxRQUFRTixFQUFFLElBQUYsRUFBUU0sS0FBUixFQUFaO0FBQ0FOLFlBQUUsSUFBRixFQUFRTyxNQUFSLEdBQWlCWixJQUFqQixDQUFzQixjQUF0QixFQUFzQ0MsR0FBdEMsQ0FBMEMsRUFBQ1ksU0FBUSxPQUFUO0FBQ0VOLGtCQUFNSCxPQUFPTyxRQUFRLENBRHZCO0FBRUlGLGlCQUFLRCxPQUFPRSxNQUFQLEdBQWdCLENBRnpCLEVBQTFDO0FBR0QsU0FSL0IsRUFTOEIsWUFBVTtBQUNSTCxZQUFFLElBQUYsRUFBUU8sTUFBUixHQUFpQlosSUFBakIsQ0FBc0IsY0FBdEIsRUFBc0NDLEdBQXRDLENBQTBDLEVBQUMsV0FBVSxNQUFYLEVBQTFDO0FBQ0QsU0FYL0IsRUFZOEJkLElBWjlCO0FBYUQ7O0FBOUNzQjtBQWlEeEI7O0FBbERIO0FBQUE7QUFBQSxzQ0FvRGtCMkIsUUFwRGxCLEVBb0Q0QjtBQUN4QkMsZ0JBQVFDLEdBQVIsQ0FBWSxNQUFaO0FBQ0Q7QUF0REg7QUFBQTtBQUFBLHFDQXlEaUJDLEdBekRqQixFQXlEc0I7QUFDbEIsZ0JBQVFBLElBQUlDLElBQUosQ0FBU0MsSUFBakI7QUFDRSxlQUFLLFVBQUw7QUFDRSxnQkFBSUYsSUFBSUMsSUFBSixDQUFTRSxLQUFiLEVBQW9CO0FBQ2xCLG1CQUFLQyxPQUFMO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsbUJBQUtDLE1BQUw7QUFDRDtBQUNEO0FBUEo7QUFTRDtBQW5FSDtBQUFBO0FBQUEsOEJBcUVVLENBQUU7QUFyRVo7QUFBQTtBQUFBLGdDQXVFWSxDQUFFO0FBdkVkO0FBQUE7QUFBQSwrQkF5RVcsQ0FBRTtBQXpFYjs7QUFBQTtBQUFBLElBQStCeEMsT0FBL0I7QUEyRUQsQ0EvRUQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vZmllbGQuaHRtbCcpO1xuXG4gIHJldHVybiBjbGFzcyBGaWVsZFZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCA/IHRtcGwgOiBUZW1wbGF0ZSk7XG4gICAgICB0aGlzLl9vbk1vZGVsQ2hhbmdlID0gdGhpcy5fb25Nb2RlbENoYW5nZS5iaW5kKHRoaXMpO1xuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICAgIHRoaXMuJGVsLmFkZENsYXNzKG1vZGVsLmdldCgnY2xhc3NlcycpLmpvaW4oJyAnKSk7XG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2Rlc2NyaXB0aW9uJykpIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0aW9uX3N0eWxlID0ge1xuICAgICAgICAgICdkaXNwbGF5JzogJ25vbmUnLFxuICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgJ21pbi13aWR0aCc6ICcxNTBweCcsXG4gICAgICAgICAgJ21heC13aWR0aCc6ICczMDBweCcsXG4gICAgICAgICAgJ21pbi1oZWlnaHQnOiAnMjVweCcsXG4gICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnd2hpdGUnLFxuICAgICAgICAgICdib3JkZXInOiAnMXB4IHNvbGlkIGJsYWNrJyxcbiAgICAgICAgICAnb3BhY2l0eSc6ICcwLjk1JyxcbiAgICAgICAgICAnei1pbmRleCc6ICcxMDAnLFxuICAgICAgICAgICd0ZXh0LWFsaWduJzogJ2xlZnQnLFxuICAgICAgICAgICdmb250LXNpemUnOiAnMTJweCcsXG4gICAgICAgICAgJ3BhZGRpbmcnOiAnNXB4J1xuICAgICAgICB9XG5cblxuICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGVzY3JpcHRpb24uY2xhc3NOYW1lID0gJ2Rlc2NyaXB0aW9uJztcbiAgICAgICAgZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gbW9kZWwuZ2V0KCdkZXNjcmlwdGlvbicpO1xuICAgICAgICAvL2Rlc2NyaXB0aW9uLmlubmVySFRNTCA9ICd0ZXN0JztcblxuICAgICAgICB0aGlzLiRlbFswXS5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5kZXNjcmlwdGlvbicpLmNzcyhkZXNjcmlwdGlvbl9zdHlsZSk7XG5cblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdsYWJlbCcpLmhvdmVyKCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvc1ggPSAkKHRoaXMpLnBvc2l0aW9uKCkubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9zWSA9ICQodGhpcykucG9zaXRpb24oKS50b3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhlaWdodCA9ICQodGhpcykuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdpZHRoID0gJCh0aGlzKS53aWR0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuZmluZCgnLmRlc2NyaXB0aW9uJykuY3NzKHtkaXNwbGF5OidibG9jaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBwb3NYICsgd2lkdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHBvc1kgKyBoZWlnaHQgKyA1fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuZGVzY3JpcHRpb24nKS5jc3MoeydkaXNwbGF5Jzonbm9uZSd9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5iaW5kKHRoaXMpO1xuICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICBfZGlzcGxheU1lc3NhZ2UoYWN0aXZhdGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdoZXJlJylcbiAgICB9XG5cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgc3dpdGNoIChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgXCJkaXNhYmxlZFwiOlxuICAgICAgICAgIGlmIChldnQuZGF0YS52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmFibGUoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb2N1cygpIHt9XG5cbiAgICBkaXNhYmxlKCkge31cblxuICAgIGVuYWJsZSgpIHt9XG4gIH1cbn0pO1xuIl19
