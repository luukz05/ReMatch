import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import { useCookies } from "react-cookie";

const UsersDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["userId"]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const filteredUsers = data.filter(
          (user) => user._id !== cookies.userId
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [cookies.userId]);

  const swiped = (direction, userId) => {
    console.log(`Você deslizou para ${direction}: ${userId}`);
  };

  const outOfFrame = (name) => {
    console.log(`${name} saiu da tela!`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="swipe-container">
        <div className="card-container">
          {users.map((user) => (
            <TinderCard
              className="swipe"
              key={user._id}
              onSwipe={(dir) => swiped(dir, user._id)}
              onCardLeftScreen={() => outOfFrame(user.nome)}
            >
              <div className="card">
                <img
                  src={user.profileImageUrl || "https://placehold.co/600x400"}
                  onLoad={(e) => (e.currentTarget.style.opacity = 1)}
                  style={{
                    borderRadius: 10,
                    opacity: 0,
                    transition: "opacity 0.5s ease",
                  }}
                />
                <h3>{user.nome}</h3>
                <h3>
                  Quer {user.action}: {user.interesse}
                </h3>
                <p style={{ textWrap: "wrap", wordBreak: "break-all" }}>
                  {user.descricao}
                </p>
                <h3>
                  Localização: {user.cidade}, {user.estado}
                </h3>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersDashboard;
