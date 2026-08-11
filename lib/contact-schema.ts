import { z } from "zod";

/**
 * Shared by the contact form and the API route so client and server validation
 * can never drift apart. Upper bounds keep oversized payloads out of the sheet.
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Please enter a valid email").max(200),
  phone: z.string().max(40).optional(),
  company: z.string().max(160).optional(),
  service: z.string().max(80).optional(),
  budget: z.string().max(80).optional(),
  message: z
    .string()
    .min(10, "Please describe your project (10+ characters)")
    .max(5000, "Please keep your message under 5000 characters"),
  /**
   * Honeypot. Real users never see this field, so any value means a bot.
   * Deliberately permissive: the API route inspects it and answers with a
   * success response so bots can't tell they were filtered.
   */
  website: z.string().max(200).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
