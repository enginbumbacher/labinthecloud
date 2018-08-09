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
            console.log(evt);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQlBVQ29ubmVjdG9yIiwiRGVtb0Nvbm5lY3RvciIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJnZXQiLCJzZXQiLCJicHUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU3VibWlzc2lvbkVycm9yIiwiX29uUXVldWVFcnJvciIsIl9vbkV4cGVyaW1lbnRVcGRhdGUiLCJfb25FeHBlcmltZW50UmVhZHkiLCJfZXhwZXJpbWVudHMiLCJfb25FeHBlcmltZW50UmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXZ0IiwiY29uc29sZSIsImxvZyIsImRhdGEiLCJlcnJvciIsImRlbW8iLCJpbml0IiwiZGlzcGF0Y2hFdmVudCIsImlkIiwidHlwZSIsIm1lc3NhZ2UiLCJvcmlnaW5hbCIsInJlcG9ydCIsImV4cGVyaW1lbnQiLCJleHBlcmltZW50X2lkIiwiZXhwX21ldGFEYXRhIiwiRXhwTmFtZSIsInJlbWFpbmluZ19lc3RpbWF0ZSIsInN0YXR1cyIsImdlbmVyYXRlUmVzdWx0cyIsImJwdV9hcGlfaWQiLCJleHBlcmltZW50SWQiLCJ0YWciLCJ0aGVuIiwiY2F0Y2giLCJlcnIiLCJsaWdodERhdGEiLCJ0aW1lQWNjdW11bGF0ZWQiLCJsaWdodHMiLCJmb3JFYWNoIiwibGQiLCJwdXNoIiwidG9wVmFsdWUiLCJ0b3AiLCJyaWdodFZhbHVlIiwicmlnaHQiLCJib3R0b21WYWx1ZSIsImJvdHRvbSIsImxlZnRWYWx1ZSIsImxlZnQiLCJ0aW1lIiwiZHVyYXRpb24iLCJfc2VhcmNoQW5kTG9hZERhdGEiLCJleHBJZEFuZFJlc3VsdHMiLCJwcm9taXNlQWpheCIsIm1ldGhvZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdHVkZW50SWQiLCJjb25maWd1cmF0aW9uIiwiZXhwRm9ybSIsImxhYiIsImNvcHlPZklEIiwicmVzdWx0cyIsImxlbmd0aCIsImNvbnRlbnRUeXBlIiwicnVuRXhwZXJpbWVudCIsInJlYXNvbiIsImV4cElkIiwibG9hZERhdGEiLCJmaWx0ZXJlZERhdGEiLCJpZHgiLCJmaWx0ZXIiLCJleHBDb25maWciLCJleHAiLCJpc01hdGNoIiwiT2JqZWN0Iiwia2V5cyIsImVsZW0iLCJzb3J0IiwiYSIsImIiLCJEYXRlIiwiZGF0ZV9jcmVhdGVkIiwiZ2V0VGltZSIsIndoZXJlIiwiYW5kIiwibmVxIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BR0VJLGVBQWVKLFFBQVEsaUJBQVIsQ0FIakI7QUFBQSxNQUlFSyxnQkFBZ0JMLFFBQVEsa0JBQVIsQ0FKbEI7QUFBQSxNQUtFTSxXQUFXTixRQUFRLGVBQVIsQ0FMYjs7QUFRQTtBQUFBOztBQUNFLG1DQUFjO0FBQUE7O0FBQUE7O0FBR1pFLFlBQU1LLFdBQU4sUUFBd0IsQ0FDdEIsc0JBRHNCLEVBRXBCLHFCQUZvQixFQUdwQixvQkFIb0IsRUFJcEIsZUFKb0IsRUFLcEIsb0JBTG9CLEVBTXBCLG9CQU5vQixDQUF4Qjs7QUFTQSxVQUFJSixRQUFRSyxHQUFSLENBQVksd0NBQVosQ0FBSixFQUEyRDtBQUN6REwsZ0JBQVFNLEdBQVIsQ0FBWSxtQkFBWixFQUFnQ04sUUFBUUssR0FBUixDQUFZLHdDQUFaLENBQWhDO0FBQ0QsT0FGRCxNQUVPO0FBQ0xMLGdCQUFRTSxHQUFSLENBQVksbUJBQVosRUFBaUMsS0FBakM7QUFDRDtBQUNELFlBQUtDLEdBQUwsR0FBVyxJQUFJTixZQUFKLEVBQVg7QUFDQSxZQUFLTSxHQUFMLENBQVNDLGdCQUFULENBQTBCLGdDQUExQixFQUE0RCxNQUFLQyxrQkFBakU7QUFDQSxZQUFLRixHQUFMLENBQVNDLGdCQUFULENBQTBCLDJCQUExQixFQUF1RCxNQUFLRSxhQUE1RDtBQUNBLFlBQUtILEdBQUwsQ0FBU0MsZ0JBQVQsQ0FBMEIsaUNBQTFCLEVBQTZELE1BQUtHLG1CQUFsRTtBQUNBLFlBQUtKLEdBQUwsQ0FBU0MsZ0JBQVQsQ0FBMEIsZ0NBQTFCLEVBQTRELE1BQUtJLGtCQUFqRTs7QUFFQSxZQUFLQyxZQUFMLEdBQW9CLEVBQXBCOztBQUVBYixjQUFRSyxHQUFSLENBQVksT0FBWixFQUFxQkcsZ0JBQXJCLENBQXNDLG9DQUF0QyxFQUE0RSxNQUFLTSxvQkFBakY7QUF6Qlk7QUEwQmI7O0FBM0JIO0FBQUE7QUFBQSw2QkE2QlM7QUFBQTs7QUFDTCxlQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsaUJBQUtWLEdBQUwsQ0FBU0MsZ0JBQVQsQ0FBMEIscUJBQTFCLEVBQWlELFVBQUNVLEdBQUQsRUFBUztBQUN4REYsb0JBQVEsSUFBUjtBQUNELFdBRkQ7QUFHQSxpQkFBS1QsR0FBTCxDQUFTQyxnQkFBVCxDQUEwQixnQ0FBMUIsRUFBNEQsVUFBQ1UsR0FBRCxFQUFTO0FBQ25FQyxvQkFBUUMsR0FBUixDQUFZRixHQUFaO0FBQ0FELG1CQUFPQyxJQUFJRyxJQUFKLENBQVNDLEtBQWhCO0FBQ0QsV0FIRDtBQUlBLGlCQUFLZixHQUFMLENBQVNDLGdCQUFULENBQTBCLHVDQUExQixFQUFtRSxVQUFDVSxHQUFELEVBQVM7QUFDMUUsbUJBQUtLLElBQUwsR0FBWSxJQUFJckIsYUFBSixFQUFaO0FBQ0EsbUJBQUtxQixJQUFMLENBQVVmLGdCQUFWLENBQTJCLGtDQUEzQixFQUErRCxPQUFLRyxtQkFBcEU7QUFDQSxtQkFBS1ksSUFBTCxDQUFVZixnQkFBVixDQUEyQixpQ0FBM0IsRUFBOEQsT0FBS0ksa0JBQW5FO0FBQ0EsbUJBQUtXLElBQUwsQ0FBVUMsSUFBVjtBQUNBeEIsb0JBQVFNLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxNQUFqQztBQUNBTixvQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJvQixhQUFyQixDQUFtQyxtQkFBbkMsRUFBd0Q7QUFDdERDLGtCQUFJLFdBRGtEO0FBRXREQyxvQkFBTSxRQUZnRDtBQUd0REMsdUJBQVM7QUFINkMsYUFBeEQ7QUFLQVosb0JBQVEsSUFBUjtBQUNELFdBWkQ7QUFhQSxpQkFBS1QsR0FBTCxDQUFTaUIsSUFBVDtBQUNELFNBdEJNLENBQVA7QUF1QkQ7QUFyREg7QUFBQTtBQUFBLHlDQXVEcUJOLEdBdkRyQixFQXVEMEI7QUFDdEJsQixnQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJvQixhQUFyQixDQUFtQyxtQkFBbkMsRUFBd0Q7QUFDdERDLGNBQUkscUJBRGtEO0FBRXREQyxnQkFBTSxPQUZnRDtBQUd0REMsNkNBQWlDVixJQUFJRyxJQUFKLENBQVNDO0FBSFksU0FBeEQ7QUFLQXRCLGdCQUFRSyxHQUFSLENBQVksT0FBWixFQUFxQm9CLGFBQXJCLENBQW1DLDBCQUFuQyxFQUErRDtBQUM3REgsMkNBQStCSixJQUFJRyxJQUFKLENBQVNDO0FBRHFCLFNBQS9EO0FBR0Q7QUFoRUg7QUFBQTtBQUFBLG9DQWlFZ0JKLEdBakVoQixFQWlFcUI7QUFDakJsQixnQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJvQixhQUFyQixDQUFtQyxtQkFBbkMsRUFBd0Q7QUFDdERDLGNBQUkscUJBRGtEO0FBRXREQyxnQkFBTSxPQUZnRDtBQUd0REMsZ0RBQW9DVixJQUFJRyxJQUFKLENBQVNDO0FBSFMsU0FBeEQ7QUFLQXRCLGdCQUFRSyxHQUFSLENBQVksT0FBWixFQUFxQm9CLGFBQXJCLENBQW1DLDBCQUFuQyxFQUErRDtBQUM3REgsOENBQWtDSixJQUFJRyxJQUFKLENBQVNDO0FBRGtCLFNBQS9EO0FBR0Q7QUExRUg7QUFBQTtBQUFBLDBDQTJFc0JKLEdBM0V0QixFQTJFMkI7QUFDdkJsQixnQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJvQixhQUFyQixDQUFtQyx5QkFBbkMsRUFBOERQLElBQUlHLElBQWxFO0FBQ0Q7QUE3RUg7QUFBQTtBQUFBLHlDQThFcUJILEdBOUVyQixFQThFMEI7QUFDdEIsWUFBTVcsV0FBV1gsSUFBSUcsSUFBSixDQUFTQSxJQUExQjtBQUNBLFlBQU1TLFNBQVNELFNBQVNFLFVBQXhCO0FBQ0EvQixnQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJvQixhQUFyQixDQUFtQyx5QkFBbkMsRUFBOEQ7QUFDNURPLHlCQUFlRixPQUFPRyxZQUFQLENBQW9CQyxPQUR5QjtBQUU1REMsOEJBQW9CLENBRndDO0FBRzVEQyxrQkFBUTtBQUhvRCxTQUE5RDtBQUtBakMsaUJBQVNrQyxlQUFULENBQXlCO0FBQ3ZCQyxzQkFBWVIsT0FBT0csWUFBUCxDQUFvQkMsT0FEVDtBQUV2Qkssd0JBQWNULE9BQU9HLFlBQVAsQ0FBb0JPO0FBRlgsU0FBekIsRUFHR0MsSUFISCxDQUdRLFVBQUNwQixJQUFELEVBQVU7QUFDaEJyQixrQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJvQixhQUFyQixDQUFtQywwQkFBbkMsRUFBK0RKLElBQS9EO0FBQ0EsaUJBQU9BLElBQVA7QUFDRCxTQU5ELEVBTUdxQixLQU5ILENBTVMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hCM0Msa0JBQVFLLEdBQVIsQ0FBWSxPQUFaLEVBQXFCb0IsYUFBckIsQ0FBbUMsbUJBQW5DLEVBQXdEO0FBQ3REQyxnQkFBSSx5QkFEa0Q7QUFFdERDLGtCQUFNLE9BRmdEO0FBR3REQyxnREFBa0NlO0FBSG9CLFdBQXhEO0FBS0EzQyxrQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJvQixhQUFyQixDQUFtQywwQkFBbkMsRUFBK0Q7QUFDN0RILDhDQUFnQ3FCO0FBRDZCLFdBQS9EO0FBR0QsU0FmRDtBQWdCRDtBQXRHSDtBQUFBO0FBQUEsMkNBd0d1QnpCLEdBeEd2QixFQXdHNEI7QUFBQTs7QUFDeEIsWUFBTTBCLFlBQVksRUFBbEI7QUFDQSxZQUFJQyxrQkFBa0IsQ0FBdEI7QUFDQTNCLFlBQUlHLElBQUosQ0FBU3lCLE1BQVQsQ0FBZ0JDLE9BQWhCLENBQXdCLFVBQUNDLEVBQUQsRUFBUTtBQUM5Qkosb0JBQVVLLElBQVYsQ0FBZTtBQUNiQyxzQkFBVUYsR0FBR0csR0FEQTtBQUViQyx3QkFBWUosR0FBR0ssS0FGRjtBQUdiQyx5QkFBYU4sR0FBR08sTUFISDtBQUliQyx1QkFBV1IsR0FBR1MsSUFKRDtBQUtiQyxrQkFBTWI7QUFMTyxXQUFmO0FBT0FBLDZCQUFtQkcsR0FBR1csUUFBSCxHQUFjLElBQWpDO0FBQ0QsU0FURDs7QUFXQTtBQUNBLFlBQUk1QyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFTQyxNQUFULEVBQW9CO0FBQzlCLGlCQUFLMkMsa0JBQUwsQ0FBd0IxQyxJQUFJRyxJQUFKLENBQVN5QixNQUFqQyxFQUF5QyxJQUF6QyxFQUErQyxZQUEvQyxFQUE2RDlCLE9BQTdEO0FBQ0QsU0FGRCxFQUVHeUIsSUFGSCxDQUVRLFVBQUNvQixlQUFELEVBQXFCO0FBQzNCO0FBQ0E5RCxnQkFBTStELFdBQU4sQ0FBa0IscUJBQWxCLEVBQXlDO0FBQ3ZDQyxvQkFBUSxNQUQrQjtBQUV2QzFDLGtCQUFNMkMsS0FBS0MsU0FBTCxDQUFlO0FBQ25CQyx5QkFBV2xFLFFBQVFLLEdBQVIsQ0FBWSxZQUFaLENBRFE7QUFFbkI4RCw2QkFBZWpELElBQUlHLElBQUosQ0FBU3lCLE1BRkw7QUFHbkJzQix1QkFBU2xELElBQUlHLElBQUosQ0FBUytDLE9BQVQsR0FBbUJsRCxJQUFJRyxJQUFKLENBQVMrQyxPQUE1QixHQUFzQyxJQUg1QjtBQUluQkMsbUJBQUtyRSxRQUFRSyxHQUFSLENBQVksZUFBWixDQUpjO0FBS25CaUUsd0JBQVd0RSxRQUFRSyxHQUFSLENBQVksd0NBQVosTUFBd0QsVUFBeEQsSUFBc0V3RCxnQkFBZ0JTLFFBQWhCLEdBQTJCLENBQWpHLElBQXNHVCxnQkFBZ0JVLE9BQWhCLENBQXdCQyxNQUEvSCxHQUF5SVgsZ0JBQWdCUyxRQUF6SixHQUFvSyxDQUwzSixDQUs2SjtBQUw3SixhQUFmLENBRmlDO0FBU3ZDRyx5QkFBYTtBQVQwQixXQUF6QyxFQVVHaEMsSUFWSCxDQVVRLFVBQUNwQixJQUFELEVBQVU7QUFDaEJyQixvQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJvQixhQUFyQixDQUFtQyxrQ0FBbkMsRUFBdUU7QUFDckVNLDBCQUFZVjtBQUR5RCxhQUF2RTs7QUFJQSxnQkFBSXJCLFFBQVFLLEdBQVIsQ0FBWSxtQkFBWixLQUFvQyxNQUF4QyxFQUFnRDtBQUM5QyxxQkFBS2tCLElBQUwsQ0FBVW1ELGFBQVYsQ0FBd0I5QixTQUF4QixFQUFtQ3ZCLEtBQUtLLEVBQXhDO0FBQ0QsYUFGRCxNQUVPLElBQUkxQixRQUFRSyxHQUFSLENBQVksbUJBQVosS0FBb0MsVUFBeEMsRUFBb0Q7QUFDekQsa0JBQUlnQixLQUFLaUQsUUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBVCxnQ0FBZ0JVLE9BQWhCLENBQXdCLENBQXhCLEVBQTJCaEMsWUFBM0IsR0FBMENsQixLQUFLSyxFQUEvQztBQUNBLHVCQUFPbUMsZ0JBQWdCVSxPQUFoQixDQUF3QixDQUF4QixFQUEyQjdDLEVBQWxDO0FBQ0F2Qix5QkFBU2tDLGVBQVQsQ0FBMEJ3QixnQkFBZ0JVLE9BQWhCLENBQXdCLENBQXhCLENBQTFCLEVBQXNEOUIsSUFBdEQsQ0FBMkQsVUFBQ3BCLElBQUQsRUFBVTtBQUNuRXJCLDBCQUFRSyxHQUFSLENBQVksT0FBWixFQUFxQm9CLGFBQXJCLENBQW1DLDBCQUFuQyxFQUErREosSUFBL0Q7QUFDQSx5QkFBT0EsSUFBUDtBQUNELGlCQUhELEVBR0dxQixLQUhILENBR1MsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hCM0MsMEJBQVFLLEdBQVIsQ0FBWSxPQUFaLEVBQXFCb0IsYUFBckIsQ0FBbUMsbUJBQW5DLEVBQXdEO0FBQ3REQyx3QkFBSSx5QkFEa0Q7QUFFdERDLDBCQUFNLE9BRmdEO0FBR3REQyx3REFBa0NlO0FBSG9CLG1CQUF4RDtBQUtBM0MsMEJBQVFLLEdBQVIsQ0FBWSxPQUFaLEVBQXFCb0IsYUFBckIsQ0FBbUMsMEJBQW5DLEVBQStEO0FBQzdESCxzREFBZ0NxQjtBQUQ2QixtQkFBL0Q7QUFHRCxpQkFaRDtBQWFNO0FBQ0Y7QUFDSjtBQUNILGVBekJELE1BeUJPO0FBQ0wsdUJBQUtwQyxHQUFMLENBQVNtRSxhQUFULENBQXVCOUIsU0FBdkIsRUFBa0N2QixLQUFLSyxFQUF2QztBQUNELGVBNUJ3RCxDQTRCdkQ7QUFFSCxhQTlCTSxNQThCQTtBQUNMLHFCQUFLbkIsR0FBTCxDQUFTbUUsYUFBVCxDQUF1QjlCLFNBQXZCLEVBQWtDdkIsS0FBS0ssRUFBdkM7QUFDRDtBQUNGLFdBbERELEVBa0RHZ0IsS0FsREgsQ0FrRFMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hCM0Msb0JBQVFLLEdBQVIsQ0FBWSxPQUFaLEVBQXFCb0IsYUFBckIsQ0FBbUMsbUJBQW5DLEVBQXdEO0FBQ3REQyxrQkFBSSw2QkFEa0Q7QUFFdERDLG9CQUFNLE9BRmdEO0FBR3REQyxxREFBcUNlO0FBSGlCLGFBQXhEO0FBS0EzQyxvQkFBUUssR0FBUixDQUFZLE9BQVosRUFBcUJvQixhQUFyQixDQUFtQywwQkFBbkMsRUFBK0Q7QUFDN0RILG1EQUFtQ3FCO0FBRDBCLGFBQS9EO0FBR0QsV0EzREQ7QUE0REQsU0FoRUQsRUFnRUdELEtBaEVILENBZ0VTLFVBQUNpQyxNQUFELEVBQVk7QUFBRXhELGtCQUFRQyxHQUFSLENBQVksd0NBQXdDdUQsTUFBeEMsR0FBaUQsU0FBN0Q7QUFBd0UsU0FoRS9GO0FBaUVEO0FBeExIO0FBQUE7QUFBQSx5Q0EwTHFCL0IsU0ExTHJCLEVBMExnQ2dDLEtBMUxoQyxFQTBMdUNDLFFBMUx2QyxFQTBMaUQ3RCxPQTFMakQsRUEwTDBEOztBQUUxRDs7QUFFTTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQWpCLGNBQU0rRCxXQUFOLENBQWtCLHFDQUFsQixFQUF5RDtBQUN2RHpDLGdCQUFNO0FBQ0ppRCxzQkFBVTtBQUROO0FBRGlELFNBQXpELEVBSUc3QixJQUpILENBSVEsVUFBQ3BCLElBQUQsRUFBVTtBQUNoQjtBQUNBLGNBQUl5RCxlQUFlekQsSUFBbkI7QUFDQSxlQUFLLElBQUkwRCxNQUFNLENBQWYsRUFBa0JBLE1BQUksQ0FBdEIsRUFBeUJBLEtBQXpCLEVBQWdDO0FBQy9CLGdCQUFJRCxhQUFhTixNQUFiLEdBQXFCLENBQXpCLEVBQTRCO0FBQ3pCTSw2QkFBZUEsYUFBYUUsTUFBYixDQUFvQixlQUFPO0FBQzFDLG9CQUFJQyxZQUFZQyxJQUFJZixhQUFwQjtBQUNBLG9CQUFJZ0IsVUFBVSxJQUFkO0FBRjBDO0FBQUE7QUFBQTs7QUFBQTtBQUcxQyx1Q0FBaUJDLE9BQU9DLElBQVAsQ0FBWXpDLFVBQVVtQyxHQUFWLENBQVosQ0FBakIsOEhBQThDO0FBQUEsd0JBQXJDTyxJQUFxQzs7QUFDN0Msd0JBQUlMLFVBQVVGLEdBQVYsRUFBZU8sSUFBZixLQUF3QjFDLFVBQVVtQyxHQUFWLEVBQWVPLElBQWYsQ0FBNUIsRUFBa0Q7QUFDakQsNkJBQU8sS0FBUDtBQUNHO0FBQ0o7QUFQeUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFRMUMsb0JBQUlILE9BQUosRUFBYTtBQUFDLHlCQUFPLElBQVA7QUFBWTtBQUMxQixlQVRlLENBQWY7QUFVRDtBQUNGOztBQUVELGNBQUliLFdBQVcsQ0FBZjtBQUNBLGNBQUlRLGFBQWFOLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7QUFDM0JNLHlCQUFhUyxJQUFiLENBQWtCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQzFCLHFCQUFRLElBQUlDLElBQUosQ0FBU0QsRUFBRUUsWUFBWCxDQUFELENBQTJCQyxPQUEzQixLQUF3QyxJQUFJRixJQUFKLENBQVNGLEVBQUVHLFlBQVgsQ0FBRCxDQUEyQkMsT0FBM0IsRUFBOUM7QUFDRCxhQUZEO0FBR0F0Qix1QkFBV1EsYUFBYSxDQUFiLEVBQWdCcEQsRUFBM0I7QUFDRCxXQUxELE1BS08sSUFBSW9ELGFBQWFOLE1BQWIsSUFBdUIsQ0FBM0IsRUFBOEI7QUFDbkNGLHVCQUFXUSxhQUFhLENBQWIsRUFBZ0JwRCxFQUEzQjtBQUNEOztBQUVELGNBQUk0QyxXQUFTLENBQWIsRUFBZ0I7QUFDZHZFLGtCQUFNK0QsV0FBTixvQkFBcUM7QUFDbkN6QyxvQkFBTTtBQUNKMkQsd0JBQVE7QUFDTmEseUJBQU87QUFDTEMseUJBQUssQ0FDSCxFQUFFdkQsY0FBYytCLFFBQWhCLEVBREcsRUFFSDtBQUNFaEMsa0NBQVk7QUFDVnlELDZCQUFLO0FBREs7QUFEZCxxQkFGRztBQURBO0FBREQ7QUFESixlQUQ2QjtBQWVuQ3RCLDJCQUFhO0FBZnNCLGFBQXJDLEVBZ0JHaEMsSUFoQkgsQ0FnQlEsVUFBQzhCLE9BQUQsRUFBYTtBQUNuQixrQkFBSVYsa0JBQWtCLEVBQUNTLFVBQVVBLFFBQVgsRUFBcUJDLFNBQVNBLE9BQTlCLEVBQXRCO0FBQ0F2RCxzQkFBUTZDLGVBQVI7QUFDRCxhQW5CRDtBQW9CRCxXQXJCRCxNQXFCTztBQUNMN0Msb0JBQVEsRUFBQ3NELFVBQVUsQ0FBWCxFQUFjQyxTQUFTLElBQXZCLEVBQVI7QUFDRDs7QUFFRDtBQUVELFNBM0REO0FBNERGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHRDtBQTVSSDs7QUFBQTtBQUFBLElBQXlDekUsTUFBekM7QUErUkQsQ0F4U0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9zZXJ2ZXJpbnRlcmZhY2UvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEJQVUNvbm5lY3RvciA9IHJlcXVpcmUoJy4vYnB1X2Nvbm5lY3RvcicpLFxuICAgIERlbW9Db25uZWN0b3IgPSByZXF1aXJlKCcuL2RlbW9fY29ubmVjdG9yJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBFdWdsZW5hU2VydmVyTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRSZXF1ZXN0J1xuICAgICAgICAsICdfb25FeHBlcmltZW50VXBkYXRlJ1xuICAgICAgICAsICdfb25TdWJtaXNzaW9uRXJyb3InXG4gICAgICAgICwgJ19vblF1ZXVlRXJyb3InXG4gICAgICAgICwgJ19vbkV4cGVyaW1lbnRSZWFkeSdcbiAgICAgICAgLCAnX3NlYXJjaEFuZExvYWREYXRhJ1xuICAgICAgXSk7XG5cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXVnbGVuYVNlcnZlck1vZGUnKSkge1xuICAgICAgICBHbG9iYWxzLnNldCgnZXVnbGVuYVNlcnZlck1vZGUnLEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5ldWdsZW5hU2VydmVyTW9kZScpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR2xvYmFscy5zZXQoJ2V1Z2xlbmFTZXJ2ZXJNb2RlJywgJ2JwdScpO1xuICAgICAgfVxuICAgICAgdGhpcy5icHUgPSBuZXcgQlBVQ29ubmVjdG9yKCk7XG4gICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkVycm9yLlN1Ym1pc3Npb24nLCB0aGlzLl9vblN1Ym1pc3Npb25FcnJvcik7XG4gICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkVycm9yLlF1ZXVlJywgdGhpcy5fb25RdWV1ZUVycm9yKTtcbiAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5VcGRhdGUnLCB0aGlzLl9vbkV4cGVyaW1lbnRVcGRhdGUpO1xuICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlJlYWR5JywgdGhpcy5fb25FeHBlcmltZW50UmVhZHkpO1xuXG4gICAgICB0aGlzLl9leHBlcmltZW50cyA9IFtdO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLkV4cGVyaW1lbnRSZXF1ZXN0JywgdGhpcy5fb25FeHBlcmltZW50UmVxdWVzdCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuUmVhZHknLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5Db25uZWN0aW9uJywgKGV2dCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgICAgcmVqZWN0KGV2dC5kYXRhLmVycm9yKTtcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5Db25uZWN0aW9uUmVmdXNlZCcsIChldnQpID0+IHtcbiAgICAgICAgICB0aGlzLmRlbW8gPSBuZXcgRGVtb0Nvbm5lY3RvcigpO1xuICAgICAgICAgIHRoaXMuZGVtby5hZGRFdmVudExpc3RlbmVyKCdEZW1vQ29udHJvbGxlci5FeHBlcmltZW50LlVwZGF0ZScsIHRoaXMuX29uRXhwZXJpbWVudFVwZGF0ZSk7XG4gICAgICAgICAgdGhpcy5kZW1vLmFkZEV2ZW50TGlzdGVuZXIoJ0RlbW9Db250cm9sbGVyLkV4cGVyaW1lbnQuUmVhZHknLCB0aGlzLl9vbkV4cGVyaW1lbnRSZWFkeSk7XG4gICAgICAgICAgdGhpcy5kZW1vLmluaXQoKTtcbiAgICAgICAgICBHbG9iYWxzLnNldCgnZXVnbGVuYVNlcnZlck1vZGUnLCAnZGVtbycpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgICAgaWQ6IFwiZGVtb19tb2RlXCIsXG4gICAgICAgICAgICB0eXBlOiBcIm5vdGljZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogXCJEZW1vIE1vZGVcIlxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5icHUuaW5pdCgpO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25TdWJtaXNzaW9uRXJyb3IoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgaWQ6IFwic3VibWlzc2lvbl9yZWplY3RlZFwiLFxuICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgIG1lc3NhZ2U6IGBTdWJtaXNzaW9uIHJlamVjdGVkOiAke2V2dC5kYXRhLmVycm9yfWBcbiAgICAgIH0pXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB7XG4gICAgICAgIGVycm9yOiBgU3VibWlzc2lvbiByZWplY3RlZDogJHtldnQuZGF0YS5lcnJvcn1gXG4gICAgICB9KTtcbiAgICB9XG4gICAgX29uUXVldWVFcnJvcihldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICBpZDogXCJzdWJtaXNzaW9uX3JlamVjdGVkXCIsXG4gICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgbWVzc2FnZTogYFF1ZXVlIHJlcXVlc3QgcmVqZWN0ZWQ6ICR7ZXZ0LmRhdGEuZXJyb3J9YFxuICAgICAgfSk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLkZhaWx1cmUnLCB7XG4gICAgICAgIGVycm9yOiBgUXVldWUgcmVxdWVzdCByZWplY3RlZDogJHtldnQuZGF0YS5lcnJvcn1gXG4gICAgICB9KTtcbiAgICB9XG4gICAgX29uRXhwZXJpbWVudFVwZGF0ZShldnQpIHtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuVXBkYXRlJywgZXZ0LmRhdGEpO1xuICAgIH1cbiAgICBfb25FeHBlcmltZW50UmVhZHkoZXZ0KSB7XG4gICAgICBjb25zdCBvcmlnaW5hbCA9IGV2dC5kYXRhLmRhdGE7XG4gICAgICBjb25zdCByZXBvcnQgPSBvcmlnaW5hbC5leHBlcmltZW50O1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5VcGRhdGUnLCB7XG4gICAgICAgIGV4cGVyaW1lbnRfaWQ6IHJlcG9ydC5leHBfbWV0YURhdGEuRXhwTmFtZSxcbiAgICAgICAgcmVtYWluaW5nX2VzdGltYXRlOiAwLFxuICAgICAgICBzdGF0dXM6IFwiZG93bmxvYWRpbmdcIlxuICAgICAgfSk7XG4gICAgICBFdWdVdGlscy5nZW5lcmF0ZVJlc3VsdHMoe1xuICAgICAgICBicHVfYXBpX2lkOiByZXBvcnQuZXhwX21ldGFEYXRhLkV4cE5hbWUsXG4gICAgICAgIGV4cGVyaW1lbnRJZDogcmVwb3J0LmV4cF9tZXRhRGF0YS50YWdcbiAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgZGF0YSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICBpZDogXCJyZXN1bHRfc3VibWlzc2lvbl9lcnJvclwiLFxuICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICBtZXNzYWdlOiBgUmVzdWx0cyBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgfSlcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5GYWlsdXJlJywge1xuICAgICAgICAgIGVycm9yOiBgUmVzdWx0cyBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRSZXF1ZXN0KGV2dCkge1xuICAgICAgY29uc3QgbGlnaHREYXRhID0gW107XG4gICAgICBsZXQgdGltZUFjY3VtdWxhdGVkID0gMFxuICAgICAgZXZ0LmRhdGEubGlnaHRzLmZvckVhY2goKGxkKSA9PiB7XG4gICAgICAgIGxpZ2h0RGF0YS5wdXNoKHtcbiAgICAgICAgICB0b3BWYWx1ZTogbGQudG9wLFxuICAgICAgICAgIHJpZ2h0VmFsdWU6IGxkLnJpZ2h0LFxuICAgICAgICAgIGJvdHRvbVZhbHVlOiBsZC5ib3R0b20sXG4gICAgICAgICAgbGVmdFZhbHVlOiBsZC5sZWZ0LFxuICAgICAgICAgIHRpbWU6IHRpbWVBY2N1bXVsYXRlZFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZUFjY3VtdWxhdGVkICs9IGxkLmR1cmF0aW9uICogMTAwMFxuICAgICAgfSlcblxuICAgICAgLy8gRmlyc3QsIGNoZWNrIHdoZXRoZXIgdGhpcyBleHBlcmltZW50IGhhcyBhbHJlYWR5IGJlZW4gcnVuLlxuICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMuX3NlYXJjaEFuZExvYWREYXRhKGV2dC5kYXRhLmxpZ2h0cywgbnVsbCwgJ2V4cGVyaW1lbnQnLCByZXNvbHZlKTtcbiAgICAgIH0pLnRoZW4oKGV4cElkQW5kUmVzdWx0cykgPT4ge1xuICAgICAgICAvLyBMb29rIHdoaWNoIHByZXZpb3VzIGV4cGVyaW1lbnQgaGFzIHRoZSBzYW1lIGxpZ2h0IGNvbmZpZ3VyYXRpb24uIC0tPiBTdG9yZSBpdHMgaWQgaW4gY29weU9mSUQuXG4gICAgICAgIFV0aWxzLnByb21pc2VBamF4KFwiL2FwaS92MS9FeHBlcmltZW50c1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBzdHVkZW50SWQ6IEdsb2JhbHMuZ2V0KCdzdHVkZW50X2lkJyksXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiBldnQuZGF0YS5saWdodHMsXG4gICAgICAgICAgICBleHBGb3JtOiBldnQuZGF0YS5leHBGb3JtID8gZXZ0LmRhdGEuZXhwRm9ybSA6IG51bGwsXG4gICAgICAgICAgICBsYWI6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubGFiJyksXG4gICAgICAgICAgICBjb3B5T2ZJRDogKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5ldWdsZW5hU2VydmVyTW9kZScpPT09J3NpbXVsYXRlJyAmJiBleHBJZEFuZFJlc3VsdHMuY29weU9mSUQgPiAwICYmIGV4cElkQW5kUmVzdWx0cy5yZXN1bHRzLmxlbmd0aCkgPyBleHBJZEFuZFJlc3VsdHMuY29weU9mSUQgOiAwIC8vIHVwZGF0ZSB0aGUgY29weU9mSUQgaWYgaXQgaXMgZm91bmQuXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5FeHBlcmltZW50U2F2ZWQnLCB7XG4gICAgICAgICAgICBleHBlcmltZW50OiBkYXRhXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ2V1Z2xlbmFTZXJ2ZXJNb2RlJykgPT0gJ2RlbW8nKSB7XG4gICAgICAgICAgICB0aGlzLmRlbW8ucnVuRXhwZXJpbWVudChsaWdodERhdGEsIGRhdGEuaWQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ2V1Z2xlbmFTZXJ2ZXJNb2RlJykgPT0gJ3NpbXVsYXRlJykge1xuICAgICAgICAgICAgaWYgKGRhdGEuY29weU9mSUQ+MCkge1xuICAgICAgICAgICAgICAgIC8vIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgIHRoaXMuX3NlYXJjaEFuZExvYWREYXRhKGxpZ2h0RGF0YSwgZGF0YS5jb3B5T2ZJRCwgJ3Jlc3VsdHMnLCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgICAvLyB9KS50aGVuKChyZXN1bHRzRGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vICAgICBpZiAoIXJlc3VsdHNEYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgdGhpcy5icHUucnVuRXhwZXJpbWVudChsaWdodERhdGEsIGRhdGEuaWQpO1xuICAgICAgICAgICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV4cElkQW5kUmVzdWx0cy5yZXN1bHRzWzBdLmV4cGVyaW1lbnRJZCA9IGRhdGEuaWQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV4cElkQW5kUmVzdWx0cy5yZXN1bHRzWzBdLmlkO1xuICAgICAgICAgICAgICAgIEV1Z1V0aWxzLmdlbmVyYXRlUmVzdWx0cyggZXhwSWRBbmRSZXN1bHRzLnJlc3VsdHNbMF0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuUmVzdWx0cycsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBcInJlc3VsdF9zdWJtaXNzaW9uX2Vycm9yXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFJlc3VsdHMgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5GYWlsdXJlJywge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogYFJlc3VsdHMgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC8vR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgZXhwSWRBbmRSZXN1bHRzLnJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgLy8gfSkuY2F0Y2goKHJlYXNvbikgPT4geyBjb25zb2xlLmxvZygnSGFuZGxlIHJlamVjdGVkIFJlc3VsdHMgcHJvbWlzZSgnICsgcmVhc29uICsgJykgaGVyZS4nKX0pOztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuYnB1LnJ1bkV4cGVyaW1lbnQobGlnaHREYXRhLCBkYXRhLmlkKTtcbiAgICAgICAgICAgIH0gLy8gQ2hlY2sgZmlyc3Qgd2hldGhlciB0aGVyZSBpcyBhbm90aGVyIGV4cGVyaW1lbnQgd2l0aCB0aGUgc2FtZSBjb25maWcuIElmIHNvLCBsb2FkIHRoYXQuIE90aGVyd2lzZSwgcnVuIHRoZSBicHUuXG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5icHUucnVuRXhwZXJpbWVudChsaWdodERhdGEsIGRhdGEuaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudF9zdWJtaXNzaW9uX2Vycm9yXCIsXG4gICAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBgRXhwZXJpbWVudCBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgICB9KVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgICAgIGVycm9yOiBgRXhwZXJpbWVudCBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgIH0pLmNhdGNoKChyZWFzb24pID0+IHsgY29uc29sZS5sb2coJ0hhbmRsZSByZWplY3RlZCBFeHBlcmltZW50IHByb21pc2UoJyArIHJlYXNvbiArICcpIGhlcmUuJyl9KTtcbiAgICB9XG5cbiAgICBfc2VhcmNoQW5kTG9hZERhdGEobGlnaHREYXRhLCBleHBJZCwgbG9hZERhdGEsIHJlc29sdmUpIHtcblxuICAvLyAgICBpZiAobG9hZERhdGEgPT09ICdleHBlcmltZW50Jykge1xuXG4gICAgICAgIC8vIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzJywge1xuICAgICAgICAvLyAgIGRhdGE6IHtcbiAgICAgICAgLy8gICAgIGZpbHRlcjoge1xuICAgICAgICAvLyAgICAgICB3aGVyZTp7XG4gICAgICAgIC8vICAgICAgICAgY29weU9mSUQ6IDBcbiAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgIH0sXG4gICAgICAgIC8vICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAvLyB9KVxuXG4gICAgICAgIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzL2V4cHNXaXRoUmVzdWx0cycsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb3B5T2ZJRDogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBleHBlcmltZW50cyBmb3VuZCwgcmV0dXJuIHRoZSBtb3N0IHJlY2VudCBvbmVcbiAgICAgICAgICB2YXIgZmlsdGVyZWREYXRhID0gZGF0YTtcbiAgICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHg8NDsgaWR4KyspIHtcbiAgICAgICAgICBcdGlmIChmaWx0ZXJlZERhdGEubGVuZ3RoID4wKSB7XG4gICAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YS5maWx0ZXIoZXhwID0+IHtcbiAgICAgICAgICAgIFx0XHR2YXIgZXhwQ29uZmlnID0gZXhwLmNvbmZpZ3VyYXRpb247XG4gICAgICAgICAgICBcdFx0dmFyIGlzTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgXHRcdGZvciAobGV0IGVsZW0gb2YgT2JqZWN0LmtleXMobGlnaHREYXRhW2lkeF0pKSB7XG4gICAgICAgICAgICBcdFx0XHRpZiAoZXhwQ29uZmlnW2lkeF1bZWxlbV0gIT0gbGlnaHREYXRhW2lkeF1bZWxlbV0pIHtcbiAgICAgICAgICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXHRcdH1cbiAgICAgICAgICAgIFx0XHRpZiAoaXNNYXRjaCkge3JldHVybiB0cnVlfTtcbiAgICAgICAgICAgIFx0fSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY29weU9mSUQgPSAwO1xuICAgICAgICAgIGlmIChmaWx0ZXJlZERhdGEubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZShiLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb3B5T2ZJRCA9IGZpbHRlcmVkRGF0YVswXS5pZFxuICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyZWREYXRhLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBjb3B5T2ZJRCA9IGZpbHRlcmVkRGF0YVswXS5pZFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb3B5T2ZJRD4wKSB7XG4gICAgICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7IGV4cGVyaW1lbnRJZDogY29weU9mSUQgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicHVfYXBpX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5lcTogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICB2YXIgZXhwSWRBbmRSZXN1bHRzID0ge2NvcHlPZklEOiBjb3B5T2ZJRCwgcmVzdWx0czogcmVzdWx0c307XG4gICAgICAgICAgICAgIHJlc29sdmUoZXhwSWRBbmRSZXN1bHRzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZSh7Y29weU9mSUQ6IDAsIHJlc3VsdHM6IG51bGx9KVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vcmVzb2x2ZShjb3B5T2ZJRCk7XG5cbiAgICAgICAgfSlcbiAgICAgIC8vIH0gZWxzZSBpZiAobG9hZERhdGEgPT09ICdyZXN1bHRzJykge1xuICAgICAgLy8gICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgLy8gICAgIGRhdGE6IHtcbiAgICAgIC8vICAgICAgIGZpbHRlcjoge1xuICAgICAgLy8gICAgICAgICB3aGVyZToge1xuICAgICAgLy8gICAgICAgICAgIGFuZDogW1xuICAgICAgLy8gICAgICAgICAgICAgeyBleHBlcmltZW50SWQ6IGV4cElkIH0sXG4gICAgICAvLyAgICAgICAgICAgICB7XG4gICAgICAvLyAgICAgICAgICAgICAgIGJwdV9hcGlfaWQ6IHtcbiAgICAgIC8vICAgICAgICAgICAgICAgICBuZXE6IG51bGxcbiAgICAgIC8vICAgICAgICAgICAgICAgfVxuICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgLy8gICAgICAgICAgIF1cbiAgICAgIC8vICAgICAgICAgfVxuICAgICAgLy8gICAgICAgfVxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgLy8gICB9KS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAvLyAgICAgcmVzb2x2ZShyZXN1bHRzKVxuICAgICAgLy8gICB9KVxuICAgICAgLy8gfVxuXG5cbiAgICB9XG5cbiAgfVxufSlcbiJdfQ==
