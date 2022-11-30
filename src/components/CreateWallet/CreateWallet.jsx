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

        await this.setState({ err: returnedData.error });
        return;
      } else {
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
