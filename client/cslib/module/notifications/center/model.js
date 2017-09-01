'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils');

  var BaseModel = require('core/model/model'),
      defaults = {
    notes: []
  };

  return function (_BaseModel) {
    _inherits(NotificationCenterModel, _BaseModel);

    function NotificationCenterModel(config) {
      _classCallCheck(this, NotificationCenterModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (NotificationCenterModel.__proto__ || Object.getPrototypeOf(NotificationCenterModel)).call(this, config));

      Utils.bindMethods(_this, ['_onNoteExpiration']);
      return _this;
    }

    _createClass(NotificationCenterModel, [{
      key: 'addNote',
      value: function addNote(note) {
        note.addEventListener('Note.Expired', this._onNoteExpiration);
        var notes = this.get('notes');
        notes.push(note);
        this.set('notes', notes);
        this.dispatchEvent('NotificationCenter.NoteAdded', {
          note: note
        });
        setTimeout(function () {
          note.live();
        }, 1);
      }
    }, {
      key: 'removeNote',
      value: function removeNote(noteId) {
        var note = void 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.get('notes')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var n = _step.value;

            if (n.id() == noteId) {
              note = n;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (note) {
          note.expire();
        }
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.get('notes').forEach(function (note) {
          note.expire();
        });
      }
    }, {
      key: '_onNoteExpiration',
      value: function _onNoteExpiration(evt) {
        var note = evt.currentTarget;
        note.removeEventListener('Note.Expired', this._onNoteExpiration);
        var notes = this.get('notes');
        notes.splice(notes.indexOf(note), 1);
        this.set('notes', notes);
        this.dispatchEvent('NotificationCenter.NoteExpired', {
          note: note
        });
      }
    }]);

    return NotificationCenterModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ub3RpZmljYXRpb25zL2NlbnRlci9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkhNIiwiVXRpbHMiLCJCYXNlTW9kZWwiLCJkZWZhdWx0cyIsIm5vdGVzIiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiLCJiaW5kTWV0aG9kcyIsIm5vdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTm90ZUV4cGlyYXRpb24iLCJnZXQiLCJwdXNoIiwic2V0IiwiZGlzcGF0Y2hFdmVudCIsInNldFRpbWVvdXQiLCJsaXZlIiwibm90ZUlkIiwibiIsImlkIiwiZXhwaXJlIiwiZm9yRWFjaCIsImV2dCIsImN1cnJlbnRUYXJnZXQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3BsaWNlIiwiaW5kZXhPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsS0FBS0YsUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsa0JBQVIsQ0FBbEI7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLFdBQU87QUFERSxHQURiOztBQUtBO0FBQUE7O0FBQ0UscUNBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEJBLGFBQU9GLFFBQVAsR0FBa0JGLE1BQU1LLGNBQU4sQ0FBcUJELE9BQU9GLFFBQTVCLEVBQXNDQSxRQUF0QyxDQUFsQjs7QUFEa0Isb0pBRVpFLE1BRlk7O0FBR2xCSixZQUFNTSxXQUFOLFFBQXdCLENBQUMsbUJBQUQsQ0FBeEI7QUFIa0I7QUFJbkI7O0FBTEg7QUFBQTtBQUFBLDhCQU9VQyxJQVBWLEVBT2dCO0FBQ1pBLGFBQUtDLGdCQUFMLENBQXNCLGNBQXRCLEVBQXNDLEtBQUtDLGlCQUEzQztBQUNBLFlBQU1OLFFBQVEsS0FBS08sR0FBTCxDQUFTLE9BQVQsQ0FBZDtBQUNBUCxjQUFNUSxJQUFOLENBQVdKLElBQVg7QUFDQSxhQUFLSyxHQUFMLENBQVMsT0FBVCxFQUFrQlQsS0FBbEI7QUFDQSxhQUFLVSxhQUFMLENBQW1CLDhCQUFuQixFQUFtRDtBQUNqRE4sZ0JBQU1BO0FBRDJDLFNBQW5EO0FBR0FPLG1CQUFXLFlBQU07QUFDZlAsZUFBS1EsSUFBTDtBQUNELFNBRkQsRUFFRyxDQUZIO0FBR0Q7QUFsQkg7QUFBQTtBQUFBLGlDQW9CYUMsTUFwQmIsRUFvQnFCO0FBQ2pCLFlBQUlULGFBQUo7QUFEaUI7QUFBQTtBQUFBOztBQUFBO0FBRWpCLCtCQUFjLEtBQUtHLEdBQUwsQ0FBUyxPQUFULENBQWQsOEhBQWlDO0FBQUEsZ0JBQXhCTyxDQUF3Qjs7QUFDL0IsZ0JBQUlBLEVBQUVDLEVBQUYsTUFBVUYsTUFBZCxFQUFzQjtBQUNwQlQscUJBQU9VLENBQVA7QUFDQTtBQUNEO0FBQ0Y7QUFQZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFRakIsWUFBSVYsSUFBSixFQUFVO0FBQ1JBLGVBQUtZLE1BQUw7QUFDRDtBQUNGO0FBL0JIO0FBQUE7QUFBQSw4QkFpQ1U7QUFDTixhQUFLVCxHQUFMLENBQVMsT0FBVCxFQUFrQlUsT0FBbEIsQ0FBMEIsVUFBQ2IsSUFBRCxFQUFVO0FBQ2xDQSxlQUFLWSxNQUFMO0FBQ0QsU0FGRDtBQUdEO0FBckNIO0FBQUE7QUFBQSx3Q0F1Q29CRSxHQXZDcEIsRUF1Q3lCO0FBQ3JCLFlBQU1kLE9BQU9jLElBQUlDLGFBQWpCO0FBQ0FmLGFBQUtnQixtQkFBTCxDQUF5QixjQUF6QixFQUF5QyxLQUFLZCxpQkFBOUM7QUFDQSxZQUFNTixRQUFRLEtBQUtPLEdBQUwsQ0FBUyxPQUFULENBQWQ7QUFDQVAsY0FBTXFCLE1BQU4sQ0FBYXJCLE1BQU1zQixPQUFOLENBQWNsQixJQUFkLENBQWIsRUFBa0MsQ0FBbEM7QUFDQSxhQUFLSyxHQUFMLENBQVMsT0FBVCxFQUFrQlQsS0FBbEI7QUFDQSxhQUFLVSxhQUFMLENBQW1CLGdDQUFuQixFQUFxRDtBQUNuRE4sZ0JBQU1BO0FBRDZDLFNBQXJEO0FBR0Q7QUFoREg7O0FBQUE7QUFBQSxJQUE2Q04sU0FBN0M7QUFrREQsQ0E1REQiLCJmaWxlIjoibW9kdWxlL25vdGlmaWNhdGlvbnMvY2VudGVyL21vZGVsLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
