import React, { Component } from "react";
import metamaskLogo from "../metamask.png";

class MetamaskAlert extends Component {
  render() {
    return (
      <div className="my-5 text-center">
        <img src={metamaskLogo} width="250" class="mb-4" alt="" />
        <h3>Install Metamask to proceed</h3>
      </div>
    );
  }
}

export default MetamaskAlert;
