import { getPageBySlug } from "../api/page.api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { createComment } from "../api/comment.api";
import type { Comment, CreateComment } from "../interfaces/comment.interface";
import type { DynamicPageData } from "../interfaces/page.interface";
import { User } from "lucide-react";

export const DynamiquePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<DynamicPageData>();
  const [comment, setComment] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getPageBySlug(slug);
        setPage(data);
        if (data.comments) {
          setComment(data.comments);
        }
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const handleCreateComment = async (content: string, parentId?: string) => {
    if (!slug) return;
    if (!content.trim() || !page?.id || !session?.user) {
      console.error("Impossible d'envoyer : page non chargée ou contenu vide");
      return;
    }
    try {
      const data: CreateComment = {
        content: content,
        parentId: parentId,
        pageId: page.id,
      };
      await createComment(data);
      const commentWithAuthor = {
        ...data,
        author: {
          name: session.user.name,
          image: session.user.image,
        },
        replies: [],
      };

      setPage((prevPage: any) => {
        if (!prevPage) return prevPage;

        if (parentId) {
          return {
            ...prevPage,
            comments: prevPage.comments.map((c: any) =>
              c.id === parentId
                ? { ...c, replies: [...(c.replies || []), commentWithAuthor] }
                : c,
            ),
          };
        }

        return {
          ...prevPage,
          comments: [commentWithAuthor, ...prevPage.comments],
        };
      });

      setNewComment("");
      setReplyContent("");
      setActiveReplyId(null);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!page) return <div>404 - Cette page n'existe pas dans Grand Line.</div>;
  const haveDevilFruit = page.character?.devilFruit?.name;
  console.log(page)
  return (
    <>
      <main className="mx-24 my-10 flex flex-col gap-5">
        <div className="flex gap-10">
          <div className="w-4/5 ">
            <h1 className="text-4xl font-black uppercase">{page.title}</h1>
            <div className="mt-6 whitespace-pre-line leading-relaxed w-full">
              {page.content}
            </div>
          </div>
          {page.entityType === "CHARACTER" && (
            <div className="w-1/2 flex flex-col items-center">
              {page?.character?.image?.[0] ? (
                <img
                  src={page.character.image[0].url}
                  alt={page.character.name}
                  className="rounded-2xl "
                />
              ) : (
                <div className="bg-gray-200 h-64 w-full rounded-2xl" />
              )}
              <div className="w-full">
                <p>Nom: {page.character?.name}</p>
                {haveDevilFruit ? (
                  <p>Fruit du démon: {page.character?.devilFruit?.name}</p>
                ) : (
                  <p>Fruit du démon: Aucun Fruit</p>
                )}
                <p>Equipage: {page.character?.equipage?.name}</p>
                <p>Profession: {page.character?.profession}</p>
                <p>Organisation: {page.character?.organisation?.name}</p>
              </div>
            </div>
          )}
          {page.entityType === "FRUIT" && (
            <div className="w-1/2 flex flex-col items-center">
              {page?.devilFruit?.image?.[0] ? (
                <img
                  src={page.devilFruit.image[0].url}
                  alt={page.devilFruit.name}
                  className="rounded-2xl "
                />
              ) : (
                <div className="bg-gray-200 h-64 w-full rounded-2xl" />
              )}
              <p>Type: {page.devilFruit?.type?.name}</p>
              <p>Détenteur du fruit: {page.devilFruit?.onePieceCharacters?.[0].name}</p>
            </div>
          )}
          {page.entityType === "EQUIPAGE" && (
            <div className="w-1/2 flex flex-col items-center">
              {page?.equipage?.image?.[0] ? (
                <img
                  src={page.equipage.image[0].url}
                  alt={page.equipage.name}
                  className="rounded-2xl "
                />
              ) : (
                <div className="bg-gray-200 h-64 w-full rounded-2xl" />
              )}
            </div>
          )}
          {page.entityType === "ARC" && (
            <div className="w-1/2 flex flex-col items-center">
              {page?.arc?.image?.[0] ? (
                <img
                  src={page.arc.image[0].url}
                  alt={page.arc.name}
                  className="rounded-2xl "
                />
              ) : (
                <div className="bg-gray-200 h-64 w-full rounded-2xl" />
              )}
            </div>
          )}
          {page.entityType === "ORGANISATION" && (
            <div className="w-1/2 flex flex-col items-center">
              {page?.organisation?.image?.[0] ? (
                <img
                  src={page.organisation.image[0].url}
                  alt={page.organisation.name}
                  className="rounded-2xl "
                />
              ) : (
                <div className="bg-gray-200 h-64 w-full rounded-2xl" />
              )}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-black uppercase">
            Commentaires ({comment.length || 0})
          </h3>
          <h3 className="text-2xl font-bold mb-6">Laisser un message</h3>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ton commentaire..."
            className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <button
            onClick={() => handleCreateComment(newComment)}
            disabled={!newComment.trim()}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            Publier sur le Wiki
          </button>

          <div className="space-y-8">
            {page?.comments?.map((c) => (
              <div key={c.id}>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {c.author.image ? (
                          <img
                            src={c.author.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={14} className="text-gray-400" />
                        )}
                      </div>
                      <span className="font-bold text-blue-600 text-sm">
                        {c.author.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{c.content}</p>

                  {/* BOUTON REPONDRE */}
                  <button
                    onClick={() =>
                      setActiveReplyId(activeReplyId === c.id ? null : c.id)
                    }
                    className="text-[10px] font-bold text-gray-400 hover:text-blue-600 mt-3 uppercase tracking-wider"
                  >
                    {activeReplyId === c.id ? "Annuler" : "Répondre"}
                  </button>

                  {activeReplyId === c.id && (
                    <div className="mt-4 flex flex-col gap-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Répondre à ${c.author.name}...`}
                        className="w-full p-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={async () => {
                          await handleCreateComment(replyContent, c.id);
                          setReplyContent("");
                          setActiveReplyId(null);
                        }}
                        className="self-end bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
                      >
                        Répondre
                      </button>
                    </div>
                  )}
                </div>

                {/* LES RÉPONSES (Si elles existent) */}
                {c.replies &&
                  c.replies.map((r) => (
                    <div
                      key={r.id}
                      className="ml-10 mt-2 bg-gray-50 p-3 rounded-xl border-l-4 border-blue-200"
                    >
                      <div className="flex justify-between mb-1 text-[11px]">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {r.author.image ? (
                              <img
                                src={r.author.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={12} className="text-gray-400" />
                            )}
                          </div>
                          <span className="font-bold text-gray-600">
                            {r.author.name}
                          </span>
                        </div>
                        <span className="text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{r.content}</p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};
