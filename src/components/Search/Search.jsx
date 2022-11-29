import { Component } from "react";
import "./Search.css";

export default class SearchForm extends Component {
  state = {
    submitted: false,
    pubAddress: "",
    jsonDetials: null,
  };

  handleChange = async (e) => {
    const { name, value } = e.target;

    await this.setState({ [name]: value, submitted: false });
  };

    handleSubmit = async (evt) => {
      
        try {
            
        } catch (e) {
            
        }
    evt.preventDefault();
    await this.setState({ pubAddress: "daniel", submitted: true });
  };

  render() {
    return (
      <div>
        <div className="searchForm">
          <p className="search">Search For A public Adress Below: </p>
          <form onSubmit={this.handleSubmit}>
            <div>
              {" "}
              <input
                type="text"
                className="form-control"
                name="pubAddress"
                onChange={this.handleChange}
                value={this.state.pubAddress}
                required
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>

        <div>
          {this.state.submitted ? <h1>{this.state.pubAddress}</h1> : <></>}
        </div>
      </div>
    );
  }
}
