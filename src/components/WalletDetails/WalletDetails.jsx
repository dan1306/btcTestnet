import { Component } from "react";
import "./WalletDetails.css";

export default class WalletDetail extends Component {
  state = {
    adressObj: null,
  };

  componentDidMount = async () => {
    try {
      if (this.props.address) {
        let fullEndpoint = await fetch(
          `/api/wallet/addressDetails/${this.props.address}`
        );
        if (fullEndpoint.ok) {
          fullEndpoint = await fullEndpoint.json();
          await this.setState({ adressObj: fullEndpoint });
        }
      }
    } catch (err) {
      console.log(err);
    }

    console.log(this.state.adressObj);
  };

  render() {
    // const balance = String(Number(this.state.adressObj.balance) / Math.pow(10, 8) )

    return (
      <>
        {this.props.address && this.state.adressObj ? (
          <div className="mainDiv row">
            <div className="col-4 wallDetail">
              <p className="text-center">RECEIVED</p>
              <h4 className="text-center amnt">0.000000 BTC</h4>
            </div>
            <div className="col-4 wallDetail">
              <p className="text-center">SENT</p>
              <h4 className="text-center amnt">0.000000 BTC</h4>
            </div>
            <div className="col-4 wallDetail">
              <p className="text-center">BALANCE</p>
              <h4 className="text-center amnt">
                {String(
                  Number(this.state.adressObj["balance"]) * Math.pow(10, 8)
                )}{" "}
                BTC
              </h4>
              <p className="text-center">{String(
                  Number(this.state.adressObj["unconfirmed_balance"]) * Math.pow(10, 8)
                )} {" "} BTC UNCONFIRMED</p>
              (0.01922257 BTC UNCONFIRMED)
            </div>
          </div>
        ) : (
          <div className="mainDiv row">
            <div className="col-4 wallDetail">
              <p className="text-center">RECEIVED</p>
              <h4 className="text-center amnt">0.000000 BTC</h4>
            </div>
            <div className="col-4 wallDetail">
              <p className="text-center">SENT</p>
              <h4 className="text-center amnt">0.000000 BTC</h4>
            </div>
            <div className="col-4 wallDetail">
              <p className="text-center">BALANCE</p>
              <h4 className="text-center amnt">0.000000 BTC</h4>
            </div>
          </div>
        )}
      </>
    );
  }
}
