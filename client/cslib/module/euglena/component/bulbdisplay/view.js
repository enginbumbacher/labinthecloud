'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./bulbdisplay.html'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals');

  require('link!./bulbdisplay.css');

  return function (_DomView) {
    _inherits(BulbDisplayView, _DomView);

    function BulbDisplayView(model, tmpl) {
      _classCallCheck(this, BulbDisplayView);

      var _this = _possibleConstructorReturn(this, (BulbDisplayView.__proto__ || Object.getPrototypeOf(BulbDisplayView)).call(this, tmpl || Template));

      _this.$el.find(".bulb-display__content").css({
        width: model.get('width'),
        height: model.get('height')
      });

      return _this;
    }

    _createClass(BulbDisplayView, [{
      key: 'render',
      value: function render(lights) {
        for (var key in lights) {
          this.$el.find('.bulb-display__' + key).css({ opacity: lights[key] / 100 });
        }
      }
    }]);

    return BulbDisplayView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9idWxiZGlzcGxheS92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJVdGlscyIsIkdsb2JhbHMiLCJtb2RlbCIsInRtcGwiLCIkZWwiLCJmaW5kIiwiY3NzIiwid2lkdGgiLCJnZXQiLCJoZWlnaHQiLCJsaWdodHMiLCJrZXkiLCJvcGFjaXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLHlCQUFSLENBRGI7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxVQUFVSixRQUFRLG9CQUFSLENBSFo7O0FBTUFBLFVBQVEsd0JBQVI7O0FBRUE7QUFBQTs7QUFDRSw2QkFBWUssS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxvSUFDakJBLFFBQVFKLFFBRFM7O0FBR3ZCLFlBQUtLLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHdCQUFkLEVBQXdDQyxHQUF4QyxDQUE0QztBQUMxQ0MsZUFBT0wsTUFBTU0sR0FBTixDQUFVLE9BQVYsQ0FEbUM7QUFFMUNDLGdCQUFRUCxNQUFNTSxHQUFOLENBQVUsUUFBVjtBQUZrQyxPQUE1Qzs7QUFIdUI7QUFReEI7O0FBVEg7QUFBQTtBQUFBLDZCQVdTRSxNQVhULEVBV2lCO0FBQ2IsYUFBSyxJQUFJQyxHQUFULElBQWdCRCxNQUFoQixFQUF3QjtBQUN0QixlQUFLTixHQUFMLENBQVNDLElBQVQsQ0FBYyxvQkFBb0JNLEdBQWxDLEVBQXVDTCxHQUF2QyxDQUEyQyxFQUFFTSxTQUFTRixPQUFPQyxHQUFQLElBQWMsR0FBekIsRUFBM0M7QUFDRDtBQUNGO0FBZkg7O0FBQUE7QUFBQSxJQUFxQ2IsT0FBckM7QUFpQkQsQ0ExQkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvY29tcG9uZW50L2J1bGJkaXNwbGF5L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL2J1bGJkaXNwbGF5Lmh0bWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKVxuICA7XG5cbiAgcmVxdWlyZSgnbGluayEuL2J1bGJkaXNwbGF5LmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBCdWxiRGlzcGxheVZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuYnVsYi1kaXNwbGF5X19jb250ZW50XCIpLmNzcyh7XG4gICAgICAgIHdpZHRoOiBtb2RlbC5nZXQoJ3dpZHRoJyksXG4gICAgICAgIGhlaWdodDogbW9kZWwuZ2V0KCdoZWlnaHQnKVxuICAgICAgfSlcblxuICAgIH1cblxuICAgIHJlbmRlcihsaWdodHMpIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBsaWdodHMpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmJ1bGItZGlzcGxheV9fJyArIGtleSkuY3NzKHsgb3BhY2l0eTogbGlnaHRzW2tleV0gLyAxMDAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl19
