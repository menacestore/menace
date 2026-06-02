import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.enum(['shirts', 'shoes', 'accessories']),
  featured: z.boolean().optional().default(false),
  newArrival: z.boolean().optional().default(false),
  images: z.array(z.object({
    url: z.string().url(),
    publicId: z.string().optional(),
  })).min(1),
  variants: z.array(z.object({
    size: z.string().min(1),
    color: z.string().min(1),
    colorId: z.string().uuid().optional(),
    stock: z.number().int().min(0).default(0),
  })).min(1),
});

export const orderSchema = z.object({
  email: z.string().email(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    size: z.string().min(1),
    color: z.string().min(1),
    quantity: z.number().int().min(1),
    price: z.number().positive(),
  })).min(1),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    apartment: z.string().optional(),
    city: z.string().min(1),
    province: z.string().min(1),
  }),
  paymentMethod: z.enum(['cod']).default('cod'),
  userId: z.string().uuid().nullable().optional(),
});

export const orderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});

export const settingsSchema = z.object({
  shipping_threshold: z.number().positive(),
  shipping_cost: z.number().positive(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});
