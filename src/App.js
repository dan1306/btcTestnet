import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import React, { Component } from "react";
import AuthPage from "./pages/AuthPage/AuthPage";
import { Route, Routes, Navigate } from "react-router-dom";
import CreateAwallet from "./pages/CreateWallet/CreateAwallet";
import YourWallets from "./pages/YourWallets/YourWallets";
import AllWallets from "./pages/AllWallets/AllWallets";
import WalletDetails from "./pages/WalletDetails/WalletDetails";
import Search from "./pages/Search/Search";

class App extends Component {
  state = {
    user: null,
    showLogin: true,
    walletDetail: null,
  };

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        token = null;
      } else {
        let user = payload.user;
        this.setState({ user });
      }
    }
  };

  logout = async () => {
    await this.setState({ showLogin: true });

    localStorage.removeItem("token");
    let user = null;
    this.setState({ user });
  };

  Signup = async () => {
    await this.setState({ showLogin: false });
  };

  LogIn = async () => {
    await this.setState({ showLogin: true });
  };

  setUserInState = (incomingUserData) => {
    this.setState({ user: incomingUserData });
  };

  detailAdress = async (addre) => {
    if (this.state.walletDetail) {
      await this.setState({ walletDetail: null });
    }
    await this.setState({ walletDetail: addre });
  };

  render() {
    return (
      <div className="App">
        <NavBar
          userState={this.state.user}
          logout={this.logout}
          Signup={this.Signup}
          LogIn={this.LogIn}
        />
        {this.state.user ? (
          <Routes>
            <Route path="/createAwallet" element={<CreateAwallet />} />
            <Route
              path="/yourWallets"
              element={
                <YourWallets
                  user={this.state.user}
                  detailAdress={this.detailAdress}
                />
              }
            />
            <Route
              path="/allWallets"
              element={<AllWallets detailAdress={this.detailAdress} />}
            />
            <Route
              path="/walletDetails"
              element={<WalletDetails address={this.state.walletDetail} />}
            />
            <Route
              path="/searchAndSend"
              element={<Search user={this.state.user} />}
            />

            <Route
              path="*"
              element={<Navigate to="/searchAndSend" replace />}
            />
          </Routes>
        ) : (
          <AuthPage
            showLogin={this.state.showLogin}
            setUserInState={this.setUserInState}
          />
        )}
      </div>
    );
  }
}

export default App;
