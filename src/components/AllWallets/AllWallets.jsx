import { Component } from "react";
import "./AllWallets.css";
import { BrowserRouter as Router, Link } from "react-router-dom";

export default class createWallet extends Component {
  state = {
    alllWallets: [],
  };

  componentDidMount = async () => {
    // maming a call to the backend to retieve all wallets
    // not associated with a particular user, and setting recieved data
    // in state
    try {
      let jwt = localStorage.getItem("token");

      let availablWallets = await fetch("/api/wallet/allWallets", {
        headers: { Authorization: "Bearer " + jwt },
      });
      if (availablWallets.ok) {
        availablWallets = await availablWallets.json();
        console.log(availablWallets);
        await this.setState({ alllWallets: availablWallets });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // this is a view to show all wallets in a given database that is not associated with a
  // logged in user
  render() {
    return (
      // when a mouse goes over the view details of a particular
      // wallet, with that given wallet we send the public address
      // to app.js with a function call, so that address can be
      // set in state for use when retieveting data for a given address
      <>
        {this.state.alllWallets.length > 0 ? (
          <div className="row padWalDiv">
            {this.state.alllWallets.map((wallet, id) => {
              return (
                <div className="allWallDiv col-lg-4 col-md-6 col-sm-12">
                  <h3 className="text-center walletName">
                    Wallet Name: {wallet.name}
                  </h3>
                  <p className="truncate">Private: .............</p>
                  <p className="truncate">Public: .............</p>
                  <p className="truncate">Address: {wallet.address}</p>
                  <p className="truncate">Wif: .............</p>
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
          <div className="noWalDiv text-center">
            <h1>No Wallets To Show</h1>
          </div>
        )}
      </>
    );
  }
}
