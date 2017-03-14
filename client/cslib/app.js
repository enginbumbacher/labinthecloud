'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Application = require('core/app/application'),
      HM = require('core/event/hook_manager'),
      Globals = require('core/model/globals'),
      Euglena = require('euglena/module'),
      Layout = require('module/layout/module'),
      EuPanelResult = require('euglena/panel_result/module'),
      EuPanelInteractive = require('euglena/panel_interactive/module'),
      EuHelp = require('euglena/help/module'),
      EuLogin = require('euglena/login/module'),
      EuInteractiveTabs = require('euglena/ip_tabs/module'),
      EuExperiment = require('euglena/experiment/module'),
      EuServer = require('euglena/serverinterface/module'),
      EuComponentManager = require('euglena/euglenacontroller/component/module');
  require('link!./style.css');

  return function (_Application) {
    _inherits(Main, _Application);

    function Main(domRoot) {
      _classCallCheck(this, Main);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Main).call(this, domRoot));

      Globals.set('AppConfig', window.EuglenaConfig);
      HM.hook('Application.ViewClass', function () {
        return "module/euglena/view";
      });
      HM.hook('Application.Modules', function (set) {
        set.add(Layout);
        set.add(EuPanelInteractive);
        set.add(EuPanelResult);
        set.add(EuLogin);
        set.add(EuHelp);
        set.add(EuInteractiveTabs);
        set.add(EuExperiment);
        set.add(EuServer);
        // set.add(EuComponentManager);
        set.add(Euglena);
        return set;
      });
      return _this;
    }

    return Main;
  }(Application);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxjQUFjLFFBQVEsc0JBQVIsQ0FBcEI7QUFBQSxNQUNFLEtBQUssUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRSxVQUFVLFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BR0UsVUFBVSxRQUFRLGdCQUFSLENBSFo7QUFBQSxNQUlFLFNBQVMsUUFBUSxzQkFBUixDQUpYO0FBQUEsTUFLRSxnQkFBZ0IsUUFBUSw2QkFBUixDQUxsQjtBQUFBLE1BTUUscUJBQXFCLFFBQVEsa0NBQVIsQ0FOdkI7QUFBQSxNQVFFLFNBQVMsUUFBUSxxQkFBUixDQVJYO0FBQUEsTUFTRSxVQUFVLFFBQVEsc0JBQVIsQ0FUWjtBQUFBLE1BVUUsb0JBQW9CLFFBQVEsd0JBQVIsQ0FWdEI7QUFBQSxNQVlFLGVBQWUsUUFBUSwyQkFBUixDQVpqQjtBQUFBLE1BYUUsV0FBVyxRQUFRLGdDQUFSLENBYmI7QUFBQSxNQWVFLHFCQUFxQixRQUFRLDRDQUFSLENBZnZCO0FBaUJBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxrQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsMEZBQ2IsT0FEYTs7QUFFbkIsY0FBUSxHQUFSLENBQVksV0FBWixFQUF5QixPQUFPLGFBQWhDO0FBQ0EsU0FBRyxJQUFILENBQVEsdUJBQVIsRUFBaUMsWUFBTTtBQUNyQyxlQUFPLHFCQUFQO0FBQ0QsT0FGRDtBQUdBLFNBQUcsSUFBSCxDQUFRLHFCQUFSLEVBQStCLFVBQUMsR0FBRCxFQUFTO0FBQ3RDLFlBQUksR0FBSixDQUFRLE1BQVI7QUFDQSxZQUFJLEdBQUosQ0FBUSxrQkFBUjtBQUNBLFlBQUksR0FBSixDQUFRLGFBQVI7QUFDQSxZQUFJLEdBQUosQ0FBUSxPQUFSO0FBQ0EsWUFBSSxHQUFKLENBQVEsTUFBUjtBQUNBLFlBQUksR0FBSixDQUFRLGlCQUFSO0FBQ0EsWUFBSSxHQUFKLENBQVEsWUFBUjtBQUNBLFlBQUksR0FBSixDQUFRLFFBQVI7O0FBRUEsWUFBSSxHQUFKLENBQVEsT0FBUjtBQUNBLGVBQU8sR0FBUDtBQUNELE9BWkQ7QUFObUI7QUFtQnBCOztBQXBCSDtBQUFBLElBQTBCLFdBQTFCO0FBc0JELENBMUNEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
