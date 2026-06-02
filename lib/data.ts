export type Category = 'shirts' | 'shoes' | 'accessories';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorId?: string;
  hex?: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  featured?: boolean;
  newArrival?: boolean;
  createdAt?: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchResponse {
  data: Product[];
  meta: {
    total: number;
    query: string;
  };
}


