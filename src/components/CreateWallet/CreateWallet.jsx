import { Component } from "react";
import "./CreateWallet.css";

export default class createWallet extends Component {
  state = {
    walletName: "",
    err: null,
  };

  handleChange = async (e) => {
    if (this.state.err) {
      await this.setState({err: null})
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
        await this.setState({ err: null });
        return
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
            <div>
              <button type="submit" class="btn btn-primary spaceOut">
                Submit
              </button>
            </div>
          </form>
          {err ? (
            <>
              <h3 className="text-center red">{err}</h3>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}
