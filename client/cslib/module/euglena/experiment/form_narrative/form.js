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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkZvcm0iLCJCdXR0b24iLCJFeHBQcm90b2NvbCIsIlV0aWxzIiwiYnV0dG9ucyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiZ2V0Iiwic3BsaWNlIiwibW9kZWxEYXRhIiwiZmllbGRzIiwiZGVzY3JpcHRpb24iLCJkZWZhdWx0VmFsdWUiLCJvcHRpb25zIiwidmFsaWRhdGlvbiIsImNoYWluT2ZBY3RpdmF0aW9uIiwiY2hhaW5TdGF0ZSIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl91cGRhdGVGb3JtVmlld3MiLCJzZXRTdGF0ZSIsIl9tb2RlbCIsIl9kYXRhIiwicmVnaW9ucyIsImRlZmF1bHQiLCJmb3JFYWNoIiwiZmllbGQiLCJpbmRleCIsInVwZGF0ZVZhbGlkYXRpb24iLCJjdXN0b20iLCJ0ZXN0IiwiZm4iLCJ2YWwiLCJtYXRjaCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3JNZXNzYWdlIiwidmFsaWRhdGUiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0cyIsImV4cEZvcm0iLCJkYXRhIiwiY2xlYXIiLCJ0aGVuIiwiZ2V0RmllbGRzIiwidW5kZWZpbmVkIiwic2V0VmFsdWUiLCJzZXRWaXNpYmlsaXR5Iiwic3RhdGUiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJzZXREZWZhdWx0IiwibmV3QnRuIiwiZGVmYXVsdENvdW50ZXIiLCJleHBQcm90b2NvbCIsInZhbHVlIiwiY29uZmlnU3RhdGUiLCJBcnJheSIsImZpbGwiLCJwYW5lbCIsInB1c2giLCJsaWdodERpcmVjdGlvbnMiLCJjb25zb2xlIiwibG9nIiwibWFwIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImRpcmVjdGlvbiIsImxpZ2h0U3VjY2Vzc2lvbnMiLCJmaXJzdEJyaWdodG5lc3MiLCJzZWNvbmRCcmlnaHRuZXNzIiwiY3VyckxpZ2h0IiwibW9kaWZ5U2Vjb25kTGlnaHQiLCJsZW5ndGgiLCJldnQiLCJzaG93RGVzY3JpcHRpb24iLCJkZWx0YSIsIl9tb2RpZnlPcHRpb25zIiwiZmllbGRfZmlyc3RsaWdodCIsIl9maW5kRmllbGQiLCJuZXh0RmllbGQiLCJpc1Zpc2libGUiLCJuZXh0bmV4dEZpZWxkIiwiZmllbGRJZCIsImNudHIiLCJjcml0ZXJpYSIsImFkZGl0aW9uYWxseURpc2FibGUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsImNob2ljZSIsImRpc2FibGVPcHRpb24iLCJlbmFibGVPcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQ0EsTUFBTUUsT0FBT0YsUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUcsU0FBU0gsUUFBUSw2QkFBUixDQURYO0FBQUEsTUFFRUksY0FBY0osUUFBUSxxQkFBUixDQUZoQjtBQUFBLE1BR0VLLFFBQVFMLFFBQVEsaUJBQVIsQ0FIVjs7QUFNQTtBQUFBOztBQUNFLDhCQUFjO0FBQUE7O0FBQ1osVUFBTU0sVUFBVSxDQUFDSCxPQUFPSSxNQUFQLENBQWM7QUFDN0JDLFlBQUksUUFEeUI7QUFFN0JDLGVBQU8sUUFGc0I7QUFHN0JDLGlCQUFTLENBQUMsMEJBQUQsQ0FIb0I7QUFJN0JDLG1CQUFXO0FBSmtCLE9BQWQsQ0FBRCxFQUtaUixPQUFPSSxNQUFQLENBQWM7QUFDaEJDLFlBQUksV0FEWTtBQUVoQkMsZUFBTywwQkFGUztBQUdoQkMsaUJBQVMsQ0FBQyw2QkFBRCxDQUhPO0FBSWhCQyxtQkFBVztBQUpLLE9BQWQsQ0FMWSxDQUFoQjtBQVdBLFVBQUlWLFFB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QUFNc0UsVUFBTixFQUFaLEVBQWdDdkUsT0FBaEMsQ0FBd0MsVUFBQ3dFLE1BQUQsRUFBWTtBQUNsRCxjQUFJLENBQUNBLE9BQU9oRSxLQUFQLENBQWE0RCxtQkFBYixLQUFxQyxDQUFDSSxPQUFPaEUsS0FBUCxDQUFhMkQsUUFBYixDQUF2QyxLQUFrRSxDQUFDSyxPQUFPaEUsS0FBUCxDQUFhLHFDQUFiLENBQXZFLEVBQTRIO0FBQzFIUCxrQkFBTXdFLGFBQU4sQ0FBb0JELE1BQXBCO0FBQ0QsV0FGRCxNQUVPO0FBQ0x2RSxrQkFBTXlFLFlBQU4sQ0FBbUJGLE1BQW5CO0FBQ0Q7QUFDRixTQU5EO0FBUUQ7QUF4Y0g7O0FBQUE7QUFBQSxJQUFvQ3BHLElBQXBDO0FBMGNELENBbGREIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG4gIGNvbnN0IEZvcm0gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0nKSxcbiAgICBCdXR0b24gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQnKSxcbiAgICBFeHBQcm90b2NvbCA9IHJlcXVpcmUoJy4vZXhwcHJvdG9jb2wvZmllbGQnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgRXhwZXJpbWVudEZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBbQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc3VibWl0JyxcbiAgICAgICAgbGFiZWw6ICdTdWJtaXQnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX3N1Ym1pdCddLFxuICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50LlN1Ym1pdCdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBsYWJlbDogJ0FkZCBSZXN1bHRzIHRvIEFnZ3JlZ2F0ZScsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fYWdncmVnYXRlJ10sXG4gICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnXG4gICAgICB9KV07XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkge1xuICAgICAgICBidXR0b25zLnNwbGljZSgyLCAwLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgICBpZDogJ25ldycsXG4gICAgICAgICAgbGFiZWw6ICdOZXcgRXhwZXJpbWVudCcsXG4gICAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19uZXcnXSxcbiAgICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50Lk5ld1JlcXVlc3QnXG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgc3VwZXIoe1xuICAgICAgICBtb2RlbERhdGE6IHtcbiAgICAgICAgICBpZDogXCJleHBlcmltZW50XCIsXG4gICAgICAgICAgY2xhc3NlczogW1wiZm9ybV9fZXhwZXJpbWVudFwiXSxcbiAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9jYXRlZ29yeVwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCIxLiBWYXJpYWJsZSB0byBiZSBjaGFuZ2VkOlwiLFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3MnOiAnQnJpZ2h0bmVzcyBvZiB0aGUgbGlnaHQnLCAnZGlyZWN0aW9uJzogJ0RpcmVjdGlvbiBvZiB0aGUgbGlnaHQnfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX3Byb2NlZHVyZVwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICcyLiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiMi4gUHJvY2VkdXJlIGZvciBjaGFuZ2luZyB0aGUgYnJpZ2h0bmVzczpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiMi4gUHJvY2VkdXJlIGZvciBjaGFuZ2luZyB0aGUgZGlyZWN0aW9uOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzX2luY3JlYXNlJzogJ0dyYWR1YWxseSBpbmNyZWFzZSB0aGUgYnJpZ2h0bmVzcycsICdicmlnaHRuZXNzX2RlY3JlYXNlJzogJ0dyYWR1YWxseSBkZWNyZWFzZSB0aGUgYnJpZ2h0bmVzcycsXG4gICAgICAgICAgICAgICdicmlnaHRuZXNzX2hvbGQnOiAnS2VlcCBvbmUgbGV2ZWwgb2YgYnJpZ2h0bmVzcycsICdicmlnaHRuZXNzX2FsdGVybmF0ZSc6ICdBbHRlcm5hdGUgYmV0d2VlbiB0d28gbGV2ZWxzJywgJ2RpcmVjdGlvbl9hcm91bmQnOiAnTWFrZSB0aGUgbGlnaHQgZ28gYXJvdW5kJywgJ2RpcmVjdGlvbl9ob2xkJzogJ0tlZXAgb25lIGRpcmVjdGlvbicsICdkaXJlY3Rpb25fYWx0ZXJuYXRlJzogJ0FsdGVybmF0ZSBiZXR3ZWVuIHR3byBkaXJlY3Rpb25zJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9ob2xkY29uc3RhbnRcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnMy4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjMuIEZpeCB0aGUgZGlyZWN0aW9uIG9mIGxpZ2h0IHRvOlwiLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uJzogXCIzLiBGaXggdGhlIGJyaWdodG5lc3Mgb2YgbGlnaHQgdG86XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl8yNSc6ICdkaW0nLCAnZGlyZWN0aW9uXzUwJzogJ21lZGl1bScsICdkaXJlY3Rpb25fNzUnOiAnYnJpZ2h0JywgJ2RpcmVjdGlvbl8xMDAnOiAndmVyeSBicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JyaWdodG5lc3NfYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnYnJpZ2h0bmVzc19sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnYnJpZ2h0bmVzc190b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2JyaWdodG5lc3NfcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCdicmlnaHRuZXNzX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2ZpcnN0bGlnaHRcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnNC4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjQuIEJyaWdodG5lc3Mgc2V0dGluZyAxOlwiLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uJzogXCI0LiBEaXJlY3Rpb24gc2V0dGluZyAxOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fYnJpZ2h0bmVzc18wJzogJ25vIGxpZ2h0JywgJ2JyaWdodG5lc3NfMjUnOiAnZGltJywgJ2JyaWdodG5lc3NfNTAnOiAnbWVkaXVtJywgJ2JyaWdodG5lc3NfNzUnOiAnYnJpZ2h0JywgJ2JyaWdodG5lc3NfMTAwJzogJ3ZlcnkgYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wbGVmdCc6ICdmcm9tIHRoZSB0b3AtbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX3NlY29uZGxpZ2h0XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzUuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCI1LiBCcmlnaHRuZXNzIHNldHRpbmcgMjpcIiwgJ2RpcmVjdGlvbic6IFwiNS4gRGlyZWN0aW9uIHNldHRpbmcgMjpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnZGlyZWN0aW9uX2JyaWdodG5lc3NfMCc6ICdubyBsaWdodCcsICdicmlnaHRuZXNzXzI1JzogJ2RpbScsICdicmlnaHRuZXNzXzUwJzogJ21lZGl1bScsICdicmlnaHRuZXNzXzc1JzogJ2JyaWdodCcsICdicmlnaHRuZXNzXzEwMCc6ICd2ZXJ5IGJyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX2FsbGRpcic6ICdmcm9tIGFsbCBkaXJlY3Rpb25zJywgJ2RpcmVjdGlvbl9sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnZGlyZWN0aW9uX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnZGlyZWN0aW9uX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywgJ2RpcmVjdGlvbl9ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9saWdodGR1cmF0aW9uXCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzYuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCI2LiBUaW1lIHBlciBzZXR0aW5nOlwiLCAnZGlyZWN0aW9uJzogXCI2LiBUaW1lIHBlciBzZXR0aW5nOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzX2RpcmVjdGlvbl8xNW9uJzogJ2FsdGVybmF0ZSAxNSBzZWNvbmRzIG9uJywgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzMwb24nOiAnMzAgc2Vjb25kcyBvbid9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdLFxuICAgICAgICAgIGJ1dHRvbnM6IGJ1dHRvbnNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5jaGFpbk9mQWN0aXZhdGlvbiA9IHtcbiAgICAgICAgJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic6IHtcImV4cF9jYXRlZ29yeVwiOiBcImV4cF9wcm9jZWR1cmVcIiwgXCJleHBfcHJvY2VkdXJlXCI6IFwiZXhwX2hvbGRjb25zdGFudFwiLCBcImV4cF9ob2xkY29uc3RhbnRcIjogXCJleHBfZmlyc3RsaWdodFwiLCBcImV4cF9maXJzdGxpZ2h0XCI6IFwiZXhwX3NlY29uZGxpZ2h0XCIsIFwiZXhwX3NlY29uZGxpZ2h0XCI6IFwiZXhwX2xpZ2h0ZHVyYXRpb25cIn0sXG4gICAgICAgICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nOiB7XCJleHBfY2F0ZWdvcnlcIjogXCJleHBfcHJvY2VkdXJlXCIsIFwiZXhwX3Byb2NlZHVyZVwiOiBcImV4cF9ob2xkY29uc3RhbnRcIiwgXCJleHBfaG9sZGNvbnN0YW50XCI6IFwiZXhwX2ZpcnN0bGlnaHRcIn1cbiAgICAgIH07XG4gICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfdXBkYXRlRm9ybVZpZXdzJywnc2V0U3RhdGUnLCAndmFsaWRhdGUnLCAnZ2V0TGlnaHRDb25maWd1cmF0aW9uJ10pXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fdXBkYXRlRm9ybVZpZXdzKVxuICAgICAgdGhpcy5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgfVxuXG5cbiAgICB2YWxpZGF0ZSgpIHtcblxuICAgICAgc3dpdGNoICh0aGlzLmNoYWluU3RhdGUpIHtcbiAgICAgICAgY2FzZSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGZpZWxkLnVwZGF0ZVZhbGlkYXRpb24oe2N1c3RvbToge1xuICAgICAgICAgICAgICB0ZXN0OiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgZm46ICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmFsLm1hdGNoKCdkZWZhdWx0JykpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSkgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBcIllvdSBoYXZlIHRvIGNob29zZSB2YWxpZCBvcHRpb25zIGZvciB0aGUgXCIgKyAoMSArIGluZGV4KSArIFwidGggZmllbGQuXCJcbiAgICAgICAgICAgIH19KVxuICAgICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfc2Vjb25kbGlnaHQnICYgZmllbGQuaWQoKSAhPSAnZXhwX2xpZ2h0ZHVyYXRpb24nKSB7XG4gICAgICAgICAgICAgIGZpZWxkLnVwZGF0ZVZhbGlkYXRpb24oe2N1c3RvbToge1xuICAgICAgICAgICAgICAgIHRlc3Q6ICdjdXN0b20nLFxuICAgICAgICAgICAgICAgIGZuOiAodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAodmFsLm1hdGNoKCdkZWZhdWx0JykpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSkgfVxuICAgICAgICAgICAgICAgICAgZWxzZSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSkgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBcIllvdSBoYXZlIHRvIGNob29zZSB2YWxpZCBvcHRpb25zIGZvciB0aGUgXCIgKyAoMSArIGluZGV4KSArIFwidGggZmllbGQuXCJcbiAgICAgICAgICAgICAgfX0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaWVsZC51cGRhdGVWYWxpZGF0aW9uKHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC52YWxpZGF0ZSgpO1xuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgIHZhciBsaWdodENvbmZpZyA9IHRoaXMuZ2V0TGlnaHRDb25maWd1cmF0aW9uKCk7XG4gICAgICByZXR1cm4ge2xpZ2h0czogbGlnaHRDb25maWdbJ2xpZ2h0cyddLCBleHBGb3JtOiBzdXBlci5leHBvcnQoKX07XG4gICAgfVxuXG4gICAgaW1wb3J0KGRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuX21vZGVsLmdldEZpZWxkcygpKSB7XG4gICAgICAgICAgaWYgKGRhdGFbZmllbGQuaWQoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmllbGQuc2V0VmFsdWUoZGF0YVtmaWVsZC5pZCgpXSk7XG4gICAgICAgICAgICBpZiAoZGF0YVtmaWVsZC5pZCgpXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJoaXN0b3JpY2FsXCI6XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9ICdoaXN0b3JpY2FsJ1xuICAgICAgICAgIHN3aXRjaCAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcIm9ic2VydmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuc2hvdygpO31cbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuYWdncmVnYXRlJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLnNob3coKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgIHRoaXMuc3RhdGUgPSAnbmV3JztcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pZCgpID09ICdleHBfY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmVuYWJsZSgpXG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNhYmxlTmV3KCkge1xuICAgICAgY29uc3QgbmV3QnRuID0gdGhpcy5nZXRCdXR0b24oJ25ldycpXG4gICAgICBpZiAobmV3QnRuKSB7XG4gICAgICAgIG5ld0J0bi5kaXNhYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlTmV3KCkge1xuICAgICAgY29uc3QgbmV3QnRuID0gdGhpcy5nZXRCdXR0b24oJ25ldycpXG4gICAgICBpZiAobmV3QnRuKSB7XG4gICAgICAgIG5ld0J0bi5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMaWdodENvbmZpZ3VyYXRpb24oKSB7XG4gICAgICAvLyBUcmFuc2xhdGUgZmllbGRzIGludG8gW3tcImxlZnRcIjogMTAwLCBcInJpZ2h0XCI6IDAsIFwidG9wXCI6IDAsIFwiYm90dG9tXCI6IDEwMCwgXCJkdXJhdGlvblwiOiAxNX0sIC4uLl1cbiAgICAgIGxldCBkZWZhdWx0Q291bnRlciA9IDA7XG4gICAgICB0aGlzLmV4cFByb3RvY29sID0ge31cbiAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICB0aGlzLmV4cFByb3RvY29sW2ZpZWxkLmlkKCldID0gZmllbGQudmFsdWUoKVxuICAgICAgICBkZWZhdWx0Q291bnRlciA9IGZpZWxkLnZhbHVlKCkgPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJz8gZGVmYXVsdENvdW50ZXIgKyAxIDogZGVmYXVsdENvdW50ZXI7XG4gICAgICB9KVxuXG4gICAgICBsZXQgY29uZmlnU3RhdGUgPSBmYWxzZTtcbiAgICAgIGlmIChkZWZhdWx0Q291bnRlciA8IDMpIHsgY29uZmlnU3RhdGUgPSB0cnVlOyB9XG5cbiAgICAgIHZhciBsaWdodENvbmZpZyA9IHt9XG4gICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddID0gQXJyYXkoNCkuZmlsbCgtMSk7XG4gICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ10gPSBbXTtcbiAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7IGxpZ2h0Q29uZmlnWydsaWdodHMnXS5wdXNoKHsnbGVmdCc6IDAsICd0b3AnOiAwLCAncmlnaHQnOiAwLCAnYm90dG9tJzogMCwgJ2R1cmF0aW9uJzogMTV9KSB9XG5cbiAgICAgIGlmIChjb25maWdTdGF0ZSkge1xuICAgICAgICB2YXIgbGlnaHREaXJlY3Rpb25zID0gWydsZWZ0JywgJ3RvcCcsICdyaWdodCcsICdib3R0b20nXTtcblxuICAgICAgICAvLyBFeHRyYWN0IHRoZSBmaXhlZCB2YWx1ZVxuICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpIHtjb25zb2xlLmxvZygndGhlcmUgaXMgYSBwcm9ibGVtJyl9XG4gICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubWF0Y2goJ2RpcmVjdGlvbicpKSB7XG4gICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXSA9IEFycmF5KDQpLmZpbGwoKS5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubWF0Y2goL1xcZCsvKVswXSkgfSx0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubWF0Y2goJ2JyaWdodG5lc3MnKSkge1xuICAgICAgICAgIGxldCBzdWJzdHIgPSB0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICBzdWJzdHIgPSB0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10uc3Vic3RyKHN1YnN0cisxKTtcbiAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IHN1YnN0ci5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gMTAwIDogMCApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vZGlmeSBhbGwgcGFuZWxzXG4gICAgICAgIHZhciBsaWdodFN1Y2Nlc3Npb25zID0geydsZWZ0JzogJ3RvcCcsICd0b3AnOiAncmlnaHQnLCAncmlnaHQnOiAnYm90dG9tJywgJ2JvdHRvbSc6ICdsZWZ0JywgJ3RvcGxlZnQnOiAndG9wcmlnaHQnLCAndG9wcmlnaHQnOiAnYm90dG9tcmlnaHQnLCAnYm90dG9tcmlnaHQnOiAnYm90dG9tbGVmdCcsICdib3R0b21sZWZ0JzogJ3RvcGxlZnQnfTtcbiAgICAgICAgdmFyIGZpcnN0QnJpZ2h0bmVzcyA9IG51bGw7XG4gICAgICAgIHZhciBzZWNvbmRCcmlnaHRuZXNzID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5jaGFpblN0YXRlID09ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nICYgISh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddID09J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcblxuICAgICAgICAgIHN3aXRjaCAodGhpcy5leHBQcm90b2NvbFsnZXhwX3Byb2NlZHVyZSddKSB7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2luY3JlYXNlJzpcbiAgICAgICAgICAgICAgZmlyc3RCcmlnaHRuZXNzID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IGZpcnN0QnJpZ2h0bmVzcyAgKyAyNSAqIHBhbmVsO1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kZWNyZWFzZSc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3MgLSAyNSAqIHBhbmVsO1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19ob2xkJzpcbiAgICAgICAgICAgICAgZmlyc3RCcmlnaHRuZXNzID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IGZpcnN0QnJpZ2h0bmVzcztcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hcm91bmQnOlxuICAgICAgICAgICAgICB2YXIgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5sYXN0SW5kZXhPZignXycpO1xuICAgICAgICAgICAgICBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLnN1YnN0cihjdXJyTGlnaHQrMSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGN1cnJMaWdodC5tYXRjaChkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gbGlnaHRTdWNjZXNzaW9uc1tjdXJyTGlnaHRdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9ob2xkJzpcbiAgICAgICAgICAgICAgdmFyIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5zdWJzdHIoY3VyckxpZ2h0KzEpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBjdXJyTGlnaHQubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyTGlnaHQgPT0gJzAnKSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7IC8vIGlmIGlzIGFsdGVybmF0aW5nXG5cbiAgICAgICAgICAvLyBNb2RpZnkgdGhlIGZpcnN0IHBhbmVsXG4gICAgICAgICAgaWYgKCEodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goJ2JyaWdodG5lc3MnKSkge1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXSA6IDAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgnZGlyZWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVtkaXJlY3Rpb25dID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXSA6IDAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBNb2RpZnkgdGhlIHJlbWFpbmluZyBwYW5lbHNcbiAgICAgICAgICBpZiAoISh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSAmICEodGhpcy5leHBQcm90b2NvbFsnZXhwX2xpZ2h0ZHVyYXRpb24nXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuICAgICAgICAgICAgdmFyIG1vZGlmeVNlY29uZExpZ2h0ID0gW107XG4gICAgICAgICAgICBzd2l0Y2godGhpcy5leHBQcm90b2NvbFsnZXhwX2xpZ2h0ZHVyYXRpb24nXSkge1xuICAgICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RpcmVjdGlvbl8xNW9uJzpcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bMl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1cbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzJdID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXVxuICAgICAgICAgICAgICAgIG1vZGlmeVNlY29uZExpZ2h0ID0gWzEsM11cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b25vZmYnOlxuICAgICAgICAgICAgICAgIGxldCBsaWdodHMgPSB7J2R1cmF0aW9uJzogMTV9O1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IGxpZ2h0c1tkaXJlY3Rpb25dID0gMCk7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdID0gbGlnaHRzXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsxXSA9IDBcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bM10gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMV1cbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzNdID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsxXVxuICAgICAgICAgICAgICAgIG1vZGlmeVNlY29uZExpZ2h0ID0gWzJdXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RpcmVjdGlvbl8zMG9uJzpcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bMV0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF07XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsxXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF1cbiAgICAgICAgICAgICAgICBtb2RpZnlTZWNvbmRMaWdodCA9IFsyLDNdXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goJ2JyaWdodG5lc3MnKSkge1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXSA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pXG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV0gOiAwICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdkaXJlY3Rpb24nKSkge1xuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dIDogMCApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobW9kaWZ5U2Vjb25kTGlnaHQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMV1dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXTtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFsxXV0gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxpZ2h0Q29uZmlnXG4gICAgfVxuXG4gICAgX3VwZGF0ZUZvcm1WaWV3cyhldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWQgPT0gJ2V4cF9jYXRlZ29yeScpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKGZpZWxkLmlkKCkgIT0gJ2V4cF9jYXRlZ29yeScpe1xuICAgICAgICAgICAgZmllbGQuc2hvd0Rlc2NyaXB0aW9uKGV2dC5kYXRhLmRlbHRhLnZhbHVlLm1hdGNoKCdkZWZhdWx0X2Nob2ljZScpID8gJ2RlZmF1bHRfY2hvaWNlJyA6IGV2dC5kYXRhLmRlbHRhLnZhbHVlKVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT0gJ25ldycpIHtcbiAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGQsIGV2dC5kYXRhLmRlbHRhLnZhbHVlKVxuXG4gICAgICAgICAgfSBlbHNlIHsgLy8gaWYgaXQgaXMgZXhwX2NhdGVnb3J5XG4gICAgICAgICAgICBmaWVsZC5zaG93RGVzY3JpcHRpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PSAnZXhwX3Byb2NlZHVyZScpIHsgLy8gVGhlIGNob3NlbiBwcm9jZWR1cmUgZGV0ZXJtaW5lcyB3aGF0IGZpZWxkcyB0byBzaG93XG5cbiAgICAgICAgICAvL0Rpc2FibGUgb3B0aW9ucyBvZiBleHBfZmlyc3RsaWdodCBkZXBlbmRpbmcgb24gd2hhdCBoYXMgYmVlbiBjaG9zZVxuICAgICAgICAgIHZhciBmaWVsZF9maXJzdGxpZ2h0ID0gdGhpcy5fZmluZEZpZWxkKCdleHBfZmlyc3RsaWdodCcpO1xuICAgICAgICAgIHN3aXRjaCAoZXZ0LmRhdGEuZGVsdGEudmFsdWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGVjcmVhc2UnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzXzEwMCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2JyaWdodG5lc3NfMjUnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hcm91bmQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdfbGVmdHxfdG9wbGVmdCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19hbHRlcm5hdGUnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2hvbGQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsJ2JyaWdodG5lc3MnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hbHRlcm5hdGUnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdkaXJlY3Rpb24nLCAnX3RvcGxlZnQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9ob2xkJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnZGlyZWN0aW9uJywgJ190b3BsZWZ0Jyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmUtaW5pdGlhbGl6ZSBzdWNjZXNzaXZlIGZpZWxkc1xuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmlkKCkgIT0gJ2V4cF9jYXRlZ29yeScgJiBmaWVsZC5pZCgpICE9ICdleHBfcHJvY2VkdXJlJyAmIHRoaXMuc3RhdGUgPT0gJ25ldycpIHtcbiAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBJcyB0aGUgbmV4dCBmaWVsZCBhY3RpdmF0ZWQ/XG4gICAgICB2YXIgbmV4dEZpZWxkID0gdGhpcy5fZmluZEZpZWxkKHRoaXMuY2hhaW5PZkFjdGl2YXRpb25bdGhpcy5jaGFpblN0YXRlXVtldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWRdKTtcbiAgICAgIGlmIChuZXh0RmllbGQgPyAhbmV4dEZpZWxkLmlzVmlzaWJsZSgpIDogZmFsc2UpIHtcbiAgICAgICAgICBuZXh0RmllbGQuc2V0VmlzaWJpbGl0eSgndmlzaWJsZScpO1xuICAgICAgICAgIG5leHRGaWVsZC5lbmFibGUoKTtcblxuICAgICAgICAgIHZhciBuZXh0bmV4dEZpZWxkID0gdGhpcy5fZmluZEZpZWxkKHRoaXMuY2hhaW5PZkFjdGl2YXRpb25bdGhpcy5jaGFpblN0YXRlXVtuZXh0RmllbGQuaWQoKV0pO1xuICAgICAgICAgIGlmIChuZXh0bmV4dEZpZWxkKSB7bmV4dG5leHRGaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDAuMyl9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZpbmRGaWVsZChmaWVsZElkKSB7XG4gICAgICB2YXIgZmllbGQgPSBudWxsO1xuICAgICAgZm9yICh2YXIgY250ciA9IDA7IGNudHI8dGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0Lmxlbmd0aDsgY250cisrKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHRbY250cl0uaWQoKT09ZmllbGRJZCkge1xuICAgICAgICAgIGZpZWxkID0gdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0W2NudHJdXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWVsZFxuICAgIH1cblxuICAgIF9tb2RpZnlPcHRpb25zKGZpZWxkLCBjcml0ZXJpYSwgYWRkaXRpb25hbGx5RGlzYWJsZSA9IG51bGwpIHtcbiAgICAgIE9iamVjdC5rZXlzKGZpZWxkLmdldE9wdGlvbnMoKSkuZm9yRWFjaCgoY2hvaWNlKSA9PiB7XG4gICAgICAgIGlmICgoY2hvaWNlLm1hdGNoKGFkZGl0aW9uYWxseURpc2FibGUpIHx8ICFjaG9pY2UubWF0Y2goY3JpdGVyaWEpKSAmJiAhY2hvaWNlLm1hdGNoKCdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgZmllbGQuZGlzYWJsZU9wdGlvbihjaG9pY2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmllbGQuZW5hYmxlT3B0aW9uKGNob2ljZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG4gIH1cbn0pXG4iXX0=
