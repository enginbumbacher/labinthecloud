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
              copyOfID: expIdAndResults.copyOfID > 0 && expIdAndResults.results.length ? expIdAndResults.copyOfID : 0 // update the copyOfID if it is found.
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiVXRpbHMiLCJHbG9iYWxzIiwiQlBVQ29ubmVjdG9yIiwiRGVtb0Nvbm5lY3RvciIsIkV1Z1V0aWxzIiwiYmluZE1ldGhvZHMiLCJnZXQiLCJzZXQiLCJicHUiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uU3VibWlzc2lvbkVycm9yIiwiX29uUXVldWVFcnJvciIsIl9vbkV4cGVyaW1lbnRVcGRhdGUiLCJfb25FeHBlcmltZW50UmVhZHkiLCJfZXhwZXJpbWVudHMiLCJfb25FeHBlcmltZW50UmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXZ0IiwiZGF0YSIsImVycm9yIiwiZGVtbyIsImluaXQiLCJkaXNwYXRjaEV2ZW50IiwiaWQiLCJ0eXBlIiwibWVzc2FnZSIsIm9yaWdpbmFsIiwicmVwb3J0IiwiZXhwZXJpbWVudCIsImV4cGVyaW1lbnRfaWQiLCJleHBfbWV0YURhdGEiLCJFeHBOYW1lIiwicmVtYWluaW5nX2VzdGltYXRlIiwic3RhdHVzIiwiZ2VuZXJhdGVSZXN1bHRzIiwiYnB1X2FwaV9pZCIsImV4cGVyaW1lbnRJZCIsInRhZyIsInRoZW4iLCJjYXRjaCIsImVyciIsImxpZ2h0RGF0YSIsInRpbWVBY2N1bXVsYXRlZCIsImxpZ2h0cyIsImZvckVhY2giLCJsZCIsInB1c2giLCJ0b3BWYWx1ZSIsInRvcCIsInJpZ2h0VmFsdWUiLCJyaWdodCIsImJvdHRvbVZhbHVlIiwiYm90dG9tIiwibGVmdFZhbHVlIiwibGVmdCIsInRpbWUiLCJkdXJhdGlvbiIsIl9zZWFyY2hBbmRMb2FkRGF0YSIsImV4cElkQW5kUmVzdWx0cyIsInByb21pc2VBamF4IiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0dWRlbnRJZCIsImNvbmZpZ3VyYXRpb24iLCJleHBGb3JtIiwibGFiIiwiY29weU9mSUQiLCJyZXN1bHRzIiwibGVuZ3RoIiwiY29udGVudFR5cGUiLCJydW5FeHBlcmltZW50IiwicmVhc29uIiwiY29uc29sZSIsImxvZyIsImV4cElkIiwibG9hZERhdGEiLCJmaWx0ZXJlZERhdGEiLCJpZHgiLCJmaWx0ZXIiLCJleHBDb25maWciLCJleHAiLCJpc01hdGNoIiwiT2JqZWN0Iiwia2V5cyIsImVsZW0iLCJzb3J0IiwiYSIsImIiLCJEYXRlIiwiZGF0ZV9jcmVhdGVkIiwiZ2V0VGltZSIsIndoZXJlIiwiYW5kIiwibmVxIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFNBQVNELFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFVBQVVILFFBQVEsb0JBQVIsQ0FGWjtBQUFBLE1BR0VJLGVBQWVKLFFBQVEsaUJBQVIsQ0FIakI7QUFBQSxNQUlFSyxnQkFBZ0JMLFFBQVEsa0JBQVIsQ0FKbEI7QUFBQSxNQUtFTSxXQUFXTixRQUFRLGVBQVIsQ0FMYjs7QUFRQTtBQUFBOztBQUNFLG1DQUFjO0FBQUE7O0FBQUE7O0FBR1pFLFlBQU1LLFdBQU4sUUFBd0IsQ0FDdEIsc0JBRHNCLEVBRXBCLHFCQUZvQixFQUdwQixvQkFIb0IsRUFJcEIsZUFKb0IsRUFLcEIsb0JBTG9CLEVBTXBCLG9CQU5vQixDQUF4Qjs7QUFTQSxVQUFJSixRQUFRSyxHQUFSLENBQVksd0NBQVosQ0FBSixFQUEyRDtBQUN6REwsZ0JBQVFNLEdBQVIsQ0FBWSxtQkFBWixFQUFnQ04sUUFBUUssR0FBUixDQUFZLHdDQUFaLENBQWhDO0FBQ0QsT0FGRCxNQUVPO0FBQ0xMLGdCQUFRTSxHQUFSLENBQVksbUJBQVosRUFBaUMsS0FBakM7QUFDRDtBQUNELFlBQUtDLEdBQUwsR0FBVyxJQUFJTixZQUFKLEVBQVg7QUFDQSxZQUFLTSxHQUFMLENBQVNDLGdCQUFULENBQTBCLGdDQUEx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LENBQWIsRUFBZ0J0RCxFQUEzQjtBQUNEOztBQUVELGNBQUk0QyxXQUFTLENBQWIsRUFBZ0I7QUFDZHJFLGtCQUFNNkQsV0FBTixvQkFBcUM7QUFDbkN6QyxvQkFBTTtBQUNKNkQsd0JBQVE7QUFDTmEseUJBQU87QUFDTEMseUJBQUssQ0FDSCxFQUFFekQsY0FBYytCLFFBQWhCLEVBREcsRUFFSDtBQUNFaEMsa0NBQVk7QUFDVjJELDZCQUFLO0FBREs7QUFEZCxxQkFGRztBQURBO0FBREQ7QUFESixlQUQ2QjtBQWVuQ3hCLDJCQUFhO0FBZnNCLGFBQXJDLEVBZ0JHaEMsSUFoQkgsQ0FnQlEsVUFBQzhCLE9BQUQsRUFBYTtBQUNuQixrQkFBSVYsa0JBQWtCLEVBQUNTLFVBQVVBLFFBQVgsRUFBcUJDLFNBQVNBLE9BQTlCLEVBQXRCO0FBQ0FyRCxzQkFBUTJDLGVBQVI7QUFDRCxhQW5CRDtBQW9CRCxXQXJCRCxNQXFCTztBQUNMM0Msb0JBQVEsRUFBQ29ELFVBQVUsQ0FBWCxFQUFjQyxTQUFTLElBQXZCLEVBQVI7QUFDRDs7QUFFRDtBQUVELFNBM0REO0FBNERGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHRDtBQTNSSDs7QUFBQTtBQUFBLElBQXlDdkUsTUFBekM7QUE4UkQsQ0F2U0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9zZXJ2ZXJpbnRlcmZhY2UvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEJQVUNvbm5lY3RvciA9IHJlcXVpcmUoJy4vYnB1X2Nvbm5lY3RvcicpLFxuICAgIERlbW9Db25uZWN0b3IgPSByZXF1aXJlKCcuL2RlbW9fY29ubmVjdG9yJyksXG4gICAgRXVnVXRpbHMgPSByZXF1aXJlKCdldWdsZW5hL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBFdWdsZW5hU2VydmVyTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFtcbiAgICAgICAgJ19vbkV4cGVyaW1lbnRSZXF1ZXN0J1xuICAgICAgICAsICdfb25FeHBlcmltZW50VXBkYXRlJ1xuICAgICAgICAsICdfb25TdWJtaXNzaW9uRXJyb3InXG4gICAgICAgICwgJ19vblF1ZXVlRXJyb3InXG4gICAgICAgICwgJ19vbkV4cGVyaW1lbnRSZWFkeSdcbiAgICAgICAgLCAnX3NlYXJjaEFuZExvYWREYXRhJ1xuICAgICAgXSk7XG5cbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZXVnbGVuYVNlcnZlck1vZGUnKSkge1xuICAgICAgICBHbG9iYWxzLnNldCgnZXVnbGVuYVNlcnZlck1vZGUnLEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5ldWdsZW5hU2VydmVyTW9kZScpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR2xvYmFscy5zZXQoJ2V1Z2xlbmFTZXJ2ZXJNb2RlJywgJ2JwdScpO1xuICAgICAgfVxuICAgICAgdGhpcy5icHUgPSBuZXcgQlBVQ29ubmVjdG9yKCk7XG4gICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkVycm9yLlN1Ym1pc3Npb24nLCB0aGlzLl9vblN1Ym1pc3Npb25FcnJvcik7XG4gICAgICB0aGlzLmJwdS5hZGRFdmVudExpc3RlbmVyKCdCUFVDb250cm9sbGVyLkVycm9yLlF1ZXVlJywgdGhpcy5fb25RdWV1ZUVycm9yKTtcbiAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXhwZXJpbWVudC5VcGRhdGUnLCB0aGlzLl9vbkV4cGVyaW1lbnRVcGRhdGUpO1xuICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FeHBlcmltZW50LlJlYWR5JywgdGhpcy5fb25FeHBlcmltZW50UmVhZHkpO1xuXG4gICAgICB0aGlzLl9leHBlcmltZW50cyA9IFtdO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50U2VydmVyLkV4cGVyaW1lbnRSZXF1ZXN0JywgdGhpcy5fb25FeHBlcmltZW50UmVxdWVzdCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuUmVhZHknLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5icHUuYWRkRXZlbnRMaXN0ZW5lcignQlBVQ29udHJvbGxlci5FcnJvci5Db25uZWN0aW9uJywgKGV2dCkgPT4ge1xuICAgICAgICAgIHJlamVjdChldnQuZGF0YS5lcnJvcik7XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuYnB1LmFkZEV2ZW50TGlzdGVuZXIoJ0JQVUNvbnRyb2xsZXIuRXJyb3IuQ29ubmVjdGlvblJlZnVzZWQnLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgdGhpcy5kZW1vID0gbmV3IERlbW9Db25uZWN0b3IoKTtcbiAgICAgICAgICB0aGlzLmRlbW8uYWRkRXZlbnRMaXN0ZW5lcignRGVtb0NvbnRyb2xsZXIuRXhwZXJpbWVudC5VcGRhdGUnLCB0aGlzLl9vbkV4cGVyaW1lbnRVcGRhdGUpO1xuICAgICAgICAgIHRoaXMuZGVtby5hZGRFdmVudExpc3RlbmVyKCdEZW1vQ29udHJvbGxlci5FeHBlcmltZW50LlJlYWR5JywgdGhpcy5fb25FeHBlcmltZW50UmVhZHkpO1xuICAgICAgICAgIHRoaXMuZGVtby5pbml0KCk7XG4gICAgICAgICAgR2xvYmFscy5zZXQoJ2V1Z2xlbmFTZXJ2ZXJNb2RlJywgJ2RlbW8nKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgICAgIGlkOiBcImRlbW9fbW9kZVwiLFxuICAgICAgICAgICAgdHlwZTogXCJub3RpY2VcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiRGVtbyBNb2RlXCJcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuYnB1LmluaXQoKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uU3VibWlzc2lvbkVycm9yKGV2dCkge1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgIGlkOiBcInN1Ym1pc3Npb25fcmVqZWN0ZWRcIixcbiAgICAgICAgdHlwZTogXCJlcnJvclwiLFxuICAgICAgICBtZXNzYWdlOiBgU3VibWlzc2lvbiByZWplY3RlZDogJHtldnQuZGF0YS5lcnJvcn1gXG4gICAgICB9KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5GYWlsdXJlJywge1xuICAgICAgICBlcnJvcjogYFN1Ym1pc3Npb24gcmVqZWN0ZWQ6ICR7ZXZ0LmRhdGEuZXJyb3J9YFxuICAgICAgfSk7XG4gICAgfVxuICAgIF9vblF1ZXVlRXJyb3IoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdOb3RpZmljYXRpb25zLkFkZCcsIHtcbiAgICAgICAgaWQ6IFwic3VibWlzc2lvbl9yZWplY3RlZFwiLFxuICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgIG1lc3NhZ2U6IGBRdWV1ZSByZXF1ZXN0IHJlamVjdGVkOiAke2V2dC5kYXRhLmVycm9yfWBcbiAgICAgIH0pO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5GYWlsdXJlJywge1xuICAgICAgICBlcnJvcjogYFF1ZXVlIHJlcXVlc3QgcmVqZWN0ZWQ6ICR7ZXZ0LmRhdGEuZXJyb3J9YFxuICAgICAgfSk7XG4gICAgfVxuICAgIF9vbkV4cGVyaW1lbnRVcGRhdGUoZXZ0KSB7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdFeHBlcmltZW50U2VydmVyLlVwZGF0ZScsIGV2dC5kYXRhKTtcbiAgICB9XG4gICAgX29uRXhwZXJpbWVudFJlYWR5KGV2dCkge1xuICAgICAgY29uc3Qgb3JpZ2luYWwgPSBldnQuZGF0YS5kYXRhO1xuICAgICAgY29uc3QgcmVwb3J0ID0gb3JpZ2luYWwuZXhwZXJpbWVudDtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuVXBkYXRlJywge1xuICAgICAgICBleHBlcmltZW50X2lkOiByZXBvcnQuZXhwX21ldGFEYXRhLkV4cE5hbWUsXG4gICAgICAgIHJlbWFpbmluZ19lc3RpbWF0ZTogMCxcbiAgICAgICAgc3RhdHVzOiBcImRvd25sb2FkaW5nXCJcbiAgICAgIH0pO1xuICAgICAgRXVnVXRpbHMuZ2VuZXJhdGVSZXN1bHRzKHtcbiAgICAgICAgYnB1X2FwaV9pZDogcmVwb3J0LmV4cF9tZXRhRGF0YS5FeHBOYW1lLFxuICAgICAgICBleHBlcmltZW50SWQ6IHJlcG9ydC5leHBfbWV0YURhdGEudGFnXG4gICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuUmVzdWx0cycsIGRhdGEpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgaWQ6IFwicmVzdWx0X3N1Ym1pc3Npb25fZXJyb3JcIixcbiAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZTogYFJlc3VsdHMgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgIH0pXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgICBlcnJvcjogYFJlc3VsdHMgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50UmVxdWVzdChldnQpIHtcbiAgICAgIGNvbnN0IGxpZ2h0RGF0YSA9IFtdO1xuICAgICAgbGV0IHRpbWVBY2N1bXVsYXRlZCA9IDBcbiAgICAgIGV2dC5kYXRhLmxpZ2h0cy5mb3JFYWNoKChsZCkgPT4ge1xuICAgICAgICBsaWdodERhdGEucHVzaCh7XG4gICAgICAgICAgdG9wVmFsdWU6IGxkLnRvcCxcbiAgICAgICAgICByaWdodFZhbHVlOiBsZC5yaWdodCxcbiAgICAgICAgICBib3R0b21WYWx1ZTogbGQuYm90dG9tLFxuICAgICAgICAgIGxlZnRWYWx1ZTogbGQubGVmdCxcbiAgICAgICAgICB0aW1lOiB0aW1lQWNjdW11bGF0ZWRcbiAgICAgICAgfSk7XG4gICAgICAgIHRpbWVBY2N1bXVsYXRlZCArPSBsZC5kdXJhdGlvbiAqIDEwMDBcbiAgICAgIH0pXG5cbiAgICAgIC8vIEZpcnN0LCBjaGVjayB3aGV0aGVyIHRoaXMgZXhwZXJpbWVudCBoYXMgYWxyZWFkeSBiZWVuIHJ1bi5cbiAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xuICAgICAgICB0aGlzLl9zZWFyY2hBbmRMb2FkRGF0YShldnQuZGF0YS5saWdodHMsIG51bGwsICdleHBlcmltZW50JywgcmVzb2x2ZSk7XG4gICAgICB9KS50aGVuKChleHBJZEFuZFJlc3VsdHMpID0+IHtcbiAgICAgICAgLy8gTG9vayB3aGljaCBwcmV2aW91cyBleHBlcmltZW50IGhhcyB0aGUgc2FtZSBsaWdodCBjb25maWd1cmF0aW9uLiAtLT4gU3RvcmUgaXRzIGlkIGluIGNvcHlPZklELlxuICAgICAgICBVdGlscy5wcm9taXNlQWpheChcIi9hcGkvdjEvRXhwZXJpbWVudHNcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgc3R1ZGVudElkOiBHbG9iYWxzLmdldCgnc3R1ZGVudF9pZCcpLFxuICAgICAgICAgICAgY29uZmlndXJhdGlvbjogZXZ0LmRhdGEubGlnaHRzLFxuICAgICAgICAgICAgZXhwRm9ybTogZXZ0LmRhdGEuZXhwRm9ybSA/IGV2dC5kYXRhLmV4cEZvcm0gOiBudWxsLFxuICAgICAgICAgICAgbGFiOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmxhYicpLFxuICAgICAgICAgICAgY29weU9mSUQ6IChleHBJZEFuZFJlc3VsdHMuY29weU9mSUQgPiAwICYmIGV4cElkQW5kUmVzdWx0cy5yZXN1bHRzLmxlbmd0aCkgPyBleHBJZEFuZFJlc3VsdHMuY29weU9mSUQgOiAwIC8vIHVwZGF0ZSB0aGUgY29weU9mSUQgaWYgaXQgaXMgZm91bmQuXG4gICAgICAgICAgfSksXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5FeHBlcmltZW50U2F2ZWQnLCB7XG4gICAgICAgICAgICBleHBlcmltZW50OiBkYXRhXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ2V1Z2xlbmFTZXJ2ZXJNb2RlJykgPT0gJ2RlbW8nKSB7XG4gICAgICAgICAgICB0aGlzLmRlbW8ucnVuRXhwZXJpbWVudChsaWdodERhdGEsIGRhdGEuaWQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ2V1Z2xlbmFTZXJ2ZXJNb2RlJykgPT0gJ3NpbXVsYXRlJykge1xuICAgICAgICAgICAgaWYgKGRhdGEuY29weU9mSUQ+MCkge1xuICAgICAgICAgICAgICAgIC8vIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgIHRoaXMuX3NlYXJjaEFuZExvYWREYXRhKGxpZ2h0RGF0YSwgZGF0YS5jb3B5T2ZJRCwgJ3Jlc3VsdHMnLCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgICAvLyB9KS50aGVuKChyZXN1bHRzRGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vICAgICBpZiAoIXJlc3VsdHNEYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgdGhpcy5icHUucnVuRXhwZXJpbWVudChsaWdodERhdGEsIGRhdGEuaWQpO1xuICAgICAgICAgICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV4cElkQW5kUmVzdWx0cy5yZXN1bHRzWzBdLmV4cGVyaW1lbnRJZCA9IGRhdGEuaWQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGV4cElkQW5kUmVzdWx0cy5yZXN1bHRzWzBdLmlkO1xuICAgICAgICAgICAgICAgIEV1Z1V0aWxzLmdlbmVyYXRlUmVzdWx0cyggZXhwSWRBbmRSZXN1bHRzLnJlc3VsdHNbMF0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuUmVzdWx0cycsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnTm90aWZpY2F0aW9ucy5BZGQnLCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBcInJlc3VsdF9zdWJtaXNzaW9uX2Vycm9yXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFJlc3VsdHMgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5GYWlsdXJlJywge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogYFJlc3VsdHMgc2F2aW5nIGVycm9yOiAke2Vycn1gXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC8vR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnRXhwZXJpbWVudFNlcnZlci5SZXN1bHRzJywgZXhwSWRBbmRSZXN1bHRzLnJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgLy8gfSkuY2F0Y2goKHJlYXNvbikgPT4geyBjb25zb2xlLmxvZygnSGFuZGxlIHJlamVjdGVkIFJlc3VsdHMgcHJvbWlzZSgnICsgcmVhc29uICsgJykgaGVyZS4nKX0pOztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuYnB1LnJ1bkV4cGVyaW1lbnQobGlnaHREYXRhLCBkYXRhLmlkKTtcbiAgICAgICAgICAgIH0gLy8gQ2hlY2sgZmlyc3Qgd2hldGhlciB0aGVyZSBpcyBhbm90aGVyIGV4cGVyaW1lbnQgd2l0aCB0aGUgc2FtZSBjb25maWcuIElmIHNvLCBsb2FkIHRoYXQuIE90aGVyd2lzZSwgcnVuIHRoZSBicHUuXG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5icHUucnVuRXhwZXJpbWVudChsaWdodERhdGEsIGRhdGEuaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ05vdGlmaWNhdGlvbnMuQWRkJywge1xuICAgICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudF9zdWJtaXNzaW9uX2Vycm9yXCIsXG4gICAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBgRXhwZXJpbWVudCBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgICB9KVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0V4cGVyaW1lbnRTZXJ2ZXIuRmFpbHVyZScsIHtcbiAgICAgICAgICAgIGVycm9yOiBgRXhwZXJpbWVudCBzYXZpbmcgZXJyb3I6ICR7ZXJyfWBcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgIH0pLmNhdGNoKChyZWFzb24pID0+IHsgY29uc29sZS5sb2coJ0hhbmRsZSByZWplY3RlZCBFeHBlcmltZW50IHByb21pc2UoJyArIHJlYXNvbiArICcpIGhlcmUuJyl9KTtcbiAgICB9XG5cbiAgICBfc2VhcmNoQW5kTG9hZERhdGEobGlnaHREYXRhLCBleHBJZCwgbG9hZERhdGEsIHJlc29sdmUpIHtcblxuICAvLyAgICBpZiAobG9hZERhdGEgPT09ICdleHBlcmltZW50Jykge1xuXG4gICAgICAgIC8vIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzJywge1xuICAgICAgICAvLyAgIGRhdGE6IHtcbiAgICAgICAgLy8gICAgIGZpbHRlcjoge1xuICAgICAgICAvLyAgICAgICB3aGVyZTp7XG4gICAgICAgIC8vICAgICAgICAgY29weU9mSUQ6IDBcbiAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgIH0sXG4gICAgICAgIC8vICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAvLyB9KVxuXG4gICAgICAgIFV0aWxzLnByb21pc2VBamF4KCcvYXBpL3YxL0V4cGVyaW1lbnRzL2V4cHNXaXRoUmVzdWx0cycsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb3B5T2ZJRDogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBleHBlcmltZW50cyBmb3VuZCwgcmV0dXJuIHRoZSBtb3N0IHJlY2VudCBvbmVcbiAgICAgICAgICB2YXIgZmlsdGVyZWREYXRhID0gZGF0YTtcbiAgICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHg8NDsgaWR4KyspIHtcbiAgICAgICAgICBcdGlmIChmaWx0ZXJlZERhdGEubGVuZ3RoID4wKSB7XG4gICAgICAgICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YS5maWx0ZXIoZXhwID0+IHtcbiAgICAgICAgICAgIFx0XHR2YXIgZXhwQ29uZmlnID0gZXhwLmNvbmZpZ3VyYXRpb247XG4gICAgICAgICAgICBcdFx0dmFyIGlzTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgXHRcdGZvciAobGV0IGVsZW0gb2YgT2JqZWN0LmtleXMobGlnaHREYXRhW2lkeF0pKSB7XG4gICAgICAgICAgICBcdFx0XHRpZiAoZXhwQ29uZmlnW2lkeF1bZWxlbV0gIT0gbGlnaHREYXRhW2lkeF1bZWxlbV0pIHtcbiAgICAgICAgICAgIFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXHRcdH1cbiAgICAgICAgICAgIFx0XHRpZiAoaXNNYXRjaCkge3JldHVybiB0cnVlfTtcbiAgICAgICAgICAgIFx0fSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY29weU9mSUQgPSAwO1xuICAgICAgICAgIGlmIChmaWx0ZXJlZERhdGEubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZShiLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLmRhdGVfY3JlYXRlZCkpLmdldFRpbWUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb3B5T2ZJRCA9IGZpbHRlcmVkRGF0YVswXS5pZFxuICAgICAgICAgIH0gZWxzZSBpZiAoZmlsdGVyZWREYXRhLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBjb3B5T2ZJRCA9IGZpbHRlcmVkRGF0YVswXS5pZFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb3B5T2ZJRD4wKSB7XG4gICAgICAgICAgICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgICB3aGVyZToge1xuICAgICAgICAgICAgICAgICAgICBhbmQ6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7IGV4cGVyaW1lbnRJZDogY29weU9mSUQgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicHVfYXBpX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5lcTogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSkudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICB2YXIgZXhwSWRBbmRSZXN1bHRzID0ge2NvcHlPZklEOiBjb3B5T2ZJRCwgcmVzdWx0czogcmVzdWx0c307XG4gICAgICAgICAgICAgIHJlc29sdmUoZXhwSWRBbmRSZXN1bHRzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZSh7Y29weU9mSUQ6IDAsIHJlc3VsdHM6IG51bGx9KVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vcmVzb2x2ZShjb3B5T2ZJRCk7XG5cbiAgICAgICAgfSlcbiAgICAgIC8vIH0gZWxzZSBpZiAobG9hZERhdGEgPT09ICdyZXN1bHRzJykge1xuICAgICAgLy8gICBVdGlscy5wcm9taXNlQWpheChgL2FwaS92MS9SZXN1bHRzYCwge1xuICAgICAgLy8gICAgIGRhdGE6IHtcbiAgICAgIC8vICAgICAgIGZpbHRlcjoge1xuICAgICAgLy8gICAgICAgICB3aGVyZToge1xuICAgICAgLy8gICAgICAgICAgIGFuZDogW1xuICAgICAgLy8gICAgICAgICAgICAgeyBleHBlcmltZW50SWQ6IGV4cElkIH0sXG4gICAgICAvLyAgICAgICAgICAgICB7XG4gICAgICAvLyAgICAgICAgICAgICAgIGJwdV9hcGlfaWQ6IHtcbiAgICAgIC8vICAgICAgICAgICAgICAgICBuZXE6IG51bGxcbiAgICAgIC8vICAgICAgICAgICAgICAgfVxuICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgLy8gICAgICAgICAgIF1cbiAgICAgIC8vICAgICAgICAgfVxuICAgICAgLy8gICAgICAgfVxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgLy8gICB9KS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAvLyAgICAgcmVzb2x2ZShyZXN1bHRzKVxuICAgICAgLy8gICB9KVxuICAgICAgLy8gfVxuXG5cbiAgICB9XG5cbiAgfVxufSlcbiJdfQ==
