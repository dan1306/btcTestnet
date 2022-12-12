import { Component } from "react";
import "./YourWallets.css";
import { BrowserRouter as Router, Link } from "react-router-dom";

export default class createWallet extends Component {
  state = {
    yourWallets: [],
  };

  routeChange = () => {
    // let path = `/createAwallet`;
    // this.state.navigate(path);
    console.log("HELLO");
  };

  componentDidMount = async () => {
    // making a call to the backend to retrive all wallets
    // associated to a particular user, and setting the recieved 
    // data in state
    try {
      let jwt = localStorage.getItem("token");

      let getYourWallets = await fetch("/api/wallet/yourWallets", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (getYourWallets.ok) {
        getYourWallets = await getYourWallets.json();
        console.log(getYourWallets);
        await this.setState({ yourWallets: getYourWallets });
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      // if there exist wallets in the state yourWallets, 
      // when a mouse goes over the view details of a particular
      // wallet, with that given wallet we send the public address
      // to app.js with a function call, so that address can be
      // set in state for use when retieveting data for a given address
      <>
        {this.state.yourWallets.length > 0 ? (
          <div className="row padWalletDiv">
            {this.state.yourWallets.map((wallet, id) => {
              return (
                <div className="yourWalletDiv col-lg-4 col-md-6 col-sm-12">
                  <h3 className="text-center walletName">
                    Wallet Name: {wallet.name}
                  </h3>
                  <p className="truncate">Private: {wallet.private}</p>
                  <p className="truncate">Public: {wallet.public}</p>
                  <p className="truncate">Address: {wallet.address}</p>
                  <p className="truncate">Wif: {wallet.wif}</p>
                  <div className="mg text-center">
                    <Link to="/walletDetails">
                      <button
                        type="button"
                        class="btn btn-primary"
                        onMouseOver={() => {
                          this.props.detailAdress(wallet.address);
                        }}
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="noWallets">
            <div className=" walletContainer">
              <h1 className="text-center">You Have No Wallets</h1>
              <div className="text-center">
                {/* <button
                  type="button"
                  className="btn btn-primary wallBtn"
                  onClick={this.routeChange}
                >
                  Create A Wallet
                </button> */}
                <Link to="/createAwallet">
                  <button className="btn btn-primary wallBtn">
                    Create A Wallet
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
