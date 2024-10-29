import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import PH1 from "./pages/ph1";
import PH2 from "./pages/ph2";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/1" element={<PH1 />} />
        <Route path="/2" element={<PH2 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
