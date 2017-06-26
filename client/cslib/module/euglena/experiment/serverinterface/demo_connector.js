'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var EventDispatcher = require('core/event/dispatcher'),
      Utils = require('core/util/utils'),
      $ = require('jquery'),
      Globals = require('core/model/globals');

  return function (_EventDispatcher) {
    _inherits(DemoConnector, _EventDispatcher);

    function DemoConnector() {
      _classCallCheck(this, DemoConnector);

      var _this = _possibleConstructorReturn(this, (DemoConnector.__proto__ || Object.getPrototypeOf(DemoConnector)).call(this));

      Utils.bindMethods(_this, ['_updateProcessingTime']);
      _this.experiments = [];
      _this.demoLength = 1;
      return _this;
    }

    _createClass(DemoConnector, [{
      key: 'init',
      value: function init() {
        window.requestAnimationFrame(this._updateProcessingTime);
      }
    }, {
      key: '_updateProcessingTime',
      value: function _updateProcessingTime(timestamp) {
        var _this2 = this;

        var now = performance.now();
        this.experiments.forEach(function (exp) {
          if (exp.status == 'running') {
            if (now - exp.startTime < _this2.demoLength * 1000) {
              _this2.dispatchEvent('DemoController.Experiment.Update', {
                experiment_id: exp.id,
                remaining_estimate: _this2.demoLength * 1000 - (now - exp.startTime),
                status: exp.status
              });
            } else {
              exp.status = 'downloading';
              _this2.dispatchEvent('DemoController.Experiment.Update', {
                experiment_id: exp.id,
                status: exp.status,
                remaining_estimate: 0
              });
              Promise.all([Utils.promiseAjax('/cslib/module/euglena/experiment/demodata/58c82d732288ca69a5319aab.json'), Utils.promiseAjax('/cslib/module/euglena/experiment/demodata/tracks.json')]).then(function (downloads) {
                exp.data = {
                  experiment: downloads[0],
                  video: '/cslib/module/euglena/experiment/demodata/movie.mp4',
                  tracks: downloads[1]
                };
                exp.status = 'ready';
                _this2.dispatchEvent('DemoController.Experiment.Ready', exp);
              });
            }
          }
        });
        window.requestAnimationFrame(this._updateProcessingTime);
      }
    }, {
      key: 'runExperiment',
      value: function runExperiment(lightData, expId) {
        var exp = {
          id: this.experiments.length,
          lightData: lightData,
          startTime: performance.now(),
          status: 'running'
        };
        this.experiments.push(exp);
      }
    }]);

    return DemoConnector;
  }(EventDispatcher);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvc2VydmVyaW50ZXJmYWNlL2RlbW9fY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJFdmVudERpc3BhdGNoZXIiLCJVdGlscyIsIiQiLCJHbG9iYWxzIiwiYmluZE1ldGhvZHMiLCJleHBlcmltZW50cyIsImRlbW9MZW5ndGgiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJfdXBkYXRlUHJvY2Vzc2luZ1RpbWUiLCJ0aW1lc3RhbXAiLCJub3ciLCJwZXJmb3JtYW5jZSIsImZvckVhY2giLCJleHAiLCJzdGF0dXMiLCJzdGFydFRpbWUiLCJkaXNwYXRjaEV2ZW50IiwiZXhwZXJpbWVudF9pZCIsImlkIiwicmVtYWluaW5nX2VzdGltYXRlIiwiUHJvbWlzZSIsImFsbCIsInByb21pc2VBamF4IiwidGhlbiIsImRvd25sb2FkcyIsImRhdGEiLCJleHBlcmltZW50IiwidmlkZW8iLCJ0cmFja3MiLCJsaWdodERhdGEiLCJleHBJZCIsImxlbmd0aCIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsa0JBQWtCRCxRQUFRLHVCQUFSLENBQXhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsSUFBSUgsUUFBUSxRQUFSLENBRk47QUFBQSxNQUdFSSxVQUFVSixRQUFRLG9CQUFSLENBSFo7O0FBTUE7QUFBQTs7QUFDRSw2QkFBYztBQUFBOztBQUFBOztBQUVaRSxZQUFNRyxXQUFOLFFBQXdCLENBQ3RCLHVCQURzQixDQUF4QjtBQUdBLFlBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxZQUFLQyxVQUFMLEdBQWtCLENBQWxCO0FBTlk7QUFPYjs7QUFSSDtBQUFBO0FBQUEsNkJBVVM7QUFDTEMsZUFBT0MscUJBQVAsQ0FBNkIsS0FBS0MscUJBQWxDO0FBQ0Q7QUFaSDtBQUFBO0FBQUEsNENBY3dCQyxTQWR4QixFQWNtQztBQUFBOztBQUMvQixZQUFJQyxNQUFNQyxZQUFZRCxHQUFaLEVBQVY7QUFDQSxhQUFLTixXQUFMLENBQWlCUSxPQUFqQixDQUF5QixVQUFDQyxHQUFELEVBQVM7QUFDaEMsY0FBSUEsSUFBSUMsTUFBSixJQUFjLFNBQWxCLEVBQTZCO0FBQzNCLGdCQUFJSixNQUFNRyxJQUFJRSxTQUFWLEdBQXNCLE9BQUtWLFVBQUwsR0FBa0IsSUFBNUMsRUFBa0Q7QUFDaEQscUJBQUtXLGFBQUwsQ0FBbUIsa0NBQW5CLEVBQXVEO0FBQ3JEQywrQkFBZUosSUFBSUssRUFEa0M7QUFFckRDLG9DQUFvQixPQUFLZCxVQUFMLEdBQWtCLElBQWxCLElBQTBCSyxNQUFNRyxJQUFJRSxTQUFwQyxDQUZpQztBQUdyREQsd0JBQVFELElBQUlDO0FBSHlDLGVBQXZEO0FBS0QsYUFORCxNQU1PO0FBQ0xELGtCQUFJQyxNQUFKLEdBQWEsYUFBYjtBQUNBLHFCQUFLRSxhQUFMLENBQW1CLGtDQUFuQixFQUF1RDtBQUNyREMsK0JBQWVKLElBQUlLLEVBRGtDO0FBRXJESix3QkFBUUQsSUFBSUMsTUFGeUM7QUFHckRLLG9DQUFvQjtBQUhpQyxlQUF2RDtBQUtBQyxzQkFBUUMsR0FBUixDQUFZLENBQ1ZyQixNQUFNc0IsV0FBTixDQUFrQix5RUFBbEIsQ0FEVSxFQUVWdEIsTUFBTXNCLFdBQU4sQ0FBa0IsdURBQWxCLENBRlUsQ0FBWixFQUdHQyxJQUhILENBR1EsVUFBQ0MsU0FBRCxFQUFlO0FBQ3JCWCxvQkFBSVksSUFBSixHQUFXO0FBQ1RDLDhCQUFZRixVQUFVLENBQVYsQ0FESDtBQUVURyx5QkFBTyxxREFGRTtBQUdUQywwQkFBUUosVUFBVSxDQUFWO0FBSEMsaUJBQVg7QUFLQVgsb0JBQUlDLE1BQUosR0FBYSxPQUFiO0FBQ0EsdUJBQUtFLGFBQUwsQ0FBbUIsaUNBQW5CLEVBQXNESCxHQUF0RDtBQUNELGVBWEQ7QUFZRDtBQUNGO0FBQ0YsU0E3QkQ7QUE4QkFQLGVBQU9DLHFCQUFQLENBQTZCLEtBQUtDLHFCQUFsQztBQUNEO0FBL0NIO0FBQUE7QUFBQSxvQ0FpRGdCcUIsU0FqRGhCLEVBaUQyQkMsS0FqRDNCLEVBaURrQztBQUM5QixZQUFJakIsTUFBTTtBQUNSSyxjQUFJLEtBQUtkLFdBQUwsQ0FBaUIyQixNQURiO0FBRVJGLHFCQUFXQSxTQUZIO0FBR1JkLHFCQUFXSixZQUFZRCxHQUFaLEVBSEg7QUFJUkksa0JBQVE7QUFKQSxTQUFWO0FBTUEsYUFBS1YsV0FBTCxDQUFpQjRCLElBQWpCLENBQXNCbkIsR0FBdEI7QUFDRDtBQXpESDs7QUFBQTtBQUFBLElBQW1DZCxlQUFuQztBQTRERCxDQW5FRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L3NlcnZlcmludGVyZmFjZS9kZW1vX2Nvbm5lY3Rvci5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
