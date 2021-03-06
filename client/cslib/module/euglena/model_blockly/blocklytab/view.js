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

      if (!Globals.get('AppConfig.system.expModelModality').match('justbody')) {
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
        if (!(Globals.get('AppConfig.system.expModelModality') === 'justbody')) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCIkIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsImdldCIsIm1hdGNoIiwiJGVsIiwiZmluZCIsIm9uIiwiX29uVGFiQ2xpY2siLCJjc3MiLCJfb25UcmFuc2l0aW9uRW5kIiwiZGlzYWJsZUZpZWxkcyIsImV2dCIsImRpc3BhdGNoRXZlbnQiLCJ0eXBlIiwib2ZmIiwiZGF0YSIsInBhdGgiLCJ0b2dnbGVDbGFzcyIsInZhbHVlIiwidXBkYXRlRmllbGRTdGF0dXMiLCJjdXJyZW50VGFyZ2V0IiwiZW5hYmxlRmllbGRzIiwicmVtb3ZlUHJvcCIsInByb3AiLCJqcWV2dCIsInRhYlR5cGUiLCJ0YWJPcGVuIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxJQUFJRCxRQUFRLFFBQVIsQ0FBVjs7QUFFQSxNQUFNRSxRQUFRRixRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRyxVQUFVSCxRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFSSxLQUFLSixRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUssVUFBVUwsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VNLFdBQVdOLFFBQVEsaUJBQVIsQ0FEYjs7QUFHQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDZCQUFZTyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkEsUUFBUUYsUUFEUzs7QUFFdkJKLFlBQU1PLFdBQU4sUUFBd0IsQ0FDdEIsYUFEc0IsRUFDUCxnQkFETyxFQUNVLGtC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QixHQUFMLENBQVNDLElBQVQsQ0FBYyxpQkFBZCxFQUFpQ3NCLFdBQWpDLENBQTZDLFVBQTdDO0FBQ0EsZUFBS3ZCLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLGlCQUFkLEVBQWlDdUIsUUFBakMsQ0FBMEMsYUFBMUM7QUFDRDtBQUNGO0FBckVIOztBQUFBO0FBQUEsSUFBcUNqQyxPQUFyQztBQXVFRCxDQW5GRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2Jsb2NrbHl0YWIvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IERvbVZpZXcgPSByZXF1aXJlKCdjb3JlL3ZpZXcvZG9tX3ZpZXcnKSxcbiAgICBUZW1wbGF0ZSA9IHJlcXVpcmUoJ3RleHQhLi90YWIuaHRtbCcpO1xuXG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgTW9kZWxpbmdUYWJWaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwpIHtcbiAgICAgIHN1cGVyKHRtcGwgfHwgVGVtcGxhdGUpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uVGFiQ2xpY2snLCAnX29uTW9kZWxDaGFuZ2UnLCdfb25UcmFuc2l0aW9uRW5kJ10pXG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpXG5cbiAgICAgIGlmICghKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKS5tYXRjaCgnanVzdGJvZHknKSkpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLm1vZGVsaW5nX190YWInKS5vbignY2xpY2snLHRoaXMuX29uVGFiQ2xpY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLm1vZGVsaW5nX190YWInKS5jc3MoJ2Rpc3BsYXknLCdub25lJylcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLm1vZGVsaW5nJykuY3NzKCd2aXNpYmlsaXR5JywnaGlkZGVuJylcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVsWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLl9vblRyYW5zaXRpb25FbmQpXG4gICAgICB0aGlzLmRpc2FibGVGaWVsZHMoKTtcbiAgICB9XG5cbiAgICBfb25UcmFuc2l0aW9uRW5kKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWxpbmdUYWIuVHJhbnNpdGlvbkVuZCcsIHt0eXBlOiAnbW9kZWwnfSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIHRoaXMuJGVsLmZpbmQoJy5tb2RlbGluZ19fdGFiJykub2ZmKCdjbGljaycpO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgIGlmICghKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKT09PSdqdXN0Ym9keScpKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5tb2RlbGluZ19fdGFiJykub24oJ2NsaWNrJyx0aGlzLl9vblRhYkNsaWNrKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09IFwib3BlblwiKSB7XG4gICAgICAgIHRoaXMuJGVsLnRvZ2dsZUNsYXNzKCdtb2RlbGluZ19fb3BlbicsIGV2dC5kYXRhLnZhbHVlKVxuICAgICAgICB0aGlzLnVwZGF0ZUZpZWxkU3RhdHVzKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIH1cbiAgIH1cblxuICAgIHVwZGF0ZUZpZWxkU3RhdHVzKG1vZGVsKSB7XG4gICAgICBpZiAobW9kZWwuZ2V0KCdvcGVuJykpIHtcbiAgICAgICAgdGhpcy5lbmFibGVGaWVsZHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZUZpZWxkcygpIHtcbiAgICAgIC8vdGhpcy5fZ3JhcGhTZWxlY3QuZW5hYmxlKCk7XG4gICAgICB0aGlzLiRlbC5maW5kKCdpbnB1dCwgYnV0dG9uJykucmVtb3ZlUHJvcCgnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlRmllbGRzKCkge1xuICAgICAgLy90aGlzLl9ncmFwaFNlbGVjdC5kaXNhYmxlKCk7XG4gICAgICB0aGlzLiRlbC5maW5kKCdpbnB1dCwgYnV0dG9uJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBfb25UYWJDbGljayhqcWV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcsIHt0YWJUeXBlOiAnYmxvY2tseSd9LCB0cnVlKTtcbiAgICB9XG5cbiAgICB0b2dnbGUodGFiT3Blbikge1xuICAgICAgaWYgKHRhYk9wZW4pIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI3NlbGVjdE1vZGVsaW5nJykucmVtb3ZlQ2xhc3MoJ25vdGZsaXBwZWRZJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNzZWxlY3RNb2RlbGluZycpLmFkZENsYXNzKCdmbGlwcGVkWScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI3NlbGVjdE1vZGVsaW5nJykucmVtb3ZlQ2xhc3MoJ2ZsaXBwZWRZJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNzZWxlY3RNb2RlbGluZycpLmFkZENsYXNzKCdub3RmbGlwcGVkWScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdfQ==
