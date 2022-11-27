import { Component } from "react";
import "./AllWallets.css";

export default class createWallet extends Component {
  state = {
    availableWallets: [],
  };

  render() {
    return (
      <div>
        <h1>This Is All Wallets</h1>
      </div>
    );
  }
}
