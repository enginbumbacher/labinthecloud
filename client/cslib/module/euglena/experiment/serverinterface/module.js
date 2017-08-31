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
          return Utils.promiseAjax('/results/' + data.experimentId + '/live/' + data.bpu_api_id + '.json').then(function (tracks) {
            data.tracks = tracks;
            data.video = original.video;
            Globals.get('Relay').dispatchEvent('ExperimentServer.Results', data);
          });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQlBVQ29ubmVjdG9yIiwiRGVtb0Nvbm5lY3RvciIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJicHUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU3VibWlzc2lvbkVycm9yIiwiX29uUXVldWVFcnJvciIsIl9vbkV4cGVyaW1lbnRVcGRhdGUiLCJfb25FeHBlcmltZW50UmVhZHkiLCJfZXhwZXJpbWVudHMiLCJnZXQiLCJfb25FeHBlcmltZW50UmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXZ0IiwiZGF0YSIsImVycm9yIiwiZGVtbyIsImluaXQiLCJkaXNwYXRjaEV2ZW50IiwiaWQiLCJ0eXBlIiwibWVzc2FnZSIsIm9yaWdpbmFsIiwicmVwb3J0IiwiZXhwZXJpbWVudCIsImV4cGVyaW1lbnRfaWQiLCJleHBfbWV0YURhdGEiLCJFeHBOYW1lIiwicmVtYWluaW5nX2VzdGltYXRlIiwic3RhdHVzIiwiZ2VuZXJhdGVSZXN1bHRzIiwiYnB1X2FwaV9pZCIsImV4cGVyaW1lbnRJZCIsInRhZyIsInRoZW4iLCJwcm9taXNlQWpheCIsInRyYWNrcyIsInZpZGVvIiwiY2F0Y2giLCJlcnIiLCJsaWdodERhdGEiLCJ0aW1lQWNjdW11bGF0ZWQiLCJsaWdodHMiLCJmb3JFYWNoIiwibGQiLCJwdXNoIiwidG9wVmFsdWUiLCJ0b3AiLCJyaWdodFZhbHVlIiwicmlnaHQiLCJib3R0b21WYWx1ZSIsImJvdHRvbSIsImxlZnRWYWx1ZSIsImxlZnQiLCJ0aW1lIiwiZHVyYXRpb24iLCJtZXRob2QiLCJKU09OIiwic3RyaW5naWZ5Iiwic3R1ZGVudElkIiwiY29uZmlndXJhdGlvbiIsImxhYiIsImNvbnRlbnRUeXBlIiwicnVuRXhwZXJp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eHBlcmltZW50L3NlcnZlcmludGVyZmFjZS9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgQlBVQ29ubmVjdG9yID0gcmVxdWlyZSgnLi9icHVfY29ubmVjdG9yJyksXG4gICAgRGVtb0Nvbm5lY3RvciA9IHJlcXVpcmUoJy4vZGVtb19jb25uZWN0b3InKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIEV1Z2xlbmFTZXJ2ZXJNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uRXhwZXJpbWVudFJlcXVlc3QnXG4gICAgICAgICwgJ19vbkV4cGVyaW1lbnRVcGRhdGUnXG4gICAgICAgICwgJ19vblN1Ym1pc3Npb25FcnJvcidcbiAgICAgICAgLCAnX29uUXVldWVFcnJvcidcbiAgICAgICAgLCAnX29uRXhwZXJpbWVudFJlYWR5J1xuICAgICAgXSk7XG5cbiAgICAgIEdsb2JhbHMuc2V0KCdldWdsZW5hU2VydmVyTW9kZScsICdicHUnKTtcbiAgICAgIHRoaXMuYnB1ID0gbmV3IEJQVUNvbm5lY3RvcigpO1xuICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5TdWJtaXNzaW9uJywgdGhpcy5fb25TdWJtaXNzaW9uRXJyb3IpO1xuICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5RdWV1ZScsIHRoaXMuX29uUXVldWVFcnJvcik7XG4gICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywgdGhpcy5fb25FeHBlcmltZW50VXBkYXRlKTtcbiAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5SZWFkeScsIHRoaXMuX29uRXhwZXJpbWVudFJlYWR5KTtcblxuICAgICAgdGhpcy5fZXhwZXJpbWVudHMgPSBbXTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5FeHBlcmltZW50UmVxdWVzdCcsIHRoaXMuX29uRXhwZXJpbWVudFJlcXVlc3QpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLlJlYWR5JywgKGV2dCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvbicsIChldnQpID0+IHtcbiAgICAgICAgICByZWplY3QoZXZ0LmRhdGEuZXJyb3IpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkVycm9yLkNvbm5lY3Rpb25SZWZ1c2VkJywgKGV2dCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGVtbyA9IG5ldyBEZW1vQ29ubmVjdG9yKCk7XG4gICAgICAgICAgdGhpcy5kZW1vLmFkZEV2ZW50TGlzdGVuZXIoJ0RlbW9Db250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywgdGhpcy5fb25FeHBlcmltZW50VXBkYXRlKTtcbiAgICAgICAgICB0aGlzLmRlbW8uYWRkRXZlbnRMaXN0ZW5lcignRGVtb0NvbnRyb2xsZXIuRXhwZXJpbWVudC5SZWFkeScsIHRoaXMuX29uRXhwZXJpbWVudFJlYWR5KTtcbiAgICAgICAgICB0aGlzLmRlbW8uaW5pdCgpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdldWdsZW5hU2VydmVyTW9kZScsICdkZW1vJyk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgICBpZDogXCJkZW1vX21vZGVcIixcbiAgICAgICAgICAgIHR5cGU6IFwibm90aWNlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkRlbW8gTW9kZVwiXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmJwdS5pbml0KCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblN1Ym1pc3Npb25FcnJvcihldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICBpZDogXCJzdWJtaXNzaW9uX3JlamVjdGVkXCIsXG4gICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgbWVzc2FnZTogYFN1Ym1pc3Npb24gcmVqZWN0ZWQ6ICR7ZXZ0LmRhdGEuZXJyb3J9YFxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgZXJyb3I6IGBTdWJtaXNzaW9uIHJlamVjdGVkOiAke2V2dC5kYXRhLmVycm9yfWBcbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25RdWV1ZUVycm9yKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgIGlkOiBcInN1Ym1pc3Npb25fcmVqZWN0ZWRcIixcbiAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICBtZXNzYWdlOiBgUXVldWUgcmVxdWVzdCByZWplY3RlZDogJHtldnQuZGF0YS5lcnJvcn1gXG4gICAgICB9KTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgZXJyb3I6IGBRdWV1ZSByZXF1ZXN0IHJlamVjdGVkOiAke2V2dC5kYXRhLmVycm9yfWBcbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25FeHBlcmltZW50VXBkYXRlKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCBldnQuZGF0YSk7XG4gICAgfVxuICAgIF9vbkV4cGVyaW1lbnRSZWFkeShldnQpIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsID0gZXZ0LmRhdGEuZGF0YTtcbiAgICAgIGNvbnN0IHJlcG9ydCA9IG9yaWdpbmFsLmV4cGVyaW1lbnQ7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLlVwZGF0ZScsIHtcbiAgICAgICAgZXhwZXJpbWVudF9pZDogcmVwb3J0LmV4cF9tZXRhRGF0YS5FeHBOYW1lLFxuICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IDAsXG4gICAgICAgIHN0YXR1czogXCJkb3dubG9hZGluZ1wiXG4gICAgICB9KTtcbiAgICAgIEV1Z1V0aWxzLmdlbmVyYXRlUmVzdWx0cyh7XG4gICAgICAgIGJwdV9hcGlfaWQ6IHJlcG9ydC5leHBfbWV0YURhdGEuRXhwTmFtZSxcbiAgICAgICAgZXhwZXJpbWVudElkOiByZXBvcnQuZXhwX21ldGFEYXRhLnRhZ1xuICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gVXRpbHMucHJvbWlzZUFqYXgoYC9yZXN1bHRzLyR7ZGF0YS5leHBlcmltZW50SWR9L2xpdmUvJHtkYXRhLmJwdV9hcGlfaWR9Lmpzb25gKVxuICAgICAgICAgIC50aGVuKCh0cmFja3MpID0+IHtcbiAgICAgICAgICAgIGRhdGEudHJhY2tzID0gdHJhY2tzO1xuICAgICAgICAgICAgZGF0YS52aWRlbyA9IG9yaWdpbmFsLnZpZGVvO1xuICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgZGF0YSk7XG4gICAgICAgICAgfSlcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IFwicmVzdWx0X3N1Ym1pc3Npb25fZXJyb3JcIixcbiAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZTogYFJlc3VsdHMgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgIH0pXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgICBlcnJvcjogYFJlc3VsdHMgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50UmVxdWVzdChldnQpIHtcbiAgICAgIGNvbnN0IGxpZ2h0RGF0YSA9IFtdO1xuICAgICAgbGV0IHRpbWVBY2N1bXVsYXRlZCA9IDBcbiAgICAgIGV2dC5kYXRhLmxpZ2h0cy5mb3JFYWNoKChsZCkgPT4ge1xuICAgICAgICBsaWdodERhdGEucHVzaCh7XG4gICAgICAgICAgdG9wVmFsdWU6IGxkLnRvcCxcbiAgICAgICAgICByaWdodFZhbHVlOiBsZC5yaWdodCxcbiAgICAgICAgICBib3R0b21WYWx1ZTogbGQuYm90dG9tLFxuICAgICAgICAgIGxlZnRWYWx1ZTogbGQubGVmdCxcbiAgICAgICAgICB0aW1lOiB0aW1lQWNjdW11bGF0ZWRcbiAgICAgICAgfSk7XG4gICAgICAgIHRpbWVBY2N1bXVsYXRlZCArPSBsZC5kdXJhdGlvbiAqIDEwMDBcbiAgICAgIH0pXG5cbiAgICAgIFV0aWxzLnByb21pc2VBamF4KFwiL2FwaS92MS9FeHBlcmltZW50c1wiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBzdHVkZW50SWQ6IEdsb2JhbHMuZ2V0KCdzdHVkZW50X2lkJyksXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogZXZ0LmRhdGEubGlnaHRzLFxuICAgICAgICAgIGxhYjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKVxuICAgICAgICB9KSxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkV4cGVyaW1lbnRTYXZlZCcsIHtcbiAgICAgICAgICBleHBlcmltZW50OiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ2V1Z2xlbmFTZXJ2ZXJNb2RlJykgPT0gJ2RlbW8nKSB7XG4gICAgICAgICAgdGhpcy5kZW1vLnJ1bkV4cGVyaW1lbnQobGlnaHREYXRhLCBkYXRhLmlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmJwdS5ydW5FeHBlcmltZW50KGxpZ2h0RGF0YSwgZGF0YS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudF9zdWJtaXNzaW9uX2Vycm9yXCIsXG4gICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgIG1lc3NhZ2U6IGBFeHBlcmltZW50IHNhdmluZyBlcnJvcjogJHtlcnJ9YFxuICAgICAgICB9KVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB7XG4gICAgICAgICAgZXJyb3I6IGBFeHBlcmltZW50IHNhdmluZyBlcnJvcjogJHtlcnJ9YFxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KSJdfQ==
