import { useEffect, useState } from "react";
import { getPages } from "../api/page.api";
import type { Page } from "../interfaces/page.interface";
import { PagesContainer } from "../components/PageContainer";

export const FruitsPage = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const fetchPage = async () => {
    const data = await getPages();
    setPages(data);
  };
  useEffect(() => {
    fetchPage();
  });

  const fruitPages = pages.filter((page) => page.entityType === "FRUIT")
  return (
    <>
      <PagesContainer pages={fruitPages} title="Les Fruits du Démon" />
    </>
  );
};