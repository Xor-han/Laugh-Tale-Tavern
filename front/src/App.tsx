import { Navbar } from "./components/Navbar";
import { authClient } from "./lib/auth-client";

function App() {
  const { data: session } = authClient.useSession();
  return (
    <>
      <Navbar userId={session?.user.id} userImage={session?.user.image} userName={session?.user.name} session={session ? true : false}/>
    </>
  );
}

export default App;
