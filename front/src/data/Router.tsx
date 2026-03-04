import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { AuthPage } from "../pages/AuthPage"
import { ArcsPage } from "../pages/ArcsPage"
import { CharacterPage } from "../pages/CharactersPage"
import { CrewsPage } from "../pages/CrewsPage"
import { FruitsPage } from "../pages/Fruits"
import { OrganisationsPage } from "../pages/OrganisationsPage"

export const Router = createBrowserRouter([
    {
        path : "/",
        element: <App/>
    },

    {
        path: "/login",
        element: <AuthPage onAuth={() =>{}}/>
    },

    {
        path: "/arcs",
        element: <ArcsPage/>
    },

    {
        path: "/personnages",
        element: <CharacterPage/>
    },

    {
        path: "/équipages-pirates",
        element: <CrewsPage/>
    },

    {
        path: "/fruits-du-démon",
        element: <FruitsPage/>
    },

    {
        path: "/organisations",
        element: <OrganisationsPage/>
    },

])