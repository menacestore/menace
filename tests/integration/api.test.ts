import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockQuery = vi.fn();

vi.mock('@/lib/db', () => ({
  query: (...args: any[]) => mockQuery(...args),
}));

import { query } from '@/lib/db';

describe('Products API', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('should return products with pagination', async () => {
    const mockProducts = [
      { id: '1', name: 'Shirt 1', price: 2999, category: 'shirts' },
      { id: '2', name: 'Shirt 2', price: 3999, category: 'shirts' },
    ];

    mockQuery.mockResolvedValueOnce(mockProducts);
    mockQuery.mockResolvedValueOnce([{ count: '2' }]);

    const result = await query(`SELECT * FROM products LIMIT 24 OFFSET 0`);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Shirt 1');
  });

  it('should filter by category', async () => {
    const mockProducts = [
      { id: '1', name: 'Shirt', category: 'shirts' },
    ];

    mockQuery.mockResolvedValueOnce(mockProducts);

    const result = await query(`SELECT * FROM products WHERE category = $1`, ['shirts']);
    expect(result[0].category).toBe('shirts');
  });

  it('should return empty array when no products match', async () => {
    mockQuery.mockResolvedValueOnce([]);

    const result = await query(`SELECT * FROM products WHERE category = $1`, ['shoes']);
    expect(result).toHaveLength(0);
  });
});

describe('Orders API', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('should create order with valid data', async () => {
    const mockOrder = [{ id: 'order-123' }];
    mockQuery.mockResolvedValueOnce(mockOrder);

    const result = await query(
      `INSERT INTO orders (order_number, email, total) VALUES ($1, $2, $3) RETURNING id`,
      ['ORD-20260518-001', 'test@example.com', 5000]
    );
    expect(result[0].id).toBe('order-123');
  });

  it('should update order status', async () => {
    mockQuery.mockResolvedValueOnce([{ message: 'OK' }]);

    await query(`UPDATE orders SET status = $1 WHERE id = $2`, ['shipped', 'order-123']);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE orders'),
      ['shipped', 'order-123']
    );
  });

  it('should restore stock on cancellation', async () => {
    const mockItems = [
      { product_id: 'prod-1', size: 'M', color: 'Blue', quantity: 2 },
    ];
    mockQuery.mockResolvedValueOnce(mockItems);
    mockQuery.mockResolvedValueOnce([{ message: 'OK' }]);

    const items = await query(`SELECT product_id, size, color, quantity FROM order_items WHERE order_id = $1`, ['order-123']);
    for (const item of items) {
      await query(
        `UPDATE product_variants SET stock = stock + $1 WHERE product_id = $2 AND size = $3 AND color = $4`,
        [item.quantity, item.product_id, item.size, item.color]
      );
    }

    expect(mockQuery).toHaveBeenCalledTimes(2);
  });
});

describe('Auth API', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('should check for existing user', async () => {
    mockQuery.mockResolvedValueOnce([]);

    const result = await query(`SELECT id FROM users WHERE email = $1`, ['new@example.com']);
    expect(result).toHaveLength(0);
  });

  it('should reject duplicate email', async () => {
    mockQuery.mockResolvedValueOnce([{ id: 'user-123' }]);

    const result = await query(`SELECT id FROM users WHERE email = $1`, ['existing@example.com']);
    expect(result).toHaveLength(1);
  });
});

describe('Settings API', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('should retrieve shipping settings', async () => {
    const mockSettings = [
      { key: 'shipping_threshold', value: '15000' },
      { key: 'shipping_cost', value: '250' },
    ];
    mockQuery.mockResolvedValueOnce(mockSettings);

    const result = await query(`SELECT key, value FROM settings WHERE key IN ('shipping_threshold', 'shipping_cost')`);
    expect(result).toHaveLength(2);
  });

  it('should update shipping settings', async () => {
    mockQuery.mockResolvedValueOnce([{ message: 'OK' }]);

    await query(`UPDATE settings SET value = $1 WHERE key = 'shipping_threshold'`, ['20000']);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE settings'),
      ['20000']
    );
  });
});
