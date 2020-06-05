import React from "react";
import { Link, useHistory } from "react-router-dom";
import FadeIn from "react-fade-in";
import api from "src/api";
import { Text, Section, Input, Button } from "src/components";

const ForgotPassword = () => {
  const history = useHistory();
  const [emailField, setEmailField] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmitForm = async (ev) => {
    try {
      ev.preventDefault();
      setIsLoading(true);
      const res = await api.sendResetPasswordMail(emailField);
      console.log(res.message);
      alert("Email enviado, por favor verifique sua caixa de entrada");
      setIsLoading(false);
      history.push(`/redefinir-senha?email=${emailField}`);
    } catch (err) {
      console.log(err);
      alert(
        "Ocorreu um erro ao enviar o email. Verifique se o endereço de email está correto e tente novamente."
      );
      setIsLoading(false);
    }
  };

  return (
    <FadeIn>
      <Text variant="h1">Esqueci minha senha</Text>

      <Section variant="box" style={{ textAlign: "center" }}>
        <Link to="/">Voltar para Login</Link>
        <br />
        <Text>
          Para criar uma nova senha, digite seu email cadastrado abaixo.
        </Text>
        <form action="#" onSubmit={handleSubmitForm}>
          <Input
            type="text"
            placeholder="Email"
            value={emailField}
            onChange={(ev) => setEmailField(ev.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar código"}
          </Button>
        </form>
      </Section>
    </FadeIn>
  );
};

export default ForgotPassword;
