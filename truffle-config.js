// Presents configurations for connecting the project to the blockchain. 
// As for now connection is established to Ganache personal blockchain, i.e., 127.0.0.1:7545. 
require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Ganache port (ethereum blockchain simulation)
      network_id: "*" // Match any network id
    },
  },
   
  // Smart contracts default destination is moved to the src directory 
  // so that contracts can be easily accessed by react application
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
