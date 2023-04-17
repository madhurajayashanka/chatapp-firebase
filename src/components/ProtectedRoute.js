import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContextProvide";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const auth = UserAuth().useAuth()?.uid;
  if (auth) {
    return children;
  }
  navigate("/login");
}

export default ProtectedRoute;
