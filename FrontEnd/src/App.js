import HomePage from "./pages/Login"
import Dashboard from "./pages/Home"
import Onboarding from "./pages/Register"
import { BrowserRouter, Routes, Route } from "react-router-dom"

const App = () =>{
  return(
    <BrowserRouter>
    <Routes>
        <Route path="/home" element={<Dashboard/>}/>
        <Route path="/" element={<HomePage/>}/> 
        <Route path="/cadastro" element={<Onboarding/>}/>
    </Routes>

</BrowserRouter>
  )       

}

export default App