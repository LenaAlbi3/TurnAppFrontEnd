import { Redirect } from "wouter";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component {...rest} />;
}