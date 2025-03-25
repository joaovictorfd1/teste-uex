import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "@material/web/all.js";
import "@material/web/button/filled-button.js";
import "@material/web/textfield/outlined-text-field.js";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
