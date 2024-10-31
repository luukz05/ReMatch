import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ setShowModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies, setCookie] = useCookies(["userId"]); // Hook para gerenciar cookies
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        senha: password, // Verifique se está sendo enviado corretamente
      });

      if (response.status === 200) {
        setCookie("userId", response.data.userId, { path: "/", maxAge: 3600 });
        setShowModal(false);
        navigate(`/users/${response.data.userId}`); // Redireciona para a nova URL
        window.location.reload();
      } else {
        setErrorMessage("Erro ao fazer login.");
      }
    } catch (error) {
      setErrorMessage("Erro ao fazer login. Verifique suas credenciais.");
      console.error(
        "Erro ao fazer login:",
        error.response ? error.response.data : error.message,
      );
    }
  };

  return (
    <div className="auth-modal">
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginModal;
