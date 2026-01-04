type PageProps = {
  params: { id: string };
};

export default async function ProductPage({ params }: PageProps) {
  const id = params.id;

  // example fetch (replace with your real fetch)
  // const product = await getProduct(id);

  return (
    <main style={{ padding: 24 }}>
      <h1>Product Detail</h1>
      <p>Product ID: {id}</p>
    </main>
  );
}
