import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const RegisterModal = ({ setShowModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("PF");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [description, setDescription] = useState("");
  const [companyInterest, setCompanyInterest] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [action, setAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["userId"]);

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("As senhas precisam ser iguais!");
      return;
    }

    const userData = {
      nome: accountType === "PF" ? name : companyName,
      email,
      senha: password,
      area: accountType,
      descricao: description,
      cnpj: accountType === "PJ" ? cnpj : undefined,
      interesse: companyInterest,
      estado: state,
      cidade: city,
      action,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/register`,
        userData,
      );

      if (response.status === 201 || response.status === 200) {
        setCookie("userId", response.data.userId, { path: "/", maxAge: 3600 });
        localStorage.setItem("token", response.data.token);
        navigate("/");
        window.location.reload();
      } else {
        setErrorMessage(response.data.error || "Erro ao criar conta.");
      }
    } catch (error) {
      setErrorMessage("Erro ao criar conta. Tente novamente.");
      console.error("Erro ao registrar usuário:", error.response.data);
    }
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClick}>
        X
      </div>
      <h2>CRIAR CONTA</h2>
      <form onSubmit={handleSubmit}>
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
        <input
          type="password"
          placeholder="Confirme a senha"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Descrição"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={150}
        />

        <div>
          <input
            onChange={(e) => setAction(e.target.value)}
            type="radio"
            id="option1"
            name="options"
            value="Dar"
            required
          />
          <label htmlFor="option1">Dar Materiais</label>
          <input
            onChange={(e) => setAction(e.target.value)}
            type="radio"
            id="option2"
            name="options"
            value="Receber"
          />
          <label htmlFor="option2">Receber Materiais</label>
        </div>

        <select
          value={companyInterest}
          onChange={(e) => setCompanyInterest(e.target.value)}
          required
        >
          <option value="">Selecione um resíduo de interesse</option>
          <option value="Eletrônico">Eletrônico</option>
          <option value="Papel ou Papelão">Papel ou Papelão</option>
          <option value="Plástico">Plástico</option>
          <option value="Vidro ou Cerâmica">Vidro ou Cerâmica</option>
          <option value="Metais (Cobre, Ferro e afins)">
            Metais (Cobre, Ferro e afins)
          </option>
          <option value="Óleo de cozinha">Óleo de cozinha</option>
          <option value="Tecidos e roupas">Tecidos e roupas</option>
          <option value="Madeira">Madeira</option>
          <option value="Pilhas ou Baterias">Pilhas ou Baterias</option>
          <option value="Orgânicos">Orgânicos</option>
        </select>

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

        <button className="secondary-button" type="submit">
          Criar Conta
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default RegisterModal;
