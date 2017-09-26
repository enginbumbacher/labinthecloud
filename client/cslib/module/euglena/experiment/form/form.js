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
                if (Globals.get('State.experiment.allowNew')) {
                  this.getButton('new').view().hide();
                }
                this.getButton('aggregate').view().hide();
                break;
              case "explore":
                this.getField('lights').disable();
                this.getButton('dry_run').view().hide();
                this.getButton('submit').view().hide();
                if (Globals.get('State.experiment.allowNew')) {
                  this.getButton('new').view().hide();
                }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiRm9ybSIsIkJ1dHRvbiIsIkxpZ2h0TWF0cml4IiwiVXRpbHMiLCJsaWdodHNEZWZhdWx0IiwiZ2V0IiwibGVmdCIsImR1cmF0aW9uIiwidG9wIiwiYm90dG9tIiwicmlnaHQiLCJidXR0b25zIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsImNsYXNzZXMiLCJldmVudE5hbWUiLCJzcGxpY2UiLCJtb2RlbERhdGEiLCJmaWVsZHMiLCJ2YWx1ZSIsInZhbGlkYXRpb24iLCJjdXN0b20iLCJ0ZXN0IiwiZm4iLCJ2YWwiLCJ0b3RhbCIsIm1hcCIsImZpZWxkIiwicmVkdWNlIiwicHJldiIsImN1cnIiLCJjdXJySW5kIiwiYXJyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJlcnJvck1lc3NhZ2UiLCJzZXRTdGF0ZSIsInN0YXRlIiwidG9Mb3dlckNhc2UiLCJnZXRGaWVsZCIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJuZXdCdG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUNBLE1BQU1FLE9BQU9GLFFBQVEsMEJBQVIsQ0FBYjtBQUFBLE1BQ0VHLFNBQVNILFFBQVEsNkJBQVIsQ0FEWDtBQUFBLE1BRUVJLGNBQWNKLFFBQVEscUJBQVIsQ0FGaEI7QUFBQSxNQUdFSyxRQUFRTCxRQUFRLGlCQUFSLENBSFY7O0FBTUE7QUFBQTs7QUFDRSw4QkFBYztBQUFBOztBQUNaLFVBQU1NLGdCQUFnQkwsUUFBUU0sR0FBUixDQUFZLDJCQUFaLElBQTJDLENBQUM7QUFDaEVDLGNBQU0sR0FEMEQ7QUFFaEVDLGtCQUFVO0FBRnNELE9BQUQsRUFHOUQ7QUFDREMsYUFBSyxHQURK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LENBQWUsU0FBZixFQUEwQkMsSUFBMUIsR0FBaUNFLElBQWpDO0FBQ0EsaUJBQUtILFNBQUwsQ0FBZSxRQUFmLEVBQXlCQyxJQUF6QixHQUFnQ0UsSUFBaEM7QUFDQSxnQkFBSTlDLFFBQVFNLEdBQVIsQ0FBWSwyQkFBWixDQUFKLEVBQThDO0FBQUUsbUJBQUtxQyxTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJDLElBQTdCO0FBQXFDO0FBQ3JGLGlCQUFLRixTQUFMLENBQWUsV0FBZixFQUE0QkMsSUFBNUIsR0FBbUNDLElBQW5DO0FBQ0Y7QUFwQ0Y7QUFzQ0Q7QUF6R0g7QUFBQTtBQUFBLG1DQTJHZTtBQUNYLFlBQU1HLFNBQVMsS0FBS0wsU0FBTCxDQUFlLEtBQWYsQ0FBZjtBQUNBLFlBQUlLLE1BQUosRUFBWTtBQUNWQSxpQkFBT04sT0FBUDtBQUNEO0FBQ0Y7QUFoSEg7QUFBQTtBQUFBLGtDQWtIYztBQUNWLFlBQU1NLFNBQVMsS0FBS0wsU0FBTCxDQUFlLEtBQWYsQ0FBZjtBQUNBLFlBQUlLLE1BQUosRUFBWTtBQUNWQSxpQkFBT0QsTUFBUDtBQUNEO0FBQ0Y7QUF2SEg7O0FBQUE7QUFBQSxJQUFvQzlDLElBQXBDO0FBeUhELENBaklEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIEJ1dHRvbiA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2J1dHRvbi9maWVsZCcpLFxuICAgIExpZ2h0TWF0cml4ID0gcmVxdWlyZSgnLi9saWdodG1hdHJpeC9maWVsZCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBFeHBlcmltZW50Rm9ybSBleHRlbmRzIEZvcm0ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgY29uc3QgbGlnaHRzRGVmYXVsdCA9IEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykgPyBbe1xuICAgICAgICBsZWZ0OiAxMDAsXG4gICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgfSwge1xuICAgICAgICB0b3A6IDEwMCxcbiAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICB9LCB7XG4gICAgICAgIGJvdHRvbTogMTAwLFxuICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgIH0sIHtcbiAgICAgICAgcmlnaHQ6IDEwMCxcbiAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICB9XSA6IFtdO1xuICAgICAgY29uc3QgYnV0dG9ucyA9IFtCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdkcnlfcnVuJyxcbiAgICAgICAgbGFiZWw6ICdEcnkgUnVuJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19kcnlfcnVuJ10sXG4gICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuRHJ5UnVuJ1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3N1Ym1pdCcsXG4gICAgICAgIGxhYmVsOiAnU3VibWl0JyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19zdWJtaXQnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5TdWJtaXQnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnYWdncmVnYXRlJyxcbiAgICAgICAgbGFiZWw6ICdBZGQgUmVzdWx0cyB0byBBZ2dyZWdhdGUnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX2FnZ3JlZ2F0ZSddLFxuICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50LkFkZFRvQWdncmVnYXRlJ1xuICAgICAgfSldO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHtcbiAgICAgICAgYnV0dG9ucy5zcGxpY2UoMiwgMCwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICduZXcnLFxuICAgICAgICAgIGxhYmVsOiAnTmV3IEV4cGVyaW1lbnQnLFxuICAgICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fbmV3J10sXG4gICAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5OZXdSZXF1ZXN0J1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHN1cGVyKHtcbiAgICAgICAgbW9kZWxEYXRhOiB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGNsYXNzZXM6IFtcImZvcm1fX2V4cGVyaW1lbnRcIl0sXG4gICAgICAgICAgZmllbGRzOiBbTGlnaHRNYXRyaXguY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiBcImxpZ2h0c1wiLFxuICAgICAgICAgICAgdmFsdWU6IGxpZ2h0c0RlZmF1bHQsXG4gICAgICAgICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgICAgICAgIGN1c3RvbToge1xuICAgICAgICAgICAgICAgIHRlc3Q6ICdjdXN0b20nLFxuICAgICAgICAgICAgICAgIGZuOiAodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCB0b3RhbCA9IHZhbC5tYXAoKGZpZWxkKSA9PiBmaWVsZC5kdXJhdGlvbiA/IGZpZWxkLmR1cmF0aW9uIDogMCkucmVkdWNlKChwcmV2LCBjdXJyLCBjdXJySW5kLCBhcnIpID0+IHByZXYgKyBjdXJyLCAwKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodG90YWwgPT0gR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJykpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBgVG90YWwgZXhwZXJpbWVudCBkdXJhdGlvbiBtdXN0IGJlIGV4YWN0bHkgJHtHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKX0gc2Vjb25kcy5gXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KV0sXG4gICAgICAgICAgYnV0dG9uczogYnV0dG9uc1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLnNldFN0YXRlKCduZXcnKTtcbiAgICB9XG5cblxuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJoaXN0b3JpY2FsXCI6XG4gICAgICAgICAgc3dpdGNoIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLmdldEZpZWxkKCdsaWdodHMnKS5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdkcnlfcnVuJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0RmllbGQoJ2xpZ2h0cycpLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2RyeV9ydW4nKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0RmllbGQoJ2xpZ2h0cycpLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2RyeV9ydW4nKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5zaG93KCk7fVxuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5hZ2dyZWdhdGUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibmV3XCI6XG4gICAgICAgICAgdGhpcy5nZXRGaWVsZCgnbGlnaHRzJykuZW5hYmxlKCk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2RyeV9ydW4nKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZGlzYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl19
