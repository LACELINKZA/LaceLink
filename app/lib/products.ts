import { supabase } from "./supabaseClient";
import { productsSeed, type Product } from "./productsSeed";

type ProductRow = {
  id: string;
  title: string;
  price: number;
  length: string | null;
  texture: string | null;
  lace: string | null;
  image_url: string | null;
  description: string | null;
};

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return productsSeed;

  return (data as ProductRow[]).map((r) => ({
    id: r.id,
    title: r.title,
    price: r.price,
    length: r.length ?? undefined,
    texture: r.texture ?? undefined,
    lace: r.lace ?? undefined,
    imageUrl: r.image_url || productsSeed[0]?.imageUrl || "",
    description: r.description ?? undefined,
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    const fallback = productsSeed.find((p) => p.id === id);
    return fallback ?? null;
  }

  const r = data as ProductRow;
  return {
    id: r.id,
    title: r.title,
    price: r.price,
    length: r.length ?? undefined,
    texture: r.texture ?? undefined,
    lace: r.lace ?? undefined,
    imageUrl: r.image_url || productsSeed[0]?.imageUrl || "",
    description: r.description ?? undefined,
  };
}
