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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DemoConnector).call(this));

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
              Promise.all([Utils.promiseAjax('/cslib/module/euglena/demodata/5772c50563a112626cc016f9.json'), Utils.promiseAjax('/cslib/module/euglena/demodata/tracks.json')]).then(function (downloads) {
                exp.data = {
                  experiment: downloads[0],
                  video: '/cslib/module/euglena/demodata/movie.mp4',
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
      value: function runExperiment(lightData) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9kZW1vX2Nvbm5lY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLGtCQUFrQixRQUFRLHVCQUFSLENBQXhCO0FBQUEsTUFDRSxRQUFRLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUUsSUFBSSxRQUFRLFFBQVIsQ0FGTjtBQUFBLE1BR0UsVUFBVSxRQUFRLG9CQUFSLENBSFo7O0FBTUE7QUFBQTs7QUFDRSw2QkFBYztBQUFBOztBQUFBOztBQUVaLFlBQU0sV0FBTixRQUF3QixDQUN0Qix1QkFEc0IsQ0FBeEI7QUFHQSxZQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxZQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFOWTtBQU9iOztBQVJIO0FBQUE7QUFBQSw2QkFVUztBQUNMLGVBQU8scUJBQVAsQ0FBNkIsS0FBSyxxQkFBbEM7QUFDRDtBQVpIO0FBQUE7QUFBQSw0Q0Fjd0IsU0FkeEIsRUFjbUM7QUFBQTs7QUFDL0IsWUFBSSxNQUFNLFlBQVksR0FBWixFQUFWO0FBQ0EsYUFBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLFVBQUMsR0FBRCxFQUFTO0FBQ2hDLGNBQUksSUFBSSxNQUFKLElBQWMsU0FBbEIsRUFBNkI7QUFDM0IsZ0JBQUksTUFBTSxJQUFJLFNBQVYsR0FBc0IsT0FBSyxVQUFMLEdBQWtCLElBQTVDLEVBQWtEO0FBQ2hELHFCQUFLLGFBQUwsQ0FBbUIsa0NBQW5CLEVBQXVEO0FBQ3JELCtCQUFlLElBQUksRUFEa0M7QUFFckQsb0NBQW9CLE9BQUssVUFBTCxHQUFrQixJQUFsQixJQUEwQixNQUFNLElBQUksU0FBcEMsQ0FGaUM7QUFHckQsd0JBQVEsSUFBSTtBQUh5QyxlQUF2RDtBQUtELGFBTkQsTUFNTztBQUNMLGtCQUFJLE1BQUosR0FBYSxhQUFiO0FBQ0EscUJBQUssYUFBTCxDQUFtQixrQ0FBbkIsRUFBdUQ7QUFDckQsK0JBQWUsSUFBSSxFQURrQztBQUVyRCx3QkFBUSxJQUFJLE1BRnlDO0FBR3JELG9DQUFvQjtBQUhpQyxlQUF2RDtBQUtBLHNCQUFRLEdBQVIsQ0FBWSxDQUNWLE1BQU0sV0FBTixDQUFrQiw4REFBbEIsQ0FEVSxFQUVWLE1BQU0sV0FBTixDQUFrQiw0Q0FBbEIsQ0FGVSxDQUFaLEVBR0csSUFISCxDQUdRLFVBQUMsU0FBRCxFQUFlO0FBQ3JCLG9CQUFJLElBQUosR0FBVztBQUNULDhCQUFZLFVBQVUsQ0FBVixDQURIO0FBRVQseUJBQU8sMENBRkU7QUFHVCwwQkFBUSxVQUFVLENBQVY7QUFIQyxpQkFBWDtBQUtBLG9CQUFJLE1BQUosR0FBYSxPQUFiO0FBQ0EsdUJBQUssYUFBTCxDQUFtQixpQ0FBbkIsRUFBc0QsR0FBdEQ7QUFDRCxlQVhEO0FBWUQ7QUFDRjtBQUNGLFNBN0JEO0FBOEJBLGVBQU8scUJBQVAsQ0FBNkIsS0FBSyxxQkFBbEM7QUFDRDtBQS9DSDtBQUFBO0FBQUEsb0NBaURnQixTQWpEaEIsRUFpRDJCO0FBQ3ZCLFlBQUksTUFBTTtBQUNSLGNBQUksS0FBSyxXQUFMLENBQWlCLE1BRGI7QUFFUixxQkFBVyxTQUZIO0FBR1IscUJBQVcsWUFBWSxHQUFaLEVBSEg7QUFJUixrQkFBUTtBQUpBLFNBQVY7QUFNQSxhQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsR0FBdEI7QUFDRDtBQXpESDs7QUFBQTtBQUFBLElBQW1DLGVBQW5DO0FBNERELENBbkVEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3NlcnZlcmludGVyZmFjZS9kZW1vX2Nvbm5lY3Rvci5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
