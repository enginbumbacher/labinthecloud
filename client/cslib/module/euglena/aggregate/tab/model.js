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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbW9kZWwuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiTW9kZWwiLCJkZWZhdWx0cyIsImRhdGFzZXRzIiwib3BlbiIsIlBhbGV0dGUiLCJSZXN1bHRHcm91cCIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwiZGF0YXNldCIsImRzIiwiZ2V0IiwiZXhwZXJpbWVudElkIiwiZGF0YSIsImV4cGVyaW1lbnQiLCJjb250YWlucyIsImlkIiwiZHNNb2RlbCIsInNldGNvbG9ycyIsIk9iamVjdCIsInZhbHVlcyIsInJlZHVjZSIsImFjYyIsImN1cnIiLCJjb25jYXQiLCJtYXAiLCJhIiwiYyIsImluY2x1ZGVzIiwic2V0IiwiYWRkUmVzdWx0IiwiZGlzcGF0Y2hFdmVudCIsInJlc3VsdEdyb3VwIiwicmVzSWQiLCJnZXRSZXN1bHRCeUlkIiwiZXhwSWQiLCJyZW1vdmVSZXN1bHQiLCJsZW5ndGgiLCJjbGVhclJlc3VsdEdyb3VwIiwiZ3JvdXAiLCJkc3MiLCJyZXMiLCJyZXN1bHRJZCIsInNob3duIiwic3RhdGUiLCJmb3JFYWNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxRQUFRSixRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLGNBQVUsRUFERDtBQUVUQyxVQUFNO0FBRkcsR0FEYjtBQUFBLE1BS0VDLFVBQVVSLFFBQVEsbUJBQVIsQ0FMWjtBQUFBLE1BTUVTLGNBQWNULFFBQVEsZ0JBQVIsQ0FOaEI7O0FBUUE7QUFBQTs7QUFDRSxnQ0FBWVUsTUFBWixFQUFvQjtBQUFBOztBQUNs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QUtQLGFBQUwsQ0FBbUJRLFFBQW5CLENBQVo7QUFDQSxZQUFJRCxHQUFKLEVBQVM7QUFDUEEsY0FBSVosR0FBSixDQUFRLE9BQVIsRUFBaUIsQ0FBQ1ksSUFBSTlCLEdBQUosQ0FBUSxPQUFSLENBQWxCO0FBQ0EsZUFBS29CLGFBQUwsQ0FBbUIsNEJBQW5CLEVBQWlEO0FBQy9DVyxzQkFBVUQsSUFBSTlCLEdBQUosQ0FBUSxJQUFSLENBRHFDO0FBRS9DZ0MsbUJBQU9GLElBQUk5QixHQUFKLENBQVEsT0FBUjtBQUZ3QyxXQUFqRDtBQUlEO0FBQ0Y7QUFyRkg7QUFBQTtBQUFBLHdDQXVGb0I7QUFDaEIsWUFBTWlDLFFBQVEsRUFBZDtBQUNBekIsZUFBT0MsTUFBUCxDQUFjLEtBQUtULEdBQUwsQ0FBUyxVQUFULENBQWQsRUFBb0NrQyxPQUFwQyxDQUE0QyxVQUFDbkMsRUFBRCxFQUFRO0FBQ2xEa0MsZ0JBQU1sQyxHQUFHQyxHQUFILENBQU8sY0FBUCxDQUFOLElBQWdDLEVBQWhDO0FBQ0FELGFBQUdDLEdBQUgsQ0FBTyxTQUFQLEVBQWtCa0MsT0FBbEIsQ0FBMEIsVUFBQ0osR0FBRCxFQUFTO0FBQ2pDRyxrQkFBTWxDLEdBQUdDLEdBQUgsQ0FBTyxjQUFQLENBQU4sRUFBOEI4QixJQUFJOUIsR0FBSixDQUFRLElBQVIsQ0FBOUIsSUFBK0M4QixJQUFJOUIsR0FBSixDQUFRLE9BQVIsQ0FBL0M7QUFDRCxXQUZEO0FBR0QsU0FMRDtBQU1BLGVBQU9pQyxLQUFQO0FBQ0Q7QUFoR0g7O0FBQUE7QUFBQSxJQUF3QzNDLEtBQXhDO0FBa0dELENBL0dEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgZGF0YXNldHM6IHt9LFxuICAgICAgb3BlbjogZmFsc2VcbiAgICB9LFxuICAgIFBhbGV0dGUgPSByZXF1aXJlKCdjb3JlL3V0aWwvcGFsZXR0ZScpLFxuICAgIFJlc3VsdEdyb3VwID0gcmVxdWlyZSgnLi9yZXN1bHRfZ3JvdXAnKTtcblxuICByZXR1cm4gY2xhc3MgQWdncmVnYXRlRGF0YU1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgICAgY29uZmlnLmRlZmF1bHRzID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZmlnLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG4gICAgICBzdXBlcihjb25maWcpO1xuICAgIH1cblxuICAgIGFkZERhdGFTZXQoZGF0YXNldCkge1xuICAgICAgY29uc3QgZHMgPSB0aGlzLmdldCgnZGF0YXNldHMnKTtcbiAgICAgIGlmICghZHNbZGF0YXNldC5leHBlcmltZW50SWRdKSB7XG4gICAgICAgIGRzW2RhdGFzZXQuZXhwZXJpbWVudElkXSA9IG5ldyBSZXN1bHRHcm91cCh7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZXhwZXJpbWVudElkOiBkYXRhc2V0LmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICAgIGV4cGVyaW1lbnQ6IEdsb2JhbHMuZ2V0KCdjdXJyZW50RXhwZXJpbWVudCcpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghKGRzW2RhdGFzZXQuZXhwZXJpbWVudElkXS5jb250YWlucyhkYXRhc2V0LmlkKSkpIHtcbiAgICAgICAgY29uc3QgZHNNb2RlbCA9IG5ldyBNb2RlbCh7IGRhdGE6IGRhdGFzZXQgfSlcbiAgICAgICAgY29uc3Qgc2V0Y29sb3JzID0gT2JqZWN0LnZhbHVlcyhkcykucmVkdWNlKChhY2MsIGN1cnIpID0+IHsgcmV0dXJuIGFjYy5jb25jYXQoY3Vyci5nZXQoJ3Jlc3VsdHMnKS5tYXAoKGEpID0+IGEuZ2V0KCdjb2xvcicpKSkgfSwgW10pO1xuICAgICAgICBmb3IgKGxldCBjIG9mIFBhbGV0dGUpIHtcbiAgICAgICAgICBpZiAoIXNldGNvbG9ycy5pbmNsdWRlcyhjKSkge1xuICAgICAgICAgICAgZHNNb2RlbC5zZXQoJ2NvbG9yJywgYyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkc01vZGVsLmdldCgnY29sb3InKSkgZHNNb2RlbC5zZXQoJ2NvbG9yJywgJyMwMDAwMDAnKTtcbiAgICAgICAgZHNNb2RlbC5zZXQoJ3Nob3duJywgdHJ1ZSk7XG4gICAgICAgIGRzW2RhdGFzZXQuZXhwZXJpbWVudElkXS5hZGRSZXN1bHQoZHNNb2RlbCk7XG4gICAgICAgIHRoaXMuc2V0KCdkYXRhc2V0cycsIGRzKTtcblxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuRGF0YVNldEFkZGVkJywge1xuICAgICAgICAgIGRhdGFzZXQ6IGRzTW9kZWwsXG4gICAgICAgICAgcmVzdWx0R3JvdXA6IGRzW2RhdGFzZXQuZXhwZXJpbWVudElkXVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyUmVzdWx0KHJlc0lkKSB7XG4gICAgICBjb25zdCBkYXRhc2V0ID0gdGhpcy5nZXRSZXN1bHRCeUlkKHJlc0lkKTtcbiAgICAgIGNvbnN0IGRzID0gdGhpcy5nZXQoJ2RhdGFzZXRzJyk7XG4gICAgICBjb25zdCBleHBJZCA9IGRhdGFzZXQuZ2V0KCdleHBlcmltZW50SWQnKTtcbiAgICAgIGlmIChkc1tleHBJZF0gJiYgZHNbZXhwSWRdLmNvbnRhaW5zKHJlc0lkKSkge1xuICAgICAgICBkc1tleHBJZF0ucmVtb3ZlUmVzdWx0KHJlc0lkKTtcbiAgICAgICAgaWYgKGRzW2V4cElkXS5sZW5ndGgoKSA9PSAwKSB7XG4gICAgICAgICAgdGhpcy5jbGVhclJlc3VsdEdyb3VwKGV4cElkKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnNldCgnZGF0YXNldHMnLCBkcyk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuRGF0YVNldFJlbW92ZWQnLCB7XG4gICAgICAgIGRhdGFzZXQ6IGRhdGFzZXRcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY2xlYXJSZXN1bHRHcm91cChleHBJZCkge1xuICAgICAgY29uc3QgZHMgPSB0aGlzLmdldCgnZGF0YXNldHMnKTtcbiAgICAgIGNvbnN0IGdyb3VwID0gZHNbZXhwSWRdO1xuICAgICAgZGVsZXRlIGRzW2V4cElkXTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnQWdncmVnYXRlRGF0YS5SZXN1bHRHcm91cFJlbW92ZWQnLCB7XG4gICAgICAgIGdyb3VwOiBncm91cFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRSZXN1bHRCeUlkKHJlc0lkKSB7XG4gICAgICBjb25zdCBkc3MgPSBPYmplY3QudmFsdWVzKHRoaXMuZ2V0KCdkYXRhc2V0cycpKTtcbiAgICAgIGZvciAobGV0IGRzIG9mIGRzcykge1xuICAgICAgICBmb3IgKGxldCByZXMgb2YgZHMuZ2V0KCdyZXN1bHRzJykpIHtcbiAgICAgICAgICBpZiAocmVzLmdldCgnaWQnKSA9PSByZXNJZCkgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgdGhpcy5zZXQoJ29wZW4nLCAhdGhpcy5nZXQoJ29wZW4nKSlcbiAgICB9XG5cbiAgICB0b2dnbGVSZXN1bHQocmVzdWx0SWQpIHtcbiAgICAgIGNvbnN0IHJlcyA9IHRoaXMuZ2V0UmVzdWx0QnlJZChyZXN1bHRJZCk7XG4gICAgICBpZiAocmVzKSB7XG4gICAgICAgIHJlcy5zZXQoJ3Nob3duJywgIXJlcy5nZXQoJ3Nob3duJykpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0FnZ3JlZ2F0ZURhdGEuUmVzdWx0VG9nZ2xlJywge1xuICAgICAgICAgIHJlc3VsdElkOiByZXMuZ2V0KCdpZCcpLFxuICAgICAgICAgIHNob3duOiByZXMuZ2V0KCdzaG93bicpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheVN0YXRlKCkge1xuICAgICAgY29uc3Qgc3RhdGUgPSB7fTtcbiAgICAgIE9iamVjdC52YWx1ZXModGhpcy5nZXQoJ2RhdGFzZXRzJykpLmZvckVhY2goKGRzKSA9PiB7XG4gICAgICAgIHN0YXRlW2RzLmdldCgnZXhwZXJpbWVudElkJyldID0ge307XG4gICAgICAgIGRzLmdldCgncmVzdWx0cycpLmZvckVhY2goKHJlcykgPT4ge1xuICAgICAgICAgIHN0YXRlW2RzLmdldCgnZXhwZXJpbWVudElkJyldW3Jlcy5nZXQoJ2lkJyldID0gcmVzLmdldCgnc2hvd24nKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gIH1cbn0pIl19
