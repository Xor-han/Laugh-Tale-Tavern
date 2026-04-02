import { useEffect, useState } from "react";
import { PagesContainer } from "../components/PageContainer";
import type { Organisation } from "../interfaces/organisation.interface";
import { getOrganisations } from "../api/organisation.api";

export const OrganisationsPage = () => {
  const [organisation, setOrganisation] = useState<Organisation[]>([]);

  const fetchOrganisations= async () => {
    const data = await getOrganisations();
    setOrganisation(data);
  };
  useEffect(() => {
    fetchOrganisations();
  });
  return (
    <>
      <PagesContainer items={organisation} title="Les Organisations" entityType="organisations"/>
    </>
  );
};