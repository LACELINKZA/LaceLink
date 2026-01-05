import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

export const metadata = {
  title: "LaceLink Marketplace",
  description: "Marketplace with Stripe Connect payouts (DB-backed).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <footer className="footer">© {new Date().getFullYear()} LaceLink</footer>
        </Providers>
      </body>
    </html>
  );
}
