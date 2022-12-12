import { Component } from "react";
import "./SignUpForm.css";

export default class SignUpForm extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirm: "",
    error: "",
  };

  handleChange = async (evt) => {
    await this.setState({
      [evt.target.name]: evt.target.value,
      // error: "",
    });

    if (this.state.password !== this.state.confirm) {
      await this.setState({ error: "Passwords Do Not Match" });
    } else {
      await this.setState({ error: "" });
    }
  };

  handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      // 1. POST our new user to our server
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
        }),
      };
      const fetchResponse = await fetch("/api/user/signup", options);

      if (!fetchResponse.ok) throw new Error("Fetch failed - Bad request");

      // on a good signup request we place the token
      // receieved into the local storage, it remanins there
      // for 24 hours
      let token = await fetchResponse.json();
      localStorage.setItem("token", token);

      // setting the user to the reponse we recieve
      // when a succesful signup is made, which is a token
      // which holds user info
      let user = JSON.parse(atob(token.split(".")[1])).user;
      this.props.setUserInState(user);
    } catch (err) {
      console.log("SignupForm error", err);
      this.setState({ error: "Sign Up Failed - LogIn If You Have An Account" });
    }
  };

  render() {
    const disable = this.state.password !== this.state.confirm;
    return (
      <div className="signUp-form-container">
        <div>
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={this.state.name}
                className="form-control"
                onChange={this.handleChange}
                required
              />
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                className="form-control"
                onChange={this.handleChange}
                value={this.state.email}
                required
              />
            </div>
            <div class="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={this.handleChange}
                value={this.state.password}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm:</label>
              <input
                type="password"
                name="confirm"
                className="form-control"
                onChange={this.handleChange}
                value={this.state.confirm}
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary signUp-btn"
                disabled={disable}
              >
                SIGN UP
              </button>
            </div>
          </form>
        </div>
        <div className="err-div text-center">
          <p className="error-message">&nbsp;{this.state.error}</p>
        </div>
      </div>
    );
  }
}
