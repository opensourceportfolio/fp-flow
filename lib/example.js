"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserDataBroke = getUserDataBroke;
exports.getUserDataWoke = getUserDataWoke;
exports.getPackagesBespoke = getPackagesBespoke;

var _Option = require("./data-type/Option");

var _pipe = require("./pipe");

// $FlowFixMe
function readDb(table, id) {
  return [table, id];
}

class User {}

class Address {}

class Package {}

function getUserBroke(id) {
  return readDb('user', id);
}

function getAddressBroke(user) {
  return readDb('address', user.name);
}

function getPackagesBroke(address) {
  return readDb('package', address);
}

function getUserDataBroke(id) {
  const user = getUserBroke(id);

  if (user) {
    const address = getAddressBroke(user);

    if (address) {
      const packages = getPackagesBroke(address);
      return packages;
    }
  }

  return null;
}

function getUserFromDbWoke(id) {
  return readDb('user', id);
}

function getAddressFromDbWoke(user) {
  return readDb('address', user.name);
}

function getPackagesFromDbWoke(address) {
  return readDb('package', address);
}

function getUserDataWoke(id) {
  return (0, _Option.chain)(user => (0, _Option.map)(getPackagesFromDbWoke, getAddressFromDbWoke(user)), getUserFromDbWoke(id));
}

function getPackagesBespoke(id) {
  return (0, _pipe.pipe)(getUserFromDbWoke(id), (0, _Option.chainC)(getAddressFromDbWoke), (0, _Option.mapC)(getPackagesFromDbWoke));
}