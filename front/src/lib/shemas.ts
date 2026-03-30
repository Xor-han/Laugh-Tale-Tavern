import z from "zod"

export const signUpSchema = z
    .object({
        name: z.string().min(1, "Le nom est requis"),
        email: z.string().email("Email invalide"),
        password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: z.string().min(1, "La confirmation est requise"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const CharacterShema = z.object({
    name: z.string().min(1, "Le nom du personnage est requis").max(50, "Le nom du personnage ne peut pas dépasser 50 caractères"),
    content: z.string().min(1,"Le contenu est requis").max(500, "Le contenu ne peut pas dépasser 500 caractères"),
    
})


