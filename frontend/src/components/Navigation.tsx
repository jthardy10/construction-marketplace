import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/authSlice";

const Navigation: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <Link to="/projects">Projects</Link>
          {userRole === "client" && <Link to="/projects/create">Create Project</Link>}
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;
