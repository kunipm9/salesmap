"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _invariant = _interopRequireDefault(require("invariant"));

var Bridge =
/*#__PURE__*/
function () {
  function Bridge() {
    (0, _classCallCheck2.default)(this, Bridge);
    (0, _invariant.default)(this.constructor !== Bridge, 'Bridge cannot be instantiated.');
  }

  (0, _createClass2.default)(Bridge, [{
    key: "getError",
    value: function getError()
    /* name, error */
    {
      (0, _invariant.default)(false, '%s have not implemented `getError` method.', this.constructor.name);
    }
  }, {
    key: "getErrorMessage",
    value: function getErrorMessage()
    /* name, error */
    {
      (0, _invariant.default)(false, '%s have not implemented `getError` method.', this.constructor.name);
    }
  }, {
    key: "getErrorMessages",
    value: function getErrorMessages()
    /* error */
    {
      (0, _invariant.default)(false, '%s have not implemented `getErrorMessages` method.', this.constructor.name);
    }
  }, {
    key: "getField",
    value: function getField()
    /* name */
    {
      (0, _invariant.default)(false, '%s have not implemented `getField` method.', this.constructor.name);
    }
  }, {
    key: "getInitialValue",
    value: function getInitialValue()
    /* name, props */
    {
      (0, _invariant.default)(false, '%s have not implemented `getInitialValue` method.', this.constructor.name);
    }
  }, {
    key: "getProps",
    value: function getProps()
    /* name, props */
    {
      (0, _invariant.default)(false, '%s have not implemented `getProps` method.', this.constructor.name);
    }
  }, {
    key: "getSubfields",
    value: function getSubfields()
    /* name */
    {
      (0, _invariant.default)(false, '%s have not implemented `getSubfields` method.', this.constructor.name);
    }
  }, {
    key: "getType",
    value: function getType()
    /* name */
    {
      (0, _invariant.default)(false, '%s have not implemented `getType` method.', this.constructor.name);
    }
  }, {
    key: "getValidator",
    value: function getValidator()
    /* options */
    {
      (0, _invariant.default)(false, '%s have not implemented `getValidator` method.', this.constructor.name);
    }
  }], [{
    key: "check",
    value: function check()
    /* schema */
    {
      (0, _invariant.default)(false, '%s have not implemented `check` method.', this.name);
    }
  }]);
  return Bridge;
}();

exports.default = Bridge;