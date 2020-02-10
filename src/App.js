import React from "react";
import { ThemeProvider } from "styled-components";
import FadeIn from "react-fade-in";
import api from "src/api";
import theme from "src/theme.js";
import { Nav, Text, Section, Input, Button } from "src/components";
import ReceiptsList from "src/screens/ReceiptsList";
import { setFormField } from "src/helpers";
import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      loggedInUser: {},
      form: {
        email: "",
        password: ""
      }
    };
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    this.setupLogin = this.setupLogin.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      this.setupLogin(loggedInUser);
    }
  }

  setupLogin(loggedInUser) {
    this.setState({ loggedInUser, isLoggedIn: true });
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  }

  logout() {
    this.setState({ loggedInUser: {}, isLoggedIn: false });
    localStorage.removeItem("loggedInUser");
  }

  async handleSubmitLogin(ev) {
    try {
      ev.preventDefault();
      const { email, password } = this.state.form;
      const loggedInUser = await api.login(email, password);
      console.log(loggedInUser);
      this.setupLogin(loggedInUser);
    } catch (err) {
      if (err.message === "Request failed with status code 401") {
        alert("Login ou senha incorretos");
      }
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Nav>
            <div className="logo">
              <img src="/public/fgm.png" alt="Logo FGM" />
            </div>
            <ul className="menu">
              <li className="visible-mobile">
                <a href="#" onClick={() => {}}>
                  {this.state.isLoggedIn ? (
                    <span>
                      {this.state.loggedInUser.email}{" "}
                      <span onClick={this.logout}>(Logout)</span>
                    </span>
                  ) : (
                    <span></span>
                  )}
                </a>
              </li>
            </ul>
          </Nav>
          <div style={{ paddingTop: "80px" }}></div>
          {this.state.isLoggedIn ? (
            <FadeIn>
              <ReceiptsList />
            </FadeIn>
          ) : (
            <FadeIn>
              <Text variant="h1">Login</Text>
              <Section variant="box">
                <form action="#" onSubmit={this.handleSubmitLogin}>
                  <Input
                    {...setFormField(this, "email")}
                    type="text"
                    placeholder="Email"
                  />
                  <Input
                    {...setFormField(this, "password")}
                    type="password"
                    placeholder="Senha"
                  />
                  <Button type="submit">Fazer Login</Button>
                </form>
              </Section>
            </FadeIn>
          )}
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
