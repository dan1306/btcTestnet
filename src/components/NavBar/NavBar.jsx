import { Component } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./NavBar.css";

export default class NavBar extends Component {
  render() {
    const { userState, logout, Signup, LogIn } = this.props;

    return (
      <Navbar bg="light" expand="lg" className="nav-color">
        <Container>
          <Navbar.Brand>React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {userState ? (
              <Nav className="ms-auto">
                <NavDropdown title="Wallets" id="basic-nav-dropdown">
                  <NavDropdown.Item>
                    <Link to="/createAwallet" className="rm-underline">
                      Create A Wallet
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                </NavDropdown>

                <Nav.Link
                  onClick={async () => {
                    logout();
                  }}
                >
                  LogOut
                </Nav.Link>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <Nav.Link
                  onClick={async () => {
                    Signup();
                  }}
                >
                  Signup
                </Nav.Link>
                <Nav.Link
                  onClick={async () => {
                    LogIn();
                  }}
                >
                  LogIn
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
