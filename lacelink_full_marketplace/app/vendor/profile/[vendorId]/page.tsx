
export default function VendorProfile({ params }: any) {
  return (
    <main>
      <h1>Vendor Profile: {params.vendorId}</h1>
      <p>Listings and verified reviews.</p>
    </main>
  );
}
