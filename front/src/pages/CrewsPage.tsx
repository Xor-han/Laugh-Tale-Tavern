import { useEffect, useState } from "react";
import { getPages } from "../api/page.api";
import type { Page } from "../interfaces/page.interface";
import { PagesContainer } from "../components/PageContainer";

export const CrewsPage = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const fetchPage = async () => {
    const data = await getPages();
    setPages(data);
  };
  useEffect(() => {
    fetchPage();
  });

  const crewPages = pages.filter((page) => page.entityType === "EQUIPAGE")
  return (
    <>
      <PagesContainer pages={crewPages} title="Les Equipages" />
    </>
  );
};