'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Model = require('core/model/model'),
      defaults = {
    cards: [],
    display: false
  };

  return function (_Model) {
    _inherits(LocalModalModel, _Model);

    function LocalModalModel(config) {
      _classCallCheck(this, LocalModalModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (LocalModalModel.__proto__ || Object.getPrototypeOf(LocalModalModel)).call(this, config));
    }

    _createClass(LocalModalModel, [{
      key: 'push',
      value: function push(content) {
        var cards = this.get('cards');
        cards.push(content);
        this.set('cards', cards);
        this.dispatchEvent('LocalModal.CardAdded', {
          card: content
        });
      }
    }, {
      key: 'pop',
      value: function pop() {
        var cards = this.get('cards');
        var popped = cards.pop();
        this.set('cards', cards);
        this.dispatchEvent('LocalModal.CardRemoved', {
          card: popped
        });
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.set('cards', []);
        this.dispatchEvent('LocalModal.CardsCleared', {});
      }
    }]);

    return LocalModalModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9sb2NhbG1vZGFsL21vZGVsLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZGVsIiwiZGVmYXVsdHMiLCJjYXJkcyIsImRpc3BsYXkiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImNvbnRlbnQiLCJnZXQiLCJwdXNoIiwic2V0IiwiZGlzcGF0Y2hFdmVudCIsImNhcmQiLCJwb3BwZWQiLCJwb3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFFBQVFKLFFBQVEsa0JBQVIsQ0FBZDtBQUFBLE1BQ0VLLFdBQVc7QUFDVEMsV0FBTyxFQURFO0FBRVRDLGFBQVM7QUFGQSxHQURiOztBQU1BO0FBQUE7O0FBQ0UsNkJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFDbEJBLGFBQU9ILFFBQVAsR0FBa0JKLE1BQU1RLGNBQU4sQ0FBcUJELE9BQU9ILFFBQTVCLEVBQXNDQSxRQUF0QyxDQUFsQjtBQURrQiwrSEFFWkcsTUFGWTtBQUduQjs7QUFKSDtBQUFBO0FBQUEsMkJBS09FLE9BTFAsRUFLZ0I7QUFDWixZQUFNSixRQUFRLEtBQUtLLEdBQUwsQ0FBUyxPQUFULENBQWQ7QUFDQUwsY0FBTU0sSUFBTixDQUFXRixPQUFYO0FBQ0EsYUFBS0csR0FBTCxDQUFTLE9BQVQsRUFBa0JQLEtBQWxCO0FBQ0EsYUFBS1EsYUFBTCxDQUFtQixzQkFBbkIsRUFBMkM7QUFDekNDLGdCQUFNTDtBQURtQyxTQUEzQztBQUdEO0FBWkg7QUFBQTtBQUFBLDRCQWNRO0FBQ0osWUFBTUosUUFBUSxLQUFLSyxHQUFMLENBQVMsT0FBVCxDQUFkO0FBQ0EsWUFBTUssU0FBU1YsTUFBTVcsR0FBTixFQUFmO0FBQ0EsYUFBS0osR0FBTCxDQUFTLE9BQVQsRUFBa0JQLEtBQWxCO0FBQ0EsYUFBS1EsYUFBTCxDQUFtQix3QkFBbkIsRUFBNkM7QUFDM0NDLGdCQUFNQztBQURxQyxTQUE3QztBQUdEO0FBckJIO0FBQUE7QUFBQSw4QkF1QlU7QUFDTixhQUFLSCxHQUFMLENBQVMsT0FBVCxFQUFrQixFQUFsQjtBQUNBLGFBQUtDLGFBQUwsQ0FBbUIseUJBQW5CLEVBQThDLEVBQTlDO0FBQ0Q7QUExQkg7O0FBQUE7QUFBQSxJQUFxQ1YsS0FBckM7QUE0QkQsQ0F2Q0QiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2xvY2FsbW9kYWwvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuICBcbiAgY29uc3QgTW9kZWwgPSByZXF1aXJlKCdjb3JlL21vZGVsL21vZGVsJyksXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBjYXJkczogW10sXG4gICAgICBkaXNwbGF5OiBmYWxzZVxuICAgIH07XG5cbiAgcmV0dXJuIGNsYXNzIExvY2FsTW9kYWxNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICB9XG4gICAgcHVzaChjb250ZW50KSB7XG4gICAgICBjb25zdCBjYXJkcyA9IHRoaXMuZ2V0KCdjYXJkcycpXG4gICAgICBjYXJkcy5wdXNoKGNvbnRlbnQpXG4gICAgICB0aGlzLnNldCgnY2FyZHMnLCBjYXJkcylcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnTG9jYWxNb2RhbC5DYXJkQWRkZWQnLCB7XG4gICAgICAgIGNhcmQ6IGNvbnRlbnRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBvcCgpIHtcbiAgICAgIGNvbnN0IGNhcmRzID0gdGhpcy5nZXQoJ2NhcmRzJylcbiAgICAgIGNvbnN0IHBvcHBlZCA9IGNhcmRzLnBvcCgpO1xuICAgICAgdGhpcy5zZXQoJ2NhcmRzJywgY2FyZHMpXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0xvY2FsTW9kYWwuQ2FyZFJlbW92ZWQnLCB7XG4gICAgICAgIGNhcmQ6IHBvcHBlZFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICB0aGlzLnNldCgnY2FyZHMnLCBbXSlcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnTG9jYWxNb2RhbC5DYXJkc0NsZWFyZWQnLCB7fSlcbiAgICB9XG4gIH1cbn0pIl19
