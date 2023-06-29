import { Component } from "react";
import "./SearchDetails.css";
import QRCode from "react-qr-code";

export default class SearchDetails extends Component {
  state = {
    newData: false,
    updated: false,
    minutePassed: null,
    adressObj: null,
    editSuccess: null,
    userWallets: null,
    yourPubAdd: null,
    amntToSend: null,
    submittedTransaction: false,
    balance: null,
  };

  componentDidMount = async () => {
    // mostly everything exist within the datails
    // passed through the props, from data on a searched address,
    // to all walltes a given user has
    let jsonDetials = this.props.Details;

    console.log(jsonDetials["adressObj"].data);
    await this.setState({
      newData: jsonDetials["newData"],
      updated: jsonDetials["updated"],
      minutesPassed: jsonDetials["minutesPassed"],
      adressObj: jsonDetials["adressObj"].data,
      editSuccess: null,
      userWallets: jsonDetials["userWallets"],
      err: null,
      success: null,
    });
  };

  edit = async () => {
    console.log("clicked");
    let jwt = localStorage.getItem("token");

    await this.setState({ editSuccess: null });
    const data = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addrs: this.state.adressObj["address"] }),
    };

    const fetchResponse = await fetch("/api/search/editAddre", data);

    if (fetchResponse.ok) {
      console.log(fetchResponse.ok);
      let jsonDetials = await fetchResponse.json();

      console.log(jsonDetials["adressObj"].data);
      await this.setState({
        newData: jsonDetials["newData"],
        updated: jsonDetials["updated"],
        minutesPassed: jsonDetials["minutesPassed"],
        adressObj: jsonDetials["adressObj"].data,
        editSuccess: "success",
      });
    }
  };

  submittedTransaction = async (e) => {
    e.preventDefault();

    // here we are making a POST request to the backend, sending the
    // amount user wants to send, the public address they are sending from,
    // and the wallet address they are sending to

    // if user has previously succeeded in making a transaction
    // we want to let them know they can make another transaction by clicking a button,
    // which sets submittedTransaction from true in state to false and success message to
    // null
    if (this.state.submittedTransaction) {
      await this.setState({
        submittedTransaction: false,
        amntToSend: 0,
        success: null,
      });
    } else {
      // /api/transactions/sendTransaction
      const data = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amntToSend: this.state.amntToSend,
          yourPubAdd: this.state.yourPubAdd,
          sendingToAddr: this.state.adressObj["address"],
        }),
      };
      const fetchResponse = await fetch(
        "/api/transactions/sendTransaction",
        data
      );

      let returnedData = await fetchResponse.json();
      if (!fetchResponse.ok) {
        // if we get a bad request while making a call to the back end
        // while trying to make a transaction go through, we set the err
        // in our state to the arr of objects we recieve from making the
        // request
        await this.setState({ err: returnedData.errors, success: null });
        return;
      } else {
        console.log(fetchResponse.ok, returnedData);

        // if we recieve a positive response
        // while trying to make a trasnaction
        // we set the success message in our state to be shown
        // to a user to "Transacion Succeeded Update Below To See Latest Updates"
        await this.setState({
          submittedTransaction: true,
          success: "Transacion Succeeded Update Below To See Latest Updates",
        });
      }
    }
  };

  yourPubAdd = async (e) => {
    // When a user selects a public address they'd like to make a transaction
    // from, a call is made to the back end. If that address has been
    // previously searched for and stored in the database, if time passed since that address
    // was last updated is greater than one minute, we make a call to the API to get the most recent data
    // of that address, else we send that wallets data to the front end from the database. If wallet
    // does not exist in databse, a call is made to retrieve and place data in our database pertaining to that address
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addrs: e.target.value,
      }),
    };
    let fetchResponse = await fetch("/api/search/addressBalance", options);

    if (fetchResponse.ok) {
      // on a good response we update the balance in our state
      fetchResponse = await fetchResponse.json();

      await this.setState({
        yourPubAdd: e.target.value,
        err: null,
        success: null,
        balance: fetchResponse.balance,
      });
    } else {
      // on a bad response
      // balance is set to does not exist in state
      await this.setState({
        yourPubAdd: e.target.value,
        err: null,
        success: null,
        balance: "Does Not Exist",
      });
    }
  };

  amntToSend = async (e) => {
    await this.setState({
      amntToSend: e.target.value,
      err: null,
      success: null,
    });
  };

  render() {
    // const balance = String(Number(this.state.adressObj.balance) / Math.pow(10, 8) )

    return (
      <div className="padSearchDetails">
        {this.props.address && this.state.adressObj ? (
          <>
            <div className="transactionDiv">
              <h4 className="text-center">Make A Transaction</h4>
              <form onSubmit={this.submittedTransaction}>
                <div>
                  <label>Inputs Address {"(Sending From)"}: </label>
                  <>
                    {this.state.balance ? (
                      <p>
                        Selected Adress has a balance of {this.state.balance}{" "}
                        BTC
                      </p>
                    ) : (
                      <></>
                    )}
                  </>
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    onChange={this.yourPubAdd}
                    required
                  >
                    <option disabled selected value>
                      Select One Of Your Public Adresses
                    </option>
                    {this.state.userWallets.length > 0 ? (
                      <>
                        {this.state.userWallets.map((val, id) => {
                          return (
                            <option value={val.address}>
                              {val.name}: {val.address}
                            </option>
                          );
                        })}
                      </>
                    ) : (
                      <></>
                    )}
                  </select>
                </div>
                <div>
                  <label>
                    Amount To Send{" (Your Amount / (10^8) = Amount In BTC)"}:{" "}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="amntToSend"
                    value={this.state.amntToSend}
                    onChange={this.amntToSend}
                    min="1"
                    max="100000000"
                    required
                  />
                </div>
                <div>
                  <label>Outputs Adress {"(Sending To)"}: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.adressObj["address"]}
                    readOnly
                  />
                </div>
                {this.state.amntToSend && this.state.yourPubAdd ? (
                  <>
                    {this.state.submittedTransaction ? (
                      <>
                        <div className="text-center">
                          <button type="submit" className="btn btn-success">
                            Make Another Transaction
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <p>Fields Can't Be Empty</p>
                  </div>
                )}

                {/* if ther is an err in the process of trying to make 
                a transaction we want to loop over the arr and get the info
                that exist within each err object in the array, to show to the user,
                else, if the transaction was a success we show the user a success
                message, else we show them nothing
                 */}
                {this.state.err && this.state.err.length > 0 ? (
                  <div className="text-center transactErrDiv">
                    {this.state.err.map((val, id) => {
                      return <p style={{ color: "red" }}>{val.error}</p>;
                    })}
                  </div>
                ) : (
                  <>
                    {this.state.success ? (
                      <div className="text-center transactErrDiv">
                        <p style={{ color: "green" }}>{this.state.success}</p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </form>
            </div>
            <div className="addreHeader">
              <h6 className="btc">
                <i class="fa-solid fa-qrcode"></i> Bitcoin Testnet Address
              </h6>
              <h5 className="btcaddre">{this.state.adressObj["address"]}</h5>
            </div>
            <div className="mainDiv ">
              <div className="row">
                <div className="col-4 wallDetail">
                  <p className="text-center">NEW DATA IN DATABASE</p>
                  <h4 className="text-center amnt">
                    {String(this.state.newData)}{" "}
                  </h4>
                </div>
                <div className="col-4 wallDetail">
                  <p className="text-center">MIN PASSED SINCE LAST UPDATE</p>
                  <h4 className="text-center amnt">
                    {this.state.minutesPassed} MIN
                  </h4>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-info"
                      onClick={this.edit}
                    >
                      UPDATE DATA
                    </button>
                  </div>
                  <>
                    {this.state.editSuccess ? (
                      <p className="editSuccess text-center">
                        {this.state.editSuccess}
                      </p>
                    ) : (
                      <></>
                    )}
                  </>
                </div>
                <div className="col-4 wallDetail">
                  <p className="text-center">Updated</p>
                  <h4 className="text-center amnt">
                    {String(this.state.updated)}{" "}
                  </h4>
                </div>
              </div>

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
      </div>
    );
  }
}
