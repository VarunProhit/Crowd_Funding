const funder = artifacts.require("funder");

module.exports = function(deployer){
    deployer.deploy(funder)
};