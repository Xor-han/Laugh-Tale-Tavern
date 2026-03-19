import { getPageBySlug } from "../api/page.api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const DynamiquePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      try {
        const data = await getPageBySlug(slug);
        console.log("Données reçues du serveur :", data);
        setPage(data);
      } catch (error) {
        console.error("Page introuvable");
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) return <div>Chargement...</div>;
  if (!page) return <div>404 - Cette page n'existe pas dans Grand Line.</div>;

  return (
<main className="max-w-4xl mx-auto p-8">
    <div className="grid gap-3">
      <img src={page.character?.image[0].url} alt="" />
      <p>{page.character?.devilFruit.name}</p>
      <h1 className="text-4xl font-black uppercase">{page.title}</h1>
      <div className="mt-6 whitespace-pre-line leading-relaxed">
        {page.content}
      </div>
    </div>
      <section className="mt-20 pt-10 border-t border-gray-100">
        <h3 className="text-2xl font-bold mb-8">
          Commentaires ({page.comments?.length || 0})
        </h3>
      </section>
    </main>
  );
};
