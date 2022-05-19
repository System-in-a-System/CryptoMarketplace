import React, { Component } from "react";
import Web3 from "web3";
import Marketplace from "../abis/Marketplace.json";
import Main from "./Main";
import Navbar from "./Navbar";
import MetamaskAlert from './MetamaskAlert';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
    };
    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  // Loads web3 on component mount
  async componentWillMount() {
    // Detect Metamask
    const metamaskInstalled = typeof window.web3 !== 'undefined'
    this.setState({ metamaskInstalled })
    if(metamaskInstalled) {
      await this.loadWeb3()
      await this.loadBlockchainData()
    }
  }

                                                                        /* web3 is a collection of libraries 
                                                                          to interact with a local or remote ethereum node 
                                                                          using HTTP, IPC or WebSocket.
                                                                        */
  // Detects the presence of an Ethereum provider in the web browser
  // which allows to connect the app to the blockchain
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "No wallet extension detected in your browser"
      );
    }
  }

  async loadBlockchainData() {
    // Define web3 connection
    const web3 = window.web3;

    // Fetch accounts
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Fetch network data
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];

    if (networkData) {
      // Fetch Marketplace contract abi
      const marketplace = web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      console.log(marketplace);
      this.setState({ marketplace });

      // Fetch product count
      const productCount = await marketplace.methods.productCount().call();
      this.setState({ productCount });

      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product],
        });
      }

      this.setState({ loading: false });

    } else {
      window.alert("Marketplace contract not deployed to detected network.");
    }
  }

  createProduct(name, price) {
    this.setState({ loading: true });
    // Call respective smart contract function on the behalf of the current account
    this.state.marketplace.methods
      .createProduct(name, price)
      .send({ from: this.state.account })
      // Once the transaction receipt has been received...
      .once("receipt", (receipt) => {
        // remove app from "loading" state
        // so that the user knows the function call is complete
        this.setState({ loading: false });
      });
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true });
    // Call respective smart contract function on the behalf of the current account
    this.state.marketplace.methods
      .purchaseProduct(id)
      .send({ from: this.state.account, value: price })
      // Once the transaction receipt has been received...
      .once("receipt", (receipt) => {
        // remove app from "loading" state
        // so that the user knows the function call is complete
        this.setState({ loading: false });

        // TODO: add functionality to grant access to the course according to page general student-courses access management
      });
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <Navbar account={this.state.account} />
        <div className="mt-5 app-container">
            <main role="main" className="col-lg-12 d-flex">
            { this.state.metamaskInstalled ? (
                <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct}
                />
              ) : (
                <MetamaskAlert />
              )}
            </main>
        </div>
      </div>
    );
  }
}

export default App;
