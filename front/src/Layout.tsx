import { Outlet } from "react-router-dom"
import { Footer } from "./components/Footer"
import { Navbar } from "./components/Navbar"
import { authClient } from "./lib/auth-client";

export const Layout = () =>{
    const { data: session } = authClient.useSession();
    return(
      <div className="flex flex-col min-h-screen">
      <Navbar 
        userId={session?.user.id} 
        userImage={session?.user.image} 
        userName={session?.user.name} 
        session={session ? true : false}
      />
      <main className="grow bg-slate-400">
        <Outlet />
      </main>
      
      <Footer />
    </div>
    )
}