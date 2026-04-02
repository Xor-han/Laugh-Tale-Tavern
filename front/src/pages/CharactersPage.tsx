import { useEffect, useState } from "react";
import { PagesContainer } from "../components/PageContainer";
import type { OnePieceCharacter } from "../interfaces/onePieceCharacter.interface";
import { getCharacters } from "../api/onePieceCharacter.api";

export const CharacterPage = () => {
  const [characters, setCharacters] = useState<OnePieceCharacter[]>([]);

  const fetchCharacter = async () => {
    const data = await getCharacters();
    setCharacters(data);
  };
  useEffect(() => {
    fetchCharacter();
  });
  return (
    <>
      <PagesContainer items={characters} title="Les Personnages" entityType="characters"/>
    </>
  );
};
