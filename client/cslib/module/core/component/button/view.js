'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var FieldView = require('core/component/form/field/view'),
      Template = require('text!./button.html'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals');

  require('link!./style.css');

  return function (_FieldView) {
    _inherits(ButtonFieldView, _FieldView);

    function ButtonFieldView(model, tmpl) {
      _classCallCheck(this, ButtonFieldView);

      var _this = _possibleConstructorReturn(this, (ButtonFieldView.__proto__ || Object.getPrototypeOf(ButtonFieldView)).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onModelChange', '_onClick', 'focus']);

      _this.$el.find('.button').html(model.get('label'));
      _this._eventName = model.get('eventName');
      _this._eventData = model.get('eventData');
      if (model.get('eventStyle')) {
        _this._eventStyle = model.get('eventStyle');
      } // Necessary for synching both videos in modelComparison mode
      _this.$el.find('.button').on('click', _this._onClick);
      _this._killNative = model.get("killNativeEvent");

      if (model.get('style') != "button") {
        _this.$el.addClass(model.get('style'));
      }
      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(ButtonFieldView, [{
      key: 'focus',
      value: function focus() {
        this.$el.find('.button').focus();
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.button').prop('disabled', false);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.button').prop('disabled', true);
      }
    }, {
      key: '_onClick',
      value: function _onClick(jqevt) {
        if (this._eventStyle) {
          Globals.get('Relay').dispatchEvent(this._eventName, this._eventData, true);
        } else {
          this.dispatchEvent(this._eventName, this._eventData, true);
        }
        if (this._killNative) return false;
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          case "label":
            this.$el.find('.button').html(evt.data.value);
            break;
          case "disabled":
            if (evt.data.value) {
              this.disable();
            } else {
              this.enable();
            }
            break;
        }
      }
    }]);

    return ButtonFieldView;
  }(FieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRmllbGRWaWV3IiwiVGVtcGxhdGUiLCJVdGlscyIsIkdsb2JhbHMiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIiRlbCIsImZpbmQiLCJodG1sIiwiZ2V0IiwiX2V2ZW50TmFtZSIsIl9ldmVudERhdGEiLCJfZXZlbnRTdHlsZSIsIm9uIiwiX29uQ2xpY2siLCJfa2lsbE5hdGl2ZSIsImFkZENsYXNzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiZm9jdXMiLCJwcm9wIiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJ2YWx1ZSIsImRpc2FibGUiLCJlbmFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSxnQ0FBUixDQUFsQjtBQUFBLE1BQ0VFLFdBQVdGLFFBQVEsb0JBQVIsQ0FEYjtBQUFBLE1BRUVHLFFBQVFILFFBQVEsaUJBQVIsQ0FGVjtBQUFBLE1BR0VJLFVBQVVKLFFBQVEsb0JBQVIsQ0FIWjs7QUFLQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDZCQUFZSyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkQsS0FEaUIsRUFDVkMsT0FBT0EsSUFBUCxHQUFjSixRQURKOztBQUV2QkMsWUFBTUksV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLFVBQW5CLEVBQStCLE9BQS9CLENBQXhCOztBQUVBLFlBQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLFNBQWQsRUFBeUJDLElBQXpCLENBQThCTCxNQUFNTSxHQUFOLENBQVUsT0FBVixDQUE5QjtBQUNBLFlBQUtDLFVBQUwsR0FBa0JQLE1BQU1NLEdBQU4sQ0FBVSxXQUFWLENBQWxCO0FBQ0EsWUFBS0UsVUFBTCxHQUFrQlIsTUFBTU0sR0FBTixDQUFVLFdBQVYsQ0FBbEI7QUFDQSxVQUFHTixNQUFNTSxHQUFOLENBQVUsWUFBVixDQUFILEVBQTRCO0FBQUUsY0FBS0csV0FBTCxHQUFtQlQsTUFBTU0sR0FBTixDQUFVLFlBQVYsQ0FBbkI7QUFBNEMsT0FQbkQsQ0FPb0Q7QUFDM0UsWUFBS0gsR0FBTCxDQUFTQyxJQUFULENBQWMsU0FBZCxFQUF5Qk0sRUFBekIsQ0FBNEIsT0FBNUIsRUFBcUMsTUFBS0MsUUFBMUM7QUFDQSxZQUFLQyxXQUFMLEdBQW1CWixNQUFNTSxHQUFOLENBQVUsaUJBQVYsQ0FBbkI7O0FBRUEsVUFBSU4sTUFBTU0sR0FBTixDQUFVLE9BQVYsS0FBc0IsUUFBMUIsRUFBb0M7QUFDbEMsY0FBS0gsR0FBTCxDQUFTVSxRQUFULENBQWtCYixNQUFNTSxHQUFOLENBQVUsT0FBVixDQUFsQjtBQUNEO0FBQ0ROLFlBQU1jLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUtDLGNBQTVDO0FBZHVCO0FBZXhCOztBQWhCSDtBQUFBO0FBQUEsOEJBa0JVO0FBQ04sYUFBS1osR0FBTCxDQUFTQyxJQUFULENBQWMsU0FBZCxFQUF5QlksS0FBekI7QUFDRDtBQXBCSDtBQUFBO0FBQUEsK0JBc0JXO0FBQ1AsYUFBS2IsR0FBTCxDQUFTQyxJQUFULENBQWMsU0FBZCxFQUF5QmEsSUFBekIsQ0FBOEIsVUFBOUIsRUFBMEMsS0FBMUM7QUFDRDtBQXhCSDtBQUFBO0FBQUEsZ0NBMEJZO0FBQ1IsYUFBS2QsR0FBTCxDQUFTQyxJQUFULENBQWMsU0FBZCxFQUF5QmEsSUFBekIsQ0FBOEIsVUFBOUIsRUFBMEMsSUFBMUM7QUFDRDtBQTVCSDtBQUFBO0FBQUEsK0JBOEJXQyxLQTlCWCxFQThCa0I7QUFDZCxZQUFJLEtBQUtULFdBQVQsRUFBc0I7QUFBRVYsa0JBQVFPLEdBQVIsQ0FBWSxPQUFaLEVBQXFCYSxhQUFyQixDQUFtQyxLQUFLWixVQUF4QyxFQUFvRCxLQUFLQyxVQUF6RCxFQUFxRSxJQUFyRTtBQUE2RSxTQUFyRyxNQUNLO0FBQUUsZUFBS1csYUFBTCxDQUFtQixLQUFLWixVQUF4QixFQUFvQyxLQUFLQyxVQUF6QyxFQUFxRCxJQUFyRDtBQUE2RDtBQUNwRSxZQUFJLEtBQUtJLFdBQVQsRUFBc0IsT0FBTyxLQUFQO0FBQ3ZCO0FBbENIO0FBQUE7QUFBQSxxQ0FvQ2lCUSxHQXBDakIsRUFvQ3NCO0FBQ2xCLGdCQUFRQSxJQUFJQyxJQUFKLENBQVNDLElBQWpCO0FBQ0UsZUFBSyxPQUFMO0FBQ0UsaUJBQUtuQixHQUFMLENBQVNDLElBQVQsQ0FBYyxTQUFkLEVBQXlCQyxJQUF6QixDQUE4QmUsSUFBSUMsSUFBSixDQUFTRSxLQUF2QztBQUNGO0FBQ0EsZUFBSyxVQUFMO0FBQ0UsZ0JBQUlILElBQUlDLElBQUosQ0FBU0UsS0FBYixFQUFvQjtBQUNsQixtQkFBS0MsT0FBTDtBQUNELGFBRkQsTUFFTztBQUNMLG1CQUFLQyxNQUFMO0FBQ0Q7QUFDSDtBQVZGO0FBWUQ7QUFqREg7O0FBQUE7QUFBQSxJQUFxQzdCLFNBQXJDO0FBbURELENBM0REIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9idXR0b24vdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBGaWVsZFZpZXcgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2ZpZWxkL3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi9idXR0b24uaHRtbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgQnV0dG9uRmllbGRWaWV3IGV4dGVuZHMgRmllbGRWaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIobW9kZWwsIHRtcGwgPyB0bXBsIDogVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Nb2RlbENoYW5nZScsICdfb25DbGljaycsICdmb2N1cyddKTtcblxuICAgICAgdGhpcy4kZWwuZmluZCgnLmJ1dHRvbicpLmh0bWwobW9kZWwuZ2V0KCdsYWJlbCcpKTtcbiAgICAgIHRoaXMuX2V2ZW50TmFtZSA9IG1vZGVsLmdldCgnZXZlbnROYW1lJyk7XG4gICAgICB0aGlzLl9ldmVudERhdGEgPSBtb2RlbC5nZXQoJ2V2ZW50RGF0YScpO1xuICAgICAgaWYobW9kZWwuZ2V0KCdldmVudFN0eWxlJykpIHsgdGhpcy5fZXZlbnRTdHlsZSA9IG1vZGVsLmdldCgnZXZlbnRTdHlsZScpO30gLy8gTmVjZXNzYXJ5IGZvciBzeW5jaGluZyBib3RoIHZpZGVvcyBpbiBtb2RlbENvbXBhcmlzb24gbW9kZVxuICAgICAgdGhpcy4kZWwuZmluZCgnLmJ1dHRvbicpLm9uKCdjbGljaycsIHRoaXMuX29uQ2xpY2spO1xuICAgICAgdGhpcy5fa2lsbE5hdGl2ZSA9IG1vZGVsLmdldChcImtpbGxOYXRpdmVFdmVudFwiKTtcblxuICAgICAgaWYgKG1vZGVsLmdldCgnc3R5bGUnKSAhPSBcImJ1dHRvblwiKSB7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKG1vZGVsLmdldCgnc3R5bGUnKSk7XG4gICAgICB9XG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5idXR0b24nKS5mb2N1cygpO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5idXR0b24nKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLmJ1dHRvbicpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgX29uQ2xpY2soanFldnQpIHtcbiAgICAgIGlmICh0aGlzLl9ldmVudFN0eWxlKSB7IEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQodGhpcy5fZXZlbnROYW1lLCB0aGlzLl9ldmVudERhdGEsIHRydWUpOyB9XG4gICAgICBlbHNlIHsgdGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX2V2ZW50TmFtZSwgdGhpcy5fZXZlbnREYXRhLCB0cnVlKTsgfVxuICAgICAgaWYgKHRoaXMuX2tpbGxOYXRpdmUpIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaCAoZXZ0LmRhdGEucGF0aCkge1xuICAgICAgICBjYXNlIFwibGFiZWxcIjpcbiAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuYnV0dG9uJykuaHRtbChldnQuZGF0YS52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGlzYWJsZWRcIjpcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG4iXX0=
