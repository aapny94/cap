import React from "react";
import packageJson from "../../package.json";
import ResetPasswordForm from "../components/form/resetPasswordForm";

function ResetPassword() {

  return (
    <>
      <div className="layout login">
        <ResetPasswordForm />
        <p className="version">Office login V {packageJson.version}</p>
      </div>
    </>
  );
}

export default ResetPassword;
