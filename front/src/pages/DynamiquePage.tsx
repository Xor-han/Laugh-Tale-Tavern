/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { createComment } from "../api/comment.api";
import type { CreateComment } from "../interfaces/comment.interface";
import { User } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const typeToEndpoint: Record<string, string> = {
  characters: "characters",
  devilFruits: "devilFruits",
  arcs: "arcs",
  crews: "crews",
  organisations: "organisations",
};

export const DynamiquePage = () => {
  const { type, slug } = useParams<{ type: string; slug: string }>();
  const [page, setPage] = useState<any>();
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!slug || !type) return;
      const endpoint = typeToEndpoint[type];
      if (!endpoint) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/${endpoint}/${slug}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erreur lors de la récupération");
        const data = await res.json();
        setPage(data);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [type, slug]);

  const handleCreateComment = async (content: string, parentId?: string) => {
    if (!slug) return;
    if (!content.trim() || !page?.id || !session?.user) {
      console.error("Impossible d'envoyer : page non chargée ou contenu vide");
      return;
    }
    const typeToCommentField: Record<string, string> = {
      characters: "onePieceCharacterId",
      devilFruits: "devilFruitId",
      arcs: "arcId",
      crews: "crewId",
      organisations: "organisationId",
    };

    try {
      const data: CreateComment = {
        content: content,
        parentId: parentId,
        ...(type ? { [typeToCommentField[type]]: page.id } : {}),
      };

      const savedComment = await createComment(data);

      const commentWithAuthor = {
        ...savedComment,
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
            comment: prevPage.comment.map((c: any) =>
              c.id === parentId
                ? { ...c, replies: [...(c.replies || []), commentWithAuthor] }
                : c,
            ),
          };
        }

        return {
          ...prevPage,
          comment: [commentWithAuthor, ...prevPage.comment],
        };
      });
      setNewComment("");
      setReplyContent("");
      setActiveReplyId(null);
    } catch (err) {
      console.error("Erreur lors de la création :", err);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!page) return <div>404 - Cette page n'existe pas dans Grand Line.</div>;

  return (
    <>
      <div className="px-10 py-15 flex flex-col gap-5 bg-slate-400 ">
        <div className="flex gap-10 max-lg:flex-col">
          <div className="w-4/5">
            <h1 className="text-4xl font-black uppercase max-md:text-2xl">{page.name}</h1>
            <div className="mt-6 whitespace-pre-line leading-relaxed text-xl max-md:text-lg">
              {page.content}
            </div>
          </div>
          <div className="flex flex-col items-center w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl bg-slate-900">
            <div className="w-full aspect-video bg-slate-800 flex items-center justify-center p-2">
              {page?.image?.[0] ? (
                <img
                  src={page.image[0].url}
                  alt={page.name}
                  className="w-full h-full object-contain rounded-xl shadow-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 p-6">
                  <div className="w-16 h-16 bg-slate-700 rounded-full animate-pulse" />
                  <p className="text-slate-400 font-medium">
                    Image non disponible
                  </p>
                </div>
              )}
            </div>
            <div className="w-full mt-4 p-2 text-white">
              {type === "characters" && (
                <>
                  <p>
                    <span className="font-bold">Nom :</span> {page.name}
                  </p>
                  <p>
                    <span className="font-bold">Fruit du démon :</span>{" "}
                    {page.devilFruit?.name || "Aucun Fruit"}
                  </p>
                  <p>
                    <span className="font-bold">Equipage :</span>{" "}
                    {page.crew?.name}
                  </p>
                  <p>
                    <span className="font-bold">Profession :</span>{" "}
                    {page.profession}
                  </p>
                  <p>
                    <span className="font-bold">Organisation :</span>{" "}
                    {page.organisation?.name}
                  </p>
                </>
              )}
              {type === "devilFruits" && (
                <>
                  <p>Type: {page.type?.name}</p>
                  <p>
                    Détenteur du fruit: {page.onePieceCharacters?.[0]?.name}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-black uppercase">
            Commentaires ({page?.comment?.length || 0})
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
            {page?.comment?.map((c: any) => (
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
                  c.replies.map((r: any) => (
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
      </div>
    </>
  );
};
