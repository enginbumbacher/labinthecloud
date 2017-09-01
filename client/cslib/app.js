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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQXBwbGljYXRpb24iLCJITSIsIkdsb2JhbHMiLCJOb3RpZmljYXRpb25zIiwiRXVnbGVuYSIsIkxheW91dCIsIkV1UGFuZWxSZXN1bHQiLCJFdVBhbmVsSW50ZXJhY3RpdmUiLCJFdUhlbHAiLCJFdUxvZ2luIiwiRXVJbnRlcmFjdGl2ZVRhYnMiLCJFdUV4cGVyaW1lbnQiLCJFdVJlc3VsdHMiLCJFdUxvZ2dpbmciLCJFdU1vZGVsIiwiRXVNb2RlbE9uZUV5ZSIsIkV1TW9kZWxUd29FeWUiLCJFdUFnZ3JlZ2F0ZSIsIkV1Q29tcG9uZW50TWFuYWdlciIsImRvbVJvb3QiLCJzZXQiLCJ3aW5kb3ciLCJFdWdsZW5hQ29uZmlnIiwiaG9vayIsImFkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsY0FBY0QsUUFBUSxzQkFBUixDQUFwQjtBQUFBLE1BQ0VFLEtBQUtGLFFBQVEseUJBQVIsQ0FEUDtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BR0VJLGdCQUFnQkosUUFBUSw2QkFBUixDQUhsQjtBQUFBLE1BSUVLLFVBQVVMLFFBQVEsZ0JBQVIsQ0FKWjtBQUFBLE1BS0VNLFNBQVNOLFFBQVEsc0JBQVIsQ0FMWDtBQUFBLE1BTUVPLGdCQUFnQlAsUUFBUSw2QkFBUixDQU5sQjtBQUFBLE1BT0VRLHFCQUFxQlIsUUFBUSxrQ0FBUixDQVB2QjtBQUFBLE1BU0VTLFNBQVNULFFBQVEscUJBQVIsQ0FUWDtBQUFBLE1BVUVVLFVBQVVWLFFBQVEsc0JBQVIsQ0FWWjtBQUFBLE1BV0VXLG9CQUFvQlgsUUFBUSx3QkFBUixDQVh0QjtBQUFBLE1BYUVZLGVBQWVaLFFBQVEsMkJBQVIsQ0FiakI7QUFBQSxNQWVFYSxZQUFZYixRQUFRLHVCQUFSLENBZmQ7QUFBQSxNQWdCRWMsWUFBWWQsUUFBUSx3QkFBUixDQWhCZDtBQUFBLE1Ba0JFZSxVQUFVZixRQUFRLHNCQUFSLENBbEJaO0FBQUEsTUFtQkVnQixnQkFBZ0JoQixRQUFRLDZCQUFSLENBbkJsQjtBQUFBLE1Bb0JFaUIsZ0JBQWdCakIsUUFBUSw2QkFBUixDQXBCbEI7QUFBQSxNQXNCRWtCLGNBQWNsQixRQUFRLDBCQUFSLENBdEJoQjtBQUFBLE1Bd0JFbUIscUJBQXFCbkIsUUFBUSw0Q0FBUixDQXhCdkI7QUEwQkFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxrQkFBWW9CLE9BQVosRUFBcUI7QUFBQTs7QUFBQSw4R0FDYkEsT0FEYTs7QUFFbkJqQixjQUFRa0IsR0FBUixDQUFZLFdBQVosRUFBeUJDLE9BQU9DLGFBQWhDO0FBQ0FyQixTQUFHc0IsSUFBSCxDQUFRLHVCQUFSLEVBQWlDLFlBQU07QUFDckMsZUFBTyxxQkFBUDtBQUNELE9BRkQ7QUFHQXRCLFNBQUdzQixJQUFILENBQVEscUJBQVIsRUFBK0IsVUFBQ0gsR0FBRCxFQUFTO0FBQ3RDQSxZQUFJSSxHQUFKLENBQVFyQixhQUFSO0FBQ0FpQixZQUFJSSxHQUFKLENBQVFuQixNQUFSO0FBQ0FlLFlBQUlJLEdBQUosQ0FBUVgsU0FBUjtBQUNBTyxZQUFJSSxHQUFKLENBQVFqQixrQkFBUjtBQUNBYSxZQUFJSSxHQUFKLENBQVFsQixhQUFSO0FBQ0FjLFlBQUlJLEdBQUosQ0FBUWYsT0FBUjtBQUNBVyxZQUFJSSxHQUFKLENBQVFoQixNQUFSO0FBQ0FZLFlBQUlJLEdBQUosQ0FBUWQsaUJBQVI7QUFDQVUsWUFBSUksR0FBSixDQUFRYixZQUFSO0FBQ0FTLFlBQUlJLEdBQUosQ0FBUVosU0FBUjtBQUNBUSxZQUFJSSxHQUFKLENBQVFWLE9BQVI7QUFDQU0sWUFBSUksR0FBSixDQUFRVCxhQUFSO0FBQ0FLLFlBQUlJLEdBQUosQ0FBUVIsYUFBUjtBQUNBSSxZQUFJSSxHQUFKLENBQVFQLFdBQVI7QUFDQTtBQUNBRyxZQUFJSSxHQUFKLENBQVFwQixPQUFSO0FBQ0EsZUFBT2dCLEdBQVA7QUFDRCxPQWxCRDtBQU5tQjtBQXlCcEI7O0FBMUJIO0FBQUEsSUFBMEJwQixXQUExQjtBQTRCRCxDQXpERCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKCdjb3JlL2FwcC9hcHBsaWNhdGlvbicpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgTm90aWZpY2F0aW9ucyA9IHJlcXVpcmUoJ21vZHVsZS9ub3RpZmljYXRpb25zL21vZHVsZScpLFxuICAgIEV1Z2xlbmEgPSByZXF1aXJlKCdldWdsZW5hL21vZHVsZScpLFxuICAgIExheW91dCA9IHJlcXVpcmUoJ21vZHVsZS9sYXlvdXQvbW9kdWxlJyksXG4gICAgRXVQYW5lbFJlc3VsdCA9IHJlcXVpcmUoJ2V1Z2xlbmEvcGFuZWxfcmVzdWx0L21vZHVsZScpLFxuICAgIEV1UGFuZWxJbnRlcmFjdGl2ZSA9IHJlcXVpcmUoJ2V1Z2xlbmEvcGFuZWxfaW50ZXJhY3RpdmUvbW9kdWxlJyksXG5cbiAgICBFdUhlbHAgPSByZXF1aXJlKCdldWdsZW5hL2hlbHAvbW9kdWxlJyksXG4gICAgRXVMb2dpbiA9IHJlcXVpcmUoJ2V1Z2xlbmEvbG9naW4vbW9kdWxlJyksXG4gICAgRXVJbnRlcmFjdGl2ZVRhYnMgPSByZXF1aXJlKCdldWdsZW5hL2lwX3RhYnMvbW9kdWxlJyksXG5cbiAgICBFdUV4cGVyaW1lbnQgPSByZXF1aXJlKCdldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlJyksXG5cbiAgICBFdVJlc3VsdHMgPSByZXF1aXJlKCdldWdsZW5hL3Jlc3VsdC9tb2R1bGUnKSxcbiAgICBFdUxvZ2dpbmcgPSByZXF1aXJlKCdldWdsZW5hL2xvZ2dpbmcvbW9kdWxlJyksXG5cbiAgICBFdU1vZGVsID0gcmVxdWlyZSgnZXVnbGVuYS9tb2RlbC9tb2R1bGUnKSxcbiAgICBFdU1vZGVsT25lRXllID0gcmVxdWlyZSgnZXVnbGVuYS9tb2RlbF9vbmVleWUvbW9kdWxlJyksXG4gICAgRXVNb2RlbFR3b0V5ZSA9IHJlcXVpcmUoJ2V1Z2xlbmEvbW9kZWxfdHdvZXllL21vZHVsZScpLFxuXG4gICAgRXVBZ2dyZWdhdGUgPSByZXF1aXJlKCdldWdsZW5hL2FnZ3JlZ2F0ZS9tb2R1bGUnKSxcblxuICAgIEV1Q29tcG9uZW50TWFuYWdlciA9IHJlcXVpcmUoJ2V1Z2xlbmEvZXVnbGVuYWNvbnRyb2xsZXIvY29tcG9uZW50L21vZHVsZScpXG4gICAgO1xuICByZXF1aXJlKCdsaW5rIS4vc3R5bGUuY3NzJyk7XG5cbiAgcmV0dXJuIGNsYXNzIE1haW4gZXh0ZW5kcyBBcHBsaWNhdGlvbiB7XG4gICAgY29uc3RydWN0b3IoZG9tUm9vdCkge1xuICAgICAgc3VwZXIoZG9tUm9vdCk7XG4gICAgICBHbG9iYWxzLnNldCgnQXBwQ29uZmlnJywgd2luZG93LkV1Z2xlbmFDb25maWcpO1xuICAgICAgSE0uaG9vaygnQXBwbGljYXRpb24uVmlld0NsYXNzJywgKCkgPT4ge1xuICAgICAgICByZXR1cm4gXCJtb2R1bGUvZXVnbGVuYS92aWV3XCI7XG4gICAgICB9KTtcbiAgICAgIEhNLmhvb2soJ0FwcGxpY2F0aW9uLk1vZHVsZXMnLCAoc2V0KSA9PiB7XG4gICAgICAgIHNldC5hZGQoTm90aWZpY2F0aW9ucyk7XG4gICAgICAgIHNldC5hZGQoTGF5b3V0KTtcbiAgICAgICAgc2V0LmFkZChFdUxvZ2dpbmcpO1xuICAgICAgICBzZXQuYWRkKEV1UGFuZWxJbnRlcmFjdGl2ZSk7XG4gICAgICAgIHNldC5hZGQoRXVQYW5lbFJlc3VsdCk7XG4gICAgICAgIHNldC5hZGQoRXVMb2dpbik7XG4gICAgICAgIHNldC5hZGQoRXVIZWxwKTtcbiAgICAgICAgc2V0LmFkZChFdUludGVyYWN0aXZlVGFicyk7XG4gICAgICAgIHNldC5hZGQoRXVFeHBlcmltZW50KTtcbiAgICAgICAgc2V0LmFkZChFdVJlc3VsdHMpO1xuICAgICAgICBzZXQuYWRkKEV1TW9kZWwpO1xuICAgICAgICBzZXQuYWRkKEV1TW9kZWxPbmVFeWUpO1xuICAgICAgICBzZXQuYWRkKEV1TW9kZWxUd29FeWUpO1xuICAgICAgICBzZXQuYWRkKEV1QWdncmVnYXRlKTtcbiAgICAgICAgLy8gc2V0LmFkZChFdUNvbXBvbmVudE1hbmFnZXIpO1xuICAgICAgICBzZXQuYWRkKEV1Z2xlbmEpO1xuICAgICAgICByZXR1cm4gc2V0O1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTsiXX0=
