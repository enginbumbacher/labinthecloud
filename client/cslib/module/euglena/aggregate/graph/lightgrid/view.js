'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./lightgrid.html'),
      $ = require('jquery');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(LightGridView, _DomView);

    function LightGridView(model, tmpl) {
      _classCallCheck(this, LightGridView);

      var _this = _possibleConstructorReturn(this, (LightGridView.__proto__ || Object.getPrototypeOf(LightGridView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange']);
      _this._spans = [];

      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(LightGridView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == 'lights') {
          this.render(evt.currentTarget);
        }
      }
    }, {
      key: 'render',
      value: function render(model) {
        var _this2 = this;

        var lights = model.get('lights');
        while (this._spans.length) {
          this.removeChild(this._spans.pop());
        }

        var _loop = function _loop(key) {
          var timecount = 0;
          lights[key].forEach(function (spanConf) {
            if (spanConf.intensity > 0) {
              var span = new DomView('<span class="lightgrid__span">' + spanConf.intensity + '</span>');
              span.$dom().css({
                width: 100 * spanConf.duration / model.get('duration') + '%',
                left: 100 * timecount / model.get('duration') + '%'
              });
              _this2._spans.push(span);
              _this2.addChild(span, '.lightgrid__row__' + key + ' .lightgrid__row__intensities');
            }
            timecount += spanConf.duration;
          });
        };

        for (var key in lights) {
          _loop(key);
        }
      }
    }]);

    return LightGridView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS9ncmFwaC9saWdodGdyaWQvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCIkIiwibW9kZWwiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfc3BhbnMiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxDaGFuZ2UiLCJldnQiLCJkYXRhIiwicGF0aCIsInJlbmRlciIsImN1cnJlbnRUYXJnZXQiLCJsaWdodHMiLCJnZXQiLCJsZW5ndGgiLCJyZW1vdmVDaGlsZCIsInBvcCIsImtleSIsInRpbWVjb3VudCIsImZvckVhY2giLCJzcGFuQ29uZiIsImludGVuc2l0eSIsInNwYW4iLCIkZG9tIiwiY3NzIiwid2lkdGgiLCJkdXJhdGlvbiIsImxlZnQiLCJwdXNoIiwiYWRkQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHVCQUFSLENBRGI7QUFBQSxNQUVFTSxJQUFJTixRQUFRLFFBQVIsQ0FGTjs7QUFJQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDJCQUFZTyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLGdJQUNqQkEsUUFBUUgsUUFEUzs7QUFFdkJKLFlBQU1RLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxDQUF4QjtBQUNBLFlBQUtDLE1BQUwsR0FBYyxFQUFkOztBQUVBSCxZQUFNSSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLQyxjQUE1QztBQUx1QjtBQU14Qjs7QUFQSDtBQUFBO0FBQUEscUNBU2lCQyxHQVRqQixFQVNzQjtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVNDLElBQVQsSUFBaUIsUUFBckIsRUFBK0I7QUFDN0IsZUFBS0MsTUFBTCxDQUFZSCxJQUFJSSxhQUFoQjtBQUNEO0FBQ0Y7QUFiSDtBQUFBO0FBQUEsNkJBZVNWLEtBZlQsRUFlZ0I7QUFBQTs7QUFDWixZQUFNVyxTQUFTWCxNQUFNWSxHQUFOLENBQVUsUUFBVixDQUFmO0FBQ0EsZUFBTyxLQUFLVCxNQUFMLENBQVlVLE1BQW5CLEVBQTJCO0FBQ3pCLGVBQUtDLFdBQUwsQ0FBaUIsS0FBS1gsTUFBTCxDQUFZWSxHQUFaLEVBQWpCO0FBQ0Q7O0FBSlcsbUNBTUhDLEdBTkc7QUFPVixjQUFJQyxZQUFZLENBQWhCO0FBQ0FOLGlCQUFPSyxHQUFQLEVBQVlFLE9BQVosQ0FBb0IsVUFBQ0MsUUFBRCxFQUFjO0FBQ2hDLGdCQUFJQSxTQUFTQyxTQUFULEdBQXFCLENBQXpCLEVBQTRCO0FBQzFCLGtCQUFJQyxPQUFPLElBQUl4QixPQUFKLG9DQUE2Q3NCLFNBQVNDLFNBQXRELGFBQVg7QUFDQUMsbUJBQUtDLElBQUwsR0FBWUMsR0FBWixDQUFnQjtBQUNkQyx1QkFBVSxNQUFNTCxTQUFTTSxRQUFmLEdBQTBCekIsTUFBTVksR0FBTixDQUFVLFVBQVYsQ0FBcEMsTUFEYztBQUVkYyxzQkFBUyxNQUFNVCxTQUFOLEdBQWtCakIsTUFBTVksR0FBTixDQUFVLFVBQVYsQ0FBM0I7QUFGYyxlQUFoQjtBQUlBLHFCQUFLVCxNQUFMLENBQVl3QixJQUFaLENBQWlCTixJQUFqQjtBQUNBLHFCQUFLTyxRQUFMLENBQWNQLElBQWQsd0JBQXdDTCxHQUF4QztBQUNEO0FBQ0RDLHlCQUFhRSxTQUFTTSxRQUF0QjtBQUNELFdBWEQ7QUFSVTs7QUFNWixhQUFLLElBQUlULEdBQVQsSUFBZ0JMLE1BQWhCLEVBQXdCO0FBQUEsZ0JBQWZLLEdBQWU7QUFjdkI7QUFDRjtBQXBDSDs7QUFBQTtBQUFBLElBQW1DbkIsT0FBbkM7QUFzQ0QsQ0FqREQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL2dyYXBoL2xpZ2h0Z3JpZC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKVxuICBcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL2xpZ2h0Z3JpZC5odG1sJyksXG4gICAgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgTGlnaHRHcmlkVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uTW9kZWxDaGFuZ2UnXSlcbiAgICAgIHRoaXMuX3NwYW5zID0gW107XG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gJ2xpZ2h0cycpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcihtb2RlbCkge1xuICAgICAgY29uc3QgbGlnaHRzID0gbW9kZWwuZ2V0KCdsaWdodHMnKVxuICAgICAgd2hpbGUgKHRoaXMuX3NwYW5zLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX3NwYW5zLnBvcCgpKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQga2V5IGluIGxpZ2h0cykge1xuICAgICAgICBsZXQgdGltZWNvdW50ID0gMDtcbiAgICAgICAgbGlnaHRzW2tleV0uZm9yRWFjaCgoc3BhbkNvbmYpID0+IHtcbiAgICAgICAgICBpZiAoc3BhbkNvbmYuaW50ZW5zaXR5ID4gMCkge1xuICAgICAgICAgICAgbGV0IHNwYW4gPSBuZXcgRG9tVmlldyhgPHNwYW4gY2xhc3M9XCJsaWdodGdyaWRfX3NwYW5cIj4ke3NwYW5Db25mLmludGVuc2l0eX08L3NwYW4+YClcbiAgICAgICAgICAgIHNwYW4uJGRvbSgpLmNzcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiBgJHsxMDAgKiBzcGFuQ29uZi5kdXJhdGlvbiAvIG1vZGVsLmdldCgnZHVyYXRpb24nKX0lYCxcbiAgICAgICAgICAgICAgbGVmdDogYCR7MTAwICogdGltZWNvdW50IC8gbW9kZWwuZ2V0KCdkdXJhdGlvbicpfSVgXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5fc3BhbnMucHVzaChzcGFuKTtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoc3BhbiwgYC5saWdodGdyaWRfX3Jvd19fJHtrZXl9IC5saWdodGdyaWRfX3Jvd19faW50ZW5zaXRpZXNgKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aW1lY291bnQgKz0gc3BhbkNvbmYuZHVyYXRpb247XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG59KSJdfQ==
