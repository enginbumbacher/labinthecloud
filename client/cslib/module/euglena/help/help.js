'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Controller = require('core/controller/controller'),
      Model = require('./model'),
      View = require('./view'),
      Globals = require('core/model/globals');

  return function (_Controller) {
    _inherits(HelpComponent, _Controller);

    function HelpComponent() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, HelpComponent);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HelpComponent).call(this, settings));

      Globals.get('Relay').addEventListener('Help.Show', _this._onShowRequest.bind(_this));
      Globals.get('Relay').addEventListener('Help.Hide', _this._onHideRequest.bind(_this));
      _this.view().addEventListener('Help.ToggleOpen', _this._onToggleRequest.bind(_this));
      return _this;
    }

    _createClass(HelpComponent, [{
      key: '_onShowRequest',
      value: function _onShowRequest(evt) {
        this._model.show();
      }
    }, {
      key: '_onHideRequest',
      value: function _onHideRequest(evt) {
        this._model.hide();
      }
    }, {
      key: '_onToggleRequest',
      value: function _onToggleRequest(evt) {
        this._model.toggle();
      }
    }]);

    return HelpComponent;
  }(Controller);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2hlbHAvaGVscC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLGFBQWEsUUFBUSw0QkFBUixDQUFuQjtBQUFBLE1BQ0UsUUFBUSxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUUsT0FBTyxRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BR0UsVUFBVSxRQUFRLG9CQUFSLENBSFo7O0FBTUE7QUFBQTs7QUFDRSw2QkFBMkI7QUFBQSxVQUFmLFFBQWUseURBQUosRUFBSTs7QUFBQTs7QUFDekIsZUFBUyxVQUFULEdBQXNCLFNBQVMsVUFBVCxJQUF1QixLQUE3QztBQUNBLGVBQVMsU0FBVCxHQUFxQixTQUFTLFNBQVQsSUFBc0IsSUFBM0M7O0FBRnlCLG1HQUduQixRQUhtQjs7QUFLekIsY0FBUSxHQUFSLENBQVksT0FBWixFQUFxQixnQkFBckIsQ0FBc0MsV0FBdEMsRUFBbUQsTUFBSyxjQUFMLENBQW9CLElBQXBCLE9BQW5EO0FBQ0EsY0FBUSxHQUFSLENBQVksT0FBWixFQUFxQixnQkFBckIsQ0FBc0MsV0FBdEMsRUFBbUQsTUFBSyxjQUFMLENBQW9CLElBQXBCLE9BQW5EO0FBQ0EsWUFBSyxJQUFMLEdBQVksZ0JBQVosQ0FBNkIsaUJBQTdCLEVBQWdELE1BQUssZ0JBQUwsQ0FBc0IsSUFBdEIsT0FBaEQ7QUFQeUI7QUFRMUI7O0FBVEg7QUFBQTtBQUFBLHFDQVdpQixHQVhqQixFQVdzQjtBQUNsQixhQUFLLE1BQUwsQ0FBWSxJQUFaO0FBQ0Q7QUFiSDtBQUFBO0FBQUEscUNBY2lCLEdBZGpCLEVBY3NCO0FBQ2xCLGFBQUssTUFBTCxDQUFZLElBQVo7QUFDRDtBQWhCSDtBQUFBO0FBQUEsdUNBaUJtQixHQWpCbkIsRUFpQndCO0FBQ3BCLGFBQUssTUFBTCxDQUFZLE1BQVo7QUFDRDtBQW5CSDs7QUFBQTtBQUFBLElBQW1DLFVBQW5DO0FBcUJELENBNUJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2hlbHAvaGVscC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
