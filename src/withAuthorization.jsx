import React from "react";
import { Navigate } from "react-router-dom";

const withAuthorization = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const userRole = localStorage.getItem("userRole"); // Assuming user role is stored in localStorage

    if (allowedRoles.includes(userRole)) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/" />; // Redirect to login or unauthorized page
    }
  };
};

export default withAuthorization;