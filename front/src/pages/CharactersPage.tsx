import { useEffect, useState } from "react";
import { getPages } from "../api/page.api";
import { PagesContainer } from "../components/PageContainer";
import type { OnePieceCharacter } from "../interfaces/onePieceCharacter.interface";

export const CharacterPage = () => {
  const [characters, setCharacters] = useState<OnePieceCharacter[]>([]);

  const fetchCharacter = async () => {
    const data = await getPages();
    setCharacters(data);
  };
  useEffect(() => {
    fetchCharacter();
  });
  return (
    <>
      <PagesContainer items={characters} title="Les Personnages" />
    </>
  );
};
