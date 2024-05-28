import React from "react";
import { Navigate, Route, useNavigate } from "react-router-dom";

const PrivateRoute = (children:any) => {
    const navigate = useNavigate();
    // console.log("ooooooooooooooooo");
  const isAuthenticated = localStorage.getItem("user");
  if (!isAuthenticated || isAuthenticated == '' || isAuthenticated == null ) {
    // return <Navigate to="/login" replace={true} />
    navigate(`/login`, { replace: true });
  }
  return children;
};


export default PrivateRoute;