import { useEffect, useState } from "react";
import { PagesContainer } from "../components/PageContainer";
import type { DevilFruit } from "../interfaces/devilFruit.interface";
import { getFruits } from "../api/devilFruits.api";

export const FruitsPage = () => {
  const [devilFruits, setFruits] = useState<DevilFruit[]>([]);

  const fetchFruits = async () => {
    const data = await getFruits();
    setFruits(data);
  };
  useEffect(() => {
    fetchFruits();
  });
  return (
    <>
      <PagesContainer items={devilFruits} title="Les Fruits du Démon" entityType="devilFruits"/>
    </>
  );
};