"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _omit = _interopRequireDefault(require("lodash/omit"));

var _set = _interopRequireDefault(require("lodash/set"));

var _ValidatedQuickForm = _interopRequireDefault(require("./ValidatedQuickForm"));

var Auto = function Auto(parent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_parent) {
    (0, _inherits2.default)(_class, _parent);

    function _class() {
      var _this;

      (0, _classCallCheck2.default)(this, _class);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
      _this.state = (0, _objectSpread2.default)({}, _this.state, {
        model: _this.props.model,
        modelSync: _this.props.model
      });
      return _this;
    }

    (0, _createClass2.default)(_class, [{
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(_ref) {
        var model = _ref.model;
        (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "componentWillReceiveProps", this).apply(this, arguments);

        if (!(0, _isEqual.default)(this.props.model, model)) {
          this.setState(function () {
            return {
              model: model,
              modelSync: model
            };
          });
        }
      }
    }, {
      key: "getNativeFormProps",
      value: function getNativeFormProps() {
        return (0, _omit.default)((0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "getNativeFormProps", this).call(this), ['onChangeModel']);
      }
    }, {
      key: "getModel",
      value: function getModel(mode) {
        return mode === 'form' ? this.state.modelSync : this.state.model;
      }
    }, {
      key: "onChange",
      value: function onChange(key, value) {
        var _this2 = this,
            _arguments = arguments;

        var updateState = function updateState(state) {
          return {
            modelSync: (0, _set.default)((0, _cloneDeep.default)(state.modelSync), key, value)
          };
        };

        var updateModel = function updateModel(state) {
          if (_this2.props.onChangeModel) {
            _this2.props.onChangeModel(state.modelSync);
          }

          return {
            model: state.modelSync
          };
        }; // Before componentDidMount, every call to onChange should call BaseForm#onChange synchronously


        if (this.state.changed === null) {
          this.setState(updateState);
          (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "onChange", this).apply(this, arguments);
          this.setState(updateModel);
        } else {
          this.setState(updateState, function () {
            (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "onChange", _this2).apply(_this2, _arguments);

            _this2.setState(updateModel);
          });
        }
      }
    }, {
      key: "__reset",
      value: function __reset(state) {
        return (0, _objectSpread2.default)({}, (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "__reset", this).call(this, state), {
          model: this.props.model,
          modelSync: this.props.model
        });
      }
    }, {
      key: "onValidate",
      value: function onValidate() {
        return this.onValidateModel(this.getChildContextModel());
      }
    }]);
    return _class;
  }(parent), _class.Auto = Auto, _class.displayName = "Auto".concat(parent.displayName), _class.propTypes = (0, _objectSpread2.default)({}, parent.propTypes, {
    onChangeModel: _propTypes.default.func
  }), _temp;
};

var _default = Auto(_ValidatedQuickForm.default);

exports.default = _default;