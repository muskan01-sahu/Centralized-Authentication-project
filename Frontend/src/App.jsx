import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Orders from "./Orders.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { AuthProvider } from "./AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
