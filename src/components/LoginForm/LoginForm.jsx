import { Component } from "react";
import "./LoginForm.css";

export default class SignUpForm extends Component {
  state = {
    email: "",
    password: "",
    error: "",
  };

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
      error: "",
    });
  };

  handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      };
      const fetchResponse = await fetch("/api/user/login", options);

      if (!fetchResponse.ok) throw new Error("Fetch Failed - Bad Request");

      let token = await fetchResponse.json();
      localStorage.setItem("token", token);

      const user = JSON.parse(atob(token.split(".")[1])).user;
      this.props.setUserInState(user);
    } catch (err) {
      console.log("LogIn error", err);
      this.setState({ error: "Log In Failed - Try Again" });
    }
  };

  render() {
    return (
      <div className="login-form-container" onSubmit={this.handleSubmit}>
        <div>
          <form autoComplete="off">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="text"
                name="email"
                className="form-control"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary login-btn">
                LOG IN
              </button>
            </div>
          </form>
        </div>
        <h2 className="error-message">&nbsp;{this.state.error}</h2>
      </div>
    );
  }
}
