import Logo from "../assets/logo.png";

const Nav = ({ authToken, minimal, handleShowLoginModal, handleLogout }) => {
  return (
    <nav>
      <div className="logo-container">
        <img className="logo" src={Logo} alt="logo" />
      </div>
      {!authToken && !minimal && (
        <button
          className="nav-button"
          onClick={handleShowLoginModal} // Chama a função para abrir o LoginModal
        >
          Log in
        </button>
      )}
      {authToken && (
        <button className="nav-button" onClick={handleLogout}>
          Sign out
        </button>
      )}
    </nav>
  );
};

export default Nav;
