import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import FadeIn from "react-fade-in";
import api from "src/api";
import { Text, Section, Input, Button } from "src/components";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const history = useHistory();
  const queryParams = new URLSearchParams(useLocation().search);

  const [email, setEmail] = React.useState(queryParams.get("email"));
  const [passwordToken, setPasswordToken] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmitForm = async (ev) => {
    try {
      ev.preventDefault();
      setIsLoading(true);
      const res = await api.resetPassword(email, passwordToken, password);
      console.log(res.message);
      alert("Senha redefinida com sucesso.");
      setIsLoading(false);
      history.push("/");
    } catch (err) {
      console.log(err);
      alert("Código ou email inválido. Verifique e tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <FadeIn>
      <Text variant="h1">Redefinir senha</Text>

      <Section variant="box" style={{ textAlign: "center" }}>
        <div>
          <Link to="/esqueci-minha-senha">Reenviar código</Link> &bull;{" "}
          <Link to="/">Voltar para Login</Link>
        </div>
        <br />
        <Text>
          Digite abaixo o <b>código de 4 dígitos</b> recebido por email e crie
          uma nova senha.
        </Text>
        <form action="#" onSubmit={handleSubmitForm}>
          <Input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <Input
            type="number"
            placeholder="Código"
            value={passwordToken}
            onChange={(ev) => setPasswordToken(ev.target.value)}
          />
          <Input
            name="new-password"
            type="password"
            placeholder="Nova Senha"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Redefinir Senha"}
          </Button>
        </form>
      </Section>
    </FadeIn>
  );
};

export default ForgotPassword;
