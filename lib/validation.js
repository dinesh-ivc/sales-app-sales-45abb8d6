import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Website visit validation schemas
export const websiteVisitSchema = z.object({
  url: z.string().url('Invalid URL format'),
  visitorId: z.string().min(1, 'Visitor ID is required'),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  timestamp: z.date().optional(),
});

// Store visit validation schemas
export const storeVisitSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
  visitorId: z.string().min(1, 'Visitor ID is required'),
  productsViewed: z.array(z.string()).optional(),
  purchaseAmount: z.number().min(0, 'Purchase amount cannot be negative').optional(),
  timestamp: z.date().optional(),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  inStock: z.boolean().optional(),
});

// Generic validation function
export const validateData = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ path: 'unknown', message: 'Validation failed' }] };
  }
};