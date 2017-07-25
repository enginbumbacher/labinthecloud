'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Module = require('core/app/module'),
      HM = require('core/event/hook_manager'),
      Utils = require('core/util/utils'),
      LayoutPanel = require('module/layout/panel/panel');

  return function (_Module) {
    _inherits(InteractivePanelModule, _Module);

    function InteractivePanelModule() {
      _classCallCheck(this, InteractivePanelModule);

      var _this = _possibleConstructorReturn(this, (InteractivePanelModule.__proto__ || Object.getPrototypeOf(InteractivePanelModule)).call(this));

      Utils.bindMethods(_this, ['_hookLayoutPanels']);
      _this.panel = LayoutPanel.create({ id: "interactive" });
      return _this;
    }

    _createClass(InteractivePanelModule, [{
      key: 'init',
      value: function init() {
        HM.hook('Layout.Panels', this._hookLayoutPanels);
        return Promise.resolve(true);
      }
    }, {
      key: '_hookLayoutPanels',
      value: function _hookLayoutPanels(list, meta) {
        list.push({
          weight: 0,
          panel: this.panel
        });
        return list;
      }
    }, {
      key: 'run',
      value: function run() {
        this.panel.build();
      }
    }]);

    return InteractivePanelModule;
  }(Module);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL3BhbmVsX2ludGVyYWN0aXZlL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiTW9kdWxlIiwiSE0iLCJVdGlscyIsIkxheW91dFBhbmVsIiwiYmluZE1ldGhvZHMiLCJwYW5lbCIsImNyZWF0ZSIsImlkIiwiaG9vayIsIl9ob29rTGF5b3V0UGFuZWxzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJsaXN0IiwibWV0YSIsInB1c2giLCJ3ZWlnaHQiLCJidWlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxTQUFTRCxRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFRSxLQUFLRixRQUFRLHlCQUFSLENBRFA7QUFBQSxNQUVFRyxRQUFRSCxRQUFRLGlCQUFSLENBRlY7QUFBQSxNQUdFSSxjQUFjSixRQUFRLDJCQUFSLENBSGhCOztBQUtBO0FBQUE7O0FBQ0Usc0NBQWM7QUFBQTs7QUFBQTs7QUFFWkcsWUFBTUUsV0FBTixRQUF3QixDQUFDLG1CQUFELENBQXhCO0FBQ0EsWUFBS0MsS0FBTCxHQUFhRixZQUFZRyxNQUFaLENBQW1CLEVBQUVDLElBQUksYUFBTixFQUFuQixDQUFiO0FBSFk7QUFJYjs7QUFMSDtBQUFBO0FBQUEsNkJBT1M7QUFDTE4sV0FBR08sSUFBSCxDQUFRLGVBQVIsRUFBeUIsS0FBS0MsaUJBQTlCO0FBQ0EsZUFBT0MsUUFBUUMsT0FBUixDQUFnQixJQUFoQixDQUFQO0FBQ0Q7QUFWSDtBQUFBO0FBQUEsd0NBWW9CQyxJQVpwQixFQVkwQkMsSUFaMUIsRUFZZ0M7QUFDNUJELGFBQUtFLElBQUwsQ0FBVTtBQUNSQyxrQkFBUSxDQURBO0FBRVJWLGlCQUFPLEtBQUtBO0FBRkosU0FBVjtBQUlBLGVBQU9PLElBQVA7QUFDRDtBQWxCSDtBQUFBO0FBQUEsNEJBb0JRO0FBQ0osYUFBS1AsS0FBTCxDQUFXVyxLQUFYO0FBQ0Q7QUF0Qkg7O0FBQUE7QUFBQSxJQUE0Q2hCLE1BQTVDO0FBd0JELENBOUJEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL3BhbmVsX2ludGVyYWN0aXZlL21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJidWlsZC9qcyJ9
