import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "LaceLink",
  description: "Wig marketplace with verified vendors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
