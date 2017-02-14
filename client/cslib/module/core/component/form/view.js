'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./form.html');

  return function (_DomView) {
    _inherits(FormView, _DomView);

    function FormView(model) {
      var tmpl = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      _classCallCheck(this, FormView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FormView).call(this, tmpl || Template));

      _this._onFieldAdded = _this._onFieldAdded.bind(_this);
      _this._onFieldRemoved = _this._onFieldRemoved.bind(_this);
      _this._onChange = _this._onChange.bind(_this);

      // this.$el.attr('id', model.get('id'));
      // model.get('classes').forEach((cls) => this.$el.addClass(cls));
      _this._fieldViews = [];
      _this._buttonViews = [];

      _this.render(model);

      model.addEventListener('Form.FieldAdded', _this._onFieldAdded);
      model.addEventListener('Form.FieldRemoved', _this._onFieldRemoved);
      model.addEventListener('Model.Change', _this._onChange);
      return _this;
    }

    _createClass(FormView, [{
      key: '_onChange',
      value: function _onChange(evt) {
        switch (evt.data.path) {
          case "buttons":
            this._renderButtons(evt.currentTarget);
            break;
          case "title":
            this._renderHeader(evt.currentTarget);
            break;
          case "errors":
            this._renderErrors(evt.currentTarget);
            break;
        }
      }
    }, {
      key: 'render',
      value: function render(model) {
        if (model.get('classes')) {
          this.$el.addClass(model.get('classes').join(' '));
        }
        this._renderHeader(model);
        this._renderFields(model);
        this._renderButtons(model);
        this._renderErrors(model);
        this._renderHelp(model);
      }
    }, {
      key: '_onFieldAdded',
      value: function _onFieldAdded(evt) {
        this._renderFields(evt.currentTarget);
      }
    }, {
      key: '_onFieldRemoved',
      value: function _onFieldRemoved(evt) {
        this._renderFields(evt.currentTarget);
      }
    }, {
      key: '_renderHeader',
      value: function _renderHeader(model) {
        if (model.get('title')) {
          if (this._title) this.removeChild(this._title);
          this._title = new DomView(model.get('title'));
          this.addChild(this._title, ".form__header");
          this.$el.find('.form__header').show();
        } else {
          this.$el.find('.form__header').hide();
        }
      }
    }, {
      key: '_renderFields',
      value: function _renderFields(model) {
        while (this._fieldViews.length) {
          this.removeChild(this._fieldViews.pop());
        }for (var regionId in model.get('regions')) {
          var destination = this._mapRegion(regionId);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = model.get('regions')[regionId][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var field = _step.value;

              this._fieldViews.push(field.view());
              this.addChild(field.view(), destination);
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
        }
      }
    }, {
      key: '_renderErrors',
      value: function _renderErrors(model) {
        var errStr = model.get('errors').map(function (err) {
          return '<p class="form__error">' + err + '</p>';
        }).join('');
        this.$el.find(".form__errors").html(errStr);
      }
    }, {
      key: '_mapRegion',
      value: function _mapRegion(regionId) {
        return ".form__fields";
      }
    }, {
      key: '_renderButtons',
      value: function _renderButtons(model) {
        while (this._buttonViews.length) {
          this.removeChild(this._buttonViews.pop());
        }var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = model.get('buttons')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var btn = _step2.value;

            this._buttonViews.push(btn.view());
            this.addChild(btn.view(), '.form__buttons');
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }, {
      key: '_renderHelp',
      value: function _renderHelp(model) {
        this.$el.find('.form__help').html(model.get('help'));
      }
    }]);

    return FormView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE9BQU8sVUFBQyxPQUFELEVBQWE7QUFDbEIsTUFBTSxVQUFVLFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFLFdBQVcsUUFBUSxrQkFBUixDQURiOztBQUdBO0FBQUE7O0FBQ0Usc0JBQVksS0FBWixFQUFnQztBQUFBLFVBQWIsSUFBYSx5REFBTixJQUFNOztBQUFBOztBQUFBLDhGQUN4QixRQUFRLFFBRGdCOztBQUc5QixZQUFLLGFBQUwsR0FBcUIsTUFBSyxhQUFMLENBQW1CLElBQW5CLE9BQXJCO0FBQ0EsWUFBSyxlQUFMLEdBQXVCLE1BQUssZUFBTCxDQUFxQixJQUFyQixPQUF2QjtBQUNBLFlBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCOzs7O0FBSUEsWUFBSyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsWUFBSyxZQUFMLEdBQW9CLEVBQXBCOztBQUVBLFlBQUssTUFBTCxDQUFZLEtBQVo7O0FBRUEsWUFBTSxnQkFBTixDQUF1QixpQkFBdkIsRUFBMEMsTUFBSyxhQUEvQztBQUNBLFlBQU0sZ0JBQU4sQ0FBdUIsbUJBQXZCLEVBQTRDLE1BQUssZUFBakQ7QUFDQSxZQUFNLGdCQUFOLENBQXVCLGNBQXZCLEVBQXVDLE1BQUssU0FBNUM7QUFoQjhCO0FBaUIvQjs7QUFsQkg7QUFBQTtBQUFBLGdDQW9CWSxHQXBCWixFQW9CaUI7QUFDYixnQkFBUSxJQUFJLElBQUosQ0FBUyxJQUFqQjtBQUNFLGVBQUssU0FBTDtBQUNFLGlCQUFLLGNBQUwsQ0FBb0IsSUFBSSxhQUF4QjtBQUNBO0FBQ0YsZUFBSyxPQUFMO0FBQ0UsaUJBQUssYUFBTCxDQUFtQixJQUFJLGFBQXZCO0FBQ0E7QUFDRixlQUFLLFFBQUw7QUFDRSxpQkFBSyxhQUFMLENBQW1CLElBQUksYUFBdkI7QUFDQTtBQVRKO0FBV0Q7QUFoQ0g7QUFBQTtBQUFBLDZCQWtDUyxLQWxDVCxFQWtDZ0I7QUFDWixZQUFJLE1BQU0sR0FBTixDQUFVLFNBQVYsQ0FBSixFQUEwQjtBQUN4QixlQUFLLEdBQUwsQ0FBUyxRQUFULENBQWtCLE1BQU0sR0FBTixDQUFVLFNBQVYsRUFBcUIsSUFBckIsQ0FBMEIsR0FBMUIsQ0FBbEI7QUFDRDtBQUNELGFBQUssYUFBTCxDQUFtQixLQUFuQjtBQUNBLGFBQUssYUFBTCxDQUFtQixLQUFuQjtBQUNBLGFBQUssY0FBTCxDQUFvQixLQUFwQjtBQUNBLGFBQUssYUFBTCxDQUFtQixLQUFuQjtBQUNBLGFBQUssV0FBTCxDQUFpQixLQUFqQjtBQUNEO0FBM0NIO0FBQUE7QUFBQSxvQ0E2Q2dCLEdBN0NoQixFQTZDcUI7QUFDakIsYUFBSyxhQUFMLENBQW1CLElBQUksYUFBdkI7QUFDRDtBQS9DSDtBQUFBO0FBQUEsc0NBZ0RrQixHQWhEbEIsRUFnRHVCO0FBQ25CLGFBQUssYUFBTCxDQUFtQixJQUFJLGFBQXZCO0FBQ0Q7QUFsREg7QUFBQTtBQUFBLG9DQW9EZ0IsS0FwRGhCLEVBb0R1QjtBQUNuQixZQUFJLE1BQU0sR0FBTixDQUFVLE9BQVYsQ0FBSixFQUF3QjtBQUN0QixjQUFJLEtBQUssTUFBVCxFQUFpQixLQUFLLFdBQUwsQ0FBaUIsS0FBSyxNQUF0QjtBQUNqQixlQUFLLE1BQUwsR0FBYyxJQUFJLE9BQUosQ0FBWSxNQUFNLEdBQU4sQ0FBVSxPQUFWLENBQVosQ0FBZDtBQUNBLGVBQUssUUFBTCxDQUFjLEtBQUssTUFBbkIsRUFBMkIsZUFBM0I7QUFDQSxlQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsZUFBZCxFQUErQixJQUEvQjtBQUNELFNBTEQsTUFLTztBQUNMLGVBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxlQUFkLEVBQStCLElBQS9CO0FBQ0Q7QUFDRjtBQTdESDtBQUFBO0FBQUEsb0NBK0RnQixLQS9EaEIsRUErRHVCO0FBQ25CLGVBQU8sS0FBSyxXQUFMLENBQWlCLE1BQXhCO0FBQWdDLGVBQUssV0FBTCxDQUFpQixLQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBakI7QUFBaEMsU0FFQSxLQUFLLElBQUksUUFBVCxJQUFxQixNQUFNLEdBQU4sQ0FBVSxTQUFWLENBQXJCLEVBQTJDO0FBQ3pDLGNBQUksY0FBYyxLQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBbEI7QUFEeUM7QUFBQTtBQUFBOztBQUFBO0FBRXpDLGlDQUFrQixNQUFNLEdBQU4sQ0FBVSxTQUFWLEVBQXFCLFFBQXJCLENBQWxCLDhIQUFrRDtBQUFBLGtCQUF6QyxLQUF5Qzs7QUFDaEQsbUJBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixNQUFNLElBQU4sRUFBdEI7QUFDQSxtQkFBSyxRQUFMLENBQWMsTUFBTSxJQUFOLEVBQWQsRUFBNEIsV0FBNUI7QUFDRDtBQUx3QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTTFDO0FBQ0Y7QUF6RUg7QUFBQTtBQUFBLG9DQTJFZ0IsS0EzRWhCLEVBMkV1QjtBQUNuQixZQUFJLFNBQVMsTUFBTSxHQUFOLENBQVUsUUFBVixFQUFvQixHQUFwQixDQUF3QixVQUFDLEdBQUQ7QUFBQSw2Q0FBbUMsR0FBbkM7QUFBQSxTQUF4QixFQUFzRSxJQUF0RSxDQUEyRSxFQUEzRSxDQUFiO0FBQ0EsYUFBSyxHQUFMLENBQVMsSUFBVCxDQUFjLGVBQWQsRUFBK0IsSUFBL0IsQ0FBb0MsTUFBcEM7QUFDRDtBQTlFSDtBQUFBO0FBQUEsaUNBZ0ZhLFFBaEZiLEVBZ0Z1QjtBQUNuQixlQUFPLGVBQVA7QUFDRDtBQWxGSDtBQUFBO0FBQUEscUNBb0ZpQixLQXBGakIsRUFvRndCO0FBQ3BCLGVBQU8sS0FBSyxZQUFMLENBQWtCLE1BQXpCO0FBQWlDLGVBQUssV0FBTCxDQUFpQixLQUFLLFlBQUwsQ0FBa0IsR0FBbEIsRUFBakI7QUFBakMsU0FEb0I7QUFBQTtBQUFBOztBQUFBO0FBR3BCLGdDQUFnQixNQUFNLEdBQU4sQ0FBVSxTQUFWLENBQWhCLG1JQUFzQztBQUFBLGdCQUE3QixHQUE2Qjs7QUFDcEMsaUJBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUFJLElBQUosRUFBdkI7QUFDQSxpQkFBSyxRQUFMLENBQWMsSUFBSSxJQUFKLEVBQWQsRUFBMEIsZ0JBQTFCO0FBQ0Q7QUFObUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9yQjtBQTNGSDtBQUFBO0FBQUEsa0NBNkZjLEtBN0ZkLEVBNkZxQjtBQUNqQixhQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsYUFBZCxFQUE2QixJQUE3QixDQUFrQyxNQUFNLEdBQU4sQ0FBVSxNQUFWLENBQWxDO0FBQ0Q7QUEvRkg7O0FBQUE7QUFBQSxJQUE4QixPQUE5QjtBQWlHRCxDQXJHRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvZm9ybS92aWV3LmpzIiwic291cmNlUm9vdCI6ImJ1aWxkL2pzIn0=
