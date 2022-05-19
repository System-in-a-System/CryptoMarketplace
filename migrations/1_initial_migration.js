// eslint-disable-next-line no-undef
const Migrations = artifacts.require("Migrations");

// Deploy Migrations smart contract to the blockchain
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
