'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals');
  var Form = require('core/component/form/form'),
      Button = require('core/component/button/field'),
      LightMatrix = require('./lightmatrix/field'),
      Utils = require('core/util/utils');

  return function (_Form) {
    _inherits(ExperimentForm, _Form);

    function ExperimentForm() {
      _classCallCheck(this, ExperimentForm);

      var lightsDefault = Globals.get('State.experiment.allowNew') ? [{
        left: 100,
        duration: 15
      }, {
        top: 100,
        duration: 15
      }, {
        bottom: 100,
        duration: 15
      }, {
        right: 100,
        duration: 15
      }] : [];
      var buttons = [Button.create({
        id: 'dry_run',
        label: 'Dry Run',
        classes: ['form__experiment__dry_run'],
        eventName: 'Experiment.DryRun'
      }), Button.create({
        id: 'submit',
        label: 'Submit',
        classes: ['form__experiment__submit'],
        eventName: 'Experiment.Submit'
      }), Button.create({
        id: 'aggregate',
        label: 'Add Results to Aggregate',
        classes: ['form__experiment__aggregate'],
        eventName: 'Experiment.AddToAggregate'
      })];
      if (Globals.get('State.experiment.allowNew')) {
        buttons.splice(2, 0, Button.create({
          id: 'new',
          label: 'New Experiment',
          classes: ['form__experiment__new'],
          eventName: 'Experiment.NewRequest'
        }));
      }

      var _this = _possibleConstructorReturn(this, (ExperimentForm.__proto__ || Object.getPrototypeOf(ExperimentForm)).call(this, {
        modelData: {
          id: "experiment",
          classes: ["form__experiment"],
          fields: [LightMatrix.create({
            id: "lights",
            value: lightsDefault,
            validation: {
              custom: {
                test: 'custom',
                fn: function fn(val) {
                  var total = val.map(function (field) {
                    return field.duration ? field.duration : 0;
                  }).reduce(function (prev, curr, currInd, arr) {
                    return prev + curr;
                  }, 0);
                  return Promise.resolve(total == Globals.get('AppConfig.experiment.maxDuration'));
                },
                errorMessage: 'Total experiment duration must be exactly ' + Globals.get('AppConfig.experiment.maxDuration') + ' seconds.'
              }
            }
          })],
          buttons: buttons
        }
      }));

      _this.setState('new');
      return _this;
    }

    _createClass(ExperimentForm, [{
      key: 'setState',
      value: function setState(state) {
        switch (state) {
          case "historical":
            switch (Globals.get('AppConfig.system.experimentModality').toLowerCase()) {
              case "observe":
                this.getField('lights').disable();
                this.getButton('dry_run').view().hide();
                this.getButton('submit').view().hide();
                this.getButton('new').view().hide();
                this.getButton('aggregate').view().hide();
                break;
              case "explore":
                this.getField('lights').disable();
                this.getButton('dry_run').view().hide();
                this.getButton('submit').view().hide();
                this.getButton('new').view().hide();
                this.getButton('aggregate').view().hide();
                break;
              case "create":
                this.getField('lights').disable();
                this.getButton('dry_run').view().hide();
                this.getButton('submit').view().hide();
                if (Globals.get('State.experiment.allowNew')) {
                  this.getButton('new').view().show();
                }
                if (Globals.get('AppConfig.aggregate')) {
                  this.getButton('aggregate').view().show();
                } else {
                  this.getButton('aggregate').view().hide();
                }
                break;
            }
            break;
          case "new":
            this.getField('lights').enable();
            this.getButton('dry_run').view().show();
            this.getButton('submit').view().show();
            if (Globals.get('State.experiment.allowNew')) {
              this.getButton('new').view().hide();
            }
            this.getButton('aggregate').view().hide();
            break;
        }
      }
    }, {
      key: 'disableNew',
      value: function disableNew() {
        var newBtn = this.getButton('new');
        if (newBtn) {
          newBtn.disable();
        }
      }
    }, {
      key: 'enableNew',
      value: function enableNew() {
        var newBtn = this.getButton('new');
        if (newBtn) {
          newBtn.enable();
        }
      }
    }]);

    return ExperimentForm;
  }(Form);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiRm9ybSIsIkJ1dHRvbiIsIkxpZ2h0TWF0cml4IiwiVXRpbHMiLCJsaWdodHNEZWZhdWx0IiwiZ2V0IiwibGVmdCIsImR1cmF0aW9uIiwidG9wIiwiYm90dG9tIiwicmlnaHQiLCJidXR0b25zIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsImNsYXNzZXMiLCJldmVudE5hbWUiLCJzcGxpY2UiLCJtb2RlbERhdGEiLCJmaWVsZHMiLCJ2YWx1ZSIsInZhbGlkYXRpb24iLCJjdXN0b20iLCJ0ZXN0IiwiZm4iLCJ2YWwiLCJ0b3RhbCIsIm1hcCIsImZpZWxkIiwicmVkdWNlIiwicHJldiIsImN1cnIiLCJjdXJySW5kIiwiYXJyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJlcnJvck1lc3NhZ2UiLCJzZXRTdGF0ZSIsInN0YXRlIiwidG9Mb3dlckNhc2UiLCJnZXRGaWVsZCIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJuZXdCdG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUNBLE1BQU1FLE9BQU9GLFFBQVEsMEJBQVIsQ0FBYjtBQUFBLE1BQ0VHLFNBQVNILFFBQVEsNkJBQVIsQ0FEWDtBQUFBLE1BRUVJLGNBQWNKLFFBQVEscUJBQVIsQ0FGaEI7QUFBQSxNQUdFSyxRQUFRTCxRQUFRLGlCQUFSLENBSFY7O0FBTUE7QUFBQTs7QUFDRSw4QkFBYztBQUFBOztBQUNaLFVBQU1NLGdCQUFnQkwsUUFBUU0sR0FBUixDQUFZLDJCQUFaLElBQTJDLENBQUM7QUFDaEVDLGNBQU0sR0FEMEQ7QUFFaEVDLGtCQUFVO0FBRnNELE9BQUQsRUFHOUQ7QUFDREMsYUFBSyxHQURKO0FBRURELGtCQUFVO0FBRlQsT0FIOEQsRUFNOUQ7QUFDREUsZ0JBQVEsR0FEUDtBQUVERixrQkFBVTtBQUZULE9BTjhELEVBUzlEO0FBQ0RHLGVBQU8sR0FETjtBQUVESCxrQkFBVTtBQUZULE9BVDhELENBQTNDLEdBWWpCLEVBWkw7QUFhQSxVQUFNSSxVQUFVLENBQUNWLE9BQU9XLE1BQVAsQ0FBYztBQUM3QkMsWUFBSSxTQUR5QjtBQUU3QkMsZUFBTyxTQUZzQjtBQUc3QkMsaUJBQVMsQ0FBQywyQkFBRCxDQUhvQjtBQUk3QkMsbUJBQVc7QUFKa0IsT0FBZCxDQUFELEVBS1pmLE9BQU9XLE1BQVAsQ0FBYztBQUNoQkMsWUFBSSxRQURZO0FBRWhCQyxlQUFPLFFBRlM7QUFHaEJDLGlCQUFTLENBQUMsMEJBQUQsQ0FITztBQUloQkMsbUJBQVc7QUFKSyxPQUFkLENBTFksRUFVWmYsT0FBT1csTUFBUCxDQUFjO0FBQ2hCQyxZQUFJLFdBRFk7QUFFaEJDLGVBQU8sMEJBRlM7QUFHaEJDLGlCQUFTLENBQUMsNkJBQUQsQ0FITztBQUloQkMsbUJBQVc7QUFKSyxPQUFkLENBVlksQ0FBaEI7QUFnQkEsVUFBSWpCLFFBQVFNLEdBQVIsQ0FBWSwyQkFBWixDQUFKLEVBQThDO0FBQzVDTSxnQkFBUU0sTUFBUixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUJoQixPQUFPVyxNQUFQLENBQWM7QUFDakNDLGNBQUksS0FENkI7QUFFakNDLGlCQUFPLGdCQUYwQjtBQUdqQ0MsbUJBQVMsQ0FBQyx1QkFBRCxDQUh3QjtBQUlqQ0MscUJBQVc7QUFKc0IsU0FBZCxDQUFyQjtBQU1EOztBQXJDVyxrSUF1Q047QUFDSkUsbUJBQVc7QUFDVEwsY0FBSSxZQURLO0FBRVRFLG1CQUFTLENBQUMsa0JBQUQsQ0FGQTtBQUdUSSxrQkFBUSxDQUFDakIsWUFBWVUsTUFBWixDQUFtQjtBQUMxQkMsZ0JBQUksUUFEc0I7QUFFMUJPLG1CQUFPaEIsYUFGbUI7QUFHMUJpQix3QkFBWTtBQUNWQyxzQkFBUTtBQUNOQyxzQkFBTSxRQURBO0FBRU5DLG9CQUFJLFlBQUNDLEdBQUQsRUFBUztBQUNYLHNCQUFNQyxRQUFRRCxJQUFJRSxHQUFKLENBQVEsVUFBQ0MsS0FBRDtBQUFBLDJCQUFXQSxNQUFNckIsUUFBTixHQUFpQnFCLE1BQU1yQixRQUF2QixHQUFrQyxDQUE3QztBQUFBLG1CQUFSLEVBQXdEc0IsTUFBeEQsQ0FBK0QsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWFDLE9BQWIsRUFBc0JDLEdBQXRCO0FBQUEsMkJBQThCSCxPQUFPQyxJQUFyQztBQUFBLG1CQUEvRCxFQUEwRyxDQUExRyxDQUFkO0FBQ0EseUJBQU9HLFFBQVFDLE9BQVIsQ0FBZ0JULFNBQVMzQixRQUFRTSxHQUFSLENBQVksa0NBQVosQ0FBekIsQ0FBUDtBQUNELGlCQUxLO0FBTU4rQiw2RUFBMkRyQyxRQUFRTSxHQUFSLENBQVksa0NBQVosQ0FBM0Q7QUFOTTtBQURFO0FBSGMsV0FBbkIsQ0FBRCxDQUhDO0FBaUJUTSxtQkFBU0E7QUFqQkE7QUFEUCxPQXZDTTs7QUE2RFosWUFBSzBCLFFBQUwsQ0FBYyxLQUFkO0FBN0RZO0FBOERiOztBQS9ESDtBQUFBO0FBQUEsK0JBa0VXQyxLQWxFWCxFQWtFa0I7QUFDZCxnQkFBUUEsS0FBUjtBQUNFLGVBQUssWUFBTDtBQUNFLG9CQUFRdkMsUUFBUU0sR0FBUixDQUFZLHFDQUFaLEVBQW1Ea0MsV0FBbkQsRUFBUjtBQUNFLG1CQUFLLFNBQUw7QUFDRSxxQkFBS0MsUUFBTCxDQUFjLFFBQWQsRUFBd0JDLE9BQXhCO0FBQ0EscUJBQUtDLFNBQUwsQ0FBZSxTQUFmLEVBQTBCQyxJQUExQixHQUFpQ0MsSUFBakM7QUFDQSxxQkFBS0YsU0FBTCxDQUFlLFFBQWYsRUFBeUJDLElBQXpCLEdBQWdDQyxJQUFoQztBQUNBLHFCQUFLRixTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJDLElBQTdCO0FBQ0EscUJBQUtGLFNBQUwsQ0FBZSxXQUFmLEVBQTRCQyxJQUE1QixHQUFtQ0MsSUFBbkM7QUFDRjtBQUNBLG1CQUFLLFNBQUw7QUFDRSxxQkFBS0osUUFBTCxDQUFjLFFBQWQsRUFBd0JDLE9BQXhCO0FBQ0EscUJBQUtDLFNBQUwsQ0FBZSxTQUFmLEVBQTBCQyxJQUExQixHQUFpQ0MsSUFBakM7QUFDQSxxQkFBS0YsU0FBTCxDQUFlLFFBQWYsRUFBeUJDLElBQXpCLEdBQWdDQyxJQUFoQztBQUNBLHFCQUFLRixTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJDLElBQTdCO0FBQ0EscUJBQUtGLFNBQUwsQ0FBZSxXQUFmLEVBQTRCQyxJQUE1QixHQUFtQ0MsSUFBbkM7QUFDRjtBQUNBLG1CQUFLLFFBQUw7QUFDRSxxQkFBS0osUUFBTCxDQUFjLFFBQWQsRUFBd0JDLE9BQXhCO0FBQ0EscUJBQUtDLFNBQUwsQ0FBZSxTQUFmLEVBQTBCQyxJQUExQixHQUFpQ0MsSUFBakM7QUFDQSxxQkFBS0YsU0FBTCxDQUFlLFFBQWYsRUFBeUJDLElBQXpCLEdBQWdDQyxJQUFoQztBQUNBLG9CQUFJN0MsUUFBUU0sR0FBUixDQUFZLDJCQUFaLENBQUosRUFBOEM7QUFDNUMsdUJBQUtxQyxTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJFLElBQTdCO0FBQ0Q7QUFDRCxvQkFBSTlDLFFBQVFNLEdBQVIsQ0FBWSxxQkFBWixDQUFKLEVBQXdDO0FBQ3RDLHVCQUFLcUMsU0FBTCxDQUFlLFdBQWYsRUFBNEJDLElBQTVCLEdBQW1DRSxJQUFuQztBQUNELGlCQUZELE1BRU87QUFDTCx1QkFBS0gsU0FBTCxDQUFlLFdBQWYsRUFBNEJDLElBQTVCLEdBQW1DQyxJQUFuQztBQUNEO0FBQ0g7QUEzQkY7QUE2QkY7QUFDQSxlQUFLLEtBQUw7QUFDRSxpQkFBS0osUUFBTCxDQUFjLFFBQWQsRUFBd0JNLE1BQXhCO0FBQ0EsaUJBQUtKLFNBQUwsQ0FBZSxTQUFmLEVBQTBCQyxJQUExQixHQUFpQ0UsSUFBakM7QUFDQSxpQkFBS0gsU0FBTCxDQUFlLFFBQWYsRUFBeUJDLElBQXpCLEdBQWdDRSxJQUFoQztBQUNBLGdCQUFJOUMsUUFBUU0sR0FBUixDQUFZLDJCQUFaLENBQUosRUFBOEM7QUFDNUMsbUJBQUtxQyxTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJDLElBQTdCO0FBQ0Q7QUFDRCxpQkFBS0YsU0FBTCxDQUFlLFdBQWYsRUFBNEJDLElBQTVCLEdBQW1DQyxJQUFuQztBQUNGO0FBeENGO0FBMENEO0FBN0dIO0FBQUE7QUFBQSxtQ0ErR2U7QUFDWCxZQUFNRyxTQUFTLEtBQUtMLFNBQUwsQ0FBZSxLQUFmLENBQWY7QUFDQSxZQUFJSyxNQUFKLEVBQVk7QUFDVkEsaUJBQU9OLE9BQVA7QUFDRDtBQUNGO0FBcEhIO0FBQUE7QUFBQSxrQ0FzSGM7QUFDVixZQUFNTSxTQUFTLEtBQUtMLFNBQUwsQ0FBZSxLQUFmLENBQWY7QUFDQSxZQUFJSyxNQUFKLEVBQVk7QUFDVkEsaUJBQU9ELE1BQVA7QUFDRDtBQUNGO0FBM0hIOztBQUFBO0FBQUEsSUFBb0M5QyxJQUFwQztBQTZIRCxDQXJJRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L2Zvcm0vZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG4gIGNvbnN0IEZvcm0gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0nKSxcbiAgICBCdXR0b24gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQnKSxcbiAgICBMaWdodE1hdHJpeCA9IHJlcXVpcmUoJy4vbGlnaHRtYXRyaXgvZmllbGQnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgRXhwZXJpbWVudEZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIGNvbnN0IGxpZ2h0c0RlZmF1bHQgPSBHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpID8gW3tcbiAgICAgICAgbGVmdDogMTAwLFxuICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgIH0sIHtcbiAgICAgICAgdG9wOiAxMDAsXG4gICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgfSwge1xuICAgICAgICBib3R0b206IDEwMCxcbiAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICB9LCB7XG4gICAgICAgIHJpZ2h0OiAxMDAsXG4gICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgfV0gOiBbXTtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBbQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnZHJ5X3J1bicsXG4gICAgICAgIGxhYmVsOiAnRHJ5IFJ1bicsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fZHJ5X3J1biddLFxuICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50LkRyeVJ1bidcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzdWJtaXQnLFxuICAgICAgICBsYWJlbDogJ1N1Ym1pdCcsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fc3VibWl0J10sXG4gICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuU3VibWl0J1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGxhYmVsOiAnQWRkIFJlc3VsdHMgdG8gQWdncmVnYXRlJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19hZ2dyZWdhdGUnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZSdcbiAgICAgIH0pXTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7XG4gICAgICAgIGJ1dHRvbnMuc3BsaWNlKDIsIDAsIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICAgIGlkOiAnbmV3JyxcbiAgICAgICAgICBsYWJlbDogJ05ldyBFeHBlcmltZW50JyxcbiAgICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX25ldyddLFxuICAgICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCdcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBzdXBlcih7XG4gICAgICAgIG1vZGVsRGF0YToge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBjbGFzc2VzOiBbXCJmb3JtX19leHBlcmltZW50XCJdLFxuICAgICAgICAgIGZpZWxkczogW0xpZ2h0TWF0cml4LmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogXCJsaWdodHNcIixcbiAgICAgICAgICAgIHZhbHVlOiBsaWdodHNEZWZhdWx0LFxuICAgICAgICAgICAgdmFsaWRhdGlvbjoge1xuICAgICAgICAgICAgICBjdXN0b206IHtcbiAgICAgICAgICAgICAgICB0ZXN0OiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgICBmbjogKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgdG90YWwgPSB2YWwubWFwKChmaWVsZCkgPT4gZmllbGQuZHVyYXRpb24gPyBmaWVsZC5kdXJhdGlvbiA6IDApLnJlZHVjZSgocHJldiwgY3VyciwgY3VyckluZCwgYXJyKSA9PiBwcmV2ICsgY3VyciwgMCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRvdGFsID09IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogYFRvdGFsIGV4cGVyaW1lbnQgZHVyYXRpb24gbXVzdCBiZSBleGFjdGx5ICR7R2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJyl9IHNlY29uZHMuYFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSldLFxuICAgICAgICAgIGJ1dHRvbnM6IGJ1dHRvbnNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgfVxuXG5cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICBjYXNlIFwiaGlzdG9yaWNhbFwiOlxuICAgICAgICAgIHN3aXRjaCAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcIm9ic2VydmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5nZXRGaWVsZCgnbGlnaHRzJykuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignZHJ5X3J1bicpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0RmllbGQoJ2xpZ2h0cycpLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2RyeV9ydW4nKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0RmllbGQoJ2xpZ2h0cycpLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2RyeV9ydW4nKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLnNob3coKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5hZ2dyZWdhdGUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibmV3XCI6XG4gICAgICAgICAgdGhpcy5nZXRGaWVsZCgnbGlnaHRzJykuZW5hYmxlKCk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2RyeV9ydW4nKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7XG4gICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVOZXcoKSB7XG4gICAgICBjb25zdCBuZXdCdG4gPSB0aGlzLmdldEJ1dHRvbignbmV3JylcbiAgICAgIGlmIChuZXdCdG4pIHtcbiAgICAgICAgbmV3QnRuLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVOZXcoKSB7XG4gICAgICBjb25zdCBuZXdCdG4gPSB0aGlzLmdldEJ1dHRvbignbmV3JylcbiAgICAgIGlmIChuZXdCdG4pIHtcbiAgICAgICAgbmV3QnRuLmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdfQ==
