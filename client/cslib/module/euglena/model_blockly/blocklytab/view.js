'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var $ = require('jquery');

  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var DomView = require('core/view/dom_view'),
      Template = require('text!./tab.html');

  require('link!./style.css');

  return function (_DomView) {
    _inherits(ModelingTabView, _DomView);

    function ModelingTabView(model, tmpl) {
      _classCallCheck(this, ModelingTabView);

      var _this = _possibleConstructorReturn(this, (ModelingTabView.__proto__ || Object.getPrototypeOf(ModelingTabView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onTabClick', '_onModelChange', '_onTransitionEnd']);

      model.addEventListener('Model.Change', _this._onModelChange);

      if (!Globals.get('AppConfig.system.expModelModality').match('justmodel|justbody')) {
        _this.$el.find('.modeling__tab').on('click', _this._onTabClick);
      } else {
        _this.$el.find('.modeling__tab').css('display', 'none');
        _this.$el.find('.modeling').css('visibility', 'hidden');
      }
      _this.$el[0].addEventListener('transitionend', _this._onTransitionEnd);
      _this.disableFields();
      return _this;
    }

    _createClass(ModelingTabView, [{
      key: '_onTransitionEnd',
      value: function _onTransitionEnd(evt) {
        Globals.get('Relay').dispatchEvent('ModelingTab.TransitionEnd', { type: 'model' }, true);
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.$el.find('.modeling__tab').off('click');
      }
    }, {
      key: 'enable',
      value: function enable() {
        if (!Globals.get('AppConfig.system.expModelModality').match('justmodel|justbody')) {
          this.$el.find('.modeling__tab').on('click', this._onTabClick);
        }
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "open") {
          this.$el.toggleClass('modeling__open', evt.data.value);
          this.updateFieldStatus(evt.currentTarget);
        }
      }
    }, {
      key: 'updateFieldStatus',
      value: function updateFieldStatus(model) {
        if (model.get('open')) {
          this.enableFields();
        } else {
          this.disableFields();
        }
      }
    }, {
      key: 'enableFields',
      value: function enableFields() {
        //this._graphSelect.enable();
        this.$el.find('input, button').removeProp('disabled');
      }
    }, {
      key: 'disableFields',
      value: function disableFields() {
        //this._graphSelect.disable();
        this.$el.find('input, button').prop('disabled', true);
      }
    }, {
      key: '_onTabClick',
      value: function _onTabClick(jqevt) {
        Globals.get('Relay').dispatchEvent('ModelingTab.ToggleRequest', { tabType: 'blockly' }, true);
      }
    }, {
      key: 'toggle',
      value: function toggle(tabOpen) {
        if (tabOpen) {
          this.$el.find('#selectModeling').removeClass('notflippedY');
          this.$el.find('#selectModeling').addClass('flippedY');
        } else {
          this.$el.find('#selectModeling').removeClass('flippedY');
          this.$el.find('#selectModeling').addClass('notflippedY');
        }
      }
    }]);

    return ModelingTabView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCIkIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsImdldCIsIm1hdGNoIiwiJGVsIiwiZmluZCIsIm9uIiwiX29uVGFiQ2xpY2siLCJjc3MiLCJfb25UcmFuc2l0aW9uRW5kIiwiZGlzYWJsZUZpZWxkcyIsImV2dCIsImRpc3BhdGNoRXZlbnQiLCJ0eXBlIiwib2ZmIiwiZGF0YSIsInBhdGgiLCJ0b2dnbGVDbGFzcyIsInZhbHVlIiwidXBkYXRlRmllbGRTdGF0dXMiLCJjdXJyZW50VGFyZ2V0IiwiZW5hYmxlRmllbGRzIiwicmVtb3ZlUHJvcCIsInByb3AiLCJqcWV2dCIsInRhYlR5cGUiLCJ0YWJPcGVuIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxJQUFJRCxRQUFRLFFBQVIsQ0FBVjs7QUFFQSxNQUFNRSxRQUFRRixRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRyxVQUFVSCxRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFSSxLQUFLSixRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUssVUFBVUwsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VNLFdBQVdOLFFBQVEsaUJBQVIsQ0FEYjs7QUFHQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDZCQUFZTyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkEsUUFBUUYsUUFEUzs7QUFFdkJKLFlBQU1PLFdBQU4sUUFBd0IsQ0FDdEIsYUFEc0IsRUFDUCxnQkFETyxFQUNVLGtC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TUFHTztBQUNMLGVBQUt4QixHQUFMLENBQVNDLElBQVQsQ0FBYyxpQkFBZCxFQUFpQ3NCLFdBQWpDLENBQTZDLFVBQTdDO0FBQ0EsZUFBS3ZCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGlCQUFkLEVBQWlDdUIsUUFBakMsQ0FBMEMsYUFBMUM7QUFDRDtBQUNGO0FBckVIOztBQUFBO0FBQUEsSUFBcUNqQyxPQUFyQztBQXVFRCxDQW5GRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2Jsb2NrbHl0YWIvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi90YWIuaHRtbCcpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgTW9kZWxpbmdUYWJWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uVGFiQ2xpY2snLCAnX29uTW9kZWxDaGFuZ2UnLCdfb25UcmFuc2l0aW9uRW5kJ10pXG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpXG5cbiAgICAgIGlmICghKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKS5tYXRjaCgnanVzdG1vZGVsfGp1c3Rib2R5JykpKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5tb2RlbGluZ19fdGFiJykub24oJ2NsaWNrJyx0aGlzLl9vblRhYkNsaWNrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5tb2RlbGluZ19fdGFiJykuY3NzKCdkaXNwbGF5Jywnbm9uZScpXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5tb2RlbGluZycpLmNzcygndmlzaWJpbGl0eScsJ2hpZGRlbicpXG4gICAgICB9XG4gICAgICB0aGlzLiRlbFswXS5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdGhpcy5fb25UcmFuc2l0aW9uRW5kKVxuICAgICAgdGhpcy5kaXNhYmxlRmllbGRzKCk7XG4gICAgfVxuXG4gICAgX29uVHJhbnNpdGlvbkVuZChldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsaW5nVGFiLlRyYW5zaXRpb25FbmQnLCB7dHlwZTogJ21vZGVsJ30sIHRydWUpO1xuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcubW9kZWxpbmdfX3RhYicpLm9mZignY2xpY2snKTtcbiAgICB9XG5cbiAgICBlbmFibGUoKSB7XG4gICAgICBpZiAoIShHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5JykubWF0Y2goJ2p1c3Rtb2RlbHxqdXN0Ym9keScpKSkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcubW9kZWxpbmdfX3RhYicpLm9uKCdjbGljaycsdGhpcy5fb25UYWJDbGljayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uTW9kZWxDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGF0aCA9PSBcIm9wZW5cIikge1xuICAgICAgICB0aGlzLiRlbC50b2dnbGVDbGFzcygnbW9kZWxpbmdfX29wZW4nLCBldnQuZGF0YS52YWx1ZSlcbiAgICAgICAgdGhpcy51cGRhdGVGaWVsZFN0YXR1cyhldnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICB9XG5cbiAgICB1cGRhdGVGaWVsZFN0YXR1cyhtb2RlbCkge1xuICAgICAgaWYgKG1vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRmllbGRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc2FibGVGaWVsZHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVGaWVsZHMoKSB7XG4gICAgICAvL3RoaXMuX2dyYXBoU2VsZWN0LmVuYWJsZSgpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnaW5wdXQsIGJ1dHRvbicpLnJlbW92ZVByb3AoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgZGlzYWJsZUZpZWxkcygpIHtcbiAgICAgIC8vdGhpcy5fZ3JhcGhTZWxlY3QuZGlzYWJsZSgpO1xuICAgICAgdGhpcy4kZWwuZmluZCgnaW5wdXQsIGJ1dHRvbicpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgX29uVGFiQ2xpY2soanFldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ01vZGVsaW5nVGFiLlRvZ2dsZVJlcXVlc3QnLCB7dGFiVHlwZTogJ2Jsb2NrbHknfSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKHRhYk9wZW4pIHtcbiAgICAgIGlmICh0YWJPcGVuKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNzZWxlY3RNb2RlbGluZycpLnJlbW92ZUNsYXNzKCdub3RmbGlwcGVkWScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjc2VsZWN0TW9kZWxpbmcnKS5hZGRDbGFzcygnZmxpcHBlZFknKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNzZWxlY3RNb2RlbGluZycpLnJlbW92ZUNsYXNzKCdmbGlwcGVkWScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjc2VsZWN0TW9kZWxpbmcnKS5hZGRDbGFzcygnbm90ZmxpcHBlZFknKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG4iXX0=
