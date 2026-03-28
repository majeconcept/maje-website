import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z.string().min(2, "Prénom requis (min. 2 caractères)"),
  lastName: z.string().min(2, "Nom requis (min. 2 caractères)"),
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Format invalide (ex: 0612345678)")
    .optional()
    .or(z.literal("")),
  company: z.string().optional(),
  needType: z.enum(
    ["serigraphie", "broderie", "dtf", "flocage", "transfert", "marquage-textile", "autre"],
    { required_error: "Veuillez sélectionner un type de besoin" }
  ),
  message: z.string().min(10, "Message trop court (min. 10 caractères)"),
  configuratorSummary: z.string().optional(),
  // Honeypot — must stay empty (hidden from humans, filled by bots)
  website: z.string().max(0, "Champ invalide").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
