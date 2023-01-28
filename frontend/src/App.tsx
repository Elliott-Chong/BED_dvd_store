import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useGlobalContext } from "./context";
import AddActor from "./pages/AddActor";
import AddCustomer from "./pages/AddCustomer";
import FilmDetails from "./pages/FilmDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  const { loadUser, state } = useGlobalContext();
  const { loading, is_authenticated } = state;
  const location = useLocation();

  React.useEffect(() => {
    loadUser();
  }, [loadUser, location]);

  const sharedRoutes = React.useMemo(() => {
    return (
      <>
        <Route path="/" element={<Home />} />
        <Route path="/films/:slug" element={<FilmDetails />} />
      </>
    );
  }, []);

  const authenicatedRoutes = React.useMemo(() => {
    return (
      <>
        <Route path="/add/actor" element={<AddActor />} />
        <Route path="/add/customer" element={<AddCustomer />} />
        <Route path="*" element={<Navigate to="/" />} />
        {sharedRoutes}
      </>
    );
  }, []);

  const publicRoutes = React.useMemo(() => {
    return (
      <>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
        {sharedRoutes}
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
