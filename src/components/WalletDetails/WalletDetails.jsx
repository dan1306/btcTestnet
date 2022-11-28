import { Component } from "react";
import "./WalletDetails.css";
import QRCode from "react-qr-code";

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
          <>
            <div className="mainDiv ">
              <div className="row">
                <div className="col-4 wallDetail">
                  <p className="text-center">RECEIVED</p>
                  <h4 className="text-center amnt">
                    {String(
                      Number(this.state.adressObj["total_received"]) /
                        Math.pow(10, 8)
                    )}{" "}
                    BTC
                  </h4>
                </div>
                <div className="col-4 wallDetail">
                  <p className="text-center">SENT</p>
                  <h4 className="text-center amnt">
                    {String(
                      Number(this.state.adressObj["total_sent"]) /
                        Math.pow(10, 8)
                    )}{" "}
                    BTC
                  </h4>
                </div>
                <div className="col-4 wallDetail">
                  <p className="text-center">BALANCE</p>
                  <h4 className="text-center amnt">
                    {String(
                      Number(this.state.adressObj["balance"]) / Math.pow(10, 8)
                    )}{" "}
                    BTC
                  </h4>
                  {this.state.adressObj["unconfirmed_balance"] > 0 ? (
                    <p className="text-center">
                      ({" "}
                      {String(
                        Number(this.state.adressObj["unconfirmed_balance"]) /
                          Math.pow(10, 8)
                      )}{" "}
                      BTC UNCONFIRMED)
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            {this.state.adressObj["address"] ? (
              <div className="text-center">
                <QRCode value={this.state.adressObj["address"]} size="150" />
              </div>
            ) : (
              <></>
            )}
            <div className="row">
              <div className="col-4"> asas </div>
              <div className="col-4"> asas </div>
              <div className="col-4"> asas </div>
            </div>
          </>
        ) : (
          <>
            <div className="addreHeader">
              <h6 className="btc">₿ Bitcoin Testnet Address</h6>
              <h5 className="btcaddre">mzhxo3HtY1Wc2o3w5aFUYFpm3soGVhPZp6</h5>
            </div>
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
            <div className="text-center">
              <QRCode value="NOADDRESSTOLOOKFOR" size="150" />
            </div>
            <div className="mainDiv transactionDIV">
              <div>
                {" "}
                <p className="lock">🔒</p>
              </div>
              <div className="text-center">
                <p>
                  ⇄3deac05428903a4f13dc170968a71755817e0b490b378780d166280f26b1c1cb
                </p>
              </div>
              <div className=" row ">
                <div className="col-5 wallDetail">
                  <div className="text-center">
                    <p>1 Input Consumed</p>
                  </div>
                  <div className="inputOutoutDiv">
                    <h5>5.2991902 BTC from</h5>
                    <h4>tb1q5q39j2tr9d35zku9f02n2ufk5jn3ff8npze2y3 (output)</h4>
                  </div>
                </div>
                <div className="col-2 wallDetail arrow">
                  {" "}
                  <h1>&#8594;</h1>{" "}
                </div>
                <div className="col-5 wallDetail">
                  {" "}
                  <div className="text-center">
                    <p>2 Outputs Created</p>
                  </div>
                  <div className="inputOutoutDiv">
                    <h5>5.2991902 BTC from</h5>
                    <h4> 2MxwcTaSmVEwBkvpaU5Zj74CLYJ4aN4CyjW (unspent)</h4>
                  </div>{" "}
                  <div className="inputOutoutDiv">
                    <h5>5.2991902 BTC from</h5>
                    <h4> 2MxwcTaSmVEwBkvpaU5Zj74CLYJ4aN4CyjW (unspent)</h4>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}
