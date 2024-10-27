import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(""); // Para nome completo ou razão social
  const [accountType, setAccountType] = useState("PF"); // PF ou PJ
  const [companyName, setCompanyName] = useState(""); // Nome fantasia
  const [cnpj, setCnpj] = useState(""); // CNPJ
  const [description, setDescription] = useState(""); // Área de atuação
  const [companyInterest, setCompanyInterest] = useState(""); // Interesse em resíduos
  const [state, setState] = useState(""); // Estado
  const [city, setCity] = useState(""); // Cidade
  const [matches, setMatches] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage("As senhas precisam ser iguais!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/${isSignUp ? "register" : "login"}`,
        {
          nome: accountType === "PF" ? name : companyName,
          email,
          senha: password,
          area: accountType,
          descricao: description,
          cnpj: accountType === "PJ" ? cnpj : undefined, // Envia CNPJ se for PJ
          interesse: companyInterest,
          estado: state, // Enviar estado
          cidade: city, // Enviar cidade
          matches,
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Salva o token no localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        // Redirecionar após o login bem-sucedido
        navigate("/dashboard");
        window.location.reload();
      } else {
        setErrorMessage(response.data.error || "Erro ao fazer login.");
      }
    } catch (error) {
      setErrorMessage("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>
        X
      </div>

      <h2>{isSignUp ? "CRIAR CONTA" : "ENTRAR"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </select>

            {accountType === "PF" ? (
              <input
                type="text"
                placeholder="Nome Completo"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <input
                type="text"
                placeholder="Razão Social"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            )}
            {accountType === "PJ" && (
              <input
                type="text"
                placeholder="CNPJ"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
            )}
          </>
        )}
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
        {isSignUp && (
          <input
            type="password"
            placeholder="Confirme a senha"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              value={companyInterest}
              onChange={(e) => setCompanyInterest(e.target.value)}
            >
              <option value="">Selecione um resíduo de interesse</option>
              <option value="Eletro">Eletrônico</option>
              <option value="Papel">Papel ou Papelão</option>
              <option value="Plastico">Plástico</option>
              <option value="Vidro">Vidro ou Cerâmica</option>
              <option value="Metais">Metais (Cobre, Ferro e afins)</option>
              <option value="Oleo">Óleo de cozinha</option>
              <option value="Tecidos">Tecidos e roupas</option>
              <option value="Madeira">Madeira</option>
              <option value="PouB">Pilhas ou Baterias</option>
              <option value="Organicos">Orgânicos</option>
            </select>

            {/* Campos para Estado e Cidade */}
            <input
              type="text"
              placeholder="Estado"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <input
              type="text"
              placeholder="Cidade"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </>
        )}
        <button className="secondary-button" type="submit">
          {isSignUp ? "Criar Conta" : "Entrar"}
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default AuthModal;
