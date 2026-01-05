export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <header style={{padding:20,fontWeight:'bold'}}>LaceLink</header>
        {children}
        <footer style={{padding:20}}>© LaceLink</footer>
      </body>
    </html>
  );
}