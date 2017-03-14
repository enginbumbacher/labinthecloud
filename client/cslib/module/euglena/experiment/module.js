'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager'),
      ExperimentForm = require('./form/form'),
      Utils = require('core/util/utils'),
      LightDisplay = require('euglena/component/lightdisplay/lightdisplay');

  return function (_Module) {
    _inherits(ExperimentModule, _Module);

    function ExperimentModule() {
      _classCallCheck(this, ExperimentModule);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExperimentModule).call(this));

      Utils.bindMethods(_this, ['_hookInteractiveTabs', '_onRunRequest']);

      _this._form = new ExperimentForm();
      _this._form.view().addEventListener('Experiment.DryRun', _this._onDryRunRequest);
      _this._form.view().addEventListener('Experiment.Submit', _this._onRunRequest);

      HM.hook('InteractiveTabs.ListTabs', _this._hookInteractiveTabs, 10);
      return _this;
    }

    _createClass(ExperimentModule, [{
      key: '_hookInteractiveTabs',
      value: function _hookInteractiveTabs(list, meta) {
        list.push({
          id: "experiment",
          title: "Experiment",
          content: this._form.view()
        });
        return list;
      }
    }, {
      key: '_onRunRequest',
      value: function _onRunRequest(evt) {
        Globals.get('Relay').dispatchEvent('Results.DryRunStopRequest');
        Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentRequest', this._form.export());
      }
    }]);

    return ExperimentModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFVBQUMsT0FBRCxFQUFhO0FBQ2xCLE1BQU0sU0FBUyxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFLFVBQVUsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRSxLQUFLLFFBQVEseUJBQVIsQ0FGUDtBQUFBLE1BR0UsaUJBQWlCLFFBQVEsYUFBUixDQUhuQjtBQUFBLE1BSUUsUUFBUSxRQUFRLGlCQUFSLENBSlY7QUFBQSxNQUtFLGVBQWUsUUFBUSw2Q0FBUixDQUxqQjs7QUFRQTtBQUFBOztBQUNFLGdDQUFjO0FBQUE7O0FBQUE7O0FBRVosWUFBTSxXQUFOLFFBQXdCLENBQUMsc0JBQUQsRUFBeUIsZUFBekIsQ0FBeEI7O0FBRUEsWUFBSyxLQUFMLEdBQWEsSUFBSSxjQUFKLEVBQWI7QUFDQSxZQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLGdCQUFsQixDQUFtQyxtQkFBbkMsRUFBd0QsTUFBSyxnQkFBN0Q7QUFDQSxZQUFLLEtBQUwsQ0FBVyxJQUFYLEdBQWtCLGdCQUFsQixDQUFtQyxtQkFBbkMsRUFBd0QsTUFBSyxhQUE3RDs7QUFFQSxTQUFHLElBQUgsQ0FBUSwwQkFBUixFQUFvQyxNQUFLLG9CQUF6QyxFQUErRCxFQUEvRDtBQVJZO0FBU2I7O0FBVkg7QUFBQTtBQUFBLDJDQVl1QixJQVp2QixFQVk2QixJQVo3QixFQVltQztBQUMvQixhQUFLLElBQUwsQ0FBVTtBQUNSLGNBQUksWUFESTtBQUVSLGlCQUFPLFlBRkM7QUFHUixtQkFBUyxLQUFLLEtBQUwsQ0FBVyxJQUFYO0FBSEQsU0FBVjtBQUtBLGVBQU8sSUFBUDtBQUNEO0FBbkJIO0FBQUE7QUFBQSxvQ0FxQmdCLEdBckJoQixFQXFCcUI7QUFDakIsZ0JBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsYUFBckIsQ0FBbUMsMkJBQW5DO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLE9BQVosRUFBcUIsYUFBckIsQ0FBbUMsb0NBQW5DLEVBQXlFLEtBQUssS0FBTCxDQUFXLE1BQVgsRUFBekU7QUFDRDtBQXhCSDs7QUFBQTtBQUFBLElBQXNDLE1BQXRDO0FBMEJELENBbkNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
