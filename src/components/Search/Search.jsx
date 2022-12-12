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
    // When submitted is clicked we make a call to the backend
    // to retrieve data of a given address in our database if it exist,
    // or make an API call to retrieve data for a given public address if
    // it does not exist in the database
    // regardles of the response we store the recieved data in our state
    // errors are handled down below
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
      // If there is an error in the response we recieve
      // stored in our state (jsonDetials), it is prompted to the user.
      // else we pass on the recieved data which will be data pertaining to
      // the searched for address, along with the searched address and logged in user
      // info to the SearchDetails component
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
