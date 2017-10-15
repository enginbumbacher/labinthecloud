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
      EuModeling = require('euglena/modeling/module'),
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
        set.add(EuModeling);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQXBwbGljYXRpb24iLCJITSIsIkdsb2JhbHMiLCJOb3RpZmljYXRpb25zIiwiRXVnbGVuYSIsIkxheW91dCIsIkV1UGFuZWxSZXN1bHQiLCJFdVBhbmVsSW50ZXJhY3RpdmUiLCJFdUhlbHAiLCJFdUxvZ2luIiwiRXVJbnRlcmFjdGl2ZVRhYnMiLCJFdUV4cGVyaW1lbnQiLCJFdVJlc3VsdHMiLCJFdUxvZ2dpbmciLCJFdU1vZGVsIiwiRXVNb2RlbE9uZUV5ZSIsIkV1TW9kZWxUd29FeWUiLCJFdU1vZGVsaW5nIiwiRXVBZ2dyZWdhdGUiLCJFdUNvbXBvbmVudE1hbmFnZXIiLCJkb21Sb290Iiwic2V0Iiwid2luZG93IiwiRXVnbGVuYUNvbmZpZyIsImhvb2siLCJhZGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGNBQWNELFFBQVEsc0JBQVIsQ0FBcEI7QUFBQSxNQUNFRSxLQUFLRixRQUFRLHlCQUFSLENBRFA7QUFBQSxNQUVFRyxVQUFVSCxRQUFRLG9CQUFSLENBRlo7QUFBQSxNQUdFSSxnQkFBZ0JKLFFBQVEsNkJBQVIsQ0FIbEI7QUFBQSxNQUlFSyxVQUFVTCxRQUFRLGdCQUFSLENBSlo7QUFBQSxNQUtFTSxTQUFTTixRQUFRLHNCQUFSLENBTFg7QUFBQSxNQU1FTyxnQkFBZ0JQLFFBQVEsNkJBQVIsQ0FObEI7QUFBQSxNQU9FUSxxQkFBcUJSLFFBQVEsa0NBQVIsQ0FQdkI7QUFBQSxNQVNFUyxTQUFTVCxRQUFRLHFCQUFSLENBVFg7QUFBQSxNQVVFVSxVQUFVVixRQUFRLHNCQUFSLENBVlo7QUFBQSxNQVdFVyxvQkFBb0JYLFFBQVEsd0JBQVIsQ0FYdEI7QUFBQSxNQWFFWSxlQUFlWixRQUFRLDJCQUFSLENBYmpCO0FBQUEsTUFlRWEsWUFBWWIsUUFBUSx1QkFBUixDQWZkO0FBQUEsTUFnQkVjLFlBQVlkLFFBQVEsd0JBQVIsQ0FoQmQ7QUFBQSxNQWtCRWUsVUFBVWYsUUFBUSxzQkFBUixDQWxCWjtBQUFBLE1BbUJFZ0IsZ0JBQWdCaEIsUUFBUSw2QkFBUixDQW5CbEI7QUFBQSxNQW9CRWlCLGdCQUFnQmpCLFFBQVEsNkJBQVIsQ0FwQmxCO0FBQUEsTUFzQkVrQixhQUFhbEIsUUFBUSx5QkFBUixDQXRCZjtBQUFBLE1Bd0JFbUIsY0FBY25CLFFBQVEsMEJBQVIsQ0F4QmhCO0FBQUEsTUEwQkVvQixxQkFBcUJwQixRQUFRLDRDQUFSLENBMUJ2QjtBQTRCQUEsVUFBUSxrQkFBUjs7QUFFQTtBQUFBOztBQUNFLGtCQUFZcUIsT0FBWixFQUFxQjtBQUFBOztBQUFBLDhHQUNiQSxPQURhOztBQUVuQmxCLGNBQVFtQixHQUFSLENBQVksV0FBWixFQUF5QkMsT0FBT0MsYUFBaEM7QUFDQXRCLFNBQUd1QixJQUFILENBQVEsdUJBQVIsRUFBaUMsWUFBTTtBQUNyQyxlQUFPLHFCQUFQO0FBQ0QsT0FGRDtBQUdBdkIsU0FBR3VCLElBQUgsQ0FBUSxxQkFBUixFQUErQixVQUFDSCxHQUFELEVBQVM7QUFDdENBLFlBQUlJLEdBQUosQ0FBUXRCLGFBQVI7QUFDQWtCLFlBQUlJLEdBQUosQ0FBUXBCLE1BQVI7QUFDQWdCLFlBQUlJLEdBQUosQ0FBUVosU0FBUjtBQUNBUSxZQUFJSSxHQUFKLENBQVFsQixrQkFBUjtBQUNBYyxZQUFJSSxHQUFKLENBQVFuQixhQUFSO0FBQ0FlLFlBQUlJLEdBQUosQ0FBUWhCLE9BQVI7QUFDQVksWUFBSUksR0FBSixDQUFRakIsTUFBUjtBQUNBYSxZQUFJSSxHQUFKLENBQVFmLGlCQUFSO0FBQ0FXLFlBQUlJLEdBQUosQ0FBUWQsWUFBUjtBQUNBVSxZQUFJSSxHQUFKLENBQVFiLFNBQVI7QUFDQVMsWUFBSUksR0FBSixDQUFRWCxPQUFSO0FBQ0FPLFlBQUlJLEdBQUosQ0FBUVYsYUFBUjtBQUNBTSxZQUFJSSxHQUFKLENBQVFULGFBQVI7QUFDQUssWUFBSUksR0FBSixDQUFRUixVQUFSO0FBQ0FJLFlBQUlJLEdBQUosQ0FBUVAsV0FBUjtBQUNBO0FBQ0FHLFlBQUlJLEdBQUosQ0FBUXJCLE9BQVI7QUFDQSxlQUFPaUIsR0FBUDtBQUNELE9BbkJEO0FBTm1CO0FBMEJwQjs7QUEzQkg7QUFBQSxJQUEwQnJCLFdBQTFCO0FBNkJELENBNUREIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBBcHBsaWNhdGlvbiA9IHJlcXVpcmUoJ2NvcmUvYXBwL2FwcGxpY2F0aW9uJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBOb3RpZmljYXRpb25zID0gcmVxdWlyZSgnbW9kdWxlL25vdGlmaWNhdGlvbnMvbW9kdWxlJyksXG4gICAgRXVnbGVuYSA9IHJlcXVpcmUoJ2V1Z2xlbmEvbW9kdWxlJyksXG4gICAgTGF5b3V0ID0gcmVxdWlyZSgnbW9kdWxlL2xheW91dC9tb2R1bGUnKSxcbiAgICBFdVBhbmVsUmVzdWx0ID0gcmVxdWlyZSgnZXVnbGVuYS9wYW5lbF9yZXN1bHQvbW9kdWxlJyksXG4gICAgRXVQYW5lbEludGVyYWN0aXZlID0gcmVxdWlyZSgnZXVnbGVuYS9wYW5lbF9pbnRlcmFjdGl2ZS9tb2R1bGUnKSxcblxuICAgIEV1SGVscCA9IHJlcXVpcmUoJ2V1Z2xlbmEvaGVscC9tb2R1bGUnKSxcbiAgICBFdUxvZ2luID0gcmVxdWlyZSgnZXVnbGVuYS9sb2dpbi9tb2R1bGUnKSxcbiAgICBFdUludGVyYWN0aXZlVGFicyA9IHJlcXVpcmUoJ2V1Z2xlbmEvaXBfdGFicy9tb2R1bGUnKSxcblxuICAgIEV1RXhwZXJpbWVudCA9IHJlcXVpcmUoJ2V1Z2xlbmEvZXhwZXJpbWVudC9tb2R1bGUnKSxcblxuICAgIEV1UmVzdWx0cyA9IHJlcXVpcmUoJ2V1Z2xlbmEvcmVzdWx0L21vZHVsZScpLFxuICAgIEV1TG9nZ2luZyA9IHJlcXVpcmUoJ2V1Z2xlbmEvbG9nZ2luZy9tb2R1bGUnKSxcblxuICAgIEV1TW9kZWwgPSByZXF1aXJlKCdldWdsZW5hL21vZGVsL21vZHVsZScpLFxuICAgIEV1TW9kZWxPbmVFeWUgPSByZXF1aXJlKCdldWdsZW5hL21vZGVsX29uZWV5ZS9tb2R1bGUnKSxcbiAgICBFdU1vZGVsVHdvRXllID0gcmVxdWlyZSgnZXVnbGVuYS9tb2RlbF90d29leWUvbW9kdWxlJyksXG5cbiAgICBFdU1vZGVsaW5nID0gcmVxdWlyZSgnZXVnbGVuYS9tb2RlbGluZy9tb2R1bGUnKSxcblxuICAgIEV1QWdncmVnYXRlID0gcmVxdWlyZSgnZXVnbGVuYS9hZ2dyZWdhdGUvbW9kdWxlJyksXG5cbiAgICBFdUNvbXBvbmVudE1hbmFnZXIgPSByZXF1aXJlKCdldWdsZW5hL2V1Z2xlbmFjb250cm9sbGVyL2NvbXBvbmVudC9tb2R1bGUnKVxuICAgIDtcbiAgcmVxdWlyZSgnbGluayEuL3N0eWxlLmNzcycpO1xuXG4gIHJldHVybiBjbGFzcyBNYWluIGV4dGVuZHMgQXBwbGljYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRvbVJvb3QpIHtcbiAgICAgIHN1cGVyKGRvbVJvb3QpO1xuICAgICAgR2xvYmFscy5zZXQoJ0FwcENvbmZpZycsIHdpbmRvdy5FdWdsZW5hQ29uZmlnKTtcbiAgICAgIEhNLmhvb2soJ0FwcGxpY2F0aW9uLlZpZXdDbGFzcycsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIFwibW9kdWxlL2V1Z2xlbmEvdmlld1wiO1xuICAgICAgfSk7XG4gICAgICBITS5ob29rKCdBcHBsaWNhdGlvbi5Nb2R1bGVzJywgKHNldCkgPT4ge1xuICAgICAgICBzZXQuYWRkKE5vdGlmaWNhdGlvbnMpO1xuICAgICAgICBzZXQuYWRkKExheW91dCk7XG4gICAgICAgIHNldC5hZGQoRXVMb2dnaW5nKTtcbiAgICAgICAgc2V0LmFkZChFdVBhbmVsSW50ZXJhY3RpdmUpO1xuICAgICAgICBzZXQuYWRkKEV1UGFuZWxSZXN1bHQpO1xuICAgICAgICBzZXQuYWRkKEV1TG9naW4pO1xuICAgICAgICBzZXQuYWRkKEV1SGVscCk7XG4gICAgICAgIHNldC5hZGQoRXVJbnRlcmFjdGl2ZVRhYnMpO1xuICAgICAgICBzZXQuYWRkKEV1RXhwZXJpbWVudCk7XG4gICAgICAgIHNldC5hZGQoRXVSZXN1bHRzKTtcbiAgICAgICAgc2V0LmFkZChFdU1vZGVsKTtcbiAgICAgICAgc2V0LmFkZChFdU1vZGVsT25lRXllKTtcbiAgICAgICAgc2V0LmFkZChFdU1vZGVsVHdvRXllKTtcbiAgICAgICAgc2V0LmFkZChFdU1vZGVsaW5nKTtcbiAgICAgICAgc2V0LmFkZChFdUFnZ3JlZ2F0ZSk7XG4gICAgICAgIC8vIHNldC5hZGQoRXVDb21wb25lbnRNYW5hZ2VyKTtcbiAgICAgICAgc2V0LmFkZChFdWdsZW5hKTtcbiAgICAgICAgcmV0dXJuIHNldDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iXX0=
