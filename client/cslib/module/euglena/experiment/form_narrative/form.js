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
              'direction_around': 'Make the light go around', 'direction_hold': 'Keep one direction', 'direction_alternate': 'Alternate between two directions' },
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
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_topleft': 'from the top-left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' } : { 'direction_brightness_default_choice': 'please choose one', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright', 'direction_left': 'from the left', 'direction_top': 'from the top',
              'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_secondlight",
            description: { 'default_choice': '5. Decide on the previous questions first.', 'brightness': "5. Brightness second setting:", 'direction': "5. Direction second setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom', 'direction_bottomright': 'from the bottom-right' } : { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
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
              this._modifyOptions(field_firstlight, 'direction');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkZvcm0iLCJCdXR0b24iLCJFeHBQcm90b2NvbCIsIlV0aWxzIiwiYnV0dG9ucyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiZ2V0IiwibWF0Y2giLCJzcGxpY2UiLCJtb2RlbERhdGEiLCJmaWVsZHMiLCJkZXNjcmlwdGlvbiIsImRlZmF1bHRWYWx1ZSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uIiwiY2hhaW5PZkFjdGl2YXRpb24iLCJjaGFpblN0YXRlIiwiYmluZE1ldGhvZHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX3VwZGF0ZUZvcm1WaWV3cyIsInNldFN0YXRlIiwiX21vZGVsIiwiX2RhdGEiLCJyZWdpb25zIiwiZGVmYXVsdCIsImZvckVhY2giLCJmaWVsZCIsImluZGV4IiwidXBkYXRlVmFsaWRhdGlvbiIsImN1c3RvbSIsInRlc3QiLCJmbiIsInZhbCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3JNZXNzYWdlIiwidmFsaWRhdGUiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0cyIsImV4cEZvcm0iLCJkYXRhIiwiY2xlYXIiLCJ0aGVuIiwiZ2V0RmllbGRzIiwidW5kZWZpbmVkIiwic2V0VmFsdWUiLCJzZXRWaXNpYmlsaXR5Iiwic3RhdGUiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJzZXREZWZhdWx0IiwibmV3QnRuIiwiZGVmYXVsdENvdW50ZXIiLCJleHBQcm90b2NvbCIsInZhbHVlIiwiY29uZmlnU3RhdGUiLCJBcnJheSIsImZpbGwiLCJwYW5lbCIsInB1c2giLCJsaWdodERpcmVjdGlvbnMiLCJjb25zb2xlIiwibG9nIiwibWFwIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImRpcmVjdGlvbiIsImxpZ2h0U3VjY2Vzc2lvbnMiLCJmaXJzdEJyaWdodG5lc3MiLCJzZWNvbmRCcmlnaHRuZXNzIiwiY3VyckxpZ2h0IiwibW9kaWZ5U2Vjb25kTGlnaHQiLCJsZW5ndGgiLCJldnQiLCJzaG93RGVzY3JpcHRpb24iLCJkZWx0YSIsIl9tb2RpZnlPcHRpb25zIiwiZmllbGRfZmlyc3RsaWdodCIsIl9maW5kRmllbGQiLCJuZXh0RmllbGQiLCJpc1Zpc2libGUiLCJuZXh0bmV4dEZpZWxkIiwiZmllbGRJZCIsImNudHIiLCJjcml0ZXJpYSIsImFkZGl0aW9uYWxseURpc2FibGUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsImNob2ljZSIsImRpc2FibGVPcHRpb24iLCJlbmFibGVPcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQ0EsTUFBTUUsT0FBT0YsUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUcsU0FBU0gsUUFBUSw2QkFBUixDQURYO0FBQUEsTUFFRUksY0FBY0osUUFBUSxxQkFBUixDQUZoQjtBQUFBLE1BR0VLLFFBQVFMLFFBQVEsaUJBQVIsQ0FIVjs7QUFNQTtBQUFBOztBQUNFLDhCQUFjO0FBQUE7O0FBQ1osVUFBTU0sVUFBVSxDQUFDSCxPQUFPSSxNQUFQLENBQWM7QUFDN0JDLFlBQUksUUFEeUI7QUFFN0JDLGVBQU8sUUFGc0I7QUFHN0JDLGlCQUFTLENBQUMsMEJBQUQsQ0FIb0I7QUFJN0JDLG1CQUFXO0FBSmtCLE9BQWQsQ0FBRCxFQUtaUixPQUFPSSxNQUFQLENBQWM7QUFDaEJDLFlBQUksV0FEWTtBQUVoQkMsZUFBTywwQkFGUztBQUdoQkMsaUJBQVMsQ0FBQyw2QkFBRCxDQUhPO0FBSWhCQyxtQkFBVztBQUpLLE9BQWQsQ0FMWSxDQUFoQjtBQVdBLFVBQUlWLFFB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ZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyk7XG4gIGNvbnN0IEZvcm0gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9mb3JtL2Zvcm0nKSxcbiAgICBCdXR0b24gPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9idXR0b24vZmllbGQnKSxcbiAgICBFeHBQcm90b2NvbCA9IHJlcXVpcmUoJy4vZXhwcHJvdG9jb2wvZmllbGQnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpXG4gIDtcblxuICByZXR1cm4gY2xhc3MgRXhwZXJpbWVudEZvcm0gZXh0ZW5kcyBGb3JtIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBbQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgIGlkOiAnc3VibWl0JyxcbiAgICAgICAgbGFiZWw6ICdTdWJtaXQnLFxuICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX3N1Ym1pdCddLFxuICAgICAgICBldmVudE5hbWU6ICdFeHBlcmltZW50LlN1Ym1pdCdcbiAgICAgIH0pLCBCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBsYWJlbDogJ0FkZCBSZXN1bHRzIHRvIEFnZ3JlZ2F0ZScsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fYWdncmVnYXRlJ10sXG4gICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuQWRkVG9BZ2dyZWdhdGUnXG4gICAgICB9KV07XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykubWF0Y2goJ2NyZWF0ZScpKSB7XG4gICAgICAgIGJ1dHRvbnMuc3BsaWNlKDIsIDAsIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICAgIGlkOiAnbmV3JyxcbiAgICAgICAgICBsYWJlbDogJ05ldyBFeHBlcmltZW50JyxcbiAgICAgICAgICBjbGFzc2VzOiBbJ2Zvcm1fX2V4cGVyaW1lbnRfX25ldyddLFxuICAgICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuTmV3UmVxdWVzdCdcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBzdXBlcih7XG4gICAgICAgIG1vZGVsRGF0YToge1xuICAgICAgICAgIGlkOiBcImV4cGVyaW1lbnRcIixcbiAgICAgICAgICBjbGFzc2VzOiBbXCJmb3JtX19leHBlcmltZW50XCJdLFxuICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2NhdGVnb3J5XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIjEuIFZhcmlhYmxlIHRvIGJlIGNoYW5nZWQ6XCIsXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzcyc6ICdCcmlnaHRuZXNzIG9mIHRoZSBsaWdodCcsICdkaXJlY3Rpb24nOiAnRGlyZWN0aW9uIG9mIHRoZSBsaWdodCd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfcHJvY2VkdXJlXCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7J2RlZmF1bHRfY2hvaWNlJzogJzIuIERlY2lkZSBvbiB0aGUgcHJldmlvdXMgcXVlc3Rpb25zIGZpcnN0LicsICdicmlnaHRuZXNzJzogXCIyLiBQcm9jZWR1cmUgZm9yIGNoYW5naW5nIHRoZSBicmlnaHRuZXNzOlwiLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uJzogXCIyLiBQcm9jZWR1cmUgZm9yIGNoYW5naW5nIHRoZSBkaXJlY3Rpb246XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2JyaWdodG5lc3NfaW5jcmVhc2UnOiAnR3JhZHVhbGx5IGluY3JlYXNlIHRoZSBicmlnaHRuZXNzJywgJ2JyaWdodG5lc3NfZGVjcmVhc2UnOiAnR3JhZHVhbGx5IGRlY3JlYXNlIHRoZSBicmlnaHRuZXNzJyxcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbl9hcm91bmQnOiAnTWFrZSB0aGUgbGlnaHQgZ28gYXJvdW5kJywgJ2RpcmVjdGlvbl9ob2xkJzogJ0tlZXAgb25lIGRpcmVjdGlvbicsICdkaXJlY3Rpb25fYWx0ZXJuYXRlJzogJ0FsdGVybmF0ZSBiZXR3ZWVuIHR3byBkaXJlY3Rpb25zJ30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9ob2xkY29uc3RhbnRcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnMy4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjMuIEZpeCB0aGUgZGlyZWN0aW9uIG9mIGxpZ2h0IHRvOlwiLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uJzogXCIzLiBGaXggdGhlIGJyaWdodG5lc3Mgb2YgbGlnaHQgdG86XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZm9ybU9wdGlvbnMnKSA9PSAnY29tcGxldGUnID8geydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdkaXJlY3Rpb25fMjUnOiAnZGltJywgJ2RpcmVjdGlvbl81MCc6ICdtZWRpdW0nLCAnZGlyZWN0aW9uXzEwMCc6ICdicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JyaWdodG5lc3NfYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnYnJpZ2h0bmVzc19sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnYnJpZ2h0bmVzc190b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2JyaWdodG5lc3NfcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCdicmlnaHRuZXNzX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl8yNSc6ICdkaW0nLCAnZGlyZWN0aW9uXzUwJzogJ21lZGl1bScsICdkaXJlY3Rpb25fMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnJpZ2h0bmVzc19sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnYnJpZ2h0bmVzc190b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2JyaWdodG5lc3NfcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCdicmlnaHRuZXNzX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2ZpcnN0bGlnaHRcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnNC4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjQuIEJyaWdodG5lc3Mgc3RhcnQgc2V0dGluZzpcIixcbiAgICAgICAgICAgICAgJ2RpcmVjdGlvbic6IFwiNC4gRGlyZWN0aW9uIHN0YXJ0IHNldHRpbmc6XCJ9LFxuICAgICAgICAgICAgICBsYWJlbDonJyxcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnLFxuICAgICAgICAgICAgICBjbGFzc2VzOltdLFxuICAgICAgICAgICAgICBvcHRpb25zOiBHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmV4cGVyaW1lbnQuZm9ybU9wdGlvbnMnKSA9PSAnY29tcGxldGUnID8geydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzXzI1JzogJ2RpbScsICdicmlnaHRuZXNzXzUwJzogJ21lZGl1bScsICdicmlnaHRuZXNzXzEwMCc6ICdicmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpcmVjdGlvbl9hbGxkaXInOiAnZnJvbSBhbGwgZGlyZWN0aW9ucycsICdkaXJlY3Rpb25fbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2RpcmVjdGlvbl90b3BsZWZ0JzogJ2Zyb20gdGhlIHRvcC1sZWZ0JywgJ2RpcmVjdGlvbl90b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2RpcmVjdGlvbl9yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsICdkaXJlY3Rpb25fYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9IDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JywgJ2RpcmVjdGlvbl9sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnZGlyZWN0aW9uX3RvcCc6ICdmcm9tIHRoZSB0b3AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpcmVjdGlvbl9yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsICdkaXJlY3Rpb25fYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfc2Vjb25kbGlnaHRcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnNS4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjUuIEJyaWdodG5lc3Mgc2Vjb25kIHNldHRpbmc6XCIsICdkaXJlY3Rpb24nOiBcIjUuIERpcmVjdGlvbiBzZWNvbmQgc2V0dGluZzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5mb3JtT3B0aW9ucycpID09ICdjb21wbGV0ZScgPyB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nLCAnZGlyZWN0aW9uX2JvdHRvbXJpZ2h0JzogJ2Zyb20gdGhlIGJvdHRvbS1yaWdodCcsfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2RpcmVjdGlvbl90b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2RpcmVjdGlvbl9yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsICdkaXJlY3Rpb25fYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfbGlnaHRkdXJhdGlvblwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc2LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIiwgJ2RpcmVjdGlvbic6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbic6ICdhbHRlcm5hdGUgMTUgc2Vjb25kcyBvbid9LCAvLydicmlnaHRuZXNzX2RpcmVjdGlvbl8zMG9uJzogJ2VhY2ggMzAgc2Vjb25kcyBvbidcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXSxcbiAgICAgICAgICBidXR0b25zOiBidXR0b25zXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuY2hhaW5PZkFjdGl2YXRpb24gPSB7XG4gICAgICAgICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nOiB7XCJleHBfY2F0ZWdvcnlcIjogXCJleHBfcHJvY2VkdXJlXCIsIFwiZXhwX3Byb2NlZHVyZVwiOiBcImV4cF9ob2xkY29uc3RhbnRcIiwgXCJleHBfaG9sZGNvbnN0YW50XCI6IFwiZXhwX2ZpcnN0bGlnaHRcIiwgXCJleHBfZmlyc3RsaWdodFwiOiBcImV4cF9zZWNvbmRsaWdodFwiLCBcImV4cF9zZWNvbmRsaWdodFwiOiBcImV4cF9saWdodGR1cmF0aW9uXCJ9LFxuICAgICAgICAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJzoge1wiZXhwX2NhdGVnb3J5XCI6IFwiZXhwX3Byb2NlZHVyZVwiLCBcImV4cF9wcm9jZWR1cmVcIjogXCJleHBfaG9sZGNvbnN0YW50XCIsIFwiZXhwX2hvbGRjb25zdGFudFwiOiBcImV4cF9maXJzdGxpZ2h0XCJ9XG4gICAgICB9O1xuICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG5cbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX3VwZGF0ZUZvcm1WaWV3cycsJ3NldFN0YXRlJywgJ3ZhbGlkYXRlJywgJ2dldExpZ2h0Q29uZmlndXJhdGlvbiddKVxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkQ2hhbmdlZCcsIHRoaXMuX3VwZGF0ZUZvcm1WaWV3cylcbiAgICAgIHRoaXMuc2V0U3RhdGUoJ25ldycpO1xuICAgIH1cblxuXG4gICAgdmFsaWRhdGUoKSB7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5jaGFpblN0YXRlKSB7XG4gICAgICAgIGNhc2UgJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic6XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBmaWVsZC51cGRhdGVWYWxpZGF0aW9uKHtjdXN0b206IHtcbiAgICAgICAgICAgICAgdGVzdDogJ2N1c3RvbScsXG4gICAgICAgICAgICAgIGZuOiAodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbC5tYXRjaCgnZGVmYXVsdCcpKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKSB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJZb3UgaGF2ZSB0byBjaG9vc2UgdmFsaWQgb3B0aW9ucyBmb3IgdGhlIFwiICsgKDEgKyBpbmRleCkgKyBcInRoIGZpZWxkLlwiXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic6XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSAhPSAnZXhwX3NlY29uZGxpZ2h0JyAmIGZpZWxkLmlkKCkgIT0gJ2V4cF9saWdodGR1cmF0aW9uJykge1xuICAgICAgICAgICAgICBmaWVsZC51cGRhdGVWYWxpZGF0aW9uKHtjdXN0b206IHtcbiAgICAgICAgICAgICAgICB0ZXN0OiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgICBmbjogKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHZhbC5tYXRjaCgnZGVmYXVsdCcpKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpIH1cbiAgICAgICAgICAgICAgICAgIGVsc2UgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJZb3UgaGF2ZSB0byBjaG9vc2UgdmFsaWQgb3B0aW9ucyBmb3IgdGhlIFwiICsgKDEgKyBpbmRleCkgKyBcInRoIGZpZWxkLlwiXG4gICAgICAgICAgICAgIH19KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZmllbGQudXBkYXRlVmFsaWRhdGlvbih7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwudmFsaWRhdGUoKTtcbiAgICB9XG5cbiAgICBleHBvcnQoKSB7XG4gICAgICB2YXIgbGlnaHRDb25maWcgPSB0aGlzLmdldExpZ2h0Q29uZmlndXJhdGlvbigpO1xuICAgICAgcmV0dXJuIHtsaWdodHM6IGxpZ2h0Q29uZmlnWydsaWdodHMnXSwgZXhwRm9ybTogc3VwZXIuZXhwb3J0KCl9O1xuICAgIH1cblxuICAgIGltcG9ydChkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbGVhcigpLnRoZW4oKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiB0aGlzLl9tb2RlbC5nZXRGaWVsZHMoKSkge1xuICAgICAgICAgIGlmIChkYXRhW2ZpZWxkLmlkKCldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpZWxkLnNldFZhbHVlKGRhdGFbZmllbGQuaWQoKV0pO1xuICAgICAgICAgICAgaWYgKGRhdGFbZmllbGQuaWQoKV0gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykge1xuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCdoaWRkZW4nLDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICBjYXNlIFwiaGlzdG9yaWNhbFwiOlxuICAgICAgICAgIHRoaXMuc3RhdGUgPSAnaGlzdG9yaWNhbCdcbiAgICAgICAgICBzd2l0Y2ggKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cGVyaW1lbnRNb2RhbGl0eScpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJvYnNlcnZlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleHBsb3JlXCI6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ3N1Ym1pdCcpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZVwiOlxuICAgICAgICAgICAgY2FzZSBcImNyZWF0ZWFuZGhpc3RvcnlcIjpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5zaG93KCk7fVxuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5hZ2dyZWdhdGUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibmV3XCI6XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9ICduZXcnO1xuICAgICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpZWxkLmlkKCkgPT0gJ2V4cF9jYXRlZ29yeScpIHtcbiAgICAgICAgICAgICAgZmllbGQuZW5hYmxlKClcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgndmlzaWJsZScpO1xuICAgICAgICAgICAgICBmaWVsZC5zZXREZWZhdWx0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLnNob3coKTtcbiAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLmhpZGUoKTt9XG4gICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVOZXcoKSB7XG4gICAgICBjb25zdCBuZXdCdG4gPSB0aGlzLmdldEJ1dHRvbignbmV3JylcbiAgICAgIGlmIChuZXdCdG4pIHtcbiAgICAgICAgbmV3QnRuLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbmFibGVOZXcoKSB7XG4gICAgICBjb25zdCBuZXdCdG4gPSB0aGlzLmdldEJ1dHRvbignbmV3JylcbiAgICAgIGlmIChuZXdCdG4pIHtcbiAgICAgICAgbmV3QnRuLmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldExpZ2h0Q29uZmlndXJhdGlvbigpIHtcbiAgICAgIC8vIFRyYW5zbGF0ZSBmaWVsZHMgaW50byBbe1wibGVmdFwiOiAxMDAsIFwicmlnaHRcIjogMCwgXCJ0b3BcIjogMCwgXCJib3R0b21cIjogMTAwLCBcImR1cmF0aW9uXCI6IDE1fSwgLi4uXVxuICAgICAgbGV0IGRlZmF1bHRDb3VudGVyID0gMDtcbiAgICAgIHRoaXMuZXhwUHJvdG9jb2wgPSB7fVxuICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgIHRoaXMuZXhwUHJvdG9jb2xbZmllbGQuaWQoKV0gPSBmaWVsZC52YWx1ZSgpXG4gICAgICAgIGRlZmF1bHRDb3VudGVyID0gZmllbGQudmFsdWUoKSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnPyBkZWZhdWx0Q291bnRlciArIDEgOiBkZWZhdWx0Q291bnRlcjtcbiAgICAgIH0pXG5cbiAgICAgIGxldCBjb25maWdTdGF0ZSA9IGZhbHNlO1xuICAgICAgaWYgKGRlZmF1bHRDb3VudGVyIDwgMykgeyBjb25maWdTdGF0ZSA9IHRydWU7IH1cblxuICAgICAgdmFyIGxpZ2h0Q29uZmlnID0ge31cbiAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ10gPSBBcnJheSg0KS5maWxsKC0xKTtcbiAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXSA9IFtdO1xuICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHsgbGlnaHRDb25maWdbJ2xpZ2h0cyddLnB1c2goeydsZWZ0JzogMCwgJ3RvcCc6IDAsICdyaWdodCc6IDAsICdib3R0b20nOiAwLCAnZHVyYXRpb24nOiAxNX0pIH1cblxuICAgICAgaWYgKGNvbmZpZ1N0YXRlKSB7XG4gICAgICAgIHZhciBsaWdodERpcmVjdGlvbnMgPSBbJ2xlZnQnLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbSddO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgdGhlIGZpeGVkIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfaG9sZGNvbnN0YW50J10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykge2NvbnNvbGUubG9nKCd0aGVyZSBpcyBhIHByb2JsZW0nKX1cbiAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5tYXRjaCgnZGlyZWN0aW9uJykpIHtcbiAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddID0gQXJyYXkoNCkuZmlsbCgpLm1hcChmdW5jdGlvbigpIHsgcmV0dXJuIHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5tYXRjaCgvXFxkKy8pWzBdKSB9LHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5tYXRjaCgnYnJpZ2h0bmVzcycpKSB7XG4gICAgICAgICAgbGV0IHN1YnN0ciA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5sYXN0SW5kZXhPZignXycpO1xuICAgICAgICAgIHN1YnN0ciA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXS5zdWJzdHIoc3Vic3RyKzEpO1xuICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gc3Vic3RyLm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyAxMDAgOiAwICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTW9kaWZ5IGFsbCBwYW5lbHNcbiAgICAgICAgdmFyIGxpZ2h0U3VjY2Vzc2lvbnMgPSB7J2xlZnQnOiAndG9wJywgJ3RvcCc6ICdyaWdodCcsICdyaWdodCc6ICdib3R0b20nLCAnYm90dG9tJzogJ2xlZnQnLCAndG9wbGVmdCc6ICd0b3ByaWdodCcsICd0b3ByaWdodCc6ICdib3R0b21yaWdodCcsICdib3R0b21yaWdodCc6ICdib3R0b21sZWZ0JywgJ2JvdHRvbWxlZnQnOiAndG9wbGVmdCd9O1xuICAgICAgICB2YXIgZmlyc3RCcmlnaHRuZXNzID0gbnVsbDtcbiAgICAgICAgdmFyIHNlY29uZEJyaWdodG5lc3MgPSBudWxsO1xuXG4gICAgICAgIGlmICh0aGlzLmNoYWluU3RhdGUgPT0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbicgJiAhKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10gPT0nZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuXG4gICAgICAgICAgc3dpdGNoICh0aGlzLmV4cFByb3RvY29sWydleHBfcHJvY2VkdXJlJ10pIHtcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaW5jcmVhc2UnOlxuICAgICAgICAgICAgICBmaXJzdEJyaWdodG5lc3MgPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gZmlyc3RCcmlnaHRuZXNzICArIDI1ICogcGFuZWw7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RlY3JlYXNlJzpcbiAgICAgICAgICAgICAgZmlyc3RCcmlnaHRuZXNzID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA9IGZpcnN0QnJpZ2h0bmVzcyAtIDI1ICogcGFuZWw7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2hvbGQnOlxuICAgICAgICAgICAgICBmaXJzdEJyaWdodG5lc3MgPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gZmlyc3RCcmlnaHRuZXNzO1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPiAwID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2Fyb3VuZCc6XG4gICAgICAgICAgICAgIHZhciBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgICAgIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10uc3Vic3RyKGN1cnJMaWdodCsxKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gY3VyckxpZ2h0Lm1hdGNoKGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgICBjdXJyTGlnaHQgPSBsaWdodFN1Y2Nlc3Npb25zW2N1cnJMaWdodF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2hvbGQnOlxuICAgICAgICAgICAgICB2YXIgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5sYXN0SW5kZXhPZignXycpO1xuICAgICAgICAgICAgICBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLnN1YnN0cihjdXJyTGlnaHQrMSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGN1cnJMaWdodC5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gOiAwICk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJMaWdodCA9PSAnMCcpIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHsgLy8gaWYgaXMgYWx0ZXJuYXRpbmdcblxuICAgICAgICAgIC8vIE1vZGlmeSB0aGUgZmlyc3QgcGFuZWxcbiAgICAgICAgICBpZiAoISh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5tYXRjaCgnYnJpZ2h0bmVzcycpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF0gPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdW2RpcmVjdGlvbl0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdIDogMCApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKCdkaXJlY3Rpb24nKSkge1xuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdW2RpcmVjdGlvbl0gPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdIDogMCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE1vZGlmeSB0aGUgcmVtYWluaW5nIHBhbmVsc1xuICAgICAgICAgIGlmICghKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpICYgISh0aGlzLmV4cFByb3RvY29sWydleHBfbGlnaHRkdXJhdGlvbiddID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG4gICAgICAgICAgICB2YXIgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbXTtcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLmV4cFByb3RvY29sWydleHBfbGlnaHRkdXJhdGlvbiddKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzE1b24nOlxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVsyXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMl0gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMSwzXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbm9mZic6XG4gICAgICAgICAgICAgICAgbGV0IGxpZ2h0cyA9IHsnZHVyYXRpb24nOiAxNX07XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goKGRpcmVjdGlvbikgPT4gbGlnaHRzW2RpcmVjdGlvbl0gPSAwKTtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snbGlnaHRzJ11bMV0gPSBsaWdodHNcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzFdID0gMFxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVszXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVsxXVxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bM10gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzFdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMl1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGlyZWN0aW9uXzMwb24nOlxuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVsxXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXTtcbiAgICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzFdID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXVxuICAgICAgICAgICAgICAgIG1vZGlmeVNlY29uZExpZ2h0ID0gWzIsM11cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnYnJpZ2h0bmVzcycpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dID0gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSlcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXSA6IDAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10ubWF0Y2goJ2RpcmVjdGlvbicpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dW2RpcmVjdGlvbl0gPSB0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnYWxsZGlyfCcgKyBkaXJlY3Rpb24pID8gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV0gOiAwICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtb2RpZnlTZWNvbmRMaWdodC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFsxXV0gPSBsaWdodENvbmZpZ1snbGlnaHRzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dO1xuICAgICAgICAgICAgICBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzFdXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlnaHRDb25maWdcbiAgICB9XG5cbiAgICBfdXBkYXRlRm9ybVZpZXdzKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZCA9PSAnZXhwX2NhdGVnb3J5Jykge1xuICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoZmllbGQuaWQoKSAhPSAnZXhwX2NhdGVnb3J5Jyl7XG4gICAgICAgICAgICBmaWVsZC5zaG93RGVzY3JpcHRpb24oZXZ0LmRhdGEuZGVsdGEudmFsdWUubWF0Y2goJ2RlZmF1bHRfY2hvaWNlJykgPyAnZGVmYXVsdF9jaG9pY2UnIDogZXZ0LmRhdGEuZGVsdGEudmFsdWUpXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PSAnbmV3Jykge1xuICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZCwgZXZ0LmRhdGEuZGVsdGEudmFsdWUpXG5cbiAgICAgICAgICB9IGVsc2UgeyAvLyBpZiBpdCBpcyBleHBfY2F0ZWdvcnlcbiAgICAgICAgICAgIGZpZWxkLnNob3dEZXNjcmlwdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG5cbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdleHBfcHJvY2VkdXJlJykgeyAvLyBUaGUgY2hvc2VuIHByb2NlZHVyZSBkZXRlcm1pbmVzIHdoYXQgZmllbGRzIHRvIHNob3dcblxuICAgICAgICAgIC8vRGlzYWJsZSBvcHRpb25zIG9mIGV4cF9maXJzdGxpZ2h0IGRlcGVuZGluZyBvbiB3aGF0IGhhcyBiZWVuIGNob3NlXG4gICAgICAgICAgdmFyIGZpZWxkX2ZpcnN0bGlnaHQgPSB0aGlzLl9maW5kRmllbGQoJ2V4cF9maXJzdGxpZ2h0Jyk7XG4gICAgICAgICAgc3dpdGNoIChldnQuZGF0YS5kZWx0YS52YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kZWNyZWFzZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2JyaWdodG5lc3NfMTAwJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2luY3JlYXNlJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnYnJpZ2h0bmVzc18yNScpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2Fyb3VuZCc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ19sZWZ0fF90b3BsZWZ0Jyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2FsdGVybmF0ZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2JyaWdodG5lc3MnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaG9sZCc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwnYnJpZ2h0bmVzcycpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2FsdGVybmF0ZSc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2RpcmVjdGlvbicpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aW9uX2hvbGQnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdkaXJlY3Rpb24nLCAnX3RvcGxlZnQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZS1pbml0aWFsaXplIHN1Y2Nlc3NpdmUgZmllbGRzXG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSAhPSAnZXhwX2NhdGVnb3J5JyAmIGZpZWxkLmlkKCkgIT0gJ2V4cF9wcm9jZWR1cmUnICYgdGhpcy5zdGF0ZSA9PSAnbmV3Jykge1xuICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIElzIHRoZSBuZXh0IGZpZWxkIGFjdGl2YXRlZD9cbiAgICAgIHZhciBuZXh0RmllbGQgPSB0aGlzLl9maW5kRmllbGQodGhpcy5jaGFpbk9mQWN0aXZhdGlvblt0aGlzLmNoYWluU3RhdGVdW2V2dC5kYXRhLmZpZWxkLl9tb2RlbC5fZGF0YS5pZF0pO1xuICAgICAgaWYgKG5leHRGaWVsZCA/ICFuZXh0RmllbGQuaXNWaXNpYmxlKCkgOiBmYWxzZSkge1xuICAgICAgICAgIG5leHRGaWVsZC5zZXRWaXNpYmlsaXR5KCd2aXNpYmxlJyk7XG4gICAgICAgICAgbmV4dEZpZWxkLmVuYWJsZSgpO1xuXG4gICAgICAgICAgdmFyIG5leHRuZXh0RmllbGQgPSB0aGlzLl9maW5kRmllbGQodGhpcy5jaGFpbk9mQWN0aXZhdGlvblt0aGlzLmNoYWluU3RhdGVdW25leHRGaWVsZC5pZCgpXSk7XG4gICAgICAgICAgaWYgKG5leHRuZXh0RmllbGQpIHtuZXh0bmV4dEZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMC4zKX1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZmluZEZpZWxkKGZpZWxkSWQpIHtcbiAgICAgIHZhciBmaWVsZCA9IG51bGw7XG4gICAgICBmb3IgKHZhciBjbnRyID0gMDsgY250cjx0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQubGVuZ3RoOyBjbnRyKyspIHtcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdFtjbnRyXS5pZCgpPT1maWVsZElkKSB7XG4gICAgICAgICAgZmllbGQgPSB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHRbY250cl1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkXG4gICAgfVxuXG4gICAgX21vZGlmeU9wdGlvbnMoZmllbGQsIGNyaXRlcmlhLCBhZGRpdGlvbmFsbHlEaXNhYmxlID0gbnVsbCkge1xuICAgICAgT2JqZWN0LmtleXMoZmllbGQuZ2V0T3B0aW9ucygpKS5mb3JFYWNoKChjaG9pY2UpID0+IHtcbiAgICAgICAgaWYgKChjaG9pY2UubWF0Y2goYWRkaXRpb25hbGx5RGlzYWJsZSkgfHwgIWNob2ljZS5tYXRjaChjcml0ZXJpYSkpICYmICFjaG9pY2UubWF0Y2goJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICBmaWVsZC5kaXNhYmxlT3B0aW9uKGNob2ljZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWVsZC5lbmFibGVPcHRpb24oY2hvaWNlKVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxufSlcbiJdfQ==
