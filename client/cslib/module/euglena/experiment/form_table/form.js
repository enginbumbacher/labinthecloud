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
              case "createandhistory":
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV90YWJsZS9mb3JtLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJHbG9iYWxzIiwiRm9ybSIsIkJ1dHRvbiIsIkxpZ2h0TWF0cml4IiwiVXRpbHMiLCJsaWdodHNEZWZhdWx0IiwiZ2V0IiwibGVmdCIsImR1cmF0aW9uIiwidG9wIiwiYm90dG9tIiwicmlnaHQiLCJidXR0b25zIiwiY3JlYXRlIiwiaWQiLCJsYWJlbCIsImNsYXNzZXMiLCJldmVudE5hbWUiLCJzcGxpY2UiLCJtb2RlbERhdGEiLCJmaWVsZHMiLCJ2YWx1ZSIsInZhbGlkYXRpb24iLCJjdXN0b20iLCJ0ZXN0IiwiZm4iLCJ2YWwiLCJ0b3RhbCIsIm1hcCIsImZpZWxkIiwicmVkdWNlIiwicHJldiIsImN1cnIiLCJjdXJySW5kIiwiYXJyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJlcnJvck1lc3NhZ2UiLCJzZXRTdGF0ZSIsInN0YXRlIiwidG9Mb3dlckNhc2UiLCJnZXRGaWVsZCIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJuZXdCdG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUNBLE1BQU1FLE9BQU9GLFFBQVEsMEJBQVIsQ0FBYjtBQUFBLE1BQ0VHLFNBQVNILFFBQVEsNkJBQVIsQ0FEWDtBQUFBLE1BRUVJLGNBQWNKLFFBQVEscUJBQVIsQ0FGaEI7QUFBQSxNQUdFSyxRQUFRTCxRQUFRLGlCQUFSLENBSFY7O0FBTUE7QUFBQTs7QUFDRSw4QkFBYztBQUFBOztBQUNaLFVBQU1NLGdCQUFnQkwsUUFBUU0sR0FBUixDQUFZLDJCQUFaLElBQTJDLENBQUM7QUFDaEVDLGNBQU0sR0FEMEQ7QUFFaEVDLGtCQUFVO0FBRnNELE9BQUQsRUFHOUQ7QUFDREMsYUFB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LE1BQXhCO0FBQ0EsaUJBQUtKLFNBQUwsQ0FBZSxTQUFmLEVBQTBCQyxJQUExQixHQUFpQ0UsSUFBakM7QUFDQSxpQkFBS0gsU0FBTCxDQUFlLFFBQWYsRUFBeUJDLElBQXpCLEdBQWdDRSxJQUFoQztBQUNBLGdCQUFJOUMsUUFBUU0sR0FBUixDQUFZLDJCQUFaLENBQUosRUFBOEM7QUFBRSxtQkFBS3FDLFNBQUwsQ0FBZSxLQUFmLEVBQXNCQyxJQUF0QixHQUE2QkMsSUFBN0I7QUFBcUM7QUFDckYsaUJBQUtGLFNBQUwsQ0FBZSxXQUFmLEVBQTRCQyxJQUE1QixHQUFtQ0MsSUFBbkM7QUFDRjtBQXJDRjtBQXVDRDtBQTFHSDtBQUFBO0FBQUEsbUNBNEdlO0FBQ1gsWUFBTUcsU0FBUyxLQUFLTCxTQUFMLENBQWUsS0FBZixDQUFmO0FBQ0EsWUFBSUssTUFBSixFQUFZO0FBQ1ZBLGlCQUFPTixPQUFQO0FBQ0Q7QUFDRjtBQWpISDtBQUFBO0FBQUEsa0NBbUhjO0FBQ1YsWUFBTU0sU0FBUyxLQUFLTCxTQUFMLENBQWUsS0FBZixDQUFmO0FBQ0EsWUFBSUssTUFBSixFQUFZO0FBQ1ZBLGlCQUFPRCxNQUFQO0FBQ0Q7QUFDRjtBQXhISDs7QUFBQTtBQUFBLElBQW9DOUMsSUFBcEM7QUEwSEQsQ0FsSUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtX3RhYmxlL2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyksXG4gICAgTGlnaHRNYXRyaXggPSByZXF1aXJlKCcuL2xpZ2h0bWF0cml4L2ZpZWxkJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIEV4cGVyaW1lbnRGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBjb25zdCBsaWdodHNEZWZhdWx0ID0gR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSA/IFt7XG4gICAgICAgIGxlZnQ6IDEwMCxcbiAgICAgICAgZHVyYXRpb246IDE1XG4gICAgICB9LCB7XG4gICAgICAgIHRvcDogMTAwLFxuICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgIH0sIHtcbiAgICAgICAgYm90dG9tOiAxMDAsXG4gICAgICAgIGR1cmF0aW9uOiAxNVxuICAgICAgfSwge1xuICAgICAgICByaWdodDogMTAwLFxuICAgICAgICBkdXJhdGlvbjogMTVcbiAgICAgIH1dIDogW107XG4gICAgICBjb25zdCBidXR0b25zID0gW0J1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ2RyeV9ydW4nLFxuICAgICAgICBsYWJlbDogJ0RyeSBSdW4nLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX2RyeV9ydW4nXSxcbiAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5EcnlSdW4nXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc3VibWl0JyxcbiAgICAgICAgbGFiZWw6ICdTdWJtaXQnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX3N1Ym1pdCddLFxuICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50LlN1Ym1pdCdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBsYWJlbDogJ0FkZCBSZXN1bHRzIHRvIEFnZ3JlZ2F0ZScsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fYWdncmVnYXRlJ10sXG4gICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnXG4gICAgICB9KV07XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkge1xuICAgICAgICBidXR0b25zLnNwbGljZSgyLCAwLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgICBpZDogJ25ldycsXG4gICAgICAgICAgbGFiZWw6ICdOZXcgRXhwZXJpbWVudCcsXG4gICAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19uZXcnXSxcbiAgICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50Lk5ld1JlcXVlc3QnXG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgc3VwZXIoe1xuICAgICAgICBtb2RlbERhdGE6IHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgY2xhc3NlczogW1wiZm9ybV9fZXhwZXJpbWVudFwiXSxcbiAgICAgICAgICBmaWVsZHM6IFtMaWdodE1hdHJpeC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwibGlnaHRzXCIsXG4gICAgICAgICAgICB2YWx1ZTogbGlnaHRzRGVmYXVsdCxcbiAgICAgICAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgICAgICAgY3VzdG9tOiB7XG4gICAgICAgICAgICAgICAgdGVzdDogJ2N1c3RvbScsXG4gICAgICAgICAgICAgICAgZm46ICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsID0gdmFsLm1hcCgoZmllbGQpID0+IGZpZWxkLmR1cmF0aW9uID8gZmllbGQuZHVyYXRpb24gOiAwKS5yZWR1Y2UoKHByZXYsIGN1cnIsIGN1cnJJbmQsIGFycikgPT4gcHJldiArIGN1cnIsIDApO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0b3RhbCA9PSBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQubWF4RHVyYXRpb24nKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGBUb3RhbCBleHBlcmltZW50IGR1cmF0aW9uIG11c3QgYmUgZXhhY3RseSAke0dsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5tYXhEdXJhdGlvbicpfSBzZWNvbmRzLmBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXSxcbiAgICAgICAgICBidXR0b25zOiBidXR0b25zXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoJ25ldycpO1xuICAgIH1cblxuXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImhpc3RvcmljYWxcIjpcbiAgICAgICAgICBzd2l0Y2ggKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0RmllbGQoJ2xpZ2h0cycpLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2RyeV9ydW4nKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5nZXRGaWVsZCgnbGlnaHRzJykuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignZHJ5X3J1bicpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTt9XG4gICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVcIjpcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVhbmRoaXN0b3J5XCI6XG4gICAgICAgICAgICAgIHRoaXMuZ2V0RmllbGQoJ2xpZ2h0cycpLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2RyeV9ydW4nKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5zaG93KCk7fVxuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5hZ2dyZWdhdGUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibmV3XCI6XG4gICAgICAgICAgdGhpcy5nZXRGaWVsZCgnbGlnaHRzJykuZW5hYmxlKCk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2RyeV9ydW4nKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZGlzYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl19
