import Nav from "../components/Nav";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal"; // Importa o LoginModal
import { useState } from "react";
import { useCookies } from "react-cookie";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const authToken = cookies.AuthToken;

  const handleLogout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    window.location.reload();
  };

  const handleShowLoginModal = () => {
    setIsSignUp(false);
    setShowModal(true);
  };

  const handleClick = () => {
    if (authToken) {
      handleLogout(); // Chama a função de logout
      return;
    }
    setShowModal(true);
    setIsSignUp(true);
  };

  return (
    <div className="overlay">
      <Nav
        authToken={authToken}
        minimal={false}
        handleShowLoginModal={handleShowLoginModal} // Passa a função para abrir o LoginModal
        handleLogout={handleLogout} // Passa a função de logout
      />
      <div className="home">
        <h1 className="primary-title">ReMatch</h1>
        <button className="primary-button" onClick={handleClick}>
          {authToken ? "Sign out" : "Create Account"}
        </button>

        {showModal && (
          <>
            {isSignUp ? (
              <RegisterModal setShowModal={setShowModal} />
            ) : (
              <LoginModal setShowModal={setShowModal} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
