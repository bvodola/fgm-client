import React from "react";
import { ThemeProvider } from "styled-components";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import FadeIn from "react-fade-in";
import api from "src/api";
import theme from "src/theme.js";
import { Nav, Text, Section, Input, Button } from "src/components";
import ReceiptsList from "src/screens/ReceiptsList";
import Reports from "src/screens/Reports";
import Drawings from "src/screens/Drawings";
import AddReceipt from "src/screens/AddReceipt";
import ForgotPassword from "src/screens/ForgotPassword";
import ResetPassword from "src/screens/ResetPassword";
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
        password: "",
      },
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
    console.log(this.state.loggedInUser);
    const { loggedInUser } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Nav>
              <div className="logo">
                <img src="/public/fgm.png" alt="Logo FGM" />
              </div>
              {this.state.isLoggedIn && (
                <ul className="menu">
                  <li>
                    <Link to="/">Notas Fiscais</Link>
                  </li>
                  <li>&bull;</li>
                  {loggedInUser.role === "CLIENT" && (
                    <React.Fragment>
                      <li>
                        <Link to="/cadastrar-nota">Cadastrar Nota</Link>
                      </li>
                      <li>&bull;</li>
                    </React.Fragment>
                  )}
                  {loggedInUser.role === "ADMIN" && (
                    <React.Fragment>
                      <li>
                        <Link to="/relatorios">Relatórios</Link>
                      </li>
                      <li>&bull;</li>
                      <li>
                        <Link to="/sorteios">Sorteios</Link>
                      </li>
                      <li>&bull;</li>
                    </React.Fragment>
                  )}

                  <li className="visible-mobile">
                    <a href="#" onClick={() => {}}>
                      <span>
                        {this.state.loggedInUser.email}{" "}
                        <span onClick={this.logout}>(Logout)</span>
                      </span>
                    </a>
                  </li>
                </ul>
              )}
            </Nav>
            <div style={{ paddingTop: "80px" }}></div>
            {this.state.isLoggedIn ? (
              <Switch>
                <Route exact path="/">
                  <ReceiptsList loggedInUser={loggedInUser} />
                </Route>
                <Route path="/relatorios">
                  <Reports />
                </Route>
                <Route path="/sorteios">
                  <Drawings />
                </Route>
                <Route path="/cadastrar-nota">
                  <AddReceipt loggedInUser={loggedInUser} />
                </Route>
              </Switch>
            ) : (
              <Switch>
                <Route exact path="/">
                  <FadeIn>
                    <Text variant="h1">Login</Text>
                    <Section variant="box" style={{ textAlign: "center" }}>
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
                      <Link to="/esqueci-minha-senha">Esqueci minha senha</Link>
                    </Section>
                  </FadeIn>
                </Route>
                <Route path="/esqueci-minha-senha">
                  <ForgotPassword />
                </Route>
                <Route path="/redefinir-senha">
                  <ResetPassword />
                </Route>
              </Switch>
            )}
          </div>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
