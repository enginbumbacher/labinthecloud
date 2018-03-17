'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals');
  var Form = require('core/component/form/form'),
      Button = require('core/component/button/field'),
      ExpProtocol = require('./expprotocol/field'),
      Utils = require('core/util/utils');

  return function (_Form) {
    _inherits(ExperimentForm, _Form);

    function ExperimentForm() {
      _classCallCheck(this, ExperimentForm);

      var buttons = [Button.create({
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
          fields: [ExpProtocol.create({
            id: "exp_category",
            description: "1. Variable to be changed:",
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness': 'Brightness of the light', 'direction': 'Direction of the light' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_procedure",
            description: { 'default_choice': '2. Decide on the previous questions first.', 'brightness': "2. Procedure for changing the brightness:",
              'direction': "2. Procedure for changing the direction:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness_increase': 'Gradually increase the brightness', 'brightness_decrease': 'Gradually decrease the brightness',
              'brightness_hold': 'Keep one level of brightness', 'brightness_alternate': 'Alternate between two levels', 'direction_around': 'Make the light go around', 'direction_hold': 'Keep one direction', 'direction_alternate': 'Alternate between two directions' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_holdconstant",
            description: { 'default_choice': '3. Decide on the previous questions first.', 'brightness': "3. Fix the direction of light to:",
              'direction': "3. Fix the brightness of light to:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'direction_25': 'dim', 'direction_50': 'medium', 'direction_100': 'bright',
              'brightness_alldir': 'from all directions', 'brightness_left': 'from the left', 'brightness_top': 'from the top', 'brightness_right': 'from the right', 'brightness_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_firstlight",
            description: { 'default_choice': '4. Decide on the previous questions first.', 'brightness': "4. Brightness setting 1:",
              'direction': "4. Direction setting 1:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_topleft': 'from the top-left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_secondlight",
            description: { 'default_choice': '5. Decide on the previous questions first.', 'brightness': "5. Brightness setting 2:", 'direction': "5. Direction setting 2:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_lightduration",
            description: { 'default_choice': '6. Decide on the previous questions first.', 'brightness': "6. Time per setting:", 'direction': "6. Time per setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness_direction_15on': 'alternate 15 seconds on', 'brightness_direction_30on': 'each 30 seconds on' },
            validation: {}
          })],
          buttons: buttons
        }
      }));

      _this.chainOfActivation = {
        'fullChainOfActivation': { "exp_category": "exp_procedure", "exp_procedure": "exp_holdconstant", "exp_holdconstant": "exp_firstlight", "exp_firstlight": "exp_secondlight", "exp_secondlight": "exp_lightduration" },
        'partialChainOfActivation': { "exp_category": "exp_procedure", "exp_procedure": "exp_holdconstant", "exp_holdconstant": "exp_firstlight" }
      };
      _this.chainState = 'fullChainOfActivation';

      Utils.bindMethods(_this, ['_updateFormViews', 'setState', 'validate', 'getLightConfiguration']);
      _this.addEventListener('Form.FieldChanged', _this._updateFormViews);
      _this.setState('new');
      return _this;
    }

    _createClass(ExperimentForm, [{
      key: 'validate',
      value: function validate() {

        switch (this.chainState) {
          case 'fullChainOfActivation':
            this._model._data.regions.default.forEach(function (field, index) {
              field.updateValidation({ custom: {
                  test: 'custom',
                  fn: function fn(val) {
                    if (val.match('default')) {
                      return Promise.resolve(false);
                    } else {
                      return Promise.resolve(true);
                    }
                  },
                  errorMessage: "You have to choose valid options for the " + (1 + index) + "th field."
                } });
            });
            break;
          case 'partialChainOfActivation':
            this._model._data.regions.default.forEach(function (field, index) {
              if (field.id() != 'exp_secondlight' & field.id() != 'exp_lightduration') {
                field.updateValidation({ custom: {
                    test: 'custom',
                    fn: function fn(val) {
                      if (val.match('default')) {
                        return Promise.resolve(false);
                      } else {
                        return Promise.resolve(true);
                      }
                    },
                    errorMessage: "You have to choose valid options for the " + (1 + index) + "th field."
                  } });
              } else {
                field.updateValidation({});
              }
            });
            break;
        }

        return this._model.validate();
      }
    }, {
      key: 'export',
      value: function _export() {
        var lightConfig = this.getLightConfiguration();
        return { lights: lightConfig['lights'], expForm: _get(ExperimentForm.prototype.__proto__ || Object.getPrototypeOf(ExperimentForm.prototype), 'export', this).call(this) };
      }
    }, {
      key: 'import',
      value: function _import(data) {
        var _this2 = this;

        return this.clear().then(function () {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _this2._model.getFields()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var field = _step.value;

              if (data[field.id()] !== undefined) {
                field.setValue(data[field.id()]);
                if (data[field.id()] == 'direction_brightness_default_choice') {
                  field.setVisibility('hidden', 0);
                }
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
        });
      }
    }, {
      key: 'setState',
      value: function setState(state) {
        switch (state) {
          case "historical":
            this.state = 'historical';
            switch (Globals.get('AppConfig.system.experimentModality').toLowerCase()) {
              case "observe":
                this._model._data.regions.default.forEach(function (field) {
                  field.disable();
                });
                this.getButton('submit').view().hide();
                if (Globals.get('State.experiment.allowNew')) {
                  this.getButton('new').view().hide();
                }
                this.getButton('aggregate').view().hide();
                break;
              case "explore":
                this._model._data.regions.default.forEach(function (field) {
                  field.disable();
                });
                this.getButton('submit').view().hide();
                if (Globals.get('State.experiment.allowNew')) {
                  this.getButton('new').view().hide();
                }
                this.getButton('aggregate').view().hide();
                break;
              case "create":
                this._model._data.regions.default.forEach(function (field) {
                  field.disable();
                });
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
            this.state = 'new';
            this._model._data.regions.default.forEach(function (field) {
              if (field.id() == 'exp_category') {
                field.enable();
                field.setVisibility('visible');
                field.setDefault();
              } else {
                field.disable();
                field.setVisibility('hidden', 0);
                field.setDefault();
              }
            });
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
    }, {
      key: 'getLightConfiguration',
      value: function getLightConfiguration() {
        var _this3 = this;

        // Translate fields into [{"left": 100, "right": 0, "top": 0, "bottom": 100, "duration": 15}, ...]
        var defaultCounter = 0;
        this.expProtocol = {};
        this._model._data.regions.default.forEach(function (field, index) {
          _this3.expProtocol[field.id()] = field.value();
          defaultCounter = field.value() == 'direction_brightness_default_choice' ? defaultCounter + 1 : defaultCounter;
        });

        var configState = false;
        if (defaultCounter < 3) {
          configState = true;
        }

        var lightConfig = {};
        lightConfig['brightness'] = Array(4).fill(-1);
        lightConfig['lights'] = [];
        for (var panel = 0; panel < 4; panel++) {
          lightConfig['lights'].push({ 'left': 0, 'top': 0, 'right': 0, 'bottom': 0, 'duration': 15 });
        }

        if (configState) {
          var lightDirections = ['left', 'top', 'right', 'bottom'];

          // Extract the fixed value
          if (this.expProtocol['exp_holdconstant'] == 'direction_brightness_default_choice') {
            console.log('there is a problem');
          }
          if (this.expProtocol['exp_holdconstant'].match('direction')) {
            lightConfig['brightness'] = Array(4).fill().map(function () {
              return parseInt(this.expProtocol['exp_holdconstant'].match(/\d+/)[0]);
            }, this);
          } else if (this.expProtocol['exp_holdconstant'].match('brightness')) {
            (function () {
              var substr = _this3.expProtocol['exp_holdconstant'].lastIndexOf('_');
              substr = _this3.expProtocol['exp_holdconstant'].substr(substr + 1);

              var _loop = function _loop(_panel) {
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][_panel][direction] = substr.match('alldir|' + direction) ? 100 : 0;
                });
              };

              for (var _panel = 0; _panel < 4; _panel++) {
                _loop(_panel);
              }
            })();
          }

          // Modify all panels
          var lightSuccessions = { 'left': 'top', 'top': 'right', 'right': 'bottom', 'bottom': 'left', 'topleft': 'topright', 'topright': 'bottomright', 'bottomright': 'bottomleft', 'bottomleft': 'topleft' };
          var firstBrightness = null;
          var secondBrightness = null;

          if (this.chainState == 'partialChainOfActivation' & !(this.expProtocol['exp_firstlight'] == 'direction_brightness_default_choice')) {

            switch (this.expProtocol['exp_procedure']) {
              case 'brightness_increase':
                firstBrightness = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);

                var _loop2 = function _loop2(_panel2) {
                  lightConfig['brightness'][_panel2] = firstBrightness + 25 * _panel2;
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel2][direction] = lightConfig['lights'][_panel2][direction] > 0 ? lightConfig['brightness'][_panel2] : 0;
                  });
                };

                for (var _panel2 = 0; _panel2 < 4; _panel2++) {
                  _loop2(_panel2);
                }
                break;
              case 'brightness_decrease':
                firstBrightness = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);

                var _loop3 = function _loop3(_panel3) {
                  lightConfig['brightness'][_panel3] = firstBrightness - 25 * _panel3;
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel3][direction] = lightConfig['lights'][_panel3][direction] > 0 ? lightConfig['brightness'][_panel3] : 0;
                  });
                };

                for (var _panel3 = 0; _panel3 < 4; _panel3++) {
                  _loop3(_panel3);
                }
                break;
              case 'brightness_hold':
                firstBrightness = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);

                var _loop4 = function _loop4(_panel4) {
                  lightConfig['brightness'][_panel4] = firstBrightness;
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel4][direction] = lightConfig['lights'][_panel4][direction] > 0 ? lightConfig['brightness'][_panel4] : 0;
                  });
                };

                for (var _panel4 = 0; _panel4 < 4; _panel4++) {
                  _loop4(_panel4);
                }
                break;
              case 'direction_around':
                var currLight = this.expProtocol['exp_firstlight'].lastIndexOf('_');
                currLight = this.expProtocol['exp_firstlight'].substr(currLight + 1);

                var _loop5 = function _loop5(_panel5) {
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel5][direction] = currLight.match(direction) ? lightConfig['brightness'][_panel5] : 0;
                  });
                  currLight = lightSuccessions[currLight];
                };

                for (var _panel5 = 0; _panel5 < 4; _panel5++) {
                  _loop5(_panel5);
                }
                break;
              case 'direction_hold':
                var currLight = this.expProtocol['exp_firstlight'].lastIndexOf('_');
                currLight = this.expProtocol['exp_firstlight'].substr(currLight + 1);

                var _loop6 = function _loop6(_panel6) {
                  lightDirections.forEach(function (direction) {
                    return lightConfig['lights'][_panel6][direction] = currLight.match('alldir|' + direction) ? lightConfig['brightness'][_panel6] : 0;
                  });
                  if (currLight == '0') lightConfig['brightness'][_panel6] = 0;
                };

                for (var _panel6 = 0; _panel6 < 4; _panel6++) {
                  _loop6(_panel6);
                }
                break;
            }
          } else {
            // if is alternating

            // Modify the first panel
            if (!(this.expProtocol['exp_firstlight'] == 'direction_brightness_default_choice')) {
              if (this.expProtocol['exp_firstlight'].match('brightness')) {
                lightConfig['brightness'][0] = parseInt(this.expProtocol['exp_firstlight'].match(/\d+/)[0]);
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][0][direction] = lightConfig['lights'][0][direction] > 0 ? lightConfig['brightness'][0] : 0;
                });
              } else if (this.expProtocol['exp_firstlight'].match('direction')) {
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][0][direction] = _this3.expProtocol['exp_firstlight'].match('alldir|' + direction) ? lightConfig['brightness'][0] : 0;
                });
              }
            }

            // Modify the remaining panels
            if (!(this.expProtocol['exp_secondlight'] == 'direction_brightness_default_choice') & !(this.expProtocol['exp_lightduration'] == 'direction_brightness_default_choice')) {
              var modifySecondLight = [];
              switch (this.expProtocol['exp_lightduration']) {
                case 'brightness_direction_15on':
                  lightConfig['lights'][2] = lightConfig['lights'][0];
                  lightConfig['brightness'][2] = lightConfig['brightness'][0];
                  modifySecondLight = [1, 3];
                  break;
                case 'brightness_direction_15onoff':
                  var lights = { 'duration': 15 };
                  lightDirections.forEach(function (direction) {
                    return lights[direction] = 0;
                  });
                  lightConfig['lights'][1] = lights;
                  lightConfig['brightness'][1] = 0;
                  lightConfig['lights'][3] = lightConfig['lights'][1];
                  lightConfig['brightness'][3] = lightConfig['brightness'][1];
                  modifySecondLight = [2];
                  break;
                case 'brightness_direction_30on':
                  lightConfig['lights'][1] = lightConfig['lights'][0];
                  lightConfig['brightness'][1] = lightConfig['brightness'][0];
                  modifySecondLight = [2, 3];
                  break;
              }

              if (this.expProtocol['exp_secondlight'].match('brightness')) {
                lightConfig['brightness'][modifySecondLight[0]] = parseInt(this.expProtocol['exp_secondlight'].match(/\d+/)[0]);
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][modifySecondLight[0]][direction] = lightConfig['lights'][modifySecondLight[0]][direction] > 0 ? lightConfig['brightness'][modifySecondLight[0]] : 0;
                });
              } else if (this.expProtocol['exp_secondlight'].match('direction')) {
                lightDirections.forEach(function (direction) {
                  return lightConfig['lights'][modifySecondLight[0]][direction] = _this3.expProtocol['exp_secondlight'].match('alldir|' + direction) ? lightConfig['brightness'][modifySecondLight[0]] : 0;
                });
              }

              if (modifySecondLight.length > 1) {
                lightConfig['lights'][modifySecondLight[1]] = lightConfig['lights'][modifySecondLight[0]];
                lightConfig['brightness'][modifySecondLight[1]] = lightConfig['brightness'][modifySecondLight[0]];
              }
            }
          }
        }
        return lightConfig;
      }
    }, {
      key: '_updateFormViews',
      value: function _updateFormViews(evt) {
        var _this4 = this;

        if (evt.data.field._model._data.id == 'exp_category') {
          this._model._data.regions.default.forEach(function (field, index) {
            if (field.id() != 'exp_category') {
              field.showDescription(evt.data.delta.value.match('default_choice') ? 'default_choice' : evt.data.delta.value);
              if (_this4.state == 'new') {
                field.disable();
                field.setVisibility('hidden', 0);
                field.setDefault();
              }

              _this4._modifyOptions(field, evt.data.delta.value);
            } else {
              // if it is exp_category
              field.showDescription();
            }
          });

          this.chainState = 'fullChainOfActivation';
        } else if (evt.data.field._model._data.id == 'exp_procedure') {
          // The chosen procedure determines what fields to show

          //Disable options of exp_firstlight depending on what has been chose
          var field_firstlight = this._findField('exp_firstlight');
          switch (evt.data.delta.value) {
            case 'brightness_decrease':
              this._modifyOptions(field_firstlight, 'brightness_100');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'brightness_increase':
              this._modifyOptions(field_firstlight, 'brightness_25');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'direction_around':
              this._modifyOptions(field_firstlight, '_left|_topleft');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'brightness_alternate':
              this._modifyOptions(field_firstlight, 'brightness');
              this.chainState = 'fullChainOfActivation';
              break;
            case 'brightness_hold':
              this._modifyOptions(field_firstlight, 'brightness');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'direction_alternate':
              this._modifyOptions(field_firstlight, 'direction', '_topleft');
              this.chainState = 'fullChainOfActivation';
              break;
            case 'direction_hold':
              this._modifyOptions(field_firstlight, 'direction', '_topleft');
              this.chainState = 'partialChainOfActivation';
              break;
          }

          // Re-initialize successive fields
          this._model._data.regions.default.forEach(function (field, index) {
            if (field.id() != 'exp_category' & field.id() != 'exp_procedure' & _this4.state == 'new') {
              field.disable();
              field.setVisibility('hidden', 0);
              field.setDefault();
            }
          });
        }
        // Is the next field activated?
        var nextField = this._findField(this.chainOfActivation[this.chainState][evt.data.field._model._data.id]);
        if (nextField ? !nextField.isVisible() : false) {
          nextField.setVisibility('visible');
          nextField.enable();

          var nextnextField = this._findField(this.chainOfActivation[this.chainState][nextField.id()]);
          if (nextnextField) {
            nextnextField.setVisibility('hidden', 0.3);
          }
        }
      }
    }, {
      key: '_findField',
      value: function _findField(fieldId) {
        var field = null;
        for (var cntr = 0; cntr < this._model._data.regions.default.length; cntr++) {
          if (this._model._data.regions.default[cntr].id() == fieldId) {
            field = this._model._data.regions.default[cntr];
            break;
          }
        }
        return field;
      }
    }, {
      key: '_modifyOptions',
      value: function _modifyOptions(field, criteria) {
        var additionallyDisable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        Object.keys(field.getOptions()).forEach(function (choice) {
          if ((choice.match(additionallyDisable) || !choice.match(criteria)) && !choice.match('direction_brightness_default_choice')) {
            field.disableOption(choice);
          } else {
            field.enableOption(choice);
          }
        });
      }
    }]);

    return ExperimentForm;
  }(Form);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkZvcm0iLCJCdXR0b24iLCJFeHBQcm90b2NvbCIsIlV0aWxzIiwiYnV0dG9ucyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiZ2V0Iiwic3BsaWNlIiwibW9kZWxEYXRhIiwiZmllbGRzIiwiZGVzY3JpcHRpb24iLCJkZWZhdWx0VmFsdWUiLCJvcHRpb25zIiwidmFsaWRhdGlvbiIsImNoYWluT2ZBY3RpdmF0aW9uIiwiY2hhaW5TdGF0ZSIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl91cGRhdGVGb3JtVmlld3MiLCJzZXRTdGF0ZSIsIl9tb2RlbCIsIl9kYXRhIiwicmVnaW9ucyIsImRlZmF1bHQiLCJmb3JFYWNoIiwiZmllbGQiLCJpbmRleCIsInVwZGF0ZVZhbGlkYXRpb24iLCJjdXN0b20iLCJ0ZXN0IiwiZm4iLCJ2YWwiLCJtYXRjaCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3JNZXNzYWdlIiwidmFsaWRhdGUiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0cyIsImV4cEZvcm0iLCJkYXRhIiwiY2xlYXIiLCJ0aGVuIiwiZ2V0RmllbGRzIiwidW5kZWZpbmVkIiwic2V0VmFsdWUiLCJzZXRWaXNpYmlsaXR5Iiwic3RhdGUiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJzZXREZWZhdWx0IiwibmV3QnRuIiwiZGVmYXVsdENvdW50ZXIiLCJleHBQcm90b2NvbCIsInZhbHVlIiwiY29uZmlnU3RhdGUiLCJBcnJheSIsImZpbGwiLCJwYW5lbCIsInB1c2giLCJsaWdodERpcmVjdGlvbnMiLCJjb25zb2xlIiwibG9nIiwibWFwIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImRpcmVjdGlvbiIsImxpZ2h0U3VjY2Vzc2lvbnMiLCJmaXJzdEJyaWdodG5lc3MiLCJzZWNvbmRCcmlnaHRuZXNzIiwiY3VyckxpZ2h0IiwibW9kaWZ5U2Vjb25kTGlnaHQiLCJsZW5ndGgiLCJldnQiLCJzaG93RGVzY3JpcHRpb24iLCJkZWx0YSIsIl9tb2RpZnlPcHRpb25zIiwiZmllbGRfZmlyc3RsaWdodCIsIl9maW5kRmllbGQiLCJuZXh0RmllbGQiLCJpc1Zpc2libGUiLCJuZXh0bmV4dEZpZWxkIiwiZmllbGRJZCIsImNudHIiLCJjcml0ZXJpYSIsImFkZGl0aW9uYWxseURpc2FibGUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsImNob2ljZSIsImRpc2FibGVPcHRpb24iLCJlbmFibGVPcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQ0EsTUFBTUUsT0FBT0YsUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUcsU0FBU0gsUUFBUSw2QkFBUixDQURYO0FBQUEsTUFFRUksY0FBY0osUUFBUSxxQkFBUixDQUZoQjtBQUFBLE1BR0VLLFFBQVFMLFFBQVEsaUJBQVIsQ0FIVjs7QUFNQTtBQUFBOztBQUNFLDhCQUFjO0FBQUE7O0FBQ1osVUFBTU0sVUFBVSxDQUFDSCxPQUFPSSxNQUFQLENBQWM7QUFDN0JDLFlBQUksUUFEeUI7QUFFN0JDLGVBQU8sUUFGc0I7QUFHN0JDLGlCQUFTLENBQUMsMEJBQUQsQ0FIb0I7QUFJN0JDLG1CQUFXO0FBSmtCLE9BQWQsQ0FBRCxFQUtaUixPQUFPSSxNQUFQLENBQWM7QUFDaEJDLFlBQUksV0FEWTtBQUVoQkMsZUFBTywwQkFGUztBQUdoQkMsaUJBQVMsQ0FBQyw2QkFBRCxDQUhPO0FBSWhCQyxtQkFBVztBQUpLLE9BQWQsQ0FMWSxDQUFoQjtBQVdBLFVBQUlWLFFBQVFXLEdBQVIsQ0FBWSwyQkFBWixDQUFKLEVBQThDO0FBQzVDTixnQkFBUU8sTUFBUixDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUJWLE9BQU9JLE1BQVAsQ0FBYztBQUNqQ0MsY0FBSSxLQUQ2QjtBQUVqQ0MsaUJBQU8sZ0JBRjBCO0FBR2pDQyxtQkFBUyxDQUFDLHVCQUFELENBSHdCO0FBSWpDQyxxQkFBVztBQUpzQixTQUFkLENBQXJCO0FBTUQ7O0FBbkJXLGtJQXFCTjtBQUNKRyxtQkFBVztBQUNUTixjQUFJLFlBREs7QUFFVEUsbUJBQVMsQ0FBQyxrQkFBRCxDQUZBO0FBR1RLLGtCQUFRLENBQ05YLFlBQVlHLE1BQVosQ0FBbUI7QUFDakJDLGdCQUFJLGNBRGE7QUFFakJRLHlCQUFhLDRCQUZJO0FBR2pCUCxtQkFBTSxFQUhXO0FBSWpCUSwwQkFBYyxxQ0FKRztBQUtqQlAscUJBQVEsRUFMUztBQU1qQlEscUJBQVMsRUFBQyx1Q0FBdUMsbUJBQXhDLEVBQTZELGNBQWMseUJBQTNFLEVBQXNHLGFBQWEsd0JBQW5ILEVBTlE7QUFPakJDLHdCQUFZO0FBUEssV0FBbkIsQ0FETSxFQVVOZixZQUFZRyxNQUFaLENBQW1CO0FBQ2pCQyxnQkFBSSxlQURhO0FBRWpCUSx5QkFBYSxFQUFDLGtCQUFrQiw0Q0FBbkIsRUFBaUUsY0FBYywyQ0FBL0U7QUFDYiwyQkFBYSwwQ0FEQSxFQUZJO0FBSWpCUCxtQkFBTSxFQUpXO0FBS2pCUSwwQkFBYyxxQ0FMRztBQU1qQlAscUJBQVEsRUFOUztBQU9qQlEscUJBQVMsRUFBQyx1Q0FBdUMsbUJBQXhDLEVBQTZELHVCQUF1QixtQ0FBcEYsRUFBeUgsdUJBQXVCLG1DQUFoSjtBQUNULGlDQUFtQiw4QkFEVixFQUMwQyx3QkFBd0IsOEJBRGxFLEVBQ2tHLG9CQUFvQiwwQkFEdEgsRUFDa0osa0JBQWtCLG9CQURwSyxFQUMwTCx1QkFBdUIsa0NBRGpOLEVBUFE7QUFTakJDLHdCQUFZO0FBVEssV0FBbkIsQ0FWTSxFQXFCTmYsWUFBWUcsTUFBWixDQUFtQjtBQUNqQkMsZ0JBQUksa0JBRGE7QUFFakJRLHlCQUFhLEVBQUMsa0JBQWtCLDRDQUFuQixFQUFpRSxjQUFjLG1DQUEvRTtBQUNiLDJCQUFhLG9DQURBLEVBRkk7QUFJakJQLG1CQUFNLEVBSlc7QUFLakJRLDBCQUFjLHFDQUxHO0FBTWpCUCxxQkFBUSxFQU5TO0FBT2pCUSxxQkFBUyxFQUFDLHVDQUF1QyxtQkFBeEMsRUFBNkQsZ0JBQWdCLEtBQTdFLEVBQW9GLGdCQUFnQixRQUFwRyxFQUE4RyxpQkFBaUIsUUFBL0g7QUFDQyxtQ0FBcUIscUJBRHRCLEVBQzZDLG1CQUFtQixlQURoRSxFQUNpRixrQkFBa0IsY0FEbkcsRUFDbUgsb0JBQW9CLGdCQUR2SSxFQUN3SixxQkFBcUIsaUJBRDdLLEVBUFE7QUFTakJDLHdCQUFZO0FBVEssV0FBbkIsQ0FyQk0sRUFnQ05mLFlBQVlHLE1BQVosQ0FBbUI7QUFDakJDLGdCQUFJLGdCQURhO0FBRWpCUSx5QkFBYSxFQUFDLGtCQUFrQiw0Q0FBbkIsRUFBaUUsY0FBYywwQkFBL0U7QUFDYiwyQkFBYSx5QkFEQSxFQUZJO0FBSWpCUCxtQkFBTSxFQUpXO0FBS2pCUSwwQkFBYyxxQ0FMRztBQU1qQlAscUJBQVEsRUFOUztBQU9qQlEscUJBQVMsRUFBQyx1Q0FBdUMsbUJBQXhDLEVBQTZELDBCQUEwQixVQUF2RixFQUFtRyxpQkFBaUIsS0FBcEgsRUFBMkgsaUJBQWlCLFFBQTVJLEVBQXNKLGtCQUFrQixRQUF4SztBQUNDLGtDQUFvQixxQkFEckIsRUFDNEMsa0JBQWtCLGVBRDlELEVBQytFLHFCQUFxQixtQkFEcEcsRUFDeUgsaUJBQWlCLGNBRDFJLEVBQzBKLG1CQUFtQixnQkFEN0ssRUFDK0wsb0JBQW9CLGlCQURuTixFQVBRO0FBU2pCQyx3QkFBWTtBQVRLLFdBQW5CLENBaENNLEVBMkNOZixZQUFZRyxNQUFaLENBQW1CO0FBQ2pCQyxnQkFBSSxpQkFEYTtBQUVqQlEseUJBQWEsRUFBQyxrQkFBa0IsNENBQW5CLEVBQWlFLGNBQWMsMEJBQS9FLEVBQTJHLGFBQWEseUJBQXhILEVBRkk7QUFHakJQLG1CQUFNLEVBSFc7QUFJakJRLDBCQUFjLHFDQUpHO0FBS2pCUCxxQkFBUSxFQUxTO0FBTWpCUSxxQkFBUyxFQUFDLHVDQUF1QyxtQkFBeEMsRUFBNkQsMEJBQTBCLFVBQXZGLEVBQW1HLGlCQUFpQixLQUFwSCxFQUEySCxpQkFBaUIsUUFBNUksRUFBc0osa0JBQWtCLFFBQXhLO0FBQ0Msa0NBQW9CLHFCQURyQixFQUM0QyxrQkFBa0IsZUFEOUQsRUFDK0UsaUJBQWlCLGNBRGhHLEVBQ2dILG1CQUFtQixnQkFEbkksRUFDcUosb0JBQW9CLGlCQUR6SyxFQU5RO0FBUWpCQyx3QkFBWTtBQVJLLFdBQW5CLENBM0NNLEVBcUROZixZQUFZRyxNQUFaLENBQW1CO0FBQ2pCQyxnQkFBSSxtQkFEYTtBQUVqQlEseUJBQWEsRUFBQyxrQkFBa0IsNENBQW5CLEVBQWlFLGNBQWMsc0JBQS9FLEVBQXVHLGFBQWEsc0JBQXBILEVBRkk7QUFHakJQLG1CQUFNLEVBSFc7QUFJakJRLDBCQUFjLHFDQUpHO0FBS2pCUCxxQkFBUSxFQUxTO0FBTWpCUSxxQkFBUyxFQUFDLHVDQUF1QyxtQkFBeEMsRUFBNkQsNkJBQTZCLHlCQUExRixFQUFxSCw2QkFBNkIsb0JBQWxKLEVBTlE7QUFPakJDLHdCQUFZO0FBUEssV0FBbkIsQ0FyRE0sQ0FIQztBQWtFVGIsbUJBQVNBO0FBbEVBO0FBRFAsT0FyQk07O0FBNEZaLFlBQUtjLGlCQUFMLEdBQXlCO0FBQ3ZCLGlDQUF5QixFQUFDLGdCQUFnQixlQUFqQixFQUFrQyxpQkFBaUIsa0JBQW5ELEVBQXVFLG9CQUFvQixnQkFBM0YsRUFBNkcsa0JBQWtCLGlCQUEvSCxFQUFrSixtQkFBbUIsbUJBQXJLLEVBREY7QUFFdkIsb0NBQTRCLEVBQUMsZ0JBQWdCLGVBQWpCLEVBQWtDLGlCQUFpQixrQkFBbkQsRUFBdUUsb0JBQW9CLGdCQUEzRjtBQUZMLE9BQXpCO0FBSUEsWUFBS0MsVUFBTCxHQUFrQix1QkFBbEI7O0FBRUFoQixZQUFNaUIsV0FBTixRQUF3QixDQUFDLGtCQUFELEVBQW9CLFVBQXBCLEVBQWdDLFVBQWhDLEVBQTRDLHVCQUE1QyxDQUF4QjtBQUNBLFlBQUtDLGdCQUFMLENBQXNCLG1CQUF0QixFQUEyQyxNQUFLQyxnQkFBaEQ7QUFDQSxZQUFLQyxRQUFMLENBQWMsS0FBZDtBQXBHWTtBQXFHYjs7QUF0R0g7QUFBQTtBQUFBLGlDQXlHYTs7QUFFVCxnQkFBUSxLQUFLSixVQUFiO0FBQ0UsZUFBSyx1QkFBTDtBQUNFLGlCQUFLSyxNQUFMLENBQVlDLEtBQVosQ0FBa0JDLE9BQWxCLENBQTBCQyxPQUExQixDQUFrQ0MsT0FBbEMsQ0FBMEMsVUFBQ0MsS0FBRCxFQUFPQyxLQUFQLEVBQWlCO0FBQ3pERCxvQkFBTUUsZ0JBQU4sQ0FBdUIsRUFBQ0MsUUFBUTtBQUM5QkMsd0JBQU0sUUFEd0I7QUFFOUJDLHNCQUFJLFlBQUNDLEdBQUQsRUFBUztBQUNYLHdCQUFJQSxJQUFJQyxLQUFKLENBQVUsU0FBVixDQUFKLEVBQTBCO0FBQUUsNkJBQU9DLFFBQVFDLE9BQVIsQ0FBZ0IsS0FBaEIsQ0FBUDtBQUErQixxQkFBM0QsTUFDSztBQUFFLDZCQUFPRCxRQUFRQyxPQUFSLENBQWdCLElBQWhCLENBQVA7QUFBOEI7QUFDdEMsbUJBTDZCO0FBTTlCQyxnQ0FBYywrQ0FBK0MsSUFBSVQsS0FBbkQsSUFBNEQ7QUFONUMsaUJBQVQsRUFBdkI7QUFRRCxhQVREO0FBVUY7QUFDQSxlQUFLLDBCQUFMO0FBQ0UsaUJBQUtOLE1BQUwsQ0FBWUMsS0FBWixDQUFrQkMsT0FBbEIsQ0FBMEJDLE9BQTFCLENBQWtDQyxPQUFsQyxDQUEwQyxVQUFDQyxLQUFELEVBQU9DLEtBQVAsRUFBaUI7QUFDekQsa0JBQUlELE1BQU12QixFQUFOLE1BQWMsaUJBQWQsR0FBa0N1QixNQUFNdkIsRUFBTixNQUFjLG1CQUFwRCxFQUF5RTtBQUN2RXVCLHNCQUFNRSxnQkFBTixDQUF1QixFQUFDQyxRQUFRO0FBQzlCQywwQkFBTSxRQUR3QjtBQUU5QkMsd0JBQUksWUFBQ0MsR0FBRCxFQUFTO0FBQ1gsMEJBQUlBLElBQUlDLEtBQUosQ0FBVSxTQUFWLENBQUosRUFBMEI7QUFBRSwrQkFBT0MsUUFBUUMsT0FBUixDQUFnQixLQUFoQixDQUFQO0FBQStCLHVCQUEzRCxNQUNLO0FBQUUsK0JBQU9ELFFBQVFDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUE4QjtBQUN0QyxxQkFMNkI7QUFNOUJDLGtDQUFjLCtDQUErQyxJQUFJVCxLQUFuRCxJQUE0RDtBQU41QyxtQkFBVCxFQUF2QjtBQVFELGVBVEQsTUFTTztBQUNMRCxzQkFBTUUsZ0JBQU4sQ0FBdUIsRUFBdkI7QUFDRDtBQUNGLGFBYkQ7QUFjRjtBQTVCRjs7QUErQkEsZUFBTyxLQUFLUCxNQUFMLENBQVlnQixRQUFaLEVBQVA7QUFDRDtBQTNJSDtBQUFBO0FBQUEsZ0NBNklXO0FBQ1AsWUFBSUMsY0FBYyxLQUFLQyxxQkFBTCxFQUFsQjtBQUNBLGVBQU8sRUFBQ0MsUUFBUUYsWUFBWSxRQUFaLENBQVQsRUFBZ0NHLCtIQUFoQyxFQUFQO0FBQ0Q7QUFoSkg7QUFBQTtBQUFBLDhCQWtKU0MsSUFsSlQsRUFrSmU7QUFBQTs7QUFDWCxlQUFPLEtBQUtDLEtBQUwsR0FBYUMsSUFBYixDQUFrQixZQUFNO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQzdCLGlDQUFrQixPQUFLdkIsTUFBTCxDQUFZd0IsU0FBWixFQUFsQiw4SEFBMkM7QUFBQSxrQkFBbENuQixLQUFrQzs7QUFDekMsa0JBQUlnQixLQUFLaEIsTUFBTXZCLEVBQU4sRUFBTCxNQUFxQjJDLFNBQXpCLEVBQW9DO0FBQ2xDcEIsc0JBQU1xQixRQUFOLENBQWVMLEtBQUtoQixNQUFNdkIsRUFBTixFQUFMLENBQWY7QUFDQSxvQkFBSXVDLEtBQUtoQixNQUFNdkIsRUFBTixFQUFMLEtBQW9CLHFDQUF4QixFQUErRDtBQUM3RHVCLHdCQUFNc0IsYUFBTixDQUFvQixRQUFwQixFQUE2QixDQUE3QjtBQUNEO0FBQ0Y7QUFDRjtBQVI0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUzlCLFNBVE0sQ0FBUDtBQVVEO0FBN0pIO0FBQUE7QUFBQSwrQkErSldDLEtBL0pYLEVBK0prQjtBQUNkLGdCQUFRQSxLQUFSO0FBQ0UsZUFBSyxZQUFMO0FBQ0UsaUJBQUtBLEtBQUwsR0FBYSxZQUFiO0FBQ0Esb0JBQVFyRCxRQUFRVyxHQUFSLENBQVkscUNBQVosRUFBbUQyQyxXQUFuRCxFQUFSO0FBQ0UsbUJBQUssU0FBTDtBQUNFLHFCQUFLN0IsTUFBTCxDQUFZQyxLQUFaLENBQWtCQyxPQUFsQixDQUEwQkMsT0FBMUIsQ0FBa0NDLE9BQWxDLENBQTBDLFVBQUNDLEtBQUQsRUFBVztBQUNuREEsd0JBQU15QixPQUFOO0FBQ0QsaUJBRkQ7QUFHQSxxQkFBS0MsU0FBTCxDQUFlLFFBQWYsRUFBeUJDLElBQXpCLEdBQWdDQyxJQUFoQztBQUNBLG9CQUFJMUQsUUFBUVcsR0FBUixDQUFZLDJCQUFaLENBQUosRUFBOEM7QUFBRSx1QkFBSzZDLFNBQUwsQ0FBZSxLQUFmLEVBQXNCQyxJQUF0QixHQUE2QkMsSUFBN0I7QUFBcUM7QUFDckYscUJBQUtGLFNBQUwsQ0FBZSxXQUFmLEVBQTRCQyxJQUE1QixHQUFtQ0MsSUFBbkM7QUFDRjtBQUNBLG1CQUFLLFNBQUw7QUFDRSxxQkFBS2pDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQkMsT0FBbEIsQ0FBMEJDLE9BQTFCLENBQWtDQyxPQUFsQyxDQUEwQyxVQUFDQyxLQUFELEVBQVc7QUFDbkRBLHdCQUFNeUIsT0FBTjtBQUNELGlCQUZEO0FBR0EscUJBQUtDLFNBQUwsQ0FBZSxRQUFmLEVBQXlCQyxJQUF6QixHQUFnQ0MsSUFBaEM7QUFDQSxvQkFBSTFELFFBQVFXLEdBQVIsQ0FBWSwyQkFBWixDQUFKLEVBQThDO0FBQUUsdUJBQUs2QyxTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJDLElBQTdCO0FBQXFDO0FBQ3RGLHFCQUFLRixTQUFMLENBQWUsV0FBZixFQUE0QkMsSUFBNUIsR0FBbUNDLElBQW5DO0FBQ0Q7QUFDQSxtQkFBSyxRQUFMO0FBQ0UscUJBQUtqQyxNQUFMLENBQVlDLEtBQVosQ0FBa0JDLE9BQWxCLENBQTBCQyxPQUExQixDQUFrQ0MsT0FBbEMsQ0FBMEMsVUFBQ0MsS0FBRCxFQUFXO0FBQ25EQSx3QkFBTXlCLE9BQU47QUFDRCxpQkFGRDtBQUdBLHFCQUFLQyxTQUFMLENBQWUsUUFBZixFQUF5QkMsSUFBekIsR0FBZ0NDLElBQWhDO0FBQ0Esb0JBQUkxRCxRQUFRVyxHQUFSLENBQVksMkJBQVosQ0FBSixFQUE4QztBQUFFLHVCQUFLNkMsU0FBTCxDQUFlLEtBQWYsRUFBc0JDLElBQXRCLEdBQTZCRSxJQUE3QjtBQUFxQztBQUNyRixvQkFBSTNELFFBQVFXLEdBQVIsQ0FBWSxxQkFBWixDQUFKLEVBQXdDO0FBQ3RDLHVCQUFLNkMsU0FBTCxDQUFlLFdBQWYsRUFBNEJDLElBQTVCLEdBQW1DRSxJQUFuQztBQUNELGlCQUZELE1BRU87QUFDTCx1QkFBS0gsU0FBTCxDQUFlLFdBQWYsRUFBNEJDLElBQTVCLEdBQW1DQyxJQUFuQztBQUNEO0FBQ0g7QUE1QkY7QUE4QkY7QUFDQSxlQUFLLEtBQUw7QUFDRSxpQkFBS0wsS0FBTCxHQUFhLEtBQWI7QUFDQSxpQkFBSzVCLE1BQUwsQ0FBWUMsS0FBWixDQUFrQkMsT0FBbEIsQ0FBMEJDLE9BQTFCLENBQWtDQyxPQUFsQyxDQUEwQyxVQUFDQyxLQUFELEVBQVc7QUFDbkQsa0JBQUlBLE1BQU12QixFQUFOLE1BQWMsY0FBbEIsRUFBa0M7QUFDaEN1QixzQkFBTThCLE1BQU47QUFDQTlCLHNCQUFNc0IsYUFBTixDQUFvQixTQUFwQjtBQUNBdEIsc0JBQU0rQixVQUFOO0FBQ0QsZUFKRCxNQUlPO0FBQ0wvQixzQkFBTXlCLE9BQU47QUFDQXpCLHNCQUFNc0IsYUFBTixDQUFvQixRQUFwQixFQUE2QixDQUE3QjtBQUNBdEIsc0JBQU0rQixVQUFOO0FBQ0Q7QUFDRixhQVZEO0FBV0EsaUJBQUtMLFNBQUwsQ0FBZSxRQUFmLEVBQXlCQyxJQUF6QixHQUFnQ0UsSUFBaEM7QUFDQSxnQkFBSTNELFFBQVFXLEdBQVIsQ0FBWSwyQkFBWixDQUFKLEVBQThDO0FBQUUsbUJBQUs2QyxTQUFMLENBQWUsS0FBZixFQUFzQkMsSUFBdEIsR0FBNkJDLElBQTdCO0FBQXFDO0FBQ3JGLGlCQUFLRixTQUFMLENBQWUsV0FBZixFQUE0QkMsSUFBNUIsR0FBbUNDLElBQW5DO0FBQ0Y7QUFsREY7QUFvREQ7QUFwTkg7QUFBQTtBQUFBLG1DQXNOZTtBQUNYLFlBQU1JLFNBQVMsS0FBS04sU0FBTCxDQUFlLEtBQWYsQ0FBZjtBQUNBLFlBQUlNLE1BQUosRUFBWTtBQUNWQSxpQkFBT1AsT0FBUDtBQUNEO0FBQ0Y7QUEzTkg7QUFBQTtBQUFBLGtDQTZOYztBQUNWLFlBQU1PLFNBQVMsS0FBS04sU0FBTCxDQUFlLEtBQWYsQ0FBZjtBQUNBLFlBQUlNLE1BQUosRUFBWTtBQUNWQSxpQkFBT0YsTUFBUDtBQUNEO0FBQ0Y7QUFsT0g7QUFBQTtBQUFBLDhDQW9PMEI7QUFBQTs7QUFDdEI7QUFDQSxZQUFJRyxpQkFBaUIsQ0FBckI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsYUFBS3ZDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQkMsT0FBbEIsQ0FBMEJDLE9BQTFCLENBQWtDQyxPQUFsQyxDQUEwQyxVQUFDQyxLQUFELEVBQU9DLEtBQVAsRUFBaUI7QUFDekQsaUJBQUtpQyxXQUFMLENBQWlCbEMsTUFBTXZCLEVBQU4sRUFBakIsSUFBK0J1QixNQUFNbUMsS0FBTixFQUEvQjtBQUNBRiwyQkFBaUJqQyxNQUFNbUMsS0FBTixNQUFpQixxQ0FBakIsR0FBd0RGLGlCQUFpQixDQUF6RSxHQUE2RUEsY0FBOUY7QUFDRCxTQUhEOztBQUtBLFlBQUlHLGNBQWMsS0FBbEI7QUFDQSxZQUFJSCxpQkFBaUIsQ0FBckIsRUFBd0I7QUFBRUcsd0JBQWMsSUFBZDtBQUFxQjs7QUFFL0MsWUFBSXhCLGNBQWMsRUFBbEI7QUFDQUEsb0JBQVksWUFBWixJQUE0QnlCLE1BQU0sQ0FBTixFQUFTQyxJQUFULENBQWMsQ0FBQyxDQUFmLENBQTVCO0FBQ0ExQixvQkFBWSxRQUFaLElBQXdCLEVBQXhCO0FBQ0EsYUFBSyxJQUFJMkIsUUFBUSxDQUFqQixFQUFvQkEsUUFBUSxDQUE1QixFQUErQkEsT0FBL0IsRUFBd0M7QUFBRTNCLHNCQUFZLFFBQVosRUFBc0I0QixJQUF0QixDQUEyQixFQUFDLFFBQVEsQ0FBVCxFQUFZLE9BQU8sQ0FBbkIsRUFBc0IsU0FBUyxDQUEvQixFQUFrQyxVQUFVLENBQTVDLEVBQStDLFlBQVksRUFBM0QsRUFBM0I7QUFBNEY7O0FBRXRJLFlBQUlKLFdBQUosRUFBaUI7QUFDZixjQUFJSyxrQkFBa0IsQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixPQUFoQixFQUF5QixRQUF6QixDQUF0Qjs7QUFFQTtBQUNBLGNBQUksS0FBS1AsV0FBTCxDQUFpQixrQkFBakIsS0FBd0MscUNBQTVDLEVBQW1GO0FBQUNRLG9CQUFRQyxHQUFSLENBQVksb0JBQVo7QUFBa0M7QUFDdEgsY0FBSSxLQUFLVCxXQUFMLENBQWlCLGtCQUFqQixFQUFxQzNCLEtBQXJDLENBQTJDLFdBQTNDLENBQUosRUFBNkQ7QUFDM0RLLHdCQUFZLFlBQVosSUFBNEJ5QixNQUFNLENBQU4sRUFBU0MsSUFBVCxHQUFnQk0sR0FBaEIsQ0FBb0IsWUFBVztBQUFFLHFCQUFPQyxTQUFTLEtBQUtYLFdBQUwsQ0FBaUIsa0JBQWpCLEVBQXFDM0IsS0FBckMsQ0FBMkMsS0FBM0MsRUFBa0QsQ0FBbEQsQ0FBVCxDQUFQO0FBQXVFLGFBQXhHLEVBQXlHLElBQXpHLENBQTVCO0FBQ0QsV0FGRCxNQUVPLElBQUksS0FBSzJCLFdBQUwsQ0FBaUIsa0JBQWpCLEVBQXFDM0IsS0FBckMsQ0FBMkMsWUFBM0MsQ0FBSixFQUE4RDtBQUFBO0FBQ25FLGtCQUFJdUMsU0FBUyxPQUFLWixXQUFMLENBQWlCLGtCQUFqQixFQUFxQ2EsV0FBckMsQ0FBaUQsR0FBakQsQ0FBYjtBQUNBRCx1QkFBUyxPQUFLWixXQUFMLENBQWlCLGtCQUFqQixFQUFxQ1ksTUFBckMsQ0FBNENBLFNBQU8sQ0FBbkQsQ0FBVDs7QUFGbUUseUNBRzFEUCxNQUgwRDtBQUlqRUUsZ0NBQWdCMUMsT0FBaEIsQ0FBeUIsVUFBQ2lELFNBQUQ7QUFBQSx5QkFBZXBDLFlBQVksUUFBWixFQUFzQjJCLE1BQXRCLEVBQTZCUyxTQUE3QixJQUEwQ0YsT0FBT3ZDLEtBQVAsQ0FBYSxZQUFZeUMsU0FBekIsSUFBc0MsR0FBdEMsR0FBNEMsQ0FBckc7QUFBQSxpQkFBekI7QUFKaUU7O0FBR25FLG1CQUFLLElBQUlULFNBQVEsQ0FBakIsRUFBb0JBLFNBQVEsQ0FBNUIsRUFBK0JBLFFBQS9CLEVBQXdDO0FBQUEsc0JBQS9CQSxNQUErQjtBQUV2QztBQUxrRTtBQU1wRTs7QUFFRDtBQUNBLGNBQUlVLG1CQUFtQixFQUFDLFFBQVEsS0FBVCxFQUFnQixPQUFPLE9BQXZCLEVBQWdDLFNBQVMsUUFBekMsRUFBbUQsVUFBVSxNQUE3RCxFQUFxRSxXQUFXLFVBQWhGLEVBQTRGLFlBQVksYUFBeEcsRUFBdUgsZUFBZSxZQUF0SSxFQUFvSixjQUFjLFNBQWxLLEVBQXZCO0FBQ0EsY0FBSUMsa0JBQWtCLElBQXRCO0FBQ0EsY0FBSUMsbUJBQW1CLElBQXZCOztBQUVBLGNBQUksS0FBSzdELFVBQUwsSUFBbUIsMEJBQW5CLEdBQWdELEVBQUUsS0FBSzRDLFdBQUwsQ0FBaUIsZ0JBQWpCLEtBQXFDLHFDQUF2QyxDQUFwRCxFQUFtSTs7QUFFakksb0JBQVEsS0FBS0EsV0FBTCxDQUFpQixlQUFqQixDQUFSO0FBQ0UsbUJBQUsscUJBQUw7QUFDRWdCLGtDQUFrQkwsU0FBUyxLQUFLWCxXQUFMLENBQWlCLGdCQUFqQixFQUFtQzNCLEtBQW5DLENBQXlDLEtBQXpDLEVBQWdELENBQWhELENBQVQsQ0FBbEI7O0FBREYsNkNBRVdnQyxPQUZYO0FBR0kzQiw4QkFBWSxZQUFaLEVBQTBCMkIsT0FBMUIsSUFBbUNXLGtCQUFtQixLQUFLWCxPQUEzRDtBQUNBRSxrQ0FBZ0IxQyxPQUFoQixDQUF5QixVQUFDaUQsU0FBRDtBQUFBLDJCQUFlcEMsWUFBWSxRQUFaLEVBQXNCMkIsT0FBdEIsRUFBNkJTLFNBQTdCLElBQTBDcEMsWUFBWSxRQUFaLEVBQXNCMkIsT0FBdEIsRUFBNkJTLFNBQTdCLElBQTBDLENBQTFDLEdBQThDcEMsWUFBWSxZQUFaLEVBQTBCMkIsT0FBMUIsQ0FBOUMsR0FBaUYsQ0FBMUk7QUFBQSxtQkFBekI7QUFKSjs7QUFFRSxxQkFBSyxJQUFJQSxVQUFRLENBQWpCLEVBQW9CQSxVQUFRLENBQTVCLEVBQStCQSxTQUEvQixFQUF3QztBQUFBLHlCQUEvQkEsT0FBK0I7QUFHdkM7QUFDSDtBQUNBLG1CQUFLLHFCQUFMO0FBQ0VXLGtDQUFrQkwsU0FBUyxLQUFLWCxXQUFMLENBQWlCLGdCQUFqQixFQUFtQzNCLEtBQW5DLENBQXlDLEtBQXpDLEVBQWdELENBQWhELENBQVQsQ0FBbEI7O0FBREYsNkNBRVdnQyxPQUZYO0FBR0kzQiw4QkFBWSxZQUFaLEVBQTBCMkIsT0FBMUIsSUFBbUNXLGtCQUFrQixLQUFLWCxPQUExRDtBQUNBRSxrQ0FBZ0IxQyxPQUFoQixDQUF5QixVQUFDaUQsU0FBRDtBQUFBLDJCQUFlcEMsWUFBWSxRQUFaLEVBQXNCMkIsT0FBdEIsRUFBNkJTLFNBQTdCLElBQTBDcEMsWUFBWSxRQUFaLEVBQXNCMkIsT0FBdEIsRUFBNkJTLFNBQTdCLElBQTBDLENBQTFDLEdBQThDcEMsWUFBWSxZQUFaLEVBQTBCMkIsT0FBMUIsQ0FBOUMsR0FBaUYsQ0FBMUk7QUFBQSxtQkFBekI7QUFKSjs7QUFFRSxxQkFBSyxJQUFJQSxVQUFRLENBQWpCLEVBQW9CQSxVQUFRLENBQTVCLEVBQStCQSxTQUEvQixFQUF3QztBQUFBLHlCQUEvQkEsT0FBK0I7QUFHdkM7QUFDSDtBQUNBLG1CQUFLLGlCQUFMO0FBQ0VXLGtDQUFrQkwsU0FBUyxLQUFLWCxXQUFMLENBQWlCLGdCQUFqQixFQUFtQzNCLEtBQW5DLENBQXlDLEtBQXpDLEVBQWdELENBQWhELENBQVQsQ0FBbEI7O0FBREYsNkNBRVdnQyxPQUZYO0FBR0kzQiw4QkFBWSxZQUFaLEVBQTBCMkIsT0FBMUIsSUFBbUNXLGVBQW5DO0FBQ0FULGtDQUFnQjFDLE9BQWhCLENBQXlCLFVBQUNpRCxTQUFEO0FBQUEsMkJBQWVwQyxZQUFZLFFBQVosRUFBc0IyQixPQUF0QixFQUE2QlMsU0FBN0IsSUFBMENwQyxZQUFZLFFBQVosRUFBc0IyQixPQUF0QixFQUE2QlMsU0FBN0IsSUFBMEMsQ0FBMUMsR0FBOENwQyxZQUFZLFlBQVosRUFBMEIyQixPQUExQixDQUE5QyxHQUFpRixDQUExSTtBQUFBLG1CQUF6QjtBQUpKOztBQUVFLHFCQUFLLElBQUlBLFVBQVEsQ0FBakIsRUFBb0JBLFVBQVEsQ0FBNUIsRUFBK0JBLFNBQS9CLEVBQXdDO0FBQUEseUJBQS9CQSxPQUErQjtBQUd2QztBQUNIO0FBQ0EsbUJBQUssa0JBQUw7QUFDRSxvQkFBSWEsWUFBWSxLQUFLbEIsV0FBTCxDQUFpQixnQkFBakIsRUFBbUNhLFdBQW5DLENBQStDLEdBQS9DLENBQWhCO0FBQ0FLLDRCQUFZLEtBQUtsQixXQUFMLENBQWlCLGdCQUFqQixFQUFtQ1ksTUFBbkMsQ0FBMENNLFlBQVUsQ0FBcEQsQ0FBWjs7QUFGRiw2Q0FHV2IsT0FIWDtBQUlJRSxrQ0FBZ0IxQyxPQUFoQixDQUF5QixVQUFDaUQsU0FBRDtBQUFBLDJCQUFlcEMsWUFBWSxRQUFaLEVBQXNCMkIsT0FBdEIsRUFBNkJTLFNBQTdCLElBQTBDSSxVQUFVN0MsS0FBVixDQUFnQnlDLFNBQWhCLElBQTZCcEMsWUFBWSxZQUFaLEVBQTBCMkIsT0FBMUIsQ0FBN0IsR0FBZ0UsQ0FBekg7QUFBQSxtQkFBekI7QUFDQWEsOEJBQVlILGlCQUFpQkcsU0FBakIsQ0FBWjtBQUxKOztBQUdFLHFCQUFLLElBQUliLFVBQVEsQ0FBakIsRUFBb0JBLFVBQVEsQ0FBNUIsRUFBK0JBLFNBQS9CLEVBQXdDO0FBQUEseUJBQS9CQSxPQUErQjtBQUd2QztBQUNIO0FBQ0EsbUJBQUssZ0JBQUw7QUFDRSxvQkFBSWEsWUFBWSxLQUFLbEIsV0FBTCxDQUFpQixnQkFBakIsRUFBbUNhLFdBQW5DLENBQStDLEdBQS9DLENBQWhCO0FBQ0FLLDRCQUFZLEtBQUtsQixXQUFMLENBQWlCLGdCQUFqQixFQUFtQ1ksTUFBbkMsQ0FBMENNLFlBQVUsQ0FBcEQsQ0FBWjs7QUFGRiw2Q0FHV2IsT0FIWDtBQUlJRSxrQ0FBZ0IxQyxPQUFoQixDQUF5QixVQUFDaUQsU0FBRDtBQUFBLDJCQUFlcEMsWUFBWSxRQUFaLEVBQXNCMkIsT0FBdEIsRUFBNkJTLFNBQTdCLElBQTBDSSxVQUFVN0MsS0FBVixDQUFnQixZQUFZeUMsU0FBNUIsSUFBeUNwQyxZQUFZLFlBQVosRUFBMEIyQixPQUExQixDQUF6QyxHQUE0RSxDQUFySTtBQUFBLG1CQUF6QjtBQUNBLHNCQUFJYSxhQUFhLEdBQWpCLEVBQXNCeEMsWUFBWSxZQUFaLEVBQTBCMkIsT0FBMUIsSUFBbUMsQ0FBbkM7QUFMMUI7O0FBR0UscUJBQUssSUFBSUEsVUFBUSxDQUFqQixFQUFvQkEsVUFBUSxDQUE1QixFQUErQkEsU0FBL0IsRUFBd0M7QUFBQSx5QkFBL0JBLE9BQStCO0FBR3ZDO0FBQ0g7QUFyQ0Y7QUF3Q0QsV0ExQ0QsTUEwQ087QUFBRTs7QUFFUDtBQUNBLGdCQUFJLEVBQUUsS0FBS0wsV0FBTCxDQUFpQixnQkFBakIsS0FBc0MscUNBQXhDLENBQUosRUFBb0Y7QUFDbEYsa0JBQUksS0FBS0EsV0FBTCxDQUFpQixnQkFBakIsRUFBbUMzQixLQUFuQyxDQUF5QyxZQUF6QyxDQUFKLEVBQTREO0FBQzFESyw0QkFBWSxZQUFaLEVBQTBCLENBQTFCLElBQStCaUMsU0FBUyxLQUFLWCxXQUFMLENBQWlCLGdCQUFqQixFQUFtQzNCLEtBQW5DLENBQXlDLEtBQXpDLEVBQWdELENBQWhELENBQVQsQ0FBL0I7QUFDQWtDLGdDQUFnQjFDLE9BQWhCLENBQXlCLFVBQUNpRCxTQUFEO0FBQUEseUJBQWVwQyxZQUFZLFFBQVosRUFBc0IsQ0FBdEIsRUFBeUJvQyxTQUF6QixJQUFzQ3BDLFlBQVksUUFBWixFQUFzQixDQUF0QixFQUF5Qm9DLFNBQXpCLElBQXNDLENBQXRDLEdBQTBDcEMsWUFBWSxZQUFaLEVBQTBCLENBQTFCLENBQTFDLEdBQXlFLENBQTlIO0FBQUEsaUJBQXpCO0FBQ0QsZUFIRCxNQUdPLElBQUksS0FBS3NCLFdBQUwsQ0FBaUIsZ0JBQWpCLEVBQW1DM0IsS0FBbkMsQ0FBeUMsV0FBekMsQ0FBSixFQUEyRDtBQUNoRWtDLGdDQUFnQjFDLE9BQWhCLENBQXlCLFVBQUNpRCxTQUFEO0FBQUEseUJBQWVwQyxZQUFZLFFBQVosRUFBc0IsQ0FBdEIsRUFBeUJvQyxTQUF6QixJQUFzQyxPQUFLZCxXQUFMLENBQWlCLGdCQUFqQixFQUFtQzNCLEtBQW5DLENBQXlDLFlBQVl5QyxTQUFyRCxJQUFrRXBDLFlBQVksWUFBWixFQUEwQixDQUExQixDQUFsRSxHQUFpRyxDQUF0SjtBQUFBLGlCQUF6QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxnQkFBSSxFQUFFLEtBQUtzQixXQUFMLENBQWlCLGlCQUFqQixLQUF1QyxxQ0FBekMsSUFBa0YsRUFBRSxLQUFLQSxXQUFMLENBQWlCLG1CQUFqQixLQUF5QyxxQ0FBM0MsQ0FBdEYsRUFBeUs7QUFDdkssa0JBQUltQixvQkFBb0IsRUFBeEI7QUFDQSxzQkFBTyxLQUFLbkIsV0FBTCxDQUFpQixtQkFBakIsQ0FBUDtBQUNFLHFCQUFLLDJCQUFMO0FBQ0V0Qiw4QkFBWSxRQUFaLEVBQXNCLENBQXRCLElBQTJCQSxZQUFZLFFBQVosRUFBc0IsQ0FBdEIsQ0FBM0I7QUFDQUEsOEJBQVksWUFBWixFQUEwQixDQUExQixJQUErQkEsWUFBWSxZQUFaLEVBQTBCLENBQTFCLENBQS9CO0FBQ0F5QyxzQ0FBb0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFwQjtBQUNGO0FBQ0EscUJBQUssOEJBQUw7QUFDRSxzQkFBSXZDLFNBQVMsRUFBQyxZQUFZLEVBQWIsRUFBYjtBQUNBMkIsa0NBQWdCMUMsT0FBaEIsQ0FBd0IsVUFBQ2lELFNBQUQ7QUFBQSwyQkFBZWxDLE9BQU9rQyxTQUFQLElBQW9CLENBQW5DO0FBQUEsbUJBQXhCO0FBQ0FwQyw4QkFBWSxRQUFaLEVBQXNCLENBQXRCLElBQTJCRSxNQUEzQjtBQUNBRiw4QkFBWSxZQUFaLEVBQTBCLENBQTFCLElBQStCLENBQS9CO0FBQ0FBLDhCQUFZLFFBQVosRUFBc0IsQ0FBdEIsSUFBMkJBLFlBQVksUUFBWixFQUFzQixDQUF0QixDQUEzQjtBQUNBQSw4QkFBWSxZQUFaLEVBQTBCLENBQTFCLElBQStCQSxZQUFZLFlBQVosRUFBMEIsQ0FBMUIsQ0FBL0I7QUFDQXlDLHNDQUFvQixDQUFDLENBQUQsQ0FBcEI7QUFDRjtBQUNBLHFCQUFLLDJCQUFMO0FBQ0V6Qyw4QkFBWSxRQUFaLEVBQXNCLENBQXRCLElBQTJCQSxZQUFZLFFBQVosRUFBc0IsQ0FBdEIsQ0FBM0I7QUFDQUEsOEJBQVksWUFBWixFQUEwQixDQUExQixJQUErQkEsWUFBWSxZQUFaLEVBQTBCLENBQTFCLENBQS9CO0FBQ0F5QyxzQ0FBb0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFwQjtBQUNGO0FBbkJGOztBQXNCQSxrQkFBSSxLQUFLbkIsV0FBTCxDQUFpQixpQkFBakIsRUFBb0MzQixLQUFwQyxDQUEwQyxZQUExQyxDQUFKLEVBQTZEO0FBQzNESyw0QkFBWSxZQUFaLEVBQTBCeUMsa0JBQWtCLENBQWxCLENBQTFCLElBQWtEUixTQUFTLEtBQUtYLFdBQUwsQ0FBaUIsaUJBQWpCLEVBQW9DM0IsS0FBcEMsQ0FBMEMsS0FBMUMsRUFBaUQsQ0FBakQsQ0FBVCxDQUFsRDtBQUNBa0MsZ0NBQWdCMUMsT0FBaEIsQ0FBeUIsVUFBQ2lELFNBQUQ7QUFBQSx5QkFBZXBDLFlBQVksUUFBWixFQUFzQnlDLGtCQUFrQixDQUFsQixDQUF0QixFQUE0Q0wsU0FBNUMsSUFBeURwQyxZQUFZLFFBQVosRUFBc0J5QyxrQkFBa0IsQ0FBbEIsQ0FBdEIsRUFBNENMLFNBQTVDLElBQXlELENBQXpELEdBQTZEcEMsWUFBWSxZQUFaLEVBQTBCeUMsa0JBQWtCLENBQWxCLENBQTFCLENBQTdELEdBQStHLENBQXZMO0FBQUEsaUJBQXpCO0FBQ0QsZUFIRCxNQUdPLElBQUksS0FBS25CLFdBQUwsQ0FBaUIsaUJBQWpCLEVBQW9DM0IsS0FBcEMsQ0FBMEMsV0FBMUMsQ0FBSixFQUE0RDtBQUNqRWtDLGdDQUFnQjFDLE9BQWhCLENBQXlCLFVBQUNpRCxTQUFEO0FBQUEseUJBQWVwQyxZQUFZLFFBQVosRUFBc0J5QyxrQkFBa0IsQ0FBbEIsQ0FBdEIsRUFBNENMLFNBQTVDLElBQXlELE9BQUtkLFdBQUwsQ0FBaUIsaUJBQWpCLEVBQW9DM0IsS0FBcEMsQ0FBMEMsWUFBWXlDLFNBQXRELElBQW1FcEMsWUFBWSxZQUFaLEVBQTBCeUMsa0JBQWtCLENBQWxCLENBQTFCLENBQW5FLEdBQXFILENBQTdMO0FBQUEsaUJBQXpCO0FBQ0Q7O0FBRUQsa0JBQUlBLGtCQUFrQkMsTUFBbEIsR0FBMkIsQ0FBL0IsRUFBa0M7QUFDaEMxQyw0QkFBWSxRQUFaLEVBQXNCeUMsa0JBQWtCLENBQWxCLENBQXRCLElBQThDekMsWUFBWSxRQUFaLEVBQXNCeUMsa0JBQWtCLENBQWxCLENBQXRCLENBQTlDO0FBQ0F6Qyw0QkFBWSxZQUFaLEVBQTBCeUMsa0JBQWtCLENBQWxCLENBQTFCLElBQWtEekMsWUFBWSxZQUFaLEVBQTBCeUMsa0JBQWtCLENBQWxCLENBQTFCLENBQWxEO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFDRCxlQUFPekMsV0FBUDtBQUNEO0FBdldIO0FBQUE7QUFBQSx1Q0F5V21CMkMsR0F6V25CLEVBeVd3QjtBQUFBOztBQUNwQixZQUFJQSxJQUFJdkMsSUFBSixDQUFTaEIsS0FBVCxDQUFlTCxNQUFmLENBQXNCQyxLQUF0QixDQUE0Qm5CLEVBQTVCLElBQWtDLGNBQXRDLEVBQXNEO0FBQ3BELGVBQUtrQixNQUFMLENBQVlDLEtBQVosQ0FBa0JDLE9BQWxCLENBQTBCQyxPQUExQixDQUFrQ0MsT0FBbEMsQ0FBMEMsVUFBQ0MsS0FBRCxFQUFPQyxLQUFQLEVBQWlCO0FBQ3pELGdCQUFJRCxNQUFNdkIsRUFBTixNQUFjLGNBQWxCLEVBQWlDO0FBQy9CdUIsb0JBQU13RCxlQUFOLENBQXNCRCxJQUFJdkMsSUFBSixDQUFTeUMsS0FBVCxDQUFldEIsS0FBZixDQUFxQjVCLEtBQXJCLENBQTJCLGdCQUEzQixJQUErQyxnQkFBL0MsR0FBa0VnRCxJQUFJdkMsSUFBSixDQUFTeUMsS0FBVCxDQUFldEIsS0FBdkc7QUFDQSxrQkFBSSxPQUFLWixLQUFMLElBQWMsS0FBbEIsRUFBeUI7QUFDdkJ2QixzQkFBTXlCLE9BQU47QUFDQXpCLHNCQUFNc0IsYUFBTixDQUFvQixRQUFwQixFQUE2QixDQUE3QjtBQUNBdEIsc0JBQU0rQixVQUFOO0FBQ0Q7O0FBRUQscUJBQUsyQixjQUFMLENBQW9CMUQsS0FBcEIsRUFBMkJ1RCxJQUFJdkMsSUFBSixDQUFTeUMsS0FBVCxDQUFldEIsS0FBMUM7QUFFRCxhQVZELE1BVU87QUFBRTtBQUNQbkMsb0JBQU13RCxlQUFOO0FBQ0Q7QUFDRixXQWREOztBQWdCQSxlQUFLbEUsVUFBTCxHQUFrQix1QkFBbEI7QUFFRCxTQW5CRCxNQW1CTyxJQUFJaUUsSUFBSXZDLElBQUosQ0FBU2hCLEtBQVQsQ0FBZUwsTUFBZixDQUFzQkMsS0FBdEIsQ0FBNEJuQixFQUE1QixJQUFrQyxlQUF0QyxFQUF1RDtBQUFFOztBQUU1RDtBQUNBLGNBQUlrRixtQkFBbUIsS0FBS0MsVUFBTCxDQUFnQixnQkFBaEIsQ0FBdkI7QUFDQSxrQkFBUUwsSUFBSXZDLElBQUosQ0FBU3lDLEtBQVQsQ0FBZXRCLEtBQXZCO0FBQ0UsaUJBQUsscUJBQUw7QUFDRSxtQkFBS3VCLGNBQUwsQ0FBb0JDLGdCQUFwQixFQUFzQyxnQkFBdEM7QUFDQSxtQkFBS3JFLFVBQUwsR0FBa0IsMEJBQWxCO0FBQ0Y7QUFDQSxpQkFBSyxxQkFBTDtBQUNFLG1CQUFLb0UsY0FBTCxDQUFvQkMsZ0JBQXBCLEVBQXNDLGVBQXRDO0FBQ0EsbUJBQUtyRSxVQUFMLEdBQWtCLDBCQUFsQjtBQUNGO0FBQ0EsaUJBQUssa0JBQUw7QUFDRSxtQkFBS29FLGNBQUwsQ0FBb0JDLGdCQUFwQixFQUFzQyxnQkFBdEM7QUFDQSxtQkFBS3JFLFVBQUwsR0FBa0IsMEJBQWxCO0FBQ0Y7QUFDQSxpQkFBSyxzQkFBTDtBQUNFLG1CQUFLb0UsY0FBTCxDQUFvQkMsZ0JBQXBCLEVBQXNDLFlBQXRDO0FBQ0EsbUJBQUtyRSxVQUFMLEdBQWtCLHVCQUFsQjtBQUNGO0FBQ0EsaUJBQUssaUJBQUw7QUFDRSxtQkFBS29FLGNBQUwsQ0FBb0JDLGdCQUFwQixFQUFxQyxZQUFyQztBQUNBLG1CQUFLckUsVUFBTCxHQUFrQiwwQkFBbEI7QUFDRjtBQUNBLGlCQUFLLHFCQUFMO0FBQ0UsbUJBQUtvRSxjQUFMLENBQW9CQyxnQkFBcEIsRUFBc0MsV0FBdEMsRUFBbUQsVUFBbkQ7QUFDQSxtQkFBS3JFLFVBQUwsR0FBa0IsdUJBQWxCO0FBQ0Y7QUFDQSxpQkFBSyxnQkFBTDtBQUNFLG1CQUFLb0UsY0FBTCxDQUFvQkMsZ0JBQXBCLEVBQXNDLFdBQXRDLEVBQW1ELFVBQW5EO0FBQ0EsbUJBQUtyRSxVQUFMLEdBQWtCLDBCQUFsQjtBQUNGO0FBNUJGOztBQStCQTtBQUNBLGVBQUtLLE1BQUwsQ0FBWUMsS0FBWixDQUFrQkMsT0FBbEIsQ0FBMEJDLE9BQTFCLENBQWtDQyxPQUFsQyxDQUEwQyxVQUFDQyxLQUFELEVBQU9DLEtBQVAsRUFBaUI7QUFDekQsZ0JBQUlELE1BQU12QixFQUFOLE1BQWMsY0FBZCxHQUErQnVCLE1BQU12QixFQUFOLE1BQWMsZUFBN0MsR0FBK0QsT0FBSzhDLEtBQUwsSUFBYyxLQUFqRixFQUF3RjtBQUN0RnZCLG9CQUFNeUIsT0FBTjtBQUNBekIsb0JBQU1zQixhQUFOLENBQW9CLFFBQXBCLEVBQTZCLENBQTdCO0FBQ0F0QixvQkFBTStCLFVBQU47QUFDRDtBQUNGLFdBTkQ7QUFPSDtBQUNEO0FBQ0EsWUFBSThCLFlBQVksS0FBS0QsVUFBTCxDQUFnQixLQUFLdkUsaUJBQUwsQ0FBdUIsS0FBS0MsVUFBNUIsRUFBd0NpRSxJQUFJdkMsSUFBSixDQUFTaEIsS0FBVCxDQUFlTCxNQUFmLENBQXNCQyxLQUF0QixDQUE0Qm5CLEVBQXBFLENBQWhCLENBQWhCO0FBQ0EsWUFBSW9GLFlBQVksQ0FBQ0EsVUFBVUMsU0FBVixFQUFiLEdBQXFDLEtBQXpDLEVBQWdEO0FBQzVDRCxvQkFBVXZDLGFBQVYsQ0FBd0IsU0FBeEI7QUFDQXVDLG9CQUFVL0IsTUFBVjs7QUFFQSxjQUFJaUMsZ0JBQWdCLEtBQUtILFVBQUwsQ0FBZ0IsS0FBS3ZFLGlCQUFMLENBQXVCLEtBQUtDLFVBQTVCLEVBQXdDdUUsVUFBVXBGLEVBQVYsRUFBeEMsQ0FBaEIsQ0FBcEI7QUFDQSxjQUFJc0YsYUFBSixFQUFtQjtBQUFDQSwwQkFBY3pDLGFBQWQsQ0FBNEIsUUFBNUIsRUFBcUMsR0FBckM7QUFBMEM7QUFDakU7QUFDRjtBQWxiSDtBQUFBO0FBQUEsaUNBb2JhMEMsT0FwYmIsRUFvYnNCO0FBQ2xCLFlBQUloRSxRQUFRLElBQVo7QUFDQSxhQUFLLElBQUlpRSxPQUFPLENBQWhCLEVBQW1CQSxPQUFLLEtBQUt0RSxNQUFMLENBQVlDLEtBQVosQ0FBa0JDLE9BQWxCLENBQTBCQyxPQUExQixDQUFrQ3dELE1BQTFELEVBQWtFVyxNQUFsRSxFQUEwRTtBQUN4RSxjQUFJLEtBQUt0RSxNQUFMLENBQVlDLEtBQVosQ0FBa0JDLE9BQWxCLENBQTBCQyxPQUExQixDQUFrQ21FLElBQWxDLEVBQXdDeEYsRUFBeEMsTUFBOEN1RixPQUFsRCxFQUEyRDtBQUN6RGhFLG9CQUFRLEtBQUtMLE1BQUwsQ0FBWUMsS0FBWixDQUFrQkMsT0FBbEIsQ0FBMEJDLE9BQTFCLENBQWtDbUUsSUFBbEMsQ0FBUjtBQUNBO0FBQ0Q7QUFDRjtBQUNELGVBQU9qRSxLQUFQO0FBQ0Q7QUE3Ykg7QUFBQTtBQUFBLHFDQStiaUJBLEtBL2JqQixFQStid0JrRSxRQS9ieEIsRUErYjhEO0FBQUEsWUFBNUJDLG1CQUE0Qix1RUFBTixJQUFNOztBQUMxREMsZUFBT0MsSUFBUCxDQUFZckUsTUFBTXNFLFVBQU4sRUFBWixFQUFnQ3ZFLE9BQWhDLENBQXdDLFVBQUN3RSxNQUFELEVBQVk7QUFDbEQsY0FBSSxDQUFDQSxPQUFPaEUsS0FBUCxDQUFhNEQsbUJBQWIsS0FBcUMsQ0FBQ0ksT0FBT2hFLEtBQVAsQ0FBYTJELFFBQWIsQ0FBdkMsS0FBa0UsQ0FBQ0ssT0FBT2hFLEtBQVAsQ0FBYSxxQ0FBYixDQUF2RSxFQUE0SDtBQUMxSFAsa0JBQU13RSxhQUFOLENBQW9CRCxNQUFwQjtBQUNELFdBRkQsTUFFTztBQUNMdkUsa0JBQU15RSxZQUFOLENBQW1CRixNQUFuQjtBQUNEO0FBQ0YsU0FORDtBQVFEO0FBeGNIOztBQUFBO0FBQUEsSUFBb0NwRyxJQUFwQztBQTBjRCxDQWxkRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L2Zvcm1fbmFycmF0aXZlL2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyksXG4gICAgRXhwUHJvdG9jb2wgPSByZXF1aXJlKCcuL2V4cHByb3RvY29sL2ZpZWxkJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIEV4cGVyaW1lbnRGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBjb25zdCBidXR0b25zID0gW0J1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3N1Ym1pdCcsXG4gICAgICAgIGxhYmVsOiAnU3VibWl0JyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19zdWJtaXQnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5TdWJtaXQnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnYWdncmVnYXRlJyxcbiAgICAgICAgbGFiZWw6ICdBZGQgUmVzdWx0cyB0byBBZ2dyZWdhdGUnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX2FnZ3JlZ2F0ZSddLFxuICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50LkFkZFRvQWdncmVnYXRlJ1xuICAgICAgfSldO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHtcbiAgICAgICAgYnV0dG9ucy5zcGxpY2UoMiwgMCwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICduZXcnLFxuICAgICAgICAgIGxhYmVsOiAnTmV3IEV4cGVyaW1lbnQnLFxuICAgICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fbmV3J10sXG4gICAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5OZXdSZXF1ZXN0J1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHN1cGVyKHtcbiAgICAgICAgbW9kZWxEYXRhOiB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGNsYXNzZXM6IFtcImZvcm1fX2V4cGVyaW1lbnRcIl0sXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiMS4gVmFyaWFibGUgdG8gYmUgY2hhbmdlZDpcIixcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzJzogJ0JyaWdodG5lc3Mgb2YgdGhlIGxpZ2h0JywgJ2RpcmVjdGlvbic6ICdEaXJlY3Rpb24gb2YgdGhlIGxpZ2h0J30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9wcm9jZWR1cmVcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnMi4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjIuIFByb2NlZHVyZSBmb3IgY2hhbmdpbmcgdGhlIGJyaWdodG5lc3M6XCIsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb24nOiBcIjIuIFByb2NlZHVyZSBmb3IgY2hhbmdpbmcgdGhlIGRpcmVjdGlvbjpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6ICdHcmFkdWFsbHkgaW5jcmVhc2UgdGhlIGJyaWdodG5lc3MnLCAnYnJpZ2h0bmVzc19kZWNyZWFzZSc6ICdHcmFkdWFsbHkgZGVjcmVhc2UgdGhlIGJyaWdodG5lc3MnLFxuICAgICAgICAgICAgICAnYnJpZ2h0bmVzc19ob2xkJzogJ0tlZXAgb25lIGxldmVsIG9mIGJyaWdodG5lc3MnLCAnYnJpZ2h0bmVzc19hbHRlcm5hdGUnOiAnQWx0ZXJuYXRlIGJldHdlZW4gdHdvIGxldmVscycsICdkaXJlY3Rpb25fYXJvdW5kJzogJ01ha2UgdGhlIGxpZ2h0IGdvIGFyb3VuZCcsICdkaXJlY3Rpb25faG9sZCc6ICdLZWVwIG9uZSBkaXJlY3Rpb24nLCAnZGlyZWN0aW9uX2FsdGVybmF0ZSc6ICdBbHRlcm5hdGUgYmV0d2VlbiB0d28gZGlyZWN0aW9ucyd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfaG9sZGNvbnN0YW50XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzMuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCIzLiBGaXggdGhlIGRpcmVjdGlvbiBvZiBsaWdodCB0bzpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiMy4gRml4IHRoZSBicmlnaHRuZXNzIG9mIGxpZ2h0IHRvOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fMjUnOiAnZGltJywgJ2RpcmVjdGlvbl81MCc6ICdtZWRpdW0nLCAnZGlyZWN0aW9uXzEwMCc6ICdicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JyaWdodG5lc3NfYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnYnJpZ2h0bmVzc19sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnYnJpZ2h0bmVzc190b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2JyaWdodG5lc3NfcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCdicmlnaHRuZXNzX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2ZpcnN0bGlnaHRcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnNC4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjQuIEJyaWdodG5lc3Mgc2V0dGluZyAxOlwiLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uJzogXCI0LiBEaXJlY3Rpb24gc2V0dGluZyAxOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fYnJpZ2h0bmVzc18wJzogJ25vIGxpZ2h0JywgJ2JyaWdodG5lc3NfMjUnOiAnZGltJywgJ2JyaWdodG5lc3NfNTAnOiAnbWVkaXVtJywgJ2JyaWdodG5lc3NfMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX2FsbGRpcic6ICdmcm9tIGFsbCBkaXJlY3Rpb25zJywgJ2RpcmVjdGlvbl9sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnZGlyZWN0aW9uX3RvcGxlZnQnOiAnZnJvbSB0aGUgdG9wLWxlZnQnLCAnZGlyZWN0aW9uX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnZGlyZWN0aW9uX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywgJ2RpcmVjdGlvbl9ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9zZWNvbmRsaWdodFwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc1LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNS4gQnJpZ2h0bmVzcyBzZXR0aW5nIDI6XCIsICdkaXJlY3Rpb24nOiBcIjUuIERpcmVjdGlvbiBzZXR0aW5nIDI6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2xpZ2h0ZHVyYXRpb25cIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnNi4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjYuIFRpbWUgcGVyIHNldHRpbmc6XCIsICdkaXJlY3Rpb24nOiBcIjYuIFRpbWUgcGVyIHNldHRpbmc6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b24nOiAnYWx0ZXJuYXRlIDE1IHNlY29uZHMgb24nLCAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMzBvbic6ICdlYWNoIDMwIHNlY29uZHMgb24nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXSxcbiAgICAgICAgICBidXR0b25zOiBidXR0b25zXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuY2hhaW5PZkFjdGl2YXRpb24gPSB7XG4gICAgICAgICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nOiB7XCJleHBfY2F0ZWdvcnlcIjogXCJleHBfcHJvY2VkdXJlXCIsIFwiZXhwX3Byb2NlZHVyZVwiOiBcImV4cF9ob2xkY29uc3RhbnRcIiwgXCJleHBfaG9sZGNvbnN0YW50XCI6IFwiZXhwX2ZpcnN0bGlnaHRcIiwgXCJleHBfZmlyc3RsaWdodFwiOiBcImV4cF9zZWNvbmRsaWdodFwiLCBcImV4cF9zZWNvbmRsaWdodFwiOiBcImV4cF9saWdodGR1cmF0aW9uXCJ9LFxuICAgICAgICAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJzoge1wiZXhwX2NhdGVnb3J5XCI6IFwiZXhwX3Byb2NlZHVyZVwiLCBcImV4cF9wcm9jZWR1cmVcIjogXCJleHBfaG9sZGNvbnN0YW50XCIsIFwiZXhwX2hvbGRjb25zdGFudFwiOiBcImV4cF9maXJzdGxpZ2h0XCJ9XG4gICAgICB9O1xuICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG5cbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX3VwZGF0ZUZvcm1WaWV3cycsJ3NldFN0YXRlJywgJ3ZhbGlkYXRlJywgJ2dldExpZ2h0Q29uZmlndXJhdGlvbiddKVxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX3VwZGF0ZUZvcm1WaWV3cylcbiAgICAgIHRoaXMuc2V0U3RhdGUoJ25ldycpO1xuICAgIH1cblxuXG4gICAgdmFsaWRhdGUoKSB7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5jaGFpblN0YXRlKSB7XG4gICAgICAgIGNhc2UgJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic6XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBmaWVsZC51cGRhdGVWYWxpZGF0aW9uKHtjdXN0b206IHtcbiAgICAgICAgICAgICAgdGVzdDogJ2N1c3RvbScsXG4gICAgICAgICAgICAgIGZuOiAodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbC5tYXRjaCgnZGVmYXVsdCcpKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKSB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJZb3UgaGF2ZSB0byBjaG9vc2UgdmFsaWQgb3B0aW9ucyBmb3IgdGhlIFwiICsgKDEgKyBpbmRleCkgKyBcInRoIGZpZWxkLlwiXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic6XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSAhPSAnZXhwX3NlY29uZGxpZ2h0JyAmIGZpZWxkLmlkKCkgIT0gJ2V4cF9saWdodGR1cmF0aW9uJykge1xuICAgICAgICAgICAgICBmaWVsZC51cGRhdGVWYWxpZGF0aW9uKHtjdXN0b206IHtcbiAgICAgICAgICAgICAgICB0ZXN0OiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgICBmbjogKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHZhbC5tYXRjaCgnZGVmYXVsdCcpKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpIH1cbiAgICAgICAgICAgICAgICAgIGVsc2UgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJZb3UgaGF2ZSB0byBjaG9vc2UgdmFsaWQgb3B0aW9ucyBmb3IgdGhlIFwiICsgKDEgKyBpbmRleCkgKyBcInRoIGZpZWxkLlwiXG4gICAgICAgICAgICAgIH19KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZmllbGQudXBkYXRlVmFsaWRhdGlvbih7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwudmFsaWRhdGUoKTtcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICB2YXIgbGlnaHRDb25maWcgPSB0aGlzLmdldExpZ2h0Q29uZmlndXJhdGlvbigpO1xuICAgICAgcmV0dXJuIHtsaWdodHM6IGxpZ2h0Q29uZmlnWydsaWdodHMnXSwgZXhwRm9ybTogc3VwZXIuZXhwb3J0KCl9O1xuICAgIH1cblxuICAgIGltcG9ydChkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbGVhcigpLnRoZW4oKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiB0aGlzLl9tb2RlbC5nZXRGaWVsZHMoKSkge1xuICAgICAgICAgIGlmIChkYXRhW2ZpZWxkLmlkKCldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpZWxkLnNldFZhbHVlKGRhdGFbZmllbGQuaWQoKV0pO1xuICAgICAgICAgICAgaWYgKGRhdGFbZmllbGQuaWQoKV0gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykge1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICBjYXNlIFwiaGlzdG9yaWNhbFwiOlxuICAgICAgICAgIHRoaXMuc3RhdGUgPSAnaGlzdG9yaWNhbCdcbiAgICAgICAgICBzd2l0Y2ggKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLnNob3coKTt9XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmFnZ3JlZ2F0ZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJuZXdcIjpcbiAgICAgICAgICB0aGlzLnN0YXRlID0gJ25ldyc7XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSA9PSAnZXhwX2NhdGVnb3J5Jykge1xuICAgICAgICAgICAgICBmaWVsZC5lbmFibGUoKVxuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZGlzYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGlnaHRDb25maWd1cmF0aW9uKCkge1xuICAgICAgLy8gVHJhbnNsYXRlIGZpZWxkcyBpbnRvIFt7XCJsZWZ0XCI6IDEwMCwgXCJyaWdodFwiOiAwLCBcInRvcFwiOiAwLCBcImJvdHRvbVwiOiAxMDAsIFwiZHVyYXRpb25cIjogMTV9LCAuLi5dXG4gICAgICBsZXQgZGVmYXVsdENvdW50ZXIgPSAwO1xuICAgICAgdGhpcy5leHBQcm90b2NvbCA9IHt9XG4gICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgdGhpcy5leHBQcm90b2NvbFtmaWVsZC5pZCgpXSA9IGZpZWxkLnZhbHVlKClcbiAgICAgICAgZGVmYXVsdENvdW50ZXIgPSBmaWVsZC52YWx1ZSgpID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc/IGRlZmF1bHRDb3VudGVyICsgMSA6IGRlZmF1bHRDb3VudGVyO1xuICAgICAgfSlcblxuICAgICAgbGV0IGNvbmZpZ1N0YXRlID0gZmFsc2U7XG4gICAgICBpZiAoZGVmYXVsdENvdW50ZXIgPCAzKSB7IGNvbmZpZ1N0YXRlID0gdHJ1ZTsgfVxuXG4gICAgICB2YXIgbGlnaHRDb25maWcgPSB7fVxuICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXSA9IEFycmF5KDQpLmZpbGwoLTEpO1xuICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddID0gW107XG4gICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykgeyBsaWdodENvbmZpZ1snbGlnaHRzJ10ucHVzaCh7J2xlZnQnOiAwLCAndG9wJzogMCwgJ3JpZ2h0JzogMCwgJ2JvdHRvbSc6IDAsICdkdXJhdGlvbic6IDE1fSkgfVxuXG4gICAgICBpZiAoY29uZmlnU3RhdGUpIHtcbiAgICAgICAgdmFyIGxpZ2h0RGlyZWN0aW9ucyA9IFsnbGVmdCcsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJ107XG5cbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgZml4ZWQgdmFsdWVcbiAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSB7Y29uc29sZS5sb2coJ3RoZXJlIGlzIGEgcHJvYmxlbScpfVxuICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKCdkaXJlY3Rpb24nKSkge1xuICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ10gPSBBcnJheSg0KS5maWxsKCkubWFwKGZ1bmN0aW9uKCkgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKC9cXGQrLylbMF0pIH0sdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICBsZXQgc3Vic3RyID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgc3Vic3RyID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLnN1YnN0cihzdWJzdHIrMSk7XG4gICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBzdWJzdHIubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IDEwMCA6IDAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb2RpZnkgYWxsIHBhbmVsc1xuICAgICAgICB2YXIgbGlnaHRTdWNjZXNzaW9ucyA9IHsnbGVmdCc6ICd0b3AnLCAndG9wJzogJ3JpZ2h0JywgJ3JpZ2h0JzogJ2JvdHRvbScsICdib3R0b20nOiAnbGVmdCcsICd0b3BsZWZ0JzogJ3RvcHJpZ2h0JywgJ3RvcHJpZ2h0JzogJ2JvdHRvbXJpZ2h0JywgJ2JvdHRvbXJpZ2h0JzogJ2JvdHRvbWxlZnQnLCAnYm90dG9tbGVmdCc6ICd0b3BsZWZ0J307XG4gICAgICAgIHZhciBmaXJzdEJyaWdodG5lc3MgPSBudWxsO1xuICAgICAgICB2YXIgc2Vjb25kQnJpZ2h0bmVzcyA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuY2hhaW5TdGF0ZSA9PSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJyAmICEodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXSA9PSdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG5cbiAgICAgICAgICBzd2l0Y2ggKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9wcm9jZWR1cmUnXSkge1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3MgICsgMjUgKiBwYW5lbDtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGVjcmVhc2UnOlxuICAgICAgICAgICAgICBmaXJzdEJyaWdodG5lc3MgPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gZmlyc3RCcmlnaHRuZXNzIC0gMjUgKiBwYW5lbDtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaG9sZCc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3M7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fYXJvdW5kJzpcbiAgICAgICAgICAgICAgdmFyIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5zdWJzdHIoY3VyckxpZ2h0KzEpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBjdXJyTGlnaHQubWF0Y2goZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICAgIGN1cnJMaWdodCA9IGxpZ2h0U3VjY2Vzc2lvbnNbY3VyckxpZ2h0XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25faG9sZCc6XG4gICAgICAgICAgICAgIHZhciBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgICAgIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10uc3Vic3RyKGN1cnJMaWdodCsxKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gY3VyckxpZ2h0Lm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyckxpZ2h0ID09ICcwJykgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgeyAvLyBpZiBpcyBhbHRlcm5hdGluZ1xuXG4gICAgICAgICAgLy8gTW9kaWZ5IHRoZSBmaXJzdCBwYW5lbFxuICAgICAgICAgIGlmICghKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXSA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF0gOiAwICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goJ2RpcmVjdGlvbicpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1bZGlyZWN0aW9uXSA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF0gOiAwICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTW9kaWZ5IHRoZSByZW1haW5pbmcgcGFuZWxzXG4gICAgICAgICAgaWYgKCEodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykgJiAhKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9saWdodGR1cmF0aW9uJ10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICAgIHZhciBtb2RpZnlTZWNvbmRMaWdodCA9IFtdO1xuICAgICAgICAgICAgc3dpdGNoKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9saWdodGR1cmF0aW9uJ10pIHtcbiAgICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbic6XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzJdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsyXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF1cbiAgICAgICAgICAgICAgICBtb2RpZnlTZWNvbmRMaWdodCA9IFsxLDNdXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RpcmVjdGlvbl8xNW9ub2ZmJzpcbiAgICAgICAgICAgICAgICBsZXQgbGlnaHRzID0geydkdXJhdGlvbic6IDE1fTtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiBsaWdodHNbZGlyZWN0aW9uXSA9IDApO1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVsxXSA9IGxpZ2h0c1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV0gPSAwXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzNdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVszXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV1cbiAgICAgICAgICAgICAgICBtb2RpZnlTZWNvbmRMaWdodCA9IFsyXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMzBvbic6XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdO1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV0gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMiwzXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV0gPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKVxuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dIDogMCApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnZGlyZWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXSA6IDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1vZGlmeVNlY29uZExpZ2h0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzFdXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV07XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMV1dID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsaWdodENvbmZpZ1xuICAgIH1cblxuICAgIF91cGRhdGVGb3JtVmlld3MoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdleHBfY2F0ZWdvcnknKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfY2F0ZWdvcnknKXtcbiAgICAgICAgICAgIGZpZWxkLnNob3dEZXNjcmlwdGlvbihldnQuZGF0YS5kZWx0YS52YWx1ZS5tYXRjaCgnZGVmYXVsdF9jaG9pY2UnKSA/ICdkZWZhdWx0X2Nob2ljZScgOiBldnQuZGF0YS5kZWx0YS52YWx1ZSlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlID09ICduZXcnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkLCBldnQuZGF0YS5kZWx0YS52YWx1ZSlcblxuICAgICAgICAgIH0gZWxzZSB7IC8vIGlmIGl0IGlzIGV4cF9jYXRlZ29yeVxuICAgICAgICAgICAgZmllbGQuc2hvd0Rlc2NyaXB0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcblxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWQgPT0gJ2V4cF9wcm9jZWR1cmUnKSB7IC8vIFRoZSBjaG9zZW4gcHJvY2VkdXJlIGRldGVybWluZXMgd2hhdCBmaWVsZHMgdG8gc2hvd1xuXG4gICAgICAgICAgLy9EaXNhYmxlIG9wdGlvbnMgb2YgZXhwX2ZpcnN0bGlnaHQgZGVwZW5kaW5nIG9uIHdoYXQgaGFzIGJlZW4gY2hvc2VcbiAgICAgICAgICB2YXIgZmllbGRfZmlyc3RsaWdodCA9IHRoaXMuX2ZpbmRGaWVsZCgnZXhwX2ZpcnN0bGlnaHQnKTtcbiAgICAgICAgICBzd2l0Y2ggKGV2dC5kYXRhLmRlbHRhLnZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RlY3JlYXNlJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnYnJpZ2h0bmVzc18xMDAnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaW5jcmVhc2UnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzXzI1Jyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fYXJvdW5kJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnX2xlZnR8X3RvcGxlZnQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfYWx0ZXJuYXRlJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnYnJpZ2h0bmVzcycpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19ob2xkJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCdicmlnaHRuZXNzJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fYWx0ZXJuYXRlJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnZGlyZWN0aW9uJywgJ190b3BsZWZ0Jyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25faG9sZCc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2RpcmVjdGlvbicsICdfdG9wbGVmdCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlLWluaXRpYWxpemUgc3VjY2Vzc2l2ZSBmaWVsZHNcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfY2F0ZWdvcnknICYgZmllbGQuaWQoKSAhPSAnZXhwX3Byb2NlZHVyZScgJiB0aGlzLnN0YXRlID09ICduZXcnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gSXMgdGhlIG5leHQgZmllbGQgYWN0aXZhdGVkP1xuICAgICAgdmFyIG5leHRGaWVsZCA9IHRoaXMuX2ZpbmRGaWVsZCh0aGlzLmNoYWluT2ZBY3RpdmF0aW9uW3RoaXMuY2hhaW5TdGF0ZV1bZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkXSk7XG4gICAgICBpZiAobmV4dEZpZWxkID8gIW5leHRGaWVsZC5pc1Zpc2libGUoKSA6IGZhbHNlKSB7XG4gICAgICAgICAgbmV4dEZpZWxkLnNldFZpc2liaWxpdHkoJ3Zpc2libGUnKTtcbiAgICAgICAgICBuZXh0RmllbGQuZW5hYmxlKCk7XG5cbiAgICAgICAgICB2YXIgbmV4dG5leHRGaWVsZCA9IHRoaXMuX2ZpbmRGaWVsZCh0aGlzLmNoYWluT2ZBY3RpdmF0aW9uW3RoaXMuY2hhaW5TdGF0ZV1bbmV4dEZpZWxkLmlkKCldKTtcbiAgICAgICAgICBpZiAobmV4dG5leHRGaWVsZCkge25leHRuZXh0RmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwLjMpfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9maW5kRmllbGQoZmllbGRJZCkge1xuICAgICAgdmFyIGZpZWxkID0gbnVsbDtcbiAgICAgIGZvciAodmFyIGNudHIgPSAwOyBjbnRyPHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5sZW5ndGg7IGNudHIrKykge1xuICAgICAgICBpZiAodGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0W2NudHJdLmlkKCk9PWZpZWxkSWQpIHtcbiAgICAgICAgICBmaWVsZCA9IHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdFtjbnRyXVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRcbiAgICB9XG5cbiAgICBfbW9kaWZ5T3B0aW9ucyhmaWVsZCwgY3JpdGVyaWEsIGFkZGl0aW9uYWxseURpc2FibGUgPSBudWxsKSB7XG4gICAgICBPYmplY3Qua2V5cyhmaWVsZC5nZXRPcHRpb25zKCkpLmZvckVhY2goKGNob2ljZSkgPT4ge1xuICAgICAgICBpZiAoKGNob2ljZS5tYXRjaChhZGRpdGlvbmFsbHlEaXNhYmxlKSB8fCAhY2hvaWNlLm1hdGNoKGNyaXRlcmlhKSkgJiYgIWNob2ljZS5tYXRjaCgnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuICAgICAgICAgIGZpZWxkLmRpc2FibGVPcHRpb24oY2hvaWNlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpZWxkLmVuYWJsZU9wdGlvbihjaG9pY2UpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfVxuICB9XG59KVxuIl19
