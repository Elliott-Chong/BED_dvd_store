import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useGlobalContext } from "./context";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  const { loadUser, state } = useGlobalContext();
  const { loading, is_authenticated } = state;
  const location = useLocation();

  React.useEffect(() => {
    loadUser();
  }, [loadUser, location]);

  const authenicatedRoutes = React.useMemo(() => {
    return (
      <>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  }, []);

  const publicRoutes = React.useMemo(() => {
    return (
      <>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </>
    );
  }, []);
  if (loading) {
    return <></>;
  }

  return (
    <>
      <Navbar />
      <Routes>{is_authenticated ? authenicatedRoutes : publicRoutes}</Routes>
    </>
  );
}

export default App;
