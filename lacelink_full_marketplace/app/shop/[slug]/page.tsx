
import products from '@/data/products';
import ReviewSection from '@/components/ReviewSection';

export default function Product({ params }: any) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) return <div>Not found</div>;
  return (
    <main>
      <h1>{product.name}</h1>
      <img src={product.images[0]} width="300" />
      <p>{product.description}</p>
      <button>Checkout (Stripe ready)</button>
      <ReviewSection />
    </main>
  );
}
