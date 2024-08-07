import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProjectList from "./components/ProjectList";
import ProjectDetails from "./components/ProjectDetails";
import CreateProject from "./components/CreateProject";
import BidList from "./components/BidList";
import CreateBid from "./components/CreateBid";
import UserProfile from "./components/UserProfile";
import ContractorDashboard from "./components/ContractorDashboard";
import BidComparison from "./components/BidComparison";
import { RootState } from "./store";
import { setUser, setToken, setLoading } from "./store/authSlice";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && user) {
      dispatch(setToken(token));
      dispatch(setUser(user));
    }
    dispatch(setLoading(false));
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/projects" element={<PrivateRoute element={<ProjectList />} />} />
          <Route path="/projects/:id" element={<PrivateRoute element={<ProjectDetails />} />} />
          <Route path="/projects/create" element={<PrivateRoute element={<CreateProject />} />} />
          <Route path="/projects/:projectId/bids" element={<PrivateRoute element={<BidList />} />} />
          <Route path="/projects/:projectId/bids/create" element={<PrivateRoute element={<CreateBid />} />} />
          <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="/contractor/dashboard" element={<PrivateRoute element={<ContractorDashboard />} />} />
          <Route path="/projects/:projectId/bids/compare" element={<PrivateRoute element={<BidComparison />} />} />
          <Route path="/" element={<Navigate to="/projects" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
