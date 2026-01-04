type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main style={{ padding: 24 }}>
      <h1>Product Detail</h1>
      <p>Product ID: {id}</p>
    </main>
  );
}
