import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Usando axios para requisições

const MatchInfo = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userId = document.cookie.replace(
    /(?:(?:^|.*;\s*)userId\s*\=\s*([^;]*).*$)|^.*$/,
    "$1",
  ); // Pega o userId do cookie

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        // Requisição para buscar os dados do usuário
        const response = await axios.get(
          `http://localhost:5000/users/${userId}`,
          {
            withCredentials: true,
          },
        );

        const matchPromises = response.data.matches.map(async (matchId) => {
          const matchResponse = await axios.get(
            `http://localhost:5000/users/${matchId}`,
            {
              withCredentials: true,
            },
          );
          return matchResponse.data;
        });

        const matchUsers = await Promise.all(matchPromises);
        setMatches(matchUsers);
      } catch (error) {
        console.error("Erro ao buscar matches:", error);
        setErrorMessage("Erro ao carregar os matches.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMatches();
    }
  }, [userId]);

  const handleChatClick = (likedUserId) => {
    navigate(`/messages/${userId}/${likedUserId}`);
  };

  if (loading) return <p>Carregando matches...</p>;
  if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;
  if (!matches.length)
    return (
      <p style={{ fontWeight: "bolder", marginTop: 350 }}>
        Nenhum match encontrado.
      </p>
    );

  return (
    <div className="matches-container">
      <h2>Seus Matches</h2>
      <div className="matches-list">
        {matches.map((match) => (
          <div key={match._id} className="match-card">
            <img
              src={match.imagem || "https://placehold.co/100"}
              alt="Imagem do Match"
            />
            <div className="match-info">
              <h3>{match.nome}</h3>
              <p>Interesse: {match.interesse}</p>
              <p>Ação: {match.action}</p>
              <button
                className="btn-chat"
                onClick={() => handleChatClick(match._id)}
              >
                Abrir Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchInfo;
