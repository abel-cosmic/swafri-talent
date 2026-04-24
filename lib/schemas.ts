import { z } from "zod";

export const roleSchema = z.enum(["superAdmin", "admin", "moderator", "user"]);

export const talentSubmissionSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.email().transform((v) => v.toLowerCase()),
  primarySkill: z.string().trim().min(2).max(80),
  yearsOfExperience: z.coerce.number().int().min(0).max(60),
  description: z.string().trim().min(20).max(500),
});

export const adminLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const talentUpdateSchema = talentSubmissionSchema
  .partial()
  .extend({ status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional() });

export const talentStatusChangeSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: roleSchema,
});

export const setUserRoleSchema = z.object({
  userId: z.string().min(1),
  role: roleSchema,
});
