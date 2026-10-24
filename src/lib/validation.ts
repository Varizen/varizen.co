import { z } from "zod";

export const contactSchema = z.object({
  reason: z.enum(["business", "security", "privacy", "support", "partnerships", "investment", "product"]),
  name: z.string().trim().min(2, "Enter your name.").max(100),
  organization: z.string().trim().min(2, "Enter your organization.").max(150),
  role: z.string().trim().min(2, "Enter your role.").max(100),
  email: z.email("Enter a valid email address.").max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(30).refine((value) => !value || /^[+()\d\s.-]+$/.test(value), "Use a valid phone number.").optional(),
  capability: z.string().trim().max(100).optional(),
  project: z.string().trim().max(100).optional(),
  message: z.string().trim().min(20, "Tell us a little more (at least 20 characters).").max(4000),
  website: z.string().max(0).optional().default(""),
  consent: z.literal(true, { error: "Please confirm that we may review your enquiry." }),
});
export type ContactInput = z.infer<typeof contactSchema>;
export const uuidSchema = z.uuid();
export const emailSchema = z.email().max(254).transform((value) => value.toLowerCase());
export const passwordSchema = z.string().min(14).max(128);
