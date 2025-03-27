import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import Dashboard from "./components/Dashboard";
import { useEffect } from "react";

function AuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const isUserLogged = JSON.parse(localStorage.getItem("loggedUser"));
    if (isUserLogged) {
      navigate("/dashboard");
    }
  }, []);

  return null;
}

function App() {
  return (
    <Router>
      <AuthRedirect />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
