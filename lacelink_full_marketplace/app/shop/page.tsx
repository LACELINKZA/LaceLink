
import products from '@/data/products';
export default function Shop() {
  return (
    <main>
      <h1>All Products</h1>
      {products.map(p => (
        <a key={p.slug} href={`/shop/${p.slug}`}>
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </a>
      ))}
    </main>
  );
}
