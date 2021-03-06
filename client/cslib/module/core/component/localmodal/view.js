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
      Template = require('text!./localmodal.html');

  return function (_DomView) {
    _inherits(LocalModalView, _DomView);

    function LocalModalView(model, tmpl) {
      _classCallCheck(this, LocalModalView);

      var _this = _possibleConstructorReturn(this, (LocalModalView.__proto__ || Object.getPrototypeOf(LocalModalView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onModelChange', '_onCardAdded', '_onCardRemoved', '_onCardsCleared']);

      _this._cards = [];
      model.addEventListener('Model.Change', _this._onModelChange);
      model.addEventListener('LocalModal.CardAdded', _this._onCardAdded);
      model.addEventListener('LocalModal.CardRemoved', _this._onCardRemoved);
      model.addEventListener('LocalModal.CardsCleared', _this._onCardsCleared);
      return _this;
    }

    _createClass(LocalModalView, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        var _this2 = this;

        switch (evt.data.path) {
          case 'display':
            if (evt.data.value) {
              this.$el.fadeIn({
                complete: function complete() {
                  _this2.dispatchEvent('LocalModal.ShowComplete');
                }
              });
            } else {
              this.$el.fadeOut({
                complete: function complete() {
                  _this2.dispatchEvent('LocalModal.HideComplete');
                }
              });
            }
            break;
        }
      }
    }, {
      key: '_onCardAdded',
      value: function _onCardAdded(evt) {
        var _this3 = this;

        var card = evt.data.card;
        var cardwrap = new DomView("<div class='localmodal__content'></div>");
        cardwrap.addChild(card);
        cardwrap.$dom().css({
          left: this._cards.length + 3 + 'rem',
          opacity: 0
        });
        this.addChild(cardwrap);
        cardwrap.$dom().animate({
          left: this._cards.length + 'rem',
          opacity: 1
        }, {
          duration: 500,
          complete: function complete() {
            _this3.dispatchEvent("LocalModal.ShowComplete", {});
          }
        });
        this._cards.push(cardwrap);
      }
    }, {
      key: '_onCardRemoved',
      value: function _onCardRemoved(evt) {
        var _this4 = this;

        var card = this._cards.pop();
        card.$dom().animate({
          left: this._cards.length + 2 + 'rem',
          opacity: 0
        }, {
          duration: 500,
          complete: function complete() {
            _this4.removeChild(card);
          }
        });
      }
    }, {
      key: '_onCardsCleared',
      value: function _onCardsCleared(evt) {
        while (this._cards.length) {
          this.removeChild(this._cards.pop());
        }
      }
    }]);

    return LocalModalView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9sb2NhbG1vZGFsL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiRG9tVmlldyIsIlRlbXBsYXRlIiwibW9kZWwiLCJ0bXBsIiwiYmluZE1ldGhvZHMiLCJfY2FyZHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW9kZWxDaGFuZ2UiLCJfb25DYXJkQWRkZWQiLCJfb25DYXJkUmVtb3ZlZCIsIl9vbkNhcmRzQ2xlYXJlZCIsImV2dCIsImRhdGEiLCJwYXRoIiwidmFsdWUiLCIkZWwiLCJmYWRlSW4iLCJjb21wbGV0ZSIsImRpc3BhdGNoRXZlbnQiLCJmYWRlT3V0IiwiY2FyZCIsImNhcmR3cmFwIiwiYWRkQ2hpbGQiLCIkZG9tIiwiY3NzIiwibGVmdCIsImxlbmd0aCIsIm9wYWNpdHkiLCJhbmltYXRlIiwiZHVyYXRpb24iLCJwdXNoIiwicG9wIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXTCxRQUFRLHdCQUFSLENBRGI7O0FBR0E7QUFBQTs7QUFDRSw0QkFBWU0sS0FBWixFQUFtQkMsSUFBbkIsRUFBeUI7QUFBQTs7QUFBQSxrSUFDakJBLFFBQVFGLFFBRFM7O0FBRXZCSixZQUFNTyxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsY0FBbkIsRUFBbUMsZ0JBQW5DLEVBQXFELGlCQUFyRCxDQUF4Qjs7QUFFQSxZQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNBSCxZQUFNSSxnQkFBTixDQUF1QixjQUF2QixFQUF1QyxNQUFLQyxjQUE1QztBQUNBTCxZQUFNSSxnQkFBTixDQUF1QixzQkFBdkIsRUFBK0MsTUFBS0UsWUFBcEQ7QUFDQU4sWUFBTUksZ0JBQU4sQ0FBdUIsd0JBQXZCLEVBQWlELE1BQUtHLGNBQXREO0FBQ0FQLFlBQU1JLGdCQUFOLENBQXVCLHlCQUF2QixFQUFrRCxNQUFLSSxlQUF2RDtBQVJ1QjtBQVN4Qjs7QUFWSDtBQUFBO0FBQUEscUNBWWlCQyxHQVpqQixFQVlzQjtBQUFBOztBQUNsQixnQkFBT0EsSUFBSUMsSUFBSixDQUFTQyxJQUFoQjtBQUNFLGVBQUssU0FBTDtBQUNFLGdCQUFJRixJQUFJQyxJQUFKLENBQVNFLEtBQWIsRUFBb0I7QUFDbEIsbUJBQUtDLEdBQUwsQ0FBU0MsTUFBVCxDQUFnQjtBQUNkQywwQkFBVSxvQkFBTTtBQUNkLHlCQUFLQyxhQUFMLENBQW1CLHlCQUFuQjtBQUNEO0FBSGEsZUFBaEI7QUFLRCxhQU5ELE1BTU87QUFDTCxtQkFBS0gsR0FBTCxDQUFTSSxPQUFULENBQWlCO0FBQ2ZGLDBCQUFVLG9CQUFNO0FBQ2QseUJBQUtDLGFBQUwsQ0FBbUIseUJBQW5CO0FBQ0Q7QUFIYyxlQUFqQjtBQUtEO0FBQ0g7QUFmRjtBQWlCRDtBQTlCSDtBQUFBO0FBQUEsbUNBZ0NlUCxHQWhDZixFQWdDb0I7QUFBQTs7QUFDaEIsWUFBTVMsT0FBT1QsSUFBSUMsSUFBSixDQUFTUSxJQUF0QjtBQUNBLFlBQU1DLFdBQVcsSUFBSXJCLE9BQUosQ0FBWSx5Q0FBWixDQUFqQjtBQUNBcUIsaUJBQVNDLFFBQVQsQ0FBa0JGLElBQWxCO0FBQ0FDLGlCQUFTRSxJQUFULEdBQWdCQyxHQUFoQixDQUFvQjtBQUNsQkMsZ0JBQVMsS0FBS3BCLE1BQUwsQ0FBWXFCLE1BQVosR0FBcUIsQ0FBOUIsUUFEa0I7QUFFbEJDLG1CQUFTO0FBRlMsU0FBcEI7QUFJQSxhQUFLTCxRQUFMLENBQWNELFFBQWQ7QUFDQUEsaUJBQVNFLElBQVQsR0FBZ0JLLE9BQWhCLENBQXdCO0FBQ3RCSCxnQkFBUyxLQUFLcEIsTUFBTCxDQUFZcUIsTUFBckIsUUFEc0I7QUFFdEJDLG1CQUFTO0FBRmEsU0FBeEIsRUFHRztBQUNERSxvQkFBVSxHQURUO0FBRURaLG9CQUFVLG9CQUFNO0FBQ2QsbUJBQUtDLGFBQUwsQ0FBbUIseUJBQW5CLEVBQThDLEVBQTlDO0FBQ0Q7QUFKQSxTQUhIO0FBU0EsYUFBS2IsTUFBTCxDQUFZeUIsSUFBWixDQUFpQlQsUUFBakI7QUFDRDtBQW5ESDtBQUFBO0FBQUEscUNBb0RpQlYsR0FwRGpCLEVBb0RzQjtBQUFBOztBQUNsQixZQUFNUyxPQUFPLEtBQUtmLE1BQUwsQ0FBWTBCLEdBQVosRUFBYjtBQUNBWCxhQUFLRyxJQUFMLEdBQVlLLE9BQVosQ0FBb0I7QUFDbEJILGdCQUFTLEtBQUtwQixNQUFMLENBQVlxQixNQUFaLEdBQXFCLENBQTlCLFFBRGtCO0FBRWxCQyxtQkFBUztBQUZTLFNBQXBCLEVBR0c7QUFDREUsb0JBQVUsR0FEVDtBQUVEWixvQkFBVSxvQkFBTTtBQUNkLG1CQUFLZSxXQUFMLENBQWlCWixJQUFqQjtBQUNEO0FBSkEsU0FISDtBQVNEO0FBL0RIO0FBQUE7QUFBQSxzQ0FpRWtCVCxHQWpFbEIsRUFpRXVCO0FBQ25CLGVBQU8sS0FBS04sTUFBTCxDQUFZcUIsTUFBbkIsRUFBMkI7QUFDekIsZUFBS00sV0FBTCxDQUFpQixLQUFLM0IsTUFBTCxDQUFZMEIsR0FBWixFQUFqQjtBQUNEO0FBQ0Y7QUFyRUg7O0FBQUE7QUFBQSxJQUFvQy9CLE9BQXBDO0FBdUVELENBL0VEIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9sb2NhbG1vZGFsL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuICBcbiAgY29uc3QgRG9tVmlldyA9IHJlcXVpcmUoJ2NvcmUvdmlldy9kb21fdmlldycpLFxuICAgIFRlbXBsYXRlID0gcmVxdWlyZSgndGV4dCEuL2xvY2FsbW9kYWwuaHRtbCcpO1xuXG4gIHJldHVybiBjbGFzcyBMb2NhbE1vZGFsVmlldyBleHRlbmRzIERvbVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsLCB0bXBsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uTW9kZWxDaGFuZ2UnLCAnX29uQ2FyZEFkZGVkJywgJ19vbkNhcmRSZW1vdmVkJywgJ19vbkNhcmRzQ2xlYXJlZCddKTtcblxuICAgICAgdGhpcy5fY2FyZHMgPSBbXTtcbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uTW9kZWxDaGFuZ2UpO1xuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTG9jYWxNb2RhbC5DYXJkQWRkZWQnLCB0aGlzLl9vbkNhcmRBZGRlZClcbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ0xvY2FsTW9kYWwuQ2FyZFJlbW92ZWQnLCB0aGlzLl9vbkNhcmRSZW1vdmVkKVxuICAgICAgbW9kZWwuYWRkRXZlbnRMaXN0ZW5lcignTG9jYWxNb2RhbC5DYXJkc0NsZWFyZWQnLCB0aGlzLl9vbkNhcmRzQ2xlYXJlZClcbiAgICB9XG5cbiAgICBfb25Nb2RlbENoYW5nZShldnQpIHtcbiAgICAgIHN3aXRjaChldnQuZGF0YS5wYXRoKSB7XG4gICAgICAgIGNhc2UgJ2Rpc3BsYXknOlxuICAgICAgICAgIGlmIChldnQuZGF0YS52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy4kZWwuZmFkZUluKHtcbiAgICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0xvY2FsTW9kYWwuU2hvd0NvbXBsZXRlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZhZGVPdXQoe1xuICAgICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnTG9jYWxNb2RhbC5IaWRlQ29tcGxldGUnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkNhcmRBZGRlZChldnQpIHtcbiAgICAgIGNvbnN0IGNhcmQgPSBldnQuZGF0YS5jYXJkO1xuICAgICAgY29uc3QgY2FyZHdyYXAgPSBuZXcgRG9tVmlldyhcIjxkaXYgY2xhc3M9J2xvY2FsbW9kYWxfX2NvbnRlbnQnPjwvZGl2PlwiKTtcbiAgICAgIGNhcmR3cmFwLmFkZENoaWxkKGNhcmQpO1xuICAgICAgY2FyZHdyYXAuJGRvbSgpLmNzcyh7XG4gICAgICAgIGxlZnQ6IGAke3RoaXMuX2NhcmRzLmxlbmd0aCArIDN9cmVtYCxcbiAgICAgICAgb3BhY2l0eTogMFxuICAgICAgfSk7XG4gICAgICB0aGlzLmFkZENoaWxkKGNhcmR3cmFwKTtcbiAgICAgIGNhcmR3cmFwLiRkb20oKS5hbmltYXRlKHtcbiAgICAgICAgbGVmdDogYCR7dGhpcy5fY2FyZHMubGVuZ3RofXJlbWAsXG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICAgIH0sIHtcbiAgICAgICAgZHVyYXRpb246IDUwMCxcbiAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoXCJMb2NhbE1vZGFsLlNob3dDb21wbGV0ZVwiLCB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5fY2FyZHMucHVzaChjYXJkd3JhcCk7XG4gICAgfVxuICAgIF9vbkNhcmRSZW1vdmVkKGV2dCkge1xuICAgICAgY29uc3QgY2FyZCA9IHRoaXMuX2NhcmRzLnBvcCgpO1xuICAgICAgY2FyZC4kZG9tKCkuYW5pbWF0ZSh7XG4gICAgICAgIGxlZnQ6IGAke3RoaXMuX2NhcmRzLmxlbmd0aCArIDJ9cmVtYCxcbiAgICAgICAgb3BhY2l0eTogMFxuICAgICAgfSwge1xuICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2FyZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIF9vbkNhcmRzQ2xlYXJlZChldnQpIHtcbiAgICAgIHdoaWxlICh0aGlzLl9jYXJkcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLl9jYXJkcy5wb3AoKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pIl19
