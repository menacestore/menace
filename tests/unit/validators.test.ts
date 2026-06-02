import { describe, it, expect } from 'vitest';
import { productSchema, orderSchema, orderStatusSchema, settingsSchema, registerSchema } from '@/lib/validators';

describe('productSchema', () => {
  it('should validate a valid product', () => {
    const validProduct = {
      name: 'Test Shirt',
      description: 'A nice shirt',
      price: 2999,
      category: 'shirts',
      images: [{ url: 'https://example.com/img.jpg' }],
      variants: [{ size: 'M', color: 'Blue', stock: 10 }],
    };
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const invalid = {
      name: '',
      description: 'Test',
      price: 100,
      category: 'shirts',
      images: [{ url: 'https://example.com/img.jpg' }],
      variants: [{ size: 'M', color: 'Blue', stock: 5 }],
    };
    const result = productSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject negative price', () => {
    const invalid = {
      name: 'Test',
      description: 'Test',
      price: -10,
      category: 'shirts',
      images: [{ url: 'https://example.com/img.jpg' }],
      variants: [{ size: 'M', color: 'Blue', stock: 5 }],
    };
    const result = productSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject invalid category', () => {
    const invalid = {
      name: 'Test',
      description: 'Test',
      price: 100,
      category: 'invalid',
      images: [{ url: 'https://example.com/img.jpg' }],
      variants: [{ size: 'M', color: 'Blue', stock: 5 }],
    };
    const result = productSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject empty images array', () => {
    const invalid = {
      name: 'Test',
      description: 'Test',
      price: 100,
      category: 'shirts',
      images: [],
      variants: [{ size: 'M', color: 'Blue', stock: 5 }],
    };
    const result = productSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should default featured and newArrival to false', () => {
    const product = {
      name: 'Test',
      description: 'Test',
      price: 100,
      category: 'shirts',
      images: [{ url: 'https://example.com/img.jpg' }],
      variants: [{ size: 'M', color: 'Blue', stock: 5 }],
    };
    const result = productSchema.safeParse(product);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(false);
      expect(result.data.newArrival).toBe(false);
    }
  });
});

describe('orderSchema', () => {
  it('should validate a valid order', () => {
    const validOrder = {
      email: 'test@example.com',
      items: [{
        productId: '123e4567-e89b-12d3-a456-426614174000',
        size: 'M',
        color: 'Blue',
        quantity: 2,
        price: 2999,
      }],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Lahore',
        province: 'Punjab',
      },
    };
    const result = orderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalid = {
      email: 'not-an-email',
      items: [{
        productId: '123e4567-e89b-12d3-a456-426614174000',
        size: 'M',
        color: 'Blue',
        quantity: 1,
        price: 100,
      }],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Lahore',
        province: 'Punjab',
      },
    };
    const result = orderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject empty items', () => {
    const invalid = {
      email: 'test@example.com',
      items: [],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Lahore',
        province: 'Punjab',
      },
    };
    const result = orderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject quantity less than 1', () => {
    const invalid = {
      email: 'test@example.com',
      items: [{
        productId: '123e4567-e89b-12d3-a456-426614174000',
        size: 'M',
        color: 'Blue',
        quantity: 0,
        price: 100,
      }],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Lahore',
        province: 'Punjab',
      },
    };
    const result = orderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should default paymentMethod to cod', () => {
    const order = {
      email: 'test@example.com',
      items: [{
        productId: '123e4567-e89b-12d3-a456-426614174000',
        size: 'M',
        color: 'Blue',
        quantity: 1,
        price: 100,
      }],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Lahore',
        province: 'Punjab',
      },
    };
    const result = orderSchema.safeParse(order);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.paymentMethod).toBe('cod');
    }
  });
});

describe('orderStatusSchema', () => {
  it('should validate valid status', () => {
    const result = orderStatusSchema.safeParse({
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'shipped',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid status', () => {
    const result = orderStatusSchema.safeParse({
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid UUID', () => {
    const result = orderStatusSchema.safeParse({
      orderId: 'not-a-uuid',
      status: 'pending',
    });
    expect(result.success).toBe(false);
  });
});

describe('settingsSchema', () => {
  it('should validate valid settings', () => {
    const result = settingsSchema.safeParse({
      shipping_threshold: 15000,
      shipping_cost: 250,
    });
    expect(result.success).toBe(true);
  });

  it('should reject negative values', () => {
    const result = settingsSchema.safeParse({
      shipping_threshold: -100,
      shipping_cost: 250,
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('should validate valid registration', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'securepassword123',
      name: 'John Doe',
    });
    expect(result.success).toBe(true);
  });

  it('should reject short password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
      name: 'John Doe',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-email',
      password: 'securepassword123',
      name: 'John Doe',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'securepassword123',
      name: '',
    });
    expect(result.success).toBe(false);
  });
});
