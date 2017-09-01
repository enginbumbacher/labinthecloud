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
        for (var n in this.get('notes')) {
          if (n.id() == noteId) {
            note = n;
            break;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ub3RpZmljYXRpb25zL2NlbnRlci9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkhNIiwiVXRpbHMiLCJCYXNlTW9kZWwiLCJkZWZhdWx0cyIsIm5vdGVzIiwiY29uZmlnIiwiZW5zdXJlRGVmYXVsdHMiLCJiaW5kTWV0aG9kcyIsIm5vdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTm90ZUV4cGlyYXRpb24iLCJnZXQiLCJwdXNoIiwic2V0IiwiZGlzcGF0Y2hFdmVudCIsInNldFRpbWVvdXQiLCJsaXZlIiwibm90ZUlkIiwibiIsImlkIiwiZXhwaXJlIiwiZm9yRWFjaCIsImV2dCIsImN1cnJlbnRUYXJnZXQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic3BsaWNlIiwiaW5kZXhPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsS0FBS0YsUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRUcsUUFBUUgsUUFBUSxpQkFBUixDQUZWOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsa0JBQVIsQ0FBbEI7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLFdBQU87QUFERSxHQURiOztBQUtBO0FBQUE7O0FBQ0UscUNBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEJBLGFBQU9GLFFBQVAsR0FBa0JGLE1BQU1LLGNBQU4sQ0FBcUJELE9BQU9GLFFBQTVCLEVBQXNDQSxRQUF0QyxDQUFsQjs7QUFEa0Isb0pBRVpFLE1BRlk7O0FBR2xCSixZQUFNTSxXQUFOLFFBQXdCLENBQUMsbUJBQUQsQ0FBeEI7QUFIa0I7QUFJbkI7O0FBTEg7QUFBQTtBQUFBLDhCQU9VQyxJQVBWLEVBT2dCO0FBQ1pBLGFBQUtDLGdCQUFMLENBQXNCLGNBQXRCLEVBQXNDLEtBQUtDLGlCQUEzQztBQUNBLFlBQU1OLFFBQVEsS0FBS08sR0FBTCxDQUFTLE9BQVQsQ0FBZDtBQUNBUCxjQUFNUSxJQUFOLENBQVdKLElBQVg7QUFDQSxhQUFLSyxHQUFMLENBQVMsT0FBVCxFQUFrQlQsS0FBbEI7QUFDQSxhQUFLVSxhQUFMLENBQW1CLDhCQUFuQixFQUFtRDtBQUNqRE4sZ0JBQU1BO0FBRDJDLFNBQW5EO0FBR0FPLG1CQUFXLFlBQU07QUFDZlAsZUFBS1EsSUFBTDtBQUNELFNBRkQsRUFFRyxDQUZIO0FBR0Q7QUFsQkg7QUFBQTtBQUFBLGlDQW9CYUMsTUFwQmIsRUFvQnFCO0FBQ2pCLFlBQUlULGFBQUo7QUFDQSxhQUFLLElBQUlVLENBQVQsSUFBYyxLQUFLUCxHQUFMLENBQVMsT0FBVCxDQUFkLEVBQWlDO0FBQy9CLGNBQUlPLEVBQUVDLEVBQUYsTUFBVUYsTUFBZCxFQUFzQjtBQUNwQlQsbUJBQU9VLENBQVA7QUFDQTtBQUNEO0FBQ0Y7QUFDRCxZQUFJVixJQUFKLEVBQVU7QUFDUkEsZUFBS1ksTUFBTDtBQUNEO0FBQ0Y7QUEvQkg7QUFBQTtBQUFBLDhCQWlDVTtBQUNOLGFBQUtULEdBQUwsQ0FBUyxPQUFULEVBQWtCVSxPQUFsQixDQUEwQixVQUFDYixJQUFELEVBQVU7QUFDbENBLGVBQUtZLE1BQUw7QUFDRCxTQUZEO0FBR0Q7QUFyQ0g7QUFBQTtBQUFBLHdDQXVDb0JFLEdBdkNwQixFQXVDeUI7QUFDckIsWUFBTWQsT0FBT2MsSUFBSUMsYUFBakI7QUFDQWYsYUFBS2dCLG1CQUFMLENBQXlCLGNBQXpCLEVBQXlDLEtBQUtkLGlCQUE5QztBQUNBLFlBQU1OLFFBQVEsS0FBS08sR0FBTCxDQUFTLE9BQVQsQ0FBZDtBQUNBUCxjQUFNcUIsTUFBTixDQUFhckIsTUFBTXNCLE9BQU4sQ0FBY2xCLElBQWQsQ0FBYixFQUFrQyxDQUFsQztBQUNBLGFBQUtLLEdBQUwsQ0FBUyxPQUFULEVBQWtCVCxLQUFsQjtBQUNBLGFBQUtVLGFBQUwsQ0FBbUIsZ0NBQW5CLEVBQXFEO0FBQ25ETixnQkFBTUE7QUFENkMsU0FBckQ7QUFHRDtBQWhESDs7QUFBQTtBQUFBLElBQTZDTixTQUE3QztBQWtERCxDQTVERCIsImZpbGUiOiJtb2R1bGUvbm90aWZpY2F0aW9ucy9jZW50ZXIvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpO1xuICBcbiAgY29uc3QgQmFzZU1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgbm90ZXM6IFtdXG4gICAgfTtcblxuICByZXR1cm4gY2xhc3MgTm90aWZpY2F0aW9uQ2VudGVyTW9kZWwgZXh0ZW5kcyBCYXNlTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgY29uZmlnLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZmlnLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG4gICAgICBzdXBlcihjb25maWcpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Ob3RlRXhwaXJhdGlvbiddKVxuICAgIH1cblxuICAgIGFkZE5vdGUobm90ZSkge1xuICAgICAgbm90ZS5hZGRFdmVudExpc3RlbmVyKCdOb3RlLkV4cGlyZWQnLCB0aGlzLl9vbk5vdGVFeHBpcmF0aW9uKTtcbiAgICAgIGNvbnN0IG5vdGVzID0gdGhpcy5nZXQoJ25vdGVzJyk7XG4gICAgICBub3Rlcy5wdXNoKG5vdGUpO1xuICAgICAgdGhpcy5zZXQoJ25vdGVzJywgbm90ZXMpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25DZW50ZXIuTm90ZUFkZGVkJywge1xuICAgICAgICBub3RlOiBub3RlXG4gICAgICB9KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIG5vdGUubGl2ZSgpO1xuICAgICAgfSwgMSlcbiAgICB9XG5cbiAgICByZW1vdmVOb3RlKG5vdGVJZCkge1xuICAgICAgbGV0IG5vdGU7XG4gICAgICBmb3IgKGxldCBuIGluIHRoaXMuZ2V0KCdub3RlcycpKSB7XG4gICAgICAgIGlmIChuLmlkKCkgPT0gbm90ZUlkKSB7XG4gICAgICAgICAgbm90ZSA9IG47XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChub3RlKSB7XG4gICAgICAgIG5vdGUuZXhwaXJlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICB0aGlzLmdldCgnbm90ZXMnKS5mb3JFYWNoKChub3RlKSA9PiB7XG4gICAgICAgIG5vdGUuZXhwaXJlKCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbk5vdGVFeHBpcmF0aW9uKGV2dCkge1xuICAgICAgY29uc3Qgbm90ZSA9IGV2dC5jdXJyZW50VGFyZ2V0O1xuICAgICAgbm90ZS5yZW1vdmVFdmVudExpc3RlbmVyKCdOb3RlLkV4cGlyZWQnLCB0aGlzLl9vbk5vdGVFeHBpcmF0aW9uKTtcbiAgICAgIGNvbnN0IG5vdGVzID0gdGhpcy5nZXQoJ25vdGVzJyk7XG4gICAgICBub3Rlcy5zcGxpY2Uobm90ZXMuaW5kZXhPZihub3RlKSwgMSk7XG4gICAgICB0aGlzLnNldCgnbm90ZXMnLCBub3Rlcyk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbkNlbnRlci5Ob3RlRXhwaXJlZCcsIHtcbiAgICAgICAgbm90ZTogbm90ZVxuICAgICAgfSlcbiAgICB9XG4gIH0gIFxufSkiXX0=
