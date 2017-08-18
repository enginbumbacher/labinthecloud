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
      _this._silenceLoadLogs = false;

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
      key: 'currSimulation',
      value: function currSimulation() {
        return this._lastSimulation;
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
          this._lastSimulation = null;
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
          if (!this._silenceLoadLogs) {
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
          _this4._lastSimulation = {
            experimentId: Globals.get('currentExperiment').id,
            model: {
              modelType: _this4._model.get('modelType'),
              configuration: conf
            },
            count: conf.count,
            magnification: Globals.get('currentExperimentResults.magnification')
          };
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
          // this._lastSimulationId = results.id;
          _this5._lastSimulationId = null;
          _this5._lastSimulation = null;
          Globals.get('InteractiveModal').hide().then(function () {
            _this5._nameForm.clear();
          });
          _this5._silenceLoadLogs = true;
          return _this5._history.update();
        }).then(function () {
          _this5._silenceLoadLogs = false;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxIaXN0b3J5Rm9ybSIsIk1vZGVsRm9ybSIsIk5hbWVGb3JtIiwiRXVnVXRpbHMiLCJNb2RlbFRhYiIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2hpc3RvcnkiLCJjcmVhdGUiLCJpZCIsIl9tb2RlbCIsImdldCIsIm1vZGVsVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlIiwiX3NpbGVuY2VMb2FkTG9ncyIsIl9mb3JtIiwiZmllbGRDb25maWciLCJldWdsZW5hQ291bnRDb25maWciLCJfb25Db25maWdDaGFuZ2UiLCJ2aWV3IiwiX29uU2ltdWxhdGVSZXF1ZXN0IiwiX29uU2F2ZVJlcXVlc3QiLCJfb25BZ2dyZWdhdGVSZXF1ZXN0IiwiX29uTmV3UmVxdWVzdCIsIl9uYW1lRm9ybSIsIl9vbk5hbWVTdWJtaXQiLCJfb25OYW1lQ2FuY2VsIiwiYWRkQ2hpbGQiLCJfb25HbG9iYWxzQ2hhbmdlIiwiX29uUGhhc2VDaGFuZ2UiLCJfbGFzdFNpbXVsYXRpb25JZCIsIl9sYXN0U2ltdWxhdGlvbiIsIl9jdXJyTW9kZWxJZCIsIl9jdXJyZW50TW9kZWwiLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsInRoZW4iLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsIm1vZGVsX2hpc3RvcnlfaWQiLCJzZXRTdGF0ZSIsIl9sb2FkTW9kZWxJbkZvcm0iLCJleHBvcnQiLCJjdXJyZW50VGFyZ2V0Iiwib2xkSWQiLCJ0YXJnZXQiLCJwcm9taXNlQWpheCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjb25maWd1cmF0aW9uIiwiZGlzcGF0Y2hFdmVudCIsIm1vZGVsIiwidGFiSWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImdlbmVyYXRlUmVzdWx0cyIsImV4cGVyaW1lbnRJZCIsImNvdW50IiwibWFnbmlmaWNhdGlvbiIsInJlc3VsdHMiLCJzaW11bGF0aW9uIiwiZGlzcGxheSIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsIm1ldGhvZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdHVkZW50SWQiLCJuYW1lIiwibGFiIiwiY29udGVudFR5cGUiLCJlcnIiLCJldWdsZW5hTW9kZWxJZCIsImhpZGUiLCJjbGVhciIsImdldE1vZGVsUmVzdWx0cyIsInBoYXNlIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLGlCQUFSLENBRFY7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksWUFBWUosUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VLLFFBQVFMLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU0sT0FBT04sUUFBUSxRQUFSLENBRlQ7QUFBQSxNQUlFTyxtQkFBbUJQLFFBQVEsaUJBQVIsQ0FKckI7QUFBQSxNQUtFUSxZQUFZUixRQUFRLGNBQVIsQ0FMZDtBQUFBLE1BTUVTLFdBQVdULFFBQVEsa0JBQVIsQ0FOYjtBQUFBLE1BT0VVLFdBQVdWLFFBQVEsZUFBUixDQVBiOztBQUxrQixNQWNaVyxRQWRZO0FBQUE7O0FBZWhCLHdCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJSLEtBQTdDO0FBQ0FPLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JSLElBQTNDOztBQUZ5QixzSEFHbkJNLFFBSG1COztB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
