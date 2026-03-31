import { CategoryCard } from "./components/CategoryCard";
import { Header } from "./components/Header";
import { PagesContainer } from "./components/PageContainer";

function App() {
  return (
    <>
      <Header/>
      <CategoryCard/>
      <PagesContainer title="Articles récents" />
    </>
  );
}

export default App;
