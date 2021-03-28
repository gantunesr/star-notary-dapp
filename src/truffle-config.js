const HDWallet = require("@truffle/hdwallet-provider");
const infuraEndpoint = "";
const metamaskSeed = "";

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     
      port: 8545,            
      network_id: "*",       
    },
    rinkeby: {
      provider: () => new HDWallet(metamaskSeed, infuraEndpoint),
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }

  },

  mocha: {},

  compilers: {
    solc: {
      version: "0.8.0", 
    }
  }
}
