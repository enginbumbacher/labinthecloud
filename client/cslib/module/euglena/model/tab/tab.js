'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      ModelHistoryForm = require('../history/form'),
      ModelForm = require('../form/form'),
      NameForm = require('../nameform/form'),
      EugUtils = require('euglena/utils');

  var ModelTab = function (_Component) {
    _inherits(ModelTab, _Component);

    function ModelTab() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModelTab);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (ModelTab.__proto__ || Object.getPrototypeOf(ModelTab)).call(this, settings));

      Utils.bindMethods(_this, ['_onSimulateRequest', '_onSaveRequest', '_onAggregateRequest', '_onNameCancel', '_onNameSubmit', '_onGlobalsChange', '_loadModelInForm', '_onHistorySelectionChange', '_onConfigChange', '_onNewRequest', '_onPhaseChange']);

      _this._history = ModelHistoryForm.create({
        id: 'model_history__' + _this._model.get("id"),
        modelType: _this._model.get('modelType')
      });
      _this._history.addEventListener('Form.FieldChanged', _this._onHistorySelectionChange);

      _this._form = ModelForm.create({
        modelType: _this._model.get('modelType'),
        fieldConfig: _this._model.get('parameters'),
        euglenaCountConfig: _this._model.get('euglenaCount')
      });
      _this._form.addEventListener('Form.FieldChanged', _this._onConfigChange);
      _this._form.view().addEventListener('ModelForm.Simulate', _this._onSimulateRequest);
      _this._form.view().addEventListener('ModelForm.Save', _this._onSaveRequest);
      _this._form.view().addEventListener('ModelForm.AddToAggregate', _this._onAggregateRequest);
      _this._form.view().addEventListener('ModelForm.NewRequest', _this._onNewRequest);

      _this._nameForm = NameForm.create();
      _this._nameForm.view().addEventListener('ModelSave.Submit', _this._onNameSubmit);
      _this._nameForm.view().addEventListener('ModelSave.Cancel', _this._onNameCancel);
      _this.view().addChild(_this._history.view());
      _this.view().addChild(_this._form.view());

      Globals.addEventListener('Model.Change', _this._onGlobalsChange);
      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      return _this;
    }

    _createClass(ModelTab, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'lastResultId',
      value: function lastResultId() {
        return this._lastSimulationId;
      }
    }, {
      key: 'currModelId',
      value: function currModelId() {
        return this._currModelId;
      }
    }, {
      key: 'currModel',
      value: function currModel() {
        return this._currentModel;
      }
    }, {
      key: 'color',
      value: function color() {
        return this._model.get('color');
      }
    }, {
      key: '_onGlobalsChange',
      value: function _onGlobalsChange(evt) {
        var _this2 = this;

        switch (evt.data.path) {
          case 'student_id':
            this._history.update().then(function () {
              var hist = _this2._history.getHistory();
              if (hist.length) {
                return _this2._history.import({
                  model_history_id: hist[hist.length - 1]
                });
              } else {
                _this2._form.setState('new');
                return true;
              }
            }).then(function () {
              _this2._loadModelInForm(_this2._history.export().model_history_id);
            });
            break;
        }
      }
    }, {
      key: '_onHistorySelectionChange',
      value: function _onHistorySelectionChange(evt) {
        this._loadModelInForm(evt.currentTarget.export().model_history_id);
      }
    }, {
      key: '_onConfigChange',
      value: function _onConfigChange(evt) {
        if (this._history.export().model_history_id != '_new') {
          this._history.import({ model_history_id: '_new' });
          this._lastSimulationId = null;
          this._form.setState('new');
        }
      }
    }, {
      key: '_loadModelInForm',
      value: function _loadModelInForm(id) {
        var _this3 = this;

        if (!id) return;
        var oldId = this._currModelId;
        var target = id == '_new' ? null : id;
        if (oldId != target) {
          if (id != '_new') {
            this._currModelId = id;
            Utils.promiseAjax('/api/v1/EuglenaModels/' + id).then(function (data) {
              _this3._form.removeEventListener('Form.FieldChanged', _this3._onConfigChange);
              _this3._currentModel = data;
              _this3._form.import(data.configuration).then(function () {
                _this3._form.addEventListener('Form.FieldChanged', _this3._onConfigChange);
                Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
                  model: data,
                  tabId: _this3._model.get('id')
                });
              });
            });
            this._form.setState('historical');
          } else {
            this._currModelId = null;
            this._currentModel = null;
            Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
              model: {
                id: '_new'
              },
              tabId: this._model.get('id')
            });
            this._form.setState('new');
          }
          Globals.get('Logger').log({
            type: "load",
            category: "model",
            data: {
              modelId: id,
              tab: this.id()
            }
          });
        }
      }
    }, {
      key: '_onSimulateRequest',
      value: function _onSimulateRequest(evt) {
        var _this4 = this;

        var conf = this._form.export();
        EugUtils.generateResults({
          experimentId: Globals.get('currentExperiment').id,
          model: {
            modelType: this._model.get('modelType'),
            configuration: conf
          },
          count: conf.count,
          magnification: Globals.get('currentExperimentResults.magnification')
        }).then(function (data) {
          _this4._lastSimulationId = data.id;
          Globals.get('Relay').dispatchEvent('Simulation.Run', {
            results: data,
            simulation: {
              experimentId: Globals.get('currentExperiment').id,
              model: {
                modelType: _this4._model.get('modelType'),
                configuration: conf
              },
              count: conf.count,
              magnification: Globals.get('currentExperimentResults.magnification')
            },
            tabId: _this4._model.get('id')
          });
        });
        Globals.get('Logger').log({
          type: "simulate",
          category: "model",
          data: {
            modelType: this._model.get('modelType'),
            configuration: conf
          }
        });
      }
    }, {
      key: '_onSaveRequest',
      value: function _onSaveRequest(evt) {
        Globals.get('InteractiveModal').display(this._nameForm.view());
      }
    }, {
      key: '_onNameSubmit',
      value: function _onNameSubmit(evt) {
        var _this5 = this;

        var model = void 0;
        this._nameForm.validate().then(function (validation) {
          return Utils.promiseAjax('/api/v1/EuglenaModels', {
            method: 'POST',
            data: JSON.stringify({
              studentId: Globals.get('student_id'),
              configuration: _this5._form.export(),
              modelType: _this5._model.get('modelType'),
              name: _this5._nameForm.export().name,
              lab: Globals.get('AppConfig.lab')
            }),
            contentType: 'application/json'
          });
        }, function (err) {
          // do nothing
        }).then(function (data) {
          if (!data) return;
          model = data;
          _this5._currModelId = model.id;
          if (_this5._lastSimulationId) {
            return Utils.promiseAjax('/api/v1/Results/' + _this5._lastSimulationId, {
              method: 'PATCH',
              data: JSON.stringify({
                euglenaModelId: model.id
              }),
              contentType: 'application/json'
            });
          } else {
            return EugUtils.generateResults({
              euglenaModelId: model.id,
              experimentId: Globals.get('currentExperiment').id,
              count: model.count,
              magnification: Globals.get('currentExperimentResults.magnification')
            });
          }
        }).then(function (results) {
          _this5._lastSimulationId = results.id;
          Globals.get('InteractiveModal').hide().then(function () {
            _this5._nameForm.clear();
          });
          return _this5._history.update();
        }).then(function () {
          _this5._history.import({
            model_history_id: model.id
          });
        });
        Globals.get('Logger').log({
          type: "save",
          category: "model",
          data: {
            configuration: this._form.export(),
            modelType: this._model.get('modelType'),
            name: this._nameForm.export().name
          }
        });
      }
    }, {
      key: '_onNameCancel',
      value: function _onNameCancel(evt) {
        var _this6 = this;

        Globals.get('InteractiveModal').hide().then(function () {
          _this6._nameForm.clear();
        });
      }
    }, {
      key: '_onAggregateRequest',
      value: function _onAggregateRequest(evt) {
        EugUtils.getModelResults(Globals.get('currentExperiment.id'), this._currentModel).then(function (results) {
          Globals.get('Relay').dispatchEvent('AggregateData.AddRequest', {
            data: results
          });
        });
        Globals.get('Logger').log({
          type: "aggregate",
          category: "model",
          data: {
            modelId: this._history.export().model_history_id
          }
        });
      }
    }, {
      key: '_onNewRequest',
      value: function _onNewRequest(evt) {
        this._onConfigChange(evt);
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login") {
          this._history.import({ model_history_id: '_new' });
        }
      }
    }]);

    return ModelTab;
  }(Component);

  ModelTab.create = function (data) {
    return new ModelTab({ modelData: data });
  };

  return ModelTab;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxIaXN0b3J5Rm9ybSIsIk1vZGVsRm9ybSIsIk5hbWVGb3JtIiwiRXVnVXRpbHMiLCJNb2RlbFRhYiIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2hpc3RvcnkiLCJjcmVhdGUiLCJpZCIsIl9tb2RlbCIsImdldCIsIm1vZGVsVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlIiwiX2Zvcm0iLCJmaWVsZENvbmZpZyIsImV1Z2xlbmFDb3VudENvbmZpZyIsIl9vbkNvbmZpZ0NoYW5nZSIsInZpZXciLCJfb25TaW11bGF0ZVJlcXVlc3QiLCJfb25TYXZlUmVxdWVzdCIsIl9vbkFnZ3JlZ2F0ZVJlcXVlc3QiLCJfb25OZXdSZXF1ZXN0IiwiX25hbWVGb3JtIiwiX29uTmFtZVN1Ym1pdCIsIl9vbk5hbWVDYW5jZWwiLCJhZGRDaGlsZCIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfb25QaGFzZUNoYW5nZSIsIl9sYXN0U2ltdWxhdGlvbklkIiwiX2N1cnJNb2RlbElkIiwiX2N1cnJlbnRNb2RlbCIsImV2dCIsImRhdGEiLCJwYXRoIiwidXBkYXRlIiwidGhlbiIsImhpc3QiLCJnZXRIaXN0b3J5IiwibGVuZ3RoIiwiaW1wb3J0IiwibW9kZWxfaGlzdG9yeV9pZCIsInNldFN0YXRlIiwiX2xvYWRNb2RlbEluRm9ybSIsImV4cG9ydCIsImN1cnJlbnRUYXJnZXQiLCJvbGRJZCIsInRhcmdldCIsInByb21pc2VBamF4IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbmZpZ3VyYXRpb24iLCJkaXNwYXRjaEV2ZW50IiwibW9kZWwiLCJ0YWJJZCIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsIm1vZGVsSWQiLCJ0YWIiLCJjb25mIiwiZ2VuZXJhdGVSZXN1bHRzIiwiZXhwZXJpbWVudElkIiwiY291bnQiLCJtYWduaWZpY2F0aW9uIiwicmVzdWx0cyIsInNpbXVsYXRpb24iLCJkaXNwbGF5IiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uIiwibWV0aG9kIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0dWRlbnRJZCIsIm5hbWUiLCJsYWIiLCJjb250ZW50VHlwZSIsImVyciIsImV1Z2xlbmFNb2RlbElkIiwiaGlkZSIsImNsZWFyIiwiZ2V0TW9kZWxSZXN1bHRzIiwicGhhc2UiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxZQUFZSixRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUssUUFBUUwsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFTSxPQUFPTixRQUFRLFFBQVIsQ0FGVDtBQUFBLE1BSUVPLG1CQUFtQlAsUUFBUSxpQkFBUixDQUpyQjtBQUFBLE1BS0VRLFlBQVlSLFFBQVEsY0FBUixDQUxkO0FBQUEsTUFNRVMsV0FBV1QsUUFBUSxrQkFBUixDQU5iO0FBQUEsTUFPRVUsV0FBV1YsUUFBUSxlQUFSLENBUGI7O0FBTGtCLE1BY1pXLFFBZFk7QUFBQTs7QUFlaEIsd0JBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QlIsS0FBN0M7QUFDQU8sZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQlIsSUFBM0M7O0FBRnlCLHNIQUduQk0sUUFIbUI7O0FBSXpCVixZQUFNYSxXQUFOLFFBQXdCLENBQ3RCLG9CQURzQixF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QjRDLEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxNQURrQjtBQUV4QkMsb0JBQVUsT0FGYztBQUd4QnZCLGdCQUFNO0FBQ0ppQiwyQkFBZSxLQUFLcEMsS0FBTCxDQUFXOEIsTUFBWCxFQURYO0FBRUpqQyx1QkFBVyxLQUFLRixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsV0FBaEIsQ0FGUDtBQUdKK0Qsa0JBQU0sS0FBS2xELFNBQUwsQ0FBZXFCLE1BQWYsR0FBd0I2QjtBQUgxQjtBQUhrQixTQUExQjtBQVNEO0FBbFBlO0FBQUE7QUFBQSxvQ0FvUEZ6QyxHQXBQRSxFQW9QRztBQUFBOztBQUNqQnpDLGdCQUFRbUIsR0FBUixDQUFZLGtCQUFaLEVBQWdDb0UsSUFBaEMsR0FBdUMxQyxJQUF2QyxDQUE0QyxZQUFNO0FBQ2hELGlCQUFLYixTQUFMLENBQWV3RCxLQUFmO0FBQ0QsU0FGRDtBQUdEO0FBeFBlO0FBQUE7QUFBQSwwQ0EwUEkvQyxHQTFQSixFQTBQUztBQUN2QmhDLGlCQUFTZ0YsZUFBVCxDQUF5QnpGLFFBQVFtQixHQUFSLENBQVksc0JBQVosQ0FBekIsRUFBOEQsS0FBS3FCLGFBQW5FLEVBQWtGSyxJQUFsRixDQUF1RixVQUFDNEIsT0FBRCxFQUFhO0FBQ2xHekUsa0JBQVFtQixHQUFSLENBQVksT0FBWixFQUFxQnlDLGFBQXJCLENBQW1DLDBCQUFuQyxFQUErRDtBQUM3RGxCLGtCQUFNK0I7QUFEdUQsV0FBL0Q7QUFHRCxTQUpEO0FBS0F6RSxnQkFBUW1CLEdBQVIsQ0FBWSxRQUFaLEVBQXNCNEMsR0FBdEIsQ0FBMEI7QUFDeEJDLGdCQUFNLFdBRGtCO0FBRXhCQyxvQkFBVSxPQUZjO0FBR3hCdkIsZ0JBQU07QUFDSndCLHFCQUFTLEtBQUtuRCxRQUFMLENBQWNzQyxNQUFkLEdBQXVCSDtBQUQ1QjtBQUhrQixTQUExQjtBQU9EO0FBdlFlO0FBQUE7QUFBQSxvQ0F5UUZULEdBelFFLEVBeVFHO0FBQ2pCLGFBQUtmLGVBQUwsQ0FBcUJlLEdBQXJCO0FBQ0Q7QUEzUWU7QUFBQTtBQUFBLHFDQTZRREEsR0E3UUMsRUE2UUk7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTZ0QsS0FBVCxJQUFrQixPQUF0QixFQUErQjtBQUM3QixlQUFLM0UsUUFBTCxDQUFja0MsTUFBZCxDQUFxQixFQUFFQyxrQkFBa0IsTUFBcEIsRUFBckI7QUFDRDtBQUNGO0FBalJlOztBQUFBO0FBQUEsSUFjSy9DLFNBZEw7O0FBb1JsQk8sV0FBU00sTUFBVCxHQUFrQixVQUFDMEIsSUFBRCxFQUFVO0FBQzFCLFdBQU8sSUFBSWhDLFFBQUosQ0FBYSxFQUFFaUYsV0FBV2pELElBQWIsRUFBYixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPaEMsUUFBUDtBQUVELENBMVJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiLCJzb3VyY2VSb290IjoiYnVpbGQvanMifQ==
