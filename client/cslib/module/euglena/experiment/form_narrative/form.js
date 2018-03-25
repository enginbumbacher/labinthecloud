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
            options: { 'direction_brightness_default_choice': 'please choose one', 'brightness_direction_15on': 'alternate 15 seconds on', 'brightness_direction_special_30on': 'each 30 seconds on' }, //'brightness_direction_30on': 'each 30 seconds on'
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkZvcm0iLCJCdXR0b24iLCJFeHBQcm90b2NvbCIsIlV0aWxzIiwiYnV0dG9ucyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiZ2V0IiwibWF0Y2giLCJzcGxpY2UiLCJtb2RlbERhdGEiLCJmaWVsZHMiLCJkZXNjcmlwdGlvbiIsImRlZmF1bHRWYWx1ZSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uIiwiY2hhaW5PZkFjdGl2YXRpb24iLCJjaGFpblN0YXRlIiwiYmluZE1ldGhvZHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX3VwZGF0ZUZvcm1WaWV3cyIsInNldFN0YXRlIiwiX21vZGVsIiwiX2RhdGEiLCJyZWdpb25zIiwiZGVmYXVsdCIsImZvckVhY2giLCJmaWVsZCIsImluZGV4IiwidXBkYXRlVmFsaWRhdGlvbiIsImN1c3RvbSIsInRlc3QiLCJmbiIsInZhbCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3JNZXNzYWdlIiwidmFsaWRhdGUiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0cyIsImV4cEZvcm0iLCJkYXRhIiwiY2xlYXIiLCJ0aGVuIiwiZ2V0RmllbGRzIiwidW5kZWZpbmVkIiwic2V0VmFsdWUiLCJzZXRWaXNpYmlsaXR5Iiwic3RhdGUiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJzZXREZWZhdWx0IiwibmV3QnRuIiwiZGVmYXVsdENvdW50ZXIiLCJleHBQcm90b2NvbCIsInZhbHVlIiwiY29uZmlnU3RhdGUiLCJBcnJheSIsImZpbGwiLCJwYW5lbCIsInB1c2giLCJsaWdodERpcmVjdGlvbnMiLCJjb25zb2xlIiwibG9nIiwibWFwIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImRpcmVjdGlvbiIsImxpZ2h0U3VjY2Vzc2lvbnMiLCJmaXJzdEJyaWdodG5lc3MiLCJzZWNvbmRCcmlnaHRuZXNzIiwiY3VyckxpZ2h0IiwibW9kaWZ5U2Vjb25kTGlnaHQiLCJsZW5ndGgiLCJldnQiLCJzaG93RGVzY3JpcHRpb24iLCJkZWx0YSIsIl9tb2RpZnlPcHRpb25zIiwiZmllbGRfZmlyc3RsaWdodCIsIl9maW5kRmllbGQiLCJmaWVsZF9zZWNvbmRsaWdodCIsIm1hdGNoVmFsdWUiLCJmaWVsZF9saWdodGR1cmF0aW9uIiwibmV4dEZpZWxkIiwiaXNWaXNpYmxlIiwibmV4dG5leHRGaWVsZCIsImZpZWxkSWQiLCJjbnRyIiwiY3JpdGVyaWEiLCJhZGRpdGlvbmFsbHlEaXNhYmxlIiwiT2JqZWN0Iiwia2V5cyIsImdldE9wdGlvbnMiLCJjaG9pY2UiLCJkaXNhYmxlT3B0aW9uIiwiZW5hYmxlT3B0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUNBLE1BQU1FLE9BQU9GLFFBQVEsMEJBQVIsQ0FBYjtBQUFBLE1BQ0VHLFNBQVNILFFBQVEsNkJBQVIsQ0FEWDtBQUFBLE1BRUVJLGNBQWNKLFFBQVEscUJBQVIsQ0FGaEI7QUFBQSxNQUdFSyxRQUFRTCxRQUFRLGlCQUFSLENBSFY7O0FBTUE7QUFBQTs7QUFDRSw4QkFBYztBQUFBOztBQUNaLFVBQU1NLFVBQVUsQ0FBQ0gsT0FBT0ksTUFBUCxDQUFjO0FBQzdCQyxZQUFJLFFBRHlCO0FBRTdCQyxlQUFPLFFBRnNCO0FBRzdCQyxpQkFBUyxDQUFDLDBCQUFELENBSG9CO0FBSTdCQyxtQkFBVztBQUprQixPQUFkLENBQUQsRUFLWlIsT0FBT0ksTUFBUCxDQUFjO0FBQ2hCQyxZQUFJLFdBRFk7QUFFaEJDLGVBQU8sMEJBRlM7QUFHaEJDLGlCQUFTLENBQUMsNkJB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QThlOEQ7QUFBQSxZQUE1QkMsbUJBQTRCLHVFQUFOLElBQU07O0FBQzFEQyxlQUFPQyxJQUFQLENBQVl2RSxNQUFNd0UsVUFBTixFQUFaLEVBQWdDekUsT0FBaEMsQ0FBd0MsVUFBQzBFLE1BQUQsRUFBWTtBQUNsRCxjQUFJLENBQUNBLE9BQU81RixLQUFQLENBQWF3RixtQkFBYixLQUFxQyxDQUFDSSxPQUFPNUYsS0FBUCxDQUFhdUYsUUFBYixDQUF2QyxLQUFrRSxDQUFDSyxPQUFPNUYsS0FBUCxDQUFhLHFDQUFiLENBQXZFLEVBQTRIO0FBQzFIbUIsa0JBQU0wRSxhQUFOLENBQW9CRCxNQUFwQjtBQUNELFdBRkQsTUFFTztBQUNMekUsa0JBQU0yRSxZQUFOLENBQW1CRixNQUFuQjtBQUNEO0FBQ0YsU0FORDtBQVFEO0FBdmZIOztBQUFBO0FBQUEsSUFBb0N2RyxJQUFwQztBQXlmRCxDQWpnQkQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtX25hcnJhdGl2ZS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIEJ1dHRvbiA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2J1dHRvbi9maWVsZCcpLFxuICAgIEV4cFByb3RvY29sID0gcmVxdWlyZSgnLi9leHBwcm90b2NvbC9maWVsZCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBFeHBlcmltZW50Rm9ybSBleHRlbmRzIEZvcm0ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgY29uc3QgYnV0dG9ucyA9IFtCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzdWJtaXQnLFxuICAgICAgICBsYWJlbDogJ1N1Ym1pdCcsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fc3VibWl0J10sXG4gICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuU3VibWl0J1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGxhYmVsOiAnQWRkIFJlc3VsdHMgdG8gQWdncmVnYXRlJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19hZ2dyZWdhdGUnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZSdcbiAgICAgIH0pXTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS5tYXRjaCgnY3JlYXRlJykpIHtcbiAgICAgICAgYnV0dG9ucy5zcGxpY2UoMiwgMCwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICduZXcnLFxuICAgICAgICAgIGxhYmVsOiAnTmV3IEV4cGVyaW1lbnQnLFxuICAgICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fbmV3J10sXG4gICAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5OZXdSZXF1ZXN0J1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHN1cGVyKHtcbiAgICAgICAgbW9kZWxEYXRhOiB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGNsYXNzZXM6IFtcImZvcm1fX2V4cGVyaW1lbnRcIl0sXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiMS4gVmFyaWFibGUgdG8gYmUgY2hhbmdlZDpcIixcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdub19saWdodCc6ICdTaG93IG5vIGxpZ2h0JywgJ2JyaWdodG5lc3MnOiAnQnJpZ2h0bmVzcyBvZiB0aGUgbGlnaHQnLCAnZGlyZWN0aW9uJzogJ0RpcmVjdGlvbiBvZiB0aGUgbGlnaHQnfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX3Byb2NlZHVyZVwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICcyLiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiMi4gUHJvY2VkdXJlIGZvciBjaGFuZ2luZyB0aGUgYnJpZ2h0bmVzczpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiMi4gUHJvY2VkdXJlIGZvciBjaGFuZ2luZyB0aGUgZGlyZWN0aW9uOlwifSxcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzX2luY3JlYXNlJzogJ0dyYWR1YWxseSBpbmNyZWFzZSB0aGUgYnJpZ2h0bmVzcycsICdicmlnaHRuZXNzX2RlY3JlYXNlJzogJ0dyYWR1YWxseSBkZWNyZWFzZSB0aGUgYnJpZ2h0bmVzcycsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb25fYXJvdW5kJzogJ01ha2UgdGhlIGxpZ2h0IGdvIGFyb3VuZCcsICdkaXJlY3Rpb25faG9sZCc6ICdLZWVwIG9uZSBkaXJlY3Rpb24nLCAnZGlyZWN0aW9uX2FsdGVybmF0ZSc6ICdBbHRlcm5hdGUgYmV0d2VlbiB0d28gZGlyZWN0aW9ucycsICdkaXJlY3Rpb25fc3BlY2lhbCc6ICdTcGVjaWFsIGRpcmVjdGlvbnMnfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2hvbGRjb25zdGFudFwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICczLiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiMy4gRml4IHRoZSBkaXJlY3Rpb24gb2YgbGlnaHQgdG86XCIsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb24nOiBcIjMuIEZpeCB0aGUgYnJpZ2h0bmVzcyBvZiBsaWdodCB0bzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5mb3JtT3B0aW9ucycpID09ICdjb21wbGV0ZScgPyB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl8yNSc6ICdkaW0nLCAnZGlyZWN0aW9uXzUwJzogJ21lZGl1bScsICdkaXJlY3Rpb25fMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnJpZ2h0bmVzc19hbGxkaXInOiAnZnJvbSBhbGwgZGlyZWN0aW9ucycsICdicmlnaHRuZXNzX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdicmlnaHRuZXNzX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnYnJpZ2h0bmVzc19yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsJ2JyaWdodG5lc3NfYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9IDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnZGlyZWN0aW9uXzI1JzogJ2RpbScsICdkaXJlY3Rpb25fNTAnOiAnbWVkaXVtJywgJ2RpcmVjdGlvbl8xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdicmlnaHRuZXNzX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdicmlnaHRuZXNzX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnYnJpZ2h0bmVzc19yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsJ2JyaWdodG5lc3NfYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfZmlyc3RsaWdodFwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc0LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNC4gQnJpZ2h0bmVzcyBzdGFydCBzZXR0aW5nOlwiLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uJzogXCI0LiBEaXJlY3Rpb24gc3RhcnQgc2V0dGluZzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5mb3JtT3B0aW9ucycpID09ICdjb21wbGV0ZScgPyB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3NfMjUnOiAnZGltJywgJ2JyaWdodG5lc3NfNTAnOiAnbWVkaXVtJywgJ2JyaWdodG5lc3NfMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX3NwZWNpYWxfYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fc3BlY2lhbF90b3BsZWZ0JzogJ2Zyb20gdGhlIHRvcC1sZWZ0JywgJ2RpcmVjdGlvbl9zcGVjaWFsX2xlZnRyaWdodCc6ICdmcm9tIHRoZSBsZWZ0IGFuZCByaWdodCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3NfMjUnOiAnZGltJywgJ2JyaWdodG5lc3NfNTAnOiAnbWVkaXVtJywgJ2JyaWdodG5lc3NfMTAwJzogJ2JyaWdodCcsICdkaXJlY3Rpb25fbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2RpcmVjdGlvbl90b3AnOiAnZnJvbSB0aGUgdG9wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX3NlY29uZGxpZ2h0XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzUuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCI1LiBCcmlnaHRuZXNzIHNlY29uZCBzZXR0aW5nOlwiLCAnZGlyZWN0aW9uJzogXCI1LiBEaXJlY3Rpb24gc2Vjb25kIHNldHRpbmc6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZm9ybU9wdGlvbnMnKSA9PSAnY29tcGxldGUnID8geydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fYnJpZ2h0bmVzc18wJzogJ25vIGxpZ2h0JywgJ2JyaWdodG5lc3NfMjUnOiAnZGltJywgJ2JyaWdodG5lc3NfNTAnOiAnbWVkaXVtJywgJ2JyaWdodG5lc3NfMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlyZWN0aW9uX3NwZWNpYWxfYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nLCAnZGlyZWN0aW9uX3NwZWNpYWxfdG9wYm90dG9tJzogJ2Zyb20gdGhlIHRvcCBhbmQgYm90dG9tJywgJ2RpcmVjdGlvbl9zcGVjaWFsX2JvdHRvbXJpZ2h0JzogJ2Zyb20gdGhlIGJvdHRvbS1yaWdodCcsfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2RpcmVjdGlvbl90b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2RpcmVjdGlvbl9yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsICdkaXJlY3Rpb25fYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfbGlnaHRkdXJhdGlvblwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc2LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIiwgJ2RpcmVjdGlvbic6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbic6ICdhbHRlcm5hdGUgMTUgc2Vjb25kcyBvbicsICdicmlnaHRuZXNzX2RpcmVjdGlvbl9zcGVjaWFsXzMwb24nOiAnZWFjaCAzMCBzZWNvbmRzIG9uJ30sIC8vJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzMwb24nOiAnZWFjaCAzMCBzZWNvbmRzIG9uJ1xuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdLFxuICAgICAgICAgIGJ1dHRvbnM6IGJ1dHRvbnNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5jaGFpbk9mQWN0aXZhdGlvbiA9IHtcbiAgICAgICAgJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic6IHtcImV4cF9jYXRlZ29yeVwiOiBcImV4cF9wcm9jZWR1cmVcIiwgXCJleHBfcHJvY2VkdXJlXCI6IFwiZXhwX2hvbGRjb25zdGFudFwiLCBcImV4cF9ob2xkY29uc3RhbnRcIjogXCJleHBfZmlyc3RsaWdodFwiLCBcImV4cF9maXJzdGxpZ2h0XCI6IFwiZXhwX3NlY29uZGxpZ2h0XCIsIFwiZXhwX3NlY29uZGxpZ2h0XCI6IFwiZXhwX2xpZ2h0ZHVyYXRpb25cIn0sXG4gICAgICAgICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nOiB7XCJleHBfY2F0ZWdvcnlcIjogXCJleHBfcHJvY2VkdXJlXCIsIFwiZXhwX3Byb2NlZHVyZVwiOiBcImV4cF9ob2xkY29uc3RhbnRcIiwgXCJleHBfaG9sZGNvbnN0YW50XCI6IFwiZXhwX2ZpcnN0bGlnaHRcIn1cbiAgICAgIH07XG4gICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfdXBkYXRlRm9ybVZpZXdzJywnc2V0U3RhdGUnLCAndmFsaWRhdGUnLCAnZ2V0TGlnaHRDb25maWd1cmF0aW9uJ10pXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fdXBkYXRlRm9ybVZpZXdzKVxuICAgICAgdGhpcy5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgfVxuXG5cbiAgICB2YWxpZGF0ZSgpIHtcblxuICAgICAgc3dpdGNoICh0aGlzLmNoYWluU3RhdGUpIHtcbiAgICAgICAgY2FzZSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGZpZWxkLnVwZGF0ZVZhbGlkYXRpb24oe2N1c3RvbToge1xuICAgICAgICAgICAgICB0ZXN0OiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgZm46ICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmFsLm1hdGNoKCdkZWZhdWx0JykpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSkgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBcIllvdSBoYXZlIHRvIGNob29zZSB2YWxpZCBvcHRpb25zIGZvciB0aGUgXCIgKyAoMSArIGluZGV4KSArIFwidGggZmllbGQuXCJcbiAgICAgICAgICAgIH19KVxuICAgICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfc2Vjb25kbGlnaHQnICYgZmllbGQuaWQoKSAhPSAnZXhwX2xpZ2h0ZHVyYXRpb24nKSB7XG4gICAgICAgICAgICAgIGZpZWxkLnVwZGF0ZVZhbGlkYXRpb24oe2N1c3RvbToge1xuICAgICAgICAgICAgICAgIHRlc3Q6ICdjdXN0b20nLFxuICAgICAgICAgICAgICAgIGZuOiAodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAodmFsLm1hdGNoKCdkZWZhdWx0JykpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSkgfVxuICAgICAgICAgICAgICAgICAgZWxzZSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSkgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBcIllvdSBoYXZlIHRvIGNob29zZSB2YWxpZCBvcHRpb25zIGZvciB0aGUgXCIgKyAoMSArIGluZGV4KSArIFwidGggZmllbGQuXCJcbiAgICAgICAgICAgICAgfX0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaWVsZC51cGRhdGVWYWxpZGF0aW9uKHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC52YWxpZGF0ZSgpO1xuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgIHZhciBsaWdodENvbmZpZyA9IHRoaXMuZ2V0TGlnaHRDb25maWd1cmF0aW9uKCk7XG4gICAgICBpZiAobGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXSA9PT0gWy0xLC0xLC0xLC0xXSkge1xuICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddID0gWzAsMCwwLDBdXG4gICAgICB9XG4gICAgICByZXR1cm4ge2xpZ2h0czogbGlnaHRDb25maWdbJ2xpZ2h0cyddLCBleHBGb3JtOiBzdXBlci5leHBvcnQoKX07XG4gICAgfVxuXG4gICAgaW1wb3J0KGRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuX21vZGVsLmdldEZpZWxkcygpKSB7XG4gICAgICAgICAgaWYgKGRhdGFbZmllbGQuaWQoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmllbGQuc2V0VmFsdWUoZGF0YVtmaWVsZC5pZCgpXSk7XG4gICAgICAgICAgICBpZiAoZGF0YVtmaWVsZC5pZCgpXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJoaXN0b3JpY2FsXCI6XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9ICdoaXN0b3JpY2FsJ1xuICAgICAgICAgIHN3aXRjaCAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcIm9ic2VydmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlYW5kaGlzdG9yeVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLnNob3coKTt9XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmFnZ3JlZ2F0ZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJuZXdcIjpcbiAgICAgICAgICB0aGlzLnN0YXRlID0gJ25ldyc7XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSA9PSAnZXhwX2NhdGVnb3J5Jykge1xuICAgICAgICAgICAgICBmaWVsZC5lbmFibGUoKVxuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZGlzYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGlnaHRDb25maWd1cmF0aW9uKCkge1xuICAgICAgLy8gVHJhbnNsYXRlIGZpZWxkcyBpbnRvIFt7XCJsZWZ0XCI6IDEwMCwgXCJyaWdodFwiOiAwLCBcInRvcFwiOiAwLCBcImJvdHRvbVwiOiAxMDAsIFwiZHVyYXRpb25cIjogMTV9LCAuLi5dXG4gICAgICBsZXQgZGVmYXVsdENvdW50ZXIgPSAwO1xuICAgICAgdGhpcy5leHBQcm90b2NvbCA9IHt9XG4gICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgdGhpcy5leHBQcm90b2NvbFtmaWVsZC5pZCgpXSA9IGZpZWxkLnZhbHVlKClcbiAgICAgICAgZGVmYXVsdENvdW50ZXIgPSBmaWVsZC52YWx1ZSgpID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc/IGRlZmF1bHRDb3VudGVyICsgMSA6IGRlZmF1bHRDb3VudGVyO1xuICAgICAgfSlcblxuICAgICAgbGV0IGNvbmZpZ1N0YXRlID0gZmFsc2U7XG4gICAgICBpZiAoZGVmYXVsdENvdW50ZXIgPCAzKSB7IGNvbmZpZ1N0YXRlID0gdHJ1ZTsgfVxuXG4gICAgICB2YXIgbGlnaHRDb25maWcgPSB7fVxuICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXSA9IEFycmF5KDQpLmZpbGwoLTEpO1xuICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddID0gW107XG4gICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykgeyBsaWdodENvbmZpZ1snbGlnaHRzJ10ucHVzaCh7J2xlZnQnOiAwLCAndG9wJzogMCwgJ3JpZ2h0JzogMCwgJ2JvdHRvbSc6IDAsICdkdXJhdGlvbic6IDE1fSkgfVxuXG4gICAgICBpZiAoY29uZmlnU3RhdGUpIHtcbiAgICAgICAgdmFyIGxpZ2h0RGlyZWN0aW9ucyA9IFsnbGVmdCcsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJ107XG5cbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgZml4ZWQgdmFsdWVcbiAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSB7Y29uc29sZS5sb2coJ3RoZXJlIGlzIGEgcHJvYmxlbScpfVxuICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKCdkaXJlY3Rpb24nKSkge1xuICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ10gPSBBcnJheSg0KS5maWxsKCkubWFwKGZ1bmN0aW9uKCkgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKC9cXGQrLylbMF0pIH0sdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICBsZXQgc3Vic3RyID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgc3Vic3RyID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLnN1YnN0cihzdWJzdHIrMSk7XG4gICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBzdWJzdHIubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IDEwMCA6IDAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb2RpZnkgYWxsIHBhbmVsc1xuICAgICAgICB2YXIgbGlnaHRTdWNjZXNzaW9ucyA9IHsnbGVmdCc6ICd0b3AnLCAndG9wJzogJ3JpZ2h0JywgJ3JpZ2h0JzogJ2JvdHRvbScsICdib3R0b20nOiAnbGVmdCcsICd0b3BsZWZ0JzogJ3RvcHJpZ2h0JywgJ3RvcHJpZ2h0JzogJ2JvdHRvbXJpZ2h0JywgJ2JvdHRvbXJpZ2h0JzogJ2JvdHRvbWxlZnQnLCAnYm90dG9tbGVmdCc6ICd0b3BsZWZ0J307XG4gICAgICAgIHZhciBmaXJzdEJyaWdodG5lc3MgPSBudWxsO1xuICAgICAgICB2YXIgc2Vjb25kQnJpZ2h0bmVzcyA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuY2hhaW5TdGF0ZSA9PSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJyAmICEodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXSA9PSdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG5cbiAgICAgICAgICBzd2l0Y2ggKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9wcm9jZWR1cmUnXSkge1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3MgICsgMjUgKiBwYW5lbDtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGVjcmVhc2UnOlxuICAgICAgICAgICAgICBmaXJzdEJyaWdodG5lc3MgPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gZmlyc3RCcmlnaHRuZXNzIC0gMjUgKiBwYW5lbDtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaG9sZCc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3M7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fYXJvdW5kJzpcbiAgICAgICAgICAgICAgdmFyIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5zdWJzdHIoY3VyckxpZ2h0KzEpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBjdXJyTGlnaHQubWF0Y2goZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICAgIGN1cnJMaWdodCA9IGxpZ2h0U3VjY2Vzc2lvbnNbY3VyckxpZ2h0XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25faG9sZCc6XG4gICAgICAgICAgICAgIHZhciBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgICAgIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10uc3Vic3RyKGN1cnJMaWdodCsxKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gY3VyckxpZ2h0Lm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyckxpZ2h0ID09ICcwJykgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgeyAvLyBpZiBpcyBhbHRlcm5hdGluZyBvciBzcGVjaWFsXG5cbiAgICAgICAgICAvLyBNb2RpZnkgdGhlIGZpcnN0IHBhbmVsXG4gICAgICAgICAgaWYgKCEodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goJ2JyaWdodG5lc3MnKSkge1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXSA6IDAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgnZGlyZWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVtkaXJlY3Rpb25dID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXSA6IDAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBNb2RpZnkgdGhlIHJlbWFpbmluZyBwYW5lbHNcbiAgICAgICAgICBpZiAoISh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSAmICEodGhpcy5leHBQcm90b2NvbFsnZXhwX2xpZ2h0ZHVyYXRpb24nXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuICAgICAgICAgICAgdmFyIG1vZGlmeVNlY29uZExpZ2h0ID0gW107XG4gICAgICAgICAgICBzd2l0Y2godGhpcy5leHBQcm90b2NvbFsnZXhwX2xpZ2h0ZHVyYXRpb24nXSkge1xuICAgICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RpcmVjdGlvbl8xNW9uJzpcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bMl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1cbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzJdID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXVxuICAgICAgICAgICAgICAgIG1vZGlmeVNlY29uZExpZ2h0ID0gWzEsM11cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b25vZmYnOlxuICAgICAgICAgICAgICAgIGxldCBsaWdodHMgPSB7J2R1cmF0aW9uJzogMTV9O1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKChkaXJlY3Rpb24pID0+IGxpZ2h0c1tkaXJlY3Rpb25dID0gMCk7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdID0gbGlnaHRzXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsxXSA9IDBcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bM10gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMV1cbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzNdID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsxXVxuICAgICAgICAgICAgICAgIG1vZGlmeVNlY29uZExpZ2h0ID0gWzJdXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RpcmVjdGlvbl9zcGVjaWFsXzMwb24nOlxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVsxXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXTtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzFdID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXVxuICAgICAgICAgICAgICAgIG1vZGlmeVNlY29uZExpZ2h0ID0gWzIsM11cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnYnJpZ2h0bmVzcycpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSlcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXSA6IDAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goJ2RpcmVjdGlvbicpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dW2RpcmVjdGlvbl0gPSB0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV0gOiAwICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtb2RpZnlTZWNvbmRMaWdodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFsxXV0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dO1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzFdXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlnaHRDb25maWdcbiAgICB9XG5cbiAgICBfdXBkYXRlRm9ybVZpZXdzKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PSAnZXhwX2NhdGVnb3J5Jykge1xuICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoZmllbGQuaWQoKSAhPSAnZXhwX2NhdGVnb3J5Jyl7XG4gICAgICAgICAgICBmaWVsZC5zaG93RGVzY3JpcHRpb24oZXZ0LmRhdGEuZGVsdGEudmFsdWUubWF0Y2goJ2RlZmF1bHRfY2hvaWNlJykgPyAnZGVmYXVsdF9jaG9pY2UnIDogZXZ0LmRhdGEuZGVsdGEudmFsdWUpXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PSAnbmV3Jykge1xuICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZCwgZXZ0LmRhdGEuZGVsdGEudmFsdWUpXG5cbiAgICAgICAgICB9IGVsc2UgeyAvLyBpZiBpdCBpcyBleHBfY2F0ZWdvcnlcbiAgICAgICAgICAgIGZpZWxkLnNob3dEZXNjcmlwdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGV2dC5kYXRhLmRlbHRhLnZhbHVlID09PSAnbm9fbGlnaHQnKSB7XG4gICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2ZpbmFsJztcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICB9XG5cblxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWQgPT0gJ2V4cF9wcm9jZWR1cmUnKSB7IC8vIFRoZSBjaG9zZW4gcHJvY2VkdXJlIGRldGVybWluZXMgd2hhdCBmaWVsZHMgdG8gc2hvd1xuXG4gICAgICAgICAgLy9EaXNhYmxlIG9wdGlvbnMgb2YgZXhwX2ZpcnN0bGlnaHQgZGVwZW5kaW5nIG9uIHdoYXQgaGFzIGJlZW4gY2hvc2VcbiAgICAgICAgICB2YXIgZmllbGRfZmlyc3RsaWdodCA9IHRoaXMuX2ZpbmRGaWVsZCgnZXhwX2ZpcnN0bGlnaHQnKTtcbiAgICAgICAgICBzd2l0Y2ggKGV2dC5kYXRhLmRlbHRhLnZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RlY3JlYXNlJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnYnJpZ2h0bmVzc18xMDAnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaW5jcmVhc2UnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzXzI1Jyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fYXJvdW5kJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnX2xlZnQnLCdfc3BlY2lhbCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19hbHRlcm5hdGUnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2hvbGQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsJ2JyaWdodG5lc3MnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9hbHRlcm5hdGUnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdkaXJlY3Rpb24nLCdfc3BlY2lhbCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2hvbGQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdkaXJlY3Rpb24nLCAnX3NwZWNpYWx8X3RvcGxlZnQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9zcGVjaWFsJzpcbiAgICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwnc3BlY2lhbCcpXG4gICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBmaWVsZF9zZWNvbmRsaWdodCA9IHRoaXMuX2ZpbmRGaWVsZCgnZXhwX3NlY29uZGxpZ2h0Jyk7XG4gICAgICAgICAgc3dpdGNoIChldnQuZGF0YS5kZWx0YS52YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX3NwZWNpYWwnOlxuICAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9zZWNvbmRsaWdodCwnc3BlY2lhbHxkaXJlY3Rpb25fYnJpZ2h0bmVzc18wJylcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgbGV0IG1hdGNoVmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICBbJ2RpcmVjdGlvbicsJ2JyaWdodG5lc3MnXS5mb3JFYWNoKHZhbHVlID0+IHsgaWYoZXZ0LmRhdGEuZGVsdGEudmFsdWUubWF0Y2godmFsdWUpKSBtYXRjaFZhbHVlID0gdmFsdWV9KVxuXG4gICAgICAgICAgICAgIGlmIChtYXRjaFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX3NlY29uZGxpZ2h0LG1hdGNoVmFsdWUsJ3NwZWNpYWwnKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBmaWVsZF9saWdodGR1cmF0aW9uID0gdGhpcy5fZmluZEZpZWxkKCdleHBfbGlnaHRkdXJhdGlvbicpO1xuICAgICAgICAgIHN3aXRjaCAoZXZ0LmRhdGEuZGVsdGEudmFsdWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGlvbl9zcGVjaWFsJzpcbiAgICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfbGlnaHRkdXJhdGlvbiwnYnJpZ2h0bmVzc19kaXJlY3Rpb24nKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2xpZ2h0ZHVyYXRpb24sJ2JyaWdodG5lc3NfZGlyZWN0aW9uJywnc3BlY2lhbCcpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZS1pbml0aWFsaXplIHN1Y2Nlc3NpdmUgZmllbGRzXG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSAhPSAnZXhwX2NhdGVnb3J5JyAmIGZpZWxkLmlkKCkgIT0gJ2V4cF9wcm9jZWR1cmUnICYgdGhpcy5zdGF0ZSA9PSAnbmV3Jykge1xuICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIElzIHRoZSBuZXh0IGZpZWxkIGFjdGl2YXRlZD9cbiAgICAgIGlmICh0aGlzLmNoYWluU3RhdGUgIT0gJ2ZpbmFsJykge1xuICAgICAgICB2YXIgbmV4dEZpZWxkID0gdGhpcy5fZmluZEZpZWxkKHRoaXMuY2hhaW5PZkFjdGl2YXRpb25bdGhpcy5jaGFpblN0YXRlXVtldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWRdKTtcbiAgICAgICAgaWYgKG5leHRGaWVsZCA/ICFuZXh0RmllbGQuaXNWaXNpYmxlKCkgOiBmYWxzZSkge1xuICAgICAgICAgICAgbmV4dEZpZWxkLnNldFZpc2liaWxpdHkoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgIG5leHRGaWVsZC5lbmFibGUoKTtcblxuICAgICAgICAgICAgdmFyIG5leHRuZXh0RmllbGQgPSB0aGlzLl9maW5kRmllbGQodGhpcy5jaGFpbk9mQWN0aXZhdGlvblt0aGlzLmNoYWluU3RhdGVdW25leHRGaWVsZC5pZCgpXSk7XG4gICAgICAgICAgICBpZiAobmV4dG5leHRGaWVsZCkge25leHRuZXh0RmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwLjMpfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZpbmRGaWVsZChmaWVsZElkKSB7XG4gICAgICB2YXIgZmllbGQgPSBudWxsO1xuICAgICAgZm9yICh2YXIgY250ciA9IDA7IGNudHI8dGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0Lmxlbmd0aDsgY250cisrKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHRbY250cl0uaWQoKT09ZmllbGRJZCkge1xuICAgICAgICAgIGZpZWxkID0gdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0W2NudHJdXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmaWVsZFxuICAgIH1cblxuICAgIF9tb2RpZnlPcHRpb25zKGZpZWxkLCBjcml0ZXJpYSwgYWRkaXRpb25hbGx5RGlzYWJsZSA9IG51bGwpIHtcbiAgICAgIE9iamVjdC5rZXlzKGZpZWxkLmdldE9wdGlvbnMoKSkuZm9yRWFjaCgoY2hvaWNlKSA9PiB7XG4gICAgICAgIGlmICgoY2hvaWNlLm1hdGNoKGFkZGl0aW9uYWxseURpc2FibGUpIHx8ICFjaG9pY2UubWF0Y2goY3JpdGVyaWEpKSAmJiAhY2hvaWNlLm1hdGNoKCdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgZmllbGQuZGlzYWJsZU9wdGlvbihjaG9pY2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmllbGQuZW5hYmxlT3B0aW9uKGNob2ljZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG4gIH1cbn0pXG4iXX0=
