"use strict";

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require("assert");

var _require = require("../ecc"),
    PrivateKey = _require.PrivateKey,
    PublicKey = _require.PublicKey;

module.exports = {
  keyType: keyType,
  path: path,
  isPath: isPath,
  isMasterKey: isMasterKey
};

function isMasterKey(key) {
  return (/^PW/.test(key) && PrivateKey.isWif(key.substring(2))
  );
}

function keyType(key) {
  return isMasterKey(key) ? "master" : PrivateKey.isWif(key) ? "wif" : PrivateKey.isValid(key) ? "privateKey" : PublicKey.isValid(key) ? "pubkey" : null;
}

function isPath(txt) {
  try {
    path(txt);
    return true;
  } catch (e) {
    return false;
  }
}

function path(path) {
  assert.equal(typeof path === "undefined" ? "undefined" : (0, _typeof3.default)(path), "string", "path");
  assert(path !== "", "path should not be empty");
  assert(path.indexOf(" ") === -1, "remove spaces");
  assert(path.indexOf("\\") === -1, "use forward slash");
  assert(path[0] !== "/", "remove leading slash");
  assert(path[path.length - 1] !== "/", "remove ending slash");
  assert(!/[A-Z]/.test(path), "path should not have uppercase letters");

  assert(path !== "owner/active", "owner is implied, juse use active");

  var el = Array.from(path.split("/"));

  var unique = new Set();
  el.forEach(function (e) {
    unique.add(e);
  });
  assert(unique.size === el.length, "duplicate path element");

  assert(el[0] === "owner" || el[0] === "active", "path should start with owner or active");

  assert(!el.includes("owner") || el.indexOf("owner") === 0, "owner is always first");

  assert(!el.includes("active") || el.indexOf("active") === 0, "active is always first");
}