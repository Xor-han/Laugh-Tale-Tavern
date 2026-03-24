import { Outlet } from "react-router-dom"
import { Footer } from "./components/Footer"
import { Navbar } from "./components/Navbar"
import { authClient } from "./lib/auth-client";

export const Layout = () =>{
    const { data: session } = authClient.useSession();
    return(
        <main>
            <Navbar userId={session?.user.id} userImage={session?.user.image} userName={session?.user.name} session={session ? true : false}/>
            <Outlet/>
            <Footer/>
        </main>
    )
}