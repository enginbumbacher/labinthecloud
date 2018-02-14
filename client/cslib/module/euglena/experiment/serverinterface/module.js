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
            expForm: evt.data.expForm ? evt.data.expForm : null,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQlBVQ29ubmVjdG9yIiwiRGVtb0Nvbm5lY3RvciIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJicHUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU3VibWlzc2lvbkVycm9yIiwiX29uUXVldWVFcnJvciIsIl9vbkV4cGVyaW1lbnRVcGRhdGUiLCJfb25FeHBlcmltZW50UmVhZHkiLCJfZXhwZXJpbWVudHMiLCJnZXQiLCJfb25FeHBlcmltZW50UmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXZ0IiwiZGF0YSIsImVycm9yIiwiZGVtbyIsImluaXQiLCJkaXNwYXRjaEV2ZW50IiwiaWQiLCJ0eXBlIiwibWVzc2FnZSIsIm9yaWdpbmFsIiwicmVwb3J0IiwiZXhwZXJpbWVudCIsImV4cGVyaW1lbnRfaWQiLCJleHBfbWV0YURhdGEiLCJFeHBOYW1lIiwicmVtYWluaW5nX2VzdGltYXRlIiwic3RhdHVzIiwiZ2VuZXJhdGVSZXN1bHRzIiwiYnB1X2FwaV9pZCIsImV4cGVyaW1lbnRJZCIsInRhZyIsInRoZW4iLCJjYXRjaCIsImVyciIsImxpZ2h0RGF0YSIsInRpbWVBY2N1bXVsYXRlZCIsImxpZ2h0cyIsImZvckVhY2giLCJsZCIsInB1c2giLCJ0b3BWYWx1ZSIsInRvcCIsInJpZ2h0VmFsdWUiLCJyaWdodCIsImJvdHRvbVZhbHVlIiwiYm90dG9tIiwibGVmdFZhbHVlIiwibGVmdCIsInRpbWUiLCJkdXJhdGlvbiIsInByb21pc2VBamF4IiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0dWRlbnRJZCIsImNvbmZpZ3VyYXRpb24iLCJleHBGb3JtIiwibGFiIiwiY29udGVudFR5cGUiLCJydW5FeHBlcmltZW50Il0s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QUFTNkMsT0FBVCxHQUFtQjlDLElBQUlDLElBQUosQ0FBUzZDLE9BQTVCLEdBQXNDLElBSDVCO0FBSW5CQyxpQkFBS2pFLFFBQVFhLEdBQVIsQ0FBWSxlQUFaO0FBSmMsV0FBZixDQUZpQztBQVF2Q3FELHVCQUFhO0FBUjBCLFNBQXpDLEVBU0czQixJQVRILENBU1EsVUFBQ3BCLElBQUQsRUFBVTtBQUNoQm5CLGtCQUFRYSxHQUFSLENBQVksT0FBWixFQUFxQlUsYUFBckIsQ0FBbUMsa0NBQW5DLEVBQXVFO0FBQ3JFTSx3QkFBWVY7QUFEeUQsV0FBdkU7QUFHQSxjQUFJbkIsUUFBUWEsR0FBUixDQUFZLG1CQUFaLEtBQW9DLE1BQXhDLEVBQWdEO0FBQzlDLG1CQUFLUSxJQUFMLENBQVU4QyxhQUFWLENBQXdCekIsU0FBeEIsRUFBbUN2QixLQUFLSyxFQUF4QztBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFLbEIsR0FBTCxDQUFTNkQsYUFBVCxDQUF1QnpCLFNBQXZCLEVBQWtDdkIsS0FBS0ssRUFBdkM7QUFDRDtBQUNGLFNBbEJELEVBa0JHZ0IsS0FsQkgsQ0FrQlMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hCekMsa0JBQVFhLEdBQVIsQ0FBWSxPQUFaLEVBQXFCVSxhQUFyQixDQUFtQyxtQkFBbkMsRUFBd0Q7QUFDdERDLGdCQUFJLDZCQURrRDtBQUV0REMsa0JBQU0sT0FGZ0Q7QUFHdERDLG1EQUFxQ2U7QUFIaUIsV0FBeEQ7QUFLQXpDLGtCQUFRYSxHQUFSLENBQVksT0FBWixFQUFxQlUsYUFBckIsQ0FBbUMsMEJBQW5DLEVBQStEO0FBQzdESCxpREFBbUNxQjtBQUQwQixXQUEvRDtBQUdELFNBM0JEO0FBNEJEO0FBNUlIOztBQUFBO0FBQUEsSUFBeUMzQyxNQUF6QztBQThJRCxDQXZKRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L3NlcnZlcmludGVyZmFjZS9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgQlBVQ29ubmVjdG9yID0gcmVxdWlyZSgnLi9icHVfY29ubmVjdG9yJyksXG4gICAgRGVtb0Nvbm5lY3RvciA9IHJlcXVpcmUoJy4vZGVtb19jb25uZWN0b3InKSxcbiAgICBFdWdVdGlscyA9IHJlcXVpcmUoJ2V1Z2xlbmEvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIEV1Z2xlbmFTZXJ2ZXJNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgW1xuICAgICAgICAnX29uRXhwZXJpbWVudFJlcXVlc3QnXG4gICAgICAgICwgJ19vbkV4cGVyaW1lbnRVcGRhdGUnXG4gICAgICAgICwgJ19vblN1Ym1pc3Npb25FcnJvcidcbiAgICAgICAgLCAnX29uUXVldWVFcnJvcidcbiAgICAgICAgLCAnX29uRXhwZXJpbWVudFJlYWR5J1xuICAgICAgXSk7XG5cbiAgICAgIEdsb2JhbHMuc2V0KCdldWdsZW5hU2VydmVyTW9kZScsICdicHUnKTtcbiAgICAgIHRoaXMuYnB1ID0gbmV3IEJQVUNvbm5lY3RvcigpO1xuICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5TdWJtaXNzaW9uJywgdGhpcy5fb25TdWJtaXNzaW9uRXJyb3IpO1xuICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5RdWV1ZScsIHRoaXMuX29uUXVldWVFcnJvcik7XG4gICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywgdGhpcy5fb25FeHBlcmltZW50VXBkYXRlKTtcbiAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5SZWFkeScsIHRoaXMuX29uRXhwZXJpbWVudFJlYWR5KTtcblxuICAgICAgdGhpcy5fZXhwZXJpbWVudHMgPSBbXTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5FeHBlcmltZW50UmVxdWVzdCcsIHRoaXMuX29uRXhwZXJpbWVudFJlcXVlc3QpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLlJlYWR5JywgKGV2dCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvbicsIChldnQpID0+IHtcbiAgICAgICAgICByZWplY3QoZXZ0LmRhdGEuZXJyb3IpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkVycm9yLkNvbm5lY3Rpb25SZWZ1c2VkJywgKGV2dCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGVtbyA9IG5ldyBEZW1vQ29ubmVjdG9yKCk7XG4gICAgICAgICAgdGhpcy5kZW1vLmFkZEV2ZW50TGlzdGVuZXIoJ0RlbW9Db250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywgdGhpcy5fb25FeHBlcmltZW50VXBkYXRlKTtcbiAgICAgICAgICB0aGlzLmRlbW8uYWRkRXZlbnRMaXN0ZW5lcignRGVtb0NvbnRyb2xsZXIuRXhwZXJpbWVudC5SZWFkeScsIHRoaXMuX29uRXhwZXJpbWVudFJlYWR5KTtcbiAgICAgICAgICB0aGlzLmRlbW8uaW5pdCgpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdldWdsZW5hU2VydmVyTW9kZScsICdkZW1vJyk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgICBpZDogXCJkZW1vX21vZGVcIixcbiAgICAgICAgICAgIHR5cGU6IFwibm90aWNlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkRlbW8gTW9kZVwiXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmJwdS5pbml0KCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblN1Ym1pc3Npb25FcnJvcihldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICBpZDogXCJzdWJtaXNzaW9uX3JlamVjdGVkXCIsXG4gICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgbWVzc2FnZTogYFN1Ym1pc3Npb24gcmVqZWN0ZWQ6ICR7ZXZ0LmRhdGEuZXJyb3J9YFxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgZXJyb3I6IGBTdWJtaXNzaW9uIHJlamVjdGVkOiAke2V2dC5kYXRhLmVycm9yfWBcbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25RdWV1ZUVycm9yKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgIGlkOiBcInN1Ym1pc3Npb25fcmVqZWN0ZWRcIixcbiAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICBtZXNzYWdlOiBgUXVldWUgcmVxdWVzdCByZWplY3RlZDogJHtldnQuZGF0YS5lcnJvcn1gXG4gICAgICB9KTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgZXJyb3I6IGBRdWV1ZSByZXF1ZXN0IHJlamVjdGVkOiAke2V2dC5kYXRhLmVycm9yfWBcbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25FeHBlcmltZW50VXBkYXRlKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCBldnQuZGF0YSk7XG4gICAgfVxuICAgIF9vbkV4cGVyaW1lbnRSZWFkeShldnQpIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsID0gZXZ0LmRhdGEuZGF0YTtcbiAgICAgIGNvbnN0IHJlcG9ydCA9IG9yaWdpbmFsLmV4cGVyaW1lbnQ7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLlVwZGF0ZScsIHtcbiAgICAgICAgZXhwZXJpbWVudF9pZDogcmVwb3J0LmV4cF9tZXRhRGF0YS5FeHBOYW1lLFxuICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IDAsXG4gICAgICAgIHN0YXR1czogXCJkb3dubG9hZGluZ1wiXG4gICAgICB9KTtcbiAgICAgIEV1Z1V0aWxzLmdlbmVyYXRlUmVzdWx0cyh7XG4gICAgICAgIGJwdV9hcGlfaWQ6IHJlcG9ydC5leHBfbWV0YURhdGEuRXhwTmFtZSxcbiAgICAgICAgZXhwZXJpbWVudElkOiByZXBvcnQuZXhwX21ldGFEYXRhLnRhZ1xuICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLlJlc3VsdHMnLCBkYXRhKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgIGlkOiBcInJlc3VsdF9zdWJtaXNzaW9uX2Vycm9yXCIsXG4gICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgIG1lc3NhZ2U6IGBSZXN1bHRzIHNhdmluZyBlcnJvcjogJHtlcnJ9YFxuICAgICAgICB9KVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB7XG4gICAgICAgICAgZXJyb3I6IGBSZXN1bHRzIHNhdmluZyBlcnJvcjogJHtlcnJ9YFxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudFJlcXVlc3QoZXZ0KSB7XG4gICAgICBjb25zdCBsaWdodERhdGEgPSBbXTtcbiAgICAgIGxldCB0aW1lQWNjdW11bGF0ZWQgPSAwXG4gICAgICBldnQuZGF0YS5saWdodHMuZm9yRWFjaCgobGQpID0+IHtcbiAgICAgICAgbGlnaHREYXRhLnB1c2goe1xuICAgICAgICAgIHRvcFZhbHVlOiBsZC50b3AsXG4gICAgICAgICAgcmlnaHRWYWx1ZTogbGQucmlnaHQsXG4gICAgICAgICAgYm90dG9tVmFsdWU6IGxkLmJvdHRvbSxcbiAgICAgICAgICBsZWZ0VmFsdWU6IGxkLmxlZnQsXG4gICAgICAgICAgdGltZTogdGltZUFjY3VtdWxhdGVkXG4gICAgICAgIH0pO1xuICAgICAgICB0aW1lQWNjdW11bGF0ZWQgKz0gbGQuZHVyYXRpb24gKiAxMDAwXG4gICAgICB9KVxuXG4gICAgICBVdGlscy5wcm9taXNlQWpheChcIi9hcGkvdjEvRXhwZXJpbWVudHNcIiwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgc3R1ZGVudElkOiBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGV2dC5kYXRhLmxpZ2h0cyxcbiAgICAgICAgICBleHBGb3JtOiBldnQuZGF0YS5leHBGb3JtID8gZXZ0LmRhdGEuZXhwRm9ybSA6IG51bGwsXG4gICAgICAgICAgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpXG4gICAgICAgIH0pLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRXhwZXJpbWVudFNhdmVkJywge1xuICAgICAgICAgIGV4cGVyaW1lbnQ6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnZXVnbGVuYVNlcnZlck1vZGUnKSA9PSAnZGVtbycpIHtcbiAgICAgICAgICB0aGlzLmRlbW8ucnVuRXhwZXJpbWVudChsaWdodERhdGEsIGRhdGEuaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYnB1LnJ1bkV4cGVyaW1lbnQobGlnaHREYXRhLCBkYXRhLmlkKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50X3N1Ym1pc3Npb25fZXJyb3JcIixcbiAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZTogYEV4cGVyaW1lbnQgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgIH0pXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgICBlcnJvcjogYEV4cGVyaW1lbnQgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG4gIH1cbn0pXG4iXX0=
