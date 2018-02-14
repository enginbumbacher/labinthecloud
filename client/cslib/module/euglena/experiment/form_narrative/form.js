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
              'brightness_alldir': 'from all directions', 'brightness_left': 'from the left', 'brightness_topleft': 'from the top-left', 'brightness_top': 'from the top',
              'brightness_topright': 'from the top-right', 'brightness_right': 'from the right', 'brightness_bottomright': 'from the bottom-right',
              'brightness_bottom': 'from the bottom', 'brightness_bottomleft': 'from the bottom-left' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_firstlight",
            description: { 'default_choice': '4. Decide on the previous questions first.', 'brightness': "4. Brightness setting 1:",
              'direction': "4. Direction setting 1:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_75': 'bright', 'brightness_100': 'very bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_topleft': 'from the top-left', 'direction_top': 'from the top',
              'direction_topright': 'from the top-right', 'direction_right': 'from the right', 'direction_bottomright': 'from the bottom-right',
              'direction_bottom': 'from the bottom', 'direction_bottomleft': 'from the bottom-left' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_secondlight",
            description: { 'default_choice': '5. Decide on the previous questions first.', 'brightness': "5. Brightness setting 2:", 'direction': "5. Direction setting 2:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_75': 'bright', 'brightness_100': 'very bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_topleft': 'from the top-left', 'direction_top': 'from the top',
              'direction_topright': 'from the top-right', 'direction_right': 'from the right', 'direction_bottomright': 'from the bottom-right',
              'direction_bottom': 'from the bottom', 'direction_bottomleft': 'from the bottom-left' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_lightduration",
            description: { 'default_choice': '6. Decide on the previous questions first.', 'brightness': "6. Time per setting:", 'direction': "6. Time per setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness_direction_15on': '15 seconds on', 'brightness_direction_15onoff': '15 seconds on, 15 seconds off', 'brightness_direction_30on': '30 seconds on' },
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
        if (defaultCounter < 4) {
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
              this._modifyOptions(field_firstlight, 'direction');
              this.chainState = 'fullChainOfActivation';
              break;
            case 'direction_hold':
              this._modifyOptions(field_firstlight, 'direction');
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
        Object.keys(field.getOptions()).forEach(function (choice) {
          if (!choice.match(criteria) & !choice.match('direction_brightness_default_choice')) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkZvcm0iLCJCdXR0b24iLCJFeHBQcm90b2NvbCIsIlV0aWxzIiwiYnV0dG9ucyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiZ2V0Iiwic3BsaWNlIiwibW9kZWxEYXRhIiwiZmllbGRzIiwiZGVzY3JpcHRpb24iLCJkZWZhdWx0VmFsdWUiLCJvcHRpb25zIiwidmFsaWRhdGlvbiIsImNoYWluT2ZBY3RpdmF0aW9uIiwiY2hhaW5TdGF0ZSIsImJpbmRNZXRob2RzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl91cGRhdGVGb3JtVmlld3MiLCJzZXRTdGF0ZSIsIl9tb2RlbCIsIl9kYXRhIiwicmVnaW9ucyIsImRlZmF1bHQiLCJmb3JFYWNoIiwiZmllbGQiLCJpbmRleCIsInVwZGF0ZVZhbGlkYXRpb24iLCJjdXN0b20iLCJ0ZXN0IiwiZm4iLCJ2YWwiLCJtYXRjaCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3JNZXNzYWdlIiwidmFsaWRhdGUiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0cyIsImV4cEZvcm0iLCJkYXRhIiwiY2xlYXIiLCJ0aGVuIiwiZ2V0RmllbGRzIiwidW5kZWZpbmVkIiwic2V0VmFsdWUiLCJzZXRWaXNpYmlsaXR5Iiwic3RhdGUiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJzZXREZWZhdWx0IiwibmV3QnRuIiwiZGVmYXVsdENvdW50ZXIiLCJleHBQcm90b2NvbCIsInZhbHVlIiwiY29uZmlnU3RhdGUiLCJBcnJheSIsImZpbGwiLCJwYW5lbCIsInB1c2giLCJsaWdodERpcmVjdGlvbnMiLCJjb25zb2xlIiwibG9nIiwibWFwIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImRpcmVjdGlvbiIsImxpZ2h0U3VjY2Vzc2lvbnMiLCJmaXJzdEJyaWdodG5lc3MiLCJzZWNvbmRCcmlnaHRuZXNzIiwiY3VyckxpZ2h0IiwibW9kaWZ5U2Vjb25kTGlnaHQiLCJsZW5ndGgiLCJldnQiLCJzaG93RGVzY3JpcHRpb24iLCJkZWx0YSIsIl9tb2RpZnlPcHRpb25zIiwiZmllbGRfZmlyc3RsaWdodCIsIl9maW5kRmllbGQiLCJuZXh0RmllbGQiLCJpc1Zpc2libGUiLCJuZXh0bmV4dEZpZWxkIiwiZmllbGRJZCIsImNudHIiLCJjcml0ZXJpYSIsIk9iamVjdCIsImtleXMiLCJnZXRPcHRpb25zIiwiY2hvaWNlIiwiZGlzYWJsZU9wdGlvbiIsImVuYWJsZU9wdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFDQSxNQUFNRSxPQUFPRixRQUFRLDBCQUFSLENBQWI7QUFBQSxNQUNFRyxTQUFTSCxRQUFRLDZCQUFSLENBRFg7QUFBQSxNQUVFSSxjQUFjSixRQUFRLHFCQUFSLENBRmhCO0FBQUEsTUFHRUssUUFBUUwsUUFBUSxpQkFBUixDQUhWOztBQU1BO0FBQUE7O0FBQ0UsOEJBQWM7QUFBQTs7QUFDWixVQUFNTSxVQUFVLENBQUNILE9BQU9JLE1BQVAsQ0FBYztBQUM3QkMsWUFBSSxRQUR5QjtBQUU3QkMsZUFBTyxRQUZzQjtBQUc3QkMsaUJBQVMsQ0FBQywwQkFBRCxDQUhvQjtBQUk3QkMsbUJBQVc7QUFKa0IsT0FBZCxDQUFELEVBS1pSLE9BQU9JLE1BQVAsQ0FBYztBQUNoQkMsWUFBSSxXQURZO0FBRWhCQyxlQUFPLDBCQUZTO0FBR2hCQyxpQkFBUyxDQUFDLDZCQUFELENBSE87QUFJaEJDLG1CQUFXO0FBSkssT0FBZCxDQUxZLENBQWhCO0FBV0EsVUFBSVYsUUFBUVcsR0FBUixDQUFZLDJCQUFaLENB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LE9BQWxCLENBQTBCQyxPQUExQixDQUFrQ21FLElBQWxDLENBQVI7QUFDQTtBQUNEO0FBQ0Y7QUFDRCxlQUFPakUsS0FBUDtBQUNEO0FBbmNIO0FBQUE7QUFBQSxxQ0FxY2lCQSxLQXJjakIsRUFxY3dCa0UsUUFyY3hCLEVBcWNrQztBQUM5QkMsZUFBT0MsSUFBUCxDQUFZcEUsTUFBTXFFLFVBQU4sRUFBWixFQUFnQ3RFLE9BQWhDLENBQXdDLFVBQUN1RSxNQUFELEVBQVk7QUFDbEQsY0FBSSxDQUFDQSxPQUFPL0QsS0FBUCxDQUFhMkQsUUFBYixDQUFELEdBQTBCLENBQUNJLE9BQU8vRCxLQUFQLENBQWEscUNBQWIsQ0FBL0IsRUFBb0Y7QUFDbEZQLGtCQUFNdUUsYUFBTixDQUFvQkQsTUFBcEI7QUFDRCxXQUZELE1BRU87QUFDTHRFLGtCQUFNd0UsWUFBTixDQUFtQkYsTUFBbkI7QUFDRDtBQUNGLFNBTkQ7QUFRRDtBQTljSDs7QUFBQTtBQUFBLElBQW9DbkcsSUFBcEM7QUFnZEQsQ0F4ZEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtX25hcnJhdGl2ZS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIEJ1dHRvbiA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2J1dHRvbi9maWVsZCcpLFxuICAgIEV4cFByb3RvY29sID0gcmVxdWlyZSgnLi9leHBwcm90b2NvbC9maWVsZCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBFeHBlcmltZW50Rm9ybSBleHRlbmRzIEZvcm0ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgY29uc3QgYnV0dG9ucyA9IFtCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzdWJtaXQnLFxuICAgICAgICBsYWJlbDogJ1N1Ym1pdCcsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fc3VibWl0J10sXG4gICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuU3VibWl0J1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGxhYmVsOiAnQWRkIFJlc3VsdHMgdG8gQWdncmVnYXRlJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19hZ2dyZWdhdGUnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZSdcbiAgICAgIH0pXTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7XG4gICAgICAgIGJ1dHRvbnMuc3BsaWNlKDIsIDAsIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICAgIGlkOiAnbmV3JyxcbiAgICAgICAgICBsYWJlbDogJ05ldyBFeHBlcmltZW50JyxcbiAgICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX25ldyddLFxuICAgICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCdcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBzdXBlcih7XG4gICAgICAgIG1vZGVsRGF0YToge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBjbGFzc2VzOiBbXCJmb3JtX19leHBlcmltZW50XCJdLFxuICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2NhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIjEuIFZhcmlhYmxlIHRvIGJlIGNoYW5nZWQ6XCIsXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzcyc6ICdCcmlnaHRuZXNzIG9mIHRoZSBsaWdodCcsICdkaXJlY3Rpb24nOiAnRGlyZWN0aW9uIG9mIHRoZSBsaWdodCd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfcHJvY2VkdXJlXCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzIuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCIyLiBQcm9jZWR1cmUgZm9yIGNoYW5naW5nIHRoZSBicmlnaHRuZXNzOlwiLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uJzogXCIyLiBQcm9jZWR1cmUgZm9yIGNoYW5naW5nIHRoZSBkaXJlY3Rpb246XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3NfaW5jcmVhc2UnOiAnR3JhZHVhbGx5IGluY3JlYXNlIHRoZSBicmlnaHRuZXNzJywgJ2JyaWdodG5lc3NfZGVjcmVhc2UnOiAnR3JhZHVhbGx5IGRlY3JlYXNlIHRoZSBicmlnaHRuZXNzJyxcbiAgICAgICAgICAgICAgJ2JyaWdodG5lc3NfaG9sZCc6ICdLZWVwIG9uZSBsZXZlbCBvZiBicmlnaHRuZXNzJywgJ2JyaWdodG5lc3NfYWx0ZXJuYXRlJzogJ0FsdGVybmF0ZSBiZXR3ZWVuIHR3byBsZXZlbHMnLCAnZGlyZWN0aW9uX2Fyb3VuZCc6ICdNYWtlIHRoZSBsaWdodCBnbyBhcm91bmQnLCAnZGlyZWN0aW9uX2hvbGQnOiAnS2VlcCBvbmUgZGlyZWN0aW9uJywgJ2RpcmVjdGlvbl9hbHRlcm5hdGUnOiAnQWx0ZXJuYXRlIGJldHdlZW4gdHdvIGRpcmVjdGlvbnMnfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2hvbGRjb25zdGFudFwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICczLiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiMy4gRml4IHRoZSBkaXJlY3Rpb24gb2YgbGlnaHQgdG86XCIsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb24nOiBcIjMuIEZpeCB0aGUgYnJpZ2h0bmVzcyBvZiBsaWdodCB0bzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnZGlyZWN0aW9uXzI1JzogJ2RpbScsICdkaXJlY3Rpb25fNTAnOiAnbWVkaXVtJywgJ2RpcmVjdGlvbl83NSc6ICdicmlnaHQnLCAnZGlyZWN0aW9uXzEwMCc6ICd2ZXJ5IGJyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnJpZ2h0bmVzc19hbGxkaXInOiAnZnJvbSBhbGwgZGlyZWN0aW9ucycsICdicmlnaHRuZXNzX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdicmlnaHRuZXNzX3RvcGxlZnQnOiAnZnJvbSB0aGUgdG9wLWxlZnQnLCAnYnJpZ2h0bmVzc190b3AnOiAnZnJvbSB0aGUgdG9wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdicmlnaHRuZXNzX3RvcHJpZ2h0JzogJ2Zyb20gdGhlIHRvcC1yaWdodCcsICdicmlnaHRuZXNzX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywgJ2JyaWdodG5lc3NfYm90dG9tcmlnaHQnOiAnZnJvbSB0aGUgYm90dG9tLXJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdicmlnaHRuZXNzX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nLCAnYnJpZ2h0bmVzc19ib3R0b21sZWZ0JzogJ2Zyb20gdGhlIGJvdHRvbS1sZWZ0J30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9maXJzdGxpZ2h0XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzQuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCI0LiBCcmlnaHRuZXNzIHNldHRpbmcgMTpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiNC4gRGlyZWN0aW9uIHNldHRpbmcgMTpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnZGlyZWN0aW9uX2JyaWdodG5lc3NfMCc6ICdubyBsaWdodCcsICdicmlnaHRuZXNzXzI1JzogJ2RpbScsICdicmlnaHRuZXNzXzUwJzogJ21lZGl1bScsICdicmlnaHRuZXNzXzc1JzogJ2JyaWdodCcsICdicmlnaHRuZXNzXzEwMCc6ICd2ZXJ5IGJyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX2FsbGRpcic6ICdmcm9tIGFsbCBkaXJlY3Rpb25zJywgJ2RpcmVjdGlvbl9sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnZGlyZWN0aW9uX3RvcGxlZnQnOiAnZnJvbSB0aGUgdG9wLWxlZnQnLCAnZGlyZWN0aW9uX3RvcCc6ICdmcm9tIHRoZSB0b3AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpcmVjdGlvbl90b3ByaWdodCc6ICdmcm9tIHRoZSB0b3AtcmlnaHQnLCAnZGlyZWN0aW9uX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywgJ2RpcmVjdGlvbl9ib3R0b21yaWdodCc6ICdmcm9tIHRoZSBib3R0b20tcmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpcmVjdGlvbl9ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJywgJ2RpcmVjdGlvbl9ib3R0b21sZWZ0JzogJ2Zyb20gdGhlIGJvdHRvbS1sZWZ0J30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9zZWNvbmRsaWdodFwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc1LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNS4gQnJpZ2h0bmVzcyBzZXR0aW5nIDI6XCIsICdkaXJlY3Rpb24nOiBcIjUuIERpcmVjdGlvbiBzZXR0aW5nIDI6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc183NSc6ICdicmlnaHQnLCAnYnJpZ2h0bmVzc18xMDAnOiAndmVyeSBicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpcmVjdGlvbl9hbGxkaXInOiAnZnJvbSBhbGwgZGlyZWN0aW9ucycsICdkaXJlY3Rpb25fbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2RpcmVjdGlvbl90b3BsZWZ0JzogJ2Zyb20gdGhlIHRvcC1sZWZ0JywgJ2RpcmVjdGlvbl90b3AnOiAnZnJvbSB0aGUgdG9wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fdG9wcmlnaHQnOiAnZnJvbSB0aGUgdG9wLXJpZ2h0JywgJ2RpcmVjdGlvbl9yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsICdkaXJlY3Rpb25fYm90dG9tcmlnaHQnOiAnZnJvbSB0aGUgYm90dG9tLXJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbScsICdkaXJlY3Rpb25fYm90dG9tbGVmdCc6ICdmcm9tIHRoZSBib3R0b20tbGVmdCd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfbGlnaHRkdXJhdGlvblwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc2LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIiwgJ2RpcmVjdGlvbic6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbic6ICcxNSBzZWNvbmRzIG9uJywgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b25vZmYnOiAnMTUgc2Vjb25kcyBvbiwgMTUgc2Vjb25kcyBvZmYnLCAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMzBvbic6ICczMCBzZWNvbmRzIG9uJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF0sXG4gICAgICAgICAgYnV0dG9uczogYnV0dG9uc1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLmNoYWluT2ZBY3RpdmF0aW9uID0ge1xuICAgICAgICAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJzoge1wiZXhwX2NhdGVnb3J5XCI6IFwiZXhwX3Byb2NlZHVyZVwiLCBcImV4cF9wcm9jZWR1cmVcIjogXCJleHBfaG9sZGNvbnN0YW50XCIsIFwiZXhwX2hvbGRjb25zdGFudFwiOiBcImV4cF9maXJzdGxpZ2h0XCIsIFwiZXhwX2ZpcnN0bGlnaHRcIjogXCJleHBfc2Vjb25kbGlnaHRcIiwgXCJleHBfc2Vjb25kbGlnaHRcIjogXCJleHBfbGlnaHRkdXJhdGlvblwifSxcbiAgICAgICAgJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic6IHtcImV4cF9jYXRlZ29yeVwiOiBcImV4cF9wcm9jZWR1cmVcIiwgXCJleHBfcHJvY2VkdXJlXCI6IFwiZXhwX2hvbGRjb25zdGFudFwiLCBcImV4cF9ob2xkY29uc3RhbnRcIjogXCJleHBfZmlyc3RsaWdodFwifVxuICAgICAgfTtcbiAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuXG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ191cGRhdGVGb3JtVmlld3MnLCdzZXRTdGF0ZScsICd2YWxpZGF0ZScsICdnZXRMaWdodENvbmZpZ3VyYXRpb24nXSlcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl91cGRhdGVGb3JtVmlld3MpXG4gICAgICB0aGlzLnNldFN0YXRlKCduZXcnKTtcbiAgICB9XG5cblxuICAgIHZhbGlkYXRlKCkge1xuXG4gICAgICBzd2l0Y2ggKHRoaXMuY2hhaW5TdGF0ZSkge1xuICAgICAgICBjYXNlICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nOlxuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgICAgZmllbGQudXBkYXRlVmFsaWRhdGlvbih7Y3VzdG9tOiB7XG4gICAgICAgICAgICAgIHRlc3Q6ICdjdXN0b20nLFxuICAgICAgICAgICAgICBmbjogKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWwubWF0Y2goJ2RlZmF1bHQnKSkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKSB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSkgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IFwiWW91IGhhdmUgdG8gY2hvb3NlIHZhbGlkIG9wdGlvbnMgZm9yIHRoZSBcIiArICgxICsgaW5kZXgpICsgXCJ0aCBmaWVsZC5cIlxuICAgICAgICAgICAgfX0pXG4gICAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nOlxuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmlkKCkgIT0gJ2V4cF9zZWNvbmRsaWdodCcgJiBmaWVsZC5pZCgpICE9ICdleHBfbGlnaHRkdXJhdGlvbicpIHtcbiAgICAgICAgICAgICAgZmllbGQudXBkYXRlVmFsaWRhdGlvbih7Y3VzdG9tOiB7XG4gICAgICAgICAgICAgICAgdGVzdDogJ2N1c3RvbScsXG4gICAgICAgICAgICAgICAgZm46ICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmICh2YWwubWF0Y2goJ2RlZmF1bHQnKSkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKSB9XG4gICAgICAgICAgICAgICAgICBlbHNlIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKSB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IFwiWW91IGhhdmUgdG8gY2hvb3NlIHZhbGlkIG9wdGlvbnMgZm9yIHRoZSBcIiArICgxICsgaW5kZXgpICsgXCJ0aCBmaWVsZC5cIlxuICAgICAgICAgICAgICB9fSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpZWxkLnVwZGF0ZVZhbGlkYXRpb24oe30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLnZhbGlkYXRlKCk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgdmFyIGxpZ2h0Q29uZmlnID0gdGhpcy5nZXRMaWdodENvbmZpZ3VyYXRpb24oKTtcbiAgICAgIHJldHVybiB7bGlnaHRzOiBsaWdodENvbmZpZ1snbGlnaHRzJ10sIGV4cEZvcm06IHN1cGVyLmV4cG9ydCgpfTtcbiAgICB9XG5cbiAgICBpbXBvcnQoZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYXIoKS50aGVuKCgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5fbW9kZWwuZ2V0RmllbGRzKCkpIHtcbiAgICAgICAgICBpZiAoZGF0YVtmaWVsZC5pZCgpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmaWVsZC5zZXRWYWx1ZShkYXRhW2ZpZWxkLmlkKCldKTtcbiAgICAgICAgICAgIGlmIChkYXRhW2ZpZWxkLmlkKCldID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpIHtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImhpc3RvcmljYWxcIjpcbiAgICAgICAgICB0aGlzLnN0YXRlID0gJ2hpc3RvcmljYWwnXG4gICAgICAgICAgc3dpdGNoIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTt9XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXhwbG9yZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTt9XG4gICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5zaG93KCk7fVxuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5hZ2dyZWdhdGUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibmV3XCI6XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9ICduZXcnO1xuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmlkKCkgPT0gJ2V4cF9jYXRlZ29yeScpIHtcbiAgICAgICAgICAgICAgZmllbGQuZW5hYmxlKClcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgndmlzaWJsZScpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLnNob3coKTtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTt9XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVOZXcoKSB7XG4gICAgICBjb25zdCBuZXdCdG4gPSB0aGlzLmdldEJ1dHRvbignbmV3JylcbiAgICAgIGlmIChuZXdCdG4pIHtcbiAgICAgICAgbmV3QnRuLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVOZXcoKSB7XG4gICAgICBjb25zdCBuZXdCdG4gPSB0aGlzLmdldEJ1dHRvbignbmV3JylcbiAgICAgIGlmIChuZXdCdG4pIHtcbiAgICAgICAgbmV3QnRuLmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldExpZ2h0Q29uZmlndXJhdGlvbigpIHtcbiAgICAgIC8vIFRyYW5zbGF0ZSBmaWVsZHMgaW50byBbe1wibGVmdFwiOiAxMDAsIFwicmlnaHRcIjogMCwgXCJ0b3BcIjogMCwgXCJib3R0b21cIjogMTAwLCBcImR1cmF0aW9uXCI6IDE1fSwgLi4uXVxuICAgICAgbGV0IGRlZmF1bHRDb3VudGVyID0gMDtcbiAgICAgIHRoaXMuZXhwUHJvdG9jb2wgPSB7fVxuICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgIHRoaXMuZXhwUHJvdG9jb2xbZmllbGQuaWQoKV0gPSBmaWVsZC52YWx1ZSgpXG4gICAgICAgIGRlZmF1bHRDb3VudGVyID0gZmllbGQudmFsdWUoKSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnPyBkZWZhdWx0Q291bnRlciArIDEgOiBkZWZhdWx0Q291bnRlcjtcbiAgICAgIH0pXG5cbiAgICAgIGxldCBjb25maWdTdGF0ZSA9IGZhbHNlO1xuICAgICAgaWYgKGRlZmF1bHRDb3VudGVyIDwgNCkgeyBjb25maWdTdGF0ZSA9IHRydWU7IH1cblxuICAgICAgdmFyIGxpZ2h0Q29uZmlnID0ge31cbiAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ10gPSBBcnJheSg0KS5maWxsKC0xKTtcbiAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXSA9IFtdO1xuICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHsgbGlnaHRDb25maWdbJ2xpZ2h0cyddLnB1c2goeydsZWZ0JzogMCwgJ3RvcCc6IDAsICdyaWdodCc6IDAsICdib3R0b20nOiAwLCAnZHVyYXRpb24nOiAxNX0pIH1cblxuICAgICAgaWYgKGNvbmZpZ1N0YXRlKSB7XG4gICAgICAgIHZhciBsaWdodERpcmVjdGlvbnMgPSBbJ2xlZnQnLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbSddO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgdGhlIGZpeGVkIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykge2NvbnNvbGUubG9nKCd0aGVyZSBpcyBhIHByb2JsZW0nKX1cbiAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5tYXRjaCgnZGlyZWN0aW9uJykpIHtcbiAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddID0gQXJyYXkoNCkuZmlsbCgpLm1hcChmdW5jdGlvbigpIHsgcmV0dXJuIHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5tYXRjaCgvXFxkKy8pWzBdKSB9LHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5tYXRjaCgnYnJpZ2h0bmVzcycpKSB7XG4gICAgICAgICAgbGV0IHN1YnN0ciA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5sYXN0SW5kZXhPZignXycpO1xuICAgICAgICAgIHN1YnN0ciA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5zdWJzdHIoc3Vic3RyKzEpO1xuICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gc3Vic3RyLm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyAxMDAgOiAwICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTW9kaWZ5IGFsbCBwYW5lbHNcbiAgICAgICAgdmFyIGxpZ2h0U3VjY2Vzc2lvbnMgPSB7J2xlZnQnOiAndG9wJywgJ3RvcCc6ICdyaWdodCcsICdyaWdodCc6ICdib3R0b20nLCAnYm90dG9tJzogJ2xlZnQnLCAndG9wbGVmdCc6ICd0b3ByaWdodCcsICd0b3ByaWdodCc6ICdib3R0b21yaWdodCcsICdib3R0b21yaWdodCc6ICdib3R0b21sZWZ0JywgJ2JvdHRvbWxlZnQnOiAndG9wbGVmdCd9O1xuICAgICAgICB2YXIgZmlyc3RCcmlnaHRuZXNzID0gbnVsbDtcbiAgICAgICAgdmFyIHNlY29uZEJyaWdodG5lc3MgPSBudWxsO1xuXG4gICAgICAgIGlmICh0aGlzLmNoYWluU3RhdGUgPT0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbicgJiAhKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10gPT0nZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuXG4gICAgICAgICAgc3dpdGNoICh0aGlzLmV4cFByb3RvY29sWydleHBfcHJvY2VkdXJlJ10pIHtcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaW5jcmVhc2UnOlxuICAgICAgICAgICAgICBmaXJzdEJyaWdodG5lc3MgPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gZmlyc3RCcmlnaHRuZXNzICArIDI1ICogcGFuZWw7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RlY3JlYXNlJzpcbiAgICAgICAgICAgICAgZmlyc3RCcmlnaHRuZXNzID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IGZpcnN0QnJpZ2h0bmVzcyAtIDI1ICogcGFuZWw7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2hvbGQnOlxuICAgICAgICAgICAgICBmaXJzdEJyaWdodG5lc3MgPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gZmlyc3RCcmlnaHRuZXNzO1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2Fyb3VuZCc6XG4gICAgICAgICAgICAgIHZhciBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgICAgIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10uc3Vic3RyKGN1cnJMaWdodCsxKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gY3VyckxpZ2h0Lm1hdGNoKGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgICBjdXJyTGlnaHQgPSBsaWdodFN1Y2Nlc3Npb25zW2N1cnJMaWdodF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2hvbGQnOlxuICAgICAgICAgICAgICB2YXIgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5sYXN0SW5kZXhPZignXycpO1xuICAgICAgICAgICAgICBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLnN1YnN0cihjdXJyTGlnaHQrMSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGN1cnJMaWdodC5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJMaWdodCA9PSAnMCcpIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHsgLy8gaWYgaXMgYWx0ZXJuYXRpbmdcblxuICAgICAgICAgIC8vIE1vZGlmeSB0aGUgZmlyc3QgcGFuZWxcbiAgICAgICAgICBpZiAoISh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgnYnJpZ2h0bmVzcycpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF0gPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdIDogMCApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKCdkaXJlY3Rpb24nKSkge1xuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdW2RpcmVjdGlvbl0gPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdIDogMCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE1vZGlmeSB0aGUgcmVtYWluaW5nIHBhbmVsc1xuICAgICAgICAgIGlmICghKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpICYgISh0aGlzLmV4cFByb3RvY29sWydleHBfbGlnaHRkdXJhdGlvbiddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgICB2YXIgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbXTtcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLmV4cFByb3RvY29sWydleHBfbGlnaHRkdXJhdGlvbiddKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b24nOlxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVsyXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMl0gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMSwzXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbm9mZic6XG4gICAgICAgICAgICAgICAgbGV0IGxpZ2h0cyA9IHsnZHVyYXRpb24nOiAxNX07XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4gbGlnaHRzW2RpcmVjdGlvbl0gPSAwKTtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bMV0gPSBsaWdodHNcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzFdID0gMFxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVszXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVsxXVxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bM10gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzFdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMl1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzMwb24nOlxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVsxXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXTtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzFdID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXVxuICAgICAgICAgICAgICAgIG1vZGlmeVNlY29uZExpZ2h0ID0gWzIsM11cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnYnJpZ2h0bmVzcycpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSlcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXSA6IDAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goJ2RpcmVjdGlvbicpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dW2RpcmVjdGlvbl0gPSB0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV0gOiAwICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtb2RpZnlTZWNvbmRMaWdodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFsxXV0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dO1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzFdXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlnaHRDb25maWdcbiAgICB9XG5cbiAgICBfdXBkYXRlRm9ybVZpZXdzKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PSAnZXhwX2NhdGVnb3J5Jykge1xuICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoZmllbGQuaWQoKSAhPSAnZXhwX2NhdGVnb3J5Jyl7XG4gICAgICAgICAgICBmaWVsZC5zaG93RGVzY3JpcHRpb24oZXZ0LmRhdGEuZGVsdGEudmFsdWUubWF0Y2goJ2RlZmF1bHRfY2hvaWNlJykgPyAnZGVmYXVsdF9jaG9pY2UnIDogZXZ0LmRhdGEuZGVsdGEudmFsdWUpXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PSAnbmV3Jykge1xuICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZCwgZXZ0LmRhdGEuZGVsdGEudmFsdWUpXG5cbiAgICAgICAgICB9IGVsc2UgeyAvLyBpZiBpdCBpcyBleHBfY2F0ZWdvcnlcbiAgICAgICAgICAgIGZpZWxkLnNob3dEZXNjcmlwdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG5cbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdleHBfcHJvY2VkdXJlJykgeyAvLyBUaGUgY2hvc2VuIHByb2NlZHVyZSBkZXRlcm1pbmVzIHdoYXQgZmllbGRzIHRvIHNob3dcblxuICAgICAgICAgIC8vRGlzYWJsZSBvcHRpb25zIG9mIGV4cF9maXJzdGxpZ2h0IGRlcGVuZGluZyBvbiB3aGF0IGhhcyBiZWVuIGNob3NlXG4gICAgICAgICAgdmFyIGZpZWxkX2ZpcnN0bGlnaHQgPSB0aGlzLl9maW5kRmllbGQoJ2V4cF9maXJzdGxpZ2h0Jyk7XG4gICAgICAgICAgc3dpdGNoIChldnQuZGF0YS5kZWx0YS52YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kZWNyZWFzZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2JyaWdodG5lc3NfNzV8YnJpZ2h0bmVzc18xMDAnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaW5jcmVhc2UnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdkaXJlY3Rpb25fYnJpZ2h0bmVzc18wfGJyaWdodG5lc3NfMjUnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hcm91bmQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdfbGVmdHxfdG9wbGVmdCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19hbHRlcm5hdGUnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2hvbGQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsJ2JyaWdodG5lc3MnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hbHRlcm5hdGUnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdkaXJlY3Rpb24nKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9ob2xkJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnZGlyZWN0aW9uJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmUtaW5pdGlhbGl6ZSBzdWNjZXNzaXZlIGZpZWxkc1xuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmlkKCkgIT0gJ2V4cF9jYXRlZ29yeScgJiBmaWVsZC5pZCgpICE9ICdleHBfcHJvY2VkdXJlJyAmIHRoaXMuc3RhdGUgPT0gJ25ldycpIHtcbiAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBJcyB0aGUgbmV4dCBmaWVsZCBhY3RpdmF0ZWQ/XG4gICAgICB2YXIgbmV4dEZpZWxkID0gdGhpcy5fZmluZEZpZWxkKHRoaXMuY2hhaW5PZkFjdGl2YXRpb25bdGhpcy5jaGFpblN0YXRlXVtldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWRdKTtcbiAgICAgIGlmIChuZXh0RmllbGQgPyAhbmV4dEZpZWxkLmlzVmlzaWJsZSgpIDogZmFsc2UpIHtcbiAgICAgICAgICBuZXh0RmllbGQuc2V0VmlzaWJpbGl0eSgndmlzaWJsZScpO1xuICAgICAgICAgIG5leHRGaWVsZC5lbmFibGUoKTtcblxuICAgICAgICAgIHZhciBuZXh0bmV4dEZpZWxkID0gdGhpcy5fZmluZEZpZWxkKHRoaXMuY2hhaW5PZkFjdGl2YXRpb25bdGhpcy5jaGFpblN0YXRlXVtuZXh0RmllbGQuaWQoKV0pO1xuICAgICAgICAgIGlmIChuZXh0bmV4dEZpZWxkKSB7bmV4dG5leHRGaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDAuMyl9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZpbmRGaWVsZChmaWVsZElkKSB7XG4gICAgICB2YXIgZmllbGQgPSBudWxsO1xuICAgICAgZm9yICh2YXIgY250ciA9IDA7IGNudHI8dGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0Lmxlbmd0aDsgY250cisrKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHRbY250cl0uaWQoKT09ZmllbGRJZCkge1xuICAgICAgICAgIGZpZWxkID0gdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0W2NudHJdXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWVsZFxuICAgIH1cblxuICAgIF9tb2RpZnlPcHRpb25zKGZpZWxkLCBjcml0ZXJpYSkge1xuICAgICAgT2JqZWN0LmtleXMoZmllbGQuZ2V0T3B0aW9ucygpKS5mb3JFYWNoKChjaG9pY2UpID0+IHtcbiAgICAgICAgaWYgKCFjaG9pY2UubWF0Y2goY3JpdGVyaWEpICYgIWNob2ljZS5tYXRjaCgnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuICAgICAgICAgIGZpZWxkLmRpc2FibGVPcHRpb24oY2hvaWNlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpZWxkLmVuYWJsZU9wdGlvbihjaG9pY2UpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfVxuICB9XG59KVxuIl19
