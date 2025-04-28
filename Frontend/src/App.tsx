import "./App.css"
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/signup/SignUp";
import Domain from "./components/Domain/Domain";
import AllDomains from "./components/Domain/AllDomains";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/domain" element={<Domain/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/all-domain" element={<AllDomains />} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
