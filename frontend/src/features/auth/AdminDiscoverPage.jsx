import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const Fake404 = () => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
    <div className="text-center">
      <h1 className="text-7xl font-black text-gray-200 mb-4">404</h1>
      <p className="text-gray-400 text-lg font-medium">Página no encontrada</p>
    </div>
  </div>
);

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

export const AdminDiscoverPage = () => {
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const payload = getTokenData();
    if (payload && payload.id_rol === 3) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp >= now) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }
    }

    axios.get(`${API_URL}/admin/discover`)
      .then((res) => {
        const hash = res.data?.hash;
        if (hash) {
          window.location.href = `/admin/${hash}`;
        }
      })
      .catch(() => {
        setBlocked(true);
      });
  }, [navigate]);

  if (blocked) return <Fake404 />;

  return null;
};
