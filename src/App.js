import React from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import FadeIn from "react-fade-in";
import api from "src/api";
import theme from "src/theme.js";
import { Nav, Text, Section, Input, Button } from "src/components";
import ReceiptsList from "src/screens/ReceiptsList";
import Reports from "src/screens/Reports";
import Drawings from "src/screens/Drawings";
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
        <Router>
          <div className="App">
            <Nav>
              <div className="logo">
                <img src="/public/fgm.png" alt="Logo FGM" />
              </div>
              <ul className="menu">
                <li>
                  <Link to="/">Notas Fiscais</Link>
                </li>
                <li>&bull;</li>
                <li>
                  <Link to="/relatorios">Relatórios</Link>
                </li>
                <li>&bull;</li>
                <li>
                  <Link to="/sorteios">Sorteios</Link>
                </li>
                <li>&bull;</li>
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
              <Switch>
                <Route exact path="/">
                  <ReceiptsList />
                </Route>
                <Route path="/relatorios">
                  <Reports />
                </Route>
                <Route path="/sorteios">
                  <Drawings />
                </Route>
              </Switch>
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
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
