import products from '@/data/products';
export default function Product({ params }: any) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) return <div>Not found</div>;
  return <main><h1>{product.name}</h1><p>{product.description}</p></main>;
}