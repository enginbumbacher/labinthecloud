'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Module = require('core/app/module'),
      ModelingDataTab = require('./blocklytab/tab'),
      SymSliderField = require('core/component/symsliderfield/field'),
      SliderField = require('core/component/sliderfield/field'),
      SelectField = require('core/component/selectfield/field'),
      ModelView = require('./threeview');

  var defaultConfigs = require('./bodyConfigurations/bodyconfigs/listofconfigs');

  var ModelingDataModule = function (_Module) {
    _inherits(ModelingDataModule, _Module);

    function ModelingDataModule() {
      _classCallCheck(this, ModelingDataModule);

      var _this = _possibleConstructorReturn(this, (ModelingDataModule.__proto__ || Object.getPrototypeOf(ModelingDataModule)).call(this));

      if (Globals.get('AppConfig.modeling')) {
        Utils.bindMethods(_this, ['_onPhaseChange', '_onExperimentCountChange', '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView']);

        _this.tab = new ModelingDataTab();

        Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
        Globals.get('Relay').addEventListener('ExperimentCount.Change', _this._onExperimentCountChange);

        HM.hook('ModelForm.Fields', _this._hookModelFields);
        HM.hook('ModelForm.ModifyExport', _this._hookModifyExport);
        HM.hook('ModelForm.ModifyImport', _this._hookModifyImport);
        HM.hook('Euglena.3dView', _this._hook3dView);
      }
      return _this;
    }

    _createClass(ModelingDataModule, [{
      key: 'run',
      value: function run() {
        if (this.tab) Globals.get('Layout').getPanel('result').addContent(this.tab.view());
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
          this.tab.hide();
        }
      }
    }, {
      key: '_onExperimentCountChange',
      value: function _onExperimentCountChange(evt) {
        if (evt.data.count && !evt.data.old) {
          this.tab.show();
        } else if (!evt.data.count) {
          this.tab.hide();
        }
      }
    }, {
      key: '_hookModelFields',
      value: function _hookModelFields(fields, meta) {
        var _this2 = this;

        if (meta.type == "blockly") {
          var bodyConfigs = Array.apply(null, { length: Object.keys(defaultConfigs).length }).map(function (number, ind) {
            return 'configuration_' + (ind + 1);
          });
          this.bodyConfigOptions = {};
          bodyConfigs.map(function (bodyconfig) {
            return _this2.bodyConfigOptions[bodyconfig] = defaultConfigs[bodyconfig]['id'];
          });
          fields = fields.concat([SelectField.create({
            id: "bodyConfigurationName",
            inverse_order: true,
            color: meta.config.bodyConfiguration.color ? meta.config.bodyConfiguration.color : null,
            label: meta.config.bodyConfiguration.label,
            value: meta.config.bodyConfiguration.initialValue,
            defaultValue: meta.config.bodyConfiguration.initialValue,
            classes: [],
            options: this.bodyConfigOptions
          }), SelectField.create({
            id: 'opacity',
            inverse_order: true,
            label: meta.config.opacity.label,
            color: meta.config.opacity.color ? meta.config.opacity.color : null,
            value: meta.config.opacity.initialValue,
            defaultValue: meta.config.opacity.initialValue,
            classes: [],
            options: meta.config.opacity.options
          }), SelectField.create({
            id: 'k',
            inverse_order: true,
            label: meta.config.K.label,
            color: meta.config.K.color ? meta.config.K.color : null,
            value: meta.config.K.initialValue,
            defaultValue: meta.config.K.initialValue,
            classes: [],
            options: meta.config.K.options
          }), SelectField.create({
            id: 'v',
            inverse_order: true,
            label: meta.config.v.label,
            color: meta.config.v.color ? meta.config.v.color : null,
            value: meta.config.v.initialValue,
            defaultValue: meta.config.v.initialValue,
            classes: [],
            options: meta.config.v.options
          }), SelectField.create({
            id: 'omega',
            inverse_order: true,
            label: meta.config.omega.label,
            color: meta.config.omega.color ? meta.config.omega.color : null,
            value: meta.config.omega.initialValue,
            defaultValue: meta.config.omega.initialValue,
            classes: [],
            options: meta.config.omega.options
          })]);
        }
        return fields;
      }
    }, {
      key: '_hookModifyExport',
      value: function _hookModifyExport(exp, meta) {
        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity'].forEach(function (key) {
            exp[key + '_delta'] = exp[key].delta;
            exp[key] = exp[key].base;
          });
        }
        return exp;
      }
    }, {
      key: '_hookModifyImport',
      value: function _hookModifyImport(data, meta) {
        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity'].forEach(function (key) {
            data[key] = {
              base: data[key],
              delta: data[key + '_delta']
            };
            delete data[key + '_delta'];
          });
        }
        return data;
      }
    }, {
      key: '_hook3dView',
      value: function _hook3dView(view, meta) {
        if (meta.config.modelType == "blockly") {
          return new ModelView({ baseColor: meta.color }).view();
        }
        return view;
      }
    }]);

    return ModelingDataModule;
  }(Module);

  return ModelingDataModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlN5bVNsaWRlckZpZWxkIiwiU2xpZGVyRmllbGQiLCJTZWxlY3RGaWVsZCIsIk1vZGVsVmlldyIsImRlZmF1bHRDb25maWdzIiwiTW9kZWxpbmdEYXRhTW9kdWxlIiwiZ2V0IiwiYmluZE1ldGhvZHMiLCJ0YWIiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uUGhhc2VDaGFuZ2UiLCJfb25FeHBlcmltZW50Q291bnRDaGFuZ2UiLCJob29rIiwiX2hvb2tNb2RlbEZpZWxkcyIsIl9ob29rTW9kaWZ5RXhwb3J0IiwiX2hvb2tNb2RpZnlJbXBvcnQiLCJfaG9vazNkVmlldyIsImdldFBhbmVsIiwiYWRkQ29udGVudCIsInZpZXciLCJldnQiLCJkYXRhIiwicGhhc2UiLCJoaWRlIiwiY291bnQiLCJvbGQiLCJzaG93IiwiZmllbGRzIiwibWV0YSIsInR5cGUiLCJib2R5Q29uZmlncyIsIkFycmF5IiwiYXBwbHkiLCJsZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwibnVtYmVyIiwiaW5kIiwiYm9keUNvbmZpZ09wdGlvbnMiLCJib2R5Y29uZmlnIiwiY29uY2F0IiwiY3JlYXRlIiwiaWQiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJjb25maWciLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJkZWZhdWx0VmFsdWUiLCJjbGFzc2VzIiwib3B0aW9ucyIsIm9wYWNpdHkiLCJLIiwidiIsIm9tZWdhIiwiZXhwIiwiZm9yRWFjaCIsImtleSIsImRlbHRhIiwiYmFzZSIsIm1vZGVsVHlwZSIsImJhc2VDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssa0JBQWtCTCxRQUFRLGtCQUFSLENBRHBCO0FBQUEsTUFFRU0saUJBQWlCTixRQUFRLHFDQUFSLENBRm5CO0FBQUEsTUFHRU8sY0FBY1AsUUFBUSxrQ0FBUixDQUhoQjtBQUFBLE1BSUVRLGNBQWNSLFFBQVEsa0NBQVIsQ0FKaEI7QUFBQSxNQUtFUyxZQUFZVCxRQUFRLGFBQVIsQ0FMZDs7QUFPQSxNQUFNVSxpQkFBaUJWLFFBQVEsZ0RBQVIsQ0FBdkI7O0FBWmtCLE1BZVpXLGtCQWZZO0FBQUE7O0FBZ0JoQixrQ0FBYztBQUFBOztBQUFBOztBQUVaLFVBQUlULFFBQVFVLEdBQVIsQ0FBWSxvQkFBWixDQUFKLEVBQXVDO0FBQ3JDWCxjQUFNWSxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsMEJBQW5CLEVBQzFCLGtCQUQwQixFQUNOLG1CQURNLEVBQ2UsbUJBRGYsRUFDb0MsYUFEcEMsQ0FBeEI7O0FBR0EsY0FBS0MsR0FBTCxHQUFXLElBQUlULGVBQUosRUFBWDs7QUFFQUgsZ0JBQVFVLEdBQVIsQ0FBWSxPQUFaLEVBQXFCRyxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtDLGNBQTlEO0FBQ0FkLGdCQUFRVSxHQUFSLENBQVksT0FBWixFQUFxQkcsZ0JBQXJCLENBQXNDLHdCQUF0QyxFQUFnRSxNQUFLRSx3QkFBckU7O0FBRUFkLFdBQUdlLElBQUgsQ0FBUSxrQkFBUixFQUE0QixNQUFLQyxnQkFBakM7QUFDQWhCLFdBQUdlLElBQUgsQ0FBUSx3QkFBUixFQUFrQyxNQUFLRSxpQkFBdkM7QUFDQWpCLFdBQUdlLElBQUgsQ0FBUSx3QkFBUixFQUFrQyxNQUFLRyxpQkFBdkM7QUFDQWxCLFdBQUdlLElBQUgsQ0FBUSxnQkFBUixFQUEwQixNQUFLSSxXQUEvQjtBQUVEO0FBaEJXO0FBaUJiOztBQWpDZTtBQUFBO0FBQUEsNEJBbUNWO0FBQ0osWUFBSSxLQUFLUixHQUFULEVBQWNaLFFBQVFVLEdBQVIsQ0FBWSxRQUFaLEVBQXNCVyxRQUF0QixDQUErQixRQUEvQixFQUF5Q0MsVUFBekMsQ0FBb0QsS0FBS1YsR0FBTCxDQUFTVyxJQUFULEVBQXBEO0FBQ2Y7QUFyQ2U7QUFBQTtBQUFBLHFDQXVDREMsR0F2Q0MsRUF1Q0k7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxLQUFULElBQWtCLE9BQWxCLElBQTZCRixJQUFJQyxJQUFKLENBQVNDLEtBQVQsSUFBa0IsaUJBQW5ELEVBQXNFO0FBQ3BFLGVBQUtkLEdBQUwsQ0FBU2UsSUFBVDtBQUNEO0FBQ0Y7QUEzQ2U7QUFBQTtBQUFBLCtDQTZDU0gsR0E3Q1QsRUE2Q2M7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTRyxLQUFULElBQWtCLENBQUNKLElBQUlDLElBQUosQ0FBU0ksR0FBaEMsRUFBcUM7QUFDbkMsZUFBS2pCLEdBQUwsQ0FBU2tCLElBQVQ7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDTixJQUFJQyxJQUFKLENBQVNHLEtBQWQsRUFBcUI7QUFDMUIsZUFBS2hCLEdBQUwsQ0FBU2UsSUFBVDtBQUNEO0FBQ0Y7QUFuRGU7QUFBQTtBQUFBLHVDQXFEQ0ksTUFyREQsRUFxRFNDLElBckRULEVBcURlO0FBQUE7O0FBQzdCLFlBQUlBLEtBQUtDLElBQUwsSUFBYSxTQUFqQixFQUE0QjtBQUMxQixjQUFJQyxjQUFjQyxNQUFNQyxLQUFOLENBQVksSUFBWixFQUFrQixFQUFDQyxRQUFPQyxPQUFPQyxJQUFQLENBQVkvQixjQUFaLEVBQTRCNkIsTUFBcEMsRUFBbEIsRUFBK0RHLEdBQS9ELENBQW1FLFVBQUNDLE1BQUQsRUFBUUMsR0FBUjtBQUFBLG1CQUFnQixvQkFBb0JBLE1BQUksQ0FBeEIsQ0FBaEI7QUFBQSxXQUFuRSxDQUFsQjtBQUNBLGVBQUtDLGlCQUFMLEdBQXlCLEVBQXpCO0FBQ0FULHNCQUFZTSxHQUFaLENBQWdCO0FBQUEsbUJBQWMsT0FBS0csaUJBQUwsQ0FBdUJDLFVBQXZCLElBQXFDcEMsZUFBZW9DLFVBQWYsRUFBMkIsSUFBM0IsQ0FBbkQ7QUFBQSxXQUFoQjtBQUNBYixtQkFBU0EsT0FBT2MsTUFBUCxDQUFjLENBQUN2QyxZQUFZd0MsTUFBWixDQUFtQjtBQUN6Q0MsZ0JBQUksdUJBRHFDO0FBRXpDQywyQkFBZSxJQUYwQjtBQUd6Q0MsbUJBQU9qQixLQUFLa0IsTUFBTCxDQUFZQyxpQkFBWixDQUE4QkYsS0FBOUIsR0FBc0NqQixLQUFLa0IsTUFBTCxDQUFZQyxpQkFBWixDQUE4QkYsS0FBcEUsR0FBNEUsSUFIMUM7QUFJekNHLG1CQUFPcEIsS0FBS2tCLE1BQUwsQ0FBWUMsaUJBQVosQ0FBOEJDLEtBSkk7QUFLekNDLG1CQUFPckIsS0FBS2tCLE1BQUwsQ0FBWUMsaUJBQVosQ0FBOEJHLFlBTEk7QUFNekNDLDBCQUFjdkIsS0FBS2tCLE1BQUwsQ0FBWUMsaUJBQVosQ0FBOEJHLFlBTkg7QUFPekNFLHFCQUFTLEVBUGdDO0FBUXpDQyxxQkFBUyxLQUFLZDtBQVIyQixXQUFuQixDQUFELEVBU25CckMsWUFBWXdDLE1BQVosQ0FBbUI7QUFDckJDLGdCQUFJLFNBRGlCO0FBRXJCQywyQkFBZSxJQUZNO0FBR3JCSSxtQkFBT3BCLEtBQUtrQixNQUFMLENBQVlRLE9BQVosQ0FBb0JOLEtBSE47QUFJckJILG1CQUFPakIsS0FBS2tCLE1BQUwsQ0FBWVEsT0FBWixDQUFvQlQsS0FBcEIsR0FBNEJqQixLQUFLa0IsTUFBTCxDQUFZUSxPQUFaLENBQW9CVCxLQUFoRCxHQUF3RCxJQUoxQztBQUtyQkksbUJBQU9yQixLQUFLa0IsTUFBTCxDQUFZUSxPQUFaLENBQW9CSixZQUxOO0FBTXJCQywwQkFBY3ZCLEtBQUtrQixNQUFMLENBQVlRLE9BQVosQ0FBb0JKLFlBTmI7QUFPckJFLHFCQUFTLEVBUFk7QUFRckJDLHFCQUFTekIsS0FBS2tCLE1BQUwsQ0FBWVEsT0FBWixDQUFvQkQ7QUFSUixXQUFuQixDQVRtQixFQWtCbkJuRCxZQUFZd0MsTUFBWixDQUFtQjtBQUNyQkMsZ0JBQUksR0FEaUI7QUFFckJDLDJCQUFlLElBRk07QUFHckJJLG1CQUFPcEIsS0FBS2tCLE1BQUwsQ0FBWVMsQ0FBWixDQUFjUCxLQUhBO0FBSXJCSCxtQkFBT2pCLEtBQUtrQixNQUFMLENBQVlTLENBQVosQ0FBY1YsS0FBZCxHQUFzQmpCLEtBQUtrQixNQUFMLENBQVlTLENBQVosQ0FBY1YsS0FBcEMsR0FBNEMsSUFKOUI7QUFLckJJLG1CQUFPckIsS0FBS2tCLE1BQUwsQ0FBWVMsQ0FBWixDQUFjTCxZQUxBO0FBTXJCQywwQkFBY3ZCLEtBQUtrQixNQUFMLENBQVlTLENBQVosQ0FBY0wsWUFOUDtBQU9yQkUscUJBQVMsRUFQWTtBQVFyQkMscUJBQVN6QixLQUFLa0IsTUFBTCxDQUFZUyxDQUFaLENBQWNGO0FBUkYsV0FBbkIsQ0FsQm1CLEVBMkJuQm5ELFlBQVl3QyxNQUFaLENBQW1CO0FBQ3JCQyxnQkFBSSxHQURpQjtBQUVyQkMsMkJBQWUsSUFGTTtBQUdyQkksbUJBQU9wQixLQUFLa0IsTUFBTCxDQUFZVSxDQUFaLENBQWNSLEtBSEE7QUFJckJILG1CQUFPakIsS0FBS2tCLE1BQUwsQ0FBWVUsQ0FBWixDQUFjWCxLQUFkLEdBQXNCakIsS0FBS2tCLE1BQUwsQ0FBWVUsQ0FBWixDQUFjWCxLQUFwQyxHQUE0QyxJQUo5QjtBQUtyQkksbUJBQU9yQixLQUFLa0IsTUFBTCxDQUFZVSxDQUFaLENBQWNOLFlBTEE7QUFNckJDLDBCQUFjdkIsS0FBS2tCLE1BQUwsQ0FBWVUsQ0FBWixDQUFjTixZQU5QO0FBT3JCRSxxQkFBUyxFQVBZO0FBUXJCQyxxQkFBU3pCLEtBQUtrQixNQUFMLENBQVlVLENBQVosQ0FBY0g7QUFSRixXQUFuQixDQTNCbUIsRUFvQ25CbkQsWUFBWXdDLE1BQVosQ0FBbUI7QUFDckJDLGdCQUFJLE9BRGlCO0FBRXJCQywyQkFBZSxJQUZNO0FBR3JCSSxtQkFBT3BCLEtBQUtrQixNQUFMLENBQVlXLEtBQVosQ0FBa0JULEtBSEo7QUFJckJILG1CQUFPakIsS0FBS2tCLE1BQUwsQ0FBWVcsS0FBWixDQUFrQlosS0FBbEIsR0FBMEJqQixLQUFLa0IsTUFBTCxDQUFZVyxLQUFaLENBQWtCWixLQUE1QyxHQUFvRCxJQUp0QztBQUtyQkksbUJBQU9yQixLQUFLa0IsTUFBTCxDQUFZVyxLQUFaLENBQWtCUCxZQUxKO0FBTXJCQywwQkFBY3ZCLEtBQUtrQixNQUFMLENBQVlXLEtBQVosQ0FBa0JQLFlBTlg7QUFPckJFLHFCQUFTLEVBUFk7QUFRckJDLHFCQUFTekIsS0FBS2tCLE1BQUwsQ0FBWVcsS0FBWixDQUFrQko7QUFSTixXQUFuQixDQXBDbUIsQ0FBZCxDQUFUO0FBK0NEO0FBQ0QsZUFBTzFCLE1BQVA7QUFDRDtBQTNHZTtBQUFBO0FBQUEsd0NBNkdFK0IsR0E3R0YsRUE2R085QixJQTdHUCxFQTZHYTtBQUMzQixZQUFJQSxLQUFLQyxJQUFMLElBQWEsU0FBakIsRUFBNEI7QUFDMUIsV0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLE9BQVgsRUFBbUIsU0FBbkIsRUFBOEI4QixPQUE5QixDQUFzQyxVQUFDQyxHQUFELEVBQVM7QUFDN0NGLGdCQUFPRSxHQUFQLGVBQXNCRixJQUFJRSxHQUFKLEVBQVNDLEtBQS9CO0FBQ0FILGdCQUFJRSxHQUFKLElBQVdGLElBQUlFLEdBQUosRUFBU0UsSUFBcEI7QUFDRCxXQUhEO0FBSUQ7QUFDRCxlQUFPSixHQUFQO0FBQ0Q7QUFySGU7QUFBQTtBQUFBLHdDQXVIRXJDLElBdkhGLEVBdUhRTyxJQXZIUixFQXVIYztBQUM1QixZQUFJQSxLQUFLQyxJQUFMLElBQWEsU0FBakIsRUFBNEI7QUFDMUIsV0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLE9BQVgsRUFBbUIsU0FBbkIsRUFBOEI4QixPQUE5QixDQUFzQyxVQUFDQyxHQUFELEVBQVM7QUFDN0N2QyxpQkFBS3VDLEdBQUwsSUFBWTtBQUNWRSxvQkFBTXpDLEtBQUt1QyxHQUFMLENBREk7QUFFVkMscUJBQU94QyxLQUFRdUMsR0FBUjtBQUZHLGFBQVo7QUFJQSxtQkFBT3ZDLEtBQVF1QyxHQUFSLFlBQVA7QUFDRCxXQU5EO0FBT0Q7QUFDRCxlQUFPdkMsSUFBUDtBQUNEO0FBbEllO0FBQUE7QUFBQSxrQ0FvSUpGLElBcElJLEVBb0lFUyxJQXBJRixFQW9JUTtBQUN0QixZQUFJQSxLQUFLa0IsTUFBTCxDQUFZaUIsU0FBWixJQUF5QixTQUE3QixFQUF3QztBQUN0QyxpQkFBUSxJQUFJNUQsU0FBSixDQUFjLEVBQUU2RCxXQUFXcEMsS0FBS2lCLEtBQWxCLEVBQWQsQ0FBRCxDQUEyQzFCLElBQTNDLEVBQVA7QUFDRDtBQUNELGVBQU9BLElBQVA7QUFDRDtBQXpJZTs7QUFBQTtBQUFBLElBZWVyQixNQWZmOztBQTRJbEIsU0FBT08sa0JBQVA7QUFDRCxDQTdJRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgTW9kZWxpbmdEYXRhVGFiID0gcmVxdWlyZSgnLi9ibG9ja2x5dGFiL3RhYicpLFxuICAgIFN5bVNsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc3ltc2xpZGVyZmllbGQvZmllbGQnKSxcbiAgICBTbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NsaWRlcmZpZWxkL2ZpZWxkJyksXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpLFxuICAgIE1vZGVsVmlldyA9IHJlcXVpcmUoJy4vdGhyZWV2aWV3Jyk7XG5cbiAgY29uc3QgZGVmYXVsdENvbmZpZ3MgPSByZXF1aXJlKCcuL2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9saXN0b2Zjb25maWdzJylcblxuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YU1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWxpbmcnKSkge1xuICAgICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblBoYXNlQ2hhbmdlJywgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZScsXG4gICAgICAnX2hvb2tNb2RlbEZpZWxkcycsICdfaG9va01vZGlmeUV4cG9ydCcsICdfaG9va01vZGlmeUltcG9ydCcsICdfaG9vazNkVmlldyddKVxuXG4gICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsaW5nRGF0YVRhYigpO1xuXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSlcblxuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uRmllbGRzJywgdGhpcy5faG9va01vZGVsRmllbGRzKTtcbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLk1vZGlmeUV4cG9ydCcsIHRoaXMuX2hvb2tNb2RpZnlFeHBvcnQpO1xuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uTW9kaWZ5SW1wb3J0JywgdGhpcy5faG9va01vZGlmeUltcG9ydCk7XG4gICAgICAgIEhNLmhvb2soJ0V1Z2xlbmEuM2RWaWV3JywgdGhpcy5faG9vazNkVmlldylcblxuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgIGlmICh0aGlzLnRhYikgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdyZXN1bHQnKS5hZGRDb250ZW50KHRoaXMudGFiLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLnRhYi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy50YWIuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICghZXZ0LmRhdGEuY291bnQpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rTW9kZWxGaWVsZHMoZmllbGRzLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIHZhciBib2R5Q29uZmlncyA9IEFycmF5LmFwcGx5KG51bGwsIHtsZW5ndGg6T2JqZWN0LmtleXMoZGVmYXVsdENvbmZpZ3MpLmxlbmd0aH0pLm1hcCgobnVtYmVyLGluZCkgPT4gJ2NvbmZpZ3VyYXRpb25fJyArIChpbmQrMSkpXG4gICAgICAgIHRoaXMuYm9keUNvbmZpZ09wdGlvbnMgPSB7fVxuICAgICAgICBib2R5Q29uZmlncy5tYXAoYm9keWNvbmZpZyA9PiB0aGlzLmJvZHlDb25maWdPcHRpb25zW2JvZHljb25maWddID0gZGVmYXVsdENvbmZpZ3NbYm9keWNvbmZpZ11bJ2lkJ10pXG4gICAgICAgIGZpZWxkcyA9IGZpZWxkcy5jb25jYXQoW1NlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6IFwiYm9keUNvbmZpZ3VyYXRpb25OYW1lXCIsXG4gICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uY29sb3IgPyBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmxhYmVsLFxuICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgb3B0aW9uczogdGhpcy5ib2R5Q29uZmlnT3B0aW9uc1xuICAgICAgICB9KSwgU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICBpZDogJ29wYWNpdHknLFxuICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9wYWNpdHkubGFiZWwsXG4gICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm9wYWNpdHkuY29sb3IgPyBtZXRhLmNvbmZpZy5vcGFjaXR5LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcub3BhY2l0eS5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm9wdGlvbnNcbiAgICAgICAgfSksIFNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICdrJyxcbiAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5LLmxhYmVsLFxuICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5LLmNvbG9yID8gbWV0YS5jb25maWcuSy5jb2xvciA6IG51bGwsXG4gICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLksuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogbWV0YS5jb25maWcuSy5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcuSy5vcHRpb25zXG4gICAgICAgIH0pLCBTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgIGlkOiAndicsXG4gICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcudi5sYWJlbCxcbiAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcudi5jb2xvciA/IG1ldGEuY29uZmlnLnYuY29sb3IgOiBudWxsLFxuICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy52LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6IG1ldGEuY29uZmlnLnYuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLnYub3B0aW9uc1xuICAgICAgICB9KSwgU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICBpZDogJ29tZWdhJyxcbiAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5vbWVnYS5sYWJlbCxcbiAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcub21lZ2EuY29sb3IgPyBtZXRhLmNvbmZpZy5vbWVnYS5jb2xvciA6IG51bGwsXG4gICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vbWVnYS5vcHRpb25zXG4gICAgICAgIH0pXG4gICAgICBdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUV4cG9ydChleHAsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLnR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgWydrJywgJ3YnLCAnb21lZ2EnLCdvcGFjaXR5J10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgZXhwW2Ake2tleX1fZGVsdGFgXSA9IGV4cFtrZXldLmRlbHRhO1xuICAgICAgICAgIGV4cFtrZXldID0gZXhwW2tleV0uYmFzZTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUltcG9ydChkYXRhLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eSddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGRhdGFba2V5XSA9IHtcbiAgICAgICAgICAgIGJhc2U6IGRhdGFba2V5XSxcbiAgICAgICAgICAgIGRlbHRhOiBkYXRhW2Ake2tleX1fZGVsdGFgXVxuICAgICAgICAgIH07XG4gICAgICAgICAgZGVsZXRlIGRhdGFbYCR7a2V5fV9kZWx0YWBdO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgX2hvb2szZFZpZXcodmlldywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuY29uZmlnLm1vZGVsVHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICByZXR1cm4gKG5ldyBNb2RlbFZpZXcoeyBiYXNlQ29sb3I6IG1ldGEuY29sb3IgfSkpLnZpZXcoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YU1vZHVsZTtcbn0pXG4iXX0=
