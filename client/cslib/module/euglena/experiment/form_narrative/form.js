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
      if (Globals.get('AppConfig.system.experimentModality').match('create')) {
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
            options: { 'direction_brightness_default_choice': 'please choose one', 'no_light': 'Show no light', 'brightness': 'Brightness of the light', 'direction': 'Direction of the light' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_procedure",
            description: { 'default_choice': '2. Decide on the previous questions first.', 'brightness': "2. Procedure for changing the brightness:",
              'direction': "2. Procedure for changing the direction:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness_increase': 'Gradually increase the brightness', 'brightness_decrease': 'Gradually decrease the brightness',
              'direction_around': 'Make the light go around', 'direction_hold': 'Keep one direction', 'direction_alternate': 'Alternate between two directions', 'direction_special': 'Special directions' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_holdconstant",
            description: { 'default_choice': '3. Decide on the previous questions first.', 'brightness': "3. Fix the direction of light to:",
              'direction': "3. Fix the brightness of light to:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? { 'direction_brightness_default_choice': 'please choose one', 'direction_25': 'dim', 'direction_50': 'medium', 'direction_100': 'bright',
              'brightness_alldir': 'from all directions', 'brightness_left': 'from the left', 'brightness_top': 'from the top', 'brightness_right': 'from the right', 'brightness_bottom': 'from the bottom' } : { 'direction_brightness_default_choice': 'please choose one', 'direction_25': 'dim', 'direction_50': 'medium', 'direction_100': 'bright',
              'brightness_left': 'from the left', 'brightness_top': 'from the top', 'brightness_right': 'from the right', 'brightness_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_firstlight",
            description: { 'default_choice': '4. Decide on the previous questions first.', 'brightness': "4. Brightness start setting:",
              'direction': "4. Direction start setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? { 'direction_brightness_default_choice': 'please choose one', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_special_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_special_topleft': 'from the top-left', 'direction_special_leftright': 'from the left and right', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' } : { 'direction_brightness_default_choice': 'please choose one', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright', 'direction_left': 'from the left', 'direction_top': 'from the top',
              'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_secondlight",
            description: { 'default_choice': '5. Decide on the previous questions first.', 'brightness': "5. Brightness second setting:", 'direction': "5. Direction second setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_special_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom', 'direction_special_topbottom': 'from the top and bottom', 'direction_special_bottomright': 'from the bottom-right' } : { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_lightduration",
            description: { 'default_choice': '6. Decide on the previous questions first.', 'brightness': "6. Time per setting:", 'direction': "6. Time per setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness_direction_15on': 'alternate 15 seconds on' }, //'brightness_direction_30on': 'each 30 seconds on'
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
        if (lightConfig['brightness'] === [-1, -1, -1, -1]) {
          lightConfig['brightness'] = [0, 0, 0, 0];
        }
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
              case "createandhistory":
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
            // if is alternating or special

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
                case 'brightness_direction_special_30on':
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

          if (evt.data.delta.value === 'no_light') {
            this.chainState = 'final';
          } else {
            this.chainState = 'fullChainOfActivation';
          }
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
              this._modifyOptions(field_firstlight, '_left', '_special');
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
              this._modifyOptions(field_firstlight, 'direction', '_special');
              this.chainState = 'fullChainOfActivation';
              break;
            case 'direction_hold':
              this._modifyOptions(field_firstlight, 'direction', '_special|_topleft');
              this.chainState = 'partialChainOfActivation';
              break;
            case 'direction_special':
              this._modifyOptions(field_firstlight, 'special');
              this.chainState = 'fullChainOfActivation';
              break;
          }

          var field_secondlight = this._findField('exp_secondlight');
          switch (evt.data.delta.value) {
            case 'direction_special':
              this._modifyOptions(field_secondlight, 'special|direction_brightness_0');
              break;
            default:
              var matchValue = null;
              ['direction', 'brightness'].forEach(function (value) {
                if (evt.data.delta.value.match(value)) matchValue = value;
              });

              if (matchValue) {
                this._modifyOptions(field_secondlight, matchValue, 'special');
              }
              break;
          }

          var field_lightduration = this._findField('exp_lightduration');
          switch (evt.data.delta.value) {
            case 'direction_special':
              this._modifyOptions(field_lightduration, 'brightness_direction');
              break;
            default:
              this._modifyOptions(field_lightduration, 'brightness_direction', 'special');
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
        if (this.chainState != 'final') {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkZvcm0iLCJCdXR0b24iLCJFeHBQcm90b2NvbCIsIlV0aWxzIiwiYnV0dG9ucyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiZ2V0IiwibWF0Y2giLCJzcGxpY2UiLCJtb2RlbERhdGEiLCJmaWVsZHMiLCJkZXNjcmlwdGlvbiIsImRlZmF1bHRWYWx1ZSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uIiwiY2hhaW5PZkFjdGl2YXRpb24iLCJjaGFpblN0YXRlIiwiYmluZE1ldGhvZHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX3VwZGF0ZUZvcm1WaWV3cyIsInNldFN0YXRlIiwiX21vZGVsIiwiX2RhdGEiLCJyZWdpb25zIiwiZGVmYXVsdCIsImZvckVhY2giLCJmaWVsZCIsImluZGV4IiwidXBkYXRlVmFsaWRhdGlvbiIsImN1c3RvbSIsInRlc3QiLCJmbiIsInZhbCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3JNZXNzYWdlIiwidmFsaWRhdGUiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0cyIsImV4cEZvcm0iLCJkYXRhIiwiY2xlYXIiLCJ0aGVuIiwiZ2V0RmllbGRzIiwidW5kZWZpbmVkIiwic2V0VmFsdWUiLCJzZXRWaXNpYmlsaXR5Iiwic3RhdGUiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJzZXREZWZhdWx0IiwibmV3QnRuIiwiZGVmYXVsdENvdW50ZXIiLCJleHBQcm90b2NvbCIsInZhbHVlIiwiY29uZmlnU3RhdGUiLCJBcnJheSIsImZpbGwiLCJwYW5lbCIsInB1c2giLCJsaWdodERpcmVjdGlvbnMiLCJjb25zb2xlIiwibG9nIiwibWFwIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImRpcmVjdGlvbiIsImxpZ2h0U3VjY2Vzc2lvbnMiLCJmaXJzdEJyaWdodG5lc3MiLCJzZWNvbmRCcmlnaHRuZXNzIiwiY3VyckxpZ2h0IiwibW9kaWZ5U2Vjb25kTGlnaHQiLCJsZW5ndGgiLCJldnQiLCJzaG93RGVzY3JpcHRpb24iLCJkZWx0YSIsIl9tb2RpZnlPcHRpb25zIiwiZmllbGRfZmlyc3RsaWdodCIsIl9maW5kRmllbGQiLCJmaWVsZF9zZWNvbmRsaWdodCIsIm1hdGNoVmFsdWUiLCJmaWVsZF9saWdodGR1cmF0aW9uIiwibmV4dEZpZWxkIiwiaXNWaXNpYmxlIiwibmV4dG5leHRGaWVsZCIsImZpZWxkSWQiLCJjbnRyIiwiY3JpdGVyaWEiLCJhZGRpdGlvbmFsbHlEaXNhYmxlIiwiT2JqZWN0Iiwia2V5cyIsImdldE9wdGlvbnMiLCJjaG9pY2UiLCJkaXNhYmxlT3B0aW9uIiwiZW5hYmxlT3B0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUNBLE1BQU1FLE9BQU9GLFFBQVEsMEJBQVIsQ0FBYjtBQUFBLE1BQ0VHLFNBQVNILFFBQVEsNkJBQVIsQ0FEWDtBQUFBLE1BRUVJLGNBQWNKLFFBQVEscUJBQVIsQ0FGaEI7QUFBQSxNQUdFSyxRQUFRTCxRQUFRLGlCQUFSLENBSFY7O0FBTUE7QUFBQTs7QUFDRSw4QkFBYztBQUFBOztBQUNaLFVBQU1NLFVBQVUsQ0FBQ0gsT0FBT0ksTUFBUCxDQUFjO0FBQzdCQyxZQUFJLFFBRHlCO0FBRTdCQyxlQUFPLFFBRnNCO0FBRzdCQyxpQkFBUyxDQUFDLDBCQUFELENBSG9CO0FBSTdCQyxtQkFBVztBQUprQixPQUFkLENBQUQsRUFLWlIsT0FBT0ksTUFBUCxDQUFjO0FBQ2hCQyxZQUFJLFdBRFk7QUFFaEJDLGVBQU8sMEJBRlM7QUFHaEJDLGlCQUFTLENBQUMsNkJB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QUE0Qix1RUFBTixJQUFNOztBQUMxREMsZUFBT0MsSUFBUCxDQUFZdkUsTUFBTXdFLFVBQU4sRUFBWixFQUFnQ3pFLE9BQWhDLENBQXdDLFVBQUMwRSxNQUFELEVBQVk7QUFDbEQsY0FBSSxDQUFDQSxPQUFPNUYsS0FBUCxDQUFhd0YsbUJBQWIsS0FBcUMsQ0FBQ0ksT0FBTzVGLEtBQVAsQ0FBYXVGLFFBQWIsQ0FBdkMsS0FBa0UsQ0FBQ0ssT0FBTzVGLEtBQVAsQ0FBYSxxQ0FBYixDQUF2RSxFQUE0SDtBQUMxSG1CLGtCQUFNMEUsYUFBTixDQUFvQkQsTUFBcEI7QUFDRCxXQUZELE1BRU87QUFDTHpFLGtCQUFNMkUsWUFBTixDQUFtQkYsTUFBbkI7QUFDRDtBQUNGLFNBTkQ7QUFRRDtBQXZmSDs7QUFBQTtBQUFBLElBQW9DdkcsSUFBcEM7QUF5ZkQsQ0FqZ0JEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG4gIGNvbnN0IEZvcm0gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0nKSxcbiAgICBCdXR0b24gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQnKSxcbiAgICBFeHBQcm90b2NvbCA9IHJlcXVpcmUoJy4vZXhwcHJvdG9jb2wvZmllbGQnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgRXhwZXJpbWVudEZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBbQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc3VibWl0JyxcbiAgICAgICAgbGFiZWw6ICdTdWJtaXQnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX3N1Ym1pdCddLFxuICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50LlN1Ym1pdCdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBsYWJlbDogJ0FkZCBSZXN1bHRzIHRvIEFnZ3JlZ2F0ZScsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fYWdncmVnYXRlJ10sXG4gICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnXG4gICAgICB9KV07XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykubWF0Y2goJ2NyZWF0ZScpKSB7XG4gICAgICAgIGJ1dHRvbnMuc3BsaWNlKDIsIDAsIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICAgIGlkOiAnbmV3JyxcbiAgICAgICAgICBsYWJlbDogJ05ldyBFeHBlcmltZW50JyxcbiAgICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX25ldyddLFxuICAgICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCdcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBzdXBlcih7XG4gICAgICAgIG1vZGVsRGF0YToge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBjbGFzc2VzOiBbXCJmb3JtX19leHBlcmltZW50XCJdLFxuICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2NhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIjEuIFZhcmlhYmxlIHRvIGJlIGNoYW5nZWQ6XCIsXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnbm9fbGlnaHQnOiAnU2hvdyBubyBsaWdodCcsICdicmlnaHRuZXNzJzogJ0JyaWdodG5lc3Mgb2YgdGhlIGxpZ2h0JywgJ2RpcmVjdGlvbic6ICdEaXJlY3Rpb24gb2YgdGhlIGxpZ2h0J30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9wcm9jZWR1cmVcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnMi4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjIuIFByb2NlZHVyZSBmb3IgY2hhbmdpbmcgdGhlIGJyaWdodG5lc3M6XCIsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb24nOiBcIjIuIFByb2NlZHVyZSBmb3IgY2hhbmdpbmcgdGhlIGRpcmVjdGlvbjpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6ICdHcmFkdWFsbHkgaW5jcmVhc2UgdGhlIGJyaWdodG5lc3MnLCAnYnJpZ2h0bmVzc19kZWNyZWFzZSc6ICdHcmFkdWFsbHkgZGVjcmVhc2UgdGhlIGJyaWdodG5lc3MnLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uX2Fyb3VuZCc6ICdNYWtlIHRoZSBsaWdodCBnbyBhcm91bmQnLCAnZGlyZWN0aW9uX2hvbGQnOiAnS2VlcCBvbmUgZGlyZWN0aW9uJywgJ2RpcmVjdGlvbl9hbHRlcm5hdGUnOiAnQWx0ZXJuYXRlIGJldHdlZW4gdHdvIGRpcmVjdGlvbnMnLCAnZGlyZWN0aW9uX3NwZWNpYWwnOiAnU3BlY2lhbCBkaXJlY3Rpb25zJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9ob2xkY29uc3RhbnRcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnMy4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjMuIEZpeCB0aGUgZGlyZWN0aW9uIG9mIGxpZ2h0IHRvOlwiLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uJzogXCIzLiBGaXggdGhlIGJyaWdodG5lc3Mgb2YgbGlnaHQgdG86XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZm9ybU9wdGlvbnMnKSA9PSAnY29tcGxldGUnID8geydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fMjUnOiAnZGltJywgJ2RpcmVjdGlvbl81MCc6ICdtZWRpdW0nLCAnZGlyZWN0aW9uXzEwMCc6ICdicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JyaWdodG5lc3NfYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnYnJpZ2h0bmVzc19sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnYnJpZ2h0bmVzc190b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2JyaWdodG5lc3NfcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCdicmlnaHRuZXNzX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl8yNSc6ICdkaW0nLCAnZGlyZWN0aW9uXzUwJzogJ21lZGl1bScsICdkaXJlY3Rpb25fMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnJpZ2h0bmVzc19sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnYnJpZ2h0bmVzc190b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2JyaWdodG5lc3NfcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCdicmlnaHRuZXNzX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2ZpcnN0bGlnaHRcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnNC4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjQuIEJyaWdodG5lc3Mgc3RhcnQgc2V0dGluZzpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiNC4gRGlyZWN0aW9uIHN0YXJ0IHNldHRpbmc6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZm9ybU9wdGlvbnMnKSA9PSAnY29tcGxldGUnID8geydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzXzI1JzogJ2RpbScsICdicmlnaHRuZXNzXzUwJzogJ21lZGl1bScsICdicmlnaHRuZXNzXzEwMCc6ICdicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpcmVjdGlvbl9zcGVjaWFsX2FsbGRpcic6ICdmcm9tIGFsbCBkaXJlY3Rpb25zJywgJ2RpcmVjdGlvbl9sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnZGlyZWN0aW9uX3NwZWNpYWxfdG9wbGVmdCc6ICdmcm9tIHRoZSB0b3AtbGVmdCcsICdkaXJlY3Rpb25fc3BlY2lhbF9sZWZ0cmlnaHQnOiAnZnJvbSB0aGUgbGVmdCBhbmQgcmlnaHQnLCAnZGlyZWN0aW9uX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnZGlyZWN0aW9uX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywgJ2RpcmVjdGlvbl9ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJ30gOlxuICAgICAgICAgICAgICAgICAgICAgICAgeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzXzI1JzogJ2RpbScsICdicmlnaHRuZXNzXzUwJzogJ21lZGl1bScsICdicmlnaHRuZXNzXzEwMCc6ICdicmlnaHQnLCAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywgJ2RpcmVjdGlvbl9ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9zZWNvbmRsaWdodFwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc1LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNS4gQnJpZ2h0bmVzcyBzZWNvbmQgc2V0dGluZzpcIiwgJ2RpcmVjdGlvbic6IFwiNS4gRGlyZWN0aW9uIHNlY29uZCBzZXR0aW5nOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50LmZvcm1PcHRpb25zJykgPT0gJ2NvbXBsZXRlJyA/IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnZGlyZWN0aW9uX2JyaWdodG5lc3NfMCc6ICdubyBsaWdodCcsICdicmlnaHRuZXNzXzI1JzogJ2RpbScsICdicmlnaHRuZXNzXzUwJzogJ21lZGl1bScsICdicmlnaHRuZXNzXzEwMCc6ICdicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpcmVjdGlvbl9zcGVjaWFsX2FsbGRpcic6ICdmcm9tIGFsbCBkaXJlY3Rpb25zJywgJ2RpcmVjdGlvbl9sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnZGlyZWN0aW9uX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnZGlyZWN0aW9uX3JpZ2h0JzogJ2Zyb20gdGhlIHJpZ2h0JywgJ2RpcmVjdGlvbl9ib3R0b20nOiAnZnJvbSB0aGUgYm90dG9tJywgJ2RpcmVjdGlvbl9zcGVjaWFsX3RvcGJvdHRvbSc6ICdmcm9tIHRoZSB0b3AgYW5kIGJvdHRvbScsICdkaXJlY3Rpb25fc3BlY2lhbF9ib3R0b21yaWdodCc6ICdmcm9tIHRoZSBib3R0b20tcmlnaHQnLH0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fYnJpZ2h0bmVzc18wJzogJ25vIGxpZ2h0JywgJ2JyaWdodG5lc3NfMjUnOiAnZGltJywgJ2JyaWdodG5lc3NfNTAnOiAnbWVkaXVtJywgJ2JyaWdodG5lc3NfMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2xpZ2h0ZHVyYXRpb25cIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnNi4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjYuIFRpbWUgcGVyIHNldHRpbmc6XCIsICdkaXJlY3Rpb24nOiBcIjYuIFRpbWUgcGVyIHNldHRpbmc6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b24nOiAnYWx0ZXJuYXRlIDE1IHNlY29uZHMgb24nfSwgLy8nYnJpZ2h0bmVzc19kaXJlY3Rpb25fMzBvbic6ICdlYWNoIDMwIHNlY29uZHMgb24nXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF0sXG4gICAgICAgICAgYnV0dG9uczogYnV0dG9uc1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLmNoYWluT2ZBY3RpdmF0aW9uID0ge1xuICAgICAgICAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJzoge1wiZXhwX2NhdGVnb3J5XCI6IFwiZXhwX3Byb2NlZHVyZVwiLCBcImV4cF9wcm9jZWR1cmVcIjogXCJleHBfaG9sZGNvbnN0YW50XCIsIFwiZXhwX2hvbGRjb25zdGFudFwiOiBcImV4cF9maXJzdGxpZ2h0XCIsIFwiZXhwX2ZpcnN0bGlnaHRcIjogXCJleHBfc2Vjb25kbGlnaHRcIiwgXCJleHBfc2Vjb25kbGlnaHRcIjogXCJleHBfbGlnaHRkdXJhdGlvblwifSxcbiAgICAgICAgJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic6IHtcImV4cF9jYXRlZ29yeVwiOiBcImV4cF9wcm9jZWR1cmVcIiwgXCJleHBfcHJvY2VkdXJlXCI6IFwiZXhwX2hvbGRjb25zdGFudFwiLCBcImV4cF9ob2xkY29uc3RhbnRcIjogXCJleHBfZmlyc3RsaWdodFwifVxuICAgICAgfTtcbiAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuXG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ191cGRhdGVGb3JtVmlld3MnLCdzZXRTdGF0ZScsICd2YWxpZGF0ZScsICdnZXRMaWdodENvbmZpZ3VyYXRpb24nXSlcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignRm9ybS5GaWVsZENoYW5nZWQnLCB0aGlzLl91cGRhdGVGb3JtVmlld3MpXG4gICAgICB0aGlzLnNldFN0YXRlKCduZXcnKTtcbiAgICB9XG5cblxuICAgIHZhbGlkYXRlKCkge1xuXG4gICAgICBzd2l0Y2ggKHRoaXMuY2hhaW5TdGF0ZSkge1xuICAgICAgICBjYXNlICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nOlxuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgICAgZmllbGQudXBkYXRlVmFsaWRhdGlvbih7Y3VzdG9tOiB7XG4gICAgICAgICAgICAgIHRlc3Q6ICdjdXN0b20nLFxuICAgICAgICAgICAgICBmbjogKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWwubWF0Y2goJ2RlZmF1bHQnKSkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKSB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSkgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IFwiWW91IGhhdmUgdG8gY2hvb3NlIHZhbGlkIG9wdGlvbnMgZm9yIHRoZSBcIiArICgxICsgaW5kZXgpICsgXCJ0aCBmaWVsZC5cIlxuICAgICAgICAgICAgfX0pXG4gICAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nOlxuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmlkKCkgIT0gJ2V4cF9zZWNvbmRsaWdodCcgJiBmaWVsZC5pZCgpICE9ICdleHBfbGlnaHRkdXJhdGlvbicpIHtcbiAgICAgICAgICAgICAgZmllbGQudXBkYXRlVmFsaWRhdGlvbih7Y3VzdG9tOiB7XG4gICAgICAgICAgICAgICAgdGVzdDogJ2N1c3RvbScsXG4gICAgICAgICAgICAgICAgZm46ICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmICh2YWwubWF0Y2goJ2RlZmF1bHQnKSkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKSB9XG4gICAgICAgICAgICAgICAgICBlbHNlIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKSB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IFwiWW91IGhhdmUgdG8gY2hvb3NlIHZhbGlkIG9wdGlvbnMgZm9yIHRoZSBcIiArICgxICsgaW5kZXgpICsgXCJ0aCBmaWVsZC5cIlxuICAgICAgICAgICAgICB9fSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpZWxkLnVwZGF0ZVZhbGlkYXRpb24oe30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLnZhbGlkYXRlKCk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgdmFyIGxpZ2h0Q29uZmlnID0gdGhpcy5nZXRMaWdodENvbmZpZ3VyYXRpb24oKTtcbiAgICAgIGlmIChsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddID09PSBbLTEsLTEsLTEsLTFdKSB7XG4gICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ10gPSBbMCwwLDAsMF1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7bGlnaHRzOiBsaWdodENvbmZpZ1snbGlnaHRzJ10sIGV4cEZvcm06IHN1cGVyLmV4cG9ydCgpfTtcbiAgICB9XG5cbiAgICBpbXBvcnQoZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYXIoKS50aGVuKCgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgdGhpcy5fbW9kZWwuZ2V0RmllbGRzKCkpIHtcbiAgICAgICAgICBpZiAoZGF0YVtmaWVsZC5pZCgpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmaWVsZC5zZXRWYWx1ZShkYXRhW2ZpZWxkLmlkKCldKTtcbiAgICAgICAgICAgIGlmIChkYXRhW2ZpZWxkLmlkKCldID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpIHtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBcImhpc3RvcmljYWxcIjpcbiAgICAgICAgICB0aGlzLnN0YXRlID0gJ2hpc3RvcmljYWwnXG4gICAgICAgICAgc3dpdGNoIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwib2JzZXJ2ZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTt9XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZXhwbG9yZVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTt9XG4gICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVcIjpcbiAgICAgICAgICAgIGNhc2UgXCJjcmVhdGVhbmRoaXN0b3J5XCI6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuc2hvdygpO31cbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuYWdncmVnYXRlJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLnNob3coKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgIHRoaXMuc3RhdGUgPSAnbmV3JztcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pZCgpID09ICdleHBfY2F0ZWdvcnknKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmVuYWJsZSgpXG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNhYmxlTmV3KCkge1xuICAgICAgY29uc3QgbmV3QnRuID0gdGhpcy5nZXRCdXR0b24oJ25ldycpXG4gICAgICBpZiAobmV3QnRuKSB7XG4gICAgICAgIG5ld0J0bi5kaXNhYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlTmV3KCkge1xuICAgICAgY29uc3QgbmV3QnRuID0gdGhpcy5nZXRCdXR0b24oJ25ldycpXG4gICAgICBpZiAobmV3QnRuKSB7XG4gICAgICAgIG5ld0J0bi5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMaWdodENvbmZpZ3VyYXRpb24oKSB7XG4gICAgICAvLyBUcmFuc2xhdGUgZmllbGRzIGludG8gW3tcImxlZnRcIjogMTAwLCBcInJpZ2h0XCI6IDAsIFwidG9wXCI6IDAsIFwiYm90dG9tXCI6IDEwMCwgXCJkdXJhdGlvblwiOiAxNX0sIC4uLl1cbiAgICAgIGxldCBkZWZhdWx0Q291bnRlciA9IDA7XG4gICAgICB0aGlzLmV4cFByb3RvY29sID0ge31cbiAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICB0aGlzLmV4cFByb3RvY29sW2ZpZWxkLmlkKCldID0gZmllbGQudmFsdWUoKVxuICAgICAgICBkZWZhdWx0Q291bnRlciA9IGZpZWxkLnZhbHVlKCkgPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJz8gZGVmYXVsdENvdW50ZXIgKyAxIDogZGVmYXVsdENvdW50ZXI7XG4gICAgICB9KVxuXG4gICAgICBsZXQgY29uZmlnU3RhdGUgPSBmYWxzZTtcbiAgICAgIGlmIChkZWZhdWx0Q291bnRlciA8IDMpIHsgY29uZmlnU3RhdGUgPSB0cnVlOyB9XG5cbiAgICAgIHZhciBsaWdodENvbmZpZyA9IHt9XG4gICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddID0gQXJyYXkoNCkuZmlsbCgtMSk7XG4gICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ10gPSBbXTtcbiAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7IGxpZ2h0Q29uZmlnWydsaWdodHMnXS5wdXNoKHsnbGVmdCc6IDAsICd0b3AnOiAwLCAncmlnaHQnOiAwLCAnYm90dG9tJzogMCwgJ2R1cmF0aW9uJzogMTV9KSB9XG5cbiAgICAgIGlmIChjb25maWdTdGF0ZSkge1xuICAgICAgICB2YXIgbGlnaHREaXJlY3Rpb25zID0gWydsZWZ0JywgJ3RvcCcsICdyaWdodCcsICdib3R0b20nXTtcblxuICAgICAgICAvLyBFeHRyYWN0IHRoZSBmaXhlZCB2YWx1ZVxuICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpIHtjb25zb2xlLmxvZygndGhlcmUgaXMgYSBwcm9ibGVtJyl9XG4gICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubWF0Y2goJ2RpcmVjdGlvbicpKSB7XG4gICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXSA9IEFycmF5KDQpLmZpbGwoKS5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubWF0Y2goL1xcZCsvKVswXSkgfSx0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubWF0Y2goJ2JyaWdodG5lc3MnKSkge1xuICAgICAgICAgIGxldCBzdWJzdHIgPSB0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICBzdWJzdHIgPSB0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10uc3Vic3RyKHN1YnN0cisxKTtcbiAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IHN1YnN0ci5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gMTAwIDogMCApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vZGlmeSBhbGwgcGFuZWxzXG4gICAgICAgIHZhciBsaWdodFN1Y2Nlc3Npb25zID0geydsZWZ0JzogJ3RvcCcsICd0b3AnOiAncmlnaHQnLCAncmlnaHQnOiAnYm90dG9tJywgJ2JvdHRvbSc6ICdsZWZ0JywgJ3RvcGxlZnQnOiAndG9wcmlnaHQnLCAndG9wcmlnaHQnOiAnYm90dG9tcmlnaHQnLCAnYm90dG9tcmlnaHQnOiAnYm90dG9tbGVmdCcsICdib3R0b21sZWZ0JzogJ3RvcGxlZnQnfTtcbiAgICAgICAgdmFyIGZpcnN0QnJpZ2h0bmVzcyA9IG51bGw7XG4gICAgICAgIHZhciBzZWNvbmRCcmlnaHRuZXNzID0gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5jaGFpblN0YXRlID09ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nICYgISh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddID09J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcblxuICAgICAgICAgIHN3aXRjaCAodGhpcy5leHBQcm90b2NvbFsnZXhwX3Byb2NlZHVyZSddKSB7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2luY3JlYXNlJzpcbiAgICAgICAgICAgICAgZmlyc3RCcmlnaHRuZXNzID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IGZpcnN0QnJpZ2h0bmVzcyAgKyAyNSAqIHBhbmVsO1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kZWNyZWFzZSc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3MgLSAyNSAqIHBhbmVsO1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19ob2xkJzpcbiAgICAgICAgICAgICAgZmlyc3RCcmlnaHRuZXNzID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IGZpcnN0QnJpZ2h0bmVzcztcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hcm91bmQnOlxuICAgICAgICAgICAgICB2YXIgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5sYXN0SW5kZXhPZignXycpO1xuICAgICAgICAgICAgICBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLnN1YnN0cihjdXJyTGlnaHQrMSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGN1cnJMaWdodC5tYXRjaChkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gbGlnaHRTdWNjZXNzaW9uc1tjdXJyTGlnaHRdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9ob2xkJzpcbiAgICAgICAgICAgICAgdmFyIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5zdWJzdHIoY3VyckxpZ2h0KzEpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBjdXJyTGlnaHQubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyTGlnaHQgPT0gJzAnKSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7IC8vIGlmIGlzIGFsdGVybmF0aW5nIG9yIHNwZWNpYWxcblxuICAgICAgICAgIC8vIE1vZGlmeSB0aGUgZmlyc3QgcGFuZWxcbiAgICAgICAgICBpZiAoISh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgnYnJpZ2h0bmVzcycpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF0gPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdIDogMCApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKCdkaXJlY3Rpb24nKSkge1xuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdW2RpcmVjdGlvbl0gPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdIDogMCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE1vZGlmeSB0aGUgcmVtYWluaW5nIHBhbmVsc1xuICAgICAgICAgIGlmICghKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpICYgISh0aGlzLmV4cFByb3RvY29sWydleHBfbGlnaHRkdXJhdGlvbiddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgICB2YXIgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbXTtcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLmV4cFByb3RvY29sWydleHBfbGlnaHRkdXJhdGlvbiddKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b24nOlxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVsyXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMl0gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMSwzXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbm9mZic6XG4gICAgICAgICAgICAgICAgbGV0IGxpZ2h0cyA9IHsnZHVyYXRpb24nOiAxNX07XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4gbGlnaHRzW2RpcmVjdGlvbl0gPSAwKTtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bMV0gPSBsaWdodHNcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzFdID0gMFxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVszXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVsxXVxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bM10gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzFdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMl1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGlyZWN0aW9uX3NwZWNpYWxfMzBvbic6XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdO1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV0gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMiwzXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV0gPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKVxuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dIDogMCApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnZGlyZWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXSA6IDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1vZGlmeVNlY29uZExpZ2h0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzFdXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV07XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMV1dID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsaWdodENvbmZpZ1xuICAgIH1cblxuICAgIF91cGRhdGVGb3JtVmlld3MoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdleHBfY2F0ZWdvcnknKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfY2F0ZWdvcnknKXtcbiAgICAgICAgICAgIGZpZWxkLnNob3dEZXNjcmlwdGlvbihldnQuZGF0YS5kZWx0YS52YWx1ZS5tYXRjaCgnZGVmYXVsdF9jaG9pY2UnKSA/ICdkZWZhdWx0X2Nob2ljZScgOiBldnQuZGF0YS5kZWx0YS52YWx1ZSlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlID09ICduZXcnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkLCBldnQuZGF0YS5kZWx0YS52YWx1ZSlcblxuICAgICAgICAgIH0gZWxzZSB7IC8vIGlmIGl0IGlzIGV4cF9jYXRlZ29yeVxuICAgICAgICAgICAgZmllbGQuc2hvd0Rlc2NyaXB0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZXZ0LmRhdGEuZGVsdGEudmFsdWUgPT09ICdub19saWdodCcpIHtcbiAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZmluYWwnO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgIH1cblxuXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PSAnZXhwX3Byb2NlZHVyZScpIHsgLy8gVGhlIGNob3NlbiBwcm9jZWR1cmUgZGV0ZXJtaW5lcyB3aGF0IGZpZWxkcyB0byBzaG93XG5cbiAgICAgICAgICAvL0Rpc2FibGUgb3B0aW9ucyBvZiBleHBfZmlyc3RsaWdodCBkZXBlbmRpbmcgb24gd2hhdCBoYXMgYmVlbiBjaG9zZVxuICAgICAgICAgIHZhciBmaWVsZF9maXJzdGxpZ2h0ID0gdGhpcy5fZmluZEZpZWxkKCdleHBfZmlyc3RsaWdodCcpO1xuICAgICAgICAgIHN3aXRjaCAoZXZ0LmRhdGEuZGVsdGEudmFsdWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGVjcmVhc2UnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzXzEwMCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2JyaWdodG5lc3NfMjUnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hcm91bmQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdfbGVmdCcsJ19zcGVjaWFsJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2FsdGVybmF0ZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2JyaWdodG5lc3MnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaG9sZCc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwnYnJpZ2h0bmVzcycpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2FsdGVybmF0ZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2RpcmVjdGlvbicsJ19zcGVjaWFsJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25faG9sZCc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2RpcmVjdGlvbicsICdfc3BlY2lhbHxfdG9wbGVmdCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX3NwZWNpYWwnOlxuICAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCdzcGVjaWFsJylcbiAgICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGZpZWxkX3NlY29uZGxpZ2h0ID0gdGhpcy5fZmluZEZpZWxkKCdleHBfc2Vjb25kbGlnaHQnKTtcbiAgICAgICAgICBzd2l0Y2ggKGV2dC5kYXRhLmRlbHRhLnZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fc3BlY2lhbCc6XG4gICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX3NlY29uZGxpZ2h0LCdzcGVjaWFsfGRpcmVjdGlvbl9icmlnaHRuZXNzXzAnKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBsZXQgbWF0Y2hWYWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgIFsnZGlyZWN0aW9uJywnYnJpZ2h0bmVzcyddLmZvckVhY2godmFsdWUgPT4geyBpZihldnQuZGF0YS5kZWx0YS52YWx1ZS5tYXRjaCh2YWx1ZSkpIG1hdGNoVmFsdWUgPSB2YWx1ZX0pXG5cbiAgICAgICAgICAgICAgaWYgKG1hdGNoVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfc2Vjb25kbGlnaHQsbWF0Y2hWYWx1ZSwnc3BlY2lhbCcpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGZpZWxkX2xpZ2h0ZHVyYXRpb24gPSB0aGlzLl9maW5kRmllbGQoJ2V4cF9saWdodGR1cmF0aW9uJyk7XG4gICAgICAgICAgc3dpdGNoIChldnQuZGF0YS5kZWx0YS52YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX3NwZWNpYWwnOlxuICAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9saWdodGR1cmF0aW9uLCdicmlnaHRuZXNzX2RpcmVjdGlvbicpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfbGlnaHRkdXJhdGlvbiwnYnJpZ2h0bmVzc19kaXJlY3Rpb24nLCdzcGVjaWFsJylcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlLWluaXRpYWxpemUgc3VjY2Vzc2l2ZSBmaWVsZHNcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfY2F0ZWdvcnknICYgZmllbGQuaWQoKSAhPSAnZXhwX3Byb2NlZHVyZScgJiB0aGlzLnN0YXRlID09ICduZXcnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gSXMgdGhlIG5leHQgZmllbGQgYWN0aXZhdGVkP1xuICAgICAgaWYgKHRoaXMuY2hhaW5TdGF0ZSAhPSAnZmluYWwnKSB7XG4gICAgICAgIHZhciBuZXh0RmllbGQgPSB0aGlzLl9maW5kRmllbGQodGhpcy5jaGFpbk9mQWN0aXZhdGlvblt0aGlzLmNoYWluU3RhdGVdW2V2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZF0pO1xuICAgICAgICBpZiAobmV4dEZpZWxkID8gIW5leHRGaWVsZC5pc1Zpc2libGUoKSA6IGZhbHNlKSB7XG4gICAgICAgICAgICBuZXh0RmllbGQuc2V0VmlzaWJpbGl0eSgndmlzaWJsZScpO1xuICAgICAgICAgICAgbmV4dEZpZWxkLmVuYWJsZSgpO1xuXG4gICAgICAgICAgICB2YXIgbmV4dG5leHRGaWVsZCA9IHRoaXMuX2ZpbmRGaWVsZCh0aGlzLmNoYWluT2ZBY3RpdmF0aW9uW3RoaXMuY2hhaW5TdGF0ZV1bbmV4dEZpZWxkLmlkKCldKTtcbiAgICAgICAgICAgIGlmIChuZXh0bmV4dEZpZWxkKSB7bmV4dG5leHRGaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDAuMyl9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZmluZEZpZWxkKGZpZWxkSWQpIHtcbiAgICAgIHZhciBmaWVsZCA9IG51bGw7XG4gICAgICBmb3IgKHZhciBjbnRyID0gMDsgY250cjx0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQubGVuZ3RoOyBjbnRyKyspIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdFtjbnRyXS5pZCgpPT1maWVsZElkKSB7XG4gICAgICAgICAgZmllbGQgPSB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHRbY250cl1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkXG4gICAgfVxuXG4gICAgX21vZGlmeU9wdGlvbnMoZmllbGQsIGNyaXRlcmlhLCBhZGRpdGlvbmFsbHlEaXNhYmxlID0gbnVsbCkge1xuICAgICAgT2JqZWN0LmtleXMoZmllbGQuZ2V0T3B0aW9ucygpKS5mb3JFYWNoKChjaG9pY2UpID0+IHtcbiAgICAgICAgaWYgKChjaG9pY2UubWF0Y2goYWRkaXRpb25hbGx5RGlzYWJsZSkgfHwgIWNob2ljZS5tYXRjaChjcml0ZXJpYSkpICYmICFjaG9pY2UubWF0Y2goJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICBmaWVsZC5kaXNhYmxlT3B0aW9uKGNob2ljZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWVsZC5lbmFibGVPcHRpb24oY2hvaWNlKVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxufSlcbiJdfQ==
