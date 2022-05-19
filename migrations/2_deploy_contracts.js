// eslint-disable-next-line no-undef
const Marketplace = artifacts.require("Marketplace");

// Deploy Marketplace smart contract to the blockchain
module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};