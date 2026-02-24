import type {Comment, CommentUpdate, CreateComment} from "../interfaces/comment.interface"

const API_URL = "http://localhost:3000"

export const getComments = async (): Promise<Comment[]> => {
    const res = await fetch(`${API_URL}/comments`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des commentaires");
    return res.json();
};

export const getCommentById = async (id: string): Promise<Comment> => {
    const res = await fetch(`${API_URL}/comments/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la récupération du commentaire");
    return res.json();
};

export const createComment = async (comment: CreateComment): Promise<Comment> => {
    const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error("Erreur lors de la création du commentaire");
    return res.json();
};

export const putComment = async (id: string, comment: CreateComment): Promise<Comment> => {
    const res = await fetch(`${API_URL}/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error("Erreur lors du remplacement du commentaire");
    return res.json();
};

export const updateComment = async (id: string, comment: CommentUpdate): Promise<Comment> => {
    const res = await fetch(`${API_URL}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification du commentaire");
    return res.json();
};

export const deleteComment = async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/comments/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression du commentaire");
};
