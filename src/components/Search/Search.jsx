import { Component } from "react";
import SearchDetails from "../SearchDetails/SearchDetails";
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
    evt.preventDefault();
    let jwt = localStorage.getItem("token");

    try {
      const options = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + jwt,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addrs: this.state.pubAddress,
        }),
      };
      let fetchResponse = await fetch("/api/search/searchAddre", options);

      console.log(fetchResponse.ok);

      fetchResponse = await fetchResponse.json();
      await this.setState({ jsonDetials: fetchResponse, submitted: true });
      return;
    } catch (e) {
      console.log(e);
      return;
    }
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
          <>
            {this.state.submitted ? (
              <>
                {this.state.jsonDetials.error ? (
                  <div className="errorDiv">
                    <p className="errTxt text-center">
                      {this.state.jsonDetials.error}
                    </p>
                  </div>
                ) : (
                  <>
                    {this.state.jsonDetials["adressObj"] ? (
                      <SearchDetails
                        Details={this.state.jsonDetials}
                        address={this.state.pubAddress}
                        user={this.props.user}
                      />
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        </div>
      </div>
    );
  }
}
