import React from "react";
import LoginForm from "../components/form/loginForm";
import packageJson from "../../package.json";
import useRedirectIfAuthenticated from "../useRedirectIfAuthenticated"; // Import the custom hook

function Login() {
  useRedirectIfAuthenticated(); // Call the custom hook to redirect if authenticated

  return (
    <>
      <div className="layout login">
        <LoginForm />
        <p className="version">Office login V {packageJson.version}</p>
      </div>
    </>
  );
}

export default Login;
