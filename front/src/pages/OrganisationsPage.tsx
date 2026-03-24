import { useEffect, useState } from "react";
import { getPages } from "../api/page.api";
import type { Page } from "../interfaces/page.interface";
import { PagesContainer } from "../components/PageContainer";

export const OrganisationsPage = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const fetchPage = async () => {
    const data = await getPages();
    setPages(data);
  };
  useEffect(() => {
    fetchPage();
  });

  const organisationPages = pages.filter((page) => page.entityType === "ORGANISATION")
  return (
    <>
      <PagesContainer pages={organisationPages} title="Les Organisation" />
    </>
  );
};