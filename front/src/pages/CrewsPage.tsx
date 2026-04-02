import { useEffect, useState } from "react";
import { PagesContainer } from "../components/PageContainer";
import type { Crew } from "../interfaces/equipage.interface";
import { getCrews } from "../api/crew.api";

export const CrewsPage = () => {
  const [crews, setCrews] = useState<Crew[]>([]);

  const fetchCrews = async () => {
    const data = await getCrews();
    setCrews(data);
  };
  useEffect(() => {
    fetchCrews();
  });
  return (
    <>
      <PagesContainer items={crews} title="Les Equipages" entityType="crews"/>
    </>
  );
};
