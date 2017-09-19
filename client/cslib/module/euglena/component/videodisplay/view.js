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
        if (this._video[0].duration) {
          this._video[0].currentTime = time * this._video[0].duration / this._runTime;
        } else {
          this._video[0].currentTime = 0;
        }
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
          case "showVideo":
            if (evt.data.value) {
              this._video.css({ display: 'inline' });
            } else {
              this._video.css({ display: 'none' });
            }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC92aWRlb2Rpc3BsYXkvdmlldy5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiRG9tVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl92aWRlbyIsIiRlbCIsImZpbmQiLCJvbiIsIl9vblZpZGVvTWV0YURhdGEiLCJfb25WaWRlb0VuZCIsIl9vblZpZGVvVGljayIsImNzcyIsIndpZHRoIiwiZ2V0IiwiaGVpZ2h0IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk1vZGVsQ2hhbmdlIiwiX3J1blRpbWUiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwicGxheSIsInBhdXNlIiwic2VlayIsInRpbWUiLCJldnQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YSIsInBhdGgiLCJhdHRyIiwidmFsdWUiLCJoaWRlIiwic2hvdyIsImRpc3BsYXkiLCJqcWV2dCIsInBsYXliYWNrUmF0ZSIsImRpc3BhdGNoRXZlbnQiLCJjdXJyIiwiX2xhc3RUaW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxXQUFXSCxRQUFRLDBCQUFSLENBRmI7O0FBSUE7QUFBQTs7QUFDRSw4QkFBWUksS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxzSUFDakJBLFFBQVFGLFFBRFM7O0FBRXZCRCxZQUFNSSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsa0JBQW5CLEVBQXVDLGFBQXZDLEVBQXNELGNBQXRELENBQXhCOztBQUVBLFlBQUtDLE1BQUwsR0FBYyxNQUFLQyxHQUFMLENBQVNDLElBQVQsQ0FBYyx1QkFBZCxDQUFkO0FBQ0EsWUFBS0YsTUFBTCxDQUFZRyxFQUFaLENBQWUsZ0JB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QWtCRCxPQUFPLEtBQUtDLFNBQWxDLEVBQTZDO0FBQzNDLGVBQUtGLGFBQUwsQ0FBbUIsa0JBQW5CO0FBQ0Q7QUFDRCxhQUFLRSxTQUFMLEdBQWlCRCxJQUFqQjtBQUNEO0FBM0VIO0FBQUE7QUFBQSxrQ0E0RWNILEtBNUVkLEVBNEVxQjtBQUNqQixhQUFLRSxhQUFMLENBQW1CLGlCQUFuQjtBQUNEO0FBOUVIOztBQUFBO0FBQUEsSUFBc0NyQyxPQUF0QztBQWdGRCxDQXJGRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9jb21wb25lbnQvdmlkZW9kaXNwbGF5L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vdmlkZW9kaXNwbGF5Lmh0bWwnKTtcblxuICByZXR1cm4gY2xhc3MgVmlkZW9EaXNwbGF5VmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uTW9kZWxDaGFuZ2UnLCAnX29uVmlkZW9NZXRhRGF0YScsICdfb25WaWRlb0VuZCcsICdfb25WaWRlb1RpY2snXSk7XG5cbiAgICAgIHRoaXMuX3ZpZGVvID0gdGhpcy4kZWwuZmluZCgnLnZpZGVvLWRpc3BsYXlfX3ZpZGVvJyk7XG4gICAgICB0aGlzLl92aWRlby5vbignbG9hZGVkbWV0YWRhdGEnLCB0aGlzLl9vblZpZGVvTWV0YURhdGEpXG4gICAgICB0aGlzLl92aWRlby5vbignZW5kZWQnLCB0aGlzLl9vblZpZGVvRW5kKTtcbiAgICAgIHRoaXMuX3ZpZGVvLm9uKCd0aW1ldXBkYXRlJywgdGhpcy5fb25WaWRlb1RpY2spO1xuXG4gICAgICB0aGlzLl92aWRlby5jc3Moe1xuICAgICAgICB3aWR0aDogbW9kZWwuZ2V0KCd3aWR0aCcpLFxuICAgICAgICBoZWlnaHQ6IG1vZGVsLmdldCgnaGVpZ2h0JylcbiAgICAgIH0pXG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpO1xuICAgIH1cblxuICAgIHRpbWUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcnVuVGltZSAqIHRoaXMuX3ZpZGVvWzBdLmN1cnJlbnRUaW1lIC8gdGhpcy5fdmlkZW9bMF0uZHVyYXRpb247XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICB0aGlzLl92aWRlb1swXS5wbGF5KCk7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgIHRoaXMuc2VlaygwKTtcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgIHRoaXMuX3ZpZGVvWzBdLnBhdXNlKClcbiAgICB9XG5cbiAgICBzZWVrKHRpbWUpIHtcbiAgICAgIGlmICh0aGlzLl92aWRlb1swXS5kdXJhdGlvbikge1xuICAgICAgICB0aGlzLl92aWRlb1swXS5jdXJyZW50VGltZSA9IHRpbWUgKiB0aGlzLl92aWRlb1swXS5kdXJhdGlvbiAvIHRoaXMuX3J1blRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl92aWRlb1swXS5jdXJyZW50VGltZSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBjb25zdCBtb2RlbCA9IGV2dC5jdXJyZW50VGFyZ2V0O1xuICAgICAgc3dpdGNoIChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgXCJ2aWRlb1wiOlxuICAgICAgICAgIHRoaXMuX3ZpZGVvLmF0dHIoJ3NyYycsIGV2dC5kYXRhLnZhbHVlKTtcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlkZW8uaGlkZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92aWRlby5zaG93KCk7XG4gICAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJ1blRpbWVcIjpcbiAgICAgICAgICB0aGlzLl9ydW5UaW1lID0gZXZ0LmRhdGEudmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2hvd1ZpZGVvXCI6XG4gICAgICAgICAgaWYgKGV2dC5kYXRhLnZhbHVlKSB7IHRoaXMuX3ZpZGVvLmNzcyh7ZGlzcGxheTogJ2lubGluZSd9KTt9XG4gICAgICAgICAgZWxzZSB7IHRoaXMuX3ZpZGVvLmNzcyh7ZGlzcGxheTogJ25vbmUnfSk7IH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uVmlkZW9NZXRhRGF0YShqcWV2dCkge1xuICAgICAgdGhpcy5fdmlkZW9bMF0ucGxheWJhY2tSYXRlID0gdGhpcy5fdmlkZW9bMF0uZHVyYXRpb24gLyB0aGlzLl9ydW5UaW1lO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdWaWRlb0Rpc3BsYXkuUmVhZHknLCB7fSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgX29uVmlkZW9UaWNrKGpxZXZ0KSB7XG4gICAgICBjb25zdCBjdXJyID0gdGhpcy50aW1lKCk7XG4gICAgICBpZiAodGhpcy5fbGFzdFRpbWUgJiYgY3VyciA8IHRoaXMuX2xhc3RUaW1lKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnVGltZXJTb3VyY2UuTG9vcCcpO1xuICAgICAgfVxuICAgICAgdGhpcy5fbGFzdFRpbWUgPSBjdXJyO1xuICAgIH1cbiAgICBfb25WaWRlb0VuZChqcWV2dCkge1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdUaW1lclNvdXJjZS5FbmQnKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
