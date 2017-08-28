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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQlBVQ29ubmVjdG9yIiwiRGVtb0Nvbm5lY3RvciIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJicHUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU3VibWlzc2lvbkVycm9yIiwiX29uUXVldWVFcnJvciIsIl9vbkV4cGVyaW1lbnRVcGRhdGUiLCJfb25FeHBlcmltZW50UmVhZHkiLCJfZXhwZXJpbWVudHMiLCJnZXQiLCJfb25FeHBlcmltZW50UmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXZ0IiwiZGF0YSIsImVycm9yIiwiZGVtbyIsImluaXQiLCJkaXNwYXRjaEV2ZW50IiwiaWQiLCJ0eXBlIiwibWVzc2FnZSIsIm9yaWdpbmFsIiwicmVwb3J0IiwiZXhwZXJpbWVudCIsImV4cGVyaW1lbnRfaWQiLCJleHBfbWV0YURhdGEiLCJFeHBOYW1lIiwicmVtYWluaW5nX2VzdGltYXRlIiwic3RhdHVzIiwiZ2VuZXJhdGVSZXN1bHRzIiwiYnB1X2FwaV9pZCIsImV4cGVyaW1lbnRJZCIsInRhZyIsInRoZW4iLCJjYXRjaCIsImVyciIsImxpZ2h0RGF0YSIsInRpbWVBY2N1bXVsYXRlZCIsImxpZ2h0cyIsImZvckVhY2giLCJsZCIsInB1c2giLCJ0b3BWYWx1ZSIsInRvcCIsInJpZ2h0VmFsdWUiLCJyaWdodCIsImJvdHRvbVZhbHVlIiwiYm90dG9tIiwibGVmdFZhbHVlIiwibGVmdCIsInRpbWUiLCJkdXJhdGlvbiIsInByb21pc2VBamF4IiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0dWRlbnRJZCIsImNvbmZpZ3VyYXRpb24iLCJsYWIiLCJjb250ZW50VHlwZSIsInJ1bkV4cGVyaW1lbnQiXSwibWFwcGluZ3Mi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QUhjLFdBQWYsQ0FGaUM7QUFPdkNvRCx1QkFBYTtBQVAwQixTQUF6QyxFQVFHMUIsSUFSSCxDQVFRLFVBQUNwQixJQUFELEVBQVU7QUFDaEJuQixrQkFBUWEsR0FBUixDQUFZLE9BQVosRUFBcUJVLGFBQXJCLENBQW1DLGtDQUFuQyxFQUF1RTtBQUNyRU0sd0JBQVlWO0FBRHlELFdBQXZFO0FBR0EsY0FBSW5CLFFBQVFhLEdBQVIsQ0FBWSxtQkFBWixLQUFvQyxNQUF4QyxFQUFnRDtBQUM5QyxtQkFBS1EsSUFBTCxDQUFVNkMsYUFBVixDQUF3QnhCLFNBQXhCLEVBQW1DdkIsS0FBS0ssRUFBeEM7QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBS2xCLEdBQUwsQ0FBUzRELGFBQVQsQ0FBdUJ4QixTQUF2QixFQUFrQ3ZCLEtBQUtLLEVBQXZDO0FBQ0Q7QUFDRixTQWpCRCxFQWlCR2dCLEtBakJILENBaUJTLFVBQUNDLEdBQUQsRUFBUztBQUNoQnpDLGtCQUFRYSxHQUFSLENBQVksT0FBWixFQUFxQlUsYUFBckIsQ0FBbUMsbUJBQW5DLEVBQXdEO0FBQ3REQyxnQkFBSSw2QkFEa0Q7QUFFdERDLGtCQUFNLE9BRmdEO0FBR3REQyxtREFBcUNlO0FBSGlCLFdBQXhEO0FBS0F6QyxrQkFBUWEsR0FBUixDQUFZLE9BQVosRUFBcUJVLGFBQXJCLENBQW1DLDBCQUFuQyxFQUErRDtBQUM3REgsaURBQW1DcUI7QUFEMEIsV0FBL0Q7QUFHRCxTQTFCRDtBQTJCRDtBQTNJSDs7QUFBQTtBQUFBLElBQXlDM0MsTUFBekM7QUE2SUQsQ0F0SkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9zZXJ2ZXJpbnRlcmZhY2UvbW9kdWxlLmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
