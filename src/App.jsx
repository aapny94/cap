import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Main from "./pages/main";
import ResetPassword from "./pages/resetPassword";
import { account } from "./services/appwrite";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    account
      .get()
      .then((user) => console.log("Connected as:", user))
      .catch((err) => console.log("Not logged in or error:", err));
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main/*" element={<Main />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
