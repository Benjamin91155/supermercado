import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.")
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.")
});

export const categorySchema = z.object({
  name: z.string().min(2, "El nombre de categoría es obligatorio."),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url("URL inválida.").optional().or(z.literal(""))
});

export const categoryUpdateSchema = categorySchema.partial();

export const productSchema = z.object({
  name: z.string().min(2, "El nombre de producto es obligatorio."),
  price: z.number().nonnegative("El precio debe ser positivo."),
  categoryId: z.string().min(1, "La categoría es obligatoria."),
  stock: z.number().int().nonnegative("El stock debe ser positivo."),
  imageUrl: z.string().url("URL inválida.").optional().or(z.literal("")),
  description: z.string().min(10, "La descripción debe ser más extensa."),
  isFeatured: z.boolean().optional(),
  isOffer: z.boolean().optional()
});

export const productUpdateSchema = productSchema.partial();

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Producto inválido."),
        quantity: z.number().int().positive("Cantidad inválida.")
      })
    )
    .min(1, "El pedido debe incluir productos."),
  paymentMethod: z.enum(["cash", "card", "transfer"]).optional(),
  branch: z.enum(["central", "north"]).optional(),
  fulfillment: z.enum(["delivery", "pickup"]).optional(),
  scheduledSlot: z.string().min(3, "Horario invalido.").optional(),
  deliveryAddress: z.string().min(5, "Direccion invalida.").optional()
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "cancelled"])
});
