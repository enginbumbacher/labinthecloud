'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Model = require('core/model/model'),
      defaults = {
    datasets: {},
    open: false
  },
      Palette = require('core/util/palette'),
      ResultGroup = require('./result_group');

  return function (_Model) {
    _inherits(AggregateDataModel, _Model);

    function AggregateDataModel(config) {
      _classCallCheck(this, AggregateDataModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      return _possibleConstructorReturn(this, (AggregateDataModel.__proto__ || Object.getPrototypeOf(AggregateDataModel)).call(this, config));
    }

    _createClass(AggregateDataModel, [{
      key: 'addDataSet',
      value: function addDataSet(dataset) {
        var ds = this.get('datasets');
        if (!ds[dataset.experimentId]) {
          ds[dataset.experimentId] = new ResultGroup({
            data: {
              experimentId: dataset.experimentId,
              experiment: Globals.get('currentExperiment')
            }
          });
        }
        if (!ds[dataset.experimentId].contains(dataset.id)) {
          var dsModel = new Model({ data: dataset });
          var setcolors = Object.values(ds).reduce(function (acc, curr) {
            return acc.concat(curr.get('results').map(function (a) {
              return a.get('color');
            }));
          }, []);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Palette[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var c = _step.value;

              if (!setcolors.includes(c)) {
                dsModel.set('color', c);
                break;
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

          if (!dsModel.get('color')) dsModel.set('color', '#000000');
          dsModel.set('shown', true);
          ds[dataset.experimentId].addResult(dsModel);
          this.set('datasets', ds);

          this.dispatchEvent('AggregateData.DataSetAdded', {
            dataset: dsModel,
            resultGroup: ds[dataset.experimentId]
          });
        }
      }
    }, {
      key: 'clearResult',
      value: function clearResult(resId) {
        var dataset = this.getResultById(resId);
        var ds = this.get('datasets');
        var expId = dataset.get('experimentId');
        if (ds[expId] && ds[expId].contains(resId)) {
          ds[expId].removeResult(resId);
          if (ds[expId].length() == 0) {
            this.clearResultGroup(expId);
          }
        }
        this.set('datasets', ds);
        this.dispatchEvent('AggregateData.DataSetRemoved', {
          dataset: dataset
        });
      }
    }, {
      key: 'clearResultGroup',
      value: function clearResultGroup(expId) {
        var ds = this.get('datasets');
        var group = ds[expId];
        delete ds[expId];
        this.dispatchEvent('AggregateData.ResultGroupRemoved', {
          group: group
        });
      }
    }, {
      key: 'getResultById',
      value: function getResultById(resId) {
        var dss = Object.values(this.get('datasets'));
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = dss[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var ds = _step2.value;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = ds.get('results')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var res = _step3.value;

                if (res.get('id') == resId) return res;
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return null;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.set('open', !this.get('open'));
      }
    }, {
      key: 'toggleResult',
      value: function toggleResult(resultId) {
        var res = this.getResultById(resultId);
        if (res) {
          res.set('shown', !res.get('shown'));
          this.dispatchEvent('AggregateData.ResultToggle', {
            resultId: res.get('id'),
            shown: res.get('shown')
          });
        }
      }
    }, {
      key: 'getDisplayState',
      value: function getDisplayState() {
        var state = {};
        Object.values(this.get('datasets')).forEach(function (ds) {
          state[ds.get('experimentId')] = {};
          ds.get('results').forEach(function (res) {
            state[ds.get('experimentId')][res.get('id')] = res.get('shown');
          });
        });
        return state;
      }
    }]);

    return AggregateDataModel;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kZWwiLCJkZWZhdWx0cyIsImRhdGFzZXRzIiwib3BlbiIsIlBhbGV0dGUiLCJSZXN1bHRHcm91cCIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwiZGF0YXNldCIsImRzIiwiZ2V0IiwiZXhwZXJpbWVudElkIiwiZGF0YSIsImV4cGVyaW1lbnQiLCJjb250YWlucyIsImlkIiwiZHNNb2RlbCIsInNldGNvbG9ycyIsIk9iamVjdCIsInZhbHVlcyIsInJlZHVjZSIsImFjYyIsImN1cnIiLCJjb25jYXQiLCJtYXAiLCJhIiwiYyIsImluY2x1ZGVzIiwic2V0IiwiYWRkUmVzdWx0IiwiZGlzcGF0Y2hFdmVudCIsInJlc3VsdEdyb3VwIiwicmVzSWQiLCJnZXRSZXN1bHRCeUlkIiwiZXhwSWQiLCJyZW1vdmVSZXN1bHQiLCJsZW5ndGgiLCJjbGVhclJlc3VsdEdyb3VwIiwiZ3JvdXAiLCJkc3MiLCJyZXMiLCJyZXN1bHRJZCIsInNob3duIiwic3RhdGUiLCJmb3JFYWNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxRQUFRSixRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLGNBQVUsRUFERDtBQUVUQyxVQUFNO0FBRkcsR0FEYjtBQUFBLE1BS0VDLFVBQVVSLFFBQVEsbUJBQVIsQ0FMWjtBQUFBLE1BTUVTLGNBQWNULFFBQVEsZ0JBQVIsQ0FOaEI7O0FBUUE7QUFBQTs7QUFDRSxnQ0FBWVUsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT0wsUUFBUCxHQUFrQkosTUFBTVUsY0FBTixDQUFxQkQsT0FBT0wsUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCO0FBRGtCLHFJQUVaSyxNQUZZO0FBR25COztBQUpIO0FBQUE7QUFBQSxpQ0FNYUUsT0FOYixFQU1zQjtBQUNsQixZQUFNQyxLQUFLLEtBQUtDLEdBQUwsQ0FBUyxVQUFULENBQVg7QUFDQSxZQUFJLENBQUNELEdBQUdELFFBQVFHLFlBQVgsQ0FBTCxFQUErQjtBQUM3QkYsYUFBR0QsUUFBUUcsWUFBWCxJQUEyQixJQUFJTixXQUFKLENBQWdCO0FBQ3pDTyxrQkFBTTtBQUNKRCw0QkFBY0gsUUFBUUcsWUFEbEI7QUFFSkUsMEJBQVlmLFFBQVFZLEdBQVIsQ0FBWSxtQkFBWjtBQUZSO0FBRG1DLFdBQWhCLENBQTNCO0FBTUQ7QUFDRCxZQUFJLENBQUVELEdBQUdELFFBQVFHLFlBQVgsRUFBeUJHLFFBQXpCLENBQWtDTixRQUFRTyxFQUExQyxDQUFOLEVBQXNEO0FBQ3BELGNBQU1DLFVBQVUsSUFBSWhCLEtBQUosQ0FBVSxFQUFFWSxNQUFNSixPQUFSLEVBQVYsQ0FBaEI7QUFDQSxjQUFNUyxZQUFZQyxPQUFPQyxNQUFQLENBQWNWLEVBQWQsRUFBa0JXLE1BQWxCLENBQXlCLFVBQUNDLEdBQUQsRUFBTUMsSUFBTixFQUFlO0FBQUUsbUJBQU9ELElBQUlFLE1BQUosQ0FBV0QsS0FBS1osR0FBTCxDQUFTLFNBQVQsRUFBb0JjLEdBQXBCLENBQXdCLFVBQUNDLENBQUQ7QUFBQSxxQkFBT0EsRUFBRWYsR0FBRixDQUFNLE9BQU4sQ0FBUDtBQUFBLGFBQXhCLENBQVgsQ0FBUDtBQUFtRSxXQUE3RyxFQUErRyxFQUEvRyxDQUFsQjtBQUZvRDtBQUFBO0FBQUE7O0FBQUE7QUFHcEQsaUNBQWNOLE9BQWQsOEhBQXVCO0FBQUEsa0JBQWRzQixDQUFjOztBQUNyQixrQkFBSSxDQUFDVCxVQUFVVSxRQUFWLENBQW1CRCxDQUFuQixDQUFMLEVBQTRCO0FBQzFCVix3QkFBUVksR0FBUixDQUFZLE9BQVosRUFBcUJGLENBQXJCO0FBQ0E7QUFDRDtBQUNGO0FBUm1EO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBU3BELGNBQUksQ0FBQ1YsUUFBUU4sR0FBUixDQUFZLE9BQVosQ0FBTCxFQUEyQk0sUUFBUVksR0FBUixDQUFZLE9BQVosRUFBcUIsU0FBckI7QUFDM0JaLGtCQUFRWSxHQUFSLENBQVksT0FBWixFQUFxQixJQUFyQjtBQUNBbkIsYUFBR0QsUUFBUUcsWUFBWCxFQUF5QmtCLFNBQXpCLENBQW1DYixPQUFuQztBQUNBLGVBQUtZLEdBQUwsQ0FBUyxVQUFULEVBQXFCbkIsRUFBckI7O0FBRUEsZUFBS3FCLGFBQUwsQ0FBbUIsNEJBQW5CLEVBQWlEO0FBQy9DdEIscUJBQVNRLE9BRHNDO0FBRS9DZSx5QkFBYXRCLEdBQUdELFFBQVFHLFlBQVg7QUFGa0MsV0FBakQ7QUFJRDtBQUNGO0FBbkNIO0FBQUE7QUFBQSxrQ0FxQ2NxQixLQXJDZCxFQXFDcUI7QUFDakIsWUFBTXhCLFVBQVUsS0FBS3lCLGFBQUwsQ0FBbUJELEtBQW5CLENBQWhCO0FBQ0EsWUFBTXZCLEtBQUssS0FBS0MsR0FBTCxDQUFTLFVBQVQsQ0FBWDtBQUNBLFlBQU13QixRQUFRMUIsUUFBUUUsR0FBUixDQUFZLGNBQVosQ0FBZDtBQUNBLFlBQUlELEdBQUd5QixLQUFILEtBQWF6QixHQUFHeUIsS0FBSCxFQUFVcEIsUUFBVixDQUFtQmtCLEtBQW5CLENBQWpCLEVBQTRDO0FBQzFDdkIsYUFBR3lCLEtBQUgsRUFBVUMsWUFBVixDQUF1QkgsS0FBdkI7QUFDQSxjQUFJdkIsR0FBR3lCLEtBQUgsRUFBVUUsTUFBVixNQUFzQixDQUExQixFQUE2QjtBQUMzQixpQkFBS0MsZ0JBQUwsQ0FBc0JILEtBQXRCO0FBQ0Q7QUFDRjtBQUNELGFBQUtOLEdBQUwsQ0FBUyxVQUFULEVBQXFCbkIsRUFBckI7QUFDQSxhQUFLcUIsYUFBTCxDQUFtQiw4QkFBbkIsRUFBbUQ7QUFDakR0QixtQkFBU0E7QUFEd0MsU0FBbkQ7QUFHRDtBQW5ESDtBQUFBO0FBQUEsdUNBcURtQjBCLEtBckRuQixFQXFEMEI7QUFDdEIsWUFBTXpCLEtBQUssS0FBS0MsR0FBTCxDQUFTLFVBQVQsQ0FBWDtBQUNBLFlBQU00QixRQUFRN0IsR0FBR3lCLEtBQUgsQ0FBZDtBQUNBLGVBQU96QixHQUFHeUIsS0FBSCxDQUFQO0FBQ0EsYUFBS0osYUFBTCxDQUFtQixrQ0FBbkIsRUFBdUQ7QUFDckRRLGlCQUFPQTtBQUQ4QyxTQUF2RDtBQUdEO0FBNURIO0FBQUE7QUFBQSxvQ0E4RGdCTixLQTlEaEIsRUE4RHVCO0FBQ25CLFlBQU1PLE1BQU1yQixPQUFPQyxNQUFQLENBQWMsS0FBS1QsR0FBTCxDQUFTLFVBQVQsQ0FBZCxDQUFaO0FBRG1CO0FBQUE7QUFBQTs7QUFBQTtBQUVuQixnQ0FBZTZCLEdBQWYsbUlBQW9CO0FBQUEsZ0JBQVg5QixFQUFXO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ2xCLG9DQUFnQkEsR0FBR0MsR0FBSCxDQUFPLFNBQVAsQ0FBaEIsbUlBQW1DO0FBQUEsb0JBQTFCOEIsR0FBMEI7O0FBQ2pDLG9CQUFJQSxJQUFJOUIsR0FBSixDQUFRLElBQVIsS0FBaUJzQixLQUFyQixFQUE0QixPQUFPUSxHQUFQO0FBQzdCO0FBSGlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJbkI7QUFOa0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFPbkIsZUFBTyxJQUFQO0FBQ0Q7QUF0RUg7QUFBQTtBQUFBLCtCQXdFVztBQUNQLGFBQUtaLEdBQUwsQ0FBUyxNQUFULEVBQWlCLENBQUMsS0FBS2xCLEdBQUwsQ0FBUyxNQUFULENBQWxCO0FBQ0Q7QUExRUg7QUFBQTtBQUFBLG1DQTRFZStCLFFBNUVmLEVBNEV5QjtBQUNyQixZQUFNRCxNQUFNLEtBQUtQLGFBQUwsQ0FBbUJRLFFBQW5CLENBQVo7QUFDQSxZQUFJRCxHQUFKLEVBQVM7QUFDUEEsY0FBSVosR0FBSixDQUFRLE9BQVIsRUFBaUIsQ0FBQ1ksSUFBSTlCLEdBQUosQ0FBUSxPQUFSLENBQWxCO0FBQ0EsZUFBS29CLGFBQUwsQ0FBbUIsNEJBQW5CLEVBQWlEO0FBQy9DVyxzQkFBVUQsSUFBSTlCLEdBQUosQ0FBUSxJQUFSLENBRHFDO0FBRS9DZ0MsbUJBQU9GLElBQUk5QixHQUFKLENBQVEsT0FBUjtBQUZ3QyxXQUFqRDtBQUlEO0FBQ0Y7QUFyRkg7QUFBQTtBQUFBLHdDQXVGb0I7QUFDaEIsWUFBTWlDLFFBQVEsRUFBZDtBQUNBekIsZUFBT0MsTUFBUCxDQUFjLEtBQUtULEdBQUwsQ0FBUyxVQUFULENBQWQsRUFBb0NrQyxPQUFwQyxDQUE0QyxVQUFDbkMsRUFBRCxFQUFRO0FBQ2xEa0MsZ0JBQU1sQyxHQUFHQyxHQUFILENBQU8sY0FBUCxDQUFOLElBQWdDLEVBQWhDO0FBQ0FELGFBQUdDLEdBQUgsQ0FBTyxTQUFQLEVBQWtCa0MsT0FBbEIsQ0FBMEIsVUFBQ0osR0FBRCxFQUFTO0FBQ2pDRyxrQkFBTWxDLEdBQUdDLEdBQUgsQ0FBTyxjQUFQLENBQU4sRUFBOEI4QixJQUFJOUIsR0FBSixDQUFRLElBQVIsQ0FBOUIsSUFBK0M4QixJQUFJOUIsR0FBSixDQUFRLE9BQVIsQ0FBL0M7QUFDRCxXQUZEO0FBR0QsU0FMRDtBQU1BLGVBQU9pQyxLQUFQO0FBQ0Q7QUFoR0g7O0FBQUE7QUFBQSxJQUF3QzNDLEtBQXhDO0FBa0dELENBL0dEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbW9kZWwuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
