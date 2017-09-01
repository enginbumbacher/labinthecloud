'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      BPUConnector = require('./bpu_connector'),
      DemoConnector = require('./demo_connector'),
      EugUtils = require('euglena/utils');

  return function (_Module) {
    _inherits(EuglenaServerModule, _Module);

    function EuglenaServerModule() {
      _classCallCheck(this, EuglenaServerModule);

      var _this = _possibleConstructorReturn(this, (EuglenaServerModule.__proto__ || Object.getPrototypeOf(EuglenaServerModule)).call(this));

      Utils.bindMethods(_this, ['_onExperimentRequest', '_onExperimentUpdate', '_onSubmissionError', '_onQueueError', '_onExperimentReady']);

      Globals.set('euglenaServerMode', 'bpu');
      _this.bpu = new BPUConnector();
      _this.bpu.addEventListener('BPUController.Error.Submission', _this._onSubmissionError);
      _this.bpu.addEventListener('BPUController.Error.Queue', _this._onQueueError);
      _this.bpu.addEventListener('BPUController.Experiment.Update', _this._onExperimentUpdate);
      _this.bpu.addEventListener('BPUController.Experiment.Ready', _this._onExperimentReady);

      _this._experiments = [];

      Globals.get('Relay').addEventListener('ExperimentServer.ExperimentRequest', _this._onExperimentRequest);
      return _this;
    }

    _createClass(EuglenaServerModule, [{
      key: 'init',
      value: function init() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          _this2.bpu.addEventListener('BPUController.Ready', function (evt) {
            resolve(true);
          });
          _this2.bpu.addEventListener('BPUController.Error.Connection', function (evt) {
            reject(evt.data.error);
          });
          _this2.bpu.addEventListener('BPUController.Error.ConnectionRefused', function (evt) {
            _this2.demo = new DemoConnector();
            _this2.demo.addEventListener('DemoController.Experiment.Update', _this2._onExperimentUpdate);
            _this2.demo.addEventListener('DemoController.Experiment.Ready', _this2._onExperimentReady);
            _this2.demo.init();
            Globals.set('euglenaServerMode', 'demo');
            Globals.get('Relay').dispatchEvent('Notifications.Add', {
              id: "demo_mode",
              type: "notice",
              message: "Demo Mode"
            });
            resolve(true);
          });
          _this2.bpu.init();
        });
      }
    }, {
      key: '_onSubmissionError',
      value: function _onSubmissionError(evt) {
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: "submission_rejected",
          type: "error",
          message: 'Submission rejected: ' + evt.data.error
        });
        Globals.get('Relay').dispatchEvent('ExperimentServer.Failure', {
          error: 'Submission rejected: ' + evt.data.error
        });
      }
    }, {
      key: '_onQueueError',
      value: function _onQueueError(evt) {
        Globals.get('Relay').dispatchEvent('Notifications.Add', {
          id: "submission_rejected",
          type: "error",
          message: 'Queue request rejected: ' + evt.data.error
        });
        Globals.get('Relay').dispatchEvent('ExperimentServer.Failure', {
          error: 'Queue request rejected: ' + evt.data.error
        });
      }
    }, {
      key: '_onExperimentUpdate',
      value: function _onExperimentUpdate(evt) {
        Globals.get('Relay').dispatchEvent('ExperimentServer.Update', evt.data);
      }
    }, {
      key: '_onExperimentReady',
      value: function _onExperimentReady(evt) {
        var original = evt.data.data;
        var report = original.experiment;
        Globals.get('Relay').dispatchEvent('ExperimentServer.Update', {
          experiment_id: report.exp_metaData.ExpName,
          remaining_estimate: 0,
          status: "downloading"
        });
        EugUtils.generateResults({
          bpu_api_id: report.exp_metaData.ExpName,
          experimentId: report.exp_metaData.tag
        }).then(function (data) {
          Globals.get('Relay').dispatchEvent('ExperimentServer.Results', data);
          return data;
        }).catch(function (err) {
          Globals.get('Relay').dispatchEvent('Notifications.Add', {
            id: "result_submission_error",
            type: "error",
            message: 'Results saving error: ' + err
          });
          Globals.get('Relay').dispatchEvent('ExperimentServer.Failure', {
            error: 'Results saving error: ' + err
          });
        });
      }
    }, {
      key: '_onExperimentRequest',
      value: function _onExperimentRequest(evt) {
        var _this3 = this;

        var lightData = [];
        var timeAccumulated = 0;
        evt.data.lights.forEach(function (ld) {
          lightData.push({
            topValue: ld.top,
            rightValue: ld.right,
            bottomValue: ld.bottom,
            leftValue: ld.left,
            time: timeAccumulated
          });
          timeAccumulated += ld.duration * 1000;
        });

        Utils.promiseAjax("/api/v1/Experiments", {
          method: "POST",
          data: JSON.stringify({
            studentId: Globals.get('student_id'),
            configuration: evt.data.lights,
            lab: Globals.get('AppConfig.lab')
          }),
          contentType: 'application/json'
        }).then(function (data) {
          Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentSaved', {
            experiment: data
          });
          if (Globals.get('euglenaServerMode') == 'demo') {
            _this3.demo.runExperiment(lightData, data.id);
          } else {
            _this3.bpu.runExperiment(lightData, data.id);
          }
        }).catch(function (err) {
          Globals.get('Relay').dispatchEvent('Notifications.Add', {
            id: "experiment_submission_error",
            type: "error",
            message: 'Experiment saving error: ' + err
          });
          Globals.get('Relay').dispatchEvent('ExperimentServer.Failure', {
            error: 'Experiment saving error: ' + err
          });
        });
      }
    }]);

    return EuglenaServerModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQlBVQ29ubmVjdG9yIiwiRGVtb0Nvbm5lY3RvciIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJicHUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU3VibWlzc2lvbkVycm9yIiwiX29uUXVldWVFcnJvciIsIl9vbkV4cGVyaW1lbnRVcGRhdGUiLCJfb25FeHBlcmltZW50UmVhZHkiLCJfZXhwZXJpbWVudHMiLCJnZXQiLCJfb25FeHBlcmltZW50UmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXZ0IiwiZGF0YSIsImVycm9yIiwiZGVtbyIsImluaXQiLCJkaXNwYXRjaEV2ZW50IiwiaWQiLCJ0eXBlIiwibWVzc2FnZSIsIm9yaWdpbmFsIiwicmVwb3J0IiwiZXhwZXJpbWVudCIsImV4cGVyaW1lbnRfaWQiLCJleHBfbWV0YURhdGEiLCJFeHBOYW1lIiwicmVtYWluaW5nX2VzdGltYXRlIiwic3RhdHVzIiwiZ2VuZXJhdGVSZXN1bHRzIiwiYnB1X2FwaV9pZCIsImV4cGVyaW1lbnRJZCIsInRhZyIsInRoZW4iLCJjYXRjaCIsImVyciIsImxpZ2h0RGF0YSIsInRpbWVBY2N1bXVsYXRlZCIsImxpZ2h0cyIsImZvckVhY2giLCJsZCIsInB1c2giLCJ0b3BWYWx1ZSIsInRvcCIsInJpZ2h0VmFsdWUiLCJyaWdodCIsImJvdHRvbVZhbHVlIiwiYm90dG9tIiwibGVmdFZhbHVlIiwibGVmdCIsInRpbWUiLCJkdXJhdGlvbiIsInByb21pc2VBamF4IiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0dWRlbnRJZCIsImNvbmZpZ3VyYXRpb24iLCJsYWIiLCJjb250ZW50VHlwZSIsInJ1bkV4cGVyaW1lbnQiXSwibWFwcGluZ3Mi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QUhjLFdBQWYsQ0FGaUM7QUFPdkNvRCx1QkFBYTtBQVAwQixTQUF6QyxFQVFHMUIsSUFSSCxDQVFRLFVBQUNwQixJQUFELEVBQVU7QUFDaEJuQixrQkFBUWEsR0FBUixDQUFZLE9BQVosRUFBcUJVLGFBQXJCLENBQW1DLGtDQUFuQyxFQUF1RTtBQUNyRU0sd0JBQVlWO0FBRHlELFdBQXZFO0FBR0EsY0FBSW5CLFFBQVFhLEdBQVIsQ0FBWSxtQkFBWixLQUFvQyxNQUF4QyxFQUFnRDtBQUM5QyxtQkFBS1EsSUFBTCxDQUFVNkMsYUFBVixDQUF3QnhCLFNBQXhCLEVBQW1DdkIsS0FBS0ssRUFBeEM7QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBS2xCLEdBQUwsQ0FBUzRELGFBQVQsQ0FBdUJ4QixTQUF2QixFQUFrQ3ZCLEtBQUtLLEVBQXZDO0FBQ0Q7QUFDRixTQWpCRCxFQWlCR2dCLEtBakJILENBaUJTLFVBQUNDLEdBQUQsRUFBUztBQUNoQnpDLGtCQUFRYSxHQUFSLENBQVksT0FBWixFQUFxQlUsYUFBckIsQ0FBbUMsbUJBQW5DLEVBQXdEO0FBQ3REQyxnQkFBSSw2QkFEa0Q7QUFFdERDLGtCQUFNLE9BRmdEO0FBR3REQyxtREFBcUNlO0FBSGlCLFdBQXhEO0FBS0F6QyxrQkFBUWEsR0FBUixDQUFZLE9BQVosRUFBcUJVLGFBQXJCLENBQW1DLDBCQUFuQyxFQUErRDtBQUM3REgsaURBQW1DcUI7QUFEMEIsV0FBL0Q7QUFHRCxTQTFCRDtBQTJCRDtBQTNJSDs7QUFBQTtBQUFBLElBQXlDM0MsTUFBekM7QUE2SUQsQ0F0SkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9zZXJ2ZXJpbnRlcmZhY2UvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEJQVUNvbm5lY3RvciA9IHJlcXVpcmUoJy4vYnB1X2Nvbm5lY3RvcicpLFxuICAgIERlbW9Db25uZWN0b3IgPSByZXF1aXJlKCcuL2RlbW9fY29ubmVjdG9yJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBFdWdsZW5hU2VydmVyTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRSZXF1ZXN0J1xuICAgICAgICAsICdfb25FeHBlcmltZW50VXBkYXRlJ1xuICAgICAgICAsICdfb25TdWJtaXNzaW9uRXJyb3InXG4gICAgICAgICwgJ19vblF1ZXVlRXJyb3InXG4gICAgICAgICwgJ19vbkV4cGVyaW1lbnRSZWFkeSdcbiAgICAgIF0pO1xuXG4gICAgICBHbG9iYWxzLnNldCgnZXVnbGVuYVNlcnZlck1vZGUnLCAnYnB1Jyk7XG4gICAgICB0aGlzLmJwdSA9IG5ldyBCUFVDb25uZWN0b3IoKTtcbiAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuU3VibWlzc2lvbicsIHRoaXMuX29uU3VibWlzc2lvbkVycm9yKTtcbiAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuUXVldWUnLCB0aGlzLl9vblF1ZXVlRXJyb3IpO1xuICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlVwZGF0ZScsIHRoaXMuX29uRXhwZXJpbWVudFVwZGF0ZSk7XG4gICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuUmVhZHknLCB0aGlzLl9vbkV4cGVyaW1lbnRSZWFkeSk7XG5cbiAgICAgIHRoaXMuX2V4cGVyaW1lbnRzID0gW107XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRTZXJ2ZXIuRXhwZXJpbWVudFJlcXVlc3QnLCB0aGlzLl9vbkV4cGVyaW1lbnRSZXF1ZXN0KTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5SZWFkeScsIChldnQpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkVycm9yLkNvbm5lY3Rpb24nLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGV2dC5kYXRhLmVycm9yKTtcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5Db25uZWN0aW9uUmVmdXNlZCcsIChldnQpID0+IHtcbiAgICAgICAgICB0aGlzLmRlbW8gPSBuZXcgRGVtb0Nvbm5lY3RvcigpO1xuICAgICAgICAgIHRoaXMuZGVtby5hZGRFdmVudExpc3RlbmVyKCdEZW1vQ29udHJvbGxlci5FeHBlcmltZW50LlVwZGF0ZScsIHRoaXMuX29uRXhwZXJpbWVudFVwZGF0ZSk7XG4gICAgICAgICAgdGhpcy5kZW1vLmFkZEV2ZW50TGlzdGVuZXIoJ0RlbW9Db250cm9sbGVyLkV4cGVyaW1lbnQuUmVhZHknLCB0aGlzLl9vbkV4cGVyaW1lbnRSZWFkeSk7XG4gICAgICAgICAgdGhpcy5kZW1vLmluaXQoKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnZXVnbGVuYVNlcnZlck1vZGUnLCAnZGVtbycpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgICAgaWQ6IFwiZGVtb19tb2RlXCIsXG4gICAgICAgICAgICB0eXBlOiBcIm5vdGljZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJEZW1vIE1vZGVcIlxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5icHUuaW5pdCgpO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25TdWJtaXNzaW9uRXJyb3IoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgaWQ6IFwic3VibWlzc2lvbl9yZWplY3RlZFwiLFxuICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgIG1lc3NhZ2U6IGBTdWJtaXNzaW9uIHJlamVjdGVkOiAke2V2dC5kYXRhLmVycm9yfWBcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB7XG4gICAgICAgIGVycm9yOiBgU3VibWlzc2lvbiByZWplY3RlZDogJHtldnQuZGF0YS5lcnJvcn1gXG4gICAgICB9KTtcbiAgICB9XG4gICAgX29uUXVldWVFcnJvcihldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICBpZDogXCJzdWJtaXNzaW9uX3JlamVjdGVkXCIsXG4gICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgbWVzc2FnZTogYFF1ZXVlIHJlcXVlc3QgcmVqZWN0ZWQ6ICR7ZXZ0LmRhdGEuZXJyb3J9YFxuICAgICAgfSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB7XG4gICAgICAgIGVycm9yOiBgUXVldWUgcmVxdWVzdCByZWplY3RlZDogJHtldnQuZGF0YS5lcnJvcn1gXG4gICAgICB9KTtcbiAgICB9XG4gICAgX29uRXhwZXJpbWVudFVwZGF0ZShldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuVXBkYXRlJywgZXZ0LmRhdGEpO1xuICAgIH1cbiAgICBfb25FeHBlcmltZW50UmVhZHkoZXZ0KSB7XG4gICAgICBjb25zdCBvcmlnaW5hbCA9IGV2dC5kYXRhLmRhdGE7XG4gICAgICBjb25zdCByZXBvcnQgPSBvcmlnaW5hbC5leHBlcmltZW50O1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCB7XG4gICAgICAgIGV4cGVyaW1lbnRfaWQ6IHJlcG9ydC5leHBfbWV0YURhdGEuRXhwTmFtZSxcbiAgICAgICAgcmVtYWluaW5nX2VzdGltYXRlOiAwLFxuICAgICAgICBzdGF0dXM6IFwiZG93bmxvYWRpbmdcIlxuICAgICAgfSk7XG4gICAgICBFdWdVdGlscy5nZW5lcmF0ZVJlc3VsdHMoe1xuICAgICAgICBicHVfYXBpX2lkOiByZXBvcnQuZXhwX21ldGFEYXRhLkV4cE5hbWUsXG4gICAgICAgIGV4cGVyaW1lbnRJZDogcmVwb3J0LmV4cF9tZXRhRGF0YS50YWdcbiAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgZGF0YSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICBpZDogXCJyZXN1bHRfc3VibWlzc2lvbl9lcnJvclwiLFxuICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICBtZXNzYWdlOiBgUmVzdWx0cyBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgfSlcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5GYWlsdXJlJywge1xuICAgICAgICAgIGVycm9yOiBgUmVzdWx0cyBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRSZXF1ZXN0KGV2dCkge1xuICAgICAgY29uc3QgbGlnaHREYXRhID0gW107XG4gICAgICBsZXQgdGltZUFjY3VtdWxhdGVkID0gMFxuICAgICAgZXZ0LmRhdGEubGlnaHRzLmZvckVhY2goKGxkKSA9PiB7XG4gICAgICAgIGxpZ2h0RGF0YS5wdXNoKHtcbiAgICAgICAgICB0b3BWYWx1ZTogbGQudG9wLFxuICAgICAgICAgIHJpZ2h0VmFsdWU6IGxkLnJpZ2h0LFxuICAgICAgICAgIGJvdHRvbVZhbHVlOiBsZC5ib3R0b20sXG4gICAgICAgICAgbGVmdFZhbHVlOiBsZC5sZWZ0LFxuICAgICAgICAgIHRpbWU6IHRpbWVBY2N1bXVsYXRlZFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZUFjY3VtdWxhdGVkICs9IGxkLmR1cmF0aW9uICogMTAwMFxuICAgICAgfSlcblxuICAgICAgVXRpbHMucHJvbWlzZUFqYXgoXCIvYXBpL3YxL0V4cGVyaW1lbnRzXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHN0dWRlbnRJZDogR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBldnQuZGF0YS5saWdodHMsXG4gICAgICAgICAgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpXG4gICAgICAgIH0pLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRXhwZXJpbWVudFNhdmVkJywge1xuICAgICAgICAgIGV4cGVyaW1lbnQ6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZXVnbGVuYVNlcnZlck1vZGUnKSA9PSAnZGVtbycpIHtcbiAgICAgICAgICB0aGlzLmRlbW8ucnVuRXhwZXJpbWVudChsaWdodERhdGEsIGRhdGEuaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYnB1LnJ1bkV4cGVyaW1lbnQobGlnaHREYXRhLCBkYXRhLmlkKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50X3N1Ym1pc3Npb25fZXJyb3JcIixcbiAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZTogYEV4cGVyaW1lbnQgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgIH0pXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgICBlcnJvcjogYEV4cGVyaW1lbnQgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG4gIH1cbn0pIl19
