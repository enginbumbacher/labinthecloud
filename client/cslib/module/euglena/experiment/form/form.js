'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Form = require('core/component/form/form'),
      Button = require('core/component/button/field'),
      LightMatrix = require('./lightmatrix/field'),
      Utils = require('core/util/utils');

  return function (_Form) {
    _inherits(ExperimentForm, _Form);

    function ExperimentForm() {
      _classCallCheck(this, ExperimentForm);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(ExperimentForm).call(this, {
        modelData: {
          id: "experiment",
          classes: ["form__experiment"],
          title: "Programmable Light Controls",
          fields: [LightMatrix.create({
            id: "lights",
            value: [{
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
            }]
          })],
          buttons: [Button.create({
            id: 'dry_run',
            label: 'Dry Run',
            eventName: 'Experiment.DryRun'
          }), Button.create({
            id: 'submit',
            label: 'Submit',
            eventName: 'Experiment.Submit'
          })]
        }
      }));
    }

    return ExperimentForm;
  }(Form);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybS9mb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxVQUFDLE9BQUQsRUFBYTtBQUNsQixNQUFNLE9BQU8sUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRSxTQUFTLFFBQVEsNkJBQVIsQ0FEWDtBQUFBLE1BRUUsY0FBYyxRQUFRLHFCQUFSLENBRmhCO0FBQUEsTUFHRSxRQUFRLFFBQVEsaUJBQVIsQ0FIVjs7QUFNQTtBQUFBOztBQUNFLDhCQUFjO0FBQUE7O0FBQUEsK0ZBQ047QUFDSixtQkFBVztBQUNULGNBQUksWUFESztBQUVULG1CQUFTLENBQUMsa0JBQUQsQ0FGQTtBQUdULGlCQUFPLDZCQUhFO0FBSVQsa0JBQVEsQ0FBQyxZQUFZLE1BQVosQ0FBbUI7QUFDMUIsZ0JBQUksUUFEc0I7QUFFMUIsbUJBQU8sQ0FBQztBQUNOLG9CQUFNLEdBREE7QUFFTix3QkFBVTtBQUZKLGFBQUQsRUFHSjtBQUNELG1CQUFLLEdBREo7QUFFRCx3QkFBVTtBQUZULGFBSEksRUFNSjtBQUNELHNCQUFRLEdBRFA7QUFFRCx3QkFBVTtBQUZULGFBTkksRUFTSjtBQUNELHFCQUFPLEdBRE47QUFFRCx3QkFBVTtBQUZULGFBVEk7QUFGbUIsV0FBbkIsQ0FBRCxDQUpDO0FBb0JULG1CQUFTLENBQUMsT0FBTyxNQUFQLENBQWM7QUFDdEIsZ0JBQUksU0FEa0I7QUFFdEIsbUJBQU8sU0FGZTtBQUd0Qix1QkFBVztBQUhXLFdBQWQsQ0FBRCxFQUlMLE9BQU8sTUFBUCxDQUFjO0FBQ2hCLGdCQUFJLFFBRFk7QUFFaEIsbUJBQU8sUUFGUztBQUdoQix1QkFBVztBQUhLLFdBQWQsQ0FKSztBQXBCQTtBQURQLE9BRE07QUFpQ2I7O0FBbENIO0FBQUEsSUFBb0MsSUFBcEM7QUFvQ0QsQ0EzQ0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtL2Zvcm0uanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
