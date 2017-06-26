'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Utils = require('core/util/utils'),
      Template = require('text!./videodisplay.html');

  return function (_DomView) {
    _inherits(VideoDisplayView, _DomView);

    function VideoDisplayView(model, tmpl) {
      _classCallCheck(this, VideoDisplayView);

      var _this = _possibleConstructorReturn(this, (VideoDisplayView.__proto__ || Object.getPrototypeOf(VideoDisplayView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange', '_onVideoMetaData', '_onVideoEnd', '_onVideoTick']);

      _this._video = _this.$el.find('.video-display__video');
      _this._video.on('loadedmetadata', _this._onVideoMetaData);
      _this._video.on('ended', _this._onVideoEnd);
      _this._video.on('timeupdate', _this._onVideoTick);

      _this._video.css({
        width: model.get('width'),
        height: model.get('height')
      });

      model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(VideoDisplayView, [{
      key: 'time',
      value: function time() {
        return this._runTime * this._video[0].currentTime / this._video[0].duration;
      }
    }, {
      key: 'start',
      value: function start() {
        this._video[0].play();
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.pause();
        this.seek(0);
      }
    }, {
      key: 'pause',
      value: function pause() {
        this._video[0].pause();
      }
    }, {
      key: 'seek',
      value: function seek(time) {
        this._video[0].currentTime = time;
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        var model = evt.currentTarget;
        switch (evt.data.path) {
          case "video":
            this._video.attr('src', evt.data.value);
            if (evt.data.value == null) {
              this._video.hide();
            } else {
              this._video.show();
            }
            break;
          case "runTime":
            this._runTime = evt.data.value;
            break;
        }
      }
    }, {
      key: '_onVideoMetaData',
      value: function _onVideoMetaData(jqevt) {
        this._video[0].playbackRate = this._video[0].duration / this._runTime;
        this.dispatchEvent('VideoDisplay.Ready', {}, true);
      }
    }, {
      key: '_onVideoTick',
      value: function _onVideoTick(jqevt) {
        var curr = this.time();
        if (this._lastTime && curr < this._lastTime) {
          this.dispatchEvent('TimerSource.Loop');
        }
        this._lastTime = curr;
      }
    }, {
      key: '_onVideoEnd',
      value: function _onVideoEnd(jqevt) {
        this.dispatchEvent('TimerSource.End');
      }
    }]);

    return VideoDisplayView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl92aWRlbyIsIiRlbCIsImZpbmQiLCJvbiIsIl9vblZpZGVvTWV0YURhdGEiLCJfb25WaWRlb0VuZCIsIl9vblZpZGVvVGljayIsImNzcyIsIndpZHRoIiwiZ2V0IiwiaGVpZ2h0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiX3J1blRpbWUiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwicGxheSIsInBhdXNlIiwic2VlayIsInRpbWUiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YSIsInBhdGgiLCJhdHRyIiwidmFsdWUiLCJoaWRlIiwic2hvdyIsImpxZXZ0IiwicGxheWJhY2tSYXRlIiwiZGlzcGF0Y2hFdmVudCIsImN1cnIiLCJfbGFzdFRpbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVdILFFBQVEsMEJBQVIsQ0FGYjs7QUFJQTtBQUFBOztBQUNFLDhCQUFZSSxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLHNJQUNqQkEsUUFBUUYsUUFEUzs7QUFFdkJELFlBQU1JLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQixrQkFBbkIsRUFBdUMsYUFBdkMsRUFBc0QsY0FBdEQsQ0FBeEI7O0FBRUEsWUFBS0MsTUFBTCxHQUFjLE1BQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHVCQUFkLENBQWQ7QUFDQSxZQUFLRixNQUFMLENBQVlHLEVBQVosQ0FBZSxnQkFBZixFQUFpQyxNQUFLQyxnQkFBdEM7QUFDQSxZQUFLSixNQUFMLENBQVlHLEVBQVosQ0FBZSxPQUFmLEVBQXdCLE1BQUtFLFdBQTdCO0FBQ0EsWUFBS0wsTUFBTCxDQUFZRyxFQUFaLENBQWUsWUFBZixFQUE2QixNQUFLRyxZQUFsQzs7QUFFQSxZQUFLTixNQUFMLENBQVlPLEdBQVosQ0FBZ0I7QUFDZEMsZUFBT1gsTUFBTVksR0FBTixDQUFVLE9BQVYsQ0FETztBQUVkQyxnQkFBUWIsTUFBTVksR0FBTixDQUFVLFFBQVY7QUFGTSxPQUFoQjs7QUFLQVosWUFBTWMsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0MsY0FBNUM7QUFkdUI7QUFleEI7O0FBaEJIO0FBQUE7QUFBQSw2QkFrQlM7QUFDTCxlQUFPLEtBQUtDLFFBQUwsR0FBZ0IsS0FBS2IsTUFBTCxDQUFZLENBQVosRUFBZWMsV0FBL0IsR0FBNkMsS0FBS2QsTUFBTCxDQUFZLENBQVosRUFBZWUsUUFBbkU7QUFDRDtBQXBCSDtBQUFBO0FBQUEsOEJBc0JVO0FBQ04sYUFBS2YsTUFBTCxDQUFZLENBQVosRUFBZWdCLElBQWY7QUFDRDtBQXhCSDtBQUFBO0FBQUEsNkJBMEJTO0FBQ0wsYUFBS0MsS0FBTDtBQUNBLGFBQUtDLElBQUwsQ0FBVSxDQUFWO0FBQ0Q7QUE3Qkg7QUFBQTtBQUFBLDhCQStCVTtBQUNOLGFBQUtsQixNQUFMLENBQVksQ0FBWixFQUFlaUIsS0FBZjtBQUNEO0FBakNIO0FBQUE7QUFBQSwyQkFtQ09FLElBbkNQLEVBbUNhO0FBQ1QsYUFBS25CLE1BQUwsQ0FBWSxDQUFaLEVBQWVjLFdBQWYsR0FBNkJLLElBQTdCO0FBQ0Q7QUFyQ0g7QUFBQTtBQUFBLHFDQXVDaUJDLEdBdkNqQixFQXVDc0I7QUFDbEIsWUFBTXZCLFFBQVF1QixJQUFJQyxhQUFsQjtBQUNBLGdCQUFRRCxJQUFJRSxJQUFKLENBQVNDLElBQWpCO0FBQ0UsZUFBSyxPQUFMO0FBQ0UsaUJBQUt2QixNQUFMLENBQVl3QixJQUFaLENBQWlCLEtBQWpCLEVBQXdCSixJQUFJRSxJQUFKLENBQVNHLEtBQWpDO0FBQ0EsZ0JBQUlMLElBQUlFLElBQUosQ0FBU0csS0FBVCxJQUFrQixJQUF0QixFQUE0QjtBQUMxQixtQkFBS3pCLE1BQUwsQ0FBWTBCLElBQVo7QUFDRCxhQUZELE1BRU87QUFDTCxtQkFBSzFCLE1BQUwsQ0FBWTJCLElBQVo7QUFDRDtBQUNIO0FBQ0EsZUFBSyxTQUFMO0FBQ0UsaUJBQUtkLFFBQUwsR0FBZ0JPLElBQUlFLElBQUosQ0FBU0csS0FBekI7QUFDRjtBQVhGO0FBYUQ7QUF0REg7QUFBQTtBQUFBLHVDQXdEbUJHLEtBeERuQixFQXdEMEI7QUFDdEIsYUFBSzVCLE1BQUwsQ0FBWSxDQUFaLEVBQWU2QixZQUFmLEdBQThCLEtBQUs3QixNQUFMLENBQVksQ0FBWixFQUFlZSxRQUFmLEdBQTBCLEtBQUtGLFFBQTdEO0FBQ0EsYUFBS2lCLGFBQUwsQ0FBbUIsb0JBQW5CLEVBQXlDLEVBQXpDLEVBQTZDLElBQTdDO0FBQ0Q7QUEzREg7QUFBQTtBQUFBLG1DQTZEZUYsS0E3RGYsRUE2RHNCO0FBQ2xCLFlBQU1HLE9BQU8sS0FBS1osSUFBTCxFQUFiO0FBQ0EsWUFBSSxLQUFLYSxTQUFMLElBQWtCRCxPQUFPLEtBQUtDLFNBQWxDLEVBQTZDO0FBQzNDLGVBQUtGLGFBQUwsQ0FBbUIsa0JBQW5CO0FBQ0Q7QUFDRCxhQUFLRSxTQUFMLEdBQWlCRCxJQUFqQjtBQUNEO0FBbkVIO0FBQUE7QUFBQSxrQ0FvRWNILEtBcEVkLEVBb0VxQjtBQUNqQixhQUFLRSxhQUFMLENBQW1CLGlCQUFuQjtBQUNEO0FBdEVIOztBQUFBO0FBQUEsSUFBc0NwQyxPQUF0QztBQXdFRCxDQTdFRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlkZW9kaXNwbGF5L3ZpZXcuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
