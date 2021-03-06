"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BaseForm = _interopRequireDefault(require("./BaseForm"));

var _QuickForm = _interopRequireDefault(require("./QuickForm"));

var _ValidatedForm = _interopRequireDefault(require("./ValidatedForm"));

var _default = _ValidatedForm.default.Validated(_QuickForm.default.Quick(_BaseForm.default));

exports.default = _default;