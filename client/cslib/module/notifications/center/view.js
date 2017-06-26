'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils');

  var DomView = require('core/view/dom_view'),
      Template = '<div class="notification__center"></div>';

  return function (_DomView) {
    _inherits(NotificationCenterView, _DomView);

    function NotificationCenterView(model, tmpl) {
      _classCallCheck(this, NotificationCenterView);

      var _this = _possibleConstructorReturn(this, (NotificationCenterView.__proto__ || Object.getPrototypeOf(NotificationCenterView)).call(this, tmpl || Template));

      Utils.bindMethods(_this, ['_onNoteAdded', '_onNoteExpired']);

      model.addEventListener('NotificationCenter.NoteAdded', _this._onNoteAdded);
      model.addEventListener('NotificationCenter.NoteExpired', _this._onNoteExpired);
      return _this;
    }

    _createClass(NotificationCenterView, [{
      key: '_onNoteAdded',
      value: function _onNoteAdded(evt) {
        this.addChild(evt.data.note.view(), null, 0);
      }
    }, {
      key: '_onNoteExpired',
      value: function _onNoteExpired(evt) {
        this.removeChild(evt.data.note.view());
      }
    }]);

    return NotificationCenterView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ub3RpZmljYXRpb25zL2NlbnRlci92aWV3LmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiSE0iLCJVdGlscyIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vbk5vdGVBZGRlZCIsIl9vbk5vdGVFeHBpcmVkIiwiZXZ0IiwiYWRkQ2hpbGQiLCJkYXRhIiwibm90ZSIsInZpZXciLCJyZW1vdmVDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsS0FBS0YsUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWOztBQUlBLE1BQU1JLFVBQVVKLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFSyxXQUFXLDBDQURiOztBQUdBO0FBQUE7O0FBQ0Usb0NBQVlDLEtBQVosRUFBbUJDLElBQW5CLEVBQXlCO0FBQUE7O0FBQUEsa0pBQ2pCQSxRQUFRRixRQURTOztBQUV2QkYsWUFBTUssV0FBTixRQUF3QixDQUFDLGNBQUQsRUFBaUIsZ0JBQWpCLENBQXhCOztBQUVBRixZQUFNRyxnQkFBTixDQUF1Qiw4QkFBdkIsRUFBdUQsTUFBS0MsWUFBNUQ7QUFDQUosWUFBTUcsZ0JBQU4sQ0FBdUIsZ0NBQXZCLEVBQXlELE1BQUtFLGNBQTlEO0FBTHVCO0FBTXhCOztBQVBIO0FBQUE7QUFBQSxtQ0FTZUMsR0FUZixFQVNvQjtBQUNoQixhQUFLQyxRQUFMLENBQWNELElBQUlFLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxJQUFkLEVBQWQsRUFBb0MsSUFBcEMsRUFBMEMsQ0FBMUM7QUFDRDtBQVhIO0FBQUE7QUFBQSxxQ0FhaUJKLEdBYmpCLEVBYXNCO0FBQ2xCLGFBQUtLLFdBQUwsQ0FBaUJMLElBQUlFLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxJQUFkLEVBQWpCO0FBQ0Q7QUFmSDs7QUFBQTtBQUFBLElBQTRDWixPQUE1QztBQWtCRCxDQTFCRCIsImZpbGUiOiJtb2R1bGUvbm90aWZpY2F0aW9ucy9jZW50ZXIvdmlldy5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
