"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSchemaBridge;

var _invariant = _interopRequireDefault(require("invariant"));

var _GraphQLBridge = _interopRequireDefault(require("./GraphQLBridge"));

var _JSONSchemaBridge = _interopRequireDefault(require("./JSONSchemaBridge"));

var _SimpleSchema2Bridge = _interopRequireDefault(require("./SimpleSchema2Bridge"));

var _SimpleSchemaBridge = _interopRequireDefault(require("./SimpleSchemaBridge"));

var bridges = [_GraphQLBridge.default, _JSONSchemaBridge.default, _SimpleSchemaBridge.default, _SimpleSchema2Bridge.default];

var isBridge = function isBridge(schema) {
  return schema && schema.getError && schema.getErrorMessage && schema.getErrorMessages && schema.getField && schema.getInitialValue && schema.getProps && schema.getSubfields && schema.getType && schema.getValidator;
};

function createSchemaBridge(schema) {
  // There's no need for an extra wrapper.
  if (isBridge(schema)) {
    return schema;
  }

  var Bridge = bridges.find(function (bridge) {
    return bridge.check(schema);
  });
  (0, _invariant.default)(Bridge, 'Unrecognised schema: %s', schema);
  return new Bridge(schema);
}