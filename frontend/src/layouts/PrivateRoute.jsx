import { Navigate, Outlet } from "react-router-dom";

const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export const PrivateRoute = () => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
