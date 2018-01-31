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

      Utils.bindMethods(_this, ['_onTabClick', '_onModelChange']);

      model.addEventListener('Model.Change', _this._onModelChange);

      _this.$el.find('.modeling__tab').click(_this._onTabClick);
      _this.disableFields();
      return _this;
    }

    _createClass(ModelingTabView, [{
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
    }]);

    return ModelingTabView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCIkIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJEb21WaWV3IiwiVGVtcGxhdGUiLCJtb2RlbCIsInRtcGwiLCJiaW5kTWV0aG9kcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb2RlbENoYW5nZSIsIiRlbCIsImZpbmQiLCJjbGljayIsIl9vblRhYkNsaWNrIiwiZGlzYWJsZUZpZWxkcyIsImV2dCIsImRhdGEiLCJwYXRoIiwidG9nZ2xlQ2xhc3MiLCJ2YWx1ZSIsInVwZGF0ZUZpZWxkU3RhdHVzIiwiY3VycmVudFRhcmdldCIsImdldCIsImVuYWJsZUZpZWxkcyIsInJlbW92ZVByb3AiLCJwcm9wIiwianFldnQiLCJkaXNwYXRjaEV2ZW50IiwidGFiVHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxJQUFJRCxRQUFRLFFBQVIsQ0FBVjs7QUFFQSxNQUFNRSxRQUFRRixRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRyxVQUFVSCxRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFSSxLQUFLSixRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUssVUFBVUwsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VNLFdBQVdOLFFBQVEsaUJBQVIsQ0FEYjs7QUFHQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLDZCQUFZTyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLG9JQUNqQkEsUUFBUUYsUUFEUzs7QUFFdkJKLFlBQU1PLFdBQU4sUUFBd0IsQ0FDdEIsYUFEc0IsRUFDUCxnQkFETyxDQUF4Qjs7QUFHQUYsWUFBTUcsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0MsY0FBNUM7O0FBRUEsWUFBS0MsR0FBTCxDQUFTQyxJQUFULENBQWMsZ0JBQWQsRUFBZ0NDLEtBQWhDLENBQXNDLE1BQUtDLFdBQTNDO0FBQ0EsWUFBS0MsYUFBTDtBQVJ1QjtBQVN4Qjs7QUFWSDtBQUFBO0FBQUEscUNBWWlCQyxHQVpqQixFQVlzQjtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVNDLElBQVQsSUFBaUIsTUFBckIsRUFBNkI7QUFDM0IsZUFBS1AsR0FBTCxDQUFTUSxXQUFULENBQXFCLGdCQUFyQixFQUF1Q0gsSUFBSUMsSUFBSixDQUFTRyxLQUFoRDtBQUNBLGVBQUtDLGlCQUFMLENBQXVCTCxJQUFJTSxhQUEzQjtBQUNEO0FBQ0g7QUFqQkY7QUFBQTtBQUFBLHdDQW1Cb0JoQixLQW5CcEIsRUFtQjJCO0FBQ3ZCLFlBQUlBLE1BQU1pQixHQUFOLENBQVUsTUFBVixDQUFKLEVBQXVCO0FBQ3JCLGVBQUtDLFlBQUw7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLVCxhQUFMO0FBQ0Q7QUFDRjtBQXpCSDtBQUFBO0FBQUEscUNBMkJpQjtBQUNiO0FBQ0EsYUFBS0osR0FBTCxDQUFTQyxJQUFULENBQWMsZUFBZCxFQUErQmEsVUFBL0IsQ0FBMEMsVUFBMUM7QUFDRDtBQTlCSDtBQUFBO0FBQUEsc0NBZ0NrQjtBQUNkO0FBQ0EsYUFBS2QsR0FBTCxDQUFTQyxJQUFULENBQWMsZUFBZCxFQUErQmMsSUFBL0IsQ0FBb0MsVUFBcEMsRUFBZ0QsSUFBaEQ7QUFDRDtBQW5DSDtBQUFBO0FBQUEsa0NBcUNjQyxLQXJDZCxFQXFDcUI7QUFDakJ6QixnQkFBUXFCLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSyxhQUFyQixDQUFtQywyQkFBbkMsRUFBZ0UsRUFBQ0MsU0FBUyxTQUFWLEVBQWhFLEVBQXNGLElBQXRGO0FBQ0Q7QUF2Q0g7O0FBQUE7QUFBQSxJQUFxQ3pCLE9BQXJDO0FBeUNELENBckREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL3RhYi5odG1sJyk7XG5cbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBNb2RlbGluZ1RhYlZpZXcgZXh0ZW5kcyBEb21WaWV3IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbCwgdG1wbCkge1xuICAgICAgc3VwZXIodG1wbCB8fCBUZW1wbGF0ZSk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25UYWJDbGljaycsICdfb25Nb2RlbENoYW5nZSddKVxuXG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9vbk1vZGVsQ2hhbmdlKVxuXG4gICAgICB0aGlzLiRlbC5maW5kKCcubW9kZWxpbmdfX3RhYicpLmNsaWNrKHRoaXMuX29uVGFiQ2xpY2spXG4gICAgICB0aGlzLmRpc2FibGVGaWVsZHMoKTtcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5wYXRoID09IFwib3BlblwiKSB7XG4gICAgICAgIHRoaXMuJGVsLnRvZ2dsZUNsYXNzKCdtb2RlbGluZ19fb3BlbicsIGV2dC5kYXRhLnZhbHVlKVxuICAgICAgICB0aGlzLnVwZGF0ZUZpZWxkU3RhdHVzKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIH1cbiAgIH1cblxuICAgIHVwZGF0ZUZpZWxkU3RhdHVzKG1vZGVsKSB7XG4gICAgICBpZiAobW9kZWwuZ2V0KCdvcGVuJykpIHtcbiAgICAgICAgdGhpcy5lbmFibGVGaWVsZHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUZpZWxkcygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZUZpZWxkcygpIHtcbiAgICAgIC8vdGhpcy5fZ3JhcGhTZWxlY3QuZW5hYmxlKCk7XG4gICAgICB0aGlzLiRlbC5maW5kKCdpbnB1dCwgYnV0dG9uJykucmVtb3ZlUHJvcCgnZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlRmllbGRzKCkge1xuICAgICAgLy90aGlzLl9ncmFwaFNlbGVjdC5kaXNhYmxlKCk7XG4gICAgICB0aGlzLiRlbC5maW5kKCdpbnB1dCwgYnV0dG9uJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBfb25UYWJDbGljayhqcWV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcsIHt0YWJUeXBlOiAnYmxvY2tseSd9LCB0cnVlKTtcbiAgICB9XG4gIH1cbn0pXG4iXX0=
