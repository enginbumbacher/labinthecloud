'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Application = require('core/app/application'),
      HM = require('core/event/hook_manager'),
      Globals = require('core/model/globals'),
      Euglena = require('euglena/module'),
      EuLayout = require('euglena/layout/module'),
      EuLogin = require('euglena/login/module'),
      EuHelp = require('euglena/help/module'),
      EuExperiment = require('euglena/experiment/module'),
      EuResult = require('euglena/result/module'),
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
        set.add(Euglena);
        set.add(EuLayout);
        set.add(EuLogin);
        set.add(EuHelp);
        set.add(EuExperiment);
        set.add(EuResult);
        set.add(EuServer);
        set.add(EuComponentManager);
        // set.add(module);
        return set;
      });
      return _this;
    }

    return Main;
  }(Application);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxjQUFjLFFBQVEsc0JBQVIsQ0FBcEI7QUFBQSxNQUNFLEtBQUssUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRSxVQUFVLFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BR0UsVUFBVSxRQUFRLGdCQUFSLENBSFo7QUFBQSxNQUlFLFdBQVcsUUFBUSx1QkFBUixDQUpiO0FBQUEsTUFLRSxVQUFVLFFBQVEsc0JBQVIsQ0FMWjtBQUFBLE1BTUUsU0FBUyxRQUFRLHFCQUFSLENBTlg7QUFBQSxNQU9FLGVBQWUsUUFBUSwyQkFBUixDQVBqQjtBQUFBLE1BUUUsV0FBVyxRQUFRLHVCQUFSLENBUmI7QUFBQSxNQVNFLFdBQVcsUUFBUSxnQ0FBUixDQVRiO0FBQUEsTUFVRSxxQkFBcUIsUUFBUSw0Q0FBUixDQVZ2QjtBQVlBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxrQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsMEZBQ2IsT0FEYTs7QUFFbkIsY0FBUSxHQUFSLENBQVksV0FBWixFQUF5QixPQUFPLGFBQWhDO0FBQ0EsU0FBRyxJQUFILENBQVEsdUJBQVIsRUFBaUMsWUFBTTtBQUNyQyxlQUFPLHFCQUFQO0FBQ0QsT0FGRDtBQUdBLFNBQUcsSUFBSCxDQUFRLHFCQUFSLEVBQStCLFVBQUMsR0FBRCxFQUFTO0FBQ3RDLFlBQUksR0FBSixDQUFRLE9BQVI7QUFDQSxZQUFJLEdBQUosQ0FBUSxRQUFSO0FBQ0EsWUFBSSxHQUFKLENBQVEsT0FBUjtBQUNBLFlBQUksR0FBSixDQUFRLE1BQVI7QUFDQSxZQUFJLEdBQUosQ0FBUSxZQUFSO0FBQ0EsWUFBSSxHQUFKLENBQVEsUUFBUjtBQUNBLFlBQUksR0FBSixDQUFRLFFBQVI7QUFDQSxZQUFJLEdBQUosQ0FBUSxrQkFBUjs7QUFFQSxlQUFPLEdBQVA7QUFDRCxPQVhEO0FBTm1CO0FBa0JwQjs7QUFuQkg7QUFBQSxJQUEwQixXQUExQjtBQXFCRCxDQXBDRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
