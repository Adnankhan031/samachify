/**
 * The single way screens reach the catalogue.
 *
 * Today it resolves from the bundled copy of the storefront's catalogue, because
 * Samachify has no `products` table — the website hardcodes the same list and
 * `/api/orders` re-prices from it. When the `products` table ships (see
 * `supabase/003_products.sql`), only this file changes: the screens already await
 * these functions, so nothing above has to move.
 *
 * Everything is async and returns copies for that reason. Don't reach past this
 * module into `src/data/products.ts` from a screen.
 */
import {
  categories as bundledCategories,
  getRecipeForProduct,
  products as bundledProducts,
  type Product,
  type Recipe,
} from '@/data/products';

export type { Product, Recipe };

export interface Category {
  id: string;
  label: string;
}

/** Categories a customer can browse — "all" is a UI affordance, not a category. */
export function listCategories(): Category[] {
  return bundledCategories.filter((c) => c.id !== 'all').map((c) => ({ ...c }));
}

export async function listProducts(): Promise<Product[]> {
  return bundledProducts.slice();
}

export async function getProduct(id: string): Promise<Product | null> {
  return bundledProducts.find((p) => p.id === id) ?? null;
}

export async function listByCategory(categoryId: string): Promise<Product[]> {
  if (categoryId === 'all') return bundledProducts.slice();
  return bundledProducts.filter((p) => p.category === categoryId);
}

export async function getRecipe(productId: string): Promise<Recipe | null> {
  return getRecipeForProduct(productId) ?? null;
}

/**
 * Case-insensitive match across name, subtitle, category, tags and ingredients, so
 * "coconut", "chutney", "vegan" and "tamarind" all find something. With four
 * products this is trivially fast; when the catalogue moves to Postgres this
 * becomes a full-text query behind the same signature.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return bundledProducts.filter((p) => {
    const haystack = [
      p.name,
      p.subtitle,
      p.category,
      p.spiceLevel ?? '',
      p.dietType ?? '',
      ...p.tags,
      ...p.ingredients,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

/**
 * Home's "Best Sellers" rail. There is no sales data in the backend yet, so this is
 * the catalogue in its curated order rather than a computed ranking — deliberately
 * not labelled with fake numbers.
 */
export async function listFeatured(): Promise<Product[]> {
  return bundledProducts.slice();
}
