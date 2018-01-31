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
      EuModelBlockly = require('euglena/model_blockly/module'),
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
        set.add(EuModelBlockly);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQXBwbGljYXRpb24iLCJITSIsIkdsb2JhbHMiLCJOb3RpZmljYXRpb25zIiwiRXVnbGVuYSIsIkxheW91dCIsIkV1UGFuZWxSZXN1bHQiLCJFdVBhbmVsSW50ZXJhY3RpdmUiLCJFdUhlbHAiLCJFdUxvZ2luIiwiRXVJbnRlcmFjdGl2ZVRhYnMiLCJFdUV4cGVyaW1lbnQiLCJFdVJlc3VsdHMiLCJFdUxvZ2dpbmciLCJFdU1vZGVsIiwiRXVNb2RlbE9uZUV5ZSIsIkV1TW9kZWxUd29FeWUiLCJFdU1vZGVsQmxvY2tseSIsIkV1QWdncmVnYXRlIiwiRXVDb21wb25lbnRNYW5hZ2VyIiwiZG9tUm9vdCIsInNldCIsIndpbmRvdyIsIkV1Z2xlbmFDb25maWciLCJob29rIiwiYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxjQUFjRCxRQUFRLHNCQUFSLENBQXBCO0FBQUEsTUFDRUUsS0FBS0YsUUFBUSx5QkFBUixDQURQO0FBQUEsTUFFRUcsVUFBVUgsUUFBUSxvQkFBUixDQUZaO0FBQUEsTUFHRUksZ0JBQWdCSixRQUFRLDZCQUFSLENBSGxCO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxnQkFBUixDQUpaO0FBQUEsTUFLRU0sU0FBU04sUUFBUSxzQkFBUixDQUxYO0FBQUEsTUFNRU8sZ0JBQWdCUCxRQUFRLDZCQUFSLENBTmxCO0FBQUEsTUFPRVEscUJBQXFCUixRQUFRLGtDQUFSLENBUHZCO0FBQUEsTUFTRVMsU0FBU1QsUUFBUSxxQkFBUixDQVRYO0FBQUEsTUFVRVUsVUFBVVYsUUFBUSxzQkFBUixDQVZaO0FBQUEsTUFXRVcsb0JBQW9CWCxRQUFRLHdCQUFSLENBWHRCO0FBQUEsTUFhRVksZUFBZVosUUFBUSwyQkFBUixDQWJqQjtBQUFBLE1BZUVhLFlBQVliLFFBQVEsdUJBQVIsQ0FmZDtBQUFBLE1BZ0JFYyxZQUFZZCxRQUFRLHdCQUFSLENBaEJkO0FBQUEsTUFrQkVlLFVBQVVmLFFBQVEsc0JBQVIsQ0FsQlo7QUFBQSxNQW1CRWdCLGdCQUFnQmhCLFFBQVEsNkJBQVIsQ0FuQmxCO0FBQUEsTUFvQkVpQixnQkFBZ0JqQixRQUFRLDZCQUFSLENBcEJsQjtBQUFBLE1Bc0JFa0IsaUJBQWlCbEIsUUFBUSw4QkFBUixDQXRCbkI7QUFBQSxNQXdCRW1CLGNBQWNuQixRQUFRLDBCQUFSLENBeEJoQjtBQUFBLE1BMEJFb0IscUJBQXFCcEIsUUFBUSw0Q0FBUixDQTFCdkI7QUE0QkFBLFVBQVEsa0JBQVI7O0FBRUE7QUFBQTs7QUFDRSxrQkFBWXFCLE9BQVosRUFBcUI7QUFBQTs7QUFBQSw4R0FDYkEsT0FEYTs7QUFFbkJsQixjQUFRbUIsR0FBUixDQUFZLFdBQVosRUFBeUJDLE9BQU9DLGFBQWhDO0FBQ0F0QixTQUFHdUIsSUFBSCxDQUFRLHVCQUFSLEVBQWlDLFlBQU07QUFDckMsZUFBTyxxQkFBUDtBQUNELE9BRkQ7QUFHQXZCLFNBQUd1QixJQUFILENBQVEscUJBQVIsRUFBK0IsVUFBQ0gsR0FBRCxFQUFTO0FBQ3RDQSxZQUFJSSxHQUFKLENBQVF0QixhQUFSO0FBQ0FrQixZQUFJSSxHQUFKLENBQVFwQixNQUFSO0FBQ0FnQixZQUFJSSxHQUFKLENBQVFaLFNBQVI7QUFDQVEsWUFBSUksR0FBSixDQUFRbEIsa0JBQVI7QUFDQWMsWUFBSUksR0FBSixDQUFRbkIsYUFBUjtBQUNBZSxZQUFJSSxHQUFKLENBQVFoQixPQUFSO0FBQ0FZLFlBQUlJLEdBQUosQ0FBUWpCLE1BQVI7QUFDQWEsWUFBSUksR0FBSixDQUFRZixpQkFBUjtBQUNBVyxZQUFJSSxHQUFKLENBQVFkLFlBQVI7QUFDQVUsWUFBSUksR0FBSixDQUFRYixTQUFSO0FBQ0FTLFlBQUlJLEdBQUosQ0FBUVgsT0FBUjtBQUNBTyxZQUFJSSxHQUFKLENBQVFWLGFBQVI7QUFDQU0sWUFBSUksR0FBSixDQUFRVCxhQUFSO0FBQ0FLLFlBQUlJLEdBQUosQ0FBUVIsY0FBUjtBQUNBSSxZQUFJSSxHQUFKLENBQVFQLFdBQVI7QUFDQTtBQUNBRyxZQUFJSSxHQUFKLENBQVFyQixPQUFSO0FBQ0EsZUFBT2lCLEdBQVA7QUFDRCxPQW5CRDtBQU5tQjtBQTBCcEI7O0FBM0JIO0FBQUEsSUFBMEJyQixXQUExQjtBQTZCRCxDQTVERCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQXBwbGljYXRpb24gPSByZXF1aXJlKCdjb3JlL2FwcC9hcHBsaWNhdGlvbicpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgTm90aWZpY2F0aW9ucyA9IHJlcXVpcmUoJ21vZHVsZS9ub3RpZmljYXRpb25zL21vZHVsZScpLFxuICAgIEV1Z2xlbmEgPSByZXF1aXJlKCdldWdsZW5hL21vZHVsZScpLFxuICAgIExheW91dCA9IHJlcXVpcmUoJ21vZHVsZS9sYXlvdXQvbW9kdWxlJyksXG4gICAgRXVQYW5lbFJlc3VsdCA9IHJlcXVpcmUoJ2V1Z2xlbmEvcGFuZWxfcmVzdWx0L21vZHVsZScpLFxuICAgIEV1UGFuZWxJbnRlcmFjdGl2ZSA9IHJlcXVpcmUoJ2V1Z2xlbmEvcGFuZWxfaW50ZXJhY3RpdmUvbW9kdWxlJyksXG5cbiAgICBFdUhlbHAgPSByZXF1aXJlKCdldWdsZW5hL2hlbHAvbW9kdWxlJyksXG4gICAgRXVMb2dpbiA9IHJlcXVpcmUoJ2V1Z2xlbmEvbG9naW4vbW9kdWxlJyksXG4gICAgRXVJbnRlcmFjdGl2ZVRhYnMgPSByZXF1aXJlKCdldWdsZW5hL2lwX3RhYnMvbW9kdWxlJyksXG5cbiAgICBFdUV4cGVyaW1lbnQgPSByZXF1aXJlKCdldWdsZW5hL2V4cGVyaW1lbnQvbW9kdWxlJyksXG5cbiAgICBFdVJlc3VsdHMgPSByZXF1aXJlKCdldWdsZW5hL3Jlc3VsdC9tb2R1bGUnKSxcbiAgICBFdUxvZ2dpbmcgPSByZXF1aXJlKCdldWdsZW5hL2xvZ2dpbmcvbW9kdWxlJyksXG5cbiAgICBFdU1vZGVsID0gcmVxdWlyZSgnZXVnbGVuYS9tb2RlbC9tb2R1bGUnKSxcbiAgICBFdU1vZGVsT25lRXllID0gcmVxdWlyZSgnZXVnbGVuYS9tb2RlbF9vbmVleWUvbW9kdWxlJyksXG4gICAgRXVNb2RlbFR3b0V5ZSA9IHJlcXVpcmUoJ2V1Z2xlbmEvbW9kZWxfdHdvZXllL21vZHVsZScpLFxuXG4gICAgRXVNb2RlbEJsb2NrbHkgPSByZXF1aXJlKCdldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlJyksXG5cbiAgICBFdUFnZ3JlZ2F0ZSA9IHJlcXVpcmUoJ2V1Z2xlbmEvYWdncmVnYXRlL21vZHVsZScpLFxuXG4gICAgRXVDb21wb25lbnRNYW5hZ2VyID0gcmVxdWlyZSgnZXVnbGVuYS9ldWdsZW5hY29udHJvbGxlci9jb21wb25lbnQvbW9kdWxlJylcbiAgICA7XG4gIHJlcXVpcmUoJ2xpbmshLi9zdHlsZS5jc3MnKTtcblxuICByZXR1cm4gY2xhc3MgTWFpbiBleHRlbmRzIEFwcGxpY2F0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihkb21Sb290KSB7XG4gICAgICBzdXBlcihkb21Sb290KTtcbiAgICAgIEdsb2JhbHMuc2V0KCdBcHBDb25maWcnLCB3aW5kb3cuRXVnbGVuYUNvbmZpZyk7XG4gICAgICBITS5ob29rKCdBcHBsaWNhdGlvbi5WaWV3Q2xhc3MnLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBcIm1vZHVsZS9ldWdsZW5hL3ZpZXdcIjtcbiAgICAgIH0pO1xuICAgICAgSE0uaG9vaygnQXBwbGljYXRpb24uTW9kdWxlcycsIChzZXQpID0+IHtcbiAgICAgICAgc2V0LmFkZChOb3RpZmljYXRpb25zKTtcbiAgICAgICAgc2V0LmFkZChMYXlvdXQpO1xuICAgICAgICBzZXQuYWRkKEV1TG9nZ2luZyk7XG4gICAgICAgIHNldC5hZGQoRXVQYW5lbEludGVyYWN0aXZlKTtcbiAgICAgICAgc2V0LmFkZChFdVBhbmVsUmVzdWx0KTtcbiAgICAgICAgc2V0LmFkZChFdUxvZ2luKTtcbiAgICAgICAgc2V0LmFkZChFdUhlbHApO1xuICAgICAgICBzZXQuYWRkKEV1SW50ZXJhY3RpdmVUYWJzKTtcbiAgICAgICAgc2V0LmFkZChFdUV4cGVyaW1lbnQpO1xuICAgICAgICBzZXQuYWRkKEV1UmVzdWx0cyk7XG4gICAgICAgIHNldC5hZGQoRXVNb2RlbCk7XG4gICAgICAgIHNldC5hZGQoRXVNb2RlbE9uZUV5ZSk7XG4gICAgICAgIHNldC5hZGQoRXVNb2RlbFR3b0V5ZSk7XG4gICAgICAgIHNldC5hZGQoRXVNb2RlbEJsb2NrbHkpO1xuICAgICAgICBzZXQuYWRkKEV1QWdncmVnYXRlKTtcbiAgICAgICAgLy8gc2V0LmFkZChFdUNvbXBvbmVudE1hbmFnZXIpO1xuICAgICAgICBzZXQuYWRkKEV1Z2xlbmEpO1xuICAgICAgICByZXR1cm4gc2V0O1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTtcbiJdfQ==
