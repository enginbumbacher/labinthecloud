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
          'background-color': '#FFFFCD',
          'border': '1px solid black',
          'opacity': '0.95',
          'z-index': '100',
          'text-align': 'left',
          'font-size': '12px',
          'padding': '5px',
          '-webkit-box-shadow': '10px 10px 57px 0px rgba(107,107,107,1)',
          '-moz-box-shadow': '10px 10px 57px 0px rgba(107,107,107,1)',
          'box-shadow': '10px 10px 57px 0px rgba(107,107,107,1)',
          'font-family': 'Arial, Helvetica, sans-serif'
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsIl9vbk1vZGVsQ2hhbmdlIiwiYmluZCIsImFkZEV2ZW50TGlzdGVuZXIiLCIkZWwiLCJhZGRDbGFzcyIsImdldCIsImpvaW4iLCJkZXNjcmlwdGlvbl9zdHlsZSIsImRlc2NyaXB0aW9uIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJmaW5kIiwiY3NzIiwiaG92ZXIiLCJlIiwicG9zWCIsIiQiLCJwb3NpdGlvbiIsImxlZnQiLCJwb3NZIiwidG9wIiwiaGVpZ2h0Iiwid2lkdGgiLCJwYXJlbnQiLCJkaXNwbGF5IiwiYWN0aXZhdGUiLCJjb25zb2xlIiwibG9nIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsImRpc2FibGUiLCJlbmFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsbUJBQVIsQ0FEYjs7QUFHQTtBQUFBOztBQUNFLHVCQUFZRyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHdIQUNqQkEsT0FBT0EsSUFBUCxHQUFjRixRQURHOztBQUV2QixZQUFLRyxjQUFMLEdBQXNCLE1BQUtBLGNBQUwsQ0FBb0JDLElBQXBCLE9BQXRCOztBQUVBSCxZQUFNSSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLRixjQUE1QztBQUNBLFlBQUtHLEdBQUwsQ0FBU0MsUUFBVCxDQUFrQk4sTUFBTU8sR0FBTixDQUFVLFNBQVYsRUFBcUJDLElBQXJCLENBQTBCLEdBQTFCLENBQWxCOztBQUVBLFVBQUlSLE1BQU1PLEdBQU4sQ0FBVSxhQUFWLENBQUosRUFBOEI7QUFDNUIsWUFBSUUsb0JBQW9CO0FBQ3RCLHFCQUFXLE1BRFc7QUFFdEIsc0JBQVksVUFGVTtBQUd0Qix1QkFBYSxPQUhTO0FBSXRCLHVCQUFhLE9BSlM7QUFLdEIsd0JBQWMsTUFMUTtBQU10Qiw4QkFBb0IsU0FORTtBQU90QixvQkFBVSxpQkFQWTtBQVF0QixxQkFBVyxNQVJXO0FBU3RCLHFCQUFXLEtBVFc7QUFVdEIsd0JBQWMsTUFWUTtBQVd0Qix1QkFBYSxNQVhTO0FBWXRCLHFCQUFXLEtBWlc7QUFhdEIsZ0NBQXNCLHdDQWJBO0FBY3RCLDZCQUFtQix3Q0FkRztBQWV0Qix3QkFBYyx3Q0FmUTtBQWdCdEIseUJBQWU7QUFoQk8sU0FBeEI7O0FBb0JBLFlBQUlDLGNBQWNDLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbEI7QUFDQUYsb0JBQVlHLFNBQVosR0FBd0IsYUFBeEI7QUFDQUgsb0JBQVlJLFNBQVosR0FBd0JkLE1BQU1PLEdBQU4sQ0FBVSxhQUFWLENBQXhCO0FBQ0E7O0FBRUEsY0FBS0YsR0FBTCxDQUFTLENBQVQsRUFBWVUsV0FBWixDQUF3QkwsV0FBeEI7QUFDQSxjQUFLTCxHQUFMLENBQVNXLElBQVQsQ0FBYyxjQUFkLEVBQThCQyxHQUE5QixDQUFrQ1IsaUJBQWxDOztBQUdBLGNBQUtKLEdBQUwsQ0FBU1csSUFBVCxDQUFjLE9BQWQsRUFBdUJFLEtBQXZCLENBQThCLFVBQVNDLENBQVQsRUFBWTtBQUNWLGNBQUlDLE9BQU9DLEVBQUUsSUFBRixFQUFRQyxRQUFSLEdBQW1CQyxJQUE5QjtBQUNBLGNBQUlDLE9BQU9ILEVBQUUsSUFBRixFQUFRQyxRQUFSLEdBQW1CRyxHQUE5QjtBQUNBLGNBQUlDLFNBQVNMLEVBQUUsSUFBRixFQUFRSyxNQUFSLEVBQWI7QUFDQSxjQUFJQyxRQUFRTixFQUFFLElBQUYsRUFBUU0sS0FBUixFQUFaO0FBQ0FOLFlBQUUsSUFBRixFQUFRTyxNQUFSLEdBQWlCWixJQUFqQixDQUFzQixjQUF0QixFQUFzQ0MsR0FBdEMsQ0FBMEMsRUFBQ1ksU0FBUSxPQUFUO0FBQ0VOLGtCQUFNSCxPQUFPTyxRQUFRLENBRHZCO0FBRUlGLGlCQUFLRCxPQUFPRSxNQUFQLEdBQWdCLENBRnpCLEVBQTFDO0FBR0QsU0FSL0IsRUFTOEIsWUFBVTtBQUNSTCxZQUFFLElBQUYsRUFBUU8sTUFBUixHQUFpQlosSUFBakIsQ0FBc0IsY0FBdEIsRUFBc0NDLEdBQXRDLENBQTBDLEVBQUMsV0FBVSxNQUFYLEVBQTFDO0FBQ0QsU0FYL0IsRUFZOEJkLElBWjlCO0FBYUQ7O0FBbERzQjtBQXFEeEI7O0FBdERIO0FBQUE7QUFBQSxzQ0F3RGtCMkIsUUF4RGxCLEVBd0Q0QjtBQUN4QkMsZ0JBQVFDLEdBQVIsQ0FBWSxNQUFaO0FBQ0Q7QUExREg7QUFBQTtBQUFBLHFDQTZEaUJDLEdBN0RqQixFQTZEc0I7QUFDbEIsZ0JBQVFBLElBQUlDLElBQUosQ0FBU0MsSUFBakI7QUFDRSxlQUFLLFVBQUw7QUFDRSxnQkFBSUYsSUFBSUMsSUFBSixDQUFTRSxLQUFiLEVBQW9CO0FBQ2xCLG1CQUFLQyxPQUFMO0FBQ0QsYUFGRCxNQUVPO0FBQ0wsbUJBQUtDLE1BQUw7QUFDRDtBQUNEO0FBUEo7QUFTRDtBQXZFSDtBQUFBO0FBQUEsOEJBeUVVLENBQUU7QUF6RVo7QUFBQTtBQUFBLGdDQTJFWSxDQUFFO0FBM0VkO0FBQUE7QUFBQSwrQkE2RVcsQ0FBRTtBQTdFYjs7QUFBQTtBQUFBLElBQStCeEMsT0FBL0I7QUErRUQsQ0FuRkQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vZmllbGQuaHRtbCcpO1xuXG4gIHJldHVybiBjbGFzcyBGaWVsZFZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCA/IHRtcGwgOiBUZW1wbGF0ZSk7XG4gICAgICB0aGlzLl9vbk1vZGVsQ2hhbmdlID0gdGhpcy5fb25Nb2RlbENoYW5nZS5iaW5kKHRoaXMpO1xuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICAgIHRoaXMuJGVsLmFkZENsYXNzKG1vZGVsLmdldCgnY2xhc3NlcycpLmpvaW4oJyAnKSk7XG5cbiAgICAgIGlmIChtb2RlbC5nZXQoJ2Rlc2NyaXB0aW9uJykpIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0aW9uX3N0eWxlID0ge1xuICAgICAgICAgICdkaXNwbGF5JzogJ25vbmUnLFxuICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgJ21pbi13aWR0aCc6ICcxNTBweCcsXG4gICAgICAgICAgJ21heC13aWR0aCc6ICczMDBweCcsXG4gICAgICAgICAgJ21pbi1oZWlnaHQnOiAnMjVweCcsXG4gICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI0ZGRkZDRCcsXG4gICAgICAgICAgJ2JvcmRlcic6ICcxcHggc29saWQgYmxhY2snLFxuICAgICAgICAgICdvcGFjaXR5JzogJzAuOTUnLFxuICAgICAgICAgICd6LWluZGV4JzogJzEwMCcsXG4gICAgICAgICAgJ3RleHQtYWxpZ24nOiAnbGVmdCcsXG4gICAgICAgICAgJ2ZvbnQtc2l6ZSc6ICcxMnB4JyxcbiAgICAgICAgICAncGFkZGluZyc6ICc1cHgnLFxuICAgICAgICAgICctd2Via2l0LWJveC1zaGFkb3cnOiAnMTBweCAxMHB4IDU3cHggMHB4IHJnYmEoMTA3LDEwNywxMDcsMSknLFxuICAgICAgICAgICctbW96LWJveC1zaGFkb3cnOiAnMTBweCAxMHB4IDU3cHggMHB4IHJnYmEoMTA3LDEwNywxMDcsMSknLFxuICAgICAgICAgICdib3gtc2hhZG93JzogJzEwcHggMTBweCA1N3B4IDBweCByZ2JhKDEwNywxMDcsMTA3LDEpJyxcbiAgICAgICAgICAnZm9udC1mYW1pbHknOiAnQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZidcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRlc2NyaXB0aW9uLmNsYXNzTmFtZSA9ICdkZXNjcmlwdGlvbic7XG4gICAgICAgIGRlc2NyaXB0aW9uLmlubmVySFRNTCA9IG1vZGVsLmdldCgnZGVzY3JpcHRpb24nKTtcbiAgICAgICAgLy9kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSAndGVzdCc7XG5cbiAgICAgICAgdGhpcy4kZWxbMF0uYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb24pO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuZGVzY3JpcHRpb24nKS5jc3MoZGVzY3JpcHRpb25fc3R5bGUpO1xuXG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnbGFiZWwnKS5ob3ZlciggZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb3NYID0gJCh0aGlzKS5wb3NpdGlvbigpLmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvc1kgPSAkKHRoaXMpLnBvc2l0aW9uKCkudG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoZWlnaHQgPSAkKHRoaXMpLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3aWR0aCA9ICQodGhpcykud2lkdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5kZXNjcmlwdGlvbicpLmNzcyh7ZGlzcGxheTonYmxvY2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogcG9zWCArIHdpZHRoIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NZICsgaGVpZ2h0ICsgNX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuZmluZCgnLmRlc2NyaXB0aW9uJykuY3NzKHsnZGlzcGxheSc6J25vbmUnfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkuYmluZCh0aGlzKTtcbiAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgX2Rpc3BsYXlNZXNzYWdlKGFjdGl2YXRlKSB7XG4gICAgICBjb25zb2xlLmxvZygnaGVyZScpXG4gICAgfVxuXG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaCAoZXZ0LmRhdGEucGF0aCkge1xuICAgICAgICBjYXNlIFwiZGlzYWJsZWRcIjpcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlKClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9jdXMoKSB7fVxuXG4gICAgZGlzYWJsZSgpIHt9XG5cbiAgICBlbmFibGUoKSB7fVxuICB9XG59KTtcbiJdfQ==
