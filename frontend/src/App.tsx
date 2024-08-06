import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navigation from "./components/Navigation";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProjectList from "./components/ProjectList";
import ProjectDetails from "./components/ProjectDetails";
import CreateProject from "./components/CreateProject";
import BidList from "./components/BidList";
import CreateBid from "./components/CreateBid";
import UserProfile from "./components/UserProfile";
import { RootState } from "./store";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Construction Marketplace</h1>
        <Navigation />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/projects" element={<PrivateRoute element={<ProjectList />} />} />
          <Route path="/projects/:id" element={<PrivateRoute element={<ProjectDetails />} />} />
          <Route path="/projects/create" element={<PrivateRoute element={<CreateProject />} />} />
          <Route path="/projects/:projectId/bids" element={<PrivateRoute element={<BidList />} />} />
          <Route path="/projects/:projectId/bids/create" element={<PrivateRoute element={<CreateBid />} />} />
          <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="/" element={<Navigate to="/projects" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
