import { Component } from "react";
import "./WalletDetails.css";
import QRCode from "react-qr-code";

export default class WalletDetail extends Component {
  state = {
    adressObj: null,
  };

  componentDidMount = async () => {
    // here with the passed in public address we recieve from app.js
    // we make a call to the back end to retrieve data of that particular
    // public address and store it in state, if a positive reponse is returned
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
            <div className="addreHeader">
              <h6 className="btc">
                <i class="fa-solid fa-qrcode"></i> Bitcoin Testnet Address
              </h6>
              <h5 className="btcaddre">{this.state.adressObj["address"]}</h5>
            </div>
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
                  {this.state.adressObj["unconfirmed_balance"] > 0 ||
                  this.state.adressObj["unconfirmed_balance"] < 0 ? (
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
            <div>
              <p className="amntTransactions">
                {this.state.adressObj["final_n_tx"]} Transactions
                {" ("}
                {this.state.adressObj["unconfirmed_n_tx"]} unconfirmed{")"}
              </p>
            </div>
            <>
              {this.state.adressObj["txs"].length > 0 ? (
                <>
                  {this.state.adressObj["txs"].map((val, index) => {
                    return (
                      <div className="mainDiv transactionDIV">
                        {val.confirmations === 0 ? (
                          <div>
                            {" "}
                            <p className="lock">
                              {" "}
                              <i
                                class="fa-solid fa-lock-open"
                                style={{ color: "red" }}
                              ></i>{" "}
                              <span style={{ color: "red" }}>
                                {String(val.confirmations)}/6{" "}
                              </span>
                              confirmations
                            </p>
                          </div>
                        ) : (
                          <>
                            {val.confirmations > 0 && val.confirmations < 6 ? (
                              <div>
                                {" "}
                                <p className="lock">
                                  {" "}
                                  <i
                                    class="fa-solid fa-lock-open"
                                    style={{ color: "#8B8000" }}
                                  ></i>{" "}
                                  <span style={{ color: "#8B8000" }}>
                                    {String(val.confirmations)}/6{" "}
                                  </span>
                                  confirmations
                                </p>
                              </div>
                            ) : (
                              <>
                                {val.confirmations === 6 ? (
                                  <div>
                                    {" "}
                                    <p className="lock">
                                      {" "}
                                      <i
                                        class="fa-solid fa-lock"
                                        style={{ color: "green" }}
                                      ></i>{" "}
                                      <span style={{ color: "green" }}>
                                        {String(val.confirmations)}/6
                                      </span>{" "}
                                      confirmations
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    {" "}
                                    <p className="lock">
                                      {" "}
                                      <i
                                        class="fa-solid fa-lock"
                                        style={{ color: "green" }}
                                      ></i>{" "}
                                      <span style={{ color: "green" }}>
                                        6+{" "}
                                      </span>
                                      confirmations
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}

                        <div className="text-center">
                          <p className="hash">⇄ {val.hash}</p>
                        </div>
                        <div className=" row ">
                          <div className="col-5 transactionDetails">
                            <div className="text-center">
                              <p>{String(val.inputs.length)} Inputs Consumed</p>
                            </div>
                            {val.inputs.map((inp, index) => {
                              return (
                                <div className="inputOutoutDiv">
                                  <p>
                                    <span className="btcFrom">
                                      {" "}
                                      {String(
                                        inp.output_value / Math.pow(10, 8)
                                      )}{" "}
                                      BTC
                                    </span>{" "}
                                    From
                                  </p>
                                  <p className="btcAddresss">
                                    <i class="fa-solid fa-qrcode"></i>{" "}
                                    {inp.addresses[0]}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="col-2 transactionDetails arrow">
                            {" "}
                            <h1>&#8594;</h1>{" "}
                          </div>
                          <div className="col-5 transactionDetails">
                            {" "}
                            <div className="text-center">
                              <p>
                                {String(val.outputs.length)} Outputs Created
                              </p>
                            </div>
                            {val.outputs.map((out, index) => {
                              return (
                                <div className="inputOutoutDiv">
                                  <p>
                                    <span className="btcFrom">
                                      {" "}
                                      {String(out.value / Math.pow(10, 8))} BTC
                                    </span>{" "}
                                    To
                                  </p>
                                  <p className="btcAddresss">
                                    <i class="fa-solid fa-qrcode"></i>{" "}
                                    {out.addresses[0]}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <></>
              )}
            </>
          </>
        ) : (
          <>
            <div className="addreHeader">
              <h6 className="btc">
                <i class="fa-solid fa-qrcode"></i> Bitcoin Testnet Address
              </h6>
              <h5 className="btcaddre">..................................</h5>
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
            <div>
              <p>0 Transactions</p>
            </div>
            <div className="mainDiv transactionDIV">
              <div>
                {" "}
                <p className="lock">
                  {" "}
                  <i class="fa-solid fa-lock-open"></i> 0/0 confirmations
                </p>
              </div>
              <div className="text-center">
                <p>⇄</p>
              </div>
              <div className=" row ">
                <div className="col-5 transactionDetails">
                  <div className="text-center">
                    <p>0 Input Consumed</p>
                  </div>
                  <div className="inputOutoutDiv">
                    <h4> </h4>
                  </div>
                </div>
                <div className="col-2 transactionDetails arrow">
                  {" "}
                  <h1>&#8594;</h1>{" "}
                </div>
                <div className="col-5 transactionDetails">
                  {" "}
                  <div className="text-center">
                    <p>0 Outputs Created</p>
                  </div>
                  <div className="inputOutoutDiv"></div>{" "}
                  <div className="inputOutoutDiv"></div>
                </div>
              </div>
              <div className="text-center">
                <h6>Value Transacted : 0 BTC</h6>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}
