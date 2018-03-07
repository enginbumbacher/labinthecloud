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
            options: { 'direction_brightness_default_choice': 'please choose one', 'direction_25': 'dim', 'direction_50': 'medium', 'direction_75': 'bright', 'direction_100': 'very bright',
              'brightness_alldir': 'from all directions', 'brightness_left': 'from the left', 'brightness_top': 'from the top', 'brightness_right': 'from the right', 'brightness_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_firstlight",
            description: { 'default_choice': '4. Decide on the previous questions first.', 'brightness': "4. Brightness setting 1:",
              'direction': "4. Direction setting 1:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_75': 'bright', 'brightness_100': 'very bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_topleft': 'from the top-left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_secondlight",
            description: { 'default_choice': '5. Decide on the previous questions first.', 'brightness': "5. Brightness setting 2:", 'direction': "5. Direction setting 2:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_75': 'bright', 'brightness_100': 'very bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_lightduration",
            description: { 'default_choice': '6. Decide on the previous questions first.', 'brightness': "6. Time per setting:", 'direction': "6. Time per setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness_direction_15on': 'alternate 15 seconds on', 'brightness_direction_30on': '30 seconds on' },
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
              this._modifyOptions(field_firstlight, 'brightness_75|brightness_100');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'brightness_increase':
              this._modifyOptions(field_firstlight, 'direction_brightness_0|brightness_25');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkZvcm0iLCJCdXR0b24iLCJFeHBQcm90b2NvbCIsIlV0aWxzIiwiYnV0dG9ucyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiZ2V0Iiwic3BsaWNlIiwibW9kZWxEYXRhIiwiZmllbGRzIiwiZGVzY3JpcHRpb24iLCJkZWZhdWx0VmFsdWUiLCJvcHRpb25zIiwidmFsaWRhdGlvbiIsImNoYWluT2ZBY3RpdmF0aW9uIiwiY2hhaW5TdGF0ZSIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl91cGRhdGVGb3JtVmlld3MiLCJzZXRTdGF0ZSIsIl9tb2RlbCIsIl9kYXRhIiwicmVnaW9ucyIsImRlZmF1bHQiLCJmb3JFYWNoIiwiZmllbGQiLCJpbmRleCIsInVwZGF0ZVZhbGlkYXRpb24iLCJjdXN0b20iLCJ0ZXN0IiwiZm4iLCJ2YWwiLCJtYXRjaCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3JNZXNzYWdlIiwidmFsaWRhdGUiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0cyIsImV4cEZvcm0iLCJkYXRhIiwiY2xlYXIiLCJ0aGVuIiwiZ2V0RmllbGRzIiwidW5kZWZpbmVkIiwic2V0VmFsdWUiLCJzZXRWaXNpYmlsaXR5Iiwic3RhdGUiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJzZXREZWZhdWx0IiwibmV3QnRuIiwiZGVmYXVsdENvdW50ZXIiLCJleHBQcm90b2NvbCIsInZhbHVlIiwiY29uZmlnU3RhdGUiLCJBcnJheSIsImZpbGwiLCJwYW5lbCIsInB1c2giLCJsaWdodERpcmVjdGlvbnMiLCJjb25zb2xlIiwibG9nIiwibWFwIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImRpcmVjdGlvbiIsImxpZ2h0U3VjY2Vzc2lvbnMiLCJmaXJzdEJyaWdodG5lc3MiLCJzZWNvbmRCcmlnaHRuZXNzIiwiY3VyckxpZ2h0IiwibW9kaWZ5U2Vjb25kTGlnaHQiLCJsZW5ndGgiLCJldnQiLCJzaG93RGVzY3JpcHRpb24iLCJkZWx0YSIsIl9tb2RpZnlPcHRpb25zIiwiZmllbGRfZmlyc3RsaWdodCIsIl9maW5kRmllbGQiLCJuZXh0RmllbGQiLCJpc1Zpc2libGUiLCJuZXh0bmV4dEZpZWxkIiwiZmllbGRJZCIsImNudHIiLCJjcml0ZXJpYSIsImFkZGl0aW9uYWxseURpc2FibGUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsImNob2ljZSIsImRpc2FibGVPcHRpb24iLCJlbmFibGVPcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQ0EsTUFBTUUsT0FBT0YsUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUcsU0FBU0gsUUFBUSw2QkFBUixDQURYO0FBQUEsTUFFRUksY0FBY0osUUFBUSxxQkFBUixDQUZoQjtBQUFBLE1BR0VLLFFBQVFMLFFBQVEsaUJBQVIsQ0FIVjs7QUFNQTtBQUFBOztBQUNFLDhCQUFjO0FBQUE7O0FBQ1osVUFBTU0sVUFBVSxDQUFDSCxPQUFPSSxNQUFQLENBQWM7QUFDN0JDLFlBQUksUUFEeUI7QUFFN0JDLGVBQU8sUUFGc0I7QUFHN0JDLGlCQUFTLENBQUMsMEJBQUQsQ0FIb0I7QUFJN0JDLG1CQUFXO0FBSmtCLE9BQWQsQ0FBRCxFQUtaUixPQUFPSSxNQUFQLENBQWM7QUFDaEJDLFlBQUksV0FEWTtBQUVoQkMsZUFBTywwQkFGUztBQUdoQkMsaUJBQVMsQ0FBQyw2QkFBRCxDQUhPO0FBSWhCQyxtQkFBVztBQUpLLE9BQWQsQ0FMWSxDQUFoQjtBQVdBLFVBQUlWLFFB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TUFBTXNFLFVBQU4sRUFBWixFQUFnQ3ZFLE9BQWhDLENBQXdDLFVBQUN3RSxNQUFELEVBQVk7QUFDbEQsY0FBSSxDQUFDQSxPQUFPaEUsS0FBUCxDQUFhNEQsbUJBQWIsS0FBcUMsQ0FBQ0ksT0FBT2hFLEtBQVAsQ0FBYTJELFFBQWIsQ0FBdkMsS0FBa0UsQ0FBQ0ssT0FBT2hFLEtBQVAsQ0FBYSxxQ0FBYixDQUF2RSxFQUE0SDtBQUMxSFAsa0JBQU13RSxhQUFOLENBQW9CRCxNQUFwQjtBQUNELFdBRkQsTUFFTztBQUNMdkUsa0JBQU15RSxZQUFOLENBQW1CRixNQUFuQjtBQUNEO0FBQ0YsU0FORDtBQVFEO0FBeGNIOztBQUFBO0FBQUEsSUFBb0NwRyxJQUFwQztBQTBjRCxDQWxkRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9leHBlcmltZW50L2Zvcm1fbmFycmF0aXZlL2Zvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpO1xuICBjb25zdCBGb3JtID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9mb3JtJyksXG4gICAgQnV0dG9uID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvYnV0dG9uL2ZpZWxkJyksXG4gICAgRXhwUHJvdG9jb2wgPSByZXF1aXJlKCcuL2V4cHByb3RvY29sL2ZpZWxkJyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgcmV0dXJuIGNsYXNzIEV4cGVyaW1lbnRGb3JtIGV4dGVuZHMgRm9ybSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBjb25zdCBidXR0b25zID0gW0J1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ3N1Ym1pdCcsXG4gICAgICAgIGxhYmVsOiAnU3VibWl0JyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19zdWJtaXQnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5TdWJtaXQnXG4gICAgICB9KSwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnYWdncmVnYXRlJyxcbiAgICAgICAgbGFiZWw6ICdBZGQgUmVzdWx0cyB0byBBZ2dyZWdhdGUnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX2FnZ3JlZ2F0ZSddLFxuICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50LkFkZFRvQWdncmVnYXRlJ1xuICAgICAgfSldO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHtcbiAgICAgICAgYnV0dG9ucy5zcGxpY2UoMiwgMCwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICduZXcnLFxuICAgICAgICAgIGxhYmVsOiAnTmV3IEV4cGVyaW1lbnQnLFxuICAgICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fbmV3J10sXG4gICAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5OZXdSZXF1ZXN0J1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHN1cGVyKHtcbiAgICAgICAgbW9kZWxEYXRhOiB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGNsYXNzZXM6IFtcImZvcm1fX2V4cGVyaW1lbnRcIl0sXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiMS4gVmFyaWFibGUgdG8gYmUgY2hhbmdlZDpcIixcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzJzogJ0JyaWdodG5lc3Mgb2YgdGhlIGxpZ2h0JywgJ2RpcmVjdGlvbic6ICdEaXJlY3Rpb24gb2YgdGhlIGxpZ2h0J30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9wcm9jZWR1cmVcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnMi4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjIuIFByb2NlZHVyZSBmb3IgY2hhbmdpbmcgdGhlIGJyaWdodG5lc3M6XCIsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb24nOiBcIjIuIFByb2NlZHVyZSBmb3IgY2hhbmdpbmcgdGhlIGRpcmVjdGlvbjpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6ICdHcmFkdWFsbHkgaW5jcmVhc2UgdGhlIGJyaWdodG5lc3MnLCAnYnJpZ2h0bmVzc19kZWNyZWFzZSc6ICdHcmFkdWFsbHkgZGVjcmVhc2UgdGhlIGJyaWdodG5lc3MnLFxuICAgICAgICAgICAgICAnYnJpZ2h0bmVzc19ob2xkJzogJ0tlZXAgb25lIGxldmVsIG9mIGJyaWdodG5lc3MnLCAnYnJpZ2h0bmVzc19hbHRlcm5hdGUnOiAnQWx0ZXJuYXRlIGJldHdlZW4gdHdvIGxldmVscycsICdkaXJlY3Rpb25fYXJvdW5kJzogJ01ha2UgdGhlIGxpZ2h0IGdvIGFyb3VuZCcsICdkaXJlY3Rpb25faG9sZCc6ICdLZWVwIG9uZSBkaXJlY3Rpb24nLCAnZGlyZWN0aW9uX2FsdGVybmF0ZSc6ICdBbHRlcm5hdGUgYmV0d2VlbiB0d28gZGlyZWN0aW9ucyd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfaG9sZGNvbnN0YW50XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzMuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCIzLiBGaXggdGhlIGRpcmVjdGlvbiBvZiBsaWdodCB0bzpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiMy4gRml4IHRoZSBicmlnaHRuZXNzIG9mIGxpZ2h0IHRvOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fMjUnOiAnZGltJywgJ2RpcmVjdGlvbl81MCc6ICdtZWRpdW0nLCAnZGlyZWN0aW9uXzc1JzogJ2JyaWdodCcsICdkaXJlY3Rpb25fMTAwJzogJ3ZlcnkgYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdicmlnaHRuZXNzX2FsbGRpcic6ICdmcm9tIGFsbCBkaXJlY3Rpb25zJywgJ2JyaWdodG5lc3NfbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2JyaWdodG5lc3NfdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdicmlnaHRuZXNzX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywnYnJpZ2h0bmVzc19ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9maXJzdGxpZ2h0XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzQuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCI0LiBCcmlnaHRuZXNzIHNldHRpbmcgMTpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiNC4gRGlyZWN0aW9uIHNldHRpbmcgMTpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnZGlyZWN0aW9uX2JyaWdodG5lc3NfMCc6ICdubyBsaWdodCcsICdicmlnaHRuZXNzXzI1JzogJ2RpbScsICdicmlnaHRuZXNzXzUwJzogJ21lZGl1bScsICdicmlnaHRuZXNzXzc1JzogJ2JyaWdodCcsICdicmlnaHRuZXNzXzEwMCc6ICd2ZXJ5IGJyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX2FsbGRpcic6ICdmcm9tIGFsbCBkaXJlY3Rpb25zJywgJ2RpcmVjdGlvbl9sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnZGlyZWN0aW9uX3RvcGxlZnQnOiAnZnJvbSB0aGUgdG9wLWxlZnQnLCAnZGlyZWN0aW9uX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnZGlyZWN0aW9uX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywgJ2RpcmVjdGlvbl9ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9zZWNvbmRsaWdodFwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc1LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNS4gQnJpZ2h0bmVzcyBzZXR0aW5nIDI6XCIsICdkaXJlY3Rpb24nOiBcIjUuIERpcmVjdGlvbiBzZXR0aW5nIDI6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc183NSc6ICdicmlnaHQnLCAnYnJpZ2h0bmVzc18xMDAnOiAndmVyeSBicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpcmVjdGlvbl9hbGxkaXInOiAnZnJvbSBhbGwgZGlyZWN0aW9ucycsICdkaXJlY3Rpb25fbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2RpcmVjdGlvbl90b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2RpcmVjdGlvbl9yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsICdkaXJlY3Rpb25fYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfbGlnaHRkdXJhdGlvblwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc2LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIiwgJ2RpcmVjdGlvbic6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbic6ICdhbHRlcm5hdGUgMTUgc2Vjb25kcyBvbicsICdicmlnaHRuZXNzX2RpcmVjdGlvbl8zMG9uJzogJzMwIHNlY29uZHMgb24nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXSxcbiAgICAgICAgICBidXR0b25zOiBidXR0b25zXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuY2hhaW5PZkFjdGl2YXRpb24gPSB7XG4gICAgICAgICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nOiB7XCJleHBfY2F0ZWdvcnlcIjogXCJleHBfcHJvY2VkdXJlXCIsIFwiZXhwX3Byb2NlZHVyZVwiOiBcImV4cF9ob2xkY29uc3RhbnRcIiwgXCJleHBfaG9sZGNvbnN0YW50XCI6IFwiZXhwX2ZpcnN0bGlnaHRcIiwgXCJleHBfZmlyc3RsaWdodFwiOiBcImV4cF9zZWNvbmRsaWdodFwiLCBcImV4cF9zZWNvbmRsaWdodFwiOiBcImV4cF9saWdodGR1cmF0aW9uXCJ9LFxuICAgICAgICAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJzoge1wiZXhwX2NhdGVnb3J5XCI6IFwiZXhwX3Byb2NlZHVyZVwiLCBcImV4cF9wcm9jZWR1cmVcIjogXCJleHBfaG9sZGNvbnN0YW50XCIsIFwiZXhwX2hvbGRjb25zdGFudFwiOiBcImV4cF9maXJzdGxpZ2h0XCJ9XG4gICAgICB9O1xuICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG5cbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX3VwZGF0ZUZvcm1WaWV3cycsJ3NldFN0YXRlJywgJ3ZhbGlkYXRlJywgJ2dldExpZ2h0Q29uZmlndXJhdGlvbiddKVxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX3VwZGF0ZUZvcm1WaWV3cylcbiAgICAgIHRoaXMuc2V0U3RhdGUoJ25ldycpO1xuICAgIH1cblxuXG4gICAgdmFsaWRhdGUoKSB7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5jaGFpblN0YXRlKSB7XG4gICAgICAgIGNhc2UgJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic6XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBmaWVsZC51cGRhdGVWYWxpZGF0aW9uKHtjdXN0b206IHtcbiAgICAgICAgICAgICAgdGVzdDogJ2N1c3RvbScsXG4gICAgICAgICAgICAgIGZuOiAodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbC5tYXRjaCgnZGVmYXVsdCcpKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKSB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJZb3UgaGF2ZSB0byBjaG9vc2UgdmFsaWQgb3B0aW9ucyBmb3IgdGhlIFwiICsgKDEgKyBpbmRleCkgKyBcInRoIGZpZWxkLlwiXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic6XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSAhPSAnZXhwX3NlY29uZGxpZ2h0JyAmIGZpZWxkLmlkKCkgIT0gJ2V4cF9saWdodGR1cmF0aW9uJykge1xuICAgICAgICAgICAgICBmaWVsZC51cGRhdGVWYWxpZGF0aW9uKHtjdXN0b206IHtcbiAgICAgICAgICAgICAgICB0ZXN0OiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgICBmbjogKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHZhbC5tYXRjaCgnZGVmYXVsdCcpKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpIH1cbiAgICAgICAgICAgICAgICAgIGVsc2UgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJZb3UgaGF2ZSB0byBjaG9vc2UgdmFsaWQgb3B0aW9ucyBmb3IgdGhlIFwiICsgKDEgKyBpbmRleCkgKyBcInRoIGZpZWxkLlwiXG4gICAgICAgICAgICAgIH19KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZmllbGQudXBkYXRlVmFsaWRhdGlvbih7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwudmFsaWRhdGUoKTtcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICB2YXIgbGlnaHRDb25maWcgPSB0aGlzLmdldExpZ2h0Q29uZmlndXJhdGlvbigpO1xuICAgICAgcmV0dXJuIHtsaWdodHM6IGxpZ2h0Q29uZmlnWydsaWdodHMnXSwgZXhwRm9ybTogc3VwZXIuZXhwb3J0KCl9O1xuICAgIH1cblxuICAgIGltcG9ydChkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbGVhcigpLnRoZW4oKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiB0aGlzLl9tb2RlbC5nZXRGaWVsZHMoKSkge1xuICAgICAgICAgIGlmIChkYXRhW2ZpZWxkLmlkKCldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpZWxkLnNldFZhbHVlKGRhdGFbZmllbGQuaWQoKV0pO1xuICAgICAgICAgICAgaWYgKGRhdGFbZmllbGQuaWQoKV0gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykge1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICBjYXNlIFwiaGlzdG9yaWNhbFwiOlxuICAgICAgICAgIHRoaXMuc3RhdGUgPSAnaGlzdG9yaWNhbCdcbiAgICAgICAgICBzd2l0Y2ggKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLnNob3coKTt9XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmFnZ3JlZ2F0ZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJuZXdcIjpcbiAgICAgICAgICB0aGlzLnN0YXRlID0gJ25ldyc7XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSA9PSAnZXhwX2NhdGVnb3J5Jykge1xuICAgICAgICAgICAgICBmaWVsZC5lbmFibGUoKVxuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZGlzYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGlnaHRDb25maWd1cmF0aW9uKCkge1xuICAgICAgLy8gVHJhbnNsYXRlIGZpZWxkcyBpbnRvIFt7XCJsZWZ0XCI6IDEwMCwgXCJyaWdodFwiOiAwLCBcInRvcFwiOiAwLCBcImJvdHRvbVwiOiAxMDAsIFwiZHVyYXRpb25cIjogMTV9LCAuLi5dXG4gICAgICBsZXQgZGVmYXVsdENvdW50ZXIgPSAwO1xuICAgICAgdGhpcy5leHBQcm90b2NvbCA9IHt9XG4gICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgdGhpcy5leHBQcm90b2NvbFtmaWVsZC5pZCgpXSA9IGZpZWxkLnZhbHVlKClcbiAgICAgICAgZGVmYXVsdENvdW50ZXIgPSBmaWVsZC52YWx1ZSgpID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc/IGRlZmF1bHRDb3VudGVyICsgMSA6IGRlZmF1bHRDb3VudGVyO1xuICAgICAgfSlcblxuICAgICAgbGV0IGNvbmZpZ1N0YXRlID0gZmFsc2U7XG4gICAgICBpZiAoZGVmYXVsdENvdW50ZXIgPCAzKSB7IGNvbmZpZ1N0YXRlID0gdHJ1ZTsgfVxuXG4gICAgICB2YXIgbGlnaHRDb25maWcgPSB7fVxuICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXSA9IEFycmF5KDQpLmZpbGwoLTEpO1xuICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddID0gW107XG4gICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykgeyBsaWdodENvbmZpZ1snbGlnaHRzJ10ucHVzaCh7J2xlZnQnOiAwLCAndG9wJzogMCwgJ3JpZ2h0JzogMCwgJ2JvdHRvbSc6IDAsICdkdXJhdGlvbic6IDE1fSkgfVxuXG4gICAgICBpZiAoY29uZmlnU3RhdGUpIHtcbiAgICAgICAgdmFyIGxpZ2h0RGlyZWN0aW9ucyA9IFsnbGVmdCcsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJ107XG5cbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgZml4ZWQgdmFsdWVcbiAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSB7Y29uc29sZS5sb2coJ3RoZXJlIGlzIGEgcHJvYmxlbScpfVxuICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKCdkaXJlY3Rpb24nKSkge1xuICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ10gPSBBcnJheSg0KS5maWxsKCkubWFwKGZ1bmN0aW9uKCkgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKC9cXGQrLylbMF0pIH0sdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICBsZXQgc3Vic3RyID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgc3Vic3RyID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLnN1YnN0cihzdWJzdHIrMSk7XG4gICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBzdWJzdHIubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IDEwMCA6IDAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb2RpZnkgYWxsIHBhbmVsc1xuICAgICAgICB2YXIgbGlnaHRTdWNjZXNzaW9ucyA9IHsnbGVmdCc6ICd0b3AnLCAndG9wJzogJ3JpZ2h0JywgJ3JpZ2h0JzogJ2JvdHRvbScsICdib3R0b20nOiAnbGVmdCcsICd0b3BsZWZ0JzogJ3RvcHJpZ2h0JywgJ3RvcHJpZ2h0JzogJ2JvdHRvbXJpZ2h0JywgJ2JvdHRvbXJpZ2h0JzogJ2JvdHRvbWxlZnQnLCAnYm90dG9tbGVmdCc6ICd0b3BsZWZ0J307XG4gICAgICAgIHZhciBmaXJzdEJyaWdodG5lc3MgPSBudWxsO1xuICAgICAgICB2YXIgc2Vjb25kQnJpZ2h0bmVzcyA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuY2hhaW5TdGF0ZSA9PSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJyAmICEodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXSA9PSdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG5cbiAgICAgICAgICBzd2l0Y2ggKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9wcm9jZWR1cmUnXSkge1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3MgICsgMjUgKiBwYW5lbDtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGVjcmVhc2UnOlxuICAgICAgICAgICAgICBmaXJzdEJyaWdodG5lc3MgPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gZmlyc3RCcmlnaHRuZXNzIC0gMjUgKiBwYW5lbDtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaG9sZCc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3M7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fYXJvdW5kJzpcbiAgICAgICAgICAgICAgdmFyIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5zdWJzdHIoY3VyckxpZ2h0KzEpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBjdXJyTGlnaHQubWF0Y2goZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICAgIGN1cnJMaWdodCA9IGxpZ2h0U3VjY2Vzc2lvbnNbY3VyckxpZ2h0XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25faG9sZCc6XG4gICAgICAgICAgICAgIHZhciBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgICAgIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10uc3Vic3RyKGN1cnJMaWdodCsxKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gY3VyckxpZ2h0Lm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyckxpZ2h0ID09ICcwJykgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgeyAvLyBpZiBpcyBhbHRlcm5hdGluZ1xuXG4gICAgICAgICAgLy8gTW9kaWZ5IHRoZSBmaXJzdCBwYW5lbFxuICAgICAgICAgIGlmICghKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXSA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF0gOiAwICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goJ2RpcmVjdGlvbicpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1bZGlyZWN0aW9uXSA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF0gOiAwICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTW9kaWZ5IHRoZSByZW1haW5pbmcgcGFuZWxzXG4gICAgICAgICAgaWYgKCEodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykgJiAhKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9saWdodGR1cmF0aW9uJ10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICAgIHZhciBtb2RpZnlTZWNvbmRMaWdodCA9IFtdO1xuICAgICAgICAgICAgc3dpdGNoKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9saWdodGR1cmF0aW9uJ10pIHtcbiAgICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbic6XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzJdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsyXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF1cbiAgICAgICAgICAgICAgICBtb2RpZnlTZWNvbmRMaWdodCA9IFsxLDNdXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RpcmVjdGlvbl8xNW9ub2ZmJzpcbiAgICAgICAgICAgICAgICBsZXQgbGlnaHRzID0geydkdXJhdGlvbic6IDE1fTtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiBsaWdodHNbZGlyZWN0aW9uXSA9IDApO1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVsxXSA9IGxpZ2h0c1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV0gPSAwXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzNdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVszXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV1cbiAgICAgICAgICAgICAgICBtb2RpZnlTZWNvbmRMaWdodCA9IFsyXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMzBvbic6XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdO1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV0gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMiwzXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV0gPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKVxuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dIDogMCApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnZGlyZWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXSA6IDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1vZGlmeVNlY29uZExpZ2h0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzFdXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV07XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMV1dID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsaWdodENvbmZpZ1xuICAgIH1cblxuICAgIF91cGRhdGVGb3JtVmlld3MoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdleHBfY2F0ZWdvcnknKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfY2F0ZWdvcnknKXtcbiAgICAgICAgICAgIGZpZWxkLnNob3dEZXNjcmlwdGlvbihldnQuZGF0YS5kZWx0YS52YWx1ZS5tYXRjaCgnZGVmYXVsdF9jaG9pY2UnKSA/ICdkZWZhdWx0X2Nob2ljZScgOiBldnQuZGF0YS5kZWx0YS52YWx1ZSlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlID09ICduZXcnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkLCBldnQuZGF0YS5kZWx0YS52YWx1ZSlcblxuICAgICAgICAgIH0gZWxzZSB7IC8vIGlmIGl0IGlzIGV4cF9jYXRlZ29yeVxuICAgICAgICAgICAgZmllbGQuc2hvd0Rlc2NyaXB0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcblxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWQgPT0gJ2V4cF9wcm9jZWR1cmUnKSB7IC8vIFRoZSBjaG9zZW4gcHJvY2VkdXJlIGRldGVybWluZXMgd2hhdCBmaWVsZHMgdG8gc2hvd1xuXG4gICAgICAgICAgLy9EaXNhYmxlIG9wdGlvbnMgb2YgZXhwX2ZpcnN0bGlnaHQgZGVwZW5kaW5nIG9uIHdoYXQgaGFzIGJlZW4gY2hvc2VcbiAgICAgICAgICB2YXIgZmllbGRfZmlyc3RsaWdodCA9IHRoaXMuX2ZpbmRGaWVsZCgnZXhwX2ZpcnN0bGlnaHQnKTtcbiAgICAgICAgICBzd2l0Y2ggKGV2dC5kYXRhLmRlbHRhLnZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RlY3JlYXNlJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnYnJpZ2h0bmVzc183NXxicmlnaHRuZXNzXzEwMCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzB8YnJpZ2h0bmVzc18yNScpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2Fyb3VuZCc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ19sZWZ0fF90b3BsZWZ0Jyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2FsdGVybmF0ZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2JyaWdodG5lc3MnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaG9sZCc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwnYnJpZ2h0bmVzcycpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2FsdGVybmF0ZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2RpcmVjdGlvbicsICdfdG9wbGVmdCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2hvbGQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdkaXJlY3Rpb24nLCAnX3RvcGxlZnQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZS1pbml0aWFsaXplIHN1Y2Nlc3NpdmUgZmllbGRzXG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSAhPSAnZXhwX2NhdGVnb3J5JyAmIGZpZWxkLmlkKCkgIT0gJ2V4cF9wcm9jZWR1cmUnICYgdGhpcy5zdGF0ZSA9PSAnbmV3Jykge1xuICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIElzIHRoZSBuZXh0IGZpZWxkIGFjdGl2YXRlZD9cbiAgICAgIHZhciBuZXh0RmllbGQgPSB0aGlzLl9maW5kRmllbGQodGhpcy5jaGFpbk9mQWN0aXZhdGlvblt0aGlzLmNoYWluU3RhdGVdW2V2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZF0pO1xuICAgICAgaWYgKG5leHRGaWVsZCA/ICFuZXh0RmllbGQuaXNWaXNpYmxlKCkgOiBmYWxzZSkge1xuICAgICAgICAgIG5leHRGaWVsZC5zZXRWaXNpYmlsaXR5KCd2aXNpYmxlJyk7XG4gICAgICAgICAgbmV4dEZpZWxkLmVuYWJsZSgpO1xuXG4gICAgICAgICAgdmFyIG5leHRuZXh0RmllbGQgPSB0aGlzLl9maW5kRmllbGQodGhpcy5jaGFpbk9mQWN0aXZhdGlvblt0aGlzLmNoYWluU3RhdGVdW25leHRGaWVsZC5pZCgpXSk7XG4gICAgICAgICAgaWYgKG5leHRuZXh0RmllbGQpIHtuZXh0bmV4dEZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMC4zKX1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZmluZEZpZWxkKGZpZWxkSWQpIHtcbiAgICAgIHZhciBmaWVsZCA9IG51bGw7XG4gICAgICBmb3IgKHZhciBjbnRyID0gMDsgY250cjx0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQubGVuZ3RoOyBjbnRyKyspIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdFtjbnRyXS5pZCgpPT1maWVsZElkKSB7XG4gICAgICAgICAgZmllbGQgPSB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHRbY250cl1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkXG4gICAgfVxuXG4gICAgX21vZGlmeU9wdGlvbnMoZmllbGQsIGNyaXRlcmlhLCBhZGRpdGlvbmFsbHlEaXNhYmxlID0gbnVsbCkge1xuICAgICAgT2JqZWN0LmtleXMoZmllbGQuZ2V0T3B0aW9ucygpKS5mb3JFYWNoKChjaG9pY2UpID0+IHtcbiAgICAgICAgaWYgKChjaG9pY2UubWF0Y2goYWRkaXRpb25hbGx5RGlzYWJsZSkgfHwgIWNob2ljZS5tYXRjaChjcml0ZXJpYSkpICYmICFjaG9pY2UubWF0Y2goJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICBmaWVsZC5kaXNhYmxlT3B0aW9uKGNob2ljZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWVsZC5lbmFibGVPcHRpb24oY2hvaWNlKVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxufSlcbiJdfQ==
