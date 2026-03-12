import { Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client"; // Vérifie bien que ce chemin est juste
// 1. Définis l'interface de ce que tu attends de la session
interface SessionUser {
  role: string;
}
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: session, isPending } = useSession();
  console.log("Session complète :", session);

  if (isPending) {
    return <div>Chargement de la session...</div>;
  }
  const user = session?.user as SessionUser | undefined;
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
