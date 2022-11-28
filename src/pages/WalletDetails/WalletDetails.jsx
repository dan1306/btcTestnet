import { Component } from "react";
import WalletDetail from "../../components/WalletDetails/WalletDetails";

export default class WalletDetails extends Component {
  render() {
    return (
      <div className="mainDiv">
        {" "}
        <WalletDetail address={this.props.address} />
      </div>
    );
  }
}
