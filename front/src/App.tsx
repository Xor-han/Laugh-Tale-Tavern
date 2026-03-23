import { CategoryCard } from "./components/CategoryCard";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { RecentPageCard } from "./components/RecentPageCard";
import { authClient } from "./lib/auth-client";

function App() {
  const { data: session } = authClient.useSession();
  return (
    <>
      <Navbar userId={session?.user.id} userImage={session?.user.image} userName={session?.user.name} session={session ? true : false}/>
      <Header/>
      <CategoryCard/>
      <RecentPageCard/>
    </>
  );
}

export default App;
