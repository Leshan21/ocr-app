import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OcrApp from "./pages/OcrApp";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/ocr"
            element={
              <ProtectedRoute>
                <OcrApp />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/ocr" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
