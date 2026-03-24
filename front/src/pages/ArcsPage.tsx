import { useEffect, useState } from "react";
import { getPages } from "../api/page.api";
import type { Page } from "../interfaces/page.interface";
import { PagesContainer } from "../components/PageContainer";

export const ArcsPage = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const fetchPage = async () => {
    const data = await getPages();
    setPages(data);
  };
  useEffect(() => {
    fetchPage();
  });

  const arcPages = pages.filter((page) => page.entityType === "ARC")
  return (
    <>
      <PagesContainer pages={arcPages} title="Les Arcs" />
    </>
  );
};