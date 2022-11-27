import { Component } from "react";
import "./CreateWallet.css";

export default class createWallet extends Component {
  state = {
    walletName: "",
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  handleSubmit = async (evt) => {
      evt.preventDefault();
      
      try {
        const data = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                walletName: this.state.walletName
            }),
          };
          const fetchResponse = await fetch("/api/wallet/createWallet", data);

      } catch (err) {
        console.log( err);
      }
  };

  render() {
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
        </div>
      </div>
    );
  }
}
