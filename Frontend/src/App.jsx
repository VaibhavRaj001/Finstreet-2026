import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CreateTeam from "./Pages/CreateTeam";
import JoinTeam from "./Pages/JoinTeam";
import MyTeams from "./Pages/MyTeams";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/join-team/:inviteCode" element={<JoinTeam />} />
          <Route path="/my-teams" element={<MyTeams />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
