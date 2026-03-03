import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { AuthPage } from "../pages/AuthPage"

export const Router = createBrowserRouter([
    {
        path : "/",
        element: <App/>
    },

    {
        path: "/login",
        element: <AuthPage onAuth={() =>{}}/>
    }
])