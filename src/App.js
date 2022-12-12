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
    // check localStorage for the user jwt token,
    // the token hold info on the logged in user
    let token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // decode token
      if (payload.exp < Date.now() / 1000) {
        // Checking if token is expired, and remove if it is (standard/boilerplate)
        localStorage.removeItem("token");
        token = null;
      } else {
        // token not expired! our user is still 'logged in'. Put them into state.
        let user = payload.user; // grab user details from token
        this.setState({ user }); // set user in the state
      }
    }
  };

  logout = async () => {
    // if showLogin is true a user can view the logged in page
    // when a user does not exist
    await this.setState({ showLogin: true });

    // removing token which holds info
    // of a logged in user and setting
    // user in state to null which is nothing
    localStorage.removeItem("token");
    let user = null;
    this.setState({ user });
  };

  Signup = async () => {
    // if showLogin is true a user can view the Signup page
    // when a user does not exist
    await this.setState({ showLogin: false });
  };

  LogIn = async () => {
    // if showLogin is true a user can view the logged in page
    // when a user does not exist
    await this.setState({ showLogin: true });
  };

  setUserInState = (incomingUserData) => {
    // incomingUserData info is passed in from LoginForm
    // or SignUp form
    this.setState({ user: incomingUserData });
  };

  detailAdress = async (addre) => {
    // on mouse over on the your wallets, or all wallets view,
    // the passed in address from those views with the help of
    // this function is stored iin state.
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

        {/* if there exist a user in state, the user will have 
        access to creating wallets viewing wallet details and other
        functionalities else they will be seeing a login or 
        signUp page depending if showLogin is true or false */}
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

            {/* Catches all routes which does not exist */}
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
