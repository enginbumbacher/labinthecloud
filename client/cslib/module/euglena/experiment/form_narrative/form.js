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
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_topleft': 'from the top-left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' } : { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright', 'direction_left': 'from the left', 'direction_top': 'from the top',
              'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
            validation: {}
          }), ExpProtocol.create({
            id: "exp_secondlight",
            description: { 'default_choice': '5. Decide on the previous questions first.', 'brightness': "5. Brightness second setting:", 'direction': "5. Direction second setting:" },
            label: '',
            defaultValue: 'direction_brightness_default_choice',
            classes: [],
            options: Globals.get('AppConfig.experiment.formOptions') == 'complete' ? { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_alldir': 'from all directions', 'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' } : { 'direction_brightness_default_choice': 'please choose one', 'direction_brightness_0': 'no light', 'brightness_25': 'dim', 'brightness_50': 'medium', 'brightness_100': 'bright',
              'direction_left': 'from the left', 'direction_top': 'from the top', 'direction_right': 'from the right', 'direction_bottom': 'from the bottom' },
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvZm9ybS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIkZvcm0iLCJCdXR0b24iLCJFeHBQcm90b2NvbCIsIlV0aWxzIiwiYnV0dG9ucyIsImNyZWF0ZSIsImlkIiwibGFiZWwiLCJjbGFzc2VzIiwiZXZlbnROYW1lIiwiZ2V0IiwibWF0Y2giLCJzcGxpY2UiLCJtb2RlbERhdGEiLCJmaWVsZHMiLCJkZXNjcmlwdGlvbiIsImRlZmF1bHRWYWx1ZSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uIiwiY2hhaW5PZkFjdGl2YXRpb24iLCJjaGFpblN0YXRlIiwiYmluZE1ldGhvZHMiLCJhZGRFdmVudExpc3RlbmVyIiwiX3VwZGF0ZUZvcm1WaWV3cyIsInNldFN0YXRlIiwiX21vZGVsIiwiX2RhdGEiLCJyZWdpb25zIiwiZGVmYXVsdCIsImZvckVhY2giLCJmaWVsZCIsImluZGV4IiwidXBkYXRlVmFsaWRhdGlvbiIsImN1c3RvbSIsInRlc3QiLCJmbiIsInZhbCIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3JNZXNzYWdlIiwidmFsaWRhdGUiLCJsaWdodENvbmZpZyIsImdldExpZ2h0Q29uZmlndXJhdGlvbiIsImxpZ2h0cyIsImV4cEZvcm0iLCJkYXRhIiwiY2xlYXIiLCJ0aGVuIiwiZ2V0RmllbGRzIiwidW5kZWZpbmVkIiwic2V0VmFsdWUiLCJzZXRWaXNpYmlsaXR5Iiwic3RhdGUiLCJ0b0xvd2VyQ2FzZSIsImRpc2FibGUiLCJnZXRCdXR0b24iLCJ2aWV3IiwiaGlkZSIsInNob3ciLCJlbmFibGUiLCJzZXREZWZhdWx0IiwibmV3QnRuIiwiZGVmYXVsdENvdW50ZXIiLCJleHBQcm90b2NvbCIsInZhbHVlIiwiY29uZmlnU3RhdGUiLCJBcnJheSIsImZpbGwiLCJwYW5lbCIsInB1c2giLCJsaWdodERpcmVjdGlvbnMiLCJjb25zb2xlIiwibG9nIiwibWFwIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJsYXN0SW5kZXhPZiIsImRpcmVjdGlvbiIsImxpZ2h0U3VjY2Vzc2lvbnMiLCJmaXJzdEJyaWdodG5lc3MiLCJzZWNvbmRCcmlnaHRuZXNzIiwiY3VyckxpZ2h0IiwibW9kaWZ5U2Vjb25kTGlnaHQiLCJsZW5ndGgiLCJldnQiLCJzaG93RGVzY3JpcHRpb24iLCJkZWx0YSIsIl9tb2RpZnlPcHRpb25zIiwiZmllbGRfZmlyc3RsaWdodCIsIl9maW5kRmllbGQiLCJuZXh0RmllbGQiLCJpc1Zpc2libGUiLCJuZXh0bmV4dEZpZWxkIiwiZmllbGRJZCIsImNudHIiLCJjcml0ZXJpYSIsImFkZGl0aW9uYWxseURpc2FibGUiLCJPYmplY3QiLCJrZXlzIiwiZ2V0T3B0aW9ucyIsImNob2ljZSIsImRpc2FibGVPcHRpb24iLCJlbmFibGVPcHRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQ0EsTUFBTUUsT0FBT0YsUUFBUSwwQkFBUixDQUFiO0FBQUEsTUFDRUcsU0FBU0gsUUFBUSw2QkFBUixDQURYO0FBQUEsTUFFRUksY0FBY0osUUFBUSxxQkFBUixDQUZoQjtBQUFBLE1BR0VLLFFBQVFMLFFBQVEsaUJBQVIsQ0FIVjs7QUFNQTtBQUFBOztBQUNFLDhCQUFjO0FBQUE7O0FBQ1osVUFBTU0sVUFBVSxDQUFDSCxPQUFPSSxNQUFQLENBQWM7QUFDN0JDLFlBQUksUUFEeUI7QUFFN0JDLGVBQU8sUUFGc0I7QUFHN0JDLGlCQUFTLENBQUMsMEJBQUQsQ0FIb0I7QUFJN0JDLG1CQUFXO0FBSmtCLE9BQWQsQ0FBRCxFQUtaUixPQUFPSSxNQUFQLENBQWM7QUFDaEJDLFlBQUksV0FEWTtBQUVoQkMsZUFBTywwQkFGUztBQUdoQkMsaUJBQVMsQ0FBQyw2QkFBRCxDQUhPO0FBSWhCQyxtQkFBVztBQUpLLE9BQWQsQ0FMWSxDQUFoQjtBQVdBLFVBQUlWLFFB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cEcsSUFBcEM7QUFpZEQsQ0F6ZEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvZXhwZXJpbWVudC9mb3JtX25hcnJhdGl2ZS9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKTtcbiAgY29uc3QgRm9ybSA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZm9ybScpLFxuICAgIEJ1dHRvbiA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2J1dHRvbi9maWVsZCcpLFxuICAgIEV4cFByb3RvY29sID0gcmVxdWlyZSgnLi9leHBwcm90b2NvbC9maWVsZCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJylcbiAgO1xuXG4gIHJldHVybiBjbGFzcyBFeHBlcmltZW50Rm9ybSBleHRlbmRzIEZvcm0ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgY29uc3QgYnV0dG9ucyA9IFtCdXR0b24uY3JlYXRlKHtcbiAgICAgICAgaWQ6ICdzdWJtaXQnLFxuICAgICAgICBsYWJlbDogJ1N1Ym1pdCcsXG4gICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fc3VibWl0J10sXG4gICAgICAgIGV2ZW50TmFtZTogJ0V4cGVyaW1lbnQuU3VibWl0J1xuICAgICAgfSksIEJ1dHRvbi5jcmVhdGUoe1xuICAgICAgICBpZDogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGxhYmVsOiAnQWRkIFJlc3VsdHMgdG8gQWdncmVnYXRlJyxcbiAgICAgICAgY2xhc3NlczogWydmb3JtX19leHBlcmltZW50X19hZ2dyZWdhdGUnXSxcbiAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5BZGRUb0FnZ3JlZ2F0ZSdcbiAgICAgIH0pXTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBlcmltZW50TW9kYWxpdHknKS5tYXRjaCgnY3JlYXRlJykpIHtcbiAgICAgICAgYnV0dG9ucy5zcGxpY2UoMiwgMCwgQnV0dG9uLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICduZXcnLFxuICAgICAgICAgIGxhYmVsOiAnTmV3IEV4cGVyaW1lbnQnLFxuICAgICAgICAgIGNsYXNzZXM6IFsnZm9ybV9fZXhwZXJpbWVudF9fbmV3J10sXG4gICAgICAgICAgZXZlbnROYW1lOiAnRXhwZXJpbWVudC5OZXdSZXF1ZXN0J1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHN1cGVyKHtcbiAgICAgICAgbW9kZWxEYXRhOiB7XG4gICAgICAgICAgaWQ6IFwiZXhwZXJpbWVudFwiLFxuICAgICAgICAgIGNsYXNzZXM6IFtcImZvcm1fX2V4cGVyaW1lbnRcIl0sXG4gICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiMS4gVmFyaWFibGUgdG8gYmUgY2hhbmdlZDpcIixcbiAgICAgICAgICAgICAgbGFiZWw6JycsXG4gICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJyxcbiAgICAgICAgICAgICAgY2xhc3NlczpbXSxcbiAgICAgICAgICAgICAgb3B0aW9uczogeydkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc6ICdwbGVhc2UgY2hvb3NlIG9uZScsICdicmlnaHRuZXNzJzogJ0JyaWdodG5lc3Mgb2YgdGhlIGxpZ2h0JywgJ2RpcmVjdGlvbic6ICdEaXJlY3Rpb24gb2YgdGhlIGxpZ2h0J30sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb246IHt9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIEV4cFByb3RvY29sLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIGlkOiBcImV4cF9wcm9jZWR1cmVcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnMi4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjIuIFByb2NlZHVyZSBmb3IgY2hhbmdpbmcgdGhlIGJyaWdodG5lc3M6XCIsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb24nOiBcIjIuIFByb2NlZHVyZSBmb3IgY2hhbmdpbmcgdGhlIGRpcmVjdGlvbjpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6ICdHcmFkdWFsbHkgaW5jcmVhc2UgdGhlIGJyaWdodG5lc3MnLCAnYnJpZ2h0bmVzc19kZWNyZWFzZSc6ICdHcmFkdWFsbHkgZGVjcmVhc2UgdGhlIGJyaWdodG5lc3MnLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uX2Fyb3VuZCc6ICdNYWtlIHRoZSBsaWdodCBnbyBhcm91bmQnLCAnZGlyZWN0aW9uX2hvbGQnOiAnS2VlcCBvbmUgZGlyZWN0aW9uJywgJ2RpcmVjdGlvbl9hbHRlcm5hdGUnOiAnQWx0ZXJuYXRlIGJldHdlZW4gdHdvIGRpcmVjdGlvbnMnfSxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvbjoge31cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgRXhwUHJvdG9jb2wuY3JlYXRlKHtcbiAgICAgICAgICAgICAgaWQ6IFwiZXhwX2hvbGRjb25zdGFudFwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICczLiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiMy4gRml4IHRoZSBkaXJlY3Rpb24gb2YgbGlnaHQgdG86XCIsXG4gICAgICAgICAgICAgICdkaXJlY3Rpb24nOiBcIjMuIEZpeCB0aGUgYnJpZ2h0bmVzcyBvZiBsaWdodCB0bzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5mb3JtT3B0aW9ucycpID09ICdjb21wbGV0ZScgPyB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl8yNSc6ICdkaW0nLCAnZGlyZWN0aW9uXzUwJzogJ21lZGl1bScsICdkaXJlY3Rpb25fMTAwJzogJ2JyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnJpZ2h0bmVzc19hbGxkaXInOiAnZnJvbSBhbGwgZGlyZWN0aW9ucycsICdicmlnaHRuZXNzX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdicmlnaHRuZXNzX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnYnJpZ2h0bmVzc19yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsJ2JyaWdodG5lc3NfYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9IDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnZGlyZWN0aW9uXzI1JzogJ2RpbScsICdkaXJlY3Rpb25fNTAnOiAnbWVkaXVtJywgJ2RpcmVjdGlvbl8xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdicmlnaHRuZXNzX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdicmlnaHRuZXNzX3RvcCc6ICdmcm9tIHRoZSB0b3AnLCAnYnJpZ2h0bmVzc19yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsJ2JyaWdodG5lc3NfYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfZmlyc3RsaWdodFwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc0LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNC4gQnJpZ2h0bmVzcyBzdGFydCBzZXR0aW5nOlwiLFxuICAgICAgICAgICAgICAnZGlyZWN0aW9uJzogXCI0LiBEaXJlY3Rpb24gc3RhcnQgc2V0dGluZzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5mb3JtT3B0aW9ucycpID09ICdjb21wbGV0ZScgPyB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wbGVmdCc6ICdmcm9tIHRoZSB0b3AtbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JywgJ2RpcmVjdGlvbl9sZWZ0JzogJ2Zyb20gdGhlIGxlZnQnLCAnZGlyZWN0aW9uX3RvcCc6ICdmcm9tIHRoZSB0b3AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpcmVjdGlvbl9yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsICdkaXJlY3Rpb25fYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfc2Vjb25kbGlnaHRcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHsnZGVmYXVsdF9jaG9pY2UnOiAnNS4gRGVjaWRlIG9uIHRoZSBwcmV2aW91cyBxdWVzdGlvbnMgZmlyc3QuJywgJ2JyaWdodG5lc3MnOiBcIjUuIEJyaWdodG5lc3Mgc2Vjb25kIHNldHRpbmc6XCIsICdkaXJlY3Rpb24nOiBcIjUuIERpcmVjdGlvbiBzZWNvbmQgc2V0dGluZzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuZXhwZXJpbWVudC5mb3JtT3B0aW9ucycpID09ICdjb21wbGV0ZScgPyB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fYWxsZGlyJzogJ2Zyb20gYWxsIGRpcmVjdGlvbnMnLCAnZGlyZWN0aW9uX2xlZnQnOiAnZnJvbSB0aGUgbGVmdCcsICdkaXJlY3Rpb25fdG9wJzogJ2Zyb20gdGhlIHRvcCcsICdkaXJlY3Rpb25fcmlnaHQnOiAnZnJvbSB0aGUgcmlnaHQnLCAnZGlyZWN0aW9uX2JvdHRvbSc6ICdmcm9tIHRoZSBib3R0b20nfSA6XG4gICAgICAgICAgICAgICAgICAgICAgICB7J2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJzogJ3BsZWFzZSBjaG9vc2Ugb25lJywgJ2RpcmVjdGlvbl9icmlnaHRuZXNzXzAnOiAnbm8gbGlnaHQnLCAnYnJpZ2h0bmVzc18yNSc6ICdkaW0nLCAnYnJpZ2h0bmVzc181MCc6ICdtZWRpdW0nLCAnYnJpZ2h0bmVzc18xMDAnOiAnYnJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXJlY3Rpb25fbGVmdCc6ICdmcm9tIHRoZSBsZWZ0JywgJ2RpcmVjdGlvbl90b3AnOiAnZnJvbSB0aGUgdG9wJywgJ2RpcmVjdGlvbl9yaWdodCc6ICdmcm9tIHRoZSByaWdodCcsICdkaXJlY3Rpb25fYm90dG9tJzogJ2Zyb20gdGhlIGJvdHRvbSd9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBFeHBQcm90b2NvbC5jcmVhdGUoe1xuICAgICAgICAgICAgICBpZDogXCJleHBfbGlnaHRkdXJhdGlvblwiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogeydkZWZhdWx0X2Nob2ljZSc6ICc2LiBEZWNpZGUgb24gdGhlIHByZXZpb3VzIHF1ZXN0aW9ucyBmaXJzdC4nLCAnYnJpZ2h0bmVzcyc6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIiwgJ2RpcmVjdGlvbic6IFwiNi4gVGltZSBwZXIgc2V0dGluZzpcIn0sXG4gICAgICAgICAgICAgIGxhYmVsOicnLFxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU6ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScsXG4gICAgICAgICAgICAgIGNsYXNzZXM6W10sXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnOiAncGxlYXNlIGNob29zZSBvbmUnLCAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbic6ICdhbHRlcm5hdGUgMTUgc2Vjb25kcyBvbicsICdicmlnaHRuZXNzX2RpcmVjdGlvbl8zMG9uJzogJ2VhY2ggMzAgc2Vjb25kcyBvbid9LFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7fVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdLFxuICAgICAgICAgIGJ1dHRvbnM6IGJ1dHRvbnNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5jaGFpbk9mQWN0aXZhdGlvbiA9IHtcbiAgICAgICAgJ2Z1bGxDaGFpbk9mQWN0aXZhdGlvbic6IHtcImV4cF9jYXRlZ29yeVwiOiBcImV4cF9wcm9jZWR1cmVcIiwgXCJleHBfcHJvY2VkdXJlXCI6IFwiZXhwX2hvbGRjb25zdGFudFwiLCBcImV4cF9ob2xkY29uc3RhbnRcIjogXCJleHBfZmlyc3RsaWdodFwiLCBcImV4cF9maXJzdGxpZ2h0XCI6IFwiZXhwX3NlY29uZGxpZ2h0XCIsIFwiZXhwX3NlY29uZGxpZ2h0XCI6IFwiZXhwX2xpZ2h0ZHVyYXRpb25cIn0sXG4gICAgICAgICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nOiB7XCJleHBfY2F0ZWdvcnlcIjogXCJleHBfcHJvY2VkdXJlXCIsIFwiZXhwX3Byb2NlZHVyZVwiOiBcImV4cF9ob2xkY29uc3RhbnRcIiwgXCJleHBfaG9sZGNvbnN0YW50XCI6IFwiZXhwX2ZpcnN0bGlnaHRcIn1cbiAgICAgIH07XG4gICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcblxuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfdXBkYXRlRm9ybVZpZXdzJywnc2V0U3RhdGUnLCAndmFsaWRhdGUnLCAnZ2V0TGlnaHRDb25maWd1cmF0aW9uJ10pXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRDaGFuZ2VkJywgdGhpcy5fdXBkYXRlRm9ybVZpZXdzKVxuICAgICAgdGhpcy5zZXRTdGF0ZSgnbmV3Jyk7XG4gICAgfVxuXG5cbiAgICB2YWxpZGF0ZSgpIHtcblxuICAgICAgc3dpdGNoICh0aGlzLmNoYWluU3RhdGUpIHtcbiAgICAgICAgY2FzZSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGZpZWxkLnVwZGF0ZVZhbGlkYXRpb24oe2N1c3RvbToge1xuICAgICAgICAgICAgICB0ZXN0OiAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgZm46ICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmFsLm1hdGNoKCdkZWZhdWx0JykpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSkgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBcIllvdSBoYXZlIHRvIGNob29zZSB2YWxpZCBvcHRpb25zIGZvciB0aGUgXCIgKyAoMSArIGluZGV4KSArIFwidGggZmllbGQuXCJcbiAgICAgICAgICAgIH19KVxuICAgICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJzpcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfc2Vjb25kbGlnaHQnICYgZmllbGQuaWQoKSAhPSAnZXhwX2xpZ2h0ZHVyYXRpb24nKSB7XG4gICAgICAgICAgICAgIGZpZWxkLnVwZGF0ZVZhbGlkYXRpb24oe2N1c3RvbToge1xuICAgICAgICAgICAgICAgIHRlc3Q6ICdjdXN0b20nLFxuICAgICAgICAgICAgICAgIGZuOiAodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAodmFsLm1hdGNoKCdkZWZhdWx0JykpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSkgfVxuICAgICAgICAgICAgICAgICAgZWxzZSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSkgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBcIllvdSBoYXZlIHRvIGNob29zZSB2YWxpZCBvcHRpb25zIGZvciB0aGUgXCIgKyAoMSArIGluZGV4KSArIFwidGggZmllbGQuXCJcbiAgICAgICAgICAgICAgfX0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaWVsZC51cGRhdGVWYWxpZGF0aW9uKHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC52YWxpZGF0ZSgpO1xuICAgIH1cblxuICAgIGV4cG9ydCgpIHtcbiAgICAgIHZhciBsaWdodENvbmZpZyA9IHRoaXMuZ2V0TGlnaHRDb25maWd1cmF0aW9uKCk7XG4gICAgICByZXR1cm4ge2xpZ2h0czogbGlnaHRDb25maWdbJ2xpZ2h0cyddLCBleHBGb3JtOiBzdXBlci5leHBvcnQoKX07XG4gICAgfVxuXG4gICAgaW1wb3J0KGRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGZpZWxkIG9mIHRoaXMuX21vZGVsLmdldEZpZWxkcygpKSB7XG4gICAgICAgICAgaWYgKGRhdGFbZmllbGQuaWQoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmllbGQuc2V0VmFsdWUoZGF0YVtmaWVsZC5pZCgpXSk7XG4gICAgICAgICAgICBpZiAoZGF0YVtmaWVsZC5pZCgpXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLnNldFZpc2liaWxpdHkoJ2hpZGRlbicsMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgIGNhc2UgXCJoaXN0b3JpY2FsXCI6XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9ICdoaXN0b3JpY2FsJ1xuICAgICAgICAgIHN3aXRjaCAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwZXJpbWVudE1vZGFsaXR5JykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcIm9ic2VydmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV4cGxvcmVcIjpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgZmllbGQuZGlzYWJsZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB0aGlzLmdldEJ1dHRvbignc3VibWl0JykudmlldygpLmhpZGUoKTtcbiAgICAgICAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdTdGF0ZS5leHBlcmltZW50LmFsbG93TmV3JykpIHsgdGhpcy5nZXRCdXR0b24oJ25ldycpLnZpZXcoKS5oaWRlKCk7fVxuICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdhZ2dyZWdhdGUnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XG4gICAgICAgICAgICBjYXNlIFwiY3JlYXRlYW5kaGlzdG9yeVwiOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBmaWVsZC5kaXNhYmxlKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuaGlkZSgpO1xuICAgICAgICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ1N0YXRlLmV4cGVyaW1lbnQuYWxsb3dOZXcnKSkgeyB0aGlzLmdldEJ1dHRvbignbmV3JykudmlldygpLnNob3coKTt9XG4gICAgICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLmFnZ3JlZ2F0ZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5zaG93KCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCdXR0b24oJ2FnZ3JlZ2F0ZScpLnZpZXcoKS5oaWRlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJuZXdcIjpcbiAgICAgICAgICB0aGlzLnN0YXRlID0gJ25ldyc7XG4gICAgICAgICAgdGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmllbGQuaWQoKSA9PSAnZXhwX2NhdGVnb3J5Jykge1xuICAgICAgICAgICAgICBmaWVsZC5lbmFibGUoKVxuICAgICAgICAgICAgICBmaWVsZC5zZXRWaXNpYmlsaXR5KCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgIGZpZWxkLnNldERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZ2V0QnV0dG9uKCdzdWJtaXQnKS52aWV3KCkuc2hvdygpO1xuICAgICAgICAgIGlmIChHbG9iYWxzLmdldCgnU3RhdGUuZXhwZXJpbWVudC5hbGxvd05ldycpKSB7IHRoaXMuZ2V0QnV0dG9uKCduZXcnKS52aWV3KCkuaGlkZSgpO31cbiAgICAgICAgICB0aGlzLmdldEJ1dHRvbignYWdncmVnYXRlJykudmlldygpLmhpZGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZGlzYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZU5ldygpIHtcbiAgICAgIGNvbnN0IG5ld0J0biA9IHRoaXMuZ2V0QnV0dG9uKCduZXcnKVxuICAgICAgaWYgKG5ld0J0bikge1xuICAgICAgICBuZXdCdG4uZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGlnaHRDb25maWd1cmF0aW9uKCkge1xuICAgICAgLy8gVHJhbnNsYXRlIGZpZWxkcyBpbnRvIFt7XCJsZWZ0XCI6IDEwMCwgXCJyaWdodFwiOiAwLCBcInRvcFwiOiAwLCBcImJvdHRvbVwiOiAxMDAsIFwiZHVyYXRpb25cIjogMTV9LCAuLi5dXG4gICAgICBsZXQgZGVmYXVsdENvdW50ZXIgPSAwO1xuICAgICAgdGhpcy5leHBQcm90b2NvbCA9IHt9XG4gICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgdGhpcy5leHBQcm90b2NvbFtmaWVsZC5pZCgpXSA9IGZpZWxkLnZhbHVlKClcbiAgICAgICAgZGVmYXVsdENvdW50ZXIgPSBmaWVsZC52YWx1ZSgpID09ICdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZSc/IGRlZmF1bHRDb3VudGVyICsgMSA6IGRlZmF1bHRDb3VudGVyO1xuICAgICAgfSlcblxuICAgICAgbGV0IGNvbmZpZ1N0YXRlID0gZmFsc2U7XG4gICAgICBpZiAoZGVmYXVsdENvdW50ZXIgPCAzKSB7IGNvbmZpZ1N0YXRlID0gdHJ1ZTsgfVxuXG4gICAgICB2YXIgbGlnaHRDb25maWcgPSB7fVxuICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXSA9IEFycmF5KDQpLmZpbGwoLTEpO1xuICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddID0gW107XG4gICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykgeyBsaWdodENvbmZpZ1snbGlnaHRzJ10ucHVzaCh7J2xlZnQnOiAwLCAndG9wJzogMCwgJ3JpZ2h0JzogMCwgJ2JvdHRvbSc6IDAsICdkdXJhdGlvbic6IDE1fSkgfVxuXG4gICAgICBpZiAoY29uZmlnU3RhdGUpIHtcbiAgICAgICAgdmFyIGxpZ2h0RGlyZWN0aW9ucyA9IFsnbGVmdCcsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJ107XG5cbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgZml4ZWQgdmFsdWVcbiAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9ob2xkY29uc3RhbnQnXSA9PSAnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSB7Y29uc29sZS5sb2coJ3RoZXJlIGlzIGEgcHJvYmxlbScpfVxuICAgICAgICBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKCdkaXJlY3Rpb24nKSkge1xuICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ10gPSBBcnJheSg0KS5maWxsKCkubWFwKGZ1bmN0aW9uKCkgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKC9cXGQrLylbMF0pIH0sdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICBsZXQgc3Vic3RyID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgc3Vic3RyID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2hvbGRjb25zdGFudCddLnN1YnN0cihzdWJzdHIrMSk7XG4gICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBzdWJzdHIubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IDEwMCA6IDAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb2RpZnkgYWxsIHBhbmVsc1xuICAgICAgICB2YXIgbGlnaHRTdWNjZXNzaW9ucyA9IHsnbGVmdCc6ICd0b3AnLCAndG9wJzogJ3JpZ2h0JywgJ3JpZ2h0JzogJ2JvdHRvbScsICdib3R0b20nOiAnbGVmdCcsICd0b3BsZWZ0JzogJ3RvcHJpZ2h0JywgJ3RvcHJpZ2h0JzogJ2JvdHRvbXJpZ2h0JywgJ2JvdHRvbXJpZ2h0JzogJ2JvdHRvbWxlZnQnLCAnYm90dG9tbGVmdCc6ICd0b3BsZWZ0J307XG4gICAgICAgIHZhciBmaXJzdEJyaWdodG5lc3MgPSBudWxsO1xuICAgICAgICB2YXIgc2Vjb25kQnJpZ2h0bmVzcyA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuY2hhaW5TdGF0ZSA9PSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJyAmICEodGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXSA9PSdkaXJlY3Rpb25fYnJpZ2h0bmVzc19kZWZhdWx0X2Nob2ljZScpKSB7XG5cbiAgICAgICAgICBzd2l0Y2ggKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9wcm9jZWR1cmUnXSkge1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19pbmNyZWFzZSc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3MgICsgMjUgKiBwYW5lbDtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfZGVjcmVhc2UnOlxuICAgICAgICAgICAgICBmaXJzdEJyaWdodG5lc3MgPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKC9cXGQrLylbMF0pO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdID0gZmlyc3RCcmlnaHRuZXNzIC0gMjUgKiBwYW5lbDtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaG9sZCc6XG4gICAgICAgICAgICAgIGZpcnN0QnJpZ2h0bmVzcyA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGZvciAobGV0IHBhbmVsID0gMDsgcGFuZWwgPCA0OyBwYW5lbCsrKSB7XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSBmaXJzdEJyaWdodG5lc3M7XG4gICAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVtwYW5lbF1bZGlyZWN0aW9uXSA+IDAgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fYXJvdW5kJzpcbiAgICAgICAgICAgICAgdmFyIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubGFzdEluZGV4T2YoJ18nKTtcbiAgICAgICAgICAgICAgY3VyckxpZ2h0ID0gdGhpcy5leHBQcm90b2NvbFsnZXhwX2ZpcnN0bGlnaHQnXS5zdWJzdHIoY3VyckxpZ2h0KzEpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBwYW5lbCA9IDA7IHBhbmVsIDwgNDsgcGFuZWwrKykge1xuICAgICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bcGFuZWxdW2RpcmVjdGlvbl0gPSBjdXJyTGlnaHQubWF0Y2goZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bcGFuZWxdIDogMCApO1xuICAgICAgICAgICAgICAgIGN1cnJMaWdodCA9IGxpZ2h0U3VjY2Vzc2lvbnNbY3VyckxpZ2h0XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25faG9sZCc6XG4gICAgICAgICAgICAgIHZhciBjdXJyTGlnaHQgPSB0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLmxhc3RJbmRleE9mKCdfJyk7XG4gICAgICAgICAgICAgIGN1cnJMaWdodCA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10uc3Vic3RyKGN1cnJMaWdodCsxKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgcGFuZWwgPSAwOyBwYW5lbCA8IDQ7IHBhbmVsKyspIHtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW3BhbmVsXVtkaXJlY3Rpb25dID0gY3VyckxpZ2h0Lm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW3BhbmVsXSA6IDAgKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyckxpZ2h0ID09ICcwJykgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVtwYW5lbF0gPSAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgeyAvLyBpZiBpcyBhbHRlcm5hdGluZ1xuXG4gICAgICAgICAgLy8gTW9kaWZ5IHRoZSBmaXJzdCBwYW5lbFxuICAgICAgICAgIGlmICghKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfZmlyc3RsaWdodCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVswXSA9IHBhcnNlSW50KHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goL1xcZCsvKVswXSk7XG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1bZGlyZWN0aW9uXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVswXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF0gOiAwICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goJ2RpcmVjdGlvbicpKSB7XG4gICAgICAgICAgICAgIGxpZ2h0RGlyZWN0aW9ucy5mb3JFYWNoKCAoZGlyZWN0aW9uKSA9PiBsaWdodENvbmZpZ1snbGlnaHRzJ11bMF1bZGlyZWN0aW9uXSA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9maXJzdGxpZ2h0J10ubWF0Y2goJ2FsbGRpcnwnICsgZGlyZWN0aW9uKSA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF0gOiAwICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTW9kaWZ5IHRoZSByZW1haW5pbmcgcGFuZWxzXG4gICAgICAgICAgaWYgKCEodGhpcy5leHBQcm90b2NvbFsnZXhwX3NlY29uZGxpZ2h0J10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykgJiAhKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9saWdodGR1cmF0aW9uJ10gPT0gJ2RpcmVjdGlvbl9icmlnaHRuZXNzX2RlZmF1bHRfY2hvaWNlJykpIHtcbiAgICAgICAgICAgIHZhciBtb2RpZnlTZWNvbmRMaWdodCA9IFtdO1xuICAgICAgICAgICAgc3dpdGNoKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9saWdodGR1cmF0aW9uJ10pIHtcbiAgICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMTVvbic6XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzJdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVsyXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMF1cbiAgICAgICAgICAgICAgICBtb2RpZnlTZWNvbmRMaWdodCA9IFsxLDNdXG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RpcmVjdGlvbl8xNW9ub2ZmJzpcbiAgICAgICAgICAgICAgICBsZXQgbGlnaHRzID0geydkdXJhdGlvbic6IDE1fTtcbiAgICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCgoZGlyZWN0aW9uKSA9PiBsaWdodHNbZGlyZWN0aW9uXSA9IDApO1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydsaWdodHMnXVsxXSA9IGxpZ2h0c1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV0gPSAwXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzNdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdXG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVszXSA9IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV1cbiAgICAgICAgICAgICAgICBtb2RpZnlTZWNvbmRMaWdodCA9IFsyXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19kaXJlY3Rpb25fMzBvbic6XG4gICAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddWzFdID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddWzBdO1xuICAgICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bMV0gPSBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddWzBdXG4gICAgICAgICAgICAgICAgbW9kaWZ5U2Vjb25kTGlnaHQgPSBbMiwzXVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdicmlnaHRuZXNzJykpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV0gPSBwYXJzZUludCh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgvXFxkKy8pWzBdKVxuICAgICAgICAgICAgICBsaWdodERpcmVjdGlvbnMuZm9yRWFjaCggKGRpcmVjdGlvbikgPT4gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID0gbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzBdXVtkaXJlY3Rpb25dID4gMCA/IGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMF1dIDogMCApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV4cFByb3RvY29sWydleHBfc2Vjb25kbGlnaHQnXS5tYXRjaCgnZGlyZWN0aW9uJykpIHtcbiAgICAgICAgICAgICAgbGlnaHREaXJlY3Rpb25zLmZvckVhY2goIChkaXJlY3Rpb24pID0+IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV1bZGlyZWN0aW9uXSA9IHRoaXMuZXhwUHJvdG9jb2xbJ2V4cF9zZWNvbmRsaWdodCddLm1hdGNoKCdhbGxkaXJ8JyArIGRpcmVjdGlvbikgPyBsaWdodENvbmZpZ1snYnJpZ2h0bmVzcyddW21vZGlmeVNlY29uZExpZ2h0WzBdXSA6IDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1vZGlmeVNlY29uZExpZ2h0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgbGlnaHRDb25maWdbJ2xpZ2h0cyddW21vZGlmeVNlY29uZExpZ2h0WzFdXSA9IGxpZ2h0Q29uZmlnWydsaWdodHMnXVttb2RpZnlTZWNvbmRMaWdodFswXV07XG4gICAgICAgICAgICAgIGxpZ2h0Q29uZmlnWydicmlnaHRuZXNzJ11bbW9kaWZ5U2Vjb25kTGlnaHRbMV1dID0gbGlnaHRDb25maWdbJ2JyaWdodG5lc3MnXVttb2RpZnlTZWNvbmRMaWdodFswXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsaWdodENvbmZpZ1xuICAgIH1cblxuICAgIF91cGRhdGVGb3JtVmlld3MoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkID09ICdleHBfY2F0ZWdvcnknKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5mb3JFYWNoKChmaWVsZCxpbmRleCkgPT4ge1xuICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfY2F0ZWdvcnknKXtcbiAgICAgICAgICAgIGZpZWxkLnNob3dEZXNjcmlwdGlvbihldnQuZGF0YS5kZWx0YS52YWx1ZS5tYXRjaCgnZGVmYXVsdF9jaG9pY2UnKSA/ICdkZWZhdWx0X2Nob2ljZScgOiBldnQuZGF0YS5kZWx0YS52YWx1ZSlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlID09ICduZXcnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkLCBldnQuZGF0YS5kZWx0YS52YWx1ZSlcblxuICAgICAgICAgIH0gZWxzZSB7IC8vIGlmIGl0IGlzIGV4cF9jYXRlZ29yeVxuICAgICAgICAgICAgZmllbGQuc2hvd0Rlc2NyaXB0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcblxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS5maWVsZC5fbW9kZWwuX2RhdGEuaWQgPT0gJ2V4cF9wcm9jZWR1cmUnKSB7IC8vIFRoZSBjaG9zZW4gcHJvY2VkdXJlIGRldGVybWluZXMgd2hhdCBmaWVsZHMgdG8gc2hvd1xuXG4gICAgICAgICAgLy9EaXNhYmxlIG9wdGlvbnMgb2YgZXhwX2ZpcnN0bGlnaHQgZGVwZW5kaW5nIG9uIHdoYXQgaGFzIGJlZW4gY2hvc2VcbiAgICAgICAgICB2YXIgZmllbGRfZmlyc3RsaWdodCA9IHRoaXMuX2ZpbmRGaWVsZCgnZXhwX2ZpcnN0bGlnaHQnKTtcbiAgICAgICAgICBzd2l0Y2ggKGV2dC5kYXRhLmRlbHRhLnZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICdicmlnaHRuZXNzX2RlY3JlYXNlJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnYnJpZ2h0bmVzc18xMDAnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfaW5jcmVhc2UnOlxuICAgICAgICAgICAgICB0aGlzLl9tb2RpZnlPcHRpb25zKGZpZWxkX2ZpcnN0bGlnaHQsICdicmlnaHRuZXNzXzI1Jyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fYXJvdW5kJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnX2xlZnR8X3RvcGxlZnQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jaGFpblN0YXRlID0gJ3BhcnRpYWxDaGFpbk9mQWN0aXZhdGlvbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JyaWdodG5lc3NfYWx0ZXJuYXRlJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnYnJpZ2h0bmVzcycpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAnZnVsbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYnJpZ2h0bmVzc19ob2xkJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCdicmlnaHRuZXNzJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdwYXJ0aWFsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25fYWx0ZXJuYXRlJzpcbiAgICAgICAgICAgICAgdGhpcy5fbW9kaWZ5T3B0aW9ucyhmaWVsZF9maXJzdGxpZ2h0LCAnZGlyZWN0aW9uJyk7XG4gICAgICAgICAgICAgIHRoaXMuY2hhaW5TdGF0ZSA9ICdmdWxsQ2hhaW5PZkFjdGl2YXRpb24nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkaXJlY3Rpb25faG9sZCc6XG4gICAgICAgICAgICAgIHRoaXMuX21vZGlmeU9wdGlvbnMoZmllbGRfZmlyc3RsaWdodCwgJ2RpcmVjdGlvbicsICdfdG9wbGVmdCcpO1xuICAgICAgICAgICAgICB0aGlzLmNoYWluU3RhdGUgPSAncGFydGlhbENoYWluT2ZBY3RpdmF0aW9uJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlLWluaXRpYWxpemUgc3VjY2Vzc2l2ZSBmaWVsZHNcbiAgICAgICAgICB0aGlzLl9tb2RlbC5fZGF0YS5yZWdpb25zLmRlZmF1bHQuZm9yRWFjaCgoZmllbGQsaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pZCgpICE9ICdleHBfY2F0ZWdvcnknICYgZmllbGQuaWQoKSAhPSAnZXhwX3Byb2NlZHVyZScgJiB0aGlzLnN0YXRlID09ICduZXcnKSB7XG4gICAgICAgICAgICAgIGZpZWxkLmRpc2FibGUoKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwKTtcbiAgICAgICAgICAgICAgZmllbGQuc2V0RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gSXMgdGhlIG5leHQgZmllbGQgYWN0aXZhdGVkP1xuICAgICAgdmFyIG5leHRGaWVsZCA9IHRoaXMuX2ZpbmRGaWVsZCh0aGlzLmNoYWluT2ZBY3RpdmF0aW9uW3RoaXMuY2hhaW5TdGF0ZV1bZXZ0LmRhdGEuZmllbGQuX21vZGVsLl9kYXRhLmlkXSk7XG4gICAgICBpZiAobmV4dEZpZWxkID8gIW5leHRGaWVsZC5pc1Zpc2libGUoKSA6IGZhbHNlKSB7XG4gICAgICAgICAgbmV4dEZpZWxkLnNldFZpc2liaWxpdHkoJ3Zpc2libGUnKTtcbiAgICAgICAgICBuZXh0RmllbGQuZW5hYmxlKCk7XG5cbiAgICAgICAgICB2YXIgbmV4dG5leHRGaWVsZCA9IHRoaXMuX2ZpbmRGaWVsZCh0aGlzLmNoYWluT2ZBY3RpdmF0aW9uW3RoaXMuY2hhaW5TdGF0ZV1bbmV4dEZpZWxkLmlkKCldKTtcbiAgICAgICAgICBpZiAobmV4dG5leHRGaWVsZCkge25leHRuZXh0RmllbGQuc2V0VmlzaWJpbGl0eSgnaGlkZGVuJywwLjMpfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9maW5kRmllbGQoZmllbGRJZCkge1xuICAgICAgdmFyIGZpZWxkID0gbnVsbDtcbiAgICAgIGZvciAodmFyIGNudHIgPSAwOyBjbnRyPHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdC5sZW5ndGg7IGNudHIrKykge1xuICAgICAgICBpZiAodGhpcy5fbW9kZWwuX2RhdGEucmVnaW9ucy5kZWZhdWx0W2NudHJdLmlkKCk9PWZpZWxkSWQpIHtcbiAgICAgICAgICBmaWVsZCA9IHRoaXMuX21vZGVsLl9kYXRhLnJlZ2lvbnMuZGVmYXVsdFtjbnRyXVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRcbiAgICB9XG5cbiAgICBfbW9kaWZ5T3B0aW9ucyhmaWVsZCwgY3JpdGVyaWEsIGFkZGl0aW9uYWxseURpc2FibGUgPSBudWxsKSB7XG4gICAgICBPYmplY3Qua2V5cyhmaWVsZC5nZXRPcHRpb25zKCkpLmZvckVhY2goKGNob2ljZSkgPT4ge1xuICAgICAgICBpZiAoKGNob2ljZS5tYXRjaChhZGRpdGlvbmFsbHlEaXNhYmxlKSB8fCAhY2hvaWNlLm1hdGNoKGNyaXRlcmlhKSkgJiYgIWNob2ljZS5tYXRjaCgnZGlyZWN0aW9uX2JyaWdodG5lc3NfZGVmYXVsdF9jaG9pY2UnKSkge1xuICAgICAgICAgIGZpZWxkLmRpc2FibGVPcHRpb24oY2hvaWNlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpZWxkLmVuYWJsZU9wdGlvbihjaG9pY2UpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfVxuICB9XG59KVxuIl19
