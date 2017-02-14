'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./lightdisplay.html'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      EuglenaDisplay = require('euglena/component/euglenadisplay/euglenadisplay')
  // Button = require('core/component/button/field')
  ;

  require('link!./lightdisplay.css');

  return function (_DomView) {
    _inherits(LightDisplayView, _DomView);

    function LightDisplayView(model, tmpl) {
      _classCallCheck(this, LightDisplayView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LightDisplayView).call(this, tmpl || Template));

      _this.$el.find(".light-display__content").css({
        width: model.get('width'),
        height: model.get('height')
      });

      // this.euglena = EuglenaDisplay.create(model.get('euglenaDisplay'));
      // this.addChild(this.euglena.view(), ".light-display__content");

      // this.playPauseButton = Button.create({
      //   id: "playPause",
      //   label: "Pause",
      //   eventName: "LightDisplay.PlayPauseRequest",
      //   style: "light-display__control__toggle"
      // });
      // this.addEventListener('LightDisplay.PlayPauseRequest', this._onPlayPauseRequest);
      // this.addChild(this.playPauseButton.view(), ".light-display__control")
      return _this;
    }

    _createClass(LightDisplayView, [{
      key: 'render',
      value: function render(lights) {
        for (var key in lights) {
          this.$el.find('.light-display__' + key).css({ opacity: lights[key] / 100 });
        }
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        switch (evt.data.path) {
          // case "video":
          //   if (evt.data.value) {
          //     this.video = $("<video>")
          //       .attr('src', evt.data.value)
          //       .prop('autoplay', true)
          //       .prop('loop', true);
          //     this.video.on('loadedmetadata', (jqevt) => {
          //       this.video[0].playbackRate = this.video[0].duration / evt.currentTarget.get('runTime')
          //     })
          //     this.$el.find('.light-display__content').append(this.video);
          //     this.active = true;
          //     window.requestAnimationFrame(this._onTick);
          //   } else {
          //     this.active = false;
          //     if (this.video) {
          //       this.video.remove();
          //       this.video = null;
          //     }
          //   }
          //   break;
          case "runTime":
            this._runTime = evt.data.value;
            break;
        }
      }
    }]);

    return LightDisplayView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLFVBQVUsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0UsV0FBVyxRQUFRLDBCQUFSLENBRGI7QUFBQSxNQUVFLFFBQVEsUUFBUSxpQkFBUixDQUZWO0FBQUEsTUFHRSxVQUFVLFFBQVEsb0JBQVIsQ0FIWjtBQUFBLE1BSUUsaUJBQWlCLFFBQVEsaURBQVI7O0FBSm5COztBQVFBLFVBQVEseUJBQVI7O0FBRUE7QUFBQTs7QUFDRSw4QkFBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsc0dBQ2pCLFFBQVEsUUFEUzs7QUFHdkIsWUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLHlCQUFkLEVBQXlDLEdBQXpDLENBQTZDO0FBQzNDLGVBQU8sTUFBTSxHQUFOLENBQVUsT0FBVixDQURvQztBQUUzQyxnQkFBUSxNQUFNLEdBQU4sQ0FBVSxRQUFWO0FBRm1DLE9BQTdDOzs7Ozs7Ozs7Ozs7O0FBSHVCO0FBbUJ4Qjs7QUFwQkg7QUFBQTtBQUFBLDZCQXNCUyxNQXRCVCxFQXNCaUI7QUFDYixhQUFLLElBQUksR0FBVCxJQUFnQixNQUFoQixFQUF3QjtBQUN0QixlQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMscUJBQXFCLEdBQW5DLEVBQXdDLEdBQXhDLENBQTRDLEVBQUUsU0FBUyxPQUFPLEdBQVAsSUFBYyxHQUF6QixFQUE1QztBQUNEO0FBQ0Y7QUExQkg7QUFBQTtBQUFBLHFDQTRCaUIsR0E1QmpCLEVBNEJzQjtBQUNsQixnQkFBUSxJQUFJLElBQUosQ0FBUyxJQUFqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJFLGVBQUssU0FBTDtBQUNFLGlCQUFLLFFBQUwsR0FBZ0IsSUFBSSxJQUFKLENBQVMsS0FBekI7QUFDQTtBQXZCSjtBQXlCRDtBQXRESDs7QUFBQTtBQUFBLElBQXNDLE9BQXRDO0FBd0RELENBbkVEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2NvbXBvbmVudC9saWdodGRpc3BsYXkvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
