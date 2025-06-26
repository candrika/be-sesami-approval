import { z } from "zod";

// Validator untuk registrasi dan update user
export const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["User", "Verifikator", "Admin"]).optional()
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
});

export const updateRoleSchema = z.object({
  role: z.enum(["User", "Verifikator", "Admin"])
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter")
});

export const idParamSchema = z.object({
  id: z.string().uuid("ID tidak valid")
});
