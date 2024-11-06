import React, { useEffect, useState } from "react";

const MatchInfo = ({ userId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        // Faz a requisição para obter o usuário
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const userData = await response.json();
        const matchPromises = userData.matches.map(async (matchId) => {
          const matchResponse = await fetch(
            `http://localhost:5000/users/${matchId}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          if (!matchResponse.ok) throw new Error("Failed to fetch match");
          return matchResponse.json(); // Retorna os dados do match
        });

        // Espera todas as promessas serem resolvidas
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchInfo;
