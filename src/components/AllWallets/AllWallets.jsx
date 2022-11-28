import { Component } from "react";
import "./AllWallets.css";
import { BrowserRouter as Router, Link } from "react-router-dom";


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


  // componentDidMount = async () => {
  //   try {
  //     let jwt = localStorage.getItem("token");

  //     let getYourWallets = await fetch("/api/wallet/yourWallets", {
  //       headers: { Authorization: "Bearer " + jwt },
  //     });
  //     if (getYourWallets.ok) {
  //       getYourWallets = await getYourWallets.json();
  //       console.log(getYourWallets);
  //       await this.setState({ yourWallets: getYourWallets });
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };






  render() {
    return (
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
                    <Link to='/walletDetails'>
                      <button type="button" class="btn btn-primary" onMouseOver={() => {
                        this.props.detailAdress(wallet.address)
                      }
                      }>
                        View Details
                      </button>
                    </Link>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="padWalDiv text-center">
            <h1>No Wallets To Show</h1>
          </div>
        )}
      </>
    );
  }
}
