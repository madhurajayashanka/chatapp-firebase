import { useNavigate } from "react-router-dom";

import { UserAuth } from "../context/AuthContextProvide";

function PublicRoute({ children }) {
  const navigate = useNavigate();
  const auth = UserAuth().useAuth()?.uid;
  if (auth) {
    navigate("/home");
  } else {
    return children;
  }
}

export default PublicRoute;
