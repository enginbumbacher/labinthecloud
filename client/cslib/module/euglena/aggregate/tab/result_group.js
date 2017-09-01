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
    experiment: null,
    results: []
  };

  return function (_Model) {
    _inherits(ResultGroup, _Model);

    function ResultGroup() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ResultGroup);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (ResultGroup.__proto__ || Object.getPrototypeOf(ResultGroup)).call(this, config));

      Utils.bindMethods(_this, ['_ensureExperimentName']);
      return _this;
    }

    _createClass(ResultGroup, [{
      key: 'contains',
      value: function contains(resultId) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.get('results')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var res = _step.value;

            if (res.get('id') == resultId) {
              return true;
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

        return false;
      }
    }, {
      key: 'length',
      value: function length() {
        return this.get('results').length;
      }
    }, {
      key: 'addResult',
      value: function addResult(result) {
        var results = this.get('results');
        if (!results.map(function (a) {
          return a.get('id');
        }).includes(result.get('id'))) {
          results.push(result);
          results.sort(function (a, b) {
            if (a.get('experimentId') == b.get('experimentId')) {
              return a.get('id') - b.get('id');
            } else {
              return a.get('experimentId') - b.get('experimentId');
            }
          });
          this.set('results', results);
          this.dispatchEvent('ResultGroup.ResultAdded', {
            dataset: result
          });
          if (result.get('euglenaModelId')) {
            Utils.promiseAjax('/api/v1/EuglenaModels/' + result.get('euglenaModelId')).then(function (eugModel) {
              result.set('name', eugModel.name);
            });
          } else {
            if (this.get('experiment')) {
              result.set('name', new Date(this.get('experiment.date_created')).toLocaleString());
            } else {
              this.addEventListener('Model.Change', this._ensureExperimentName);
            }
          }
        }
      }
    }, {
      key: '_ensureExperimentName',
      value: function _ensureExperimentName(evt) {
        var _this2 = this;

        if (evt.data.path == "experiment") {
          this.removeEventListener('Model.Change', this._ensureExperimentName);
          this.get('results').forEach(function (res) {
            if (!res.get('name') && !res.get('euglenaModelId')) {
              res.set('name', new Date(_this2.get('experiment.date_created')).toLocaleString());
            }
          });
        }
      }
    }, {
      key: 'removeResult',
      value: function removeResult(resultId) {
        var results = this.get('results');
        var res = results.filter(function (a) {
          return a.get('id') == resultId;
        })[0];
        results.splice(results.indexOf(res), 1);
        this.set('results', results);
        this.dispatchEvent('ResultGroup.ResultRemoved', {
          dataset: res
        });
      }
    }]);

    return ResultGroup;
  }(Model);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2FnZ3JlZ2F0ZS90YWIvcmVzdWx0X2dyb3VwLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZGVsIiwiZGVmYXVsdHMiLCJleHBlcmltZW50IiwicmVzdWx0cyIsImNvbmZpZyIsImVuc3VyZURlZmF1bHRzIiwiYmluZE1ldGhvZHMiLCJyZXN1bHRJZCIsImdldCIsInJlcyIsImxlbmd0aCIsInJlc3VsdCIsIm1hcCIsImEiLCJpbmNsdWRlcyIsInB1c2giLCJzb3J0IiwiYiIsInNldCIsImRpc3BhdGNoRXZlbnQiLCJkYXRhc2V0IiwicHJvbWlzZUFqYXgiLCJ0aGVuIiwiZXVnTW9kZWwiLCJuYW1lIiwiRGF0ZSIsInRvTG9jYWxlU3RyaW5nIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9lbnN1cmVFeHBlcmltZW50TmFtZSIsImV2dCIsImRhdGEiLCJwYXRoIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImZvckVhY2giLCJmaWx0ZXIiLCJzcGxpY2UiLCJpbmRleE9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxRQUFRSixRQUFRLGtCQUFSLENBQWQ7QUFBQSxNQUNFSyxXQUFXO0FBQ1RDLGdCQUFZLElBREg7QUFFVEMsYUFBUztBQUZBLEdBRGI7O0FBTUE7QUFBQTs7QUFDRSwyQkFBeUI7QUFBQSxVQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3ZCQSxhQUFPSCxRQUFQLEdBQWtCSixNQUFNUSxjQUFOLENBQXFCRCxPQUFPSCxRQUE1QixFQUFzQ0EsUUFBdEMsQ0FBbEI7O0FBRHVCLDRIQUVqQkcsTUFGaUI7O0FBR3ZC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b0Q7QUFDbERDLGtCQUFJUyxHQUFKLENBQVEsTUFBUixFQUFpQixJQUFJTyxJQUFKLENBQVMsT0FBS2pCLEdBQUwsQ0FBUyx5QkFBVCxDQUFULENBQUQsQ0FBZ0RrQixjQUFoRCxFQUFoQjtBQUNEO0FBQ0YsV0FKRDtBQUtEO0FBQ0Y7QUExREg7QUFBQTtBQUFBLG1DQTREZW5CLFFBNURmLEVBNER5QjtBQUNyQixZQUFNSixVQUFVLEtBQUtLLEdBQUwsQ0FBUyxTQUFULENBQWhCO0FBQ0EsWUFBTUMsTUFBTU4sUUFBUStCLE1BQVIsQ0FBZSxVQUFDckIsQ0FBRDtBQUFBLGlCQUFPQSxFQUFFTCxHQUFGLENBQU0sSUFBTixLQUFlRCxRQUF0QjtBQUFBLFNBQWYsRUFBK0MsQ0FBL0MsQ0FBWjtBQUNBSixnQkFBUWdDLE1BQVIsQ0FBZWhDLFFBQVFpQyxPQUFSLENBQWdCM0IsR0FBaEIsQ0FBZixFQUFxQyxDQUFyQztBQUNBLGFBQUtTLEdBQUwsQ0FBUyxTQUFULEVBQW9CZixPQUFwQjtBQUNBLGFBQUtnQixhQUFMLENBQW1CLDJCQUFuQixFQUFnRDtBQUM5Q0MsbUJBQVNYO0FBRHFDLFNBQWhEO0FBR0Q7QUFwRUg7O0FBQUE7QUFBQSxJQUFpQ1QsS0FBakM7QUF1RUQsQ0FsRkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvYWdncmVnYXRlL3RhYi9yZXN1bHRfZ3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IE1vZGVsID0gcmVxdWlyZSgnY29yZS9tb2RlbC9tb2RlbCcpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgZXhwZXJpbWVudDogbnVsbCxcbiAgICAgIHJlc3VsdHM6IFtdXG4gICAgfTtcblxuICByZXR1cm4gY2xhc3MgUmVzdWx0R3JvdXAgZXh0ZW5kcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX2Vuc3VyZUV4cGVyaW1lbnROYW1lJ10pXG4gICAgfVxuXG4gICAgY29udGFpbnMocmVzdWx0SWQpIHtcbiAgICAgIGZvciAobGV0IHJlcyBvZiB0aGlzLmdldCgncmVzdWx0cycpKSB7XG4gICAgICAgIGlmIChyZXMuZ2V0KCdpZCcpID09IHJlc3VsdElkKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZW5ndGgoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoJ3Jlc3VsdHMnKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgYWRkUmVzdWx0KHJlc3VsdCkge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IHRoaXMuZ2V0KCdyZXN1bHRzJyk7XG4gICAgICBpZiAoIXJlc3VsdHMubWFwKChhKSA9PiBhLmdldCgnaWQnKSkuaW5jbHVkZXMocmVzdWx0LmdldCgnaWQnKSkpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHJlc3VsdCk7XG4gICAgICAgIHJlc3VsdHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIGlmIChhLmdldCgnZXhwZXJpbWVudElkJykgPT0gYi5nZXQoJ2V4cGVyaW1lbnRJZCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5nZXQoJ2lkJykgLSBiLmdldCgnaWQnKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYS5nZXQoJ2V4cGVyaW1lbnRJZCcpIC0gYi5nZXQoJ2V4cGVyaW1lbnRJZCcpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnNldCgncmVzdWx0cycsIHJlc3VsdHMpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ1Jlc3VsdEdyb3VwLlJlc3VsdEFkZGVkJywge1xuICAgICAgICAgIGRhdGFzZXQ6IHJlc3VsdFxuICAgICAgICB9KVxuICAgICAgICBpZiAocmVzdWx0LmdldCgnZXVnbGVuYU1vZGVsSWQnKSkge1xuICAgICAgICAgIFV0aWxzLnByb21pc2VBamF4KGAvYXBpL3YxL0V1Z2xlbmFNb2RlbHMvJHtyZXN1bHQuZ2V0KCdldWdsZW5hTW9kZWxJZCcpfWApLnRoZW4oKGV1Z01vZGVsKSA9PiB7XG4gICAgICAgICAgICByZXN1bHQuc2V0KCduYW1lJywgZXVnTW9kZWwubmFtZSlcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLmdldCgnZXhwZXJpbWVudCcpKSB7XG4gICAgICAgICAgICByZXN1bHQuc2V0KCduYW1lJywgKG5ldyBEYXRlKHRoaXMuZ2V0KCdleHBlcmltZW50LmRhdGVfY3JlYXRlZCcpKSkudG9Mb2NhbGVTdHJpbmcoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWwuQ2hhbmdlJywgdGhpcy5fZW5zdXJlRXhwZXJpbWVudE5hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2Vuc3VyZUV4cGVyaW1lbnROYW1lKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBhdGggPT0gXCJleHBlcmltZW50XCIpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdNb2RlbC5DaGFuZ2UnLCB0aGlzLl9lbnN1cmVFeHBlcmltZW50TmFtZSk7XG4gICAgICAgIHRoaXMuZ2V0KCdyZXN1bHRzJykuZm9yRWFjaCgocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKCFyZXMuZ2V0KCduYW1lJykgJiYgIXJlcy5nZXQoJ2V1Z2xlbmFNb2RlbElkJykpIHtcbiAgICAgICAgICAgIHJlcy5zZXQoJ25hbWUnLCAobmV3IERhdGUodGhpcy5nZXQoJ2V4cGVyaW1lbnQuZGF0ZV9jcmVhdGVkJykpKS50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlUmVzdWx0KHJlc3VsdElkKSB7XG4gICAgICBjb25zdCByZXN1bHRzID0gdGhpcy5nZXQoJ3Jlc3VsdHMnKTtcbiAgICAgIGNvbnN0IHJlcyA9IHJlc3VsdHMuZmlsdGVyKChhKSA9PiBhLmdldCgnaWQnKSA9PSByZXN1bHRJZClbMF07XG4gICAgICByZXN1bHRzLnNwbGljZShyZXN1bHRzLmluZGV4T2YocmVzKSwgMSk7XG4gICAgICB0aGlzLnNldCgncmVzdWx0cycsIHJlc3VsdHMpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdSZXN1bHRHcm91cC5SZXN1bHRSZW1vdmVkJywge1xuICAgICAgICBkYXRhc2V0OiByZXNcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIFxufSkiXX0=
