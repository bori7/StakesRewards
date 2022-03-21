const StakingRewards = artifacts.require("StakingRewards");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(StakingRewards, accounts[0], accounts[1]);
};
