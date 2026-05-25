import { Navigate, Outlet, useLocation } from "react-router-dom";

const ROLE_MAP = {
  "/padres": 1,
  "/doctor": 2,
  "/admin": [3, 4],
};

const getTokenData = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

const getRequiredRole = (pathname) => {
  const base = "/" + pathname.split("/").filter(Boolean)[0];
  return ROLE_MAP[base] || null;
};

export const PrivateRoute = () => {
  const location = useLocation();
  const payload = getTokenData();

  if (!payload) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("cliente_id");
    return <Navigate to="/login" replace />;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("cliente_id");
    return <Navigate to="/login" replace />;
  }

  const requiredRole = getRequiredRole(location.pathname);
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  if (requiredRole && !allowedRoles.includes(payload.id_rol)) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("cliente_id");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
