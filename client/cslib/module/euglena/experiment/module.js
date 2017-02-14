'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Globals = require('core/model/globals'),
      ExperimentForm = require('./form/form'),
      Utils = require('core/util/utils'),
      LightDisplay = require('euglena/component/lightdisplay/lightdisplay');

  return function (_Module) {
    _inherits(SetupModule, _Module);

    function SetupModule() {
      _classCallCheck(this, SetupModule);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SetupModule).call(this));

      Utils.bindMethods(_this, ['_onPhaseChange', '_onDryRunRequest', '_onRunRequest']);

      _this._form = new ExperimentForm();
      _this._form.view().addEventListener('Experiment.DryRun', _this._onDryRunRequest);
      _this._form.view().addEventListener('Experiment.Submit', _this._onRunRequest);

      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      return _this;
    }

    _createClass(SetupModule, [{
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "experiment") {
          Globals.get('Relay').dispatchEvent('Help.Hide', {});
          Globals.get('Layout.panels.left').addChild(this._form.view());
        } else {
          Globals.get('Layout.panels.left').removeChild(this._form.view());
        }
      }
    }, {
      key: '_onDryRunRequest',
      value: function _onDryRunRequest(evt) {
        Globals.get('Relay').dispatchEvent('Results.DryRunRequest', this._form.export());
      }
    }, {
      key: '_onRunRequest',
      value: function _onRunRequest(evt) {
        Globals.get('Relay').dispatchEvent('Results.DryRunStopRequest');
        Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentRequest', this._form.export());
      }
    }]);

    return SetupModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sU0FBUyxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFLFVBQVUsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRSxpQkFBaUIsUUFBUSxhQUFSLENBRm5CO0FBQUEsTUFHRSxRQUFRLFFBQVEsaUJBQVIsQ0FIVjtBQUFBLE1BSUUsZUFBZSxRQUFRLDZDQUFSLENBSmpCOztBQU9BO0FBQUE7O0FBQ0UsMkJBQWM7QUFBQTs7QUFBQTs7QUFFWixZQUFNLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQixrQkFBbkIsRUFBdUMsZUFBdkMsQ0FBeEI7O0FBRUEsWUFBSyxLQUFMLEdBQWEsSUFBSSxjQUFKLEVBQWI7QUFDQSxZQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLGdCQUFsQixDQUFtQyxtQkFBbkMsRUFBd0QsTUFBSyxnQkFBN0Q7QUFDQSxZQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLGdCQUFsQixDQUFtQyxtQkFBbkMsRUFBd0QsTUFBSyxhQUE3RDs7QUFFQSxjQUFRLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBSyxjQUE5RDtBQVJZO0FBU2I7O0FBVkg7QUFBQTtBQUFBLHFDQVlpQixHQVpqQixFQVlzQjtBQUNsQixZQUFJLElBQUksSUFBSixDQUFTLEtBQVQsSUFBa0IsWUFBdEIsRUFBb0M7QUFDbEMsa0JBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsYUFBckIsQ0FBbUMsV0FBbkMsRUFBZ0QsRUFBaEQ7QUFDQSxrQkFBUSxHQUFSLENBQVksb0JBQVosRUFBa0MsUUFBbEMsQ0FBMkMsS0FBSyxLQUFMLENBQVcsSUFBWCxFQUEzQztBQUNELFNBSEQsTUFHTztBQUNMLGtCQUFRLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxXQUFsQyxDQUE4QyxLQUFLLEtBQUwsQ0FBVyxJQUFYLEVBQTlDO0FBQ0Q7QUFDRjtBQW5CSDtBQUFBO0FBQUEsdUNBcUJtQixHQXJCbkIsRUFxQndCO0FBQ3BCLGdCQUFRLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLGFBQXJCLENBQW1DLHVCQUFuQyxFQUE0RCxLQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQTVEO0FBQ0Q7QUF2Qkg7QUFBQTtBQUFBLG9DQXlCZ0IsR0F6QmhCLEVBeUJxQjtBQUNqQixnQkFBUSxHQUFSLENBQVksT0FBWixFQUFxQixhQUFyQixDQUFtQywyQkFBbkM7QUFDQSxnQkFBUSxHQUFSLENBQVksT0FBWixFQUFxQixhQUFyQixDQUFtQyxvQ0FBbkMsRUFBeUUsS0FBSyxLQUFMLENBQVcsTUFBWCxFQUF6RTtBQUNEO0FBNUJIOztBQUFBO0FBQUEsSUFBaUMsTUFBakM7QUE4QkQsQ0F0Q0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
