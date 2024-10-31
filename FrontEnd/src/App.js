import Dashboard from "./pages/Swipes-Modelo";
import Home from "./pages/Home";
import PH1 from "./pages/ph1";
import Dar from "./pages/Dar";
import Receber from "./pages/Receber";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/receber" element={<Receber />} />
        <Route path="/dar" element={<Dar />} />
        <Route path="/users/:id" element={<PH1 />} />{" "}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
