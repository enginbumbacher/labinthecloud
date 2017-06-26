'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Application = require('core/app/application'),
      HM = require('core/event/hook_manager'),
      Globals = require('core/model/globals'),
      Notifications = require('module/notifications/module'),
      Euglena = require('euglena/module'),
      Layout = require('module/layout/module'),
      EuPanelResult = require('euglena/panel_result/module'),
      EuPanelInteractive = require('euglena/panel_interactive/module'),
      EuHelp = require('euglena/help/module'),
      EuLogin = require('euglena/login/module'),
      EuInteractiveTabs = require('euglena/ip_tabs/module'),
      EuExperiment = require('euglena/experiment/module'),
      EuResults = require('euglena/result/module'),
      EuLogging = require('euglena/logging/module'),
      EuModel = require('euglena/model/module'),
      EuModelOneEye = require('euglena/model_oneeye/module'),
      EuModelTwoEye = require('euglena/model_twoeye/module'),
      EuAggregate = require('euglena/aggregate/module'),
      EuComponentManager = require('euglena/euglenacontroller/component/module');
  require('link!./style.css');

  return function (_Application) {
    _inherits(Main, _Application);

    function Main(domRoot) {
      _classCallCheck(this, Main);

      var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, domRoot));

      Globals.set('AppConfig', window.EuglenaConfig);
      HM.hook('Application.ViewClass', function () {
        return "module/euglena/view";
      });
      HM.hook('Application.Modules', function (set) {
        set.add(Notifications);
        set.add(Layout);
        set.add(EuLogging);
        set.add(EuPanelInteractive);
        set.add(EuPanelResult);
        set.add(EuLogin);
        set.add(EuHelp);
        set.add(EuInteractiveTabs);
        set.add(EuExperiment);
        set.add(EuResults);
        set.add(EuModel);
        set.add(EuModelOneEye);
        set.add(EuModelTwoEye);
        set.add(EuAggregate);
        // set.add(EuComponentManager);
        set.add(Euglena);
        return set;
      });
      return _this;
    }

    return Main;
  }(Application);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQXBwbGljYXRpb24iLCJITSIsIkdsb2JhbHMiLCJOb3RpZmljYXRpb25zIiwiRXVnbGVuYSIsIkxheW91dCIsIkV1UGFuZWxSZXN1bHQiLCJFdVBhbmVsSW50ZXJhY3RpdmUiLCJFdUhlbHAiLCJFdUxvZ2luIiwiRXVJbnRlcmFjdGl2ZVRhYnMiLCJFdUV4cGVyaW1lbnQiLCJFdVJlc3VsdHMiLCJFdUxvZ2dpbmciLCJFdU1vZGVsIiwiRXVNb2RlbE9uZUV5ZSIsIkV1TW9kZWxUd29FeWUiLCJFdUFnZ3JlZ2F0ZSIsIkV1Q29tcG9uZW50TWFuYWdlciIsImRvbVJvb3QiLCJzZXQiLCJ3aW5kb3ciLCJFdWdsZW5hQ29uZmlnIiwiaG9vayIsImFkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsY0FBY0QsUUFBUSxzQkFBUixDQUFwQjtBQUFBLE1BQ0VFLEtBQUtGLFFBQVEseUJBQVIsQ0FEUDtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BR0VJLGdCQUFnQkosUUFBUSw2QkFBUixDQUhsQjtBQUFBLE1BSUVLLFVBQVVMLFFBQVEsZ0JBQVIsQ0FKWjtBQUFBLE1BS0VNLFNBQVNOLFFBQVEsc0JBQVIsQ0FMWDtBQUFBLE1BTUVPLGdCQUFnQlAsUUFBUSw2QkFBUixDQU5sQjtBQUFBLE1BT0VRLHFCQUFxQlIsUUFBUSxrQ0FBUixDQVB2QjtBQUFBLE1BU0VTLFNBQVNULFFBQVEscUJBQVIsQ0FUWDtBQUFBLE1BVUVVLFVBQVVWLFFBQVEsc0JBQVIsQ0FWWjtBQUFBLE1BV0VXLG9CQUFvQlgsUUFBUSx3QkFBUixDQVh0QjtBQUFBLE1BYUVZLGVBQWVaLFFBQVEsMkJBQVIsQ0FiakI7QUFBQSxNQWVFYSxZQUFZYixRQUFRLHVCQUFSLENBZmQ7QUFBQSxNQWdCRWMsWUFBWWQsUUFBUSx3QkFBUixDQWhCZDtBQUFBLE1Ba0JFZSxVQUFVZixRQUFRLHNCQUFSLENBbEJaO0FBQUEsTUFtQkVnQixnQkFBZ0JoQixRQUFRLDZCQUFSLENBbkJsQjtBQUFBLE1Bb0JFaUIsZ0JBQWdCakIsUUFBUSw2QkFBUixDQXBCbEI7QUFBQSxNQXNCRWtCLGNBQWNsQixRQUFRLDBCQUFSLENBdEJoQjtBQUFBLE1Bd0JFbUIscUJBQXFCbkIsUUFBUSw0Q0FBUixDQXhCdkI7QUEwQkFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxrQkFBWW9CLE9BQVosRUFBcUI7QUFBQTs7QUFBQSw4R0FDYkEsT0FEYTs7QUFFbkJqQixjQUFRa0IsR0FBUixDQUFZLFdBQVosRUFBeUJDLE9BQU9DLGFBQWhDO0FBQ0FyQixTQUFHc0IsSUFBSCxDQUFRLHVCQUFSLEVBQWlDLFlBQU07QUFDckMsZUFBTyxxQkFBUDtBQUNELE9BRkQ7QUFHQXRCLFNBQUdzQixJQUFILENBQVEscUJBQVIsRUFBK0IsVUFBQ0gsR0FBRCxFQUFTO0FBQ3RDQSxZQUFJSSxHQUFKLENBQVFyQixhQUFSO0FBQ0FpQixZQUFJSSxHQUFKLENBQVFuQixNQUFSO0FBQ0FlLFlBQUlJLEdBQUosQ0FBUVgsU0FBUjtBQUNBTyxZQUFJSSxHQUFKLENBQVFqQixrQkFBUjtBQUNBYSxZQUFJSSxHQUFKLENBQVFsQixhQUFSO0FBQ0FjLFlBQUlJLEdBQUosQ0FBUWYsT0FBUjtBQUNBVyxZQUFJSSxHQUFKLENBQVFoQixNQUFSO0FBQ0FZLFlBQUlJLEdBQUosQ0FBUWQsaUJBQVI7QUFDQVUsWUFBSUksR0FBSixDQUFRYixZQUFSO0FBQ0FTLFlBQUlJLEdBQUosQ0FBUVosU0FBUjtBQUNBUSxZQUFJSSxHQUFKLENBQVFWLE9BQVI7QUFDQU0sWUFBSUksR0FBSixDQUFRVCxhQUFSO0FBQ0FLLFlBQUlJLEdBQUosQ0FBUVIsYUFBUjtBQUNBSSxZQUFJSSxHQUFKLENBQVFQLFdBQVI7QUFDQTtBQUNBRyxZQUFJSSxHQUFKLENBQVFwQixPQUFSO0FBQ0EsZUFBT2dCLEdBQVA7QUFDRCxPQWxCRDtBQU5tQjtBQXlCcEI7O0FBMUJIO0FBQUEsSUFBMEJwQixXQUExQjtBQTRCRCxDQXpERCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
