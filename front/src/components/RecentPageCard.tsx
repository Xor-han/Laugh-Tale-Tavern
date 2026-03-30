import { PagesContainer } from "./PageContainer";
import { useEffect, useState } from "react";
import { getCharacters } from "../api/onePieceCharacter.api";
import type { OnePieceCharacter } from "../interfaces/onePieceCharacter.interface";
import type { DevilFruit } from "../interfaces/devilFruit.interface";
import { getFruits } from "../api/devilFruits.api";
import type { Arc } from "../interfaces/arc.interface";
import { getArcs } from "../api/arc.api";
import type { Organisation } from "../interfaces/organisation.interface";
import type { Crew } from "../interfaces/equipage.interface";
import { getEquipages } from "../api/equipage.api";
import { getOrganisations } from "../api/organisation.api";

export const RecentItems = () => {
  const [devilFruits, setDevilFruits] = useState<DevilFruit[]>([]);
  const [character, setCharacters] = useState<OnePieceCharacter[]>([]);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [organisation, setOrganisation] = useState<Organisation[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const dataFruit = await getFruits();
      setDevilFruits(dataFruit);
      const dataCharacter = await getCharacters();
      setCharacters(dataCharacter);
      const dataArcs = await getArcs();
      setArcs(dataArcs);
      const dataCrew = await getEquipages();
      setCrew(dataCrew);
      const dataOrganisation = await getOrganisations();
      setOrganisation(dataOrganisation);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Chargement des nouveautés...</div>;
  return (
    <>
      <PagesContainer
        items={character}
        title="Personnages Récents"
        type="characters"
      />
      <PagesContainer items={devilFruits} title="Fruits Récents" type="fruits" />
      <PagesContainer items={arcs} title="Arcs Récents" type="arcs" />
      <PagesContainer items={organisation} title="Organisations Récentes" type="organisations" />
      <PagesContainer items={crew} title="Equipages Récents" type="crews" />
    </>
  );
};
