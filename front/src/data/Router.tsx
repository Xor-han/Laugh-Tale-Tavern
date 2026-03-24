import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { AuthPage } from "../pages/AuthPage";
import { ArcsPage } from "../pages/ArcsPage";
import { CharacterPage } from "../pages/CharactersPage";
import { CrewsPage } from "../pages/CrewsPage";
import { FruitsPage } from "../pages/Fruits";
import { OrganisationsPage } from "../pages/OrganisationsPage";
import { ProtectedRoute } from "../middleware/middleware";
import { AdminDashboard } from "../pages/AdminDashboard";
import { ProfilePage } from "../pages/ProfilePage";
import { DynamiquePage } from "../pages/DynamiquePage";
import { Layout } from "../Layout";

export const Router = createBrowserRouter([
  {
    element: <Layout />,
    children : [
      {
        path: "/",
        element: <App />,
      },

      {
        path: "/arcs",
        element: <ArcsPage />,
      },

      {
        path: "/personnages",
        element: <CharacterPage />,
      },

      {
        path: "/équipages-pirates",
        element: <CrewsPage />,
      },

      {
        path: "/fruits-du-démon",
        element: <FruitsPage />,
      },

      {
        path: "/organisations",
        element: <OrganisationsPage />,
      },
      {
        path: "/:slug",
        element: <DynamiquePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthPage onAuth={() => {}} />,
  },

  {
    path: "/profile/:slug",
    element: <ProfilePage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);
