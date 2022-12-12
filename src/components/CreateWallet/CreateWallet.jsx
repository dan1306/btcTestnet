import { Component } from "react";
import "./CreateWallet.css";
import { BrowserRouter as Router, Link } from "react-router-dom";

export default class createWallet extends Component {
  state = {
    walletName: "",
    err: null,
    submitted: false,
  };

  handleChange = async (e) => {
    if (this.state.err) {
      await this.setState({ err: null });
    }
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  handleSubmit = async (evt) => {
    // When a user clicks submit a post request is made to the back end
    // to generate an address with unique keys and a wallet with a unique
    // name. If a wallet with a given name passed in already exist an object
    // like response is sent to the fron end (which is here)
    evt.preventDefault();

    try {
      let jwt = localStorage.getItem("token");
      console.log(jwt);
      const data = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + jwt,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletName: this.state.walletName,
        }),
      };
      const fetchResponse = await fetch("/api/wallet/createWallet", data);
      let returnedData = await fetchResponse.json();

      if (!fetchResponse.ok) {
        console.log("daniel", returnedData);
        // response with an object, within it there
        // exists an err
        await this.setState({ err: returnedData.error });
        return;
      } else {
        // submitted only become true on a good response
        // when trying to create a wallet
        console.log(returnedData)
        await this.setState({ err: null, submitted: true });
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { err } = this.state;
    return (
      <div className="pad createWallet">
        <div className="creatInnerDiv">
          <h1 className="text-center">Create A Wallet</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group spaceOut">
              <label>Give Your Wallet A Name: </label>
              <input
                type="text"
                className="form-control"
                name="walletName"
                onChange={this.handleChange}
                value={this.state.walletName}
                required
              />
            </div>
            {/* if submitted is true, we direct user to view all their wallets
            else we want user to click submit to create a wallet
             */}
            {this.state.submitted ? (
              <div className="text-center">
                <Link to="/yourWallets">
                  <button className="btn btn-success">View Your Wallets</button>
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            )}
          </form>

          {/* if an err exist while trying to create a wallet
          we send it to for a user to view on the application, else
          we check if submitted is true, if it is we know we 
          recieved a good request trying to create a wallet, so we give
          the user a success message. Else show nothing.
               */}
          {err ? (
            <>
              <h3 className="text-center err">{err}</h3>
            </>
          ) : (
            <>
              {this.state.submitted ? (
                <h3 className="text-center success">Wallet Created</h3>
              ) : (
                <> </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}
