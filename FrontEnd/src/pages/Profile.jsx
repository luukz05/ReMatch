import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Logo from "../assets/logo.png";
import MatchInfo from "../components/MatchInfo";

const PH1 = () => {
  const { id } = useParams(); // Obtém o ID da URL
  let navigate = useNavigate();
  const [user, setUser] = useState(null); // Armazena o usuário diretamente
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensagem de erro
  const [cookies] = useCookies(["userId"]);

  // Função para navegar para outra página
  function teste(value) {
    navigate(`/${value}`);
  }

  // useEffect para buscar o usuário
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setErrorMessage(""); // Limpa a mensagem de erro
      try {
        // Faz a requisição para a rota /users/:id
        const response = await fetch(`http://localhost:5000/users/${id}`, {
          method: "GET",
          credentials: "include", // Inclui cookies na requisição
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");
        const userData = await response.json();

        if (!userData) {
          setErrorMessage("Usuário não encontrado."); // Mensagem de erro caso o usuário não seja encontrado
        } else {
          setUser(userData); // Define o usuário encontrado
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setErrorMessage(
          "Erro ao carregar o usuário. Tente novamente mais tarde.",
        ); // Mensagem de erro
      } finally {
        setLoading(false);
      }
    };

    // Verifica se o ID está presente antes de fazer a requisição
    if (id) {
      fetchUser();
    } else {
      setLoading(false); // Se não houver ID, defina loading como false
      navigate("/login"); // Redireciona para a página de login
    }
  }, [id, navigate]);

  // Renderiza carregando ou o usuário
  if (loading) {
    return <p>Carregando...</p>;
  }

  if (errorMessage) {
    return <p style={{ color: "red" }}>{errorMessage}</p>; // Exibe a mensagem de erro
  }

  if (!user) {
    return <p>Usuário não encontrado.</p>;
  }

  return (
    <div>
      <div className="match-section">
        <h2>Seu Match</h2>
        <MatchInfo userId={user._id} />{" "}
        {/* Passando o ID do usuário para buscar os matches */}
      </div>
      <div className="nav-menu">
        <img src={Logo} alt="Logo" />
        <div className="perfil">
          <div className="div-name">
            <div className="name-container">
              <h1>{user.nome}</h1>
            </div>
            <div className="info-menu">
              <p>
                {user.action}: {user.interesse}
              </p>
            </div>
          </div>
          <img
            src={user.imagem || "https://placehold.co/45"} // Use a imagem do usuário, ou uma padrão
            className="img-perfil"
            alt="Perfil"
          />
        </div>
      </div>
      <div className="container-profile">
        <div className="divo">
          <h1 style={{ fontSize: "70px" }}>Olá {user.nome}!</h1>
          <p style={{ fontSize: "30px" }}>O que está procurando hoje?</p>
          <div className="div-buttons-profile">
            <button
              className="btn-opcao-profile"
              value="Dar"
              onClick={() => teste("Dar")}
            >
              Dar algo
            </button>
            <button
              className="btn-opcao-profile"
              value="Receber"
              onClick={() => teste("Receber")}
            >
              Receber algo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PH1;
