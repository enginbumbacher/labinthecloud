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
            this.getField('lights').disable();
            this.getButton('dry_run').view().hide();
            this.getButton('submit').view().hide();
            if (Globals.get('State.experiment.allowNew')) {
              this.getButton('new').view().show();
            }
            this.getButton('aggregate').view().show();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiRm9ybSIsIkJ1dHRvbiIsIkxpZ2h0TWF0cml4IiwiVXRpbHMiLCJsaWdodHNEZWZhdWx0IiwiZ2V0IiwibGVmdCIsImR1cmF0aW9uIiwidG9wIiwiYm90dG9tIiwicmlnaHQiLCJidXR0b25zIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsImNsYXNzZXMiLCJldmVudE5hbWUiLCJzcGxpY2UiLCJtb2RlbERhdGEiLCJmaWVsZHMiLCJ2YWx1ZSIsInZhbGlkYXRpb24iLCJjdXN0b20iLCJ0ZXN0IiwiZm4iLCJ2YWwiLCJ0b3RhbCIsIm1hcCIsImZpZWxkIiwicmVkdWNlIiwicHJldiIsImN1cnIiLCJjdXJySW5kIiwiYXJyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJlcnJvck1lc3NhZ2UiLCJzZXRTdGF0ZSIsInN0YXRlIiwiZ2V0RmllbGQiLCJkaXNhYmxlIiwiZ2V0QnV0dG9uIiwidmlldyIsImhpZGUiLCJzaG93IiwiZW5hYmxlIiwibmV3QnRuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFDQSxNQUFNRSxPQUFPRixRQUFRLDBCQUFSLENBQWI7QUFBQSxNQUNFRyxTQUFTSCxRQUFRLDZCQUFSLENBRFg7QUFBQSxNQUVFSSxjQUFjSixRQUFRLHFCQUFSLENBRmhCO0FBQUEsTUFHRUssUUFBUUwsUUFBUSxpQkFBUixDQUhWOztBQU1BO0FBQUE7O0FBQ0UsOEJBQWM7QUFBQTs7QUFDWixVQUFNTSxnQkFBZ0JMLFFBQVFNLEdBQVIsQ0FBWSwyQkFBWixJQUEyQyxDQUFDO0FBQ2hFQyxjQUFNLEdBRDBEO0FBRWhFQyxrQkFBVTtBQUZzRCxPQUFELEVBRzlEO0FBQ0RDLGFBQUssR0FESjtBQUVERCxrQkFBVTtB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QXdCTSxNQUF4QjtBQUNBLGlCQUFLSixTQUFMLENBQWUsU0FBZixFQUEwQkMsSUFBMUIsR0FBaUNFLElBQWpDO0FBQ0EsaUJBQUtILFNBQUwsQ0FBZSxRQUFmLEVBQXlCQyxJQUF6QixHQUFnQ0UsSUFBaEM7QUFDQSxnQkFBSTdDLFFBQVFNLEdBQVIsQ0FBWSwyQkFBWixDQUFKLEVBQThDO0FBQzVDLG1CQUFLb0MsU0FBTCxDQUFlLEtBQWYsRUFBc0JDLElBQXRCLEdBQTZCQyxJQUE3QjtBQUNEO0FBQ0QsaUJBQUtGLFNBQUwsQ0FBZSxXQUFmLEVBQTRCQyxJQUE1QixHQUFtQ0MsSUFBbkM7QUFDRjtBQWxCRjtBQW9CRDtBQXRGSDtBQUFBO0FBQUEsbUNBd0ZlO0FBQ1gsWUFBTUcsU0FBUyxLQUFLTCxTQUFMLENBQWUsS0FBZixDQUFmO0FBQ0EsWUFBSUssTUFBSixFQUFZO0FBQ1ZBLGlCQUFPTixPQUFQO0FBQ0Q7QUFDRjtBQTdGSDtBQUFBO0FBQUEsa0NBK0ZjO0FBQ1YsWUFBTU0sU0FBUyxLQUFLTCxTQUFMLENBQWUsS0FBZixDQUFmO0FBQ0EsWUFBSUssTUFBSixFQUFZO0FBQ1ZBLGlCQUFPRCxNQUFQO0FBQ0Q7QUFDRjtBQXBHSDs7QUFBQTtBQUFBLElBQW9DN0MsSUFBcEM7QUFzR0QsQ0E5R0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtL2Zvcm0uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
