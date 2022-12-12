import { Component } from "react";
import WalletDetail from "../../components/WalletDetails/WalletDetails";

export default class WalletDetails extends Component {
  render() {
    return (
      <div className="mainDiv">
        {/* address is the wallet address stored in the app.js state
        walletDetail, when your mouse goes over a certain wallets view details button
        on the all your wallets page, and the indivual users wallets page
          */}
        <WalletDetail address={this.props.address} />
      </div>
    );
  }
}
