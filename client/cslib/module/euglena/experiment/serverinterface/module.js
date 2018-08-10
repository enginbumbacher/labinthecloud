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

      Utils.bindMethods(_this, ['_onExperimentRequest', '_onExperimentUpdate', '_onSubmissionError', '_onQueueError', '_onExperimentReady', '_searchAndLoadData']);

      if (Globals.get('AppConfig.experiment.euglenaServerMode')) {
        Globals.set('euglenaServerMode', Globals.get('AppConfig.experiment.euglenaServerMode'));
      } else {
        Globals.set('euglenaServerMode', 'bpu');
      }
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

        // First, check whether this experiment has already been run.
        new Promise(function (resolve, reject) {
          _this3._searchAndLoadData(evt.data.lights, null, 'experiment', resolve);
        }).then(function (expIdAndResults) {
          // Look which previous experiment has the same light configuration. --> Store its id in copyOfID.
          Utils.promiseAjax("/api/v1/Experiments", {
            method: "POST",
            data: JSON.stringify({
              studentId: Globals.get('student_id'),
              configuration: evt.data.lights,
              expForm: evt.data.expForm ? evt.data.expForm : null,
              lab: Globals.get('AppConfig.lab'),
              copyOfID: Globals.get('AppConfig.experiment.euglenaServerMode') === 'simulate' && expIdAndResults.copyOfID > 0 && expIdAndResults.results.length ? expIdAndResults.copyOfID : 0 // update the copyOfID if it is found.
            }),
            contentType: 'application/json'
          }).then(function (data) {
            Globals.get('Relay').dispatchEvent('ExperimentServer.ExperimentSaved', {
              experiment: data
            });

            if (Globals.get('euglenaServerMode') == 'demo') {
              _this3.demo.runExperiment(lightData, data.id);
            } else if (Globals.get('euglenaServerMode') == 'simulate') {
              if (data.copyOfID > 0) {
                // new Promise((resolve, reject) => {
                //   this._searchAndLoadData(lightData, data.copyOfID, 'results', resolve);
                // }).then((resultsData) => {
                //     if (!resultsData) {
                //       this.bpu.runExperiment(lightData, data.id);
                //     } else {
                expIdAndResults.results[0].experimentId = data.id;
                delete expIdAndResults.results[0].id;
                EugUtils.generateResults(expIdAndResults.results[0]).then(function (data) {
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
                //Globals.get('Relay').dispatchEvent('ExperimentServer.Results', expIdAndResults.results);
                // }
                // }).catch((reason) => { console.log('Handle rejected Results promise(' + reason + ') here.')});;
              } else {
                _this3.bpu.runExperiment(lightData, data.id);
              } // Check first whether there is another experiment with the same config. If so, load that. Otherwise, run the bpu.
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
        }).catch(function (reason) {
          console.log('Handle rejected Experiment promise(' + reason + ') here.');
        });
      }
    }, {
      key: '_searchAndLoadData',
      value: function _searchAndLoadData(lightData, expId, loadData, resolve) {

        //    if (loadData === 'experiment') {

        // Utils.promiseAjax('/api/v1/Experiments', {
        //   data: {
        //     filter: {
        //       where:{
        //         copyOfID: 0
        //       }
        //     }
        //   },
        //   contentType: 'application/json'
        // })

        Utils.promiseAjax('/api/v1/Experiments/expsWithResults', {
          data: {
            copyOfID: 0
          }
        }).then(function (data) {
          // if there are multiple experiments found, return the most recent one
          var filteredData = data;
          for (var idx = 0; idx < 4; idx++) {
            if (filteredData.length > 0) {
              filteredData = filteredData.filter(function (exp) {
                var expConfig = exp.configuration;
                var isMatch = true;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = Object.keys(lightData[idx])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var elem = _step.value;

                    if (expConfig[idx][elem] != lightData[idx][elem]) {
                      return false;
                    }
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }

                if (isMatch) {
                  return true;
                };
              });
            }
          }

          var copyOfID = 0;
          if (filteredData.length > 1) {
            filteredData.sort(function (a, b) {
              return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
            });
            copyOfID = filteredData[0].id;
          } else if (filteredData.length == 1) {
            copyOfID = filteredData[0].id;
          }

          if (copyOfID > 0) {
            Utils.promiseAjax('/api/v1/Results', {
              data: {
                filter: {
                  where: {
                    and: [{ experimentId: copyOfID }, {
                      bpu_api_id: {
                        neq: null
                      }
                    }]
                  }
                }
              },
              contentType: 'application/json'
            }).then(function (results) {
              var expIdAndResults = { copyOfID: copyOfID, results: results };
              resolve(expIdAndResults);
            });
          } else {
            resolve({ copyOfID: 0, results: null });
          }

          //resolve(copyOfID);
        });
        // } else if (loadData === 'results') {
        //   Utils.promiseAjax(`/api/v1/Results`, {
        //     data: {
        //       filter: {
        //         where: {
        //           and: [
        //             { experimentId: expId },
        //             {
        //               bpu_api_id: {
        //                 neq: null
        //               }
        //             }
        //           ]
        //         }
        //       }
        //     },
        //     contentType: 'application/json'
        //   }).then((results) => {
        //     resolve(results)
        //   })
        // }

      }
    }]);

    return EuglenaServerModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQlBVQ29ubmVjdG9yIiwiRGVtb0Nvbm5lY3RvciIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJnZXQiLCJzZXQiLCJicHUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU3VibWlzc2lvbkVycm9yIiwiX29uUXVldWVFcnJvciIsIl9vbkV4cGVyaW1lbnRVcGRhdGUiLCJfb25FeHBlcmltZW50UmVhZHkiLCJfZXhwZXJpbWVudHMiLCJfb25FeHBlcmltZW50UmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXZ0IiwiZGF0YSIsImVycm9yIiwiZGVtbyIsImluaXQiLCJkaXNwYXRjaEV2ZW50IiwiaWQiLCJ0eXBlIiwibWVzc2FnZSIsIm9yaWdpbmFsIiwicmVwb3J0IiwiZXhwZXJpbWVudCIsImV4cGVyaW1lbnRfaWQiLCJleHBfbWV0YURhdGEiLCJFeHBOYW1lIiwicmVtYWluaW5nX2VzdGltYXRlIiwic3RhdHVzIiwiZ2VuZXJhdGVSZXN1bHRzIiwiYnB1X2FwaV9pZCIsImV4cGVyaW1lbnRJZCIsInRhZyIsInRoZW4iLCJjYXRjaCIsImVyciIsImxpZ2h0RGF0YSIsInRpbWVBY2N1bXVsYXRlZCIsImxpZ2h0cyIsImZvckVhY2giLCJsZCIsInB1c2giLCJ0b3BWYWx1ZSIsInRvcCIsInJpZ2h0VmFsdWUiLCJyaWdodCIsImJvdHRvbVZhbHVlIiwiYm90dG9tIiwibGVmdFZhbHVlIiwibGVmdCIsInRpbWUiLCJkdXJhdGlvbiIsIl9zZWFyY2hBbmRMb2FkRGF0YSIsImV4cElkQW5kUmVzdWx0cyIsInByb21pc2VBamF4IiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0dWRlbnRJZCIsImNvbmZpZ3VyYXRpb24iLCJleHBGb3JtIiwibGFiIiwiY29weU9mSUQiLCJyZXN1bHRzIiwibGVuZ3RoIiwiY29udGVudFR5cGUiLCJydW5FeHBlcmltZW50IiwicmVhc29uIiwiY29uc29sZSIsImxvZyIsImV4cElkIiwibG9hZERhdGEiLCJmaWx0ZXJlZERhdGEiLCJpZHgiLCJmaWx0ZXIiLCJleHBDb25maWciLCJleHAiLCJpc01hdGNoIiwiT2JqZWN0Iiwia2V5cyIsImVsZW0iLCJzb3J0IiwiYSIsImIiLCJEYXRlIiwiZGF0ZV9jcmVhdGVkIiwiZ2V0VGltZSIsIndoZXJlIiwiYW5kIiwibmVxIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BR0VJLGVBQWVKLFFBQVEsaUJBQVIsQ0FIakI7QUFBQSxNQUlFSyxnQkFBZ0JMLFFBQVEsa0JBQVIsQ0FKbEI7QUFBQSxNQUtFTSxXQUFXTixRQUFRLGVBQVIsQ0FMYjs7QUFRQTtBQUFBOztBQUNFLG1DQUFjO0FBQUE7O0FBQUE7O0FBR1pFLFlBQU1LLFdBQU4sUUFBd0IsQ0FDdEIsc0JBRHNCLEVBRXBCLHFCQUZvQixFQUdwQixvQkFIb0IsRUFJcEIsZUFKb0IsRUFLcEIsb0JBTG9CLEVBTXBCLG9CQU5vQixDQUF4Qjs7QUFTQSxVQUFJSixRQUFRSyxHQUFSLENBQVksd0NBQVosQ0FBSixFQUEyRDtBQUN6REwsZ0JBQVFNLEdBQVIsQ0FBWSxtQkFBWixFQUFnQ04sUUFBUUssR0FBUixDQUFZLHdDQUFaLENBQWhDO0FBQ0QsT0FGRCxNQUVPO0FBQ0xMLGdCQUFRTSxHQUFSLENBQVksbUJBQVosRUFBaUMsS0FBakM7QUFDRDtBQUNELFlBQUtDLEdBQUwsR0FBVyxJQUFJTixZQUFKLEVBQVg7QUFDQSxZQUFLTSxHQUFMLENBQVNDLGdCQUFULENBQTBCLGdDQUEx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UixNQUFiLElBQXVCLENBQTNCLEVBQThCO0FBQ25DRix1QkFBV1UsYUFBYSxDQUFiLEVBQWdCdEQsRUFBM0I7QUFDRDs7QUFFRCxjQUFJNEMsV0FBUyxDQUFiLEVBQWdCO0FBQ2RyRSxrQkFBTTZELFdBQU4sb0JBQXFDO0FBQ25DekMsb0JBQU07QUFDSjZELHdCQUFRO0FBQ05hLHlCQUFPO0FBQ0xDLHlCQUFLLENBQ0gsRUFBRXpELGNBQWMrQixRQUFoQixFQURHLEVBRUg7QUFDRWhDLGtDQUFZO0FBQ1YyRCw2QkFBSztBQURLO0FBRGQscUJBRkc7QUFEQTtBQUREO0FBREosZUFENkI7QUFlbkN4QiwyQkFBYTtBQWZzQixhQUFyQyxFQWdCR2hDLElBaEJILENBZ0JRLFVBQUM4QixPQUFELEVBQWE7QUFDbkIsa0JBQUlWLGtCQUFrQixFQUFDUyxVQUFVQSxRQUFYLEVBQXFCQyxTQUFTQSxPQUE5QixFQUF0QjtBQUNBckQsc0JBQVEyQyxlQUFSO0FBQ0QsYUFuQkQ7QUFvQkQsV0FyQkQsTUFxQk87QUFDTDNDLG9CQUFRLEVBQUNvRCxVQUFVLENBQVgsRUFBY0MsU0FBUyxJQUF2QixFQUFSO0FBQ0Q7O0FBRUQ7QUFFRCxTQTNERDtBQTRERjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0Q7QUEzUkg7O0FBQUE7QUFBQSxJQUF5Q3ZFLE1BQXpDO0FBOFJELENBdlNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBCUFVDb25uZWN0b3IgPSByZXF1aXJlKCcuL2JwdV9jb25uZWN0b3InKSxcbiAgICBEZW1vQ29ubmVjdG9yID0gcmVxdWlyZSgnLi9kZW1vX2Nvbm5lY3RvcicpLFxuICAgIEV1Z1V0aWxzID0gcmVxdWlyZSgnZXVnbGVuYS91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgRXVnbGVuYVNlcnZlck1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbXG4gICAgICAgICdfb25FeHBlcmltZW50UmVxdWVzdCdcbiAgICAgICAgLCAnX29uRXhwZXJpbWVudFVwZGF0ZSdcbiAgICAgICAgLCAnX29uU3VibWlzc2lvbkVycm9yJ1xuICAgICAgICAsICdfb25RdWV1ZUVycm9yJ1xuICAgICAgICAsICdfb25FeHBlcmltZW50UmVhZHknXG4gICAgICAgICwgJ19zZWFyY2hBbmRMb2FkRGF0YSdcbiAgICAgIF0pO1xuXG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV1Z2xlbmFTZXJ2ZXJNb2RlJykpIHtcbiAgICAgICAgR2xvYmFscy5zZXQoJ2V1Z2xlbmFTZXJ2ZXJNb2RlJyxHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXVnbGVuYVNlcnZlck1vZGUnKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEdsb2JhbHMuc2V0KCdldWdsZW5hU2VydmVyTW9kZScsICdicHUnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYnB1ID0gbmV3IEJQVUNvbm5lY3RvcigpO1xuICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5TdWJtaXNzaW9uJywgdGhpcy5fb25TdWJtaXNzaW9uRXJyb3IpO1xuICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5RdWV1ZScsIHRoaXMuX29uUXVldWVFcnJvcik7XG4gICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywgdGhpcy5fb25FeHBlcmltZW50VXBkYXRlKTtcbiAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5SZWFkeScsIHRoaXMuX29uRXhwZXJpbWVudFJlYWR5KTtcblxuICAgICAgdGhpcy5fZXhwZXJpbWVudHMgPSBbXTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudFNlcnZlci5FeHBlcmltZW50UmVxdWVzdCcsIHRoaXMuX29uRXhwZXJpbWVudFJlcXVlc3QpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLlJlYWR5JywgKGV2dCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvbicsIChldnQpID0+IHtcbiAgICAgICAgICByZWplY3QoZXZ0LmRhdGEuZXJyb3IpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkVycm9yLkNvbm5lY3Rpb25SZWZ1c2VkJywgKGV2dCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGVtbyA9IG5ldyBEZW1vQ29ubmVjdG9yKCk7XG4gICAgICAgICAgdGhpcy5kZW1vLmFkZEV2ZW50TGlzdGVuZXIoJ0RlbW9Db250cm9sbGVyLkV4cGVyaW1lbnQuVXBkYXRlJywgdGhpcy5fb25FeHBlcmltZW50VXBkYXRlKTtcbiAgICAgICAgICB0aGlzLmRlbW8uYWRkRXZlbnRMaXN0ZW5lcignRGVtb0NvbnRyb2xsZXIuRXhwZXJpbWVudC5SZWFkeScsIHRoaXMuX29uRXhwZXJpbWVudFJlYWR5KTtcbiAgICAgICAgICB0aGlzLmRlbW8uaW5pdCgpO1xuICAgICAgICAgIEdsb2JhbHMuc2V0KCdldWdsZW5hU2VydmVyTW9kZScsICdkZW1vJyk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgICBpZDogXCJkZW1vX21vZGVcIixcbiAgICAgICAgICAgIHR5cGU6IFwibm90aWNlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkRlbW8gTW9kZVwiXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmJwdS5pbml0KCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vblN1Ym1pc3Npb25FcnJvcihldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICBpZDogXCJzdWJtaXNzaW9uX3JlamVjdGVkXCIsXG4gICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgbWVzc2FnZTogYFN1Ym1pc3Npb24gcmVqZWN0ZWQ6ICR7ZXZ0LmRhdGEuZXJyb3J9YFxuICAgICAgfSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgZXJyb3I6IGBTdWJtaXNzaW9uIHJlamVjdGVkOiAke2V2dC5kYXRhLmVycm9yfWBcbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25RdWV1ZUVycm9yKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgIGlkOiBcInN1Ym1pc3Npb25fcmVqZWN0ZWRcIixcbiAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICBtZXNzYWdlOiBgUXVldWUgcmVxdWVzdCByZWplY3RlZDogJHtldnQuZGF0YS5lcnJvcn1gXG4gICAgICB9KTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgZXJyb3I6IGBRdWV1ZSByZXF1ZXN0IHJlamVjdGVkOiAke2V2dC5kYXRhLmVycm9yfWBcbiAgICAgIH0pO1xuICAgIH1cbiAgICBfb25FeHBlcmltZW50VXBkYXRlKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCBldnQuZGF0YSk7XG4gICAgfVxuICAgIF9vbkV4cGVyaW1lbnRSZWFkeShldnQpIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsID0gZXZ0LmRhdGEuZGF0YTtcbiAgICAgIGNvbnN0IHJlcG9ydCA9IG9yaWdpbmFsLmV4cGVyaW1lbnQ7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLlVwZGF0ZScsIHtcbiAgICAgICAgZXhwZXJpbWVudF9pZDogcmVwb3J0LmV4cF9tZXRhRGF0YS5FeHBOYW1lLFxuICAgICAgICByZW1haW5pbmdfZXN0aW1hdGU6IDAsXG4gICAgICAgIHN0YXR1czogXCJkb3dubG9hZGluZ1wiXG4gICAgICB9KTtcbiAgICAgIEV1Z1V0aWxzLmdlbmVyYXRlUmVzdWx0cyh7XG4gICAgICAgIGJwdV9hcGlfaWQ6IHJlcG9ydC5leHBfbWV0YURhdGEuRXhwTmFtZSxcbiAgICAgICAgZXhwZXJpbWVudElkOiByZXBvcnQuZXhwX21ldGFEYXRhLnRhZ1xuICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLlJlc3VsdHMnLCBkYXRhKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgIGlkOiBcInJlc3VsdF9zdWJtaXNzaW9uX2Vycm9yXCIsXG4gICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgIG1lc3NhZ2U6IGBSZXN1bHRzIHNhdmluZyBlcnJvcjogJHtlcnJ9YFxuICAgICAgICB9KVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB7XG4gICAgICAgICAgZXJyb3I6IGBSZXN1bHRzIHNhdmluZyBlcnJvcjogJHtlcnJ9YFxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudFJlcXVlc3QoZXZ0KSB7XG4gICAgICBjb25zdCBsaWdodERhdGEgPSBbXTtcbiAgICAgIGxldCB0aW1lQWNjdW11bGF0ZWQgPSAwXG4gICAgICBldnQuZGF0YS5saWdodHMuZm9yRWFjaCgobGQpID0+IHtcbiAgICAgICAgbGlnaHREYXRhLnB1c2goe1xuICAgICAgICAgIHRvcFZhbHVlOiBsZC50b3AsXG4gICAgICAgICAgcmlnaHRWYWx1ZTogbGQucmlnaHQsXG4gICAgICAgICAgYm90dG9tVmFsdWU6IGxkLmJvdHRvbSxcbiAgICAgICAgICBsZWZ0VmFsdWU6IGxkLmxlZnQsXG4gICAgICAgICAgdGltZTogdGltZUFjY3VtdWxhdGVkXG4gICAgICAgIH0pO1xuICAgICAgICB0aW1lQWNjdW11bGF0ZWQgKz0gbGQuZHVyYXRpb24gKiAxMDAwXG4gICAgICB9KVxuXG4gICAgICAvLyBGaXJzdCwgY2hlY2sgd2hldGhlciB0aGlzIGV4cGVyaW1lbnQgaGFzIGFscmVhZHkgYmVlbiBydW4uXG4gICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgdGhpcy5fc2VhcmNoQW5kTG9hZERhdGEoZXZ0LmRhdGEubGlnaHRzLCBudWxsLCAnZXhwZXJpbWVudCcsIHJlc29sdmUpO1xuICAgICAgfSkudGhlbigoZXhwSWRBbmRSZXN1bHRzKSA9PiB7XG4gICAgICAgIC8vIExvb2sgd2hpY2ggcHJldmlvdXMgZXhwZXJpbWVudCBoYXMgdGhlIHNhbWUgbGlnaHQgY29uZmlndXJhdGlvbi4gLS0+IFN0b3JlIGl0cyBpZCBpbiBjb3B5T2ZJRC5cbiAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoXCIvYXBpL3YxL0V4cGVyaW1lbnRzXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHN0dWRlbnRJZDogR2xvYmFscy5nZXQoJ3N0dWRlbnRfaWQnKSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IGV2dC5kYXRhLmxpZ2h0cyxcbiAgICAgICAgICAgIGV4cEZvcm06IGV2dC5kYXRhLmV4cEZvcm0gPyBldnQuZGF0YS5leHBGb3JtIDogbnVsbCxcbiAgICAgICAgICAgIGxhYjogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5sYWInKSxcbiAgICAgICAgICAgIGNvcHlPZklEOiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmV1Z2xlbmFTZXJ2ZXJNb2RlJyk9PT0nc2ltdWxhdGUnICYmIGV4cElkQW5kUmVzdWx0cy5jb3B5T2ZJRCA+IDAgJiYgZXhwSWRBbmRSZXN1bHRzLnJlc3VsdHMubGVuZ3RoKSA/IGV4cElkQW5kUmVzdWx0cy5jb3B5T2ZJRCA6IDAgLy8gdXBkYXRlIHRoZSBjb3B5T2ZJRCBpZiBpdCBpcyBmb3VuZC5cbiAgICAgICAgICB9KSxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkV4cGVyaW1lbnRTYXZlZCcsIHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnQ6IGRhdGFcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnZXVnbGVuYVNlcnZlck1vZGUnKSA9PSAnZGVtbycpIHtcbiAgICAgICAgICAgIHRoaXMuZGVtby5ydW5FeHBlcmltZW50KGxpZ2h0RGF0YSwgZGF0YS5pZCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChHbG9iYWxzLmdldCgnZXVnbGVuYVNlcnZlck1vZGUnKSA9PSAnc2ltdWxhdGUnKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5jb3B5T2ZJRD4wKSB7XG4gICAgICAgICAgICAgICAgLy8gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vICAgdGhpcy5fc2VhcmNoQW5kTG9hZERhdGEobGlnaHREYXRhLCBkYXRhLmNvcHlPZklELCAncmVzdWx0cycsIHJlc29sdmUpO1xuICAgICAgICAgICAgICAgIC8vIH0pLnRoZW4oKHJlc3VsdHNEYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGlmICghcmVzdWx0c0RhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICB0aGlzLmJwdS5ydW5FeHBlcmltZW50KGxpZ2h0RGF0YSwgZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXhwSWRBbmRSZXN1bHRzLnJlc3VsdHNbMF0uZXhwZXJpbWVudElkID0gZGF0YS5pZDtcbiAgICAgICAgICAgICAgICBkZWxldGUgZXhwSWRBbmRSZXN1bHRzLnJlc3VsdHNbMF0uaWQ7XG4gICAgICAgICAgICAgICAgRXVnVXRpbHMuZ2VuZXJhdGVSZXN1bHRzKCBleHBJZEFuZFJlc3VsdHMucmVzdWx0c1swXSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IFwicmVzdWx0X3N1Ym1pc3Npb25fZXJyb3JcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgUmVzdWx0cyBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBgUmVzdWx0cyBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgLy9HbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLlJlc3VsdHMnLCBleHBJZEFuZFJlc3VsdHMucmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAvLyB9KS5jYXRjaCgocmVhc29uKSA9PiB7IGNvbnNvbGUubG9nKCdIYW5kbGUgcmVqZWN0ZWQgUmVzdWx0cyBwcm9taXNlKCcgKyByZWFzb24gKyAnKSBoZXJlLicpfSk7O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5icHUucnVuRXhwZXJpbWVudChsaWdodERhdGEsIGRhdGEuaWQpO1xuICAgICAgICAgICAgfSAvLyBDaGVjayBmaXJzdCB3aGV0aGVyIHRoZXJlIGlzIGFub3RoZXIgZXhwZXJpbWVudCB3aXRoIHRoZSBzYW1lIGNvbmZpZy4gSWYgc28sIGxvYWQgdGhhdC4gT3RoZXJ3aXNlLCBydW4gdGhlIGJwdS5cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJwdS5ydW5FeHBlcmltZW50KGxpZ2h0RGF0YSwgZGF0YS5pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgICBpZDogXCJleHBlcmltZW50X3N1Ym1pc3Npb25fZXJyb3JcIixcbiAgICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBFeHBlcmltZW50IHNhdmluZyBlcnJvcjogJHtlcnJ9YFxuICAgICAgICAgIH0pXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5GYWlsdXJlJywge1xuICAgICAgICAgICAgZXJyb3I6IGBFeHBlcmltZW50IHNhdmluZyBlcnJvcjogJHtlcnJ9YFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgfSkuY2F0Y2goKHJlYXNvbikgPT4geyBjb25zb2xlLmxvZygnSGFuZGxlIHJlamVjdGVkIEV4cGVyaW1lbnQgcHJvbWlzZSgnICsgcmVhc29uICsgJykgaGVyZS4nKX0pO1xuICAgIH1cblxuICAgIF9zZWFyY2hBbmRMb2FkRGF0YShsaWdodERhdGEsIGV4cElkLCBsb2FkRGF0YSwgcmVzb2x2ZSkge1xuXG4gIC8vICAgIGlmIChsb2FkRGF0YSA9PT0gJ2V4cGVyaW1lbnQnKSB7XG5cbiAgICAgICAgLy8gVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMnLCB7XG4gICAgICAgIC8vICAgZGF0YToge1xuICAgICAgICAvLyAgICAgZmlsdGVyOiB7XG4gICAgICAgIC8vICAgICAgIHdoZXJlOntcbiAgICAgICAgLy8gICAgICAgICBjb3B5T2ZJRDogMFxuICAgICAgICAvLyAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgfSxcbiAgICAgICAgLy8gICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIC8vIH0pXG5cbiAgICAgICAgVXRpbHMucHJvbWlzZUFqYXgoJy9hcGkvdjEvRXhwZXJpbWVudHMvZXhwc1dpdGhSZXN1bHRzJywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGNvcHlPZklEOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG11bHRpcGxlIGV4cGVyaW1lbnRzIGZvdW5kLCByZXR1cm4gdGhlIG1vc3QgcmVjZW50IG9uZVxuICAgICAgICAgIHZhciBmaWx0ZXJlZERhdGEgPSBkYXRhO1xuICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeDw0OyBpZHgrKykge1xuICAgICAgICAgIFx0aWYgKGZpbHRlcmVkRGF0YS5sZW5ndGggPjApIHtcbiAgICAgICAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhLmZpbHRlcihleHAgPT4ge1xuICAgICAgICAgICAgXHRcdHZhciBleHBDb25maWcgPSBleHAuY29uZmlndXJhdGlvbjtcbiAgICAgICAgICAgIFx0XHR2YXIgaXNNYXRjaCA9IHRydWU7XG4gICAgICAgICAgICBcdFx0Zm9yIChsZXQgZWxlbSBvZiBPYmplY3Qua2V5cyhsaWdodERhdGFbaWR4XSkpIHtcbiAgICAgICAgICAgIFx0XHRcdGlmIChleHBDb25maWdbaWR4XVtlbGVtXSAhPSBsaWdodERhdGFbaWR4XVtlbGVtXSkge1xuICAgICAgICAgICAgXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBcdFx0fVxuICAgICAgICAgICAgXHRcdGlmIChpc01hdGNoKSB7cmV0dXJuIHRydWV9O1xuICAgICAgICAgICAgXHR9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBjb3B5T2ZJRCA9IDA7XG4gICAgICAgICAgaWYgKGZpbHRlcmVkRGF0YS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGEuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKGIuZGF0ZV9jcmVhdGVkKSkuZ2V0VGltZSgpIC0gKG5ldyBEYXRlKGEuZGF0ZV9jcmVhdGVkKSkuZ2V0VGltZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvcHlPZklEID0gZmlsdGVyZWREYXRhWzBdLmlkXG4gICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXJlZERhdGEubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGNvcHlPZklEID0gZmlsdGVyZWREYXRhWzBdLmlkXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvcHlPZklEPjApIHtcbiAgICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL1Jlc3VsdHNgLCB7XG4gICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgICAgIGFuZDogW1xuICAgICAgICAgICAgICAgICAgICAgIHsgZXhwZXJpbWVudElkOiBjb3B5T2ZJRCB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJwdV9hcGlfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmVxOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9KS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICAgIHZhciBleHBJZEFuZFJlc3VsdHMgPSB7Y29weU9mSUQ6IGNvcHlPZklELCByZXN1bHRzOiByZXN1bHRzfTtcbiAgICAgICAgICAgICAgcmVzb2x2ZShleHBJZEFuZFJlc3VsdHMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKHtjb3B5T2ZJRDogMCwgcmVzdWx0czogbnVsbH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9yZXNvbHZlKGNvcHlPZklEKTtcblxuICAgICAgICB9KVxuICAgICAgLy8gfSBlbHNlIGlmIChsb2FkRGF0YSA9PT0gJ3Jlc3VsdHMnKSB7XG4gICAgICAvLyAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL1Jlc3VsdHNgLCB7XG4gICAgICAvLyAgICAgZGF0YToge1xuICAgICAgLy8gICAgICAgZmlsdGVyOiB7XG4gICAgICAvLyAgICAgICAgIHdoZXJlOiB7XG4gICAgICAvLyAgICAgICAgICAgYW5kOiBbXG4gICAgICAvLyAgICAgICAgICAgICB7IGV4cGVyaW1lbnRJZDogZXhwSWQgfSxcbiAgICAgIC8vICAgICAgICAgICAgIHtcbiAgICAgIC8vICAgICAgICAgICAgICAgYnB1X2FwaV9pZDoge1xuICAgICAgLy8gICAgICAgICAgICAgICAgIG5lcTogbnVsbFxuICAgICAgLy8gICAgICAgICAgICAgICB9XG4gICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAvLyAgICAgICAgICAgXVxuICAgICAgLy8gICAgICAgICB9XG4gICAgICAvLyAgICAgICB9XG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAvLyAgIH0pLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgIC8vICAgICByZXNvbHZlKHJlc3VsdHMpXG4gICAgICAvLyAgIH0pXG4gICAgICAvLyB9XG5cblxuICAgIH1cblxuICB9XG59KVxuIl19
