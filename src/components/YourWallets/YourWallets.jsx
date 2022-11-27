import { Component } from "react";
import "./YourWallets.css";

export default class createWallet extends Component {
  state = {
    yourWallets: [],
  };

  componentDidMount = async () => {
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
      <>
        {this.state.yourWallets ? (
          <div className="row padWalDiv">
            {this.state.yourWallets.map((wallet, id) => {
              return (
                <div className="yourWallDiv col-lg-4 col-md-6 col-sm-12">
                  <h3 className="text-center walletName">
                    Wallet Name: {wallet.name}
                  </h3>
                  <p className="truncate">Private: {wallet.private}</p>
                  <p className="truncate">Public: {wallet.public}</p>
                  <p className="truncate">Public Address: {wallet.address}</p>
                  <p className="truncate">Wif: {wallet.wif}</p>
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
            <h1>This Is Your Wallets</h1>
          </div>
        )}
      </>
    );
  }
}
