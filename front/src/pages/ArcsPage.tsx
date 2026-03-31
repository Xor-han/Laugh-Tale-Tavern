import { useEffect, useState } from "react";
import { PagesContainer } from "../components/PageContainer";
import type { Arc } from "../interfaces/arc.interface";
import { getArcs } from "../api/arc.api";

export const ArcsPage = () => {
  const [arcs, setArcs] = useState<Arc[]>([]);

  const fetchArcs= async () => {
    const data = await getArcs();
    setArcs(data);
  };
  useEffect(() => {
    fetchArcs();
  });
  return (
    <>
      <PagesContainer items={arcs} title="Les Arcs" type="arcs"/>
    </>
  );
};