'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Field = require('core/component/form/field/field'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  return function (_Field) {
    _inherits(MultiField, _Field);

    function MultiField() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, MultiField);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultiField).call(this, settings));

      Utils.bindMethods(_this, ['_onAddRequest', '_onRemoveRequest', '_onOrderChange', '_onModelChange']);

      _this.view().addEventListener('MultiField.AddFieldRequest', _this._onAddRequest);
      _this.view().addEventListener('MultiField.RemoveFieldRequest', _this._onRemoveRequest);
      _this.view().addEventListener('MultiField.OrderChangeRequest', _this._onOrderChange);
      _this._model.addEventListener('Model.Change', _this._onModelChange);
      return _this;
    }

    _createClass(MultiField, [{
      key: '_onAddRequest',
      value: function _onAddRequest(evt) {
        evt.stopPropagation();
        this._model.createField();
      }
    }, {
      key: '_onRemoveRequest',
      value: function _onRemoveRequest(evt) {
        evt.stopPropagation();
        this._model.removeField(evt.data.id);
      }
    }, {
      key: '_onOrderChange',
      value: function _onOrderChange(evt) {
        evt.stopPropagation();
        this._model.updateOrder(evt.data.order);
      }
    }, {
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        if (evt.data.path == "value") {
          this.dispatchEvent('Field.Change', {
            value: this.value()
          });
        }
      }
    }, {
      key: 'setChildMeta',
      value: function setChildMeta(cls, init) {
        this._model.setChildMeta(cls, init);
      }
    }, {
      key: 'lockField',
      value: function lockField(ind) {
        this._model.lockField(ind);
      }
    }, {
      key: 'unlockField',
      value: function unlockField(ind) {
        this._model.unlockField(ind);
      }
    }, {
      key: 'getFields',
      value: function getFields() {
        this._model.get('fields');
      }
    }]);

    return MultiField;
  }(Field);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sUUFBUSxRQUFRLGlDQUFSLENBQWQ7QUFBQSxNQUNFLFFBQVEsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFLE9BQU8sUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUdFLFFBQVEsUUFBUSxpQkFBUixDQUhWOztBQU1BO0FBQUE7O0FBQ0UsMEJBQTJCO0FBQUEsVUFBZixRQUFlLHlEQUFKLEVBQUk7O0FBQUE7O0FBQ3pCLGVBQVMsVUFBVCxHQUFzQixTQUFTLFVBQVQsSUFBdUIsS0FBN0M7QUFDQSxlQUFTLFNBQVQsR0FBcUIsU0FBUyxTQUFULElBQXNCLElBQTNDOztBQUZ5QixnR0FHbkIsUUFIbUI7O0FBSXpCLFlBQU0sV0FBTixRQUF3QixDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLEVBQXNDLGdCQUF0QyxFQUF3RCxnQkFBeEQsQ0FBeEI7O0FBRUEsWUFBSyxJQUFMLEdBQVksZ0JBQVosQ0FBNkIsNEJBQTdCLEVBQTJELE1BQUssYUFBaEU7QUFDQSxZQUFLLElBQUwsR0FBWSxnQkFBWixDQUE2QiwrQkFBN0IsRUFBOEQsTUFBSyxnQkFBbkU7QUFDQSxZQUFLLElBQUwsR0FBWSxnQkFBWixDQUE2QiwrQkFBN0IsRUFBOEQsTUFBSyxjQUFuRTtBQUNBLFlBQUssTUFBTCxDQUFZLGdCQUFaLENBQTZCLGNBQTdCLEVBQTZDLE1BQUssY0FBbEQ7QUFUeUI7QUFVMUI7O0FBWEg7QUFBQTtBQUFBLG9DQWFnQixHQWJoQixFQWFxQjtBQUNqQixZQUFJLGVBQUo7QUFDQSxhQUFLLE1BQUwsQ0FBWSxXQUFaO0FBQ0Q7QUFoQkg7QUFBQTtBQUFBLHVDQWtCbUIsR0FsQm5CLEVBa0J3QjtBQUNwQixZQUFJLGVBQUo7QUFDQSxhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLElBQUksSUFBSixDQUFTLEVBQWpDO0FBQ0Q7QUFyQkg7QUFBQTtBQUFBLHFDQXVCaUIsR0F2QmpCLEVBdUJzQjtBQUNsQixZQUFJLGVBQUo7QUFDQSxhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLElBQUksSUFBSixDQUFTLEtBQWpDO0FBQ0Q7QUExQkg7QUFBQTtBQUFBLHFDQTRCaUIsR0E1QmpCLEVBNEJzQjtBQUNsQixZQUFJLElBQUksSUFBSixDQUFTLElBQVQsSUFBaUIsT0FBckIsRUFBOEI7QUFDNUIsZUFBSyxhQUFMLENBQW1CLGNBQW5CLEVBQW1DO0FBQ2pDLG1CQUFPLEtBQUssS0FBTDtBQUQwQixXQUFuQztBQUdEO0FBQ0Y7QUFsQ0g7QUFBQTtBQUFBLG1DQW9DZSxHQXBDZixFQW9Db0IsSUFwQ3BCLEVBb0MwQjtBQUN0QixhQUFLLE1BQUwsQ0FBWSxZQUFaLENBQXlCLEdBQXpCLEVBQThCLElBQTlCO0FBQ0Q7QUF0Q0g7QUFBQTtBQUFBLGdDQXdDWSxHQXhDWixFQXdDaUI7QUFDYixhQUFLLE1BQUwsQ0FBWSxTQUFaLENBQXNCLEdBQXRCO0FBQ0Q7QUExQ0g7QUFBQTtBQUFBLGtDQTRDYyxHQTVDZCxFQTRDbUI7QUFDZixhQUFLLE1BQUwsQ0FBWSxXQUFaLENBQXdCLEdBQXhCO0FBQ0Q7QUE5Q0g7QUFBQTtBQUFBLGtDQWdEYztBQUNWLGFBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsUUFBaEI7QUFDRDtBQWxESDs7QUFBQTtBQUFBLElBQWdDLEtBQWhDO0FBb0RELENBM0REIiwiZmlsZSI6Im1vZHVsZS9jb3JlL2NvbXBvbmVudC9tdWx0aWZpZWxkL2ZpZWxkLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
