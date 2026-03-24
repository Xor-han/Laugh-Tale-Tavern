import { useEffect, useState } from "react";
import { getPages } from "../api/page.api";
import type { Page } from "../interfaces/page.interface";
import { PagesContainer } from "../components/PageContainer";

export const CharacterPage = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const fetchPage = async () => {
    const data = await getPages();
    setPages(data);
  };
  useEffect(() => {
    fetchPage();
  });

  const characterPages = pages.filter((page) => page.entityType === "CHARACTER")
  return (
    <>
      <PagesContainer pages={characterPages} title="Les Personnages" />
    </>
  );
};
