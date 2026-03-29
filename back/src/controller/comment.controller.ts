import { createCommentShema, updateCommentShema} from "@/dtos/comment.dto";
import { Request, Response } from "express";
import * as commentService from "@/services/comment.service"




export const getAll = async (req: Request, res: Response) => {
    try {
        const comments = await commentService.getAllComment();
        res.json(comments);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};

export const getById = async (req : Request, res : Response) => {
    try {
        const comment = await commentService.getCommentById(req.params.id as string);
        if(!comment){
            return res.status(400).json({message : "Comment not found"})
        };
        res.json(comment);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};


export const create = async (req: Request, res: Response) => {
 try {
    const parsed = createCommentShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const comment = await commentService.createComment(parsed.data, req.userId!);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const update = async (req : Request, res : Response) => {
    try {
        const parsed = updateCommentShema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({message : "Données invalides", errors : parsed.error.issues});
        }
        const comment = await commentService.updateComment(req.params.id as string, req.userId!, parsed.data);
        if(!comment){
            return res.status(404).json({message : "Comment not found"});
        }  
        res.json(comment)   
    } catch (error) {
       res.status(500).json({message : "Erreur server", error}); 
    };
};

export const remove = async (req : Request, res : Response) => {
    try {
        const result = await commentService.deleteComment(String(req.params.id), req.userId!)
        if(!result){
           return res.status(404).json({message : "Comment not found"}); 
        }
        res.status(204).send()
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    }
}