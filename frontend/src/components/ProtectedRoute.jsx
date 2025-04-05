import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check login status

  // Redirect to the landing page if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Render the requested component if logged in
  return <Outlet />;
};

export default ProtectedRoute;