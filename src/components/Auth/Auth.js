import { UserAuth } from "../../context/AuthContextProvide";
import "./Auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export const Auth = () => {
  const { signInWithGoogle } = UserAuth();

  const signIn = async () => {
    signInWithGoogle();
  };

  return (
    <div className="auth bg-dark ">
      <h3 className="signInTitle">Sign in with Google</h3>
      <button className="signInButton " onClick={signIn}>
        Sign in with Google
        <FontAwesomeIcon className="icon" icon={faGoogle} />
      </button>
    </div>
  );
};
