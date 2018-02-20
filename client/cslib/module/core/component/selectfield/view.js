'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseFieldView = require('core/component/form/field/view'),
      OptionView = require('./optionview'),
      Utils = require('core/util/utils'),
      Template = require('text!./selectfield.html');

  return function (_BaseFieldView) {
    _inherits(SelectFieldView, _BaseFieldView);

    function SelectFieldView(model, tmpl) {
      _classCallCheck(this, SelectFieldView);

      var _this = _possibleConstructorReturn(this, (SelectFieldView.__proto__ || Object.getPrototypeOf(SelectFieldView)).call(this, model, tmpl ? tmpl : Template));

      Utils.bindMethods(_this, ['_onFieldChange', '_onModelChange']);

      _this._options = {};
      if (model.get('color')) _this.$el.find('.selectfield__label').css('color', model.get('color'));
      //if (model.get('inverse_order')) { this.$el.find(".selectfield__label").remove().insertAfter(this.$el.find(".selectfield__select"));}

      _this._render(model);

      _this.$el.find(".selectfield__select").on('change', _this._onFieldChange);
      _this.$el.find(".selectfield__select").css({ 'font-size': '12px' });
      return _this;
    }

    _createClass(SelectFieldView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(SelectFieldView.prototype.__proto__ || Object.getPrototypeOf(SelectFieldView.prototype), '_onModelChange', this).call(this, evt);
        if (evt.data.path == 'disabledOptions') {
          Object.values(this._options).forEach(function (opt) {
            if (evt.data.value.includes(opt.id())) {
              opt.disable();
              opt.hide();
            } else {
              opt.show();
              opt.enable();
            }
          });
        } else {
          this._render(evt.currentTarget);
        }
      }
    }, {
      key: '_onFieldChange',
      value: function _onFieldChange(jqevt) {
        this.dispatchEvent('Field.ValueChange', {
          value: this.$el.find(".selectfield__select").val()
        });
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.selectfield__select').prop('disabled', true);
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.$el.find('.selectfield__select').prop('disabled', false);
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.$el.find('.selectfield__select').focus();
      }
    }, {
      key: '_render',
      value: function _render(model) {
        this.$el.find('.selectfield__label').html(model.get('label'));
        for (var optId in this._options) {
          if (!Object.keys(model.get('options')).includes(optId)) {
            this.removeChild(this._options[optId]);
            delete this._options[optId];
          }
        }
        for (var id in model.get('options')) {
          var label = null;
          if (parseInt(id + 1)) {
            // if no key is given in the options, but just an array of values
            label = model.get('options')[id];
            id = model.get('options')[id];
          } else {
            label = model.get('options')[id];
          }
          if (!this._options[id]) {
            this._options[id] = new OptionView({
              id: id,
              label: label,
              selected: model.value() == id
            });
            this.addChild(this._options[id], ".selectfield__select");
          } else {
            this._options[id].select(model.value() == id);
          }
        }
        if (model.get('disabled')) {
          this.disable();
        } else {
          this.enable();
        }
      }
    }]);

    return SelectFieldView;
  }(BaseFieldView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJCYXNlRmllbGRWaWV3IiwiT3B0aW9uVmlldyIsIlV0aWxzIiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsIl9vcHRpb25zIiwiZ2V0IiwiJGVsIiwiZmluZCIsImNzcyIsIl9yZW5kZXIiLCJvbiIsIl9vbkZpZWxkQ2hhbmdlIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmb3JFYWNoIiwib3B0IiwidmFsdWUiLCJpbmNsdWRlcyIsImlkIiwiZGlzYWJsZSIsImhpZGUiLCJzaG93IiwiZW5hYmxlIiwiY3VycmVudFRhcmdldCIsImpxZXZ0IiwiZGlzcGF0Y2hFdmVudCIsInZhbCIsInByb3AiLCJmb2N1cyIsImh0bWwiLCJvcHRJZCIsImtleXMiLCJyZW1vdmVDaGlsZCIsImxhYmVsIiwicGFyc2VJbnQiLCJzZWxlY3RlZCIsImFkZENoaWxkIiwic2VsZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsZ0JBQWdCRCxRQUFRLGdDQUFSLENBQXRCO0FBQUEsTUFDRUUsYUFBYUYsUUFBUSxjQUFSLENBRGY7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxXQUFXSixRQUFRLHlCQUFSLENBSGI7O0FBTUE7QUFBQTs7QUFDRSw2QkFBWUssS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxvSUFDakJELEtBRGlCLEVBQ1ZDLE9BQU9BLElBQVAsR0FBY0YsUUFESjs7QUFFdkJELFlBQU1JLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQixnQkFBbkIsQ0FBeEI7O0FBRUEsWUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLFVBQUlILE1BQU1JLEdBQU4sQ0FBVSxPQUFWLENBQUosRUFBd0IsTUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMscUJBQWQsRUFBcUNDLEdBQXJDLENBQXlDLE9BQXpDLEVBQWtEUCxNQUFNSSxHQUFOLENBQVUsT0FBVixDQUFsRDtBQUN4Qjs7QUFFQSxZQUFLSSxPQUFMLENBQWFSLEtBQWI7O0FBRUEsWUFBS0ssR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0NHLEVBQXRDLENBQXlDLFFBQXpDLEVBQW1ELE1BQUtDLGNBQXhEO0FBQ0EsWUFBS0wsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0NDLEdBQXRDLENBQTBDLEVBQUMsYUFBWSxNQUFiLEVBQTFDO0FBWHVCO0FBWXhCOztBQWJIO0FBQUE7QUFBQSxxQ0FlaUJJLEdBZmpCLEVBZXNCO0FBQ2xCLHlJQUFxQkEsR0FBckI7QUFDQSxZQUFJQSxJQUFJQyxJQUFKLENBQVNDLElBQVQsSUFBaUIsaUJBQXJCLEVBQXdDO0FBQ3RDQyxpQkFBT0MsTUFBUCxDQUFjLEtBQUtaLFFBQW5CLEVBQTZCYSxPQUE3QixDQUFxQyxVQUFDQyxHQUFELEVBQVM7QUFDNUMsZ0JBQUlOLElBQUlDLElBQUosQ0FBU00sS0FBVCxDQUFlQyxRQUFmLENBQXdCRixJQUFJRyxFQUFKLEVBQXhCLENBQUosRUFBdUM7QUFDckNILGtCQUFJSSxPQUFKO0FBQ0FKLGtCQUFJSyxJQUFKO0FBQ0QsYUFIRCxNQUdPO0FBQ0xMLGtCQUFJTSxJQUFKO0FBQ0FOLGtCQUFJTyxNQUFKO0FBQ0Q7QUFDRixXQVJEO0FBU0QsU0FWRCxNQVVPO0FBQ0wsZUFBS2hCLE9BQUwsQ0FBYUcsSUFBSWMsYUFBakI7QUFDRDtBQUNGO0FBOUJIO0FBQUE7QUFBQSxxQ0FnQ2lCQyxLQWhDakIsRUFnQ3dCO0FBQ3BCLGFBQUtDLGFBQUwsQ0FBbUIsbUJBQW5CLEVBQXdDO0FBQ3RDVCxpQkFBTyxLQUFLYixHQUFMLENBQVNDLElBQVQsQ0FBYyxzQkFBZCxFQUFzQ3NCLEdBQXRDO0FBRCtCLFNBQXhDO0FBR0Q7QUFwQ0g7QUFBQTtBQUFBLGdDQXNDWTtBQUNSLGFBQUt2QixHQUFMLENBQVNDLElBQVQsQ0FBYyxzQkFBZCxFQUFzQ3VCLElBQXRDLENBQTJDLFVBQTNDLEVBQXVELElBQXZEO0FBQ0Q7QUF4Q0g7QUFBQTtBQUFBLCtCQTBDVztBQUNQLGFBQUt4QixHQUFMLENBQVNDLElBQVQsQ0FBYyxzQkFBZCxFQUFzQ3VCLElBQXRDLENBQTJDLFVBQTNDLEVBQXVELEtBQXZEO0FBQ0Q7QUE1Q0g7QUFBQTtBQUFBLDhCQThDVTtBQUNOLGFBQUt4QixHQUFMLENBQVNDLElBQVQsQ0FBYyxzQkFBZCxFQUFzQ3dCLEtBQXRDO0FBQ0Q7QUFoREg7QUFBQTtBQUFBLDhCQWtEVTlCLEtBbERWLEVBa0RpQjtBQUNiLGFBQUtLLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHFCQUFkLEVBQXFDeUIsSUFBckMsQ0FBMEMvQixNQUFNSSxHQUFOLENBQVUsT0FBVixDQUExQztBQUNBLGFBQUssSUFBSTRCLEtBQVQsSUFBa0IsS0FBSzdCLFFBQXZCLEVBQWlDO0FBQy9CLGNBQUksQ0FBQ1csT0FBT21CLElBQVAsQ0FBWWpDLE1BQU1JLEdBQU4sQ0FBVSxTQUFWLENBQVosRUFBa0NlLFFBQWxDLENBQTJDYSxLQUEzQyxDQUFMLEVBQXdEO0FBQ3RELGlCQUFLRSxXQUFMLENBQWlCLEtBQUsvQixRQUFMLENBQWM2QixLQUFkLENBQWpCO0FBQ0EsbUJBQU8sS0FBSzdCLFFBQUwsQ0FBYzZCLEtBQWQsQ0FBUDtBQUNEO0FBQ0Y7QUFDRCxhQUFLLElBQUlaLEVBQVQsSUFBZXBCLE1BQU1JLEdBQU4sQ0FBVSxTQUFWLENBQWYsRUFBcUM7QUFDbkMsY0FBSStCLFFBQVEsSUFBWjtBQUNBLGNBQUlDLFNBQVNoQixLQUFLLENBQWQsQ0FBSixFQUFzQjtBQUFFO0FBQ3RCZSxvQkFBUW5DLE1BQU1JLEdBQU4sQ0FBVSxTQUFWLEVBQXFCZ0IsRUFBckIsQ0FBUjtBQUNBQSxpQkFBS3BCLE1BQU1JLEdBQU4sQ0FBVSxTQUFWLEVBQXFCZ0IsRUFBckIsQ0FBTDtBQUNELFdBSEQsTUFHTztBQUNMZSxvQkFBUW5DLE1BQU1JLEdBQU4sQ0FBVSxTQUFWLEVBQXFCZ0IsRUFBckIsQ0FBUjtBQUNEO0FBQ0QsY0FBSSxDQUFDLEtBQUtqQixRQUFMLENBQWNpQixFQUFkLENBQUwsRUFBd0I7QUFDdEIsaUJBQUtqQixRQUFMLENBQWNpQixFQUFkLElBQW9CLElBQUl2QixVQUFKLENBQWU7QUFDakN1QixrQkFBSUEsRUFENkI7QUFFakNlLHFCQUFPQSxLQUYwQjtBQUdqQ0Usd0JBQVVyQyxNQUFNa0IsS0FBTixNQUFpQkU7QUFITSxhQUFmLENBQXBCO0FBS0EsaUJBQUtrQixRQUFMLENBQWMsS0FBS25DLFFBQUwsQ0FBY2lCLEVBQWQsQ0FBZCxFQUFpQyxzQkFBakM7QUFDRCxXQVBELE1BT087QUFDTCxpQkFBS2pCLFFBQUwsQ0FBY2lCLEVBQWQsRUFBa0JtQixNQUFsQixDQUF5QnZDLE1BQU1rQixLQUFOLE1BQWlCRSxFQUExQztBQUNEO0FBQ0Y7QUFDRCxZQUFJcEIsTUFBTUksR0FBTixDQUFVLFVBQVYsQ0FBSixFQUEyQjtBQUN6QixlQUFLaUIsT0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUtHLE1BQUw7QUFDRDtBQUNGO0FBbEZIOztBQUFBO0FBQUEsSUFBcUM1QixhQUFyQztBQW9GRCxDQTNGRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBCYXNlRmllbGRWaWV3ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC92aWV3JyksXG4gICAgT3B0aW9uVmlldyA9IHJlcXVpcmUoJy4vb3B0aW9udmlldycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vc2VsZWN0ZmllbGQuaHRtbCcpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgU2VsZWN0RmllbGRWaWV3IGV4dGVuZHMgQmFzZUZpZWxkVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKG1vZGVsLCB0bXBsID8gdG1wbCA6IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uRmllbGRDaGFuZ2UnLCAnX29uTW9kZWxDaGFuZ2UnXSk7XG5cbiAgICAgIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgICAgaWYgKG1vZGVsLmdldCgnY29sb3InKSkgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19sYWJlbCcpLmNzcygnY29sb3InLCBtb2RlbC5nZXQoJ2NvbG9yJykpO1xuICAgICAgLy9pZiAobW9kZWwuZ2V0KCdpbnZlcnNlX29yZGVyJykpIHsgdGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fbGFiZWxcIikucmVtb3ZlKCkuaW5zZXJ0QWZ0ZXIodGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpKTt9XG5cbiAgICAgIHRoaXMuX3JlbmRlcihtb2RlbCk7XG5cbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5vbignY2hhbmdlJywgdGhpcy5fb25GaWVsZENoYW5nZSlcbiAgICAgIHRoaXMuJGVsLmZpbmQoXCIuc2VsZWN0ZmllbGRfX3NlbGVjdFwiKS5jc3Moeydmb250LXNpemUnOicxMnB4J30pXG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBzdXBlci5fb25Nb2RlbENoYW5nZShldnQpO1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gJ2Rpc2FibGVkT3B0aW9ucycpIHtcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9vcHRpb25zKS5mb3JFYWNoKChvcHQpID0+IHtcbiAgICAgICAgICBpZiAoZXZ0LmRhdGEudmFsdWUuaW5jbHVkZXMob3B0LmlkKCkpKSB7XG4gICAgICAgICAgICBvcHQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgb3B0LmhpZGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0LnNob3coKTtcbiAgICAgICAgICAgIG9wdC5lbmFibGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW5kZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkZpZWxkQ2hhbmdlKGpxZXZ0KSB7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLlZhbHVlQ2hhbmdlJywge1xuICAgICAgICB2YWx1ZTogdGhpcy4kZWwuZmluZChcIi5zZWxlY3RmaWVsZF9fc2VsZWN0XCIpLnZhbCgpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkaXNhYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgIH1cblxuICAgIGZvY3VzKCkge1xuICAgICAgdGhpcy4kZWwuZmluZCgnLnNlbGVjdGZpZWxkX19zZWxlY3QnKS5mb2N1cygpO1xuICAgIH1cblxuICAgIF9yZW5kZXIobW9kZWwpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5zZWxlY3RmaWVsZF9fbGFiZWwnKS5odG1sKG1vZGVsLmdldCgnbGFiZWwnKSk7XG4gICAgICBmb3IgKGxldCBvcHRJZCBpbiB0aGlzLl9vcHRpb25zKSB7XG4gICAgICAgIGlmICghT2JqZWN0LmtleXMobW9kZWwuZ2V0KCdvcHRpb25zJykpLmluY2x1ZGVzKG9wdElkKSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5fb3B0aW9uc1tvcHRJZF0pO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9vcHRpb25zW29wdElkXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaWQgaW4gbW9kZWwuZ2V0KCdvcHRpb25zJykpIHtcbiAgICAgICAgbGV0IGxhYmVsID0gbnVsbDtcbiAgICAgICAgaWYgKHBhcnNlSW50KGlkICsgMSkpIHsgLy8gaWYgbm8ga2V5IGlzIGdpdmVuIGluIHRoZSBvcHRpb25zLCBidXQganVzdCBhbiBhcnJheSBvZiB2YWx1ZXNcbiAgICAgICAgICBsYWJlbCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgICBpZCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsYWJlbCA9IG1vZGVsLmdldCgnb3B0aW9ucycpW2lkXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX29wdGlvbnNbaWRdKSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0gPSBuZXcgT3B0aW9uVmlldyh7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICBzZWxlY3RlZDogbW9kZWwudmFsdWUoKSA9PSBpZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fb3B0aW9uc1tpZF0sIFwiLnNlbGVjdGZpZWxkX19zZWxlY3RcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9uc1tpZF0uc2VsZWN0KG1vZGVsLnZhbHVlKCkgPT0gaWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KTtcbiJdfQ==
