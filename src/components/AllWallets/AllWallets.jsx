import { Component } from "react";
import "./AllWallets.css";

export default class createWallet extends Component {
  state = {
    alllWallets: [],
  };

  
  componentDidMount = async () => {
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

  render() {
    return (
      <>
        {this.state.alllWallets.length > 0 ? (
          <div className="row padWalDiv">
            {this.state.alllWallets.map((wallet, id) => {
              return (
                <div className="yourWallDiv col-lg-4 col-md-6 col-sm-12">
                  <h3 className="text-center walletName">
                    Wallet Name: {wallet.name}
                  </h3>
                  <p className="truncate">Private: .............</p>
                  <p className="truncate">Public: .............</p>
                  <p className="truncate">Address: {wallet.address}</p>
                  <p className="truncate">Wif: .............</p>
                  <div className="mg text-center">
                    <button type="button" class="btn btn-primary">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="padWalDiv">
            <h1>This Are No Available Walets</h1>
          </div>
        )}
      </>
    );
  }
}
